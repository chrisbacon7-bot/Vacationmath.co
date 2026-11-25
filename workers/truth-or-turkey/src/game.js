import { THEMES } from "./themes.js";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 12;
export const DEFEND_MS = 30_000;
export const CODE_RE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/;

const BLOCKED = ["fuck", "shit", "bitch", "asshole", "cunt", "nigger", "faggot", "slut"];

export function makeRng(random = Math.random) {
  return {
    int(n) {
      return Math.floor(random() * n);
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = this.int(i + 1);
        const tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a;
    },
  };
}

export function seedRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function id() {
  return crypto.randomUUID();
}

function token() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function cleanName(raw) {
  const name = String(raw || "").replace(/\s+/g, " ").trim();
  if (name.length < 1 || name.length > 20) return { error: "Use a name between 1 and 20 characters." };
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .'-]*$/u.test(name)) return { error: "Use letters and numbers in the name." };
  if (BLOCKED.some((w) => name.toLowerCase().includes(w))) return { error: "Pick a name you would say at the kids' table." };
  return { name };
}

function cleanStatement(raw) {
  const text = String(raw || "").replace(/\s+/g, " ").trim();
  if (text.length < 3 || text.length > 160) return { error: "Keep each one between a few words and two sentences." };
  if (BLOCKED.some((w) => text.toLowerCase().includes(w))) return { error: "Keep it friendly. Kids are at the table." };
  return { text };
}

function makePlayer(name, now) {
  return {
    id: id(),
    name,
    token: token(),
    joinedAt: now,
    connected: false,
    kicked: false,
    playFromRound: 0,
    points: 0,
    correctGuesses: 0,
    fooled: 0,
  };
}

function pushLog(game, now, text) {
  game.logSeq = (game.logSeq || 0) + 1;
  game.log.push({ id: game.logSeq, t: now, text });
  if (game.log.length > 40) game.log.splice(0, game.log.length - 40);
}

function listNames(names) {
  if (names.length <= 1) return names[0] || "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function canManage(game, playerId) {
  if (!game.players[playerId] || game.players[playerId].kicked) return false;
  if (game.hostId === playerId) return true;
  const host = game.players[game.hostId];
  return !host || !host.connected || host.kicked;
}

function activeIds(game) {
  return game.playerOrder.filter((pid) => game.players[pid] && !game.players[pid].kicked);
}

function playingIds(game) {
  return activeIds(game).filter((pid) => (game.players[pid].playFromRound || 0) <= game.roundIndex);
}

function theme(game) {
  return THEMES[game.roundIndex] || THEMES[0];
}

function bucket(game) {
  const key = String(game.roundIndex);
  if (!game.submissions[key]) game.submissions[key] = {};
  return game.submissions[key];
}

function currentAuthorId(game) {
  return game.turnOrder[game.turnIndex] || null;
}

function statementsOf(sub) {
  return (sub.order || ["truth", "turkey"]).map((which) => (which === "truth" ? sub.truth : sub.turkey));
}

function truthPos(sub) {
  return (sub.order || ["truth", "turkey"]).indexOf("truth");
}

function endGame(game, now, reason) {
  game.phase = "ended";
  game.endedAt = now;
  game.defendEndsAt = null;
  game.revealEndsAt = null;
  game.winReason = reason;
  game.awards = buildAwards(game);
  pushLog(game, now, reason);
}

function buildAwards(game) {
  const players = activeIds(game).map((pid) => game.players[pid]);
  const awards = [];
  const bestCorrect = Math.max(0, ...players.map((p) => p.correctGuesses));
  if (bestCorrect > 0) {
    const tied = players.filter((p) => p.correctGuesses === bestCorrect);
    awards.push({
      id: "truth-teller",
      title: "Top Truth Teller",
      names: tied.map((p) => p.name),
      detail: `${listNames(tied.map((p) => p.name))} spotted ${bestCorrect} truth${bestCorrect === 1 ? "" : "s"}.`,
    });
  }
  const bestFooled = Math.max(0, ...players.map((p) => p.fooled));
  if (bestFooled > 0) {
    const tied = players.filter((p) => p.fooled === bestFooled);
    awards.push({
      id: "biggest-turkey",
      title: "Biggest Turkey",
      names: tied.map((p) => p.name),
      detail: `${listNames(tied.map((p) => p.name))} fooled the table ${bestFooled} time${bestFooled === 1 ? "" : "s"}.`,
    });
  }
  return awards;
}

