/* =====================================================================
   Vacation Math — Calculator v2
   - Quick pick (~2 min) and Deep dive (~5 min) modes
   - Category-level expense profile + travel style inputs
   - Transparent scored card recommendation engine
   - Trip-cost intelligence: benchmarks, hidden costs, missing items, booking
   ===================================================================== */
(function (g) {
  "use strict";

  // ----------------------------------------------------------------
  // CARD DATABASE (verified August 2026)
  // ----------------------------------------------------------------
  var CARDS = {
    csp: {
      id: "csp", name: "Chase Sapphire Preferred",
      annual_fee: 95, bonus_points: 75000, bonus_currency: "ur",
      min_spend: 5000, spend_window_months: 3,
      travel_mult: 5, dining_mult: 3, grocery_mult: 1, gas_mult: 3, streaming_mult: 3, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: true,
      trip_credit: 100,
      note: "75k after $5k/3 mo. $100 Chase Travel hotel credit. 5x Chase Travel, 3x dining/gas/streaming/online grocery."
    },
    csr: {
      id: "csr", name: "Chase Sapphire Reserve",
      annual_fee: 795, bonus_points: 100000, bonus_currency: "ur",
      min_spend: 6000, spend_window_months: 3,
      travel_mult: 8, dining_mult: 3, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1,
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
      trip_credit: 0,
      note: "Simple 2x miles. No annual travel credit."
    },
    venture_x: {
      id: "venture_x", name: "Capital One Venture X",
      annual_fee: 395, bonus_points: 75000, bonus_currency: "capone",
      min_spend: 4000, spend_window_months: 3,
      travel_mult: 2, dining_mult: 2, grocery_mult: 2, gas_mult: 2, streaming_mult: 2, base_mult: 2,
      lounge: true, fhr: false, intl_no_fee: true, primary_rental_cdw: true,
      trip_credit: 300,
      note: "$300 travel credit + 10K anniversary miles offset the $395 fee. Extra lounge guests no longer free as of Feb 1, 2026."
    },
    amex_gold: {
      id: "amex_gold", name: "Amex Gold",
      annual_fee: 325, bonus_points: 100000, bonus_currency: "mr",
      min_spend: 8000, spend_window_months: 6,
      travel_mult: 3, dining_mult: 4, grocery_mult: 4, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 120,
      note: "As high as 100k after $8k/6 mo (personalized). Best for families that eat out."
    },
    amex_plat: {
      id: "amex_plat", name: "Amex Platinum",
      annual_fee: 895, bonus_points: 175000, bonus_currency: "mr",
      min_spend: 12000, spend_window_months: 6,
      travel_mult: 5, dining_mult: 1, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: true, fhr: true, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 200,
      note: "As high as 175k after $12k/6 mo (personalized). $895 fee. Lounges + Fine Hotels."
    },
    bilt: {
      id: "bilt", name: "Bilt Blue",
      annual_fee: 0, bonus_points: 0, bonus_currency: "bilt",
      min_spend: 0, spend_window_months: 0,
      travel_mult: 2, dining_mult: 3, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 0,
      note: "Column N.A. card (Wells Fargo MC sunset Feb 7, 2026). $100 Bilt Cash on approval. Earns on rent."
    },
    citi_premier: {
      id: "citi_premier", name: "Citi Strata Premier",
      annual_fee: 95, bonus_points: 60000, bonus_currency: "citi",
      min_spend: 4000, spend_window_months: 3,
      travel_mult: 3, dining_mult: 3, grocery_mult: 3, gas_mult: 3, streaming_mult: 1, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 100,
      note: "Citi Premier's replacement. 60k after $4k/3 mo aggregators; $100 hotel benefit."
    },
    cfu: {
      id: "cfu", name: "Chase Freedom Unlimited",
      annual_fee: 0, bonus_points: 20000, bonus_currency: "cash",
      min_spend: 500, spend_window_months: 3,
      travel_mult: 5, dining_mult: 3, grocery_mult: 1, gas_mult: 1, streaming_mult: 1, base_mult: 1.5,
      lounge: false, fhr: false, intl_no_fee: false, primary_rental_cdw: false,
      trip_credit: 0,
      note: "$200 after $500/3 mo. 5% Chase Travel, 3% dining+drugstores, 1.5% else. Has foreign transaction fees."
    },
    discover_miles: {
      id: "discover_miles", name: "Discover it Miles",
      annual_fee: 0, bonus_points: 0, bonus_currency: "discover",
      min_spend: 0, spend_window_months: 0,
      travel_mult: 3, dining_mult: 3, grocery_mult: 3, gas_mult: 3, streaming_mult: 3, base_mult: 3,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 0,
      note: "1.5 miles/$1 everywhere. Discover Match is first-year only (12 billing periods or 365 days, whichever is longer). No min spend, no match cap. Multipliers model first-year 1.5x+match \u2248 3%."
    },
    wells_autograph: {
      id: "wells_autograph", name: "Wells Fargo Autograph",
      annual_fee: 0, bonus_points: 20000, bonus_currency: "wells",
      min_spend: 1000, spend_window_months: 3,
      travel_mult: 3, dining_mult: 3, grocery_mult: 1, gas_mult: 3, streaming_mult: 3, base_mult: 1,
      lounge: false, fhr: false, intl_no_fee: true, primary_rental_cdw: false,
      trip_credit: 0,
      note: "20,000 points after $1,000/3 mo ($200 at 1\u00a2). Unlimited 3x restaurants, travel, gas+EV, transit, streaming, phone plans; 1x else. No FTF. $0 AF."
    }
  };

  var CARD_ORDER = ["csp", "csr", "venture", "venture_x", "amex_gold", "amex_plat", "bilt", "citi_premier", "cfu", "discover_miles", "wells_autograph"];

  // Points valuations (cents per point). Conservative.
  var VALUATIONS = {
    ur: 0.018, mr: 0.019, capone: 0.017, citi: 0.016, bilt: 0.016, hotel: 0.006,
    cashback: 0.015, cash: 0.01, discover: 0.01, wells: 0.01
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
    disney:        ["Park-hopper upgrade + Lightning Lane / Genie+", "Sit-down dining is 2–3\u00d7 quick-serve", "Magic Bands and merch ($50–$150/kid)", "Resort parking ($25–$35/night)", "Airport transfer (Mears, Uber XL)"],
    all_inclusive: ["Premium liquor upgrade if you drink up", "Off-resort excursions", "Spa and cabana rentals", "Airport transfer (if not included)", "Gratuities even when 'included'"],
    hawaii:        ["Resort fees ($35–$50/night)", "Rental car + parking ($30–$50/day)", "Inter-island flights if hopping", "L\u016b\u02bbau ($150–$200/adult)", "Snorkel/surf lessons or rentals"],
    europe:        ["Foreign transaction fees on the wrong card", "Train + Eurail reservation fees on top of tickets", "City tourist taxes ($2–$8/night)", "Tipping at restaurants when you don't expect to", "Data/SIM plan for the trip"],
    national_park: ["Entrance fees ($30–$35/vehicle) and the $80 America the Beautiful pass", "Gas — distances are bigger than they look", "Bear spray, layers, decent boots if you don't have them", "Guided tours or ranger programs", "In-park lodging is double the gateway town"],
    road_trip:     ["Gas — budget the actual miles, not the optimistic miles", "Resort/hotel fees and parking", "Tolls on the route", "Wear and tear / oil change before or after", "Eating out 3\u00d7 a day adds up fast"],
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
    bilt: "https://www.bilt.com/card",
    citi_premier: "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
    cfu: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    discover_miles: "https://www.discover.com/credit-cards/travel/it-miles.html",
    wells_autograph: "https://creditcards.wellsfargo.com/autograph-visa-credit-card/"
  };

  var TRIP_LABELS = {
    cruise: "cruise", disney: "Disney trip", all_inclusive: "all-inclusive",
    hawaii: "Hawaii trip", europe: "Europe trip", national_park: "national park trip",
    road_trip: "road trip", other: "trip"
  };

  // Honest pros + cons
  var PROCONS = {
    csp: { pro: "75K after $5,000 in 3 months, plus a $100 Chase Travel hotel credit, for $95. Still the best beginner math.", con: "Transfer partner redemptions require a little homework. It's not a one-click card." },
    csr: { pro: "100k after $6,000 in 3 months. If you fly more than twice a year and use the lounges, the $300 travel credit and Priority Pass can earn the $795 fee back.", con: "$795 is real money. If you won't use the credits, the math doesn't work. Honestly evaluate before you apply." },
    venture: { pro: "Simplest premium card on the market. 2x on everything, redeem against any travel.", con: "Capital One miles are worth less per point than Chase or Amex. The simplicity costs you a few percent." },
    venture_x: { pro: "$300 travel credit + 10K anniversary miles effectively reduces the $395 fee to about $0–$50 net.", con: "The 10x hotel rate only works if you book through Capital One's portal. Extra lounge guests are no longer free as of Feb 1, 2026." },
    amex_gold: { pro: "4x dining + 4x grocery is the highest earn rate for normal family spending. Welcome bonus is personalized — as high as 100k after $8k in 6 months.", con: "The $325 fee requires using the dining and Uber credits monthly. Forget once and the math slips." },
    amex_plat: { pro: "If you fly 4+ times a year and use the credits, the lounge access alone is worth the fee. Welcome bonus is personalized — as high as 175k after $12k in 6 months.", con: "$895 is the highest fee in this calculator. Don't pretend the credits will cover it if you won't use them." },
    bilt: { pro: "Bilt Blue (Column N.A.) is free, earns on rent, and pays $100 Bilt Cash on approval.", con: "The transfer partners are good but not Chase- or Amex-level deep. Best as a complement, not a main." },
    citi_premier: { pro: "Strata Premier: 3x groceries, gas, and dining plus a $100 hotel benefit at $95. Quietly the best value of any mid-fee card here.", con: "Citi ThankYou points have fewer transfer partners than Chase or Amex. You give up some flexibility." },
    cfu: { pro: "$200 after $500 in 3 months, then 1.5% everywhere (3% dining+drugstores, 5% Chase Travel) with no annual fee.", con: "Has foreign transaction fees. Travel bonus is Chase Travel portal, not every airline/hotel booking." },
    discover_miles: { pro: "First-year Discover Match turns 1.5 miles per dollar into ~3% everywhere — no min spend, no match cap, no annual fee, no foreign transaction fees.", con: "The match is first-year only. After that you're at 1.5 miles per dollar with no transfer partners. Miles cash out at 1\u00a2." },
    wells_autograph: { pro: "20k points after $1,000 in 3 months ($200 at 1\u00a2). Unlimited 3x on travel, dining, and gas with no annual fee and no foreign transaction fees.", con: "Points transfer to some partners, but not at Chase- or Amex-level. Groceries earn 1x." }
  };


  g.VM_CALC = {
    CARDS: CARDS,
    CARD_ORDER: CARD_ORDER,
    VALUATIONS: VALUATIONS,
    PREMIUM_IDS: PREMIUM_IDS,
    DEFAULT_SHARES: DEFAULT_SHARES,
    TIMING_TABLE: TIMING_TABLE,
    BENCHMARKS: BENCHMARKS,
    HIDDEN_COSTS: HIDDEN_COSTS,
    missingItems: missingItems,
    BOOKING_TIPS: BOOKING_TIPS,
    CTA_URLS: CTA_URLS,
    TRIP_LABELS: TRIP_LABELS,
    PROCONS: PROCONS
  };
})(window);
