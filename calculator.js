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
