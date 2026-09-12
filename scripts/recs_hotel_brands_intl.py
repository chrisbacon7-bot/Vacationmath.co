"""International, Hawaii remaining, parks, AI, and specialty hotel rebalances."""


def b(*picks):
    return list(picks)


def band(budget, mid, lux):
    return {"budget": budget, "mid": mid, "lux": lux}


INTL = {}

# --- Hawaii remaining ---
INTL["kauai"] = band(
    b(
        "Hilton Garden Inn Kauai Wailua Bay — east-side Lean, grocery the first hour",
        "Holiday Inn Express Kauai — limited-service if leftover is tight",
        "A Kapaa 2-star or studio condo — kitchen beats resort breakfast",
        "A Poipu value condo a block off the sand",
        "Skip a North Shore rate on Lean; the drive is the hidden cost",
    ),
    b(
        "Sheraton Kauai Resort — Poipu mid, walk-to-beach",
        "Marriott’s Kaua'i Beach Club or Kauai Marriott Resort — Kalapaki mid",
        "A Kapaa 4-star if you want cheaper dinners",
        "A Poipu condo-plus — kitchen still wins some dinners",
        "One shore. North Shore mid only if leftover covers the drive",
    ),
    b(
        "Grand Hyatt Kauai Resort & Spa — Poipu Stretch",
        "1 Hotel Hanalei Bay — North Shore leftover",
        "Koa Kea Hotel & Resort — Poipu leftover if Grand Hyatt is sold",
        "One shore. Do not also book every helicopter",
        "Na Pali is a boat or a hard hike, not both",
    ),
)

INTL["hawaii_big_island"] = band(
    b(
        "Hampton Inn & Suites Kona — limited-service, grocery the first hour",
        "Holiday Inn Express Kailua-Kona — walk-adjacent Lean",
        "A Kailua-Kona 2-star or studio condo — kitchen is the Lean product",
        "A Hilo 2-star only if volcano mornings are the point",
        "Skip a Kohala resort rate on Lean",
    ),
    b(
        "Courtyard King Kamehameha's Kona Beach Hotel — Marriott, town mid",
        "Royal Kona Resort — walk-to-town mid",
        "Outrigger Kona Resort & Spa at Keauhou — south-town mid",
        "A Waikoloa condo-plus if leftover covers the Kohala drive",
        "One coast. Hilo plus Kona nightly is a transfer tax",
    ),
    b(
        "Four Seasons Resort Hualalai — Kohala leftover",
        "Mauna Lani, Auberge Resorts Collection — Stretch",
        "Fairmont Orchid — Kohala leftover",
        "The Westin Hapuna Beach Resort — Hyatt-adjacent Stretch if leftover is the beach",
        "One campus. Do not also book every helicopter and snorkel",
    ),
)

# --- Parks / specialty US ---
INTL["yellowstone"] = band(
    b(
        "Holiday Inn West Yellowstone — gateway Lean, grocery the first hour",
        "Hampton Inn West Yellowstone — limited-service if leftover covers it",
        "A Gardiner 2-star if the north gate is the plan",
        "Old Faithful Lodge cabin class if you booked early",
        "Skip a Jackson hotel as this lodging",
    ),
    b(
        "Old Faithful Inn or Lake Yellowstone Hotel — in-park mid if leftover covers it",
        "Canyon Lodge mid — in-park",
        "Best Western Desert Inn West Yellowstone — gateway mid if in-park is sold",
        "A West Yellowstone 3-star — one gate",
        "Grand Teton is a different lodging night",
    ),
    b(
        "Old Faithful Inn leftover — historic Stretch",
        "Lake Yellowstone Hotel Stretch suite",
        "One park base",
        "Do not also buy every snowcoach in summer",
        "Winter is a different product",
    ),
)

INTL["national_parks_southwest"] = band(
    b(
        "Holiday Inn Express Springdale – Zion National Park Area — if Zion is the lead",
        "Hampton Inn & Suites Springdale Zion National Park — gateway Lean",
        "A Moab motel if Arches / Canyonlands is the lead — Holiday Inn Express Moab",
        "A Kanab 2-star if you are looping",
        "Skip a Las Vegas hotel as this lodging",
    ),
    b(
        "Cable Mountain Lodge or a Springdale mid — Zion walking",
        "Hyatt Place Moab / Courtyard Moab — if Arches is the lead",
        "Best Western Plus Bryce Canyon Grand — if Bryce is the lead",
        "One gateway. Do not sleep in three towns in three nights",
        "A car is the plan",
    ),
    b(
        "Zion Lodge leftover — in-park if it exists and you booked months out",
        "Amangiri is a different budget",
        "A design desert Stretch in one gateway",
        "One base. Do not also buy every slot-canyon lottery as a sure thing",
        "Summer is brutally hot",
    ),
)

INTL["smoky_mountains"] = band(
    b(
        "Hampton Inn Gatlinburg — limited-service off the main drag",
        "Holiday Inn Express Pigeon Forge — if the shows are the point",
        "A Gatlinburg 2-star off the strip",
        "A cabin with a kitchen if the party will cook",
        "Skip a downtown balcony on Lean; October leaf weeks double rooms",
    ),
    b(
        "The Park Vista, a Tribute Portfolio Hotel — Gatlinburg 3–4 star",
        "Hilton Garden Inn Gatlinburg Downtown — mid, still a car for the park",
        "A cabin mid with a kitchen",
        "A Townsend quieter mid if leftover covers the quiet",
        "One town. Cades Cove is a morning, not a second hotel",
    ),
    b(
        "A luxury cabin leftover — one base",
        "The Park Vista Stretch suite",
        "LeConte Lodge is a hike lottery, not a Stretch button",
        "Do not also buy every show",
        "January is cheap and icy",
    ),
)

INTL["nola"] = band(
    b(
        "Hampton Inn & Suites New Orleans Convention Center — Warehouse District, streetcar",
        "Holiday Inn New Orleans – Downtown Superdome — limited-service, skip a Bourbon balcony on Lean",
        "Courtyard New Orleans Downtown/Convention Center — Marriott value",
        "HI New Orleans — hostel-plus, streetcar not a Bourbon balcony",
        "The Drifter or a Mid-City motel-plus — Canal streetcar to the Quarter",
    ),
    b(
        "New Orleans Marriott — Canal, walk or streetcar",
        "Hilton New Orleans Riverside — Convention Center mid",
        "The Westin New Orleans — Canal mid",
        "Omni Royal Orleans — Quarter if you accept the premium",
        "Hotel Peter and Paul — Marigny boutique if leftover covers the walk to dinner",
    ),
    b(
        "Windsor Court Hotel — CBD leftover",
        "The Roosevelt New Orleans, A Waldorf Astoria Hotel — Stretch",
        "Hotel Monteleone — Quarter flagship leftover",
        "Four Seasons Hotel New Orleans — leftover",
        "The trip is the food, not a second courtyard suite",
    ),
)

# --- AI / Caribbean / Mexico beaches ---
INTL["cancun"] = band(
    b(
        "Riu Cancún or Riu Palace Peninsula — Hotel Zone, walk the strip",
        "Holiday Inn Resort Cancún — Hotel Zone value, garden view on purpose",
        "Hampton Inn by Hilton Cancun Cumbres — mainland Lean only if you will eat out",
        "Oasis or Krystal Grand class — all-inclusive, no swim-up-suite upsell",
        "Downtown Cancún 3-star if you will eat out — cheaper room, you give up the AI beach",
    ),
    b(
        "Hyatt Ziva Cancún — Hotel Zone, family-friendly, real beach",
        "Marriott Cancun Resort — Hotel Zone mid, points-friendly if leftover covers a non-AI week",
        "Hilton Cancun, an All-Inclusive Resort — Hotel Zone mid",
        "Moon Palace or Hard Rock Cancún — all-inclusive, watch the transfer add-on",
        "Live Aqua or Secrets The Vine — adults-only mid if there are no kids",
    ),
    b(
        "Hyatt Zilara Cancún — adults-only Hotel Zone",
        "Le Blanc Spa Resort Cancún — Stretch only if leftover is real",
        "JW Marriott Cancun Resort & Spa — Hotel Zone leftover",
        "Nizuc or Rosewood Mayakobá — south of the Zone; a different transfer",
        "One property. Two resorts in a week is a transfer tax",
    ),
)

INTL["punta_cana"] = band(
    b(
        "Riu Republic or Riu Bávaro — all-inclusive, beach shuttle on property",
        "Holiday Inn Resort Punta Cana — Bávaro value, confirm the transfer is in the rate",
        "Bávaro Princess or Catalonia Bávaro — family value, skip Cap Cana",
        "Grand Palladium-adjacent value — garden view on purpose",
        "Skip Cap Cana on Lean; Bávaro is the value beach",
    ),
    b(
        "Hard Rock Hotel Punta Cana — family mid, huge campus",
        "Iberostar Selection Bávaro — all-inclusive, beach",
        "Westin Puntacana Resort & Club — Marriott mid if leftover covers a non-full-AI week",
        "Mid stays in Bávaro — Cap Cana and Hyatt Ziva are leftover-adjacent",
    ),
    b(
        "Excellence Punta Cana or Secrets Cap Cana — adults-only leftover",
        "Eden Roc at Cap Cana — Stretch villa class",
        "Sanctuary Cap Cana — same pocket, not a second island hop",
        "Hyatt Zilara Cap Cana — adults-only Stretch",
        "One Cap Cana or Bávaro campus. A second resort hop is a transfer tax",
    ),
)

