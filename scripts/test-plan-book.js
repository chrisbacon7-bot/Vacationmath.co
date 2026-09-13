/* Unit checks for /plan Where-to-book tabs + line-tip cleanup */
const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const ctx = {
  console: console,
  document: {
    readyState: "loading",
    addEventListener: function () {},
    getElementById: function () { return null; },
    querySelector: function () { return null; },
    querySelectorAll: function () { return []; }
  }
};
ctx.window = ctx;
ctx.global = ctx;
vm.createContext(ctx);

function run(path) {
  vm.runInContext(fs.readFileSync(path, "utf8"), ctx, { filename: path });
}

run("/workspace/trip-finder-data.js");
run("/workspace/plan-data.js");
run("/workspace/plan-recs-extra.js");
run("/workspace/plan.js");

const P = ctx.VM_PLAN;
assert.ok(P, "VM_PLAN exported");
assert.ok(typeof P.parsePick === "function");
assert.ok(typeof P.bookHtml === "function");

const hotel = P.parsePick("Hyatt Regency Los Angeles Downtown — L.A. LIVE, Metro in the block");
assert.strictEqual(hotel.name, "Hyatt Regency Los Angeles Downtown");
assert.ok(/L\.A\. LIVE/.test(hotel.why));

const food = P.parsePick("Breakfast: Republique counter or a neighborhood café — no hotel restaurant");
assert.strictEqual(food.name, "Republique counter or a neighborhood café");
assert.ok(/Breakfast/.test(food.why));

const act = P.parsePick("Getty Center — reservation, free entry, pay parking or Metro (free / cheap)");
assert.strictEqual(act.name, "Getty Center");
assert.ok(!/\(free/.test(act.why));
assert.ok(/free/i.test(act.posture));

const season = P.parsePick("Aim for January (good weather, shoulder rates).");
assert.strictEqual(season.name, "January");
assert.ok(/Aim for/.test(season.why));

const chips = P.chipsFor("hotel", hotel);
assert.ok(chips.indexOf("Points-friendly") >= 0, "Hyatt gets Points-friendly");
assert.ok(chips.indexOf("Brand") < 0, "chain hotels use Points-friendly, not a second Brand chip");
const ace = P.chipsFor("hotel", P.parsePick("Ace Hotel Downtown — boutique if you want Grand Central Market walking"));
assert.ok(ace.indexOf("Brand") >= 0, "Ace is Brand, not a points chain");

const dest = P.destById("los_angeles");
assert.strictEqual(dest.id, "los_angeles");
const midHotels = P.hotelExamplesFor(dest, "mid");
assert.ok(midHotels.length >= 4, "LA mid has 4–6 hotel rows");
assert.ok(/Hyatt Regency/.test(midHotels[0]), "LA Solid leads with a brand name");

const recs = P.buildRecs(dest, { origin: "atl", nights: 5, adults: 2, kids: 0, month: "" }, "mid");
assert.ok(recs.hotel.items.length >= 4 && recs.hotel.items.length <= 6);
assert.ok(recs.food.items.length >= 4 && recs.food.items.length <= 6);
assert.ok(recs.activities.items.length >= 4 && recs.activities.items.length <= 6);

const solid = {
  selectedTier: "solid",
  dest: dest,
  recs: recs,
  tiers: [{ selected: true, styleLabel: "Mid-range" }]
};
const html = P.bookHtml(solid);
assert.ok(/Where to book/.test(html), "section title");
assert.ok(/role="tablist"/.test(html));
assert.ok(/data-book-tab="hotel"/.test(html));
assert.ok(/data-book-tab="transit"/.test(html));
assert.ok(/Getting there/.test(html));
assert.ok(!/Recommendations/.test(html));
assert.ok(/plan-book-tab-hotel[\s\S]*aria-selected="true"/.test(html), "Hotel tab selected by default");
assert.ok(/plan-book-panel-food[\s\S]* hidden/.test(html) || /id="plan-book-panel-food"[^>]*hidden/.test(html));
assert.ok(/Hyatt Regency Los Angeles Downtown/.test(html));
assert.ok(/plan-book-name/.test(html));
assert.ok(!/FILE_PLACEHOLDER/.test(html));
assert.ok(!/href="https?:\/\/(www\.)?(booking|expedia|hotels)\./i.test(html), "no affiliate hotel links");

const lodgingTip = P.tipForLine(
  { label: "Lodging + occupancy tax", amount: 2000 },
  dest,
  { nights: 5, origin: "atl" },
  "mid"
);
assert.ok(/See Hotel picks above/.test(lodgingTip.text));
assert.ok(/Hyatt Regency/.test(lodgingTip.text));
assert.ok(!lodgingTip.detail, "lodging tip is one sentence, no dump");

const foodTip = P.tipForLine(
  { label: "Food, transit & attractions", amount: 2000 },
  dest,
  { nights: 5, origin: "atl" },
  "mid"
);
assert.ok(/See Food picks above/.test(foodTip.text));
assert.ok(!foodTip.detail);

const flyTip = P.tipForLine(
  { label: "Getting there", amount: 640 },
  dest,
  { nights: 5, origin: "atl" },
  "mid"
);
assert.ok(flyTip.text.length < 180, "flight tip stays one line");
assert.ok(!flyTip.detail);

const leanRecs = P.buildRecs(dest, { origin: "atl", nights: 5, adults: 2, kids: 0, month: "" }, "budget");
assert.ok(/Hampton Inn/.test(leanRecs.hotel.items[0]), "Lean hotel list is a different band");
assert.ok(leanRecs.hotel.items[0] !== recs.hotel.items[0], "tier switch swaps hotel rows");

P.selectRecTab("food");
const foodHtml = P.bookHtml(solid);
assert.ok(/plan-book-tab-food"[\s\S]*?aria-selected="true"/.test(foodHtml) || /id="plan-book-tab-food"[^>]*aria-selected="true"/.test(foodHtml));

const guideCard = P.moneyGuideCard(dest);
assert.ok(/Open the Los Angeles money guide/.test(guideCard), "results CTA names the dest money guide");
assert.ok(/Download \/ Print money guide/.test(guideCard), "results CTA includes download/print");
assert.ok(/href="\/guides\/los_angeles"/.test(guideCard));
assert.ok(!P.moneyGuideCard({ id: "unknown_place", label: "Nope" }), "no card for dests without a guide");

console.log("test-plan-book: ok");
