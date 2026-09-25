/* A2 densification: money bands, named tiers, 5 additive tips, city voice.
   Loaded after city-guides-data.js. Does not reorder the locked outline. */
(function (global) {
  "use strict";

  var pack = global.VM_CITY_GUIDES;
  if (!pack || !pack.ALL) return;

  function walk(node, fn) {
    if (typeof node === "string") return fn(node);
    if (!node || typeof node !== "object") return node;
    if (Array.isArray(node)) {
      node.forEach(function (item, i) { node[i] = walk(item, fn); });
      return node;
    }
    Object.keys(node).forEach(function (k) {
      if (k === "id" || k === "href") return;
      node[k] = walk(node[k], fn);
    });
    return node;
  }

  function money(room, food, ticket, sample) {
    return [
      { dt: "Mid-range room", dd: room },
      { dt: "Food / person / day", dd: food },
      { dt: "#1 ticket", dd: ticket },
      { dt: "Sample total", dd: sample }
    ];
  }

  /* Exact full-string swaps so vague Stay/Eat/Do bullets name a place or product. */
  var SWAP = {
    "Lightning Lane only if this is the crowded day and you already priced it":
      "Lightning Lane Multi Pass on a peak Magic Kingdom or Hollywood Studios day — about $16–32, not a default",
    "Lightning Lane Multi Pass only if you already priced Magic Kingdom or Hollywood Studios":
      "Lightning Lane Multi Pass on Magic Kingdom or Hollywood Studios in a peak week — about $16–32 a person",
    "Beach Club or Yacht Club — walk to Epcot; club level only if you already priced it":
      "Beach Club or Yacht Club — walk to Epcot; club level is a second nightly rate",
    "Downtown Disney only if dinner is already priced — you are not driving to Santa Monica":
      "Downtown Disney dinner at Naples or Tortilla Jo’s — you are not driving to Santa Monica",
    "Lightning Lane on the Disneyland park day only, unless you already priced both":
      "Lightning Lane on the Disneyland park day only — California Adventure is a separate buy",
    "Carthay Circle or Lamplight Lounge — one table-service if you already priced it":
      "Carthay Circle or Lamplight Lounge — one table-service, booked before you fly",
    "World of Color dining only if you already priced it — Universal is a Los Angeles ticket":
      "World of Color dessert package — Universal Studios Hollywood is a Los Angeles ticket",
    "Universal or a studio tour if you already priced it":
      "Universal Studios Hollywood or the Warner Bros. studio tour — one ticketed day",
    "Ferry, or Broadway if you already priced it":
      "Staten Island Ferry, or a reserved Broadway seat",
    "One reserved dinner you came for — then bodega breakfast the next morning":
      "Le Bernardin or Via Carota — one reservation — then a bodega egg-and-cheese",
    "Village or LES dinner on the same side of the river as the bed":
      "L’Artusi in the Village or Russ & Daughters Cafe if you slept downtown",
    "One museum-neighborhood lunch — not a pre-theatre prix fixe every day":
      "Cafe Sabarsky once — not a pre-theatre prix fixe every day",
    "One museum with pay-what-you-wish or a timed free night":
      "The Met pay-what-you-wish for NY residents, or a timed MoMA ticket",
    "Fountains are free. Tables are not. One show if you already priced it.":
      "Fountains are free. Tables are not. Mystère or O is one show, not two.",
    "Cirque or a mid-room if you already priced it":
      "Mystère or O at the Bellagio — one show, not a table plus a second show",
    "One sit-down off the carpet — not a steakhouse every night":
      "Esther’s Kitchen or District One in Chinatown — one sit-down off the carpet",
    "One steakhouse or a named chef counter — then food hall the rest":
      "Bazaar Meat or Hell’s Kitchen at Caesars — one night — then the Park MGM food hall",
    "One Cirque or residency — the street is already a show":
      "Mystère or a residency at Dolby Live — the Bellagio fountains are already a show",
    "One named seafood reservation — then Cuban breakfast the next morning":
      "Joe’s Stone Crab or Stubborn Seed — one seafood reservation — then Versailles the next morning",
    "A beach-club cabana only if you already priced the minimum":
      "Nikki Beach or a 1 Hotel cabana — the minimum spend is the price",
    "A sit-down a few blocks off Ocean Drive — same sand, honest plate":
      "Yardbird on Collins — a sit-down a few blocks off Ocean Drive",
    "The beach grid you booked — Cuban breakfast, sand, dinner off Ocean Drive":
      "Lummus Park beach — Cuban breakfast, sand, dinner off Ocean Drive",
    "Flagship if you already priced it":
      "Fairmont or 1 Hotel if the room is the treat",
    "One reserved dinner — then bakery breakfast the next morning":
      "State Bird Provisions or Quince — one reservation — then Tartine the next morning",
    "Napa for dinner is a transfer, not a reservation":
      "The French Laundry is a Napa transfer, not a San Francisco reservation",
    "One reserved dinner — then diner breakfast the next morning":
      "Girl & the Goat or Oriole — one reservation — then a diner breakfast",
    "One deep-dish if you must — then neighborhood dinner":
      "Lou Malnati’s or Giordano’s once — then a Fulton Market dinner",
    "River North or Fulton Market sit-down — Mag Mile is a walk-through":
      "The Publican in Fulton Market — the Mag Mile is a walk-through",
    "Hotel Monteleone — Quarter flagship only if you already priced the premium":
      "Hotel Monteleone — Quarter flagship; the balcony premium is separate from the plate",
    "The reservation you came for — then a po’boy the next day":
      "Galatoire’s or Commander’s Palace — the reservation — then a Parkway po’boy the next day",
    "The reservation you came for — then a po'boy the next day":
      "Galatoire’s or Commander’s Palace — the reservation — then a Parkway po’boy the next day",
    "A plantation or swamp day only if you already priced the car":
      "Whitney Plantation or a Honey Island swamp tour — only with a car you already counted",
    "One music night you came for — then stop stacking festivals":
      "Preservation Hall or Frenchmen Street — one music night — then stop stacking festivals",
    "One club or a street you can walk — not a haunted-tour stack":
      "Frenchmen Street or Preservation Hall — not a haunted-tour stack",
    "Four Seasons Philadelphia — Logan Square if you already priced it":
      "Four Seasons Philadelphia — Logan Square; Independence timed entry is still the ticket",
    "Italian in the neighborhood, not Zahav unless you already priced it":
      "Vetri or Villa di Roma — Zahav only if that dinner is the trip",
    "Eastern State as a half-day if you already priced it — not three interiors plus a cheesesteak tour":
      "Eastern State Penitentiary as a half-day — not three interiors plus a cheesesteak tour",
    "One cheesesteak, then stop — roast pork is the local argument":
      "Pat’s or Geno’s once, then stop — DiNic’s roast pork is the local argument",
    "Neighborhood Italian at night — not three Rittenhouse salads":
      "Villa di Roma or a South Philly red-gravy room — not three Rittenhouse salads",
    "Hotel restaurants are the expensive version of the same plate":
      "The Rittenhouse dining room is the expensive version of a DiNic’s plate",
    "Four Seasons Atlanta — Midtown if you already priced it":
      "Four Seasons Atlanta — Midtown flagship; you still walk the BeltLine",
    "One named Midtown or Westside dinner — then a meat-and-three":
      "Staplehouse or Bacchanalia — one Westside dinner — then Mary Mac’s",
    "A Buckhead steakhouse is a second fare from the trail":
      "Bones or a Buckhead steakhouse is a second fare from the BeltLine",
    "Aquarium plus a Fox Theatre tour only if you already priced both":
      "Georgia Aquarium and a Fox Theatre tour on different mornings — pick one if the nights are short",
    "Metro-line lodging in the 10th–11th. Palace hotels only if you already priced them.":
      "Metro-line lodging in the 10th–11th. Crillon or Bristol only when the palace is the point.",
    "Left Bank mid if you already priced it":
      "Left Bank mid — Hôtel Malte or an Odéon 3-star",
    "Palace-hotel dining only if you already priced it":
      "Le Clarence at Hôtel de Crillon or Epicure at Le Bristol — palace dining is its own line",
    "Skip anything on the tower, the hill, or the museum steps even on Splurge":
      "Skip an Eiffel restaurant, a Montmartre terrace menu, and a Louvre-steps formule even on Splurge",
    "Fromagerie plus wine as a valid dinner":
      "A fromagerie on Rue du Faubourg-Saint-Denis plus a bottle — a valid dinner",
    "A cemetery, a smaller room, or Versailles if you already priced it":
      "Père Lachaise, Musée Rodin, or Versailles",
    "Premier Inn or Travelodge on Budget. The Hoxton if you want restaurants on the block. Mayfair if you already priced it.":
      "Premier Inn or Travelodge on Budget. The Hoxton if you want restaurants on the block. Claridge’s or The Connaught if Mayfair is the point.",
    "West End day seats if you already priced one show":
      "TodayTix or a box-office day seat for one West End show",
    "Open-jaw with Paris if you already priced the Atlantic":
      "Eurostar to Paris only if the open-jaw is already the ticket",
    "One reserved West End dinner — then Tesco the next morning":
      "Dishoom or The Ivy — one reserved dinner — then a Tesco meal deal",
    "£8 pints are already in the luxury math":
      "A pint at The Connaught or Sketch is already in the Mayfair math",
    "Zone 2 Indian or Turkish dinner — not a West End prix fixe every night":
      "Dishoom Shoreditch or a Dalston Turkish grill — not a West End prix fixe every night",
    "One after-theatre sit-down if that is the night":
      "Barrafina after the show — one night, not a prix fixe every evening",
    "One reserved orchestra seat — not three shows":
      "A reserved seat at the National Theatre or a West End house — not three shows",
    "A named trattoria you booked — budget coperto as a line":
      "Da Enzo al 29 or Flavio al Velavevodetto — budget the coperto as a line",
    "La Pergola only if you already priced it":
      "La Pergola at the Rome Cavalieri — one tasting menu, not a nightly habit",
    "Bread you did not order can be a line too — ask":
      "Coperto and pane at Da Enzo — ask before the basket lands",
    "A quieter Prati morning instead of a third ticketed ceiling":
      "A Prati morning along the Vatican walls — not a third ticketed ceiling",
    "Onigiri and coffee. Conveyor sushi and ramen at lunch. Book one sushi counter if you already priced it — before you land.":
      "Onigiri and coffee. Conveyor sushi and ramen at lunch. Sushi Saito or a Ginza counter only if you booked it before you land.",
    "A quiet ward — or Kamakura if you already priced it":
      "Yanaka or Shimokitazawa — Kamakura only as a half-day",
    "Book one sushi counter before you land if that is the treat":
      "Sushi Saito or a Toyosu outer-market counter — book before you land if that is the treat",
    "The room or the sushi counter — rarely both":
      "Park Hyatt Tokyo or a booked Ginza counter — the room or the sushi, rarely both",
    "One izakaya in the ward you booked":
      "Golden Gai or Omoide Yokocho — one izakaya in the ward you booked",
    "The ward you booked on foot — Shinjuku or Shibuya night walk":
      "Shinjuku or Shibuya on foot at night — the ward you booked",
    "teamLab timed entry if that is the indoor":
      "teamLab Planets timed entry — if that is the indoor ticket",
    "A rental is optional unless this is a ruin week you already priced":
      "A rental is for a Chichén Itzá day, not for the Hotel Zone beach",
    "The resort is the lodging and the transit. Skip a rental unless this is a ruin week you already priced; one pre-booked transfer is the week.":
      "The resort is the lodging and the transit. Skip a rental unless Chichén Itzá is the day; one pre-booked transfer is the week.",
    "Chichén Itzá only with a trusted tour if you already priced the long day":
      "Chichén Itzá with a pre-booked hotel or ADO tour — a long day, not a beach morning",
    "A named chef night on-property — not a timeshare-day “free” lunch":
      "Le Blanc or Hyatt Ziva’s specialty restaurant — one night — not a timeshare-desk lunch",
    "One downtown taco dinner only if the transfer is cheap":
      "A Parque de las Palapas taco run only if the taxi is cheap",
    "Stay on-property the other nights — you already paid for the food":
      "The Riu or Hyatt Ziva buffet the other nights — you already paid for the food",
    "Beach days are the week — sit still":
      "The Hotel Zone beach in front of the resort — sit still",
    "One hotel dinner if the view is the point — then grocery breakfast":
      "La Mer at Halekulani or House Without a Key — one view dinner — then grocery breakfast",
    "Do not eat resort breakfast every morning even on Splurge":
      "Skip the Halekulani or Royal Hawaiian breakfast buffet even on Splurge",
    "One reserved dinner; plate lunch the other days":
      "Helena’s or Highway Inn one night; Rainbow Drive-In the other days",
    "The sand in front of the midrise — you do not need a car for this day":
      "Kuhio Beach in front of the midrise — you do not need a car for this day",
    "More beach. A boat only if you already priced it":
      "Keawakapu or Kaanapali sand — a Molokini boat only if that is the booked day",
    "Molokini only if you already priced the boat — not a default":
      "Pride of Maui or Kai Kanani to Molokini — one boat, not a default",
    "The beach in front of the condo — you already paid for this sand":
      "Keawakapu or Kaanapali sand in front of the condo — you already paid for this beach",
    "Cook most nights; one casual plate out":
      "Cook most nights; one plate at Kihei Caffe or Paia Fish Market",
    "Resort breakfast buffets are a second lodging charge — skip the habit":
      "Skip the Westin or Sheraton Maui breakfast buffet — it is a second lodging charge",
    "Wailea resort restaurants after you already paid for the room":
      "Spago at Four Seasons Maui after you already paid for the room",
    "The dining room is already in the fare. Main dining most nights. One specialty night only if you already priced it.":
      "The dining room is already in the fare. Main dining most nights. Chops Grille or Cagney’s once, at about $45 a person.",
    "One specialty night only if you already priced it":
      "Chops Grille or Cagney’s — one specialty night at about $45 a person",
    "A spa menu or a second excursion only if you already priced both":
      "A Carnival or Royal thermal suite, or a second port excursion — each is its own line",
    "Sea days on deck — that is the product you bought":
      "Lido deck on sea days — that is the product you bought",
    "Cuban Coffee Queen or a ventanita. El Siboney or Garbo’s at night. Blue Heaven early if you already priced the wait.":
      "Cuban Coffee Queen or a ventanita. El Siboney or Garbo’s at night. Blue Heaven at opening if you want that courtyard.",
    "Sunset from the sidewalk. Fort Zach for the swim. Dry Tortugas is a full ferry day — only if you already priced it.":
      "Sunset from the Mallory sidewalk. Fort Zach for the swim. The Dry Tortugas ferry is a full day of its own.",
    "Blue Heaven early if you already priced the wait":
      "Blue Heaven at opening if you want that courtyard — otherwise El Siboney",
    "One named dinner you came for — then a ventanita the next morning":
      "Louie’s Backyard or Latitudes at Sunset Key — one dinner — then Cuban Coffee Queen",
    "Splurge if you already priced the beach":
      "Casa Marina if the beach-end room is the treat",
    "El Siboney or Garbo’s, or Blue Heaven if you already priced the wait":
      "El Siboney or Garbo’s, or Blue Heaven at opening",
    "A sunset sail or a seaplane — pick one, not both plus Tortugas":
      "A Sebago sunset sail or Key West Seaplane — pick one, not both plus the Tortugas ferry",
    "Parasail is optional; Fantasy Fest is a different budget":
      "Sunset Watersports parasail is optional; Fantasy Fest is a different budget",
    "Sunset from the sidewalk — the sun does the same work as a paid pier":
      "Mallory Square sidewalk at sunset — the sun does the same work as a paid pier ticket",
    "A boutique a block off Duval — parking is a line; most people should not rent":
      "The Banyan Resort a block off Duval — parking is a line; most people should not rent",
    "Hotel restaurants in LA are airport-priced — skip them even on Splurge":
      "Skip the Casa del Mar and 1 Hotel dining rooms even on Splurge — they are airport-priced",
    "A nightclub table is Splurge, not mid":
      "A table at Omnia or XS is Splurge, not mid",
    "A souvenir cable-car ticket once, then a bus to the same hill":
      "A Powell-Hyde cable-car souvenir ticket once, then a bus up the same hill",
    "A river-cruise brunch is a ticket, not a daily habit":
      "A Wendella architecture cruise is a ticket, not a daily brunch",
    "One old-school dinner, not a tourist-menu courtyard every night":
      "Galatoire’s Friday lunch is the old-school meal; a Bourbon courtyard menu is not",
    "On-property buffet — that is the product you bought":
      "The Riu or Hyatt Ziva buffet — that is the product you bought",
    "Skip the timeshare-day “free” excursion — a half-day you lose":
      "Skip the Moon Palace or Palace timeshare desk — a half-day you lose",
    "À-la-carte drinks until you run the break-even":
      "Bar drinks à la carte until you run the Carnival or Royal package break-even",
    "One ship excursion plus one independent walk — not three dock tours":
      "One ship excursion plus a walk in Nassau or Cozumel — not three pier-kiosk tours",
    "Broadway orchestra is the treat; do not also stack three observatories":
      "A seat at the Gershwin or the Majestic — not Summit, Edge, and Top of the Rock",
    "Key lime pie once; happy-hour conch fritters are a snack":
      "Kermit’s key lime once; happy-hour fritters at Schooner Wharf are a snack",
    "Old Town guesthouse + Cuban breakfast + one named dinner":
      "Old Town guesthouse + Cuban breakfast + El Siboney or Louie’s"
  };

  var ZONES = {
    disney: { "I-Drive trap": { name: "International Drive", note: "Off-property savings that buy park parking, gas, and a 40-minute gate commute" } },
    anaheim: { "Westside trap": { name: "Santa Monica base", note: "A Westside hotel plus a 90-minute transfer each way" } },
    los_angeles: { "near-LAX trap": { name: "Near LAX", note: "Cheap until the shuttle and the empty evening — you rented a layover, not a trip" } },
    nyc: { "Times Square trap": { name: "Times Square", note: "Neon and a resort-style fee for a room you leave by 9 a.m." } },
    vegas: { "Airport / convention trap": { name: "Airport / convention week", note: "Saturday and trade-show weeks are a different hotel" } },
    miami: { "Ocean Drive trap": { name: "Ocean Drive", note: "Postcard address and tourist menus — the same sand as Collins" } },
    san_francisco: { "Union Square trap": { name: "Union Square", note: "A tourist hotel for the same Muni ride as the Mission or the Embarcadero" } },
    chicago: { "Suburban / O’Hare trap": { name: "Suburban / O’Hare", note: "A cheap rate, then parking and a downtown commute" } },
    nola: { "Quarter balcony trap": { name: "Quarter balcony", note: "You paid for a photo, not the plate" } },
    philadelphia: { "PHL airport trap": { name: "PHL airport", note: "A cheap room and Regional Rail every morning" } },
    atlanta: { "ATL-adjacent trap": { name: "ATL-adjacent", note: "A cheap room and an Uber downtown twice a day" } },
    paris: { "Tower-view trap": { name: "Tower-view block", note: "A tourist menu with a view surcharge" } },
    london: { "Heathrow hotel trap": { name: "Heathrow hotel", note: "Fine the night you land; a sad week if you stay" } },
    rome: { "Navona-menu trap": { name: "Navona menus", note: "Carbonara priced for the piazza" } },
    tokyo: { "Narita hotel trap": { name: "Narita hotel", note: "A crash pad the night you land — not a Tokyo week" } },
    cancun: { "Timeshare / dock trap": { name: "Timeshare desk", note: "A free morning plus a van you did not budget" } },
    oahu: { "Unused-rental trap": { name: "Unused rental", note: "A car parked in Waikiki for $40–55 a night" } },
    maui: { "Coast-hop trap": { name: "Coast-hop", note: "A second hotel for one dinner" } },
    key_west: { "Stock Island trap": { name: "Stock Island", note: "A cheap room plus a nightly cab is not Budget" } }
  };

  var DAYS = {
    atlanta: {
      2: {
        title: "Inman Park to Krog, then stop",
        bullets: [
          "Eastside Trail from Ponce City Market through Inman Park to Krog Street Market",
          "Fox Bros. Bar-B-Q or Mary Mac’s — one plate, not Bones in Buckhead",
          "A Fox Theatre tour only if the Georgia Aquarium morning is already behind you"
        ]
      }
    },
    miami: {
      2: {
        title: "South Pointe, Wynwood, or the Everglades",
        bullets: [
          "South Pointe or Lummus in the morning — the sand you already booked",
          "Wynwood Walls from the sidewalk, or an Everglades airboat if you accept the humidity",
          "A Nikki Beach bottle minimum is not this day"
        ]
      }
    },
    key_west: {
      1: {
        title: "El Siboney or Louie’s Backyard",
        bullets: [
          "El Siboney, Garbo’s, or Louie’s Backyard — one dinner",
          "Kermit’s key lime once",
          "Happy-hour fritters at Schooner Wharf are a snack"
        ]
      },
      2: {
        title: "Whitehead, Fort Zach, or the Tortugas ferry",
        bullets: [
          "Whitehead Street and the Hemingway Home, or Fort Zach for the swim",
          "The Dry Tortugas ferry only if that is the whole day",
          "A Sebago sunset sail and a seaplane do not both fit"
        ]
      }
    },
    cancun: {
      2: {
        title: "Hotel Zone sand, or Chichén Itzá as the whole day",
        bullets: [
          "The beach in front of the resort, or the R-1 bus to a different Hotel Zone stretch",
          "Chichén Itzá only as a pre-booked full-day tour",
          "The Isla Mujeres ferry does not also fit"
        ]
      }
    },
    maui: {
      2: {
        title: "The same coast, unless the boat is booked",
        bullets: [
          "Keawakapu or Kaanapali — the sand in front of the bed",
          "Pride of Maui or Kai Kanani only if Molokini is the booked day",
          "Do not hotel-hop Kihei to Wailea for one dinner"
        ]
      }
    }
  };

  var VOICE = {
    disney: {
      startHere: "Book Pop Century or Art of Animation, or a Moderate on the Skyliner. Grocery breakfast the night you land. One park per ticket day — Hopper only if you switch after lunch.",
      tipsKicker: "Grid first, tickets second",
      cta: "Build the Disney Trip Plan on the Skyliner or bus grid — then add Hopper or Multi Pass only if the math still works.",
      tips: [
        "Skip Hopper on four nights or fewer unless you switch parks after lunch. The Hopper add-on in the calculator runs about $65–105 per ticket.",
        "Lightning Lane Multi Pass is about $16–32 a person per day. It can earn its keep on Magic Kingdom or Hollywood Studios in peak weeks, and it is a skip in late January and mid-September.",
        "Grocery breakfast plus a food court beats the dining plan. Typical dining in the calculator is about $215 for a party of four; a heavy signature day runs about $320.",
        "Driving to the gate adds about $35 a day in park parking. On-property bus and Skyliner guests do not pay that line.",
        "Florida lodging tax is about 12.5% on the room (All-Star resorts in Osceola County are 13.5%), and ticket sales tax is 6.5% on top. Run Trip Plan before you lock."
      ],
      money: money(
        "about $280–450/night before tax (Moderate: Caribbean Beach or Port Orleans). Value sits nearer $150–310 in the 2026 resort table; peak Deluxe is a different band.",
        "about $55–85 with grocery breakfast, a food-court lunch, and one table-service. The calculator’s party-of-four dining line runs about $130 light to $320 heavy.",
        "1-day 1-park about $119–209 (Animal Kingdom off-peak to Magic Kingdom peak). Hopper and Lightning Lane Multi Pass are separate.",
        "4 nights Moderate ≈ $1,550–2,500 lodging + food for 2 before tax, tickets, and flights (orientation)."
      )
    },
    anaheim: {
      startHere: "Sleep at Candy Cane Inn or another Harbor Blvd walk. Albertsons or Target the night you land. One park a day, and leave Universal Studios in Los Angeles.",
      tipsKicker: "Harbor first, Hopper later",
      cta: "Build the Anaheim Trip Plan from a Harbor Blvd bed — then add Lightning Lane only on the Disneyland park day.",
      tips: [
        "Price the SNA ride against a cheaper LAX fare. The closer airport often wins once the ground transfer is on the card.",
        "Anaheim lodging tax in Trip Plan is about 17%. A Harbor Blvd rate is not the bill.",
        "ART is the shuttle if the hotel is off the walk. A rental parked at the hotel is a fee for a car that never goes to the gate.",
        "Lightning Lane on the Disneyland park day only. California Adventure is a second decision, not an automatic tap.",
        "Sales tax sits on the ticket. Carthay Circle is a reservation, not a dining plan."
      ],
      money: money(
        "about $250–360/night before tax (Harbor Blvd 3-star or Pixar Place). Trip Finder 2026 shoulder mid for Anaheim is about $250–320; peak weeks run higher.",
        "about $55–90 with grocery breakfast and mobile-order lunch (Trip Plan food band for Anaheim).",
        "1-day 1-park is date-tiered; the theme-park table uses about $130 mid-season. Hopper is separate.",
        "3 nights Mid-range ≈ $1,100–1,600 lodging + food for 2 before tax, tickets, and flights (orientation)."
      )
    },
    los_angeles: {
      startHere: "Lock Downtown, Koreatown, or Santa Monica. TAP plus a Porto’s-class breakfast. Getty free, or one Universal day — not both, and not with Disneyland.",
      tipsKicker: "One zip code, one ticketed day",
      cta: "Build the LA Trip Plan with these hotel and food names — then cut until the total fits.",
      tips: [
        "Price BUR or SNA ground transfer against LAX — the cheaper fare often loses after the ride.",
        "A TAP day fare before a rideshare loop. Getty parking is cheaper than a $40 drop-off.",
        "Hotel parking is $40–60 a night — only if Getty, a canyon, or a beach-hop is already on the calendar.",
        "LA lodging tax in Trip Plan is about 15.5%. A Friday LAX landing eats the first evening; midweek arrival does not.",
        "Universal Studios Hollywood gate is about $159; advance tickets in the theme-park table start near $100. Express is Splurge. Default is that one ticket, or free Getty plus Griffith."
      ],
      money: money(
        "about $270–380/night before tax (Downtown, Koreatown, or Santa Monica). Trip Finder 2026 shoulder mid is about $270–340; peak weeks run toward $430.",
        "about $50–80 if you eat in the neighborhood (bakery, a market, one dinner). Trip Finder dailyGround is higher because it also bundles transit and tickets.",
        "Universal Studios Hollywood about $100–160 (advance to gate). Getty Center entry is free with a reservation; parking or the bus is the cost.",
        "3 nights Mid-range ≈ $1,100–1,600 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    nyc: {
      startHere: "Sleep on a train you will actually ride — the Lower East Side, downtown, or a Brooklyn stop — and spend the ticket money on the Met, MoMA, or one Broadway seat.",
      tipsKicker: "The borough is the budget",
      cta: "Build the New York Trip Plan from the subway stop you will actually sleep near — then add one museum or one Broadway seat.",
      tips: [
        "OMNY caps a week of taps if you ride twice a day. Count the rides before you buy a 7-day unlimited.",
        "NYC lodging tax in Trip Plan is about 14.75%, and some hotels add a resort-style fee on top of the rate.",
        "The Staten Island Ferry is the free skyline. Pay for the Met, MoMA, or one Broadway seat — not Summit and Edge and Top of the Rock.",
        "A $28 Midtown salad times three lunches is a Broadway lottery you skipped. One dinner in Jackson Heights, Flushing, or Chinatown resets the average.",
        "A Friday hotel in the same neighborhood is a different rate. Midweek arrival is the cheaper version of the same bed."
      ],
      money: money(
        "about $300–450/night before tax (downtown, the Lower East Side, or a Brooklyn train stop). Trip Finder 2026 shoulder mid is about $300–420; holiday weeks run toward $580.",
        "about $55–95 (bodega breakfast and one neighborhood dinner). The Trip Plan food band for New York starts at $55.",
        "The Met or MoMA is the museum ticket; one Broadway seat is the big-ticket line. Rush and lottery beat a full-price orchestra seat. The ferry skyline is free.",
        "3 nights Mid-range ≈ $1,250–1,900 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    vegas: {
      startHere: "Book Tuesday through Thursday at Park MGM, New York-New York, or Circa. Add the resort fee before you compare the rate, and walk the fountains instead of renting a car.",
      tipsKicker: "Resort fee before the rate",
      cta: "Build the Vegas Trip Plan with the resort fee in the room — then add one show, not a steakhouse every night.",
      tips: [
        "Resort fees run about $35–55 a night in the vacation-budget guide. Add three of them before you compare a Tuesday rate with Saturday.",
        "Vegas lodging tax in Trip Plan is about 13.5% on top of the room, and the resort fee is still its own line.",
        "Walk Center-Strip. The Deuce or one rideshare to Fremont beats a rental plus hotel parking.",
        "Write down the drink count before you buy a package. A comped well drink is not dinner at the Park MGM food hall.",
        "One show — Mystère or O. A nightclub table the same night is a second ticket."
      ],
      money: money(
        "about $190–280/night before tax and before the resort fee (Center-Strip or downtown). Trip Finder 2026 shoulder mid is about $190–270.",
        "about $40–75 off the casino carpet (a food hall plus one Chinatown or downtown dinner).",
        "The resort fee is about $35–55 a night. One Cirque or residency is the big-ticket line on top of that.",
        "3 midweek nights ≈ $900–1,450 room + resort fee + food for 2 before shows and tax (orientation)."
      )
    },
    miami: {
      startHere: "Stay a few blocks off Ocean Drive on Collins, eat Versailles or a ventanita, and pick one other neighborhood — Wynwood, Little Havana, or Brickell — not a beach-club minimum.",
      tipsKicker: "Same sand, different menu",
      cta: "Build the Miami Trip Plan a few blocks off Ocean Drive — then add Wynwood or the Everglades, not a cabana minimum.",
      tips: [
        "Miami lodging tax in Trip Plan is about 13%. Collins a few blocks off Ocean Drive is the same sand with a different menu.",
        "Price MIA against FLL with the ground ride included. The cheaper airport loses if the transfer eats the savings.",
        "Brickell Metromover is free. A rental is for the Everglades or a planned Wynwood night, not dinner two blocks away.",
        "Versailles or a ventanita is the breakfast line. An Ocean Drive menu is the same plate with a view surcharge.",
        "A Nikki Beach or 1 Hotel cabana minimum is a day-price. Lummus Park sand is the product you already bought."
      ],
      money: money(
        "about $250–360/night before tax (Collins off Ocean Drive or Brickell). Trip Finder 2026 shoulder mid is about $250–340.",
        "about $45–75 with a ventanita breakfast and one neighborhood dinner, not Ocean Drive.",
        "The sand is free. Vizcaya is the named indoor ticket if you want one; a beach-club minimum is the Splurge line.",
        "3 nights Mid-range ≈ $1,000–1,550 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    san_francisco: {
      startHere: "Sleep at Hotel Emeline or another walk to the Ferry Building, tap Clipper, and book the Alcatraz ferry before you book a second museum.",
      tipsKicker: "Clipper, then one ferry",
      cta: "Build the San Francisco Trip Plan from the Ferry Building or the Mission — then add Alcatraz, not a Wharf seafood rack.",
      tips: [
        "SF lodging tax in Trip Plan is about 16%. A Union Square rate and a Mission rate can share a Muni ride and not share a bill.",
        "Clipper covers Muni, BART, and the ferry. A visitor passport wins on a four-ride day — count tomorrow’s rides tonight.",
        "Alcatraz sells out. The timed ferry is the ticket to book; a cable-car souvenir ride is not your transit plan.",
        "Hotel parking is a line for a Napa day. The Mission, the Ferry Building, and Crissy Field do not need a car.",
        "Tartine or a Ferry Building lunch resets a Wharf seafood rack. State Bird Provisions or Quince is one Splurge dinner, not three."
      ],
      money: money(
        "about $300–380/night before tax (Embarcadero, Jackson Square, or a Mission walk-up). Trip Finder 2026 mid stays in that band most of the year.",
        "about $55–90 with a bakery breakfast, a taqueria or Ferry Building lunch, and one dinner.",
        "The Alcatraz timed ferry is the #1 ticket — book the official slot. Clipper or a visitor passport is the transit line.",
        "3 nights Mid-range ≈ $1,250–1,700 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    chicago: {
      startHere: "Sleep in the Loop or at The Hoxton in Fulton Market so the L is downstairs. One deep-dish at Lou Malnati’s, then one indoor ticket — the Art Institute or a river cruise, not both the same afternoon.",
      tipsKicker: "The L, then one indoor",
      cta: "Build the Chicago Trip Plan from the Loop or Fulton Market — then buy one museum or one river cruise.",
      tips: [
        "Chicago lodging tax in Trip Plan is about 17.4%. A suburban rate still owes a downtown commute.",
        "A Ventra day pass before a rideshare loop. The L from O’Hare is the airport move when the bed is in the Loop.",
        "The Art Institute or a river cruise — one paid indoor. A second museum the same day is a second ticket.",
        "January rooms are the value window. Lollapalooza week and the Fourth of July are a different rate.",
        "Lou Malnati’s once. The Publican is the Fulton Market sit-down; a Magnificent Mile lunch is the expensive walk-through."
      ],
      money: money(
        "about $190–320/night before tax (Loop, River North, or Fulton Market). Trip Finder 2026 shoulder and low mid is about $190–300.",
        "about $45–75 with a diner breakfast, one Italian beef or deep-dish, and a neighborhood dinner.",
        "The Art Institute or an architecture river cruise — pick one. A Ventra day pass is the transit line if you will ride.",
        "3 nights Mid-range ≈ $850–1,400 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    nola: {
      startHere: "Cut the hotel before you cut the table. Warehouse District or the Garden District on the St. Charles line, a Parkway po’boy at lunch, Galatoire’s or Commander’s if that reservation is why you came.",
      tipsKicker: "The reservation is the trip",
      cta: "Build the New Orleans Trip Plan around the reservation — then pick a Warehouse or Garden District bed that does not eat it.",
      tips: [
        "New Orleans lodging tax in Trip Plan is about 16.2%. A Quarter balcony premium does not buy a better Galatoire’s table.",
        "The St. Charles streetcar is the Garden District ride. A rental is for Whitney Plantation or a swamp tour, not Bourbon at night.",
        "Café du Monde once. A neighborhood café the other mornings keeps the beignet from becoming the meal plan.",
        "Jazz Fest or Mardi Gras overlap is a different room rate. If those dates are not why you came, pick another week.",
        "One cover at Preservation Hall or on Frenchmen Street. A haunted-tour stack is a second ticket the same night."
      ],
      money: money(
        "about $200–330/night before tax (Warehouse District or Garden District). Trip Finder 2026 shoulder mid is about $200–310.",
        "about $55–90 with a café breakfast, a po’boy, and one old-school dinner.",
        "Preservation Hall or a Frenchmen Street cover is the paid night. The St. Charles streetcar is the transit line.",
        "3 nights Mid-range ≈ $950–1,550 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    philadelphia: {
      startHere: "Base at The Notary or another City Hall walk. Reading Terminal in the morning, Independence Hall on a timed entry, and one of the Barnes or the Philadelphia Museum — not both.",
      tipsKicker: "Terminal lunch, one museum",
      cta: "Build the Philadelphia Trip Plan from Center City or Old City — then add Reading Terminal and one museum.",
      tips: [
        "Philadelphia lodging tax in Trip Plan is about 15.5%. An airport rate still owes a Regional Rail ride every morning.",
        "SEPTA Key or an Independence Pass if you will ride more than twice. A hop-on bus is a second transit product.",
        "Independence Hall timed entry is free and still the slot that sells out. Book it; the Liberty Bell is the line beside it.",
        "The Barnes or the Philadelphia Museum of Art — one admission. Eastern State Penitentiary is a half-day ticket, not a third interior the same afternoon.",
        "One cheesesteak at Pat’s or Geno’s, then DiNic’s roast pork. Three steaks is a food tour you did not need to buy."
      ],
      money: money(
        "about $200–320/night before tax (Center City or Old City). Trip Finder 2026 shoulder mid is about $200–300; the Trip Plan food-and-hotel baseline for Philadelphia mid is about $230.",
        "about $50–80 (Reading Terminal plus one neighborhood dinner). That matches the Trip Plan food band.",
        "The Barnes or the Philadelphia Museum of Art is the #1 ticket. Independence Hall is timed and free. SEPTA is the transit line.",
        "3 nights Mid-range ≈ $900–1,450 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    atlanta: {
      startHere: "Ride MARTA from ATL to Midtown or Hotel Clermont on Ponce. Mary Mac’s for a meat-and-three. Georgia Aquarium or World of Coca-Cola in the morning — one of them.",
      tipsKicker: "MARTA in, trail after",
      cta: "Build the Atlanta Trip Plan from Midtown or Ponce — then add one ticketed morning, not a Buckhead steakhouse.",
      tips: [
        "Atlanta lodging tax is about 16.9%. A Hampton Midtown rate is not the Uber from a Cumberland hotel.",
        "MARTA from ATL is one fare. Two Ubers a day from an airport hotel is a second room by the end of day two.",
        "Georgia Aquarium and World of Coca-Cola are two tickets. Pick the morning. The BeltLine Eastside does not charge admission.",
        "Convention weeks reprice Downtown. Read the calendar before you treat a Centennial rate as normal.",
        "Fox Bros. Bar-B-Q or Mary Mac’s is the plate. Bones in Buckhead adds a rideshare the trail did not require."
      ],
      money: money(
        "about $180–280/night before tax (Midtown or Ponce). Trip Finder 2026 shoulder mid is about $180–260; the Trip Plan Atlanta mid hotel baseline is about $200.",
        "about $45–75 (café breakfast and a meat-and-three). That matches the Trip Plan food band.",
        "Georgia Aquarium or World of Coca-Cola — one morning ticket. A MARTA day pass is the airport-to-Midtown line.",
        "3 nights Mid-range ≈ $800–1,300 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    paris: {
      startHere: "Sleep on a Metro line in the 10th or 11th, with a bakery on the block. One timed museum — the Louvre or the Orsay — and dinner at Septime, Frenchie, or Le Comptoir when that booking is confirmed.",
      tipsKicker: "One museum, one booking",
      cta: "Build the Paris Trip Plan from a Metro-line hotel — then add one museum and, if you hold it, one reserved dinner.",
      tips: [
        "Trip Finder’s shoulder mid for Paris is about $200–350 a night before you convert to euros. A tower-view block is a surcharge on that band, not a different city.",
        "A Navigo week beats a stack of t+ tickets only if your days qualify. Check the zone rules before you buy the week.",
        "The Louvre or the Orsay — one timed ticket. A Museum Pass wins at two museums, not at one plus an Eiffel summit.",
        "Versailles is an RER half-day with its own ticket. It does not fit beside the Louvre the same afternoon.",
        "Breakfast at Le Bristol or Hôtel de Crillon is its own line. A bakery on the block is the other breakfast."
      ],
      money: money(
        "about €190–330/night (Trip Finder 2026 shoulder mid $200–350, converted at roughly $1 ≈ €0.92 — orientation, not a live rate).",
        "about €30–55 with a bakery breakfast, a formule lunch, and one dinner. Trip Finder dailyGround is higher because it also includes Metro and museums.",
        "Louvre or Musée d’Orsay timed entry is the #1 ticket (a single museum is usually the cheaper path; a Museum Pass wins at two or more). Navigo or a carnet is the transit line.",
        "4 nights Mid-range ≈ €1,000–1,750 lodging + food for 2 before flights (orientation)."
      )
    },
    london: {
      startHere: "Premier Inn or The Hoxton in Zone 1–2, a Tesco meal deal or a bakery, and one free museum — the British Museum or the National Gallery — before you buy the Eye.",
      tipsKicker: "Cap the Tube, skip the paper ticket",
      cta: "Build the London Trip Plan on the contactless cap — then add one free museum or one West End seat, not both landmarks.",
      tips: [
        "Contactless daily cap on the Tube and bus. A Visitor Oyster is a souvenir; a paper Travelcard is rarely the cheaper math.",
        "UK hotel quotes usually include VAT. Compare two rates only after you know both are taxes-in.",
        "The British Museum and the National Gallery are free. The Eye and the Tower on the same day are two tickets the South Bank walk did not require.",
        "A West End day seat or a TodayTix price is the show. A full-price orchestra seat is the Splurge, not the default.",
        "The Elizabeth Line versus Heathrow Express is a fare gap. Price the fast train before you treat an airport hotel as a week."
      ],
      money: money(
        "about £160–270/night (Trip Finder 2026 shoulder mid $210–350, converted at roughly $1 ≈ £0.76 — orientation, not a live rate).",
        "about £25–45 with a bakery or Tesco breakfast and one Zone 2 dinner.",
        "The British Museum is free. The Tower of London or one West End seat is the paid line. The contactless daily cap is the transit spend.",
        "4 nights Mid-range ≈ £850–1,450 lodging + food for 2 before flights (orientation)."
      )
    },
    rome: {
      startHere: "Sleep in Trastevere or a Prati room near Ottaviano. Cornetto standing at the bar. Colosseum and Forum one day, Vatican Museums a different day.",
      tipsKicker: "One ruin, then the table",
      cta: "Build the Rome Trip Plan from Trastevere or Prati — then book one timed ruin, not a golf-cart stack.",
      tips: [
        "Rome’s nightly city fee (imposta di soggiorno) is a few euros per person on top of the room. Coperto at the table is a second small line — ask before the bread lands.",
        "The Colosseum plus the Forum is one timed ticket. The Vatican Museums are a different day and a different ticket.",
        "A 48- or 72-hour Metro pass wins only if you will ride. A centro day is a walk, not a tap.",
        "A golf-cart or an open-bus stack is a ticket for streets you can walk from Trastevere or Prati.",
        "August and holiday weeks reprice the centro. The value months on this guide are the winter and late-autumn bands."
      ],
      money: money(
        "about €170–320/night (Trip Finder 2026 shoulder mid $180–340, converted at roughly $1 ≈ €0.92 — orientation, not a live rate).",
        "about €30–55 with a bar cornetto, a market lunch, and one trattoria. Coperto is extra.",
        "Colosseum plus Forum timed entry is the #1 ticket — book the official slot. A Metro pass is the transit line only if you will ride.",
        "4 nights Mid-range ≈ €900–1,750 lodging + food for 2 before flights (orientation)."
      )
    },
    tokyo: {
      startHere: "An APA, Toyoko Inn, or Mitsui Garden over a JR or Metro line. Konbini breakfast. One ward a day, and a sushi counter only if it was booked before you landed.",
      tipsKicker: "Suica, not a JR Pass",
      cta: "Build the Tokyo Trip Plan from a station hotel — then add Suica taps and one booked counter, not a nationwide rail pass.",
      tips: [
        "A JR Pass on a four- or five-night city trip loses to Suica or PASMO pay-as-you-go unless you are leaving Tokyo on purpose.",
        "Haneda is the closer airport. Narita means a Skyliner or N’EX fare you should add before you celebrate the flight.",
        "A hotel breakfast buffet is the expensive path. Onigiri and coffee from the konbini still works on a Splurge morning.",
        "teamLab is a timed ticket. Sensō-ji at opening is free. Do not buy both and a Kamakura day.",
        "Consumption tax is usually inside the advertised rate. A small accommodation tax is extra — it is not the JR Pass."
      ],
      money: money(
        "about ¥30,000–45,000/night (Trip Finder 2026 shoulder mid $200–290, converted at roughly $1 ≈ ¥150 — orientation, not a live rate).",
        "about ¥2,500–6,000 with konbini breakfast, a ramen or conveyor lunch, and one izakaya.",
        "teamLab or one museum is the ticket. Suica or PASMO pay-as-you-go beats a JR Pass on a city-only week.",
        "4 nights Mid-range ≈ ¥140,000–230,000 lodging + food for 2 before flights (orientation)."
      )
    },
    cancun: {
      startHere: "Confirm the airport van is inside the Hyatt Ziva, Moon Palace, or Riu rate before you compare the week. Eat on property. One outing — Isla Mujeres or a cenote — not both.",
      tipsKicker: "The van, then the beach",
      cta: "Build the Cancún Trip Plan with the airport van inside the rate — then add one outing, not a timeshare morning.",
      tips: [
        "Visitax is about $15 a person at Cancún International. The Hotel Zone environmental fee is about $4 a room per night. Neither one is the buffet.",
        "If the airport van is not in the rate, it is a separate transfer. Price it before you compare two all-inclusives.",
        "Customary tips are cash on top of a prepaid week. Bottled water at the dock kiosk is the other small leak.",
        "The Isla Mujeres ferry or one cenote — one outing. A timeshare-desk morning is a half-day you lose.",
        "Chichén Itzá is a full-day tour price. It does not fit the same day as Isla Mujeres."
      ],
      money: money(
        "about $200–330/night (Hotel Zone all-inclusives are usually quoted in USD). Trip Finder 2026 shoulder mid is about $200–330.",
        "On-property food is in the rate. A Parque de las Palapas taco run is about $15–30 a person if you leave.",
        "Visitax about $15 a person, plus about $4 a room per night for the Hotel Zone environmental fee. The airport van is the other line if it is not in the rate.",
        "5 nights Hotel Zone ≈ $1,000–1,650 for the quoted rate before tips, Visitax, and a van that is missing from the quote. Food is included if you stay on property (orientation)."
      )
    },
    oahu: {
      startHere: "A Kuhio or Outrigger room in Waikiki, Rainbow Drive-In or a grocery run, and one reserved outing — Hanauma Bay or Pearl Harbor, not both.",
      tipsKicker: "TheBus until you leave",
      cta: "Build the Oahu Trip Plan from a Waikiki room one block back — then add TheBus, not a car you will park all week.",
      tips: [
        "Hawaii lodging tax in Trip Plan is about 17.75% on a pre-tax quote. Confirm the rate is taxes-in before you compare Waikiki towers.",
        "Parking a rental in Waikiki is $40–55 a night. TheBus or a HOLO card wins until the day you actually drive to Hanauma or the North Shore.",
        "Resort breakfast is mainland prices plus a view. Rainbow Drive-In or L&L is the plate-lunch line.",
        "Hanauma Bay reservations and Pearl Harbor timed entry are two tickets. Pick one for the week.",
        "A neighbor-island hop is a second airfare. Five Oahu nights do not contain Maui."
      ],
      money: money(
        "about $310–380/night before tax (Waikiki one block back or a Kalakaua walk). Trip Finder 2026 shoulder mid is about $310–360.",
        "about $45–75 with grocery or a plate lunch and one reserved dinner.",
        "Hanauma Bay or Pearl Harbor timed entry — pick one. TheBus or HOLO is the transit line. A parked rental is $40–55 a night.",
        "5 nights Mid-range ≈ $2,000–2,700 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    maui: {
      startHere: "A Kihei condo with a kitchen. Grocery the first hour after OGG. One big outing — Road to Hana, Haleakalā sunrise, or a Molokini boat — and come home to the same coast.",
      tipsKicker: "The kitchen is the budget",
      cta: "Build the Maui Trip Plan from one coast and a kitchen — then add one outing, not Hana plus Haleakalā plus a boat.",
      tips: [
        "Hawaii lodging tax in Trip Plan is about 17.75% on a pre-tax condo or resort quote. A Kihei kitchen still wins after tax.",
        "Resort fees and parking show up on Kaanapali and Wailea. Add both before you compare a condo rate with a resort rate.",
        "Grocery at OGG or the first market. Two cooked nights cut the week more than skipping the one fish dinner.",
        "Haleakalā sunrise is a reservation and a 2 a.m. wake-up. Road to Hana is a different day. Molokini is a third.",
        "Mama’s Fish House or Spago at Four Seasons Maui is one reservation. Driving Kihei to Wailea for that plate is a second lodging decision."
      ],
      money: money(
        "about $420–520/night before tax (Kihei condo or a Kaanapali walk-to-beach). Trip Finder 2026 shoulder mid is about $420–480; winter runs higher.",
        "about $40–75 if the kitchen cooks two nights and you eat out once. Resort breakfast is a second lodging charge.",
        "Haleakalā sunrise reservation or a Molokini boat — pick one. The beach in front of the condo is already paid for.",
        "5 nights Mid-range ≈ $2,500–3,400 lodging + food for 2 before flights and tax (orientation)."
      )
    },
    cruise: {
      startHere: "Price the interior or balcony with gratuities and port fees already on the card. Run the drink-package break-even before you tap yes. One port is a walk, not a pier kiosk.",
      tipsKicker: "Fare, then the lines they left off",
      cta: "Build the cruise Trip Plan with gratuities and the drink-package math in the total — then add one port walk, not three pier tours.",
      tips: [
        "Automatic gratuities run about $16–20 a person per day on mainstream lines, including kids age 2 and up. They are not in the brochure fare.",
        "Port fees on a 7-night Caribbean are about $200 a person in the cruise table. Add them before you compare two from-prices.",
        "Unlimited drink packages run about $54–105 a person per day depending on the line. Pay-as-you-go wins under the break-even — the cruise calculator has the count.",
        "Specialty dining is about $45 a person. One night at Chops Grille or Cagney’s is the treat; every night is a second fare.",
        "A pre-cruise hotel is about $200 in the cruise table if the flight cannot miss the gangway. Missing the ship costs more than the room."
      ],
      money: money(
        "Balcony is the mid cabin: about $500 a person on top of an interior for 7 nights. Interior fares in the cruise table run about $250–650 a person on Carnival through Royal, before port fees.",
        "Main dining is in the fare. Specialty is about $45 a person. Pay-as-you-go drinks until the package breaks even.",
        "Port fees about $200 a person and gratuities about $16–20 a day are the lines the brochure leaves off. A drink package is the optional big ticket.",
        "Two adults, 7-night interior ≈ $1,200–2,000 before drinks, Wi-Fi, and excursions. A balcony adds about $500 a person (orientation)."
      )
    },
    key_west: {
      startHere: "An Old Town walk — Caribbean House, The Gardens, or The Big Ruby. Cuban Coffee Queen in the morning. Sunset from the Mallory sidewalk, not a Mallory menu.",
      tipsKicker: "Walk Old Town, price the ferry",
      cta: "Build the Key West Trip Plan from an Old Town walk — then add the Tortugas ferry only if that day is empty.",
      tips: [
        "Florida lodging tax is about 12.5% on the room. A Stock Island rate still owes a cab both ways.",
        "EYW air is a premium. A drive from Miami is a full day — price it as a day, not as free ground.",
        "Old Town parking is a fee if you drove. Walking Duval does not need the car you parked.",
        "The Dry Tortugas ferry is a full-day ticket. A sunset sail the same evening does not fit.",
        "Mallory Square menus add a surcharge to a sunset you can watch from the sidewalk. Cuban Coffee Queen is the morning line."
      ],
      money: money(
        "about $250–360/night before tax (Old Town guesthouse or The Gardens). Trip Finder 2026 shoulder mid is about $250–330; the Trip Plan Key West mid baseline is about $320.",
        "about $60–100 with a ventanita breakfast and one dinner at El Siboney, Garbo’s, or Louie’s (Trip Plan food band).",
        "The Dry Tortugas ferry is the #1 ticket if you take it. Fort Zachary Taylor is the cheap outdoor ticket. Sunset is free.",
        "3 nights Mid-range ≈ $1,100–1,700 lodging + food for 2 before flights and tax (orientation)."
      )
    }
  };

  pack.ALL.forEach(function (g) {
    walk(g, function (s) {
      return Object.prototype.hasOwnProperty.call(SWAP, s) ? SWAP[s] : s;
    });
    var zoneMap = ZONES[g.id] || {};
    (g.zones || []).forEach(function (z) {
      var spec = zoneMap[z.name];
      if (spec) {
        z.name = spec.name;
        z.note = spec.note;
      } else if (/\btrap\b/i.test(z.name)) {
        z.name = z.name.replace(/\s*trap\b/i, "").replace(/\s{2,}/g, " ").trim();
      }
    });
    var dayPatch = DAYS[g.id];
    if (dayPatch && g.days) {
      Object.keys(dayPatch).forEach(function (idx) {
        var i = parseInt(idx, 10);
        if (!g.days[i]) return;
        if (dayPatch[idx].title) g.days[i].title = dayPatch[idx].title;
        if (dayPatch[idx].bullets) g.days[i].bullets = dayPatch[idx].bullets;
      });
    }
    var voice = VOICE[g.id];
    if (!voice) return;
    g.startHere = voice.startHere;
    g.tipsKicker = voice.tipsKicker;
    g.cta = voice.cta;
    g.tips = voice.tips;
    g.money = voice.money;
  });
})(typeof window !== "undefined" ? window : this);
