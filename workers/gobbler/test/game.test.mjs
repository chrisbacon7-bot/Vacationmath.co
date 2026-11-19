import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FEAST,
  applyAction,
  createGame,
  joinGame,
  makeRng,
  missionCounts,
  seedRng,
  tick,
  viewFor,
} from "../src/game.js";
import { MISSIONS } from "../src/missions.js";

function rng(seed = 1) {
  return makeRng(seedRng(seed));
}

function table(names, settings = {}, seed = 1) {
  const random = rng(seed);
  let now = 1_000_000;
  const created = createGame({ code: "TEST", hostName: names[0], now });
  assert.equal(created.ok, true);
  const game = created.game;
  const seats = [created.player];
  for (const name of names.slice(1)) {
    now += 10;
    const joined = joinGame(game, name, now);
    assert.equal(joined.ok, true, joined.error);
    seats.push(joined.player);
  }
  for (const p of seats) p.connected = true;
  if (Object.keys(settings).length) {
    const res = applyAction(game, seats[0].id, { type: "settings", ...settings }, now, random);
    assert.equal(res.ok, true, res.error);
  }
  return { game, seats, random, now: () => (now += 1000) };
}

function startDinner(ctx) {
  const now = ctx.now();
  const started = applyAction(ctx.game, ctx.seats[0].id, { type: "start" }, now, ctx.random);
  assert.equal(started.ok, true, started.error);
  assert.equal(ctx.game.phase, "reveal");
  for (const p of ctx.seats) {
    const ready = applyAction(ctx.game, p.id, { type: "ready" }, ctx.now(), ctx.random);
    assert.equal(ready.ok, true, ready.error);
  }
  assert.equal(ctx.game.phase, "round");
  assert.equal(ctx.game.round.number, 1);
  return ctx;
}

function player(game, id) {
  return game.players[id];
}

test("mission bank is large, unique, and family sized", () => {
  const counts = missionCounts();
  assert.ok(counts.pilgrim >= 40, counts.pilgrim);
  assert.ok(counts.gobbler >= 25, counts.gobbler);
  assert.ok(counts.kid >= 15, counts.kid);
  const ids = new Set(MISSIONS.map((m) => m.id));
  assert.equal(ids.size, MISSIONS.length);
  const texts = new Set(MISSIONS.map((m) => m.text));
  assert.equal(texts.size, MISSIONS.length);
  assert.equal(FEAST.length, 10);
  for (const m of MISSIONS) assert.equal(m.text.includes("\u2014"), false);
  for (const m of MISSIONS) assert.equal(m.text.includes("\u2013"), false);
});

test("needs four players and deals one gobbler plus optional roles", () => {
  const small = table(["A", "B", "C"]);
  const denied = applyAction(small.game, small.seats[0].id, { type: "start" }, small.now(), small.random);
  assert.equal(denied.ok, false);

  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], { grandma: true, pieGuard: true, kid: true }, 3));
  const roles = ctx.seats.map((p) => player(ctx.game, p.id).role);
  assert.equal(roles.filter((r) => r === "gobbler").length, 1);
  assert.ok(roles.includes("grandma"));
  assert.ok(roles.includes("pieguard"));
  assert.ok(roles.includes("kid"));
});

test("eight players suggest two gobblers until the host overrides", () => {
  const names = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const ctx = table(names);
  assert.equal(ctx.game.settings.gobblerCount, 2);
  const set = applyAction(ctx.game, ctx.seats[0].id, { type: "settings", gobblerCount: 1 }, ctx.now(), ctx.random);
  assert.equal(set.ok, true);
  applyAction(ctx.game, ctx.seats[0].id, { type: "remove_player", targetId: ctx.seats[7].id }, ctx.now(), ctx.random);
  assert.equal(ctx.game.settings.gobblerCount, 1);
});

test("special roles cannot outnumber pilgrims", () => {
  const ctx = table(["Ann", "Bo", "Cy", "Dee"], { gobblerCount: 2, grandma: true, pieGuard: true, kid: true });
  const started = applyAction(ctx.game, ctx.seats[0].id, { type: "start" }, ctx.now(), ctx.random);
  assert.equal(started.ok, false);
});

