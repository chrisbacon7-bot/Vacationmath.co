"""First-class Hotel / Food / Activities for the 19 new US dests besides Anaheim."""


def rec(hotels, food, acts):
    return {"hotels": hotels, "food": food, "acts": acts}


NEW = {}

NEW["key_west"] = rec(
    (
        "Old Town walkable. A cheap room on Stock Island plus a nightly cab is not Lean.",
        [
            "The Big Ruby Key West — guesthouse, walk to Duval, no car",
            "Caribbean House or a Truman Annex-adjacent inn — quieter pocket",
            "Key West hostel / Seashell Motel class — Lean only, pack light",
            "Duval House-adjacent 2-star a block off the bar strip",
            "Skip an EYW-adjacent motel if you will Uber downtown every meal",
        ],
        "Old Town boutique. Parking is a line; most people should not rent a car.",
        [
            "The Gardens Hotel — Old Town, pool courtyard, walk to dinner",
            "Marquesa Hotel — Duval-adjacent, quieter than the bar block",
            "Island House or Kimpton Palms — walkable mid",
            "Ocean Key Resort — Sunset Pier pocket if leftover covers the address",
            "One neighborhood. Stock Island is a different commute",
        ],
        "Waterfront flagship. Sunset is free from the sidewalk; the room is the Stretch.",
        [
            "Casa Marina — beach-adjacent historic, south of Duval",
            "The Reach Key West — Waldorf, walk to the sand",
            "Pier House or The Marker Waterfront — Old Town leftover",
            "Oceans Edge if you want a marina campus and a shuttle",
            "Do not also book a Miami night unless this is a drive-down",
        ],
    ),
    (
        "Mallory menus are a tax. Cuban breakfast and one named dinner win.",
        [
            "Breakfast: Cuban Coffee Queen or a ventanita, not the hotel",
            "Lunch: Garbo’s Grill or Eaton Street Seafood — counter, not Mallory",
            "Dinner: El Siboney Cuban, stay off Duval’s tourist row",
            "Key lime pie once, not as a meal plan",
            "Happy-hour conch fritter is a snack, not dinner",
        ],
        [
            "Breakfast: Cuban coffee + toastado",
            "Lunch: Pepe’s Café or a harbor casual",
            "Dinner: Blue Heaven — go early, leftover covers the wait",
            "One Duval sit-down, not five",
            "Grocery a beach day if you are at Fort Zach",
        ],
        [
            "Breakfast: still a café",
            "Lunch: a proper sit-down off the square",
            "Dinner reservation: Louie’s Backyard or Hot Tin Roof leftover",
            "Nine One Five if leftover is real",
            "One splurge, then Cuban",
        ],
    ),
    (
        [
            "Mallory sunset from the sidewalk — skip a paid pier ticket on Lean (free)",
            "Fort Zachary Taylor beach + fort (ticketed / cheap)",
            "Duval walk in daylight; the bar crawl is optional (free)",
            "Southernmost Point is a photo, not a morning (free)",
            "Skip a parasail upsell on Lean",
        ],
        [
            "Fort Zach snorkel or a cheap boat — pick one (ticketed)",
            "Hemingway House timed ticket (ticketed)",
            "Sunset sail leftover if the sidewalk sunset was not enough (tour)",
            "Dry Tortugas is a full ferry day — only if leftover covers it (ticketed)",
            "A second beach morning still (free)",
        ],
        [
            "Private sunset sail leftover (tour)",
            "Dry Tortugas Yankee Freedom day leftover (ticketed)",
            "A second historic ticket — Custom House or Fort Zach (ticketed)",
            "Do not stack Tortugas, a sunset sail, and a seaplane in 3 nights",
            "Old Town walk still earns dusk (free)",
        ],
    ),
)

NEW["philadelphia"] = rec(
    (
        "Center City or Old City. A cheap airport room is a SEPTA tax you will resent.",
        [
            "Apple Hostels or a Center City hostel-plus — walk to a Market-Frankford stop",
            "Club Quarters or a compact 2-star near City Hall",
            "Home2 / Hampton Center City — limited-service, grocery downstairs",
            "Old City 2-star if Independence is the whole trip",
            "Skip University City unless that is the neighborhood you will eat in",
        ],
        "Walk-to-Independence or walk-to-Rittenhouse. SEPTA beats a rental car.",
        [
            "The Notary Hotel — City Hall pocket, walk to Reading Terminal",
            "Kimpton Hotel Monaco — Independence Mall walking",
            "The Logan Philadelphia — Benjamin Franklin Parkway, museum mile",
            "Canopy by Hilton Center City or The Independent — one neighborhood",
            "Do not split Old City and University City in a 3-night stay",
        ],
        "Rittenhouse or Parkway flagship. Hotel tax is already in the plan.",
        [
            "Four Seasons Philadelphia — Logan Square leftover",
            "The Rittenhouse — square-adjacent",
            "The Bellevue or Fitler Club — Stretch if leftover is real",
            "One flagship. A second suite is not the weekend",
            "Independence timed entry is the ticket, not a palace breakfast",
        ],
    ),
    (
        "Reading Terminal is the cheap-rich lunch. Cheesesteak is one meal, not a pilgrimage.",
        [
            "Breakfast: Reading Terminal bakery or a Center City café, not the hotel",
            "Lunch: Terminal stalls — roast pork at DiNic’s class, or a market plate",
            "Dinner: one cheesesteak (Pat’s / Geno’s tourist, or a neighborhood shop) then stop",
            "Italian Market if you are already in South Philly",
            "Skip three $28 Rittenhouse salads on Lean",
        ],
        [
            "Breakfast: café most mornings",
            "Lunch: Reading Terminal or a proper casual",
            "Dinner: one reservation — Zahav leftover-adjacent, or a neighborhood Italian",
            "Cheesesteak once; roast pork is the local argument",
            "Stay on SEPTA — a crosstown dinner is a second fare",
        ],
        [
            "Breakfast: still a café",
            "Lunch: a sit-down on the Parkway or Old City",
            "Dinner reservation: Zahav or a named tasting leftover-only",
            "One splurge, then Terminal leftovers",
            "Hotel restaurants are the expensive version of the same plate",
        ],
    ),
    (
        [
            "Independence Hall timed entry + Liberty Bell (free / timed)",
            "Reading Terminal morning (free / cheap)",
            "One museum with a pay-what-you-wish or a city-pass day — Barnes is mid (ticketed / cheap)",
            "Love Park / City Hall walk-through, not a hop-on bus (free)",
            "Skip a carriage loop on Lean",
        ],
        [
            "Independence timed + one Museum Mile ticket — Barnes or PMA (ticketed)",
            "Eastern State Penitentiary if leftover covers a half day (ticketed)",
            "Old City evening walk (free)",
            "Franklin Institute only if the party is kids-first (ticketed)",
            "SEPTA day pass beats a rideshare loop",
        ],
        [
            "Barnes + PMA on different days leftover (ticketed)",
            "A reserved food walk leftover (tour)",
            "Independence still — Stretch does not cancel the hall (timed)",
            "Do not stack three interiors and a cheesesteak tour in one day",
            "Spruce Street Harbor Park in season is free",
        ],
    ),
)