INTL["jamaica"] = band(
    b(
        "Holiday Inn Resort Montego Bay — closer to the airport, lesser beach",
        "Riu Negril — Seven Mile Beach, value AI",
        "Riu Montego Bay class — value AI if you will not transfer to Negril",
        "Legends or a Negril 3-star walk-to-beach — skip the MoBay hotel restaurant",
        "Price the transfer as its own line; Negril is not next to the runway",
    ),
    b(
        "Hilton Rose Hall Resort & Spa — MoBay side, shorter transfer",
        "Hyatt Ziva Rose Hall — family mid",
        "Iberostar Rose Hall — all-inclusive mid",
        "Moon Palace Jamaica — all-inclusive mid",
        "Couples Swept Away or a Negril 4-star — beach, adults or family by brand",
    ),
    b(
        "Sandals South Coast or Sandals Montego Bay — couples AI leftover",
        "Hyatt Zilara Rose Hall — adults-only Stretch",
        "Round Hill Hotel and Villas — villa stretch, MoBay side",
        "Half Moon — Stretch, MoBay side",
        "Rockhouse or a Negril cliff boutique — leftover, not a fake rate",
    ),
)

INTL["cabo"] = band(
    b(
        "Holiday Inn Resort Los Cabos — Corridor value, garden view on purpose",
        "Hampton Inn by Hilton Los Cabos — San José-adjacent Lean if you will eat in town",
        "Downtown Cabo 3-star — walk to Medano",
        "A Corridor 3-star garden view — skip a sunset-cruise hotel on Lean",
        "Timeshare pitches are a half-day tax",
    ),
    b(
        "Hilton Los Cabos Beach & Golf Resort — Corridor mid",
        "Hyatt Ziva Los Cabos — family mid",
        "ME Cabo or a Medano 4-star if town walking is the point",
        "A Medano 4-star — walk-to-beach mid",
        "Adults-only mid if there are no kids — one pocket",
    ),
    b(
        "Waldorf Astoria Los Cabos Pedregal — leftover",
        "The Cape, a Thompson Hotel — Hyatt Stretch",
        "Chileno Bay Resort & Residences, Auberge — leftover",
        "One property. Do not also buy every sunset sail",
        "September is cheap and humid",
    ),
)

INTL["aruba"] = band(
    b(
        "Riu Palace Antillas-adjacent value — Palm Beach garden view",
        "Holiday Inn Resort Aruba — Palm Beach value",
        "A Palm Beach 3-star garden view — skip a timeshare pitch day",
        "Oranjestad 2-star if you will eat out",
        "Confirm the transfer",
    ),
    b(
        "Hyatt Regency Aruba Resort, Spa and Casino — Palm Beach mid",
        "Hilton Aruba Caribbean Resort & Casino — same strip",
        "Marriott's Aruba Surf Club or Aruba Marriott Resort — points mid",
        "Adults-only 4-star if there are no kids",
        "One strip. Transfer in the rate",
    ),
    b(
        "Adults-only Palm Beach leftover — Hyatt or Hilton suite jump",
        "The Ritz-Carlton, Aruba — Stretch",
        "A villa Stretch — one resort",
        "Do not also buy every sunset sail",
        "September is cheap for a reason — heat, not storms",
    ),
)

INTL["bahamas"] = band(
    b(
        "Holiday Inn Nassau — downtown value, ferry to the beaches",
        "A Cable Beach value AI — garden view on purpose",
        "Downtown Nassau 3-star — ferry to the beaches",
        "Skip Atlantis on Lean unless that is the trip",
        "Confirm the transfer",
    ),
    b(
        "Baha Mar mid class — Cable Beach",
        "Grand Hyatt Baha Mar — mid if leftover covers the campus",
        "Atlantis Coral / Royal — mid if leftover covers the water-park math",
        "Cable Beach 4-star AI — one island pocket",
        "Transfer in the rate",
    ),
    b(
        "The Coral at Atlantis suite leftover",
        "Grand Hyatt Baha Mar Stretch",
        "Rosewood Baha Mar leftover",
        "One campus. The water park is a day-price",
        "Do not also buy every excursion",
    ),
)

INTL["turks_caicos"] = band(
    b(
        "Sibonné or a Grace Bay 3-star garden view",
        "Coral Gardens class — walk to the sand",
        "A 2-star on Leeward if leftover is tight",
        "Skip a villa on Lean",
        "Confirm the transfer is in the rate",
    ),
    b(
        "The Palms Turks and Caicos or The Somerset — Grace Bay 4-star",
        "Beaches Turks & Caicos — family mid-plus",
        "Wymara Resort & Villas — Grace Bay mid",
        "A Grace Bay Club-adjacent 4-star — adults-only mid if there are no kids",
        "One beach",
    ),
    b(
        "COMO Parrot Cay leftover",
        "Amanyara Stretch",
        "Grace Bay Club leftover",
        "One island",
        "Do not also buy every excursion",
    ),
)

INTL["tulum"] = band(
    b(
        "Downtown Tulum 2-star or a hostel-plus — bike is the Lean car",
        "Aldea Zama limited-service — Holiday Inn-class if you find one",
        "A beach-road 3-star only if leftover covers the jungle tax",
        "Skip a hotel-zone timeshare day",
        "Confirm the transfer",
    ),
    b(
        "A beach-road 4-star eco mid — one property",
        "Dreams Tulum or a family AI mid if leftover covers it",
        "Aldea Zama 3–4 star if town is the point",
        "Adults-only mid if there are no kids",
        "The beach road is a transfer every dinner if you slept town",
    ),
    b(
        "Be Tulum or a beach-road Stretch leftover",
        "Azulik is a different product",
        "One property",
        "Do not also buy every cenote as a taxi loop",
        "Sargassum weeks are not a discount you want to win",
    ),
)

INTL["st_lucia"] = band(
    b(
        "A Rodney Bay 3-star garden view — value, confirm the transfer",
        "Coconut Bay or a south-island value AI if leftover is tight",
        "A Castries 2-star only the night you fly",
        "Skip a piton-view suite on Lean",
        "The transfer is a mountain line",
    ),
    b(
        "A Rodney Bay 4-star or Coconut Bay mid — one pocket",
        "A Rodney Bay 4-star — one pocket",
        "Adults-only mid if there are no kids",
        "One valley. Soufrière is a different transfer",
        "Transfer in the rate",
    ),
    b(
        "Jade Mountain leftover",
        "Sugar Beach, A Viceroy Resort — Stretch",
        "Sandals Grande St. Lucian leftover",
        "One property",
        "Do not also buy every zip-line",
    ),
)

INTL["puerto_rico"] = band(
    b(
        "Hampton Inn & Suites San Juan — Condado-adjacent Lean",
        "Holiday Inn Express San Juan Condado — limited-service, walk or a short hop to the beach",
        "A Condado 2-star a block off the sand",
        "Old San Juan guesthouse — walk the walls, louder nights",
        "Skip an Isla Verde airport hotel unless you land late",
    ),
    b(
        "San Juan Marriott Resort & Stellaris Casino — Condado mid",
        "La Concha Renaissance San Juan — Marriott, Condado walk",
        "Condado Vanderbilt Hotel — mid-plus",
        "Hyatt Place San Juan / City Center — if leftover is tight for mid",
        "One pocket. El Yunque is a morning, not a second hotel",
    ),
    b(
        "Condado Vanderbilt leftover",
        "St. Regis Bahia Beach Resort — Stretch, car assumed",
        "Dorado Beach, A Ritz-Carlton Reserve — leftover",
        "One property",
        "Do not also buy every bioluminescent-bay tour as a sure night",
    ),
)

INTL["us_virgin_islands"] = band(
    b(
        "A Charlotte Amalie 3-star or Red Hook value inn",
        "A St. John 2-star / guest house if the ferry is the plan",
        "A Cruz Bay inn — grocery the first hour",
        "Skip a villa on Lean",
        "Confirm the ferry or transfer",
    ),
    b(
        "The Westin St. John Resort Villas — mid if leftover covers St. John",
        "A Charlotte Amalie 4-star on the south shore",
        "A St. Thomas 4-star on the south shore",
        "One island. St. John plus St. Thomas nightly is a ferry tax",
        "Transfer in the rate",
    ),
    b(
        "Caneel Bay is a rebuild story — Stretch is a St. John villa leftover",
        "The Ritz-Carlton, St. Thomas — leftover",
        "One island",
        "Do not also buy every day-sail",
        "Hurricane weeks are not a discount you want to win",
    ),
)

# --- Europe cities ---
INTL["amsterdam"] = band(
    b(
        "Ibis Amsterdam Centre — tram to the canal belt, pack light",
        "Ibis Budget Amsterdam City South or Sloterdijk — tram to the center",
        "Holiday Inn Express Amsterdam – Sloterdijk — Lean if leftover is tight",
        "Generator Amsterdam or ClinkNOORD — hostel-plus, walk or ferry",
        "Hotel Not Hotel or a De Pijp 2-star — neighborhood, stairs are the elevator",
    ),
    b(
        "Amsterdam Marriott Hotel — Leidseplein-adjacent mid",
        "Hilton Amsterdam — Apollolaan, tram mid",
        "Hyatt Regency Amsterdam — mid, one neighborhood",
        "Hotel Casa Amsterdam — De Pijp boutique-adjacent 4-star",
        "A Jordaan 3–4 star — canal walk without the garden rate",
    ),
    b(
        "Waldorf Astoria Amsterdam — leftover",
        "De L’Europe Amsterdam — one flagship",
        "Conservatorium Hotel — Museumplein leftover",
        "Hotel Pulitzer, a Luxury Collection Hotel — canal houses stitched together",
        "Skip King’s Day and August if you can",
    ),
)

