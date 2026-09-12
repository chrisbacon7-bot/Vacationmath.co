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

const CHAIN = /marriott|hilton|hyatt|hampton|courtyard|fairfield|holiday inn|westin|sheraton|renaissance|canopy|conrad|waldorf|ritz-carlton|ritz carlton|st\.?\s*regis|\bedition\b|four seasons|fairmont|jw marriott|aloft|moxy|motto|tru\b|ibis|novotel|premier inn|travelodge|autograph|tribute|curio|garden inn|intercontinental|hotel indigo|crowne plaza|residence inn|springhill|home2|homewood|embassy|doubletree|andaz|grand hyatt|park hyatt|le m[eé]ridien|luxury collection|outrigger|all-star|pop century|art of animation|caribbean beach|port orleans|coronado|grand floridian|contemporary|polynesian|beach club|yacht club|boardwalk|grand californian|disneyland hotel|pixar place|sandals|royalton|riu |iberostar|hard rock|ziva|zilara|secrets |dreams |excellence|moon palace|live aqua|ac hotel|kimpton|drury|best western|omni |sofitel|nh collection|raffles|mandarin|langham|wynn|bellagio|venetian|park mgm|movenpick|mövenpick|belmond/i;
const BOUTIQUE = /\bace hotel|\bace\b|proper |freehand|1 hotel|the hoxton|pendry/i;
function brandHits(text) {
  return CHAIN.test(text || "");
}
let chain = 0;
let bout = 0;
let bullets = 0;
const pri = ["los_angeles", "anaheim", "nyc", "vegas", "chicago", "miami", "san_francisco", "san_diego", "philadelphia", "atlanta", "dallas", "houston", "seattle", "boston", "washington_dc", "london", "paris", "rome", "tokyo", "disney", "oahu", "maui", "key_west", "palm_springs", "napa"];
pri.forEach((id) => {
  let c = 0;
  let n = 0;
  styles.forEach((s) => {
    const picks = (((P.HOTEL_EXAMPLES[id] || {})[s] || {}).picks) || [];
    picks.forEach((p) => {
      n += 1;
      bullets += 1;
      if (brandHits(p)) {
        c += 1;
        chain += 1;
      }
      if (BOUTIQUE.test(p)) bout += 1;
    });
  });
  console.log("brands", id, "chain", c + "/" + n);
});
const allIds = Object.keys(P.HOTEL_EXAMPLES || {});
let allChain = 0;
let allN = 0;
allIds.forEach((id) => {
  styles.forEach((s) => {
    const picks = (((P.HOTEL_EXAMPLES[id] || {})[s] || {}).picks) || [];
    picks.forEach((p) => {
      allN += 1;
      if (brandHits(p)) allChain += 1;
    });
  });
});
console.log("ALL hotel bullets", allN, "chain hits", allChain);
fbKeys.forEach((k) => {
  const picks = styles.flatMap((s) => ((P.HOTEL_FALLBACKS[k][s] || {}).picks || []));
  const c = picks.filter(brandHits).length;
  console.log("fallback brands", k, c + "/" + picks.length);
});
