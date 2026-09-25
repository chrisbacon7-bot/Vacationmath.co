/* Longer branded Stay / Eat / Do lists, three Hidden gem tips, and
   varied Trip Plan lines. Loaded after city-guides-editorial.js.
   Names match Trip Plan examples. Not live inventory.
   External orientation (cross-checked, not a field visit):
   guidebook-class destination pages, tourism-board and agency fare pages,
   hotel and ticket brand pages, and money-travel roundups.
*/
(function (global) {
  "use strict";

  var pack = global.VM_CITY_GUIDES;
  var R = global.VM_CITY_GUIDE_RESEARCH;
  if (!pack || !pack.ALL || !R) {
    throw new Error("lists overlay needs guides and research notes");
  }

  function tiers(budget, mid, lux) {
    return { budget: budget, mid: mid, lux: lux };
  }

  var EXTRA = {
    disney: ["Skyliner resort roundups: Pop, Art of Animation, Caribbean Beach, Riviera only", "Lightning Lane brand pages: Multi Pass vs Single Pass are different products", "Disney guest-planning notes: on-site Multi Pass window vs off-site"],
    anaheim: ["Disneyland neighborhood guides: Harbor Blvd and Downtown Disney without a ticket", "SNA vs LAX ground-transfer comparisons on destination pages", "Disneyland Hotel and Grand Californian brand pages"],
    los_angeles: ["Getty.edu: free timed entry, parking $25 / $15 after 3pm", "Metro TAP fare-capping explainers, not a stale day-pass price", "Lonely Planet-class LA neighborhood splits: Downtown, Koreatown, Santa Monica"],
    nyc: ["MTA OMNY fare-cap page: about $35 after 12 local rides", "NYC DOT: Staten Island Ferry is free", "Guidebook dining notes: Jackson Heights and Flushing on the 7"],
    vegas: ["Bellagio brand page: fountains and conservatory have no ticket", "Resort-fee roundups cross-checked with the in-repo $35–55 band", "Center-Strip walking guides vs a rental"],
    miami: ["Miami-Dade: Metromover does not charge a fare", "MIA vs FLL transfer comparisons on destination pages", "Collins vs Ocean Drive menu split in beach-city guides"],
    san_francisco: ["SFMTA: cable car is its own fare; Clipper covers Muni buses", "Alcatraz official ferry, not a Wharf booth", "Ferry Building and Mission bakery notes in city guides"],
    chicago: ["CTA: Blue Line from O'Hare and Orange Line from Midway are Ventra fares", "Art Institute vs architecture-cruise roundups", "Loop vs Fulton Market lodging guides"],
    nola: ["St. Charles streetcar guides for the Garden District", "Galatoire's and Commander's Palace reservation-first dining notes", "Café du Monde as a once, not a meal plan"],
    philadelphia: ["NPS Independence Hall timed entry, still free", "Reading Terminal / DiNic's in local food guides", "SEPTA Key vs hop-on bus roundups"],
    atlanta: ["MARTA airport-to-Midtown fare guides", "BeltLine Eastside: Ponce City Market to Krog, no admission", "Georgia Aquarium vs World of Coca-Cola as two tickets"],
    paris: ["Trocadéro viewpoint is free; official tower site vs resellers", "Navigo Semaine is Monday–Sunday, not a rolling week", "Museum Pass vs one Louvre or Orsay ticket"],
    london: ["TfL and 2026 fare notes: Elizabeth line, Heathrow Express, Piccadilly line", "British Museum and National Gallery free-entry pages", "Contactless capping vs Visitor Oyster"],
    rome: ["Bar-coffee (al banco) vs piazza-table markup in Rome guides", "Colosseum-Forum combined ticket vs Vatican Museums", "City fee varies by hotel class; coperto is separate"],
    tokyo: ["Suica / PASMO city coverage vs a JR Pass on a Tokyo-only week", "Haneda vs Narita Skyliner / N'EX fare comparisons", "Sensō-ji free entry vs teamLab Planets timed tickets"],
    cancun: ["Quintana Roo Visitax explainers, about $15 once per visit", "Hotel Zone R-1 bus vs a rental parked at the resort", "Hyatt Ziva, Moon Palace, and Riu transfer-included rate notes"],
    oahu: ["Honolulu DTS: HOLO day cap and transfer window; cash fares differ", "Hanauma Bay reservations vs Pearl Harbor tickets", "Waikiki parking bands already in the guide, about $40–55"],
    maui: ["NPS Haleakalā: $1 sunrise reservation, 3–7 a.m., separate from the entrance fee", "Kihei condo kitchens vs Kaanapali resort-fee pages", "Road to Hana, summit, and Molokini as three days"],
    cruise: ["Cruise-line gratuity pages: kids age 2 and up on mainstream lines", "Drink-package break-even already in this repo", "Chops Grille / Cagney's specialty pricing vs main dining"],
    key_west: ["Mallory Square sunset is free from the sidewalk", "Yankee Freedom Dry Tortugas ferry is a full day", "Fort Zachary Taylor as the cheap outdoor ticket"]
  };

  var L = {
    disney: {
      cta: "Open the Disney Trip Plan and choose the resort before you add Park Hopper. Buying another ticket does not fix the wrong resort.",
      startHere: "Pop Century, Art of Animation, or Caribbean Beach. Grocery the room the night you land at MCO. One park on the ticket you hold.",
      stay: tiers(
        ["Pop Century — Value on the Skyliner; gondola toward Hollywood Studios and Epcot, bus to Magic Kingdom", "Art of Animation — family suites when six share; compare them with connecting rooms at Pop before you pay the theme", "All-Star Movies, Music, or Sports — cheapest on-property bus; Osceola lodging tax is 13.5%"],
        ["Caribbean Beach — Moderate Skyliner hub; ask Riviera-side so the gondola is a walk", "Port Orleans French Quarter — boat to Disney Springs, still a bus to Magic Kingdom", "Coronado Springs, Gran Destino tower — Moderate, buses to the parks, not the Skyliner gondola"],
        ["Disney's Riviera Resort — the Deluxe that actually sits on the Skyliner, closest to the Epcot line", "Grand Floridian, Contemporary, or Polynesian — monorail Deluxe because Magic Kingdom is the commute you bought", "Beach Club or Yacht Club — walk to Epcot; club level is a second nightly rate"]
      ),
      eat: tiers(
        ["Garden Grocer or Winn-Dixie the night you land — breakfast in the room", "Cosmic Ray's, Pecos Bill, or Satu'li Canteen — mobile-order lunch", "Resort food court at Pop or Art of Animation on a Skyliner night"],
        ["Sci-Fi Dine-In or 50's Prime Time — one table-service, booked before you fly", "Columbia Harbour House when you want a quieter Magic Kingdom lunch", "Skip the Disney Dining Plan; the calculator's typical day for four is about $215"],
        ["'Ohana or Chef Mickey's — one character meal, not a plan", "California Grill or Space 220 — the Splurge reservation", "Tusker House only if Animal Kingdom morning is already the plan"]
      ),
      do: tiers(
        ["Magic Kingdom as one park day — no Park Hopper", "Disney Springs at night instead of a third gate", "Resort-hop the Skyliner after 4 p.m. — the gondola is not a ticket"],
        ["Hollywood Studios or Epcot on the Skyliner day", "Animal Kingdom with lunch at Satu'li Canteen", "Lightning Lane Multi Pass on a peak Magic Kingdom or Studios day — about $16–32 in the calculator; 2026 captures run wider"],
        ["Lightning Lane Single Pass for Rise of the Resistance, TRON, Guardians, or Flight of Passage — not inside Multi Pass", "Memory Maker, about $185 in the calculator, only if every park day is a photo day", "Hopper, about $65–105, only if you switch parks after lunch"]
      ),
      tips: [
        "Hidden gem: Riviera is the Deluxe on the Skyliner. Grand Floridian, Contemporary, and Polynesian sell the monorail to Magic Kingdom. If the week is Epcot and Hollywood Studios, do not pay for that loop.",
        "Hidden gem: Lightning Lane Single Pass is a separate per-ride product for Rise of the Resistance, TRON, Guardians of the Galaxy, and Flight of Passage. Multi Pass does not include those headliners.",
        "Hidden gem: On-site guests book Multi Pass about seven days out for the trip. Off property, the window is about three days and one day at a time. That booking window is the reason to sleep on property, not a reason to buy a dining plan.",
        "Ask for a Riviera-side room at Caribbean Beach. Otherwise the 'Skyliner resort' still includes a campus bus.",
        "A Tuesday or Wednesday MCO arrival beats a Saturday check-in on the same All-Star or Pop room."
      ]
    },
    anaheim: {
      cta: "Start the Anaheim Trip Plan on Harbor Boulevard. Add Lightning Lane on the Disneyland day only after the room is in.",
      startHere: "Candy Cane Inn, or another Harbor walk. Albertsons or Target the night you land. Disneyland, then California Adventure. Leave Universal in Los Angeles.",
      stay: tiers(
        ["Candy Cane Inn — Harbor courtyard, walk or a short shuttle", "Castle Inn or Tropicana Inn — Harbor value; ask for a room off the boulevard", "Holiday Inn Express Anaheim — grocery breakfast, still not Santa Monica"],
        ["Pixar Place Hotel — walk to Downtown Disney", "Hilton Anaheim or Anaheim Marriott — convention campus, shuttle, still Anaheim", "Hyatt House at Anaheim Resort — kitchenette if you will grocery dinner"],
        ["Grand Californian — walk into California Adventure", "Disneyland Hotel — on-property campus; do not add a Santa Monica night", "JW Marriott or The Westin Anaheim — off-property Splurge with a pool, still a shuttle"]
      ),
      eat: tiers(
        ["Albertsons or Target the night you land", "Mobile-order inside the park you already entered", "A Downtown Disney counter — dinner without a park ticket"],
        ["Naples or Tortilla Jo's in Downtown Disney — a table, not a dining plan", "Carthay Circle or Lamplight Lounge — book before you fly", "Harbor Boulevard casual the night you are walked out"],
        ["Napa Rose — the Grand Californian dining room, booked before you fly", "World of Color dessert package only if that show is the night", "Club 33 is not a plan you can count on"]
      ),
      do: tiers(
        ["Disneyland as one park day — rope-drop Adventureland or Galaxy's Edge", "California Adventure the next day — Cars Land or Pixar Pier, no Hopper dash", "Downtown Disney after dark, which does not require a ticket"],
        ["Lightning Lane on the Disneyland day only", "World of Color as a nighttime show, not a third park", "ART if the hotel is off the walk"],
        ["Hopper only if you will switch after lunch", "Early entry from a Deluxe on-property hotel — included with that room, not with a Harbor rate", "Universal Studios Hollywood is a Los Angeles ticket and a separate parking lot"]
      ),
      tips: [
        "Hidden gem: Eat at Naples or Tortilla Jo's in Downtown Disney without a park ticket. You can buy that dinner without a dining plan.",
        "Hidden gem: Candy Cane Inn on Harbor beats a Santa Monica hotel. The Westside drive can eat the park day you bought.",
        "Hidden gem: Price the SNA ride against a cheap LAX fare before you call the airfare a win. ART covers an off-walk hotel. A rental that never leaves the garage is a parking line.",
        "Lightning Lane on the Disneyland day. California Adventure is a second decision.",
        "Midweek beats a Friday arrival in Halloween Time, when the same Harbor room is a different rate."
      ]
    },
    los_angeles: {
      cta: "Put one neighborhood in the LA Trip Plan. If a dinner needs a second zip code, delete it.",
      startHere: "Sleep Downtown, in Koreatown, or in Santa Monica — and stay there. Porto's or Grand Central Market in the morning. Getty if you reserved it. Universal only if that is the paid day.",
      stay: tiers(
        ["Freehand Downtown or Hampton Inn Downtown — Metro and Grand Central Market", "Holiday Inn Express Downtown or Moxy Downtown — Arts District walking, not the Valley", "Courtyard L.A. LIVE — Pico station, convention-adjacent"],
        ["Ace Hotel Downtown — boutique, Grand Central Market on foot", "Hyatt Regency Los Angeles Downtown or The Westin Bonaventure — one rideshare zone", "The Line or Hotel Normandie in Koreatown — B and D Lines, late food"],
        ["JW Marriott or The Ritz-Carlton at L.A. LIVE — the Downtown Splurge tower", "Conrad Los Angeles — Grand LA flagship", "1 Hotel West Hollywood or Proper Santa Monica — pick WeHo or the beach, not both"]
      ),
      eat: tiers(
        ["Porto's in the neighborhood you slept in — not a Burbank detour from Santa Monica", "Grand Central Market for lunch if you slept Downtown", "Mariscos Jalisco or a Koreatown taco counter — lunch, not a food tour"],
        ["Langer's deli over a hotel restaurant", "Quarter or Kang Ho Dong if the bed is Koreatown", "Bestia only if you booked it and you are already Downtown"],
        ["Republique or Gjusta — one breakfast reservation, then stop", "Providence — the seafood tasting", "n/naka — the Splurge counter; it is not a drive-by from the beach"]
      ),
      do: tiers(
        ["Getty Center — free timed reservation; parking is the cost", "Griffith Observatory — no admission; the view is the evening", "The Broad — timed general admission is free; a special show is the paid exception"],
        ["Metro E Line from Downtown to Santa Monica — TAP or contactless, fare-capped", "Universal Studios Hollywood as the one ticketed day", "Getty Villa only if you reserved it separately; it is not the same hill as the Center"],
        ["Universal Express — the Splurge add-on, not the default gate", "Warner Bros. studio tour instead of Universal, not stacked on it", "Disneyland lodging is Anaheim, with its own ticket"]
      ),
      tips: [
        "Hidden gem: Reserve the Getty Center. Admission is free. Parking is $25 a car, $15 after 3 p.m., and free Saturday after 6. A Downtown rideshare each way often costs more than the lot.",
        "Hidden gem: The Getty Villa in Pacific Palisades is a second museum with its own free reservation. Same-day Pay Once, Park Twice only helps if you actually visit both.",
        "Hidden gem: TAP or a contactless card fare-caps Metro. FlyAway, Metrolink, and a rideshare are three products. The E Line is the Downtown–Santa Monica trip.",
        "Universal's theme-park table starts near $101 in advance and about $159 at the gate. Express is extra.",
        "Pay $40–60 hotel parking only on a day you drive to the Getty, a canyon, or a second beach."
      ]
    },
    nyc: {
      cta: "The New York Trip Plan starts at the subway stop under the hotel. Add the Met, MoMA, or one Broadway seat — not three observation decks.",
      startHere: "Pod 39, citizenM Bowery, or The Hoxton Williamsburg. Bodega egg-and-cheese. One paid thing, and it is not Times Square.",
      stay: tiers(
        ["Pod 39 or citizenM Bowery — compact rooms on a train you will ride", "Motto by Hilton Chelsea or Courtyard Manhattan/Chelsea — the 1 or the A/C/E", "Hampton Inn Times Square Central only if you want the subway downstairs, not the neon"],
        ["Ace Hotel NoMad — the neighborhood over a convention tower", "Hyatt Grand Central or The Westin Grand Central — you arrived on a train", "The Hoxton Williamsburg — one river, a lower night than Midtown"],
        ["Park Hyatt New York — Midtown flagship", "Conrad New York Downtown — Battery Park, not a Times Square tower", "1 Hotel Central Park or The St. Regis — the address is the Splurge"]
      ),
      eat: tiers(
        ["Bodega egg-and-cheese or a bakery — not the hotel", "Xi'an Famous Foods or a $1–3 slice", "A Jackson Heights or Flushing dinner on the 7"],
        ["Russ & Daughters or Katz's — share it, then go to a park", "L'Artusi if you slept downtown", "Cafe Sabarsky once, not a pre-theatre prix fixe every night"],
        ["Le Bernardin — the reservation", "Via Carota or Lilia — one night, booked", "Carbone-class only if that table is why you came"]
      ),
      do: tiers(
        ["The High Line and a Lower East Side walk", "Staten Island Ferry — free skyline, no ticket", "A pay-what-you-wish Met hour for New York residents, or skip the museum"],
        ["MoMA or the Met — one", "Brooklyn Heights and Dumbo on the train you already tapped", "OMNY on the same card until the cap, about $35 after 12 local rides"],
        ["A reserved seat at the Gershwin or the Majestic", "Summit, Edge, or Top of the Rock — one deck, not three", "A Broadway rush or lottery before a full-price orchestra seat"]
      ),
      tips: [
        "Hidden gem: OMNY caps subway and local bus at about $35 over seven days, after 12 paid rides on the same card. You do not buy the old unlimited MetroCard up front.",
        "Hidden gem: The Staten Island Ferry is free, day and night, no ticket. Summit, Edge, and Top of the Rock are three paid skies.",
        "Hidden gem: One dinner on the 7 in Jackson Heights or Flushing costs less than three $28 Midtown salads. It is the same fare as a ride to Times Square.",
        "A Friday arrival in the neighborhood you already picked is a different room rate than Tuesday.",
        "Cafe Sabarsky once. A pre-theatre prix fixe every night is a second show you did not buy."
      ]
    },
    vegas: {
      cta: "Add the resort fee to the Vegas room before a Tuesday rate looks cheap. Then buy one show.",
      startHere: "Tuesday through Thursday at Park MGM, New York-New York, or Circa. Add about $35–55 a night before you compare towers. Walk to the fountains.",
      stay: tiers(
        ["Ellis Island or a Fremont 2-star — downtown walking", "Hampton Inn Tropicana or Hilton Garden Inn Strip South — one Deuce ride, fee still applies", "The LINQ or Flamingo — a Center-Strip bed, not a suite"],
        ["Park MGM — walk to the fountains; the resort fee is still on the bill", "New York-New York or Horseshoe — Center-Strip walk", "Circa — Fremont, one rideshare to the Strip, not a rental"],
        ["Bellagio — fountain-adjacent, still a resort-fee hotel", "Wynn or Encore — north Strip; you will still walk or tram", "Waldorf Astoria Las Vegas or Four Seasons at Mandalay Bay — quieter tower, same fee logic"]
      ),
      eat: tiers(
        ["Park MGM food hall or a Cosmo hall — off the casino floor", "Ellis Island if you slept downtown", "Chinatown at District One — a meal that is not a steakhouse"],
        ["Tacos El Gordo — a short walk off the casino floor", "Mon Ami Gabi — one patio, not every night", "Esther's Kitchen — the sit-down if you are downtown"],
        ["Bazaar Meat or Hell's Kitchen at Caesars — one night", "Picasso or Guy Savoy — the tasting, then back to the food hall", "A $40 buffet only if that buffet is the meal you want"]
      ),
      do: tiers(
        ["Bellagio fountains — no ticket", "The conservatory — no ticket", "A Fremont walk after dark"],
        ["The Deuce or the monorail as the backup, not four rideshares", "High Roller off-peak — one daytime ticket", "Mystère or O — one show"],
        ["A residency at Dolby Live — the other paid night, not the same night as Cirque", "Omnia or XS — a table minimum, which is a second admission", "Red Rock only if a car is already booked for that day"]
      ),
      tips: [
        "Hidden gem: The Bellagio fountains and the conservatory do not sell tickets. Pay for Mystère or O. Do not pay for a second hotel closer to the water.",
        "Hidden gem: Add three nights of resort fee, about $35–55 each, before a Tuesday Park MGM rate beats a Saturday. The fee is not the 13.5% lodging tax.",
        "Hidden gem: The Deuce and the monorail are the Strip backup. A rental you park under the hotel is a fee for a walk you could have taken from Park MGM or New York-New York.",
        "Write the drinks down before you buy a package. A comped well drink is not dinner.",
        "Midweek January or early December is the rate window. Saturday during a convention is not."
      ]
    },
    miami: {
      cta: "Stay on Collins, a few blocks off Ocean Drive. Wynwood can be one afternoon. Skip the cabana minimum.",
      startHere: "The Gale, Freehand, or The Betsy. Versailles or a ventanita before the sand. One other neighborhood: Wynwood, Little Havana, or Brickell.",
      stay: tiers(
        ["The Gale South Beach — Collins, a few blocks off Ocean Drive", "Freehand Miami — walk to the sand and the bus", "Courtyard Miami Downtown/Brickell — Metromover, not an Ocean Drive address"],
        ["Kimpton EPIC — Brickell bay, one neighborhood", "Hyatt Centric South Beach — Collins walk to the sand", "The Confidante — Art Deco mid without an Ocean Drive menu"],
        ["1 Hotel South Beach — the beach premium; the cabana is still extra", "Faena or The Setai — Mid-Beach quiet, still not an Ocean Drive menu", "Four Seasons at The Surf Club — Surfside, a different ride than Lummus"]
      ),
      eat: tiers(
        ["Versailles or a ventanita — breakfast", "Time Out Market — lunch, not a beach club", "Little Havana or Wynwood at night"],
        ["Yardbird on Collins — sit-down off Ocean Drive", "Joe's Stone Crab — share it once", "A Brickell table if that is where you slept"],
        ["Stubborn Seed — the South of Fifth tasting, booked", "Nikki Beach or a 1 Hotel cabana — the minimum spend is the price", "A tasting menu once, then Cuban coffee again"]
      ),
      do: tiers(
        ["Lummus Park or South Pointe — the sand you booked", "Wynwood Walls from the sidewalk", "Calle Ocho on foot"],
        ["Vizcaya — the indoor ticket", "Brickell Metromover — no fare", "An Everglades airboat only as a half-day"],
        ["A reserved boat — one, not a bottle minimum plus a boat", "Nikki Beach's minimum is not the afternoon plan", "Do not stack a cruise embarkation into this stay without a buffer night"]
      ),
      tips: [
        "Hidden gem: Brickell's Metromover does not charge a fare. A South Beach resort rate is what you pay to avoid one beach rideshare.",
        "Hidden gem: Vizcaya is the indoor ticket. Lummus Park does not need one. Nikki Beach's minimum is a different product from the sand.",
        "Hidden gem: Compare MIA and FLL with the ground ride on the card. The cheaper airport loses when the transfer is long.",
        "Versailles for breakfast. An Ocean Drive lunch is the same sand with a menu surcharge.",
        "A hurricane-season rate needs a fare you can change. The discount disappears if the flight cannot move."
      ]
    },
    san_francisco: {
      cta: "Ferry Building or the Mission first. Alcatraz only after that room exists. Leave the Wharf dinner off the San Francisco Trip Plan.",
      startHere: "Hotel Emeline, or a Jackson Square room you can walk to the ferry. Tartine if you are in the Mission. Book the official Alcatraz ferry before a second museum.",
      stay: tiers(
        ["HI San Francisco Downtown — BART downstairs, a shared room if that is the brief", "Hampton Inn Downtown/Convention Center — walk to BART", "Hotel Zephyr — only if you actually want to stay at Fisherman's Wharf"],
        ["Hotel Emeline — Jackson Square, Ferry Building on foot", "Hyatt Regency San Francisco — Embarcadero", "Hotel Nikko or Hilton Union Square — fine if BART is downstairs, not because the lobby menu is"],
        ["Fairmont or Mark Hopkins — Nob Hill; the bus up the hill is a Clipper tap", "1 Hotel San Francisco — Embarcadero boutique", "St. Regis or Four Seasons SoMa — walk to SFMOMA, still not a Wharf week"]
      ),
      eat: tiers(
        ["Tartine or a Mission bakery", "La Taqueria or El Farolito — lunch on BART/Muni", "Ferry Building for a counter lunch, not a Wharf rack"],
        ["Zuni — one dinner", "State Bird Provisions — the reservation, then Tartine tomorrow", "A Chinatown dinner if you are already on that bus"],
        ["Quince — the Splurge table", "Atelier Crenn or Benu — one tasting", "The French Laundry is a Napa transfer, not a San Francisco reservation"]
      ),
      do: tiers(
        ["Crissy Field and the Embarcadero — no ticket", "Mission murals on foot", "A Muni bus up Nob Hill on Clipper"],
        ["Alcatraz on the official timed ferry", "SFMOMA or the de Young — one", "Powell-Hyde once, as a ride, then back on a bus"],
        ["A Napa day only if hotel parking was the plan", "Muir Woods as its own half-day, not stacked on Alcatraz", "Yosemite is not a San Francisco afternoon"]
      ),
      tips: [
        "Hidden gem: Ride the Muni bus up Nob Hill on Clipper. Buy the Powell-Hyde cable car once, as a souvenir fare, not as the pass that gets you around the city.",
        "Hidden gem: Book Alcatraz from the official ferry. It sells out. A booth at the Wharf is not the reservation system.",
        "Hidden gem: A Clipper visitor product wins on a four-ride day. Count tomorrow's rides before you buy it. One cable-car trip does not make the pass.",
        "Hotel parking is for a Napa day. The Mission, the Ferry Building, and Crissy Field do not need a car.",
        "State Bird Provisions or Quince is one dinner. Tartine is the next morning."
      ]
    },
    chicago: {
      cta: "Loop or Fulton Market in the Chicago Trip Plan. Then one indoor hour — the Art Institute or a Wendella cruise — and stop.",
      startHere: "Freehand, a Loop Hampton, or The Hoxton. A diner, not the Mag Mile hotel. The Riverwalk before any ticket.",
      stay: tiers(
        ["Freehand Chicago — share the room if that is the brief; you are there because the L is downstairs", "Hampton Inn Magnificent Mile or Courtyard River North — trains downstairs", "Motto by Hilton Chicago Downtown — compact, not a suburban cloverleaf"],
        ["The Hoxton Chicago — Fulton Market, restaurants over the Mag Mile", "Hilton Chicago — Grant Park and the L", "LondonHouse or Hyatt Regency Chicago — the river, still downtown"],
        ["The Langham — river, winter is when that rate can make sense", "Park Hyatt or Four Seasons — Mag Mile flagship", "Waldorf Astoria Chicago — Gold Coast; January is the window, Lollapalooza week is not"]
      ),
      eat: tiers(
        ["A diner or a doughnut — not the hotel", "An Italian beef or a tavern lunch", "Lou Malnati's or Giordano's once, then stop"],
        ["The Publican — Fulton Market sit-down", "Girl & the Goat if that reservation is the night", "Skip a Magnificent Mile lunch as the meal plan"],
        ["Oriole or Alinea — one tasting", "A second Fulton Market dinner the night you did not book the tasting", "The Langham breakfast only if it is in a rate you already accepted"]
      ),
      do: tiers(
        ["The Riverwalk and the architecture from the sidewalk — no ticket", "The lakefront if the weather allows", "Blue Line from O'Hare or Orange Line from Midway — a Ventra fare"],
        ["Art Institute — the indoor ticket", "A Wendella architecture cruise — the other indoor ticket, not the same afternoon", "A Ventra day pass before a loop of rideshares"],
        ["A reserved show only after the museum-or-cruise choice is made", "Lollapalooza week is a different rate for the same Loop hotel", "Two museums plus a cruise do not fit in one day"]
      ),
      tips: [
        "Hidden gem: The Blue Line from O'Hare is a Ventra fare. The Orange Line does the same job from Midway. A Friday rideshare to the Loop can erase a suburban room.",
        "Hidden gem: The Riverwalk does not charge admission. A Wendella cruise does. Buy one of those, not both, and not a second museum the same afternoon.",
        "Hidden gem: A January rate at LondonHouse or The Langham and a Lollapalooza-week rate are different hotels wearing the same name.",
        "Lou Malnati's once. The Publican is the other meal.",
        "An O'Hare hotel for the whole trip means you will ride downtown anyway. Sleep downtown."
      ]
    },
    nola: {
      cta: "Book Galatoire's or Commander's Palace first, then a Warehouse District or Garden District room. Do not spend the dinner money on a balcony.",
      startHere: "Hotel Peter and Paul, The Pontchartrain, or a Warehouse Hampton. Café du Monde once. Parkway for the po'boy. The reservation is why you came.",
      stay: tiers(
        ["HI New Orleans or The Drifter — streetcar, not a Bourbon balcony", "Hampton Inn Convention Center or Courtyard Downtown — Warehouse District", "A Mid-City motel on the Canal line — lower than a Quarter photo"],
        ["Hotel Peter and Paul — Marigny, walk to dinner", "The Pontchartrain — Garden District, St. Charles line", "Omni Royal Orleans or New Orleans Marriott — Quarter or Canal if you accept the premium"],
        ["Hotel Monteleone — Quarter flagship; a balcony does not change the dinner bill", "The Roosevelt — Waldorf, CBD", "Windsor Court or Four Seasons — the room is the treat, the table is still separate"]
      ),
      eat: tiers(
        ["Café du Monde once, then a neighborhood café", "Parkway Bakery — the po'boy", "A casual Creole plate that is not a tourist courtyard"],
        ["Galatoire's — book it first", "Commander's Palace — the other reservation", "Coop's or a Warehouse District dinner the night you do not have the table"],
        ["A modern tasting only after Galatoire's or Commander's is decided", "The Roosevelt bar once, not as dinner", "A second courtyard menu is a second dinner bill"]
      ),
      do: tiers(
        ["Royal and Decatur in daylight", "St. Charles streetcar to the Garden District", "Frenchmen Street — a cover, not a haunted stack"],
        ["Preservation Hall — the paid music night", "A swamp tour only with a car you already counted", "Whitney Plantation — the paid day outside the city, not a second plantation"],
        ["Hotel Monteleone's carousel bar is a drink, not a lodging strategy", "Mardi Gras or Jazz Fest dates reprice the room", "Two plantations in one day is a drive, not a dinner"]
      ),
      tips: [
        "Hidden gem: The St. Charles streetcar is the Garden District tour. The Quarter photo is on the Royal Street sidewalk, not a Bourbon balcony.",
        "Hidden gem: Book Galatoire's or Commander's Palace before Hotel Monteleone. A balcony or gallery does not change what dinner costs.",
        "Hidden gem: Café du Monde once. A neighborhood café the other mornings. The line is not a meal plan.",
        "A rental is for Whitney Plantation or a Honey Island swamp tour, not for Bourbon at night.",
        "One cover at Preservation Hall or on Frenchmen. A second tour the same night is another ticket."
      ]
    },
    philadelphia: {
      cta: "Center City or Old City, Reading Terminal in the morning, the Hall, then one museum. That is the Philadelphia Trip Plan.",
      startHere: "The Notary or Kimpton Hotel Monaco. Reading Terminal before anything else. Independence Hall on the timed slot you already booked.",
      stay: tiers(
        ["Hampton Inn Center City or Home2 Suites Downtown — grocery breakfast", "Courtyard Philadelphia Downtown — City Hall walk", "Holiday Inn Express Midtown — Broad Street Line, not the airport"],
        ["The Notary — Hilton, City Hall and the Terminal", "Kimpton Hotel Monaco — Independence Mall on foot", "Loews Philadelphia or Philadelphia Marriott Downtown — SEPTA, not a car"],
        ["Four Seasons Philadelphia — Logan Square", "The Rittenhouse — the square is the address", "The Logan — Parkway, still one museum"]
      ),
      eat: tiers(
        ["Reading Terminal bakery in the morning", "DiNic's roast pork — the sandwich", "Pat's or Geno's once, then stop"],
        ["Villa di Roma or another South Philly red-gravy room", "A Terminal stall for lunch the day you are in Old City", "Vetri if the neighborhood Italian is the night"],
        ["Zahav — only if that dinner is why you came", "The Rittenhouse dining room costs more than a Reading Terminal meal", "A second tasting the night after Zahav is another full dinner bill"]
      ),
      do: tiers(
        ["Independence Hall timed entry — free, and it sells out", "The Liberty Bell after the Hall", "Love Park and City Hall as a walk-through, not a hop-on bus"],
        ["The Barnes or the Philadelphia Museum of Art — one", "Eastern State Penitentiary as a half-day on a different afternoon", "SEPTA Key or an Independence Pass if you will ride more than twice"],
        ["Barnes and the Art Museum on different days, if you pay for both", "Franklin Institute only if the party is kids-first", "Regional Rail to PHL, not a taxi habit from an airport hotel"]
      ),
      tips: [
        "Hidden gem: Book the free Independence Hall slot first. It still sells out. The Barnes is the museum you pay for.",
        "Hidden gem: DiNic's roast pork at Reading Terminal is the sandwich locals argue for. Pat's or Geno's is one cheesesteak, not the day.",
        "Hidden gem: SEPTA Key or an Independence Pass if you will ride more than twice. A hop-on bus sells a second transit product on streets the subway already covers.",
        "An airport hotel owes Regional Rail every morning. Sleep at The Notary or Hotel Monaco instead.",
        "Midweek PHL. The Fourth of July week is a different room."
      ]
    },
    atlanta: {
      cta: "Midtown or Ponce on MARTA. One ticketed morning in the Atlanta Trip Plan. Buckhead is a different fare.",
      startHere: "MARTA from ATL to a Midtown Hampton or to Hotel Clermont. Mary Mac's or West Egg. The BeltLine before a second ticket.",
      stay: tiers(
        ["Hampton Inn Midtown or Home2 Suites Downtown — MARTA, not Cumberland", "Holiday Inn Express Downtown — only if the convention calendar is quiet", "HI Atlanta — a shared room if that is the brief, still on a train"],
        ["Hotel Clermont — Ponce, Eastside Trail out the door", "The Georgian Terrace or a Midtown Hampton — Piedmont and MARTA", "Hyatt Regency Atlanta or Hilton Atlanta — Downtown, one room, watch the calendar"],
        ["Four Seasons Atlanta — Midtown flagship; you can still walk to the trail", "St. Regis or Grand Hyatt Buckhead — you traded the BeltLine for a different fare", "The Whitley — Buckhead Hyatt; Bones is nearby and the trail is not"]
      ),
      eat: tiers(
        ["West Egg or a Midtown café", "Mary Mac's Tea Room — meat-and-three", "Ponce City Market food hall — lunch on the trail"],
        ["Fox Bros. Bar-B-Q — the BeltLine plate", "Krog Street Market — the far end of the Eastside Trail", "Varasano's if you want pizza and you are already Midtown"],
        ["Staplehouse or Bacchanalia — one Westside dinner", "Bones — a Buckhead ride, not a trail dinner", "A Four Seasons breakfast only if it is in the rate"]
      ),
      do: tiers(
        ["Eastside Trail from Ponce City Market to Krog — no admission", "Piedmont Park", "MLK National Historical Park — no ticket"],
        ["Georgia Aquarium or World of Coca-Cola — one morning", "MARTA from ATL to Midtown — one fare", "A Fox Theatre tour only after the ticketed morning is done"],
        ["Aquarium and World of Coca-Cola on different days, if the nights are long enough", "A Braves game is its own night-price", "Two Ubers a day from a hotel off the train erase the room you saved"]
      ),
      tips: [
        "Hidden gem: MARTA from ATL to Midtown is one fare. A Cumberland or off-train rate still owes two rides a day.",
        "Hidden gem: The Eastside Trail from Ponce City Market through Inman Park to Krog Street Market does not charge admission.",
        "Hidden gem: Georgia Aquarium and World of Coca-Cola are two separate tickets. Piedmont Park and the MLK site are the free afternoon.",
        "Read the convention calendar before an Atlanta Marriott Marquis rate looks normal.",
        "Fox Bros. or Mary Mac's. Bones adds a Buckhead ride the trail did not require."
      ]
    },
    paris: {
      cta: "A 10th-arrondissement hotel, one museum, and Septime only if the table is already in hand. That is the Paris Trip Plan.",
      startHere: "Ibis or a walk-up near République or Oberkampf. Coffee and a pastry downstairs, not a palace breakfast. Louvre or Orsay — pick before you land.",
      stay: tiers(
        ["Ibis Gare du Nord or Ibis Styles République — Metro downstairs, bakery on the block", "Holiday Inn Express Canal de la Villette — the night you land late", "Generator Paris — a shared room by the canal if that is the brief"],
        ["Hôtel Malte or a Left Bank 3-star near Odéon — the mid if you want the 5th or 6th", "Novotel Les Halles — central, still not a tower-view surcharge", "Hilton Paris Opera or Paris Marriott Opera Ambassador — one arrondissement"],
        ["Hôtel de Crillon or Le Bristol — only if the palace stay is why you booked", "Park Hyatt Paris-Vendôme or the Ritz — Place Vendôme prices", "Lutetia — Left Bank, still a bakery breakfast unless you came for the dining room"]
      ),
      eat: tiers(
        ["A bakery on the block — Du Pain et des Idées if you are in the 10th", "Bouillon Chartier or Bouillon Pigalle — the formule", "L'As du Fallafel or a neighborhood bistro, not a table on the tower steps"],
        ["Bouillon Julien or Marché des Enfants Rouges", "A fromagerie on Rue du Faubourg-Saint-Denis — dinner, with a bottle", "Frenchie or Le Comptoir only if that booking exists"],
        ["Septime — the reservation people miss by treating it as a walk-in", "Le Clarence or Epicure — palace dining, its own line", "Breakfast at Crillon or Bristol — separate from the room"]
      ),
      do: tiers(
        ["Eiffel Tower from Trocadéro or Champ de Mars — free", "Île de la Cité on foot", "Père Lachaise or the canal if you slept in the 10th or 11th"],
        ["Louvre or Musée d'Orsay — one timed ticket, bought on the museum's own site", "A Museum Pass only if you will enter two museums", "Navigo Jour on a day you will ride four times; Navigo Semaine only if your dates are Monday–Sunday"],
        ["Versailles as an RER half-day with its own ticket", "Sainte-Chapelle or the tower summit — one, not both the same afternoon", "A reseller's tower ticket is often a different price for the official elevator"]
      ),
      tips: [
        "Hidden gem: See the tower from Trocadéro for free. If you want the summit, buy it on the official tower site. A reseller markup is a different price for the same elevator.",
        "Hidden gem: A Museum Pass wins at two museums. One Louvre or one Orsay is cheaper as a single timed ticket.",
        "Hidden gem: Navigo Semaine runs Monday to Sunday, not seven rolling days. Arrive on Wednesday and you paid for a Monday you were not here. Navigo Jour is the day you actually ride.",
        "Versailles does not share an afternoon with the Louvre. The RER fare is its own line.",
        "Trip Finder's shoulder mid is about $200–350 before a rough euro conversion. A view block is a surcharge on that band."
      ]
    },
    london: {
      cta: "Contactless cap, one free museum, and a Heathrow hotel only for the night you land. Put that in the London Trip Plan before the Eye.",
      startHere: "Premier Inn County Hall or The Hoxton. A Tesco meal deal the first morning if the bakery is closed. British Museum or the National Gallery before any landmark ticket.",
      stay: tiers(
        ["Premier Inn London County Hall — South Bank walk, not a West End rate", "Ibis London Euston or Holiday Inn Express Southwark — Zone 1–2, Tesco nearby", "Travelodge Covent Garden — compact, if you packed light"],
        ["The Hoxton — restaurants on the block", "Hilton Bankside or London Marriott County Hall — South Bank, walk to a station", "Canopy by Hilton London City — Aldgate, not Mayfair"],
        ["Claridge's or The Connaught — only if you came to stay in Mayfair", "The Savoy — the river Splurge", "The Langham or Raffles at The OWO — one of them, not a week of landmark tickets as well"]
      ),
      eat: tiers(
        ["A bakery, or a Tesco meal deal when you are between museums", "Borough Market or Maltby Street — one lunch", "A pub pie or a Zone 2 grill — dinner"],
        ["Dishoom — one dinner", "Barrafina if that is the booking", "A neighborhood Indian the nights you are not in the West End"],
        ["The Ivy — the reservation, then Tesco again", "Core or Kitchen Table — one tasting", "A hotel breakfast only if it is already in the Premier Inn or Travelodge rate"]
      ),
      do: tiers(
        ["British Museum or the National Gallery — free", "South Bank walk, Tate Modern turbine hall — free", "Columbia Road or a market morning"],
        ["Contactless daily cap on Tube and bus", "Elizabeth line from Heathrow if your hotel is on that line", "One of: the Tower, the Eye, or a West End day seat"],
        ["A full-price orchestra seat — the Splurge show", "Windsor or Bath as its own day, not a third landmark", "A Heathrow hotel for the week means you ride in every morning"]
      ),
      tips: [
        "Hidden gem: Price the Elizabeth line against Heathrow Express before you keep an airport hotel all week. Walk-up Express is the expensive one. Advance Express can undercut the Elizabeth line. The Piccadilly line is the slow cheap one. Tapping a contactless card on Express does not turn it into a Tube fare.",
        "Hidden gem: The British Museum and the National Gallery do not charge admission. The Eye and the Tower are the paid pair. Buy one.",
        "Hidden gem: Contactless capping is the fare. A Visitor Oyster and a paper Travelcard are souvenirs unless you have already counted the rides and the cap loses.",
        "Borough Market is one lunch. A Tesco meal deal covers the other two.",
        "UK hotel quotes usually include VAT. Compare two rates only when both are taxes-in. Trip Plan's 10% Europe assumption is not a London VAT quote."
      ]
    },
    rome: {
      cta: "Trastevere or Prati in the Rome Trip Plan. One timed ruin. Leave the golf cart off the card.",
      startHere: "A Trastevere guesthouse or a Prati room near Ottaviano. Cornetto and coffee standing at the bar. Colosseum and Forum on their own day.",
      stay: tiers(
        ["The Beehive — Termini the night you land late, not automatically the whole week", "Ibis Styles Roma Vintage — Metro, stairs are common", "A Prati guesthouse near Ottaviano — calmer than a Navona view"],
        ["Hotel Nazionale — centro, walk to the Pantheon", "Hotel Indigo Rome – St. George — walk the center", "NH Collection Palazzo Cinquecento — Termini-adjacent if the flight is late"],
        ["Hotel de Russie — Piazza del Popolo; you are paying for that location and the walk", "Hotel Eden — Via Veneto Splurge", "Hassler Roma — above the Spanish Steps; breakfast there costs more than coffee at the bar"]
      ),
      eat: tiers(
        ["Cornetto and coffee at the bar, standing", "Supplì or pizza by the slice in Testaccio or Trastevere", "A trattoria without a photo menu"],
        ["Da Enzo al 29 — Trastevere, ask about coperto", "Flavio al Velavevodetto — Testaccio carbonara", "Roscioli — one reserved lunch or dinner, not both"],
        ["La Pergola — one tasting menu", "Hotel de Russie or Hotel Eden breakfast — the Splurge morning", "A Navona table is the markup on pasta you can eat in Testaccio"]
      ),
      do: tiers(
        ["Pantheon from the street, Trevi as a pass-through", "Trastevere after dark on foot", "Skip the golf-cart"],
        ["Colosseum and Forum — one timed ticket", "Vatican Museums on a different day", "A 48- or 72-hour metro pass only if you will ride; the centro day is a walk"],
        ["Borghese on its own timed slot, not stacked on the Vatican", "A catacombs tour only as its own half-day", "August centro rates are a different hotel"]
      ),
      tips: [
        "Hidden gem: Take the cornetto at the bar. A Navona table is the markup, and coperto shows up again at dinner — a few euros, on top of the Rome city fee that varies by hotel class.",
        "Hidden gem: The Colosseum and the Forum are one timed ticket. The Vatican Museums are a different day and a different ticket. A golf cart sells the walk between them.",
        "Hidden gem: A 48- or 72-hour metro pass loses on a Trastevere day you walk. Buy it the morning you ride to Ottaviano, not as a default.",
        "Hotel de Russie or Hotel Eden breakfast is the Splurge. The bar is the other morning, including after a palace night.",
        "Do not invent a single euro amount for the nightly city fee. It depends on the hotel class, and it often sits outside the room rate."
      ]
    },
    tokyo: {
      cta: "A station hotel, a Suica, and one counter booked before the flight. Leave the nationwide rail pass out of the Tokyo Trip Plan.",
      startHere: "APA, Toyoko Inn, or Mitsui Garden over a JR or Metro line. Onigiri from the lobby konbini. One ward today.",
      stay: tiers(
        ["APA Hotel Shinjuku or a Toyoko Inn in Ueno — station downstairs, convenience store in the lobby", "Super Hotel in Ikebukuro or Ueno — limited-service, Metro in the block", "Nine Hours Shinjuku — a crash pad, not a week"],
        ["Mitsui Garden or Hotel Gracery Shinjuku — Japanese 4-star, trains not a rail-pass spreadsheet", "Hilton Tokyo or Hyatt Regency Tokyo — Shinjuku, Metro in the basement", "The Westin Tokyo — Ebisu, one train zone"],
        ["Park Hyatt Tokyo — the view; you still take the Metro to dinner", "Aman Tokyo or Palace Hotel Tokyo — the room is the treat", "Conrad Tokyo or The Ritz-Carlton Tokyo — one of them, and the sushi counter is still separate"]
      ),
      eat: tiers(
        ["Rice balls and coffee from the station convenience store", "Conveyor sushi or a standing sushi counter", "A ramen shop or a beef-bowl chain in the ward you booked"],
        ["A department-store food-hall lunch in the station", "Golden Gai or Omoide Yokocho — one izakaya", "A coffee-shop breakfast the morning you skip the convenience store"],
        ["Sushi Saito or a Ginza counter — only if it was booked before the flight", "A Toyosu outer-market counter if that booking exists", "The hotel breakfast buffet is a second room charge"]
      ),
      do: tiers(
        ["Sensō-ji at opening — no admission", "Yanaka or Shimokitazawa on foot", "A park picnic from the convenience store"],
        ["teamLab Planets — the timed ticket", "Suica or PASMO for JR, Metro, and most city buses", "Kamakura as a half-day. Kyoto is a different trip"],
        ["A JR Pass on a city-only week — usually a loss", "Narita Skyliner or N'EX if you did not fly Haneda", "Kyoto is a different trip"]
      ),
      tips: [
        "Hidden gem: Buy Suica or PASMO for Tokyo. A JR Pass on a city-only week is a national ticket you will not ride.",
        "Hidden gem: Haneda is the closer airport. Add the Narita Skyliner or N'EX fare before a cheaper Narita flight wins.",
        "Hidden gem: Sensō-ji at opening does not charge admission. teamLab Planets is the timed ticket. Do not buy both and a Kamakura afternoon.",
        "Book the sushi counter before you land, or eat conveyor sushi and keep the room.",
        "Yanaka or Shimokitazawa is the free afternoon. Ginza is only the counter you already booked."
      ]
    },
    cancun: {
      cta: "If the airport van is missing from the rate, stop comparing Cancún resorts. The Trip Plan is a lie until that line is in.",
      startHere: "Hyatt Ziva, Moon Palace, or a Riu — and confirm the van is inside the rate before you leave CUN. Eat on property the first night.",
      stay: tiers(
        ["Riu Cancún or Riu Palace Peninsula — garden view on purpose", "Holiday Inn Resort Cancún or an Oasis-class garden room — the rate you compared", "A downtown 3-star only if you will pay for meals the resort rate already included"],
        ["Hyatt Ziva Cancún — family all-inclusive, van in the rate or it is not this tier", "Moon Palace or Hard Rock Cancún — watch the transfer add-on", "Live Aqua or Secrets The Vine — adults-only mid"],
        ["Le Blanc Spa Resort — the Splurge all-inclusive", "Hyatt Zilara — adults-only Hotel Zone", "Nizuc or Rosewood Mayakoba — south of the Zone, a different transfer"]
      ),
      eat: tiers(
        ["The Riu or Hyatt Ziva buffet — that is what the rate bought", "Coffee on property; do not buy the same water at a dock kiosk", "Parque de las Palapas tacos only if the taxi is cheap"],
        ["The Swan at Hyatt Ziva — the on-property dinner that is not the buffet", "La Habichuela — one downtown dinner", "A beach-club lunch is a day-price, not a snack"],
        ["Le Blanc specialty dining — the reason you paid for that resort", "A Puerto Morelos dinner — a different transfer, one night", "A swim-up upgrade at the desk is a different room from the garden view you compared"]
      ),
      do: tiers(
        ["The beach in front of the resort", "The R-1 bus along the Hotel Zone", "A Hotel Zone walk at dusk, not a timeshare morning"],
        ["Isla Mujeres ferry or one cenote — one", "Visitax, about $15 a person, once per Quintana Roo visit, including children", "Chichén Itzá only as a pre-booked full day"],
        ["A whale-shark day in season — its own calendar, not an Isla afternoon", "Two resorts in one week means two transfers", "A rental parked at the resort is for the ruin day, not for Tuesday"]
      ),
      tips: [
        "Hidden gem: If the airport van is not inside the Hyatt Ziva, Moon Palace, or Riu rate, the cheaper all-inclusive is not cheaper.",
        "Hidden gem: The R-1 bus runs the Hotel Zone. Isla Mujeres, a cenote, and Chichén Itzá are three outings the R-1 does not cover. Pick one.",
        "Hidden gem: Visitax is about $15 a person once per visit, including children — not per night, and not a charge on the buffet. The Hotel Zone environmental fee is the small nightly line, about $4 a room.",
        "Garden view is the rate you compared. A swim-up at the desk is a different room.",
        "A timeshare-desk morning takes the beach day you already paid for."
      ]
    },
    oahu: {
      cta: "Stay in Waikiki, one block back, and ride TheBus. Rent the car the morning you leave for Hanauma Bay or Haleʻiwa, not before.",
      startHere: "The Equus, a Kuhio room, or the Outrigger. Rainbow Drive-In or a grocery run. Reserve Hanauma Bay or Pearl Harbor, not both.",
      stay: tiers(
        ["The Equus — Kuhio, one block back; a kitchenette beats resort breakfast", "Holiday Inn Express Waikiki or Aqua Oasis — same beach, less Kalakaua", "Hampton Inn & Suites Honolulu/Waikiki — walk to the sand"],
        ["Outrigger Waikiki or Hilton Hawaiian Village — the lagoon campus, still no car required", "Hyatt Regency Waikiki — same Waikiki block, still no car required", "Embassy Suites Waikiki Beach Walk — kitchenette if you will grocery dinner"],
        ["Halekulani — the Splurge on the sand; La Mer is one dinner", "The Royal Hawaiian — Luxury Collection, you still do not need a car for Kuhio Beach", "The Kahala or Four Seasons Ko Olina — a car becomes the default"]
      ),
      eat: tiers(
        ["Grocery the room, or Rainbow Drive-In", "L&L Hawaiian Barbecue — plate lunch", "Leonard's once, as a snack, not dinner"],
        ["Highway Inn or Helena's — one dinner", "Marukame — the udon line, not a resort café", "Poke from a market if you are already at the grocery"],
        ["La Mer or House Without a Key — the view reservation", "Alan Wong's or Senia — one night off the strip", "The Halekulani breakfast buffet is not the daily plan"]
      ),
      do: tiers(
        ["Kuhio Beach — no car", "A HOLO card on TheBus — transfer window and a day cap; cash on the bus does not work the same way", "Kapiolani Park with a grocery picnic"],
        ["Hanauma Bay if you reserved it", "Pearl Harbor if that is the timed morning instead", "Diamond Head as the other ticket, not stacked on both"],
        ["North Shore only if the car is already out — TheBus can do it, slowly, with a transfer", "A neighbor-island flight is a second airfare", "Do not park the rental in Waikiki at $40–55 on days you do not drive"]
      ),
      tips: [
        "Hidden gem: Leave the rental until the day you drive to Hanauma Bay or the North Shore. Parking it in Waikiki the other nights is about $40–55.",
        "Hidden gem: A HOLO card on TheBus includes a transfer window and a day cap. Cash fares do not. The North Shore is a transfer, not a Waikiki walk.",
        "Hidden gem: Hanauma Bay and Pearl Harbor are two timed tickets on two calendars. A flight to Maui is a third ticket, not an afternoon.",
        "Rainbow Drive-In or L&L is the plate. The resort café is the same beach at a higher check.",
        "Kahala and Ko Olina assume a car. If the bed is there, plan the drive. Do not also pay Waikiki parking for a car you left in town."
      ]
    },
    maui: {
      cta: "One coast and a kitchen in the Maui Trip Plan. Hana, the summit, and Molokini do not share a day.",
      startHere: "A Kihei condo with a kitchen — Punahoa, Kohea Kai, or Aston Maui Kamaole class. Grocery the first hour after OGG. Then the beach in front.",
      stay: tiers(
        ["Aston Maui Kamaole or a South Kihei studio — the kitchen is why this room stays cheaper", "Kohea Kai Maui — South Kihei, cook", "Holiday Inn Express Kahului — the crash pad the night you land, not the week"],
        ["Sheraton Maui or The Westin Maui — Kaanapali path; add the resort fee and parking before you compare it with Kihei", "Hyatt Regency Maui — bigger campus, same fee logic", "Marriott's Maui Ocean Club — points-friendly only if the kitchen still wins dinner"],
        ["Grand Wailea — Wailea Splurge", "Andaz Maui or Four Seasons Maui — the room is the treat, not also every boat", "The Ritz-Carlton Kapalua — a different drive; do not pretend it is Kihei"]
      ),
      eat: tiers(
        ["Grocery at the first market after OGG", "A Kihei or Paia food truck — lunch", "Cook two nights"],
        ["Kihei Caffe — one plate", "Paia Fish Market on the way back from Hana", "A Kaanapali casual the night you are already on that path"],
        ["Mama's Fish House in Paia — book it or eat elsewhere", "Spago at Four Seasons Wailea — the other big dinner, not the same night", "The Westin or Sheraton breakfast buffet is why the condo was cheaper"]
      ),
      do: tiers(
        ["Keawakapu or the beach in front of the condo", "A shore snorkel and a grocery picnic", "Watch a later morning from a lot you can enter after 7 a.m. if you do not hold a sunrise reservation"],
        ["Road to Hana as an early start, weather permitting — its own day", "Haleakalā sunrise only with the Recreation.gov reservation", "Pride of Maui or Kai Kanani only if Molokini is the booked day"],
        ["Do not stack Hana, the summit, and a boat in four days", "A second hotel so you can be closer to Mama's is a second lodging night", "Hotel Wailea still means a drive to dinner"]
      ),
      tips: [
        "Hidden gem: Haleakalā sunrise is a $1 vehicle reservation on Recreation.gov, required from 3 a.m. to 7 a.m., separate from the park entrance fee. A fee-free entrance day does not waive it. It is a middle-of-the-night departure, not a beach afternoon.",
        "Hidden gem: A Kihei kitchen at Aston Maui Kamaole or Kohea Kai is the budget. A Sheraton or Westin Kaanapali rate still owes the resort fee and parking before it beats that condo.",
        "Hidden gem: Road to Hana, Haleakalā, and a Molokini boat are three days. Paia Fish Market is the plate on the way back from Hana, not a reason to book a second hotel in Paia.",
        "Grocery the first hour after OGG. Two cooked nights change the week more than skipping the one fish dinner.",
        "Mama's Fish House or Spago is one reservation. Do not change coasts for it."
      ]
    },
    cruise: {
      cta: "Gratuities and the drink count go into the cruise Trip Plan before the brochure fare looks cheap.",
      startHere: "An interior or a balcony with port fees and gratuities already on the card. Main dining the first night. One port is a walk.",
      stay: tiers(
        ["Interior guarantee on Carnival, MSC, or Royal — you bought the itinerary, not the porthole", "Obstructed oceanview — daylight if the interior feels wrong", "A lower-deck midship interior — less motion, still Budget"],
        ["Royal Caribbean or NCL balcony — the table's balcony add is about $500 a person", "A covered balcony on a 7-night Caribbean", "An oceanview midship if the balcony jump eats the port day"],
        ["A large balcony or an aft-wrap — the cabin people remember", "NCL Haven or a Royal suite — suite gratuities are their own line", "A pre-cruise hotel, about $200 in the cruise table, when the flight can miss the ship"]
      ),
      eat: tiers(
        ["Main dining room — it is in the fare", "The buffet for lunch on a sea day", "Pay-as-you-go drinks until the break-even says otherwise"],
        ["Chops Grille or Cagney's — one specialty night, about $45 a person", "A kids' soda package only if the count wins on a short sailing", "Room service as a backup, not breakfast; the fee adds up"],
        ["A second specialty — Italian or sushi — still not every night", "A chef's table only if that booking is the Splurge", "Unlimited adult drink packages, about $54–105 a person per day by line"]
      ),
      do: tiers(
        ["A sea day on the Lido deck — already in the fare", "One independent walk in Nassau or Cozumel", "Skip the spa menu"],
        ["One ship excursion, not three pier-kiosk tours", "The drink-package break-even before you tap yes", "Ship shows — included"],
        ["A second excursion only if the line waits for you", "A spa afternoon — its own line", "Three pier tours do not fit in one port day"]
      ),
      tips: [
        "Hidden gem: Gratuities on mainstream lines bill kids age 2 and up, about $16–20 a person per day. The infant who sails free still needs documents, not a drink package.",
        "Hidden gem: Run the drink-package break-even before you tap yes. Unlimited packages in the cruise table run about $54–105 a person per day. A comped soda is not that package.",
        "Hidden gem: One night at Chops Grille or Cagney's is about $45. Main dining is already in the fare. A pier kiosk in Nassau or Cozumel is the expensive version of a walk.",
        "Add port fees, about $200 a person, before you compare two from-prices.",
        "A pre-cruise hotel is about $200 in the cruise table when the flight cannot miss the gangway."
      ]
    },
    key_west: {
      cta: "Build the Key West Trip Plan around an Old Town hotel you can walk from. Add the Dry Tortugas ferry only if that day has nothing else on it.",
      startHere: "The Big Ruby, Caribbean House, or The Gardens. Cuban Coffee Queen in the morning. Sunset from the Mallory sidewalk.",
      stay: tiers(
        ["The Big Ruby — guesthouse, walk to Duval, no car", "Caribbean House or a Truman Annex inn — quieter than the bar strip", "Hampton Inn Key West — Old Town-adjacent, still walkable"],
        ["The Gardens Hotel — courtyard inn", "Kimpton Palms Hotel — walkable boutique", "Hyatt Centric Key West — Old Town water, walk to dinner"],
        ["Casa Marina — Waldorf, beach-end Splurge; you can still walk", "Ocean Key or Pier House — the address is the premium", "Oceans Edge on Stock Island — a marina and a shuttle; the cab both ways spends a cheap rate"]
      ),
      eat: tiers(
        ["Cuban Coffee Queen or a ventanita", "Garbo's Grill or Eaton Street Seafood — lunch, not Mallory", "El Siboney — dinner off the tourist row"],
        ["Blue Heaven at opening if you want that courtyard", "Pepe's — one harbor breakfast or lunch", "Schooner Wharf fritters are a snack, not the meal"],
        ["Louie's Backyard — the waterfront table, booked", "Latitudes at Sunset Pier — the other Splurge, not the same night", "Kermit's key lime once, not as dinner"]
      ),
      do: tiers(
        ["Mallory Square from the sidewalk at sunset — free", "Duval as a street you walk, not a hotel strategy", "The Southernmost Point buoy — a photo, not a morning"],
        ["Fort Zachary Taylor — the cheap beach and fort ticket", "Hemingway Home — a timed ticket, its own hour", "A Sebago sunset sail only if the sidewalk was not enough, and not after the ferry"],
        ["Yankee Freedom to Dry Tortugas — the whole day", "A seaplane is the other way to the Tortugas, not an add-on after the ferry", "Parasail is optional; Fort Zach is the swim"]
      ),
      tips: [
        "Hidden gem: Watch sunset from the Mallory sidewalk. A pier menu and a paid sunset sail are two products for the same sky.",
        "Hidden gem: The Yankee Freedom ferry to Dry Tortugas is the whole day. It does not share an evening with a Sebago sail or a seaplane.",
        "Hidden gem: Fort Zachary Taylor is the cheap beach-and-fort ticket. The Southernmost Point buoy is a photo you can take on the walk back, not a morning you paid for.",
        "EYW air is a premium. A drive from Miami is a full day — put it on the plan as a day.",
        "Blue Heaven at opening if you want that courtyard. Otherwise El Siboney, without the wait."
      ]
    }
  };

  pack.ALL.forEach(function (g) {
    var row = L[g.id];
    var notes = R[g.id];
    if (!row || !notes) throw new Error(g.id + ": lists overlay missing");
    ["stay", "eat", "do"].forEach(function (key) {
      ["budget", "mid", "lux"].forEach(function (band) {
        if (!row[key][band] || row[key][band].length < 3) {
          throw new Error(g.id + ": thin " + key + " " + band);
        }
      });
    });
    var gems = row.tips.filter(function (t) { return /^Hidden gem:/.test(t); });
    if (row.tips.length !== 5 || gems.length !== 3) {
      throw new Error(g.id + ": tips must be 5 with exactly 3 hidden gems");
    }
    g.cta = row.cta;
    g.startHere = row.startHere;
    g.stayTiers = row.stay;
    g.eatTiers = row.eat;
    g.doTiers = row.do;
    g.tips = row.tips;
    notes.sources = (notes.sources || []).concat(EXTRA[g.id] || []);
    notes.gems = gems;
  });
})(typeof window !== "undefined" ? window : this);