NEW["atlanta"] = rec(
    (
        "Downtown or Midtown on the BeltLine / MARTA. A cheap airport hotel is a rideshare habit.",
        [
            "HI Atlanta or a Downtown hostel-plus — walk to a MARTA stop",
            "Glenn Hotel-adjacent limited-service Downtown — Centennial pocket",
            "Hampton or Home2 Midtown — limited-service, grocery in walking distance",
            "Hotel Indigo Midtown-adjacent 2–3 star if you will walk Piedmont",
            "Skip a Cumberland / Buckhead interstate cloverleaf on Lean",
        ],
        "Midtown or Ponce / Inman pocket. The BeltLine is the walk; MARTA is the backup.",
        [
            "Hotel Clermont — Ponce, walk to the BeltLine and Ponce City Market",
            "The Ellis or Kimpton Sylvan — Downtown / Midtown walkable",
            "The Georgian Terrace — Midtown, Fox Theatre pocket",
            "Graduate Atlanta or a Midtown 3–4 star — one neighborhood",
            "Do not split Buckhead and the Aquarium hotel in a 3-night stay",
        ],
        "Midtown flagship. Convention weeks are not the value window.",
        [
            "Four Seasons Atlanta — Midtown leftover",
            "St. Regis Atlanta — Buckhead Stretch; you traded BeltLine walking",
            "The Whitley — Buckhead flagship if leftover is real",
            "One tower. Two neighborhoods is a parking tax",
            "Piedmont Park is free; the room does not need a spa",
        ],
    ),
    (
        "Ponce City Market and a meat-and-three beat a hotel restaurant.",
        [
            "Breakfast: West Egg or a Midtown café, not the hotel",
            "Lunch: Ponce City Market food hall or a BeltLine counter",
            "Dinner: Mary Mac’s Tea Room — meat-and-three, the Lean classic",
            "Varasano’s or a neighborhood pizza if you skip the tourist row",
            "Skip a Buckhead steakhouse on Lean",
        ],
        [
            "Breakfast: café most mornings",
            "Lunch: Ponce City Market or Krog Street Market",
            "Dinner: Fox Bros. Bar-B-Q or a BeltLine sit-down — one reservation",
            "Mary Mac’s still wins one night",
            "Stay on the BeltLine — a Buckhead dinner is a second fare",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down in Midtown",
            "Dinner reservation: a named Midtown or Westside tasting leftover",
            "One splurge, then a meat-and-three",
            "Hotel restaurants are Atlanta-priced for people who will not walk",
        ],
    ),
    (
        [
            "BeltLine Eastside Trail + Ponce City Market (free / cheap)",
            "Piedmont Park (free)",
            "Georgia Aquarium is a ticketed morning, not a whole trip (ticketed)",
            "MLK National Historical Park (free / cheap)",
            "Skip a hop-on bus on Lean",
        ],
        [
            "Aquarium or World of Coca-Cola — pick one (ticketed)",
            "BeltLine + Krog Street (free / cheap)",
            "Atlanta History Center or a Fox Theatre tour leftover (ticketed)",
            "Piedmont still (free)",
            "MARTA day pass beats a rideshare loop",
        ],
        [
            "Aquarium + a second ticketed leftover (ticketed)",
            "A reserved food walk leftover (tour)",
            "BeltLine morning still (free)",
            "Do not stack Aquarium, Coca-Cola, and a studio tour in one day",
            "A Braves game is a night-price if leftover covers it (ticketed)",
        ],
    ),
)

NEW["dallas"] = rec(
    (
        "Downtown / Deep Ellum / Bishop Arts — pick one pocket. DFW-adjacent is a car tax.",
        [
            "Hampton or Homewood Downtown — limited-service, DART downstairs",
            "The Statler-adjacent 2-star — walk to Downtown",
            "Deep Ellum 2-star if that is the night you came for",
            "A Design District limited-service — grocery in walking distance",
            "Skip a Las Colinas / Galleria cloverleaf on Lean",
        ],
        "Walkable Downtown or a Bishop Arts / Oak Cliff night. DART beats surge pricing.",
        [
            "The Statler Dallas — Downtown historic, walk to the Arts District",
            "Hotel ZaZa or a Uptown 3–4 star — one pocket",
            "Graduate Dallas or Hall Arts-adjacent mid",
            "The Adolphus — Downtown grande dame without a suite",
            "Do not split Frisco and Downtown in a 3-night stay",
        ],
        "Arts District or Uptown flagship. State Fair week is not the value window.",
        [
            "The Ritz-Carlton Dallas — Uptown leftover",
            "Hall Arts Hotel — Arts District Stretch",
            "The Joule — Downtown design flagship",
            "Rosewood Mansion on Turtle Creek — leftover, car assumed",
            "One flagship",
        ],
    ),
    (
        "Tex-Mex and a food hall beat a steakhouse every night.",
        [
            "Breakfast: café or a kolache, not the hotel",
            "Lunch: Trinity Groves or a food hall — counter",
            "Dinner: Tex-Mex in the neighborhood you booked",
            "Pecan Lodge leftover-adjacent; Lean is a taco plate",
            "Skip a tourist steakhouse on Lean",
        ],
        [
            "Breakfast: café",
            "Lunch: a proper casual in Deep Ellum or Bishop Arts",
            "Dinner: one reservation — Pecan Lodge or a neighborhood steak",
            "Stay in one pocket",
            "Uptown dinner only if you slept Uptown",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named steakhouse leftover-only",
            "One splurge, then Tex-Mex",
            "Hotel restaurants are the overrun",
        ],
    ),
    (
        [
            "Arts District walk + a free museum hour if the calendar lines up (free / cheap)",
            "Klyde Warren Park (free)",
            "Sixth Floor Museum is a ticketed morning (ticketed)",
            "Deep Ellum daylight mural walk (free)",
            "Skip a hop-on bus on Lean",
        ],
        [
            "Sixth Floor or Perot — pick one (ticketed)",
            "Klyde Warren + Arts District (free)",
            "Bishop Arts afternoon (free / cheap)",
            "A Dallas Cowboys / game night is a separate ticket (ticketed)",
            "DART day pass beats a rideshare loop",
        ],
        [
            "A reserved Arts District ticket leftover (ticketed)",
            "Perot + Sixth Floor on different days leftover",
            "A neighborhood walk still (free)",
            "Do not stack Fair Park, a stadium, and two museums in one day",
            "State Fair is a day-price in October (ticketed)",
        ],
    ),
)

