/* Validate destination catalog + rec thickness after plan-recs-extra.js */
const fs = require("fs");
const vm = require("vm");

const ctx = { window: {}, console };
ctx.window = ctx;
ctx.global = ctx;
vm.createContext(ctx);

function run(path) {
  vm.runInContext(fs.readFileSync(path, "utf8"), ctx, { filename: path });
}

run("/workspace/trip-finder-data.js");
run("/workspace/plan-data.js");
run("/workspace/plan-recs-extra.js");

const TF = ctx.VM_TRIPFINDER_DATA.DESTINATIONS;
const P = ctx.VM_PLAN_DATA;
const NEW_IDS = [
  "anaheim", "key_west", "philadelphia", "atlanta", "dallas", "houston",
  "san_antonio", "palm_springs", "lake_tahoe", "napa", "monterey",
  "destin_30a", "outer_banks", "grand_canyon", "jackson_hole", "phoenix",
  "memphis", "portland_me", "bar_harbor", "santa_fe"
];

function hotelCount(id, style) {
  const d = P.HOTEL_EXAMPLES[id];
  return d && d[style] && d[style].picks ? d[style].picks.length : 0;
}
function foodCount(id, style) {
  const d = P.FOOD_PICKS[id];
  return d && d[style] ? d[style].length : 0;
}
function actCount(id, style) {
  const d = P.ACTIVITIES[id];
  return d && d[style] ? d[style].length : 0;
}

const styles = ["budget", "mid", "lux"];
function minMax(fn, id) {
  const ns = styles.map((s) => fn(id, s));
  return { min: Math.min.apply(null, ns), max: Math.max.apply(null, ns), ns };
}

console.log("TF dests:", TF.length);
console.log("New dests present:", NEW_IDS.filter((id) => TF.some((d) => d.id === id)).length + "/20");
console.log("Missing new:", NEW_IDS.filter((id) => !TF.some((d) => d.id === id)));

const catalog = P.DESTINATIONS;
console.log("Plan catalog:", catalog.length);
console.log("New in plan picker:", NEW_IDS.filter((id) => catalog.some((d) => d.id === id)).length + "/20");

const sample = ["los_angeles", "paris", "disney", "anaheim", "philadelphia", "tokyo", "cancun"];
sample.forEach((id) => {
  const h = minMax(hotelCount, id);
  const f = minMax(foodCount, id);
  const a = minMax(actCount, id);
  console.log(id, "hotel", h.ns.join("/"), "food", f.ns.join("/"), "act", a.ns.join("/"));
});

let thin = [];
const ids = new Set(TF.map((d) => d.id).concat(["disney", "cruise"]));
ids.forEach((id) => {
  const h = styles.map((s) => hotelCount(id, s));
  const f = styles.map((s) => foodCount(id, s));
  const a = styles.map((s) => actCount(id, s));
  const curatedH = h.some((n) => n > 0);
  const curatedF = f.some((n) => n > 0);
  const curatedA = a.some((n) => n > 0);
  if (curatedH && Math.min.apply(null, h) < 4) thin.push(id + " hotel " + h.join("/"));
  if (curatedF && Math.min.apply(null, f) < 4) thin.push(id + " food " + f.join("/"));
  if (curatedA && Math.min.apply(null, a) < 4) thin.push(id + " act " + a.join("/"));
});
console.log("Thin curated (<4):", thin.length);
thin.slice(0, 40).forEach((t) => console.log(" ", t));

const fbKeys = Object.keys(P.HOTEL_FALLBACKS || {});
fbKeys.forEach((k) => {
  const ns = styles.map((s) => ((P.HOTEL_FALLBACKS[k][s] || {}).picks || []).length);
  const fns = styles.map((s) => ((P.FOOD_FALLBACKS[k] || {})[s] || []).length);
  const ans = styles.map((s) => ((P.ACTIVITY_FALLBACKS[k] || {})[s] || []).length);
  console.log("fallback", k, "H", ns.join("/"), "F", fns.join("/"), "A", ans.join("/"));
});

const noHotel = [...ids].filter((id) => styles.every((s) => hotelCount(id, s) === 0));
console.log("Dests without curated hotel (use fallback):", noHotel.length, noHotel.slice(0, 20).join(", "));
