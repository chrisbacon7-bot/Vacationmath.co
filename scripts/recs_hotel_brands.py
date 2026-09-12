"""Last-wins Hotel Lean/Solid/Stretch lists.

Rebalance catalog hotels so each tier names recognizable chain brands
travelers actually book (and points earners care about), plus 1–2 local
or boutique picks. No rates, star scores, or affiliates.
"""


def b(*picks):
    return list(picks)


HOTEL_REBALANCE = {}


def add(dest_id, budget, mid, lux):
    HOTEL_REBALANCE[dest_id] = {"budget": budget, "mid": mid, "lux": lux}


# ---------------------------------------------------------------------------
# Priority US + international cities
# ---------------------------------------------------------------------------

add(
    "los_angeles",
    b(
        "Hampton Inn & Suites Los Angeles Downtown — walk to Metro and Grand Central Market",
        "Holiday Inn Express Downtown LA — limited-service, skip the Valley cloverleaf",
        "Courtyard Los Angeles L.A. LIVE — Pico station pocket, convention-adjacent",
        "Moxy Downtown Los Angeles — compact Marriott, Arts District walking",
        "Freehand Downtown — hostel-plus if the party will share a room",
    ),
    b(
        "Hyatt Regency Los Angeles Downtown — L.A. LIVE, Metro in the block",
        "The Westin Bonaventure Downtown — Figueroa, one rideshare zone",
        "Sheraton Grand Los Angeles — Financial District, walk to Metro",
        "Hilton Checkers Los Angeles — compact Downtown, skip a Santa Monica commute",
        "Ace Hotel Downtown — boutique if you want Grand Central Market walking",
    ),
    b(
        "JW Marriott Los Angeles L.A. LIVE — Stretch default for Marriott points",
        "Conrad Los Angeles — Grand LA, DTLA flagship",
        "The Ritz-Carlton Los Angeles — L.A. LIVE tower, leftover only",
        "Waldorf Astoria Beverly Hills — a different pocket; rideshare assumed",
        "1 Hotel West Hollywood or Proper Santa Monica — boutique if leftover is the neighborhood",
    ),
)

add(
    "anaheim",
    b(
        "Hampton Inn & Suites Anaheim Resort Convention Center — Harbor Blvd shuttle or a short walk",
        "Holiday Inn Express Anaheim Disneyland — limited-service, grocery breakfast",
        "Fairfield Inn Anaheim Resort — Marriott value, Convention Center pocket",
        "Candy Cane Inn — local Harbor Blvd classic if you want a courtyard, not a points hotel",
        "Howard Johnson Anaheim — garden-court Lean, skip a Santa Monica hotel as this lodging",
    ),
    b(
        "Hilton Anaheim — Convention Center campus, walk or a short shuttle to the gates",
        "Anaheim Marriott — same campus, one room not a suite",
        "Hyatt House at Anaheim Resort — kitchenette mid if the party will grocery dinners",
        "SpringHill Suites Anaheim Resort/Convention Center — Marriott suite-ish mid",
        "Pixar Place Hotel — Disney moderate-class, walk to Downtown Disney",
    ),
    b(
        "Disney’s Grand Californian — Deluxe, walk to California Adventure",
        "Disneyland Hotel — on-property, monorail-adjacent campus",
        "JW Marriott Anaheim Resort — off-property Stretch with a real pool",
        "The Westin Anaheim Resort — newer tower, still a shuttle or walk",
        "Do not also book a Santa Monica night in the same 5-night week",
    ),
)

add(
    "nyc",
    b(
        "Hampton Inn Manhattan Times Square Central — train downstairs, skip paying for the neon view",
        "Motto by Hilton New York City Chelsea — compact Hilton, walk to the 1 / A / C / E",
        "Holiday Inn Express New York City – Chelsea — limited-service, grocery in walking distance",
        "Courtyard New York Manhattan/Chelsea — Marriott value, one subway zone",
        "Pod 39 or citizenM Bowery — boutique-compact if you packed light",
    ),
    b(
        "New York Marriott Marquis — Times Square, you came for the trains not the lobby",
        "Hilton New York Midtown — Sixth Avenue, walk to a borough train",
        "Hyatt Grand Central New York — attached to Grand Central, skip a rental car",
        "The Westin New York Grand Central — midtown east, subway in the pocket",
        "Ace Hotel NoMad — boutique if you want the neighborhood over a convention tower",
    ),
    b(
        "Park Hyatt New York — Midtown flagship, leftover only",
        "The Ritz-Carlton New York, Central Park — park-adjacent Stretch",
        "The St. Regis New York — Fifth Avenue, still a crosstown walk to meetings",
        "Conrad New York Downtown — Battery Park, not a Midtown tower",
        "1 Hotel Central Park — boutique flagship if leftover is the park address",
    ),
)

add(
    "vegas",
    b(
        "Hampton Inn Tropicana — south Strip / University Center, one rideshare or bus to Center-Strip",
        "Hilton Garden Inn Las Vegas Strip South — limited-service, resort fee still applies",
        "Courtyard Las Vegas Convention Center — Marriott value off the Center-Strip crush",
        "The LINQ or Flamingo — Center-Strip bed, not a suite",
        "Ellis Island or a Fremont 2-star — downtown walking if you skip the Strip tram math",
    ),
    b(
        "Park MGM — no-casino-smoke tower, walk to the Bellagio fountains",
        "The Venetian / Palazzo — huge campus; you came to walk, not to Uber",
        "Renaissance Las Vegas — Convention Center, Marriott mid without a casino floor",
        "Hilton Grand Vacations on the Las Vegas Strip — points-friendly mid if the campus fits",
        "Horseshoe or New York-New York — Center-Strip walk, not a suite",
    ),
    b(
        "Waldorf Astoria Las Vegas — Center-Strip, no casino on the lobby level",
        "Bellagio — fountain-adjacent, still a resort-fee hotel",
        "Wynn or Encore — north Strip, nicer rooms, you will still walk or tram",
        "Four Seasons Hotel Las Vegas — Mandalay Bay campus, quieter tower",
        "JW Marriott Las Vegas Resort & Spa — Summerlin leftover; a different commute than the Strip",
    ),
)