NEW["houston"] = rec(
    (
        "Museum District / Midtown / Montrose. IAH lodging is a transfer, not a trip.",
        [
            "Hampton or Home2 Downtown / Midtown — limited-service, Metro rail",
            "Hotel ICON-adjacent 2-star Downtown",
            "Montrose 2-star if that is the restaurant neighborhood",
            "Museum District limited-service — walk to Hermann Park",
            "Skip an Energy Corridor cloverleaf on Lean",
        ],
        "Walk-to-museums or walk-to-Montrose. Humidity is free; a rental car is not required in the core.",
        [
            "Hotel ICON — Downtown historic, walk to rail",
            "The Lancaster — Downtown theater pocket",
            "Le Méridien Houston Downtown or a Midtown 3–4 star",
            "Hotel ZaZa Houston — Museum District mid-plus",
            "One pocket. The Galleria is a different commute",
        ],
        "Museum District or Downtown flagship. Rodeo weeks are not the value window.",
        [
            "The Post Oak Hotel — Galleria-adjacent Stretch, car assumed",
            "Four Seasons Houston — Downtown leftover",
            "Hotel Alessandra — Downtown flagship",
            "One tower",
            "The reservation is often the better splurge",
        ],
    ),
    (
        "Houston is a food city at mid-range prices. Hotel restaurants are the tax.",
        [
            "Breakfast: kolache or a café, not the hotel",
            "Lunch: taco truck or a food hall — Montrose / EaDo",
            "Dinner: Viet-Cajun or Tex-Mex in the neighborhood you booked",
            "Ninfa’s on Navigation is a pilgrimage once, not a meal plan",
            "Skip a steakhouse on Lean",
        ],
        [
            "Breakfast: café",
            "Lunch: a proper casual in Montrose",
            "Dinner: one reservation — Underbelly-class or a neighborhood table",
            "Stay in one pocket",
            "Katy Freeway dinner is a transfer",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named tasting leftover",
            "One splurge",
            "Hotel dining rooms are Houston-priced for people who will not drive 15 minutes",
        ],
    ),
    (
        [
            "Hermann Park + a Museum District exterior walk (free)",
            "One free / cheap museum hour if the calendar lines up (free / cheap)",
            "Buffalo Bayou walk (free)",
            "Space Center Houston is a half-day and a transfer — not Lean default (ticketed)",
            "Skip a hop-on bus",
        ],
        [
            "MFAH or Houston Museum of Natural Science — pick one (ticketed)",
            "Hermann Park + Bayou (free)",
            "Space Center only if leftover covers the half day (ticketed)",
            "Menil Collection is free — go (free)",
            "Metro rail beats a rental in the core",
        ],
        [
            "MFAH + Menil leftover (ticketed / free)",
            "Space Center leftover (ticketed)",
            "A neighborhood walk still (free)",
            "Do not stack NASA, a stadium, and two museums in one day",
            "Rodeo is a night-price in season (ticketed)",
        ],
    ),
)

NEW["san_antonio"] = rec(
    (
        "River Walk walking, one or two bridges off the postcard. Airport lodging is a taxi tax.",
        [
            "Crockett Hotel — Alamo-adjacent value, walk the River Walk",
            "A River Walk 2-star a block off the restaurant row",
            "Hampton or Drury Downtown — limited-service, breakfast-in-rate if that is the product",
            "Hotel Havana-adjacent 2-star on the quieter bend",
            "Skip a Fiesta Texas / SeaWorld cloverleaf unless that is the trip",
        ],
        "River Walk boutique or Pearl. A car is a parking line downtown.",
        [
            "Hotel Emma — Pearl, walk to the food hall",
            "Hotel Valencia Riverwalk — walkable mid",
            "Mokara Hotel & Spa — River Walk 4-star",
            "Hotel Havana — quieter bend, still a river walk",
            "One pocket. The Mission Trail is a morning, not a second hotel",
        ],
        "Historic flagship. Fiesta week is not the value window.",
        [
            "The St. Anthony Hotel — Downtown grande dame leftover",
            "Hotel Emma Stretch suite if leftover covers the jump",
            "Thompson San Antonio — Pearl leftover",
            "Fairmount — historic Stretch",
            "One property",
        ],
    ),
    (
        "Pearl food hall and a breakfast taco beat a River Walk tourist menu.",
        [
            "Breakfast: breakfast taco (Taco Taco or a bakery), not the hotel",
            "Lunch: Pearl food hall or a mercado plate",
            "Dinner: one sit-down two bridges off the postcard row",
            "Skip a dinner barge on Lean",
            "Tex-Mex in the neighborhood you booked",
        ],
        [
            "Breakfast: café or a taco",
            "Lunch: Pearl or a proper casual",
            "Dinner: one reservation at Pearl or a River Walk-adjacent table",
            "Mi Tierra is a late-night classic once, not every meal",
            "Stay on the river — a north-side dinner is a car",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down at Pearl",
            "Dinner reservation: a named tasting leftover",
            "One splurge, then tacos",
            "Hotel restaurants on the river are a tax",
        ],
    ),
    (
        [
            "The Alamo timed morning — not a day (ticketed / timed)",
            "River Walk in daylight and after dark (free)",
            "San Fernando or a quieter bend walk (free)",
            "Skip SeaWorld / Fiesta Texas on Lean unless that is the trip (ticketed)",
            "Market Square is a cheap hour (free / cheap)",
        ],
        [
            "Alamo + one mission on the trail (ticketed / cheap)",
            "Pearl campus walk (free)",
            "Tower of the Americas leftover (ticketed)",
            "River Walk still (free)",
            "A VIA day pass beats a rideshare loop",
        ],
        [
            "A second mission or a food walk leftover (tour / cheap)",
            "Japanese Tea Garden + a river evening (free / cheap)",
            "Do not stack SeaWorld, the Alamo, and a barge in one day",
            "Fiesta week is a crowd tax (ticketed / peak)",
            "The river at dusk still (free)",
        ],
    ),
)

NEW["palm_springs"] = rec(
    (
        "Walkable Palm Canyon / Downtown. A cheap I-10 motel plus nightly Ubers is not Lean.",
        [
            "Movie Colony Hotel or a mid-century motel on Palm Canyon — pool, walk to dinner",
            "Ingleside Inn-adjacent 2-star — quieter pocket",
            "A Uptown Design District motel-plus — mid-century, grocery nearby",
            "Ace is mid-plus; Lean is a renovated motel courtyard",
            "Skip a desert-edge chain unless you have a car and a trail plan",
        ],
        "Downtown boutique or a mid-century courtyard. Summer is cheap and brutal.",
        [
            "Arrive Palm Springs — Downtown, walk to dinner",
            "Ace Hotel & Swim Club — mid-century campus, still a rideshare to trails",
            "Holiday House — adults-leaning mid",
            "Kimpton Rowan — Downtown rooftop mid",
            "One pocket. Palm Desert / Indian Wells is a different drive",
        ],
        "Design flagship. Modernism Week and Coachella are not the value window.",
        [
            "The Parker Palm Springs — leftover, a campus",
            "Colony Palms Hotel — historic Stretch",
            "Sparrows Lodge or La Serena Villas — smaller Stretch",
            "One property. Do not also buy every spa add-on",
            "July rooms are cheap because the air hurts",
        ],
    ),
    (
        "Date shakes and a Downtown casual beat a resort dining room.",
        [
            "Breakfast: Cheeky’s-adjacent wait is mid; Lean is a bakery or taco",
            "Lunch: taco shop or a date shake — not a resort café",
            "Dinner: Downtown Palm Canyon casual",
            "Skip a hotel restaurant on Lean",
            "Grocery a trail-day picnic",
        ],
        [
            "Breakfast: café Downtown",
            "Lunch: a proper casual",
            "Dinner: one reservation — Workshop Kitchen or a neighborhood table",
            "Stay Downtown — a El Paseo dinner is a drive",
            "One sit-down, not five",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named tasting leftover",
            "One splurge",
            "Resort dining rooms are a second lodging charge",
        ],
    ),
    (
        [
            "Downtown mid-century walk + public art (free)",
            "A desert trail in the morning — Indian Canyons has a modest fee (cheap / ticketed)",
            "Aerial Tramway is a ticket; Lean can skip it (ticketed)",
            "Skip a pool-day cabana on Lean",
            "Modernism Week is a ticketed week in February (ticketed / peak)",
        ],
        [
            "Aerial Tramway or Indian Canyons — pick one (ticketed)",
            "Downtown walk + a mid-century cruise from the sidewalk (free)",
            "Joshua Tree is a day trip with water and a packed lunch (car / cheap)",
            "A second morning trail still (free / cheap)",
            "Coachella is a different budget",
        ],
        [
            "Tram + a guided canyon leftover (ticketed / tour)",
            "A spa afternoon leftover (ticketed)",
            "Joshua Tree sunrise leftover (car)",
            "Do not stack Tram, Joshua Tree, and a festival in 3 nights",
            "Downtown dusk still (free)",
        ],
    ),
)

