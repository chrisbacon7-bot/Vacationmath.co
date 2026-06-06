/* =====================================================================
   Trip Finder — destination catalog (50 destinations × 12 months)
   ---------------------------------------------------------------------
   Conservative 2026 estimates synthesized from public sources:
     - Hopper 2026 Consumer Travel Index (regional airfare bands)
     - Booking.com / Hotels.com 2026 destination averages
     - U.S. State Department / NOAA / weather.com climatology
     - CLIA, NerdWallet, Frommer's, Travel + Leisure 2026 city guides
   ---------------------------------------------------------------------
   monthly[i] = {
     tier:    'low' | 'shoulder' | 'peak'           // pricing & demand
     hotel:   { budget, mid, lux }                  // USD/night, mid-tier double room
     weather: 'great' | 'good' | 'mixed' | 'rainy' | 'hot' | 'cold' | 'stormy'
     crowd:   'low' | 'med' | 'high'
   }
   dailyGround = USD/person/day for food, local transit, entrance fees
   regionFlight = which lookup band to use from ORIGIN_AIRFARE
   ===================================================================== */

window.VM_TRIPFINDER_DATA = (function () {
  "use strict";

  // Helpers — common monthly patterns we'll splice into destinations
  function m(tier, b, mid, lux, weather, crowd) {
    return { tier: tier, hotel: { budget: b, mid: mid, lux: lux }, weather: weather, crowd: crowd };
  }

  // Each destination: 12 months Jan..Dec
  var DESTINATIONS = [

    // ============== CARIBBEAN ==============
    {
      id: "cancun", name: "Cancún", country: "Mexico", region: "Caribbean",
      vibes: ["beach", "familyfriendly", "budget", "food"],
      regionFlight: "caribbean", flightSurcharge: 1.0,
      dailyGround: { budget: 60, mid: 110, lux: 220 },
      visaUS: "none", tzOffset: -1,
      notes: "All-inclusives dominate; June-Oct is hurricane season but deepest discounts.",
      monthly: [
        m("peak", 220, 340, 620, "great", "high"),    // Jan
        m("peak", 240, 360, 680, "great", "high"),    // Feb
        m("peak", 280, 420, 780, "great", "high"),    // Mar — spring break
        m("shoulder", 220, 330, 620, "great", "med"), // Apr
        m("shoulder", 180, 270, 500, "great", "med"), // May
        m("low", 140, 220, 420, "hot", "low"),        // Jun
        m("low", 150, 230, 440, "hot", "med"),        // Jul — summer family
        m("low", 150, 230, 440, "hot", "med"),        // Aug
        m("low", 130, 200, 380, "stormy", "low"),     // Sep — hurricane
        m("low", 140, 210, 400, "stormy", "low"),     // Oct — hurricane
        m("shoulder", 180, 280, 520, "great", "med"), // Nov
        m("peak", 240, 360, 700, "great", "high")     // Dec
      ]
    },
    {
      id: "punta_cana", name: "Punta Cana", country: "Dominican Republic", region: "Caribbean",
      vibes: ["beach", "familyfriendly", "budget"],
      regionFlight: "caribbean", flightSurcharge: 1.05,
      dailyGround: { budget: 50, mid: 100, lux: 200 },
      visaUS: "none", tzOffset: 0,
      notes: "Best value all-inclusive destination — 30-40% cheaper than Cancún in low season.",
      monthly: [
        m("peak", 200, 300, 540, "great", "high"),
        m("peak", 220, 320, 580, "great", "high"),
        m("peak", 250, 360, 660, "great", "high"),
        m("shoulder", 190, 280, 510, "great", "med"),
        m("shoulder", 160, 230, 420, "good", "med"),
        m("low", 130, 190, 360, "hot", "low"),
        m("low", 140, 200, 380, "hot", "med"),
        m("low", 140, 200, 380, "hot", "med"),
        m("low", 120, 180, 340, "stormy", "low"),
        m("low", 130, 190, 360, "stormy", "low"),
        m("shoulder", 160, 240, 440, "great", "med"),
        m("peak", 220, 320, 600, "great", "high")
      ]
    },
    {
      id: "jamaica", name: "Negril & Montego Bay", country: "Jamaica", region: "Caribbean",
      vibes: ["beach", "budget", "romantic", "food"],
      regionFlight: "caribbean", flightSurcharge: 1.0,
      dailyGround: { budget: 55, mid: 105, lux: 210 },
      visaUS: "none", tzOffset: 0,
      notes: "Strong all-inclusive scene; mid-summer family discounts are the best deal.",
      monthly: [
        m("peak", 210, 310, 560, "great", "high"),
        m("peak", 230, 330, 600, "great", "high"),
        m("peak", 250, 360, 660, "great", "high"),
        m("shoulder", 200, 290, 530, "good", "med"),
        m("shoulder", 170, 240, 440, "good", "med"),
        m("low", 140, 200, 380, "hot", "low"),
        m("low", 150, 210, 400, "hot", "med"),
        m("low", 150, 210, 400, "hot", "med"),
        m("low", 130, 190, 360, "stormy", "low"),
        m("low", 140, 200, 380, "stormy", "low"),
        m("shoulder", 170, 250, 460, "great", "med"),
        m("peak", 230, 330, 620, "great", "high")
      ]
    },
    {
      id: "turks_caicos", name: "Turks and Caicos", country: "Turks & Caicos", region: "Caribbean",
      vibes: ["beach", "luxury", "romantic"],
      regionFlight: "caribbean", flightSurcharge: 1.1,
      dailyGround: { budget: 90, mid: 160, lux: 320 },
      visaUS: "none", tzOffset: 0,
      notes: "One of the priciest Caribbean stops; April-May and Nov shoulder is the value window.",
      monthly: [
        m("peak", 380, 580, 1100, "great", "high"),
        m("peak", 420, 640, 1200, "great", "high"),
        m("peak", 450, 680, 1280, "great", "high"),
        m("shoulder", 360, 540, 1020, "great", "med"),
        m("shoulder", 280, 420, 780, "great", "med"),
        m("low", 240, 360, 660, "hot", "low"),
        m("low", 250, 380, 700, "hot", "med"),
        m("low", 250, 380, 700, "hot", "med"),
        m("low", 220, 320, 600, "stormy", "low"),
        m("low", 230, 340, 640, "stormy", "low"),
        m("shoulder", 300, 460, 860, "great", "med"),
        m("peak", 420, 640, 1200, "great", "high")
      ]
    },
    {
      id: "aruba", name: "Aruba", country: "Aruba", region: "Caribbean",
      vibes: ["beach", "familyfriendly", "luxury"],
      regionFlight: "caribbean", flightSurcharge: 1.05,
      dailyGround: { budget: 75, mid: 130, lux: 260 },
      visaUS: "none", tzOffset: 0,
      notes: "Outside the hurricane belt — best Sept-Oct value in the region.",
      monthly: [
        m("peak", 280, 420, 760, "great", "high"),
        m("peak", 300, 460, 840, "great", "high"),
        m("peak", 320, 480, 880, "great", "high"),
        m("shoulder", 260, 380, 700, "great", "med"),
        m("shoulder", 220, 320, 600, "great", "med"),
        m("low", 190, 280, 520, "great", "low"),
        m("shoulder", 200, 300, 560, "great", "med"),
        m("shoulder", 200, 300, 560, "great", "med"),
        m("low", 180, 260, 480, "great", "low"),
        m("low", 180, 260, 480, "great", "low"),
        m("shoulder", 230, 340, 640, "great", "med"),
        m("peak", 300, 460, 860, "great", "high")
      ]
    },
    {
      id: "bahamas", name: "Nassau & Paradise Island", country: "Bahamas", region: "Caribbean",
      vibes: ["beach", "familyfriendly"],
      regionFlight: "caribbean", flightSurcharge: 0.85,
      dailyGround: { budget: 80, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: 0,
      notes: "Cheapest flights from East Coast; Atlantis dominates the family market.",
      monthly: [
        m("peak", 280, 420, 780, "good", "high"),
        m("peak", 300, 460, 860, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("shoulder", 260, 380, 720, "great", "med"),
        m("shoulder", 220, 320, 600, "great", "med"),
        m("low", 190, 280, 540, "hot", "low"),
        m("shoulder", 220, 320, 620, "hot", "med"),
        m("shoulder", 220, 320, 620, "hot", "med"),
        m("low", 170, 260, 500, "stormy", "low"),
        m("low", 180, 270, 520, "stormy", "low"),
        m("shoulder", 240, 360, 680, "great", "med"),
        m("peak", 300, 460, 880, "good", "high")
      ]
    },

    // ============== MEXICO (NON-CARIBBEAN) ==============
    {
      id: "cabo", name: "Cabo San Lucas", country: "Mexico", region: "Mexico",
      vibes: ["beach", "luxury", "romantic", "adventure"],
      regionFlight: "caribbean", flightSurcharge: 1.0,
      dailyGround: { budget: 70, mid: 130, lux: 280 },
      visaUS: "none", tzOffset: -2,
      notes: "Dry desert climate; July-Sept is hot and humid, big discounts.",
      monthly: [
        m("peak", 280, 420, 780, "great", "high"),
        m("peak", 320, 480, 880, "great", "high"),
        m("peak", 340, 520, 960, "great", "high"),
        m("shoulder", 280, 420, 780, "great", "med"),
        m("shoulder", 220, 330, 620, "great", "med"),
        m("low", 180, 270, 500, "hot", "low"),
        m("low", 170, 260, 480, "hot", "low"),
        m("low", 170, 260, 480, "hot", "low"),
        m("low", 160, 240, 440, "stormy", "low"),
        m("shoulder", 200, 300, 560, "great", "med"),
        m("shoulder", 240, 360, 680, "great", "med"),
        m("peak", 320, 480, 900, "great", "high")
      ]
    },
    {
      id: "mexico_city", name: "Mexico City", country: "Mexico", region: "Mexico",
      vibes: ["city", "food", "culture", "budget"],
      regionFlight: "caribbean", flightSurcharge: 0.9,
      dailyGround: { budget: 45, mid: 85, lux: 180 },
      visaUS: "none", tzOffset: -1,
      notes: "Best food-city value in the hemisphere. Mild year-round at 7,300ft.",
      monthly: [
        m("shoulder", 90, 150, 280, "good", "med"),
        m("shoulder", 95, 160, 300, "good", "med"),
        m("peak", 110, 180, 340, "great", "high"),
        m("peak", 120, 190, 360, "great", "high"),
        m("shoulder", 95, 160, 300, "great", "med"),
        m("low", 80, 140, 260, "rainy", "low"),
        m("low", 80, 140, 260, "rainy", "low"),
        m("low", 80, 140, 260, "rainy", "low"),
        m("low", 85, 145, 270, "rainy", "low"),
        m("shoulder", 95, 160, 300, "good", "med"),
        m("peak", 110, 180, 340, "great", "high"),
        m("peak", 120, 200, 380, "great", "high")
      ]
    },
    {
      id: "tulum", name: "Tulum & Riviera Maya", country: "Mexico", region: "Mexico",
      vibes: ["beach", "romantic", "outdoors", "luxury"],
      regionFlight: "caribbean", flightSurcharge: 1.0,
      dailyGround: { budget: 70, mid: 130, lux: 280 },
      visaUS: "none", tzOffset: -1,
      notes: "Cenotes and ruins; September seaweed (sargassum) season can be rough.",
      monthly: [
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 280, 420, 780, "great", "high"),
        m("shoulder", 220, 330, 620, "great", "med"),
        m("shoulder", 180, 270, 500, "good", "med"),
        m("low", 140, 220, 420, "hot", "low"),
        m("low", 150, 230, 440, "hot", "med"),
        m("low", 150, 230, 440, "hot", "med"),
        m("low", 120, 180, 340, "stormy", "low"),
        m("low", 130, 200, 380, "stormy", "low"),
        m("shoulder", 180, 280, 520, "great", "med"),
        m("peak", 240, 360, 700, "great", "high")
      ]
    },

    // ============== EUROPE ==============
    {
      id: "lisbon", name: "Lisbon", country: "Portugal", region: "Europe",
      vibes: ["city", "food", "culture", "budget", "beach"],
      regionFlight: "europe", flightSurcharge: 0.95,
      dailyGround: { budget: 70, mid: 130, lux: 260 },
      visaUS: "none", tzOffset: 5,
      notes: "Best-value Western European capital. Shoulder Apr-May & Oct ideal.",
      monthly: [
        m("low", 100, 160, 300, "cold", "low"),
        m("low", 100, 160, 300, "cold", "low"),
        m("shoulder", 120, 190, 360, "mixed", "med"),
        m("shoulder", 150, 230, 440, "good", "med"),
        m("peak", 180, 280, 520, "great", "high"),
        m("peak", 210, 320, 600, "great", "high"),
        m("peak", 240, 360, 680, "hot", "high"),
        m("peak", 240, 360, 680, "hot", "high"),
        m("peak", 200, 300, 560, "great", "high"),
        m("shoulder", 150, 230, 440, "good", "med"),
        m("low", 110, 170, 320, "rainy", "low"),
        m("low", 110, 170, 320, "cold", "low")
      ]
    },
    {
      id: "rome", name: "Rome", country: "Italy", region: "Europe",
      vibes: ["city", "food", "culture", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 90, mid: 160, lux: 320 },
      visaUS: "none", tzOffset: 6,
      notes: "Brutal in July-Aug heat and crowds. April and October are the windows.",
      monthly: [
        m("low", 110, 180, 340, "cold", "low"),
        m("low", 110, 180, 340, "cold", "low"),
        m("shoulder", 140, 220, 420, "mixed", "med"),
        m("peak", 200, 300, 560, "great", "high"),
        m("peak", 230, 350, 660, "great", "high"),
        m("peak", 260, 400, 740, "hot", "high"),
        m("peak", 280, 420, 800, "hot", "high"),
        m("shoulder", 220, 340, 640, "hot", "med"),
        m("peak", 250, 380, 720, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("low", 140, 220, 420, "rainy", "low"),
        m("shoulder", 180, 280, 520, "cold", "med")
      ]
    },
    {
      id: "paris", name: "Paris", country: "France", region: "Europe",
      vibes: ["city", "food", "culture", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 100, mid: 180, lux: 360 },
      visaUS: "none", tzOffset: 6,
      notes: "January-February is the cheapest visit you'll ever make. Bring a coat.",
      monthly: [
        m("low", 130, 200, 380, "cold", "low"),
        m("low", 130, 200, 380, "cold", "low"),
        m("shoulder", 160, 250, 460, "mixed", "med"),
        m("shoulder", 200, 300, 560, "good", "med"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 280, 420, 800, "hot", "high"),
        m("shoulder", 230, 350, 660, "hot", "med"),
        m("peak", 270, 400, 760, "great", "high"),
        m("shoulder", 220, 340, 640, "good", "med"),
        m("low", 150, 230, 440, "rainy", "low"),
        m("shoulder", 200, 300, 560, "cold", "med")
      ]
    },
    {
      id: "barcelona", name: "Barcelona", country: "Spain", region: "Europe",
      vibes: ["city", "beach", "food", "culture"],
      regionFlight: "europe", flightSurcharge: 0.95,
      dailyGround: { budget: 80, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: 6,
      notes: "Beach city in summer; mild winter. Shoulder May & Oct are best.",
      monthly: [
        m("low", 110, 170, 320, "cold", "low"),
        m("low", 110, 170, 320, "cold", "low"),
        m("shoulder", 130, 200, 380, "mixed", "med"),
        m("shoulder", 160, 250, 460, "good", "med"),
        m("peak", 200, 300, 560, "great", "high"),
        m("peak", 230, 350, 660, "great", "high"),
        m("peak", 260, 400, 740, "hot", "high"),
        m("peak", 260, 400, 740, "hot", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("shoulder", 180, 280, 520, "great", "med"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("shoulder", 160, 240, 440, "cold", "med")
      ]
    },
    {
      id: "amsterdam", name: "Amsterdam", country: "Netherlands", region: "Europe",
      vibes: ["city", "food", "culture", "outdoors"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 90, mid: 160, lux: 320 },
      visaUS: "none", tzOffset: 6,
      notes: "Tulip season (April-May) is gorgeous and expensive. Off-season is bargain.",
      monthly: [
        m("low", 120, 190, 360, "cold", "low"),
        m("low", 120, 190, 360, "cold", "low"),
        m("shoulder", 150, 230, 440, "mixed", "med"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 260, 400, 760, "good", "high"),
        m("peak", 240, 360, 680, "good", "high"),
        m("shoulder", 190, 290, 540, "good", "med"),
        m("shoulder", 160, 240, 440, "rainy", "med"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("shoulder", 180, 280, 520, "cold", "med")
      ]
    },
    {
      id: "prague", name: "Prague", country: "Czechia", region: "Europe",
      vibes: ["city", "culture", "budget", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.05,
      dailyGround: { budget: 55, mid: 100, lux: 200 },
      visaUS: "none", tzOffset: 6,
      notes: "Europe's biggest budget win. December Christmas markets are magical.",
      monthly: [
        m("low", 80, 130, 240, "cold", "low"),
        m("low", 80, 130, 240, "cold", "low"),
        m("shoulder", 100, 160, 300, "mixed", "med"),
        m("shoulder", 130, 200, 380, "good", "med"),
        m("peak", 180, 270, 510, "great", "high"),
        m("peak", 200, 300, 560, "great", "high"),
        m("peak", 200, 300, 560, "great", "high"),
        m("peak", 200, 300, 560, "good", "high"),
        m("peak", 180, 270, 510, "good", "high"),
        m("shoulder", 130, 200, 380, "mixed", "med"),
        m("low", 90, 140, 260, "rainy", "low"),
        m("peak", 160, 240, 440, "cold", "high")
      ]
    },
    {
      id: "iceland", name: "Reykjavík", country: "Iceland", region: "Europe",
      vibes: ["outdoors", "adventure", "romantic"],
      regionFlight: "europe", flightSurcharge: 0.85,
      dailyGround: { budget: 130, mid: 220, lux: 420 },
      visaUS: "none", tzOffset: 4,
      notes: "Northern lights Sept-Mar; midnight sun in June. Expensive but unforgettable.",
      monthly: [
        m("shoulder", 180, 290, 540, "cold", "med"),
        m("shoulder", 180, 290, 540, "cold", "med"),
        m("shoulder", 190, 300, 560, "cold", "med"),
        m("shoulder", 200, 320, 600, "mixed", "med"),
        m("peak", 240, 380, 720, "good", "high"),
        m("peak", 300, 480, 880, "good", "high"),
        m("peak", 320, 500, 920, "good", "high"),
        m("peak", 300, 480, 880, "good", "high"),
        m("shoulder", 230, 360, 680, "mixed", "med"),
        m("shoulder", 200, 320, 600, "cold", "med"),
        m("shoulder", 180, 290, 540, "cold", "med"),
        m("peak", 230, 360, 680, "cold", "high")
      ]
    },
    {
      id: "greece_athens", name: "Athens & Greek Islands", country: "Greece", region: "Europe",
      vibes: ["beach", "culture", "food", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.05,
      dailyGround: { budget: 75, mid: 140, lux: 290 },
      visaUS: "none", tzOffset: 7,
      notes: "Santorini sees peak prices July-Aug. May and October are the sweet spots.",
      monthly: [
        m("low", 100, 160, 300, "cold", "low"),
        m("low", 100, 160, 300, "cold", "low"),
        m("shoulder", 130, 200, 380, "mixed", "med"),
        m("shoulder", 160, 240, 440, "good", "med"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 260, 400, 760, "great", "high"),
        m("peak", 320, 480, 900, "hot", "high"),
        m("peak", 320, 480, 900, "hot", "high"),
        m("peak", 260, 400, 760, "great", "high"),
        m("shoulder", 180, 280, 520, "good", "med"),
        m("low", 120, 190, 360, "rainy", "low"),
        m("low", 110, 170, 320, "cold", "low")
      ]
    },
    {
      id: "london", name: "London", country: "United Kingdom", region: "Europe",
      vibes: ["city", "culture", "food", "familyfriendly"],
      regionFlight: "europe", flightSurcharge: 0.95,
      dailyGround: { budget: 100, mid: 190, lux: 380 },
      visaUS: "none", tzOffset: 5,
      notes: "January and November are 30-40% cheaper than summer. Weather is similar.",
      monthly: [
        m("low", 130, 210, 400, "cold", "low"),
        m("low", 140, 220, 420, "cold", "low"),
        m("shoulder", 170, 260, 480, "mixed", "med"),
        m("shoulder", 200, 310, 580, "mixed", "med"),
        m("peak", 240, 360, 680, "good", "high"),
        m("peak", 280, 420, 800, "good", "high"),
        m("peak", 300, 460, 880, "good", "high"),
        m("peak", 280, 420, 800, "good", "high"),
        m("shoulder", 230, 350, 660, "good", "med"),
        m("shoulder", 200, 310, 580, "mixed", "med"),
        m("low", 150, 230, 440, "rainy", "low"),
        m("shoulder", 200, 310, 580, "cold", "med")
      ]
    },
    {
      id: "edinburgh", name: "Edinburgh", country: "Scotland", region: "Europe",
      vibes: ["city", "culture", "outdoors", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 80, mid: 150, lux: 300 },
      visaUS: "none", tzOffset: 5,
      notes: "August Fringe Festival doubles prices. May and September are gorgeous.",
      monthly: [
        m("low", 100, 160, 300, "cold", "low"),
        m("low", 100, 160, 300, "cold", "low"),
        m("shoulder", 130, 200, 380, "mixed", "med"),
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("peak", 200, 310, 580, "good", "high"),
        m("peak", 240, 360, 680, "good", "high"),
        m("peak", 260, 400, 760, "good", "high"),
        m("peak", 360, 540, 1020, "good", "high"),
        m("shoulder", 180, 280, 520, "good", "med"),
        m("shoulder", 150, 230, 440, "mixed", "med"),
        m("low", 110, 170, 320, "rainy", "low"),
        m("shoulder", 150, 230, 440, "cold", "med")
      ]
    },
    {
      id: "dublin", name: "Dublin & Ireland", country: "Ireland", region: "Europe",
      vibes: ["city", "culture", "outdoors", "food"],
      regionFlight: "europe", flightSurcharge: 0.9,
      dailyGround: { budget: 90, mid: 160, lux: 320 },
      visaUS: "none", tzOffset: 5,
      notes: "May-Sept has long daylight; off-season is honest cheap and pubs are warm.",
      monthly: [
        m("low", 110, 170, 320, "cold", "low"),
        m("low", 110, 170, 320, "cold", "low"),
        m("peak", 180, 280, 520, "mixed", "high"),
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 250, 380, 720, "good", "high"),
        m("peak", 280, 420, 800, "good", "high"),
        m("peak", 260, 400, 760, "good", "high"),
        m("shoulder", 200, 300, 560, "good", "med"),
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("low", 120, 190, 360, "rainy", "low"),
        m("shoulder", 160, 240, 440, "cold", "med")
      ]
    },
    {
      id: "santorini", name: "Santorini", country: "Greece", region: "Europe",
      vibes: ["beach", "romantic", "luxury", "culture"],
      regionFlight: "europe", flightSurcharge: 1.15,
      dailyGround: { budget: 100, mid: 200, lux: 420 },
      visaUS: "none", tzOffset: 7,
      notes: "Only sensible May, June, Sept-early Oct. July-August is chaos.",
      monthly: [
        m("low", 0, 0, 0, "cold", "low"),               // many hotels closed
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("shoulder", 180, 280, 540, "good", "med"),
        m("peak", 280, 440, 840, "great", "high"),
        m("peak", 360, 560, 1080, "great", "high"),
        m("peak", 480, 720, 1380, "hot", "high"),
        m("peak", 480, 720, 1380, "hot", "high"),
        m("peak", 340, 520, 1000, "great", "high"),
        m("shoulder", 220, 340, 660, "good", "med"),
        m("low", 0, 0, 0, "rainy", "low"),
        m("low", 0, 0, 0, "cold", "low")
      ]
    },

    // ============== HAWAII / DOMESTIC ISLANDS ==============
    {
      id: "oahu", name: "Oahu (Honolulu)", country: "USA", region: "Hawaii",
      vibes: ["beach", "familyfriendly", "outdoors", "culture"],
      regionFlight: "hawaii", flightSurcharge: 1.0,
      dailyGround: { budget: 100, mid: 170, lux: 320 },
      visaUS: "none", tzOffset: -5,
      notes: "Cheapest Hawaiian island; April-May and Sept-Oct are the value windows.",
      monthly: [
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 300, 460, 860, "great", "high"),
        m("shoulder", 230, 350, 660, "great", "med"),
        m("shoulder", 200, 310, 580, "great", "med"),
        m("peak", 260, 400, 760, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("low", 200, 310, 580, "great", "low"),
        m("low", 200, 310, 580, "great", "low"),
        m("shoulder", 240, 360, 680, "great", "med"),
        m("peak", 320, 480, 900, "great", "high")
      ]
    },
    {
      id: "maui", name: "Maui", country: "USA", region: "Hawaii",
      vibes: ["beach", "romantic", "luxury", "outdoors"],
      regionFlight: "hawaii", flightSurcharge: 1.1,
      dailyGround: { budget: 120, mid: 200, lux: 380 },
      visaUS: "none", tzOffset: -5,
      notes: "Premium Hawaii. Whale season Dec-Apr. Always book months ahead.",
      monthly: [
        m("peak", 380, 580, 1100, "great", "high"),
        m("peak", 380, 580, 1100, "great", "high"),
        m("peak", 400, 620, 1180, "great", "high"),
        m("shoulder", 320, 480, 900, "great", "med"),
        m("shoulder", 280, 420, 800, "great", "med"),
        m("peak", 340, 520, 980, "great", "high"),
        m("peak", 360, 540, 1020, "great", "high"),
        m("peak", 360, 540, 1020, "great", "high"),
        m("low", 280, 420, 800, "great", "low"),
        m("low", 280, 420, 800, "great", "low"),
        m("shoulder", 320, 480, 900, "great", "med"),
        m("peak", 420, 640, 1200, "great", "high")
      ]
    },
    {
      id: "kauai", name: "Kauai", country: "USA", region: "Hawaii",
      vibes: ["outdoors", "adventure", "romantic", "beach"],
      regionFlight: "hawaii", flightSurcharge: 1.15,
      dailyGround: { budget: 110, mid: 190, lux: 360 },
      visaUS: "none", tzOffset: -5,
      notes: "Wettest island — bring rain gear. Stunning hikes, fewer crowds than Maui.",
      monthly: [
        m("peak", 320, 480, 900, "rainy", "high"),
        m("peak", 320, 480, 900, "rainy", "high"),
        m("peak", 340, 520, 980, "mixed", "high"),
        m("shoulder", 280, 420, 800, "good", "med"),
        m("shoulder", 250, 380, 720, "great", "med"),
        m("peak", 300, 460, 860, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("low", 250, 380, 720, "great", "low"),
        m("low", 250, 380, 720, "good", "low"),
        m("shoulder", 280, 420, 800, "rainy", "med"),
        m("peak", 360, 540, 1020, "rainy", "high")
      ]
    },

    // ============== US DOMESTIC ==============
    {
      id: "nyc", name: "New York City", country: "USA", region: "Domestic US",
      vibes: ["city", "food", "culture", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 110, mid: 200, lux: 420 },
      visaUS: "none", tzOffset: 0,
      notes: "January-February is the cheapest. December holidays are peak chaos.",
      monthly: [
        m("low", 180, 300, 580, "cold", "low"),
        m("low", 180, 300, 580, "cold", "low"),
        m("shoulder", 220, 360, 700, "mixed", "med"),
        m("shoulder", 260, 420, 820, "good", "med"),
        m("peak", 300, 480, 940, "great", "high"),
        m("peak", 320, 520, 1020, "great", "high"),
        m("peak", 280, 460, 900, "hot", "high"),
        m("shoulder", 240, 380, 740, "hot", "med"),
        m("peak", 320, 520, 1020, "great", "high"),
        m("peak", 340, 540, 1060, "great", "high"),
        m("peak", 320, 520, 1020, "mixed", "high"),
        m("peak", 360, 580, 1140, "cold", "high")
      ]
    },
    {
      id: "nola", name: "New Orleans", country: "USA", region: "Domestic US",
      vibes: ["food", "culture", "city", "romantic"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 80, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: -1,
      notes: "Mardi Gras (Feb) and Jazz Fest (Apr-May) are peak. Summer is hot and cheap.",
      monthly: [
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("peak", 260, 400, 760, "good", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("low", 140, 220, 400, "hot", "low"),
        m("low", 130, 200, 380, "hot", "low"),
        m("low", 130, 200, 380, "hot", "low"),
        m("low", 140, 220, 400, "hot", "low"),
        m("shoulder", 180, 280, 520, "great", "med"),
        m("shoulder", 200, 310, 580, "good", "med"),
        m("peak", 220, 340, 640, "good", "high")
      ]
    },
    {
      id: "vegas", name: "Las Vegas", country: "USA", region: "Domestic US",
      vibes: ["city", "food", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 0.85,
      dailyGround: { budget: 90, mid: 160, lux: 360 },
      visaUS: "none", tzOffset: -3,
      notes: "Resort fees add $40-60/night. Weekday rates are 40-60% off weekend.",
      monthly: [
        m("shoulder", 130, 210, 400, "good", "med"),
        m("shoulder", 150, 240, 460, "good", "med"),
        m("peak", 200, 320, 600, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 200, 310, 580, "great", "high"),
        m("low", 140, 220, 420, "hot", "low"),
        m("low", 120, 190, 360, "hot", "low"),
        m("low", 120, 190, 360, "hot", "low"),
        m("shoulder", 170, 270, 500, "great", "med"),
        m("peak", 200, 310, 580, "great", "high"),
        m("shoulder", 160, 250, 460, "good", "med"),
        m("peak", 200, 310, 580, "good", "high")
      ]
    },
    {
      id: "denver", name: "Denver & Rockies", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "adventure", "city"],
      regionFlight: "domestic", flightSurcharge: 0.9,
      dailyGround: { budget: 85, mid: 150, lux: 300 },
      visaUS: "none", tzOffset: -2,
      notes: "Ski season (Dec-Mar) is peak; summer hiking and brewing scene are gold.",
      monthly: [
        m("peak", 200, 310, 580, "cold", "high"),
        m("peak", 200, 310, 580, "cold", "high"),
        m("peak", 220, 340, 640, "mixed", "high"),
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("shoulder", 170, 260, 480, "good", "med"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("shoulder", 180, 280, 520, "great", "med"),
        m("shoulder", 160, 240, 440, "good", "med"),
        m("shoulder", 170, 260, 480, "mixed", "med"),
        m("peak", 220, 340, 640, "cold", "high")
      ]
    },
    {
      id: "san_diego", name: "San Diego", country: "USA", region: "Domestic US",
      vibes: ["beach", "familyfriendly", "outdoors", "city"],
      regionFlight: "domestic", flightSurcharge: 1.0,
      dailyGround: { budget: 95, mid: 170, lux: 340 },
      visaUS: "none", tzOffset: -3,
      notes: "Most consistent weather in the lower 48. Off-season is rarely under 60°F.",
      monthly: [
        m("shoulder", 180, 280, 520, "good", "med"),
        m("shoulder", 190, 300, 560, "good", "med"),
        m("shoulder", 220, 340, 640, "good", "med"),
        m("shoulder", 220, 340, 640, "good", "med"),
        m("peak", 240, 360, 680, "good", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("shoulder", 220, 340, 640, "great", "med"),
        m("shoulder", 200, 310, 580, "good", "med"),
        m("peak", 240, 360, 680, "good", "high")
      ]
    },
    {
      id: "charleston", name: "Charleston", country: "USA", region: "Domestic US",
      vibes: ["food", "culture", "romantic", "beach"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 90, mid: 160, lux: 320 },
      visaUS: "none", tzOffset: 0,
      notes: "Spring (Mar-May) is magical. August is hot, humid, and discounted.",
      monthly: [
        m("low", 130, 200, 380, "mixed", "low"),
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("shoulder", 180, 280, 520, "hot", "med"),
        m("low", 160, 240, 440, "hot", "low"),
        m("low", 150, 230, 420, "hot", "low"),
        m("shoulder", 180, 280, 520, "good", "med"),
        m("peak", 220, 340, 640, "great", "high"),
        m("shoulder", 180, 280, 520, "good", "med"),
        m("shoulder", 180, 280, 520, "mixed", "med")
      ]
    },
    {
      id: "savannah", name: "Savannah", country: "USA", region: "Domestic US",
      vibes: ["food", "culture", "romantic", "budget"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 80, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: 0,
      notes: "Walkable historic district. Cheaper alternative to Charleston.",
      monthly: [
        m("low", 110, 170, 320, "mixed", "low"),
        m("shoulder", 140, 220, 400, "mixed", "med"),
        m("peak", 200, 310, 580, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 200, 310, 580, "great", "high"),
        m("low", 150, 230, 440, "hot", "low"),
        m("low", 140, 220, 400, "hot", "low"),
        m("low", 130, 200, 380, "hot", "low"),
        m("shoulder", 160, 240, 440, "good", "med"),
        m("peak", 200, 310, 580, "great", "high"),
        m("shoulder", 160, 240, 440, "good", "med"),
        m("shoulder", 160, 240, 440, "mixed", "med")
      ]
    },
    {
      id: "asheville", name: "Asheville", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "food", "romantic", "adventure"],
      regionFlight: "domestic", flightSurcharge: 1.05,
      dailyGround: { budget: 75, mid: 130, lux: 260 },
      visaUS: "none", tzOffset: 0,
      notes: "October leaf-peeping is peak. Summer hiking and breweries are reliable.",
      monthly: [
        m("low", 120, 190, 360, "cold", "low"),
        m("low", 120, 190, 360, "cold", "low"),
        m("shoulder", 150, 230, 440, "mixed", "med"),
        m("shoulder", 170, 260, 480, "good", "med"),
        m("peak", 200, 310, 580, "good", "high"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("shoulder", 160, 240, 440, "mixed", "med"),
        m("shoulder", 160, 240, 440, "cold", "med")
      ]
    },
    {
      id: "yellowstone", name: "Yellowstone / Grand Teton", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "adventure", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 1.1,
      dailyGround: { budget: 90, mid: 150, lux: 300 },
      visaUS: "none", tzOffset: -2,
      notes: "Most lodges closed Nov-Apr. June-Aug is the only realistic window for families.",
      monthly: [
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("shoulder", 150, 230, 440, "cold", "med"),
        m("peak", 240, 360, 680, "mixed", "high"),
        m("peak", 280, 420, 800, "good", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 240, 360, 680, "good", "high"),
        m("shoulder", 150, 230, 440, "cold", "med"),
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low")
      ]
    },
    {
      id: "national_parks_southwest", name: "Utah Mighty 5 (Zion, Bryce, Arches)", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "adventure", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 1.0,
      dailyGround: { budget: 85, mid: 140, lux: 270 },
      visaUS: "none", tzOffset: -2,
      notes: "April-May and Sept-Oct are ideal. Summer is brutally hot.",
      monthly: [
        m("low", 110, 170, 320, "cold", "low"),
        m("low", 110, 170, 320, "cold", "low"),
        m("shoulder", 150, 230, 440, "mixed", "med"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 240, 360, 680, "hot", "high"),
        m("peak", 220, 340, 640, "hot", "high"),
        m("peak", 220, 340, 640, "hot", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 220, 340, 640, "good", "high"),
        m("low", 130, 200, 380, "cold", "low"),
        m("low", 110, 170, 320, "cold", "low")
      ]
    },
    {
      id: "smoky_mountains", name: "Great Smoky Mountains", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "familyfriendly", "budget"],
      regionFlight: "domestic", flightSurcharge: 1.0,
      dailyGround: { budget: 70, mid: 120, lux: 240 },
      visaUS: "none", tzOffset: 0,
      notes: "Most visited US national park. October leaf-peeping doubles prices.",
      monthly: [
        m("low", 100, 160, 300, "cold", "low"),
        m("low", 100, 160, 300, "cold", "low"),
        m("shoulder", 140, 220, 400, "mixed", "med"),
        m("shoulder", 160, 240, 440, "good", "med"),
        m("peak", 200, 310, 580, "good", "high"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 220, 340, 640, "good", "high"),
        m("peak", 200, 310, 580, "good", "high"),
        m("peak", 200, 310, 580, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("shoulder", 140, 220, 400, "mixed", "med"),
        m("shoulder", 140, 220, 400, "cold", "med")
      ]
    },
    {
      id: "miami", name: "Miami & South Beach", country: "USA", region: "Domestic US",
      vibes: ["beach", "city", "food"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 100, mid: 180, lux: 380 },
      visaUS: "none", tzOffset: 0,
      notes: "Snowbird season Dec-Mar is peak. Summer is hot but 40% cheaper.",
      monthly: [
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 320, 480, 900, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("shoulder", 220, 340, 640, "hot", "med"),
        m("low", 180, 280, 520, "hot", "low"),
        m("low", 180, 280, 520, "hot", "low"),
        m("low", 170, 260, 500, "hot", "low"),
        m("low", 160, 250, 480, "stormy", "low"),
        m("low", 170, 270, 510, "stormy", "low"),
        m("shoulder", 220, 340, 640, "great", "med"),
        m("peak", 320, 480, 900, "great", "high")
      ]
    },

    // ============== CENTRAL & SOUTH AMERICA ==============
    {
      id: "costa_rica", name: "Costa Rica (Arenal + Manuel Antonio)", country: "Costa Rica", region: "Central America",
      vibes: ["outdoors", "adventure", "beach", "familyfriendly"],
      regionFlight: "caribbean", flightSurcharge: 1.1,
      dailyGround: { budget: 70, mid: 130, lux: 260 },
      visaUS: "none", tzOffset: -1,
      notes: "Dry season Dec-Apr is peak. May & November shoulder are the sweet spot.",
      monthly: [
        m("peak", 220, 330, 620, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("peak", 220, 330, 620, "great", "high"),
        m("shoulder", 170, 260, 480, "good", "med"),
        m("low", 140, 220, 400, "rainy", "low"),
        m("low", 150, 230, 420, "rainy", "low"),
        m("low", 150, 230, 420, "rainy", "low"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("shoulder", 170, 260, 480, "good", "med"),
        m("peak", 220, 330, 620, "great", "high")
      ]
    },
    {
      id: "belize", name: "Belize (Cayes + Mainland)", country: "Belize", region: "Central America",
      vibes: ["beach", "outdoors", "adventure"],
      regionFlight: "caribbean", flightSurcharge: 1.05,
      dailyGround: { budget: 75, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: -1,
      notes: "Reef diving and ruins. May and November are the best-value months.",
      monthly: [
        m("peak", 230, 340, 640, "great", "high"),
        m("peak", 250, 380, 700, "great", "high"),
        m("peak", 260, 400, 740, "great", "high"),
        m("peak", 240, 360, 680, "great", "high"),
        m("shoulder", 180, 270, 500, "good", "med"),
        m("low", 150, 220, 400, "rainy", "low"),
        m("low", 160, 230, 420, "rainy", "low"),
        m("low", 160, 230, 420, "rainy", "low"),
        m("low", 140, 210, 380, "stormy", "low"),
        m("low", 150, 220, 400, "stormy", "low"),
        m("shoulder", 190, 280, 520, "good", "med"),
        m("peak", 240, 360, 680, "great", "high")
      ]
    },
    {
      id: "guatemala", name: "Antigua & Lake Atitlán", country: "Guatemala", region: "Central America",
      vibes: ["culture", "adventure", "budget", "outdoors"],
      regionFlight: "caribbean", flightSurcharge: 1.05,
      dailyGround: { budget: 45, mid: 85, lux: 180 },
      visaUS: "none", tzOffset: -1,
      notes: "One of the cheapest culturally rich destinations. Year-round mild climate.",
      monthly: [
        m("peak", 90, 150, 280, "great", "high"),
        m("peak", 95, 160, 300, "great", "high"),
        m("peak", 100, 170, 320, "great", "high"),
        m("peak", 110, 180, 340, "great", "high"),
        m("shoulder", 85, 140, 260, "good", "med"),
        m("low", 70, 120, 220, "rainy", "low"),
        m("low", 75, 125, 230, "rainy", "low"),
        m("low", 75, 125, 230, "rainy", "low"),
        m("low", 70, 120, 220, "rainy", "low"),
        m("shoulder", 85, 140, 260, "good", "med"),
        m("shoulder", 90, 150, 280, "great", "med"),
        m("peak", 110, 180, 340, "great", "high")
      ]
    },
    {
      id: "peru", name: "Cusco & Machu Picchu", country: "Peru", region: "South America",
      vibes: ["culture", "adventure", "outdoors"],
      regionFlight: "europe", flightSurcharge: 0.85,
      dailyGround: { budget: 55, mid: 100, lux: 220 },
      visaUS: "none", tzOffset: 0,
      notes: "Dry season May-Sept is peak. Book Machu Picchu permits 4+ months ahead.",
      monthly: [
        m("low", 90, 140, 260, "rainy", "low"),
        m("low", 90, 140, 260, "rainy", "low"),
        m("shoulder", 110, 170, 320, "rainy", "med"),
        m("peak", 140, 220, 400, "good", "high"),
        m("peak", 160, 240, 440, "great", "high"),
        m("peak", 180, 280, 520, "great", "high"),
        m("peak", 200, 310, 580, "great", "high"),
        m("peak", 200, 310, 580, "great", "high"),
        m("peak", 160, 240, 440, "great", "high"),
        m("shoulder", 130, 200, 380, "good", "med"),
        m("shoulder", 120, 180, 340, "mixed", "med"),
        m("shoulder", 130, 200, 380, "rainy", "med")
      ]
    },
    {
      id: "buenos_aires", name: "Buenos Aires", country: "Argentina", region: "South America",
      vibes: ["city", "food", "culture", "budget"],
      regionFlight: "europe", flightSurcharge: 0.95,
      dailyGround: { budget: 50, mid: 95, lux: 200 },
      visaUS: "none", tzOffset: 2,
      notes: "Currency volatility makes it a wild bargain. Southern Hemisphere seasons.",
      monthly: [
        m("peak", 120, 200, 380, "hot", "high"),
        m("peak", 130, 210, 400, "hot", "high"),
        m("peak", 130, 210, 400, "good", "high"),
        m("shoulder", 110, 180, 340, "good", "med"),
        m("shoulder", 90, 150, 280, "mixed", "med"),
        m("low", 80, 130, 240, "cold", "low"),
        m("low", 80, 130, 240, "cold", "low"),
        m("low", 80, 130, 240, "cold", "low"),
        m("shoulder", 100, 160, 300, "good", "med"),
        m("peak", 120, 200, 380, "great", "high"),
        m("peak", 130, 210, 400, "great", "high"),
        m("peak", 140, 230, 440, "hot", "high")
      ]
    },
    {
      id: "colombia", name: "Cartagena", country: "Colombia", region: "South America",
      vibes: ["beach", "city", "food", "culture"],
      regionFlight: "caribbean", flightSurcharge: 1.15,
      dailyGround: { budget: 50, mid: 100, lux: 220 },
      visaUS: "none", tzOffset: 0,
      notes: "Cheaper alternative to Cancún with way better food and architecture.",
      monthly: [
        m("peak", 200, 310, 580, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("peak", 220, 340, 640, "great", "high"),
        m("shoulder", 170, 260, 480, "great", "med"),
        m("low", 140, 220, 400, "hot", "low"),
        m("low", 150, 230, 420, "hot", "low"),
        m("low", 160, 240, 440, "hot", "low"),
        m("low", 160, 240, 440, "hot", "low"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("shoulder", 170, 260, 480, "good", "med"),
        m("peak", 220, 340, 640, "great", "high")
      ]
    },

    // ============== ASIA ==============
    {
      id: "tokyo", name: "Tokyo", country: "Japan", region: "Asia",
      vibes: ["city", "food", "culture"],
      regionFlight: "europe", flightSurcharge: 1.3,
      dailyGround: { budget: 75, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: 14,
      notes: "Cherry blossom (Mar-Apr) and autumn (Oct-Nov) are peak. January is cheapest.",
      monthly: [
        m("low", 120, 200, 380, "cold", "low"),
        m("low", 130, 220, 420, "cold", "low"),
        m("peak", 220, 360, 680, "great", "high"),
        m("peak", 240, 380, 720, "great", "high"),
        m("shoulder", 180, 290, 540, "good", "med"),
        m("shoulder", 160, 260, 480, "rainy", "med"),
        m("shoulder", 180, 290, 540, "hot", "med"),
        m("shoulder", 180, 290, 540, "hot", "med"),
        m("shoulder", 180, 290, 540, "good", "med"),
        m("peak", 220, 360, 680, "great", "high"),
        m("peak", 240, 380, 720, "great", "high"),
        m("shoulder", 180, 290, 540, "cold", "med")
      ]
    },
    {
      id: "kyoto", name: "Kyoto", country: "Japan", region: "Asia",
      vibes: ["culture", "food", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.35,
      dailyGround: { budget: 75, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: 14,
      notes: "Cherry blossom prices double; book ryokans 6 months out.",
      monthly: [
        m("low", 120, 200, 380, "cold", "low"),
        m("low", 130, 220, 420, "cold", "low"),
        m("peak", 240, 380, 720, "great", "high"),
        m("peak", 280, 440, 820, "great", "high"),
        m("shoulder", 190, 300, 560, "good", "med"),
        m("shoulder", 170, 270, 500, "rainy", "med"),
        m("shoulder", 180, 290, 540, "hot", "med"),
        m("shoulder", 180, 290, 540, "hot", "med"),
        m("shoulder", 200, 310, 580, "good", "med"),
        m("peak", 240, 380, 720, "great", "high"),
        m("peak", 280, 440, 820, "great", "high"),
        m("shoulder", 200, 310, 580, "cold", "med")
      ]
    },
    {
      id: "thailand", name: "Bangkok & Chiang Mai", country: "Thailand", region: "Asia",
      vibes: ["budget", "food", "culture", "adventure"],
      regionFlight: "europe", flightSurcharge: 1.4,
      dailyGround: { budget: 35, mid: 75, lux: 180 },
      visaUS: "none", tzOffset: 12,
      notes: "Long flights, cheap on the ground. Dry season Nov-Feb is peak.",
      monthly: [
        m("peak", 90, 160, 320, "great", "high"),
        m("peak", 95, 170, 340, "great", "high"),
        m("shoulder", 85, 150, 280, "hot", "med"),
        m("shoulder", 75, 140, 260, "hot", "med"),
        m("low", 65, 120, 220, "rainy", "low"),
        m("low", 60, 110, 200, "rainy", "low"),
        m("low", 60, 110, 200, "rainy", "low"),
        m("low", 60, 110, 200, "rainy", "low"),
        m("low", 65, 120, 220, "rainy", "low"),
        m("low", 70, 130, 240, "rainy", "low"),
        m("peak", 90, 160, 320, "great", "high"),
        m("peak", 100, 180, 360, "great", "high")
      ]
    },
    {
      id: "bali", name: "Bali", country: "Indonesia", region: "Asia",
      vibes: ["beach", "outdoors", "romantic", "budget"],
      regionFlight: "europe", flightSurcharge: 1.5,
      dailyGround: { budget: 40, mid: 85, lux: 220 },
      visaUS: "onarrival", tzOffset: 12,
      notes: "Dry season Apr-Oct. Long flight from US but ground cost is tiny.",
      monthly: [
        m("low", 90, 150, 300, "rainy", "low"),
        m("low", 90, 150, 300, "rainy", "low"),
        m("shoulder", 100, 170, 340, "rainy", "med"),
        m("peak", 130, 220, 420, "great", "high"),
        m("peak", 130, 220, 420, "great", "high"),
        m("peak", 150, 250, 480, "great", "high"),
        m("peak", 180, 300, 580, "great", "high"),
        m("peak", 180, 300, 580, "great", "high"),
        m("peak", 150, 250, 480, "great", "high"),
        m("shoulder", 110, 180, 360, "good", "med"),
        m("low", 90, 150, 300, "rainy", "low"),
        m("peak", 140, 230, 440, "rainy", "high")
      ]
    },
    {
      id: "vietnam", name: "Vietnam (Hanoi + Hoi An)", country: "Vietnam", region: "Asia",
      vibes: ["budget", "food", "culture", "beach"],
      regionFlight: "europe", flightSurcharge: 1.45,
      dailyGround: { budget: 35, mid: 75, lux: 180 },
      visaUS: "evisa", tzOffset: 12,
      notes: "Best food-budget combo in Asia. North and South have opposite climates.",
      monthly: [
        m("peak", 75, 140, 280, "good", "high"),
        m("peak", 80, 150, 300, "good", "high"),
        m("shoulder", 75, 140, 280, "good", "med"),
        m("shoulder", 70, 130, 260, "good", "med"),
        m("low", 60, 110, 220, "hot", "low"),
        m("low", 55, 100, 200, "hot", "low"),
        m("low", 55, 100, 200, "rainy", "low"),
        m("low", 55, 100, 200, "rainy", "low"),
        m("low", 60, 110, 220, "rainy", "low"),
        m("shoulder", 70, 130, 260, "good", "med"),
        m("shoulder", 75, 140, 280, "great", "med"),
        m("peak", 80, 150, 300, "good", "high")
      ]
    },

    // ============== OCEANIA ==============
    {
      id: "australia", name: "Sydney", country: "Australia", region: "Oceania",
      vibes: ["beach", "city", "outdoors", "adventure"],
      regionFlight: "europe", flightSurcharge: 1.6,
      dailyGround: { budget: 95, mid: 170, lux: 340 },
      visaUS: "evisa", tzOffset: 15,
      notes: "Southern Hemisphere — summer is Dec-Feb, peak prices. May-Aug is value.",
      monthly: [
        m("peak", 260, 400, 760, "great", "high"),
        m("peak", 280, 420, 800, "great", "high"),
        m("peak", 260, 400, 760, "great", "high"),
        m("shoulder", 220, 340, 640, "great", "med"),
        m("shoulder", 200, 310, 580, "good", "med"),
        m("low", 180, 280, 520, "mixed", "low"),
        m("low", 180, 280, 520, "mixed", "low"),
        m("low", 190, 290, 540, "mixed", "low"),
        m("shoulder", 210, 320, 600, "good", "med"),
        m("shoulder", 230, 350, 660, "great", "med"),
        m("peak", 260, 400, 760, "great", "high"),
        m("peak", 320, 480, 900, "great", "high")
      ]
    },
    {
      id: "new_zealand", name: "Queenstown & South Island", country: "New Zealand", region: "Oceania",
      vibes: ["outdoors", "adventure", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.65,
      dailyGround: { budget: 100, mid: 180, lux: 360 },
      visaUS: "evisa", tzOffset: 17,
      notes: "Summer (Dec-Feb) peak. June-Aug is ski season — also peak in Queenstown.",
      monthly: [
        m("peak", 240, 380, 720, "great", "high"),
        m("peak", 260, 400, 760, "great", "high"),
        m("peak", 240, 380, 720, "good", "high"),
        m("shoulder", 200, 310, 580, "good", "med"),
        m("low", 180, 280, 520, "cold", "low"),
        m("peak", 240, 380, 720, "cold", "high"),
        m("peak", 280, 420, 800, "cold", "high"),
        m("peak", 280, 420, 800, "cold", "high"),
        m("shoulder", 200, 310, 580, "mixed", "med"),
        m("shoulder", 220, 340, 640, "good", "med"),
        m("peak", 240, 380, 720, "great", "high"),
        m("peak", 280, 420, 800, "great", "high")
      ]
    },

    // ============== AFRICA / MIDDLE EAST ==============
    {
      id: "morocco", name: "Marrakech", country: "Morocco", region: "Africa",
      vibes: ["culture", "food", "budget", "adventure"],
      regionFlight: "europe", flightSurcharge: 1.1,
      dailyGround: { budget: 50, mid: 100, lux: 220 },
      visaUS: "none", tzOffset: 5,
      notes: "Spring and fall are ideal. Summer hits 105°F and shuts down the souks.",
      monthly: [
        m("shoulder", 100, 170, 320, "mixed", "med"),
        m("shoulder", 110, 180, 340, "mixed", "med"),
        m("peak", 150, 230, 440, "great", "high"),
        m("peak", 180, 270, 510, "great", "high"),
        m("peak", 160, 240, 460, "good", "high"),
        m("low", 110, 180, 340, "hot", "low"),
        m("low", 100, 170, 320, "hot", "low"),
        m("low", 100, 170, 320, "hot", "low"),
        m("shoulder", 130, 200, 380, "good", "med"),
        m("peak", 170, 260, 480, "great", "high"),
        m("peak", 150, 230, 440, "great", "high"),
        m("shoulder", 120, 190, 360, "mixed", "med")
      ]
    },
    {
      id: "south_africa", name: "Cape Town & Garden Route", country: "South Africa", region: "Africa",
      vibes: ["outdoors", "adventure", "food", "beach"],
      regionFlight: "europe", flightSurcharge: 1.35,
      dailyGround: { budget: 60, mid: 110, lux: 240 },
      visaUS: "none", tzOffset: 6,
      notes: "Their summer (Dec-Feb) is peak. Wine country and safari add-ons are unmatched value.",
      monthly: [
        m("peak", 180, 280, 520, "great", "high"),
        m("peak", 190, 290, 540, "great", "high"),
        m("peak", 170, 260, 480, "great", "high"),
        m("shoulder", 140, 220, 400, "good", "med"),
        m("low", 110, 170, 320, "rainy", "low"),
        m("low", 100, 160, 300, "rainy", "low"),
        m("low", 100, 160, 300, "rainy", "low"),
        m("low", 110, 170, 320, "mixed", "low"),
        m("shoulder", 130, 200, 380, "good", "med"),
        m("shoulder", 150, 230, 420, "great", "med"),
        m("peak", 170, 260, 480, "great", "high"),
        m("peak", 200, 310, 580, "great", "high")
      ]
    },
    {
      id: "egypt", name: "Cairo & Nile", country: "Egypt", region: "Africa",
      vibes: ["culture", "adventure", "budget"],
      regionFlight: "europe", flightSurcharge: 1.2,
      dailyGround: { budget: 50, mid: 95, lux: 200 },
      visaUS: "evisa", tzOffset: 7,
      notes: "Best Oct-Apr (cooler). May-Sept hits 105°F at the pyramids.",
      monthly: [
        m("peak", 130, 200, 380, "great", "high"),
        m("peak", 140, 220, 400, "great", "high"),
        m("peak", 150, 230, 440, "great", "high"),
        m("shoulder", 130, 200, 380, "good", "med"),
        m("low", 100, 160, 300, "hot", "low"),
        m("low", 90, 150, 280, "hot", "low"),
        m("low", 90, 150, 280, "hot", "low"),
        m("low", 95, 155, 290, "hot", "low"),
        m("low", 100, 160, 300, "hot", "low"),
        m("shoulder", 130, 200, 380, "good", "med"),
        m("peak", 150, 230, 440, "great", "high"),
        m("peak", 160, 240, 460, "great", "high")
      ]
    },
    {
      id: "dubai", name: "Dubai", country: "UAE", region: "Middle East",
      vibes: ["city", "luxury", "beach", "familyfriendly"],
      regionFlight: "europe", flightSurcharge: 1.25,
      dailyGround: { budget: 90, mid: 170, lux: 380 },
      visaUS: "none", tzOffset: 9,
      notes: "Nov-Mar is the only sensible window. June-Aug is 110°F+ and discounted.",
      monthly: [
        m("peak", 240, 380, 720, "great", "high"),
        m("peak", 260, 400, 760, "great", "high"),
        m("peak", 240, 380, 720, "great", "high"),
        m("shoulder", 200, 310, 580, "good", "med"),
        m("low", 150, 240, 440, "hot", "low"),
        m("low", 120, 200, 380, "hot", "low"),
        m("low", 110, 180, 340, "hot", "low"),
        m("low", 110, 180, 340, "hot", "low"),
        m("low", 130, 210, 400, "hot", "low"),
        m("shoulder", 180, 280, 520, "good", "med"),
        m("peak", 240, 380, 720, "great", "high"),
        m("peak", 280, 420, 800, "great", "high")
      ]
    },

    // ============== POLAR / SPECIALTY ==============
    {
      id: "alaska_cruise", name: "Alaska Cruise (Inside Passage)", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "adventure", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 1.05,
      dailyGround: { budget: 110, mid: 180, lux: 320 },  // mostly cruise included; this is land days
      visaUS: "none", tzOffset: -4,
      notes: "Cruise season May-Sept only. May and September are the value windows.",
      monthly: [
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("shoulder", 160, 250, 460, "mixed", "med"),
        m("peak", 200, 310, 580, "good", "high"),
        m("peak", 240, 360, 680, "good", "high"),
        m("peak", 240, 360, 680, "good", "high"),
        m("shoulder", 170, 260, 480, "mixed", "med"),
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low"),
        m("low", 0, 0, 0, "cold", "low")
      ]
    },

    // ============== NEW DESTINATIONS (added batch 2) ==============
    {
      id: "st_lucia", name: "St. Lucia", country: "St. Lucia", region: "Caribbean",
      vibes: ["beach", "romantic", "luxury", "adventure"],
      regionFlight: "caribbean", flightSurcharge: 1.05,
      dailyGround: { budget: 110, mid: 200, lux: 420 },
      visaUS: "none", tzOffset: -1,
      notes: "Pitons, rainforest, and boutique resorts. Pairs best with honeymoons and milestone trips.",
      monthly: [
        m("peak", 260, 420, 800, "great", "high"),
        m("peak", 280, 440, 840, "great", "high"),
        m("peak", 300, 460, 880, "great", "high"),
        m("shoulder", 220, 360, 700, "great", "med"),
        m("shoulder", 180, 300, 580, "great", "med"),
        m("low", 150, 250, 500, "hot", "low"),
        m("low", 160, 260, 520, "hot", "low"),
        m("low", 150, 250, 500, "hot", "low"),
        m("low", 130, 220, 440, "stormy", "low"),
        m("low", 140, 230, 460, "stormy", "low"),
        m("shoulder", 190, 310, 620, "great", "med"),
        m("peak", 260, 420, 820, "great", "high")
      ]
    },
    {
      id: "puerto_rico", name: "Puerto Rico (San Juan)", country: "USA", region: "Caribbean",
      vibes: ["beach", "city", "food", "culture", "budget"],
      regionFlight: "caribbean", flightSurcharge: 0.95,
      dailyGround: { budget: 70, mid: 130, lux: 280 },
      visaUS: "none", tzOffset: -1,
      notes: "No passport needed for US citizens. Old San Juan, Condado beach, El Yunque rainforest.",
      monthly: [
        m("peak", 220, 340, 620, "great", "high"),
        m("peak", 240, 360, 660, "great", "high"),
        m("peak", 260, 400, 740, "great", "high"),
        m("shoulder", 180, 280, 520, "great", "med"),
        m("shoulder", 160, 250, 460, "great", "med"),
        m("low", 130, 200, 380, "hot", "low"),
        m("low", 140, 210, 400, "hot", "med"),
        m("low", 140, 210, 400, "hot", "med"),
        m("low", 120, 190, 360, "stormy", "low"),
        m("low", 130, 200, 380, "stormy", "low"),
        m("shoulder", 170, 270, 500, "great", "med"),
        m("peak", 220, 340, 640, "great", "high")
      ]
    },
    {
      id: "us_virgin_islands", name: "US Virgin Islands (St. Thomas)", country: "USA", region: "Caribbean",
      vibes: ["beach", "romantic", "luxury", "familyfriendly"],
      regionFlight: "caribbean", flightSurcharge: 1.0,
      dailyGround: { budget: 90, mid: 160, lux: 340 },
      visaUS: "none", tzOffset: -1,
      notes: "No passport needed for US citizens. St. John has the best beaches in the Caribbean.",
      monthly: [
        m("peak", 240, 380, 700, "great", "high"),
        m("peak", 260, 400, 740, "great", "high"),
        m("peak", 280, 420, 780, "great", "high"),
        m("shoulder", 200, 320, 600, "great", "med"),
        m("shoulder", 170, 270, 500, "great", "med"),
        m("low", 140, 220, 420, "hot", "low"),
        m("low", 150, 230, 440, "hot", "low"),
        m("low", 150, 230, 440, "hot", "low"),
        m("low", 130, 200, 380, "stormy", "low"),
        m("low", 140, 210, 400, "stormy", "low"),
        m("shoulder", 190, 300, 560, "great", "med"),
        m("peak", 250, 390, 720, "great", "high")
      ]
    },
    {
      id: "austin", name: "Austin", country: "USA", region: "Domestic US",
      vibes: ["city", "food", "music", "budget", "outdoors"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 85, mid: 150, lux: 300 },
      visaUS: "none", tzOffset: 0,
      notes: "Live music, BBQ, Lady Bird Lake. Great value compared to other major US cities.",
      monthly: [
        m("shoulder", 150, 240, 460, "good", "med"),
        m("shoulder", 160, 250, 480, "good", "med"),
        m("peak", 200, 320, 600, "great", "high"),
        m("peak", 200, 320, 600, "great", "high"),
        m("shoulder", 170, 270, 500, "great", "med"),
        m("shoulder", 160, 260, 480, "hot", "med"),
        m("low", 150, 230, 440, "hot", "low"),
        m("low", 150, 230, 440, "hot", "low"),
        m("shoulder", 170, 270, 500, "good", "med"),
        m("shoulder", 180, 280, 520, "great", "med"),
        m("shoulder", 170, 270, 500, "good", "med"),
        m("shoulder", 160, 250, 480, "good", "med")
      ]
    },
    {
      id: "nashville", name: "Nashville", country: "USA", region: "Domestic US",
      vibes: ["city", "food", "music", "budget", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 0.9,
      dailyGround: { budget: 80, mid: 140, lux: 280 },
      visaUS: "none", tzOffset: 0,
      notes: "Broadway honky-tonks, hot chicken, and surprisingly affordable. Bachelorette weekend hub.",
      monthly: [
        m("shoulder", 140, 220, 420, "mixed", "med"),
        m("shoulder", 140, 220, 420, "mixed", "med"),
        m("peak", 180, 280, 520, "good", "high"),
        m("peak", 190, 300, 560, "great", "high"),
        m("peak", 200, 310, 580, "great", "high"),
        m("shoulder", 170, 260, 480, "great", "med"),
        m("shoulder", 160, 250, 460, "hot", "med"),
        m("shoulder", 160, 250, 460, "hot", "med"),
        m("shoulder", 170, 260, 480, "great", "med"),
        m("peak", 190, 300, 560, "great", "high"),
        m("shoulder", 170, 260, 480, "good", "med"),
        m("shoulder", 150, 240, 440, "mixed", "med")
      ]
    },
    {
      id: "chicago", name: "Chicago", country: "USA", region: "Domestic US",
      vibes: ["city", "food", "culture", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 0.9,
      dailyGround: { budget: 100, mid: 180, lux: 360 },
      visaUS: "none", tzOffset: 0,
      notes: "World-class food, architecture, and museums. Summer is peak and spectacular.",
      monthly: [
        m("low", 120, 190, 360, "cold", "low"),
        m("low", 120, 190, 360, "cold", "low"),
        m("shoulder", 150, 240, 460, "mixed", "med"),
        m("shoulder", 170, 270, 500, "good", "med"),
        m("peak", 200, 320, 600, "great", "high"),
        m("peak", 220, 350, 660, "great", "high"),
        m("peak", 240, 380, 700, "great", "high"),
        m("peak", 230, 360, 680, "great", "high"),
        m("shoulder", 190, 300, 560, "great", "med"),
        m("shoulder", 170, 270, 500, "good", "med"),
        m("low", 140, 220, 420, "mixed", "low"),
        m("low", 120, 190, 360, "cold", "low")
      ]
    },
    {
      id: "portland_oregon", name: "Portland, OR", country: "USA", region: "Domestic US",
      vibes: ["city", "food", "outdoors", "budget", "culture"],
      regionFlight: "domestic", flightSurcharge: 1.0,
      dailyGround: { budget: 85, mid: 150, lux: 300 },
      visaUS: "none", tzOffset: -3,
      notes: "Coffee, food carts, craft beer, and easy access to Mt. Hood and the Columbia River Gorge.",
      monthly: [
        m("low", 130, 200, 380, "rainy", "low"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("shoulder", 150, 240, 460, "mixed", "med"),
        m("shoulder", 160, 250, 480, "good", "med"),
        m("shoulder", 170, 270, 500, "great", "med"),
        m("peak", 200, 320, 600, "great", "high"),
        m("peak", 220, 350, 660, "great", "high"),
        m("peak", 220, 350, 660, "great", "high"),
        m("peak", 190, 300, 560, "great", "high"),
        m("shoulder", 160, 250, 480, "mixed", "med"),
        m("low", 130, 200, 380, "rainy", "low"),
        m("low", 120, 190, 360, "rainy", "low")
      ]
    },
    {
      id: "scottsdale", name: "Scottsdale / Sedona", country: "USA", region: "Domestic US",
      vibes: ["outdoors", "luxury", "romantic", "familyfriendly"],
      regionFlight: "domestic", flightSurcharge: 0.95,
      dailyGround: { budget: 90, mid: 160, lux: 340 },
      visaUS: "none", tzOffset: -2,
      notes: "World-class resorts, red rock hiking, and golf. Spring and fall are the sweet spots.",
      monthly: [
        m("peak", 220, 360, 700, "great", "high"),
        m("peak", 240, 380, 740, "great", "high"),
        m("peak", 260, 420, 800, "great", "high"),
        m("shoulder", 200, 320, 620, "great", "med"),
        m("shoulder", 160, 260, 500, "hot", "med"),
        m("low", 120, 190, 380, "hot", "low"),
        m("low", 110, 180, 360, "hot", "low"),
        m("low", 110, 180, 360, "hot", "low"),
        m("shoulder", 150, 240, 460, "great", "med"),
        m("peak", 200, 320, 620, "great", "high"),
        m("peak", 220, 360, 700, "great", "high"),
        m("peak", 220, 360, 700, "great", "high")
      ]
    },
    {
      id: "singapore", name: "Singapore", country: "Singapore", region: "Asia",
      vibes: ["city", "food", "culture", "luxury", "familyfriendly"],
      regionFlight: "asia", flightSurcharge: 1.1,
      dailyGround: { budget: 90, mid: 170, lux: 380 },
      visaUS: "none", tzOffset: 13,
      notes: "One of the world's great food cities. Clean, safe, and a natural stopover on Asia trips.",
      monthly: [
        m("shoulder", 180, 300, 600, "hot", "med"),
        m("shoulder", 180, 300, 600, "hot", "med"),
        m("peak", 200, 340, 680, "hot", "high"),
        m("peak", 210, 350, 700, "hot", "high"),
        m("shoulder", 190, 320, 640, "hot", "med"),
        m("shoulder", 180, 300, 600, "rainy", "med"),
        m("shoulder", 180, 300, 600, "rainy", "med"),
        m("shoulder", 180, 300, 600, "hot", "med"),
        m("shoulder", 190, 320, 640, "rainy", "med"),
        m("shoulder", 190, 320, 640, "rainy", "med"),
        m("shoulder", 190, 320, 640, "rainy", "med"),
        m("peak", 210, 350, 700, "hot", "high")
      ]
    },
    {
      id: "south_korea", name: "Seoul", country: "South Korea", region: "Asia",
      vibes: ["city", "food", "culture", "budget", "adventure"],
      regionFlight: "asia", flightSurcharge: 1.05,
      dailyGround: { budget: 60, mid: 120, lux: 260 },
      visaUS: "none", tzOffset: 14,
      notes: "Incredible food, K-culture, palaces, and hiking. Cheaper than Japan with similar depth.",
      monthly: [
        m("low", 130, 200, 380, "cold", "low"),
        m("low", 130, 200, 380, "cold", "low"),
        m("peak", 170, 270, 520, "good", "high"),
        m("peak", 190, 300, 580, "great", "high"),
        m("peak", 200, 320, 620, "great", "high"),
        m("shoulder", 160, 250, 480, "rainy", "med"),
        m("shoulder", 150, 240, 460, "rainy", "med"),
        m("shoulder", 160, 250, 480, "hot", "med"),
        m("peak", 190, 300, 580, "great", "high"),
        m("peak", 200, 320, 620, "great", "high"),
        m("shoulder", 150, 240, 460, "mixed", "med"),
        m("low", 130, 200, 380, "cold", "low")
      ]
    },
    {
      id: "sri_lanka", name: "Sri Lanka", country: "Sri Lanka", region: "Asia",
      vibes: ["beach", "culture", "adventure", "budget", "outdoors"],
      regionFlight: "asia", flightSurcharge: 1.15,
      dailyGround: { budget: 40, mid: 80, lux: 200 },
      visaUS: "visa_on_arrival", tzOffset: 10.5,
      notes: "Temples, tea country, elephants, and beaches. One of the best value destinations in Asia.",
      monthly: [
        m("peak", 120, 200, 420, "great", "high"),
        m("peak", 130, 210, 440, "great", "high"),
        m("shoulder", 110, 180, 380, "good", "med"),
        m("shoulder", 100, 170, 360, "mixed", "med"),
        m("low", 80, 140, 300, "rainy", "low"),
        m("low", 70, 130, 280, "rainy", "low"),
        m("low", 80, 140, 300, "mixed", "low"),
        m("shoulder", 100, 170, 360, "good", "med"),
        m("shoulder", 100, 170, 360, "good", "med"),
        m("peak", 120, 200, 420, "great", "high"),
        m("peak", 130, 210, 440, "great", "high"),
        m("peak", 130, 210, 440, "great", "high")
      ]
    },
    {
      id: "florence", name: "Florence & Tuscany", country: "Italy", region: "Europe",
      vibes: ["culture", "food", "romantic", "city"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 95, mid: 170, lux: 340 },
      visaUS: "none", tzOffset: 6,
      notes: "Renaissance art, Chianti, and Tuscan hill towns. Shoulder season (Apr-May, Sep-Oct) is the move.",
      monthly: [
        m("low", 140, 220, 420, "mixed", "low"),
        m("low", 140, 220, 420, "mixed", "low"),
        m("shoulder", 180, 280, 540, "good", "med"),
        m("peak", 220, 360, 700, "great", "high"),
        m("peak", 240, 380, 740, "great", "high"),
        m("peak", 260, 420, 820, "great", "high"),
        m("peak", 280, 460, 880, "hot", "high"),
        m("peak", 280, 460, 880, "hot", "high"),
        m("peak", 240, 380, 740, "great", "high"),
        m("peak", 220, 360, 700, "great", "high"),
        m("shoulder", 160, 260, 500, "mixed", "med"),
        m("low", 140, 220, 420, "mixed", "low")
      ]
    },
    {
      id: "amalfi", name: "Amalfi Coast & Naples", country: "Italy", region: "Europe",
      vibes: ["romantic", "beach", "food", "culture", "luxury"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 100, mid: 190, lux: 400 },
      visaUS: "none", tzOffset: 6,
      notes: "Dramatic clifftop villages and the best pizza on earth. Avoid August crowds; May and September are ideal.",
      monthly: [
        m("low", 140, 220, 440, "mixed", "low"),
        m("low", 140, 220, 440, "mixed", "low"),
        m("shoulder", 180, 290, 580, "good", "med"),
        m("shoulder", 210, 340, 680, "great", "med"),
        m("peak", 260, 420, 840, "great", "high"),
        m("peak", 300, 480, 960, "great", "high"),
        m("peak", 340, 540, 1080, "hot", "high"),
        m("peak", 340, 540, 1080, "hot", "high"),
        m("peak", 280, 450, 900, "great", "high"),
        m("shoulder", 200, 320, 640, "good", "med"),
        m("low", 150, 240, 480, "mixed", "low"),
        m("low", 140, 220, 440, "cold", "low")
      ]
    },
    {
      id: "croatia", name: "Dubrovnik & Dalmatian Coast", country: "Croatia", region: "Europe",
      vibes: ["beach", "culture", "romantic", "food", "adventure"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 80, mid: 150, lux: 300 },
      visaUS: "none", tzOffset: 6,
      notes: "Game of Thrones filming locations, crystal-clear Adriatic, and island hopping. June and September over July-August.",
      monthly: [
        m("low", 120, 190, 360, "mixed", "low"),
        m("low", 120, 190, 360, "mixed", "low"),
        m("shoulder", 150, 240, 460, "good", "med"),
        m("shoulder", 180, 290, 560, "great", "med"),
        m("peak", 230, 370, 720, "great", "high"),
        m("peak", 280, 450, 880, "great", "high"),
        m("peak", 340, 540, 1060, "great", "high"),
        m("peak", 330, 520, 1040, "great", "high"),
        m("peak", 260, 420, 820, "great", "high"),
        m("shoulder", 180, 290, 560, "good", "med"),
        m("low", 130, 200, 380, "mixed", "low"),
        m("low", 120, 190, 360, "mixed", "low")
      ]
    },
    {
      id: "switzerland", name: "Swiss Alps (Interlaken + Zermatt)", country: "Switzerland", region: "Europe",
      vibes: ["outdoors", "adventure", "luxury", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 150, mid: 260, lux: 520 },
      visaUS: "none", tzOffset: 6,
      notes: "Most expensive destination in Europe but the Alps are unmatched. Summer hiking or winter skiing.",
      monthly: [
        m("peak", 300, 500, 1000, "cold", "high"),
        m("peak", 320, 520, 1040, "cold", "high"),
        m("shoulder", 260, 420, 840, "mixed", "med"),
        m("shoulder", 260, 420, 840, "good", "med"),
        m("shoulder", 280, 450, 900, "great", "med"),
        m("peak", 340, 560, 1120, "great", "high"),
        m("peak", 380, 620, 1240, "great", "high"),
        m("peak", 380, 620, 1240, "great", "high"),
        m("shoulder", 280, 460, 920, "great", "med"),
        m("shoulder", 260, 420, 840, "mixed", "med"),
        m("shoulder", 280, 450, 900, "mixed", "med"),
        m("peak", 320, 520, 1040, "cold", "high")
      ]
    },
    {
      id: "colombia_medellin", name: "Medellín", country: "Colombia", region: "South America",
      vibes: ["city", "food", "culture", "budget", "adventure"],
      regionFlight: "latam", flightSurcharge: 0.95,
      dailyGround: { budget: 40, mid: 80, lux: 180 },
      visaUS: "none", tzOffset: 0,
      notes: "The City of Eternal Spring. Incredible food, vibrant neighborhoods, and one of the best values in the Americas.",
      monthly: [
        m("shoulder", 90, 160, 340, "good", "med"),
        m("shoulder", 90, 160, 340, "good", "med"),
        m("peak", 110, 190, 400, "great", "high"),
        m("peak", 120, 200, 420, "great", "high"),
        m("shoulder", 100, 170, 360, "rainy", "med"),
        m("low", 80, 140, 300, "rainy", "low"),
        m("peak", 110, 190, 400, "good", "high"),
        m("peak", 110, 190, 400, "good", "high"),
        m("shoulder", 90, 160, 340, "rainy", "med"),
        m("shoulder", 100, 170, 360, "rainy", "med"),
        m("peak", 110, 190, 400, "great", "high"),
        m("peak", 120, 200, 420, "great", "high")
      ]
    },
    {
      id: "ecuador_galapagos", name: "Galápagos Islands", country: "Ecuador", region: "South America",
      vibes: ["adventure", "outdoors", "culture"],
      regionFlight: "latam", flightSurcharge: 1.1,
      dailyGround: { budget: 150, mid: 280, lux: 600 },
      visaUS: "none", tzOffset: 0,
      notes: "Bucket-list wildlife. Liveaboard cruises are the best way in. $100 park fee on top of all costs.",
      monthly: [
        m("peak", 320, 540, 1100, "hot", "high"),
        m("peak", 340, 560, 1140, "hot", "high"),
        m("peak", 340, 560, 1140, "hot", "high"),
        m("shoulder", 280, 460, 940, "mixed", "med"),
        m("shoulder", 260, 440, 900, "good", "med"),
        m("shoulder", 260, 440, 900, "good", "med"),
        m("shoulder", 280, 460, 940, "good", "med"),
        m("shoulder", 280, 460, 940, "good", "med"),
        m("shoulder", 280, 460, 940, "good", "med"),
        m("shoulder", 280, 460, 940, "good", "med"),
        m("peak", 310, 520, 1060, "hot", "high"),
        m("peak", 320, 540, 1100, "hot", "high")
      ]
    },
    {
      id: "kenya_safari", name: "Kenya (Masai Mara Safari)", country: "Kenya", region: "Africa",
      vibes: ["adventure", "outdoors", "luxury"],
      regionFlight: "africa", flightSurcharge: 1.2,
      dailyGround: { budget: 200, mid: 400, lux: 900 },
      visaUS: "visa_required", tzOffset: 8,
      notes: "The Great Migration (July-October) is one of the world's great wildlife events. Not budget travel.",
      monthly: [
        m("shoulder", 380, 700, 1600, "good", "med"),
        m("shoulder", 360, 680, 1540, "good", "med"),
        m("shoulder", 360, 680, 1540, "good", "med"),
        m("low", 300, 580, 1300, "rainy", "low"),
        m("low", 280, 540, 1220, "rainy", "low"),
        m("shoulder", 360, 680, 1540, "good", "med"),
        m("peak", 480, 900, 2100, "great", "high"),
        m("peak", 520, 980, 2300, "great", "high"),
        m("peak", 500, 940, 2200, "great", "high"),
        m("shoulder", 380, 700, 1600, "good", "med"),
        m("low", 300, 560, 1280, "rainy", "low"),
        m("shoulder", 360, 680, 1540, "good", "med")
      ]
    },
    {
      id: "portugal_algarve", name: "Algarve (Southern Portugal)", country: "Portugal", region: "Europe",
      vibes: ["beach", "budget", "outdoors", "food", "romantic"],
      regionFlight: "europe", flightSurcharge: 1.0,
      dailyGround: { budget: 65, mid: 120, lux: 250 },
      visaUS: "none", tzOffset: 5,
      notes: "Europe's best beaches at Portugal prices. Lagos and Sagres are the standouts. Shoulder season beats the crowds.",
      monthly: [
        m("low", 130, 200, 380, "mixed", "low"),
        m("low", 130, 200, 380, "mixed", "low"),
        m("shoulder", 160, 250, 480, "good", "med"),
        m("shoulder", 180, 280, 540, "great", "med"),
        m("peak", 230, 360, 700, "great", "high"),
        m("peak", 280, 440, 860, "great", "high"),
        m("peak", 340, 540, 1060, "great", "high"),
        m("peak", 330, 520, 1020, "great", "high"),
        m("peak", 270, 430, 840, "great", "high"),
        m("shoulder", 180, 280, 540, "good", "med"),
        m("low", 140, 220, 420, "mixed", "low"),
        m("low", 130, 200, 380, "mixed", "low")
      ]
    },
    {
      id: "taiwan", name: "Taipei & Taiwan", country: "Taiwan", region: "Asia",
      vibes: ["city", "food", "culture", "budget", "outdoors"],
      regionFlight: "asia", flightSurcharge: 1.05,
      dailyGround: { budget: 50, mid: 100, lux: 230 },
      visaUS: "none", tzOffset: 13,
      notes: "Underrated food paradise, night markets, Taroko Gorge, and hot springs. No visa required for US citizens.",
      monthly: [
        m("shoulder", 130, 210, 420, "mixed", "med"),
        m("shoulder", 130, 210, 420, "mixed", "med"),
        m("shoulder", 140, 220, 440, "good", "med"),
        m("peak", 170, 270, 540, "great", "high"),
        m("peak", 180, 290, 580, "great", "high"),
        m("shoulder", 150, 240, 480, "rainy", "med"),
        m("shoulder", 150, 240, 480, "hot", "med"),
        m("shoulder", 150, 240, 480, "hot", "med"),
        m("shoulder", 150, 240, 480, "mixed", "med"),
        m("peak", 180, 290, 580, "great", "high"),
        m("peak", 180, 290, 580, "great", "high"),
        m("shoulder", 140, 220, 440, "mixed", "med")
      ]
    },
    // ============== BATCH 3 — 26 more destinations ===============
    {id:"san_francisco",name:"San Francisco",country:"USA",region:"Domestic US",vibes:["city","food","culture","outdoors"],regionFlight:"domestic",flightSurcharge:1.0,dailyGround:{budget:110,mid:200,lux:420},visaUS:"none",tzOffset:-3,notes:"Golden Gate, Napa day trips, world-class food. September and October are the best months.",monthly:[m("shoulder",180,300,580,"mixed","med"),m("shoulder",180,300,580,"mixed","med"),m("shoulder",190,310,600,"mixed","med"),m("peak",230,370,720,"good","high"),m("shoulder",200,320,620,"mixed","med"),m("shoulder",190,310,600,"foggy","med"),m("shoulder",190,310,600,"foggy","med"),m("shoulder",200,320,620,"foggy","med"),m("peak",240,380,740,"great","high"),m("peak",230,370,720,"great","high"),m("shoulder",200,320,620,"good","med"),m("shoulder",180,300,580,"mixed","med")]},
    {id:"seattle",name:"Seattle",country:"USA",region:"Domestic US",vibes:["city","food","outdoors","culture"],regionFlight:"domestic",flightSurcharge:1.0,dailyGround:{budget:95,mid:170,lux:340},visaUS:"none",tzOffset:-3,notes:"Pike Place, Mt. Rainier, Olympic Peninsula. July and August are dry and spectacular.",monthly:[m("low",150,230,440,"rainy","low"),m("low",150,230,440,"rainy","low"),m("shoulder",170,260,500,"mixed","med"),m("shoulder",180,280,540,"mixed","med"),m("shoulder",190,300,580,"good","med"),m("shoulder",200,320,620,"good","med"),m("peak",250,400,780,"great","high"),m("peak",250,400,780,"great","high"),m("peak",220,350,680,"great","high"),m("shoulder",190,300,580,"mixed","med"),m("low",160,250,480,"rainy","low"),m("low",150,230,440,"rainy","low")]},
    {id:"boston",name:"Boston",country:"USA",region:"Domestic US",vibes:["city","culture","food","history"],regionFlight:"domestic",flightSurcharge:0.9,dailyGround:{budget:100,mid:180,lux:360},visaUS:"none",tzOffset:1,notes:"History, lobster rolls, fall foliage. September and October are peak for a reason.",monthly:[m("low",140,220,420,"cold","low"),m("low",140,220,420,"cold","low"),m("shoulder",160,260,500,"mixed","med"),m("shoulder",180,290,560,"good","med"),m("peak",220,360,700,"great","high"),m("peak",240,380,740,"great","high"),m("peak",260,420,820,"great","high"),m("peak",260,420,820,"great","high"),m("peak",250,400,780,"great","high"),m("peak",260,420,820,"great","high"),m("shoulder",180,290,560,"mixed","med"),m("low",150,240,460,"cold","low")]},
    {id:"washington_dc",name:"Washington DC",country:"USA",region:"Domestic US",vibes:["city","culture","history","familyfriendly","budget"],regionFlight:"domestic",flightSurcharge:0.9,dailyGround:{budget:90,mid:160,lux:320},visaUS:"none",tzOffset:1,notes:"Free Smithsonian museums. One of the best-value US city trips.",monthly:[m("low",140,220,420,"cold","low"),m("low",140,220,420,"cold","low"),m("peak",220,360,700,"great","high"),m("peak",220,360,700,"great","high"),m("peak",200,320,620,"great","high"),m("shoulder",170,270,520,"hot","med"),m("shoulder",170,270,520,"hot","med"),m("shoulder",170,270,520,"hot","med"),m("shoulder",180,290,560,"great","med"),m("peak",210,340,660,"great","high"),m("shoulder",170,270,520,"good","med"),m("low",140,220,420,"cold","low")]},
    {id:"hawaii_big_island",name:"Big Island (Hawaii)",country:"USA",region:"Hawaii",vibes:["outdoors","adventure","beach","romantic"],regionFlight:"hawaii",flightSurcharge:1.0,dailyGround:{budget:105,mid:180,lux:360},visaUS:"none",tzOffset:-5,notes:"Active volcanoes, black sand beaches, manta ray snorkeling. Less crowded than Maui.",monthly:[m("shoulder",200,320,620,"great","med"),m("shoulder",200,320,620,"great","med"),m("peak",250,400,780,"great","high"),m("peak",240,390,760,"great","high"),m("shoulder",200,320,620,"great","med"),m("shoulder",190,300,580,"great","med"),m("shoulder",200,320,620,"great","med"),m("shoulder",200,320,620,"great","med"),m("shoulder",190,300,580,"great","med"),m("shoulder",190,300,580,"great","med"),m("shoulder",200,320,620,"great","med"),m("peak",240,390,760,"great","high")]},
    {id:"budapest",name:"Budapest",country:"Hungary",region:"Europe",vibes:["city","culture","food","budget","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:55,mid:100,lux:210},visaUS:"none",tzOffset:6,notes:"Thermal baths, ruin bars, stunning architecture at Eastern European prices.",monthly:[m("low",120,185,360,"cold","low"),m("low",120,185,360,"cold","low"),m("shoulder",150,240,460,"mixed","med"),m("peak",190,310,600,"great","high"),m("peak",210,340,660,"great","high"),m("peak",230,370,720,"great","high"),m("peak",250,400,780,"hot","high"),m("peak",240,390,760,"hot","high"),m("peak",220,360,700,"great","high"),m("shoulder",180,290,560,"good","med"),m("low",140,220,420,"mixed","low"),m("low",120,185,360,"cold","low")]},
    {id:"copenhagen",name:"Copenhagen",country:"Denmark",region:"Europe",vibes:["city","food","culture","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:110,mid:200,lux:420},visaUS:"none",tzOffset:6,notes:"Design, hygge, Noma's legacy dining scene, and Tivoli Gardens.",monthly:[m("low",160,260,500,"cold","low"),m("low",160,260,500,"cold","low"),m("shoulder",190,310,600,"mixed","med"),m("shoulder",210,340,660,"good","med"),m("peak",260,420,820,"great","high"),m("peak",290,470,920,"great","high"),m("peak",320,520,1020,"great","high"),m("peak",310,500,980,"great","high"),m("shoulder",250,400,780,"great","med"),m("shoulder",210,340,660,"mixed","med"),m("low",170,270,520,"mixed","low"),m("low",160,260,500,"cold","low")]},
    {id:"vienna",name:"Vienna",country:"Austria",region:"Europe",vibes:["culture","city","food","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:85,mid:155,lux:320},visaUS:"none",tzOffset:6,notes:"Coffee houses, Mozart, museums, and imperial architecture.",monthly:[m("low",140,220,420,"cold","low"),m("low",140,220,420,"cold","low"),m("shoulder",170,270,520,"mixed","med"),m("peak",210,340,660,"great","high"),m("peak",230,370,720,"great","high"),m("peak",250,400,780,"great","high"),m("peak",270,440,860,"great","high"),m("peak",260,420,820,"great","high"),m("peak",240,390,760,"great","high"),m("shoulder",190,310,600,"good","med"),m("low",150,240,460,"mixed","low"),m("low",140,220,420,"cold","low")]},
    {id:"stockholm",name:"Stockholm",country:"Sweden",region:"Europe",vibes:["city","culture","outdoors","food","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:100,mid:185,lux:380},visaUS:"none",tzOffset:6,notes:"Archipelago islands, ABBA Museum, and Gamla Stan. Summer is spectacular.",monthly:[m("low",160,250,480,"cold","low"),m("low",160,250,480,"cold","low"),m("shoulder",180,280,540,"mixed","med"),m("shoulder",200,320,620,"good","med"),m("peak",250,400,780,"great","high"),m("peak",280,450,880,"great","high"),m("peak",320,520,1020,"great","high"),m("peak",310,500,980,"great","high"),m("shoulder",240,390,760,"great","med"),m("shoulder",200,320,620,"mixed","med"),m("low",170,270,520,"mixed","low"),m("low",160,250,480,"cold","low")]},
    {id:"mexico_oaxaca",name:"Oaxaca",country:"Mexico",region:"Mexico",vibes:["culture","food","budget","adventure","city"],regionFlight:"latam",flightSurcharge:0.95,dailyGround:{budget:45,mid:85,lux:180},visaUS:"none",tzOffset:0,notes:"The food capital of Mexico. Mole, mezcal, Zapotec ruins. October-November is unmissable.",monthly:[m("shoulder",100,170,340,"good","med"),m("shoulder",100,170,340,"good","med"),m("shoulder",110,180,360,"great","med"),m("peak",130,210,420,"great","high"),m("shoulder",110,180,360,"good","med"),m("low",90,150,300,"rainy","low"),m("low",90,150,300,"rainy","low"),m("low",90,150,300,"rainy","low"),m("shoulder",100,170,340,"good","med"),m("peak",140,230,460,"great","high"),m("peak",150,240,480,"great","high"),m("shoulder",120,200,400,"good","med")]},
    {id:"panama",name:"Panama City & Bocas del Toro",country:"Panama",region:"Central America",vibes:["city","beach","adventure","budget","culture"],regionFlight:"latam",flightSurcharge:0.95,dailyGround:{budget:60,mid:110,lux:240},visaUS:"none",tzOffset:0,notes:"Panama City is the most underrated city in Latin America.",monthly:[m("peak",130,210,420,"great","high"),m("peak",140,220,440,"great","high"),m("peak",140,220,440,"great","high"),m("shoulder",110,180,360,"mixed","med"),m("shoulder",100,165,330,"rainy","med"),m("low",90,150,300,"rainy","low"),m("low",90,150,300,"rainy","low"),m("low",90,150,300,"rainy","low"),m("shoulder",100,165,330,"mixed","med"),m("shoulder",110,180,360,"mixed","med"),m("peak",130,210,420,"great","high"),m("peak",140,220,440,"great","high")]},
    {id:"brazil_rio",name:"Rio de Janeiro",country:"Brazil",region:"South America",vibes:["beach","city","culture","food","adventure"],regionFlight:"latam",flightSurcharge:1.05,dailyGround:{budget:65,mid:125,lux:280},visaUS:"none",tzOffset:2,notes:"Christ the Redeemer, Copacabana, Carnival in February. May-September is dry season.",monthly:[m("shoulder",160,260,520,"hot","med"),m("peak",220,370,740,"great","high"),m("shoulder",160,260,520,"hot","med"),m("shoulder",150,245,490,"good","med"),m("shoulder",140,230,460,"good","med"),m("peak",170,280,560,"great","high"),m("peak",180,290,580,"great","high"),m("peak",180,290,580,"great","high"),m("shoulder",150,245,490,"good","med"),m("shoulder",140,230,460,"good","med"),m("shoulder",150,245,490,"good","med"),m("shoulder",160,260,520,"hot","med")]},
    {id:"philippines_palawan",name:"Palawan (Philippines)",country:"Philippines",region:"Asia",vibes:["beach","adventure","budget","outdoors","romantic"],regionFlight:"asia",flightSurcharge:1.1,dailyGround:{budget:40,mid:80,lux:200},visaUS:"none",tzOffset:13,notes:"El Nido's limestone cliffs and turquoise lagoons at budget prices.",monthly:[m("peak",130,210,440,"great","high"),m("peak",140,230,460,"great","high"),m("peak",140,230,460,"great","high"),m("shoulder",110,185,370,"good","med"),m("shoulder",100,170,340,"mixed","med"),m("low",80,140,280,"rainy","low"),m("low",80,140,280,"rainy","low"),m("low",80,140,280,"rainy","low"),m("low",85,145,290,"rainy","low"),m("shoulder",100,170,340,"good","med"),m("peak",130,210,440,"great","high"),m("peak",140,230,460,"great","high")]},
    {id:"cambodia",name:"Angkor Wat & Siem Reap",country:"Cambodia",region:"Asia",vibes:["culture","budget","adventure","history"],regionFlight:"asia",flightSurcharge:1.1,dailyGround:{budget:30,mid:65,lux:160},visaUS:"visa_on_arrival",tzOffset:12,notes:"The ancient Khmer temples. Best combined with Vietnam or Thailand.",monthly:[m("peak",100,175,360,"great","high"),m("peak",110,185,380,"great","high"),m("peak",110,185,380,"great","high"),m("shoulder",90,155,320,"hot","med"),m("low",75,130,260,"hot","low"),m("low",70,120,240,"rainy","low"),m("low",70,120,240,"rainy","low"),m("low",70,120,240,"rainy","low"),m("low",75,130,260,"rainy","low"),m("shoulder",90,155,320,"good","med"),m("peak",105,180,370,"great","high"),m("peak",110,185,380,"great","high")]},
    {id:"jordan",name:"Petra & Wadi Rum",country:"Jordan",region:"Middle East",vibes:["culture","adventure","outdoors","history"],regionFlight:"europe",flightSurcharge:1.05,dailyGround:{budget:70,mid:130,lux:300},visaUS:"visa_on_arrival",tzOffset:8,notes:"The Lost City of Petra and Wadi Rum desert camping. March-May and September-November are ideal.",monthly:[m("shoulder",150,240,480,"good","med"),m("shoulder",150,240,480,"good","med"),m("peak",190,310,620,"great","high"),m("peak",200,330,660,"great","high"),m("peak",190,310,620,"great","high"),m("shoulder",160,260,520,"hot","med"),m("low",140,230,460,"hot","low"),m("low",140,230,460,"hot","low"),m("peak",190,310,620,"great","high"),m("peak",200,330,660,"great","high"),m("shoulder",160,260,520,"good","med"),m("shoulder",150,240,480,"good","med")]},
    {id:"portugal_porto",name:"Porto",country:"Portugal",region:"Europe",vibes:["food","city","culture","budget","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:65,mid:120,lux:250},visaUS:"none",tzOffset:5,notes:"Port wine, tiled buildings, and the Douro Valley. Often better value than Lisbon.",monthly:[m("low",130,200,380,"rainy","low"),m("low",130,200,380,"rainy","low"),m("shoulder",150,240,460,"mixed","med"),m("shoulder",170,270,520,"good","med"),m("peak",220,360,700,"great","high"),m("peak",260,420,820,"great","high"),m("peak",310,500,980,"great","high"),m("peak",300,490,960,"great","high"),m("peak",250,400,780,"great","high"),m("shoulder",190,310,600,"good","med"),m("low",140,220,420,"mixed","low"),m("low",130,200,380,"rainy","low")]},
    {id:"spain_seville",name:"Seville & Andalusia",country:"Spain",region:"Europe",vibes:["culture","food","city","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:70,mid:130,lux:270},visaUS:"none",tzOffset:6,notes:"Flamenco, tapas, the Alhambra. Avoid July-August heat. March-May and October are ideal.",monthly:[m("shoulder",140,220,420,"good","med"),m("shoulder",150,240,460,"good","med"),m("peak",200,320,620,"great","high"),m("peak",220,360,700,"great","high"),m("peak",210,340,660,"great","high"),m("shoulder",170,270,520,"hot","med"),m("low",150,240,460,"hot","low"),m("low",150,240,460,"hot","low"),m("shoulder",180,290,560,"great","med"),m("peak",210,340,660,"great","high"),m("shoulder",170,270,520,"good","med"),m("shoulder",150,240,460,"good","med")]},
    {id:"norway_fjords",name:"Norwegian Fjords",country:"Norway",region:"Europe",vibes:["outdoors","adventure","romantic","luxury"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:130,mid:240,lux:500},visaUS:"none",tzOffset:6,notes:"The most dramatic scenery in Europe. Sognefjord, Flam Railway, midnight sun.",monthly:[m("low",180,290,580,"cold","low"),m("low",180,290,580,"cold","low"),m("shoulder",200,320,640,"mixed","med"),m("shoulder",220,360,720,"good","med"),m("peak",280,460,920,"great","high"),m("peak",320,520,1040,"great","high"),m("peak",350,580,1160,"great","high"),m("peak",340,560,1120,"great","high"),m("shoulder",260,420,840,"good","med"),m("shoulder",220,360,720,"mixed","med"),m("low",190,300,600,"mixed","low"),m("low",180,290,580,"cold","low")]},
    {id:"tanzania_zanzibar",name:"Zanzibar",country:"Tanzania",region:"Africa",vibes:["beach","culture","adventure","romantic"],regionFlight:"africa",flightSurcharge:1.2,dailyGround:{budget:65,mid:130,lux:300},visaUS:"visa_on_arrival",tzOffset:8,notes:"Spice island, turquoise water, Stone Town. Often combined with a Serengeti safari.",monthly:[m("peak",160,270,540,"great","high"),m("peak",170,280,560,"great","high"),m("peak",170,280,560,"great","high"),m("low",120,200,400,"rainy","low"),m("low",110,185,370,"rainy","low"),m("shoulder",130,215,430,"good","med"),m("peak",160,270,540,"great","high"),m("peak",160,270,540,"great","high"),m("shoulder",140,230,460,"good","med"),m("shoulder",140,230,460,"good","med"),m("low",120,200,400,"rainy","low"),m("peak",160,270,540,"great","high")]},
    {id:"nepal",name:"Kathmandu & Everest Region",country:"Nepal",region:"Asia",vibes:["adventure","outdoors","culture","budget"],regionFlight:"asia",flightSurcharge:1.15,dailyGround:{budget:45,mid:90,lux:220},visaUS:"visa_on_arrival",tzOffset:10.75,notes:"Trekking, temples, and the Himalayas. October is peak trekking season.",monthly:[m("shoulder",120,200,400,"cold","med"),m("shoulder",120,200,400,"cold","med"),m("shoulder",130,210,420,"good","med"),m("peak",150,250,500,"great","high"),m("peak",150,250,500,"great","high"),m("low",100,170,340,"rainy","low"),m("low",100,170,340,"rainy","low"),m("low",100,170,340,"rainy","low"),m("shoulder",130,210,420,"good","med"),m("peak",160,265,530,"great","high"),m("peak",150,250,500,"great","high"),m("shoulder",120,200,400,"cold","med")]},
    {id:"indonesia_lombok",name:"Lombok & Gili Islands",country:"Indonesia",region:"Asia",vibes:["beach","budget","outdoors","romantic","adventure"],regionFlight:"asia",flightSurcharge:1.1,dailyGround:{budget:40,mid:80,lux:200},visaUS:"visa_on_arrival",tzOffset:13,notes:"Quieter than Bali with better beaches. Rinjani volcano and Gili Islands.",monthly:[m("low",100,175,360,"rainy","low"),m("low",100,175,360,"rainy","low"),m("low",100,175,360,"rainy","low"),m("shoulder",110,185,370,"good","med"),m("peak",130,215,430,"great","high"),m("peak",140,230,460,"great","high"),m("peak",140,230,460,"great","high"),m("peak",140,230,460,"great","high"),m("peak",130,215,430,"great","high"),m("shoulder",110,185,370,"good","med"),m("low",100,175,360,"mixed","low"),m("low",100,175,360,"rainy","low")]},
    {id:"puerto_rico_rincon",name:"Puerto Rico (West Coast)",country:"USA",region:"Caribbean",vibes:["beach","outdoors","budget","romantic"],regionFlight:"caribbean",flightSurcharge:0.95,dailyGround:{budget:65,mid:120,lux:260},visaUS:"none",tzOffset:-1,notes:"Surf capital of the Caribbean. No passport needed for US citizens. Far quieter than San Juan.",monthly:[m("peak",170,270,520,"great","high"),m("peak",180,290,560,"great","high"),m("peak",180,290,560,"great","high"),m("shoulder",140,230,460,"great","med"),m("shoulder",130,210,420,"great","med"),m("low",110,180,360,"hot","low"),m("low",120,190,380,"hot","med"),m("low",120,190,380,"hot","med"),m("low",110,180,360,"stormy","low"),m("low",110,180,360,"stormy","low"),m("shoulder",140,230,460,"great","med"),m("peak",175,280,540,"great","high")]},
    {id:"italy_sicily",name:"Sicily",country:"Italy",region:"Europe",vibes:["food","beach","culture","budget","romantic"],regionFlight:"europe",flightSurcharge:1.0,dailyGround:{budget:75,mid:140,lux:290},visaUS:"none",tzOffset:6,notes:"Mt. Etna, ancient temples, the best food in Italy. May and September beat the summer crowds.",monthly:[m("low",130,200,380,"mixed","low"),m("low",130,200,380,"mixed","low"),m("shoulder",160,250,480,"good","med"),m("shoulder",190,300,580,"great","med"),m("peak",240,380,740,"great","high"),m("peak",280,450,880,"great","high"),m("peak",330,530,1040,"hot","high"),m("peak",320,510,1000,"hot","high"),m("peak",270,430,840,"great","high"),m("shoulder",200,320,620,"great","med"),m("low",150,240,460,"mixed","low"),m("low",130,200,380,"mixed","low")]},

,
    {id:"peru_lima",name:"Lima & Amazon",country:"Peru",region:"South America",vibes:["food","culture","adventure","budget"],regionFlight:"latam",flightSurcharge:1.0,dailyGround:{budget:50,mid:95,lux:210},visaUS:"none",tzOffset:0,notes:"Lima is the food capital of South America. Combine with the Amazon for a complete Peru trip.",monthly:[m("shoulder",120,200,400,"mixed","med"),m("shoulder",120,200,400,"mixed","med"),m("shoulder",120,200,400,"mixed","med"),m("shoulder",115,190,380,"mixed","med"),m("shoulder",110,185,370,"mixed","med"),m("peak",130,215,430,"good","high"),m("peak",140,230,460,"good","high"),m("peak",140,230,460,"good","high"),m("peak",130,215,430,"good","high"),m("shoulder",115,190,380,"mixed","med"),m("shoulder",115,190,380,"mixed","med"),m("shoulder",120,200,400,"mixed","med")]},
    {id:"dominican_republic_samana",name:"Samaná, Dominican Republic",country:"Dominican Republic",region:"Caribbean",vibes:["beach","budget","romantic","outdoors"],regionFlight:"caribbean",flightSurcharge:1.0,dailyGround:{budget:55,mid:105,lux:220},visaUS:"none",tzOffset:-1,notes:"Whale watching January-March, jungle waterfalls, far fewer crowds than Punta Cana.",monthly:[m("peak",160,260,500,"great","high"),m("peak",170,270,520,"great","high"),m("peak",170,270,520,"great","high"),m("shoulder",140,220,440,"great","med"),m("shoulder",130,210,420,"great","med"),m("low",100,170,340,"hot","low"),m("low",110,180,360,"hot","low"),m("low",110,180,360,"hot","low"),m("low",100,165,330,"stormy","low"),m("low",100,165,330,"stormy","low"),m("shoulder",130,210,420,"great","med"),m("peak",160,260,500,"great","high")]},
    {id:"colombia_bogota",name:"Bogotá & Coffee Region",country:"Colombia",region:"South America",vibes:["city","food","culture","budget","adventure"],regionFlight:"latam",flightSurcharge:0.95,dailyGround:{budget:40,mid:80,lux:180},visaUS:"none",tzOffset:0,notes:"Bogotá's world-class museums, coffee-region hiking, and one of the best culinary scenes in South America.",monthly:[m("shoulder",100,165,330,"mixed","med"),m("shoulder",100,165,330,"mixed","med"),m("peak",115,190,380,"good","high"),m("peak",120,200,400,"great","high"),m("shoulder",105,175,350,"rainy","med"),m("low",85,145,290,"rainy","low"),m("peak",115,190,380,"good","high"),m("peak",115,190,380,"good","high"),m("shoulder",100,165,330,"rainy","med"),m("shoulder",105,175,350,"good","med"),m("peak",115,190,380,"great","high"),m("peak",120,200,400,"great","high")]}
  ];

  return {
    DESTINATIONS: DESTINATIONS,
    REGIONS: ["Caribbean","Mexico","Europe","Hawaii","Domestic US","Central America","South America","Asia","Oceania","Africa","Middle East"],
    VIBES: ["beach","city","outdoors","food","culture","adventure","romantic","familyfriendly","budget","luxury"],
    VIBE_LABELS: {
      beach: "Beach", city: "City", outdoors: "Outdoors", food: "Food",
      culture: "Culture", adventure: "Adventure", romantic: "Romantic",
      familyfriendly: "Family-friendly", budget: "Budget", luxury: "Luxury"
    },
    WEATHER_LABELS: {
      great: "Great weather", good: "Good weather", mixed: "Mixed weather",
      rainy: "Rainy", hot: "Hot", cold: "Cold", stormy: "Storm risk"
    },
    MONTH_NAMES: ["January","February","March","April","May","June","July","August","September","October","November","December"]
  };
})();
