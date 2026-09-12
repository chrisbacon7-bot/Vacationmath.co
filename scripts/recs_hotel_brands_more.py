"""Remaining dest hotel rebalances — imported by recs_hotel_brands.py."""


def b(*picks):
    return list(picks)


def band(budget, mid, lux):
    return {"budget": budget, "mid": mid, "lux": lux}


MORE = {}

MORE["san_antonio"] = band(
    b(
        "Hampton Inn & Suites San Antonio Downtown/Riverwalk — limited-service, walk the river",
        "Drury Inn & Suites San Antonio Riverwalk — breakfast-in-rate if that is the product",
        "Holiday Inn Express San Antonio N-Riverwalk Area — a block off the postcard row",
        "Courtyard San Antonio Riverwalk — Marriott value",
        "Crockett Hotel — Alamo-adjacent local if you want historic over points",
    ),
    b(
        "San Antonio Marriott Riverwalk — walkable mid, one pocket",
        "Hilton Palacio del Rio — River Walk, skip a Fiesta Texas cloverleaf",
        "Hyatt Regency San Antonio — river-adjacent mid",
        "The Westin Riverwalk, San Antonio — 4-star on the water",
        "Hotel Emma — Pearl boutique if leftover covers the food-hall walk",
    ),
    b(
        "The St. Anthony Hotel — Marriott Autograph, Downtown grande dame leftover",
        "Thompson San Antonio — Pearl leftover",
        "Mokara Hotel & Spa — Destination by Hyatt, River Walk Stretch",
        "Fairmount Hotel San Antonio — historic Stretch, one property",
        "Hotel Emma Stretch suite if leftover covers the jump from mid",
    ),
)

MORE["lake_tahoe"] = band(
    b(
        "Hampton Inn & Suites Tahoe-Truckee — Lean if North Shore is the plan, grocery the first hour",
        "Holiday Inn Express & Suites South Lake Tahoe — Stateline-adjacent value",
        "Basecamp Hotel South Lake Tahoe — walk to a bus if you can",
        "A Kings Beach or Tahoe Vista 2-star — North Shore grocery pocket",
        "Skip a Reno hotel plus a nightly drive as this lodging",
    ),
    b(
        "Marriott's Timber Lodge — Heavenly village, walk to the gondola",
        "Hyatt Regency Lake Tahoe Resort, Spa and Casino — North Shore mid-plus",
        "The Landing Resort & Spa Lake Tahoe — South Shore water mid",
        "Homewood Suites by Hilton South Lake Tahoe — kitchenette mid if you will grocery ski dinners",
        "A South Lake 3–4 star on the transit line — pick North or South, do not commute the lake twice a day",
    ),
    b(
        "The Ritz-Carlton, Lake Tahoe — Northstar leftover",
        "Edgewood Tahoe Resort — South Shore Stretch",
        "The Village at Palisades Tahoe — Olympic Valley leftover",
        "One base. A second lodge is a transfer",
        "April and November are the mud-season discount",
    ),
)

MORE["monterey"] = band(
    b(
        "Hampton Inn Monterey — limited-service, skip a Highway 1 cliff motel you will drive past",
        "Holiday Inn Express Monterey — Cannery Row-adjacent Lean",
        "Best Western Plus Monterey Inn — downtown value",
        "A Pacific Grove 2-star — quieter, grocery nearby",
        "A Cannery Row limited-service a block off the aquarium",
    ),
    b(
        "InterContinental The Clement Monterey — IHG, Cannery Row mid",
        "Portola Hotel & Spa at Monterey Bay — downtown mid",
        "Monterey Plaza Hotel & Spa — water mid-plus",
        "Hotel Pacific — downtown boutique if you want the wharf walk",
        "Carmel-by-the-Sea mid only if the village is the point",
    ),
    b(
        "L’Auberge Carmel — Relais, village leftover",
        "Bernardus Lodge & Spa — Carmel Valley Stretch",
        "Post Ranch Inn or Ventana Big Sur — leftover, Highway 1 closures happen",
        "One base in Monterey or Carmel — Big Sur plus both towns is three parking lots",
        "Check Highway 1 before you lock a Big Sur night",
    ),
)