NEW["lake_tahoe"] = rec(
    (
        "One shore. A cheap room in Reno plus a nightly drive is a different trip.",
        [
            "South Lake motel / Basecamp class — walk to a bus if you can",
            "Stateline value tower — cheaper NV side, one pocket",
            "North Shore 2-star in Kings Beach or Tahoe Vista — grocery the first hour",
            "A hostel-plus in summer only",
            "Skip a ski-in marketing photo on Lean; the bus is slower and cheaper",
        ],
        "Village walkable. A car is assumed once you leave the village.",
        [
            "The Landing Lake Tahoe — South Shore water mid",
            "Marriott Timber Lodge — Heavenly village, walk to the gondola",
            "Hyatt Regency Lake Tahoe — North Shore mid-plus",
            "A South Lake 3–4 star on the transit line",
            "Pick North or South. Do not commute the lake twice a day",
        ],
        "Lakefront or ski-in flagship. Holiday weeks are not the value window.",
        [
            "The Ritz-Carlton Lake Tahoe — Northstar leftover",
            "Edgewood Tahoe — South Shore Stretch",
            "The Village at Palisades Tahoe — Olympic Valley leftover",
            "One base. A second lodge is a transfer",
            "April and November are the mud-season discount",
        ],
    ),
    (
        "Grocery the condo. Village restaurants price like resorts.",
        [
            "Breakfast: grocery the room",
            "Lunch: packed on trail or ski days",
            "Dinner: one casual in the village you booked",
            "Skip a lakeview steakhouse on Lean",
            "Stateline cheap eats if you slept South",
        ],
        [
            "Breakfast: condo + one café",
            "Lunch: packed on big days, sit-down in town",
            "Dinner: one fish or mountain sit-down",
            "Stay on your shore",
            "A North-to-South dinner is an hour in winter",
        ],
        [
            "Breakfast: condo still wins on ski days",
            "Lunch: a sit-down if you are in the village",
            "Dinner reservation: Edgewood or a named table leftover",
            "One splurge",
            "Do not eat every meal out on a ski week",
        ],
    ),
    (
        [
            "The lake path or a beach in the town you booked (free)",
            "A short hike with a cheap parking lot (cheap)",
            "Skip a snowmobile or lake-cruise upsell on Lean (tour)",
            "Gondola sightseeing is a ticket — only if leftover covers it (ticketed)",
            "Grocery picnic (cheap)",
        ],
        [
            "One lift day or a longer hike — pick the season (ticketed / free)",
            "Emerald Bay viewpoint if you already have the car (free / cheap)",
            "A second beach or snow day still (free / ticketed)",
            "A lake cruise leftover (tour)",
            "Do not stack ski, a cruise, and a Tahoe-rim drive in 3 days",
        ],
        [
            "A reserved boat or a guided snow day leftover (tour)",
            "One extra lift ticket leftover (ticketed)",
            "A quiet beach morning still (free)",
            "Do not stack every adventure add-on",
            "Caldera / private-guide leftover only",
        ],
    ),
)

NEW["napa"] = rec(
    (
        "Town inn in Napa or Sonoma. A tasting-room hotel plus a parked car is a tax.",
        [
            "Napa town 2-star or a Calistoga value inn — walk to a grocery",
            "Sonoma plaza-adjacent 2-star if Sonoma is the base",
            "A car-free night near the Napa Valley Wine Train station only if you will ride it",
            "Skip a highway motel in American Canyon unless you land late",
            "Yountville is mid-plus; Lean stays in town",
        ],
        "Walkable plaza or river inn. Book two tastings; do not walk in blind.",
        [
            "Napa River Inn — walkable downtown Napa",
            "El Dorado Hotel — Sonoma plaza",
            "Carneros Resort-adjacent mid if leftover covers a quieter base",
            "A Yountville 3–4 star — you came to walk to dinner",
            "One town. St. Helena plus Sonoma plus Napa is a transfer week",
        ],
        "Auberge / Meadowood class. Harvest weekends are not the value window.",
        [
            "Auberge du Soleil — Rutherford leftover",
            "Meadowood Napa Valley — Stretch",
            "Solage Calistoga — leftover",
            "The Estate Yountville — walk to French Laundry leftover-adjacent",
            "One property. Do not also buy every reserve tasting",
        ],
    ),
    (
        "Tasting fees are the hidden food line. Grocery breakfasts and one dinner win.",
        [
            "Breakfast: bakery in town, not the inn restaurant",
            "Lunch: Oxbow Public Market or a taco truck",
            "Dinner: casual in Napa town or Sonoma plaza",
            "Skip a tasting-room picnic priced like lunch",
            "One reserved tasting, not five walk-ins",
        ],
        [
            "Breakfast: café",
            "Lunch: Oxbow or a proper casual",
            "Dinner: one reservation — Bouchon-adjacent or a neighborhood table",
            "Book tastings with a fee you already priced",
            "Stay in one town at night",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down in Yountville only if you are already there",
            "Dinner reservation: French Laundry / SingleThread leftover-only",
            "One tasting menu, then market food",
            "The room or the reservation, rarely both",
        ],
    ),
    (
        [
            "Oxbow Public Market (free / cheap)",
            "A town walk in Napa or Sonoma plaza (free)",
            "One booked tasting — skip the highway billboard rooms (ticketed)",
            "Bothe or a cheap trail if you want a non-wine hour (cheap)",
            "Skip a limo loop on Lean",
        ],
        [
            "Two booked tastings, not five (ticketed)",
            "A bike-between-wineries morning only if leftover covers the rental (cheap / tour)",
            "Oxbow still (free / cheap)",
            "A Calistoga mud-adjacent hour is mid, not automatic (ticketed)",
            "Do not drive every tasting yourself if anyone is drinking",
        ],
        [
            "A reserved reserve tasting leftover (ticketed)",
            "A hot-air balloon leftover — it is a dawn-price (tour)",
            "One plaza walk still (free)",
            "Do not stack a balloon, three reserves, and French Laundry in one day",
            "Sonoma Coast is a different day and a different wind",
        ],
    ),
)

