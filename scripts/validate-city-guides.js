/* Validate city briefs: 20 dests, 5–8 tips, hotel/food/act recs present. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {}, console };
ctx.window = ctx;
ctx.global = ctx;
vm.createContext(ctx);

function run(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
}

run("trip-finder-data.js");
run("plan-data.js");
run("plan-recs-extra.js");
run("city-guides-data.js");

const REQUIRED = [
  "disney", "anaheim", "los_angeles", "nyc", "vegas", "miami",
  "san_francisco", "chicago", "nola", "philadelphia", "atlanta",
  "paris", "london", "rome", "tokyo", "cancun", "oahu", "maui",
  "cruise", "key_west"
];

const P = ctx.VM_PLAN_DATA;
const G = ctx.VM_CITY_GUIDES;
const errors = [];

if (G.ALL.length !== 20) errors.push("expected 20 guides, got " + G.ALL.length);

REQUIRED.forEach(function (id) {
  const g = G.BY_ID[id];
  if (!g) {
    errors.push(id + ": missing guide copy");
    return;
  }
  ["hook", "blurb", "whenGo", "whenSkip", "whenNote", "around", "budgetNote"].forEach(function (k) {
    if (!g[k] || String(g[k]).length < 20) errors.push(id + ": weak " + k);
  });
  const tips = g.tips || [];
  if (tips.length < 5 || tips.length > 8) errors.push(id + ": tips " + tips.length + " (need 5–8)");
  if ((g.aroundBullets || []).length < 2) errors.push(id + ": need around bullets");

  const html = path.join(root, "guides", id + ".html");
  if (!fs.existsSync(html)) errors.push(id + ": missing guides/" + id + ".html");
  else {
    const src = fs.readFileSync(html, "utf8");
    if (src.indexOf("VM_CITY_GUIDE_ID = " + JSON.stringify(id)) < 0) errors.push(id + ": html id mismatch");
    if (src.indexOf("FILE_PLACEHOLDER") >= 0) errors.push(id + ": FILE_PLACEHOLDER");
  }

  const hotel = P.HOTEL_EXAMPLES[id];
  ["budget", "mid", "lux"].forEach(function (s) {
    const n = hotel && hotel[s] && hotel[s].picks ? hotel[s].picks.length : 0;
    if (n < 3) errors.push(id + ": hotel " + s + " has " + n);
  });
  const food = P.FOOD_PICKS[id];
  ["budget", "mid", "lux"].forEach(function (s) {
    const n = food && food[s] ? food[s].length : 0;
    if (n < 3) errors.push(id + ": food " + s + " has " + n);
  });
  const act = P.ACTIVITIES[id];
  ["budget", "mid", "lux"].forEach(function (s) {
    const n = act && act[s] ? act[s].length : 0;
    if (n < 3) errors.push(id + ": activities " + s + " has " + n);
  });
});

if (errors.length) {
  console.error("FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log("ok 20 city briefs with hotel/food/act recs and 5–8 tips each");
