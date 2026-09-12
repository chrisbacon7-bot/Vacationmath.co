#!/usr/bin/env python3
"""Generate plan-recs-extra.js — curated Hotel / Food / Activities for new US
cities plus catalog-wide thickening. VacationMath voice; named venues; no
rates, star scores, or affiliate copy."""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path("/workspace/plan-recs-extra.js")


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def arr(items: list[str]) -> str:
    return "[\n        " + ",\n        ".join(js_str(x) for x in items) + "\n      ]"


def hotel_block(why_b, b, why_m, m, why_l, l) -> str:
    return (
        "{\n"
        f"      budget: {{ why: {js_str(why_b)}, picks: {arr(b)} }},\n"
        f"      mid: {{ why: {js_str(why_m)}, picks: {arr(m)} }},\n"
        f"      lux: {{ why: {js_str(why_l)}, picks: {arr(l)} }}\n"
        "    }"
    )


def food_block(note, b, m, l) -> str:
    return (
        "{\n"
        f"      note: {js_str(note)},\n"
        f"      budget: {arr(b)},\n"
        f"      mid: {arr(m)},\n"
        f"      lux: {arr(l)}\n"
        "    }"
    )


def act_block(b, m, l) -> str:
    return (
        "{\n"
        f"      budget: {arr(b)},\n"
        f"      mid: {arr(m)},\n"
        f"      lux: {arr(l)}\n"
        "    }"
    )