function beginWrite(game, now) {
  game.phase = "write";
  game.turnOrder = [];
  game.turnIndex = 0;
  game.reveal = null;
  game.defendEndsAt = null;
  game.revealEndsAt = null;
  const t = theme(game);
  pushLog(game, now, `Round ${game.roundIndex + 1}: ${t.title}.`);
}

function beginDefend(game, now, rng) {
  const authorId = currentAuthorId(game);
  const sub = bucket(game)[authorId];
  if (!sub.order) sub.order = rng.shuffle(["truth", "turkey"]);
  game.phase = "defend";
  game.reveal = null;
  game.revealEndsAt = null;
  game.defendEndsAt = now + DEFEND_MS;
  pushLog(game, now, `${game.players[authorId].name} is up. Which one is the truth?`);
}

function closeWrite(game, now, rng) {
  const subs = bucket(game);
  game.turnOrder = playingIds(game).filter((pid) => subs[pid]);
  game.turnIndex = 0;
  if (!game.turnOrder.length) {
    if (game.roundIndex + 1 < game.settings.rounds) {
      game.roundIndex += 1;
      beginWrite(game, now);
      return;
    }
    endGame(game, now, "Nobody wrote this round, so the table is done.");
    return;
  }
  beginDefend(game, now, rng);
}

function scoreTurn(game, authorId) {
  const sub = bucket(game)[authorId];
  const pos = truthPos(sub);
  const author = game.players[authorId];
  const fooled = [];
  const spotted = [];
  for (const pid of playingIds(game)) {
    if (pid === authorId) continue;
    const pick = sub.votes[pid];
    if (pick == null) continue;
    if (pick === pos) {
      game.players[pid].points += 1;
      game.players[pid].correctGuesses += 1;
      spotted.push(game.players[pid].name);
    } else {
      author.points += 1;
      author.fooled += 1;
      fooled.push(game.players[pid].name);
    }
  }
  return { pos, fooled, spotted, statements: statementsOf(sub) };
}

function closeDefend(game, now) {
  const authorId = currentAuthorId(game);
  if (!authorId || !game.players[authorId] || game.players[authorId].kicked) {
    closeReveal(game, now, makeRng());
    return;
  }
  const result = scoreTurn(game, authorId);
  game.phase = "reveal";
  game.defendEndsAt = null;
  game.revealEndsAt = null;
  const author = game.players[authorId];
  game.reveal = {
    authorId,
    authorName: author.name,
    statements: result.statements,
    truthPos: result.pos,
    fooled: result.fooled,
    spotted: result.spotted,
  };
  const foolBit = result.fooled.length
    ? `${author.name} fooled ${listNames(result.fooled)}.`
    : `${author.name} fooled nobody.`;
  const spotBit = result.spotted.length ? ` ${listNames(result.spotted)} spotted the truth.` : "";
  pushLog(game, now, foolBit + spotBit);
}

function closeReveal(game, now, rng) {
  game.revealEndsAt = null;
  game.turnIndex += 1;
  if (game.turnIndex < game.turnOrder.length) {
    const author = game.players[currentAuthorId(game)];
    if (!author || author.kicked) return closeReveal(game, now, rng);
    beginDefend(game, now, rng);
    return;
  }
  if (game.roundIndex + 1 < game.settings.rounds) {
    game.roundIndex += 1;
    beginWrite(game, now);
    return;
  }
  endGame(game, now, "That's the game.");
}

export function tick(game, now, rng) {
  if (!game || game.phase === "ended" || game.abandoned) return false;
  if (game.phase === "defend" && game.defendEndsAt && now >= game.defendEndsAt) {
    closeDefend(game, now);
    return true;
  }
  if (game.phase === "reveal" && game.revealEndsAt && now >= game.revealEndsAt) {
    closeReveal(game, now, rng);
    return true;
  }
  return false;
}

function fail(error, changed = false) {
  return { ok: false, error, changed, notes: {}, empty: false };
}

function ok(extra = {}) {
  return { ok: true, error: null, changed: true, notes: {}, empty: false, ...extra };
}

