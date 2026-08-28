/* =====================================================================
   Vacation Math — Shared calculator data
   All numbers updated August 28, 2026 (Q4/September refresh). Estimates built from published pricing, not live quotes. Sources cited at /sources.html
   Next scheduled refresh: October 2026.
   ===================================================================== */
(function (global) {
  "use strict";

  // ----------------------------------------------------------------
  // DISNEY WORLD DATA (2026)
  // Sources: Disney official ticket page (Aug 17, 2026), Disney Tourist Blog Apr 2026
  //          ticket-increase coverage, Touring Plans 2026 ticket table, Disney Food Blog
  //          Aug 2026 Lightning Lane price confirmations, Theme Parks Guide Jun 2026 resort rates
  // ----------------------------------------------------------------
  var DISNEY = {
    resorts: {
      // Per night, party of 4. low = off-season starting; avg = NerdWallet mid;
      // high = peak holiday/spring break
      value:    { label: "Value (All-Star, Pop Century, Art of Animation)", low: 150, avg: 215, high: 307 },
      moderate: { label: "Moderate (Caribbean Beach, Coronado, Port Orleans)", low: 280, avg: 350, high: 550 },
      deluxe:   { label: "Deluxe (Grand Floridian, Contemporary, Polynesian)", low: 500, avg: 750, high: 1300 },
      offsite:  { label: "Off-property (Disney Springs / nearby)", low: 142, avg: 185, high: 280 }
    },
    // Per person per day, base ticket (1-park). Avg = NerdWallet ~$160 mid-season.
    tickets: {
      low: 119,  // Disney's advertised "from" price (Animal Kingdom, off-peak) - official ticket page Aug 2026
      avg: 160,  // mid-season blended average across four parks
      high: 209  // Nov-Dec 2026 peak, Magic Kingdom (2027 dates now top out at $219)
    },
    parkHopperPerTicket: 89,     // Per-ticket add-on. Published 2026 range $65-$105; $89 is the 2027 mid example. Prior $198 double-counted.
    lightningLanePerDay: 27,     // Lightning Lane Multi Pass per person per day. Confirmed Aug 2026 actuals $16-$32 (MK $23-32, EPCOT $18-24, DHS $22-27, AK $16-17); $27 is the high end of the blended average.
    childTicketDiscount: 5,      // ~$5 off adult price for kids 3-9
    // Dining per party of 4 per day, by style
    dining: {
      light:    { label: "Light (1 QS, 1 TS) - groceries supplemented", perDay: 130 },
      typical:  { label: "Typical (2 QS + 1 TS dinner)", perDay: 215 },
      heavy:    { label: "Heavy (2 TS + signature)", perDay: 320 }
    },
    snacksPerPersonPerDay: 25,   // Realistic in-park snacks/drinks
    parkingPerDay: 35,           // Off-property guests only; free for Disney resort
    memoryMaker: 185,            // Advance purchase price
    airportRoundTripFamily: 130, // Mears Connect party of 4, or 2 Ubers
    strollerPerDay: 15,
    tipsTotal: 150,              // Housekeeping + dining tips for ~5-night trip
    souvenirsBudget: 200         // Conservative; can easily be 2-3x
  };

  // ----------------------------------------------------------------
  // CRUISE DATA (2026)
  // Sources: CruiseCritic, NerdWallet, Royal Caribbean Blog,
  //          Cruise.blog, Endless Travel Plans, Get Away Today
  // ----------------------------------------------------------------
  // Per-person totals for 7-night Caribbean, interior cabin (the standard)
  var CRUISE = {
    // NOTE: the former `lines` object was removed on 2026-08-28. It duplicated
    // CRUISE_LINES_EXPANDED with different fares, and /budget read it while
    // /cruise read the expanded catalog — so the two calculators disagreed by
    // up to 55% on the same cruise line. CRUISE_LINES_EXPANDED is now the
    // single source of truth for per-line fares and gratuities.
    // Cabin upgrade per person on top of interior
    cabinUpgrade: {
      interior: 0,
      oceanview: 200,
      balcony: 500,
      suite: 1500
    },
    // Per person per day
    drinkPackages: {
      none: { label: "Pay as you go", perDay: 25 },     // ~3 drinks/day
      soda: { label: "Soda / non-alcoholic", perDay: 12 },
      unlimited: { label: "Unlimited alcohol", perDay: 85 } // ~$65-$120 line variance
    },
    // Per-line unlimited drink package pricing (per person per day, gratuity included)
    // Sources: Carnival.com CHEERS page, Royal Caribbean Blog, NCL.com Free at Sea,
    //          Princess official Plus/Premier terms, MSC package pricing - all verified Aug 2026
    drinkPackagePerLine: {
      msc:      { unlimited: 86,  soda: 13 },  // Premium Extra, pre-cruise ($85-88 range)
      carnival: { unlimited: 84,  soda: 11 },  // CHEERS $69.95 pre-cruise + 20% = ~$83.94
      royal:    { unlimited: 105, soda: 12 },  // Deluxe Beverage, typical all-in ($63-120 + 18%)
      ncl:      { unlimited: 54,  soda: 14 },  // Unlimited Open Bar $45 + 20%. Free at Sea service charge is $28.50 separately.
      princess: { unlimited: 65,  soda: 13 },  // Princess Plus ($70 Sphere class)
      disney:   { unlimited: 0,   soda: 0 }    // Disney doesn't sell packages
    },
    // Per-drink menu prices at sea (typical 2026 ranges, before 18-20% auto-grat)
    drinkMenu: {
      cocktail:    { label: "Cocktail / mixed drink", price: 13 },
      beer:        { label: "Domestic / craft beer",  price: 8 },
      wineGlass:   { label: "Glass of wine",           price: 11 },
      soda:        { label: "Soda / juice",            price: 4 },
      coffeeSpec:  { label: "Specialty coffee",        price: 6 },
      bottledH2O:  { label: "Bottled water",           price: 3 }
    },
    drinkGratuityPct: 0.18, // 18% auto-added to every drink
    wifiPerDay: 25,              // Ship Wi-Fi per device per day, Aug 2026 median $24.99 (range $15.99 MSC - $30 Disney)
    specialtyDiningPerMeal: 45,  // Per person per night, typical
    excursionPerPersonPerPort: 80, // Cruise-line excursion median
    photoPackage: 250,           // Typical printed/digital package
    portFeesPerPerson: 200,      // Caribbean 7-night taxes/fees
    preCruiseHotel: 200,         // 1 night near port
    parkingAtPort: 20            // Per day
  };

  // ----------------------------------------------------------------
  // CARD DATA (verified August 2026)
  // Sources: issuer official pages, The Points Guy current-offer pages Aug 2026,
  //          NerdWallet, Doctor of Credit
  // 2026 product changes reflected: Chase Sapphire Preferred refresh (Jun 15, 2026),
  //          Amex Gold refresh (Apr 2026, $8k/6mo spend), Venture X lounge-guest cut
  //          (Feb 1, 2026), Citi Strata bonus cut to 60k, Bilt Card 2.0 (Feb 7, 2026).
  // ----------------------------------------------------------------
  var CARDS = [
    {
      id: "csp", name: "Chase Sapphire Preferred",
      annualFee: 95,
      bonusPoints: 75000,
      minSpend: 5000, spendWindowMonths: 3,
      currency: "Chase UR",
      cppCash: 0.01, cppPortal: 0.01, cppTransfer: 0.015,
      mults: { dining: 3, groceries: 1, gas: 1, travel: 2, other: 1 },
      perks: "Primary rental CDW, $50 hotel credit. Conservative transfer floor (FM RRV).",
      bestFor: "Family that travels 1-2x/year"
    },
    {
      id: "amex_gold", name: "Amex Gold",
      annualFee: 325,
      bonusPoints: 100000,
      minSpend: 8000, spendWindowMonths: 6,
      currency: "Amex MR",
      cppCash: 0.006, cppPortal: 0.01, cppTransfer: 0.015,
      mults: { dining: 4, groceries: 4, gas: 1, travel: 3, other: 1 },
      perks: "$120 dining, $120 Uber credits (require enrollment)",
      bestFor: "Family that eats out + buys groceries on card"
    },
    {
      id: "venture", name: "Capital One Venture",
      annualFee: 95,
      bonusPoints: 75000,
      minSpend: 4000, spendWindowMonths: 3,
      currency: "Cap One Miles",
      cppCash: 0.01, cppPortal: 0.01, cppTransfer: 0.0145,
      mults: { dining: 2, groceries: 2, gas: 2, travel: 2, other: 2 },
      perks: "Simple flat-rate, no category to track",
      bestFor: "Set-and-forget single card"
    },
    {
      id: "venture_x", name: "Capital One Venture X",
      annualFee: 395,
      bonusPoints: 75000,
      minSpend: 4000, spendWindowMonths: 3,
      currency: "Cap One Miles",
      cppCash: 0.01, cppPortal: 0.01, cppTransfer: 0.0145,
      mults: { dining: 2, groceries: 2, gas: 2, travel: 2, other: 2 },
      perks: "$300 travel credit, 10k anniversary miles, Priority Pass",
      bestFor: "Travelers who use lounges + annual credit"
    },
    {
      id: "wf_auto", name: "Wells Fargo Autograph",
      annualFee: 0,
      bonusPoints: 20000,
      minSpend: 1000, spendWindowMonths: 3,
      currency: "WF Rewards",
      cppCash: 0.01, cppPortal: 0.01, cppTransfer: 0.0175,
      mults: { dining: 3, groceries: 1, gas: 3, travel: 3, other: 1 },
      perks: "$0 annual fee. Beginner-friendly.",
      bestFor: "First-card family wanting no fee"
    },
    {
      id: "bilt", name: "Bilt Mastercard (Bilt Card 2.0 - Blue)",
      annualFee: 0,
      bonusPoints: 0,
      minSpend: 0, spendWindowMonths: 0,
      currency: "Bilt Rewards",
      cppCash: 0.0055, cppPortal: 0.0125, cppTransfer: 0.0155,
      mults: { dining: 3, groceries: 2, gas: 2, travel: 2, rent: 1, other: 1 },
      perks: "Earn points on rent (no transaction fee). 2x on Rent Day. Transfers to 18 partners. Bilt Card 2.0 launched Feb 2026 - Blue $0, Obsidian $95, Palladium $495.",
      bestFor: "Renters who want to earn on their housing payment"
    },
    {
      id: "citi_strata", name: "Citi Strata Premier",
      annualFee: 95,
      bonusPoints: 60000,
      minSpend: 4000, spendWindowMonths: 3,
      currency: "Citi ThankYou",
      cppCash: 0.005, cppPortal: 0.01, cppTransfer: 0.016,
      mults: { dining: 3, groceries: 3, gas: 3, travel: 3, hotels: 10, other: 1 },
      perks: "$100 annual hotel credit, 10x on Citi hotel portal, transfers to 15+ partners.",
      bestFor: "Family that spends across dining, groceries, gas, and travel"
    }
  ];

  // ----------------------------------------------------------------
  // POINTS VALUATIONS (August 2026)
  // Sources: Frequent Miler Reasonable Redemption Values (page dated Jul 23, 2026),
  //          The Points Guy 2026, NerdWallet 2026
  // Cents per point at the redemption type indicated
  // ----------------------------------------------------------------
  var POINTS = {
    programs: {
      chase_ur:    { label: "Chase Ultimate Rewards",    cash: 1.00, portal: 1.00, transfer: 1.50, tpg: 2.05, source: "FM RRV Aug 2026 (transfer); NerdWallet (portal floor 1¢)" },
      amex_mr:     { label: "Amex Membership Rewards",   cash: 0.60, portal: 1.00, transfer: 1.50, tpg: 2.00, source: "FM RRV Aug 2026" },
      capone:      { label: "Capital One Miles",          cash: 1.00, portal: 1.00, transfer: 1.45, tpg: 1.85, source: "FM RRV Aug 2026" },
      citi_tyc:    { label: "Citi ThankYou",              cash: 0.50, portal: 1.00, transfer: 1.50, tpg: 1.80, source: "FM RRV Aug 2026" },
      bilt:        { label: "Bilt Rewards",                cash: 0.55, portal: 1.25, transfer: 1.55, tpg: 2.05, source: "FM RRV Aug 2026" },
      delta:       { label: "Delta SkyMiles",              cash: 1.20, portal: 1.20, transfer: 1.10, tpg: 1.20, source: "FM RRV Aug 2026" },
      united:      { label: "United MileagePlus",          cash: 1.30, portal: 1.30, transfer: 1.30, tpg: 1.30, source: "FM RRV Aug 2026" },
      aa:          { label: "American AAdvantage",         cash: 1.40, portal: 1.40, transfer: 1.40, tpg: 1.40, source: "FM RRV Aug 2026" },
      southwest:   { label: "Southwest Rapid Rewards",     cash: 1.30, portal: 1.30, transfer: 1.30, tpg: 1.30, source: "FrequentMiler 2026" },
      alaska:      { label: "Atmos (Alaska/Hawaiian)",     cash: 1.50, portal: 1.50, transfer: 1.50, tpg: 1.50, source: "FrequentMiler 2026" },
      jetblue:     { label: "JetBlue TrueBlue",            cash: 1.30, portal: 1.30, transfer: 1.30, tpg: 1.30, source: "NerdWallet 2026" },
      marriott:    { label: "Marriott Bonvoy",             cash: 0.73, portal: 0.73, transfer: 0.73, tpg: 0.80, source: "FM RRV Aug 2026 (0.73 RRV)" },
      hilton:      { label: "Hilton Honors",               cash: 0.35, portal: 0.35, transfer: 0.35, tpg: 0.50, source: "FM RRV Aug 2026" },
      hyatt:       { label: "World of Hyatt",              cash: 1.50, portal: 1.50, transfer: 1.50, tpg: 1.70, source: "FM RRV Aug 2026 (best hotel program)" },
      ihg:         { label: "IHG One Rewards",             cash: 0.59, portal: 0.59, transfer: 0.59, tpg: 0.59, source: "FM RRV Aug 2026" }
    },
    // Thresholds for verdict against cash price
    verdict: {
      excellent: 1.15, // 15%+ above benchmark
      good:      1.00, // at benchmark
      fair:      0.85, // within 15% below
      poor:      0.00  // below 85% of benchmark
    }
  };

  // ----------------------------------------------------------------
  // ALL-INCLUSIVE VS A-LA-CARTE (Caribbean / Mexico 2026)
  // Sources: Expedia, TripAdvisor, TPG, r/AllInclusiveResorts reports,
  //          Trip.com Mexico 2026 cost guide
  // ----------------------------------------------------------------
  var ALLINC = {
    // All-inclusive nightly rate per adult (kids often discounted)
    aiTiers: {
      budget:   { label: "Budget (Riu, Barceló, Sunscape)",       perAdult: 195, kidsDiscount: 0.50 },
      midrange: { label: "Mid-range (Hyatt Ziva, Moon Palace, Dreams)", perAdult: 310, kidsDiscount: 0.45 },
      luxury:   { label: "Luxury (Hyatt Zilara, Excellence, Secrets)", perAdult: 475, kidsDiscount: 0.50 },
      ultra:    { label: "Ultra (Le Blanc, Hotel Xcaret, Grand Velas)", perAdult: 720, kidsDiscount: 0.40 }
    },
    // À-la-carte equivalents — Cancún / Riviera Maya / Punta Cana baseline
    alc: {
      // Hotel only (no food/drink), per night for room (2 adults + 2 kids)
      hotelByTier: {
        budget:   140,
        midrange: 240,
        luxury:   400,
        ultra:    650
      },
      // Per person per day, à-la-carte spending
      breakfastPerPerson:  18,
      lunchPerPerson:      25,
      dinnerPerPerson:     45,    // Mid-range restaurant
      drinksPerAdultDay:   42,    // ~3 cocktails + bottled water
      drinksPerKidDay:     12,    // Sodas, juice
      snacksPerPersonDay:  10,
      tipsPerPersonDay:    15,    // Restaurant + bar + housekeeping
      // Activities — most travelers do 2-3 over a 5-night trip
      excursionPerPerson:  85,    // Median Cancun snorkel/Tulum/Xcaret
      excursionsPerTrip:   2,
      taxiPerDay:          25,    // Daily transport in/around resort area
      groceriesIncidental: 40     // Snacks from OXXO, bottled water stock
    },
    // The hidden additions almost no one budgets but everyone pays
    aiHiddenAdditions: {
      excursionPerPerson:  85,    // AI doesn't cover off-property excursions
      excursionsPerTrip:   2,
      premiumDining:       35,    // Specialty / off-resort dinner ~1-2x trip
      premiumDiningNights: 1,
      spaPerTrip:          150,
      tipsExtra:           50     // AI tips are "optional" but customary
    }
  };

  // ----------------------------------------------------------------
  // TIMESHARE MATH (2026)
  // Sources: ARDA 2025 State of the Industry ($23,160 avg), Ernst & Young 2025 study
  //          ($1,480 avg annual maintenance), AmeriSave 2026 analysis, RedWeek 2026
  // ----------------------------------------------------------------
  var TIMESHARE = {
    avgPurchase: 23160,            // ARDA 2025
    avgMaintenanceYear1: 1480,     // E&Y 2025
    maintenanceEscalation: 0.05,   // ~5% annual creep
    avgLoanRate: 0.17,             // ARDA: "average buyer financed at 17%"
    avgLoanYears: 10,
    specialAssessmentPerDecade: 1500, // One-time roof / hurricane / refurb assessment
    // Realistic resale recovery (most timeshares sell on RedWeek for pennies)
    resaleRecoveryPct: 0.10,       // Recover ~10% of purchase price after fees
    // Opportunity cost — what $23k in an index fund would do
    investmentRate: 0.07,          // S&P 500 long-term average
    // Comparable rental from RedWeek / VRBO — same week, same resort
    rentalEquivalents: {
      studio:    1400,   // 7 nights
      oneBR:     2100,
      twoBR:     2800,
      threeBR:   3800
    }
  };

  // ----------------------------------------------------------------
  // ROAD TRIP VS FLY (August 2026)
  // Sources: AAA Your Driving Costs 2025 edition (13.00¢/mi fuel + 11.04¢/mi maintenance,
  //          77¢/mi all-in at 15k mi/yr; 2026 edition not yet published),
  //          IRS mileage rate 76¢/mi for Jul 1-Dec 31, 2026, AAA national average
  //          gas $4.09/gal on Aug 28, 2026 (gasprices.aaa.com)
  // ----------------------------------------------------------------
  var ROADTRIP = {
    avgGasPrice: 4.09,               // AAA national average Aug 28, 2026 (gasprices.aaa.com). Up ~4.9% since the June reading. FL $3.95, CA $5.65.
    mpgByVehicle: {
      compact: 32, sedan: 28, suv: 22, minivan: 24, truck: 18, ev: 105 // EV MPGe
    },
    // Wear & tear per mile (AAA 2025: ~$0.45/mi non-fuel for ownership)
    wearPerMile: 0.10,               // Conservative — strips out fixed costs that exist anyway
    irsBusinessRate: 0.76,           // IRS rate for Jul 1-Dec 31, 2026 (was 72.5¢ Jan-Jun) — used as "upper-bound real cost" comparison
    // Hotel mid-trip stops on the road
    midwayHotelAvg: 152,             // Highway/interstate mid-tier. US average daily rate was $171.74 in Jul 2026 (CoStar/STR, +5.7% YoY).
    // Flight cost defaults (will be user-input)
    avgBagFeePerWay: 35,
    rentalCarPerDay: 83,             // US airport average $82.90/day incl. taxes, summer 2026 (+13% YoY)
    parkingPerDayAtAirport: 18,
    rideshareAirportEach: 45,
    // Road meals are cheaper because of grocery stops + fast food
    roadMealsPerPersonPerDay: 28,
    flightMealsPerPersonPerDay: 45   // More restaurant-dependent at destination
  };

  // ----------------------------------------------------------------
  // THEME PARK COMPARISON (2026)
  // Sources: Disney 2026 4-Park Magic Ticket ($109/day), Universal Orlando Resort 2026
  //          multi-day press release Oct 2025, SeaWorld/Busch Gardens published 2026 pricing
  // ----------------------------------------------------------------
  var THEMEPARKS = {
    disney: {
      label: "Walt Disney World",
      hotelOnPropAvg: 350,           // Mirrors DISNEY.resorts.moderate.avg
      ticketAdultPerDay: 160,        // Mid-season avg (also 4-day promo: $109)
      ticketChildPerDay: 155,
      mealPerPersonPerDay: 110,      // QS+TS combo, ~Disney inflated pricing
      llPerPersonPerDay: 27,         // Lightning Lane Multi Pass — matches DISNEY.lightningLanePerDay (Aug 2026 actuals $16-$32)
      parkingPerDay: 0,              // Free for resort guests (day guests pay $35/day as of May 2026)
      transferRoundTrip: 130,        // Mears Connect party of 4
      souvenirBudget: 200,
      memoryMaker: 185
    },
    universal: {
      label: "Universal Orlando (incl. Epic Universe)",
      hotelOnPropAvg: 280,           // Cabana Bay/Endless Summer avg
      ticketAdultPerDay: 130,        // 3-park multi-day avg ~$127-130/day per Magic Guides 2026
      ticketChildPerDay: 125,
      mealPerPersonPerDay: 95,
      llPerPersonPerDay: 60,         // Express Pass tier 1 — more variable
      parkingPerDay: 30,             // Universal day guests pay; resort guests free
      transferRoundTrip: 120,
      souvenirBudget: 180,
      memoryMaker: 99                // Universal Photo Connect
    },
    seaworld: {
      label: "SeaWorld Orlando",
      hotelOnPropAvg: 0,             // No on-property hotels — uses offsite avg
      offsiteHotelAvg: 180,
      ticketAdultPerDay: 78,         // Memorial Day single-day pricing $60-$98 avg ≈ $78
      ticketChildPerDay: 78,
      mealPerPersonPerDay: 60,
      llPerPersonPerDay: 0,          // Optional Quick Queue; not built in
      parkingPerDay: 30,
      transferRoundTrip: 110,
      souvenirBudget: 100,
      memoryMaker: 50
    },
    busch: {
      label: "Busch Gardens Tampa",
      hotelOnPropAvg: 0,
      offsiteHotelAvg: 165,
      ticketAdultPerDay: 95,         // Any-Day online ticket $94.99 published 2026
      ticketChildPerDay: 95,
      mealPerPersonPerDay: 55,
      llPerPersonPerDay: 0,
      parkingPerDay: 35,
      transferRoundTrip: 120,
      souvenirBudget: 100,
      memoryMaker: 50
    }
  };

  // ----------------------------------------------------------------
  // WHEN TO BOOK (2026 — Expedia Hacks for 6, Google Flights, Going.com)
  // ----------------------------------------------------------------
  var WHENTOBOOK = {
    // Sweet spot in days before departure (lowest fare on average)
    bestWindowDays: {
      domestic:        { min: 15, mid: 23, max: 30, source: "Expedia 2026 Air Hacks (15-30 day window)" },
      international:   { min: 31, mid: 45, max: 80, source: "Expedia 2026 Air Hacks (conservative 31-45 day window)" },
      caribbean:       { min: 30, mid: 45, max: 90, source: "Expedia 2026 (Mexico/Caribbean)" },
      asia_pacific:    { min: 90, mid: 140, max: 210, source: "Going.com 2026" }
    },
    // Holiday-specific windows
    holidays: {
      thanksgiving:    { min: 21, mid: 45, max: 60, source: "Expedia 2026" },
      christmas:       { min: 36, mid: 58, max: 72, source: "Expedia 2026" },
      spring_break:    { min: 30, mid: 44, max: 60, source: "Going 2026" },
      summer:          { min: 13, mid: 21, max: 43, source: "Going 2026" }
    },
    // Cheapest day-of-week to book and to fly
    cheapestBookDay:  "Friday",     // Expedia 2026 (Sunday in older data)
    priciestBookDay:  "Sunday",
    cheapestFlyDay:   "Tuesday",    // and Wednesday
    priciestFlyDay:   "Sunday",
    cheapestMonth:    "August",     // For domestic
    priciestMonth:    "December",
    // Penalty for booking outside window — rough average from same data
    earlyPenalty:     0.10,         // 10% premium if too far out (180+ days)
    latePenalty:      0.35,         // 35% premium if last-minute (0-7 days)
    inWindowSavings:  0.13          // 13% under average if you nail the window
  };


  // ====================================================================
  // EXPANDED CATALOGS (spot-verified August 2026; gratuities and point values refreshed this pass)
  // ====================================================================

  // ---- All-Inclusive Destinations (16 cities) ----
  var AI_DESTINATIONS = [
    { id:"cancun", label:"Cancún, Mexico", region:"caribbean_mx", adultsOnly:true, budget:175, mid:300, luxury:460, ultra:700, bestMonths:"Nov–Apr (dry season); avoid Aug–Oct (hurricane season, rainy)",
      brands:{ budget:"Riu, Oasis, Krystal Grand", mid:"Hyatt Ziva, Moon Palace, Hard Rock Cancún", luxury:"Hyatt Zilara, Live Aqua, Secrets The Vine", ultra:"Le Blanc Spa Resort, Atelier Playa Mujeres" } },
    { id:"riviera_maya", label:"Riviera Maya / Playa del Carmen, Mexico", region:"caribbean_mx", adultsOnly:true, budget:160, mid:285, luxury:430, ultra:680, bestMonths:"Nov–Apr (dry); avoid Sep–Oct (peak hurricane)",
      brands:{ budget:"Bahia Principe, Sandos, Sunscape", mid:"Dreams, Now Sapphire, Barceló Maya", luxury:"Secrets, Hyatt Zilara Riviera Maya, UNICO 20°87°", ultra:"Hotel Xcaret, Grand Velas Riviera Maya, Rosewood Mayakoba" } },
    { id:"punta_cana", label:"Punta Cana, Dominican Republic", region:"caribbean", adultsOnly:true, budget:150, mid:260, luxury:400, ultra:620, bestMonths:"Dec–Apr (dry); value deals May–Nov",
      brands:{ budget:"Riu, Bávaro Princess, Tropical Princess", mid:"Hard Rock Punta Cana, Iberostar Selection, Majestic", luxury:"Excellence Punta Cana, Secrets Cap Cana, Hyatt Zilara", ultra:"Sanctuary Cap Cana, Eden Roc Cap Cana, Tortuga Bay" } },
    { id:"jamaica", label:"Jamaica (Montego Bay / Negril / Ocho Rios)", region:"caribbean", adultsOnly:true, budget:169, mid:290, luxury:450, ultra:720, bestMonths:"Dec–Apr (dry, high season); Jun–Nov lower rates but rainy/hurricane risk",
      brands:{ budget:"Riu Negril, Royal Decameron, Holiday Inn Resort", mid:"Iberostar Rose Hall, Moon Palace Jamaica, Jewel Paradise", luxury:"Sandals Royal Caribbean, Couples Tower Isle, Secrets Wild Orchid", ultra:"Sandals Royal Plantation, Half Moon, Round Hill" } },
    { id:"aruba", label:"Aruba", region:"caribbean", adultsOnly:true, budget:219, mid:350, luxury:550, ultra:820, bestMonths:"Year-round (outside hurricane belt); Jan–Mar peak season",
      brands:{ budget:"Riu Palace Antillas, Holiday Inn Resort Aruba", mid:"Barceló Aruba, Hilton Aruba, Hyatt Regency", luxury:"Marriott Stellaris, Renaissance Aruba, Divi Aruba", ultra:"Bucuti & Tara (adults-only), Ritz-Carlton Aruba" } },
    { id:"turks_caicos", label:"Turks and Caicos Islands", region:"caribbean", adultsOnly:false, budget:350, mid:540, luxury:850, ultra:1300, bestMonths:"Dec–Apr (dry); shoulder Nov and May",
      brands:{ budget:"Ocean Club, Alexandra Resort", mid:"Beaches Turks & Caicos, Club Med Turkoise, Seven Stars", luxury:"The Palms, Grace Bay Club, Wymara", ultra:"Amanyara, Como Parrot Cay, The Shore Club" } },
    { id:"nassau_bahamas", label:"Nassau, Bahamas", region:"caribbean", adultsOnly:false, budget:320, mid:480, luxury:740, ultra:1100, bestMonths:"Dec–Apr (dry); shoulder May–Jun",
      brands:{ budget:"Breezes Bahamas, Comfort Suites Paradise Island", mid:"Atlantis Coral / Beach Tower, Warwick Paradise Island", luxury:"Atlantis Royal Towers, Sandals Royal Bahamian, Grand Hyatt Baha Mar", ultra:"The Cove Atlantis, Rosewood Baha Mar, The Ocean Club Four Seasons" } },
    { id:"st_lucia", label:"St. Lucia", region:"caribbean", adultsOnly:true, budget:240, mid:420, luxury:660, ultra:1050, bestMonths:"Jan–Apr (dry season); shoulder Nov–Dec",
      brands:{ budget:"Bay Gardens Beach Resort, Coconut Bay", mid:"Royalton Saint Lucia, Windjammer Landing, St. James's Club Morgan Bay", luxury:"Sandals Grande St. Lucian, Sandals Regency La Toc, BodyHoliday", ultra:"Jade Mountain, Ladera Resort, Sugar Beach (Viceroy)" } },
    { id:"cabo_san_lucas", label:"Cabo San Lucas / Los Cabos, Mexico", region:"pacific_mx", adultsOnly:true, budget:210, mid:370, luxury:580, ultra:900, bestMonths:"Oct–Jun (dry); avoid Aug–Sep (hurricane season)",
      brands:{ budget:"Riu Santa Fe, Sandos Finisterra, Holiday Inn Resort", mid:"Hyatt Ziva Los Cabos, Hard Rock Los Cabos, Pueblo Bonito", luxury:"Hyatt Zilara, Marquis Los Cabos, Garza Blanca", ultra:"Le Blanc Los Cabos, Waldorf Astoria Pedregal, One&Only Palmilla" } },
    { id:"puerto_vallarta", label:"Puerto Vallarta / Riviera Nayarit, Mexico", region:"pacific_mx", adultsOnly:true, budget:175, mid:290, luxury:450, ultra:680, bestMonths:"Nov–May (dry); avoid Jul–Oct (rainy/hurricane)",
      brands:{ budget:"Riu Vallarta, Crown Paradise, Friendly Vallarta", mid:"Hyatt Ziva Puerto Vallarta, Hard Rock Vallarta, Marival Distinct", luxury:"Secrets Vallarta Bay, Now Amber, Velas Vallarta", ultra:"Grand Velas Riviera Nayarit, Four Seasons Punta Mita, St. Regis Punta Mita" } },
    { id:"costa_rica", label:"Costa Rica", region:"central_america", adultsOnly:false, budget:130, mid:230, luxury:380, ultra:600, bestMonths:"Dec–Apr (dry season Pacific coast); avoid May–Nov (green/rainy)",
      brands:{ budget:"Riu Guanacaste, Occidental Tamarindo, Barceló Tambor", mid:"Dreams Las Mareas, Westin Reserva Conchal, RIU Palace Costa Rica", luxury:"Andaz Peninsula Papagayo, JW Marriott Guanacaste, Secrets Papagayo", ultra:"Four Seasons Costa Rica, Nayara Tented Camp, Hacienda AltaGracia" } },
    { id:"hawaii_maui", label:"Maui, Hawaii (USA)", region:"hawaii", adultsOnly:false, budget:315, mid:490, luxury:780, ultra:1250, bestMonths:"Apr–May and Sep–Oct (shoulder, lower prices); Dec–Mar peak",
      brands:{ budget:"Aston Kaanapali Shores, Maui Coast Hotel (not true AI — partial meals)", mid:"Hyatt Regency Maui, Sheraton Maui, Westin Maui", luxury:"Grand Wailea Waldorf Astoria, Fairmont Kea Lani, Andaz Maui", ultra:"Four Seasons Wailea, Montage Kapalua Bay, Ritz-Carlton Kapalua" } },
    { id:"mexico_huatulco", label:"Huatulco / Oaxacan Coast, Mexico", region:"pacific_mx", adultsOnly:false, budget:160, mid:260, luxury:420, ultra:640, bestMonths:"Oct–May (dry Pacific coast)",
      brands:{ budget:"Park Royal Beach Huatulco, Camino Real Zaashila", mid:"Dreams Huatulco, Barceló Huatulco, Secrets Huatulco", luxury:"Las Brisas Huatulco, Secrets Huatulco Preferred", ultra:"Cala de Mar Resort, Quinta Real Huatulco" } },
    { id:"curacao", label:"Curaçao", region:"caribbean", adultsOnly:true, budget:230, mid:380, luxury:580, ultra:880, bestMonths:"Year-round (outside hurricane belt); Jan–Apr peak",
      brands:{ budget:"Sunscape Curaçao, Plaza Beach Resort", mid:"Dreams Curaçao, Marriott Beach Resort, Renaissance Wind Creek", luxury:"Sandals Royal Curaçao, Mangrove Beach Corendon", ultra:"Baoase Luxury Resort, Kura Botanica" } },
    { id:"belize", label:"Belize", region:"central_america", adultsOnly:false, budget:190, mid:320, luxury:510, ultra:800, bestMonths:"Nov–Apr (dry); avoid Sep–Oct (hurricane risk)",
      brands:{ budget:"Mahogany Bay Resort, Sandy Point Resorts", mid:"Las Terrazas Resort, Grand Caribe Belize, Cocotal Inn", luxury:"Victoria House Resort, Ramon's Village, Belizean Shores", ultra:"Itz'ana Resort, Naia Resort & Spa, Cayo Espanto" } },
    { id:"dominican_republic_general", label:"Dominican Republic (Puerto Plata / Samaná)", region:"caribbean", adultsOnly:false, budget:140, mid:235, luxury:360, ultra:570, bestMonths:"Dec–Apr (dry); shoulder May–Jun",
      brands:{ budget:"Iberostar Costa Dorada, Be Live Marien, Lifestyle Tropical", mid:"Senator Puerto Plata, Viva Wyndham V Heavens, Bahia Principe Grand", luxury:"Casa Colonial Beach & Spa, Sublime Samaná", ultra:"Amanera (Playa Grande), Peninsula House (Samaná)" } },
  ];

  // ---- Cruise Lines (17 lines) ----
  var CRUISE_LINES_EXPANDED = {
    carnival: { label:"Carnival Cruise Line", tier:"value", perPersonLow:249, perPersonAvg:550, perPersonHigh:900, gratuityPerDay:17, note:"7-night Caribbean interior from ~$249/person (online advance). Gratuity increased to $17/day standard staterooms effective April 2, 2026 (fr" },
    royal_caribbean: { label:"Royal Caribbean International", tier:"mainstream", perPersonLow:346, perPersonAvg:650, perPersonHigh:1100, gratuityPerDay:18.5, note:"7-night Caribbean interior from ~$346/person. Gratuity $18.50/day (non-suite), $21/day (suite) as of 2026. Icon of the Seas and Utopia of th" },
    ncl: { label:"Norwegian Cruise Line (NCL)", tier:"mainstream", perPersonLow:429, perPersonAvg:750, perPersonHigh:1300, gratuityPerDay:20, note:"7-night Caribbean from ~$429/person. 'Free at Sea' included beverage/dining promos common. Gratuity $20/day standard, $25/day Haven/Suites. " },
    msc: { label:"MSC Cruises", tier:"mainstream", perPersonLow:298, perPersonAvg:520, perPersonHigh:850, gratuityPerDay:17, note:"From $208 base pricing on homepage; 7-night Caribbean from ~$298/person. MSC expanding US homeports significantly for 2025–26 season includi" },
    princess: { label:"Princess Cruises", tier:"premium", perPersonLow:499, perPersonAvg:850, perPersonHigh:1450, gratuityPerDay:18, note:"7-night Caribbean from ~$499/person. Princess Plus/Premier fares include gratuities. Gratuity $17–19/day (non-suite). Medallion technology d" },
    celebrity: { label:"Celebrity Cruises", tier:"premium", perPersonLow:624, perPersonAvg:950, perPersonHigh:1500, gratuityPerDay:19.5, note:"7-night Caribbean from ~$624/person. Gratuity $18/day (inside/oceanview/veranda), $19/day (Concierge/AquaClass), $23/day (The Retreat). Beve" },
    holland_america: { label:"Holland America Line", tier:"premium", perPersonLow:599, perPersonAvg:900, perPersonHigh:1400, gratuityPerDay:18, note:"7-night Caribbean from ~$599/person. 'Crew appreciation' $17/day (standard), $19/day (suites). Older demographic; classical cruising focus. " },
    disney: { label:"Disney Cruise Line", tier:"premium", perPersonLow:1108, perPersonAvg:1750, perPersonHigh:2800, gratuityPerDay:16, note:"7-night Eastern Caribbean from ~$1,108/person. Disney Treasure 7-night party of 4 ~$8,074 (spring 2026). Gratuity at guest discretion; cust" },
    virgin_voyages: { label:"Virgin Voyages", tier:"premium", perPersonLow:545, perPersonAvg:950, perPersonHigh:1600, gratuityPerDay:22, note:"Adults-only (18+). From ~$545/person 7-night Caribbean. Daily gratuity $22/day (auto-charged; $20/day if pre-paid). Noted price increases in" },
    viking_ocean: { label:"Viking Ocean Cruises", tier:"luxury", perPersonLow:4799, perPersonAvg:6500, perPersonHigh:9500, gratuityPerDay:15, note:"7-night Caribbean from ~$4,799/person. Adults-only (18+). No casinos, no kids, no formal wear. All veranda staterooms; river-style service. " },
    oceania: { label:"Oceania Cruises", tier:"upper_premium", perPersonLow:2212, perPersonAvg:3500, perPersonHigh:5500, gratuityPerDay:18, note:"7-night Caribbean from ~$2,212/person (CruisesOnly). Culinary-focused; noted for included gourmet dining. 'Simply More' package includes sho" },
    regent_seven_seas: { label:"Regent Seven Seas Cruises", tier:"ultra_luxury", perPersonLow:6099, perPersonAvg:8500, perPersonHigh:14000, gratuityPerDay:0, note:"Truly all-inclusive: gratuities, shore excursions, business-class airfare, pre-cruise hotel, specialty dining all included. 7-night Caribbea" },
    silversea: { label:"Silversea Cruises", tier:"ultra_luxury", perPersonLow:4600, perPersonAvg:7000, perPersonHigh:12000, gratuityPerDay:0, note:"7-night Caribbean from ~$4,600/person. All-suites, mostly all-inclusive. 'All-Inclusive Plus' pricing includes $400/person OBC for excursion" },
    cunard: { label:"Cunard Line", tier:"upper_premium", perPersonLow:695, perPersonAvg:1400, perPersonHigh:3000, gratuityPerDay:15, note:"7-night from ~$695/person. Primarily known for transatlantic (Queen Mary 2) but Caribbean itineraries available. Formal dress code retained;" },
    costa: { label:"Costa Cruises", tier:"value", perPersonLow:310, perPersonAvg:580, perPersonHigh:950, gratuityPerDay:14, note:"7-night Caribbean priced similarly to MSC/Carnival. Primarily European market. Limited US homeport Caribbean deployments. Pricing estimated " },
    azamara: { label:"Azamara", tier:"upper_premium", perPersonLow:1800, perPersonAvg:2800, perPersonHigh:4500, gratuityPerDay:0, note:"AzAmazing Evenings, included gratuities and select beverages. Small-ship destination-immersive cruising. Pricing estimated based on comparab" },
    margaritaville_at_sea: { label:"Margaritaville at Sea", tier:"value", perPersonLow:99, perPersonAvg:280, perPersonHigh:550, gratuityPerDay:14, note:"2-night Bahamas cruises from Port of Palm Beach. 2026 Silver Paradise Pass from $849/double for unlimited sailings (Sep 2025–Dec 2026). Shor" },
  };

  // ---- Cruise Ports (14 ports) ----
  var CRUISE_PORTS = [
    { id:"port_canaveral", label:"Port Canaveral, FL", city:"Orlando area (Cocoa Beach), FL", region:"caribbean", lines:["Disney","Royal Caribbean","Carnival","Norwegian","MSC"] },
    { id:"miami", label:"PortMiami, FL", city:"Miami, FL", region:"caribbean", lines:["Carnival","Royal Caribbean","Norwegian","MSC","Celebrity","Virgin Voyages","Azamara","Oceania"] },
    { id:"fort_lauderdale", label:"Port Everglades (Fort Lauderdale), FL", city:"Fort Lauderdale, FL", region:"caribbean", lines:["Holland America","Princess","Royal Caribbean","Disney","Celebrity","Cunard"] },
    { id:"tampa", label:"Port Tampa Bay, FL", city:"Tampa, FL", region:"caribbean", lines:["Carnival","Norwegian"] },
    { id:"new_york", label:"Manhattan Cruise Terminal / Brooklyn Cruise Terminal, NY", city:"New York, NY", region:"caribbean", lines:["MSC","Norwegian","Cunard","Royal Caribbean"] },
    { id:"galveston", label:"Port of Galveston, TX", city:"Galveston (Houston area), TX", region:"caribbean", lines:["Carnival","Royal Caribbean","Norwegian","MSC"] },
    { id:"new_orleans", label:"Port of New Orleans, LA", city:"New Orleans, LA", region:"caribbean", lines:["Carnival","Norwegian"] },
    { id:"baltimore", label:"Port of Baltimore (South Locust Point), MD", city:"Baltimore, MD", region:"caribbean", lines:["Royal Caribbean"] },
    { id:"cape_liberty", label:"Cape Liberty Cruise Port (Bayonne), NJ", city:"New York / New Jersey Metro", region:"caribbean", lines:["Royal Caribbean","Celebrity"] },
    { id:"norfolk", label:"Norfolk Cruise Terminal, VA", city:"Norfolk, VA", region:"caribbean", lines:["Norwegian"] },
    { id:"jacksonville", label:"JAXPORT Cruise Terminal, FL", city:"Jacksonville, FL", region:"caribbean", lines:["Carnival"] },
    { id:"san_juan", label:"Port of San Juan, PR", city:"San Juan, Puerto Rico", region:"caribbean", lines:["Royal Caribbean","Celebrity","Norwegian","Regent","Silversea","Oceania"] },
    { id:"seattle", label:"Smith Cove Cruise Terminal / Bell Street Pier, Seattle, WA", city:"Seattle, WA", region:"alaska", lines:["Holland America","Princess","Royal Caribbean","Norwegian","Celebrity"] },
    { id:"los_angeles", label:"World Cruise Center, Los Angeles (San Pedro), CA", city:"Los Angeles / San Pedro, CA", region:"pacific_mexico", lines:["Carnival","Royal Caribbean","Norwegian","Princess","Holland America"] },
  ];

  // ---- Theme Parks Expanded (18 parks) ----
  var THEMEPARKS_EXPANDED = {
    disney_wdw: { label:"Walt Disney World", location:"Orlando, FL", ticketAdultPerDay:140, mealPerPersonPerDay:75, hotelOnPropAvg:340, offsiteHotelAvg:185, parkingPerDay:35, note:"1-Day ticket from $119/day (date-based). 4-Park Magic Ticket from $99.75/day; valid May 26–Sep 26, 2026. On-site ranges value ($100–160/night) to delu" },
    disneyland: { label:"Disneyland Resort", location:"Anaheim, CA", ticketAdultPerDay:130, mealPerPersonPerDay:80, hotelOnPropAvg:450, offsiteHotelAvg:180, parkingPerDay:35, note:"1-Day ticket tiered pricing, estimated average ~$130; YouTube data April 2026 shows $129 for that date. 3-Day Park Hopper CA resident deal $83/day ($2" },
    universal_orlando: { label:"Universal Orlando Resort (3-Park: Studios + Islands + Epic Universe)", location:"Orlando, FL", ticketAdultPerDay:130, mealPerPersonPerDay:65, hotelOnPropAvg:260, offsiteHotelAvg:165, parkingPerDay:30, note:"Universal Epic Universe opened May 2025. 1-Day ticket range; 3-Day/4-Day/5-Day multi-park tickets include all three parks. On-site from ~$90–100/night" },
    universal_hollywood: { label:"Universal Studios Hollywood", location:"Universal City, CA", ticketAdultPerDay:130, mealPerPersonPerDay:65, hotelOnPropAvg:350, offsiteHotelAvg:175, parkingPerDay:40, note:"Gate price $159/adult. Authorized reseller (aRes Travel) from $101.47/adult. 2-Day General Admission $194 gate. General parking $40 (before 5pm). SUPE" },
    seaworld_orlando: { label:"SeaWorld Orlando", location:"Orlando, FL", ticketAdultPerDay:100, mealPerPersonPerDay:50, hotelOnPropAvg:0, offsiteHotelAvg:165, parkingPerDay:30, note:"Single-Day ticket starting from $59.99 (date-selected) to gate price $147.99. Any-Day ticket $97.99 online. Memorial Day sale pricing as low as $59.99" },
    busch_gardens_tampa: { label:"Busch Gardens Tampa Bay", location:"Tampa, FL", ticketAdultPerDay:95, mealPerPersonPerDay:50, hotelOnPropAvg:0, offsiteHotelAvg:155, parkingPerDay:25, note:"Single-Day ticket from $59.99 (date-selected) to gate $147.99. Any-Day ticket $94.99. Fun Card (unlimited 2026) $99.99 online." },
    busch_gardens_williamsburg: { label:"Busch Gardens Williamsburg", location:"Williamsburg, VA", ticketAdultPerDay:90, mealPerPersonPerDay:50, hotelOnPropAvg:0, offsiteHotelAvg:145, parkingPerDay:20, note:"Single-Day from $61.99 (date-selected) to gate $121.99. Any-Day ticket $91.99. Fun Card (Jan–Sep) $99.99." },
    six_flags_magic_mountain: { label:"Six Flags Magic Mountain", location:"Valencia, CA", ticketAdultPerDay:65, mealPerPersonPerDay:45, hotelOnPropAvg:0, offsiteHotelAvg:140, parkingPerDay:30, note:"Online advance pricing from ~$35. Gate price ~$90. 2026 Gold Pass $89–120. Now part of Six Flags/Cedar Fair merged entity." },
    six_flags_great_adventure: { label:"Six Flags Great Adventure", location:"Jackson, NJ", ticketAdultPerDay:60, mealPerPersonPerDay:45, hotelOnPropAvg:0, offsiteHotelAvg:130, parkingPerDay:25, note:"Park Ticket from $45 online; gate price $90. Includes Wild Safari and Hurricane Harbor. 2026 Gold Pass $89 online." },
    cedar_point: { label:"Cedar Point", location:"Sandusky, OH", ticketAdultPerDay:75, mealPerPersonPerDay:50, hotelOnPropAvg:220, offsiteHotelAvg:130, parkingPerDay:25, note:"Single-day from $52 online; gate $105. 2026 Gold Pass $150 online (gate $195). Resort guest special: $29/ticket. Now part of Cedar Fair/Six Flags merg" },
    kings_island: { label:"Kings Island", location:"Mason, OH", ticketAdultPerDay:65, mealPerPersonPerDay:45, hotelOnPropAvg:200, offsiteHotelAvg:120, parkingPerDay:20, note:"Part of Cedar Fair/Six Flags merged company. Pricing benchmarked to Cedar Point with modest discount for smaller park." },
    hersheypark: { label:"Hersheypark", location:"Hershey, PA", ticketAdultPerDay:75, mealPerPersonPerDay:50, hotelOnPropAvg:240, offsiteHotelAvg:140, parkingPerDay:25, note:"1-Day Any Day Ticket $59.99 online (current sale, normally $89.95 gate price). Hershey Lodge on-site from $179/night; Hotel Hershey from $299/night." },
    dollywood: { label:"Dollywood", location:"Pigeon Forge, TN", ticketAdultPerDay:90, mealPerPersonPerDay:50, hotelOnPropAvg:350, offsiteHotelAvg:160, parkingPerDay:20, note:"1-Day Pick-A-Day from $65–$94.99; Any-Day ticket $99.99. Gate $94.99–$99.99. Season Pass from $169.99. Limited spring 2026 sale: everyone pays kids' p" },
    knotts_berry_farm: { label:"Knott's Berry Farm", location:"Buena Park, CA", ticketAdultPerDay:75, mealPerPersonPerDay:45, hotelOnPropAvg:0, offsiteHotelAvg:145, parkingPerDay:20, note:"Park Ticket from $65 online; gate $110. 2026 Season Pass $120 online (gate $215). Discount third-party tickets from ~$60 (FunEx)." },
    legoland_florida: { label:"LEGOLAND Florida", location:"Winter Haven, FL", ticketAdultPerDay:75, mealPerPersonPerDay:45, hotelOnPropAvg:230, offsiteHotelAvg:130, parkingPerDay:35, note:"BOGO ticket sale: 2 tickets from $129. Annual Pass from $199. Hotel from $167/person/night (limited offer). Standard parking $35." },
    legoland_california: { label:"LEGOLAND California", location:"Carlsbad, CA", ticketAdultPerDay:80, mealPerPersonPerDay:45, hotelOnPropAvg:280, offsiteHotelAvg:160, parkingPerDay:25, note:"Pricing benchmarked to LEGOLAND Florida with slight SoCal premium." },
    great_wolf_lodge: { label:"Great Wolf Lodge (average US location)", location:"Multiple US locations", ticketAdultPerDay:0, mealPerPersonPerDay:50, hotelOnPropAvg:430, offsiteHotelAvg:0, parkingPerDay:0, note:"Admission included with room. Family (3–4) ~$350–700/night. Flash sale pricing seen as low as $26/person/night. Typical family suite $350–600/night. W" },
    silver_dollar_city: { label:"Silver Dollar City", location:"Branson, MO", ticketAdultPerDay:90, mealPerPersonPerDay:45, hotelOnPropAvg:0, offsiteHotelAvg:140, parkingPerDay:15, note:"Any-Day 1-Day ticket $95 (gate $95). Pick-A-Day from $65–$85. Gate day-of $95. Add second day for $20 more." },
  };

  // ---- Timeshare Developers (12) ----
  var TIMESHARE_DEVELOPERS = {
    marriott_vacation_club: { label:"Marriott Vacation Club (Abound by Marriott Vacations)", avgPurchase:24000, maintenanceAnnualAvg:1700, financingApr:17, note:"Points-based Abound system. 2026 maintenance fee $0.81480/point (unchanged from 2025). Annual club fee $255–320 depending on membership tier. Avg transaction re" },
    hilton_grand_vacations: { label:"Hilton Grand Vacations (HGV)", avgPurchase:22000, maintenanceAnnualAvg:1480, financingApr:17.9, note:"Official HGV website states average new member purchase ~$22,000. 2025 Annual Club Dues: Domestic $219, Inclusive US/CA $371, HGV Max $313. ARDA 2024 maintenanc" },
    wyndham_destinations: { label:"Club Wyndham (Wyndham Destinations)", avgPurchase:22000, maintenanceAnnualAvg:1480, financingApr:17.9, note:"Avg price of ownership ~$22,000 for a week's equivalent (Timeshares Only). Points-based Club Wyndham Access program. Resale market exists but values significant" },
    disney_vacation_club: { label:"Disney Vacation Club (DVC)", avgPurchase:35000, maintenanceAnnualAvg:2200, financingApr:12.5, note:"Retail direct pricing: Bay Lake Tower $55,000; BoardWalk Villas $48,000; Old Key West $43,000 direct. Resale significantly lower ($100–150/point). 2026 dues ris" },
    westgate_resorts: { label:"Westgate Resorts", avgPurchase:20000, maintenanceAnnualAvg:1350, financingApr:18.9, note:"Primarily fixed-week and points. Known for high-pressure sales tactics; weak resale market. ARDA 2024 avg transaction $23,160; Westgate estimated slightly below" },
    hyatt_residence_club: { label:"Hyatt Residence Club", avgPurchase:28000, maintenanceAnnualAvg:2000, financingApr:17, note:"Premium positioning in timeshare market. Points convert to World of Hyatt points. Resale market exists; lower prices than direct. Limited to ~18 resort location" },
    holiday_inn_club_vacations: { label:"Holiday Inn Club Vacations (IHG Vacation Club)", avgPurchase:16000, maintenanceAnnualAvg:1200, financingApr:18.5, note:"Official website states average initial purchase ~$15,870; most popular package $44,000 (200,000 points/year). IHG One Rewards integration. 28 resorts primarily" },
    bluegreen_vacations: { label:"Bluegreen Vacations", avgPurchase:19000, maintenanceAnnualAvg:1200, financingApr:18, note:"Acquired by Hilton Grand Vacations in 2024. Points-based; Bass Pro/Cabela's partnerships. Resale market very weak. Estimated below ARDA average. 70+ resorts." },
    diamond_resorts: { label:"Diamond Resorts (now part of HGV)", avgPurchase:20000, maintenanceAnnualAvg:1400, financingApr:18, note:"Merged with Hilton Grand Vacations in 2021; branded separately. Points-based. Resale market weak. 90+ resort collection globally." },
    worldmark_wyndham: { label:"WorldMark by Wyndham", avgPurchase:12000, maintenanceAnnualAvg:900, financingApr:17.9, note:"Points-based (credits); primarily western US and Pacific. Often considered more affordable entry point than Club Wyndham. 2025 fee adjustments announced Dec 202" },
    welk_resorts: { label:"Welk Resorts", avgPurchase:18000, maintenanceAnnualAvg:1300, financingApr:17, note:"Primarily SoCal-based (San Diego area) with Branson, MO location. One-, two-, three-bedroom villas. Granite countertops, full kitchens. Smaller developer; resal" },
    vistana: { label:"Vistana Signature Experiences (Marriott/Sheraton Vacation Club)", avgPurchase:25000, maintenanceAnnualAvg:1800, financingApr:17, note:"Former Starwood Vacation Ownership; now part of Marriott Vacations Worldwide. StarOptions points; Sheraton and Westin branded resorts. Can exchange into Marriot" },
  };

  // ---- Road Trip Routes (20) ----
  var ROADTRIP_ROUTES = [
    { id:"nyc_to_wdw", label:"NYC → Walt Disney World", origin:"New York, NY", destination:"Orlando, FL", miles:1090, driveHours:18, flightAvg:175, flightTime:"2h 50m" },
    { id:"nyc_to_miami", label:"NYC → Miami", origin:"New York, NY", destination:"Miami, FL", miles:1280, driveHours:20, flightAvg:120, flightTime:"3h 15m" },
    { id:"nyc_to_boston", label:"NYC → Boston", origin:"New York, NY", destination:"Boston, MA", miles:215, driveHours:4, flightAvg:130, flightTime:"1h 20m" },
    { id:"nyc_to_dc", label:"NYC → Washington, D.C.", origin:"New York, NY", destination:"Washington, D.C.", miles:225, driveHours:4.5, flightAvg:120, flightTime:"1h 15m" },
    { id:"la_to_vegas", label:"Los Angeles → Las Vegas", origin:"Los Angeles, CA", destination:"Las Vegas, NV", miles:270, driveHours:4.5, flightAvg:90, flightTime:"1h 5m" },
    { id:"la_to_sf", label:"Los Angeles → San Francisco", origin:"Los Angeles, CA", destination:"San Francisco, CA", miles:380, driveHours:6, flightAvg:80, flightTime:"1h 20m" },
    { id:"la_to_grand_canyon", label:"Los Angeles → Grand Canyon (South Rim)", origin:"Los Angeles, CA", destination:"Grand Canyon Village, AZ", miles:490, driveHours:7.5, flightAvg:180, flightTime:"3h (via PHX or FLG)" },
    { id:"chicago_to_smokies", label:"Chicago → Gatlinburg/Smoky Mountains", origin:"Chicago, IL", destination:"Gatlinburg, TN", miles:550, driveHours:8.5, flightAvg:220, flightTime:"3h (via TYS/GSP)" },
    { id:"chicago_to_orlando", label:"Chicago → Orlando", origin:"Chicago, IL", destination:"Orlando, FL", miles:1200, driveHours:18.5, flightAvg:160, flightTime:"2h 45m" },
    { id:"dallas_to_austin", label:"Dallas → Austin", origin:"Dallas, TX", destination:"Austin, TX", miles:195, driveHours:3, flightAvg:110, flightTime:"1h" },
    { id:"dallas_to_new_orleans", label:"Dallas → New Orleans", origin:"Dallas, TX", destination:"New Orleans, LA", miles:510, driveHours:7.5, flightAvg:140, flightTime:"1h 40m" },
    { id:"atlanta_to_orlando", label:"Atlanta → Orlando", origin:"Atlanta, GA", destination:"Orlando, FL", miles:440, driveHours:6.5, flightAvg:130, flightTime:"1h 30m" },
    { id:"atlanta_to_nashville", label:"Atlanta → Nashville", origin:"Atlanta, GA", destination:"Nashville, TN", miles:250, driveHours:4, flightAvg:120, flightTime:"1h 10m" },
    { id:"seattle_to_portland", label:"Seattle → Portland", origin:"Seattle, WA", destination:"Portland, OR", miles:180, driveHours:3, flightAvg:100, flightTime:"55m" },
    { id:"denver_to_yellowstone", label:"Denver → Yellowstone National Park", origin:"Denver, CO", destination:"Yellowstone NP, WY", miles:560, driveHours:8, flightAvg:280, flightTime:"3h (via BIL/JAC)" },
    { id:"boston_to_acadia", label:"Boston → Acadia National Park", origin:"Boston, MA", destination:"Bar Harbor, ME", miles:275, driveHours:4.5, flightAvg:220, flightTime:"2h (via BHB)" },
    { id:"phoenix_to_san_diego", label:"Phoenix → San Diego", origin:"Phoenix, AZ", destination:"San Diego, CA", miles:355, driveHours:5.5, flightAvg:100, flightTime:"1h 15m" },
    { id:"houston_to_galveston", label:"Houston → Galveston", origin:"Houston, TX", destination:"Galveston, TX", miles:50, driveHours:1, flightAvg:0, flightTime:"—" },
    { id:"minneapolis_to_mt_rushmore", label:"Minneapolis → Mt. Rushmore", origin:"Minneapolis, MN", destination:"Keystone, SD (Mt. Rushmore)", miles:600, driveHours:9, flightAvg:250, flightTime:"3h (via RAP)" },
    { id:"dc_to_williamsburg", label:"Washington D.C. → Colonial Williamsburg", origin:"Washington, D.C.", destination:"Williamsburg, VA", miles:155, driveHours:2.5, flightAvg:150, flightTime:"1h 30m (via ORF/PHF)" },
  ];

  // ---- Vehicles (13) ----
  var VEHICLES_EXPANDED = {
    compact: { label:"Compact car (Honda Fit, Hyundai Accent)", mpg:32 },
    compact_hybrid: { label:"Compact hybrid (Toyota Prius, Honda Civic Hybrid)", mpg:52 },
    sedan: { label:"Sedan (Toyota Camry, Honda Accord)", mpg:28 },
    sedan_hybrid: { label:"Sedan hybrid (Camry Hybrid, Accord Hybrid)", mpg:46 },
    compact_suv: { label:"Compact SUV (Toyota RAV4, Honda CR-V)", mpg:27 },
    suv: { label:"Mid-size SUV (Toyota Highlander, Honda Pilot)", mpg:22 },
    suv_hybrid: { label:"SUV hybrid (Toyota RAV4 Hybrid)", mpg:38 },
    minivan: { label:"Minivan (Honda Odyssey, Chrysler Pacifica)", mpg:24 },
    truck: { label:"Pickup truck (Ford F-150)", mpg:18 },
    truck_hd: { label:"Heavy-duty pickup (F-250, RAM 2500)", mpg:14 },
    luxury_suv: { label:"Luxury SUV (Cadillac Escalade, Lincoln Navigator)", mpg:17 },
    sports: { label:"Sports car (Mustang, Camaro)", mpg:21 },
    ev: { label:"EV (Tesla Model 3/Y, Chevy Equinox EV)", mpg:105 },
  };

  // ---- Points Programs Expanded (28) ----
  var POINTS_EXPANDED = {
    chase_ur: { label:"Chase Ultimate Rewards", cash:1.0, portal:1.0, transfer:1.5, tpg:2.05, source:"FM RRV May 2026 (portal floor 1¢)" },
    amex_mr: { label:"American Express Membership Rewards", cash:0.6, portal:1.0, transfer:1.5, tpg:2.0, source:"FM RRV May 2026" },
    bilt: { label:"Bilt Rewards", cash:0.55, portal:1.25, transfer:1.55, tpg:2.2, source:"FM RRV May 2026" },
    capital_one: { label:"Capital One Rewards", cash:1.0, portal:1.0, transfer:1.45, tpg:1.85, source:"FM RRV May 2026" },
    citi_ty: { label:"Citi ThankYou Rewards", cash:0.5, portal:1.0, transfer:1.5, tpg:1.9, source:"FM RRV Aug 2026" },
    wells_fargo: { label:"Wells Fargo Rewards", cash:1.0, portal:1.0, transfer:null, tpg:1.75, source:"TPG May 2026" },
    hyatt: { label:"World of Hyatt", cash:0.5, portal:null, transfer:1.5, tpg:1.65, source:"FM RRV Aug 2026" },
    american_aadvantage: { label:"American Airlines AAdvantage", cash:1.0, portal:null, transfer:1.4, tpg:1.6, source:"FM RRV Aug 2026" },
    united_mileageplus: { label:"United MileagePlus", cash:1.0, portal:null, transfer:1.3, tpg:1.35, source:"FM RRV Aug 2026" },
    jetblue_trueblue: { label:"JetBlue TrueBlue", cash:1.0, portal:null, transfer:null, tpg:1.35, source:"TPG May 2026" },
    delta_skymiles: { label:"Delta SkyMiles", cash:1.0, portal:null, transfer:1.1, tpg:1.2, source:"FM RRV May 2026" },
    southwest_rapid_rewards: { label:"Southwest Rapid Rewards", cash:1.0, portal:null, transfer:null, tpg:1.25, source:"TPG May 2026" },
    alaska_mileageplan: { label:"Alaska Airlines Mileage Plan (Atmos Rewards)", cash:1.0, portal:null, transfer:1.4, tpg:1.4, source:"TPG May 2026" },
    marriott_bonvoy: { label:"Marriott Bonvoy", cash:0.35, portal:null, transfer:0.73, tpg:0.8, source:"FM RRV Aug 2026" },
    hilton_honors: { label:"Hilton Honors", cash:0.35, portal:null, transfer:null, tpg:0.41, source:"FM RRV Aug 2026" },
    aeroplan: { label:"Aeroplan (Air Canada)", cash:1.0, portal:null, transfer:1.7, tpg:1.4, source:"TPG May 2026" },
    avios: { label:"British Airways Avios / Iberia Avios", cash:1.0, portal:null, transfer:1.4, tpg:1.4, source:"TPG May 2026" },
    flying_blue: { label:"Air France/KLM Flying Blue", cash:1.0, portal:null, transfer:1.3, tpg:1.3, source:"TPG May 2026" },
    virgin_atlantic_flying_club: { label:"Virgin Atlantic Flying Club", cash:1.0, portal:null, transfer:1.3, tpg:1.3, source:"TPG May 2026" },
    ana_mileage_club: { label:"ANA Mileage Club", cash:1.0, portal:null, transfer:1.4, tpg:1.4, source:"TPG May 2026" },
    singapore_krisflyer: { label:"Singapore Airlines KrisFlyer", cash:1.0, portal:null, transfer:1.3, tpg:1.3, source:"TPG May 2026" },
    emirates_skywards: { label:"Emirates Skywards", cash:1.0, portal:null, transfer:1.2, tpg:1.2, source:"TPG May 2026" },
    wyndham_rewards: { label:"Wyndham Rewards", cash:0.5, portal:null, transfer:null, tpg:0.65, source:"TPG May 2026" },
    choice_privileges: { label:"Choice Privileges", cash:0.35, portal:null, transfer:null, tpg:0.6, source:"TPG May 2026" },
    best_western_rewards: { label:"Best Western Rewards", cash:0.4, portal:null, transfer:null, tpg:0.6, source:"TPG May 2026" },
    ihg_one_rewards: { label:"IHG One Rewards", cash:0.59, portal:null, transfer:null, tpg:0.6, source:"FM RRV Aug 2026" },
    accor_all: { label:"Accor Live Limitless (ALL)", cash:0.5, portal:null, transfer:2.0, tpg:2.0, source:"TPG May 2026" },
    radisson_rewards: { label:"Radisson Rewards", cash:0.3, portal:null, transfer:null, tpg:0.4, source:"TPG May 2026" },
  };

  // ---- Origin Cities (30) ----
  var ORIGIN_CITIES = [
    { id:"nyc", label:"New York City", airports:["JFK","LGA","EWR"] },
    { id:"lax", label:"Los Angeles", airports:["LAX","BUR","LGB","SNA"] },
    { id:"chi", label:"Chicago", airports:["ORD","MDW"] },
    { id:"dfw", label:"Dallas / Fort Worth", airports:["DFW","DAL"] },
    { id:"atl", label:"Atlanta", airports:["ATL"] },
    { id:"mia", label:"Miami / South Florida", airports:["MIA","FLL","PBI"] },
    { id:"sfo", label:"San Francisco Bay Area", airports:["SFO","OAK","SJC"] },
    { id:"bos", label:"Boston", airports:["BOS"] },
    { id:"sea", label:"Seattle", airports:["SEA"] },
    { id:"den", label:"Denver", airports:["DEN"] },
    { id:"phx", label:"Phoenix", airports:["PHX","AZA"] },
    { id:"hou", label:"Houston", airports:["IAH","HOU"] },
    { id:"dc", label:"Washington, D.C.", airports:["DCA","IAD","BWI"] },
    { id:"las", label:"Las Vegas", airports:["LAS"] },
    { id:"mco", label:"Orlando", airports:["MCO"] },
    { id:"msp", label:"Minneapolis / St. Paul", airports:["MSP"] },
    { id:"dtw", label:"Detroit", airports:["DTW"] },
    { id:"phl", label:"Philadelphia", airports:["PHL"] },
    { id:"clt", label:"Charlotte", airports:["CLT"] },
    { id:"slc", label:"Salt Lake City", airports:["SLC"] },
    { id:"pdx", label:"Portland, OR", airports:["PDX"] },
    { id:"bwi", label:"Baltimore / Washington", airports:["BWI"] },
    { id:"san", label:"San Diego", airports:["SAN"] },
    { id:"mco2", label:"Tampa Bay", airports:["TPA","PIE","SRQ"] },
    { id:"aus", label:"Austin", airports:["AUS"] },
    { id:"msy", label:"New Orleans", airports:["MSY","MSH"] },
    { id:"buf", label:"Buffalo / Niagara", airports:["BUF"] },
    { id:"bna", label:"Nashville", airports:["BNA"] },
    { id:"pit", label:"Pittsburgh", airports:["PIT"] },
    { id:"ric", label:"Richmond / Norfolk, VA", airports:["RIC","ORF"] },
  ];

  // ---- Destination Cities (41) ----
  var DESTINATION_CITIES = [
    { id:"orlando", label:"Orlando, FL", airports:["MCO"], region:"US_domestic" },
    { id:"honolulu", label:"Honolulu, HI", airports:["HNL"], region:"Hawaii" },
    { id:"maui", label:"Maui, HI", airports:["OGG"], region:"Hawaii" },
    { id:"miami_d", label:"Miami, FL", airports:["MIA","FLL"], region:"US_domestic" },
    { id:"las_vegas", label:"Las Vegas, NV", airports:["LAS"], region:"US_domestic" },
    { id:"nyc_d", label:"New York City, NY", airports:["JFK","LGA","EWR"], region:"US_domestic" },
    { id:"chicago_d", label:"Chicago, IL", airports:["ORD","MDW"], region:"US_domestic" },
    { id:"sf_d", label:"San Francisco, CA", airports:["SFO","OAK","SJC"], region:"US_domestic" },
    { id:"dc_d", label:"Washington, D.C.", airports:["DCA","IAD","BWI"], region:"US_domestic" },
    { id:"boston_d", label:"Boston, MA", airports:["BOS"], region:"US_domestic" },
    { id:"nashville_d", label:"Nashville, TN", airports:["BNA"], region:"US_domestic" },
    { id:"new_orleans_d", label:"New Orleans, LA", airports:["MSY"], region:"US_domestic" },
    { id:"seattle_d", label:"Seattle, WA", airports:["SEA"], region:"US_domestic" },
    { id:"denver_d", label:"Denver, CO", airports:["DEN"], region:"US_domestic" },
    { id:"phoenix_d", label:"Phoenix / Scottsdale, AZ", airports:["PHX","AZA"], region:"US_domestic" },
    { id:"san_diego_d", label:"San Diego, CA", airports:["SAN"], region:"US_domestic" },
    { id:"los_angeles_d", label:"Los Angeles, CA", airports:["LAX","BUR","LGB","SNA"], region:"US_domestic" },
    { id:"alaska_d", label:"Anchorage, AK", airports:["ANC"], region:"Alaska" },
    { id:"cancun_d", label:"Cancún, Mexico", airports:["CUN"], region:"Caribbean_Mexico" },
    { id:"cabo_d", label:"Cabo San Lucas / Los Cabos, Mexico", airports:["SJD"], region:"Caribbean_Mexico" },
    { id:"puerto_vallarta_d", label:"Puerto Vallarta, Mexico", airports:["PVR"], region:"Caribbean_Mexico" },
    { id:"punta_cana_d", label:"Punta Cana, Dominican Republic", airports:["PUJ"], region:"Caribbean_Mexico" },
    { id:"aruba_d", label:"Aruba", airports:["AUA"], region:"Caribbean_Mexico" },
    { id:"nassau_d", label:"Nassau, Bahamas", airports:["NAS"], region:"Caribbean_Mexico" },
    { id:"turks_d", label:"Turks & Caicos", airports:["PLS"], region:"Caribbean_Mexico" },
    { id:"st_lucia_d", label:"St. Lucia", airports:["UVF","SLU"], region:"Caribbean_Mexico" },
    { id:"jamaica_d", label:"Jamaica (Montego Bay)", airports:["MBJ"], region:"Caribbean_Mexico" },
    { id:"london", label:"London, UK", airports:["LHR","LGW","STN","LCY"], region:"Europe" },
    { id:"paris", label:"Paris, France", airports:["CDG","ORY"], region:"Europe" },
    { id:"rome", label:"Rome, Italy", airports:["FCO","CIA"], region:"Europe" },
    { id:"barcelona", label:"Barcelona, Spain", airports:["BCN"], region:"Europe" },
    { id:"amsterdam", label:"Amsterdam, Netherlands", airports:["AMS"], region:"Europe" },
    { id:"dublin", label:"Dublin, Ireland", airports:["DUB"], region:"Europe" },
    { id:"reykjavik", label:"Reykjavík, Iceland", airports:["KEF"], region:"Europe" },
    { id:"athens", label:"Athens, Greece", airports:["ATH"], region:"Europe" },
    { id:"tokyo", label:"Tokyo, Japan", airports:["NRT","HND"], region:"Asia" },
    { id:"seoul", label:"Seoul, South Korea", airports:["ICN"], region:"Asia" },
    { id:"bangkok", label:"Bangkok, Thailand", airports:["BKK","DMK"], region:"Asia" },
    { id:"bali", label:"Bali, Indonesia", airports:["DPS"], region:"Asia" },
    { id:"costa_rica_d", label:"San José / Liberia, Costa Rica", airports:["SJO","LIR"], region:"Caribbean_Mexico" },
    { id:"galapagos", label:"Galápagos Islands, Ecuador", airports:["GPS","SCY"], region:"Latin_America" },
    { id:"austin_d",       label:"Austin, TX",                    airports:["AUS"], region:"domestic_south" },
    { id:"savannah_d",     label:"Savannah, GA",                  airports:["SAV"], region:"domestic_south" },
    { id:"charleston_d",   label:"Charleston, SC",                airports:["CHS"], region:"domestic_south" },
    { id:"portland_d",     label:"Portland, OR",                  airports:["PDX"], region:"domestic_west"  },
    { id:"asheville_d",    label:"Asheville, NC",                 airports:["AVL"], region:"domestic_south" },
    { id:"sedona_d",       label:"Sedona, AZ",                    airports:["PHX"], region:"domestic_west"  },
    { id:"smoky_d",        label:"Gatlinburg / Smoky Mountains",  airports:["TYS"], region:"domestic_south" },
    { id:"scottsdale_d",   label:"Scottsdale / Phoenix, AZ",      airports:["PHX"], region:"domestic_west"  },
    { id:"napa_d",         label:"Napa Valley, CA",               airports:["SFO"], region:"domestic_west"  },
    { id:"key_west_d",     label:"Key West, FL",                  airports:["EYW"], region:"domestic_south" },
    { id:"san_antonio_d",  label:"San Antonio, TX",               airports:["SAT"], region:"domestic_south" },
    { id:"memphis_d",      label:"Memphis, TN",                   airports:["MEM"], region:"domestic_south" },
    { id:"jackson_hole_d", label:"Jackson Hole, WY",              airports:["JAC"], region:"domestic_west"  },
    { id:"santa_fe_d",     label:"Santa Fe, NM",                  airports:["SAF"], region:"domestic_west"  },
    { id:"lisbon",         label:"Lisbon, Portugal",              airports:["LIS"], region:"Europe_W"       },
    { id:"prague",         label:"Prague, Czech Republic",        airports:["PRG"], region:"Europe_C"       },
    { id:"mexico_city_d",  label:"Mexico City, Mexico",           airports:["MEX"], region:"Latin_America"  },
    { id:"iceland_d",      label:"Iceland (Reykjavík + Ring Road)",airports:["KEF"],region:"Europe_N"       },
    { id:"costa_rica_city",label:"Costa Rica (adventure)",        airports:["SJO"], region:"Latin_America"  },
    { id:"colombia_d",     label:"Medellín / Cartagena, Colombia",airports:["MDE"], region:"Latin_America"  }
  ];

  // ---- Booking Windows by Route (6 region-pair types) ----
  var BOOKING_WINDOWS = {
    US_domestic: { min:15, max:30, mid:38, cheapestMonth:"Jan (cheapest), Aug–Sep also low", note:"Expedia 2026 Air Hacks: most affordable domestic booking window 15–30 days out ($130 cheaper vs 180+ days). Google Flights data: domestic sweet spot 21–52 days," },
    Europe: { min:60, max:150, mid:90, cheapestMonth:"Nov–Mar (ex-holiday); shoulder Jan–Feb", note:"Google Flights recommends booking international earlier. General guidance: 2–5 months out for Europe. Expedia 2026: international booking window 8–29 days (but " },
    Caribbean_Mexico: { min:35, max:80, mid:60, cheapestMonth:"Aug–Sep (hurricane season = lowest prices), early Dec", note:"Caribbean AI packages often priced 60 days out. Off-season (Aug–Sep) offers 30–50% discounts on resort and air." },
    Hawaii: { min:60, max:90, mid:75, cheapestMonth:"Apr–May, Sep–Oct (shoulder seasons)", note:"Advance booking especially important in peak winter/holiday season. Shoulder season savings can be 20–40%." },
    Alaska: { min:90, max:180, mid:120, cheapestMonth:"Shoulder May and early Sep", note:"Cruises and packages often book 6–12 months out. Shoulder season May and September offer best value vs peak July." },
    Asia: { min:60, max:150, mid:110, cheapestMonth:"Jan–Feb (post-holiday, before Chinese New Year)", note:"Long-haul international; more lead time needed for business/premium cabin availability. Chinese New Year period (Jan–Feb) can spike prices for some Asian routes" },
  };



  // ================================================================
  // SHARED ORIGIN AIRPORTS — 65 US airports, all cities 50k+ covered
  // Groups map to <optgroup> labels in dropdowns across all calculators
  // lat/lng used for ZIP-to-nearest-airport lookup
  // ================================================================
  var ORIGIN_AIRPORTS = [
    // --- Northeast ---
    { id:"jfk",  label:"New York (JFK / LGA / EWR)",        region:"Northeast",    lat:40.64, lng:-73.78 },
    { id:"bos",  label:"Boston (BOS)",                       region:"Northeast",    lat:42.37, lng:-71.00 },
    { id:"phl",  label:"Philadelphia (PHL)",                 region:"Northeast",    lat:39.87, lng:-75.24 },
    { id:"iad",  label:"Washington DC (IAD / DCA / BWI)",    region:"Northeast",    lat:38.95, lng:-77.46 },
    { id:"pit",  label:"Pittsburgh (PIT)",                   region:"Northeast",    lat:40.49, lng:-80.23 },
    { id:"buf",  label:"Buffalo (BUF)",                      region:"Northeast",    lat:42.94, lng:-78.73 },
    { id:"bdl",  label:"Hartford / Springfield (BDL)",       region:"Northeast",    lat:41.94, lng:-72.68 },
    { id:"alb",  label:"Albany (ALB)",                       region:"Northeast",    lat:42.75, lng:-73.80 },
    { id:"syr",  label:"Syracuse (SYR)",                     region:"Northeast",    lat:43.11, lng:-76.11 },
    { id:"pwm",  label:"Portland, ME (PWM)",                 region:"Northeast",    lat:43.65, lng:-70.31 },
    // --- Southeast ---
    { id:"atl",  label:"Atlanta (ATL)",                      region:"Southeast",    lat:33.64, lng:-84.43 },
    { id:"mco",  label:"Orlando (MCO)",                      region:"Southeast",    lat:28.43, lng:-81.31 },
    { id:"mia",  label:"Miami / Fort Lauderdale (MIA / FLL)",region:"Southeast",    lat:25.80, lng:-80.29 },
    { id:"tpa",  label:"Tampa (TPA)",                        region:"Southeast",    lat:27.98, lng:-82.53 },
    { id:"clt",  label:"Charlotte (CLT)",                    region:"Southeast",    lat:35.21, lng:-80.94 },
    { id:"rdu",  label:"Raleigh-Durham (RDU)",               region:"Southeast",    lat:35.88, lng:-78.79 },
    { id:"bna",  label:"Nashville (BNA)",                    region:"Southeast",    lat:36.12, lng:-86.68 },
    { id:"mem",  label:"Memphis (MEM)",                      region:"Southeast",    lat:35.04, lng:-89.98 },
    { id:"bhm",  label:"Birmingham (BHM)",                   region:"Southeast",    lat:33.56, lng:-86.75 },
    { id:"gsp",  label:"Greenville / Spartanburg (GSP)",     region:"Southeast",    lat:34.90, lng:-82.22 },
    { id:"orf",  label:"Norfolk / Virginia Beach (ORF)",     region:"Southeast",    lat:36.90, lng:-76.01 },
    { id:"ric",  label:"Richmond (RIC)",                     region:"Southeast",    lat:37.51, lng:-77.32 },
    { id:"jax",  label:"Jacksonville (JAX)",                 region:"Southeast",    lat:30.49, lng:-81.69 },
    { id:"pns",  label:"Pensacola (PNS)",                    region:"Southeast",    lat:30.47, lng:-87.19 },
    { id:"sav",  label:"Savannah (SAV)",                     region:"Southeast",    lat:32.13, lng:-81.20 },
    { id:"hsv",  label:"Huntsville (HSV)",                   region:"Southeast",    lat:34.64, lng:-86.78 },
    { id:"cha",  label:"Chattanooga (CHA)",                  region:"Southeast",    lat:35.04, lng:-85.20 },
    { id:"tri",  label:"Tri-Cities, TN (TRI)",               region:"Southeast",    lat:36.47, lng:-82.41 },
    // --- Midwest ---
    { id:"ord",  label:"Chicago (ORD / MDW)",                region:"Midwest",      lat:41.98, lng:-87.91 },
    { id:"dtw",  label:"Detroit (DTW)",                      region:"Midwest",      lat:42.21, lng:-83.35 },
    { id:"msp",  label:"Minneapolis (MSP)",                  region:"Midwest",      lat:44.88, lng:-93.22 },
    { id:"mci",  label:"Kansas City (MCI)",                  region:"Midwest",      lat:39.30, lng:-94.71 },
    { id:"stl",  label:"St. Louis (STL)",                    region:"Midwest",      lat:38.75, lng:-90.37 },
    { id:"ind",  label:"Indianapolis (IND)",                 region:"Midwest",      lat:39.72, lng:-86.29 },
    { id:"cmh",  label:"Columbus (CMH)",                     region:"Midwest",      lat:39.99, lng:-82.89 },
    { id:"cvg",  label:"Cincinnati (CVG)",                   region:"Midwest",      lat:39.05, lng:-84.67 },
    { id:"cle",  label:"Cleveland (CLE)",                    region:"Midwest",      lat:41.41, lng:-81.85 },
    { id:"mke",  label:"Milwaukee (MKE)",                    region:"Midwest",      lat:42.95, lng:-87.90 },
    { id:"oma",  label:"Omaha (OMA)",                        region:"Midwest",      lat:41.30, lng:-95.89 },
    { id:"dsm",  label:"Des Moines (DSM)",                   region:"Midwest",      lat:41.53, lng:-93.66 },
    { id:"grr",  label:"Grand Rapids (GRR)",                 region:"Midwest",      lat:42.88, lng:-85.52 },
    // --- South / Texas ---
    { id:"dfw",  label:"Dallas-Fort Worth (DFW / DAL)",      region:"South / Texas",lat:32.90, lng:-97.04 },
    { id:"iah",  label:"Houston (IAH / HOU)",                region:"South / Texas",lat:29.99, lng:-95.34 },
    { id:"aus",  label:"Austin (AUS)",                       region:"South / Texas",lat:30.20, lng:-97.67 },
    { id:"sat",  label:"San Antonio (SAT)",                  region:"South / Texas",lat:29.53, lng:-98.47 },
    { id:"msy",  label:"New Orleans (MSY)",                  region:"South / Texas",lat:29.99, lng:-90.26 },
    { id:"tul",  label:"Tulsa (TUL)",                        region:"South / Texas",lat:36.20, lng:-95.89 },
    { id:"okc",  label:"Oklahoma City (OKC)",                region:"South / Texas",lat:35.39, lng:-97.60 },
    { id:"xna",  label:"NW Arkansas / Bentonville (XNA)",    region:"South / Texas",lat:36.28, lng:-94.30 },
    { id:"lit",  label:"Little Rock (LIT)",                  region:"South / Texas",lat:34.73, lng:-92.22 },
    { id:"elp",  label:"El Paso (ELP)",                      region:"South / Texas",lat:31.81, lng:-106.38 },
    // --- Mountain West ---
    { id:"den",  label:"Denver (DEN)",                       region:"Mountain West", lat:39.86, lng:-104.67 },
    { id:"phx",  label:"Phoenix (PHX)",                      region:"Mountain West", lat:33.44, lng:-112.01 },
    { id:"las",  label:"Las Vegas (LAS)",                    region:"Mountain West", lat:36.08, lng:-115.15 },
    { id:"slc",  label:"Salt Lake City (SLC)",               region:"Mountain West", lat:40.79, lng:-111.98 },
    { id:"abq",  label:"Albuquerque (ABQ)",                  region:"Mountain West", lat:35.04, lng:-106.61 },
    { id:"tus",  label:"Tucson (TUS)",                       region:"Mountain West", lat:32.12, lng:-110.94 },
    { id:"boi",  label:"Boise (BOI)",                        region:"Mountain West", lat:43.56, lng:-116.22 },
    { id:"geg",  label:"Spokane (GEG)",                      region:"Mountain West", lat:47.62, lng:-117.53 },
    { id:"cos",  label:"Colorado Springs (COS)",             region:"Mountain West", lat:38.81, lng:-104.70 },
    // --- Pacific West ---
    { id:"lax",  label:"Los Angeles (LAX)",                  region:"Pacific West",  lat:33.94, lng:-118.41 },
    { id:"sfo",  label:"San Francisco (SFO / OAK / SJC)",   region:"Pacific West",  lat:37.62, lng:-122.38 },
    { id:"sea",  label:"Seattle (SEA)",                      region:"Pacific West",  lat:47.45, lng:-122.31 },
    { id:"pdx",  label:"Portland, OR (PDX)",                 region:"Pacific West",  lat:45.59, lng:-122.60 },
    { id:"san",  label:"San Diego (SAN)",                    region:"Pacific West",  lat:32.73, lng:-117.19 },
    { id:"smf",  label:"Sacramento (SMF)",                   region:"Pacific West",  lat:38.70, lng:-121.59 },
    { id:"hnl",  label:"Honolulu (HNL)",                     region:"Pacific West",  lat:21.33, lng:-157.92 },
    { id:"anc",  label:"Anchorage (ANC)",                    region:"Pacific West",  lat:61.17, lng:-149.99 },
    // --- Drive (no flight) ---
    // Northeast (additions)
    { id:"ewr",  label:"Newark (EWR)",                        region:"Northeast",    lat:40.69, lng:-74.17 },
    { id:"mht",  label:"Manchester, NH (MHT)",                region:"Northeast",    lat:42.93, lng:-71.44 },
    { id:"pvd",  label:"Providence (PVD)",                    region:"Northeast",    lat:41.72, lng:-71.43 },
    { id:"bwi",  label:"Baltimore (BWI)",                     region:"Northeast",    lat:39.18, lng:-76.67 },
    { id:"avp",  label:"Scranton / Wilkes-Barre (AVP)",       region:"Northeast",    lat:41.34, lng:-75.73 },
    // Southeast (additions)
    { id:"msy2", label:"Baton Rouge / Lafayette (BTR/LFT)",   region:"Southeast",    lat:30.53, lng:-91.15 },
    { id:"mob",  label:"Mobile (MOB)",                        region:"Southeast",    lat:30.69, lng:-88.24 },
    { id:"gpt",  label:"Biloxi / Gulfport (GPT)",             region:"Southeast",    lat:30.41, lng:-89.07 },
    { id:"myr",  label:"Myrtle Beach (MYR)",                  region:"Southeast",    lat:33.68, lng:-78.93 },
    { id:"cae",  label:"Columbia, SC (CAE)",                  region:"Southeast",    lat:33.94, lng:-81.12 },
    { id:"ilm",  label:"Wilmington, NC (ILM)",                region:"Southeast",    lat:34.27, lng:-77.90 },
    { id:"leo",  label:"Tallahassee (TLH)",                   region:"Southeast",    lat:30.40, lng:-84.35 },
    { id:"tlh",  label:"Tallahassee (TLH)",                   region:"Southeast",    lat:30.40, lng:-84.35 },
    { id:"rsw",  label:"Fort Myers / Naples (RSW)",           region:"Southeast",    lat:26.54, lng:-81.76 },
    { id:"pie",  label:"St. Pete / Clearwater (PIE)",         region:"Southeast",    lat:27.91, lng:-82.69 },
    // Midwest (additions)
    { id:"flint", label:"Flint (FNT)",                        region:"Midwest",      lat:42.97, lng:-83.74 },
    { id:"fnt",  label:"Flint (FNT)",                         region:"Midwest",      lat:42.97, lng:-83.74 },
    { id:"lan",  label:"Lansing (LAN)",                       region:"Midwest",      lat:42.77, lng:-84.59 },
    { id:"fsd",  label:"Sioux Falls (FSD)",                   region:"Midwest",      lat:43.58, lng:-96.74 },
    { id:"lex",  label:"Lexington (LEX)",                     region:"Midwest",      lat:38.04, lng:-84.61 },
    { id:"sbn",  label:"South Bend (SBN)",                    region:"Midwest",      lat:41.71, lng:-86.32 },
    { id:"day",  label:"Dayton (DAY)",                        region:"Midwest",      lat:39.90, lng:-84.22 },
    // South / Texas (additions)
    { id:"mcallen", label:"McAllen / Brownsville (MFE/BRO)",  region:"South / Texas",lat:26.18, lng:-98.24 },
    { id:"mfe",  label:"McAllen (MFE)",                       region:"South / Texas",lat:26.18, lng:-98.24 },
    { id:"ama",  label:"Amarillo (AMA)",                      region:"South / Texas",lat:35.22, lng:-101.71 },
    { id:"lbb",  label:"Lubbock (LBB)",                       region:"South / Texas",lat:33.66, lng:-101.82 },
    // Mountain West (additions)
    { id:"gjt",  label:"Grand Junction (GJT)",                region:"Mountain West", lat:39.12, lng:-108.53 },
    { id:"fca",  label:"Glacier / Kalispell (FCA)",           region:"Mountain West", lat:48.31, lng:-114.26 },
    { id:"mso",  label:"Missoula (MSO)",                      region:"Mountain West", lat:46.92, lng:-114.09 },
    { id:"bil",  label:"Billings (BIL)",                      region:"Mountain West", lat:45.81, lng:-108.54 },
    // Pacific West (additions)
    { id:"ono",  label:"Ontario / Inland Empire (ONT)",       region:"Pacific West",  lat:34.06, lng:-117.60 },
    { id:"ont",  label:"Ontario / Inland Empire (ONT)",       region:"Pacific West",  lat:34.06, lng:-117.60 },
    { id:"sbp",  label:"San Luis Obispo (SBP)",               region:"Pacific West",  lat:35.24, lng:-120.64 },
    { id:"rdd",  label:"Redding (RDD)",                       region:"Pacific West",  lat:40.51, lng:-122.29 },
    { id:"driving", label:"I'm driving — no flight cost",    region:"_drive",        lat:null,  lng:null }
  ];

  // ================================================================
  // SHARED ORIGIN AIRFARE TABLE
  // Round-trip per person, 2026 Hopper / Google Flights medians by hub
  // Bands: domestic, caribbean, hawaii, europe, latam, asia, oceania, africa, middleeast
  // ================================================================
  var ORIGIN_AIRFARE = {
    driving:  { domestic:0,   caribbean:0,   hawaii:0,   europe:0,    latam:0,   asia:0,    oceania:0,    africa:0,    middleeast:0   },
    // Northeast
    jfk:      { domestic:380, caribbean:460, hawaii:740, europe:780,  latam:560, asia:1180, oceania:1450, africa:1180, middleeast:1000 },
    bos:      { domestic:390, caribbean:470, hawaii:760, europe:800,  latam:590, asia:1220, oceania:1480, africa:1220, middleeast:1050 },
    phl:      { domestic:360, caribbean:470, hawaii:740, europe:820,  latam:580, asia:1240, oceania:1480, africa:1240, middleeast:1080 },
    iad:      { domestic:360, caribbean:460, hawaii:720, europe:800,  latam:560, asia:1180, oceania:1450, africa:1180, middleeast:1020 },
    pit:      { domestic:370, caribbean:500, hawaii:760, europe:840,  latam:610, asia:1200, oceania:1480, africa:1260, middleeast:1060 },
    buf:      { domestic:380, caribbean:510, hawaii:770, europe:850,  latam:620, asia:1220, oceania:1490, africa:1280, middleeast:1080 },
    bdl:      { domestic:390, caribbean:490, hawaii:760, europe:820,  latam:600, asia:1220, oceania:1480, africa:1240, middleeast:1060 },
    alb:      { domestic:400, caribbean:500, hawaii:770, europe:840,  latam:620, asia:1240, oceania:1490, africa:1260, middleeast:1080 },
    syr:      { domestic:400, caribbean:510, hawaii:780, europe:850,  latam:630, asia:1250, oceania:1500, africa:1280, middleeast:1090 },
    pwm:      { domestic:410, caribbean:510, hawaii:780, europe:840,  latam:630, asia:1250, oceania:1490, africa:1270, middleeast:1080 },
    // Southeast
    atl:      { domestic:320, caribbean:380, hawaii:760, europe:880,  latam:540, asia:1280, oceania:1500, africa:1180, middleeast:1100 },
    mco:      { domestic:320, caribbean:360, hawaii:780, europe:900,  latam:520, asia:1320, oceania:1520, africa:1220, middleeast:1140 },
    mia:      { domestic:340, caribbean:320, hawaii:800, europe:880,  latam:420, asia:1340, oceania:1540, africa:1200, middleeast:1140 },
    tpa:      { domestic:340, caribbean:380, hawaii:780, europe:900,  latam:540, asia:1320, oceania:1520, africa:1220, middleeast:1140 },
    clt:      { domestic:340, caribbean:420, hawaii:760, europe:880,  latam:580, asia:1300, oceania:1500, africa:1220, middleeast:1120 },
    rdu:      { domestic:360, caribbean:440, hawaii:760, europe:880,  latam:600, asia:1300, oceania:1500, africa:1220, middleeast:1120 },
    bna:      { domestic:330, caribbean:430, hawaii:770, europe:900,  latam:570, asia:1300, oceania:1510, africa:1230, middleeast:1120 },
    mem:      { domestic:340, caribbean:440, hawaii:780, europe:910,  latam:580, asia:1310, oceania:1520, africa:1240, middleeast:1130 },
    bhm:      { domestic:350, caribbean:450, hawaii:790, europe:920,  latam:590, asia:1320, oceania:1520, africa:1250, middleeast:1140 },
    gsp:      { domestic:360, caribbean:450, hawaii:780, europe:900,  latam:600, asia:1310, oceania:1510, africa:1240, middleeast:1130 },
    orf:      { domestic:370, caribbean:460, hawaii:750, europe:840,  latam:590, asia:1220, oceania:1480, africa:1200, middleeast:1060 },
    ric:      { domestic:370, caribbean:460, hawaii:740, europe:830,  latam:580, asia:1210, oceania:1470, africa:1190, middleeast:1050 },
    jax:      { domestic:340, caribbean:390, hawaii:790, europe:910,  latam:550, asia:1330, oceania:1520, africa:1230, middleeast:1140 },
    pns:      { domestic:360, caribbean:420, hawaii:790, europe:930,  latam:570, asia:1340, oceania:1530, africa:1250, middleeast:1160 },
    sav:      { domestic:360, caribbean:410, hawaii:780, europe:910,  latam:570, asia:1320, oceania:1520, africa:1240, middleeast:1140 },
    hsv:      { domestic:360, caribbean:450, hawaii:790, europe:920,  latam:590, asia:1320, oceania:1520, africa:1250, middleeast:1140 },
    cha:      { domestic:360, caribbean:440, hawaii:780, europe:910,  latam:580, asia:1310, oceania:1520, africa:1240, middleeast:1130 },
    tri:      { domestic:380, caribbean:460, hawaii:790, europe:920,  latam:600, asia:1320, oceania:1520, africa:1260, middleeast:1140 },
    // Midwest
    ord:      { domestic:340, caribbean:500, hawaii:720, europe:820,  latam:600, asia:1080, oceania:1480, africa:1280, middleeast:1080 },
    dtw:      { domestic:360, caribbean:520, hawaii:740, europe:840,  latam:620, asia:1100, oceania:1500, africa:1300, middleeast:1100 },
    msp:      { domestic:360, caribbean:540, hawaii:720, europe:860,  latam:640, asia:1080, oceania:1480, africa:1320, middleeast:1120 },
    mci:      { domestic:360, caribbean:540, hawaii:740, europe:880,  latam:620, asia:1120, oceania:1500, africa:1320, middleeast:1140 },
    stl:      { domestic:340, caribbean:520, hawaii:740, europe:880,  latam:600, asia:1120, oceania:1500, africa:1300, middleeast:1120 },
    ind:      { domestic:360, caribbean:530, hawaii:750, europe:870,  latam:620, asia:1110, oceania:1500, africa:1310, middleeast:1120 },
    cmh:      { domestic:370, caribbean:530, hawaii:760, europe:860,  latam:630, asia:1120, oceania:1500, africa:1310, middleeast:1120 },
    cvg:      { domestic:360, caribbean:520, hawaii:760, europe:860,  latam:620, asia:1110, oceania:1500, africa:1300, middleeast:1110 },
    cle:      { domestic:370, caribbean:520, hawaii:760, europe:850,  latam:620, asia:1120, oceania:1500, africa:1300, middleeast:1110 },
    mke:      { domestic:350, caribbean:510, hawaii:730, europe:840,  latam:610, asia:1090, oceania:1490, africa:1290, middleeast:1090 },
    oma:      { domestic:360, caribbean:550, hawaii:750, europe:900,  latam:640, asia:1130, oceania:1510, africa:1340, middleeast:1160 },
    dsm:      { domestic:360, caribbean:550, hawaii:750, europe:900,  latam:640, asia:1130, oceania:1510, africa:1340, middleeast:1160 },
    grr:      { domestic:370, caribbean:540, hawaii:750, europe:860,  latam:630, asia:1110, oceania:1500, africa:1310, middleeast:1110 },
    // South / Texas
    dfw:      { domestic:320, caribbean:450, hawaii:680, europe:900,  latam:460, asia:1180, oceania:1480, africa:1380, middleeast:1180 },
    iah:      { domestic:320, caribbean:440, hawaii:700, europe:920,  latam:440, asia:1200, oceania:1500, africa:1400, middleeast:1180 },
    aus:      { domestic:340, caribbean:480, hawaii:720, europe:940,  latam:500, asia:1240, oceania:1520, africa:1420, middleeast:1220 },
    sat:      { domestic:350, caribbean:460, hawaii:730, europe:940,  latam:480, asia:1230, oceania:1510, africa:1400, middleeast:1200 },
    msy:      { domestic:340, caribbean:460, hawaii:760, europe:920,  latam:480, asia:1280, oceania:1520, africa:1320, middleeast:1200 },
    tul:      { domestic:360, caribbean:500, hawaii:740, europe:940,  latam:540, asia:1220, oceania:1510, africa:1360, middleeast:1180 },
    okc:      { domestic:360, caribbean:500, hawaii:740, europe:940,  latam:540, asia:1220, oceania:1510, africa:1360, middleeast:1180 },
    xna:      { domestic:370, caribbean:510, hawaii:750, europe:950,  latam:550, asia:1230, oceania:1520, africa:1370, middleeast:1190 },
    lit:      { domestic:370, caribbean:500, hawaii:760, europe:940,  latam:550, asia:1250, oceania:1520, africa:1360, middleeast:1190 },
    elp:      { domestic:360, caribbean:520, hawaii:700, europe:970,  latam:480, asia:1160, oceania:1450, africa:1400, middleeast:1200 },
    // Mountain West
    den:      { domestic:340, caribbean:560, hawaii:620, europe:940,  latam:620, asia:1080, oceania:1380, africa:1380, middleeast:1180 },
    phx:      { domestic:320, caribbean:580, hawaii:540, europe:980,  latam:600, asia:1020, oceania:1320, africa:1440, middleeast:1220 },
    las:      { domestic:320, caribbean:600, hawaii:520, europe:1000, latam:620, asia:1000, oceania:1300, africa:1460, middleeast:1240 },
    slc:      { domestic:340, caribbean:600, hawaii:580, europe:980,  latam:640, asia:1020, oceania:1320, africa:1420, middleeast:1240 },
    abq:      { domestic:360, caribbean:600, hawaii:600, europe:1000, latam:600, asia:1060, oceania:1360, africa:1440, middleeast:1240 },
    tus:      { domestic:360, caribbean:590, hawaii:560, europe:990,  latam:580, asia:1030, oceania:1330, africa:1450, middleeast:1230 },
    boi:      { domestic:360, caribbean:640, hawaii:560, europe:1020, latam:660, asia:980,  oceania:1300, africa:1480, middleeast:1260 },
    geg:      { domestic:370, caribbean:660, hawaii:540, europe:1030, latam:680, asia:960,  oceania:1280, africa:1500, middleeast:1280 },
    cos:      { domestic:360, caribbean:580, hawaii:640, europe:960,  latam:640, asia:1080, oceania:1380, africa:1400, middleeast:1200 },
    // Pacific West
    lax:      { domestic:340, caribbean:620, hawaii:460, europe:1020, latam:640, asia:880,  oceania:1180, africa:1480, middleeast:1240 },
    sfo:      { domestic:340, caribbean:640, hawaii:480, europe:1040, latam:680, asia:880,  oceania:1200, africa:1500, middleeast:1260 },
    sea:      { domestic:360, caribbean:660, hawaii:500, europe:1020, latam:720, asia:900,  oceania:1220, africa:1520, middleeast:1280 },
    pdx:      { domestic:360, caribbean:660, hawaii:520, europe:1040, latam:720, asia:920,  oceania:1240, africa:1520, middleeast:1280 },
    san:      { domestic:340, caribbean:620, hawaii:480, europe:1040, latam:620, asia:900,  oceania:1200, africa:1480, middleeast:1240 },
    smf:      { domestic:350, caribbean:640, hawaii:480, europe:1050, latam:680, asia:890,  oceania:1210, africa:1500, middleeast:1260 },
    hnl:      { domestic:560, caribbean:820, hawaii:0,   europe:1300, latam:900, asia:700,  oceania:900,  africa:1800, middleeast:1500 },
    anc:      { domestic:520, caribbean:860, hawaii:480, europe:1200, latam:960, asia:800,  oceania:1000, africa:1900, middleeast:1600 },
    // Northeast additions
    ewr:      { domestic:370, caribbean:450, hawaii:730, europe:760,  latam:540, asia:1160, oceania:1440, africa:1160, middleeast:980  },
    mht:      { domestic:400, caribbean:500, hawaii:780, europe:840,  latam:630, asia:1250, oceania:1490, africa:1280, middleeast:1080 },
    pvd:      { domestic:395, caribbean:490, hawaii:775, europe:830,  latam:620, asia:1240, oceanic:1485, africa:1270, middleeast:1075 },
    bwi:      { domestic:355, caribbean:455, hawaii:715, europe:795,  latam:555, asia:1175, oceania:1445, africa:1175, middleeast:1015 },
    avp:      { domestic:390, caribbean:505, hawaii:775, europe:855,  latam:630, asia:1230, oceania:1490, africa:1275, middleeast:1085 },
    // Southeast additions
    msy2:     { domestic:340, caribbean:400, hawaii:800, europe:940,  latam:560, asia:1340, oceania:1530, africa:1260, middleeast:1160 },
    mob:      { domestic:360, caribbean:420, hawaii:810, europe:950,  latam:580, asia:1360, oceania:1540, africa:1280, middleeast:1170 },
    gpt:      { domestic:365, caribbean:425, hawaii:810, europe:950,  latam:585, asia:1360, oceania:1540, africa:1280, middleeast:1170 },
    myr:      { domestic:355, caribbean:435, hawaii:775, europe:905,  latam:595, asia:1315, oceania:1510, africa:1245, middleeast:1135 },
    cae:      { domestic:360, caribbean:445, hawaii:775, europe:905,  latam:605, asia:1315, oceania:1510, africa:1248, middleeast:1138 },
    ilm:      { domestic:370, caribbean:455, hawaii:775, europe:905,  latam:615, asia:1320, oceania:1510, africa:1250, middleeast:1140 },
    tlh:      { domestic:345, caribbean:375, hawaii:785, europe:910,  latam:530, asia:1330, oceania:1525, africa:1230, middleeast:1145 },
    rsw:      { domestic:335, caribbean:365, hawaii:785, europe:905,  latam:525, asia:1325, oceania:1522, africa:1225, middleeast:1142 },
    pie:      { domestic:335, caribbean:365, hawaii:782, europe:902,  latam:522, asia:1322, oceania:1520, africa:1222, middleeast:1140 },
    // Midwest additions
    fnt:      { domestic:380, caribbean:510, hawaii:780, europe:860,  latam:630, asia:1220, oceania:1490, africa:1270, middleeast:1090 },
    lan:      { domestic:385, caribbean:515, hawaii:785, europe:865,  latam:635, asia:1225, oceania:1492, africa:1272, middleeast:1092 },
    fsd:      { domestic:380, caribbean:530, hawaii:790, europe:880,  latam:640, asia:1240, oceania:1500, africa:1280, middleeast:1100 },
    lex:      { domestic:345, caribbean:450, hawaii:790, europe:900,  latam:600, asia:1310, oceania:1515, africa:1240, middleeast:1130 },
    sbn:      { domestic:375, caribbean:510, hawaii:785, europe:865,  latam:630, asia:1220, oceania:1490, africa:1270, middleeast:1090 },
    day:      { domestic:355, caribbean:475, hawaii:785, europe:875,  latam:625, asia:1225, oceania:1488, africa:1265, middleeast:1088 },
    // South / Texas additions
    mfe:      { domestic:370, caribbean:430, hawaii:840, europe:980,  latam:480, asia:1380, oceania:1560, africa:1300, middleeast:1180 },
    ama:      { domestic:365, caribbean:460, hawaii:820, europe:960,  latam:560, asia:1360, oceania:1545, africa:1290, middleeast:1165 },
    lbb:      { domestic:370, caribbean:465, hawaii:825, europe:965,  latam:565, asia:1365, oceania:1548, africa:1292, middleeast:1168 },
    // Mountain West additions
    gjt:      { domestic:400, caribbean:560, hawaii:820, europe:970,  latam:670, asia:1380, oceania:1540, africa:1320, middleeast:1160 },
    fca:      { domestic:420, caribbean:580, hawaii:800, europe:980,  latam:690, asia:1360, oceania:1530, africa:1330, middleeast:1170 },
    mso:      { domestic:415, caribbean:575, hawaii:795, europe:975,  latam:685, asia:1355, oceania:1528, africa:1325, middleeast:1165 },
    bil:      { domestic:410, caribbean:570, hawaii:800, europe:975,  latam:680, asia:1360, oceania:1530, africa:1320, middleeast:1160 },
    // Pacific West additions
    ont:      { domestic:320, caribbean:540, hawaii:360, europe:900,  latam:560, asia:1100, oceania:1350, africa:1150, middleeast:1050 },
    sbp:      { domestic:350, caribbean:570, hawaii:380, europe:930,  latam:590, asia:1130, oceania:1380, africa:1180, middleeast:1080 },
    rdd:      { domestic:380, caribbean:600, hawaii:410, europe:960,  latam:620, asia:1160, oceania:1410, africa:1210, middleeast:1110 },
  };


  global.VM_DATA = {
    DISNEY: DISNEY, CRUISE: CRUISE, CARDS: CARDS,
    POINTS: POINTS, ALLINC: ALLINC, TIMESHARE: TIMESHARE,
    ROADTRIP: ROADTRIP, THEMEPARKS: THEMEPARKS, WHENTOBOOK: WHENTOBOOK,
    // Expanded catalogs (spot-verified August 2026)
    AI_DESTINATIONS: AI_DESTINATIONS,
    CRUISE_LINES_EXPANDED: CRUISE_LINES_EXPANDED,
    CRUISE_PORTS: CRUISE_PORTS,
    THEMEPARKS_EXPANDED: THEMEPARKS_EXPANDED,
    TIMESHARE_DEVELOPERS: TIMESHARE_DEVELOPERS,
    ROADTRIP_ROUTES: ROADTRIP_ROUTES,
    VEHICLES_EXPANDED: VEHICLES_EXPANDED,
    POINTS_EXPANDED: POINTS_EXPANDED,
    ORIGIN_CITIES: ORIGIN_CITIES,
    ORIGIN_AIRPORTS: ORIGIN_AIRPORTS,
    ORIGIN_AIRFARE: ORIGIN_AIRFARE,
    DESTINATION_CITIES: DESTINATION_CITIES,
    BOOKING_WINDOWS: BOOKING_WINDOWS
  };
})(this);