add(
    "chicago",
    b(
        "Hampton Inn Chicago Downtown/Magnificent Mile — trains downstairs",
        "Holiday Inn Express Chicago Magnificent Mile — limited-service, grocery in walking distance",
        "Courtyard Chicago Downtown/River North — Marriott value, walk to the L",
        "Motto by Hilton Chicago Downtown — compact, skip a suburban cloverleaf",
        "Freehand Chicago — hostel-plus if the party will share",
    ),
    b(
        "Chicago Marriott Downtown Magnificent Mile — Mag Mile, one room not a suite",
        "Hilton Chicago — Grant Park / South Loop, walk to the L",
        "Hyatt Regency Chicago — river, convention-adjacent",
        "The Westin Michigan Avenue Chicago — Mag Mile mid",
        "The Hoxton Chicago — Fulton Market boutique if restaurants are the point",
    ),
    b(
        "Park Hyatt Chicago — Water Tower Stretch",
        "The St. Regis Chicago — lakeshore tower, leftover only",
        "Four Seasons Hotel Chicago — Mag Mile flagship",
        "Waldorf Astoria Chicago — Gold Coast, winter rates are the value window",
        "The Langham Chicago — river boutique-luxe if leftover is the address",
    ),
)

add(
    "miami",
    b(
        "Hampton Inn Miami Beach — Mid-Beach, walk or a short bus to the sand",
        "Holiday Inn Express Miami Airport / Downtown — Lean only if you rideshare to the beach once",
        "Courtyard Miami Downtown/Brickell — Metromover, skip an Ocean Drive address",
        "Freehand Miami — hostel-plus, walk to the beach and the bus",
        "The Gale South Beach — Collins 2–3 star a few blocks off the water",
    ),
    b(
        "Miami Marriott Biscayne Bay — mainland mid, better food walking than Ocean Drive",
        "Hilton Miami Downtown — bay, Metromover, not a beach tax",
        "Hyatt Centric South Beach Miami — Collins walk-to-sand",
        "Kimpton EPIC Hotel — Brickell bay, one pocket",
        "The Confidante or a renovated Art Deco 3–4 star on Collins — South Beach without Ocean Drive tax",
    ),
    b(
        "1 Hotel South Beach — beach premium, you will still pay for the cabana",
        "The Ritz-Carlton, South Beach — Collins Stretch",
        "The Miami Beach EDITION — Mid-Beach flagship",
        "Four Seasons Hotel at The Surf Club — Surfside, quieter than Ocean Drive",
        "W South Beach or St. Regis Bal Harbour — one flagship, not two neighborhoods",
    ),
)

add(
    "san_francisco",
    b(
        "Hampton Inn San Francisco Downtown/Convention Center — walk to BART",
        "Holiday Inn Express San Francisco Fisherman’s Wharf — only if that pocket is the trip",
        "Courtyard San Francisco Downtown — Marriott value, Union Square-adjacent",
        "Hotel Zephyr — Wharf 2–3 star if you want that grid",
        "HI San Francisco Downtown — hostel-plus, BART downstairs",
    ),
    b(
        "Hilton San Francisco Union Square — cable-car adjacent, BART downstairs",
        "San Francisco Marriott Marquis — Moscone / SoMa, one room not a suite",
        "Hyatt Regency San Francisco — Embarcadero, Ferry Building walk",
        "The Westin St. Francis — Union Square, cable car at the door",
        "Hotel Emeline — Jackson Square boutique if you want the neighborhood over a convention tower",
    ),
    b(
        "Fairmont San Francisco — Nob Hill, cable car at the door",
        "St. Regis San Francisco — SoMa, walk to SFMOMA",
        "Four Seasons Hotel San Francisco — SoMa flagship",
        "JW Marriott San Francisco Union Square — Stretch without a palace rate",
        "1 Hotel San Francisco — waterfront boutique if leftover is the Embarcadero",
    ),
)

add(
    "san_diego",
    b(
        "Hampton Inn San Diego Downtown — trolley, skip Hotel Circle / Mission Valley",
        "Holiday Inn San Diego – Bayside — harbor-adjacent Lean, not a Gaslamp tax",
        "Courtyard San Diego Downtown/Gaslamp — Marriott value, walk the trolley",
        "HI San Diego Downtown — hostel-plus, harbor or Gaslamp bus",
        "Pacific Beach motel class — beach grid if you will not Uber every meal",
    ),
    b(
        "Hilton San Diego Bayfront — convention / harbor, trolley adjacent",
        "San Diego Marriott Gaslamp Quarter — walk to the trolley and dinner",
        "Manchester Grand Hyatt San Diego — waterfront mid, one campus",
        "The Westin San Diego Gaslamp Quarter — walkable mid",
        "Hotel Palomar San Diego — Kimpton Gaslamp boutique if you want Little Italy walking",
    ),
    b(
        "Hotel del Coronado — Hilton historic, ferry or bridge, the postcard lodging",
        "Fairmont Grand Del Mar — north, car assumed",
        "Pendry San Diego — harbor walk Stretch",
        "1 Hotel San Diego — waterfront boutique leftover",
        "Grand Hyatt San Diego — bay flagship if leftover is the tower, not Hotel Circle",
    ),
)