export function createGame({ code, hostName, now = Date.now() }) {
  const cleaned = cleanName(hostName);
  if (cleaned.error) return { ok: false, error: cleaned.error };
  const host = makePlayer(cleaned.name, now);
  const game = {
    code,
    createdAt: now,
    updatedAt: now,
    rev: 0,
    phase: "lobby",
    hostId: host.id,
    abandoned: false,
    settings: { rounds: 2 },
    roundIndex: 0,
    players: { [host.id]: host },
    playerOrder: [host.id],
    submissions: {},
    turnOrder: [],
    turnIndex: 0,
    reveal: null,
    defendEndsAt: null,
    revealEndsAt: null,
    log: [],
    logSeq: 0,
    winReason: "",
    endedAt: null,
    awards: [],
  };
  pushLog(game, now, `${host.name} set the table.`);
  return { ok: true, game, player: host };
}

export function joinGame(game, rawName, now = Date.now()) {
  if (!game || game.abandoned) return { ok: false, error: "No table with that code. Check the letters." };
  if (game.phase === "ended") return { ok: false, error: "This game is over. Ask the host for a new one." };
  if (game.playerOrder.length >= MAX_PLAYERS) return { ok: false, error: "This table is full." };
  const cleaned = cleanName(rawName);
  if (cleaned.error) return { ok: false, error: cleaned.error };
  const taken = Object.values(game.players).some((p) => !p.kicked && p.name.toLowerCase() === cleaned.name.toLowerCase());
  if (taken) return { ok: false, error: "That name is already at the table. Add an initial." };
  const player = makePlayer(cleaned.name, now);
  player.playFromRound = game.phase === "lobby" || game.phase === "write" ? game.roundIndex : game.roundIndex + 1;
  game.players[player.id] = player;
  game.playerOrder.push(player.id);
  pushLog(game, now, game.phase === "lobby" ? `${player.name} pulled up a chair.` : `${player.name} jumped in. They play next round.`);
  return { ok: true, player };
}

export function playerByToken(game, tokenValue) {
  if (!game || !tokenValue) return null;
  return Object.values(game.players).find((p) => p.token === tokenValue) || null;
}

function removePlayer(game, targetId, now) {
  const target = game.players[targetId];
  if (!target) return;
  delete game.players[targetId];
  game.playerOrder = game.playerOrder.filter((pid) => pid !== targetId);
  if (game.hostId === targetId) {
    game.hostId = game.playerOrder[0] || null;
    if (game.hostId) pushLog(game, now, `${game.players[game.hostId].name} is the host now.`);
  } else {
    pushLog(game, now, `${target.name} left the table.`);
  }
}

function afterDrop(game, targetId, now, rng) {
  const authorId = currentAuthorId(game);
  if (game.phase === "defend" && authorId === targetId) closeReveal(game, now, rng);
  else if (game.phase === "reveal" && game.reveal && game.reveal.authorId === targetId) closeReveal(game, now, rng);
  else if (game.phase === "defend" && authorId && votersAllIn(game, authorId)) closeDefend(game, now);
  else if (game.phase === "write") {
    const subs = bucket(game);
    const waiting = playingIds(game).filter((pid) => !subs[pid]);
    if (!waiting.length) closeWrite(game, now, rng);
  }
}

function votersAllIn(game, authorId) {
  const sub = bucket(game)[authorId];
  return playingIds(game).filter((pid) => pid !== authorId).every((pid) => sub.votes[pid] != null);
}