# Extra bullets appended to existing curated dests (already have ~3–4).
HOTEL_EXTRA = {
    "disney": {
        "budget": [
            "All-Star Music — Value, same bus grid, sometimes quieter than Movies",
            "Pop Century preferred-view only if leftover covers the walk you will not take",
        ],
        "mid": [
            "Port Orleans Riverside — Moderate, request Magnolia Bend if leftover is real",
            "Caribbean Beach Riviera-side — Skyliner without the Deluxe rate",
        ],
        "lux": [
            "Wilderness Lodge / Boulder Ridge — Deluxe, boat to Magic Kingdom",
            "Club level only if leftover is a nightly number you already priced",
        ],
    },
    "cruise": {
        "budget": [
            "Guarantee interior on a 7-night Caribbean — you bought the itinerary, not the porthole",
            "Skip the drink-package upsell at check-in; the cabin is not the leak",
        ],
        "mid": [
            "Balcony midship on the itinerary you already chose — not a second ship hop",
            "Oceanview if the balcony jump eats the leftover you wanted for a port day",
        ],
        "lux": [
            "Aft-wrap balcony leftover — the wake is the product",
            "Suite gratuities are a line; price them before you tap yes",
        ],
    },
    "cancun": {
        "budget": [
            "Hotel Zone 3-star on the bus strip — garden view on purpose",
            "Skip the timeshare-day “free” upgrade; it is a half-day tax",
        ],
        "mid": [
            "Dreams or Secrets Hotel Zone class — adults-only mid if there are no kids",
            "Confirm the airport transfer is in the rate, not a dock surprise",
        ],
        "lux": [
            "Nizuc / Rosewood Mayakobá class — south of the Zone; a different transfer",
            "One property. Two resorts in a week is a transfer tax",
        ],
    },
    "los_angeles": {
        "budget": [
            "Moxy or a compact Downtown 2-star — walk to Grand Central Market and the Metro",
            "Silver Lake / Echo Park 2-star only if that is the neighborhood you will eat in",
        ],
        "mid": [
            "The LINE Koreatown — late food, one rideshare zone, skip the Valley commute",
            "Kimpton La Peer or a WeHo 3–4 star — one pocket, not beach-plus-hills",
        ],
        "lux": [
            "Pendry West Hollywood — Sunset-adjacent; you will still rideshare to dinner",
            "Shutters or Casa del Mar if the beach is the point — not a WeHo-and-Santa-Monica hop",
        ],
    },
    "nyc": {
        "budget": [
            "citizenM Bowery or a LES compact room — walk to a train, skip Times Square",
            "A Brooklyn 2-star on the G or L — cheaper nights, one subway zone",
        ],
        "mid": [
            "The Hoxton Williamsburg — north Brooklyn restaurants, not a Midtown tower",
            "Arlo Nomad or The Ludlow — compact 3–4 star, subway in the pocket",
        ],
        "lux": [
            "The Greenwich Hotel or The Public class — Downtown, leftover only",
            "One flagship. A second Midtown suite is not Stretch, it is a mistake",
        ],
    },
    "paris": {
        "budget": [
            "2-star near République or Oberkampf — bakery downstairs, Metro in five minutes",
            "Hotel F1 / Ibis Budget on a Metro line if you land late — then own that pocket",
        ],
        "mid": [
            "Hotel near Luxembourg or Bastille — one arrondissement, skip nightly hops",
            "Aparthotel 3–4 star if you will grocery two breakfasts",
        ],
        "lux": [
            "Lutetia-class Left Bank — leftover if the name is the point",
            "Palace breakfast is a line. Mid Paris already eats a US budget",
        ],
    },
    "vegas": {
        "budget": [
            "Downtown Circa-adjacent or a Fremont 2-star — walk the lights, skip the Strip tram math",
            "Palms or a Station property — cheaper room, one rideshare to the Center-Strip",
        ],
        "mid": [
            "Horseshoe or New York-New York — Center-Strip walk, not a suite",
            "Venetian mid-week — huge campus; you came to walk, not to Uber",
        ],
        "lux": [
            "Cosmopolitan or Aria class — Center-Strip suite vibe without inventing a rate",
            "Weekend and holiday weeks double midweek. Price Tuesday if you can",
        ],
    },
    "san_francisco": {
        "budget": [
            "The Marker or a Union Square-adjacent limited-service — BART downstairs",
            "A Tenderloin-edge 2-star only if you know the block; grocery in walking distance",
        ],
        "mid": [
            "Hotel Emeline or a Jackson Square boutique — walk to the Ferry Building",
            "Inn at the Presidio class — quieter; you traded nightlife for the park",
        ],
        "lux": [
            "1 Hotel San Francisco or a waterfront flagship — Embarcadero walk",
            "St. Regis / Four Seasons SoMa — walk to SFMOMA, leftover only",
        ],
    },
    "san_diego": {
        "budget": [
            "Gaslamp limited-service on the trolley — skip Hotel Circle / Mission Valley",
            "Pacific Beach motel class — beach grid if you will not Uber every meal",
        ],
        "mid": [
            "Kona Kai or Shelter Island 3-star — water, still a rideshare to Downtown",
            "Little Italy 3–4 star — walk to dinner, trolley to the park",
        ],
        "lux": [
            "Fairmont Grand Del Mar or Lodge at Torrey Pines — north, car assumed",
            "1 Hotel San Diego or Pendry harbor walk — one waterfront, not Hotel Circle",
        ],
    },
    "miami": {
        "budget": [
            "Collins Avenue 2-star a few blocks off the water — same sand, less neon",
            "Downtown / Brickell limited-service — Metromover; you rideshare to the beach once",
        ],
        "mid": [
            "Renovated Art Deco 3–4 star on Collins — South Beach walk, not Ocean Drive tax",
            "Kimpton EPIC or a Brickell 4-star — bay, better food walking",
        ],
        "lux": [
            "Faena or The Setai — Mid-Beach, quieter than Ocean Drive",
            "Edition or Four Seasons Surf Club — one flagship, not two neighborhoods",
        ],
    },
    "london": {
        "budget": [
            "Premier Inn County Hall or South Bank limited-service — river walk, not a West End rate",
            "Travelodge King’s Cross or Earl’s Court — Zone 1–2, Tesco downstairs",
        ],
        "mid": [
            "The Resident Kensington or a South Ken 3–4 star — museums + Tube",
            "Kimpton Fitzroy / Bloomsbury 4-star — Russell Square pocket",
        ],
        "lux": [
            "Claridge’s or The Connaught — Mayfair leftover only",
            "One Aldwych or Covent Garden Hotel — theatre pocket without a palace rate",
        ],
    },
    "rome": {
        "budget": [
            "Prati guesthouse near Ottaviano — Metro to the Vatican, calmer than the centro",
            "The Beehive or a Termini 2-star — trains, louder nights, pack light",
        ],
        "mid": [
            "Hotel de’ Ricci or Campo de’ Fiori boutique — walk everywhere, skip taxis",
            "Prati 4-star near Ottaviano if the centro is sold out",
        ],
        "lux": [
            "Hassler or Hotel Eden — Spanish Steps / Via Veneto above the crush",
            "Pantheon-adjacent 5-star leftover only — Rome mid plus one dinner often wins",
        ],
    },
    "tokyo": {
        "budget": [
            "Sakura Hotel Jimbocho or an Asakusa hostel-plus — walk to a Metro",
            "Nine Hours capsule only if you packed a cube — Lean crash-pad, not a week",
        ],
        "mid": [
            "The Knot Tokyo Shinjuku or a 4-star near Tokyo Station — trains, not a JR-pass spreadsheet",
            "Hotel Gracery Shinjuku / Shibuya Stream Excel — neighborhood walking",
        ],
        "lux": [
            "Palace Hotel Tokyo or Hoshinoya Tokyo — Imperial-garden or courtyard quiet",
            "Park Hyatt Shinjuku — the view; you still take the Metro to dinner",
        ],
    },
    "oahu": {
        "budget": [
            "The Equus or a Kuhio Avenue 2-star — one block back, same beach",
            "HI Waikiki or a studio condo — kitchenette beats resort breakfast",
        ],
        "mid": [
            "The Laylow or ‘Alohilani — Waikiki 4-star, still no car required",
            "Hilton Hawaiian Village — huge campus; you came for the lagoon, not the boutique",
        ],
        "lux": [
            "Halekulani or Royal Hawaiian — Waikiki luxury if you refuse to leave the grid",
            "Four Seasons Ko Olina or Aulani — west side, car assumed, leftover + kids",
        ],
    },
    "maui": {
        "budget": [
            "Kohea Kai or a South Kihei studio — walk to a food truck, grocery the first hour",
            "Paia 2-star — north shore if you will not sit in Kaanapali traffic",
        ],
        "mid": [
            "Hyatt Regency Maui — Kaanapali Beach, bigger campus",
            "Wailea Ekahi or a Kihei-plus condo — kitchen still wins some dinners",
        ],
        "lux": [
            "Andaz Maui or Four Seasons Maui — same Wailea pocket, leftover only",
            "Hotel Wailea adults-only — quieter hill; you will still drive to dinner",
        ],
    },
    "punta_cana": {
        "budget": [
            "Grand Palladium-adjacent value — confirm the transfer is in the rate",
            "Skip Cap Cana on Lean; Bávaro is the value beach",
        ],
        "mid": [
            "Iberostar Selection Bávaro — all-inclusive, beach",
            "Secrets Cap Cana is Stretch-adjacent; mid stays in Bávaro",
        ],
        "lux": [
            "Eden Roc at Cap Cana — Stretch villa class",
            "Sanctuary Cap Cana — same pocket, not a second island hop",
        ],
    },
    "jamaica": {
        "budget": [
            "Legends or a Negril 3-star walk-to-beach — skip the MoBay hotel restaurant",
            "Price the transfer as its own line; Negril is not next to the runway",
        ],
        "mid": [
            "Moon Palace Jamaica — all-inclusive mid",
            "Couples Swept Away or a Negril 4-star — beach, adults or family by brand",
        ],
        "lux": [
            "Round Hill or Half Moon — villa stretch, MoBay side",
            "Rockhouse or a Negril cliff boutique — leftover, not a fake rate",
        ],
    },
    "barcelona": {
        "budget": [
            "Hotel Jazz or a 2-star Eixample — walk to Passeig de Gràcia",
            "El Born guesthouse — restaurants on the block, skip the Ramblas address",
        ],
        "mid": [
            "H10 Casa Mimosa or Cotton House class — Eixample, Metro in five minutes",
            "W Barcelona is Stretch; mid is Barceloneta 3-star or Born boutique",
        ],
        "lux": [
            "Mandarin Oriental Barcelona — Passeig de Gràcia",
            "Hotel Arts or El Palace — one flagship",
        ],
    },
    "mexico_city": {
        "budget": [
            "Hostal Regina or a Centro hostel-plus — Zócalo walking, noisier nights",
            "Condesa 2-star — park walks, street food on the block",
        ],
        "mid": [
            "The Hoxton Roma or Brick Hotel — walkable Roma",
            "Downtown México or a Centro 4-star — rooftop; you still eat in Roma",
        ],
        "lux": [
            "St. Regis or Las Alcobas Polanco — leftover",
            "Casa Polanco or a design flagship — one pocket",
        ],
    },
    "thailand": {
        "budget": [
            "Lub d or a hostel-plus in Silom / Chiang Mai old city — walk to food stalls",
            "Boutique guesthouse on the Ping or Chao Phraya — fan room is fine",
        ],
        "mid": [
            "Shangri-La-adjacent riverside — river boat to dinner",
            "Chiang Mai Nimman 4-star if you split the trip — one city per stay",
        ],
        "lux": [
            "Capella Bangkok — same river, Stretch",
            "Four Seasons Chiang Mai if the north is the point — do not also buy Phuket mid-trip",
        ],
    },
    "nola": {
        "budget": [
            "The Drifter or a Mid-City motel-plus — Canal streetcar to the Quarter",
            "Henry Howard-adjacent Garden District guesthouse — quieter, still a streetcar",
        ],
        "mid": [
            "The Pontchartrain or a Garden District 3–4 star — St. Charles line",
            "Omni Royal Orleans class — Quarter if you accept the premium",
        ],
        "lux": [
            "Hotel Monteleone — Quarter flagship, leftover",
            "Maison de la Luz or The Chloe — design Stretch",
        ],
    },
    "chicago": {
        "budget": [
            "Hampton or a Loop limited-service — trains downstairs",
            "Fulton Market 2–3 star if you want restaurants over the Mag Mile",
        ],
        "mid": [
            "Hotel Lincoln or a Gold Coast 3–4 star — park and bus",
            "LondonHouse or a River North 4-star — river walk, not a suburban rate",
        ],
        "lux": [
            "The Peninsula Chicago — Mag Mile flagship",
            "St. Regis or Four Seasons — one tower; winter rates are the value window",
        ],
    },
    "amsterdam": {
        "budget": [
            "Ibis Budget near Sloterdijk or Amstel — tram to the center",
            "Hotel Not Hotel or a De Pijp 2-star — neighborhood, pack light",
        ],
        "mid": [
            "Hotel Casa or a De Pijp boutique — restaurants on the block",
            "Conservatorium is Stretch; mid is a canal 4-star without the garden rate",
        ],
        "lux": [
            "Conservatorium — Museumplein leftover",
            "De L’Europe or Waldorf Astoria — one flagship; skip King’s Day and August if you can",
        ],
    },
    "lisbon": {
        "budget": [
            "The Independente or Intendente 2-star — neighborhood restaurants",
            "Alfama guesthouse — views, stairs, grocery the first morning",
        ],
        "mid": [
            "Hotel da Baixa or a 4-star near Rossio — trains and trams",
            "LX Boutique or a Cais do Sodré 3-star — river, nightlife on the block",
        ],
        "lux": [
            "Four Seasons Ritz Lisbon — park-adjacent flagship",
            "Tivoli Avenida Liberdade — one boulevard",
        ],
    },
    "iceland": {
        "budget": [
            "Keflavík Airport Hotel — only the night you land or fly",
            "A 101 guesthouse with a kitchenette — breakfast is Bónus, not the buffet",
        ],
        "mid": [
            "ION City or a harbor 4-star — still not the Blue Lagoon hotel",
            "Selfoss or Vík mid only if this is a road trip — then the car is the lodging plan",
        ],
        "lux": [
            "The Retreat at Blue Lagoon — soak + room, Stretch only",
            "Edition Reykjavík — 101 flagship if you skip the countryside",
        ],
    },
    "bali": {
        "budget": [
            "Ubud jungle guesthouse — rice-terrace walk, not Seminyak prices",
            "Kuta 2-star only as a crash pad near the airport",
        ],
        "mid": [
            "Maya Ubud or a riverside 4-star — one base",
            "Canggu midrise with a pool — still a scooter town",
        ],
        "lux": [
            "Bulgari or Alila Villas Uluwatu — cliff Stretch",
            "Como Uma or a Seminyak villa — one property",
        ],
    },
    "dubai": {
        "budget": [
            "Deira 3-star near a Metro — creek, cheaper nights",
            "Bur Dubai heritage-adjacent 3-star — walk the souk, Metro to Downtown",
        ],
        "mid": [
            "Marina 4-star on the tram — walk the walkway",
            "Palm mid is a different transfer; stay Downtown unless the Palm is the point",
        ],
        "lux": [
            "Atlantis The Palm — Palm Stretch, kids assumed",
            "Burj Al Arab or One&Only — name-brand leftover only",
        ],
    },
}

