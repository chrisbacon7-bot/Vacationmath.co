/* =====================================================================
   Trip Finder — Where should we go?
   Given an origin, date range, party size, nights, budget, tier, and
   vibes, rank 50 destinations across the user's travel window by total
   trip cost. No live APIs — uses the curated 2026 pricing in
   trip-finder-data.js.
   ===================================================================== */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  var D = (window.VM_TRIPFINDER_DATA || {});
  var DESTS = D.DESTINATIONS || [];
  var VIBES = D.VIBES || [];
  var VIBE_LABELS = D.VIBE_LABELS || {};
  var WEATHER_LABELS = D.WEATHER_LABELS || {};
  var MONTH_NAMES = D.MONTH_NAMES || ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Origin airfare — pulled from shared calc-data.js via VM_DATA.ORIGIN_AIRFARE
  // Covers 65 US airports. See calc-data.js for full table.
  var ORIGIN_AIRFARE = (window.VM_DATA && window.VM_DATA.ORIGIN_AIRFARE) || {};

  function getOriginFares() {
    var o = $("tf-origin").value;
    return ORIGIN_AIRFARE[o] || ORIGIN_AIRFARE.atl;
  }

  function isDriving() {
    return $("tf-origin").value === "driving";
  }

  // ---- Driving mode: coordinates + fuel math ----
  // Approximate lat/lng for drivable destinations from continental US.
  // Hawaii + Alaska Cruise intentionally excluded.
  var DRIVE_COORDS = {
    // Original drivable domestic destinations
    nyc:                       { lat: 40.71, lng: -74.01 },
    nola:                      { lat: 29.95, lng: -90.07 },
    vegas:                     { lat: 36.17, lng: -115.14 },
    denver:                    { lat: 39.74, lng: -104.99 },
    san_diego:                 { lat: 32.72, lng: -117.16 },
    charleston:                { lat: 32.78, lng: -79.93 },
    savannah:                  { lat: 32.08, lng: -81.10 },
    asheville:                 { lat: 35.60, lng: -82.55 },
    yellowstone:               { lat: 44.43, lng: -110.59 },
    national_parks_southwest:  { lat: 37.30, lng: -112.95 },
    smoky_mountains:           { lat: 35.61, lng: -83.51 },
    miami:                     { lat: 25.76, lng: -80.19 },
    alaska_cruise:             { lat: 61.22, lng: -149.90 },
    // Batch 2 additions
    austin:                    { lat: 30.27, lng: -97.74 },
    nashville:                 { lat: 36.17, lng: -86.78 },
    chicago:                   { lat: 41.88, lng: -87.63 },
    portland_oregon:           { lat: 45.52, lng: -122.68 },
    scottsdale:                { lat: 33.49, lng: -111.93 },
    // Batch 3 additions
    san_francisco:             { lat: 37.77, lng: -122.42 },
    seattle:                   { lat: 47.61, lng: -122.33 },
    boston:                    { lat: 42.36, lng: -71.06 },
    washington_dc:             { lat: 38.91, lng: -77.04 },
    // Hawaii (fly only — excluded from driving results automatically)
    // Note: Hawaii IDs are in region "Hawaii" not "Domestic US"
    // The driving filter only shows destinations within ~1200mi
    // so Hawaii naturally won't show for most continental US origins
    oahu:                      { lat: 21.31, lng: -157.86 },
    maui:                      { lat: 20.80, lng: -156.33 },
    kauai:                     { lat: 22.09, lng: -159.53 },
    hawaii_big_island:         { lat: 19.74, lng: -155.84 }
  };

  // Approximate state population-weighted centers (best driving-origin proxies).
  var STATE_COORDS = {
    AL: { lat: 32.81, lng: -86.79 }, AZ: { lat: 33.73, lng: -111.43 },
    AR: { lat: 34.97, lng: -92.37 }, CA: { lat: 36.78, lng: -119.42 },
    CO: { lat: 39.06, lng: -105.31 }, CT: { lat: 41.60, lng: -72.70 },
    DE: { lat: 38.99, lng: -75.51 }, FL: { lat: 28.10, lng: -81.71 },
    GA: { lat: 33.04, lng: -83.64 }, ID: { lat: 44.24, lng: -114.48 },
    IL: { lat: 40.35, lng: -88.99 }, IN: { lat: 39.85, lng: -86.26 },
    IA: { lat: 42.01, lng: -93.21 }, KS: { lat: 38.53, lng: -96.73 },
    KY: { lat: 37.67, lng: -84.67 }, LA: { lat: 31.17, lng: -91.87 },
    ME: { lat: 44.69, lng: -69.38 }, MD: { lat: 39.06, lng: -76.80 },
    MA: { lat: 42.23, lng: -71.53 }, MI: { lat: 43.33, lng: -84.54 },
    MN: { lat: 45.69, lng: -93.90 }, MS: { lat: 32.74, lng: -89.68 },
    MO: { lat: 38.46, lng: -92.30 }, MT: { lat: 46.92, lng: -110.45 },
    NE: { lat: 41.13, lng: -98.27 }, NV: { lat: 38.31, lng: -117.06 },
    NH: { lat: 43.45, lng: -71.56 }, NJ: { lat: 40.30, lng: -74.52 },
    NM: { lat: 34.84, lng: -106.25 }, NY: { lat: 42.17, lng: -74.95 },
    NC: { lat: 35.63, lng: -79.81 }, ND: { lat: 47.53, lng: -99.78 },
    OH: { lat: 40.39, lng: -82.76 }, OK: { lat: 35.57, lng: -96.93 },
    OR: { lat: 44.57, lng: -122.07 }, PA: { lat: 40.59, lng: -77.21 },
    RI: { lat: 41.68, lng: -71.51 }, SC: { lat: 33.86, lng: -80.95 },
    SD: { lat: 44.30, lng: -99.44 }, TN: { lat: 35.75, lng: -86.69 },
    TX: { lat: 31.05, lng: -97.56 }, UT: { lat: 40.15, lng: -111.86 },
    VT: { lat: 44.04, lng: -72.71 }, VA: { lat: 37.77, lng: -78.17 },
    WA: { lat: 47.40, lng: -121.49 }, WV: { lat: 38.49, lng: -80.95 },
    WI: { lat: 44.27, lng: -89.62 }, WY: { lat: 42.76, lng: -107.30 },
    DC: { lat: 38.91, lng: -77.01 }
  };

  // Great-circle distance (haversine), in miles.
  function haversineMi(a, b) {
    if (!a || !b) return null;
    var R = 3958.8;  // earth radius in mi
    var toRad = function(d){ return d * Math.PI / 180; };
    var dLat = toRad(b.lat - a.lat);
    var dLng = toRad(b.lng - a.lng);
    var lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    var h = Math.sin(dLat/2)*Math.sin(dLat/2)
          + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)*Math.sin(dLng/2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Approximate driving miles ≈ great-circle × 1.3 (road routing detour factor).
  // driveMiles: accepts origin coords {lat,lng} or state code string (fallback)
  function driveMiles(originOrState, destId) {
    var s;
    if (originOrState && typeof originOrState === 'object') {
      s = originOrState; // already {lat,lng} from ZIP lookup
    } else {
      s = STATE_COORDS[originOrState]; // fallback to state center
    }
    var d = DRIVE_COORDS[destId];
    var gc = haversineMi(s, d);
    if (gc == null) return null;
    return Math.round(gc * 1.3);
  }

  // Round-trip fuel cost from miles, mpg, $/gal.
  function fuelCost(oneWayMiles, mpg, gas) {
    if (oneWayMiles == null) return 0;
    var roundTrip = oneWayMiles * 2;
    return (roundTrip / mpg) * gas;
  }

  // Returns {lat, lng, label} from ZIP input, or falls back to null.
  // Also updates the status indicator next to the input.
  function getOriginCoords() {
    var el = $("tf-driving-from");
    var statusEl = $("tf-zip-status");
    if (!el) return null;
    var raw = el.value.trim().replace(/\D/g, '');
    if (raw.length !== 5) {
      if (statusEl) statusEl.textContent = '';
      return null;
    }
    // ZIP_DATA is bundled as zip-data.js
    if (typeof ZIP_DATA !== 'undefined' && ZIP_DATA[raw]) {
      var coords = { lat: ZIP_DATA[raw][0], lng: ZIP_DATA[raw][1] };
      if (statusEl) statusEl.textContent = '✓ Found';
      return coords;
    }
    // ZIP not found in dataset
    if (statusEl) statusEl.textContent = 'ZIP not found';
    return null;
  }
  // Legacy alias for display label
  function getDrivingState() {
    var el = $("tf-driving-from");
    return el ? el.value : "";
  }

  // ---- ZIP input real-time validation ----
  function initZipInput() {
    var zipEl = $("tf-driving-from");
    if (!zipEl) return;
    zipEl.addEventListener("input", function() {
      var raw = this.value.replace(/\D/g, '').slice(0, 5);
      this.value = raw;
      var statusEl = $("tf-zip-status");
      if (raw.length === 5) {
        if (typeof ZIP_DATA !== 'undefined' && ZIP_DATA[raw]) {
          if (statusEl) statusEl.textContent = '✓';
          if (statusEl) statusEl.style.color = 'var(--honey, #c8882a)';
        } else {
          if (statusEl) statusEl.textContent = 'ZIP not found';
          if (statusEl) statusEl.style.color = '#c0392b';
        }
      } else {
        if (statusEl) statusEl.textContent = '';
      }
    });
  }

  // ---- Setup UI: months and vibes ----
  function initMonthSelects() {
    var startEl = $("tf-month-start");
    var endEl = $("tf-month-end");
    var now = new Date();
    // Default window: now → 6 months ahead
    var months = [];
    for (var i = 0; i < 18; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({ idx: d.getMonth(), year: d.getFullYear(), label: MONTH_NAMES[d.getMonth()] + " " + d.getFullYear(), value: d.getFullYear() + "-" + d.getMonth() });
    }
    months.forEach(function(m, i){
      var o1 = document.createElement("option");
      o1.value = m.value; o1.textContent = m.label;
      if (i === 0) o1.selected = true;
      startEl.appendChild(o1);
      var o2 = document.createElement("option");
      o2.value = m.value; o2.textContent = m.label;
      if (i === 5) o2.selected = true;
      endEl.appendChild(o2);
    });
  }

  function initVibes() {
    var c = $("tf-vibes");
    VIBES.forEach(function(v){
      var label = document.createElement("label");
      label.className = "tf-vibe";
      label.innerHTML = '<input type="checkbox" value="' + v + '" /> <span>' + (VIBE_LABELS[v] || v) + '</span>';
      c.appendChild(label);
    });
  }

  function getSelectedVibes() {
    var checked = $("tf-vibes").querySelectorAll('input[type="checkbox"]:checked');
    return Array.prototype.map.call(checked, function(el){ return el.value; });
  }

  function parseMonthVal(v) {
    var parts = v.split("-");
    return { year: parseInt(parts[0], 10), month: parseInt(parts[1], 10) };
  }

  function monthsInRange(start, end) {
    // Inclusive, in order. Cap at 12 months.
    var result = [];
    var y = start.year, m = start.month;
    var safety = 0;
    while (safety < 24) {
      result.push({ year: y, month: m });
      if (y === end.year && m === end.month) break;
      m++;
      if (m > 11) { m = 0; y++; }
      safety++;
      if (result.length >= 12) break;
    }
    return result;
  }

  // ---- Core scoring: compute total for one (dest, monthIdx) ----
  // opts has: tier, nights, adults, kids, infants. Optional: people (legacy).
  function computeTrip(dest, monthIdx, opts) {
    var monthData = dest.monthly[monthIdx];
    if (!monthData) return null;
    var hotelNightly = monthData.hotel[opts.tier];
    if (!hotelNightly || hotelNightly <= 0) return null;  // closed/unavailable
    var dailyGround = dest.dailyGround[opts.tier];

    // Resolve party size: prefer adults/kids/infants if present, else legacy people
    var adults  = (opts.adults  != null) ? opts.adults  : (opts.people || 2);
    var kids    = (opts.kids    != null) ? opts.kids    : 0;
    var infants = (opts.infants != null) ? opts.infants : 0;
    var headcount = adults + kids + infants;
    // Effective people for ground/food: adults full, kids ~60%, infants ~0
    var effectiveForGround = adults + (kids * 0.6) + (infants * 0);

    var transport = 0;
    var fare = 0;
    var driving = (opts.origin === "driving");
    var oneWayMiles = null;
    var roundTripMiles = null;

    if (driving) {
      // Only include destinations we have drive coords for. Caller should
      // also filter, but we double-check here.
      if (!DRIVE_COORDS[dest.id]) return null;
      oneWayMiles = driveMiles(opts.driveFromCoords || opts.driveFromState, dest.id);
      if (oneWayMiles == null) return null;
      roundTripMiles = oneWayMiles * 2;
      transport = fuelCost(oneWayMiles, opts.mpg, opts.gas);
      fare = 0;
    } else {
      var fares = getOriginFares();
      var fareBase = fares[dest.regionFlight] || fares.domestic;
      fare = Math.round(fareBase * (dest.flightSurcharge || 1));
      // Flights: adults + kids full price (airline tickets don't discount kids over 2),
      // infants on lap usually free domestic / ~10% international. Approximate as free.
      transport = fare * (adults + kids);
    }

    var lodging = hotelNightly * opts.nights;
    var ground = dailyGround * effectiveForGround * (opts.nights + 1); // +1 for travel day food

    var total = transport + lodging + ground;
    return {
      destId: dest.id,
      destName: dest.name,
      country: dest.country,
      region: dest.region,
      monthIdx: monthIdx,
      tier: opts.tier,
      total: total,
      transport: transport,
      lodging: lodging,
      ground: ground,
      fare: fare,
      driving: driving,
      oneWayMiles: oneWayMiles,
      roundTripMiles: roundTripMiles,
      hotelNightly: hotelNightly,
      dailyGround: dailyGround,
      headcount: headcount,
      adults: adults,
      kids: kids,
      infants: infants,
      perPersonPerDay: headcount > 0 ? (total / headcount / opts.nights) : 0,
      weather: monthData.weather,
      crowd: monthData.crowd,
      seasonTier: monthData.tier,
      vibes: dest.vibes,
      notes: dest.notes,
      visaUS: dest.visaUS
    };
  }

  function compute() {
    var startVal = $("tf-month-start").value;
    var endVal = $("tf-month-end").value;
    var start = parseMonthVal(startVal);
    var end = parseMonthVal(endVal);
    // If end is before start, swap
    if (end.year < start.year || (end.year === start.year && end.month < start.month)) {
      var t = start; start = end; end = t;
    }
    var months = monthsInRange(start, end);

    var adults  = Math.max(1, parseInt(($("tf-adults")  || {}).value, 10) || 2);
    var kids    = Math.max(0, parseInt(($("tf-kids")    || {}).value, 10) || 0);
    var infants = Math.max(0, parseInt(($("tf-infants") || {}).value, 10) || 0);
    var origin = $("tf-origin").value;
    var driving = (origin === "driving");
    var driveFromCoords = getOriginCoords();
    var driveFromState = getDrivingState(); // kept for display label
    var mpg = Math.max(8, parseFloat((($("tf-mpg") || {}).value)) || 25);
    var gas = Math.max(2, parseFloat((($("tf-gas") || {}).value)) || 3.50);

    var opts = {
      origin: origin,
      driving: driving,
      driveFromState: driveFromState,
      driveFromCoords: driveFromCoords,
      mpg: mpg,
      gas: gas,
      adults:  adults,
      kids:    kids,
      infants: infants,
      people:  adults + kids + infants,  // legacy alias
      nights: Math.max(2, parseInt($("tf-nights").value, 10) || 7),
      budget: Math.max(500, parseFloat($("tf-budget").value) || 5000),
      tier: $("tf-tier").value,
      vibes: getSelectedVibes(),
      months: months
    };

    // If driving but no state selected, we can't compute fuel — short-circuit.
    if (driving && !driveFromCoords) {
      return { opts: opts, trips: [], needsDriveState: true };
    }

    var trips = [];
    DESTS.forEach(function(dest){
      // Driving mode: only consider drivable US destinations.
      if (driving && !DRIVE_COORDS[dest.id]) return;

      // Vibe filter: if user picked vibes, dest must have at least one match
      if (opts.vibes.length > 0) {
        var hit = opts.vibes.some(function(v){ return dest.vibes.indexOf(v) >= 0; });
        if (!hit) return;
      }
      months.forEach(function(m){
        var trip = computeTrip(dest, m.month, opts);
        if (!trip) return;
        trip.calendarYear = m.year;
        trip.calendarMonth = m.month;
        var headroom = opts.budget - trip.total;
        trip.headroom = headroom;
        if (headroom > 250) trip.tag = "fits";
        else if (headroom > -800) trip.tag = "stretch";
        else trip.tag = "over";
        trips.push(trip);
      });
    });

    return { opts: opts, trips: trips };
  }

  // ---- Render ----
  function badgeFor(tag) {
    if (tag === "fits")    return '<span class="tf-badge fits">Fits the budget</span>';
    if (tag === "stretch") return '<span class="tf-badge stretch">Stretch zone</span>';
    return '<span class="tf-badge over">Over budget</span>';
  }

  function seasonBadge(tier) {
    if (tier === "low") return '<span class="tf-season low">Low season</span>';
    if (tier === "peak") return '<span class="tf-season peak">Peak season</span>';
    return '<span class="tf-season mid">Shoulder season</span>';
  }

  function weatherChip(w) {
    var label = WEATHER_LABELS[w] || w;
    return '<span class="tf-weather tf-w-' + w + '">' + label + '</span>';
  }

  function crowdChip(c) {
    var emoji = c === "high" ? "Busy" : (c === "medium" ? "Moderate" : "Quiet");
    return '<span class="tf-crowd tf-c-' + c + '">' + emoji + '</span>';
  }

  function vibeChips(vibes) {
    if (!vibes || vibes.length === 0) return "";
    return vibes.slice(0, 4).map(function(v){
      return '<span class="tf-vibe-chip">' + (VIBE_LABELS[v] || v) + '</span>';
    }).join("");
  }

  function tripCard(t) {
    var monthLabel = MONTH_NAMES[t.calendarMonth] + " " + t.calendarYear;
    var headroomText = t.tag === "over"
      ? "+" + money(-t.headroom) + " over"
      : money(t.headroom) + " headroom";

    return '<div class="tf-trip">'
      + '<div class="tf-trip-top">'
      +   '<div class="tf-trip-headline">'
      +     '<p class="tf-trip-when">' + monthLabel + '</p>'
      +     '<h4 class="tf-trip-dest">' + t.destName + ', ' + t.country + '</h4>'
      +     '<div class="tf-trip-meta">'
      +       seasonBadge(t.seasonTier)
      +       weatherChip(t.weather)
      +       crowdChip(t.crowd)
      +     '</div>'
      +   '</div>'
      +   badgeFor(t.tag)
      + '</div>'
      + '<div class="tf-trip-totals">'
      +   '<span><strong>' + money(t.total) + '</strong> total</span>'
      +   '<span class="tf-ppd">' + money(t.perPersonPerDay) + '/person/day</span>'
      +   '<span class="tf-headroom ' + t.tag + '">' + headroomText + '</span>'
      + '</div>'
      + '<div class="tf-trip-breakdown">'
      +   (t.driving
          ? '<span><strong>' + money(t.transport) + '</strong> fuel (~' + Math.round(t.roundTripMiles).toLocaleString("en-US") + ' mi round-trip)</span>'
          : '<span><strong>' + money(t.transport) + '</strong> flights</span>')
      +   '<span><strong>' + money(t.lodging) + '</strong> lodging (' + money(t.hotelNightly) + '/night)</span>'
      +   '<span><strong>' + money(t.ground) + '</strong> ground (~' + money(t.dailyGround) + '/person/day)</span>'
      + '</div>'
      + '<div class="tf-trip-tags">' + vibeChips(t.vibes) + '</div>'
      + (t.notes ? '<p class="tf-trip-notes">' + t.notes + (t.visaUS === "required" ? ' &middot; <strong>US passport: visa required.</strong>' : (t.visaUS === "evisa" ? ' &middot; eVisa or visa-on-arrival.' : '')) + '</p>' : '')
      + '</div>';
  }

  // ---- Concrete affordability suggestions ----
  // Given the cheapest over-budget trip, compute what tweaks WOULD bring it
  // under budget. Returns an array of short HTML strings.
  function buildSuggestions(opts, cheapest) {
    var tips = [];
    if (!cheapest) return tips;

    var gap = cheapest.total - opts.budget;  // how much over

    // 1) Shorter trip: removing a night saves lodging + ~1 day ground.
    var perNightSave = cheapest.hotelNightly
      + (cheapest.dailyGround * (cheapest.adults + cheapest.kids * 0.6));
    if (perNightSave > 0 && opts.nights > 3) {
      var nightsNeeded = Math.ceil(gap / perNightSave);
      var maxTrim = Math.min(nightsNeeded, opts.nights - 3);
      if (maxTrim >= 1) {
        tips.push('<li><strong>Cut ' + maxTrim + ' night' + (maxTrim>1?'s':'') + '</strong> &mdash; saves about ' + money(perNightSave * maxTrim) + '. New trip: ' + (opts.nights - maxTrim) + ' nights.</li>');
      }
    }

    // 2) Drop tier: lux → mid, mid → budget. Estimate using current lodging.
    if (opts.tier === "lux") {
      tips.push('<li><strong>Step down to Mid-range style</strong> &mdash; 3-4 star hotels and mixed dining typically cuts lodging + ground by 30-40%.</li>');
    } else if (opts.tier === "mid") {
      tips.push('<li><strong>Step down to Budget style</strong> &mdash; hostels / 2-star / street food typically cuts lodging + ground by 35-45%.</li>');
    }

    // 3) Off-season: find same dest in a cheaper month within our results.
    //    (Handled below in render where we have all trips for the dest.)

    // 4) Budget adjustment: tell them what budget would actually fit this trip.
    var roundedTarget = Math.ceil(cheapest.total / 100) * 100;
    tips.push('<li><strong>Raise your budget to ' + money(roundedTarget) + '</strong> &mdash; that&rsquo;s what the cheapest option above actually costs all-in.</li>');

    // 5) Smaller party (only when relevant).
    if (opts.adults + opts.kids >= 4) {
      tips.push('<li><strong>Smaller party</strong> &mdash; flights and ground scale per person, lodging often doesn&rsquo;t. A party of 2 typically lands 30-50% cheaper than 4.</li>');
    }

    return tips;
  }

  // Find a cheaper month for the same destination, if one exists in our results.
  function findCheaperMonth(allTrips, destId, currentTrip) {
    var sameDestCheaper = allTrips
      .filter(function(t){ return t.destId === destId && t.total < currentTrip.total; })
      .sort(function(a,b){ return a.total - b.total; });
    return sameDestCheaper[0] || null;
  }

  function render(r) {
    var opts = r.opts;
    var trips = r.trips;

    // Special-case: driving picked but no state.
    if (r.needsDriveState) {
      $("tf-results").innerHTML = '<div class="result-note">'
        + '<strong>Enter your ZIP code</strong> to see drivable trips. We&rsquo;ll estimate round-trip mileage and fuel cost to each destination, then rank by total trip cost.'
        + '</div>';
      return;
    }

    if (trips.length === 0) {
      var emptyMsg;
      if (opts.driving) {
        emptyMsg = '<div class="result-note"><strong>No drivable destinations available.</strong> Driving mode covers 12 US destinations within driving range of the continental US (NYC, New Orleans, Vegas, Denver, San Diego, Charleston, Savannah, Asheville, Yellowstone, Utah Mighty 5, Smoky Mountains, Miami). Try adjusting your vibes filter, or pick an airport origin for a wider set.</div>';
      } else {
        emptyMsg = '<div class="result-note"><strong>No destinations matched.</strong> Try a wider month range, fewer vibe filters, or a different style tier.</div>';
      }
      $("tf-results").innerHTML = emptyMsg;
      return;
    }

    // Group and sort
    var fits = trips.filter(function(t){ return t.tag === "fits"; }).sort(function(a,b){ return a.total - b.total; });
    var stretches = trips.filter(function(t){ return t.tag === "stretch"; }).sort(function(a,b){ return a.total - b.total; });
    var over = trips.filter(function(t){ return t.tag === "over"; }).sort(function(a,b){ return a.total - b.total; });

    // Within fits, prefer best value (cheapest first) but de-duplicate by destination
    // so we don't show the same destination across 6 months. Keep the cheapest month per dest.
    function dedupe(list, maxPerDest) {
      maxPerDest = maxPerDest || 1;
      var counts = {};
      var out = [];
      list.forEach(function(t){
        counts[t.destId] = counts[t.destId] || 0;
        if (counts[t.destId] < maxPerDest) {
          out.push(t);
          counts[t.destId]++;
        }
      });
      return out;
    }

    var fitsBest = dedupe(fits, 1);
    var stretchBest = dedupe(stretches, 1);
    var overBest = dedupe(over, 1);

    var html = "";
    html += '<div class="tf-headline">';
    html += '<p class="tf-headline-num">' + fitsBest.length + ' destinations fit</p>';
    // Party description: "2 adults + 2 kids + 1 under 3" condensed where possible
    var partyParts = [];
    partyParts.push(opts.adults + ' ' + (opts.adults === 1 ? 'adult' : 'adults'));
    if (opts.kids > 0)    partyParts.push(opts.kids    + ' ' + (opts.kids === 1    ? 'kid'      : 'kids'));
    if (opts.infants > 0) partyParts.push(opts.infants + ' under 3');
    var partyDesc = partyParts.join(' + ');
    var drivingPrefix = opts.driving ? ('Driving from ZIP ' + opts.driveFromState + ' &middot; ') : '';
    html += '<p class="tf-headline-sub">' + drivingPrefix + 'From ' + money(opts.budget) + ' for ' + partyDesc + ' &middot; ' + opts.nights + ' nights &middot; ' + opts.months.length + ' months checked &middot; ' + (opts.vibes.length === 0 ? "all vibes" : opts.vibes.map(function(v){ return VIBE_LABELS[v] || v; }).join(" / ")) + '</p>';
    html += '</div>';

    if (fitsBest.length) {
      html += '<h3 class="results-h3">Best value &mdash; fits your budget</h3>';
      html += '<p class="tf-section-sub">Cheapest month shown for each destination. Same destination may also fit in other months in your window.</p>';
      html += '<div class="tf-list">' + fitsBest.slice(0, 15).map(tripCard).join("") + '</div>';
    } else {
      // Zero fits. Build the affordability block.
      var cheapest = stretchBest[0] || overBest[0];
      var overByLabel = cheapest ? ('about ' + money(cheapest.total - opts.budget) + ' over your ' + money(opts.budget) + ' budget') : '';
      html += '<div class="result-note" style="border-left:4px solid #d97706;">'
        + '<strong>Nothing fits at ' + money(opts.budget) + ' for ' + opts.nights + ' nights &mdash; but you have options.</strong> '
        + 'The cheapest available trip is ' + (cheapest ? '<strong>' + cheapest.destName + '</strong> in ' + MONTH_NAMES[cheapest.calendarMonth] + ' at ' + money(cheapest.total) + ' (' + overByLabel + ').' : '')
        + '</div>';

      // Concrete suggestions list
      var tips = buildSuggestions(opts, cheapest);

      // Cheaper-month suggestion
      if (cheapest) {
        var cheaperMonth = findCheaperMonth(trips, cheapest.destId, cheapest);
        if (cheaperMonth && (cheapest.total - cheaperMonth.total) > 200) {
          tips.unshift('<li><strong>Shift ' + cheapest.destName + ' to ' + MONTH_NAMES[cheaperMonth.calendarMonth] + '</strong> &mdash; same destination drops to ' + money(cheaperMonth.total) + ' (saves ' + money(cheapest.total - cheaperMonth.total) + ').</li>');
        }
      }

      if (tips.length) {
        html += '<h3 class="results-h3">Ways to make it fit</h3>';
        html += '<ul class="tf-suggestions">' + tips.join("") + '</ul>';
      }
    }

    if (stretchBest.length) {
      html += '<h3 class="results-h3">Stretch zone &mdash; close, but trim something</h3>';
      html += '<div class="tf-list">' + stretchBest.slice(0, 10).map(tripCard).join("") + '</div>';
    }

    // When there are zero fits, always show over-budget cards so the user has
    // concrete trips to react to (matching their request: "give people multiple options").
    if (overBest.length && (fitsBest.length < 5)) {
      var overTitle = fitsBest.length === 0 ? 'Closest options (over budget)' : 'Out of reach at this budget';
      html += '<h3 class="results-h3">' + overTitle + '</h3>';
      var overLimit = (fitsBest.length === 0 && stretchBest.length < 3) ? 8 : 6;
      html += '<div class="tf-list">' + overBest.slice(0, overLimit).map(tripCard).join("") + '</div>';
    }

    var aboutNote;
    if (opts.driving) {
      aboutNote = '<div class="estimate-note"><strong>About these numbers.</strong> Driving distance is estimated from your state center to each destination (great-circle &times; 1.3 for road routing). Fuel cost uses your MPG and gas-price inputs. Hotel and ground costs are 2026 averages from Booking.com market rates. These are <em>estimates</em> &mdash; real bookings and real routes can move 20% in either direction.</div>';
    } else {
      aboutNote = '<div class="estimate-note"><strong>About these numbers.</strong> Airfare baselines come from Hopper 2026 Consumer Travel Index by origin region. Hotel and ground costs are mid-month averages from Booking.com market rates, synthesized for 2026. These are <em>estimates</em>, not live quotes &mdash; real bookings can move 20% in either direction. Use this to triangulate where to look, then check Google Flights and Booking.com for the actual fares.</div>';
    }
    html += aboutNote;

    html += '<div class="freshness-badge">2026 pricing data &middot; ' + (opts.driving ? '12 drivable US destinations' : '100 destinations') + ' &middot; last refreshed July 2026</div>';

    $("tf-results").innerHTML = html;
    $("tf-results").classList.add("has-results");

    // Card CTA: feature the cheapest fit
    var best = fitsBest[0] || stretchBest[0] || overBest[0];
    if (best && window.VM_CardCTA) {
      VM_CardCTA.render({
        container: document.getElementById("card-cta"),
        tripTotal: best.total,
        context: "this destination",
        calcType: "tripfinder"
      });
    }
  }

  // Show/hide the driving-from field based on origin selection.
  function syncDrivingFieldVisibility() {
    var field = $("tf-driving-from-field");
    if (!field) return;
    if (isDriving()) {
      field.hidden = false;
    } else {
      field.hidden = true;
    }
  }

  // ---- Wire up ----
  window.addEventListener("DOMContentLoaded", function(){
    // Build the 65-airport origin dropdown from shared data
    if (window.VM_OriginPicker) {
      VM_OriginPicker.buildOriginDropdown($('tf-origin'), 'atl');
      // Wire the "any origin" ZIP input to auto-select nearest airport
      VM_OriginPicker.wireZipAutoSelect(
        $('tf-zip-any'),
        $('tf-origin'),
        $('tf-zip-status')
      );
    }
    initMonthSelects();
    initZipInput();
    initVibes();
    syncDrivingFieldVisibility();

    $("tf-calculate").addEventListener("click", function(e){
      e.preventDefault();
      syncDrivingFieldVisibility();
      render(compute());
      if (window.innerWidth < 900) {
        $("tf-results").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // Origin change: show/hide driving-from field, then recompute.
    $("tf-origin").addEventListener("change", function(){
      syncDrivingFieldVisibility();
      render(compute());
    });

    // Live recompute
    var liveInputs = ["tf-month-start", "tf-month-end", "tf-adults", "tf-kids", "tf-infants", "tf-nights", "tf-budget", "tf-tier", "tf-driving-from", "tf-mpg", "tf-gas"];
    liveInputs.forEach(function(id){
      var el = $(id);
      if (!el) return;
      var evt = (el.tagName === "SELECT") ? "change" : "input";
      el.addEventListener(evt, function(){ render(compute()); });
    });
    // Vibe checkboxes
    $("tf-vibes").addEventListener("change", function(){ render(compute()); });

    // Initial render
    render(compute());
  });
})();
