/* =====================================================================
   Vacation Math — money guides (top 20 destinations)
   Unique editorial copy. Hotel / food / activity names come from
   plan-data.js + plan-recs-extra.js so /guides and /plan stay aligned.
   Estimates for planning — not live hotel quotes. No star scores, no affiliates.
   ===================================================================== */
(function (global) {
  "use strict";

  function G(obj) { return obj; }

  var GUIDES = [
    G({
      id: "disney",
      label: "Walt Disney World",
      place: "Orlando, Florida",
      kicker: "Park math · Orlando, Florida",
      hook: "Four parks, one food-court breakfast, and a Lightning Lane decision you should make before you fly — not at the gate.",
      blurb: "Sleep on a bus or Skyliner grid. Tickets, Florida tax, and the dining plan you should not buy.",
      worksTitle: "How the bubble actually works",
      works: "Disney World is a transit system that happens to have parks. You pick a lodging grid — bus-only Value, Skyliner, or monorail Deluxe — and then Magic Kingdom is a commute, not a checklist you have to finish. International Drive is a different trip: a cheap room plus a rental car plus a daily parking ticket you bought on purpose. Stay inside the bubble or admit you left it.",
      stayTitle: "Sleep on the transit you actually want",
      stayLead: "Base on the Skyliner if you can. A cheap I-Drive hotel is not Budget — it is a parking habit.",
      stayProse: [
        "Pop Century and Art of Animation put Hollywood Studios and Epcot on a gondola. Food-court breakfast, bus to Magic Kingdom, and you never learn the I-4 exit numbers. All-Star is the same idea with a longer bus and a lower rate.",
        "If you want a campus that feels like a vacation, Caribbean Beach or Port Orleans still buses to Magic Kingdom but adds a boat or Skyliner. Grand Floridian, Contemporary, or Polynesian is the monorail treat; Beach Club / Yacht Club if you will walk to Epcot. Club level only if you're spending more — not a personality."
      ],
      eatTitle: "Food court is a strategy, not a concession",
      eatLead: "The dining plan is usually a bad buy — even on Splurge. Grocery the room, mobile-order lunch, one table-service if you have room in the budget.",
      eatProse: [
        "Garden Grocer or a Winn-Dixie run the night you land. Cosmic Ray’s, Pecos Bill, or Satu’li Canteen for lunch — mobile order, sit in the shade, stop treating snacks like a meal plan. Dole Whip once.",
        "Add one sit-down if you have room in the budget: Sci-Fi, 50’s Prime Time, or ‘Ohana. California Grill or Space 220 only if you booked before you flew. A character breakfast is a morning you will not get back — pick it on purpose."
      ],
      doTitle: "One park a day unless you have room in the budget",
      doLead: "Hopper on a short trip is usually a tax. A second park day is cheaper than switching after a $20 turkey leg.",
      doProse: [
        "Magic Kingdom first if the party needs the castle. Hollywood Studios or Epcot on the Skyliner day if you slept on it. Animal Kingdom is the cheaper third park, not a throwaway.",
        "Lightning Lane Multi Pass is a maybe on Magic Kingdom or Hollywood Studios in peak weeks. Skip it in late January and mid-September. Disney Springs is a free evening — do not buy a third park day just to fill a night."
      ],
      daysTitle: "A 3-day skeleton that will not wreck you",
      daysLead: "Practical clusters. Not four parks, a water park, and character dining before Thursday.",
      days: [
        { title: "Magic Kingdom, then stop", body: "Rope drop the land you actually care about. Food-court dinner back at the resort or one mobile-order QS. If legs remain, Springs or a Skyliner hop — not a Hopper dash to Epcot fireworks you will sleep through." },
        { title: "Skyliner park", body: "Hollywood Studios or Epcot from Pop, Art of Animation, Caribbean Beach, or Riviera. Lightning Lane only if this is the crowded day and you already priced it. Evening on the line or a resort food court — you already paid for the commute." },
        { title: "Cheaper park or a rest day", body: "Animal Kingdom, a second single-park ticket, or Disney Springs plus a pool. Do not Hopper this unless you will switch after lunch on purpose. Memory Maker and the refillable mug are leftovers, not defaults." }
      ],
      base: {
        lede: "Pick a grid, then pick a room on that grid. The buses, boats, and Skyliner are why you paid the resort premium — a cheap I-Drive hotel is a parking habit you bought on purpose.",
        bullets: [
          "Pop Century, Art of Animation, or All-Star — Value food court, bus or Skyliner, no monorail premium.",
          "Grand Floridian / Contemporary / Polynesian on the monorail, or Beach Club / Yacht Club if you will walk to Epcot. DVC villa if you need a kitchen."
        ]
      },
      skipTitle: "Skip this",
      skipLead: "These are how a Value week becomes a Deluxe receipt.",
      skip: [
        { name: "The dining plan", why: "Pay as you go. Even Splurge usually loses this bet." },
        { name: "Park Hopper on a 3-night", why: "A second park day is cheaper than paying extra for Hopper unless you will switch after lunch." },
        { name: "I-Drive hotel plus a rental as “Budget”", why: "You bought parking, gas, and a 40-minute commute. That is not the Value product." }
      ],
      whenTitle: "The calendar is the first ticket",
      whenLead: "September and early February are the value window. April and Christmas weeks are the other planet.",
      whenGo: "Late January, February, and the two weeks after Labor Day.",
      whenSkip: "Spring break, summer, Thanksgiving through New Year’s.",
      whenNote: "Tickets drop, Value rooms ease, and you can skip Lightning Lane on most midweek days in the shoulder. Saturday check-ins in July are how you pay peak twice.",
      aroundTitle: "The buses are the product",
      around: "Stay on property and the buses, boats, and Skyliner are why you paid the resort premium. A cheap I-Drive hotel plus a rental car is a parking fee you bought on purpose.",
      aroundBullets: [
        "On-property: bus to every park; Skyliner from Pop, Art of Animation, Caribbean Beach, Riviera; monorail only from the Deluxe Magic Kingdom resorts.",
        "Mears / rideshare from MCO — Magical Express is gone. Price the transfer as its own line.",
        "A rental car is optional if you never leave Disney. Parking is a daily ticket if you drive to the parks."
      ],
      budgetTitle: "Value week vs Deluxe-plus-Hopper",
      budgetNote: "A Value-resort week for four is a different number from Deluxe + Hopper + Lightning Lane. Florida 12.5% lodging tax and 6.5% sales tax on tickets are the lines most quotes hide. Trip Plan constrains the same math to a hard budget.",
      tips: [
        "Skip Park Hopper unless you will switch parks after lunch. A second park day is usually cheaper than paying extra for Hopper on a short trip.",
        "Lightning Lane Multi Pass is a maybe on Magic Kingdom or Hollywood Studios. Skip it in late January and mid-September.",
        "Grocery breakfast (Garden Grocer / Winn-Dixie) plus food-court lunch. The dining plan is usually a bad buy — even on Splurge.",
        "Stay on the bus or Skyliner grid. A cheap International Drive hotel plus a rental car is not Budget; it is a parking habit.",
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
      kicker: "Two-park campus · Anaheim",
      hook: "Two parks, a walkable Harbor Blvd, and a dining plan you still should not buy.",
      blurb: "Smaller than Orlando. Same food-court math. Sleep in Anaheim — Santa Monica is a different trip.",
      worksTitle: "This lodging is Anaheim",
      works: "Disneyland is a walkable Harbor Blvd problem, not a Los Angeles itinerary. You sleep within a shuttle or a stroll of the gates, grocery breakfast, and treat Downtown Disney as a dinner — not a meal plan. A Santa Monica hotel plus a 90-minute transfer is how you invent a third park you cannot afford.",
      stayTitle: "Harbor Blvd is the walk. Santa Monica is not.",
      stayLead: "A Harbor Blvd 3-star and a grocery bag. Pixar Place or Grand Californian only if you're spending more.",
      stayProse: [
          "Harbor Blvd limited-service — Hampton, Holiday Inn Express, Fairfield, or the Candy Cane Inn if you want a courtyard — puts you on a walk or ART shuttle. Grocery the room. You came for two parks, not a Los Angeles itinerary.",
          "Pixar Place or Grand Californian only if you're spending more and still Anaheim. A Santa Monica hotel plus a 90-minute transfer is how you invent a third park you cannot afford."
        ],
      eatTitle: "Mobile-order and a grocery bag",
      eatLead: "Albertsons or Target the night you land. Downtown Disney is a dinner, not a dining plan.",
      eatProse: [
          "Albertsons or Target the night you land. Mobile-order QS in the parks. Downtown Disney is a dinner, not a dining plan. Pay as you go — the dining plan is still usually a bad buy."
        ],
      doTitle: "Two parks. Do not invent a third.",
      doLead: "One park per day on Budget. Hopper only if you will switch after lunch — the campus is walkable, the ticket is not free.",
      doProse: [
          "One park per day. Hopper only if you will switch after lunch — the campus is walkable, the ticket is not free. Lightning Lane on the Disneyland park day, not both days, unless you have room in the budget. Universal is a Los Angeles ticket. Do not cram it into three Disneyland nights."
        ],
      daysTitle: "Three days, two parks, no invented third",
      daysLead: "Sleep in Anaheim. Walk or shuttle. Stop stacking Los Angeles.",
      days: [
        { title: "Disneyland park, then the hotel", body: "Rope drop one land you actually care about. Grocery breakfast, mobile-order lunch, Downtown Disney only if you have room in the budget for dinner. You are not driving to Santa Monica tonight." },
        { title: "California Adventure, or the other park", body: "One park. Lightning Lane only if this is the crowded day and you already priced it. Evening on Harbor Blvd or the hotel courtyard — you already paid for the walk." },
        { title: "A second single-park day — or go home", body: "Do not Hopper this unless you will switch after lunch on purpose. Universal is not this day. Downtown Disney is not a third park." }
      ],
      base: {
        lede: "If you cannot walk or shuttle to the gate, you booked the wrong city.",
        bullets: [
          "Harbor Blvd limited-service — walk or ART, grocery in the room.",
          "Grand Californian or Pixar Place if you have room in the budget. Still Anaheim, still no LA day stacked in."
        ]
      },
      skipTitle: "Leave it off the card",
      skip: [
        { name: "The dining plan", why: "Pay as you go. It is still usually a bad buy." },
        { name: "Universal as a “quick” add-on", why: "That is a Los Angeles ticket with its own math. Do not cram it into three Disneyland nights." },
        { name: "A Westside hotel", why: "You will spend the value of a park ticket sitting in traffic." }
      ],
      whenTitle: "Smaller campus, same peak tax",
      whenLead: "Disneyland does not have Orlando’s September ghost-town gift. Midweek in the winter shoulder is the honest window.",
      whenGo: "Mid-January through early March, and late April after Easter if school is in.",
      whenSkip: "Spring break, summer weekends, Halloween Time peak, and the week of Christmas.",
      whenNote: "Halloween and Christmas overlays are peak on purpose. Friday arrivals into those weeks are a tax you can see from the parking garage.",
      aroundTitle: "Walk, shuttle, done",
      around: "Walk or take the hotel shuttle. This lodging is Anaheim — not a Getty / Griffith / Universal stack from a Santa Monica hotel.",
      aroundBullets: [
        "Harbor Blvd and Downtown Disney are walkable. A rental car is a parking line if you never leave the bubble.",
        "ART (Anaheim Resort Transportation) if your hotel is a few blocks off the walk.",
        "SNA is the close airport. LAX is cheaper air and a longer ground transfer — price both."
      ],
      budgetNote: "Disneyland tickets plus a Harbor Blvd room can undercut a Walt Disney World week — you need fewer days. Hopper and Lightning Lane are still the overrun. Trip Plan uses the same Anaheim hotel and food bands as this guide.",
      tips: [
        "One park per day on Budget. Hopper only if you will switch after lunch — the campus is walkable, the ticket is not free.",
        "Lightning Lane on the Disneyland park day, not both days, unless you have room in the budget.",
        "Grocery breakfast (Albertsons / Target) plus mobile-order QS. Downtown Disney is a dinner, not a meal plan.",
        "Stay in Anaheim. A Santa Monica hotel plus a 90-minute transfer is not a Disneyland trip.",
        "Midweek SNA or LAX flights. Friday arrivals into Halloween Time are a tax.",
        "Universal Studios is a Los Angeles day with its own ticket math — do not stack it into a 3-night Disneyland stay.",
        "The dining plan is still usually a bad buy. Pay as you go.",
        "Pixar Place or Grand Californian only if you're spending more. Budget is Harbor Blvd and a grocery bag."
      ],
      related: [
        { href: "/guides/disney-world-vs-disneyland-cost", label: "Disney World vs Disneyland cost" },
        { href: "/themeparks", label: "Theme Park Cost Calculator" },
        { href: "/guides/disney", label: "Walt Disney World money guide" }
      ]
    }),
    G({
      id: "los_angeles",
      label: "Los Angeles",
      place: "Los Angeles, California",
      kicker: "One neighborhood · Los Angeles",
      hook: "Excellent food at every price. The overrun is a rideshare to dinner across town.",
      blurb: "Pick Downtown, Koreatown, or the beach — then stop treating LA like a single neighborhood.",
      worksTitle: "LA is not one neighborhood",
      works: "Los Angeles is a collection of neighborhoods that take forever to cross. Pick Downtown, Koreatown, or the beach — and treat everything else as a planned day, not a 7pm whim. Don't drive across the city for dinner. A cheap Valley room becomes a $40 Uber habit. Disneyland is Anaheim: a separate ticket and a separate bed.",
      stayTitle: "One neighborhood. Don't treat the whole city as walkable.",
      stayLead: "Base in Downtown or Koreatown if you want Metro and late food. Sleep west only if the sand is the point.",
      stayProse: [
        "Freehand Downtown, The Line or Hotel Normandie in Koreatown, or a Santa Monica hostel-plus if you will actually stay on the sand. You want walkable breakfast and one rideshare zone — not a Valley “deal” that donates your evening to the 10.",
        "Ace Downtown, Shore Hotel or Palihotel Santa Monica, Hotel Figueroa, or The Hoxton DTLA if you want a nicer lobby without leaving the neighborhood. Proper Santa Monica, 1 Hotel West Hollywood, or Casa del Mar if you have room in the budget — still one neighborhood. Do not hotel-hop WeHo and the beach in three nights."
      ],
      eatTitle: "Excellent food. Terrible dinner math across town.",
      eatLead: "Eat where you slept. Don't drive across the city for dinner — that ride is a second hotel.",
      eatProse: [
        "Porto’s or a bakery in the neighborhood you booked. Grand Central Market or a taco truck — Mariscos Jalisco class — for lunch if you are Downtown. Koreatown BBQ (Quarter / Kang Ho Dong) if that is the bed. Hotel restaurants in LA are airport-priced.",
        "Republique, Langer’s, or Bestia if you booked ahead — still one neighborhood per night. Providence or n/naka only if you're spending more — not a WeHo-to-Santa-Monica dinner transfer you will quote as “the city.”"
      ],
      doTitle: "Getty, Griffith, one ticketed day — pick a pace",
      doLead: "The Getty is free if you reserve. Universal Express is Splurge. Do not stack Universal, Disneyland, and a beach day in five nights.",
      doProse: [
        "If you slept Downtown or in Koreatown: Getty Center (bus or pay parking, not a $40 drop-off) and Griffith Observatory. If you slept west: the beach you can walk to, plus the Expo Line if you want Downtown once.",
        "Universal or a studio tour is one ticketed day — pick it on purpose. Disneyland is Anaheim lodging. Getty + Griffith + one beach day is the Budget week."
      ],
      daysTitle: "Three days, without crossing town for dinner",
      daysLead: "Stay in the neighborhood. Take one planned excursion. Come home for dinner.",
      days: [
        { title: "The neighborhood you booked", body: "Downtown: Arts District walk, Grand Central Market, Getty if you reserved. Koreatown: bakery, late food, one Metro ride. Westside: sand, Promenade, stay west for dinner. No 6pm reservation across town." },
        { title: "One ticketed thing — or a second neighborhood, not both", body: "Universal or a studio tour if you have room in the budget. Otherwise Griffith + a taco neighborhood, or the Expo Line to another part of town for lunch and back before rush hour. Disneyland is not this day." },
        { title: "Sand or hills, then stop stacking", body: "Venice / Santa Monica if you have not been west. Griffith and the viewpoint if you have not been up. Evening in the same zip code as the bed. The city does not owe you a third act." }
      ],
      base: {
        lede: "Pick Downtown, Koreatown, or the beach. Then refuse to “see it all.”",
        bullets: [
          "Freehand or Ace Downtown, or The Line / Normandie in Koreatown — Metro, late food, one rideshare zone.",
          "Proper Santa Monica or Casa del Mar if the sand is the trip; 1 Hotel West Hollywood if that is the neighborhood. Still one neighborhood."
        ]
      },
      skipTitle: "Money sinks with a view",
      skipLead: "LA will happily charge you for the same dinner twice — once on the plate, once in the car.",
      skip: [
        { name: "Disneyland from Santa Monica", why: "That is an Anaheim day with a 90-minute punishment on either end." },
        { name: "Hotel restaurants", why: "Airport prices, lobby energy. Porto’s exists." },
        { name: "Dinner across town", why: "A $40 rideshare each way is a second hotel night you already declined." }
      ],
      whenTitle: "February rooms. August attitude.",
      whenLead: "Shoulder spring is the honest beach week. Oscar week and late December are priced like souvenirs.",
      whenGo: "Late January through March, and May before Memorial Day if you want beach without June gloom denial.",
      whenSkip: "Oscar week, Thanksgiving week, and late December. August is hot and priced like it.",
      whenNote: "February is the value window for rooms. Summer weekends on the Westside are a parking-and-rate tax. Midweek flights into LAX, BUR, or SNA beat Friday arrivals.",
      aroundTitle: "Metro plus one rideshare zone",
      around: "TAP card, then one neighborhood. A cheap Valley room becomes a $40 Uber habit. Disneyland is Anaheim — a separate day trip.",
      aroundBullets: [
        "TAP card on Metro / bus. The E Line reaches Santa Monica; B / D Lines cover Koreatown and Downtown.",
        "Hotel parking is $40–60/night if you rent a car you will sit in.",
        "SNA or BUR can beat LAX on a short stay. Price the ground, not just the fare."
      ],
      budgetTitle: "Lodging is mid-$200s. Dinner across town is the leak.",
      budgetNote: "Mid-range lodging in this catalog sits in the mid-$200s before tax; food is excellent on a Budget daily band if you stay in one neighborhood. Trip Plan adds occupancy tax and the rideshare you will actually take.",
      tips: [
        "Pick one neighborhood (Downtown, Koreatown, or the beach) and eat there. Don't drive across the city for dinner — that ride is a second hotel.",
        "TAP day fares beat a rideshare loop. The Getty is free if you reserve — bus or pay parking, not a $40 drop-off.",
        "Porto’s or a bakery breakfast. Hotel restaurants in LA are airport-priced.",
        "Midweek flights into LAX, BUR, or SNA. Friday arrivals are a tax.",
        "Skip hotel parking unless you have a canyon or beach-hop day already priced.",
        "Disneyland is Anaheim lodging and a separate ticket. Do not add it as a “quick” day from Santa Monica.",
        "Grand Central Market and a taco truck (Mariscos Jalisco class) beat a hotel dinner.",
        "Universal Express is Splurge. Getty + Griffith + one beach day is the Budget week."
      ],
      related: [
        { href: "/guides/anaheim", label: "Anaheim / Disneyland money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "nyc",
      label: "New York City",
      place: "New York, New York",
      kicker: "Subway-first · New York",
      hook: "The subway is the plan. Midtown is the expensive version of everything — including a $28 salad.",
      blurb: "Neighborhood choice is the budget. Times Square is a pass-through, not a hotel strategy.",
      worksTitle: "The subway is the city",
      works: "Your hotel is a train stop with a bed. You walk a borough, ride twice a day, and treat Times Square as a transfer, not a view you paid extra to sleep under. Outer-borough lodging on a train beats a Midtown west “deal” that still charges a resort-style fee. One borough per night for dinner. The skyline is free from the Staten Island Ferry.",
      stayTitle: "A train stop with a bed",
      stayLead: "Skip Times Square unless you like paying for the neon. Pod, citizenM, or a Brooklyn train-stop room is Budget.",
      stayProse: [
        "Pod 39, Pod Times Square (if you must be near a train, not the neon), citizenM Bowery, Freehand, or a Queens/Brooklyn 2-star on a line. Small room. Walk to a swiper. That is the honest week.",
        "Ace NoMad, The Beekman, The Hoxton Williamsburg, Arlo Nomad, or The Ludlow if you want compact and walk-to-a-borough-train. 1 Hotel Central Park or a Downtown flagship (The Public / Greenwich Hotel class) if you have room in the budget. NYC “resort fees” still show up. Add them in your head."
      ],
      eatTitle: "Leave Midtown if you want dinner",
      eatLead: "Bodega egg-and-cheese. Jackson Heights, Flushing, or Chinatown at night. The hotel dining room is a Midtown salad with a room-service tax.",
      eatProse: [
        "Breakfast is a bodega or a bakery — Russ & Daughters if you walked that far. Lunch is a slice, Xi’an Famous Foods, or a Chinatown / Flushing plate. Skip three $28 Midtown salads.",
        "Dinner is one real sit-down in the borough you are already in. Via Carota wait, Lilia, or neighborhood Italian on Mid-range. Carbone or Le Bernardin class only if you're spending more — one tasting, not a tasting every night."
      ],
      doTitle: "The street is the show. One ticketed thing.",
      doLead: "High Line, a neighborhood, the ferry. One museum or one Broadway. Do not stack three observatories.",
      doProse: [
        "Walk the High Line and a neighborhood. Staten Island Ferry for the skyline. One museum with pay-what-you-wish or a timed free night. Times Square is a pass-through, not a day.",
        "Mid-range picks one iconic ticket — Summit, Ellis, or a Broadway lottery/rush — plus Met or MoMA, not both. Splurge is a reserved Broadway seat plus one observatory. Central Park is free. A carriage is not required."
      ],
      daysTitle: "Three days if you refuse the checklist",
      daysLead: "Walk a borough. Ride twice. Eat where you already are.",
      days: [
        { title: "The borough you booked", body: "If you slept Downtown or in Brooklyn: waterfront, High Line or Heights promenade, bodega breakfast, dinner on the same side of the river. Midtown only if you are changing trains." },
        { title: "One museum, one neighborhood dinner", body: "Met or MoMA — pick one. Evening in the Village, Chinatown, or the borough you have not done. Not three interiors and a pre-theatre prix fixe you will not remember." },
        { title: "Ferry, or Broadway if you have room in the budget", body: "Staten Island Ferry in daylight, then a second neighborhood walk. Splurge spends the night on a reserved seat, not a third observatory. Go home on the train you already paid for." }
      ],
      base: {
        lede: "Sleep on a train, not under a billboard.",
        bullets: [
          "Pod / citizenM / Freehand, or an outer-borough 2-star on a line. Brooklyn or Queens beats Midtown west.",
          "1 Hotel Central Park if you want the park; The Public or Greenwich Hotel class if you want Downtown. One flagship, not a second suite."
        ]
      },
      skipTitle: "Tourist taxes with receipts",
      skipLead: "Midtown will sell you the expensive version of a thing that is free two stops away.",
      skip: [
        { name: "A Times Square hotel", why: "You paid for neon and a resort-style fee. The train still goes there." },
        { name: "Three observatories", why: "The ferry is the skyline. One paid view is a souvenir, not a checklist." },
        { name: "A week of Midtown salads", why: "The $28 lunch is how Mid-range becomes Splurge without a nicer room." }
      ],
      whenTitle: "February is the deal. December is the souvenir.",
      whenLead: "Holiday windows are pretty and priced like it. Summer is humid; it is not automatically cheaper.",
      whenGo: "February, early March, and the back half of January after New Year’s.",
      whenSkip: "The holiday window from Thanksgiving through New Year’s, and peak October weekends.",
      whenNote: "February rooms are the value window. Midweek flights beat Friday into a holiday weekend — same seat, different number.",
      aroundTitle: "The subway is the plan",
      around: "Subway first. A Times Square address is a neon tax. Outer-borough lodging on a train beats a Midtown west “deal.”",
      aroundBullets: [
        "OMNY / MetroCard. A 7-day pass wins if you ride twice a day.",
        "Walk a borough; rideshare only when the last train is gone.",
        "LGA, JFK, and EWR are different ground math. Price the AirTrain / subway, not just the fare."
      ],
      budgetTitle: "Fees and Midtown are how the number moves",
      budgetNote: "Midtown “deals” plus resort-style fees are how NYC eats a Mid-range budget. Trip Plan uses a 14.75% lodging-tax assumption and the same hotel examples as this guide.",
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
      ]
    }),
    G({
      id: "vegas",
      label: "Las Vegas",
      place: "Las Vegas, Nevada",
      kicker: "Midweek math · Las Vegas",
      hook: "Resort fees apply on a $40 Tuesday. Walk ten minutes off the casino carpet and dinner gets honest again.",
      blurb: "Tuesday–Thursday Center-Strip or downtown. Saturday is a different hotel.",
      worksTitle: "Tuesday is the product",
      works: "Vegas sells a cheap room and collects the rest at the desk. Resort fees apply even on a $40 Tuesday. You pick Center-Strip (walkable Park MGM / NYNY / Horseshoe / Bellagio class) or downtown lights — not both in three nights. The monorail is a backup. A rental car is a parking fee plus a hangover you do not need.",
      stayTitle: "Center-Strip walk or downtown lights — not both",
      stayLead: "Book Tuesday–Thursday. Weekend and holiday weeks double a midweek rate before the resort fee lands.",
      stayProse: [
          "Tuesday–Thursday is the product. Park MGM, New York-New York, or Horseshoe if you want to walk the Center-Strip. Downtown Circa-adjacent or Ellis Island if you will own those lights and rideshare to the Strip once.",
          "Bellagio, Wynn, or Cosmopolitan if you have room in the budget — still a resort-fee hotel. Weekend and holiday weeks double a midweek rate before the fee lands. Do not Uber from bed to the next casino."
        ],
      eatTitle: "Ten minutes off the carpet",
      eatLead: "Food halls at Park MGM or Cosmo, or Chinatown / Downtown dinner. Strip steakhouses price like airports.",
      eatProse: [
          "Food halls at Park MGM or Cosmo, or Chinatown / Downtown dinner. Strip steakhouses price like airports. One treat steak is a treat; every night is how the $40 room becomes the bill."
        ],
      doTitle: "Fountains are free. Tables are not.",
      doLead: "Bellagio conservatory, a Fremont walk, one show if you have room in the budget. A nightclub table is Splurge, not mid.",
      doProse: [
          "Fountains, Bellagio conservatory, and a Fremont walk are free. One show if you have room in the budget. A nightclub table is not midweek math. The street is already a show."
        ],
      daysTitle: "Three midweek days that stay on the sidewalk",
      daysLead: "Walk it. One show if you have room in the budget. Tuesday is a different hotel than Saturday.",
      days: [
        { title: "Center-Strip on foot", body: "Check in, walk the fountains, eat ten minutes off the carpet. If you booked downtown, walk Fremont and rideshare to the Strip once — not four times." },
        { title: "One daytime only if you're spending more, or just more walking", body: "High Roller off-peak or Red Rock if you have a car. Otherwise the conservatory, a food hall, and the sidewalk. The monorail is a backup." },
        { title: "One show, then stop stacking", body: "Cirque or a mid-room if you have room in the budget. Do not add a table and a second show. Fly out before Saturday if you can." }
      ],
      base: {
        lede: "Walk the Center-Strip, or own downtown. Do not Uber from bed to the next casino.",
        bullets: [
          "Ellis Island / Circa-adjacent downtown, or LINQ / Flamingo class on the Center-Strip.",
          "Bellagio, Wynn / Encore, or Aria / Cosmopolitan class. Still a resort-fee hotel."
        ]
      },
      skipTitle: "The carpet will take it",
      skip: [
        { name: "Celebrating the $40 rate", why: "Add the resort fee in your head before you text anyone." },
        { name: "A steakhouse every night", why: "One steakhouse if you're spending more. Food halls exist." },
        { name: "Three shows and a table", why: "The street is already a show. Splurge is one reserved seat." }
      ],
      whenTitle: "Tuesday is a different hotel than Saturday",
      whenLead: "Heat is free in July. The room is not automatically a steal once fees land.",
      whenGo: "Midweek in January, February, and early December — after the holiday parties, before March conventions.",
      whenSkip: "CES, Super Bowl week when it lands here, New Year’s, and most three-day holiday weekends.",
      whenNote: "Tuesday–Thursday is the product. Saturday night is a different hotel. Check the convention calendar before you celebrate a “deal.”",
      aroundTitle: "Walk it. The monorail is a backup.",
      around: "Walk the Center-Strip. Downtown is a separate part of town — pick one.",
      aroundBullets: [
        "Center-Strip is walkable if you booked Park MGM / NYNY / Horseshoe / Bellagio class.",
        "Deuce / monorail if you stray north. One rideshare to Fremont, not four.",
        "LAS is close. A rental car is a parking fee plus a hangover you do not need."
      ],
      budgetNote: "The room is the bait; resort fees and a Strip steakhouse are the bill. Trip Plan keeps fees in the lodging band and uses the same hotel examples as this guide.",
      tips: [
        "Book Tuesday–Thursday. Weekend and holiday weeks double a midweek rate before you add the resort fee.",
        "Resort fees apply even on a $40 Tuesday. Add them in your head before you celebrate the “deal.”",
        "Food halls (Park MGM / Cosmo) or Chinatown / Downtown dinner. Strip steakhouses price like airports.",
        "Walk the Center-Strip. The monorail is a backup; Ubering from bed to the next casino is a habit.",
        "Fountains, Bellagio conservatory, and a Fremont walk are free. A nightclub table is Splurge, not mid.",
        "One show, not three. Cirque or a residency only if you're spending more — the street is already a show.",
        "Pay-as-you-go drinks until you run the math. Free drinks are not a meal plan.",
        "Downtown (Circa-adjacent / Fremont) is Budget lodging if you will walk those lights and rideshare to the Strip once."
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
      kicker: "Side-street sand · Miami",
      hook: "Ocean Drive menus are a tourist tax. Cuban breakfast and a neighborhood dinner win the week.",
      blurb: "South Beach a few blocks off the neon, or Brickell if you want mainland restaurants.",
      worksTitle: "Same sand, less neon",
      works: "You book a few blocks off Ocean Drive or you book Brickell and rideshare to the sand once. Metromover is free on the mainland. A car is a parking fee in South Beach. Spring break weeks are not the value window — they are Miami doing Miami to your card.",
      stayTitle: "A few blocks off Ocean Drive",
      stayLead: "The Gale or a Collins 2-star is the same beach as the postcard address. Freehand if the party will share.",
      stayProse: [
          "Sleep a few blocks off Ocean Drive — The Gale, a Collins 2-star, or Freehand if the party will share. Same sand, less neon, better breakfast. Brickell if you want mainland restaurants and Metromover; rideshare to the sand once.",
          "1 Hotel South Beach, Faena, or The Setai if you have room in the budget — still one neighborhood. Do not split Mid-Beach and Brickell in three nights."
        ],
      eatTitle: "Cuban breakfast, neighborhood dinner",
      eatLead: "Versailles or a ventanita — not the hotel, not Ocean Drive. Little Havana or Wynwood at night.",
      eatProse: [
          "Versailles or a ventanita, not the hotel, not Ocean Drive. Little Havana or Wynwood at night. Joe’s Stone Crab is a share if you're spending more — not five fish dinners."
        ],
      doTitle: "The beach you booked. Wynwood from the sidewalk.",
      doLead: "Skip bottle service on Budget. Everglades is a half-day only if you're spending more, not a default.",
      doProse: [
          "The beach you booked. Wynwood Walls from the sidewalk. Everglades is a half-day only if you're spending more, not a default. Skip bottle service. That is a day-price, not a snack."
        ],
      daysTitle: "Three days, one grid, no neon tax",
      daysLead: "Walk the sand you booked. Eat two blocks inland.",
      days: [
        { title: "The beach grid you slept on", body: "Cuban breakfast, the sand, dinner a few blocks off Ocean Drive. You do not need a car for this day." },
        { title: "Wynwood or Little Havana — pick one", body: "Sidewalk murals or a ventanita crawl. Brickell Metromover if you slept on the mainland. Home before you invent a second neighborhood." },
        { title: "More sand, or Everglades if you have room in the budget", body: "The same beach. Everglades only if you have room in the budget for a half-day and you accept the humidity. Bottle service is not this day." }
      ],
      base: {
        lede: "Pick South Beach side streets or Brickell. Do not split Mid-Beach and Brickell in three nights.",
        bullets: [
          "Freehand / Generator, or a Collins Avenue 2-star a few blocks off the water.",
          "1 Hotel South Beach, Faena / Setai on Mid-Beach, or Four Seasons Surf Club — one flagship."
        ]
      },
      skipTitle: "Neon with a surcharge",
      skip: [
        { name: "Ocean Drive addresses", why: "Same sand, worse breakfast, louder nights." },
        { name: "Beach-club bottle service", why: "That is a day-price, not a snack." },
        { name: "Hurricane-season “deals” without a cancel stance", why: "Flexible fare or skip. The humidity is free." }
      ],
      whenTitle: "Shoulder sand. Not spring break.",
      whenLead: "Late spring is the honest beach week. Art Basel is priced like Art Basel.",
      whenGo: "Early December, late April after spring break, and May before summer rain sets the mood.",
      whenSkip: "Spring break, Art Basel week if you did not come for it, and mid-August humidity-plus-rates.",
      whenNote: "Hurricane season (June–November) is a weather line — not automatically cheaper once you add a flexible fare.",
      aroundTitle: "Walk the grid. Metromover on the mainland.",
      around: "Walk the beach grid you booked. A car is a parking fee in South Beach.",
      aroundBullets: [
        "South Beach is walkable if you slept a few blocks off Ocean Drive.",
        "Brickell / Downtown: Metromover is free; rideshare to the sand once.",
        "MIA is close. FLL can be cheaper air plus a longer ground transfer."
      ],
      budgetNote: "Ocean Drive addresses are a tax on the same sand. Trip Plan uses a 13% lodging-tax assumption and the same Deco / Brickell examples as this guide.",
      tips: [
        "Sleep a few blocks off Ocean Drive. Same sand, less neon, better breakfast.",
        "Cuban café (Versailles or a ventanita) — not the hotel, not Ocean Drive.",
        "Skip beach-club bottle service on Budget. That is a day-price, not a snack.",
        "Midweek flights. Friday into a holiday weekend is Miami doing Miami to your card.",
        "Wynwood Walls from the sidewalk; Little Havana on foot. Everglades is a half-day only if you have room in the budget, not a default.",
        "Hurricane-season “deals” need a flexible fare or a cancel-for-any-reason stance you already priced.",
        "Brickell if you want mainland restaurants and Metromover. Do not split Mid-Beach and Brickell in three nights.",
        "Joe’s Stone Crab is a share only if you're spending more — not five fish dinners."
      ],
      related: [
        { href: "/guides/key_west", label: "Key West money guide" },
        { href: "/guides/cruise", label: "Caribbean cruise money guide" }
      ]
    }),
    G({
      id: "san_francisco",
      label: "San Francisco",
      place: "San Francisco, California",
      kicker: "Clipper-first · San Francisco",
      hook: "Transit-first city. Union Square tourist hotels are the expensive version of a Muni pass.",
      blurb: "Walk the Embarcadero, skip the Wharf menu, treat Napa as a packed-lunch day trip.",
      worksTitle: "Hills, a Clipper card, no car",
      works: "You sleep near BART or the Embarcadero, tap Clipper, and let a bus do the hill a cable car would charge you to souvenir. The Wharf is a postcard, not a dinner plan. Napa is a day trip with a sandwich — not a dinner transfer and a second hotel. July can be fog and a high room; September weather often beats it.",
      stayTitle: "Transit-first. Union Square is a tax.",
      stayLead: "Embarcadero or a neighborhood 3-star is the Mid-range stay. Hostel-plus near BART is Budget.",
      stayProse: [
          "Sleep near BART or the Embarcadero — Hotel Emeline, a Jackson Square boutique, or a Union Square-adjacent limited-service if you will actually tap Clipper. Hostel-plus Downtown if the budget is tight. Know the block on the Tenderloin edge.",
          "Fairmont or Mark Hopkins on Nob Hill, or 1 Hotel on the waterfront, if you have room in the budget. A car inside the city is a parking line. Union Square tourist hotels are a tax on a Muni pass."
        ],
      eatTitle: "Tartine, not the Wharf rack",
      eatLead: "Mission bakery breakfast. Ferry Building or a taqueria at lunch. State Bird or Zuni if you have room in the budget for one night.",
      eatProse: [
          "Tartine or a Mission bakery. Ferry Building or a taqueria at lunch. Skip the Wharf seafood rack. State Bird or Zuni if you have room in the budget for one night."
        ],
      doTitle: "Bridge, Embarcadero, one timed ferry",
      doLead: "Alcatraz book-ahead. Do not stack Alcatraz, Napa, and Yosemite in five nights.",
      doProse: [
          "Golden Gate or Crissy Field, Embarcadero, Mission murals. Alcatraz is a timed ferry — book ahead. Do not stack Alcatraz, Napa, and Yosemite in five nights. A cable car is one souvenir ticket, not transit."
        ],
      daysTitle: "Three days that stay on Clipper",
      daysLead: "Hills, a bakery, one timed ferry. Napa is a packed-lunch day if at all.",
      days: [
        { title: "Embarcadero and a bakery", body: "Ferry Building, the water, Tartine or a Mission stop if you rode that far. No Wharf prix fixe. Evening in the neighborhood you booked." },
        { title: "Alcatraz, or the bridge — not both plus Napa", body: "Timed ferry if you booked it. Otherwise Golden Gate / Crissy Field and a neighborhood walk. Do not add Yosemite." },
        { title: "Mission murals or a packed-lunch day trip", body: "Murals and a taqueria, or Napa with a sandwich — not a dinner transfer and a second hotel. Home on BART." }
      ],
      base: {
        lede: "Skip a car inside the city. Parking is a line item if you day-trip.",
        bullets: [
          "HI Downtown / City Center, or a Tenderloin-adjacent limited-service — know the block.",
          "Fairmont / Mark Hopkins on Nob Hill, or 1 Hotel / waterfront on the Embarcadero."
        ]
      },
      skipTitle: "Fog-surcharge activities",
      skip: [
        { name: "The Wharf seafood rack", why: "Tourist menu, tourist price. The Mission is a bus away." },
        { name: "A paid cable-car loop as transit", why: "One souvenir ticket is fine. A bus often reaches the same hill." },
        { name: "Napa for dinner", why: "That is a transfer, not a reservation. Pack lunch or skip." }
      ],
      whenTitle: "September weather, February rates",
      whenLead: "July can be fog and a high room. February is the value window.",
      whenGo: "Late January, February, and September after Labor Day — September weather often beats July.",
      whenSkip: "Fleet Week if you did not come for it, Pride weekend unless that is the trip, and late December.",
      whenNote: "September is the local secret and is no longer secret on weekends. Midweek SFO still wins.",
      aroundTitle: "Clipper. No car inside the city.",
      around: "Muni + BART. Parking is a line item if you day-trip Napa or Muir Woods.",
      aroundBullets: [
        "Clipper card on Muni, BART, and ferries. A visitor passport can win on a four-ride day.",
        "Cable cars are a ticketed souvenir, not transit. A bus often reaches the same hill.",
        "SFO via BART. OAK is a different transit story — price the ground."
      ],
      budgetNote: "Hotel tax is already spicy (about 16%). Trip Plan keeps it in the lodging line and uses the same Union Square / Embarcadero examples as this guide.",
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
      ]
    }),
    G({
      id: "chicago",
      label: "Chicago",
      place: "Chicago, Illinois",
      kicker: "The L · Chicago",
      hook: "The L beats surge pricing. Winter rates are the value window; summer weekends are not.",
      blurb: "River North or Fulton Market. Deep-dish once, then a neighborhood dinner.",
      worksTitle: "Trains downstairs, lake as a bonus",
      works: "You book Loop or River North limited-service so the L is a habit, not a project. Mag Mile hotels are for people who will not take the train. Winter is cold and honestly cheaper. Summer lakefront is the postcard and the premium. A suburban rate is a parking tax.",
      stayTitle: "Loop or River North with the L downstairs",
      stayLead: "Fulton Market if you want restaurants over the Mag Mile. One neighborhood, not two towers.",
      stayProse: [
          "Loop or River North limited-service so the L is downstairs — Hampton, Courtyard, or Motto class. Fulton Market if you want restaurants over the Mag Mile. One neighborhood, not two towers.",
          "A nicer River North or Fulton Market address if you have room in the budget. Still not a Mag Mile strategy. A suburban rate is a parking tax."
        ],
      eatTitle: "Deep-dish once. Then stop.",
      eatLead: "Doughnut or diner breakfast. Italian beef or Fulton Market casual is the rest of the week.",
      eatProse: [
          "Doughnut or diner breakfast. One deep-dish if you must, then Italian beef or Fulton Market casual. Downtown hotel restaurants are Chicago-priced for the same eggs."
        ],
      doTitle: "Riverwalk is free. A cruise only if you're spending more.",
      doLead: "Architecture from the sidewalk. Art Institute or a river cruise — pick one on Mid-range.",
      doProse: [
          "Architecture from the sidewalk is free. Art Institute or a river cruise — pick one. Do not stack two museums and a cruise. The Riverwalk is a pass-through, not a hotel strategy."
        ],
      daysTitle: "Three days with the L as a habit",
      daysLead: "Trains downstairs. Lake as a bonus. Deep-dish once.",
      days: [
        { title: "Riverwalk and the neighborhood you booked", body: "Diner breakfast, sidewalk architecture, dinner in River North or Fulton Market. Mag Mile is a walk-through, not a reservation." },
        { title: "One ticketed indoor", body: "Art Institute or a river cruise — you already picked. Evening back on the L. Do not add a second museum." },
        { title: "Lakefront if the weather allows, then stop", body: "A beach or park day if it is not January. Winter is the rate; you knew that. One deep-dish if you have not done the bit." }
      ],
      base: {
        lede: "If the L is not downstairs, you are paying for a car you did not want.",
        bullets: [
          "Loop or River North limited-service on a train. Skip suburban “deals.”",
          "A nicer River North or Fulton Market address — still not a Mag Mile strategy."
        ]
      },
      skipTitle: "Lakefront premiums",
      skip: [
        { name: "Lolla week and July 4th weekend", why: "A different city and a different room." },
        { name: "Deep-dish as a personality", why: "Once, then Italian beef. You have made your peace." },
        { name: "Two museums and a cruise in one day", why: "Pick one ticketed indoor on Mid-range." }
      ],
      whenTitle: "Winter rooms. Summer lakefront premium.",
      whenLead: "January through early March for the rate. Shoulder September for the walking week.",
      whenGo: "January through early March for rooms; late April and September if you want walking weather without Taste-of-Chicago rates.",
      whenSkip: "Lollapalooza week, holiday markets in December if you did not come for them, and July Fourth weekend.",
      whenNote: "Winter is cold and honestly cheaper. Midweek ORD or MDW. Friday into a holiday weekend is a different room.",
      aroundTitle: "The L beats surge",
      around: "The L is the plan. A suburban rate is a parking tax.",
      aroundBullets: [
        "Ventra card on the L and buses. A 1-day or 3-day pass wins if you ride.",
        "Walk the Riverwalk and the Mag Mile as a pass-through, not a hotel strategy.",
        "ORD vs MDW: Southwest into Midway can win. Price the L, not a downtown taxi from either."
      ],
      budgetNote: "Chicago hotel tax is among the higher US combined rates in this catalog (about 17.4%). Trip Plan already applies it. The L is how Mid-range stays Mid-range.",
      tips: [
        "Ventra day pass beats a rideshare loop. The L is the plan — Mag Mile hotels are for people who will not take it.",
        "Winter rates are the value window. Summer weekends and Lolla week are not.",
        "Doughnut or diner breakfast. Downtown hotel restaurants are Chicago-priced for the same eggs.",
        "One deep-dish if you must, then stop. Italian beef or a Fulton Market casual is the rest of the week.",
        "Architecture from the sidewalk is free. A river cruise is one ticketed outing if you have room in the budget, not a daily habit.",
        "Art Institute or a river cruise — pick one on Mid-range. Do not stack two museums and a cruise.",
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
      kicker: "A food trip · New Orleans",
      hook: "This is a food trip. Cut the hotel class before you cut the reservations.",
      blurb: "Warehouse District or Garden District. The French Quarter room premium is real — the plate is the point.",
      worksTitle: "Keep the reservation, cut the courtyard",
      works: "You come for Galatoire’s or Commander’s, not for a balcony that photographs like a brochure. Warehouse District, Mid-City, or Garden District puts you on a streetcar or a walk. A French Quarter balcony is a premium. Mardi Gras is a different budget — rooms, throw-away clothes, and surge. Do not “just happen” to overlap it.",
      stayTitle: "Cut the hotel before you cut the reservation",
      stayLead: "Peter and Paul, Pontchartrain-class, or Mid-City plus the Canal car. The Quarter room is not the plate.",
      stayProse: [
          "Warehouse District, Mid-City, or Garden District — Peter and Paul, Pontchartrain-class, or a Mid-City room plus the Canal car. Visit the Quarter; do not necessarily pay to wake up in it.",
          "A courtyard hotel if you have room in the budget. Cut the room before you cut Galatoire’s or Commander’s. This is a food trip."
        ],
      eatTitle: "This is a food trip. Act like it.",
      eatLead: "Café du Monde once. Then a neighborhood café. Po’boy lunch, one old-school dinner.",
      eatProse: [
          "Café du Monde once, then a neighborhood café. Po’boy lunch at Parkway or a shop that is not on Bourbon. One old-school dinner. Tourist-menu courtyards every night are how the balcony wins and the plate loses."
        ],
      doTitle: "Daylight Quarter. Streetcar hour.",
      doLead: "Haunted tours only if you're spending more. The music will still be there in January.",
      doProse: [
          "Daylight Quarter walks and a streetcar hour. Haunted tours only if you're spending more. Mardi Gras is a different budget — book it on purpose or miss it on purpose."
        ],
      daysTitle: "Three days built around the reservation",
      daysLead: "Keep the dinner. Cut the courtyard. Walk or take the car.",
      days: [
        { title: "Streetcar and a po’boy", body: "Neighborhood café, Parkway or a shop lunch, daylight Quarter. Café du Monde once if you must. Not Bourbon breakfast." },
        { title: "The reservation you came for", body: "Galatoire’s or Commander’s if that is the trip. Garden District walk or a streetcar hour before. Do not add a haunted tour on the same night." },
        { title: "Music, then stop stacking festivals", body: "A club or a street you can walk. Jazz Fest and Mardi Gras are priced like what they are — do not “just happen” to overlap them." }
      ],
      base: {
        lede: "Sleep where dinner is honest. Visit the Quarter; do not necessarily pay to wake up in it.",
        bullets: [
          "Mid-City or Warehouse District — streetcar, quieter nights, better breakfast.",
          "A Garden District or courtyard hotel if you have room in the budget — still cut before you cut Galatoire’s."
        ]
      },
      skipTitle: "Bourbon is a street, not a plan",
      skip: [
        { name: "French Quarter room premium as a default", why: "The plate is the point. The balcony is a surcharge." },
        { name: "Bourbon breakfast every morning", why: "Café du Monde once. Then walk." },
        { name: "Mardi Gras “by accident”", why: "It is a different budget. Book it on purpose or miss it on purpose." }
      ],
      whenTitle: "Late winter walking. Mardi Gras is a different budget.",
      whenLead: "Shoulder late winter is the walking week. Jazz Fest weekends are priced like Jazz Fest.",
      whenGo: "Late January after bowl season, and May before the heaviest heat if you missed Jazz Fest on purpose.",
      whenSkip: "Mardi Gras unless that is the trip (it is a different budget), Jazz Fest weekends, and late August heat-plus-storms.",
      whenNote: "Hurricane season is a weather line — flexible fare or skip. The music will still be there in January.",
      aroundTitle: "Walk or the St. Charles car",
      around: "Walk or streetcar. A rental car is a parking fee in Old Town.",
      aroundBullets: [
        "Streetcar (Jazzy Pass / TAP-style visitor pass) on Canal and St. Charles.",
        "Walk the Quarter in daylight; rideshare at night if you stray.",
        "MSY is a short ride. A rental car is a parking fee in Old Town."
      ],
      budgetNote: "Keep the dinner reservations and cut the courtyard hotel. Trip Plan uses a 16.2% lodging-tax assumption and the same Peter and Paul / Pontchartrain examples as this guide.",
      tips: [
        "Cut the hotel class before you cut Galatoire’s or Commander’s. This is a food trip.",
        "Warehouse District, Mid-City, or Garden District. French Quarter room premium is real and not the plate.",
        "Café du Monde once. Then a neighborhood café — not a Bourbon breakfast every morning.",
        "Po’boy lunch (Parkway or a neighborhood shop). One old-school dinner, not a tourist-menu courtyard every night.",
        "Streetcar day pass. A rental car is a parking fee you will resent.",
        "Mardi Gras is a different budget — rooms, throw-away clothes, and surge. Do not “just happen” to overlap it.",
        "Hurricane-season weeks need a cancel stance you already priced. The music will still be there in January.",
        "Haunted tours only if you're spending more. Daylight Quarter walks and a streetcar hour are Budget."
      ],
      related: [
        { href: "/guides/atlanta", label: "Atlanta money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "philadelphia",
      label: "Philadelphia",
      place: "Philadelphia, Pennsylvania",
      kicker: "Terminal lunch · Philadelphia",
      hook: "Reading Terminal is the cheap-rich lunch. Cheesesteak is one meal, not a pilgrimage.",
      blurb: "Center City or Old City. Independence is timed and free-ish; the hotel tax is not.",
      worksTitle: "Walk Independence. Ride the rest.",
      works: "Center City or Old City puts the Bell, the Hall, and the Terminal in walking distance. An airport hotel is a SEPTA tax you will resent. Independence Hall is timed — book it. The cheesesteak argument is one lunch; roast pork at DiNic’s class is the local rebuttal.",
      stayTitle: "Center City or Old City. Not the airport.",
      stayLead: "Walk to Independence. The hotel tax is about 15.5% whether you slept next to a Cinnabon or not.",
      stayProse: [
          "Center City or Old City — Hampton, Home2, Courtyard, or a walk-up near the Terminal. Independence is a walk. An airport hotel is a SEPTA tax you will resent.",
          "A nicer Center City address if you have room in the budget. Zahav only if you're spending more dinner, not a second hotel."
        ],
      eatTitle: "Reading Terminal is the lunch",
      eatLead: "Breakfast and lunch under one roof. Hotel restaurants are the expensive version of the same plate.",
      eatProse: [
          "Reading Terminal for breakfast and lunch. One cheesesteak, then roast pork at DiNic’s class. Hotel restaurants are the expensive version of the same plate."
        ],
      doTitle: "Independence timed. One museum.",
      doLead: "Barnes or PMA — pick one on Mid-range. The Bell is a line, not a morning.",
      doProse: [
          "Independence Hall timed — book it. The Bell is a line, not a morning. Barnes or PMA — pick one. Do not stack three interiors and a hop-on bus."
        ],
      daysTitle: "Three days that start at the Terminal",
      daysLead: "Walk Independence. Ride the rest. Cheesesteak is one meal.",
      days: [
        { title: "Independence and the Terminal", body: "Timed Hall, the Bell as a line you already expected, lunch under one roof. Evening in Old City or Center City — you can walk it." },
        { title: "One museum", body: "Barnes or PMA. Not both. Roast pork if you did the cheesesteak yesterday. No hop-on bus." },
        { title: "A neighborhood dinner, then the train home", body: "Italian in the neighborhood, not Zahav unless you have room in the budget. PHL is Regional Rail, not a taxi habit." }
      ],
      base: {
        lede: "If you need a train to see the Bell, you booked the airport.",
        bullets: [
          "Center City limited-service or Old City walk-up — SEPTA downstairs.",
          "A nicer Center City or Old City address. Zahav only if you're spending more — not a second hotel."
        ]
      },
      skipTitle: "Checklist tax",
      skip: [
        { name: "An airport hotel", why: "A SEPTA tax you will resent every morning." },
        { name: "Cheesesteak as a pilgrimage", why: "One, then roast pork. You have done the bit." },
        { name: "Three interiors and a tour bus", why: "Independence + one museum. Hop-on is Budget’s enemy." }
      ],
      whenTitle: "February value. July 4 is a different city.",
      whenLead: "Summer on the Parkway is festival-priced. Shoulder spring is the walking week.",
      whenGo: "February, early March, and late January after the holiday hangover.",
      whenSkip: "Fourth of July week, the Army–Navy / big-game weekends that land here, and December holiday weekends.",
      whenNote: "February rooms are the value window. Midweek PHL. The flower show is pretty; skip it if you came for the rate.",
      aroundTitle: "SEPTA. Walk Independence.",
      around: "A cheap airport room is a tax you will resent. Walk Independence; ride to the rest.",
      aroundBullets: [
        "SEPTA Key / Independence Pass if you will ride more than twice a day.",
        "Old City and Center City are walkable to each other if you like walking.",
        "PHL is a train, not a taxi habit. Price Regional Rail vs rideshare."
      ],
      budgetNote: "Philadelphia’s combined lodging tax is about 15.5% in this catalog. Trip Plan already applies it. Reading Terminal is how Budget eats well.",
      tips: [
        "Independence Hall timed entry is the ticket — book it. The Bell is a line, not a morning.",
        "Reading Terminal breakfast and lunch. Hotel restaurants are the expensive version of the same plate.",
        "One cheesesteak, then stop. Roast pork (DiNic’s class) is the local argument.",
        "SEPTA day pass beats a rideshare loop. Skip the hop-on bus on Budget.",
        "Barnes or PMA — pick one on Mid-range. Do not stack three interiors and a cheesesteak tour in one day.",
        "Midweek PHL. Fourth of July week is a different city and a different room.",
        "Stay Center City or Old City. An airport hotel is a SEPTA tax you will resent.",
        "Zahav only if you're spending more. Terminal leftovers plus one neighborhood Italian is Mid-range."
      ],
      related: [
        { href: "/guides/nyc", label: "New York City money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "atlanta",
      label: "Atlanta",
      place: "Atlanta, Georgia",
      kicker: "BeltLine week · Atlanta",
      hook: "The BeltLine is the walk. A cheap airport hotel is a rideshare habit you already paid for.",
      blurb: "Midtown or Ponce. Meat-and-three lunch. Convention weeks are not the value window.",
      worksTitle: "Trail first, cloverleaf never",
      works: "MARTA from ATL, then Midtown or Ponce so the BeltLine Eastside is the evening. Downtown convention hotels are a calendar tax. Cumberland / Buckhead cloverleaf lodging on Budget is how you buy parking and a steakhouse you did not need. Check the convention calendar before you celebrate a “deal.”",
      stayTitle: "Midtown or Ponce. Airport lodging is a rideshare habit.",
      stayLead: "Hotel Clermont or a Ponce 3-star if you want the trail. Four Seasons Midtown only if you're spending more.",
      stayProse: [
          "Midtown or Ponce — Hampton, Hotel Clermont, or a 3-star on MARTA so the BeltLine Eastside is the evening. A cheap ATL-adjacent hotel is a rideshare habit.",
          "Four Seasons Midtown if you have room in the budget. Still not Cumberland or Buckhead cloverleaf lodging. Check the convention calendar before you celebrate a deal."
        ],
      eatTitle: "Meat-and-three, not Buckhead steak",
      eatLead: "West Egg or a café breakfast. Mary Mac’s for lunch. Skip a Buckhead steakhouse on Budget.",
      eatProse: [
          "West Egg or a café breakfast. Mary Mac’s for a meat-and-three. Skip a Buckhead steakhouse. Ponce City Market is dinner walking, not a destination surcharge."
        ],
      doTitle: "The BeltLine is the walk",
      doLead: "Ponce City Market to Krog Street. Aquarium is one ticketed morning — pick-one with World of Coca-Cola.",
      doProse: [
          "BeltLine Eastside — Ponce City Market to Krog Street. Piedmont Park and MLK are free or cheap. Aquarium or World of Coca-Cola — pick one ticketed morning."
        ],
      daysTitle: "Three days on the trail, not the cloverleaf",
      daysLead: "MARTA from ATL. Walk the Eastside. Eat on the trail.",
      days: [
        { title: "BeltLine and the neighborhood you booked", body: "Café breakfast, Ponce City Market to Krog, dinner on the trail. You do not need a car for this day." },
        { title: "One ticketed morning", body: "Aquarium or World of Coca-Cola — pick one. Piedmont or MLK the rest. Do not split Buckhead and Downtown hotels." },
        { title: "More trail, or go home", body: "The same walk. Convention weeks are a different city. Four Seasons only if you're spending more — not a third neighborhood." }
      ],
      base: {
        lede: "If you cannot walk the Eastside Trail, you booked a parking garage.",
        bullets: [
          "Ponce or Midtown 3-star on MARTA / the BeltLine.",
          "Four Seasons Midtown or a nicer Midtown address — still not Cumberland."
        ]
      },
      skipTitle: "Convention-city traps",
      skip: [
        { name: "A cheap ATL-adjacent hotel", why: "You will Uber downtown twice a day. MARTA exists." },
        { name: "Splitting Buckhead and the Aquarium hotel", why: "Three nights, two towers, one tired card." },
        { name: "Convention weeks", why: "Not the value window. Read the calendar." }
      ],
      whenTitle: "Check the convention calendar first",
      whenLead: "Atlanta prices like a convention city. Shoulder late winter is the value window.",
      whenGo: "Late January through March, and November before Thanksgiving if you want walking weather without Peachtree-festival rates.",
      whenSkip: "Super Bowl / Final Four / big convention weeks when they land here, and late July humidity-plus-rates.",
      whenNote: "Midweek ATL still wins even if you already live near a hub.",
      aroundTitle: "MARTA from ATL. Trail the rest.",
      around: "BeltLine Eastside + MARTA. Skip Cumberland / Buckhead cloverleaf lodging on Budget.",
      aroundBullets: [
        "MARTA from ATL is the honest airport move. A 1-day or 3-day pass if you will ride.",
        "BeltLine Eastside Trail is the walk — Ponce City Market to Krog Street.",
        "A rental car is a parking fee if you stay Midtown and eat on the trail."
      ],
      budgetNote: "Atlanta’s combined lodging tax is high in this catalog (about 16.9%). Trip Plan already applies it. Midtown on MARTA is how Mid-range avoids a Buckhead parking tax.",
      tips: [
        "MARTA from the airport. A cheap ATL-adjacent hotel is a rideshare habit.",
        "BeltLine + Ponce City Market is Budget entertainment. The Aquarium is one ticketed morning, not the whole trip.",
        "West Egg or a café breakfast. Mary Mac’s for a meat-and-three — skip a Buckhead steakhouse on Budget.",
        "Convention weeks are not the value window. Check the calendar before you book Downtown.",
        "MARTA / BeltLine day beats a rideshare loop. Do not split Buckhead and the Aquarium hotel in three nights.",
        "Midweek ATL. You already live near a hub if you flew Delta — midweek still wins.",
        "Piedmont Park and MLK National Historical Park are free / cheap. World of Coca-Cola is a pick-one with the Aquarium.",
        "Hotel Clermont or a Ponce 3-star if you want the trail. Four Seasons Midtown only if you're spending more."
      ],
      related: [
        { href: "/guides/nola", label: "New Orleans money guide" },
        { href: "/tripfinder", label: "Trip Finder" }
      ]
    }),
    G({
      id: "paris",
      label: "Paris",
      place: "Paris, France",
      kicker: "An arrondissement · Paris",
      hook: "Bakeries and one reserved dinner beat a week of tourist-menu prix fixes on the tower steps.",
      blurb: "Metro-line lodging in the 10th–11th. Palace hotels only if you're spending more.",
      worksTitle: "Pick an arrondissement and a bakery",
      works: "Paris rewards a neighborhood you can walk in slippers and a Metro you tap without thinking. The tower is a view — Trocadéro or Champ de Mars on Budget — not a lodging strategy. The 10th–11th is where dinner is honest. A Gare hotel is fine the night you land early; it is a sad week if you never move. Stairs are the elevator. Pack light.",
      stayTitle: "An arrondissement you can walk in slippers",
      stayLead: "Ibis or a walk-up on a Metro line in the 10th, 11th, 18th, or 19th. A tower-block view is a tourist tax.",
      stayProse: [
        "Ibis or Hotel F1 on a Metro line, Generator or St. Christopher’s on the Canal or at Gare du Nord, or a 2-star walk-up near République or Oberkampf with a bakery downstairs. That is the trip: stairs, a carnet, and dinner on the block.",
        "A Left Bank or Canal 3-star — Malte or Odeon-class, a Canal Saint-Martin boutique, Luxembourg or Bastille — if you want one neighborhood and a quieter stair. Crillon, Cheval Blanc, Ritz, or Bristol only if you're spending more. Lutetia-class Left Bank if you must have a name and still want to walk."
      ],
      eatTitle: "Bakery mornings. One reserved night.",
      eatLead: "Du Pain et des Idées if you slept in the 10th. Skip anything on the tower, the hill, or the museum steps.",
      eatProse: [
        "Bakery plus coffee on your block every morning. Lunch is Bouillon Chartier, Bouillon Pigalle, or a formule du midi. L’As du Fallafel or a neighborhood bistro at night. Fromagerie plus wine is a valid dinner.",
        "Mid-range reserves one 10th–11th table or Frenchie wine bar. Splurge is Septime, Frenchie, or Le Comptoir — book before you fly. Palace-hotel dining only if you're spending more."
      ],
      doTitle: "One museum. The rest is walking.",
      doLead: "Louvre or Orsay — pick one timed ticket. A four-museum day is how you buy souvenirs you will not remember.",
      doProse: [
        "Île de la Cité and a Left Bank walk. Notre-Dame from the outside. Père Lachaise or Canal Saint-Martin. Eiffel from Trocadéro or Champ de Mars on Budget — the summit is a pick-one with Sainte-Chapelle.",
        "Mid-range: Louvre or Orsay, plus Sainte-Chapelle or a tower summit, not both. Marais or Latin Quarter in the evening. Splurge can add Versailles as a half-day tax you accepted, or a Seine dinner cruise only if you're spending more — not a third museum."
      ],
      daysTitle: "Three days that stay in walking distance",
      daysLead: "One museum day. Two walking days. Dinner on your block.",
      days: [
        { title: "Your arrondissement, then the river", body: "Bakery crawl on the block. Île de la Cité / Left Bank walk. Eiffel from Trocadéro at dusk. Do not “do” the summit on night one, and do not eat on the steps." },
        { title: "One timed museum", body: "Louvre or Orsay — you already picked. Late afternoon in the Marais or along the Canal. Neighborhood dinner. If you try both museums, you will remember the cafeteria." },
        { title: "A cemetery, a smaller room, or Versailles if you have room in the budget", body: "Père Lachaise or a second smaller museum (not a third mega). Versailles only if you have room in the budget for the half-day and you accept the RER. Evening: fromagerie, wine, stairs, bed." }
      ],
      base: {
        lede: "Sleep on a Metro line you will actually use. Visit the tower; do not pay to wake up under it.",
        bullets: [
          "Ibis or a walk-up in the 10th–11th or 18th–19th — bakery downstairs, Metro in five minutes.",
          "Palace or palace-adjacent (Crillon, Bristol, Lutetia class) only if you're spending more. Paris mid already eats a US city budget."
        ]
      },
      skipTitle: "Prix-fixe traps",
      skipLead: "The closer the monument, the worse the formule.",
      skip: [
        { name: "Restaurants on the tower, the hill, or the museum steps", why: "A tourist menu with a view surcharge. Walk five minutes." },
        { name: "A four-museum day", why: "One timed ticket. The rest is walking you will actually remember." },
        { name: "A Gare hotel for the whole week", why: "Fine for an early arrival. Sad as a neighborhood." }
      ],
      whenTitle: "February is still Paris. August is a tourist menu.",
      whenLead: "August is half-closed and fully priced for tourists. Shoulder spring is pretty and no longer cheap on weekends.",
      whenGo: "Late January through March, and November before the holiday lights become a room tax.",
      whenSkip: "Late June through August, and the two weeks around Christmas and New Year’s.",
      whenNote: "February is the value window and still Paris. Book the Atlantic crossing 2–4 months out, midweek. Open-jaw (in Paris, out Rome) often beats two one-ways.",
      aroundTitle: "Navigo. Stairs. Trocadéro for the tower.",
      around: "Navigo or a carnet. Stairs are the elevator. Gare hotels if you land early — then stay in that neighborhood or move.",
      aroundBullets: [
        "Metro + RER. A Navigo week (if your days qualify) beats a fistful of t+ tickets.",
        "Walk one arrondissement in the morning. The tower is a Trocadéro view on Budget, not a summit default.",
        "CDG vs ORY: RER B is the honest CDG move. A taxi only if you're spending more — not Budget."
      ],
      budgetTitle: "Paris mid already eats a US city budget",
      budgetNote: "Paris mid already eats a US city budget. Trip Plan uses Europe lodging-tax assumptions and the same Ibis / Canal / palace-adjacent examples as this guide.",
      tips: [
        "Bakery breakfast on your block. Du Pain et des Idées class if you slept in the 10th — not the hotel buffet.",
        "Bouillon Chartier / Pigalle or a formule du midi. Skip restaurants on the tower, the hill, and the museum steps.",
        "Navigo or a carnet. Taxis only if you're spending more. Pack light — stairs are common.",
        "Louvre or Orsay — pick one timed ticket. A four-museum day is how you buy souvenirs you will not remember.",
        "Eiffel from Trocadéro or Champ de Mars on Budget. The summit is a pick-one with Sainte-Chapelle.",
        "Book the Atlantic crossing 2–4 months out, midweek. Open-jaw (in Paris, out Rome) often beats two one-ways.",
        "Fromagerie + wine is a valid dinner. Palace-hotel dining only if you're spending more.",
        "10th–11th or 18th–19th on a Metro line. A tower-block view is a tourist tax."
      ],
      related: [
        { href: "/guides/london", label: "London money guide" },
        { href: "/guides/rome", label: "Rome money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "london",
      label: "London",
      place: "London, United Kingdom",
      kicker: "Zone 1–2 · London",
      hook: "Excellent food two Tube stops from the postcard. Tesco meal deal + Oyster is the Budget plan.",
      blurb: "South Bank, Bloomsbury, or South Ken. £8 pints are already in the luxury math.",
      worksTitle: "Contactless, then a neighborhood",
      works: "You tap a bank card, hit the daily cap, and sleep in Zone 1–2 on a line you will use. A rental car is how you buy the Congestion Charge on purpose. Free museums are the product. The Eye is a pick-one with the Tower — not both on Budget. Mayfair is extra; luxury is the room plus £8 pints.",
      stayTitle: "Zone 1–2 on a Tube line",
      stayLead: "Premier Inn or Travelodge on Budget. The Hoxton if you want restaurants on the block. Mayfair if you have room in the budget.",
      stayProse: [
          "Premier Inn or Travelodge in Zone 1–2 — Southwark, King’s Cross, or Earl’s Court — plus a contactless cap. The Hoxton Southwark or Shoreditch if you want restaurants on the block. A rental car is the Congestion Charge on purpose.",
          "Savoy, The Ned, or Claridge’s if you have room in the budget. Luxury is the room plus £8 pints. Covent Garden Hotel if you want theatre without a palace rate."
        ],
      eatTitle: "Two stops from the postcard",
      eatLead: "Bakery or Tesco breakfast. Borough or Maltby lunch. Zone 2 Indian or Turkish dinner — not a West End prix fixe every night.",
      eatProse: [
          "Bakery or Tesco breakfast. Borough or Maltby lunch. Zone 2 Indian or Turkish dinner — not a West End prix fixe every night. Pret is a fallback, not a personality."
        ],
      doTitle: "Free museums are the product",
      doLead: "British Museum or National Gallery. South Bank walk. West End rush before a full-price orchestra.",
      doProse: [
          "British Museum or National Gallery are free. South Bank walk is the product. The Eye is a pick-one with the Tower. West End rush before a full-price orchestra — one reserved seat, not three."
        ],
      daysTitle: "Three days that stay on the cap",
      daysLead: "One neighborhood. Free museums. Two Tube stops from the postcard.",
      days: [
        { title: "Your Zone 1–2 area", body: "Bakery, South Bank or Bloomsbury walk, Tesco or Borough lunch. Evening in the same neighborhood. No car." },
        { title: "One free museum, maybe a rush seat", body: "British Museum or National Gallery. West End day seats if you have room in the budget for one show. Not the Eye and the Tower." },
        { title: "A second neighborhood — still Zone 1–2", body: "South Ken museums or a Zone 2 dinner. Open-jaw with Paris if you already priced the Atlantic. Home on the Elizabeth Line." }
      ],
      base: {
        lede: "One neighborhood. No car. The cap does the rest.",
        bullets: [
          "Premier Inn / Travelodge Zone 1–2 — Southwark, King’s Cross, or Earl’s Court.",
          "Savoy, The Ned, Claridge’s / Connaught — only if you're spending more. Covent Garden Hotel if you want theatre without a palace rate."
        ]
      },
      skipTitle: "Postcard pricing",
      skip: [
        { name: "A rental car", why: "Congestion Charge you do not want." },
        { name: "The Eye and the Tower on Budget", why: "Pick one. South Bank walk is already the product." },
        { name: "West End prix fixe every night", why: "One after theatre. Zone 2 dinner the rest." }
      ],
      whenTitle: "Dark, damp, cheaper",
      whenLead: "Winter is the value window. Summer is packed and priced like a souvenir.",
      whenGo: "January, February, and November — dark, damp, and honestly cheaper.",
      whenSkip: "August bank-holiday weeks, New Year’s, and the fortnight around Christmas.",
      whenNote: "Shoulder late spring is pretty; weekends still premium. Book the Atlantic 2–4 months out, midweek.",
      aroundTitle: "Contactless. Never a car.",
      around: "Oyster or contactless. Zone 1–2 lodging.",
      aroundBullets: [
        "Contactless daily cap on Tube / bus. A Visitor Oyster only if you like souvenirs.",
        "South Bank, Bloomsbury, or South Ken — one neighborhood, no car.",
        "LHR via Elizabeth Line or Piccadilly. LGW and STN are different ground math — price it."
      ],
      budgetNote: "London mid is a room rate plus pints. Trip Plan uses Europe assumptions and the same Premier Inn / Hoxton / Savoy-class examples as this guide.",
      tips: [
        "Contactless daily cap. You almost never need a paper ticket. A rental car is a Congestion Charge you do not want.",
        "Premier Inn or Travelodge Zone 1–2 on Budget. Mayfair only if you're spending more — luxury is the room plus £8 pints.",
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
      ]
    }),
    G({
      id: "rome",
      label: "Rome",
      place: "Rome, Italy",
      kicker: "Walk the centro · Rome",
      hook: "The closer the monument, the worse the carbonara. Coperto is real — budget it.",
      blurb: "Trastevere for the walk, Termini if you land late. One timed Colosseum, not three interiors in a day.",
      worksTitle: "Stones by day, Trastevere at night",
      works: "You walk the centro until the stones blur, then you eat where the photo menus are not. Trastevere or Testaccio at night. Termini is fine if you land late — stay in that neighborhood or move in the morning. Coperto is a line item, not a scam. Bread you did not order can be too. Taxis only if you're spending more — and still stuck.",
      stayTitle: "Trastevere for dinner, centro for the stones",
      stayLead: "A 2-star over the river, or Prati near Ottaviano if the centro is sold out. Pack light; stairs are the elevator.",
      stayProse: [
          "A 2-star over the river in Trastevere, or Prati near Ottaviano if the centro is sold out. Termini is fine the night you land late — stay in that neighborhood or move in the morning. Pack light; stairs are the elevator.",
          "De Russie, Hassler, or Pantheon-adjacent 5-star if you have room in the budget. Rome mid plus one dinner often beats a palace room."
        ],
      eatTitle: "The closer the monument, the worse the carbonara",
      eatLead: "Cornetto standing at the bar. Skip the photo-menu restaurant on Piazza Navona.",
      eatProse: [
          "Cornetto standing at the bar. Trastevere or Testaccio at night. Skip the photo-menu carbonara on Piazza Navona. Coperto is a line item — budget it."
        ],
      doTitle: "One timed interior a day",
      doLead: "Colosseum + Forum, or Vatican Museums — pick a pace. Golf-cart forum tours only if you're spending more.",
      doProse: [
          "Colosseum plus Forum timed, or Vatican Museums — pick a pace. Do not stack three ticketed interiors in one day. Golf-cart forum tours only if you're spending more. Daylight centro walks are the product."
        ],
      daysTitle: "Three days of stones, then dinner across the river",
      daysLead: "One timed interior a day. Walk the rest. Eat where the photo menus are not.",
      days: [
        { title: "Centro on foot, Trastevere at night", body: "Pantheon area in daylight, cornetto at the bar, dinner over the river. No taxi. No Navona carbonara." },
        { title: "One timed ruin", body: "Colosseum and Forum, or the Vatican — you already picked. Evening in Testaccio. Do not add a golf-cart." },
        { title: "A quieter morning, then stop stacking interiors", body: "Prati or a second walk, not a third ticketed ceiling. La Pergola only if you're spending more. Roscioli-adjacent is enough." }
      ],
      base: {
        lede: "Walk to dinner. Metro to the Vatican. Do not taxi the centro.",
        bullets: [
          "Trastevere guesthouse or Termini 2-star if you land late. Prati near Ottaviano for calmer nights.",
          "De Russie, Hassler / Eden, or Pantheon-adjacent 5-star — only if you're spending more. Rome mid plus one dinner often beats a palace room."
        ]
      },
      skipTitle: "Piazza menus",
      skip: [
        { name: "Photo-menu carbonara on Navona", why: "Walk to Trastevere or Testaccio." },
        { name: "Three ticketed interiors in one day", why: "You will remember the line, not the ceiling." },
        { name: "Golf-cart forum tours", why: "Daylight centro walks are Budget and better." }
      ],
      whenTitle: "February walking. Easter is a surcharge.",
      whenLead: "August is hot and half on holiday. Shoulder April is pretty and priced like Holy Week if it overlaps.",
      whenGo: "Late January through March, and November before the holiday nativity crowds.",
      whenSkip: "Easter week, August, and the Christmas–New Year stretch.",
      whenNote: "Midweek FCO, 2–4 months out. Open-jaw with Paris or Venice often beats a backtrack.",
      aroundTitle: "Walk the centro. Metro for the Vatican.",
      around: "Walk the centro. Metro to the Vatican or Termini. Taxis only if you're spending more — and still stuck.",
      aroundBullets: [
        "Walk Trastevere, the Pantheon area, and Testaccio. Pack light; stairs are the elevator.",
        "Metro A/B for Vatican and Termini hops. A 48- or 72-hour pass if you will ride.",
        "FCO via Leonardo Express to Termini if you land late — then stay in that neighborhood or move in the morning."
      ],
      budgetNote: "Rome mid plus one dinner often beats a palace room. Trip Plan uses Europe assumptions and the same Trastevere / Pantheon / de Russie examples as this guide.",
      tips: [
        "Cornetto and coffee standing at the bar. The hotel breakfast is a tourist menu with orange juice.",
        "Trastevere or Testaccio dinner. Skip the photo-menu restaurant on Piazza Navona.",
        "Coperto is a line item, not a scam. Budget it. Bread you did not order can be too.",
        "Colosseum + Forum timed, or Vatican Museums — pick a pace. Do not stack three ticketed interiors in one day.",
        "Golf-cart forum tours only if you're spending more. Daylight centro walks are Budget.",
        "Midweek FCO, 2–4 months out. Open-jaw with Paris or Venice often beats a backtrack.",
        "Prati near Ottaviano if the centro is sold out — Metro to the Vatican, calmer nights.",
        "La Pergola only if you're spending more. Roscioli-adjacent or a Testaccio trattoria is Mid-range."
      ],
      related: [
        { href: "/guides/paris", label: "Paris money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "tokyo",
      label: "Tokyo",
      place: "Tokyo, Japan",
      kicker: "Station downstairs · Tokyo",
      hook: "Tokyo can be cheap if you let it. Convenience-store breakfast is not a compromise — hotel breakfast is.",
      blurb: "Business hotel next to a JR or Metro station. A JR Pass is usually a bad buy on a 5-night city trip.",
      worksTitle: "A station with a city attached",
      works: "Sleep above a JR or Metro line, tap Suica, and let the convenience store do breakfast. Pick a ward — Shinjuku, Shibuya, Ueno, or Tokyo Station — and walk it. A JR Pass on a 5-night city trip is a souvenir spreadsheet. Kyoto is a different trip; do not fake it as a Tokyo day. Haneda is the closer gift. Narita is a Skyliner or N’EX line you should price.",
      stayTitle: "A business hotel over a station",
      stayLead: "APA, Super Hotel, or Toyoko Inn next to Shinjuku or Ueno. Capsule only if you packed a cube.",
      stayProse: [
        "APA, Super Hotel, or Toyoko Inn in Shinjuku or Ueno — station downstairs, convenience store in the lobby. Sakura Hotel Jimbocho or a hostel-plus in Asakusa if you want to walk to a Metro, not a taxi habit. Nine Hours only if you packed like a cube.",
        "Mitsui Garden Shibuya or Ginza Premier, Hotel Gracery Shinjuku, Shibuya Stream Excel, or The Knot near Tokyo Station if you want trains without a rail-pass spreadsheet. Aman Tokyo, Mandarin Oriental, Palace Hotel, or Park Hyatt Shinjuku if you have room in the budget. Tokyo luxury is the room or the sushi counter — rarely both. You still take the Metro to dinner."
      ],
      eatTitle: "Konbini breakfast is the win",
      eatLead: "Onigiri and coffee. Conveyor sushi and ramen at lunch. Book one sushi counter if you have room in the budget — before you land.",
      eatProse: [
        "Convenience-store breakfast is the plan, not a fallback. Lunch is conveyor or standing sushi, ramen, or a depachika in a department store. Dinner is an izakaya or gyudon in the ward you booked. Skip the hotel buffet.",
        "Mid-range books one counter or a proper izakaya. Splurge is a sushi tasting you reserved before you landed. The room or the counter, rarely both. Park Hyatt views still end with a Metro ride to dinner."
      ],
      doTitle: "One ward a day. Kyoto is a different trip.",
      doLead: "Yanaka or Shimokitazawa mornings are free. teamLab or a tower is one ticketed indoor.",
      doProse: [
        "Day one is your ward: Shinjuku night walk or Shibuya scramble plus a konbini picnic. Asakusa and Senso-ji are a river morning, not a checklist with a taxi between them.",
        "Yanaka or Shimokitazawa when you want quiet. One ticketed indoor — teamLab, a tower, or a museum. Kamakura or Nikko only if you have room in the budget for the JR math. Kyoto is a different trip."
      ],
      daysTitle: "Three days, one ward at a time",
      daysLead: "Tap Suica. Do not build a shinkansen day into a city week.",
      days: [
        { title: "The ward you booked", body: "Shinjuku or Shibuya on foot. Convenience-store picnic in a park. Night walk, one izakaya, Metro home. You are not late for Kyoto. There is no Kyoto." },
        { title: "Asakusa morning, one ticketed indoor", body: "Senso-ji and the river early. Then teamLab or a museum — one, off-peak if you can. Evening back in your ward. Taxis only if you're spending more." },
        { title: "A quiet ward — or Kamakura if you have room in the budget", body: "Yanaka or Shimokitazawa / Kichijoji for a free morning. Kamakura only if you have room in the budget for the train and you accept a half-day out of the city. Do not fake Kyoto." }
      ],
      base: {
        lede: "Station downstairs or you will invent taxis.",
        bullets: [
          "APA / Super Hotel / Toyoko Inn in Shinjuku or Ueno — lobby konbini, trains in the basement.",
          "Aman / Mandarin in Otemachi–Nihonbashi, or Park Hyatt Shinjuku for the view. Room or sushi counter — rarely both."
        ]
      },
      skipTitle: "Expensive habits that feel efficient",
      skipLead: "Tokyo will let you overspend while feeling very organized about it.",
      skip: [
        { name: "The hotel breakfast buffet", why: "Konbini is better and cheaper. This is not a compromise." },
        { name: "A JR Pass on a 5-night city trip", why: "IC card + Metro is the plan. The pass is a souvenir spreadsheet." },
        { name: "Kyoto as a Tokyo day", why: "That is a different trip. You will see a station and a blur." }
      ],
      whenTitle: "Skip Golden Week. January still eats well.",
      whenLead: "Cherry blossom is the point or it is a surcharge. Shoulder winter is the value window and still excellent food.",
      whenGo: "Late January through early March (before peak blossom weekends), and June if you accept rain for rooms.",
      whenSkip: "Golden Week, peak cherry-blossom weekends, Obon, and New Year’s.",
      whenNote: "Late January is the value window. Book the sushi counter before you land if you have room in the budget.",
      aroundTitle: "Suica. Tap. Stop thinking.",
      around: "Suica / PASMO on JR and Metro. Station downstairs is the lodging product. Taxis only if you're spending more.",
      aroundBullets: [
        "IC card (Suica / PASMO / Welcome Suica). Tap and stop thinking.",
        "Shinjuku, Shibuya, Ueno, or Tokyo Station — pick a ward and walk it.",
        "NRT vs HND: Haneda is the closer gift. Narita is a Skyliner or N’EX line you should price."
      ],
      budgetTitle: "Budget is a business hotel and konbini",
      budgetNote: "Tokyo Budget is a business hotel and konbini. Splurge is the room or the sushi counter — rarely both. Trip Plan uses Asia flight patterns and the same APA / Mitsui Garden / Aman examples as this guide.",
      tips: [
        "Convenience-store onigiri and coffee for breakfast. Hotel buffets are the expensive path.",
        "A JR Pass is usually a bad buy on a 5-night city trip. IC card + Metro is the plan.",
        "APA / Super Hotel / Toyoko Inn next to a station on Budget. Capsule only if you packed a cube.",
        "Conveyor sushi and ramen are Mid-range lunches. Book one sushi counter if you have room in the budget — before you land.",
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
      kicker: "All-inclusive math · Cancún",
      hook: "All-inclusive food is the product. The leak is tips, bottled water you already paid for, and a timeshare morning.",
      blurb: "Hotel Zone value AI or a named 4-star. Confirm the airport transfer is in the rate.",
      worksTitle: "The resort is the week",
      works: "You bought a beach, a buffet, and a transfer — or you forgot the transfer and Budget died at the dock. Eat on-property; that is the product. Downtown is a planned taco night, not a wandering taxi habit. Timeshare-day “free” excursions are a half-day tax. Garden view on purpose. Ocean-view and swim-up upsells only if you're spending more.",
      stayTitle: "The resort is the transit",
      stayLead: "Hotel Zone value AI. Confirm the van is in the rate. Le Blanc only if you're spending more — not a personality.",
      stayProse: [
          "Hotel Zone value AI — Riu Cancún or Palace Peninsula class, Oasis or Krystal Grand — garden view on purpose. Confirm the airport transfer is in the rate. The dock surprise is how a Budget week dies.",
          "Hyatt Ziva or a named 4-star if you want family beach without the swim-up upsell. Zilara, Le Blanc, or Nizuc / Rosewood south of the Zone if you have room in the budget — that is a different transfer. One property."
        ],
      eatTitle: "You already paid for the buffet",
      eatLead: "Casual à-la-carte at night. One downtown taco dinner only if the transfer is cheap.",
      eatProse: [
          "Eat on-property. That is the product. Casual à-la-carte at night. One downtown taco dinner only if the transfer is cheap. Do not buy bottled water you already paid for at a dock kiosk."
        ],
      doTitle: "Beach days. One ticketed outing.",
      doLead: "Isla Mujeres ferry or one cenote — pick one. Chichén Itzá is a long day.",
      doProse: [
          "Beach days are the week. Isla Mujeres ferry or one cenote — pick one. Chichén Itzá is a long day with a trusted tour only if you have room in the budget. Skip the timeshare-day “free” excursion."
        ],
      daysTitle: "Three days inside the gate, plus one outing",
      daysLead: "The resort is the week. Price the van. Sit still.",
      days: [
        { title: "Arrive, transfer, buffet", body: "The van was in the rate. Garden view. Eat on-property. Downtown is not tonight." },
        { title: "Beach, or one ticketed outing", body: "Isla Mujeres or a cenote — pick one. Not both. Not a timeshare morning." },
        { title: "More beach. Ruin day only if you have room in the budget", body: "Chichén Itzá is a long day. Most weeks should stay on the sand you already paid for." }
      ],
      base: {
        lede: "One property. The week happens inside the gate unless you priced an outing.",
        bullets: [
          "Riu Cancún / Palace Peninsula class, or Oasis / Krystal Grand — no swim-up upsell.",
          "Zilara, Le Blanc, or Nizuc / Rosewood Mayakobá south of the Zone — a different transfer."
        ]
      },
      skipTitle: "Dock surprises",
      skip: [
        { name: "The timeshare-day “free” excursion", why: "A half-day tax with a smile." },
        { name: "Bottled water at the dock kiosk", why: "You already paid for water. This is how a Budget week dies." },
        { name: "Ocean-view and swim-up as defaults", why: "Garden view on purpose. Upsells only if you're spending more." }
      ],
      whenTitle: "May heat-for-value. Winter is snowbird-priced.",
      whenLead: "Hurricane season is the cheap window with a weather line. Shoulder May is the honest trade.",
      whenGo: "Early May, late September, and early October — after spring break, before winter northbound escape rates.",
      whenSkip: "Christmas–New Year’s, spring break, and peak Easter weeks.",
      whenNote: "Hurricane-season deals need a cancel stance. Shoulder May is the heat-for-value trade without the storm math.",
      aroundTitle: "Transfer in the rate. Then sit still.",
      around: "The resort is the lodging and the transit. One pre-booked transfer. Downtown is a planned night, not a wandering taxi habit.",
      aroundBullets: [
        "Airport transfer in the rate — or a pre-booked van. The dock surprise is how a Budget week dies.",
        "Hotel Zone bus (R-1) if you will hop. Most AI weeks never need it.",
        "CUN is close. A rental car only if you're spending more unless this is a ruin week you already priced."
      ],
      budgetNote: "Cancún AI uses the dedicated all-inclusive math on Trip Plan — package, flights, customary tips, two excursions. Swim-up suites and timeshare mornings are not in the band.",
      tips: [
        "Confirm the airport transfer is in the rate. The surprise van is how a value AI stops being value.",
        "Eat on-property — that is the product. One downtown taco night only if the transfer is cheap.",
        "Skip the timeshare-day “free” excursion. It is a half-day tax.",
        "Do not buy bottled water you already paid for at a dock kiosk.",
        "Isla Mujeres ferry or one cenote — pick one ticketed day. Beach days are the rest.",
        "Chichén Itzá is a long day. Only with a trusted tour if you have room in the budget.",
        "Hurricane-season deals need a cancel stance. Shoulder May is the heat-for-value trade without the storm math.",
        "Garden view on purpose. Ocean-view and swim-up upsells only if you're spending more — not Budget."
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
      kicker: "Waikiki bus grid · Oahu",
      hook: "Waikiki bus grid. Resort breakfast every morning is how mainland prices follow you across the Pacific.",
      blurb: "Walk-to-beach midrise or a kitchenette. A car becomes mandatory the minute you leave Waikiki on purpose.",
      worksTitle: "TheBus until you leave on purpose",
      works: "If you will stay on Kalakaua and the #2 / #8 / #13, skip the car and the $40–55 parking line. Grocery the condo. Plate lunch is lunch. A neighbor-island hop is a second fare — do not assume it is in the Honolulu ticket. Kahala or Ko Olina only if you're spending more, and usually a car.",
      stayTitle: "Waikiki bus grid, or admit you need a car",
      stayLead: "One block back is the same beach. Halekulani is Waikiki luxury if you refuse to leave the grid.",
      stayProse: [
          "Waikiki midrise one block back — Hampton, Holiday Inn Express, Aqua Oasis, or a Kuhio kitchenette. Same beach as Kalakaua, less restaurant-row tax. Skip the car if you will stay on TheBus.",
          "Halekulani if you refuse to leave the grid. Kahala or Ko Olina if you have room in the budget plus kids — that usually means a car. A neighbor-island hop is a second fare."
        ],
      eatTitle: "Plate lunch. Resort breakfast is mainland plus a view.",
      eatLead: "Rainbow Drive-In / L&L class. Leonard’s malasadas once, not as a meal.",
      eatProse: [
          "Grocery the condo. Plate lunch (Rainbow Drive-In / L&L) and poke. Leonard’s malasadas once, not as a meal. Resort breakfast every morning is mainland prices plus a view surcharge."
        ],
      doTitle: "The sand in front. One reserved bay.",
      doLead: "Hanauma is reserved and ticketed. Pearl Harbor is one somber morning — not a beach day.",
      doProse: [
          "The sand in front. Hanauma is reserved and ticketed. Pearl Harbor is one somber morning — not a beach day. Do not stack Maui into five Oahu nights without a second ticket."
        ],
      daysTitle: "Three days on the Waikiki grid",
      daysLead: "TheBus until you leave on purpose. Grocery the first hour.",
      days: [
        { title: "The beach you walked to", body: "Plate-lunch breakfast, the sand, poke for dinner. You do not need a car for this day." },
        { title: "Hanauma or Pearl Harbor — pick one", body: "Reserved bay or a somber morning. Not both. Evening back on Kalakaua or one block behind it." },
        { title: "More sand, or a North Shore day you priced", body: "A car only if this is the day you leave the grid on purpose. Parking is $40–55 if you never do." }
      ],
      base: {
        lede: "Sleep on the grid, or budget a car the first hour.",
        bullets: [
          "Aqua Oasis / Shoreline class, or a Kuhio Avenue 2-star — kitchenette beats resort breakfast.",
          "Kahala or Ko Olina / Aulani if you have room in the budget + kids (car assumed), or Halekulani if you refuse to leave Waikiki."
        ]
      },
      skipTitle: "Mainland prices with palm trees",
      skip: [
        { name: "Resort breakfast every morning", why: "Grocery the condo. The view surcharge is real." },
        { name: "A car you will park in Waikiki", why: "Parking is $40–55/night if you never leave the grid." },
        { name: "Stacking Maui into five Oahu nights", why: "A neighbor-island hop is a second ticket." }
      ],
      whenTitle: "May and September. Winter is a souvenir.",
      whenLead: "Hawaii peak is winter holidays and summer. Trade winds do not care about your room rate.",
      whenGo: "May and September–early October — after spring break, before winter northbound rates.",
      whenSkip: "Late December through early January, and mid-summer if you can move the week.",
      whenNote: "Shoulder May / September is the honest value window. Midweek HNL from the West Coast. East Coast origins pay a red-eye or a fare — price both.",
      aroundTitle: "TheBus until you leave on purpose.",
      around: "TheBus in Waikiki if you will stay on the sand and the #2 / #8 / #13. A car is a $40–55 parking line plus a North Shore day you priced.",
      aroundBullets: [
        "TheBus / HOLO card. A visitor pass can win if you leave Waikiki twice a day.",
        "Walk Kalakaua if you slept on it. One block back is the same beach.",
        "HNL is close. A neighbor-island hop is a second fare — do not assume it is in the Honolulu ticket."
      ],
      budgetNote: "Hawaii lodging tax is high in this catalog (about 17.8%). Trip Plan applies it. Kitchenette breakfasts are how Budget survives Waikiki restaurant rows.",
      tips: [
        "Grocery the condo or a plate-lunch breakfast. Resort breakfast every day is mainland prices plus a view surcharge.",
        "Skip the car if you will stay on the Waikiki bus grid. Parking is $40–55/night.",
        "Plate lunch (Rainbow Drive-In / L&L class) and poke. Leonard’s malasadas once, not as a meal.",
        "Hanauma Bay is reserved and ticketed. Pearl Harbor is one somber morning — not a beach day.",
        "Midweek HNL from the West Coast. East Coast origins pay a red-eye or a fare — price both.",
        "A neighbor-island hop is a second ticket. Do not stack Maui into five Oahu nights without a second fare.",
        "May and September are the value window. Winter holidays are priced like a souvenir.",
        "Kahala or Ko Olina only if you're spending more, and usually a car. Halekulani is Waikiki luxury if you refuse to leave the grid."
      ],
      related: [
        { href: "/guides/maui", label: "Maui money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "maui",
      label: "Maui",
      place: "Maui, Hawaii",
      kicker: "Condo kitchen · Maui",
      hook: "The condo kitchen is the budget. Resort restaurants on Maui are a second lodging charge.",
      blurb: "Kihei kitchen first. Kaanapali walk-to-beach mid. Wailea is the room — do not also buy every excursion.",
      worksTitle: "Pick one coast. Grocery the first hour.",
      works: "A car is the island — that is not optional once you leave the condo path. Pick Kihei, Kaanapali, or Wailea and stay there. Road to Hana is an early start, not a beach day. Haleakalā sunrise is a 2 a.m. ticket. Do not stack Hana, Haleakalā, and a Molokini boat in four days. Mama’s Fish House only if you're spending more.",
      stayTitle: "Kihei kitchen first",
      stayLead: "Cook two nights. Kaanapali if you want the beach path. Wailea is the room — do not also buy every boat.",
      stayProse: [
          "Kihei condo first — Maui Coast, Punahoa, Kohea Kai class — walk to a food truck. Cook two nights. Kaanapali if you want the beach path. Pick one coast.",
          "Sheraton Maui or a Kaanapali walk-to-beach mid if you have room in the budget for fees and parking. Grand Wailea, Andaz, or Four Seasons in Wailea is the room — do not also buy every boat."
        ],
      eatTitle: "Cook two nights. Food trucks the rest.",
      eatLead: "Kihei or Paia trucks. One fish dinner, not five. Resort breakfast buffets are a second lodging charge.",
      eatProse: [
          "Grocery the first hour. Food trucks in Kihei or Paia. One fish dinner, not five. Resort breakfast buffets are a second lodging charge. Mama’s Fish House only if you're spending more."
        ],
      doTitle: "The beach you booked. Do not stack Hana and Haleakalā.",
      doLead: "The sand in front of the condo is the product. Pick one big outing on purpose.",
      doProse: [
          "The beach in front of the condo is the product. Road to Hana is an early start, not a rushed Budget day. Haleakalā sunrise is a 2 a.m. ticket. Do not stack Hana, Haleakalā, and Molokini in four days."
        ],
      daysTitle: "Three days on one coast",
      daysLead: "Grocery the first hour. The sand you booked is the rest.",
      days: [
        { title: "Condo, grocery, the beach in front", body: "Cook tonight. Walk to a truck if you must go out. You already paid for this sand." },
        { title: "One big outing — or none", body: "Hana or Haleakalā, not both. Rain makes Hana a different brochure. Come home to the same coast." },
        { title: "More beach. A boat only if you have room in the budget", body: "Molokini only if you're spending more — not a default. Do not hotel-hop to Wailea for one dinner." }
      ],
      base: {
        lede: "One coast. Grocery before the condo. The first hour is the budget.",
        bullets: [
          "Kihei condo (Maui Coast / Punahoa / Kohea Kai class) — walk to a food truck.",
          "Grand Wailea, Andaz, or Four Seasons in Wailea — only if you're spending more, and you will still drive to dinner."
        ]
      },
      skipTitle: "Brochure days that wreck the week",
      skip: [
        { name: "Road to Hana as a rushed Budget day", why: "Early start, not a beach day. Rain is a different brochure." },
        { name: "Hana + Haleakalā + Molokini in four days", why: "Pick one. The beach you booked is the rest." },
        { name: "Resort breakfast buffets as a habit", why: "A second lodging charge. The kitchen exists." }
      ],
      whenTitle: "Same Hawaii shoulder. Hana in the rain is not the brochure.",
      whenLead: "May and September–early October. Winter holidays are a different island.",
      whenGo: "May and September–early October.",
      whenSkip: "Christmas–New Year’s, whale-season holiday weeks if you did not come for whales, and mid-summer if you can move.",
      whenNote: "Road to Hana in the rain is a different day than the brochure. Resort fees and parking will show up on Kaanapali / Wailea — add them in your head.",
      aroundTitle: "The car is the island.",
      around: "A car is the island. That is not optional once you leave the condo path. Price parking and a grocery stop the first hour.",
      aroundBullets: [
        "Pick up the car at OGG and grocery before the condo. The first hour is the budget.",
        "Kihei / Wailea / Kaanapali — pick one coast. Do not hotel-hop.",
        "Road to Hana is an early start, not a beach day. Haleakalā sunrise is a 2 a.m. ticket."
      ],
      budgetNote: "Maui Mid-range is a Kaanapali beach path plus a kitchen a few nights. Trip Plan uses Hawaii tax and the same Kihei / Sheraton / Grand Wailea examples as this guide.",
      tips: [
        "Grocery the condo the first hour. Cook two nights. Resort breakfast buffets are a second lodging charge.",
        "Food trucks in Kihei or Paia. One fish dinner, not five.",
        "The beach in front of the condo is the product. Skip Road to Hana as a rushed Budget day.",
        "Haleakalā sunrise is ticketed and a 2 a.m. wake-up — pick it on purpose, not as a default.",
        "Do not stack Hana, Haleakalā, and a Molokini boat in four days.",
        "Resort fees and parking will show up on Kaanapali / Wailea. Add them in your head.",
        "May and September are the value window. Winter holidays are a different island.",
        "Mama’s Fish House only if you're spending more. The kitchen plus one casual plate is Mid-range."
      ],
      related: [
        { href: "/guides/oahu", label: "Oahu money guide" },
        { href: "/big-trip", label: "The Big Trip" }
      ]
    }),
    G({
      id: "cruise",
      label: "Caribbean cruise",
      place: "Florida ports · 7-night style",
      kicker: "The fare is the start · Caribbean",
      hook: "The fare includes the dining room. Specialty, drinks, and the dock kiosk are the trap.",
      blurb: "Cabin, automatic gratuities, drinks math, and flights to port. Interior is a bed. The deck is the trip.",
      worksTitle: "The ship is the hotel. The pier is the trap.",
      works: "You bought an itinerary and a deck, not a porthole. Fly in the day before if you cannot miss the gangway — that hotel is a line, not a maybe. In port, walk or a pre-negotiated taxi. The “tour” on the pier is the overrun. Automatic gratuities (age 2+) are not optional math and they are not buried in the fare. Run the drink-package break-even before you tap yes.",
      stayTitle: "Interior is a bed. The deck is the trip.",
      stayLead: "Interior or obstructed oceanview on Budget. A balcony is the Caribbean product most people actually want — still not a suite.",
      stayProse: [
          "Interior guarantee or obstructed oceanview if the price is the point — you bought the itinerary and the deck, not the porthole. Lower-deck midship if you get seasick. Fly in the day before if you cannot miss the gangway.",
          "Oceanview or a midship balcony is the Caribbean product most people actually want. Aft-wrap or Haven / suite-adjacent if you have room in the budget — suite gratuities are their own line."
        ],
      eatTitle: "The dining room is already in the fare",
      eatLead: "Main dining room every night on Budget. One specialty night only if you have room in the budget. Room service is a backup, not breakfast.",
      eatProse: [
          "The dining room is already in the fare. Main dining most nights. One specialty night only if you have room in the budget. Run the drink-package break-even before you tap yes. Room service is a backup, not breakfast."
        ],
      doTitle: "Sea days and one independent port walk",
      doLead: "Ship shows and the pool are already in the fare. One ship excursion plus one independent walk — not three dock tours.",
      doProse: [
          "Sea days are the product. One independent port walk plus one ship excursion — not three dock tours. Ship shows and the pool are already in the fare. The pier kiosk is the overrun."
        ],
      daysTitle: "A 3-day skeleton for a 7-night habit",
      daysLead: "The ship is the hotel. The pier is the trap. Price the pre-cruise night.",
      days: [
        { title: "Embark without missing the ship", body: "Florida port hotel the night before if the flight cannot miss the gangway. Interior is a bed. The deck is the evening." },
        { title: "A sea day you already paid for", body: "Walk the deck, eat in the dining room, skip the spa menu. Run the drink-package math before you tap yes." },
        { title: "One port, two ways to spend it", body: "Independent walk or one ship excursion — not three dock tours. Automatic gratuities are already a line. Kids soda may be the only package that wins." }
      ],
      base: {
        lede: "You are booking a cabin class, not a neighborhood.",
        bullets: [
          "Interior guarantee or obstructed oceanview — Carnival or MSC if the price is the point. Lower-deck midship if you get seasick.",
          "Large balcony, aft-wrap, or NCL Haven / Royal suite-adjacent. Suite gratuities run higher; they are their own line."
        ]
      },
      skipTitle: "How the brochure fare becomes the bill",
      skip: [
        { name: "Tapping yes on the drink package", why: "À-la-carte wins if you are not a five-drink day. Run the break-even." },
        { name: "Three dock tours", why: "One independent walk plus one ship excursion." },
        { name: "Specialty every night", why: "The dining room is the product. One specialty night if you're spending more." }
      ],
      whenTitle: "Shoulder sailings. Holiday weeks are a different ship.",
      whenLead: "Early May and early September cut the cabin and the air to Florida ports.",
      whenGo: "Early May, early September, and late October–early November — after spring break, before holiday sailings.",
      whenSkip: "Christmas and New Year’s weeks, Presidents’ Day, and most spring-break sailings.",
      whenNote: "Hurricane season is a weather line — flexible fare or skip. September can be a value if you accept the forecast.",
      aroundTitle: "The ship is the hotel. The pier is the trap.",
      around: "Ports are a walk or a pre-booked independent taxi — not a dock kiosk. Price the pre-cruise hotel if your flight cannot miss the gangway.",
      aroundBullets: [
        "Fly in the day before if you cannot miss the ship. That hotel is a line, not a maybe.",
        "Port parking only if you drove. Rideshare to PortMiami / Port Canaveral / Port Everglades is often cheaper than a week of parking.",
        "In port: walk or a pre-negotiated taxi. The “tour” on the pier is the overrun."
      ],
      budgetNote: "Trip Plan uses the dedicated cruise math — cabin, automatic gratuities (age 2+), drinks, excursions, flights. The brochure fare is the starting point, not the total.",
      tips: [
        "Run the drink-package break-even before you tap yes. À-la-carte wins if you are not a five-drink day.",
        "Interior or obstructed oceanview on Budget. You bought the itinerary and the deck, not the porthole.",
        "Main dining room every night on Budget. One specialty night only if you have room in the budget.",
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
      kicker: "Old Town walk · Key West",
      hook: "Mallory menus are a tax. Cuban breakfast, one named dinner, and sunset from the sidewalk.",
      blurb: "Old Town walkable. A cheap Stock Island room plus a nightly cab is not Budget.",
      worksTitle: "Duval is a street, not a hotel strategy",
      works: "Old Town is the product: bike or walk, Cuban coffee, sunset from the sidewalk. Stock Island lodging only if you like the commute — most people should not. EYW is tiny and expensive air; drive-down from Miami is a day you should price as a day. The Conch Train is a souvenir, not transit. Fantasy Fest is a different budget.",
      stayTitle: "Old Town or you bought a commute",
      stayLead: "A guesthouse you can walk from. Casa Marina only if you're spending more. Stock Island plus a cab is not Budget.",
      stayProse: [
          "Old Town guesthouse you can walk from — Hampton adjacent, Big Ruby, or a Truman Annex-adjacent inn. Duval is a street, not a hotel strategy. Stock Island plus a nightly cab is not Budget.",
          "Gardens Hotel or Casa Marina if you have room in the budget — still Old Town. EYW is tiny and expensive air; midweek, or drive from Miami as a priced day."
        ],
      eatTitle: "Cuban breakfast. Mallory is a tax.",
      eatLead: "Cuban Coffee Queen or a ventanita. El Siboney or Garbo’s for Budget dinner. Blue Heaven early if you have room in the budget for the wait.",
      eatProse: [
          "Cuban Coffee Queen or a ventanita. El Siboney or Garbo’s at night. Blue Heaven early if you have room in the budget for the wait. Mallory Square menus are a tax on the same sunset."
        ],
      doTitle: "Sunset from the sidewalk. Fort Zach for the swim.",
      doLead: "Parasail only if you're spending more. Dry Tortugas is a full ferry day — only if you have room in the budget.",
      doProse: [
          "Sunset from the sidewalk. Fort Zach for the swim. Parasail only if you're spending more. Dry Tortugas is a full ferry day — only if you have room in the budget. Do not stack Tortugas, a sunset sail, and a seaplane in three nights."
        ],
      daysTitle: "Three days you can walk",
      daysLead: "Old Town. Cuban breakfast. Sunset from the sidewalk.",
      days: [
        { title: "The island you booked", body: "Ventanita, walk Duval as a street, Fort Zach if you want a swim. Sunset from the sidewalk. No Mallory menu." },
        { title: "One named dinner", body: "El Siboney or Garbo’s, or Blue Heaven if you have room in the budget for the wait. Key lime pie once. Happy-hour fritters are a snack." },
        { title: "More walking — Tortugas only if you have room in the budget", body: "The same Old Town. Dry Tortugas is a full day. Do not add a seaplane and a sunset sail on the same card." }
      ],
      base: {
        lede: "If you cannot walk to sunset, you booked the wrong island math.",
        bullets: [
          "Old Town guesthouse — bike, ventanita, sidewalk sunset.",
          "Gardens Hotel or Casa Marina class — still Old Town, still not Stock Island."
        ]
      },
      skipTitle: "Island surcharges",
      skip: [
        { name: "Mallory Square menus", why: "A tax on the same sunset you can watch from the sidewalk." },
        { name: "A cheap Stock Island room", why: "Plus a nightly cab is not Budget." },
        { name: "Tortugas + a sunset sail + a seaplane", why: "Do not stack three big days into three nights." }
      ],
      whenTitle: "Late spring walking. Fantasy Fest is a different budget.",
      whenLead: "Shoulder late spring is the honest walking week. Winter is priced like a snowbird who brought friends.",
      whenGo: "Early May and late September–October after the heaviest summer, before winter northbound rates.",
      whenSkip: "Fantasy Fest if you did not come for it, Christmas–New Year’s, and peak spring-break weeks.",
      whenNote: "Hurricane season is a weather line. EYW air is a premium — midweek, or drive from Miami as a priced day, not a surprise.",
      aroundTitle: "Walk. The Conch Train is a souvenir.",
      around: "Walk Old Town. A rental car is a parking fee.",
      aroundBullets: [
        "Old Town is the product. Bike or walk. Duval is a street, not a hotel strategy.",
        "EYW is tiny and expensive air. Drive-down from Miami is a day you should price as a day.",
        "Stock Island lodging only if you like the commute. Most people should not."
      ],
      budgetNote: "Key West rooms punch above a mainland Florida beach. Trip Plan uses a 12.5% lodging-tax assumption and the same guesthouse / Gardens / Casa Marina examples as this guide.",
      tips: [
        "Cuban Coffee Queen or a ventanita breakfast. Mallory Square menus are a tax.",
        "Sunset from the sidewalk. Skip a paid pier ticket on Budget — the sun does the same work.",
        "El Siboney or Garbo’s for Budget dinner. Blue Heaven early if you have room in the budget for the wait.",
        "Stay Old Town. A cheap Stock Island room plus a nightly cab is not Budget.",
        "Fort Zach beach + fort is the cheap outdoor ticket. Parasail only if you're spending more.",
        "Dry Tortugas is a full ferry day — only if you have room in the budget. Do not stack Tortugas, a sunset sail, and a seaplane in three nights.",
        "EYW air is a premium. Midweek, or drive from Miami as a priced day, not a surprise.",
        "Key lime pie once. Happy-hour conch fritters are a snack, not dinner."
      ],
      related: [
        { href: "/guides/miami", label: "Miami money guide" },
        { href: "/guides/cruise", label: "Caribbean cruise money guide" }
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
