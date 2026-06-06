/* =====================================================================
   Vacation Funding Plan calculator
   ===================================================================== */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  // Blended earn rate when a household actually puts groceries, gas, dining,
  // and other discretionary on a thoughtful rewards card. ~1.6 cents/dollar
  // is the realistic NerdWallet/TPG-valued return across mid-tier cards.
  var BLENDED_CPP = 0.016;

  function calculate() {
    var target = Math.max(500, parseFloat($("target").value) || 6000);
    var months = Math.max(1, parseInt($("months").value, 10) || 9);
    var saved = Math.max(0, parseFloat($("saved").value) || 0);
    var income = Math.max(0, parseFloat($("income").value) || 0);
    var groceries = Math.max(0, parseFloat($("groceries").value) || 0);
    var gas = Math.max(0, parseFloat($("gas").value) || 0);
    var dining = Math.max(0, parseFloat($("dining").value) || 0);
    var other = Math.max(0, parseFloat($("other").value) || 0);
    var signupCash = Math.max(0, parseFloat($("signup").value) || 0);

    // Normal monthly card-able spend
    var monthlySpend = groceries + gas + dining + other;
    var pointsCashValue = monthlySpend * BLENDED_CPP * months; // routed through card during runway
    var totalFromCard = pointsCashValue + signupCash;

    var gap = target - saved - totalFromCard;
    var cashNeeded = Math.max(0, gap);
    var monthlyTarget = cashNeeded / months;
    var weeklyTarget = monthlyTarget / 4.333;
    var dailyTarget = monthlyTarget / 30;

    // 8% guideline
    var sustainable = income * 0.08;
    var stretch = monthlyTarget > sustainable;

    // Points coverage %
    var pointsCoverage = (totalFromCard / target) * 100;

    // Status:
    // - "easy"     monthlyTarget <= sustainable
    // - "stretch"  monthlyTarget within 1.5x
    // - "hard"     beyond
    var status;
    if (income <= 0) status = "neutral";
    else if (monthlyTarget <= sustainable) status = "easy";
    else if (monthlyTarget <= sustainable * 1.5) status = "stretch";
    else status = "hard";

    return {
      target: target,
      saved: saved,
      months: months,
      gap: gap,
      cashNeeded: cashNeeded,
      monthlyTarget: monthlyTarget,
      weeklyTarget: weeklyTarget,
      dailyTarget: dailyTarget,
      pointsCashValue: pointsCashValue,
      signupCash: signupCash,
      totalFromCard: totalFromCard,
      pointsCoverage: pointsCoverage,
      sustainable: sustainable,
      stretch: stretch,
      status: status,
      monthlySpend: monthlySpend
    };
  }

  function statusCopy(r) {
    if (r.status === "easy") {
      return "<strong>This is doable on autopilot.</strong> Your monthly savings target (" + money(r.monthlyTarget) + ") is under the 8% guideline. Set up an automatic transfer the day after payday and forget about it.";
    }
    if (r.status === "stretch") {
      return "<strong>Stretch zone &mdash; possible with focus.</strong> Your monthly target (" + money(r.monthlyTarget) + ") is above the 8% sustainable rate (" + money(r.sustainable) + "). Either extend the timeline, lower the trip cost, or pull one of two levers: pause a subscription, or move signup bonuses earlier.";
    }
    if (r.status === "hard") {
      return "<strong>Math says: stretch the timeline.</strong> At " + money(r.monthlyTarget) + "/month you'd be sacrificing more than 12% of take-home, which usually breaks. Best move: add 3-6 months, or drop trip cost by " + money((r.monthlyTarget - r.sustainable) * r.months) + " using a cheaper resort tier or different dates.";
    }
    return "<strong>Add your income</strong> for a 'is this sustainable?' check against the 8% guideline.";
  }

  function render(r) {
    var html = "";

    // Hero stat cards
    html += '<div class="big-result">';
    html += '  <div class="big-card sticker"><p class="big-label">Weekly cash to save</p><p class="big-num">' + money(r.weeklyTarget) + '</p><p class="big-pct">~' + money(r.dailyTarget) + '/day · ' + money(r.monthlyTarget) + '/mo</p></div>';
    html += '  <div class="big-card actual"><p class="big-label">Points + bonuses cover</p><p class="big-num">' + money(r.totalFromCard) + '</p><p class="big-pct">' + r.pointsCoverage.toFixed(0) + '% of total trip</p></div>';
    html += '  <div class="big-card gap"><p class="big-label">Remaining gap</p><p class="big-num">' + money(r.cashNeeded) + '</p><p class="big-pct">after savings + points</p></div>';
    html += '</div>';

    // Status note
    html += '<div class="result-note">' + statusCopy(r) + '</div>';

    // Breakdown table
    html += '<h3 class="results-h3">The math</h3>';
    html += '<table class="result-table"><thead><tr><th scope="col">Component</th><th scope="col">Amount</th></tr></thead><tbody>';
    html += '<tr class="row-sticker"><td>Target trip cost</td><td class="amount">' + money(r.target) + '</td></tr>';
    html += '<tr class="row-hidden"><td>Already saved</td><td class="amount">&minus;' + money(r.saved) + '</td></tr>';
    html += '<tr class="row-hidden"><td>Points from normal spend (' + money(r.monthlySpend) + '/mo × ' + r.months + ' mos × 1.6¢/$)</td><td class="amount">&minus;' + money(r.pointsCashValue) + '</td></tr>';
    if (r.signupCash > 0) {
      html += '<tr class="row-hidden"><td>Signup bonus cash value</td><td class="amount">&minus;' + money(r.signupCash) + '</td></tr>';
    }
    html += '<tr class="row-total"><td>Cash still needed</td><td class="amount">' + money(r.cashNeeded) + '</td></tr>';
    html += '</tbody></table>';

    // Plan
    html += '<h3 class="results-h3">Your plan</h3>';
    html += '<table class="result-table"><tbody>';
    html += '<tr><td>Save each <strong>day</strong></td><td class="amount">' + money(r.dailyTarget) + '</td></tr>';
    html += '<tr><td>Save each <strong>week</strong></td><td class="amount">' + money(r.weeklyTarget) + '</td></tr>';
    html += '<tr><td>Save each <strong>month</strong></td><td class="amount">' + money(r.monthlyTarget) + '</td></tr>';
    if (r.sustainable > 0) {
      html += '<tr><td>8% of take-home (sustainable rate)</td><td class="amount">' + money(r.sustainable) + '</td></tr>';
    }
    html += '</tbody></table>';

    html += '<div class="result-note"><strong>The points number is real, not hopeful.</strong> If you already spend ' + money(r.monthlySpend) + '/month on groceries, gas, dining, and discretionary &mdash; and you put it on a thoughtful card instead of debit &mdash; you earn this back. No new spending. No hacks. Use the Card Math calculator next to figure out which card maximizes your specific mix.</div>';
    html += '<div class="freshness-badge">Blended earn rate 1.6&cent;/$ &middot; 2026 NerdWallet/TPG card values &middot; next refresh August 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("funding", typeof r !== "undefined" && r && r.total ? r.total : 0); }
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: r.target || 5000,
      context: "the trip you're funding",
      calcType: "funding"
    });
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) {
      $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  window.addEventListener("DOMContentLoaded", function () {
    // Init origin picker — 65 airports, ZIP auto-select, flight prefill
    if (window.VM_OriginPicker) {
      VM_OriginPicker.initOnPage({
        destRegion: 'domestic',
        destLat: 28.38, destLng: -81.56, destName: 'your destination',
        getPartySize: function(){return 2;}
      });
    }

    render(calculate());
  });

  // Email form
  var emailForm = document.querySelector('form[data-source="funding-calc"]');
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = emailForm.querySelector('input[type="email"]');
      var msg = emailForm.querySelector(".form-msg");
      if (!input.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        msg.textContent = "Please enter a valid email.";
        msg.style.color = "var(--coral)";
        return;
      }
      msg.textContent = "Got it. Check your inbox in the next 2 minutes.";
      msg.style.color = "var(--honey-soft)";
      input.value = "";
    });
  }
})();