INTL["barcelona"] = band(
    b(
        "Ibis Barcelona Centro — Eixample, Metro downstairs",
        "Holiday Inn Express Barcelona – City 22@ — Metro, skip Las Ramblas addresses on Lean",
        "Generator Barcelona — hostel-plus, Gràcia / Gothic",
        "Hotel Jazz or a 2-star Eixample — walk to Passeig de Gràcia",
        "El Born guesthouse — restaurants on the block",
    ),
    b(
        "Hilton Diagonal Mar Barcelona — Metro mid if leftover covers the beach-edge pocket",
        "Hotel Indigo Barcelona – Plaza Catalunya — Eixample mid",
        "H10 Casa Mimosa or Cotton House — Eixample, Metro in five minutes",
        "One neighborhood — Born or Eixample, not both",
    ),
    b(
        "W Barcelona — Barceloneta beach premium",
        "Mandarin Oriental Barcelona — Passeig de Gràcia leftover",
        "Hotel Arts Barcelona — one flagship",
        "El Palace Hotel Barcelona — leftover",
        "Beach-club pricing is not in the room rate",
    ),
)

INTL["lisbon"] = band(
    b(
        "Ibis Lisboa Centro Liberdade or Ibis Styles Lisboa Centro — Metro, bakery downstairs",
        "Holiday Inn Express Lisbon – Plaza Saldanha — Lean if leftover is tight",
        "Home Lisbon Hostel or a Baixa-adjacent hostel-plus — walk to a tram",
        "The Independente or Intendente 2-star — neighborhood restaurants",
        "Alfama guesthouse — views, stairs, grocery the first morning",
    ),
    b(
        "Lisbon Marriott Hotel — mid if leftover covers the uptown pocket",
        "Hotel da Baixa or a 4-star near Rossio — trains and trams",
        "Memmo Príncipe Real or a Chiado 3–4 star — walk downhill to dinner",
        "LX Boutique or a Cais do Sodré 3-star — river, nightlife on the block",
        "One neighborhood. Do not change hills nightly",
    ),
    b(
        "Four Seasons Hotel Ritz Lisbon — park-adjacent leftover",
        "Bairro Alto Hotel — Chiado leftover",
        "Tivoli Avenida Liberdade Lisboa — one boulevard",
        "Olissippo Lapa Palace — Stretch",
        "Lisbon mid already feels like a Stretch in Paris",
    ),
)

INTL["prague"] = band(
    b(
        "Ibis Praha Wenceslas Square — Metro, skip a castle-view rate on Lean",
        "Holiday Inn Prague Congress Centre — Metro Lean",
        "Moxy Prague — Marriott compact if leftover covers a central pocket",
        "Generator Prague or a Vinohrady hostel-plus",
        "A 2-star walk-up near a tram and a bakery",
    ),
    b(
        "Hilton Prague — Karlín / river mid",
        "Prague Marriott Hotel — Old Town-adjacent mid",
        "Hotel Indigo Prague Old Town — IHG, walkable mid",
        "A Vinohrady 3–4 star — restaurants on the block",
        "One neighborhood. The castle is a morning, not a second hotel",
    ),
    b(
        "Four Seasons Hotel Prague — river leftover",
        "Augustine, a Luxury Collection Hotel — Malá Strana Stretch",
        "Mandarin Oriental, Prague — leftover",
        "One flagship",
        "Christmas weeks lift rooms",
    ),
)

INTL["dublin"] = band(
    b(
        "Ibis Dublin City Centre or Ibis Styles Dublin City Centre — walk or LUAS",
        "Holiday Inn Express Dublin City Centre — Lean, skip an airport hotel",
        "Generator Dublin — hostel-plus",
        "A Temple Bar-adjacent 2-star a block off the tourist row",
        "A Smithfield 2-star if that is the pocket",
    ),
    b(
        "The Westin Dublin — College Green mid",
        "Conrad Dublin — mid-plus",
        "Hilton Garden Inn Dublin Custom House — river mid",
        "A Georgian 3–4 star south of the Liffey",
        "One neighborhood. Rugby / concert weeks lift rooms",
    ),
    b(
        "The Merrion Hotel — leftover",
        "The Shelbourne, Autograph Collection — Stretch",
        "The Westbury — leftover",
        "One property",
        "Do not also buy every Guinness-and-castle stack",
    ),
)

INTL["edinburgh"] = band(
    b(
        "Ibis Edinburgh Centre Royal Mile – Hunter Square — walk the Mile, skip a castle-view rate on Lean",
        "Holiday Inn Express Edinburgh – Royal Mile — limited-service",
        "Premier Inn Edinburgh Central — Lean compact",
        "A hostel-plus on the Cowgate or Leith Walk",
        "A Leith 2-star if that is the restaurant pocket",
    ),
    b(
        "The Balmoral — mid-plus if leftover covers it; otherwise a New Town 4-star",
        "Waldorf Astoria Edinburgh - The Caledonian — mid-plus",
        "Kimpton Charlotte Square — New Town mid",
        "A Grassmarket or New Town 3–4 star — one pocket",
        "Festival weeks are not the value window",
    ),
    b(
        "The Balmoral leftover",
        "Waldorf Astoria Edinburgh - The Caledonian Stretch suite",
        "Gleneagles is a different trip",
        "One property",
        "August Festival is a crowd tax",
    ),
)

INTL["florence"] = band(
    b(
        "Ibis Firenze Centro or Ibis Styles Firenze — walk or bus, pack light",
        "A Santa Croce or San Lorenzo 2-star — bakery downstairs",
        "A hostel-plus near Santa Maria Novella if you arrive by train",
        "Skip an airport hotel as this lodging",
        "Hotel Indigo Florence is mid; Lean stays Ibis or a walk-up",
    ),
    b(
        "Hotel Indigo Florence — IHG, walkable mid",
        "Hilton Garden Inn Florence Novoli — only if leftover is tight; centro is the walk",
        "NH Collection Firenze Palazzo Gaddi — centro mid",
        "A Oltrarno 3–4 star — one neighborhood",
        "The Duomo is a morning, not a hotel address tax",
    ),
    b(
        "Four Seasons Hotel Firenze — leftover",
        "Portrait Firenze — Stretch",
        "Hotel Savoy, a Rocco Forte Hotel — leftover",
        "One property",
        "Do not also buy every skip-the-line as a sure interior",
    ),
)

INTL["amalfi"] = band(
    b(
        "Ibis Styles Sorrento if you base in Sorrento — stairs, pack light",
        "A Centro 2-star in Amalfi or Maiori — ferry or bus, not a car habit",
        "A Sorrento 3-star a block off the corso — stairs, pack light",
        "A Positano 2-star only if leftover is real; stairs are the elevator",
        "Skip a cliff suite on Lean",
    ),
    b(
        "Hilton Sorrento Palace — Sorrento mid, bus or ferry to Amalfi towns",
        "NH Collection Grand Hotel Convento di Amalfi — mid-plus",
        "A Positano 3–4 star if that village is the point",
        "One town. Amalfi plus Positano plus Ravello nightly is three parking lots",
        "The ferry is the plan in season",
    ),
    b(
        "Hotel Santa Caterina — Amalfi leftover",
        "Le Sirenuse — Positano Stretch",
        "Belmond Hotel Caruso — Ravello leftover",
        "One village",
        "July–August is a crowd tax",
    ),
)

INTL["greece_athens"] = band(
    b(
        "Ibis Styles Athens and Ibis Budget Athens — Metro, skip a Plaka tourist-menu hotel",
        "An airport hotel only the night you fly — then own a Metro neighborhood",
        "A Koukaki 2-star — walk to the Acropolis Museum",
        "A hostel-plus in Psyri or Monastiraki",
        "Islands are a different lodging night",
    ),
    b(
        "Athens Marriott Hotel — mid if leftover covers the uptown pocket",
        "A Plaka-adjacent 3–4 star — walk to the museum",
        "A Syntagma 4-star — one neighborhood",
        "A Koukaki boutique — walk to the museum",
        "One neighborhood",
    ),
    b(
        "Hotel Grande Bretagne, a Luxury Collection Hotel — Syntagma leftover",
        "Hotel King George, a Luxury Collection Hotel — Stretch",
        "Four Seasons Astir Palace — coast leftover, a different commute",
        "One property",
        "Do not also buy every island hop as a sure day trip",
    ),
)

