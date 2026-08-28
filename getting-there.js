/* =====================================================================
   Getting There — shared transportation block
   Used by Disney, Cruise, All-Inclusive, Theme Parks calculators.

   Why user-input flights instead of estimates: flight prices vary too much
   by origin/date for any estimate to be honest. People already know their
   real number by the time they're doing serious math. Driving math uses
   the IRS standard mileage rate for Jul-Dec 2026 ($0.76/mile). Hotel-on-the-road kicks
   in past 500 miles one-way (one extra night each way).

   Source for $0.76/mi: IRS standard mileage rates, effective Jul 1-Dec 31, 2026
   (72.5¢ applied Jan 1-Jun 30, 2026).
   Hotel-on-the-road: AAA 2026 average for mid-tier roadside hotel.
   ===================================================================== */
(function (g) {
  "use strict";

  var IRS_MILEAGE_2026 = 0.67;        // $/mi
  var ROAD_HOTEL_NIGHT = 140;          // mid-tier roadside hotel, 2026 avg
  var ROAD_HOTEL_TRIGGER_MILES = 500;  // one-way threshold for a hotel night each direction

  function money(n) {
    var v = Math.round(n);
    return "$" + v.toLocaleString("en-US");
  }
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /**
   * Build the HTML for the Getting There block.
   * Insert this where you want the input (typically inside .calc-inputs,
   * before the "Run the math" button).
   */
  function buildInputHTML(opts) {
    opts = opts || {};
    var defaultMode = opts.defaultMode || "fly";   // "fly" | "drive" | "none"
    var defaultFlightCost = opts.defaultFlightCost || 0;
    var defaultMiles = opts.defaultMiles || 0;
    var origin = escapeHtml(opts.searchOrigin || "");
    var dest = escapeHtml(opts.searchDestination || "");
    var helpUrl = "https://www.google.com/flights" +
      (origin || dest ? "?q=" + encodeURIComponent(origin + " to " + dest) : "");

    return [
      '<fieldset class="field check-group gt-block" id="gt-block">',
      '  <legend>Getting there</legend>',
      '  <p class="hint" style="margin-bottom:8px">Flight prices swing too much by origin and date for an estimate to be honest. Type your real number and we will roll it into the total.</p>',
      '  <div class="gt-mode-row" role="radiogroup" aria-label="Travel mode">',
      '    <label class="gt-mode"><input type="radio" name="gt-mode" value="fly"' + (defaultMode === "fly" ? " checked" : "") + ' /> <span>Flying</span></label>',
      '    <label class="gt-mode"><input type="radio" name="gt-mode" value="drive"' + (defaultMode === "drive" ? " checked" : "") + ' /> <span>Driving</span></label>',
      '    <label class="gt-mode"><input type="radio" name="gt-mode" value="none"' + (defaultMode === "none" ? " checked" : "") + ' /> <span>Already there</span></label>',
      '  </div>',
      '  <div class="gt-pane gt-pane-fly" id="gt-pane-fly">',
      '    <label for="gt-flight-cost">Estimated flight cost (all travelers, round trip)</label>',
      '    <input type="number" id="gt-flight-cost" min="0" step="25" value="' + defaultFlightCost + '" placeholder="e.g. 1840" />',
      '    <p class="hint">Not sure? <a href="' + helpUrl + '" target="_blank" rel="noopener">Check Google Flights</a> &mdash; it takes 30 seconds.</p>',
      '  </div>',
      '  <div class="gt-pane gt-pane-drive" id="gt-pane-drive" hidden>',
      '    <label for="gt-miles">One-way driving distance (miles)</label>',
      '    <input type="number" id="gt-miles" min="0" step="10" value="' + defaultMiles + '" placeholder="e.g. 650" />',
      '    <p class="hint">We multiply round-trip miles by the 2026 IRS rate ($' + IRS_MILEAGE_2026.toFixed(2) + '/mi) for gas + wear. If one-way is over ' + ROAD_HOTEL_TRIGGER_MILES + ' mi, we add a roadside hotel night each direction at $' + ROAD_HOTEL_NIGHT + '.</p>',
      '  </div>',
      '</fieldset>'
    ].join("");
  }

  /**
   * Compute the cost from the current Getting There inputs.
   * Returns { mode, amount, label, detail } so the caller can drop it into
   * its lineItems array.
   */
  function compute() {
    var modeEl = document.querySelector('input[name="gt-mode"]:checked');
    var mode = modeEl ? modeEl.value : "none";

    if (mode === "fly") {
      var costEl = document.getElementById("gt-flight-cost");
      var amt = Math.max(0, parseFloat(costEl ? costEl.value : 0) || 0);
      return {
        mode: "fly",
        amount: amt,
        label: amt > 0 ? "Flights (round trip, all travelers)" : "Flights — enter your estimate",
        detail: amt > 0 ? "Your number" : ""
      };
    }
    if (mode === "drive") {
      var milesEl = document.getElementById("gt-miles");
      var miles = Math.max(0, parseFloat(milesEl ? milesEl.value : 0) || 0);
      var rt = miles * 2;
      var fuelWear = rt * IRS_MILEAGE_2026;
      var hotelNights = miles > ROAD_HOTEL_TRIGGER_MILES ? 2 : 0; // one each way
      var hotel = hotelNights * ROAD_HOTEL_NIGHT;
      var total = fuelWear + hotel;
      var detail = rt + " mi round trip × $" + IRS_MILEAGE_2026.toFixed(2) + "/mi";
      if (hotelNights > 0) detail += " + " + hotelNights + " roadside hotel night" + (hotelNights > 1 ? "s" : "") + " at $" + ROAD_HOTEL_NIGHT;
      return {
        mode: "drive",
        amount: total,
        label: "Driving (" + Math.round(miles) + " mi each way)",
        detail: detail,
        miles: miles
      };
    }
    return { mode: "none", amount: 0, label: "", detail: "" };
  }

  /**
   * Find the best card to surface against a flight cost. Returns a small
   * inline HTML string (or "" if no good match), based on cards in
   * VM_CARDS.CARDS that score well on flights.
   */
  function flightCoverageNote(flightCost) {
    if (!flightCost || flightCost <= 0) return "";
    if (!g.VM_CARDS || !g.VM_CARDS.CARDS) return "";

    // Rank cards by their realistic value for covering flights:
    //   1. Bonus must be redeemable for flights (travel portal / transfer / direct airline).
    //   2. Prefer cards where bonus value uses portal-floor math (not aspirational).
    //   3. Sort by bonus value among qualifying cards.
    var FLIGHT_FRIENDLY_IDS = { csp: 1, venturex: 1, venture: 1, amexgold: 1 };
    var ranked = Object.keys(g.VM_CARDS.CARDS).map(function (id) {
      var c = g.VM_CARDS.CARDS[id];
      var bonusValue = (c.bonus && c.bonus.dollarValue) || 0;
      var flightCardRank = FLIGHT_FRIENDLY_IDS[c.id] ? 1 : 0;
      // Prefer cards whose category multiplier favors flights / travel.
      var favoresTravel = /flight|travel|portal|airline/i.test(c.earn || "");
      return { card: c, value: bonusValue, favoresTravel: favoresTravel, flightCardRank: flightCardRank };
    }).filter(function (e) {
      return e.value > 0 && e.flightCardRank === 1;
    }).sort(function (a, b) {
      // Travel-favored first, then by raw bonus value.
      if (a.favoresTravel !== b.favoresTravel) return a.favoresTravel ? -1 : 1;
      return b.value - a.value;
    });

    if (!ranked.length) return "";
    var top = ranked[0];
    var card = top.card;
    var coverage = Math.min(top.value, flightCost);
    var pct = Math.min(100, Math.round((coverage / flightCost) * 100));

    var rel = card.affiliateUrl ? 'rel="sponsored noopener"' : 'rel="noopener"';
    var href = card.affiliateUrl || card.url || "#";

    return '<div class="gt-card-hint">' +
      '<p class="gt-card-hint-line"><strong>' + escapeHtml(card.name) + '</strong>\'s current sign-up bonus is worth about <strong>' + money(top.value) + '</strong> in travel — roughly <strong>' + pct + '%</strong> of your flight cost. ' +
      '<a href="' + escapeHtml(href) + '" target="_blank" ' + rel + '>See the card &rarr;</a></p>' +
      '<p class="gt-card-hint-note">Honest math: that\'s the realistic portal value of the bonus points, not the aspirational ceiling.</p>' +
      '</div>';
  }

  /**
   * Wire up pane visibility on radio change. Call once after inserting HTML.
   * Optional: pass an onChange callback to re-run calculate() live.
   */
  function attach(onChange) {
    var radios = document.querySelectorAll('input[name="gt-mode"]');
    function syncPanes() {
      var checked = document.querySelector('input[name="gt-mode"]:checked');
      var mode = checked ? checked.value : "none";
      var fly = document.getElementById("gt-pane-fly");
      var drive = document.getElementById("gt-pane-drive");
      if (fly) fly.hidden = (mode !== "fly");
      if (drive) drive.hidden = (mode !== "drive");
    }
    radios.forEach(function (r) {
      r.addEventListener("change", function () {
        syncPanes();
        if (typeof onChange === "function") onChange();
      });
    });
    var costEl = document.getElementById("gt-flight-cost");
    var milesEl = document.getElementById("gt-miles");
    if (costEl && typeof onChange === "function") {
      costEl.addEventListener("input", onChange);
    }
    if (milesEl && typeof onChange === "function") {
      milesEl.addEventListener("input", onChange);
    }
    syncPanes();
  }

  g.VM_GettingThere = {
    buildInputHTML: buildInputHTML,
    compute: compute,
    flightCoverageNote: flightCoverageNote,
    attach: attach,
    IRS_MILEAGE_2026: IRS_MILEAGE_2026,
    ROAD_HOTEL_NIGHT: ROAD_HOTEL_NIGHT
  };
})(window);