NEW["monterey"] = rec(
    (
        "Monterey or Pacific Grove. Carmel is a dinner, not a cheap hotel.",
        [
            "HI Monterey Hostel — Cannery Row-adjacent, walk or the trolley",
            "Motel 6 Seaside or a 2-star off the water — cheaper nights",
            "Pacific Grove 2-star — quieter, grocery nearby",
            "A Cannery Row limited-service a block off the aquarium",
            "Skip a Highway 1 cliff motel you will drive past anyway",
        ],
        "Cannery Row / downtown Monterey or a Carmel 3-star if leftover covers the village.",
        [
            "Hotel Pacific — downtown Monterey, walk to the wharf",
            "InterContinental The Clement Monterey — Cannery Row mid",
            "Monterey Plaza Hotel & Spa — water mid-plus",
            "A Pacific Grove 3–4 star — quieter nights",
            "Carmel-by-the-Sea mid only if the village is the point",
        ],
        "Carmel or Big Sur flagship. Car Week is not the value window.",
        [
            "L’Auberge Carmel — village leftover",
            "Post Ranch Inn or Ventana Big Sur — leftover, Highway 1 closures happen",
            "Bernardus Lodge — Carmel Valley Stretch",
            "One base. Big Sur plus Monterey plus Carmel is three parking lots",
            "Check Highway 1 before you lock a Big Sur night",
        ],
    ),
    (
        "Wharf menus are a tax. Grocery a picnic and one sit-down win.",
        [
            "Breakfast: bakery in Pacific Grove or downtown, not the hotel",
            "Lunch: packed at the aquarium or a counter off the wharf",
            "Dinner: downtown Monterey casual",
            "Skip the first restaurant on Fisherman’s Wharf",
            "Clam chowder once, not as a meal plan",
        ],
        [
            "Breakfast: café",
            "Lunch: a proper casual off the wharf",
            "Dinner: one reservation — Passionfish or a neighborhood table",
            "Carmel dinner only if you are already there",
            "Stay in one town at night",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named Carmel or Big Sur table leftover",
            "One splurge",
            "Cliff restaurants are a sunset-price",
        ],
    ),
    (
        [
            "Monterey Bay Aquarium is the ticketed morning (ticketed)",
            "Cannery Row / Rec Trail walk (free)",
            "17-Mile Drive has a fee — Lean can skip and use public pull-offs (ticketed / free)",
            "Skip a whale-watch upsell on Lean if the water is rough (tour)",
            "Pacific Grove tidepools at a documented access (free)",
        ],
        [
            "Aquarium + Rec Trail (ticketed / free)",
            "17-Mile Drive or a Point Lobos day — pick one (ticketed)",
            "A whale watch leftover if seas are honest (tour)",
            "Carmel beach walk (free)",
            "Do not stack aquarium, 17-Mile, and Big Sur in one day",
        ],
        [
            "Aquarium + Point Lobos leftover (ticketed)",
            "A Big Sur day with slack and a packed lunch (car)",
            "A second coastal walk still (free)",
            "Do not stack Post Ranch dinner and a dawn drive on the same night",
            "Car Week is a crowd tax in August (peak)",
        ],
    ),
)

NEW["destin_30a"] = rec(
    (
        "Destin condo or a 30A town you can walk. Harbor-view hotels are a parking tax if you came for the sand.",
        [
            "Destin 1-bedroom condo off 98 — kitchen is the Lean product",
            "Hampton or Holiday Inn Express near the Harbor — limited-service, grocery the first hour",
            "A 30A garage apartment in Seagrove or Santa Rosa if leftover is tight",
            "Skip a high-rise you will Uber from to the beach every day",
            "Miramar / Sandestin value only if you will use that beach",
        ],
        "Walk-to-beach midrise or a 30A condo in one town.",
        [
            "Hilton Sandestin Beach — walk-to-gulf mid",
            "A Destin Harbor 3–4 star if you came for the boats, not the quiet",
            "30A condo in Seaside-adjacent / WaterColor village — kitchen still wins dinners",
            "The Henderson is Stretch; mid is a renovated condo a block off",
            "Pick Destin or 30A. The drive along 98 is the hidden cost",
        ],
        "30A flagship. Spring break and July are not the value window.",
        [
            "WaterColor Inn — 30A leftover",
            "The Pearl Hotel Rosemary Beach — Stretch",
            "Henderson Park Inn or The Lodge 30A class — leftover",
            "One town. Do not hop Rosemary, Seaside, and Destin nightly",
            "January rooms are cheap because the gulf is a walk, not a swim",
        ],
    ),
    (
        "Condo kitchen and a seafood counter beat a harbor tourist menu.",
        [
            "Breakfast: grocery the condo",
            "Lunch: food truck or a taco / shrimp counter",
            "Dinner: cook two nights, one casual fish plate",
            "Skip the first Harbor boardwalk menu",
            "Donut or a bakery once, not as a meal",
        ],
        [
            "Breakfast: condo + one café",
            "Lunch: a proper casual in the town you booked",
            "Dinner: one fish sit-down — Destin or 30A, not both",
            "The Hub / a 30A market lunch is mid",
            "Stay in one town at night",
        ],
        [
            "Breakfast: condo still wins",
            "Lunch: a sit-down if you are already in the village",
            "Dinner reservation: a named 30A table leftover",
            "One splurge, then the kitchen",
            "Harbor restaurants are a second lodging charge",
        ],
    ),
    (
        [
            "The beach in front of the condo — that is the product (free)",
            "Henderson Beach State Park if you slept Destin (cheap)",
            "Skip a dolphin-cruise upsell on Lean (tour)",
            "A harbor walk at dusk (free)",
            "Grocery picnic (cheap)",
        ],
        [
            "One boat or a state-park day — pick one (ticketed / cheap)",
            "A second beach day still (free)",
            "Eden Gardens or a 30A town walk (cheap / free)",
            "A sunset cruise leftover (tour)",
            "Do not stack a boat, a water park, and a beach club in one day",
        ],
        [
            "A reserved boat leftover (tour)",
            "A beach-club afternoon is a day-price (ticketed)",
            "A quiet beach morning still (free)",
            "Do not stack every water add-on",
            "Grayton / Seaside dusk still (free)",
        ],
    ),
)

NEW["outer_banks"] = rec(
    (
        "House week, not a hotel-strip week. Nags Head / Kill Devil Hills is the Lean corridor.",
        [
            "Nags Head or Kill Devil Hills motel / 2-star — walk or a short drive to the sand",
            "A house share with a kitchen — the Lean product if the party will cook",
            "Kitty Hawk value inn — grocery the first hour",
            "Skip a Corolla oceanfront on Lean; the drive is longer and the rate is not",
            "Hatteras village 2-star only if the ferry / cape is the point",
        ],
        "Oceanfront condo or a Duck / Corolla house. A car is assumed.",
        [
            "Sanderling Resort-adjacent mid — Duck, quieter",
            "The Inn at Corolla Light class — mid if leftover covers the north end",
            "Nags Head oceanfront condo — kitchen still wins dinners",
            "A Kill Devil Hills 3-star walk-to-beach",
            "Pick one village. Duck-to-Hatteras is not a casual dinner hop",
        ],
        "Oceanfront house or Sanderling class. Summer is the window; winter closures are real.",
        [
            "Sanderling Resort — Duck leftover",
            "Life House Nags Head or a design oceanfront leftover",
            "A Corolla oceanfront house — Stretch if the party fills it",
            "One village",
            "Hurricane weeks are not a discount you want to win",
        ],
    ),
    (
        "The kitchen is the budget. Pier restaurants are a sunset, not every night.",
        [
            "Breakfast: grocery the house",
            "Lunch: packed on beach days",
            "Dinner: cook two nights, one casual seafood plate",
            "Skip the first pier tourist menu",
            "John’s Drive-In or a counter once",
        ],
        [
            "Breakfast: house + one café",
            "Lunch: packed or a fish counter",
            "Dinner: one sit-down in the village you booked",
            "Duck or Nags Head, not both in one night",
            "Blueberries / produce stands in season are lunch",
        ],
        [
            "Breakfast: house still wins",
            "Lunch: a sit-down if you are already in Duck",
            "Dinner reservation: a named oceanfront leftover",
            "One splurge, then the kitchen",
            "Do not eat every meal out on a house week",
        ],
    ),
    (
        [
            "The beach in front of the house (free)",
            "Wright Brothers or a visitor-center hour (ticketed / cheap)",
            "Jockey’s Ridge dune walk (cheap)",
            "Skip a wild-horse tour on Lean if you can see them from a public access (tour / free)",
            "Grocery picnic (cheap)",
        ],
        [
            "Cape Hatteras lighthouse or Wright Brothers — pick one (ticketed)",
            "A second beach day still (free)",
            "A wild-horse tour leftover if you slept north (tour)",
            "Pea Island or a wildlife hour (free / cheap)",
            "Do not stack lighthouse, horses, and a ferry in one day",
        ],
        [
            "A reserved boat or a lighthouse climb leftover (ticketed / tour)",
            "A second park site leftover (ticketed)",
            "A quiet beach morning still (free)",
            "Ocracoke is a ferry day — leftover only",
            "Hurricane season is a watch, not an itinerary",
        ],
    ),
)

