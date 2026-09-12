/* =====================================================================
   Vacation Math — printable city briefs (top 20 destinations)
   Unique copy only. Hotel / food / activity lists come from
   plan-data.js + plan-recs-extra.js so /guides and /plan stay aligned.
   Orientation — not live rates, not star scores, no affiliates.
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
      blurb: "Park tickets, resort buses, and the Florida tax most room-plus-tickets quotes skip.",
      whenGo: "Late January, February, and the two weeks after Labor Day.",
      whenSkip: "Spring break, summer, Thanksgiving through New Year’s.",
      whenNote: "September and early February are the value window: tickets drop, Value rooms ease, and you can skip Lightning Lane on most days. April and Christmas weeks are the other planet.",
      around: "Stay on property and the buses, boats, and Skyliner are the product. A cheap I-Drive hotel plus a rental car is a parking fee you bought on purpose.",
      aroundBullets: [
        "On-property: bus to every park; Skyliner from Pop, Art of Animation, Caribbean Beach, Riviera; monorail only from the Deluxe Magic Kingdom resorts.",
        "Mears / rideshare from MCO — Magical Express is gone. Price the transfer as its own line.",
        "A rental car is optional if you never leave Disney. Parking is a daily ticket if you drive to the parks."
      ],
      budgetNote: "A Value-resort week for four is a different number from Deluxe + Hopper + Lightning Lane. Florida 12.5% lodging tax and 6.5% sales tax on tickets are the lines most quotes hide. Trip Plan constrains the same math to a hard budget.",
      tips: [
        "Skip Park Hopper unless you will switch parks after lunch. A second park day is usually cheaper than the Hopper tax on a short trip.",
        "Lightning Lane Multi Pass is a maybe on Magic Kingdom or Hollywood Studios. Skip it in late January and mid-September.",
        "Grocery breakfast (Garden Grocer / Winn-Dixie) plus food-court lunch. The dining plan is usually a bad buy — even on Stretch.",
        "Stay on the bus or Skyliner grid. A cheap International Drive hotel plus a rental car is not Lean; it is a parking habit.",
        "Tuesday and Wednesday MCO arrivals beat Saturday check-ins. Midweek flights are the value window.",
        "Disney Springs is a free evening. Do not buy a third park day just to fill a night.",
        "Memory Maker and the refillable mug only pay if you will actually use them every day. Price them as leftovers, not defaults.",
        "Run the hard-budget plan before you lock tickets — Orange County lodging tax is not optional math."
      ],
      related: [
        { href: "/disney", label: "Disney World Cost Calculator" },
        { href: "/guides/disney-world-vacation-cost", label: "Disney World cost guide" },
        { href: "/guides/hidden-costs-disney-world", label: "Hidden Disney costs" }
      ]
    }),
    G({
      id: "anaheim",
      label: "Anaheim / Disneyland",
      place: "Anaheim, California",
      hook: "Two parks, a walkable Harbor Blvd, and a dining plan you still should not buy.",
      blurb: "Disneyland and California Adventure — smaller campus than Orlando, same food-court math.",
      whenGo: "Mid-January through early March, and late April after Easter if school is in.",
      whenSkip: "Spring break, summer weekends, Halloween Time peak, and the week of Christmas.",
      whenNote: "Disneyland does not have Orlando’s September ghost-town gift. Midweek in the winter shoulder is the honest value window. Halloween and Christmas overlays are peak on purpose.",
      around: "Walk or take the hotel shuttle. This lodging is Anaheim — not a Getty / Griffith / Universal stack from a Santa Monica hotel.",
      aroundBullets: [
        "Harbor Blvd and Downtown Disney are walkable. A rental car is a parking line if you never leave the bubble.",
        "ART (Anaheim Resort Transportation) if your hotel is a few blocks off the walk.",
        "SNA is the close airport. LAX is cheaper air and a longer ground transfer — price both."
      ],
      budgetNote: "Disneyland tickets plus a Harbor Blvd room can undercut a Walt Disney World week — you need fewer days. Hopper and Lightning Lane are still the overrun. Trip Plan uses the same Anaheim hotel and food bands as this brief.",
      tips: [
        "One park per day on Lean. Hopper only if you will switch after lunch — the campus is walkable, the ticket is not free.",
        "Lightning Lane on the Disneyland park day, not both days, unless leftover is real.",
        "Grocery breakfast (Albertsons / Target) plus mobile-order QS. Downtown Disney is a dinner, not a meal plan.",
        "Stay in Anaheim. A Santa Monica hotel plus a 90-minute transfer is not a Disneyland trip.",
        "Midweek SNA or LAX flights. Friday arrivals into Halloween Time are a tax.",
        "Universal Studios is a Los Angeles day with its own ticket math — do not stack it into a 3-night Disneyland stay.",
        "The dining plan is still usually a bad buy. Pay as you go.",
        "Pixar Place or Grand Californian is leftover. Lean is Harbor Blvd and a grocery bag."
      ],
      related: [
        { href: "/guides/disney-world-vs-disneyland-cost", label: "Disney World vs Disneyland cost" },
        { href: "/themeparks", label: "Theme Park Cost Calculator" },
        { href: "/guides/disney", label: "Walt Disney World brief" }
      ]
    }),
    G({
      id: "los_angeles",
      label: "Los Angeles",
      place: "Los Angeles, California",
      hook: "Excellent food at every price. The overrun is a rideshare to dinner across the basin.",
      blurb: "Pick one pocket — Downtown, Koreatown, or the beach — and stop treating LA like a single neighborhood.",
      whenGo: "Late January through March, and May before Memorial Day if you want beach without June gloom denial.",
      whenSkip: "Oscar week, Thanksgiving week, and late December. August is hot and priced like it.",
      whenNote: "February is the value window for rooms. Summer weekends on the Westside are a parking-and-rate tax. Shoulder spring is the honest beach week.",
      around: "Metro + one rideshare zone. A cheap Valley room becomes a $40 Uber habit. Disneyland is Anaheim — a separate day trip.",
      aroundBullets: [
        "TAP card on Metro / bus. The E Line reaches Santa Monica; B / D Lines cover Koreatown and Downtown.",
        "Hotel parking is $40–60/night if you rent a car you will sit in.",
        "SNA or BUR can beat LAX on a short stay. Price the ground, not just the fare."
      ],
      budgetNote: "Solid lodging in this catalog sits in the mid-$200s before tax; food is excellent on a Lean daily band if you stay in one neighborhood. Trip Plan adds occupancy tax and the rideshare you will actually take.",
      tips: [
        "Pick one pocket (Downtown, Koreatown, or the beach) and eat there. Crossing the basin for dinner is a second hotel.",
        "TAP day fares beat a rideshare loop. The Getty is free if you reserve — bus or pay parking, not a $40 drop-off.",
        "Porto’s or a bakery breakfast. Hotel restaurants in LA are airport-priced.",
        "Midweek flights into LAX, BUR, or SNA. Friday arrivals are a tax.",
        "Skip hotel parking unless you have a canyon or beach-hop day already priced.",
        "Disneyland is Anaheim lodging and a separate ticket. Do not add it as a “quick” day from Santa Monica.",
        "Grand Central Market and a taco truck (Mariscos Jalisco class) beat a hotel dinner.",
        "Universal Express is Stretch. Getty + Griffith + one beach day is the Lean week."
      ],
      related: [
        { href: "/guides/anaheim", label: "Anaheim / Disneyland brief" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "nyc",
      label: "New York City",
      place: "New York, New York",
      hook: "The subway is the plan. Midtown is the expensive version of everything — including a $28 salad.",
      blurb: "Neighborhood choice is the budget. Times Square is a pass-through, not a hotel strategy.",
      whenGo: "February, early March, and the back half of January after New Year’s.",
      whenSkip: "The holiday window from Thanksgiving through New Year’s, and peak October weekends.",
      whenNote: "February rooms are the value window. December is pretty and priced like a souvenir. Summer is humid; it is not automatically cheaper.",
      around: "Subway first. A Times Square address is a neon tax. Outer-borough lodging on a train beats a Midtown west “deal.”",
      aroundBullets: [
        "OMNY / MetroCard. A 7-day pass wins if you ride twice a day.",
        "Walk a borough; rideshare only when the last train is gone.",
        "LGA, JFK, and EWR are different ground math. Price the AirTrain / subway, not just the fare."
      ],
      budgetNote: "Midtown “deals” plus resort-style fees are how NYC eats a Solid budget. Trip Plan uses a 14.75% lodging-tax assumption and the same hotel examples as this brief.",
      tips: [
        "Skip a Times Square hotel unless you like paying for the neon. Pod / citizenM / a Brooklyn train-stop room is Lean.",
        "Bodega egg-and-cheese or a bakery breakfast. The hotel dining room is a Midtown salad with a room-service tax.",
        "A 7-day unlimited or OMNY cap beats a week of single swipes if you ride twice a day.",
        "Staten Island Ferry is the free skyline. Skip a paid harbor loop on Lean.",
        "One museum with pay-what-you-wish or a timed free night. Do not stack three observatories.",
        "Midweek flights. Friday into a holiday weekend is the expensive version of the same seat.",
        "Jackson Heights, Flushing, and Chinatown over Midtown for dinner. One borough per night.",
        "Broadway rush / lottery before a full-price orchestra. Stretch is a reserved seat, not three shows."
      ],
      related: [
        { href: "/guides/philadelphia", label: "Philadelphia brief" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "vegas",
      label: "Las Vegas",
      place: "Las Vegas, Nevada",
      hook: "Resort fees apply on a $40 Tuesday. Walk ten minutes off the casino carpet and dinner gets honest again.",
      blurb: "Midweek Center-Strip or downtown. Weekends and holidays double the room.",
      whenGo: "Midweek in January, February, and early December — after the holiday parties, before March conventions.",
      whenSkip: "CES, Super Bowl week when it lands here, New Year’s, and most three-day holiday weekends.",
      whenNote: "Tuesday–Thursday is the product. Saturday night is a different hotel. Heat is free in July; the room is not automatically a steal once resort fees land.",
      around: "Walk the Center-Strip. The monorail is a backup, not a plan. Downtown is a separate pocket — pick one.",
      aroundBullets: [
        "Center-Strip is walkable if you booked Park MGM / NYNY / Horseshoe / Bellagio class.",
        "Deuce / monorail if you stray north. One rideshare to Fremont, not four.",
        "LAS is close. A rental car is a parking fee plus a hangover you do not need."
      ],
      budgetNote: "The room is the bait; resort fees and a Strip steakhouse are the bill. Trip Plan keeps fees in the lodging band and uses the same hotel examples as this brief.",
      tips: [
        "Book Tuesday–Thursday. Weekend and holiday weeks double a midweek rate before you add the resort fee.",
        "Resort fees apply even on a $40 Tuesday. Add them in your head before you celebrate the “deal.”",
        "Food halls (Park MGM / Cosmo) or Chinatown / Downtown dinner. Strip steakhouses price like airports.",
        "Walk the Center-Strip. The monorail is a backup; Ubering from bed to the next casino is a habit.",
        "Fountains, Bellagio conservatory, and a Fremont walk are free. A nightclub table is Stretch, not mid.",
        "One show, not three. Cirque or a residency leftover — the street is already a show.",
        "Pay-as-you-go drinks until you run the math. Free drinks are not a meal plan.",
        "Downtown (Circa-adjacent / Fremont) is Lean lodging if you will walk those lights and rideshare to the Strip once."
      ],
      related: [
        { href: "/tripfinder", label: "Trip Finder" },
        { href: "/guides/how-much-to-budget-for-vacation", label: "How much to budget" }
      ]
    }),
    G({
      id: "miami",
      label: "Miami",
      place: "Miami, Florida",
      hook: "Ocean Drive menus are a tourist tax. Cuban breakfast and a neighborhood dinner win the week.",
      blurb: "South Beach side street or Brickell. Spring break weeks are not the value window.",
      whenGo: "Early December, late April after spring break, and May before summer rain sets the mood.",
      whenSkip: "Spring break, Art Basel week if you did not come for it, and mid-August humidity-plus-rates.",
      whenNote: "Shoulder late spring is the honest beach week. Hurricane season (June–November) is a weather line — not automatically cheaper once you add a flexible fare.",
      around: "Walk the beach grid you booked. Metromover on the mainland. A car is a parking fee in South Beach.",
      aroundBullets: [
        "South Beach is walkable if you slept a few blocks off Ocean Drive.",
        "Brickell / Downtown: Metromover is free; rideshare to the sand once.",
        "MIA is close. FLL can be cheaper air plus a longer ground transfer."
      ],
      budgetNote: "Ocean Drive addresses are a tax on the same sand. Trip Plan uses a 13% lodging-tax assumption and the same Deco / Brickell examples as this brief.",
      tips: [
        "Sleep a few blocks off Ocean Drive. Same sand, less neon, better breakfast.",
        "Cuban café (Versailles or a ventanita) — not the hotel, not Ocean Drive.",
        "Skip beach-club bottle service on Lean. That is a day-price, not a snack.",
        "Midweek flights. Friday into a holiday weekend is Miami doing Miami to your card.",
        "Wynwood Walls from the sidewalk; Little Havana on foot. Everglades is a half-day leftover, not a default.",
        "Hurricane-season “deals” need a flexible fare or a cancel-for-any-reason stance you already priced.",
        "Brickell if you want mainland restaurants and Metromover. Do not split Mid-Beach and Brickell in three nights.",
        "Joe’s Stone Crab is a share leftover — not five fish dinners."
      ],
      related: [
        { href: "/guides/key_west", label: "Key West brief" },
        { href: "/guides/cruise", label: "Caribbean cruise brief" }
      ]
    }),
    G({
      id: "san_francisco",
      label: "San Francisco",
      place: "San Francisco, California",
      hook: "Transit-first city. Union Square tourist hotels are the expensive version of a Muni pass.",
      blurb: "Walk the Embarcadero, skip the Wharf menu, and treat Napa as a packed-lunch day trip.",
      whenGo: "Late January, February, and September after Labor Day — September weather often beats July.",
      whenSkip: "Fleet Week if you did not come for it, Pride weekend unless that is the trip, and late December.",
      whenNote: "July can be fog and a high room. September is the local secret and is no longer secret on weekends. February is the value window.",
      around: "Muni + BART. Skip a car inside the city. Parking is a line item if you day-trip Napa or Muir Woods.",
      aroundBullets: [
        "Clipper card on Muni, BART, and ferries. A visitor passport can win on a four-ride day.",
        "Cable cars are a ticketed souvenir, not transit. A bus often reaches the same hill.",
        "SFO via BART. OAK is a different transit story — price the ground."
      ],
      budgetNote: "Hotel tax is already spicy (about 16%). Trip Plan keeps it in the lodging line and uses the same Union Square / Embarcadero examples as this brief.",
      tips: [
        "Clipper + Muni / BART. A visitor passport beats a week of single rides if you move.",
        "Tartine or a Mission bakery breakfast. Skip the hotel dining room and the Wharf seafood rack.",
        "Alcatraz timed ferry — book ahead. Do not stack Alcatraz, Napa, and Yosemite in five nights.",
        "Skip the paid cable-car loop if a bus reaches the same hill. The souvenir ride is one ticket, not a commute.",
        "Napa is a day trip with a packed lunch, not a dinner transfer and a second hotel.",
        "Midweek SFO. Weekend rates around conventions and Fleet Week are a different city.",
        "Golden Gate + Crissy Field + Mission murals are free. SFMOMA is one ticketed indoor, not three.",
        "Union Square tourist hotels are a tax. Embarcadero or a neighborhood 3-star is the Solid stay."
      ],
      related: [
        { href: "/big-trip", label: "The Big Trip" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "chicago",
      label: "Chicago",
      place: "Chicago, Illinois",
      hook: "The L beats surge pricing. Winter rates are the value window; summer weekends are not.",
      blurb: "River North or Fulton Market. Deep-dish once, then a neighborhood dinner.",
      whenGo: "January through early March for rooms; late April and September if you want walking weather without Taste-of-Chicago rates.",
      whenSkip: "Lollapalooza week, holiday markets in December if you did not come for them, and July Fourth weekend.",
      whenNote: "Winter is cold and honestly cheaper. Summer lakefront is the postcard and the premium. Shoulder September is the walking week.",
      around: "The L is the plan. Loop or River North limited-service puts trains downstairs. A suburban rate is a parking tax.",
      aroundBullets: [
        "Ventra card on the L and buses. A 1-day or 3-day pass wins if you ride.",
        "Walk the Riverwalk and the Mag Mile as a pass-through, not a hotel strategy.",
        "ORD vs MDW: Southwest into Midway can win. Price the L, not a downtown taxi from either."
      ],
      budgetNote: "Chicago hotel tax is among the higher US combined rates in this catalog (about 17.4%). Trip Plan already applies it. The L is how Solid stays Solid.",
      tips: [
        "Ventra day pass beats a rideshare loop. The L is the plan — Mag Mile hotels are for people who will not take it.",
        "Winter rates are the value window. Summer weekends and Lolla week are not.",
        "Doughnut or diner breakfast. Downtown hotel restaurants are Chicago-priced for the same eggs.",
        "One deep-dish if you must, then stop. Italian beef or a Fulton Market casual is the rest of the week.",
        "Architecture from the sidewalk is free. A river cruise is one ticketed leftover, not a daily habit.",
        "Art Institute or a river cruise — pick one on Solid. Do not stack two museums and a cruise.",
        "Midweek ORD or MDW. Friday into a holiday weekend is a different room.",
        "Fulton Market lodging if you want restaurants over the Mag Mile. One neighborhood, not two towers."
      ],
      related: [
        { href: "/tripfinder", label: "Trip Finder" },
        { href: "/guides/how-much-to-budget-for-vacation", label: "How much to budget" }
      ]
    }),
    G({
      id: "nola",
      label: "New Orleans",
      place: "New Orleans, Louisiana",
      hook: "This is a food trip. Cut the hotel class before you cut the reservations.",
      blurb: "Warehouse District or Garden District. French Quarter room premium is real — the plate is the point.",
      whenGo: "Late January after bowl season, and May before the heaviest heat if you missed Jazz Fest on purpose.",
      whenSkip: "Mardi Gras unless that is the trip (it is a different budget), Jazz Fest weekends, and late August heat-plus-storms.",
      whenNote: "Shoulder late winter is the walking week. Mardi Gras and Jazz Fest are priced like what they are. Hurricane season is a weather line — flexible fare or skip.",
      around: "Walk or streetcar. A French Quarter balcony is a premium. Mid-City plus the Canal car is Lean.",
      aroundBullets: [
        "Streetcar (Jazzy Pass / TAP-style visitor pass) on Canal and St. Charles.",
        "Walk the Quarter in daylight; rideshare at night if you stray.",
        "MSY is a short ride. A rental car is a parking fee in Old Town."
      ],
      budgetNote: "Keep the dinner reservations and cut the courtyard hotel. Trip Plan uses a 16.2% lodging-tax assumption and the same Peter and Paul / Pontchartrain examples as this brief.",
      tips: [
        "Cut the hotel class before you cut Galatoire’s or Commander’s. This is a food trip.",
        "Warehouse District, Mid-City, or Garden District. French Quarter room premium is real and not the plate.",
        "Café du Monde once. Then a neighborhood café — not a Bourbon breakfast every morning.",
        "Po’boy lunch (Parkway or a neighborhood shop). One old-school dinner, not a tourist-menu courtyard every night.",
        "Streetcar day pass. A rental car is a parking fee you will resent.",
        "Mardi Gras is a different budget — rooms, throw-away clothes, and surge. Do not “just happen” to overlap it.",
        "Hurricane-season weeks need a cancel stance you already priced. The music will still be there in January.",
        "Haunted tours are leftover. Daylight Quarter walks and a streetcar hour are Lean."
      ],
      related: [
        { href: "/guides/atlanta", label: "Atlanta brief" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "philadelphia",
      label: "Philadelphia",
      place: "Philadelphia, Pennsylvania",
      hook: "Reading Terminal is the cheap-rich lunch. Cheesesteak is one meal, not a pilgrimage.",
      blurb: "Center City or Old City. Independence is timed and free-ish; the hotel tax is not.",
      whenGo: "February, early March, and late January after the holiday hangover.",
      whenSkip: "Fourth of July week, the Army–Navy / big-game weekends that land here, and December holiday weekends.",
      whenNote: "February rooms are the value window. Summer on the Parkway is festival-priced. Shoulder spring is the walking week if you missed the flower show on purpose.",
      around: "SEPTA. A cheap airport room is a tax you will resent. Walk Independence; ride to the rest.",
      aroundBullets: [
        "SEPTA Key / Independence Pass if you will ride more than twice a day.",
        "Old City and Center City are walkable to each other if you like walking.",
        "PHL is a train, not a taxi habit. Price Regional Rail vs rideshare."
      ],
      budgetNote: "Philadelphia’s combined lodging tax is about 15.5% in this catalog. Trip Plan already applies it. Reading Terminal is how Lean eats well.",
      tips: [
        "Independence Hall timed entry is the ticket — book it. The Bell is a line, not a morning.",
        "Reading Terminal breakfast and lunch. Hotel restaurants are the expensive version of the same plate.",
        "One cheesesteak, then stop. Roast pork (DiNic’s class) is the local argument.",
        "SEPTA day pass beats a rideshare loop. Skip the hop-on bus on Lean.",
        "Barnes or PMA — pick one on Solid. Do not stack three interiors and a cheesesteak tour in one day.",
        "Midweek PHL. Fourth of July week is a different city and a different room.",
        "Stay Center City or Old City. An airport hotel is a SEPTA tax you will resent.",
        "Zahav is leftover. Terminal leftovers plus one neighborhood Italian is Solid."
      ],
      related: [
        { href: "/guides/nyc", label: "New York City brief" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "atlanta",
      label: "Atlanta",
      place: "Atlanta, Georgia",
      hook: "The BeltLine is the walk. A cheap airport hotel is a rideshare habit you already paid for.",
      blurb: "Midtown or Ponce. Meat-and-three lunch, MARTA backup, convention weeks are not the value window.",
      whenGo: "Late January through March, and November before Thanksgiving if you want walking weather without Peachtree-festival rates.",
      whenSkip: "Super Bowl / Final Four / big convention weeks when they land here, and late July humidity-plus-rates.",
      whenNote: "Shoulder late winter is the value window. Atlanta prices like a convention city — check the calendar before you celebrate a “deal.”",
      around: "BeltLine Eastside + MARTA. Downtown or Midtown on a train. Skip Cumberland / Buckhead cloverleaf lodging on Lean.",
      aroundBullets: [
        "MARTA from ATL is the honest airport move. A 1-day or 3-day pass if you will ride.",
        "BeltLine Eastside Trail is the walk — Ponce City Market to Krog Street.",
        "A rental car is a parking fee if you stay Midtown and eat on the trail."
      ],
      budgetNote: "Atlanta’s combined lodging tax is high in this catalog (about 16.9%). Trip Plan already applies it. Midtown on MARTA is how Solid avoids a Buckhead parking tax.",
      tips: [
        "MARTA from the airport. A cheap ATL-adjacent hotel is a rideshare habit.",
        "BeltLine + Ponce City Market is Lean entertainment. The Aquarium is one ticketed morning, not the whole trip.",
        "West Egg or a café breakfast. Mary Mac’s for a meat-and-three — skip a Buckhead steakhouse on Lean.",
        "Convention weeks are not the value window. Check the calendar before you book Downtown.",
        "MARTA / BeltLine day beats a rideshare loop. Do not split Buckhead and the Aquarium hotel in three nights.",
        "Midweek ATL. You already live near a hub if you flew Delta — midweek still wins.",
        "Piedmont Park and MLK National Historical Park are free / cheap. World of Coca-Cola is a pick-one with the Aquarium.",
        "Hotel Clermont or a Ponce 3-star if you want the trail. Four Seasons Midtown is leftover."
      ],
      related: [
        { href: "/guides/nola", label: "New Orleans brief" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "paris",
      label: "Paris",
      place: "Paris, France",
      hook: "Bakeries and one reserved dinner beat a week of tourist-menu prix fixes on the tower steps.",
      blurb: "Metro-line lodging in the 10th–11th. Palace hotels only if leftover is silly.",
      whenGo: "Late January through March, and November before the holiday lights become a room tax.",
      whenSkip: "Late June through August, and the two weeks around Christmas and New Year’s.",
      whenNote: "February is the value window and still Paris. August is half-closed and fully priced for tourists. Shoulder spring is pretty and no longer cheap on weekends.",
      around: "Navigo or a carnet. Stairs are the elevator. Gare hotels if you land early — then own that pocket or move.",
      aroundBullets: [
        "Metro + RER. A Navigo week (if your days qualify) beats a fistful of t+ tickets.",
        "Walk one arrondissement in the morning. The tower is a Trocadéro view on Lean, not a summit default.",
        "CDG vs ORY: RER B is the honest CDG move. A taxi is leftover, not Lean."
      ],
      budgetNote: "Paris mid already eats a US city budget. Trip Plan uses Europe lodging-tax assumptions and the same Ibis / Canal / palace-adjacent examples as this brief.",
      tips: [
        "Bakery breakfast on your block. Du Pain et des Idées class if you slept in the 10th — not the hotel buffet.",
        "Bouillon Chartier / Pigalle or a formule du midi. Skip restaurants on the tower, the hill, and the museum steps.",
        "Navigo or a carnet. Taxis are leftover. Pack light — stairs are common.",
        "Louvre or Orsay — pick one timed ticket. A four-museum day is how you buy souvenirs you will not remember.",
        "Eiffel from Trocadéro or Champ de Mars on Lean. The summit is a pick-one with Sainte-Chapelle.",
        "Book the Atlantic crossing 2–4 months out, midweek. Open-jaw (in Paris, out Rome) often beats two one-ways.",
        "Fromagerie + wine is a valid dinner. Palace-hotel dining only if leftover is silly.",
        "10th–11th or 18th–19th on a Metro line. A tower-block view is a tourist tax."
      ],
      related: [
        { href: "/guides/london", label: "London brief" },
        { href: "/guides/rome", label: "Rome brief" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "london",
      label: "London",
      place: "London, United Kingdom",
      hook: "Excellent food two Tube stops from the postcard. Tesco meal deal + Oyster is the Lean plan.",
      blurb: "Zone 1–2 on a Tube line. £8 pints are already in the luxury math.",
      whenGo: "January, February, and November — dark, damp, and honestly cheaper.",
      whenSkip: "August bank-holiday weeks, New Year’s, and the fortnight around Christmas.",
      whenNote: "Winter is the value window. Summer is packed and priced like a souvenir. Shoulder late spring is pretty; weekends still premium.",
      around: "Oyster or contactless. Zone 1–2 lodging. A rental car is how you buy the Congestion Charge on purpose.",
      aroundBullets: [
        "Contactless daily cap on Tube / bus. A Visitor Oyster only if you like souvenirs.",
        "South Bank, Bloomsbury, or South Ken — one neighborhood, no car.",
        "LHR via Elizabeth Line or Piccadilly. LGW and STN are different ground math — price it."
      ],
      budgetNote: "London mid is a room rate plus pints. Trip Plan uses Europe assumptions and the same Premier Inn / Hoxton / Savoy-class examples as this brief.",
      tips: [
        "Contactless daily cap. You almost never need a paper ticket. A rental car is a Congestion Charge you do not want.",
        "Premier Inn or Travelodge Zone 1–2 on Lean. Mayfair is leftover — luxury is the room plus £8 pints.",
        "Bakery or Tesco breakfast. Borough or Maltby lunch. Zone 2 Indian or Turkish dinner, not a West End prix fixe every night.",
        "British Museum or National Gallery are free. The Eye is a pick-one with the Tower — not both on Lean.",
        "West End rush / day seats before a full-price orchestra. Stretch is one reserved seat, not three.",
        "Book the Atlantic 2–4 months out, midweek. Open-jaw with Paris or Dublin often beats two one-ways.",
        "Skip a paid Eye ticket on Lean — South Bank walk is the product.",
        "Hotel-included breakfast only if it is actually in the rate. Pret is a fallback, not a personality."
      ],
      related: [
        { href: "/guides/paris", label: "Paris brief" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "rome",
      label: "Rome",
      place: "Rome, Italy",
      hook: "The closer the monument, the worse the carbonara. Coperto is real — budget it.",
      blurb: "Trastevere for the walk, Termini if you land late. One timed Colosseum, not three interiors in a day.",
      whenGo: "Late January through March, and November before the holiday nativity crowds.",
      whenSkip: "Easter week, August, and the Christmas–New Year stretch.",
      whenNote: "February is the walking week. August is hot and half on holiday. Shoulder April is pretty and priced like Holy Week if it overlaps.",
      around: "Walk the centro. Metro to the Vatican or Termini. Taxis are leftover — and still stuck.",
      aroundBullets: [
        "Walk Trastevere, the Pantheon pocket, and Testaccio. Pack light; stairs are the elevator.",
        "Metro A/B for Vatican and Termini hops. A 48- or 72-hour pass if you will ride.",
        "FCO via Leonardo Express to Termini if you land late — then own that pocket or move in the morning."
      ],
      budgetNote: "Rome mid plus one dinner often beats a palace room. Trip Plan uses Europe assumptions and the same Trastevere / Pantheon / de Russie examples as this brief.",
      tips: [
        "Cornetto and coffee standing at the bar. The hotel breakfast is a tourist menu with orange juice.",
        "Trastevere or Testaccio dinner. Skip the photo-menu restaurant on Piazza Navona.",
        "Coperto is a line item, not a scam. Budget it. Bread you did not order can be too.",
        "Colosseum + Forum timed, or Vatican Museums — pick a pace. Do not stack three ticketed interiors in one day.",
        "Golf-cart forum tours are leftover. Daylight centro walks are Lean.",
        "Midweek FCO, 2–4 months out. Open-jaw with Paris or Venice often beats a backtrack.",
        "Prati near Ottaviano if the centro is sold out — Metro to the Vatican, calmer nights.",
        "La Pergola is leftover. Roscioli-adjacent or a Testaccio trattoria is Solid."
      ],
      related: [
        { href: "/guides/paris", label: "Paris brief" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "tokyo",
      label: "Tokyo",
      place: "Tokyo, Japan",
      hook: "Tokyo can be cheap if you let it. Convenience-store breakfast is not a compromise — hotel breakfast is.",
      blurb: "Business hotel next to a JR or Metro station. A JR Pass is usually a bad buy on a 5-night city trip.",
      whenGo: "Late January through early March (before peak blossom weekends), and June if you accept rain for rooms.",
      whenSkip: "Golden Week, peak cherry-blossom weekends, Obon, and New Year’s.",
      whenNote: "Cherry blossom is the point or it is a surcharge. Golden Week is a skip. Shoulder winter is the value window and still excellent food.",
      around: "Suica / PASMO on JR and Metro. Station downstairs is the lodging product. Taxis are leftover.",
      aroundBullets: [
        "IC card (Suica / PASMO / Welcome Suica). Tap and stop thinking.",
        "Shinjuku, Shibuya, Ueno, or Tokyo Station — pick a ward and walk it.",
        "NRT vs HND: Haneda is the closer gift. Narita is a Skyliner or N’EX line you should price."
      ],
      budgetNote: "Tokyo Lean is a business hotel and konbini. Stretch is the room or the sushi counter — rarely both. Trip Plan uses Asia flight patterns and the same APA / Mitsui Garden / Aman examples as this brief.",
      tips: [
        "Convenience-store onigiri and coffee for breakfast. Hotel buffets are the expensive path.",
        "A JR Pass is usually a bad buy on a 5-night city trip. IC card + Metro is the plan.",
        "APA / Super Hotel / Toyoko Inn next to a station on Lean. Capsule only if you packed a cube.",
        "Conveyor sushi and ramen are Solid lunches. Book one sushi counter if leftover is real — before you land.",
        "Skip Golden Week and peak blossom weekends unless that is the trip. Late January is the value window.",
        "Yanaka or Shimokitazawa mornings are free. teamLab or a tower is one ticketed indoor.",
        "Kyoto is a different trip. Do not fake it as a Tokyo day.",
        "The room or the counter, rarely both. Park Hyatt views still end with a Metro ride to dinner."
      ],
      related: [
        { href: "/big-trip", label: "The Big Trip" },
        { href: "/guides/how-much-to-budget-for-vacation", label: "How much to budget" }
      ]
    }),
    G({
      id: "cancun",
      label: "Cancún",
      place: "Cancún, Mexico",
      hook: "All-inclusive food is the product. The leak is tips, bottled water you already paid for, and a timeshare morning.",
      blurb: "Hotel Zone value AI or a named 4-star. Confirm the airport transfer is in the rate.",
      whenGo: "Early May, late September, and early October — after spring break, before winter northbound escape rates.",
      whenSkip: "Christmas–New Year’s, spring break, and peak Easter weeks.",
      whenNote: "Hurricane season (June–November) is the cheap window with a weather line. Shoulder May is the honest heat-for-value trade. Winter is priced like a snowbird.",
      around: "The resort is the lodging and the transit. One pre-booked transfer. Downtown is a planned night, not a wandering taxi habit.",
      aroundBullets: [
        "Airport transfer in the rate — or a pre-booked van. The dock surprise is how Lean dies.",
        "Hotel Zone bus (R-1) if you will hop. Most AI weeks never need it.",
        "CUN is close. A rental car is leftover unless this is a ruin week you already priced."
      ],
      budgetNote: "Cancún AI uses the dedicated all-inclusive math on Trip Plan — package, flights, customary tips, two excursions. Swim-up suites and timeshare mornings are not in the band.",
      tips: [
        "Confirm the airport transfer is in the rate. The surprise van is how a value AI stops being value.",
        "Eat on-property — that is the product. One downtown taco night only if the transfer is cheap.",
        "Skip the timeshare-day “free” excursion. It is a half-day tax.",
        "Do not buy bottled water you already paid for at a dock kiosk.",
        "Isla Mujeres ferry or one cenote — pick one ticketed day. Beach days are the rest.",
        "Chichén Itzá is a long day. Only with a trusted tour if leftover covers it.",
        "Hurricane-season deals need a cancel stance. Shoulder May is the heat-for-value trade without the storm math.",
        "Garden view on purpose. Ocean-view and swim-up upsells are leftover, not Lean."
      ],
      related: [
        { href: "/allinclusive", label: "All-Inclusive Calculator" },
        { href: "/guides/all-inclusive-resort-cost-guide", label: "All-inclusive cost guide" },
        { href: "/guides/cruise-vs-all-inclusive-cost", label: "Cruise vs all-inclusive" }
      ]
    }),
    G({
      id: "oahu",
      label: "Oahu",
      place: "Oahu, Hawaii",
      hook: "Waikiki bus grid. Resort breakfast every morning is how mainland prices follow you across the Pacific.",
      blurb: "Walk-to-beach midrise or a kitchenette. A car becomes mandatory the minute you leave Waikiki on purpose.",
      whenGo: "May and September–early October — after spring break, before winter northbound rates.",
      whenSkip: "Late December through early January, and mid-summer if you can move the week.",
      whenNote: "Hawaii peak is winter holidays and summer. Shoulder May / September is the honest value window. Trade winds do not care about your room rate.",
      around: "TheBus in Waikiki if you will stay on the sand and the #2 / #8 / #13. A car is a $40–55 parking line plus a North Shore day you priced.",
      aroundBullets: [
        "TheBus / HOLO card. A visitor pass can win if you leave Waikiki twice a day.",
        "Walk Kalakaua if you slept on it. One block back is the same beach.",
        "HNL is close. A neighbor-island hop is a second fare — do not assume it is in the Honolulu ticket."
      ],
      budgetNote: "Hawaii lodging tax is high in this catalog (about 17.8%). Trip Plan applies it. Kitchenette breakfasts are how Lean survives Waikiki restaurant rows.",
      tips: [
        "Grocery the condo or a plate-lunch breakfast. Resort breakfast every day is mainland prices plus a view surcharge.",
        "Skip the car if you will stay on the Waikiki bus grid. Parking is $40–55/night.",
        "Plate lunch (Rainbow Drive-In / L&L class) and poke. Leonard’s malasadas once, not as a meal.",
        "Hanauma Bay is reserved and ticketed. Pearl Harbor is one somber morning — not a beach day.",
        "Midweek HNL from the West Coast. East Coast origins pay a red-eye or a fare — price both.",
        "A neighbor-island hop is a second ticket. Do not stack Maui into five Oahu nights without a second fare.",
        "May and September are the value window. Winter holidays are priced like a souvenir.",
        "Kahala or Ko Olina is leftover and usually a car. Halekulani is Waikiki luxury if you refuse to leave the grid."
      ],
      related: [
        { href: "/guides/maui", label: "Maui brief" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "maui",
      label: "Maui",
      place: "Maui, Hawaii",
      hook: "The condo kitchen is the budget. Resort restaurants on Maui are a second lodging charge.",
      blurb: "Kihei kitchen first. Kaanapali walk-to-beach mid. Wailea is the room — do not also buy every excursion.",
      whenGo: "May and September–early October.",
      whenSkip: "Christmas–New Year’s, whale-season holiday weeks if you did not come for whales, and mid-summer if you can move.",
      whenNote: "Same Hawaii peak as Oahu. Shoulder May / September is the value window. Road to Hana in the rain is a different day than the brochure.",
      around: "A car is the island. That is not optional once you leave the condo path. Price parking and a grocery stop the first hour.",
      aroundBullets: [
        "Pick up the car at OGG and grocery before the condo. The first hour is the budget.",
        "Kihei / Wailea / Kaanapali — pick one coast. Do not hotel-hop.",
        "Road to Hana is an early start, not a beach day. Haleakalā sunrise is a 2 a.m. ticket."
      ],
      budgetNote: "Maui Solid is a Kaanapali beach path plus a kitchen a few nights. Trip Plan uses Hawaii tax and the same Kihei / Sheraton / Grand Wailea examples as this brief.",
      tips: [
        "Grocery the condo the first hour. Cook two nights. Resort breakfast buffets are a second lodging charge.",
        "Food trucks in Kihei or Paia. One fish dinner, not five.",
        "The beach in front of the condo is the product. Skip Road to Hana as a rushed Lean day.",
        "Haleakalā sunrise is ticketed and a 2 a.m. wake-up — pick it on purpose, not as a default.",
        "Do not stack Hana, Haleakalā, and a Molokini boat in four days.",
        "Resort fees and parking will show up on Kaanapali / Wailea. Add them in your head.",
        "May and September are the value window. Winter holidays are a different island.",
        "Mama’s Fish House is leftover. The kitchen plus one casual plate is Solid."
      ],
      related: [
        { href: "/guides/oahu", label: "Oahu brief" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "cruise",
      label: "Caribbean cruise",
      place: "Florida ports · 7-night style",
      hook: "The fare includes the dining room. Specialty, drinks, and the dock kiosk are the trap.",
      blurb: "Cabin, automatic gratuities, drinks math, and flights to port. Interior is a bed. The deck is the trip.",
      whenGo: "Early May, early September, and late October–early November — after spring break, before holiday sailings.",
      whenSkip: "Christmas and New Year’s weeks, Presidents’ Day, and most spring-break sailings.",
      whenNote: "Shoulder weeks cut the cabin and the air to FLL/MIA/MCO/TPA. Hurricane season is a weather line — flexible fare or skip. September can be a value if you accept the forecast.",
      around: "The ship is the hotel. Ports are a walk or a pre-booked independent taxi — not a dock kiosk. Price the pre-cruise hotel if your flight cannot miss the gangway.",
      aroundBullets: [
        "Fly in the day before if you cannot miss the ship. That hotel is a line, not a maybe.",
        "Port parking only if you drove. Rideshare to PortMiami / Port Canaveral / Port Everglades is often cheaper than a week of parking.",
        "In port: walk or a pre-negotiated taxi. The “tour” on the pier is the overrun."
      ],
      budgetNote: "Trip Plan uses the dedicated cruise math — cabin, automatic gratuities (age 2+), drinks, excursions, flights. The brochure fare is the starting point, not the total.",
      tips: [
        "Run the drink-package break-even before you tap yes. À-la-carte wins if you are not a five-drink day.",
        "Interior or obstructed oceanview on Lean. You bought the itinerary and the deck, not the porthole.",
        "Main dining room every night on Lean. One specialty night only if leftover covers it.",
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
      ]
    }),
    G({
      id: "key_west",
      label: "Key West",
      place: "Key West, Florida",
      hook: "Mallory menus are a tax. Cuban breakfast, one named dinner, and sunset from the sidewalk.",
      blurb: "Old Town walkable. A cheap Stock Island room plus a nightly cab is not Lean.",
      whenGo: "Early May and late September–October after the heaviest summer, before winter northbound rates.",
      whenSkip: "Fantasy Fest if you did not come for it, Christmas–New Year’s, and peak spring-break weeks.",
      whenNote: "Shoulder late spring is the honest walking week. Hurricane season is a weather line. Winter is priced like a snowbird who brought friends.",
      around: "Walk Old Town. A rental car is a parking fee. The Conch Train is a souvenir, not transit.",
      aroundBullets: [
        "Old Town is the product. Bike or walk. Duval is a street, not a hotel strategy.",
        "EYW is tiny and expensive air. Drive-down from Miami is a day you should price as a day.",
        "Stock Island lodging only if you like the commute. Most people should not."
      ],
      budgetNote: "Key West rooms punch above a mainland Florida beach. Trip Plan uses a 12.5% lodging-tax assumption and the same guesthouse / Gardens / Casa Marina examples as this brief.",
      tips: [
        "Cuban Coffee Queen or a ventanita breakfast. Mallory Square menus are a tax.",
        "Sunset from the sidewalk. Skip a paid pier ticket on Lean — the sun does the same work.",
        "El Siboney or Garbo’s for Lean dinner. Blue Heaven early if leftover covers the wait.",
        "Stay Old Town. A cheap Stock Island room plus a nightly cab is not Lean.",
        "Fort Zach beach + fort is the cheap outdoor ticket. Parasail is leftover.",
        "Dry Tortugas is a full ferry day — only if leftover covers it. Do not stack Tortugas, a sunset sail, and a seaplane in three nights.",
        "EYW air is a premium. Midweek, or drive from Miami as a priced day, not a surprise.",
        "Key lime pie once. Happy-hour conch fritters are a snack, not dinner."
      ],
      related: [
        { href: "/guides/miami", label: "Miami brief" },
        { href: "/guides/cruise", label: "Caribbean cruise brief" }
      ]
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
