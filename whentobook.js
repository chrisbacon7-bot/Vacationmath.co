/* =====================================================================
   When-to-Book Calculator
   ===================================================================== */
(function () {
  "use strict";
  var W = VM_DATA.WHENTOBOOK;
  var BW = VM_DATA.BOOKING_WINDOWS;
  var DESTS = VM_DATA.DESTINATION_CITIES;

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var travel = new Date(dateStr + "T00:00:00");
    return Math.round((travel - today) / (1000 * 60 * 60 * 24));
  }

  function setDefaultDate() {
    var input = $("travel-date");
    if (input.value) return;
    var d = new Date();
    d.setDate(d.getDate() + 45);
    input.value = d.toISOString().slice(0, 10);
  }

  function getDestination() {
    var id = $("destination").value;
    for (var i = 0; i < DESTS.length; i++) {
      if (DESTS[i].id === id) return DESTS[i];
    }
    return DESTS[0];
  }

  // Destination rows use a few region spellings. Map them onto the windows that have source labels.
  function windowKey(region) {
    var alias = {
      Europe_W: "Europe",
      Europe_C: "Europe",
      Europe_N: "Europe",
      domestic_south: "US_domestic",
      domestic_west: "US_domestic",
      Latin_America: "Caribbean_Mexico"
    };
    return alias[region] || region;
  }

  // Pick the right window based on destination region. Holiday override still applies.
  function getWindowForTrip(dest, holidayKey) {
    if (holidayKey && W.holidays[holidayKey]) return W.holidays[holidayKey];
    var win = BW[windowKey(dest.region)];
    if (win) return win;
    return W.bestWindowDays.domestic;
  }

  function updateRegionNote() {
    var dest = getDestination();
    if (!dest) return;
    var win = getWindowForTrip(dest, "");
    var winLabel = win ? (win.min + "–" + win.max + " days out") : "varies";
    $("region-note").textContent = dest.label + " · Booking window: " + winLabel + " · " + windowSource(win);
  }

  // Region windows store the citation on `source`. Older rows only had `note`,
  // which made the result print "Booking-window data: undefined".
  function windowSource(win) {
    if (win && win.source) return String(win.source);
    if (win && win.note) {
      var note = String(win.note).replace(/\s+/g, " ").trim();
      if (note.length > 140) note = note.slice(0, 137) + "…";
      return note;
    }
    return "Expedia 2026 Air Hacks and Google Flights booking-curve research";
  }

  function calculate() {
    var dateStr = $("travel-date").value;
    var holidayKey = $("holiday").value;
    var currentPrice = Math.max(0, parseFloat($("current-price").value) || 0);
    var dest = getDestination();
    var origin = $("origin").value;

    var days = daysUntil(dateStr);
    var win = getWindowForTrip(dest, holidayKey);

    var status;
    if (days === null) status = "unknown";
    else if (days < 0) status = "past";
    else if (days < win.min) status = "late";
    else if (days <= win.max) status = "in-window";
    else status = "early";

    var baseline;
    if (status === "in-window") {
      baseline = currentPrice / (1 - W.inWindowSavings);
    } else if (status === "early") {
      baseline = currentPrice / (1 + W.earlyPenalty);
    } else if (status === "late") {
      baseline = currentPrice / (1 + W.latePenalty);
    } else {
      baseline = currentPrice;
    }
    var sweetSpotEstimate = baseline * (1 - W.inWindowSavings);
    function shiftBack(days) {
      var d = new Date(dateStr + "T00:00:00");
      d.setDate(d.getDate() - days);
      return d;
    }
    function fmtDay(d) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    var bestOffset = Math.min(win.max, Math.max(win.min, win.mid || win.min));
    var earlyEstimate = baseline * (1 + W.earlyPenalty);
    var lateEstimate = baseline * (1 + W.latePenalty);

    return {
      days: days, status: status, window: win, dateStr: dateStr,
      currentPrice: currentPrice, baseline: baseline,
      sweetSpotEstimate: sweetSpotEstimate, earlyEstimate: earlyEstimate, lateEstimate: lateEstimate,
      destination: dest, origin: origin, holidayKey: holidayKey,
      bookOpenLabel: dateStr ? fmtDay(shiftBack(win.max)) : "",
      bookCloseLabel: dateStr ? fmtDay(shiftBack(win.min)) : "",
      bookBestLabel: dateStr ? fmtDay(shiftBack(bestOffset)) : ""
    };
  }

  function render(r) {
    var html = "";

    if (r.status === "unknown") {
      html = '<div class="verdict info"><h3>Pick a travel date to get the math.</h3><p>I need a target date to figure out which side of the booking window you\'re on.</p></div>';
      $("results").innerHTML = html;
      $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("whentobook", typeof r !== "undefined" && r && r.total ? r.total : 0); }
      return;
    }

    if (r.status === "past") {
      html = '<div class="verdict poor"><h3>That date has already passed.</h3><p>Pick a future travel date and I\'ll show you whether you\'re in the booking window.</p></div>';
      $("results").innerHTML = html;
      $("results").classList.add("has-results");
      return;
    }

    var routeLabel = r.origin
      ? "Route context: " + r.origin.toUpperCase() + " → " + r.destination.label
      : "Destination: " + r.destination.label;
    html += '<div class="result-note" style="margin-top:0">' + routeLabel + ". Booking-window data: <em>" + windowSource(r.window) + "</em>.</div>";

    html += '<div class="compare-grid">';
    html += '  <div class="compare-card winner">';
    html += '    <p class="cc-label">Sweet-spot window</p>';
    html += '    <p class="cc-total">' + r.window.min + '–' + r.window.max + ' days out</p>';
    html += '    <div class="cc-line"><span>Book between</span><span>' + r.bookOpenLabel + ' and ' + r.bookCloseLabel + '</span></div>';
    html += '    <div class="cc-line"><span>Best single day</span><span>' + r.bookBestLabel + '</span></div>';
    html += '    <div class="cc-line"><span>Cheapest months</span><span>' + (r.window.cheapestMonth || W.cheapestMonth) + '</span></div>';
    html += '    <div class="cc-line"><span>Cheapest book day</span><span>' + W.cheapestBookDay + '</span></div>';
    html += '    <div class="cc-line"><span>Cheapest fly day</span><span>' + W.cheapestFlyDay + '</span></div>';
    html += '  </div>';
    html += '  <div class="compare-card">';
    html += '    <p class="cc-label">You are</p>';
    html += '    <p class="cc-total">' + r.days + ' days out</p>';
    var posLabel = r.status === "in-window" ? "Inside the window" : (r.status === "early" ? "Too early" : "Too late");
    html += '    <div class="cc-line"><span>Position</span><span>' + posLabel + '</span></div>';
    html += '    <div class="cc-line"><span>Quoted price</span><span>' + money(r.currentPrice) + '</span></div>';
    html += '    <div class="cc-line"><span>Est. sweet-spot price</span><span>' + money(r.sweetSpotEstimate) + '</span></div>';
    html += '    <div class="cc-line"><span>Est. last-minute price</span><span>' + money(r.lateEstimate) + '</span></div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="result-note"><strong>Hopper would paint a color. This is the curve.</strong> A prediction app compares today&rsquo;s fare with its own history and often says &ldquo;wait,&rdquo; including on days that are already inside the sweet spot. This page does not guess tomorrow&rsquo;s fare. It places your date (' + r.days + ' days out) on the published window (' + r.window.min + '&ndash;' + r.window.max + ' days) and scales the ' + money(r.currentPrice) + ' quote you typed. ';
    if (r.status === "in-window") {
      html += "You are inside the window. A wait badge here is the prediction, not the curve. Prices from here usually move a few percent, not a new low.";
    } else if (r.status === "early") {
      html += "You are early. The curve says re-check as you approach " + r.bookOpenLabel + ". That is not a promise the fare drops on a particular Tuesday.";
    } else {
      html += "You are late. A &ldquo;prices may still drop&rdquo; badge inside this part of the curve fights the late premium. Book unless you already see a published sale on this route.";
    }
    html += '</div>';

    html += '<h3 class="results-h3">Booking curve for this quote</h3>';
    html += '<table class="result-table"><thead><tr><th>Where the date sits</th><th>What the curve does</th><th>Scaled from your quote</th></tr></thead><tbody>';
    html += '<tr' + (r.status === "early" ? ' class="row-total"' : '') + '><td>Too early (before ' + r.window.max + ' days)</td><td>Often ~10% above the eventual low</td><td class="amount">' + money(r.earlyEstimate) + '</td></tr>';
    html += '<tr' + (r.status === "in-window" ? ' class="row-total"' : '') + '><td>Sweet spot (' + r.window.min + '&ndash;' + r.window.max + ' days)</td><td>Book. Waiting is not the strategy</td><td class="amount">' + money(r.sweetSpotEstimate) + '</td></tr>';
    html += '<tr' + (r.status === "late" ? ' class="row-total"' : '') + '><td>Too late (inside ' + r.window.min + ' days)</td><td>Late premium, about 35% near departure</td><td class="amount">' + money(r.lateEstimate) + '</td></tr>';
    html += '</tbody></table>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> Booking windows are <em>estimates</em> from Expedia Air Hacks, Google Flights research, and Going.com holiday curves &mdash; not a live fare search and not Hopper&rsquo;s buy/wait color for this route. Sweet-spot and last-minute prices are scaled from the quote you entered. Actual prices move with airline competition, fuel, holiday calendars, and how full the flight is the day you check. Use the window as a guide, not a guarantee.</div>';

    var vClass, vTitle, vBody;
    if (r.status === "in-window") {
      vClass = "good";
      vTitle = "Book it. You're in the window.";
      vBody = "At " + r.days + " days out, you're inside the statistical sweet spot for this route type (" + r.window.min + "-" + r.window.max + " days). Prices may move ±5-7% from here, but they're unlikely to drop meaningfully \u2014 waiting longer typically costs more. If your quote is " + money(r.currentPrice) + " or less, lock it.";
    } else if (r.status === "early" && r.days - r.window.max < 30) {
      vClass = "fair";
      vTitle = "Wait a bit. You're slightly early.";
      vBody = "You're " + (r.days - r.window.max) + " days outside the upper edge of the sweet spot. Prices average ~10% higher this far out, with a typical drop as you approach " + r.window.max + " days. Set a fare alert. Re-check in 2-3 weeks. Don't wait past " + r.window.min + " days \u2014 that's when the late penalty kicks in.";
    } else if (r.status === "early") {
      vClass = "info";
      vTitle = "Way early. Set a fare alert and wait.";
      vBody = "You're " + (r.days - r.window.max) + " days outside the sweet spot. At this distance, you typically pay 10-15% more than the eventual sweet-spot price. The exception is holiday travel (set a tighter alert if so), but for normal trips, the smart move is patience.";
    } else if (r.status === "late" && r.days >= 14) {
      vClass = "fair";
      vTitle = "Book now. You're past the sweet spot but still survivable.";
      vBody = "You're " + (r.window.min - r.days) + " days short of the lower edge. Prices typically climb ~15-25% in this window and another 10% in the final two weeks. " + money(r.currentPrice) + " is likely close to the best you'll see \u2014 book.";
    } else {
      vClass = "poor";
      vTitle = "Book today. Last-minute premium is real.";
      vBody = "Inside two weeks of travel, fares average ~35% above the sweet-spot price. The only reason to wait is a published flash sale on this exact route \u2014 and those are rare. Take the hit and book.";
    }
    html += '<div class="verdict ' + vClass + '"><h3>' + vTitle + '</h3><p>' + vBody + '</p></div>';

    html += '<div class="result-note"><strong>What this number means.</strong> The window is for airfare. Book between ' + r.bookOpenLabel + ' and ' + r.bookCloseLabel + ' for this departure. Refundable hotels can wait until the flight is locked. Prepaid hotel deals often move on a similar calendar, not the old “30 days for everything” rule.</div>';
    html += '<div class="result-note"><strong>What people forget.</strong> Cheapest book day (' + W.cheapestBookDay + ') and cheapest fly day (' + W.cheapestFlyDay + '/Wednesday) compound: book Friday for a Tuesday departure and you stack two small wins. The single cheapest month for domestic travel is ' + W.cheapestMonth + '; the priciest is ' + W.priciestMonth + ' (no surprise). Holiday windows tighten \u2014 Christmas best at ~58 days out, Thanksgiving at ~45, not the 30-day rule you\'ve probably heard.</div>';

    html += '<div class="result-note"><strong>If you don\'t have a quote yet \u2014 typical 2026 ranges, party of 4, round trip.</strong> Domestic short-haul (under 1,000 mi): $800\u2013$1,400. Domestic transcon: $1,200\u2013$2,200. Caribbean / Mexico: $1,400\u2013$2,400. Hawaii: $1,800\u2013$3,200. Europe (summer): $2,800\u2013$4,800. Source: Hopper 2026 Consumer Travel Index + DOT ARC May 2026. These are ranges, not estimates for your specific route \u2014 always check Google Flights for your dates before locking the total in.</div>';
    html += '<div class="freshness-badge">Expedia 2026 Air Hacks + Hopper 2026 booking windows &middot; refreshed September 2026 &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: r.currentPrice * 2,
      context: "flights for your trip",
      calcType: "whentobook"
    });

    var oSel = $("origin"), dSel = $("destination");
    var oLabel = oSel && oSel.options[oSel.selectedIndex] ? oSel.options[oSel.selectedIndex].text : "";
    var dLabel = dSel && dSel.options[dSel.selectedIndex] ? dSel.options[dSel.selectedIndex].text : "";
    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "whentobook",
      selection: { originLabel: oLabel, destinationLabel: dLabel }
    });
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("DOMContentLoaded", function () {
    VM_Pickers.fillOriginCities($("origin"), "jfk");
    // Wire ZIP auto-select
    if (window.VM_OriginPicker) {
      VM_OriginPicker.wireZipAutoSelect(
        $("origin-zip"), $("origin"), $("origin-zip-status")
      );
    }
    VM_Pickers.fillDestinationCities($("destination"), "orlando");
    $("destination").addEventListener("change", updateRegionNote);
    setDefaultDate();
    updateRegionNote();
    render(calculate());
  });
  // The capture form is handled by main.js (submitForm -> POST /subscribe).
  // A local handler used to intercept it here and show a success message
  // without sending anything; removed 2026-08-28.
})();
