/* =====================================================================
   Vacation Math — printable money guides (top 20 destinations)
   Unique editorial copy. Hotel / food / activity names come from
   plan-data.js + plan-recs-extra.js so /guides and /plan stay aligned.
   Not live rates, not star scores, no affiliates.
   ===================================================================== */
(function (global) {
  "use strict";

  function G(obj) { return obj; }

  var GUIDES = [
    G({
      id: "disney",
      label: "Walt Disney World",
      place: "Orlando, Florida",
      hook: "Four parks, one food-court breakfast, and a Lightning Lane decision you should make before you fly — not at the gate.",
      blurb: "Sleep on a bus or Skyliner grid. Tickets, Florida tax, and the dining plan you should not buy.",
      nights: "4–6 nights (one park a day)",
      midrange: "Moderate resort + food-court lunch + one table-service",
      months: "Late Jan–Feb, two weeks after Labor Day",
      car: "maybe",
      forWho: [
        "Families who will stay on a bus, boat, or Skyliner grid and treat Magic Kingdom as a commute",
        "Anyone who will grocery breakfast and skip the dining plan on purpose"
      ],
      notFor: [
        "People stacking four parks, a water park, and character dining before Thursday",
        "Anyone calling an I-Drive hotel “Budget” without pricing parking and the drive"
      ],
      aroundKind: "fork",
      aroundRule: "Stay on property and the buses are the product. A cheap I-Drive hotel plus a rental is a parking habit you bought on purpose.",
      aroundNoCar: [
        "On-property: bus to every park; Skyliner from Pop, Art of Animation, Caribbean Beach, Riviera",
        "Monorail only from the Deluxe Magic Kingdom resorts",
        "Mears or rideshare from MCO — Magical Express is gone. Price the transfer as its own line"
      ],
      aroundCar: [
        "Park at the hotel every night — that is a line, not a surprise",
        "Still one base. Use the car for a planned Springs or grocery run, not four park hops",
        "Daily park parking is a ticket if you drive to the gates"
      ],
      stayRule: "Base on the Skyliner if you can. A cheap I-Drive hotel is not Budget — it is a parking habit.",
      eatRule: "The dining plan is usually a bad buy — even on Splurge. Grocery the room, mobile-order lunch, one table-service.",
      doRule: "Hopper on a short trip is usually a tax. A second park day is cheaper than switching after a turkey leg.",
      days: [
        { title: "Magic Kingdom, then stop", bullets: ["Rope drop the land you actually care about", "Food-court dinner back at the resort, or one mobile-order lunch", "Springs or a Skyliner hop at night — not a Hopper dash to Epcot fireworks"] },
        { title: "Skyliner park", bullets: ["Hollywood Studios or Epcot from Pop, Art of Animation, Caribbean Beach, or Riviera", "Lightning Lane only if this is the crowded day and you already priced it", "Evening on the line or a resort food court"] },
        { title: "Cheaper park or a rest day", bullets: ["Animal Kingdom, a second single-park ticket, or Springs plus a pool", "Do not Hopper unless you will switch after lunch on purpose", "Memory Maker and the refillable mug only if you will use them every day"] }
      ],
      book: [
        "Park tickets and the lodging grid before you fly",
        "Lightning Lane Multi Pass only if you already priced Magic Kingdom or Hollywood Studios",
        "One table-service if you want it — California Grill / Space 220 / character breakfast sell out",
        "MCO transfer (Mears or rideshare). Magical Express is gone"
      ],
      hidden: [
        "Florida 12.5% lodging tax on the room",
        "6.5% sales tax on tickets",
        "Daily park parking if you drive",
        "MCO transfer — no Magical Express",
        "Lightning Lane and Memory Maker if you tap yes at the gate",
        "Tips on table-service and the refillable mug you will not finish"
      ],
      skip: [
        { name: "The dining plan", why: "Pay as you go. Even Splurge usually loses this bet." },
        { name: "Park Hopper on a 3-night", why: "A second park day is cheaper than the Hopper tax unless you will switch after lunch." },
        { name: "I-Drive hotel plus a rental as “Budget”", why: "You bought parking, gas, and a 40-minute commute." }
      ],
      tips: [
        "Skip Park Hopper unless you will switch parks after lunch. A second park day is usually cheaper on a short trip.",
        "Lightning Lane Multi Pass is a maybe on Magic Kingdom or Hollywood Studios. Skip it in late January and mid-September.",
        "Grocery breakfast (Garden Grocer / Winn-Dixie) plus food-court lunch. The dining plan is usually a bad buy — even on Splurge.",
        "Stay on the bus or Skyliner grid. A cheap International Drive hotel plus a rental car is not Budget.",
        "Tuesday and Wednesday MCO arrivals beat Saturday check-ins.",
        "Disney Springs is a free evening. Do not buy a third park day just to fill a night.",
        "Memory Maker and the refillable mug only pay if you will actually use them every day.",
        "Run Trip Plan before you lock tickets — Orange County lodging tax is not optional math."
      ],
      related: [
        { href: "/disney", label: "Disney World Cost Calculator" },
        { href: "/guides/disney-world-vacation-cost", label: "Disney World cost guide" },
        { href: "/guides/hidden-costs-disney-world", label: "Hidden Disney costs" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "anaheim",
      label: "Anaheim / Disneyland",
      place: "Anaheim, California",
      hook: "Two parks, a walkable Harbor Blvd, and a dining plan you still should not buy.",
      blurb: "Smaller than Orlando. Same food-court math. Sleep in Anaheim — Santa Monica is a different trip.",
      nights: "2–3 nights",
      midrange: "Harbor Blvd 3-star + grocery breakfast + one park a day",
      months: "Mid-Jan–early Mar, late Apr after Easter",
      car: "maybe",
      forWho: [
        "People who will sleep within a walk or ART shuttle of the gates",
        "Anyone who wants two parks without inventing a Los Angeles itinerary"
      ],
      notFor: [
        "Anyone booking Santa Monica and calling it a Disneyland trip",
        "People stacking Universal into three Disneyland nights"
      ],
      aroundKind: "fork",
      aroundRule: "Walk or take the hotel shuttle. This lodging is Anaheim — not a Getty / Griffith / Universal stack.",
      aroundNoCar: [
        "Harbor Blvd and Downtown Disney are walkable",
        "ART (Anaheim Resort Transportation) if your hotel is a few blocks off the walk",
        "SNA is the close airport. LAX is cheaper air and a longer ground transfer — price both"
      ],
      aroundCar: [
        "Hotel parking is a line if you never leave the bubble",
        "Still one base in Anaheim. Use the car for a planned grocery run, not a nightly Santa Monica dinner",
        "Universal is a Los Angeles ticket with its own parking"
      ],
      stayRule: "A Harbor Blvd 3-star and a grocery bag. Grand Californian is Splurge. Santa Monica is a different city.",
      eatRule: "Albertsons or Target the night you land. Downtown Disney is a dinner, not a dining plan.",
      doRule: "One park per day on Budget. Hopper only if you will switch after lunch.",
      days: [
        { title: "Disneyland park, then the hotel", bullets: ["Rope drop one land you actually care about", "Grocery breakfast, mobile-order lunch", "Downtown Disney only if dinner is already priced — you are not driving to Santa Monica"] },
        { title: "California Adventure, or the other park", bullets: ["One park", "Lightning Lane only if this is the crowded day", "Evening on Harbor Blvd or the hotel courtyard"] },
        { title: "A second single-park day — or go home", bullets: ["Do not Hopper unless you will switch after lunch on purpose", "Universal is not this day", "Downtown Disney is not a third park"] }
      ],
      book: [
        "Park tickets before you fly",
        "Lightning Lane on the Disneyland park day only, unless you already priced both",
        "One table-service if you want Carthay Circle or Napa Rose",
        "ART pass if your hotel is off the walk"
      ],
      hidden: [
        "Hotel parking if you rent a car you will not use",
        "Sales tax on tickets",
        "Lightning Lane and Hopper if you tap yes",
        "LAX ground transfer vs SNA air",
        "Bags if you flew cheap and now need an Uber van"
      ],
      skip: [
        { name: "The dining plan", why: "Pay as you go. It is still usually a bad buy." },
        { name: "Universal as a “quick” add-on", why: "That is a Los Angeles ticket. Do not cram it into three Disneyland nights." },
        { name: "A Westside hotel", why: "You will spend the value of a park ticket sitting in traffic." }
      ],
      tips: [
        "One park per day on Budget. Hopper only if you will switch after lunch.",
        "Lightning Lane on the Disneyland park day, not both days, unless you already priced it.",
        "Grocery breakfast (Albertsons / Target) plus mobile-order QS. Downtown Disney is a dinner, not a meal plan.",
        "Stay in Anaheim. A Santa Monica hotel plus a 90-minute transfer is not a Disneyland trip.",
        "Midweek SNA or LAX flights. Friday arrivals into Halloween Time are a tax.",
        "Universal Studios is a Los Angeles day with its own ticket math.",
        "The dining plan is still usually a bad buy. Pay as you go.",
        "Grand Californian or Pixar Place is Splurge. Budget is Harbor Blvd and a grocery bag."
      ],
      related: [
        { href: "/guides/disney-world-vs-disneyland-cost", label: "Disney World vs Disneyland cost" },
        { href: "/themeparks", label: "Theme Park Cost Calculator" },
        { href: "/guides/disney", label: "Walt Disney World money guide" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "los_angeles",
      label: "Los Angeles",
      place: "Los Angeles, California",
      hook: "Excellent food at every price. The overrun is a rideshare to dinner across town.",
      blurb: "Pick Downtown, Koreatown, or the beach — then stop treating LA like a single neighborhood.",
      nights: "3–4 nights",
      midrange: "Downtown hotel + neighborhood dinners + one ticketed day",
      months: "Late Jan–Mar, May before Memorial Day",
      car: "yes",
      forWho: [
        "People who will pick Downtown, Koreatown, or the beach and eat there",
        "Anyone who wants Getty + one beach or Universal — not all three"
      ],
      notFor: [
        "Anyone stacking Disneyland from Santa Monica",
        "Checklist tourists who want to “see it all” in a weekend"
      ],
      aroundKind: "fork",
      aroundRule: "Pick one neighborhood. Metro plus one rideshare zone. A cheap Valley room becomes a $40 Uber habit.",
      aroundNoCar: [
        "TAP card. E Line to Santa Monica; B / D Lines cover Koreatown and Downtown",
        "Stay in one neighborhood. Rideshare for one planned hop, not dinner across town",
        "SNA or BUR can beat LAX on a short stay — price the ground, not just the fare"
      ],
      aroundCar: [
        "Hotel parking is $40–60/night — add it before you celebrate the rate",
        "Still one base. Use the car for planned days (Getty, a beach, a canyon) — not 7pm dinner across town",
        "Disneyland is Anaheim lodging. Do not treat it as a “quick” day from Santa Monica"
      ],
      stayRule: "Pick Downtown, Koreatown, or the beach. Then stay there. Crossing town for dinner is a second hotel.",
      eatRule: "Eat where you slept. Hotel restaurants in LA are airport-priced.",
      doRule: "The Getty is free if you reserve. Universal Express is Splurge. Do not stack Universal, Disneyland, and a beach day.",
      days: [
        { title: "The neighborhood you booked", bullets: ["Downtown: Arts District walk, Grand Central Market, Getty if you reserved", "Koreatown: bakery, late food, one Metro ride", "Westside: sand, Promenade, stay west for dinner — no 6pm reservation across town"] },
        { title: "One ticketed thing — or a second neighborhood, not both", bullets: ["Universal or a studio tour if you already priced it", "Otherwise Griffith + a taco neighborhood, or the Expo Line for lunch and back before rush hour", "Disneyland is not this day"] },
        { title: "Sand or hills, then stop stacking", bullets: ["Venice / Santa Monica if you have not been west", "Griffith and the viewpoint if you have not been up", "Evening in the same zip code as the bed"] }
      ],
      book: [
        "Getty Center reservation (free entry; pay parking or take the bus)",
        "Universal or a studio tour only if that is the ticketed day",
        "One dinner reservation if you want Bestia / Providence / n/naka",
        "TAP card or a day fare if you will ride Metro"
      ],
      hidden: [
        "Hotel parking $40–60/night if you rent a car",
        "Occupancy tax on the room",
        "Rideshare across town — a $40 Uber each way is a second hotel night",
        "Universal parking and Express if you tap yes",
        "Airport transfer: LAX vs BUR vs SNA ground math",
        "Bags if you split ride-shares to a compact Downtown hotel"
      ],
      skip: [
        { name: "Disneyland from Santa Monica", why: "That is an Anaheim day with a 90-minute punishment on either end." },
        { name: "Hotel restaurants", why: "Airport prices, lobby energy. Porto’s exists." },
        { name: "Dinner across town", why: "A $40 rideshare each way is a second hotel night you already declined." }
      ],
      tips: [
        "Pick one neighborhood (Downtown, Koreatown, or the beach) and eat there. Crossing town for dinner is a second hotel.",
        "TAP day fares beat a rideshare loop. The Getty is free if you reserve — bus or pay parking, not a $40 drop-off.",
        "Porto’s or a bakery breakfast. Hotel restaurants in LA are airport-priced.",
        "Midweek flights into LAX, BUR, or SNA. Friday arrivals are a tax.",
        "Skip hotel parking unless you have a canyon or beach-hop day already priced.",
        "Disneyland is Anaheim lodging and a separate ticket.",
        "Grand Central Market and a taco truck (Mariscos Jalisco class) beat a hotel dinner.",
        "Universal Express is Splurge. Getty + Griffith + one beach day is the Budget week."
      ],
      related: [
        { href: "/guides/anaheim", label: "Anaheim / Disneyland money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "nyc",
      label: "New York City",
      place: "New York, New York",
      hook: "The subway is the plan. Midtown is the expensive version of everything — including a $28 salad.",
      blurb: "Neighborhood choice is the budget. Times Square is a pass-through, not a hotel strategy.",
      nights: "3–4 nights",
      midrange: "Train-stop hotel + borough dinners + one ticketed thing",
      months: "February, early March, late January after New Year’s",
      car: "no",
      forWho: [
        "People who will walk a borough and ride twice a day",
        "Anyone who will treat Times Square as a transfer, not a view they paid extra to sleep under"
      ],
      notFor: [
        "Anyone who wants a rental car in Manhattan",
        "People stacking three observatories and a Midtown salad every lunch"
      ],
      aroundKind: "transit",
      aroundRule: "Subway first. Outer-borough lodging on a train beats a Midtown west “deal.”",
      aroundNoCar: [
        "OMNY / MetroCard. A 7-day pass wins if you ride twice a day",
        "Walk a borough; rideshare only when the last train is gone",
        "LGA, JFK, and EWR are different ground math. Price the AirTrain / subway, not just the fare"
      ],
      stayRule: "Skip Times Square unless you like paying for the neon. Pod, citizenM, or a Brooklyn train-stop room is Budget.",
      eatRule: "Bodega egg-and-cheese. Jackson Heights, Flushing, or Chinatown at night. The hotel dining room is a Midtown salad with a room-service tax.",
      doRule: "High Line, a neighborhood, the ferry. One museum or one Broadway. Do not stack three observatories.",
      days: [
        { title: "The borough you booked", bullets: ["If you slept Downtown or in Brooklyn: waterfront, High Line or Heights promenade", "Bodega breakfast, dinner on the same side of the river", "Midtown only if you are changing trains"] },
        { title: "One museum, one neighborhood dinner", bullets: ["Met or MoMA — pick one", "Evening in the Village, Chinatown, or the borough you have not done", "Not three interiors and a pre-theatre prix fixe"] },
        { title: "Ferry, or Broadway if you already priced it", bullets: ["Staten Island Ferry in daylight, then a second neighborhood walk", "Splurge spends the night on a reserved seat, not a third observatory", "Go home on the train you already paid for"] }
      ],
      book: [
        "One museum timed entry (Met or MoMA — pick one)",
        "Broadway rush / lottery, or one reserved seat if that is the trip",
        "Ellis / Summit only if you already picked one paid view",
        "OMNY or a 7-day pass if you will ride twice a day"
      ],
      hidden: [
        "NYC “resort-style” hotel fees — add them in your head",
        "14.75% lodging-tax assumption on the room",
        "Airport ground: AirTrain / subway vs a taxi from JFK, LGA, or EWR",
        "Broadway full-price orchestra vs rush / lottery",
        "Bags if you booked a Pod and packed like a suite"
      ],
      skip: [
        { name: "A Times Square hotel", why: "You paid for neon and a resort-style fee. The train still goes there." },
        { name: "Three observatories", why: "The ferry is the skyline. One paid view is a souvenir." },
        { name: "A week of Midtown salads", why: "The $28 lunch is how Mid-range becomes Splurge without a nicer room." }
      ],
      tips: [
        "Skip a Times Square hotel unless you like paying for the neon. Pod / citizenM / a Brooklyn train-stop room is Budget.",
        "Bodega egg-and-cheese or a bakery breakfast. The hotel dining room is a Midtown salad with a room-service tax.",
        "A 7-day unlimited or OMNY cap beats a week of single swipes if you ride twice a day.",
        "Staten Island Ferry is the free skyline. Skip a paid harbor loop on Budget.",
        "One museum with pay-what-you-wish or a timed free night. Do not stack three observatories.",
        "Midweek flights. Friday into a holiday weekend is the expensive version of the same seat.",
        "Jackson Heights, Flushing, and Chinatown over Midtown for dinner. One borough per night.",
        "Broadway rush / lottery before a full-price orchestra. Splurge is a reserved seat, not three shows."
      ],
      related: [
        { href: "/guides/philadelphia", label: "Philadelphia money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "vegas",
      label: "Las Vegas",
      place: "Las Vegas, Nevada",
      hook: "Resort fees apply on a $40 Tuesday. Walk ten minutes off the casino carpet and dinner gets honest again.",
      blurb: "Tuesday–Thursday Center-Strip or downtown. Saturday is a different hotel.",
      nights: "2–3 midweek nights",
      midrange: "Center-Strip walk + food hall + one show",
      months: "Midweek Jan–Feb, early December after holiday parties",
      car: "maybe",
      forWho: [
        "People who will walk Center-Strip or own downtown lights — not both in three nights",
        "Anyone who will add the resort fee before celebrating a $40 rate"
      ],
      notFor: [
        "Weekend and convention weeks if you came for the “deal”",
        "Anyone stacking three shows and a nightclub table"
      ],
      aroundKind: "fork",
      aroundRule: "Walk the Center-Strip. Downtown is a separate neighborhood — pick one.",
      aroundNoCar: [
        "Center-Strip is walkable if you booked Park MGM / NYNY / Horseshoe / Bellagio class",
        "Deuce / monorail if you stray north. One rideshare to Fremont, not four",
        "LAS is close. You do not need a car for a Center-Strip week"
      ],
      aroundCar: [
        "Hotel parking is a fee plus a hangover you do not need",
        "Still one base. Use the car for a planned Red Rock day, not bed-to-casino Uber replacement",
        "Downtown plus a Strip night is one rideshare, not a rental justification"
      ],
      stayRule: "Book Tuesday–Thursday. Weekend and holiday weeks double a midweek rate before the resort fee lands.",
      eatRule: "Food halls at Park MGM or Cosmo, or Chinatown / Downtown dinner. Strip steakhouses price like airports.",
      doRule: "Fountains are free. Tables are not. One show if you already priced it.",
      days: [
        { title: "Center-Strip on foot", bullets: ["Check in, walk the fountains, eat ten minutes off the carpet", "If you booked downtown, walk Fremont and rideshare to the Strip once — not four times"] },
        { title: "One daytime treat, or just more walking", bullets: ["High Roller off-peak or Red Rock if you have a car", "Otherwise the conservatory, a food hall, and the sidewalk", "The monorail is a backup"] },
        { title: "One show, then stop stacking", bullets: ["Cirque or a mid-room if you already priced it", "Do not add a table and a second show", "Fly out before Saturday if you can"] }
      ],
      book: [
        "Tuesday–Thursday room — check the convention calendar first",
        "One show if that is the trip",
        "Resort fee is not optional — add it before you book",
        "Airport ride: LAS is close; skip a rental unless Red Rock is a planned day"
      ],
      hidden: [
        "Resort fees on a $40 Tuesday",
        "Parking if you rent a car",
        "Strip steakhouse and nightclub minimums",
        "Show tickets and a second “just one more”",
        "Drinks that are not a meal plan",
        "Bags and a late checkout fee if Saturday moved"
      ],
      skip: [
        { name: "Celebrating the $40 rate", why: "Add the resort fee in your head before you text anyone." },
        { name: "A steakhouse every night", why: "One treat. Food halls exist." },
        { name: "Three shows and a table", why: "The street is already a show. Splurge is one reserved seat." }
      ],
      tips: [
        "Book Tuesday–Thursday. Weekend and holiday weeks double a midweek rate before you add the resort fee.",
        "Resort fees apply even on a $40 Tuesday. Add them in your head before you celebrate the “deal.”",
        "Food halls (Park MGM / Cosmo) or Chinatown / Downtown dinner. Strip steakhouses price like airports.",
        "Walk the Center-Strip. The monorail is a backup; Ubering from bed to the next casino is a habit.",
        "Fountains, Bellagio conservatory, and a Fremont walk are free. A nightclub table is Splurge, not mid.",
        "One show, not three. Cirque or a residency — the street is already a show.",
        "Pay-as-you-go drinks until you run the math. Free drinks are not a meal plan.",
        "Downtown (Circa-adjacent / Fremont) is Budget lodging if you will walk those lights and rideshare to the Strip once."
      ],
      related: [
        { href: "/tripfinder", label: "Trip Finder" },
        { href: "/guides/how-much-to-budget-for-vacation", label: "How much to budget" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "miami",
      label: "Miami",
      place: "Miami, Florida",
      hook: "Ocean Drive menus are a tourist tax. Cuban breakfast and a neighborhood dinner win the week.",
      blurb: "South Beach a few blocks off the neon, or Brickell if you want mainland restaurants.",
      nights: "3–4 nights",
      midrange: "Collins 3-star a few blocks off Ocean Drive + Cuban breakfast",
      months: "Early December, late April after spring break, May",
      car: "yes",
      forWho: [
        "People who will sleep a few blocks off Ocean Drive or in Brickell — not both",
        "Anyone who wants sand plus one neighborhood (Wynwood or Little Havana)"
      ],
      notFor: [
        "Spring break weeks if you came for the rate",
        "Anyone who thinks bottle service is a snack"
      ],
      aroundKind: "fork",
      aroundRule: "Walk the beach grid you booked. A car is a parking fee in South Beach.",
      aroundNoCar: [
        "South Beach is walkable if you slept a few blocks off Ocean Drive",
        "Brickell / Downtown: Metromover is free; rideshare to the sand once",
        "MIA is close. FLL can be cheaper air plus a longer ground transfer"
      ],
      aroundCar: [
        "South Beach parking is a nightly fee — add it before you book",
        "Still one base. Use the car for a planned Everglades or Wynwood day, not dinner two neighborhoods over",
        "Do not split Mid-Beach and Brickell in three nights"
      ],
      stayRule: "The Gale or a Collins 2-star is the same beach as the postcard address. Freehand if the party will share.",
      eatRule: "Versailles or a ventanita — not the hotel, not Ocean Drive. Little Havana or Wynwood at night.",
      doRule: "The beach you booked. Wynwood from the sidewalk. Skip bottle service on Budget.",
      days: [
        { title: "The beach grid you slept on", bullets: ["Cuban breakfast, the sand, dinner a few blocks off Ocean Drive", "You do not need a car for this day"] },
        { title: "Wynwood or Little Havana — pick one", bullets: ["Sidewalk murals or a ventanita crawl", "Brickell Metromover if you slept on the mainland", "Home before you invent a second neighborhood"] },
        { title: "More sand, or Everglades if you already priced it", bullets: ["The same beach", "Everglades only if you accept the humidity and a half-day", "Bottle service is not this day"] }
      ],
      book: [
        "Room a few blocks off Ocean Drive — or Brickell if mainland restaurants are the point",
        "Joe’s Stone Crab only if you will share one plate",
        "Everglades tour only if that is the planned half-day",
        "Flexible fare in hurricane season (June–November)"
      ],
      hidden: [
        "Hotel parking in South Beach",
        "Florida lodging tax",
        "Beach-club bottle service and cabana minimums",
        "Rideshare if you split Mid-Beach and Brickell",
        "FLL vs MIA ground transfer",
        "Hurricane-season change fees if you booked a “deal” without a cancel stance"
      ],
      skip: [
        { name: "Ocean Drive addresses", why: "Same sand, worse breakfast, louder nights." },
        { name: "Beach-club bottle service", why: "That is a day-price, not a snack." },
        { name: "Hurricane-season “deals” without a cancel stance", why: "Flexible fare or skip. The humidity is free." }
      ],
      tips: [
        "Sleep a few blocks off Ocean Drive. Same sand, less neon, better breakfast.",
        "Cuban café (Versailles or a ventanita) — not the hotel, not Ocean Drive.",
        "Skip beach-club bottle service on Budget. That is a day-price, not a snack.",
        "Midweek flights. Friday into a holiday weekend is Miami doing Miami to your card.",
        "Wynwood Walls from the sidewalk; Little Havana on foot. Everglades is a half-day you priced, not a default.",
        "Hurricane-season “deals” need a flexible fare or a cancel-for-any-reason stance you already priced.",
        "Brickell if you want mainland restaurants and Metromover. Do not split Mid-Beach and Brickell in three nights.",
        "Joe’s Stone Crab is a share treat — not five fish dinners."
      ],
      related: [
        { href: "/guides/key_west", label: "Key West money guide" },
        { href: "/guides/cruise", label: "Caribbean cruise money guide" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "san_francisco",
      label: "San Francisco",
      place: "San Francisco, California",
      hook: "Transit-first city. Union Square tourist hotels are the expensive version of a Muni pass.",
      blurb: "Walk the Embarcadero, skip the Wharf menu, treat Napa as a packed-lunch day trip.",
      nights: "3–4 nights",
      midrange: "Embarcadero or neighborhood 3-star + Clipper + bakery breakfast",
      months: "Late Jan–Feb, September after Labor Day",
      car: "no",
      forWho: [
        "People who will tap Clipper and sleep near BART or the Embarcadero",
        "Anyone who wants hills, a bakery, and one timed ferry"
      ],
      notFor: [
        "Anyone stacking Alcatraz, Napa, and Yosemite in five nights",
        "People who want a rental car inside the city"
      ],
      aroundKind: "transit",
      aroundRule: "Muni + BART. Parking is a line item if you day-trip Napa or Muir Woods.",
      aroundNoCar: [
        "Clipper card on Muni, BART, and ferries. A visitor passport can win on a four-ride day",
        "Cable cars are a ticketed souvenir, not transit. A bus often reaches the same hill",
        "SFO via BART. OAK is a different transit story — price the ground"
      ],
      stayRule: "Embarcadero or a neighborhood 3-star is the Mid-range stay. Hostel-plus near BART is Budget. A car inside the city is a parking line.",
      eatRule: "Tartine or a Mission bakery. Ferry Building or a taqueria at lunch. Skip the Wharf seafood rack.",
      doRule: "Golden Gate or Crissy Field, Embarcadero, Mission murals. Alcatraz is a timed ferry — book ahead.",
      days: [
        { title: "Embarcadero and a bakery", bullets: ["Ferry Building, the water, Tartine or a Mission stop if you rode that far", "No Wharf prix fixe", "Evening in the neighborhood you booked"] },
        { title: "Alcatraz, or the bridge — not both plus Napa", bullets: ["Timed ferry if you booked it", "Otherwise Golden Gate / Crissy Field and a neighborhood walk", "Do not add Yosemite"] },
        { title: "Mission murals or a packed-lunch day trip", bullets: ["Murals and a taqueria", "Or Napa with a sandwich — not a dinner transfer and a second hotel", "Home on BART"] }
      ],
      book: [
        "Alcatraz timed ferry — it sells out",
        "Clipper or a visitor passport if you will ride",
        "One dinner if you want State Bird or Zuni",
        "SFO via BART; price OAK ground separately"
      ],
      hidden: [
        "Hotel tax about 16%",
        "Parking if you day-trip Napa or Muir Woods",
        "Cable-car souvenir tickets used as transit",
        "Wharf menu surcharges",
        "BART from SFO vs a downtown taxi"
      ],
      skip: [
        { name: "The Wharf seafood rack", why: "Tourist menu, tourist price. The Mission is a bus away." },
        { name: "A paid cable-car loop as transit", why: "One souvenir ticket is fine. A bus often reaches the same hill." },
        { name: "Napa for dinner", why: "That is a transfer, not a reservation. Pack lunch or skip." }
      ],
      tips: [
        "Clipper + Muni / BART. A visitor passport beats a week of single rides if you move.",
        "Tartine or a Mission bakery breakfast. Skip the hotel dining room and the Wharf seafood rack.",
        "Alcatraz timed ferry — book ahead. Do not stack Alcatraz, Napa, and Yosemite in five nights.",
        "Skip the paid cable-car loop if a bus reaches the same hill. The souvenir ride is one ticket, not a commute.",
        "Napa is a day trip with a packed lunch, not a dinner transfer and a second hotel.",
        "Midweek SFO. Weekend rates around conventions and Fleet Week are a different city.",
        "Golden Gate + Crissy Field + Mission murals are free. SFMOMA is one ticketed indoor, not three.",
        "Union Square tourist hotels are a tax. Embarcadero or a neighborhood 3-star is the Mid-range stay."
      ],
      related: [
        { href: "/big-trip", label: "The Big Trip" },
        { href: "/tripfinder", label: "Trip Finder" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "chicago",
      label: "Chicago",
      place: "Chicago, Illinois",
      hook: "The L beats surge pricing. Winter rates are the value window; summer weekends are not.",
      blurb: "River North or Fulton Market. Deep-dish once, then a neighborhood dinner.",
      nights: "3 nights",
      midrange: "River North or Fulton Market + the L + one ticketed indoor",
      months: "January–early March, late April, September",
      car: "no",
      forWho: [
        "People who will book Loop or River North so the L is downstairs",
        "Anyone who wants architecture from the sidewalk and one museum"
      ],
      notFor: [
        "Lolla week and July 4th weekend if you came for the rate",
        "Anyone treating a suburban hotel as Budget"
      ],
      aroundKind: "transit",
      aroundRule: "The L is the plan. A suburban rate is a parking tax.",
      aroundNoCar: [
        "Ventra card on the L and buses. A 1-day or 3-day pass wins if you ride",
        "Walk the Riverwalk and the Mag Mile as a pass-through, not a hotel strategy",
        "ORD vs MDW: Southwest into Midway can win. Price the L, not a downtown taxi from either"
      ],
      stayRule: "Loop or River North limited-service so the L is downstairs. Fulton Market if you want restaurants over the Mag Mile.",
      eatRule: "Doughnut or diner breakfast. One deep-dish if you must, then Italian beef or Fulton Market casual.",
      doRule: "Architecture from the sidewalk is free. Art Institute or a river cruise — pick one.",
      days: [
        { title: "Riverwalk and the neighborhood you booked", bullets: ["Diner breakfast, sidewalk architecture", "Dinner in River North or Fulton Market", "Mag Mile is a walk-through, not a reservation"] },
        { title: "One ticketed indoor", bullets: ["Art Institute or a river cruise — you already picked", "Evening back on the L", "Do not add a second museum"] },
        { title: "Lakefront if the weather allows, then stop", bullets: ["A beach or park day if it is not January", "Winter is the rate; you knew that", "One deep-dish if you have not done the bit"] }
      ],
      book: [
        "Art Institute or a river cruise — pick one",
        "Ventra pass if you will ride",
        "ORD or MDW midweek; price the L from either",
        "Skip Lolla / July 4 lodging unless that is the trip"
      ],
      hidden: [
        "Chicago hotel tax about 17.4%",
        "Suburban parking if you booked the “deal”",
        "River cruise and a second museum stacked in one day",
        "Deep-dish as a personality (once is enough)",
        "ORD vs MDW taxi vs the L"
      ],
      skip: [
        { name: "Lolla week and July 4th weekend", why: "A different city and a different room." },
        { name: "Deep-dish as a personality", why: "Once, then Italian beef. You have made your peace." },
        { name: "Two museums and a cruise in one day", why: "Pick one ticketed indoor on Mid-range." }
      ],
      tips: [
        "Ventra day pass beats a rideshare loop. The L is the plan — Mag Mile hotels are for people who will not take it.",
        "Winter rates are the value window. Summer weekends and Lolla week are not.",
        "Doughnut or diner breakfast. Downtown hotel restaurants are Chicago-priced for the same eggs.",
        "One deep-dish if you must, then stop. Italian beef or a Fulton Market casual is the rest of the week.",
        "Architecture from the sidewalk is free. A river cruise is one ticketed treat, not a daily habit.",
        "Art Institute or a river cruise — pick one on Mid-range. Do not stack two museums and a cruise.",
        "Midweek ORD or MDW. Friday into a holiday weekend is a different room.",
        "Fulton Market lodging if you want restaurants over the Mag Mile. One neighborhood, not two towers."
      ],
      related: [
        { href: "/tripfinder", label: "Trip Finder" },
        { href: "/guides/how-much-to-budget-for-vacation", label: "How much to budget" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "nola",
      label: "New Orleans",
      place: "New Orleans, Louisiana",
      hook: "This is a food trip. Cut the hotel class before you cut the reservations.",
      blurb: "Warehouse District or Garden District. The French Quarter room premium is real — the plate is the point.",
      nights: "3 nights",
      midrange: "Warehouse / Garden District + one old-school dinner",
      months: "Late January after bowl season, May before the heaviest heat",
      car: "maybe",
      forWho: [
        "People who came for Galatoire’s or Commander’s, not a balcony that photographs like a brochure",
        "Anyone who will walk or take the St. Charles car"
      ],
      notFor: [
        "Mardi Gras “by accident” — it is a different budget",
        "Anyone who wants a rental car as the default in Old Town"
      ],
      aroundKind: "fork",
      aroundRule: "Walk or streetcar. A rental car is a parking fee in Old Town.",
      aroundNoCar: [
        "Streetcar on Canal and St. Charles — a day pass if you will ride",
        "Walk the Quarter in daylight; rideshare at night if you stray",
        "MSY is a short ride"
      ],
      aroundCar: [
        "Old Town parking is a fee you will resent",
        "Still one base. Use the car for a planned plantation or swamp day, not dinner on Bourbon",
        "Most food weeks never need it"
      ],
      stayRule: "Warehouse District, Mid-City, or Garden District. Visit the Quarter; do not necessarily pay to wake up in it.",
      eatRule: "Café du Monde once. Then a neighborhood café. Po’boy lunch, one old-school dinner.",
      doRule: "Daylight Quarter walks and a streetcar hour. Haunted tours are optional.",
      days: [
        { title: "Streetcar and a po’boy", bullets: ["Neighborhood café, Parkway or a shop lunch", "Daylight Quarter", "Café du Monde once if you must — not Bourbon breakfast"] },
        { title: "The reservation you came for", bullets: ["Galatoire’s or Commander’s if that is the trip", "Garden District walk or a streetcar hour before", "Do not add a haunted tour on the same night"] },
        { title: "Music, then stop stacking festivals", bullets: ["A club or a street you can walk", "Jazz Fest and Mardi Gras are priced like what they are", "Do not “just happen” to overlap them"] }
      ],
      book: [
        "Galatoire’s or Commander’s if that is the trip — book before you fly",
        "Streetcar day pass if you will ride Canal and St. Charles",
        "Flexible fare in hurricane season",
        "Skip Mardi Gras lodging unless that is the trip"
      ],
      hidden: [
        "Lodging tax about 16.2%",
        "French Quarter room premium that is not the plate",
        "Parking if you rent a car in Old Town",
        "Haunted-tour upsells",
        "Mardi Gras surge if you overlapped it by accident",
        "Hurricane-season change fees"
      ],
      skip: [
        { name: "French Quarter room premium as a default", why: "The plate is the point. The balcony is a surcharge." },
        { name: "Bourbon breakfast every morning", why: "Café du Monde once. Then walk." },
        { name: "Mardi Gras “by accident”", why: "It is a different budget. Book it on purpose or miss it on purpose." }
      ],
      tips: [
        "Cut the hotel class before you cut Galatoire’s or Commander’s. This is a food trip.",
        "Warehouse District, Mid-City, or Garden District. French Quarter room premium is real and not the plate.",
        "Café du Monde once. Then a neighborhood café — not a Bourbon breakfast every morning.",
        "Po’boy lunch (Parkway or a neighborhood shop). One old-school dinner, not a tourist-menu courtyard every night.",
        "Streetcar day pass. A rental car is a parking fee you will resent.",
        "Mardi Gras is a different budget — rooms, throw-away clothes, and surge. Do not “just happen” to overlap it.",
        "Hurricane-season weeks need a cancel stance you already priced. The music will still be there in January.",
        "Haunted tours are optional. Daylight Quarter walks and a streetcar hour are Budget."
      ],
      related: [
        { href: "/guides/atlanta", label: "Atlanta money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "philadelphia",
      label: "Philadelphia",
      place: "Philadelphia, Pennsylvania",
      hook: "Reading Terminal is the cheap-rich lunch. Cheesesteak is one meal, not a pilgrimage.",
      blurb: "Center City or Old City. Independence is timed and free-ish; the hotel tax is not.",
      nights: "2–3 nights",
      midrange: "Center City + Reading Terminal + one museum",
      months: "February, early March, late January after the holiday hangover",
      car: "no",
      forWho: [
        "People who will walk Independence and ride SEPTA to the rest",
        "Anyone who wants Terminal lunch and one museum"
      ],
      notFor: [
        "Anyone booking the airport hotel and calling it Center City",
        "Fourth of July week if you came for the rate"
      ],
      aroundKind: "transit",
      aroundRule: "Walk Independence. Ride the rest. An airport hotel is a SEPTA tax you will resent.",
      aroundNoCar: [
        "SEPTA Key / Independence Pass if you will ride more than twice a day",
        "Old City and Center City are walkable to each other if you like walking",
        "PHL is a train, not a taxi habit. Price Regional Rail vs rideshare"
      ],
      stayRule: "Center City or Old City. Walk to Independence. The hotel tax is about 15.5% whether you slept next to a Cinnabon or not.",
      eatRule: "Reading Terminal for breakfast and lunch. One cheesesteak, then roast pork at DiNic’s class.",
      doRule: "Independence Hall timed — book it. Barnes or PMA — pick one.",
      days: [
        { title: "Independence and the Terminal", bullets: ["Timed Hall, the Bell as a line you already expected", "Lunch under one roof", "Evening in Old City or Center City — you can walk it"] },
        { title: "One museum", bullets: ["Barnes or PMA. Not both", "Roast pork if you did the cheesesteak yesterday", "No hop-on bus"] },
        { title: "A neighborhood dinner, then the train home", bullets: ["Italian in the neighborhood, not Zahav unless you already priced it", "PHL is Regional Rail, not a taxi habit"] }
      ],
      book: [
        "Independence Hall timed entry",
        "Barnes or PMA — pick one",
        "Zahav only if that is the dinner you came for",
        "SEPTA Key if you will ride"
      ],
      hidden: [
        "Combined lodging tax about 15.5%",
        "Airport hotel plus SEPTA every morning",
        "Hop-on bus you do not need",
        "Cheesesteak tour stacked on three interiors",
        "PHL taxi vs Regional Rail"
      ],
      skip: [
        { name: "An airport hotel", why: "A SEPTA tax you will resent every morning." },
        { name: "Cheesesteak as a pilgrimage", why: "One, then roast pork. You have done the bit." },
        { name: "Three interiors and a tour bus", why: "Independence + one museum. Hop-on is Budget’s enemy." }
      ],
      tips: [
        "Independence Hall timed entry is the ticket — book it. The Bell is a line, not a morning.",
        "Reading Terminal breakfast and lunch. Hotel restaurants are the expensive version of the same plate.",
        "One cheesesteak, then stop. Roast pork (DiNic’s class) is the local argument.",
        "SEPTA day pass beats a rideshare loop. Skip the hop-on bus on Budget.",
        "Barnes or PMA — pick one on Mid-range. Do not stack three interiors and a cheesesteak tour in one day.",
        "Midweek PHL. Fourth of July week is a different city and a different room.",
        "Stay Center City or Old City. An airport hotel is a SEPTA tax you will resent.",
        "Zahav is Splurge. Terminal plus one neighborhood Italian is Mid-range."
      ],
      related: [
        { href: "/guides/nyc", label: "New York City money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "atlanta",
      label: "Atlanta",
      place: "Atlanta, Georgia",
      hook: "The BeltLine is the walk. A cheap airport hotel is a rideshare habit you already paid for.",
      blurb: "Midtown or Ponce. Meat-and-three lunch. Convention weeks are not the value window.",
      nights: "2–3 nights",
      midrange: "Midtown or Ponce on MARTA + meat-and-three lunch",
      months: "Late Jan–Mar, November before Thanksgiving",
      car: "maybe",
      forWho: [
        "People who will ride MARTA from ATL and walk the BeltLine Eastside",
        "Anyone who wants trail food and one ticketed morning"
      ],
      notFor: [
        "Convention weeks if you came for the rate",
        "Anyone splitting Buckhead and the Aquarium hotel in three nights"
      ],
      aroundKind: "fork",
      aroundRule: "MARTA from ATL. Trail the rest. A rental is a parking fee if you stay Midtown and eat on the trail.",
      aroundNoCar: [
        "MARTA from ATL is the honest airport move. A 1-day or 3-day pass if you will ride",
        "BeltLine Eastside Trail is the walk — Ponce City Market to Krog Street",
        "You do not need a car for Midtown + Ponce + the Aquarium"
      ],
      aroundCar: [
        "Cumberland / Buckhead cloverleaf lodging on Budget is how you buy parking",
        "Still one base on the trail. Use the car for a planned day, not dinner two towers away",
        "Check the convention calendar before you celebrate a downtown “deal”"
      ],
      stayRule: "Midtown or Ponce — Hampton, Hotel Clermont, or a 3-star on MARTA so the BeltLine Eastside is the evening.",
      eatRule: "West Egg or a café breakfast. Mary Mac’s for a meat-and-three. Skip a Buckhead steakhouse on Budget.",
      doRule: "BeltLine Eastside — Ponce City Market to Krog Street. Aquarium or World of Coca-Cola — pick one.",
      days: [
        { title: "BeltLine and the neighborhood you booked", bullets: ["Café breakfast, Ponce City Market to Krog, dinner on the trail", "You do not need a car for this day"] },
        { title: "One ticketed morning", bullets: ["Aquarium or World of Coca-Cola — pick one", "Piedmont or MLK the rest", "Do not split Buckhead and Downtown hotels"] },
        { title: "More trail, or go home", bullets: ["The same walk", "Convention weeks are a different city", "Four Seasons is Splurge, not a third neighborhood"] }
      ],
      book: [
        "MARTA from ATL — skip the airport hotel",
        "Aquarium or World of Coca-Cola — pick one",
        "Check the convention calendar before Downtown",
        "Hotel Clermont or a Ponce 3-star if you want the trail"
      ],
      hidden: [
        "Combined lodging tax about 16.9%",
        "Airport-hotel rideshare twice a day",
        "Buckhead parking and a steakhouse you did not need",
        "Convention-week room surge",
        "Second ticketed morning you stacked on the Aquarium"
      ],
      skip: [
        { name: "A cheap ATL-adjacent hotel", why: "You will Uber downtown twice a day. MARTA exists." },
        { name: "Splitting Buckhead and the Aquarium hotel", why: "Three nights, two towers, one tired card." },
        { name: "Convention weeks", why: "Not the value window. Read the calendar." }
      ],
      tips: [
        "MARTA from the airport. A cheap ATL-adjacent hotel is a rideshare habit.",
        "BeltLine + Ponce City Market is Budget entertainment. The Aquarium is one ticketed morning, not the whole trip.",
        "West Egg or a café breakfast. Mary Mac’s for a meat-and-three — skip a Buckhead steakhouse on Budget.",
        "Convention weeks are not the value window. Check the calendar before you book Downtown.",
        "MARTA / BeltLine day beats a rideshare loop. Do not split Buckhead and the Aquarium hotel in three nights.",
        "Midweek ATL. You already live near a hub if you flew Delta — midweek still wins.",
        "Piedmont Park and MLK National Historical Park are free / cheap. World of Coca-Cola is a pick-one with the Aquarium.",
        "Hotel Clermont or a Ponce 3-star if you want the trail. Four Seasons Midtown is Splurge."
      ],
      related: [
        { href: "/guides/nola", label: "New Orleans money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "paris",
      label: "Paris",
      place: "Paris, France",
      hook: "Bakeries and one reserved dinner beat a week of tourist-menu prix fixes on the tower steps.",
      blurb: "Metro-line lodging in the 10th–11th. Palace hotels only if you already priced them.",
      nights: "3–4 nights",
      midrange: "Metro-line 3-star + bakery + one reserved dinner",
      months: "Late January through March, November before holiday lights become a room tax",
      car: "no",
      forWho: [
        "People who will pick an arrondissement they can walk in slippers and tap the Metro without thinking",
        "Anyone who wants one timed museum and dinner on the block"
      ],
      notFor: [
        "Anyone who wants a rental car in Paris",
        "People stacking four museums and a tower-steps formule in one day"
      ],
      aroundKind: "transit",
      aroundRule: "Navigo or a carnet. Stairs are the elevator. The tower is a Trocadéro view on Budget, not a summit default.",
      aroundNoCar: [
        "Metro + RER. A Navigo week (if your days qualify) beats a fistful of t+ tickets",
        "Walk one arrondissement in the morning. Pack light — stairs are common",
        "CDG vs ORY: RER B is the honest CDG move. A taxi is Splurge, not Budget"
      ],
      stayRule: "Ibis or a walk-up on a Metro line in the 10th, 11th, 18th, or 19th. A tower-block view is a tourist tax.",
      eatRule: "Bakery plus coffee on your block every morning. Skip anything on the tower, the hill, or the museum steps.",
      doRule: "Louvre or Orsay — pick one timed ticket. A four-museum day is how you buy souvenirs you will not remember.",
      days: [
        { title: "Your arrondissement, then the river", bullets: ["Bakery crawl on the block", "Île de la Cité / Left Bank walk", "Eiffel from Trocadéro at dusk — do not eat on the steps"] },
        { title: "One timed museum", bullets: ["Louvre or Orsay — you already picked", "Late afternoon in the Marais or along the Canal", "Neighborhood dinner"] },
        { title: "A cemetery, a smaller room, or Versailles if you already priced it", bullets: ["Père Lachaise or a second smaller museum (not a third mega)", "Versailles only if you accept the RER half-day", "Evening: fromagerie, wine, stairs, bed"] }
      ],
      book: [
        "Louvre or Orsay timed ticket — pick one",
        "One 10th–11th dinner if you want Septime / Frenchie / Le Comptoir",
        "Navigo if your days qualify, otherwise a carnet",
        "Atlantic crossing 2–4 months out, midweek. Open-jaw (in Paris, out Rome) often beats two one-ways"
      ],
      hidden: [
        "VAT in the room rate — still not a US-style surprise, but mid already eats a US city budget",
        "Taxis from CDG vs RER B",
        "Tower summit + Sainte-Chapelle stacked as “both”",
        "Museum-steps formules",
        "Bags on stairs if you packed like a palace"
      ],
      skip: [
        { name: "Restaurants on the tower, the hill, or the museum steps", why: "A tourist menu with a view surcharge. Walk five minutes." },
        { name: "A four-museum day", why: "One timed ticket. The rest is walking you will actually remember." },
        { name: "A Gare hotel for the whole week", why: "Fine for an early arrival. Sad as a neighborhood." }
      ],
      tips: [
        "Bakery breakfast on your block. Du Pain et des Idées class if you slept in the 10th — not the hotel buffet.",
        "Bouillon Chartier / Pigalle or a formule du midi. Skip restaurants on the tower, the hill, and the museum steps.",
        "Navigo or a carnet. Taxis are Splurge. Pack light — stairs are common.",
        "Louvre or Orsay — pick one timed ticket. A four-museum day is how you buy souvenirs you will not remember.",
        "Eiffel from Trocadéro or Champ de Mars on Budget. The summit is a pick-one with Sainte-Chapelle.",
        "Book the Atlantic crossing 2–4 months out, midweek. Open-jaw (in Paris, out Rome) often beats two one-ways.",
        "Fromagerie + wine is a valid dinner. Palace-hotel dining only if you already priced it.",
        "10th–11th or 18th–19th on a Metro line. A tower-block view is a tourist tax."
      ],
      related: [
        { href: "/guides/london", label: "London money guide" },
        { href: "/guides/rome", label: "Rome money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "london",
      label: "London",
      place: "London, United Kingdom",
      hook: "Excellent food two Tube stops from the postcard. Tesco meal deal + Oyster is the Budget plan.",
      blurb: "South Bank, Bloomsbury, or South Ken. £8 pints are already in the luxury math.",
      nights: "3–4 nights",
      midrange: "Zone 1–2 3-star + contactless cap + one free museum",
      months: "January, February, November",
      car: "no",
      forWho: [
        "People who will tap a bank card, hit the daily cap, and sleep in Zone 1–2",
        "Anyone who wants free museums and one West End seat"
      ],
      notFor: [
        "Anyone who wants a rental car (Congestion Charge on purpose)",
        "People stacking the Eye and the Tower on Budget"
      ],
      aroundKind: "transit",
      aroundRule: "Contactless. Never a car. Zone 1–2 lodging.",
      aroundNoCar: [
        "Contactless daily cap on Tube / bus. A Visitor Oyster only if you like souvenirs",
        "South Bank, Bloomsbury, or South Ken — one neighborhood, no car",
        "LHR via Elizabeth Line or Piccadilly. LGW and STN are different ground math — price it"
      ],
      stayRule: "Premier Inn or Travelodge on Budget. The Hoxton if you want restaurants on the block. Mayfair if you already priced it.",
      eatRule: "Bakery or Tesco breakfast. Borough or Maltby lunch. Zone 2 Indian or Turkish dinner — not a West End prix fixe every night.",
      doRule: "British Museum or National Gallery are free. The Eye is a pick-one with the Tower.",
      days: [
        { title: "Your Zone 1–2 neighborhood", bullets: ["Bakery, South Bank or Bloomsbury walk", "Tesco or Borough lunch", "Evening in the same neighborhood"] },
        { title: "One free museum, maybe a rush seat", bullets: ["British Museum or National Gallery", "West End day seats if you already priced one show", "Not the Eye and the Tower"] },
        { title: "A second neighborhood — still Zone 1–2", bullets: ["South Ken museums or a Zone 2 dinner", "Open-jaw with Paris if you already priced the Atlantic", "Home on the Elizabeth Line"] }
      ],
      book: [
        "West End rush / day seats if that is the night",
        "Contactless — you almost never need a paper ticket",
        "Atlantic crossing 2–4 months out, midweek",
        "Skip a rental. Congestion Charge is real"
      ],
      hidden: [
        "£8 pints already in the luxury math",
        "Congestion Charge if you rented anyway",
        "Eye + Tower stacked on Budget",
        "Hotel breakfast that was not actually in the rate",
        "LGW / STN ground vs Elizabeth Line from LHR"
      ],
      skip: [
        { name: "A rental car", why: "Congestion Charge you do not want." },
        { name: "The Eye and the Tower on Budget", why: "Pick one. South Bank walk is already the product." },
        { name: "West End prix fixe every night", why: "One after theatre. Zone 2 dinner the rest." }
      ],
      tips: [
        "Contactless daily cap. You almost never need a paper ticket. A rental car is a Congestion Charge you do not want.",
        "Premier Inn or Travelodge Zone 1–2 on Budget. Mayfair is Splurge — luxury is the room plus £8 pints.",
        "Bakery or Tesco breakfast. Borough or Maltby lunch. Zone 2 Indian or Turkish dinner, not a West End prix fixe every night.",
        "British Museum or National Gallery are free. The Eye is a pick-one with the Tower — not both on Budget.",
        "West End rush / day seats before a full-price orchestra. Splurge is one reserved seat, not three.",
        "Book the Atlantic 2–4 months out, midweek. Open-jaw with Paris or Dublin often beats two one-ways.",
        "Skip a paid Eye ticket on Budget — South Bank walk is the product.",
        "Hotel-included breakfast only if it is actually in the rate. Pret is a fallback, not a personality."
      ],
      related: [
        { href: "/guides/paris", label: "Paris money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "rome",
      label: "Rome",
      place: "Rome, Italy",
      hook: "The closer the monument, the worse the carbonara. Coperto is real — budget it.",
      blurb: "Trastevere for the walk, Termini if you land late. One timed Colosseum, not three interiors in a day.",
      nights: "3–4 nights",
      midrange: "Trastevere or centro 3-star + one timed ruin + dinner across the river",
      months: "Late January through March, November before nativity crowds",
      car: "no",
      forWho: [
        "People who will walk the centro until the stones blur, then eat where the photo menus are not",
        "Anyone who will book one timed interior a day"
      ],
      notFor: [
        "Anyone who wants a taxi as the default in the centro",
        "People stacking Colosseum, Vatican, and a golf-cart forum in one day"
      ],
      aroundKind: "transit",
      aroundRule: "Walk the centro. Metro to the Vatican or Termini. Taxis are Splurge — and still stuck.",
      aroundNoCar: [
        "Walk Trastevere, the Pantheon neighborhood, and Testaccio. Pack light; stairs are the elevator",
        "Metro A/B for Vatican and Termini hops. A 48- or 72-hour pass if you will ride",
        "FCO via Leonardo Express to Termini if you land late — then own that neighborhood or move in the morning"
      ],
      stayRule: "A 2-star over the river in Trastevere, or Prati near Ottaviano if the centro is sold out. Termini is fine the night you land late.",
      eatRule: "Cornetto standing at the bar. Trastevere or Testaccio at night. Skip the photo-menu carbonara on Piazza Navona.",
      doRule: "Colosseum plus Forum timed, or Vatican Museums — pick a pace. Do not stack three ticketed interiors in one day.",
      days: [
        { title: "Centro on foot, Trastevere at night", bullets: ["Pantheon neighborhood in daylight, cornetto at the bar", "Dinner over the river", "No taxi. No Navona carbonara"] },
        { title: "One timed ruin", bullets: ["Colosseum and Forum, or the Vatican — you already picked", "Evening in Testaccio", "Do not add a golf-cart"] },
        { title: "A quieter morning, then stop stacking interiors", bullets: ["Prati or a second walk, not a third ticketed ceiling", "La Pergola is Splurge", "Roscioli-adjacent is enough"] }
      ],
      book: [
        "Colosseum + Forum timed, or Vatican Museums — pick one pace",
        "One dinner if you want a named trattoria",
        "Leonardo Express if you land late at FCO",
        "Open-jaw with Paris or Venice often beats a backtrack"
      ],
      hidden: [
        "Coperto and bread you did not order",
        "Taxi from FCO vs Leonardo Express",
        "Golf-cart forum tours",
        "Three ticketed interiors in one day (you will remember the line)",
        "Bags on stairs"
      ],
      skip: [
        { name: "Photo-menu carbonara on Navona", why: "Walk to Trastevere or Testaccio." },
        { name: "Three ticketed interiors in one day", why: "You will remember the line, not the ceiling." },
        { name: "Golf-cart forum tours", why: "Daylight centro walks are Budget and better." }
      ],
      tips: [
        "Cornetto and coffee standing at the bar. The hotel breakfast is a tourist menu with orange juice.",
        "Trastevere or Testaccio dinner. Skip the photo-menu restaurant on Piazza Navona.",
        "Coperto is a line item, not a scam. Budget it. Bread you did not order can be too.",
        "Colosseum + Forum timed, or Vatican Museums — pick a pace. Do not stack three ticketed interiors in one day.",
        "Golf-cart forum tours are optional. Daylight centro walks are Budget.",
        "Midweek FCO, 2–4 months out. Open-jaw with Paris or Venice often beats a backtrack.",
        "Prati near Ottaviano if the centro is sold out — Metro to the Vatican, calmer nights.",
        "La Pergola is Splurge. Roscioli-adjacent or a Testaccio trattoria is Mid-range."
      ],
      related: [
        { href: "/guides/paris", label: "Paris money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "tokyo",
      label: "Tokyo",
      place: "Tokyo, Japan",
      hook: "Tokyo can be cheap if you let it. Convenience-store breakfast is not a compromise — hotel breakfast is.",
      blurb: "Business hotel next to a JR or Metro station. A JR Pass is usually a bad buy on a 5-night city trip.",
      nights: "4–5 nights",
      midrange: "Business hotel over a station + konbini + one sushi counter",
      months: "Late January through early March, June if you accept rain for rooms",
      car: "no",
      forWho: [
        "People who will sleep above a JR or Metro line and tap Suica",
        "Anyone who will pick a ward and walk it"
      ],
      notFor: [
        "Anyone faking Kyoto as a Tokyo day",
        "People buying a JR Pass for a 5-night city trip"
      ],
      aroundKind: "transit",
      aroundRule: "Suica / PASMO on JR and Metro. Station downstairs is the lodging product. Taxis are Splurge.",
      aroundNoCar: [
        "IC card (Suica / PASMO / Welcome Suica). Tap and stop thinking",
        "Shinjuku, Shibuya, Ueno, or Tokyo Station — pick a ward and walk it",
        "NRT vs HND: Haneda is the closer gift. Narita is a Skyliner or N’EX line you should price"
      ],
      stayRule: "APA, Super Hotel, or Toyoko Inn next to Shinjuku or Ueno. Capsule only if you packed a cube.",
      eatRule: "Onigiri and coffee. Conveyor sushi and ramen at lunch. Book one sushi counter if you already priced it — before you land.",
      doRule: "One ward a day. Yanaka or Shimokitazawa mornings are free. teamLab or a tower is one ticketed indoor.",
      days: [
        { title: "The ward you booked", bullets: ["Shinjuku or Shibuya on foot", "Convenience-store picnic in a park", "Night walk, one izakaya, Metro home — there is no Kyoto today"] },
        { title: "Asakusa morning, one ticketed indoor", bullets: ["Senso-ji and the river early", "Then teamLab or a museum — one, off-peak if you can", "Evening back in your ward"] },
        { title: "A quiet ward — or Kamakura if you already priced it", bullets: ["Yanaka or Shimokitazawa / Kichijoji for a free morning", "Kamakura only if you accept a half-day out of the city", "Do not fake Kyoto"] }
      ],
      book: [
        "One sushi counter if that is the treat — before you land",
        "Welcome Suica or IC card",
        "teamLab timed entry if that is the indoor",
        "Haneda if you can; price Narita Skyliner / N’EX if you cannot"
      ],
      hidden: [
        "Hotel breakfast buffet vs konbini",
        "JR Pass on a city-only week",
        "Taxis invented because the hotel is not on a station",
        "Narita ground vs Haneda",
        "Kyoto day that is actually a station and a blur"
      ],
      skip: [
        { name: "The hotel breakfast buffet", why: "Konbini is better and cheaper. This is not a compromise." },
        { name: "A JR Pass on a 5-night city trip", why: "IC card + Metro is the plan. The pass is a souvenir spreadsheet." },
        { name: "Kyoto as a Tokyo day", why: "That is a different trip. You will see a station and a blur." }
      ],
      tips: [
        "Convenience-store onigiri and coffee for breakfast. Hotel buffets are the expensive path.",
        "A JR Pass is usually a bad buy on a 5-night city trip. IC card + Metro is the plan.",
        "APA / Super Hotel / Toyoko Inn next to a station on Budget. Capsule only if you packed a cube.",
        "Conveyor sushi and ramen are Mid-range lunches. Book one sushi counter if you already priced it — before you land.",
        "Skip Golden Week and peak blossom weekends unless that is the trip. Late January is the value window.",
        "Yanaka or Shimokitazawa mornings are free. teamLab or a tower is one ticketed indoor.",
        "Kyoto is a different trip. Do not fake it as a Tokyo day.",
        "The room or the counter, rarely both. Park Hyatt views still end with a Metro ride to dinner."
      ],
      related: [
        { href: "/big-trip", label: "The Big Trip" },
        { href: "/guides/how-much-to-budget-for-vacation", label: "How much to budget" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "cancun",
      label: "Cancún",
      place: "Cancún, Mexico",
      hook: "All-inclusive food is the product. The leak is tips, bottled water you already paid for, and a timeshare morning.",
      blurb: "Hotel Zone value AI or a named 4-star. Confirm the airport transfer is in the rate.",
      nights: "5–7 nights",
      midrange: "Hotel Zone 4-star AI + transfer in the rate + one outing",
      months: "Early May, late September, early October",
      car: "maybe",
      forWho: [
        "People who bought a beach, a buffet, and a transfer — and will sit still",
        "Anyone who will eat on-property and skip the timeshare-day “free” excursion"
      ],
      notFor: [
        "Anyone who forgot the airport transfer and will learn at the dock",
        "People stacking Isla, a cenote, and Chichén Itzá in four days"
      ],
      aroundKind: "fork",
      aroundRule: "The resort is the lodging and the transit. One pre-booked transfer. Downtown is a planned night, not a wandering taxi habit.",
      aroundNoCar: [
        "Airport transfer in the rate — or a pre-booked van. The dock surprise is how a Budget week dies",
        "Hotel Zone bus (R-1) if you will hop. Most AI weeks never need it",
        "CUN is close"
      ],
      aroundCar: [
        "A rental is optional unless this is a ruin week you already priced",
        "Still one property. Use the car for a planned Chichén or cenote day, not nightly Hotel Zone hops",
        "South-of-Zone resorts (Nizuc / Mayakobá) are a different transfer"
      ],
      stayRule: "Hotel Zone value AI. Confirm the van is in the rate. Garden view on purpose. Ocean-view and swim-up upsells are optional.",
      eatRule: "Eat on-property. That is the product. Casual à-la-carte at night. One downtown taco dinner only if the transfer is cheap.",
      doRule: "Beach days are the week. Isla Mujeres ferry or one cenote — pick one. Chichén Itzá is a long day.",
      days: [
        { title: "Arrive, transfer, buffet", bullets: ["The van was in the rate", "Garden view", "Eat on-property. Downtown is not tonight"] },
        { title: "Beach, or one ticketed outing", bullets: ["Isla Mujeres or a cenote — pick one", "Not both", "Not a timeshare morning"] },
        { title: "More beach. Ruin day only if you already priced it", bullets: ["Chichén Itzá is a long day", "Most weeks should stay on the sand you already paid for"] }
      ],
      book: [
        "Confirm the airport transfer is in the rate",
        "Isla Mujeres ferry or one cenote — pick one",
        "Trusted Chichén tour only if that is the long day",
        "Cancel stance in hurricane season"
      ],
      hidden: [
        "Airport transfer not in the rate",
        "Customary tips and bottled water at the dock kiosk",
        "Timeshare-day “free” excursion (a half-day tax)",
        "Ocean-view and swim-up upsells",
        "South-of-Zone transfer if you booked Nizuc / Mayakobá"
      ],
      skip: [
        { name: "The timeshare-day “free” excursion", why: "A half-day tax with a smile." },
        { name: "Bottled water at the dock kiosk", why: "You already paid for water. This is how a Budget week dies." },
        { name: "Ocean-view and swim-up as defaults", why: "Garden view on purpose. Upsells are optional." }
      ],
      tips: [
        "Confirm the airport transfer is in the rate. The surprise van is how a value AI stops being value.",
        "Eat on-property — that is the product. One downtown taco night only if the transfer is cheap.",
        "Skip the timeshare-day “free” excursion. It is a half-day tax.",
        "Do not buy bottled water you already paid for at a dock kiosk.",
        "Isla Mujeres ferry or one cenote — pick one ticketed day. Beach days are the rest.",
        "Chichén Itzá is a long day. Only with a trusted tour if you already priced it.",
        "Hurricane-season deals need a cancel stance. Shoulder May is the heat-for-value trade without the storm math.",
        "Garden view on purpose. Ocean-view and swim-up upsells are optional, not Budget."
      ],
      related: [
        { href: "/allinclusive", label: "All-Inclusive Calculator" },
        { href: "/guides/all-inclusive-resort-cost-guide", label: "All-inclusive cost guide" },
        { href: "/guides/cruise-vs-all-inclusive-cost", label: "Cruise vs all-inclusive" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "oahu",
      label: "Oahu",
      place: "Oahu, Hawaii",
      hook: "Waikiki bus grid. Resort breakfast every morning is how mainland prices follow you across the Pacific.",
      blurb: "Walk-to-beach midrise or a kitchenette. A car becomes mandatory the minute you leave Waikiki on purpose.",
      nights: "5–7 nights",
      midrange: "Waikiki midrise + plate lunch + one reserved bay",
      months: "May, September–early October",
      car: "maybe",
      forWho: [
        "People who will stay on Kalakaua and the #2 / #8 / #13",
        "Anyone who will grocery the condo and treat plate lunch as lunch"
      ],
      notFor: [
        "Anyone stacking Maui into five Oahu nights without a second ticket",
        "People who will park a unused rental in Waikiki for $40–55/night"
      ],
      aroundKind: "fork",
      aroundRule: "TheBus until you leave on purpose. A car is a $40–55 parking line plus a North Shore day you priced.",
      aroundNoCar: [
        "TheBus / HOLO card. A visitor pass can win if you leave Waikiki twice a day",
        "Walk Kalakaua if you slept on it. One block back is the same beach",
        "HNL is close. A neighbor-island hop is a second fare — do not assume it is in the Honolulu ticket"
      ],
      aroundCar: [
        "Parking is $40–55/night if you never leave the grid",
        "Still one base in Waikiki. Use the car for a planned North Shore or Hanauma day",
        "Kahala or Ko Olina usually means a car"
      ],
      stayRule: "Waikiki midrise one block back. Same beach as Kalakaua, less restaurant-row tax. Skip the car if you will stay on TheBus.",
      eatRule: "Grocery the condo. Plate lunch (Rainbow Drive-In / L&L) and poke. Leonard’s malasadas once, not as a meal.",
      doRule: "The sand in front. Hanauma is reserved and ticketed. Pearl Harbor is one somber morning — not a beach day.",
      days: [
        { title: "The beach you walked to", bullets: ["Plate-lunch breakfast, the sand, poke for dinner", "You do not need a car for this day"] },
        { title: "Hanauma or Pearl Harbor — pick one", bullets: ["Reserved bay or a somber morning", "Not both", "Evening back on Kalakaua or one block behind it"] },
        { title: "More sand, or a North Shore day you priced", bullets: ["A car only if this is the day you leave the grid on purpose", "Parking is $40–55 if you never do"] }
      ],
      book: [
        "Hanauma Bay reservation if that is the bay day",
        "Pearl Harbor timed entry if that is the somber morning",
        "HOLO / TheBus pass if you will ride",
        "Neighbor-island hop only with a second ticket"
      ],
      hidden: [
        "Hawaii lodging tax about 17.8%",
        "Waikiki parking $40–55/night",
        "Resort breakfast every morning",
        "Hanauma reservation no-show",
        "Neighbor-island fare you assumed was in the Honolulu ticket",
        "East Coast red-eye vs a fare — price both"
      ],
      skip: [
        { name: "Resort breakfast every morning", why: "Grocery the condo. The view surcharge is real." },
        { name: "A car you will park in Waikiki", why: "Parking is $40–55/night if you never leave the grid." },
        { name: "Stacking Maui into five Oahu nights", why: "A neighbor-island hop is a second ticket." }
      ],
      tips: [
        "Grocery the condo or a plate-lunch breakfast. Resort breakfast every day is mainland prices plus a view surcharge.",
        "Skip the car if you will stay on the Waikiki bus grid. Parking is $40–55/night.",
        "Plate lunch (Rainbow Drive-In / L&L class) and poke. Leonard’s malasadas once, not as a meal.",
        "Hanauma Bay is reserved and ticketed. Pearl Harbor is one somber morning — not a beach day.",
        "Midweek HNL from the West Coast. East Coast origins pay a red-eye or a fare — price both.",
        "A neighbor-island hop is a second ticket. Do not stack Maui into five Oahu nights without a second fare.",
        "May and September are the value window. Winter holidays are priced like a souvenir.",
        "Kahala or Ko Olina is Splurge and usually a car. Halekulani is Waikiki luxury if you refuse to leave the grid."
      ],
      related: [
        { href: "/guides/maui", label: "Maui money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "maui",
      label: "Maui",
      place: "Maui, Hawaii",
      hook: "The condo kitchen is the budget. Resort restaurants on Maui are a second lodging charge.",
      blurb: "Kihei kitchen first. Kaanapali walk-to-beach mid. Wailea is the room — do not also buy every excursion.",
      nights: "5–7 nights",
      midrange: "Kihei condo or Kaanapali beach + kitchen a few nights",
      months: "May, September–early October",
      car: "yes",
      forWho: [
        "People who will pick Kihei, Kaanapali, or Wailea and stay there",
        "Anyone who will grocery the first hour and cook two nights"
      ],
      notFor: [
        "Anyone stacking Hana, Haleakalā, and Molokini in four days",
        "People who will hotel-hop coasts for one dinner"
      ],
      aroundKind: "fork",
      aroundRule: "A car is the island once you leave the condo path. Price parking and a grocery stop the first hour.",
      aroundNoCar: [
        "Possible only if you booked a walk-to-beach condo and will not leave that path",
        "Most weeks should not try this — food trucks and Hana both assume a car",
        "Airport shuttle plus a grocery delivery is the honest no-car version"
      ],
      aroundCar: [
        "Pick up the car at OGG and grocery before the condo. The first hour is the budget",
        "Kihei / Wailea / Kaanapali — pick one coast. Do not hotel-hop",
        "Road to Hana is an early start, not a beach day. Haleakalā sunrise is a 2 a.m. ticket"
      ],
      stayRule: "Kihei condo first — walk to a food truck. Cook two nights. Kaanapali if you want the beach path. Pick one coast.",
      eatRule: "Grocery the first hour. Food trucks in Kihei or Paia. One fish dinner, not five. Resort breakfast buffets are a second lodging charge.",
      doRule: "The beach in front of the condo is the product. Pick one big outing on purpose.",
      days: [
        { title: "Condo, grocery, the beach in front", bullets: ["Cook tonight", "Walk to a truck if you must go out", "You already paid for this sand"] },
        { title: "One big outing — or none", bullets: ["Hana or Haleakalā, not both", "Rain makes Hana a different brochure", "Come home to the same coast"] },
        { title: "More beach. A boat only if you already priced it", bullets: ["Molokini is optional, not a default", "Do not hotel-hop to Wailea for one dinner"] }
      ],
      book: [
        "Haleakalā sunrise reservation if that is the 2 a.m. ticket",
        "Hana as an early start, not a rushed Budget day",
        "Car at OGG plus a grocery stop the first hour",
        "One fish dinner if you want Mama’s — not five"
      ],
      hidden: [
        "Hawaii lodging tax about 17.8%",
        "Resort fees and parking on Kaanapali / Wailea",
        "Car for the week plus gas on Hana",
        "Resort breakfast buffets as a habit",
        "Every excursion stacked on the room"
      ],
      skip: [
        { name: "Road to Hana as a rushed Budget day", why: "Early start, not a beach day. Rain is a different brochure." },
        { name: "Hana + Haleakalā + Molokini in four days", why: "Pick one. The beach you booked is the rest." },
        { name: "Resort breakfast buffets as a habit", why: "A second lodging charge. The kitchen exists." }
      ],
      tips: [
        "Grocery the condo the first hour. Cook two nights. Resort breakfast buffets are a second lodging charge.",
        "Food trucks in Kihei or Paia. One fish dinner, not five.",
        "The beach in front of the condo is the product. Skip Road to Hana as a rushed Budget day.",
        "Haleakalā sunrise is ticketed and a 2 a.m. wake-up — pick it on purpose, not as a default.",
        "Do not stack Hana, Haleakalā, and a Molokini boat in four days.",
        "Resort fees and parking will show up on Kaanapali / Wailea. Add them in your head.",
        "May and September are the value window. Winter holidays are a different island.",
        "Mama’s Fish House is Splurge. The kitchen plus one casual plate is Mid-range."
      ],
      related: [
        { href: "/guides/oahu", label: "Oahu money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "cruise",
      label: "Caribbean cruise",
      place: "Florida ports · 7-night style",
      hook: "The fare includes the dining room. Specialty, drinks, and the dock kiosk are the trap.",
      blurb: "Cabin, automatic gratuities, drinks math, and flights to port. Interior is a bed. The deck is the trip.",
      nights: "7-night style (+ pre-cruise hotel if the flight cannot miss the ship)",
      midrange: "Balcony + dining room + one specialty + drinks after the break-even",
      months: "Early May, early September, late October–early November",
      car: "no",
      forWho: [
        "People who bought an itinerary and a deck, not a porthole",
        "Anyone who will run the drink-package break-even before tapping yes"
      ],
      notFor: [
        "Anyone tapping yes on the drink package without the math",
        "People stacking three dock tours and specialty every night"
      ],
      aroundKind: "ship",
      aroundRule: "The ship is the hotel. The pier is the trap. Price the pre-cruise night if your flight cannot miss the gangway.",
      aroundNoCar: [
        "Fly in the day before if you cannot miss the ship. That hotel is a line, not a maybe",
        "Port parking only if you drove. Rideshare to PortMiami / Port Canaveral / Port Everglades is often cheaper than a week of parking",
        "In port: walk or a pre-negotiated taxi. The “tour” on the pier is the overrun"
      ],
      stayRule: "Interior or obstructed oceanview on Budget. A balcony is the Caribbean product most people actually want — still not a suite.",
      eatRule: "The dining room is already in the fare. Main dining most nights. One specialty night only if you already priced it.",
      doRule: "Sea days are the product. One independent port walk plus one ship excursion — not three dock tours.",
      days: [
        { title: "Embark without missing the ship", bullets: ["Florida port hotel the night before if the flight cannot miss the gangway", "Interior is a bed", "The deck is the evening"] },
        { title: "A sea day you already paid for", bullets: ["Walk the deck, eat in the dining room, skip the spa menu", "Run the drink-package math before you tap yes"] },
        { title: "One port, two ways to spend it", bullets: ["Independent walk or one ship excursion — not three dock tours", "Automatic gratuities are already a line", "Kids soda may be the only package that wins"] }
      ],
      book: [
        "Cabin class and the sailing date — check holiday weeks first",
        "Pre-cruise hotel if the inbound flight cannot miss the gangway",
        "Drink package only after you run the break-even",
        "One ship excursion if you want it — independent walks for the rest"
      ],
      hidden: [
        "Automatic gratuities (age 2+) — not buried in the fare",
        "Drink package you tapped yes on",
        "Specialty and room-service fees",
        "Dock kiosk “tours” and bottled water",
        "Flights to Florida ports plus a pre-cruise hotel",
        "Port parking for the week if you drove"
      ],
      skip: [
        { name: "Tapping yes on the drink package", why: "À-la-carte wins if you are not a five-drink day. Run the break-even." },
        { name: "Three dock tours", why: "One independent walk plus one ship excursion." },
        { name: "Specialty every night", why: "The dining room is the product. One treat night." }
      ],
      tips: [
        "Run the drink-package break-even before you tap yes. À-la-carte wins if you are not a five-drink day.",
        "Interior or obstructed oceanview on Budget. You bought the itinerary and the deck, not the porthole.",
        "Main dining room every night on Budget. One specialty night only if you already priced it.",
        "One independent port walk plus one ship excursion — not three dock tours.",
        "Automatic gratuities are a line (age 2+). They are not optional math and they are not buried in the fare.",
        "Shoulder weeks (early May, early September) cut the cabin and the air to Florida ports.",
        "Kids soda is often the only package that wins on a short sailing. The latte habit is not a package.",
        "Room-service fees add up — backup, not breakfast. The buffet is already in the fare."
      ],
      related: [
        { href: "/cruise", label: "Cruise Cost Calculator" },
        { href: "/blog/cruise-drink-package-break-even-2026", label: "Drink-package break-even" },
        { href: "/guides/how-much-does-a-cruise-cost", label: "How much does a cruise cost" },
        { href: "/cruise-math", label: "Cruise Math hub" }
      ],
      updated: "Checked Sep 2026"
    }),
    G({
      id: "key_west",
      label: "Key West",
      place: "Key West, Florida",
      hook: "Mallory menus are a tax. Cuban breakfast, one named dinner, and sunset from the sidewalk.",
      blurb: "Old Town walkable. A cheap Stock Island room plus a nightly cab is not Budget.",
      nights: "3 nights",
      midrange: "Old Town guesthouse + Cuban breakfast + one named dinner",
      months: "Early May, late September–October after the heaviest summer",
      car: "yes",
      forWho: [
        "People who will walk or bike Old Town and watch sunset from the sidewalk",
        "Anyone who will skip Mallory menus and Stock Island lodging"
      ],
      notFor: [
        "Anyone stacking Tortugas, a sunset sail, and a seaplane in three nights",
        "Fantasy Fest if you did not come for it"
      ],
      aroundKind: "fork",
      aroundRule: "Walk Old Town. A rental car is a parking fee. Drive-down from Miami is a day you should price as a day.",
      aroundNoCar: [
        "Old Town is the product. Bike or walk. Duval is a street, not a hotel strategy",
        "EYW is tiny and expensive air. Midweek, or accept the premium",
        "Stock Island lodging only if you like the commute. Most people should not"
      ],
      aroundCar: [
        "Drive-down from Miami is a full day — price it as a day, not a surprise",
        "Old Town parking is a fee. Still one base. Use the car for the Overseas Highway, not nightly Duval hops",
        "A cheap Stock Island room plus a nightly cab is not Budget"
      ],
      stayRule: "Old Town guesthouse you can walk from. Casa Marina is Splurge. Stock Island plus a cab is not Budget.",
      eatRule: "Cuban Coffee Queen or a ventanita. El Siboney or Garbo’s at night. Blue Heaven early if you already priced the wait.",
      doRule: "Sunset from the sidewalk. Fort Zach for the swim. Dry Tortugas is a full ferry day — only if you already priced it.",
      days: [
        { title: "The island you booked", bullets: ["Ventanita, walk Duval as a street, Fort Zach if you want a swim", "Sunset from the sidewalk", "No Mallory menu"] },
        { title: "One named dinner", bullets: ["El Siboney or Garbo’s, or Blue Heaven if you already priced the wait", "Key lime pie once", "Happy-hour fritters are a snack"] },
        { title: "More walking — Tortugas only if you already priced it", bullets: ["The same Old Town", "Dry Tortugas is a full day", "Do not add a seaplane and a sunset sail on the same card"] }
      ],
      book: [
        "Old Town room you can walk from",
        "Dry Tortugas ferry only if that is the full day",
        "Blue Heaven if you want that wait — go early",
        "EYW midweek, or drive from Miami as a priced day"
      ],
      hidden: [
        "Florida lodging tax about 12.5%",
        "Old Town parking if you drove",
        "Stock Island cab every night",
        "EYW air premium",
        "Mallory menu surcharges on the same sunset",
        "Tortugas + sail + seaplane stacked into three nights"
      ],
      skip: [
        { name: "Mallory Square menus", why: "A tax on the same sunset you can watch from the sidewalk." },
        { name: "A cheap Stock Island room", why: "Plus a nightly cab is not Budget." },
        { name: "Tortugas + a sunset sail + a seaplane", why: "Do not stack three big days into three nights." }
      ],
      tips: [
        "Cuban Coffee Queen or a ventanita breakfast. Mallory Square menus are a tax.",
        "Sunset from the sidewalk. Skip a paid pier ticket on Budget — the sun does the same work.",
        "El Siboney or Garbo’s for Budget dinner. Blue Heaven early if you already priced the wait.",
        "Stay Old Town. A cheap Stock Island room plus a nightly cab is not Budget.",
        "Fort Zach beach + fort is the cheap outdoor ticket. Parasail is optional.",
        "Dry Tortugas is a full ferry day — only if you already priced it. Do not stack Tortugas, a sunset sail, and a seaplane in three nights.",
        "EYW air is a premium. Midweek, or drive from Miami as a priced day, not a surprise.",
        "Key lime pie once. Happy-hour conch fritters are a snack, not dinner."
      ],
      related: [
        { href: "/guides/miami", label: "Miami money guide" },
        { href: "/guides/cruise", label: "Caribbean cruise money guide" }
      ],
      updated: "Checked Sep 2026"
    })
  ];

  var BY_ID = {};
  GUIDES.forEach(function (g) { BY_ID[g.id] = g; });

  global.VM_CITY_GUIDES = {
    ALL: GUIDES,
    BY_ID: BY_ID,
    IDS: GUIDES.map(function (g) { return g.id; })
  };
})(typeof window !== "undefined" ? window : this);