export function applyAction(game, playerId, action, now, rng) {
  const changedByTick = tick(game, now, rng);
  if (!game || game.abandoned) return fail("This table has been cleared.", changedByTick);
  const player = game.players[playerId];
  if (!player || player.kicked) return fail("You are not at this table.", changedByTick);
  const type = action && action.type;
  if (game.phase === "ended" && type !== "rematch") return fail("The game is over.", changedByTick);

  if (type === "settings") {
    if (game.phase !== "lobby") return fail("The game already started.", changedByTick);
    if (!canManage(game, playerId)) return fail("Only the host can change that.", changedByTick);
    const rounds = Number(action.rounds);
    if (![1, 2, 3, 4].includes(rounds)) return fail("Pick 1 to 4 rounds.", changedByTick);
    game.settings.rounds = rounds;
    return ok();
  }

  if (type === "kick") {
    if (!canManage(game, playerId)) return fail("Only the host can do that.", changedByTick);
    if (action.targetId === playerId) return fail("You cannot kick yourself.", changedByTick);
    const target = game.players[action.targetId];
    if (!target) return fail("That player is not here.", changedByTick);
    if (game.phase === "lobby") {
      removePlayer(game, target.id, now);
      return ok({}, { empty: game.playerOrder.length === 0 });
    }
    target.kicked = true;
    pushLog(game, now, `${target.name} left the game.`);
    afterDrop(game, target.id, now, rng);
    return ok();
  }

  if (type === "leave") {
    if (game.phase === "lobby") {
      removePlayer(game, playerId, now);
      return ok({}, { empty: game.playerOrder.length === 0 });
    }
    player.kicked = true;
    pushLog(game, now, `${player.name} stepped out.`);
    afterDrop(game, playerId, now, rng);
    return ok();
  }

  if (type === "start") {
    if (!canManage(game, playerId)) return fail("Only the host can start.", changedByTick);
    if (game.phase !== "lobby") return fail("The game already started.", changedByTick);
    const ids = activeIds(game);
    if (ids.length < MIN_PLAYERS) return fail(`You need at least ${MIN_PLAYERS} players.`, changedByTick);
    const away = ids.filter((pid) => !game.players[pid].connected).map((pid) => game.players[pid].name);
    if (away.length) return fail(`${listNames(away)} ${away.length === 1 ? "is" : "are"} still connecting.`, changedByTick);
    game.roundIndex = 0;
    beginWrite(game, now);
    return ok();
  }

  if (type === "submit") {
    if (game.phase !== "write") return fail("Writing is closed for this round.", changedByTick);
    const subs = bucket(game);
    if (subs[player.id]) return fail("You already locked this round in.", changedByTick);
    const truth = cleanStatement(action.truth);
    if (truth.error) return fail(truth.error, changedByTick);
    const turkey = cleanStatement(action.turkey);
    if (turkey.error) return fail(turkey.error, changedByTick);
    if (truth.text.toLowerCase() === turkey.text.toLowerCase()) return fail("The truth and the turkey need to be different.", changedByTick);
    subs[player.id] = { truth: truth.text, turkey: turkey.text, order: null, votes: {} };
    pushLog(game, now, `${player.name} locked in.`);
    const waiting = playingIds(game).filter((pid) => !subs[pid]);
    if (!waiting.length) closeWrite(game, now, rng);
    return ok();
  }

  if (type === "vote") {
    if (game.phase !== "defend") return fail("There is nothing to vote on yet.", changedByTick);
    const authorId = currentAuthorId(game);
    if (authorId === player.id) return fail("You don't vote on your own. Defend both out loud.", changedByTick);
    const pick = Number(action.pick);
    if (pick !== 0 && pick !== 1) return fail("Pick one of the two.", changedByTick);
    const sub = bucket(game)[authorId];
    if (!sub) return fail("That turn is missing.", changedByTick);
    if (sub.votes[player.id] != null) return fail("Your vote is already in.", changedByTick);
    sub.votes[player.id] = pick;
    if (votersAllIn(game, authorId)) closeDefend(game, now);
    return ok();
  }

  if (type === "skip") {
    if (!canManage(game, playerId)) return fail("Only the host can skip ahead.", changedByTick);
    if (action.phase && action.phase !== game.phase) return fail("That moment already passed.", changedByTick);
    if (game.phase === "write") {
      closeWrite(game, now, rng);
      return ok();
    }
    if (game.phase === "defend") {
      closeDefend(game, now);
      return ok();
    }
    if (game.phase === "reveal") {
      closeReveal(game, now, rng);
      return ok();
    }
    return fail("Nothing to skip.", changedByTick);
  }

  if (type === "rematch") {
    if (game.phase !== "ended") return fail("Finish this game first.", changedByTick);
    if (!canManage(game, playerId)) return fail("Ask the host to deal the next game.", changedByTick);
    for (const pid of game.playerOrder) {
      const prev = game.players[pid];
      game.players[pid] = {
        ...makePlayer(prev.name, now),
        id: prev.id,
        token: prev.token,
        connected: prev.connected,
        joinedAt: prev.joinedAt,
      };
    }
    game.playerOrder = game.playerOrder.filter((pid) => game.players[pid]);
    game.phase = "lobby";
    game.roundIndex = 0;
    game.submissions = {};
    game.turnOrder = [];
    game.turnIndex = 0;
    game.reveal = null;
    game.defendEndsAt = null;
    game.revealEndsAt = null;
    game.winReason = "";
    game.endedAt = null;
    game.awards = [];
    game.log = [];
    game.logSeq = 0;
    pushLog(game, now, "Same table, new game.");
    return ok();
  }

  return fail("That move is not in the game.", changedByTick);
}

