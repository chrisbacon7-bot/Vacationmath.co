/* =====================================================================
   Vacation Math — Calculator v2
   - Quick pick (~2 min) and Deep dive (~5 min) modes
   - Category-level expense profile + travel style inputs
   - Transparent scored card recommendation engine
   - Trip-cost intelligence: benchmarks, hidden costs, missing items, booking
   ===================================================================== */
(function () {
  "use strict";

  // ----------------------------------------------------------------
  // CARD DATABASE (verified August 2026)
  // ----------------------------------------------------------------
  var CARDS = {
    csp: {
      id: "csp", name: "Chase Sapphire Preferred",
      annual_fee: 95, bonus_points: 60000, bonus_currency: "ur",
      min_spend: 4000, spend_window_months: 3,
      travel_mult: 2, dining_mult: 3, grocery_mult: 1, gas_mult: 1, streaming_mult: 3, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: true,
      trip_credit: 50,
      note: "Best beginner. Transfers to airlines/hotels."
    },
    csr: {
      id: "csr", name: "Chase Sapphire Reserve",
      annual_fee: 795, bonus_points: 150000, bonus_currency: "ur",
      min_spend: 6000, spend_window_months: 3,
      travel_mult: 4, dining_mult: 3, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: true, fhr: false, intl_no_fee: true, primary_rental_cdw: true,
      trip_credit: 300,
      note: "High fee, big perks. Only worth it if you use the credits."
    },
    venture: {
      id: "venture", name: "Capital One Venture",
      annual_fee: 95, bonus_points: 75000, bonus_currency: "capone",
      min_spend: 4000, spend_window_months: 3,
      travel_mult: 2, dining_mult: 2, grocery_mult: 2, gas_mult: 2, streaming_mult: 2, base_mult: 2,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 50,
      note: "Simple. Good one-card option."
    },
    venture_x: {
      id: "venture_x", name: "Capital One Venture X",
      annual_fee: 395, bonus_points: 75000, bonus_currency: "capone",
      min_spend: 4000, spend_window_months: 3,
      travel_mult: 2, dining_mult: 2, grocery_mult: 2, gas_mult: 2, streaming_mult: 2, base_mult: 2,
      lounge: true, fhr: false, intl_no_fee: true, primary_rental_cdw: true,
      trip_credit: 300,
      note: "$300 travel credit + 10K anniversary miles offset the $395 fee."
    },
    amex_gold: {
      id: "amex_gold", name: "Amex Gold",
      annual_fee: 325, bonus_points: 60000, bonus_currency: "mr",
      min_spend: 6000, spend_window_months: 6,
      travel_mult: 3, dining_mult: 4, grocery_mult: 4, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 120,
      note: "Best for families that eat out."
    },
    amex_plat: {
      id: "amex_plat", name: "Amex Platinum",
      annual_fee: 895, bonus_points: 175000, bonus_currency: "mr",
      min_spend: 12000, spend_window_months: 6,
      travel_mult: 5, dining_mult: 1, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: true, fhr: true, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 200,
      note: "Premium. Onboard cruise credit + lounge access."
    },
    bilt: {
      id: "bilt", name: "Bilt",
      annual_fee: 0, bonus_points: 0, bonus_currency: "bilt",
      min_spend: 0, spend_window_months: 0,
      travel_mult: 2, dining_mult: 3, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 0,
      note: "Earn points on rent. Free card."
    },
    citi_premier: {
      id: "citi_premier", name: "Citi Premier",
      annual_fee: 95, bonus_points: 75000, bonus_currency: "citi",
      min_spend: 4000, spend_window_months: 3,
      travel_mult: 3, dining_mult: 3, grocery_mult: 3, gas_mult: 3, streaming_mult: 1, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 100,
      note: "Underrated. Broad earning."
    }
  };

  var CARD_ORDER = ["csp", "csr", "venture", "venture_x", "amex_gold", "amex_plat", "bilt", "citi_premier"];

  // Points valuations (cents per point). Conservative.
  var VALUATIONS = {
    ur: 0.018, mr: 0.019, capone: 0.017, citi: 0.016, bilt: 0.016, hotel: 0.006,
    cashback: 0.015
  };

  var PREMIUM_IDS = ["csr", "venture_x", "amex_plat", "amex_gold", "csp", "venture", "citi_premier"];

  // Default category shares of monthly spend (used only in Quick mode).
  var DEFAULT_SHARES = {
    dining: 0.10, grocery: 0.18, gas: 0.05, travel: 0.05, streaming: 0.02, other: 0.60
  };

  // Timing savings — by (trip_type x timing). Pct of sticker. Capped at 25%.
  var TIMING_TABLE = {
    cruise:        { next_3: 0.00, "3_12": 0.08, "12_plus": 0.20,
                     note_12_plus: "Book during Wave Season (Jan–Mar). Cruise lines compete hardest then. Typical savings: 15–25%.",
                     note_3_12: "Book 6–9 months out, midweek departure. Typical savings: 8–12%.",
                     note_next_3: "You're close. Look for last-minute cabin discounts the line releases 30–45 days out." },
    disney:        { next_3: 0.02, "3_12": 0.10, "12_plus": 0.15,
                     note_12_plus: "Free dining promotions appear in spring for fall trips. Typical family savings: $400–$800.",
                     note_3_12: "Travel during value or moderate-season weeks. Avoid Easter, Christmas, summer peak. Savings: 10–15%.",
                     note_next_3: "Cut a day off the park ticket, swap a sit-down for a quick-serve, skip the resort photo package. Small moves, real money." },
    all_inclusive: { next_3: 0.05, "3_12": 0.12, "12_plus": 0.18,
                     note_12_plus: "Book Tuesday/Wednesday departures, avoid school break weeks. Savings: 15–20%.",
                     note_3_12: "Shoulder season pricing (early Dec, late April) is dramatically lower. Savings: 10–15%.",
                     note_next_3: "Tuesday/Wednesday departures shave 10–15%. That's it for now — your real lever is the next trip." },
    hawaii:        { next_3: 0.03, "3_12": 0.12, "12_plus": 0.18,
                     note_12_plus: "Late April–early June and September–early December are the quiet, cheaper windows. Savings: 15–20%.",
                     note_3_12: "Avoid summer and Christmas. Tuesday/Wednesday flights save 8–12% on airfare alone.",
                     note_next_3: "Compare inter-island flights vs. drive-and-stay. The math sometimes flips." },
    europe:        { next_3: 0.04, "3_12": 0.20, "12_plus": 0.18,
                     note_12_plus: "Lock airfare 6–9 months out. Watch for fall fare drops.",
                     note_3_12: "Shoulder season (May, September) saves 20–30% vs. peak summer and the weather is better.",
                     note_next_3: "Direct flights and one home base beat three cities and four trains. Less is more here." },
    national_park: { next_3: 0.05, "3_12": 0.12, "12_plus": 0.18,
                     note_12_plus: "Book lodge rooms 13 months out the day reservations open. That's the only way to get them at face value.",
                     note_3_12: "Stay in a gateway town instead of inside the park. Half the price. Same trail access.",
                     note_next_3: "Camp one or two nights, lodge the rest. Big savings, same memory." },
    road_trip:     { next_3: 0.04, "3_12": 0.10, "12_plus": 0.12,
                     note_12_plus: "Plan around free-night certificates (Hilton, Marriott, IHG). One certificate per stop pays the trip down fast.",
                     note_3_12: "Book hotels through your card's portal for category bonus earning. Sunday nights are 20–30% cheaper than Saturdays.",
                     note_next_3: "Sunday-to-Thursday is 20–30% cheaper than Friday-to-Sunday. Same road, half the rate." },
    other:         { next_3: 0.03, "3_12": 0.10, "12_plus": 0.15,
                     note_12_plus: "Twelve months gives you the full lever — points earning, timing, and the right card. Use them all.",
                     note_3_12: "Six months is enough time to earn a sign-up bonus and book midweek. Both matter.",
                     note_next_3: "Use what you have. Book midweek. Don't add a card you can't fully use." }
  };

  // Benchmarks: typical $ per ADULT, $ per KID for each trip type. Conservative US norms, 2026.
  var BENCHMARKS = {
    cruise:        { adult: { low: 900,  mid: 1500, high: 2500 }, kid: { low: 600, mid: 1000, high: 1700 } },
    disney:        { adult: { low: 1200, mid: 1900, high: 3000 }, kid: { low: 900, mid: 1500, high: 2400 } },
    all_inclusive: { adult: { low: 1100, mid: 1800, high: 2800 }, kid: { low: 700, mid: 1100, high: 1700 } },
    hawaii:        { adult: { low: 1800, mid: 2800, high: 4500 }, kid: { low: 900, mid: 1500, high: 2400 } },
    europe:        { adult: { low: 2000, mid: 3200, high: 5500 }, kid: { low: 1200, mid: 2000, high: 3300 } },
    national_park: { adult: { low: 600,  mid: 1000, high: 1700 }, kid: { low: 400, mid: 700,  high: 1100 } },
    road_trip:     { adult: { low: 400,  mid: 800,  high: 1400 }, kid: { low: 250, mid: 500,  high: 850  } },
    other:         { adult: { low: 700,  mid: 1300, high: 2200 }, kid: { low: 400, mid: 800,  high: 1400 } }
  };

  // Hidden costs by trip type — the stuff travelers forget.
  var HIDDEN_COSTS = {
    cruise:        ["Gratuities ($15–$20/person/day, often automatic)", "Excursions at every port ($75–$200/person)", "Specialty dining + drink package", "WiFi package ($15–$30/day)", "Parking at the port"],
    disney:        ["Park-hopper upgrade + Lightning Lane / Genie+", "Sit-down dining is 2–3× quick-serve", "Magic Bands and merch ($50–$150/kid)", "Resort parking ($25–$35/night)", "Airport transfer (Mears, Uber XL)"],
    all_inclusive: ["Premium liquor upgrade if you drink up", "Off-resort excursions", "Spa and cabana rentals", "Airport transfer (if not included)", "Gratuities even when 'included'"],
    hawaii:        ["Resort fees ($35–$50/night)", "Rental car + parking ($30–$50/day)", "Inter-island flights if hopping", "Lūʻau ($150–$200/adult)", "Snorkel/surf lessons or rentals"],
    europe:        ["Foreign transaction fees on the wrong card", "Train + Eurail reservation fees on top of tickets", "City tourist taxes ($2–$8/night)", "Tipping at restaurants when you don't expect to", "Data/SIM plan for the trip"],
    national_park: ["Entrance fees ($30–$35/vehicle) and the $80 America the Beautiful pass", "Gas — distances are bigger than they look", "Bear spray, layers, decent boots if you don't have them", "Guided tours or ranger programs", "In-park lodging is double the gateway town"],
    road_trip:     ["Gas — budget the actual miles, not the optimistic miles", "Resort/hotel fees and parking", "Tolls on the route", "Wear and tear / oil change before or after", "Eating out 3× a day adds up fast"],
    other:         ["Travel insurance if you're driving the trip cost up", "Pet care or boarding", "Parking at the airport or port", "Airport food and last-minute supplies", "Tips for shuttles, valets, housekeeping"]
  };

  // Likely-missing budget items, based on trip type. Conservative dollar values per family.
  function missingItems(tripType, adults, kids, sticker) {
    var people = adults + kids;
    var items = [];
    var pet = { label: "Pet care / boarding while you're gone", value: 250 };
    var ins = { label: "Travel insurance (~6% of trip cost)", value: Math.round(sticker * 0.06) };
    var park = { label: "Airport/port parking or rideshare", value: 120 };
    var foodTravel = { label: "Day-of travel food (airport/road)", value: 25 * people };
    var gratuities = { label: "Gratuities (cabin crew, drivers, housekeeping)", value: 20 * people };
    var park_pass = { label: "America the Beautiful park pass", value: 80 };
    var cell = { label: "International data plan or eSIM", value: 50 * Math.max(1, adults) };
    var sim = { label: "Park tickets if not in sticker", value: 130 * people };

    if (tripType === "cruise")   { items = [gratuities, park, foodTravel, pet, ins]; }
    else if (tripType === "disney") { items = [park, foodTravel, ins, pet]; }
    else if (tripType === "all_inclusive") { items = [park, foodTravel, pet, ins]; }
    else if (tripType === "hawaii") { items = [park, ins, foodTravel]; }
    else if (tripType === "europe") { items = [cell, ins, foodTravel]; }
    else if (tripType === "national_park") { items = [park_pass, foodTravel, pet]; }
    else if (tripType === "road_trip") { items = [foodTravel, pet]; }
    else { items = [park, foodTravel, ins, pet]; }
    return items;
  }

  // Booking-window tips per trip type.
  var BOOKING_TIPS = {
    cruise: "Sweet spot: 6–9 months out, or Wave Season (Jan–Mar) for the next 12 months of sailings. Skip travel agents that don't share the OBC.",
    disney: "Book the resort 6–8 months out. Park tickets are flat once you're inside the window. Dining reservations open 60 days out at 7am ET — set an alarm.",
    all_inclusive: "5–7 months out. Watch for resort flash sales mid-week. Tuesday/Wednesday departures save 15–20% vs. Friday/Saturday.",
    hawaii: "Flights: 3–5 months out, Tuesday/Wednesday. Hotels: 6–9 months for shoulder season (Apr–May, Sep–early Dec).",
    europe: "Flights: lock 4–6 months out, Tuesday/Wednesday departures, set a fare alert. Hotels: 3–4 months out is fine in shoulder season.",
    national_park: "Lodge rooms: book 13 months out the day reservations open. Campsites: 6 months on recreation.gov. Gateway-town stays: 2–4 months out is fine.",
    road_trip: "Book Sunday-through-Thursday nights — they're 20–30% cheaper. Use chain free-night certificates strategically along the route.",
    other: "For most trips: flights 3–5 months out, hotels 2–4 months out. Tuesday/Wednesday is consistently the cheapest travel day."
  };

  // CTA URLs
  var CTA_URLS = {
    csp: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    csr: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    venture: "https://www.capitalone.com/credit-cards/venture/",
    venture_x: "https://www.capitalone.com/credit-cards/venture-x/",
    amex_gold: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    amex_plat: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    bilt: "https://www.biltrewards.com/card",
    citi_premier: "https://www.citi.com/credit-cards/citi-strata-premier-credit-card"
  };

  var TRIP_LABELS = {
    cruise: "cruise", disney: "Disney trip", all_inclusive: "all-inclusive",
    hawaii: "Hawaii trip", europe: "Europe trip", national_park: "national park trip",
    road_trip: "road trip", other: "trip"
  };

  // Honest pros + cons
  var PROCONS = {
    csp: { pro: "60K bonus = $1,080 in real travel value for $95. That's the best beginner math out there.", con: "Transfer partner redemptions require a little homework. It's not a one-click card." },
    csr: { pro: "If you fly more than twice a year and use the lounges, the $300 credit and Priority Pass earn the fee back.", con: "$795 is real money. If you won't use the credits, the math doesn't work. Honestly evaluate before you apply." },
    venture: { pro: "Simplest premium card on the market. 2x on everything, redeem against any travel.", con: "Capital One miles are worth less per point than Chase or Amex. The simplicity costs you a few percent." },
    venture_x: { pro: "$300 travel credit + 10K anniversary miles effectively reduces the $395 fee to about $0–$50 net.", con: "The 10x hotel rate only works if you book through Capital One's portal. Lock-in is real." },
    amex_gold: { pro: "4x dining + 4x grocery is the highest earn rate for normal family spending.", con: "The $325 fee requires using the dining and Uber credits monthly. Forget once and the math slips." },
    amex_plat: { pro: "If you fly 4+ times a year and use the credits, the lounge access alone is worth the fee.", con: "$895 is the highest fee in the game. Don't pretend the credits will cover it if you won't use them." },
    bilt: { pro: "Free card. Earns points on rent. There is no downside to holding this card.", con: "The transfer partners are good but not Chase- or Amex-level deep. Best as a complement, not a main." },
    citi_premier: { pro: "3x on five everyday categories at $95/year. Quietly the best value of any premium card.", con: "Citi ThankYou points have fewer transfer partners than Chase or Amex. You give up some flexibility." }
  };

  // ----------------------------------------------------------------
  // UTILITIES
  // ----------------------------------------------------------------
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function fmt$(n) { n = Math.max(0, Math.round(n)); return "$" + n.toLocaleString("en-US"); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function updateSliderFill(input) {
    var min = parseFloat(input.min) || 0;
    var max = parseFloat(input.max) || 100;
    var val = parseFloat(input.value) || 0;
    var pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }
  function bindSlider(id, displayId, formatter, onChange) {
    var input = document.getElementById(id);
    var display = document.getElementById(displayId);
    function sync() {
      if (display) display.textContent = formatter(parseFloat(input.value));
      updateSliderFill(input);
      if (onChange) onChange();
    }
    input.addEventListener("input", sync);
    sync();
  }

  // ----------------------------------------------------------------
  // MODE TOGGLE (Quick vs Deep)
  // ----------------------------------------------------------------
  var mode = "quick";
  function setMode(next) {
    mode = next;
    $all(".mode-btn").forEach(function (b) {
      var active = b.getAttribute("data-mode") === next;
      b.classList.toggle("mode-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    $all(".quick-only").forEach(function (el) { el.hidden = (next !== "quick"); });
    $all(".deep-only").forEach(function (el) { el.hidden = (next !== "deep"); });
  }
  $all(".mode-btn").forEach(function (b) {
    b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
  });

  // ----------------------------------------------------------------
  // PILL GROUPS (single-select buttons)
  // ----------------------------------------------------------------
  $all(".pill-row").forEach(function (row) {
    row.addEventListener("click", function (e) {
      var btn = e.target.closest(".pill");
      if (!btn || !row.contains(btn)) return;
      // Scope removal to THIS row only (was a bug clearing all other groups).
      Array.prototype.forEach.call(row.querySelectorAll(".pill"), function (b) {
        b.classList.remove("pill-on");
      });
      btn.classList.add("pill-on");
    });
  });
  function pillValue(name) {
    var row = document.querySelector('.pill-row[data-name="' + name + '"]');
    if (!row) return null;
    var on = row.querySelector(".pill.pill-on");
    return on ? on.getAttribute("data-val") : null;
  }

  // ----------------------------------------------------------------
  // POINTS DISCLOSE
  // ----------------------------------------------------------------
  var toggleBtn = $("#points-toggle");
  var pointsBlock = $("#points-block");
  toggleBtn.addEventListener("click", function () {
    var open = !pointsBlock.hasAttribute("hidden");
    if (open) {
      pointsBlock.setAttribute("hidden", "");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "+ Add my existing points (optional)";
    } else {
      pointsBlock.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.textContent = "− Hide existing points";
    }
  });

  // "None" checkbox mutually exclusive
  var cardChecks = $all('input[name="cards"]');
  cardChecks.forEach(function (cb) {
    cb.addEventListener("change", function () {
      if (cb.value === "none" && cb.checked) {
        cardChecks.forEach(function (other) { if (other.value !== "none") other.checked = false; });
      } else if (cb.value !== "none" && cb.checked) {
        var noneCb = cardChecks.filter(function (x) { return x.value === "none"; })[0];
        if (noneCb) noneCb.checked = false;
      }
    });
  });

  // ----------------------------------------------------------------
  // CATEGORY SPEND HELPERS
  // ----------------------------------------------------------------
  function readCategorySpend(monthlyFallback) {
    if (mode === "deep") {
      var dining = parseInt($("#exp-dining").value, 10) || 0;
      var grocery = parseInt($("#exp-grocery").value, 10) || 0;
      var gas = parseInt($("#exp-gas").value, 10) || 0;
      var travel = parseInt($("#exp-travel").value, 10) || 0;
      var streaming = parseInt($("#exp-streaming").value, 10) || 0;
      var other = parseInt($("#exp-other").value, 10) || 0;
      var total = dining + grocery + gas + travel + streaming + other;
      return {
        dining: dining, grocery: grocery, gas: gas, travel: travel,
        streaming: streaming, other: other, monthly: total
      };
    }
    // Quick mode: split monthly slider into default shares
    return {
      dining: monthlyFallback * DEFAULT_SHARES.dining,
      grocery: monthlyFallback * DEFAULT_SHARES.grocery,
      gas: monthlyFallback * DEFAULT_SHARES.gas,
      travel: monthlyFallback * DEFAULT_SHARES.travel,
      streaming: monthlyFallback * DEFAULT_SHARES.streaming,
      other: monthlyFallback * DEFAULT_SHARES.other,
      monthly: monthlyFallback
    };
  }

  function updateProfileTotal() {
    var d = parseInt($("#exp-dining").value, 10) || 0;
    var g = parseInt($("#exp-grocery").value, 10) || 0;
    var gas = parseInt($("#exp-gas").value, 10) || 0;
    var tr = parseInt($("#exp-travel").value, 10) || 0;
    var s = parseInt($("#exp-streaming").value, 10) || 0;
    var o = parseInt($("#exp-other").value, 10) || 0;
    var t = d + g + gas + tr + s + o;
    $("#profile-total-value").textContent = fmt$(t);
    // Two-way sync: category sliders drive the household monthly value.
    // If the total falls inside the household slider's range, mirror it.
    var monthlyInput = $("#monthly");
    if (monthlyInput) {
      var minM = parseFloat(monthlyInput.min) || 0;
      var maxM = parseFloat(monthlyInput.max) || 25000;
      var clamped = Math.max(minM, Math.min(maxM, t));
      monthlyInput.value = clamped;
      var monthlyDisplay = $("#monthly-display");
      if (monthlyDisplay) monthlyDisplay.textContent = fmt$(t);
      updateSliderFill(monthlyInput);
    }
  }

  // ----------------------------------------------------------------
  // CARD SCORING ENGINE
  // ----------------------------------------------------------------
  // Score components (first-year, dollars):
  //   - signupValue:    bonus_points × valuation
  //   - categoryEarn:   ann spend × bonus multipliers × valuation (cap upside vs base earn)
  //   - tripBenefit:    credit applicable to this trip
  //   - styleFit:       lounge / FHR / intl / rental bonuses based on travel style
  //   - feeDrag:        annual_fee minus offsetting credits
  //   - penalties:      no_new (skip new cards), under_100 (cap fee), etc.
  function scoreCard(cardId, ctx) {
    var c = CARDS[cardId];
    var val = VALUATIONS[c.bonus_currency] || VALUATIONS.cashback;
    var spend = ctx.spend;
    var annual = spend.monthly * 12;
    var style = ctx.style;
    var trip = ctx.tripType;
    var alreadyOwned = ctx.ownedIds.indexOf(cardId) !== -1;

    // 1) Sign-up bonus (if user could realistically hit it AND doesn't already hold it)
    var signupValue = 0;
    if (!alreadyOwned && c.min_spend > 0) {
      var canHit = (spend.monthly * c.spend_window_months) >= c.min_spend;
      // In Quick mode we assume yes; in Deep mode we apply spend test
      if (mode === "quick" || canHit) {
        signupValue = c.bonus_points * val;
      } else {
        // partial credit if they can hit ~80%
        var ratio = (spend.monthly * c.spend_window_months) / c.min_spend;
        if (ratio >= 0.8) signupValue = c.bonus_points * val * 0.7;
      }
    }
    // If "no new cards" style, kill signup bonus value
    if (style.style_apply === "no_new" && !alreadyOwned) signupValue = 0;

    // Quick-mode default: discourage premium-fee cards unless user has clearly opted in.
    // Quick-mode users haven't told us their fee comfort, so anchor on $95-or-less cards.
    // They can switch to Deep dive to override.
    var quickFeeGuard = (mode === "quick" && c.annual_fee > 100 && !alreadyOwned);

    // 2) Category earn LIFT: how much more this card earns vs. a 1.5% basic card
    // We score earn only on the share that flows through THIS card (assume 60% if added on top of existing).
    var existingCount = ctx.ownedIds.filter(function (x) { return x !== "none"; }).length;
    var addedShare = alreadyOwned ? 0.5 : (existingCount === 0 ? 0.9 : 0.6);
    var routedAnnual = annual * addedShare;
    var dollarsByCat = {
      dining: routedAnnual * (spend.dining / Math.max(1, spend.monthly)),
      grocery: routedAnnual * (spend.grocery / Math.max(1, spend.monthly)),
      gas: routedAnnual * (spend.gas / Math.max(1, spend.monthly)),
      travel: routedAnnual * (spend.travel / Math.max(1, spend.monthly)),
      streaming: routedAnnual * (spend.streaming / Math.max(1, spend.monthly)),
      other: routedAnnual * (spend.other / Math.max(1, spend.monthly))
    };
    var pointsEarned =
      dollarsByCat.dining * c.dining_mult +
      dollarsByCat.grocery * c.grocery_mult +
      dollarsByCat.gas * c.gas_mult +
      dollarsByCat.travel * c.travel_mult +
      dollarsByCat.streaming * c.streaming_mult +
      dollarsByCat.other * c.base_mult;
    var earnValue = pointsEarned * val;
    var baselineCashback = routedAnnual * VALUATIONS.cashback;
    var earnLift = Math.max(0, earnValue - baselineCashback);

    // 3) Trip credit value (one trip)
    var tripBenefit = c.trip_credit || 0;
    // Cruises + intl get extra value from amex_plat / venture_x / csr
    if (trip === "cruise" && cardId === "amex_plat") tripBenefit = Math.max(tripBenefit, 300);
    if (trip === "europe" && (c.intl_no_fee || c.lounge)) tripBenefit += c.lounge ? 100 : 40;

    // 4) Style fit bonuses (annualized value)
    var styleFit = 0;
    var styleFitNotes = [];
    if (c.lounge && (style.style_lounges === "always" || style.style_lounges === "sometimes")) {
      var loungeValue = style.style_lounges === "always" ? 400 : 150;
      styleFit += loungeValue;
      styleFitNotes.push("Lounge access (~" + fmt$(loungeValue) + "/yr based on how often you use them)");
    }
    if (c.primary_rental_cdw && (style.style_transport === "rental_car" || style.style_transport === "both")) {
      styleFit += 100;
      styleFitNotes.push("Primary rental car insurance ($100+ in declined CDW)");
    }
    if (c.fhr && style.style_lodging === "hotels") {
      styleFit += 200;
      styleFitNotes.push("Amex Fine Hotels credits (~$200/yr in property credits)");
    }
    if (c.intl_no_fee && (style.style_intl === "yearly" || style.style_intl === "often")) {
      styleFit += style.style_intl === "often" ? 120 : 50;
      styleFitNotes.push("No foreign transaction fees");
    }

    // 5) Fee drag
    var feeDrag = c.annual_fee;
    // Fee comfort: HARD penalty when user explicitly chose a fee cap.
    // Stated preferences should beat marginal points math.
    var feePenalty = 0;
    if (style.style_fee === "under_100" && c.annual_fee > 100 && !alreadyOwned) {
      // 4x penalty + flat $1500 — effectively disqualifies high-fee cards
      feePenalty = (c.annual_fee - 100) * 4 + 1500;
    } else if (style.style_fee === "under_400" && c.annual_fee > 400 && !alreadyOwned) {
      feePenalty = (c.annual_fee - 400) * 3 + 800;
    }

    // 6) Hard penalties
    var hardPenalty = 0;
    if (style.style_apply === "no_new" && !alreadyOwned) hardPenalty = 5000; // effectively disqualify
    // Already doing the work: penalize new premium adds
    if (ctx.alreadyDoingWork && !alreadyOwned && c.annual_fee >= 95) hardPenalty += 500;
    // Quick-mode fee guard: in Quick mode, anchor on <$100 cards unless user clearly needs more
    if (quickFeeGuard) {
      hardPenalty += (c.annual_fee - 100) * 2 + 600;
    }

    var net = signupValue + earnLift + tripBenefit + styleFit - feeDrag - feePenalty - hardPenalty;

    return {
      cardId: cardId,
      net: net,
      signupValue: Math.round(signupValue),
      earnLift: Math.round(earnLift),
      tripBenefit: Math.round(tripBenefit),
      styleFit: Math.round(styleFit),
      feeDrag: Math.round(feeDrag),
      feePenalty: Math.round(feePenalty),
      hardPenalty: Math.round(hardPenalty),
      alreadyOwned: alreadyOwned,
      styleFitNotes: styleFitNotes,
      annualFee: c.annual_fee,
      name: c.name
    };
  }

  function rankCards(ctx) {
    var ranked = CARD_ORDER.map(function (id) { return scoreCard(id, ctx); });
    ranked.sort(function (a, b) { return b.net - a.net; });
    return ranked;
  }

  // ----------------------------------------------------------------
  // MAIN CALCULATE
  // ----------------------------------------------------------------
  function calculate(input) {
    var sticker = input.sticker;
    var monthly = input.monthly;
    var spend = input.spend;
    var timing = input.timing;
    var tripType = input.tripType;
    var ownedIds = input.cards.filter(function (c) { return c !== "none"; });
    var hasNone = input.cards.indexOf("none") !== -1 || ownedIds.length === 0;

    // Existing points value
    var existingRaw =
      (input.points.chase_ur || 0) * VALUATIONS.ur +
      (input.points.amex_mr || 0) * VALUATIONS.mr +
      (input.points.capone_miles || 0) * VALUATIONS.capone +
      (input.points.hotel_points || 0) * VALUATIONS.hotel;
    var existingValue = Math.min(existingRaw, sticker * 0.7);

    var premiumOwned = ownedIds.filter(function (id) {
      return PREMIUM_IDS.indexOf(id) !== -1 && CARDS[id] && CARDS[id].annual_fee > 0;
    });
    var alreadyDoingWork = premiumOwned.length >= 3;

    var ctx = {
      tripType: tripType, timing: timing,
      monthly: monthly, spend: spend,
      ownedIds: ownedIds, hasNone: hasNone,
      alreadyDoingWork: alreadyDoingWork,
      style: input.style
    };

    // RANK ALL CARDS
    var ranked = rankCards(ctx);

    // Pick top recommendation that the user doesn't already own (unless all top picks are owned)
    var recScore = null;
    for (var i = 0; i < ranked.length; i++) {
      if (!ranked[i].alreadyOwned) { recScore = ranked[i]; break; }
    }
    // Fallback: if all owned (unlikely) or no_new, recommend redeploying their top owned card
    var noCardReason = null;
    if (!recScore || recScore.net <= 0) {
      recScore = null;
      if (input.style.style_apply === "no_new") noCardReason = "no_new";
      else if (alreadyDoingWork) noCardReason = "already_doing";
      else noCardReason = "no_good_fit";
    }

    // Too-soon guardrail
    if (recScore && timing === "next_3") {
      var c = CARDS[recScore.cardId];
      var maxAch = monthly * (c.spend_window_months || 3);
      if (c.min_spend > 0 && c.min_spend > maxAch * 0.9) {
        recScore = null;
        noCardReason = "too_soon";
      }
    }

    var recId = recScore ? recScore.cardId : null;
    var signupValue = recScore ? recScore.signupValue : 0;
    var cardMoveValue = recScore ? Math.max(0, recScore.net) : 0;

    // Timing
    var timingTbl = TIMING_TABLE[tripType] || TIMING_TABLE.other;
    var timingPct = clamp(timingTbl[timing] || 0, 0, 0.25);
    var timingSavings = sticker * timingPct;
    var timingNote = timingTbl["note_" + timing] || timingTbl.note_3_12;

    // Cap gap at 80%
    var totalGap = existingValue + cardMoveValue + timingSavings;
    var maxGap = sticker * 0.8;
    if (totalGap > maxGap) {
      var scale = maxGap / totalGap;
      existingValue *= scale;
      cardMoveValue *= scale;
      timingSavings *= scale;
      totalGap = maxGap;
    }
    var whatYouPay = Math.max(0, sticker - totalGap);

    return {
      sticker: sticker, whatYouPay: whatYouPay, totalGap: totalGap,
      existingValue: existingValue, cardMoveValue: cardMoveValue, timingSavings: timingSavings,
      timingNote: timingNote, timingPct: timingPct,
      recId: recId, recScore: recScore, ranked: ranked,
      noCardReason: noCardReason,
      signupValue: signupValue,
      pointsRaw: existingRaw, points: input.points,
      tripType: tripType, timing: timing,
      adults: input.adults, kids: input.kids,
      monthly: monthly, spend: spend,
      ownedIds: ownedIds, hasNone: hasNone,
      premiumOwned: premiumOwned, alreadyDoingWork: alreadyDoingWork,
      style: input.style
    };
  }

  // ----------------------------------------------------------------
  // PLAIN-ENGLISH "WHY THIS CARD" REASONS
  // ----------------------------------------------------------------
  function reasonsFor(rs, ctx) {
    var c = CARDS[rs.cardId];
    var out = [];
    // Best category match
    var spend = ctx.spend;
    var topCat = null, topVal = 0;
    var cats = [
      { key: "dining", mult: c.dining_mult, spend: spend.dining, label: "dining out" },
      { key: "grocery", mult: c.grocery_mult, spend: spend.grocery, label: "groceries" },
      { key: "gas", mult: c.gas_mult, spend: spend.gas, label: "gas" },
      { key: "travel", mult: c.travel_mult, spend: spend.travel, label: "travel" }
    ];
    cats.forEach(function (x) {
      if (x.mult >= 2 && x.spend > 0) {
        var v = x.mult * x.spend;
        if (v > topVal) { topVal = v; topCat = x; }
      }
    });
    if (topCat) {
      out.push("Earns " + topCat.mult + "x on " + topCat.label + " — your "
        + fmt$(topCat.spend) + "/mo there is the biggest lever.");
    }
    if (rs.signupValue >= 500) {
      out.push("Sign-up bonus is worth about " + fmt$(rs.signupValue)
        + " — that alone covers most of this trip.");
    }
    rs.styleFitNotes.forEach(function (n) { out.push(n + "."); });
    if (c.annual_fee === 0) out.push("Free to hold. There's no version of the math where this hurts you.");
    else if (rs.feeDrag <= rs.tripBenefit + rs.styleFit) out.push("The $" + c.annual_fee + " fee is fully offset by credits and perks you'll actually use.");
    else if (rs.signupValue + rs.earnLift + rs.tripBenefit + rs.styleFit > rs.feeDrag * 2) out.push("First-year value is more than 2× the fee — the math works.");
    // De-dupe / cap
    var seen = {};
    var clean = [];
    out.forEach(function (s) { if (!seen[s]) { seen[s] = true; clean.push(s); } });
    return clean.slice(0, 5);
  }

  // ----------------------------------------------------------------
  // TRIP-COST INTELLIGENCE: BENCHMARKS
  // ----------------------------------------------------------------
  function buildBenchmark(tripType, adults, kids, sticker) {
    var b = BENCHMARKS[tripType] || BENCHMARKS.other;
    var low = adults * b.adult.low + kids * b.kid.low;
    var mid = adults * b.adult.mid + kids * b.kid.mid;
    var high = adults * b.adult.high + kids * b.kid.high;
    var label, status;
    if (sticker < low * 0.9) {
      label = "Your number is on the lean side."; status = "low";
    } else if (sticker > high * 1.1) {
      label = "Your number is in premium territory."; status = "high";
    } else if (sticker < mid) {
      label = "Your number is below the typical midpoint — solid budgeting."; status = "mid_low";
    } else {
      label = "Your number is in the typical range for this kind of trip."; status = "mid_high";
    }
    return {
      low: low, mid: mid, high: high, label: label, status: status,
      summary: "Most families with " + adults + " adults and " + kids + " kids on a " +
        (TRIP_LABELS[tripType] || "trip") + " spend roughly " + fmt$(low) + "–" + fmt$(high) +
        " (midpoint " + fmt$(mid) + "). " + label
    };
  }

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  function familyLabel(adults, kids) {
    var total = adults + kids;
    if (kids === 0 && adults === 1) return "a solo traveler";
    if (kids === 0 && adults === 2) return "a couple";
    if (kids === 0) return adults + " adults";
    return "a family of " + total;
  }

  function biggestPointsAccount(p) {
    var entries = [
      { name: "Chase Ultimate Rewards", v: (p.chase_ur || 0) * VALUATIONS.ur },
      { name: "Amex Membership Rewards", v: (p.amex_mr || 0) * VALUATIONS.mr },
      { name: "Capital One Miles", v: (p.capone_miles || 0) * VALUATIONS.capone },
      { name: "your hotel program", v: (p.hotel_points || 0) * VALUATIONS.hotel }
    ];
    entries.sort(function (a, b) { return b.v - a.v; });
    return entries[0].v > 0 ? entries[0].name : "your rewards account";
  }
  function totalRawPoints(p) { return (p.chase_ur || 0) + (p.amex_mr || 0) + (p.capone_miles || 0) + (p.hotel_points || 0); }

  function render(r) {
    var results = $("#calc-results");
    results.removeAttribute("hidden");

    var tripLabel = TRIP_LABELS[r.tripType] || "trip";
    $("#result-kicker").textContent = "Your " + fmt$(r.sticker) + " " + tripLabel + " for " + familyLabel(r.adults, r.kids);

    $("#big-sticker").textContent = fmt$(r.sticker);
    $("#big-pay").textContent = fmt$(r.whatYouPay);
    $("#big-gap").textContent = fmt$(r.totalGap);

    // Edge banner
    var edge = $("#edge-banner");
    edge.setAttribute("hidden", ""); edge.innerHTML = "";
    if (r.sticker < 1500) {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>Honestly? At this trip size, the math is small.</strong> Use what you have, book midweek, and move on. Save the calculator for the bigger trips.";
    } else if (r.alreadyDoingWork) {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>You&rsquo;re already doing the work.</strong> Adding another premium card is noise. Focus on redeploying what you have.";
    } else if (r.noCardReason === "too_soon") {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>Your trip is too close to chase a sign-up bonus.</strong> A new card&rsquo;s minimum-spend window won&rsquo;t clear in time.";
    } else if (r.noCardReason === "no_new") {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>You told us no new cards right now.</strong> We&rsquo;re showing you how to deploy what you already hold.";
    }

    // Summary
    $("#result-summary").textContent = r.sticker < 1500
      ? "Take the trip. Pay attention next time the number is bigger."
      : "You're leaving " + fmt$(r.totalGap) + " on the table. Here's how to get it back.";

    // Gap table
    $("#gap-points").textContent = fmt$(r.existingValue);
    $("#gap-card").textContent = fmt$(r.cardMoveValue);
    $("#gap-timing").textContent = fmt$(r.timingSavings);
    $("#gap-total").textContent = fmt$(r.totalGap);

    // Intelligence
    renderIntel(r);

    // Moves
    var move1;
    if (r.existingValue > 100) {
      move1 = "You have about " + fmt$(r.pointsRaw) + " in points sitting in " + biggestPointsAccount(r.points) + ". We're counting " + fmt$(r.existingValue) + " toward this trip (capped — no one redeems 100% in real life). Redeem them. Don't save points forever. They're worth less every year.";
    } else if (totalRawPoints(r.points) > 0) {
      move1 = "You have a small points balance. Use it. Even " + fmt$(r.pointsRaw) + " toward a meal or a cabin upgrade is " + fmt$(r.pointsRaw) + " you didn't pay out of pocket.";
    } else {
      move1 = "You don't have an existing points balance — that's normal. The next 12 months are where you build one. Start with the card move below.";
    }
    $("#move-1").textContent = move1;

    var move2;
    if (r.alreadyDoingWork) {
      move2 = "You already hold " + r.premiumOwned.length + " premium cards. Adding another would be noise. Pick the one card with the best transfer partners or trip-specific credit, and redeem it cleanly for this trip.";
    } else if (r.noCardReason === "too_soon") {
      move2 = "Don't apply right now — the minimum-spend window won't clear before the trip. Re-run this after you book, and we'll line up the right card for the trip after.";
    } else if (r.noCardReason === "no_new") {
      move2 = "You said no new cards. Skip the move. Re-route your spend to the highest-multiplier card you already hold for each category.";
    } else if (r.recId) {
      var rec = CARDS[r.recId];
      move2 = "Apply for the " + rec.name + " this month. Hit the $" + rec.min_spend.toLocaleString() + " minimum spend over " + rec.spend_window_months + " months of normal household expenses. That clears the " + Math.round(rec.bonus_points / 1000) + "K bonus — worth about " + fmt$(r.signupValue) + " toward this trip.";
    } else {
      move2 = "No new card. The math doesn't justify one for this trip.";
    }
    $("#move-2").textContent = move2;

    $("#move-3").textContent = r.timingNote;

    // Recommendation card
    var recCard = $("#rec-card");
    if (!r.recId || !r.recScore) {
      recCard.setAttribute("hidden", "");
    } else {
      recCard.removeAttribute("hidden");
      var c = CARDS[r.recId];
      var rs = r.recScore;
      $("#rec-name").textContent = c.name;
      $("#rec-fee").textContent = c.annual_fee === 0 ? "$0" : fmt$(c.annual_fee);
      $("#rec-bonus").textContent = fmt$(rs.signupValue);
      $("#rec-net").textContent = fmt$(Math.max(0, rs.net));

      // Reasons
      var ctx = { spend: r.spend, tripType: r.tripType, ownedIds: r.ownedIds, style: r.style, alreadyDoingWork: r.alreadyDoingWork };
      var reasons = reasonsFor(rs, ctx);
      var reasonsEl = $("#rec-reasons"); reasonsEl.innerHTML = "";
      reasons.forEach(function (txt) {
        var li = document.createElement("li"); li.textContent = txt; reasonsEl.appendChild(li);
      });

      // Trip-specific benefit copy (simple, derived from card credit + trip)
      var benefitMap = {
        cruise: "Trip protection + cabin-credit usable against the booking.",
        disney: "Resort and dining earn at the card's top rate. Useful credits before you fly.",
        europe: "No foreign transaction fees + travel protection across the trip.",
        all_inclusive: "Resort booking earns at the card's top rate; trip credits offset extras.",
        hawaii: "Hotels through the card portal earn the highest rate; lounge access at HNL if the card has it.",
        national_park: "Lodge bookings + rental car coverage useful here.",
        road_trip: "Hotel and gas earning is the lever on a road trip.",
        other: "Standard travel protections + category earn."
      };
      var bMap = {
        csp: "Book through Chase Travel for 5x earn. Primary rental car insurance covers your road days.",
        csr: "$300 travel credit + Priority Pass + 8x via Chase Travel. The premium features earn their keep on trips like this.",
        venture: "2x on everything, redeem against any travel purchase. Simplest card to use.",
        venture_x: "$300 travel credit + 10x hotels via Capital One Travel + Priority Pass. The credit cuts the fee to about $95 net.",
        amex_gold: "4x at restaurants and groceries — the trip-prep + travel-day food bill becomes a points engine.",
        amex_plat: "Lounge access + Fine Hotels credit + 5x flights. Premium features pay off on longer or international trips.",
        bilt: "No annual fee. Earn on rent. Solid complement to a main travel card.",
        citi_premier: "3x on travel, dining, gas, grocery — the most balanced earning at $95/yr."
      };
      $("#rec-benefit").textContent = bMap[r.recId] || benefitMap[r.tripType] || "Strong rewards earning on this trip.";

      $("#rec-pro").textContent = (PROCONS[r.recId] || {}).pro || "";
      $("#rec-con").textContent = (PROCONS[r.recId] || {}).con || "";

      // Scored breakdown table
      var rows = [];
      rows.push(["Sign-up bonus", rs.signupValue, c.bonus_points.toLocaleString() + " points × $" + VALUATIONS[c.bonus_currency].toFixed(3) + "/pt"]);
      rows.push(["Category earn lift (1 yr)", rs.earnLift, "How much more this card earns vs. a basic 1.5% cashback card, based on your spending profile."]);
      rows.push(["Trip credit applied", rs.tripBenefit, "Travel credit or trip-specific perk usable on this booking."]);
      rows.push(["Lifestyle perks", rs.styleFit, rs.styleFitNotes.length ? rs.styleFitNotes.join("; ") : "Perks aligned with how you travel (lounges, rental insurance, FHR, intl)."]);
      rows.push(["Annual fee", -rs.feeDrag, c.annual_fee === 0 ? "No annual fee." : "Subtracted from first-year value."]);
      if (rs.feePenalty > 0) rows.push(["Fee comfort penalty", -rs.feePenalty, "You told us you're more comfortable with a lower-fee card."]);
      if (rs.hardPenalty > 0) rows.push(["Other penalties", -rs.hardPenalty, "Adjustments for already-doing-the-work or no-new-cards preferences."]);
      var rowsEl = $("#score-rows"); rowsEl.innerHTML = "";
      rows.forEach(function (row) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td"); td1.textContent = row[0]; tr.appendChild(td1);
        var td2 = document.createElement("td"); td2.className = "num";
        var v = row[1];
        td2.textContent = (v < 0 ? "-" : "") + fmt$(Math.abs(v));
        if (v < 0) td2.classList.add("neg");
        tr.appendChild(td2);
        var td3 = document.createElement("td"); td3.className = "why"; td3.textContent = row[2]; tr.appendChild(td3);
        rowsEl.appendChild(tr);
      });
      $("#score-net").textContent = fmt$(Math.max(0, rs.net));
      $("#rec-math-intro").textContent = "First-year value for you, based on " + fmt$(r.spend.monthly) + "/mo in spending, this " + (TRIP_LABELS[r.tripType] || "trip") + ", and how you travel.";

      // Ranked table (deep mode only)
      var rankWrap = $("#rec-ranked-wrap");
      if (mode === "deep") {
        rankWrap.hidden = false;
        var rrEl = $("#rank-rows"); rrEl.innerHTML = "";
        r.ranked.slice(0, 8).forEach(function (rs2, idx) {
          var tr = document.createElement("tr");
          var t1 = document.createElement("td"); t1.textContent = (idx + 1); tr.appendChild(t1);
          var t2 = document.createElement("td"); t2.textContent = rs2.name + (rs2.alreadyOwned ? " (you own)" : ""); tr.appendChild(t2);
          var t3 = document.createElement("td"); t3.className = "num"; t3.textContent = fmt$(Math.max(0, rs2.net)); tr.appendChild(t3);
          var t4 = document.createElement("td"); t4.textContent = rs2.annualFee === 0 ? "$0" : fmt$(rs2.annualFee); tr.appendChild(t4);
          if (idx === 0) tr.classList.add("rank-top");
          rrEl.appendChild(tr);
        });
      } else {
        rankWrap.hidden = true;
      }

      var cta = $("#rec-cta");
      cta.href = CTA_URLS[r.recId] || "#";
      cta.textContent = "Learn more about the " + c.name;
      cta.setAttribute("target", "_blank");
      cta.setAttribute("rel", "noopener noreferrer");
    }

    requestAnimationFrame(function () {
      results.classList.add("visible");
      var top = results.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: top, behavior: "smooth" });
    });

    window.__lastResult = r;
  }

  function renderIntel(r) {
    var card = $("#intel-card");
    card.removeAttribute("hidden");

    // Benchmark
    var bench = buildBenchmark(r.tripType, r.adults, r.kids, r.sticker);
    $("#intel-benchmark").textContent = bench.summary;
    // Bar viz
    var wrap = $("#intel-bar-wrap");
    wrap.removeAttribute("hidden");
    // Render: track goes from low*0.6 to high*1.4
    var trackLo = bench.low * 0.6;
    var trackHi = bench.high * 1.4;
    var pct = function (v) { return clamp(((v - trackLo) / (trackHi - trackLo)) * 100, 0, 100); };
    var rangeLeft = pct(bench.low);
    var rangeRight = pct(bench.high);
    var rangeEl = $("#intel-bar-range");
    rangeEl.style.left = rangeLeft + "%";
    rangeEl.style.right = (100 - rangeRight) + "%";
    var marker = $("#intel-bar-marker");
    marker.style.left = pct(r.sticker) + "%";
    $("#intel-bar-low").textContent = fmt$(bench.low);
    $("#intel-bar-high").textContent = fmt$(bench.high);

    // Hidden costs
    var hidden = HIDDEN_COSTS[r.tripType] || HIDDEN_COSTS.other;
    var hEl = $("#intel-hidden"); hEl.innerHTML = "";
    hidden.forEach(function (t) {
      var li = document.createElement("li"); li.textContent = t; hEl.appendChild(li);
    });

    // Missing items
    var missing = missingItems(r.tripType, r.adults, r.kids, r.sticker);
    var mEl = $("#intel-missing"); mEl.innerHTML = "";
    missing.forEach(function (m) {
      var li = document.createElement("li");
      li.innerHTML = "<span>" + m.label + "</span> <span class=\"intel-num\">~ " + fmt$(m.value) + "</span>";
      mEl.appendChild(li);
    });

    // Booking
    $("#intel-booking").textContent = BOOKING_TIPS[r.tripType] || BOOKING_TIPS.other;
  }

  // ----------------------------------------------------------------
  // STICKER BENCHMARK INLINE (updates with inputs)
  // ----------------------------------------------------------------
  function updateStickerBenchmark() {
    var tripType = $("#trip-type").value;
    var adults = parseInt($("#adults").value, 10) || 0;
    var kids = parseInt($("#kids").value, 10) || 0;
    var sticker = parseInt($("#sticker").value, 10) || 0;
    var b = BENCHMARKS[tripType] || BENCHMARKS.other;
    var low = adults * b.adult.low + kids * b.kid.low;
    var high = adults * b.adult.high + kids * b.kid.high;
    var el = $("#sticker-benchmark");
    if (!sticker || !el) return;
    var status;
    if (sticker < low * 0.85) status = "lean";
    else if (sticker > high * 1.15) status = "premium";
    else status = "typical";
    var labelMap = { lean: "Below typical range", premium: "Above typical range", typical: "In the typical range" };
    el.textContent = "Benchmark for " + adults + "A + " + kids + "K on this trip: " +
      fmt$(low) + "–" + fmt$(high) + " (" + labelMap[status].toLowerCase() + ").";
  }

  // ----------------------------------------------------------------
  // FORM SUBMIT
  // ----------------------------------------------------------------
  var form = $("#calc-form");
  var submitBtn = $("#calc-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    var origText = submitBtn.textContent;
    submitBtn.textContent = "Running the math…";
    setTimeout(function () {
      try {
        var input = readForm();
        var r = calculate(input);
        render(r);
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
      }
    }, 320);
  });

  function readForm() {
    var tripType = $("#trip-type").value;
    var adults = parseInt($("#adults").value, 10) || 0;
    var kids = parseInt($("#kids").value, 10) || 0;
    var sticker = parseInt($("#sticker").value, 10) || 0;
    var timing = (document.querySelector('input[name="timing"]:checked') || {}).value || "3_12";
    var monthlySlider = parseInt($("#monthly").value, 10) || 0;
    var spend = readCategorySpend(monthlySlider);
    var cards = cardChecks.filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
    var points = {
      chase_ur: parseInt($("#chase-ur").value, 10) || 0,
      amex_mr: parseInt($("#amex-mr").value, 10) || 0,
      capone_miles: parseInt($("#capone-miles").value, 10) || 0,
      hotel_points: parseInt($("#hotel-points").value, 10) || 0
    };
    var style = {
      style_lounges: pillValue("style_lounges") || "sometimes",
      style_lodging: pillValue("style_lodging") || "hotels",
      style_transport: pillValue("style_transport") || "rental_car",
      style_fee: pillValue("style_fee") || "under_100",
      style_apply: pillValue("style_apply") || "one_at_time",
      style_intl: pillValue("style_intl") || "rarely"
    };
    return {
      tripType: tripType, adults: adults, kids: kids,
      sticker: sticker, timing: timing,
      monthly: spend.monthly, spend: spend,
      cards: cards, points: points, style: style
    };
  }

  // ----------------------------------------------------------------
  // WORKSHEET FORM
  // ----------------------------------------------------------------
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  function setMsg(formEl, kind, text) {
    var msg = formEl.querySelector(".form-msg");
    if (!msg) return;
    msg.classList.remove("error", "success");
    if (kind) msg.classList.add(kind);
    msg.textContent = text || "";
  }
  var wsForm = $("#worksheet-form");
  wsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = wsForm.querySelector('input[type="email"]');
    var btn = wsForm.querySelector("button[type=submit]");
    var email = (input.value || "").trim();
    if (!EMAIL_RE.test(email)) {
      setMsg(wsForm, "error", "Please enter a valid email address.");
      input.focus(); return;
    }
    btn.disabled = true; btn.textContent = "Sending…";
    setMsg(wsForm, "", "");
    setTimeout(function () {
      var wrap = document.createElement("div");
      wrap.className = "form-success";
      wrap.setAttribute("role", "status");
      wrap.style.cssText = "padding:20px 22px;border-radius:14px;background:rgba(230,163,64,0.18);border:1.5px solid rgba(230,163,64,0.5);color:var(--cream);font-weight:600;max-width:460px;margin:0 auto;font-size:16px;";
      wrap.textContent = "Sent. Check your inbox — and watch for Tuesday's brief.";
      wsForm.replaceWith(wrap);
    }, 350);
  });

  // ----------------------------------------------------------------
  // INIT
  // ----------------------------------------------------------------
  bindSlider("cost-per-adult", "cost-per-adult-display", function (v) { return fmt$(v); });
  bindSlider("cost-per-kid", "cost-per-kid-display", function (v) { return fmt$(v); });
  bindSlider("monthly", "monthly-display", function (v) { return fmt$(v); });

  // Expense profile sliders (deep mode)
  bindSlider("exp-dining", "exp-dining-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-grocery", "exp-grocery-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-gas", "exp-gas-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-travel", "exp-travel-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-streaming", "exp-streaming-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-other", "exp-other-display", function (v) { return fmt$(v); }, updateProfileTotal);
  updateProfileTotal();

  // Live sticker price
  var adultsEl = $("#adults");
  var kidsEl = $("#kids");
  var perAdultEl = $("#cost-per-adult");
  var perKidEl = $("#cost-per-kid");
  var stickerHidden = $("#sticker");
  var stickerDisplay = $("#sticker-display");
  var stickerBreakdown = $("#sticker-breakdown");

  function recalcSticker() {
    var adults = parseInt(adultsEl.value, 10) || 0;
    var kids = parseInt(kidsEl.value, 10) || 0;
    var perAdult = parseInt(perAdultEl.value, 10) || 0;
    var perKid = parseInt(perKidEl.value, 10) || 0;
    var sticker = adults * perAdult + kids * perKid;
    stickerHidden.value = sticker;
    stickerDisplay.textContent = fmt$(sticker);
    var aLabel = adults === 1 ? "adult" : "adults";
    var kLabel = kids === 1 ? "kid" : "kids";
    if (kids > 0) {
      stickerBreakdown.innerHTML = adults + " " + aLabel + " \u00d7 " + fmt$(perAdult) + " + " + kids + " " + kLabel + " \u00d7 " + fmt$(perKid);
    } else {
      stickerBreakdown.innerHTML = adults + " " + aLabel + " \u00d7 " + fmt$(perAdult);
    }
    updateStickerBenchmark();
  }
  [adultsEl, kidsEl, perAdultEl, perKidEl].forEach(function (el) {
    el.addEventListener("input", recalcSticker);
    el.addEventListener("change", recalcSticker);
  });
  $("#trip-type").addEventListener("change", updateStickerBenchmark);
  recalcSticker();
  setMode("quick");
})();
