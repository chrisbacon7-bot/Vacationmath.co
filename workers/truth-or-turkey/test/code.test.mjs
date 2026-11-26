import assert from "node:assert/strict";
import { test } from "node:test";
import { CODE_RE } from "../src/game.js";
import { CODE_ALPHABET, CODE_BLOCK, makeCode } from "../src/codes.js";

test("new codes are four easy letters", () => {
  assert.equal(CODE_ALPHABET.includes("I"), false);
  assert.equal(CODE_ALPHABET.includes("L"), false);
  assert.equal(CODE_ALPHABET.includes("O"), false);
  assert.equal(CODE_ALPHABET.includes("Q"), false);
  assert.equal(CODE_ALPHABET.includes("U"), false);
  assert.equal(CODE_ALPHABET.includes("V"), false);
  assert.equal(CODE_ALPHABET.includes("W"), false);
  assert.equal(/[0-9]/.test(CODE_ALPHABET), false);
  for (let i = 0; i < 400; i++) {
    const code = makeCode();
    assert.match(code, /^[ABCDEFGHJKMNPRSTXYZ]{4}$/);
    assert.equal(CODE_BLOCK.has(code), false);
    assert.equal(CODE_RE.test(code), true);
  }
});

test("a rude draw is skipped", () => {
  const crap = Uint8Array.from([2, 13, 0, 12]);
  const abcd = Uint8Array.from([0, 1, 2, 3]);
  let draws = 0;
  const code = makeCode(() => (draws++ === 0 ? crap : abcd));
  assert.equal(code, "ABCD");
  assert.equal(draws, 2);
  assert.equal(CODE_BLOCK.has("CRAP"), true);
});

test("tonight's mixed codes still match the join check", () => {
  for (const code of ["N8J3", "AB3K", "QLVW", "WXYZ", "HHHH"]) {
    assert.equal(CODE_RE.test(code), true, code);
  }
  assert.equal(CODE_RE.test("n8j3"), false);
  assert.equal(CODE_RE.test("I0O1"), false);
  assert.equal(CODE_RE.test("ABC"), false);
  assert.equal(CODE_RE.test("ABCD1"), false);
});