test("missions do not repeat, gobbler bites eat a dish, pilgrims do not", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee", "Eli"], {}, 9));
  const seen = new Set();
  for (let round = 0; round < 6; round++) {
    for (const seat of ctx.seats) {
      const p = player(ctx.game, seat.id);
      if (!p.alive) continue;
      const mission = p.missions.find((m) => m.round === ctx.game.round.number);
      if (!mission) continue;
      assert.equal(seen.has(mission.id), false);
      seen.add(mission.id);
      const before = ctx.game.feast.filter((d) => d.eaten).length;
      const res = applyAction(ctx.game, seat.id, { type: "complete_mission" }, ctx.now(), ctx.random);
      assert.equal(res.ok, true, res.error);
      const after = ctx.game.feast.filter((d) => d.eaten).length;
      if (p.role === "gobbler") assert.equal(after, before + 1);
      else assert.equal(after, before);
      const blob = ctx.game.log.map((l) => l.text).join(" ");
      if (p.role === "gobbler") assert.equal(blob.includes(p.name + " finished"), false);
    }
    if (ctx.game.phase === "ended") break;
    applyAction(ctx.game, ctx.seats[0].id, { type: "advance" }, ctx.now(), ctx.random);
  }
  assert.ok(seen.size >= 8);
});

test("kid missions score double and use the kid bank", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], { kid: true }, 4));
  const kid = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "kid");
  const mission = kid.missions.find((m) => m.round === 1);
  assert.equal(mission.pool, "kid");
  applyAction(ctx.game, kid.id, { type: "complete_mission" }, ctx.now(), ctx.random);
  assert.equal(kid.points, 20);
  const pilgrim = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "pilgrim");
  applyAction(ctx.game, pilgrim.id, { type: "complete_mission" }, ctx.now(), ctx.random);
  assert.equal(pilgrim.points, 10);
});

test("grandma peeks once and only her phone learns the role", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], { grandma: true }, 6));
  const grandma = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "grandma");
  const other = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.id !== grandma.id);
  const peek = applyAction(ctx.game, grandma.id, { type: "peek", targetId: other.id }, ctx.now(), ctx.random);
  assert.equal(peek.ok, true, peek.error);
  assert.equal(grandma.peek.role, other.role);
  const again = applyAction(ctx.game, grandma.id, { type: "peek", targetId: other.id }, ctx.now(), ctx.random);
  assert.equal(again.ok, false);
  const her = JSON.stringify(viewFor(ctx.game, grandma.id, ctx.now()));
  const theirs = JSON.stringify(viewFor(ctx.game, other.id, ctx.now()));
  assert.equal(her.includes(grandma.peek.label), true);
  if (other.role !== "pilgrim") assert.equal(theirs.includes(grandma.peek.label), false);
});

test("views hide other roles, missions, and tokens", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], { grandma: true, pieGuard: true, kid: true }, 11));
  for (const seat of ctx.seats) {
    const view = viewFor(ctx.game, seat.id, ctx.now());
    const raw = JSON.stringify(view);
    assert.equal(raw.includes(seat.token), false);
    assert.ok(view.players.every((p) => p.role == null));
    for (const other of ctx.seats) {
      if (other.id === seat.id) continue;
      for (const mission of player(ctx.game, other.id).missions) {
        assert.equal(raw.includes(mission.text), false);
      }
    }
  }
});

test("majority catches a gobbler and half the table does not", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 2));
  const gobbler = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "gobbler");
  const voters = ctx.seats.filter((s) => s.id !== gobbler.id);
  applyAction(ctx.game, voters[0].id, { type: "accuse", targetId: gobbler.id }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "vote");
  assert.equal(ctx.game.vote.needed, 3);
  applyAction(ctx.game, voters[0].id, { type: "vote", choice: "out" }, ctx.now(), ctx.random);
  applyAction(ctx.game, voters[1].id, { type: "vote", choice: "out" }, ctx.now(), ctx.random);
  applyAction(ctx.game, voters[2].id, { type: "vote", choice: "stay" }, ctx.now(), ctx.random);
  applyAction(ctx.game, gobbler.id, { type: "vote", choice: "stay" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "round");
  assert.equal(player(ctx.game, gobbler.id).alive, true);

  const again = voters.find((s) => player(ctx.game, s.id).accusedRound !== ctx.game.round.number);
  applyAction(ctx.game, again.id, { type: "accuse", targetId: gobbler.id }, ctx.now(), ctx.random);
  for (const s of ctx.seats) {
    const choice = s.id === gobbler.id ? "stay" : "out";
    applyAction(ctx.game, s.id, { type: "vote", choice }, ctx.now(), ctx.random);
  }
  assert.equal(ctx.game.winner, "pilgrims");
  assert.equal(player(ctx.game, gobbler.id).caught, true);
  const ended = viewFor(ctx.game, voters[0].id, ctx.now());
  assert.ok(ended.recap.players.some((p) => p.role === "gobbler" && p.name === gobbler.name));
});