NEW["grand_canyon"] = rec(
    (
        "South Rim in-park or Tusayan. Flagstaff is a commute, not Lean lodging.",
        [
            "Maswik Lodge — in-park, cafeteria, walk or shuttle to the rim",
            "Yavapai Lodge — in-park mid-lean, shuttle",
            "Tusayan motel (Red Feather / Holiday Inn Express class) — short drive to the gate",
            "A Williams 2-star only if you are riding the train the next morning",
            "Skip a Las Vegas hotel plus a 5-hour day-trip as this lodging",
        ],
        "In-park lodge or Tusayan 3-star. Book months out for summer.",
        [
            "Thunderbird or Kachina Lodge — rim-adjacent mid",
            "Yavapai Lodge plus a rim sunrise — still a shuttle",
            "Best Western Grand Canyon Squire — Tusayan mid, indoor extras for kids",
            "Bright Angel Lodge cabin class — historic mid",
            "Stay on the South Rim. North Rim is a different season and road",
        ],
        "El Tovar. Leftover only — and it still does not include a helicopter.",
        [
            "El Tovar Hotel — rim flagship leftover",
            "Bright Angel historic cabin if El Tovar is sold",
            "A Tusayan 4-star is not Stretch if you wanted the rim at dawn",
            "One property. Phantom Ranch is a lottery, not a Stretch button",
            "January is quiet and cold — that is the value window",
        ],
    ),
    (
        "Cafeteria and a grocery bag beat a rim-view steak every night.",
        [
            "Breakfast: Maswik or a grocery bag",
            "Lunch: packed on rim walks",
            "Dinner: cafeteria or Tusayan casual",
            "Skip a helicopter-pad café",
            "Water is a plan, not a souvenir",
        ],
        [
            "Breakfast: lodge cafeteria + one sit-down",
            "Lunch: packed on longer rim walks",
            "Dinner: one El Tovar dining-room night if leftover covers it",
            "Stay on the rim at night",
            "Tusayan dinner only if you slept Tusayan",
        ],
        [
            "Breakfast: still pack rim days",
            "Lunch: a sit-down if you are in the village",
            "Dinner reservation: El Tovar leftover",
            "One splurge",
            "Do not eat every meal in the dining room on a hiking week",
        ],
    ),
    (
        [
            "Rim Trail between viewpoints — shuttle, not a car loop (free with entry)",
            "Park entry is the ticket; sunrise is free if you slept inside (ticketed / free)",
            "Skip a helicopter on Lean (tour)",
            "Visitor Center + a short paved walk (free with entry)",
            "Do not treat a Las Vegas day-trip as this activity list",
        ],
        [
            "A longer rim walk or a short corridor hike — know your fitness (free with entry)",
            "Desert View Drive if you already have the car (free with entry)",
            "A ranger talk (free)",
            "IMAX in Tusayan leftover (ticketed)",
            "Do not stack a helicopter, a train, and a rim hike in one day",
        ],
        [
            "A helicopter or a rim tour leftover-only (tour)",
            "A longer inner-canyon day only if you are trained and permitted (permit / free)",
            "A second sunrise still (free)",
            "The train from Williams is a day-price (ticketed)",
            "Do not invent a river trip into a 3-night stay",
        ],
    ),
)

NEW["jackson_hole"] = rec(
    (
        "Jackson town or Teton Village. A cheap Idaho Falls room is a different drive.",
        [
            "The Hostel (Teton Village) or a Jackson 2-star — ski-season Lean",
            "49’er Inn or a Motel 6-class in town — grocery the first hour",
            "A cabin court on the edge of town if you have a car",
            "Skip a ski-in marketing rate on Lean; the bus exists",
            "April and November are mud season — that is the discount",
        ],
        "Town square walkable or Teton Village mid. JAC is a weather airport.",
        [
            "The Wort Hotel — town square mid",
            "Cowboy Village Resort — cabin mid, in town",
            "Snow King — town hill, walkable",
            "A Teton Village 3–4 star if skiing is the point",
            "Pick town or village. The pass commute is a winter line",
        ],
        "Amangani / Four Seasons class. Holiday ski weeks are not the value window.",
        [
            "Four Seasons Jackson Hole — Teton Village leftover",
            "Amangani — East Gros Ventre leftover",
            "Cloudveil or Caldera House — village Stretch",
            "One base. Do not also book a Yellowstone in-park night without a transfer day",
            "Build a buffer night in ski season",
        ],
    ),
    (
        "Town casual and a grocery bag beat a village dining room every night.",
        [
            "Breakfast: grocery or a diner in town, not the resort",
            "Lunch: packed on ski or park days",
            "Dinner: Jackson casual — bin and a burger, not a tasting",
            "Skip a village steakhouse on Lean",
            "Persephone or a bakery once",
        ],
        [
            "Breakfast: café in town",
            "Lunch: packed on Teton days, sit-down in town",
            "Dinner: one reservation — Snake River Grill-adjacent or a neighborhood table",
            "Stay in town at night if you slept town",
            "Village dinner only if you slept village",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down if you are already in the village",
            "Dinner reservation: a named tasting leftover",
            "One splurge",
            "The room or the tasting, rarely both plus a guide day",
        ],
    ),
    (
        [
            "Town square + National Museum of Wildlife Art exterior (free / cheap)",
            "A Teton viewpoint from a public pull-off (free / park entry)",
            "Skip a snowmobile upsell on Lean (tour)",
            "Town hill night-ski leftover only (ticketed)",
            "Grocery picnic (cheap)",
        ],
        [
            "Grand Teton park day — one loop, packed lunch (ticketed)",
            "One lift day in season (ticketed)",
            "A wildlife turnout at dawn if you already have the car (free / cheap)",
            "A second town walk still (free)",
            "Yellowstone is a different lodging night if you add it",
        ],
        [
            "A private guide or a snow-coach leftover (tour)",
            "A second park day leftover (ticketed)",
            "A quiet town morning still (free)",
            "Do not stack Teton, Yellowstone, and a heli in 4 days",
            "Amangani spa leftover-only",
        ],
    ),
)

