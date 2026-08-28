/* =====================================================================
   Theme Park Comparison — any two parks side-by-side
   Reads from VM_DATA.THEMEPARKS_EXPANDED via VM_Pickers.fillThemeParks
   ===================================================================== */
(function () {
  "use strict";
  var TP = VM_DATA.THEMEPARKS_EXPANDED;

  // Park-specific add-on assumptions (2026 verified averages)
  // childMultiplier: child ticket as fraction of adult (3-9 yrs)
  // llPerDay: per-person per-day skip-the-line price
  // Anything not listed uses the fallback below.
  var PARK_RULES = {
    disney_wdw:        { childMultiplier:0.93, llPerDay:25 }, // Lightning Lane Multi Pass ~$25-32/day
    disneyland:        { childMultiplier:0.94, llPerDay:30 },
    universal_orlando: { childMultiplier:0.95, llPerDay:90 }, // Express Pass ~$80-130/day
    universal_hollywood:{childMultiplier:0.94, llPerDay:90 },
    seaworld_orlando:  { childMultiplier:1.00, llPerDay:35 }, // Quick Queue
    busch_gardens_tampa:{childMultiplier:1.00, llPerDay:30 },
    busch_gardens_williamsburg:{childMultiplier:1.00, llPerDay:30 },
    six_flags_magic_mountain:{childMultiplier:1.00, llPerDay:60 }, // The Flash Pass
    six_flags_great_adventure:{childMultiplier:1.00, llPerDay:60 },
    cedar_point:       { childMultiplier:0.85, llPerDay:75 }, // Fast Lane Plus
    kings_island:      { childMultiplier:0.85, llPerDay:65 },
    hersheypark:       { childMultiplier:0.80, llPerDay:50 },
    dollywood:         { childMultiplier:0.85, llPerDay:30 }, // TimeSaver
    knotts_berry_farm: { childMultiplier:0.80, llPerDay:55 },
    legoland_florida:  { childMultiplier:0.90, llPerDay:50 }, // Reserve N' Ride
    legoland_california:{childMultiplier:0.90, llPerDay:50 },
    great_wolf_lodge:  { childMultiplier:0.00, llPerDay:0 },  // Admission included with room, no LL
    silver_dollar_city:{ childMultiplier:0.80, llPerDay:0 }   // No skip-line product
  };
  // Defaults if a park isn't in the table
  var DEFAULT_RULES = { childMultiplier:0.90, llPerDay:40 };

  // Fixed add-on costs (per trip unless noted)
  var SOUVENIR_PER_PERSON = 40;
  var PHOTO_PACKAGE = 199;
  var AIRPORT_TRANSFER_RT = 120;

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  function rules(parkId) { return PARK_RULES[parkId] || DEFAULT_RULES; }

  function costForPark(parkId, opts) {
    var park = TP[parkId];
    var r = rules(parkId);
    // Infants under 3 are free on tickets, skip-line, souvenirs, and food.
    var billable = opts.adults + opts.children;
    var people = opts.adults + opts.children + (opts.infants || 0);

    // Hotel
    var hotelRate;
    var hotelSource;
    if (opts.hotelTier === "custom") {
      hotelRate = opts.customHotelRate;
      hotelSource = "your custom rate";
    } else if (opts.hotelTier === "onsite" && park.hotelOnPropAvg > 0) {
      hotelRate = park.hotelOnPropAvg;
      hotelSource = "on-property";
    } else if (opts.hotelTier === "onsite") {
      // Park has no on-property option — silently fall back
      hotelRate = park.offsiteHotelAvg > 0 ? park.offsiteHotelAvg : park.hotelOnPropAvg;
      hotelSource = "offsite (no on-property at this park)";
    } else {
      hotelRate = park.offsiteHotelAvg > 0 ? park.offsiteHotelAvg : park.hotelOnPropAvg;
      hotelSource = "offsite";
    }
    var hotel = hotelRate * opts.nights;

    // Tickets — Great Wolf is included with room, so ticketAdultPerDay is 0
    var ticketsAdult = park.ticketAdultPerDay * opts.adults * opts.parkDays;
    var ticketsChild = park.ticketAdultPerDay * r.childMultiplier * opts.children * opts.parkDays;
    var tickets = ticketsAdult + ticketsChild;

    // Food (per person per day, all nights) — infants free
    var food = park.mealPerPersonPerDay * billable * opts.nights;

    // LL/Express/Quick Queue — infants free
    var ll = opts.llPass ? r.llPerDay * billable * opts.parkDays : 0;

    // Parking — only if staying offsite (onsite usually free/included)
    var parking = 0;
    var stayingOnsite = opts.hotelTier === "onsite" && park.hotelOnPropAvg > 0;
    if (!stayingOnsite) {
      parking = park.parkingPerDay * opts.parkDays;
    }

    // One-off add-ons
    var transfer = opts.transfers ? AIRPORT_TRANSFER_RT : 0;
    var souvenirs = opts.souvenirs ? SOUVENIR_PER_PERSON * billable : 0;
    var photos = opts.photos ? PHOTO_PACKAGE : 0;

    var total = hotel + tickets + food + ll + parking + transfer + souvenirs + photos + (opts.gettingThere || 0);
    return {
      id: parkId, label: park.label, location: park.location,
      total: total, hotel: hotel, tickets: tickets,
      food: food, ll: ll, parking: parking, transfer: transfer,
      souvenirs: souvenirs, photos: photos,
      gettingThere: opts.gettingThere || 0,
      hotelRate: hotelRate, hotelSource: hotelSource,
      hasOnsite: park.hotelOnPropAvg > 0
    };
  }

  function calculate() {
    var gt = (window.VM_GettingThere && window.VM_GettingThere.compute) ? window.VM_GettingThere.compute() : { mode: "none", amount: 0, label: "" };
    var opts = {
      parkA: $("park-a").value,
      parkB: $("park-b").value,
      adults: Math.max(1, parseInt($("adults").value, 10) || 2),
      children: Math.max(0, parseInt($("children").value, 10) || 0),
      infants: Math.max(0, parseInt((($("infants") || {}).value), 10) || 0),
      nights: Math.max(1, parseInt($("nights").value, 10) || 5),
      parkDays: Math.max(1, parseInt($("park-days").value, 10) || 4),
      hotelTier: $("hotel-tier").value,
      customHotelRate: Math.max(50, parseFloat($("customHotelRate").value) || 185),
      llPass: $("ll-pass").checked,
      souvenirs: $("souvenirs").checked,
      photos: $("photos").checked,
      transfers: $("transfers").checked,
      gettingThere: gt.amount
    };
    var a = costForPark(opts.parkA, opts);
    var b = costForPark(opts.parkB, opts);
    var cheapest = a.total <= b.total ? a : b;
    var priciest = a.total > b.total ? a : b;
    return { opts: opts, a: a, b: b, cheapest: cheapest, priciest: priciest, gt: gt };
  }

  function cardHtml(r, isCheapest, people, nights) {
    var cls = isCheapest ? "cheapest" : "";
    var ppd = (people > 0 && nights > 0) ? Math.round(r.total / people / nights) : 0;
    var html = '<div class="tp-card ' + cls + '">';
    html += '  <p class="tp-name">' + r.label + '</p>';
    html += '  <p class="tp-location" style="color:var(--ink-muted);font-size:.85rem;margin:.2rem 0 .5rem">' + r.location + '</p>';
    html += '  <p class="tp-total">' + money(r.total) + '</p>';
    if (ppd > 0) html += '  <p class="tp-per-person" style="color:var(--ink-muted);font-size:.85rem;margin:-.3rem 0 .5rem">' + money(ppd) + ' per person per day</p>';
    html += '  <div class="cc-line"><span>Hotel (' + r.hotelSource + ')</span><span>' + money(r.hotel) + '</span></div>';
    html += '  <div class="cc-line"><span>Tickets</span><span>' + money(r.tickets) + '</span></div>';
    if (r.food > 0) html += '  <div class="cc-line"><span>Food</span><span>' + money(r.food) + '</span></div>';
    if (r.ll > 0) html += '  <div class="cc-line"><span>Skip-line</span><span>' + money(r.ll) + '</span></div>';
    if (r.parking > 0) html += '  <div class="cc-line"><span>Parking</span><span>' + money(r.parking) + '</span></div>';
    if (r.transfer > 0) html += '  <div class="cc-line"><span>Local transfers</span><span>' + money(r.transfer) + '</span></div>';
    if (r.gettingThere > 0) html += '  <div class="cc-line"><span>Getting there</span><span>' + money(r.gettingThere) + '</span></div>';
    if (r.souvenirs > 0) html += '  <div class="cc-line"><span>Souvenirs</span><span>' + money(r.souvenirs) + '</span></div>';
    if (r.photos > 0) html += '  <div class="cc-line"><span>Photos</span><span>' + money(r.photos) + '</span></div>';
    html += '</div>';
    return html;
  }

  function render(res) {
    if (res.opts.parkA === res.opts.parkB) {
      $("results").innerHTML = '<div class="result-note"><strong>Pick two different parks to compare.</strong></div>';
      $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("themeparks", typeof r !== "undefined" && r && r.total ? r.total : 0); }
      return;
    }
    var html = "";
    if (res.gt && res.gt.amount > 0) {
      html += '<div class="result-note" style="margin-top:0"><strong>Getting there: ' + money(res.gt.amount) + '</strong> &mdash; ' + res.gt.label + '. Added to both park totals.';
      if (res.gt.mode === "fly" && window.VM_GettingThere) {
        var note = window.VM_GettingThere.flightCoverageNote(res.gt.amount);
        if (note) html += note;
      }
      html += '</div>';
    }
    var people = res.opts.adults + res.opts.children + (res.opts.infants || 0);
    if (res.opts.infants > 0) {
      html += '<div class="benchmark-callout">' + res.opts.infants + ' under 3 enter free at most parks &mdash; no ticket, no skip-line, no food charge in the totals below.</div>';
    }
    html += '<div class="tp-grid">';
    html += cardHtml(res.a, res.a === res.cheapest, people, res.opts.nights);
    html += cardHtml(res.b, res.b === res.cheapest, people, res.opts.nights);
    html += '</div>';

    var spread = res.priciest.total - res.cheapest.total;
    var pct = res.priciest.total > 0 ? Math.round((spread / res.priciest.total) * 100) : 0;
    html += '<div class="verdict good"><h3>' + res.cheapest.label + ' is ' + money(spread) + ' (' + pct + '%) cheaper than ' + res.priciest.label + '.</h3>';
    html += '<p>Same family, same nights, same park days. What moves the totals the most: ticket pricing (Disney and Universal sit at the top, regional parks at half), hotel tier (on-property at the big two runs higher but bundles perks), and skip-the-line costs (Universal Express runs 3-4x Disney Lightning Lane on a peak day).</p></div>';

    html += '<div class="result-note"><strong>What people forget to add.</strong> Single-day sticker prices mislead. Regional parks look half-price until you add parking on every visit, no early entry, no in-park transportation, and a separate hotel commute. Disney and Universal multi-day pricing flattens out fast — by day 4, the per-day cost drops below most regional sticker prices once you factor in skip-line value.</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> These are <em>estimates</em>, not live quotes. Park ticket prices are pulled from each park&rsquo;s 2026 published pricing; hotel ranges come from Booking.com / Hopper / Touring Plans research; skip-line costs use peak-day averages. Your real total will move with date, hotel tier, dynamic ticket pricing, and promotions. The honest expectation: actual totals come in at or below these numbers more often than above them.</div>';
    html += '<div class="freshness-badge">2026 pricing data &middot; last updated September 2026 &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: res.cheapest.total,
      context: "your park trip",
      calcType: "themeparks"
    });

    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "themeparks",
      selection: { parkId: res.cheapest.id }
    });
  }

  function parkOnsiteNote(parkId, noteEl) {
    var p = TP[parkId];
    if (!p || !noteEl) return;
    if (p.hotelOnPropAvg > 0) {
      noteEl.textContent = "On-property hotels available (~$" + p.hotelOnPropAvg + "/night avg).";
    } else {
      noteEl.textContent = "No on-property hotels at this park — we'll use offsite (~$" + (p.offsiteHotelAvg || 150) + "/night).";
    }
  }

  function updateHotelVisibility() {
    var tier = $("hotel-tier").value;
    var customField = $("custom-hotel-field");
    var note = $("hotel-note");
    if (customField) customField.hidden = tier !== "custom";

    if (tier === "custom") {
      note.textContent = "Using your custom rate for both parks.";
      return;
    }
    if (tier === "onsite") {
      var a = TP[$("park-a").value], b = TP[$("park-b").value];
      var aHas = a && a.hotelOnPropAvg > 0;
      var bHas = b && b.hotelOnPropAvg > 0;
      if (aHas && bHas) {
        note.textContent = "Both parks have on-property hotels.";
      } else if (!aHas && !bHas) {
        note.textContent = "Neither park has on-property hotels — both will fall back to offsite.";
      } else {
        note.textContent = "Only " + (aHas ? a.label : b.label) + " has on-property; the other will use offsite.";
      }
      return;
    }
    note.textContent = "Offsite rates used for both parks.";
  }

  function refreshParkNotes() {
    parkOnsiteNote($("park-a").value, $("park-a-note"));
    parkOnsiteNote($("park-b").value, $("park-b-note"));
    updateHotelVisibility();
  }

  window.addEventListener("DOMContentLoaded", function () {
    // Init origin picker — 65 airports, ZIP auto-select, flight prefill
    if (window.VM_OriginPicker) {
      VM_OriginPicker.initOnPage({
        destRegion: 'domestic',
        destLat: 28.38, destLng: -81.56, destName: 'Orlando',
        getPartySize: function(){var a=parseInt((document.getElementById("adults")||{}).value||2,10);var k=parseInt((document.getElementById("children")||{}).value||0,10);return a+k;}
      });
    }

    VM_Pickers.fillThemeParks($("park-a"), "disney_wdw");
    VM_Pickers.fillThemeParks($("park-b"), "universal_orlando");
    $("park-a").addEventListener("change", refreshParkNotes);
    $("park-b").addEventListener("change", refreshParkNotes);
    $("hotel-tier").addEventListener("change", updateHotelVisibility);
    refreshParkNotes();

    var gtContainer = document.getElementById("gt-container");
    if (gtContainer && window.VM_GettingThere) {
      gtContainer.innerHTML = window.VM_GettingThere.buildInputHTML({
        defaultMode: "drive",
        defaultMiles: 0
      });
      window.VM_GettingThere.attach(function () { render(calculate()); });
    }

    render(calculate());
  });

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // The capture form is handled by main.js (submitForm -> POST /subscribe).
  // A local handler used to intercept it here and show a success message
  // without sending anything; removed 2026-08-28.
})();
