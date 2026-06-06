/* =====================================================================
   Reusable Credit Card CTA — wraps card-module.js with the old API.
   Each calc page calls: VM_CardCTA.render({ container, tripTotal, context, calcType, opts })
   - calcType is the new piece: "disney" | "cruise" | "allinclusive" | "themeparks"
     | "roadtrip" | "points" | "whentobook" | "timeshare"
   - If calcType is missing, falls back to the legacy generic "Stack the savings" block
     (so we never break existing pages mid-deploy).
   ===================================================================== */
(function (global) {
  "use strict";

  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  function legacyEstimateSavings(tripTotal) {
    var bonusValue = 75000 * 0.0125;          // CSP 75k @ 1.25¢ portal
    var categoryEarn = tripTotal * 0.02;
    var capped = Math.min(bonusValue + categoryEarn, tripTotal);
    return Math.max(600, Math.round(capped));
  }

  function legacyRender(container, tripTotal, context) {
    var savings = legacyEstimateSavings(tripTotal);
    container.innerHTML =
      '<section class="card-savings">' +
        '<p class="kicker">Stack the savings</p>' +
        '<h3>Most families pay for ' + context + ' with the wrong card.</h3>' +
        '<p>A single well-chosen travel card with a sign-up bonus can wipe out a meaningful chunk of this trip \u2014 and that\u2019s before you count the 2-5% you earn on the spending you were going to do anyway.</p>' +
        '<div class="savings-line">' +
          '<span class="savings-amount">~' + money(savings) + '</span>' +
          '<span class="savings-label">realistic offset on ' + context + ' with the right card + bonus</span>' +
        '</div>' +
        '<a href="calculator.html" class="btn btn-honey">Run the full credit card math &rarr;</a>' +
      '</section>';
  }

  function render(opts) {
    opts = opts || {};
    var container = opts.container || document.getElementById("card-cta");
    if (!container) return;
    var tripTotal = opts.tripTotal || 5000;
    var context = opts.context || "your trip";
    var calcType = opts.calcType || "";
    var extras = opts.opts || {};

    if (calcType && window.VM_CardModule && window.VM_CARDS) {
      if (calcType === "timeshare") {
        // Special case: timeshare gets the "before you sign" callout instead of cards
        VM_CardModule.renderTimeshareCallout(container.id || "card-cta");
        return;
      }
      // Render the trip-matched card module
      VM_CardModule.render(container.id || "card-cta", calcType, tripTotal, extras);
      return;
    }

    // Fallback (calc page not yet wired with calcType)
    legacyRender(container, tripTotal, context);
  }

  global.VM_CardCTA = { render: render, estimateSavings: legacyEstimateSavings };
})(this);