MORE["destin_30a"] = band(
    b(
        "Hampton Inn Destin — limited-service, grocery the first hour",
        "Holiday Inn Express Destin — Harbor-adjacent Lean, skip a high-rise you will Uber from to the beach",
        "A Destin 1-bedroom condo off 98 — kitchen is the Lean product",
        "A 30A garage apartment in Seagrove or Santa Rosa if leftover is tight",
        "Miramar / Sandestin value only if you will use that beach",
    ),
    b(
        "Hilton Sandestin Beach Golf Resort & Spa — walk-to-gulf mid",
        "A renovated Destin condo a block off the gulf — mid if The Henderson is Stretch",
        "A Destin Harbor 3–4 star if you came for the boats, not the quiet",
        "30A condo in Seaside-adjacent / WaterColor village — kitchen still wins dinners",
        "Pick Destin or 30A. The drive along 98 is the hidden cost",
    ),
    b(
        "WaterColor Inn & Resort — 30A leftover",
        "The Pearl Hotel Rosemary Beach — Stretch",
        "Hilton Sandestin Stretch suite if leftover covers the gulf-front jump",
        "Henderson Park Inn — Destin leftover",
        "One town. Do not hop Rosemary, Seaside, and Destin nightly",
    ),
)

MORE["outer_banks"] = band(
    b(
        "Hampton Inn & Suites Outer Banks / Corolla — north-end Lean only if that village is the plan",
        "Holiday Inn Express Nags Head — Lean corridor, grocery the first hour",
        "A Nags Head or Kill Devil Hills motel / 2-star — walk or a short drive to the sand",
        "A house share with a kitchen — the Lean product if the party will cook",
        "Skip a Corolla oceanfront on Lean; the drive is longer and the rate is not",
    ),
    b(
        "Hilton Garden Inn Outer Banks/Kitty Hawk — walk-to-beach mid",
        "Courtyard Outer Banks Kill Devil Hills — Marriott mid",
        "Sanderling Resort-adjacent mid — Duck, quieter",
        "A Nags Head oceanfront condo — kitchen still wins dinners",
        "Pick one village. Duck-to-Hatteras is not a casual dinner hop",
    ),
    b(
        "The Sanderling Resort — Duck leftover",
        "A Corolla oceanfront house — Stretch if the party fills it",
        "Life House Nags Head — design oceanfront leftover",
        "One village",
        "Hurricane weeks are not a discount you want to win",
    ),
)

MORE["grand_canyon"] = band(
    b(
        "Holiday Inn Express Grand Canyon — Tusayan, short drive to the gate",
        "Maswik Lodge — in-park, cafeteria, walk or shuttle to the rim",
        "Yavapai Lodge — in-park mid-lean, shuttle",
        "Skip a Las Vegas hotel plus a 5-hour day-trip as this lodging",
    ),
    b(
        "Best Western Premier Grand Canyon Squire Inn — Tusayan mid, indoor extras for kids",
        "The Grand Hotel at the Grand Canyon — Tusayan Hilton-adjacent mid",
        "Thunderbird or Kachina Lodge — rim-adjacent mid",
        "Bright Angel Lodge cabin class — historic mid",
        "Stay on the South Rim. North Rim is a different season and road",
    ),
    b(
        "El Tovar Hotel — rim flagship leftover",
        "Bright Angel historic cabin if El Tovar is sold",
        "A Tusayan 4-star is not Stretch if you wanted the rim at dawn",
        "One property. Phantom Ranch is a lottery, not a Stretch button",
        "January is quiet and cold — that is the value window",
    ),
)

MORE["jackson_hole"] = band(
    b(
        "Hampton Inn Jackson Hole — town Lean, grocery the first hour",
        "Holiday Inn Express Jackson — limited-service, skip a ski-in marketing rate on Lean",
        "The Hostel (Teton Village) — ski-season Lean if leftover is tight",
        "49’er Inn or a Motel 6-class in town — the bus exists",
        "April and November are mud season — that is the discount",
    ),
    b(
        "The Wort Hotel — town square mid",
        "Snow King Resort — town hill, walkable",
        "Homewood Suites by Hilton Jackson — kitchenette mid if you will grocery ski dinners",
        "A Teton Village 3–4 star if skiing is the point",
        "Pick town or village. The pass commute is a winter line",
    ),
    b(
        "Four Seasons Resort and Residences Jackson Hole — Teton Village leftover",
        "Amangani — East Gros Ventre leftover",
        "Hotel Terra Jackson Hole, Teton Village — Marriott Autograph Stretch",
        "Cloudveil or Caldera House — village leftover",
        "One base. Do not also book a Yellowstone in-park night without a transfer day",
    ),
)

