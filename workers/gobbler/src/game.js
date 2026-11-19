import { MISSIONS } from "./missions.js";

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 12;
export const VOTE_MS = 60_000;
export const PIE_MS = 90_000;
export const CODE_RE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/;

export const FEAST = [
  { id: "turkey", name: "Turkey", emoji: "🦃" },
  { id: "stuffing", name: "Stuffing", emoji: "🍞" },
  { id: "potatoes", name: "Mashed potatoes", emoji: "🥔" },
  { id: "gravy", name: "Gravy", emoji: "🥣" },
  { id: "beans", name: "Green bean casserole", emoji: "🥗" },
  { id: "cranberry", name: "Cranberry sauce", emoji: "🍒" },
  { id: "rolls", name: "Rolls", emoji: "🥐" },
  { id: "mac", name: "Mac and cheese", emoji: "🧀" },
  { id: "sweets", name: "Sweet potatoes", emoji: "🍠" },
  { id: "corn", name: "Corn", emoji: "🌽" },
];

export const ROLE_INFO = {
  gobbler: {
    label: "The Gobbler",
    team: "gobbler",
    teamLabel: "Gobbler",
    blurb: "You are sneaking bites. When you mark a mission done, a dish vanishes. The table sees the empty plate, not your name. Do not get caught before dessert.",
  },
  pilgrim: {
    label: "Pilgrim",
    team: "pilgrim",
    teamLabel: "Pilgrim",
    blurb: "You are innocent. Do your mission, watch the feast, and catch the Gobbler before the plates are empty.",
  },
  grandma: {
    label: "Grandma",
    team: "pilgrim",
    teamLabel: "Pilgrim",
    blurb: "You are a Pilgrim with one peek. Once this game, you may secretly learn one player's true role. Nobody else sees the answer.",
  },
  pieguard: {
    label: "Pie Guard",
    team: "pilgrim",
    teamLabel: "Pilgrim",
    blurb: "You are a Pilgrim. Each round, secretly shield one player. If the table votes that person out, the shield cancels it. They stay, and no dish is lost.",
  },
  kid: {
    label: "Kid",
    team: "pilgrim",
    teamLabel: "Pilgrim",
    blurb: "You are a Pilgrim. Your missions are easier, and every point you earn is doubled.",
  },
};

const BLOCKED_NAME = ["fuck", "shit", "bitch", "asshole", "cunt", "nigger", "faggot", "slut"];