FOOD_EXTRA = {
    "disney": {
        "budget": [
            "Refillable mug only if you will be on property most meals",
            "Skip a character breakfast on Lean — that is a ticketed meal, not breakfast",
        ],
        "mid": [
            "One snack credit you already priced — Dole Whip or a bakery, not both as a habit",
            "Sci-Fi or 50’s Prime Time over a signature on mid",
        ],
        "lux": [
            "California Grill or Space 220 — book before you fly",
            "Dining plan is still usually a bad buy even on Stretch",
        ],
    },
    "cruise": {
        "budget": [
            "Skip the café latte habit and the gelato pass",
            "Room-service fees add up — use it as a backup, not breakfast",
        ],
        "mid": [
            "One specialty night if leftover covers it — not a nightly habit",
            "Kids soda package is often the only package that wins on a short sailing",
        ],
        "lux": [
            "Chef’s table leftover-only",
            "Unlimited drinks are in Stretch — still run the break-even",
        ],
    },
    "cancun": {
        "budget": [
            "Coffee included; do not buy water you already paid for at the dock",
            "Parque de las Palapas only if the transfer is cheap",
        ],
        "mid": [
            "La Habichuela or a Hotel Zone steakhouse — one off-resort night",
            "Beach-club lunch is a day-price, not a snack",
        ],
        "lux": [
            "Puerto Morelos dinner leftover — a different transfer",
            "Le Blanc / Zilara specialty rooms leftover-only",
        ],
    },
    "los_angeles": {
        "budget": [
            "Stay in Koreatown / DTLA / the beach you picked — do not cross the basin for tacos",
            "Mariscos Jalisco or a taco truck is lunch, not a food tour",
        ],
        "mid": [
            "Quarter / Kang Ho Dong K-Town BBQ or Bestia if you booked ahead",
            "Langer’s deli over a hotel restaurant",
        ],
        "lux": [
            "Providence or n/naka — book before you fly",
            "Hotel restaurants and a WeHo-to-Santa-Monica dinner are the overrun",
        ],
    },
    "nyc": {
        "budget": [
            "Xi’an Famous Foods, a $1–3 slice, or Flushing / Chinatown — not three Midtown salads",
            "Bodega egg-and-cheese is breakfast; the hotel dining room is a tax",
        ],
        "mid": [
            "Katz’s (share) or Russ & Daughters — then a park",
            "Jackson Heights / Flushing / Chinatown over Midtown",
        ],
        "lux": [
            "Carbone, Lilia, or Le Bernardin class — leftover only",
            "One tasting, not a tasting every night",
        ],
    },
    "paris": {
        "budget": [
            "L’As du Fallafel or a neighborhood bistro — not the tower",
            "Skip restaurants on the hill, the museum steps, and the tower",
        ],
        "mid": [
            "Bouillon Julien or Marché des Enfants Rouges",
            "Fromagerie + wine is a valid dinner",
        ],
        "lux": [
            "Septime, Frenchie, or Le Comptoir — book before you fly",
            "Palace-hotel dining only if leftover is silly",
        ],
    },
    "vegas": {
        "budget": [
            "Chinatown or Downtown, not a Strip steakhouse",
            "Free drinks are not a meal plan",
        ],
        "mid": [
            "Tacos El Gordo class or a food hall — walk ten minutes off the carpet",
            "Mon Ami Gabi or a neighborhood sit-down — one",
        ],
        "lux": [
            "Picasso / Guy Savoy class leftover-only",
            "One splurge, not a steak every night",
        ],
    },
    "san_francisco": {
        "budget": [
            "La Taqueria / El Farolito class — Mission, stay on BART / Muni",
            "Skip the Wharf seafood rack",
        ],
        "mid": [
            "State Bird, Zuni, or a neighborhood Italian — one reservation",
            "Napa is a day trip with a packed lunch, not a dinner transfer",
        ],
        "lux": [
            "Atelier Crenn or Benu leftover-only",
            "One tasting, then neighborhood food",
        ],
    },
    "san_diego": {
        "budget": [
            "Fish tacos in PB or a Barrio Logan truck",
            "Skip the harbor dinner-cruise menu",
        ],
        "mid": [
            "Little Italy or North Park sit-down — one",
            "La Jolla dinner only if you are already there",
        ],
        "lux": [
            "Addison (Del Mar) leftover-only",
            "One splurge; Stretch does not require a steak at noon",
        ],
    },
    "miami": {
        "budget": [
            "Versailles or a ventanita — not Ocean Drive",
            "Skip beach-club bottle service on Lean",
        ],
        "mid": [
            "Joe’s Stone Crab (share) or a Wynwood table — one",
            "Brickell if that is where you slept",
        ],
        "lux": [
            "A named tasting leftover",
            "One beach-club afternoon is a day-price",
        ],
    },
    "london": {
        "budget": [
            "Borough or Maltby market, or a pub pie",
            "Meal deal is allowed; a tourist-menu roast is not the plan",
        ],
        "mid": [
            "Dishoom, a Soho table, or a neighborhood Indian — one reservation",
            "West End prix fixe only after theatre, not every night",
        ],
        "lux": [
            "Core or Kitchen Table leftover-only",
            "£8 pints are already in the luxury math",
        ],
    },
    "rome": {
        "budget": [
            "Supplì or pizza al taglio in Testaccio or Trastevere",
            "Skip the photo-menu on a square",
        ],
        "mid": [
            "Roscioli-adjacent or a Testaccio table — one reserved trattoria",
            "Coperto is a line item, not a scam",
        ],
        "lux": [
            "La Pergola leftover-only",
            "One splurge, then trattoria",
        ],
    },
    "tokyo": {
        "budget": [
            "Conveyor or standing sushi, or a ramen shop",
            "Skip the hotel breakfast buffet",
        ],
        "mid": [
            "Depachika lunch + one izakaya reservation",
            "Rail-station food halls are mid, not a tourist trap",
        ],
        "lux": [
            "A sushi counter booked before you land",
            "The room or the counter, rarely both",
        ],
    },
    "oahu": {
        "budget": [
            "Rainbow Drive-In / L&L plate lunch",
            "Leonard’s malasadas once, not as a meal",
        ],
        "mid": [
            "Marukame or a neighborhood Japanese / seafood — one sit-down",
            "Skip nightly Kalakaua restaurant rows",
        ],
        "lux": [
            "Alan Wong’s or Senia leftover-only",
            "One splurge, not five fish dinners",
        ],
    },
    "maui": {
        "budget": [
            "Food truck in Kihei or Paia",
            "Cook two nights; skip the resort breakfast buffet",
        ],
        "mid": [
            "One fish dinner, not five",
            "Paia or Lahaina casual over the hotel dining room",
        ],
        "lux": [
            "Mama’s Fish House leftover-only",
            "One named reservation, then the kitchen",
        ],
    },
    "punta_cana": {
        "budget": [
            "One beach-shack lunch is enough of a taste",
            "Skip dock-priced excursion food",
        ],
        "mid": [
            "One pre-booked off-property dinner if the transfer is in the plan",
            "Cap Cana restaurants are a different pocket",
        ],
        "lux": [
            "One Cap Cana or named tasting leftover",
            "Still not a nightly off-property hop",
        ],
    },
    "jamaica": {
        "budget": [
            "Jerk lunch off-property once, with a trusted driver",
            "Buy rum as a bottle, not a round",
        ],
        "mid": [
            "One off-property dinner with a pre-booked driver",
            "Skip the dock kiosk",
        ],
        "lux": [
            "Sandals / Couples specialty rooms are the Stretch product",
            "Transfer time is still a cost",
        ],
    },
    "barcelona": {
        "budget": [
            "Vermut + conservas, not a Ramblas paella",
            "Mercado lunch is allowed",
        ],
        "mid": [
            "One seafood dinner in Barceloneta if leftover exists",
            "Eixample or Born, not the Ramblas",
        ],
        "lux": [
            "Disfrutar leftover-only",
            "One splurge",
        ],
    },
    "mexico_city": {
        "budget": [
            "Mercado or street tacos — Condesa or Juárez, not the hotel",
            "Skip Polanco hotel dining on Lean",
        ],
        "mid": [
            "Contramar lunch or a neighborhood table — one reservation",
            "Street tacos still win one night",
        ],
        "lux": [
            "Pujol or Quintonil leftover-only",
            "One tasting",
        ],
    },
    "thailand": {
        "budget": [
            "Street stall + mango sticky rice",
            "Hotel breakfast buffets are optional",
        ],
        "mid": [
            "One riverside or Sukhumvit sit-down",
            "Hotel Italian is the trap",
        ],
        "lux": [
            "A named riverside or tasting leftover",
            "One splurge; Stretch does not require a mall",
        ],
    },
    "nola": {
        "budget": [
            "Po’boy (Parkway or a neighborhood shop), not a Bourbon breakfast",
            "Café du Monde once",
        ],
        "mid": [
            "Galatoire’s or Commander’s Palace class — one old-school reservation",
            "Keep the reservation; cut the hotel class first",
        ],
        "lux": [
            "Commander’s, Galatoire’s, or a modern tasting leftover",
            "Keep the reservations; cut something else",
        ],
    },
    "chicago": {
        "budget": [
            "Italian beef or a tavern — neighborhood, not the hotel",
            "One deep-dish if you must, then stop",
        ],
        "mid": [
            "One reservation in Fulton Market or Logan Square",
            "Skip Mag Mile dining",
        ],
        "lux": [
            "Alinea leftover-only",
            "One tasting",
        ],
    },
    "amsterdam": {
        "budget": [
            "Brown café, not a canal-cruise buffet",
            "Skip the pancake-house on the Damrak",
        ],
        "mid": [
            "One Indonesian rijsttafel if leftover covers it",
            "Two streets off the canal",
        ],
        "lux": [
            "A named tasting leftover",
            "One splurge",
        ],
    },
    "lisbon": {
        "budget": [
            "Tasca in Graça or Campo de Ourique",
            "Pastel de nata is a snack, plus coffee — not a meal plan",
        ],
        "mid": [
            "One seafood dinner in Cais do Sodré or Belém",
            "Not every night",
        ],
        "lux": [
            "A named tasting leftover",
            "One splurge",
        ],
    },
    "iceland": {
        "budget": [
            "Packed lunch on road days",
            "Skip the hotel breakfast buffet unless it is included",
        ],
        "mid": [
            "One proper 101 fish dinner",
            "Hot-dog stand is allowed",
        ],
        "lux": [
            "A named 101 or a lodge table leftover",
            "Do not eat every meal out on a Ring Road week",
        ],
    },
    "bali": {
        "budget": [
            "Warung again at dinner — that is the good food",
            "Bintang on the beach is not a $40 cocktail program",
        ],
        "mid": [
            "One nice dinner in Seminyak or Ubud",
            "Hotel Italian is the trap",
        ],
        "lux": [
            "A named Seminyak or Ubud table leftover",
            "One splurge",
        ],
    },
    "dubai": {
        "budget": [
            "Creekside or Deira, not a mall every day",
            "Skip the fountain-view restaurant on Lean",
        ],
        "mid": [
            "One destination dinner if leftover is real",
            "Mall food courts are a fallback",
        ],
        "lux": [
            "A named tasting leftover",
            "One splurge weekend, not seven",
        ],
    },
}

