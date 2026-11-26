// New tables get four letters you can say across a dinner table.
// Dropped lookalikes and awkward letters: I, L, O, Q, U, V, W. No digits.
// Lookup still uses CODE_RE in game.js, so tonight's mixed codes still join.
export const CODE_ALPHABET = "ABCDEFGHJKMNPRSTXYZ";
export const CODE_BLOCK = new Set([
  "ANAL", "ANUS", "ARSE", "BDSM", "BUTT", "COCK", "COON", "CRAP", "CUNT", "DAMN",
  "DICK", "DYKE", "FAGG", "FAGS", "FART", "FECK", "FUCK", "GASH", "GOOK", "HATE",
  "HEBE", "HELL", "HOMO", "JAPS", "JERK", "KIKE", "KILL", "KNOB", "KYKE", "MING",
  "NAZI", "PISS", "PORN", "PRAT", "RAPE", "SEXY", "SHAG", "SHIT", "SLAG", "SLUT",
  "SMUT", "SPAZ", "SPIC", "SUCK", "TURD", "TWAT", "WANK",
]);

export function makeCode(readBytes) {
  const draw = readBytes || (() => {
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    return bytes;
  });
  let last = "ABCD";
  for (let n = 0; n < 16; n++) {
    const bytes = draw();
    let out = "";
    for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
    last = out;
    if (!CODE_BLOCK.has(out)) return out;
  }
  return last;
}