MORE["phoenix"] = band(
    b(
        "Hampton Inn & Suites Phoenix Downtown — limited-service, light rail downstairs",
        "Holiday Inn Express Phoenix Downtown — walk to Roosevelt",
        "Courtyard Phoenix Downtown — Marriott value, skip a Scottsdale resort parking fee",
        "HI Phoenix — hostel-plus on the rail",
        "Tempe limited-service on the rail if ASU / Mill is the night",
    ),
    b(
        "Hyatt Regency Phoenix — Downtown, light rail",
        "Hilton Garden Inn Phoenix Downtown — mid, walk to Roosevelt Row",
        "Renaissance Phoenix Downtown Hotel — Marriott mid",
        "Hotel Palomar Phoenix — Kimpton, Downtown boutique if you want the arts pocket",
        "Do not split Scottsdale and Downtown in a 3-night stay unless leftover covers two bases",
    ),
    b(
        "Arizona Biltmore, A Waldorf Astoria Resort — historic leftover, car assumed for dinner",
        "The Global Ambassador — Stretch",
        "JW Marriott Phoenix Desert Ridge Resort & Spa — north leftover, car assumed",
        "Winter weekends are peak; summer is the discount",
    ),
)

MORE["memphis"] = band(
    b(
        "Hampton Inn & Suites Memphis Beale Street — limited-service, trolley, skip a Beale balcony on Lean",
        "Holiday Inn Memphis – Downtown (Beale St. Area) — walk to a trolley",
        "Sleep Inn Downtown or a South Main 2-star — grocery nearby",
        "The Guest House at Graceland only if Graceland is the whole trip",
        "A Midtown 2-star if Cooper-Young is the night you came for",
    ),
    b(
        "The Peabody Memphis — historic mid-plus, ducks",
        "Hu. Hotel Memphis — Hilton Tapestry, Downtown walk to Beale",
        "Central Station Hotel, Tribute Portfolio — Marriott, South Main mid",
        "Graduate Memphis — mid if leftover covers the campus-adjacent pocket",
    ),
    b(
        "The Peabody Memphis — leftover if the ducks are the point",
        "Graduate Memphis Stretch suite",
        "Hu. Hotel leftover suite",
        "One property. East Memphis is a car commute",
        "Barbecue-fest weekends lift rooms",
    ),
)

MORE["portland_me"] = band(
    b(
        "Hampton Inn Portland Downtown – Waterfront — Old Port-adjacent limited-service",
        "Holiday Inn Express Portland — skip a jetport hotel unless you land late",
        "Inn at St. John or a West End 2-star — walk or a short bus to Old Port",
        "A hostel-plus or compact Downtown room — grocery nearby",
        "The Press Hotel is mid; Lean stays a block off the cobblestones",
    ),
    b(
        "The Press Hotel, Autograph Collection — Marriott, Old Port mid",
        "Portland Harbor Hotel — water mid",
        "Hyatt Place Portland Old Port — mid, walk to dinner",
        "The Francis — boutique mid-plus",
        "A West End 3–4 star — quieter nights; this is not Portland, Oregon",
    ),
    b(
        "The Francis leftover",
        "The Press Hotel Stretch suite",
        "Inn by the Sea (Cape Elizabeth) — leftover, car assumed",
        "One property",
        "January rooms are cheap because the harbor wind is real",
    ),
)

MORE["bar_harbor"] = band(
    b(
        "Holiday Inn Express Ellsworth-Bar Harbor — gateway Lean only if leftover is tight; in-village is better",
        "Aurora Inn or Highbrook Motel class — walk or a short bus to the village",
        "A Mount Desert 2-star off the cruise-ship dock line",
        "A cabin court with a kitchenette — grocery the first hour",
        "Skip a winter-closed inn in January; many go dark",
    ),
    b(
        "Bar Harbor Inn — walk-to-village mid",
        "West Street Hotel — harbor mid",
        "A Northeast Harbor 3-star if you want fewer cruise mornings",
        "Balance Rock Inn — quieter mid-plus",
        "One village. Do not commute from Ellsworth every dawn",
    ),
    b(
        "Claremont Hotel — Southwest Harbor leftover",
        "Asticou Inn — Northeast Harbor Stretch",
        "West Street Hotel leftover suite",
        "One property",
        "Cruise-ship mornings crowd the village — hike early",
    ),
)