ACT_EXTRA = {
    "disney": {
        "budget": [
            "One park per day — cheaper park after Magic Kingdom (ticketed)",
            "Skip a water-park add-on on Lean (ticketed)",
        ],
        "mid": [
            "Lightning Lane on Magic Kingdom or Hollywood Studios day only (ticketed)",
            "One Disney Springs evening (free)",
        ],
        "lux": [
            "Signature dinner + fireworks leftover-only (ticketed)",
            "Memory Maker only if leftover covers it (ticketed)",
        ],
    },
    "cruise": {
        "budget": [
            "Ship shows and the pool — already in the fare (free)",
            "Skip the spa menu on Lean",
        ],
        "mid": [
            "Snorkel or beach-break on one island, not three (ticketed)",
            "Skip the third dock tour (ticketed)",
        ],
        "lux": [
            "A quieter private beach or small-group tour on one island (tour)",
            "Spa leftover-only — already its own line",
        ],
    },
    "los_angeles": {
        "budget": [
            "The Broad or a free museum night Downtown (free / timed)",
            "Do not stack Universal and Disneyland into this lodging week",
        ],
        "mid": [
            "Huntington or Getty Villa — pick one garden day (ticketed / timed)",
            "Venice + Santa Monica in the neighborhood you booked (free)",
        ],
        "lux": [
            "Universal Express leftover-only (ticketed)",
            "A private architecture walk if leftover covers a guide (tour)",
        ],
    },
    "nyc": {
        "budget": [
            "A pay-what-you-wish museum night or a timed free hour (cheap)",
            "Times Square is a pass-through, not a day",
        ],
        "mid": [
            "Met or MoMA — pick one (ticketed)",
            "Central Park is free; a carriage is not required",
        ],
        "lux": [
            "Broadway reserved seat + one observatory (ticketed)",
            "Skip stacking three observatories",
        ],
    },
    "paris": {
        "budget": [
            "Eiffel from Trocadéro or Champ de Mars, not the summit on Lean (free)",
            "Père Lachaise or Canal Saint-Martin walk (free)",
        ],
        "mid": [
            "Sainte-Chapelle or a tower summit — pick one (ticketed)",
            "Marais or Latin Quarter neighborhood walk (free)",
        ],
        "lux": [
            "Versailles half-day leftover (ticketed)",
            "Catacombs or a reserved Sainte-Chapelle concert leftover (ticketed)",
        ],
    },
    "vegas": {
        "budget": [
            "Bellagio conservatory + Fremont walk (free)",
            "Skip a nightclub table on Lean",
        ],
        "mid": [
            "One show — O, a mid-room, or a production (ticketed)",
            "Red Rock if you have a car (free / cheap)",
        ],
        "lux": [
            "A helicopter or Grand Canyon day leftover-only (tour)",
            "One spa or pool-day cabana leftover (ticketed)",
        ],
    },
    "san_francisco": {
        "budget": [
            "Mission murals or Chinatown walk (free)",
            "Skip the paid cable-car loop if a bus reaches the same hill",
        ],
        "mid": [
            "SFMOMA or de Young — pick one (ticketed)",
            "Alcatraz timed ferry — book ahead (ticketed)",
        ],
        "lux": [
            "Muir Woods or a Napa small-group leftover (tour)",
            "Do not stack Alcatraz, Napa, and Yosemite in 5 nights",
        ],
    },
    "san_diego": {
        "budget": [
            "Harbor walk or Coronado ferry (cheap)",
            "Skip SeaWorld on Lean unless that is the trip",
        ],
        "mid": [
            "Zoo or USS Midway — pick one (ticketed)",
            "La Jolla cove snorkel if you are already north (cheap / ticketed)",
        ],
        "lux": [
            "Safari Park leftover (ticketed)",
            "Mexico day trip is a different budget",
        ],
    },
    "miami": {
        "budget": [
            "Little Havana walk + Cuban coffee (cheap)",
            "Everglades is a half-day tour, not a Lean default",
        ],
        "mid": [
            "Vizcaya or a boat — pick one (ticketed)",
            "Art Deco walk on Ocean Drive in daylight (free)",
        ],
        "lux": [
            "A reserved boat leftover (tour)",
            "Do not stack a cruise embarkation into this stay without a buffer night",
        ],
    },
    "london": {
        "budget": [
            "British Museum or National Gallery (free)",
            "Skip a paid Eye ticket on Lean",
        ],
        "mid": [
            "Tower, Eye, or a West End rush — pick one (ticketed)",
            "Greenwich or Columbia Road (free / cheap)",
        ],
        "lux": [
            "West End reserved seat + one iconic ticket (ticketed)",
            "Windsor / Bath leftover (ticketed / tour)",
        ],
    },
    "rome": {
        "budget": [
            "Trastevere evening walk (free)",
            "Skip the golf-cart forum tour",
        ],
        "mid": [
            "Vatican Museums or Borghese — pick one (ticketed)",
            "Fountains at dusk are free",
        ],
        "lux": [
            "Colosseum + Vatican on different days (ticketed)",
            "A small-group catacombs or food walk leftover (tour)",
        ],
    },
    "tokyo": {
        "budget": [
            "Senso-ji and the river — Asakusa (free)",
            "Convenience-store picnic in a park (cheap)",
        ],
        "mid": [
            "teamLab, a tower, or a museum — pick one (ticketed)",
            "Kamakura or Nikko only if leftover covers the JR math (ticketed)",
        ],
        "lux": [
            "A guided food walk leftover (tour)",
            "Kyoto is a different trip — do not fake it as a Tokyo day",
        ],
    },
    "oahu": {
        "budget": [
            "Pearl Harbor is ticketed and somber — one morning, not a beach day",
            "Skip a circle-island tour on Lean; the bus is slower and cheaper",
        ],
        "mid": [
            "Hanauma Bay — reserve (ticketed)",
            "Lanikai lookout + Kailua is a car day (free / car)",
        ],
        "lux": [
            "A small-group snorkel leftover (tour)",
            "Do not stack a neighbor-island hop into 5 nights without a second fare",
        ],
    },
    "maui": {
        "budget": [
            "Skip Road to Hana as a rushed day on Lean",
            "Sunrise from a parking lot you already paid, not a tour van",
        ],
        "mid": [
            "Haleakalā sunrise is ticketed and a 2 a.m. wake-up — pick it on purpose",
            "A second beach day still (free)",
        ],
        "lux": [
            "Molokini boat leftover-only (tour)",
            "Do not stack Hana, Haleakalā, and a boat in 4 days",
        ],
    },
    "cancun": {
        "budget": [
            "Snorkel from the property if the reef is there (included / cheap)",
            "Skip the dock-priced catamaran on Lean",
        ],
        "mid": [
            "Isla Mujeres ferry or a cenote — pick one (ticketed / ferry)",
            "Chichén Itzá only if leftover covers a trusted tour (tour)",
        ],
        "lux": [
            "A small-group ruin or whale-shark season leftover (tour)",
            "Tulum ruins + beach is a different lodging math",
        ],
    },
}

