/* =====================================================================
   Vacation Math — Trip Plan data
   Destination + hard budget → constrained plan.
   Catalog is built from trip-finder-data.js (one source of truth for
   city hotel / ground rates) plus special Disney / cruise / AI rows.
   ===================================================================== */
(function (global) {
  "use strict";

  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Season multipliers for destinations that do not have TF monthly bands
  // (Disney tickets/rooms, cruise, fallback). month index 0-11 → 0=low 1=avg 2=high
  var SEASON = {
    disney:     [1, 0, 0, 2, 1, 1, 2, 1, 0, 1, 2, 2],
    cruise:     [1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 2],
    cancun:     [2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2],
    nyc:        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2],
    hawaii:     [2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2],
    smokies:    [0, 0, 0, 1, 1, 2, 2, 1, 0, 2, 1, 1],
    city:       [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2]
  };

  var SEASON_KEYS = ["low", "avg", "high"];

  var REGION_ORDER = [
    "Featured",
    "Caribbean",
    "Mexico",
    "Domestic US",
    "Hawaii",
    "Europe",
    "Central America",
    "South America",
    "Asia",
    "Oceania",
    "Africa",
    "Middle East"
  ];

  // TF dest id → VM_DATA.AI_DESTINATIONS id (dedicated all-inclusive math)
  var AI_ID_MAP = {
    cancun: "cancun",
    punta_cana: "punta_cana",
    jamaica: "jamaica",
    aruba: "aruba",
    turks_caicos: "turks_caicos",
    bahamas: "nassau_bahamas",
    st_lucia: "st_lucia",
    cabo: "cabo_san_lucas",
    tulum: "riviera_maya",
    costa_rica: "costa_rica",
    belize: "belize"
  };

  var POPULAR = [
    { id: "disney", label: "Disney World" },
    { id: "cruise", label: "Caribbean cruise" },
    { id: "cancun", label: "Cancún AI" },
    { id: "nyc", label: "NYC" },
    { id: "paris", label: "Paris" },
    { id: "tokyo", label: "Tokyo" },
    { id: "vegas", label: "Las Vegas" },
    { id: "oahu", label: "Oahu" }
  ];

  // Occupancy / lodging-tax assumptions by TF region (honest, not live quotes)
  var LODGING_TAX = {
    "Domestic US": 0.12,
    Hawaii: 0.1775,
    Caribbean: 0.12,
    Mexico: 0.19,
    Europe: 0.10,
    "Central America": 0.13,
    "South America": 0.12,
    Asia: 0.10,
    Oceania: 0.12,
    Africa: 0.14,
    "Middle East": 0.10
  };

  var NYC_LODGING_TAX = 0.1475;

  // Fallback city baselines if Trip Finder data is missing
  var CITY_BASE = {
    nyc: {
      hotel: { budget: 175, mid: 290, lux: 450 },
      food:  { budget: 55,  mid: 90,  lux: 140 },
      act:   { budget: 35,  mid: 60,  lux: 95 }
    },
    city_generic: {
      hotel: { budget: 140, mid: 210, lux: 340 },
      food:  { budget: 45,  mid: 75,  lux: 120 },
      act:   { budget: 30,  mid: 50,  lux: 80 }
    },
    hawaii: {
      hotel: { budget: 220, mid: 340, lux: 550 },
      food:  { budget: 55,  mid: 95,  lux: 150 },
      act:   { budget: 40,  mid: 70,  lux: 110 },
      carPerDay: { budget: 55, mid: 75, lux: 110 }
    },
    smokies: {
      lodging: { budget: 140, mid: 210, lux: 320 },
      food:    { budget: 40,  mid: 65,  lux: 100 },
      act:     { budget: 25,  mid: 45,  lux: 75 },
      oneWayMiles: 450
    }
  };

  var STYLE_MAP = {
    budget: { disneyResort: "value",    disneyDining: "light",   cruiseCabin: "interior", aiTier: "budget", label: "Budget" },
    mid:    { disneyResort: "moderate", disneyDining: "typical", cruiseCabin: "balcony",  aiTier: "mid",    label: "Mid-range" },
    lux:    { disneyResort: "deluxe",   disneyDining: "heavy",   cruiseCabin: "suite",    aiTier: "luxury", label: "Higher-end" }
  };

  var TIER_DEFS = {
    lean:   { label: "Lean",   hint: "Cut where it hurts least", styleShift: -1 },
    solid:  { label: "Solid",  hint: "Balanced recommended plan", styleShift: 0 },
    stretch:{ label: "Stretch",hint: "Nice-to-haves included",   styleShift: 1 }
  };

  var STYLE_ORDER = ["budget", "mid", "lux"];

  var FEATURED = [
    {
      id: "disney",
      label: "Walt Disney World (Orlando)",
      short: "Disney World",
      kind: "disney",
      region: "Featured",
      flightRegion: "domestic",
      flightSurcharge: 1,
      detailHref: "/disney",
      detailLabel: "Disney World Cost Calculator",
      blurb: "Park tickets, resort, Lightning Lane, dining, and the Florida lodging tax most quotes skip.",
      search: "disney world orlando wdw magic kingdom theme park florida"
    },
    {
      id: "cruise",
      label: "Caribbean cruise (7-night style)",
      short: "Caribbean cruise",
      kind: "cruise",
      region: "Featured",
      flightRegion: "domestic",
      flightSurcharge: 1,
      detailHref: "/cruise",
      detailLabel: "Cruise Cost Calculator",
      blurb: "Cabin fare, automatic gratuities, drinks, excursions, and flights to Florida ports.",
      search: "caribbean cruise ship carnival royal norwegian msc"
    }
  ];

  function tfSource() {
    var pack = global.VM_TRIPFINDER_DATA;
    if (!pack) return [];
    return pack.DESTINATIONS || [];
  }

  function buildCatalog() {
    var list = FEATURED.slice();
    var seen = { disney: true, cruise: true };
    tfSource().forEach(function (d) {
      if (!d || !d.id || seen[d.id]) return;
      seen[d.id] = true;
      var aiId = AI_ID_MAP[d.id] || null;
      var kind = aiId ? "ai" : "tf";
      var label = d.name + (d.country ? " (" + d.country + ")" : "");
      if (aiId) label = d.name + " all-inclusive" + (d.country ? " (" + d.country + ")" : "");
      list.push({
        id: d.id,
        label: label,
        short: d.name,
        kind: kind,
        aiId: aiId,
        region: d.region || "Domestic US",
        flightRegion: d.regionFlight || "domestic",
        flightSurcharge: d.flightSurcharge || 1,
        detailHref: aiId ? "/allinclusive" : "/tripfinder",
        detailLabel: aiId ? "All-Inclusive Calculator" : "Trip Finder",
        blurb: d.notes || (d.name + " — Trip Finder 2026 hotel + daily ground rates, plus airfare from your origin."),
        search: [d.name, d.country, d.region, d.id, (d.vibes || []).join(" "), d.notes || ""].join(" ").toLowerCase()
      });
    });
    return list;
  }

  function lodgingTaxFor(dest) {
    if (!dest) return 0.12;
    if (dest.id === "nyc") return NYC_LODGING_TAX;
    if (dest.kind === "disney") return 0.125;
    return LODGING_TAX[dest.region] != null ? LODGING_TAX[dest.region] : 0.12;
  }

  var DESTINATIONS = buildCatalog();

  global.VM_PLAN_DATA = {
    MONTH_NAMES: MONTH_NAMES,
    SEASON: SEASON,
    SEASON_KEYS: SEASON_KEYS,
    REGION_ORDER: REGION_ORDER,
    AI_ID_MAP: AI_ID_MAP,
    POPULAR: POPULAR,
    LODGING_TAX: LODGING_TAX,
    NYC_LODGING_TAX: NYC_LODGING_TAX,
    DESTINATIONS: DESTINATIONS,
    CITY_BASE: CITY_BASE,
    STYLE_MAP: STYLE_MAP,
    TIER_DEFS: TIER_DEFS,
    STYLE_ORDER: STYLE_ORDER,
    FL_LODGING_TAX: 0.125,
    FL_SALES_TAX: 0.065,
    DRIVE_COST_PER_PERSON: 220,
    PLAN_BUFFER: 0.06,
    buildCatalog: buildCatalog,
    lodgingTaxFor: lodgingTaxFor,
    refreshCatalog: function () {
      DESTINATIONS = buildCatalog();
      global.VM_PLAN_DATA.DESTINATIONS = DESTINATIONS;
      return DESTINATIONS;
    }
  };
})(typeof window !== "undefined" ? window : this);
