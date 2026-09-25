/* Validate money guides: 20 dests, locked outline, static HTML, 5–8 tips. */
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
run("city-guides-research.js");
run("city-guides-a2.js");
run("city-guides-editorial.js");
run("city-guides-lists.js");
run("city-guides-polish.js");
run("city-guides-dense.js");
run("city-guides-pilot.js");
run("city-guide.js");

const REQUIRED = [
  "disney", "anaheim", "los_angeles", "nyc", "vegas", "miami",
  "san_francisco", "chicago", "nola", "philadelphia", "atlanta",
  "paris", "london", "rome", "tokyo", "cancun", "oahu", "maui",
  "cruise", "key_west"
];

const TRANSIT = ["nyc", "paris", "london", "tokyo", "chicago", "san_francisco", "philadelphia", "rome"];
const CAR_FORK = ["los_angeles", "miami", "maui", "key_west"];
const BANNED = /\b(basin|leftover|pocket|orientation data|scavenger|villages connected|hostel-plus)\b/i;
const VAGUE = /\b(already priced|one named|a named dinner|a named chef|the same walk)\b/i;
const TAX_META = /\b(are a tax|is usually a tax|Hopper tax|tourist tax|half-day tax|Friday arrivals are a tax|SEPTA tax|room-service tax|restaurant-row tax)\b/i;
const CAR_OK = /^(Usually|Helpful|Optional|No — transit|No — ship)$/;
const COMPILED = "Compiled Sep 2026 from public rates, official calendars, and transit maps — orientation, not a field visit.";

const P = ctx.VM_PLAN_DATA;
const G = ctx.VM_CITY_GUIDES;
const R = ctx.VM_CITY_GUIDE_RESEARCH;
const errors = [];

if (G.ALL.length !== 20) errors.push("expected 20 guides, got " + G.ALL.length);

const hooks = {};
const starts = {};
const kickers = {};
const ctas = {};

