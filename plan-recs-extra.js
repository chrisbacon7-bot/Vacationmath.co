/* =====================================================================
   Vacation Math — extra /plan recs
   Thickens Hotel / Food / Activities to 4–6 bullets per Lean/Solid/Stretch
   and installs first-class lists for new Domestic US destinations plus
   catalog dests that previously fell through to a region line.
   Orientation only — not live rates, not star scores, not affiliates.
   ===================================================================== */
(function (global) {
  "use strict";
  var P = global.VM_PLAN_DATA;
  if (!P) return;

  function uniqPush(arr, extras) {
    if (!arr) return;
    extras.forEach(function (item) {
      if (item && arr.indexOf(item) === -1) arr.push(item);
    });
  }

  function appendHotel(id, style, extras) {
    var dest = P.HOTEL_EXAMPLES && P.HOTEL_EXAMPLES[id];
    if (!dest || !dest[style]) return;
    if (!dest[style].picks) dest[style].picks = [];
    uniqPush(dest[style].picks, extras);
  }

  function appendFood(id, style, extras) {
    var dest = P.FOOD_PICKS && P.FOOD_PICKS[id];
    if (!dest || !dest[style]) return;
    uniqPush(dest[style], extras);
  }

  function appendAct(id, style, extras) {
    var dest = P.ACTIVITIES && P.ACTIVITIES[id];
    if (!dest || !dest[style]) return;
    uniqPush(dest[style], extras);
  }

  function appendFallbackHotel(key, style, extras) {
    var fb = P.HOTEL_FALLBACKS && P.HOTEL_FALLBACKS[key];
    if (!fb || !fb[style] || !fb[style].picks) return;
    uniqPush(fb[style].picks, extras);
  }

  function appendFallbackFood(key, style, extras) {
    var fb = P.FOOD_FALLBACKS && P.FOOD_FALLBACKS[key];
    if (!fb || !fb[style]) return;
    uniqPush(fb[style], extras);
  }

  function appendFallbackAct(key, style, extras) {
    var fb = P.ACTIVITY_FALLBACKS && P.ACTIVITY_FALLBACKS[key];
    if (!fb || !fb[style]) return;
    uniqPush(fb[style], extras);
  }

  function thickenHotels() {
    appendHotel("disney", "budget", ["All-Star Music — Value, same bus grid, sometimes quieter than Movies", "Pop Century preferred-view only if leftover covers the walk you will not take"]);
    appendHotel("disney", "mid", ["Port Orleans Riverside — Moderate, request Magnolia Bend if leftover is real", "Caribbean Beach Riviera-side — Skyliner without the Deluxe rate"]);
    appendHotel("disney", "lux", ["Wilderness Lodge / Boulder Ridge — Deluxe, boat to Magic Kingdom", "Club level only if leftover is a nightly number you already priced"]);
    appendHotel("cruise", "budget", ["Guarantee interior on a 7-night Caribbean — you bought the itinerary, not the porthole", "Skip the drink-package upsell at check-in; the cabin is not the leak"]);
    appendHotel("cruise", "mid", ["Balcony midship on the itinerary you already chose — not a second ship hop", "Oceanview if the balcony jump eats the leftover you wanted for a port day"]);
    appendHotel("cruise", "lux", ["Aft-wrap balcony leftover — the wake is the product", "Suite gratuities are a line; price them before you tap yes"]);
    appendHotel("cancun", "budget", ["Hotel Zone 3-star on the bus strip — garden view on purpose", "Skip the timeshare-day “free” upgrade; it is a half-day tax"]);
    appendHotel("cancun", "mid", ["Dreams or Secrets Hotel Zone class — adults-only mid if there are no kids", "Confirm the airport transfer is in the rate, not a dock surprise"]);
    appendHotel("cancun", "lux", ["Nizuc / Rosewood Mayakobá class — south of the Zone; a different transfer", "One property. Two resorts in a week is a transfer tax"]);
    appendHotel("los_angeles", "budget", ["Moxy or a compact Downtown 2-star — walk to Grand Central Market and the Metro", "Silver Lake / Echo Park 2-star only if that is the neighborhood you will eat in"]);
    appendHotel("los_angeles", "mid", ["The LINE Koreatown — late food, one rideshare zone, skip the Valley commute", "Kimpton La Peer or a WeHo 3–4 star — one pocket, not beach-plus-hills"]);
    appendHotel("los_angeles", "lux", ["Pendry West Hollywood — Sunset-adjacent; you will still rideshare to dinner", "Shutters or Casa del Mar if the beach is the point — not a WeHo-and-Santa-Monica hop"]);
    appendHotel("nyc", "budget", ["citizenM Bowery or a LES compact room — walk to a train, skip Times Square", "A Brooklyn 2-star on the G or L — cheaper nights, one subway zone"]);
    appendHotel("nyc", "mid", ["The Hoxton Williamsburg — north Brooklyn restaurants, not a Midtown tower", "Arlo Nomad or The Ludlow — compact 3–4 star, subway in the pocket"]);
    appendHotel("nyc", "lux", ["The Greenwich Hotel or The Public class — Downtown, leftover only", "One flagship. A second Midtown suite is not Stretch, it is a mistake"]);
    appendHotel("paris", "budget", ["2-star near République or Oberkampf — bakery downstairs, Metro in five minutes", "Hotel F1 / Ibis Budget on a Metro line if you land late — then own that pocket"]);
    appendHotel("paris", "mid", ["Hotel near Luxembourg or Bastille — one arrondissement, skip nightly hops", "Aparthotel 3–4 star if you will grocery two breakfasts"]);
    appendHotel("paris", "lux", ["Lutetia-class Left Bank — leftover if the name is the point", "Palace breakfast is a line. Mid Paris already eats a US budget"]);
    appendHotel("vegas", "budget", ["Downtown Circa-adjacent or a Fremont 2-star — walk the lights, skip the Strip tram math", "Palms or a Station property — cheaper room, one rideshare to the Center-Strip"]);
    appendHotel("vegas", "mid", ["Horseshoe or New York-New York — Center-Strip walk, not a suite", "Venetian mid-week — huge campus; you came to walk, not to Uber"]);
    appendHotel("vegas", "lux", ["Cosmopolitan or Aria class — Center-Strip suite vibe without inventing a rate", "Weekend and holiday weeks double midweek. Price Tuesday if you can"]);
    appendHotel("san_francisco", "budget", ["The Marker or a Union Square-adjacent limited-service — BART downstairs", "A Tenderloin-edge 2-star only if you know the block; grocery in walking distance"]);
    appendHotel("san_francisco", "mid", ["Hotel Emeline or a Jackson Square boutique — walk to the Ferry Building", "Inn at the Presidio class — quieter; you traded nightlife for the park"]);
    appendHotel("san_francisco", "lux", ["1 Hotel San Francisco or a waterfront flagship — Embarcadero walk", "St. Regis / Four Seasons SoMa — walk to SFMOMA, leftover only"]);
    appendHotel("san_diego", "budget", ["Gaslamp limited-service on the trolley — skip Hotel Circle / Mission Valley", "Pacific Beach motel class — beach grid if you will not Uber every meal"]);
    appendHotel("san_diego", "mid", ["Kona Kai or Shelter Island 3-star — water, still a rideshare to Downtown", "Little Italy 3–4 star — walk to dinner, trolley to the park"]);
    appendHotel("san_diego", "lux", ["Fairmont Grand Del Mar or Lodge at Torrey Pines — north, car assumed", "1 Hotel San Diego or Pendry harbor walk — one waterfront, not Hotel Circle"]);
    appendHotel("miami", "budget", ["Collins Avenue 2-star a few blocks off the water — same sand, less neon", "Downtown / Brickell limited-service — Metromover; you rideshare to the beach once"]);
    appendHotel("miami", "mid", ["Renovated Art Deco 3–4 star on Collins — South Beach walk, not Ocean Drive tax", "Kimpton EPIC or a Brickell 4-star — bay, better food walking"]);
    appendHotel("miami", "lux", ["Faena or The Setai — Mid-Beach, quieter than Ocean Drive", "Edition or Four Seasons Surf Club — one flagship, not two neighborhoods"]);
    appendHotel("london", "budget", ["Premier Inn County Hall or South Bank limited-service — river walk, not a West End rate", "Travelodge King’s Cross or Earl’s Court — Zone 1–2, Tesco downstairs"]);
    appendHotel("london", "mid", ["The Resident Kensington or a South Ken 3–4 star — museums + Tube", "Kimpton Fitzroy / Bloomsbury 4-star — Russell Square pocket"]);
    appendHotel("london", "lux", ["Claridge’s or The Connaught — Mayfair leftover only", "One Aldwych or Covent Garden Hotel — theatre pocket without a palace rate"]);
    appendHotel("rome", "budget", ["Prati guesthouse near Ottaviano — Metro to the Vatican, calmer than the centro", "The Beehive or a Termini 2-star — trains, louder nights, pack light"]);
    appendHotel("rome", "mid", ["Hotel de’ Ricci or Campo de’ Fiori boutique — walk everywhere, skip taxis", "Prati 4-star near Ottaviano if the centro is sold out"]);
    appendHotel("rome", "lux", ["Hassler or Hotel Eden — Spanish Steps / Via Veneto above the crush", "Pantheon-adjacent 5-star leftover only — Rome mid plus one dinner often wins"]);
    appendHotel("tokyo", "budget", ["Sakura Hotel Jimbocho or an Asakusa hostel-plus — walk to a Metro", "Nine Hours capsule only if you packed a cube — Lean crash-pad, not a week"]);
    appendHotel("tokyo", "mid", ["The Knot Tokyo Shinjuku or a 4-star near Tokyo Station — trains, not a JR-pass spreadsheet", "Hotel Gracery Shinjuku / Shibuya Stream Excel — neighborhood walking"]);
    appendHotel("tokyo", "lux", ["Palace Hotel Tokyo or Hoshinoya Tokyo — Imperial-garden or courtyard quiet", "Park Hyatt Shinjuku — the view; you still take the Metro to dinner"]);
    appendHotel("oahu", "budget", ["The Equus or a Kuhio Avenue 2-star — one block back, same beach", "HI Waikiki or a studio condo — kitchenette beats resort breakfast"]);
    appendHotel("oahu", "mid", ["The Laylow or ‘Alohilani — Waikiki 4-star, still no car required", "Hilton Hawaiian Village — huge campus; you came for the lagoon, not the boutique"]);
    appendHotel("oahu", "lux", ["Halekulani or Royal Hawaiian — Waikiki luxury if you refuse to leave the grid", "Four Seasons Ko Olina or Aulani — west side, car assumed, leftover + kids"]);
    appendHotel("maui", "budget", ["Kohea Kai or a South Kihei studio — walk to a food truck, grocery the first hour", "Paia 2-star — north shore if you will not sit in Kaanapali traffic"]);
    appendHotel("maui", "mid", ["Hyatt Regency Maui — Kaanapali Beach, bigger campus", "Wailea Ekahi or a Kihei-plus condo — kitchen still wins some dinners"]);
    appendHotel("maui", "lux", ["Andaz Maui or Four Seasons Maui — same Wailea pocket, leftover only", "Hotel Wailea adults-only — quieter hill; you will still drive to dinner"]);
    appendHotel("punta_cana", "budget", ["Grand Palladium-adjacent value — confirm the transfer is in the rate", "Skip Cap Cana on Lean; Bávaro is the value beach"]);
    appendHotel("punta_cana", "mid", ["Iberostar Selection Bávaro — all-inclusive, beach", "Secrets Cap Cana is Stretch-adjacent; mid stays in Bávaro"]);
    appendHotel("punta_cana", "lux", ["Eden Roc at Cap Cana — Stretch villa class", "Sanctuary Cap Cana — same pocket, not a second island hop"]);
    appendHotel("jamaica", "budget", ["Legends or a Negril 3-star walk-to-beach — skip the MoBay hotel restaurant", "Price the transfer as its own line; Negril is not next to the runway"]);
    appendHotel("jamaica", "mid", ["Moon Palace Jamaica — all-inclusive mid", "Couples Swept Away or a Negril 4-star — beach, adults or family by brand"]);
    appendHotel("jamaica", "lux", ["Round Hill or Half Moon — villa stretch, MoBay side", "Rockhouse or a Negril cliff boutique — leftover, not a fake rate"]);
    appendHotel("barcelona", "budget", ["Hotel Jazz or a 2-star Eixample — walk to Passeig de Gràcia", "El Born guesthouse — restaurants on the block, skip the Ramblas address"]);
    appendHotel("barcelona", "mid", ["H10 Casa Mimosa or Cotton House class — Eixample, Metro in five minutes", "W Barcelona is Stretch; mid is Barceloneta 3-star or Born boutique"]);
    appendHotel("barcelona", "lux", ["Mandarin Oriental Barcelona — Passeig de Gràcia", "Hotel Arts or El Palace — one flagship"]);
    appendHotel("mexico_city", "budget", ["Hostal Regina or a Centro hostel-plus — Zócalo walking, noisier nights", "Condesa 2-star — park walks, street food on the block"]);
    appendHotel("mexico_city", "mid", ["The Hoxton Roma or Brick Hotel — walkable Roma", "Downtown México or a Centro 4-star — rooftop; you still eat in Roma"]);
    appendHotel("mexico_city", "lux", ["St. Regis or Las Alcobas Polanco — leftover", "Casa Polanco or a design flagship — one pocket"]);
    appendHotel("thailand", "budget", ["Lub d or a hostel-plus in Silom / Chiang Mai old city — walk to food stalls", "Boutique guesthouse on the Ping or Chao Phraya — fan room is fine"]);
    appendHotel("thailand", "mid", ["Shangri-La-adjacent riverside — river boat to dinner", "Chiang Mai Nimman 4-star if you split the trip — one city per stay"]);
    appendHotel("thailand", "lux", ["Capella Bangkok — same river, Stretch", "Four Seasons Chiang Mai if the north is the point — do not also buy Phuket mid-trip"]);
    appendHotel("nola", "budget", ["The Drifter or a Mid-City motel-plus — Canal streetcar to the Quarter", "Henry Howard-adjacent Garden District guesthouse — quieter, still a streetcar"]);
    appendHotel("nola", "mid", ["The Pontchartrain or a Garden District 3–4 star — St. Charles line", "Omni Royal Orleans class — Quarter if you accept the premium"]);
    appendHotel("nola", "lux", ["Hotel Monteleone — Quarter flagship, leftover", "Maison de la Luz or The Chloe — design Stretch"]);
    appendHotel("chicago", "budget", ["Hampton or a Loop limited-service — trains downstairs", "Fulton Market 2–3 star if you want restaurants over the Mag Mile"]);
    appendHotel("chicago", "mid", ["Hotel Lincoln or a Gold Coast 3–4 star — park and bus", "LondonHouse or a River North 4-star — river walk, not a suburban rate"]);
    appendHotel("chicago", "lux", ["The Peninsula Chicago — Mag Mile flagship", "St. Regis or Four Seasons — one tower; winter rates are the value window"]);
    appendHotel("amsterdam", "budget", ["Ibis Budget near Sloterdijk or Amstel — tram to the center", "Hotel Not Hotel or a De Pijp 2-star — neighborhood, pack light"]);
    appendHotel("amsterdam", "mid", ["Hotel Casa or a De Pijp boutique — restaurants on the block", "Conservatorium is Stretch; mid is a canal 4-star without the garden rate"]);
    appendHotel("amsterdam", "lux", ["Conservatorium — Museumplein leftover", "De L’Europe or Waldorf Astoria — one flagship; skip King’s Day and August if you can"]);
    appendHotel("lisbon", "budget", ["The Independente or Intendente 2-star — neighborhood restaurants", "Alfama guesthouse — views, stairs, grocery the first morning"]);
    appendHotel("lisbon", "mid", ["Hotel da Baixa or a 4-star near Rossio — trains and trams", "LX Boutique or a Cais do Sodré 3-star — river, nightlife on the block"]);
    appendHotel("lisbon", "lux", ["Four Seasons Ritz Lisbon — park-adjacent flagship", "Tivoli Avenida Liberdade — one boulevard"]);
    appendHotel("iceland", "budget", ["Keflavík Airport Hotel — only the night you land or fly", "A 101 guesthouse with a kitchenette — breakfast is Bónus, not the buffet"]);
    appendHotel("iceland", "mid", ["ION City or a harbor 4-star — still not the Blue Lagoon hotel", "Selfoss or Vík mid only if this is a road trip — then the car is the lodging plan"]);
    appendHotel("iceland", "lux", ["The Retreat at Blue Lagoon — soak + room, Stretch only", "Edition Reykjavík — 101 flagship if you skip the countryside"]);
    appendHotel("bali", "budget", ["Ubud jungle guesthouse — rice-terrace walk, not Seminyak prices", "Kuta 2-star only as a crash pad near the airport"]);
    appendHotel("bali", "mid", ["Maya Ubud or a riverside 4-star — one base", "Canggu midrise with a pool — still a scooter town"]);
    appendHotel("bali", "lux", ["Bulgari or Alila Villas Uluwatu — cliff Stretch", "Como Uma or a Seminyak villa — one property"]);
    appendHotel("dubai", "budget", ["Deira 3-star near a Metro — creek, cheaper nights", "Bur Dubai heritage-adjacent 3-star — walk the souk, Metro to Downtown"]);
    appendHotel("dubai", "mid", ["Marina 4-star on the tram — walk the walkway", "Palm mid is a different transfer; stay Downtown unless the Palm is the point"]);
    appendHotel("dubai", "lux", ["Atlantis The Palm — Palm Stretch, kids assumed", "Burj Al Arab or One&Only — name-brand leftover only"]);
  }

  function thickenFood() {
    appendFood("disney", "budget", ["Refillable mug only if you will be on property most meals", "Skip a character breakfast on Lean — that is a ticketed meal, not breakfast"]);
    appendFood("disney", "mid", ["One snack credit you already priced — Dole Whip or a bakery, not both as a habit", "Sci-Fi or 50’s Prime Time over a signature on mid"]);
    appendFood("disney", "lux", ["California Grill or Space 220 — book before you fly", "Dining plan is still usually a bad buy even on Stretch"]);
    appendFood("cruise", "budget", ["Skip the café latte habit and the gelato pass", "Room-service fees add up — use it as a backup, not breakfast"]);
    appendFood("cruise", "mid", ["One specialty night if leftover covers it — not a nightly habit", "Kids soda package is often the only package that wins on a short sailing"]);
    appendFood("cruise", "lux", ["Chef’s table leftover-only", "Unlimited drinks are in Stretch — still run the break-even"]);
    appendFood("cancun", "budget", ["Coffee included; do not buy water you already paid for at the dock", "Parque de las Palapas only if the transfer is cheap"]);
    appendFood("cancun", "mid", ["La Habichuela or a Hotel Zone steakhouse — one off-resort night", "Beach-club lunch is a day-price, not a snack"]);
    appendFood("cancun", "lux", ["Puerto Morelos dinner leftover — a different transfer", "Le Blanc / Zilara specialty rooms leftover-only"]);
    appendFood("los_angeles", "budget", ["Stay in Koreatown / DTLA / the beach you picked — do not cross the basin for tacos", "Mariscos Jalisco or a taco truck is lunch, not a food tour"]);
    appendFood("los_angeles", "mid", ["Quarter / Kang Ho Dong K-Town BBQ or Bestia if you booked ahead", "Langer’s deli over a hotel restaurant"]);
    appendFood("los_angeles", "lux", ["Providence or n/naka — book before you fly", "Hotel restaurants and a WeHo-to-Santa-Monica dinner are the overrun"]);
    appendFood("nyc", "budget", ["Xi’an Famous Foods, a $1–3 slice, or Flushing / Chinatown — not three Midtown salads", "Bodega egg-and-cheese is breakfast; the hotel dining room is a tax"]);
    appendFood("nyc", "mid", ["Katz’s (share) or Russ & Daughters — then a park", "Jackson Heights / Flushing / Chinatown over Midtown"]);
    appendFood("nyc", "lux", ["Carbone, Lilia, or Le Bernardin class — leftover only", "One tasting, not a tasting every night"]);
    appendFood("paris", "budget", ["L’As du Fallafel or a neighborhood bistro — not the tower", "Skip restaurants on the hill, the museum steps, and the tower"]);
    appendFood("paris", "mid", ["Bouillon Julien or Marché des Enfants Rouges", "Fromagerie + wine is a valid dinner"]);
    appendFood("paris", "lux", ["Septime, Frenchie, or Le Comptoir — book before you fly", "Palace-hotel dining only if leftover is silly"]);
    appendFood("vegas", "budget", ["Chinatown or Downtown, not a Strip steakhouse", "Free drinks are not a meal plan"]);
    appendFood("vegas", "mid", ["Tacos El Gordo class or a food hall — walk ten minutes off the carpet", "Mon Ami Gabi or a neighborhood sit-down — one"]);
    appendFood("vegas", "lux", ["Picasso / Guy Savoy class leftover-only", "One splurge, not a steak every night"]);
    appendFood("san_francisco", "budget", ["La Taqueria / El Farolito class — Mission, stay on BART / Muni", "Skip the Wharf seafood rack"]);
    appendFood("san_francisco", "mid", ["State Bird, Zuni, or a neighborhood Italian — one reservation", "Napa is a day trip with a packed lunch, not a dinner transfer"]);
    appendFood("san_francisco", "lux", ["Atelier Crenn or Benu leftover-only", "One tasting, then neighborhood food"]);
    appendFood("san_diego", "budget", ["Fish tacos in PB or a Barrio Logan truck", "Skip the harbor dinner-cruise menu"]);
    appendFood("san_diego", "mid", ["Little Italy or North Park sit-down — one", "La Jolla dinner only if you are already there"]);
    appendFood("san_diego", "lux", ["Addison (Del Mar) leftover-only", "One splurge; Stretch does not require a steak at noon"]);
    appendFood("miami", "budget", ["Versailles or a ventanita — not Ocean Drive", "Skip beach-club bottle service on Lean"]);
    appendFood("miami", "mid", ["Joe’s Stone Crab (share) or a Wynwood table — one", "Brickell if that is where you slept"]);
    appendFood("miami", "lux", ["A named tasting leftover", "One beach-club afternoon is a day-price"]);
    appendFood("london", "budget", ["Borough or Maltby market, or a pub pie", "Meal deal is allowed; a tourist-menu roast is not the plan"]);
    appendFood("london", "mid", ["Dishoom, a Soho table, or a neighborhood Indian — one reservation", "West End prix fixe only after theatre, not every night"]);
    appendFood("london", "lux", ["Core or Kitchen Table leftover-only", "£8 pints are already in the luxury math"]);
    appendFood("rome", "budget", ["Supplì or pizza al taglio in Testaccio or Trastevere", "Skip the photo-menu on a square"]);
    appendFood("rome", "mid", ["Roscioli-adjacent or a Testaccio table — one reserved trattoria", "Coperto is a line item, not a scam"]);
    appendFood("rome", "lux", ["La Pergola leftover-only", "One splurge, then trattoria"]);
    appendFood("tokyo", "budget", ["Conveyor or standing sushi, or a ramen shop", "Skip the hotel breakfast buffet"]);
    appendFood("tokyo", "mid", ["Depachika lunch + one izakaya reservation", "Rail-station food halls are mid, not a tourist trap"]);
    appendFood("tokyo", "lux", ["A sushi counter booked before you land", "The room or the counter, rarely both"]);
    appendFood("oahu", "budget", ["Rainbow Drive-In / L&L plate lunch", "Leonard’s malasadas once, not as a meal"]);
    appendFood("oahu", "mid", ["Marukame or a neighborhood Japanese / seafood — one sit-down", "Skip nightly Kalakaua restaurant rows"]);
    appendFood("oahu", "lux", ["Alan Wong’s or Senia leftover-only", "One splurge, not five fish dinners"]);
    appendFood("maui", "budget", ["Food truck in Kihei or Paia", "Cook two nights; skip the resort breakfast buffet"]);
    appendFood("maui", "mid", ["One fish dinner, not five", "Paia or Lahaina casual over the hotel dining room"]);
    appendFood("maui", "lux", ["Mama’s Fish House leftover-only", "One named reservation, then the kitchen"]);
    appendFood("punta_cana", "budget", ["One beach-shack lunch is enough of a taste", "Skip dock-priced excursion food"]);
    appendFood("punta_cana", "mid", ["One pre-booked off-property dinner if the transfer is in the plan", "Cap Cana restaurants are a different pocket"]);
    appendFood("punta_cana", "lux", ["One Cap Cana or named tasting leftover", "Still not a nightly off-property hop"]);
    appendFood("jamaica", "budget", ["Jerk lunch off-property once, with a trusted driver", "Buy rum as a bottle, not a round"]);
    appendFood("jamaica", "mid", ["One off-property dinner with a pre-booked driver", "Skip the dock kiosk"]);
    appendFood("jamaica", "lux", ["Sandals / Couples specialty rooms are the Stretch product", "Transfer time is still a cost"]);
    appendFood("barcelona", "budget", ["Vermut + conservas, not a Ramblas paella", "Mercado lunch is allowed"]);
    appendFood("barcelona", "mid", ["One seafood dinner in Barceloneta if leftover exists", "Eixample or Born, not the Ramblas"]);
    appendFood("barcelona", "lux", ["Disfrutar leftover-only", "One splurge"]);
    appendFood("mexico_city", "budget", ["Mercado or street tacos — Condesa or Juárez, not the hotel", "Skip Polanco hotel dining on Lean"]);
    appendFood("mexico_city", "mid", ["Contramar lunch or a neighborhood table — one reservation", "Street tacos still win one night"]);
    appendFood("mexico_city", "lux", ["Pujol or Quintonil leftover-only", "One tasting"]);
    appendFood("thailand", "budget", ["Street stall + mango sticky rice", "Hotel breakfast buffets are optional"]);
    appendFood("thailand", "mid", ["One riverside or Sukhumvit sit-down", "Hotel Italian is the trap"]);
    appendFood("thailand", "lux", ["A named riverside or tasting leftover", "One splurge; Stretch does not require a mall"]);
    appendFood("nola", "budget", ["Po’boy (Parkway or a neighborhood shop), not a Bourbon breakfast", "Café du Monde once"]);
    appendFood("nola", "mid", ["Galatoire’s or Commander’s Palace class — one old-school reservation", "Keep the reservation; cut the hotel class first"]);
    appendFood("nola", "lux", ["Commander’s, Galatoire’s, or a modern tasting leftover", "Keep the reservations; cut something else"]);
    appendFood("chicago", "budget", ["Italian beef or a tavern — neighborhood, not the hotel", "One deep-dish if you must, then stop"]);
    appendFood("chicago", "mid", ["One reservation in Fulton Market or Logan Square", "Skip Mag Mile dining"]);
    appendFood("chicago", "lux", ["Alinea leftover-only", "One tasting"]);
    appendFood("amsterdam", "budget", ["Brown café, not a canal-cruise buffet", "Skip the pancake-house on the Damrak"]);
    appendFood("amsterdam", "mid", ["One Indonesian rijsttafel if leftover covers it", "Two streets off the canal"]);
    appendFood("amsterdam", "lux", ["A named tasting leftover", "One splurge"]);
    appendFood("lisbon", "budget", ["Tasca in Graça or Campo de Ourique", "Pastel de nata is a snack, plus coffee — not a meal plan"]);
    appendFood("lisbon", "mid", ["One seafood dinner in Cais do Sodré or Belém", "Not every night"]);
    appendFood("lisbon", "lux", ["A named tasting leftover", "One splurge"]);
    appendFood("iceland", "budget", ["Packed lunch on road days", "Skip the hotel breakfast buffet unless it is included"]);
    appendFood("iceland", "mid", ["One proper 101 fish dinner", "Hot-dog stand is allowed"]);
    appendFood("iceland", "lux", ["A named 101 or a lodge table leftover", "Do not eat every meal out on a Ring Road week"]);
    appendFood("bali", "budget", ["Warung again at dinner — that is the good food", "Bintang on the beach is not a $40 cocktail program"]);
    appendFood("bali", "mid", ["One nice dinner in Seminyak or Ubud", "Hotel Italian is the trap"]);
    appendFood("bali", "lux", ["A named Seminyak or Ubud table leftover", "One splurge"]);
    appendFood("dubai", "budget", ["Creekside or Deira, not a mall every day", "Skip the fountain-view restaurant on Lean"]);
    appendFood("dubai", "mid", ["One destination dinner if leftover is real", "Mall food courts are a fallback"]);
    appendFood("dubai", "lux", ["A named tasting leftover", "One splurge weekend, not seven"]);
  }

  function thickenActs() {
    appendAct("disney", "budget", ["One park per day — cheaper park after Magic Kingdom (ticketed)", "Skip a water-park add-on on Lean (ticketed)"]);
    appendAct("disney", "mid", ["Lightning Lane on Magic Kingdom or Hollywood Studios day only (ticketed)", "One Disney Springs evening (free)"]);
    appendAct("disney", "lux", ["Signature dinner + fireworks leftover-only (ticketed)", "Memory Maker only if leftover covers it (ticketed)"]);
    appendAct("cruise", "budget", ["Ship shows and the pool — already in the fare (free)", "Skip the spa menu on Lean"]);
    appendAct("cruise", "mid", ["Snorkel or beach-break on one island, not three (ticketed)", "Skip the third dock tour (ticketed)"]);
    appendAct("cruise", "lux", ["A quieter private beach or small-group tour on one island (tour)", "Spa leftover-only — already its own line"]);
    appendAct("los_angeles", "budget", ["The Broad or a free museum night Downtown (free / timed)", "Do not stack Universal and Disneyland into this lodging week"]);
    appendAct("los_angeles", "mid", ["Huntington or Getty Villa — pick one garden day (ticketed / timed)", "Venice + Santa Monica in the neighborhood you booked (free)"]);
    appendAct("los_angeles", "lux", ["Universal Express leftover-only (ticketed)", "A private architecture walk if leftover covers a guide (tour)"]);
    appendAct("nyc", "budget", ["A pay-what-you-wish museum night or a timed free hour (cheap)", "Times Square is a pass-through, not a day"]);
    appendAct("nyc", "mid", ["Met or MoMA — pick one (ticketed)", "Central Park is free; a carriage is not required"]);
    appendAct("nyc", "lux", ["Broadway reserved seat + one observatory (ticketed)", "Skip stacking three observatories"]);
    appendAct("paris", "budget", ["Eiffel from Trocadéro or Champ de Mars, not the summit on Lean (free)", "Père Lachaise or Canal Saint-Martin walk (free)"]);
    appendAct("paris", "mid", ["Sainte-Chapelle or a tower summit — pick one (ticketed)", "Marais or Latin Quarter neighborhood walk (free)"]);
    appendAct("paris", "lux", ["Versailles half-day leftover (ticketed)", "Catacombs or a reserved Sainte-Chapelle concert leftover (ticketed)"]);
    appendAct("vegas", "budget", ["Bellagio conservatory + Fremont walk (free)", "Skip a nightclub table on Lean"]);
    appendAct("vegas", "mid", ["One show — O, a mid-room, or a production (ticketed)", "Red Rock if you have a car (free / cheap)"]);
    appendAct("vegas", "lux", ["A helicopter or Grand Canyon day leftover-only (tour)", "One spa or pool-day cabana leftover (ticketed)"]);
    appendAct("san_francisco", "budget", ["Mission murals or Chinatown walk (free)", "Skip the paid cable-car loop if a bus reaches the same hill"]);
    appendAct("san_francisco", "mid", ["SFMOMA or de Young — pick one (ticketed)", "Alcatraz timed ferry — book ahead (ticketed)"]);
    appendAct("san_francisco", "lux", ["Muir Woods or a Napa small-group leftover (tour)", "Do not stack Alcatraz, Napa, and Yosemite in 5 nights"]);
    appendAct("san_diego", "budget", ["Harbor walk or Coronado ferry (cheap)", "Skip SeaWorld on Lean unless that is the trip"]);
    appendAct("san_diego", "mid", ["Zoo or USS Midway — pick one (ticketed)", "La Jolla cove snorkel if you are already north (cheap / ticketed)"]);
    appendAct("san_diego", "lux", ["Safari Park leftover (ticketed)", "Mexico day trip is a different budget"]);
    appendAct("miami", "budget", ["Little Havana walk + Cuban coffee (cheap)", "Everglades is a half-day tour, not a Lean default"]);
    appendAct("miami", "mid", ["Vizcaya or a boat — pick one (ticketed)", "Art Deco walk on Ocean Drive in daylight (free)"]);
    appendAct("miami", "lux", ["A reserved boat leftover (tour)", "Do not stack a cruise embarkation into this stay without a buffer night"]);
    appendAct("london", "budget", ["British Museum or National Gallery (free)", "Skip a paid Eye ticket on Lean"]);
    appendAct("london", "mid", ["Tower, Eye, or a West End rush — pick one (ticketed)", "Greenwich or Columbia Road (free / cheap)"]);
    appendAct("london", "lux", ["West End reserved seat + one iconic ticket (ticketed)", "Windsor / Bath leftover (ticketed / tour)"]);
    appendAct("rome", "budget", ["Trastevere evening walk (free)", "Skip the golf-cart forum tour"]);
    appendAct("rome", "mid", ["Vatican Museums or Borghese — pick one (ticketed)", "Fountains at dusk are free"]);
    appendAct("rome", "lux", ["Colosseum + Vatican on different days (ticketed)", "A small-group catacombs or food walk leftover (tour)"]);
    appendAct("tokyo", "budget", ["Senso-ji and the river — Asakusa (free)", "Convenience-store picnic in a park (cheap)"]);
    appendAct("tokyo", "mid", ["teamLab, a tower, or a museum — pick one (ticketed)", "Kamakura or Nikko only if leftover covers the JR math (ticketed)"]);
    appendAct("tokyo", "lux", ["A guided food walk leftover (tour)", "Kyoto is a different trip — do not fake it as a Tokyo day"]);
    appendAct("oahu", "budget", ["Pearl Harbor is ticketed and somber — one morning, not a beach day", "Skip a circle-island tour on Lean; the bus is slower and cheaper"]);
    appendAct("oahu", "mid", ["Hanauma Bay — reserve (ticketed)", "Lanikai lookout + Kailua is a car day (free / car)"]);
    appendAct("oahu", "lux", ["A small-group snorkel leftover (tour)", "Do not stack a neighbor-island hop into 5 nights without a second fare"]);
    appendAct("maui", "budget", ["Skip Road to Hana as a rushed day on Lean", "Sunrise from a parking lot you already paid, not a tour van"]);
    appendAct("maui", "mid", ["Haleakalā sunrise is ticketed and a 2 a.m. wake-up — pick it on purpose", "A second beach day still (free)"]);
    appendAct("maui", "lux", ["Molokini boat leftover-only (tour)", "Do not stack Hana, Haleakalā, and a boat in 4 days"]);
    appendAct("cancun", "budget", ["Snorkel from the property if the reef is there (included / cheap)", "Skip the dock-priced catamaran on Lean"]);
    appendAct("cancun", "mid", ["Isla Mujeres ferry or a cenote — pick one (ticketed / ferry)", "Chichén Itzá only if leftover covers a trusted tour (tour)"]);
    appendAct("cancun", "lux", ["A small-group ruin or whale-shark season leftover (tour)", "Tulum ruins + beach is a different lodging math"]);
  }

  function thickenFallbacks() {
    appendFallbackHotel("ai", "budget", ["Garden-view on purpose — ocean-view is an upsell", "Confirm the airport transfer is in the rate"]);
    appendFallbackHotel("ai", "mid", ["Adults-only 4-star if there are no kids", "One property, not a two-resort hop"]);
    appendFallbackHotel("ai", "lux", ["Overwater or swim-up leftover-only", "Villa only if leftover covers the jump from mid"]);
    appendFallbackHotel("domestic", "budget", ["Neighborhood 2-star with a grocery in walking distance", "Skip airport lodging except the night you fly"]);
    appendFallbackHotel("domestic", "mid", ["Inn or 3-star in the restaurant neighborhood", "One room, not a suite, unless leftover is real"]);
    appendFallbackHotel("domestic", "lux", ["Historic grande dame or park-adjacent 5-star", "Do not also buy every paid tour"]);
    appendFallbackHotel("europe", "budget", ["2-star walk-up near a market street — pack light, stairs are common", "Airport-strip hotels are a taxi tax"]);
    appendFallbackHotel("europe", "mid", ["Aparthotel 4-star if you will grocery two breakfasts", "Hotel near the main station only if you arrive late"]);
    appendFallbackHotel("europe", "lux", ["Design flagship with a real neighborhood, not a ring-road spa", "Suite with a view leftover-only"]);
    appendFallbackHotel("hawaii", "budget", ["2-star a block off the sand — same beach, less resort fee", "Skip a rental car if the bus reaches the beach and the store"]);
    appendFallbackHotel("hawaii", "mid", ["Condo-plus in the same beach town if you will cook two dinners", "Request garden vs ocean on purpose"]);
    appendFallbackHotel("hawaii", "lux", ["Adults-only or villa if leftover is real", "Do not also book every snorkel and helicopter"]);
    appendFallbackHotel("caribbean", "budget", ["Garden-view AI — skip the ocean-view upsell", "Town guesthouse only if you will eat out and take local buses"]);
    appendFallbackHotel("caribbean", "mid", ["Adults-only 4-star if there are no kids", "Transfer in the rate, not a dock surprise"]);
    appendFallbackHotel("caribbean", "lux", ["Overwater or cliff villa leftover-only", "One island, one resort"]);
    appendFallbackHotel("mexico", "budget", ["Riu / Palace-class AI if this is a beach week", "Skip the ocean-view upsell and the timeshare pitch"]);
    appendFallbackHotel("mexico", "mid", ["Hyatt Ziva / Live Aqua class if all-inclusive is the point", "One neighborhood — traffic is the hidden cost"]);
    appendFallbackHotel("mexico", "lux", ["Adults-only beach premium", "One property"]);
    appendFallbackHotel("asia", "budget", ["Hostel-plus in the old city or night-market pocket", "Convenience-store breakfast is the plan, not a compromise"]);
    appendFallbackHotel("asia", "mid", ["Riverside or night-market-adjacent boutique", "One city base — skip the three-island hop"]);
    appendFallbackHotel("asia", "lux", ["Ryokan or courtyard hotel if that is the point of the trip", "Suite leftover-only"]);
    appendFallbackHotel("oceania", "budget", ["Neighborhood 3-star, not the airport strip", "Apartment with a kitchen if the stay is 5+ nights"]);
    appendFallbackHotel("oceania", "mid", ["Boutique in the walkable core", "Campervan only if that is the trip — it replaces the hotel line"]);
    appendFallbackHotel("oceania", "lux", ["Wilderness lodge leftover-only", "One base"]);
    appendFallbackHotel("africa", "budget", ["City 3-star near a tram or BRT", "Skip the hotel dinner most nights"]);
    appendFallbackHotel("africa", "mid", ["4-star near the waterfront or medina edge", "One city, then a separate lodge line if you add safari"]);
    appendFallbackHotel("africa", "lux", ["Cape or Nile flagship", "Do not double-pay for every optional excursion"]);
    appendFallbackHotel("middleeast", "budget", ["Heritage-district 3-star — souk walking", "Skip the Marina address on a Lean week"]);
    appendFallbackHotel("middleeast", "mid", ["Palm or Downtown — pick one pocket", "Hotel breakfast only when it is in the rate"]);
    appendFallbackHotel("middleeast", "lux", ["Palm or Downtown flagship — one", "Desert camp only if leftover covers a night out of the city"]);
    appendFallbackHotel("latam", "budget", ["Value AI only if this is a beach week", "Altitude and street food are the trip in the cities"]);
    appendFallbackHotel("latam", "mid", ["Iberostar / Hyatt Ziva class if all-inclusive", "One base — intercity buses need their own night"]);
    appendFallbackHotel("latam", "lux", ["Relais-style casa leftover", "One property"]);
    appendFallbackHotel("city", "budget", ["Airport hotel only the night you fly", "Kitchenette if grocery breakfasts are the plan"]);
    appendFallbackHotel("city", "mid", ["Brand 4-star on transit", "Location over a rooftop you will use twice"]);
    appendFallbackHotel("city", "lux", ["Park- or water-adjacent flagship", "Do not also buy every paid tour"]);
    appendFallbackFood("ai", "budget", ["Tips and bottled water you already paid for are the leak", "One beach-town lunch only with a pre-booked ride"]);
    appendFallbackFood("ai", "mid", ["Premium in-resort nights are the mid upgrade", "Beach-club lunch is a day-price"]);
    appendFallbackFood("ai", "lux", ["Specialty rooms leftover-only", "Still not a nightly hop"]);
    appendFallbackFood("domestic", "budget", ["Hotel restaurants are the expensive version of the same plate", "Food hall or a neighborhood counter at lunch"]);
    appendFallbackFood("domestic", "mid", ["One reserved neighborhood table", "Stay on transit — a crosstown dinner is a second fare"]);
    appendFallbackFood("domestic", "lux", ["One named tasting leftover-only", "One splurge, not a tasting every night"]);
    appendFallbackFood("europe", "budget", ["Grocery one picnic", "Neighborhood trattoria / tasca / bistro — not the monument square"]);
    appendFallbackFood("europe", "mid", ["Wine from a shop is a valid dinner", "One reserved bistro"]);
    appendFallbackFood("europe", "lux", ["A named table booked before you fly", "Palace-hotel dining leftover-only"]);
    appendFallbackFood("hawaii", "budget", ["Malasadas or shave ice once, not as a meal", "Plate lunch or a food truck"]);
    appendFallbackFood("hawaii", "mid", ["One fish sit-down", "Skip nightly resort rows"]);
    appendFallbackFood("hawaii", "lux", ["One named table leftover", "Do not stack every fish dinner"]);
    appendFallbackFood("caribbean", "budget", ["Coffee included", "Skip dock kiosks"]);
    appendFallbackFood("caribbean", "mid", ["Packed lunch on excursion days", "Transfer is part of the food price"]);
    appendFallbackFood("caribbean", "lux", ["Specialty rooms leftover-only", "One island"]);
    appendFallbackFood("mexico", "budget", ["AI guests: eat on-property plus one taco night", "Dinner in the neighborhood, not the hotel"]);
    appendFallbackFood("mexico", "mid", ["One reservation", "Stay in one colonia"]);
    appendFallbackFood("mexico", "lux", ["A named tasting leftover", "One splurge"]);
    appendFallbackFood("asia", "budget", ["Skip the hotel buffet", "Izakaya / night market / neighborhood shop"]);
    appendFallbackFood("asia", "mid", ["Station depachika is mid, not a trap", "One reservation"]);
    appendFallbackFood("asia", "lux", ["A counter or tasting booked before you land", "The room or the counter, rarely both"]);
    appendFallbackFood("oceania", "budget", ["Skip hotel restaurants", "Food hall or a counter"]);
    appendFallbackFood("oceania", "mid", ["One reservation", "One city"]);
    appendFallbackFood("oceania", "lux", ["A named table leftover", "One splurge"]);
    appendFallbackFood("africa", "budget", ["Buy water in a shop", "Neighborhood, not the tourist row"]);
    appendFallbackFood("africa", "mid", ["One reservation", "Trusted driver if you leave the core"]);
    appendFallbackFood("africa", "lux", ["A named table leftover", "Lodge dinners are already priced — do not add a second tasting"]);
    appendFallbackFood("middleeast", "budget", ["Skip the desert-tour buffet upsell", "Cheap eats away from the icon"]);
    appendFallbackFood("middleeast", "mid", ["One destination restaurant", "Metro, not a taxi to every meal"]);
    appendFallbackFood("middleeast", "lux", ["A named tasting leftover", "One weekend splurge"]);
    appendFallbackFood("latam", "budget", ["AI: on-property plus one local lunch", "Market or a counter"]);
    appendFallbackFood("latam", "mid", ["One reservation", "One distrito per night"]);
    appendFallbackFood("latam", "lux", ["A named tasting leftover", "One splurge"]);
    appendFallbackFood("city", "budget", ["Transit card beats taxis to dinner", "Market or food hall"]);
    appendFallbackFood("city", "mid", ["One reserved table", "Stay in one neighborhood"]);
    appendFallbackFood("city", "lux", ["One named leftover", "One splurge"]);
    appendFallbackAct("ai", "budget", ["Snorkel from the property if it exists (included / cheap)", "Skip the dock-priced catamaran on Lean"]);
    appendFallbackAct("ai", "mid", ["A second dock tour is the overrun", "Nightlife on-property first"]);
    appendFallbackAct("ai", "lux", ["One better boat or ruin day, not three (ticketed)", "Spa leftover-only"]);
    appendFallbackAct("domestic", "budget", ["Transit day pass beats a rideshare loop", "Skip a hop-on bus on Lean"]);
    appendFallbackAct("domestic", "mid", ["A second cheap / free morning (free)", "Day trips need their own lunch and transfer"]);
    appendFallbackAct("domestic", "lux", ["A neighborhood walk still (free)", "Do not stack three paid towers"]);
    appendFallbackAct("europe", "budget", ["A neighborhood that is not the postcard square (free)", "Skip the hop-on bus"]);
    appendFallbackAct("europe", "mid", ["A second museum or a garden (ticketed / free)", "Day trip only if leftover covers the train"]);
    appendFallbackAct("europe", "lux", ["A small-group walk leftover (tour)", "Do not stack a palace, a catacomb, and a dinner cruise in one day"]);
    appendFallbackAct("hawaii", "budget", ["Grocery picnic (cheap)", "Skip the circle-island van on Lean"]);
    appendFallbackAct("hawaii", "mid", ["A scenic drive only if you already have the car (car)", "Sunrise tickets are a 2 a.m. choice — pick on purpose"]);
    appendFallbackAct("hawaii", "lux", ["One ticketed sunrise or bay, not both (ticketed)", "Neighbor-island hops are a second fare"]);
    appendFallbackAct("caribbean", "budget", ["Skip the first dock kiosk", "Snorkel from shore if the reef is there (cheap)"]);
    appendFallbackAct("caribbean", "mid", ["A second tour is the overrun", "Nightlife on-property first"]);
    appendFallbackAct("caribbean", "lux", ["Beach still wins (included)", "Spa leftover-only"]);
    appendFallbackAct("mexico", "budget", ["One museum if the city has a great free or cheap one (ticketed / cheap)", "Skip timeshare-day tours"]);
    appendFallbackAct("mexico", "mid", ["Beach or centro for the rest", "Long ruin days need a trusted driver"]);
    appendFallbackAct("mexico", "lux", ["A neighborhood morning still (free)", "Do not stack two ruin days and a beach club"]);
    appendFallbackAct("asia", "budget", ["Convenience-store picnic in a park (cheap)", "A neighborhood that is not the first postcard (free)"]);
    appendFallbackAct("asia", "mid", ["A short rail day trip only if leftover covers it (ticketed)", "Skip a five-temple checklist"]);
    appendFallbackAct("asia", "lux", ["A neighborhood morning still (free)", "A second city is a different trip"]);
    appendFallbackAct("oceania", "budget", ["One cheap ferry if that is the postcard (cheap)", "Skip every adventure add-on on Lean"]);
    appendFallbackAct("oceania", "mid", ["A day trip only if leftover covers it (tour / car)", "Wildlife tours are mid, not automatic"]);
    appendFallbackAct("oceania", "lux", ["A free walk still (free)", "Do not stack every adventure"]);
    appendFallbackAct("africa", "budget", ["Skip a safari-priced day if this is a city week", "Trusted driver > random taxis for longer hops"]);
    appendFallbackAct("africa", "mid", ["A second cheap morning (free / cheap)", "Safari is a different lodging line"]);
    appendFallbackAct("africa", "lux", ["A walk still (free)", "Do not double-pay optional lodge extras"]);
    appendFallbackAct("middleeast", "budget", ["Skip the desert-tour upsell on day one", "Metro to the icon, photograph from the street first"]);
    appendFallbackAct("middleeast", "mid", ["A souk morning (free)", "Summer midday is indoor on purpose"]);
    appendFallbackAct("middleeast", "lux", ["A heritage walk still (free)", "Luxury is a weekend of activities, not seven paid tours"]);
    appendFallbackAct("latam", "budget", ["One cheap museum or a mercado (cheap)", "Skip the tourist-taxi loop"]);
    appendFallbackAct("latam", "mid", ["Altitude days need slack, not a second tour", "Trusted driver for longer hops"]);
    appendFallbackAct("latam", "lux", ["A walk still (free)", "Do not stack two long tours and a late dinner"]);
    appendFallbackAct("city", "budget", ["Skip the hop-on bus", "Transit pass beats a taxi loop"]);
    appendFallbackAct("city", "mid", ["A second cheap morning (free)", "Day trips need lunch and a transfer"]);
    appendFallbackAct("city", "lux", ["A neighborhood walk still (free)", "Do not stack three paid towers"]);
  }

  function installFullRecs() {
    P.HOTEL_EXAMPLES["anaheim"] = {
      budget: { why: "Harbor Blvd / Downtown Disney walking. A cheap LA room plus a 90-minute transfer is not Lean.", picks: [
        "Candy Cane Inn — classic Harbor Blvd, walk or a short shuttle to the gates",
        "Tropicana Inn or Castle Inn & Suites — value, request a room away from the boulevard if you can",
        "Anaheim Desert Inn & Suites — limited-service, walk to Downtown Disney",
        "Howard Johnson Anaheim or a Harbor 2-star — garden-court, skip a Santa Monica hotel",
        "Pixar Place is mid; Lean stays off-property and groceries breakfast"
      ] },
      mid: { why: "One Disney hotel or a GardenWalk 3–4 star. Parking is a line if you rent a car you will not use.", picks: [
        "Pixar Place Hotel — on-property, walk to Downtown Disney, still a bus or walk to the gates",
        "Hotel Lulu — walkable to the parks, no monorail premium",
        "Hilton Anaheim or Anaheim Marriott — Convention Center campus, walk or a short shuttle",
        "Desert Palms Hotel & Suites — suite-ish mid if the party will share a kitchenette",
        "Stay in Anaheim. Los Angeles lodging is a different day trip"
      ] },
      lux: { why: "Grand Californian or Disneyland Hotel — leftover only. Club level is a nightly number.", picks: [
        "Disney’s Grand Californian — Deluxe, walk to California Adventure",
        "Disneyland Hotel — on-property, monorail-adjacent campus",
        "JW Marriott Anaheim Resort — off-property Stretch with a real pool",
        "The Westin Anaheim Resort — newer tower, still a shuttle or walk",
        "Do not also book a Santa Monica night in the same 5-night week"
      ] }
    };
    P.FOOD_PICKS["anaheim"] = {
      note: "Park food is the overrun. Grocery breakfast and one table-service beat a dining plan.",
      budget: [
        "Breakfast: grocery run (Albertsons / Target) + a Downtown Disney bakery",
        "Lunch: mobile-order QS in the park you already paid to enter",
        "Dinner: Harbor Blvd casual or Downtown Disney QS — skip character dining on Lean",
        "Porto’s is a Burbank / Downey detour, not an Anaheim breakfast",
        "Refillable mug only if you will be on property most meals"
      ],
      mid: [
        "Breakfast: food-court or hotel included only if it is in the rate",
        "Lunch: QS + one snack you already priced",
        "Dinner: one table-service — Carthay Circle or Lamplight Lounge if leftover covers it",
        "Downtown Disney sit-down over a character breakfast on mid",
        "Skip the dining plan; pay as you go"
      ],
      lux: [
        "Breakfast: one character meal leftover-only — book before you fly",
        "Lunch: QS or a second table-service, not three sit-downs",
        "Dinner reservation: Napa Rose or Carthay Circle — leftover",
        "Club 33 is not a plan",
        "Dining plan is still usually a bad buy on Stretch"
      ]
    };
    P.ACTIVITIES["anaheim"] = {
      budget: [
        "One park per day — Disneyland or California Adventure, no Hopper (ticketed)",
        "Rope drop + mobile order; skip Lightning Lane on Lean (free tactic)",
        "Downtown Disney evening, not a third ticketed thing (free)",
        "This lodging is Anaheim — not a Getty / Griffith / Universal stack",
        "Halloween Time and Christmas weeks are peak; price the month first"
      ],
      mid: [
        "Hopper only if you will switch parks midday (ticketed)",
        "Lightning Lane on the Disneyland park day, not both days (ticketed)",
        "One Downtown Disney or hotel-hop evening (free)",
        "Skip a third-party tour of “homes of the stars” from here",
        "Universal Studios is a Los Angeles day with its own ticket math"
      ],
      lux: [
        "Park Hopper + Lightning Lane (ticketed)",
        "Early entry from a Deluxe hotel (included with that lodging)",
        "World of Color / fireworks dining leftover-only (ticketed)",
        "A second park day still beats a Hollywood add-on from Anaheim",
        "Do not stack Disneyland, Universal, and a beach day in 4 nights"
      ]
    };
    P.HOTEL_EXAMPLES["key_west"] = {
      budget: { why: "Old Town walkable. A cheap room on Stock Island plus a nightly cab is not Lean.", picks: [
        "The Big Ruby Key West — guesthouse, walk to Duval, no car",
        "Caribbean House or a Truman Annex-adjacent inn — quieter pocket",
        "Key West hostel / Seashell Motel class — Lean only, pack light",
        "Duval House-adjacent 2-star a block off the bar strip",
        "Skip an EYW-adjacent motel if you will Uber downtown every meal"
      ] },
      mid: { why: "Old Town boutique. Parking is a line; most people should not rent a car.", picks: [
        "The Gardens Hotel — Old Town, pool courtyard, walk to dinner",
        "Marquesa Hotel — Duval-adjacent, quieter than the bar block",
        "Island House or Kimpton Palms — walkable mid",
        "Ocean Key Resort — Sunset Pier pocket if leftover covers the address",
        "One neighborhood. Stock Island is a different commute"
      ] },
      lux: { why: "Waterfront flagship. Sunset is free from the sidewalk; the room is the Stretch.", picks: [
        "Casa Marina — beach-adjacent historic, south of Duval",
        "The Reach Key West — Waldorf, walk to the sand",
        "Pier House or The Marker Waterfront — Old Town leftover",
        "Oceans Edge if you want a marina campus and a shuttle",
        "Do not also book a Miami night unless this is a drive-down"
      ] }
    };
    P.FOOD_PICKS["key_west"] = {
      note: "Mallory menus are a tax. Cuban breakfast and one named dinner win.",
      budget: [
        "Breakfast: Cuban Coffee Queen or a ventanita, not the hotel",
        "Lunch: Garbo’s Grill or Eaton Street Seafood — counter, not Mallory",
        "Dinner: El Siboney Cuban, stay off Duval’s tourist row",
        "Key lime pie once, not as a meal plan",
        "Happy-hour conch fritter is a snack, not dinner"
      ],
      mid: [
        "Breakfast: Cuban coffee + toastado",
        "Lunch: Pepe’s Café or a harbor casual",
        "Dinner: Blue Heaven — go early, leftover covers the wait",
        "One Duval sit-down, not five",
        "Grocery a beach day if you are at Fort Zach"
      ],
      lux: [
        "Breakfast: still a café",
        "Lunch: a proper sit-down off the square",
        "Dinner reservation: Louie’s Backyard or Hot Tin Roof leftover",
        "Nine One Five if leftover is real",
        "One splurge, then Cuban"
      ]
    };
    P.ACTIVITIES["key_west"] = {
      budget: [
        "Mallory sunset from the sidewalk — skip a paid pier ticket on Lean (free)",
        "Fort Zachary Taylor beach + fort (ticketed / cheap)",
        "Duval walk in daylight; the bar crawl is optional (free)",
        "Southernmost Point is a photo, not a morning (free)",
        "Skip a parasail upsell on Lean"
      ],
      mid: [
        "Fort Zach snorkel or a cheap boat — pick one (ticketed)",
        "Hemingway House timed ticket (ticketed)",
        "Sunset sail leftover if the sidewalk sunset was not enough (tour)",
        "Dry Tortugas is a full ferry day — only if leftover covers it (ticketed)",
        "A second beach morning still (free)"
      ],
      lux: [
        "Private sunset sail leftover (tour)",
        "Dry Tortugas Yankee Freedom day leftover (ticketed)",
        "A second historic ticket — Custom House or Fort Zach (ticketed)",
        "Do not stack Tortugas, a sunset sail, and a seaplane in 3 nights",
        "Old Town walk still earns dusk (free)"
      ]
    };
    P.HOTEL_EXAMPLES["philadelphia"] = {
      budget: { why: "Center City or Old City. A cheap airport room is a SEPTA tax you will resent.", picks: [
        "Apple Hostels or a Center City hostel-plus — walk to a Market-Frankford stop",
        "Club Quarters or a compact 2-star near City Hall",
        "Home2 / Hampton Center City — limited-service, grocery downstairs",
        "Old City 2-star if Independence is the whole trip",
        "Skip University City unless that is the neighborhood you will eat in"
      ] },
      mid: { why: "Walk-to-Independence or walk-to-Rittenhouse. SEPTA beats a rental car.", picks: [
        "The Notary Hotel — City Hall pocket, walk to Reading Terminal",
        "Kimpton Hotel Monaco — Independence Mall walking",
        "The Logan Philadelphia — Benjamin Franklin Parkway, museum mile",
        "Canopy by Hilton Center City or The Independent — one neighborhood",
        "Do not split Old City and University City in a 3-night stay"
      ] },
      lux: { why: "Rittenhouse or Parkway flagship. Hotel tax is already in the plan.", picks: [
        "Four Seasons Philadelphia — Logan Square leftover",
        "The Rittenhouse — square-adjacent",
        "The Bellevue or Fitler Club — Stretch if leftover is real",
        "One flagship. A second suite is not the weekend",
        "Independence timed entry is the ticket, not a palace breakfast"
      ] }
    };
    P.FOOD_PICKS["philadelphia"] = {
      note: "Reading Terminal is the cheap-rich lunch. Cheesesteak is one meal, not a pilgrimage.",
      budget: [
        "Breakfast: Reading Terminal bakery or a Center City café, not the hotel",
        "Lunch: Terminal stalls — roast pork at DiNic’s class, or a market plate",
        "Dinner: one cheesesteak (Pat’s / Geno’s tourist, or a neighborhood shop) then stop",
        "Italian Market if you are already in South Philly",
        "Skip three $28 Rittenhouse salads on Lean"
      ],
      mid: [
        "Breakfast: café most mornings",
        "Lunch: Reading Terminal or a proper casual",
        "Dinner: one reservation — Zahav leftover-adjacent, or a neighborhood Italian",
        "Cheesesteak once; roast pork is the local argument",
        "Stay on SEPTA — a crosstown dinner is a second fare"
      ],
      lux: [
        "Breakfast: still a café",
        "Lunch: a sit-down on the Parkway or Old City",
        "Dinner reservation: Zahav or a named tasting leftover-only",
        "One splurge, then Terminal leftovers",
        "Hotel restaurants are the expensive version of the same plate"
      ]
    };
    P.ACTIVITIES["philadelphia"] = {
      budget: [
        "Independence Hall timed entry + Liberty Bell (free / timed)",
        "Reading Terminal morning (free / cheap)",
        "One museum with a pay-what-you-wish or a city-pass day — Barnes is mid (ticketed / cheap)",
        "Love Park / City Hall walk-through, not a hop-on bus (free)",
        "Skip a carriage loop on Lean"
      ],
      mid: [
        "Independence timed + one Museum Mile ticket — Barnes or PMA (ticketed)",
        "Eastern State Penitentiary if leftover covers a half day (ticketed)",
        "Old City evening walk (free)",
        "Franklin Institute only if the party is kids-first (ticketed)",
        "SEPTA day pass beats a rideshare loop"
      ],
      lux: [
        "Barnes + PMA on different days leftover (ticketed)",
        "A reserved food walk leftover (tour)",
        "Independence still — Stretch does not cancel the hall (timed)",
        "Do not stack three interiors and a cheesesteak tour in one day",
        "Spruce Street Harbor Park in season is free"
      ]
    };
    P.HOTEL_EXAMPLES["atlanta"] = {
      budget: { why: "Downtown or Midtown on the BeltLine / MARTA. A cheap airport hotel is a rideshare habit.", picks: [
        "HI Atlanta or a Downtown hostel-plus — walk to a MARTA stop",
        "Glenn Hotel-adjacent limited-service Downtown — Centennial pocket",
        "Hampton or Home2 Midtown — limited-service, grocery in walking distance",
        "Hotel Indigo Midtown-adjacent 2–3 star if you will walk Piedmont",
        "Skip a Cumberland / Buckhead interstate cloverleaf on Lean"
      ] },
      mid: { why: "Midtown or Ponce / Inman pocket. The BeltLine is the walk; MARTA is the backup.", picks: [
        "Hotel Clermont — Ponce, walk to the BeltLine and Ponce City Market",
        "The Ellis or Kimpton Sylvan — Downtown / Midtown walkable",
        "The Georgian Terrace — Midtown, Fox Theatre pocket",
        "Graduate Atlanta or a Midtown 3–4 star — one neighborhood",
        "Do not split Buckhead and the Aquarium hotel in a 3-night stay"
      ] },
      lux: { why: "Midtown flagship. Convention weeks are not the value window.", picks: [
        "Four Seasons Atlanta — Midtown leftover",
        "St. Regis Atlanta — Buckhead Stretch; you traded BeltLine walking",
        "The Whitley — Buckhead flagship if leftover is real",
        "One tower. Two neighborhoods is a parking tax",
        "Piedmont Park is free; the room does not need a spa"
      ] }
    };
    P.FOOD_PICKS["atlanta"] = {
      note: "Ponce City Market and a meat-and-three beat a hotel restaurant.",
      budget: [
        "Breakfast: West Egg or a Midtown café, not the hotel",
        "Lunch: Ponce City Market food hall or a BeltLine counter",
        "Dinner: Mary Mac’s Tea Room — meat-and-three, the Lean classic",
        "Varasano’s or a neighborhood pizza if you skip the tourist row",
        "Skip a Buckhead steakhouse on Lean"
      ],
      mid: [
        "Breakfast: café most mornings",
        "Lunch: Ponce City Market or Krog Street Market",
        "Dinner: Fox Bros. Bar-B-Q or a BeltLine sit-down — one reservation",
        "Mary Mac’s still wins one night",
        "Stay on the BeltLine — a Buckhead dinner is a second fare"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down in Midtown",
        "Dinner reservation: a named Midtown or Westside tasting leftover",
        "One splurge, then a meat-and-three",
        "Hotel restaurants are Atlanta-priced for people who will not walk"
      ]
    };
    P.ACTIVITIES["atlanta"] = {
      budget: [
        "BeltLine Eastside Trail + Ponce City Market (free / cheap)",
        "Piedmont Park (free)",
        "Georgia Aquarium is a ticketed morning, not a whole trip (ticketed)",
        "MLK National Historical Park (free / cheap)",
        "Skip a hop-on bus on Lean"
      ],
      mid: [
        "Aquarium or World of Coca-Cola — pick one (ticketed)",
        "BeltLine + Krog Street (free / cheap)",
        "Atlanta History Center or a Fox Theatre tour leftover (ticketed)",
        "Piedmont still (free)",
        "MARTA day pass beats a rideshare loop"
      ],
      lux: [
        "Aquarium + a second ticketed leftover (ticketed)",
        "A reserved food walk leftover (tour)",
        "BeltLine morning still (free)",
        "Do not stack Aquarium, Coca-Cola, and a studio tour in one day",
        "A Braves game is a night-price if leftover covers it (ticketed)"
      ]
    };
    P.HOTEL_EXAMPLES["dallas"] = {
      budget: { why: "Downtown / Deep Ellum / Bishop Arts — pick one pocket. DFW-adjacent is a car tax.", picks: [
        "Hampton or Homewood Downtown — limited-service, DART downstairs",
        "The Statler-adjacent 2-star — walk to Downtown",
        "Deep Ellum 2-star if that is the night you came for",
        "A Design District limited-service — grocery in walking distance",
        "Skip a Las Colinas / Galleria cloverleaf on Lean"
      ] },
      mid: { why: "Walkable Downtown or a Bishop Arts / Oak Cliff night. DART beats surge pricing.", picks: [
        "The Statler Dallas — Downtown historic, walk to the Arts District",
        "Hotel ZaZa or a Uptown 3–4 star — one pocket",
        "Graduate Dallas or Hall Arts-adjacent mid",
        "The Adolphus — Downtown grande dame without a suite",
        "Do not split Frisco and Downtown in a 3-night stay"
      ] },
      lux: { why: "Arts District or Uptown flagship. State Fair week is not the value window.", picks: [
        "The Ritz-Carlton Dallas — Uptown leftover",
        "Hall Arts Hotel — Arts District Stretch",
        "The Joule — Downtown design flagship",
        "Rosewood Mansion on Turtle Creek — leftover, car assumed",
        "One flagship"
      ] }
    };
    P.FOOD_PICKS["dallas"] = {
      note: "Tex-Mex and a food hall beat a steakhouse every night.",
      budget: [
        "Breakfast: café or a kolache, not the hotel",
        "Lunch: Trinity Groves or a food hall — counter",
        "Dinner: Tex-Mex in the neighborhood you booked",
        "Pecan Lodge leftover-adjacent; Lean is a taco plate",
        "Skip a tourist steakhouse on Lean"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual in Deep Ellum or Bishop Arts",
        "Dinner: one reservation — Pecan Lodge or a neighborhood steak",
        "Stay in one pocket",
        "Uptown dinner only if you slept Uptown"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named steakhouse leftover-only",
        "One splurge, then Tex-Mex",
        "Hotel restaurants are the overrun"
      ]
    };
    P.ACTIVITIES["dallas"] = {
      budget: [
        "Arts District walk + a free museum hour if the calendar lines up (free / cheap)",
        "Klyde Warren Park (free)",
        "Sixth Floor Museum is a ticketed morning (ticketed)",
        "Deep Ellum daylight mural walk (free)",
        "Skip a hop-on bus on Lean"
      ],
      mid: [
        "Sixth Floor or Perot — pick one (ticketed)",
        "Klyde Warren + Arts District (free)",
        "Bishop Arts afternoon (free / cheap)",
        "A Dallas Cowboys / game night is a separate ticket (ticketed)",
        "DART day pass beats a rideshare loop"
      ],
      lux: [
        "A reserved Arts District ticket leftover (ticketed)",
        "Perot + Sixth Floor on different days leftover",
        "A neighborhood walk still (free)",
        "Do not stack Fair Park, a stadium, and two museums in one day",
        "State Fair is a day-price in October (ticketed)"
      ]
    };
    P.HOTEL_EXAMPLES["houston"] = {
      budget: { why: "Museum District / Midtown / Montrose. IAH lodging is a transfer, not a trip.", picks: [
        "Hampton or Home2 Downtown / Midtown — limited-service, Metro rail",
        "Hotel ICON-adjacent 2-star Downtown",
        "Montrose 2-star if that is the restaurant neighborhood",
        "Museum District limited-service — walk to Hermann Park",
        "Skip an Energy Corridor cloverleaf on Lean"
      ] },
      mid: { why: "Walk-to-museums or walk-to-Montrose. Humidity is free; a rental car is not required in the core.", picks: [
        "Hotel ICON — Downtown historic, walk to rail",
        "The Lancaster — Downtown theater pocket",
        "Le Méridien Houston Downtown or a Midtown 3–4 star",
        "Hotel ZaZa Houston — Museum District mid-plus",
        "One pocket. The Galleria is a different commute"
      ] },
      lux: { why: "Museum District or Downtown flagship. Rodeo weeks are not the value window.", picks: [
        "The Post Oak Hotel — Galleria-adjacent Stretch, car assumed",
        "Four Seasons Houston — Downtown leftover",
        "Hotel Alessandra — Downtown flagship",
        "One tower",
        "The reservation is often the better splurge"
      ] }
    };
    P.FOOD_PICKS["houston"] = {
      note: "Houston is a food city at mid-range prices. Hotel restaurants are the tax.",
      budget: [
        "Breakfast: kolache or a café, not the hotel",
        "Lunch: taco truck or a food hall — Montrose / EaDo",
        "Dinner: Viet-Cajun or Tex-Mex in the neighborhood you booked",
        "Ninfa’s on Navigation is a pilgrimage once, not a meal plan",
        "Skip a steakhouse on Lean"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual in Montrose",
        "Dinner: one reservation — Underbelly-class or a neighborhood table",
        "Stay in one pocket",
        "Katy Freeway dinner is a transfer"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge",
        "Hotel dining rooms are Houston-priced for people who will not drive 15 minutes"
      ]
    };
    P.ACTIVITIES["houston"] = {
      budget: [
        "Hermann Park + a Museum District exterior walk (free)",
        "One free / cheap museum hour if the calendar lines up (free / cheap)",
        "Buffalo Bayou walk (free)",
        "Space Center Houston is a half-day and a transfer — not Lean default (ticketed)",
        "Skip a hop-on bus"
      ],
      mid: [
        "MFAH or Houston Museum of Natural Science — pick one (ticketed)",
        "Hermann Park + Bayou (free)",
        "Space Center only if leftover covers the half day (ticketed)",
        "Menil Collection is free — go (free)",
        "Metro rail beats a rental in the core"
      ],
      lux: [
        "MFAH + Menil leftover (ticketed / free)",
        "Space Center leftover (ticketed)",
        "A neighborhood walk still (free)",
        "Do not stack NASA, a stadium, and two museums in one day",
        "Rodeo is a night-price in season (ticketed)"
      ]
    };
    P.HOTEL_EXAMPLES["san_antonio"] = {
      budget: { why: "River Walk walking, one or two bridges off the postcard. Airport lodging is a taxi tax.", picks: [
        "Crockett Hotel — Alamo-adjacent value, walk the River Walk",
        "A River Walk 2-star a block off the restaurant row",
        "Hampton or Drury Downtown — limited-service, breakfast-in-rate if that is the product",
        "Hotel Havana-adjacent 2-star on the quieter bend",
        "Skip a Fiesta Texas / SeaWorld cloverleaf unless that is the trip"
      ] },
      mid: { why: "River Walk boutique or Pearl. A car is a parking line downtown.", picks: [
        "Hotel Emma — Pearl, walk to the food hall",
        "Hotel Valencia Riverwalk — walkable mid",
        "Mokara Hotel & Spa — River Walk 4-star",
        "Hotel Havana — quieter bend, still a river walk",
        "One pocket. The Mission Trail is a morning, not a second hotel"
      ] },
      lux: { why: "Historic flagship. Fiesta week is not the value window.", picks: [
        "The St. Anthony Hotel — Downtown grande dame leftover",
        "Hotel Emma Stretch suite if leftover covers the jump",
        "Thompson San Antonio — Pearl leftover",
        "Fairmount — historic Stretch",
        "One property"
      ] }
    };
    P.FOOD_PICKS["san_antonio"] = {
      note: "Pearl food hall and a breakfast taco beat a River Walk tourist menu.",
      budget: [
        "Breakfast: breakfast taco (Taco Taco or a bakery), not the hotel",
        "Lunch: Pearl food hall or a mercado plate",
        "Dinner: one sit-down two bridges off the postcard row",
        "Skip a dinner barge on Lean",
        "Tex-Mex in the neighborhood you booked"
      ],
      mid: [
        "Breakfast: café or a taco",
        "Lunch: Pearl or a proper casual",
        "Dinner: one reservation at Pearl or a River Walk-adjacent table",
        "Mi Tierra is a late-night classic once, not every meal",
        "Stay on the river — a north-side dinner is a car"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down at Pearl",
        "Dinner reservation: a named tasting leftover",
        "One splurge, then tacos",
        "Hotel restaurants on the river are a tax"
      ]
    };
    P.ACTIVITIES["san_antonio"] = {
      budget: [
        "The Alamo timed morning — not a day (ticketed / timed)",
        "River Walk in daylight and after dark (free)",
        "San Fernando or a quieter bend walk (free)",
        "Skip SeaWorld / Fiesta Texas on Lean unless that is the trip (ticketed)",
        "Market Square is a cheap hour (free / cheap)"
      ],
      mid: [
        "Alamo + one mission on the trail (ticketed / cheap)",
        "Pearl campus walk (free)",
        "Tower of the Americas leftover (ticketed)",
        "River Walk still (free)",
        "A VIA day pass beats a rideshare loop"
      ],
      lux: [
        "A second mission or a food walk leftover (tour / cheap)",
        "Japanese Tea Garden + a river evening (free / cheap)",
        "Do not stack SeaWorld, the Alamo, and a barge in one day",
        "Fiesta week is a crowd tax (ticketed / peak)",
        "The river at dusk still (free)"
      ]
    };
    P.HOTEL_EXAMPLES["palm_springs"] = {
      budget: { why: "Walkable Palm Canyon / Downtown. A cheap I-10 motel plus nightly Ubers is not Lean.", picks: [
        "Movie Colony Hotel or a mid-century motel on Palm Canyon — pool, walk to dinner",
        "Ingleside Inn-adjacent 2-star — quieter pocket",
        "A Uptown Design District motel-plus — mid-century, grocery nearby",
        "Ace is mid-plus; Lean is a renovated motel courtyard",
        "Skip a desert-edge chain unless you have a car and a trail plan"
      ] },
      mid: { why: "Downtown boutique or a mid-century courtyard. Summer is cheap and brutal.", picks: [
        "Arrive Palm Springs — Downtown, walk to dinner",
        "Ace Hotel & Swim Club — mid-century campus, still a rideshare to trails",
        "Holiday House — adults-leaning mid",
        "Kimpton Rowan — Downtown rooftop mid",
        "One pocket. Palm Desert / Indian Wells is a different drive"
      ] },
      lux: { why: "Design flagship. Modernism Week and Coachella are not the value window.", picks: [
        "The Parker Palm Springs — leftover, a campus",
        "Colony Palms Hotel — historic Stretch",
        "Sparrows Lodge or La Serena Villas — smaller Stretch",
        "One property. Do not also buy every spa add-on",
        "July rooms are cheap because the air hurts"
      ] }
    };
    P.FOOD_PICKS["palm_springs"] = {
      note: "Date shakes and a Downtown casual beat a resort dining room.",
      budget: [
        "Breakfast: Cheeky’s-adjacent wait is mid; Lean is a bakery or taco",
        "Lunch: taco shop or a date shake — not a resort café",
        "Dinner: Downtown Palm Canyon casual",
        "Skip a hotel restaurant on Lean",
        "Grocery a trail-day picnic"
      ],
      mid: [
        "Breakfast: café Downtown",
        "Lunch: a proper casual",
        "Dinner: one reservation — Workshop Kitchen or a neighborhood table",
        "Stay Downtown — a El Paseo dinner is a drive",
        "One sit-down, not five"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge",
        "Resort dining rooms are a second lodging charge"
      ]
    };
    P.ACTIVITIES["palm_springs"] = {
      budget: [
        "Downtown mid-century walk + public art (free)",
        "A desert trail in the morning — Indian Canyons has a modest fee (cheap / ticketed)",
        "Aerial Tramway is a ticket; Lean can skip it (ticketed)",
        "Skip a pool-day cabana on Lean",
        "Modernism Week is a ticketed week in February (ticketed / peak)"
      ],
      mid: [
        "Aerial Tramway or Indian Canyons — pick one (ticketed)",
        "Downtown walk + a mid-century cruise from the sidewalk (free)",
        "Joshua Tree is a day trip with water and a packed lunch (car / cheap)",
        "A second morning trail still (free / cheap)",
        "Coachella is a different budget"
      ],
      lux: [
        "Tram + a guided canyon leftover (ticketed / tour)",
        "A spa afternoon leftover (ticketed)",
        "Joshua Tree sunrise leftover (car)",
        "Do not stack Tram, Joshua Tree, and a festival in 3 nights",
        "Downtown dusk still (free)"
      ]
    };
    P.HOTEL_EXAMPLES["lake_tahoe"] = {
      budget: { why: "One shore. A cheap room in Reno plus a nightly drive is a different trip.", picks: [
        "South Lake motel / Basecamp class — walk to a bus if you can",
        "Stateline value tower — cheaper NV side, one pocket",
        "North Shore 2-star in Kings Beach or Tahoe Vista — grocery the first hour",
        "A hostel-plus in summer only",
        "Skip a ski-in marketing photo on Lean; the bus is slower and cheaper"
      ] },
      mid: { why: "Village walkable. A car is assumed once you leave the village.", picks: [
        "The Landing Lake Tahoe — South Shore water mid",
        "Marriott Timber Lodge — Heavenly village, walk to the gondola",
        "Hyatt Regency Lake Tahoe — North Shore mid-plus",
        "A South Lake 3–4 star on the transit line",
        "Pick North or South. Do not commute the lake twice a day"
      ] },
      lux: { why: "Lakefront or ski-in flagship. Holiday weeks are not the value window.", picks: [
        "The Ritz-Carlton Lake Tahoe — Northstar leftover",
        "Edgewood Tahoe — South Shore Stretch",
        "The Village at Palisades Tahoe — Olympic Valley leftover",
        "One base. A second lodge is a transfer",
        "April and November are the mud-season discount"
      ] }
    };
    P.FOOD_PICKS["lake_tahoe"] = {
      note: "Grocery the condo. Village restaurants price like resorts.",
      budget: [
        "Breakfast: grocery the room",
        "Lunch: packed on trail or ski days",
        "Dinner: one casual in the village you booked",
        "Skip a lakeview steakhouse on Lean",
        "Stateline cheap eats if you slept South"
      ],
      mid: [
        "Breakfast: condo + one café",
        "Lunch: packed on big days, sit-down in town",
        "Dinner: one fish or mountain sit-down",
        "Stay on your shore",
        "A North-to-South dinner is an hour in winter"
      ],
      lux: [
        "Breakfast: condo still wins on ski days",
        "Lunch: a sit-down if you are in the village",
        "Dinner reservation: Edgewood or a named table leftover",
        "One splurge",
        "Do not eat every meal out on a ski week"
      ]
    };
    P.ACTIVITIES["lake_tahoe"] = {
      budget: [
        "The lake path or a beach in the town you booked (free)",
        "A short hike with a cheap parking lot (cheap)",
        "Skip a snowmobile or lake-cruise upsell on Lean (tour)",
        "Gondola sightseeing is a ticket — only if leftover covers it (ticketed)",
        "Grocery picnic (cheap)"
      ],
      mid: [
        "One lift day or a longer hike — pick the season (ticketed / free)",
        "Emerald Bay viewpoint if you already have the car (free / cheap)",
        "A second beach or snow day still (free / ticketed)",
        "A lake cruise leftover (tour)",
        "Do not stack ski, a cruise, and a Tahoe-rim drive in 3 days"
      ],
      lux: [
        "A reserved boat or a guided snow day leftover (tour)",
        "One extra lift ticket leftover (ticketed)",
        "A quiet beach morning still (free)",
        "Do not stack every adventure add-on",
        "Caldera / private-guide leftover only"
      ]
    };
    P.HOTEL_EXAMPLES["napa"] = {
      budget: { why: "Town inn in Napa or Sonoma. A tasting-room hotel plus a parked car is a tax.", picks: [
        "Napa town 2-star or a Calistoga value inn — walk to a grocery",
        "Sonoma plaza-adjacent 2-star if Sonoma is the base",
        "A car-free night near the Napa Valley Wine Train station only if you will ride it",
        "Skip a highway motel in American Canyon unless you land late",
        "Yountville is mid-plus; Lean stays in town"
      ] },
      mid: { why: "Walkable plaza or river inn. Book two tastings; do not walk in blind.", picks: [
        "Napa River Inn — walkable downtown Napa",
        "El Dorado Hotel — Sonoma plaza",
        "Carneros Resort-adjacent mid if leftover covers a quieter base",
        "A Yountville 3–4 star — you came to walk to dinner",
        "One town. St. Helena plus Sonoma plus Napa is a transfer week"
      ] },
      lux: { why: "Auberge / Meadowood class. Harvest weekends are not the value window.", picks: [
        "Auberge du Soleil — Rutherford leftover",
        "Meadowood Napa Valley — Stretch",
        "Solage Calistoga — leftover",
        "The Estate Yountville — walk to French Laundry leftover-adjacent",
        "One property. Do not also buy every reserve tasting"
      ] }
    };
    P.FOOD_PICKS["napa"] = {
      note: "Tasting fees are the hidden food line. Grocery breakfasts and one dinner win.",
      budget: [
        "Breakfast: bakery in town, not the inn restaurant",
        "Lunch: Oxbow Public Market or a taco truck",
        "Dinner: casual in Napa town or Sonoma plaza",
        "Skip a tasting-room picnic priced like lunch",
        "One reserved tasting, not five walk-ins"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: Oxbow or a proper casual",
        "Dinner: one reservation — Bouchon-adjacent or a neighborhood table",
        "Book tastings with a fee you already priced",
        "Stay in one town at night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down in Yountville only if you are already there",
        "Dinner reservation: French Laundry / SingleThread leftover-only",
        "One tasting menu, then market food",
        "The room or the reservation, rarely both"
      ]
    };
    P.ACTIVITIES["napa"] = {
      budget: [
        "Oxbow Public Market (free / cheap)",
        "A town walk in Napa or Sonoma plaza (free)",
        "One booked tasting — skip the highway billboard rooms (ticketed)",
        "Bothe or a cheap trail if you want a non-wine hour (cheap)",
        "Skip a limo loop on Lean"
      ],
      mid: [
        "Two booked tastings, not five (ticketed)",
        "A bike-between-wineries morning only if leftover covers the rental (cheap / tour)",
        "Oxbow still (free / cheap)",
        "A Calistoga mud-adjacent hour is mid, not automatic (ticketed)",
        "Do not drive every tasting yourself if anyone is drinking"
      ],
      lux: [
        "A reserved reserve tasting leftover (ticketed)",
        "A hot-air balloon leftover — it is a dawn-price (tour)",
        "One plaza walk still (free)",
        "Do not stack a balloon, three reserves, and French Laundry in one day",
        "Sonoma Coast is a different day and a different wind"
      ]
    };
    P.HOTEL_EXAMPLES["monterey"] = {
      budget: { why: "Monterey or Pacific Grove. Carmel is a dinner, not a cheap hotel.", picks: [
        "HI Monterey Hostel — Cannery Row-adjacent, walk or the trolley",
        "Motel 6 Seaside or a 2-star off the water — cheaper nights",
        "Pacific Grove 2-star — quieter, grocery nearby",
        "A Cannery Row limited-service a block off the aquarium",
        "Skip a Highway 1 cliff motel you will drive past anyway"
      ] },
      mid: { why: "Cannery Row / downtown Monterey or a Carmel 3-star if leftover covers the village.", picks: [
        "Hotel Pacific — downtown Monterey, walk to the wharf",
        "InterContinental The Clement Monterey — Cannery Row mid",
        "Monterey Plaza Hotel & Spa — water mid-plus",
        "A Pacific Grove 3–4 star — quieter nights",
        "Carmel-by-the-Sea mid only if the village is the point"
      ] },
      lux: { why: "Carmel or Big Sur flagship. Car Week is not the value window.", picks: [
        "L’Auberge Carmel — village leftover",
        "Post Ranch Inn or Ventana Big Sur — leftover, Highway 1 closures happen",
        "Bernardus Lodge — Carmel Valley Stretch",
        "One base. Big Sur plus Monterey plus Carmel is three parking lots",
        "Check Highway 1 before you lock a Big Sur night"
      ] }
    };
    P.FOOD_PICKS["monterey"] = {
      note: "Wharf menus are a tax. Grocery a picnic and one sit-down win.",
      budget: [
        "Breakfast: bakery in Pacific Grove or downtown, not the hotel",
        "Lunch: packed at the aquarium or a counter off the wharf",
        "Dinner: downtown Monterey casual",
        "Skip the first restaurant on Fisherman’s Wharf",
        "Clam chowder once, not as a meal plan"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual off the wharf",
        "Dinner: one reservation — Passionfish or a neighborhood table",
        "Carmel dinner only if you are already there",
        "Stay in one town at night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named Carmel or Big Sur table leftover",
        "One splurge",
        "Cliff restaurants are a sunset-price"
      ]
    };
    P.ACTIVITIES["monterey"] = {
      budget: [
        "Monterey Bay Aquarium is the ticketed morning (ticketed)",
        "Cannery Row / Rec Trail walk (free)",
        "17-Mile Drive has a fee — Lean can skip and use public pull-offs (ticketed / free)",
        "Skip a whale-watch upsell on Lean if the water is rough (tour)",
        "Pacific Grove tidepools at a documented access (free)"
      ],
      mid: [
        "Aquarium + Rec Trail (ticketed / free)",
        "17-Mile Drive or a Point Lobos day — pick one (ticketed)",
        "A whale watch leftover if seas are honest (tour)",
        "Carmel beach walk (free)",
        "Do not stack aquarium, 17-Mile, and Big Sur in one day"
      ],
      lux: [
        "Aquarium + Point Lobos leftover (ticketed)",
        "A Big Sur day with slack and a packed lunch (car)",
        "A second coastal walk still (free)",
        "Do not stack Post Ranch dinner and a dawn drive on the same night",
        "Car Week is a crowd tax in August (peak)"
      ]
    };
    P.HOTEL_EXAMPLES["destin_30a"] = {
      budget: { why: "Destin condo or a 30A town you can walk. Harbor-view hotels are a parking tax if you came for the sand.", picks: [
        "Destin 1-bedroom condo off 98 — kitchen is the Lean product",
        "Hampton or Holiday Inn Express near the Harbor — limited-service, grocery the first hour",
        "A 30A garage apartment in Seagrove or Santa Rosa if leftover is tight",
        "Skip a high-rise you will Uber from to the beach every day",
        "Miramar / Sandestin value only if you will use that beach"
      ] },
      mid: { why: "Walk-to-beach midrise or a 30A condo in one town.", picks: [
        "Hilton Sandestin Beach — walk-to-gulf mid",
        "A Destin Harbor 3–4 star if you came for the boats, not the quiet",
        "30A condo in Seaside-adjacent / WaterColor village — kitchen still wins dinners",
        "The Henderson is Stretch; mid is a renovated condo a block off",
        "Pick Destin or 30A. The drive along 98 is the hidden cost"
      ] },
      lux: { why: "30A flagship. Spring break and July are not the value window.", picks: [
        "WaterColor Inn — 30A leftover",
        "The Pearl Hotel Rosemary Beach — Stretch",
        "Henderson Park Inn or The Lodge 30A class — leftover",
        "One town. Do not hop Rosemary, Seaside, and Destin nightly",
        "January rooms are cheap because the gulf is a walk, not a swim"
      ] }
    };
    P.FOOD_PICKS["destin_30a"] = {
      note: "Condo kitchen and a seafood counter beat a harbor tourist menu.",
      budget: [
        "Breakfast: grocery the condo",
        "Lunch: food truck or a taco / shrimp counter",
        "Dinner: cook two nights, one casual fish plate",
        "Skip the first Harbor boardwalk menu",
        "Donut or a bakery once, not as a meal"
      ],
      mid: [
        "Breakfast: condo + one café",
        "Lunch: a proper casual in the town you booked",
        "Dinner: one fish sit-down — Destin or 30A, not both",
        "The Hub / a 30A market lunch is mid",
        "Stay in one town at night"
      ],
      lux: [
        "Breakfast: condo still wins",
        "Lunch: a sit-down if you are already in the village",
        "Dinner reservation: a named 30A table leftover",
        "One splurge, then the kitchen",
        "Harbor restaurants are a second lodging charge"
      ]
    };
    P.ACTIVITIES["destin_30a"] = {
      budget: [
        "The beach in front of the condo — that is the product (free)",
        "Henderson Beach State Park if you slept Destin (cheap)",
        "Skip a dolphin-cruise upsell on Lean (tour)",
        "A harbor walk at dusk (free)",
        "Grocery picnic (cheap)"
      ],
      mid: [
        "One boat or a state-park day — pick one (ticketed / cheap)",
        "A second beach day still (free)",
        "Eden Gardens or a 30A town walk (cheap / free)",
        "A sunset cruise leftover (tour)",
        "Do not stack a boat, a water park, and a beach club in one day"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "A beach-club afternoon is a day-price (ticketed)",
        "A quiet beach morning still (free)",
        "Do not stack every water add-on",
        "Grayton / Seaside dusk still (free)"
      ]
    };
    P.HOTEL_EXAMPLES["outer_banks"] = {
      budget: { why: "House week, not a hotel-strip week. Nags Head / Kill Devil Hills is the Lean corridor.", picks: [
        "Nags Head or Kill Devil Hills motel / 2-star — walk or a short drive to the sand",
        "A house share with a kitchen — the Lean product if the party will cook",
        "Kitty Hawk value inn — grocery the first hour",
        "Skip a Corolla oceanfront on Lean; the drive is longer and the rate is not",
        "Hatteras village 2-star only if the ferry / cape is the point"
      ] },
      mid: { why: "Oceanfront condo or a Duck / Corolla house. A car is assumed.", picks: [
        "Sanderling Resort-adjacent mid — Duck, quieter",
        "The Inn at Corolla Light class — mid if leftover covers the north end",
        "Nags Head oceanfront condo — kitchen still wins dinners",
        "A Kill Devil Hills 3-star walk-to-beach",
        "Pick one village. Duck-to-Hatteras is not a casual dinner hop"
      ] },
      lux: { why: "Oceanfront house or Sanderling class. Summer is the window; winter closures are real.", picks: [
        "Sanderling Resort — Duck leftover",
        "Life House Nags Head or a design oceanfront leftover",
        "A Corolla oceanfront house — Stretch if the party fills it",
        "One village",
        "Hurricane weeks are not a discount you want to win"
      ] }
    };
    P.FOOD_PICKS["outer_banks"] = {
      note: "The kitchen is the budget. Pier restaurants are a sunset, not every night.",
      budget: [
        "Breakfast: grocery the house",
        "Lunch: packed on beach days",
        "Dinner: cook two nights, one casual seafood plate",
        "Skip the first pier tourist menu",
        "John’s Drive-In or a counter once"
      ],
      mid: [
        "Breakfast: house + one café",
        "Lunch: packed or a fish counter",
        "Dinner: one sit-down in the village you booked",
        "Duck or Nags Head, not both in one night",
        "Blueberries / produce stands in season are lunch"
      ],
      lux: [
        "Breakfast: house still wins",
        "Lunch: a sit-down if you are already in Duck",
        "Dinner reservation: a named oceanfront leftover",
        "One splurge, then the kitchen",
        "Do not eat every meal out on a house week"
      ]
    };
    P.ACTIVITIES["outer_banks"] = {
      budget: [
        "The beach in front of the house (free)",
        "Wright Brothers or a visitor-center hour (ticketed / cheap)",
        "Jockey’s Ridge dune walk (cheap)",
        "Skip a wild-horse tour on Lean if you can see them from a public access (tour / free)",
        "Grocery picnic (cheap)"
      ],
      mid: [
        "Cape Hatteras lighthouse or Wright Brothers — pick one (ticketed)",
        "A second beach day still (free)",
        "A wild-horse tour leftover if you slept north (tour)",
        "Pea Island or a wildlife hour (free / cheap)",
        "Do not stack lighthouse, horses, and a ferry in one day"
      ],
      lux: [
        "A reserved boat or a lighthouse climb leftover (ticketed / tour)",
        "A second park site leftover (ticketed)",
        "A quiet beach morning still (free)",
        "Ocracoke is a ferry day — leftover only",
        "Hurricane season is a watch, not an itinerary"
      ]
    };
    P.HOTEL_EXAMPLES["grand_canyon"] = {
      budget: { why: "South Rim in-park or Tusayan. Flagstaff is a commute, not Lean lodging.", picks: [
        "Maswik Lodge — in-park, cafeteria, walk or shuttle to the rim",
        "Yavapai Lodge — in-park mid-lean, shuttle",
        "Tusayan motel (Red Feather / Holiday Inn Express class) — short drive to the gate",
        "A Williams 2-star only if you are riding the train the next morning",
        "Skip a Las Vegas hotel plus a 5-hour day-trip as this lodging"
      ] },
      mid: { why: "In-park lodge or Tusayan 3-star. Book months out for summer.", picks: [
        "Thunderbird or Kachina Lodge — rim-adjacent mid",
        "Yavapai Lodge plus a rim sunrise — still a shuttle",
        "Best Western Grand Canyon Squire — Tusayan mid, indoor extras for kids",
        "Bright Angel Lodge cabin class — historic mid",
        "Stay on the South Rim. North Rim is a different season and road"
      ] },
      lux: { why: "El Tovar. Leftover only — and it still does not include a helicopter.", picks: [
        "El Tovar Hotel — rim flagship leftover",
        "Bright Angel historic cabin if El Tovar is sold",
        "A Tusayan 4-star is not Stretch if you wanted the rim at dawn",
        "One property. Phantom Ranch is a lottery, not a Stretch button",
        "January is quiet and cold — that is the value window"
      ] }
    };
    P.FOOD_PICKS["grand_canyon"] = {
      note: "Cafeteria and a grocery bag beat a rim-view steak every night.",
      budget: [
        "Breakfast: Maswik or a grocery bag",
        "Lunch: packed on rim walks",
        "Dinner: cafeteria or Tusayan casual",
        "Skip a helicopter-pad café",
        "Water is a plan, not a souvenir"
      ],
      mid: [
        "Breakfast: lodge cafeteria + one sit-down",
        "Lunch: packed on longer rim walks",
        "Dinner: one El Tovar dining-room night if leftover covers it",
        "Stay on the rim at night",
        "Tusayan dinner only if you slept Tusayan"
      ],
      lux: [
        "Breakfast: still pack rim days",
        "Lunch: a sit-down if you are in the village",
        "Dinner reservation: El Tovar leftover",
        "One splurge",
        "Do not eat every meal in the dining room on a hiking week"
      ]
    };
    P.ACTIVITIES["grand_canyon"] = {
      budget: [
        "Rim Trail between viewpoints — shuttle, not a car loop (free with entry)",
        "Park entry is the ticket; sunrise is free if you slept inside (ticketed / free)",
        "Skip a helicopter on Lean (tour)",
        "Visitor Center + a short paved walk (free with entry)",
        "Do not treat a Las Vegas day-trip as this activity list"
      ],
      mid: [
        "A longer rim walk or a short corridor hike — know your fitness (free with entry)",
        "Desert View Drive if you already have the car (free with entry)",
        "A ranger talk (free)",
        "IMAX in Tusayan leftover (ticketed)",
        "Do not stack a helicopter, a train, and a rim hike in one day"
      ],
      lux: [
        "A helicopter or a rim tour leftover-only (tour)",
        "A longer inner-canyon day only if you are trained and permitted (permit / free)",
        "A second sunrise still (free)",
        "The train from Williams is a day-price (ticketed)",
        "Do not invent a river trip into a 3-night stay"
      ]
    };
    P.HOTEL_EXAMPLES["jackson_hole"] = {
      budget: { why: "Jackson town or Teton Village. A cheap Idaho Falls room is a different drive.", picks: [
        "The Hostel (Teton Village) or a Jackson 2-star — ski-season Lean",
        "49’er Inn or a Motel 6-class in town — grocery the first hour",
        "A cabin court on the edge of town if you have a car",
        "Skip a ski-in marketing rate on Lean; the bus exists",
        "April and November are mud season — that is the discount"
      ] },
      mid: { why: "Town square walkable or Teton Village mid. JAC is a weather airport.", picks: [
        "The Wort Hotel — town square mid",
        "Cowboy Village Resort — cabin mid, in town",
        "Snow King — town hill, walkable",
        "A Teton Village 3–4 star if skiing is the point",
        "Pick town or village. The pass commute is a winter line"
      ] },
      lux: { why: "Amangani / Four Seasons class. Holiday ski weeks are not the value window.", picks: [
        "Four Seasons Jackson Hole — Teton Village leftover",
        "Amangani — East Gros Ventre leftover",
        "Cloudveil or Caldera House — village Stretch",
        "One base. Do not also book a Yellowstone in-park night without a transfer day",
        "Build a buffer night in ski season"
      ] }
    };
    P.FOOD_PICKS["jackson_hole"] = {
      note: "Town casual and a grocery bag beat a village dining room every night.",
      budget: [
        "Breakfast: grocery or a diner in town, not the resort",
        "Lunch: packed on ski or park days",
        "Dinner: Jackson casual — bin and a burger, not a tasting",
        "Skip a village steakhouse on Lean",
        "Persephone or a bakery once"
      ],
      mid: [
        "Breakfast: café in town",
        "Lunch: packed on Teton days, sit-down in town",
        "Dinner: one reservation — Snake River Grill-adjacent or a neighborhood table",
        "Stay in town at night if you slept town",
        "Village dinner only if you slept village"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down if you are already in the village",
        "Dinner reservation: a named tasting leftover",
        "One splurge",
        "The room or the tasting, rarely both plus a guide day"
      ]
    };
    P.ACTIVITIES["jackson_hole"] = {
      budget: [
        "Town square + National Museum of Wildlife Art exterior (free / cheap)",
        "A Teton viewpoint from a public pull-off (free / park entry)",
        "Skip a snowmobile upsell on Lean (tour)",
        "Town hill night-ski leftover only (ticketed)",
        "Grocery picnic (cheap)"
      ],
      mid: [
        "Grand Teton park day — one loop, packed lunch (ticketed)",
        "One lift day in season (ticketed)",
        "A wildlife turnout at dawn if you already have the car (free / cheap)",
        "A second town walk still (free)",
        "Yellowstone is a different lodging night if you add it"
      ],
      lux: [
        "A private guide or a snow-coach leftover (tour)",
        "A second park day leftover (ticketed)",
        "A quiet town morning still (free)",
        "Do not stack Teton, Yellowstone, and a heli in 4 days",
        "Amangani spa leftover-only"
      ]
    };
    P.HOTEL_EXAMPLES["phoenix"] = {
      budget: { why: "Downtown / Roosevelt Row on light rail. This is not Scottsdale resort math.", picks: [
        "HI Phoenix or a Downtown hostel-plus — light rail downstairs",
        "Hampton Downtown — limited-service, walk to Roosevelt",
        "Found:Re-adjacent 2-star — arts pocket",
        "Tempe limited-service on the rail if ASU / Mill is the night",
        "Skip a Scottsdale resort parking fee on a Phoenix Lean week"
      ] },
      mid: { why: "Downtown boutique or a midtown 3–4 star. Light rail beats a rental in the core.", picks: [
        "Hotel Palomar Phoenix — Downtown, walk to Roosevelt Row",
        "The Camby — midtown mid",
        "Graduate Tempe — Mill Avenue if that is the pocket",
        "Kimpton or a Downtown 4-star — one neighborhood",
        "Do not split Scottsdale and Downtown in a 3-night stay unless leftover covers two bases"
      ] },
      lux: { why: "Biltmore or a design flagship. June–August is cheap because the air hurts.", picks: [
        "Arizona Biltmore — historic leftover, car assumed for dinner",
        "The Global Ambassador — Stretch",
        "Royal Palms is Scottsdale-adjacent — a different lodging math",
        "One property",
        "Winter weekends are peak; summer is the discount"
      ] }
    };
    P.FOOD_PICKS["phoenix"] = {
      note: "Mexican breakfast and a Roosevelt dinner beat a resort dining room.",
      budget: [
        "Breakfast: Mexican café or a bakery, not the hotel",
        "Lunch: taco shop or a food hall Downtown",
        "Dinner: Roosevelt Row casual",
        "Skip a Scottsdale steakhouse on a Phoenix Lean week",
        "Grocery a trail-day picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual in Roosevelt or Downtown",
        "Dinner: one reservation — a neighborhood table, not a resort",
        "Stay on the rail",
        "Scottsdale dinner only if leftover covers the rideshare"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge",
        "Biltmore dining is a campus-price"
      ]
    };
    P.ACTIVITIES["phoenix"] = {
      budget: [
        "Roosevelt Row murals in daylight (free)",
        "A desert trail in the morning — South Mountain or Camelback have parking realities (free / cheap)",
        "Heard Museum is a ticketed morning (ticketed)",
        "Skip a hot-air balloon on Lean (tour)",
        "Light rail to a game or a museum (cheap)"
      ],
      mid: [
        "Heard or Musical Instrument Museum — pick one (ticketed)",
        "A sunrise trail before the heat (free / cheap)",
        "Roosevelt evening (free)",
        "Desert Botanical Garden leftover (ticketed)",
        "Do not stack two museums and a trail at noon in July"
      ],
      lux: [
        "A reserved desert tour leftover (tour)",
        "Heard + Botanical leftover (ticketed)",
        "A second dawn trail still (free)",
        "Do not stack Sedona into a Phoenix lodging week without a transfer day",
        "Scottsdale spa leftover is a different destination"
      ]
    };
    P.HOTEL_EXAMPLES["memphis"] = {
      budget: { why: "Downtown / South Main. A cheap airport room is a Beale Street rideshare habit.", picks: [
        "Sleep Inn Downtown or a South Main 2-star — walk to a trolley",
        "Hu. Hotel-adjacent limited-service",
        "The Guest House at Graceland only if Graceland is the whole trip",
        "A Midtown 2-star if Cooper-Young is the night you came for",
        "Skip a Beale balcony address on Lean; the trolley is cheaper"
      ] },
      mid: { why: "Downtown boutique or The Peabody if leftover covers the ducks.", picks: [
        "Hu. Hotel — Downtown, walk to Beale",
        "The Central Station Hotel — South Main mid",
        "The Peabody Memphis — ducks, mid-plus",
        "Graduate Memphis — mid if leftover covers the campus-adjacent pocket",
        "One pocket. East Memphis is a car commute"
      ] },
      lux: { why: "The Peabody or a design flagship. Elvis Week is not the value window.", picks: [
        "The Peabody Memphis — leftover if the ducks are the point",
        "Graduate Memphis Stretch suite",
        "A South Main design hotel leftover",
        "One property",
        "Barbecue-fest weekends lift rooms"
      ] }
    };
    P.FOOD_PICKS["memphis"] = {
      note: "Barbecue is one meal. Hotel restaurants are the tax.",
      budget: [
        "Breakfast: café Downtown, not the hotel",
        "Lunch: one barbecue plate — Central BBQ or a neighborhood shop",
        "Dinner: South Main casual",
        "Skip a Beale cover-charge dinner on Lean",
        "Gus’s fried chicken once"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: barbecue or a Midtown casual",
        "Dinner: one reservation — a neighborhood table, not Beale",
        "Charlie Vergos’ Rendezvous leftover-adjacent",
        "Stay Downtown at night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge, then another barbecue is allowed",
        "The Peabody dining room is a leftover"
      ]
    };
    P.ACTIVITIES["memphis"] = {
      budget: [
        "National Civil Rights Museum timed ticket (ticketed)",
        "Beale in daylight; the night is optional (free / cheap)",
        "South Main walk (free)",
        "Skip Graceland on Lean unless that is the trip (ticketed)",
        "Trolley hop (cheap)"
      ],
      mid: [
        "Civil Rights Museum + Beale (ticketed / free)",
        "Graceland or Stax — pick one (ticketed)",
        "A second neighborhood walk — Cooper-Young (free)",
        "Sun Studio leftover (ticketed)",
        "Do not stack Graceland, Stax, and Sun in one day"
      ],
      lux: [
        "Graceland + a second music ticket leftover (ticketed)",
        "A reserved music tour leftover (tour)",
        "Civil Rights Museum still (ticketed)",
        "Do not stack three interiors and a late Beale night",
        "Elvis Week is a crowd tax (peak)"
      ]
    };
    P.HOTEL_EXAMPLES["portland_me"] = {
      budget: { why: "Old Port walking. This is not Portland, Oregon.", picks: [
        "Inn at St. John or a West End 2-star — walk or a short bus to Old Port",
        "A hostel-plus or compact Downtown room — grocery nearby",
        "Hampton Old Port-adjacent limited-service",
        "Skip a jetport hotel unless you land late",
        "The Press Hotel is mid; Lean stays a block off the cobblestones"
      ] },
      mid: { why: "Old Port boutique. PWM nonstops beat connecting into Boston.", picks: [
        "The Press Hotel — Old Port mid, walk to dinner",
        "Portland Harbor Hotel — water mid",
        "The Francis — boutique mid-plus",
        "A West End 3–4 star — quieter nights",
        "One pocket. Do not split Old Orchard Beach into this lodging"
      ] },
      lux: { why: "Harbor flagship. July–August is not the value window.", picks: [
        "The Francis leftover",
        "The Press Hotel Stretch suite",
        "Inn by the Sea (Cape Elizabeth) — leftover, car assumed",
        "One property",
        "January rooms are cheap because the harbor wind is real"
      ] }
    };
    P.FOOD_PICKS["portland_me"] = {
      note: "Lobster is one meal. Bakeries and a market beat a waterfront tourist menu.",
      budget: [
        "Breakfast: The Holy Donut or a bakery, not the hotel",
        "Lunch: Eventide leftover-adjacent; Lean is a market or a roll shack",
        "Dinner: Old Port casual off the first waterfront row",
        "Lobster roll once",
        "Skip a dinner cruise menu on Lean"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a roll or a proper casual",
        "Dinner: one reservation — Eventide or a neighborhood table",
        "Stay in Old Port at night",
        "Food trucks / a market lunch is mid"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge, then another roll is allowed",
        "Cape Elizabeth dinner only if you slept there"
      ]
    };
    P.ACTIVITIES["portland_me"] = {
      budget: [
        "Old Port walk (free)",
        "Eastern Promenade (free)",
        "One Casco Bay ferry — Peaks Island is the cheap postcard (cheap)",
        "Skip a lobster-boat upsell on Lean (tour)",
        "Portland Museum of Art leftover (ticketed)"
      ],
      mid: [
        "Casco Bay ferry + Promenade (cheap / free)",
        "Portland Head Light if you already have a car or a bus plan (cheap)",
        "One museum — PMA (ticketed)",
        "A second harbor walk still (free)",
        "Do not stack Head Light, a ferry, and a food tour in one day"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "Head Light + a second coastal stop leftover (car)",
        "Old Port dusk still (free)",
        "Do not stack a lighthouses loop into a 2-night stay",
        "Foliage weekends are a crowd tax (peak)"
      ]
    };
    P.HOTEL_EXAMPLES["bar_harbor"] = {
      budget: { why: "Bar Harbor village walking. A cheap Bangor room is a dawn drive, not Lean lodging.", picks: [
        "Aurora Inn or Highbrook Motel class — walk or a short bus to the village",
        "A Mount Desert 2-star off the cruise-ship dock line",
        "A cabin court with a kitchenette — grocery the first hour",
        "Skip a winter-closed inn in January; many go dark",
        "Bar Harbor Inn is mid; Lean stays a few blocks uphill"
      ] },
      mid: { why: "Village inn. Cadillac sunrise is a reservation in peak season.", picks: [
        "Bar Harbor Inn — walk-to-village mid",
        "West Street Hotel — harbor mid",
        "Balance Rock Inn — quieter mid-plus",
        "A Northeast Harbor 3-star if you want fewer cruise mornings",
        "One village. Do not commute from Ellsworth every dawn"
      ] },
      lux: { why: "Claremont / Asticou class. July–October is the window.", picks: [
        "Claremont Hotel — Southwest Harbor leftover",
        "Asticou Inn — Northeast Harbor Stretch",
        "West Street Hotel leftover suite",
        "One property",
        "Cruise-ship mornings crowd the village — hike early"
      ] }
    };
    P.FOOD_PICKS["bar_harbor"] = {
      note: "Lobster is one dinner. Pack Acadia lunches.",
      budget: [
        "Breakfast: bakery in the village, not the inn restaurant every day",
        "Lunch: packed on trail days",
        "Dinner: one casual lobster pound, not a waterfront tourist menu every night",
        "Skip a dinner cruise on Lean",
        "Grocery the first hour"
      ],
      mid: [
        "Breakfast: café + packed lunch",
        "Lunch: packed on Cadillac / trail days",
        "Dinner: one sit-down in the village",
        "A lobster pound night is mid",
        "Stay in the village at night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down only if you skipped the trail",
        "Dinner reservation: Claremont or a named table leftover",
        "One splurge, then a pound",
        "Do not eat every meal out on an Acadia week"
      ]
    };
    P.ACTIVITIES["bar_harbor"] = {
      budget: [
        "Acadia park entry + one carriage road or shoreline walk (ticketed / cheap)",
        "Village walk after the ships leave (free)",
        "Skip Cadillac sunrise on Lean if you will not reserve a parking slot (ticketed / timed)",
        "Jordan Pond path leftover (free with entry)",
        "Pack water; the island is not a café loop"
      ],
      mid: [
        "Cadillac sunrise reservation + a quieter afternoon (ticketed / timed)",
        "One longer trail — Beehive only if you are honest about the rungs (free with entry)",
        "A second shoreline walk still (free)",
        "Park Loop Road if you already have the car or a bus pass (ticketed)",
        "Do not stack Beehive, Cadillac, and a whale watch in one day"
      ],
      lux: [
        "A whale watch leftover (tour)",
        "A second reserved dawn leftover (timed)",
        "A quiet carriage-road morning still (free with entry)",
        "Do not stack every peak trail into 3 nights",
        "Cruise-ship days are a crowd tax — hike early"
      ]
    };
    P.HOTEL_EXAMPLES["santa_fe"] = {
      budget: { why: "Plaza-adjacent walking. Canyon Road is a morning, not a cheap hotel.", picks: [
        "Santa Fe Motel & Inn or El Rey Court — classic courtyards, short drive or walk",
        "Silver Saddle Motel class — Lean, grocery nearby",
        "A Railyard 2-star if that is the food pocket",
        "Skip an airport-adjacent Albuquerque room as this lodging",
        "La Fonda is mid-plus; Lean stays a few blocks off the Plaza"
      ] },
      mid: { why: "Plaza or Railyard boutique. Altitude is real.", picks: [
        "La Fonda on the Plaza — walkable mid",
        "Hotel Chimayo de Santa Fe — Plaza-adjacent",
        "Drury Plaza Hotel — mid, breakfast-in-rate if that is the product",
        "Inn of the Five Graces is Stretch; mid is a courtyard 3–4 star",
        "One pocket. Do not split Albuquerque and the Plaza in a 3-night stay"
      ] },
      lux: { why: "Canyon / Tesuque flagship. Indian Market week is not the value window.", picks: [
        "Inn of the Five Graces — leftover",
        "Four Seasons Resort Rancho Encantado — Tesuque Stretch, car assumed",
        "Bishop’s Lodge — leftover",
        "One property",
        "Late fall after Market is the value window"
      ] }
    };
    P.FOOD_PICKS["santa_fe"] = {
      note: "Breakfast burritos and one chile dinner beat a hotel restaurant.",
      budget: [
        "Breakfast: burrito or a Plaza café, not the hotel",
        "Lunch: cafe in the Railyard or a counter",
        "Dinner: one red-or-green plate off the first Plaza row",
        "Skip a Canyon Road tourist menu on Lean",
        "Farolito / a bakery once"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual in the Railyard",
        "Dinner: one reservation — a neighborhood table, not the first Plaza courtyard",
        "Stay Plaza-adjacent at night",
        "Chile is the trip; a second steak is not required"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge",
        "Rancho Encantado dining is a drive-price"
      ]
    };
    P.ACTIVITIES["santa_fe"] = {
      budget: [
        "Plaza + Cathedral walk (free)",
        "Canyon Road in the morning, galleries from the sidewalk (free)",
        "One museum — Georgia O’Keeffe is ticketed (ticketed)",
        "Skip a spa add-on on Lean",
        "Altitude slack is an activity"
      ],
      mid: [
        "O’Keeffe or Meow Wolf — pick one (ticketed)",
        "Canyon Road + Plaza (free)",
        "A Bandelier or Tesuque day leftover if you have a car (ticketed / car)",
        "A second gallery morning still (free)",
        "Do not stack Meow Wolf, O’Keeffe, and Bandelier in one day"
      ],
      lux: [
        "A reserved museum + a spa leftover (ticketed)",
        "Bandelier leftover (ticketed / car)",
        "Plaza dusk still (free)",
        "Do not stack Indian Market crowds and three interiors",
        "Taos is a different lodging night if you add it"
      ]
    };
    P.HOTEL_EXAMPLES["turks_caicos"] = {
      budget: { why: "Grace Bay value. A cheap island-hop is still a transfer.", picks: [
        "Sibonné or a Grace Bay 3-star garden view",
        "Coral Gardens class — walk to the sand",
        "A 2-star on Leeward if leftover is tight",
        "Skip a villa on Lean",
        "Confirm the transfer is in the rate"
      ] },
      mid: { why: "Grace Bay 4-star. One property.", picks: [
        "The Palms or The Somerset class",
        "Beaches Turks is family mid-plus",
        "A Grace Bay Club-adjacent 4-star",
        "Adults-only mid if there are no kids",
        "One beach"
      ] },
      lux: { why: "Amanyara / COMO leftover.", picks: [
        "COMO Parrot Cay leftover",
        "Amanyara Stretch",
        "Grace Bay Club penthouse leftover",
        "One island",
        "Do not also buy every excursion"
      ] }
    };
    P.FOOD_PICKS["turks_caicos"] = {
      note: "AI or a condo kitchen. Beach shacks are a lunch, not a transfer habit.",
      budget: [
        "Breakfast: condo or included",
        "Lunch: packed or a beach shack",
        "Dinner: one casual on Grace Bay",
        "Skip dock kiosks",
        "Grocery if you have a kitchen"
      ],
      mid: [
        "Breakfast: included or café",
        "Lunch: beach shack",
        "Dinner: one sit-down",
        "Stay on Grace Bay",
        "One off-property night if leftover covers the ride"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Still one island"
      ]
    };
    P.ACTIVITIES["turks_caicos"] = {
      budget: [
        "Grace Bay beach (free / included)",
        "Skip a dolphin upsell on Lean",
        "A snorkel from shore (cheap)",
        "Town walk, not a timeshare day",
        "Pack reef-safe sunscreen"
      ],
      mid: [
        "One boat day (ticketed / tour)",
        "Beach for the rest",
        "A second dock tour is the overrun",
        "Grace Bay still",
        "Iguana island leftover"
      ],
      lux: [
        "A small-group boat leftover (tour)",
        "One better day, not three",
        "Beach still wins",
        "Spa leftover-only",
        "Do not stack every sandbar"
      ]
    };
    P.HOTEL_EXAMPLES["aruba"] = {
      budget: { why: "Palm Beach value or Oranjestad 2-star. Outside the hurricane belt — Sept is the value month.", picks: [
        "Riu Palace Antillas-adjacent value",
        "A Palm Beach 3-star garden view",
        "Oranjestad 2-star if you will eat out",
        "Skip a timeshare pitch day",
        "Confirm the transfer"
      ] },
      mid: { why: "Palm Beach 4-star AI or a boutique in town.", picks: [
        "Hyatt Regency Aruba or Hilton Aruba class",
        "Adults-only 4-star if there are no kids",
        "Oranjestad boutique if this is a town week",
        "One strip",
        "Transfer in the rate"
      ] },
      lux: { why: "Adults-only or a flagship. One property.", picks: [
        "Adults-only Palm Beach leftover",
        "A villa Stretch",
        "One resort",
        "Do not also buy every sunset sail",
        "September is cheap for a reason — heat, not storms"
      ] }
    };
    P.FOOD_PICKS["aruba"] = {
      note: "On-property plus one Oranjestad dinner.",
      budget: [
        "Eat on-property most meals",
        "One town lunch",
        "Skip dock kiosks",
        "Coffee included",
        "Happy-hour is not a meal plan"
      ],
      mid: [
        "On-property + one Oranjestad dinner",
        "Premium à-la-carte nights",
        "Packed lunch on excursion days",
        "Stay on Palm Beach at night",
        "Transfer is part of the food price"
      ],
      lux: [
        "On-property fine dining",
        "One named town reservation leftover",
        "Specialty leftover-only",
        "One island",
        "Still not a nightly hop"
      ]
    };
    P.ACTIVITIES["aruba"] = {
      budget: [
        "Palm Beach (included)",
        "Oranjestad walk, not a timeshare day",
        "Skip the first catamaran on Lean",
        "Snorkel from the property if it exists",
        "Arikok is a car day"
      ],
      mid: [
        "One boat or Arikok — pick one (ticketed / tour)",
        "Beach for the rest",
        "A second dock tour is the overrun",
        "Town evening",
        "California Lighthouse leftover"
      ],
      lux: [
        "A small-group boat leftover (tour)",
        "Arikok leftover",
        "Beach still wins",
        "Spa leftover-only",
        "Do not stack every island tour"
      ]
    };
    P.HOTEL_EXAMPLES["bahamas"] = {
      budget: { why: "Nassau value or Paradise Island if leftover covers Atlantis math.", picks: [
        "Downtown Nassau 3-star — ferry to the beaches",
        "A Cable Beach value AI",
        "Skip Atlantis on Lean unless that is the trip",
        "Confirm the transfer",
        "Garden view on purpose"
      ] },
      mid: { why: "Cable Beach 4-star or Atlantis if the water park is the point.", picks: [
        "Baha Mar mid class",
        "Atlantis Coral / Royal mid if leftover covers it",
        "Cable Beach 4-star AI",
        "One island pocket",
        "Transfer in the rate"
      ] },
      lux: { why: "Atlantis suite or Baha Mar flagship.", picks: [
        "Atlantis Reef / suite leftover",
        "Baha Mar Stretch",
        "One campus",
        "The water park is a day-price",
        "Do not also buy every excursion"
      ] }
    };
    P.FOOD_PICKS["bahamas"] = {
      note: "On-property. Downtown lunch is a ferry, not a habit.",
      budget: [
        "Eat on-property most meals",
        "One downtown plate",
        "Skip dock kiosks",
        "Coffee included",
        "Fish fry once"
      ],
      mid: [
        "On-property + one off-property dinner",
        "Premium à-la-carte",
        "Packed lunch on a boat day",
        "Stay on your campus at night",
        "Arawak Cay leftover"
      ],
      lux: [
        "On-property fine dining",
        "One named reservation leftover",
        "Specialty leftover-only",
        "One campus",
        "Still not a nightly hop"
      ]
    };
    P.ACTIVITIES["bahamas"] = {
      budget: [
        "The beach in front of the resort (included)",
        "Skip a jet-ski upsell on Lean",
        "A downtown walking hour, not a timeshare day",
        "Snorkel from shore if it exists",
        "Water park only if you already paid Atlantis"
      ],
      mid: [
        "One boat or the water park — pick one (ticketed)",
        "Beach for the rest",
        "A second dock tour is the overrun",
        "Downtown evening leftover",
        "Pig beach is a tour-price"
      ],
      lux: [
        "A small-group boat leftover (tour)",
        "Water park leftover if not included",
        "Beach still wins",
        "Spa leftover-only",
        "Do not stack two private islands"
      ]
    };
    P.HOTEL_EXAMPLES["cabo"] = {
      budget: { why: "Cabo San Lucas town or a Corridor value. Medano beach is the walkable product.", picks: [
        "Downtown Cabo 3-star — walk to Medano",
        "A Corridor 3-star garden view",
        "Skip a sunset-cruise hotel on Lean",
        "Confirm the transfer",
        "Timeshare pitches are a half-day tax"
      ] },
      mid: { why: "Medano or Corridor 4-star.", picks: [
        "ME Cabo-adjacent or a Medano 4-star",
        "Hilton Los Cabos or a Corridor mid",
        "Adults-only mid if there are no kids",
        "One pocket",
        "Transfer in the rate"
      ] },
      lux: { why: "Adults-only or a Pedregal flagship.", picks: [
        "Waldorf Pedregal leftover",
        "The Cape / a design Stretch",
        "One property",
        "Do not also buy every sunset sail",
        "September is cheap and humid"
      ] }
    };
    P.FOOD_PICKS["cabo"] = {
      note: "Fish tacos in town beat a resort dining room.",
      budget: [
        "Breakfast: bakery in town",
        "Lunch: fish tacos on Medano",
        "Dinner: downtown casual",
        "Skip the marina tourist row on Lean",
        "AI: eat on-property plus one taco night"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: tacos or a proper casual",
        "Dinner: one reservation in town",
        "Stay in one pocket",
        "Flora Farms is a transfer"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: Flora Farms or a named table leftover",
        "One splurge",
        "Marina restaurants are a tax"
      ]
    };
    P.ACTIVITIES["cabo"] = {
      budget: [
        "Medano beach (free / included)",
        "Skip a party-boat upsell on Lean",
        "Arch photo from a cheap water taxi leftover",
        "Town walk, not a timeshare day",
        "Sunset is free from the sand"
      ],
      mid: [
        "One boat to the Arch (ticketed)",
        "Beach for the rest",
        "A second dock tour is the overrun",
        "San José del Cabo is a different evening",
        "Chileno leftover"
      ],
      lux: [
        "A small-group boat leftover (tour)",
        "Flora Farms day leftover",
        "Beach still wins",
        "Spa leftover-only",
        "Do not stack Arch, a camel, and a sunset sail"
      ]
    };
    P.HOTEL_EXAMPLES["tulum"] = {
      budget: { why: "Town (Aldea Zama / downtown) or a beach-road eco hotel. The beach road is a transfer.", picks: [
        "Downtown Tulum 2-star or a hostel-plus",
        "Aldea Zama limited-service",
        "A beach-road 3-star only if leftover covers the jungle tax",
        "Skip a hotel-zone timeshare day",
        "Bike is the Lean car"
      ] },
      mid: { why: "Beach-road boutique or a 4-star in town.", picks: [
        "A beach-road 3–4 star with bikes",
        "Aldea Zama boutique",
        "Adults-only mid if there are no kids",
        "One pocket",
        "Transfer in the rate"
      ] },
      lux: { why: "Beach-road flagship. One property.", picks: [
        "Be Tulum / a design Stretch",
        "Azulik leftover only if you accept the stairs and the price",
        "One property",
        "Do not also buy every cenote club",
        "Sargassum weeks happen"
      ] }
    };
    P.FOOD_PICKS["tulum"] = {
      note: "Tacos in town beat a beach-club minimum.",
      budget: [
        "Breakfast: panadería in town",
        "Lunch: tacos",
        "Dinner: downtown, not the beach-club menu",
        "Skip a club minimum on Lean",
        "Grocery if you have a kitchen"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: tacos or a proper casual",
        "Dinner: one reservation in town",
        "Beach-club lunch is a day-price",
        "Stay in one pocket"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named beach table leftover",
        "One splurge",
        "Club bottles are not dinner"
      ]
    };
    P.ACTIVITIES["tulum"] = {
      budget: [
        "Town bike loop (cheap)",
        "Tulum ruins in the morning (ticketed)",
        "Skip a beach-club day on Lean",
        "A cenote leftover (ticketed)",
        "Sargassum: have a backup cenote"
      ],
      mid: [
        "Ruins + one cenote (ticketed)",
        "Beach for the rest",
        "A second club is the overrun",
        "Coba is a long day",
        "Bike still"
      ],
      lux: [
        "A small-group ruin leftover (tour)",
        "A beach-club afternoon leftover",
        "A second cenote leftover",
        "Do not stack ruins, Coba, and a club",
        "Sian Ka’an is a different day"
      ]
    };
    P.HOTEL_EXAMPLES["prague"] = {
      budget: { why: "Old Town adjacent on a tram, not a castle-view tax.", picks: [
        "Mosaic House or a hostel-plus on a tram",
        "Ibis Praha Old Town-adjacent",
        "A Vinohrady 2-star — restaurants on the block",
        "Skip a river-cruise hotel on Lean",
        "Pack light — stairs"
      ] },
      mid: { why: "Malá Strana or Vinohrady 3–4 star. Tram, not taxis.", picks: [
        "Hotel Residence Agnes or an Old Town 3–4 star",
        "A Malá Strana boutique",
        "Vinohrady 4-star if you want quieter nights",
        "One neighborhood",
        "Castle is a morning, not a second hotel"
      ] },
      lux: { why: "A design or historic flagship. Christmas markets are peak.", picks: [
        "Augustine or a Malá Strana leftover",
        "Four Seasons Prague leftover",
        "One flagship",
        "Do not also buy every concert upsell",
        "January is the value window"
      ] }
    };
    P.FOOD_PICKS["prague"] = {
      note: "Trdelník is a snack. Beer and a lunch menu win.",
      budget: [
        "Breakfast: bakery",
        "Lunch: lunch menu, not Old Town square",
        "Dinner: Vinohrady or Žižkov casual",
        "Skip the castle steps restaurant",
        "Grocery one picnic"
      ],
      mid: [
        "Breakfast: bakery",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Beer hall is mid, not a tourist trap if you leave the square",
        "Stay off the square at night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Square restaurants are a tax"
      ]
    };
    P.ACTIVITIES["prague"] = {
      budget: [
        "Charles Bridge at dawn (free)",
        "Old Town loop, not a hop-on bus (free)",
        "One castle ticket, not four interiors (ticketed)",
        "Letná or a park picnic (free)",
        "Skip a dinner-cruise on Lean"
      ],
      mid: [
        "Castle timed + a neighborhood walk (ticketed / free)",
        "One concert leftover (ticketed)",
        "Jewish Quarter ticket leftover",
        "A second hill walk still",
        "Do not stack castle, bone church, and a cruise"
      ],
      lux: [
        "A reserved concert leftover (ticketed)",
        "Kutná Hora leftover (ticketed / train)",
        "A dawn bridge still (free)",
        "Do not stack three interiors",
        "Christmas markets are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["greece_athens"] = {
      budget: { why: "Psyri / Koukaki / Plaka-adjacent. Airport hotels are a taxi tax.", picks: [
        "Athens Studios or a Koukaki 2-star — walk to the Acropolis Museum",
        "A Psyri hostel-plus",
        "Ibis / a compact Syntagma 2-star",
        "Skip a Plaka tourist balcony on Lean",
        "Metro from the airport"
      ] },
      mid: { why: "Koukaki or Monastiraki 3–4 star. Metro, not taxis.", picks: [
        "A Koukaki boutique — walk to the museum",
        "Hotel Grande Bretagne is Stretch; mid is a Plaka-adjacent 3-star",
        "Psyri 4-star if nightlife is the point",
        "One neighborhood",
        "Islands are a different lodging night"
      ] },
      lux: { why: "Syntagma flagship. August is hot.", picks: [
        "Hotel Grande Bretagne leftover",
        "A Plaka 5-star leftover",
        "One flagship",
        "Do not also buy every island hop",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["greece_athens"] = {
      note: "Souvlaki and a taverna beat a rooftop every night.",
      budget: [
        "Breakfast: bakery",
        "Lunch: souvlaki in Psyri",
        "Dinner: Koukaki taverna, not the Acropolis steps",
        "Skip a rooftop minimum on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reserved taverna",
        "Stay in one neighborhood",
        "Rooftop once"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Rooftops are a view-price"
      ]
    };
    P.ACTIVITIES["greece_athens"] = {
      budget: [
        "Acropolis timed morning (ticketed)",
        "Neighborhood walk — Anafiotika / Koukaki (free)",
        "Skip a second hill ticket on Lean",
        "Changing of the guard is free",
        "Metro day pass"
      ],
      mid: [
        "Acropolis + museum — pick the same pocket (ticketed)",
        "One neighborhood walk (free)",
        "Cape Sounion leftover (tour)",
        "A second hill leftover",
        "Do not stack Delphi into 2 nights"
      ],
      lux: [
        "A small-group food walk leftover (tour)",
        "Acropolis + a second site leftover",
        "A neighborhood morning still",
        "Islands need a ferry night",
        "August midday is indoor on purpose"
      ]
    };
    P.HOTEL_EXAMPLES["edinburgh"] = {
      budget: { why: "Old Town or Leith. A cheap airport room is a tram tax.", picks: [
        "Safestay or a hostel-plus on the Royal Mile-adjacent",
        "Premier Inn Lauriston or a 2-star on a bus line",
        "Leith 2-star if you want restaurants over the Mile",
        "Skip a castle-view tax on Lean",
        "Pack light — stairs and hills"
      ] },
      mid: { why: "Old Town or New Town 3–4 star. Bus, not a car.", picks: [
        "The Principal or a New Town 3–4 star",
        "A Grassmarket boutique",
        "Leith 4-star if leftover covers the shore",
        "One neighborhood",
        "Festival weeks are peak"
      ] },
      lux: { why: "New Town flagship. August Festival is not the value window.", picks: [
        "The Balmoral leftover",
        "Fingal or a Leith Stretch",
        "One flagship",
        "Do not also buy every ghost tour",
        "January is cheap and dark"
      ] }
    };
    P.FOOD_PICKS["edinburgh"] = {
      note: "A pub pie and a bakery beat a Mile tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a pub off the Mile",
        "Dinner: Leith or Stockbridge casual",
        "Skip the first Mile restaurant",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper pub",
        "Dinner: one reservation in Leith",
        "Stay off the Mile at night",
        "Whisky is a tasting, not a pub crawl tax"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Castle restaurants are a tax"
      ]
    };
    P.ACTIVITIES["edinburgh"] = {
      budget: [
        "Royal Mile + Arthur’s Seat (free)",
        "Castle is a ticket — Lean can skip the interior (ticketed)",
        "A free museum — National Museum (free)",
        "Skip a ghost tour on Lean",
        "Calton Hill at dusk (free)"
      ],
      mid: [
        "Castle or Holyrood — pick one (ticketed)",
        "Arthur’s Seat (free)",
        "One whisky tasting leftover (ticketed)",
        "A second hill still",
        "Do not stack castle, palace, and a day trip"
      ],
      lux: [
        "A reserved Festival show leftover (ticketed)",
        "A day trip leftover (tour / train)",
        "A hill morning still",
        "Do not stack three interiors",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["dublin"] = {
      budget: { why: "Temple Bar-adjacent is a tax. Stay in the Liberties or near a Luas stop.", picks: [
        "Generator Dublin or a hostel-plus in Smithfield",
        "Premier Inn or a 2-star on the Luas",
        "A Liberties 2-star — Guinness-adjacent walking",
        "Skip a Temple Bar balcony on Lean",
        "Airport bus, not a taxi habit"
      ] },
      mid: { why: "Georgian or Docklands 3–4 star. Luas, not a car.", picks: [
        "The Merrion is Stretch; mid is a Georgian 3–4 star",
        "A Smithfield boutique",
        "Docklands 4-star if leftover covers the river",
        "One neighborhood",
        "Rugby / concert weeks lift rooms"
      ] },
      lux: { why: "Merrion / Shelbourne class.", picks: [
        "The Merrion leftover",
        "The Shelbourne leftover",
        "One flagship",
        "Do not also buy every distillery tour",
        "January is the value window"
      ] }
    };
    P.FOOD_PICKS["dublin"] = {
      note: "A breakfast roll and a pub beat Temple Bar menus.",
      budget: [
        "Breakfast: bakery or a roll",
        "Lunch: a pub off Temple Bar",
        "Dinner: the Liberties or Stoneybatter",
        "Skip Temple Bar dinner on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper pub",
        "Dinner: one reservation",
        "Stay off Temple Bar at night",
        "Guinness Storehouse lunch is a ticket-price"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Temple Bar is a walk-through"
      ]
    };
    P.ACTIVITIES["dublin"] = {
      budget: [
        "Trinity / a Georgian square walk (free)",
        "Guinness Storehouse is a ticket — Lean can skip (ticketed)",
        "Kilmainham leftover (ticketed)",
        "Phoenix Park (free)",
        "Skip a hop-on bus"
      ],
      mid: [
        "Guinness or Kilmainham — pick one (ticketed)",
        "A neighborhood walk (free)",
        "Howth leftover (train)",
        "A second park still",
        "Do not stack two distilleries and a castle"
      ],
      lux: [
        "A reserved tasting leftover (ticketed)",
        "A day trip leftover (train / tour)",
        "A park morning still",
        "Do not stack three interiors",
        "Match days are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["santorini"] = {
      budget: { why: "Fira or a bus-linked village. Oia caldera suites are Stretch.", picks: [
        "Fira hostel-plus or a 2-star off the caldera rim",
        "A Kamari 2-star if you want a beach bus",
        "Skip an Oia cave suite on Lean",
        "ATMs and water are a plan",
        "Donkey stairs are not an elevator"
      ] },
      mid: { why: "Fira / Imerovigli 3–4 star. One village.", picks: [
        "A Fira caldera-adjacent 3-star",
        "Imerovigli mid if leftover covers the quieter rim",
        "Kamari 4-star if the beach is the point",
        "One village",
        "Cruise-ship days crowd Oia"
      ] },
      lux: { why: "Oia cave suite. Leftover only.", picks: [
        "Oia caldera suite leftover",
        "Canaves or a design Stretch",
        "One village",
        "Do not also buy every catamaran",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["santorini"] = {
      note: "Tomato-and-feta tavernas beat a caldera-minimum.",
      budget: [
        "Breakfast: bakery in Fira",
        "Lunch: a gyros, not a caldera menu",
        "Dinner: a village taverna off the rim",
        "Skip an Oia sunset restaurant on Lean",
        "Grocery water"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper taverna",
        "Dinner: one caldera sit-down if leftover covers it",
        "Stay in one village",
        "Wine tasting is mid"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named caldera leftover",
        "One splurge",
        "Sunset tables are a view-price"
      ]
    };
    P.ACTIVITIES["santorini"] = {
      budget: [
        "Fira walk + a bus to Oia for sunset from a public terrace (cheap / free)",
        "Skip a donkey ride on Lean",
        "A beach bus leftover",
        "Akrotiri leftover (ticketed)",
        "Water and a hat are the activity"
      ],
      mid: [
        "Oia sunset from a public spot + one ruin (free / ticketed)",
        "A caldera hike leftover",
        "One boat leftover",
        "A second village bus still",
        "Do not stack a catamaran and two ruins"
      ],
      lux: [
        "A catamaran leftover (tour)",
        "A reserved Oia dinner leftover",
        "A dawn walk still",
        "Do not stack every viewpoint",
        "Cruise mornings are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["kauai"] = {
      budget: { why: "Condo in Kapaa / Lihue or a South Shore studio. The kitchen is the Lean product.", picks: [
        "Kapaa studio condo — grocery the first hour",
        "A Lihue 2-star crash pad near the airport only the first night",
        "HI Kauai or a hostel-plus if you packed light",
        "Skip a North Shore hotel on Lean unless that is the point",
        "Bus exists; a car is still the usual plan"
      ] },
      mid: { why: "Poipu or Kapaa midrise. Resort fees and parking will show up.", picks: [
        "Sheraton Kauai or a Poipu 3–4 star",
        "A Kapaa 4-star if you want cheaper dinners",
        "Grand Hyatt is Stretch-adjacent; mid is a Poipu condo-plus",
        "One shore",
        "North Shore mid only if leftover covers the drive"
      ] },
      lux: { why: "North Shore or a cliff flagship.", picks: [
        "1 Hotel Hanalei Bay leftover",
        "Grand Hyatt Kauai Stretch",
        "One shore",
        "Do not also book every helicopter",
        "Na Pali is a boat or a hard hike, not both"
      ] }
    };
    P.FOOD_PICKS["kauai"] = {
      note: "Plate lunch and a condo kitchen beat resort rows.",
      budget: [
        "Breakfast: grocery the condo",
        "Lunch: plate lunch",
        "Dinner: cook two nights",
        "Skip the resort breakfast buffet",
        "Shave ice once"
      ],
      mid: [
        "Breakfast: condo + one café",
        "Lunch: plate lunch or poke",
        "Dinner: one fish sit-down",
        "Stay on your shore",
        "Hanalei dinner only if you slept north"
      ],
      lux: [
        "Breakfast: condo still wins",
        "Lunch: poke",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Do not stack every fish dinner"
      ]
    };
    P.ACTIVITIES["kauai"] = {
      budget: [
        "The beach in front of the condo (free)",
        "A lookout with cheap parking (cheap)",
        "Skip a helicopter on Lean (tour)",
        "Grocery picnic",
        "Kalalau is not a Lean day hike"
      ],
      mid: [
        "One snorkel or a short boat (ticketed)",
        "A second beach (free)",
        "Waimea Canyon if you already have the car",
        "A helicopter leftover",
        "Do not stack canyon, Na Pali, and a heli"
      ],
      lux: [
        "A reserved Na Pali boat leftover (tour)",
        "A helicopter leftover",
        "A beach day with no itinerary (free)",
        "Neighbor-island hops are a second fare",
        "Do not stack every adventure"
      ]
    };
    P.HOTEL_EXAMPLES["hawaii_big_island"] = {
      budget: { why: "Kona condo or a Hilo 2-star if volcano days are the point. Two sides is two climates.", picks: [
        "Kona studio condo — grocery the first hour",
        "A Kailua-Kona 2-star a block off Aliʻi",
        "Hilo 2-star if the park is the trip",
        "Skip a resort breakfast hotel on Lean",
        "A car is assumed once you leave town"
      ] },
      mid: { why: "Aliʻi Drive midrise or a Kohala 3–4 star.", picks: [
        "Courtyard King Kamehameha or an Aliʻi 3–4 star",
        "A Kohala mid if leftover covers the resort coast",
        "A Hilo 3-star if volcano mornings matter",
        "Pick Kona or Hilo",
        "Do not commute Saddle Road twice a day"
      ] },
      lux: { why: "Kohala Four Seasons class.", picks: [
        "Four Seasons Hualalai leftover",
        "Mauna Lani Stretch",
        "One coast",
        "Do not also book every manta and heli",
        "Volcano nights are a different lodging"
      ] }
    };
    P.FOOD_PICKS["hawaii_big_island"] = {
      note: "Plate lunch and a condo kitchen. Resort rows are a second lodging charge.",
      budget: [
        "Breakfast: grocery",
        "Lunch: plate lunch in Kona or Hilo",
        "Dinner: cook two nights",
        "Skip the resort buffet",
        "Malasadas once"
      ],
      mid: [
        "Breakfast: condo + café",
        "Lunch: poke or plate lunch",
        "Dinner: one fish sit-down",
        "Stay on your side at night",
        "Volcano village dinner only if you slept there"
      ],
      lux: [
        "Breakfast: condo still wins",
        "Lunch: poke",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Manta dinner packages are a tour-price"
      ]
    };
    P.ACTIVITIES["hawaii_big_island"] = {
      budget: [
        "A town beach in Kona (free)",
        "Volcanoes National Park is a ticketed day (ticketed)",
        "Skip a helicopter on Lean",
        "Grocery picnic",
        "Manta snorkel is a night-price"
      ],
      mid: [
        "Volcano day + one beach (ticketed / free)",
        "A manta night leftover (tour)",
        "A second beach still",
        "Mauna Kea leftover — altitude is real",
        "Do not stack volcano, manta, and a heli"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "A helicopter leftover",
        "A quiet beach morning still",
        "Neighbor-island hops are a second fare",
        "Do not stack every night dive"
      ]
    };
    P.HOTEL_EXAMPLES["denver"] = {
      budget: { why: "Walkable LoDo / RiNo. A cheap airport room is a rideshare habit.", picks: [
        "HI Denver or a hostel-plus on the light rail",
        "Hampton Downtown — limited-service, rail downstairs",
        "A RiNo 2-star if that is the night you came for",
        "Skip a Tech Center cloverleaf on Lean",
        "Union Station pocket beats DIA lodging"
      ] },
      mid: { why: "LoDo or RiNo 3–4 star. Light rail beats a rental in the core.", picks: [
        "The Crawford or a Union Station 3–4 star",
        "A RiNo boutique",
        "The Maven or a Downtown 4-star",
        "One pocket",
        "Do not split Boulder into this lodging without a transfer"
      ] },
      lux: { why: "Union Station flagship.", picks: [
        "The Oxford or a LoDo leftover",
        "Four Seasons Denver leftover",
        "One tower",
        "Do not also buy every mountain tour",
        "January is cheap and icy"
      ] }
    };
    P.FOOD_PICKS["denver"] = {
      note: "A food hall and a burrito beat a hotel steakhouse.",
      budget: [
        "Breakfast: bakery or a burrito",
        "Lunch: Avanti or a food hall",
        "Dinner: RiNo casual",
        "Skip Larimer tourist menus on Lean",
        "Grocery a mountain-day picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation in RiNo",
        "Stay in one pocket",
        "Boulder dinner is a transfer"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel restaurants are a tax"
      ]
    };
    P.ACTIVITIES["denver"] = {
      budget: [
        "16th Street / Union Station walk (free)",
        "A free museum hour if the calendar lines up",
        "Skip a mountain tour on Lean if you came for the city",
        "RiNo murals (free)",
        "Light rail day pass"
      ],
      mid: [
        "Red Rocks if leftover covers a show or the park (ticketed / cheap)",
        "One museum — DAM (ticketed)",
        "A neighborhood walk still",
        "A mountain day leftover — packed lunch",
        "Do not stack Red Rocks, Boulder, and a 14er"
      ],
      lux: [
        "A reserved mountain tour leftover (tour)",
        "A Red Rocks show leftover",
        "A city walk still",
        "Do not stack two 14ers",
        "Altitude slack is an activity"
      ]
    };
    P.HOTEL_EXAMPLES["charleston"] = {
      budget: { why: "Upper King or a South of Broad-adjacent 2-star. Peninsula walking.", picks: [
        "NotSoHostel or a hostel-plus",
        "Hampton Downtown — limited-service",
        "An Upper King 2-star — restaurants on the block",
        "Skip a Mount Pleasant cloverleaf on Lean",
        "A car is a parking tax on the peninsula"
      ] },
      mid: { why: "French Quarter or Upper King 3–4 star.", picks: [
        "The Restoration or a King Street boutique",
        "Zero George is Stretch-adjacent; mid is a 3–4 star on the peninsula",
        "An Upper King 4-star",
        "One peninsula",
        "Folly Beach is a different night"
      ] },
      lux: { why: "South of Broad flagship.", picks: [
        "Zero George leftover",
        "The Spectator or a historic Stretch",
        "One property",
        "Do not also buy every carriage",
        "August is hot and discounted"
      ] }
    };
    P.FOOD_PICKS["charleston"] = {
      note: "She-crab and a bakery beat a Market tourist menu.",
      budget: [
        "Breakfast: Callie’s or a bakery",
        "Lunch: a counter off the Market",
        "Dinner: Upper King casual",
        "Skip a carriage-loop restaurant on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay on the peninsula",
        "Folly dinner only if you slept there"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: FIG or a named table leftover",
        "One splurge",
        "Market restaurants are a tax"
      ]
    };
    P.ACTIVITIES["charleston"] = {
      budget: [
        "Battery / Rainbow Row walk (free)",
        "One house museum — skip a stack (ticketed)",
        "Skip a carriage on Lean",
        "Waterfront Park (free)",
        "Market is a pass-through"
      ],
      mid: [
        "One plantation or a house museum — pick one (ticketed)",
        "A neighborhood walk still",
        "A carriage leftover",
        "Folly Beach leftover",
        "Do not stack two plantations"
      ],
      lux: [
        "A reserved food walk leftover (tour)",
        "A second house leftover",
        "A Battery morning still",
        "Do not stack three interiors",
        "Spoleto weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["savannah"] = {
      budget: { why: "Historic District walking. A cheap airport room is a rideshare habit.", picks: [
        "The Thunderbird Inn or a Historic District 2-star",
        "Hampton Historic District — limited-service",
        "A hostel-plus on a square",
        "Skip a Gateway cloverleaf on Lean",
        "Squares are the product"
      ] },
      mid: { why: "A square-adjacent 3–4 star.", picks: [
        "The Alida or a river-adjacent mid",
        "Perry Lane Hotel is Stretch-adjacent; mid is a square 3–4 star",
        "A Historic District boutique",
        "One district",
        "Tybee is a different night"
      ] },
      lux: { why: "A river or square flagship.", picks: [
        "Perry Lane leftover",
        "The Gastonian leftover",
        "One property",
        "Do not also buy every ghost tour",
        "August is hot and discounted"
      ] }
    };
    P.FOOD_PICKS["savannah"] = {
      note: "A biscuit and a square picnic beat a river tourist menu.",
      budget: [
        "Breakfast: biscuit or a bakery",
        "Lunch: a counter off River Street",
        "Dinner: a neighborhood casual",
        "Skip River Street dinner on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay on a square at night",
        "Tybee dinner only if you slept there"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "River Street is a tax"
      ]
    };
    P.ACTIVITIES["savannah"] = {
      budget: [
        "Square-hopping walk (free)",
        "Forsyth Park (free)",
        "One house museum (ticketed)",
        "Skip a ghost tour on Lean",
        "River Street is a pass-through"
      ],
      mid: [
        "One house or the Cathedral — pick one (ticketed)",
        "A square walk still",
        "A ghost tour leftover",
        "Tybee leftover",
        "Do not stack two house museums and a ghost night"
      ],
      lux: [
        "A reserved food walk leftover (tour)",
        "A second house leftover",
        "A dawn square still",
        "Do not stack three interiors",
        "St. Patrick’s week is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["asheville"] = {
      budget: { why: "Downtown or West Asheville. A cheap tunnel-road motel plus nightly Ubers is not Lean.", picks: [
        "HI-adjacent / a Downtown 2-star",
        "Foundry or a compact Downtown room",
        "A West Asheville 2-star if that is the restaurant pocket",
        "Skip a Biltmore-gate hotel on Lean unless that is the trip",
        "A car helps for parkways; downtown walking does not need one"
      ] },
      mid: { why: "Downtown boutique or a Biltmore-adjacent mid.", picks: [
        "The Foundry or a Downtown 3–4 star",
        "Kimpton Arras or a Downtown 4-star",
        "A Biltmore Village mid if leftover covers the estate",
        "One pocket",
        "October leaf weeks are peak"
      ] },
      lux: { why: "Omni Grove Park or a design flagship.", picks: [
        "Omni Grove Park Inn leftover",
        "The Inn on Biltmore leftover",
        "One property",
        "Do not also buy every spa add-on",
        "January is cheap and icy"
      ] }
    };
    P.FOOD_PICKS["asheville"] = {
      note: "Biscuits and a food hall beat a hotel dining room.",
      budget: [
        "Breakfast: Biscuit Head or a bakery",
        "Lunch: a food hall or a counter",
        "Dinner: West Asheville casual",
        "Skip a Biltmore restaurant on Lean",
        "Grocery a Blue Ridge picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation Downtown",
        "Stay in one pocket",
        "Biltmore dinner only if leftover covers the estate"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Grove Park dining is a leftover"
      ]
    };
    P.ACTIVITIES["asheville"] = {
      budget: [
        "Downtown mural / river walk (free)",
        "A parkway overlook if you already have the car (free / cheap)",
        "Skip Biltmore on Lean unless that is the trip (ticketed)",
        "A brewery walk is optional, not a meal plan",
        "Pack layers"
      ],
      mid: [
        "Biltmore or a parkway day — pick one (ticketed / car)",
        "A neighborhood walk still",
        "A waterfall leftover",
        "A second overlook still",
        "Do not stack Biltmore, a raft, and the parkway"
      ],
      lux: [
        "A reserved estate leftover (ticketed)",
        "A guided hike leftover (tour)",
        "A downtown morning still",
        "Do not stack every waterfall",
        "Leaf weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["yellowstone"] = {
      budget: { why: "In-park lodge or a gateway town. Most lodges close Nov–Apr.", picks: [
        "A West Yellowstone 2-star — grocery the first hour",
        "Gardiner 2-star if the north gate is the plan",
        "Old Faithful Lodge cabin class if you booked early",
        "Skip a Jackson hotel as this lodging",
        "June–August is the realistic family window"
      ] },
      mid: { why: "In-park mid lodge. Book months out.", picks: [
        "Old Faithful Inn or Lake Yellowstone mid if leftover covers it",
        "Canyon Lodge mid",
        "A West Yellowstone 3-star if in-park is sold",
        "One gate",
        "Grand Teton is a different lodging night"
      ] },
      lux: { why: "Old Faithful Inn suite or a Teton flagship leftover.", picks: [
        "Old Faithful Inn leftover",
        "Lake Yellowstone Stretch",
        "One park base",
        "Do not also buy every snowcoach in summer",
        "Winter is a different product"
      ] }
    };
    P.FOOD_PICKS["yellowstone"] = {
      note: "Cafeteria and a cooler beat a lodge dining room every night.",
      budget: [
        "Breakfast: grocery / cafeteria",
        "Lunch: packed on loop days",
        "Dinner: cafeteria or gateway casual",
        "Skip a lodge steak every night",
        "Water is a plan"
      ],
      mid: [
        "Breakfast: cafeteria + one sit-down",
        "Lunch: packed",
        "Dinner: one lodge dining-room night",
        "Stay in your gate town at night",
        "Mammoth dinner only if you slept north"
      ],
      lux: [
        "Breakfast: still pack loop days",
        "Lunch: a sit-down if you are in a village",
        "Dinner reservation: a lodge leftover",
        "One splurge",
        "Do not eat every meal in a dining room"
      ]
    };
    P.ACTIVITIES["yellowstone"] = {
      budget: [
        "One loop + a geyser basin walk (park entry)",
        "Skip a guided snowmobile in summer",
        "A visitor-center hour (free with entry)",
        "Wildlife at dawn if you already have the car",
        "Do not treat this as a day-trip from Jackson"
      ],
      mid: [
        "Two basins on different days (park entry)",
        "A longer walk leftover",
        "Grand Teton leftover — a transfer day",
        "A second dawn still",
        "Do not stack two parks and a boat"
      ],
      lux: [
        "A private guide leftover (tour)",
        "A second park day leftover",
        "A quiet basin morning still",
        "Winter snowcoach leftover",
        "Do not invent a 4-park week"
      ]
    };
    P.HOTEL_EXAMPLES["national_parks_southwest"] = {
      budget: { why: "Springdale / Tusayan-adjacent / Moab — pick one park as the bed.", picks: [
        "Springdale 2-star if Zion is the lead",
        "A Moab motel if Arches / Canyonlands is the lead",
        "A Kanab 2-star if you are looping",
        "Skip a Las Vegas hotel as this lodging",
        "A car is the plan"
      ] },
      mid: { why: "A 3-star in the gateway you chose.", picks: [
        "Cable Mountain or a Springdale mid",
        "A Moab 3–4 star",
        "Ruby’s / a Bryce gateway mid if Bryce is the lead",
        "One gateway",
        "Do not sleep in three towns in three nights"
      ] },
      lux: { why: "Amangiri is a different budget. In-park leftover if it exists.", picks: [
        "In-park lodge leftover at Zion or Bryce",
        "A design desert Stretch",
        "One base",
        "Do not also buy every slot-canyon lottery as a sure thing",
        "Summer is brutally hot"
      ] }
    };
    P.FOOD_PICKS["national_parks_southwest"] = {
      note: "Grocery and a packed cooler. Gateway restaurants price like islands.",
      budget: [
        "Breakfast: grocery",
        "Lunch: packed in the park",
        "Dinner: one casual in the gateway",
        "Skip a hotel restaurant every night",
        "Water is a plan"
      ],
      mid: [
        "Breakfast: café + packed lunch",
        "Lunch: packed",
        "Dinner: one sit-down in town",
        "Stay in your gateway",
        "Do not drive 90 minutes to dinner"
      ],
      lux: [
        "Breakfast: still pack park days",
        "Lunch: a sit-down if you skipped a hike",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Do not eat every meal out on a 5-park loop"
      ]
    };
    P.ACTIVITIES["national_parks_southwest"] = {
      budget: [
        "One park day with slack (park entry)",
        "Skip a second park on Lean if the drive is the day",
        "A visitor-center hour",
        "Sunrise if you slept close",
        "Lottery hikes are not a sure Lean plan"
      ],
      mid: [
        "Two parks with a transfer plan (park entry)",
        "A longer hike leftover",
        "A second sunrise still",
        "Antelope leftover — it is a tour-price",
        "Do not stack three parks in two days"
      ],
      lux: [
        "A slot-canyon tour leftover (tour)",
        "A third park leftover",
        "A quiet trail morning still",
        "Do not stack every lottery",
        "Heat is the limiter in summer"
      ]
    };
    P.HOTEL_EXAMPLES["smoky_mountains"] = {
      budget: { why: "Gatlinburg edge or a Pigeon Forge value. The park is free; the strip is not.", picks: [
        "A Gatlinburg 2-star off the main drag",
        "A Pigeon Forge limited-service if the shows are the point",
        "A cabin with a kitchen if the party will cook",
        "Skip a downtown balcony on Lean",
        "October leaf weeks double rooms"
      ] },
      mid: { why: "A cabin or a Gatlinburg 3-star. A car is assumed.", picks: [
        "A cabin mid with a kitchen",
        "The Park Vista or a Gatlinburg 3–4 star",
        "A Townsend quieter mid if leftover covers the quiet",
        "One town",
        "Cades Cove is a morning, not a second hotel"
      ] },
      lux: { why: "A nicer cabin or an in-park lodge leftover.", picks: [
        "LeConte Lodge is a hike lottery, not a Stretch button",
        "A luxury cabin leftover",
        "One base",
        "Do not also buy every show",
        "January is cheap and icy"
      ] }
    };
    P.FOOD_PICKS["smoky_mountains"] = {
      note: "The cabin kitchen is the budget. The strip is a snack tax.",
      budget: [
        "Breakfast: grocery the cabin",
        "Lunch: packed in the park",
        "Dinner: cook two nights",
        "Skip a pancake-house every morning",
        "One donut / fudge once"
      ],
      mid: [
        "Breakfast: cabin + one café",
        "Lunch: packed",
        "Dinner: one sit-down in town",
        "Stay in your town",
        "Pigeon Forge dinner only if you slept there"
      ],
      lux: [
        "Breakfast: cabin still wins",
        "Lunch: a sit-down if you skipped the park",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Do not eat every meal on the strip"
      ]
    };
    P.ACTIVITIES["smoky_mountains"] = {
      budget: [
        "Park entry is free — Cades Cove or a short trail (free)",
        "Skip a mini-golf stack on Lean",
        "A visitor-center hour",
        "Clingmans leftover if the road is open",
        "Pack layers and a picnic"
      ],
      mid: [
        "A longer trail or Cades Cove loop (free / car)",
        "One show leftover if that is the party (ticketed)",
        "A second trail still",
        "Dollywood leftover",
        "Do not stack Dollywood, a show, and a 12-mile hike"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "Dollywood leftover",
        "A quiet trail morning still",
        "Do not stack every attraction",
        "Leaf weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["austin"] = {
      budget: { why: "Walkable Downtown / East Austin. A cheap airport room is a rideshare habit.", picks: [
        "HI Austin or a hostel-plus on a bus line",
        "Hampton Downtown — limited-service",
        "An East Austin 2-star if that is the night you came for",
        "Skip a Domain cloverleaf on Lean",
        "South Congress 2-star if you will walk the strip"
      ] },
      mid: { why: "Downtown or East 3–4 star. A scooter is not a plan; a car is optional in the core.", picks: [
        "The LINE or a Downtown 3–4 star",
        "Hotel Van Zandt or a Rainey 4-star",
        "An East Austin boutique",
        "One pocket",
        "SXSW / ACL weeks are not the value window"
      ] },
      lux: { why: "South Congress or Downtown flagship.", picks: [
        "Hotel Saint Cecilia leftover",
        "The Driskill leftover",
        "One property",
        "Do not also buy every barbecue pilgrimage as a taxi loop",
        "August is hot and discounted"
      ] }
    };
    P.FOOD_PICKS["austin"] = {
      note: "Breakfast tacos and one barbecue plate beat a hotel restaurant.",
      budget: [
        "Breakfast: taco, not the hotel",
        "Lunch: a food truck",
        "Dinner: one barbecue plate — Franklin leftover-adjacent; Lean is a neighborhood shop",
        "Skip Rainey cover-charge dinners on Lean",
        "Grocery a swim-day picnic"
      ],
      mid: [
        "Breakfast: tacos",
        "Lunch: a proper casual on East",
        "Dinner: one reservation",
        "Stay in one pocket",
        "Barbecue once, then tacos"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel restaurants are a tax"
      ]
    };
    P.ACTIVITIES["austin"] = {
      budget: [
        "Barton Springs or a lake swim (cheap)",
        "South Congress daylight walk (free)",
        "Skip a party-bike on Lean",
        "A bat-watch in season (free)",
        "Bus day pass"
      ],
      mid: [
        "One ticketed — LBJ Library or a show (ticketed)",
        "A swim + a neighborhood walk",
        "Barbecue as an activity once",
        "A second swim still",
        "Do not stack two shows and a boat"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A boat leftover (tour)",
        "A dawn swim still",
        "Do not stack ACL into a 2-night stay without leftover",
        "Formula 1 weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["nashville"] = {
      budget: { why: "Walkable Downtown-adjacent or East Nashville. Broadway balconies are a tax.", picks: [
        "A Downtown hostel-plus or a 2-star off Broadway",
        "Hampton Downtown — limited-service",
        "An East Nashville 2-star if that is the night you came for",
        "Skip a Broadway balcony on Lean",
        "The Gulch 2-star if you will walk to dinner"
      ] },
      mid: { why: "The Gulch or East 3–4 star. A car is optional in the core.", picks: [
        "Graduate Nashville or a Gulch 3–4 star",
        "The Hermitage is Stretch-adjacent; mid is a Downtown 4-star off Broadway",
        "An East Nashville boutique",
        "One pocket",
        "CMA Fest weeks are not the value window"
      ] },
      lux: { why: "A historic flagship. Bachelorette weekends lift rooms.", picks: [
        "The Hermitage leftover",
        "Thompson Nashville leftover",
        "One property",
        "Do not also buy every honky-tonk cover as a plan",
        "January is the value window"
      ] }
    };
    P.FOOD_PICKS["nashville"] = {
      note: "Hot chicken and a biscuit beat a Broadway menu.",
      budget: [
        "Breakfast: biscuit, not the hotel",
        "Lunch: hot chicken — Hattie B’s class, or a neighborhood shop",
        "Dinner: East Nashville casual",
        "Skip Broadway dinner on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation off Broadway",
        "Stay in one pocket",
        "Hot chicken once, then a meat-and-three"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Broadway menus are a tax"
      ]
    };
    P.ACTIVITIES["nashville"] = {
      budget: [
        "Broadway daylight walk; the night is optional (free)",
        "Country Music Hall of Fame is a ticket (ticketed)",
        "Skip a pedal tavern on Lean",
        "East Nashville stroll (free)",
        "Ryman leftover"
      ],
      mid: [
        "Hall of Fame or Ryman — pick one (ticketed)",
        "A neighborhood walk still",
        "A show leftover",
        "A second museum leftover",
        "Do not stack three music interiors"
      ],
      lux: [
        "A reserved Opry leftover (ticketed)",
        "A second show leftover",
        "A dawn walk still",
        "Do not stack CMA week without leftover",
        "Bachelorette weekends are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["portland_oregon"] = {
      budget: { why: "Walkable Division / Alberta / Downtown on MAX. A cheap airport room is a rideshare habit.", picks: [
        "HI Portland or a hostel-plus on MAX",
        "Hampton Downtown — limited-service",
        "A Division 2-star if that is the food pocket",
        "Skip a Beaverton cloverleaf on Lean",
        "This is not Portland, Maine"
      ] },
      mid: { why: "Downtown or Division 3–4 star. MAX / streetcar, not a car in the core.", picks: [
        "The Hoxton Portland or a Downtown 3–4 star",
        "A Division / Belmont boutique",
        "Ace Portland is mid-plus",
        "One pocket",
        "Do not split the coast into this lodging without a transfer"
      ] },
      lux: { why: "A design flagship.", picks: [
        "The Nines leftover",
        "Canopy or a Downtown Stretch",
        "One property",
        "Do not also buy every food-cart crawl as a taxi loop",
        "January rain is the discount"
      ] }
    };
    P.FOOD_PICKS["portland_oregon"] = {
      note: "Food carts and a bakery beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery or a doughnut, not the hotel",
        "Lunch: a food-cart pod",
        "Dinner: Division casual",
        "Skip a tasting-menu on Lean",
        "Grocery a gorge picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: carts or a proper casual",
        "Dinner: one reservation on Division",
        "Stay in one pocket",
        "Carts still win one night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel restaurants are a tax"
      ]
    };
    P.ACTIVITIES["portland_oregon"] = {
      budget: [
        "Powell’s + a neighborhood walk (free / cheap)",
        "A food-cart pod is lunch, not an activity ticket",
        "Skip a brewery van on Lean",
        "Waterfront Park (free)",
        "MAX day pass"
      ],
      mid: [
        "One museum — Portland Art Museum (ticketed)",
        "A gorge waterfall leftover if you have a car",
        "A second neighborhood still",
        "Powell’s still",
        "Do not stack gorge, Hood, and a coast day"
      ],
      lux: [
        "A reserved food walk leftover (tour)",
        "A gorge day leftover",
        "A dawn walk still",
        "Do not stack every waterfall",
        "Rose Festival weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["scottsdale"] = {
      budget: { why: "Old Town walking. This is the resort-adjacent product — Phoenix is a different lodging math.", picks: [
        "An Old Town 2-star — walk to dinner",
        "Hampton Old Town-adjacent",
        "A Motel 6-class only if leftover is tight and you have a car",
        "Skip a Phoenix Downtown hotel as this lodging",
        "Summer is cheap and dangerous-hot"
      ] },
      mid: { why: "Old Town boutique or a resort mid.", picks: [
        "Hotel Valley Ho — mid-century mid",
        "Andaz Scottsdale or a resort mid",
        "An Old Town 3–4 star",
        "One pocket",
        "Do not split Sedona into this lodging without a transfer day"
      ] },
      lux: { why: "A spa resort flagship. Winter weekends are peak.", picks: [
        "The Phoenician leftover",
        "Four Seasons Troon leftover",
        "Sanctuary Camelback leftover",
        "One campus",
        "June rooms are cheap because the air hurts"
      ] }
    };
    P.FOOD_PICKS["scottsdale"] = {
      note: "Old Town casual beats a resort dining room.",
      budget: [
        "Breakfast: café in Old Town, not the resort buffet",
        "Lunch: taco shop",
        "Dinner: Old Town casual",
        "Skip a resort steakhouse on Lean",
        "Grocery a trail picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation in Old Town",
        "Stay Old Town at night",
        "Resort dinner only if leftover covers the campus"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named resort table leftover",
        "One splurge",
        "Resort dining is a second lodging charge"
      ]
    };
    P.ACTIVITIES["scottsdale"] = {
      budget: [
        "Old Town walk (free)",
        "A desert trail at dawn (free / cheap)",
        "Skip a spa add-on on Lean",
        "Heard Museum is a Phoenix transfer",
        "Pack water"
      ],
      mid: [
        "Taliesin or a museum — pick one (ticketed)",
        "A dawn trail still",
        "A spa leftover",
        "Old Town evening still",
        "Do not stack Sedona and a spa day"
      ],
      lux: [
        "A reserved spa leftover (ticketed)",
        "A jeep tour leftover (tour)",
        "A dawn trail still",
        "Do not stack two resorts and Sedona",
        "Winter weekends are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["seattle"] = {
      budget: { why: "Walkable Belltown / Capitol Hill / Pioneer Square. A cheap airport room is a Link tax.", picks: [
        "HI Seattle or a hostel-plus on Link",
        "Palihotel-adjacent / a Belltown 2-star",
        "A Capitol Hill 2-star if that is the night you came for",
        "Skip a Tukwila cloverleaf on Lean",
        "Pike Place is a morning, not a hotel address"
      ] },
      mid: { why: "Belltown or Capitol Hill 3–4 star. Link / streetcar, not a car in the core.", picks: [
        "Thompson Seattle or a Belltown 3–4 star",
        "A Capitol Hill boutique",
        "Hotel Theodore or a Downtown 4-star",
        "One pocket",
        "July–August is peak and dry"
      ] },
      lux: { why: "A waterfront or downtown flagship.", picks: [
        "Four Seasons Seattle leftover",
        "Fairmont Olympic leftover",
        "One tower",
        "Do not also buy every island ferry as a sure day",
        "January rain is the discount"
      ] }
    };
    P.FOOD_PICKS["seattle"] = {
      note: "A bakery and a teriyaki beat a Pike Place tourist menu.",
      budget: [
        "Breakfast: bakery, not the hotel",
        "Lunch: teriyaki or a counter off the Market",
        "Dinner: Capitol Hill casual",
        "Skip the first Market restaurant",
        "Grocery a ferry picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation on the Hill",
        "Stay in one pocket",
        "Market once, then the neighborhood"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Market restaurants are a tax"
      ]
    };
    P.ACTIVITIES["seattle"] = {
      budget: [
        "Pike Place in the morning (free)",
        "A waterfront walk (free)",
        "Skip the paid Great Wheel on Lean (ticketed)",
        "Chihuly leftover (ticketed)",
        "Link day pass"
      ],
      mid: [
        "Chihuly or MoPOP — pick one (ticketed)",
        "A neighborhood walk still",
        "A ferry leftover — Bainbridge (cheap)",
        "A second market morning still",
        "Do not stack Rainier, a ferry, and two museums"
      ],
      lux: [
        "A reserved food walk leftover (tour)",
        "A Rainier day leftover (car / tour)",
        "A dawn walk still",
        "Do not stack every island",
        "Summer weekends are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["boston"] = {
      budget: { why: "Walkable Back Bay / North End-adjacent / Cambridge on the T. Logan hotels are a water-taxi tax.", picks: [
        "HI Boston or a hostel-plus on the T",
        "Hampton Back Bay — limited-service",
        "A Cambridge 2-star if that is the night you came for",
        "Skip a Seaport convention rate on Lean unless leftover covers it",
        "The T beats a rental"
      ] },
      mid: { why: "Back Bay or Seaport 3–4 star. T, not a car.", picks: [
        "The Verb or a Back Bay 3–4 star",
        "A Seaport 4-star if leftover covers the water",
        "A Cambridge boutique",
        "One pocket",
        "Marathon / leaf weeks lift rooms"
      ] },
      lux: { why: "A historic flagship.", picks: [
        "The Newbury leftover",
        "Four Seasons leftover",
        "One property",
        "Do not also buy every duck tour",
        "February is cheap and icy"
      ] }
    };
    P.FOOD_PICKS["boston"] = {
      note: "A cannoli and a slice beat a Faneuil tourist menu.",
      budget: [
        "Breakfast: bakery, not the hotel",
        "Lunch: a slice or a counter off Faneuil",
        "Dinner: North End casual — one sit-down",
        "Skip Faneuil dinner on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one North End reservation",
        "Stay in one pocket",
        "Cannoli once"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Faneuil restaurants are a tax"
      ]
    };
    P.ACTIVITIES["boston"] = {
      budget: [
        "Freedom Trail walk — pick a few interiors (free / ticketed)",
        "Boston Common (free)",
        "Skip a duck tour on Lean",
        "Harvard Square leftover (T)",
        "T day pass"
      ],
      mid: [
        "One museum — MFA or Isabella (ticketed)",
        "A trail walk still",
        "A whale watch leftover",
        "A second neighborhood still",
        "Do not stack MFA, Isabella, and a whale day"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A day trip leftover — Salem / Cape",
        "A dawn walk still",
        "Do not stack three interiors",
        "Leaf weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["washington_dc"] = {
      budget: { why: "Walkable National Mall-adjacent or a Metro neighborhood. Airport lodging is a taxi tax.", picks: [
        "HI Washington or a hostel-plus on Metro",
        "Hampton Downtown — limited-service",
        "A Capitol Hill 2-star if that is the pocket",
        "Skip a Crystal City cloverleaf on Lean unless leftover covers the Metro",
        "Smithsonian is free; the room does not need a view of it"
      ] },
      mid: { why: "Downtown or Penn Quarter 3–4 star. Metro, not a car.", picks: [
        "The Morrison-Clark or a Downtown 3–4 star",
        "A Penn Quarter 4-star",
        "A Capitol Hill boutique",
        "One pocket",
        "Cherry blossom weeks are peak"
      ] },
      lux: { why: "A historic flagship.", picks: [
        "The Willard leftover",
        "The Jefferson leftover",
        "One property",
        "Do not also buy every ticketed monument",
        "August is hot and discounted"
      ] }
    };
    P.FOOD_PICKS["washington_dc"] = {
      note: "A food hall and a half-smoke beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery, not the hotel",
        "Lunch: Union Market or a food hall",
        "Dinner: a neighborhood casual",
        "Skip a Capitol Hill steakhouse on Lean",
        "Grocery a Mall picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay on Metro",
        "Food hall still wins one night"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel restaurants are a tax"
      ]
    };
    P.ACTIVITIES["washington_dc"] = {
      budget: [
        "National Mall + one Smithsonian (free)",
        "A second free museum (free)",
        "Skip a hop-on bus on Lean",
        "Monuments at dusk (free)",
        "Metro day pass"
      ],
      mid: [
        "One ticketed — Holocaust Museum or National Cathedral (ticketed / timed)",
        "A Mall walk still",
        "A neighborhood — U Street or Georgetown (free)",
        "A second Smithsonian still",
        "Do not stack three interiors and Arlington in one day"
      ],
      lux: [
        "A reserved timed ticket leftover (ticketed)",
        "A food walk leftover (tour)",
        "A dawn Mall still",
        "Do not stack every monument tour",
        "Cherry blossom weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["costa_rica"] = {
      budget: { why: "Town guesthouse in La Fortuna or Manuel Antonio. Two bases need a transfer night.", picks: [
        "La Fortuna 2-star / hostel-plus",
        "A Manuel Antonio 2-star off the hill",
        "Skip a volcano-view suite on Lean",
        "Confirm the shuttle",
        "A car is optional if you buy transfers"
      ] },
      mid: { why: "One Arenal 3–4 star, then one coastal mid.", picks: [
        "Arenal 3–4 star with a hot-spring hour included or cheap",
        "Manuel Antonio 3–4 star walk-to-town",
        "Adults-only mid if there are no kids",
        "One volcano base, one beach base",
        "Transfer is a line"
      ] },
      lux: { why: "Nayara / a coastal flagship leftover.", picks: [
        "Nayara leftover",
        "A coastal Stretch",
        "One property per base",
        "Do not also buy every zip-line",
        "May and November are the value shoulder"
      ] }
    };
    P.FOOD_PICKS["costa_rica"] = {
      note: "Casado plates beat a resort dining room.",
      budget: [
        "Breakfast: bakery",
        "Lunch: casado",
        "Dinner: town casual",
        "Skip a hotel restaurant on Lean",
        "Pack a park lunch"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in town at night",
        "Hot-spring dinner is a day-price"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Resort rows are a tax"
      ]
    };
    P.ACTIVITIES["costa_rica"] = {
      budget: [
        "Arenal hanging bridges or a waterfall (ticketed / cheap)",
        "Skip a zip-line stack on Lean",
        "A town walk",
        "Manuel Antonio park leftover (ticketed)",
        "Sloth-spotting is a walk, not a guarantee"
      ],
      mid: [
        "One park + one soak (ticketed)",
        "A second waterfall leftover",
        "A night walk leftover (tour)",
        "Beach for the rest",
        "Do not stack three tours in one day"
      ],
      lux: [
        "A small-group wildlife leftover (tour)",
        "A second park leftover",
        "A quiet soak still",
        "Do not stack zip, raft, and a night walk",
        "Two bases need slack"
      ]
    };
    P.HOTEL_EXAMPLES["belize"] = {
      budget: { why: "Caye Caulker 2-star or a San Pedro value. Mainland ruins need a night.", picks: [
        "Caye Caulker guesthouse",
        "A San Pedro 2-star off the beach path",
        "Skip an overwater bungalow on Lean",
        "Water taxi is the transfer",
        "Golf carts are a line on Ambergris"
      ] },
      mid: { why: "San Pedro 3–4 star or a jungle lodge mid.", picks: [
        "A San Pedro 3–4 star walk-to-beach",
        "A mainland lodge mid if ruins are the point",
        "Caye Caulker boutique mid",
        "One island or one jungle",
        "Transfer in the rate"
      ] },
      lux: { why: "Victoria House / a jungle Stretch.", picks: [
        "Victoria House leftover",
        "A jungle Stretch",
        "One base",
        "Do not also buy every dive as a sure day",
        "May and November are the value shoulder"
      ] }
    };
    P.FOOD_PICKS["belize"] = {
      note: "Rice-and-beans and a grill beat a resort row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: rice and beans",
        "Dinner: a grill on the sand path",
        "Skip a hotel restaurant on Lean",
        "Pack a ruin lunch"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay on your caye at night",
        "Mainland dinner only if you slept inland"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Cart dinners are a tax"
      ]
    };
    P.ACTIVITIES["belize"] = {
      budget: [
        "A beach / split hour (free / cheap)",
        "Skip a cave-tubing upsell on Lean if seas are the point",
        "A snorkel from shore leftover",
        "Town walk",
        "Hol Chan is a ticket"
      ],
      mid: [
        "Hol Chan or a ruin day — pick one (ticketed / tour)",
        "Beach for the rest",
        "A second dive leftover",
        "A town walk still",
        "Do not stack ATM cave and a full dive day"
      ],
      lux: [
        "A small-group dive leftover (tour)",
        "ATM cave leftover",
        "A beach morning still",
        "Do not stack every site",
        "Two bases need a night"
      ]
    };
    P.HOTEL_EXAMPLES["guatemala"] = {
      budget: { why: "Antigua guesthouse. Lake Atitlán is a second base.", picks: [
        "Antigua hostel-plus or a 2-star courtyard",
        "A lake 2-star if you split the trip",
        "Skip a volcano-view suite on Lean",
        "Chicken buses are cheap and a project",
        "Shuttles are the usual transfer"
      ] },
      mid: { why: "A restored casa in Antigua.", picks: [
        "A boutique casa 3–4 star",
        "A lake mid if leftover covers the boat",
        "One town",
        "Do not hop three lake villages nightly",
        "Altitude is real"
      ] },
      lux: { why: "A design casa leftover.", picks: [
        "A restored Stretch casa",
        "A lake Stretch",
        "One base per stay",
        "Do not also buy every volcano as a sure summit",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["guatemala"] = {
      note: "A comida del día beats a courtyard tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: comida del día",
        "Dinner: a neighborhood comedor",
        "Skip the first courtyard on Lean",
        "Grocery a volcano picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Antigua at night",
        "Lake dinner only if you slept there"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Courtyards are a tax"
      ]
    };
    P.ACTIVITIES["guatemala"] = {
      budget: [
        "Antigua cobbles + a viewpoint (free / cheap)",
        "One ruin — skip a stack (ticketed)",
        "Skip Pacaya on Lean if weather is junk",
        "A market hour",
        "Altitude slack"
      ],
      mid: [
        "One volcano or a lake day — pick one (tour)",
        "A second ruin leftover",
        "A town walk still",
        "Coffee tour leftover",
        "Do not stack two volcanoes"
      ],
      lux: [
        "A private volcano leftover (tour)",
        "A lake leftover",
        "A dawn walk still",
        "Do not stack every village",
        "Two bases need slack"
      ]
    };
    P.HOTEL_EXAMPLES["peru"] = {
      budget: { why: "Cusco guesthouse. Machu Picchu is a ticketed day with a train line.", picks: [
        "Cusco hostel-plus in San Blas",
        "A 2-star near a plaza",
        "Skip an Aguas Calientes suite on Lean",
        "Altitude day one is slack",
        "Train + bus is the MP math"
      ] },
      mid: { why: "A San Blas 3–4 star. Book MP timed entry.", picks: [
        "A San Blas boutique",
        "A Sacred Valley mid the night before MP",
        "One Cusco base",
        "Do not fake MP as a Cusco afternoon",
        "Altitude is the limiter"
      ] },
      lux: { why: "A design casa leftover.", picks: [
        "Belmond leftover — it is a train-price",
        "A Sacred Valley Stretch",
        "One property",
        "Do not also buy every ruin",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["peru"] = {
      note: "Menus del día and a market beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: menú del día",
        "Dinner: San Blas casual",
        "Skip guinea pig on Lean if you do not want it",
        "Coca tea is not a meal"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Cusco at night",
        "Aguas dinner only if you slept there"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Plaza restaurants are a tax"
      ]
    };
    P.ACTIVITIES["peru"] = {
      budget: [
        "Cusco walking + one ruin (ticketed / cheap)",
        "Skip MP on a 2-night Lean if the train eats the budget",
        "Altitude slack is an activity",
        "A market hour",
        "Qorikancha leftover"
      ],
      mid: [
        "MP timed day (ticketed / train)",
        "A Sacred Valley leftover",
        "A second Cusco ruin leftover",
        "A dawn walk still",
        "Do not stack MP and Rainbow Mountain"
      ],
      lux: [
        "A second MP mountain leftover (ticketed)",
        "A private valley leftover (tour)",
        "A quiet plaza morning still",
        "Do not stack three ruins and a hike",
        "Altitude first"
      ]
    };
    P.HOTEL_EXAMPLES["buenos_aires"] = {
      budget: { why: "Palermo or San Telmo 2-star. Subte, not a tourist taxi loop.", picks: [
        "A Palermo hostel-plus",
        "A San Telmo 2-star courtyard",
        "Skip a Recoleta palace on Lean",
        "Subte day pass",
        "Sunday San Telmo is a market day"
      ] },
      mid: { why: "Palermo Soho 3–4 star.", picks: [
        "A Palermo boutique",
        "A Recoleta 4-star if leftover covers the quiet",
        "San Telmo 3-star if walking is the point",
        "One barrio",
        "Do not hop three barrios nightly"
      ] },
      lux: { why: "A Recoleta flagship.", picks: [
        "Alvear leftover",
        "A Palacio Stretch",
        "One property",
        "Do not also buy every tango show as a dinner trap",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["buenos_aires"] = {
      note: "A parrilla and a medialuna beat a hotel restaurant.",
      budget: [
        "Breakfast: medialuna",
        "Lunch: a counter",
        "Dinner: a neighborhood parrilla",
        "Skip a Puerto Madero steak on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one barrio",
        "Tango dinner is a show-price"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Puerto Madero is a tax"
      ]
    };
    P.ACTIVITIES["buenos_aires"] = {
      budget: [
        "A barrio walk — San Telmo or Palermo (free)",
        "One museum — MALBA leftover (ticketed)",
        "Skip a tourist tango on Lean",
        "Recoleta cemetery (cheap)",
        "Subte pass"
      ],
      mid: [
        "One ticketed — MALBA or Teatro Colón (ticketed)",
        "A barrio walk still",
        "A tango show leftover",
        "A second cemetery / park still",
        "Do not stack three interiors"
      ],
      lux: [
        "A reserved Colón leftover (ticketed)",
        "A food walk leftover (tour)",
        "A dawn walk still",
        "Do not stack every show",
        "Sunday market is free"
      ]
    };
    P.HOTEL_EXAMPLES["colombia"] = {
      budget: { why: "Getsemaní guesthouse. The walled city is the walk.", picks: [
        "Getsemaní hostel-plus",
        "A Centro 2-star courtyard",
        "Skip a Bocagrande tower on Lean unless the beach is the point",
        "Heat is free",
        "Taxis have apps"
      ] },
      mid: { why: "A Getsemaní or Centro 3–4 star.", picks: [
        "A boutique casa 3–4 star",
        "A Centro 4-star",
        "Bocagrande mid if leftover covers the beach",
        "One pocket",
        "Do not hop Rosario nightly"
      ] },
      lux: { why: "A design casa leftover.", picks: [
        "A restored Stretch casa",
        "A beach Stretch leftover",
        "One property",
        "Do not also buy every island as a sure day",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["colombia"] = {
      note: "Arepa breakfast and a comida corrida beat a plaza tourist menu.",
      budget: [
        "Breakfast: arepa",
        "Lunch: comida corrida",
        "Dinner: Getsemaní casual",
        "Skip the first plaza restaurant",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Getsemaní at night",
        "Island lunch only if you took the boat"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Plaza restaurants are a tax"
      ]
    };
    P.ACTIVITIES["colombia"] = {
      budget: [
        "Walled-city walk at dawn and dusk (free)",
        "One museum — skip a stack (ticketed)",
        "Skip a party-bike on Lean",
        "Getsemaní murals (free)",
        "Heat slack midday"
      ],
      mid: [
        "A Rosario boat leftover (tour)",
        "A second museum leftover",
        "A dawn walk still",
        "A convent leftover",
        "Do not stack two boats and a salsa night"
      ],
      lux: [
        "A small-group food walk leftover (tour)",
        "A second island leftover",
        "A dawn walk still",
        "Do not stack every fort",
        "Heat first"
      ]
    };
    P.HOTEL_EXAMPLES["kyoto"] = {
      budget: { why: "Gion-adjacent or a station business hotel. Temples are mornings.", picks: [
        "Toyoko Inn / a station business hotel",
        "A hostel-plus in Kawaramachi",
        "Skip a ryokan on Lean",
        "Convenience store breakfast is the plan",
        "Buses, not taxis"
      ] },
      mid: { why: "A machiya or a 4-star near a subway.", picks: [
        "Mitsui Garden or a 4-star near Shijo",
        "A machiya mid if leftover covers the house",
        "Arashiyama mid only if that is the base",
        "One ward",
        "Cherry weeks are peak"
      ] },
      lux: { why: "A ryokan leftover.", picks: [
        "A kaiseki ryokan leftover",
        "Hoshinoya leftover",
        "One property",
        "The room or the kaiseki, rarely both plus every temple",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["kyoto"] = {
      note: "Convenience stores and a noodle counter beat a hotel buffet.",
      budget: [
        "Breakfast: konbini",
        "Lunch: noodles",
        "Dinner: a neighborhood izakaya",
        "Skip the hotel buffet",
        "Nishiki is a snack walk"
      ],
      mid: [
        "Breakfast: café or konbini",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one ward",
        "Kaiseki is Stretch"
      ],
      lux: [
        "Breakfast: still cheap most days",
        "Lunch: a sit-down",
        "Dinner reservation: a kaiseki leftover",
        "One splurge",
        "The room or the counter"
      ]
    };
    P.ACTIVITIES["kyoto"] = {
      budget: [
        "Fushimi Inari early (free)",
        "One paid garden (ticketed)",
        "Skip a five-temple checklist",
        "Philosopher’s Path leftover",
        "Convenience-store picnic"
      ],
      mid: [
        "One garden + one temple (ticketed)",
        "Fushimi still",
        "Arashiyama leftover",
        "A second neighborhood still",
        "Do not stack Nara and Arashiyama and Gion"
      ],
      lux: [
        "A reserved garden leftover (ticketed)",
        "A tea leftover",
        "A dawn shrine still",
        "Do not stack every temple",
        "Cherry weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["vietnam"] = {
      budget: { why: "Old Quarter guesthouse, then a Hoi An 2-star. Two cities need a night.", picks: [
        "Hanoi Old Quarter hostel-plus",
        "A Hoi An 2-star in the old town",
        "Skip a Halong overnight on Lean if seas are junk",
        "Grab bikes are cheap",
        "Night trains are a line"
      ] },
      mid: { why: "A 3–4 star in each city.", picks: [
        "A Hanoi 3–4 star on the lake-adjacent",
        "A Hoi An boutique mid",
        "One city per stay",
        "Halong is a day or a night, not both plus Sapa",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design hotel leftover.", picks: [
        "A Hanoi Stretch",
        "A Hoi An Stretch",
        "One property per city",
        "Do not also buy every junk as a sure night",
        "Heat midday is indoor"
      ] }
    };
    P.FOOD_PICKS["vietnam"] = {
      note: "Stalls are the good food.",
      budget: [
        "Breakfast: pho",
        "Lunch: a stall",
        "Dinner: another stall",
        "Skip hotel Italian",
        "Coffee is a sit-down"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: still a stall",
        "Dinner: one sit-down",
        "Stay in the old town",
        "Cooking class leftover"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: still stalls",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel Italian is the trap"
      ]
    };
    P.ACTIVITIES["vietnam"] = {
      budget: [
        "Old Quarter walk (free)",
        "One museum (ticketed / cheap)",
        "Skip a junk on Lean if leftover is tight",
        "A lake loop",
        "Street-food is lunch"
      ],
      mid: [
        "One day trip — Ninh Binh or Halong (tour)",
        "A second city walk still",
        "Hoi An lantern evening",
        "A cooking class leftover",
        "Do not stack two day trips"
      ],
      lux: [
        "A small-group junk leftover (tour)",
        "A second day trip leftover",
        "A dawn walk still",
        "Do not stack Sapa and Halong into 5 nights",
        "Heat first"
      ]
    };
    P.HOTEL_EXAMPLES["australia"] = {
      budget: { why: "Hostel-plus or a 3-star on a train. Long-haul already spent the luxury.", picks: [
        "YHA / a hostel-plus near a station",
        "Ibis Sydney Darling Harbour-adjacent",
        "Skip a Opera House-view suite on Lean",
        "Opal card",
        "Bondi is a bus, not a hotel tax"
      ] },
      mid: { why: "Harbor-adjacent 4-star. One city.", picks: [
        "A Circular Quay-adjacent 4-star",
        "A Surry Hills boutique",
        "Bondi mid if the beach is the point",
        "One pocket",
        "Do not hop Melbourne without a flight line"
      ] },
      lux: { why: "A harbor flagship leftover.", picks: [
        "Park Hyatt leftover",
        "A Rocks Stretch",
        "One property",
        "Do not also buy every harbor cruise",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["australia"] = {
      note: "A bakery and a counter beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a food hall",
        "Dinner: Surry Hills casual",
        "Skip a Circular Quay tourist menu",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one pocket",
        "Opera dinner is a ticket-price"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Harbor restaurants are a tax"
      ]
    };
    P.ACTIVITIES["australia"] = {
      budget: [
        "Harbor walk + Opera House exterior (free)",
        "One beach via bus (cheap)",
        "Skip a paid climb on Lean",
        "A ferry leftover",
        "Opal day"
      ],
      mid: [
        "Opera House tour or a show — pick one (ticketed)",
        "A ferry still",
        "Blue Mountains leftover",
        "A second beach still",
        "Do not stack climb, mountains, and a show"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A scenic flight leftover",
        "A dawn walk still",
        "Do not stack every adventure",
        "Long-haul slack day one"
      ]
    };
    P.HOTEL_EXAMPLES["new_zealand"] = {
      budget: { why: "Queenstown hostel-plus or a 3-star. Adventures are add-ons.", picks: [
        "A Queenstown hostel-plus",
        "A 3-star off the waterfront",
        "Skip a lakefront suite on Lean",
        "A campervan replaces the hotel if that is the trip",
        "Milford is a day-price"
      ] },
      mid: { why: "A 4-star in town. One base.", picks: [
        "A Queenstown 4-star",
        "A Wanaka mid if leftover covers the quieter lake",
        "One town",
        "Do not hop every adventure town nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A lodge leftover.", picks: [
        "A lakefront Stretch",
        "A wilderness lodge leftover",
        "One base",
        "Do not also buy every jump",
        "Winter and summer are different peaks"
      ] }
    };
    P.FOOD_PICKS["new_zealand"] = {
      note: "Grocery and a counter beat a waterfront tourist menu.",
      budget: [
        "Breakfast: grocery",
        "Lunch: a counter",
        "Dinner: a casual off the waterfront",
        "Skip a hotel restaurant on Lean",
        "Pack a Milford lunch"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in town at night",
        "Wanaka dinner only if you slept there"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Waterfront menus are a tax"
      ]
    };
    P.ACTIVITIES["new_zealand"] = {
      budget: [
        "A lakeside walk (free)",
        "Skip a bungy on Lean",
        "A lookout with cheap parking",
        "Grocery picnic",
        "Milford is a long day"
      ],
      mid: [
        "One adventure or Milford — pick one (ticketed / tour)",
        "A second walk still",
        "A glen leftover",
        "A second adventure leftover",
        "Do not stack bungy, Milford, and a flight"
      ],
      lux: [
        "A reserved flight leftover (tour)",
        "A second adventure leftover",
        "A dawn walk still",
        "Do not stack every jump",
        "Campervan is a different lodging line"
      ]
    };
    P.HOTEL_EXAMPLES["morocco"] = {
      budget: { why: "Medina riad or a 3-star on a tram. Day tours beat a palace room you do not need.", picks: [
        "A Marrakech hostel-plus / simple riad",
        "A 3-star near a taxi rank",
        "Skip a palmeraie resort on Lean",
        "Touts are a plan, not a surprise",
        "Airport taxis have a posted vibe — agree first"
      ] },
      mid: { why: "A restored riad 3–4 star.", picks: [
        "A riad boutique",
        "A Gueliz 4-star if you want New Town quiet",
        "One medina",
        "Essaouira is a different night",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palace leftover.", picks: [
        "La Mamounia leftover",
        "A palmeraie Stretch",
        "One property",
        "Do not also buy every desert as a sure night",
        "Heat midday is indoor"
      ] }
    };
    P.FOOD_PICKS["morocco"] = {
      note: "A stall and a rooftop tea beat a hotel restaurant.",
      budget: [
        "Breakfast: included only if in the rate",
        "Lunch: a stall / market",
        "Dinner: a neighborhood, not the first Jemaa terrace",
        "Buy water in a shop",
        "Mint tea is a sit-down"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in the medina at night",
        "Desert dinner only if you slept in camp"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Square terraces are a tax"
      ]
    };
    P.ACTIVITIES["morocco"] = {
      budget: [
        "Medina walk with a plan to ignore touts (free / cheap)",
        "One museum / palace (ticketed)",
        "Skip a desert upsell on day one",
        "A garden leftover",
        "Trusted driver > random taxis"
      ],
      mid: [
        "One guided half-day (tour)",
        "A garden still",
        "Ourika leftover",
        "A second palace leftover",
        "Do not stack desert and Ourika"
      ],
      lux: [
        "A desert night leftover (tour)",
        "A second day leftover",
        "A dawn walk still",
        "Do not stack every kasbah",
        "Heat first"
      ]
    };
    P.HOTEL_EXAMPLES["south_africa"] = {
      budget: { why: "City Bowl or a waterfront 3-star. Safari is a different lodging line.", picks: [
        "A City Bowl hostel-plus",
        "A 3-star near MyCiTi",
        "Skip a waterfront suite on Lean",
        "Uber is the usual night plan",
        "Do not treat safari as a Cape Town day"
      ] },
      mid: { why: "A 4-star in the Bowl or Gardens.", picks: [
        "A boutique 4-star",
        "A waterfront mid if leftover covers the pier",
        "One pocket",
        "Stellenbosch is a day",
        "Shoulder weeks win"
      ] },
      lux: { why: "A lodge or waterfront flagship leftover.", picks: [
        "A waterfront Stretch",
        "A safari lodge leftover — different budget",
        "One city base",
        "Do not also buy every cape tour",
        "Wind is real"
      ] }
    };
    P.FOOD_PICKS["south_africa"] = {
      note: "A market and a braai beat a waterfront tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a market",
        "Dinner: a neighborhood casual",
        "Skip the first waterfront restaurant",
        "Grocery a peninsula picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in the Bowl at night",
        "Wine-farm lunch leftover"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Waterfront menus are a tax"
      ]
    };
    P.ACTIVITIES["south_africa"] = {
      budget: [
        "Signal Hill / a free viewpoint (free)",
        "One museum (ticketed / cheap)",
        "Skip a safari-priced day in the city",
        "Waterfront walk",
        "Trusted driver for longer hops"
      ],
      mid: [
        "Table Mountain or a peninsula day — pick one (ticketed / tour)",
        "A second viewpoint still",
        "Stellenbosch leftover",
        "A colony leftover",
        "Do not stack mountain, cape, and wine"
      ],
      lux: [
        "A reserved safari leftover (tour)",
        "A second cape day leftover",
        "A dawn walk still",
        "Do not stack every adventure",
        "Safari is a different line"
      ]
    };
    P.HOTEL_EXAMPLES["egypt"] = {
      budget: { why: "Downtown or Zamalek 3-star. Nile cruises are a different lodging line.", picks: [
        "A Downtown 2-star / hostel-plus",
        "A Zamalek 3-star",
        "Skip a pyramid-view suite on Lean",
        "Uber / Careem",
        "Guides beat random temple touts"
      ] },
      mid: { why: "A 4-star on the Nile or in Zamalek.", picks: [
        "A Nile 4-star",
        "A Zamalek boutique",
        "Luxor mid if you split the trip",
        "One city, then a separate cruise line",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palace leftover.", picks: [
        "A Nile Stretch",
        "A cruise Stretch leftover",
        "One property",
        "Do not also buy every optional temple",
        "Heat midday is indoor"
      ] }
    };
    P.FOOD_PICKS["egypt"] = {
      note: "Koshary and a grill beat a hotel buffet.",
      budget: [
        "Breakfast: bakery",
        "Lunch: koshary",
        "Dinner: a grill",
        "Skip the hotel buffet on Lean",
        "Buy water in a shop"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Zamalek at night",
        "Cruise dinners are already priced"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel buffets are a tax"
      ]
    };
    P.ACTIVITIES["egypt"] = {
      budget: [
        "A museum morning (ticketed)",
        "Skip a second pyramid complex on Lean",
        "A Nile walk",
        "Trusted guide > random touts",
        "Heat slack"
      ],
      mid: [
        "Pyramids or a museum day — pick the stack honestly (ticketed / tour)",
        "A second site leftover",
        "Luxor leftover — a flight",
        "A dawn still",
        "Do not stack Giza, Saqqara, and a dinner cruise"
      ],
      lux: [
        "A private guide leftover (tour)",
        "A cruise leftover",
        "A dawn still",
        "Do not double-pay optional extras",
        "Heat first"
      ]
    };
    P.HOTEL_EXAMPLES["alaska_cruise"] = {
      budget: { why: "The cabin is the lodging. Fly in the day before if you can.", picks: [
        "Interior guarantee — you bought the fjords, not the porthole",
        "Lower-deck interior midship if you get seasick",
        "Skip a drink package until the break-even",
        "Juneau / Ketchikan walks are free",
        "Same-day embarkation is how people miss the ship"
      ] },
      mid: { why: "Oceanview or balcony. Glacier days are the product.", picks: [
        "Oceanview midship",
        "A balcony if leftover covers the glacier day",
        "One ship",
        "Independent port walks beat the first dock kiosk",
        "Drink package only after the math"
      ] },
      lux: { why: "A suite leftover. Still run the drink math.", picks: [
        "A large balcony leftover",
        "Suite-adjacent Stretch",
        "One ship",
        "Do not also buy every excursion",
        "Spa leftover-only"
      ] }
    };
    P.FOOD_PICKS["alaska_cruise"] = {
      note: "The dining room is in the fare.",
      budget: [
        "Breakfast / lunch: buffet or dining room",
        "Dinner: main dining every night on Lean",
        "Drinks: pay-as-you-go",
        "Skip specialty",
        "Room service is a backup"
      ],
      mid: [
        "Main dining most nights",
        "One specialty if leftover covers it",
        "Drink package only after break-even",
        "Packed snacks on long port days",
        "Specialty is not nightly"
      ],
      lux: [
        "Dining room + one or two specialty nights",
        "Unlimited drinks are in Stretch — still run the math",
        "Chef’s table leftover",
        "One splurge",
        "Ports have fish, not a second fare"
      ]
    };
    P.ACTIVITIES["alaska_cruise"] = {
      budget: [
        "Sea days and the deck (free)",
        "One independent port walk (free / cheap)",
        "Skip the first dock tour",
        "Glacier day is the product",
        "Ship shows are included"
      ],
      mid: [
        "One ship excursion + one independent port (ticketed / free)",
        "A second walk still",
        "Skip the third dock tour",
        "Train leftover in Skagway",
        "Do not stack three tours"
      ],
      lux: [
        "Two ship excursions leftover (ticketed)",
        "A small-group port leftover",
        "A deck morning still",
        "Spa leftover-only",
        "Do not stack every glacier add-on"
      ]
    };
    P.HOTEL_EXAMPLES["st_lucia"] = {
      budget: { why: "A value AI in the north or a Soufrière 3-star. Transfers are long.", picks: [
        "A Rodney Bay value AI",
        "A 3-star garden view",
        "Skip a piton-view suite on Lean",
        "Confirm the transfer — it is a line",
        "The island is not a taxi loop"
      ] },
      mid: { why: "A 4-star AI or a Soufrière boutique.", picks: [
        "A 4-star AI in the north",
        "A Soufrière mid if the pitons are the point",
        "Adults-only mid if there are no kids",
        "One pocket",
        "Transfer in the rate"
      ] },
      lux: { why: "A piton flagship leftover.", picks: [
        "Jade Mountain leftover",
        "A piton Stretch",
        "One property",
        "Do not also buy every zip-line",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["st_lucia"] = {
      note: "On-property plus one fish grill.",
      budget: [
        "Eat on-property most meals",
        "One grill lunch",
        "Skip dock kiosks",
        "Coffee included",
        "Transfer is part of the food price"
      ],
      mid: [
        "On-property + one off-property dinner",
        "Premium à-la-carte",
        "Packed lunch on a boat day",
        "Stay on your coast",
        "Soufrière dinner only if you slept south"
      ],
      lux: [
        "On-property fine dining",
        "One named reservation leftover",
        "Specialty leftover-only",
        "One coast",
        "Still not a nightly hop"
      ]
    };
    P.ACTIVITIES["st_lucia"] = {
      budget: [
        "The beach in front of the resort (included)",
        "Skip a zip-line on Lean",
        "A town walk, not a timeshare day",
        "Piton photo from a public viewpoint leftover",
        "Heat slack"
      ],
      mid: [
        "One boat or a drive-to-Soufrière — pick one (tour)",
        "Beach for the rest",
        "A second tour is the overrun",
        "A waterfall leftover",
        "Do not stack two coasts in one day"
      ],
      lux: [
        "A small-group piton leftover (tour)",
        "A second boat leftover",
        "A beach morning still",
        "Spa leftover-only",
        "Transfers are the limiter"
      ]
    };
    P.HOTEL_EXAMPLES["puerto_rico"] = {
      budget: { why: "Old San Juan guesthouse or a Condado 2-star. No passport for US citizens.", picks: [
        "An Old San Juan 2-star / guesthouse",
        "A Condado limited-service",
        "Skip a resort casino on Lean",
        "Walking is the Old SJ product",
        "Uber is cheap"
      ] },
      mid: { why: "Old San Juan or Condado 3–4 star.", picks: [
        "A boutique 3–4 star in Old SJ",
        "A Condado 4-star if the beach is the point",
        "One pocket",
        "El Yunque is a day",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design flagship leftover.", picks: [
        "A Condado Stretch",
        "A Dorado leftover — a different drive",
        "One property",
        "Do not also buy every bio-bay as a sure night",
        "Hurricane weeks are a watch"
      ] }
    };
    P.FOOD_PICKS["puerto_rico"] = {
      note: "A criollo plate and a bakery beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a criollo counter",
        "Dinner: Old SJ casual off the first plaza",
        "Skip a cruise-ship menu on Lean",
        "Piragua once"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one pocket",
        "Piñones leftover"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Plaza restaurants are a tax"
      ]
    };
    P.ACTIVITIES["puerto_rico"] = {
      budget: [
        "Old SJ fort walk (ticketed / cheap)",
        "A plaza loop (free)",
        "Skip a party-bike on Lean",
        "Beach in Condado if you slept there",
        "El Yunque leftover"
      ],
      mid: [
        "El Yunque or a bio-bay — pick one (ticketed / tour)",
        "A second fort leftover",
        "A beach still",
        "Culebra leftover — a ferry day",
        "Do not stack Yunque, bio-bay, and Culebra"
      ],
      lux: [
        "A reserved bio-bay leftover (tour)",
        "Culebra leftover",
        "A dawn walk still",
        "Do not stack every island",
        "Cruise mornings crowd Old SJ"
      ]
    };
    P.HOTEL_EXAMPLES["us_virgin_islands"] = {
      budget: { why: "A Charlotte Amalie 3-star or a Magens-adjacent value.", picks: [
        "A town 2-star / guesthouse",
        "A Magens-adjacent 3-star",
        "Skip a resort suite on Lean",
        "Taxis have a posted vibe — agree first",
        "St. John is a ferry"
      ] },
      mid: { why: "A 4-star on the beach you chose.", picks: [
        "A Magens or Frenchman’s 4-star",
        "A St. John mid if leftover covers the ferry",
        "One island",
        "Transfer in the rate",
        "Cruise days crowd town"
      ] },
      lux: { why: "A flagship leftover.", picks: [
        "A Caneel leftover-adjacent / a Stretch resort",
        "One island",
        "Do not also buy every sail",
        "Shoulder weeks win",
        "Hurricane weeks are a watch"
      ] }
    };
    P.FOOD_PICKS["us_virgin_islands"] = {
      note: "A grill and a grocery beat a resort row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a grill",
        "Dinner: town casual",
        "Skip a dock menu on Lean",
        "Grocery a beach picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay on your island",
        "St. John dinner only if you ferried"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Resort rows are a tax"
      ]
    };
    P.ACTIVITIES["us_virgin_islands"] = {
      budget: [
        "A beach day (free / cheap)",
        "Skip a jet-ski on Lean",
        "A town walk, not a timeshare day",
        "A ferry leftover",
        "Pack water"
      ],
      mid: [
        "St. John ferry + a beach (cheap / ferry)",
        "A snorkel leftover",
        "A second beach still",
        "A sail leftover",
        "Do not stack two islands and a sail"
      ],
      lux: [
        "A reserved sail leftover (tour)",
        "A second island leftover",
        "A beach morning still",
        "Spa leftover-only",
        "Cruise days are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["singapore"] = {
      budget: { why: "A hostel-plus or a 3-star on the MRT. Hawker food is the trip.", picks: [
        "A hostel-plus in Bugis / Chinatown",
        "Ibis / a compact 3-star on the MRT",
        "Skip a Marina Bay suite on Lean",
        "EZ-Link",
        "Airport is a train"
      ] },
      mid: { why: "A 4-star near a MRT interchange.", picks: [
        "A Chinatown or Tiong Bahru 4-star",
        "A Marina mid if leftover covers the bay",
        "One pocket",
        "Do not hop every island nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A Marina flagship leftover.", picks: [
        "Marina Bay Sands leftover — it is a view-price",
        "A Raffles leftover",
        "One property",
        "Do not also buy every garden as a night ticket stack",
        "The hawker is still the dinner"
      ] }
    };
    P.FOOD_PICKS["singapore"] = {
      note: "Hawker centres are the good food.",
      budget: [
        "Breakfast: hawker coffee + toast",
        "Lunch: a hawker centre",
        "Dinner: another hawker",
        "Skip hotel buffets",
        "Maxwell / Lau Pa Sat class"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: still a hawker",
        "Dinner: one sit-down",
        "Stay on the MRT",
        "Hawker still wins one night"
      ],
      lux: [
        "Breakfast: still cheap most days",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "The room or the tasting, rarely both"
      ]
    };
    P.ACTIVITIES["singapore"] = {
      budget: [
        "A neighborhood walk — Kampong Glam or Chinatown (free)",
        "Gardens by the Bay exterior (free / cheap)",
        "Skip a skypark on Lean",
        "A hawker is lunch, not an activity ticket",
        "MRT pass"
      ],
      mid: [
        "One ticketed — Gardens Cloud Dome or a museum (ticketed)",
        "A second neighborhood still",
        "Sentosa leftover",
        "A night light leftover",
        "Do not stack two gardens and Sentosa"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A second ticketed leftover",
        "A dawn walk still",
        "Do not stack every icon",
        "Heat midday is indoor"
      ]
    };
    P.HOTEL_EXAMPLES["south_korea"] = {
      budget: { why: "A business hotel next to a subway. Convenience stores are the Lean breakfast.", picks: [
        "A hotel near Hongdae or Jongno station",
        "A hostel-plus in Seoul",
        "Skip a palace-view suite on Lean",
        "T-money",
        "Capsule only if you packed light"
      ] },
      mid: { why: "A 4-star near a subway interchange.", picks: [
        "A Myeongdong or Hongdae 4-star",
        "A Hanok mid if leftover covers the house",
        "One ward",
        "Busan is a different trip",
        "Cherry / foliage weeks lift rooms"
      ] },
      lux: { why: "A palace-adjacent flagship leftover.", picks: [
        "A Park Hyatt leftover",
        "A hanok Stretch",
        "One property",
        "Do not also buy every palace as a sure interior",
        "The room or the BBQ, rarely both"
      ] }
    };
    P.FOOD_PICKS["south_korea"] = {
      note: "Convenience stores and a BBQ table beat a hotel buffet.",
      budget: [
        "Breakfast: convenience store",
        "Lunch: a food stall",
        "Dinner: a neighborhood BBQ",
        "Skip the hotel buffet",
        "Kimbap is lunch"
      ],
      mid: [
        "Breakfast: café or convini",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one ward",
        "Station food halls are mid"
      ],
      lux: [
        "Breakfast: still cheap most days",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "The room or the counter"
      ]
    };
    P.ACTIVITIES["south_korea"] = {
      budget: [
        "A palace exterior + a neighborhood walk (free / cheap)",
        "One paid palace interior (ticketed)",
        "Skip a five-palace checklist",
        "A night market leftover",
        "Convenience-store picnic"
      ],
      mid: [
        "One palace + one tower or museum (ticketed)",
        "A second neighborhood still",
        "A day trip leftover — Suwon or DMZ",
        "A palace still at dusk",
        "Do not stack DMZ and three palaces"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A food walk leftover (tour)",
        "A dawn walk still",
        "Do not stack every palace",
        "Cherry weeks are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["sri_lanka"] = {
      budget: { why: "A Colombo 2-star crash pad, then a Galle or hill guesthouse.", picks: [
        "A Colombo 2-star near a train",
        "A Galle Fort guesthouse",
        "A hill-country 2-star if tea is the point",
        "Trains are the product",
        "Tuk-tuks have a posted vibe — agree first"
      ] },
      mid: { why: "A Fort boutique or a hill mid.", picks: [
        "A Galle Fort 3–4 star",
        "A hill mid",
        "One coast or one hill",
        "Do not hop every beach nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design villa leftover.", picks: [
        "A Fort Stretch",
        "A tea-bungalow leftover",
        "One property",
        "Do not also buy every safari as a sure day",
        "Two bases need slack"
      ] }
    };
    P.FOOD_PICKS["sri_lanka"] = {
      note: "A hopper and a stall beat a hotel buffet.",
      budget: [
        "Breakfast: hopper / bakery",
        "Lunch: a stall",
        "Dinner: a neighborhood casual",
        "Skip hotel buffets",
        "Pack a train lunch"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Fort at night",
        "Hill dinner only if you slept there"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Hotel buffets are a tax"
      ]
    };
    P.ACTIVITIES["sri_lanka"] = {
      budget: [
        "A Fort walk (free)",
        "One temple (cheap)",
        "Skip a safari on Lean if seas are the point",
        "A train ride leftover",
        "Heat slack"
      ],
      mid: [
        "A train + a Fort day (ticketed / cheap)",
        "A safari leftover",
        "A second temple leftover",
        "A beach still",
        "Do not stack safari and a long train in one day"
      ],
      lux: [
        "A reserved safari leftover (tour)",
        "A second train leftover",
        "A dawn walk still",
        "Do not stack every park",
        "Two bases need slack"
      ]
    };
    P.HOTEL_EXAMPLES["florence"] = {
      budget: { why: "Oltrarno or a Santa Maria Novella 2-star. Duomo-view rooms are a tax.", picks: [
        "A hostel-plus in Oltrarno",
        "A 2-star near SMN station",
        "Skip a Duomo-view suite on Lean",
        "Walk, not taxis",
        "Pack light — stairs"
      ] },
      mid: { why: "Oltrarno or a centro 3–4 star.", picks: [
        "An Oltrarno boutique",
        "A centro 3–4 star off the piazza",
        "One neighborhood",
        "Uffizi is a timed morning",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palazzo leftover.", picks: [
        "A palazzo Stretch",
        "A Four Seasons leftover",
        "One property",
        "Do not also buy every tower",
        "August is hot"
      ] }
    };
    P.FOOD_PICKS["florence"] = {
      note: "A schiacciata and a trattoria beat a piazza tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: schiacciata",
        "Dinner: Oltrarno trattoria, not the Duomo steps",
        "Skip a photo-menu",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Oltrarno at night",
        "Wine from a shop is valid"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Piazza restaurants are a tax"
      ]
    };
    P.ACTIVITIES["florence"] = {
      budget: [
        "Piazzale Michelangelo (free)",
        "Duomo exterior; the climb is a ticket (ticketed)",
        "One museum — skip a stack (ticketed)",
        "Oltrarno evening walk",
        "Skip a hop-on bus"
      ],
      mid: [
        "Uffizi or Accademia — pick one (ticketed)",
        "A neighborhood walk still",
        "A climb leftover",
        "A second garden leftover",
        "Do not stack Uffizi, Accademia, and a climb"
      ],
      lux: [
        "A reserved Uffizi leftover (ticketed)",
        "A Chianti leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["amalfi"] = {
      budget: { why: "A Sorrento 2-star or a Salerno crash pad. Cliff suites are Stretch.", picks: [
        "A Sorrento 2-star / hostel-plus",
        "A Salerno 2-star if trains matter",
        "Skip a cliff suite on Lean",
        "Ferries beat hairpin buses if leftover covers it",
        "Pack light — stairs"
      ] },
      mid: { why: "A Positano-adjacent 3-star or a Sorrento 4-star.", picks: [
        "A Sorrento 4-star",
        "A Positano mid if leftover covers the cliff",
        "One town",
        "Do not hop three villages nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A cliff flagship leftover.", picks: [
        "Le Sirenuse leftover",
        "A cliff Stretch",
        "One town",
        "Do not also buy every boat",
        "August is packed"
      ] }
    };
    P.FOOD_PICKS["amalfi"] = {
      note: "A bakery and a trattoria beat a cliff-minimum.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a takeaway, not a cliff menu",
        "Dinner: a town trattoria",
        "Skip a hotel restaurant on Lean",
        "Grocery water"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one town",
        "Capri lunch only if you ferried"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named cliff leftover",
        "One splurge",
        "View tables are a tax"
      ]
    };
    P.ACTIVITIES["amalfi"] = {
      budget: [
        "A town walk + a beach access (free / cheap)",
        "Skip a private-boat on Lean",
        "A ferry leftover",
        "Path of the Gods leftover — fitness required",
        "Heat slack"
      ],
      mid: [
        "One ferry town or Capri — pick one (ticketed / ferry)",
        "A second walk still",
        "A path leftover",
        "A beach still",
        "Do not stack Capri, a path, and a boat"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "A second ferry leftover",
        "A dawn walk still",
        "Do not stack every village",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["croatia"] = {
      budget: { why: "A Dubrovnik Old Town guesthouse or a Lapad 2-star. Cruise mornings crowd the walls.", picks: [
        "A guesthouse off the Stradun",
        "A Lapad 2-star",
        "Skip a wall-view suite on Lean",
        "Pack light — stairs",
        "Ferry leftover"
      ] },
      mid: { why: "A 3–4 star in or just outside the walls.", picks: [
        "A boutique 3–4 star",
        "A Lapad 4-star if you want a beach walk",
        "One town",
        "Split is a different night",
        "Shoulder weeks win"
      ] },
      lux: { why: "A flagship leftover.", picks: [
        "A wall-adjacent Stretch",
        "An island Stretch leftover",
        "One property",
        "Do not also buy every island as a sure day",
        "Cruise mornings are a crowd tax"
      ] }
    };
    P.FOOD_PICKS["croatia"] = {
      note: "A grill and a bakery beat a Stradun tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a grill off the Stradun",
        "Dinner: a neighborhood casual",
        "Skip the first wall restaurant",
        "Grocery a wall picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay off the Stradun at night",
        "Island lunch only if you ferried"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Stradun menus are a tax"
      ]
    };
    P.ACTIVITIES["croatia"] = {
      budget: [
        "Old Town walk at dawn (free)",
        "Walls are a ticket — Lean can skip (ticketed)",
        "Skip a game-of-thrones upsell",
        "A beach leftover",
        "Cruise mornings: hike early"
      ],
      mid: [
        "Walls + one island ferry (ticketed / ferry)",
        "A second walk still",
        "Lokrum leftover",
        "A second beach still",
        "Do not stack walls, Lokrum, and a boat"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "A second island leftover",
        "A dawn walk still",
        "Do not stack every island",
        "Cruise days are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["switzerland"] = {
      budget: { why: "A hostel or a 3-star on a rail line. The pass is a math problem, not a souvenir.", picks: [
        "A hostel in Interlaken or a 3-star near the station",
        "Skip a Jungfrau suite on Lean",
        "Grocery the first hour",
        "Rail passes are often a bad buy on a short stay — price it",
        "Pack layers"
      ] },
      mid: { why: "A 4-star in one valley town.", picks: [
        "A 4-star in Interlaken or Grindelwald",
        "A Zermatt mid if Matterhorn is the point",
        "One valley",
        "Do not hop every peak nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A lodge leftover.", picks: [
        "A peak Stretch",
        "A palace leftover",
        "One base",
        "Do not also buy every peak ticket",
        "The room or the Jungfraujoch, rarely both"
      ] }
    };
    P.FOOD_PICKS["switzerland"] = {
      note: "Grocery and a café beat a hotel half-board every night.",
      budget: [
        "Breakfast: grocery / bakery",
        "Lunch: packed on trail days",
        "Dinner: a casual in town",
        "Skip hotel half-board on Lean",
        "Coop picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: packed on big days",
        "Dinner: one sit-down",
        "Stay in one town",
        "Peak-lunch is a ticket-price"
      ],
      lux: [
        "Breakfast: still pack trail days",
        "Lunch: a sit-down if you skipped the peak",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Do not eat every meal out on a rail week"
      ]
    };
    P.ACTIVITIES["switzerland"] = {
      budget: [
        "A valley walk (free)",
        "One peak ticket — skip a stack (ticketed)",
        "Skip Jungfraujoch on Lean if leftover is tight",
        "A lake hour",
        "Layers are the activity"
      ],
      mid: [
        "One peak + one valley walk (ticketed / free)",
        "A second walk still",
        "A second peak leftover",
        "A lake still",
        "Do not stack two peaks and a long rail"
      ],
      lux: [
        "A reserved peak leftover (ticketed)",
        "A second valley leftover",
        "A dawn walk still",
        "Do not stack every peak",
        "The pass is math"
      ]
    };
    P.HOTEL_EXAMPLES["colombia_medellin"] = {
      budget: { why: "El Poblado or Laureles 2-star. Metro, not a tourist taxi loop.", picks: [
        "A Poblado hostel-plus",
        "A Laureles 2-star",
        "Skip a penthouse on Lean",
        "Metro + buses",
        "Altitude is milder than Bogotá"
      ] },
      mid: { why: "A Poblado 3–4 star.", picks: [
        "A Poblado boutique",
        "A Laureles 4-star if leftover covers the quiet",
        "One barrio",
        "Guatapé is a day",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design leftover.", picks: [
        "A Poblado Stretch",
        "One property",
        "Do not also buy every comuna tour as a selfie loop",
        "Shoulder weeks win",
        "Nights have a plan"
      ] }
    };
    P.FOOD_PICKS["colombia_medellin"] = {
      note: "A bandeja and a juice stall beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a set menu",
        "Dinner: Laureles casual",
        "Skip a rooftop minimum on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one barrio",
        "Guatapé lunch only if you day-tripped"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Rooftops are a tax"
      ]
    };
    P.ACTIVITIES["colombia_medellin"] = {
      budget: [
        "A barrio walk with a plan (free / cheap)",
        "One museum (ticketed / cheap)",
        "Skip a party-bike on Lean",
        "Metro cable leftover",
        "Nights: have a route"
      ],
      mid: [
        "A comuna tour or Guatapé — pick one (tour)",
        "A second walk still",
        "A cable leftover",
        "A second museum leftover",
        "Do not stack two tours"
      ],
      lux: [
        "A small-group tour leftover (tour)",
        "Guatapé leftover",
        "A dawn walk still",
        "Do not stack every barrio",
        "Have a night plan"
      ]
    };
    P.HOTEL_EXAMPLES["ecuador_galapagos"] = {
      budget: { why: "A budget boat or a Santa Cruz guesthouse. The park fee is a line.", picks: [
        "A Santa Cruz guesthouse",
        "A budget island-hop, not a last-minute luxury boat",
        "Park fee + flight are the real Lean lines",
        "Skip a last-minute suite on Lean",
        "Water and sun are a plan"
      ] },
      mid: { why: "A mid boat or a better island hotel.", picks: [
        "A mid-range liveaboard if leftover covers the berth",
        "A Santa Cruz 3–4 star + day boats",
        "One product — boat or land",
        "Do not mix three islands without transfers",
        "Shoulder weeks win"
      ] },
      lux: { why: "A luxury liveaboard leftover.", picks: [
        "A luxury boat leftover",
        "One itinerary",
        "Do not also buy every extra dive",
        "The park fee is still a line",
        "Last-minute is not a strategy"
      ] }
    };
    P.FOOD_PICKS["ecuador_galapagos"] = {
      note: "Boat food is included on liveaboards. Land stays grocery.",
      budget: [
        "Boat: eat what is served",
        "Land: grocery + a grill",
        "Skip dock kiosks",
        "Pack snacks",
        "Water is a plan"
      ],
      mid: [
        "Boat: included meals",
        "Land: one sit-down",
        "A second grill",
        "Stay on your island",
        "Day-boat lunches are packed"
      ],
      lux: [
        "Boat: included + one land leftover",
        "A named table leftover on land nights",
        "One splurge",
        "Do not fight the boat menu",
        "Land hotels are a second product"
      ]
    };
    P.ACTIVITIES["ecuador_galapagos"] = {
      budget: [
        "Park sites with a naturalist (included / ticketed)",
        "Skip a second extra dive on Lean",
        "A town walk on Santa Cruz",
        "The fee is the ticket",
        "Sun slack"
      ],
      mid: [
        "Day boats or a liveaboard itinerary (ticketed / tour)",
        "A second site still",
        "A highland leftover",
        "A town still",
        "Do not stack every extra"
      ],
      lux: [
        "A dive leftover (tour)",
        "A longer itinerary leftover",
        "A dawn still",
        "Do not stack every island",
        "The fee is still a line"
      ]
    };
    P.HOTEL_EXAMPLES["kenya_safari"] = {
      budget: { why: "A Nairobi crash pad, then a camp. The game drive is the product.", picks: [
        "A Nairobi 2-star near a reliable transfer",
        "A budget camp / lodge — confirm the game drives included",
        "Skip a balloon on Lean",
        "Park fees are a line",
        "Do not treat Nairobi as the safari"
      ] },
      mid: { why: "A mid lodge with drives included.", picks: [
        "A mid Mara lodge",
        "Nairobi only the night you fly",
        "One reserve",
        "Balloon leftover",
        "Shoulder weeks win"
      ] },
      lux: { why: "A luxury camp leftover.", picks: [
        "A luxury tent leftover",
        "One reserve",
        "Do not also buy every optional drive",
        "Balloon leftover",
        "The game drive is the product"
      ] }
    };
    P.FOOD_PICKS["kenya_safari"] = {
      note: "Lodge meals are often included. Nairobi is a la carte.",
      budget: [
        "Nairobi: a casual grill",
        "Lodge: eat what is included",
        "Skip a hotel steak in town on Lean",
        "Pack snacks for long drives",
        "Water is a plan"
      ],
      mid: [
        "Lodge: included + one Nairobi sit-down",
        "Packed on transfer days",
        "Stay at the lodge at night",
        "Sundowner leftover",
        "Do not fight the lodge menu"
      ],
      lux: [
        "Lodge: included + a tasting leftover",
        "One Nairobi leftover",
        "One splurge",
        "Balloon breakfast is a tour-price",
        "Do not double-pay extras"
      ]
    };
    P.ACTIVITIES["kenya_safari"] = {
      budget: [
        "Game drives included in the lodge (included / ticketed)",
        "Skip a balloon on Lean",
        "Nairobi museum leftover",
        "Park fees are the ticket",
        "Dawn is the activity"
      ],
      mid: [
        "Drives + one extra site (ticketed)",
        "A balloon leftover",
        "A second reserve leftover — a transfer",
        "A dawn still",
        "Do not stack two parks without a night"
      ],
      lux: [
        "A balloon leftover (tour)",
        "A private guide leftover",
        "A dawn still",
        "Do not double-pay optional extras",
        "The drive is the product"
      ]
    };
    P.HOTEL_EXAMPLES["portugal_algarve"] = {
      budget: { why: "A Lagos or Tavira 2-star. Cliff hotels are Stretch.", picks: [
        "A Lagos 2-star / hostel-plus",
        "A Tavira 2-star if you want quieter",
        "Skip a cliff suite on Lean",
        "Trains exist along the coast",
        "A car helps for hidden beaches"
      ] },
      mid: { why: "A 3–4 star in one town.", picks: [
        "A Lagos 3–4 star",
        "A Tavira boutique",
        "One town",
        "Do not hop every cliff nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A cliff flagship leftover.", picks: [
        "A cliff Stretch",
        "One town",
        "Do not also buy every boat",
        "August is packed",
        "Shoulder weeks win"
      ] }
    };
    P.FOOD_PICKS["portugal_algarve"] = {
      note: "A pastel and a grill beat a marina tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a grill",
        "Dinner: town casual",
        "Skip the first marina restaurant",
        "Grocery a beach picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one town",
        "Boat lunch only if you booked the boat"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Marina menus are a tax"
      ]
    };
    P.ACTIVITIES["portugal_algarve"] = {
      budget: [
        "A beach + a town walk (free)",
        "Skip a grotto-boat on Lean if leftover is tight",
        "A cliff path leftover",
        "Pack water",
        "Heat slack"
      ],
      mid: [
        "One boat or a longer path — pick one (ticketed / free)",
        "A second beach still",
        "A second town leftover",
        "A path still",
        "Do not stack two boats and a path"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "A second path leftover",
        "A dawn beach still",
        "Do not stack every grotto",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["taiwan"] = {
      budget: { why: "A business hotel next to a MRT. Night markets are the dinner plan.", picks: [
        "A hotel near a Taipei MRT",
        "A hostel-plus in Ximending",
        "Skip a Taipei 101 suite on Lean",
        "EasyCard",
        "Convenience-store breakfast"
      ] },
      mid: { why: "A 4-star near a MRT interchange.", picks: [
        "A Ximending or Zhongshan 4-star",
        "A 4-star near Taipei Main",
        "One city base",
        "Taroko is a different night",
        "Shoulder weeks win"
      ] },
      lux: { why: "A flagship leftover.", picks: [
        "A landmark Stretch",
        "A hot-spring leftover",
        "One property",
        "Do not also buy every night market as a taxi loop",
        "The room or the night market, rarely both"
      ] }
    };
    P.FOOD_PICKS["taiwan"] = {
      note: "Night markets and convenience stores beat a hotel buffet.",
      budget: [
        "Breakfast: convenience store",
        "Lunch: a food court",
        "Dinner: a night market",
        "Skip the hotel buffet",
        "Xiao long bao once"
      ],
      mid: [
        "Breakfast: café or convini",
        "Lunch: a proper casual",
        "Dinner: one sit-down + a market",
        "Stay on the MRT",
        "Night market still wins one night"
      ],
      lux: [
        "Breakfast: still cheap most days",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "The room or the tasting"
      ]
    };
    P.ACTIVITIES["taiwan"] = {
      budget: [
        "A neighborhood walk — Dadaocheng or a temple (free / cheap)",
        "One paid deck leftover (ticketed)",
        "Skip a five-temple checklist",
        "A night market is dinner",
        "EasyCard"
      ],
      mid: [
        "One museum or a deck (ticketed)",
        "A second neighborhood still",
        "Jiufen leftover",
        "A hot spring leftover",
        "Do not stack 101, Jiufen, and Taroko"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "Taroko leftover",
        "A dawn walk still",
        "Do not stack every mountain",
        "A second city is a different trip"
      ]
    };
    P.HOTEL_EXAMPLES["budapest"] = {
      budget: { why: "A District VII hostel-plus or a 2-star on a tram.", picks: [
        "A ruin-bar-adjacent hostel-plus",
        "An Ibis / 2-star on a tram",
        "Skip a Parliament-view suite on Lean",
        "Pack light — stairs",
        "Thermal baths are a ticket"
      ] },
      mid: { why: "A 3–4 star in the walkable centro.", picks: [
        "A District V or VII 3–4 star",
        "A Pest boutique",
        "One side of the river",
        "Baths are a morning",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palace leftover.", picks: [
        "A Four Seasons leftover",
        "A Gresham leftover",
        "One property",
        "Do not also buy every ruin bar as a night plan",
        "January is cheap and icy"
      ] }
    };
    P.FOOD_PICKS["budapest"] = {
      note: "A bakery and a lunch menu beat a river tourist row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a lunch menu",
        "Dinner: District VII casual",
        "Skip the first Danube restaurant",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Pest at night",
        "Wine from a shop is valid"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "River restaurants are a tax"
      ]
    };
    P.ACTIVITIES["budapest"] = {
      budget: [
        "A Pest walk + a free viewpoint (free)",
        "One bath — Széchenyi or Rudas (ticketed)",
        "Skip a hop-on bus",
        "Parliament leftover (ticketed)",
        "Tram pass"
      ],
      mid: [
        "One bath + one interior (ticketed)",
        "A second walk still",
        "A ruin bar leftover",
        "A second bath leftover",
        "Do not stack two baths and Parliament"
      ],
      lux: [
        "A reserved bath leftover (ticketed)",
        "A Danube leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["copenhagen"] = {
      budget: { why: "A hostel-plus or a 3-star on a Metro line. Cards are a math problem.", picks: [
        "A hostel-plus in Nørrebro or near a Metro",
        "Ibis / a compact 3-star",
        "Skip a Nyhavn suite on Lean",
        "City pass math — price it",
        "Bikes are optional"
      ] },
      mid: { why: "A 4-star in the walkable core.", picks: [
        "A 4-star near a Metro",
        "A Vesterbro boutique",
        "One neighborhood",
        "Tivoli is a ticket",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design flagship leftover.", picks: [
        "A harbor Stretch",
        "A design leftover",
        "One property",
        "Do not also buy every tasting as a sure night",
        "July is peak"
      ] }
    };
    P.FOOD_PICKS["copenhagen"] = {
      note: "A bakery and a smørrebrød beat a Nyhavn tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: smørrebrød or a hotspot",
        "Dinner: Nørrebro casual",
        "Skip Nyhavn dinner on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay off Nyhavn at night",
        "Hot dog is allowed"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Nyhavn menus are a tax"
      ]
    };
    P.ACTIVITIES["copenhagen"] = {
      budget: [
        "A harbor walk (free)",
        "One free museum hour if the calendar lines up",
        "Skip Tivoli on Lean if leftover is tight",
        "A neighborhood walk",
        "Metro pass"
      ],
      mid: [
        "Tivoli or a museum — pick one (ticketed)",
        "A second walk still",
        "Louisiana leftover — a train",
        "A harbor still",
        "Do not stack Tivoli, Louisiana, and a canal"
      ],
      lux: [
        "A reserved tasting leftover (ticketed)",
        "A second museum leftover",
        "A dawn walk still",
        "Do not stack every icon",
        "July is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["vienna"] = {
      budget: { why: "A 2-star on a U-Bahn line. Palace interiors are tickets.", picks: [
        "A hostel-plus or Ibis on a U-Bahn",
        "A 2-star in the 2nd or 7th",
        "Skip a Ring suite on Lean",
        "Pack light",
        "Coffee houses are a sit-down"
      ] },
      mid: { why: "A 3–4 star inside the Gürtel.", picks: [
        "A 3–4 star near a U-Bahn",
        "A 7th boutique",
        "One district",
        "A palace is a morning",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palace leftover.", picks: [
        "A Ring Stretch",
        "A Sacher leftover",
        "One property",
        "Do not also buy every concert as a tourist trap",
        "January is cheap"
      ] }
    };
    P.FOOD_PICKS["vienna"] = {
      note: "A bakery and a würstel beat a palace café.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a würstel or a lunch menu",
        "Dinner: a neighborhood casual",
        "Skip the first palace café",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one district",
        "Coffee house once as a sit-down"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Palace cafés are a tax"
      ]
    };
    P.ACTIVITIES["vienna"] = {
      budget: [
        "A Ring walk (free)",
        "One palace — skip a stack (ticketed)",
        "A free museum hour if the calendar lines up",
        "A park leftover",
        "U-Bahn pass"
      ],
      mid: [
        "Schönbrunn or Belvedere — pick one (ticketed)",
        "A second walk still",
        "A concert leftover",
        "A second palace leftover",
        "Do not stack two palaces and a concert"
      ],
      lux: [
        "A reserved concert leftover (ticketed)",
        "A second palace leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "Christmas markets are a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["stockholm"] = {
      budget: { why: "A hostel-plus or a 3-star on the Tunnelbana.", picks: [
        "A hostel-plus in Södermalm",
        "A compact 3-star on the T-bana",
        "Skip a Gamla Stan suite on Lean",
        "SL card math — price it",
        "Islands are ferries"
      ] },
      mid: { why: "A 4-star in Södermalm or Norrmalm.", picks: [
        "A Södermalm 4-star",
        "A Norrmalm mid",
        "One island-town",
        "ABBA / Vasa are tickets",
        "Shoulder weeks win"
      ] },
      lux: { why: "A waterfront flagship leftover.", picks: [
        "A waterfront Stretch",
        "A Grand leftover",
        "One property",
        "Do not also buy every island as a sure day",
        "July is peak"
      ] }
    };
    P.FOOD_PICKS["stockholm"] = {
      note: "A bakery and a food hall beat a Gamla Stan tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a food hall",
        "Dinner: Södermalm casual",
        "Skip Gamla Stan dinner on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Södermalm at night",
        "Fika is a sit-down"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Gamla Stan menus are a tax"
      ]
    };
    P.ACTIVITIES["stockholm"] = {
      budget: [
        "A Gamla Stan walk (free)",
        "A waterfront loop (free)",
        "Skip a paid museum stack on Lean",
        "A ferry leftover",
        "SL pass"
      ],
      mid: [
        "Vasa or ABBA — pick one (ticketed)",
        "A second walk still",
        "An archipelago leftover",
        "A second museum leftover",
        "Do not stack Vasa, ABBA, and a long ferry"
      ],
      lux: [
        "A reserved archipelago leftover (tour)",
        "A second museum leftover",
        "A dawn walk still",
        "Do not stack every island",
        "July is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["mexico_oaxaca"] = {
      budget: { why: "A centro guesthouse. Mole and mezcal are the trip.", picks: [
        "A centro hostel-plus",
        "A 2-star courtyard",
        "Skip a rooftop suite on Lean",
        "Walk the centro",
        "Altitude is real"
      ] },
      mid: { why: "A design 3–4 star in the centro.", picks: [
        "A centro boutique",
        "A 4-star courtyard",
        "One neighborhood",
        "Monte Albán is a morning",
        "October–November is peak for a reason"
      ] },
      lux: { why: "A design leftover.", picks: [
        "A Stretch casa",
        "One property",
        "Do not also buy every mezcal tour as a sure day",
        "The reservation is often the better splurge",
        "Altitude slack"
      ] }
    };
    P.FOOD_PICKS["mexico_oaxaca"] = {
      note: "Markets and a comida beat a hotel restaurant.",
      budget: [
        "Breakfast: panadería",
        "Lunch: mercado",
        "Dinner: a neighborhood, not the first zócalo terrace",
        "Skip hotel dining on Lean",
        "Grocery a ruin picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: mercado",
        "Dinner: one reservation",
        "Stay in the centro",
        "Mezcal is a tasting, not a crawl tax"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Zócalo terraces are a tax"
      ]
    };
    P.ACTIVITIES["mexico_oaxaca"] = {
      budget: [
        "Centro walk (free)",
        "One museum (ticketed / cheap)",
        "Skip a five-mezcal tour on Lean",
        "A market hour",
        "Monte Albán leftover"
      ],
      mid: [
        "Monte Albán + a market (ticketed / cheap)",
        "A second walk still",
        "A mezcal leftover",
        "A second ruin leftover",
        "Do not stack two ruins and a tasting"
      ],
      lux: [
        "A reserved tasting leftover (tour)",
        "A second ruin leftover",
        "A dawn walk still",
        "Do not stack every village",
        "Altitude first"
      ]
    };
    P.HOTEL_EXAMPLES["panama"] = {
      budget: { why: "Casco Viejo guesthouse or a Bocas 2-star. Two products need a flight.", picks: [
        "A Casco hostel-plus",
        "A Bocas 2-star if the islands are the point",
        "Skip a Trump-tower on Lean",
        "Metro in the city",
        "Bocas is a hop"
      ] },
      mid: { why: "A Casco 3–4 star or a Bocas mid.", picks: [
        "A Casco boutique",
        "A Bocas mid",
        "One product per stay",
        "Do not hop three islands nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design leftover.", picks: [
        "A Casco Stretch",
        "A Bocas Stretch",
        "One property",
        "Do not also buy every island as a sure day",
        "Rain is a plan"
      ] }
    };
    P.FOOD_PICKS["panama"] = {
      note: "A comida and a ceviche beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a comida or ceviche",
        "Dinner: Casco casual",
        "Skip a rooftop minimum on Lean",
        "Grocery a boat picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Casco at night",
        "Bocas dinner only if you hopped"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Rooftops are a tax"
      ]
    };
    P.ACTIVITIES["panama"] = {
      budget: [
        "Casco walk (free)",
        "One museum (ticketed / cheap)",
        "Skip a canal tour on Lean if leftover is tight",
        "A rooftop leftover",
        "Bocas leftover"
      ],
      mid: [
        "Canal or a Casco day — pick one (ticketed / tour)",
        "A second walk still",
        "A boat leftover",
        "A second museum leftover",
        "Do not stack canal and Bocas in one day"
      ],
      lux: [
        "A reserved boat leftover (tour)",
        "A second hop leftover",
        "A dawn walk still",
        "Do not stack every island",
        "Two products need slack"
      ]
    };
    P.HOTEL_EXAMPLES["brazil_rio"] = {
      budget: { why: "A hostel-plus in Botafogo or a Copacabana 2-star off the first row.", picks: [
        "A Botafogo hostel-plus",
        "A Copacabana 2-star a block off the water",
        "Skip an Ipanema suite on Lean",
        "Metro exists",
        "Nights have a plan"
      ] },
      mid: { why: "A 3–4 star in Copacabana or Ipanema.", picks: [
        "A Copacabana 3–4 star",
        "An Ipanema mid if leftover covers the address",
        "One beach neighborhood",
        "Christ is a ticketed morning",
        "Shoulder weeks win"
      ] },
      lux: { why: "A flagship leftover.", picks: [
        "A Copacabana Stretch",
        "A Fasano leftover",
        "One property",
        "Do not also buy every favela tour as a selfie loop",
        "Carnival is a different budget"
      ] }
    };
    P.FOOD_PICKS["brazil_rio"] = {
      note: "A juice and a grill beat a beachfront tourist menu.",
      budget: [
        "Breakfast: juice + bakery",
        "Lunch: a grill or a kilo",
        "Dinner: a neighborhood casual",
        "Skip the first beach kiosk as dinner",
        "Açaí once"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one neighborhood",
        "Beach kiosks are a snack"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Beachfront menus are a tax"
      ]
    };
    P.ACTIVITIES["brazil_rio"] = {
      budget: [
        "A beach day in the neighborhood you booked (free)",
        "One viewpoint — Sugarloaf or Christ, not both on Lean (ticketed)",
        "Skip a party-van on Lean",
        "A neighborhood walk",
        "Nights: have a route"
      ],
      mid: [
        "Christ or Sugarloaf — pick one (ticketed)",
        "A second beach still",
        "A samba leftover",
        "A second viewpoint leftover",
        "Do not stack both hills and a favela"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A second hill leftover",
        "A dawn beach still",
        "Do not stack Carnival without leftover",
        "Have a night plan"
      ]
    };
    P.HOTEL_EXAMPLES["philippines_palawan"] = {
      budget: { why: "An El Nido guesthouse. Island-hops are the product.", picks: [
        "An El Nido guesthouse",
        "A Coron 2-star if that is the hop",
        "Skip an overwater suite on Lean",
        "Island-hop A/B/C/D are tickets",
        "ATMs and cash are a plan"
      ] },
      mid: { why: "A 3–4 star in El Nido or a better boat.", picks: [
        "An El Nido 3–4 star",
        "A mid island-hop",
        "One town",
        "Do not hop every tour letter nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A luxury island leftover.", picks: [
        "A private-island Stretch",
        "One base",
        "Do not also buy every letter as a sure day",
        "Weather cancels hops",
        "Cash still matters"
      ] }
    };
    P.FOOD_PICKS["philippines_palawan"] = {
      note: "A grill and a fruit stall beat a resort row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: packed on hop days",
        "Dinner: a grill in town",
        "Skip hotel Italian",
        "Grocery water"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: packed on hops",
        "Dinner: one sit-down",
        "Stay in town at night",
        "Island lunch is packed"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down if you skipped the hop",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Resort rows are a tax"
      ]
    };
    P.ACTIVITIES["philippines_palawan"] = {
      budget: [
        "A town beach (free)",
        "One island-hop (ticketed)",
        "Skip a second letter on Lean",
        "A lagoon leftover",
        "Sun slack"
      ],
      mid: [
        "One hop letter + a beach (ticketed / free)",
        "A second letter leftover",
        "A town still",
        "A second beach still",
        "Do not stack two letters and a night dive"
      ],
      lux: [
        "A reserved private hop leftover (tour)",
        "A second letter leftover",
        "A dawn beach still",
        "Do not stack every letter",
        "Weather first"
      ]
    };
    P.HOTEL_EXAMPLES["cambodia"] = {
      budget: { why: "A Siem Reap guesthouse. Angkor is a ticketed loop.", picks: [
        "A Siem Reap hostel-plus",
        "A 2-star near Pub Street-adjacent but not on it",
        "Skip a resort suite on Lean",
        "Tuk-tuks have a posted vibe — agree first",
        "Temple pass is the line"
      ] },
      mid: { why: "A 3–4 star with a pool you will use after temples.", picks: [
        "A 3–4 star near the old market",
        "A boutique mid",
        "One town",
        "Temples are mornings",
        "Shoulder weeks win"
      ] },
      lux: { why: "A flagship leftover.", picks: [
        "A Raffles leftover",
        "A Stretch resort",
        "One property",
        "Do not also buy every sunrise as a sure photo",
        "Heat midday is indoor"
      ] }
    };
    P.FOOD_PICKS["cambodia"] = {
      note: "A stall and a grill beat a hotel buffet.",
      budget: [
        "Breakfast: stall / café",
        "Lunch: a stall",
        "Dinner: a grill off Pub Street",
        "Skip hotel buffets",
        "Pack water for temples"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay off Pub Street at night",
        "Temple days are packed lunches"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Pub Street menus are a tax"
      ]
    };
    P.ACTIVITIES["cambodia"] = {
      budget: [
        "Angkor pass + one loop (ticketed)",
        "Skip a second sunrise on Lean",
        "A town walk",
        "Heat slack midday",
        "Tuk-tuk is the transfer"
      ],
      mid: [
        "A second temple day leftover (ticketed)",
        "A floating village leftover",
        "A dawn still",
        "A town still",
        "Do not stack two sunrises and a village"
      ],
      lux: [
        "A private guide leftover (tour)",
        "A second pass day leftover",
        "A dawn still",
        "Do not stack every temple",
        "Heat first"
      ]
    };
    P.HOTEL_EXAMPLES["jordan"] = {
      budget: { why: "A Wadi Musa 2-star. Petra is a ticketed day (or two).", picks: [
        "A Wadi Musa 2-star / hostel-plus",
        "A 3-star near the gate",
        "Skip a cave suite on Lean",
        "Petra ticket is the line",
        "Wadi Rum is a second night"
      ] },
      mid: { why: "A 3–4 star in Wadi Musa or a Rum camp mid.", picks: [
        "A 3–4 star near the gate",
        "A Rum camp mid if leftover covers the desert",
        "One base plus one camp",
        "Two days in Petra if leftover covers the ticket",
        "Shoulder weeks win"
      ] },
      lux: { why: "A Stretch camp leftover.", picks: [
        "A luxury Rum camp leftover",
        "A Petra Stretch",
        "One property per base",
        "Do not also buy every add-on donkey",
        "Heat midday is slack"
      ] }
    };
    P.FOOD_PICKS["jordan"] = {
      note: "A grill and a packed lunch beat a gate restaurant.",
      budget: [
        "Breakfast: hotel-included only if in the rate",
        "Lunch: packed in Petra",
        "Dinner: a Wadi Musa grill",
        "Skip the first gate restaurant",
        "Water is a plan"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: packed",
        "Dinner: one sit-down",
        "Stay in Wadi Musa at night",
        "Rum dinner only if you camped"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down if you skipped a long hike",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Gate restaurants are a tax"
      ]
    };
    P.ACTIVITIES["jordan"] = {
      budget: [
        "Petra ticket + the Siq (ticketed)",
        "Skip a donkey upsell on Lean",
        "A town walk",
        "Rum leftover",
        "Water and a hat"
      ],
      mid: [
        "A second Petra day or Rum — pick one (ticketed / tour)",
        "A dawn still",
        "A second hike leftover",
        "A camp leftover",
        "Do not stack Petra, Rum, and the Dead Sea"
      ],
      lux: [
        "A private Rum leftover (tour)",
        "A second Petra day leftover",
        "A dawn still",
        "Do not stack every add-on",
        "Heat first"
      ]
    };
    P.HOTEL_EXAMPLES["portugal_porto"] = {
      budget: { why: "A Ribeira-adjacent 2-star or a Cedofeita guesthouse. Hills and tiles.", picks: [
        "A hostel-plus in Cedofeita",
        "A 2-star near São Bento",
        "Skip a river-view suite on Lean",
        "Pack light — stairs",
        "Trams are a postcard, not transit"
      ] },
      mid: { why: "A 3–4 star in the walkable core.", picks: [
        "A Ribeira-adjacent 3–4 star",
        "A Cedofeita boutique",
        "One neighborhood",
        "Douro is a day",
        "Shoulder weeks win"
      ] },
      lux: { why: "A river flagship leftover.", picks: [
        "A river Stretch",
        "A Yeatman leftover",
        "One property",
        "Do not also buy every cellar as a sure tasting",
        "August is packed"
      ] }
    };
    P.FOOD_PICKS["portugal_porto"] = {
      note: "A pastel and a tasca beat a Ribeira tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a tasca",
        "Dinner: a neighborhood casual",
        "Skip the first Ribeira terrace",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay off the first terrace",
        "Port tasting is mid"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Ribeira terraces are a tax"
      ]
    };
    P.ACTIVITIES["portugal_porto"] = {
      budget: [
        "A Ribeira + Dom Luís walk (free)",
        "One cellar leftover (ticketed)",
        "Skip a river-cruise on Lean",
        "A bookstore photo is a queue",
        "A neighborhood walk"
      ],
      mid: [
        "One cellar + a walk (ticketed / free)",
        "A Douro leftover",
        "A second walk still",
        "A cruise leftover",
        "Do not stack two cellars and a cruise"
      ],
      lux: [
        "A reserved tasting leftover (ticketed)",
        "A Douro leftover",
        "A dawn walk still",
        "Do not stack every cellar",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["spain_seville"] = {
      budget: { why: "A centro 2-star on a tram. July heat is the discount.", picks: [
        "A hostel-plus in Alameda",
        "A 2-star near a tram",
        "Skip a cathedral-view suite on Lean",
        "Pack light — heat and stairs",
        "Tapas are dinner"
      ] },
      mid: { why: "A 3–4 star in the walkable centro.", picks: [
        "A centro boutique",
        "A Santa Cruz 3–4 star off the first lane",
        "One neighborhood",
        "Alcázar is timed",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palacio leftover.", picks: [
        "A palacio Stretch",
        "An Alfonso leftover",
        "One property",
        "Do not also buy every flamenco as a dinner trap",
        "July is brutal"
      ] }
    };
    P.FOOD_PICKS["spain_seville"] = {
      note: "A tapas crawl beats a cathedral-side tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a menú or tapas",
        "Dinner: Alameda tapas, not the cathedral steps",
        "Skip a photo-menu",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reserved tapas bar",
        "Stay in one neighborhood",
        "Orange wine is mid"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named table leftover",
        "One splurge",
        "Cathedral lanes are a tax"
      ]
    };
    P.ACTIVITIES["spain_seville"] = {
      budget: [
        "A centro walk (free)",
        "One interior — Alcázar or cathedral, not both on Lean (ticketed)",
        "Skip a hop-on bus",
        "A plaza hour",
        "Heat slack midday"
      ],
      mid: [
        "Alcázar + a neighborhood walk (ticketed / free)",
        "A flamenco leftover",
        "A second interior leftover",
        "A plaza still",
        "Do not stack Alcázar, cathedral, and Itálica"
      ],
      lux: [
        "A reserved flamenco leftover (ticketed)",
        "A second interior leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "July is a heat tax"
      ]
    };
    P.HOTEL_EXAMPLES["norway_fjords"] = {
      budget: { why: "A hostel or a 3-star on a rail/ferry. The scenery is the product.", picks: [
        "A hostel in Bergen or Flåm-adjacent",
        "A 3-star near a station",
        "Skip a fjord suite on Lean",
        "Rail + ferry math — price it",
        "Pack layers"
      ] },
      mid: { why: "A 4-star in one fjord town.", picks: [
        "A 4-star in Bergen or a fjord village mid",
        "One town",
        "Do not hop every fjord nightly",
        "Shoulder weeks win",
        "Midnight sun is a season"
      ] },
      lux: { why: "A lodge leftover.", picks: [
        "A fjord Stretch",
        "One base",
        "Do not also buy every scenic rail as a sure day",
        "The room or the Flåm, rarely both plus a flight",
        "Weather cancels boats"
      ] }
    };
    P.FOOD_PICKS["norway_fjords"] = {
      note: "Grocery and a café beat a hotel half-board every night.",
      budget: [
        "Breakfast: grocery / bakery",
        "Lunch: packed on rail days",
        "Dinner: a casual in town",
        "Skip hotel half-board on Lean",
        "Pack snacks"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: packed on long days",
        "Dinner: one sit-down",
        "Stay in one town",
        "Boat lunches are packed"
      ],
      lux: [
        "Breakfast: still pack rail days",
        "Lunch: a sit-down if you skipped the boat",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Do not eat every meal out on a fjord week"
      ]
    };
    P.ACTIVITIES["norway_fjords"] = {
      budget: [
        "A waterfront walk (free)",
        "One scenic rail or ferry — skip a stack (ticketed)",
        "Skip a second fjord on Lean if leftover is tight",
        "Layers are the activity",
        "Weather slack"
      ],
      mid: [
        "One rail + one ferry (ticketed)",
        "A second walk still",
        "A second fjord leftover",
        "A hike leftover",
        "Do not stack two rails and a flight"
      ],
      lux: [
        "A reserved scenic leftover (ticketed)",
        "A second fjord leftover",
        "A dawn walk still",
        "Do not stack every boat",
        "Weather first"
      ]
    };
    P.HOTEL_EXAMPLES["tanzania_zanzibar"] = {
      budget: { why: "A Stone Town 2-star or a Nungwi value. Spice island + beach.", picks: [
        "A Stone Town guesthouse",
        "A Nungwi 2-star off the first row",
        "Skip a villa on Lean",
        "Transfers are a line",
        "Safari is a different lodging"
      ] },
      mid: { why: "A 3–4 star in Stone Town or on the beach you chose.", picks: [
        "A Stone Town 3–4 star",
        "A Nungwi mid",
        "One product — town or beach",
        "Do not hop every beach nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A villa leftover.", picks: [
        "A beach Stretch",
        "One property",
        "Do not also buy every dhow as a sure day",
        "Safari combo needs slack",
        "Rain weeks happen"
      ] }
    };
    P.FOOD_PICKS["tanzania_zanzibar"] = {
      note: "A grill and a spice snack beat a resort row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a grill",
        "Dinner: Stone Town casual",
        "Skip a hotel restaurant on Lean",
        "Grocery a beach picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one pocket",
        "Spice-tour lunch leftover"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Resort rows are a tax"
      ]
    };
    P.ACTIVITIES["tanzania_zanzibar"] = {
      budget: [
        "Stone Town walk (free / cheap)",
        "One beach day (free)",
        "Skip a spice tour on Lean if leftover is tight",
        "A dhow leftover",
        "Sun slack"
      ],
      mid: [
        "A spice tour or a dhow — pick one (tour)",
        "A second beach still",
        "A second town walk still",
        "Jozani leftover",
        "Do not stack spice, dhow, and Jozani"
      ],
      lux: [
        "A reserved dhow leftover (tour)",
        "A second tour leftover",
        "A dawn beach still",
        "Do not stack every island",
        "Safari is a different line"
      ]
    };
    P.HOTEL_EXAMPLES["nepal"] = {
      budget: { why: "A Thamel guesthouse. Trekking is a different lodging line.", picks: [
        "A Thamel hostel-plus",
        "A 2-star courtyard",
        "Skip a mountain-view suite on Lean",
        "Altitude slack if you fly to Lukla",
        "Permits are a line"
      ] },
      mid: { why: "A 3–4 star in Kathmandu or a teahouse mid on trail.", picks: [
        "A Kathmandu 3–4 star",
        "Teahouses if the trek is the trip",
        "One city, then a separate trek line",
        "October is peak for a reason",
        "Shoulder weeks win"
      ] },
      lux: { why: "A luxury lodge leftover.", picks: [
        "A Stretch lodge",
        "One property",
        "Do not also buy every flight as a sure weather day",
        "The trek is the product",
        "Weather cancels Lukla"
      ] }
    };
    P.FOOD_PICKS["nepal"] = {
      note: "A dal bhat and a bakery beat a hotel buffet.",
      budget: [
        "Breakfast: bakery",
        "Lunch: dal bhat",
        "Dinner: a Thamel casual",
        "Skip hotel buffets",
        "Pack trek snacks"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: dal bhat still",
        "Dinner: one sit-down",
        "Stay in Thamel at night",
        "Trail dinners are teahouse"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down in the city",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Hotel buffets are a tax"
      ]
    };
    P.ACTIVITIES["nepal"] = {
      budget: [
        "A Durbar walk (ticketed / cheap)",
        "One stupa (cheap)",
        "Skip a short-trek upsell on Lean if leftover is tight",
        "A garden leftover",
        "Altitude slack"
      ],
      mid: [
        "A day hike or a Durbar square — pick one (ticketed / tour)",
        "A second stupa leftover",
        "A dawn still",
        "A second square leftover",
        "Do not stack two valleys"
      ],
      lux: [
        "A reserved trek leftover (tour / permit)",
        "A mountain flight leftover",
        "A dawn still",
        "Do not stack every valley",
        "Weather first"
      ]
    };
    P.HOTEL_EXAMPLES["indonesia_lombok"] = {
      budget: { why: "A Senggigi or Kuta Lombok guesthouse. Quieter than Bali.", picks: [
        "A Kuta Lombok guesthouse",
        "A Gili 2-star if the islands are the point",
        "Skip a cliff villa on Lean",
        "Scooter math is real — insure it",
        "Rinjani is a trek"
      ] },
      mid: { why: "A 3–4 star on the beach you chose.", picks: [
        "A Kuta 3–4 star",
        "A Gili mid",
        "One island",
        "Do not hop three Gilis nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A villa leftover.", picks: [
        "A cliff Stretch",
        "One property",
        "Do not also buy every Gili as a sure day",
        "Rinjani leftover",
        "Ferry weather happens"
      ] }
    };
    P.FOOD_PICKS["indonesia_lombok"] = {
      note: "A warung beats hotel Italian.",
      budget: [
        "Breakfast: warung coffee",
        "Lunch: warung",
        "Dinner: warung again",
        "Skip hotel Italian",
        "Grocery a trek picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: warung",
        "Dinner: one sit-down",
        "Stay on your beach",
        "Gili dinner only if you hopped"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: still a warung",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Hotel Italian is the trap"
      ]
    };
    P.ACTIVITIES["indonesia_lombok"] = {
      budget: [
        "A beach day (free)",
        "Skip a Rinjani upsell on Lean if leftover is tight",
        "A waterfall leftover",
        "A Gili leftover",
        "Sun slack"
      ],
      mid: [
        "One waterfall or a Gili hop — pick one (cheap / ferry)",
        "A second beach still",
        "A snorkel leftover",
        "A second waterfall leftover",
        "Do not stack Rinjani and a Gili night"
      ],
      lux: [
        "A reserved trek leftover (tour)",
        "A second hop leftover",
        "A dawn beach still",
        "Do not stack every Gili",
        "Weather first"
      ]
    };
    P.HOTEL_EXAMPLES["puerto_rico_rincon"] = {
      budget: { why: "A West Coast guesthouse. No passport. Far quieter than San Juan.", picks: [
        "A Rincón 2-star / guesthouse",
        "A studio with a kitchen",
        "Skip a cliff suite on Lean",
        "A car is assumed",
        "San Juan is a transfer night"
      ] },
      mid: { why: "A 3–4 star walk-to-beach.", picks: [
        "A Rincón 3–4 star",
        "A beach condo mid",
        "One town",
        "Do not hop every west-coast beach nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design leftover.", picks: [
        "A cliff Stretch",
        "One property",
        "Do not also buy every surf lesson as a sure day",
        "Hurricane weeks are a watch",
        "The west is the product"
      ] }
    };
    P.FOOD_PICKS["puerto_rico_rincon"] = {
      note: "A criollo plate and a grocery bag beat a resort row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a criollo counter",
        "Dinner: town casual",
        "Skip a hotel restaurant on Lean",
        "Grocery a beach picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in Rincón at night",
        "Mayagüez dinner is a drive"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Resort rows are a tax"
      ]
    };
    P.ACTIVITIES["puerto_rico_rincon"] = {
      budget: [
        "A beach / surf hour (free)",
        "Skip a lesson on Lean if you already surf",
        "A lighthouse leftover",
        "A second beach still",
        "Pack water"
      ],
      mid: [
        "One lesson or a biolum leftover (ticketed / tour)",
        "A second beach still",
        "A lighthouse still",
        "A second west beach leftover",
        "Do not stack San Juan into this lodging without a night"
      ],
      lux: [
        "A reserved bio leftover (tour)",
        "A second lesson leftover",
        "A dawn beach still",
        "Do not stack every west beach",
        "Hurricane watch"
      ]
    };
    P.HOTEL_EXAMPLES["italy_sicily"] = {
      budget: { why: "A Palermo or Catania 2-star. The island is a transfer plan.", picks: [
        "A Palermo hostel-plus",
        "A Catania 2-star if Etna is the point",
        "Skip a Taormina suite on Lean",
        "Trains exist; a car helps the interior",
        "Pack light — heat"
      ] },
      mid: { why: "A 3–4 star in one city, then a second if leftover covers it.", picks: [
        "A Palermo 3–4 star",
        "A Taormina mid if leftover covers the cliff",
        "One city per stay",
        "Etna is a day",
        "Shoulder weeks win"
      ] },
      lux: { why: "A palazzo leftover.", picks: [
        "A Taormina Stretch",
        "A palazzo leftover",
        "One property",
        "Do not also buy every ruin as a sure day",
        "August is packed"
      ] }
    };
    P.FOOD_PICKS["italy_sicily"] = {
      note: "A market and a trattoria beat a piazza tourist menu.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a market",
        "Dinner: a trattoria off the first piazza",
        "Skip a photo-menu",
        "Grocery a ruin picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one city",
        "Etna lunch is packed"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Piazza restaurants are a tax"
      ]
    };
    P.ACTIVITIES["italy_sicily"] = {
      budget: [
        "A market + a centro walk (free / cheap)",
        "One ruin — skip a stack (ticketed)",
        "Skip Etna on Lean if leftover is tight",
        "A second market leftover",
        "Heat slack"
      ],
      mid: [
        "One ruin + a neighborhood walk (ticketed / free)",
        "Etna leftover",
        "A second city leftover — a transfer",
        "A second ruin leftover",
        "Do not stack two ruins and Etna"
      ],
      lux: [
        "A reserved Etna leftover (tour)",
        "A second ruin leftover",
        "A dawn walk still",
        "Do not stack every temple",
        "August is a crowd tax"
      ]
    };
    P.HOTEL_EXAMPLES["peru_lima"] = {
      budget: { why: "A Miraflores or Barranco 2-star. The food is the trip.", picks: [
        "A Miraflores hostel-plus",
        "A Barranco 2-star",
        "Skip a cliff suite on Lean",
        "Uber is cheap",
        "Amazon is a different lodging"
      ] },
      mid: { why: "A 3–4 star in Miraflores or Barranco.", picks: [
        "A Miraflores 3–4 star",
        "A Barranco boutique",
        "One barrio",
        "The malecón is the walk",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design leftover.", picks: [
        "A Stretch hotel",
        "One property",
        "The reservation is often the better Stretch",
        "Amazon leftover is a flight",
        "Fog is a season"
      ] }
    };
    P.FOOD_PICKS["peru_lima"] = {
      note: "Ceviche and a mercado beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: ceviche / a mercado",
        "Dinner: Barranco casual",
        "Skip hotel dining on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one barrio",
        "Ceviche is lunch"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named tasting leftover",
        "One splurge",
        "The room or the tasting"
      ]
    };
    P.ACTIVITIES["peru_lima"] = {
      budget: [
        "Malecón walk (free)",
        "One museum (ticketed / cheap)",
        "Skip a second tasting on Lean",
        "A Barranco evening",
        "Fog slack"
      ],
      mid: [
        "One museum + a neighborhood walk (ticketed / free)",
        "A second barrio still",
        "A food walk leftover",
        "A second museum leftover",
        "Do not stack two tastings and a museum"
      ],
      lux: [
        "A reserved tasting leftover (ticketed)",
        "An Amazon leftover — a flight",
        "A dawn walk still",
        "Do not stack every barrio",
        "The reservation is the Stretch"
      ]
    };
    P.HOTEL_EXAMPLES["dominican_republic_samana"] = {
      budget: { why: "A Las Terrenas 2-star. Quieter than Punta Cana.", picks: [
        "A Las Terrenas guesthouse",
        "A 2-star off the first beach row",
        "Skip a villa on Lean",
        "Transfers from PUJ or AZS are a line",
        "Whale season is a ticket"
      ] },
      mid: { why: "A 3–4 star on the beach you chose.", picks: [
        "A Las Terrenas 3–4 star",
        "A boutique mid",
        "One town",
        "Do not hop every peninsula beach nightly",
        "Shoulder weeks win"
      ] },
      lux: { why: "A villa leftover.", picks: [
        "A Stretch villa",
        "One property",
        "Do not also buy every whale as a sure day",
        "Jan–Mar is whale peak",
        "Rain weeks happen"
      ] }
    };
    P.FOOD_PICKS["dominican_republic_samana"] = {
      note: "A grill and a fruit stall beat a resort row.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a grill",
        "Dinner: town casual",
        "Skip a hotel restaurant on Lean",
        "Grocery a beach picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one town",
        "Whale-day lunch is packed"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Resort rows are a tax"
      ]
    };
    P.ACTIVITIES["dominican_republic_samana"] = {
      budget: [
        "A beach day (free)",
        "Skip a whale tour on Lean if it is not season",
        "A town walk",
        "A waterfall leftover",
        "Sun slack"
      ],
      mid: [
        "A whale tour in season or a waterfall — pick one (tour / cheap)",
        "A second beach still",
        "A second walk still",
        "A boat leftover",
        "Do not stack whale and two waterfalls"
      ],
      lux: [
        "A reserved whale leftover (tour)",
        "A second boat leftover",
        "A dawn beach still",
        "Do not stack every peninsula stop",
        "Season first"
      ]
    };
    P.HOTEL_EXAMPLES["colombia_bogota"] = {
      budget: { why: "A Candelaria or Chapinero 2-star. Altitude day one is slack.", picks: [
        "A Candelaria hostel-plus",
        "A Chapinero 2-star",
        "Skip a penthouse on Lean",
        "TransMilenio / Uber",
        "Altitude is real"
      ] },
      mid: { why: "A 3–4 star in Chapinero or Zona G.", picks: [
        "A Chapinero boutique",
        "A Zona G 4-star",
        "One barrio",
        "Monserrate is a morning",
        "Shoulder weeks win"
      ] },
      lux: { why: "A design leftover.", picks: [
        "A Stretch hotel",
        "One property",
        "The reservation is often the better Stretch",
        "Coffee region is a different night",
        "Altitude slack"
      ] }
    };
    P.FOOD_PICKS["colombia_bogota"] = {
      note: "A bakery and a set menu beat a hotel restaurant.",
      budget: [
        "Breakfast: bakery",
        "Lunch: a set menu",
        "Dinner: Chapinero casual",
        "Skip a rooftop minimum on Lean",
        "Grocery a picnic"
      ],
      mid: [
        "Breakfast: café",
        "Lunch: a proper casual",
        "Dinner: one reservation",
        "Stay in one barrio",
        "Monserrate lunch is a tourist menu"
      ],
      lux: [
        "Breakfast: café",
        "Lunch: a sit-down",
        "Dinner reservation: a named leftover",
        "One splurge",
        "Rooftops are a tax"
      ]
    };
    P.ACTIVITIES["colombia_bogota"] = {
      budget: [
        "A Candelaria walk (free / cheap)",
        "One museum — Gold Museum (ticketed / cheap)",
        "Skip a second mountain on Lean",
        "Altitude slack",
        "Monserrate leftover"
      ],
      mid: [
        "Gold Museum + a neighborhood walk (ticketed / free)",
        "Monserrate leftover",
        "A second museum leftover",
        "A dawn still",
        "Do not stack two mountains and a food tour"
      ],
      lux: [
        "A reserved food walk leftover (tour)",
        "A coffee-region leftover — a transfer",
        "A dawn walk still",
        "Do not stack every barrio",
        "Altitude first"
      ]
    };
  }

  function installActsOnly() {
    P.ACTIVITIES["punta_cana"] = {
      budget: [
        "Beach in front of the resort (included)",
        "Skip a dock catamaran on Lean",
        "A town walk with a pre-booked ride",
        "Snorkel from the property if it exists",
        "Timeshare days are a tax"
      ],
      mid: [
        "One boat or a monkey-island leftover (ticketed / tour)",
        "Beach for the rest",
        "A second dock tour is the overrun",
        "Cap Cana is a different pocket",
        "Nightlife on-property first"
      ],
      lux: [
        "A small-group boat leftover (tour)",
        "One better day, not three",
        "Beach still wins",
        "Spa leftover-only",
        "Do not stack two islands"
      ]
    };
    P.ACTIVITIES["jamaica"] = {
      budget: [
        "Beach in front of the resort (included)",
        "Skip a dock kiosk on Lean",
        "A town walk with a trusted driver",
        "Snorkel from shore if the reef is there",
        "Transfer time is a cost"
      ],
      mid: [
        "One boat or a falls day — pick one (ticketed / tour)",
        "Beach for the rest",
        "A second tour is the overrun",
        "Negril sunset leftover",
        "Nightlife on-property first"
      ],
      lux: [
        "A small-group tour leftover (tour)",
        "One better day, not three",
        "Beach still wins",
        "Spa leftover-only",
        "Do not stack Dunn’s and a second falls"
      ]
    };
    P.ACTIVITIES["barcelona"] = {
      budget: [
        "A neighborhood walk — Gràcia or Born (free)",
        "One Gaudí exterior from the street (free)",
        "Skip a hop-on bus",
        "A beach leftover",
        "Metro pass"
      ],
      mid: [
        "One timed Gaudí — Sagrada or Park Güell (ticketed)",
        "A second neighborhood still",
        "A beach still",
        "A second interior leftover",
        "Do not stack two Gaudís and a beach club"
      ],
      lux: [
        "A reserved Sagrada leftover (ticketed)",
        "A day trip leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "August is a crowd tax"
      ]
    };
    P.ACTIVITIES["mexico_city"] = {
      budget: [
        "A Roma / Condesa walk (free)",
        "A mercado morning (free / cheap)",
        "One museum if leftover covers it (ticketed)",
        "Skip a tourist-taxi loop",
        "Altitude slack"
      ],
      mid: [
        "One ruin or museum — Anthropology or Teotihuacan (ticketed / tour)",
        "A second neighborhood still",
        "A mercado still",
        "A second museum leftover",
        "Do not stack two ruins"
      ],
      lux: [
        "A reserved tasting leftover (tour)",
        "A second ruin leftover",
        "A dawn walk still",
        "Do not stack two ruins and a tasting",
        "Altitude first"
      ]
    };
    P.ACTIVITIES["thailand"] = {
      budget: [
        "A temple + a neighborhood walk (free / cheap)",
        "A river boat leftover",
        "Skip a five-temple checklist",
        "A night market is dinner",
        "Heat slack"
      ],
      mid: [
        "One ticketed — palace or a show (ticketed)",
        "A second neighborhood still",
        "A floating market leftover",
        "A second temple leftover",
        "Do not stack palace, market, and a show"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A second city leftover",
        "A dawn walk still",
        "Do not stack every island",
        "Heat first"
      ]
    };
    P.ACTIVITIES["nola"] = {
      budget: [
        "A French Quarter walk in daylight (free)",
        "A streetcar hour (cheap)",
        "Skip a haunted tour on Lean",
        "A park leftover",
        "The music is often free if you walk"
      ],
      mid: [
        "One house or a plantation — pick one (ticketed)",
        "A second neighborhood still — Marigny",
        "A music ticket leftover",
        "A streetcar still",
        "Do not stack two plantations"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A second house leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "Mardi Gras is a different budget"
      ]
    };
    P.ACTIVITIES["chicago"] = {
      budget: [
        "A riverwalk / lakefront walk (free)",
        "A free museum hour if the calendar lines up",
        "Skip a hop-on bus",
        "Architecture from the sidewalk",
        "The L is the plan"
      ],
      mid: [
        "One ticketed — Art Institute or a river cruise (ticketed)",
        "A second neighborhood still",
        "A second museum leftover",
        "A lakefront still",
        "Do not stack two museums and a cruise"
      ],
      lux: [
        "A reserved show leftover (ticketed)",
        "A second cruise leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "Summer weekends are a crowd tax"
      ]
    };
    P.ACTIVITIES["amsterdam"] = {
      budget: [
        "A canal-belt walk (free)",
        "A neighborhood that is not Damrak (free)",
        "Skip a hop-on boat on Lean",
        "A market leftover",
        "Tram pass"
      ],
      mid: [
        "One museum — Rijks or Van Gogh (ticketed)",
        "A second walk still",
        "A canal leftover",
        "A second museum leftover",
        "Do not stack two museums and a cruise"
      ],
      lux: [
        "A reserved museum leftover (ticketed)",
        "A day trip leftover",
        "A dawn walk still",
        "Do not stack three interiors",
        "King’s Day is a crowd tax"
      ]
    };
    P.ACTIVITIES["lisbon"] = {
      budget: [
        "A miradouro walk (free)",
        "A neighborhood that is not the viewpoint terrace (free)",
        "Skip the 28 as transit",
        "A tram photo is a queue",
        "Hills are the activity"
      ],
      mid: [
        "One interior — Jerónimos or a museum (ticketed)",
        "A second walk still",
        "A Belém leftover",
        "A second miradouro still",
        "Do not stack two interiors and Sintra"
      ],
      lux: [
        "A reserved Sintra leftover (ticketed / train)",
        "A second interior leftover",
        "A dawn walk still",
        "Do not stack three palaces",
        "August is a crowd tax"
      ]
    };
    P.ACTIVITIES["iceland"] = {
      budget: [
        "A 101 walk (free)",
        "A pool hour (cheap)",
        "Skip the Blue Lagoon on Lean if leftover is tight",
        "Pack a Ring Road lunch if you drive",
        "Weather slack"
      ],
      mid: [
        "Golden Circle or a pool — pick one (tour / cheap)",
        "A second walk still",
        "A second soak leftover",
        "A dawn still",
        "Do not stack Circle, South Coast, and a lagoon"
      ],
      lux: [
        "A reserved lagoon leftover (ticketed)",
        "A second day leftover",
        "A dawn walk still",
        "Do not stack every waterfall",
        "Grocery first on road days"
      ]
    };
    P.ACTIVITIES["bali"] = {
      budget: [
        "A beach or a rice-terrace walk (free / cheap)",
        "A temple leftover (cheap)",
        "Skip a beach-club day on Lean",
        "Scooter math is real",
        "Nyepi dates matter"
      ],
      mid: [
        "One temple + a terrace (cheap / ticketed)",
        "A second beach still",
        "A club leftover",
        "A sunrise leftover",
        "Do not stack two temples and a club"
      ],
      lux: [
        "A reserved sunrise leftover (tour)",
        "A second club leftover",
        "A dawn walk still",
        "Do not stack every cliff",
        "Nyepi is a skip or a gift"
      ]
    };
    P.ACTIVITIES["dubai"] = {
      budget: [
        "A souk / heritage walk (free / cheap)",
        "Photograph the icon from the street first",
        "Skip a desert upsell on day one",
        "Metro to Downtown",
        "Summer midday is indoor"
      ],
      mid: [
        "One icon ticket + a souk (ticketed / free)",
        "A desert leftover",
        "A second walk still",
        "A fountain hour still",
        "Do not stack two icons and a desert"
      ],
      lux: [
        "A private desert leftover (tour)",
        "A second icon leftover",
        "A heritage walk still",
        "Do not stack seven paid tours",
        "Luxury is a weekend"
      ]
    };
  }

  function patchUniques() {
    appendHotel("punta_cana", "mid", ["Bávaro 4-star garden-view if Cap Cana is sold — stay on the value beach"]);
    appendHotel("punta_cana", "lux", ["One Cap Cana campus. A second resort hop is a transfer tax"]);
    appendHotel("lisbon", "budget", ["A Graça or Alfama walk-up with a grocery on the block", "Skip a miradouro hotel on Lean — the view is free from the street"]);
    appendHotel("lisbon", "mid", ["A Príncipe Real 3–4 star — walk downhill to dinner", "One neighborhood. Do not change hills nightly"]);
    appendHotel("barcelona", "budget", ["A Gràcia 2-star on a Metro line — restaurants on the block", "Skip Las Ramblas addresses on Lean"]);
    appendHotel("barcelona", "mid", ["An Eixample 3–4 star near Passeig de Gràcia Metro", "One neighborhood — Born or Eixample, not both"]);
    appendHotel("amsterdam", "budget", ["A Jordaan-adjacent 2-star — pack light, stairs are the elevator", "Skip a canal-house rate on Lean if a tram 3-star is cheaper"]);
    appendHotel("amsterdam", "mid", ["A canal 3–4 star two streets off Damrak", "De Pijp or Jordaan — pick one"]);
    appendHotel("iceland", "lux", ["One 101 flagship or one countryside lodge — not both in 4 nights"]);
    appendHotel("nola", "budget", ["A Warehouse District 2-star on the streetcar", "Skip a Bourbon balcony on Lean — the music is on the sidewalk"]);
    appendHotel("nola", "mid", ["A Marigny or CBD 3–4 star — walk to dinner", "Garden District if leftover covers the quieter nights"]);
    appendHotel("thailand", "budget", ["A Khao San-adjacent guesthouse only as a crash pad — Silom / old city is quieter", "Fan room + a stall downstairs is the Lean product"]);
    appendHotel("thailand", "mid", ["A Sukhumvit 3–4 star near a BTS", "One city base — Bangkok or Chiang Mai, not a nightly hop"]);
    appendHotel("thailand", "lux", ["One river hotel. Three island hops are a different budget"]);
    appendHotel("bali", "budget", ["A Canggu homestay — walk to a warung, scooter for the beach", "Skip Seminyak rates on Lean"]);
    appendHotel("bali", "mid", ["A Seminyak boutique if the beach clubs are the point", "One base — Ubud or the coast"]);
    appendHotel("bali", "lux", ["One villa. Three mediocre resorts is not Stretch"]);
    appendHotel("dubai", "budget", ["A Rove-class compact room on the Metro", "Skip a Marina address on Lean"]);
    appendHotel("dubai", "mid", ["A Downtown 4-star near a Metro — not a taxi habit", "Palm or Downtown — pick one pocket"]);
    appendHotel("dubai", "lux", ["One icon hotel as a weekend, not a week"]);
    appendHotel("chicago", "mid", ["A River North 4-star on the river walk", "Fulton Market if restaurants are the point"]);
    appendHotel("tokyo", "lux", ["One Ginza or Marunouchi flagship — you still take the Metro to dinner"]);
    appendHotel("paris", "mid", ["A 5th–6th or 10th–11th 3-star — one arrondissement"]);
    appendFallbackHotel("europe", "lux", ["One palace or design hotel — mid Europe already eats a US budget"]);
    appendFallbackHotel("hawaii", "lux", ["One beach-premium flagship. The car becomes mandatory once you leave town"]);
    appendFallbackHotel("caribbean", "budget", ["A value AI on the main beach — garden view on purpose"]);
    appendFallbackHotel("caribbean", "mid", ["A 4-star AI or a town boutique — one property"]);
    appendFallbackHotel("caribbean", "lux", ["Adults-only or villa leftover. Still no invented fare"]);
    appendFallbackHotel("mexico", "budget", ["Centro guesthouse or a value AI — pick one product"]);
    appendFallbackHotel("mexico", "lux", ["Flagship or adults-only. The reservation is often the better splurge"]);
    appendFallbackHotel("asia", "budget", ["Business hotel or capsule next to a Metro — convenience-store breakfast"]);
    appendFallbackHotel("asia", "mid", ["4-star near a Metro interchange. Rail passes are often a bad buy on a short city trip"]);
    appendFallbackHotel("asia", "lux", ["Palace / Park Hyatt / Mandarin class. The room or the counter dinner — rarely both"]);
    appendFallbackHotel("oceania", "budget", ["City hostel-plus or a 3-star on a train. Long-haul is the expensive line"]);
    appendFallbackHotel("oceania", "mid", ["Harbor or CBD 4-star. One city, then a separate island budget if you split"]);
    appendFallbackHotel("oceania", "lux", ["Waterfront or lodge flagship. Do not stack every adventure add-on"]);
    appendFallbackHotel("africa", "budget", ["Medina guesthouse or city 3-star. Day tours beat a safari-priced room you do not need"]);
    appendFallbackHotel("africa", "mid", ["Riad / boutique / 4-star in the walkable core. Safari lodges are a different budget"]);
    appendFallbackHotel("africa", "lux", ["Lodge or palace leftover. The game drive is the product"]);
    appendFallbackHotel("middleeast", "budget", ["Downtown 3-star on a Metro. Desert tours are day-two, not day-one upsells"]);
    appendFallbackHotel("middleeast", "mid", ["Downtown or Marina 4-star. Summer is cheap and brutal"]);
    appendFallbackHotel("middleeast", "lux", ["Icon hotel as a weekend, not a week"]);
    appendFallbackHotel("latam", "budget", ["Centro or zona colonial guesthouse. Uber is cheap; tourist-taxi menus are not"]);
    appendFallbackHotel("latam", "mid", ["Boutique in the restaurant neighborhood or a 4-star AI on the beach"]);
    appendFallbackHotel("latam", "lux", ["Casa-hotel or adults-only beach. The tasting menu is often the better Stretch"]);
    appendFallbackHotel("city", "budget", ["Limited-service on transit. Walk-to-bakery beats a cheap room far from everything"]);
    appendFallbackHotel("city", "mid", ["3–4 star in the walkable core. One room, not a suite"]);
    appendFallbackHotel("city", "lux", ["Flagship in one district. Leftover only"]);
    appendFallbackHotel("domestic", "lux", ["Suite only if leftover covers the jump from mid"]);
    appendAct("paris", "mid", ["A second cheap morning — a park or a covered passage (free)"]);
    appendAct("tokyo", "budget", ["A second neighborhood if leftover covers the Metro hours (free)"]);
    appendAct("tokyo", "lux", ["A second ticketed leftover — not a Kyoto fake-day (ticketed)"]);
    appendAct("cancun", "budget", ["A Hotel Zone walk at dusk, not a timeshare morning (free)"]);
  }

  function rebalanceHotels() {
    function replaceHotel(id, style, picks) {
      var dest = P.HOTEL_EXAMPLES && P.HOTEL_EXAMPLES[id];
      if (!dest || !dest[style]) return;
      dest[style].picks = picks.slice();
    }
    function replaceFallbackHotel(key, style, picks) {
      var fb = P.HOTEL_FALLBACKS && P.HOTEL_FALLBACKS[key];
      if (!fb || !fb[style]) return;
      fb[style].picks = picks.slice();
    }
    replaceHotel("los_angeles", "budget", ["Hampton Inn & Suites Los Angeles Downtown — walk to Metro and Grand Central Market", "Holiday Inn Express Downtown LA — limited-service, skip the Valley cloverleaf", "Courtyard Los Angeles L.A. LIVE — Pico station pocket, convention-adjacent", "Moxy Downtown Los Angeles — compact Marriott, Arts District walking", "Freehand Downtown — hostel-plus if the party will share a room"]);
    replaceHotel("los_angeles", "mid", ["Hyatt Regency Los Angeles Downtown — L.A. LIVE, Metro in the block", "The Westin Bonaventure Downtown — Figueroa, one rideshare zone", "Sheraton Grand Los Angeles — Financial District, walk to Metro", "Hilton Checkers Los Angeles — compact Downtown, skip a Santa Monica commute", "Ace Hotel Downtown — boutique if you want Grand Central Market walking"]);
    replaceHotel("los_angeles", "lux", ["JW Marriott Los Angeles L.A. LIVE — Stretch default for Marriott points", "Conrad Los Angeles — Grand LA, DTLA flagship", "The Ritz-Carlton Los Angeles — L.A. LIVE tower, leftover only", "Waldorf Astoria Beverly Hills — a different pocket; rideshare assumed", "1 Hotel West Hollywood or Proper Santa Monica — boutique if leftover is the neighborhood"]);
    replaceHotel("anaheim", "budget", ["Hampton Inn & Suites Anaheim Resort Convention Center — Harbor Blvd shuttle or a short walk", "Holiday Inn Express Anaheim Disneyland — limited-service, grocery breakfast", "Fairfield Inn Anaheim Resort — Marriott value, Convention Center pocket", "Candy Cane Inn — local Harbor Blvd classic if you want a courtyard, not a points hotel", "Howard Johnson Anaheim — garden-court Lean, skip a Santa Monica hotel as this lodging"]);
    replaceHotel("anaheim", "mid", ["Hilton Anaheim — Convention Center campus, walk or a short shuttle to the gates", "Anaheim Marriott — same campus, one room not a suite", "Hyatt House at Anaheim Resort — kitchenette mid if the party will grocery dinners", "SpringHill Suites Anaheim Resort/Convention Center — Marriott suite-ish mid", "Pixar Place Hotel — Disney moderate-class, walk to Downtown Disney"]);
    replaceHotel("anaheim", "lux", ["Disney’s Grand Californian — Deluxe, walk to California Adventure", "Disneyland Hotel — on-property, monorail-adjacent campus", "JW Marriott Anaheim Resort — off-property Stretch with a real pool", "The Westin Anaheim Resort — newer tower, still a shuttle or walk", "Do not also book a Santa Monica night in the same 5-night week"]);
    replaceHotel("nyc", "budget", ["Hampton Inn Manhattan Times Square Central — train downstairs, skip paying for the neon view", "Motto by Hilton New York City Chelsea — compact Hilton, walk to the 1 / A / C / E", "Holiday Inn Express New York City – Chelsea — limited-service, grocery in walking distance", "Courtyard New York Manhattan/Chelsea — Marriott value, one subway zone", "Pod 39 or citizenM Bowery — boutique-compact if you packed light"]);
    replaceHotel("nyc", "mid", ["New York Marriott Marquis — Times Square, you came for the trains not the lobby", "Hilton New York Midtown — Sixth Avenue, walk to a borough train", "Hyatt Grand Central New York — attached to Grand Central, skip a rental car", "The Westin New York Grand Central — midtown east, subway in the pocket", "Ace Hotel NoMad — boutique if you want the neighborhood over a convention tower"]);
    replaceHotel("nyc", "lux", ["Park Hyatt New York — Midtown flagship, leftover only", "The Ritz-Carlton New York, Central Park — park-adjacent Stretch", "The St. Regis New York — Fifth Avenue, still a crosstown walk to meetings", "Conrad New York Downtown — Battery Park, not a Midtown tower", "1 Hotel Central Park — boutique flagship if leftover is the park address"]);
    replaceHotel("vegas", "budget", ["Hampton Inn Tropicana — south Strip / University Center, one rideshare or bus to Center-Strip", "Hilton Garden Inn Las Vegas Strip South — limited-service, resort fee still applies", "Courtyard Las Vegas Convention Center — Marriott value off the Center-Strip crush", "The LINQ or Flamingo — Center-Strip bed, not a suite", "Ellis Island or a Fremont 2-star — downtown walking if you skip the Strip tram math"]);
    replaceHotel("vegas", "mid", ["Park MGM — no-casino-smoke tower, walk to the Bellagio fountains", "The Venetian / Palazzo — huge campus; you came to walk, not to Uber", "Renaissance Las Vegas — Convention Center, Marriott mid without a casino floor", "Hilton Grand Vacations on the Las Vegas Strip — points-friendly mid if the campus fits", "Horseshoe or New York-New York — Center-Strip walk, not a suite"]);
    replaceHotel("vegas", "lux", ["Waldorf Astoria Las Vegas — Center-Strip, no casino on the lobby level", "Bellagio — fountain-adjacent, still a resort-fee hotel", "Wynn or Encore — north Strip, nicer rooms, you will still walk or tram", "Four Seasons Hotel Las Vegas — Mandalay Bay campus, quieter tower", "JW Marriott Las Vegas Resort & Spa — Summerlin leftover; a different commute than the Strip"]);
    replaceHotel("chicago", "budget", ["Hampton Inn Chicago Downtown/Magnificent Mile — trains downstairs", "Holiday Inn Express Chicago Magnificent Mile — limited-service, grocery in walking distance", "Courtyard Chicago Downtown/River North — Marriott value, walk to the L", "Motto by Hilton Chicago Downtown — compact, skip a suburban cloverleaf", "Freehand Chicago — hostel-plus if the party will share"]);
    replaceHotel("chicago", "mid", ["Chicago Marriott Downtown Magnificent Mile — Mag Mile, one room not a suite", "Hilton Chicago — Grant Park / South Loop, walk to the L", "Hyatt Regency Chicago — river, convention-adjacent", "The Westin Michigan Avenue Chicago — Mag Mile mid", "The Hoxton Chicago — Fulton Market boutique if restaurants are the point"]);
    replaceHotel("chicago", "lux", ["Park Hyatt Chicago — Water Tower Stretch", "The St. Regis Chicago — lakeshore tower, leftover only", "Four Seasons Hotel Chicago — Mag Mile flagship", "Waldorf Astoria Chicago — Gold Coast, winter rates are the value window", "The Langham Chicago — river boutique-luxe if leftover is the address"]);
    replaceHotel("miami", "budget", ["Hampton Inn Miami Beach — Mid-Beach, walk or a short bus to the sand", "Holiday Inn Express Miami Airport / Downtown — Lean only if you rideshare to the beach once", "Courtyard Miami Downtown/Brickell — Metromover, skip an Ocean Drive address", "Freehand Miami — hostel-plus, walk to the beach and the bus", "The Gale South Beach — Collins 2–3 star a few blocks off the water"]);
    replaceHotel("miami", "mid", ["Miami Marriott Biscayne Bay — mainland mid, better food walking than Ocean Drive", "Hilton Miami Downtown — bay, Metromover, not a beach tax", "Hyatt Centric South Beach Miami — Collins walk-to-sand", "Kimpton EPIC Hotel — Brickell bay, one pocket", "The Confidante or a renovated Art Deco 3–4 star on Collins — South Beach without Ocean Drive tax"]);
    replaceHotel("miami", "lux", ["1 Hotel South Beach — beach premium, you will still pay for the cabana", "The Ritz-Carlton, South Beach — Collins Stretch", "The Miami Beach EDITION — Mid-Beach flagship", "Four Seasons Hotel at The Surf Club — Surfside, quieter than Ocean Drive", "W South Beach or St. Regis Bal Harbour — one flagship, not two neighborhoods"]);
    replaceHotel("san_francisco", "budget", ["Hampton Inn San Francisco Downtown/Convention Center — walk to BART", "Holiday Inn Express San Francisco Fisherman’s Wharf — only if that pocket is the trip", "Courtyard San Francisco Downtown — Marriott value, Union Square-adjacent", "Hotel Zephyr — Wharf 2–3 star if you want that grid", "HI San Francisco Downtown — hostel-plus, BART downstairs"]);
    replaceHotel("san_francisco", "mid", ["Hilton San Francisco Union Square — cable-car adjacent, BART downstairs", "San Francisco Marriott Marquis — Moscone / SoMa, one room not a suite", "Hyatt Regency San Francisco — Embarcadero, Ferry Building walk", "The Westin St. Francis — Union Square, cable car at the door", "Hotel Emeline — Jackson Square boutique if you want the neighborhood over a convention tower"]);
    replaceHotel("san_francisco", "lux", ["Fairmont San Francisco — Nob Hill, cable car at the door", "St. Regis San Francisco — SoMa, walk to SFMOMA", "Four Seasons Hotel San Francisco — SoMa flagship", "JW Marriott San Francisco Union Square — Stretch without a palace rate", "1 Hotel San Francisco — waterfront boutique if leftover is the Embarcadero"]);
    replaceHotel("san_diego", "budget", ["Hampton Inn San Diego Downtown — trolley, skip Hotel Circle / Mission Valley", "Holiday Inn San Diego – Bayside — harbor-adjacent Lean, not a Gaslamp tax", "Courtyard San Diego Downtown/Gaslamp — Marriott value, walk the trolley", "HI San Diego Downtown — hostel-plus, harbor or Gaslamp bus", "Pacific Beach motel class — beach grid if you will not Uber every meal"]);
    replaceHotel("san_diego", "mid", ["Hilton San Diego Bayfront — convention / harbor, trolley adjacent", "San Diego Marriott Gaslamp Quarter — walk to the trolley and dinner", "Manchester Grand Hyatt San Diego — waterfront mid, one campus", "The Westin San Diego Gaslamp Quarter — walkable mid", "Hotel Palomar San Diego — Kimpton Gaslamp boutique if you want Little Italy walking"]);
    replaceHotel("san_diego", "lux", ["Hotel del Coronado — Hilton historic, ferry or bridge, the postcard lodging", "Fairmont Grand Del Mar — north, car assumed", "Pendry San Diego — harbor walk Stretch", "1 Hotel San Diego — waterfront boutique leftover", "Grand Hyatt San Diego — bay flagship if leftover is the tower, not Hotel Circle"]);
    replaceHotel("philadelphia", "budget", ["Hampton Inn Philadelphia Center City-Convention Center — limited-service, grocery downstairs", "Home2 Suites Philadelphia Downtown — kitchenette if you will grocery breakfasts", "Holiday Inn Express Philadelphia – Midtown — walk to a Broad Street Line stop", "Courtyard Philadelphia Downtown — Marriott value near City Hall", "Apple Hostels or a Center City hostel-plus — Lean if the party will share"]);
    replaceHotel("philadelphia", "mid", ["Philadelphia Marriott Downtown — Convention Center, walk to Reading Terminal", "The Notary Hotel — Hilton, City Hall pocket", "Canopy by Hilton Philadelphia Center City — one neighborhood, not University City", "Kimpton Hotel Monaco Philadelphia — Independence Mall walking", "Loews Philadelphia Hotel — Center City mid, SEPTA beats a rental car"]);
    replaceHotel("philadelphia", "lux", ["Four Seasons Hotel Philadelphia — Logan Square leftover", "The Logan Philadelphia — Marriott Autograph, Benjamin Franklin Parkway", "The Rittenhouse — square-adjacent Stretch", "W Philadelphia — Center City flagship", "Independence timed entry is the ticket, not a palace breakfast"]);
    replaceHotel("atlanta", "budget", ["Hampton Inn & Suites Atlanta-Midtown — limited-service, MARTA or BeltLine walking", "Home2 Suites Atlanta Downtown — kitchenette, skip a Cumberland cloverleaf", "Holiday Inn Express Atlanta Downtown — Centennial pocket, grocery in walking distance", "Courtyard Atlanta Downtown — Marriott value, walk to a MARTA stop", "HI Atlanta — hostel-plus if the party will share"]);
    replaceHotel("atlanta", "mid", ["Atlanta Marriott Marquis — Downtown atrium, one room not a suite", "Hyatt Regency Atlanta — Downtown, Peachtree walking", "Hilton Atlanta — Downtown convention campus", "The Westin Peachtree Plaza — Midtown-adjacent tower, skip Buckhead unless leftover covers two pockets", "Hotel Clermont — Ponce boutique if you want BeltLine and Ponce City Market walking"]);
    replaceHotel("atlanta", "lux", ["Four Seasons Hotel Atlanta — Midtown leftover", "St. Regis Atlanta — Buckhead Stretch; you traded BeltLine walking", "Grand Hyatt Atlanta in Buckhead — same pocket, leftover only", "JW Marriott Atlanta Buckhead — Stretch if leftover is Buckhead, not the Aquarium hotel", "The Whitley Atlanta Buckhead — Hyatt flagship, one tower"]);
    replaceHotel("dallas", "budget", ["Hampton Inn & Suites Dallas Downtown — limited-service, DART downstairs", "Homewood Suites Dallas Downtown — kitchenette, skip a Las Colinas cloverleaf", "Holiday Inn Express Dallas Downtown — walk to Downtown", "Courtyard Dallas Downtown/Deep Ellum — Marriott value if that is the night you came for", "A Design District 2-star — grocery in walking distance"]);
    replaceHotel("dallas", "mid", ["Dallas Marriott City Center — Downtown, walk to the Arts District", "Hyatt Regency Dallas — Reunion Tower pocket, DART adjacent", "Hilton Anatole — Design District-adjacent campus; a short DART or rideshare to Downtown", "The Adolphus — Marriott Autograph, Downtown grande dame without a suite", "The Statler Dallas — Hilton Curio, walk to the Arts District"]);
    replaceHotel("dallas", "lux", ["The Ritz-Carlton, Dallas — Uptown leftover", "W Dallas Victory — Uptown / Victory Park Stretch", "The Joule — Downtown design flagship", "Hall Arts Hotel Dallas — Marriott Autograph, Arts District leftover", "Rosewood Mansion on Turtle Creek — leftover, car assumed"]);
    replaceHotel("houston", "budget", ["Hampton Inn & Suites Houston Downtown — limited-service, Metro rail", "Home2 Suites Houston Downtown — kitchenette, skip an Energy Corridor cloverleaf", "Holiday Inn Express Houston Downtown — walk to rail", "Courtyard Houston Downtown/Convention Center — Marriott value", "A Montrose 2-star if that is the restaurant neighborhood"]);
    replaceHotel("houston", "mid", ["Houston Marriott Marquis — Downtown, walk to rail", "Hilton Americas-Houston — convention / Discovery Green", "Hyatt Regency Houston — Downtown mid, one pocket", "The Westin Houston Downtown — theater pocket", "Le Méridien Houston Downtown — Marriott, walk to rail; Galleria is a different commute"]);
    replaceHotel("houston", "lux", ["Four Seasons Hotel Houston — Downtown leftover", "JW Marriott Houston Downtown — Stretch in the core", "The Post Oak Hotel at Uptown Houston — Galleria-adjacent, car assumed", "Hotel Alessandra — Marriott Autograph Downtown flagship", "The reservation is often the better splurge than a second tower"]);
    replaceHotel("seattle", "budget", ["Hampton Inn Seattle Downtown Convention Center — walk or Link to Pioneer Square", "Motto by Hilton Seattle Downtown — compact, skip a Tukwila cloverleaf", "Holiday Inn Express Seattle City Center — limited-service, grocery nearby", "Courtyard Seattle Downtown/Pioneer Square — Marriott value, Link adjacent", "HI Seattle — hostel-plus on Link if the party will share"]);
    replaceHotel("seattle", "mid", ["Seattle Marriott Waterfront — walk the waterfront, not a Pike Place hotel address", "Hilton Seattle — Downtown, one room not a suite", "Hyatt at Olive 8 — Downtown mid, walk to a streetcar", "The Westin Seattle — Downtown tower, skip a rental in the core", "Sheraton Grand Seattle — Downtown mid, July–August is peak and dry"]);
    replaceHotel("seattle", "lux", ["Fairmont Olympic Hotel — Downtown historic leftover", "Four Seasons Hotel Seattle — waterfront Stretch", "Thompson Seattle — Hyatt, Belltown leftover", "W Seattle — Downtown flagship", "Lotte Hotel Seattle — Stretch if leftover is the tower, not every island ferry"]);
    replaceHotel("boston", "budget", ["Hampton Inn Boston Seaport — limited-service, Silver Line / T, skip a Logan hotel", "Holiday Inn Express Boston Garden — North Station pocket, grocery nearby", "Courtyard Boston Downtown/North Station — Marriott value, T downstairs", "YOTEL Boston — compact Seaport if you packed light", "HI Boston — hostel-plus on the T if the party will share"]);
    replaceHotel("boston", "mid", ["Boston Marriott Copley Place — Back Bay, T not a car", "Hilton Boston Downtown/Faneuil Hall — walk to the waterfront, skip Faneuil dinner", "Hyatt Regency Boston — Downtown Crossing, one pocket", "The Westin Copley Place Boston — Back Bay mid", "Sheraton Boston Hotel — Prudential campus, Marathon / leaf weeks lift rooms"]);
    replaceHotel("boston", "lux", ["Four Seasons Hotel Boston — Back Bay leftover", "The Newbury Boston — Fairmont-adjacent historic Stretch", "Mandarin Oriental, Boston — Boylston leftover", "Raffles Boston Back Bay — Stretch flagship", "The Langham, Boston — Financial District, February is cheap and icy"]);
    replaceHotel("washington_dc", "budget", ["Hampton Inn Washington DC Convention Center — limited-service, Metro downstairs", "Motto by Hilton Washington DC City Center — compact, skip a Crystal City cloverleaf", "Holiday Inn Express Washington DC Downtown — grocery in walking distance", "Courtyard Washington Downtown/Convention Center — Marriott value", "HI Washington DC — hostel-plus on Metro if the party will share"]);
    replaceHotel("washington_dc", "mid", ["Washington Marriott at Metro Center — one room, Metro in the block", "Capital Hilton — Downtown, walk to the Mall", "Hyatt Place Washington DC/National Mall — limited-service-plus on Metro", "The Westin Washington, D.C. City Center — Downtown mid", "Canopy by Hilton Washington DC The Wharf — waterfront mid if leftover covers that pocket"]);
    replaceHotel("washington_dc", "lux", ["Waldorf Astoria Washington DC — Pennsylvania Avenue leftover", "The Willard InterContinental — historic Stretch, walk to the Mall", "Conrad Washington DC — CityCenter, leftover only", "St. Regis Washington, D.C. — Downtown flagship", "Four Seasons Hotel Washington, DC — Georgetown Stretch; you traded Mall walking"]);
    replaceHotel("london", "budget", ["Premier Inn London County Hall — South Bank river walk, not a West End rate", "Ibis London Euston St Pancras — Zone 1, Tesco downstairs", "Holiday Inn Express London – Southwark — Tube, skip a Heathrow hotel as this lodging", "Travelodge London Covent Garden — compact Zone 1 if you packed light", "Generator London — hostel-plus, Bloomsbury walking"]);
    replaceHotel("london", "mid", ["London Marriott Hotel County Hall — South Bank, walk to a station", "Hilton London Bankside — Southwark mid, Tube in the pocket", "Hyatt Regency London – The Churchill — Portman Square, one neighborhood", "The Westin London City — City mid, not Mayfair prices", "Canopy by Hilton London City — Aldgate, restaurants on the block"]);
    replaceHotel("london", "lux", ["The Savoy — Fairmont, river leftover", "Conrad London St. James — Stretch near Westminster", "The Langham, London — Portland Place leftover", "Raffles London at The OWO — Whitehall Stretch", "Claridge’s or The Connaught — Mayfair leftover only"]);
    replaceHotel("paris", "budget", ["Ibis Paris Gare du Nord — Metro downstairs, not a tower-block view", "Ibis Styles Paris République — 10th/11th, bakery downstairs", "Holiday Inn Express Paris – Canal de la Villette — Metro line, Lean if you land late", "Generator Paris — hostel-plus, Canal Saint-Martin", "Novotel Paris Les Halles — more mid; Lean stays Ibis / Express on a Metro line"]);
    replaceHotel("paris", "mid", ["Hilton Paris Opera — 8th/9th, Metro in five minutes", "Paris Marriott Opera Ambassador — Opera pocket, one arrondissement", "Hyatt Regency Paris Étoile — 17th, Metro / RER, skip changing arrondissements nightly", "The Westin Paris – Vendôme — 1st, mid-plus if leftover covers the address", "Hôtel Malte Opéra or a 3-star near Luxembourg — boutique if you want Left Bank walking"]);
    replaceHotel("paris", "lux", ["Park Hyatt Paris-Vendôme — 1st leftover", "Four Seasons Hotel George V — 8th Stretch", "The Ritz Paris — Place Vendôme, leftover only", "Hôtel de Crillon — Rosewood, Place de la Concorde", "Lutetia Paris — Left Bank palace-adjacent if leftover is the name"]);
    replaceHotel("rome", "budget", ["Ibis Styles Roma Vintage or Ibis Roma Centro — Metro, pack light, stairs are common", "Holiday Inn Rome – Eur — Lean only if leftover is tight; Prati/Termini is closer", "Best Western Plus Hotel Universo — Termini, trains and buses, louder nights", "The Beehive — Termini hostel-plus if the party will share", "A Prati guesthouse near Ottaviano — Metro to the Vatican, calmer than the centro"]);
    replaceHotel("rome", "mid", ["Rome Marriott Grand Hotel Flora — Via Veneto, walk-adjacent to the Spanish Steps crush", "The Westin Excelsior, Rome — Via Veneto mid", "Hotel Indigo Rome – St. George — Centro, walk everywhere", "NH Collection Roma Palazzo Cinquecento — Termini-adjacent 4-star if you arrive late", "Hotel Nazionale or a Centro Storico 3-star — Piazza Navona / Pantheon pocket"]);
    replaceHotel("rome", "lux", ["Waldorf Astoria Rome Cavalieri — hill campus, leftover, a taxi to the centro", "The St. Regis Rome — Via Vittorio Emanuele Orlando Stretch", "Hotel de Russie — Rocco Forte, Piazza del Popolo, walk the centro", "Hassler Roma — Spanish Steps above the crush", "Hotel Eden — Dorchester, Via Veneto leftover only"]);
    replaceHotel("tokyo", "budget", ["APA Hotel Shinjuku-Kabukicho or APA Guesthouse — station downstairs, convenience store in the lobby", "Toyoko Inn Shinjuku or Ueno — business-hotel Lean, skip a taxi habit", "Super Hotel Lohas Ikebukuro or Ueno — limited-service, Metro in the block", "Ibis Styles Tokyo Ginza — Accor value if leftover covers a central ward", "Nine Hours capsule in Shinjuku — Lean crash-pad only, pack a cube"]);
    replaceHotel("tokyo", "mid", ["Hilton Tokyo — Shinjuku, Metro in the basement", "Tokyo Marriott Hotel — Shinagawa / Gotanda, JR adjacent", "Hyatt Regency Tokyo — Shinjuku mid, neighborhood walking", "The Westin Tokyo — Ebisu, one train zone", "Hotel Gracery Shinjuku or Mitsui Garden Shibuya — Japanese 4-star, trains not a JR-pass spreadsheet"]);
    replaceHotel("tokyo", "lux", ["Park Hyatt Tokyo — Shinjuku, the view; you still take the Metro to dinner", "Conrad Tokyo — Shiodome Stretch", "The Ritz-Carlton, Tokyo — Roppongi leftover", "Aman Tokyo — Otemachi, station downstairs", "Palace Hotel Tokyo — Imperial-garden quiet, leftover only"]);
    replaceHotel("oahu", "budget", ["Hampton Inn & Suites Honolulu/Waikiki — limited-service, walk to the sand", "Holiday Inn Express Waikiki — one block back, same beach", "Aqua Oasis or Shoreline Hotel Waikiki — Outrigger-adjacent value, skip a rental car", "The Equus — Kuhio Avenue 2-star, kitchenette beats resort breakfast", "Hostelling International Waikiki — hostel-plus if the party will share"]);
    replaceHotel("oahu", "mid", ["Hilton Hawaiian Village — huge campus, you came for the lagoon not the boutique", "Sheraton Waikiki — Kalakaua walk, beach access", "Hyatt Regency Waikiki Beach Resort — same grid, still no car required", "Outrigger Waikiki Beach Resort — walk-to-beach mid", "Embassy Suites by Hilton Waikiki Beach Walk — kitchenette mid if you will grocery dinners"]);
    replaceHotel("oahu", "lux", ["The Royal Hawaiian — Marriott Luxury Collection, Waikiki luxury if you refuse to leave the grid", "Halekulani — Waikiki leftover", "The Kahala Hotel & Resort — east of Waikiki, quieter beach", "Four Seasons Resort Oahu at Ko Olina — west side, car assumed", "Aulani, A Disney Resort & Spa — west side leftover + kids"]);
    replaceHotel("maui", "budget", ["Holiday Inn Express Kahului — crash-pad only the night you fly; Lean lodging is a Kihei condo", "Maui Coast Hotel — Kihei, walk to a food truck, grocery the first hour", "Aston Maui Kamaole or a South Kihei studio — kitchen is the Lean product", "Kohea Kai Maui — South Kihei boutique-value if leftover is tight", "Paia inn-adjacent 2-star — north shore if you will not sit in Kaanapali traffic"]);
    replaceHotel("maui", "mid", ["Sheraton Maui Resort & Spa — Kaanapali Beach, walk the path", "The Westin Maui Resort & Spa — same beach, resort fees will show up", "Hyatt Regency Maui Resort and Spa — Kaanapali, bigger campus", "Marriott’s Maui Ocean Club — points-friendly mid if the kitchen still wins dinners", "Wailea Ekahi or a Kihei-plus condo — one pocket, not three islands"]);
    replaceHotel("maui", "lux", ["Grand Wailea, A Waldorf Astoria Resort — Wailea Beach, the Stretch default", "Andaz Maui at Wailea — Hyatt, same pocket, leftover only", "Four Seasons Resort Maui at Wailea — leftover", "The Ritz-Carlton Maui, Kapalua — west side, a different drive", "Hotel Wailea — adults-only hill, you will still drive to dinner"]);
    replaceHotel("key_west", "budget", ["Hampton Inn Key West — Old Town-adjacent, walk or a short hop to Duval", "Holiday Inn Express Key West — limited-service, skip an EYW motel if you will Uber downtown every meal", "The Big Ruby Key West — guesthouse, walk to Duval, no car", "Key West hostel / Seashell Motel class — Lean only, pack light", "Caribbean House or a Truman Annex-adjacent inn — quieter pocket"]);
    replaceHotel("key_west", "mid", ["Hyatt Centric Key West Resort & Spa — Old Town water, walk to dinner", "Courtyard Key West Waterfront — Marriott, one neighborhood", "Hilton Garden Inn Key West — walkable mid if leftover covers it", "Kimpton Palms Hotel Key West — walkable boutique mid", "The Gardens Hotel — Old Town courtyard if you want inn over a chain campus"]);
    replaceHotel("key_west", "lux", ["Casa Marina Key West, A Waldorf Astoria Resort — beach-adjacent historic, south of Duval", "The Reach Key West, Curio Collection — Waldorf-adjacent, walk to the sand", "Ocean Key Resort — Sunset Pier pocket if leftover covers the address", "Pier House Resort & Spa — Old Town leftover", "Oceans Edge — marina campus and a shuttle; Stock Island is a different commute"]);
    replaceHotel("palm_springs", "budget", ["Hampton Inn & Suites Palm Springs — limited-service, walk or a short hop to Palm Canyon", "Holiday Inn Express Palm Springs — Lean courtyard, grocery nearby", "Movie Colony Hotel — mid-century motel, pool, walk to dinner", "A Uptown Design District motel-plus — skip a desert-edge interstate chain unless you have a trail plan", "Ingleside Inn-adjacent 2-star — quieter pocket"]);
    replaceHotel("palm_springs", "mid", ["Hilton Palm Springs — Downtown, walk to dinner", "Hyatt Palm Springs — Downtown mid, one pocket", "Renaissance Palm Springs Hotel — Marriott, Convention Center-adjacent", "Kimpton Rowan Palm Springs — Downtown rooftop mid", "Ace Hotel & Swim Club — boutique mid-century campus, still a rideshare to trails"]);
    replaceHotel("palm_springs", "lux", ["The Ritz-Carlton, Rancho Mirage — leftover, car assumed", "La Quinta Resort & Club, A Waldorf Astoria Resort — valley Stretch, a different drive than Downtown", "The Parker Palm Springs — leftover campus", "Omni Rancho Las Palmas — Rancho Mirage leftover", "Colony Palms Hotel — historic Stretch if leftover is the neighborhood"]);
    replaceHotel("napa", "budget", ["Hampton Inn & Suites Napa — limited-service, walk or a short hop to a grocery", "Holiday Inn Express Napa Valley — town Lean, skip an American Canyon highway motel unless you land late", "Napa Valley Marriott Hotel & Spa is mid; Lean stays Hampton / Express in Napa town", "A Calistoga value inn — walk to a grocery if Calistoga is the base", "Sonoma plaza-adjacent 2-star if Sonoma is the pocket you will eat in"]);
    replaceHotel("napa", "mid", ["Napa Valley Marriott Hotel & Spa — Downtown Napa, one town", "Andaz Napa — Hyatt, walkable downtown mid", "The Westin Verasa Napa — river mid, walk to Oxbow", "Archer Hotel Napa — Downtown mid-plus", "Napa River Inn — boutique if you want the river walk over a campus"]);
    replaceHotel("napa", "lux", ["Four Seasons Resort and Residences Napa Valley — Calistoga leftover", "Auberge du Soleil — Rutherford Stretch", "Solage, Auberge Resorts — Calistoga leftover", "Meadowood Napa Valley — Stretch if leftover is real", "The Estate Yountville — walk to dinner leftover-adjacent; do not also buy every reserve tasting"]);
    replaceHotel("san_antonio", "budget", ["Hampton Inn & Suites San Antonio Downtown/Riverwalk — limited-service, walk the river", "Drury Inn & Suites San Antonio Riverwalk — breakfast-in-rate if that is the product", "Holiday Inn Express San Antonio N-Riverwalk Area — a block off the postcard row", "Courtyard San Antonio Riverwalk — Marriott value", "Crockett Hotel — Alamo-adjacent local if you want historic over points"]);
    replaceHotel("san_antonio", "mid", ["San Antonio Marriott Riverwalk — walkable mid, one pocket", "Hilton Palacio del Rio — River Walk, skip a Fiesta Texas cloverleaf", "Hyatt Regency San Antonio — river-adjacent mid", "The Westin Riverwalk, San Antonio — 4-star on the water", "Hotel Emma — Pearl boutique if leftover covers the food-hall walk"]);
    replaceHotel("san_antonio", "lux", ["The St. Anthony Hotel — Marriott Autograph, Downtown grande dame leftover", "Thompson San Antonio — Pearl leftover", "Mokara Hotel & Spa — Destination by Hyatt, River Walk Stretch", "Fairmount Hotel San Antonio — historic Stretch, one property", "Hotel Emma Stretch suite if leftover covers the jump from mid"]);
    replaceHotel("lake_tahoe", "budget", ["Hampton Inn & Suites Tahoe-Truckee — Lean if North Shore is the plan, grocery the first hour", "Holiday Inn Express & Suites South Lake Tahoe — Stateline-adjacent value", "Basecamp Hotel South Lake Tahoe — walk to a bus if you can", "A Kings Beach or Tahoe Vista 2-star — North Shore grocery pocket", "Skip a Reno hotel plus a nightly drive as this lodging"]);
    replaceHotel("lake_tahoe", "mid", ["Marriott's Timber Lodge — Heavenly village, walk to the gondola", "Hyatt Regency Lake Tahoe Resort, Spa and Casino — North Shore mid-plus", "The Landing Resort & Spa Lake Tahoe — South Shore water mid", "Homewood Suites by Hilton South Lake Tahoe — kitchenette mid if you will grocery ski dinners", "A South Lake 3–4 star on the transit line — pick North or South, do not commute the lake twice a day"]);
    replaceHotel("lake_tahoe", "lux", ["The Ritz-Carlton, Lake Tahoe — Northstar leftover", "Edgewood Tahoe Resort — South Shore Stretch", "The Village at Palisades Tahoe — Olympic Valley leftover", "One base. A second lodge is a transfer", "April and November are the mud-season discount"]);
    replaceHotel("monterey", "budget", ["Hampton Inn Monterey — limited-service, skip a Highway 1 cliff motel you will drive past", "Holiday Inn Express Monterey — Cannery Row-adjacent Lean", "Best Western Plus Monterey Inn — downtown value", "A Pacific Grove 2-star — quieter, grocery nearby", "A Cannery Row limited-service a block off the aquarium"]);
    replaceHotel("monterey", "mid", ["InterContinental The Clement Monterey — IHG, Cannery Row mid", "Portola Hotel & Spa at Monterey Bay — downtown mid", "Monterey Plaza Hotel & Spa — water mid-plus", "Hotel Pacific — downtown boutique if you want the wharf walk", "Carmel-by-the-Sea mid only if the village is the point"]);
    replaceHotel("monterey", "lux", ["L’Auberge Carmel — Relais, village leftover", "Bernardus Lodge & Spa — Carmel Valley Stretch", "Post Ranch Inn or Ventana Big Sur — leftover, Highway 1 closures happen", "One base in Monterey or Carmel — Big Sur plus both towns is three parking lots", "Check Highway 1 before you lock a Big Sur night"]);
    replaceHotel("destin_30a", "budget", ["Hampton Inn Destin — limited-service, grocery the first hour", "Holiday Inn Express Destin — Harbor-adjacent Lean, skip a high-rise you will Uber from to the beach", "A Destin 1-bedroom condo off 98 — kitchen is the Lean product", "A 30A garage apartment in Seagrove or Santa Rosa if leftover is tight", "Miramar / Sandestin value only if you will use that beach"]);
    replaceHotel("destin_30a", "mid", ["Hilton Sandestin Beach Golf Resort & Spa — walk-to-gulf mid", "A renovated Destin condo a block off the gulf — mid if The Henderson is Stretch", "A Destin Harbor 3–4 star if you came for the boats, not the quiet", "30A condo in Seaside-adjacent / WaterColor village — kitchen still wins dinners", "Pick Destin or 30A. The drive along 98 is the hidden cost"]);
    replaceHotel("destin_30a", "lux", ["WaterColor Inn & Resort — 30A leftover", "The Pearl Hotel Rosemary Beach — Stretch", "Hilton Sandestin Stretch suite if leftover covers the gulf-front jump", "Henderson Park Inn — Destin leftover", "One town. Do not hop Rosemary, Seaside, and Destin nightly"]);
    replaceHotel("outer_banks", "budget", ["Hampton Inn & Suites Outer Banks / Corolla — north-end Lean only if that village is the plan", "Holiday Inn Express Nags Head — Lean corridor, grocery the first hour", "A Nags Head or Kill Devil Hills motel / 2-star — walk or a short drive to the sand", "A house share with a kitchen — the Lean product if the party will cook", "Skip a Corolla oceanfront on Lean; the drive is longer and the rate is not"]);
    replaceHotel("outer_banks", "mid", ["Hilton Garden Inn Outer Banks/Kitty Hawk — walk-to-beach mid", "Courtyard Outer Banks Kill Devil Hills — Marriott mid", "Sanderling Resort-adjacent mid — Duck, quieter", "A Nags Head oceanfront condo — kitchen still wins dinners", "Pick one village. Duck-to-Hatteras is not a casual dinner hop"]);
    replaceHotel("outer_banks", "lux", ["The Sanderling Resort — Duck leftover", "A Corolla oceanfront house — Stretch if the party fills it", "Life House Nags Head — design oceanfront leftover", "One village", "Hurricane weeks are not a discount you want to win"]);
    replaceHotel("grand_canyon", "budget", ["Holiday Inn Express Grand Canyon — Tusayan, short drive to the gate", "Maswik Lodge — in-park, cafeteria, walk or shuttle to the rim", "Yavapai Lodge — in-park mid-lean, shuttle", "Skip a Las Vegas hotel plus a 5-hour day-trip as this lodging"]);
    replaceHotel("grand_canyon", "mid", ["Best Western Premier Grand Canyon Squire Inn — Tusayan mid, indoor extras for kids", "The Grand Hotel at the Grand Canyon — Tusayan Hilton-adjacent mid", "Thunderbird or Kachina Lodge — rim-adjacent mid", "Bright Angel Lodge cabin class — historic mid", "Stay on the South Rim. North Rim is a different season and road"]);
    replaceHotel("grand_canyon", "lux", ["El Tovar Hotel — rim flagship leftover", "Bright Angel historic cabin if El Tovar is sold", "A Tusayan 4-star is not Stretch if you wanted the rim at dawn", "One property. Phantom Ranch is a lottery, not a Stretch button", "January is quiet and cold — that is the value window"]);
    replaceHotel("jackson_hole", "budget", ["Hampton Inn Jackson Hole — town Lean, grocery the first hour", "Holiday Inn Express Jackson — limited-service, skip a ski-in marketing rate on Lean", "The Hostel (Teton Village) — ski-season Lean if leftover is tight", "49’er Inn or a Motel 6-class in town — the bus exists", "April and November are mud season — that is the discount"]);
    replaceHotel("jackson_hole", "mid", ["The Wort Hotel — town square mid", "Snow King Resort — town hill, walkable", "Homewood Suites by Hilton Jackson — kitchenette mid if you will grocery ski dinners", "A Teton Village 3–4 star if skiing is the point", "Pick town or village. The pass commute is a winter line"]);
    replaceHotel("jackson_hole", "lux", ["Four Seasons Resort and Residences Jackson Hole — Teton Village leftover", "Amangani — East Gros Ventre leftover", "Hotel Terra Jackson Hole, Teton Village — Marriott Autograph Stretch", "Cloudveil or Caldera House — village leftover", "One base. Do not also book a Yellowstone in-park night without a transfer day"]);
    replaceHotel("phoenix", "budget", ["Hampton Inn & Suites Phoenix Downtown — limited-service, light rail downstairs", "Holiday Inn Express Phoenix Downtown — walk to Roosevelt", "Courtyard Phoenix Downtown — Marriott value, skip a Scottsdale resort parking fee", "HI Phoenix — hostel-plus on the rail", "Tempe limited-service on the rail if ASU / Mill is the night"]);
    replaceHotel("phoenix", "mid", ["Hyatt Regency Phoenix — Downtown, light rail", "Hilton Garden Inn Phoenix Downtown — mid, walk to Roosevelt Row", "Renaissance Phoenix Downtown Hotel — Marriott mid", "Hotel Palomar Phoenix — Kimpton, Downtown boutique if you want the arts pocket", "Do not split Scottsdale and Downtown in a 3-night stay unless leftover covers two bases"]);
    replaceHotel("phoenix", "lux", ["Arizona Biltmore, A Waldorf Astoria Resort — historic leftover, car assumed for dinner", "The Global Ambassador — Stretch", "JW Marriott Phoenix Desert Ridge Resort & Spa — north leftover, car assumed", "Winter weekends are peak; summer is the discount"]);
    replaceHotel("memphis", "budget", ["Hampton Inn & Suites Memphis Beale Street — limited-service, trolley, skip a Beale balcony on Lean", "Holiday Inn Memphis – Downtown (Beale St. Area) — walk to a trolley", "Sleep Inn Downtown or a South Main 2-star — grocery nearby", "The Guest House at Graceland only if Graceland is the whole trip", "A Midtown 2-star if Cooper-Young is the night you came for"]);
    replaceHotel("memphis", "mid", ["The Peabody Memphis — historic mid-plus, ducks", "Hu. Hotel Memphis — Hilton Tapestry, Downtown walk to Beale", "Central Station Hotel, Tribute Portfolio — Marriott, South Main mid", "Graduate Memphis — mid if leftover covers the campus-adjacent pocket"]);
    replaceHotel("memphis", "lux", ["The Peabody Memphis — leftover if the ducks are the point", "Graduate Memphis Stretch suite", "Hu. Hotel leftover suite", "One property. East Memphis is a car commute", "Barbecue-fest weekends lift rooms"]);
    replaceHotel("portland_me", "budget", ["Hampton Inn Portland Downtown – Waterfront — Old Port-adjacent limited-service", "Holiday Inn Express Portland — skip a jetport hotel unless you land late", "Inn at St. John or a West End 2-star — walk or a short bus to Old Port", "A hostel-plus or compact Downtown room — grocery nearby", "The Press Hotel is mid; Lean stays a block off the cobblestones"]);
    replaceHotel("portland_me", "mid", ["The Press Hotel, Autograph Collection — Marriott, Old Port mid", "Portland Harbor Hotel — water mid", "Hyatt Place Portland Old Port — mid, walk to dinner", "The Francis — boutique mid-plus", "A West End 3–4 star — quieter nights; this is not Portland, Oregon"]);
    replaceHotel("portland_me", "lux", ["The Francis leftover", "The Press Hotel Stretch suite", "Inn by the Sea (Cape Elizabeth) — leftover, car assumed", "One property", "January rooms are cheap because the harbor wind is real"]);
    replaceHotel("bar_harbor", "budget", ["Holiday Inn Express Ellsworth-Bar Harbor — gateway Lean only if leftover is tight; in-village is better", "Aurora Inn or Highbrook Motel class — walk or a short bus to the village", "A Mount Desert 2-star off the cruise-ship dock line", "A cabin court with a kitchenette — grocery the first hour", "Skip a winter-closed inn in January; many go dark"]);
    replaceHotel("bar_harbor", "mid", ["Bar Harbor Inn — walk-to-village mid", "West Street Hotel — harbor mid", "A Northeast Harbor 3-star if you want fewer cruise mornings", "Balance Rock Inn — quieter mid-plus", "One village. Do not commute from Ellsworth every dawn"]);
    replaceHotel("bar_harbor", "lux", ["Claremont Hotel — Southwest Harbor leftover", "Asticou Inn — Northeast Harbor Stretch", "West Street Hotel leftover suite", "One property", "Cruise-ship mornings crowd the village — hike early"]);
    replaceHotel("santa_fe", "budget", ["Hampton Inn Santa Fe — limited-service, short drive or walk toward the Plaza", "Holiday Inn Express Santa Fe — Lean courtyard, grocery nearby", "Santa Fe Motel & Inn or El Rey Court — classic courtyards", "A Railyard 2-star if that is the food pocket", "Skip an airport-adjacent Albuquerque room as this lodging"]);
    replaceHotel("santa_fe", "mid", ["Drury Plaza Hotel Santa Fe — mid, breakfast-in-rate if that is the product", "Hilton Santa Fe Historic Plaza — Plaza-adjacent mid", "La Fonda on the Plaza — walkable mid-plus", "Hotel Chimayo de Santa Fe — Plaza-adjacent boutique", "One pocket. Do not split Albuquerque and the Plaza in a 3-night stay"]);
    replaceHotel("santa_fe", "lux", ["Four Seasons Resort Rancho Encantado — Tesuque Stretch, car assumed", "Inn of the Five Graces — leftover", "Bishop’s Lodge, Auberge Resorts Collection — leftover", "One property", "Late fall after Market is the value window"]);
    replaceHotel("denver", "budget", ["Hampton Inn & Suites Denver Downtown — limited-service, light rail", "Holiday Inn Express Denver Downtown — skip a DIA hotel as this lodging", "Courtyard Denver Downtown — Marriott value, walk to the Mall", "HI Denver — hostel-plus if the party will share", "A RiNo 2-star if that is the restaurant pocket"]);
    replaceHotel("denver", "mid", ["Denver Marriott City Center — Downtown mid", "Hilton Denver City Center — walk to the 16th Street Mall", "Hyatt Regency Denver at Colorado Convention Center — one room not a suite", "The Westin Denver Downtown — mid, skip a mountain commute nightly", "The Crawford Hotel — Marriott Autograph, Union Station boutique if leftover covers it"]);
    replaceHotel("denver", "lux", ["The Ritz-Carlton, Denver — Downtown leftover", "Four Seasons Hotel Denver — Stretch", "Hotel Teatro — Downtown flagship", "One tower. The mountains are a day trip, not a second hotel", "January is cheap and icy"]);
    replaceHotel("charleston", "budget", ["Hampton Inn Charleston – Historic District — limited-service, walk or a short hop to King", "Holiday Inn Charleston Historic Downtown — Lean, skip a North Charleston cloverleaf", "Courtyard Charleston Historic District — Marriott value", "A downtown 2-star a few blocks off the Battery tourist row", "An inn-adjacent guesthouse if leftover is tight"]);
    replaceHotel("charleston", "mid", ["Francis Marion Hotel — Historic District mid", "HarbourView Inn — water mid", "The Dewberry Charleston — mid-plus", "Hyatt House Charleston / Historic District — kitchenette mid", "One pocket. Folly Beach is a different lodging night"]);
    replaceHotel("charleston", "lux", ["The Restoration — leftover", "Planters Inn — Stretch", "The Spectator Hotel — leftover", "One property. Spoleto weeks lift rooms", "August is cheap and humid"]);
    replaceHotel("savannah", "budget", ["Hampton Inn Savannah Historic District — limited-service, walk the squares", "Holiday Inn Express Savannah Historic District — Lean, skip an airport hotel", "Courtyard Savannah Downtown/Historic District — Marriott value", "A Historic District 2-star a square off the riverfront tourist row", "A hostel-plus if the party will share"]);
    replaceHotel("savannah", "mid", ["Hyatt Regency Savannah — riverfront mid", "The DeSoto Savannah — Hilton Historic District", "Marriott Savannah Riverfront — one pocket", "Kimpton Brice or a Historic District 4-star — squares walking", "One pocket. Tybee is a morning, not a second hotel"]);
    replaceHotel("savannah", "lux", ["The Perry Lane Hotel — leftover", "JW Marriott Savannah Plant Riverside — Stretch", "The Gastonian or a Historic Stretch inn", "One property. St. Patrick’s week is a crowd tax", "January is the value window"]);
    replaceHotel("asheville", "budget", ["Hampton Inn Asheville Downtown — limited-service, walk or a short hop to downtown", "Holiday Inn Express Asheville Downtown — skip a tunnel-road motel plus nightly Ubers", "A Downtown 2-star or Foundry-adjacent compact room", "A West Asheville 2-star if that is the restaurant pocket", "Skip a Biltmore-gate hotel on Lean unless that is the trip"]);
    replaceHotel("asheville", "mid", ["Kimpton Hotel Arras — Downtown 4-star", "Hilton Asheville Biltmore Park — mid if leftover covers the south campus", "The Foundry Hotel — Downtown boutique mid", "A Biltmore Village mid if leftover covers the estate", "October leaf weeks are peak"]);
    replaceHotel("asheville", "lux", ["Omni Grove Park Inn — leftover", "The Inn on Biltmore Estate — leftover", "One property. Do not also buy every spa add-on", "January is cheap and icy", "Leaf weeks are a crowd tax"]);
    replaceHotel("austin", "budget", ["Hampton Inn & Suites Austin Downtown/Convention Center — limited-service, skip a Domain cloverleaf", "Holiday Inn Express Austin Downtown — walk or a scooter is not a plan", "Courtyard Austin Downtown/Convention Center — Marriott value", "HI Austin — hostel-plus on a bus line", "An East Austin 2-star if that is the night you came for"]);
    replaceHotel("austin", "mid", ["Austin Marriott Downtown — one room not a suite", "Hilton Austin — convention / Downtown mid", "Fairmont Austin — mid-plus if leftover covers the water", "Hotel Van Zandt — Kimpton Rainey 4-star", "The LINE Austin — boutique if you want Downtown over a convention tower"]);
    replaceHotel("austin", "lux", ["The Driskill — historic leftover", "Fairmont Austin Stretch suite", "Hotel Saint Cecilia — leftover", "W Austin — Downtown flagship", "SXSW / ACL weeks are not the value window"]);
    replaceHotel("nashville", "budget", ["Hampton Inn & Suites Nashville Downtown — limited-service, skip a Broadway balcony on Lean", "Holiday Inn Express Nashville Downtown — walk off Broadway", "Courtyard Nashville Downtown — Marriott value", "A Downtown hostel-plus or a 2-star off Broadway", "An East Nashville 2-star if that is the night you came for"]);
    replaceHotel("nashville", "mid", ["Nashville Marriott at Vanderbilt University — mid, one pocket", "Hilton Nashville Downtown — walk off Broadway", "Hyatt Centric Downtown Nashville — Gulch-adjacent mid", "Graduate Nashville — Gulch 3–4 star", "The Gulch or East — pick one; CMA Fest weeks are not the value window"]);
    replaceHotel("nashville", "lux", ["The Hermitage Hotel — leftover", "Thompson Nashville — Hyatt Stretch", "Four Seasons Hotel Nashville — leftover", "Conrad Nashville — Stretch flagship", "January is the value window; bachelorette weekends lift rooms"]);
    replaceHotel("portland_oregon", "budget", ["Hampton Inn Portland Downtown Waterfront — limited-service, MAX, skip a Beaverton cloverleaf", "Holiday Inn Express Portland South — Lean only if leftover is tight; Downtown is the walk", "Courtyard Portland City Center — Marriott value, MAX / streetcar", "HI Portland — hostel-plus on MAX", "A Division 2-star if that is the food pocket — this is not Portland, Maine"]);
    replaceHotel("portland_oregon", "mid", ["Portland Marriott Downtown Waterfront — one room not a suite", "Hilton Portland Downtown — MAX adjacent", "Hyatt Regency Portland — Convention Center mid", "The Nines, a Luxury Collection Hotel — mid-plus", "The Hoxton Portland — boutique if you want Downtown over a convention tower"]);
    replaceHotel("portland_oregon", "lux", ["The Nines — leftover", "Canopy by Hilton Portland Pearl District — Stretch", "The Ritz-Carlton, Portland — leftover", "One property. Do not also buy every food-cart crawl as a taxi loop", "January rain is the discount"]);
    replaceHotel("scottsdale", "budget", ["Hampton Inn Scottsdale/Old Town area — limited-service, walk to dinner", "Holiday Inn Express Scottsdale Old Town — Lean, skip a Phoenix Downtown hotel as this lodging", "An Old Town 2-star — summer is cheap and dangerous-hot", "Motel 6-class only if leftover is tight and you have a car", "This is the resort-adjacent product — Phoenix is a different lodging math"]);
    replaceHotel("scottsdale", "mid", ["Hotel Valley Ho — mid-century mid", "Andaz Scottsdale Resort & Bungalows — Hyatt resort mid", "Hilton Scottsdale Resort & Villas — mid campus", "Westin Kierland Resort & Spa — north mid-plus", "An Old Town 3–4 star — one pocket; do not split Sedona without a transfer day"]);
    replaceHotel("scottsdale", "lux", ["The Phoenician, a Luxury Collection Resort — leftover", "Four Seasons Resort Scottsdale at Troon North — leftover", "Sanctuary Camelback Mountain — leftover", "The Canyon Suites at The Phoenician — Stretch campus", "June rooms are cheap because the air hurts"]);
    replaceHotel("kauai", "budget", ["Hilton Garden Inn Kauai Wailua Bay — east-side Lean, grocery the first hour", "Holiday Inn Express Kauai — limited-service if leftover is tight", "A Kapaa 2-star or studio condo — kitchen beats resort breakfast", "A Poipu value condo a block off the sand", "Skip a North Shore rate on Lean; the drive is the hidden cost"]);
    replaceHotel("kauai", "mid", ["Sheraton Kauai Resort — Poipu mid, walk-to-beach", "Marriott’s Kaua'i Beach Club or Kauai Marriott Resort — Kalapaki mid", "A Kapaa 4-star if you want cheaper dinners", "A Poipu condo-plus — kitchen still wins some dinners", "One shore. North Shore mid only if leftover covers the drive"]);
    replaceHotel("kauai", "lux", ["Grand Hyatt Kauai Resort & Spa — Poipu Stretch", "1 Hotel Hanalei Bay — North Shore leftover", "Koa Kea Hotel & Resort — Poipu leftover if Grand Hyatt is sold", "One shore. Do not also book every helicopter", "Na Pali is a boat or a hard hike, not both"]);
    replaceHotel("hawaii_big_island", "budget", ["Hampton Inn & Suites Kona — limited-service, grocery the first hour", "Holiday Inn Express Kailua-Kona — walk-adjacent Lean", "A Kailua-Kona 2-star or studio condo — kitchen is the Lean product", "A Hilo 2-star only if volcano mornings are the point", "Skip a Kohala resort rate on Lean"]);
    replaceHotel("hawaii_big_island", "mid", ["Courtyard King Kamehameha's Kona Beach Hotel — Marriott, town mid", "Royal Kona Resort — walk-to-town mid", "Outrigger Kona Resort & Spa at Keauhou — south-town mid", "A Waikoloa condo-plus if leftover covers the Kohala drive", "One coast. Hilo plus Kona nightly is a transfer tax"]);
    replaceHotel("hawaii_big_island", "lux", ["Four Seasons Resort Hualalai — Kohala leftover", "Mauna Lani, Auberge Resorts Collection — Stretch", "Fairmont Orchid — Kohala leftover", "The Westin Hapuna Beach Resort — Hyatt-adjacent Stretch if leftover is the beach", "One campus. Do not also book every helicopter and snorkel"]);
    replaceHotel("yellowstone", "budget", ["Holiday Inn West Yellowstone — gateway Lean, grocery the first hour", "Hampton Inn West Yellowstone — limited-service if leftover covers it", "A Gardiner 2-star if the north gate is the plan", "Old Faithful Lodge cabin class if you booked early", "Skip a Jackson hotel as this lodging"]);
    replaceHotel("yellowstone", "mid", ["Old Faithful Inn or Lake Yellowstone Hotel — in-park mid if leftover covers it", "Canyon Lodge mid — in-park", "Best Western Desert Inn West Yellowstone — gateway mid if in-park is sold", "A West Yellowstone 3-star — one gate", "Grand Teton is a different lodging night"]);
    replaceHotel("yellowstone", "lux", ["Old Faithful Inn leftover — historic Stretch", "Lake Yellowstone Hotel Stretch suite", "One park base", "Do not also buy every snowcoach in summer", "Winter is a different product"]);
    replaceHotel("national_parks_southwest", "budget", ["Holiday Inn Express Springdale – Zion National Park Area — if Zion is the lead", "Hampton Inn & Suites Springdale Zion National Park — gateway Lean", "A Moab motel if Arches / Canyonlands is the lead — Holiday Inn Express Moab", "A Kanab 2-star if you are looping", "Skip a Las Vegas hotel as this lodging"]);
    replaceHotel("national_parks_southwest", "mid", ["Cable Mountain Lodge or a Springdale mid — Zion walking", "Hyatt Place Moab / Courtyard Moab — if Arches is the lead", "Best Western Plus Bryce Canyon Grand — if Bryce is the lead", "One gateway. Do not sleep in three towns in three nights", "A car is the plan"]);
    replaceHotel("national_parks_southwest", "lux", ["Zion Lodge leftover — in-park if it exists and you booked months out", "Amangiri is a different budget", "A design desert Stretch in one gateway", "One base. Do not also buy every slot-canyon lottery as a sure thing", "Summer is brutally hot"]);
    replaceHotel("smoky_mountains", "budget", ["Hampton Inn Gatlinburg — limited-service off the main drag", "Holiday Inn Express Pigeon Forge — if the shows are the point", "A Gatlinburg 2-star off the strip", "A cabin with a kitchen if the party will cook", "Skip a downtown balcony on Lean; October leaf weeks double rooms"]);
    replaceHotel("smoky_mountains", "mid", ["The Park Vista, a Tribute Portfolio Hotel — Gatlinburg 3–4 star", "Hilton Garden Inn Gatlinburg Downtown — mid, still a car for the park", "A cabin mid with a kitchen", "A Townsend quieter mid if leftover covers the quiet", "One town. Cades Cove is a morning, not a second hotel"]);
    replaceHotel("smoky_mountains", "lux", ["A luxury cabin leftover — one base", "The Park Vista Stretch suite", "LeConte Lodge is a hike lottery, not a Stretch button", "Do not also buy every show", "January is cheap and icy"]);
    replaceHotel("nola", "budget", ["Hampton Inn & Suites New Orleans Convention Center — Warehouse District, streetcar", "Holiday Inn New Orleans – Downtown Superdome — limited-service, skip a Bourbon balcony on Lean", "Courtyard New Orleans Downtown/Convention Center — Marriott value", "HI New Orleans — hostel-plus, streetcar not a Bourbon balcony", "The Drifter or a Mid-City motel-plus — Canal streetcar to the Quarter"]);
    replaceHotel("nola", "mid", ["New Orleans Marriott — Canal, walk or streetcar", "Hilton New Orleans Riverside — Convention Center mid", "The Westin New Orleans — Canal mid", "Omni Royal Orleans — Quarter if you accept the premium", "Hotel Peter and Paul — Marigny boutique if leftover covers the walk to dinner"]);
    replaceHotel("nola", "lux", ["Windsor Court Hotel — CBD leftover", "The Roosevelt New Orleans, A Waldorf Astoria Hotel — Stretch", "Hotel Monteleone — Quarter flagship leftover", "Four Seasons Hotel New Orleans — leftover", "The trip is the food, not a second courtyard suite"]);
    replaceHotel("cancun", "budget", ["Riu Cancún or Riu Palace Peninsula — Hotel Zone, walk the strip", "Holiday Inn Resort Cancún — Hotel Zone value, garden view on purpose", "Hampton Inn by Hilton Cancun Cumbres — mainland Lean only if you will eat out", "Oasis or Krystal Grand class — all-inclusive, no swim-up-suite upsell", "Downtown Cancún 3-star if you will eat out — cheaper room, you give up the AI beach"]);
    replaceHotel("cancun", "mid", ["Hyatt Ziva Cancún — Hotel Zone, family-friendly, real beach", "Marriott Cancun Resort — Hotel Zone mid, points-friendly if leftover covers a non-AI week", "Hilton Cancun, an All-Inclusive Resort — Hotel Zone mid", "Moon Palace or Hard Rock Cancún — all-inclusive, watch the transfer add-on", "Live Aqua or Secrets The Vine — adults-only mid if there are no kids"]);
    replaceHotel("cancun", "lux", ["Hyatt Zilara Cancún — adults-only Hotel Zone", "Le Blanc Spa Resort Cancún — Stretch only if leftover is real", "JW Marriott Cancun Resort & Spa — Hotel Zone leftover", "Nizuc or Rosewood Mayakobá — south of the Zone; a different transfer", "One property. Two resorts in a week is a transfer tax"]);
    replaceHotel("punta_cana", "budget", ["Riu Republic or Riu Bávaro — all-inclusive, beach shuttle on property", "Holiday Inn Resort Punta Cana — Bávaro value, confirm the transfer is in the rate", "Bávaro Princess or Catalonia Bávaro — family value, skip Cap Cana", "Grand Palladium-adjacent value — garden view on purpose", "Skip Cap Cana on Lean; Bávaro is the value beach"]);
    replaceHotel("punta_cana", "mid", ["Hard Rock Hotel Punta Cana — family mid, huge campus", "Iberostar Selection Bávaro — all-inclusive, beach", "Westin Puntacana Resort & Club — Marriott mid if leftover covers a non-full-AI week", "Mid stays in Bávaro — Cap Cana and Hyatt Ziva are leftover-adjacent"]);
    replaceHotel("punta_cana", "lux", ["Excellence Punta Cana or Secrets Cap Cana — adults-only leftover", "Eden Roc at Cap Cana — Stretch villa class", "Sanctuary Cap Cana — same pocket, not a second island hop", "Hyatt Zilara Cap Cana — adults-only Stretch", "One Cap Cana or Bávaro campus. A second resort hop is a transfer tax"]);
    replaceHotel("jamaica", "budget", ["Holiday Inn Resort Montego Bay — closer to the airport, lesser beach", "Riu Negril — Seven Mile Beach, value AI", "Riu Montego Bay class — value AI if you will not transfer to Negril", "Legends or a Negril 3-star walk-to-beach — skip the MoBay hotel restaurant", "Price the transfer as its own line; Negril is not next to the runway"]);
    replaceHotel("jamaica", "mid", ["Hilton Rose Hall Resort & Spa — MoBay side, shorter transfer", "Hyatt Ziva Rose Hall — family mid", "Iberostar Rose Hall — all-inclusive mid", "Moon Palace Jamaica — all-inclusive mid", "Couples Swept Away or a Negril 4-star — beach, adults or family by brand"]);
    replaceHotel("jamaica", "lux", ["Sandals South Coast or Sandals Montego Bay — couples AI leftover", "Hyatt Zilara Rose Hall — adults-only Stretch", "Round Hill Hotel and Villas — villa stretch, MoBay side", "Half Moon — Stretch, MoBay side", "Rockhouse or a Negril cliff boutique — leftover, not a fake rate"]);
    replaceHotel("cabo", "budget", ["Holiday Inn Resort Los Cabos — Corridor value, garden view on purpose", "Hampton Inn by Hilton Los Cabos — San José-adjacent Lean if you will eat in town", "Downtown Cabo 3-star — walk to Medano", "A Corridor 3-star garden view — skip a sunset-cruise hotel on Lean", "Timeshare pitches are a half-day tax"]);
    replaceHotel("cabo", "mid", ["Hilton Los Cabos Beach & Golf Resort — Corridor mid", "Hyatt Ziva Los Cabos — family mid", "ME Cabo or a Medano 4-star if town walking is the point", "A Medano 4-star — walk-to-beach mid", "Adults-only mid if there are no kids — one pocket"]);
    replaceHotel("cabo", "lux", ["Waldorf Astoria Los Cabos Pedregal — leftover", "The Cape, a Thompson Hotel — Hyatt Stretch", "Chileno Bay Resort & Residences, Auberge — leftover", "One property. Do not also buy every sunset sail", "September is cheap and humid"]);
    replaceHotel("aruba", "budget", ["Riu Palace Antillas-adjacent value — Palm Beach garden view", "Holiday Inn Resort Aruba — Palm Beach value", "A Palm Beach 3-star garden view — skip a timeshare pitch day", "Oranjestad 2-star if you will eat out", "Confirm the transfer"]);
    replaceHotel("aruba", "mid", ["Hyatt Regency Aruba Resort, Spa and Casino — Palm Beach mid", "Hilton Aruba Caribbean Resort & Casino — same strip", "Marriott's Aruba Surf Club or Aruba Marriott Resort — points mid", "Adults-only 4-star if there are no kids", "One strip. Transfer in the rate"]);
    replaceHotel("aruba", "lux", ["Adults-only Palm Beach leftover — Hyatt or Hilton suite jump", "The Ritz-Carlton, Aruba — Stretch", "A villa Stretch — one resort", "Do not also buy every sunset sail", "September is cheap for a reason — heat, not storms"]);
    replaceHotel("bahamas", "budget", ["Holiday Inn Nassau — downtown value, ferry to the beaches", "A Cable Beach value AI — garden view on purpose", "Downtown Nassau 3-star — ferry to the beaches", "Skip Atlantis on Lean unless that is the trip", "Confirm the transfer"]);
    replaceHotel("bahamas", "mid", ["Baha Mar mid class — Cable Beach", "Grand Hyatt Baha Mar — mid if leftover covers the campus", "Atlantis Coral / Royal — mid if leftover covers the water-park math", "Cable Beach 4-star AI — one island pocket", "Transfer in the rate"]);
    replaceHotel("bahamas", "lux", ["The Coral at Atlantis suite leftover", "Grand Hyatt Baha Mar Stretch", "Rosewood Baha Mar leftover", "One campus. The water park is a day-price", "Do not also buy every excursion"]);
    replaceHotel("turks_caicos", "budget", ["Sibonné or a Grace Bay 3-star garden view", "Coral Gardens class — walk to the sand", "A 2-star on Leeward if leftover is tight", "Skip a villa on Lean", "Confirm the transfer is in the rate"]);
    replaceHotel("turks_caicos", "mid", ["The Palms Turks and Caicos or The Somerset — Grace Bay 4-star", "Beaches Turks & Caicos — family mid-plus", "Wymara Resort & Villas — Grace Bay mid", "A Grace Bay Club-adjacent 4-star — adults-only mid if there are no kids", "One beach"]);
    replaceHotel("turks_caicos", "lux", ["COMO Parrot Cay leftover", "Amanyara Stretch", "Grace Bay Club leftover", "One island", "Do not also buy every excursion"]);
    replaceHotel("tulum", "budget", ["Downtown Tulum 2-star or a hostel-plus — bike is the Lean car", "Aldea Zama limited-service — Holiday Inn-class if you find one", "A beach-road 3-star only if leftover covers the jungle tax", "Skip a hotel-zone timeshare day", "Confirm the transfer"]);
    replaceHotel("tulum", "mid", ["A beach-road 4-star eco mid — one property", "Dreams Tulum or a family AI mid if leftover covers it", "Aldea Zama 3–4 star if town is the point", "Adults-only mid if there are no kids", "The beach road is a transfer every dinner if you slept town"]);
    replaceHotel("tulum", "lux", ["Be Tulum or a beach-road Stretch leftover", "Azulik is a different product", "One property", "Do not also buy every cenote as a taxi loop", "Sargassum weeks are not a discount you want to win"]);
    replaceHotel("st_lucia", "budget", ["A Rodney Bay 3-star garden view — value, confirm the transfer", "Coconut Bay or a south-island value AI if leftover is tight", "A Castries 2-star only the night you fly", "Skip a piton-view suite on Lean", "The transfer is a mountain line"]);
    replaceHotel("st_lucia", "mid", ["A Rodney Bay 4-star or Coconut Bay mid — one pocket", "A Rodney Bay 4-star — one pocket", "Adults-only mid if there are no kids", "One valley. Soufrière is a different transfer", "Transfer in the rate"]);
    replaceHotel("st_lucia", "lux", ["Jade Mountain leftover", "Sugar Beach, A Viceroy Resort — Stretch", "Sandals Grande St. Lucian leftover", "One property", "Do not also buy every zip-line"]);
    replaceHotel("puerto_rico", "budget", ["Hampton Inn & Suites San Juan — Condado-adjacent Lean", "Holiday Inn Express San Juan Condado — limited-service, walk or a short hop to the beach", "A Condado 2-star a block off the sand", "Old San Juan guesthouse — walk the walls, louder nights", "Skip an Isla Verde airport hotel unless you land late"]);
    replaceHotel("puerto_rico", "mid", ["San Juan Marriott Resort & Stellaris Casino — Condado mid", "La Concha Renaissance San Juan — Marriott, Condado walk", "Condado Vanderbilt Hotel — mid-plus", "Hyatt Place San Juan / City Center — if leftover is tight for mid", "One pocket. El Yunque is a morning, not a second hotel"]);
    replaceHotel("puerto_rico", "lux", ["Condado Vanderbilt leftover", "St. Regis Bahia Beach Resort — Stretch, car assumed", "Dorado Beach, A Ritz-Carlton Reserve — leftover", "One property", "Do not also buy every bioluminescent-bay tour as a sure night"]);
    replaceHotel("us_virgin_islands", "budget", ["A Charlotte Amalie 3-star or Red Hook value inn", "A St. John 2-star / guest house if the ferry is the plan", "A Cruz Bay inn — grocery the first hour", "Skip a villa on Lean", "Confirm the ferry or transfer"]);
    replaceHotel("us_virgin_islands", "mid", ["The Westin St. John Resort Villas — mid if leftover covers St. John", "A Charlotte Amalie 4-star on the south shore", "A St. Thomas 4-star on the south shore", "One island. St. John plus St. Thomas nightly is a ferry tax", "Transfer in the rate"]);
    replaceHotel("us_virgin_islands", "lux", ["Caneel Bay is a rebuild story — Stretch is a St. John villa leftover", "The Ritz-Carlton, St. Thomas — leftover", "One island", "Do not also buy every day-sail", "Hurricane weeks are not a discount you want to win"]);
    replaceHotel("amsterdam", "budget", ["Ibis Amsterdam Centre — tram to the canal belt, pack light", "Ibis Budget Amsterdam City South or Sloterdijk — tram to the center", "Holiday Inn Express Amsterdam – Sloterdijk — Lean if leftover is tight", "Generator Amsterdam or ClinkNOORD — hostel-plus, walk or ferry", "Hotel Not Hotel or a De Pijp 2-star — neighborhood, stairs are the elevator"]);
    replaceHotel("amsterdam", "mid", ["Amsterdam Marriott Hotel — Leidseplein-adjacent mid", "Hilton Amsterdam — Apollolaan, tram mid", "Hyatt Regency Amsterdam — mid, one neighborhood", "Hotel Casa Amsterdam — De Pijp boutique-adjacent 4-star", "A Jordaan 3–4 star — canal walk without the garden rate"]);
    replaceHotel("amsterdam", "lux", ["Waldorf Astoria Amsterdam — leftover", "De L’Europe Amsterdam — one flagship", "Conservatorium Hotel — Museumplein leftover", "Hotel Pulitzer, a Luxury Collection Hotel — canal houses stitched together", "Skip King’s Day and August if you can"]);
    replaceHotel("barcelona", "budget", ["Ibis Barcelona Centro — Eixample, Metro downstairs", "Holiday Inn Express Barcelona – City 22@ — Metro, skip Las Ramblas addresses on Lean", "Generator Barcelona — hostel-plus, Gràcia / Gothic", "Hotel Jazz or a 2-star Eixample — walk to Passeig de Gràcia", "El Born guesthouse — restaurants on the block"]);
    replaceHotel("barcelona", "mid", ["Hilton Diagonal Mar Barcelona — Metro mid if leftover covers the beach-edge pocket", "Hotel Indigo Barcelona – Plaza Catalunya — Eixample mid", "H10 Casa Mimosa or Cotton House — Eixample, Metro in five minutes", "One neighborhood — Born or Eixample, not both"]);
    replaceHotel("barcelona", "lux", ["W Barcelona — Barceloneta beach premium", "Mandarin Oriental Barcelona — Passeig de Gràcia leftover", "Hotel Arts Barcelona — one flagship", "El Palace Hotel Barcelona — leftover", "Beach-club pricing is not in the room rate"]);
    replaceHotel("lisbon", "budget", ["Ibis Lisboa Centro Liberdade or Ibis Styles Lisboa Centro — Metro, bakery downstairs", "Holiday Inn Express Lisbon – Plaza Saldanha — Lean if leftover is tight", "Home Lisbon Hostel or a Baixa-adjacent hostel-plus — walk to a tram", "The Independente or Intendente 2-star — neighborhood restaurants", "Alfama guesthouse — views, stairs, grocery the first morning"]);
    replaceHotel("lisbon", "mid", ["Lisbon Marriott Hotel — mid if leftover covers the uptown pocket", "Hotel da Baixa or a 4-star near Rossio — trains and trams", "Memmo Príncipe Real or a Chiado 3–4 star — walk downhill to dinner", "LX Boutique or a Cais do Sodré 3-star — river, nightlife on the block", "One neighborhood. Do not change hills nightly"]);
    replaceHotel("lisbon", "lux", ["Four Seasons Hotel Ritz Lisbon — park-adjacent leftover", "Bairro Alto Hotel — Chiado leftover", "Tivoli Avenida Liberdade Lisboa — one boulevard", "Olissippo Lapa Palace — Stretch", "Lisbon mid already feels like a Stretch in Paris"]);
    replaceHotel("prague", "budget", ["Ibis Praha Wenceslas Square — Metro, skip a castle-view rate on Lean", "Holiday Inn Prague Congress Centre — Metro Lean", "Moxy Prague — Marriott compact if leftover covers a central pocket", "Generator Prague or a Vinohrady hostel-plus", "A 2-star walk-up near a tram and a bakery"]);
    replaceHotel("prague", "mid", ["Hilton Prague — Karlín / river mid", "Prague Marriott Hotel — Old Town-adjacent mid", "Hotel Indigo Prague Old Town — IHG, walkable mid", "A Vinohrady 3–4 star — restaurants on the block", "One neighborhood. The castle is a morning, not a second hotel"]);
    replaceHotel("prague", "lux", ["Four Seasons Hotel Prague — river leftover", "Augustine, a Luxury Collection Hotel — Malá Strana Stretch", "Mandarin Oriental, Prague — leftover", "One flagship", "Christmas weeks lift rooms"]);
    replaceHotel("dublin", "budget", ["Ibis Dublin City Centre or Ibis Styles Dublin City Centre — walk or LUAS", "Holiday Inn Express Dublin City Centre — Lean, skip an airport hotel", "Generator Dublin — hostel-plus", "A Temple Bar-adjacent 2-star a block off the tourist row", "A Smithfield 2-star if that is the pocket"]);
    replaceHotel("dublin", "mid", ["The Westin Dublin — College Green mid", "Conrad Dublin — mid-plus", "Hilton Garden Inn Dublin Custom House — river mid", "A Georgian 3–4 star south of the Liffey", "One neighborhood. Rugby / concert weeks lift rooms"]);
    replaceHotel("dublin", "lux", ["The Merrion Hotel — leftover", "The Shelbourne, Autograph Collection — Stretch", "The Westbury — leftover", "One property", "Do not also buy every Guinness-and-castle stack"]);
    replaceHotel("edinburgh", "budget", ["Ibis Edinburgh Centre Royal Mile – Hunter Square — walk the Mile, skip a castle-view rate on Lean", "Holiday Inn Express Edinburgh – Royal Mile — limited-service", "Premier Inn Edinburgh Central — Lean compact", "A hostel-plus on the Cowgate or Leith Walk", "A Leith 2-star if that is the restaurant pocket"]);
    replaceHotel("edinburgh", "mid", ["The Balmoral — mid-plus if leftover covers it; otherwise a New Town 4-star", "Waldorf Astoria Edinburgh - The Caledonian — mid-plus", "Kimpton Charlotte Square — New Town mid", "A Grassmarket or New Town 3–4 star — one pocket", "Festival weeks are not the value window"]);
    replaceHotel("edinburgh", "lux", ["The Balmoral leftover", "Waldorf Astoria Edinburgh - The Caledonian Stretch suite", "Gleneagles is a different trip", "One property", "August Festival is a crowd tax"]);
    replaceHotel("florence", "budget", ["Ibis Firenze Centro or Ibis Styles Firenze — walk or bus, pack light", "A Santa Croce or San Lorenzo 2-star — bakery downstairs", "A hostel-plus near Santa Maria Novella if you arrive by train", "Skip an airport hotel as this lodging", "Hotel Indigo Florence is mid; Lean stays Ibis or a walk-up"]);
    replaceHotel("florence", "mid", ["Hotel Indigo Florence — IHG, walkable mid", "Hilton Garden Inn Florence Novoli — only if leftover is tight; centro is the walk", "NH Collection Firenze Palazzo Gaddi — centro mid", "A Oltrarno 3–4 star — one neighborhood", "The Duomo is a morning, not a hotel address tax"]);
    replaceHotel("florence", "lux", ["Four Seasons Hotel Firenze — leftover", "Portrait Firenze — Stretch", "Hotel Savoy, a Rocco Forte Hotel — leftover", "One property", "Do not also buy every skip-the-line as a sure interior"]);
    replaceHotel("amalfi", "budget", ["Ibis Styles Sorrento if you base in Sorrento — stairs, pack light", "A Centro 2-star in Amalfi or Maiori — ferry or bus, not a car habit", "A Sorrento 3-star a block off the corso — stairs, pack light", "A Positano 2-star only if leftover is real; stairs are the elevator", "Skip a cliff suite on Lean"]);
    replaceHotel("amalfi", "mid", ["Hilton Sorrento Palace — Sorrento mid, bus or ferry to Amalfi towns", "NH Collection Grand Hotel Convento di Amalfi — mid-plus", "A Positano 3–4 star if that village is the point", "One town. Amalfi plus Positano plus Ravello nightly is three parking lots", "The ferry is the plan in season"]);
    replaceHotel("amalfi", "lux", ["Hotel Santa Caterina — Amalfi leftover", "Le Sirenuse — Positano Stretch", "Belmond Hotel Caruso — Ravello leftover", "One village", "July–August is a crowd tax"]);
    replaceHotel("greece_athens", "budget", ["Ibis Styles Athens and Ibis Budget Athens — Metro, skip a Plaka tourist-menu hotel", "An airport hotel only the night you fly — then own a Metro neighborhood", "A Koukaki 2-star — walk to the Acropolis Museum", "A hostel-plus in Psyri or Monastiraki", "Islands are a different lodging night"]);
    replaceHotel("greece_athens", "mid", ["Athens Marriott Hotel — mid if leftover covers the uptown pocket", "A Plaka-adjacent 3–4 star — walk to the museum", "A Syntagma 4-star — one neighborhood", "A Koukaki boutique — walk to the museum", "One neighborhood"]);
    replaceHotel("greece_athens", "lux", ["Hotel Grande Bretagne, a Luxury Collection Hotel — Syntagma leftover", "Hotel King George, a Luxury Collection Hotel — Stretch", "Four Seasons Astir Palace — coast leftover, a different commute", "One property", "Do not also buy every island hop as a sure day trip"]);
    replaceHotel("santorini", "budget", ["A Fira 2-star a block off the caldera edge — Lean, pack light", "A Perissa or Kamari 2-star on the bus grid — beach Lean", "Skip a cave suite on Lean", "Confirm the transfer from the port or airport", "Oia is mid-plus"]);
    replaceHotel("santorini", "mid", ["A Fira 3–4 star — walk to the bus, one village", "A Kamari 4-star if the beach is the point", "Mid stays off the first caldera row — Canaves is leftover", "One village. Fira plus Oia nightly is a transfer", "Ferry days need slack"]);
    replaceHotel("santorini", "lux", ["Canaves Oia leftover", "Mystique, a Luxury Collection Hotel — Stretch", "Grace Hotel Santorini, Auberge — leftover", "One village", "August is a crowd tax"]);
    replaceHotel("copenhagen", "budget", ["Ibis Copenhagen City or Ibis Styles Copenhagen — Metro, bakery downstairs", "Wakeup Copenhagen — compact Lean", "Generator Copenhagen — hostel-plus", "A Nørrebro 2-star if that is the restaurant pocket", "Skip an airport hotel as this lodging"]);
    replaceHotel("copenhagen", "mid", ["Copenhagen Marriott Hotel — harbor mid", "Hilton Copenhagen Airport is a transfer; mid in-town is NH Collection Copenhagen", "NH Collection Copenhagen — mid", "A Vesterbro 3–4 star — one neighborhood", "July is peak and bright"]);
    replaceHotel("copenhagen", "lux", ["Hotel d'Angleterre — leftover", "Nimb Hotel — Stretch", "Villa Copenhagen — leftover", "One property", "Christmas weeks lift rooms"]);
    replaceHotel("vienna", "budget", ["Ibis Wien Mariahilf or Ibis Styles Wien City — U-Bahn, bakery downstairs", "Holiday Inn Express Vienna – Schönbrunn — Lean if leftover is tight", "A Neubau or Mariahilf 2-star — walk to a market street", "A hostel-plus near the Westbahnhof", "Skip an airport hotel as this lodging"]);
    replaceHotel("vienna", "mid", ["Vienna Marriott Hotel — Ring mid", "Hilton Vienna Park — Stadtpark mid", "Hotel Indigo Vienna – Naschmarkt — IHG, walkable mid", "A 7th-district 3–4 star — one neighborhood", "The Ring is a walk, not a hotel-address tax every night"]);
    replaceHotel("vienna", "lux", ["Hotel Sacher Wien — leftover", "The Ritz-Carlton, Vienna — Stretch", "Park Hyatt Vienna — leftover", "One property", "Ball season and Christmas weeks lift rooms"]);
    replaceHotel("stockholm", "budget", ["Ibis Styles Stockholm Odenplan or Ibis Stockholm Solna — T-bana", "Generator Stockholm — hostel-plus", "A Södermalm 2-star if that is the restaurant pocket", "A compact Norrmalm 2-star — grocery nearby", "Skip an Arlanda hotel as this lodging"]);
    replaceHotel("stockholm", "mid", ["Stockholm Marriott Hotel — mid", "Hilton Stockholm Slussen — Södermalm mid", "Hotel At Six or a Norrmalm 4-star", "A Södermalm 3–4 star — one island", "Do not hop Gamla Stan addresses nightly"]);
    replaceHotel("stockholm", "lux", ["Grand Hôtel Stockholm — leftover", "Ett Hem — Stretch", "Nobis Hotel Stockholm — leftover", "One property", "Midsummer weeks are a plan, not a discount"]);
    replaceHotel("budapest", "budget", ["Ibis Budapest City or Ibis Styles Budapest City — Metro, skip a castle-view rate on Lean", "Holiday Inn Budapest – Budaörs is a commute; Lean is a District VII 2-star", "A Jewish Quarter 2-star — walk to dinner", "A hostel-plus near the Astoria Metro", "Pest walking beats a Buda hill taxi habit"]);
    replaceHotel("budapest", "mid", ["Budapest Marriott Hotel — Danube mid", "Hilton Budapest — Castle Hill mid-plus if leftover covers the hill", "A District V 3–4 star — one neighborhood", "A ruin-bar-adjacent 4-star in VII", "The baths are a ticket, not a hotel requirement"]);
    replaceHotel("budapest", "lux", ["Four Seasons Hotel Gresham Palace — leftover", "The Ritz-Carlton, Budapest — Stretch", "Aria Hotel Budapest, a Tribute Portfolio Hotel — leftover", "One property", "Christmas weeks lift rooms"]);
    replaceHotel("iceland", "budget", ["Kex Hostel or Loft — 101 Reykjavík, walk to the pool", "A 101 guesthouse with a kitchenette — breakfast is Bónus, not the buffet", "Keflavík Airport Hotel — only the night you land or fly", "A compact 101 2-star — walk to the pool", "The Ring Road is a different trip and budget"]);
    replaceHotel("iceland", "mid", ["Canopy by Hilton Reykjavik City Centre — 101 mid", "Reykjavik Konsulat Hotel, Curio Collection — Hilton mid", "Hotel Borg — 101, walk downtown", "ION City or a harbor 4-star — still not the Blue Lagoon hotel", "Selfoss or Vík mid only if this is a road trip"]);
    replaceHotel("iceland", "lux", ["The Reykjavik EDITION — 101 leftover", "The Retreat at Blue Lagoon — soak + room, Stretch only", "ION Adventure Hotel — Golden Circle leftover", "One 101 flagship or one countryside lodge — not both in 4 nights", "Luxury here is the soak, not the minibar"]);
    replaceHotel("switzerland", "budget", ["Ibis Zürich City West or Ibis Budget Genève — train downstairs", "Holiday Inn Express Zürich – Airport is a transfer; Lean is a city 2-star near the HB", "A hostel-plus near the Hauptbahnhof", "A 2-star in the neighborhood you will eat in", "Long-haul is the expensive line, not a palace breakfast"]);
    replaceHotel("switzerland", "mid", ["Zürich Marriott Hotel — mid", "Hilton Zurich Airport is a transfer; mid in-town is a 4-star near the lake or HB", "A lake-adjacent 4-star — one city; Alps lodges are a different night", "A Geneva 4-star near Cornavin if Geneva is the base", "One city. Alps lodges are a different night"]);
    replaceHotel("switzerland", "lux", ["Baur au Lac leftover", "The Dolder Grand — Stretch", "Four Seasons Hotel des Bergues Geneva — leftover if Geneva is the base", "One property", "Do not also buy every mountain add-on"]);
    replaceHotel("croatia", "budget", ["A Split or Dubrovnik 2-star off the wall — pack light", "A Split Old Town-adjacent 2-star — walk, pack light", "A Dubrovnik Lapad 2-star — bus to the walls", "Skip a wall-view suite on Lean", "Islands are a ferry night"]);
    replaceHotel("croatia", "mid", ["Hilton Imperial Dubrovnik — mid if Dubrovnik is the base", "Hotel Excelsior Dubrovnik — mid-plus", "A Split 3–4 star near the Riva", "One city. Split plus Dubrovnik nightly is a transfer day", "Cruise mornings crowd the walls"]);
    replaceHotel("croatia", "lux", ["Villa Dubrovnik leftover", "Hotel Bellevue Dubrovnik — Stretch", "One property", "Do not also buy every island hop", "July–August is a crowd tax"]);
    replaceHotel("spain_seville", "budget", ["Ibis Sevilla or Ibis Budget Sevilla — tram / bus, bakery downstairs", "Holiday Inn Express Sevilla – Aljarafe is a commute; Lean is a Centro 2-star", "A Santa Cruz-adjacent 2-star a block off the postcard alleys", "A hostel-plus near Plaza de Armas", "Skip a cathedral-view rate on Lean"]);
    replaceHotel("spain_seville", "mid", ["Hotel Indigo Seville – Historic Quarter — walkable mid", "NH Collection Sevilla — mid", "A Triana 3–4 star — one neighborhood", "The Alcázar is a timed morning, not a hotel address"]);
    replaceHotel("spain_seville", "lux", ["Hotel Alfonso XIII, a Luxury Collection Hotel — leftover", "Hotel Palacio Villapanés — Stretch", "One property", "Feria and Easter weeks are a crowd tax", "July is cheap and brutal"]);
    replaceHotel("portugal_porto", "budget", ["Ibis Porto Centro São Bento or Ibis Porto São João — Metro / train", "InterContinental Porto – Palacio das Cardosas — mid-plus; Lean stays Ibis", "A Cedofeita 2-star — restaurants on the block", "A hostel-plus near São Bento", "Hills + cobbles; pack light"]);
    replaceHotel("portugal_porto", "mid", ["A Ribeira 3–4 star or Hotel Infante Sagres-adjacent — walk downhill to dinner", "A Baixa / Aliados 4-star — walk downhill to dinner", "A Gaia 3–4 star if the caves are the point", "One bank of the river at night", "Lisbon is a different lodging night"]);
    replaceHotel("portugal_porto", "lux", ["The Yeatman leftover", "Pestana Palácio do Freixo — Stretch", "One property", "Do not also buy every cave tasting as a taxi loop", "São João weeks lift rooms"]);
    replaceHotel("portugal_algarve", "budget", ["Holiday Inn Algarve – Monte Gordo-class or an Albufeira 2-star off the strip", "A Lagos 2-star — walk to a grocery", "A Tavira 2-star if the east is the point", "Skip a cliff suite on Lean", "A car helps; the train is slower and cheaper"]);
    replaceHotel("portugal_algarve", "mid", ["Tivoli or a Vilamoura 4-star — mid if leftover covers the marina pocket", "A Lagos 3–4 star — one town", "A Albufeira 4-star off the first strip", "One town. Sagres plus Tavira nightly is a transfer", "July–August is peak"]);
    replaceHotel("portugal_algarve", "lux", ["Vila Vita Parc leftover", "Conrad Algarve — Stretch", "One property", "Do not also buy every boat cave as a sure day", "Winter is cheap because the water is a walk, not a swim"]);
    replaceHotel("norway_fjords", "budget", ["Ibis Bergen or a Bergen 2-star near the station — Lean before the fjord hop", "A Flåm or Aurland 2-star if the train is the point", "A hostel-plus in Bergen", "Skip a fjord-view suite on Lean", "The boat is the lodging plan some nights"]);
    replaceHotel("norway_fjords", "mid", ["A Bergen 3–4 star — one night, then one fjord base", "A Flåm mid lodge", "A Balestrand or Loen 3–4 star if leftover covers that pocket", "One fjord base. Do not hop every village nightly", "July is bright and peak"]);
    replaceHotel("norway_fjords", "lux", ["Hotel Ullensvang leftover", "A Loen or Geiranger Stretch lodge", "One property per base", "Do not also buy every scenic rail as a sure connection", "Shoulder weeks win"]);
    replaceHotel("mexico_city", "budget", ["Ibis Mexico City Reforma or Ibis Budget Mexico City Reforma — Metro, skip a Polanco rate on Lean", "Holiday Inn Express Mexico City – Reforma — limited-service", "Casa Decu or a Roma Norte guesthouse — walk to cafés", "Hostal Regina or a Centro hostel-plus — Zócalo walking, noisier nights", "Condesa 2-star — park walks, street food on the block"]);
    replaceHotel("mexico_city", "mid", ["Mexico City Marriott Reforma Hotel — Reforma mid", "Hilton Mexico City Reforma — walkable spine", "The Westin Santa Fe Mexico City is a commute; mid is Camino Real Polanco or The Hoxton Roma", "The Hoxton Roma — walkable Roma boutique", "One neighborhood — CDMX traffic is the hidden cost"]);
    replaceHotel("mexico_city", "lux", ["Four Seasons Hotel Mexico City — Reforma leftover", "The St. Regis Mexico City — leftover", "Las Alcobas, a Luxury Collection Hotel — Polanco Stretch", "Casa Polanco — design leftover", "The reservation is often the better splurge than a second tower"]);
    replaceHotel("thailand", "budget", ["Ibis Bangkok Sukhumvit 4 or Ibis Styles Bangkok Sukhumvit Phra Khanong — BTS, not a taxi habit", "Holiday Inn Express Bangkok Siam — limited-service, BTS", "A Khao San-adjacent guesthouse only as a crash pad", "Lub d or a hostel-plus in Silom / Chiang Mai old city — walk to food stalls", "Fan room + a stall downstairs is the Lean product"]);
    replaceHotel("thailand", "mid", ["Bangkok Marriott Marquis Queen's Park — Sukhumvit mid, BTS", "Hilton Sukhumvit Bangkok — Asok mid", "Hyatt Place Bangkok Sukhumvit — mid", "Shangri-La Bangkok — riverside mid-plus, river boat to dinner", "One city base — Bangkok or Chiang Mai, not a nightly hop"]);
    replaceHotel("thailand", "lux", ["Mandarin Oriental, Bangkok — river leftover", "Capella Bangkok — same river, Stretch", "Park Hyatt Bangkok — leftover", "Four Seasons Chiang Mai if the north is the point — do not also buy Phuket mid-trip", "One river hotel. Three island hops are a different budget"]);
    replaceHotel("kyoto", "budget", ["Ibis Styles Kyoto Station — station downstairs, convenience-store breakfast", "Toyoko Inn Kyoto Gojo or APA Kyoto Ekimae — business-hotel Lean", "A hostel-plus in Kawaramachi or near Kyoto Station", "A guesthouse in the neighborhood you will walk at night", "Skip a ryokan rate on Lean; that is mid-plus"]);
    replaceHotel("kyoto", "mid", ["Hilton Garden Inn Kyoto Shijo Karasuma — mid, subway", "Hotel Granvia Kyoto — station mid", "Hyatt Place Kyoto — mid", "Mitsui Garden Kyoto Sanjo — Japanese 4-star, one pocket", "A ryokan mid only if leftover covers it — then that is the product"]);
    replaceHotel("kyoto", "lux", ["Four Seasons Hotel Kyoto — leftover", "The Ritz-Carlton, Kyoto — Stretch", "Park Hyatt Kyoto — leftover", "Hoshinoya Kyoto — river Stretch", "The room or the kaiseki, rarely both plus every temple taxi"]);
    replaceHotel("singapore", "budget", ["Ibis Singapore on Bencoolen or Ibis Budget Singapore Crystal — MRT", "Holiday Inn Express Singapore Clarke Quay — limited-service", "Moxy Singapore Clarke Quay — Marriott compact", "A hostel-plus in Bugis or Chinatown", "Skip an Orchard palace on Lean"]);
    replaceHotel("singapore", "mid", ["Hilton Singapore Orchard — mid, MRT", "Singapore Marriott Tang Plaza Hotel — Orchard mid", "Hotel Indigo Singapore Katong — neighborhood mid", "One pocket. Sentosa is a different night if you split"]);
    replaceHotel("singapore", "lux", ["Marina Bay Sands leftover", "Raffles Singapore — Stretch", "The Fullerton Hotel Singapore — leftover", "Capella Singapore — Sentosa Stretch", "One property. Do not also buy every observation deck"]);
    replaceHotel("south_korea", "budget", ["Ibis Styles Ambassador Seoul Myeongdong or Ibis Budget Seoul Dongdaemun — subway", "Holiday Inn Express Seoul Hongdae — if that is the night you came for", "A hostel-plus in Hongdae or Jongno", "A compact Myeongdong 2-star — grocery in the block", "Skip a palace-view rate on Lean"]);
    replaceHotel("south_korea", "mid", ["Hilton Garden Inn Seoul/Gangnam — mid, subway", "Hotel Indigo Seoul Gangnam — IHG mid", "A Jongno 4-star — one neighborhood", "One pocket. Busan is a different lodging night"]);
    replaceHotel("south_korea", "lux", ["Four Seasons Hotel Seoul — leftover", "Park Hyatt Seoul — Stretch", "The Shilla Seoul — leftover", "A hanok Stretch if that is the point", "The room or the BBQ, rarely both plus every palace as a sure interior"]);
    replaceHotel("taiwan", "budget", ["Ibis Taipei Daan or Ibis Styles Taipei Station — MRT", "Holiday Inn Express Taipei Zhonghua — limited-service", "A hostel-plus in Ximending", "A compact Taipei 2-star near a night market", "Skip a Tamsui rate on Lean unless that is the pocket"]);
    replaceHotel("taiwan", "mid", ["Taipei Marriott Hotel — mid", "Hilton Taipei Sinban is New Taipei; mid in-town is Humble House or a Xinyi 4-star", "A Xinyi 4-star — MRT, one pocket", "A Daan 3–4 star — restaurants on the block", "Kaohsiung is a different lodging night"]);
    replaceHotel("taiwan", "lux", ["Mandarin Oriental, Taipei — leftover", "W Taipei — Stretch", "Grand Hyatt Taipei — leftover", "One property", "Do not also buy every day-trip as a sure connection"]);
    replaceHotel("vietnam", "budget", ["Ibis Saigon Airport is a transfer; Lean is a District 1 2-star or Hanoi Old Quarter guesthouse", "Holiday Inn & Suites Saigon Airport — only the night you fly", "A Hanoi Old Quarter hostel-plus — walk to food stalls", "A Hoi An Old Town 2-star if the center is the trip", "One city base — Hanoi or Saigon, not a nightly hop"]);
    replaceHotel("vietnam", "mid", ["Hotel des Arts Saigon, MGallery — mid-plus", "A District 1 4-star near a Metro / Grab zone", "A Hoi An 3–4 star inside or just off the Old Town", "One city, then a separate night if you add Ha Long", "Grab is cheap; tourist-taxi menus are not"]);
    replaceHotel("vietnam", "lux", ["Park Hyatt Saigon leftover", "Capella Hanoi leftover", "Four Seasons The Nam Hai — Hoi An Stretch", "One property per base", "Do not also buy every lantern-boat as a sure night"]);
    replaceHotel("australia", "budget", ["Ibis Sydney World Square or Ibis Budget Sydney Airport — train, skip a Harbour-view rate on Lean", "Holiday Inn Express Sydney Macquarie Park is a commute; Lean is a Surry Hills or Haymarket 2-star", "YHA Sydney Harbour or a hostel-plus near a station", "A Melbourne hostel-plus on a tram if Melbourne is the base", "Long-haul is the expensive line, not the room"]);
    replaceHotel("australia", "mid", ["Sydney Harbour Marriott Hotel at Circular Quay — mid", "Hilton Sydney — mid", "Hyatt Regency Sydney — Darling Harbour mid", "A Melbourne 4-star on a tram if that city is the base", "One city, then a separate island or alps budget if you split"]);
    replaceHotel("australia", "lux", ["Park Hyatt Sydney leftover", "Four Seasons Hotel Sydney — Stretch", "Crown Towers Melbourne leftover if Melbourne is the base", "One property", "Do not stack every harbour cruise and every zoo"]);
    replaceHotel("new_zealand", "budget", ["Ibis Wellington or Ibis Budget Auckland Airport — train / bus, skip a lakefront rate on Lean", "Crowne Plaza Auckland — IHG if leftover covers a CBD Lean-plus night", "A Wellington 2-star on the waterfront bus", "A Queenstown hostel-plus if the south is the point", "Long-haul is the expensive line"]);
    replaceHotel("new_zealand", "mid", ["Cordis Auckland or a CBD 4-star — mid", "QT Wellington or a waterfront 4-star", "A Queenstown 3–4 star if leftover covers the south", "One city, then a separate south-island budget", "Campervan only if that is the trip — it replaces the hotel line"]);
    replaceHotel("new_zealand", "lux", ["Hotel Britomart leftover", "Eichardt's Private Hotel — Queenstown Stretch", "One property per island base", "Do not also buy every adventure add-on", "Shoulder weeks win"]);
    replaceHotel("dubai", "budget", ["Ibis Dubai Al Rigga or Ibis One Central — Metro, skip a Marina address on Lean", "Rove Downtown or Rove City Walk — Lean-plus, Metro", "Holiday Inn Express Dubai – Safa Park — limited-service, Metro-adjacent", "Deira 3-star near a Metro — creek, cheaper nights", "Bur Dubai heritage-adjacent 3-star — walk the souk, Metro to Downtown"]);
    replaceHotel("dubai", "mid", ["A Downtown 4-star near Burj Khalifa — Metro, not a taxi habit", "Hilton Dubai Al Habtoor City — mid, tram / Metro", "Hyatt Regency Dubai Creek Heights — mid", "Marina 4-star on the tram — walk the walkway", "Palm or Downtown — pick one pocket"]);
    replaceHotel("dubai", "lux", ["Armani Hotel Dubai — Burj Khalifa leftover", "Atlantis The Palm — Palm Stretch, kids assumed", "Bulgari Resort Dubai leftover", "Burj Al Arab or One&Only — name-brand leftover only", "Dubai luxury is a weekend, not a week"]);
    replaceHotel("bali", "budget", ["Ibis Bali Kuta or Ibis Styles Bali Benoa — crash-pad near the airport or a Kuta 2-star", "A Canggu homestay — walk to a warung, scooter for the beach", "An Ubud jungle guesthouse — rice-terrace walk, not Seminyak prices", "Kuta 2-star only as a crash pad near the airport", "Scooter math is real — insure it"]);
    replaceHotel("bali", "mid", ["Marriott's Bali Nusa Dua Gardens or Westin Resort Nusa Dua — mid campus if leftover covers the south", "Hyatt Regency Bali — Sanur mid", "A Seminyak boutique if the beach clubs are the point", "Maya Ubud or a riverside 4-star — one base", "One base — Ubud or the coast"]);
    replaceHotel("bali", "lux", ["Four Seasons Resort Bali at Sayan leftover", "Capella Ubud — Stretch", "Bulgari Resort Bali — cliff leftover", "Mandapa, a Ritz-Carlton Reserve — leftover", "One villa. Three mediocre resorts is not Stretch"]);
    replaceHotel("alaska_cruise", "budget", ["Interior guarantee — Holland America or Princess, you picked the itinerary not the porthole", "Lower-deck interior midship — less motion if you chose the cheap cabin on purpose", "A pre-cruise Hampton Inn or Holiday Inn Express near the Seattle or Vancouver dock — one night only", "Skip a suite upsell at check-in; the cabin is not the leak", "You bought daylight and a deck, not a hotel"]);
    replaceHotel("alaska_cruise", "mid", ["Oceanview or balcony midship — Princess, Holland America, or Royal, Central-ship beats a cheap aft if you get seasick", "Covered balcony on a 7-night — sit outside without paying suite gratuities", "A pre-cruise Seattle Marriott Waterfront or Vancouver downtown 4-star — one night", "One cabin category. A second ship hop is not this trip", "Port days are the product"]);
    replaceHotel("alaska_cruise", "lux", ["Large balcony or aft-wrap leftover — the wake is the product", "Haven / suite-adjacent on the line you already chose — suite gratuities run higher", "A pre-cruise Fairmont or Four Seasons night in Vancouver leftover-only", "Spa-deck cabin — quieter, still not a fare quote", "Do not also buy every glacier flightsee as a sure day"]);
    replaceHotel("costa_rica", "budget", ["Holiday Inn Express San José Airport — only the night you fly", "A La Fortuna 2-star / hostel-plus — walk to town", "A Manuel Antonio 2-star off the hill", "Skip a volcano-view suite on Lean", "A car is optional if you buy transfers"]);
    replaceHotel("costa_rica", "mid", ["An Arenal 3–4 star with a hot-spring hour included or cheap", "A Manuel Antonio 3–4 star walk-to-town", "Adults-only mid if there are no kids", "One volcano base, one beach base — transfer is a line"]);
    replaceHotel("costa_rica", "lux", ["Nayara Tented Camp or Nayara Springs leftover", "Four Seasons Resort Costa Rica at Peninsula Papagayo — Stretch", "Andaz Costa Rica Resort at Peninsula Papagayo — Hyatt leftover", "One property per base", "Do not also buy every zip-line"]);
    replaceHotel("belize", "budget", ["Best Western Plus Belize Biltmore Plaza — Belize City Lean only the night you fly", "A San Pedro 2-star a block off the sand — golf cart, not a water-taxi habit every meal", "A Caye Caulker hostel-plus — Lean island", "Skip a villa on Lean", "Confirm the water taxi"]);
    replaceHotel("belize", "mid", ["An Ambergris 3–4 star — walk-to-town, one island", "A Hopkins 3–4 star if the south is the point", "Adults-only mid if there are no kids", "The reef is a boat day, not a second hotel"]);
    replaceHotel("belize", "lux", ["Victoria House leftover", "Itz'ana or a Placencia Stretch", "One island or one coast", "Do not also buy every atoll as a sure day", "Hurricane weeks are not a discount you want to win"]);
    replaceHotel("guatemala", "budget", ["A Antigua 2-star or guesthouse — walk the cobbles, pack light", "A Lake Atitlán 2-star in the town you will eat in", "A Guatemala City 2-star only the night you fly", "Skip a lake-view suite on Lean", "Altitude is real"]);
    replaceHotel("guatemala", "mid", ["Hotel Museo Casa Santo Domingo — Antigua mid", "A Lake Atitlán 3–4 star in one village", "Porta Hotel Antigua or a centro 4-star", "One town. Antigua plus the lake nightly is a transfer", "Trusted shuttles beat a rental in the core"]);
    replaceHotel("guatemala", "lux", ["A Lake Atitlán Stretch lodge — one village leftover", "An Antigua courtyard leftover", "One property per base", "Do not also buy every volcano as a sure sunrise"]);
    replaceHotel("peru", "budget", ["Ibis Cusco or a San Blas 2-star — walk, pack light, altitude slack", "A Cusco hostel-plus near Plaza de Armas a block off the postcard row", "A Lima Miraflores 2-star if you overnight the coast", "Skip a Sacred Valley suite on Lean", "Aguas Calientes 2-star the night before Machu Picchu"]);
    replaceHotel("peru", "mid", ["Hilton Garden Inn Cusco — mid, walkable", "A San Blas 3–4 star — walkable Cusco mid", "A Sacred Valley 3–4 star if leftover covers that base", "A Miraflores 4-star if Lima is a real night", "One altitude base. Do not hop valley plus Cusco nightly"]);
    replaceHotel("peru", "lux", ["Belmond Hotel Monasterio leftover", "Belmond Sanctuary Lodge — Machu Picchu Stretch", "Palacio del Inka, a Luxury Collection Hotel — Cusco leftover", "One property per altitude", "The ruin is the product, not a second suite"]);
    replaceHotel("peru_lima", "budget", ["Ibis Lima Reducto Miraflores — walk or a short hop to the malecón", "Holiday Inn Lima Airport — only the night you fly", "A Miraflores 2-star — grocery nearby", "A Barranco hostel-plus if that is the restaurant pocket", "Skip a cliff-view suite on Lean"]);
    replaceHotel("peru_lima", "mid", ["Hilton Lima Miraflores — mid, malecón walking", "A Miraflores 4-star — one pocket", "A Barranco 3–4 star if leftover covers that night", "Mid stays a block off the first cliff row — JW is leftover", "Cusco is a different lodging night and a different altitude"]);
    replaceHotel("peru_lima", "lux", ["JW Marriott Hotel Lima leftover", "Hotel B — Barranco Stretch", "Belmond Miraflores Park leftover", "One pocket", "The tasting menu is often the better Stretch"]);
    replaceHotel("buenos_aires", "budget", ["Ibis Buenos Aires Congreso or Ibis Budget Recoleta — Subte, bakery downstairs", "Holiday Inn Buenos Aires Ezeiza Airport — only the night you fly", "A Palermo 2-star if that is the restaurant pocket", "A San Telmo hostel-plus — walk the Sunday fair", "Skip a Recoleta palace on Lean"]);
    replaceHotel("buenos_aires", "mid", ["Hilton Buenos Aires — Puerto Madero mid", "Hotel Indigo Buenos Aires — mid", "A Palermo 3–4 star — one neighborhood", "A Recoleta 4-star if leftover covers that pocket", "One barrio. Do not hop Palermo and San Telmo nightly"]);
    replaceHotel("buenos_aires", "lux", ["Four Seasons Hotel Buenos Aires leftover", "Palacio Duhau - Park Hyatt Buenos Aires — Stretch", "Alvear Palace Hotel leftover", "One property", "The steakhouse is often the better Stretch than a second suite"]);
    replaceHotel("colombia", "budget", ["Ibis Cartagena Marbella or a Getsemaní 2-star — walk the walls, pack light", "A Centro hostel-plus — louder nights", "A Bocagrande 2-star if leftover is tight", "Skip a walled-city palace on Lean", "Confirm the transfer from the airport"]);
    replaceHotel("colombia", "mid", ["Hilton Cartagena — Bocagrande mid", "Movich Cartagena de Indias or a Centro 4-star", "A Getsemaní 3–4 star — restaurants on the block", "One pocket. The islands are a boat day", "Humidity is free; a taxi loop is not"]);
    replaceHotel("colombia", "lux", ["Sofitel Legend Santa Clara leftover", "Casa San Agustín Stretch", "One property", "Do not also buy every Rosario island as a sure day", "New Year weeks lift rooms"]);
    replaceHotel("colombia_medellin", "budget", ["Ibis Medellín or a Poblado 2-star — Metro, skip El Poblado palace on Lean", "A Laureles 2-star if that is the restaurant pocket", "A hostel-plus near a Metro stop", "Altitude slack is an activity", "Comuna 13 is a morning, not a hotel address"]);
    replaceHotel("colombia_medellin", "mid", ["A Poblado 3–4 star or Click Clack — one neighborhood", "A Laureles 4-star if leftover covers that pocket", "One barrio. Guatapé is a day trip", "Metro / taxi beats a rental in the core"]);
    replaceHotel("colombia_medellin", "lux", ["The Charlee leftover", "A Poblado Stretch boutique", "One property", "Do not also buy every coffee tour as a sure day", "The tasting menu is often the better Stretch"]);
    replaceHotel("colombia_bogota", "budget", ["Ibis Bogotá Museo or a Candelaria-adjacent 2-star — walk, altitude slack", "Holiday Inn Bogotá Airport — only the night you fly", "A Chapinero 2-star if that is the restaurant pocket", "A hostel-plus near a TransMilenio stop", "Skip a Zona G palace on Lean"]);
    replaceHotel("colombia_bogota", "mid", ["Bogota Marriott Hotel — mid", "Hilton Bogotá — mid", "A Zona G / Zona T 3–4 star — one pocket", "A Candelaria 4-star only if leftover covers the tourist-row tax", "One neighborhood. Monserrate is a morning"]);
    replaceHotel("colombia_bogota", "lux", ["Four Seasons Hotel Casa Medina Bogotá leftover", "Sofitel Bogotá Victoria Regia — Stretch", "One property", "Altitude plus street food is the trip", "The reservation is often the better Stretch"]);
    replaceHotel("brazil_rio", "budget", ["Ibis Rio de Janeiro Santos Dumont or Ibis Budget Copacabana — Metro / bus", "A Copacabana 2-star a block off the first beach row", "A hostel-plus in Botafogo or Lapa", "Skip an Ipanema palace on Lean"]);
    replaceHotel("brazil_rio", "mid", ["Hilton Copacabana Rio de Janeiro — beach mid", "Windsor Copa or a Copacabana 4-star", "A Ipanema 3–4 star if leftover covers that pocket", "One beach. Do not hop Copacabana and Ipanema nightly", "Metro / Uber beats a rental in the core"]);
    replaceHotel("brazil_rio", "lux", ["Belmond Copacabana Palace leftover", "Fairmont Rio de Janeiro Copacabana — Stretch", "Hotel Fasano Rio de Janeiro leftover", "One property", "Carnival weeks are not the value window"]);
    replaceHotel("panama", "budget", ["Ibis Panama City or a Casco 2-star — walk the walls", "An El Cangrejo 2-star — grid streets, grocery nearby", "A hostel-plus in Casco Viejo", "Skip a Causeway palace on Lean", "The canal is a morning, not a hotel address"]);
    replaceHotel("panama", "mid", ["Hilton Panama — downtown mid", "The Westin Panama — mid", "A Casco 3–4 star — one pocket", "One neighborhood. Bocas is a different lodging night", "Uber is cheap; tourist-taxi menus are not"]);
    replaceHotel("panama", "lux", ["American Trade Hotel leftover", "The Bristol Panama — Stretch", "One property", "Do not also buy every island hop as a sure day", "The canal transit is a ticket, not a room upgrade"]);
    replaceHotel("mexico_oaxaca", "budget", ["A Centro 2-star or guesthouse — walk to a market, pack light", "A hostel-plus near Santo Domingo", "Skip a rooftop-suite on Lean", "Altitude plus street food is the trip", "Hierve el Agua is a day, not a second hotel"]);
    replaceHotel("mexico_oaxaca", "mid", ["Hotel Casa Oaxaca or a Centro 3–4 star", "A design 4-star in the walkable centro", "One neighborhood", "Monte Albán is a morning", "Do not hop Puebla into this lodging without a transfer night"]);
    replaceHotel("mexico_oaxaca", "lux", ["Hacienda Los Laureles leftover", "A Centro Stretch courtyard", "One property", "The tasting menu is often the better Stretch", "Guelaguetza weeks lift rooms"]);
    replaceHotel("morocco", "budget", ["Ibis Marrakech Centre Gare or Ibis Budget Marrakech — walk or petit taxi, skip a palace riad on Lean", "A Medina guesthouse — pack light, trusted drivers", "A Gueliz 2-star if you want grid streets", "Skip the hotel dinner most nights", "Fes is a different lodging night"]);
    replaceHotel("morocco", "mid", ["A Gueliz 4-star or a restored riad 3–4 star in the walkable medina", "Sofitel Marrakech Palais Imperial — mid-plus", "One city. The desert camp is a different night", "Day tours beat a safari-priced room you do not need"]);
    replaceHotel("morocco", "lux", ["Royal Mansour Marrakech leftover", "La Mamounia Stretch", "Four Seasons Resort Marrakech leftover", "One property", "The riad or the desert camp — rarely both plus every souk guide"]);
    replaceHotel("south_africa", "budget", ["Ibis Cape Town Waterfront or a City Bowl 2-star — MyCiTi, skip a Camps Bay palace on Lean", "A hostel-plus near Long Street / Gardens", "A Johannesburg Sandton 2-star if you overnight inland", "Skip a safari-priced room you do not need in the city", "The mountain is a morning, not a hotel address"]);
    replaceHotel("south_africa", "mid", ["Cape Town Marriott Hotel Crystal Towers is a commute; mid is a V&A / City Bowl 4-star", "The Westin Cape Town — convention / waterfront mid", "A City Bowl 3–4 star — one pocket", "Safari lodges are a different budget and night", "Uber beats a rental in the core; the peninsula is a car day"]);
    replaceHotel("south_africa", "lux", ["One&Only Cape Town leftover", "The Silo Hotel Stretch", "Belmond Mount Nelson leftover", "A safari lodge leftover is a different trip line", "The game drive is the product if you add the bush"]);
    replaceHotel("egypt", "budget", ["Ibis Cairo Citystars or a Downtown 2-star — Metro / trusted driver", "A Giza 2-star only if sunrise at the pyramids is the point", "A Luxor 2-star on the east bank if the south is the trip", "Skip a Nile-view suite on Lean", "Day tours beat a palace room you will not sit in"]);
    replaceHotel("egypt", "mid", ["Cairo Marriott Hotel & Omar Khayyam Casino — Zamalek mid", "Hilton Cairo Zamalek Residences — mid", "A Luxor 4-star on the east bank", "One city, then a separate night if you add Aswan", "The site is the product, not a second tower"]);
    replaceHotel("egypt", "lux", ["Four Seasons Hotel Cairo at Nile Plaza leftover", "Sofitel Legend Old Cataract Aswan Stretch", "A Nile cruise cabin leftover is a different product", "One property per city", "Do not also buy every optional tomb as a sure interior"]);
    replaceHotel("kenya_safari", "budget", ["A Nairobi 2-star near Wilson or a city guesthouse — only the night you fly", "Ibis Styles Nairobi Westlands — city Lean", "A budget tented camp with honest transfers", "Skip a balloon-and-suite stack on Lean", "The game drive is the product"]);
    replaceHotel("kenya_safari", "mid", ["Nairobi Serena or a city 4-star the night before camp", "A mid tented camp in one reserve", "One park base. Do not hop every reserve nightly", "Transfer days need slack", "Park fees are a line"]);
    replaceHotel("kenya_safari", "lux", ["Angama Mara leftover", "Giraffe Manor is a different product and waitlist", "A Stretch tented camp in one reserve", "One property", "Do not also buy every balloon as a sure dawn"]);
    replaceHotel("tanzania_zanzibar", "budget", ["A Stone Town 2-star or guesthouse — walk the alleys", "A Nungwi or Paje 2-star a block off the sand", "Skip a villa on Lean", "Confirm the transfer from the airport or ferry", "Safari is a different lodging night if you add the mainland"]);
    replaceHotel("tanzania_zanzibar", "mid", ["Park Hyatt Zanzibar — Stone Town mid-plus", "A Nungwi 3–4 star — one beach", "A Stone Town 4-star if the town is the point", "One pocket. Do not hop both coasts nightly", "Transfer in the rate"]);
    replaceHotel("tanzania_zanzibar", "lux", ["andBeyond Mnemba leftover", "A Nungwi Stretch villa", "Park Hyatt Zanzibar leftover suite", "One property", "Do not also buy every spice tour as a sure day"]);
    replaceHotel("jordan", "budget", ["Ibis Amman or a Downtown 2-star — the night you fly", "A Wadi Musa 2-star — walk or a short hop to the Petra gate", "A hostel-plus in Amman", "Skip a Petra-view suite on Lean", "The site is the product"]);
    replaceHotel("jordan", "mid", ["Amman Marriott Hotel — city mid the night before Petra", "Mövenpick Resort Petra — gate-adjacent mid", "A Wadi Musa 3–4 star", "One base for Petra. Wadi Rum is a different night", "Dead Sea mid is a separate pocket"]);
    replaceHotel("jordan", "lux", ["Four Seasons Hotel Amman leftover", "Mövenpick Nabatean Castle leftover", "A Wadi Rum Stretch camp", "One property per pocket", "Do not also buy every add-on tomb as a sure interior"]);
    replaceHotel("nepal", "budget", ["A Thamel 2-star or guesthouse — walk to food, altitude slack", "A hostel-plus in Thamel", "Skip a mountain-view suite on Lean", "Pokhara is a different lodging night", "The trek lodge is a different product"]);
    replaceHotel("nepal", "mid", ["Hyatt Regency Kathmandu — mid if leftover covers the city campus", "A Thamel 3–4 star — one pocket", "A Pokhara 3–4 star if the lake is the point", "One city base, then a separate trek line", "Trusted drivers beat a rental"]);
    replaceHotel("nepal", "lux", ["Dwarika's Hotel leftover", "A Pokhara Stretch lake lodge", "One property per base", "The trek is the product if you add it", "Do not also buy every scenic flight as a sure dawn"]);
    replaceHotel("cambodia", "budget", ["Ibis Phnom Penh or a Siem Reap 2-star near Pub Street a block off the row", "A Siem Reap hostel-plus — tuk-tuk to the temples", "Skip a temple-view suite on Lean", "The temples are the product", "Phnom Penh is a different lodging night"]);
    replaceHotel("cambodia", "mid", ["Courtyard Siem Reap Resort — Marriott mid", "A Siem Reap 3–4 star with a pool you will actually use after temples", "One town. Angkor is a sunrise, not a second hotel", "Tuk-tuks beat a rental in town", "Park tickets are a line"]);
    replaceHotel("cambodia", "lux", ["Raffles Grand Hotel d'Angkor leftover", "Park Hyatt Siem Reap Stretch", "One property", "Do not also buy every sunrise as a sure interior", "The temples still start early on Stretch"]);
    replaceHotel("philippines_palawan", "budget", ["An El Nido town 2-star — walk to the pier, grocery the first hour", "A Puerto Princesa 2-star the night you fly", "Skip a cliff villa on Lean", "Island hops are boat days", "Confirm the van or flight transfer"]);
    replaceHotel("philippines_palawan", "mid", ["A El Nido 3–4 star in town or Corong-Corong", "A Port Barton mid if leftover covers that pocket", "One town. El Nido plus Coron nightly is a transfer day", "The lagoon is a boat, not a hotel pool requirement", "One island base"]);
    replaceHotel("philippines_palawan", "lux", ["El Nido Resorts Miniloc or Pangulasian leftover", "A Stretch island resort — one property", "Do not also buy every island hop", "Monsoon weeks are not a discount you want to win", "One base"]);
    replaceHotel("indonesia_lombok", "budget", ["A Senggigi 2-star or a Kuta Lombok 2-star — grocery the first hour", "A hostel-plus on the south if surf is the point", "Skip a Gili villa on Lean unless that island is the trip", "The Gili boat is a transfer", "Bali is a different lodging night"]);
    replaceHotel("indonesia_lombok", "mid", ["A Senggigi 3–4 star or Kuta Lombok midrise — one coast", "A Gili Trawangan 3–4 star if that island is the point", "One island. Lombok plus Gili nightly is a boat tax", "Scooter math is real"]);
    replaceHotel("indonesia_lombok", "lux", ["The Oberoi Beach Resort, Lombok leftover", "A Gili Stretch villa", "One property", "Do not also buy every island hop", "One coast"]);
    replaceHotel("sri_lanka", "budget", ["A Colombo 2-star near a train or a Galle Fort guesthouse — pick one coast start", "A hostel-plus in Galle or Ella", "Skip a tea-bungalow suite on Lean", "The train is the lodging plan some days", "Confirm transfers; the island is longer than the map"]);
    replaceHotel("sri_lanka", "mid", ["Shangri-La Colombo or a Colombo 4-star if the city is a real night", "A Galle Fort 3–4 star — one pocket", "An Ella or Nuwara Eliya 3–4 star if the hills are the point", "One coast or one hill base, then a transfer day", "The train is mid when leftover covers a reserved seat"]);
    replaceHotel("sri_lanka", "lux", ["Amangalla leftover", "Ceylon Tea Trails Stretch", "One property per pocket", "Do not also buy every safari as a sure dawn", "Monsoon coasts flip; pick the dry side"]);
    replaceHotel("italy_sicily", "budget", ["Ibis Styles Palermo or a Centro 2-star — walk, pack light", "A Catania 2-star if Etna is the start", "A Syracuse Ortigia 2-star — grocery nearby", "Skip a cliff suite on Lean", "One city base; the island is a transfer week"]);
    replaceHotel("italy_sicily", "mid", ["NH Collection Palermo or a Centro 4-star", "A Taormina 3–4 star if leftover covers that pocket", "An Ortigia 3–4 star — one neighborhood", "One town at night. Palermo plus Taormina nightly is a transfer", "A car helps outside the cores"]);
    replaceHotel("italy_sicily", "lux", ["Belmond Grand Hotel Timeo leftover", "Four Seasons San Domenico Palace Taormina Stretch", "One property", "Do not also buy every ruin as a sure interior", "August is a crowd tax"]);
    replaceHotel("puerto_rico_rincon", "budget", ["A Rincón 2-star or guesthouse — walk or a short hop to the beach you booked", "A studio condo with a kitchen — grocery the first hour", "Skip a cliff villa on Lean", "San Juan is a different lodging night", "A car is assumed once you leave town"]);
    replaceHotel("puerto_rico_rincon", "mid", ["A Rincón 3–4 star walk-to-beach", "A condo-plus in the same pocket if you will cook dinners", "One town. Do not hop Rincón and San Juan nightly", "Surf is a morning, not a hotel requirement", "Parking is a line"]);
    replaceHotel("puerto_rico_rincon", "lux", ["A Rincón Stretch inn leftover", "Dorado Beach is the north coast — a different drive", "One property", "Do not also buy every sunset-sail", "Hurricane weeks are not a discount you want to win"]);
    replaceHotel("dominican_republic_samana", "budget", ["A Las Terrenas 2-star or guesthouse — walk to a grocery", "A Samaná town 2-star if the ferry is the point", "Skip a villa on Lean", "Punta Cana is a different lodging night and a different airport", "Confirm the transfer"]);
    replaceHotel("dominican_republic_samana", "mid", ["A Las Terrenas 3–4 star — one beach", "Adults-only mid if there are no kids", "One pocket. Las Galeras is a different drive", "Whale season is a boat day", "Transfer in the rate"]);
    replaceHotel("dominican_republic_samana", "lux", ["A Samaná Stretch villa leftover", "One property", "Do not also buy every whale trip as a sure dawn", "Cap Cana is a different island pocket", "One beach"]);
    replaceHotel("ecuador_galapagos", "budget", ["A Puerto Ayora 2-star — walk to the pier, grocery the first hour", "A hostel-plus on Santa Cruz", "Skip a yacht suite on Lean; land-based is the Lean product", "Quito is a different lodging night and altitude", "Park fees are a line"]);
    replaceHotel("ecuador_galapagos", "mid", ["A Puerto Ayora 3–4 star — one island base", "A land-based mid with day boats", "One island. Do not hop every island nightly without a cruise product", "The boat day is the product", "Transfer in the rate"]);
    replaceHotel("ecuador_galapagos", "lux", ["A small-ship cabin leftover — that is the Stretch product", "Finch Bay or a Stretch land lodge", "One ship or one lodge", "Do not also buy every extra island as a sure day", "The park rules are the itinerary"]);
    replaceFallbackHotel("domestic", "budget", ["Hampton Inn or Tru by Hilton downtown — limited-service, not the interstate cloverleaf", "Holiday Inn Express or Fairfield Inn near a transit stop — grocery in walking distance", "Courtyard by Marriott value downtown — one room, skip airport lodging except the night you fly", "Motto or Aloft when present — compact, walk to a train or bus", "A neighborhood 2-star on the good side of the tracks if the chain block is sold"]);
    replaceFallbackHotel("domestic", "mid", ["Marriott or Hilton downtown / convention — one room, not a suite", "Hyatt Place or Hyatt Regency in the walkable core — transit over a rooftop pool you will use twice", "Westin, Sheraton, or Renaissance neighborhood 4-star", "Canopy, Autograph, Tribute, or Curio when a real property fits the district", "A boutique in the restaurant neighborhood — skip the cloverleaf tower"]);
    replaceFallbackHotel("domestic", "lux", ["JW Marriott or Grand Hyatt in one district — leftover only", "Conrad, Waldorf Astoria, or Park Hyatt when the city has one", "Ritz-Carlton, St. Regis, W, or Edition — one flagship", "Four Seasons or Fairmont where that address is honest", "Suite only if leftover covers the jump from mid — do not also buy every paid tour"]);
    replaceFallbackHotel("europe", "budget", ["Ibis, Ibis Styles, or Ibis Budget on a Metro or tram — not the airport strip", "Holiday Inn Express or Novotel when present — bakery downstairs beats hotel breakfast", "Premier Inn or Travelodge Zone 1–2 in the UK", "Generator or hostel-plus in a neighborhood with night trams", "A 2-star walk-up near a market street — pack light, stairs are common"]);
    replaceFallbackHotel("europe", "mid", ["Hilton, Marriott, or Hyatt in the walkable centro — one neighborhood", "Hotel Indigo, NH Collection, or a 4-star near a Metro and a food market", "Westin or Canopy when the city has one", "Aparthotel 4-star if you will grocery two breakfasts", "A boutique 3-star near a Metro — skip the ring-road spa"]);
    replaceFallbackHotel("europe", "lux", ["Park Hyatt, Conrad, or Waldorf Astoria when the city has one", "Four Seasons, Fairmont, or a palace historic in the old city", "Ritz-Carlton or Luxury Collection leftover", "Design flagship with a real neighborhood, not a ring-road spa", "Suite with a view leftover-only — mid Europe already eats a US budget"]);
    replaceFallbackHotel("hawaii", "budget", ["Hampton Inn or Holiday Inn Express on the bus grid — kitchenette if you can get one", "Outrigger value or a studio condo a block off the sand — grocery the first hour", "A 2-star a block off the beach — same sand, less resort fee", "Skip a rental car if the bus reaches the beach and the store", "Airport lodging only the night you fly"]);
    replaceFallbackHotel("hawaii", "mid", ["Hilton, Sheraton, or Hyatt Regency walk-to-beach — one resort path, not three islands", "Marriott beach-class or Outrigger mid — request garden vs ocean on purpose", "Condo-plus in the same beach town if you will cook two dinners", "Embassy Suites or a kitchenette mid if leftover covers it", "Parking and resort fees are their own lines"]);
    replaceFallbackHotel("hawaii", "lux", ["Grand Hyatt, Andaz, or Four Seasons in one pocket", "Ritz-Carlton, Waldorf, or Luxury Collection beach-premium", "Aulani or a Disney deluxe-class only if leftover + kids", "Adults-only or villa if leftover is real", "The car becomes mandatory once you leave town — do not also book every snorkel and helicopter"]);
    replaceFallbackHotel("city", "budget", ["Hampton, Holiday Inn Express, or Ibis on transit — walk-to-bakery beats a cheap room far from everything", "Fairfield, Courtyard value, or Motto when present", "Airport hotel only the night you fly", "Kitchenette if grocery breakfasts are the plan", "A neighborhood 2-star on the good side of the tracks"]);
    replaceFallbackHotel("city", "mid", ["Marriott, Hilton, or Hyatt Place / Hyatt Regency on transit", "Westin, Sheraton, or Hotel Indigo in the walkable core", "One room, not a suite, unless leftover is real", "Location over a rooftop you will use twice", "A boutique in the restaurant neighborhood"]);
    replaceFallbackHotel("city", "lux", ["JW Marriott, Grand Hyatt, or Conrad in one district", "Park Hyatt, Ritz-Carlton, St. Regis, or Edition when the city has one", "Four Seasons or Fairmont leftover", "Park- or water-adjacent flagship", "Do not also buy every paid tour"]);
    replaceFallbackHotel("asia", "budget", ["APA, Toyoko Inn, Super Hotel, or Ibis next to a Metro or JR station", "Holiday Inn Express or Fairfield when present — convenience-store breakfast", "Capsule only if you packed light", "Hostel-plus in the old city or night-market pocket", "Skip a palace-view rate on Lean"]);
    replaceFallbackHotel("asia", "mid", ["Hilton, Marriott, or Hyatt Regency near a Metro interchange", "Westin, Hotel Indigo, or Mitsui Garden / neighborhood 4-star", "Rail passes are often a bad buy on a short city trip", "One city base — skip the three-island hop", "A riverside or night-market-adjacent boutique if leftover covers it"]);
    replaceFallbackHotel("asia", "lux", ["Park Hyatt, Conrad, or The Ritz-Carlton in the central ward", "Four Seasons, Mandarin Oriental, or Aman leftover", "The room or the counter dinner — rarely both", "Ryokan or courtyard hotel if that is the point of the trip", "Suite leftover-only"]);
    replaceFallbackHotel("oceania", "budget", ["Ibis or Ibis Budget near a station — not the airport strip", "YHA / hostel-plus or a neighborhood 3-star on a train", "Apartment with a kitchen if the stay is 5+ nights", "Long-haul is the expensive line, not the room", "Airport lodging only the night you fly"]);
    replaceFallbackHotel("oceania", "mid", ["Hilton, Marriott, or Hyatt Regency harbor or CBD", "A 4-star on a ferry or train", "One city, then a separate island or alps budget if you split", "Boutique in the walkable core", "Campervan only if that is the trip — it replaces the hotel line"]);
    replaceFallbackHotel("oceania", "lux", ["Park Hyatt, Four Seasons, or a waterfront flagship", "Harbor or sound-view leftover", "Wilderness lodge leftover-only", "One base", "Do not stack every adventure add-on"]);
    replaceFallbackHotel("caribbean", "budget", ["Riu, Princess, or Palace class on the main beach — garden view on purpose", "Holiday Inn Resort or a value AI — confirm the airport transfer", "Town guesthouse only if you will eat out and take local buses", "Skip the ocean-view upsell", "Downtown limited-service only if you skip the AI product"]);
    replaceFallbackHotel("caribbean", "mid", ["Hyatt Ziva, Hilton, or Marriott beach-class when the island has one", "Iberostar Selection or Hard Rock — 4-star AI, one property", "Adults-only 4-star if there are no kids — Secrets / Dreams class", "Transfer in the rate, not a dock surprise", "A town boutique if this is not an AI week"]);
    replaceFallbackHotel("caribbean", "lux", ["Hyatt Zilara, Sandals, or Excellence class — leftover only", "Waldorf, Ritz-Carlton, or Four Seasons when the island has one", "Overwater or cliff villa leftover-only", "One island, one resort", "Still no invented fare"]);
    replaceFallbackHotel("mexico", "budget", ["Riu / Palace-class AI if this is a beach week — garden view on purpose", "Holiday Inn Express or Ibis in the centro if you will eat out", "Roma / Centro / Zona Hotelera value room — walk or ADO bus", "Skip the ocean-view upsell and the timeshare pitch", "Pick one product — centro guesthouse or value AI"]);
    replaceFallbackHotel("mexico", "mid", ["Hyatt Ziva, Hilton, or Marriott hotel-zone when present", "Live Aqua or a 4-star AI if all-inclusive is the point", "Design 3–4 star in Roma, Polanco, or the hotel zone", "One neighborhood — traffic is the hidden cost", "Adults-only 4-star if there are no kids"]);
    replaceFallbackHotel("mexico", "lux", ["Four Seasons, St. Regis, or JW Marriott leftover", "Rosewood / Le Blanc class — adults-only beach premium", "One property", "The reservation is often the better splurge", "Villa only if leftover covers the jump from mid"]);
    replaceFallbackHotel("africa", "budget", ["Ibis or a city 3-star near a tram or BRT", "Medina guesthouse or township-adjacent 2-star — walk to food, use trusted drivers", "Skip the hotel dinner most nights", "Day tours beat a safari-priced room you do not need", "Airport lodging only the night you fly"]);
    replaceFallbackHotel("africa", "mid", ["Hilton, Marriott, or Westin near the waterfront or medina edge", "Restored riad or city 4-star in the walkable core", "One city, then a separate lodge line if you add safari", "Safari lodges are a different budget", "Trusted drivers beat a rental in the core"]);
    replaceFallbackHotel("africa", "lux", ["Four Seasons, Sofitel Legend, or a palace leftover", "Cape or Nile flagship", "Lodge leftover — the game drive is the product", "One property per pocket", "Do not double-pay for every optional excursion"]);
    replaceFallbackHotel("middleeast", "budget", ["Ibis, Rove, or Holiday Inn Express near a Metro", "Deira / downtown 3-star — souk walking", "Skip the Marina address on a Lean week", "Desert tours are day-two, not day-one upsells", "Airport lodging only the night you fly"]);
    replaceFallbackHotel("middleeast", "mid", ["Hilton, Marriott, or Hyatt Regency on the Metro or tram", "Downtown or Marina 4-star — pick one pocket", "Hotel breakfast only when it is in the rate", "Palm mid is a different transfer", "Summer is cheap and brutal"]);
    replaceFallbackHotel("middleeast", "lux", ["Park Hyatt, Conrad, JW Marriott, or an icon hotel as a weekend, not a week", "Atlantis / Armani / Burj class leftover", "Palm or Downtown flagship — one", "Desert camp only if leftover covers a night out of the city", "Do not also buy every desert-tour upsell on day one"]);
    replaceFallbackHotel("latam", "budget", ["Ibis or Holiday Inn Express in the walkable centro", "Hostel-plus or 2-star in the zona colonial", "Value AI only if this is a beach week", "Uber is cheap; tourist-taxi menus are not", "Altitude and street food are the trip in the cities"]);
    replaceFallbackHotel("latam", "mid", ["Hilton, Marriott, or Hyatt in the restaurant neighborhood", "Iberostar / Hyatt Ziva class if all-inclusive", "Design 3–4 star in the walkable distrito", "One base — intercity buses need their own night", "A 4-star AI on the beach if that is the product"]);
    replaceFallbackHotel("latam", "lux", ["Four Seasons, Park Hyatt, or a casa-hotel leftover", "Adults-only beach premium", "Flagship in the centro or beach leftover", "The tasting menu is often the better Stretch", "One property"]);
    replaceFallbackHotel("ai", "budget", ["Riu / Palace / Krystal class — on-property shuttle or a short hotel-zone walk", "Holiday Inn Resort or a 3-star AI on the main beach strip — garden view on purpose", "Confirm the airport transfer is in the rate", "Downtown limited-service only if you will eat out and skip the AI product", "Skip the swim-up-suite upsell"]);
    replaceFallbackHotel("ai", "mid", ["Hyatt Ziva / Hilton / Marriott all-inclusive when the strip has one", "Iberostar Selection / Hard Rock class — beach, kids club if you need it", "Moon Palace or Live Aqua class — all-inclusive mid", "Adults-only 4-star if there are no kids — Secrets / Dreams class", "One property, not a two-resort hop"]);
    replaceFallbackHotel("ai", "lux", ["Hyatt Zilara / Excellence / Secrets stretch class — beach premium", "Sandals or a villa AI leftover only", "Overwater or swim-up suite only if leftover covers the jump", "One flagship, not a two-resort hop", "Still no invented nightly rate"]);
  }

  thickenHotels();
  thickenFood();
  thickenActs();
  thickenFallbacks();
  installFullRecs();
  installActsOnly();
  patchUniques();
  rebalanceHotels();
})(typeof window !== "undefined" ? window : this);

