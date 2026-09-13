/* Validate money guides: 20 dests, editorial fields, static HTML, 5–8 tips. */
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
run("city-guide.js");

const REQUIRED = [
  "disney", "anaheim", "los_angeles", "nyc", "vegas", "miami",
  "san_francisco", "chicago", "nola", "philadelphia", "atlanta",
  "paris", "london", "rome", "tokyo", "cancun", "oahu", "maui",
  "cruise", "key_west"
];

const DEEP = ["disney", "los_angeles", "nyc", "paris", "tokyo"];

const P = ctx.VM_PLAN_DATA;
const G = ctx.VM_CITY_GUIDES;
const errors = [];

if (G.ALL.length !== 20) errors.push("expected 20 guides, got " + G.ALL.length);

const stayTitles = {};
const hooks = {};

REQUIRED.forEach(function (id) {
  const g = G.BY_ID[id];
  if (!g) {
    errors.push(id + ": missing guide copy");
    return;
  }
  ["hook", "blurb", "whenGo", "whenSkip", "whenNote", "around", "budgetNote", "works"].forEach(function (k) {
    if (!g[k] || String(g[k]).length < 20) errors.push(id + ": weak " + k);
  });
  ["stayLead", "eatLead", "doLead", "stayTitle", "eatTitle", "doTitle"].forEach(function (k) {
    if (!g[k] || String(g[k]).length < 12) errors.push(id + ": weak " + k);
  });
  if (!g.base || !g.base.lean || !g.base.stretch) errors.push(id + ": need base.lean and base.stretch");
  if (!g.skip || g.skip.length < 1 || g.skip.length > 3) errors.push(id + ": skip " + ((g.skip || []).length) + " (need 1–3)");
  const tips = g.tips || [];
  if (tips.length < 5 || tips.length > 8) errors.push(id + ": tips " + tips.length + " (need 5–8)");
  if ((g.aroundBullets || []).length < 2) errors.push(id + ": need around bullets");

  const st = g.stayTitle;
  if (stayTitles[st]) errors.push(id + ": stayTitle repeats " + stayTitles[st]);
  stayTitles[st] = id;
  if (hooks[g.hook]) errors.push(id + ": hook repeats " + hooks[g.hook]);
  hooks[g.hook] = id;

  if (DEEP.indexOf(id) >= 0) {
    if (!g.days || g.days.length !== 3) errors.push(id + ": need 3-day skeleton");
    (g.days || []).forEach(function (d, i) {
      if (!d.title || !d.body || d.body.length < 40) errors.push(id + ": weak day " + (i + 1));
    });
    ["stayProse", "eatProse", "doProse"].forEach(function (k) {
      if (!g[k] || g[k].length < 1) errors.push(id + ": missing " + k);
    });
  }

  const html = path.join(root, "guides", id + ".html");
  if (!fs.existsSync(html)) errors.push(id + ": missing guides/" + id + ".html");
  else {
    const src = fs.readFileSync(html, "utf8");
    if (src.indexOf("VM_CITY_GUIDE_ID = " + JSON.stringify(id)) < 0) errors.push(id + ": html id mismatch");
    if (src.indexOf("FILE_PLACEHOLDER") >= 0) errors.push(id + ": FILE_PLACEHOLDER");
    if (src.indexOf("★") >= 0 || src.indexOf("⭐") >= 0) errors.push(id + ": star scores");
    if (src.indexOf("Loading the printable brief") >= 0) errors.push(id + ": still a JS shell");
    if (src.indexOf("Printable City Brief") >= 0) errors.push(id + ": title still says Printable City Brief");
    if (src.indexOf(g.label + " Money Guide 2026") < 0) errors.push(id + ": title should say Money Guide 2026");
    if (/city brief/i.test(src) && src.indexOf("Tuesday brief") < 0) {
      /* allow Tuesday brief newsletter name */
    }
    if (/\bcity brief\b/i.test(src.replace(/Tuesday brief/g, ""))) errors.push(id + ": city brief still in HTML");
    if (src.indexOf("data-cg-static") < 0 && src.indexOf("cg-hero") < 0) errors.push(id + ": missing static hero");
    if (src.indexOf("Top money-saving tips") < 0) errors.push(id + ": tips missing from HTML");
    if (src.indexOf("/plan?dest=" + id) < 0) errors.push(id + ": missing /plan?dest=");
    if (src.indexOf("Download / Print money guide") < 0) errors.push(id + ": missing print money guide CTA");
    if (src.indexOf("Estimates for planning — not live hotel quotes") < 0) {
      errors.push(id + ": missing planning disclaimer");
    }
    const tipPos = src.lastIndexOf("money-saving-tips");
    const stayPos = src.indexOf("id=\"stay\"");
    if (tipPos < 0 || stayPos < 0 || tipPos < stayPos) errors.push(id + ": tips should follow stay/eat/do");
    const body = src.split("<article id=\"city-guide-root\">")[1] || src;
    const article = body.split("</article>")[0] || body;
    const orientCount = (article.match(/Estimates for planning — not live hotel quotes/g) || []).length;
    if (orientCount > 2) errors.push(id + ": disclaimer repeated " + orientCount + " times in article");
    const leftoverHits = (article.match(/leftover/gi) || []).filter(function (w) {
      return !/Terminal leftovers/i.test(article);
    });
    const leftoverBare = (article.match(/\bleftover\b/gi) || []).length;
    const leftoverFood = (article.match(/Terminal leftovers/gi) || []).length;
    if (leftoverBare - leftoverFood > 0) errors.push(id + ": leftover jargon still in HTML (" + leftoverBare + ")");
    if (id === "los_angeles" && /basin/i.test(article)) errors.push("los_angeles: basin still in HTML");
    if (DEEP.indexOf(id) >= 0) {
      if (src.indexOf("cg-days") < 0) errors.push(id + ": 3-day skeleton missing from HTML");
      if (src.indexOf("cg-base") < 0) errors.push(id + ": base callout missing from HTML");
      if (src.indexOf("cg-skip") < 0) errors.push(id + ": skip section missing from HTML");
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

const rendered = ctx.VM_CITY_GUIDE.render(G.BY_ID.disney);
if (rendered.indexOf("Loading") >= 0) errors.push("renderer still emits loading shell");
if (rendered.indexOf("Where to stay") >= 0 && G.BY_ID.disney.stayTitle !== "Where to stay") {
  /* disney should use a custom stay title */
}
if (rendered.indexOf(G.BY_ID.disney.stayTitle) < 0) errors.push("disney render missing stayTitle");

if (errors.length) {
  console.error("FAIL\n" + errors.join("\n"));
  process.exit(1);
}
console.log("ok 20 money guides — editorial fields, static HTML, 5–8 tips, Budget/Mid-range/Splurge hotels");