# Full first-class recs for 20 new US dests + remaining catalog dests.
# Each: hotels {why_b,b,why_m,m,why_l,l}, food {note,b,m,l}, acts {b,m,l}

def rec(hotels, food, acts):
    return {"hotels": hotels, "food": food, "acts": acts}


NEW = {}

NEW["anaheim"] = rec(
    (
        "Harbor Blvd / Downtown Disney walking. A cheap LA room plus a 90-minute transfer is not Lean.",
        [
            "Candy Cane Inn — classic Harbor Blvd, walk or a short shuttle to the gates",
            "Tropicana Inn or Castle Inn & Suites — value, request a room away from the boulevard if you can",
            "Anaheim Desert Inn & Suites — limited-service, walk to Downtown Disney",
            "Howard Johnson Anaheim or a Harbor 2-star — garden-court, skip a Santa Monica hotel",
            "Pixar Place is mid; Lean stays off-property and groceries breakfast",
        ],
        "One Disney hotel or a GardenWalk 3–4 star. Parking is a line if you rent a car you will not use.",
        [
            "Pixar Place Hotel — on-property, walk to Downtown Disney, still a bus or walk to the gates",
            "Hotel Lulu — walkable to the parks, no monorail premium",
            "Hilton Anaheim or Anaheim Marriott — Convention Center campus, walk or a short shuttle",
            "Desert Palms Hotel & Suites — suite-ish mid if the party will share a kitchenette",
            "Stay in Anaheim. Los Angeles lodging is a different day trip",
        ],
        "Grand Californian or Disneyland Hotel — leftover only. Club level is a nightly number.",
        [
            "Disney’s Grand Californian — Deluxe, walk to California Adventure",
            "Disneyland Hotel — on-property, monorail-adjacent campus",
            "JW Marriott Anaheim Resort — off-property Stretch with a real pool",
            "The Westin Anaheim Resort — newer tower, still a shuttle or walk",
            "Do not also book a Santa Monica night in the same 5-night week",
        ],
    ),
    (
        "Park food is the overrun. Grocery breakfast and one table-service beat a dining plan.",
        [
            "Breakfast: grocery run (Albertsons / Target) + a Downtown Disney bakery",
            "Lunch: mobile-order QS in the park you already paid to enter",
            "Dinner: Harbor Blvd casual or Downtown Disney QS — skip character dining on Lean",
            "Porto’s is a Burbank / Downey detour, not an Anaheim breakfast",
            "Refillable mug only if you will be on property most meals",
        ],
        [
            "Breakfast: food-court or hotel included only if it is in the rate",
            "Lunch: QS + one snack you already priced",
            "Dinner: one table-service — Carthay Circle or Lamplight Lounge if leftover covers it",
            "Downtown Disney sit-down over a character breakfast on mid",
            "Skip the dining plan; pay as you go",
        ],
        [
            "Breakfast: one character meal leftover-only — book before you fly",
            "Lunch: QS or a second table-service, not three sit-downs",
            "Dinner reservation: Napa Rose or Carthay Circle — leftover",
            "Club 33 is not a plan",
            "Dining plan is still usually a bad buy on Stretch",
        ],
    ),
    (
        [
            "One park per day — Disneyland or California Adventure, no Hopper (ticketed)",
            "Rope drop + mobile order; skip Lightning Lane on Lean (free tactic)",
            "Downtown Disney evening, not a third ticketed thing (free)",
            "This lodging is Anaheim — not a Getty / Griffith / Universal stack",
            "Halloween Time and Christmas weeks are peak; price the month first",
        ],
        [
            "Hopper only if you will switch parks midday (ticketed)",
            "Lightning Lane on the Disneyland park day, not both days (ticketed)",
            "One Downtown Disney or hotel-hop evening (free)",
            "Skip a third-party tour of “homes of the stars” from here",
            "Universal Studios is a Los Angeles day with its own ticket math",
        ],
        [
            "Park Hopper + Lightning Lane (ticketed)",
            "Early entry from a Deluxe hotel (included with that lodging)",
            "World of Color / fireworks dining leftover-only (ticketed)",
            "A second park day still beats a Hollywood add-on from Anaheim",
            "Do not stack Disneyland, Universal, and a beach day in 4 nights",
        ],
    ),
)

