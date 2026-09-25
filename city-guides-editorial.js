/* Public copy written from city-guides-research.js.
   Loaded after city-guides-a2.js so this file wins on hooks, rules,
   zones, days, hidden costs, skip, tips, and CTAs.
   Does not add a section or change the locked outline.
*/
(function (global) {
  "use strict";

  var R = global.VM_CITY_GUIDE_RESEARCH;
  var pack = global.VM_CITY_GUIDES;
  if (!R || !pack || !pack.ALL) {
    throw new Error("money-guide research notes must load before editorial");
  }

  function z(name, note) { return { name: name, note: note }; }
  function d(title, bullets) { return { title: title, bullets: bullets }; }
  function s(name, why) { return { name: name, why: why }; }

  var E = {
    disney: {
      hook: "Pop Century next to a Skyliner park is a different trip from a monorail Deluxe resort plus Park Hopper. The dining plan is usually how people who booked the cheaper stay end up spending like the expensive one.",
      startHere: "Book Pop Century, Art of Animation, or Caribbean Beach. Grocery the room the night you land. One park per ticket — Hopper only if you switch after lunch.",
      tipsKicker: "Grid first, tickets second",
      cta: "Build the Disney Trip Plan on the resort grid first. Add Hopper or Multi Pass only after that total still fits.",
      stayRule: "Pop, Art of Animation, or Caribbean Beach when the days are Hollywood Studios and Epcot. All-Star if you want the cheapest bus. A monorail Deluxe is a Magic Kingdom commute you decided to buy.",
      eatRule: "Garden Grocer or Winn-Dixie for breakfast. Cosmic Ray’s, Pecos Bill, or Satu’li Canteen for lunch. One table — Sci-Fi Dine-In, ‘Ohana, or California Grill — not a dining plan.",
      doRule: "One park on the ticket you hold. The Skyliner day is Hollywood Studios or Epcot. Magic Kingdom from those resorts is a bus, not a gondola.",
      zones: [
        z("Skyliner Value", "Pop or Art of Animation, about $150–310 before tax — gondola to Studios and Epcot, bus to Magic Kingdom"),
        z("All-Star bus", "Cheapest on-property bus. Osceola lodging tax is 13.5%, higher than the 12.5% rate on other Walt Disney World rooms"),
        z("Moderate campus", "Caribbean Beach or Port Orleans, about $280–450 before Florida’s 12.5% lodging tax"),
        z("Monorail Deluxe", "Grand Floridian, Contemporary, or Polynesian — about $500–750 because the Magic Kingdom ride is the product"),
        z("International Drive", "Off-property rooms start nearer $140–280, then $35 a day in park parking plus a car")
      ],
      days: [
        d("Magic Kingdom, then Springs", ["Rope-drop Fantasyland or Tomorrowland and stop adding parks", "Mobile-order Pecos Bill or Cosmic Ray’s; dinner at the resort food court", "Disney Springs at night — not an Epcot fireworks Hopper"]),
        d("Skyliner to Studios or Epcot", ["Hollywood Studios from Pop, Art of Animation, or Caribbean Beach", "Multi Pass only on a peak Studios or Magic Kingdom day — about $16–32", "Back on the gondola for the resort food court"]),
        d("Animal Kingdom or a pool day", ["Animal Kingdom with lunch at Satu’li Canteen, or a Caribbean Beach pool day", "No Hopper. A second single-park ticket is the other choice", "Memory Maker, about $185 in the calculator, only if every park day is a photo day"])
      ],
      hidden: [
        "Florida lodging tax about 12.5% on the room; All-Star resorts in Osceola County are 13.5%",
        "6.5% sales tax on tickets and on Lightning Lane",
        "$35 a day to park at the gate if you drive; resort guests do not pay that",
        "MCO transfer — Magical Express is gone; the calculator uses about $130 round trip for a family of 4",
        "Lightning Lane about $16–32 a person and Memory Maker about $185 if you add them at the gate"
      ],
      skip: [
        s("The dining plan", "The calculator’s typical food day is about $215 for four. Pay as you go."),
        s("Hopper on a short stay", "The add-on runs about $65–105 a ticket unless you switch parks after lunch."),
        s("International Drive plus a rental", "You added $35 park parking and a drive the bus already covered.")
      ],
      tips: [
        "Money edge: Skyliner resorts reach Hollywood Studios and Epcot. They do not reach Magic Kingdom. If those two parks are the trip, do not pay for a monorail Deluxe.",
        "Multi Pass earns its keep on a peak Magic Kingdom or Hollywood Studios day. Animal Kingdom’s lane is the cheap one, about $16–17, and often not the purchase.",
        "Ask for a Riviera-side room at Caribbean Beach so the gondola is a walk, not an extra campus bus.",
        "A Tuesday or Wednesday MCO arrival beats a Saturday check-in on the same resort.",
        "The refillable mug pays only if breakfast is at the resort every morning. Otherwise it is a souvenir."
      ]
    },
    anaheim: {
      hook: "Harbor Boulevard puts you within walking distance of both Disneyland parks. Santa Monica, a dining plan, and a Universal day are three ways to spend that same money somewhere else.",
      startHere: "Candy Cane Inn or another Harbor walk. Albertsons or Target the night you land. Disneyland one day, California Adventure the next, and leave Universal in Los Angeles.",
      tipsKicker: "Harbor first, Hopper later",
      cta: "Build the Anaheim Trip Plan from Harbor Boulevard. Add Lightning Lane on the Disneyland day only if that total still works.",
      stayRule: "A Harbor Boulevard 3-star you can walk, or Pixar Place if you want the Downtown Disney path. Grand Californian is the Splurge walk into California Adventure. Santa Monica is a different city.",
      eatRule: "Breakfast from Albertsons or Target. Mobile-order inside the park you already entered. One table at Carthay Circle, Lamplight Lounge, or Napa Rose — not a dining plan.",
      doRule: "One park a day. Downtown Disney is a free-to-enter dinner, not a third ticket. Universal Studios Hollywood has its own parking and its own day.",
      zones: [
        z("Harbor Boulevard", "Candy Cane Inn or Castle Inn — walk or a short shuttle, about $250–360 before Anaheim’s 17% lodging tax"),
        z("Downtown Disney path", "Pixar Place or Hotel Lulu. You can eat here without a park ticket"),
        z("Convention hotels", "Hilton Anaheim — a shuttle, still Anaheim, not a Los Angeles base"),
        z("Santa Monica base", "A Westside room plus about 90 minutes each way. That transfer can cost a park ticket")
      ],
      days: [
        d("Disneyland, then Harbor", ["Rope-drop Adventureland or Galaxy’s Edge and stay in one park", "Grocery breakfast, mobile-order lunch", "Naples or Tortilla Jo’s in Downtown Disney if you want a table — no drive to Santa Monica"]),
        d("California Adventure", ["One park: Cars Land or Pixar Pier, not a Hopper dash", "Carthay Circle or Lamplight Lounge only if that reservation exists", "Evening on Harbor Boulevard"]),
        d("A second Disneyland day, or go home", ["Another single-park day beats a Hopper you will not use after lunch", "World of Color is a nighttime show, not a third park", "Universal Studios Hollywood is not this day"])
      ],
      hidden: [
        "Anaheim lodging tax about 17% — this is not Florida’s 12.5%",
        "California sales tax on tickets",
        "Hotel parking if the rental never leaves the garage",
        "SNA versus a cheaper LAX fare plus the ground ride",
        "Lightning Lane and Hopper if you add them on top of the 1-day ticket (mid-season table about $130)"
      ],
      skip: [
        s("The dining plan", "Downtown Disney is a dinner you can buy without a meal plan."),
        s("A Westside hotel", "The drive from Santa Monica eats the park day."),
        s("Universal as a quick add-on", "That is a Los Angeles ticket and a separate parking lot.")
      ],
      tips: [
        "Money edge: You can eat in Downtown Disney without a park ticket. Do not buy a dining plan to get to dinner.",
        "Price the SNA ride against the cheap LAX fare before you call the airfare a win.",
        "ART is for a hotel off the walk. A rental that sits at the hotel is a parking line.",
        "Lightning Lane on the Disneyland day. California Adventure is a second decision.",
        "Midweek beats a Friday arrival in Halloween Time, when the same Harbor room is a different rate."
      ]
    },
    los_angeles: {
      hook: "Los Angeles food is neighborhood food. The bill people remember is the rideshare across town, and the hotel garage they paid for on a night they did not drive.",
      startHere: "Pick Downtown, Koreatown, or Santa Monica and stay there. Porto’s or a bakery in the morning. Getty with a reservation, or one Universal day — not both, and not Disneyland.",
      tipsKicker: "One zip code, one ticketed day",
      cta: "Build the LA Trip Plan with one neighborhood’s hotels and restaurants, then cut anything that requires a cross-town ride.",
      stayRule: "Freehand or Ace if you are Downtown, The Line or Hotel Normandie in Koreatown, Shore Hotel if the sand is the trip. Crossing town for dinner is a second rate.",
      eatRule: "Porto’s or Grand Central Market where you slept. Koreatown BBQ if that is the bed. Providence or n/naka is one tasting, not a drive from Santa Monica.",
      doRule: "Getty Center is free once you reserve it. Universal Studios Hollywood is the paid day, about $100–160. Griffith is the free evening. Disneyland is Anaheim lodging.",
      zones: [
        z("Downtown", "Ace or Freehand, Metro and Grand Central Market. Trip Finder shoulder mid about $270–340 before 15.5% tax"),
        z("Koreatown", "B and D Lines, late food, one rideshare zone instead of a cross-town habit"),
        z("Santa Monica", "Shore Hotel or Palihotel. The E Line if you want Downtown once; dinner stays west"),
        z("Near LAX", "A layover rate. The evening is a shuttle, not a neighborhood")
      ],
      days: [
        d("The neighborhood you booked", ["Downtown: Grand Central Market and the Arts District", "Koreatown: a bakery and barbecue on the same block as the bed", "Santa Monica: the sand and the promenade, dinner still in Santa Monica"]),
        d("Getty or Universal, not both", ["Getty Center if you reserved the free entry — bus or paid parking", "Or Universal Studios Hollywood, about $100–160, as the only ticket", "Griffith Observatory if you did not buy a ticket. Disneyland is not today"]),
        d("The other geography, then stop", ["E Line to Santa Monica if you slept Downtown, back before rush hour", "Or Griffith at sunset if you have not been up the hill", "Dinner in the same zip code as the room"])
      ],
      hidden: [
        "Los Angeles lodging tax about 15.5%",
        "Hotel parking $40–60 a night if you keep a car",
        "A cross-town rideshare — $40 each way is a second dinner",
        "Universal parking and Express if you add them to the gate price (about $159 at the door)",
        "LAX versus BUR or SNA ground transfer"
      ],
      skip: [
        s("Disneyland from Santa Monica", "That is an Anaheim day with a long ride on both ends."),
        s("Casa del Mar or 1 Hotel dining rooms", "Lobby prices. Porto’s and Grand Central Market exist."),
        s("Dinner in a different neighborhood", "The ride can cost more than the plate.")
      ],
      tips: [
        "Money edge: Reserve the Getty. Admission is free. A $40 rideshare each way costs more than the parking.",
        "Compare BUR or SNA ground cost with a cheap LAX fare before you book the flight.",
        "A TAP day pass before a rideshare loop. The E Line is the beach trip from Downtown.",
        "Pay $40–60 for hotel parking only on a day you are actually driving to the Getty, a canyon, or a second beach.",
        "Universal Express is the Splurge add-on. The default paid day is one general ticket, or no ticket at all."
      ]
    },
    nyc: {
      hook: "The subway ride is cheap. The trip gets expensive when the hotel is in the wrong neighborhood and lunch keeps landing in Midtown.",
      startHere: "Sleep on a train you will ride — Lower East Side, downtown, or a Brooklyn stop. Bodega breakfast. One paid thing: the Met, MoMA, or a single Broadway seat.",
      tipsKicker: "The borough is the budget",
      cta: "Build the New York Trip Plan from the subway stop you will sleep near. Add one museum or one show after that.",
      stayRule: "Pod 39, citizenM Bowery, Ace Hotel NoMad, or The Hoxton Williamsburg. Times Square rents you the neon and a resort-style fee.",
      eatRule: "Bodega egg-and-cheese or a bakery. One dinner at L’Artusi, Russ & Daughters Cafe, or farther out on the 7. Le Bernardin or Via Carota is the reservation, not the daily lunch.",
      doRule: "High Line and the Staten Island Ferry are the free skyline. Pay for the Met, MoMA, or a seat at the Gershwin or the Majestic — not three observatories.",
      zones: [
        z("Lower East Side / downtown", "Walk plus subway. The room is not a Times Square rate"),
        z("Brooklyn train stop", "The Hoxton Williamsburg or a G/L-train 2-star — one river, a lower night"),
        z("NoMad", "Ace Hotel, with the 6, R, or W in the neighborhood"),
        z("Times Square", "Neon and a resort-style fee for a room you leave by 9 a.m. Lodging tax is still about 14.75%")
      ],
      days: [
        d("Downtown on foot", ["Bodega breakfast, then the High Line or a Lower East Side walk", "One museum if it is on this side of town", "Dinner at L’Artusi or Russ & Daughters Cafe — not a Midtown salad"]),
        d("One borough dinner", ["The 7 to Jackson Heights or Flushing for the meal", "Or Chinatown if you are already downtown", "Back on the same train. No third observatory"]),
        d("Ferry, or one Broadway seat", ["Staten Island Ferry in daylight", "A seat at the Gershwin or the Majestic if that ticket is the night", "Home on the train you already tapped"])
      ],
      hidden: [
        "New York lodging tax about 14.75%",
        "A hotel resort-style fee on top of some advertised rates",
        "Three observation decks stacked on one card",
        "Broadway fees on top of the seat price",
        "A rideshare when the train you slept on already goes there"
      ],
      skip: [
        s("A Times Square hotel", "You paid for a neighborhood you will leave every morning."),
        s("Summit, Edge, and Top of the Rock", "The ferry already did the skyline."),
        s("A hotel dining room at lunch", "That is the $28 salad, three days in a row.")
      ],
      tips: [
        "Money edge: One dinner on the 7 in Jackson Heights or Flushing costs less than three $28 Midtown salads.",
        "Count OMNY taps before you buy a separate unlimited card. The cap may already be the pass.",
        "The Staten Island Ferry is the skyline. Pay for one museum or one show, not both decks and a third.",
        "A Friday arrival in the same neighborhood is a different room rate. Midweek is the cheaper bed.",
        "Cafe Sabarsky once. A pre-theatre prix fixe every night is a second show you did not buy a ticket for."
      ]
    },
    vegas: {
      hook: "A Tuesday room rate looks cheap until you add the nightly resort fee, a Saturday night, and one steakhouse dinner on the Strip.",
      startHere: "Tuesday through Thursday at Park MGM, New York-New York, or Circa. Add the resort fee before you compare rooms. Walk to the fountains.",
      tipsKicker: "Resort fee before the rate",
      cta: "Build the Vegas Trip Plan with the resort fee inside the room, then add one show.",
      stayRule: "Park MGM, New York-New York, or Horseshoe if you want to walk the Strip. Circa or Ellis Island if you want Fremont. Saturday is a different hotel.",
      eatRule: "Park MGM food hall or Chinatown at District One. Esther’s Kitchen downtown for one sit-down. Bazaar Meat or Hell’s Kitchen once, then back to the food hall.",
      doRule: "Bellagio fountains and the conservatory are free. Mystère or O is the paid night. A table at Omnia or XS is a second ticket.",
      zones: [
        z("Center-Strip", "Park MGM, NYNY, or Horseshoe — walk the fountains. About $190–280 before 13.5% tax and before the fee"),
        z("Fremont", "Circa or Ellis Island. One rideshare to the Strip, not a rental"),
        z("Off-Strip", "Palms or a Station casino — a lower room, and you will ride once"),
        z("Convention week", "Saturday and trade-show dates reprice the same tower. The resort fee is still about $35–55")
      ],
      days: [
        d("Center-Strip on foot", ["Check into Park MGM or New York-New York", "Bellagio fountains and the conservatory — no ticket", "Dinner at the Park MGM food hall or off the carpet"]),
        d("One daytime outing", ["High Roller off-peak, or Red Rock only if a car is already booked for that day", "Otherwise stay on the sidewalk", "The Deuce or the monorail is the backup, not four rideshares"]),
        d("One show, then leave", ["Mystère or O — one ticket", "Not a nightclub table the same night", "Fly before Saturday if the rate is why you came"])
      ],
      hidden: [
        "Resort fee about $35–55 a night, on top of the rate",
        "Lodging tax about 13.5%",
        "Hotel parking if you rented a car to walk the Strip",
        "A second show or a nightclub minimum",
        "Saturday or convention rates versus the Tuesday you used for comparison"
      ],
      skip: [
        s("A rental for Center-Strip", "The walk is the product. Parking is a fee."),
        s("A steakhouse every night", "The food hall is ten minutes off the carpet."),
        s("Omnia or XS the night you have show tickets", "That is a second admission.")
      ],
      tips: [
        "Money edge: The fountains and the conservatory are free. Pay for one show, not a second hotel closer to the water.",
        "Add three nights of resort fee, about $35–55 each, before a Tuesday rate wins the comparison.",
        "Write down the drinks before you buy a package. A comped well drink is not dinner.",
        "One rideshare to Fremont beats a rental you will park at the hotel.",
        "Midweek January or early December, after the holiday parties, is the rate window. Saturday is not."
      ]
    },
    miami: {
      hook: "A few blocks inland from Collins Avenue has the same sand as Ocean Drive without the postcard prices. The expensive mistakes are a Nikki Beach minimum and a rental car you barely use.",
      startHere: "The Gale, Freehand, or The Betsy — not the Ocean Drive postcard. Versailles or a ventanita for breakfast. One other neighborhood: Wynwood, Little Havana, or Brickell.",
      tipsKicker: "Same sand, different menu",
      cta: "Build the Miami Trip Plan a few blocks off Ocean Drive. Add Wynwood or the Everglades, not a cabana minimum.",
      stayRule: "The Gale or a Collins 2-star for the sand. Kimpton EPIC if you want Brickell restaurants and a free Metromover. 1 Hotel or Faena is the Splurge, and the cabana is still extra.",
      eatRule: "Versailles or a ventanita. Yardbird if you want a sit-down off Ocean Drive. Joe’s Stone Crab or Stubborn Seed once, then Cuban breakfast again.",
      doRule: "Lummus or South Pointe is the beach you booked. Wynwood Walls from the sidewalk is the neighborhood. An Everglades airboat is a half-day, not a bottle minimum.",
      zones: [
        z("Collins, off Ocean Drive", "The Gale or Essex House. Same sand, about $250–360 before 13% lodging tax"),
        z("Brickell", "Kimpton EPIC. Metromover is free; one rideshare to the sand"),
        z("Mid-Beach", "Faena or The Setai — quieter, still not an Ocean Drive menu"),
        z("Ocean Drive", "The postcard rate and the tourist menu. The beach is the same one Collins already has")
      ],
      days: [
        d("The sand you booked", ["Versailles or a ventanita, then Lummus Park", "Dinner a few blocks inland at Yardbird, not on Ocean Drive", "No rental for this day"]),
        d("Little Havana or Wynwood", ["One neighborhood: Calle Ocho or Wynwood Walls from the sidewalk", "Back to the same hotel", "Brickell Metromover if you slept on the mainland"]),
        d("South Pointe, or the Everglades", ["South Pointe in the morning", "An Everglades airboat only if you want the humidity and a half-day", "Nikki Beach’s minimum is not the afternoon plan"])
      ],
      hidden: [
        "Miami lodging tax about 13%",
        "MIA versus FLL ground transfer",
        "A rental for a week you spend on one beach grid",
        "Beach-club or cabana minimum at Nikki Beach or 1 Hotel",
        "Ocean Drive menu prices on the same sand as Collins"
      ],
      skip: [
        s("An Ocean Drive hotel", "You paid a premium for a menu you should walk away from."),
        s("Bottle service", "The sand at Lummus was already in the room."),
        s("A car for dinner two blocks away", "Walk, or use the Metromover if you are in Brickell.")
      ],
      tips: [
        "Money edge: Brickell’s Metromover is free. A South Beach resort rate is what you pay to avoid one beach rideshare.",
        "Compare MIA and FLL with the ground ride included. The cheaper airport can lose.",
        "Versailles for breakfast. An Ocean Drive lunch is the same plate with a view surcharge.",
        "Vizcaya is the indoor ticket if you want one. The beach does not need a ticket.",
        "Hurricane-season rates need a fare you can change. The discount is not free if you cannot move the flight."
      ]
    },
    san_francisco: {
      hook: "A Clipper card and a Mission bakery will get you through San Francisco. A Union Square tourist hotel plus Fisherman's Wharf seafood on the same day will not.",
      startHere: "Hotel Emeline or a Ferry Building walk. Tartine or a Mission bakery. Book the Alcatraz ferry before you book a second museum.",
      tipsKicker: "Clipper, then one ferry",
      cta: "Build the San Francisco Trip Plan from the Ferry Building or the Mission. Add Alcatraz after the room, not a Wharf dinner.",
      stayRule: "Hotel Emeline or a Jackson Square room if you want the ferry. HI or a Mission walk-up on Budget. Fairmont or 1 Hotel if the room is the treat. Union Square is the same Muni ride at a higher rate.",
      eatRule: "Tartine or the Ferry Building. A Mission taqueria at lunch. State Bird Provisions or Quince once. The French Laundry is a Napa transfer, not a San Francisco reservation.",
      doRule: "Crissy Field and the Embarcadero are free. Alcatraz is the timed ferry that sells out. A Powell-Hyde cable car is a souvenir fare, not your transit.",
      zones: [
        z("Embarcadero", "Hotel Emeline or a Jackson Square room. Ferry Building on foot. About $300–380 before 16% tax"),
        z("Mission", "Bakery math and Muni. A lower rate than a Union Square lobby for the same rides"),
        z("Nob Hill", "Fairmont or Mark Hopkins. The bus up the hill is a Clipper tap; the cable car is extra"),
        z("Union Square", "Hotel Nikko is fine if BART is downstairs. A tourist-menu lobby is not a different transit system")
      ],
      days: [
        d("Ferry Building and the water", ["Tartine or a Ferry Building breakfast", "Embarcadero to Crissy Field", "Dinner in the Mission or at Zuni — not the Wharf"]),
        d("Alcatraz, then one museum", ["The official Alcatraz ferry, booked ahead", "SFMOMA if you still want an indoor ticket", "Not Napa the same afternoon"]),
        d("Mission, or a Nob Hill bus", ["Mission murals and a taqueria", "Powell-Hyde once if you want the souvenir ride, then a Muni bus", "Skip a third museum"])
      ],
      hidden: [
        "San Francisco lodging tax about 16%",
        "Hotel parking on a Napa day",
        "A cable-car souvenir fare on top of Clipper",
        "Wharf seafood prices versus the Ferry Building",
        "A rideshare over a hill the bus already climbs"
      ],
      skip: [
        s("A Union Square tourist hotel", "Same Muni ride as a Mission or Embarcadero bed, higher rate."),
        s("A Wharf seafood rack", "The Ferry Building is the waterfront meal."),
        s("Alcatraz, Napa, and Yosemite", "One timed ferry is the ticket. The others are different trips.")
      ],
      tips: [
        "Money edge: Ride the Muni bus up Nob Hill on Clipper. Buy the Powell-Hyde cable car once, as a ride, not as your pass.",
        "A visitor passport wins on a four-ride day. Count tomorrow’s rides before you buy it.",
        "Book Alcatraz from the official ferry. It sells out, and a Wharf booth is not the system.",
        "Hotel parking is for a Napa day. The Mission, the Ferry Building, and Crissy Field do not need a car.",
        "State Bird Provisions or Quince is one dinner. Tartine is the next morning."
      ]
    },
    chicago: {
      hook: "Winter is when a Loop or Fulton Market room makes sense. The expensive version is a suburban hotel rate, then Ubering to the Art Institute and a river cruise on the same afternoon.",
      startHere: "Sleep in the Loop or at The Hoxton in Fulton Market. A diner breakfast. One paid indoor: the Art Institute or a Wendella cruise, not both the same afternoon.",
      tipsKicker: "The L, then one indoor",
      cta: "Build the Chicago Trip Plan from the Loop or Fulton Market. Buy one museum or one river cruise after the room.",
      stayRule: "Freehand, HI, or a Loop Hampton so the L is downstairs. The Hoxton if you want Fulton Market. The Langham in winter is when that rate can make sense.",
      eatRule: "A diner or a doughnut, not the hotel. Lou Malnati’s or Giordano’s once. The Publican or Girl & the Goat for the sit-down. Oriole is the Splurge reservation.",
      doRule: "The Riverwalk is free. Pay for the Art Institute or one architecture cruise. The Blue Line from O’Hare is a Ventra fare.",
      zones: [
        z("The Loop", "Hampton or LondonHouse. L downstairs. About $190–320 before roughly 17.4% tax"),
        z("River North", "A 4-star on the river. Still on the L, not a Magnificent Mile default"),
        z("Fulton Market", "The Hoxton. Restaurants over the Mag Mile"),
        z("O’Hare or a suburb", "A cheap rate, then parking and a commute. The Blue Line is the airport move if the bed is downtown")
      ],
      days: [
        d("Riverwalk, no ticket", ["Diner breakfast in the Loop", "Architecture from the sidewalk and the Riverwalk", "Dinner at The Publican if you slept in Fulton Market"]),
        d("One paid indoor", ["Art Institute, or a Wendella architecture cruise — one", "Lou Malnati’s or an Italian beef, not both plus a second museum", "Ventra day pass if you are riding"]),
        d("The lakefront, then stop", ["The lakefront if the weather allows; January is the room-rate window", "Girl & the Goat only if that reservation is the night", "Do not add Lollapalooza-week prices to a winter plan"])
      ],
      hidden: [
        "Chicago lodging tax about 17.4%",
        "A suburban rate plus the downtown commute",
        "A second museum the same day as the Art Institute",
        "Rideshare surge when the Blue or Orange Line is running",
        "Lollapalooza week and Fourth of July room rates"
      ],
      skip: [
        s("An O’Hare hotel for the whole trip", "You will ride downtown anyway. Sleep there."),
        s("Two museums and a cruise in one day", "Pick one paid indoor."),
        s("A Magnificent Mile lunch as the meal plan", "Fulton Market is the dinner neighborhood.")
      ],
      tips: [
        "Money edge: The Blue Line from O’Hare is a Ventra fare. A Friday-night rideshare to the Loop can erase the suburban room you thought you saved.",
        "January is the value window. Lollapalooza week is a different rate for the same Loop.",
        "Art Institute or Wendella — one ticket. The Riverwalk does not charge admission.",
        "Lou Malnati’s once. The Publican is the other meal.",
        "A Ventra day pass before a loop of rideshares."
      ]
    },
    nola: {
      hook: "Spend on Galatoire's or Commander's Palace, and sleep in the Warehouse District or on the St. Charles streetcar line. A Bourbon Street balcony looks good in photos and does nothing for the food bill.",
      startHere: "Warehouse District or the Garden District on the St. Charles line. A Parkway po’boy at lunch. Galatoire’s or Commander’s if that booking is why you came.",
      tipsKicker: "The reservation is the trip",
      cta: "Build the New Orleans Trip Plan around the reservation, then pick a Warehouse or Garden District room that does not eat it.",
      stayRule: "HI or a Warehouse 2-star, Hotel Peter and Paul, or The Pontchartrain on the streetcar. Hotel Monteleone is the Quarter flagship. The balcony premium does not improve the plate.",
      eatRule: "Café du Monde once, then a neighborhood café. Parkway for the po’boy. Galatoire’s or Commander’s Palace for the reservation.",
      doRule: "Daylight in the Quarter, then the St. Charles streetcar through the Garden District. Preservation Hall or Frenchmen Street is the music night. A swamp tour needs a car you already counted.",
      zones: [
        z("Warehouse District", "Streetcar and a walk to dinner. About $200–330 before 16.2% tax, without a balcony premium"),
        z("Garden District", "The Pontchartrain. The St. Charles line is the ride"),
        z("Mid-City", "Canal streetcar to the Quarter. A lower rate than a Bourbon balcony"),
        z("Quarter balcony", "You paid for a photo. Royal Street already has the picture")
      ],
      days: [
        d("Quarter in daylight", ["Café du Monde once, then leave the line", "Walk Royal and Decatur while it is light", "Dinner back in the Warehouse District, not a second courtyard menu"]),
        d("The reservation", ["Parkway po’boy at lunch", "Galatoire’s or Commander’s Palace — the booking", "No haunted-tour stack the same night"]),
        d("Streetcar, or one music room", ["St. Charles streetcar to the Garden District and walk", "Preservation Hall or Frenchmen Street if you want a cover charge", "Whitney Plantation only if a car is already in the plan"])
      ],
      hidden: [
        "New Orleans lodging tax about 16.2%",
        "Quarter balcony premium versus a Warehouse or Garden District rate",
        "A rental you only needed for a swamp or plantation day",
        "Jazz Fest or Mardi Gras dates on a room you booked for the food",
        "A second music cover the night you already have a reservation"
      ],
      skip: [
        s("A Bourbon balcony as the strategy", "The plate does not get better."),
        s("A haunted-tour stack", "Frenchmen Street or Preservation Hall is the night."),
        s("Café du Monde every morning", "Once. Then a neighborhood café.")
      ],
      tips: [
        "Money edge: The St. Charles streetcar is the Garden District tour. The Quarter photo is on the Royal Street sidewalk.",
        "Book Galatoire’s or Commander’s before you book a louder hotel.",
        "A rental is for Whitney Plantation or a Honey Island swamp tour, not for Bourbon at night.",
        "If Jazz Fest or Mardi Gras is not why you are going, those dates are a different room rate.",
        "One cover charge. A second tour the same night is another ticket."
      ]
    },
    philadelphia: {
      hook: "Reading Terminal can feed you twice, and Independence Hall is free if you booked the timed ticket. An airport hotel charges you Regional Rail fare just to start every morning over.",
      startHere: "The Notary or another City Hall walk. Reading Terminal in the morning. Independence Hall on a timed entry, then either the Barnes or the Art Museum — not both.",
      tipsKicker: "Terminal lunch, one museum",
      cta: "Build the Philadelphia Trip Plan from Center City or Old City. Add Reading Terminal and one museum after the room.",
      stayRule: "The Notary, Kimpton Hotel Monaco, or a Center City Hampton. Four Seasons or The Rittenhouse if the room is the treat. An airport hotel owes Regional Rail every day.",
      eatRule: "Reading Terminal for breakfast and a DiNic’s plate. Pat’s or Geno’s once. Vetri or Villa di Roma at night. Zahav only if that dinner is the reason for the trip.",
      doRule: "Book Independence Hall. It is timed and free. Pay for the Barnes or the Philadelphia Museum of Art. Eastern State Penitentiary is a half-day, not a third interior.",
      zones: [
        z("Old City", "Kimpton Hotel Monaco. Walk to Independence. About $200–320 before 15.5% tax"),
        z("Center City", "The Notary. Reading Terminal and City Hall on foot"),
        z("Parkway", "Four Seasons or The Rittenhouse. The museum mile, still one museum"),
        z("PHL airport", "A lower rate and a Regional Rail ride every morning")
      ],
      days: [
        d("Terminal, then the Hall", ["Reading Terminal breakfast", "Independence Hall at the time you booked, then the Liberty Bell", "No hop-on bus"]),
        d("One museum", ["The Barnes or the Philadelphia Museum of Art", "DiNic’s or a market plate for lunch — the cheesesteak was yesterday or not at all", "Old City on foot at night"]),
        d("The neighborhood dinner", ["Villa di Roma or Vetri", "Eastern State only if the museum day is already done", "Regional Rail to PHL, not a taxi habit"])
      ],
      hidden: [
        "Philadelphia lodging tax about 15.5%",
        "Regional Rail every day from an airport hotel",
        "A hop-on bus on top of SEPTA",
        "A second museum admission the same afternoon",
        "Three cheesesteaks sold as a tour"
      ],
      skip: [
        s("An airport hotel", "You will ride Regional Rail every morning."),
        s("Cheesesteak as the itinerary", "One at Pat’s or Geno’s. DiNic’s is the other sandwich."),
        s("Three interiors and a tour bus", "The Hall plus one museum.")
      ],
      tips: [
        "Money edge: Book the free Independence Hall slot first. It still sells out. The Barnes is the museum you pay for.",
        "SEPTA Key or an Independence Pass if you will ride more than twice. A hop-on bus is a second transit product.",
        "Reading Terminal covers breakfast and lunch. The hotel restaurant is the expensive version of a market plate.",
        "One cheesesteak, then DiNic’s roast pork.",
        "Midweek PHL. The Fourth of July week is a different room."
      ]
    },
    atlanta: {
      hook: "MARTA from the airport and a walk from Ponce City Market to Krog Street Market are the cheap Atlanta. A hotel off the train means Ubers you will take twice, and Buckhead is a third fare.",
      startHere: "MARTA from ATL to Midtown or to Hotel Clermont on Ponce. Mary Mac’s for a meat-and-three. Georgia Aquarium or World of Coca-Cola — one morning.",
      tipsKicker: "MARTA in, trail after",
      cta: "Build the Atlanta Trip Plan from Midtown or Ponce. Add one ticketed morning, not a Buckhead steakhouse.",
      stayRule: "Hampton or Home2 in Midtown, or Hotel Clermont on Ponce, so the BeltLine is the evening. Four Seasons is the Midtown flagship. St. Regis Buckhead trades the trail for a different fare.",
      eatRule: "West Egg or a café, then Mary Mac’s. Fox Bros. Bar-B-Q if you are on the trail. Staplehouse or Bacchanalia once. Bones is a Buckhead ride.",
      doRule: "Walk Ponce City Market to Krog Street Market. Pay for the Aquarium or World of Coca-Cola, not both, unless the mornings are on different days and the nights are long enough.",
      zones: [
        z("Midtown", "Hampton or the Georgian Terrace. MARTA and Piedmont. About $180–280 before 16.9% tax"),
        z("Ponce / Old Fourth", "Hotel Clermont. Ponce City Market and the Eastside Trail"),
        z("Downtown, convention week", "Only if the calendar is quiet. Centennial rates are not the normal week"),
        z("ATL-adjacent", "A lower room and an Uber downtown twice a day. MARTA already leaves the airport")
      ],
      days: [
        d("Eastside Trail", ["Café breakfast in Midtown", "Ponce City Market onto the BeltLine", "Dinner on the trail, not in Buckhead"]),
        d("One ticketed morning", ["Georgia Aquarium or World of Coca-Cola", "Piedmont Park or the MLK National Historical Park after", "Back on MARTA. Do not change hotels"]),
        d("Inman Park to Krog", ["Eastside Trail from Ponce City Market through Inman Park to Krog Street Market", "Fox Bros. or Mary Mac’s — one plate", "A Fox Theatre tour only if the Aquarium morning is already behind you"])
      ],
      hidden: [
        "Atlanta lodging tax about 16.9%",
        "Two Ubers a day from an off-train hotel",
        "A second ticketed morning stacked on the Aquarium",
        "Convention-week Downtown rates",
        "A Buckhead rideshare for a steakhouse"
      ],
      skip: [
        s("A hotel that is not on MARTA", "You will pay for the rides the train already runs."),
        s("Aquarium and World of Coca-Cola the same morning", "Pick one."),
        s("Bones on a trail week", "Mary Mac’s and Fox Bros. are the plates.")
      ],
      tips: [
        "Money edge: MARTA from ATL to Midtown is one fare. The BeltLine from Ponce City Market to Krog does not charge admission.",
        "Read the convention calendar before you treat a Downtown rate as normal.",
        "The Aquarium and World of Coca-Cola are two tickets. The trail is not a third.",
        "Fox Bros. or Mary Mac’s. A Buckhead steakhouse adds a ride the trail did not require.",
        "Piedmont Park and the MLK National Historical Park do not sell a ticket. They are the afternoon after one morning admission."
      ]
    },
    paris: {
      hook: "Paris stays affordable when breakfast is a bakery downstairs and you pick one museum. It stops being cheap when the room faces the tower, the summit ticket is from a reseller, and lunch is on the tourist steps.",
      startHere: "A Metro hotel in the 10th or 11th. Breakfast at the bakery downstairs. The Louvre or the Orsay — one — and Septime, Frenchie, or Le Comptoir only if that table is already booked.",
      tipsKicker: "One museum, one booking",
      cta: "Build the Paris Trip Plan from a Metro-line hotel. Add one museum, and the dinner only if you already hold it.",
      stayRule: "Ibis or a walk-up near République or Oberkampf. A canal boutique in the 10th or 11th if you want dinner on the block. Crillon or Bristol when the palace is the point, not the default.",
      eatRule: "Bakery and coffee every morning. Bouillon Chartier or a formule for lunch. A fromagerie on Rue du Faubourg-Saint-Denis is a real dinner. Le Clarence or Epicure is palace dining, its own line.",
      doRule: "Trocadéro at dusk is the tower view. Pay for the Louvre or the Orsay, not both the same day. Versailles is an RER half-day.",
      zones: [
        z("10th–11th", "Canal Saint-Martin, a bakery, the Metro. The room is not a tower surcharge"),
        z("18th–19th", "A cheaper Metro-line room. The bakery is still downstairs"),
        z("5th–6th", "Hôtel Malte or an Odéon 3-star if you want the Left Bank mid"),
        z("Tower-view block", "A tourist menu and a view surcharge. Trocadéro is the free version of the picture")
      ],
      days: [
        d("The block, then one museum", ["Bakery and coffee downstairs in the 10th or 11th — not a hotel breakfast", "Louvre or Musée d’Orsay — one timed ticket", "Dinner on the same Metro line, not a restaurant on the museum steps"]),
        d("Trocadéro, no summit", ["Eiffel Tower from Trocadéro or Champ de Mars at dusk", "Île de la Cité on foot", "No summit ticket and no tower restaurant"]),
        d("Père Lachaise, Rodin, or Versailles", ["Père Lachaise or Musée Rodin if you want a second, smaller stop", "Versailles only as the RER half-day, with its own ticket", "Fromagerie and a bottle, then the stairs home"])
      ],
      hidden: [
        "A tower-view surcharge on top of a 10th-arrondissement rate",
        "Summit ticket plus a museum the same day",
        "A Museum Pass used for a single entry",
        "Versailles ticket and RER fare treated as a free add-on",
        "Paris hotel quotes often already include TVA. Do not add Trip Plan’s 10% Europe assumption on top and call it the statutory rate"
      ],
      skip: [
        s("A restaurant on the tower steps", "Trocadéro is the view. The bakery is the breakfast."),
        s("Four museums in a day", "One timed ticket. A pass wins at two or more."),
        s("A rental car", "The Metro is the product. Stairs are the other one.")
      ],
      tips: [
        "Money edge: See the tower from Trocadéro for free. Buy a Museum Pass only if you will enter two museums.",
        "Check Navigo day-of-week rules before you buy the week. A carnet is the fallback.",
        "Versailles does not share an afternoon with the Louvre.",
        "Trip Finder’s shoulder mid is about $200–350 before you convert. A view block is a surcharge on that band, not a different city.",
        "Breakfast at Crillon or Bristol is its own line. The bakery is the other breakfast."
      ]
    },
    london: {
      hook: "Contactless fare caps and free national museums make London workable. Mayfair lodging plus the London Eye plus the Tower is a week that looks full and costs about twice as much.",
      startHere: "Premier Inn or The Hoxton in Zone 1–2. A Tesco meal deal or a bakery. The British Museum or the National Gallery before you buy the Eye.",
      tipsKicker: "Cap the Tube, skip the paper ticket",
      cta: "Build the London Trip Plan on the contactless cap. Add one free museum or one West End seat, not both landmarks.",
      stayRule: "Premier Inn or Travelodge in Southwark, King’s Cross, or Earl’s Court. The Hoxton if you want restaurants on the block. Claridge’s or The Connaught if Mayfair is the point.",
      eatRule: "Bakery or a Tesco meal deal. Borough Market for one lunch. Dishoom or a Dalston grill for dinner. The Ivy is the reservation, then Tesco again.",
      doRule: "The British Museum and the National Gallery are free. Pay for one West End seat or the Tower, not the Eye and the Tower the same day.",
      zones: [
        z("South Bank", "Premier Inn County Hall class. The river walk is free; the Eye is not"),
        z("Bloomsbury", "Generator London. British Museum on foot, contactless cap for the rest"),
        z("South Ken", "The Resident or a museum-mile room. Not a Mayfair rate"),
        z("Heathrow hotel", "Fine the night you land. A sad week if you stay and ride in every morning")
      ],
      days: [
        d("A free museum", ["British Museum or the National Gallery", "Bakery or Tesco breakfast — hotel breakfast only if it is in the rate", "South Bank walk. No Eye ticket"]),
        d("One West End seat", ["TodayTix or a box-office day seat", "Dishoom or Barrafina if that is the dinner", "Not the Tower the same day"]),
        d("The other neighborhood", ["South Ken museums if you slept nearby, still free where they are free", "Or the Tower if you did not buy a show", "Elizabeth Line home. Not a Heathrow hotel for the week"])
      ],
      hidden: [
        "Heathrow Express versus the Elizabeth Line — different fares, same airport",
        "A Visitor Oyster you did not need because contactless caps",
        "The Eye and the Tower on one day",
        "A full-price West End seat when a day seat existed",
        "UK room quotes usually already include VAT. Do not add a second VAT, and do not treat Trip Plan’s 10% Europe assumption as the London rate"
      ],
      skip: [
        s("A paper Travelcard by default", "Contactless capping is the fare."),
        s("The Eye and the Tower together", "The South Bank walk is the free one. Pick one paid landmark."),
        s("A Heathrow hotel for the week", "It is a landing night.")
      ],
      tips: [
        "Money edge: Price the Elizabeth Line against Heathrow Express before you keep a Heathrow hotel for the whole trip.",
        "Contactless daily cap on Tube and bus. A Visitor Oyster is a souvenir.",
        "Borough Market is one lunch. A Tesco meal deal covers the other two.",
        "The British Museum and the National Gallery are free. Paying for both landmarks is optional.",
        "A West End day seat is the show. A full-price orchestra seat is the Splurge."
      ]
    },
    rome: {
      hook: "Rome is a walking city until you sit down. The money goes to a Piazza Navona table, a golf-cart tour, and a second ruin ticket you tried to squeeze in before lunch.",
      startHere: "Trastevere, or a Prati room near Ottaviano. Cornetto at the bar. Colosseum and Forum one day, Vatican Museums a different day.",
      tipsKicker: "One ruin, then the table",
      cta: "Build the Rome Trip Plan from Trastevere or Prati. Book one timed ruin, not a golf-cart stack.",
      stayRule: "A Trastevere guesthouse or Hotel Nazionale in the center. The Beehive if you land late at Termini. Hotel de Russie or Hotel Eden when the room is the Splurge.",
      eatRule: "Cornetto standing at the bar. Da Enzo al 29 or Flavio al Velavevodetto for the meal, and ask about coperto. La Pergola is one tasting menu, not a nightly habit.",
      doRule: "Pantheon and Trastevere on foot. Pay for the Colosseum and Forum as one timed ticket, or the Vatican Museums, not both before lunch. Skip the golf-cart.",
      zones: [
        z("Trastevere", "Walk the river. Dinner without a photo menu. The bar breakfast is the cheap one"),
        z("Termini", "The Beehive or a 2-star the night you land late. Not automatically the whole week"),
        z("Prati / Ottaviano", "Metro to the Vatican. Calmer rates than a Navona view"),
        z("Navona menus", "Carbonara priced for the piazza. The same pasta costs less in Testaccio or Trastevere")
      ],
      days: [
        d("Centro on foot", ["Cornetto at the bar, not at a Navona table", "Pantheon neighborhood in daylight", "Da Enzo or a Trastevere table at night — ask about coperto"]),
        d("Colosseum and Forum", ["One timed ticket for the Colosseum and the Forum", "No Vatican Museums the same morning", "No golf-cart between them"]),
        d("Vatican, or a Prati morning", ["Vatican Museums on their own day", "Or a walk along the Vatican walls in Prati if you are not buying a second ticket", "Flavio al Velavevodetto if you want Testaccio instead of another interior"])
      ],
      hidden: [
        "Rome’s nightly city fee, a few euros per person, on top of the room — it varies by hotel class",
        "Coperto and bread you did not mean to order",
        "A golf-cart or open-bus ticket for streets you can walk",
        "A second ruin ticket the same day",
        "August and holiday rates in the centro"
      ],
      skip: [
        s("A Navona photo menu", "Trastevere and Testaccio sell the pasta without the piazza premium."),
        s("Colosseum, Vatican, and a golf-cart", "Two tickets and a ride, for one day."),
        s("Hotel breakfast as the default", "The bar is the breakfast price.")
      ],
      tips: [
        "Money edge: Take the cornetto at the bar. A Navona table is the markup, and coperto shows up again at dinner.",
        "Colosseum plus Forum is one timed ticket. The Vatican is a different day.",
        "A 48- or 72-hour Metro pass only wins if you will ride. The centro day is a walk.",
        "Hotel de Russie or Hotel Eden breakfast is the Splurge. The bar cornetto is the other morning, including on a palace night.",
        "A golf-cart sells a walk from Trastevere or Prati."
      ]
    },
    tokyo: {
      hook: "Tokyo stays cheap when the hotel sits above a station and breakfast is a convenience-store onigiri. It gets expensive when the buffet is in the room rate and someone buys a JR Pass for a week that never leaves the Yamanote line.",
      startHere: "APA, Toyoko Inn, or Mitsui Garden over a JR or Metro line. Konbini breakfast. One ward a day. A sushi counter only if you booked it before you landed.",
      tipsKicker: "Suica, not a JR Pass",
      cta: "Build the Tokyo Trip Plan from a station hotel. Add Suica taps and one booked counter, not a nationwide rail pass.",
      stayRule: "APA, Super Hotel, or Toyoko Inn in Shinjuku or Ueno. Mitsui Garden or Hotel Gracery for Mid-range. Park Hyatt or Aman if the room is the treat — you still take the Metro to dinner.",
      eatRule: "Onigiri and coffee. Conveyor sushi or ramen at lunch. Golden Gai or Omoide Yokocho for the izakaya. Sushi Saito or a Ginza counter only if it was booked before the flight.",
      doRule: "Walk the ward you booked. Sensō-ji at opening is free. teamLab Planets is the timed ticket. Kamakura is a half-day, not a fake Kyoto.",
      zones: [
        z("Shinjuku / Shibuya", "APA or Toyoko Inn over a JR or Metro line. The lobby konbini is the breakfast"),
        z("Ueno / Asakusa", "A cheaper station hotel. Sensō-ji in the morning"),
        z("Ginza / Marunouchi", "Mitsui Garden or Palace Hotel when the room is the treat"),
        z("Narita hotel", "A crash pad the night you land. The Skyliner or N’EX fare is the cost of not flying Haneda")
      ],
      days: [
        d("The ward you booked", ["Konbini breakfast", "Shinjuku or Shibuya on foot", "Golden Gai or Omoide Yokocho — one izakaya"]),
        d("Asakusa, or teamLab", ["Sensō-ji at opening, free", "teamLab Planets only if that timed ticket is the indoor", "Not both plus a Kamakura afternoon"]),
        d("A quieter ward", ["Yanaka or Shimokitazawa in the morning", "Sushi Saito or a Toyosu outer-market counter only if the booking exists", "No JR Pass math on a city day"])
      ],
      hidden: [
        "Narita Skyliner or N’EX fare if you did not fly Haneda",
        "A hotel breakfast buffet versus konbini prices",
        "A JR Pass on a Tokyo-only week",
        "teamLab timed entry on top of a museum the same day",
        "A small accommodation tax outside the rate that already includes consumption tax"
      ],
      skip: [
        s("A JR Pass for a city week", "Suica or PASMO already covers the rides you will take."),
        s("The hotel buffet", "The konbini is in the station you slept above."),
        s("Kyoto as a Tokyo day", "Kamakura is the half-day. Kyoto is a different trip.")
      ],
      tips: [
        "Money edge: Buy Suica or PASMO for Tokyo. A JR Pass on a city-only week is a national ticket you will not ride.",
        "Haneda is the closer airport. Add the Narita train fare before you celebrate a cheaper flight.",
        "Sensō-ji at opening is free. teamLab Planets is the ticket.",
        "Book the sushi counter before you land, or eat conveyor sushi and keep the room.",
        "Yanaka or Shimokitazawa is the free afternoon. Ginza is only the counter you booked before the flight."
      ]
    },
    cancun: {
      hook: "An all-inclusive in the Hotel Zone already covers the beach and the buffet. It did not buy the airport transfer, a timeshare morning, or a rental car parked under the tower.",
      startHere: "Confirm the van is inside the Hyatt Ziva, Moon Palace, or Riu rate. Eat on property. One outing — Isla Mujeres or a cenote — not both, and not Chichén the same day.",
      tipsKicker: "The van, then the beach",
      cta: "Build the Cancún Trip Plan with the airport van inside the rate. Add one outing, not a timeshare morning.",
      stayRule: "Riu or an Oasis-class garden view on Budget. Hyatt Ziva or Moon Palace when the transfer is in the rate. Le Blanc or Nizuc is the Splurge, and Nizuc is a different transfer.",
      eatRule: "The Riu or Hyatt Ziva buffet is what you paid for. A Parque de las Palapas taco run only if the taxi is cheap. A specialty restaurant at Le Blanc or Ziva is one night, not a timeshare lunch.",
      doRule: "The beach in front of the resort is the week. The R-1 bus is the Hotel Zone hop. Isla Mujeres or one cenote. Chichén Itzá is its own booked day.",
      zones: [
        z("Hotel Zone value", "Riu class, garden view on purpose. Quoted in USD, about $200–330 in the shoulder band"),
        z("Hotel Zone 4-star", "Hyatt Ziva or Moon Palace — only if the airport van is in the rate"),
        z("Downtown", "A non-AI trip. You will pay for meals the resort rate already included"),
        z("Timeshare desk", "A morning and a van. Not a free excursion")
      ],
      days: [
        d("Arrive, van, buffet", ["The van was in the rate — confirm before you leave the airport", "Garden view, not a surprise swim-up upsell", "Dinner on property"]),
        d("Beach, or one outing", ["The beach in front of the resort", "Isla Mujeres ferry or one cenote — one", "Not a timeshare presentation"]),
        d("Hotel Zone sand, or Chichén", ["R-1 bus if you want a different stretch of the zone", "Chichén Itzá only as a pre-booked full day", "The Isla ferry does not also fit"])
      ],
      hidden: [
        "Visitax about $15 a person at Cancún International",
        "Hotel Zone environmental fee about $4 a room per night",
        "Airport van if it was not in the rate",
        "Cash tips and dock-kiosk water",
        "A rental for a beach you can reach on the R-1"
      ],
      skip: [
        s("A timeshare morning", "It takes the beach day you paid for."),
        s("A rental on an all-inclusive week", "You will park it at the resort."),
        s("Isla, a cenote, and Chichén", "Three outings. Pick one.")
      ],
      tips: [
        "Money edge: If the airport van is not in the rate, the cheaper all-inclusive is not cheaper. Price the van before you compare two resorts.",
        "Garden view is the rate you compared. A swim-up upgrade at the desk is a different room.",
        "The R-1 bus is the hop along the zone. A rental is for a ruin day, not for Tuesday’s beach.",
        "Customary tips are cash on top of a prepaid week.",
        "Chichén Itzá does not share a day with Isla Mujeres."
      ]
    },
    oahu: {
      hook: "Waikiki on TheBus, with a plate lunch, is a complete week. Resort breakfast and a rental that sleeps in a $40–55 garage are how the same beach gets expensive.",
      startHere: "The Equus, a Kuhio room, or the Outrigger. Rainbow Drive-In or a grocery run. One reserved outing — Hanauma Bay or Pearl Harbor, not both.",
      tipsKicker: "TheBus until you leave",
      cta: "Build the Oahu Trip Plan from Waikiki, one block back. Add TheBus. Add a car only on the day you leave the grid.",
      stayRule: "The Equus or a Kuhio 2-star, one block back. Outrigger or ‘Alohilani if you want Kalakaua. Halekulani is the Splurge. Kahala or Ko Olina assumes a car.",
      eatRule: "Grocery or Rainbow Drive-In and L&L. Helena’s or Highway Inn for one dinner. La Mer or House Without a Key if the view is the reservation, then grocery breakfast again.",
      doRule: "Kuhio Beach does not need a car. TheBus or a HOLO card when you leave Waikiki. Hanauma Bay and Pearl Harbor are two timed tickets — pick one.",
      zones: [
        z("Waikiki, one block back", "Kuhio or The Equus. Same beach, less Kalakaua. About $310–380 before Hawaii’s 17.75% tax"),
        z("Kalakaua walk", "Outrigger or Hilton. TheBus still works"),
        z("Kahala or Ko Olina", "Quieter water. A car becomes the default"),
        z("A parked rental", "$40–55 a night in Waikiki on days you do not drive")
      ],
      days: [
        d("The beach in front", ["Grocery or Rainbow Drive-In", "Kuhio Beach. No car", "Dinner at Highway Inn or back to the grocery"]),
        d("One reserved outing", ["Hanauma Bay if you reserved it, or Pearl Harbor if that is the timed ticket", "TheBus or a car you rented for this day only", "Not both tickets"]),
        d("North Shore, or stay put", ["North Shore only if the car is already out", "Otherwise another Waikiki beach day and Leonard’s once, as a snack", "No inter-island flight inside this week"])
      ],
      hidden: [
        "Hawaii lodging tax about 17.75% on a pre-tax quote",
        "Rental parking $40–55 a night in Waikiki",
        "Resort breakfast versus a plate lunch",
        "A second timed ticket — Hanauma and Pearl Harbor",
        "A neighbor-island flight sold as an afternoon"
      ],
      skip: [
        s("A car that never leaves Waikiki", "You are paying $40–55 to park it."),
        s("Resort breakfast every morning", "Rainbow Drive-In and L&L are the plate."),
        s("Hanauma and Pearl Harbor and a flight to Maui", "One timed outing. Maui is a different ticket.")
      ],
      tips: [
        "Money edge: Leave the rental until the day you drive to Hanauma or the North Shore. Parking it in Waikiki the other nights is $40–55.",
        "Kahala and Ko Olina assume a car. If the bed is there, plan the drive — do not also pay Waikiki parking for a car you left in town.",
        "TheBus or a HOLO card covers a Waikiki week that does not leave the grid.",
        "Pick Hanauma Bay or Pearl Harbor. Book the timed entry before you assume the day is free.",
        "La Mer is one dinner. The Halekulani breakfast buffet is not the daily plan."
      ]
    },
    maui: {
      hook: "A Kihei condo with a kitchen already includes the beach in front of it. The expensive week stacks the Road to Hana, a Haleakalā sunrise, and a Molokini boat as if they were errands.",
      startHere: "A Kihei condo with a kitchen. Grocery the first hour after OGG. One big day — Road to Hana, Haleakalā sunrise, or a Molokini boat — then the same coast.",
      tipsKicker: "The kitchen is the budget",
      cta: "Build the Maui Trip Plan from one coast and a kitchen. Add one outing, not Hana plus a summit plus a boat.",
      stayRule: "A Kihei condo (Punahoa or Kohea Kai class) if you will cook. Sheraton or Westin Maui if you want the Kaanapali path. Grand Wailea, Andaz, or Four Seasons is the Splurge — still one coast.",
      eatRule: "Grocery at the first market. Kihei Caffe or Paia Fish Market for one plate. Mama’s Fish House or Spago once. Skip the Westin or Sheraton breakfast buffet.",
      doRule: "The beach in front of the condo is day one. Haleakalā sunrise is its own reservation and a 2 a.m. start. Road to Hana is a different day. Molokini is a third.",
      zones: [
        z("Kihei kitchen", "Condo first. About $420–520 before 17.75% tax in the shoulder band, higher in winter"),
        z("Kaanapali path", "Sheraton or Westin. Add the resort fee and parking before you compare it with Kihei"),
        z("Wailea", "Grand Wailea or Four Seasons. The room is the treat — not also every boat"),
        z("A second coast", "A hotel change for one dinner. Mama’s does not require a new bed")
      ],
      days: [
        d("The beach you paid for", ["Grocery the first hour", "Keawakapu or Kaanapali — the sand in front", "Cook dinner"]),
        d("One big outing", ["Road to Hana as an early start, or Haleakalā sunrise as the 2 a.m. ticket — one", "Home to the same coast", "Not a boat the same day"]),
        d("Keawakapu or Kaanapali, unless the boat is booked", ["Keawakapu or Kaanapali — the sand in front of the bed", "Pride of Maui or Kai Kanani only if Molokini is the booked day", "Spago or Mama’s Fish House only as the one reservation"])
      ],
      hidden: [
        "Hawaii lodging tax about 17.75% on a pre-tax quote",
        "Resort fees and parking on Kaanapali and Wailea",
        "A resort breakfast buffet",
        "Haleakalā reservation on top of a boat on top of Hana",
        "A second lodging night so you can be closer to one restaurant"
      ],
      skip: [
        s("Hana, Haleakalā, and Molokini in four days", "Pick one. The beach is the rest."),
        s("Road to Hana as a casual afternoon", "It is an early start, and the weather can close it."),
        s("Resort breakfast as the habit", "The kitchen is why the condo was cheaper.")
      ],
      tips: [
        "Money edge: Book Haleakalā sunrise as its own day. It is a separate reservation and a 2 a.m. departure, not a beach afternoon, and it is not included in the condo.",
        "Add resort fees and parking before a Kaanapali rate beats a Kihei kitchen.",
        "Grocery at OGG or the first market. Two cooked nights change the week more than skipping the one fish dinner.",
        "Paia Fish Market is the plate on the way back from Hana. It is not a reason to book a second hotel in Paia.",
        "Mama’s Fish House or Spago is one reservation. Do not change hotels for it."
      ]
    },
    cruise: {
      hook: "The brochure fare bought a cabin and the main dining room. Gratuities, port fees, and a drink package priced per person — including the adult who will not drink — are the rest of the week.",
      startHere: "Price the interior or the balcony with gratuities and port fees already on the card. Run the drink-package break-even before you tap yes. One port is a walk.",
      tipsKicker: "Fare, then the lines they left off",
      cta: "Build the cruise Trip Plan with gratuities and the drink math in the total. Add one port walk, not three pier tours.",
      aroundRule: "The ship is the hotel. A pier kiosk is the expensive version of a walk. Price the pre-cruise night if the flight cannot miss the gangway.",
      stayRule: "An interior guarantee if you want the deck more than the cabin. An oceanview or a Royal or NCL balcony for the Caribbean product. A suite adds suite gratuities.",
      eatRule: "Main dining is in the fare. Chops Grille or Cagney’s once, about $45 a person. Bar drinks until the package’s break-even says otherwise.",
      doRule: "Sea days on the Lido deck. One ship excursion plus a walk in Nassau or Cozumel. A pier kiosk is the expensive version of that walk.",
      zones: [
        z("Interior", "About $250–650 a person for 7 nights on Carnival through Royal, before port fees. The deck is the trip"),
        z("Oceanview or balcony", "The balcony add in the cruise table is about $500 a person"),
        z("Suite", "Space, and suite gratuities as their own line"),
        z("Pre-cruise hotel", "About $200 if the flight can miss the ship. Missing the ship costs more")
      ],
      days: [
        d("Embark, main dining", ["The fare includes the dining room. Use it", "No specialty restaurant tonight", "Confirm gratuities are on the bill, including kids age 2 and up"]),
        d("A port walk", ["One independent walk in Nassau or Cozumel", "Or one ship excursion, not three pier-kiosk tours", "Back on board without a second package"]),
        d("A sea day on the Lido", ["The deck you already paid for", "Chops or Cagney’s only if this is the one specialty night", "Run the drink-package break-even before you add the package"])
      ],
      hidden: [
        "Port fees about $200 a person on a 7-night Caribbean",
        "Gratuities about $16–20 a person per day on mainstream lines",
        "Kids age 2 and up on that gratuity line",
        "Specialty dining about $45 a person",
        "Wi-Fi, a second excursion, and a pre-cruise hotel if the flight is tight"
      ],
      skip: [
        s("The drink package as a default", "Pay as you go until the count says it wins."),
        s("Three pier-kiosk tours", "One excursion plus a walk."),
        s("Specialty dining every night", "Main dining is already in the fare.")
      ],
      tips: [
        "Money edge: Gratuities bill kids age 2 and up. The infant who sails free still needs documents, not a drink package.",
        "Add port fees, about $200 a person, before you compare two from-prices.",
        "Unlimited packages run about $54–105 a person per day by line. Use the drink-package break-even before you tap yes.",
        "One night at Chops Grille or Cagney’s. Every night is a second fare.",
        "A pre-cruise hotel is about $200 in the cruise table when the flight cannot miss the gangway."
      ]
    },
    key_west: {
      hook: "Old Town is a walk, Cuban coffee, and a sidewalk at Mallory Square. The money leaves when you eat on the pier or sleep on Stock Island and take a cab both ways.",
      startHere: "Caribbean House, The Gardens, or The Big Ruby — Old Town, walkable. Cuban Coffee Queen in the morning. Sunset from the Mallory sidewalk.",
      tipsKicker: "Walk Old Town, price the ferry",
      cta: "Build the Key West Trip Plan from an Old Town walk. Add the Tortugas ferry only if that day is otherwise empty.",
      stayRule: "The Big Ruby, Caribbean House, or The Gardens, close enough to walk. Casa Marina if you want the beach-end Splurge. Stock Island plus a nightly cab is not the budget.",
      eatRule: "Cuban Coffee Queen or a ventanita. El Siboney or Garbo’s at night. Louie’s Backyard or Latitudes once. Kermit’s key lime once, not as dinner.",
      doRule: "Mallory Square from the sidewalk at sunset. Fort Zachary Taylor for the swim. The Dry Tortugas ferry only if it is the whole day. A Sebago sail does not share that day.",
      zones: [
        z("Old Town walk", "The Big Ruby or Caribbean House. About $250–360 before Florida’s 12.5% lodging tax"),
        z("A quieter Truman block", "Same island, less of the bar strip, still walkable"),
        z("Casa Marina", "Beach-end Splurge. You can still walk. Do not add a car for Duval"),
        z("Stock Island", "A lower room and a cab both ways. That cab is the difference")
      ],
      days: [
        d("Duval on foot", ["Cuban Coffee Queen", "Walk Duval as a street, not a hotel strategy", "Sunset from the Mallory sidewalk — no pier ticket"]),
        d("El Siboney or Louie’s", ["El Siboney, Garbo’s, or Louie’s Backyard — one dinner", "Kermit’s key lime once", "Schooner Wharf fritters are a snack, not the meal"]),
        d("Fort Zach, or the ferry", ["Fort Zachary Taylor for the beach and the fort", "Or the Dry Tortugas ferry if that is the entire day", "A Sebago sunset sail does not follow the ferry"])
      ],
      hidden: [
        "Florida lodging tax about 12.5%",
        "Old Town parking if you drove a car you will not use",
        "Stock Island cab both ways",
        "EYW airfare premium versus a priced drive-down day from Miami",
        "A Tortugas ticket plus a sunset sail plus a seaplane"
      ],
      skip: [
        s("A Mallory Square menu", "The sunset is the same from the sidewalk."),
        s("Stock Island to save the room", "The nightly cab spends the savings."),
        s("Ferry, sail, and seaplane", "The ferry is a day. Pick one of the others, on a different day.")
      ],
      tips: [
        "Money edge: Watch sunset from the Mallory sidewalk. The Dry Tortugas ferry is a different day, not an evening add-on.",
        "EYW air is a premium. A drive from Miami is a full day — put it on the plan as a day.",
        "Old Town parking is a fee for a car that should not be your Duval strategy.",
        "Fort Zachary Taylor is the cheap outdoor ticket. Parasail is optional.",
        "Blue Heaven at opening if you want that courtyard. Otherwise El Siboney, without the wait."
      ]
    }
  };

  pack.ALL.forEach(function (g) {
    var notes = R[g.id];
    var ed = E[g.id];
    if (!notes || !notes.facts || notes.facts.length < 3 || !notes.gem || !notes.tax) {
      throw new Error(g.id + ": research notes incomplete");
    }
    if (!ed) throw new Error(g.id + ": editorial missing");
    g.hook = ed.hook;
    g.startHere = ed.startHere;
    g.tipsKicker = ed.tipsKicker;
    g.cta = ed.cta;
    g.stayRule = ed.stayRule;
    if (ed.aroundRule) g.aroundRule = ed.aroundRule;
    g.eatRule = ed.eatRule;
    g.doRule = ed.doRule;
    g.zones = ed.zones;
    g.days = ed.days;
    g.hidden = ed.hidden;
    g.skip = ed.skip;
    g.tips = ed.tips;
    /* Tips and branded Stay/Eat/Do lists are replaced by city-guides-lists.js. */
  });
})(typeof window !== "undefined" ? window : this);
