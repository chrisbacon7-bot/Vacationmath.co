import assert from "node:assert/strict";
import { test } from "node:test";
import { THEMES } from "../src/themes.js";
import { applyAction, createGame, joinGame, makeRng, seedRng, tick, viewFor } from "../src/game.js";

function rng(seed = 1) {
  return makeRng(seedRng(seed));
}

function table(names, rounds = 2, seed = 1) {
  const random = rng(seed);
  let now = 1_000_000;
  const created = createGame({ code: "TEST", hostName: names[0], now });
  assert.equal(created.ok, true);
  const game = created.game;
  const seats = [created.player];
  for (const name of names.slice(1)) {
    now += 5;
    const joined = joinGame(game, name, now);
    assert.equal(joined.ok, true, joined.error);
    seats.push(joined.player);
  }
  for (const seat of seats) seat.connected = true;
  const set = applyAction(game, seats[0].id, { type: "settings", rounds }, now, random);
  assert.equal(set.ok, true, set.error);
  return { game, seats, random, now: () => (now += 1000) };
}

function start(ctx) {
  const res = applyAction(ctx.game, ctx.seats[0].id, { type: "start" }, ctx.now(), ctx.random);
  assert.equal(res.ok, true, res.error);
  assert.equal(ctx.game.phase, "write");
  return ctx;
}

function submitAll(ctx, prefix) {
  ctx.seats.forEach((seat, i) => {
    const res = applyAction(ctx.game, seat.id, {
      type: "submit",
      truth: `${prefix} truth from ${i} here`,
      turkey: `${prefix} turkey from ${i} here`,
    }, ctx.now(), ctx.random);
    assert.equal(res.ok, true, res.error);
  });
}

test("themes stay in order and copy has no dashes", () => {
  assert.deepEqual(THEMES.map((t) => t.id), ["thankful", "past", "food", "kid"]);
  for (const theme of THEMES) {
    assert.equal(theme.prompt.includes("\u2014"), false);
    assert.equal(theme.truthHint.includes("\u2014"), false);
  }
});

test("two players can play two rounds and points add up", () => {
  const ctx = start(table(["Alex", "Sam"], 2, 4));
  submitAll(ctx, "RoundA");
  assert.equal(ctx.game.phase, "defend");
  const author = ctx.game.players[ctx.game.turnOrder[0]];
  const other = ctx.seats.find((s) => s.id !== author.id);
  const view = viewFor(ctx.game, other.id, ctx.now());
  assert.equal(view.turn.truthPos, null);
  assert.equal(view.turn.statements.length, 2);
  assert.equal(JSON.stringify(view).includes(author.token), false);
  const truthPos = viewFor(ctx.game, author.id, ctx.now()).turn.yourTruthPos;
  applyAction(ctx.game, other.id, { type: "vote", pick: truthPos === 0 ? 1 : 0 }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "reveal");
  assert.equal(ctx.game.players[author.id].fooled, 1);
  assert.equal(ctx.game.players[author.id].points, 1);
  assert.equal(ctx.game.players[other.id].correctGuesses, 0);
  applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "defend");
  const author2 = ctx.game.players[ctx.game.turnOrder[ctx.game.turnIndex]];
  const other2 = ctx.seats.find((s) => s.id !== author2.id);
  const pos2 = viewFor(ctx.game, author2.id, ctx.now()).turn.yourTruthPos;
  applyAction(ctx.game, other2.id, { type: "vote", pick: pos2 }, ctx.now(), ctx.random);
  assert.equal(ctx.game.players[other2.id].correctGuesses, 1);
  applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "write");
  assert.equal(ctx.game.roundIndex, 1);
  assert.equal(viewFor(ctx.game, ctx.seats[0].id, ctx.now()).round.title, "Thanksgivings past");
  submitAll(ctx, "RoundB");
  while (ctx.game.phase !== "ended") {
    if (ctx.game.phase === "defend") {
      const aid = ctx.game.turnOrder[ctx.game.turnIndex];
      const voter = ctx.seats.find((s) => s.id !== aid);
      const pos = viewFor(ctx.game, aid, ctx.now()).turn.yourTruthPos;
      applyAction(ctx.game, voter.id, { type: "vote", pick: pos }, ctx.now(), ctx.random);
    } else if (ctx.game.phase === "reveal") {
      applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
    } else break;
  }
  assert.equal(ctx.game.phase, "ended");
  const recap = viewFor(ctx.game, ctx.seats[0].id, ctx.now()).recap;
  assert.ok(recap.players.every((p) => p.points >= 1));
  assert.ok(recap.awards.some((a) => a.id === "truth-teller"));
  assert.ok(recap.awards.some((a) => a.id === "biggest-turkey"));
});

