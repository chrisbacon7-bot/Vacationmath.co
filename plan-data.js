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

  // Example property *classes* (and a few well-known names) by destination + style.
  // Not an inventory and not a ranking — orientation for the style the visitor picked.
  var HOTEL_EXAMPLES = {
    disney: {
      budget: ["All-Star / Pop Century / Art of Animation (value)", "Off-property Disney Springs area hotel"],
      mid: ["Caribbean Beach, Coronado Springs, or Port Orleans (moderate)", "One room, walk/bus to the parks"],
      lux: ["Grand Floridian, Contemporary, or Polynesian (deluxe)", "Deluxe villa only if leftover covers the jump"]
    },
    cruise: {
      budget: ["Carnival or MSC interior cabin", "Guarantee cabin if you can live without a window"],
      mid: ["Royal Caribbean balcony on a 7-night Caribbean", "Central-ship balcony beats a cheap aft if you get seasick"],
      lux: ["NCL Haven / suite, or a Princess Plus-style fare", "Suite gratuities run higher — price them as their own line"]
    },
    cancun: {
      budget: ["Riu, Oasis, or Krystal Grand class", "Hotel zone, all-inclusive, no ocean-view upsell"],
      mid: ["Hyatt Ziva, Moon Palace, or Hard Rock Cancún class", "Family-friendly; watch the airport-transfer add-on"],
      lux: ["Hyatt Zilara / Secrets The Vine class", "Adults-only; Le Blanc only if the leftover is real"]
    },
    punta_cana: {
      budget: ["Riu or Bávaro Princess class", "Punta Cana is the value AI — do not pay Cancún prices here"],
      mid: ["Hard Rock Punta Cana or Iberostar Selection class", "Cap Cana is a different, pricier pocket"],
      lux: ["Excellence or Secrets Cap Cana class", "Eden Roc / Sanctuary only as a stretch"]
    },
    jamaica: {
      budget: ["Riu Negril or Holiday Inn Resort class", "Montego Bay is the flight; Negril is the beach"],
      mid: ["Iberostar Rose Hall or Moon Palace Jamaica class", "Transfer time is the hidden cost"],
      lux: ["Sandals / Couples / Secrets class", "Adults-only pricing assumes no kids"]
    },
    nyc: {
      budget: ["Outer-borough or Midtown west limited-service (Pod / citizenM class)", "Skip Times Square unless you like paying for the address"],
      mid: ["3-4 star Midtown or Downtown (Ace / The Beekman neighborhood class)", "Subway access beats a fancy lobby"],
      lux: ["Upper East / Downtown flagship (public-hotel or 1 Hotel class)", "Resort fees in NYC are not optional — add ~$40–60/night"]
    },
    paris: {
      budget: ["Ibis / Hotel F1 class on a Metro line (10th–19th)", "Gare du Nord walk-ups if you land early"],
      mid: ["3-star Left Bank or Canal Saint-Martin (Malte / Odeon class)", "Arrondissement 5–6 or 10–11, not the tower block"],
      lux: ["Palace or design hotel (Crillon / Cheval Blanc class)", "Only if leftover covers it — Paris mid already eats a budget"]
    },
    tokyo: {
      budget: ["Business hotel in Shinjuku or Ueno (APA / Super Hotel class)", "Capsule only if you packed light"],
      mid: ["3-4 star Shibuya / Ginza / Tokyo Station (Mitsui Garden class)", "Rail pass is usually a bad buy on a 5-night city trip"],
      lux: ["Flagship in Ginza or Marunouchi (Aman / Mandarin Oriental class)", "Tokyo luxury is the room + the sushi counter, not both"]
    },
    vegas: {
      budget: ["Off-Strip or downtown (Ellis Island / Circa-adjacent class)", "Resort fees apply even on a $40 Tuesday"],
      mid: ["Center-Strip 3-4 star (Park MGM / New York-New York class)", "Walk the Strip; skip the resort-fee spa credit math"],
      lux: ["Bellagio / Wynn / Venetian class", "Weekends and holidays double the midweek rate"]
    },
    los_angeles: {
      budget: ["Koreatown or Downtown limited-service (Freehand / HI Los Angeles class)", "Metro or one rideshare zone — a cheap Valley room is a $40 Uber habit"],
      mid: ["Downtown Ace / Proper class, or Santa Monica 3-star (Shore Hotel class)", "Pick one neighborhood. Hotel parking is $40–60/night if you rent a car"],
      lux: ["Santa Monica Proper / 1 Hotel West Hollywood class", "Beach or WeHo, not both. Disneyland is Anaheim — a separate day trip"]
    },
    oahu: {
      budget: ["Waikiki limited-service (Aqua / Shoreline class)", "No car if you stay on the Waikiki bus grid"],
      mid: ["Waikiki 3-4 star (Outrigger / Hilton Hawaiian Village class)", "Parking is a line item — $40–55/night"],
      lux: ["Kahala or Ko Olina class", "A rental car becomes mandatory once you leave Waikiki"]
    },
    maui: {
      budget: ["Kihei / South Maui condo (Aston class)", "Condos beat hotels if you will grocery"],
      mid: ["Kaanapali 3-4 star (Sheraton / Westin Maui class)", "Resort fees + parking will show up"],
      lux: ["Wailea (Grand Wailea / Andaz / Four Seasons class)", "Maui luxury is the room. Do not also buy every excursion"]
    },
    rome: {
      budget: ["Trastevere or Termini 2-star / guesthouse", "Termini is louder; Trastevere is the walk"],
      mid: ["3-star Centro Storico or Prati", "Walk-to-pantheon is the product, not a rooftop pool"],
      lux: ["Hassler / Kamea / Hotel de Russie class", "Rome mid + one nice dinner beats a palace room"]
    },
    london: {
      budget: ["Zone 1–2 Premier Inn / Travelodge class", "Tube + Tesco meal deal is the budget plan"],
      mid: ["3-4 star South Bank, Bloomsbury, or Kensington", "The Congestion Charge does not apply if you never rent a car"],
      lux: ["Mayfair / Covent Garden flagship", "London luxury is the room rate plus £8 pints"]
    },
    barcelona: {
      budget: ["Eixample or El Born hostel / 2-star", "Las Ramblas hotels are a tourist tax"],
      mid: ["3-4 star Eixample or Barceloneta-adjacent", "Metro, not taxis"],
      lux: ["W Barcelona / Mandarin Oriental class", "Beach-club pricing is not in the room rate"]
    },
    mexico_city: {
      budget: ["Roma Norte / Condesa guesthouse", "Uber is cheap; the Metro is cheaper"],
      mid: ["3-4 star Roma / Polanco (Camino Real / downtown design class)", "Altitude + street food is the trip"],
      lux: ["Four Seasons Reforma or Polanco flagship", "CDMX luxury is the restaurant reservation"]
    },
    thailand: {
      budget: ["Khao San-adjacent or Chiang Mai old city guesthouse", "Thailand is where the budget style actually works"],
      mid: ["Sukhumvit 3-4 star or riverside (Shangri-La-adjacent class)", "BTS/MRT, not taxis in traffic"],
      lux: ["Mandarin Oriental / Capella Bangkok class", "One river hotel, not three island hops"]
    },
    nola: {
      budget: ["Warehouse District or Mid-City 2-star", "French Quarter room premium is real"],
      mid: ["3-4 star French Quarter-adjacent or Garden District", "Walk or streetcar; skip the hotel package"],
      lux: ["Windsor Court / Hotel Monteleone class", "The trip is the food, not the courtyard"]
    },
    chicago: {
      budget: ["Loop or River North limited-service", "Hotel tax is high — it is already in the plan"],
      mid: ["3-4 star River North or Mag Mile", "The L beats surge pricing"],
      lux: ["The Langham / Peninsula class", "Winter rates are the value window"]
    },
    amsterdam: {
      budget: ["Canal-belt hostel or Sloterdijk 2-star", "Canal houses are stairs, not elevators"],
      mid: ["3-4 star Jordaan or De Pijp", "Transit card, not a rental car"],
      lux: ["Pulitzer / Conservatorium class", "King's Day and August are the skip months"]
    },
    lisbon: {
      budget: ["Alfama or Intendente guesthouse", "Hills + trams; pack light"],
      mid: ["3-4 star Baixa / Chiado / Príncipe Real", "Uber is cheap; the 28 tram is a postcard, not transit"],
      lux: ["Bairro Alto Hotel / Four Seasons Ritz class", "Lisbon mid already feels like a stretch in Paris"]
    },
    iceland: {
      budget: ["Reykjavík hostel or Keflavík crash pad", "Car + groceries, not a hotel breakfast"],
      mid: ["3-4 star 101 Reykjavík", "The Ring Road is a different trip (and budget)"],
      lux: ["ION / Retreat at Blue Lagoon class", "Luxury here is the soak, not the minibar"]
    },
    bali: {
      budget: ["Canggu / Ubud guesthouse", "Scooter math is real — insure it"],
      mid: ["Seminyak or Ubud 3-4 star", "Nyepi and Nyepi-adjacent dates are a skip or a gift"],
      lux: ["Uluwatu / Mandapa class", "One nice villa beats three mediocre resorts"]
    },
    dubai: {
      budget: ["Deira or Bur Dubai 3-star", "Metro to the Marina; skip the desert-tour upsell on day one"],
      mid: ["Marina or Downtown 4-star", "July–August is cheap and brutal"],
      lux: ["Burj Al Arab / Atlantis / Armani class", "Dubai luxury is a weekend, not a week"]
    }
  };

  var FOOD_PICKS = {
    disney: {
      picks: ["One table-service dinner, not three", "Grocery breakfast at the resort food court", "Mobile-order quick service beats a sit-down lunch"],
      note: "In-park food is the line that blows Disney budgets. The dining plan is usually a bad buy."
    },
    cruise: {
      picks: ["Main dining room is already in the fare", "Specialty dining only if leftover covers it", "Drink package: run the break-even before you tap yes"],
      note: "The fare includes food. The extras (specialty, drinks, room service fees) are the trap."
    },
    cancun: {
      picks: ["Eat on-property for most meals — that is the product", "One off-resort dinner in downtown Cancún if leftover exists", "Skip the dock-priced excursion lunch"],
      note: "All-inclusive food is fine. The money leak is tips, bottled water you already paid for, and the 'just one' beach club."
    },
    punta_cana: {
      picks: ["Stay on-property unless you pre-booked a transfer", "One beach shack lunch is enough of a taste", "Premium à-la-carte nights inside the resort are the upgrade"],
      note: "Punta Cana off-property logistics cost more than the meal."
    },
    jamaica: {
      picks: ["Jerk lunch off-property once, with a trusted driver", "Drink the included coffee; buy the rum as a bottle, not a round", "Negril casual beats a MoBay hotel restaurant"],
      note: "Transfers and 'recommended' restaurants are where the AI savings go to die."
    },
    nyc: {
      picks: ["Slice + a real dinner, not three $28 salads", "Chinattown / Flushing / Jackson Heights over Midtown", "One reservation (Carbone-class only if leftover is silly)"],
      note: "NYC food math is neighborhood choice, not cuisine. Midtown is the expensive version of everything."
    },
    paris: {
      picks: ["Bouillon or formule du midi for lunch", "Fromagerie + wine for one dinner", "Skip restaurants on the tower, the hill, and the museum steps"],
      note: "Bakeries and one reserved dinner beat a week of tourist-menu prix fixes."
    },
    tokyo: {
      picks: ["Conveyor or standing sushi for one meal", "Convenience-store breakfast is not a compromise", "One counter dinner if leftover covers it — book before you land"],
      note: "Tokyo can be cheap if you let it. Hotel breakfasts are the expensive path."
    },
    vegas: {
      picks: ["Off-Strip or food-hall dinner", "One steakhouse only if leftover is real", "Free drinks are not a meal plan"],
      note: "Strip restaurants price like airports. Walk ten minutes."
    },
    los_angeles: {
      picks: ["Taco truck or Grand Central Market, not the hotel restaurant", "Koreatown BBQ as the one sit-down", "Santa Monica Pier is a walk, not a meal plan"],
      note: "LA food is excellent at every price. The overrun is hotel restaurants and a rideshare to dinner across town."
    },
    oahu: {
      picks: ["Plate lunch, not resort breakfast every day", "Leonard’s malasadas once, not as a meal", "Grocery the condo if you booked one"],
      note: "Waikiki restaurant rows are mainland prices plus a view surcharge."
    },
    maui: {
      picks: ["Food truck in Kihei or Paia", "One fish dinner, not five", "Condo kitchen is the Maui budget"],
      note: "Resort restaurants on Maui are a second lodging charge."
    },
    rome: {
      picks: ["Trastevere or Testaccio, not Piazza Navona", "Supplì + a sit-down dinner", "Cover charge (coperto) is real — it is not a scam, just budget it"],
      note: "The closer the monument, the worse the carbonara."
    },
    london: {
      picks: ["Pub lunch + a market dinner (Borough / Maltby)", "Pret is a fallback, not a plan", "Indian or Turkish in Zone 2 beats a West End prix fixe"],
      note: "London food is excellent two Tube stops from the postcard."
    },
    barcelona: {
      picks: ["Menú del día at lunch", "Vermut + conservas, not a ramblas paella", "One seafood dinner in Barceloneta if leftover exists"],
      note: "Tourist paella is the most expensive way to be disappointed."
    },
    mexico_city: {
      picks: ["Street tacos + one reservation (Pujol-class only as a stretch)", "Mercado lunch", "Coffee in Roma, dinner in Condesa or Juárez"],
      note: "CDMX is where the mid-range food budget feels rich. Spend it on the meal, not the hotel restaurant."
    },
    thailand: {
      picks: ["Street stall + one nice riverside dinner", "Mango sticky rice is a food group", "Hotel breakfast buffets are optional"],
      note: "Bangkok and Chiang Mai are the rare destinations where 'budget food' is the good food."
    },
    nola: {
      picks: ["Neighborhood po'boy, not a Bourbon breakfast", "One old-school dinner (Galatoire's class) if leftover covers it", "Café du Monde once"],
      note: "New Orleans is a food trip. Cut the hotel class before you cut the reservations."
    },
    chicago: {
      picks: ["One deep-dish if you must, then Italian beef or a neighborhood spot", "West Loop or Logan Square over the Mag Mile", "Doughnut / tavern lunch"],
      note: "Downtown hotel restaurants are Chicago priced for people who will not take the L."
    },
    amsterdam: {
      picks: ["Brown-café lunch, not a canal-cruise buffet", "Albert Heijn breakfasts most mornings", "One Indonesian rijsttafel if leftover covers it"],
      note: "Tourist-row restaurants on the main canals are a tax. Two streets over is the actual city."
    },
    lisbon: {
      picks: ["Pastel de nata is a snack, not a meal plan", "Neighborhood tascas in Graça or Campo de Ourique", "One seafood dinner in Cais do Sodré or Belém, not every night"],
      note: "Lisbon food is excellent at mid-range prices. The overrun is the miradouro tourist menu."
    },
    iceland: {
      picks: ["Grocery breakfast and a packed lunch on road days", "One fish dinner in 101 Reykjavík", "Skip the hotel breakfast buffet unless it is included"],
      note: "Reykjavík restaurants price like a capital. The Ring Road only works if you grocery."
    },
    bali: {
      picks: ["Warung meals most days", "One nice dinner in Seminyak or Ubud", "Bintang on the beach is not a $40 cocktail program"],
      note: "Bali is where the budget food band is the good food. Hotel Italian is the trap."
    },
    dubai: {
      picks: ["Creekside or Deira lunch, not a mall food court every day", "One destination dinner if leftover is real", "Hotel breakfast only when it is in the rate"],
      note: "Dubai luxury dining is a weekend splurge. Daily food can stay in the mid band if you leave Downtown."
    }
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
    FOOD_PICKS: FOOD_PICKS,
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