add(
    "philadelphia",
    b(
        "Hampton Inn Philadelphia Center City-Convention Center — limited-service, grocery downstairs",
        "Home2 Suites Philadelphia Downtown — kitchenette if you will grocery breakfasts",
        "Holiday Inn Express Philadelphia – Midtown — walk to a Broad Street Line stop",
        "Courtyard Philadelphia Downtown — Marriott value near City Hall",
        "Apple Hostels or a Center City hostel-plus — Lean if the party will share",
    ),
    b(
        "Philadelphia Marriott Downtown — Convention Center, walk to Reading Terminal",
        "The Notary Hotel — Hilton, City Hall pocket",
        "Canopy by Hilton Philadelphia Center City — one neighborhood, not University City",
        "Kimpton Hotel Monaco Philadelphia — Independence Mall walking",
        "Loews Philadelphia Hotel — Center City mid, SEPTA beats a rental car",
    ),
    b(
        "Four Seasons Hotel Philadelphia — Logan Square leftover",
        "The Logan Philadelphia — Marriott Autograph, Benjamin Franklin Parkway",
        "The Rittenhouse — square-adjacent Stretch",
        "W Philadelphia — Center City flagship",
        "Independence timed entry is the ticket, not a palace breakfast",
    ),
)

add(
    "atlanta",
    b(
        "Hampton Inn & Suites Atlanta-Midtown — limited-service, MARTA or BeltLine walking",
        "Home2 Suites Atlanta Downtown — kitchenette, skip a Cumberland cloverleaf",
        "Holiday Inn Express Atlanta Downtown — Centennial pocket, grocery in walking distance",
        "Courtyard Atlanta Downtown — Marriott value, walk to a MARTA stop",
        "HI Atlanta — hostel-plus if the party will share",
    ),
    b(
        "Atlanta Marriott Marquis — Downtown atrium, one room not a suite",
        "Hyatt Regency Atlanta — Downtown, Peachtree walking",
        "Hilton Atlanta — Downtown convention campus",
        "The Westin Peachtree Plaza — Midtown-adjacent tower, skip Buckhead unless leftover covers two pockets",
        "Hotel Clermont — Ponce boutique if you want BeltLine and Ponce City Market walking",
    ),
    b(
        "Four Seasons Hotel Atlanta — Midtown leftover",
        "St. Regis Atlanta — Buckhead Stretch; you traded BeltLine walking",
        "Grand Hyatt Atlanta in Buckhead — same pocket, leftover only",
        "JW Marriott Atlanta Buckhead — Stretch if leftover is Buckhead, not the Aquarium hotel",
        "The Whitley Atlanta Buckhead — Hyatt flagship, one tower",
    ),
)

add(
    "dallas",
    b(
        "Hampton Inn & Suites Dallas Downtown — limited-service, DART downstairs",
        "Homewood Suites Dallas Downtown — kitchenette, skip a Las Colinas cloverleaf",
        "Holiday Inn Express Dallas Downtown — walk to Downtown",
        "Courtyard Dallas Downtown/Deep Ellum — Marriott value if that is the night you came for",
        "A Design District 2-star — grocery in walking distance",
    ),
    b(
        "Dallas Marriott City Center — Downtown, walk to the Arts District",
        "Hyatt Regency Dallas — Reunion Tower pocket, DART adjacent",
        "Hilton Anatole — Design District-adjacent campus; a short DART or rideshare to Downtown",
        "The Adolphus — Marriott Autograph, Downtown grande dame without a suite",
        "The Statler Dallas — Hilton Curio, walk to the Arts District",
    ),
    b(
        "The Ritz-Carlton, Dallas — Uptown leftover",
        "W Dallas Victory — Uptown / Victory Park Stretch",
        "The Joule — Downtown design flagship",
        "Hall Arts Hotel Dallas — Marriott Autograph, Arts District leftover",
        "Rosewood Mansion on Turtle Creek — leftover, car assumed",
    ),
)

add(
    "houston",
    b(
        "Hampton Inn & Suites Houston Downtown — limited-service, Metro rail",
        "Home2 Suites Houston Downtown — kitchenette, skip an Energy Corridor cloverleaf",
        "Holiday Inn Express Houston Downtown — walk to rail",
        "Courtyard Houston Downtown/Convention Center — Marriott value",
        "A Montrose 2-star if that is the restaurant neighborhood",
    ),
    b(
        "Houston Marriott Marquis — Downtown, walk to rail",
        "Hilton Americas-Houston — convention / Discovery Green",
        "Hyatt Regency Houston — Downtown mid, one pocket",
        "The Westin Houston Downtown — theater pocket",
        "Le Méridien Houston Downtown — Marriott, walk to rail; Galleria is a different commute",
    ),
    b(
        "Four Seasons Hotel Houston — Downtown leftover",
        "JW Marriott Houston Downtown — Stretch in the core",
        "The Post Oak Hotel at Uptown Houston — Galleria-adjacent, car assumed",
        "Hotel Alessandra — Marriott Autograph Downtown flagship",
        "The reservation is often the better splurge than a second tower",
    ),
)