INTL["santorini"] = band(
    b(
        "A Fira 2-star a block off the caldera edge — Lean, pack light",
        "A Perissa or Kamari 2-star on the bus grid — beach Lean",
        "Skip a cave suite on Lean",
        "Confirm the transfer from the port or airport",
        "Oia is mid-plus",
    ),
    b(
        "A Fira 3–4 star — walk to the bus, one village",
        "A Kamari 4-star if the beach is the point",
        "Mid stays off the first caldera row — Canaves is leftover",
        "One village. Fira plus Oia nightly is a transfer",
        "Ferry days need slack",
    ),
    b(
        "Canaves Oia leftover",
        "Mystique, a Luxury Collection Hotel — Stretch",
        "Grace Hotel Santorini, Auberge — leftover",
        "One village",
        "August is a crowd tax",
    ),
)

INTL["copenhagen"] = band(
    b(
        "Ibis Copenhagen City or Ibis Styles Copenhagen — Metro, bakery downstairs",
        "Wakeup Copenhagen — compact Lean",
        "Generator Copenhagen — hostel-plus",
        "A Nørrebro 2-star if that is the restaurant pocket",
        "Skip an airport hotel as this lodging",
    ),
    b(
        "Copenhagen Marriott Hotel — harbor mid",
        "Hilton Copenhagen Airport is a transfer; mid in-town is NH Collection Copenhagen",
        "NH Collection Copenhagen — mid",
        "A Vesterbro 3–4 star — one neighborhood",
        "July is peak and bright",
    ),
    b(
        "Hotel d'Angleterre — leftover",
        "Nimb Hotel — Stretch",
        "Villa Copenhagen — leftover",
        "One property",
        "Christmas weeks lift rooms",
    ),
)

INTL["vienna"] = band(
    b(
        "Ibis Wien Mariahilf or Ibis Styles Wien City — U-Bahn, bakery downstairs",
        "Holiday Inn Express Vienna – Schönbrunn — Lean if leftover is tight",
        "A Neubau or Mariahilf 2-star — walk to a market street",
        "A hostel-plus near the Westbahnhof",
        "Skip an airport hotel as this lodging",
    ),
    b(
        "Vienna Marriott Hotel — Ring mid",
        "Hilton Vienna Park — Stadtpark mid",
        "Hotel Indigo Vienna – Naschmarkt — IHG, walkable mid",
        "A 7th-district 3–4 star — one neighborhood",
        "The Ring is a walk, not a hotel-address tax every night",
    ),
    b(
        "Hotel Sacher Wien — leftover",
        "The Ritz-Carlton, Vienna — Stretch",
        "Park Hyatt Vienna — leftover",
        "One property",
        "Ball season and Christmas weeks lift rooms",
    ),
)

INTL["stockholm"] = band(
    b(
        "Ibis Styles Stockholm Odenplan or Ibis Stockholm Solna — T-bana",
        "Generator Stockholm — hostel-plus",
        "A Södermalm 2-star if that is the restaurant pocket",
        "A compact Norrmalm 2-star — grocery nearby",
        "Skip an Arlanda hotel as this lodging",
    ),
    b(
        "Stockholm Marriott Hotel — mid",
        "Hilton Stockholm Slussen — Södermalm mid",
        "Hotel At Six or a Norrmalm 4-star",
        "A Södermalm 3–4 star — one island",
        "Do not hop Gamla Stan addresses nightly",
    ),
    b(
        "Grand Hôtel Stockholm — leftover",
        "Ett Hem — Stretch",
        "Nobis Hotel Stockholm — leftover",
        "One property",
        "Midsummer weeks are a plan, not a discount",
    ),
)

INTL["budapest"] = band(
    b(
        "Ibis Budapest City or Ibis Styles Budapest City — Metro, skip a castle-view rate on Lean",
        "Holiday Inn Budapest – Budaörs is a commute; Lean is a District VII 2-star",
        "A Jewish Quarter 2-star — walk to dinner",
        "A hostel-plus near the Astoria Metro",
        "Pest walking beats a Buda hill taxi habit",
    ),
    b(
        "Budapest Marriott Hotel — Danube mid",
        "Hilton Budapest — Castle Hill mid-plus if leftover covers the hill",
        "A District V 3–4 star — one neighborhood",
        "A ruin-bar-adjacent 4-star in VII",
        "The baths are a ticket, not a hotel requirement",
    ),
    b(
        "Four Seasons Hotel Gresham Palace — leftover",
        "The Ritz-Carlton, Budapest — Stretch",
        "Aria Hotel Budapest, a Tribute Portfolio Hotel — leftover",
        "One property",
        "Christmas weeks lift rooms",
    ),
)

INTL["iceland"] = band(
    b(
        "Kex Hostel or Loft — 101 Reykjavík, walk to the pool",
        "A 101 guesthouse with a kitchenette — breakfast is Bónus, not the buffet",
        "Keflavík Airport Hotel — only the night you land or fly",
        "A compact 101 2-star — walk to the pool",
        "The Ring Road is a different trip and budget",
    ),
    b(
        "Canopy by Hilton Reykjavik City Centre — 101 mid",
        "Reykjavik Konsulat Hotel, Curio Collection — Hilton mid",
        "Hotel Borg — 101, walk downtown",
        "ION City or a harbor 4-star — still not the Blue Lagoon hotel",
        "Selfoss or Vík mid only if this is a road trip",
    ),
    b(
        "The Reykjavik EDITION — 101 leftover",
        "The Retreat at Blue Lagoon — soak + room, Stretch only",
        "ION Adventure Hotel — Golden Circle leftover",
        "One 101 flagship or one countryside lodge — not both in 4 nights",
        "Luxury here is the soak, not the minibar",
    ),
)

INTL["switzerland"] = band(
    b(
        "Ibis Zürich City West or Ibis Budget Genève — train downstairs",
        "Holiday Inn Express Zürich – Airport is a transfer; Lean is a city 2-star near the HB",
        "A hostel-plus near the Hauptbahnhof",
        "A 2-star in the neighborhood you will eat in",
        "Long-haul is the expensive line, not a palace breakfast",
    ),
    b(
        "Zürich Marriott Hotel — mid",
        "Hilton Zurich Airport is a transfer; mid in-town is a 4-star near the lake or HB",
        "A lake-adjacent 4-star — one city; Alps lodges are a different night",
        "A Geneva 4-star near Cornavin if Geneva is the base",
        "One city. Alps lodges are a different night",
    ),
    b(
        "Baur au Lac leftover",
        "The Dolder Grand — Stretch",
        "Four Seasons Hotel des Bergues Geneva — leftover if Geneva is the base",
        "One property",
        "Do not also buy every mountain add-on",
    ),
)

INTL["croatia"] = band(
    b(
        "A Split or Dubrovnik 2-star off the wall — pack light",
        "A Split Old Town-adjacent 2-star — walk, pack light",
        "A Dubrovnik Lapad 2-star — bus to the walls",
        "Skip a wall-view suite on Lean",
        "Islands are a ferry night",
    ),
    b(
        "Hilton Imperial Dubrovnik — mid if Dubrovnik is the base",
        "Hotel Excelsior Dubrovnik — mid-plus",
        "A Split 3–4 star near the Riva",
        "One city. Split plus Dubrovnik nightly is a transfer day",
        "Cruise mornings crowd the walls",
    ),
    b(
        "Villa Dubrovnik leftover",
        "Hotel Bellevue Dubrovnik — Stretch",
        "One property",
        "Do not also buy every island hop",
        "July–August is a crowd tax",
    ),
)

INTL["spain_seville"] = band(
    b(
        "Ibis Sevilla or Ibis Budget Sevilla — tram / bus, bakery downstairs",
        "Holiday Inn Express Sevilla – Aljarafe is a commute; Lean is a Centro 2-star",
        "A Santa Cruz-adjacent 2-star a block off the postcard alleys",
        "A hostel-plus near Plaza de Armas",
        "Skip a cathedral-view rate on Lean",
    ),
    b(
        "Hotel Indigo Seville – Historic Quarter — walkable mid",
        "NH Collection Sevilla — mid",
        "A Triana 3–4 star — one neighborhood",
        "The Alcázar is a timed morning, not a hotel address",
    ),
    b(
        "Hotel Alfonso XIII, a Luxury Collection Hotel — leftover",
        "Hotel Palacio Villapanés — Stretch",
        "One property",
        "Feria and Easter weeks are a crowd tax",
        "July is cheap and brutal",
    ),
)

INTL["portugal_porto"] = band(
    b(
        "Ibis Porto Centro São Bento or Ibis Porto São João — Metro / train",
        "InterContinental Porto – Palacio das Cardosas — mid-plus; Lean stays Ibis",
        "A Cedofeita 2-star — restaurants on the block",
        "A hostel-plus near São Bento",
        "Hills + cobbles; pack light",
    ),
    b(
        "A Ribeira 3–4 star or Hotel Infante Sagres-adjacent — walk downhill to dinner",
        "A Baixa / Aliados 4-star — walk downhill to dinner",
        "A Gaia 3–4 star if the caves are the point",
        "One bank of the river at night",
        "Lisbon is a different lodging night",
    ),
    b(
        "The Yeatman leftover",
        "Pestana Palácio do Freixo — Stretch",
        "One property",
        "Do not also buy every cave tasting as a taxi loop",
        "São João weeks lift rooms",
    ),
)