# Remaining 19 new US dests live in recs_new_us.py so this file stays importable.
from recs_new_us import NEW as NEW_MORE
from recs_rest import REST, ACTS_ONLY
from recs_hotel_brands import HOTEL_REBALANCE, FALLBACK_REBALANCE

NEW.update(NEW_MORE)
NEW.update(REST)


FALLBACK_HOTEL_EXTRA = {
    "ai": {
        "budget": ["Garden-view on purpose — ocean-view is an upsell", "Confirm the airport transfer is in the rate"],
        "mid": ["Adults-only 4-star if there are no kids", "One property, not a two-resort hop"],
        "lux": ["Overwater or swim-up leftover-only", "Villa only if leftover covers the jump from mid"],
    },
    "domestic": {
        "budget": ["Neighborhood 2-star with a grocery in walking distance", "Skip airport lodging except the night you fly"],
        "mid": ["Inn or 3-star in the restaurant neighborhood", "One room, not a suite, unless leftover is real"],
        "lux": ["Historic grande dame or park-adjacent 5-star", "Do not also buy every paid tour"],
    },
    "europe": {
        "budget": ["2-star walk-up near a market street — pack light, stairs are common", "Airport-strip hotels are a taxi tax"],
        "mid": ["Aparthotel 4-star if you will grocery two breakfasts", "Hotel near the main station only if you arrive late"],
        "lux": ["Design flagship with a real neighborhood, not a ring-road spa", "Suite with a view leftover-only"],
    },
    "hawaii": {
        "budget": ["2-star a block off the sand — same beach, less resort fee", "Skip a rental car if the bus reaches the beach and the store"],
        "mid": ["Condo-plus in the same beach town if you will cook two dinners", "Request garden vs ocean on purpose"],
        "lux": ["Adults-only or villa if leftover is real", "Do not also book every snorkel and helicopter"],
    },
    "caribbean": {
        "budget": ["Garden-view AI — skip the ocean-view upsell", "Town guesthouse only if you will eat out and take local buses"],
        "mid": ["Adults-only 4-star if there are no kids", "Transfer in the rate, not a dock surprise"],
        "lux": ["Overwater or cliff villa leftover-only", "One island, one resort"],
    },
    "mexico": {
        "budget": ["Riu / Palace-class AI if this is a beach week", "Skip the ocean-view upsell and the timeshare pitch"],
        "mid": ["Hyatt Ziva / Live Aqua class if all-inclusive is the point", "One neighborhood — traffic is the hidden cost"],
        "lux": ["Adults-only beach premium", "One property"],
    },
    "asia": {
        "budget": ["Hostel-plus in the old city or night-market pocket", "Convenience-store breakfast is the plan, not a compromise"],
        "mid": ["Riverside or night-market-adjacent boutique", "One city base — skip the three-island hop"],
        "lux": ["Ryokan or courtyard hotel if that is the point of the trip", "Suite leftover-only"],
    },
    "oceania": {
        "budget": ["Neighborhood 3-star, not the airport strip", "Apartment with a kitchen if the stay is 5+ nights"],
        "mid": ["Boutique in the walkable core", "Campervan only if that is the trip — it replaces the hotel line"],
        "lux": ["Wilderness lodge leftover-only", "One base"],
    },
    "africa": {
        "budget": ["City 3-star near a tram or BRT", "Skip the hotel dinner most nights"],
        "mid": ["4-star near the waterfront or medina edge", "One city, then a separate lodge line if you add safari"],
        "lux": ["Cape or Nile flagship", "Do not double-pay for every optional excursion"],
    },
    "middleeast": {
        "budget": ["Heritage-district 3-star — souk walking", "Skip the Marina address on a Lean week"],
        "mid": ["Palm or Downtown — pick one pocket", "Hotel breakfast only when it is in the rate"],
        "lux": ["Palm or Downtown flagship — one", "Desert camp only if leftover covers a night out of the city"],
    },
    "latam": {
        "budget": ["Value AI only if this is a beach week", "Altitude and street food are the trip in the cities"],
        "mid": ["Iberostar / Hyatt Ziva class if all-inclusive", "One base — intercity buses need their own night"],
        "lux": ["Relais-style casa leftover", "One property"],
    },
    "city": {
        "budget": ["Airport hotel only the night you fly", "Kitchenette if grocery breakfasts are the plan"],
        "mid": ["Brand 4-star on transit", "Location over a rooftop you will use twice"],
        "lux": ["Park- or water-adjacent flagship", "Do not also buy every paid tour"],
    },
}

FALLBACK_FOOD_EXTRA = {
    "ai": {
        "budget": ["Tips and bottled water you already paid for are the leak", "One beach-town lunch only with a pre-booked ride"],
        "mid": ["Premium in-resort nights are the mid upgrade", "Beach-club lunch is a day-price"],
        "lux": ["Specialty rooms leftover-only", "Still not a nightly hop"],
    },
    "domestic": {
        "budget": ["Hotel restaurants are the expensive version of the same plate", "Food hall or a neighborhood counter at lunch"],
        "mid": ["One reserved neighborhood table", "Stay on transit — a crosstown dinner is a second fare"],
        "lux": ["One named tasting leftover-only", "One splurge, not a tasting every night"],
    },
    "europe": {
        "budget": ["Grocery one picnic", "Neighborhood trattoria / tasca / bistro — not the monument square"],
        "mid": ["Wine from a shop is a valid dinner", "One reserved bistro"],
        "lux": ["A named table booked before you fly", "Palace-hotel dining leftover-only"],
    },
    "hawaii": {
        "budget": ["Malasadas or shave ice once, not as a meal", "Plate lunch or a food truck"],
        "mid": ["One fish sit-down", "Skip nightly resort rows"],
        "lux": ["One named table leftover", "Do not stack every fish dinner"],
    },
    "caribbean": {
        "budget": ["Coffee included", "Skip dock kiosks"],
        "mid": ["Packed lunch on excursion days", "Transfer is part of the food price"],
        "lux": ["Specialty rooms leftover-only", "One island"],
    },
    "mexico": {
        "budget": ["AI guests: eat on-property plus one taco night", "Dinner in the neighborhood, not the hotel"],
        "mid": ["One reservation", "Stay in one colonia"],
        "lux": ["A named tasting leftover", "One splurge"],
    },
    "asia": {
        "budget": ["Skip the hotel buffet", "Izakaya / night market / neighborhood shop"],
        "mid": ["Station depachika is mid, not a trap", "One reservation"],
        "lux": ["A counter or tasting booked before you land", "The room or the counter, rarely both"],
    },
    "oceania": {
        "budget": ["Skip hotel restaurants", "Food hall or a counter"],
        "mid": ["One reservation", "One city"],
        "lux": ["A named table leftover", "One splurge"],
    },
    "africa": {
        "budget": ["Buy water in a shop", "Neighborhood, not the tourist row"],
        "mid": ["One reservation", "Trusted driver if you leave the core"],
        "lux": ["A named table leftover", "Lodge dinners are already priced — do not add a second tasting"],
    },
    "middleeast": {
        "budget": ["Skip the desert-tour buffet upsell", "Cheap eats away from the icon"],
        "mid": ["One destination restaurant", "Metro, not a taxi to every meal"],
        "lux": ["A named tasting leftover", "One weekend splurge"],
    },
    "latam": {
        "budget": ["AI: on-property plus one local lunch", "Market or a counter"],
        "mid": ["One reservation", "One distrito per night"],
        "lux": ["A named tasting leftover", "One splurge"],
    },
    "city": {
        "budget": ["Transit card beats taxis to dinner", "Market or food hall"],
        "mid": ["One reserved table", "Stay in one neighborhood"],
        "lux": ["One named leftover", "One splurge"],
    },
}