add(
    "seattle",
    b(
        "Hampton Inn Seattle Downtown Convention Center — walk or Link to Pioneer Square",
        "Motto by Hilton Seattle Downtown — compact, skip a Tukwila cloverleaf",
        "Holiday Inn Express Seattle City Center — limited-service, grocery nearby",
        "Courtyard Seattle Downtown/Pioneer Square — Marriott value, Link adjacent",
        "HI Seattle — hostel-plus on Link if the party will share",
    ),
    b(
        "Seattle Marriott Waterfront — walk the waterfront, not a Pike Place hotel address",
        "Hilton Seattle — Downtown, one room not a suite",
        "Hyatt at Olive 8 — Downtown mid, walk to a streetcar",
        "The Westin Seattle — Downtown tower, skip a rental in the core",
        "Sheraton Grand Seattle — Downtown mid, July–August is peak and dry",
    ),
    b(
        "Fairmont Olympic Hotel — Downtown historic leftover",
        "Four Seasons Hotel Seattle — waterfront Stretch",
        "Thompson Seattle — Hyatt, Belltown leftover",
        "W Seattle — Downtown flagship",
        "Lotte Hotel Seattle — Stretch if leftover is the tower, not every island ferry",
    ),
)

add(
    "boston",
    b(
        "Hampton Inn Boston Seaport — limited-service, Silver Line / T, skip a Logan hotel",
        "Holiday Inn Express Boston Garden — North Station pocket, grocery nearby",
        "Courtyard Boston Downtown/North Station — Marriott value, T downstairs",
        "YOTEL Boston — compact Seaport if you packed light",
        "HI Boston — hostel-plus on the T if the party will share",
    ),
    b(
        "Boston Marriott Copley Place — Back Bay, T not a car",
        "Hilton Boston Downtown/Faneuil Hall — walk to the waterfront, skip Faneuil dinner",
        "Hyatt Regency Boston — Downtown Crossing, one pocket",
        "The Westin Copley Place Boston — Back Bay mid",
        "Sheraton Boston Hotel — Prudential campus, Marathon / leaf weeks lift rooms",
    ),
    b(
        "Four Seasons Hotel Boston — Back Bay leftover",
        "The Newbury Boston — Fairmont-adjacent historic Stretch",
        "Mandarin Oriental, Boston — Boylston leftover",
        "Raffles Boston Back Bay — Stretch flagship",
        "The Langham, Boston — Financial District, February is cheap and icy",
    ),
)

add(
    "washington_dc",
    b(
        "Hampton Inn Washington DC Convention Center — limited-service, Metro downstairs",
        "Motto by Hilton Washington DC City Center — compact, skip a Crystal City cloverleaf",
        "Holiday Inn Express Washington DC Downtown — grocery in walking distance",
        "Courtyard Washington Downtown/Convention Center — Marriott value",
        "HI Washington DC — hostel-plus on Metro if the party will share",
    ),
    b(
        "Washington Marriott at Metro Center — one room, Metro in the block",
        "Capital Hilton — Downtown, walk to the Mall",
        "Hyatt Place Washington DC/National Mall — limited-service-plus on Metro",
        "The Westin Washington, D.C. City Center — Downtown mid",
        "Canopy by Hilton Washington DC The Wharf — waterfront mid if leftover covers that pocket",
    ),
    b(
        "Waldorf Astoria Washington DC — Pennsylvania Avenue leftover",
        "The Willard InterContinental — historic Stretch, walk to the Mall",
        "Conrad Washington DC — CityCenter, leftover only",
        "St. Regis Washington, D.C. — Downtown flagship",
        "Four Seasons Hotel Washington, DC — Georgetown Stretch; you traded Mall walking",
    ),
)

add(
    "london",
    b(
        "Premier Inn London County Hall — South Bank river walk, not a West End rate",
        "Ibis London Euston St Pancras — Zone 1, Tesco downstairs",
        "Holiday Inn Express London – Southwark — Tube, skip a Heathrow hotel as this lodging",
        "Travelodge London Covent Garden — compact Zone 1 if you packed light",
        "Generator London — hostel-plus, Bloomsbury walking",
    ),
    b(
        "London Marriott Hotel County Hall — South Bank, walk to a station",
        "Hilton London Bankside — Southwark mid, Tube in the pocket",
        "Hyatt Regency London – The Churchill — Portman Square, one neighborhood",
        "The Westin London City — City mid, not Mayfair prices",
        "Canopy by Hilton London City — Aldgate, restaurants on the block",
    ),
    b(
        "The Savoy — Fairmont, river leftover",
        "Conrad London St. James — Stretch near Westminster",
        "The Langham, London — Portland Place leftover",
        "Raffles London at The OWO — Whitehall Stretch",
        "Claridge’s or The Connaught — Mayfair leftover only",
    ),
)

add(
    "paris",
    b(
        "Ibis Paris Gare du Nord — Metro downstairs, not a tower-block view",
        "Ibis Styles Paris République — 10th/11th, bakery downstairs",
        "Holiday Inn Express Paris – Canal de la Villette — Metro line, Lean if you land late",
        "Generator Paris — hostel-plus, Canal Saint-Martin",
        "Novotel Paris Les Halles — more mid; Lean stays Ibis / Express on a Metro line",
    ),
    b(
        "Hilton Paris Opera — 8th/9th, Metro in five minutes",
        "Paris Marriott Opera Ambassador — Opera pocket, one arrondissement",
        "Hyatt Regency Paris Étoile — 17th, Metro / RER, skip changing arrondissements nightly",
        "The Westin Paris – Vendôme — 1st, mid-plus if leftover covers the address",
        "Hôtel Malte Opéra or a 3-star near Luxembourg — boutique if you want Left Bank walking",
    ),
    b(
        "Park Hyatt Paris-Vendôme — 1st leftover",
        "Four Seasons Hotel George V — 8th Stretch",
        "The Ritz Paris — Place Vendôme, leftover only",
        "Hôtel de Crillon — Rosewood, Place de la Concorde",
        "Lutetia Paris — Left Bank palace-adjacent if leftover is the name",
    ),
)