export function makeRng(random = Math.random) {
  return {
    next: () => random(),
    int(n) {
      return Math.floor(random() * n);
    },
    pick(arr) {
      return arr[this.int(arr.length)];
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

export function cleanName(raw) {
  const name = String(raw || "").replace(/\s+/g, " ").trim();
  if (name.length < 1 || name.length > 20) {
    return { error: "Use a name between 1 and 20 characters." };
  }
  if (!/^[\p{L}\p{N}][\p{L}\p{N} .'-]*$/u.test(name)) {
    return { error: "Use letters, numbers, and spaces in the name." };
  }
  const low = name.toLowerCase();
  if (BLOCKED_NAME.some((w) => low.includes(w))) {
    return { error: "Pick a name you would say at the kids' table." };
  }
  return { name };
}

function id() {
  return crypto.randomUUID();
}

function token() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function makePlayer(name, now) {
  return {
    id: id(),
    name,
    token: token(),
    joinedAt: now,
    connected: false,
    alive: true,
    eliminated: false,
    caught: false,
    role: null,
    ready: false,
    points: 0,
    pointLog: [],
    accusations: 0,
    timesAccused: 0,
    accusedRound: 0,
    missions: [],
    grandmaUsed: false,
    peek: null,
    shields: {},
  };
}

function pushLog(game, now, text) {
  game.logSeq = (game.logSeq || 0) + 1;
  game.log.push({ id: game.logSeq, t: now, text });
  if (game.log.length > 40) game.log.splice(0, game.log.length - 40);
}

function roleTeam(role) {
  return role === "gobbler" ? "gobbler" : "pilgrim";
}

function livingIds(game) {
  return game.playerOrder.filter((pid) => game.players[pid] && game.players[pid].alive);
}

function feastLeft(game) {
  return game.feast.filter((d) => !d.eaten);
}

function specialsWanted(settings) {
  return [settings.grandma, settings.pieGuard, settings.kid].filter(Boolean).length;
}

function freshFeast() {
  return FEAST.map((d) => ({ id: d.id, name: d.name, emoji: d.emoji, eaten: false }));
}

function addPoints(game, player, base, reason) {
  if (!base) return;
  const amount = player.role === "kid" ? base * 2 : base;
  const next = Math.max(0, player.points + amount);
  const applied = next - player.points;
  player.points = next;
  if (applied !== 0) {
    player.pointLog.push({ reason, amount: applied, round: game.round.number });
  }
}

function listNames(players) {
  const names = players.map((p) => p.name);
  if (names.length <= 1) return names[0] || "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function doneCount(player) {
  return player.missions.filter((m) => m.done).length;
}

function pickMax(players, score) {
  let best = null;
  let bestScore = -Infinity;
  for (const p of players) {
    const s = score(p);
    if (s > bestScore) {
      best = p;
      bestScore = s;
    }
  }
  return best;
}

function buildAwards(game) {
  const players = game.playerOrder.map((pid) => game.players[pid]);
  const awards = [];
  const gobblers = players.filter((p) => p.role === "gobbler");
  const liar = pickMax(gobblers, (p) => doneCount(p) * 1000 + p.points);
  if (liar) {
    const n = doneCount(liar);
    awards.push({
      id: "best-liar",
      title: "Best Liar",
      names: [liar.name],
      playerIds: [liar.id],
      detail: n
        ? `${liar.name} finished ${n} sneaky mission${n === 1 ? "" : "s"} and still passed the potatoes.`
        : `${liar.name} never marked a mission and still looked hungry.`,
    });
  }
  const maxAcc = Math.max(0, ...players.map((p) => p.accusations));
  if (maxAcc > 0) {
    const tied = players.filter((p) => p.accusations === maxAcc);
    awards.push({
      id: "most-paranoid",
      title: "Most Paranoid",
      names: tied.map((p) => p.name),
      playerIds: tied.map((p) => p.id),
      detail: `${listNames(tied)} called Gobble! ${maxAcc} time${maxAcc === 1 ? "" : "s"}.`,
    });
  }
  const maxAccused = Math.max(0, ...players.map((p) => p.timesAccused));
  if (maxAccused > 0) {
    const tied = players.filter((p) => p.timesAccused === maxAccused);
    awards.push({
      id: "worst-poker-face",
      title: "Worst Poker Face",
      names: tied.map((p) => p.name),
      playerIds: tied.map((p) => p.id),
      detail: `The table pointed at ${listNames(tied)} ${maxAccused} time${maxAccused === 1 ? "" : "s"}.`,
    });
  }
  const top = pickMax(players, (p) => p.points);
  if (top && top.points > 0) {
    const tied = players.filter((p) => p.points === top.points);
    awards.push({
      id: "clean-plate",
      title: "Clean Plate",
      names: tied.map((p) => p.name),
      playerIds: tied.map((p) => p.id),
      detail: `${listNames(tied)} ${tied.length === 1 ? "leaves" : "leave"} the table with ${top.points} points.`,
    });
  }
  const pilgrims = players.filter((p) => p.role !== "gobbler");
  const alibi = pickMax(pilgrims, (p) => doneCount(p));
  if (alibi && doneCount(alibi) > 0) {
    awards.push({
      id: "alibi",
      title: "The Alibi",
      names: [alibi.name],
      playerIds: [alibi.id],
      detail: `${alibi.name} did ${doneCount(alibi)} harmless mission${doneCount(alibi) === 1 ? "" : "s"} and still looked a little guilty.`,
    });
  }
  return awards;
}

function endGame(game, winner, reason, now) {
  if (game.phase === "ended") return;
  game.phase = "ended";
  game.winner = winner;
  game.winReason = reason;
  game.endedAt = now;
  game.vote = null;
  game.pie = null;
  game.round.endsAt = null;
  game.round.remainingMs = null;
  for (const pid of game.playerOrder) {
    const p = game.players[pid];
    const team = p.role === "gobbler" ? "gobblers" : "pilgrims";
    if (team === winner) addPoints(game, p, 10, "Winning table");
  }
  game.awards = buildAwards(game);
  pushLog(game, now, reason);
}

function eatDish(game, rng) {
  const left = feastLeft(game);
  if (!left.length) return null;
  const dish = rng.pick(left);
  dish.eaten = true;
  dish.eatenRound = game.round.number;
  return dish;
}

function assignRoles(game, rng) {
  const ids = rng.shuffle(game.playerOrder);
  const gCount = Math.min(game.settings.gobblerCount, ids.length - 1);
  const gobblerIds = ids.slice(0, gCount);
  const pilgrimIds = ids.slice(gCount);
  for (const pid of gobblerIds) game.players[pid].role = "gobbler";
  for (const pid of pilgrimIds) game.players[pid].role = "pilgrim";
  const specials = [];
  if (game.settings.grandma) specials.push("grandma");
  if (game.settings.pieGuard) specials.push("pieguard");
  if (game.settings.kid) specials.push("kid");
  const order = rng.shuffle(specials);
  for (let i = 0; i < order.length && i < pilgrimIds.length; i++) {
    game.players[pilgrimIds[i]].role = order[i];
  }
}

function missionPoolFor(role) {
  if (role === "gobbler") return "gobbler";
  if (role === "kid") return "kid";
  return "pilgrim";
}

function assignMissions(game, rng) {
  for (const pid of game.playerOrder) {
    const p = game.players[pid];
    if (!p.alive || !p.role) continue;
    const poolName = missionPoolFor(p.role);
    const pool = MISSIONS.filter((m) => m.pool === poolName && !game.usedMissionIds.includes(m.id));
    if (!pool.length) continue;
    const mission = rng.pick(pool);
    game.usedMissionIds.push(mission.id);
    p.missions.push({
      id: mission.id,
      text: mission.text,
      round: game.round.number,
      done: false,
      pool: poolName,
    });
  }
}

function advanceRound(game, now, rng) {
  if (game.phase === "ended") return;
  game.phase = "round";
  game.vote = null;
  game.pie = null;
  game.lastResult = null;
  game.round.number += 1;
  game.round.startedAt = now;
  game.round.remainingMs = null;
  game.round.endsAt = now + game.settings.roundMinutes * 60 * 1000;
  assignMissions(game, rng);
  pushLog(game, now, `Round ${game.round.number}. New secret missions are on your phones.`);
}

function pauseRound(game, now) {
  if (game.round.endsAt) {
    game.round.remainingMs = Math.max(0, game.round.endsAt - now);
    game.round.endsAt = null;
  }
}

function resumeRound(game, now, rng) {
  if (game.phase === "ended") return;
  const rem = game.round.remainingMs;
  game.round.remainingMs = null;
  if (rem == null) {
    game.phase = "round";
    return;
  }
  if (rem <= 0) {
    advanceRound(game, now, rng);
    return;
  }
  game.phase = "round";
  game.round.endsAt = now + rem;
}

function shieldTarget(game) {
  const guard = Object.values(game.players).find((p) => p.role === "pieguard" && p.alive);
  if (!guard) return null;
  return guard.shields[game.round.number] || null;
}

function resolveVote(game, now, rng) {
  const vote = game.vote;
  if (!vote || game.phase !== "vote") return;
  const accused = game.players[vote.accusedId];
  const accuser = game.players[vote.accuserId];
  const outIds = vote.eligibleIds.filter((pid) => vote.votes[pid] === "out");
  const passed = outIds.length >= vote.needed;
  const shielded = shieldTarget(game);
  game.vote = null;

  if (!accused) {
    resumeRound(game, now, rng);
    return;
  }

  if (passed && shielded === accused.id) {
    const guard = Object.values(game.players).find((p) => p.role === "pieguard" && p.alive);
    if (guard) addPoints(game, guard, 12, "Pie shield");
    game.lastResult = {
      kind: "shield",
      text: `A pie shield slides in front of ${accused.name}. The vote is canceled. They stay, and the feast stays whole.`,
    };
    pushLog(game, now, game.lastResult.text);
    resumeRound(game, now, rng);
    return;
  }

  if (passed && accused.role === "gobbler") {
    accused.alive = false;
    accused.eliminated = true;
    accused.caught = true;
    for (const pid of outIds) addPoints(game, game.players[pid], 8, "Voted out a Gobbler");
    if (accuser) addPoints(game, accuser, 6, "Made the call");
    const gobblersLeft = livingIds(game).filter((pid) => game.players[pid].role === "gobbler");
    if (!gobblersLeft.length) {
      endGame(game, "pilgrims", `${accused.name} was a Gobbler, and that was the last one. The Pilgrims win.`, now);
      return;
    }
    game.lastResult = {
      kind: "caught",
      text: `${accused.name} is a Gobbler. Caught. ${gobblersLeft.length === 1 ? "One Gobbler is still at the table." : "Gobblers are still at the table."}`,
    };
    pushLog(game, now, game.lastResult.text);
    resumeRound(game, now, rng);
    return;
  }

  if (passed) {
    accused.alive = false;
    accused.eliminated = true;
    if (accuser) addPoints(game, accuser, -3, "Sent an innocent out");
    const dish = eatDish(game, rng);
    if (!feastLeft(game).length) {
      const dishName = dish ? dish.name.toLowerCase() : "the last dish";
      endGame(
        game,
        "gobblers",
        `${accused.name} was innocent. Losing the ${dishName} cleared the table. The Gobblers win.`,
        now
      );
      return;
    }
    const pilgrimsLeft = livingIds(game).filter((pid) => game.players[pid].role !== "gobbler");
    if (!pilgrimsLeft.length) {
      endGame(game, "gobblers", `${accused.name} was innocent, and no Pilgrims are left in the game. The Gobblers win.`, now);
      return;
    }
    game.lastResult = {
      kind: "innocent",
      text: dish
        ? `${accused.name} is innocent. The Pilgrims lose the ${dish.name.toLowerCase()}.`
        : `${accused.name} is innocent.`,
    };
    pushLog(game, now, game.lastResult.text);
    resumeRound(game, now, rng);
    return;
  }

  game.lastResult = {
    kind: "stay",
    text: `${accused.name} stays. It takes ${vote.needed} votes to send someone out, and ${outIds.length} landed.`,
  };
  pushLog(game, now, game.lastResult.text);
  resumeRound(game, now, rng);
}

function ballotKey(ids) {
  return ids.slice().sort().join(",");
}

function resolvePie(game, now) {
  if (game.phase !== "pie" || !game.pie) return;
  const pie = game.pie;
  const hidden = livingIds(game).filter((pid) => game.players[pid].role === "gobbler");
  const correctKey = ballotKey(hidden);
  const counts = {};
  for (const pid of game.playerOrder) {
    const ballot = pie.ballots[pid];
    if (!ballot || !ballot.locked) continue;
    if (!ballot.picks || ballot.picks.length !== pie.needed) continue;
    const key = ballotKey(ballot.picks);
    counts[key] = (counts[key] || 0) + 1;
    if (key === correctKey) addPoints(game, game.players[pid], 10, "Named the Gobblers");
  }
  let top = 0;
  for (const n of Object.values(counts)) top = Math.max(top, n);
  const leaders = Object.entries(counts).filter(([, n]) => n === top).map(([key]) => key);
  const named = leaders.length === 1 ? leaders[0] : "";
  const correctWins = top > 0 && leaders.includes(correctKey);
  const correctNames = hidden.map((pid) => game.players[pid].name);
  const namedIds = named ? named.split(",").filter(Boolean) : [];
  const namedNames = namedIds.map((pid) => game.players[pid]?.name).filter(Boolean);

  if (correctWins && leaders.length > 1) {
    endGame(
      game,
      "pilgrims",
      `The table was split, but the right names were in the tie: ${listNames(correctNames.map((name) => ({ name })))}. The Pilgrims win.`,
      now
    );
    return;
  }
  if (correctWins) {
    endGame(
      game,
      "pilgrims",
      `The table named ${listNames(namedNames.map((name) => ({ name })))}. That is the Gobbler${hidden.length === 1 ? "" : "s"}. The Pilgrims win.`,
      now
    );
    return;
  }
  const missed = namedNames.length
    ? `The table named ${listNames(namedNames.map((name) => ({ name })))}.`
    : "The table could not agree on a name.";
  endGame(
    game,
    "gobblers",
    `${missed} The Gobbler${hidden.length === 1 ? " was" : "s were"} ${listNames(correctNames.map((name) => ({ name })))}. The Gobblers slip out with the leftovers.`,
    now
  );
}

export function tick(game, now, rng) {
  if (!game || game.phase === "ended" || game.abandoned) return false;
  let changed = false;
  if (game.phase === "vote" && game.vote && now >= game.vote.endsAt) {
    resolveVote(game, now, rng);
    changed = true;
  }
  if (game.phase === "pie" && game.pie && game.pie.endsAt && now >= game.pie.endsAt) {
    resolvePie(game, now);
    changed = true;
  }
  if (game.phase === "round" && game.round.endsAt && now >= game.round.endsAt) {
    advanceRound(game, now, rng);
    changed = true;
  }
  return changed;
}

function fail(error, changed = false) {
  return { ok: false, error, changed, notes: {}, empty: false };
}

function ok(notes = {}, extra = {}) {
  return { ok: true, error: null, changed: true, notes, empty: false, ...extra };
}

function isHost(game, playerId) {
  return game.hostId === playerId;
}

export function canManage(game, playerId) {
  if (!game.players[playerId]) return false;
  if (isHost(game, playerId)) return true;
  const host = game.players[game.hostId];
  return !host || !host.connected;
}

function applyAutoGobblerCount(game) {
  if (game.settingsTouched.gobblerCount) return;
  game.settings.gobblerCount = game.playerOrder.length >= 8 ? 2 : 1;
}

function removeFromTable(game, targetId, now) {
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
  applyAutoGobblerCount(game);
}

function currentMission(player, roundNumber) {
  for (let i = player.missions.length - 1; i >= 0; i--) {
    if (player.missions[i].round === roundNumber) return player.missions[i];
  }
  return null;
}

function startVote(game, accuser, accused, now) {
  const eligibleIds = livingIds(game);
  pauseRound(game, now);
  game.phase = "vote";
  game.lastResult = null;
  game.vote = {
    accusedId: accused.id,
    accuserId: accuser.id,
    endsAt: now + VOTE_MS,
    votes: {},
    eligibleIds,
    needed: Math.floor(eligibleIds.length / 2) + 1,
  };
  accuser.accusations += 1;
  accuser.accusedRound = game.round.number;
  accused.timesAccused += 1;
  pushLog(game, now, `${accuser.name} called Gobble! on ${accused.name}. Vote on your phones.`);
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
    settings: {
      gobblerCount: 1,
      grandma: false,
      pieGuard: false,
      kid: false,
      roundMinutes: 15,
    },
    settingsTouched: { gobblerCount: false },
    players: { [host.id]: host },
    playerOrder: [host.id],
    feast: freshFeast(),
    round: { number: 0, startedAt: null, endsAt: null, remainingMs: null },
    usedMissionIds: [],
    vote: null,
    lastResult: null,
    pie: null,
    log: [],
    logSeq: 0,
    winner: null,
    winReason: "",
    endedAt: null,
    awards: [],
  };
  pushLog(game, now, `${host.name} set the table.`);
  return { ok: true, game, player: host };
}

export function joinGame(game, rawName, now = Date.now()) {
  if (!game || game.abandoned) return { ok: false, error: "No table with that code. Check the letters." };
  if (game.phase !== "lobby") return { ok: false, error: "Dinner already started. You can play the next one." };
  if (game.playerOrder.length >= MAX_PLAYERS) return { ok: false, error: "This table is full at 12 phones." };
  const cleaned = cleanName(rawName);
  if (cleaned.error) return { ok: false, error: cleaned.error };
  const taken = Object.values(game.players).some((p) => p.name.toLowerCase() === cleaned.name.toLowerCase());
  if (taken) return { ok: false, error: "That name is already at the table. Add an initial." };
  const player = makePlayer(cleaned.name, now);
  game.players[player.id] = player;
  game.playerOrder.push(player.id);
  applyAutoGobblerCount(game);
  pushLog(game, now, `${player.name} pulled up a chair.`);
  return { ok: true, player };
}

export function playerByToken(game, tokenValue) {
  if (!game || !tokenValue) return null;
  return Object.values(game.players).find((p) => p.token === tokenValue) || null;
}

function startChecks(game) {
  const n = game.playerOrder.length;
  if (n < MIN_PLAYERS) return `You need at least ${MIN_PLAYERS} players. You have ${n}.`;
  const away = game.playerOrder.filter((pid) => !game.players[pid].connected).map((pid) => game.players[pid].name);
  if (away.length) return `${listNames(away.map((name) => ({ name })))} ${away.length === 1 ? "is" : "are"} away. Wait for the phone, or remove them.`;
  if (game.settings.gobblerCount < 1 || game.settings.gobblerCount >= n) {
    return "Leave at least one Pilgrim at the table.";
  }
  const pilgrims = n - game.settings.gobblerCount;
  const specials = specialsWanted(game.settings);
  if (specials > pilgrims) {
    return `Those special roles need ${specials} Pilgrims, and this setup only has ${pilgrims}.`;
  }
  return null;
}

export function applyAction(game, playerId, action, now, rng) {
  const changedByTick = tick(game, now, rng);
  if (!game || game.abandoned) return fail("This table has been cleared.", changedByTick);
  const player = game.players[playerId];
  if (!player) return fail("You are not at this table.", changedByTick);
  const type = action && action.type;
  if (game.phase === "ended" && type !== "rematch") {
    return fail("The game is over.", changedByTick);
  }

  if (type === "settings") {
    if (game.phase !== "lobby") return fail("The menu is closed. Dinner already started.", changedByTick);
    if (!canManage(game, playerId)) return fail("Only the host can change the table.", changedByTick);
    const s = game.settings;
    if (action.gobblerCount != null) {
      const n = Number(action.gobblerCount);
      if (n !== 1 && n !== 2) return fail("Choose 1 or 2 Gobblers.", changedByTick);
      s.gobblerCount = n;
      game.settingsTouched.gobblerCount = true;
    }
    if (action.grandma != null) s.grandma = !!action.grandma;
    if (action.pieGuard != null) s.pieGuard = !!action.pieGuard;
    if (action.kid != null) s.kid = !!action.kid;
    if (action.roundMinutes != null) {
      const m = Number(action.roundMinutes);
      if (!Number.isInteger(m) || m < 15 || m > 20) return fail("Courses run 15 to 20 minutes.", changedByTick);
      s.roundMinutes = m;
    }
    return ok();
  }

  if (type === "remove_player") {
    if (game.phase !== "lobby") return fail("The game already started.", changedByTick);
    if (!canManage(game, playerId)) return fail("Only the host can do that.", changedByTick);
    if (action.targetId === playerId) return fail("Use leave if you want to step away.", changedByTick);
    if (!game.players[action.targetId]) return fail("That player is not here.", changedByTick);
    removeFromTable(game, action.targetId, now);
    return ok({}, { empty: game.playerOrder.length === 0 });
  }

  if (type === "leave") {
    if (game.phase !== "lobby") return fail("Dinner already started. Keep this phone nearby.", changedByTick);
    removeFromTable(game, playerId, now);
    return ok({}, { empty: game.playerOrder.length === 0 });
  }

  if (type === "start") {
    if (!canManage(game, playerId)) return fail("Only the host can start dinner.", changedByTick);
    if (game.phase !== "lobby") return fail("Dinner already started.", changedByTick);
    const problem = startChecks(game);
    if (problem) return fail(problem, changedByTick);
    for (const pid of game.playerOrder) {
      const p = game.players[pid];
      p.ready = false;
      p.role = null;
    }
    game.phase = "reveal";
    assignRoles(game, rng);
    pushLog(game, now, "Roles are dealt. Hold your phone close, then tap ready.");
    return ok();
  }

  if (type === "ready") {
    if (game.phase !== "reveal") return fail("Roles are not on the table yet.", changedByTick);
    player.ready = true;
    const allReady = game.playerOrder.every((pid) => game.players[pid].ready);
    if (allReady) beginFeastFromReveal(game, now, rng);
    return ok();
  }

  if (type === "begin_feast") {
    if (!canManage(game, playerId)) return fail("Only the host can start the feast.", changedByTick);
    if (game.phase !== "reveal") return fail("The feast is not waiting on you.", changedByTick);
    beginFeastFromReveal(game, now, rng);
    return ok();
  }

  if (type === "complete_mission") {
    if (game.phase !== "round") return fail("Missions wait until the next course.", changedByTick);
    if (!player.alive) return fail("You are out of the missions. Stay and watch the plates.", changedByTick);
    const mission = currentMission(player, game.round.number);
    if (!mission) return fail("The kitchen is out of new missions for you. Watch the table.", changedByTick);
    if (mission.done) return fail("You already finished this one.", changedByTick);
    mission.done = true;
    addPoints(game, player, 10, "Mission");
    const notes = {};
    if (player.role === "gobbler") {
      const dish = eatDish(game, rng);
      if (dish) {
        pushLog(game, now, `A dish is gone: the ${dish.name.toLowerCase()}.`);
        notes[player.id] = `You finished it. The ${dish.name.toLowerCase()} is gone, and your name stayed off the note.`;
      }
      if (!feastLeft(game).length) {
        endGame(game, "gobblers", "The feast is gone before dessert. The Gobblers win.", now);
      }
    } else {
      notes[player.id] = "Mission done. Harmless, and the feast stays put.";
    }
    return ok(notes);
  }

  if (type === "peek") {
    if (player.role !== "grandma") return fail("Only Grandma gets a peek.", changedByTick);
    if (!player.alive) return fail("You are out of the game.", changedByTick);
    if (game.phase !== "round" && game.phase !== "vote") return fail("Save the peek for during dinner.", changedByTick);
    if (player.grandmaUsed) return fail("You already used Grandma's peek.", changedByTick);
    const target = game.players[action.targetId];
    if (!target || target.id === player.id) return fail("Peek at someone else.", changedByTick);
    const info = ROLE_INFO[target.role];
    player.grandmaUsed = true;
    player.peek = {
      playerId: target.id,
      name: target.name,
      role: target.role,
      label: info.label,
      teamLabel: info.teamLabel,
    };
    return ok({
      [player.id]: `${target.name} is ${info.label}. ${info.teamLabel} team. Only you can see this.`,
    });
  }

  if (type === "shield") {
    if (player.role !== "pieguard") return fail("Only the Pie Guard can shield someone.", changedByTick);
    if (!player.alive) return fail("You are out of the game.", changedByTick);
    if (game.phase !== "round") return fail("Pick the shield before a vote starts.", changedByTick);
    if (action.targetId == null || action.targetId === "") {
      delete player.shields[game.round.number];
      return ok({ [player.id]: "Shield cleared for this course." });
    }
    const target = game.players[action.targetId];
    if (!target || !target.alive) return fail("Shield someone who is still in the game.", changedByTick);
    player.shields[game.round.number] = target.id;
    return ok({ [player.id]: `${target.name} is under the pie shield this course. Nobody else can see it.` });
  }

  if (type === "accuse") {
    if (game.phase !== "round") return fail("A vote is already on the table, or dinner has not started.", changedByTick);
    if (!player.alive) return fail("You are out. You can still watch.", changedByTick);
    if (player.accusedRound === game.round.number) {
      return fail("You already called Gobble! this course. Let the table breathe.", changedByTick);
    }
    const target = game.players[action.targetId];
    if (!target || !target.alive) return fail("Pick someone who is still in the game.", changedByTick);
    if (target.id === player.id) return fail("You cannot accuse yourself.", changedByTick);
    startVote(game, player, target, now);
    return ok();
  }

  if (type === "vote") {
    if (game.phase !== "vote" || !game.vote) return fail("There is no vote right now.", changedByTick);
    if (!player.alive) return fail("You are out of this vote.", changedByTick);
    if (!game.vote.eligibleIds.includes(player.id)) return fail("You cannot vote on this one.", changedByTick);
    if (action.choice !== "out" && action.choice !== "stay") return fail("Vote them out, or let them stay.", changedByTick);
    if (game.vote.votes[player.id]) return fail("Your vote is already in.", changedByTick);
    game.vote.votes[player.id] = action.choice;
    const allIn = game.vote.eligibleIds.every((pid) => game.vote.votes[pid]);
    if (allIn) resolveVote(game, now, rng);
    return ok();
  }

  if (type === "advance") {
    if (!canManage(game, playerId)) return fail("Only the host can call the next course.", changedByTick);
    if (game.phase !== "round") return fail("Finish the vote before the next course.", changedByTick);
    advanceRound(game, now, rng);
    return ok();
  }

  if (type === "pie_time") {
    if (!canManage(game, playerId)) return fail("Only the host can call pie time.", changedByTick);
    if (game.phase !== "round") return fail("Finish the current vote before dessert.", changedByTick);
    const hidden = livingIds(game).filter((pid) => game.players[pid].role === "gobbler");
    if (!hidden.length) {
      endGame(game, "pilgrims", "No Gobblers left. The Pilgrims win.", now);
      return ok();
    }
    pauseRound(game, now);
    game.phase = "pie";
    game.lastResult = null;
    game.pie = {
      endsAt: now + PIE_MS,
      needed: hidden.length,
      ballots: {},
    };
    pushLog(game, now, hidden.length === 1 ? "Pie time. Name the Gobbler." : "Pie time. Name both Gobblers.");
    return ok();
  }

  if (type === "pie_pick") {
    if (game.phase !== "pie" || !game.pie) return fail("It is not pie time.", changedByTick);
    const ballot = game.pie.ballots[player.id] || { picks: [], locked: false };
    if (ballot.locked) return fail("Your answer is locked.", changedByTick);
    const target = game.players[action.targetId];
    if (!target || !target.alive) return fail("Name someone who is still in the game.", changedByTick);
    const picks = ballot.picks.slice();
    const idx = picks.indexOf(target.id);
    if (idx >= 0) picks.splice(idx, 1);
    else if (picks.length >= game.pie.needed) {
      return fail(
        game.pie.needed === 1 ? "You can only name one person. Unselect them first." : "Unselect someone before you add another name.",
        changedByTick
      );
    } else picks.push(target.id);
    game.pie.ballots[player.id] = { picks, locked: false };
    return ok();
  }

  if (type === "pie_lock") {
    if (game.phase !== "pie" || !game.pie) return fail("It is not pie time.", changedByTick);
    const ballot = game.pie.ballots[player.id] || { picks: [], locked: false };
    if (ballot.locked) return ok();
    if (ballot.picks.length !== game.pie.needed) {
      return fail(
        game.pie.needed === 1 ? "Name the Gobbler, then lock it in." : `Name ${game.pie.needed} Gobblers, then lock it in.`,
        changedByTick
      );
    }
    ballot.locked = true;
    game.pie.ballots[player.id] = ballot;
    const everyone = game.playerOrder.every((pid) => game.pie && game.pie.ballots[pid] && game.pie.ballots[pid].locked);
    if (everyone) resolvePie(game, now);
    return ok();
  }

  if (type === "close_pie") {
    if (!canManage(game, playerId)) return fail("Only the host can close pie time.", changedByTick);
    if (game.phase !== "pie") return fail("It is not pie time.", changedByTick);
    resolvePie(game, now);
    return ok();
  }

  if (type === "rematch") {
    if (game.phase !== "ended") return fail("Finish this dinner first.", changedByTick);
    if (!canManage(game, playerId)) return fail("Ask the host to deal the next game.", changedByTick);
    const kept = game.playerOrder.map((pid) => {
      const prev = game.players[pid];
      const next = makePlayer(prev.name, now);
      next.id = prev.id;
      next.token = prev.token;
      next.connected = prev.connected;
      next.joinedAt = prev.joinedAt;
      return next;
    });
    game.players = {};
    for (const p of kept) game.players[p.id] = p;
    game.phase = "lobby";
    game.abandoned = false;
    game.feast = freshFeast();
    game.round = { number: 0, startedAt: null, endsAt: null, remainingMs: null };
    game.usedMissionIds = [];
    game.vote = null;
    game.lastResult = null;
    game.pie = null;
    game.winner = null;
    game.winReason = "";
    game.endedAt = null;
    game.awards = [];
    game.log = [];
    game.logSeq = 0;
    pushLog(game, now, "Same table, new game. The feast is whole again.");
    return ok();
  }

  return fail("That move is not on the menu.", changedByTick);
}

function beginFeastFromReveal(game, now, rng) {
  game.phase = "round";
  game.round.number = 0;
  advanceRound(game, now, rng);
  pushLog(game, now, "The feast is on the table.");
}

function publicPlayer(game, player, revealRoles) {
  const base = {
    id: player.id,
    name: player.name,
    connected: !!player.connected,
    alive: player.alive,
    eliminated: player.eliminated,
    caught: player.caught,
    isHost: player.id === game.hostId,
    ready: player.ready,
  };
  if (revealRoles) {
    const info = ROLE_INFO[player.role] || ROLE_INFO.pilgrim;
    base.role = player.role;
    base.roleLabel = info.label;
    base.teamLabel = info.teamLabel;
  }
  return base;
}

function recap(game) {
  return {
    winner: game.winner,
    winReason: game.winReason,
    awards: game.awards || [],
    feastEaten: game.feast.filter((d) => d.eaten).length,
    feastTotal: game.feast.length,
    log: game.log.slice(),
    players: game.playerOrder.map((pid) => {
      const p = game.players[pid];
      const info = ROLE_INFO[p.role] || ROLE_INFO.pilgrim;
      return {
        id: p.id,
        name: p.name,
        role: p.role,
        roleLabel: info.label,
        team: info.team,
        teamLabel: info.teamLabel,
        alive: p.alive,
        caught: p.caught,
        points: p.points,
        pointLog: p.pointLog.slice(),
        accusations: p.accusations,
        timesAccused: p.timesAccused,
        missions: p.missions.map((m) => ({
          id: m.id,
          round: m.round,
          text: m.text,
          done: m.done,
          pool: m.pool,
        })),
      };
    }),
  };
}

export function viewFor(game, playerId, now = Date.now()) {
  if (!game) return null;
  const you = game.players[playerId] || null;
  const revealRoles = game.phase === "ended";
  const mission = you ? currentMission(you, game.round.number) : null;
  const info = you && you.role ? ROLE_INFO[you.role] : null;
  let vote = null;
  if (game.phase === "vote" && game.vote) {
    const accused = game.players[game.vote.accusedId];
    const accuser = game.players[game.vote.accuserId];
    const votesCast = game.vote.eligibleIds.filter((pid) => game.vote.votes[pid]).length;
    vote = {
      accusedId: game.vote.accusedId,
      accusedName: accused ? accused.name : "Someone",
      accuserId: game.vote.accuserId,
      accuserName: accuser ? accuser.name : "Someone",
      endsAt: game.vote.endsAt,
      needed: game.vote.needed,
      eligible: game.vote.eligibleIds.length,
      votesCast,
      yourVote: you ? game.vote.votes[you.id] || null : null,
      youCanVote: !!(you && you.alive && game.vote.eligibleIds.includes(you.id) && !game.vote.votes[you.id]),
    };
  }
  let pie = null;
  if (game.phase === "pie" && game.pie) {
    const ballot = you ? game.pie.ballots[you.id] : null;
    const lockedCount = game.playerOrder.filter((pid) => game.pie.ballots[pid] && game.pie.ballots[pid].locked).length;
    pie = {
      needed: game.pie.needed,
      endsAt: game.pie.endsAt,
      yourPicks: ballot ? ballot.picks.slice() : [],
      locked: !!(ballot && ballot.locked),
      lockedCount,
      playerCount: game.playerOrder.length,
      suspects: livingIds(game).map((pid) => ({ id: pid, name: game.players[pid].name })),
    };
  }
  const awayHost = game.players[game.hostId] ? !game.players[game.hostId].connected : true;
  return {
    code: game.code,
    rev: game.rev,
    phase: game.phase,
    serverNow: now,
    hostId: game.hostId,
    youAreHost: !!(you && you.id === game.hostId),
    youCanManage: you ? canManage(game, you.id) : false,
    hostAway: awayHost && game.phase !== "lobby",
    settings: {
      gobblerCount: game.settings.gobblerCount,
      grandma: game.settings.grandma,
      pieGuard: game.settings.pieGuard,
      kid: game.settings.kid,
      roundMinutes: game.settings.roundMinutes,
    },
    players: game.playerOrder.map((pid) => publicPlayer(game, game.players[pid], revealRoles)),
    you: you
      ? {
          id: you.id,
          name: you.name,
          alive: you.alive,
          connected: !!you.connected,
          eliminated: you.eliminated,
          caught: you.caught,
          ready: you.ready,
          role: game.phase === "lobby" ? null : you.role,
          roleLabel: info && game.phase !== "lobby" ? info.label : null,
          team: info && game.phase !== "lobby" ? info.team : null,
          teamLabel: info && game.phase !== "lobby" ? info.teamLabel : null,
          blurb: info && game.phase !== "lobby" ? info.blurb : null,
          points: you.points,
          mission: mission
            ? {
                id: mission.id,
                text: mission.text,
                done: mission.done,
                round: mission.round,
                eats: you.role === "gobbler",
              }
            : null,
          grandma: you.role === "grandma"
            ? { used: you.grandmaUsed, result: you.peek }
            : null,
          pieGuard: you.role === "pieguard"
            ? { targetId: you.shields[game.round.number] || null }
            : null,
        }
      : null,
    feast: game.feast.map((d) => ({
      id: d.id,
      name: d.name,
      emoji: d.emoji,
      eaten: !!d.eaten,
    })),
    feastLeft: feastLeft(game).length,
    round: {
      number: game.round.number,
      endsAt: game.round.endsAt,
      remainingMs: game.round.remainingMs,
      minutes: game.settings.roundMinutes,
    },
    vote,
    pie,
    lastResult: game.lastResult,
    log: game.log.slice(-8),
    winner: game.winner,
    winReason: game.winReason,
    recap: game.phase === "ended" ? recap(game) : null,
  };
}

export function missionCounts() {
  return {
    pilgrim: MISSIONS.filter((m) => m.pool === "pilgrim").length,
    gobbler: MISSIONS.filter((m) => m.pool === "gobbler").length,
    kid: MISSIONS.filter((m) => m.pool === "kid").length,
  };
}

export function nextAlarm(game, now = Date.now()) {
  if (!game || game.abandoned) return null;
  const times = [];
  if (game.phase === "round" && game.round.endsAt) times.push(game.round.endsAt);
  if (game.phase === "vote" && game.vote && game.vote.endsAt) times.push(game.vote.endsAt);
  if (game.phase === "pie" && game.pie && game.pie.endsAt) times.push(game.pie.endsAt);
  const idle = game.phase === "ended" ? 12 * 3600 * 1000 : 6 * 3600 * 1000;
  times.push((game.updatedAt || now) + idle);
  return Math.min(...times);
}

export function idleExpired(game, now) {
  if (!game) return false;
  const idle = game.phase === "ended" ? 12 * 3600 * 1000 : 6 * 3600 * 1000;
  return now - (game.updatedAt || game.createdAt || now) >= idle;
}