FALLBACK_ACT_EXTRA = {
    "ai": {
        "budget": ["Snorkel from the property if it exists (included / cheap)", "Skip the dock-priced catamaran on Lean"],
        "mid": ["A second dock tour is the overrun", "Nightlife on-property first"],
        "lux": ["One better boat or ruin day, not three (ticketed)", "Spa leftover-only"],
    },
    "domestic": {
        "budget": ["Transit day pass beats a rideshare loop", "Skip a hop-on bus on Lean"],
        "mid": ["A second cheap / free morning (free)", "Day trips need their own lunch and transfer"],
        "lux": ["A neighborhood walk still (free)", "Do not stack three paid towers"],
    },
    "europe": {
        "budget": ["A neighborhood that is not the postcard square (free)", "Skip the hop-on bus"],
        "mid": ["A second museum or a garden (ticketed / free)", "Day trip only if leftover covers the train"],
        "lux": ["A small-group walk leftover (tour)", "Do not stack a palace, a catacomb, and a dinner cruise in one day"],
    },
    "hawaii": {
        "budget": ["Grocery picnic (cheap)", "Skip the circle-island van on Lean"],
        "mid": ["A scenic drive only if you already have the car (car)", "Sunrise tickets are a 2 a.m. choice — pick on purpose"],
        "lux": ["One ticketed sunrise or bay, not both (ticketed)", "Neighbor-island hops are a second fare"],
    },
    "caribbean": {
        "budget": ["Skip the first dock kiosk", "Snorkel from shore if the reef is there (cheap)"],
        "mid": ["A second tour is the overrun", "Nightlife on-property first"],
        "lux": ["Beach still wins (included)", "Spa leftover-only"],
    },
    "mexico": {
        "budget": ["One museum if the city has a great free or cheap one (ticketed / cheap)", "Skip timeshare-day tours"],
        "mid": ["Beach or centro for the rest", "Long ruin days need a trusted driver"],
        "lux": ["A neighborhood morning still (free)", "Do not stack two ruin days and a beach club"],
    },
    "asia": {
        "budget": ["Convenience-store picnic in a park (cheap)", "A neighborhood that is not the first postcard (free)"],
        "mid": ["A short rail day trip only if leftover covers it (ticketed)", "Skip a five-temple checklist"],
        "lux": ["A neighborhood morning still (free)", "A second city is a different trip"],
    },
    "oceania": {
        "budget": ["One cheap ferry if that is the postcard (cheap)", "Skip every adventure add-on on Lean"],
        "mid": ["A day trip only if leftover covers it (tour / car)", "Wildlife tours are mid, not automatic"],
        "lux": ["A free walk still (free)", "Do not stack every adventure"],
    },
    "africa": {
        "budget": ["Skip a safari-priced day if this is a city week", "Trusted driver > random taxis for longer hops"],
        "mid": ["A second cheap morning (free / cheap)", "Safari is a different lodging line"],
        "lux": ["A walk still (free)", "Do not double-pay optional lodge extras"],
    },
    "middleeast": {
        "budget": ["Skip the desert-tour upsell on day one", "Metro to the icon, photograph from the street first"],
        "mid": ["A souk morning (free)", "Summer midday is indoor on purpose"],
        "lux": ["A heritage walk still (free)", "Luxury is a weekend of activities, not seven paid tours"],
    },
    "latam": {
        "budget": ["One cheap museum or a mercado (cheap)", "Skip the tourist-taxi loop"],
        "mid": ["Altitude days need slack, not a second tour", "Trusted driver for longer hops"],
        "lux": ["A walk still (free)", "Do not stack two long tours and a late dinner"],
    },
    "city": {
        "budget": ["Skip the hop-on bus", "Transit pass beats a taxi loop"],
        "mid": ["A second cheap morning (free)", "Day trips need lunch and a transfer"],
        "lux": ["A neighborhood walk still (free)", "Do not stack three paid towers"],
    },
}


def emit_thicken_hotels() -> str:
    lines = ["  function thickenHotels() {"]
    for dest, bands in HOTEL_EXTRA.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendHotel({js_str(dest)}, {js_str(style)}, [{extras_js}]);")
    lines.append("  }")
    return "\n".join(lines)


def emit_thicken_food() -> str:
    lines = ["  function thickenFood() {"]
    for dest, bands in FOOD_EXTRA.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendFood({js_str(dest)}, {js_str(style)}, [{extras_js}]);")
    lines.append("  }")
    return "\n".join(lines)


def emit_thicken_acts() -> str:
    lines = ["  function thickenActs() {"]
    for dest, bands in ACT_EXTRA.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendAct({js_str(dest)}, {js_str(style)}, [{extras_js}]);")
    lines.append("  }")
    return "\n".join(lines)


def emit_fallback_thicken() -> str:
    lines = ["  function thickenFallbacks() {"]
    for key, bands in FALLBACK_HOTEL_EXTRA.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendFallbackHotel({js_str(key)}, {js_str(style)}, [{extras_js}]);")
    for key, bands in FALLBACK_FOOD_EXTRA.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendFallbackFood({js_str(key)}, {js_str(style)}, [{extras_js}]);")
    for key, bands in FALLBACK_ACT_EXTRA.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendFallbackAct({js_str(key)}, {js_str(style)}, [{extras_js}]);")
    lines.append("  }")
    return "\n".join(lines)


def emit_full_recs() -> str:
    chunks = ["  function installFullRecs() {"]
    for dest_id, data in NEW.items():
        h = data["hotels"]
        f = data["food"]
        a = data["acts"]
        chunks.append(f"    P.HOTEL_EXAMPLES[{js_str(dest_id)}] = {hotel_block(*h)};")
        chunks.append(f"    P.FOOD_PICKS[{js_str(dest_id)}] = {food_block(*f)};")
        chunks.append(f"    P.ACTIVITIES[{js_str(dest_id)}] = {act_block(*a)};")
    chunks.append("  }")
    return "\n".join(chunks)


