/* =====================================================================
   Vacation Math — Trip Plan data
   Destination + hard budget → constrained plan. Uses the same 2026
   pricing vocabulary as calc-data.js (loaded separately as VM_DATA).
   ===================================================================== */
(function (global) {
  "use strict";

  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Season multipliers applied to lodging (and Disney tickets when relevant).
  // Optional month input; leave blank = avg.
  var SEASON = {
    // month index 0-11 → low | avg | high
    disney:     [1, 0, 0, 2, 1, 1, 2, 1, 0, 1, 2, 2], // 0=low 1=avg 2=high
    cruise:     [1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 2],
    cancun:     [2, 2, 2, 1, 0, 0, 0, 0, 0, 1, 2, 2],
    nyc:        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 2, 2],
    hawaii:     [2, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 2],
    smokies:    [0, 0, 0, 1, 1, 2, 2, 1, 0, 2, 1, 1],
    city:       [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2]
  };

  var SEASON_KEYS = ["low", "avg", "high"];

  var DESTINATIONS = [
    {
      id: "disney",
      label: "Walt Disney World (Orlando)",
      short: "Disney World",
      kind: "disney",
      flightRegion: "domestic",
      detailHref: "/disney",
      detailLabel: "Disney World Cost Calculator",
      blurb: "Park tickets, resort, Lightning Lane, dining, and the Florida lodging tax most quotes skip."
    },
    {
      id: "cruise",
      label: "Caribbean cruise (7-night style)",
      short: "Caribbean cruise",
      kind: "cruise",
      flightRegion: "domestic",
      detailHref: "/cruise",
      detailLabel: "Cruise Cost Calculator",
      blurb: "Cabin fare, automatic gratuities, drinks, excursions, and flights to Florida ports."
    },
    {
      id: "cancun",
      label: "Cancún all-inclusive",
      short: "Cancún AI",
      kind: "ai",
      flightRegion: "caribbean",
      detailHref: "/allinclusive",
      detailLabel: "All-Inclusive Calculator",
      blurb: "Resort package per adult/night plus flights, tips, and the off-property extras AI brochures bury."
    },
    {
      id: "nyc",
      label: "New York City",
      short: "NYC",
      kind: "city",
      flightRegion: "domestic",
      detailHref: "/budget",
      detailLabel: "Budget Reverse Math",
      blurb: "Midtown/outer-borough lodging, dining, subway + attractions — honest city-trip totals."
    },
    {
      id: "hawaii",
      label: "Hawaii (Oahu / Maui style)",
      short: "Hawaii",
      kind: "hawaii",
      flightRegion: "hawaii",
      detailHref: "/big-trip",
      detailLabel: "The Big Trip guide",
      blurb: "Interisland-ready lodging, rental car, food, and the Hawaii airfare premium from the mainland."
    },
    {
      id: "smokies",
      label: "Great Smoky Mountains / road trip",
      short: "Smokies road trip",
      kind: "road",
      flightRegion: "domestic",
      detailHref: "/roadtrip",
      detailLabel: "Road Trip Calculator",
      blurb: "Cabin or hotel, fuel, food, and park-adjacent activities — built for a drive-first trip."
    },
    {
      id: "city",
      label: "Generic US city trip",
      short: "US city",
      kind: "city_generic",
      flightRegion: "domestic",
      detailHref: "/tripfinder",
      detailLabel: "Trip Finder",
      blurb: "Blended mid-size city baseline (Nashville / Austin / Chicago class) for a hard-budget plan."
    }
  ];

  // City-style nightly + daily baselines by style key
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

  // Style → Disney resort key / cruise cabin / AI tier
  var STYLE_MAP = {
    budget: { disneyResort: "value",    disneyDining: "light",   cruiseCabin: "interior", aiTier: "budget", label: "Budget" },
    mid:    { disneyResort: "moderate", disneyDining: "typical", cruiseCabin: "balcony",  aiTier: "mid",    label: "Mid-range" },
    lux:    { disneyResort: "deluxe",   disneyDining: "heavy",   cruiseCabin: "suite",    aiTier: "luxury", label: "Higher-end" }
  };

  // Lean / Solid / Stretch relative to selected style
  var TIER_DEFS = {
    lean:   { label: "Lean",   hint: "Cut where it hurts least", styleShift: -1 },
    solid:  { label: "Solid",  hint: "Balanced recommended plan", styleShift: 0 },
    stretch:{ label: "Stretch",hint: "Nice-to-haves included",   styleShift: 1 }
  };

  var STYLE_ORDER = ["budget", "mid", "lux"];

  global.VM_PLAN_DATA = {
    MONTH_NAMES: MONTH_NAMES,
    SEASON: SEASON,
    SEASON_KEYS: SEASON_KEYS,
    DESTINATIONS: DESTINATIONS,
    CITY_BASE: CITY_BASE,
    STYLE_MAP: STYLE_MAP,
    TIER_DEFS: TIER_DEFS,
    STYLE_ORDER: STYLE_ORDER,
    FL_LODGING_TAX: 0.125,   // Orange County 12.5%
    FL_SALES_TAX: 0.065,     // tickets / LL
    DRIVE_COST_PER_PERSON: 220
  };
})(typeof window !== "undefined" ? window : this);
