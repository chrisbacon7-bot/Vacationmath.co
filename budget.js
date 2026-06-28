/* =====================================================================
   Reverse Vacation Calculator (Budget → Trip)
   Given a budget, party size, nights, and origin, show what trips
   are actually affordable using the same 2026 pricing the other
   calculators use. No live APIs — conservative estimates only.
   ===================================================================== */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  // ---- Pill buttons ----
  document.querySelectorAll(".wpills").forEach(function(group) {
    group.querySelectorAll(".wpill").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var inputId = group.dataset.input;
        var val = parseInt(this.dataset.val, 10);
        var inp = document.getElementById(inputId);
        if (inp) inp.value = val;
        group.querySelectorAll(".wpill").forEach(function(b) { b.classList.remove("active"); });
        this.classList.add("active");
        render(calculate());
      });
    });
  });
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function pct(n) { return Math.round(n) + "%"; }

  // Origin → typical round-trip airfare per person for each trip type
  // (Caribbean / domestic / Hawaii). Derived from Hopper 2026 Consumer
  // Travel Index ranges, conservative mid-point used.
  var ORIGIN_AIRFARE = {
    northeast: { domestic: 380, caribbean: 470, hawaii: 720, europe: 820 },
    southeast: { domestic: 340, caribbean: 380, hawaii: 760, europe: 880 },
    midwest:   { domestic: 360, caribbean: 520, hawaii: 740, europe: 850 },
    texas:     { domestic: 340, caribbean: 470, hawaii: 700, europe: 920 },
    west:      { domestic: 360, caribbean: 620, hawaii: 480, europe: 1050 },
    drive:     { domestic: 0,   caribbean: 0,   hawaii: 0,   europe: 0 }
  };

  // Drive cost estimate per person (fuel + wear + meals, ~800 mi avg)
  var DRIVE_COST_PER_PERSON = 220;

  function getOriginFares() {
    var key = $("origin").value; if (key === "drive") key = "driving"; return ORIGIN_AIRFARE[key] || ORIGIN_AIRFARE["atl"] || { domestic:340, caribbean:380, hawaii:760, europe:880, latam:540, asia:1280, oceania:1500, africa:1180, middleeast:1100 };
  }

  // ---- Trip estimators ----
  // Each returns { total, label, tier, perPersonPerDay, notes }
  // Driving substitutes airfare with $0 plus DRIVE_COST_PER_PERSON to ground level.

  function estDisney(opts) {
    var D = VM_DATA.DISNEY;
    // Tier order: value, moderate, deluxe
    var adults = opts.adults, kids = opts.kids, infants = opts.infants;
    var people = adults + kids + infants;            // headcount
    var ticketHeadcount = adults + kids;             // tickets only count age 3+
    var foodHeadcount = adults + (kids * 0.7);       // kids eat ~70% of adult food on park trips
    var nights = opts.nights;
    var fares = getOriginFares();
    var fare = opts.origin === "driving" || opts.origin === "drive" ? DRIVE_COST_PER_PERSON : fares.domestic;
    // Flights: adults + kids full price, infants lap-free
    var transport = fare * (adults + kids);

    function tierCost(resortKey, season) {
      var resort = D.resorts[resortKey];
      var nightly = resort[season];
      var lodging = nightly * nights;
      var ticketPerDay = D.tickets[season];
      var parkDays = Math.max(1, nights - 1);
      // Disney bands: adults 10+, kids 3-9 (~$5 cheaper), under 3 free
      var tickets = ticketPerDay * parkDays * adults + (ticketPerDay - D.childTicketDiscount) * parkDays * kids;
      var dining = D.dining.typical.perDay * (nights);
      var snacks = D.snacksPerPersonPerDay * foodHeadcount * nights;
      var ll = D.lightningLanePerDay * ticketHeadcount * parkDays;  // infants don't need LL
      var tips = D.tipsTotal;
      var souvenirs = D.souvenirsBudget;
      var memory = D.memoryMaker;
      return lodging + tickets + dining + snacks + ll + tips + souvenirs + memory + transport;
    }

    var tiers = [
      { key: "value",    seasonKey: "low", label: "Disney World &mdash; Value resort, off-season" },
      { key: "value",    seasonKey: "avg", label: "Disney World &mdash; Value resort, regular season" },
      { key: "moderate", seasonKey: "low", label: "Disney World &mdash; Moderate resort, off-season" },
      { key: "moderate", seasonKey: "avg", label: "Disney World &mdash; Moderate resort, regular season" },
      { key: "deluxe",   seasonKey: "low", label: "Disney World &mdash; Deluxe resort, off-season" },
      { key: "deluxe",   seasonKey: "avg", label: "Disney World &mdash; Deluxe resort, regular season" }
    ];
    return tiers.map(function(t){
      var total = tierCost(t.key, t.seasonKey);
      return {
        category: "Disney World",
        label: t.label,
        total: total,
        perPersonPerDay: total / people / nights,
        notes: "Includes flights, tickets, Lightning Lane, dining, parking, tips, Memory Maker, $200 souvenir budget."
      };
    });
  }

  function estCruise(opts) {
    var C = VM_DATA.CRUISE;
    var adults = opts.adults, kids = opts.kids, infants = opts.infants;
    var people = adults + kids + infants;
    var nights = opts.nights;
    var fares = getOriginFares();
    // Most cruisers fly to port (Miami/Tampa/PC). Use domestic fare.
    var fare = opts.origin === "driving" || opts.origin === "drive" ? 0 : fares.domestic;
    // Adults + kids count for flight; infants on lap free.
    var transport = (fare + 80) * (adults + kids);

    var lines = ["msc", "carnival", "royal", "ncl"];
    return lines.map(function(key){
      var line = C.lines[key];
      // Per-person fare scales with nights. Apply 3rd/4th-guest 50% discount logic:
      // first 2 guests at full, remaining at 50% (a reasonable default for budget calc).
      var perPerson = line.perPersonAvg * (nights / 7);
      var fareHeadcount = adults + kids;          // infants typically free on cruise fare
      var firstTwo = Math.min(2, fareHeadcount);
      var extras = Math.max(0, fareHeadcount - 2);
      var cruiseFareTotal = (perPerson * firstTwo) + (perPerson * 0.5 * extras);
      // Gratuities apply to adults + kids (NOT infants) — this is the trap people miss
      var gratuity = line.gratuityPerDay * nights * (adults + kids);
      var drinks = 75 * nights * adults;          // assume adult package only
      var sodaPkg = 12 * nights * kids;           // kids' soda pkg ~$12/day
      var excursions = 95 * (adults + kids) * 2;  // 2 excursions, infants skip
      var total = cruiseFareTotal + gratuity + drinks + sodaPkg + excursions + transport;
      return {
        category: "Cruise",
        label: line.label + " &mdash; " + nights + "-night Caribbean cruise",
        total: total,
        perPersonPerDay: people > 0 ? (total / people / nights) : 0,
        notes: line.note + ". 3rd/4th guests at half fare, gratuities for everyone 2+, adult drink package, two excursions."
      };
    });
  }

  function estAI(opts) {
    var DESTS = VM_DATA.AI_DESTINATIONS;
    var adults = opts.adults, kids = opts.kids, infants = opts.infants;
    var people = adults + kids + infants;
    var nights = opts.nights;
    var fares = getOriginFares();
    var fare = opts.origin === "driving" || opts.origin === "drive" ? 0 : fares.caribbean;
    var transport = fare * (adults + kids);   // infants lap-free on flights
    var KID_DISCOUNT = { budget: 0.50, mid: 0.45, luxury: 0.50, ultra: 0.40 };

    var picks = [];
    // Filter to common, well-known destinations
    var WANTED = ["cancun", "punta_cana", "jamaica", "cabo", "puerto_vallarta", "costa_rica"];
    DESTS.filter(function(d){ return WANTED.indexOf(d.id) >= 0; }).forEach(function(d){
      ["budget", "mid", "luxury"].forEach(function(tierKey){
        var rate = d[tierKey];
        if (!rate) return;
        // Adults full rate, kids at discount, infants free (most AI resorts)
        var lodging = (rate * adults * nights) + (rate * KID_DISCOUNT[tierKey] * kids * nights);
        var hidden = 95 * (adults + kids) + 60 * nights + 200; // excursions + tips + spa, infants skip
        var total = lodging + hidden + transport;
        var tierName = tierKey === "budget" ? "budget" : (tierKey === "mid" ? "mid-range" : "luxury");
        picks.push({
          category: "All-Inclusive",
          label: d.label + " &mdash; " + tierName + " resort",
          total: total,
          perPersonPerDay: people > 0 ? (total / people / nights) : 0,
          notes: "Includes flights, lodging at ~$" + Math.round(rate) + "/adult/night (kids ~" + Math.round(KID_DISCOUNT[tierKey] * 100) + "%, under 3 free), gratuities, two excursions, off-resort meal."
        });
      });
    });
    return picks;
  }

  function estRoadTrip(opts) {
    var R = VM_DATA.ROADTRIP;
    var adults = opts.adults, kids = opts.kids, infants = opts.infants;
    var people = adults + kids + infants;
    // Kids eat ~70% of adult food, do ~80% of activity cost; infants skip both
    var foodHeadcount = adults + (kids * 0.7);
    var activityHeadcount = adults + (kids * 0.8);
    var nights = opts.nights;

    // Three distance scenarios
    var distances = [
      { label: "Short road trip", miles: 400 },
      { label: "Medium road trip", miles: 800 },
      { label: "Long road trip", miles: 1300 }
    ];
    return distances.map(function(d){
      var rt = d.miles * 2;
      var fuel = (rt / 28) * R.avgGasPrice;
      var wear = rt * R.wearPerMile;
      var hotels = 145 * nights; // moderate hotel/airbnb baseline
      var food = 65 * foodHeadcount * nights;
      var activities = 70 * activityHeadcount * Math.max(1, nights - 1);
      var total = fuel + wear + hotels + food + activities;
      return {
        category: "Road Trip",
        label: d.label + " &mdash; ~" + d.miles + " miles each way",
        total: total,
        perPersonPerDay: people > 0 ? (total / people / nights) : 0,
        notes: "Gas at $" + R.avgGasPrice.toFixed(2) + "/gal, wear at $0.10/mi, mid-tier hotel/Airbnb, dining out 2 meals/day."
      };
    });
  }

  function estThemeParks(opts) {
    var adults = opts.adults, kids = opts.kids, infants = opts.infants;
    var people = adults + kids + infants;
    var ticketHeadcount = adults + kids;   // under 3 free at all major parks
    var foodHeadcount = adults + (kids * 0.7);
    var nights = opts.nights;
    var fares = getOriginFares();
    var fare = opts.origin === "driving" || opts.origin === "drive" ? DRIVE_COST_PER_PERSON : fares.domestic;
    var transport = fare * (adults + kids);
    var parkDays = Math.max(1, nights - 1);

    // Universal Orlando + Cedar Point + SeaWorld as common comparisons.
    // Kids' tickets at most parks ~$15/day less than adult.
    var picks = [
      { label: "Universal Orlando &mdash; on-property hotel",  adultTicket: 145, kidTicket: 130, hotelPerNight: 285 },
      { label: "Universal Orlando &mdash; off-property hotel", adultTicket: 145, kidTicket: 130, hotelPerNight: 165 },
      { label: "SeaWorld Orlando trip",                        adultTicket: 120, kidTicket: 110, hotelPerNight: 145 },
      { label: "Busch Gardens Tampa trip",                     adultTicket: 110, kidTicket:  95, hotelPerNight: 140 },
      { label: "Cedar Point &mdash; midweek getaway",          adultTicket: 100, kidTicket:  85, hotelPerNight: 175 }
    ];
    return picks.map(function(p){
      var lodging = p.hotelPerNight * nights;
      var tickets = (p.adultTicket * adults + p.kidTicket * kids) * parkDays;
      var food = 75 * foodHeadcount * nights;
      var addons = 40 * (adults + kids); // parking, snacks (infants skip)
      var total = lodging + tickets + food + addons + transport;
      return {
        category: "Theme Park",
        label: p.label,
        total: total,
        perPersonPerDay: people > 0 ? (total / people / nights) : 0,
        notes: "Includes flights/drive, tickets (kids' rate for ages 3-12, under 3 free), hotel, food, parking. Skip-line passes not included."
      };
    });
  }


  // ── City Trip Estimator ─────────────────────────────────
  function estCityTrip(opts) {
    var adults  = opts.adults, kids = opts.kids, infants = opts.infants;
    var people  = adults + kids + infants;
    var nights  = opts.nights;
    var fares   = getOriginFares();
    var fare    = opts.origin === "driving" || opts.origin === "drive" ? DRIVE_COST_PER_PERSON : fares.domestic;
    var transport = fare * (adults + kids);  // infants lap-free

    // food multiplier: kids ~70% of adult spend; infants ~0
    var foodHeadcount    = adults + (kids * 0.7);
    var activityHeadcount = adults + (kids * 0.8);

    // Each city: { label, hotel, food, activity, notes }
    // hotel = $/night mid-range, food = $/person/day, activity = $/person/day (attractions, transport)
    var cities = [
      {
        label: "New York City &mdash; mid-range",
        hotel: 290, food: 90, activity: 60,
        note: "Mid-range Manhattan hotel, subway + 1 Uber/day, 1-2 paid attractions (Top of Rock, Met, etc.), 2 meals out + 1 fast casual."
      },
      {
        label: "New York City &mdash; budget",
        hotel: 175, food: 65, activity: 40,
        note: "Outer borough or budget hotel, subway only, free attractions (Central Park, Staten Island Ferry, High Line)."
      },
      {
        label: "Las Vegas &mdash; mid-range",
        hotel: 180, food: 85, activity: 80,
        note: "Strip hotel mid-tier, resort fee included, 2 shows or experiences, dining mix of casual and one splurge."
      },
      {
        label: "Nashville &mdash; mid-range",
        hotel: 210, food: 75, activity: 55,
        note: "Downtown hotel, live music venues, honky-tonks, 1-2 paid attractions (Country Music Hall of Fame, etc.)."
      },
      {
        label: "New Orleans &mdash; mid-range",
        hotel: 200, food: 80, activity: 50,
        note: "French Quarter area hotel, live music, cocktails on Bourbon Street, 1-2 tours (cemetery, jazz, swamp)."
      },
      {
        label: "Miami &mdash; mid-range",
        hotel: 240, food: 85, activity: 55,
        note: "South Beach or Brickell hotel, beach days (free), Wynwood, nightlife, dining mix."
      },
      {
        label: "San Francisco &mdash; mid-range",
        hotel: 270, food: 85, activity: 55,
        note: "Union Square or SOMA hotel, cable car day pass, Alcatraz, Golden Gate, Fisherman's Wharf."
      },
      {
        label: "Chicago &mdash; mid-range",
        hotel: 220, food: 75, activity: 50,
        note: "Downtown hotel, architecture boat tour, Millennium Park, Navy Pier, deep dish pizza included."
      },
      {
        label: "Washington D.C. &mdash; mid-range",
        hotel: 230, food: 70, activity: 30,
        note: "Metro access hotel, Smithsonian museums free, monuments free, 1-2 paid tours or experiences."
      },
      {
        label: "Austin &mdash; mid-range",
        hotel: 195, food: 70, activity: 45,
        note: "Downtown hotel, 6th Street live music, Rainey Street, day trip options, BBQ budget included."
      },
      {
        label: "Savannah &mdash; mid-range",
        hotel: 185, food: 65, activity: 40,
        note: "Historic district hotel or B&B, walking squares, ghost tour, river street dining."
      },
      {
        label: "Seattle &mdash; mid-range",
        hotel: 230, food: 80, activity: 55,
        note: "Downtown hotel, Pike Place, Space Needle, ferry to Bainbridge Island, coffee culture."
      }
    ];

    // Style multiplier: budget = 0.75x, mid = 1.0x, lux = 1.45x
    var styleMultiplier = opts.style === "budget" ? 0.75 : (opts.style === "lux" ? 1.45 : 1.0);

    // Vibe filter: each city has a vibes array — only show if vibes match (or no vibes selected)
    var cityVibeMap = {
      "New York City &mdash; mid-range":     ["city","food","culture"],
      "New York City &mdash; budget":        ["city","budget"],
      "Las Vegas &mdash; mid-range":         ["city","nightlife","food","romantic"],
      "Nashville &mdash; mid-range":         ["city","food","music"],
      "New Orleans &mdash; mid-range":       ["city","food","music","culture"],
      "Miami &mdash; mid-range":             ["city","beach","romantic","food"],
      "San Francisco &mdash; mid-range":     ["city","food","culture","outdoors"],
      "Chicago &mdash; mid-range":           ["city","food","culture"],
      "Washington D.C. &mdash; mid-range":   ["city","culture","history","familyfriendly"],
      "Austin &mdash; mid-range":            ["city","food","music","outdoors"],
      "Savannah &mdash; mid-range":          ["city","romantic","culture","history"],
      "Seattle &mdash; mid-range":           ["city","food","outdoors","culture"]
    };

    return cities.map(function(c) {
      var cVibes = cityVibeMap[c.label] || ["city"];
      // If vibes selected, skip cities that don't match
      if (opts.vibes && opts.vibes.length > 0) {
        // Remove theme-park and cruise from consideration for city trips
        var tripVibes = opts.vibes.filter(function(v){ return v !== "theme-park" && v !== "cruise"; });
        if (tripVibes.length > 0) {
          var hasMatch = tripVibes.some(function(v){ return cVibes.indexOf(v) >= 0; });
          if (!hasMatch) return null;
        }
      }
      var hotelAdj   = c.hotel * styleMultiplier;
      var foodAdj    = c.food  * styleMultiplier;
      var actAdj     = c.activity * styleMultiplier;
      var lodging    = hotelAdj * nights;
      var food       = foodAdj  * foodHeadcount * nights;
      var activities = actAdj   * activityHeadcount * nights;
      var total      = lodging + food + activities + transport;
      return {
        category: "City Trip",
        label: c.label,
        total: total,
        perPersonPerDay: people > 0 ? (total / people / nights) : 0,
        notes: c.note + " Flights from your origin not included in per-night math — shown in total."
      };
    }).filter(function(t){ return t !== null; });
  }

  // -------- Run all estimators and rank against budget --------
  function compute() {
    var adults  = Math.max(1, parseInt(($("b-adults")  || {}).value, 10) || 2);
    var kids    = Math.max(0, parseInt(($("b-kids")    || {}).value, 10) || 0);
    var infants = Math.max(0, parseInt(($("b-infants") || {}).value, 10) || 0);
    // Read selected vibes
    var vibeEls = document.querySelectorAll('#b-vibes .b-vibe-pill.active');
    var selectedVibes = Array.prototype.map.call(vibeEls, function(el){ return el.getAttribute('data-vibe'); });

    // Read style
    var styleEl = $("b-style");
    var selectedStyle = styleEl ? styleEl.value : "mid";

    var opts = {
      budget: Math.max(500, parseFloat($("budget").value) || 6000),
      adults: adults,
      kids: kids,
      infants: infants,
      people: adults + kids + infants,  // legacy alias
      nights: Math.max(1, parseInt($("nights").value, 10) || 5),
      origin: $("origin").value,
      vibes: selectedVibes,
      style: selectedStyle
    };

    var allRaw = []
      .concat(estDisney(opts))
      .concat(estCruise(opts))
      .concat(estAI(opts))
      .concat(estRoadTrip(opts))
      .concat(estThemeParks(opts))
      .concat(estCityTrip(opts));

    // Vibe-based category filtering
    var all = allRaw;
    if (opts.vibes && opts.vibes.length > 0) {
      var v = opts.vibes;
      var wantsCruise   = v.indexOf("cruise")      >= 0;
      var wantsTheme    = v.indexOf("theme-park")  >= 0;
      var wantsBeach    = v.indexOf("beach")       >= 0;
      var wantsCity     = v.indexOf("city")        >= 0;
      var wantsOutdoors = v.indexOf("outdoors")    >= 0;
      var wantsFood     = v.indexOf("food")        >= 0;
      var wantsAdventure= v.indexOf("adventure")   >= 0;
      var wantsRomantic = v.indexOf("romantic")    >= 0;
      var wantsFamily   = v.indexOf("familyfriendly") >= 0;

      all = allRaw.filter(function(t) {
        var cat = t.category;
        // Always show if the category directly matches a selected vibe
        if (cat === "Cruise"      && wantsCruise)   return true;
        if (cat === "Theme Park"  && wantsTheme)    return true;
        if (cat === "Disney World"&& (wantsTheme || wantsFamily)) return true;
        if (cat === "City Trip")                    return true; // city trips filtered inside estCityTrip
        if (cat === "All-Inclusive" && (wantsBeach || wantsRomantic || wantsFood || wantsFamily || wantsAdventure)) return true;
        if (cat === "Road Trip"  && (wantsOutdoors || wantsAdventure || wantsFamily)) return true;

        // If ONLY cruise/theme-park selected, hide unrelated categories
        var onlyCruiseOrTheme = v.every(function(x){ return x === "cruise" || x === "theme-park"; });
        if (onlyCruiseOrTheme) {
          return (cat === "Cruise" && wantsCruise) || ((cat === "Theme Park" || cat === "Disney World") && wantsTheme);
        }

        // Otherwise show non-city trip types by default (they're always relevant)
        return cat !== "Theme Park" && cat !== "Disney World" && cat !== "Cruise";
      });
    }

    // Tag with affordability
    all.forEach(function(t){
      var pctOfBudget = (t.total / opts.budget) * 100;
      var headroom = opts.budget - t.total;
      t.headroom = headroom;
      t.pctOfBudget = pctOfBudget;
      if (headroom > 250) t.tag = "fits";
      else if (headroom > -800) t.tag = "stretch";
      else t.tag = "over";
    });

    return { opts: opts, all: all };
  }

  function badgeFor(tag) {
    if (tag === "fits")    return '<span class="rev-badge fits">Fits the budget</span>';
    if (tag === "stretch") return '<span class="rev-badge stretch">Stretch zone</span>';
    return '<span class="rev-badge over">Over budget</span>';
  }

  function render(r) {
    var opts = r.opts;
    // Sort fits: interleave categories so City Trip, Cruise, Disney, AI all appear early
    // First pass: group by category, sort each group by total desc
    var fitsRaw = r.all.filter(function(t){ return t.tag === "fits"; });
    var catOrder = ["City Trip", "Cruise", "Disney World", "All-Inclusive", "Road Trip", "Theme Park"];
    var grouped = {};
    fitsRaw.forEach(function(t){
      if (!grouped[t.category]) grouped[t.category] = [];
      grouped[t.category].push(t);
    });
    // Sort within each category: City Trip by perPersonPerDay asc (best value first), others by total desc
    Object.keys(grouped).forEach(function(cat){
      if (cat === "City Trip") {
        grouped[cat].sort(function(a,b){ return a.total - b.total; }); // cheapest city first
      } else {
        grouped[cat].sort(function(a,b){ return b.total - a.total; }); // most expensive (closest to budget) first
      }
    });
    // Interleave: take 1-2 from each category in catOrder, then fill remainder
    var fits = [];
    var maxRounds = 3;
    for (var round = 0; round < maxRounds; round++) {
      catOrder.forEach(function(cat){
        if (grouped[cat] && grouped[cat][round]) fits.push(grouped[cat][round]);
      });
      // Also add any categories not in catOrder
      Object.keys(grouped).forEach(function(cat){
        if (catOrder.indexOf(cat) === -1 && grouped[cat][round]) fits.push(grouped[cat][round]);
      });
    }
    // Append any remaining items not yet added
    fitsRaw.forEach(function(t){ if (fits.indexOf(t) === -1) fits.push(t); });
    var stretches = r.all.filter(function(t){ return t.tag === "stretch"; }).sort(function(a,b){ return a.total - b.total; });
    var over = r.all.filter(function(t){ return t.tag === "over"; }).sort(function(a,b){ return a.total - b.total; });

    var html = "";

    // Headline
    html += '<div class="rev-headline">';
    html += '<p class="rev-headline-amount">' + money(opts.budget) + '</p>';
    var partyParts = [];
    partyParts.push(opts.adults + ' ' + (opts.adults === 1 ? 'adult' : 'adults'));
    if (opts.kids > 0)    partyParts.push(opts.kids    + ' ' + (opts.kids === 1    ? 'kid'      : 'kids'));
    if (opts.infants > 0) partyParts.push(opts.infants + ' under 3');
    var partyDesc = partyParts.join(' + ');
    html += '<p class="rev-headline-sub">For ' + partyDesc + ' &middot; ' + opts.nights + ' nights &middot; ' + fits.length + ' trips fit, ' + stretches.length + ' stretch, ' + over.length + ' over.</p>';
    html += '</div>';

    function tripCard(t) {
      var pctText = t.tag === "over"
        ? "+" + money(-t.headroom) + " over"
        : money(t.headroom) + " headroom";
      return '<div class="rev-trip">'
        + '<div class="rev-trip-top">'
        +   '<div>'
        +     '<p class="rev-trip-cat">' + t.category + '</p>'
        +     '<p class="rev-trip-label">' + t.label + '</p>'
        +   '</div>'
        +   badgeFor(t.tag)
        + '</div>'
        + '<div class="rev-trip-totals">'
        +   '<span><strong>' + money(t.total) + '</strong> total</span>'
        +   '<span class="rev-ppd">' + money(t.perPersonPerDay) + '/person/day</span>'
        +   '<span class="rev-headroom ' + t.tag + '">' + pctText + '</span>'
        + '</div>'
        + '<p class="rev-trip-notes">' + t.notes + '</p>'
        + '</div>';
    }

    if (fits.length) {
      html += '<h3 class="results-h3">What fits the budget</h3>';
      html += '<div class="rev-list">' + fits.map(tripCard).join("") + '</div>';
    } else {
      html += '<div class="result-note"><strong>Nothing fits this budget at these dates and party size.</strong> The stretch zone below is closest &mdash; one or two trims (off-season dates, smaller resort, fewer nights) usually closes the gap.</div>';
    }

    if (stretches.length) {
      html += '<h3 class="results-h3">Stretch zone &mdash; close, but you&rsquo;ll need to trim</h3>';
      html += '<div class="rev-list">' + stretches.slice(0, 8).map(tripCard).join("") + '</div>';
    }

    if (over.length) {
      html += '<h3 class="results-h3">Out of reach at this budget</h3>';
      html += '<div class="rev-list">' + over.slice(0, 6).map(tripCard).join("") + '</div>';
    }

    html += '<div class="estimate-note"><strong>About these numbers.</strong> These are <em>estimates</em> built from the same 2026 pricing data the rest of the site uses. Airfare baselines come from Hopper 2026 Consumer Travel Index ranges by origin. Lodging, food, and ticket assumptions are conservative averages &mdash; your real bookings can move 20% in either direction. Use this to triangulate, not to lock in.</div>';

    html += '<div class="freshness-badge">2026 pricing data &middot; last updated July 2026 &middot; next refresh August 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("budget", typeof r !== "undefined" && r && r.total ? r.total : 0); }

    // Card CTA based on the cheapest fit
    var best = fits[0] || stretches[0] || over[0];
    if (best && window.VM_CardCTA) {
      VM_CardCTA.render({
        container: document.getElementById("card-cta"),
        tripTotal: best.total,
        context: "this trip",
        calcType: "budget"
      });
    }
  }

  $("calculate").addEventListener("click", function(e){
    e.preventDefault();
    render(compute());
    if (window.innerWidth < 900) {
      $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Live recompute on input change
  var liveInputs = ["budget", "b-adults", "b-kids", "b-infants", "nights", "origin", "b-style"];
  // Vibe pill toggle — re-run calc on each click if results already showing
  document.querySelectorAll('#b-vibes .b-vibe-pill').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      if (document.getElementById('results').classList.contains('has-results')) {
        render(compute());
      }
    });
  });

  liveInputs.forEach(function(id){
    var el = $(id);
    if (!el) return;
    var evt = (el.tagName === "SELECT") ? "change" : "input";
    el.addEventListener(evt, function(){ render(compute()); });
  });

  window.addEventListener("DOMContentLoaded", function(){
    if (window.VM_OriginPicker) {
      VM_OriginPicker.buildOriginDropdown($("origin"), "atl");
      VM_OriginPicker.wireZipAutoSelect(
        $("origin-zip"),
        $("origin"),
        $("origin-zip-status")
      );
    }
    render(compute());
  });
})();