test("a correct guess scores the voter and a wrong guess scores the author", () => {
  const ctx = start(table(["Alex", "Sam", "Jo"], 1, 9));
  submitAll(ctx, "Food");
  const authorId = ctx.game.turnOrder[0];
  const voters = ctx.seats.filter((s) => s.id !== authorId);
  const pos = viewFor(ctx.game, authorId, ctx.now()).turn.yourTruthPos;
  applyAction(ctx.game, voters[0].id, { type: "vote", pick: pos }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "defend");
  applyAction(ctx.game, voters[1].id, { type: "vote", pick: pos === 0 ? 1 : 0 }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "reveal");
  assert.equal(ctx.game.players[voters[0].id].points, 1);
  assert.equal(ctx.game.players[voters[1].id].points, 0);
  assert.equal(ctx.game.players[authorId].points, 1);
  assert.equal(ctx.game.players[authorId].fooled, 1);
});

test("host can skip a slow writer and kick someone", () => {
  const ctx = start(table(["Alex", "Sam", "Jo"], 1, 3));
  applyAction(ctx.game, ctx.seats[0].id, { type: "submit", truth: "Real thankful thing", turkey: "Fake thankful thing" }, ctx.now(), ctx.random);
  applyAction(ctx.game, ctx.seats[1].id, { type: "submit", truth: "Another real thing", turkey: "Another fake thing" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "write");
  applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "defend");
  assert.equal(ctx.game.turnOrder.includes(ctx.seats[2].id), false);
  applyAction(ctx.game, ctx.seats[0].id, { type: "kick", targetId: ctx.seats[1].id }, ctx.now(), ctx.random);
  assert.equal(ctx.game.players[ctx.seats[1].id].kicked, true);
});

test("the defend clock reveals on its own, and refresh keeps the truth private", () => {
  const ctx = start(table(["Alex", "Sam"], 1, 6));
  submitAll(ctx, "Kid");
  const ends = ctx.game.defendEndsAt;
  const other = ctx.seats.find((s) => s.id !== ctx.game.turnOrder[0]);
  assert.equal(viewFor(ctx.game, other.id, ends - 1).turn.truthPos, null);
  tick(ctx.game, ends, ctx.random);
  assert.equal(ctx.game.phase, "reveal");
  assert.equal(viewFor(ctx.game, other.id, ends).turn.truthPos === 0 || viewFor(ctx.game, other.id, ends).turn.truthPos === 1, true);
});