add(
    "rome",
    b(
        "Ibis Styles Roma Vintage or Ibis Roma Centro — Metro, pack light, stairs are common",
        "Holiday Inn Rome – Eur — Lean only if leftover is tight; Prati/Termini is closer",
        "Best Western Plus Hotel Universo — Termini, trains and buses, louder nights",
        "The Beehive — Termini hostel-plus if the party will share",
        "A Prati guesthouse near Ottaviano — Metro to the Vatican, calmer than the centro",
    ),
    b(
        "Rome Marriott Grand Hotel Flora — Via Veneto, walk-adjacent to the Spanish Steps crush",
        "The Westin Excelsior, Rome — Via Veneto mid",
        "Hotel Indigo Rome – St. George — Centro, walk everywhere",
        "NH Collection Roma Palazzo Cinquecento — Termini-adjacent 4-star if you arrive late",
        "Hotel Nazionale or a Centro Storico 3-star — Piazza Navona / Pantheon pocket",
    ),
    b(
        "Waldorf Astoria Rome Cavalieri — hill campus, leftover, a taxi to the centro",
        "The St. Regis Rome — Via Vittorio Emanuele Orlando Stretch",
        "Hotel de Russie — Rocco Forte, Piazza del Popolo, walk the centro",
        "Hassler Roma — Spanish Steps above the crush",
        "Hotel Eden — Dorchester, Via Veneto leftover only",
    ),
)

add(
    "tokyo",
    b(
        "APA Hotel Shinjuku-Kabukicho or APA Guesthouse — station downstairs, convenience store in the lobby",
        "Toyoko Inn Shinjuku or Ueno — business-hotel Lean, skip a taxi habit",
        "Super Hotel Lohas Ikebukuro or Ueno — limited-service, Metro in the block",
        "Ibis Styles Tokyo Ginza — Accor value if leftover covers a central ward",
        "Nine Hours capsule in Shinjuku — Lean crash-pad only, pack a cube",
    ),
    b(
        "Hilton Tokyo — Shinjuku, Metro in the basement",
        "Tokyo Marriott Hotel — Shinagawa / Gotanda, JR adjacent",
        "Hyatt Regency Tokyo — Shinjuku mid, neighborhood walking",
        "The Westin Tokyo — Ebisu, one train zone",
        "Hotel Gracery Shinjuku or Mitsui Garden Shibuya — Japanese 4-star, trains not a JR-pass spreadsheet",
    ),
    b(
        "Park Hyatt Tokyo — Shinjuku, the view; you still take the Metro to dinner",
        "Conrad Tokyo — Shiodome Stretch",
        "The Ritz-Carlton, Tokyo — Roppongi leftover",
        "Aman Tokyo — Otemachi, station downstairs",
        "Palace Hotel Tokyo — Imperial-garden quiet, leftover only",
    ),
)

add(
    "oahu",
    b(
        "Hampton Inn & Suites Honolulu/Waikiki — limited-service, walk to the sand",
        "Holiday Inn Express Waikiki — one block back, same beach",
        "Aqua Oasis or Shoreline Hotel Waikiki — Outrigger-adjacent value, skip a rental car",
        "The Equus — Kuhio Avenue 2-star, kitchenette beats resort breakfast",
        "Hostelling International Waikiki — hostel-plus if the party will share",
    ),
    b(
        "Hilton Hawaiian Village — huge campus, you came for the lagoon not the boutique",
        "Sheraton Waikiki — Kalakaua walk, beach access",
        "Hyatt Regency Waikiki Beach Resort — same grid, still no car required",
        "Outrigger Waikiki Beach Resort — walk-to-beach mid",
        "Embassy Suites by Hilton Waikiki Beach Walk — kitchenette mid if you will grocery dinners",
    ),
    b(
        "The Royal Hawaiian — Marriott Luxury Collection, Waikiki luxury if you refuse to leave the grid",
        "Halekulani — Waikiki leftover",
        "The Kahala Hotel & Resort — east of Waikiki, quieter beach",
        "Four Seasons Resort Oahu at Ko Olina — west side, car assumed",
        "Aulani, A Disney Resort & Spa — west side leftover + kids",
    ),
)

add(
    "maui",
    b(
        "Holiday Inn Express Kahului — crash-pad only the night you fly; Lean lodging is a Kihei condo",
        "Maui Coast Hotel — Kihei, walk to a food truck, grocery the first hour",
        "Aston Maui Kamaole or a South Kihei studio — kitchen is the Lean product",
        "Kohea Kai Maui — South Kihei boutique-value if leftover is tight",
        "Paia inn-adjacent 2-star — north shore if you will not sit in Kaanapali traffic",
    ),
    b(
        "Sheraton Maui Resort & Spa — Kaanapali Beach, walk the path",
        "The Westin Maui Resort & Spa — same beach, resort fees will show up",
        "Hyatt Regency Maui Resort and Spa — Kaanapali, bigger campus",
        "Marriott’s Maui Ocean Club — points-friendly mid if the kitchen still wins dinners",
        "Wailea Ekahi or a Kihei-plus condo — one pocket, not three islands",
    ),
    b(
        "Grand Wailea, A Waldorf Astoria Resort — Wailea Beach, the Stretch default",
        "Andaz Maui at Wailea — Hyatt, same pocket, leftover only",
        "Four Seasons Resort Maui at Wailea — leftover",
        "The Ritz-Carlton Maui, Kapalua — west side, a different drive",
        "Hotel Wailea — adults-only hill, you will still drive to dinner",
    ),
)