INTL["portugal_algarve"] = band(
    b(
        "Holiday Inn Algarve – Monte Gordo-class or an Albufeira 2-star off the strip",
        "A Lagos 2-star — walk to a grocery",
        "A Tavira 2-star if the east is the point",
        "Skip a cliff suite on Lean",
        "A car helps; the train is slower and cheaper",
    ),
    b(
        "Tivoli or a Vilamoura 4-star — mid if leftover covers the marina pocket",
        "A Lagos 3–4 star — one town",
        "A Albufeira 4-star off the first strip",
        "One town. Sagres plus Tavira nightly is a transfer",
        "July–August is peak",
    ),
    b(
        "Vila Vita Parc leftover",
        "Conrad Algarve — Stretch",
        "One property",
        "Do not also buy every boat cave as a sure day",
        "Winter is cheap because the water is a walk, not a swim",
    ),
)

INTL["norway_fjords"] = band(
    b(
        "Ibis Bergen or a Bergen 2-star near the station — Lean before the fjord hop",
        "A Flåm or Aurland 2-star if the train is the point",
        "A hostel-plus in Bergen",
        "Skip a fjord-view suite on Lean",
        "The boat is the lodging plan some nights",
    ),
    b(
        "A Bergen 3–4 star — one night, then one fjord base",
        "A Flåm mid lodge",
        "A Balestrand or Loen 3–4 star if leftover covers that pocket",
        "One fjord base. Do not hop every village nightly",
        "July is bright and peak",
    ),
    b(
        "Hotel Ullensvang leftover",
        "A Loen or Geiranger Stretch lodge",
        "One property per base",
        "Do not also buy every scenic rail as a sure connection",
        "Shoulder weeks win",
    ),
)

# --- Asia / Oceania / Africa / ME / Latam ---
INTL["mexico_city"] = band(
    b(
        "Ibis Mexico City Reforma or Ibis Budget Mexico City Reforma — Metro, skip a Polanco rate on Lean",
        "Holiday Inn Express Mexico City – Reforma — limited-service",
        "Casa Decu or a Roma Norte guesthouse — walk to cafés",
        "Hostal Regina or a Centro hostel-plus — Zócalo walking, noisier nights",
        "Condesa 2-star — park walks, street food on the block",
    ),
    b(
        "Mexico City Marriott Reforma Hotel — Reforma mid",
        "Hilton Mexico City Reforma — walkable spine",
        "The Westin Santa Fe Mexico City is a commute; mid is Camino Real Polanco or The Hoxton Roma",
        "The Hoxton Roma — walkable Roma boutique",
        "One neighborhood — CDMX traffic is the hidden cost",
    ),
    b(
        "Four Seasons Hotel Mexico City — Reforma leftover",
        "The St. Regis Mexico City — leftover",
        "Las Alcobas, a Luxury Collection Hotel — Polanco Stretch",
        "Casa Polanco — design leftover",
        "The reservation is often the better splurge than a second tower",
    ),
)

INTL["thailand"] = band(
    b(
        "Ibis Bangkok Sukhumvit 4 or Ibis Styles Bangkok Sukhumvit Phra Khanong — BTS, not a taxi habit",
        "Holiday Inn Express Bangkok Siam — limited-service, BTS",
        "A Khao San-adjacent guesthouse only as a crash pad",
        "Lub d or a hostel-plus in Silom / Chiang Mai old city — walk to food stalls",
        "Fan room + a stall downstairs is the Lean product",
    ),
    b(
        "Bangkok Marriott Marquis Queen's Park — Sukhumvit mid, BTS",
        "Hilton Sukhumvit Bangkok — Asok mid",
        "Hyatt Place Bangkok Sukhumvit — mid",
        "Shangri-La Bangkok — riverside mid-plus, river boat to dinner",
        "One city base — Bangkok or Chiang Mai, not a nightly hop",
    ),
    b(
        "Mandarin Oriental, Bangkok — river leftover",
        "Capella Bangkok — same river, Stretch",
        "Park Hyatt Bangkok — leftover",
        "Four Seasons Chiang Mai if the north is the point — do not also buy Phuket mid-trip",
        "One river hotel. Three island hops are a different budget",
    ),
)

INTL["kyoto"] = band(
    b(
        "Ibis Styles Kyoto Station — station downstairs, convenience-store breakfast",
        "Toyoko Inn Kyoto Gojo or APA Kyoto Ekimae — business-hotel Lean",
        "A hostel-plus in Kawaramachi or near Kyoto Station",
        "A guesthouse in the neighborhood you will walk at night",
        "Skip a ryokan rate on Lean; that is mid-plus",
    ),
    b(
        "Hilton Garden Inn Kyoto Shijo Karasuma — mid, subway",
        "Hotel Granvia Kyoto — station mid",
        "Hyatt Place Kyoto — mid",
        "Mitsui Garden Kyoto Sanjo — Japanese 4-star, one pocket",
        "A ryokan mid only if leftover covers it — then that is the product",
    ),
    b(
        "Four Seasons Hotel Kyoto — leftover",
        "The Ritz-Carlton, Kyoto — Stretch",
        "Park Hyatt Kyoto — leftover",
        "Hoshinoya Kyoto — river Stretch",
        "The room or the kaiseki, rarely both plus every temple taxi",
    ),
)

INTL["singapore"] = band(
    b(
        "Ibis Singapore on Bencoolen or Ibis Budget Singapore Crystal — MRT",
        "Holiday Inn Express Singapore Clarke Quay — limited-service",
        "Moxy Singapore Clarke Quay — Marriott compact",
        "A hostel-plus in Bugis or Chinatown",
        "Skip an Orchard palace on Lean",
    ),
    b(
        "Hilton Singapore Orchard — mid, MRT",
        "Singapore Marriott Tang Plaza Hotel — Orchard mid",
        "Hotel Indigo Singapore Katong — neighborhood mid",
        "One pocket. Sentosa is a different night if you split",
    ),
    b(
        "Marina Bay Sands leftover",
        "Raffles Singapore — Stretch",
        "The Fullerton Hotel Singapore — leftover",
        "Capella Singapore — Sentosa Stretch",
        "One property. Do not also buy every observation deck",
    ),
)

INTL["south_korea"] = band(
    b(
        "Ibis Styles Ambassador Seoul Myeongdong or Ibis Budget Seoul Dongdaemun — subway",
        "Holiday Inn Express Seoul Hongdae — if that is the night you came for",
        "A hostel-plus in Hongdae or Jongno",
        "A compact Myeongdong 2-star — grocery in the block",
        "Skip a palace-view rate on Lean",
    ),
    b(
        "Hilton Garden Inn Seoul/Gangnam — mid, subway",
        "Hotel Indigo Seoul Gangnam — IHG mid",
        "A Jongno 4-star — one neighborhood",
        "One pocket. Busan is a different lodging night",
    ),
    b(
        "Four Seasons Hotel Seoul — leftover",
        "Park Hyatt Seoul — Stretch",
        "The Shilla Seoul — leftover",
        "A hanok Stretch if that is the point",
        "The room or the BBQ, rarely both plus every palace as a sure interior",
    ),
)

INTL["taiwan"] = band(
    b(
        "Ibis Taipei Daan or Ibis Styles Taipei Station — MRT",
        "Holiday Inn Express Taipei Zhonghua — limited-service",
        "A hostel-plus in Ximending",
        "A compact Taipei 2-star near a night market",
        "Skip a Tamsui rate on Lean unless that is the pocket",
    ),
    b(
        "Taipei Marriott Hotel — mid",
        "Hilton Taipei Sinban is New Taipei; mid in-town is Humble House or a Xinyi 4-star",
        "A Xinyi 4-star — MRT, one pocket",
        "A Daan 3–4 star — restaurants on the block",
        "Kaohsiung is a different lodging night",
    ),
    b(
        "Mandarin Oriental, Taipei — leftover",
        "W Taipei — Stretch",
        "Grand Hyatt Taipei — leftover",
        "One property",
        "Do not also buy every day-trip as a sure connection",
    ),
)

INTL["vietnam"] = band(
    b(
        "Ibis Saigon Airport is a transfer; Lean is a District 1 2-star or Hanoi Old Quarter guesthouse",
        "Holiday Inn & Suites Saigon Airport — only the night you fly",
        "A Hanoi Old Quarter hostel-plus — walk to food stalls",
        "A Hoi An Old Town 2-star if the center is the trip",
        "One city base — Hanoi or Saigon, not a nightly hop",
    ),
    b(
        "Hotel des Arts Saigon, MGallery — mid-plus",
        "A District 1 4-star near a Metro / Grab zone",
        "A Hoi An 3–4 star inside or just off the Old Town",
        "One city, then a separate night if you add Ha Long",
        "Grab is cheap; tourist-taxi menus are not",
    ),
    b(
        "Park Hyatt Saigon leftover",
        "Capella Hanoi leftover",
        "Four Seasons The Nam Hai — Hoi An Stretch",
        "One property per base",
        "Do not also buy every lantern-boat as a sure night",
    ),
)

INTL["australia"] = band(
    b(
        "Ibis Sydney World Square or Ibis Budget Sydney Airport — train, skip a Harbour-view rate on Lean",
        "Holiday Inn Express Sydney Macquarie Park is a commute; Lean is a Surry Hills or Haymarket 2-star",
        "YHA Sydney Harbour or a hostel-plus near a station",
        "A Melbourne hostel-plus on a tram if Melbourne is the base",
        "Long-haul is the expensive line, not the room",
    ),
    b(
        "Sydney Harbour Marriott Hotel at Circular Quay — mid",
        "Hilton Sydney — mid",
        "Hyatt Regency Sydney — Darling Harbour mid",
        "A Melbourne 4-star on a tram if that city is the base",
        "One city, then a separate island or alps budget if you split",
    ),
    b(
        "Park Hyatt Sydney leftover",
        "Four Seasons Hotel Sydney — Stretch",
        "Crown Towers Melbourne leftover if Melbourne is the base",
        "One property",
        "Do not stack every harbour cruise and every zoo",
    ),
)

