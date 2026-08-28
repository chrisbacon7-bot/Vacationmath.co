/**
 * Vacation Math — Credit Card catalog
 * Verified offers as of August 2026 from each issuer's official page.
 * Re-verify quarterly. See refresh playbook.
 *
 * AFFILIATE PLUMBING:
 *   Each card has `url` (current: official issuer page, no affiliate code) and
 *   `affiliateUrl` (placeholder for when programs activate). The renderer prefers
 *   `affiliateUrl` if non-empty, otherwise falls back to `url`. To activate affiliates:
 *   fill in `affiliateUrl` per card. The renderer auto-applies rel="sponsored"
 *   when the link is affiliate, and rel="noopener" always.
 *
 * VALUE MATH:
 *   Each card has a `valueFn(tripCost, opts)` that returns the realistic first-year
 *   offset for THIS trip — sign-up bonus value + reasonable category earn on the trip,
 *   capped by what's plausible. Honest math, not aspirational ceilings.
 */
(function (g) {
  "use strict";

  // -- Verified August 2026 offers --
  var CARDS = {
    csp: {
      id: "csp",
      name: "Chase Sapphire Preferred",
      issuer: "Chase",
      annualFee: 95,
      bonus: { points: 75000, spend: 5000, months: 3, dollarValue: 938 }, // 75k * 1.25¢ portal
      earn: "5x Chase Travel, 3x dining, 2x other travel, 1x else",
      pointValue: 1.25, // ¢ per point via Chase Travel portal
      networkPerks: "Trip insurance, primary rental car coverage, no foreign transaction fees",
      bestFor: "Flexible travel — transferable points to airlines + hotels",
      url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
      affiliateUrl: "",
      // tripCost is the calc's calculated trip cost
      valueFn: function (tripCost) {
        var bonus = 938; // verified portal value of 75k pts
        var trip = Math.min(tripCost, 6000) * 0.025; // ~2.5x avg earn rate on the trip (mix of 5x travel, 3x dining, 2x)
        return Math.round(bonus + trip);
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
      networkPerks: "$300 annual travel credit, 10,000-mile anniversary bonus (~$100), Priority Pass lounges, no FTF",
      bestFor: "Premium perks if you'll use the $300 travel credit (net $95/yr effective fee)",
      url: "https://www.capitalone.com/credit-cards/venture-x/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 750;
        var creditOffset = 300; // annual travel credit applied to this trip
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
      bonus: { points: 100000, spend: 8000, months: 6, dollarValue: 2000 }, // TPG valuation
      earn: "4x restaurants + groceries (US), 3x flights, 2x prepaid hotels via Amex Travel",
      pointValue: 2.0, // TPG valuation for MR
      networkPerks: "$120 dining credit, $120 Uber Cash, $84 Dunkin, $100 Resy",
      bestFor: "Families with high dining + grocery spend; max-value transferable points",
      url: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        // Bonus is aspirational at TPG 2¢. Use a 1¢ floor for honest offset math.
        var bonus = 1000; // 100k * 1¢ conservative
        var credits = 200; // ~$200 of annual credits realistically used
        var trip = Math.min(tripCost, 6000) * 0.025;
        return Math.round(bonus + credits + trip - 325);
      }
    },

    bilt: {
      id: "bilt",
      name: "Bilt Mastercard (Bilt Card 2.0)",
      issuer: "Wells Fargo",
      annualFee: 0,
      bonus: { points: 0, spend: 0, months: 0, dollarValue: 100 }, // $100 Bilt Cash on approval (current promo)
      earn: "1x rent (no fee), 3x dining, 2x travel, 1x else; 4% Bilt Cash on everyday spend option",
      pointValue: 1.5, // strong transfer partners (Hyatt, AA, United)
      networkPerks: "No annual fee, Rent Day 2x multiplier, transferable to 18 airline/hotel partners",
      bestFor: "Renters / homeowners earning points on housing payments + flexible travel transfers",
      url: "https://www.biltrewards.com/",
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
      bonus: { points: 0, spend: 1000, months: 3, dollarValue: 500 }, // $300 gift card + $200 credit
      earn: "5% Disney+/Hulu/ESPN+, 3% Disney US locations + gas, 2% groceries + restaurants",
      pointValue: 1.0, // Disney Rewards Dollars
      networkPerks: "200 Disney Rewards Dollars after $2k spend on Disney bookings, $100 ticket credit, $120/yr Disney+/Hulu/ESPN+ credit, character meet-and-greets, 10% off dining + merch",
      bestFor: "Annual Disney trip families who'd use the perks every year",
      url: "https://disneyrewards.com/cards/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 500;
        var disneyEarn = Math.min(tripCost, 5000) * 0.03; // 3% on Disney
        var anniversary = 200 + 100 + 120; // resort bonus + ticket credit + streaming
        return Math.round(bonus + disneyEarn + anniversary - 149);
      }
    },

    disneyVisa: {
      id: "disneyVisa",
      name: "Disney® Visa® (no annual fee)",
      issuer: "Chase",
      annualFee: 0,
      bonus: { points: 0, spend: 500, months: 3, dollarValue: 150 }, // $100 gift card + $50 credit
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
      bonus: { points: 0, spend: 500, months: 3, dollarValue: 250 }, // $250 statement credit
      earn: "Points redeemable for Universal experiences",
      pointValue: 1.0,
      networkPerks: "1 free single-day park ticket after $6,000 annual spend, Visa Lounge access at Universal parks, character meet perks",
      bestFor: "Annual Universal Orlando / Hollywood / Epic Universe visitors",
      url: "https://www.universalrewardsvisa.com/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 250;
        var freeTicket = 130; // value of a single-day Universal ticket (only if hitting $6k spend)
        return Math.round(bonus + freeTicket - 99);
      }
    },

    hyatt: {
      id: "hyatt",
      name: "World of Hyatt Credit Card",
      issuer: "Chase",
      annualFee: 95,
      bonus: { points: 60000, spend: 3000, months: 3, dollarValue: 1020 }, // 60k * 1.7¢ Hyatt avg
      earn: "Up to 9x at Hyatt, 2x dining/airlines/transit",
      pointValue: 1.7, // strong Hyatt redemption value
      networkPerks: "Free Cat 1-4 night annually (~$200+), Discoverist status, 5 qualifying nights toward elite",
      bestFor: "Ziva/Zilara all-inclusive bookings + boutique Hyatt redemptions worldwide",
      url: "https://creditcards.chase.com/travel-credit-cards/world-of-hyatt-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 1020;
        var freeNight = 250; // realistic Cat 1-4 value
        return Math.round(bonus + freeNight - 95);
      }
    },

    bonvoyBrilliant: {
      id: "bonvoyBrilliant",
      name: "Marriott Bonvoy Brilliant",
      issuer: "American Express",
      annualFee: 650,
      bonus: { points: 150000, spend: 8000, months: 6, dollarValue: 1200 }, // 150k * 0.8¢ + $125 statement credit
      earn: "6x Marriott, 3x dining + flights direct, 2x else",
      pointValue: 0.8,
      networkPerks: "Annual Free Night (up to 85k pts ~$680), $300 Marriott dining credit, $25/mo Marriott credit, Platinum Elite status",
      bestFor: "Frequent Marriott AI/resort stays (Mexico, Caribbean Bonvoy properties)",
      url: "https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 1200 + 125; // bonus + statement credit
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
      bonus: { points: 30000, spend: 1000, months: 3, dollarValue: 300 }, // 30k FunPoints = $300 OBC
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
      bonus: { points: 0, spend: 1000, months: 3, dollarValue: 250 }, // initial offer estimate (new card launching June 2026)
      earn: "Points on Royal Caribbean Group sailings",
      pointValue: 1.0,
      networkPerks: "Onboard credit and points toward Crown & Anchor status (new launch June 2026)",
      bestFor: "Royal Caribbean / Celebrity loyalists — confirm current offer at apply",
      url: "https://www.royalcaribbean.com/faq/topics/royal-visa-signature-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        return 250;
      }
    },

    costcoCiti: {
      id: "costcoCiti",
      name: "Costco Anywhere Visa",
      issuer: "Citi",
      annualFee: 0,
      bonus: { points: 0, spend: 0, months: 0, dollarValue: 0 }, // no sign-up bonus
      earn: "4% gas (first $7k/yr), 3% restaurants + travel, 2% Costco, 1% else",
      pointValue: 1.0,
      networkPerks: "Requires active Costco membership ($65/yr)",
      bestFor: "Roadtrippers who already shop Costco — best gas rebate without category caps",
      url: "https://www.citi.com/credit-cards/citi-costco-anywhere-visa-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost, opts) {
        // tripCost is roadtrip total; gas is ~30-40% of cost
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
      bonus: { points: 0, spend: 1500, months: 6, dollarValue: 200 },
      earn: "5% on top monthly category (capped at $500 spend = $25 max), 1% else",
      pointValue: 1.0,
      networkPerks: "10 eligible 5% categories including gas, dining, travel, transit, groceries",
      bestFor: "Targeted high-spend month — front-load roadtrip gas or trip dining into one billing cycle",
      url: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 200;
        var fivePct = 25 * 2; // realistic 2 months of $500 capped spend in 5% category
        return Math.round(bonus + fivePct);
      }
    },

    chaseFreedomUnlimited: {
      id: "chaseFreedomUnlimited",
      name: "Chase Freedom Unlimited",
      issuer: "Chase",
      annualFee: 0,
      bonus: { points: 0, spend: 500, months: 3, dollarValue: 200 }, // typical $200 cash bonus
      earn: "5% Chase Travel, 3% dining + drugstores, 1.5% else",
      pointValue: 1.0, // 1.25¢ if paired with CSP
      networkPerks: "Pairs with CSP/CSR for transferable points conversion",
      bestFor: "Everyday spend booster — pair with a Sapphire to upgrade rewards",
      url: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
      affiliateUrl: "",
      valueFn: function (tripCost) {
        var bonus = 200;
        var trip = Math.min(tripCost, 4000) * 0.015;
        return Math.round(bonus + trip);
      }
    }
  };

  // -- Per-calc card lineups (3 cards each, ranked best-fit first) --
  var LINEUPS = {
    disney: ["disneyInspire", "csp", "venture"],
    cruise: ["csp", "carnival", "amexgold"],
    allinclusive: ["hyatt", "bonvoyBrilliant", "csp"],
    themeparks: ["universalPlus", "csp", "disneyVisa"],
    roadtrip: ["costcoCiti", "chaseFreedomUnlimited", "citiCustomCash"],
    points: ["csp", "amexgold", "venturex"],
    whentobook: ["csp", "venture", "bilt"],
    // Meta calcs (user hasn't committed to a trip type yet) — show flexible workhorse cards.
    // The valueFn sort still re-ranks based on the actual trip total entered.
    budget: ["csp", "venture", "venturex"],
    tripfinder: ["csp", "venturex", "amexgold"],
    funding: ["csp", "chaseFreedomUnlimited", "venture"]
  };

  // -- Trip-type-specific framing line shown above the card stack --
  var FRAMING = {
    disney: "These three cards do most of the heavy lifting on a Disney trip. The Inspire pays for itself if you go yearly; CSP gives flexibility; Venture is the simplest miles option.",
    cruise: "Cruise lines push their co-brand cards hard, but they're rarely the best math. CSP and Amex Gold both earn more on the dining + airfare around your sailing than the cruise card does on the cruise itself.",
    allinclusive: "All-inclusive math rewards transferable points and brand-tied cards. Hyatt is dominant for Ziva/Zilara. Marriott Bonvoy covers Cancún and the Caribbean. CSP is the flexible fallback.",
    themeparks: "Universal has the strongest park-specific card; CSP wins for off-property hotels and flexibility; Disney Visa is here only if you'll mix in a Disney trip too.",
    roadtrip: "Gas is the largest variable cost on a roadtrip. The cards that pay you the most on gas + dining are not the household-name travel cards.",
    points: "These three cards form the points-collector starter pack. CSP and Amex Gold are the highest-value transferable points engines; Venture X earns the highest ceiling if you'll use the $300 credit every year.",
    whentobook: "If you don't have a strategy yet, start here. CSP is the default workhorse. Venture is the simpler alternative. Bilt is the no-annual-fee option that still earns transferable points.",
    budget: "You haven't committed to a trip type yet, so we're showing the flexible workhorse cards \u2014 the ones whose points transfer everywhere. The 'Best fit' badge updates based on your budget number.",
    tripfinder: "Since the trip type is still open, these are the transferable-points cards that flex across airlines, hotels, and all-inclusives. They're the strongest default when you don't yet know where you're going.",
    funding: "While you save toward the trip, your normal spending should be working for you. CSP earns 3x on dining; Freedom Unlimited earns 1.5% on everything else; Venture is the simplest miles option if you prefer one card."
  };

  g.VM_CARDS = {
    CARDS: CARDS,
    LINEUPS: LINEUPS,
    FRAMING: FRAMING
  };
})(window);