MORE["santa_fe"] = band(
    b(
        "Hampton Inn Santa Fe — limited-service, short drive or walk toward the Plaza",
        "Holiday Inn Express Santa Fe — Lean courtyard, grocery nearby",
        "Santa Fe Motel & Inn or El Rey Court — classic courtyards",
        "A Railyard 2-star if that is the food pocket",
        "Skip an airport-adjacent Albuquerque room as this lodging",
    ),
    b(
        "Drury Plaza Hotel Santa Fe — mid, breakfast-in-rate if that is the product",
        "Hilton Santa Fe Historic Plaza — Plaza-adjacent mid",
        "La Fonda on the Plaza — walkable mid-plus",
        "Hotel Chimayo de Santa Fe — Plaza-adjacent boutique",
        "One pocket. Do not split Albuquerque and the Plaza in a 3-night stay",
    ),
    b(
        "Four Seasons Resort Rancho Encantado — Tesuque Stretch, car assumed",
        "Inn of the Five Graces — leftover",
        "Bishop’s Lodge, Auberge Resorts Collection — leftover",
        "One property",
        "Late fall after Market is the value window",
    ),
)

MORE["denver"] = band(
    b(
        "Hampton Inn & Suites Denver Downtown — limited-service, light rail",
        "Holiday Inn Express Denver Downtown — skip a DIA hotel as this lodging",
        "Courtyard Denver Downtown — Marriott value, walk to the Mall",
        "HI Denver — hostel-plus if the party will share",
        "A RiNo 2-star if that is the restaurant pocket",
    ),
    b(
        "Denver Marriott City Center — Downtown mid",
        "Hilton Denver City Center — walk to the 16th Street Mall",
        "Hyatt Regency Denver at Colorado Convention Center — one room not a suite",
        "The Westin Denver Downtown — mid, skip a mountain commute nightly",
        "The Crawford Hotel — Marriott Autograph, Union Station boutique if leftover covers it",
    ),
    b(
        "The Ritz-Carlton, Denver — Downtown leftover",
        "Four Seasons Hotel Denver — Stretch",
        "Hotel Teatro — Downtown flagship",
        "One tower. The mountains are a day trip, not a second hotel",
        "January is cheap and icy",
    ),
)

MORE["charleston"] = band(
    b(
        "Hampton Inn Charleston – Historic District — limited-service, walk or a short hop to King",
        "Holiday Inn Charleston Historic Downtown — Lean, skip a North Charleston cloverleaf",
        "Courtyard Charleston Historic District — Marriott value",
        "A downtown 2-star a few blocks off the Battery tourist row",
        "An inn-adjacent guesthouse if leftover is tight",
    ),
    b(
        "Francis Marion Hotel — Historic District mid",
        "HarbourView Inn — water mid",
        "The Dewberry Charleston — mid-plus",
        "Hyatt House Charleston / Historic District — kitchenette mid",
        "One pocket. Folly Beach is a different lodging night",
    ),
    b(
        "The Restoration — leftover",
        "Planters Inn — Stretch",
        "The Spectator Hotel — leftover",
        "One property. Spoleto weeks lift rooms",
        "August is cheap and humid",
    ),
)

MORE["savannah"] = band(
    b(
        "Hampton Inn Savannah Historic District — limited-service, walk the squares",
        "Holiday Inn Express Savannah Historic District — Lean, skip an airport hotel",
        "Courtyard Savannah Downtown/Historic District — Marriott value",
        "A Historic District 2-star a square off the riverfront tourist row",
        "A hostel-plus if the party will share",
    ),
    b(
        "Hyatt Regency Savannah — riverfront mid",
        "The DeSoto Savannah — Hilton Historic District",
        "Marriott Savannah Riverfront — one pocket",
        "Kimpton Brice or a Historic District 4-star — squares walking",
        "One pocket. Tybee is a morning, not a second hotel",
    ),
    b(
        "The Perry Lane Hotel — leftover",
        "JW Marriott Savannah Plant Riverside — Stretch",
        "The Gastonian or a Historic Stretch inn",
        "One property. St. Patrick’s week is a crowd tax",
        "January is the value window",
    ),
)

MORE["asheville"] = band(
    b(
        "Hampton Inn Asheville Downtown — limited-service, walk or a short hop to downtown",
        "Holiday Inn Express Asheville Downtown — skip a tunnel-road motel plus nightly Ubers",
        "A Downtown 2-star or Foundry-adjacent compact room",
        "A West Asheville 2-star if that is the restaurant pocket",
        "Skip a Biltmore-gate hotel on Lean unless that is the trip",
    ),
    b(
        "Kimpton Hotel Arras — Downtown 4-star",
        "Hilton Asheville Biltmore Park — mid if leftover covers the south campus",
        "The Foundry Hotel — Downtown boutique mid",
        "A Biltmore Village mid if leftover covers the estate",
        "October leaf weeks are peak",
    ),
    b(
        "Omni Grove Park Inn — leftover",
        "The Inn on Biltmore Estate — leftover",
        "One property. Do not also buy every spa add-on",
        "January is cheap and icy",
        "Leaf weeks are a crowd tax",
    ),
)