add(
    "key_west",
    b(
        "Hampton Inn Key West — Old Town-adjacent, walk or a short hop to Duval",
        "Holiday Inn Express Key West — limited-service, skip an EYW motel if you will Uber downtown every meal",
        "The Big Ruby Key West — guesthouse, walk to Duval, no car",
        "Key West hostel / Seashell Motel class — Lean only, pack light",
        "Caribbean House or a Truman Annex-adjacent inn — quieter pocket",
    ),
    b(
        "Hyatt Centric Key West Resort & Spa — Old Town water, walk to dinner",
        "Courtyard Key West Waterfront — Marriott, one neighborhood",
        "Hilton Garden Inn Key West — walkable mid if leftover covers it",
        "Kimpton Palms Hotel Key West — walkable boutique mid",
        "The Gardens Hotel — Old Town courtyard if you want inn over a chain campus",
    ),
    b(
        "Casa Marina Key West, A Waldorf Astoria Resort — beach-adjacent historic, south of Duval",
        "The Reach Key West, Curio Collection — Waldorf-adjacent, walk to the sand",
        "Ocean Key Resort — Sunset Pier pocket if leftover covers the address",
        "Pier House Resort & Spa — Old Town leftover",
        "Oceans Edge — marina campus and a shuttle; Stock Island is a different commute",
    ),
)

add(
    "palm_springs",
    b(
        "Hampton Inn & Suites Palm Springs — limited-service, walk or a short hop to Palm Canyon",
        "Holiday Inn Express Palm Springs — Lean courtyard, grocery nearby",
        "Movie Colony Hotel — mid-century motel, pool, walk to dinner",
        "A Uptown Design District motel-plus — skip a desert-edge interstate chain unless you have a trail plan",
        "Ingleside Inn-adjacent 2-star — quieter pocket",
    ),
    b(
        "Hilton Palm Springs — Downtown, walk to dinner",
        "Hyatt Palm Springs — Downtown mid, one pocket",
        "Renaissance Palm Springs Hotel — Marriott, Convention Center-adjacent",
        "Kimpton Rowan Palm Springs — Downtown rooftop mid",
        "Ace Hotel & Swim Club — boutique mid-century campus, still a rideshare to trails",
    ),
    b(
        "The Ritz-Carlton, Rancho Mirage — leftover, car assumed",
        "La Quinta Resort & Club, A Waldorf Astoria Resort — valley Stretch, a different drive than Downtown",
        "The Parker Palm Springs — leftover campus",
        "Omni Rancho Las Palmas — Rancho Mirage leftover",
        "Colony Palms Hotel — historic Stretch if leftover is the neighborhood",
    ),
)

add(
    "napa",
    b(
        "Hampton Inn & Suites Napa — limited-service, walk or a short hop to a grocery",
        "Holiday Inn Express Napa Valley — town Lean, skip an American Canyon highway motel unless you land late",
        "Napa Valley Marriott Hotel & Spa is mid; Lean stays Hampton / Express in Napa town",
        "A Calistoga value inn — walk to a grocery if Calistoga is the base",
        "Sonoma plaza-adjacent 2-star if Sonoma is the pocket you will eat in",
    ),
    b(
        "Napa Valley Marriott Hotel & Spa — Downtown Napa, one town",
        "Andaz Napa — Hyatt, walkable downtown mid",
        "The Westin Verasa Napa — river mid, walk to Oxbow",
        "Archer Hotel Napa — Downtown mid-plus",
        "Napa River Inn — boutique if you want the river walk over a campus",
    ),
    b(
        "Four Seasons Resort and Residences Napa Valley — Calistoga leftover",
        "Auberge du Soleil — Rutherford Stretch",
        "Solage, Auberge Resorts — Calistoga leftover",
        "Meadowood Napa Valley — Stretch if leftover is real",
        "The Estate Yountville — walk to dinner leftover-adjacent; do not also buy every reserve tasting",
    ),
)

from recs_hotel_brands_more import MORE
from recs_hotel_brands_intl import INTL

HOTEL_REBALANCE.update(MORE)
HOTEL_REBALANCE.update({k: v for k, v in INTL.items() if v})

