/* Pilot editorial rewrite for Disney, New York, and Paris.
   Loaded after city-guides-dense.js. Other cities keep their copy
   and only pick up the shared shell. Rates are public-page ranges
   already used in this repo, not a field visit and not a live quote.
*/
(function (global) {
  "use strict";

  var pack = global.VM_CITY_GUIDES;
  var R = global.VM_CITY_GUIDE_RESEARCH;
  if (!pack || !pack.BY_ID || !R) throw new Error("pilot overlay needs guides and research");

  function tiers(budget, mid, lux) {
    return { budget: budget, mid: mid, lux: lux };
  }
  function line(item, cost, note) {
    return { item: item, cost: cost, note: note };
  }
  function money(room, food, ticket, sample) {
    return [
      { dt: "Mid-range room", dd: room },
      { dt: "Food / person / day", dd: food },
      { dt: "#1 ticket", dd: ticket },
      { dt: "Sample total", dd: sample }
    ];
  }
  function skip(name, why) {
    return { name: name, why: why };
  }
  function zone(name, note) {
    return { name: name, note: note };
  }
  function day(title, bullets) {
    return { title: title, bullets: bullets };
  }

  var PILOT = {
    disney: {
      hook: "Walt Disney World is three purchases that multiply: which resort's transportation you sleep on, which ticket you actually hold, and whether a dining plan spends the food money for you. Book Pop Century and then add Hopper, Lightning Lane, and the plan, and a Value week starts to cost like the Moderate week you could have chosen on purpose.",
      blurb: "Match the resort to the parks. Pop Century is on Disney's Skyliner gondola to Hollywood Studios and Epcot. Grand Floridian is on the monorail to Magic Kingdom. Keep the dining plan off the card.",
      nights: "4–6 nights, one park on the ticket you hold",
      midrange: "Caribbean Beach or Port Orleans, counters, one table",
      months: "Late January through February, and the two weeks after Labor Day. A Saturday in a holiday week is a different rate for the same room.",
      startHere: "Name the park days before the hotel. For Hollywood Studios and Epcot, book Pop Century, Art of Animation, Caribbean Beach, or Riviera — those sit on the Skyliner, Disney's gondola to those two parks. A Magic Kingdom week is Grand Floridian, Contemporary, or Polynesian, on the monorail to that park. Grocery the room after you land at Orlando airport (MCO).",
      tipsKicker: "The gondola, the monorail, and the bus are three different hotels",
      cta: "Open the Disney Trip Plan and lock the resort that reaches your park days. Add a second ticket type only after that room is in the total.",
      forWho: [
        "Families who will ride the bus or the Skyliner they already paid for, and who can spend a whole day in one park",
        "Anyone happy to mobile-order lunch and treat a single table as the meal they booked"
      ],
      notFor: [
        "A long weekend that tries to hold four parks, a water park, and a character meal before Thursday",
        "People who want to drive to the gate each morning and still call the hotel the cheap part"
      ],
      aroundKind: "fork",
      aroundRule: "On property you do not need a car to reach a park. Buses go to every gate. The Skyliner, Disney's gondola, is a smaller map: Pop Century, Art of Animation, Caribbean Beach, Riviera, Hollywood Studios, and Epcot. The monorail is a third map, only from the Magic Kingdom Deluxe resorts. Magical Express is gone, so the ride from Orlando airport (MCO) is its own line. The calculator uses about $130 round trip for a family of four.",
      aroundNoCar: [
        "Bus to every park from a Disney resort. The Skyliner only if you are at Pop Century, Art of Animation, Caribbean Beach, or Riviera, and only toward Hollywood Studios and Epcot",
        "Monorail, walk, or boat from Grand Floridian, Contemporary, or Polynesian. That loop does not get you to Animal Kingdom",
        "Mears or a rideshare from Orlando airport (MCO). There is no airport bus in the rate anymore"
      ],
      aroundCar: [
        "One grocery run, Garden Grocer or Winn-Dixie, then the car stays at the resort overnight",
        "Driving to a theme-park gate adds about $35 in parking. Buses and the Skyliner do not",
        "Park-to-park by car is the expensive way to do what a second ticket day, or a Hopper you will use after lunch, already does"
      ],
      stayRule: "Buy the transportation, not the theme. Skyliner resorts, on Disney's gondola, earn the rate on Hollywood Studios and Epcot weeks. Monorail Deluxe resorts earn theirs when Magic Kingdom is the morning. All-Star is the cheap bus to every park, and it sits in a county with a higher lodging tax.",
      eatRule: "Counters at Cosmic Ray's, Pecos Bill, and Satu'li Canteen run about $14–18 a person. A table is $35 and up, plus tip. The dining plan prices a day nearer the calculator's typical $215 for a party of four, which is the heavy version of a quick-service trip.",
      doRule: "A 1-day, 1-park ticket is about $119–209 before 6.5% sales tax. Animal Kingdom is the floor. A peak Magic Kingdom day is the ceiling. Hopper, Lightning Lane Multi Pass, and Lightning Lane Single Pass are three extra products. None of them is included because you bought a room.",
      zones: [
        zone("Pop Century and Art of Animation", "Value resorts on the Skyliner, Disney's gondola to Hollywood Studios and Epcot. Magic Kingdom from either resort is a bus. Standard Pop rooms on an ordinary week sit around $150–250 before tax."),
        zone("All-Star Movies, Music, or Sports", "Disney's cheapest on-property hotels, and a bus to every park. Commonly $140–220 before tax, and the resorts billed at Osceola County's 13.5% lodging tax rather than 12.5%."),
        zone("Caribbean Beach", "A Moderate resort on the same gondola as Pop Century, about $280–450 before Florida's 12.5% lodging tax. The campus is large. A room on the far side means an internal bus before you reach the gondola station."),
        zone("Grand Floridian, Contemporary, Polynesian", "About $500–750, on the monorail to Magic Kingdom. You are paying so that park is a walk, a boat, or the monorail. Hollywood Studios and Epcot from here are buses."),
        zone("Off Disney property", "A hotel on International Drive can post a lower nightly rate, then adds a car, about $35 a day to park at the gate, and a shorter Lightning Lane booking window.")
      ],
      stayTiers: tiers(
        [
          "Pop Century — The Value resort that sits on the Skyliner. Standard rooms on ordinary weeks land around $150–250 before tax. A preferred room, roughly $20–40 more, is a location upsell inside the same hotel. It does not move Magic Kingdom any closer. That park is still a bus.",
          "Art of Animation — Family suites often run $250–400. For five or six people that can beat two connecting Pop rooms. For four, price both before you pay for the theme. The gondola is the same one Pop already has.",
          "All-Star Movies, Music, or Sports — The cheapest on-property bus, commonly $140–220 before tax. These are the rooms at 13.5% Osceola lodging tax, not the 12.5% on most other Walt Disney World hotels. A $20 gap in the rate can disappear once both bills include tax.",
          "On-property early entry — About 30 minutes before the general public, included with a Disney resort stay, Value included. An off-property rate that ignores that half hour, and the longer Lightning Lane window, is not a clean comparison with Pop at $150–250."
        ],
        [
          "Caribbean Beach — Moderate Skyliner hub, about $280–450 a night before Florida's 12.5% lodging tax. Ask for a Riviera-side room. Without that request the 'Skyliner resort' can still mean a campus bus to the station, which is the moment the mid tip fails.",
          "Port Orleans French Quarter — Same Moderate money, about $280–420, on a smaller campus than Caribbean Beach. A boat reaches Disney Springs. Hollywood Studios and Epcot are buses. Buy this for the boat and the scale, not because you thought it was on the gondola.",
          "Coronado Springs — Gran Destino tower is the room to ask for, about $300–450. Buses to the parks, not the Skyliner. It fits a convention-sized resort with a nicer tower. It does not fit a week whose whole point was the gondola.",
          "Port Orleans Riverside — About $280–420. Magnolia Bend is a room request inside that rate, not a second resort and not a second price list. Like French Quarter, Springs is the easy evening. Magic Kingdom is the bus."
        ],
        [
          "Disney's Riviera Resort — The Deluxe that actually sits on the Skyliner, often $450–700 a night before tax. You are paying for a shorter walk to the gondola than Caribbean Beach, and for Deluxe early-evening hours on the nights they run. You are not buying the monorail.",
          "Grand Floridian, Contemporary, or Polynesian — Monorail Deluxe, about $500–750. This is the right spend when Magic Kingdom is most of the week. It is the wrong spend for an Epcot week: you will bus to parks a Skyliner resort already reaches for less.",
          "Beach Club or Yacht Club — You can walk into Epcot. Deluxe rates, in the $450–700 world. Club level can add about $100–200 a night for a lounge. The walk does not get shorter because you bought the lounge.",
          "BoardWalk — The other walk toward Epcot and Hollywood Studios, same Deluxe band, often $450–700. Wilderness Lodge is the alternative when you want a boat toward Magic Kingdom, also often $450–700. Neither is the Skyliner. Pick the water that matches the park."
        ]
      ),
      eatTiers: tiers(
        [
          "Garden Grocer or Winn-Dixie — The night you land, put breakfast in the room. A person's morning lands around $8–15. A sit-down hotel breakfast is a different meal and a different bill.",
          "Cosmic Ray's or Pecos Bill — Mobile-order lunch in Magic Kingdom, about $14–18. Place it before you are hungry. The line you skip is the thing you paid for.",
          "Pop Century or Art of Animation food court — Dinner back on the gondola, about $15–22. That is a successful Budget night, not a compromise you should apologize for with a second table.",
          "A Dole Whip or a resort bakery item — $6–8, once. An hourly snack habit turns a $16 lunch into a $40 food day without ever sitting down."
        ],
        [
          "Sci-Fi Dine-In or 50's Prime Time — One Hollywood Studios table, about $35–55 a person before tax and tip. Book it before you fly. Eighteen percent on a $50 check is another $9 a person, and it is not in the menu price.",
          "Columbia Harbour House — A Magic Kingdom counter with a quieter room upstairs, still about $14–18. It does not need a dining credit. Use it when the day is already expensive and the meal should not be.",
          "The Disney Dining Plan — Credits are built around table-service prices. A party eating counters and kids' meals pays for meals it will not order. The calculator's typical food day for four is about $215. Pay the counter, then buy one table.",
          "The nights that are not the reservation — Another quick-service dinner at the resort, about $15–22. Two tables in four nights is how a $70 person drifts toward the heavy day, about $320 for four in the calculator."
        ],
        [
          "'Ohana or Chef Mickey's — One character meal, about $45–75 a person. That is the breakfast or the dinner. It is not a reason to prepay the other six meals.",
          "California Grill or Space 220 — The reservation people fly in for, about $75–150 a person. If it is not booked before you land, assume the night is a food court. These do not appear at 6 p.m. because you asked nicely.",
          "Tusker House — About $45–65, and only if Animal Kingdom morning is already the plan. A character breakfast plus a full park plus a second table the same day is two food days stacked on one.",
          "Be Our Guest dinner — About $60 and up a person. Keep the other nights at the food court, $15–22. The prix-fixe does not include the Lightning Lane you were also considering for that park."
        ]
      ),
      doTiers: tiers(
        [
          "Magic Kingdom as one park day — The ticket is the $119–209 band, before 6.5% tax. No Park Hopper. You will not also see Epcot fireworks and still rope-drop a land at open.",
          "Disney Springs after dark — $0 to walk in. Dinner there is food, about $15–40 if you sit down, not a park ticket and not a third gate.",
          "Skyliner between resorts after 4 p.m. — $0 for guests at Pop, Art of Animation, Caribbean Beach, or Riviera. It is not a free evening from Port Orleans or from a monorail hotel.",
          "A pool afternoon — $0 beyond the room at Pop Century or Caribbean Beach. On a five-night trip this is the day that keeps a fourth park ticket out of the cart."
        ],
        [
          "Hollywood Studios or Epcot on the gondola — Same 1-day ticket, about $119–209. From a Skyliner resort this is the easy park. From Grand Floridian it is a bus, which is the trade you accepted when you bought the monorail.",
          "Animal Kingdom with lunch at Satu'li Canteen — The park ticket plus about $14–18 for that lunch. It is the shorter day. Pair it with the pool, not with a dash to a second gate.",
          "Lightning Lane Multi Pass — The calculator uses about $16–32 a person per day. Posted peaks have run near $45. On a crowded Magic Kingdom or Studios Saturday it can be the right buy. In late January and the weeks after Labor Day, rope drop usually beats it.",
          "A second dated ticket instead of Hopper — Hopper in the calculator is about $65–105 on top of the base ticket. Two full days in two parks cost more in total and less per park you will actually finish. Hopper wins only if you leave the first park after lunch."
        ],
        [
          "Lightning Lane Single Pass — Rise of the Resistance, TRON, Guardians of the Galaxy, and Flight of Passage sell per ride, often $12–25, and they are not inside Multi Pass. Buying the pass and then paying again at the headliner is the usual surprise.",
          "Memory Maker — About $185 if you buy it ahead, in the calculator. It pays when someone is photographing every park day. One afternoon of photos does not earn $185.",
          "Park Hopper — $65–105 a ticket. On four nights or fewer, most parties use it once, late, and tired. That is an expensive way to stand in a second security line.",
          "Extended evening hours — On selected nights, for Deluxe and villa guests, not for Pop or All-Star. If those hours are why you want Riviera or Beach Club, check the calendar for your dates before you pay $450–700."
        ]
      ),
      walk: {
        lead: "Two adults, four nights at Caribbean Beach, arriving Tuesday, three single-park days, grocery breakfast, counters, and one Studios table. No Hopper, no Multi Pass, no dining plan. The buses and the Skyliner are in the room.",
        lines: [
          line("Room", "$1,440", "Caribbean Beach at $360 a night, four nights. Inside the $280–450 Moderate band, before tax."),
          line("Lodging tax", "$180", "Florida lodging tax at 12.5% of $1,440. All-Star would be 13.5% on a lower rate. This example is not All-Star."),
          line("Food", "$560", "$70 a person, two people, four days. Inside $55–85: breakfast from the grocery run, counters, one table around $45 a person on a single night."),
          line("Tickets", "$894", "Three 1-day tickets at $149, two people. $149 sits inside the $119–209 date range, before sales tax."),
          line("Ticket tax", "$58", "6.5% sales tax on $894. Lightning Lane, if you add it later, is taxed too."),
          line("Getting there", "$0", "Resort buses and the Skyliner. Driving the same three park mornings would add about $35 a day, $105, in gate parking.")
        ],
        day: "A park day, before tax, is the room ($360) plus food for two ($140) plus two 1-day tickets ($298): about $800. That day's share of lodging tax is $45, and ticket tax on those two tickets is about $19, so the day with tax is about $864. A pool day drops the tickets and the ticket tax.",
        tripLabel: "4-night trip",
        trip: "About $3,132 before flights and before Lightning Lane ($1,440 room + $180 lodging tax + $560 food + $894 tickets + $58 ticket tax). Lodging plus food before tax is $2,000, inside the Quick facts sample of $1,550–2,500. That sample does not include tickets or tax.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. Multi Pass, if the Saturday is ugly, is another $16–32 a person on that one day."
      },
      days: [
        day("Magic Kingdom, then stop", [
          "Rope-drop one land. Fantasyland if the party is small children. Tomorrowland if TRON is a Single Pass you already hold, at $12–25, not a hope.",
          "Mobile-order Pecos Bill or Cosmic Ray's, about $14–18. Do not add a character meal the same day unless that meal is the reservation.",
          "Disney Springs or the resort after the fireworks you came for. The bus back is the plan. Epcot the same night is a Hopper you did not buy."
        ]),
        day("The gondola park", [
          "Hollywood Studios if you are at Pop Century, Art of Animation, Caribbean Beach, or Riviera. Epcot if the table is on that side of the lagoon.",
          "Multi Pass on this day only when the date is a holiday or a Saturday, about $16–32, sometimes near $45. Late January, skip it and rope-drop.",
          "Food-court dinner on the way home, about $15–22. If lunch was the table, dinner is not a second one."
        ]),
        day("The short park, or the pool you already rent", [
          "Animal Kingdom with Satu'li Canteen, about $14–18 at lunch, or a full pool day at Caribbean Beach.",
          "A second single-park ticket if you want another gate. Not a Hopper purchased so the afternoon looks busy.",
          "Memory Maker at about $185 only if the first two days were already photo days. Otherwise it does not retroactively pay."
        ])
      ],
      book: [
        "The resort and the dated tickets together. A 1-day, 1-park ticket is about $119–209 before 6.5% tax, and the cheaper dates go first.",
        "Lightning Lane Multi Pass at the on-site window, about seven days before check-in, if Magic Kingdom or Hollywood Studios is a peak day. Off property that window is about three days, and one day at a time.",
        "One table. California Grill, Space 220, Sci-Fi Dine-In, or a character breakfast at $45–75. These are not walk-up.",
        "The ride from Orlando airport (MCO). Mears or rideshare, about $130 round trip for a family of four in the calculator. Magical Express does not exist."
      ],
      hidden: [
        "Florida lodging tax at 12.5% on most Walt Disney World rooms. All-Star Movies, Music, and Sports are in Osceola County at 13.5%.",
        "Sales tax at 6.5% on tickets and on Lightning Lane.",
        "About $35 to park at a theme-park gate. Guests on the bus or the Skyliner do not pay it.",
        "The airport transfer, about $130 round trip for a family of four in the calculator. Nothing in the room rate replaces Magical Express.",
        "Table-service tip, a refillable mug you will not refill every morning, and Memory Maker at about $185 if you add it at the gate instead of ahead."
      ],
      skip: [
        skip("The Disney Dining Plan", "It prices food near the calculator's typical $215 day for four. Counters are $14–18. Buy the counters and one table."),
        skip("Park Hopper on four nights or fewer", "The add-on is about $65–105 a ticket. It pays if you change parks after lunch. It does not pay as a backup plan."),
        skip("International Drive plus a rental, called Budget", "You still owe a car or the airport transfer, about $35 a day in park parking, and a shorter Lightning Lane window than the resort next door.")
      ],
      tips: [
        "Hidden gem: On-site guests can book Lightning Lane Multi Pass about seven days before check-in, for the length of the stay. Off property the window is about three days, one day at a time. That window is a reason to sleep on property. It is separate from what you eat.",
        "Hidden gem: Multi Pass does not include Rise of the Resistance, TRON, Guardians of the Galaxy, or Flight of Passage. Those are Single Pass rides, often $12–25 each, on top of whatever you paid for Multi Pass.",
        "Hidden gem: At Caribbean Beach, ask for a Riviera-side room. The resort is a large campus. A standard assignment can put an internal bus between you and the Skyliner you booked the hotel to ride.",
        "Compare All-Star after 13.5% Osceola tax with Pop Century after 12.5%. The lower rate is not automatically the lower bill, and both still bus to Magic Kingdom.",
        "A Tuesday or Wednesday arrival at Orlando airport (MCO) is a different rate, on the same Pop or All-Star category, than Saturday of that week. Move the night before you move the resort."
      ],
      money: money(
        "About $280–450 a night before tax for a Moderate such as Caribbean Beach or Port Orleans. Value rooms sit nearer $150–310. A monorail Deluxe is a different band, about $500–750.",
        "About $55–85 with grocery breakfast, a food-court lunch, and one table. The calculator's party-of-four line runs about $130 on a light day and about $320 on a heavy signature day.",
        "A 1-day, 1-park ticket is about $119–209 before 6.5% tax, Animal Kingdom at the floor and Magic Kingdom peak at the ceiling. Hopper ($65–105 in the calculator) and Lightning Lane are separate products.",
        "Four Moderate nights run about $1,550–2,500 in lodging plus food for two, before tax, tickets, and flights (orientation)."
      ),
      sources: [
        "On-site Lightning Lane Multi Pass window is about seven days out; off-site is shorter and day-by-day",
        "Single Pass headliners (Rise, TRON, Guardians, Flight of Passage) are not included in Multi Pass"
      ]
    },

    nyc: {
      hook: "New York gets expensive when the hotel is a Times Square room you leave before breakfast, and lunch keeps happening downstairs. The subway is $3. A $300 rate stops being $300 once you add 14.75% lodging tax and, at some hotels, a destination fee.",
      blurb: "Book a hotel with the subway downstairs: Ace Hotel NoMad, citizenM Bowery, or Pod 39. Price the room after 14.75% tax and any destination fee. One museum or one show, not three observation decks.",
      nights: "3–4 nights near one subway stop",
      midrange: "Ace Hotel NoMad or The Hoxton, corner-deli breakfast, one sit-down",
      months: "Late January into February, and September after Labor Day. Friday and Saturday in the same building are not the Tuesday rate.",
      startHere: "Book a hotel with the subway downstairs (Ace Hotel NoMad, citizenM Bowery, Pod 39). The Hoxton Williamsburg if you want to sleep in Brooklyn and ride back to Manhattan. Then buy the Met, MoMA, or one Broadway seat.",
      tipsKicker: "Twelve rides is the fare cap. Most long weekends never get there.",
      cta: "Build the New York Trip Plan from the subway stop under the hotel. Put 14.75% and any destination fee in the room before you add the Met or a show.",
      forWho: [
        "People who will eat in the neighborhood they slept in and ride the train twice a day",
        "A trip with one museum or one show, and no interest in collecting observation decks"
      ],
      notFor: [
        "Anyone who wants a car, a Times Square view, and a reservation in a different borough every night"
      ],
      aroundKind: "transit",
      aroundRule: "You do not need a car. Tap-to-pay on the subway or a local bus (OMNY) is $3. The same card or phone caps at $35 after 12 paid local rides inside seven days, counted from your first tap, not from Monday. A Manhattan garage is often $50–80 a night before the tunnel.",
      aroundNoCar: [
        "Keep tapping the same phone or card. Twelve local rides in seven days is the $35 cap. Six rides on a three-day trip is $18 a person, and the cap never starts",
        "The Staten Island Ferry is free, day and night, with no ticket. A harbor cruise at $30–40 sells a chair for a view you can stand and watch",
        "Jackson Heights and Flushing, in Queens, are the same $3 subway fare as a ride to Times Square. The 7 train is the one that goes there"
      ],
      stayRule: "Compare rooms after 14.75% lodging tax, and after you have asked whether a destination fee exists. A $320 NoMad rate and a $290 Times Square rate are not the same bill if only one of them adds $40 a night.",
      eatRule: "Breakfast is a corner deli or a bakery, $5–12. Three $28 Midtown salads are $84, which is a rush ticket. One sit-down in the neighborhood you slept in is the mid dinner. Wine is how that dinner leaves the $55–95 band.",
      doRule: "The free city is the ferry, the bridge, and the High Line. The paid city is one museum at about $30, or one show. Summit, Edge, and Top of the Rock are a third purchase, about $40 each, and they stack badly.",
      zones: [
        zone("Near Ace Hotel NoMad", "Ace Hotel NoMad, or Arlo NoMad if you want the room smaller. The subway is a short walk (the 6 and the N/R/W, if you are checking a map). Mid rooms here run about $300–450 before the 14.75% tax. Dinner can stay in the neighborhood."),
        zone("Downtown, the Bowery", "citizenM Bowery, The Ludlow, or The Beekman if you are closer to the Staten Island Ferry. The subway is downstairs (the F or the 6). A downtown dinner does not need a car across town."),
        zone("Williamsburg, Brooklyn", "The Hoxton, often $280–420 before tax, with the subway back to Manhattan (the L train). The rate wins until every dinner is in Manhattan after 11 p.m. and you stop being willing to ride back."),
        zone("Times Square, narrowly", "Pod 39 can make sense: a small room, about $180–280 before tax, with the subway downstairs. A full-size tower with a destination fee is a billboard you will not watch."),
        zone("By Central Park", "1 Hotel Central Park, The Mark, or a Fifth Avenue flagship. Often $700 and up before tax. You bought the block. The subway is still $3.")
      ],
      stayTiers: tiers(
        [
          "Pod 39 — A small Midtown room, about $180–280 a night before New York's 14.75% lodging tax. You are paying for a bed and a subway, not a desk. It fails for a family that needs a real closet and then quietly adds a second room.",
          "citizenM Bowery — Downtown, about $200–320 before tax, with the subway downstairs (the F and the 6). The room is compact on purpose. If you need a suite, you are no longer in this band.",
          "The Jane — A downtown cabin rather than a Times Square tower. When the dates are quiet it sits nearer the Pod band, about $180–280 before tax, and only if the party accepts the size. A cheaper room in Queens or Brooklyn can undercut it, and then every late night is a last-train problem.",
          "Motto by Hilton Chelsea — A Chelsea hotel with the subway nearby (the 1 or the A/C/E), about $200–300 before tax. A full-service flag without a Times Square view. Ask about a destination fee before you treat it as the cheap Hilton. Some Manhattan hotels in this family add $25–45 a night."
        ],
        [
          "Ace Hotel NoMad — The mid default, about $300–450 a night before 14.75% tax. Trains and dinner are both a walk. If this property is charging a destination fee, put it in the comparison before you call Williamsburg more expensive.",
          "The Beekman — Downtown near the Staten Island Ferry, in the Financial District, at the top of the mid band or just over it. Right if your days start at the ferry. A poor fit if every morning is MoMA: that is a long subway, which is fine, or a $25–40 rideshare, which spends the room.",
          "The Hoxton Williamsburg — Often $280–420 before tax, across the river in Brooklyn. The subway back to 14th Street in Manhattan is short (the L train). The mid tip fails when the curtain is at 8 and you have a second late table in the West Village. Those Ubers, $25–50 each, erase the discount.",
          "Arlo NoMad — A smaller room on the same trains as Ace, often inside $300–450 before tax. Take it over a Times Square Marriott when the rates are close. The neon is not an amenity."
        ],
        [
          "1 Hotel Central Park — The park address, often $700–1,200 before tax. The subway is still $3. You bought the block, not a better fare, and a crosstown meeting is still a walk or a train.",
          "The Greenwich Hotel — A downtown suite-level night, in the same range as 1 Hotel Central Park at $700–1,200 before tax. Keep the trip in one neighborhood. Do not also book a Midtown flagship for the two nights you have a show. Two luxury rates is a different vacation.",
          "Park Hyatt New York — Midtown flagship, often $800–1,400 before tax. Breakfast is not in that figure. A hotel breakfast here can pass $40 a person, which is a week of corner-deli sandwiches.",
          "The Mark — Upper East Side, beside Central Park. The subway is how you get downtown (the 6 train). A cab habit to Midtown is a second hotel bill by the third day, at $20–40 a ride, on top of a rate that was already the splurge."
        ]
      ),
      eatTiers: tiers(
        [
          "An egg-and-cheese from a corner deli — About $5–7, on the walk to the subway. That is breakfast. The hotel dining room is a choice you should notice on the folio.",
          "A slice — Commonly $3–5 now, not the old dollar. Two slices and a soda still beat a $28 Midtown salad, and you can eat them outside.",
          "Xi'an Famous Foods — Noodles, about $12–16, in several neighborhoods the subway already reaches. This is lunch. It does not need a reservation or a neighborhood tour.",
          "Dinner in Jackson Heights or Flushing, Queens — Often $12–20 a person, on the same $3 subway fare as Times Square (the 7 train). Do it once if the other meals have all been within two blocks of the hotel."
        ],
        [
          "Russ & Daughters Cafe — A downtown breakfast or lunch, about $20–35 a person. Once. The shop counter next door is the less expensive version of the same appetite.",
          "Katz's — A pastrami sandwich runs about $25–30. Share it if you also wanted a slice. Ordering it alone with sides is how a sandwich becomes a $50 lunch.",
          "L'Artusi or Via Carota — One Village reservation, about $40–70 a person before wine. Book Via Carota or accept that you will wait. A bottle each is the line that leaves the $55–95 food band.",
          "Lilia — If you slept at The Hoxton, this is the neighborhood reservation, about $40–80 a person. A Midtown lunch the same day means you paid Williamsburg rates and then refused to eat there."
        ],
        [
          "Le Bernardin — A prix fixe that often starts near $200 a person. One reservation. The next morning is a corner deli, on purpose, not a second tasting.",
          "Carbone — If you can get the table, about $100–150 a person. Book it before you fly. A walk-in plan is how you end up at a different red-sauce restaurant, still not cheap.",
          "Grand Central Oyster Bar — Sit-down lunch under the trains, about $40–70. It belongs on a day you are already in the terminal. As a daily habit it is a second hotel breakfast.",
          "Balthazar — SoHo breakfast, about $25–40. Less than a dining room at The Mark or a St. Regis, and you should not be in those dining rooms unless the room was the reason you came."
        ]
      ),
      doTiers: tiers(
        [
          "The Staten Island Ferry — $0. No ticket and nothing to tap, day and night. Stand outside on the return toward Manhattan. This is the skyline.",
          "The Brooklyn Bridge on foot — $0. Start from the borough you slept in so the walk ends near a train, not near a rideshare negotiation.",
          "The High Line — $0 to enter. The cost is a meal at the south end of the walk, in the Meatpacking District, that you did not plan. Eat first. The walk itself does not have a toll.",
          "Pay-what-you-wish — Only if you qualify. New York residents and visitors are not the same policy at the Met. Visitors should budget about $30 at the Met or at MoMA instead of hoping."
        ],
        [
          "MoMA — General admission about $30. This or the Met, not both the same afternoon. They are far enough apart that 'both' means a rushed pair of lobbies.",
          "The Met — About $30 for visitors who do not live in New York. The building is a half day if you let it be. A second museum after it is a second ticket and a smaller attention span.",
          "The Brooklyn Heights promenade — Free, including the waterfront just south of the Brooklyn Bridge (Dumbo). The subway there is $3 (the A, C, or F). A rideshare across the East River is often $25–40 for the same view.",
          "TKTS or a rush seat — Often $80–120 once fees sit on the face price. A full orchestra seat at $150–250 is a different purchase. Decide which one you are in before you are standing in the square."
        ],
        [
          "One deck — Summit, Edge, or Top of the Rock, about $40. The second deck is another $40 for a skyline you have seen. The ferry was $0.",
          "A reserved Broadway seat — $150–250 plus fees, at the Gershwin, the Majestic, or whichever house the show is actually in. That is the splurge. It does not require a deck on the same night.",
          "A guided harbor cruise — About $30–40 for a chair. Buy it if someone cannot stand on the ferry. Otherwise you paid for seating.",
          "A Manhattan garage — Often $50–80 a night, plus tolls. Three nights is $150–240 before the rental. The train under the hotel was $3 a ride."
        ]
      ),
      walk: {
        lead: "Two adults, three nights at Ace Hotel NoMad. This example has no destination fee. Corner-deli breakfast, one dinner near the hotel or in the Village, six subway rides each, the Met, and one TKTS seat apiece. The fare cap does not trigger.",
        lines: [
          line("Room", "$1,080", "Ace Hotel NoMad at $360 a night, three nights. Inside the $300–450 mid band, before tax."),
          line("Lodging tax", "$159", "14.75% of $1,080. This is the combined city and state lodging tax used in Trip Plan. It is not optional, and it is not the destination fee."),
          line("Unit fee", "$11", "About $3.50 a night for three nights, the hotel unit charge under the percentage. If a destination fee of $25–45 a night also appears, add $75–135. It is not in this example."),
          line("Food", "$450", "$75 a person, two people, three days. Inside $55–95: corner-deli mornings, one sit-down, no wine program."),
          line("Subway", "$36", "Tap-to-pay (OMNY) at $3 times six local rides times two people. The $35 cap needs 12 paid rides on the same card or phone. This trip never gets there. You pay the rides."),
          line("Met and TKTS", "$240", "The Met at $30 times two, plus a TKTS seat at $90 times two. MoMA would be the same $30. A full-price orchestra seat would replace the $90 with something nearer $150–250.")
        ],
        day: "The museum day is the room ($360) plus that night's share of lodging tax (about $53) plus food for two ($150) plus four subway rides ($12) plus two Met tickets ($60): about $635, before the unit fee of about $4 that day.",
        tripLabel: "3-night trip",
        trip: "About $1,976 before flights ($1,080 room + $159 tax + $11 unit fee + $450 food + $36 subway + $240 tickets). Lodging plus food before tax is $1,530, inside the Quick facts sample of $1,250–1,900. A destination fee, if the folio has one, adds $75–135 and is outside that sample.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. The ferry, if you swap it in for a deck, stays at $0."
      },
      days: [
        day("The neighborhood, then the ferry", [
          "Walk where you slept. From Ace Hotel NoMad, ride the subway downtown. From the Hoxton in Williamsburg, ride to Union Square in Manhattan, not a car across the river.",
          "Staten Island Ferry at dusk. $0. Stay for the return if the light is good.",
          "Dinner on the same side of the city as the hotel. A cross-town reservation is tomorrow's problem, or it is a $25–50 ride."
        ]),
        day("One museum, and stop", [
          "The Met or MoMA, about $30, and let it take the middle of the day. Not both.",
          "One lunch near the museum. The other meal that day is a slice at $3–5 or a corner deli.",
          "Brooklyn Heights if you still want to be outside. The train is $3. A harbor cruise is usually the ferry with a chair."
        ]),
        day("A Broadway seat, or dinner in Queens", [
          "TKTS or rush if a show is why you came, often $80–120 after fees. Or dinner in Jackson Heights or Flushing, $12–20, one subway ride from Manhattan (the 7 train).",
          "Do not add Summit and Edge because the afternoon looks empty. One deck is about $40. Zero decks is a finished day.",
          "A corner deli in the morning. Hotel breakfast is the splurge you did not book, and at a flagship it can pass $40 a person."
        ])
      ],
      book: [
        "The hotel, after 14.75% is on the quote and after you have asked about a destination fee. Forty dollars a night is $120 on this three-night example.",
        "The Met or MoMA if you want a morning entry. About $30 for out-of-town visitors. Residents should read the current policy instead of assuming the $30.",
        "Broadway, if it matters, through the show's lottery, rush, or TKTS. A full-price seat is $150–250 and should be a decision you make at home.",
        "Nothing for the Staten Island Ferry. Do not buy a harbor cruise as a backup you feel you should hold."
      ],
      hidden: [
        "New York lodging tax at 14.75% on the room rate.",
        "A hotel unit fee, about $3.50 a night, underneath that percentage.",
        "A destination fee at some Manhattan hotels, often $25–45 a night. It is not the tax. It is a second line.",
        "Fees on a Broadway ticket. A TKTS price that looks like $80 can leave the window closer to $100.",
        "Rideshares that copy a subway trip, often $25–50 to cross a river the train already crosses for $3."
      ],
      skip: [
        skip("Three observation decks", "Summit, Edge, and Top of the Rock are about $40 each. Buy one, or take the ferry for $0."),
        skip("A Times Square hotel chosen for the neon", "You will leave by 9 a.m. Pod 39 can be worth it for the train and the small room. A full-rate tower with a destination fee is not."),
        skip("A Midtown lunch circuit", "Three $28 salads are $84. That is a rush ticket. One of those lunches should be a slice, or dinner in Queens.")
      ],
      tips: [
        "Hidden gem: Subway tap-to-pay (OMNY) caps at $35 after 12 local rides in seven days, on one card or phone, starting from the first tap. Two rides a day for three days never hits it. You owe $3 a ride. Do not buy an old unlimited MetroCard out of habit.",
        "Hidden gem: The Staten Island Ferry does not have a ticket booth and does not cost money. Summit, Edge, and Top of the Rock are three different paid skies. If you only buy one view, buy none and ride the ferry.",
        "Hidden gem: Jackson Heights and Flushing, in Queens, are one subway ride at $3 (the 7 train) and a dinner that often runs $12–20 a person. Three Midtown salads cost more and stay in the same ten blocks.",
        "Ask whether a destination fee is included before you compare Ace Hotel NoMad with a Times Square rate. The 14.75% tax hits both. The fee might hit only one.",
        "Friday and Saturday in the building you want are not the Tuesday rate. If the dates can move, check that before you change neighborhoods to save forty dollars."
      ],
      money: money(
        "About $300–450 a night before tax, downtown, near Ace Hotel NoMad, or in Williamsburg, Brooklyn, at The Hoxton. Shoulder weeks in the 2026 tables sit nearer $300–420. Holiday weeks can run toward $580. The 14.75% tax is on top.",
        "About $55–95 with a corner-deli breakfast and one neighborhood dinner. Three $28 Midtown salads are the habit that leaves this band.",
        "The Met or MoMA is about $30 for out-of-town visitors. A TKTS or rush Broadway seat often lands $80–120 after fees. The Staten Island Ferry is free.",
        "Three mid-range nights run about $1,250–1,900 in lodging plus food for two, before tax, fees, and flights (orientation)."
      ),
      sources: [
        "MTA tariff: $3 base fare and a $35 OMNY cap after 12 local rides in seven days",
        "NYC combined lodging tax in Trip Plan is 14.75%, separate from destination fees and the hotel unit fee"
      ]
    },

    paris: {
      hook: "Paris gets expensive in three specific purchases: a room priced for a view of the tower, a summit ticket bought from a reseller, and lunch at a table aimed at the iron. A bakery on the block and one museum, bought on that museum's own site, is a different week by hundreds of euros.",
      blurb: "Book a hotel by Gare du Nord or République, with the Metro downstairs. The VAT (TVA) is already in the room quote. The taxe de séjour, a small per-person nightly charge, is not. Buy one museum, and do not buy a Monday–Sunday Navigo pass for a Wednesday arrival.",
      nights: "4 nights in one neighborhood",
      midrange: "A canal or Left Bank 3-star, bakery breakfast, one bistro",
      months: "January into early March, and November. August is cheaper and half the kitchens you wanted are shut.",
      startHere: "Book a mid hotel by Gare du Nord or République (Ibis or similar), Metro downstairs, bakery breakfast — not a tower-view room by the Eiffel. Choose the Louvre or the Orsay before you fly, on the museum's site. If the dinner is Septime, the reservation has to exist before the flight does.",
      tipsKicker: "The week pass starts Monday, even if your plane does not",
      cta: "Build the Paris Trip Plan in euros, from one neighborhood on the Metro. Add one museum. Add Septime only if you already hold the table.",
      forWho: [
        "Travelers who will eat breakfast downstairs and enter one major museum on a timed ticket they bought themselves"
      ],
      notFor: [
        "A first trip that needs the summit, Versailles, the Louvre, and the Orsay finished before Thursday",
        "Anyone who wants a car in the center 'for the evening'"
      ],
      aroundKind: "transit",
      aroundRule: "You do not need a car. A single Metro or bus ride is about €2.50. The Navigo week pass for central Paris and the suburbs (zones 1–5) is about €32 and runs Monday through Sunday. It is not seven rolling days from the morning you land. A rental parked near Gare du Nord is a parking problem.",
      aroundNoCar: [
        "Land on Monday and leave on Sunday, and Navigo Semaine at about €32 can beat a stack of €2.50 tickets. Land on Wednesday and that same pass charges you for Monday and Tuesday, when you were not in the city",
        "A day pass (Navigo Jour) covers the day you will actually ride four times. On a museum day with two taps, single tickets may be the smaller number. Do the count before you buy the week",
        "Versailles is a half day on the suburban train from central Paris (RER line C). A Navigo week pass may cover the train and still not cover the palace, about €21"
      ],
      stayRule: "Paris quotes usually include TVA, the VAT inside the price. They do not include the taxe de séjour, charged per person per night and higher in a palace than in an Ibis, roughly €2–8. Do not add another 10% and call it the Paris rate. Trip Plan's Europe assumption is not this city's statutory number.",
      eatRule: "A pastry and a coffee downstairs are about €4–7. A set-price lunch at a bouillon, the formule, is about €20–30. One booked dinner is the mid week. A table facing the tower is a surcharge for a view you can already get from Trocadéro, the plaza across from the Eiffel.",
      doRule: "See the tower from Trocadéro, the plaza across the river, for €0. Buy the Louvre or the Orsay from the museum. Since 14 January 2026 the Louvre is €32 if you live outside the EEA (that includes the US) and €22 if you live in the EEA. A 2-day Museum Pass, about €60, loses if you only go through one door.",
      zones: [
        zone("Near Gare du Nord", "Ibis Paris Gare du Nord, Metro downstairs, a bakery on the block. Rooms often €120–180 with the VAT (TVA) already in the quote. You are not paying for a tower outside the window."),
        zone("République / Canal Saint-Martin", "Ibis Styles, or a walk-up near Oberkampf, often €130–200. The canal is a dinner walk. This base fails when every plan is a 9 a.m. Louvre and a Left Bank dinner: you will spend the savings in taxis."),
        zone("A canal hotel", "Hôtel Fabric or another Canal Saint-Martin boutique, about €190–280. The mid-range room that is not a tower with a view of the Eiffel."),
        zone("Left Bank near Odéon (Latin Quarter)", "Hôtel Malte's side of town, or a 3-star near the Odéon Metro, about €200–320. Pay it when the days are the museums and a Left Bank table. Do not pay it and then cab to the canal every night."),
        zone("Concorde and Place Vendôme", "Hôtel de Crillon, Le Bristol, the Ritz, Cheval Blanc. Often €900 and up. Breakfast in the hotel is its own line. The corner bakery is still about €5.")
      ],
      stayTiers: tiers(
        [
          "Ibis Paris Gare du Nord — Metro at the door, often €120–180 with TVA already in the quote. You land and you sleep. A room by the Eiffel with a tower view, €80–150 more a night, is a different purchase.",
          "Ibis Styles Paris République — Near République and Canal Saint-Martin, about €130–190. Better if dinner is a walk to the canal. Worse if you will not ride a Metro in the morning and intend to taxi to the Louvre every day at €15–25 a ride.",
          "Holiday Inn Express Paris Canal de la Villette — About €120–180, the night the train from Charles de Gaulle airport gets you in late. It is a bed at the north end of the canal. It is not a week in Saint-Germain, on the Left Bank. Stay on if the rest of the trip is actually up here.",
          "A walk-up near Oberkampf, a short walk from République — A two-star, sometimes under the Ibis at €120–180, if you can live with stairs and a smaller room. The taxe de séjour is lower here than at a palace and it is still not zero. Budget a few euros a person per night on top of a rate that looked finished."
        ],
        [
          "Hôtel Fabric — Canal Saint-Martin boutique, about €190–280 a night. This is the canal hotel in the mid band. Dinner can be on the block. The tip fails when you treat it as a base for a daily taxi to the Eiffel Tower, at €20–30 each way.",
          "Hôtel Malte — Or a Left Bank 3-star near Odéon, in the Latin Quarter, about €200–320, when that side of the river is the week you wanted. You are closer to the Louvre and the Orsay. Eat there. Commuting back to République for a cheaper bistro spends the difference.",
          "Novotel Paris Les Halles — Central, about €200–300, useful for the Louvre and the Châtelet Metro hub. The failure is paying Les Halles money to face a shopping center when Fabric, on the canal, is the same band and a better walk to dinner.",
          "Hilton Paris Opera — One neighborhood for the whole stay, about €220–340, near the Opéra. Stop splitting the week. A night by the Louvre and a night in Montmartre is two tax bills and a lost afternoon in between."
        ],
        [
          "Cheval Blanc — On the quai. Palace rates that often start around €1,000 a night. The bakery downstairs did not get more expensive. The room did. The Metro, if you use it, is still about €2.50.",
          "Hôtel de Crillon — Place de la Concorde, often €900 and up. Breakfast in the hotel is frequently €50 and up a person. That morning is the splurge. It is not what the rate quietly included.",
          "The Ritz or Park Hyatt Paris-Vendôme — Place Vendôme, often €1,000 and up. You are paying for the address. Taxis that replace the Metro do not come back out of that rate. They add up at €15–30 a hop.",
          "Lutetia — Left Bank, about €500–900. Take a bakery breakfast unless the dining room is why you chose it. Le Bristol is the other palace breakfast people treat as included. It is not. It is often €50 and up."
        ]
      ),
      eatTiers: tiers(
        [
          "Du Pain et des Idées — If you are staying near Gare du Nord. Coffee and a pastry, about €4–7. A palace breakfast is not a better croissant. It is a room-service price.",
          "Bouillon Chartier or Bouillon Pigalle — A set menu, about €20–30 a person, noise included. This is the lunch that keeps Septime from becoming an idea you have every night.",
          "L'As du Fallafel — About €10 in the Marais. Dinner, no tower, a line that moves. It is a complete meal at a price the museums' cafes do not match.",
          "A fromagerie and a bottle — About €15–25 for two, in the room or on the canal. A valid dinner. You do not need a white tablecloth every night to have been fed in Paris."
        ],
        [
          "Bouillon Julien — A step up from Chartier, about €25–40 a person. Still a set menu, not a tasting menu, and still the right call on a night you do not hold a reservation.",
          "Marché des Enfants Rouges — Market lunch in the Marais, about €12–20. Go hungry. Do not add a seated dinner the same afternoon because the market felt informal.",
          "Septime La Cave or Clamato — When the main Septime room is gone. About €40–70 a person. Same world, not the same reservation, and not a 9 p.m. walk-in on Saturday.",
          "A bistro near Gare du Nord — One table near the hotel, about €35–55 a person. Wine by the glass keeps the day inside €30–55. A bottle apiece does not."
        ],
        [
          "Septime — About €80–120 a person. The book opens and then it is gone. If you do not have it, you do not have it. Eat at the cave, or eat at the bistro.",
          "Frenchie — About €70–110, and not the same night as Septime. Both on a four-night trip pushes food well past €30–55 a person per day. Pick one.",
          "Le Comptoir du Relais — The counter fills early. About €50–80. It is not a walk-up you attempt at 9 p.m. after the Louvre.",
          "Breakfast at Le Bristol or Hôtel de Crillon — Often €50 and up a person. Once, if the hotel is the trip. The other mornings, the block bakery is about €5."
        ]
      ),
      doTiers: tiers(
        [
          "Trocadéro at dusk — €0 for the picture. The restaurants on the steps are optional and priced for the angle. You can leave without eating.",
          "The Metro — About €2.50 a ride, or a Monday-to-Sunday Navigo at about €32 if those are truly your dates. A Wednesday arrival should not buy the week.",
          "The banks of the Seine — €0. Walk back from the museum you already entered. A dinner cruise the same night, at €60–100, is a second view of a river you are standing next to.",
          "Père Lachaise cemetery, or the canal — €0 beyond the pastry, about €4–7. This is the evening that makes a hotel by République or Canal Saint-Martin the right hotel."
        ],
        [
          "The Louvre — €32 if you live outside the EEA, including the US, and €22 if you live in the EEA. Timed, on the museum's site, at the rates in force since 14 January 2026. A reseller bundle is often €20 more for the same door.",
          "Musée d'Orsay — €16 online, €14 at the door, on a different day from the Louvre. Both in one afternoon means you paid full price to rush two buildings.",
          "Musée de l'Orangerie — A smaller timed ticket, about €12. The water lilies, then you are done. It is not a third giant museum to stack on the Louvre.",
          "A 2-day Paris Museum Pass — Around €60. It wins if you will enter two paying museums and a monument. It loses on a single Louvre visit at €22 or €32."
        ],
        [
          "The official summit elevator — Around €35 on the tower's own site. Stairs to the second floor cost less. A kiosk price is not a different elevator.",
          "Versailles — The palace is about €21, plus the suburban train from central Paris (RER line C) unless the Navigo week pass you already hold covers the ride. Give it the morning. It does not share an afternoon with the Louvre.",
          "A Seine dinner cruise — About €60–100 a person for a seated version of the Trocadéro view. Buy it if the dinner is the point. Do not buy it because the tower felt unfinished.",
          "Sainte-Chapelle — A timed ticket, about €13. In winter the glass wants daylight. Pair it with a Left Bank walk, not with a summit the same hour."
        ]
      ),
      walk: {
        lead: "Two adults visiting from the United States. Four nights at a hotel by République or on Canal Saint-Martin. They arrive Monday, so a Navigo week pass matches the calendar. Bakery breakfast, one bistro inside the food band, and the Louvre. Orsay is not in this total. The planning rate used here is $1 ≈ €0.92.",
        lines: [
          line("Room", "€1,040", "€260 a night, four nights. Inside €190–330. TVA is already inside the quote. At $1 ≈ €0.92 that room total is about $1,130."),
          line("Taxe de séjour", "€32", "A mid-hotel assumption of €4 a person per night: €4 × 2 × 4. The legal amount varies by class, roughly €2–8 a person, and a palace is the high end. This is not a second VAT."),
          line("Food", "€336", "€42 a person, two people, four days. Inside €30–55. Bakery mornings, a set-price lunch, one bistro. Not Septime."),
          line("Navigo", "€64", "The Monday–Sunday week pass for central Paris (zones 1–5), about €32 × 2, because this example starts on Monday. Arrive Wednesday and skip it: eight rides at €2.50 is €20 a person, €40 for two."),
          line("Louvre", "€64", "€32 × 2 for visitors from outside the EEA, including the US. If you live in the EEA the tickets are €22 each, and this line would be €44. Buy them on the museum's site.")
        ],
        day: "The museum day is the room (€260) plus food for two (€84) plus a pair of Metro rides if you are not on the Navigo (about €10) plus two Louvre tickets (€64): about €420, before that night's taxe de séjour.",
        tripLabel: "4-night trip",
        trip: "About €1,536 before flights (€1,040 lodging + €32 taxe de séjour + €336 food + €64 Navigo + €64 Louvre). Lodging plus food is €1,376, inside the Quick facts sample of €1,000–1,750. At $1 ≈ €0.92, €1,536 is about $1,670. The sample is in euros and it is before flights.",
        note: "Worked example inside the Quick facts bands. Public rates, not a live quote. If the arrival day is not Monday, replace the Navigo line before you trust the total."
      },
      days: [
        day("The block, then the tower from the ground", [
          "Bakery downstairs, about €4–7. Do not open the trip with a hotel breakfast you did not mean to buy.",
          "Metro to Trocadéro, about €2.50 if you are on single tickets. The picture is free. The elevator, about €35 on the official site, replaces this stop. It does not follow it as a second activity the same hour.",
          "Dinner in the neighborhood you slept in. A bouillon set menu at €20–30 if you do not hold a table."
        ]),
        day("One museum, on its own site", [
          "The Louvre at opening, timed, €22 or €32. Or the Orsay at €16 online, if that was the choice you made before the flight. Not both.",
          "Lunch is a set menu or the market, €12–30. Not a second museum, and not the cafeteria as the plan.",
          "Walk the Seine toward home. The cruise, at €60–100, can wait for a night you are not already tired."
        ]),
        day("Versailles, or a smaller ticket", [
          "If Versailles is the day, take the suburban train from central Paris (RER line C) in the morning and the palace at about €21. Be back before dinner. The Louvre is not this afternoon.",
          "If you skip the palace, Orangerie at about €12 or Sainte-Chapelle at about €13, then the canal or the Marais on foot.",
          "Septime only with a reservation in hand, at €80–120. Frenchie is also not a walk-in. The bistro on the block, €35–55, is the dinner that actually happens."
        ])
      ],
      book: [
        "The Louvre (€22 if you live in the EEA, €32 for US visitors and everyone else) or the Orsay (€16 online), on the museum's site, before you look at a bundle.",
        "Septime, Frenchie, or Le Comptoir if that table is the point of the trip. They run about €50–120 a person and do not accept a same-evening hope.",
        "The Monday–Sunday Navigo week pass, about €32 for central Paris (zones 1–5), only when your dates are Monday through Sunday. Otherwise single rides at about €2.50, or a day pass (Navigo Jour) on the day you will ride.",
        "The flight, midweek, as early as the fare looks real. A round trip you will use beats an open-jaw you will pay to change."
      ],
      hidden: [
        "The taxe de séjour, roughly €2–8 a person per night by hotel class, on top of a rate that already includes TVA.",
        "A tower-view room, often €80–150 a night above a hotel near Gare du Nord, for a view you can see from Trocadéro.",
        "An official summit elevator, about €35, if you add it on top of a Louvre ticket.",
        "A 2-day Museum Pass, about €60, which loses when you walk through one museum.",
        "Versailles at about €21 plus the train from central Paris, and a reseller's museum bundle, often €20 over the official price."
      ],
      skip: [
        skip("A reseller's skip-the-line bundle", "The official Louvre is €22 or €32. The official elevator is about €35. The bundle is frequently that same door plus a markup."),
        skip("Navigo Semaine when you land on Wednesday", "The pass is Monday through Sunday, about €32. You would be buying two days you are not here. Use single tickets or a day pass."),
        skip("Lunch under the tower, then a dinner cruise", "Trocadéro was free. One paid view is a decision. Two is how food leaves the €30–55 band.")
      ],
      tips: [
        "Hidden gem: Navigo Semaine does not start when you land. It starts on Monday and ends on Sunday. A Wednesday-to-Tuesday trip should not buy it. Count the days you are actually in the city.",
        "Hidden gem: A Museum Pass around €60 for two days can beat two museums plus a monument. One Louvre or one Orsay is cheaper as a single timed ticket on the museum's own site.",
        "Hidden gem: The tower from Trocadéro is free. If you still want the summit, buy the elevator on the official site, about €35. A kiosk is not a different elevator.",
        "The room quote includes TVA. The taxe de séjour is extra, per person, per night, and higher at a palace than at an Ibis. Do not lay a flat 10% on a rate that already has VAT inside it.",
        "Versailles is a morning on the suburban train from central Paris (RER line C) and about €21 at the palace. It does not fit after a Louvre opening. Give it the day or take it off the list."
      ],
      money: money(
        "About €190–330 a night for a mid hotel near Gare du Nord, by République, or on the Left Bank near Odéon. That is the Trip Finder shoulder band of about $200–350, converted at roughly $1 ≈ €0.92. TVA is usually in the quote. The taxe de séjour is not.",
        "About €30–55 with a bakery breakfast, a set-price lunch, and one dinner. A Septime night at €80–120 is the exception, not the daily rate.",
        "The Louvre is €32 for visitors from outside the EEA, including the US, and €22 if you live in the EEA. The Orsay is €16 online. A single museum beats a Museum Pass. The Metro is about €2.50, or about €32 for a Monday–Sunday Navigo week pass covering central Paris (zones 1–5).",
        "Four mid-range nights run about €1,000–1,750 in lodging plus food for two, before flights (orientation)."
      ),
      sources: [
        "Louvre: €22 EEA and €32 non-EEA from 14 January 2026; buy on the museum site",
        "Navigo Semaine is Monday–Sunday, zones 1–5 about €32, not a rolling week from arrival",
        "Taxe de séjour is per person per night and separate from TVA already inside most hotel quotes"
      ]
    }
  };

  var BANNED = /\b(basin|leftover|pocket|orientation data|scavenger|villages connected|hostel-plus)\b/i;
  var TAX_META = /\b(are a tax|is usually a tax|Hopper tax|tourist tax|half-day tax|Friday arrivals are a tax|SEPTA tax|room-service tax|restaurant-row tax)\b/i;
  var VAGUE = /\b(already priced|one named|a named dinner|a named chef|the same walk)\b/i;

  Object.keys(PILOT).forEach(function (id) {
    var g = pack.BY_ID[id];
    var row = PILOT[id];
    if (!g) throw new Error("pilot missing guide " + id);
    Object.keys(row).forEach(function (k) {
      if (k === "sources") return;
      g[k] = row[k];
    });
    if (!g.updated || g.updated.indexOf("Compiled Sep 2026") < 0) {
      g.updated = "Compiled Sep 2026 from public rates, official calendars, and transit maps — orientation, not a field visit.";
    }
    if (row.sources && R[id]) {
      R[id].sources = (R[id].sources || []).concat(row.sources);
    }
    ["stayTiers", "eatTiers", "doTiers"].forEach(function (key) {
      ["budget", "mid", "lux"].forEach(function (band) {
        if (!g[key][band] || g[key][band].length < 4) {
          throw new Error(id + ": pilot " + key + " " + band + " needs 4");
        }
      });
    });
    var gems = (g.tips || []).filter(function (t) { return /^Hidden gem:/.test(t); });
    if (g.tips.length !== 5 || gems.length !== 3) {
      throw new Error(id + ": pilot tips " + g.tips.length + " gems " + gems.length);
    }
    var blob = JSON.stringify(g);
    if (BANNED.test(blob)) throw new Error(id + ": pilot banned word");
    if (TAX_META.test(blob)) throw new Error(id + ": pilot tax metaphor");
    if (VAGUE.test(blob)) throw new Error(id + ": pilot vague phrase");
    if (/often about/i.test(blob)) throw new Error(id + ": pilot often-about rhythm");
    if (/The overrun is/i.test(g.hook)) throw new Error(id + ": overrun hook");
    if (id === "disney" && /Orange County|Orange-side/i.test(blob)) {
      throw new Error("disney: Orange County wording");
    }
    if (id === "disney" && blob.indexOf("12.5%") < 0) throw new Error("disney: missing 12.5%");
  });
})(typeof window !== "undefined" ? window : this);