NEW["phoenix"] = rec(
    (
        "Downtown / Roosevelt Row on light rail. This is not Scottsdale resort math.",
        [
            "HI Phoenix or a Downtown hostel-plus — light rail downstairs",
            "Hampton Downtown — limited-service, walk to Roosevelt",
            "Found:Re-adjacent 2-star — arts pocket",
            "Tempe limited-service on the rail if ASU / Mill is the night",
            "Skip a Scottsdale resort parking fee on a Phoenix Lean week",
        ],
        "Downtown boutique or a midtown 3–4 star. Light rail beats a rental in the core.",
        [
            "Hotel Palomar Phoenix — Downtown, walk to Roosevelt Row",
            "The Camby — midtown mid",
            "Graduate Tempe — Mill Avenue if that is the pocket",
            "Kimpton or a Downtown 4-star — one neighborhood",
            "Do not split Scottsdale and Downtown in a 3-night stay unless leftover covers two bases",
        ],
        "Biltmore or a design flagship. June–August is cheap because the air hurts.",
        [
            "Arizona Biltmore — historic leftover, car assumed for dinner",
            "The Global Ambassador — Stretch",
            "Royal Palms is Scottsdale-adjacent — a different lodging math",
            "One property",
            "Winter weekends are peak; summer is the discount",
        ],
    ),
    (
        "Mexican breakfast and a Roosevelt dinner beat a resort dining room.",
        [
            "Breakfast: Mexican café or a bakery, not the hotel",
            "Lunch: taco shop or a food hall Downtown",
            "Dinner: Roosevelt Row casual",
            "Skip a Scottsdale steakhouse on a Phoenix Lean week",
            "Grocery a trail-day picnic",
        ],
        [
            "Breakfast: café",
            "Lunch: a proper casual in Roosevelt or Downtown",
            "Dinner: one reservation — a neighborhood table, not a resort",
            "Stay on the rail",
            "Scottsdale dinner only if leftover covers the rideshare",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named tasting leftover",
            "One splurge",
            "Biltmore dining is a campus-price",
        ],
    ),
    (
        [
            "Roosevelt Row murals in daylight (free)",
            "A desert trail in the morning — South Mountain or Camelback have parking realities (free / cheap)",
            "Heard Museum is a ticketed morning (ticketed)",
            "Skip a hot-air balloon on Lean (tour)",
            "Light rail to a game or a museum (cheap)",
        ],
        [
            "Heard or Musical Instrument Museum — pick one (ticketed)",
            "A sunrise trail before the heat (free / cheap)",
            "Roosevelt evening (free)",
            "Desert Botanical Garden leftover (ticketed)",
            "Do not stack two museums and a trail at noon in July",
        ],
        [
            "A reserved desert tour leftover (tour)",
            "Heard + Botanical leftover (ticketed)",
            "A second dawn trail still (free)",
            "Do not stack Sedona into a Phoenix lodging week without a transfer day",
            "Scottsdale spa leftover is a different destination",
        ],
    ),
)

NEW["memphis"] = rec(
    (
        "Downtown / South Main. A cheap airport room is a Beale Street rideshare habit.",
        [
            "Sleep Inn Downtown or a South Main 2-star — walk to a trolley",
            "Hu. Hotel-adjacent limited-service",
            "The Guest House at Graceland only if Graceland is the whole trip",
            "A Midtown 2-star if Cooper-Young is the night you came for",
            "Skip a Beale balcony address on Lean; the trolley is cheaper",
        ],
        "Downtown boutique or The Peabody if leftover covers the ducks.",
        [
            "Hu. Hotel — Downtown, walk to Beale",
            "The Central Station Hotel — South Main mid",
            "The Peabody Memphis — ducks, mid-plus",
            "Graduate Memphis — mid if leftover covers the campus-adjacent pocket",
            "One pocket. East Memphis is a car commute",
        ],
        "The Peabody or a design flagship. Elvis Week is not the value window.",
        [
            "The Peabody Memphis — leftover if the ducks are the point",
            "Graduate Memphis Stretch suite",
            "A South Main design hotel leftover",
            "One property",
            "Barbecue-fest weekends lift rooms",
        ],
    ),
    (
        "Barbecue is one meal. Hotel restaurants are the tax.",
        [
            "Breakfast: café Downtown, not the hotel",
            "Lunch: one barbecue plate — Central BBQ or a neighborhood shop",
            "Dinner: South Main casual",
            "Skip a Beale cover-charge dinner on Lean",
            "Gus’s fried chicken once",
        ],
        [
            "Breakfast: café",
            "Lunch: barbecue or a Midtown casual",
            "Dinner: one reservation — a neighborhood table, not Beale",
            "Charlie Vergos’ Rendezvous leftover-adjacent",
            "Stay Downtown at night",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named table leftover",
            "One splurge, then another barbecue is allowed",
            "The Peabody dining room is a leftover",
        ],
    ),
    (
        [
            "National Civil Rights Museum timed ticket (ticketed)",
            "Beale in daylight; the night is optional (free / cheap)",
            "South Main walk (free)",
            "Skip Graceland on Lean unless that is the trip (ticketed)",
            "Trolley hop (cheap)",
        ],
        [
            "Civil Rights Museum + Beale (ticketed / free)",
            "Graceland or Stax — pick one (ticketed)",
            "A second neighborhood walk — Cooper-Young (free)",
            "Sun Studio leftover (ticketed)",
            "Do not stack Graceland, Stax, and Sun in one day",
        ],
        [
            "Graceland + a second music ticket leftover (ticketed)",
            "A reserved music tour leftover (tour)",
            "Civil Rights Museum still (ticketed)",
            "Do not stack three interiors and a late Beale night",
            "Elvis Week is a crowd tax (peak)",
        ],
    ),
)

NEW["portland_me"] = rec(
    (
        "Old Port walking. This is not Portland, Oregon.",
        [
            "Inn at St. John or a West End 2-star — walk or a short bus to Old Port",
            "A hostel-plus or compact Downtown room — grocery nearby",
            "Hampton Old Port-adjacent limited-service",
            "Skip a jetport hotel unless you land late",
            "The Press Hotel is mid; Lean stays a block off the cobblestones",
        ],
        "Old Port boutique. PWM nonstops beat connecting into Boston.",
        [
            "The Press Hotel — Old Port mid, walk to dinner",
            "Portland Harbor Hotel — water mid",
            "The Francis — boutique mid-plus",
            "A West End 3–4 star — quieter nights",
            "One pocket. Do not split Old Orchard Beach into this lodging",
        ],
        "Harbor flagship. July–August is not the value window.",
        [
            "The Francis leftover",
            "The Press Hotel Stretch suite",
            "Inn by the Sea (Cape Elizabeth) — leftover, car assumed",
            "One property",
            "January rooms are cheap because the harbor wind is real",
        ],
    ),
    (
        "Lobster is one meal. Bakeries and a market beat a waterfront tourist menu.",
        [
            "Breakfast: The Holy Donut or a bakery, not the hotel",
            "Lunch: Eventide leftover-adjacent; Lean is a market or a roll shack",
            "Dinner: Old Port casual off the first waterfront row",
            "Lobster roll once",
            "Skip a dinner cruise menu on Lean",
        ],
        [
            "Breakfast: café",
            "Lunch: a roll or a proper casual",
            "Dinner: one reservation — Eventide or a neighborhood table",
            "Stay in Old Port at night",
            "Food trucks / a market lunch is mid",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named tasting leftover",
            "One splurge, then another roll is allowed",
            "Cape Elizabeth dinner only if you slept there",
        ],
    ),
    (
        [
            "Old Port walk (free)",
            "Eastern Promenade (free)",
            "One Casco Bay ferry — Peaks Island is the cheap postcard (cheap)",
            "Skip a lobster-boat upsell on Lean (tour)",
            "Portland Museum of Art leftover (ticketed)",
        ],
        [
            "Casco Bay ferry + Promenade (cheap / free)",
            "Portland Head Light if you already have a car or a bus plan (cheap)",
            "One museum — PMA (ticketed)",
            "A second harbor walk still (free)",
            "Do not stack Head Light, a ferry, and a food tour in one day",
        ],
        [
            "A reserved boat leftover (tour)",
            "Head Light + a second coastal stop leftover (car)",
            "Old Port dusk still (free)",
            "Do not stack a lighthouses loop into a 2-night stay",
            "Foliage weekends are a crowd tax (peak)",
        ],
    ),
)

