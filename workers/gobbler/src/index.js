import {
  CODE_RE,
  applyAction,
  createGame,
  idleExpired,
  joinGame,
  makeRng,
  nextAlarm,
  playerByToken,
  tick,
  viewFor,
} from "./game.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export class GobblerRoom {
  constructor(ctx) {
    this.ctx = ctx;
    this.game = null;
    this.chain = Promise.resolve();
    this.ready = ctx.blockConcurrencyWhile(async () => {
      this.game = await ctx.storage.get("game");
    });
  }

  async ensure() {
    await this.ready;
  }

  enqueue(task) {
    const run = this.chain.then(task, task);
    this.chain = run.then(() => undefined, () => undefined);
    return run;
  }

  async fetch(request) {
    await this.ensure();
    return this.enqueue(() => this.route(request));
  }

  async route(request) {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") === "websocket") return this.upgrade(url);
    if (request.method === "POST" && url.pathname === "/create") return this.create(request);
    if (request.method === "POST" && url.pathname === "/join") return this.join(request);
    if (request.method === "GET" && url.pathname === "/state") return this.state(url);
    if (request.method === "POST" && url.pathname === "/action") return this.action(request);
    return json({ error: "Not found." }, 404);
  }

  refreshPresence() {
    if (!this.game) return false;
    const open = new Set();
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.readyState !== 1) continue;
      const playerId = ws.deserializeAttachment()?.playerId;
      if (playerId) open.add(playerId);
    }
    let changed = false;
    for (const pid of this.game.playerOrder) {
      const next = open.has(pid);
      if (!!this.game.players[pid].connected !== next) {
        this.game.players[pid].connected = next;
        changed = true;
      }
    }
    return changed;
  }

  async persist() {
    if (!this.game) return;
    this.game.rev += 1;
    this.game.updatedAt = Date.now();
    await this.ctx.storage.put("game", this.game);
    await this.schedule();
  }

  async schedule() {
    if (!this.game) return;
    const when = nextAlarm(this.game, Date.now());
    if (when == null) return;
    await this.ctx.storage.setAlarm(Math.max(when, Date.now() + 250));
  }

  async expireIfNeeded(now) {
    if (!this.game || !idleExpired(this.game, now)) return false;
    this.game = null;
    await this.ctx.storage.deleteAll();
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.close(1000, "expired"); } catch { /* already closed */ }
    }
    return true;
  }

  async mutate(playerId, action) {
    const now = Date.now();
    if (await this.expireIfNeeded(now)) {
      return { ok: false, error: "This table has been cleared.", changed: false, notes: {}, empty: false };
    }
    const rng = makeRng();
    const presence = this.refreshPresence();
    const result = applyAction(this.game, playerId, action, now, rng);
    if (result.empty) {
      this.game = null;
      await this.ctx.storage.deleteAll();
      return result;
    }
    if (result.changed || presence) await this.persist();
    return result;
  }

  broadcast() {
    if (!this.game) return;
    const now = Date.now();
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.readyState !== 1) continue;
      const playerId = ws.deserializeAttachment()?.playerId;
      if (!playerId) continue;
      try {
        ws.send(JSON.stringify({ type: "state", view: viewFor(this.game, playerId, now) }));
      } catch { /* socket closing */ }
    }
  }

  sendTo(playerId, message) {
    const raw = JSON.stringify(message);
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.readyState !== 1) continue;
      if (ws.deserializeAttachment()?.playerId !== playerId) continue;
      try { ws.send(raw); } catch { /* ignore */ }
    }
  }

  async create(request) {
    if (this.game) return json({ error: "That code is taken. Try again." }, 409);
    const body = await readBody(request);
    const created = createGame({ code: body.code, hostName: body.name, now: Date.now() });
    if (!created.ok) return json({ error: created.error }, 400);
    this.game = created.game;
    await this.persist();
    return json({
      code: this.game.code,
      playerId: created.player.id,
      token: created.player.token,
      name: created.player.name,
      host: true,
    });
  }

  async join(request) {
    const now = Date.now();
    if (await this.expireIfNeeded(now) || !this.game) {
      return json({ error: "No table with that code. Check the letters." }, 404);
    }
    const body = await readBody(request);
    const joined = joinGame(this.game, body.name, now);
    if (!joined.ok) return json({ error: joined.error }, 400);
    await this.persist();
    this.broadcast();
    return json({
      code: this.game.code,
      playerId: joined.player.id,
      token: joined.player.token,
      name: joined.player.name,
      host: false,
    });
  }

  async state(url) {
    const now = Date.now();
    if (await this.expireIfNeeded(now) || !this.game) {
      return json({ error: "No table with that code. Check the letters." }, 404);
    }
    this.refreshPresence();
    const changed = tick(this.game, now, makeRng());
    if (changed) await this.persist();
    const player = playerByToken(this.game, url.searchParams.get("token"));
    if (!player) return json({ error: "This phone is not on that table." }, 401);
    if (this.refreshPresence() || changed) await this.persist();
    return json({ view: viewFor(this.game, player.id, now) });
  }

  async action(request) {
    if (!this.game) return json({ error: "No table with that code. Check the letters." }, 404);
    const body = await readBody(request);
    const player = playerByToken(this.game, body.token);
    if (!player) return json({ error: "This phone is not on that table." }, 401);
    const result = await this.mutate(player.id, body);
    if (!this.game) return json({ ok: true, cleared: true });
    this.broadcast();
    for (const [pid, text] of Object.entries(result.notes || {})) {
      if (pid !== player.id) this.sendTo(pid, { type: "notice", text });
    }
    if (!result.ok) return json({ error: result.error, view: viewFor(this.game, player.id, Date.now()) }, 400);
    return json({
      ok: true,
      view: viewFor(this.game, player.id, Date.now()),
      notice: result.notes && result.notes[player.id] ? result.notes[player.id] : null,
    });
  }

  async upgrade(url) {
    const now = Date.now();
    if (await this.expireIfNeeded(now) || !this.game) {
      return json({ error: "No table with that code. Check the letters." }, 404);
    }
    const player = playerByToken(this.game, url.searchParams.get("token"));
    if (!player) return json({ error: "This phone is not on that table." }, 401);
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ playerId: player.id });
    player.connected = true;
    const ticked = tick(this.game, now, makeRng());
    if (ticked || true) await this.persist();
    this.broadcast();
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws, raw) {
    await this.ensure();
    return this.enqueue(() => this.onMessage(ws, raw));
  }

  async onMessage(ws, raw) {
    if (!this.game) {
      try { ws.send(JSON.stringify({ type: "error", text: "This table has been cleared." })); } catch { /* ignore */ }
      return;
    }
    let msg;
    try {
      const text = typeof raw === "string" ? raw : new TextDecoder().decode(raw);
      msg = JSON.parse(text);
    } catch {
      return;
    }
    const playerId = ws.deserializeAttachment()?.playerId;
    if (!playerId) return;
    if (msg.type === "ping") {
      try { ws.send(JSON.stringify({ type: "pong", serverNow: Date.now() })); } catch { /* ignore */ }
      return;
    }
    const result = await this.mutate(playerId, msg);
    if (!this.game) {
      try { ws.close(1000, "cleared"); } catch { /* ignore */ }
      return;
    }
    this.broadcast();
    if (!result.ok) {
      try { ws.send(JSON.stringify({ type: "error", text: result.error })); } catch { /* ignore */ }
    }
    for (const [pid, text] of Object.entries(result.notes || {})) {
      this.sendTo(pid, { type: "notice", text });
    }
  }

  async webSocketClose() {
    await this.ensure();
    return this.enqueue(async () => {
      if (!this.game) return;
      const changed = this.refreshPresence();
      if (changed) {
        await this.persist();
        this.broadcast();
      }
    });
  }

  async webSocketError(ws) {
    try { ws.close(1011, "error"); } catch { /* ignore */ }
  }

  async alarm() {
    await this.ensure();
    return this.enqueue(() => this.onAlarm());
  }

  async onAlarm() {
    const now = Date.now();
    if (await this.expireIfNeeded(now)) return;
    if (!this.game) return;
    this.refreshPresence();
    const changed = tick(this.game, now, makeRng());
    if (changed || idleExpired(this.game, now)) {
      if (idleExpired(this.game, now)) {
        await this.expireIfNeeded(now);
        return;
      }
      await this.persist();
      this.broadcast();
      return;
    }
    await this.schedule();
  }
}

function makeCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

function roomCode(url) {
  const parts = url.pathname.split("/").filter(Boolean);
  // /api/gobbler/rooms/:code/...
  const idx = parts.indexOf("rooms");
  if (idx === -1 || !parts[idx + 1]) return null;
  return parts[idx + 1].toUpperCase();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/gobbler/health") return json({ ok: true, service: "gobbler" });
    if (!url.pathname.startsWith("/api/gobbler")) {
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return new Response("Not found", { status: 404 });
    }
    if (!env.ROOMS) return json({ error: "The game table is not configured yet." }, 503);

    if (url.pathname === "/api/gobbler/rooms" && request.method === "POST") {
      const body = await readBody(request);
      for (let i = 0; i < 6; i++) {
        const code = makeCode();
        const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
        const res = await stub.fetch("https://room/create", {
          method: "POST",
          body: JSON.stringify({ name: body.name, code }),
        });
        if (res.status !== 409) return res;
      }
      return json({ error: "Could not open a table. Try again." }, 503);
    }

    const code = roomCode(url);
    if (!code || !CODE_RE.test(code)) return json({ error: "That room code does not look right." }, 400);
    const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
    const suffix = url.pathname.endsWith("/join")
      ? "/join"
      : url.pathname.endsWith("/state")
        ? "/state"
        : url.pathname.endsWith("/action")
          ? "/action"
          : url.pathname.endsWith("/ws")
            ? "/ws"
            : null;
    if (!suffix) return json({ error: "Not found." }, 404);
    const forward = new URL(`https://room${suffix}`);
    forward.search = url.search;
    return stub.fetch(new Request(forward.toString(), request));
  },
};