REQUIRED.forEach(function (id) {
  const g = G.BY_ID[id];
  if (!g) {
    errors.push(id + ": missing guide copy");
    return;
  }
  ["hook", "blurb", "midrange", "months", "stayRule", "eatRule", "aroundRule"].forEach(function (k) {
    if (!g[k] || String(g[k]).length < 12) errors.push(id + ": weak " + k);
  });
  if (!g.nights || String(g.nights).length < 6) errors.push(id + ": weak nights");
  if (!CAR_OK.test(String(g.car || ""))) errors.push(id + ": car must be Usually/Helpful/Optional/No — transit/No — ship");
  if (!g.startHere || String(g.startHere).length < 18) errors.push(id + ": weak startHere");
  const zones = g.zones || [];
  if (zones.length < 3 || zones.length > 5) errors.push(id + ": zones " + zones.length + " (need 3–5)");
  zones.forEach(function (z, i) {
    if (!z.name || !z.note) errors.push(id + ": weak zone " + (i + 1));
  });
  ["stayTiers", "eatTiers", "doTiers"].forEach(function (key) {
    const t = g[key];
    if (!t || !t.budget || !t.mid || !t.lux) errors.push(id + ": missing " + key);
    else if (t.budget.length < 3 || t.mid.length < 3 || t.lux.length < 3) {
      errors.push(id + ": " + key + " needs 3 named bullets per band");
    }
  });
  const who = (g.forWho || []).concat(g.notFor || []);
  if (who.length < 2 || who.length > 4) errors.push(id + ": who/not-for " + who.length + " (need 2–4)");
  if (!g.aroundKind) errors.push(id + ": missing aroundKind");
  if (!g.aroundNoCar || g.aroundNoCar.length < 2) errors.push(id + ": need aroundNoCar bullets");
  if ((g.aroundKind === "fork" || g.aroundKind === "car") && (!g.aroundCar || g.aroundCar.length < 2)) {
    errors.push(id + ": fork dest needs aroundCar bullets");
  }
  if (!g.skip || g.skip.length !== 3) errors.push(id + ": skip " + ((g.skip || []).length) + " (need 3)");
  const tips = g.tips || [];
  if (tips.length !== 5) errors.push(id + ": tips " + tips.length + " (need 5)");
  var gems = tips.filter(function (t) { return /^Hidden gem:/.test(String(t)); });
  if (gems.length !== 3) errors.push(id + ": need exactly 3 Hidden gem tips, got " + gems.length);
  const notes = R && R[id];
  if (!notes || !notes.tax || !notes.gem || !notes.facts || notes.facts.length < 3) {
    errors.push(id + ": research notes incomplete");
  }
  if (!notes || !notes.sources || notes.sources.length < 4) errors.push(id + ": research sources too thin");
  (g.hidden || []).forEach(function (line) {
    if (tips.indexOf(line) >= 0) errors.push(id + ": tip duplicates a hidden-cost line");
  });
  if (!g.money || g.money.length < 4) errors.push(id + ": need 4 quick-facts money rows");
  (g.money || []).forEach(function (row) {
    if (!row.dt || !row.dd || String(row.dd).length < 12) errors.push(id + ": weak money row " + (row && row.dt));
  });
  var moneyLabels = (g.money || []).map(function (row) { return row.dt; });
  if (moneyLabels.indexOf("Mid-range room") < 0) errors.push(id + ": missing Mid-range room row");
  if (moneyLabels.indexOf("Food / person / day") < 0) errors.push(id + ": missing food row");
  if (moneyLabels.indexOf("#1 ticket") < 0) errors.push(id + ": missing ticket row");
  if (moneyLabels.indexOf("Sample total") < 0) errors.push(id + ": missing sample total");
  if (!g.tipsKicker || g.tipsKicker === "Keep the number honest") errors.push(id + ": stock tips kicker");
  if (!g.cta || /Same hotel, food, and activity names/.test(g.cta)) errors.push(id + ": stock Trip Plan CTA");
  (g.zones || []).forEach(function (z) {
    if (/\btrap\b/i.test(z.name)) errors.push(id + ": zone still titled trap: " + z.name);
  });
  if (!g.book || g.book.length < 3) errors.push(id + ": need book-before checklist");
  if (!g.hidden || g.hidden.length < 3) errors.push(id + ": need hidden costs");
  if (!g.walk || !g.walk.lead || !g.walk.day || !g.walk.trip || !g.walk.lines || g.walk.lines.length < 4) {
    errors.push(id + ": missing mid-range money walkthrough");
  } else {
    g.walk.lines.forEach(function (line, i) {
      if (!line.item || !line.cost || !/[$€£¥]/.test(String(line.cost))) {
        errors.push(id + ": walk line " + (i + 1) + " needs a currency amount");
      }
    });
    if (!/[$€£¥]/.test(String(g.walk.day)) || !/[$€£¥]/.test(String(g.walk.trip))) {
      errors.push(id + ": walkthrough day and trip need currency");
    }
  }
  ["stayTiers", "eatTiers", "doTiers"].forEach(function (key) {
    var t = g[key];
    if (!t) return;
    ["budget", "mid", "lux"].forEach(function (band) {
      (t[band] || []).forEach(function (b, i) {
        if (!/[$€£¥]/.test(String(b))) errors.push(id + ": " + key + " " + band + " bullet " + (i + 1) + " missing currency");
      });
    });
  });
  if (!g.days || g.days.length !== 3) errors.push(id + ": need 3-day skeleton");
  (g.days || []).forEach(function (d, i) {
    if (!d.title || !d.bullets || d.bullets.length < 2) errors.push(id + ": weak day " + (i + 1));
  });
  if (hooks[g.hook]) errors.push(id + ": hook repeats " + hooks[g.hook]);
  hooks[g.hook] = id;
  if (starts[g.startHere]) errors.push(id + ": startHere repeats " + starts[g.startHere]);
  starts[g.startHere] = g.startHere;
  if (kickers[g.tipsKicker]) errors.push(id + ": tips kicker repeats " + kickers[g.tipsKicker]);
  kickers[g.tipsKicker] = id;
  if (ctas[g.cta]) errors.push(id + ": CTA repeats " + ctas[g.cta]);
  ctas[g.cta] = id;

  const blob = JSON.stringify(g);
  if (BANNED.test(blob)) errors.push(id + ": banned jargon in data");
  if (/Still one base/i.test(blob)) errors.push(id + ": Still one base template");
  if (/The overrun is/i.test(String(g.hook || ""))) errors.push(id + ": hook still uses overrun template");
  if (TAX_META.test(blob)) errors.push(id + ": metaphorical tax still in data");
  if (VAGUE.test(blob)) errors.push(id + ": vague placeholder still in data");
  if (!g.updated || g.updated.indexOf("Compiled Sep 2026") < 0) {
    errors.push(id + ": missing Compiled Sep 2026 footer");
  }
  if (g.updated && /field visit/i.test(g.updated) === false) {
    errors.push(id + ": footer should say not a field visit");
  }

  const html = path.join(root, "guides", id + ".html");
  if (!fs.existsSync(html)) errors.push(id + ": missing guides/" + id + ".html");
  else {
    const src = fs.readFileSync(html, "utf8");
    if (src.indexOf("VM_CITY_GUIDE_ID = " + JSON.stringify(id)) < 0) errors.push(id + ": html id mismatch");
    if (src.indexOf("FILE_PLACEHOLDER") >= 0) errors.push(id + ": FILE_PLACEHOLDER");
    if (src.indexOf("★") >= 0 || src.indexOf("⭐") >= 0) errors.push(id + ": star scores");
    if (src.indexOf("Loading the printable brief") >= 0) errors.push(id + ": still a JS shell");
    if (src.indexOf("data-cg-static") < 0 && src.indexOf("cg-hero") < 0) errors.push(id + ": missing static hero");
    if (src.indexOf("Top money-saving tips") < 0) errors.push(id + ": tips missing from HTML");
    if (src.indexOf("/plan?dest=" + id) < 0) errors.push(id + ": missing /plan?dest=");
    if (src.indexOf("Download / Print money guide") < 0) errors.push(id + ": print bar should say money guide");
    if (src.indexOf("Money guide") < 0) errors.push(id + ": missing Money guide kicker");
    const seo = ctx.VM_CITY_GUIDE.seo(g);
    if (src.indexOf("<title>" + seo.title + "</title>") < 0) errors.push(id + ": title drift");
    if (src.indexOf("content=\"" + seo.desc + "\"") < 0) errors.push(id + ": meta drift");
    if (src.indexOf("<h1 class=\"cg-h1\">" + seo.h1 + "</h1>") < 0) errors.push(id + ": h1 drift");
    if (seo.desc.length > 160) errors.push(id + ": meta over 160");
    if (seo.title.indexOf("VacationMath") >= 0 || seo.title.indexOf("| Printable |") >= 0) {
      errors.push(id + ": weak title pattern");
    }
    if (src.indexOf("Quick facts") < 0) errors.push(id + ": missing Quick facts");
    if (src.indexOf("Who this is for") < 0) errors.push(id + ": missing Who this is for");
    if (src.indexOf("Getting around") < 0) errors.push(id + ": missing Getting around");
    if (src.indexOf("Where to stay") < 0) errors.push(id + ": missing Where to stay");
    if (src.indexOf("Where to eat") < 0) errors.push(id + ": missing Where to eat");
    if (src.indexOf("Things to do") < 0) errors.push(id + ": missing Things to do");
    if (src.indexOf("3-day skeleton") < 0) errors.push(id + ": missing 3-day skeleton");
    if (src.indexOf("Mid-range money walkthrough") < 0) errors.push(id + ": missing mid-range walkthrough");
    var walkPos = src.indexOf("id=\"money-walk\"");
    var doPos = src.indexOf("id=\"do\"");
    var daysPos = src.indexOf("id=\"days\"");
    if (walkPos < 0 || doPos < 0 || daysPos < 0 || !(doPos < walkPos && walkPos < daysPos)) {
      errors.push(id + ": walkthrough should sit after things to do and before the 3-day skeleton");
    }
    if (src.indexOf("Book before you go") < 0) errors.push(id + ": missing Book before you go");
    if (src.indexOf("Hidden costs") < 0) errors.push(id + ": missing Hidden costs");
    if (src.indexOf("Skip this") < 0) errors.push(id + ": missing Skip this");
    if (src.indexOf("Compiled Sep 2026") < 0) errors.push(id + ": missing Compiled Sep 2026 line");
    if (src.indexOf("Start here") < 0) errors.push(id + ": missing Start here");
    if (src.indexOf("Where to base yourself") < 0) errors.push(id + ": missing base visual");
    if (src.indexOf("not a field visit") < 0) errors.push(id + ": footer should deny a field visit");
    if (/Need a car\?<\/dt><dd>Yes</.test(src)) errors.push(id + ": bare Yes car fact");
    if (src.indexOf("Budget") < 0 || src.indexOf("Mid-range") < 0 || src.indexOf("Splurge") < 0) {
      errors.push(id + ": missing Budget / Mid-range / Splurge labels");
    }
    const tipPos = src.lastIndexOf("money-saving-tips");
    const stayPos = src.indexOf("id=\"stay\"");
    if (tipPos < 0 || stayPos < 0 || tipPos < stayPos) errors.push(id + ": tips should follow stay/eat/do");
    const body = src.split("<article id=\"city-guide-root\">")[1] || src;
    const article = body.split("</article>")[0] || body;
    if (BANNED.test(article)) errors.push(id + ": banned jargon in HTML");
    if (TAX_META.test(article)) errors.push(id + ": metaphorical tax still in HTML");
    if (VAGUE.test(article)) errors.push(id + ": vague placeholder still in HTML");
    if (article.indexOf("Keep the number honest") >= 0) errors.push(id + ": stock tips kicker in HTML");
    if (article.indexOf("Same hotel, food, and activity names") >= 0) errors.push(id + ": stock CTA in HTML");
    if (article.indexOf("Mid-range room") < 0) errors.push(id + ": HTML missing room band");
    if (article.indexOf("Food / person / day") < 0) errors.push(id + ": HTML missing food band");
    if (article.indexOf("(orientation)") < 0 && article.indexOf("orientation") < 0) errors.push(id + ": HTML missing orientation label");
    var gemHits = src.split("Hidden gem:").length - 1;
    if (gemHits < 3) errors.push(id + ": HTML needs 3 Hidden gem labels, got " + gemHits);
    if (id === "disney" && /Orange County/i.test(article)) errors.push("disney: Orange County bleed");
    if (id === "disney" && article.indexOf("12.5%") < 0) errors.push("disney: missing Florida 12.5% lodging tax");
    if (id === "disney" && /Orange-side/i.test(article)) errors.push("disney: Orange-side wording");
    if (/\bLean\b/.test(src) || /\bStretch\b/.test(src)) errors.push(id + ": leftover Lean/Stretch in HTML");
    if (TRANSIT.indexOf(id) >= 0) {
      if (article.indexOf("You usually don’t need a car") < 0 && article.indexOf("You usually don't need a car") < 0) {
        errors.push(id + ": transit city should say you usually don’t need a car");
      }
      if (/Need a car\?<\/dt><dd>Yes</.test(article)) errors.push(id + ": transit city should not push a car");
    }
    if (CAR_FORK.indexOf(id) >= 0) {
      if (article.indexOf("No rental") < 0 || article.indexOf("With a rental") < 0) {
        errors.push(id + ": car-heavy dest needs rental fork");
      }
    }
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

const rendered = ctx.VM_CITY_GUIDE.render(G.BY_ID.los_angeles);
if (rendered.indexOf("Loading") >= 0) errors.push("renderer still emits loading shell");
if (rendered.indexOf("Where to stay") < 0) errors.push("LA render missing Where to stay");
if (rendered.indexOf("Start here") < 0) errors.push("LA render missing Start here");
if (rendered.indexOf("Where to base yourself") < 0) errors.push("LA render missing base visual");
if (rendered.indexOf("Usually") < 0) errors.push("LA car fact should say Usually");
if (/Need a car\?<\/dt><dd>Yes</.test(rendered)) errors.push("LA car fact is still bare Yes");
if (rendered.indexOf("Freehand Downtown") < 0 && rendered.indexOf("Ace Hotel Downtown") < 0) {
  errors.push("LA stay section missing named hotels");
}
if (BANNED.test(rendered)) errors.push("LA render still has banned jargon");
if (TAX_META.test(rendered)) errors.push("LA render still has tax metaphors");
if (rendered.indexOf(COMPILED) < 0) errors.push("LA render missing compiled footer");

const tierSeen = {};
REQUIRED.forEach(function (id) {
  const g = G.BY_ID[id];
  ["stayTiers", "eatTiers", "doTiers"].forEach(function (key) {
    const t = g[key];
    if (!t) return;
    ["budget", "mid", "lux"].forEach(function (band) {
      (t[band] || []).forEach(function (b) {
        const norm = String(b).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
        if (norm.length < 24) return;
        if (tierSeen[norm] && tierSeen[norm] !== id + ":" + key) {
          errors.push(id + ": " + key + " bullet repeats " + tierSeen[norm]);
        } else {
          tierSeen[norm] = id + ":" + key;
        }
      });
    });
  });
});

if (errors.length) {
  console.error("FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log("ok 20 money guides — locked outline, static HTML, 5 tips, money bands, Budget/Mid-range/Splurge");
