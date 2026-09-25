/* Densification pass: hard dollars on Stay / Eat / Do, longer branded lists,
   and a mid-range day/trip walkthrough. Loaded after city-guides-polish.js.
   Does not reorder the locked outline. Rates are public-page orientation,
   not a field visit and not a live quote.
*/
(function (global) {
  "use strict";

  var pack = global.VM_CITY_GUIDES;
  var R = global.VM_CITY_GUIDE_RESEARCH;
  if (!pack || !pack.ALL || !R) throw new Error("dense overlay needs guides and research");

  function tiers(budget, mid, lux) {
    return { budget: budget, mid: mid, lux: lux };
  }
  function line(item, cost) {
    return { item: item, cost: cost };
  }
  function walk(lead, lines, day, tripLabel, trip) {
    return {
      lead: lead,
      lines: lines,
      day: day,
      tripLabel: tripLabel,
      trip: trip,
      note: "Worked example inside the Quick facts bands. Public rates and official pages, not a live quote."
    };
  }

  var D = {
    disney: {
      ticket: "1-day 1-park about $119–209 before 6.5% tax (Animal Kingdom floor to Magic Kingdom peak). Hopper and Lightning Lane are separate.",
      stay: tiers(
        [
          "Pop Century — Value on the Skyliner, often about $150–250 a night before tax. The gondola reaches Hollywood Studios and Epcot; Magic Kingdom is a bus.",
          "Art of Animation — family suites often about $250–400 when several people share. Compare that with two connecting Pop rooms before you pay for the theme.",
          "All-Star Movies, Music, or Sports — the cheapest on-property bus, often about $140–220. Osceola lodging tax on these rooms is 13.5%.",
          "A Pop Century preferred room — often about $20–40 more than a standard Value room, only if you will actually use the extra space."
        ],
        [
          "Caribbean Beach — Moderate Skyliner hub, about $280–450 a night before Florida’s 12.5% lodging tax. Ask for a Riviera-side room so the gondola is a walk.",
          "Port Orleans French Quarter — same Moderate band, about $280–420. A boat reaches Disney Springs; Magic Kingdom is still a bus.",
          "Coronado Springs, Gran Destino tower — Moderate, about $300–450. Buses to the parks, not the Skyliner gondola.",
          "Port Orleans Riverside — about $280–420. Magnolia Bend is a room request inside that rate, not a second resort."
        ],
        [
          "Disney's Riviera Resort — the Deluxe that sits on the Skyliner, often about $450–700 a night before tax.",
          "Grand Floridian, Contemporary, or Polynesian — monorail Deluxe, about $500–750. That rate is the Magic Kingdom commute.",
          "Beach Club or Yacht Club — a walk to Epcot, Deluxe prices. Club level can add about $100–200 a night on top of the room.",
          "Wilderness Lodge — boat to Magic Kingdom, often about $450–700. You are paying for that boat, not for the Skyliner."
        ]
      ),
      eat: tiers(
        [
          "Garden Grocer or Winn-Dixie the night you land — breakfast in the room, often about $8–15 a person.",
          "Cosmic Ray's, Pecos Bill, or Satu'li Canteen — mobile-order lunch, often about $14–18 a person.",
          "Pop Century or Art of Animation food court — dinner about $15–22, which is the Budget meal.",
          "A Dole Whip or a resort bakery item once — about $6–8. It is a snack, not a meal plan."
        ],
        [
          "Sci-Fi Dine-In or 50's Prime Time — one table, often about $35–55 a person before tax, booked before you fly.",
          "Columbia Harbour House — a quieter Magic Kingdom lunch, still about $14–18, not a signature price.",
          "Skip the Disney Dining Plan. The calculator’s typical food day for four is about $215; pay the counter instead.",
          "A second quick-service dinner back at the resort — about $15–22 — on the nights that are not the table."
        ],
        [
          "'Ohana or Chef Mickey's — one character meal, often about $45–75 a person, not a dining plan.",
          "California Grill or Space 220 — the Splurge reservation, often about $75–150 a person. Book it before you fly.",
          "Tusker House — about $45–65, and only if Animal Kingdom morning is already the plan.",
          "Be Our Guest dinner — often about $60 and up a person. The other nights stay at the food court, about $15–22."
        ]
      ),
      do: tiers(
        [
          "Magic Kingdom as one park day — a 1-day ticket is about $119–209 before 6.5% tax. No Park Hopper on this day.",
          "Disney Springs at night — $0 admission. Dinner there is food, not a park ticket.",
          "Skyliner resort-hop after 4 p.m. — $0 extra. Resort guests ride the gondola on the room they already booked.",
          "A pool afternoon at Pop Century or Caribbean Beach — $0 beyond the room you already booked."
        ],
        [
          "Hollywood Studios or Epcot on the Skyliner day — the same 1-day ticket band, about $119–209.",
          "Animal Kingdom with lunch at Satu'li Canteen — the park ticket plus about $14–18 for that lunch.",
          "Lightning Lane Multi Pass on a peak Magic Kingdom or Studios day — the calculator uses about $16–32 a person. Posted peaks have run near $45.",
          "A second single-park ticket instead of Hopper. Hopper in the calculator is about $65–105 a ticket."
        ],
        [
          "Lightning Lane Single Pass for Rise of the Resistance, TRON, Guardians, or Flight of Passage — often about $12–25 a ride, and it is not inside Multi Pass.",
          "Memory Maker — about $185 in the calculator, only if every park day is a photo day.",
          "Park Hopper — about $65–105, only if you will switch parks after lunch.",
          "A monorail hop between Grand Floridian, Contemporary, and Polynesian — $0. The view is already in the Deluxe rate."
        ]
      ),
      walk: walk(
        "Two adults, four nights at a Moderate on the Skyliner, grocery breakfast, quick-service most meals, one table inside the food band, and three single-park days. Resort buses and the gondola are in the room.",
        [
          line("Lodging", "Caribbean Beach at about $360 a night × 4 = $1,440 before Florida’s 12.5% lodging tax. That sits inside the $280–450 Moderate band."),
          line("Food", "About $70 a person × 2 × 4 days = $560. That sits inside $55–85 a person, with grocery breakfast and one table."),
          line("Transit", "$0 on resort buses and the Skyliner. Driving to a park gate is about $35 a day, and this example does not pay it."),
          line("Tickets", "Three 1-day tickets at about $149 × 2 people = $894 before 6.5% tax. $149 sits inside the $119–209 date range.")
        ],
        "A park day is the room ($360) plus food for two ($140) plus two 1-day tickets ($298): about $800 before tax. A pool day drops the tickets.",
        "4-night trip",
        "About $2,900 before tax and flights ($1,440 lodging + $560 food + $894 in tickets). Lodging plus food alone is about $2,000, inside the Quick facts sample of $1,550–2,500."
      ),
      hidden: [
        "Florida lodging tax about 12.5% on the room; All-Star resorts in Osceola County are 13.5%",
        "6.5% sales tax on tickets and on Lightning Lane",
        "$35 a day to park at the gate if you drive; resort guests do not pay that",
        "MCO transfer — Magical Express is gone; the calculator uses about $130 round trip for a family of 4",
        "Lightning Lane about $16–32 a person (posted peaks near $45) and Memory Maker about $185 if you add them at the gate"
      ],
      book: [
        "Park tickets and the on-property hotel before you fly — a 1-day 1-park ticket is about $119–209 before 6.5% tax",
        "Lightning Lane Multi Pass on Magic Kingdom or Hollywood Studios in a peak week — about $16–32 a person in the calculator",
        "One table if you want it — California Grill, Space 220, or a character breakfast (often about $45–75) sell out",
        "MCO transfer (Mears or rideshare), about $130 round trip for a family of 4 in the calculator. Magical Express is gone"
      ],
      sources: ["Walt Disney World ticket pages: 1-day 1-park about $119–209 for 2026 before tax", "Theme-park parking listed at $35 standard"]
    },
    anaheim: {
      ticket: "1-day 1-park is date-tiered, about $104 on the cheapest days and above $200 on the busiest. The theme-park table uses about $130 mid-season. Hopper is separate.",
      stay: tiers(
        [
          "Candy Cane Inn — Harbor courtyard, often about $180–280 a night before Anaheim’s 17% lodging tax. Walk or a short shuttle to the esplanade.",
          "Castle Inn or Tropicana Inn — Harbor value, often about $160–260 a night before the 17% lodging tax. Ask for a room off the boulevard.",
          "Holiday Inn Express Anaheim — grocery breakfast in the rate, still often about $160–260, and still not a Santa Monica hotel.",
          "Howard Johnson Anaheim — a garden-court room, often about $150–240. The gate is a walk or a shuttle, not a freeway."
        ],
        [
          "Pixar Place Hotel — walk to Downtown Disney, often about $300–450 a night before the 17% lodging tax.",
          "Hilton Anaheim — convention campus and a shuttle, often about $250–380. You are still in Anaheim.",
          "Anaheim Marriott — the same campus, one room, same $250–380 mid band.",
          "Hyatt House at Anaheim Resort — a kitchenette in the mid band, about $250–360, if you will grocery dinner."
        ],
        [
          "Grand Californian — the walk into California Adventure. Deluxe rates often run about $500–800 a night.",
          "Disneyland Hotel — on-property campus, often about $450–700. Do not add a Santa Monica night on top.",
          "JW Marriott Anaheim — off-property Splurge with a pool, often about $350–550, then a shuttle.",
          "The Westin Anaheim — a newer tower in a similar Splurge band, about $350–550, still a shuttle or a walk."
        ]
      ),
      eat: tiers(
        [
          "Albertsons or Target the night you land — breakfast in the room, often about $8–14 a person.",
          "Mobile-order inside the park you already entered — a counter lunch is often about $15–20.",
          "A Downtown Disney counter — dinner without a second park ticket, often about $15–25.",
          "A packaged snack inside the park — about $6–9. It is not a character meal."
        ],
        [
          "Carthay Circle or Lamplight Lounge — one table, often about $40–70 a person, booked before you fly.",
          "Naples or Tortilla Jo's in Downtown Disney — a table without a park ticket, often about $25–45 a person.",
          "A quick-service lunch plus one snack — about $15–20 and about $6–9 — on the days that are not the table.",
          "Skip a dining plan. A counter lunch is often about $15–20, then one reservation."
        ],
        [
          "Napa Rose — the Grand Californian Splurge, often about $70–120 a person. Book it before you fly.",
          "A World of Color dessert package — a paid seat for a show, often about $40–70, not a third park.",
          "Carthay Circle at dinner instead of lunch — the same kitchen, often about $50–80 a person.",
          "Club 33 is not a plan. The public Splurge table is Napa Rose (often about $70–120) or Carthay (often about $40–70)."
        ]
      ),
      do: tiers(
        [
          "Disneyland as one park day — a 1-day ticket runs about $104–224 by date. This example uses the guide’s $130 mid-season figure.",
          "Downtown Disney after the park — $0 admission. Dinner there is food, not a ticket.",
          "A Harbor Boulevard evening — the walk back to Candy Cane Inn is $0.",
          "A pool hour at the hotel — $0 beyond the room."
        ],
        [
          "California Adventure the next day — a second 1-day ticket, about $104–224 by date, not a Hopper you will not use.",
          "Lightning Lane on the Disneyland day only. Disneyland’s Multi Pass has been posted near $34, separate from the ticket.",
          "World of Color — $0 extra with a California Adventure ticket. The dessert package, often about $40–70, is the paid seat.",
          "An ART day pass — about $6 if the hotel is off the walk. A Harbor room can skip it."
        ],
        [
          "Park Hopper only if you switch after lunch. On Disneyland it is a separate add-on, often about $65–85, on top of the 1-day price.",
          "A character breakfast — often about $40–70 a person — one morning, not a plan.",
          "Universal Studios Hollywood is a Los Angeles ticket, about $100–160, and it is not this day.",
          "Grand Californian’s gate into California Adventure — the walk is what the Deluxe rate, often about $500–800, bought."
        ]
      ),
      walk: walk(
        "Two adults, three nights on Harbor or at Pixar Place, grocery breakfast, counter lunches, one table, and two single-park days. The esplanade is a walk.",
        [
          line("Lodging", "About $300 a night × 3 = $900 before Anaheim’s 17% lodging tax. That sits inside $250–360."),
          line("Food", "About $70 a person × 2 × 3 days = $420. That sits inside $55–90."),
          line("Transit", "$0 if you walk Harbor. An ART day pass is about $6 only when the hotel is off the walk."),
          line("Tickets", "Two mid-season days at about $130 × 2 people = $520. Peak dates run much higher, toward $200 and above.")
        ],
        "A park day is the room ($300) plus food for two ($140) plus two 1-day tickets ($260): about $700 before tax.",
        "3-night trip",
        "About $1,840 before the 17% lodging tax and flights ($900 lodging + $420 food + $520 in tickets). Lodging plus food alone is about $1,320, inside the Quick facts sample of $1,100–1,600."
      ),
      hidden: [
        "Anaheim lodging tax about 17% — this is not Florida’s 12.5%",
        "California sales tax on tickets (state base 7.25%, with local add-ons on top)",
        "Hotel parking is often about $20–40 a night if the rental never leaves the garage",
        "A rideshare from SNA to Harbor is often about $25–40. LAX to Anaheim is often about $70–110, which can erase a cheaper airfare",
        "Lightning Lane (Disneyland Multi Pass has been posted near $34) and Hopper, on top of a 1-day ticket (mid-season table about $130)"
      ],
      book: [
        "Park tickets before you fly — budget about $130 a person on a mid-season day, more on holidays",
        "Lightning Lane on the Disneyland park day only — a separate buy from California Adventure",
        "One table if you want Carthay Circle (often about $40–70 a person) or Napa Rose (often about $70–120)",
        "An ART day pass, about $6, if the hotel is off the Harbor walk"
      ],
      sources: ["Disneyland 1-day tickets published from about $104, with peak days above $200", "Anaheim lodging tax kept at the in-repo 17% figure"]
    },
    los_angeles: {
      ticket: "Universal Studios Hollywood about $100–160 (advance near $100, gate about $159). Getty Center entry is free with a reservation; parking is $25, or $15 after 3 p.m.",
      stay: tiers(
        [
          "Hampton Inn & Suites Los Angeles Downtown — often about $180–260 a night before Los Angeles lodging tax of about 15.5%. Metro and Grand Central Market are a walk.",
          "Moxy Downtown Los Angeles — a compact room, often about $170–250, Arts District walking.",
          "Freehand Downtown — a shared or small room when the party splits a rate, often about $40–90 a bed, well under a Santa Monica tower.",
          "Courtyard Los Angeles L.A. LIVE — Pico station area, often about $200–280. You are paying for that station, not for a beach view."
        ],
        [
          "Ace Hotel Downtown — boutique walking to Grand Central Market, often about $270–380 a night before the 15.5% lodging tax.",
          "Hyatt Regency Los Angeles Downtown — L.A. LIVE, Metro on the block, same $270–380 mid band.",
          "The Westin Bonaventure Downtown — Figueroa, one rideshare zone, often about $250–360.",
          "Hilton Checkers Los Angeles — a smaller Downtown room, often about $240–340, still on a Metro line."
        ],
        [
          "JW Marriott Los Angeles L.A. LIVE — the Downtown Splurge, often about $400–650 a night.",
          "Conrad Los Angeles — Grand LA flagship, often about $450–700.",
          "The Ritz-Carlton Los Angeles — the L.A. LIVE tower, often about $500–800. The neighborhood is still Downtown.",
          "1 Hotel West Hollywood — a different part of town, often about $500–800. Do not also book a Santa Monica night."
        ]
      ),
      eat: tiers(
        [
          "Porto's — a bakery breakfast in the neighborhood you slept in. A potato ball is about $2; a full stop is often under $12.",
          "Grand Central Market — lunch stalls often about $12–18. Stay in Downtown if that is the hotel.",
          "Mariscos Jalisco or a taco truck — often about $4–8 a taco. That is lunch, not a tour of the city.",
          "A Koreatown casual plate if you slept there — often about $15–25, and you are not crossing town."
        ],
        [
          "Langer's — a pastrami sandwich often about $22–28. It is a meal, not a hotel restaurant.",
          "Republique counter — breakfast or lunch often about $18–30, if you are already in that neighborhood.",
          "Quarter or Kang Ho Dong in Koreatown — barbecue for two often about $60–100, which is the mid dinner.",
          "Bestia — book ahead. Pasta and small plates often land about $30–50 a person, before wine."
        ],
        [
          "Providence — a tasting that often runs about $150 and up a person. Book before you fly.",
          "n/naka — a kaiseki night, often about $200 and up a person. It is the dinner, not also a Universal day.",
          "Gjusta — a Venice morning, often about $20–35, only if you slept on the west side.",
          "A hotel dining room at the same tower — often $40 and up for breakfast, which is the expensive version of Porto's."
        ]
      ),
      do: tiers(
        [
          "Getty Center — free timed entry. Parking is $25, or $15 after 3 p.m. The bus avoids the lot.",
          "Griffith Observatory and a hike — $0 admission. You pay for the ride there.",
          "Metro TAP — $1.75 a ride, daily cap $5. That is the Downtown–Santa Monica E Line.",
          "Grand Central Market and a Downtown walk — $0 to enter. Stalls are often about $12–18, which is food, not a ticket."
        ],
        [
          "Universal Studios Hollywood — advance tickets often start near $100; the gate is about $159. General parking is often about $30.",
          "The Broad — $0 timed entry when you get a slot. The ride is TAP at $1.75, not a rideshare loop.",
          "A beach afternoon in the neighborhood you booked — Santa Monica sand is $0. Pier food is often about $12–20.",
          "One studio or one museum, not both. A second ticket, often another $30–160, is a second day."
        ],
        [
          "Universal Express — a much larger add-on, often $100 and up a person, on top of the gate.",
          "Warner Bros. Studio Tour — often about $70–80. It is the other ticketed day, not also Universal.",
          "A canyon or Getty drive — hotel parking is often $40–60 a night on top of the Getty lot.",
          "A WeHo-to-Santa-Monica dinner transfer — a cross-town rideshare is often about $30–50 each way."
        ]
      ),
      walk: walk(
        "Two adults, three nights Downtown, neighborhood meals, TAP instead of a rental, and one Universal day. Getty, if you go, is the free timed entry.",
        [
          line("Lodging", "Ace Hotel or Hyatt Regency Downtown at about $320 a night × 3 = $960 before about 15.5% lodging tax. Inside $270–380."),
          line("Food", "About $65 a person × 2 × 3 days = $390. Inside $50–80, with Porto's or a market and one Koreatown or Bestia night."),
          line("Transit", "TAP daily cap is $5. Two capped days for two people is about $20. A rental would add hotel parking of $40–60 a night."),
          line("Tickets", "One Universal advance day at about $109 × 2 = $218. That sits inside $100–160. Getty entry on another day is $0.")
        ],
        "The Universal day is the room ($320) plus food for two ($130) plus TAP (about $10) plus two advance tickets ($218): about $680 before tax.",
        "3-night trip",
        "About $1,590 before lodging tax and flights ($960 + $390 + $20 + $218). Lodging plus food alone is about $1,350, inside the Quick facts sample of $1,100–1,600."
      ),
      hidden: [
        "Los Angeles lodging tax about 15.5%",
        "Hotel parking $40–60 a night if you keep a car",
        "A cross-town rideshare — often $30–50 each way, and $40 each way is a second dinner",
        "Universal parking, often about $30, and Express (often $100 and up a person) if you add them to a gate price of about $159",
        "LAX versus BUR or SNA: the ground ride from LAX into the city is often $40–70, which can erase a cheaper fare"
      ],
      book: [
        "Getty Center reservation — entry is free; parking is $25, or $15 after 3 p.m., or take the bus",
        "Universal only if that is the ticketed day — advance near $100, gate about $159",
        "One dinner if you want Bestia (often $30–50 a person), Providence, or n/naka",
        "A TAP card. The ride is $1.75 and the daily cap is $5"
      ],
      sources: ["LA Metro TAP: $1.75 a ride, $5 daily cap", "Getty.edu parking: $25, $15 after 3 p.m.; entry free with a reservation"]
    },
    nyc: {
      ticket: "MoMA general admission is about $30. The Met asks visitors from outside New York for about $30. A TKTS or rush Broadway seat often lands about $80–120. The Staten Island Ferry is free.",
      aroundRule: "OMNY is $3 a ride on the subway under the hotel, and the cap is $35 after 12 local rides on the same card in seven days. A Manhattan garage plus a tunnel is a different vacation.",
      stay: tiers(
        [
          "Pod 39 — a compact room on a train you will ride, often about $180–280 a night before New York’s 14.75% lodging tax.",
          "citizenM Bowery — same idea downtown, often about $200–320. The F or the 6 is the commute.",
          "Motto by Hilton Chelsea — the 1 or the A/C/E, often about $200–300. You are paying for the station, not for neon.",
          "Hampton Inn Times Square Central — often about $220–340, and only if you want the subway downstairs. The view of the billboards is not the product."
        ],
        [
          "Ace Hotel NoMad — the neighborhood over a convention tower, often about $300–450 a night before the 14.75% lodging tax.",
          "Hyatt Grand Central or The Westin New York Grand Central — you arrived on a train, often about $320–480.",
          "The Hoxton Williamsburg — one river, often about $280–420, which is a lower night than a Times Square resort fee.",
          "New York Marriott Marquis — Times Square, often about $350–500. You came for the trains, not the lobby."
        ],
        [
          "Park Hyatt New York — Midtown flagship, often about $800–1,400 a night. The subway is still $3.",
          "Conrad New York Downtown — Battery Park, often about $500–900, not a Times Square tower.",
          "1 Hotel Central Park — the park address, often about $700–1,200.",
          "The St. Regis New York — Fifth Avenue, often about $800–1,500. Breakfast is still not included in that rate."
        ]
      ),
      eat: tiers(
        [
          "A bodega egg-and-cheese — about $5–7. That is breakfast. The hotel dining room is not.",
          "A slice — often about $3–5 now, not the old dollar. Three of them are still cheaper than a Midtown salad.",
          "Xi'an Famous Foods — a noodle plate often about $12–16, in a neighborhood you can reach on the train.",
          "A Chinatown or Flushing plate — often about $12–20. Dinner stays on the side of the city where you slept."
        ],
        [
          "Russ & Daughters Cafe — a downtown breakfast or lunch, often about $20–35 a person.",
          "Katz's — a pastrami sandwich often about $25–30. Share it if you also want a slice.",
          "Via Carota or L'Artusi — one Village reservation, often about $40–70 a person before wine.",
          "Lilia — a Williamsburg reservation if you slept at The Hoxton, often about $40–80 a person. Do not add a Midtown lunch the same day."
        ],
        [
          "Le Bernardin — a prix fixe that often starts around $200 a person. One reservation, then a bodega the next morning.",
          "Carbone — a red-sauce Splurge, often about $100–150 a person if you can get the table. Book before you fly.",
          "Grand Central Oyster Bar — a sit-down lunch, often about $40–70, under the trains you are already using.",
          "Balthazar — a SoHo breakfast, often about $25–40. It is still cheaper than a hotel dining room at the St. Regis."
        ]
      ),
      do: tiers(
        [
          "The Staten Island Ferry — $0, and it is the skyline.",
          "A walk across the Brooklyn Bridge — $0. Start from the borough where you slept.",
          "OMNY at $3 a ride. After 12 local rides on the same card in seven days, the cap is $35.",
          "A pay-what-you-wish hour only if you qualify. Visitors should budget about $30 at MoMA or the Met instead of hoping."
        ],
        [
          "MoMA — general admission about $30. Pick this or the Met, not both the same afternoon.",
          "The Met — about $30 for visitors who do not live in New York. Residents have a different policy.",
          "Brooklyn Heights and Dumbo — the view is free. The train to get there is $3.",
          "A TKTS or rush Broadway seat — often about $80–120. A full-price orchestra seat is often $150–250 and is a different tier."
        ],
        [
          "One observation deck — Summit, Edge, or Top of the Rock is often about $40. Three of them is three tickets.",
          "A reserved Broadway orchestra seat — often $150–250 plus fees. That is the Splurge, not the default.",
          "A guided harbor cruise — often about $30–40, which buys a seat for a view the ferry already gave you.",
          "A Manhattan garage — often $50–80 a night — plus a tunnel. The subway under the hotel was $3."
        ]
      ),
      walk: walk(
        "Two adults, three nights at Ace Hotel NoMad or Hyatt Grand Central, bodega breakfast, one neighborhood dinner, OMNY, the Met or MoMA, and one TKTS seat each.",
        [
          line("Lodging", "About $360 a night × 3 = $1,080 before 14.75% lodging tax. Inside the $300–450 mid band."),
          line("Food", "About $75 a person × 2 × 3 days = $450. Inside $55–95, with a bodega morning and one sit-down."),
          line("Transit", "OMNY at $3. About six local rides each over three days is $36 for two. The cap is $35 a person only after 12 rides."),
          line("Tickets", "MoMA or the Met at about $30 × 2 = $60, plus one TKTS seat each at about $90 × 2 = $180.")
        ],
        "The museum day is the room ($360) plus food for two ($150) plus four subway rides ($12) plus two museum tickets ($60): about $580 before tax.",
        "3-night trip",
        "About $1,810 before lodging tax and flights ($1,080 lodging + $450 food + $36 OMNY + $240 tickets). Lodging plus food alone is about $1,530, inside the Quick facts sample of $1,250–1,900."
      ),
      hidden: [
        "New York lodging tax about 14.75%, plus a hotel unit fee that is often about $3.50 a night",
        "A resort-style fee at some hotels, often about $25–45 a night, on top of the advertised rate",
        "Summit, Edge, and Top of the Rock are often about $40 each. One deck is the view. Three is three tickets",
        "A TKTS Broadway seat often lands about $80–120; fees sit on top of the face price. A full orchestra seat is often $150–250",
        "A rideshare across a river the subway already covers is often $25–50. OMNY is $3"
      ],
      book: [
        "MoMA (about $30) or the Met (about $30 for out-of-town visitors) — pick one",
        "Broadway rush, lottery, or TKTS, often about $80–120, if a show is why you came",
        "One observation deck if you want a paid view, about $40 — not Summit and Edge and Top of the Rock",
        "OMNY at $3 a ride, capped at $35 after 12 local rides on the same card in seven days"
      ],
      sources: ["MTA tariff effective January 4, 2026: base fare $3, 7-day OMNY cap $35 after 12 local rides", "MoMA and Met posted adult admission about $30 for general visitors"]
    },
    vegas: {
      ticket: "The resort fee is about $35–55 a night. Mystère often starts near $70; O is usually higher, often $100 and up. The Bellagio fountains have no ticket.",
      stay: tiers(
        [
          "Ellis Island — a downtown-adjacent room, often about $60–120 a night before the resort fee and before 13.5% lodging tax. The walk is the product.",
          "The LINQ or Flamingo — a Center-Strip bed, often about $80–180 midweek before a resort fee of about $35–55.",
          "Hampton Inn Tropicana — south Strip, often about $90–160 before the fee. One bus or one rideshare reaches the fountains.",
          "Circa — downtown, often about $100–200 midweek before the fee. Fremont is outside the door."
        ],
        [
          "Park MGM — no-casino-smoke tower, often about $150–280 midweek before a resort fee of about $35–55 and before 13.5% tax. You can walk to the fountains.",
          "New York-New York — Center-Strip walk, often about $120–250 before the same fee.",
          "Horseshoe — Center-Strip, often about $100–220 midweek before the fee. Saturday is a different rate.",
          "The Venetian or Palazzo — a bigger campus, often about $180–320 before the fee. You still walk."
        ],
        [
          "Bellagio — fountain-adjacent, often about $250–500 before a resort fee. The fountains themselves are free.",
          "Waldorf Astoria Las Vegas — Center-Strip, often about $300–600, and the resort fee still exists.",
          "Wynn or Encore — north Strip, often about $300–700. You will still walk or tram.",
          "Four Seasons Hotel Las Vegas — Mandalay Bay campus, often about $350–700. Quieter, not a different city."
        ]
      ),
      eat: tiers(
        [
          "Tacos El Gordo — often about $12–16 a person, a short walk off the carpet.",
          "A Park MGM or Cosmopolitan food-hall plate — often about $15–25. That is lunch.",
          "Ellis Island cafe if you are downtown — breakfast often about $10–16.",
          "A comped well drink is not dinner. Budget the plate, often about $15–25 in a food hall."
        ],
        [
          "Mon Ami Gabi — a Paris patio sit-down, often about $30–55 a person. One night.",
          "Esther's Kitchen or District One — off the carpet, often about $25–45 a person.",
          "A Center-Strip casual lunch — about $15–25 — on the days that are not the sit-down.",
          "Secret Pizza or a food-hall slice — often about $6–10. It keeps the steakhouse off the weekday."
        ],
        [
          "Bazaar Meat or Hell's Kitchen at Caesars — one steakhouse night, often about $80–150 a person.",
          "Picasso or Guy Savoy — a tasting that often runs about $150 and up. Book it, then eat from a hall the other nights.",
          "A buffet you actually wanted — some still run about $40–70. It is the meal, not a daily default.",
          "A second steakhouse the next night — another $80–150 — is how a cheap room becomes an expensive week."
        ]
      ),
      do: tiers(
        [
          "The Bellagio fountains and the conservatory — $0.",
          "A Center-Strip walk from Park MGM to the fountains — $0. This is the transit plan.",
          "The Deuce — a 24-hour pass is about $8 if you do not want the walk.",
          "Fremont Street if you slept downtown — the canopy is $0. A drink is often about $8–15."
        ],
        [
          "Mystère — often starts near $70 a seat. One show.",
          "A residency at Dolby Live or a similar room — often about $80–200 depending on the name. Pick one.",
          "Red Rock Canyon — about $20 a vehicle, and only if that morning is why you rented a car.",
          "A rideshare to Fremont from Park MGM — often about $15–25. It is not a reason to keep a car overnight."
        ],
        [
          "O at the Bellagio — often $100 and up, sometimes much more for a good seat. It is the show, not also Mystère.",
          "A nightclub table — minimums often run $300 and up. That is a second ticket the same night.",
          "Valley of Fire — a state-park vehicle fee, often about $10–15, on the morning the car exists.",
          "Hotel self-parking — often about $20–30 a night — on a week you only walked."
        ]
      ),
      walk: walk(
        "Two adults, three midweek nights at Park MGM or New York-New York, one food-hall pattern, one off-Strip dinner, the fountains on foot, and one Mystère seat each.",
        [
          line("Lodging", "About $230 a night × 3 = $690 before 13.5% tax. Inside $190–280, and this is the rate before the fee."),
          line("Resort fee", "About $45 × 3 nights = $135. The Quick facts sample includes this fee."),
          line("Food", "About $55 a person × 2 × 3 days = $330. Inside $40–75."),
          line("Show and bus", "Mystère at about $90 × 2 = $180. The Deuce, if you ride one day, is about $8 × 2 = $16. The fountains are $0.")
        ],
        "A walking day is the room ($230) plus the resort fee ($45) plus food for two ($110): about $385. The show night adds about $180.",
        "3-night trip",
        "About $1,350 before lodging tax and flights ($690 room + $135 fees + $330 food + $180 show + $16 bus). Room, fee, and food are about $1,155, inside the Quick facts sample of $900–1,450."
      ),
      hidden: [
        "Resort fee about $35–55 a night, on top of the rate",
        "Lodging tax about 13.5%",
        "Hotel self-parking is often about $20–30 a night if you rented a car to walk the Strip",
        "A second Cirque ticket is often another $70–150 a person. A nightclub table minimum is often several hundred dollars",
        "Saturday or convention rates versus the Tuesday you used for comparison — the same tower can jump by $100 or more"
      ],
      book: [
        "A Tuesday–Thursday room — check the convention calendar before you treat a $230 night as normal",
        "One show if a show is why you came — Mystère often near $70 and up, O often $100 and up",
        "The resort fee, about $35–55 a night, before you compare two rates",
        "LAS is close. Skip a rental unless Red Rock (about $20 a vehicle) is a planned morning"
      ],
      sources: ["Bellagio fountains and conservatory: no ticket", "Resort-fee band kept at the in-repo $35–55"]
    },
    miami: {
      ticket: "The sand is free. Vizcaya general admission is about $25. A beach-club daybed minimum often starts around $75–150 a person.",
      stay: tiers(
        [
          "The Gale South Beach — Collins, a few blocks off Ocean Drive, often about $180–280 a night before Miami’s 13% lodging tax.",
          "Freehand Miami — a smaller or shared room with a walk to the sand, often about $40–100 a bed, under a beachfront tower.",
          "Hampton Inn Miami Beach — Mid-Beach, often about $160–260. The sand is a walk or a short bus.",
          "Courtyard Miami Downtown/Brickell — Metromover at the door, often about $180–280. You traded the postcard for restaurants."
        ],
        [
          "Hyatt Centric South Beach — Collins walk-to-sand, often about $250–360 a night before the 13% lodging tax.",
          "The Confidante — a renovated Art Deco room on Collins, often about $250–380, without an Ocean Drive address.",
          "Kimpton EPIC Hotel — Brickell bay, often about $250–370. The Metromover does not charge a fare.",
          "Miami Marriott Biscayne Bay — mainland mid, often about $220–340. Better food walking than Ocean Drive."
        ],
        [
          "1 Hotel South Beach — beach premium, often about $500–900 a night. A cabana is still extra.",
          "The Ritz-Carlton, South Beach — Collins Splurge, often about $450–800.",
          "The Miami Beach EDITION — Mid-Beach flagship, often about $500–900.",
          "Four Seasons Hotel at The Surf Club — Surfside, often about $700–1,200. Quieter than Ocean Drive, and a different ride."
        ]
      ),
      eat: tiers(
        [
          "A ventanita coffee and a pastelito — often about $4–8. That is breakfast.",
          "Versailles — a Cuban sandwich often about $14–18. Little Havana, not the hotel.",
          "Time Out Market — stalls often about $15–25. One lunch, not a tour.",
          "A Wynwood or Little Havana plate — often about $15–28. Pick the neighborhood you are already in."
        ],
        [
          "Yardbird on Collins — a sit-down a few blocks off Ocean Drive, often about $25–45 a person.",
          "Joe's Stone Crab — a shared order is often $80 or more, market price. One plate, two people.",
          "A Brickell sit-down if that is where you slept — often about $30–55 a person.",
          "Cuban coffee the next morning — about $2–4 — after the seafood night."
        ],
        [
          "Stubborn Seed — a South Beach Splurge, often about $100 and up a person.",
          "A named tasting room — often $120 and up. One night, then Versailles.",
          "A Nikki Beach or 1 Hotel cabana — the minimum is often about $75–150 a person before drinks.",
          "An Ocean Drive entree — often about $28–45 for a plate you can eat for less on Collins."
        ]
      ),
      do: tiers(
        [
          "Lummus Park beach — $0. The sand is the product.",
          "The Metromover through Brickell and downtown — $0. It does not charge a fare.",
          "A walk from Collins to the sand — $0. Do not drive two blocks.",
          "Wynwood murals on the street — $0. The museum compound is the paid version."
        ],
        [
          "Vizcaya — general admission about $25. One indoor ticket.",
          "Wynwood Walls — admission is often about $15. The surrounding streets are the free walk.",
          "An Everglades airboat morning — often about $50–80 a person, and it is the day you might want a car.",
          "A bus or Metromover hop instead of a rental. A car is often $40–70 a day before parking."
        ],
        [
          "A beach-club afternoon at Nikki Beach or 1 Hotel — often a $75–150 minimum a person, before bottles.",
          "A private boat — often $300 and up for the afternoon. The beach you booked is already there.",
          "South Beach nightclub cover — often $20–50, and a table is a different product.",
          "MIA versus FLL: the cheaper airport loses if the ground ride is $40–70."
        ]
      ),
      walk: walk(
        "Two adults, three nights at The Gale or Hyatt Centric, a ventanita breakfast, one neighborhood dinner, the Metromover or a walk, and Vizcaya.",
        [
          line("Lodging", "About $300 a night × 3 = $900 before Miami’s 13% lodging tax. Inside $250–360."),
          line("Food", "About $60 a person × 2 × 3 days = $360. Inside $45–75."),
          line("Transit", "$0 on foot and on the Metromover. This example does not rent a car."),
          line("Tickets", "Vizcaya at about $25 × 2 = $50. The sand is $0.")
        ],
        "A beach day with Vizcaya is the room ($300) plus food for two ($120) plus two admissions ($50): about $470 before tax.",
        "3-night trip",
        "About $1,310 before lodging tax and flights ($900 + $360 + $50). Lodging plus food alone is about $1,260, inside the Quick facts sample of $1,000–1,550."
      ),
      hidden: [
        "Miami lodging tax about 13%",
        "MIA versus FLL: a ground ride of about $40–70 can erase a cheaper airfare",
        "A rental is often $40–70 a day, plus hotel parking, for a beach you can walk",
        "A Nikki Beach or 1 Hotel daybed minimum often starts around $75–150 a person",
        "An Ocean Drive entree is often $28–45. A ventanita breakfast on the same sand is often $4–8"
      ],
      book: [
        "A room a few blocks off Ocean Drive, or Brickell if mainland restaurants are the point — mid band about $250–360 before 13% tax",
        "Joe's Stone Crab only if you will share one plate — a shared order is often $80 or more",
        "An Everglades tour, often about $50–80 a person, only if that half-day is on the calendar",
        "A flexible fare in hurricane season (June–November)"
      ],
      sources: ["Miami-Dade: Metromover does not charge a fare", "Vizcaya Museum and Gardens general admission about $25"]
    },
    san_francisco: {
      ticket: "The Alcatraz day-tour ferry is $47.95 for adults (NPS fee page; the night tour is $59.65). Clipper on Muni is about $2.50–$3. The cable car is a separate $8 fare.",
      stay: tiers(
        [
          "Hampton Inn San Francisco Downtown — often about $180–280 a night before San Francisco’s 16% lodging tax. BART is a walk.",
          "Courtyard San Francisco Downtown — Marriott value near Union Square, often about $200–300. You still do not need a car.",
          "Hotel Zephyr — a Wharf 2–3 star, often about $180–280, only if that grid is the trip.",
          "The Phoenix Hotel — a smaller Civic Center room, often about $150–250. The Mission is a Muni ride, not a garage."
        ],
        [
          "Hotel Emeline — Jackson Square, a walk to the Ferry Building, often about $280–400 a night before the 16% lodging tax.",
          "Hyatt Regency San Francisco — Embarcadero, often about $280–420. The ferry building is the morning.",
          "Hilton San Francisco Union Square — cable-car adjacent, often about $250–400. The cable car is still an $8 souvenir.",
          "San Francisco Marriott Marquis — Moscone and SoMa, often about $260–400. One room, not a suite."
        ],
        [
          "Fairmont San Francisco — Nob Hill, often about $400–700. The cable car is at the door and still costs $8.",
          "St. Regis San Francisco — SoMa, often about $500–900, a walk to SFMOMA.",
          "Four Seasons Hotel San Francisco — SoMa flagship, often about $550–950.",
          "1 Hotel San Francisco — waterfront, often about $500–900, if the Embarcadero is the address you wanted."
        ]
      ),
      eat: tiers(
        [
          "Tartine or a Mission bakery — a pastry and coffee often about $8–14.",
          "La Taqueria or El Farolito — a burrito often about $12–18. Stay on BART or Muni.",
          "A Ferry Building counter — lunch often about $15–25, if you slept at Emeline or the Hyatt.",
          "A Chinatown noodle shop — often about $12–20. Skip the Wharf seafood rack."
        ],
        [
          "Zuni Cafe — one reservation, often about $40–70 a person.",
          "State Bird Provisions — often about $70–90 a person if you get the table. Book it.",
          "A Mission burrito the next day — about $14 — so the reservation does not become every meal.",
          "Ferry Building oysters — often about $20–36 for a small lunch, not a Wharf tower of crab."
        ],
        [
          "Atelier Crenn or Benu — a tasting that often runs $300 and up a person. One night.",
          "Quince — the other Splurge table, often $200 and up a person. Do not book both.",
          "A Nob Hill hotel breakfast — often $30–50 — which is the expensive version of Tartine.",
          "A Wharf crab stand — a souvenir meal, often $30–50, for food the Ferry Building sells without the pier markup."
        ]
      ),
      do: tiers(
        [
          "Crissy Field and the bridge view — $0.",
          "The Ferry Building, inside and out — $0 to walk. You pay for what you eat.",
          "Muni on Clipper — about $2.50–$3 a ride. That is the transit plan.",
          "Lands End — $0. The bus gets you there."
        ],
        [
          "Alcatraz day tour — $47.95 adult on the National Park Service fee page, ferry and audio tour included. Book the official slot.",
          "SFMOMA — general admission about $30, on a day you are not also doing Alcatraz.",
          "One cable-car ride — $8. It is a souvenir, not your Clipper pass.",
          "A Mission-to-Embarcadero day on Muni — a few taps at about $2.50–$3, not a rideshare over every hill."
        ],
        [
          "The Alcatraz night tour — $59.65 adult. It replaces the day tour. It does not stack on top.",
          "A Napa day — hotel parking is often $50–70, plus the car. Crissy Field did not need it.",
          "A hop-on bus — often about $50–70 a person — for streets Muni already covers.",
          "A second museum the afternoon of Alcatraz — another $20–30 you will not finish."
        ]
      ),
      walk: walk(
        "Two adults, three nights at Hotel Emeline or the Hyatt Regency, bakery breakfast, one Zuni or neighborhood dinner, Clipper, one cable-car ride, and the Alcatraz day ferry.",
        [
          line("Lodging", "About $340 a night × 3 = $1,020 before about 16% lodging tax. Inside $300–380."),
          line("Food", "About $70 a person × 2 × 3 days = $420. Inside $55–90."),
          line("Transit", "Muni about $20 for two over three days, plus one cable-car ride each at $8 ($16). Total about $36."),
          line("Tickets", "Alcatraz day tour at $47.95 × 2 = about $96. The night tour is $59.65 if you chose that instead.")
        ],
        "The Alcatraz day is the room ($340) plus food for two ($140) plus transit (about $12) plus two ferry tickets ($96): about $590 before tax.",
        "3-night trip",
        "About $1,570 before lodging tax and flights ($1,020 + $420 + $36 + $96). Lodging plus food alone is about $1,440, inside the Quick facts sample of $1,250–1,700."
      ),
      hidden: [
        "San Francisco lodging tax about 16%",
        "Hotel parking is often about $50–70 a night, and it only makes sense on a Napa day",
        "The cable car is $8, on top of Clipper rides of about $2.50–$3",
        "A Wharf crab meal is often $30–50. A Ferry Building lunch is often $15–25",
        "A rideshare over a hill the bus already climbs is often $15–30"
      ],
      book: [
        "The Alcatraz timed ferry — day tour $47.95 adult — because it sells out",
        "Clipper for Muni. A visitor product only wins if you will also ride the $8 cable car enough times",
        "One dinner if you want State Bird (often about $70–90 a person) or Zuni (often about $40–70)",
        "SFO on BART. Price an OAK ground ride, often $40–70, before you celebrate a cheaper flight"
      ],
      sources: ["NPS Alcatraz fees, updated January 2026: day tour $47.95 adult, night tour $59.65", "SFMTA: cable car is its own fare, about $8; Clipper covers Muni"]
    },
    chicago: {
      ticket: "Art Institute general admission is $32 for adults ($20 Chicago residents, $27 other Illinois residents). A 1-day Ventra pass is $5. An architecture cruise is often about $50–65.",
      stay: tiers(
        [
          "Freehand Chicago — a smaller or shared room near the L, often about $40–90 a bed.",
          "Hampton Inn Chicago Downtown/Magnificent Mile — often about $140–220 a night before Chicago’s 17.4% lodging tax. Trains downstairs.",
          "Motto by Hilton Chicago Downtown — a compact room, often about $150–230. Skip a suburban cloverleaf.",
          "Courtyard Chicago Downtown/River North — often about $160–250, a walk to the L."
        ],
        [
          "The Hoxton Chicago — Fulton Market, often about $220–340 a night before the 17.4% lodging tax. Restaurants are the point.",
          "Hilton Chicago — Grant Park and the South Loop, often about $190–320, a walk to the L.",
          "Hyatt Regency Chicago — the river, often about $200–330.",
          "Chicago Marriott Downtown Magnificent Mile — often about $200–340. One room, not a suite, and not a suburb."
        ],
        [
          "Park Hyatt Chicago — Water Tower, often about $400–700 a night.",
          "The Langham Chicago — the river, often about $450–750.",
          "Four Seasons Hotel Chicago — Mag Mile flagship, often about $500–800.",
          "The St. Regis Chicago — lakeshore tower, often about $500–900. Winter is when this rate sometimes makes sense."
        ]
      ),
      eat: tiers(
        [
          "A doughnut or a diner breakfast — often about $8–14. Not the Mag Mile hotel.",
          "An Italian beef — often about $10–14 at a counter.",
          "Lou Malnati's once — a small deep dish is often about $20–28, and it feeds more than one person if you let it.",
          "A neighborhood tavern plate — often about $15–25. Then stop."
        ],
        [
          "The Publican — a Fulton Market sit-down, often about $40–70 a person, if you slept at The Hoxton.",
          "A West Loop casual lunch — often about $18–30.",
          "Portillo's — the beef is about $10–14, which keeps The Publican to one night.",
          "A Logan Square reservation — often about $30–55 a person, one train from the Loop."
        ],
        [
          "Alinea — a tasting that often runs about $300 and up a person. One night.",
          "A Fulton Market flagship that is not Alinea — often about $80–150 a person.",
          "A Mag Mile hotel brunch — often $40–70 — for food a diner sells for about $14.",
          "A second tasting the next night doubles a $300 meal. An Italian beef is about $12, and that is the other dinner."
        ]
      ),
      do: tiers(
        [
          "The Riverwalk — $0.",
          "Millennium Park and the Bean — $0.",
          "Ventra on the L — $2.50 a train ride. A 1-day pass is $5. From O'Hare the ticket is $5.",
          "A neighborhood walk in the evening — $0 beyond dinner."
        ],
        [
          "The Art Institute — $32 adult, $20 for Chicago residents, $27 for other Illinois residents.",
          "An architecture river cruise — often about $50–65 adult. Pick this or the Art Institute, not both the same afternoon.",
          "A 3-day Ventra pass — $15 if you will ride more than a couple of times.",
          "The Blue Line from O'Hare is $5, and the Orange Line from Midway is $2.50. That is the airport move when the bed is in the Loop."
        ],
        [
          "Willis Tower Skydeck — often about $35–45. It is a second ticket, not the Art Institute.",
          "A second museum the same day — often another $20–32.",
          "Lollapalooza week or the Fourth of July — the same Loop room can jump by $100 or more a night.",
          "A suburban hotel plus a rideshare in — often $25–50 each way, twice a day."
        ]
      ),
      walk: walk(
        "Two adults, three nights at The Hoxton or a Loop Hilton, diner breakfast, one Publican night, a 3-day Ventra pass, and the Art Institute. The river cruise is the other choice, not both.",
        [
          line("Lodging", "About $250 a night × 3 = $750 before Chicago’s 17.4% lodging tax. Inside $190–320."),
          line("Food", "About $60 a person × 2 × 3 days = $360. Inside $45–75."),
          line("Transit", "A 3-day Ventra pass is $15 × 2 = $30. A single L ride is $2.50; O'Hare is $5."),
          line("Tickets", "Art Institute at $32 × 2 = $64. A river cruise instead would be about $50–65 each.")
        ],
        "The museum day is the room ($250) plus food for two ($120) plus Ventra (about $10 of the pass) plus two admissions ($64): about $440 before tax.",
        "3-night trip",
        "About $1,200 before lodging tax and flights ($750 + $360 + $30 + $64). Lodging plus food alone is about $1,110, inside the Quick facts sample of $850–1,400."
      ),
      hidden: [
        "Chicago lodging tax about 17.4%",
        "A suburban rate still owes the downtown commute. A rideshare in is often $25–50 each way",
        "A second museum the same day as the Art Institute is often another $20–32",
        "The L is $2.50, or $5 from O'Hare. A rideshare surge does not replace a running Blue or Orange Line",
        "Lollapalooza week and the Fourth of July reprice Loop rooms, often by $100 or more a night"
      ],
      book: [
        "The Art Institute ($32 adult) or a river cruise (often about $50–65) — pick one",
        "A Ventra pass if you will ride — $5 for a day, $15 for three days",
        "ORD or MDW midweek. The Blue Line and the Orange Line are the airport moves",
        "Skip Lollapalooza and July 4 lodging unless those dates are why you came"
      ],
      sources: ["CTA fare page: L $2.50, O'Hare $5, 1-day pass $5, 3-day pass $15", "Art Institute of Chicago: adult general admission $32"]
    },
    nola: {
      ticket: "Preservation Hall standing room is often about $25; reserved seats run higher. A St. Charles streetcar ride is $1.25. A 1-day Jazzy Pass is $3.",
      stay: tiers(
        [
          "The Drifter — Mid-City, often about $120–200 a night before New Orleans lodging tax of about 16.2%. The Canal streetcar reaches the Quarter.",
          "Hampton Inn & Suites New Orleans Convention Center — Warehouse District, often about $140–230. The streetcar is the ride.",
          "Courtyard New Orleans Downtown/Convention Center — often about $150–240, same idea.",
          "Holiday Inn New Orleans – Downtown Superdome — often about $130–220. A Bourbon balcony is a different, higher rate."
        ],
        [
          "Hotel Peter and Paul — Marigny, often about $220–360 a night before the 16.2% lodging tax. You walk to dinner.",
          "The Pontchartrain — Garden District, on the St. Charles line, often about $200–340.",
          "New Orleans Marriott on Canal — often about $180–320. Walk or streetcar, not a rental at night.",
          "Omni Royal Orleans — the Quarter premium, often about $220–380. It does not buy a better Galatoire's table."
        ],
        [
          "Windsor Court — CBD, often about $350–600 a night. The trip is still the food.",
          "The Roosevelt New Orleans — often about $300–550.",
          "Hotel Monteleone — Quarter flagship, often about $300–550. The carousel bar is not a reason to skip the Warehouse District rate.",
          "Four Seasons Hotel New Orleans — often about $500–900. One courtyard, not two."
        ]
      ),
      eat: tiers(
        [
          "Café du Monde — coffee and beignets often about $8–12 for two. Once.",
          "Parkway Bakery — a po'boy often about $14–18. That is lunch.",
          "A neighborhood cafe the other mornings — often about $8–14, so the beignet does not become the plan.",
          "A casual gumbo — often about $10–16 — on a night you do not have a reservation."
        ],
        [
          "Galatoire's — lunch or dinner, often about $50–90 a person, if that reservation is why you came.",
          "Commander's Palace — often about $60–100 a person. One of these, not both, on a short trip.",
          "Cochon — often about $40–70 a person, the modern mid table.",
          "A Parkway po'boy the next day — about $16 — after the white-tablecloth night."
        ],
        [
          "Commander's or Galatoire's at the full Splurge pace — wine included, a table can run well above $100 a person.",
          "A tasting room — often $100 and up. Keep it to one night.",
          "A Bourbon Street courtyard menu — often $30–50 for a tourist plate. The reservation was the point of the trip.",
          "A second music-night dinner in the Quarter — easy to add another $40 — when Frenchmen was a walk."
        ]
      ),
      do: tiers(
        [
          "The St. Charles streetcar — $1.25 a ride. A 1-day Jazzy Pass is $3.",
          "A Garden District walk from the streetcar — $0.",
          "Jackson Square — $0. The artists’ prices are separate.",
          "Frenchmen Street from the sidewalk — $0 to walk. A club cover is often about $10–20."
        ],
        [
          "Preservation Hall — standing room often about $25; reserved seats cost more. One cover.",
          "The Canal streetcar to the cemetery end — $1.25. You do not need a tour bus for that ride.",
          "A Frenchmen club — cover often about $10–20, on a night you do not also have Preservation Hall.",
          "Café du Monde is not a ticket. It is a $5 beignet you already counted as food."
        ],
        [
          "Whitney Plantation — admission about $25 a person, and it is a car or a tour, not a streetcar hop.",
          "A swamp tour — often about $50–80 a person. It does not share a night with Galatoire's.",
          "A haunted-tour stack — often about $25–40 a person — for streets you can walk.",
          "Jazz Fest or Mardi Gras dates — the same Warehouse room can jump by $100 or more a night. If those dates are not why you came, pick another week."
        ]
      ),
      walk: walk(
        "Two adults, three nights at Hotel Peter and Paul or a Warehouse Hampton, one po'boy, one Galatoire's or Commander's night inside the food band, the streetcar, and Preservation Hall.",
        [
          line("Lodging", "About $260 a night × 3 = $780 before about 16.2% lodging tax. Inside $200–330."),
          line("Food", "About $70 a person × 2 × 3 days = $420. Inside $55–90, with a cafe morning and one old-school dinner."),
          line("Transit", "Two 1-day Jazzy Passes at $3, for two people, is $12. A single streetcar ride is $1.25."),
          line("Tickets", "Preservation Hall standing room at about $25 × 2 = $50.")
        ],
        "The music day is the room ($260) plus food for two ($140) plus streetcar (about $6) plus two standing tickets ($50): about $455 before tax.",
        "3-night trip",
        "About $1,260 before lodging tax and flights ($780 + $420 + $12 + $50). Lodging plus food alone is about $1,200, inside the Quick facts sample of $950–1,550."
      ),
      hidden: [
        "New Orleans lodging tax about 16.2%",
        "A Quarter balcony is often about $50–100 a night more than a Warehouse or Garden District room the same week",
        "A rental is often $40–60 a day for a swamp or plantation morning you could have booked as a tour",
        "Jazz Fest or Mardi Gras dates reprice a room you may have booked for the food",
        "A second music cover is often another $10–25 the night you already have a reservation"
      ],
      book: [
        "Galatoire's or Commander's if that dinner is why you came — tables often run about $50–100 a person before wine",
        "A Jazzy Pass if you will ride — $3 for a day. A single streetcar ride is $1.25",
        "A flexible fare in hurricane season",
        "Skip Mardi Gras lodging unless those dates are why you came"
      ],
      sources: ["RTA streetcar fare $1.25; 1-day Jazzy Pass $3", "Preservation Hall: standing room often about $25, reserved seats higher"]
    },
    philadelphia: {
      ticket: "The Barnes is about $30. The Philadelphia Museum of Art is about $30. Independence Hall is timed and free. A SEPTA Key ride on subway or bus is about $2.50.",
      stay: tiers(
        [
          "Hampton Inn Philadelphia Center City — often about $140–220 a night before Philadelphia’s 15.5% lodging tax. Reading Terminal is a walk.",
          "Home2 Suites Philadelphia Downtown — a kitchenette, often about $150–230, if you will grocery breakfast.",
          "Courtyard Philadelphia Downtown — often about $160–240, near City Hall.",
          "Apple Hostels of Philadelphia — a shared bed often about $40–70, well under a Rittenhouse rate."
        ],
        [
          "The Notary Hotel — City Hall, often about $220–340 a night before the 15.5% lodging tax. You can walk to the Hall.",
          "Kimpton Hotel Monaco — Independence Mall walking, often about $220–360.",
          "Philadelphia Marriott Downtown — Convention Center, often about $200–320, next to Reading Terminal.",
          "Loews Philadelphia Hotel — Center City, often about $200–330. SEPTA beats a rental."
        ],
        [
          "Four Seasons Hotel Philadelphia — Logan Square, often about $500–900 a night.",
          "The Rittenhouse — the square, often about $400–700.",
          "The Logan Philadelphia — Parkway, often about $300–550.",
          "W Philadelphia — Center City flagship, often about $300–500. Independence Hall is still free."
        ]
      ),
      eat: tiers(
        [
          "A Reading Terminal bakery — breakfast often about $6–12.",
          "DiNic's roast pork — often about $14. That is the lunch argument.",
          "Pat's or Geno's — a cheesesteak often about $13–16. One, then stop.",
          "An Italian Market slice or a counter if you are already in South Philly — often about $4–8 a slice."
        ],
        [
          "A neighborhood Italian — one reservation, often about $30–55 a person.",
          "Suraya — often about $30–50 a person, a different night from the Terminal.",
          "Reading Terminal the next day — a market plate about $12–18 — so the reservation stays singular.",
          "A cafe breakfast — about $10 — not the hotel dining room."
        ],
        [
          "Zahav — often about $70–100 a person, and only if that dinner is why you came.",
          "A tasting room — often $100 and up. One night.",
          "A Rittenhouse hotel brunch — often $30–50 — for eggs the Terminal sells for about $12.",
          "A cheesesteak tour — often about $50–70 a person — for a sandwich that is about $15."
        ]
      ),
      do: tiers(
        [
          "Independence Hall — timed entry, $0. Book the slot.",
          "The Liberty Bell — $0, and the line is the cost.",
          "The Rocky steps and Eakins Oval — $0.",
          "A Center City walk from The Notary to the Hall — $0."
        ],
        [
          "The Barnes — general admission about $30. Pick this or the Art Museum.",
          "The Philadelphia Museum of Art — about $30. Not the same afternoon as the Barnes.",
          "SEPTA Key — about $2.50 a subway or bus ride.",
          "Eastern State Penitentiary — about $22. It is a half-day, not a third museum after the Barnes."
        ],
        [
          "A hop-on bus — often about $40–50 a person — on top of SEPTA.",
          "The Airport Line from an airport hotel — about $7 each way, twice a day, which is the discount you thought you found.",
          "A second museum admission the same afternoon — another $30.",
          "A paid food tour — often $50–70 — for three cheesesteaks."
        ]
      ),
      walk: walk(
        "Two adults, three nights at The Notary or Kimpton Hotel Monaco, Reading Terminal twice, one neighborhood dinner, SEPTA, Independence Hall, and the Barnes.",
        [
          line("Lodging", "About $250 a night × 3 = $750 before Philadelphia’s 15.5% lodging tax. Inside $200–320."),
          line("Food", "About $65 a person × 2 × 3 days = $390. Inside $50–80."),
          line("Transit", "About four SEPTA rides each at $2.50 is about $20 for two. Independence Hall is a walk."),
          line("Tickets", "The Barnes at about $30 × 2 = $60. Independence Hall is $0.")
        ],
        "The museum day is the room ($250) plus food for two ($130) plus SEPTA (about $10) plus two Barnes tickets ($60): about $450 before tax.",
        "3-night trip",
        "About $1,220 before lodging tax and flights ($750 + $390 + $20 + $60). Lodging plus food alone is about $1,140, inside the Quick facts sample of $900–1,450."
      ),
      hidden: [
        "Philadelphia lodging tax about 15.5%",
        "The Airport Line is about $7 each way. Twice a day from an airport hotel spends the cheaper room",
        "A hop-on bus is often about $40–50 a person on top of SEPTA at about $2.50 a ride",
        "A second museum the same afternoon is often another $30",
        "A cheesesteak tour is often about $50–70 a person. The sandwich itself is about $15"
      ],
      book: [
        "Independence Hall timed entry — the ticket is free and the slot still sells out",
        "The Barnes (about $30) or the Art Museum (about $30) — pick one",
        "Zahav only if that is the dinner you came for — often about $70–100 a person",
        "A SEPTA Key if you will ride. About $2.50 a subway or bus ride"
      ],
      sources: ["NPS Independence Hall: timed entry, no admission fee", "SEPTA Key subway and bus about $2.50"]
    }
    ,
    atlanta: {
      ticket: "Georgia Aquarium Plan & Save general admission starts at $44.49; Anytime admission is $67.99. World of Coca-Cola is often about $20–25. A MARTA ride is $2.50. The BeltLine does not charge admission.",
      stay: tiers(
        [
          "Hampton Inn & Suites Atlanta-Midtown — often about $130–200 a night before Atlanta’s 16.9% lodging tax. MARTA or a BeltLine walk.",
          "Home2 Suites Atlanta Downtown — a kitchenette, often about $140–210. Skip a Cumberland cloverleaf.",
          "Holiday Inn Express Atlanta Downtown — Centennial area, often about $130–200.",
          "Courtyard Atlanta Downtown — often about $150–220, a walk to a MARTA stop."
        ],
        [
          "Hotel Clermont — Ponce, often about $180–280 a night before the 16.9% lodging tax. The BeltLine and Ponce City Market are the evening.",
          "Hyatt Regency Atlanta — Downtown, often about $180–280.",
          "Hilton Atlanta — the convention campus, often about $170–270. Read the convention calendar first.",
          "The Westin Peachtree Plaza — often about $180–300. This is not a Buckhead commute."
        ],
        [
          "Four Seasons Hotel Atlanta — Midtown, often about $400–700 a night.",
          "St. Regis Atlanta — Buckhead, often about $400–700. You traded the BeltLine walk.",
          "Grand Hyatt Atlanta in Buckhead — often about $300–550. Same trade.",
          "The Whitley Atlanta Buckhead — often about $300–500. One tower, not also a Midtown night."
        ]
      ),
      eat: tiers(
        [
          "West Egg Cafe — breakfast often about $12–18. Not the hotel.",
          "Mary Mac's Tea Room — a meat-and-three often about $16–25.",
          "Ponce City Market — a counter often about $14–20.",
          "Krog Street Market — the other end of the trail, stalls in the same $14–20 range."
        ],
        [
          "Fox Bros. Bar-B-Q — a plate often about $16–22. One reservation-free dinner.",
          "A BeltLine sit-down — often about $25–45 a person, if you are already on the trail.",
          "Mary Mac's on the other night — about $20 — so the sit-down stays singular.",
          "A Midtown cafe lunch — about $15 — not a Buckhead steakhouse ride."
        ],
        [
          "Miller Union — often about $50–90 a person. The Westside Splurge.",
          "Bones — a Buckhead steakhouse, often about $80 and up a person, plus the rideshare.",
          "Bacchanalia — a tasting that often runs about $100 and up. One night.",
          "A hotel steak — Downtown prices for a plate Fox Bros. sells for about $20."
        ]
      ),
      do: tiers(
        [
          "The BeltLine Eastside Trail from Ponce City Market to Krog — $0.",
          "Piedmont Park — $0.",
          "Martin Luther King Jr. National Historical Park — $0.",
          "MARTA from the airport — $2.50. A 1-day pass is about $9 if you will ride more."
        ],
        [
          "Georgia Aquarium — Plan & Save starts at $44.49; Anytime is $67.99. One morning.",
          "World of Coca-Cola — often about $20–25. It is a different ticket from the Aquarium.",
          "The Atlanta Streetcar — a fare of about $1, and it is not the BeltLine, which is $0.",
          "A second trail hour instead of a second museum — $0."
        ],
        [
          "Both the Aquarium and World of Coca-Cola the same day — about $45 plus about $22, and you will rush both.",
          "A Buckhead rideshare for a steakhouse — often $25–40 each way.",
          "Stone Mountain — a car, plus park admission that is often about $20.",
          "Two Ubers a day from Cumberland — often $20–35 each way — which is the room you thought you saved."
        ]
      ),
      walk: walk(
        "Two adults, three nights at a Midtown Hampton or Hotel Clermont, West Egg or a market lunch, one Fox Bros. or BeltLine dinner, MARTA from the airport, and the Aquarium. Coca-Cola is the other morning.",
        [
          line("Lodging", "About $220 a night × 3 = $660 before Atlanta’s 16.9% lodging tax. Inside $180–280."),
          line("Food", "About $60 a person × 2 × 3 days = $360. Inside $45–75."),
          line("Transit", "About $25 for two, mixing a $2.50 airport ride and a day pass near $9. The BeltLine is $0."),
          line("Tickets", "Aquarium Plan & Save at about $45 × 2 = $90. Anytime admission is $67.99 if you did not pick a time.")
        ],
        "The Aquarium day is the room ($220) plus food for two ($120) plus MARTA (about $9) plus two tickets ($90): about $440 before tax.",
        "3-night trip",
        "About $1,135 before lodging tax and flights ($660 + $360 + $25 + $90). Lodging plus food alone is about $1,020, inside the Quick facts sample of $800–1,300."
      ),
      hidden: [
        "Atlanta lodging tax about 16.9%",
        "An Uber from Cumberland to Midtown is often $20–35 each way. Two a day erase a cheaper room. MARTA is $2.50",
        "World of Coca-Cola, often about $20–25, stacked on an Aquarium ticket that starts at $44.49",
        "Convention weeks reprice Downtown. A Marriott Marquis rate that week is not the normal rate",
        "A Buckhead rideshare for a steakhouse is often $25–40 each way"
      ],
      book: [
        "MARTA from ATL — $2.50 — and skip the airport hotel",
        "The Aquarium (from $44.49) or World of Coca-Cola (often about $20–25) — pick one",
        "The convention calendar before you lock a Downtown rate",
        "Hotel Clermont or a Ponce room, often about $180–280, if the trail is the evening"
      ],
      sources: ["MARTA one-way fare $2.50", "Georgia Aquarium: Plan & Save from $44.49, Anytime $67.99"]
    },
    paris: {
      ticket: "The Louvre is €32 for visitors from outside the EEA and €22 for EEA residents (official rates from 14 January 2026). Musée d'Orsay is €16 online or €14 at the museum. A single Metro ride is about €2.50.",
      stay: tiers(
        [
          "Ibis Paris Gare du Nord — Metro downstairs, often about €120–180 a night. A bakery is on the block. TVA is usually already in the quote.",
          "Ibis Styles Paris République — the 10th or 11th, often about €130–190. Breakfast downstairs is a pastry, not a palace.",
          "Holiday Inn Express Paris – Canal de la Villette — often about €120–180, the night you land late.",
          "Generator Paris — a shared room by the canal, often well under €100 a bed, if that is the brief."
        ],
        [
          "Hôtel Fabric — Canal Saint-Martin, often about €190–280 a night. The mid that is not a tower with a view of the tower.",
          "Hôtel Malte Opera or a Left Bank 3-star near Odéon — often about €200–320 if you want the 5th or 6th.",
          "Novotel Paris Les Halles — central, often about €200–300, still not a tower-view surcharge.",
          "Hilton Paris Opera — one arrondissement, often about €220–340. You are not changing neighborhoods every night."
        ],
        [
          "Cheval Blanc — on the quai, palace rates that often run €1,000 and up. The bakery downstairs is still about €3.",
          "Hôtel de Crillon — Place de la Concorde, often €900 and up. Breakfast there is its own line.",
          "Park Hyatt Paris-Vendôme or the Ritz — Place Vendôme, often €1,000 and up.",
          "Lutetia — Left Bank, often about €500–900. A bakery breakfast unless you came for the dining room."
        ]
      ),
      eat: tiers(
        [
          "Du Pain et des Idées or the bakery on your block — a pastry and coffee often about €4–7.",
          "Bouillon Chartier or Bouillon Pigalle — a formule often about €20–30 a person.",
          "L'As du Fallafel — about €10. Dinner in the Marais without a tower view.",
          "A fromage and a bottle from a shop — often about €15–25 for two, a valid dinner."
        ],
        [
          "Bouillon Julien — often about €25–40 a person, a step up from Chartier.",
          "Marché des Enfants Rouges — a market lunch often about €12–20.",
          "Clamato or Septime La Cave — if the main Septime room is gone, often about €40–70 a person.",
          "A 10th-arrondissement bistro — one reservation, often about €35–55 a person."
        ],
        [
          "Septime — often about €80–120 a person, and walk-ins do not get that table. Book before you fly.",
          "Frenchie — a similar reservation, often about €70–110. Not the same night as Septime.",
          "Le Comptoir du Relais — the counter fills. It is not a 9 p.m. walk-up, and a seat is often about €50–80.",
          "Breakfast at Le Bristol or Hôtel de Crillon — often €50 and up a person. The bakery is €5."
        ]
      ),
      do: tiers(
        [
          "Trocadéro — the free tower picture. The walk is €0.",
          "A Metro ride — about €2.50. A Monday–Sunday Navigo for zones 1–5 is about €32 if your dates fit.",
          "The banks of the Seine — €0.",
          "A neighborhood walk in the 10th or 11th — €0 beyond the bakery."
        ],
        [
          "The Louvre — €32 if you live outside the EEA, €22 if you are an EEA resident. Timed, on the official site.",
          "Musée d'Orsay — €16 online, €14 at the museum, on the day you did not do the Louvre.",
          "Musée de l'Orangerie — a smaller timed ticket, often about €12, not a third giant museum.",
          "A 2-day Paris Museum Pass is often about €60. It loses if you only enter one museum."
        ],
        [
          "The official Eiffel summit elevator — often about €35. Stairs to the second floor cost less. Buy it on the tower site.",
          "Versailles — the palace ticket is about €21, plus the RER unless your Navigo already covers it. It is a half-day.",
          "A Seine dinner cruise — often about €60–100 a person — for a view Trocadéro already gave you.",
          "A reseller 'skip the line' bundle — often €20 or more over the official museum price."
        ]
      ),
      walk: walk(
        "Two adults, four nights in the 10th or 11th, bakery breakfast, one bistro inside the food band, Metro taps or a Navigo if the week starts on Monday, and the Louvre. Orsay is the other museum, not the same afternoon.",
        [
          line("Lodging", "About €260 a night × 4 = €1,040. Inside €190–330. At the guide’s $1 ≈ €0.92, that is about $1,130. TVA is usually in the quote."),
          line("Food", "About €42 a person × 2 × 4 days = €336. Inside €30–55."),
          line("Transit", "A Monday–Sunday Navigo for zones 1–5 is about €32 × 2 = €64 if your dates qualify. Otherwise a few €2.50 rides add up more slowly."),
          line("Tickets", "Louvre at €32 × 2 = €64 for visitors from outside the EEA. EEA residents pay €22 each.")
        ],
        "The museum day is the room (€260) plus food for two (€84) plus Metro (about €10) plus two Louvre tickets (€64): about €420 before flights.",
        "4-night trip",
        "About €1,500 before flights (€1,040 lodging + €336 food + €64 Navigo + €64 Louvre). Lodging plus food is about €1,380, inside the Quick facts sample of €1,000–1,750."
      ),
      hidden: [
        "A tower-view room is often €80–150 a night more than a 10th-arrondissement rate",
        "An official summit elevator is often about €35, on top of a Louvre ticket (€32 outside the EEA, €22 for EEA residents)",
        "A 2-day Paris Museum Pass is often about €60. It loses on a single entry",
        "Versailles is about €21 for the palace, plus the RER unless Navigo already covers it",
        "Paris hotel quotes usually include TVA. The taxe de séjour is extra, often about €2–8 a person per night by hotel class. Do not add a second 10% on top"
      ],
      book: [
        "The Louvre (€22 or €32) or the Orsay (€16 online) — pick one for the first museum day",
        "Septime, Frenchie, or Le Comptoir if you want that table — often €50–120 a person, and not a walk-in",
        "A Navigo, about €32 for a Monday–Sunday week in zones 1–5, only if your dates qualify. Otherwise single rides are about €2.50",
        "An Atlantic crossing 2–4 months out, midweek. An open-jaw (in Paris, out Rome) often beats two one-ways"
      ],
      sources: ["Louvre rates from 14 January 2026: €22 EEA, €32 non-EEA", "Musée d'Orsay: €16 online, €14 at the museum"]
    },
    london: {
      ticket: "The British Museum and the National Gallery are free. The Tower of London is about £35–38 adult on the official Historic Royal Palaces page. Zone 1–2 contactless cap is £8.90 a day.",
      aroundRule: "Tap contactless on the Tube, the bus, and the Elizabeth line. The Zone 1–2 cap is £8.90 a day and £44.70 Monday–Sunday. The same card on Heathrow Express bills the Express fare, about £26 walk-up, not the Elizabeth line’s £15.50 to Zone 1.",
      stay: tiers(
        [
          "Premier Inn London County Hall — South Bank, often about £100–160 a night, taxes usually in the UK quote. The river walk is the product.",
          "Ibis London Euston St Pancras — Zone 1, often about £90–150. A Tesco is downstairs.",
          "Travelodge London Covent Garden — a compact room, often about £100–170, if you packed light.",
          "Generator London — a shared Bloomsbury bed, often well under £80, if that is the brief."
        ],
        [
          "The Hoxton — Shoreditch or another Hoxton, often about £180–280 a night. Restaurants are on the block.",
          "The Resident Victoria or South Kensington — museum mile without a Mayfair rate, often about £170–260.",
          "Hilton London Bankside — often about £180–280. The Tube is in the neighborhood.",
          "Canopy by Hilton London City — Aldgate, often about £170–270."
        ],
        [
          "The Ned — you are paying for the room, often £400 and up, and breakfast is still charged separately.",
          "The Savoy — the river, often £600 and up.",
          "Claridge's or The Connaught — Mayfair, often £700 and up.",
          "Raffles London at The OWO — Whitehall, often £600 and up. The British Museum is still free."
        ]
      ),
      eat: tiers(
        [
          "A Tesco meal deal — about £3.50–4.50. Allowed.",
          "A bakery — coffee and a bun often about £5–8.",
          "Borough Market or Maltby Street — lunch often about £10–16.",
          "A pub pie — often about £14–18. Not a West End prix fixe."
        ],
        [
          "Padella — pasta often about £12–16, and the queue is the price.",
          "Flat Iron — a steak often about £15. That is the mid dinner.",
          "Dishoom — often about £25–40 a person. One reservation, not every night.",
          "A Zone 2 Indian or Turkish dinner — often about £15–25 a person, which resets a Mayfair average."
        ],
        [
          "Gymkhana — one serious curry, often about £70–100 a person. A different restaurant from Dishoom.",
          "Core or Kitchen Table — a tasting that often runs £150 and up. One night.",
          "A Mayfair breakfast — often £30 and up — for food a bakery sells for £6.",
          "A West End pre-theatre menu every night — often £30–45 — when you only needed it once."
        ]
      ),
      do: tiers(
        [
          "The British Museum — £0 general admission. Special exhibitions are extra.",
          "The National Gallery — £0 general admission. Special exhibitions are extra.",
          "Tate Modern — £0 general admission. The South Bank walk between the free museums is £0.",
          "Contactless in Zones 1–2 — daily cap £8.90, Monday–Sunday cap £44.70."
        ],
        [
          "A TodayTix or TKTS day seat — often about £25–60. That is the show.",
          "The Tower of London — about £35–38 adult on the official page. A direct ticket, not a pass you will not finish.",
          "A bus ride inside the £8.90 Zone 1–2 cap. The Tube cap still covers a museum day.",
          "Borough Market as the lunch, often about £10–16, which is food and not a ticket."
        ],
        [
          "The London Eye — often about £35–42 adult, the same day as the Tower. That is two tickets the South Bank walk did not require.",
          "A full-price orchestra seat — often £80–150. The day seat was the plot.",
          "Heathrow Express walk-up — about £26. The Elizabeth line to Zone 1 is £15.50. Advance Express can start near £10.",
          "The Congestion Charge — £15 a day if a car enters the central zone."
        ]
      ),
      walk: walk(
        "Two adults, four nights at Premier Inn County Hall or The Hoxton, a bakery or a meal deal, one Dishoom or Padella night, contactless under the cap, a free museum, and the Tower. The Eye stays off this total.",
        [
          line("Lodging", "About £210 a night × 4 = £840. Inside £160–270. At the guide’s $1 ≈ £0.76, that is about $1,100. UK quotes usually include VAT."),
          line("Food", "About £35 a person × 2 × 4 days = £280. Inside £25–45."),
          line("Transit", "Zone 1–2 contactless, four days under the £8.90 cap: about £8.90 × 2 × 4 = £71. The Monday–Sunday cap is £44.70 a person if you ride every day."),
          line("Tickets", "Tower of London at about £36 × 2 = £72. The British Museum is £0.")
        ],
        "The Tower day is the room (£210) plus food for two (£70) plus the daily cap for two (£18) plus two Tower tickets (£72): about £370.",
        "4-night trip",
        "About £1,260 before flights (£840 lodging + £280 food + £71 transit + £72 Tower). Add about £31 if both of you take the Elizabeth line from Heathrow at £15.50. Lodging plus food is £1,120, inside the Quick facts sample of £850–1,450."
      ),
      hidden: [
        "Heathrow Express walk-up is about £26. The Elizabeth line to Zone 1 is £15.50. They are different fares from the same airport",
        "A Visitor Oyster has a card fee, often about £7. Contactless has no card fee. The Zone 1–2 daily cap is £8.90",
        "The Eye is often about £35–42 and the Tower is about £35–38. The same day is two tickets",
        "A full-price West End seat is often £80–150 when a day seat was £25–60",
        "UK room quotes usually include VAT. The Congestion Charge is £15 a day if you drive into the central zone. Do not add a second VAT"
      ],
      book: [
        "A West End day seat, often £25–60, if that is the night. A full-price seat is the Splurge",
        "Contactless. The Zone 1–2 cap is £8.90 a day. You almost never need a paper ticket",
        "An Atlantic crossing 2–4 months out, midweek",
        "Skip a rental. The Congestion Charge is £15 a day"
      ],
      sources: ["TfL 2026 adult caps: Zone 1–2 daily £8.90, Monday–Sunday £44.70", "TfL: Elizabeth line Heathrow to Zone 1 £15.50 from March 2026"]
    },
    rome: {
      ticket: "The Colosseum, Forum, and Palatine standard ticket is €18 plus a €2 online booking fee. Full Experience tickets run about €22–24 plus the fee. Vatican Museums are €20, or €25 booked online. The Pantheon is about €5.",
      stay: tiers(
        [
          "The Beehive — Termini, a smaller room, often about €80–140 a night. Trains are downstairs.",
          "Hotel Alimandi — near the Vatican, often about €100–160. Metro A to Ottaviano is the morning.",
          "Ibis Styles Roma Vintage — often about €110–170, pack light, stairs are common.",
          "Best Western Plus Hotel Universo — Termini, often about €120–180. Louder nights, lower rate."
        ],
        [
          "Hotel Santa Maria — a Trastevere courtyard, often about €180–280 a night. You walk to dinner.",
          "Hotel Indigo Rome – St. George — centro, often about €200–320. The walk is the transit plan.",
          "Hotel Nazionale — Piazza Navona and Pantheon area, often about €190–300.",
          "NH Collection Roma Palazzo Cinquecento — Termini-adjacent, often about €170–280, if you arrive late."
        ],
        [
          "Palazzo Manfredi — you are paying for the Colosseum view, often €400 and up, not for a shorter walk.",
          "Hotel de Russie — Piazza del Popolo, often €500 and up. The bar breakfast is the Splurge morning.",
          "Hassler Roma — above the Spanish Steps, often €600 and up.",
          "The St. Regis Rome — often €500 and up. The city fee still sits on top, a few euros a person."
        ]
      ),
      eat: tiers(
        [
          "A cornetto and a coffee at the bar, standing — often about €2–4. Seated on a piazza it can be €8–12 for the same pastry.",
          "Trapizzino in Testaccio — stuffed pizza bread, often about €5–7.",
          "Pizza al taglio — often about €5–8 a piece, in Testaccio or Trastevere.",
          "A market lunch — often about €8–14. Not a photo menu on a square."
        ],
        [
          "A trattoria menu — often about €25–40 a person, away from Piazza Navona.",
          "A Roscioli-adjacent table — often about €40–70 a person. One reservation.",
          "Supplì or pizza the next day — about €5–8 — so the reservation stays singular.",
          "Coperto is often €1–3 a person. Ask before the bread lands."
        ],
        [
          "Armando al Pantheon — often about €50–80 a person, and only if the table exists. The door is not a plan.",
          "La Pergola — a tasting that often runs €200 and up. One night.",
          "Hotel de Russie breakfast — often €30 and up. The bar on the walk is €3.",
          "A Piazza Navona seated dinner — a pasta that is €12 two streets away can be €20 or more for the view."
        ]
      ),
      do: tiers(
        [
          "The Pantheon — about €5. The square outside is free, and it is not a dinner reservation.",
          "A Trastevere-to-centro walk — €0 in fares.",
          "A 100-minute Metro ticket — about €1.50, if you are not walking.",
          "The park at Villa Borghese, outside the gallery — €0."
        ],
        [
          "Colosseum, Forum, and Palatine — €18 plus a €2 booking fee for the standard ticket. One morning.",
          "Vatican Museums — €20 at the door, €25 if you book online. A different day.",
          "Borghese Gallery — timed, about €18 with the booking fee. It sells out separately.",
          "A 48-hour Metro pass is about €12.50. It does not get you into the ruins."
        ],
        [
          "A Full Experience Colosseum ticket — about €22–24 plus €2 — if you want the arena or the underground. A guide fee may be extra.",
          "A golf-cart tour — often about €40–80 a person — for streets you can walk.",
          "An open-top bus — often about €25–35 — the same mistake.",
          "August in the centro — hotel rates jump, and some kitchens close. The street in front of the Pantheon is still about €5 to enter."
        ]
      ),
      walk: walk(
        "Two adults, four nights in Trastevere or Prati, bar breakfast, one trattoria, mostly walking, the Colosseum one day and the Vatican on another.",
        [
          line("Lodging", "About €240 a night × 4 = €960. Inside €170–320. At $1 ≈ €0.92, that is about $1,040, before the city fee."),
          line("Food", "About €40 a person × 2 × 4 days = €320. Inside €30–55. Coperto is a few euros more."),
          line("Transit", "About €15 in Metro fares for two across four days if you walk the centro. A 72-hour pass is about €18 a person if you will ride more."),
          line("Tickets", "Colosseum standard at €20 × 2 = €40, plus Vatican online at €25 × 2 = €50.")
        ],
        "The Colosseum day is the room (€240) plus food for two (€80) plus a Metro ride (€3) plus two standard tickets (€40): about €365.",
        "4-night trip",
        "About €1,430 before flights, including a 4-star-style city fee of about €6 × 2 people × 4 nights = €48 (€960 lodging + €320 food + €15 Metro + €90 tickets + €48 city fee). Lodging plus food is €1,280, inside the Quick facts sample of €900–1,750."
      ),
      hidden: [
        "Rome’s city fee is often about €4–7 a person per night by hotel class, usually capped at 10 nights, on top of the room",
        "Coperto is often €1–3 a person, plus bread you did not mean to order",
        "A golf-cart tour is often about €40–80 a person for streets you can walk",
        "The Vatican online is about €25, and it is a second ticket after the Colosseum’s €18 plus €2",
        "August and holiday weeks reprice centro hotels. The Pantheon is still about €5"
      ],
      book: [
        "Colosseum plus Forum (€18 + €2 online) or the Vatican (€25 online) — give them separate days",
        "One trattoria if you want Roscioli or Armando — often €40–80 a person, and Armando is not a walk-up plan",
        "The Leonardo Express from FCO to Termini is about €14 if you land late. A fixed-fare taxi is higher",
        "An open-jaw with Paris often beats a backtrack. Price the train or the flight as its own line"
      ],
      sources: ["Parco Archeologico del Colosseo: standard ticket about €18 plus a €2 booking fee", "Vatican Museums: €20 full, about €25 when booked online"]
    },
    tokyo: {
      ticket: "teamLab Planets in Toyosu is about ¥3,800 adult. teamLab Borderless at Azabudai Hills is a different ticket, often about ¥3,200–4,000. A 7-day ordinary JR Pass is about ¥50,000 and loses on a Tokyo-only week.",
      stay: tiers(
        [
          "APA Hotel Shinjuku — above a station, often about ¥12,000–20,000 a night. A convenience store is in the lobby.",
          "Toyoko Inn Shinjuku or Ueno — a business hotel, often about ¥10,000–18,000.",
          "Super Hotel Lohas Ikebukuro or Ueno — often about ¥9,000–16,000. Metro on the block.",
          "Nine Hours Shinjuku — a capsule, often about ¥4,000–7,000, only if you packed a cube."
        ],
        [
          "Mitsui Garden Shibuya or Ginza — often about ¥25,000–40,000 a night. Trains, not a national rail pass.",
          "Trunk Hotel Shibuya or Sequence Miyashita Park — often about ¥30,000–50,000. The mid that is not a business-hotel clone.",
          "Hilton Tokyo — Shinjuku, often about ¥30,000–45,000. Metro in the basement.",
          "The Westin Tokyo — Ebisu, often about ¥28,000–42,000. One train zone."
        ],
        [
          "Park Hyatt Tokyo — Shinjuku, often ¥80,000 and up. You still take the Metro to dinner.",
          "Hoshinoya Tokyo — a ryokan product in the city, often ¥100,000 and up. Dinner can still be a train ride.",
          "Aman Tokyo — Otemachi, often ¥150,000 and up. The station is downstairs.",
          "Conrad Tokyo — Shiodome, often ¥70,000 and up."
        ]
      ),
      eat: tiers(
        [
          "A convenience-store onigiri and coffee — often about ¥400–700. That is breakfast.",
          "Ichiran or a neighborhood ramen shop — often about ¥1,000–1,500.",
          "A standing sushi counter — often about ¥1,500–3,000.",
          "A gyudon chain — often about ¥500–900, in the ward you booked."
        ],
        [
          "Afuri — a named ramen, often about ¥1,200–1,600.",
          "A department-store depachika lunch — often about ¥1,200–2,000.",
          "An izakaya — often about ¥3,000–5,000 a person, one reservation.",
          "Conveyor sushi — often about ¥2,000–3,500, the honest backup if the counter was not booked."
        ],
        [
          "A Toyosu sushi counter booked from home — often about ¥10,000–30,000 a person.",
          "Sushi Yoshitake or a similar counter — often ¥20,000 and up. If it was not booked, it is conveyor sushi.",
          "A hotel breakfast buffet — often about ¥2,500–4,000, which is several days of onigiri.",
          "A second counter the next night doubles a ¥20,000 meal. The konbini breakfast is still about ¥500."
        ]
      ),
      do: tiers(
        [
          "Sensō-ji at opening — ¥0 to enter.",
          "Meiji Shrine — ¥0 to enter.",
          "Suica or PASMO — short hops often about ¥180–220. That is the Tokyo card.",
          "A neighborhood walk in the ward you slept in — ¥0 beyond food."
        ],
        [
          "teamLab Planets in Toyosu — about ¥3,800 adult, timed.",
          "Ghibli Museum, Mitaka — about ¥1,000 if you win the official lottery. It is not a same-day booth.",
          "A Yanaka morning if you do not hold a Ghibli ticket — the streets are ¥0, and the train is often about ¥200.",
          "teamLab Borderless at Azabudai Hills — a different ticket, often about ¥3,200–4,000. Do not buy a voucher that only says teamLab."
        ],
        [
          "A 7-day ordinary JR Pass — about ¥50,000. On a Yamanote week it does not pay.",
          "The Skyliner from Narita — about ¥2,600 one way. The Narita Express is about ¥3,100. Haneda is usually under ¥700.",
          "A taxi from Shibuya to Shinjuku — often ¥2,000 or more — for a ride the train does in minutes.",
          "Both teamLabs (about ¥3,800 each) plus Kamakura plus a counter — three paid days. Pick one indoor ticket."
        ]
      ),
      walk: walk(
        "Two adults, four nights at a Mitsui Garden or Hilton over a station, convenience-store breakfast, one izakaya, Suica, and teamLab Planets. No JR Pass.",
        [
          line("Lodging", "About ¥38,000 a night × 4 = ¥152,000. Inside ¥30,000–45,000. At about ¥150 to $1, that is about $1,010, before the small accommodation tax."),
          line("Food", "About ¥4,000 a person × 2 × 4 days = ¥32,000. Inside ¥2,500–6,000."),
          line("Transit", "Suica taps for two over four city days, about ¥4,000. A JR Pass at about ¥50,000 each is the wrong product."),
          line("Tickets", "teamLab Planets at about ¥3,800 × 2 = ¥7,600.")
        ],
        "The teamLab day is the room (¥38,000) plus food for two (¥8,000) plus Suica (about ¥800) plus two tickets (¥7,600): about ¥54,400.",
        "4-night trip",
        "About ¥196,000 before flights (¥152,000 lodging + ¥32,000 food + ¥4,000 Suica + ¥7,600 tickets). If the room is ¥15,000 or more, Tokyo’s accommodation tax is often ¥200 a person per night, about ¥1,600 here. Lodging plus food is ¥184,000, inside the Quick facts sample of ¥140,000–230,000."
      ),
      hidden: [
        "Narita Skyliner is about ¥2,600 one way; the Narita Express is about ¥3,100. Haneda is usually under ¥700",
        "A hotel breakfast buffet is often ¥2,500–4,000. Convenience-store breakfast is often ¥400–700",
        "A 7-day ordinary JR Pass is about ¥50,000. Suica taps on a Tokyo week are a small fraction of that",
        "teamLab Planets is about ¥3,800 and it is in Toyosu. Borderless is a different ticket in a different ward",
        "Tokyo accommodation tax is often ¥100–200 a person per night when the room is ¥10,000 or more. Under ¥10,000 it is often exempt. Consumption tax is usually already in the rate"
      ],
      book: [
        "One sushi counter if that is the treat — often ¥10,000 and up — before you land",
        "A Suica or PASMO. Short rides are often about ¥180–220",
        "teamLab Planets timed entry, about ¥3,800, if that is the indoor ticket",
        "Haneda if you can. Price the Skyliner (about ¥2,600) or N'EX (about ¥3,100) if you cannot"
      ],
      sources: ["teamLab Planets (Toyosu) vs Borderless (Azabudai Hills) are separate tickets", "JR Pass 7-day ordinary about ¥50,000 after the 2023 increase; Suica is the city card"]
    },
    cancun: {
      ticket: "Visitax is about $15 a person once per visit. The Hotel Zone environmental fee is about $4 a room per night. The Ultramar ferry to Isla Mujeres is about $25 round trip a person.",
      stay: tiers(
        [
          "Riu Cancún or Riu Palace Peninsula — Hotel Zone all-inclusive, often about $150–250 a night for two in a garden room. Swim-up is a different code.",
          "Holiday Inn Resort Cancún — often about $140–230. Eat on property the night you land.",
          "Oasis or Krystal Grand — often about $130–220. The page rate is rarely the swim-up the desk offers later.",
          "Hampton Inn by Hilton Cancun Cumbres — mainland, often about $80–140, only if you will eat out and ride to the beach."
        ],
        [
          "Hyatt Ziva Cancún — often about $250–400 a night for two, family all-inclusive. Confirm the airport van is inside that number.",
          "Moon Palace — often about $220–360. The transfer is the line that makes two quotes comparable.",
          "Hilton Cancun, an All-Inclusive Resort — often about $220–350.",
          "Marriott Cancun Resort — a non-AI Hotel Zone week, often about $200–330. Food is then extra, which is a different budget."
        ],
        [
          "Le Blanc Spa Resort — adults-only Splurge, often about $500–900 a night. The fine-dining rooms are why.",
          "Hyatt Zilara Cancún — adults-only, often about $400–700.",
          "JW Marriott Cancun — often about $350–600, and meals are not all in the rate.",
          "Rosewood Mayakoba or Nizuc — south of the Zone, often $700 and up, and a different transfer from the Hotel Zone."
        ]
      ),
      eat: tiers(
        [
          "The resort buffet — $0 extra on an all-inclusive. Use it the night you land.",
          "A casual à-la-carte room on property — usually $0 extra at an all-inclusive. Check the reservation rules.",
          "Coffee in the rate. A dock bottle of water is often $3–5 for something the buffet already has.",
          "Parque de las Palapas tacos — a downtown meal often about $8–15 a person, only if the ride is cheap."
        ],
        [
          "A better à-la-carte room inside Hyatt Ziva or Moon Palace — $0 extra, and it is the mid upgrade.",
          "La Habichuela — one downtown dinner, often about $40–80 a person, if you leave the resort.",
          "A Hotel Zone steakhouse off-property — often about $50–90 a person. One night.",
          "Beach-club lunch off the resort — a day-price, often $30 and up, not a snack."
        ],
        [
          "Le Blanc’s fine-dining rooms — $0 extra inside a rate that is often $500–900 a night. That is the meal you paid for.",
          "A Puerto Morelos dinner — often about $40–80 a person, and a different transfer from the Hotel Zone.",
          "A cenote-day lunch packed from the buffet — $0 extra. The dock kiosk is the leak.",
          "A second off-property tasting — another $60–100 — on a week the rate already included dinner."
        ]
      ),
      do: tiers(
        [
          "The beach in front of the tower — $0 beyond the nightly rate.",
          "The Hotel Zone R-1 bus — about $1 a person a ride. That is the hop inside the zone.",
          "A pool day — $0 beyond the room.",
          "Sunset from the resort — $0. A catamaran is a different product."
        ],
        [
          "Ultramar from Puerto Juárez to Isla Mujeres — about $25 round trip a person. The public ferry, not a Hotel Zone lunch cruise.",
          "A cenote entry — often about $10–30 a person, on a day that is not also the ferry.",
          "Visitax — about $15 a person, paid once, including the airport step.",
          "The environmental fee — about $4 a room per night, small and separate from the buffet."
        ],
        [
          "A shared Chichén Itzá day — often about $90–140 a person. It does not share a day with Isla Mujeres.",
          "A Hotel Zone catamaran — often about $70–120 a person — for a crossing the ferry already sells.",
          "A rental — often $40–70 a day — parked under the tower.",
          "A timeshare breakfast — a presentation. It is not in the rate, and it is not the airport van, which is often about $20 a person if missing."
        ]
      ),
      walk: walk(
        "Two adults, five nights at Hyatt Ziva or Moon Palace, meals in the rate, the airport van already inside the quote, one Ultramar day, and the R-1 if you hop the zone.",
        [
          line("Lodging", "About $260 a night × 5 = $1,300 for two, food included. Inside the $200–330 Hotel Zone band."),
          line("Food", "$0 extra if you stay on property. A Palapas taco run is about $15–30 a person if you leave."),
          line("Transit", "R-1 hops are about $1 a person. This example assumes the airport van is already inside the rate. A missing shared van is often about $20 a person."),
          line("Fees and ferry", "Visitax $15 × 2 = $30. Environmental fee about $4 × 5 = $20. Ultramar about $25 × 2 = $50.")
        ],
        "A beach day is the room ($260) with food included. The Isla day adds about $50 for two ferry tickets.",
        "5-night stay",
        "About $1,400 before cash tips and flights ($1,300 rate + $30 Visitax + $20 environmental fee + $50 ferry). The Quick facts sample of $1,000–1,650 is the quoted rate before tips, Visitax, and a van that is missing. Cash tips are often about $5–10 a person per day on top."
      ),
      hidden: [
        "Visitax about $15 a person at Cancún International",
        "Hotel Zone environmental fee about $4 a room per night",
        "A shared airport van is often about $20 a person, and a private van is often $70–120, if the quote left it out",
        "Cash tips are often about $5–10 a person per day. A dock bottle of water is often $3–5",
        "A rental is often $40–70 a day for a beach you can reach on the R-1 for about $1"
      ],
      book: [
        "The airport transfer inside the Hyatt Ziva, Moon Palace, or Riu rate — a missing shared van is often about $20 a person",
        "The Ultramar ferry (about $25 round trip) or one cenote (often $10–30) — pick one",
        "A shared Chichén day, often about $90–140 a person, only if that is the long day",
        "The cancel stance in hurricane season, before you send the deposit"
      ],
      sources: ["Ultramar is the public Isla Mujeres ferry, about $25 round trip", "Visitax about $15 once per visit, kept from the in-repo figure"]
    },
    oahu: {
      ticket: "Hanauma Bay is about $25 for non-residents, plus parking about $3, and it needs a reservation. The USS Arizona memorial is timed and free. A Missouri ticket is often about $30. HOLO on TheBus is $3, with a day cap near $7.50.",
      stay: tiers(
        [
          "The Equus — Kuhio, often about $160–250 a night before Hawaii’s 17.75% lodging tax. A kitchenette beats resort breakfast.",
          "Holiday Inn Express Waikiki — one block back, often about $180–280. Same beach.",
          "Hampton Inn & Suites Honolulu/Waikiki — often about $190–300. Walk to the sand.",
          "Shoreline Hotel Waikiki — often about $180–280. You do not need a car for this grid."
        ],
        [
          "Outrigger Waikiki Beach Resort — walk to the beach, often about $310–420 a night before the 17.75% tax.",
          "Hilton Hawaiian Village — a big campus, often about $280–400. You came for the lagoon.",
          "Hyatt Regency Waikiki — Kalakaua, often about $300–430.",
          "Embassy Suites Waikiki Beach Walk — a kitchenette in the mid band, often about $300–420, if you will grocery dinner."
        ],
        [
          "Halekulani — often about $600–1,100 a night. The room is the treat.",
          "The Royal Hawaiian — often about $450–800. You can still walk Kalakaua.",
          "The Kahala Hotel & Resort — east of Waikiki, often about $700–1,200. This one assumes a car.",
          "Four Seasons Resort Oahu at Ko Olina — the west side, often $800 and up. Waikiki did not require that drive."
        ]
      ),
      eat: tiers(
        [
          "Rainbow Drive-In — a plate lunch often about $14–18.",
          "L&L Hawaiian Barbecue — often about $12–16. The same idea.",
          "A grocery run for the kitchenette — breakfast often about $8–12 a person.",
          "Leonard’s — a malasada about $2. It is not a meal."
        ],
        [
          "Marukame Udon — often about $12–18. One sit-down that is still a counter.",
          "Helena's Hawaiian Food — poi and pipikaula, often about $20–35 a person, a bus ride from Kalakaua.",
          "A poke bowl — often about $15–20, not a nightly Kalakaua restaurant row.",
          "Grocery breakfast the next day — about $10 — after the one dinner out."
        ],
        [
          "Sen of Japan or a Halekulani counter — one, often about $100 and up a person, then grocery breakfast.",
          "Alan Wong’s or Senia — often about $80–150 a person. One night.",
          "A resort breakfast — often $25–40 a person — for a view you can eat under with a $15 plate lunch.",
          "Five fish dinners at $80 and up repeat the Splurge. One is the treat."
        ]
      ),
      do: tiers(
        [
          "Waikiki beach — $0.",
          "A walk on Kalakaua — $0.",
          "TheBus with a HOLO card — $3 a ride, transfer window included, day cap near $7.50. Cash is also $3 and does not include that transfer.",
          "Diamond Head if you have the reservation — about $5 a person, plus parking if you drove."
        ],
        [
          "Hanauma Bay — about $25 for non-residents, parking about $3, reservation required. The day the car earns its place.",
          "USS Arizona — timed and free. The Missouri is the paid ship, often about $30.",
          "A North Shore afternoon on TheBus — the day cap is near $7.50, not a walk from Kuhio.",
          "Waikiki parking for a rental — about $40–55 a night whether or not the car moved."
        ],
        [
          "Both Hanauma (about $25) and a Missouri ticket (often about $30) in one week — two timed tickets. Pick one. The Arizona memorial is $0.",
          "A neighbor-island hop — often about $80–150 one way. Five Oahu nights do not contain Maui.",
          "A catamaran off Waikiki — often about $40–70 a person. The beach was already in the room.",
          "A rental from the airport on a Waikiki-only week — the garage fee, about $40–55 a night, is the cost."
        ]
      ),
      walk: walk(
        "Two adults, five nights at the Outrigger or a Kuhio room with a kitchen, plate lunches, two days on TheBus, and Hanauma Bay. No rental in this example.",
        [
          line("Lodging", "About $340 a night × 5 = $1,700 before Hawaii’s 17.75% lodging tax. Inside $310–380."),
          line("Food", "About $60 a person × 2 × 5 days = $600. Inside $45–75, with grocery or a plate lunch and one dinner."),
          line("Transit", "Two days at the HOLO day cap, about $7.50 × 2 people × 2 days = $30. A cash fare does not include the transfer window."),
          line("Tickets", "Hanauma Bay at about $25 × 2, plus about $3 parking = $53. The Arizona memorial, if you chose it instead, is free.")
        ],
        "The bay day is the room ($340) plus food for two ($120) plus the bus cap for two ($15) plus Hanauma ($53): about $530 before tax.",
        "5-night stay",
        "About $2,380 before the 17.75% lodging tax and flights ($1,700 + $600 + $30 + $53). Lodging plus food alone is $2,300, inside the Quick facts sample of $2,000–2,700. A rental in a Waikiki garage would add about $40–55 a night."
      ),
      hidden: [
        "Hawaii lodging tax about 17.75% on a pre-tax quote",
        "Rental parking in Waikiki is about $40–55 a night",
        "Resort breakfast is often $25–40 a person. A plate lunch is often $14–18",
        "Hanauma is about $25 for non-residents. The Arizona memorial is free. The Missouri is often about $30. They are not one ticket",
        "A neighbor-island flight is often about $80–150 one way, sold as an afternoon"
      ],
      book: [
        "A Hanauma Bay reservation if that is the bay day — non-resident entry about $25",
        "Pearl Harbor timed entry if that is the morning. The Arizona memorial is free; the Missouri is often about $30",
        "A HOLO card. The ride is $3 and the day cap is near $7.50",
        "A neighbor-island hop only with a second airfare, often $80–150 one way"
      ],
      sources: ["Honolulu TheBus: adult fare $3, HOLO transfer window and a day cap near $7.50", "Hanauma Bay non-resident entry about $25, separate from parking"]
    },
    maui: {
      ticket: "Haleakalā National Park is $30 a vehicle. The sunrise reservation is $1 on Recreation.gov, required from 3 a.m. to 7 a.m., separate from the entrance fee. A Molokini boat is often about $150–200 a person.",
      stay: tiers(
        [
          "Aston Maui Kamaole — a South Kihei studio with a kitchen, often about $250–400 a night before Hawaii’s 17.75% lodging tax. The kitchen is why this stays cheaper.",
          "Kohea Kai Maui — South Kihei, often about $220–360. Cook.",
          "Maui Coast Hotel — Kihei, often about $200–320. A food truck is a walk. Grocery the first hour.",
          "Holiday Inn Express Kahului — often about $180–260, the crash pad the night you land, not the week."
        ],
        [
          "Honua Kai — a Kaanapali condo with a kitchen, often about $400–600 a night. Add the resort fee before you compare it with Kihei.",
          "Sheraton Maui — the Kaanapali path, often about $450–650 before a resort fee that is often about $40 and parking that is often $25–40.",
          "The Westin Maui — the same beach and the same fee logic, often about $400–650.",
          "Hyatt Regency Maui — a bigger campus, often about $400–600, same fees."
        ],
        [
          "Grand Wailea — Wailea, often about $700–1,200 a night, plus a resort fee.",
          "Andaz Maui — often about $800–1,400. The room is the treat, not also every boat.",
          "Four Seasons Resort Maui — often $1,000 and up.",
          "The Ritz-Carlton, Kapalua — a different drive, often about $600–1,000. It is not Kihei."
        ]
      ),
      eat: tiers(
        [
          "Foodland or the first market after OGG — breakfast from the kitchen, often about $8–12 a person.",
          "A Kihei food truck — lunch often about $14–20.",
          "A Paia food truck on the way back from Hana — often about $12–18. Not a reason to change hotels.",
          "Two cooked dinners in the condo — the grocery bag, often about $15–25 a person for the night."
        ],
        [
          "Paia Fish Market — often about $18–30. One fish plate.",
          "Monkeypod Kitchen — often about $25–45 a person, and only if you are already in Wailea.",
          "A plate lunch — often about $14–18 — on the days the kitchen is not on.",
          "One cafe breakfast out — about $15 — then back to the kitchen."
        ],
        [
          "Mama's Fish House — often about $80–150 a person, the Paia reservation. Book it. It is not the same night as Spago.",
          "Morimoto Maui or Spago at Four Seasons — often about $100 and up a person. One Wailea dinner.",
          "A resort breakfast buffet — often $30–50 a person — which is a second lodging charge.",
          "A second fish dinner at $40 and up the next night. The kitchen was the point of the condo."
        ]
      ),
      do: tiers(
        [
          "Keawakapu or the sand in front of the condo — $0.",
          "A Kaanapali path walk if that is the hotel — $0. The resort fee is already in the room decision.",
          "A grocery hour — often about $40–70 for two in the cart, not a ticket.",
          "A sunset from the same coast — $0."
        ],
        [
          "Haleakalā — $30 a vehicle for the park, plus a $1 sunrise reservation from 3 a.m. to 7 a.m. A fee-free entrance day does not waive the reservation.",
          "The Road to Hana in your own car — gas, and a few parking lots that are often about $10–15. A guided van is often about $150 a person.",
          "A compact rental — often about $60–90 a day before airport fees. Kihei to Kaanapali is a drive.",
          "One of those mornings. Haleakalā is $31 all-in for the car. The boat is often $150–200 a person. Not all three."
        ],
        [
          "A Molokini boat — often about $150–200 a person. Kai Kanani leaves from the Wailea side; Pride of Maui leaves from Maalaea.",
          "Haleakalā ($31) plus a boat (often $150–200 a person) plus Hana — three mornings. The week does not hold them as errands.",
          "Resort parking on Kaanapali or Wailea — often about $25–40 a night, on top of a resort fee near $40.",
          "A second hotel night, often another $400 or more, so you can be closer to one restaurant — that is a lodging decision, not a dinner."
        ]
      ),
      walk: walk(
        "Two adults, five nights in a Kihei kitchen, grocery most meals, one fish dinner inside the food band, a rental, and Haleakalā. The boat and Hana are other trips, not this total.",
        [
          line("Lodging", "A Kihei condo at about $460 a night × 5 = $2,300 before Hawaii’s 17.75% lodging tax. Inside $420–520."),
          line("Food", "About $55 a person × 2 × 5 days = $550. Inside $40–75, because the kitchen cooks most nights."),
          line("Car", "A compact rental at about $70 a day × 5 = $350, before airport fees. This is the worked example, not a quote."),
          line("Park", "Haleakalā entrance $30 a vehicle, plus the $1 sunrise reservation.")
        ],
        "A condo day is the room ($460) plus food for two ($110) plus the rental ($70): about $640. The summit morning adds $31.",
        "5-night stay",
        "About $3,230 before lodging tax, airport car fees, and flights ($2,300 + $550 + $350 + $31). Lodging plus food alone is $2,850, inside the Quick facts sample of $2,500–3,400. A Molokini morning would add about $150–200 a person on a different day."
      ),
      hidden: [
        "Hawaii lodging tax about 17.75% on a pre-tax quote",
        "Kaanapali and Wailea resort fees are often about $40 a night, and self-parking is often about $25–40 more",
        "A resort breakfast buffet is often $30–50 a person",
        "Haleakalā is $30 a vehicle plus a $1 sunrise reservation. A Molokini boat is often $150–200 a person. A guided Hana van is often about $150. Those are three mornings",
        "A second lodging night so you can be closer to one restaurant"
      ],
      book: [
        "The Haleakalā sunrise reservation — $1, from 3 a.m. to 7 a.m. — on top of the $30 vehicle entrance",
        "Hana as its own early start. A guided van is often about $150 a person if you do not want the drive",
        "The car at OGG, often about $60–90 a day before fees, plus a grocery stop the first hour",
        "One fish dinner if you want Mama's — often about $80–150 a person — not five"
      ],
      sources: ["NPS Haleakalā: vehicle entrance $30; sunrise reservation $1 from 3 a.m. to 7 a.m.", "Pride of Maui (Maalaea) and Kai Kanani (Wailea) are different harbors"]
    },
    cruise: {
      ticket: "Port fees on a 7-night Caribbean are about $200 a person. Automatic gratuities are about $16–20 a person per day, including kids age 2 and up. A drink package is often about $54–105 a person per day.",
      stay: tiers(
        [
          "An interior guarantee on Carnival, MSC, or Royal — the cruise table runs about $250–650 a person for 7 nights before port fees. You bought the itinerary, not the porthole.",
          "An obstructed oceanview — often about $50–150 a person above an interior, still Budget, if the window matters.",
          "A lower-deck midship interior — often about $250–650 a person before port fees, the cheap cabin on purpose.",
          "Skip the drink-package upsell at check-in. A package at $70 a person per day is about $980 for two over 7 nights."
        ],
        [
          "A balcony on Royal Caribbean or NCL — the table’s balcony add is about $500 a person on top of the interior.",
          "A covered balcony on a 7-night Caribbean — still about a $500-a-person jump from an interior, without higher suite gratuities.",
          "An oceanview midship if the $500-a-person balcony jump would eat the port day you wanted.",
          "A Celebrity or Princess balcony — compare the line, not only the Carnival interior you started with. Gratuities are still about $16–20 a person per day."
        ],
        [
          "A large balcony or an aft-wrap — the cabin people remember, often well above the $500-a-person balcony add.",
          "NCL Haven or a Royal suite — suite gratuities run higher than $16–20. Price that line before you tap yes.",
          "A pre-cruise hotel — about $200 in the cruise table — when the flight can miss the ship.",
          "A spa-deck cabin — quieter, and it is not a fare quote until gratuities of about $16–20 a day and port fees of about $200 a person are on the card."
        ]
      ),
      eat: tiers(
        [
          "The buffet or the main dining room — $0 extra, in the fare. Breakfast, lunch, and dinner.",
          "Pay-as-you-go drinks. A soda or a beer is often about $8–14. Run the break-even before a package.",
          "Skip the specialty cover on a Budget cruise. Chops Grille or Cagney's is about $45 a person.",
          "Room service — many lines add a fee, often about $8–10, so it is a backup, not breakfast."
        ],
        [
          "Main dining most nights — $0 extra. That is the product you already paid for.",
          "Giovanni's Italian Kitchen or Hooked — one specialty night, still about $40–55 a person, and not also Chops.",
          "A kids’ soda package — often about $10–15 a day, and often the package that wins on a short sailing. It is not the adult drink package at $54–105.",
          "Pay-as-you-go at about $25 a person per day loses to a $70 package only if you actually drink that much."
        ],
        [
          "Chops Grille or Cagney's — about $45 a person, one night.",
          "A chef’s table on Holland America or Celebrity — often about $100 and up a person. Not a nightly cover.",
          "An unlimited adult drink package — often $54–105 a person per day. On many lines both adults in the cabin must take it.",
          "A latte habit at the cafe — often $4–6 a cup, which is how a ‘free’ week leaks."
        ]
      ),
      do: tiers(
        [
          "The gangway — $0 to walk off. The transfer is in the cruise, not a rental car.",
          "Nassau’s Queen’s Staircase or Cozumel’s San Miguel on foot — $0 beyond the ship.",
          "A pool day at sea — $0 extra, in the fare.",
          "The sail-away — $0."
        ],
        [
          "One ship excursion — often about $60–120 a person. The other ports are walks.",
          "Wi-Fi for the week — often about $15–25 a day if you need it. It is not in the brochure fare.",
          "A drink-package break-even check before you tap yes. At $70 a person per day, two adults for 7 nights is about $980.",
          "Gratuities — about $18 a person per day in this example, inside the $16–20 band, including a child age 2 or older."
        ],
        [
          "A second excursion the same port — another $60–120 — when the walk was the plan.",
          "A pier kiosk tour, often another $60–120 a person, that duplicates the ship excursion. You pay twice for the same beach.",
          "Suite-grade gratuities — higher than $16–20 a day — on a Haven or suite cabin.",
          "Missing the ship — more expensive than the $200 pre-cruise hotel."
        ]
      ),
      walk: walk(
        "Two adults, one 7-night Caribbean balcony: an interior fare inside the cruise table, the $500-a-person balcony add, port fees, gratuities, main dining, pay-as-you-go drinks, one specialty night, and one excursion.",
        [
          line("Cabin", "Interior at about $650 a person × 2 = $1,300, inside the $1,200–2,000 sample for two. Balcony add about $500 × 2 = $1,000. Cabin about $2,300 before fees."),
          line("Port fees and tips", "Port fees about $200 × 2 = $400. Gratuities about $18 × 7 × 2 = $252."),
          line("Food and drinks", "Main dining is $0 extra. One specialty night at $45 × 2 = $90. Pay-as-you-go drinks at about $25 a person per day × 7 × 2 = $350. A $70 package for both would be about $980."),
          line("Shore", "One excursion at about $80 × 2 = $160. Other ports walked, $0.")
        ],
        "A sea day is the cabin’s daily share (about $2,300 / 7 = $330) plus a port-fee share (about $55) plus gratuities ($36) plus drinks (about $50): about $470 for two, with dinner in the fare.",
        "7-night sailing",
        "About $3,550 before Wi-Fi and flights ($2,300 cabin + $400 port fees + $252 gratuities + $90 specialty + $350 drinks + $160 excursion). The Quick facts interior sample of $1,200–2,000 is before the balcony, drinks, and the excursion."
      ),
      hidden: [
        "Port fees about $200 a person on a 7-night Caribbean",
        "Gratuities about $16–20 a person per day on mainstream lines, including kids age 2 and up",
        "A drink package is often $54–105 a person per day. At $70, two adults for 7 nights is about $980, and many lines require both adults to take it",
        "Specialty dining is about $45 a person at Chops Grille or Cagney's",
        "Wi-Fi is often about $15–25 a day, a second excursion is often another $60–120 a person, and a pre-cruise hotel is about $200 if the flight is tight"
      ],
      book: [
        "Cabin class and the sailing date. An interior in the cruise table is about $250–650 a person before a balcony add of about $500 a person",
        "A pre-cruise hotel, about $200, if the inbound flight cannot miss the gangway",
        "The drink package only after the break-even. Pay-as-you-go at about $25 a person per day is the comparison",
        "One ship excursion, often about $60–120 a person. Walk the other ports"
      ],
      sources: ["Cruise-line gratuity pages: about $16–20 a person per day, children 2 and older", "Drink packages often $54–105 a person per day; specialty dining about $45"]
    },
    key_west: {
      ticket: "Yankee Freedom to Dry Tortugas is about $235 adult on the Key West Attractions Association listing (the operator site has posted from about $245), and it takes the whole day. Fort Zachary Taylor is $2.50 if you walk or bike in. Sunset at Mallory Square is free.",
      stay: tiers(
        [
          "The Big Ruby — a guesthouse, a walk to Duval, often about $160–260 a night before Florida’s 12.5% lodging tax. No car.",
          "Caribbean House — Truman Annex side, often about $150–240. Quieter than the bar strip.",
          "Hampton Inn Key West — Old Town-adjacent, often about $180–280, still walkable.",
          "A smaller Truman Annex inn — often about $150–230. You are paying for the walk, not for a pier view."
        ],
        [
          "The Gardens Hotel — a courtyard inn, often about $280–400 a night before the 12.5% lodging tax.",
          "Kimpton Palms Hotel — walkable, often about $250–380.",
          "Hyatt Centric Key West — Old Town water, often about $300–450. You can walk to dinner.",
          "Courtyard Key West Waterfront — often about $250–380. One neighborhood."
        ],
        [
          "Casa Marina — Waldorf, the beach end, often about $400–700. You can still walk.",
          "Ocean Key or Pier House — the address is the premium, often about $400–800.",
          "Hot Tin Roof’s hotel, Ocean Key, is the pier Splurge. The sidewalk at Mallory is $0.",
          "Oceans Edge on Stock Island — a marina and a shuttle. A cab both ways is often about $15–25 each way, which spends a cheap rate."
        ]
      ),
      eat: tiers(
        [
          "Cuban Coffee Queen — coffee and a sandwich often about $8–14. That is breakfast.",
          "Garbo's Grill — a counter lunch, often about $12–18. Not a Mallory menu.",
          "El Siboney — a Cuban dinner, often about $15–25 a person, off the tourist row.",
          "A slice of key lime once — about $5–7. It is not dinner."
        ],
        [
          "Blue Heaven — the courtyard, often about $25–45 a person. Go at opening if you want that table.",
          "Pepe's — a harbor breakfast or lunch, often about $15–28.",
          "Schooner Wharf fritters — a snack, often about $8–12, not the meal.",
          "A grocery bag for a Fort Zach afternoon — often about $12–18 for two."
        ],
        [
          "Louie's Backyard — the waterfront table, often about $70–120 a person. Book it.",
          "Latitudes at Sunset Pier — the other Splurge, often about $60–100. Not the same night.",
          "Hot Tin Roof at Ocean Key — the pier Splurge, one night, often about $70–120. It is not the sunset plan.",
          "A Mallory Square menu — often $30–50 for a plate, plus a markup on a sunset you can watch from the sidewalk for $0."
        ]
      ),
      do: tiers(
        [
          "Mallory Square from the sidewalk at sunset — $0.",
          "Duval as a street you walk — $0. It is not a hotel strategy.",
          "The Southernmost Point buoy — a photo, $0, not a morning.",
          "Old Town on foot from The Big Ruby or The Gardens — $0 in fares."
        ],
        [
          "Fort Zachary Taylor — $2.50 to walk or bike in. A car with two people is $7.",
          "The Hemingway Home — about $18 a person. Its own hour.",
          "A Sebago sunset sail — often about $40–70 a person, only if the sidewalk was not enough, and not after the ferry.",
          "An Old Town garage — often about $20–40 a day if you drove a car you will not move."
        ],
        [
          "Yankee Freedom to Dry Tortugas — about $235 adult, the whole day, park entry and a lunch included in that fare.",
          "A seaplane to the Tortugas — often about $350 and up a person. It replaces the ferry. It is not an add-on after it.",
          "Parasail — often about $50–70. Fort Zach is the swim, at $2.50.",
          "EYW airfare is often $150 or more above a Miami ticket. The drive down is a full day, plus gas and a rental that is often about $50–80."
        ]
      ),
      walk: walk(
        "Two adults, three nights at The Gardens or The Big Ruby, Cuban coffee, one El Siboney or Blue Heaven night, walking, and Fort Zach. The Dry Tortugas ferry is a separate day if the calendar is empty.",
        [
          line("Lodging", "About $300 a night × 3 = $900 before Florida’s 12.5% lodging tax. Inside $250–360."),
          line("Food", "About $80 a person × 2 × 3 days = $480. Inside $60–100."),
          line("Transit", "$0 on foot from an Old Town inn. A rental you do not move often costs about $20–40 a day to park."),
          line("Tickets", "Fort Zachary Taylor at $2.50 × 2 = $5 if you walk in. Hemingway Home, if you add it, is about $18 each.")
        ],
        "A walking day is the room ($300) plus food for two ($160) plus Fort Zach ($5): about $465 before tax.",
        "3-night trip",
        "About $1,385 before lodging tax and flights ($900 + $480 + $5). Lodging plus food is $1,380, inside the Quick facts sample of $1,100–1,700. Add about $470 if both of you take Yankee Freedom at about $235 adult. That ferry is outside the lodging-and-food sample, and it takes the whole day."
      ),
      hidden: [
        "Florida lodging tax about 12.5% on the room",
        "Old Town parking is often about $20–40 a day if you drove a car you will not use",
        "A Stock Island cab is often about $15–25 each way",
        "EYW airfare is often well above a Miami ticket. The drive is a full day plus gas and a rental",
        "Yankee Freedom is about $235 adult. A sunset sail is often $40–70. A seaplane is often $350 and up. They do not share a day"
      ],
      book: [
        "An Old Town room you can walk from — mid band about $250–360 before 12.5% tax",
        "The Dry Tortugas ferry, about $235 adult, only if that day has nothing else on it",
        "Blue Heaven if you want that courtyard — often about $25–45 a person. Go early",
        "EYW midweek, or the drive from Miami priced as a full day"
      ],
      sources: ["Key West Attractions Association: Yankee Freedom day trip about $235 adult", "Fort Zachary Taylor: $2.50 walking or biking, $7 for two people in a car"]
    }
  };

  pack.ALL.forEach(function (g) {
    var row = D[g.id];
    if (!row) throw new Error(g.id + ": dense overlay missing");
    g.stayTiers = row.stay;
    g.eatTiers = row.eat;
    g.doTiers = row.do;
    g.walk = row.walk;
    if (row.hidden) g.hidden = row.hidden;
    if (row.book) g.book = row.book;
    if (row.aroundRule) g.aroundRule = row.aroundRule;
    if (row.ticket) {
      (g.money || []).forEach(function (moneyRow) {
        if (moneyRow.dt === "#1 ticket") moneyRow.dd = row.ticket;
      });
    }
    ["stay", "eat", "do"].forEach(function (key) {
      var block = row[key];
      ["budget", "mid", "lux"].forEach(function (band) {
        if (!block[band] || block[band].length < 4) {
          throw new Error(g.id + ": dense " + key + " " + band + " needs 4 bullets");
        }
      });
    });
    if (!row.walk || row.walk.lines.length < 4) throw new Error(g.id + ": dense walkthrough thin");
    if (row.sources && R[g.id]) {
      R[g.id].sources = (R[g.id].sources || []).concat(row.sources);
    }
  });
})(typeof window !== "undefined" ? window : this);