function publicPlayer(game, player, roundSubs) {
  return {
    id: player.id,
    name: player.name,
    connected: !!player.connected,
    isHost: player.id === game.hostId,
    kicked: !!player.kicked,
    points: player.points,
    locked: !!(roundSubs && roundSubs[player.id]),
    isUp: currentAuthorId(game) === player.id && (game.phase === "defend" || game.phase === "reveal"),
  };
}

export function viewFor(game, playerId, now = Date.now()) {
  if (!game) return null;
  const you = game.players[playerId] || null;
  const subs = game.submissions[String(game.roundIndex)] || {};
  const authorId = currentAuthorId(game);
  const sub = authorId ? subs[authorId] : null;
  const showTruth = game.phase === "reveal" || game.phase === "ended";
  let turn = null;
  if ((game.phase === "defend" || game.phase === "reveal") && sub) {
    const statements = statementsOf(sub);
    turn = {
      authorId,
      authorName: game.players[authorId] ? game.players[authorId].name : "Someone",
      statements,
      yourVote: you ? (sub.votes[you.id] != null ? sub.votes[you.id] : null) : null,
      youAreAuthor: !!(you && you.id === authorId),
      yourTruthPos: you && you.id === authorId ? truthPos(sub) : null,
      truthPos: showTruth ? truthPos(sub) : null,
      votesIn: activeIds(game).filter((pid) => pid !== authorId && sub.votes[pid] != null).length,
      voters: activeIds(game).filter((pid) => pid !== authorId).length,
      endsAt: game.phase === "defend" ? game.defendEndsAt : game.revealEndsAt,
    };
  }
  const yours = subs[playerId];
  return {
    code: game.code,
    rev: game.rev,
    phase: game.phase,
    serverNow: now,
    youAreHost: !!(you && you.id === game.hostId),
    youCanManage: you ? canManage(game, you.id) : false,
    settings: { rounds: game.settings.rounds },
    round: {
      index: game.roundIndex,
      number: game.roundIndex + 1,
      total: game.settings.rounds,
      id: theme(game).id,
      title: theme(game).title,
      prompt: theme(game).prompt,
      truthHint: theme(game).truthHint,
      turkeyHint: theme(game).turkeyHint,
    },
    themes: THEMES.slice(0, game.settings.rounds).map((item) => ({ id: item.id, title: item.title })),
    players: game.playerOrder.map((pid) => publicPlayer(game, game.players[pid], subs)),
    you: you
      ? {
          id: you.id,
          name: you.name,
          points: you.points,
          correctGuesses: you.correctGuesses,
          fooled: you.fooled,
          kicked: !!you.kicked,
          connected: !!you.connected,
          sittingOut: (you.playFromRound || 0) > game.roundIndex,
          submission: yours ? { truth: yours.truth, turkey: yours.turkey } : null,
        }
      : null,
    turn,
    reveal: game.phase === "reveal" ? game.reveal : null,
    log: game.log.slice(-8),
    winReason: game.winReason,
    recap: game.phase === "ended"
      ? {
          winReason: game.winReason,
          awards: game.awards || [],
          players: game.playerOrder.map((pid) => {
            const p = game.players[pid];
            return {
              id: p.id,
              name: p.name,
              points: p.points,
              correctGuesses: p.correctGuesses,
              fooled: p.fooled,
              kicked: !!p.kicked,
            };
          }),
        }
      : null,
  };
}

export function nextAlarm(game, now = Date.now()) {
  if (!game || game.abandoned) return null;
  const times = [];
  if (game.phase === "defend" && game.defendEndsAt) times.push(game.defendEndsAt);
  if (game.phase === "reveal" && game.revealEndsAt) times.push(game.revealEndsAt);
  const idle = game.phase === "ended" ? 12 * 3600 * 1000 : 6 * 3600 * 1000;
  times.push((game.updatedAt || now) + idle);
  return Math.min(...times);
}

export function idleExpired(game, now) {
  if (!game) return false;
  const idle = game.phase === "ended" ? 12 * 3600 * 1000 : 6 * 3600 * 1000;
  return now - (game.updatedAt || game.createdAt || now) >= idle;
}