MORE["austin"] = band(
    b(
        "Hampton Inn & Suites Austin Downtown/Convention Center — limited-service, skip a Domain cloverleaf",
        "Holiday Inn Express Austin Downtown — walk or a scooter is not a plan",
        "Courtyard Austin Downtown/Convention Center — Marriott value",
        "HI Austin — hostel-plus on a bus line",
        "An East Austin 2-star if that is the night you came for",
    ),
    b(
        "Austin Marriott Downtown — one room not a suite",
        "Hilton Austin — convention / Downtown mid",
        "Fairmont Austin — mid-plus if leftover covers the water",
        "Hotel Van Zandt — Kimpton Rainey 4-star",
        "The LINE Austin — boutique if you want Downtown over a convention tower",
    ),
    b(
        "The Driskill — historic leftover",
        "Fairmont Austin Stretch suite",
        "Hotel Saint Cecilia — leftover",
        "W Austin — Downtown flagship",
        "SXSW / ACL weeks are not the value window",
    ),
)

MORE["nashville"] = band(
    b(
        "Hampton Inn & Suites Nashville Downtown — limited-service, skip a Broadway balcony on Lean",
        "Holiday Inn Express Nashville Downtown — walk off Broadway",
        "Courtyard Nashville Downtown — Marriott value",
        "A Downtown hostel-plus or a 2-star off Broadway",
        "An East Nashville 2-star if that is the night you came for",
    ),
    b(
        "Nashville Marriott at Vanderbilt University — mid, one pocket",
        "Hilton Nashville Downtown — walk off Broadway",
        "Hyatt Centric Downtown Nashville — Gulch-adjacent mid",
        "Graduate Nashville — Gulch 3–4 star",
        "The Gulch or East — pick one; CMA Fest weeks are not the value window",
    ),
    b(
        "The Hermitage Hotel — leftover",
        "Thompson Nashville — Hyatt Stretch",
        "Four Seasons Hotel Nashville — leftover",
        "Conrad Nashville — Stretch flagship",
        "January is the value window; bachelorette weekends lift rooms",
    ),
)

MORE["portland_oregon"] = band(
    b(
        "Hampton Inn Portland Downtown Waterfront — limited-service, MAX, skip a Beaverton cloverleaf",
        "Holiday Inn Express Portland South — Lean only if leftover is tight; Downtown is the walk",
        "Courtyard Portland City Center — Marriott value, MAX / streetcar",
        "HI Portland — hostel-plus on MAX",
        "A Division 2-star if that is the food pocket — this is not Portland, Maine",
    ),
    b(
        "Portland Marriott Downtown Waterfront — one room not a suite",
        "Hilton Portland Downtown — MAX adjacent",
        "Hyatt Regency Portland — Convention Center mid",
        "The Nines, a Luxury Collection Hotel — mid-plus",
        "The Hoxton Portland — boutique if you want Downtown over a convention tower",
    ),
    b(
        "The Nines — leftover",
        "Canopy by Hilton Portland Pearl District — Stretch",
        "The Ritz-Carlton, Portland — leftover",
        "One property. Do not also buy every food-cart crawl as a taxi loop",
        "January rain is the discount",
    ),
)

MORE["scottsdale"] = band(
    b(
        "Hampton Inn Scottsdale/Old Town area — limited-service, walk to dinner",
        "Holiday Inn Express Scottsdale Old Town — Lean, skip a Phoenix Downtown hotel as this lodging",
        "An Old Town 2-star — summer is cheap and dangerous-hot",
        "Motel 6-class only if leftover is tight and you have a car",
        "This is the resort-adjacent product — Phoenix is a different lodging math",
    ),
    b(
        "Hotel Valley Ho — mid-century mid",
        "Andaz Scottsdale Resort & Bungalows — Hyatt resort mid",
        "Hilton Scottsdale Resort & Villas — mid campus",
        "Westin Kierland Resort & Spa — north mid-plus",
        "An Old Town 3–4 star — one pocket; do not split Sedona without a transfer day",
    ),
    b(
        "The Phoenician, a Luxury Collection Resort — leftover",
        "Four Seasons Resort Scottsdale at Troon North — leftover",
        "Sanctuary Camelback Mountain — leftover",
        "The Canyon Suites at The Phoenician — Stretch campus",
        "June rooms are cheap because the air hurts",
    ),
)