NEW["bar_harbor"] = rec(
    (
        "Bar Harbor village walking. A cheap Bangor room is a dawn drive, not Lean lodging.",
        [
            "Aurora Inn or Highbrook Motel class — walk or a short bus to the village",
            "A Mount Desert 2-star off the cruise-ship dock line",
            "A cabin court with a kitchenette — grocery the first hour",
            "Skip a winter-closed inn in January; many go dark",
            "Bar Harbor Inn is mid; Lean stays a few blocks uphill",
        ],
        "Village inn. Cadillac sunrise is a reservation in peak season.",
        [
            "Bar Harbor Inn — walk-to-village mid",
            "West Street Hotel — harbor mid",
            "Balance Rock Inn — quieter mid-plus",
            "A Northeast Harbor 3-star if you want fewer cruise mornings",
            "One village. Do not commute from Ellsworth every dawn",
        ],
        "Claremont / Asticou class. July–October is the window.",
        [
            "Claremont Hotel — Southwest Harbor leftover",
            "Asticou Inn — Northeast Harbor Stretch",
            "West Street Hotel leftover suite",
            "One property",
            "Cruise-ship mornings crowd the village — hike early",
        ],
    ),
    (
        "Lobster is one dinner. Pack Acadia lunches.",
        [
            "Breakfast: bakery in the village, not the inn restaurant every day",
            "Lunch: packed on trail days",
            "Dinner: one casual lobster pound, not a waterfront tourist menu every night",
            "Skip a dinner cruise on Lean",
            "Grocery the first hour",
        ],
        [
            "Breakfast: café + packed lunch",
            "Lunch: packed on Cadillac / trail days",
            "Dinner: one sit-down in the village",
            "A lobster pound night is mid",
            "Stay in the village at night",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down only if you skipped the trail",
            "Dinner reservation: Claremont or a named table leftover",
            "One splurge, then a pound",
            "Do not eat every meal out on an Acadia week",
        ],
    ),
    (
        [
            "Acadia park entry + one carriage road or shoreline walk (ticketed / cheap)",
            "Village walk after the ships leave (free)",
            "Skip Cadillac sunrise on Lean if you will not reserve a parking slot (ticketed / timed)",
            "Jordan Pond path leftover (free with entry)",
            "Pack water; the island is not a café loop",
        ],
        [
            "Cadillac sunrise reservation + a quieter afternoon (ticketed / timed)",
            "One longer trail — Beehive only if you are honest about the rungs (free with entry)",
            "A second shoreline walk still (free)",
            "Park Loop Road if you already have the car or a bus pass (ticketed)",
            "Do not stack Beehive, Cadillac, and a whale watch in one day",
        ],
        [
            "A whale watch leftover (tour)",
            "A second reserved dawn leftover (timed)",
            "A quiet carriage-road morning still (free with entry)",
            "Do not stack every peak trail into 3 nights",
            "Cruise-ship days are a crowd tax — hike early",
        ],
    ),
)

NEW["santa_fe"] = rec(
    (
        "Plaza-adjacent walking. Canyon Road is a morning, not a cheap hotel.",
        [
            "Santa Fe Motel & Inn or El Rey Court — classic courtyards, short drive or walk",
            "Silver Saddle Motel class — Lean, grocery nearby",
            "A Railyard 2-star if that is the food pocket",
            "Skip an airport-adjacent Albuquerque room as this lodging",
            "La Fonda is mid-plus; Lean stays a few blocks off the Plaza",
        ],
        "Plaza or Railyard boutique. Altitude is real.",
        [
            "La Fonda on the Plaza — walkable mid",
            "Hotel Chimayo de Santa Fe — Plaza-adjacent",
            "Drury Plaza Hotel — mid, breakfast-in-rate if that is the product",
            "Inn of the Five Graces is Stretch; mid is a courtyard 3–4 star",
            "One pocket. Do not split Albuquerque and the Plaza in a 3-night stay",
        ],
        "Canyon / Tesuque flagship. Indian Market week is not the value window.",
        [
            "Inn of the Five Graces — leftover",
            "Four Seasons Resort Rancho Encantado — Tesuque Stretch, car assumed",
            "Bishop’s Lodge — leftover",
            "One property",
            "Late fall after Market is the value window",
        ],
    ),
    (
        "Breakfast burritos and one chile dinner beat a hotel restaurant.",
        [
            "Breakfast: burrito or a Plaza café, not the hotel",
            "Lunch: cafe in the Railyard or a counter",
            "Dinner: one red-or-green plate off the first Plaza row",
            "Skip a Canyon Road tourist menu on Lean",
            "Farolito / a bakery once",
        ],
        [
            "Breakfast: café",
            "Lunch: a proper casual in the Railyard",
            "Dinner: one reservation — a neighborhood table, not the first Plaza courtyard",
            "Stay Plaza-adjacent at night",
            "Chile is the trip; a second steak is not required",
        ],
        [
            "Breakfast: café",
            "Lunch: a sit-down",
            "Dinner reservation: a named tasting leftover",
            "One splurge",
            "Rancho Encantado dining is a drive-price",
        ],
    ),
    (
        [
            "Plaza + Cathedral walk (free)",
            "Canyon Road in the morning, galleries from the sidewalk (free)",
            "One museum — Georgia O’Keeffe is ticketed (ticketed)",
            "Skip a spa add-on on Lean",
            "Altitude slack is an activity",
        ],
        [
            "O’Keeffe or Meow Wolf — pick one (ticketed)",
            "Canyon Road + Plaza (free)",
            "A Bandelier or Tesuque day leftover if you have a car (ticketed / car)",
            "A second gallery morning still (free)",
            "Do not stack Meow Wolf, O’Keeffe, and Bandelier in one day",
        ],
        [
            "A reserved museum + a spa leftover (ticketed)",
            "Bandelier leftover (ticketed / car)",
            "Plaza dusk still (free)",
            "Do not stack Indian Market crowds and three interiors",
            "Taos is a different lodging night if you add it",
        ],
    ),
)