test("a false accusation eats a dish unless the pie shield holds", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], { pieGuard: true }, 8));
  const innocent = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "pilgrim" || p.role === "grandma" || p.role === "kid");
  const guard = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "pieguard");
  const accuser = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.id !== innocent.id && p.id !== guard.id);
  applyAction(ctx.game, guard.id, { type: "shield", targetId: innocent.id }, ctx.now(), ctx.random);
  applyAction(ctx.game, accuser.id, { type: "accuse", targetId: innocent.id }, ctx.now(), ctx.random);
  for (const s of ctx.seats) {
    applyAction(ctx.game, s.id, { type: "vote", choice: "out" }, ctx.now(), ctx.random);
  }
  assert.equal(player(ctx.game, innocent.id).alive, true);
  assert.equal(ctx.game.feast.filter((d) => d.eaten).length, 0);
  assert.ok(guard.points >= 12);
  assert.equal(ctx.game.phase, "round");

  applyAction(ctx.game, ctx.seats[0].id, { type: "advance" }, ctx.now(), ctx.random);
  const accuser2 = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.alive && p.id !== innocent.id);
  applyAction(ctx.game, accuser2.id, { type: "accuse", targetId: innocent.id }, ctx.now(), ctx.random);
  for (const s of ctx.seats) {
    if (!player(ctx.game, s.id).alive) continue;
    applyAction(ctx.game, s.id, { type: "vote", choice: "out" }, ctx.now(), ctx.random);
  }
  assert.equal(player(ctx.game, innocent.id).alive, false);
  assert.equal(ctx.game.feast.filter((d) => d.eaten).length, 1);
});

test("empty feast makes the gobblers win", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 5));
  const gobbler = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "gobbler");
  for (let i = 0; i < 10; i++) {
    const mission = gobbler.missions.find((m) => m.round === ctx.game.round.number && !m.done);
    assert.ok(mission, "gobbler should have a mission");
    applyAction(ctx.game, gobbler.id, { type: "complete_mission" }, ctx.now(), ctx.random);
    if (ctx.game.winner) break;
    applyAction(ctx.game, ctx.seats[0].id, { type: "advance" }, ctx.now(), ctx.random);
  }
  assert.equal(ctx.game.winner, "gobblers");
  assert.equal(ctx.game.feast.every((d) => d.eaten), true);
});

test("pie time: the right names win, the wrong names lose", () => {
  const right = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 12));
  const gobbler = right.seats.map((s) => player(right.game, s.id)).find((p) => p.role === "gobbler");
  applyAction(right.game, right.seats[0].id, { type: "pie_time" }, right.now(), right.random);
  assert.equal(right.game.phase, "pie");
  assert.equal(right.game.pie.needed, 1);
  for (const s of right.seats) {
    applyAction(right.game, s.id, { type: "pie_pick", targetId: gobbler.id }, right.now(), right.random);
    applyAction(right.game, s.id, { type: "pie_lock" }, right.now(), right.random);
  }
  assert.equal(right.game.winner, "pilgrims");
  const awards = right.game.awards.map((a) => a.id);
  assert.ok(awards.includes("best-liar"));

  const wrong = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 12));
  const g2 = wrong.seats.map((s) => player(wrong.game, s.id)).find((p) => p.role === "gobbler");
  const fall = wrong.seats.map((s) => player(wrong.game, s.id)).find((p) => p.id !== g2.id);
  applyAction(wrong.game, wrong.seats[0].id, { type: "pie_time" }, wrong.now(), wrong.random);
  for (const s of wrong.seats) {
    applyAction(wrong.game, s.id, { type: "pie_pick", targetId: fall.id }, wrong.now(), wrong.random);
    applyAction(wrong.game, s.id, { type: "pie_lock" }, wrong.now(), wrong.random);
  }
  assert.equal(wrong.game.winner, "gobblers");
});

test("a tied pie vote still counts when the truth is in the tie", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 15));
  const gobbler = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "gobbler");
  const other = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.id !== gobbler.id);
  applyAction(ctx.game, ctx.seats[0].id, { type: "pie_time" }, ctx.now(), ctx.random);
  const half = ctx.seats.slice(0, 2);
  const rest = ctx.seats.slice(2);
  for (const s of half) {
    applyAction(ctx.game, s.id, { type: "pie_pick", targetId: gobbler.id }, ctx.now(), ctx.random);
    applyAction(ctx.game, s.id, { type: "pie_lock" }, ctx.now(), ctx.random);
  }
  for (const s of rest) {
    applyAction(ctx.game, s.id, { type: "pie_pick", targetId: other.id }, ctx.now(), ctx.random);
    applyAction(ctx.game, s.id, { type: "pie_lock" }, ctx.now(), ctx.random);
  }
  assert.equal(ctx.game.winner, "pilgrims");
});

