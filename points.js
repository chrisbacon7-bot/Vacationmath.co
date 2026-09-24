/* =====================================================================
   Points vs. Cash Calculator
   ===================================================================== */
(function () {
  "use strict";
  var P = VM_DATA.POINTS;
  var EXP = VM_DATA.POINTS_EXPANDED;

  // Build the expanded program select on load
  function populatePrograms() {
    var sel = document.getElementById("program");
    if (sel && window.VM_Pickers) {
      VM_Pickers.fillPointsPrograms(sel, "chase_ur");
    }
  }

  // Resolve a program from POINTS_EXPANDED. See calc-data.js.
  function getProgram(key) {
    if (EXP && EXP[key]) {
      var e = EXP[key];
      return {
        label: e.label,
        cash: e.cash || 1.0,
        portal: e.portal == null ? (e.cash || 1.0) : e.portal,
        transfer: e.transfer == null ? e.tpg : e.transfer,
        tpg: e.tpg,
        source: e.source
      };
    }
    return null;   // POINTS_EXPANDED is the only catalog; see calc-data.js
  }

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + (Math.round(n*100)/100).toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2}); }
  function moneyR(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function cpp(n) { return n.toFixed(2) + "\u00a2"; }

  function calculate() {
    var progKey = $("program").value;
    var prog = getProgram(progKey);
    var points = Math.max(0, parseInt($("points").value || 0, 10));
    var cashPrice = Math.max(0, parseFloat($("cashprice").value || 0));
    var taxesFees = Math.max(0, parseFloat($("taxesfees").value || 0));
    var benchKey = $("benchmark").value;
    var bonusPct = Math.max(0, parseFloat(($("transfer-bonus") || {}).value) || 0);
    var bonus = bonusPct / 100;
    // A live transfer bonus means fewer bank points buy the same partner award.
    // Points already sitting in the airline or hotel account do not get it.
    var bankPoints = bonus > 0 ? points / (1 + bonus) : points;

    var netCashSaved = cashPrice - taxesFees;
    var actualCPP = bankPoints > 0 ? (netCashSaved / bankPoints) * 100 : 0;
    var cppBeforeBonus = points > 0 ? (netCashSaved / points) * 100 : 0;

    var floorCPP = Math.min(prog.tpg, prog.transfer);

    var benchmarkCPP;
    if (benchKey === "floor") benchmarkCPP = floorCPP;
    else if (benchKey === "tpg") benchmarkCPP = prog.tpg;
    else if (benchKey === "transfer") benchmarkCPP = prog.transfer;
    else if (benchKey === "portal") benchmarkCPP = prog.portal;
    else if (benchKey === "custom") benchmarkCPP = Math.max(0.01, parseFloat($("customCpp").value) || 1.5);
    else benchmarkCPP = prog.cash;

    var ratio = benchmarkCPP > 0 ? actualCPP / benchmarkCPP : 0;
    var verdict;
    if (ratio >= P.verdict.excellent)     verdict = "excellent";
    else if (ratio >= P.verdict.good)     verdict = "good";
    else if (ratio >= P.verdict.fair)     verdict = "fair";
    else                                  verdict = "poor";

    // Alt redemptions for the points you actually give up.
    // A transfer bonus means fewer bank points than the partner award price.
    var altCashBackValue = bankPoints * (prog.cash / 100);
    var altPortalValue = bankPoints * (prog.portal / 100);
    var altTransferValue = bankPoints * (prog.transfer / 100);

    return {
      prog: prog,
      points: points,
      cashPrice: cashPrice,
      taxesFees: taxesFees,
      netCashSaved: netCashSaved,
      actualCPP: actualCPP,
      cppBeforeBonus: cppBeforeBonus,
      bankPoints: bankPoints,
      bonusPct: bonusPct,
      floorCPP: floorCPP,
      benchmarkCPP: benchmarkCPP,
      benchKey: benchKey,
      ratio: ratio,
      verdict: verdict,
      altCashBackValue: altCashBackValue,
      altPortalValue: altPortalValue,
      altTransferValue: altTransferValue
    };
  }

  function render(r) {
    var html = "";

    // Top: the cpp result
    html += '<div class="big-result">';
    html += '  <div class="big-card sticker"><p class="big-label">Your cents per point</p><p class="big-num">' + cpp(r.actualCPP) + '</p></div>';
    html += '  <div class="big-card actual"><p class="big-label">Benchmark</p><p class="big-num">' + cpp(r.benchmarkCPP) + '</p></div>';
    html += '  <div class="big-card gap"><p class="big-label">Vs. benchmark</p><p class="big-num">' + (r.ratio*100).toFixed(0) + '%</p></div>';
    html += '</div>';

    // Verdict
    var verdictMap = {
      excellent: { cls: "good",  title: "Redeem. This is an excellent value.",
                   body: "You're getting more value per point than the published benchmark. This is the kind of redemption these points were built for. Book it." },
      good:      { cls: "good",  title: "Solid redemption \u2014 redeem.",
                   body: "You're at or above the benchmark for " + r.prog.label + ". Not a home run, but a clean win. Pull the trigger." },
      fair:      { cls: "fair",  title: "Borderline. Cash might be smarter.",
                   body: "You're getting less than the typical value for " + r.prog.label + ". Pay cash if you can afford it, save the points for a better redemption. Use them only if cash flow makes points the easier path." },
      poor:      { cls: "poor",  title: "Don't redeem. Pay cash.",
                   body: "This is a poor use of points. You'd get more value transferring them or using a different redemption. Cash here, points later." }
    };
    var v = verdictMap[r.verdict];
    html += '<div class="verdict ' + v.cls + '"><h3>' + v.title + '</h3><p>' + v.body + '</p></div>';

    var vsCashout = r.netCashSaved - r.altCashBackValue;
    html += '<div class="result-note"><strong>What this number means.</strong> Paying cash costs ' + money(r.cashPrice) + '. This award still costs ' + money(r.taxesFees) + ' out of pocket and saves ' + money(r.netCashSaved) + ' versus that fare. Cashing the same points out is about ' + moneyR(r.altCashBackValue) + '. ';
    html += vsCashout >= 0
      ? "This redemption beats cash-out by " + money(vsCashout) + "."
      : "Cash-out beats this redemption by " + money(-vsCashout) + ". Pay cash if you can, and keep the points.";
    html += "</div>";
    if (r.cashPrice > 0 && r.taxesFees / r.cashPrice >= 0.2) {
      html += '<div class="result-note"><strong>High taxes on this award.</strong> Fees are ' + Math.round((r.taxesFees / r.cashPrice) * 100) + '% of the cash price. A heavy surcharge is a reason to pay cash and keep the miles, even when cents-per-point looks fine before fees.</div>';
    }

    // Alt redemption table
    var pointWord = r.bonusPct > 0
      ? Math.round(r.bankPoints).toLocaleString() + " bank points after a " + r.bonusPct + "% bonus"
      : r.points.toLocaleString() + " " + r.prog.label + " points";
    html += '<h3 class="results-h3">What ' + pointWord + ' are worth other ways</h3>';
    html += '<table class="result-table"><thead><tr><th>Redemption type</th><th>Per point</th><th>Total value</th></tr></thead><tbody>';
    html += '<tr><td>Cash back / statement credit</td><td>' + cpp(r.prog.cash) + '</td><td class="amount">' + moneyR(r.altCashBackValue) + '</td></tr>';
    html += '<tr><td>Travel portal booking</td><td>' + cpp(r.prog.portal) + '</td><td class="amount">' + moneyR(r.altPortalValue) + '</td></tr>';
    html += '<tr><td>Transfer to airline / hotel partner</td><td>' + cpp(r.prog.transfer) + '</td><td class="amount">' + moneyR(r.altTransferValue) + '</td></tr>';
    html += '<tr class="row-total"><td>This redemption</td><td>' + cpp(r.actualCPP) + '</td><td class="amount">' + moneyR(r.netCashSaved) + '</td></tr>';
    html += '</tbody></table>';

    html += '<div class="result-note"><strong>The floor, not the blog headline.</strong> The Points Guy values ' + r.prog.label + ' at ' + cpp(r.prog.tpg) + '. The transfer / Frequent Miler-style floor on this page is ' + cpp(r.prog.transfer) + '. The conservative floor is the lower one: <strong>' + cpp(r.floorCPP) + '</strong>. A redemption that beats TPG and misses the floor is still an undersell. Award space is not checked here.</div>';
    if (r.bonusPct > 0) {
      html += '<div class="result-note"><strong>' + r.bonusPct + '% transfer bonus.</strong> The award price you typed is ' + r.points.toLocaleString() + ' partner points. With a live ' + r.bonusPct + '% bonus you only transfer about ' + Math.round(r.bankPoints).toLocaleString() + ' bank points, so this redemption moves from ' + cpp(r.cppBeforeBonus) + ' to ' + cpp(r.actualCPP) + '. That math applies only while the points are still at the bank and the bonus is actually published. Miles you already moved do not get a second bonus. When the promo ends, re-score at 0%.</div>';
    }

    var portals = {
      chase_ur: [
        { label: "Cash-out / Pay Yourself Back floor", cpp: 1.0 },
        { label: "Sapphire Preferred portal", cpp: 1.25 },
        { label: "Sapphire Reserve portal, only if your card still earns 1.5¢", cpp: 1.5 }
      ],
      amex_mr: [
        { label: "Membership Rewards cash-out", cpp: 0.6 },
        { label: "Amex Travel portal, typical 1¢", cpp: 1.0 }
      ],
      capital_one: [
        { label: "Venture cash-out and Capital One Travel portal", cpp: 1.0 }
      ],
      citi_ty: [
        { label: "ThankYou cash-out", cpp: 0.5 },
        { label: "Citi travel portal", cpp: 1.0 }
      ],
      bilt: [
        { label: "Bilt cash-out", cpp: 0.55 },
        { label: "Bilt travel portal", cpp: 1.25 }
      ],
      wells_fargo: [
        { label: "Wells Fargo cash-out and portal", cpp: 1.0 }
      ]
    }[($("program") || {}).value];
    if (portals && r.points > 0) {
      html += '<h3 class="results-h3">Portal scenarios for the same point balance</h3>';
      html += '<table class="result-table"><thead><tr><th>How you spend them</th><th>Cents per point</th><th>This balance</th><th>Versus this award</th></tr></thead><tbody>';
      portals.forEach(function (row) {
        var value = r.bankPoints * (row.cpp / 100);
        var delta = r.netCashSaved - value;
        var vs = delta >= 0 ? "Award beats it by " + money(delta) : "Portal beats the award by " + money(-delta);
        html += '<tr><td>' + row.label + '</td><td>' + cpp(row.cpp) + '</td><td class="amount">' + moneyR(value) + '</td><td>' + vs + '</td></tr>';
      });
      html += '</tbody></table>';
      html += '<div class="result-note">Portal cents are the published card rate, not a promise that the portal price matches Google Flights. If the portal fare is higher than the cash price you typed, the portal column overstates what the points buy.</div>';
    }

    html += '<div class="result-note"><strong>The rule of thumb.</strong> If your cents-per-point is below the floor, the points are being undersold — pay cash and bank the points. If you are above the floor, redeem. Most flexible-point holders never beat the floor on a plain portal booking. The wins come from a transfer partner, and a transfer bonus only counts while it is live.</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> Cents-per-point benchmarks are <em>estimates</em> based on published valuations from The Points Guy, NerdWallet, and Frequent Miler, averaged and biased conservatively. Your actual value depends on the specific award, transfer partner, and date. Cash-back and portal rates are fixed by the program. Transfer-partner sweet spots can deliver far more value than the benchmark &mdash; or far less if you book at standard award rates.</div>';
    html += '<div class="freshness-badge">Frequent Miler RRVs (Jul 23, 2026) &middot; refreshed September 2026 &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("points", typeof r !== "undefined" && r && r.total ? r.total : 0); }
    $("email-section").hidden = false;

    // Surface the card CTA, sized to the cash price of the trip
    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: r.cashPrice,
      context: "a trip like this",
      calcType: "points"
    });

    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "points",
      selection: { programId: $("program").value }
    });
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Show/hide custom benchmark cpp field
  function updateCppVisibility() {
    var field = document.getElementById("custom-cpp-field");
    if (!field) return;
    field.hidden = $("benchmark").value !== "custom";
  }
  $("benchmark").addEventListener("change", updateCppVisibility);

  // Results are rendered on load, so any input change must re-render or the
  // panel shows stale numbers for the previously selected program. Previously
  // only the Calculate button recalculated, so switching program left the old
  // program's values on screen.
  ["program", "benchmark", "points", "cashprice", "taxesfees", "customCpp", "transfer-bonus"]
    .forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var evt = el.tagName === "SELECT" ? "change" : "input";
      el.addEventListener(evt, function () { render(calculate()); });
    });

  window.addEventListener("DOMContentLoaded", function () {
    populatePrograms();
    updateCppVisibility();
    render(calculate());
  });
  // The capture form is handled by main.js (submitForm -> POST /subscribe).
  // A local handler used to intercept it here and show a success message
  // without sending anything; removed 2026-08-28.
})();
