/* Polish pass: city-specific getting-around lines, less stacked
   Start here copy, denser Mid-range and Splurge brands, sharper gems.
   Loaded after city-guides-lists.js. Does not add an outline section.
*/
(function (global) {
  "use strict";

  var pack = global.VM_CITY_GUIDES;
  var R = global.VM_CITY_GUIDE_RESEARCH;
  if (!pack || !pack.ALL || !R) throw new Error("polish needs guides and research");

  function add(arr, extra) {
    extra.forEach(function (item) {
      if (arr.indexOf(item) < 0) arr.push(item);
    });
  }

  var P = {
    disney: {
      hook: "Pop Century next to a Skyliner park is a different trip from a monorail Deluxe resort plus Park Hopper. The dining plan is usually how people who booked the cheaper stay end up spending like the expensive one.",
      startHere: "If Hollywood Studios and Epcot are the days that matter, take Pop Century, Art of Animation, or Caribbean Beach and grocery the room after MCO. Keep one park on the ticket. Hopper can wait until you know you will actually switch after lunch.",
      aroundRule: "Disney buses and the Skyliner are the week. A rental is for a Winter Garden grocery run, not a drive to Magic Kingdom that then costs about $35 to park.",
      aroundCar: [
        "Garden Grocer or a Winn-Dixie run, then leave the car at the resort",
        "Driving to a park gate adds about $35 a day. Resort buses do not",
        "Do not use the car to hop four parks. That is what Hopper wishes it were"
      ],
      sources: ["Walt Disney World transportation pages: Skyliner vs monorail vs bus", "Calculator park-parking line, about $35"]
    },
    anaheim: {
      hook: "Harbor Boulevard puts you within walking distance of both Disneyland parks. Santa Monica, a dining plan, and a Universal day are three ways to spend that same money somewhere else.",
      startHere: "Candy Cane Inn, or any Harbor hotel you can walk from, plus an Albertsons or Target run the night you land. Disneyland one day, California Adventure the next. Universal Studios Hollywood belongs on a Los Angeles calendar.",
      aroundRule: "Walk Harbor or ride ART to the esplanade. SNA is the close airport. A cheap LAX fare still owes the ground ride, and a rental that sleeps in the garage is only a parking bill.",
      aroundCar: [
        "A Target or Albertsons run, then the car stays",
        "Do not drive to Santa Monica for dinner. That is a park day spent on the 5",
        "Hotel parking is the cost of a car that never reaches the gate"
      ]
    },
    los_angeles: {
      hook: "Los Angeles food is neighborhood food. The bill people remember is the rideshare across town, and the hotel garage they paid for on a night they did not drive.",
      startHere: "Pick the bed first — Downtown, Koreatown, or Santa Monica — and let the restaurants follow that choice. Porto's or Grand Central Market in the morning. Reserve the Getty if you want the free museum; buy Universal only if that is the one paid day.",
      aroundRule: "The E Line is the Downtown–Santa Monica trip on TAP. A car earns the $40–60 hotel garage on a Getty or canyon day, and loses money every other night.",
      aroundCar: [
        "Getty Center parking, or a canyon, on a day you meant to drive",
        "Dinner stays in the neighborhood of the hotel",
        "BUR or SNA can beat a cheap LAX fare once the ground ride is counted"
      ]
    },
    nyc: {
      hook: "The subway ride is cheap. The trip gets expensive when the hotel is in the wrong neighborhood and lunch keeps landing in Midtown.",
      startHere: "Sleep on a train you will ride: citizenM on the Bowery, Pod 39, or The Hoxton in Williamsburg. Bodega egg-and-cheese in the morning. Spend on the Met, MoMA, or one Broadway seat — Times Square is a corridor, not a hotel strategy.",
      aroundRule: "OMNY on the subway under the hotel covers the city, and the cap is about $35 after 12 local rides on the same card. A Manhattan garage plus a tunnel is a different vacation."
    },
    vegas: {
      hook: "A Tuesday room rate looks cheap until you add the nightly resort fee, a Saturday night, and one steakhouse dinner on the Strip.",
      startHere: "Arrive Tuesday, leave before Saturday, and stay at Park MGM, New York-New York, or Circa. Add about $35–55 a night for the resort fee before you tell anyone the room was cheap. The fountains are a walk.",
      aroundRule: "Center-Strip, from Park MGM to the Bellagio fountains, is a sidewalk. The Deuce is the backup. Rent a car only if Red Rock is actually on the calendar.",
      aroundCar: [
        "Red Rock or Valley of Fire, that morning only",
        "A Strip garage fee on a walking week is money for a show you did not buy",
        "Fremont is one rideshare from Park MGM, not a reason to keep a car overnight"
      ]
    },
    miami: {
      hook: "A few blocks inland from Collins Avenue has the same sand as Ocean Drive without the postcard prices. The expensive mistakes are a Nikki Beach minimum and a rental car you barely use.",
      startHere: "The Gale, Freehand, or The Betsy. Versailles or a ventanita before you touch the beach. If you leave the sand, pick one of Wynwood, Little Havana, or Brickell — not a tour of all three.",
      aroundRule: "South Beach is a walk. Brickell is the Metromover, and that loop does not charge a fare. A car is for the Everglades morning, not for two blocks to Yardbird.",
      aroundCar: [
        "Everglades airboat day, or a Wynwood afternoon if you did not sleep near the Metromover",
        "Do not drive from Collins to a restaurant you can walk to",
        "MIA versus FLL only makes sense after the ground ride is on the card"
      ]
    },
    san_francisco: {
      hook: "A Clipper card and a Mission bakery will get you through San Francisco. A Union Square tourist hotel plus Fisherman's Wharf seafood on the same day will not.",
      startHere: "Hotel Emeline if you want to walk to the Ferry Building; the Mission if Tartine is the breakfast. Book the official Alcatraz ferry before you invent a second museum.",
      aroundRule: "Clipper on Muni and BART is the system. The Powell-Hyde cable car is one souvenir fare on top of that, not the pass. Parking is a Napa or Muir Woods expense."
    },
    chicago: {
      hook: "Winter is when a Loop or Fulton Market room makes sense. The expensive version is a suburban hotel rate, then Ubering to the Art Institute and a river cruise on the same afternoon.",
      startHere: "Freehand, a Loop Hampton, or The Hoxton. Eat at a diner, not at the Mag Mile hotel. Walk the Riverwalk before you buy anything.",
      aroundRule: "Ventra on the L includes the Blue Line from O'Hare and the Orange Line from Midway. A suburban hotel does not become the Loop because you rented a car; you will pay to park when you arrive."
    },
    nola: {
      hook: "Spend on Galatoire's or Commander's Palace, and sleep in the Warehouse District or on the St. Charles streetcar line. A Bourbon Street balcony looks good in photos and does nothing for the food bill.",
      startHere: "Hotel Peter and Paul, The Pontchartrain, or a Warehouse Hampton. Café du Monde once, then a neighborhood café. Parkway for the po'boy if the reservation is at night.",
      aroundRule: "The St. Charles streetcar is the Garden District. The Canal line is the Quarter from Mid-City. A car is for Whitney Plantation or Honey Island, and then it should sit.",
      aroundCar: [
        "Whitney Plantation or a Honey Island swamp morning",
        "Bourbon at night is a walk or a short ride, not a parking search",
        "The rental should not be the way you get from the hotel to dinner"
      ]
    },
    philadelphia: {
      hook: "Reading Terminal can feed you twice, and Independence Hall is free if you booked the timed ticket. An airport hotel charges you Regional Rail fare just to start every morning over.",
      startHere: "The Notary, by City Hall, or Kimpton Hotel Monaco if you want to walk to the Hall. Reading Terminal first. The Barnes or the Art Museum after that, not both.",
      aroundRule: "Center City and Old City are a walk, then SEPTA. Regional Rail is the penalty for sleeping at PHL. A hop-on bus sells streets the subway already covers."
    },
    atlanta: {
      hook: "MARTA from the airport and a walk from Ponce City Market to Krog Street Market are the cheap Atlanta. A hotel off the train means Ubers you will take twice, and Buckhead is a third fare.",
      startHere: "Ride MARTA from ATL to a Midtown Hampton, or get off for Hotel Clermont if the BeltLine is the evening. Mary Mac's or West Egg. Save the Aquarium or World of Coca-Cola for one morning, not both.",
      aroundRule: "MARTA from the airport station reaches Midtown and Five Points on one fare. The BeltLine is a footpath, not a train. The Atlanta Streetcar does not substitute for that walk.",
      aroundCar: [
        "A planned Buckhead dinner or Stone Mountain, if you accepted the drive",
        "The Eastside Trail does not need the car",
        "Two rides a day from Cumberland erase the room rate"
      ],
      tips: [
        "Hidden gem: MARTA from ATL to Midtown is one fare. A Cumberland hotel still owes two rides a day, which is the room you thought you saved.",
        "Hidden gem: The Atlanta Streetcar is not the BeltLine. Ponce City Market through Inman Park to Krog Street Market is a walk with no admission. A streetcar loop does not buy that path.",
        "Hidden gem: Georgia Aquarium tickets and World of Coca-Cola tickets are separate products. A city pass only helps if you will finish both. Piedmont Park and the MLK National Historical Park do not need either.",
        "Read the convention calendar before an Atlanta Marriott Marquis rate looks like the normal week.",
        "Fox Bros. or Mary Mac's. Bones is a Buckhead ride the trail did not require."
      ],
      sources: ["MARTA airport line vs Atlanta Streetcar — different systems", "BeltLine Eastside Trail has no admission"]
    },
    paris: {
      hook: "Paris stays affordable when breakfast is a bakery downstairs and you pick one museum. It stops being cheap when the room faces the tower, the summit ticket is from a reseller, and lunch is on the tourist steps.",
      startHere: "An Ibis or a walk-up near République puts the Metro at the corner and breakfast downstairs. Decide between the Louvre and the Orsay before you fly. Septime is a table you either hold or you do not.",
      cta: "Build the Paris week from the arrondissement, not the postcard. The Trip Plan should show one museum and, only if you already hold it, Septime.",
      aroundRule: "Navigo or a carnet on the Metro. The free tower picture is the walk to Trocadéro, not a taxi to a summit elevator. A rental in the 10th is a parking problem.",
      stayMid: ["Hôtel Fabric or a Canal Saint-Martin boutique — the mid that is not a Novotel tower"],
      stayLux: ["Cheval Blanc on the quai — the palace breakfast is not the bakery downstairs"],
      eatMid: ["Clamato or Septime La Cave if the main Septime room is gone — still that kitchen's prices"],
      eatLux: ["Le Comptoir du Relais — the counter fills; it is not a 9 p.m. walk-up"],
      doMid: ["Musée de l'Orangerie, timed, on the day you did not do the Orsay"],
      doLux: ["A Seine dinner cruise is a paid version of the view Trocadéro already gave you"],
      sources: ["Official Eiffel Tower tickets vs reseller markups", "Navigo Semaine is Monday–Sunday (Île-de-France Mobilités rules), not a rolling week"]
    },
    london: {
      hook: "Contactless fare caps and free national museums make London workable. Mayfair lodging plus the London Eye plus the Tower is a week that looks full and costs about twice as much.",
      startHere: "Premier Inn County Hall if you want the river walk, or The Hoxton if you want restaurants on the block. Tesco or a bakery the first morning. The British Museum or the National Gallery before you even look at the Eye.",
      cta: "Price the London Trip Plan with the contactless cap already assumed. A Heathrow hotel is a landing night. The Eye is optional.",
      aroundRule: "Tap contactless on the Tube, the bus, and the Elizabeth line. The same card on Heathrow Express bills the Express fare, not a Tube fare. A car in Zone 1 also meets the congestion charge.",
      stayMid: ["The Resident Victoria or South Kensington — museum mile without a Mayfair rate"],
      stayLux: ["The Ned — the room is the scene, and breakfast is still its own line"],
      eatMid: ["Padella or Flat Iron — the queue is the price, not a Mayfair markup"],
      eatLux: ["Gymkhana — one serious curry, which is a different restaurant from Dishoom"],
      doMid: ["A TodayTix or Leicester Square TKTS day seat"],
      doLux: ["Tower of London direct ticket. A London Pass does not get cheaper because the British Museum was free"],
      tips: [
        "Hidden gem: Tapping a contactless card on Heathrow Express bills the Express fare, about £26 walk-up, not the Elizabeth line (about £15.50 to Zone 1) and not the Piccadilly line. Advance Express can start near £10. Check the product before you keep an airport hotel all week.",
        "Hidden gem: A London Pass looks useful until you count the British Museum, the National Gallery, Tate Modern, and the Natural History Museum as already free. The pass only has a chance if a Tower ticket was going to be paid anyway, and a direct Tower ticket is often less.",
        "Hidden gem: Contactless capping is the fare, about the price of a few taps, with no card to buy. A Visitor Oyster has a purchase fee. A paper Travelcard is the old product.",
        "Borough Market is one lunch. Padella or a Tesco meal deal covers the meals that are not a celebration.",
        "A TKTS or TodayTix day seat is the show. A full-price orchestra seat is the Splurge, and it is not required for the plot."
      ],
      sources: ["2026 fare notes: Elizabeth line to Zone 1 about £15.50; Heathrow Express walk-up about £26; advance Express from about £10", "National museums free general admission; special exhibitions are separate"]
    },
    rome: {
      hook: "Rome is a walking city until you sit down. The money goes to a Piazza Navona table, a golf-cart tour, and a second ruin ticket you tried to squeeze in before lunch.",
      startHere: "Sleep in Trastevere, or in Prati near Ottaviano if the Vatican is the day you care about. Cornetto and coffee standing at the bar. Give the Colosseum and Forum their own day.",
      cta: "The Rome Trip Plan is a neighborhood and one timed ticket. If a golf cart is on it, delete the golf cart.",
      aroundRule: "Trastevere to the Pantheon is a walk. Metro A to Ottaviano is the Vatican. A taxi on Via del Corso at noon is stuck traffic with a meter.",
      stayMid: ["Hotel Santa Maria — a Trastevere courtyard, walk to dinner"],
      stayLux: ["Palazzo Manfredi — you are paying for the Colosseum view, not for a shorter walk"],
      eatMid: ["Trapizzino in Testaccio — the stuffed pizza bread, not a piazza carbonara"],
      eatLux: ["Armando al Pantheon only if the table exists. The door is not a plan"],
      doMid: ["Borghese Gallery timed entry — it sells out separately from the Vatican"],
      doLux: ["The Villa Borghese park outside the gallery is free. The ceiling inside is the ticket"],
      tips: [
        "Hidden gem: Order the cornetto and the coffee al banco, standing. The seated price on Piazza Navona is a different menu for the same pastry, before dinner even starts.",
        "Hidden gem: The Colosseum and the Roman Forum share one timed ticket. The Vatican Museums are a second ticket and a second morning. A golf cart sells the walk between them.",
        "Hidden gem: Borghese Gallery tickets are timed and they go. The park around the gallery does not. A 48-hour metro pass does not get you into either.",
        "Hotel de Russie breakfast is the Splurge morning. The bar on the walk to the Pantheon is the other one.",
        "August reprices centro hotels and closes kitchens. The street in front of the Pantheon is still free."
      ],
      sources: ["Rome bar service (al banco) vs table service in standard city guides", "Parco Archeologico del Colosseo combined ticket vs Vatican Museums"]
    },
    tokyo: {
      hook: "Tokyo stays cheap when the hotel sits above a station and breakfast is a convenience-store onigiri. It gets expensive when the buffet is in the room rate and someone buys a JR Pass for a week that never leaves the Yamanote line.",
      startHere: "APA, Toyoko Inn, or Mitsui Garden over a JR or Metro stop, and eat the lobby konbini. Stay in one ward. A sushi counter only counts if it was booked before the flight.",
      cta: "The Tokyo Trip Plan is a station hotel and a Suica. A nationwide rail pass does not belong on a city week.",
      aroundRule: "Suica or PASMO from the station under the hotel covers JR, Metro, and most buses. A taxi is for luggage at Haneda or Narita, not for Shibuya to Shinjuku.",
      stayMid: ["Trunk Hotel Shibuya or Sequence Miyashita Park — the mid that is not a business-hotel clone"],
      stayLux: ["Hoshinoya Tokyo — a ryokan product in the city; dinner is still a Metro ride"],
      eatMid: ["Ichiran or Afuri — a named ramen, not a category"],
      eatLux: ["Sushi Yoshitake or a Toyosu counter — booked from home, or it is conveyor sushi"],
      doMid: ["Ghibli Museum, Mitaka — the official advance lottery, not a same-day booth in Shibuya"],
      doLux: ["teamLab Borderless at Azabudai Hills and teamLab Planets in Toyosu are different tickets. A reseller 'teamLab' voucher often means the wrong one"],
      tips: [
        "Hidden gem: Suica or PASMO is the Tokyo card. A JR Pass is a national product. On a week that stays on the Yamanote, Metro, and a Kamakura side trip, the pass is a ticket you will not ride.",
        "Hidden gem: Haneda is the closer airport. A cheaper Narita fare still owes a Skyliner or Narita Express ticket before it wins.",
        "Hidden gem: teamLab Planets is in Toyosu. teamLab Borderless is at Azabudai Hills. They are different tickets in different wards. A voucher that only says teamLab is how people buy the wrong one.",
        "The Ghibli Museum in Mitaka is an official advance draw, not a ticket window on the day. If you do not hold one, Yanaka is the free morning.",
        "Book the sushi counter before you land. Conveyor sushi is the honest backup, and it keeps the room."
      ],
      sources: ["teamLab Planets (Toyosu) vs teamLab Borderless (Azabudai Hills) are separate venues", "Ghibli Museum tickets are advance-only, not same-day Shibuya sales"]
    },
    cancun: {
      hook: "An all-inclusive in the Hotel Zone already covers the beach and the buffet. It did not buy the airport transfer, a timeshare morning, or a rental car parked under the tower.",
      startHere: "Compare Hyatt Ziva, Moon Palace, and a Riu only after the airport van is inside each rate. Eat on property the night you land. Isla Mujeres is a later day, not the transfer.",
      cta: "If the Cancún Trip Plan shows two resorts and no van, it is not finished. One outing after the beach is the week.",
      aroundRule: "The Hotel Zone R-1 is the bus. The airport van should already be inside the Hyatt, Moon Palace, or Riu rate. A rental is for a Chichén morning, then it waits.",
      aroundCar: [
        "Chichén Itzá or a cenote, as the one day the car moves",
        "Do not drive the Hotel Zone for a beach you can reach on the R-1",
        "Nizuc or Rosewood Mayakoba is a different transfer from the Hotel Zone, not a cheaper Riu"
      ],
      eatLux: ["Le Blanc's fine-dining room — the meal the Splurge rate was for"],
      doMid: ["Ultramar ferry from Puerto Juárez to Isla Mujeres — the public fare, not a Hotel Zone catamaran lunch"],
      tips: [
        "Hidden gem: If the airport van is missing from the Hyatt Ziva, Moon Palace, or Riu quote, the cheaper all-inclusive is not cheaper. Price the van before the room.",
        "Hidden gem: Ultramar runs the public ferry to Isla Mujeres from Puerto Juárez. A Hotel Zone catamaran sells that crossing bundled with a lunch the buffet already included.",
        "Hidden gem: Garden view and swim-up are different room codes. The Riu or Oasis rate on the page is rarely the swim-up the desk offers after you have landed.",
        "The R-1 bus is the Hotel Zone hop. Chichén Itzá does not share a day with the Isla ferry.",
        "A timeshare breakfast is a presentation. It is not included in the all-inclusive, and it is not the airport van."
      ],
      sources: ["Ultramar is the public Isla Mujeres ferry; Hotel Zone boats are a separate product", "Visitax is once per visit, about $15, including children — kept in Hidden costs, not repeated as a gem"]
    },
    oahu: {
      hook: "Waikiki on TheBus, with a plate lunch, is a complete week. Resort breakfast and a rental that sleeps in a $40–55 garage are how the same beach gets expensive.",
      startHere: "The Equus or a Kuhio room if you want the kitchenette, or the Outrigger if you want Kalakaua. Rainbow Drive-In or a grocery run. Reserve either Hanauma Bay or Pearl Harbor, and leave the other for a different trip.",
      aroundRule: "A HOLO card on TheBus until the morning you have a Hanauma reservation or a North Shore plan. Cash on the bus does not include the transfer window. Waikiki parking is about $40–55 a night whether or not the car moved.",
      aroundCar: [
        "Start the rental the morning of Hanauma or Haleʻiwa, not at the airport on arrival if the first days are Waikiki",
        "The other nights the car should not be in a Waikiki garage",
        "Kahala and Ko Olina assume you will drive. Waikiki does not"
      ],
      eatMid: ["Helena's Hawaiian Food — poi and pipikaula, a bus ride from Kalakaua"],
      eatLux: ["Sen of Japan or a Halekulani counter — one, then grocery breakfast"],
      tips: [
        "Hidden gem: Start the rental the morning you drive to Hanauma Bay or Haleʻiwa. Every earlier night in a Waikiki garage is about $40–55 for a car that did not move.",
        "Hidden gem: A HOLO card on TheBus includes a transfer window and a day cap. Cash fares do not. The North Shore is that transfer, not a walk from Kuhio.",
        "Hidden gem: Hanauma Bay needs a reservation, and non-residents pay an entry fee on top of parking. The USS Arizona memorial is timed and free; the Missouri is the paid ship. They are not one ticket.",
        "Rainbow Drive-In or L&L is the plate. The resort café is the same beach at a higher check.",
        "Leonard's is a malasada on the way back, not a reason to keep the car overnight."
      ],
      sources: ["Honolulu DTS HOLO fare sheet: transfer window and day cap; cash fares differ", "Hanauma Bay reservations and non-resident entry fee, separate from parking"]
    },
    maui: {
      hook: "A Kihei condo with a kitchen already includes the beach in front of it. The expensive week stacks the Road to Hana, a Haleakalā sunrise, and a Molokini boat as if they were errands.",
      startHere: "Take a Kihei kitchen — Aston Maui Kamaole, Kohea Kai, or something in that class — and grocery in the first hour after OGG. The sand that day is Keawakapu. The big outing gets its own morning.",
      aroundRule: "Kihei to Kaanapali is a drive. The car is the island the day you leave the condo path. Haleakalā before dawn needs that car and a separate sunrise reservation.",
      stayMid: ["Honua Kai or a Kaanapali condo — kitchen plus the path, still add the resort fee before it beats Kihei"],
      eatMid: ["Monkeypod Kitchen if you are already in Wailea — not a reason to change hotels"],
      eatLux: ["Morimoto Maui or Spago — one Wailea dinner. Mama's Fish House is the Paia reservation, not the same night"],
      doLux: ["Kai Kanani leaves from the Wailea side; Pride of Maui is the Maalaea boat. They are different harbors"],
      tips: [
        "Hidden gem: Haleakalā sunrise is a $1 vehicle reservation on Recreation.gov, required from 3 a.m. to 7 a.m., on top of the park entrance fee. A fee-free entrance day does not waive it, and there is no first-come line at the gate.",
        "Hidden gem: A Kihei kitchen at Aston Maui Kamaole or Kohea Kai is the budget. Sheraton or Westin Kaanapali still owes a resort fee and parking before that rate beats the condo.",
        "Hidden gem: Kai Kanani and Pride of Maui leave from different harbors. Booking 'a Molokini boat' without the harbor means a drive you did not put on the Hana day. Those are three mornings, not one.",
        "Grocery the first hour after OGG. Two cooked dinners change the week more than skipping Mama's.",
        "Paia Fish Market is the plate on the way back from Hana. It is not a reason to book a second hotel."
      ],
      sources: ["NPS Haleakalā: sunrise reservation $1, 3–7 a.m., separate from entrance", "Pride of Maui (Maalaea) vs Kai Kanani (Wailea) are different departures"]
    },
    cruise: {
      hook: "The brochure fare bought a cabin and the main dining room. Gratuities, port fees, and a drink package priced per person — including the adult who will not drink — are the rest of the week.",
      startHere: "Put port fees and gratuities on the card next to the interior or the balcony before you compare two 'from' prices. Eat in the main dining room the first night. Walk one port.",
      cta: "The cruise Trip Plan is unfinished until gratuities and the drink count are in the total. A pier tour is not required to leave the ship.",
      aroundRule: "You do not drive the ship. The gangway is the transfer. Nassau and Cozumel can be walked from the pier; a kiosk tour is a choice.",
      stayMid: ["Celebrity or Princess balcony if you are comparing lines, not only the Carnival interior you started with"],
      eatMid: ["Giovanni's Italian Kitchen or Hooked on Royal — a different specialty from Chops Grille, still one night"],
      eatLux: ["A chef's table on Holland America or Celebrity — the Splurge meal, not a nightly cover"],
      doMid: ["Nassau Queen's Staircase or Cozumel San Miguel on foot — the port without a kiosk"],
      tips: [
        "Hidden gem: A 'kids sail free' line does not waive gratuities once the child is 2. Mainstream lines still bill about $16–20 a person per day for that child. The infant under 2 needs documents, not a drink package, and does not make the adult package free.",
        "Hidden gem: Carnival CHEERS, Royal's Deluxe Beverage Package, and NCL's drink package bill per person. On many lines both adults in the cabin must take it. Run the drink-package break-even on the people who will drink, not on the cabin.",
        "Hidden gem: A children's soda package and an adult drink package are different products. Buying the adult package so a child can have Coke is how a short sailing loses.",
        "Add port fees, about $200 a person, before two brochure fares are comparable.",
        "One night at Chops Grille or Cagney's. Main dining is already in the fare the other nights."
      ],
      sources: ["Cruise-line gratuity rules: children 2 and older on mainstream lines", "Drink packages are per person; several lines require both adults in a cabin"]
    },
    key_west: {
      hook: "Old Town is a walk, Cuban coffee, and a sidewalk at Mallory Square. The money leaves when you eat on the pier or sleep on Stock Island and take a cab both ways.",
      startHere: "The Big Ruby, Caribbean House, or The Gardens, close enough that Duval is a walk. Cuban Coffee Queen in the morning. Be on the Mallory sidewalk at sunset, not at a table that rents the same sky.",
      aroundRule: "Duval and Mallory are a walk from an Old Town inn. A rental is the Overseas Highway day from Miami, or a parking bill if you brought it to drink on Duval.",
      aroundCar: [
        "The drive from Miami is a full day on the Overseas Highway — count it as a day",
        "Inside Old Town, park once. Do not move the car for dinner",
        "A Stock Island rate plus a nightly cab spends the discount"
      ],
      eatLux: ["Hot Tin Roof at Ocean Key — the pier Splurge, one night, not the sunset plan"],
      sources: ["Mallory Square sunset is a public sidewalk event", "Yankee Freedom is the Dry Tortugas ferry and takes the day"]
    }
  };

  pack.ALL.forEach(function (g) {
    var row = P[g.id];
    var notes = R[g.id];
    if (!row || !notes) throw new Error(g.id + ": polish missing");
    ["hook", "startHere", "cta", "aroundRule"].forEach(function (k) {
      if (row[k]) g[k] = row[k];
    });
    if (row.aroundCar) g.aroundCar = row.aroundCar;
    if (row.tips) g.tips = row.tips;
    if (row.stayMid) add(g.stayTiers.mid, row.stayMid);
    if (row.stayLux) add(g.stayTiers.lux, row.stayLux);
    if (row.eatMid) add(g.eatTiers.mid, row.eatMid);
    if (row.eatLux) add(g.eatTiers.lux, row.eatLux);
    if (row.doMid) add(g.doTiers.mid, row.doMid);
    if (row.doLux) add(g.doTiers.lux, row.doLux);
    if (row.sources) notes.sources = (notes.sources || []).concat(row.sources);
    var gems = (g.tips || []).filter(function (t) { return /^Hidden gem:/.test(t); });
    if (gems.length !== 3) throw new Error(g.id + ": polish broke gem count");
    notes.gems = gems;
    var blob = JSON.stringify(g);
    if (/Still one base/i.test(blob)) throw new Error(g.id + ": Still one base survived");
    if (/The overrun is/i.test(g.hook)) throw new Error(g.id + ": overrun hook survived");
  });
})(typeof window !== "undefined" ? window : this);