test("two gobblers must both be named", () => {
  const ctx = startDinner(table(["A", "B", "C", "D", "E", "F", "G", "H"], { gobblerCount: 2 }, 21));
  assert.equal(ctx.seats.filter((s) => player(ctx.game, s.id).role === "gobbler").length, 2);
  const gobblers = ctx.seats.filter((s) => player(ctx.game, s.id).role === "gobbler");
  applyAction(ctx.game, ctx.seats[0].id, { type: "pie_time" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.pie.needed, 2);
  for (const s of ctx.seats) {
    applyAction(ctx.game, s.id, { type: "pie_pick", targetId: gobblers[0].id }, ctx.now(), ctx.random);
    applyAction(ctx.game, s.id, { type: "pie_pick", targetId: gobblers[1].id }, ctx.now(), ctx.random);
    const locked = applyAction(ctx.game, s.id, { type: "pie_lock" }, ctx.now(), ctx.random);
    assert.equal(locked.ok, true, locked.error);
  }
  assert.equal(ctx.game.winner, "pilgrims");
});

test("the round timer and the vote timer are host and clock driven", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 18));
  const ends = ctx.game.round.endsAt;
  const gobbler = ctx.seats.map((s) => player(ctx.game, s.id)).find((p) => p.role === "gobbler");
  const accuser = ctx.seats.find((s) => s.id !== gobbler.id);
  applyAction(ctx.game, accuser.id, { type: "accuse", targetId: gobbler.id }, ctx.now(), ctx.random);
  assert.equal(ctx.game.round.endsAt, null);
  assert.ok(ctx.game.round.remainingMs > 0);
  assert.ok(ctx.game.round.remainingMs < ends);
  const voteEnd = ctx.game.vote.endsAt;
  tick(ctx.game, voteEnd, ctx.random);
  assert.equal(ctx.game.phase, "round");
  assert.equal(player(ctx.game, gobbler.id).alive, true);
  const roundEnd = ctx.game.round.endsAt;
  tick(ctx.game, roundEnd, ctx.random);
  assert.equal(ctx.game.round.number, 2);
});

test("one accusation per player per round, and you cannot accuse yourself", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 19));
  const [a, b] = ctx.seats;
  assert.equal(applyAction(ctx.game, a.id, { type: "accuse", targetId: a.id }, ctx.now(), ctx.random).ok, false);
  assert.equal(applyAction(ctx.game, a.id, { type: "accuse", targetId: b.id }, ctx.now(), ctx.random).ok, true);
  assert.equal(applyAction(ctx.game, a.id, { type: "accuse", targetId: b.id }, ctx.now(), ctx.random).ok, false);
});

test("rematch keeps the seats and restores the feast", () => {
  const ctx = startDinner(table(["Ann", "Bo", "Cy", "Dee"], {}, 22));
  applyAction(ctx.game, ctx.seats[0].id, { type: "pie_time" }, ctx.now(), ctx.random);
  const fallGuy = ctx.seats[1].id;
  for (const s of ctx.seats) {
    applyAction(ctx.game, s.id, { type: "pie_pick", targetId: fallGuy }, ctx.now(), ctx.random);
    applyAction(ctx.game, s.id, { type: "pie_lock" }, ctx.now(), ctx.random);
  }
  assert.equal(ctx.game.phase, "ended");
  const token = ctx.seats[1].token;
  const again = applyAction(ctx.game, ctx.seats[0].id, { type: "rematch" }, ctx.now(), ctx.random);
  assert.equal(again.ok, true, again.error);
  assert.equal(ctx.game.phase, "lobby");
  assert.equal(ctx.game.feast.every((d) => !d.eaten), true);
  assert.equal(ctx.game.players[ctx.seats[1].id].token, token);
  assert.equal(ctx.game.players[ctx.seats[1].id].role, null);
});

test("names are cleaned and rude names are refused", () => {
  const created = createGame({ code: "TEST", hostName: "  Ann   Bee  ", now: 1 });
  assert.equal(created.player.name, "Ann Bee");
  const joined = joinGame(created.game, "ann bee", 2);
  assert.equal(joined.ok, false);
  const rude = joinGame(created.game, "ohshit", 3);
  assert.equal(rude.ok, false);
});
