/**
 * Vacation Math — Credit Card catalog
 * Verified August 28, 2026 from each issuer's official page.
 * Re-verify quarterly. See refresh playbook.
 *
 * 18 live cards. Citi Custom Cash is kept as available:false (closed to new
 * applicants May 28, 2026) and is never scored or recommended.
 *
 * AFFILIATE PLUMBING:
 *   Apply URLs live in affiliate-config.js (VM_AFFILIATE.urls). Keep per-card
 *   `affiliateUrl` as "" unless you need a one-off override. Renderer prefers
 *   affiliateUrl, then VM_AFFILIATE.urls[id], then issuer `url`. Rankings never
 *   read commission.
 *
 * VALUE MATH:
 *   Each card has a `valueFn(tripCost, opts)` that returns the realistic first-year
 *   offset for THIS trip — sign-up bonus value + reasonable category earn on the trip,
 *   capped by what's plausible. Honest math, not aspirational ceilings.
 *   Annual-fee convention is per-card: CSP does not subtract AF; Venture X, Venture,
 *   Amex Gold, CSR, and Strata Premier do.
 */
(function (g) {
  "use strict";

  // -- Verified August 28, 2026 offers --
  var CARDS = {
    csp: {
      id: "csp",
      name: "Chase Sapphire Preferred",
      issuer: "Chase",
      annualFee: 95,
      bonus: { points: 75000, spend: 5000, months: 3, dollarValue: 938 }, // 75k * 1.25¢ portal
      earn: "5x Chase Travel, 3x dining, 3x gas/EV/vacation homes, 3x streaming + online grocery, 2x other travel, 1x else",
      pointValue: 1.25, // ¢ per point via Chase Travel portal
      networkPerks: "$100 Chase Travel hotel credit, trip insurance, primary rental car coverage, no foreign transaction fees",
      bestFor: "Flexible travel — transferable points to airlines + hotels",
      url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 938; // verified portal value of 75k pts
        var hotelCredit = 100; // Chase Travel hotel credit (was $50; $100 as of Aug 28, 2026)
        var trip = Math.min(tripCost, 6000) * 0.025;
        return Math.round(bonus + hotelCredit + trip);
      }
    },

    csr: {
      id: "csr",
      name: "Chase Sapphire Reserve",
      issuer: "Chase",
      annualFee: 795,
      bonus: { points: 100000, spend: 6000, months: 3, dollarValue: 1500 }, // 100k * 1.5¢ portal floor
      earn: "8x Chase Travel, 4x flights+hotels booked direct, 3x dining, 1x else",
      pointValue: 1.5,
      networkPerks: "$300 travel credit, Priority Pass + Chase Sapphire Lounges, $300 OpenTable dining credit (narrow restaurant list), trip insurance, no FTF",
      bestFor: "Frequent travelers who'll actually use the $300 travel credit and lounges",
      url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 1500;
        var travelCredit = 300;
        var diningCredit = 150; // conservative slice of the $300 OpenTable credit
        var trip = Math.min(tripCost, 6000) * 0.025;
        return Math.round(bonus + travelCredit + diningCredit + trip - 795);
      }
    },

    venturex: {
      id: "venturex",
      name: "Capital One Venture X",
      issuer: "Capital One",
      annualFee: 395,
      bonus: { points: 75000, spend: 4000, months: 3, dollarValue: 750 }, // 1¢ floor via Capital One Travel
      earn: "10x hotels/cars via Capital One Travel, 5x flights via portal, 2x else",
      pointValue: 1.0,
      networkPerks: "$300 annual travel credit, 10,000-mile anniversary bonus (~$100), Priority Pass lounges, no FTF. As of Feb 1, 2026 extra guests at Capital One / Priority Pass lounges are no longer free (cardholder still has access).",
      bestFor: "Premium perks if you'll use the $300 travel credit (net $95/yr effective fee)",
      url: "https://www.capitalone.com/credit-cards/venture-x/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 750;
        var creditOffset = 300;
        var anniversary = 100;
        var trip = Math.min(tripCost, 6000) * 0.02;
        return Math.round(bonus + creditOffset + anniversary + trip - 395);
      }
    },

    venture: {
      id: "venture",
      name: "Capital One Venture",
      issuer: "Capital One",
      annualFee: 95,
      bonus: { points: 75000, spend: 4000, months: 3, dollarValue: 750 },
      earn: "5x hotels/cars via Capital One Travel, 2x everything else",
      pointValue: 1.0,
      networkPerks: "Global Entry/TSA credit, no FTF, transferable miles",
      bestFor: "Simple flat-rate travel rewards with a strong bonus",
      url: "https://www.capitalone.com/credit-cards/venture/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 750;
        var trip = Math.min(tripCost, 6000) * 0.02;
        return Math.round(bonus + trip - 95);
      }
    },

    amexgold: {
      id: "amexgold",
      name: "American Express Gold",
      issuer: "American Express",
      annualFee: 325,
      bonus: {
        points: 100000,
        spend: 8000,
        months: 6,
        dollarValue: 2000, // TPG valuation; valueFn uses a 1¢ floor
        copy: "As high as 100,000 points after $8,000 in 6 mo (personalized — not everyone sees 100k)"
      },
      earn: "4x restaurants + groceries (US), 3x flights, 2x prepaid hotels via Amex Travel",
      pointValue: 2.0, // TPG valuation for MR
      networkPerks: "$120 dining credit, $120 Uber Cash, $84 Dunkin, $100 Resy",
      bestFor: "Families with high dining + grocery spend; max-value transferable points",
      url: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 1000; // 100k * 1¢ conservative
        var credits = 200;
        var trip = Math.min(tripCost, 6000) * 0.025;
        return Math.round(bonus + credits + trip - 325);
      }
    },

    bilt: {
      id: "bilt",
      name: "Bilt Blue (Bilt Card)",
      issuer: "Column N.A.",
      annualFee: 0,
      bonus: { points: 0, spend: 0, months: 0, dollarValue: 100 },
      earn: "1x rent (no fee), 3x dining, 2x travel, 1x else; 4% Bilt Cash on everyday spend option",
      pointValue: 1.5,
      networkPerks: "No annual fee, Rent Day 2x multiplier, transferable to airline/hotel partners. Wells Fargo Mastercard sunset Feb 7, 2026 — this is the Column N.A. Bilt Blue card.",
      bestFor: "Renters / homeowners earning points on housing payments + flexible travel transfers",
      url: "https://www.bilt.com/card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 100;
        var trip = Math.min(tripCost, 6000) * 0.02;
        return Math.round(bonus + trip);
      }
    },

    disneyInspire: {
      id: "disneyInspire",
      name: "Disney® Inspire Visa®",
      issuer: "Chase",
      annualFee: 149,
      bonus: { points: 0, spend: 1000, months: 3, dollarValue: 500 },
      earn: "5% Disney+/Hulu/ESPN+, 3% Disney US locations + gas, 2% groceries + restaurants",
      pointValue: 1.0,
      networkPerks: "200 Disney Rewards Dollars after $2k spend on Disney bookings, $100 ticket credit, $120/yr Disney+/Hulu/ESPN+ credit, character meet-and-greets, 10% off dining + merch",
      bestFor: "Annual Disney trip families who'd use the perks every year",
      url: "https://creditcards.chase.com/rewards-credit-cards/disney/inspire",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 500;
        var disneyEarn = Math.min(tripCost, 5000) * 0.03;
        var anniversary = 200 + 100 + 120;
        return Math.round(bonus + disneyEarn + anniversary - 149);
      }
    },

    disneyVisa: {
      id: "disneyVisa",
      name: "Disney® Visa® (no annual fee)",
      issuer: "Chase",
      annualFee: 0,
      bonus: { points: 0, spend: 500, months: 3, dollarValue: 150 },
      earn: "1% Disney Rewards Dollars on everything",
      pointValue: 1.0,
      networkPerks: "Character meet-and-greets, PhotoPass downloads, 10% off select dining + merch, 0% APR financing on Disney vacation packages",
      bestFor: "Disney-curious families who don't want an annual fee",
      url: "https://creditcards.chase.com/rewards-credit-cards/disney/rewards",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 150;
        var trip = Math.min(tripCost, 5000) * 0.01;
        return Math.round(bonus + trip);
      }
    },

    universalPlus: {
      id: "universalPlus",
      name: "Universal Rewards Plus Visa Signature",
      issuer: "FNBO",
      annualFee: 99,
      bonus: {
        points: 15000,
        spend: 500,
        months: 3,
        dollarValue: 100,
        copy: "15,000 points after $500 in 3 billing cycles + $100 gift cards or Express Passes on approval (offers vary — confirm on FNBO)"
      },
      earn: "Points redeemable for Universal experiences",
      pointValue: 1.0,
      networkPerks: "1 free single-day park ticket after $6,000 annual spend, Visa Lounge access at Universal parks, character meet perks",
      bestFor: "Annual Universal Orlando / Hollywood / Epic Universe visitors",
      url: "https://www.card.fnbo.com/landing/universal/orlando",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 100;
        var freeTicket = 130;
        return Math.round(bonus + freeTicket - 99);
      }
    },

    hyatt: {
      id: "hyatt",
      name: "World of Hyatt Credit Card",
      issuer: "Chase",
      annualFee: 95,
      bonus: {
        points: 60000,
        spend: 3000,
        months: 3,
        dollarValue: 900,
        copy: "Up to 60,000 points (~$900 at 1.5¢) — 30k after $3k/3 mo, plus up to 30k extra (2x on 1x spend, cap $15k). Full 60k is not guaranteed after $3k. 75k promo ended Aug 20, 2026."
      },
      earn: "Up to 9x at Hyatt, 2x dining/airlines/transit",
      pointValue: 1.5,
      networkPerks: "Free Cat 1-4 night annually (~$200+), Discoverist status, 5 qualifying nights toward elite",
      bestFor: "Ziva/Zilara all-inclusive bookings + boutique Hyatt redemptions worldwide",
      url: "https://creditcards.chase.com/travel-credit-cards/world-of-hyatt-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 900;
        var freeNight = 250;
        return Math.round(bonus + freeNight - 95);
      }
    },

    bonvoyBrilliant: {
      id: "bonvoyBrilliant",
      name: "Marriott Bonvoy Brilliant",
      issuer: "American Express",
      annualFee: 650,
      bonus: {
        points: 150000,
        spend: 6000,
        months: 6,
        dollarValue: 1200,
        copy: "150,000 Bonvoy points + $250 statement credit after $6,000 in 6 mo (offer ends Sep 30, 2026)"
      },
      earn: "6x Marriott, 3x dining + flights direct, 2x else",
      pointValue: 0.8,
      networkPerks: "Annual Free Night (up to 85k pts ~$680), $300 Marriott dining credit, $25/mo Marriott credit, Platinum Elite status. Current 150k + $250 offer ends Sep 30, 2026.",
      bestFor: "Frequent Marriott AI/resort stays (Mexico, Caribbean Bonvoy properties)",
      url: "https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 1200 + 250;
        var freeNight = 680;
        var diningCredit = 300;
        return Math.round(bonus + freeNight + diningCredit - 650);
      }
    },

    carnival: {
      id: "carnival",
      name: "Carnival World Mastercard",
      issuer: "Barclays",
      annualFee: 0,
      bonus: { points: 30000, spend: 1000, months: 3, dollarValue: 300 },
      earn: "2x on Carnival purchases, 1x else",
      pointValue: 1.0,
      networkPerks: "10% off Carnival shore excursions, 0% APR 6 mo on Carnival bookings",
      bestFor: "Carnival loyalists with at least one cruise booked",
      url: "https://www.carnival.com/carnival-mastercard",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 300;
        var trip = Math.min(tripCost, 4000) * 0.02;
        return Math.round(bonus + trip);
      }
    },

    royalCaribbeanCard: {
      id: "royalCaribbeanCard",
      name: "Royal ONE Visa Signature",
      issuer: "Bank of America",
      annualFee: 0,
      bonus: { points: 30000, spend: 1500, months: 3, dollarValue: 300 },
      earn: "Points on Royal Caribbean Group sailings",
      pointValue: 1.0,
      networkPerks: "Onboard credit and points toward Crown & Anchor status",
      bestFor: "Royal Caribbean / Celebrity loyalists",
      url: "https://www.royalcaribbean.com/royal-one-visa-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 300;
        var trip = Math.min(tripCost, 4000) * 0.01;
        return Math.round(bonus + trip);
      }
    },

    costcoCiti: {
      id: "costcoCiti",
      name: "Costco Anywhere Visa",
      issuer: "Citi",
      annualFee: 0,
      bonus: { points: 0, spend: 0, months: 0, dollarValue: 0 },
      earn: "5% Costco gas + 4% other gas/EV (combined $7k/yr cap, then 1%), 3% restaurants + travel, 2% Costco, 1% else",
      pointValue: 1.0,
      networkPerks: "Requires active Costco membership ($65/yr)",
      bestFor: "Roadtrippers who already shop Costco — best gas rebate without category caps",
      url: "https://www.citi.com/credit-cards/citi-costco-anywhere-visa-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost, opts) {
        var gas = (opts && opts.gasCost) ? opts.gasCost : tripCost * 0.35;
        var dining = (opts && opts.foodCost) ? opts.foodCost : tripCost * 0.20;
        return Math.round(gas * 0.04 + dining * 0.03);
      }
    },

    citiCustomCash: {
      id: "citiCustomCash",
      name: "Citi Custom Cash",
      issuer: "Citi",
      annualFee: 0,
      available: false,
      bonus: { points: 0, spend: 1500, months: 6, dollarValue: 200 },
      earn: "5% on top monthly category (capped at $500 spend = $25 max), 1% else",
      pointValue: 1.0,
      networkPerks: "Closed to new applicants as of May 28, 2026",
      bestFor: "Not available to new applicants",
      url: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        return 0;
      }
    },

    chaseFreedomUnlimited: {
      id: "chaseFreedomUnlimited",
      name: "Chase Freedom Unlimited",
      issuer: "Chase",
      annualFee: 0,
      bonus: { points: 0, spend: 500, months: 3, dollarValue: 200 },
      earn: "5% Chase Travel, 3% dining + drugstores, 1.5% else",
      pointValue: 1.0,
      networkPerks: "Pairs with CSP/CSR for transferable points conversion",
      bestFor: "Everyday spend booster — pair with a Sapphire to upgrade rewards",
      url: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 200;
        var trip = Math.min(tripCost, 4000) * 0.015;
        return Math.round(bonus + trip);
      }
    },

    discoverMiles: {
      id: "discoverMiles",
      name: "Discover it Miles",
      issuer: "Discover",
      annualFee: 0,
      bonus: {
        points: 0,
        spend: 0,
        months: 0,
        dollarValue: 0,
        copy: "Discover Match for new cardmembers: match all miles from approval through first 12 consecutive billing periods or 365 days, whichever is longer. No min spend, no match cap. First-year only — not a fixed signup-bonus dollar amount."
      },
      earn: "1.5 miles per $1 everywhere. Discover Match for new cardmembers doubles first-year miles. Miles = 1¢ cash. First-year effective earn ~3% (1.5% + match).",
      pointValue: 1.0,
      networkPerks: "No foreign transaction fees. Discover Match applies to all spend (no min, no cap) from approval through first 12 consecutive billing periods or 365 days, whichever is longer. Match is first-year only.",
      bestFor: "First-year ~3% everywhere via mile match — $0 AF, no FTF, no min spend",
      url: "https://www.discover.com/credit-cards/travel/it-miles.html",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        // Match is first-year only and applies to all spend. 1.5 miles + match ≈ 3%. Miles = 1¢. No fake bonus.
        return Math.round(Math.min(tripCost, 6000) * 0.03);
      }
    },

    wellsAutograph: {
      id: "wellsAutograph",
      name: "Wells Fargo Autograph",
      issuer: "Wells Fargo",
      annualFee: 0,
      bonus: { points: 20000, spend: 1000, months: 3, dollarValue: 200 },
      earn: "Unlimited 3x restaurants (incl takeout/delivery), travel (air, hotels, cars, cruises, agencies), gas+EV, transit (rideshare, parking, tolls, rail), popular streaming, phone plans; 1x else",
      pointValue: 1.0,
      networkPerks: "No foreign transaction fees. $0 annual fee. Points can transfer to some partners (not Chase-level). 20,000 points after $1,000 in 3 months ($200 cash at 1¢).",
      bestFor: "No-fee 3x travel/dining/gas with no FTF — better roadtrip gas than Freedom Unlimited",
      url: "https://creditcards.wellsfargo.com/autograph-visa-credit-card/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 200;
        var trip = Math.min(tripCost, 4000) * 0.03;
        return Math.round(bonus + trip);
      }
    },

    citiStrata: {
      id: "citiStrata",
      name: "Citi Strata Premier",
      issuer: "Citi",
      annualFee: 95,
      bonus: { points: 60000, spend: 4000, months: 3, dollarValue: 900 },
      earn: "10x hotels/cars/attractions on Citi Travel, 3x air + hotels, 3x restaurants, 3x supermarkets, 3x gas/EV, 1x else",
      pointValue: 1.5,
      networkPerks: "$100 annual hotel benefit via cititravel.com, transferable ThankYou Points, no FTF",
      bestFor: "The $95 transferable workhorse — 3x groceries, gas, and dining",
      url: "https://www.citi.com/credit-cards/citi-strata-premier-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 900;
        var hotel = 100;
        var trip = Math.min(tripCost, 6000) * 0.025;
        return Math.round(bonus + hotel + trip - 95);
      }
    }
  };

  var LINEUPS = {
    disney: ["disneyInspire", "csp", "venture"],
    cruise: ["csp", "amexgold", "royalCaribbeanCard"],
    allinclusive: ["hyatt", "bonvoyBrilliant", "csp"],
    themeparks: ["universalPlus", "csp", "disneyVisa"],
    roadtrip: ["costcoCiti", "wellsAutograph", "citiStrata"],
    points: ["csp", "amexgold", "csr"],
    whentobook: ["csp", "citiStrata", "bilt"],
    budget: ["csp", "citiStrata", "venture"],
    tripfinder: ["csp", "citiStrata", "venturex"],
    funding: ["csp", "chaseFreedomUnlimited", "citiStrata"]
  };

  var FRAMING = {
    disney: "These three cards do most of the heavy lifting on a Disney trip. The Inspire pays for itself if you go yearly; CSP gives flexibility; Venture is the simplest miles option.",
    cruise: "Cruise lines push their co-brand cards hard, but they\u2019re rarely the best math. CSP and Amex Gold both earn more on the dining + airfare around your sailing. Royal ONE is the live Royal Caribbean cobrand if you\u2019re loyal to that line.",
    allinclusive: "All-inclusive math rewards transferable points and brand-tied cards. Hyatt is dominant for Ziva/Zilara. Marriott Bonvoy covers Cancún and the Caribbean. CSP is the flexible fallback.",
    themeparks: "Universal has the strongest park-specific card; CSP wins for off-property hotels and flexibility; Disney Visa is here only if you'll mix in a Disney trip too.",
    roadtrip: "Gas is the largest variable cost on a roadtrip. Costco Anywhere still leads on gas if you have a membership. Autograph is 3x gas, travel, and dining with no annual fee and no foreign transaction fees. Strata Premier adds 3x gas plus transferable ThankYou points.",
    points: "These three cards form the points-collector starter pack. CSP is the $95 workhorse. Amex Gold is the dining/grocery engine (welcome bonus is personalized — as high as 100k). CSR is the premium only if you'll use the lounges and the $300 travel credit.",
    whentobook: "If you don't have a strategy yet, start here. CSP is the default workhorse. Citi Strata Premier is the $95 transferable + grocery/gas 3x workhorse. Bilt Blue is the no-annual-fee option that still earns transferable points.",
    budget: "You haven't committed to a trip type yet, so we're showing the flexible workhorse cards \u2014 the ones whose points transfer everywhere. CSP and Strata Premier are the $95 transferable options; Venture is the simpler miles card. The 'Best fit' badge updates based on your budget number.",
    tripfinder: "Since the trip type is still open, these are the transferable-points cards that flex across airlines, hotels, and all-inclusives. CSP and Strata Premier are the $95 workhorses; Venture X is the lounge card if you'll use the $300 credit.",
    funding: "While you save toward the trip, your normal spending should be working for you. CSP earns 3x on dining; Freedom Unlimited earns 1.5% on everything else; Strata Premier is 3x groceries, gas, and dining with transferable ThankYou points."
  };

  g.VM_CARDS = {
    CARDS: CARDS,
    LINEUPS: LINEUPS,
    FRAMING: FRAMING
  };
})(window);
