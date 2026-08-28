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

  var VALUATIONS = {
    ur: 0.018, mr: 0.019, capone: 0.017, citi: 0.016, bilt: 0.016, hotel: 0.006,
    cashback: 0.015
  };

  var PREMIUM_IDS = ["csr", "venture_x", "amex_plat", "amex_gold", "csp", "venture", "citi_premier"];

  var DEFAULT_SHARES = {
    dining: 0.10, grocery: 0.18, gas: 0.05, travel: 0.05, streaming: 0.02, other: 0.60
  };

  var CTA_URLS = {
    csp: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    csr: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    venture: "https://www.capitalone.com/credit-cards/venture/",
    venture_x: "https://www.capitalone.com/credit-cards/venture-x/",
    amex_gold: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    amex_plat: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    bilt: "https://www.bilt.com/card",
    citi_premier: "https://www.citi.com/credit-cards/citi-strata-premier-credit-card"
  };

  var PROCONS = {
    csp: { pro: "75K after $5,000 in 3 months, plus a $100 Chase Travel hotel credit, for $95. Still the best beginner math.", con: "Transfer partner redemptions require a little homework. It's not a one-click card." },
    csr: { pro: "100k after $6,000 in 3 months. If you fly more than twice a year and use the lounges, the $300 travel credit and Priority Pass can earn the $795 fee back.", con: "$795 is real money. If you won't use the credits, the math doesn't work. Honestly evaluate before you apply." },
    venture: { pro: "Simplest premium card on the market. 2x on everything, redeem against any travel.", con: "Capital One miles are worth less per point than Chase or Amex. The simplicity costs you a few percent." },
    venture_x: { pro: "$300 travel credit + 10K anniversary miles effectively reduces the $395 fee to about $0–$50 net.", con: "The 10x hotel rate only works if you book through Capital One's portal. Extra lounge guests are no longer free as of Feb 1, 2026." },
    amex_gold: { pro: "4x dining + 4x grocery is the highest earn rate for normal family spending. Welcome bonus is personalized — as high as 100k after $8k in 6 months.", con: "The $325 fee requires using the dining and Uber credits monthly. Forget once and the math slips." },
    amex_plat: { pro: "If you fly 4+ times a year and use the credits, the lounge access alone is worth the fee. Welcome bonus is personalized — as high as 175k after $12k in 6 months.", con: "$895 is the highest fee in this calculator. Don't pretend the credits will cover it if you won't use them." },
    bilt: { pro: "Bilt Blue (Column N.A.) is free, earns on rent, and pays $100 Bilt Cash on approval.", con: "The transfer partners are good but not Chase- or Amex-level deep. Best as a complement, not a main." },
    citi_premier: { pro: "Strata Premier: 3x groceries, gas, and dining plus a $100 hotel benefit at $95. Quietly the best value of any mid-fee card here.", con: "Citi ThankYou points have fewer transfer partners than Chase or Amex. You give up some flexibility." }
  };