test("a late joiner waits for the next round, and stepping out does not stall the vote", () => {
  const ctx = start(table(["Ann", "Bo"], 2, 8));
  const late = joinGame(ctx.game, "Cy", ctx.now());
  assert.equal(late.ok, true, late.error);
  assert.equal(late.player.playFromRound, 0);
  applyAction(ctx.game, ctx.seats[0].id, { type: "submit", truth: "Ann real thankful note", turkey: "Ann fake thankful note" }, ctx.now(), ctx.random);
  applyAction(ctx.game, ctx.seats[1].id, { type: "submit", truth: "Bo real thankful note", turkey: "Bo fake thankful note" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "write");
  applyAction(ctx.game, late.player.id, { type: "submit", truth: "Cy real thankful note", turkey: "Cy fake thankful note" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "defend");
  const during = joinGame(ctx.game, "Dee", ctx.now());
  assert.equal(during.ok, true, during.error);
  assert.equal(during.player.playFromRound, 1);
  const author = ctx.game.turnOrder[0];
  for (const id of [ctx.seats[0].id, ctx.seats[1].id, late.player.id]) {
    if (id === author) continue;
    applyAction(ctx.game, id, { type: "vote", pick: 0 }, ctx.now(), ctx.random);
  }
  assert.equal(ctx.game.phase, "reveal");
  applyAction(ctx.game, during.player.id, { type: "leave" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.players[during.player.id].kicked, true);
});

test("tied awards name everyone, and a player who never votes stays at zero guesses", () => {
  const ctx = start(table(["Ada", "Bea", "Cam"], 1, 4));
  submitAll(ctx, "Tie");
  const ledger = { Ada: { points: 0, correct: 0, fooled: 0 }, Bea: { points: 0, correct: 0, fooled: 0 }, Cam: { points: 0, correct: 0, fooled: 0 } };
  const plan = [
    { correct: ["Bea"], wrong: ["Cam"] },
    { correct: ["Ada"], wrong: ["Cam"] },
    { correct: [], wrong: ["Ada", "Bea"] },
  ];
  let turn = 0;
  while (ctx.game.phase !== "ended") {
    if (ctx.game.phase === "reveal") {
      applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
      continue;
    }
    if (ctx.game.phase !== "defend") break;
    const author = ctx.game.players[ctx.game.turnOrder[ctx.game.turnIndex]];
    const sub = ctx.game.submissions[String(ctx.game.roundIndex)][author.id];
    const pos = sub.order.indexOf("truth");
    const step = plan[turn];
    for (const name of step.correct) {
      const voter = ctx.seats.find((s) => s.name === name);
      applyAction(ctx.game, voter.id, { type: "vote", pick: pos }, ctx.now(), ctx.random);
      ledger[name].points += 1; ledger[name].correct += 1;
    }
    for (const name of step.wrong) {
      const voter = ctx.seats.find((s) => s.name === name);
      applyAction(ctx.game, voter.id, { type: "vote", pick: pos === 0 ? 1 : 0 }, ctx.now(), ctx.random);
      ledger[author.name].points += 1; ledger[author.name].fooled += 1;
    }
    turn += 1;
  }
  assert.equal(ctx.game.phase, "ended");
  for (const seat of ctx.seats) {
    const got = ctx.game.players[seat.id];
    assert.equal(got.points, ledger[seat.name].points, seat.name);
    assert.equal(got.correctGuesses, ledger[seat.name].correct, seat.name + " guesses");
    assert.equal(got.fooled, ledger[seat.name].fooled, seat.name + " fooled");
  }
  assert.equal(ctx.game.players[ctx.seats[2].id].correctGuesses, 0);
  const teller = ctx.game.awards.find((a) => a.id === "truth-teller");
  assert.deepEqual(teller.names.sort(), ["Ada", "Bea"]);
  const turkey = ctx.game.awards.find((a) => a.id === "biggest-turkey");
  assert.deepEqual(turkey.names, ["Cam"]);
});

test("rematch keeps the token and clears the score", () => {
  const ctx = start(table(["Alex", "Sam"], 1, 2));
  submitAll(ctx, "Past");
  const other = ctx.seats.find((s) => s.id !== ctx.game.turnOrder[0]);
  const pos = viewFor(ctx.game, ctx.game.turnOrder[0], ctx.now()).turn.yourTruthPos;
  applyAction(ctx.game, other.id, { type: "vote", pick: pos === 0 ? 1 : 0 }, ctx.now(), ctx.random);
  applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
  while (ctx.game.phase === "defend" || ctx.game.phase === "reveal") {
    if (ctx.game.phase === "defend") {
      const aid = ctx.game.turnOrder[ctx.game.turnIndex];
      const voter = ctx.seats.find((s) => s.id !== aid);
      applyAction(ctx.game, voter.id, { type: "vote", pick: 0 }, ctx.now(), ctx.random);
    } else applyAction(ctx.game, ctx.seats[0].id, { type: "skip" }, ctx.now(), ctx.random);
  }
  assert.equal(ctx.game.phase, "ended");
  const token = ctx.seats[1].token;
  applyAction(ctx.game, ctx.seats[0].id, { type: "rematch" }, ctx.now(), ctx.random);
  assert.equal(ctx.game.phase, "lobby");
  assert.equal(ctx.game.players[ctx.seats[1].id].token, token);
  assert.equal(ctx.game.players[ctx.seats[1].id].points, 0);
});