# Unique extras — first-pass extras sometimes duplicated existing picks.
HOTEL_PATCH = {
    "punta_cana": {
        "mid": ["Bávaro 4-star garden-view if Cap Cana is sold — stay on the value beach"],
        "lux": ["One Cap Cana campus. A second resort hop is a transfer tax"],
    },
    "lisbon": {
        "budget": ["A Graça or Alfama walk-up with a grocery on the block", "Skip a miradouro hotel on Lean — the view is free from the street"],
        "mid": ["A Príncipe Real 3–4 star — walk downhill to dinner", "One neighborhood. Do not change hills nightly"],
    },
    "barcelona": {
        "budget": ["A Gràcia 2-star on a Metro line — restaurants on the block", "Skip Las Ramblas addresses on Lean"],
        "mid": ["An Eixample 3–4 star near Passeig de Gràcia Metro", "One neighborhood — Born or Eixample, not both"],
    },
    "amsterdam": {
        "budget": ["A Jordaan-adjacent 2-star — pack light, stairs are the elevator", "Skip a canal-house rate on Lean if a tram 3-star is cheaper"],
        "mid": ["A canal 3–4 star two streets off Damrak", "De Pijp or Jordaan — pick one"],
    },
    "iceland": {
        "lux": ["One 101 flagship or one countryside lodge — not both in 4 nights"],
    },
    "nola": {
        "budget": ["A Warehouse District 2-star on the streetcar", "Skip a Bourbon balcony on Lean — the music is on the sidewalk"],
        "mid": ["A Marigny or CBD 3–4 star — walk to dinner", "Garden District if leftover covers the quieter nights"],
    },
    "thailand": {
        "budget": ["A Khao San-adjacent guesthouse only as a crash pad — Silom / old city is quieter", "Fan room + a stall downstairs is the Lean product"],
        "mid": ["A Sukhumvit 3–4 star near a BTS", "One city base — Bangkok or Chiang Mai, not a nightly hop"],
        "lux": ["One river hotel. Three island hops are a different budget"],
    },
    "bali": {
        "budget": ["A Canggu homestay — walk to a warung, scooter for the beach", "Skip Seminyak rates on Lean"],
        "mid": ["A Seminyak boutique if the beach clubs are the point", "One base — Ubud or the coast"],
        "lux": ["One villa. Three mediocre resorts is not Stretch"],
    },
    "dubai": {
        "budget": ["A Rove-class compact room on the Metro", "Skip a Marina address on Lean"],
        "mid": ["A Downtown 4-star near a Metro — not a taxi habit", "Palm or Downtown — pick one pocket"],
        "lux": ["One icon hotel as a weekend, not a week"],
    },
    "chicago": {
        "mid": ["A River North 4-star on the river walk", "Fulton Market if restaurants are the point"],
    },
    "tokyo": {
        "lux": ["One Ginza or Marunouchi flagship — you still take the Metro to dinner"],
    },
    "paris": {
        "mid": ["A 5th–6th or 10th–11th 3-star — one arrondissement"],
    },
}

FALLBACK_HOTEL_PATCH = {
    "europe": {"lux": ["One palace or design hotel — mid Europe already eats a US budget"]},
    "hawaii": {"lux": ["One beach-premium flagship. The car becomes mandatory once you leave town"]},
    "caribbean": {
        "budget": ["A value AI on the main beach — garden view on purpose"],
        "mid": ["A 4-star AI or a town boutique — one property"],
        "lux": ["Adults-only or villa leftover. Still no invented fare"],
    },
    "mexico": {
        "budget": ["Centro guesthouse or a value AI — pick one product"],
        "lux": ["Flagship or adults-only. The reservation is often the better splurge"],
    },
    "asia": {
        "budget": ["Business hotel or capsule next to a Metro — convenience-store breakfast"],
        "mid": ["4-star near a Metro interchange. Rail passes are often a bad buy on a short city trip"],
        "lux": ["Palace / Park Hyatt / Mandarin class. The room or the counter dinner — rarely both"],
    },
    "oceania": {
        "budget": ["City hostel-plus or a 3-star on a train. Long-haul is the expensive line"],
        "mid": ["Harbor or CBD 4-star. One city, then a separate island budget if you split"],
        "lux": ["Waterfront or lodge flagship. Do not stack every adventure add-on"],
    },
    "africa": {
        "budget": ["Medina guesthouse or city 3-star. Day tours beat a safari-priced room you do not need"],
        "mid": ["Riad / boutique / 4-star in the walkable core. Safari lodges are a different budget"],
        "lux": ["Lodge or palace leftover. The game drive is the product"],
    },
    "middleeast": {
        "budget": ["Downtown 3-star on a Metro. Desert tours are day-two, not day-one upsells"],
        "mid": ["Downtown or Marina 4-star. Summer is cheap and brutal"],
        "lux": ["Icon hotel as a weekend, not a week"],
    },
    "latam": {
        "budget": ["Centro or zona colonial guesthouse. Uber is cheap; tourist-taxi menus are not"],
        "mid": ["Boutique in the restaurant neighborhood or a 4-star AI on the beach"],
        "lux": ["Casa-hotel or adults-only beach. The tasting menu is often the better Stretch"],
    },
    "city": {
        "budget": ["Limited-service on transit. Walk-to-bakery beats a cheap room far from everything"],
        "mid": ["3–4 star in the walkable core. One room, not a suite"],
        "lux": ["Flagship in one district. Leftover only"],
    },
    "domestic": {"lux": ["Suite only if leftover covers the jump from mid"]},
}

ACT_PATCH = {
    "paris": {"mid": ["A second cheap morning — a park or a covered passage (free)"]},
    "tokyo": {
        "budget": ["A second neighborhood if leftover covers the Metro hours (free)"],
        "lux": ["A second ticketed leftover — not a Kyoto fake-day (ticketed)"],
    },
    "cancun": {"budget": ["A Hotel Zone walk at dusk, not a timeshare morning (free)"]},
}


def emit_rebalance() -> str:
    lines = [
        "  function rebalanceHotels() {",
        "    function replaceHotel(id, style, picks) {",
        "      var dest = P.HOTEL_EXAMPLES && P.HOTEL_EXAMPLES[id];",
        "      if (!dest || !dest[style]) return;",
        "      dest[style].picks = picks.slice();",
        "    }",
        "    function replaceFallbackHotel(key, style, picks) {",
        "      var fb = P.HOTEL_FALLBACKS && P.HOTEL_FALLBACKS[key];",
        "      if (!fb || !fb[style]) return;",
        "      fb[style].picks = picks.slice();",
        "    }",
    ]
    for dest, bands in HOTEL_REBALANCE.items():
        for style, picks in bands.items():
            extras_js = ", ".join(js_str(x) for x in picks)
            lines.append(f"    replaceHotel({js_str(dest)}, {js_str(style)}, [{extras_js}]);")
    for key, bands in FALLBACK_REBALANCE.items():
        for style, picks in bands.items():
            extras_js = ", ".join(js_str(x) for x in picks)
            lines.append(f"    replaceFallbackHotel({js_str(key)}, {js_str(style)}, [{extras_js}]);")
    lines.append("  }")
    return "\n".join(lines)


def emit_patches() -> str:
    lines = ["  function patchUniques() {"]
    for dest, bands in HOTEL_PATCH.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendHotel({js_str(dest)}, {js_str(style)}, [{extras_js}]);")
    for key, bands in FALLBACK_HOTEL_PATCH.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendFallbackHotel({js_str(key)}, {js_str(style)}, [{extras_js}]);")
    for dest, bands in ACT_PATCH.items():
        for style, extras in bands.items():
            extras_js = ", ".join(js_str(x) for x in extras)
            lines.append(f"    appendAct({js_str(dest)}, {js_str(style)}, [{extras_js}]);")
    lines.append("  }")
    return "\n".join(lines)


def emit_acts_only() -> str:
    chunks = ["  function installActsOnly() {"]
    for dest_id, bands in ACTS_ONLY.items():
        chunks.append(f"    P.ACTIVITIES[{js_str(dest_id)}] = {act_block(*bands)};")
    chunks.append("  }")
    return "\n".join(chunks)


HEADER = r'''/* =====================================================================
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
'''

FOOTER = r'''
  thickenHotels();
  thickenFood();
  thickenActs();
  thickenFallbacks();
  installFullRecs();
  installActsOnly();
  patchUniques();
  rebalanceHotels();
})(typeof window !== "undefined" ? window : this);
'''


def main() -> None:
    parts = [
        HEADER,
        emit_thicken_hotels(),
        "",
        emit_thicken_food(),
        "",
        emit_thicken_acts(),
        "",
        emit_fallback_thicken(),
        "",
        emit_full_recs(),
        "",
        emit_acts_only(),
        "",
        emit_patches(),
        "",
        emit_rebalance(),
        FOOTER,
    ]
    OUT.write_text("\n".join(parts) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes) dests={len(NEW)}")


if __name__ == "__main__":
    main()

