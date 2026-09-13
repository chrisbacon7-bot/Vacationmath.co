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
    { id: "los_angeles", label: "Los Angeles" },
    { id: "anaheim", label: "Anaheim / Disneyland" },
    { id: "philadelphia", label: "Philadelphia" },
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

  // City overrides when a published combined lodging tax is known (HVS / city finance).
  // Percentage only — no per-night flat fees invented into the nightly band.
  var LODGING_TAX_BY_ID = {
    nyc: 0.1475,
    philadelphia: 0.155,
    atlanta: 0.169,
    dallas: 0.15,
    houston: 0.17,
    san_antonio: 0.175,
    anaheim: 0.17,
    phoenix: 0.1257,
    scottsdale: 0.1397,
    memphis: 0.1825,
    chicago: 0.1737,
    seattle: 0.178,
    boston: 0.1695,
    los_angeles: 0.1545,
    san_francisco: 0.16,
    san_diego: 0.125,
    miami: 0.13,
    nola: 0.162,
    vegas: 0.135,
    austin: 0.15,
    nashville: 0.154,
    denver: 0.1475,
    portland_oregon: 0.135,
    washington_dc: 0.1595,
    key_west: 0.125,
    palm_springs: 0.135,
    lake_tahoe: 0.13,
    napa: 0.14,
    monterey: 0.13,
    destin_30a: 0.13,
    outer_banks: 0.1275,
    grand_canyon: 0.116,
    jackson_hole: 0.10,
    portland_me: 0.09,
    bar_harbor: 0.09,
    santa_fe: 0.155
  };

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
    },
    anaheim:       { hotel: { budget: 160, mid: 280, lux: 520 }, food: { budget: 55, mid: 90, lux: 145 }, act: { budget: 45, mid: 80, lux: 130 } },
    key_west:      { hotel: { budget: 180, mid: 320, lux: 580 }, food: { budget: 60, mid: 100, lux: 165 }, act: { budget: 35, mid: 65, lux: 110 } },
    philadelphia:  { hotel: { budget: 150, mid: 230, lux: 400 }, food: { budget: 50, mid: 80, lux: 130 }, act: { budget: 30, mid: 55, lux: 90 } },
    atlanta:       { hotel: { budget: 130, mid: 200, lux: 360 }, food: { budget: 45, mid: 75, lux: 125 }, act: { budget: 30, mid: 55, lux: 95 } },
    dallas:        { hotel: { budget: 130, mid: 200, lux: 350 }, food: { budget: 45, mid: 75, lux: 120 }, act: { budget: 25, mid: 50, lux: 85 } },
    houston:       { hotel: { budget: 120, mid: 190, lux: 340 }, food: { budget: 45, mid: 75, lux: 120 }, act: { budget: 25, mid: 50, lux: 85 } },
    san_antonio:   { hotel: { budget: 130, mid: 210, lux: 380 }, food: { budget: 45, mid: 75, lux: 125 }, act: { budget: 30, mid: 55, lux: 90 } },
    palm_springs:  { hotel: { budget: 140, mid: 240, lux: 450 }, food: { budget: 50, mid: 85, lux: 140 }, act: { budget: 30, mid: 55, lux: 100 } },
    lake_tahoe:    { hotel: { budget: 150, mid: 260, lux: 480 }, food: { budget: 50, mid: 85, lux: 145 }, act: { budget: 40, mid: 70, lux: 125 } },
    napa:          { hotel: { budget: 200, mid: 340, lux: 620 }, food: { budget: 60, mid: 110, lux: 185 }, act: { budget: 40, mid: 85, lux: 150 } },
    monterey:      { hotel: { budget: 170, mid: 280, lux: 520 }, food: { budget: 55, mid: 95, lux: 155 }, act: { budget: 35, mid: 65, lux: 115 } },
    destin_30a:    { hotel: { budget: 160, mid: 280, lux: 520 }, food: { budget: 55, mid: 95, lux: 155 }, act: { budget: 30, mid: 60, lux: 115 } },
    outer_banks:   { hotel: { budget: 150, mid: 260, lux: 480 }, food: { budget: 50, mid: 85, lux: 140 }, act: { budget: 30, mid: 55, lux: 105 } },
    grand_canyon:  { hotel: { budget: 130, mid: 210, lux: 380 }, food: { budget: 45, mid: 75, lux: 120 }, act: { budget: 30, mid: 50, lux: 95 } },
    jackson_hole:  { hotel: { budget: 180, mid: 320, lux: 620 }, food: { budget: 55, mid: 95, lux: 165 }, act: { budget: 45, mid: 80, lux: 145 } },
    phoenix:       { hotel: { budget: 120, mid: 200, lux: 380 }, food: { budget: 45, mid: 75, lux: 125 }, act: { budget: 30, mid: 55, lux: 95 } },
    memphis:       { hotel: { budget: 120, mid: 180, lux: 320 }, food: { budget: 40, mid: 70, lux: 115 }, act: { budget: 25, mid: 50, lux: 85 } },
    portland_me:   { hotel: { budget: 150, mid: 250, lux: 450 }, food: { budget: 50, mid: 85, lux: 140 }, act: { budget: 30, mid: 55, lux: 95 } },
    bar_harbor:    { hotel: { budget: 160, mid: 280, lux: 500 }, food: { budget: 50, mid: 85, lux: 140 }, act: { budget: 35, mid: 60, lux: 105 } },
    santa_fe:      { hotel: { budget: 140, mid: 230, lux: 420 }, food: { budget: 50, mid: 85, lux: 140 }, act: { budget: 30, mid: 55, lux: 95 } }
  };

  var STYLE_MAP = {
    budget: { disneyResort: "value",    disneyDining: "light",   cruiseCabin: "interior", aiTier: "budget", label: "Budget" },
    mid:    { disneyResort: "moderate", disneyDining: "typical", cruiseCabin: "balcony",  aiTier: "mid",    label: "Mid-range" },
    lux:    { disneyResort: "deluxe",   disneyDining: "heavy",   cruiseCabin: "suite",    aiTier: "luxury", label: "Higher-end" }
  };

  var TIER_DEFS = {
    lean:   { label: "Budget",    hint: "Cut extras. Keep the trip", styleShift: -1 },
    solid:  { label: "Mid-range", hint: "The comfortable default",   styleShift: 0 },
    stretch:{ label: "Splurge",   hint: "Nice-to-haves if leftover is real", styleShift: 1 }
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
    if (dest.kind === "disney") return 0.125;
    if (dest.id && LODGING_TAX_BY_ID[dest.id] != null) return LODGING_TAX_BY_ID[dest.id];
    if (dest.id === "nyc") return NYC_LODGING_TAX;
    return LODGING_TAX[dest.region] != null ? LODGING_TAX[dest.region] : 0.12;
  }

  // Named lodging / food / activities by dest + style (budget | mid | lux).
  // Orientation for Budget / Mid-range / Splurge — not live rates, not a ranking, no star scores.
  function H(why) {
    var picks = [];
    for (var i = 1; i < arguments.length; i++) {
      if (arguments[i]) picks.push(arguments[i]);
    }
    return { why: why, picks: picks };
  }
  function F(note, budget, mid, lux) {
    return { note: note, budget: budget, mid: mid, lux: lux };
  }
  function A(budget, mid, lux) {
    return { budget: budget, mid: mid, lux: lux };
  }

  var HOTEL_EXAMPLES = {
    disney: {
      budget: H(
        "Value band — on-property bus or Skyliner, food-court breakfasts, no monorail premium.",
        "All-Star Movies / Music / Sports — Value, walk to the food court, bus to every park",
        "Pop Century — Value, Skyliner to Hollywood Studios and Epcot",
        "Art of Animation family suite — Value-plus when six share one room"
      ),
      mid: H(
        "Moderate band — Skyliner or boat, table-service on site, still a bus to Magic Kingdom.",
        "Caribbean Beach — Moderate, Skyliner hub, biggest campus so request a Riviera-side room",
        "Port Orleans French Quarter or Riverside — Moderate, boat to Disney Springs",
        "Coronado Springs / Fort Wilderness cabin — Moderate; Gran Destino tower is the nicer Coronado ask"
      ),
      lux: H(
        "Deluxe or DVC villa — monorail, boat, or walk to a park. Club level only if leftover is real.",
        "Grand Floridian / Contemporary / Polynesian — Deluxe monorail, Magic Kingdom boat or walk",
        "Beach Club / Yacht Club / BoardWalk — Deluxe, walk to Epcot and Hollywood Studios",
        "DVC villa class — Bay Lake Tower, Riviera, Polynesian Villas, or Copper Creek if you need a kitchen"
      )
    },
    cruise: {
      budget: H(
        "Interior / guarantee — sleep and spend the day on deck. No fake fares here.",
        "Interior guarantee — Carnival or MSC, you pick the price not the deck",
        "Obstructed oceanview — a window if you get claustrophobic, still Budget",
        "Lower-deck interior midship — less motion if you chose the cheap cabin on purpose"
      ),
      mid: H(
        "Oceanview or balcony — the Caribbean product most people actually want.",
        "Oceanview midship — daylight without the balcony premium",
        "Royal Caribbean or NCL balcony — Central-ship beats a cheap aft if you get seasick",
        "Covered balcony on a 7-night Caribbean — sit outside without paying suite gratuities"
      ),
      lux: H(
        "Balcony-plus / suite vibe — more space and a quieter corridor, not a private island.",
        "Large balcony or aft-wrap — the Splurge cabin people remember",
        "NCL Haven / Royal suite-adjacent — suite gratuities run higher; they are their own line",
        "Spa-deck cabin — quieter, still not a fare quote"
      )
    },
    cancun: {
      budget: H(
        "Hotel Zone value AI — beach access, skip the ocean-view upsell and the airport-transfer surprise.",
        "Riu Cancún or Riu Palace Peninsula class — Hotel Zone, walk the strip",
        "Oasis or Krystal Grand class — all-inclusive, no swim-up-suite upsell",
        "Downtown Cancún 3-star if you will eat out — cheaper room, you give up the AI beach"
      ),
      mid: H(
        "Family 4-star AI — confirm the airport transfer is in the rate.",
        "Hyatt Ziva Cancún — Hotel Zone, family-friendly, real beach",
        "Moon Palace or Hard Rock Cancún class — all-inclusive, watch the transfer add-on",
        "Live Aqua or Secrets The Vine class — adults-only mid if there are no kids"
      ),
      lux: H(
        "Adults-only or beach-premium AI — one property, not a hotel hop.",
        "Hyatt Zilara Cancún — adults-only Hotel Zone",
        "Le Blanc Spa Resort — Splurge only if leftover is real",
        "Nizuc or Rosewood Mayakobá class — south of the Zone; a different transfer"
      )
    },
    los_angeles: {
      budget: H(
        "One walkable pocket + Metro/bus. A cheap Valley room becomes a $40 Uber habit.",
        "Freehand Downtown — hostel-plus, walk to the Arts District and Metro",
        "The Line or Hotel Normandie — Koreatown, late food, one rideshare zone",
        "HI Los Angeles / Santa Monica hostel class — beach grid if you skip a car"
      ),
      mid: H(
        "Pick Downtown or the beach — not both. Hotel parking is $40–60/night if you rent a car.",
        "Ace Hotel Downtown — walk to Grand Central Market and the Arts District",
        "Shore Hotel or Palihotel Santa Monica — walk to the beach and the Expo Line",
        "Hotel Figueroa or The Hoxton Downtown — walkable DTLA, skip the Valley commute"
      ),
      lux: H(
        "Beach or WeHo, not both. Disneyland is Anaheim — a separate day trip, not this lodging.",
        "Proper Santa Monica — beach premium, walk to the Promenade",
        "1 Hotel West Hollywood — Sunset-adjacent, you will still rideshare to dinner",
        "Casa del Mar or Sunset Tower class — one neighborhood flagship"
      )
    },
    nyc: {
      budget: H(
        "Subway-first lodging. Skip a Times Square address unless you like paying for the neon.",
        "Pod 39 / Pod Times Square / citizenM Bowery — small room, walk to a train",
        "Freehand or HI NYC class — hostel-plus if the party will share",
        "The Jane or an outer-borough 2-star on a train — Brooklyn/Queens beats Midtown west"
      ),
      mid: H(
        "Walk-to-a-borough-train beats a fancy lobby. Resort-style fees still show up.",
        "Ace Hotel NoMad — walk to the 6 / R / W, neighborhood restaurants",
        "The Beekman or The Hoxton Williamsburg — Downtown or north Brooklyn, not Times Square",
        "Arlo Nomad or The Ludlow — compact 3–4 star, subway in the building’s pocket"
      ),
      lux: H(
        "Flagship in a walkable district. NYC “resort fees” are not optional — add them in your head.",
        "1 Hotel Central Park — park-adjacent, still a crosstown walk to Midtown meetings",
        "The Public or The Greenwich Hotel class — Downtown, not a Midtown tower",
        "The Mark or a UES/Downtown flagship — Splurge is the room, not a second suite"
      )
    },
    paris: {
      budget: H(
        "Metro-line lodging in the 10th–11th or 18th–19th. Gare hotels if you land early.",
        "Ibis / Hotel F1 on a Metro line — 10th, 18th, or 19th, not a tower-block view",
        "Generator Paris or St. Christopher’s — hostel-plus, Canal or Gare du Nord",
        "2-star walk-up near République or Oberkampf — bakery downstairs, Metro in five minutes"
      ),
      mid: H(
        "Left Bank or Canal — arrondissement 5–6 or 10–11, not the tower block.",
        "Hôtel Malte or Odeon-class 3-star — walk to a Metro and a market street",
        "Canal Saint-Martin boutique (10th–11th) — restaurants on the block, not a tourist menu",
        "Hotel near Luxembourg or Bastille — one neighborhood, skip changing arrondissements nightly"
      ),
      lux: H(
        "Palace or design hotel only if leftover covers it — Paris mid already eats a budget.",
        "Hôtel de Crillon or Cheval Blanc class — Place de la Concorde / Pont Neuf pocket",
        "Ritz or Le Bristol class — 1st / 8th, you are paying for the address",
        "Left Bank palace-adjacent (Lutetia class) — stay if the leftover is real, not because the name is famous"
      )
    },
    vegas: {
      budget: H(
        "Off-Strip or downtown. Resort fees apply even on a $40 Tuesday.",
        "Ellis Island or Circa-adjacent downtown — walk Fremont, skip the Strip tram math",
        "The LINQ or Flamingo class — Center-Strip bed, not a suite",
        "Off-Strip Station or Palms class — cheaper room, one rideshare to the Strip"
      ),
      mid: H(
        "Center-Strip walkable. The monorail is a backup, not a plan.",
        "Park MGM — no-casino-smoke tower, walk to the Bellagio fountains",
        "New York-New York or Horseshoe class — Center-Strip, walk the casino corridor",
        "The Venetian / Palazzo mid-week — huge campus; you came to walk, not to Uber"
      ),
      lux: H(
        "Bellagio / Wynn / Venetian class. Weekends and holidays double the midweek rate.",
        "Bellagio — fountain-adjacent, still a resort-fee hotel",
        "Wynn or Encore — north Strip, nicer rooms, you will still walk or tram",
        "Aria or Cosmopolitan class — Center-Strip suite vibe without inventing a rate"
      )
    },
    san_francisco: {
      budget: H(
        "Transit-first. Union Square tourist hotels are the expensive version of a Muni pass.",
        "HI San Francisco Downtown or City Center — hostel-plus, walk to BART",
        "Hotel Zephyr or a Fisherman’s Wharf 2-star only if you want that pocket",
        "The Marker or a Tenderloin-adjacent limited-service — cheaper, know the block"
      ),
      mid: H(
        "Walkable Union Square-adjacent or Embarcadero — skip a car inside the city.",
        "Hotel Nikko or Hilton Union Square class — cable-car adjacent, BART downstairs",
        "Hotel Emeline or a Jackson Square boutique — walk to the Ferry Building",
        "The Inn at the Presidio class — quieter; you traded nightlife for the park"
      ),
      lux: H(
        "Nob Hill or waterfront flagship. Parking is a line item if you day-trip Napa.",
        "Fairmont or Mark Hopkins class — Nob Hill, cable car at the door",
        "1 Hotel San Francisco or proper waterfront — Embarcadero walk",
        "Four Seasons or St. Regis class — SoMa, walk to SFMOMA"
      )
    },
    san_diego: {
      budget: H(
        "Walk-to-trolley or a beach bus. A cheap Mission Valley room is a car tax.",
        "HI San Diego Point Loma or Downtown hostel class — harbor or Gaslamp bus",
        "Hotel Palomar-adjacent limited-service Downtown — walk the Gaslamp, skip Mission Valley",
        "Pacific Beach or Ocean Beach motel class — beach grid if you will not Uber every meal"
      ),
      mid: H(
        "Gaslamp, Little Italy, or one beach town — not all three.",
        "Hotel Palomar or Pendry San Diego class — Gaslamp, walk to the trolley",
        "Kona Kai or a Shelter Island 3-star — water, still a rideshare to Downtown",
        "La Jolla Shores Hotel class — beach mid, you gave up Gaslamp nightlife"
      ),
      lux: H(
        "Waterfront or La Jolla. Hotel Circle is not Splurge.",
        "Hotel del Coronado — ferry or bridge, the postcard lodging",
        "Fairmont Grand Del Mar or Lodge at Torrey Pines class — north, car assumed",
        "Pendry or 1 Hotel San Diego class — harbor walk"
      )
    },
    miami: {
      budget: H(
        "South Beach side street or Downtown mainland — Ocean Drive addresses are a tax.",
        "Freehand Miami or Generator — hostel-plus, walk to the beach and the bus",
        "The Gale or a Collins Avenue 2-star a few blocks off the water — same sand, less neon",
        "Downtown / Brickell limited-service — Metromover, you rideshare to the beach once"
      ),
      mid: H(
        "South Beach walkable or Brickell if you want mainland restaurants.",
        "The Betsy or Essex House class — South Beach, walk to the sand",
        "1 Hotel South Beach is Splurge; mid is a renovated Art Deco 3–4 star on Collins",
        "Kimpton EPIC or a Brickell 4-star — bay, not beach, better food walking"
      ),
      lux: H(
        "Beach-premium or Design District-adjacent. Spring break weeks are not the value window.",
        "1 Hotel South Beach — beach premium, you will still pay for the cabana",
        "Faena or The Setai class — Mid-Beach, quieter than Ocean Drive",
        "Four Seasons Surf Club or Edition class — one flagship, not two neighborhoods"
      )
    },
    london: {
      budget: H(
        "Zone 1–2 on a Tube line. Tesco meal deal + Oyster is the Budget plan.",
        "Premier Inn or Travelodge Zone 1–2 — Southwark, King’s Cross, or Earl’s Court",
        "Generator London or a Bloomsbury hostel-plus — walk to the British Museum",
        "Premier Inn County Hall or a South Bank limited-service — river walk, not a West End rate"
      ),
      mid: H(
        "South Bank, Bloomsbury, or Kensington — one neighborhood, no rental car.",
        "The Hoxton Southwark or Shoreditch — walk to a Tube, restaurants on the block",
        "Kimpton Fitzroy or a Bloomsbury 4-star — museum pocket, Russell Square",
        "The Resident Kensington or a South Ken 3–4 star — museums + Tube, not Mayfair prices"
      ),
      lux: H(
        "Mayfair or Covent Garden flagship. Luxury is the room rate plus £8 pints.",
        "The Savoy or The Ned class — river or City, walk to a station",
        "Claridge’s or The Connaught class — Mayfair, leftover only",
        "Covent Garden Hotel or One Aldwych class — theatre pocket without a palace rate"
      )
    },
    rome: {
      budget: H(
        "Trastevere for the walk, Termini if you land late. Pack light — stairs are the elevator.",
        "Trastevere 2-star or guesthouse — restaurants on the block, walk over the river",
        "The Beehive or a Termini 2-star — trains and buses, louder nights",
        "Prati guesthouse near Ottaviano — Metro to the Vatican, calmer than the centro"
      ),
      mid: H(
        "Walk-to-the-Pantheon is the product, not a rooftop pool.",
        "Hotel Nazionale or a Centro Storico 3-star — Piazza Navona / Pantheon pocket",
        "Hotel de’ Ricci or a Campo de’ Fiori boutique — walk everywhere, skip taxis",
        "Prati 4-star near Ottaviano — Metro + calmer nights if the centro is sold out"
      ),
      lux: H(
        "Rome mid plus one dinner often beats a palace room.",
        "Hotel de Russie — Piazza del Popolo, walk the centro",
        "Hassler or Hotel Eden class — Spanish Steps / Via Veneto above the crush",
        "Kamea or a Pantheon-adjacent 5-star — leftover only"
      )
    },
    tokyo: {
      budget: H(
        "Business hotel next to a JR or Metro station. Capsule only if you packed light.",
        "APA / Super Hotel / Toyoko Inn in Shinjuku or Ueno — station downstairs, convenience store in the lobby",
        "Nine Hours capsule in Shinjuku or Narita crash-pad — Budget only, pack a packing cube",
        "Sakura Hotel Jimbocho or a hostel-plus in Asakusa — walk to a Metro, not a taxi habit"
      ),
      mid: H(
        "Shibuya, Ginza, or Tokyo Station — a JR pass is usually a bad buy on a 5-night city trip.",
        "Mitsui Garden Shibuya or Ginza Premier class — Metro in the basement",
        "Hotel Gracery Shinjuku or Shibuya Stream Excel — neighborhood walking, not a taxi",
        "The Knot Tokyo Shinjuku or a 4-star near Tokyo Station — trains, not a rail-pass spreadsheet"
      ),
      lux: H(
        "Ginza or Marunouchi flagship. Tokyo luxury is the room or the sushi counter — rarely both.",
        "Aman Tokyo or Mandarin Oriental — Otemachi / Nihonbashi, station downstairs",
        "Palace Hotel Tokyo or Hoshinoya Tokyo class — Imperial-garden or courtyard quiet",
        "Park Hyatt Shinjuku — the view; you still take the Metro to dinner"
      )
    },
    oahu: {
      budget: H(
        "Waikiki bus grid — skip the car if you will stay on the beach and the #2 / #8 / #13.",
        "Aqua Oasis or Shoreline Hotel Waikiki class — limited-service, walk to the sand",
        "The Equus or a Kuhio Avenue 2-star — one block back, same beach",
        "Hostelling International Waikiki or a studio condo — kitchenette beats resort breakfast"
      ),
      mid: H(
        "Walk-to-beach midrise. Parking is $40–55/night if you add a car.",
        "Outrigger Waikiki or Reef Waikiki class — Kalakaua walk, beach access",
        "Hilton Hawaiian Village — huge campus, you came for the lagoon not the boutique",
        "The Laylow or ‘Alohilani class — Waikiki 4-star, still no car required"
      ),
      lux: H(
        "Kahala or Ko Olina — a rental car becomes mandatory once you leave Waikiki.",
        "The Kahala Hotel & Resort — east of Waikiki, quieter beach",
        "Four Seasons Ko Olina or Aulani (if leftover + kids) — west side, car assumed",
        "Halekulani or Royal Hawaiian class — Waikiki luxury if you refuse to leave the grid"
      )
    },
    maui: {
      budget: H(
        "Kihei / South Maui condo — the kitchen is the budget.",
        "Aston Maui Kaanapali Villas is mid; Budget is a Kihei condo (Maui Coast / Punahoa class)",
        "Kohea Kai or a South Kihei studio — walk to a food truck, grocery the first hour",
        "Paia inn-adjacent 2-star — north shore if you will not sit in Kaanapali traffic"
      ),
      mid: H(
        "Kaanapali walk-to-beach. Resort fees and parking will show up.",
        "Sheraton Maui or Westin Maui class — Kaanapali Beach, walk the path",
        "Hyatt Regency Maui — same beach, bigger campus",
        "Wailea Ekahi or a Kihei-plus condo — kitchen still wins some dinners"
      ),
      lux: H(
        "Wailea is the room. Do not also buy every excursion.",
        "Grand Wailea — Wailea Beach, the Splurge default",
        "Andaz Maui or Four Seasons Maui — same pocket, leftover only",
        "Hotel Wailea adults-only — quieter hill, you will still drive to dinner"
      )
    },
    punta_cana: {
      budget: H(
        "Bávaro value AI — Punta Cana is the value island; do not pay Cancún prices.",
        "Riu Republic or Riu Bávaro class — all-inclusive, beach shuttle on property",
        "Bávaro Princess or Catalonia Bávaro class — family value, skip Cap Cana",
        "Grand Palladium-adjacent value — confirm the transfer is in the rate"
      ),
      mid: H(
        "Hard Rock or Iberostar Selection class. Cap Cana is a different, pricier pocket.",
        "Hard Rock Punta Cana — family mid, huge campus",
        "Iberostar Selection Bávaro — all-inclusive, beach",
        "Secrets Cap Cana is Splurge-adjacent; mid stays in Bávaro"
      ),
      lux: H(
        "Cap Cana or adults-only. Eden Roc only as leftover.",
        "Excellence Punta Cana or Secrets Cap Cana — adults-only",
        "Eden Roc at Cap Cana — Splurge villa class",
        "Sanctuary Cap Cana — same pocket, not a second island hop"
      )
    },
    jamaica: {
      budget: H(
        "Montego Bay is the flight; Negril is the beach. Transfer time is the hidden cost.",
        "Riu Negril — Seven Mile Beach, value AI",
        "Holiday Inn Resort Montego Bay class — closer to the airport, lesser beach",
        "Legends or a Negril 3-star walk-to-beach — skip the MoBay hotel restaurant"
      ),
      mid: H(
        "Rose Hall or Negril 4-star. Price the transfer as its own line in your head.",
        "Iberostar Rose Hall — MoBay side, shorter transfer",
        "Moon Palace Jamaica — all-inclusive mid",
        "Couples Swept Away or a Negril 4-star — beach, adults or family depending on the brand"
      ),
      lux: H(
        "Sandals / Couples / Secrets class. Adults-only pricing assumes no kids.",
        "Sandals South Coast or Montego Bay — couples AI",
        "Round Hill or Half Moon class — villa stretch, MoBay side",
        "Rockhouse or a Negril cliff boutique — leftover, not a fake rate"
      )
    },
    barcelona: {
      budget: H(
        "Eixample or El Born. Las Ramblas hotels are a tourist tax.",
        "Generator Barcelona or Equity Point hostel-plus — Gràcia / Gothic, Metro downstairs",
        "Hotel Jazz or a 2-star Eixample — walk to Passeig de Gràcia",
        "El Born guesthouse — restaurants on the block, skip the Ramblas address"
      ),
      mid: H(
        "Eixample or Barceloneta-adjacent. Metro, not taxis.",
        "Hotel Casa Fuster-adjacent or a 3–4 star Eixample — Modernisme walking",
        "H10 Casa Mimosa or Cotton House class — Eixample, Metro in five minutes",
        "W Barcelona is Splurge; mid is Barceloneta 3-star or Born boutique"
      ),
      lux: H(
        "Waterfront or Eixample flagship. Beach-club pricing is not in the room rate.",
        "W Barcelona — Barceloneta beach premium",
        "Mandarin Oriental Barcelona — Passeig de Gràcia",
        "Hotel Arts or El Palace class — one flagship"
      )
    },
    mexico_city: {
      budget: H(
        "Roma Norte or Condesa. Uber is cheap; the Metro is cheaper.",
        "Casa Decu or a Roma Norte guesthouse — walk to cafés, one Uber zone",
        "Hostal Regina or a Centro hostel-plus — Zócalo walking, noisier nights",
        "Condesa df-adjacent 2-star — park walks, street food on the block"
      ),
      mid: H(
        "Roma / Condesa / Polanco 3–4 star. Altitude plus street food is the trip.",
        "Camino Real Polanco or downtown design class — one neighborhood",
        "The Hoxton Roma or Brick Hotel class — walkable Roma",
        "Downtown México or a Centro 4-star — rooftop, you still eat in Roma"
      ),
      lux: H(
        "CDMX luxury is the restaurant reservation more than the room.",
        "Four Seasons Reforma — walkable spine",
        "St. Regis or Las Alcobas Polanco class — leftover",
        "Casa Polanco or a design flagship — one pocket"
      )
    },
    thailand: {
      budget: H(
        "Bangkok or Chiang Mai old city — this is where budget style actually works.",
        "Khao San-adjacent or Chinatown guesthouse — river boat + BTS, not a taxi habit",
        "Lub d or a hostel-plus in Silom / Chiang Mai old city — walk to food stalls",
        "Boutique guesthouse on the Ping or Chao Phraya — fan room is fine"
      ),
      mid: H(
        "Sukhumvit or riverside 3–4 star. BTS/MRT, not taxis in traffic.",
        "Sukhumvit 3–4 star near a BTS (Asok / Phrom Phong)",
        "Shangri-La-adjacent riverside — river boat to dinner",
        "Chiang Mai Nimman 4-star if you split the trip — one city per stay"
      ),
      lux: H(
        "One river hotel, not three island hops.",
        "Mandarin Oriental Bangkok — river, leftover",
        "Capella Bangkok — same river, Splurge",
        "Four Seasons Chiang Mai if the north is the point — do not also buy Phuket mid-trip"
      )
    },
    nola: {
      budget: H(
        "Warehouse District or Mid-City. French Quarter room premium is real.",
        "HI New Orleans or a Warehouse District 2-star — streetcar, not a Bourbon balcony",
        "The Drifter or a Mid-City motel-plus — Canal streetcar to the Quarter",
        "Henry Howard-adjacent Garden District guesthouse — quieter, still a streetcar"
      ),
      mid: H(
        "French Quarter-adjacent or Garden District. Walk or streetcar.",
        "Hotel Peter and Paul or The Eliza Jane — Marigny / CBD, walk to dinner",
        "The Pontchartrain or a Garden District 3–4 star — St. Charles line",
        "Omni Royal Orleans class — Quarter if you accept the premium"
      ),
      lux: H(
        "The trip is the food, not the courtyard.",
        "Windsor Court — CBD, quiet luxury",
        "Hotel Monteleone — Quarter flagship, leftover",
        "Maison de la Luz or The Chloe class — design Splurge"
      )
    },
    chicago: {
      budget: H(
        "Loop or River North limited-service. Hotel tax is already in the plan.",
        "Freehand Chicago or HI Chicago — hostel-plus, walk to the L",
        "Hampton or a Loop limited-service — trains downstairs",
        "The Hoxton-adjacent Fulton Market 2–3 star if you want restaurants over the Mag Mile"
      ),
      mid: H(
        "River North or Fulton Market. The L beats surge pricing.",
        "The Hoxton Chicago — Fulton Market, walk to dinner",
        "Hotel Lincoln or a Gold Coast 3–4 star — park and bus",
        "LondonHouse or a River North 4-star — river walk, not a suburban rate"
      ),
      lux: H(
        "Winter rates are the value window. Summer weekends are not.",
        "The Langham Chicago — river, leftover",
        "The Peninsula Chicago — Mag Mile flagship",
        "St. Regis or Four Seasons class — one tower"
      )
    },
    amsterdam: {
      budget: H(
        "Canal-belt hostel or Sloterdijk 2-star. Canal houses are stairs, not elevators.",
        "The Flying Pig or ClinkNOORD hostel-plus — walk or ferry, not a canal-house rate",
        "Ibis Budget near Sloterdijk or Amstel — tram to the center",
        "Hotel Not Hotel or a De Pijp 2-star — neighborhood, pack light"
      ),
      mid: H(
        "Jordaan or De Pijp. Transit card, not a rental car.",
        "Pulitzer-adjacent or a Jordaan 3–4 star — canal walk",
        "Hotel Casa or a De Pijp boutique — restaurants on the block",
        "Conservatorium is Splurge; mid is a canal 4-star without the garden rate"
      ),
      lux: H(
        "King’s Day and August are the skip months.",
        "Hotel Pulitzer — canal houses stitched together",
        "Conservatorium — Museumplein leftover",
        "De L’Europe or Waldorf Astoria class — one flagship"
      )
    },
    lisbon: {
      budget: H(
        "Alfama or Intendente. Hills + trams; pack light.",
        "Home Lisbon Hostel or a Baixa-adjacent hostel-plus — walk to a tram, not a taxi habit",
        "The Independente or Intendente 2-star — neighborhood restaurants",
        "Alfama guesthouse — views, stairs, grocery the first morning"
      ),
      mid: H(
        "Baixa / Chiado / Príncipe Real. Uber is cheap; the 28 tram is a postcard, not transit.",
        "Memmo Príncipe Real or a Chiado 3–4 star — walk downhill to dinner",
        "Hotel da Baixa or a 4-star near Rossio — trains and trams",
        "LX Boutique or a Cais do Sodré 3-star — river, nightlife on the block"
      ),
      lux: H(
        "Lisbon mid already feels like a Splurge in Paris.",
        "Bairro Alto Hotel — Chiado leftover",
        "Four Seasons Ritz Lisbon — park-adjacent flagship",
        "Tivoli Avenida Liberdade class — one boulevard"
      )
    },
    iceland: {
      budget: H(
        "Reykjavík hostel or Keflavík crash pad. Car + groceries, not a hotel breakfast.",
        "Kex Hostel or Loft — 101 Reykjavík, walk to the pool",
        "Keflavík Airport Hotel class — only the night you land or fly",
        "A 101 guesthouse with a kitchenette — breakfast is Bónus, not the buffet"
      ),
      mid: H(
        "3–4 star 101 Reykjavík. The Ring Road is a different trip and budget.",
        "Hotel Borg or Canopy by Hilton — 101, walk downtown",
        "Ion City or a harbor 4-star — still not the Blue Lagoon hotel",
        "Selfoss or Vik mid only if this is a road trip — then the car is the lodging plan"
      ),
      lux: H(
        "Luxury here is the soak, not the minibar.",
        "ION Adventure — Golden Circle leftover",
        "The Retreat at Blue Lagoon — soak + room, Splurge only",
        "Edition Reykjavík — 101 flagship if you skip the countryside"
      )
    },
    bali: {
      budget: H(
        "Canggu or Ubud guesthouse. Scooter math is real — insure it.",
        "Pondok or a Canggu homestay — walk to a warung, scooter for the beach",
        "Ubud jungle guesthouse — rice-terrace walk, not Seminyak prices",
        "Kuta 2-star only as a crash pad near the airport"
      ),
      mid: H(
        "Seminyak or Ubud 3–4 star. Nyepi dates are a skip or a gift.",
        "Potato Head-adjacent or a Seminyak boutique — beach clubs are extra",
        "Maya Ubud or a riverside 4-star — one base",
        "Canggu midrise with a pool — still a scooter town"
      ),
      lux: H(
        "One nice villa beats three mediocre resorts.",
        "Mandapa or Capella Ubud — jungle leftover",
        "Bulgari or Alila Villas Uluwatu — cliff Splurge",
        "Como Uma or a Seminyak villa — one property"
      )
    },
    dubai: {
      budget: H(
        "Deira or Bur Dubai. Metro to the Marina; skip the desert-tour upsell on day one.",
        "Rove Downtown or Rove City Walk — Budget-plus, Metro",
        "Deira 3-star near a Metro — creek, cheaper nights",
        "Bur Dubai heritage-adjacent 3-star — walk the souk, Metro to Downtown"
      ),
      mid: H(
        "Marina or Downtown 4-star. July–August is cheap and brutal.",
        "Address Downtown-adjacent or a 4-star near Burj Khalifa — Metro, not a taxi habit",
        "Marina 4-star on the tram — walk the walkway",
        "Palm mid is a different transfer; stay Downtown unless the Palm is the point"
      ),
      lux: H(
        "Dubai luxury is a weekend, not a week.",
        "Armani Hotel Dubai — Burj Khalifa, leftover",
        "Atlantis The Palm — Palm Splurge, kids assumed",
        "Burj Al Arab or One&Only — name-brand leftover only"
      )
    }
  };

  var HOTEL_FALLBACKS = {
    disney: HOTEL_EXAMPLES.disney,
    cruise: HOTEL_EXAMPLES.cruise,
    ai: {
      budget: H(
        "Value all-inclusive — beach access, skip the swim-up-suite upsell and confirm the transfer.",
        "Riu / Palace / Krystal class — on-property shuttle or a short hotel-zone walk",
        "3-star AI on the main beach strip — garden view on purpose",
        "Downtown limited-service only if you will eat out and skip the AI product"
      ),
      mid: H(
        "4-star family AI — one property, airport transfer in the rate.",
        "Hyatt Ziva / Iberostar Selection / Hard Rock class — beach, kids club if you need it",
        "Moon Palace or Live Aqua class — all-inclusive mid",
        "Adults-only 4-star if there are no kids — Secrets / Dreams class"
      ),
      lux: H(
        "Adults-only or villa AI — leftover only, still no invented nightly rate.",
        "Hyatt Zilara / Excellence / Secrets stretch class — beach premium",
        "Overwater or swim-up suite only if leftover covers the jump",
        "One flagship, not a two-resort hop"
      )
    },
    domestic: {
      budget: H(
        "Limited-service on a transit line or a walkable neighborhood inn. Skip airport lodging except the night you fly.",
        "Hampton Inn or Tru by Hilton downtown — not the interstate cloverleaf",
        "Holiday Inn Express or Fairfield Inn near a transit stop — grocery in walking distance",
        "Courtyard or Motto/Aloft when present — walk to a train or bus"
      ),
      mid: H(
        "Walkable-core 3–4 star near transit. Location over a rooftop pool you will use twice.",
        "Marriott, Hilton, or Hyatt Place / Hyatt Regency in the walkable district",
        "Westin, Sheraton, Renaissance, or Canopy — one room, not a suite",
        "Autograph / Tribute / Curio when a real property fits — skip the cloverleaf tower"
      ),
      lux: H(
        "Flagship in one district. Luxury is the room — do not also buy every paid tour.",
        "JW Marriott, Grand Hyatt, Conrad, or Waldorf Astoria when the city has one",
        "Ritz-Carlton, St. Regis, W, Edition, or Four Seasons / Fairmont leftover",
        "Suite only if leftover covers the jump from mid"
      )
    },
    europe: {
      budget: H(
        "Ibis / Generator / 2-star on a Metro or tram line. Bakery downstairs beats hotel breakfast.",
        "Ibis / Hotel F1 / Premier Inn class on a Metro or tram — not the airport strip",
        "Generator or hostel-plus in a neighborhood with night trams",
        "2-star walk-up near a market street — pack light, stairs are common"
      ),
      mid: H(
        "3–4 star in the walkable centro, Left Bank, or canal district — one neighborhood.",
        "Hilton, Marriott, or Hyatt / Hotel Indigo near a Metro and a food market",
        "Novotel or NH Collection 4-star if you will grocery two breakfasts",
        "Hotel near the main station only if you arrive late — then move, or own that pocket"
      ),
      lux: H(
        "Palace or design hotel only if leftover covers it. Mid in Europe already eats a US budget.",
        "Park Hyatt, Conrad, Waldorf, or Four Seasons / Fairmont when the city has one",
        "Palace / Luxury Collection historic in the old city",
        "Suite with a view leftover-only"
      )
    },
    hawaii: {
      budget: H(
        "Condo or limited-service on the bus grid. A kitchenette is the Budget product.",
        "Hampton, Holiday Inn Express, or Outrigger value — grocery the first hour",
        "Studio condo or 2-star a block off the sand — same beach, less resort fee",
        "Skip a rental car if the bus or a bike reaches the beach and the store"
      ),
      mid: H(
        "Walk-to-beach midrise. Parking and resort fees are their own lines.",
        "Outrigger / Sheraton / Hilton beach-class — one resort path, not three islands",
        "Condo-plus in the same beach town if you will cook two dinners",
        "Resort mid on the main beach — request garden vs ocean on purpose"
      ),
      lux: H(
        "Wailea / Ko Olina / Four Seasons class. The car becomes mandatory once you leave town.",
        "Beach-premium flagship in one pocket",
        "Adults-only or villa if leftover is real",
        "Do not also book every snorkel and helicopter"
      )
    },
    caribbean: {
      budget: H(
        "Value AI or a walk-to-beach 3-star. Confirm the airport transfer.",
        "Riu / Princess / Palace class on the main beach",
        "Garden-view AI — skip the ocean-view upsell",
        "Town guesthouse only if you will eat out and take local buses"
      ),
      mid: H(
        "4-star AI or a boutique in town. One property.",
        "Iberostar Selection / Hard Rock / Hyatt Ziva class",
        "Adults-only 4-star if there are no kids",
        "Transfer in the rate, not a dock surprise"
      ),
      lux: H(
        "Adults-only or villa stretch. Still no invented fare.",
        "Excellence / Secrets / Sandals class",
        "Overwater or cliff villa leftover-only",
        "One island, one resort"
      )
    },
    mexico: {
      budget: H(
        "Centro guesthouse or a value AI on the hotel strip — pick one product.",
        "Roma / Centro / Zona Hotelera value room — walk or ADO bus",
        "Riu / Palace-class AI if this is a beach week",
        "Skip the ocean-view upsell and the timeshare pitch"
      ),
      mid: H(
        "Walkable colonia boutique or a 4-star AI.",
        "Design 3–4 star in Roma, Polanco, or the hotel zone",
        "Hyatt Ziva / Live Aqua class if all-inclusive is the point",
        "One neighborhood — CDMX traffic is the hidden cost"
      ),
      lux: H(
        "Flagship or adults-only. The reservation is often the better splurge.",
        "Four Seasons / Rosewood / Le Blanc class",
        "Adults-only beach premium",
        "One property"
      )
    },
    asia: {
      budget: H(
        "Business hotel or capsule next to a Metro or JR station.",
        "APA / Super Hotel / Tune / capsule class — station downstairs",
        "Hostel-plus in the old city or night-market pocket",
        "Convenience-store breakfast is the plan, not a compromise"
      ),
      mid: H(
        "4-star near a Metro interchange. Rail passes are often a bad buy on a short city trip.",
        "Mitsui Garden / Hotel Indigo / neighborhood 4-star",
        "Riverside or night-market-adjacent boutique",
        "One city base — skip the three-island hop"
      ),
      lux: H(
        "Palace / Park Hyatt / Mandarin class. The room or the counter dinner — rarely both.",
        "Flagship in the central ward",
        "Ryokan or courtyard hotel if that is the point of the trip",
        "Suite leftover-only"
      )
    },
    oceania: {
      budget: H(
        "City hostel-plus or a 3-star on a train line. Long-haul is the expensive line, not the room.",
        "YHA / Base hostel-plus or Ibis-class near a station",
        "Neighborhood 3-star, not the airport strip",
        "Apartment with a kitchen if the stay is 5+ nights"
      ),
      mid: H(
        "Harbor or CBD 4-star. One city, then a separate island or alps budget if you split.",
        "Harbor-adjacent 4-star on a ferry or train",
        "Boutique in the walkable core",
        "Campervan only if that is the trip — it replaces the hotel line"
      ),
      lux: H(
        "Waterfront or lodge flagship. Do not stack every adventure add-on.",
        "Harbor or sound-view flagship",
        "Wilderness lodge leftover-only",
        "One base"
      )
    },
    africa: {
      budget: H(
        "Medina guesthouse or city 3-star. Day tours beat a safari-priced room you do not need.",
        "Riad or township-adjacent guesthouse — walk to food, use trusted drivers",
        "City 3-star near a tram or BRT",
        "Skip the hotel dinner most nights"
      ),
      mid: H(
        "Riad / boutique / 4-star in the walkable core. Safari lodges are a different budget.",
        "Restored riad or city boutique",
        "4-star near the waterfront or medina edge",
        "One city, then a separate lodge line if you add safari"
      ),
      lux: H(
        "Lodge or palace leftover. The game drive is the product.",
        "Palace / safari-lodge class",
        "Cape or Nile flagship",
        "Do not double-pay for every optional excursion"
      )
    },
    middleeast: {
      budget: H(
        "Deira / downtown 3-star on a Metro. Desert tours are day-two, not day-one upsells.",
        "Rove / Ibis / 3-star near a Metro",
        "Heritage-district 3-star — souk walking",
        "Skip the Marina address on a Budget week"
      ),
      mid: H(
        "Downtown or Marina 4-star. Summer is cheap and brutal.",
        "4-star on the Metro or tram",
        "Palm or Downtown — pick one pocket",
        "Hotel breakfast only when it is in the rate"
      ),
      lux: H(
        "Icon hotel as a weekend, not a week.",
        "Burj / Atlantis / Armani class",
        "Palm or Downtown flagship — one",
        "Desert camp only if leftover covers a night out of the city"
      )
    },
    latam: {
      budget: H(
        "Centro or zona colonial guesthouse. Uber is cheap; tourist-taxi menus are not.",
        "Hostel-plus or 2-star in the walkable centro",
        "Value AI only if this is a beach week",
        "Altitude and street food are the trip in the cities"
      ),
      mid: H(
        "Boutique in the restaurant neighborhood or a 4-star AI on the beach.",
        "Design 3–4 star in the walkable distrito",
        "Iberostar / Hyatt Ziva class if all-inclusive",
        "One base — intercity buses need their own night"
      ),
      lux: H(
        "Casa-hotel or adults-only beach. The tasting menu is often the better Splurge.",
        "Flagship in the centro or beach premium",
        "Relais-style casa leftover",
        "One property"
      )
    },
    city: {
      budget: H(
        "Limited-service on transit. Walk-to-bakery beats a cheap room far from everything.",
        "Hostel-plus or 2-star near a Metro / tram / BRT",
        "Airport hotel only the night you fly",
        "Kitchenette if grocery breakfasts are the plan"
      ),
      mid: H(
        "3–4 star in the walkable core. One room, not a suite.",
        "Neighborhood boutique near restaurants",
        "Brand 4-star on transit",
        "Location over a rooftop you will use twice"
      ),
      lux: H(
        "Flagship in one district. Leftover only.",
        "Design or historic 5-star",
        "Park- or water-adjacent flagship",
        "Do not also buy every paid tour"
      )
    }
  };

  var FOOD_PICKS = {
    disney: F(
      "In-park food is the line that blows Disney budgets. The dining plan is usually a bad buy.",
      [
        "Breakfast: grocery run (Garden Grocer / Winn-Dixie) + resort food court",
        "Lunch: Cosmic Ray’s, Pecos Bill, or Satu’li Canteen — mobile-order QS",
        "Dinner: one more QS, skip table-service on Budget",
        "Snack: Dole Whip or a bakery once, not as a meal plan"
      ],
      [
        "Breakfast: food court most mornings, one hotel buffet if leftover",
        "Lunch: mobile-order QS (Satu’li, Cosmic Ray’s, Columbia Harbour House)",
        "Dinner: one table-service — Sci-Fi Dine-In, 50’s Prime Time, or ‘Ohana",
        "Skip the dining plan; pay as you go"
      ],
      [
        "Breakfast: one character meal (Chef Mickey’s or Tusker House) if leftover",
        "Lunch: QS or a second table-service, not three sit-downs",
        "Dinner reservation: California Grill, Space 220, or Be Our Guest — book before you fly",
        "Dining plan is still usually a bad buy even on Splurge"
      ]
    ),
    cruise: F(
      "The fare includes the dining room. Specialty, drinks, and room-service fees are the trap.",
      [
        "Breakfast / lunch: buffet or dining room — already in the fare",
        "Dinner: main dining room every night on Budget",
        "Drinks: pay-as-you-go; run the break-even before a package",
        "Skip specialty and the café latte habit"
      ],
      [
        "Main dining room most nights — that is the product",
        "One specialty night (Cagney’s / Chops / Teppanyaki class) if leftover covers it",
        "Drink package only after you run the break-even",
        "Room service fees add up — use it as a backup, not breakfast"
      ],
      [
        "Dining room + one or two specialty reservations (Italian / steak / sushi)",
        "Chef’s table or a specialty brunch leftover-only",
        "Unlimited adult drinks + kids soda are in this Splurge plan — still run the math",
        "Specialty is leftover, not a nightly habit"
      ]
    ),
    cancun: F(
      "All-inclusive food is the product. The leak is tips, bottled water you already paid for, and one beach club.",
      [
        "Eat on-property — buffet breakfast and the casual à-la-carte",
        "One downtown taco dinner (Parque de las Palapas) only if transfer is cheap",
        "Skip dock-priced excursion lunches",
        "Coffee included; buy water you already paid for anyway"
      ],
      [
        "On-property breakfast + a better à-la-carte at night",
        "One off-resort dinner in downtown Cancún (La Habichuela or a Hotel Zone steakhouse)",
        "Beach-club lunch is a day-price, not a snack",
        "Premium à-la-carte nights inside the resort are the mid upgrade"
      ],
      [
        "On-property fine dining most nights — that is why you booked AI",
        "One reservation off-property (Puerto Morelos or a named Hotel Zone kitchen)",
        "Cenote-day lunch packed or a pre-booked club, not a dock kiosk",
        "Le Blanc / Zilara specialty rooms leftover-only"
      ]
    ),
    los_angeles: F(
      "LA food is excellent at every price. The overrun is hotel restaurants and a rideshare to dinner across town.",
      [
        "Breakfast: Porto’s or a bakery in the neighborhood you slept in",
        "Lunch: Grand Central Market (DTLA) or a taco truck — Mariscos Jalisco class",
        "Dinner: stay in Koreatown / DTLA / the beach you picked",
        "Santa Monica Pier is a walk, not a meal plan"
      ],
      [
        "Breakfast: Republique counter or a neighborhood café — no hotel restaurant",
        "Lunch: Grand Central Market or Langer’s deli",
        "Dinner: Koreatown BBQ (Quarter / Kang Ho Dong) or Bestia if you booked ahead",
        "One neighborhood per night — do not cross the basin twice"
      ],
      [
        "Breakfast: Republique or Gjusta — reservation or early walk-in",
        "Lunch: n/naka adjacent is Splurge dinner; lunch is still a market or Langer’s",
        "Dinner reservation: Providence, Bestia, or n/naka — book before you fly",
        "Hotel restaurants and a WeHo-to-Santa-Monica dinner are the overrun"
      ]
    ),
    nyc: F(
      "NYC food math is neighborhood choice, not cuisine. Midtown is the expensive version of everything.",
      [
        "Breakfast: bodega egg-and-cheese or a bakery, not the hotel",
        "Lunch: $1–3 slice, Xi’an Famous Foods, or a Chinatown / Flushing plate",
        "Dinner: one real sit-down in the borough you are already in",
        "Skip three $28 Midtown salads"
      ],
      [
        "Breakfast: Russ & Daughters or a neighborhood bakery",
        "Lunch: Katz’s (share) or a slice + a park",
        "Dinner: one reservation — Via Carota wait, Lilia, or a neighborhood Italian",
        "Jackson Heights / Flushing / Chinatown over Midtown"
      ],
      [
        "Breakfast: Balthazar or a good bakery — still skip the hotel dining room",
        "Lunch: a proper sit-down (Grand Central Oyster Bar or a Downtown spot)",
        "Dinner reservation: Carbone, Lilia, or Le Bernardin class — leftover only",
        "One tasting, not a tasting every night"
      ]
    ),
    paris: F(
      "Bakeries and one reserved dinner beat a week of tourist-menu prix fixes.",
      [
        "Breakfast: bakery + coffee on your block (Du Pain et des Idées class if you are in the 10th)",
        "Lunch: Bouillon Chartier, Bouillon Pigalle, or a formule du midi",
        "Dinner: L’As du Fallafel or a neighborhood bistro, not the tower",
        "Skip restaurants on the tower, the hill, and the museum steps"
      ],
      [
        "Breakfast: bakery most mornings",
        "Lunch: Bouillon Julien or a market street (Marché des Enfants Rouges)",
        "Dinner: one reserved bistro (Frenchie wine bar / a 10th–11th table)",
        "Fromagerie + wine is a valid dinner"
      ],
      [
        "Breakfast: bakery, then one café sit-down",
        "Lunch: a proper bistro, not a museum cafeteria",
        "Dinner reservation: Septime, Frenchie, or Le Comptoir — book before you fly",
        "Palace-hotel dining only if leftover is silly"
      ]
    ),
    vegas: F(
      "Strip restaurants price like airports. Walk ten minutes.",
      [
        "Breakfast: hotel coffee + a bakery, or Ellis Island if you are downtown",
        "Lunch: food hall (Park MGM / Cosmo) or an off-Strip plate",
        "Dinner: Chinatown or Downtown, not a Strip steakhouse",
        "Free drinks are not a meal plan"
      ],
      [
        "Breakfast: café off the casino floor",
        "Lunch: food hall or a Center-Strip casual (Tacos El Gordo class)",
        "Dinner: one sit-down (Mon Ami Gabi or a neighborhood spot)",
        "Walk ten minutes off the casino carpet"
      ],
      [
        "Breakfast: still skip the $40 buffet unless it is the point",
        "Lunch: a proper sit-down off-peak",
        "Dinner reservation: a named steakhouse or tasting (Picasso / Guy Savoy class) leftover-only",
        "One splurge, not a steak every night"
      ]
    ),
    san_francisco: F(
      "The overrun is Fisherman’s Wharf menus and a taxi to Napa for dinner.",
      [
        "Breakfast: Tartine or a Mission bakery, not the hotel",
        "Lunch: Ferry Building or a taqueria (La Taqueria / El Farolito class)",
        "Dinner: Mission or Chinatown, stay on BART / Muni",
        "Skip the Wharf seafood rack"
      ],
      [
        "Breakfast: Tartine or a neighborhood café",
        "Lunch: Ferry Building oysters or a Mission burrito",
        "Dinner: one reservation (State Bird, Zuni, or a neighborhood Italian)",
        "Napa is a day trip with a packed lunch, not a dinner transfer"
      ],
      [
        "Breakfast: a good café, still not the hotel dining room",
        "Lunch: Ferry Building or a proper sit-down",
        "Dinner reservation: Atelier Crenn, Benu, or State Bird — leftover only",
        "One tasting, then neighborhood food"
      ]
    ),
    san_diego: F(
      "Gaslamp tourist menus are a tax. Mexican and fish tacos are the local math.",
      [
        "Breakfast: Extraordinary Desserts or a bakery, not Hotel Circle",
        "Lunch: fish tacos in PB or a food truck in Barrio Logan",
        "Dinner: stay in the neighborhood you booked",
        "Skip the harbor dinner cruise menu"
      ],
      [
        "Breakfast: a Little Italy café",
        "Lunch: fish tacos or a Point Loma plate",
        "Dinner: one sit-down in Little Italy or North Park",
        "La Jolla dinner only if you are already there"
      ],
      [
        "Breakfast: café, not a resort buffet",
        "Lunch: still tacos — Splurge does not require a steak at noon",
        "Dinner reservation: Addison (Del Mar) or a waterfront table leftover-only",
        "One splurge"
      ]
    ),
    miami: F(
      "Ocean Drive menus are a tourist tax. Cuban breakfast and a neighborhood dinner win.",
      [
        "Breakfast: Cuban café (Versailles or a ventanita), not Ocean Drive",
        "Lunch: Cuban sandwich or a food hall (Time Out Market)",
        "Dinner: Little Havana or Wynwood, not the hotel",
        "Skip the beach-club bottle service on Budget"
      ],
      [
        "Breakfast: Cuban coffee + toastado",
        "Lunch: Time Out Market or a South Beach casual off Ocean Drive",
        "Dinner: one reservation (Joe’s Stone Crab share, or a Wynwood table)",
        "Brickell if that is where you slept"
      ],
      [
        "Breakfast: still a café",
        "Lunch: a proper sit-down off the sand",
        "Dinner reservation: a named tasting or Joe’s if leftover covers it",
        "One beach-club afternoon is a day-price"
      ]
    ),
    london: F(
      "London food is excellent two Tube stops from the postcard.",
      [
        "Breakfast: Tesco or Pret is a fallback; a bakery is better",
        "Lunch: Borough or Maltby market, or a pub pie",
        "Dinner: Indian or Turkish in Zone 2, not a West End prix fixe",
        "Meal deal is allowed; a tourist-menu roast is not the plan"
      ],
      [
        "Breakfast: bakery or a hotel-included breakfast only if it is in the rate",
        "Lunch: Borough Market or a pub",
        "Dinner: one reservation (Dishoom, a Soho table, or a neighborhood Indian)",
        "West End prix fixe only after theatre, not every night"
      ],
      [
        "Breakfast: a café sit-down once",
        "Lunch: a proper gastropub",
        "Dinner reservation: Core, Kitchen Table, or a Mayfair table leftover-only",
        "£8 pints are already in the luxury math"
      ]
    ),
    rome: F(
      "The closer the monument, the worse the carbonara. Coperto is real — budget it.",
      [
        "Breakfast: cornetto + coffee at the bar, standing",
        "Lunch: supplì or pizza al taglio in Testaccio or Trastevere",
        "Dinner: Trastevere or Testaccio, not Piazza Navona",
        "Skip the restaurant with a photo menu on a square"
      ],
      [
        "Breakfast: bar most mornings",
        "Lunch: a trattoria menù or pizza",
        "Dinner: one reserved trattoria (Roscioli-adjacent or a Testaccio table)",
        "Coperto is a line item, not a scam"
      ],
      [
        "Breakfast: still the bar",
        "Lunch: a proper sit-down away from the pantheon doors",
        "Dinner reservation: La Pergola, Roscioli, or a named tasting leftover-only",
        "One splurge, then trattoria"
      ]
    ),
    tokyo: F(
      "Tokyo can be cheap if you let it. Hotel breakfasts are the expensive path.",
      [
        "Breakfast: convenience-store onigiri + coffee — not a compromise",
        "Lunch: conveyor or standing sushi, or a ramen shop",
        "Dinner: izakaya or a chain gyudon, stay in the ward you booked",
        "Skip the hotel breakfast buffet"
      ],
      [
        "Breakfast: convenience store or a kissaten",
        "Lunch: conveyor sushi or a department-store depachika",
        "Dinner: one reservation (izakaya or a sushi counter you booked)",
        "Rail-station food halls are mid, not a tourist trap"
      ],
      [
        "Breakfast: still konbini most days",
        "Lunch: a proper sit-down",
        "Dinner reservation: a sushi counter or a tasting — book before you land",
        "The room or the counter, rarely both"
      ]
    ),
    oahu: F(
      "Waikiki restaurant rows are mainland prices plus a view surcharge.",
      [
        "Breakfast: grocery the condo or a plate-lunch spot, not resort breakfast every day",
        "Lunch: plate lunch (Rainbow Drive-In / L&L class)",
        "Dinner: stay in Waikiki casual or a food truck",
        "Leonard’s malasadas once, not as a meal"
      ],
      [
        "Breakfast: café or leftover plate lunch",
        "Lunch: plate lunch or poke",
        "Dinner: one sit-down (Marukame or a neighborhood Japanese / seafood)",
        "Skip nightly Kalakaua restaurant rows"
      ],
      [
        "Breakfast: café once, grocery otherwise",
        "Lunch: still poke / plate lunch",
        "Dinner reservation: Alan Wong’s, Senia, or a Halekulani table leftover-only",
        "One splurge, not five fish dinners"
      ]
    ),
    maui: F(
      "Resort restaurants on Maui are a second lodging charge. The condo kitchen is the budget.",
      [
        "Breakfast: grocery the condo",
        "Lunch: food truck in Kihei or Paia",
        "Dinner: cook two nights, one casual fish plate",
        "Skip the resort breakfast buffet"
      ],
      [
        "Breakfast: condo + one café",
        "Lunch: food truck or a plate lunch",
        "Dinner: one fish dinner, not five",
        "Paia or Lahaina casual over the hotel dining room"
      ],
      [
        "Breakfast: condo still wins",
        "Lunch: a sit-down in Wailea only if you are already there",
        "Dinner reservation: Mama’s Fish House or a Wailea table leftover-only",
        "One named reservation, then the kitchen"
      ]
    ),
    punta_cana: F(
      "Punta Cana off-property logistics cost more than the meal.",
      [
        "Stay on-property — that is the product",
        "One beach-shack lunch is enough of a taste",
        "Skip dock-priced excursion food",
        "Coffee included"
      ],
      [
        "On-property breakfast + better à-la-carte at night",
        "One pre-booked off-property dinner if the transfer is in the plan",
        "Premium à-la-carte nights inside the resort are the upgrade",
        "Cap Cana restaurants are a different pocket"
      ],
      [
        "On-property fine dining most nights",
        "One Cap Cana or named tasting leftover",
        "Packed lunch on excursion days",
        "Still not a nightly off-property hop"
      ]
    ),
    jamaica: F(
      "Transfers and “recommended” restaurants are where the AI savings go to die.",
      [
        "Eat on-property most meals",
        "Jerk lunch off-property once, with a trusted driver",
        "Buy rum as a bottle, not a round",
        "Negril casual beats a MoBay hotel restaurant"
      ],
      [
        "On-property + one jerk or seafood lunch in Negril",
        "One off-property dinner with a pre-booked driver",
        "Premium à-la-carte inside the resort",
        "Skip the dock kiosk"
      ],
      [
        "On-property fine dining",
        "One named off-property reservation leftover",
        "Sandals / Couples specialty rooms are the Splurge product",
        "Transfer time is still a cost"
      ]
    ),
    barcelona: F(
      "Tourist paella is the most expensive way to be disappointed.",
      [
        "Breakfast: bakery",
        "Lunch: menú del día",
        "Dinner: vermut + conservas, not a Ramblas paella",
        "Mercado lunch is allowed"
      ],
      [
        "Breakfast: bakery",
        "Lunch: menú del día or a market",
        "Dinner: one seafood dinner in Barceloneta if leftover exists",
        "Eixample or Born, not the Ramblas"
      ],
      [
        "Breakfast: café sit-down once",
        "Lunch: a proper restaurant",
        "Dinner reservation: Disfrutar or a named tasting leftover-only",
        "One splurge"
      ]
    ),
    mexico_city: F(
      "CDMX is where the mid-range food budget feels rich. Spend it on the meal, not the hotel restaurant.",
      [
        "Breakfast: panadería + coffee in Roma",
        "Lunch: mercado or street tacos",
        "Dinner: Condesa or Juárez, not the hotel",
        "Skip Polanco hotel dining on Budget"
      ],
      [
        "Breakfast: café in Roma",
        "Lunch: mercado",
        "Dinner: one reservation (Contramar lunch or a neighborhood table)",
        "Street tacos still win one night"
      ],
      [
        "Breakfast: café",
        "Lunch: Contramar or a proper sit-down",
        "Dinner reservation: Pujol or Quintonil leftover-only",
        "One tasting"
      ]
    ),
    thailand: F(
      "Bangkok and Chiang Mai are the rare destinations where budget food is the good food.",
      [
        "Breakfast: stall coffee + rice soup",
        "Lunch: street stall",
        "Dinner: another stall + mango sticky rice",
        "Hotel breakfast buffets are optional"
      ],
      [
        "Breakfast: stall or a café",
        "Lunch: street stall",
        "Dinner: one riverside or Sukhumvit sit-down",
        "Hotel Italian is the trap"
      ],
      [
        "Breakfast: café once",
        "Lunch: still stalls — Splurge does not require a mall",
        "Dinner reservation: a named riverside or tasting leftover",
        "One splurge"
      ]
    ),
    nola: F(
      "New Orleans is a food trip. Cut the hotel class before you cut the reservations.",
      [
        "Breakfast: café au lait + beignet once (Café du Monde), then a neighborhood spot",
        "Lunch: po’boy (Parkway or a neighborhood shop), not a Bourbon breakfast",
        "Dinner: casual Creole, not a tourist-menu courtyard every night",
        "Skip the hotel restaurant"
      ],
      [
        "Breakfast: neighborhood café",
        "Lunch: po’boy or gumbo",
        "Dinner: one old-school reservation (Galatoire’s or Commander’s Palace class)",
        "Café du Monde once"
      ],
      [
        "Breakfast: café",
        "Lunch: a proper sit-down",
        "Dinner reservation: Commander’s, Galatoire’s, or a modern tasting leftover",
        "Keep the reservations; cut something else"
      ]
    ),
    chicago: F(
      "Downtown hotel restaurants are Chicago priced for people who will not take the L.",
      [
        "Breakfast: doughnut or a diner, not the Mag Mile hotel",
        "Lunch: Italian beef or a tavern",
        "Dinner: neighborhood, not the hotel",
        "One deep-dish if you must, then stop"
      ],
      [
        "Breakfast: café",
        "Lunch: Italian beef or a West Loop casual",
        "Dinner: one reservation in Fulton Market or Logan Square",
        "Skip Mag Mile dining"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: Alinea or a Fulton Market flagship leftover-only",
        "One tasting"
      ]
    ),
    amsterdam: F(
      "Tourist-row restaurants on the main canals are a tax. Two streets over is the actual city.",
      [
        "Breakfast: Albert Heijn most mornings",
        "Lunch: brown café, not a canal-cruise buffet",
        "Dinner: De Pijp or Jordaan casual",
        "Skip the pancake-house on the Damrak"
      ],
      [
        "Breakfast: bakery + Albert Heijn",
        "Lunch: brown café",
        "Dinner: one Indonesian rijsttafel if leftover covers it",
        "Two streets off the canal"
      ],
      [
        "Breakfast: café once",
        "Lunch: a proper sit-down",
        "Dinner reservation: a named tasting or rijsttafel leftover",
        "One splurge"
      ]
    ),
    lisbon: F(
      "Lisbon food is excellent at mid-range prices. The overrun is the miradouro tourist menu.",
      [
        "Breakfast: pastel de nata is a snack, plus coffee",
        "Lunch: tasca in Graça or Campo de Ourique",
        "Dinner: neighborhood, not the viewpoint terrace",
        "Skip every-night seafood"
      ],
      [
        "Breakfast: bakery",
        "Lunch: tasca or a market",
        "Dinner: one seafood dinner in Cais do Sodré or Belém",
        "Not every night"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge"
      ]
    ),
    iceland: F(
      "Reykjavík restaurants price like a capital. The Ring Road only works if you grocery.",
      [
        "Breakfast: Bónus / Krónan",
        "Lunch: packed on road days",
        "Dinner: one fish dinner in 101, cook the rest",
        "Skip the hotel breakfast buffet unless it is included"
      ],
      [
        "Breakfast: grocery + one café",
        "Lunch: packed on road days, sit-down in town",
        "Dinner: one proper 101 fish dinner",
        "Hot-dog stand is allowed"
      ],
      [
        "Breakfast: grocery still wins on road days",
        "Lunch: a sit-down if you are in town",
        "Dinner reservation: a named 101 or a lodge table leftover",
        "Do not eat every meal out on a Ring Road week"
      ]
    ),
    bali: F(
      "Bali is where the budget food band is the good food. Hotel Italian is the trap.",
      [
        "Breakfast: warung coffee + fruit",
        "Lunch: warung",
        "Dinner: warung again",
        "Bintang on the beach is not a $40 cocktail program"
      ],
      [
        "Breakfast: café once",
        "Lunch: warung",
        "Dinner: one nice dinner in Seminyak or Ubud",
        "Hotel Italian is the trap"
      ],
      [
        "Breakfast: café",
        "Lunch: still a warung at noon",
        "Dinner reservation: a named Seminyak or Ubud table leftover",
        "One splurge"
      ]
    ),
    dubai: F(
      "Dubai luxury dining is a weekend splurge. Daily food can stay mid if you leave Downtown.",
      [
        "Breakfast: hotel-included only if it is in the rate",
        "Lunch: Creekside or Deira, not a mall every day",
        "Dinner: cheap eats in Bur Dubai",
        "Skip the fountain-view restaurant on Budget"
      ],
      [
        "Breakfast: café or included buffet",
        "Lunch: a food hall or creekside",
        "Dinner: one destination dinner if leftover is real",
        "Mall food courts are a fallback"
      ],
      [
        "Breakfast: café or buffet",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge weekend, not seven"
      ]
    )
  };

  var FOOD_FALLBACKS = {
    disney: FOOD_PICKS.disney,
    cruise: FOOD_PICKS.cruise,
    ai: F(
      "All-inclusive food is the product. Budget extras for one off-resort night and the bottled water you still tip for.",
      [
        "Buffet breakfast and the casual à-la-carte — already in the package",
        "One beach-town taco or jerk lunch only with a pre-booked ride",
        "Skip dock-priced excursion food",
        "Coffee included"
      ],
      [
        "On-property breakfast + better à-la-carte at night",
        "One off-resort dinner if leftover covers the transfer",
        "Premium in-resort nights are the mid upgrade",
        "Beach-club lunch is a day-price"
      ],
      [
        "On-property fine dining most nights",
        "One named off-property reservation leftover",
        "Specialty rooms leftover-only",
        "Still not a nightly hop"
      ]
    ),
    domestic: F(
      "Grocery or bakery breakfasts, one sit-down dinner, skip hotel restaurants.",
      [
        "Breakfast: bakery, bodega, or grocery",
        "Lunch: market, food hall, or a neighborhood counter",
        "Dinner: casual in the district you booked",
        "Hotel restaurants are the expensive version of the same plate"
      ],
      [
        "Breakfast: café most mornings",
        "Lunch: market or a proper casual",
        "Dinner: one reserved neighborhood table",
        "Stay on transit — a crosstown dinner is a second fare"
      ],
      [
        "Breakfast: café, still not the hotel dining room every day",
        "Lunch: a sit-down",
        "Dinner reservation: one named tasting or flagship leftover-only",
        "One splurge, not a tasting every night"
      ]
    ),
    europe: F(
      "Bakeries, a lunch formule, and one reserved dinner beat tourist-menu prix fixes.",
      [
        "Breakfast: bakery + coffee on your block",
        "Lunch: menú del día / formule / pub / tram-side casual",
        "Dinner: neighborhood trattoria, tasca, or bistro — not the monument square",
        "Grocery one picnic"
      ],
      [
        "Breakfast: bakery",
        "Lunch: market or a lunch menu",
        "Dinner: one reserved bistro",
        "Wine from a shop is a valid dinner"
      ],
      [
        "Breakfast: bakery, then one café sit-down",
        "Lunch: a proper restaurant",
        "Dinner reservation: a named table booked before you fly",
        "Palace-hotel dining leftover-only"
      ]
    ),
    hawaii: F(
      "Resort restaurants are a second lodging charge. Plate lunch and a condo kitchen win.",
      [
        "Breakfast: grocery the condo",
        "Lunch: plate lunch or a food truck",
        "Dinner: cook two nights",
        "Malasadas or shave ice once, not as a meal"
      ],
      [
        "Breakfast: condo + one café",
        "Lunch: plate lunch or poke",
        "Dinner: one fish sit-down",
        "Skip nightly resort rows"
      ],
      [
        "Breakfast: condo still wins",
        "Lunch: poke / plate lunch",
        "Dinner reservation: one named table leftover",
        "Do not stack every fish dinner"
      ]
    ),
    caribbean: F(
      "On-property is the product. Off-property logistics often cost more than the meal.",
      [
        "Eat on-property most meals",
        "One beach-shack lunch",
        "Skip dock kiosks",
        "Coffee included"
      ],
      [
        "On-property + one off-property dinner with a pre-booked ride",
        "Premium à-la-carte nights inside the resort",
        "Packed lunch on excursion days",
        "Transfer is part of the food price"
      ],
      [
        "On-property fine dining",
        "One named off-property reservation leftover",
        "Specialty rooms leftover-only",
        "One island"
      ]
    ),
    mexico: F(
      "Street food and mercados are the good food. Hotel Zone restaurants are a tax.",
      [
        "Breakfast: panadería",
        "Lunch: mercado or tacos",
        "Dinner: neighborhood, not the hotel",
        "AI guests: eat on-property plus one taco night"
      ],
      [
        "Breakfast: café",
        "Lunch: mercado",
        "Dinner: one reservation",
        "Stay in one colonia"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge"
      ]
    ),
    asia: F(
      "Convenience stores, stalls, and one counter dinner. Hotel breakfasts are the expensive path.",
      [
        "Breakfast: convenience store or stall",
        "Lunch: stall, ramen, or a food court",
        "Dinner: izakaya / night market / neighborhood shop",
        "Skip the hotel buffet"
      ],
      [
        "Breakfast: konbini or a café",
        "Lunch: food hall or a proper casual",
        "Dinner: one reservation",
        "Station depachika is mid, not a trap"
      ],
      [
        "Breakfast: still cheap most days",
        "Lunch: a sit-down",
        "Dinner reservation: a counter or tasting booked before you land",
        "The room or the counter, rarely both"
      ]
    ),
    oceania: F(
      "Long-haul already spent the luxury. Daily food can stay mid if you grocery breakfasts.",
      [
        "Breakfast: grocery or a bakery",
        "Lunch: food hall or a counter",
        "Dinner: neighborhood casual",
        "Skip hotel restaurants"
      ],
      [
        "Breakfast: café",
        "Lunch: market or a pub",
        "Dinner: one reservation",
        "One city"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge"
      ]
    ),
    africa: F(
      "Riads and city hotels overcharge for dinner. Eat where locals queue.",
      [
        "Breakfast: included only if it is in the rate, else a bakery",
        "Lunch: street or market",
        "Dinner: neighborhood, not the medina-edge tourist row",
        "Buy water in a shop"
      ],
      [
        "Breakfast: café or included",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Trusted driver if you leave the core"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "Lodge dinners are already priced — do not add a second tasting"
      ]
    ),
    middleeast: F(
      "Mall and fountain-view restaurants are a tax. Heritage districts stay cheaper.",
      [
        "Breakfast: included only if in the rate",
        "Lunch: creekside, souk, or a food hall",
        "Dinner: cheap eats away from the icon",
        "Skip the desert-tour buffet upsell"
      ],
      [
        "Breakfast: café or buffet",
        "Lunch: food hall",
        "Dinner: one destination restaurant",
        "Metro, not a taxi to every meal"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One weekend splurge"
      ]
    ),
    latam: F(
      "Street food and mercados win. Tourist-taxi restaurants are the overrun.",
      [
        "Breakfast: bakery",
        "Lunch: market or a counter",
        "Dinner: neighborhood",
        "AI: on-property plus one local lunch"
      ],
      [
        "Breakfast: café",
        "Lunch: market",
        "Dinner: one reservation",
        "One distrito per night"
      ],
      [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge"
      ]
    ),
    city: F(
      "Grocery or bakery breakfasts, one sit-down dinner, skip hotel restaurants.",
      [
        "Breakfast: bakery or grocery",
        "Lunch: market or food hall",
        "Dinner: casual in the district you booked",
        "Transit card beats taxis to dinner"
      ],
      [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reserved table",
        "Stay in one neighborhood"
      ],
      [
        "Breakfast: café, not the hotel every day",
        "Lunch: a sit-down",
        "Dinner reservation: one named leftover",
        "One splurge"
      ]
    )
  };

  var ACTIVITIES = {
    disney: A(
      [
        "Magic Kingdom + one cheaper park — no Park Hopper (ticketed)",
        "Skip Lightning Lane; rope drop + mobile order (free tactic)",
        "Resort-hop Skyliner / bus after 4pm (free)",
        "Disney Springs evening, not a third park day (free)"
      ],
      [
        "Two parks that match the party — Hopper only if you will switch midday (ticketed)",
        "Lightning Lane on Magic Kingdom or Hollywood Studios day only (ticketed)",
        "One Disney Springs or resort-hop evening (free)",
        "Skip a water-park add-on unless leftover is real (ticketed)"
      ],
      [
        "Park Hopper + Lightning Lane Multi Pass (ticketed)",
        "Early theme-park entry from Deluxe (included with that lodging)",
        "Signature dinner + fireworks viewing leftover-only (ticketed)",
        "Memory Maker / PhotoPass is in Splurge only if leftover covers it (ticketed)"
      ]
    ),
    cruise: A(
      [
        "Sea days are the product — walk the deck, skip the spa menu (free)",
        "One independent port walk, not a dock kiosk (free / cheap)",
        "Skip the drink package until you run the break-even (link in the drinks tip)",
        "Ship shows and the pool — already in the fare (free)"
      ],
      [
        "One ship excursion + one independent port day (ticketed / free)",
        "Drink package only after the break-even math (optional)",
        "Snorkel or beach-break on one island, not three (ticketed)",
        "Skip the third dock tour — that is the overrun (ticketed)"
      ],
      [
        "Two ship excursions if leftover covers the “we wait for you” insurance (ticketed)",
        "Drink package is in this Splurge plan — still run the math (optional)",
        "A quieter private beach or small-group tour on one island (tour)",
        "Spa or specialty night leftover-only — already its own line"
      ]
    ),
    los_angeles: A(
      [
        "Getty Center — reservation, free entry, pay parking or Metro (free / cheap)",
        "Griffith Observatory + Hollywood sign viewpoint (free)",
        "Venice / Santa Monica beach day — stay west if you slept west (free)",
        "Disneyland is Anaheim, not this lodging — a separate ticketed day trip"
      ],
      [
        "Universal Studios or a studio tour — pick one ticketed day (ticketed)",
        "Getty or Griffith on the other day (free)",
        "One beach day in the neighborhood you booked (free)",
        "Disneyland = Anaheim day trip with its own ticket and lodging math"
      ],
      [
        "Universal with Express / a VIP studio tour leftover-only (ticketed)",
        "Getty + a private or small-group architecture walk (free / tour)",
        "Beach club or a coastal dinner you already reserved (ticketed)",
        "Do not stack Universal, Disneyland, and a beach day in 5 nights"
      ]
    ),
    nyc: A(
      [
        "Walk the High Line + a neighborhood (free)",
        "Staten Island Ferry for the skyline — skip a paid harbor loop (free)",
        "One museum with pay-what-you-wish or a timed free night (ticketed / cheap)",
        "Times Square is a pass-through, not a day"
      ],
      [
        "One iconic ticket — Summit, Ellis, or a Broadway lottery/rush (ticketed)",
        "Neighborhood walk: Brooklyn Heights + Dumbo, or the Village (free)",
        "Met or MoMA — pick one (ticketed)",
        "Central Park is free; a carriage is not required"
      ],
      [
        "Broadway reserved seat + one observatory (ticketed)",
        "A second museum or a guided food walk leftover (ticketed / tour)",
        "Neighborhood walk still — Splurge does not cancel the street (free)",
        "Skip stacking three observatories"
      ]
    ),
    paris: A(
      [
        "Île de la Cité + Left Bank walk — Notre-Dame exterior, Seine (free)",
        "Père Lachaise or Canal Saint-Martin walk (free)",
        "One museum: Orsay or a smaller one, not a four-museum day (ticketed)",
        "Eiffel Tower from Trocadéro or Champ de Mars, not the summit on Budget (free)"
      ],
      [
        "Louvre or Orsay — pick one timed ticket (ticketed)",
        "Sainte-Chapelle or a tower summit — pick one (ticketed)",
        "Marais or Latin Quarter neighborhood walk (free)",
        "Skip restaurants on the tower steps"
      ],
      [
        "Louvre timed + a second museum or Versailles half-day (ticketed)",
        "Eiffel summit or a Seine dinner cruise leftover-only (ticketed)",
        "A neighborhood walk still earns its morning (free)",
        "Catacombs or a reserved Sainte-Chapelle concert leftover (ticketed)"
      ]
    ),
    vegas: A(
      [
        "Fountains, Bellagio conservatory, and a Fremont walk (free)",
        "One cheap daytime ticket if leftover — High Roller off-peak (ticketed)",
        "Skip a nightclub table on Budget",
        "Walk the Center-Strip; the monorail is a backup"
      ],
      [
        "One show (O, a mid-room, or a production) (ticketed)",
        "One daytime ticket — High Roller, a museum, or Red Rock if you have a car (ticketed / free)",
        "Fountains + Fremont still (free)",
        "Club table is Splurge, not mid"
      ],
      [
        "A reserved Cirque or a flagship residency (ticketed)",
        "A helicopter or Grand Canyon day leftover-only (tour)",
        "One spa or pool-day cabana leftover (ticketed)",
        "Still walk the Strip once at dusk (free)"
      ]
    ),
    san_francisco: A(
      [
        "Golden Gate Bridge walk or Crissy Field (free)",
        "Ferry Building + Embarcadero (free)",
        "A neighborhood walk: Mission murals or Chinatown (free)",
        "Skip the paid cable-car loop if a bus reaches the same hill"
      ],
      [
        "Alcatraz timed ferry — book ahead (ticketed)",
        "Golden Gate + a neighborhood walk (free)",
        "One museum: SFMOMA or de Young (ticketed)",
        "Napa is a day trip with a packed lunch, not a second hotel"
      ],
      [
        "Alcatraz + a second ticketed thing leftover (ticketed)",
        "A Muir Woods or Napa small-group tour (tour)",
        "One neighborhood walk still (free)",
        "Do not stack Alcatraz, Napa, and Yosemite in 5 nights"
      ]
    ),
    san_diego: A(
      [
        "Balboa Park gardens + a free museum day if the calendar lines up (free / ticketed)",
        "Harbor walk or Coronado ferry (cheap)",
        "One beach day in the town you booked (free)",
        "Skip SeaWorld on Budget unless that is the trip"
      ],
      [
        "Zoo or USS Midway — pick one (ticketed)",
        "Balboa Park + a beach day (free / ticketed)",
        "Coronado ferry walk (cheap)",
        "La Jolla cove snorkel if you are already north (cheap / ticketed)"
      ],
      [
        "Safari Park or a second ticketed day leftover (ticketed)",
        "Zoo + Midway is a stack — only if leftover covers both",
        "A coastal walk still (free)",
        "Mexico day trip is a different budget"
      ]
    ),
    miami: A(
      [
        "Beach day in the town you booked (free)",
        "Wynwood Walls from the sidewalk; skip a bottle-service club (free / cheap)",
        "Little Havana walk + Cuban coffee (cheap)",
        "Everglades is a half-day tour, not a Budget default"
      ],
      [
        "Beach + one ticketed — Vizcaya or a boat (ticketed)",
        "Wynwood + Little Havana neighborhood time (free / cheap)",
        "Art Deco walk on Ocean Drive in daylight (free)",
        "Everglades airboat only if leftover covers a half day (tour)"
      ],
      [
        "A reserved boat or a named museum day (ticketed / tour)",
        "Beach-club afternoon is a day-price (ticketed)",
        "Vizcaya + a neighborhood walk (ticketed / free)",
        "Do not stack a cruise embarkation into this stay without a buffer night"
      ]
    ),
    london: A(
      [
        "South Bank walk: London Eye exterior, Tate Modern turbine hall (free)",
        "A national museum — British Museum or National Gallery (free)",
        "One neighborhood: Columbia Road or a market (free / cheap)",
        "Skip a paid Eye ticket on Budget"
      ],
      [
        "One paid iconic — Tower, Eye, or a West End rush (ticketed)",
        "One free museum (free)",
        "Neighborhood walk: Greenwich or Columbia Road (free / cheap)",
        "Congestion Charge does not apply if you never rent a car"
      ],
      [
        "West End reserved seat + one iconic ticket (ticketed)",
        "A second museum or a day trip (Windsor / Bath) leftover (ticketed / tour)",
        "A neighborhood walk still (free)",
        "Do not stack three paid towers"
      ]
    ),
    rome: A(
      [
        "Centro walk: Pantheon exterior, Piazza Navona, Trevi as a pass-through (free)",
        "Trastevere evening walk (free)",
        "One ticketed — Colosseum or Borghese, not both on Budget (ticketed)",
        "Skip the golf-cart forum tour"
      ],
      [
        "Colosseum + Forum timed ticket (ticketed)",
        "One neighborhood walk: Testaccio or Trastevere (free)",
        "Vatican Museums or Borghese — pick one (ticketed)",
        "Fountains at dusk are free"
      ],
      [
        "Colosseum + Vatican timed, on different days (ticketed)",
        "A small-group catacombs or food walk leftover (tour)",
        "A neighborhood morning still (free)",
        "Do not stack three ticketed interiors in one day"
      ]
    ),
    tokyo: A(
      [
        "Neighborhood walk: Yanaka or Shimokitazawa (free)",
        "Senso-ji and the river — Asakusa (free)",
        "One observation deck off-peak or skip it (ticketed / free)",
        "Convenience-store picnic in a park (cheap)"
      ],
      [
        "One ticketed — teamLab, a tower, or a museum (ticketed)",
        "Shibuya / Shinjuku night walk (free)",
        "A neighborhood morning in Yanaka or Kichijoji (free)",
        "Day trip to Kamakura or Nikko only if leftover covers the JR math (ticketed)"
      ],
      [
        "teamLab or a reserved cultural show + a tower (ticketed)",
        "A guided food walk leftover (tour)",
        "A neighborhood walk still (free)",
        "Kyoto is a different trip — do not fake it as a Tokyo day"
      ]
    ),
    oahu: A(
      [
        "Waikiki Beach + a bus to Diamond Head or the lookout (cheap / ticketed)",
        "Grocery picnic at Kapiolani Park (free)",
        "Pearl Harbor is ticketed and somber — one morning, not a beach day",
        "Skip a circle-island tour on Budget; the bus is slower and cheaper"
      ],
      [
        "Hanauma Bay or a snorkel day — reserve Hanauma (ticketed)",
        "One beach that is not Waikiki (Lanikai lookout + Kailua) (free / car)",
        "Pearl Harbor or Diamond Head — pick one ticketed morning",
        "North Shore is a car day, not a Waikiki walk"
      ],
      [
        "A small-group snorkel or a sunrise hike leftover (tour)",
        "Hanauma or a boat leftover, not both (ticketed)",
        "A second beach day still (free)",
        "Do not stack a neighbor-island hop into 5 nights without a second fare"
      ]
    ),
    maui: A(
      [
        "The beach in front of the condo — that is the product (free)",
        "Grocery picnic and a snorkel from shore (cheap)",
        "Skip Road to Hana as a rushed day on Budget",
        "Watch sunrise from the parking lot you already paid, not a tour van"
      ],
      [
        "One snorkel from shore or a cheap boat (ticketed / cheap)",
        "Road to Hana only if you start early and do not treat it as a beach day (car)",
        "Haleakalā sunrise is ticketed and a 2 a.m. wake-up — pick it on purpose",
        "A second beach day still (free)"
      ],
      [
        "A reserved boat (Molokini) leftover-only (tour)",
        "Haleakalā sunrise reservation + a quiet afternoon (ticketed)",
        "One beach day with no itinerary (free)",
        "Do not stack Hana, Haleakalā, and a boat in 4 days"
      ]
    ),
    cancun: A(
      [
        "Beach in front of the resort — that is the product (free / included)",
        "One downtown or Hotel Zone walk, not a timeshare day (free)",
        "Skip the dock-priced catamaran on Budget",
        "Snorkel from the property if the reef is there (included / cheap)"
      ],
      [
        "One ticketed day — Isla Mujeres ferry or a cenote (ticketed / ferry)",
        "Beach days for the rest (included)",
        "Chichén Itzá is a long day; only if leftover covers a trusted tour (tour)",
        "Skip a second dock kiosk"
      ],
      [
        "A small-group ruin or whale-shark season tour leftover (tour)",
        "Isla Mujeres or a better boat, not both (ticketed)",
        "Beach still wins most days (included)",
        "Tulum ruins + beach is a different lodging math"
      ]
    )
  };

  var ACTIVITY_FALLBACKS = {
    disney: ACTIVITIES.disney,
    cruise: ACTIVITIES.cruise,
    ai: A(
      [
        "Beach and the property — that is the product (included)",
        "One town walk with a pre-booked ride, not a timeshare day (cheap)",
        "Skip the dock-priced catamaran on Budget",
        "Snorkel from the property if it exists (included / cheap)"
      ],
      [
        "One ticketed day — ferry, ruin, or a reef (ticketed / tour)",
        "Beach days for the rest (included)",
        "A second dock tour is the overrun",
        "Nightlife on-property first"
      ],
      [
        "A small-group tour leftover (tour)",
        "One better boat or ruin day, not three (ticketed)",
        "Beach still wins most days (included)",
        "Spa leftover-only"
      ]
    ),
    domestic: A(
      [
        "One iconic exterior + a neighborhood walk (free)",
        "A free museum night or a park (free / cheap)",
        "Skip a hop-on bus on Budget",
        "Transit day pass beats a rideshare loop"
      ],
      [
        "One ticketed iconic (ticketed)",
        "One neighborhood walk (free)",
        "A second cheap / free morning (free)",
        "Day trips need their own lunch and transfer"
      ],
      [
        "A reserved show or a guided tour leftover (ticketed / tour)",
        "One iconic ticket (ticketed)",
        "A neighborhood walk still (free)",
        "Do not stack three paid towers"
      ]
    ),
    europe: A(
      [
        "Old-city walk + a viewpoint that is free from the street (free)",
        "One museum, not four (ticketed / free national)",
        "A neighborhood that is not the postcard square (free)",
        "Skip the hop-on bus"
      ],
      [
        "One timed iconic (ticketed)",
        "One neighborhood walk (free)",
        "A second museum or a garden (ticketed / free)",
        "Day trip only if leftover covers the train"
      ],
      [
        "Two timed interiors on different days (ticketed)",
        "A small-group walk leftover (tour)",
        "A neighborhood morning still (free)",
        "Do not stack a palace, a catacomb, and a dinner cruise in one day"
      ]
    ),
    hawaii: A(
      [
        "The beach in front of the room (free)",
        "A lookout or a short hike on the bus or a cheap parking lot (cheap)",
        "Grocery picnic (cheap)",
        "Skip the circle-island van on Budget"
      ],
      [
        "One snorkel or a ticketed bay (ticketed)",
        "One other beach (free)",
        "A scenic drive only if you already have the car (car)",
        "Sunrise tickets are a 2 a.m. choice — pick on purpose"
      ],
      [
        "A reserved boat leftover (tour)",
        "One ticketed sunrise or bay, not both (ticketed)",
        "A beach day with no itinerary (free)",
        "Neighbor-island hops are a second fare"
      ]
    ),
    caribbean: A(
      [
        "Beach and the property (included / free)",
        "A town walk, not a timeshare day (cheap)",
        "Skip the first dock kiosk",
        "Snorkel from shore if the reef is there (cheap)"
      ],
      [
        "One boat or ruin day (ticketed / tour)",
        "Beach for the rest (included)",
        "A second tour is the overrun",
        "Nightlife on-property first"
      ],
      [
        "A small-group boat or ruin leftover (tour)",
        "One better day, not three (ticketed)",
        "Beach still wins (included)",
        "Spa leftover-only"
      ]
    ),
    mexico: A(
      [
        "Centro or beach walk (free)",
        "A mercado morning (free / cheap)",
        "One museum if the city has a great free or cheap one (ticketed / cheap)",
        "Skip timeshare-day tours"
      ],
      [
        "One ruin, museum, or ferry day (ticketed / tour)",
        "A neighborhood walk (free)",
        "Beach or centro for the rest",
        "Long ruin days need a trusted driver"
      ],
      [
        "A small-group ruin or tasting leftover (tour)",
        "One ticketed extra (ticketed)",
        "A neighborhood morning still (free)",
        "Do not stack two ruin days and a beach club"
      ]
    ),
    asia: A(
      [
        "A temple / shrine / old-city walk (free / cheap)",
        "A neighborhood that is not the first postcard (free)",
        "One paid deck or museum off-peak (ticketed)",
        "Convenience-store picnic in a park (cheap)"
      ],
      [
        "One ticketed — museum, deck, or digital show (ticketed)",
        "A night market or neighborhood walk (free)",
        "A short rail day trip only if leftover covers it (ticketed)",
        "Skip a five-temple checklist"
      ],
      [
        "A reserved show or a guided food walk leftover (ticketed / tour)",
        "One ticketed iconic (ticketed)",
        "A neighborhood morning still (free)",
        "A second city is a different trip"
      ]
    ),
    oceania: A(
      [
        "Harbor or trail walk (free)",
        "A city lookout that is free from the street (free)",
        "One cheap ferry if that is the postcard (cheap)",
        "Skip every adventure add-on on Budget"
      ],
      [
        "One ticketed iconic or a short hike with a shuttle (ticketed)",
        "A harbor walk (free)",
        "A day trip only if leftover covers it (tour / car)",
        "Wildlife tours are mid, not automatic"
      ],
      [
        "A reserved boat, scenic flight, or lodge activity leftover (tour)",
        "One ticketed iconic (ticketed)",
        "A free walk still (free)",
        "Do not stack every adventure"
      ]
    ),
    africa: A(
      [
        "Medina or waterfront walk with a plan to ignore touts (free / cheap)",
        "One museum or viewpoint (ticketed / cheap)",
        "Skip a safari-priced day if this is a city week",
        "Trusted driver > random taxis for longer hops"
      ],
      [
        "One guided half-day (tour)",
        "A neighborhood walk (free)",
        "A second cheap morning (free / cheap)",
        "Safari is a different lodging line"
      ],
      [
        "A lodge game drive or a private guide leftover (tour)",
        "One city ticketed extra (ticketed)",
        "A walk still (free)",
        "Do not double-pay optional lodge extras"
      ]
    ),
    middleeast: A(
      [
        "Heritage district or souk walk (free / cheap)",
        "A mosque or museum with a modest ticket (ticketed / cheap)",
        "Skip the desert-tour upsell on day one",
        "Metro to the icon, photograph from the street first"
      ],
      [
        "One desert or boat day (tour)",
        "One icon ticket (ticketed)",
        "A souk morning (free)",
        "Summer midday is indoor on purpose"
      ],
      [
        "A private desert or a named icon leftover (tour / ticketed)",
        "One extra ticketed (ticketed)",
        "A heritage walk still (free)",
        "Luxury is a weekend of activities, not seven paid tours"
      ]
    ),
    latam: A(
      [
        "Centro / colonial walk (free)",
        "A viewpoint or beach that is free from the street (free)",
        "One cheap museum or a mercado (cheap)",
        "Skip the tourist-taxi loop"
      ],
      [
        "One ticketed — ruin, museum, or a boat (ticketed / tour)",
        "A neighborhood walk (free)",
        "Altitude days need slack, not a second tour",
        "Trusted driver for longer hops"
      ],
      [
        "A small-group ruin or tasting leftover (tour)",
        "One extra ticketed (ticketed)",
        "A walk still (free)",
        "Do not stack two long tours and a late dinner"
      ]
    ),
    city: A(
      [
        "A neighborhood walk + one free viewpoint (free)",
        "A park or a free museum night (free / cheap)",
        "Skip the hop-on bus",
        "Transit pass beats a taxi loop"
      ],
      [
        "One ticketed iconic (ticketed)",
        "One neighborhood walk (free)",
        "A second cheap morning (free)",
        "Day trips need lunch and a transfer"
      ],
      [
        "A reserved show or guided walk leftover (ticketed / tour)",
        "One iconic ticket (ticketed)",
        "A neighborhood walk still (free)",
        "Do not stack three paid towers"
      ]
    )
  };

  // Airline *patterns* by origin hub. No flight numbers, no invented schedules.
  var ORIGIN_HUBS = {
    atl: { city: "Atlanta", carrier: "Delta", tip: "ATL is a Delta fortress. Caribbean and Europe nonstops are the default; Asia and Hawaii usually connect." },
    dfw: { city: "Dallas/Fort Worth", carrier: "American", tip: "American's largest hub. Strong Mexico, Caribbean, and domestic nonstops." },
    iah: { city: "Houston", carrier: "United", tip: "United hub with a real Latin America network. Caribbean often one-stop." },
    ord: { city: "Chicago", carrier: "United / American", tip: "Two-hub city. Europe and domestic are easy; Caribbean is often a connect." },
    jfk: { city: "New York", carrier: "Delta / JetBlue / international", tip: "JFK is the long-haul door. Domestic leisure often prices better from EWR or LGA." },
    ewr: { city: "Newark", carrier: "United", tip: "United's transatlantic and Caribbean hub. Compare JFK on the same dates." },
    lga: { city: "New York (LaGuardia)", carrier: "Delta / American", tip: "Domestic and short-haul only. International means JFK or EWR." },
    bos: { city: "Boston", carrier: "JetBlue / Delta", tip: "Strong transatlantic and Caribbean leisure. Midweek usually beats Sunday." },
    mia: { city: "Miami", carrier: "American", tip: "American's Latin America door. Caribbean and South America nonstops are the point of MIA." },
    fll: { city: "Fort Lauderdale", carrier: "JetBlue / Spirit", tip: "Leisure Caribbean and domestic ULCC base. Good when you can skip a checked bag." },
    mco: { city: "Orlando", carrier: "mixed / Southwest", tip: "Domestic leisure fortress. International usually connects; driving to a cruise port often wins." },
    tpa: { city: "Tampa", carrier: "mixed", tip: "Solid Caribbean and domestic. Cruise-port proximity matters more than the airline." },
    clt: { city: "Charlotte", carrier: "American", tip: "American hub. East Coast and Caribbean connects are the pattern." },
    dtw: { city: "Detroit", carrier: "Delta", tip: "Delta hub. Europe nonstops exist; leisure Caribbean is often via ATL." },
    msp: { city: "Minneapolis", carrier: "Delta", tip: "Delta hub. Winter sun destinations usually connect in ATL or SLC." },
    den: { city: "Denver", carrier: "United / Southwest", tip: "United + Southwest. Mexico and mountain-west are easy; Europe often one-stop." },
    phx: { city: "Phoenix", carrier: "American / Southwest", tip: "American + Southwest. Mexico and California are the value nonstops." },
    las: { city: "Las Vegas", carrier: "mixed / Spirit", tip: "Everywhere-from-Vegas leisure. Red-eyes and midweek are the cheap pattern." },
    lax: { city: "Los Angeles", carrier: "mixed / Delta / American / United", tip: "The Pacific door. Hawaii, Asia, and Oceania nonstops; Europe is competitive but long." },
    sfo: { city: "San Francisco", carrier: "United", tip: "United transpacific hub. Asia and Oceania are the reason to fly SFO, not a cheap domestic hop." },
    sea: { city: "Seattle", carrier: "Alaska / Delta", tip: "Alaska + Delta. Hawaii and Asia one-stops; Europe via a coastal hub." },
    pdx: { city: "Portland", carrier: "Alaska", tip: "Alaska network. Most long-haul connects in SEA or SFO." },
    san: { city: "San Diego", carrier: "Southwest / Alaska", tip: "Leisure domestic and Mexico. Long-haul usually via LAX." },
    slc: { city: "Salt Lake City", carrier: "Delta", tip: "Delta hub. Mountain-west connecting city — useful, rarely the cheapest origin." },
    aus: { city: "Austin", carrier: "Southwest / American / Delta", tip: "Growing leisure city. Mexico and coasts are easy; Europe usually one-stop." },
    msy: { city: "New Orleans", carrier: "Southwest / mixed", tip: "Domestic leisure. Caribbean and Mexico often via IAH or ATL." },
    bna: { city: "Nashville", carrier: "Southwest / mixed", tip: "Domestic leisure. Florida and coasts are the cheap nonstops." },
    iad: { city: "Washington Dulles", carrier: "United", tip: "United transatlantic. Compare DCA for domestic and BWI for Southwest." },
    dca: { city: "Washington Reagan", carrier: "American / Delta", tip: "Perimeter-rule domestic. International means IAD or BWI." },
    bwi: { city: "Baltimore", carrier: "Southwest", tip: "Southwest leisure door for the Mid-Atlantic. International usually one-stop." },
    phl: { city: "Philadelphia", carrier: "American", tip: "American transatlantic and Caribbean. Compare EWR on the same week." },
    rdu: { city: "Raleigh-Durham", carrier: "mixed / Delta", tip: "Growing leisure. Florida and Northeast nonstops; most else connects." },
    hnl: { city: "Honolulu", carrier: "Hawaiian / Alaska", tip: "You are already in Hawaii. Neighbor-island hops are a separate fare." },
    driving: { city: "Driving", carrier: "", tip: "No airfare. Budget fuel, wear, and a possible night on the road — not just the gas receipt." }
  };

  var REGION_AIR = {
    domestic: "Book about 3–5 weeks out. Tuesday/Wednesday departures usually beat Friday and Sunday. One carry-on beats a 'cheap' fare with two bag fees.",
    caribbean: "Southeast and Texas origins see the most nonstops. Shoulder weeks (early May, early December) cut both the hotel band and the airfare.",
    hawaii: "West Coast origins win. Red-eyes and midweek. A neighbor-island hop is a second ticket — do not assume it is in the Honolulu fare.",
    europe: "Book about 2–4 months out. Open-jaw (in one city, out another) often beats two one-ways. Midweek Atlantic crossings.",
    latam: "MIA, IAH, DFW, and ATL are the doors. Shoulder months matter more than the airline brand.",
    asia: "One-stop via SFO, LAX, SEA, or ORD is the usual pattern from the East. Avoid Golden Week and peak cherry-blossom weeks unless that is the point.",
    oceania: "Long-haul via the West Coast or a Pacific stop. This is a 2–6 month booking, not a 3-week one.",
    africa: "Usually one European or Middle East connect. Price the whole door-to-door, not the cheap first segment.",
    middleeast: "JFK, IAD, IAH, and ORD have the most one-stop patterns. Summer is cheap and extremely hot."
  };

  var DESTINATIONS = buildCatalog();

  global.VM_PLAN_DATA = {
    MONTH_NAMES: MONTH_NAMES,
    SEASON: SEASON,
    SEASON_KEYS: SEASON_KEYS,
    REGION_ORDER: REGION_ORDER,
    AI_ID_MAP: AI_ID_MAP,
    POPULAR: POPULAR,
    LODGING_TAX: LODGING_TAX,
    LODGING_TAX_BY_ID: LODGING_TAX_BY_ID,
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
    HOTEL_EXAMPLES: HOTEL_EXAMPLES,
    HOTEL_FALLBACKS: HOTEL_FALLBACKS,
    FOOD_PICKS: FOOD_PICKS,
    FOOD_FALLBACKS: FOOD_FALLBACKS,
    ACTIVITIES: ACTIVITIES,
    ACTIVITY_FALLBACKS: ACTIVITY_FALLBACKS,
    ORIGIN_HUBS: ORIGIN_HUBS,
    REGION_AIR: REGION_AIR,
    buildCatalog: buildCatalog,
    lodgingTaxFor: lodgingTaxFor,
    refreshCatalog: function () {
      DESTINATIONS = buildCatalog();
      global.VM_PLAN_DATA.DESTINATIONS = DESTINATIONS;
      return DESTINATIONS;
    }
  };
})(typeof window !== "undefined" ? window : this);