INTL["new_zealand"] = band(
    b(
        "Ibis Wellington or Ibis Budget Auckland Airport — train / bus, skip a lakefront rate on Lean",
        "Crowne Plaza Auckland — IHG if leftover covers a CBD Lean-plus night",
        "A Wellington 2-star on the waterfront bus",
        "A Queenstown hostel-plus if the south is the point",
        "Long-haul is the expensive line",
    ),
    b(
        "Cordis Auckland or a CBD 4-star — mid",
        "QT Wellington or a waterfront 4-star",
        "A Queenstown 3–4 star if leftover covers the south",
        "One city, then a separate south-island budget",
        "Campervan only if that is the trip — it replaces the hotel line",
    ),
    b(
        "Hotel Britomart leftover",
        "Eichardt's Private Hotel — Queenstown Stretch",
        "One property per island base",
        "Do not also buy every adventure add-on",
        "Shoulder weeks win",
    ),
)

INTL["dubai"] = band(
    b(
        "Ibis Dubai Al Rigga or Ibis One Central — Metro, skip a Marina address on Lean",
        "Rove Downtown or Rove City Walk — Lean-plus, Metro",
        "Holiday Inn Express Dubai – Safa Park — limited-service, Metro-adjacent",
        "Deira 3-star near a Metro — creek, cheaper nights",
        "Bur Dubai heritage-adjacent 3-star — walk the souk, Metro to Downtown",
    ),
    b(
        "A Downtown 4-star near Burj Khalifa — Metro, not a taxi habit",
        "Hilton Dubai Al Habtoor City — mid, tram / Metro",
        "Hyatt Regency Dubai Creek Heights — mid",
        "Marina 4-star on the tram — walk the walkway",
        "Palm or Downtown — pick one pocket",
    ),
    b(
        "Armani Hotel Dubai — Burj Khalifa leftover",
        "Atlantis The Palm — Palm Stretch, kids assumed",
        "Bulgari Resort Dubai leftover",
        "Burj Al Arab or One&Only — name-brand leftover only",
        "Dubai luxury is a weekend, not a week",
    ),
)

INTL["bali"] = band(
    b(
        "Ibis Bali Kuta or Ibis Styles Bali Benoa — crash-pad near the airport or a Kuta 2-star",
        "A Canggu homestay — walk to a warung, scooter for the beach",
        "An Ubud jungle guesthouse — rice-terrace walk, not Seminyak prices",
        "Kuta 2-star only as a crash pad near the airport",
        "Scooter math is real — insure it",
    ),
    b(
        "Marriott's Bali Nusa Dua Gardens or Westin Resort Nusa Dua — mid campus if leftover covers the south",
        "Hyatt Regency Bali — Sanur mid",
        "A Seminyak boutique if the beach clubs are the point",
        "Maya Ubud or a riverside 4-star — one base",
        "One base — Ubud or the coast",
    ),
    b(
        "Four Seasons Resort Bali at Sayan leftover",
        "Capella Ubud — Stretch",
        "Bulgari Resort Bali — cliff leftover",
        "Mandapa, a Ritz-Carlton Reserve — leftover",
        "One villa. Three mediocre resorts is not Stretch",
    ),
)

INTL["alaska_cruise"] = band(
    b(
        "Interior guarantee — Holland America or Princess, you picked the itinerary not the porthole",
        "Lower-deck interior midship — less motion if you chose the cheap cabin on purpose",
        "A pre-cruise Hampton Inn or Holiday Inn Express near the Seattle or Vancouver dock — one night only",
        "Skip a suite upsell at check-in; the cabin is not the leak",
        "You bought daylight and a deck, not a hotel",
    ),
    b(
        "Oceanview or balcony midship — Princess, Holland America, or Royal, Central-ship beats a cheap aft if you get seasick",
        "Covered balcony on a 7-night — sit outside without paying suite gratuities",
        "A pre-cruise Seattle Marriott Waterfront or Vancouver downtown 4-star — one night",
        "One cabin category. A second ship hop is not this trip",
        "Port days are the product",
    ),
    b(
        "Large balcony or aft-wrap leftover — the wake is the product",
        "Haven / suite-adjacent on the line you already chose — suite gratuities run higher",
        "A pre-cruise Fairmont or Four Seasons night in Vancouver leftover-only",
        "Spa-deck cabin — quieter, still not a fare quote",
        "Do not also buy every glacier flightsee as a sure day",
    ),
)

INTL["costa_rica"] = band(
    b(
        "Holiday Inn Express San José Airport — only the night you fly",
        "A La Fortuna 2-star / hostel-plus — walk to town",
        "A Manuel Antonio 2-star off the hill",
        "Skip a volcano-view suite on Lean",
        "A car is optional if you buy transfers",
    ),
    b(
        "An Arenal 3–4 star with a hot-spring hour included or cheap",
        "A Manuel Antonio 3–4 star walk-to-town",
        "Adults-only mid if there are no kids",
        "One volcano base, one beach base — transfer is a line",
    ),
    b(
        "Nayara Tented Camp or Nayara Springs leftover",
        "Four Seasons Resort Costa Rica at Peninsula Papagayo — Stretch",
        "Andaz Costa Rica Resort at Peninsula Papagayo — Hyatt leftover",
        "One property per base",
        "Do not also buy every zip-line",
    ),
)

INTL["belize"] = band(
    b(
        "Best Western Plus Belize Biltmore Plaza — Belize City Lean only the night you fly",
        "A San Pedro 2-star a block off the sand — golf cart, not a water-taxi habit every meal",
        "A Caye Caulker hostel-plus — Lean island",
        "Skip a villa on Lean",
        "Confirm the water taxi",
    ),
    b(
        "An Ambergris 3–4 star — walk-to-town, one island",
        "A Hopkins 3–4 star if the south is the point",
        "Adults-only mid if there are no kids",
        "The reef is a boat day, not a second hotel",
    ),
    b(
        "Victoria House leftover",
        "Itz'ana or a Placencia Stretch",
        "One island or one coast",
        "Do not also buy every atoll as a sure day",
        "Hurricane weeks are not a discount you want to win",
    ),
)

INTL["guatemala"] = band(
    b(
        "A Antigua 2-star or guesthouse — walk the cobbles, pack light",
        "A Lake Atitlán 2-star in the town you will eat in",
        "A Guatemala City 2-star only the night you fly",
        "Skip a lake-view suite on Lean",
        "Altitude is real",
    ),
    b(
        "Hotel Museo Casa Santo Domingo — Antigua mid",
        "A Lake Atitlán 3–4 star in one village",
        "Porta Hotel Antigua or a centro 4-star",
        "One town. Antigua plus the lake nightly is a transfer",
        "Trusted shuttles beat a rental in the core",
    ),
    b(
        "A Lake Atitlán Stretch lodge — one village leftover",
        "An Antigua courtyard leftover",
        "One property per base",
        "Do not also buy every volcano as a sure sunrise",
    ),
)

INTL["peru"] = band(
    b(
        "Ibis Cusco or a San Blas 2-star — walk, pack light, altitude slack",
        "A Cusco hostel-plus near Plaza de Armas a block off the postcard row",
        "A Lima Miraflores 2-star if you overnight the coast",
        "Skip a Sacred Valley suite on Lean",
        "Aguas Calientes 2-star the night before Machu Picchu",
    ),
    b(
        "Hilton Garden Inn Cusco — mid, walkable",
        "A San Blas 3–4 star — walkable Cusco mid",
        "A Sacred Valley 3–4 star if leftover covers that base",
        "A Miraflores 4-star if Lima is a real night",
        "One altitude base. Do not hop valley plus Cusco nightly",
    ),
    b(
        "Belmond Hotel Monasterio leftover",
        "Belmond Sanctuary Lodge — Machu Picchu Stretch",
        "Palacio del Inka, a Luxury Collection Hotel — Cusco leftover",
        "One property per altitude",
        "The ruin is the product, not a second suite",
    ),
)

INTL["peru_lima"] = band(
    b(
        "Ibis Lima Reducto Miraflores — walk or a short hop to the malecón",
        "Holiday Inn Lima Airport — only the night you fly",
        "A Miraflores 2-star — grocery nearby",
        "A Barranco hostel-plus if that is the restaurant pocket",
        "Skip a cliff-view suite on Lean",
    ),
    b(
        "Hilton Lima Miraflores — mid, malecón walking",
        "A Miraflores 4-star — one pocket",
        "A Barranco 3–4 star if leftover covers that night",
        "Mid stays a block off the first cliff row — JW is leftover",
        "Cusco is a different lodging night and a different altitude",
    ),
    b(
        "JW Marriott Hotel Lima leftover",
        "Hotel B — Barranco Stretch",
        "Belmond Miraflores Park leftover",
        "One pocket",
        "The tasting menu is often the better Stretch",
    ),
)