FALLBACK_REBALANCE = {
    "domestic": {
        "budget": b(
            "Hampton Inn or Tru by Hilton downtown — limited-service, not the interstate cloverleaf",
            "Holiday Inn Express or Fairfield Inn near a transit stop — grocery in walking distance",
            "Courtyard by Marriott value downtown — one room, skip airport lodging except the night you fly",
            "Motto or Aloft when present — compact, walk to a train or bus",
            "A neighborhood 2-star on the good side of the tracks if the chain block is sold",
        ),
        "mid": b(
            "Marriott or Hilton downtown / convention — one room, not a suite",
            "Hyatt Place or Hyatt Regency in the walkable core — transit over a rooftop pool you will use twice",
            "Westin, Sheraton, or Renaissance neighborhood 4-star",
            "Canopy, Autograph, Tribute, or Curio when a real property fits the district",
            "A boutique in the restaurant neighborhood — skip the cloverleaf tower",
        ),
        "lux": b(
            "JW Marriott or Grand Hyatt in one district — leftover only",
            "Conrad, Waldorf Astoria, or Park Hyatt when the city has one",
            "Ritz-Carlton, St. Regis, W, or Edition — one flagship",
            "Four Seasons or Fairmont where that address is honest",
            "Suite only if leftover covers the jump from mid — do not also buy every paid tour",
        ),
    },
    "europe": {
        "budget": b(
            "Ibis, Ibis Styles, or Ibis Budget on a Metro or tram — not the airport strip",
            "Holiday Inn Express or Novotel when present — bakery downstairs beats hotel breakfast",
            "Premier Inn or Travelodge Zone 1–2 in the UK",
            "Generator or hostel-plus in a neighborhood with night trams",
            "A 2-star walk-up near a market street — pack light, stairs are common",
        ),
        "mid": b(
            "Hilton, Marriott, or Hyatt in the walkable centro — one neighborhood",
            "Hotel Indigo, NH Collection, or a 4-star near a Metro and a food market",
            "Westin or Canopy when the city has one",
            "Aparthotel 4-star if you will grocery two breakfasts",
            "A boutique 3-star near a Metro — skip the ring-road spa",
        ),
        "lux": b(
            "Park Hyatt, Conrad, or Waldorf Astoria when the city has one",
            "Four Seasons, Fairmont, or a palace historic in the old city",
            "Ritz-Carlton or Luxury Collection leftover",
            "Design flagship with a real neighborhood, not a ring-road spa",
            "Suite with a view leftover-only — mid Europe already eats a US budget",
        ),
    },
    "hawaii": {
        "budget": b(
            "Hampton Inn or Holiday Inn Express on the bus grid — kitchenette if you can get one",
            "Outrigger value or a studio condo a block off the sand — grocery the first hour",
            "A 2-star a block off the beach — same sand, less resort fee",
            "Skip a rental car if the bus reaches the beach and the store",
            "Airport lodging only the night you fly",
        ),
        "mid": b(
            "Hilton, Sheraton, or Hyatt Regency walk-to-beach — one resort path, not three islands",
            "Marriott beach-class or Outrigger mid — request garden vs ocean on purpose",
            "Condo-plus in the same beach town if you will cook two dinners",
            "Embassy Suites or a kitchenette mid if leftover covers it",
            "Parking and resort fees are their own lines",
        ),
        "lux": b(
            "Grand Hyatt, Andaz, or Four Seasons in one pocket",
            "Ritz-Carlton, Waldorf, or Luxury Collection beach-premium",
            "Aulani or a Disney deluxe-class only if leftover + kids",
            "Adults-only or villa if leftover is real",
            "The car becomes mandatory once you leave town — do not also book every snorkel and helicopter",
        ),
    },
    "city": {
        "budget": b(
            "Hampton, Holiday Inn Express, or Ibis on transit — walk-to-bakery beats a cheap room far from everything",
            "Fairfield, Courtyard value, or Motto when present",
            "Airport hotel only the night you fly",
            "Kitchenette if grocery breakfasts are the plan",
            "A neighborhood 2-star on the good side of the tracks",
        ),
        "mid": b(
            "Marriott, Hilton, or Hyatt Place / Hyatt Regency on transit",
            "Westin, Sheraton, or Hotel Indigo in the walkable core",
            "One room, not a suite, unless leftover is real",
            "Location over a rooftop you will use twice",
            "A boutique in the restaurant neighborhood",
        ),
        "lux": b(
            "JW Marriott, Grand Hyatt, or Conrad in one district",
            "Park Hyatt, Ritz-Carlton, St. Regis, or Edition when the city has one",
            "Four Seasons or Fairmont leftover",
            "Park- or water-adjacent flagship",
            "Do not also buy every paid tour",
        ),
    },
    "asia": {
        "budget": b(
            "APA, Toyoko Inn, Super Hotel, or Ibis next to a Metro or JR station",
            "Holiday Inn Express or Fairfield when present — convenience-store breakfast",
            "Capsule only if you packed light",
            "Hostel-plus in the old city or night-market pocket",
            "Skip a palace-view rate on Lean",
        ),
        "mid": b(
            "Hilton, Marriott, or Hyatt Regency near a Metro interchange",
            "Westin, Hotel Indigo, or Mitsui Garden / neighborhood 4-star",
            "Rail passes are often a bad buy on a short city trip",
            "One city base — skip the three-island hop",
            "A riverside or night-market-adjacent boutique if leftover covers it",
        ),
        "lux": b(
            "Park Hyatt, Conrad, or The Ritz-Carlton in the central ward",
            "Four Seasons, Mandarin Oriental, or Aman leftover",
            "The room or the counter dinner — rarely both",
            "Ryokan or courtyard hotel if that is the point of the trip",
            "Suite leftover-only",
        ),
    },
    "oceania": {
        "budget": b(
            "Ibis or Ibis Budget near a station — not the airport strip",
            "YHA / hostel-plus or a neighborhood 3-star on a train",
            "Apartment with a kitchen if the stay is 5+ nights",
            "Long-haul is the expensive line, not the room",
            "Airport lodging only the night you fly",
        ),
        "mid": b(
            "Hilton, Marriott, or Hyatt Regency harbor or CBD",
            "A 4-star on a ferry or train",
            "One city, then a separate island or alps budget if you split",
            "Boutique in the walkable core",
            "Campervan only if that is the trip — it replaces the hotel line",
        ),
        "lux": b(
            "Park Hyatt, Four Seasons, or a waterfront flagship",
            "Harbor or sound-view leftover",
            "Wilderness lodge leftover-only",
            "One base",
            "Do not stack every adventure add-on",
        ),
    },
    "caribbean": {
        "budget": b(
            "Riu, Princess, or Palace class on the main beach — garden view on purpose",
            "Holiday Inn Resort or a value AI — confirm the airport transfer",
            "Town guesthouse only if you will eat out and take local buses",
            "Skip the ocean-view upsell",
            "Downtown limited-service only if you skip the AI product",
        ),
        "mid": b(
            "Hyatt Ziva, Hilton, or Marriott beach-class when the island has one",
            "Iberostar Selection or Hard Rock — 4-star AI, one property",
            "Adults-only 4-star if there are no kids — Secrets / Dreams class",
            "Transfer in the rate, not a dock surprise",
            "A town boutique if this is not an AI week",
        ),
        "lux": b(
            "Hyatt Zilara, Sandals, or Excellence class — leftover only",
            "Waldorf, Ritz-Carlton, or Four Seasons when the island has one",
            "Overwater or cliff villa leftover-only",
            "One island, one resort",
            "Still no invented fare",
        ),
    },
    "mexico": {
        "budget": b(
            "Riu / Palace-class AI if this is a beach week — garden view on purpose",
            "Holiday Inn Express or Ibis in the centro if you will eat out",
            "Roma / Centro / Zona Hotelera value room — walk or ADO bus",
            "Skip the ocean-view upsell and the timeshare pitch",
            "Pick one product — centro guesthouse or value AI",
        ),
        "mid": b(
            "Hyatt Ziva, Hilton, or Marriott hotel-zone when present",
            "Live Aqua or a 4-star AI if all-inclusive is the point",
            "Design 3–4 star in Roma, Polanco, or the hotel zone",
            "One neighborhood — traffic is the hidden cost",
            "Adults-only 4-star if there are no kids",
        ),
        "lux": b(
            "Four Seasons, St. Regis, or JW Marriott leftover",
            "Rosewood / Le Blanc class — adults-only beach premium",
            "One property",
            "The reservation is often the better splurge",
            "Villa only if leftover covers the jump from mid",
        ),
    },
    "africa": {
        "budget": b(
            "Ibis or a city 3-star near a tram or BRT",
            "Medina guesthouse or township-adjacent 2-star — walk to food, use trusted drivers",
            "Skip the hotel dinner most nights",
            "Day tours beat a safari-priced room you do not need",
            "Airport lodging only the night you fly",
        ),
        "mid": b(
            "Hilton, Marriott, or Westin near the waterfront or medina edge",
            "Restored riad or city 4-star in the walkable core",
            "One city, then a separate lodge line if you add safari",
            "Safari lodges are a different budget",
            "Trusted drivers beat a rental in the core",
        ),
        "lux": b(
            "Four Seasons, Sofitel Legend, or a palace leftover",
            "Cape or Nile flagship",
            "Lodge leftover — the game drive is the product",
            "One property per pocket",
            "Do not double-pay for every optional excursion",
        ),
    },
    "middleeast": {
        "budget": b(
            "Ibis, Rove, or Holiday Inn Express near a Metro",
            "Deira / downtown 3-star — souk walking",
            "Skip the Marina address on a Lean week",
            "Desert tours are day-two, not day-one upsells",
            "Airport lodging only the night you fly",
        ),
        "mid": b(
            "Hilton, Marriott, or Hyatt Regency on the Metro or tram",
            "Downtown or Marina 4-star — pick one pocket",
            "Hotel breakfast only when it is in the rate",
            "Palm mid is a different transfer",
            "Summer is cheap and brutal",
        ),
        "lux": b(
            "Park Hyatt, Conrad, JW Marriott, or an icon hotel as a weekend, not a week",
            "Atlantis / Armani / Burj class leftover",
            "Palm or Downtown flagship — one",
            "Desert camp only if leftover covers a night out of the city",
            "Do not also buy every desert-tour upsell on day one",
        ),
    },
    "latam": {
        "budget": b(
            "Ibis or Holiday Inn Express in the walkable centro",
            "Hostel-plus or 2-star in the zona colonial",
            "Value AI only if this is a beach week",
            "Uber is cheap; tourist-taxi menus are not",
            "Altitude and street food are the trip in the cities",
        ),
        "mid": b(
            "Hilton, Marriott, or Hyatt in the restaurant neighborhood",
            "Iberostar / Hyatt Ziva class if all-inclusive",
            "Design 3–4 star in the walkable distrito",
            "One base — intercity buses need their own night",
            "A 4-star AI on the beach if that is the product",
        ),
        "lux": b(
            "Four Seasons, Park Hyatt, or a casa-hotel leftover",
            "Adults-only beach premium",
            "Flagship in the centro or beach leftover",
            "The tasting menu is often the better Stretch",
            "One property",
        ),
    },
    "ai": {
        "budget": b(
            "Riu / Palace / Krystal class — on-property shuttle or a short hotel-zone walk",
            "Holiday Inn Resort or a 3-star AI on the main beach strip — garden view on purpose",
            "Confirm the airport transfer is in the rate",
            "Downtown limited-service only if you will eat out and skip the AI product",
            "Skip the swim-up-suite upsell",
        ),
        "mid": b(
            "Hyatt Ziva / Hilton / Marriott all-inclusive when the strip has one",
            "Iberostar Selection / Hard Rock class — beach, kids club if you need it",
            "Moon Palace or Live Aqua class — all-inclusive mid",
            "Adults-only 4-star if there are no kids — Secrets / Dreams class",
            "One property, not a two-resort hop",
        ),
        "lux": b(
            "Hyatt Zilara / Excellence / Secrets stretch class — beach premium",
            "Sandals or a villa AI leftover only",
            "Overwater or swim-up suite only if leftover covers the jump",
            "One flagship, not a two-resort hop",
            "Still no invented nightly rate",
        ),
    },
}

