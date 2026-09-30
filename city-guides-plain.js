/* Plain-English rewrite for the 17 guides that are not Disney, New York, or Paris.
   Loaded after city-guides-pilot.js. Rates are the public-page ranges already
   used in this repo, not a field visit and not a live quote.
*/
(function (global) {
  "use strict";

  var pack = global.VM_CITY_GUIDES;
  if (!pack || !pack.BY_ID) throw new Error("plain overlay needs guides");

  function tiers(budget, mid, lux) { return { budget: budget, mid: mid, lux: lux }; }
  function line(item, cost, note) { return { item: item, cost: cost, note: note }; }
  function money(room, food, ticket, sample) {
    return [
      { dt: "Mid-range room", dd: room },
      { dt: "Food / person / day", dd: food },
      { dt: "#1 ticket", dd: ticket },
      { dt: "Sample total", dd: sample }
    ];
  }
  function skip(name, why) { return { name: name, why: why }; }
  function zone(name, note) { return { name: name, note: note }; }
  function day(title, bullets) { return { title: title, bullets: bullets }; }

  var PLAIN = {
    anaheim: {
      hook: "Disneyland stays cheaper when the hotel is on Harbor Boulevard and you walk to the parks. The bill jumps when the same week also holds a Santa Monica hotel, a dining plan, and a day at Universal Studios Hollywood.",
      blurb: "Book a hotel on Harbor Boulevard, such as Candy Cane Inn, and walk to the parks. Grocery breakfast. One park a day. Leave Universal for a Los Angeles trip.",
      nights: "2–3 nights, one park on the ticket you hold",
      midrange: "Pixar Place or Hilton Anaheim, grocery breakfast, one table",
      months: "Mid-January through early March, and late April after Easter. A holiday week is a different rate for the same room.",
      startHere: "Book a hotel on Harbor Boulevard you can walk from, such as Candy Cane Inn or the Hampton Inn by the convention center. Buy Disneyland one day and California Adventure the next, and shop at Albertsons or Target the night you land. Leave Universal Studios Hollywood for a Los Angeles trip.",
      tipsKicker: "Harbor is a walk. Santa Monica is a different trip.",
      cta: "Build the Anaheim Trip Plan from a Harbor Boulevard hotel. Add one park a day before you add a dining plan.",
      forWho: [
        "Families who will walk or take the short resort shuttle and spend a whole day in one park"
      ],
      notFor: [
        "A long weekend that also tries to hold Santa Monica and Universal Studios Hollywood",
        "Anyone who wants a car to the gate every morning and still calls the hotel the cheap part"
      ],
      aroundKind: "fork",
      aroundRule: "From a Harbor Boulevard hotel you do not need a car to reach Disneyland or California Adventure. You walk, or you ride the short Anaheim resort shuttle. A hotel in Santa Monica is about 90 minutes each way, and that drive can cost as much as a park ticket.",
      aroundNoCar: [
        "Walk from Candy Cane Inn or a similar Harbor hotel to the parks. The resort shuttle is the backup when the hotel is a few blocks off the walk",
        "Downtown Disney is outside the gates. You can eat there without a park ticket",
        "Grocery at Albertsons or Target the night you land. Hotel breakfast is a different bill"
      ],
      aroundCar: [
        "A car helps only for a grocery run, then it sits at the hotel. Park parking is a separate charge",
        "Driving from Santa Monica each morning spends the money you saved on a cheaper Westside room",
        "Universal Studios Hollywood is a Los Angeles day, with its own ticket, not a Harbor evening"
      ],
      stayRule: "Pay for a walk to the esplanade, not for a theme. Harbor hotels and Pixar Place earn the rate when both park days start on foot. A Grand Californian room earns it only when California Adventure is the morning you want next door.",
      eatRule: "Grocery breakfast is about $8–15 a person. A mobile-order lunch in the park is about $14–18. One table is $35 and up, plus tip. A dining plan prices meals you will not order.",
      doRule: "A 1-day, 1-park ticket is about $104 on the cheapest days and above $200 on the busiest, before California sales tax. The mid-season figure used here is about $130. Park Hopper is a separate add-on.",
      zones: [
        zone("Harbor Boulevard", "Book Candy Cane Inn, or a similar hotel on Harbor Boulevard. Rooms are about $180–280 a night before Anaheim's 17% lodging tax. You walk, or take a short shuttle, to both parks. Do not choose this if you wanted a room inside the Disneyland campus. That is a higher rate."),
        zone("Pixar Place Hotel", "Book Pixar Place Hotel, beside Downtown Disney. Rooms are about $300–450 a night before the 17% lodging tax. You can eat at Downtown Disney without a park ticket. Do not choose it when a Harbor walk at $180–280 still reaches the same gates."),
        zone("Hilton Anaheim", "Book the Hilton Anaheim, by the convention center. Rooms are about $250–380 a night before the 17% lodging tax, with a shuttle to the parks. You are in Anaheim, not Los Angeles. Do not choose it if you wanted to walk out the door onto Harbor."),
        zone("Disneyland Hotel", "Book the Disneyland Hotel or Disney's Grand Californian when the room should be on Disney property. Disneyland Hotel rooms are about $450–700 a night. Grand Californian is about $500–800, and you can walk into California Adventure. Do not add a Santa Monica night on top of either one.")
      ],
      stayTiers: tiers(
        [
          "Candy Cane Inn — A courtyard hotel on Harbor Boulevard, about $180–280 a night before Anaheim's 17% lodging tax. You walk or take a short shuttle to the parks.",
          "Hampton Inn & Suites Anaheim Resort — About $160–260 a night before the same 17% tax, by the convention center. The gate is a shuttle, not a freeway.",
          "Holiday Inn Express Anaheim — About $160–260 a night, and breakfast in the rate is the grocery you do not have to buy. It is still an Anaheim hotel, not a Santa Monica one.",
          "Howard Johnson Anaheim — A garden-court room, about $150–240 a night before tax. Ask for a room off the boulevard if you want it quieter. The parks are still a walk or a shuttle."
        ],
        [
          "Pixar Place Hotel — A walk to Downtown Disney, about $300–450 a night before the 17% lodging tax. You can eat there without holding a park ticket that day.",
          "Hilton Anaheim — The convention-center hotel, about $250–380 a night before tax, with a shuttle to the parks. You are still in Anaheim.",
          "Anaheim Marriott — The same convention area and the same $250–380 band before tax. Book one room. Do not also book a beach hotel for the other nights.",
          "Hyatt House at Anaheim Resort — A kitchen in the $250–360 band before tax, if you will grocery dinner. The kitchen does not move the parks any closer."
        ],
        [
          "Disney's Grand Californian — You can walk into California Adventure. Rooms are about $500–800 a night. That walk is what the rate is for.",
          "Disneyland Hotel — On the Disneyland campus, about $450–700 a night. Do not add a Santa Monica night on top of this rate.",
          "JW Marriott Anaheim — A pool hotel off the Disney property line, about $350–550 a night, then a shuttle. It is not the Grand Californian walk.",
          "The Westin Anaheim — A newer tower in a similar band, about $350–550 a night. You still shuttle or walk. The newer building does not include a park ticket."
        ]
      ),
      eatTiers: tiers(
        [
          "Albertsons or Target — The night you land, put breakfast in the room. A person lands around $8–15. A sit-down hotel breakfast is a different bill.",
          "A mobile-order counter in the park — Lunch about $14–18. Place it before you are hungry. You already paid to be inside the gate.",
          "Downtown Disney quick service — Dinner about $15–25, and you do not need a park ticket to eat here.",
          "A snack you buy on purpose — About $6–8, once. An hourly snack turns a $16 lunch into a $40 food day."
        ],
        [
          "One table in the park — About $35–55 a person before tax and tip. Book it before you fly. Eighteen percent on a $50 check is another $9 a person.",
          "A Harbor Boulevard dinner — About $20–35 a person, back at the hotel neighborhood. Use it when the park day was already expensive.",
          "Hyatt House kitchen night — Groceries for two, about $25–40, if you booked the kitchen. That is a real dinner.",
          "The nights that are not the reservation — Another counter at $15–22. Two tables in three nights is how a $70 person leaves the $55–90 band."
        ],
        [
          "A character breakfast — About $45–75 a person. That is the breakfast or the dinner. It is not a reason to prepay the other meals.",
          "Napa Rose at the Grand Californian — The reservation people book ahead, about $75 and up a person. If it is not booked before you land, assume a counter.",
          "Carthay Circle — A California Adventure table, about $60 and up a person. Keep the other nights at a counter, $15–22.",
          "Club 33 — Not a plan you can count on. Budget a Downtown Disney dinner at $25–40 instead of a membership you do not hold."
        ]
      ),
      doTiers: tiers(
        [
          "Disneyland as one park day — The ticket is the $104 to $200+ band, about $130 in a middle season, before sales tax. No Park Hopper.",
          "California Adventure the next day — A second 1-day ticket in the same $104 to $200 band, about $130 in a middle season. You will not also see both fireworks and still arrive at rope for a second park.",
          "Downtown Disney after dark — $0 to walk in. Dinner there is food, about $15–40 if you sit down, not a third gate.",
          "A pool afternoon — $0 beyond the room at a Harbor hotel. On a three-night trip this is the half day that keeps a third ticket out of the cart."
        ],
        [
          "Park Hopper — A separate add-on on top of the about $130 mid-season ticket. It pays if you leave the first park after lunch. It does not pay as a backup plan on two nights.",
          "Lightning Lane on the Disneyland day — A paid line product, about $20–35 a person. On a quiet January weekday, arriving at opening usually beats it.",
          "One table, already booked — About $35–55 a person. It is not included because you bought a room on Harbor.",
          "The esplanade at night — $0. The walk back to Candy Cane Inn is the plan. A rideshare to Santa Monica is not."
        ],
        [
          "Grand Californian early entry — Included with that hotel, not with Candy Cane Inn. If those extra minutes are why you want the $500–800 room, check the calendar for your dates.",
          "World of Color dining — A table priced for the show, about $60 and up a person. Buy it only if the show is the point of that night.",
          "A peak holiday ticket — Above $200 on the busiest days, before tax. Move the date before you move the hotel.",
          "A second park on the same afternoon — That is a Hopper add-on on the about $130 ticket. On three nights or fewer, two single days cost less confusion and finish more of each park."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at a Harbor hotel, grocery breakfast, counter lunches, one table, and two single-park days. They walk to the parks.",
        lines: [
          line("Room", "$900", "A Harbor hotel at $300 a night, three nights. Inside $250–360, before Anaheim's 17% lodging tax."),
          line("Food", "$420", "$70 a person, two people, three days. Inside $55–90: grocery breakfast, counters, one table."),
          line("Getting there", "$0", "They walk from Harbor. The resort shuttle is about $6 for a day pass only when the hotel is off the walk."),
          line("Tickets", "$520", "Two mid-season days at about $130, two people. Peak dates run toward $200 and above.")
        ],
        day: "A park day is the room ($300) plus food for two ($140) plus two 1-day tickets ($260): about $700 before the 17% lodging tax.",
        tripLabel: "3-night trip",
        trip: "About $1,840 before the 17% lodging tax and flights ($900 lodging + $420 food + $520 in tickets). Lodging plus food is about $1,320, inside the Quick facts sample of $1,100–1,600.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. Lodging tax at 17% is on top of the $900 room."
      },
      days: [
        day("Disneyland, then stop", [
          "Enter at opening and go to one area first. A Lightning Lane, if you buy one, is about $20–35 and should already be in hand.",
          "Mobile-order lunch, about $14–18. Do not add a character meal the same day unless that meal is the reservation.",
          "Walk back to the Harbor hotel. California Adventure the same night is a Hopper you did not buy."
        ]),
        day("California Adventure", [
          "One park, one ticket in the $104 to $200+ band. Pixar Place guests are closest. Harbor guests still walk or shuttle.",
          "One table only if it was booked before the flight, about $35–55 a person. Otherwise a counter at $15–22.",
          "Downtown Disney after the show you came for. The room is in Anaheim."
        ]),
        day("The morning you do not buy a third gate", [
          "A pool morning, or Downtown Disney without a ticket. $0 beyond food.",
          "Grocery breakfast, about $8–15. The flight is easier if you are not coming from a 7 a.m. rope drop.",
          "Universal Studios Hollywood is not this day. It is a Los Angeles ticket, about $100–160, on a different calendar."
        ])
      ],
      book: [
        "The Harbor hotel and the dated tickets together. A 1-day ticket is about $104 to above $200 before sales tax, and the cheaper dates go first.",
        "One table, if you want one, before you fly. Character breakfasts run about $45–75 a person.",
        "Lightning Lane only for the Disneyland day that is a holiday or a Saturday, about $20–35. A quiet weekday does not need it.",
        "Nothing in Santa Monica. That drive is a separate trip."
      ],
      hidden: [
        "Anaheim lodging tax at 17% on the room rate. It is not the Florida 6.5% or 12.5% from a Walt Disney World quote.",
        "California sales tax on tickets and on food you buy in the park.",
        "Park Hopper, if you add it after you already hold two single-day tickets.",
        "A dining plan that prices meals a counter trip will not use.",
        "A Santa Monica hotel plus the drive back to Anaheim each morning."
      ],
      skip: [
        skip("A Santa Monica hotel for Disneyland days", "The drive is about 90 minutes each way. A Harbor room at $180–280 already reaches the parks on foot."),
        skip("Universal Studios Hollywood on this trip", "It is a Los Angeles ticket, about $100–160. It does not share a morning with rope drop at Disneyland."),
        skip("The dining plan by default", "Counters are about $14–18. Buy those, plus one table at $35–55, instead of prepaying every meal.")
      ],
      tips: [
        "Hidden gem: Candy Cane Inn and the other Harbor hotels are a walk or a short shuttle. You do not need a car to reach either park from there.",
        "Hidden gem: Downtown Disney does not require a park ticket. Dinner there, about $15–40, is not a third gate.",
        "Hidden gem: A 1-day ticket is about $104 on the cheapest dates and above $200 on the busiest. Move the date before you move off Harbor to save forty dollars.",
        "Compare a Harbor room after 17% lodging tax with a Pixar Place room after the same 17%. The lower rate is not automatically the lower bill if you then add a car.",
        "Holiday weeks reprice the same Harbor category. If the dates can move to mid-January or late April, check that before you change hotels."
      ],
      money: money(
        "About $250–360 a night before tax for a mid hotel such as the Hilton Anaheim. A Harbor room such as Candy Cane Inn sits nearer $180–280. Pixar Place is about $300–450. Anaheim lodging tax is 17% on top.",
        "About $55–90 with grocery breakfast, a counter lunch, and one table. A character breakfast at $45–75 is the exception, not the daily rate.",
        "A 1-day, 1-park ticket is about $104 on the cheapest days and above $200 on the busiest, before sales tax. The mid-season figure used here is about $130. Park Hopper is separate.",
        "Three mid-range nights run about $1,100–1,600 in lodging plus food for two, before tax, tickets, and flights (orientation)."
      )
    },

    los_angeles: {
      hook: "Los Angeles stays cheaper when you sleep in one neighborhood and eat there. The bill jumps when the hotel is in the Valley, lunch is in Santa Monica, and dinner is a $40 ride back.",
      blurb: "Book one neighborhood: Downtown, Koreatown, or Santa Monica. Eat there. One ticketed day, not Disneyland plus Universal in the same stay.",
      nights: "3–4 nights in one neighborhood",
      midrange: "Ace Hotel Downtown, a market lunch, one dinner",
      months: "Late January through March, and May before Memorial Day. A holiday weekend is a different rate in the same building.",
      startHere: "Book one neighborhood and stay there: Ace Hotel or the Hampton Inn in Downtown, a Koreatown hotel, or Shore Hotel if the beach is the week. Eat breakfast in that neighborhood, at Porto's or a bakery. Buy Universal Studios Hollywood only if that is the ticketed day, and leave Disneyland on an Anaheim calendar.",
      tipsKicker: "One neighborhood. The rideshares are the second hotel.",
      cta: "Build the Los Angeles Trip Plan from the neighborhood you will actually sleep in. Add one ticket before you add a second hotel.",
      forWho: [
        "People who will pick Downtown, Koreatown, or the beach and eat within a walk or a short train ride"
      ],
      notFor: [
        "A week that tries to hold Santa Monica, Downtown, and Disneyland in the same hotel bill",
        "Anyone who wants a car in the city every day and still calls parking a small extra"
      ],
      aroundKind: "fork",
      aroundRule: "Inside the neighborhood you booked, you can walk, take the Metro, or use the TAP transit card. A rental makes sense for a Getty morning or a beach that is not the one you slept in. Hotel parking is about $40–60 a night. Los Angeles lodging tax is about 15.5%.",
      aroundNoCar: [
        "From Ace Hotel Downtown or the Hampton Inn Downtown, walk to Grand Central Market and ride the Metro. A TAP day cap is $5",
        "The Getty Center is free to enter with a timed reservation. Parking there is $25, or $15 after 3 p.m., if you did not take a bus",
        "Santa Monica and Venice are a beach day only if you slept there, or if you accept one train ride. They are not a second hotel"
      ],
      aroundCar: [
        "One grocery or Getty run, then the car should not become the way you cross town for every meal",
        "Hotel parking at $40–60 a night is on top of the rental. Three nights is $120–180 before gas",
        "Disneyland is Anaheim. The drive does not turn a Downtown rate into a park hotel"
      ],
      stayRule: "Pay for the neighborhood you will eat in. A Downtown room at $270–380 before tax is the mid plan. A Santa Monica or West Hollywood luxury room is a different address, not a better train.",
      eatRule: "Breakfast is a bakery in the neighborhood, about $8–15. Lunch at Grand Central Market is about $12–20. One dinner is $40–70 a person. Three $28 salads in a different neighborhood are the rideshare habit.",
      doRule: "The Getty Center is free with a reservation. Universal Studios Hollywood is about $100–160. Griffith Observatory is free. Disneyland is not a Los Angeles ticket.",
      zones: [
        zone("Downtown, near Grand Central Market", "Book Ace Hotel Downtown or the Hampton Inn Downtown. Mid rooms at Ace are about $270–380 a night before the 15.5% lodging tax. The Hampton is about $180–260. You can walk to Grand Central Market and the Metro. Do not choose Downtown if every morning is the beach. That is a train or a $40 ride."),
        zone("Koreatown", "Book a Koreatown hotel such as The Line, and eat dinner there. Budget and mid rooms in this part of town sit about $170–280 a night before tax. Late food is the reason. Do not choose it and then rideshare to Santa Monica for every meal."),
        zone("Santa Monica beach", "Book Shore Hotel or a similar hotel you can walk from to the sand, about $270–380 a night before tax if you are in the mid band. The Expo Line is the train back toward Downtown. Do not choose the beach and also book a Downtown luxury hotel for the other nights."),
        zone("West Hollywood, a splurge night", "Book 1 Hotel West Hollywood only when that address is the trip, about $500–800 a night. You will still take a car or a ride to dinner. Do not choose it as a base for Universal in the morning and the beach at night.")
      ],
      stayTiers: tiers(
        [
          "Hampton Inn & Suites Los Angeles Downtown — About $180–260 a night before Los Angeles lodging tax of about 15.5%. Grand Central Market and the Metro are a walk.",
          "Moxy Downtown Los Angeles — A smaller room, about $170–250 a night before tax, with the Arts District in walking distance.",
          "Freehand Downtown — A small or shared room when the party splits the rate, about $40–90 a bed. It is Downtown, not a Santa Monica tower.",
          "Courtyard Los Angeles L.A. LIVE — About $200–280 a night before tax, near a Metro station. You are paying for that station, not for a beach view."
        ],
        [
          "Ace Hotel Downtown — About $270–380 a night before the 15.5% lodging tax. You can walk to Grand Central Market. If dinner is in Santa Monica, the rideshares erase the neighborhood.",
          "Hyatt Regency Los Angeles Downtown — The same $270–380 band, at L.A. LIVE, with the Metro nearby. One room. Not a second hotel at the beach.",
          "The Westin Bonaventure — On Figueroa, about $250–360 a night before tax. Useful if your days start Downtown. A poor fit if every dinner is on the sand.",
          "Hilton Checkers Los Angeles — A smaller Downtown room, about $240–340 a night before tax, still on a Metro line."
        ],
        [
          "JW Marriott Los Angeles L.A. LIVE — The Downtown splurge, about $400–650 a night. The subway is still the cheap way across town.",
          "Conrad Los Angeles — About $450–700 a night. You bought a Downtown flagship, not a beach week.",
          "The Ritz-Carlton Los Angeles — In the L.A. LIVE tower, about $500–800 a night. The neighborhood is still Downtown.",
          "1 Hotel West Hollywood — A different part of the city, about $500–800 a night. Do not also book a Santa Monica night in the same short week."
        ]
      ),
      eatTiers: tiers(
        [
          "Porto's or a neighborhood bakery — Breakfast about $8–15. Eat it where you slept. A hotel dining room is a separate choice.",
          "Grand Central Market — Lunch about $12–20, if you slept Downtown. It is not a reason to cross the city.",
          "A taco truck or a Koreatown counter — About $10–18 a person. This is lunch or a cheap dinner.",
          "Mariscos Jalisco — A specific taco stop, about $12–20. One visit, not a food tour of three neighborhoods."
        ],
        [
          "Langer's — A deli lunch, about $20–30. Closer to a Downtown day than a hotel restaurant.",
          "Republique counter — Breakfast or lunch about $20–35 a person, once. The dining room is a different check.",
          "Koreatown barbecue — Park's or a similar table, about $30–50 a person, if you slept in Koreatown or will take one train. A bottle pushes the day out of $50–80.",
          "Bestia — One Downtown reservation, about $50–80 a person before wine. Book it before you fly, or eat at the market."
        ],
        [
          "Providence — A tasting menu, about $200 a person. One reservation. The next morning is a bakery.",
          "n/naka — The same idea, a booked dinner, about $200 and up. It is not a walk-in after the Getty.",
          "Gjusta — A Venice breakfast, about $20–35, only if you are already at the beach. Do not rideshare there for toast.",
          "A hotel restaurant at the splurge address — Easy to pass $40 a person at breakfast. That is a week of bakery breakfasts."
        ]
      ),
      doTiers: tiers(
        [
          "The Getty Center — $0 to enter with a timed reservation. Parking is $25, or $15 after 3 p.m. The building is the day.",
          "Griffith Observatory — $0. The view of the Hollywood sign is from the terrace, not from a tour van.",
          "The Broad — $0 timed entry when you get it. A Downtown evening, not a second Universal ticket.",
          "The beach in the neighborhood you booked — $0. Venice and Santa Monica are a walk only if you slept there."
        ],
        [
          "Universal Studios Hollywood — About $100–160. Advance prices sit near $100. The gate is about $159. This or the Getty, not both plus Disneyland.",
          "A Metro day — TAP caps around $5. Two people on two capped days is about $20. A rental adds hotel parking of $40–60 a night.",
          "Huntington Library or the Getty Villa — A different campus from the Getty Center. Budget that ticket, or the Getty's $25 parking, not both museums after Universal.",
          "One neighborhood after dark — $0 beyond dinner. A second neighborhood is a $25–50 ride."
        ],
        [
          "Universal Express — A paid line product on top of the $100–160 ticket. Buy it only if that day is the reason you came.",
          "A studio tour beyond the park ticket — A separate charge on top of Universal at about $109. It does not include a Disneyland ticket.",
          "Disneyland — Not this hotel bill. It is an Anaheim trip, with Harbor rooms at $180–280 and its own ticket.",
          "Hotel parking for three nights — About $40–60 a night, $120–180, before the rental. The Metro under Downtown was about $5 a day."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at Ace Hotel Downtown. Neighborhood meals, the TAP card instead of a rental, and one Universal day. The Getty, if they go, is free timed entry.",
        lines: [
          line("Room", "$960", "Ace Hotel Downtown at $320 a night, three nights. Inside $270–380, before about 15.5% lodging tax."),
          line("Food", "$390", "$65 a person, two people, three days. Inside $50–80: a bakery, the market, one dinner."),
          line("Transit", "$20", "TAP day cap is $5. Two capped days for two people is about $20. A rental would add hotel parking of $40–60 a night."),
          line("Universal", "$218", "One advance day at about $109, two people. Inside $100–160. Getty entry on another day is $0.")
        ],
        day: "The Universal day is the room ($320) plus food for two ($130) plus TAP (about $10) plus two advance tickets ($218): about $680 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,590 before lodging tax and flights ($960 room + $390 food + $20 transit + $218 tickets). Lodging plus food is about $1,350, inside the Quick facts sample of $1,100–1,600.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. Hotel parking is not in this total."
      },
      days: [
        day("Downtown on foot", [
          "Breakfast at a bakery, about $8–15. Walk to Grand Central Market for lunch, about $12–20.",
          "The Broad if you have a timed free ticket, or the Arts District. $0 is a finished afternoon.",
          "Dinner in Downtown, not a Santa Monica reservation that needs a $40 ride."
        ]),
        day("One ticket, or the Getty", [
          "Universal Studios Hollywood, about $100–160, or the Getty Center at $0 plus parking if you drive.",
          "One lunch near that place. The other meal is the market or a taco at $10–18.",
          "Back to the hotel neighborhood. Disneyland is not the evening."
        ]),
        day("The neighborhood you already paid for", [
          "If you slept in Santa Monica, the beach is the day, $0. If you slept Downtown, do not relocate for it.",
          "One dinner you booked, or the market again. A tasting menu at $200 is a different trip.",
          "Metro or a walk. Three hotel-parking nights at $40–60 are a second room rate."
        ])
      ],
      book: [
        "The hotel in one neighborhood, after 15.5% lodging tax and after you have asked about parking. Parking at $40–60 a night is $120–180 on this example.",
        "Universal Studios Hollywood if that is the paid day, about $100–160. Advance prices are the lower end.",
        "The Getty Center timed reservation if you want the free entry. Parking is $25, or $15 after 3 p.m.",
        "Bestia or a Koreatown table only if you will actually be in that neighborhood that night."
      ],
      hidden: [
        "Los Angeles lodging tax at about 15.5% on the room.",
        "Hotel parking at about $40–60 a night if you rent a car.",
        "Rideshares that repeat a Metro trip, often $25–50.",
        "A Universal gate price near $159 if you did not buy ahead, against an advance price near $100.",
        "A second neighborhood's hotel for the nights you have a dinner there."
      ],
      skip: [
        skip("Disneyland on a Los Angeles hotel bill", "It is an Anaheim trip. Harbor hotels are about $180–280 and a walk to those parks."),
        skip("A different neighborhood every night", "Three $40 rides a day erase a $180 Downtown room. Sleep where you eat."),
        skip("Universal plus the Getty plus the beach in one day", "Universal is about $100–160. The Getty is a half day. The beach is the neighborhood you booked, or it is a third commute.")
      ],
      tips: [
        "Hidden gem: The Getty Center is free if you reserve a time. Parking is $25, or $15 after 3 p.m. The building does not need a studio tour on the same day.",
        "Hidden gem: TAP, the transit card, caps a day around $5. Two people on two of those days is about $20. Hotel parking is $40–60 a night.",
        "Hidden gem: Grand Central Market is a Downtown lunch, about $12–20, not a reason to cross the city. Eat it if you slept nearby.",
        "Ask about parking before you compare a Downtown rate with a Santa Monica rate. The 15.5% tax hits both. The garage might hit only the one with a car.",
        "A Saturday in the building you want is not the Tuesday rate. If the dates can move into late January or May, check that before you change neighborhoods."
      ],
      money: money(
        "About $270–380 a night before tax in Downtown, Koreatown, or Santa Monica. Shoulder weeks sit nearer $270–340. Peak weeks can run toward $430. Lodging tax is about 15.5% on top.",
        "About $50–80 if you eat in the neighborhood: a bakery, a market lunch, one dinner. A $40 ride to a different neighborhood is not in that band.",
        "Universal Studios Hollywood is about $100–160. Advance prices sit near $100. The Getty Center is free with a reservation. Parking there is $25, or $15 after 3 p.m.",
        "Three mid-range nights run about $1,100–1,600 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    vegas: {
      hook: "A Tuesday rate in Las Vegas looks cheap until the resort fee, a Saturday night, and one steakhouse dinner sit on the same bill. The fountains in front of Bellagio do not have a ticket.",
      blurb: "Arrive midweek. Book Park MGM, New York-New York, or a downtown hotel such as Circa. Add the resort fee, about $35–55 a night, before you call the room cheap.",
      nights: "2–3 midweek nights",
      midrange: "Park MGM, a food hall, one show",
      months: "Midweek in January and February, and early December after the holiday parties. Saturday is a different rate in the same tower.",
      startHere: "Arrive Tuesday and leave before Saturday. Book Park MGM, New York-New York, or Circa downtown. Add the resort fee, about $35–55 a night, before you tell anyone the room was cheap. Walk to the Bellagio fountains. They are free.",
      tipsKicker: "The resort fee is not the tax, and Saturday is not Tuesday.",
      cta: "Build the Las Vegas Trip Plan on midweek dates. Put the resort fee in the room before you add a show.",
      forWho: [
        "People who will walk the Strip or Fremont and treat one show as the paid night"
      ],
      notFor: [
        "A Saturday arrival that still expects the Tuesday rate",
        "Anyone who wants a car in the hotel garage and a steakhouse every night"
      ],
      aroundKind: "fork",
      aroundRule: "From Park MGM, New York-New York, or the Horseshoe you can walk to the fountains. The Strip bus, called the Deuce, is about $8 a ride if you need it. A rental is for Red Rock, not for moving three blocks on the Strip. Lodging tax is 13.5% on the room. The resort fee is a separate charge, about $35–55 a night.",
      aroundNoCar: [
        "Walk the center Strip from Park MGM to the fountains. That walk is the plan",
        "The Deuce bus is about $8 if the walk is too far. One day for two people is about $16",
        "Fremont Street, at Circa or Ellis Island, is a different neighborhood. One rideshare reaches the Strip. A rental does not make that hop cheaper"
      ],
      aroundCar: [
        "Red Rock is the day that justifies a car. The Strip itself does not",
        "A garage on the Strip is easy to treat as included. Ask the nightly price before you compare a downtown room",
        "Saturday night plus a car plus a steakhouse is three extras on a rate that was cheap on Tuesday"
      ],
      stayRule: "Compare rooms after the resort fee, about $35–55 a night, and after 13.5% lodging tax. A $120 midweek room and a $90 room are not the same bill if only one quote showed the fee.",
      eatRule: "A food hall meal is about $15–25. Chinatown or a downtown dinner is about $20–40 a person. A Strip steakhouse is $100 and up. Free drinks are not a meal.",
      doRule: "The Bellagio fountains and the conservatory are free. Mystère often starts near $70. O is often $100 and up. A nightclub table is a separate purchase.",
      zones: [
        zone("Center Strip, Park MGM", "Book Park MGM, New York-New York, or the Horseshoe. Midweek rooms are about $120–280 a night before 13.5% tax and before the resort fee of about $35–55. You can walk to the fountains. Do not choose the Strip if you wanted a quiet downtown pool and will rideshare back every night."),
        zone("Fremont Street", "Book Circa or Ellis Island. Midweek rooms are about $60–200 a night before the fee and before 13.5% tax. Fremont is outside the door. Do not choose downtown and then pay for a Strip steakhouse every night. The rideshares spend the discount."),
        zone("South Strip, Hampton Inn", "Book the Hampton Inn Tropicana if you want a simpler hotel at the south end, about $90–160 a night before the fee. One bus ride or one rideshare reaches the fountains. Do not choose it if you will not walk or ride and expect the room to include the center Strip."),
        zone("Bellagio, when the room is the treat", "Book Bellagio when you want the fountain block, about $250–500 a night before the resort fee. The fountains themselves are free from the sidewalk. Do not choose Bellagio on a Saturday of a convention week and expect the Tuesday rate.")
      ],
      stayTiers: tiers(
        [
          "Ellis Island — A downtown-adjacent room, about $60–120 a night before the resort fee and before 13.5% lodging tax. You are walking to Fremont, not buying a Strip view.",
          "The LINQ or Flamingo — A center-Strip bed, about $80–180 midweek before a resort fee of about $35–55. It is a room, not a suite.",
          "Hampton Inn Tropicana — South Strip, about $90–160 a night before the fee. One bus or one rideshare reaches the fountains.",
          "Circa — Downtown, about $100–200 midweek before the fee. Fremont is outside the door. Saturday is a different rate."
        ],
        [
          "Park MGM — A center-Strip hotel without casino smoke on the room floors, about $150–280 midweek before a resort fee of about $35–55 and before 13.5% tax. You can walk to the fountains.",
          "New York-New York — A center-Strip walk, about $120–250 a night before the same fee. The roller coaster is not included.",
          "Horseshoe — Center Strip, about $100–220 midweek before the fee. Saturday is a different rate in the same building.",
          "The Venetian or Palazzo — A larger campus, about $180–320 a night before the fee. You still walk. The size is not a closer fountain."
        ],
        [
          "Bellagio — Next to the fountains, about $250–500 a night before a resort fee. The fountains are free from the sidewalk.",
          "Waldorf Astoria Las Vegas — Center Strip, about $300–600 a night, and the resort fee still exists.",
          "Wynn or Encore — North Strip, about $300–700 a night. You will still walk or take the tram. The room does not include a show.",
          "Four Seasons Hotel Las Vegas — On the Mandalay Bay campus, about $350–700 a night. Quieter, and still Las Vegas, not a different city."
        ]
      ),
      eatTiers: tiers(
        [
          "A Strip food hall — Lunch about $15–25 at Park MGM or a similar hall. This is the meal. A steakhouse is not lunch.",
          "Ellis Island cafe — Breakfast or a plate, about $10–18, if you slept downtown. Closer than a casino buffet.",
          "Chinatown — Dinner about $15–30 a person, off the Strip. One rideshare is the cost of leaving the casino carpet.",
          "Tacos El Gordo — A late plate, about $10–15. It beats a $40 burger you did not mean to buy in the casino."
        ],
        [
          "Mon Ami Gabi — A sidewalk table at Paris Las Vegas, about $30–50 a person before wine. One sit-down, not every night.",
          "A downtown dinner — About $20–40 a person near Fremont. Use it if you slept at Circa.",
          "The food hall at dinner — About $20–30, on a night you do not hold a reservation. Still inside $40–75.",
          "One off-Strip plate — About $20–35. Three casino restaurants in one day leave the band."
        ],
        [
          "A Bellagio steakhouse or Picasso — Often $100 and up a person, and only if the table exists before you fly. One night.",
          "O by Cirque du Soleil — Often $100 and up a seat. That is the splurge. It does not require a steak the same night.",
          "A $40 buffet — Skip it unless the buffet is the reason you came. A food-hall breakfast is about $15.",
          "A nightclub table — A separate minimum, often hundreds of dollars. It is not included in a $200 room."
        ]
      ),
      doTiers: tiers(
        [
          "Bellagio fountains — $0. Stand on the sidewalk. You do not need a Bellagio room to see them.",
          "The Bellagio conservatory — $0. A walk-through, not a ticket.",
          "Fremont Street at night — $0 beyond whatever you drink. If you slept downtown, this is the evening.",
          "The center Strip on foot — $0. The Deuce bus is about $8 if you need it once."
        ],
        [
          "Mystère — Often starts near $70 a seat. One show. O is the more expensive Cirque, often $100 and up.",
          "A daytime pool at your hotel — Usually included with the resort fee you are already paying, about $35–55. A cabana is extra.",
          "The Deuce for one day — About $8 a person. Two people, one day, about $16.",
          "A downtown afternoon if you slept on the Strip — One rideshare. The Deuce bus is about $8. A rental is not for three blocks."
        ],
        [
          "O or a reserved Cirque seat — Often $100 and up. Buy it at home if the show is why you came.",
          "A Grand Canyon day — A paid tour, often $200 and up a person. It replaces the Strip, it does not follow a noon show.",
          "Red Rock with a car — The scenic loop is the reason to rent. The Strip walk is $0.",
          "Saturday in the tower you wanted on Tuesday — A different rate. Check the date before you change hotels to save $40."
        ]
      ),
      walk: {
        lead: "Two adults, three midweek nights at Park MGM. One food-hall pattern, one off-Strip dinner, the fountains on foot, and one Mystère seat each.",
        lines: [
          line("Room", "$690", "Park MGM at $230 a night, three midweek nights. Inside $190–280, before 13.5% tax and before the resort fee."),
          line("Resort fee", "$135", "About $45 a night for three nights. The fee is not the 13.5% tax."),
          line("Food", "$330", "$55 a person, two people, three days. Inside $40–75."),
          line("Show and bus", "$196", "Mystère at about $90 times two is $180. The Deuce, one day for two people, is about $16. The fountains are $0.")
        ],
        day: "A walking day is the room ($230) plus the resort fee ($45) plus food for two ($110): about $385. The show night adds about $180.",
        tripLabel: "3-night trip",
        trip: "About $1,350 before lodging tax and flights ($690 room + $135 fees + $330 food + $180 show + $16 bus). Room, fee, and food are about $1,155, inside the Quick facts sample of $900–1,450.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. A Saturday night is not this rate."
      },
      days: [
        day("The fountains, on foot", [
          "Walk from Park MGM to the Bellagio fountains. $0.",
          "Food hall lunch, about $15–25. Not a steakhouse.",
          "Dinner off the casino floor, in Chinatown or downtown, about $15–40 a person."
        ]),
        day("One show", [
          "Mystère, often near $70 and up, or O if you already hold seats nearer $100.",
          "The other meals that day stay in the food hall, about $15–25.",
          "No nightclub table. The show was the paid night."
        ]),
        day("Leave before the Saturday rate", [
          "A last walk or the pool that the resort fee already covers, about $35–55 a night.",
          "Breakfast at a cafe, about $10–18. The $40 buffet is optional.",
          "The flight is the plan. Saturday night in the same tower is a different price."
        ])
      ],
      book: [
        "The hotel on Tuesday-to-Friday dates, after the resort fee of about $35–55 a night is on the quote, and after 13.5% tax.",
        "One show, Mystère near $70 or O nearer $100 and up, if the show is why you came.",
        "Nothing for the fountains. They are free.",
        "A car only if Red Rock is a real day. The Strip does not need one."
      ],
      hidden: [
        "Lodging tax at 13.5% on the room rate.",
        "A resort fee of about $35–55 a night. It is not the tax.",
        "Saturday and convention dates, which reprice the tower you priced on Tuesday.",
        "A Strip steakhouse at $100 and up after you already paid for a show.",
        "A garage or a rental for a trip that is three walkable blocks."
      ],
      skip: [
        skip("A Saturday stay priced off a Tuesday screenshot", "The same tower is a different rate. The resort fee, about $35–55, is still there."),
        skip("Three observation-style shows", "One Cirque seat is the night. Mystère starts near $70. A second and third show is a different budget."),
        skip("A steakhouse every night", "A food hall is about $15–25. One sit-down at $30–50 is the mid dinner. A $100 steak is the splurge, once.")
      ],
      tips: [
        "Hidden gem: The Bellagio fountains and the conservatory do not have tickets. A Bellagio room, about $250–500 before the fee, is optional.",
        "Hidden gem: The resort fee is about $35–55 a night on top of 13.5% lodging tax. Put both on the quote before you compare Park MGM with a downtown room.",
        "Hidden gem: Chinatown is one ride off the Strip and a dinner about $15–30 a person. Three casino meals cost more and stay indoors.",
        "The Deuce bus is about $8. Walking the center Strip is $0. A rental for that walk is the expensive version.",
        "If the dates can move off Saturday, do that before you change hotels to save forty dollars."
      ],
      money: money(
        "About $190–280 a night before tax and before the resort fee, at a center-Strip hotel such as Park MGM or downtown at Circa. The resort fee is about $35–55 a night. Lodging tax is 13.5% on the room.",
        "About $40–75 off the casino floor: a food hall plus one Chinatown or downtown dinner. A Strip steakhouse is the exception.",
        "The Bellagio fountains are free. Mystère often starts near $70. O is often $100 and up. The resort fee is about $35–55 a night and is not a show ticket.",
        "Three midweek nights run about $900–1,450 in room, resort fee, and food for two, before shows and tax (orientation)."
      )
    },

    miami: {
      hook: "Miami Beach stays cheaper a few blocks off Ocean Drive, or in Brickell if you want restaurants you can walk to. Ocean Drive menus and a beach-club daybed are how a $250 room becomes a different trip.",
      blurb: "Book The Gale or a Collins hotel a few blocks off the sand, or Kimpton EPIC in Brickell. Cuban coffee in the morning. One neighborhood dinner. The beach is free.",
      nights: "3–4 nights on the sand or in Brickell",
      midrange: "Hyatt Centric or The Gale, Cuban coffee, one dinner",
      months: "Early December, late April after spring break, and May. Spring-break weeks are a different rate.",
      startHere: "Book The Gale, the Hampton Inn Miami Beach, or Hyatt Centric on Collins, a few blocks off Ocean Drive. If you want mainland restaurants, book Kimpton EPIC or the Courtyard in Brickell. Breakfast is a Cuban coffee window, not an Ocean Drive table. The sand is free. Vizcaya is the one ticket, about $25.",
      tipsKicker: "Ocean Drive is a view. It is not the meal plan.",
      cta: "Build the Miami Trip Plan from Collins or from Brickell, not from two hotels. Add Vizcaya only if you want the one ticket.",
      forWho: [
        "People who will stay on South Beach or in Brickell and eat in that neighborhood"
      ],
      notFor: [
        "A week that needs a rental to the beach, Wynwood, and the Everglades every day",
        "Anyone who wants an Ocean Drive address and a beach-club daybed as the default afternoon"
      ],
      aroundKind: "fork",
      aroundRule: "From a Collins hotel you can walk to the sand. From Brickell or downtown, the Metromover is free. A car helps for a Vizcaya morning or a single beach day if you slept on the mainland. Miami lodging tax is 13%.",
      aroundNoCar: [
        "Walk from The Gale or Hyatt Centric to the beach. Ocean Drive is the scenic block, not the place to eat every meal",
        "The Metromover in downtown and Brickell is free. Use it if you slept at Kimpton EPIC or the Courtyard",
        "Little Havana and Wynwood are one ride for a meal, not a reason to change hotels"
      ],
      aroundCar: [
        "Vizcaya is the errand that can justify a car or a rideshare, about $25 to enter",
        "A rental plus beach parking every day spends a Collins room you could have walked from",
        "The Everglades is a half-day tour, not the way you start a three-night beach trip"
      ],
      stayRule: "Pay for a walk to the sand, or pay for Brickell restaurants. A Collins room a few blocks off Ocean Drive, about $250–360 before 13% tax, is the mid plan. An Ocean Drive address is a higher rate for the same sand.",
      eatRule: "A Cuban coffee and toast is about $5–10. Lunch is about $12–20. One dinner is $40–70 a person. An Ocean Drive main course is the expensive version of a meal you can eat a few blocks inland.",
      doRule: "The beach is free. Vizcaya is about $25. A beach-club daybed often starts with a minimum around $75–150 a person. That minimum is the purchase.",
      zones: [
        zone("Collins Avenue, off Ocean Drive", "Book The Gale or Hyatt Centric South Beach. The Gale is about $180–280 a night before Miami's 13% lodging tax. Hyatt Centric is about $250–360. You can walk to the sand. Do not choose an Ocean Drive address for the same beach at a higher rate."),
        zone("Hampton Inn Miami Beach", "Book the Hampton Inn Miami Beach, about $160–260 a night before the 13% tax. The sand is a walk or a short bus. Do not choose it if you wanted Brickell restaurants outside the door. That is a different hotel."),
        zone("Brickell", "Book Kimpton EPIC or the Courtyard downtown, about $180–370 a night before tax. The Metromover is free. You traded the postcard beach for restaurants you can walk to. Do not pay a Brickell rate and then taxi to the sand for every hour of daylight."),
        zone("1 Hotel South Beach", "Book 1 Hotel only when the beach hotel is the treat, about $500–900 a night. A cabana is extra. Do not choose it for a three-night trip that is mostly a Cuban sandwich and a free beach.")
      ],
      stayTiers: tiers(
        [
          "The Gale South Beach — On Collins, a few blocks off Ocean Drive, about $180–280 a night before Miami's 13% lodging tax. The sand is a walk.",
          "Freehand Miami — A smaller or shared room with a walk to the sand, about $40–100 a bed, under a beachfront tower rate.",
          "Hampton Inn Miami Beach — Mid-Beach, about $160–260 a night before tax. The sand is a walk or a short bus.",
          "Courtyard Miami Downtown/Brickell — The Metromover is at the door and free, about $180–280 a night before tax. You traded the postcard for restaurants."
        ],
        [
          "Hyatt Centric South Beach — A Collins walk to the sand, about $250–360 a night before the 13% lodging tax.",
          "The Confidante Miami Beach — A renovated room on Collins, about $250–380 a night, without an Ocean Drive address.",
          "Kimpton EPIC Hotel — On the bay in Brickell, about $250–370 a night. The Metromover does not charge a fare.",
          "Miami Marriott Biscayne Bay — A mainland room, about $220–340 a night. Better food within a walk than Ocean Drive."
        ],
        [
          "1 Hotel South Beach — Beachfront, about $500–900 a night. A cabana is still extra.",
          "The Ritz-Carlton, South Beach — On Collins, about $450–800 a night. The public beach is still free.",
          "The Miami Beach EDITION — Mid-Beach, about $500–900 a night. Quieter than Ocean Drive, and a different ride if your dinner is in Brickell.",
          "Four Seasons Hotel at The Surf Club — In Surfside, about $700–1,200 a night. Quieter than Ocean Drive, and not a walk to Little Havana."
        ]
      ),
      eatTiers: tiers(
        [
          "A Cuban coffee window — Coffee and toast, about $5–10. Versailles in Little Havana is the sit-down version of the same breakfast, not an Ocean Drive table.",
          "A Cuban sandwich — About $10–15. Lunch. It does not need a beach club.",
          "Time Out Market — A food-hall plate, about $15–25, when you want several counters in one stop.",
          "Dinner in Little Havana or Wynwood — About $20–40 a person, one ride from the hotel. Not the hotel restaurant by default."
        ],
        [
          "Joe's Stone Crab — One shared dinner, about $40–70 a person before wine, in season. It is the reservation, not every night.",
          "A Wynwood table — About $30–55 a person. Book it or eat the market. Do not add a beach-club minimum the same afternoon.",
          "A Collins lunch off Ocean Drive — About $15–25. The same kitchen on Ocean Drive is the higher menu.",
          "Brickell dinner if you slept there — About $30–60 a person. A South Beach taxi afterward spends the neighborhood."
        ],
        [
          "A tasting menu — Often $150 and up a person, one night. The next morning is Cuban coffee at $5–10.",
          "Joe's when you did not share — Easy to pass $80 a person. Sharing is the mid version.",
          "A beach-club daybed — Often a minimum of about $75–150 a person. That is the afternoon purchase, not a snack.",
          "A hotel breakfast at 1 Hotel or the EDITION — Easy to pass $30 a person. A coffee window is the other morning."
        ]
      ),
      doTiers: tiers(
        [
          "The beach in front of Collins — $0. You do not need a club wristband.",
          "An Art Deco walk on Ocean Drive in daylight — $0. Look at the buildings. Eat a few blocks inland.",
          "Wynwood Walls from the sidewalk — $0 to look. A bottle-service club is a different purchase.",
          "Little Havana — Coffee about $5–10. The walk is the afternoon."
        ],
        [
          "Vizcaya — About $25 to enter. The one house museum. It does not need a boat the same morning.",
          "The Metromover — $0. Downtown and Brickell. A rideshare that copies it is the expensive version.",
          "A neighborhood boat tour — Often $30–50, only if someone wants the water and will not stand on the beach.",
          "Wynwood plus Little Havana — One ride each, not a rental loop. Eat once, about $20–40."
        ],
        [
          "A beach-club afternoon — The minimum is often $75–150 a person. Buy it if the chair is the point. The sand is $0.",
          "An Everglades airboat — A half-day tour, often $50–80. It replaces a beach morning. It does not fit after Vizcaya and a dinner reservation.",
          "A reserved boat — About $40–70 a person. One water plan, not the club and the boat and Vizcaya.",
          "A cruise departure the same morning you leave the beach hotel — Give it a buffer night in the $250–360 band. The ship is a different schedule."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at The Gale or Hyatt Centric. Cuban coffee, one neighborhood dinner, a walk or the Metromover, and Vizcaya.",
        lines: [
          line("Room", "$900", "A Collins hotel at $300 a night, three nights. Inside $250–360, before Miami's 13% lodging tax."),
          line("Food", "$360", "$60 a person, two people, three days. Inside $45–75."),
          line("Getting around", "$0", "Walking, and the Metromover if they are downtown. This example does not rent a car."),
          line("Vizcaya", "$50", "About $25 times two. The beach is $0.")
        ],
        day: "A beach day with Vizcaya is the room ($300) plus food for two ($120) plus two admissions ($50): about $470 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,310 before lodging tax and flights ($900 room + $360 food + $50 tickets). Lodging plus food is about $1,260, inside the Quick facts sample of $1,000–1,550.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. A beach-club minimum is not in this total."
      },
      days: [
        day("The beach you can walk to", [
          "Coffee at a Cuban window, about $5–10. Walk to the sand. $0.",
          "Lunch a few blocks off Ocean Drive, about $12–20.",
          "Dinner in the neighborhood, about $20–40, or Little Havana if you want the one ride."
        ]),
        day("Vizcaya, then stop", [
          "Vizcaya, about $25. Let it take the middle of the day.",
          "One other meal near the museum or back at the hotel neighborhood.",
          "Wynwood only if you still want to be outside. A beach club is not required."
        ]),
        day("Brickell or the sand, not both as a commute", [
          "If you slept in Brickell, use the free Metromover and eat there, about $30–60 for dinner.",
          "If you slept on Collins, stay on Collins. A mainland dinner is one ride, not a hotel change.",
          "Skip the Everglades unless that half day, often $50–80, replaced something else."
        ])
      ],
      book: [
        "The hotel on Collins or in Brickell, after 13% lodging tax is on the quote.",
        "Vizcaya if you want the house museum, about $25.",
        "Joe's Stone Crab in season, if that shared dinner is the meal, about $40–70 a person.",
        "Nothing for the beach. A club daybed, often $75–150 minimum, is a decision you make on purpose."
      ],
      hidden: [
        "Miami lodging tax at 13% on the room.",
        "A beach-club minimum, often $75–150 a person.",
        "Rideshares between Collins and Brickell that repeat a walk or the free Metromover.",
        "Spring-break weeks, which reprice the same Collins room.",
        "An Ocean Drive menu for a meal you could eat two blocks inland."
      ],
      skip: [
        skip("An Ocean Drive hotel chosen for the neon", "The Gale, a few blocks off, is about $180–280 and the same sand. The Drive is a walk, not a room rate."),
        skip("A beach-club daybed as the default afternoon", "The minimum is often $75–150 a person. The beach is free."),
        skip("Everglades plus Vizcaya plus a boat in three nights", "Pick one paid outing. Vizcaya is about $25. The boat and the airboat are separate half days.")
      ],
      tips: [
        "Hidden gem: The Metromover in downtown and Brickell does not charge a fare. A rideshare that copies it is the expensive version of a free loop.",
        "Hidden gem: Vizcaya is about $25 and is the one house. The beach in front of a Collins hotel is $0.",
        "Hidden gem: A Cuban coffee and toast is about $5–10. An Ocean Drive breakfast is a different check for the same morning.",
        "Compare The Gale after 13% tax with an Ocean Drive quote after the same tax. You are often paying more to sleep on the loud block, not to reach a different beach.",
        "Late April and May are not spring-break rates. If the dates can move, check that before you change neighborhoods."
      ],
      money: money(
        "About $250–360 a night before tax on Collins, off Ocean Drive, or in Brickell. The Gale sits nearer $180–280. Lodging tax is 13% on top.",
        "About $45–75 with Cuban coffee and one neighborhood dinner. An Ocean Drive dinner is the habit that leaves this band.",
        "The beach is free. Vizcaya is about $25. A beach-club daybed often starts around a $75–150 minimum a person.",
        "Three mid-range nights run about $1,000–1,550 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    san_francisco: {
      hook: "San Francisco stays cheaper when the hotel is near a station and breakfast is a bakery. Nob Hill plus a cable-car loop plus a Napa dinner is how a walkable week doubles.",
      blurb: "Book Hotel Emeline or the Hyatt Regency by the Ferry Building, or a downtown hotel near BART. Bakery breakfast. One Alcatraz ferry. You do not need a car in the city.",
      nights: "3–4 nights near one station",
      midrange: "Hotel Emeline or Hyatt Regency, bakery, one dinner",
      months: "Late January and February, and September after Labor Day.",
      startHere: "Book Hotel Emeline by the Ferry Building, the Hyatt Regency on the Embarcadero, or the Hampton Inn downtown near BART. Eat breakfast at a bakery, not in the hotel. Take the Alcatraz day ferry, about $48 a person, or skip it and walk the bridge. Leave the car at home.",
      tipsKicker: "The cable car is an $8 ride, not the transit system.",
      cta: "Build the San Francisco Trip Plan from the Ferry Building or from a BART hotel. Add Alcatraz only if you already hold the timed ferry.",
      forWho: [
        "People who will walk the Embarcadero or take Muni and eat in one neighborhood"
      ],
      notFor: [
        "A trip that needs a car in the city and a Napa dinner the same night",
        "Anyone who wants Fisherman's Wharf as the hotel and the meal plan"
      ],
      aroundKind: "transit",
      aroundRule: "You do not need a car in the city. Clipper, the transit card, pays Muni. A bus ride is about $2.50 to $3. The cable car is a separate $8 fare, a souvenir ride, not the way you get to dinner. Lodging tax is about 16%.",
      aroundNoCar: [
        "Keep one Clipper card. Muni is about $2.50 to $3. A cable car at $8 is optional",
        "The Ferry Building and the Embarcadero are a walk from the Hyatt Regency or Hotel Emeline",
        "Alcatraz is a timed ferry, about $47.95 for the day tour. Book it on the official page. The night tour is $59.65"
      ],
      stayRule: "Pay for a walk to the Ferry Building or to BART. A mid hotel is about $300–380 a night before about 16% tax. A Wharf hotel is the expensive version of a neighborhood you can visit in an hour.",
      eatRule: "A bakery breakfast is about $8–15. A Mission burrito or a Ferry Building lunch is about $12–25. One dinner is $40–80 a person. The Wharf seafood rack is the tourist menu.",
      doRule: "The Golden Gate Bridge walk and Crissy Field are free. Alcatraz day tour is $47.95. SFMOMA and the de Young charge admission, about $25–30. The cable car is $8.",
      zones: [
        zone("Ferry Building and the Embarcadero", "Book the Hyatt Regency on the Embarcadero or Hotel Emeline in Jackson Square. Rooms are about $280–420 a night before the 16% lodging tax. You can walk to the Ferry Building. Do not choose this and then rent a car to move ten blocks."),
        zone("Downtown, near BART", "Book the Hampton Inn downtown or the Courtyard downtown, about $180–300 a night before tax. BART is a walk. Do not choose it if you wanted the Wharf outside the door. Visit the Wharf for an hour, then leave."),
        zone("Hilton on Union Square", "Book the Hilton on Union Square, about $250–400 a night before tax. A cable car is nearby and still costs $8. Do not choose Union Square and also book a Nob Hill suite for the other nights."),
        zone("Nob Hill", "Book the Fairmont when the hill is the treat, about $400–700 a night. The cable car at the door is still $8. Do not choose Nob Hill as a base for a Mission dinner every night.")
      ],
      stayTiers: tiers(
        [
          "Hampton Inn San Francisco Downtown — About $180–280 a night before the 16% lodging tax. BART is a walk. You still do not need a car.",
          "Courtyard San Francisco Downtown — About $200–300 a night before tax, near Union Square. The cable car is an $8 option, not your transit pass.",
          "Hotel Zephyr — A Fisherman's Wharf hotel, about $180–280 a night, only if that waterfront is the whole trip. Eat elsewhere.",
          "The Phoenix Hotel — A smaller Civic Center room, about $150–250 a night. The Mission is a Muni ride, not a garage."
        ],
        [
          "Hotel Emeline — Jackson Square, a walk to the Ferry Building, about $280–400 a night before the 16% lodging tax.",
          "Hyatt Regency San Francisco — On the Embarcadero, about $280–420 a night. The Ferry Building is the morning.",
          "Hilton San Francisco Union Square — About $250–400 a night. The cable car is adjacent and still costs $8.",
          "San Francisco Marriott Marquis — Near the convention center, about $260–400 a night. One room, not a suite."
        ],
        [
          "Fairmont San Francisco — On Nob Hill, about $400–700 a night. The cable car is at the door and still costs $8.",
          "St. Regis San Francisco — In SoMa, about $500–900 a night, a walk to SFMOMA.",
          "Four Seasons Hotel San Francisco — About $550–950 a night. The neighborhood is still SoMa, not a different transit system.",
          "1 Hotel San Francisco — On the waterfront, about $500–900 a night, if the Embarcadero is the address you wanted."
        ]
      ),
      eatTiers: tiers(
        [
          "A Mission bakery, such as Tartine — Breakfast about $8–15. Not the hotel dining room.",
          "A burrito at La Taqueria or El Farolito — About $12–18. Lunch in the Mission.",
          "Ferry Building lunch — A counter, about $15–25, if you slept on the Embarcadero.",
          "Chinatown dinner — About $15–30 a person. One neighborhood, not a Wharf crab stand."
        ],
        [
          "Zuni — One dinner, about $40–70 a person. Book it or eat the burrito.",
          "State Bird Provisions — About $50–80 a person, if you hold the table. It is not a walk-in plan at 8 p.m.",
          "Ferry Building oysters — A mid lunch, about $20–40. Napa is not the dinner plan the same day.",
          "A neighborhood Italian — About $30–50 a person near the hotel. Wine is what leaves the $55–90 band."
        ],
        [
          "Atelier Crenn or Benu — A tasting menu, often $200 and up. One reservation. The next morning is a bakery at $8–15.",
          "A Napa dinner transfer — The tasting plus the ride, about $80 and up. Pack a lunch if you go, and do not add a city tasting the same night.",
          "A hotel breakfast on Nob Hill — Easy to pass $40 a person. The bakery is the other plan.",
          "Wharf seafood at a photo menu — The expensive version of a fish you can eat at the Ferry Building for about $15–25."
        ]
      ),
      doTiers: tiers(
        [
          "The Golden Gate Bridge on foot, or Crissy Field — $0. The walk is the postcard.",
          "The Ferry Building — $0 to walk in. Lunch is food, about $15–25.",
          "Mission murals or Chinatown — $0. A neighborhood afternoon.",
          "Muni — About $2.50 to $3 with Clipper. Skip the cable car unless you want the $8 ride."
        ],
        [
          "Alcatraz day ferry — $47.95 a person on the official fee page. Timed. The night tour is $59.65.",
          "SFMOMA or the de Young — About $25–30. One museum, not both after Alcatraz.",
          "A cable car once — $8. It is a souvenir, not the way you cross the city all week.",
          "The Embarcadero at dusk — $0. A Napa reservation the same evening is a different trip."
        ],
        [
          "Alcatraz plus a second paid museum — Two tickets. Give them different days. Alcatraz alone is already about $48.",
          "A Muir Woods or Napa day — A tour or a car, often $80 and up, and it replaces a city day. Do not stack it with Alcatraz.",
          "Yosemite — Not this hotel week. It is a separate drive and a separate night, not a $300–380 San Francisco room.",
          "A rental in a downtown garage — Often $50 and up a night, for a city you can ride for about $3."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at Hotel Emeline or the Hyatt Regency. Bakery breakfast, one neighborhood dinner, Clipper, one cable-car ride each, and the Alcatraz day ferry.",
        lines: [
          line("Room", "$1,020", "A waterfront or Jackson Square hotel at $340 a night, three nights. Inside $300–380, before about 16% lodging tax."),
          line("Food", "$420", "$70 a person, two people, three days. Inside $55–90."),
          line("Transit", "$36", "Muni about $20 for two over three days, plus one cable-car ride each at $8."),
          line("Alcatraz", "$96", "Day tour at $47.95 times two, about $96. The night tour would be $59.65 each.")
        ],
        day: "The Alcatraz day is the room ($340) plus food for two ($140) plus transit (about $12) plus two ferry tickets ($96): about $590 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,570 before lodging tax and flights ($1,020 room + $420 food + $36 transit + $96 tickets). Lodging plus food is about $1,440, inside the Quick facts sample of $1,250–1,700.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. A Napa day is not in this total."
      },
      days: [
        day("The waterfront", [
          "Bakery breakfast, about $8–15. Walk the Embarcadero to the Ferry Building.",
          "Lunch there, about $15–25. The bridge walk is the afternoon, $0.",
          "Dinner near the hotel, about $30–50. Not a Wharf crab stand."
        ]),
        day("Alcatraz, then stop", [
          "The day ferry, $47.95, at the time on the ticket.",
          "One museum only if you still have attention, about $25–30. Not both SFMOMA and the de Young.",
          "Cable car once if you want the $8 ride. Muni is the way back, about $3."
        ]),
        day("One neighborhood", [
          "The Mission for a burrito, about $12–18, or Chinatown for dinner, about $15–30.",
          "No Napa tonight. A packed lunch is the Napa plan on a different trip.",
          "The hotel is the same one you booked on night one."
        ])
      ],
      book: [
        "The hotel near the Ferry Building or BART, after about 16% lodging tax is on the quote.",
        "Alcatraz on the official ferry page, $47.95 day or $59.65 night, before you look at a bundle.",
        "One dinner, Zuni or State Bird, only if you already want that table.",
        "Nothing for the bridge walk. It is free."
      ],
      hidden: [
        "San Francisco lodging tax at about 16%.",
        "The cable car at $8, if you treat it as ordinary transit.",
        "A downtown garage, often $50 and up a night.",
        "A reseller's Alcatraz bundle above the official $47.95.",
        "A Napa transfer on a night you already hold a city dinner."
      ],
      skip: [
        skip("A Fisherman's Wharf hotel as the meal plan", "Hotel Zephyr is fine if the Wharf is the trip, about $180–280. The seafood rack is still the expensive lunch. Eat at the Ferry Building."),
        skip("The cable car as your transit pass", "It is $8 a ride. Muni is about $2.50 to $3."),
        skip("Alcatraz, Napa, and Yosemite in one short stay", "Alcatraz is about $48 and a half day. Napa and Yosemite are each a different day, and Yosemite is a different night.")
      ],
      tips: [
        "Hidden gem: Alcatraz day tour is $47.95 and the night tour is $59.65 on the official fee page. A bundle is often the same ferry plus a markup.",
        "Hidden gem: The Golden Gate walk and Crissy Field are free. The cable car is $8 and does not make the bridge closer in a useful way.",
        "Hidden gem: The Ferry Building is a walk from the Hyatt Regency, and lunch there is about $15–25. You do not need a car to reach it.",
        "Clipper pays Muni at about $2.50 to $3. Keep one card. A rental downtown adds a garage on top of a city you can ride.",
        "September after Labor Day and late January are not the same rate as a holiday weekend. Move the date before you move to the Wharf to save money."
      ],
      money: money(
        "About $300–380 a night before tax near the Embarcadero, Jackson Square, or downtown by BART. Lodging tax is about 16% on top. A Wharf hotel is a choice, not a requirement.",
        "About $55–90 with a bakery breakfast, a burrito or Ferry Building lunch, and one dinner. The Wharf seafood rack leaves this band.",
        "The Alcatraz day ferry is $47.95. The night tour is $59.65. Muni is about $2.50 to $3. The cable car is $8.",
        "Three mid-range nights run about $1,250–1,700 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    chicago: {
      hook: "Chicago stays cheaper on the L, with a diner breakfast and one neighborhood dinner. A Magnificent Mile hotel plus a hop-on bus plus two museums is the expensive version of the same lakefront.",
      blurb: "Book The Hoxton in Fulton Market or a Loop hotel with the train (the L) downstairs. Diner breakfast. One deep-dish, then a neighborhood dinner. The Art Institute is the one museum.",
      nights: "3 nights near the L",
      midrange: "The Hoxton or a Loop Hilton, one beef, one dinner",
      months: "January through early March, late April, and September.",
      startHere: "Book The Hoxton in Fulton Market, or the Hampton Inn on the Magnificent Mile if you want the train (the L) downstairs at a lower rate. Breakfast is a diner or a doughnut, not the hotel. Buy the Art Institute, about $32, or skip it and walk the river. You do not need a car.",
      tipsKicker: "A 3-day transit pass is $15. The architecture cruise is the other ticket.",
      cta: "Build the Chicago Trip Plan from an L stop. Add the Art Institute or a river cruise, not both by default.",
      forWho: ["People who will ride the L and eat in Fulton Market, the Loop, or one neighborhood"],
      notFor: ["Anyone who wants a car on Michigan Avenue and a steakhouse after every museum"],
      aroundKind: "transit",
      aroundRule: "You do not need a car. Ventra is the transit card. A 1-day pass is $5 and a 3-day pass is $15. A single L ride is $2.50. The ride from O'Hare is $5. Lodging tax is about 17.4%.",
      aroundNoCar: [
        "Buy a 3-day Ventra pass, $15, if you will ride for three days. Two people is $30",
        "The riverwalk and the lakefront are free. An architecture cruise is a separate ticket, about $50–65",
        "Fulton Market, the Loop, and the lake are walks from The Hoxton or a Loop Hilton. A suburb is a different hotel"
      ],
      stayRule: "Pay for an L stop in the Loop, River North, or Fulton Market. Mid rooms are about $190–320 a night before 17.4% tax. A suburban rate looks lower until every dinner is a rideshare.",
      eatRule: "A diner breakfast is about $10–15. An Italian beef is about $12–18. One Fulton Market dinner is $40–70 a person. Deep-dish once, then stop.",
      doRule: "The riverwalk is free. The Art Institute is $32 for adults who do not live in Chicago. An architecture cruise is often $50–65. You do not need both on a three-night trip.",
      zones: [
        zone("The Hoxton, Fulton Market", "Book The Hoxton Chicago. Rooms are about $220–340 a night before Chicago's 17.4% lodging tax. Dinner is a walk. Do not choose it if you wanted a lake view from the room. The lake is a walk or a short L ride, and it is free."),
        zone("The Loop, by the L", "Book the Hampton Inn on the Magnificent Mile or a Loop Hilton. The Hampton is about $140–220 a night before tax. The Hilton is about $190–320. Trains are downstairs. Do not choose a suburban hotel and commute in for this."),
        zone("Courtyard River North", "Book the Courtyard in River North, about $160–250 a night before tax, or the Hyatt Regency by the river, about $200–330. You can walk to the riverwalk. Do not choose it and then rent a car to sit in a Michigan Avenue garage."),
        zone("The Langham, when the room is the treat", "Book The Langham or the Park Hyatt when the hotel is the splurge. The Langham is about $450–750 a night. The river is outside, and it is still free. Do not choose it and also buy a cruise, two museums, and a tasting menu.")
      ],
      stayTiers: tiers(
        [
          "Freehand Chicago — A smaller or shared room near the L, about $40–90 a bed. The transit pass is still $15 for three days.",
          "Hampton Inn Chicago Downtown/Magnificent Mile — About $140–220 a night before the 17.4% lodging tax. Trains are downstairs.",
          "Motto by Hilton Chicago Downtown — A compact room, about $150–230 a night. It is downtown, not a highway hotel.",
          "Courtyard Chicago Downtown/River North — About $160–250 a night before tax, a walk to the L."
        ],
        [
          "The Hoxton Chicago — Fulton Market, about $220–340 a night before the 17.4% lodging tax. The restaurants are why you are here.",
          "Hilton Chicago — By Grant Park, about $190–320 a night, a walk to the L.",
          "Hyatt Regency Chicago — By the river, about $200–330 a night. The riverwalk is the evening, $0.",
          "Chicago Marriott Downtown Magnificent Mile — About $200–340 a night. One room, not a suite, and not a suburb."
        ],
        [
          "Park Hyatt Chicago — Near Water Tower, about $400–700 a night. The lake is still a walk.",
          "The Langham Chicago — On the river, about $450–750 a night. Winter is when this rate is easier to justify.",
          "Four Seasons Hotel Chicago — On the Magnificent Mile, about $500–800 a night. Breakfast is not included in that figure.",
          "The St. Regis Chicago — A lakeshore tower, about $500–900 a night. The Art Institute is still $32."
        ]
      ),
      eatTiers: tiers(
        [
          "A diner breakfast or a doughnut — About $8–15. Not the Magnificent Mile hotel restaurant.",
          "An Italian beef — About $12–18. Lunch. One is enough.",
          "A tavern burger — About $15–22. The neighborhood version of dinner.",
          "Deep-dish once — About $20–30 for a pie you share. Then stop. It is not every meal."
        ],
        [
          "A Fulton Market reservation — About $40–70 a person, if you slept at The Hoxton or will take the L. Book it.",
          "A West Loop casual lunch — About $20–30. Closer than a Mag Mile steakhouse.",
          "The Publican — One dinner in that band, about $40–70 a person. The other nights are beef and a diner.",
          "Logan Square if you ride there — About $30–50 a person. The L is $2.50. A car is the long way."
        ],
        [
          "Alinea — A tasting menu, often $200 and up, one night. The next morning is a diner at $10–15.",
          "A hotel breakfast at the Peninsula or the Four Seasons — Easy to pass $40 a person. That is several diner mornings.",
          "An architecture dinner cruise — Often $80 and up, which is the cruise plus a meal. Pick the $50–65 sightseeing cruise or the restaurant, not a floating version of both.",
          "A second tasting the next night — Leaves the $45–75 food band. One splurge is the rule."
        ]
      ),
      doTiers: tiers(
        [
          "The riverwalk — $0. Start from the hotel you booked.",
          "The lakefront — $0. A walk, not a hop-on bus.",
          "The L — $2.50 a ride, or $15 for a 3-day pass. O'Hare is $5.",
          "A free museum window — $0 if the calendar has one. Do not plan the week around a maybe."
        ],
        [
          "The Art Institute — $32 for visitors who do not live in Chicago. Residents pay less. One museum.",
          "An architecture cruise — Often $50–65. This or the Art Institute, not both, on a three-night trip.",
          "A neighborhood afternoon in Fulton Market — $0 beyond dinner.",
          "The 3-day Ventra pass — $15 a person. Two people, $30. Cheaper than rideshares."
        ],
        [
          "A reserved show — A separate ticket, often $80 and up. It replaces the cruise, not stacks on it.",
          "A second museum — Another $20–32. Give it a different day or skip it.",
          "A hop-on bus — A ticket for a lakefront you can walk. The L is $2.50. Skip the bus.",
          "Summer weekends — A different hotel rate than a January room at about $190–320. Move the date if the tower you want is the point."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at The Hoxton. Diner breakfast, one Fulton Market dinner, a 3-day Ventra pass, and the Art Institute. The river cruise is the other choice, not both.",
        lines: [
          line("Room", "$750", "The Hoxton or a Loop hotel at $250 a night, three nights. Inside $190–320, before 17.4% lodging tax."),
          line("Food", "$360", "$60 a person, two people, three days. Inside $45–75."),
          line("Ventra", "$30", "A 3-day pass at $15 times two. A single L ride is $2.50. O'Hare is $5."),
          line("Art Institute", "$64", "$32 times two. A river cruise instead would be about $50–65 each.")
        ],
        day: "The museum day is the room ($250) plus food for two ($120) plus a share of the pass (about $10) plus two admissions ($64): about $440 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,200 before lodging tax and flights ($750 room + $360 food + $30 transit + $64 tickets). Lodging plus food is about $1,110, inside the Quick facts sample of $850–1,400.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The river, then the market", [
          "Diner breakfast, about $10–15. Walk the riverwalk. $0.",
          "Italian beef for lunch, about $12–18.",
          "Dinner in Fulton Market if that is where you slept, about $40–70, or a tavern at $15–22."
        ]),
        day("One museum", [
          "The Art Institute, $32, for the middle of the day. Not a second museum.",
          "The other meal is beef or a diner, not a tasting menu.",
          "The lakefront if you still want to be outside. The cruise is the other ticket, often $50–65."
        ]),
        day("The neighborhood", [
          "Deep-dish once if you want it, about $20–30 shared, then you are done with it.",
          "No hop-on bus. The L is $2.50 or the pass you already hold.",
          "Leave from the same hotel. A Saturday in summer is not this January rate."
        ])
      ],
      book: [
        "The hotel near an L stop, after 17.4% tax is on the quote.",
        "The Art Institute, $32 for out-of-town adults, or the architecture cruise at about $50–65. Not both by reflex.",
        "One Fulton Market table if dinner there is the point.",
        "A 3-day Ventra pass, $15, if you will ride all three days."
      ],
      hidden: [
        "Chicago lodging tax at about 17.4%.",
        "The O'Hare L ride at $5, which is not the $2.50 city fare.",
        "An architecture cruise at $50–65 on top of a $32 museum.",
        "Rideshares that copy the L.",
        "A summer weekend rate in a hotel you priced in January."
      ],
      skip: [
        skip("A hop-on bus of the lakefront", "The path is free. The L is $2.50 or $15 for three days."),
        skip("Deep-dish at every meal", "Once, about $20–30 to share. Then a beef at $12–18 and a neighborhood dinner."),
        skip("The Art Institute and a river cruise and a tasting menu", "Pick one paid cultural ticket. The museum is $32. The cruise is about $50–65. Alinea is a third purchase.")
      ],
      tips: [
        "Hidden gem: A 3-day Ventra pass is $15. A single ride is $2.50. The airport ride from O'Hare is $5, not the city fare.",
        "Hidden gem: The riverwalk and the lakefront do not have tickets. The architecture cruise, often $50–65, is the paid version of a view you can walk.",
        "Hidden gem: The Art Institute is $32 if you do not live in Chicago, $20 for Chicago residents, and $27 for other Illinois residents. Read the sign instead of assuming $32.",
        "The Hoxton puts dinner in Fulton Market. A Magnificent Mile steak after a Fulton lunch is two neighborhoods and a fare.",
        "January rates and summer weekends are not the same tower. Move the date before you move to the suburbs to save forty dollars."
      ],
      money: money(
        "About $190–320 a night before tax in the Loop, River North, or Fulton Market at The Hoxton. Lodging tax is about 17.4% on top.",
        "About $45–75 with a diner breakfast, one Italian beef or one deep-dish, and a neighborhood dinner.",
        "The Art Institute is $32 for out-of-town adults. A 3-day Ventra pass is $15. An architecture cruise is often $50–65.",
        "Three mid-range nights run about $850–1,400 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    nola: {
      hook: "New Orleans stays cheaper in the Warehouse District or the Garden District, with one po'boy and one reserved dinner. A French Quarter balcony room plus a courtyard meal every night is the expensive version of the same food city.",
      blurb: "Book Hotel Peter and Paul in the Marigny, or a Warehouse District Hampton. Cafe breakfast, one po'boy, one dinner at Galatoire's or Commander's. The streetcar is $1.25.",
      nights: "3 nights on a streetcar line",
      midrange: "Hotel Peter and Paul, one po'boy, one dinner",
      months: "Late January after the bowl games, and May before the worst heat. Mardi Gras is a different budget.",
      startHere: "Book Hotel Peter and Paul in the Marigny, or the Hampton Inn by the convention center in the Warehouse District. Ride the streetcar, $1.25, or walk. Eat one beignet at Cafe du Monde, then switch to a neighborhood cafe. Book one dinner at Galatoire's or Commander's Palace, and buy standing room at Preservation Hall only if you want the music, about $25.",
      tipsKicker: "The streetcar is $1.25. The Quarter balcony is the upcharge.",
      cta: "Build the New Orleans Trip Plan from the Marigny or the Warehouse District. Add one dinner before you add a second courtyard hotel.",
      forWho: ["People who will walk or ride the streetcar and treat one restaurant as the reservation"],
      notFor: ["A Bourbon Street hotel chosen for the balcony, with a tourist-menu dinner every night"],
      aroundKind: "fork",
      aroundRule: "From the Marigny, the Garden District, or the Warehouse District you can walk or ride the streetcar. A single ride is $1.25. A 1-day Jazzy Pass is $3. A car is for a plantation morning, not for dinner in the Quarter. Lodging tax is about 16.2%.",
      aroundNoCar: [
        "The St. Charles streetcar reaches the Garden District. The Canal streetcar reaches the Quarter from Mid-City",
        "A 1-day pass is $3. Two people for two days of passes is $12 in the worked example",
        "Bourbon Street at night is a walk you can leave. You do not need a balcony above it"
      ],
      aroundCar: [
        "A plantation or a swamp tour is the morning that can justify a car or a tour van",
        "Parking in the Quarter spends a Warehouse rate you booked so you could walk",
        "Mardi Gras week is a different city. Do not price it off a May room"
      ],
      stayRule: "Pay for a streetcar neighborhood, not for a Bourbon balcony. Mid rooms are about $200–330 a night before about 16.2% tax. The Quarter premium does not buy a better table at Galatoire's.",
      eatRule: "Cafe au lait and a beignet once is about $8–12. A po'boy is about $12–18. One dinner at Commander's or Galatoire's is $50–90 a person. A courtyard with a photo menu is the tourist price.",
      doRule: "A Quarter walk in daylight is free. The streetcar is $1.25. Preservation Hall standing room is about $25. A plantation tour is a separate half day.",
      zones: [
        zone("The Marigny", "Book Hotel Peter and Paul. Rooms are about $220–360 a night before the 16.2% lodging tax. You walk to dinner. Do not choose it if you wanted a St. Charles mansion hotel. That is the Garden District."),
        zone("Warehouse District", "Book the Hampton Inn by the convention center, about $140–230 a night before tax. The streetcar is the ride to the Quarter. Do not choose it and then pay for a Bourbon balcony you will not sit on."),
        zone("Garden District", "Book The Pontchartrain, on the St. Charles line, about $200–340 a night before tax. The streetcar is outside. Do not choose it if every night must end on Bourbon Street. You will spend the calm on rides."),
        zone("The French Quarter, on purpose", "Book the Omni Royal Orleans only if you want the Quarter premium, about $220–380 a night. It does not buy a better Galatoire's table. Do not choose it because the balcony looked good in a photo.")
      ],
      stayTiers: tiers(
        [
          "The Drifter — In Mid-City, about $120–200 a night before about 16.2% lodging tax. The Canal streetcar reaches the Quarter.",
          "Hampton Inn & Suites New Orleans Convention Center — Warehouse District, about $140–230 a night. The streetcar is the ride.",
          "Courtyard New Orleans Downtown/Convention Center — About $150–240 a night, the same Warehouse idea.",
          "Holiday Inn New Orleans Downtown Superdome — About $130–220 a night. A Bourbon balcony is a different, higher rate."
        ],
        [
          "Hotel Peter and Paul — In the Marigny, about $220–360 a night before the 16.2% lodging tax. You walk to dinner.",
          "The Pontchartrain — Garden District, on the St. Charles streetcar, about $200–340 a night.",
          "New Orleans Marriott — On Canal, about $180–320 a night. Walk or ride. You do not need a rental at night.",
          "Omni Royal Orleans — The Quarter premium, about $220–380 a night. It does not include a better dinner reservation."
        ],
        [
          "Windsor Court — In the business district, about $350–600 a night. The trip is still the food.",
          "The Roosevelt New Orleans — About $300–550 a night. One hotel, not also a Quarter suite.",
          "Hotel Monteleone — The Quarter flagship, about $300–550 a night. The carousel bar is not a reason to skip a Warehouse rate.",
          "Four Seasons Hotel New Orleans — About $500–900 a night. One courtyard, not two hotels."
        ]
      ),
      eatTiers: tiers(
        [
          "Cafe du Monde — Coffee and a beignet once, about $8–12. Then a neighborhood cafe.",
          "A po'boy at Parkway — About $12–18. Lunch. Not a Bourbon Street breakfast.",
          "A neighborhood gumbo — About $10–16. Dinner when you do not hold a reservation.",
          "A corner daiquiri — A snack, not the $15–25 dinner. Budget dinner separately."
        ],
        [
          "Galatoire's — One dinner, about $50–90 a person, if you can get the table. Friday lunch is the famous seating. Book it.",
          "Commander's Palace — The Garden District version, about $50–90 a person. One of these, not both, on a three-night trip.",
          "A Marigny bistro — About $30–50 a person near Hotel Peter and Paul. The night you do not hold Galatoire's.",
          "Cafe du Monde a second time — Still about $8–12. It is not a dinner."
        ],
        [
          "A tasting menu on top of Commander's — A second splurge, often $100 and up. Pick one.",
          "A hotel courtyard with a photo menu — The tourist price for a meal you can eat in the Marigny for about $30–50.",
          "Breakfast at a luxury hotel — Easy to pass $30 a person. The cafe is about $8–12.",
          "Three reservations in three nights — Food leaves $55–90 a person. One table is the plan."
        ]
      ),
      doTiers: tiers(
        [
          "The French Quarter in daylight — $0. Look, then leave before the night markup.",
          "The streetcar — $1.25 a ride, or $3 for a day pass.",
          "A park or the riverfront — $0. The afternoon that is not a tour.",
          "Live music from the sidewalk — $0. Go in only if you want to pay."
        ],
        [
          "Preservation Hall standing room — About $25. Reserved seats cost more. One show.",
          "A Garden District walk from the streetcar — $0 beyond the $1.25 fare.",
          "One house museum — Often $15–25. Not two plantations the same day.",
          "A second neighborhood at dusk — Walk, or ride the streetcar at $1.25. A car in the Quarter is the hard version."
        ],
        [
          "A plantation tour — A half day and a ticket, often $50 and up. It replaces a Quarter morning.",
          "A swamp tour — Another half day, often $40–60. Not the same day as the plantation.",
          "Mardi Gras lodging — A different rate and a different crowd. Do not price it off this May room at about $200–330.",
          "A second show after Preservation Hall — Standing room there is about $25. Another ticket is a second music night."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at Hotel Peter and Paul. One po'boy, one Galatoire's or Commander's dinner inside the food band, the streetcar, and Preservation Hall standing room.",
        lines: [
          line("Room", "$780", "A Marigny or Warehouse hotel at $260 a night, three nights. Inside $200–330, before about 16.2% lodging tax."),
          line("Food", "$420", "$70 a person, two people, three days. Inside $55–90."),
          line("Streetcar", "$12", "Two 1-day passes at $3, for two people. A single ride is $1.25."),
          line("Preservation Hall", "$50", "Standing room at about $25 times two.")
        ],
        day: "The music day is the room ($260) plus food for two ($140) plus the streetcar (about $6) plus two standing tickets ($50): about $455 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,260 before lodging tax and flights ($780 room + $420 food + $12 transit + $50 tickets). Lodging plus food is about $1,200, inside the Quick facts sample of $950–1,550.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("Daylight in the Quarter", [
          "Cafe au lait once, about $8–12. Walk the Quarter. $0.",
          "A po'boy, about $12–18, outside the Bourbon breakfast strip.",
          "Streetcar back, $1.25. Dinner in the Marigny if that is the hotel."
        ]),
        day("One table", [
          "Galatoire's or Commander's, about $50–90 a person, at the time you booked.",
          "The other meal is a po'boy or gumbo, about $12–18.",
          "Preservation Hall if you want it, about $25 standing. Not a second show."
        ]),
        day("The Garden District line", [
          "St. Charles streetcar, $1.25, and a walk. $0 beyond the fare.",
          "No plantation unless that half day, often $50, replaced the Quarter.",
          "Leave from the same hotel. Mardi Gras is not this rate."
        ])
      ],
      book: [
        "The hotel in the Marigny, the Warehouse District, or the Garden District, after about 16.2% tax.",
        "Galatoire's or Commander's Palace if that dinner is the point, about $50–90 a person.",
        "Preservation Hall if you want the room, about $25 to stand.",
        "The streetcar does not need a pass in advance. A ride is $1.25. A day pass is $3."
      ],
      hidden: [
        "Lodging tax at about 16.2%.",
        "A Quarter balcony premium on top of a Warehouse rate.",
        "A plantation and a swamp tour in the same short stay.",
        "A courtyard photo menu after you already hold Commander's.",
        "Mardi Gras dates, which are not the late-January rate."
      ],
      skip: [
        skip("A Bourbon balcony as the hotel", "Hotel Peter and Paul is about $220–360 and you walk to dinner. The balcony is a higher rate for a louder night."),
        skip("Beignets at every meal", "Once, about $8–12. Then a po'boy at $12–18."),
        skip("Two plantations", "One half day, often $50 and up, is the out-of-town morning. The second replaces the neighborhood you paid to sleep in.")
      ],
      tips: [
        "Hidden gem: A streetcar ride is $1.25 and a 1-day Jazzy Pass is $3. You do not need a car for the Quarter, the Marigny, or the Garden District.",
        "Hidden gem: Preservation Hall standing room is about $25. Reserved seats cost more. The sidewalk is $0 if you only wanted the night air.",
        "Hidden gem: Cafe du Monde once is about $8–12. A neighborhood cafe after that is the breakfast. The hotel courtyard is the expensive version.",
        "Omni Royal Orleans does not include a better shot at Galatoire's. Book the table. Sleep where you will walk home.",
        "Late January and May are not Mardi Gras. If the dates can move, the hotel rate moves more than the po'boy."
      ],
      money: money(
        "About $200–330 a night before tax in the Warehouse District or the Garden District. Hotel Peter and Paul in the Marigny is about $220–360. Lodging tax is about 16.2%.",
        "About $55–90 with a cafe breakfast, a po'boy, and one dinner at Galatoire's or Commander's Palace.",
        "Preservation Hall standing room is about $25. A streetcar ride is $1.25. A 1-day pass is $3.",
        "Three mid-range nights run about $950–1,550 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    philadelphia: {
      hook: "Philadelphia stays cheaper when you sleep in Center City and eat at Reading Terminal. A Rittenhouse hotel plus three sit-down salads plus a carriage ride is the expensive version of a walkable downtown.",
      blurb: "Book The Notary Hotel or the Hampton Inn in Center City. Reading Terminal for breakfast. One cheesesteak, then stop. Independence Hall is free. The Barnes is about $30.",
      nights: "2–3 nights in Center City",
      midrange: "The Notary or Kimpton Monaco, Reading Terminal, one dinner",
      months: "February, early March, and late January after the holidays.",
      startHere: "Book The Notary Hotel by City Hall, Kimpton Hotel Monaco, or the Hampton Inn in Center City. Eat at Reading Terminal Market. Reserve Independence Hall, which is free, and buy the Barnes, about $30, if you want one museum. Ride the subway or a bus (SEPTA), about $2.50. You do not need a car.",
      tipsKicker: "Independence Hall is free and timed. The Barnes is the paid museum.",
      cta: "Build the Philadelphia Trip Plan from Center City. Add the Barnes or the Art Museum, not a carriage.",
      forWho: ["People who will walk Center City and Old City and eat at Reading Terminal"],
      notFor: ["Anyone who wants a car between museums and a restaurant reservation every night"],
      aroundKind: "transit",
      aroundRule: "You do not need a car. Subway and bus rides (SEPTA) are about $2.50. Independence Hall is a walk from a Center City hotel. Lodging tax is 15.5%.",
      aroundNoCar: [
        "A SEPTA ride is about $2.50. Four rides for two people is about $20 in the worked example",
        "Independence Hall and the Liberty Bell are a walk from Kimpton Hotel Monaco",
        "Reading Terminal is next to the convention center. The Marriott downtown is beside it"
      ],
      stayRule: "Pay for a walk to Reading Terminal or to Independence Mall. Mid rooms are about $200–320 a night before 15.5% tax. A Rittenhouse luxury room does not make Independence Hall better. It is still free.",
      eatRule: "Reading Terminal breakfast is about $8–15. A cheesesteak is about $12–18, once. One dinner is $40–70 a person. Three $28 salads near Rittenhouse are a museum ticket.",
      doRule: "Independence Hall is timed and free. The Barnes and the Philadelphia Museum of Art are about $30 each. Do not do both on the same afternoon.",
      zones: [
        zone("City Hall", "Book The Notary Hotel. Rooms are about $220–340 a night before Philadelphia's 15.5% lodging tax. You can walk to the Hall and to Reading Terminal. Do not choose it if you wanted a riverfront resort. This is a downtown hotel."),
        zone("Independence Mall", "Book Kimpton Hotel Monaco, about $220–360 a night before tax. Independence Hall is a walk and it is free if you reserved a time. Do not choose it and then rent a car to reach a building you can see from the sidewalk."),
        zone("The convention center", "Book the Philadelphia Marriott or the Hampton Inn in Center City. The Hampton is about $140–220 a night before tax. The Marriott is about $200–320. Reading Terminal is next door. Do not choose a highway hotel and commute in for the market."),
        zone("Rittenhouse Square", "Book The Rittenhouse only when the square is the treat, about $400–700 a night. The museums are still a walk or a $2.50 ride. Do not choose it so you can eat hotel salads at $28.")
      ],
      stayTiers: tiers(
        [
          "Hampton Inn Philadelphia Center City — About $140–220 a night before the 15.5% lodging tax. Reading Terminal is a walk.",
          "Home2 Suites Philadelphia Downtown — A kitchen, about $150–230 a night, if you will grocery breakfast and still visit the market once.",
          "Courtyard Philadelphia Downtown — About $160–240 a night, near City Hall.",
          "Apple Hostels of Philadelphia — A shared bed, about $40–70, well under a Rittenhouse rate. Center City is still the neighborhood."
        ],
        [
          "The Notary Hotel — By City Hall, about $220–340 a night before the 15.5% lodging tax. You can walk to the Hall.",
          "Kimpton Hotel Monaco — A walk to Independence Mall, about $220–360 a night.",
          "Philadelphia Marriott Downtown — By the convention center, about $200–320 a night, next to Reading Terminal.",
          "Loews Philadelphia Hotel — Center City, about $200–330 a night. SEPTA at $2.50 beats a rental."
        ],
        [
          "Four Seasons Hotel Philadelphia — On Logan Square, about $500–900 a night. Independence Hall is still free.",
          "The Rittenhouse — On the square, about $400–700 a night.",
          "The Logan Philadelphia — On the Parkway, about $300–550 a night. The Art Museum is the walk from here.",
          "W Philadelphia — About $300–500 a night. The paid museum is still about $30, not included."
        ]
      ),
      eatTiers: tiers(
        [
          "Reading Terminal Market — Breakfast or lunch, about $8–18. This is the market, not the hotel.",
          "A cheesesteak once — About $12–18 at a neighborhood shop, or the tourist stands at Pat's and Geno's. Then stop.",
          "A roast pork sandwich — About $12–18. The local argument after the cheesesteak, not a third steak.",
          "Italian Market — A South Philadelphia walk and a snack, about $8–15, if you are already there."
        ],
        [
          "A Center City dinner — About $40–70 a person, one reservation. The other meals are the Terminal.",
          "A casual lunch on the Parkway — About $15–25, on a museum day.",
          "Terminal stalls for dinner — About $12–20, on a night you do not hold a table.",
          "Coffee near the hotel — About $4–7. Not a $28 salad as the default lunch."
        ],
        [
          "Zahav — A reserved dinner, often $80 and up a person. One night. The next morning is the Terminal at $8–15.",
          "A hotel restaurant at The Rittenhouse — The expensive version of a Terminal plate at about $8–15.",
          "Three $28 salads — $84, which is more than two Barnes tickets at $30. Eat the market.",
          "A second tasting after Zahav — Leaves the $50–80 band. One splurge."
        ]
      ),
      doTiers: tiers(
        [
          "Independence Hall and the Liberty Bell — $0, and Hall entry is timed. Reserve it.",
          "Reading Terminal — The building is free. Food is about $8–18.",
          "City Hall from the outside — $0. Not a carriage loop.",
          "SEPTA — About $2.50 a ride."
        ],
        [
          "The Barnes — About $30. A half day. Not also the Art Museum the same afternoon.",
          "The Philadelphia Museum of Art — About $30, on a different day from the Barnes.",
          "Eastern State Penitentiary — A paid half day, about $20. It replaces a museum, not stacks on two of them.",
          "Old City at night — $0. Walk back to the hotel."
        ],
        [
          "The Barnes and the Art Museum on different days — Two $30 tickets. Only if you want both buildings.",
          "The Franklin Institute — A kids-first ticket, about $25. Skip it if the party is adults.",
          "A carriage ride — A fare for a downtown you can walk. The walk is $0.",
          "A food tour on top of the Terminal — You are paying a guide for stalls that are about $8–15 without one."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at The Notary or Kimpton Hotel Monaco. Reading Terminal twice, one neighborhood dinner, SEPTA, Independence Hall, and the Barnes.",
        lines: [
          line("Room", "$750", "A Center City hotel at $250 a night, three nights. Inside $200–320, before 15.5% lodging tax."),
          line("Food", "$390", "$65 a person, two people, three days. Inside $50–80."),
          line("SEPTA", "$20", "About four rides each at $2.50, for two people. Independence Hall is a walk."),
          line("The Barnes", "$60", "About $30 times two. Independence Hall is $0.")
        ],
        day: "The museum day is the room ($250) plus food for two ($130) plus SEPTA (about $10) plus two Barnes tickets ($60): about $450 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,220 before lodging tax and flights ($750 room + $390 food + $20 transit + $60 tickets). Lodging plus food is about $1,140, inside the Quick facts sample of $900–1,450.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The market, then the Hall", [
          "Reading Terminal breakfast, about $8–15.",
          "Independence Hall at the time you reserved. $0.",
          "One cheesesteak, about $12–18, then you are done with it."
        ]),
        day("One museum", [
          "The Barnes, about $30, or the Art Museum, about $30. Not both.",
          "Lunch at the Terminal or near the museum, about $12–20.",
          "Old City in the evening. $0. SEPTA back is $2.50 if you need it."
        ]),
        day("The neighborhood", [
          "A second Terminal meal, about $12–20, or one dinner reservation at $40–70.",
          "No carriage. The walk is the point.",
          "Same hotel. A highway property would have been a commute."
        ])
      ],
      book: [
        "A Center City hotel, after 15.5% tax.",
        "Independence Hall timed entry. It is free and it fills.",
        "The Barnes, about $30, if that is the museum.",
        "Zahav only if that dinner is the splurge you already want."
      ],
      hidden: [
        "Lodging tax at 15.5%.",
        "A second $30 museum the same afternoon as the Barnes.",
        "Rideshares that copy a $2.50 SEPTA ride.",
        "A carriage fare.",
        "Three $28 salads, which are $84."
      ],
      skip: [
        skip("A carriage loop of streets you can walk", "Independence Hall is free. SEPTA is about $2.50. The carriage is a fare for a sidewalk."),
        skip("Cheesesteaks at every meal", "Once, about $12–18. Then Reading Terminal and one real dinner."),
        skip("The Barnes and the Art Museum in one afternoon", "Each is about $30 and a half day. Pick one, or give them two days.")
      ],
      tips: [
        "Hidden gem: Independence Hall is free and timed. Reserve it. The Liberty Bell is the same visit, not a second ticket.",
        "Hidden gem: The Barnes is about $30 and the Art Museum is about $30. They are far enough apart that both in one afternoon is two lobbies.",
        "Hidden gem: Reading Terminal is the breakfast, about $8–15, next to the Marriott and a walk from the Hampton Inn.",
        "SEPTA is about $2.50. A rental for Center City adds a garage to a downtown you can walk.",
        "February and early March are not holiday rates. Move the date before you move hotels to save forty dollars."
      ],
      money: money(
        "About $200–320 a night before tax in Center City or Old City. The Trip Plan mid baseline is about $230. Lodging tax is 15.5%.",
        "About $50–80 with Reading Terminal and one neighborhood dinner. A cheesesteak is once, about $12–18.",
        "The Barnes is about $30. The Art Museum is about $30. Independence Hall is free. SEPTA is about $2.50.",
        "Three mid-range nights run about $900–1,450 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    atlanta: {
      hook: "Atlanta stays cheaper in Midtown, on the BeltLine, with one meat-and-three dinner. A Buckhead hotel plus a rideshare to every meal is the expensive version of the same city.",
      blurb: "Book the Hampton Inn in Midtown or Hotel Clermont. Ride the airport train (MARTA), $2.50. Walk the BeltLine. The Georgia Aquarium is the one ticket, from about $44.",
      nights: "2–3 nights in Midtown",
      midrange: "Hotel Clermont or a Midtown Hampton, BeltLine dinner",
      months: "Late January through March, and November before Thanksgiving.",
      startHere: "Book the Hampton Inn in Midtown or Hotel Clermont on Ponce. Ride the train from the airport (MARTA), $2.50. Walk the BeltLine and eat at Ponce City Market. Buy the Georgia Aquarium only if you want that one ticket, from about $44. Skip a second ticket at World of Coca-Cola unless the aquarium was not the morning.",
      tipsKicker: "MARTA from the airport is $2.50. The BeltLine does not charge admission.",
      cta: "Build the Atlanta Trip Plan from Midtown. Add the aquarium or Coca-Cola, not both by default.",
      forWho: ["People who will stay in Midtown and walk the BeltLine for dinner"],
      notFor: ["A Buckhead hotel with a rideshare to the BeltLine every night"],
      aroundKind: "fork",
      aroundRule: "The airport train (MARTA) is $2.50, and a day pass is near $9. The BeltLine does not charge admission. A car helps if you leave Midtown for a specific errand. Lodging tax is 16.9%. Hotel Clermont and a Midtown Hampton do not need a car for the BeltLine.",
      aroundNoCar: [
        "Airport to Midtown on MARTA, $2.50. A day pass near $9 covers more rides",
        "The BeltLine Eastside Trail and Ponce City Market are a walk from Hotel Clermont",
        "Piedmont Park is free. It is not a hop-on bus"
      ],
      aroundCar: [
        "A car is useful if dinner is in a part of town the BeltLine does not reach",
        "Buckhead to Midtown by rideshare every night spends a Hampton rate",
        "A Braves game is a separate night and a separate ticket, not a BeltLine evening"
      ],
      stayRule: "Pay for Midtown or Ponce, not for a Buckhead commute. Mid rooms are about $180–280 a night before 16.9% tax. The BeltLine is the evening.",
      eatRule: "A cafe breakfast is about $10–15. Ponce City Market lunch is about $12–20. Mary Mac's or Fox Bros is about $20–40 a person. A Buckhead steakhouse is the splurge.",
      doRule: "The BeltLine and Piedmont Park are free. Georgia Aquarium general admission starts at $44.49. Anytime admission is $67.99. World of Coca-Cola is about $20–25.",
      zones: [
        zone("Hampton Inn Midtown", "Book the Hampton Inn in Midtown, about $140–220 a night before Atlanta's 16.9% lodging tax. Piedmont Park is the green space. Do not choose a highway hotel and rideshare in for the park."),
        zone("Ponce and the BeltLine", "Book Hotel Clermont, about $180–280 a night before tax. Ponce City Market and the BeltLine are the evening. Do not choose it if you wanted a Buckhead mall outside the door."),
        zone("Hyatt Regency downtown", "Book the Hyatt Regency or the Hilton downtown, about $170–280 a night before tax. Read the convention calendar before you book. Do not choose downtown and then expect a quiet BeltLine morning at the door."),
        zone("Buckhead", "Book the St. Regis or the Grand Hyatt in Buckhead only when that neighborhood is the trip, about $300–700 a night. You gave up the BeltLine walk. Do not choose Buckhead and also book a Midtown hotel for the other nights.")
      ],
      stayTiers: tiers(
        [
          "Hampton Inn & Suites Atlanta-Midtown — About $140–220 a night before the 16.9% lodging tax. The park and the train are the reasons.",
          "Home2 Suites Atlanta Downtown — A kitchen, about $130–210 a night, if you will grocery one breakfast.",
          "Holiday Inn Express Atlanta Downtown — About $120–200 a night. Check the convention dates before you call it quiet.",
          "HI Atlanta — A shared bed, about $30–60, if the party will split a rate. Midtown is still the evening."
        ],
        [
          "Hotel Clermont — On Ponce, about $180–280 a night before the 16.9% lodging tax. The BeltLine and Ponce City Market are the evening.",
          "Hyatt Regency Atlanta — Downtown, about $180–280 a night.",
          "Hilton Atlanta — The convention hotel, about $170–270 a night. Read the calendar first.",
          "The Westin Peachtree Plaza — About $180–300 a night. This is not a Buckhead commute."
        ],
        [
          "Four Seasons Hotel Atlanta — Midtown, about $400–700 a night.",
          "St. Regis Atlanta — Buckhead, about $400–700 a night. You traded the BeltLine walk.",
          "Grand Hyatt Atlanta in Buckhead — About $300–550 a night. The same trade.",
          "The Whitley Atlanta Buckhead — About $300–500 a night. One tower, not also a Midtown night."
        ]
      ),
      eatTiers: tiers(
        [
          "West Egg or a Midtown cafe — Breakfast about $10–15. Not the hotel.",
          "Ponce City Market — Lunch about $12–20.",
          "Mary Mac's Tea Room — A meat-and-three, about $15–25 a person. One classic dinner.",
          "A slice or a counter on the BeltLine — About $8–15. The walk's snack, not a steak."
        ],
        [
          "Fox Bros. Bar-B-Q — About $20–35 a person. The mid dinner if you did not book Mary Mac's.",
          "Krog Street Market — About $12–22, a second food hall, not a reason to skip Ponce.",
          "A BeltLine sit-down — About $25–45 a person. One reservation.",
          "Mary Mac's on the second night — Still about $15–25. It can be the dinner twice if you liked it. It should not become a steakhouse."
        ],
        [
          "A Buckhead steakhouse — Often $80 and up a person. One night, or skip it and stay on the BeltLine.",
          "A hotel restaurant in Buckhead — The expensive plate. Ponce is about $12–20.",
          "A tasting menu in Westside — Often $100 and up. One reservation. The next morning is a cafe at $10–15.",
          "Aquarium food as the plan — A $20 tray on top of a $44 ticket. Eat before you go in."
        ]
      ),
      doTiers: tiers(
        [
          "The BeltLine Eastside Trail — $0. Ponce City Market is the food stop, about $12–20.",
          "Piedmont Park — $0.",
          "The Martin Luther King Jr. National Historical Park — $0 to walk the site. A quiet morning.",
          "MARTA — $2.50 a ride. A day pass is near $9."
        ],
        [
          "Georgia Aquarium — Plan & Save general admission starts at $44.49. Anytime admission is $67.99 if you did not pick a time.",
          "World of Coca-Cola — About $20–25. This or the aquarium, not both, on a short trip.",
          "A Fox Theatre tour — A paid hour, about $20, only if the building is the point.",
          "Krog Street after the BeltLine — $0 to walk. Food is separate."
        ],
        [
          "The aquarium plus Coca-Cola — Two tickets, from about $44 and about $20. Give them separate days or skip one.",
          "A Braves game — A night ticket, often $30 and up, and a different part of town.",
          "A hop-on bus — A fare for the BeltLine. The trail is $0. MARTA is $2.50 if you need a train.",
          "A studio tour stacked on both tickets — The aquarium already starts at $44.49. A third paid morning is too many. Pick one."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at a Midtown Hampton or Hotel Clermont. A market lunch, one BeltLine dinner, MARTA from the airport, and the aquarium.",
        lines: [
          line("Room", "$660", "A Midtown hotel at $220 a night, three nights. Inside $180–280, before 16.9% lodging tax."),
          line("Food", "$360", "$60 a person, two people, three days. Inside $45–75."),
          line("MARTA", "$25", "About $25 for two, mixing a $2.50 airport ride and a day pass near $9. The BeltLine is $0."),
          line("Aquarium", "$90", "Plan & Save at about $45 times two. Anytime admission is $67.99 if you did not pick a time.")
        ],
        day: "The aquarium day is the room ($220) plus food for two ($120) plus MARTA (about $9) plus two tickets ($90): about $440 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,135 before lodging tax and flights ($660 room + $360 food + $25 transit + $90 tickets). Lodging plus food is about $1,020, inside the Quick facts sample of $800–1,300.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The BeltLine", [
          "Cafe breakfast, about $10–15. Walk the Eastside Trail. $0.",
          "Lunch at Ponce City Market, about $12–20.",
          "Mary Mac's or Fox Bros, about $15–35 a person."
        ]),
        day("One ticket", [
          "The aquarium from about $44, or Coca-Cola at about $20–25. Not both.",
          "The other meal is the market.",
          "Piedmont Park if you want a free hour. $0."
        ]),
        day("Stay in Midtown", [
          "No Buckhead commute. Dinner on the BeltLine, about $25–45, or the market again.",
          "MARTA if you need it, $2.50. A day pass is near $9.",
          "Same hotel. A convention downtown is a reason to read the calendar, not to add a car."
        ])
      ],
      book: [
        "A Midtown or Ponce hotel, after 16.9% tax, and after you have checked the convention calendar.",
        "Georgia Aquarium timed tickets if you want the lower Plan & Save price, from $44.49. Anytime is $67.99.",
        "World of Coca-Cola only if the aquarium is not the morning, about $20–25.",
        "MARTA from the airport does not need a tour. It is $2.50."
      ],
      hidden: [
        "Lodging tax at 16.9%.",
        "Anytime aquarium admission at $67.99 if you skipped the timed price.",
        "Rideshares between Buckhead and the BeltLine.",
        "A second attraction ticket the same day.",
        "Convention-week rates at the downtown Hilton."
      ],
      skip: [
        skip("A Buckhead hotel for a BeltLine trip", "Hotel Clermont is about $180–280 and the path is outside. Buckhead is a ride each way."),
        skip("The aquarium and Coca-Cola in one day", "The aquarium starts at $44.49. Coca-Cola is often $20–25. One ticket is the morning."),
        skip("A hop-on bus of the BeltLine", "The trail is free. MARTA is $2.50 if you need a train.")
      ],
      tips: [
        "Hidden gem: MARTA from the airport is $2.50. A day pass is near $9. The BeltLine does not charge admission.",
        "Hidden gem: Georgia Aquarium Plan & Save starts at $44.49. Anytime admission is $67.99. Pick a time if you want the lower price.",
        "Hidden gem: Ponce City Market is lunch, about $12–20, next to Hotel Clermont. It is not a Buckhead steakhouse.",
        "Read the downtown convention calendar before you book the Hilton. A quiet-looking rate can be a full building.",
        "Late January and November are not holiday rates. Move the date before you move to Buckhead to save forty dollars."
      ],
      money: money(
        "About $180–280 a night before tax in Midtown or on Ponce. The Trip Plan mid baseline is about $200. Lodging tax is 16.9%.",
        "About $45–75 with a cafe breakfast and a meat-and-three or a BeltLine dinner.",
        "Georgia Aquarium general admission starts at $44.49. Anytime admission is $67.99. World of Coca-Cola is often $20–25. MARTA is $2.50. The BeltLine is free.",
        "Three mid-range nights run about $800–1,300 in lodging plus food for two, before tax and flights (orientation)."
      )
    },

    london: {
      hook: "London stays cheaper when the hotel is a Premier Inn by the river or a Hoxton near restaurants, and the museums are the free ones. A Mayfair hotel plus the London Eye plus the Tower is a week that looks full and costs about twice as much.",
      blurb: "Book Premier Inn by County Hall, or The Hoxton. Bakery or a grocery-store breakfast. The British Museum is free. The Tower is about £35. Tap to pay on the Tube.",
      nights: "3–4 nights in central London",
      midrange: "The Hoxton or a South Bank Hilton, one dinner",
      months: "January, February, and November.",
      startHere: "Book Premier Inn London County Hall if you want the river walk, or The Hoxton if you want restaurants nearby. Buy breakfast at a bakery or a grocery store. Go to the British Museum or the National Gallery, which are free, before you look at the London Eye. The Tower of London is the one paid historic ticket, about £35.",
      tipsKicker: "The national museums are free. The Eye is not.",
      cta: "Build the London Trip Plan in pounds, from one neighborhood on the Tube. Add the Tower only if you want that ticket.",
      forWho: ["People who will tap to pay on the Tube and spend a morning in a free museum"],
      notFor: ["A Mayfair hotel plus a paid tower every afternoon"],
      aroundKind: "transit",
      aroundRule: "You do not need a car. Tap a bank card on the Tube and buses. In central London the daily cap is £8.90. A Monday-to-Sunday cap is £44.70 a person if you ride every day. Those caps are for zones 1 and 2, the center and the inner neighborhoods. The Heathrow Elizabeth line is £15.50 extra if you start at the airport. UK hotel quotes usually include the sales tax.",
      aroundNoCar: [
        "Tap the same card. The central daily cap is £8.90. Four days for two people in the worked example is about £71",
        "The South Bank walk from Premier Inn County Hall is free. The London Eye is a separate ticket",
        "The British Museum is a walk from a Bloomsbury hotel such as Generator. Entry is free"
      ],
      stayRule: "Pay for a Tube stop in the center, not for a Mayfair address. Mid rooms are about £160–270 a night, tax usually already in the price. A Heathrow hotel is fine the night you land. It is a poor base if you ride into the city every morning.",
      eatRule: "A bakery or a grocery-store meal is about £5–10. A market lunch is about £10–15. One dinner is £25–45 a person. A West End set menu after the theater is the expensive night, not every night.",
      doRule: "The British Museum and the National Gallery are free. The Tower of London is about £35–38. The London Eye is a separate paid view. The congestion charge does not apply if you never rent a car.",
      zones: [
        zone("South Bank, by the London Eye", "Book Premier Inn London County Hall. Rooms are about £100–160 a night, with tax usually included. The river walk is free. The Eye is not. Do not choose this hotel and then pay for the Eye, the Tower, and a river cruise in one day."),
        zone("Shoreditch or Southwark, The Hoxton", "Book The Hoxton. Rooms are about £180–280 a night. Restaurants are nearby and the Tube is a walk. Do not choose it if you wanted a quiet museum block. That is Bloomsbury or South Kensington."),
        zone("Bloomsbury, by the British Museum", "Book Generator London if you want a shared bed, often under £80, or a Bloomsbury hotel you can walk from to the museum. The museum is free. Do not choose a shared bed if you wanted a quiet room. That is a Premier Inn or The Resident."),
        zone("South Kensington", "Book The Resident in South Kensington, about £170–260 a night. The big museums are a walk, and several are free. Do not choose it and then taxi to a Mayfair dinner every night.")
      ],
      stayTiers: tiers(
        [
          "Premier Inn London County Hall — On the South Bank, about £100–160 a night, tax usually in the quote. The river walk is the reason. The Eye is extra.",
          "Ibis London Euston St Pancras — In central London, about £90–150 a night. A grocery store is nearby for breakfast.",
          "Travelodge London Covent Garden — A smaller room, about £100–170 a night, if you packed light. The theaters are a walk.",
          "Generator London — A shared bed in Bloomsbury, often under £80. The British Museum is a walk and it is free."
        ],
        [
          "The Hoxton — In Shoreditch or another Hoxton, about £180–280 a night. Restaurants are nearby.",
          "The Resident South Kensington — Museum neighborhood without a Mayfair rate, about £170–260 a night.",
          "Hilton London Bankside — About £180–280 a night. The Tube is in the neighborhood. The Tate Modern is a walk.",
          "Canopy by Hilton London City — About £170–270 a night. One neighborhood, not also a Mayfair night."
        ],
        [
          "The Ned — The room is the treat, often £400 and up. Breakfast is still charged separately.",
          "The Savoy — By the river, often £600 and up. The South Bank walk is still free.",
          "Claridge's or The Connaught — Mayfair, often £700 and up. You are paying for the address.",
          "Raffles London at The OWO — On Whitehall, often £600 and up. The British Museum is still free."
        ]
      ),
      eatTiers: tiers(
        [
          "A grocery store or a bakery — Breakfast about £5–10. A hotel breakfast is extra unless the rate says it is included.",
          "Borough Market or Maltby Street — Lunch about £10–15.",
          "A pub pie — About £12–18. Dinner when you do not hold a reservation.",
          "An Indian or Turkish dinner outside the West End — About £15–25 a person. The cheaper neighborhood meal."
        ],
        [
          "Dishoom — One dinner, about £25–40 a person. Book it or eat the pub.",
          "A Soho table — About £30–50 a person, once, not every night after the theater.",
          "A gastropub lunch — About £15–25. The mid meal that is not a tasting menu.",
          "Padella or a similar pasta line — About £15–25, if you will wait. It is not a 9 p.m. guarantee."
        ],
        [
          "Core or Kitchen Table — A tasting menu, often £150 and up. One night.",
          "A Mayfair dinner — Often £80 and up a person. The address is the bill.",
          "A pint at £8 — Already the London price. Three of them are a market lunch.",
          "The London Eye plus a riverside set menu — Two views of a river you can walk for £0."
        ]
      ),
      doTiers: tiers(
        [
          "The South Bank — Walking the river path is £0. You can see the London Eye from outside, and the Tate Modern turbine hall does not need a ticket.",
          "The British Museum or the National Gallery — £0.",
          "A neighborhood market — Columbia Road or Borough. Entry is free. Food is about £10–15.",
          "The Tube — Tap to pay. The central daily cap is £8.90."
        ],
        [
          "The Tower of London — About £35–38 on the official page. The one paid historic ticket.",
          "A West End rush seat — A discount ticket if you want a show. A full-price seat is a different purchase from a dinner at about £25–45.",
          "Greenwich — A boat or a train, a half day. Not also the Tower, about £35, the same afternoon.",
          "The daily cap — £8.90 in the center. Do not buy a paper pass out of habit if the cap already covers you."
        ],
        [
          "The London Eye — A paid cabin for a view you can see from the South Bank for £0. Skip it on a short trip.",
          "Windsor or Bath — A day trip with a train ticket, and it replaces a London museum day. The British Museum is £0.",
          "Three paid towers — The Tower is about £35. The Eye and a view deck are more tickets. Pick one.",
          "A car and the congestion charge — You do not need either. The Tube cap is £8.90."
        ]
      ),
      walk: {
        lead: "Two adults, four nights at Premier Inn County Hall or The Hoxton. A bakery breakfast, one Dishoom night, tap-to-pay under the daily cap, a free museum, and the Tower. The Eye stays off this total.",
        lines: [
          line("Room", "£840", "About £210 a night, four nights. Inside £160–270. UK quotes usually include tax. At $1 ≈ £0.76 that is about $1,100."),
          line("Food", "£280", "£35 a person, two people, four days. Inside £25–45."),
          line("Tube", "£71", "Central daily cap £8.90, two people, four days. The Monday–Sunday cap is £44.70 a person if you ride every day."),
          line("Tower", "£72", "About £36 times two. The British Museum is £0.")
        ],
        day: "The Tower day is the room (£210) plus food for two (£70) plus the daily cap for two (about £18) plus two Tower tickets (£72): about £370.",
        tripLabel: "4-night trip",
        trip: "About £1,260 before flights (£840 lodging + £280 food + £71 transit + £72 Tower). Add about £31 if both of you take the Elizabeth line from Heathrow at £15.50. Lodging plus food is £1,120, inside the Quick facts sample of £850–1,450.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The free museum", [
          "Bakery breakfast, about £5–10.",
          "The British Museum or the National Gallery. £0.",
          "Borough Market lunch, about £10–15. The river walk back is free."
        ]),
        day("The Tower, then stop", [
          "The Tower, about £35. Not also the Eye.",
          "A pub dinner, about £12–18, or Dishoom if you booked it, about £25–40.",
          "Tube home under the £8.90 cap."
        ]),
        day("One neighborhood", [
          "South Kensington museums or Greenwich, not both.",
          "No third paid tower. The walk is the afternoon.",
          "Same hotel. A Heathrow night is only the night you land or fly."
        ])
      ],
      book: [
        "The hotel in one neighborhood. Tax is usually already in a UK quote.",
        "The Tower of London on the official page, about £35–38, if you want it.",
        "A West End show only if the show is why you came.",
        "Nothing for the British Museum. It is free."
      ],
      hidden: [
        "The Heathrow Elizabeth line at £15.50 each, if the airport ride is not in your head.",
        "The London Eye, a paid view of a river you can walk.",
        "A Mayfair dinner on top of a Mayfair room.",
        "A paper transit pass when the £8.90 cap already covers the day.",
        "A Heathrow hotel used as the base for four city days."
      ],
      skip: [
        skip("The London Eye on a first short trip", "The South Bank walk is free. The Eye is a paid cabin."),
        skip("A Mayfair hotel for a museum week", "Premier Inn County Hall is about £100–160 and the river is outside. Mayfair is often £700 and up."),
        skip("Three paid views", "The Tower is about £35. The Eye and a third deck are extra. One historic ticket is enough.")
      ],
      tips: [
        "Hidden gem: The British Museum and the National Gallery are free. The Tower is about £35–38. The Eye is a separate paid view.",
        "Hidden gem: Tap a bank card. In central London the daily cap is £8.90. The Monday-to-Sunday cap is £44.70 if you ride every day. Zones 1–2 are the center and the inner neighborhoods.",
        "Hidden gem: The Elizabeth line from Heathrow is £15.50 a person. Add about £31 for two. A hotel at the airport is only for the night you land.",
        "UK quotes usually include sales tax. Do not add a second tax on top and call it the London rate.",
        "January and November are not holiday rates. Move the date before you move to Mayfair to save money."
      ],
      money: money(
        "About £160–270 a night for a mid hotel such as The Hoxton or a South Bank Hilton. Tax is usually in the quote. At roughly $1 ≈ £0.76, the Trip Finder shoulder band is about $210–350.",
        "About £25–45 with a bakery or grocery-store breakfast and one dinner outside a West End set menu.",
        "The British Museum and the National Gallery are free. The Tower of London is about £35–38. The central Tube cap is £8.90 a day.",
        "Four mid-range nights run about £850–1,450 in lodging plus food for two, before flights (orientation)."
      )
    },

    rome: {
      hook: "Rome stays cheaper when you walk and eat standing at a coffee bar. The bill jumps at a table on Piazza Navona, a golf-cart tour, and a second ruin ticket squeezed in before lunch.",
      blurb: "Book a hotel in Trastevere, or in Prati near the Vatican. Coffee and a cornetto at the bar. Give the Colosseum its own day. The Vatican is a different day.",
      nights: "3–4 nights in one neighborhood",
      midrange: "A Trastevere hotel, bar breakfast, one trattoria",
      months: "Late January through March, and November.",
      startHere: "Book a hotel in Trastevere, such as Hotel Santa Maria, or in Prati near the Ottaviano Metro stop if the Vatican is the day you care about. Breakfast is a cornetto and a coffee, standing at the bar. Give the Colosseum and the Forum their own day. Do not sit down at the first photo menu on Piazza Navona.",
      tipsKicker: "The coffee is cheaper if you stand at the bar.",
      cta: "Build the Rome Trip Plan in euros, from Trastevere or from Prati. Add the Colosseum or the Vatican, on different days.",
      forWho: ["People who will walk the center and eat one real trattoria"],
      notFor: ["A first trip that needs the Colosseum, the Vatican, and a golf-cart tour before lunch"],
      aroundKind: "transit",
      aroundRule: "You do not need a car. The historic center is a walk. A Metro ride is a couple of euros. A 72-hour pass is about €18 a person if you will ride more than you walk. The city hotel fee is a few euros a person per night and depends on the hotel class. Do not invent one flat number.",
      aroundNoCar: [
        "Walk from a Trastevere hotel across the river into the center",
        "From Hotel Alimandi or a Prati guesthouse, the Metro to the Vatican is at Ottaviano. On a map, that line is the A",
        "Termini station is the right hotel only the night you land late. The Beehive is the smaller room there, about €80–140"
      ],
      stayRule: "Pay for a walk to dinner, not for a view of a ruin from the bed. Mid rooms are about €170–320 a night. A Trastevere courtyard is the mid plan. A Colosseum-view room is the splurge.",
      eatRule: "A cornetto and a coffee at the bar are about €3–5. A slice of pizza is about €5–8. One trattoria is €25–45 a person. A cover charge on the bill, called coperto, is a few euros more. A photo menu on a square is the tourist price.",
      doRule: "The Pantheon is about €5. The Colosseum, Forum, and Palatine standard ticket is €18 plus a €2 booking fee. The Vatican Museums are €20, or €25 booked online. Do not stack all three in one afternoon.",
      zones: [
        zone("Trastevere", "Book Hotel Santa Maria, or a similar courtyard hotel in Trastevere. Rooms are about €180–280 a night. You walk to dinner, and you walk across the river to the center. Do not choose it if you need the train station at the door the morning you fly. That is a Termini hotel."),
        zone("Prati, by the Vatican", "Book Hotel Alimandi or a small hotel near the Ottaviano Metro stop, by the Vatican. Rooms are about €100–200 a night. The Metro to the Vatican museums is downstairs. On a map, that line is the A. Do not choose it and then taxi to Trastevere for every dinner."),
        zone("The historic center", "Book Hotel Nazionale or Hotel Indigo Rome St. George when you want the Pantheon and Piazza Navona as a walk, about €190–320 a night. Eat away from the square. Do not choose a table on the piazza because it was close to the hotel."),
        zone("Termini, the night you land", "Book The Beehive or the Hotel Universo by the station, about €80–180 a night. Trains are downstairs. Do not keep this as the whole week if you wanted quiet nights in Trastevere.")
      ],
      stayTiers: tiers(
        [
          "The Beehive — By Termini station, a smaller room, about €80–140 a night. Trains are downstairs. Louder nights.",
          "Hotel Alimandi — Near the Vatican, about €100–160 a night. The Metro to the museums is at Ottaviano. On a map, that line is the A.",
          "Ibis Styles Roma Vintage — About €110–170 a night. Pack light. Stairs are common in Rome.",
          "Best Western Plus Hotel Universo — By Termini, about €120–180 a night. The lower rate is the trade for the station noise."
        ],
        [
          "Hotel Santa Maria — A Trastevere courtyard, about €180–280 a night. You walk to dinner.",
          "Hotel Indigo Rome St. George — In the historic center, about €200–320 a night. Walking is the transit plan.",
          "Hotel Nazionale — Near Piazza Navona and the Pantheon, about €190–300 a night. Eat off the square.",
          "NH Collection Roma Palazzo Cinquecento — Next to Termini, about €170–280 a night, if you arrive late and want a full hotel rather than The Beehive."
        ],
        [
          "Palazzo Manfredi — You are paying for a Colosseum view, often €400 and up, not for a shorter walk.",
          "Hotel de Russie — By Piazza del Popolo, often €500 and up. The hotel breakfast is the splurge morning. The bar is the cheap one.",
          "Hassler Roma — Above the Spanish Steps, often €600 and up.",
          "The St. Regis Rome — Often €500 and up. The city hotel fee still sits on top, a few euros a person per night."
        ]
      ),
      eatTiers: tiers(
        [
          "A coffee bar — A cornetto and a coffee, standing, about €3–5. Sitting down costs more.",
          "Pizza by the slice in Testaccio or Trastevere — About €5–8. Lunch.",
          "A suppli — Fried rice ball, about €3–5. A snack, not dinner.",
          "A trattoria off a square — About €20–30 a person with water. Skip the photo menu on Piazza Navona."
        ],
        [
          "A set lunch at a trattoria — About €15–25. The mid meal.",
          "Roscioli — A reserved table, about €40–70 a person. Book it or eat the slice.",
          "A Testaccio dinner — About €25–45 a person, near the market. The night you do not hold Roscioli.",
          "The cover charge — A few euros on a €15–25 plate. It is normal. It is not a reason to pay piazza prices."
        ],
        [
          "La Pergola — A tasting menu, often €150 and up. One night.",
          "A Piazza Navona table — The photo menu. The same pasta costs less in Trastevere or Testaccio, about €15–25.",
          "Hotel breakfast at Hotel de Russie — The splurge morning. The bar is about €3–5.",
          "A golf-cart tour that ends at a restaurant — You paid for the cart and then the tourist menu. The Colosseum walk is €18 plus a €2 fee."
        ]
      ),
      doTiers: tiers(
        [
          "The Pantheon — About €5. Go in, then leave the square for lunch.",
          "Piazza Navona and the Trevi Fountain as a walk-through — €0 if you do not sit down to eat there.",
          "Trastevere at night — €0 beyond dinner, about €25–45 if you sit.",
          "A Metro ride — A couple of euros. A 72-hour pass is about €18 if you will ride often."
        ],
        [
          "The Colosseum, Forum, and Palatine — The standard ticket is €18 plus a €2 online fee. Give it the morning.",
          "The Vatican Museums — €20, or €25 online. A different day from the Colosseum.",
          "Borghese Gallery — A timed ticket, about €15, if you want a third art stop. Not the same afternoon as the Vatican.",
          "Testaccio market — Lunch about €10–20. The neighborhood hour."
        ],
        [
          "A full-experience Colosseum ticket — About €22–24 plus the fee. Buy it only if you want the extra areas. The standard ticket is €18.",
          "A golf-cart tour of the Forum — A fare for a site you can walk with the €18 ticket.",
          "Catacombs plus a food tour — Two paid add-ons. The Colosseum is €18 plus €2. The Vatican online ticket is €25. Pick one add-on.",
          "Three ticketed interiors in one day — The Colosseum alone is €18 plus a €2 fee. You will rush the rest. Split the days."
        ]
      ),
      walk: {
        lead: "Two adults, four nights in Trastevere or Prati. Bar breakfast, one trattoria, mostly walking, the Colosseum one day and the Vatican on another.",
        lines: [
          line("Room", "€960", "About €240 a night, four nights. Inside €170–320. At $1 ≈ €0.92 that is about $1,040, before the city hotel fee."),
          line("Food", "€320", "€40 a person, two people, four days. Inside €30–55. The cover charge is a few euros more."),
          line("Metro", "€15", "About €15 for two across four days if you walk the center. A 72-hour pass is about €18 a person if you ride more."),
          line("Tickets", "€90", "Colosseum standard about €20 times two, plus Vatican online at €25 times two.")
        ],
        day: "The Colosseum day is the room (€240) plus food for two (€80) plus a Metro ride (about €3) plus two standard tickets (€40): about €365.",
        tripLabel: "4-night trip",
        trip: "About €1,430 before flights, including a city hotel fee of about €6 a person per night for four nights, €48 (€960 lodging + €320 food + €15 Metro + €90 tickets + €48 fee). Lodging plus food is €1,280, inside the Quick facts sample of €900–1,750.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. The city fee varies by hotel class."
      },
      days: [
        day("The center on foot", [
          "Coffee at the bar, about €3–5. Walk to the Pantheon, about €5.",
          "Do not eat on Piazza Navona. A slice in Trastevere or Testaccio is about €5–8.",
          "Dinner where you slept, about €25–45."
        ]),
        day("The Colosseum", [
          "The standard ticket, €18 plus a €2 fee, for the morning.",
          "Lunch away from the tourist menus, about €15–25.",
          "The Vatican is not this afternoon."
        ]),
        day("The Vatican, or a smaller ticket", [
          "Vatican Museums, €25 online, on their own day.",
          "Or Borghese, about €15, and a Trastevere evening.",
          "No golf cart. The walk is the plan."
        ])
      ],
      book: [
        "The hotel in Trastevere or Prati. The city fee is extra, a few euros a person per night.",
        "The Colosseum timed ticket, €18 plus €2, or the fuller ticket at about €22–24 plus the fee.",
        "The Vatican Museums online, €25, on a different day.",
        "Roscioli or a trattoria only if that table is the dinner you want."
      ],
      hidden: [
        "The city hotel fee, a few euros a person per night, on top of the room.",
        "The cover charge on a restaurant bill.",
        "A photo-menu markup on Piazza Navona.",
        "A golf-cart tour of a site your ticket already includes.",
        "A second ruin ticket the same afternoon."
      ],
      skip: [
        skip("A golf-cart tour of the Forum", "The standard ticket is €18 plus a €2 fee, and you can walk."),
        skip("Dinner on Piazza Navona", "The same pasta is less in Trastevere or Testaccio, about €15–25 a person."),
        skip("The Colosseum and the Vatican in one afternoon", "Each is a half day. The Vatican online ticket is €25. Give them two mornings.")
      ],
      tips: [
        "Hidden gem: Coffee and a cornetto cost less if you stand at the bar, about €3–5. Sitting down is a different price.",
        "Hidden gem: The Colosseum standard ticket is €18 plus a €2 booking fee. Fuller tickets run about €22–24 plus the fee. Buy it on the official site.",
        "Hidden gem: The Vatican Museums are €20, or €25 if you book online. Do not put them on the Colosseum afternoon.",
        "The city hotel fee is a few euros a person per night and changes with the hotel class. It is not a second sales tax you should invent at 10%.",
        "Late January through March is not the holiday crowd. Move the date before you pay for a Colosseum view to feel closer."
      ],
      money: money(
        "About €170–320 a night for a mid hotel in Trastevere or the historic center. At roughly $1 ≈ €0.92, the Trip Finder shoulder band is about $180–340. The city hotel fee is extra.",
        "About €30–55 with a bar breakfast, a market lunch, and one trattoria. A cover charge is a few euros more.",
        "The Colosseum standard ticket is €18 plus a €2 booking fee. The Vatican Museums are €20, or €25 online. The Pantheon is about €5.",
        "Four mid-range nights run about €900–1,750 in lodging plus food for two, before flights (orientation)."
      )
    },

    tokyo: {
      hook: "Tokyo stays cheaper when the hotel sits above a train station and breakfast is a convenience-store rice ball. It gets expensive when the hotel buffet is in the rate and someone buys a national rail pass for a week that never leaves the city.",
      blurb: "Book APA Hotel or Toyoko Inn above a station in Shinjuku, or Mitsui Garden if you want the mid room. Convenience-store breakfast. One museum or teamLab. Skip the nationwide rail pass.",
      nights: "4–5 nights above one station",
      midrange: "Mitsui Garden or Hilton Tokyo, convenience-store breakfast, one dinner",
      months: "Late January through early March, and June if you accept rain for lower rooms.",
      startHere: "Book APA Hotel, Toyoko Inn, or Mitsui Garden above a train station in Shinjuku, Shibuya, or Ueno. Buy breakfast at the convenience store in the lobby. Stay in that neighborhood. A sushi counter only counts if you booked it before the flight. Do not buy a 7-day Japan Rail Pass for a Tokyo-only week. It is about ¥50,000 and it loses.",
      tipsKicker: "The rail pass is the wrong product for a city week.",
      cta: "Build the Tokyo Trip Plan from the station under the hotel. Add teamLab or a museum, not a national rail pass.",
      forWho: ["People who will sleep above a station and eat a convenience-store breakfast"],
      notFor: ["A Tokyo week that also tries to hold Kyoto and a sushi counter every night"],
      aroundKind: "transit",
      aroundRule: "You do not need a car. Buy a Suica or Pasmo card and tap it on the subway and trains. A Tokyo-only week does not need a Japan Rail Pass. The ordinary 7-day pass is about ¥50,000. Lodging quotes usually include sales tax. A small hotel tax is extra when the room is about ¥15,000 or more, often ¥200 a person per night.",
      aroundNoCar: [
        "Tap a Suica or Pasmo card, the stored-value card for the subway and trains. Four city days for two people in the worked example is about ¥4,000",
        "Shinjuku, Shibuya, Ueno, and Ginza are neighborhoods on the train, not a reason to change hotels every night",
        "Narita Airport is a train ride. A Narita hotel is only the night you land. Haneda is the closer airport if you can fly there"
      ],
      stayRule: "Pay for the station under the hotel. A business hotel such as APA is about ¥12,000–20,000. A mid hotel such as Mitsui Garden or the Hilton is about ¥25,000–45,000. The rail pass is not a lodging decision.",
      eatRule: "A convenience-store breakfast is about ¥500–800. Ramen or conveyor sushi is about ¥1,000–2,000. One izakaya is about ¥3,000–6,000 a person. The hotel buffet is the expensive breakfast.",
      doRule: "Senso-ji temple and a neighborhood walk are free. teamLab Planets in Toyosu is about ¥3,800. teamLab Borderless is a different ticket, about ¥3,200–4,000. Kyoto is a different trip.",
      zones: [
        zone("Shinjuku, above the station", "Book APA Hotel Shinjuku or Toyoko Inn. Rooms are about ¥10,000–20,000 a night. A convenience store is in or next to the lobby. Do not choose a capsule, such as Nine Hours at about ¥4,000–7,000, unless you packed very light."),
        zone("Ueno or Asakusa", "Book Toyoko Inn or Super Hotel in Ueno, about ¥9,000–18,000 a night. Senso-ji is the morning if you are in Asakusa. Do not choose Ueno and then taxi to Shibuya every night."),
        zone("Shibuya or Ginza", "Book Mitsui Garden in Shibuya or Ginza, about ¥25,000–40,000 a night. The subway is in the building. Do not choose it and also buy a ¥50,000 rail pass. You are not leaving the city."),
        zone("A Narita hotel, one night", "Book a Narita hotel only the night you land or fly. The train into Tokyo is the cost of that choice, a few thousand yen. Do not spend the week there, at a city-hotel rate of about ¥25,000–45,000, and ride in every morning.")
      ],
      stayTiers: tiers(
        [
          "APA Hotel Shinjuku — Above a station, about ¥12,000–20,000 a night. A convenience store is in the lobby.",
          "Toyoko Inn Shinjuku or Ueno — A business hotel, about ¥10,000–18,000 a night.",
          "Super Hotel Lohas Ikebukuro or Ueno — About ¥9,000–16,000 a night. The subway is nearby.",
          "Nine Hours Shinjuku — A capsule, about ¥4,000–7,000 a night, only if you can sleep in a tube. It is not a family room."
        ],
        [
          "Mitsui Garden Shibuya or Ginza — About ¥25,000–40,000 a night. You are paying for the neighborhood and the station, not for a national rail pass.",
          "Trunk Hotel or Sequence Miyashita Park — In Shibuya, about ¥30,000–50,000 a night. The mid room that is not a business-hotel clone.",
          "Hilton Tokyo — In Shinjuku, about ¥30,000–45,000 a night. The subway is downstairs.",
          "The Westin Tokyo — In Ebisu, about ¥28,000–42,000 a night. One train ride to dinner, not a new hotel."
        ],
        [
          "Park Hyatt Tokyo — In Shinjuku, often ¥80,000 and up. You still take the subway to dinner.",
          "Hoshinoya Tokyo — A traditional inn in the city, often ¥100,000 and up. Dinner can still be a train ride away.",
          "Aman Tokyo — In Otemachi, often ¥150,000 and up. The station is downstairs. The sushi counter is still extra.",
          "Conrad Tokyo — In Shiodome, often ¥70,000 and up. The bay view is the room. teamLab is still about ¥3,800."
        ]
      ),
      eatTiers: tiers(
        [
          "A convenience store — Rice balls and coffee, about ¥500–800. This is breakfast.",
          "A ramen shop — About ¥1,000–1,500. Lunch.",
          "Conveyor-belt sushi — About ¥1,500–3,000. Lunch or a cheap dinner.",
          "A beef bowl chain — About ¥500–900. A real meal, not a compromise you need to apologize for."
        ],
        [
          "A department-store food floor — Lunch about ¥1,500–3,000. The mid version of a picnic.",
          "An izakaya — About ¥3,000–6,000 a person. One reserved or walked-in dinner in the neighborhood you slept in.",
          "A coffee shop morning — About ¥800–1,500, once. The convenience store is the other mornings.",
          "Station food — About ¥1,000–2,000. Useful, and not a tourist menu."
        ],
        [
          "A sushi counter you booked before you flew — Often ¥15,000 and up a person. One night. The room or the counter, not both every night.",
          "A hotel breakfast buffet — Easy to pass ¥3,000. The convenience store is ¥500–800.",
          "A second tasting the next night — Leaves ¥2,500–6,000 a person. One splurge.",
          "A taxi to a restaurant the subway already reaches — Suica for this example is about ¥4,000 for two over four days. The taxi is the expensive way."
        ]
      ),
      doTiers: tiers(
        [
          "Senso-ji and the river in Asakusa — ¥0. A morning.",
          "Yanaka or Shimokitazawa — ¥0. A neighborhood walk on the train.",
          "A convenience-store picnic in a park — About ¥500–800.",
          "The subway — Tap Suica. A city ride is a few hundred yen, not a ¥50,000 pass."
        ],
        [
          "teamLab Planets in Toyosu — About ¥3,800. Borderless is a different ticket, often ¥3,200–4,000. Pick one.",
          "A museum or an observation deck — Often ¥2,000–3,000. One, not three.",
          "Shibuya or Shinjuku at night — ¥0 beyond the train and dinner.",
          "Kamakura or Nikko — A day trip with its own train fare. Only if you want to leave the city. It is not a reason to buy the ¥50,000 rail pass."
        ],
        [
          "A 7-day rail pass — About ¥50,000. It loses on a Tokyo-only week.",
          "Kyoto — A different trip, with its own hotel night at about ¥25,000–45,000. Do not staple it onto four Tokyo nights.",
          "teamLab plus a tower plus a second museum — Planets alone is about ¥3,800. Three tickets is too many. One is enough.",
          "A Narita hotel for the whole stay — You will pay the airport train every morning. Sleep in the city, about ¥25,000–45,000 a night."
        ]
      ),
      walk: {
        lead: "Two adults, four nights at Mitsui Garden or the Hilton, above a station. Convenience-store breakfast, one izakaya, a Suica card, and teamLab Planets. No rail pass.",
        lines: [
          line("Room", "¥152,000", "About ¥38,000 a night, four nights. Inside ¥30,000–45,000. At about ¥150 to $1, that is about $1,010, before the small hotel tax."),
          line("Food", "¥32,000", "About ¥4,000 a person, two people, four days. Inside ¥2,500–6,000."),
          line("Suica", "¥4,000", "Train taps for two over four city days. A rail pass at about ¥50,000 each is the wrong product."),
          line("teamLab", "¥7,600", "Planets at about ¥3,800 times two.")
        ],
        day: "The teamLab day is the room (¥38,000) plus food for two (¥8,000) plus Suica (about ¥800) plus two tickets (¥7,600): about ¥54,400.",
        tripLabel: "4-night trip",
        trip: "About ¥196,000 before flights (¥152,000 lodging + ¥32,000 food + ¥4,000 trains + ¥7,600 tickets). If the room is ¥15,000 or more, the hotel tax is often ¥200 a person per night, about ¥1,600 here. Lodging plus food is ¥184,000, inside the Quick facts sample of ¥140,000–230,000.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The neighborhood", [
          "Convenience-store breakfast, about ¥500–800.",
          "A walk in Shinjuku, Shibuya, or Asakusa, depending on the hotel. ¥0 beyond the train.",
          "Ramen or conveyor sushi, about ¥1,000–2,000."
        ]),
        day("One ticket", [
          "teamLab Planets, about ¥3,800, or one museum. Not both plus a tower.",
          "The other meal is the department-store food floor, about ¥1,500–3,000.",
          "Back to the same station hotel."
        ]),
        day("Dinner you booked, or the izakaya", [
          "A sushi counter only with a reservation, often ¥15,000 and up. Otherwise an izakaya at ¥3,000–6,000.",
          "No rail pass. Suica is the card.",
          "Kyoto is not this afternoon."
        ])
      ],
      book: [
        "The station hotel. A business hotel is about ¥10,000–20,000. A mid hotel is about ¥25,000–45,000.",
        "teamLab Planets, about ¥3,800, or Borderless, often ¥3,200–4,000. One of them.",
        "A sushi counter before you fly, if that dinner is the point.",
        "Nothing that is a 7-day rail pass, about ¥50,000, unless you are actually leaving Tokyo for several days."
      ],
      hidden: [
        "The small hotel tax, often ¥200 a person per night when the room is about ¥15,000 or more.",
        "A ¥50,000 rail pass on a city week.",
        "A hotel breakfast buffet on top of a convenience store you walked past.",
        "A Narita hotel used as the base.",
        "A second teamLab ticket."
      ],
      skip: [
        skip("A 7-day Japan Rail Pass for Tokyo only", "It is about ¥50,000. Suica taps for this example are about ¥4,000 for two people."),
        skip("Kyoto as an afternoon", "It is a different city and a different hotel night."),
        skip("A capsule if you wanted a real room", "Nine Hours is about ¥4,000–7,000. APA is about ¥12,000–20,000 and has a bed you can sit up in.")
      ],
      tips: [
        "Hidden gem: teamLab Planets in Toyosu is about ¥3,800. Borderless is a different museum, often ¥3,200–4,000. Buy one.",
        "Hidden gem: A 7-day rail pass is about ¥50,000 and loses if you stay in Tokyo. Tap a Suica card instead.",
        "Hidden gem: Convenience-store breakfast is about ¥500–800. The hotel buffet is the expensive morning.",
        "Sales tax is usually inside the advertised rate. The small hotel tax is extra on higher rooms, often ¥200 a person per night.",
        "A Narita hotel is the night you land. The city hotel is the rest of the stay."
      ],
      money: money(
        "About ¥30,000–45,000 a night for a mid hotel such as Mitsui Garden or the Hilton, above a station. At roughly ¥150 to $1, the Trip Finder shoulder band is about $200–290. A small hotel tax can be extra.",
        "About ¥2,500–6,000 with a convenience-store breakfast, ramen or conveyor sushi, and one izakaya.",
        "teamLab Planets is about ¥3,800. A 7-day rail pass is about ¥50,000 and is the wrong buy for a Tokyo-only week.",
        "Four mid-range nights run about ¥140,000–230,000 in lodging plus food for two, before flights (orientation)."
      )
    }
,

    cancun: {
      hook: "A Hotel Zone all-inclusive already includes the beach and the meals. The week gets expensive when the airport van was left out of the rate, or when a timeshare desk takes the morning you paid to spend on the sand.",
      blurb: "Book Riu, Hyatt Ziva, or Moon Palace in the Hotel Zone and confirm the airport van is in the rate. Eat at the hotel. One outing: Isla Mujeres or a cenote, not both.",
      nights: "5–7 nights on one resort",
      midrange: "Hyatt Ziva or Moon Palace, meals included, van in the rate",
      months: "Early May, late September, and early October.",
      startHere: "Book Riu, Hyatt Ziva, or Moon Palace in the Cancún Hotel Zone and confirm the airport van is inside the rate before you compare two resorts. Eat at the hotel the night you land. Pick one outing, the Ultramar ferry to Isla Mujeres or one cenote, and leave Chichén Itzá for its own booked day.",
      tipsKicker: "Confirm the airport van is inside the resort rate.",
      cta: "Build the Cancún Trip Plan with the airport van inside the rate. Add one outing, not a timeshare morning.",
      forWho: ["People who will stay on one Hotel Zone resort and eat the meals they already paid for"],
      notFor: ["A week that also tries to hold Isla Mujeres, a cenote, and Chichén Itzá"],
      aroundKind: "fork",
      aroundRule: "The resort is the hotel and the beach. You do not need a rental car for the sand in front of the tower. The Hotel Zone bus, called the R-1, is about $1 a person if you want a different stretch of the same zone. A shared airport van that was left out of the quote is about $20 a person.",
      aroundNoCar: [
        "Use the airport van that is already in the Hyatt Ziva, Moon Palace, or Riu rate. A missing shared van is about $20 a person",
        "The Hotel Zone bus (R-1) is about $1 a person a ride if you hop the zone. Most all-inclusive weeks never need it",
        "Cancún airport is close to the Hotel Zone. A downtown hotel means a ride to the beach"
      ],
      aroundCar: [
        "A rental, about $40–70 a day, makes sense only on a ruin day you already chose, then it sits under the tower",
        "Do not rent a car to reach a beach the hotel already faces",
        "Rosewood Mayakoba and Nizuc are south of the Hotel Zone. They use a different airport ride, not the R-1"
      ],
      stayRule: "Pay for a Hotel Zone all-inclusive with the airport van inside the rate. A garden room at Riu is about $150–250 a night for two. Hyatt Ziva is about $250–400. A swim-up upgrade at the desk is a different room.",
      eatRule: "On an all-inclusive, the buffet and the casual restaurants are what the rate bought. A downtown taco dinner at Parque de las Palapas is about $8–15 a person, plus the ride. A dock bottle of water is about $3–5 for something the buffet already has.",
      doRule: "The beach in front of the resort is included. The Ultramar ferry to Isla Mujeres is about $25 round trip a person. A cenote is about $10–30 a person. Chichén Itzá is a full booked day, about $90–140 a person, and it does not share a day with the ferry.",
      zones: [
        zone("Hotel Zone, a garden all-inclusive", "Book Riu Cancún, Riu Palace Peninsula, or a similar Hotel Zone hotel, in a garden room. About $150–250 a night for two, meals included, quoted in US dollars. You get the beach in front of the hotel and the buffet. You do not get an ocean-view or swim-up room at that rate. Do not choose it if you wanted to eat in downtown Cancún every night. Those meals are a separate bill."),
        zone("Hyatt Ziva or Moon Palace", "Book Hyatt Ziva Cancún or Moon Palace when the airport van is inside the rate. Ziva is about $250–400 a night for two, meals included. Moon Palace or Hard Rock Cancún is about $220–360. You get a family resort and the beach. You do not get a free van if the quote left it out. Do not choose the higher rate if a Riu quote already includes the van and you will not use the extra restaurants."),
        zone("A hotel that does not include meals", "Book the Marriott Cancun, about $200–330 a night, if you want the Hotel Zone and will pay for food yourself. A mainland room such as Hampton Inn Cancun Cumbres is about $80–140, and you still pay for every meal and a ride to the sand. Do not choose either one if you compared the price with an all-inclusive and forgot to add dinner."),
        zone("Adults-only, or south of the Zone", "Book Le Blanc, about $500–900 a night, or Hyatt Zilara, about $400–700, if you want adults-only and will eat on the property. Rosewood Mayakoba and Nizuc start around $700 and sit south of the Hotel Zone. Do not choose those southern hotels if you wanted the Hotel Zone bus. The airport ride is different.")
      ],
      stayTiers: tiers(
        [
          "Riu Cancún or Riu Palace Peninsula — Hotel Zone all-inclusive, about $150–250 a night for two in a garden room. A swim-up room is a different rate.",
          "Holiday Inn Resort Cancún — About $140–230 a night, meals included. Eat at the hotel the night you land.",
          "Oasis or Krystal Grand — About $130–220 a night. The rate you compared is rarely the swim-up the desk offers later.",
          "Hampton Inn by Hilton Cancun Cumbres — On the mainland, about $80–140 a night. Only if you will pay for meals and a ride to the beach."
        ],
        [
          "Hyatt Ziva Cancún — About $250–400 a night for two, family all-inclusive. Confirm the airport van is inside that number.",
          "Moon Palace or Hard Rock Cancún — About $220–360 a night. The van is the line that makes two quotes comparable.",
          "Live Aqua or Secrets The Vine — Adults-only in the Hotel Zone, about $220–360 a night, if there are no kids. Confirm the van.",
          "Marriott Cancun Resort — Not all-inclusive, about $200–330 a night. Food is extra. That is a different budget from Riu."
        ],
        [
          "Le Blanc Spa Resort — Adults-only, about $500–900 a night. The restaurants in the rate are why the room costs that much.",
          "Hyatt Zilara Cancún — Adults-only Hotel Zone, about $400–700 a night. You still eat on the property.",
          "JW Marriott Cancun — About $350–600 a night, and meals are not all in the rate.",
          "Rosewood Mayakoba or Nizuc — South of the Hotel Zone, from about $700 a night, with a different airport ride."
        ]
      ),
      eatTiers: tiers(
        [
          "The resort buffet — $0 extra on an all-inclusive. Use it the night you land.",
          "A casual restaurant on the property — Usually $0 extra at an all-inclusive. Check whether it needs a reservation.",
          "Coffee in the rate — A dock bottle of water is about $3–5 for something the buffet already has.",
          "Parque de las Palapas — Downtown tacos, about $8–15 a person, only if the ride there is cheap."
        ],
        [
          "A better restaurant inside Hyatt Ziva or Moon Palace — $0 extra. That is the mid upgrade, not a second hotel.",
          "La Habichuela — One downtown dinner, about $40–80 a person, if you leave the resort.",
          "A Hotel Zone steakhouse off the property — About $50–90 a person. One night, not the week.",
          "A beach-club lunch away from the resort — A day price, about $30 and up, not a snack."
        ],
        [
          "Le Blanc’s restaurants — $0 extra inside a rate of about $500–900 a night. That dinner is what the room bought.",
          "A Puerto Morelos dinner — About $40–80 a person, and a different ride from the Hotel Zone.",
          "A packed lunch from the buffet on a cenote day — $0 extra. The dock kiosk is the leak.",
          "A second dinner off the property — Another $60–100, on a week the rate already included dinner."
        ]
      ),
      doTiers: tiers(
        [
          "The beach in front of the Hotel Zone tower — $0 beyond the nightly rate.",
          "The Hotel Zone bus (R-1) — About $1 a person a ride, if you want a different stretch of the same zone.",
          "A pool day at the resort — $0 beyond the room.",
          "Sunset from the resort — $0. A catamaran is a different purchase."
        ],
        [
          "Ultramar ferry from Puerto Juárez to Isla Mujeres — About $25 round trip a person. The public ferry, not a Hotel Zone lunch cruise.",
          "One cenote — About $10–30 a person, on a day that is not also the ferry.",
          "Visitax — About $15 a person, paid once, including the step at Cancún airport.",
          "The Hotel Zone environmental fee — About $4 a room per night, separate from the buffet."
        ],
        [
          "A shared Chichén Itzá day — About $90–140 a person. It does not share a day with Isla Mujeres.",
          "A Hotel Zone catamaran — About $70–120 a person, for a crossing the ferry already sells at about $25.",
          "A rental car under the tower — About $40–70 a day, for a beach you can see from the room.",
          "A timeshare breakfast — A presentation. It is not the airport van, which is about $20 a person if the quote left the van out."
        ]
      ),
      walk: {
        lead: "Two adults, five nights at Hyatt Ziva or Moon Palace, meals in the rate, the airport van already inside the quote, one Ultramar day, and the Hotel Zone bus if you hop the zone.",
        lines: [
          line("Room", "$1,300", "About $260 a night, five nights, for two, meals included. Inside the $200–330 Hotel Zone band."),
          line("Food", "$0", "No extra if you stay on the property. A Palapas taco run is about $15–30 a person if you leave."),
          line("Bus and van", "$1", "Hotel Zone bus hops are about $1 a person. This example assumes the airport van is already inside the rate. A missing shared van is about $20 a person."),
          line("Fees and ferry", "$100", "Visitax $15 times two is $30. The environmental fee is about $4 times five nights, $20. Ultramar is about $25 times two, $50.")
        ],
        day: "A beach day is the room ($260) with food included. The Isla Mujeres day adds about $50 for two ferry tickets.",
        tripLabel: "5-night stay",
        trip: "About $1,400 before cash tips and flights ($1,300 rate + $30 Visitax + $20 environmental fee + $50 ferry). The Quick facts sample of $1,000–1,650 is the quoted rate before tips, Visitax, and a van that is missing. Cash tips are about $5–10 a person per day on top.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("Land, van, buffet", [
          "The van was in the Hyatt Ziva, Moon Palace, or Riu rate. Confirm that before you leave the airport.",
          "A garden room, not a swim-up upgrade at the desk.",
          "Dinner on the property. $0 extra."
        ]),
        day("The beach, or one outing", [
          "The beach in front of the resort.",
          "The Ultramar ferry, about $25 round trip, or one cenote at about $10–30. One of them.",
          "Not a timeshare presentation."
        ]),
        day("The sand, or Chichén Itzá", [
          "The Hotel Zone bus, about $1, if you want a different stretch of the zone.",
          "Chichén Itzá only as a booked full day, about $90–140 a person.",
          "The Isla Mujeres ferry does not also fit that day."
        ])
      ],
      book: [
        "The airport van inside the Hyatt Ziva, Moon Palace, or Riu rate. A missing shared van is about $20 a person.",
        "The Ultramar ferry, about $25 round trip, or one cenote at about $10–30. Pick one.",
        "A shared Chichén Itzá day, about $90–140 a person, only if that is the long day.",
        "The cancellation rule in hurricane season, before you send the deposit."
      ],
      hidden: [
        "Visitax, about $15 a person, at Cancún airport.",
        "The Hotel Zone environmental fee, about $4 a room per night.",
        "A shared airport van at about $20 a person, or a private van at about $70–120, if the quote left it out.",
        "Cash tips, about $5–10 a person per day, and a dock bottle of water at about $3–5.",
        "A rental at about $40–70 a day for a beach the Hotel Zone bus reaches for about $1."
      ],
      skip: [
        skip("A timeshare morning", "It takes the beach day you already paid for. It is not a free excursion."),
        skip("A rental car on an all-inclusive week", "You will park it under the tower. The beach is in front of the hotel."),
        skip("Isla Mujeres, a cenote, and Chichén Itzá", "Three outings. The ferry is about $25. Chichén is a full day at about $90–140. Pick one.")
      ],
      tips: [
        "Hidden gem: If the airport van is not in the rate, the cheaper all-inclusive is not cheaper. A missing shared van is about $20 a person.",
        "Hidden gem: The garden room is the rate you compared. A swim-up upgrade at the desk is a different room.",
        "Hidden gem: The Hotel Zone bus (R-1) is about $1 a person. A rental is for a ruin day, not for Tuesday’s beach.",
        "Cash tips are about $5–10 a person per day on top of a week you already paid.",
        "Chichén Itzá does not share a day with the Isla Mujeres ferry."
      ],
      money: money(
        "About $200–330 a night in the Hotel Zone for a mid all-inclusive, quoted in US dollars, meals included when the hotel is all-inclusive. The airport van has to be inside that quote.",
        "Included if you stay on the property. A downtown meal is about $8–15 a person, plus the ride. Cash tips are about $5–10 a person per day.",
        "Visitax is about $15 a person. The Ultramar ferry to Isla Mujeres is about $25 round trip. The Hotel Zone environmental fee is about $4 a room per night.",
        "Five nights run about $1,000–1,650 for two at the quoted rate, before tips, Visitax, and a missing van (orientation)."
      )
    },

    oahu: {
      hook: "Waikiki stays cheaper when the hotel is one block back from the beach and breakfast is a plate lunch. It gets expensive when a rental car sits in a garage at about $40–55 a night and the hotel restaurant replaces Rainbow Drive-In.",
      blurb: "Book The Equus or the Outrigger in Waikiki, one block back or on the beach walk. Plate lunch. One reserved outing: Hanauma Bay or Pearl Harbor, not both.",
      nights: "5 nights in Waikiki",
      midrange: "Outrigger Waikiki, plate lunch, one reserved outing",
      months: "May, and September through early October.",
      startHere: "Book The Equus, the Holiday Inn Express, or the Outrigger in Waikiki. Eat at Rainbow Drive-In or L&L, or grocery the kitchenette. Pick one reserved outing, Hanauma Bay or Pearl Harbor, and leave the rental car until the morning you actually leave Waikiki.",
      tipsKicker: "Leave the rental until the day you leave Waikiki.",
      cta: "Build the Oahu Trip Plan from a Waikiki hotel one block back. Add the bus. Add a car only on the day you leave Waikiki.",
      forWho: ["People who will sleep in Waikiki and ride the bus until they have a reason to drive"],
      notFor: ["A Waikiki week that also tries to hold a car in a garage and a flight to Maui"],
      aroundKind: "fork",
      aroundRule: "In Waikiki you do not need a car to reach the beach. TheBus, with a HOLO card, is $3 a ride and the day cap is about $7.50. A rental becomes the right tool on the day you drive to Hanauma Bay or the North Shore. Parking it in Waikiki the other nights is about $40–55 a night.",
      aroundNoCar: [
        "Walk from The Equus, the Shoreline, or the Outrigger to the beach. The sand does not need a car",
        "TheBus with a HOLO card is $3 a ride. The day cap is about $7.50. Cash is also $3 and does not include the transfer window",
        "Pearl Harbor is a timed entry you can reach without owning a car for the whole week"
      ],
      aroundCar: [
        "Rent for the Hanauma Bay day or a North Shore day, then return the car. A Waikiki garage is about $40–55 a night if you keep it",
        "Kahala and Four Seasons Ko Olina assume a car. If the bed is there, plan the drive",
        "A neighbor-island flight is a second ticket, about $80–150 one way. Five Oahu nights do not contain Maui"
      ],
      stayRule: "Pay for a walk to the beach. The Equus, one block back, is about $160–250 a night before Hawaii’s 17.75% lodging tax. The Outrigger, on the beach walk, is about $310–420. Kahala and Ko Olina assume a car.",
      eatRule: "Rainbow Drive-In or L&L is about $12–18. Grocery breakfast from a kitchenette is about $8–12 a person. A resort breakfast is about $25–40 a person for a view you can sit under with a plate lunch.",
      doRule: "The Waikiki beach in front of the hotel is free. Hanauma Bay is about $25 for visitors who do not live in Hawaii, plus parking about $3, and it needs a reservation. The USS Arizona memorial is timed and free. The Missouri is a separate ticket, about $30.",
      zones: [
        zone("Waikiki, one block back", "Book The Equus, the Holiday Inn Express Waikiki, or the Shoreline Hotel. Rooms are about $160–280 a night before Hawaii’s 17.75% lodging tax. You walk to the same beach. You do not get a room on the sand. Do not choose this if you wanted the hotel door to open onto the beach. That is the Outrigger or the Hilton."),
        zone("On Waikiki beach", "Book the Outrigger Waikiki or Hilton Hawaiian Village. Rooms are about $280–420 a night before the 17.75% tax. You get the beach walk and the bus still works. Do not choose it if a room one block back, about $160–280, reaches the same sand and you will not use the hotel’s beach setup."),
        zone("Halekulani or the Royal Hawaiian", "Book Halekulani, about $600–1,100 a night, or the Royal Hawaiian, about $450–800, if the hotel itself is the treat. You can still walk to the beach and ride the bus. Do not choose it if the room rate was the cost you were trying to cut. The beach is the same one."),
        zone("Kahala or Ko Olina", "Book the Kahala, about $700–1,200, or Four Seasons Ko Olina, from about $800, only if you will drive. Aulani, on the west side, is the same decision. You get a quieter beach. You do not get a Waikiki bus week. Do not choose these if you wanted to leave the car at the airport.")
      ],
      stayTiers: tiers(
        [
          "The Equus — On Kuhio, one block back from Waikiki beach, about $160–250 a night before Hawaii’s 17.75% lodging tax. A kitchenette beats a resort breakfast.",
          "Holiday Inn Express Waikiki — One block back, about $180–280 a night before tax. The same beach.",
          "Hampton Inn & Suites Honolulu/Waikiki — About $190–300 a night before tax. You walk to the sand.",
          "Shoreline Hotel Waikiki — About $180–280 a night before tax. This grid does not need a car."
        ],
        [
          "Outrigger Waikiki Beach Resort — On the beach walk, about $310–420 a night before the 17.75% tax.",
          "Reef Waikiki — The same beach walk and the same $310–420 band before tax. Book one of them.",
          "Hilton Hawaiian Village — A large campus and a lagoon, about $280–400 a night before tax. The bus still works.",
          "The Laylow or 'Alohilani — A Waikiki 4-star, about $300–430 a night before tax. You still do not need a car for the beach."
        ],
        [
          "Halekulani — About $600–1,100 a night before tax. The room is the treat. Breakfast is still extra.",
          "The Royal Hawaiian — About $450–800 a night before tax. You can still walk the beach.",
          "The Kahala Hotel & Resort — East of Waikiki, about $700–1,200 a night. This one assumes a car.",
          "Four Seasons Resort Oahu at Ko Olina — The west side, from about $800 a night. Aulani is the same side of the island. Waikiki did not require that drive."
        ]
      ),
      eatTiers: tiers(
        [
          "Rainbow Drive-In — A plate lunch, about $14–18. This is the meal.",
          "L&L Hawaiian Barbecue — About $12–16. The same kind of plate, on a different corner.",
          "A grocery run for the kitchenette — Breakfast about $8–12 a person.",
          "Leonard’s Bakery — A malasada is about $2. It is a snack, not dinner."
        ],
        [
          "Marukame Udon — About $12–18. A counter meal, not a resort restaurant.",
          "Helena's Hawaiian Food — About $20–35 a person, a bus ride from the beach.",
          "A poke bowl — About $15–20. Not a nightly restaurant on the beach walk.",
          "Grocery breakfast the next morning — About $10, after the one dinner out."
        ],
        [
          "A Halekulani dinner — One reservation, about $100 and up a person, then grocery breakfast.",
          "Alan Wong’s or Senia — About $80–150 a person. One night.",
          "A resort breakfast — About $25–40 a person, for a view you can eat under with a $15 plate lunch.",
          "A second fish dinner at $80 and up the next night. One is the treat."
        ]
      ),
      doTiers: tiers(
        [
          "Waikiki beach in front of the hotel — $0.",
          "A walk along the beach — $0. You do not need a tour for this.",
          "TheBus with a HOLO card — $3 a ride. The day cap is about $7.50.",
          "Diamond Head — About $5 a person if you reserved it, plus parking if you drove."
        ],
        [
          "Hanauma Bay — About $25 if you do not live in Hawaii, parking about $3, and a reservation is required. This is the day the car earns its place.",
          "The USS Arizona memorial — Timed, and $0. The Missouri is the paid ship, about $30.",
          "A North Shore afternoon on the bus — The day cap is about $7.50. It is not a walk from Kuhio.",
          "Waikiki parking for a rental — About $40–55 a night, whether or not the car moved."
        ],
        [
          "Hanauma Bay and the Missouri in one week — About $25 plus about $30. Two timed tickets. Pick one. The Arizona memorial is $0.",
          "A flight to another Hawaiian island — About $80–150 one way. Five Oahu nights do not contain Maui.",
          "A catamaran off Waikiki — About $40–70 a person. The beach was already in the room.",
          "A rental from the airport on a Waikiki-only week — The garage is about $40–55 a night."
        ]
      ),
      walk: {
        lead: "Two adults, five nights at the Outrigger or a Kuhio room with a kitchen, plate lunches, two days on the bus, and Hanauma Bay. No rental in this example.",
        lines: [
          line("Room", "$1,700", "About $340 a night, five nights, before Hawaii’s 17.75% lodging tax. Inside $310–380."),
          line("Food", "$600", "About $60 a person, two people, five days. Inside $45–75, with a plate lunch or grocery and one dinner."),
          line("Bus", "$30", "Two days at the HOLO day cap, about $7.50 times two people times two days. A cash fare does not include the transfer window."),
          line("Hanauma", "$53", "About $25 times two, plus about $3 parking. The Arizona memorial, if you chose it instead, is free.")
        ],
        day: "The bay day is the room ($340) plus food for two ($120) plus the bus cap for two ($15) plus Hanauma ($53): about $530 before tax.",
        tripLabel: "5-night stay",
        trip: "About $2,380 before the 17.75% lodging tax and flights ($1,700 + $600 + $30 + $53). Lodging plus food is $2,300, inside the Quick facts sample of $2,000–2,700. A rental in a Waikiki garage would add about $40–55 a night.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The beach in front", [
          "Rainbow Drive-In or a grocery breakfast, about $8–18.",
          "Waikiki beach. No car. $0.",
          "Dinner at Helena's, about $20–35, or back to the grocery."
        ]),
        day("One reserved outing", [
          "Hanauma Bay if you reserved it, about $25, or Pearl Harbor if that is the timed ticket. The Arizona memorial is $0.",
          "The bus, or a car you rented for this day only.",
          "Not both tickets."
        ]),
        day("The North Shore, or stay put", [
          "The North Shore only if the car is already out.",
          "Otherwise another Waikiki beach day, and Leonard’s once, about $2.",
          "No flight to another island inside this week."
        ])
      ],
      book: [
        "A Waikiki room you can walk from. One block back is about $160–280 before the 17.75% tax. The Outrigger is about $310–420.",
        "A Hanauma Bay reservation if that is the bay day. Visitor entry is about $25.",
        "Pearl Harbor timed entry if that is the morning. The Arizona memorial is free. The Missouri is about $30.",
        "A HOLO card. The ride is $3 and the day cap is about $7.50."
      ],
      hidden: [
        "Hawaii lodging tax, about 17.75%, on a pre-tax quote.",
        "Rental parking in Waikiki, about $40–55 a night.",
        "A resort breakfast at about $25–40 a person, against a plate lunch at about $14–18.",
        "Hanauma at about $25 and the Missouri at about $30. They are not one ticket. The Arizona memorial is free.",
        "A flight to another island, about $80–150 one way, sold as an afternoon."
      ],
      skip: [
        skip("A car that never leaves Waikiki", "You are paying about $40–55 a night to park it. The beach is a walk."),
        skip("Resort breakfast every morning", "Rainbow Drive-In and L&L are about $12–18. The resort café is about $25–40 for the same beach."),
        skip("Hanauma, Pearl Harbor, and a flight to Maui", "One timed outing. Maui is a different ticket, about $80–150 one way.")
      ],
      tips: [
        "Hidden gem: Leave the rental until the day you drive to Hanauma Bay or the North Shore. Parking it in Waikiki the other nights is about $40–55.",
        "Hidden gem: The Arizona memorial is timed and free. The Missouri is a separate ticket, about $30. Hanauma Bay is about $25 and needs a reservation.",
        "Hidden gem: A HOLO card on TheBus is $3 a ride, with a day cap near $7.50. A Waikiki week that stays on the beach can skip the car.",
        "Kahala and Ko Olina assume a car. If the bed is there, plan the drive.",
        "A Halekulani dinner is one night. The breakfast buffet is not the daily plan."
      ],
      money: money(
        "About $310–380 a night before Hawaii’s 17.75% lodging tax, for a Waikiki hotel on the beach walk or one block back. Parking a rental is about $40–55 a night extra.",
        "About $45–75 with a plate lunch or grocery breakfast and one dinner out.",
        "Hanauma Bay is about $25 for non-residents, plus parking about $3, and it needs a reservation. The USS Arizona memorial is free. The Missouri is about $30.",
        "Five nights run about $2,000–2,700 in lodging plus food for two, before flights and the 17.75% tax (orientation)."
      )
    },

    maui: {
      hook: "A Kihei condo with a kitchen already includes the beach in front of it. The expensive week treats the Road to Hana, a Haleakalā sunrise, and a Molokini boat as if they were the same morning.",
      blurb: "Book a Kihei condo with a kitchen, such as Aston Maui Kamaole or Kohea Kai. Grocery the first hour. One big morning: Hana, Haleakalā, or a Molokini boat.",
      nights: "5 nights on one coast",
      midrange: "Kihei condo with a kitchen, or Sheraton Maui if you want the Kaanapali path",
      months: "May, and September through early October.",
      startHere: "Book a Kihei condo with a kitchen, such as Aston Maui Kamaole or Kohea Kai, or the Sheraton if you want the Kaanapali beach path. Grocery the first hour after the Kahului airport. Pick one big morning: the Road to Hana, a Haleakalā sunrise, or a Molokini boat.",
      tipsKicker: "Cook in the condo, and pick one big morning.",
      cta: "Build the Maui Trip Plan from one coast and a kitchen. Add one outing, not Hana plus a summit plus a boat.",
      forWho: ["People who will sleep on one coast and cook most dinners in the condo"],
      notFor: ["A short week that tries to hold Hana, Haleakalā, and a Molokini boat"],
      aroundKind: "fork",
      aroundRule: "Most weeks need a car once you leave the beach in front of the condo. Kihei to Kaanapali is a drive. A compact rental in this example is about $70 a day before airport fees. You can skip the car only if you booked a walk-to-beach condo and will not leave that path.",
      aroundNoCar: [
        "The beach in front of a Kihei condo or a Kaanapali hotel does not need a car that day",
        "A food truck in Kihei or Paia is a short hop, not a reason to change hotels",
        "Mama’s Fish House is one dinner reservation. It does not require a second hotel"
      ],
      aroundCar: [
        "A compact rental is about $60–90 a day before airport fees. This example uses about $70",
        "Haleakalā and the Road to Hana are drives. They are not the same morning",
        "Kaanapali and Wailea add parking, about $25–40 a night, on top of a resort fee near $40"
      ],
      stayRule: "Pay for a kitchen if you will cook. A Kihei condo such as Aston Maui Kamaole is about $250–400 a night before Hawaii’s 17.75% lodging tax. The Sheraton or the Westin on Kaanapali is about $400–650, plus a resort fee and parking. Grand Wailea is the splurge room, still on one coast.",
      eatRule: "Grocery breakfast is about $8–12 a person. A Kihei food truck is about $14–20. Mama’s Fish House is about $80–150 a person, one reservation. A resort breakfast buffet is about $30–50 a person, which is why the kitchen was the point.",
      doRule: "The beach in front of the condo is the first day. Haleakalā National Park is $30 a vehicle, plus a $1 sunrise reservation on Recreation.gov, required from 3 a.m. to 7 a.m. A Molokini boat is about $150–200 a person. The Road to Hana is a different morning.",
      zones: [
        zone("A Kihei condo with a kitchen", "Book Aston Maui Kamaole, Kohea Kai, or the Maui Coast Hotel in Kihei. Rooms are about $200–400 a night before Hawaii’s 17.75% lodging tax. You get a kitchen and a beach you can walk to. You do not get a resort path. Do not choose it if you will not cook and will buy a resort breakfast at about $30–50 a person."),
        zone("Kaanapali, on the beach path", "Book the Sheraton Maui, the Westin Maui, or Honua Kai. Rooms are about $400–650 a night before tax, plus a resort fee near $40 and parking about $25–40. You get the beach path. Do not choose it over a Kihei kitchen if you will cook and the lower rate still reaches a beach."),
        zone("Wailea", "Book Grand Wailea, about $700–1,200 a night before tax, plus a resort fee, or Andaz or the Four Seasons if the room is the treat. You get Wailea beach. You do not get every boat in the rate. Do not add a Molokini trip, about $150–200 a person, on top of this room unless that boat is the day."),
        zone("Kahului, the night you land", "Book the Holiday Inn Express Kahului, about $180–260 a night, only the night you land or fly. You get a bed near the airport. You do not get the beach. Do not spend the week there and drive to the sand every morning.")
      ],
      stayTiers: tiers(
        [
          "Aston Maui Kamaole — A South Kihei condo with a kitchen, about $250–400 a night before Hawaii’s 17.75% lodging tax. The kitchen is why this stays cheaper.",
          "Kohea Kai — South Kihei, about $220–360 a night before tax. Cook.",
          "Maui Coast Hotel — Kihei, about $200–320 a night before tax. A food truck is a walk. Grocery the first hour.",
          "Holiday Inn Express Kahului — About $180–260 a night, the bed the night you land, not the week."
        ],
        [
          "Honua Kai — A Kaanapali condo with a kitchen, about $400–600 a night. Add the resort fee before you compare it with Kihei.",
          "Sheraton Maui — The Kaanapali beach path, about $450–650 a night, before a resort fee near $40 and parking about $25–40.",
          "The Westin Maui — The same beach and the same fees, about $400–650 a night.",
          "Hyatt Regency Maui — A larger campus on that beach, about $400–600 a night, same fees."
        ],
        [
          "Grand Wailea — Wailea, about $700–1,200 a night, plus a resort fee. The room is the treat.",
          "Andaz Maui — About $800–1,400 a night. Do not also buy every boat.",
          "Four Seasons Resort Maui — From about $1,000 a night. Still one coast.",
          "Hotel Wailea — Adults-only, above Wailea, about $800 and up a night before tax. You still drive to dinner. The Ritz-Carlton Kapalua, about $600–1,000, is a different drive, not Kihei."
        ]
      ),
      eatTiers: tiers(
        [
          "Foodland, or the first market after the airport — Breakfast from the kitchen, about $8–12 a person.",
          "A Kihei food truck — Lunch about $14–20.",
          "A Paia food truck on the way back from Hana — About $12–18. Not a reason to change hotels.",
          "Two cooked dinners in the condo — The grocery bag, about $15–25 a person for the night."
        ],
        [
          "Paia Fish Market — About $18–30. One fish plate.",
          "Monkeypod Kitchen — About $25–45 a person, and only if you are already in Wailea.",
          "A plate lunch — About $14–18, on the days the kitchen is off.",
          "One café breakfast out — About $15, then back to the kitchen."
        ],
        [
          "Mama’s Fish House — About $80–150 a person. Book it. It is not the same night as Spago.",
          "Spago at the Four Seasons, or Morimoto Maui — About $100 and up a person. One Wailea dinner.",
          "A resort breakfast buffet — About $30–50 a person. That is a second lodging charge.",
          "A second fish dinner at $40 and up the next night. The kitchen was the point of the condo."
        ]
      ),
      doTiers: tiers(
        [
          "The beach in front of the Kihei condo — $0.",
          "The Kaanapali beach path, if that is the hotel — $0. The resort fee is already in the room decision.",
          "A grocery hour — About $40–70 for two in the cart. That is food, not a ticket.",
          "Sunset from the same coast — $0."
        ],
        [
          "Haleakalā National Park — $30 a vehicle, plus a $1 sunrise reservation from 3 a.m. to 7 a.m. A free-entrance day does not cancel the reservation.",
          "The Road to Hana in your own car — Gas, and a few lots at about $10–15. A guided van is about $150 a person.",
          "A compact rental — About $60–90 a day before airport fees. This example uses about $70. Kihei to Kaanapali is a drive.",
          "One of those mornings. The summit is $31 for the car. The boat is about $150–200 a person. Not all three."
        ],
        [
          "A Molokini boat — About $150–200 a person. Kai Kanani leaves from the Wailea side. Pride of Maui leaves from Maalaea.",
          "The summit, the boat, and Hana — $31 plus about $150–200 a person plus a full Hana day. Three mornings. The week does not hold them as errands.",
          "Resort parking on Kaanapali or Wailea — About $25–40 a night, on top of a resort fee near $40.",
          "A second hotel night, another $400 or more, so you can be closer to one restaurant. That is a lodging decision, not a dinner."
        ]
      ),
      walk: {
        lead: "Two adults, five nights in a Kihei condo with a kitchen, grocery most meals, one fish dinner inside the food band, a rental, and Haleakalā. The boat and Hana are other days, not this total.",
        lines: [
          line("Room", "$2,300", "A Kihei condo at about $460 a night, five nights, before Hawaii’s 17.75% lodging tax. Inside $420–520."),
          line("Food", "$550", "About $55 a person, two people, five days. Inside $40–75, because the kitchen cooks most nights."),
          line("Car", "$350", "A compact rental at about $70 a day, five days, before airport fees. This is the worked example, not a quote."),
          line("Park", "$31", "Haleakalā entrance is $30 a vehicle, plus the $1 sunrise reservation.")
        ],
        day: "A condo day is the room ($460) plus food for two ($110) plus the rental ($70): about $640. The summit morning adds $31.",
        tripLabel: "5-night stay",
        trip: "About $3,230 before lodging tax, airport car fees, and flights ($2,300 + $550 + $350 + $31). Lodging plus food is $2,850, inside the Quick facts sample of $2,500–3,400. A Molokini morning would add about $150–200 a person on a different day.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("The beach you paid for", [
          "Grocery the first hour, about $40–70 for two.",
          "The beach in front of the condo or the Kaanapali path. $0.",
          "Cook dinner."
        ]),
        day("One big morning", [
          "The Road to Hana as an early start, or Haleakalā sunrise as the $1 reservation plus the $30 park fee. One of them.",
          "Home to the same coast.",
          "Not a boat the same day."
        ]),
        day("The sand, unless the boat is booked", [
          "The beach in front of the bed.",
          "A Molokini boat, about $150–200 a person, only if that is the booked day.",
          "Mama’s Fish House or Spago only as the one reservation."
        ])
      ],
      book: [
        "The condo or the Kaanapali hotel. A Kihei kitchen is about $200–400 before the 17.75% tax. Add the resort fee before a beach-path rate wins.",
        "The Haleakalā sunrise reservation, $1, from 3 a.m. to 7 a.m., on top of the $30 vehicle entrance.",
        "The car at the Kahului airport, about $60–90 a day before fees, plus a grocery stop the first hour.",
        "One fish dinner if you want Mama’s, about $80–150 a person. Not five."
      ],
      hidden: [
        "Hawaii lodging tax, about 17.75%, on a pre-tax quote.",
        "Kaanapali and Wailea resort fees, near $40 a night, and self-parking about $25–40 more.",
        "A resort breakfast buffet, about $30–50 a person.",
        "Haleakalā is $30 a vehicle plus a $1 sunrise reservation. A Molokini boat is about $150–200 a person. A guided Hana van is about $150. Those are three mornings.",
        "A second lodging night so you can be closer to one restaurant."
      ],
      skip: [
        skip("Hana, Haleakalā, and Molokini in one short week", "Pick one. The summit is $31 for the car. The boat is about $150–200 a person. The beach is the rest."),
        skip("The Road to Hana as a casual afternoon", "It is an early start, and the weather can close it. A guided van is about $150 a person."),
        skip("Resort breakfast as the habit", "The kitchen is why the Kihei condo was cheaper. The buffet is about $30–50 a person.")
      ],
      tips: [
        "Hidden gem: Book the Haleakalā sunrise as its own morning. It is a $1 reservation from 3 a.m. to 7 a.m., plus $30 for the vehicle. It is not a beach afternoon.",
        "Hidden gem: Add the resort fee, near $40, and parking, about $25–40, before a Kaanapali rate beats a Kihei kitchen.",
        "Hidden gem: Grocery the first hour. Two cooked nights change the week more than skipping the one fish dinner.",
        "A Paia food truck on the way back from Hana is about $12–18. It is not a reason to book a second hotel in Paia.",
        "Mama’s Fish House is one reservation, about $80–150 a person. Do not change hotels for it."
      ],
      money: money(
        "About $420–520 a night before Hawaii’s 17.75% lodging tax, for a Kihei condo or a Kaanapali hotel you can walk to the beach from. Resort fees and parking are extra on Kaanapali and Wailea.",
        "About $40–75 if the kitchen cooks two nights. A food-truck lunch is about $14–20. Mama’s Fish House is the one expensive dinner.",
        "Haleakalā is $30 a vehicle plus a $1 sunrise reservation. A Molokini boat is about $150–200 a person. Do not buy all three big mornings.",
        "Five nights run about $2,500–3,400 in lodging plus food for two, before flights and the 17.75% tax (orientation)."
      )
    },

    cruise: {
      hook: "The brochure fare bought the cabin and the main dining room. Gratuities, port fees, and a drink package charged per person are the rest of the week, including for an adult who will not drink.",
      blurb: "Price an interior or a balcony with port fees and gratuities already on the card. Main dining is in the fare. One specialty dinner. One port walk.",
      nights: "7 nights on the ship, plus a hotel night if the flight can miss it",
      midrange: "A balcony cabin, main dining, pay-as-you-go drinks",
      months: "Early May, early September, and late October through early November.",
      startHere: "Price the interior or the balcony with port fees and gratuities already on the card. Run the drink-package math before you add it. Walk one port, and pay for one ship excursion only if that beach is the day.",
      tipsKicker: "Add port fees and gratuities before you compare fares.",
      cta: "Build the cruise Trip Plan with gratuities and the drink math in the total. Add one port walk, not three pier tours.",
      forWho: ["People who will use the dining room they already paid for and walk at least one port"],
      notFor: ["A week that adds a drink package, a specialty restaurant, and a pier tour at every stop"],
      aroundKind: "ship",
      aroundRule: "The ship is the hotel. You do not need a rental car. A pier kiosk is the expensive version of a walk you can take off the gangway. Book a hotel the night before, about $200, if the flight can miss the ship.",
      aroundNoCar: [
        "Walk off the ship. The gangway is $0. A rental car is not how you see Nassau or Cozumel on a port morning",
        "One ship excursion, about $60–120 a person, if you want a beach the walk does not reach. The other ports are walks",
        "A hotel the night before sailing, about $200, if the flight can miss the ship. Missing the ship costs more than the room"
      ],
      stayRule: "An interior cabin is a bed, about $250–650 a person for 7 nights before port fees. A balcony is about $500 a person on top of that interior. A suite adds a separate gratuity charge, higher than the usual $16–20 a person per day.",
      eatRule: "The main dining room and the buffet are in the fare. Chops Grille or Cagney’s is about $45 a person, one night. Pay-as-you-go drinks in this example are about $25 a person per day. A $70 package for both adults over 7 nights is about $980.",
      doRule: "Sea days on the pool deck are in the fare. One ship excursion is about $60–120 a person. A walk in Nassau or Cozumel is $0. Wi-Fi is about $15–25 a day if you need it, and it is not in the brochure fare.",
      zones: [
        zone("An interior cabin", "Book an interior cabin, including an interior guarantee, on Carnival, MSC, or Royal Caribbean. About $250–650 a person for 7 nights, before port fees. You get a bed and the dining room. You do not get a window. Do not choose it if you need daylight in the room. An obstructed oceanview is about $50–150 a person more."),
        zone("A balcony", "Book a balcony on Royal Caribbean, Norwegian, Celebrity, or Princess. The add-on in this guide is about $500 a person on top of an interior. You get a chair outside. You do not get higher suite gratuities. Do not choose the balcony if that $500 a person would erase the port day you wanted."),
        zone("A suite", "Book a suite, or Norwegian’s Haven, only if you want the space. Gratuities are a separate charge, higher than the usual $16–20 a person per day. You get a quieter corridor. You do not get drinks or shore tours in that decision. Do not choose it if you have not priced the higher gratuity."),
        zone("A hotel the night before", "Book a hotel near the port, about $200, when the flight can miss the ship. You get a bed if the plane is late. You do not get a cabin that night. Do not skip it when the inbound flight lands the morning the ship leaves.")
      ],
      stayTiers: tiers(
        [
          "Interior guarantee — Carnival, MSC, or Royal Caribbean, about $250–650 a person for 7 nights before port fees. You chose the price, not the deck.",
          "Obstructed oceanview — About $50–150 a person above an interior, if you want a window and still want the cheaper cabin.",
          "Lower-deck midship interior — About $250–650 a person before port fees. The cheap cabin, chosen on purpose, with less motion.",
          "Skip the drink package at check-in — A package at $70 a person per day is about $980 for two adults over 7 nights."
        ],
        [
          "A balcony on Royal Caribbean or Norwegian — About $500 a person on top of the interior.",
          "A covered balcony on a 7-night Caribbean sailing — Still about a $500-a-person jump from an interior, without the higher suite gratuity.",
          "An oceanview, midship — Daylight, if the $500-a-person balcony jump would erase the port day.",
          "A Celebrity or Princess balcony — Compare the line, not only the Carnival interior you started with. Gratuities are still about $16–20 a person per day."
        ],
        [
          "A large balcony or an aft cabin — Above the $500-a-person balcony add. The cabin is the memory. The dining room is still in the fare.",
          "Norwegian Haven or a Royal Caribbean suite — Gratuities are a separate charge, higher than $16–20 a person per day. Price that before you book.",
          "A hotel the night before — About $200, when the flight can miss the ship.",
          "A spa-deck cabin — Quieter. It is not a fare until gratuities of about $16–20 a day and port fees of about $200 a person are on the card."
        ]
      ),
      eatTiers: tiers(
        [
          "The buffet or the main dining room — $0 extra. Breakfast, lunch, and dinner are in the fare.",
          "Pay-as-you-go drinks — A soda or a beer is about $8–14. Run the package math before you add one.",
          "Skip the specialty cover on a cheaper sailing — Chops Grille or Cagney’s is about $45 a person.",
          "Room service — Many lines add a fee, about $8–10. It is a backup, not breakfast."
        ],
        [
          "Main dining most nights — $0 extra. That is the meal you already paid for.",
          "One Italian or seafood specialty — About $40–55 a person, and not also Chops the next night.",
          "A children’s soda package — About $10–15 a day. That is not the adult drink package at about $54–105.",
          "Pay-as-you-go at about $25 a person per day — A $70 package wins only if you actually drink that much."
        ],
        [
          "Chops Grille or Cagney’s — About $45 a person, one night.",
          "A chef’s table — About $100 and up a person. Not every night.",
          "An unlimited adult drink package — About $54–105 a person per day. On many lines both adults in the cabin must take it.",
          "A café latte — About $4–6 a cup. That is how a prepaid week leaks."
        ]
      ),
      doTiers: tiers(
        [
          "The gangway — $0 to walk off. The ship is the hotel. A rental car is not the port plan.",
          "A walk in Nassau or along the waterfront in Cozumel — $0 beyond the ship.",
          "A pool day at sea — $0 extra. It is in the fare.",
          "Sail-away — $0."
        ],
        [
          "One ship excursion — About $60–120 a person. The other ports are walks.",
          "Wi-Fi for the week — About $15–25 a day if you need it. It is not in the brochure fare.",
          "The drink-package check — At $70 a person per day, two adults for 7 nights is about $980.",
          "Gratuities — About $18 a person per day in this example, inside the $16–20 band, including a child age 2 or older."
        ],
        [
          "A second excursion in the same port — Another $60–120, when the walk was the plan.",
          "A pier-kiosk tour — About $60–120 a person, on top of a ship excursion to the same beach.",
          "Suite gratuities — A separate charge, higher than $16–20 a day, on a Haven or suite cabin.",
          "Missing the ship — More expensive than the $200 hotel the night before."
        ]
      ),
      walk: {
        lead: "Two adults, one 7-night Caribbean balcony: an interior fare, the $500-a-person balcony add, port fees, gratuities, main dining, pay-as-you-go drinks, one specialty night, and one excursion.",
        lines: [
          line("Cabin", "$2,300", "An interior at about $650 a person times two is $1,300, inside the $1,200–2,000 sample. The balcony add is about $500 times two, $1,000. The cabin is about $2,300 before fees."),
          line("Port fees and gratuities", "$652", "Port fees about $200 times two is $400. Gratuities about $18 times 7 nights times two people is $252."),
          line("Food and drinks", "$440", "Main dining is $0 extra. One specialty night at $45 times two is $90. Pay-as-you-go drinks at about $25 a person per day times 7 times 2 is $350. A $70 package for both would be about $980."),
          line("Shore", "$160", "One excursion at about $80 times two. The other ports are walks, $0.")
        ],
        day: "A sea day is the cabin’s daily share (about $2,300 divided by 7, about $330) plus a port-fee share (about $55) plus gratuities ($36) plus drinks (about $50): about $470 for two, with dinner in the fare.",
        tripLabel: "7-night sailing",
        trip: "About $3,550 before Wi-Fi and flights ($2,300 cabin + $400 port fees + $252 gratuities + $90 specialty + $350 drinks + $160 excursion). The Quick facts interior sample of $1,200–2,000 is before the balcony, drinks, and the excursion.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("Board, and use the dining room", [
          "The fare includes the dining room. Use it. $0 extra.",
          "No specialty restaurant tonight.",
          "Confirm gratuities are on the bill, including children age 2 and up, about $16–20 a person per day."
        ]),
        day("A port you can walk", [
          "One walk in Nassau or Cozumel. $0.",
          "Or one ship excursion, about $60–120 a person, not three pier-kiosk tours.",
          "Back on board without a second package."
        ]),
        day("A sea day", [
          "The pool deck you already paid for. $0 extra.",
          "Chops or Cagney’s only if this is the one specialty night, about $45 a person.",
          "Pay-as-you-go drinks unless the package math says it wins. At $70 a person, two adults for 7 nights is about $980."
        ])
      ],
      book: [
        "The cabin and the sailing date. An interior is about $250–650 a person before a balcony add of about $500 a person.",
        "A hotel the night before, about $200, if the flight can miss the ship.",
        "The drink package only after the math. Pay-as-you-go at about $25 a person per day is the comparison.",
        "One ship excursion, about $60–120 a person. Walk the other ports."
      ],
      hidden: [
        "Port fees, about $200 a person, on a 7-night Caribbean sailing.",
        "Gratuities, about $16–20 a person per day on mainstream lines, including children age 2 and up.",
        "A drink package at about $54–105 a person per day. At $70, two adults for 7 nights is about $980, and many lines require both adults to take it.",
        "Specialty dining, about $45 a person, at Chops Grille or Cagney’s.",
        "Wi-Fi at about $15–25 a day, a second excursion at about $60–120 a person, and a hotel the night before at about $200 if the flight is tight."
      ],
      skip: [
        skip("The drink package as the default", "Pay as you go until the count says it wins. At $70 a person per day, two adults for 7 nights is about $980."),
        skip("Three pier-kiosk tours", "One excursion, about $60–120 a person, plus a walk. A kiosk that copies the ship tour means you pay twice."),
        skip("A specialty restaurant every night", "Main dining is already in the fare. Chops or Cagney’s is about $45 a person, once.")
      ],
      tips: [
        "Hidden gem: Gratuities bill children age 2 and up, about $16–20 a person per day. They are a separate charge, not folded into the brochure fare.",
        "Hidden gem: Add port fees, about $200 a person, before you compare two from-prices.",
        "Hidden gem: Unlimited drink packages run about $54–105 a person per day. At $70, two adults for 7 nights is about $980.",
        "One night at Chops Grille or Cagney’s, about $45 a person. Every night is a second fare.",
        "A hotel the night before is about $200 when the flight can miss the ship."
      ],
      money: money(
        "A balcony is the mid cabin, about $500 a person on top of an interior for 7 nights. Interior fares are about $250–650 a person before port fees.",
        "Main dining is in the fare. A specialty restaurant is about $45 a person. Drinks are pay-as-you-go until a package, about $54–105 a person per day, wins the math.",
        "Port fees are about $200 a person on a 7-night Caribbean sailing. Gratuities are about $16–20 a person per day, including children age 2 and up.",
        "Two adults in an interior for 7 nights run about $1,200–2,000 before drinks, Wi-Fi, and excursions. A balcony adds about $500 a person (orientation)."
      )
    },

    key_west: {
      hook: "Old Town is a walk from the hotel to Cuban coffee and the sidewalk at Mallory Square. The bill jumps when you eat on the pier, or when you sleep on Stock Island and pay a cab both ways.",
      blurb: "Book The Big Ruby, Caribbean House, or The Gardens in Old Town and walk. Cuban coffee in the morning. Sunset from the Mallory sidewalk. The Dry Tortugas ferry is its own day.",
      nights: "3 nights in Old Town",
      midrange: "The Gardens or a similar Old Town inn, one dinner out",
      months: "Early May, and late September through October.",
      startHere: "Book The Big Ruby, Caribbean House, or The Gardens in Old Town, close enough to walk. Cuban coffee in the morning. Watch sunset from the Mallory Square sidewalk, and book the Dry Tortugas ferry only if that day is otherwise empty.",
      tipsKicker: "Walk Old Town, and give the Tortugas ferry its own day.",
      cta: "Build the Key West Trip Plan from an Old Town walk. Add the Dry Tortugas ferry only if that day is otherwise empty.",
      forWho: ["People who will sleep in Old Town and walk to dinner"],
      notFor: ["A cheaper Stock Island room that needs a cab both ways, plus a ferry and a sunset sail on the same day"],
      aroundKind: "fork",
      aroundRule: "From an Old Town hotel you do not need a car to reach Duval Street, Mallory Square, or dinner. A car helps for the drive down from Miami, which is a full day, not for hopping the island at night. Parking a car you will not move is about $20–40 a day.",
      aroundNoCar: [
        "Walk from The Big Ruby, Caribbean House, or The Gardens to dinner. Duval is a street, not a reason to drive",
        "Fort Zachary Taylor is $2.50 if you walk or bike in. A car with two people is $7",
        "Sunset at Mallory Square is $0 from the sidewalk. You do not need a pier ticket"
      ],
      aroundCar: [
        "A rental you do not move often costs about $20–40 a day to park in Old Town",
        "The drive from Miami is a full day, plus gas and a rental that is about $50–80. Price it as a day",
        "A Stock Island hotel plus a cab both ways, about $15–25 each way, usually spends the discount"
      ],
      stayRule: "Pay for a walk. The Big Ruby or Caribbean House is about $150–260 a night before Florida’s 12.5% lodging tax. The Gardens is about $280–400. Casa Marina is the beach-end splurge, about $400–700. A Stock Island room plus a cab both ways usually spends the savings.",
      eatRule: "Cuban coffee and a sandwich are about $8–14. El Siboney or Garbo’s is about $15–25 a person. Louie’s Backyard is about $70–120 a person, one reservation. A Mallory Square menu is about $30–50 for a plate, plus a markup on a sunset you can watch from the sidewalk.",
      doRule: "Mallory Square at sunset is free from the sidewalk. Fort Zachary Taylor is $2.50 if you walk or bike in. The Hemingway Home is about $18. The Yankee Freedom ferry to Dry Tortugas is about $235 an adult and takes the whole day.",
      zones: [
        zone("Old Town, a walk to Duval", "Book The Big Ruby or Caribbean House. Rooms are about $150–260 a night before Florida’s 12.5% lodging tax. You walk to coffee and to dinner. You do not get a pier view. Do not choose a Stock Island hotel to save this rate. A cab both ways is about $15–25 each way."),
        zone("The Gardens, a courtyard inn", "Book The Gardens Hotel, or a similar Old Town inn such as the Marquesa or Kimpton Palms. Rooms are about $250–400 a night before the 12.5% tax. You get a quieter courtyard and a walk to dinner. You do not need a car for Duval. Do not choose it if you wanted the beach at the south end. That is Casa Marina."),
        zone("Casa Marina, the beach end", "Book Casa Marina or The Reach, about $400–700 a night before tax. You can still walk. Ocean Key or Pier House, about $400–800, is the pier address. Do not add a car for Duval. The sidewalk at Mallory Square is $0."),
        zone("Stock Island", "Book Oceans Edge only if you want the marina and will use the shuttle. A cab both ways is about $15–25 each way. You get a lower room and a marina. You do not get an Old Town walk. Do not choose it to save money if the cab spends the discount.")
      ],
      stayTiers: tiers(
        [
          "The Big Ruby — An Old Town guesthouse, a walk to Duval, about $160–260 a night before Florida’s 12.5% lodging tax. No car.",
          "Caribbean House — On the Truman Annex side, about $150–240 a night before tax. Quieter than the bar strip.",
          "Hampton Inn Key West — Near Old Town, about $180–280 a night before tax, still a walk.",
          "A smaller Truman Annex inn — About $150–230 a night before tax. You are paying for the walk, not for a pier view."
        ],
        [
          "The Gardens Hotel — A courtyard inn in Old Town, about $280–400 a night before the 12.5% lodging tax.",
          "Marquesa Hotel — A quieter block off Duval, about $250–380 a night before tax.",
          "Kimpton Palms or Island House — Walkable Old Town, about $250–380 a night before tax.",
          "Hyatt Centric Key West — Old Town, by the water, about $300–450 a night before tax. You can walk to dinner."
        ],
        [
          "Casa Marina — The beach end, about $400–700 a night before tax. You can still walk.",
          "The Reach — A Waldorf hotel you can walk to the sand from, about $400–700 a night before tax, the same band as Casa Marina.",
          "Ocean Key or Pier House — The pier address, about $400–800 a night. The sidewalk at Mallory Square is $0.",
          "Oceans Edge on Stock Island — A marina and a shuttle. A cab both ways is about $15–25 each way, which spends a cheap rate."
        ]
      ),
      eatTiers: tiers(
        [
          "Cuban Coffee Queen — Coffee and a sandwich, about $8–14. That is breakfast. A small Cuban coffee window nearby is the same idea.",
          "Garbo’s Grill — A counter lunch, about $12–18. Not a Mallory Square menu.",
          "El Siboney — A Cuban dinner, about $15–25 a person, off the tourist row.",
          "One slice of key lime — About $5–7. It is not dinner."
        ],
        [
          "Blue Heaven — The courtyard, about $25–45 a person. Go at opening if you want that table.",
          "Pepe’s Cafe — A harbor breakfast or lunch, about $15–28.",
          "Schooner Wharf fritters — A snack, about $8–12, not the meal.",
          "A grocery bag for a Fort Zach afternoon — About $12–18 for two."
        ],
        [
          "Louie’s Backyard — The waterfront table, about $70–120 a person. Book it.",
          "Latitudes on Sunset Pier — The other expensive dinner, about $60–100 a person. Not the same night.",
          "Hot Tin Roof at Ocean Key — One pier dinner, about $70–120 a person. It is not the sunset plan.",
          "A Mallory Square menu — About $30–50 for a plate, on a sunset you can watch from the sidewalk for $0."
        ]
      ),
      doTiers: tiers(
        [
          "Mallory Square from the sidewalk at sunset — $0.",
          "Duval Street on foot — $0. It is a street you walk, not a reason to drive.",
          "The Southernmost Point buoy — A photo, $0, not a morning.",
          "Old Town on foot from The Big Ruby or The Gardens — $0 in fares."
        ],
        [
          "Fort Zachary Taylor — $2.50 to walk or bike in. A car with two people is $7.",
          "The Hemingway Home — About $18 a person. Give it its own hour.",
          "A sunset sail — About $40–70 a person, only if the sidewalk was not enough, and not after the ferry.",
          "An Old Town garage — About $20–40 a day if you drove a car you will not move."
        ],
        [
          "Yankee Freedom to Dry Tortugas — About $235 an adult. It takes the whole day. Park entry and a lunch are in that fare.",
          "A seaplane to Dry Tortugas — About $350 and up a person. It replaces the ferry. It is not an add-on after it.",
          "Parasailing — About $50–70. The swim is Fort Zach, at $2.50.",
          "Key West airport airfare — Often $150 or more above a Miami ticket. The drive down is a full day, plus gas and a rental about $50–80."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at The Gardens or The Big Ruby, Cuban coffee, one dinner at El Siboney or Blue Heaven, walking, and Fort Zachary Taylor. The Dry Tortugas ferry is a separate day if the calendar is empty.",
        lines: [
          line("Room", "$900", "About $300 a night, three nights, before Florida’s 12.5% lodging tax. Inside $250–360."),
          line("Food", "$480", "About $80 a person, two people, three days. Inside $60–100."),
          line("Getting around", "$0", "On foot from an Old Town inn. A rental you do not move often costs about $20–40 a day to park."),
          line("Fort Zach", "$5", "Fort Zachary Taylor at $2.50 times two, if you walk in. The Hemingway Home, if you add it, is about $18 each.")
        ],
        day: "A walking day is the room ($300) plus food for two ($160) plus Fort Zach ($5): about $465 before tax.",
        tripLabel: "3-night trip",
        trip: "About $1,385 before lodging tax and flights ($900 + $480 + $5). Lodging plus food is $1,380, inside the Quick facts sample of $1,100–1,700. Add about $470 if both of you take Yankee Freedom at about $235 an adult. That ferry is outside the lodging-and-food sample, and it takes the whole day.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote."
      },
      days: [
        day("Old Town on foot", [
          "Cuban coffee, about $8–14.",
          "Walk Duval. $0.",
          "Sunset from the Mallory Square sidewalk. No pier ticket."
        ]),
        day("One dinner", [
          "El Siboney, Garbo’s, or Louie’s Backyard. One dinner.",
          "Key lime once, about $5–7.",
          "Schooner Wharf fritters are a snack, about $8–12, not the meal."
        ]),
        day("The fort, or the ferry", [
          "Fort Zachary Taylor, $2.50 if you walk in.",
          "Or the Dry Tortugas ferry, about $235 an adult, if that is the entire day.",
          "A sunset sail, about $40–70, does not follow the ferry."
        ])
      ],
      book: [
        "An Old Town room you can walk from. The mid band is about $250–360 before the 12.5% lodging tax.",
        "The Dry Tortugas ferry, about $235 an adult, only if that day has nothing else on it.",
        "Blue Heaven if you want that courtyard, about $25–45 a person. Go early.",
        "A midweek flight into Key West, or the drive from Miami priced as a full day."
      ],
      hidden: [
        "Florida lodging tax, about 12.5%, on the room. That is not the Anaheim 17% figure.",
        "Old Town parking, about $20–40 a day, if you drove a car you will not use.",
        "A Stock Island cab, about $15–25 each way.",
        "Key West airfare, often well above a Miami ticket. The drive is a full day plus gas and a rental.",
        "Yankee Freedom is about $235 an adult. A sunset sail is about $40–70. A seaplane is about $350 and up. They do not share a day."
      ],
      skip: [
        skip("A Mallory Square dinner for the sunset", "The sunset is the same from the sidewalk, $0. A pier plate is about $30–50."),
        skip("Stock Island to save the room", "A cab both ways is about $15–25 each way. That cab spends the savings."),
        skip("The ferry, a sail, and a seaplane", "The ferry is about $235 and takes the day. The sail is about $40–70. The seaplane is about $350. Pick one, on its own day.")
      ],
      tips: [
        "Hidden gem: Watch sunset from the Mallory Square sidewalk. It is $0. The Dry Tortugas ferry, about $235 an adult, is a different day.",
        "Hidden gem: Fort Zachary Taylor is $2.50 if you walk or bike in. A car with two people is $7.",
        "Hidden gem: Cuban coffee and a sandwich are about $8–14. That is breakfast. The hotel restaurant is the expensive morning.",
        "Florida lodging tax on this island is about 12.5%. Do not apply a 17% Anaheim rate to a Key West room.",
        "A Key West flight is often well above a Miami ticket. The drive down is a full day. Put that day on the plan."
      ],
      money: money(
        "About $250–360 a night before Florida’s 12.5% lodging tax, for an Old Town guesthouse or The Gardens. The Trip Plan mid figure is about $320.",
        "About $60–100 with Cuban coffee and one dinner at El Siboney, Garbo’s, or Louie’s.",
        "The Yankee Freedom ferry to Dry Tortugas is about $235 an adult and takes the whole day. Fort Zachary Taylor is $2.50 if you walk or bike in. Mallory Square sunset is free.",
        "Three nights run about $1,100–1,700 in lodging plus food for two, before flights and the 12.5% tax (orientation)."
      )
    }
  };

  var BANNED = /\b(basin|leftover|pocket|orientation data|scavenger|villages connected|hostel-plus)\b/i;
  var TAX_META = /\b(are a tax|is usually a tax|Hopper tax|tourist tax|half-day tax|Friday arrivals are a tax|SEPTA tax|room-service tax|restaurant-row tax)\b/i;
  var VAGUE = /\b(already priced|one named|a named dinner|a named chef|the same walk)\b/i;
  var JARGON = /\b(walk-up|base fails|its own line|their own line|in spirit|door logic)\b/i;

  var plainProblems = [];
  function plainFail(msg) { plainProblems.push(msg); }

  Object.keys(PLAIN).forEach(function (id) {
    var g = pack.BY_ID[id];
    var row = PLAIN[id];
    if (!g) plainFail("plain missing guide " + id);
    if (row.car) plainFail(id + ": plain overlay must not set car");
    if (g) Object.keys(row).forEach(function (k) { g[k] = row[k]; });
    ["stayTiers", "eatTiers", "doTiers"].forEach(function (key) {
      ["budget", "mid", "lux"].forEach(function (band) {
        var list = row[key] && row[key][band];
        if (!list || list.length < 4) plainFail(id + ": " + key + " " + band + " needs 4");
        (list || []).forEach(function (b, i) {
          if (!/[$€£¥]/.test(String(b))) plainFail(id + ": " + key + " " + band + " " + (i + 1) + " missing currency :: " + String(b).slice(0, 140));
        });
      });
    });
    var gems = (row.tips || []).filter(function (t) { return /^Hidden gem:/.test(t); });
    if (!row.tips || row.tips.length !== 5 || gems.length !== 3) {
      plainFail(id + ": tips " + (row.tips && row.tips.length) + " gems " + gems.length);
    }
    if (!row.zones || row.zones.length < 3 || row.zones.length > 5) plainFail(id + ": zones");
    (row.zones || []).forEach(function (z) {
      if (!/[$€£¥]/.test(z.note || "")) plainFail(id + ": zone missing price " + z.name);
      if (/\btrap\b/i.test(z.name)) plainFail(id + ": trap zone " + z.name);
    });
    if (row.aroundKind === "fork" && (!row.aroundCar || row.aroundCar.length < 2)) {
      plainFail(id + ": fork needs aroundCar");
    }
    if (row.aroundKind === "ship" && row.aroundCar) plainFail(id + ": ship should not set aroundCar");
    var blob = JSON.stringify(row);
    if (BANNED.test(blob)) plainFail(id + ": banned word");
    if (TAX_META.test(blob)) plainFail(id + ": tax metaphor");
    if (VAGUE.test(blob)) plainFail(id + ": vague phrase");
    if (JARGON.test(blob)) plainFail(id + ": insider jargon");
    if (/often about/i.test(blob)) plainFail(id + ": often-about rhythm");
    if (/The overrun is/i.test(row.hook || "")) plainFail(id + ": overrun hook");
  });
  if (plainProblems.length) throw new Error(plainProblems.join("\n"));
})(typeof window !== "undefined" ? window : this);