INTL["buenos_aires"] = band(
    b(
        "Ibis Buenos Aires Congreso or Ibis Budget Recoleta — Subte, bakery downstairs",
        "Holiday Inn Buenos Aires Ezeiza Airport — only the night you fly",
        "A Palermo 2-star if that is the restaurant pocket",
        "A San Telmo hostel-plus — walk the Sunday fair",
        "Skip a Recoleta palace on Lean",
    ),
    b(
        "Hilton Buenos Aires — Puerto Madero mid",
        "Hotel Indigo Buenos Aires — mid",
        "A Palermo 3–4 star — one neighborhood",
        "A Recoleta 4-star if leftover covers that pocket",
        "One barrio. Do not hop Palermo and San Telmo nightly",
    ),
    b(
        "Four Seasons Hotel Buenos Aires leftover",
        "Palacio Duhau - Park Hyatt Buenos Aires — Stretch",
        "Alvear Palace Hotel leftover",
        "One property",
        "The steakhouse is often the better Stretch than a second suite",
    ),
)

INTL["colombia"] = band(
    b(
        "Ibis Cartagena Marbella or a Getsemaní 2-star — walk the walls, pack light",
        "A Centro hostel-plus — louder nights",
        "A Bocagrande 2-star if leftover is tight",
        "Skip a walled-city palace on Lean",
        "Confirm the transfer from the airport",
    ),
    b(
        "Hilton Cartagena — Bocagrande mid",
        "Movich Cartagena de Indias or a Centro 4-star",
        "A Getsemaní 3–4 star — restaurants on the block",
        "One pocket. The islands are a boat day",
        "Humidity is free; a taxi loop is not",
    ),
    b(
        "Sofitel Legend Santa Clara leftover",
        "Casa San Agustín Stretch",
        "One property",
        "Do not also buy every Rosario island as a sure day",
        "New Year weeks lift rooms",
    ),
)

INTL["colombia_medellin"] = band(
    b(
        "Ibis Medellín or a Poblado 2-star — Metro, skip El Poblado palace on Lean",
        "A Laureles 2-star if that is the restaurant pocket",
        "A hostel-plus near a Metro stop",
        "Altitude slack is an activity",
        "Comuna 13 is a morning, not a hotel address",
    ),
    b(
        "A Poblado 3–4 star or Click Clack — one neighborhood",
        "A Laureles 4-star if leftover covers that pocket",
        "One barrio. Guatapé is a day trip",
        "Metro / taxi beats a rental in the core",
    ),
    b(
        "The Charlee leftover",
        "A Poblado Stretch boutique",
        "One property",
        "Do not also buy every coffee tour as a sure day",
        "The tasting menu is often the better Stretch",
    ),
)

INTL["colombia_bogota"] = band(
    b(
        "Ibis Bogotá Museo or a Candelaria-adjacent 2-star — walk, altitude slack",
        "Holiday Inn Bogotá Airport — only the night you fly",
        "A Chapinero 2-star if that is the restaurant pocket",
        "A hostel-plus near a TransMilenio stop",
        "Skip a Zona G palace on Lean",
    ),
    b(
        "Bogota Marriott Hotel — mid",
        "Hilton Bogotá — mid",
        "A Zona G / Zona T 3–4 star — one pocket",
        "A Candelaria 4-star only if leftover covers the tourist-row tax",
        "One neighborhood. Monserrate is a morning",
    ),
    b(
        "Four Seasons Hotel Casa Medina Bogotá leftover",
        "Sofitel Bogotá Victoria Regia — Stretch",
        "One property",
        "Altitude plus street food is the trip",
        "The reservation is often the better Stretch",
    ),
)

INTL["brazil_rio"] = band(
    b(
        "Ibis Rio de Janeiro Santos Dumont or Ibis Budget Copacabana — Metro / bus",
        "A Copacabana 2-star a block off the first beach row",
        "A hostel-plus in Botafogo or Lapa",
        "Skip an Ipanema palace on Lean",
    ),
    b(
        "Hilton Copacabana Rio de Janeiro — beach mid",
        "Windsor Copa or a Copacabana 4-star",
        "A Ipanema 3–4 star if leftover covers that pocket",
        "One beach. Do not hop Copacabana and Ipanema nightly",
        "Metro / Uber beats a rental in the core",
    ),
    b(
        "Belmond Copacabana Palace leftover",
        "Fairmont Rio de Janeiro Copacabana — Stretch",
        "Hotel Fasano Rio de Janeiro leftover",
        "One property",
        "Carnival weeks are not the value window",
    ),
)

INTL["panama"] = band(
    b(
        "Ibis Panama City or a Casco 2-star — walk the walls",
        "An El Cangrejo 2-star — grid streets, grocery nearby",
        "A hostel-plus in Casco Viejo",
        "Skip a Causeway palace on Lean",
        "The canal is a morning, not a hotel address",
    ),
    b(
        "Hilton Panama — downtown mid",
        "The Westin Panama — mid",
        "A Casco 3–4 star — one pocket",
        "One neighborhood. Bocas is a different lodging night",
        "Uber is cheap; tourist-taxi menus are not",
    ),
    b(
        "American Trade Hotel leftover",
        "The Bristol Panama — Stretch",
        "One property",
        "Do not also buy every island hop as a sure day",
        "The canal transit is a ticket, not a room upgrade",
    ),
)

INTL["mexico_oaxaca"] = band(
    b(
        "A Centro 2-star or guesthouse — walk to a market, pack light",
        "A hostel-plus near Santo Domingo",
        "Skip a rooftop-suite on Lean",
        "Altitude plus street food is the trip",
        "Hierve el Agua is a day, not a second hotel",
    ),
    b(
        "Hotel Casa Oaxaca or a Centro 3–4 star",
        "A design 4-star in the walkable centro",
        "One neighborhood",
        "Monte Albán is a morning",
        "Do not hop Puebla into this lodging without a transfer night",
    ),
    b(
        "Hacienda Los Laureles leftover",
        "A Centro Stretch courtyard",
        "One property",
        "The tasting menu is often the better Stretch",
        "Guelaguetza weeks lift rooms",
    ),
)

INTL["morocco"] = band(
    b(
        "Ibis Marrakech Centre Gare or Ibis Budget Marrakech — walk or petit taxi, skip a palace riad on Lean",
        "A Medina guesthouse — pack light, trusted drivers",
        "A Gueliz 2-star if you want grid streets",
        "Skip the hotel dinner most nights",
        "Fes is a different lodging night",
    ),
    b(
        "A Gueliz 4-star or a restored riad 3–4 star in the walkable medina",
        "Sofitel Marrakech Palais Imperial — mid-plus",
        "One city. The desert camp is a different night",
        "Day tours beat a safari-priced room you do not need",
    ),
    b(
        "Royal Mansour Marrakech leftover",
        "La Mamounia Stretch",
        "Four Seasons Resort Marrakech leftover",
        "One property",
        "The riad or the desert camp — rarely both plus every souk guide",
    ),
)

INTL["south_africa"] = band(
    b(
        "Ibis Cape Town Waterfront or a City Bowl 2-star — MyCiTi, skip a Camps Bay palace on Lean",
        "A hostel-plus near Long Street / Gardens",
        "A Johannesburg Sandton 2-star if you overnight inland",
        "Skip a safari-priced room you do not need in the city",
        "The mountain is a morning, not a hotel address",
    ),
    b(
        "Cape Town Marriott Hotel Crystal Towers is a commute; mid is a V&A / City Bowl 4-star",
        "The Westin Cape Town — convention / waterfront mid",
        "A City Bowl 3–4 star — one pocket",
        "Safari lodges are a different budget and night",
        "Uber beats a rental in the core; the peninsula is a car day",
    ),
    b(
        "One&Only Cape Town leftover",
        "The Silo Hotel Stretch",
        "Belmond Mount Nelson leftover",
        "A safari lodge leftover is a different trip line",
        "The game drive is the product if you add the bush",
    ),
)

INTL["egypt"] = band(
    b(
        "Ibis Cairo Citystars or a Downtown 2-star — Metro / trusted driver",
        "A Giza 2-star only if sunrise at the pyramids is the point",
        "A Luxor 2-star on the east bank if the south is the trip",
        "Skip a Nile-view suite on Lean",
        "Day tours beat a palace room you will not sit in",
    ),
    b(
        "Cairo Marriott Hotel & Omar Khayyam Casino — Zamalek mid",
        "Hilton Cairo Zamalek Residences — mid",
        "A Luxor 4-star on the east bank",
        "One city, then a separate night if you add Aswan",
        "The site is the product, not a second tower",
    ),
    b(
        "Four Seasons Hotel Cairo at Nile Plaza leftover",
        "Sofitel Legend Old Cataract Aswan Stretch",
        "A Nile cruise cabin leftover is a different product",
        "One property per city",
        "Do not also buy every optional tomb as a sure interior",
    ),
)

INTL["kenya_safari"] = band(
    b(
        "A Nairobi 2-star near Wilson or a city guesthouse — only the night you fly",
        "Ibis Styles Nairobi Westlands — city Lean",
        "A budget tented camp with honest transfers",
        "Skip a balloon-and-suite stack on Lean",
        "The game drive is the product",
    ),
    b(
        "Nairobi Serena or a city 4-star the night before camp",
        "A mid tented camp in one reserve",
        "One park base. Do not hop every reserve nightly",
        "Transfer days need slack",
        "Park fees are a line",
    ),
    b(
        "Angama Mara leftover",
        "Giraffe Manor is a different product and waitlist",
        "A Stretch tented camp in one reserve",
        "One property",
        "Do not also buy every balloon as a sure dawn",
    ),
)

