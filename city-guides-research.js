/* Research notes for the 20 money guides.
   Orientation only — not a field visit, not live quotes.
   Public inputs already in this repo:
     trip-finder-data.js monthly hotel bands + dailyGround
     plan-data.js LODGING_TAX_BY_ID / regional tax assumptions / CITY_BASE food
     calc-data.js DISNEY + CRUISE + theme-park ticket table
     allinclusive.html Visitax (~$15) and Hotel Zone environmental fee (~$4/room/night)
     guides/how-much-to-budget-for-vacation.html Vegas resort fee $35–55
     blog/disney-fall-room-promo-math-2026.html Florida 12.5% vs Osceola 13.5%
   FX lines (Paris, London, Rome, Tokyo) convert Trip Finder USD shoulder mids
   at rough planning rates ($1 ≈ €0.92, £0.76, ¥150). They are not a live FX feed.
   Page copy must keep the honesty footer: compiled from public rates, official
   calendars, and transit maps — orientation, not a field visit.
*/
(function (global) {
  "use strict";

  global.VM_CITY_GUIDE_RESEARCH = {
    disney: {
      sources: ["calc-data.js DISNEY", "plan-data.js disney 12.5%", "blog disney-fall-room-promo Osceola 13.5%"],
      room: "Moderate low/avg/high $280/$350/$550 before tax. Value $150–307. Page band $280–450.",
      food: "Party-of-4 dining light $130, typical $215, heavy $320. Per person with groceries about $55–85.",
      ticket: "1-day 1-park $119–209. Hopper add-on about $65–105 (table uses $89). Multi Pass actuals $16–32; table uses $27.",
      tax: "Say Florida lodging tax ~12.5% and ticket sales tax 6.5%. All-Star resorts in Osceola County are 13.5%. Do not write Orange County on this page — readers hear Anaheim.",
      facts: [
        "Skyliner from Pop, Art of Animation, Caribbean Beach, and Riviera reaches Hollywood Studios and Epcot, not Magic Kingdom.",
        "Off-property park parking is $35/day in the Disney table; resort guests are not charged that line.",
        "Magical Express is gone. Mears or rideshare for a family of 4 is about $130 round trip in the calculator.",
        "Memory Maker advance price in the table is $185."
      ],
      gem: "If the park days are Hollywood Studios and Epcot, pay for a Skyliner resort, not a monorail Deluxe. Magic Kingdom from Pop or Caribbean Beach is still a bus."
    },
    anaheim: {
      sources: ["plan-data.js anaheim tax 17% and CITY_BASE", "trip-finder-data.js anaheim", "calc-data.js disneyland ticket ~$130"],
      room: "Trip Finder shoulder mid about $250–320; full-year mid up to about $440. Page band $250–360 before 17% tax.",
      food: "CITY_BASE food budget $55 / mid $90.",
      ticket: "Theme-park table uses about $130 mid-season for a 1-day. Hopper is separate. This is not a Florida 12.5% lodging bill and not MCO.",
      tax: "Anaheim combined lodging tax in Trip Plan is 17%. Ticket sales tax is California, not Florida 6.5%.",
      facts: [
        "SNA is the close airport. A cheap LAX fare still owes the ground ride.",
        "Downtown Disney can be a dinner without a park ticket.",
        "Universal Studios Hollywood is a Los Angeles ticket with its own parking, not a Harbor Blvd evening."
      ],
      gem: "Eat in Downtown Disney without buying a park ticket, and do not buy a dining plan to 'unlock' dinner."
    },
    los_angeles: {
      sources: ["plan-data.js los_angeles tax 15.45%", "trip-finder-data.js los_angeles", "calc-data.js universal_hollywood"],
      room: "Shoulder mid about $270–340; peak mid toward $430. Page band $270–380 before tax.",
      food: "Neighborhood eating about $50–80. Trip Finder dailyGround ($100–180) also includes transit and tickets, so it is not the food line.",
      ticket: "Universal Hollywood gate about $159; advance from about $101 in the theme-park note. Getty entry is free with a reservation.",
      tax: "Los Angeles lodging tax in Trip Plan is 15.45%. Hotel parking $40–60/night is already in the guide.",
      facts: [
        "Getty Center admission is free; the cost is parking or the bus, not a gate.",
        "BUR or SNA ground transfer can erase a cheap LAX fare.",
        "The E Line reaches Santa Monica. Disneyland lodging is Anaheim, not a Santa Monica day."
      ],
      gem: "Reserve the Getty (free). A $40 rideshare each way costs more than parking."
    },
    nyc: {
      sources: ["plan-data.js NYC_LODGING_TAX 14.75%", "trip-finder-data.js nyc", "CITY_BASE nyc food $55/$90/$140"],
      room: "Shoulder mid about $300–420; peak toward $580. Page band $300–450 before tax. CITY_BASE mid hotel $290 is the low end of that band.",
      food: "CITY_BASE food $55–90. A $28 Midtown salad is the contrast already in the hook.",
      ticket: "One museum or one Broadway seat is the paid line. The Staten Island Ferry is the free skyline.",
      tax: "NYC combined lodging tax in Trip Plan is 14.75%, before any hotel 'resort' fee.",
      facts: [
        "OMNY caps taps; a separate unlimited card is not automatic.",
        "The 7 train reaches Jackson Heights and Flushing on one fare.",
        "Times Square is a walk-through, not a hotel strategy."
      ],
      gem: "One 7-train dinner in Jackson Heights or Flushing costs less than three $28 Midtown salads."
    },
    vegas: {
      sources: ["plan-data.js vegas tax 13.5%", "trip-finder-data.js vegas", "how-much-to-budget-for-vacation.html resort fee $35–55"],
      room: "Shoulder mid about $190–270 before tax and before the resort fee. Page band $190–280.",
      food: "Off-carpet food hall or Chinatown about $40–75. dailyGround mid $160 includes shows.",
      ticket: "Resort fee about $35–55/night is the nightly add. One Cirque or residency is the big ticket.",
      tax: "Lodging tax 13.5% sits on the room. The resort fee is a separate line, not the tax.",
      facts: [
        "Bellagio fountains and the conservatory do not charge admission.",
        "Center-Strip (Park MGM, NYNY, Horseshoe) is a walk. Fremont is one rideshare, not a rental.",
        "Saturday and convention weeks are a different rate than Tuesday–Thursday."
      ],
      gem: "The fountains are free. Pay for one show, not a second hotel closer to the water."
    },
    miami: {
      sources: ["plan-data.js miami tax 13%", "trip-finder-data.js miami"],
      room: "Shoulder mid about $250–340. Page band $250–360 before tax.",
      food: "Ventanita or Versailles plus one neighborhood dinner about $45–75.",
      ticket: "The sand is free. A beach-club minimum is the Splurge line. Vizcaya is the named indoor if you want one.",
      tax: "Miami lodging tax in Trip Plan is 13%.",
      facts: [
        "Brickell Metromover does not charge a fare.",
        "MIA vs FLL is a ground-transfer comparison, not just an airfare.",
        "Ocean Drive and Collins a few blocks inland share the sand and not the menu."
      ],
      gem: "The Metromover is free. A South Beach resort rate is what you pay to avoid one beach rideshare from Brickell."
    },
    san_francisco: {
      sources: ["plan-data.js san_francisco tax 16%", "trip-finder-data.js san_francisco"],
      room: "Mid band stays about $300–380 most of the year. Page uses that.",
      food: "Bakery, taqueria or Ferry Building, one dinner about $55–90. dailyGround mid $200 includes transit and tickets.",
      ticket: "Alcatraz timed ferry is the ticket that sells out. Cable-car souvenir fare is not the transit plan.",
      tax: "San Francisco lodging tax in Trip Plan is 16%.",
      facts: [
        "Clipper covers Muni, BART, and ferries. A visitor passport wins on a four-ride day.",
        "A cable car is a souvenir fare; Muni buses climb the same hills on Clipper.",
        "Alcatraz is an official timed ferry, not a Fisherman’s Wharf ticket booth."
      ],
      gem: "Pay Clipper for the Muni bus up Nob Hill. Buy the cable car once, as a ride, not as your transit pass."
    },
    chicago: {
      sources: ["plan-data.js chicago tax 17.37%", "trip-finder-data.js chicago"],
      room: "Shoulder/low mid about $190–300. Page band $190–320 before tax.",
      food: "Diner breakfast, one deep-dish, one neighborhood dinner about $45–75.",
      ticket: "Art Institute or one architecture cruise — one paid indoor. Riverwalk and the sidewalk are free.",
      tax: "Chicago lodging tax in Trip Plan is about 17.4%.",
      facts: [
        "The Blue Line from O’Hare and the Orange Line from Midway are Ventra fares, not surge rideshares.",
        "January is the room-rate window. Lollapalooza week and the Fourth of July are not.",
        "A suburban rate still owes a downtown commute."
      ],
      gem: "The Blue Line from O’Hare is a Ventra fare. A Friday-night rideshare to the Loop can cost as much as the room you saved."
    },
    nola: {
      sources: ["plan-data.js nola tax 16.2%", "trip-finder-data.js nola"],
      room: "Shoulder mid about $200–310. Page band $200–330 before tax.",
      food: "Café breakfast, a po’boy, one old-school dinner about $55–90. The reservation is the trip.",
      ticket: "Preservation Hall or a Frenchmen cover is the paid night. The St. Charles streetcar is the transit line.",
      tax: "New Orleans lodging tax in Trip Plan is 16.2%.",
      facts: [
        "A French Quarter balcony is a room premium, not a better Galatoire’s or Commander’s table.",
        "The St. Charles streetcar is the Garden District ride.",
        "Jazz Fest or Mardi Gras dates reprice the room. A rental is for a plantation or swamp day."
      ],
      gem: "Ride the St. Charles streetcar for the Garden District. The Quarter photo is available from the Royal Street sidewalk."
    },
    philadelphia: {
      sources: ["plan-data.js philadelphia tax 15.5% and CITY_BASE", "trip-finder-data.js philadelphia"],
      room: "Shoulder mid about $200–300. CITY_BASE mid hotel $230. Page band $200–320 before tax.",
      food: "CITY_BASE food $50–80. Reading Terminal plus one dinner, not three cheesesteaks.",
      ticket: "Independence Hall is timed and free. The Barnes or the Philadelphia Museum of Art is the paid museum.",
      tax: "Philadelphia lodging tax in Trip Plan is 15.5%.",
      facts: [
        "An airport hotel still owes Regional Rail every morning.",
        "SEPTA Key or an Independence Pass beats a hop-on bus if you will ride.",
        "DiNic’s roast pork is the local contrast to a single Pat’s or Geno’s cheesesteak."
      ],
      gem: "Book the free Independence Hall slot before you buy the Barnes. The Hall still sells out."
    },
    atlanta: {
      sources: ["plan-data.js atlanta tax 16.9% and CITY_BASE", "trip-finder-data.js atlanta"],
      room: "Shoulder mid about $180–260. CITY_BASE mid hotel $200. Page band $180–280 before tax.",
      food: "CITY_BASE food $45–75. Meat-and-three at Mary Mac’s is the Budget classic already in the guide.",
      ticket: "Georgia Aquarium or World of Coca-Cola, one morning. BeltLine Eastside has no admission.",
      tax: "Atlanta lodging tax in Trip Plan is 16.9%.",
      facts: [
        "MARTA from ATL reaches Midtown without a rental.",
        "The Eastside Trail links Ponce City Market, Inman Park, and Krog Street Market.",
        "Convention weeks reprice Downtown. A Cumberland rate buys Ubers."
      ],
      gem: "MARTA from the airport is one fare. The BeltLine from Ponce City Market to Krog does not charge admission."
    },
    paris: {
      sources: ["trip-finder-data.js paris shoulder mid $200–350", "plan-data.js Europe tax assumption 10% — do not print as the official Paris rate"],
      room: "About €190–330 after a rough $1 ≈ €0.92 conversion of the USD shoulder mid. Not a live rate.",
      food: "Bakery, formule, one dinner about €30–55. dailyGround mid $180 includes Metro and museums.",
      ticket: "One timed Louvre or Orsay. A Museum Pass wins at two or more, not at one museum plus a tower summit.",
      tax: "Paris hotel quotes often include TVA. Do not label Trip Plan’s 10% Europe assumption as the statutory rate.",
      facts: [
        "The Eiffel Tower from Trocadéro or Champ de Mars is free. Summit tickets and step restaurants are not.",
        "Navigo week passes have day-of-week rules; a carnet is the fallback.",
        "Versailles is an RER half-day with its own ticket."
      ],
      gem: "See the tower from Trocadéro for free. Buy a Museum Pass only if you will enter two museums."
    },
    london: {
      sources: ["trip-finder-data.js london shoulder mid $210–350", "Existing guide: contactless cap, free museums"],
      room: "About £160–270 after a rough $1 ≈ £0.76 conversion. UK quotes usually include VAT.",
      food: "Bakery or Tesco plus one Zone 2 dinner about £25–45.",
      ticket: "British Museum and National Gallery are free. The Tower or one West End seat is the paid line. Contactless daily cap is the transit spend.",
      tax: "Do not add a second VAT on top of a taxes-in UK rate. Trip Plan’s 10% Europe assumption is not a London VAT quote.",
      facts: [
        "Contactless capping beats a Visitor Oyster and most paper Travelcards.",
        "Heathrow Express and the Elizabeth Line are different fares for the same airport.",
        "An airport hotel is a landing night, not a week in Zone 1–2."
      ],
      gem: "Price the Elizabeth Line against Heathrow Express before you keep a Heathrow hotel for the whole trip."
    },
    rome: {
      sources: ["trip-finder-data.js rome shoulder mid $180–340", "Existing guide: coperto, Colosseum/Forum vs Vatican"],
      room: "About €170–320 after a rough $1 ≈ €0.92 conversion.",
      food: "Bar cornetto, market lunch, one trattoria about €30–55, plus coperto.",
      ticket: "Colosseum plus Forum is one timed ticket. Vatican Museums are a different day and a different ticket.",
      tax: "Imposta di soggiorno is a few euros per person per night and varies by hotel class. Do not invent a single euro amount. Coperto is separate.",
      facts: [
        "Standing at the bar for coffee is the breakfast price; a piazza table is the surcharge.",
        "A 48- or 72-hour Metro pass only wins if you ride. The centro day is a walk.",
        "A golf-cart tour sells streets you can walk from Trastevere or Prati."
      ],
      gem: "Take the cornetto at the bar. The Navona table is the markup, and coperto shows up again at dinner."
    },
    tokyo: {
      sources: ["trip-finder-data.js tokyo shoulder mid $200–290", "Existing guide: Suica/PASMO, JR Pass, Skyliner/N’EX"],
      room: "About ¥30,000–45,000 after a rough $1 ≈ ¥150 conversion.",
      food: "Konbini, ramen or conveyor sushi, one izakaya about ¥2,500–6,000.",
      ticket: "teamLab or one museum is the timed ticket. A JR Pass is usually a loss on a city-only week.",
      tax: "Consumption tax is usually inside the advertised rate. A small accommodation tax is extra. Do not call the JR Pass a tax.",
      facts: [
        "Haneda is the closer airport. Narita adds a Skyliner or N’EX fare.",
        "Sensō-ji at opening is free. teamLab is timed and paid.",
        "Station business hotels (APA, Toyoko Inn, Mitsui Garden) are the lodging product."
      ],
      gem: "Buy Suica or PASMO for Tokyo. A JR Pass on a city-only week is a national ticket you will not ride."
    },
    cancun: {
      sources: ["trip-finder-data.js cancun", "allinclusive.html Visitax ~$15 and Hotel Zone fee ~$4"],
      room: "Shoulder/low mid about $200–330 USD. Hotel Zone all-inclusives are usually quoted in dollars.",
      food: "On-property food is in the rate. A downtown taco run is about $15–30 if you leave.",
      ticket: "Visitax about $15/person. Environmental fee about $4/room/night. The airport van is the other line if it is missing from the quote.",
      tax: "Do not apply Florida or Anaheim lodging tax here. The leaks are Visitax, the Hotel Zone fee, tips, and a van that was not in the rate.",
      facts: [
        "The R-1 bus runs the Hotel Zone. Most all-inclusive weeks do not need a rental.",
        "A timeshare-desk morning is a half-day, not a free excursion.",
        "Chichén Itzá is a full day. It does not share a day with Isla Mujeres."
      ],
      gem: "If the airport van is not in the rate, the cheaper all-inclusive is not cheaper. Price the van before you compare two resorts."
    },
    oahu: {
      sources: ["plan-data.js Hawaii lodging tax 17.75%", "trip-finder-data.js oahu", "Guide parking $40–55"],
      room: "Shoulder mid about $310–360. Page band $310–380 before tax.",
      food: "Plate lunch or grocery plus one dinner about $45–75. Resort breakfast is the bleed.",
      ticket: "Hanauma Bay or Pearl Harbor, one timed entry. TheBus or HOLO is the transit line.",
      tax: "Hawaii lodging tax in Trip Plan is 17.75% on a pre-tax quote. Confirm taxes-in before comparing towers.",
      facts: [
        "A rental parked in Waikiki is $40–55 a night even on days you do not drive.",
        "TheBus covers the Waikiki grid until you choose a North Shore or Hanauma day.",
        "A neighbor-island flight is a second airfare, not an Oahu afternoon."
      ],
      gem: "Leave the car until the day you drive to Hanauma or the North Shore. Parking it in Waikiki the other nights is $40–55 you already knew about."
    },
    maui: {
      sources: ["plan-data.js Hawaii lodging tax 17.75%", "trip-finder-data.js maui", "Guide: resort fees and parking on Kaanapali/Wailea"],
      room: "Shoulder mid about $420–480; winter higher. Page band $420–520 before tax.",
      food: "About $40–75 if the kitchen cooks two nights. Resort breakfast is a second lodging charge.",
      ticket: "Haleakalā sunrise is its own reservation. A Molokini boat is a different ticket. Road to Hana is a third day.",
      tax: "Same Hawaii 17.75% lodging tax as Oahu, on a pre-tax condo or resort quote. Resort fees are extra on Kaanapali and Wailea.",
      facts: [
        "The Kihei kitchen is the budget; the beach in front is already in the rate.",
        "Haleakalā sunrise means a middle-of-the-night departure, not a beach afternoon.",
        "Mama’s Fish House or Spago is one reservation, not a reason to change hotels."
      ],
      gem: "Book Haleakalā sunrise as its own day. It does not fit after a beach morning, and it is not included in the condo."
    },
    cruise: {
      sources: ["calc-data.js CRUISE and CRUISE line fares", "cruise.js gratuity notes"],
      room: "Interior 7-night fares in the line table run about $250–650/person on Carnival through Royal. Balcony upgrade in the cruise table is about $500/person.",
      food: "Main dining is in the fare. Specialty about $45/person. Unlimited drink packages about $54–105/person/day by line.",
      ticket: "Port fees about $200/person. Gratuities about $16–20/person/day on mainstream lines, kids age 2 and up. Pre-cruise hotel about $200 if the flight can miss the ship.",
      tax: "These are not lodging taxes. Gratuities and port fees are the lines the brochure leaves off. Do not call them a tax.",
      facts: [
        "Infants under 3 are treated differently from kids who owe gratuities.",
        "The drink-package break-even is a count of drinks, not a default yes.",
        "A pier-kiosk tour is the expensive version of a port walk."
      ],
      gem: "Gratuities bill kids age 2 and up. The infant who sails free still needs documents, not a drink package."
    },
    key_west: {
      sources: ["plan-data.js key_west tax 12.5% and CITY_BASE", "trip-finder-data.js key_west"],
      room: "Shoulder mid about $250–330. CITY_BASE mid hotel $320. Page band $250–360 before tax.",
      food: "CITY_BASE food $60–100. Ventanita plus El Siboney, Garbo’s, or Louie’s.",
      ticket: "Dry Tortugas ferry is the full-day ticket. Fort Zachary Taylor is the cheap outdoor ticket. Mallory sunset is free from the sidewalk.",
      tax: "Florida lodging tax about 12.5% — same family as other Florida rooms, not Anaheim’s 17%.",
      facts: [
        "A Stock Island rate still owes a cab both ways.",
        "EYW air is a premium. The drive from Miami is a full day.",
        "Old Town parking is a fee if you brought a car you will not drive on Duval."
      ],
      gem: "Watch sunset from the Mallory sidewalk. The Tortugas ferry is a different day, not an evening add-on."
    }
  };
})(typeof window !== "undefined" ? window : this);