INTL["tanzania_zanzibar"] = band(
    b(
        "A Stone Town 2-star or guesthouse — walk the alleys",
        "A Nungwi or Paje 2-star a block off the sand",
        "Skip a villa on Lean",
        "Confirm the transfer from the airport or ferry",
        "Safari is a different lodging night if you add the mainland",
    ),
    b(
        "Park Hyatt Zanzibar — Stone Town mid-plus",
        "A Nungwi 3–4 star — one beach",
        "A Stone Town 4-star if the town is the point",
        "One pocket. Do not hop both coasts nightly",
        "Transfer in the rate",
    ),
    b(
        "andBeyond Mnemba leftover",
        "A Nungwi Stretch villa",
        "Park Hyatt Zanzibar leftover suite",
        "One property",
        "Do not also buy every spice tour as a sure day",
    ),
)

INTL["jordan"] = band(
    b(
        "Ibis Amman or a Downtown 2-star — the night you fly",
        "A Wadi Musa 2-star — walk or a short hop to the Petra gate",
        "A hostel-plus in Amman",
        "Skip a Petra-view suite on Lean",
        "The site is the product",
    ),
    b(
        "Amman Marriott Hotel — city mid the night before Petra",
        "Mövenpick Resort Petra — gate-adjacent mid",
        "A Wadi Musa 3–4 star",
        "One base for Petra. Wadi Rum is a different night",
        "Dead Sea mid is a separate pocket",
    ),
    b(
        "Four Seasons Hotel Amman leftover",
        "Mövenpick Nabatean Castle leftover",
        "A Wadi Rum Stretch camp",
        "One property per pocket",
        "Do not also buy every add-on tomb as a sure interior",
    ),
)

INTL["nepal"] = band(
    b(
        "A Thamel 2-star or guesthouse — walk to food, altitude slack",
        "A hostel-plus in Thamel",
        "Skip a mountain-view suite on Lean",
        "Pokhara is a different lodging night",
        "The trek lodge is a different product",
    ),
    b(
        "Hyatt Regency Kathmandu — mid if leftover covers the city campus",
        "A Thamel 3–4 star — one pocket",
        "A Pokhara 3–4 star if the lake is the point",
        "One city base, then a separate trek line",
        "Trusted drivers beat a rental",
    ),
    b(
        "Dwarika's Hotel leftover",
        "A Pokhara Stretch lake lodge",
        "One property per base",
        "The trek is the product if you add it",
        "Do not also buy every scenic flight as a sure dawn",
    ),
)

INTL["cambodia"] = band(
    b(
        "Ibis Phnom Penh or a Siem Reap 2-star near Pub Street a block off the row",
        "A Siem Reap hostel-plus — tuk-tuk to the temples",
        "Skip a temple-view suite on Lean",
        "The temples are the product",
        "Phnom Penh is a different lodging night",
    ),
    b(
        "Courtyard Siem Reap Resort — Marriott mid",
        "A Siem Reap 3–4 star with a pool you will actually use after temples",
        "One town. Angkor is a sunrise, not a second hotel",
        "Tuk-tuks beat a rental in town",
        "Park tickets are a line",
    ),
    b(
        "Raffles Grand Hotel d'Angkor leftover",
        "Park Hyatt Siem Reap Stretch",
        "One property",
        "Do not also buy every sunrise as a sure interior",
        "The temples still start early on Stretch",
    ),
)

INTL["philippines_palawan"] = band(
    b(
        "An El Nido town 2-star — walk to the pier, grocery the first hour",
        "A Puerto Princesa 2-star the night you fly",
        "Skip a cliff villa on Lean",
        "Island hops are boat days",
        "Confirm the van or flight transfer",
    ),
    b(
        "A El Nido 3–4 star in town or Corong-Corong",
        "A Port Barton mid if leftover covers that pocket",
        "One town. El Nido plus Coron nightly is a transfer day",
        "The lagoon is a boat, not a hotel pool requirement",
        "One island base",
    ),
    b(
        "El Nido Resorts Miniloc or Pangulasian leftover",
        "A Stretch island resort — one property",
        "Do not also buy every island hop",
        "Monsoon weeks are not a discount you want to win",
        "One base",
    ),
)

INTL["indonesia_lombok"] = band(
    b(
        "A Senggigi 2-star or a Kuta Lombok 2-star — grocery the first hour",
        "A hostel-plus on the south if surf is the point",
        "Skip a Gili villa on Lean unless that island is the trip",
        "The Gili boat is a transfer",
        "Bali is a different lodging night",
    ),
    b(
        "A Senggigi 3–4 star or Kuta Lombok midrise — one coast",
        "A Gili Trawangan 3–4 star if that island is the point",
        "One island. Lombok plus Gili nightly is a boat tax",
        "Scooter math is real",
    ),
    b(
        "The Oberoi Beach Resort, Lombok leftover",
        "A Gili Stretch villa",
        "One property",
        "Do not also buy every island hop",
        "One coast",
    ),
)

INTL["sri_lanka"] = band(
    b(
        "A Colombo 2-star near a train or a Galle Fort guesthouse — pick one coast start",
        "A hostel-plus in Galle or Ella",
        "Skip a tea-bungalow suite on Lean",
        "The train is the lodging plan some days",
        "Confirm transfers; the island is longer than the map",
    ),
    b(
        "Shangri-La Colombo or a Colombo 4-star if the city is a real night",
        "A Galle Fort 3–4 star — one pocket",
        "An Ella or Nuwara Eliya 3–4 star if the hills are the point",
        "One coast or one hill base, then a transfer day",
        "The train is mid when leftover covers a reserved seat",
    ),
    b(
        "Amangalla leftover",
        "Ceylon Tea Trails Stretch",
        "One property per pocket",
        "Do not also buy every safari as a sure dawn",
        "Monsoon coasts flip; pick the dry side",
    ),
)

INTL["italy_sicily"] = band(
    b(
        "Ibis Styles Palermo or a Centro 2-star — walk, pack light",
        "A Catania 2-star if Etna is the start",
        "A Syracuse Ortigia 2-star — grocery nearby",
        "Skip a cliff suite on Lean",
        "One city base; the island is a transfer week",
    ),
    b(
        "NH Collection Palermo or a Centro 4-star",
        "A Taormina 3–4 star if leftover covers that pocket",
        "An Ortigia 3–4 star — one neighborhood",
        "One town at night. Palermo plus Taormina nightly is a transfer",
        "A car helps outside the cores",
    ),
    b(
        "Belmond Grand Hotel Timeo leftover",
        "Four Seasons San Domenico Palace Taormina Stretch",
        "One property",
        "Do not also buy every ruin as a sure interior",
        "August is a crowd tax",
    ),
)

INTL["puerto_rico_rincon"] = band(
    b(
        "A Rincón 2-star or guesthouse — walk or a short hop to the beach you booked",
        "A studio condo with a kitchen — grocery the first hour",
        "Skip a cliff villa on Lean",
        "San Juan is a different lodging night",
        "A car is assumed once you leave town",
    ),
    b(
        "A Rincón 3–4 star walk-to-beach",
        "A condo-plus in the same pocket if you will cook dinners",
        "One town. Do not hop Rincón and San Juan nightly",
        "Surf is a morning, not a hotel requirement",
        "Parking is a line",
    ),
    b(
        "A Rincón Stretch inn leftover",
        "Dorado Beach is the north coast — a different drive",
        "One property",
        "Do not also buy every sunset-sail",
        "Hurricane weeks are not a discount you want to win",
    ),
)

INTL["dominican_republic_samana"] = band(
    b(
        "A Las Terrenas 2-star or guesthouse — walk to a grocery",
        "A Samaná town 2-star if the ferry is the point",
        "Skip a villa on Lean",
        "Punta Cana is a different lodging night and a different airport",
        "Confirm the transfer",
    ),
    b(
        "A Las Terrenas 3–4 star — one beach",
        "Adults-only mid if there are no kids",
        "One pocket. Las Galeras is a different drive",
        "Whale season is a boat day",
        "Transfer in the rate",
    ),
    b(
        "A Samaná Stretch villa leftover",
        "One property",
        "Do not also buy every whale trip as a sure dawn",
        "Cap Cana is a different island pocket",
        "One beach",
    ),
)

INTL["ecuador_galapagos"] = band(
    b(
        "A Puerto Ayora 2-star — walk to the pier, grocery the first hour",
        "A hostel-plus on Santa Cruz",
        "Skip a yacht suite on Lean; land-based is the Lean product",
        "Quito is a different lodging night and altitude",
        "Park fees are a line",
    ),
    b(
        "A Puerto Ayora 3–4 star — one island base",
        "A land-based mid with day boats",
        "One island. Do not hop every island nightly without a cruise product",
        "The boat day is the product",
        "Transfer in the rate",
    ),
    b(
        "A small-ship cabin leftover — that is the Stretch product",
        "Finch Bay or a Stretch land lodge",
        "One ship or one lodge",
        "Do not also buy every extra island as a sure day",
        "The park rules are the itinerary",
    ),
)

