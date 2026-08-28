/* =====================================================================
   Timeshare Math Calculator
   Compares lifetime ownership cost vs. renting the same week + investing
   ===================================================================== */
(function () {
  "use strict";
  var T = VM_DATA.TIMESHARE;
  var DEVS = VM_DATA.TIMESHARE_DEVELOPERS;

  function populateDevelopers() {
    var sel = document.getElementById("developer");
    if (!sel || !window.VM_Pickers) return;
    // Add a "Industry average" option first
    sel.innerHTML = "";
    var blank = document.createElement("option");
    blank.value = ""; blank.textContent = "Industry average (ARDA 2025)";
    sel.appendChild(blank);
    // Then real developers alphabetical
    var devIds = Object.keys(DEVS).sort(function(a,b){ return DEVS[a].label.localeCompare(DEVS[b].label); });
    devIds.forEach(function(id){
      var o = document.createElement("option");
      o.value = id; o.textContent = DEVS[id].label;
      sel.appendChild(o);
    });
    // Custom / private resale option at the bottom
    var custom = document.createElement("option");
    custom.value = "custom"; custom.textContent = "Custom — private resale or developer not listed";
    sel.appendChild(custom);

    var note = document.getElementById("developer-note");
    function updateNote() {
      if (!note) return;
      var id = sel.value;
      if (id === "custom") {
        note.textContent = "Enter your own purchase price and year-1 maintenance below — nothing will auto-fill.";
      } else if (!id) {
        note.textContent = "Industry average per ARDA 2025: $23,160 purchase / $1,480 maintenance. You can override anything below.";
      } else if (DEVS[id]) {
        var d = DEVS[id];
        note.textContent = d.label + ": ~$" + d.avgPurchase.toLocaleString() + " purchase / $" + d.maintenanceAnnualAvg.toLocaleString() + " year-1 maintenance. You can override below.";
      }
    }

    // When developer changes, autofill price + maintenance — unless "custom"
    sel.addEventListener("change", function () {
      var id = sel.value;
      if (id === "custom") {
        // Don't override the user's values
      } else if (!id) {
        document.getElementById("purchase").value = T.avgPurchase;
        document.getElementById("maintenance").value = T.avgMaintenanceYear1;
      } else if (DEVS[id]) {
        document.getElementById("purchase").value = DEVS[id].avgPurchase;
        document.getElementById("maintenance").value = DEVS[id].maintenanceAnnualAvg;
      }
      updateNote();
    });
    updateNote();
  }

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  // Monthly amortization on a fixed-rate loan
  function loanTotalInterest(principal, annualRate, years) {
    if (!principal || principal <= 0) return 0;
    var r = annualRate / 12;
    var n = years * 12;
    var monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return (monthly * n) - principal;
  }

  // Future value of a one-time lump sum invested
  function fvLump(amount, rate, years) {
    return amount * Math.pow(1 + rate, years);
  }

  function calculate() {
    var purchase = Math.max(0, parseFloat($("purchase").value) || 0);
    var mf1 = Math.max(0, parseFloat($("maintenance").value) || 0);
    var bedrooms = $("bedrooms").value;
    var years = Math.max(1, Math.min(40, parseInt($("years").value, 10) || 20));
    var financed = $("financed").checked;

    // ---- Total maintenance over ownership (5% escalation) ----
    var totalMaintenance = 0;
    var escalation = T.maintenanceEscalation;
    for (var y = 0; y < years; y++) {
      totalMaintenance += mf1 * Math.pow(1 + escalation, y);
    }

    // ---- Financing interest ----
    var interest = financed
      ? loanTotalInterest(purchase, T.avgLoanRate, Math.min(T.avgLoanYears, years))
      : 0;

    // ---- Special assessments (~$1500 per decade) ----
    var assessments = T.specialAssessmentPerDecade * Math.floor(years / 10);

    // ---- Resale recovery at end of ownership ----
    var resaleRecovery = purchase * T.resaleRecoveryPct;

    // ---- All-in lifetime cost ----
    var totalCost = purchase + interest + totalMaintenance + assessments - resaleRecovery;

    // ---- Rental alternative (RedWeek same week, escalated 3%/yr) ----
    var rentNow = T.rentalEquivalents[bedrooms];
    var totalRental = 0;
    for (var y2 = 0; y2 < years; y2++) {
      totalRental += rentNow * Math.pow(1 + 0.03, y2);
    }

    // ---- Opportunity cost: invest the purchase + financing interest instead ----
    var investedFV = fvLump(purchase, T.investmentRate, years);
    var investedGain = investedFV - purchase;

    // ---- Verdict ----
    var rentSavings = totalCost - totalRental;
    var verdict, vClass, vBody;
    if (rentSavings > 5000) {
      verdict = "Rent it. Don't buy it.";
      vClass = "good";
      vBody = "Renting the same unit on RedWeek over " + years + " years costs " + money(totalRental) + " — that's " + money(rentSavings) + " less than owning. You get the same week, no contract, no maintenance creep, no resale problem. If you stop wanting it, you simply stop renting.";
    } else if (rentSavings > 0) {
      verdict = "Renting wins, but it's closer than expected.";
      vClass = "fair";
      vBody = "Rental comes in " + money(rentSavings) + " cheaper. The math gets even worse for buying if maintenance escalation accelerates (which it has, historically) or if you ever try to sell. Owning rarely wins on cost alone.";
    } else {
      verdict = "On price, owning is close. On flexibility, renting still wins.";
      vClass = "info";
      vBody = "At this maintenance fee and ownership length, the lifetime numbers are close. But ownership locks you to one resort, one week, and a fee schedule you don't control. Renting keeps every variable in your hands.";
    }

    return {
      purchase: purchase,
      interest: interest,
      totalMaintenance: totalMaintenance,
      assessments: assessments,
      resaleRecovery: resaleRecovery,
      totalCost: totalCost,
      totalRental: totalRental,
      rentNow: rentNow,
      investedFV: investedFV,
      investedGain: investedGain,
      rentSavings: rentSavings,
      years: years,
      financed: financed,
      verdict: verdict,
      vClass: vClass,
      vBody: vBody
    };
  }

  function render(r) {
    var html = "";

    html += '<div class="compare-grid">';
    html += '  <div class="compare-card ' + (r.rentSavings > 0 ? "" : "winner") + '">';
    html += '    <p class="cc-label">Buy the timeshare</p>';
    html += '    <p class="cc-total">' + money(r.totalCost) + '</p>';
    html += '    <div class="cc-line"><span>Purchase price</span><span>' + money(r.purchase) + '</span></div>';
    if (r.financed) html += '    <div class="cc-line"><span>Financing interest (17%/10yr)</span><span>' + money(r.interest) + '</span></div>';
    html += '    <div class="cc-line"><span>Maintenance ' + r.years + ' yrs (5% escalation)</span><span>' + money(r.totalMaintenance) + '</span></div>';
    html += '    <div class="cc-line"><span>Special assessments</span><span>' + money(r.assessments) + '</span></div>';
    html += '    <div class="cc-line"><span>Resale recovery (after fees)</span><span>&minus;' + money(r.resaleRecovery) + '</span></div>';
    html += '  </div>';
    html += '  <div class="compare-card ' + (r.rentSavings > 0 ? "winner" : "") + '">';
    html += '    <p class="cc-label">Rent the same week</p>';
    html += '    <p class="cc-total">' + money(r.totalRental) + '</p>';
    html += '    <div class="cc-line"><span>RedWeek rental year 1</span><span>' + money(r.rentNow) + '</span></div>';
    html += '    <div class="cc-line"><span>Years rented</span><span>' + r.years + '</span></div>';
    html += '    <div class="cc-line"><span>Assumed escalation</span><span>3%/yr</span></div>';
    html += '    <div class="cc-line"><span>Contract / obligation</span><span>None</span></div>';
    html += '    <div class="cc-line"><span>Resale risk</span><span>None</span></div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="verdict ' + r.vClass + '"><h3>' + r.verdict + '</h3><p>' + r.vBody + '</p></div>';

    // Opportunity cost callout
    html += '<div class="result-note"><strong>The number the salesperson won\'t show you.</strong> If you took the ' + money(r.purchase) + ' purchase price and put it in a low-cost index fund at the long-run S&amp;P average (7%), in ' + r.years + ' years it would be worth ' + money(r.investedFV) + ' — a gain of ' + money(r.investedGain) + '. The maintenance fees alone (' + money(r.totalMaintenance) + ' over the period) could be funding that account instead.</div>';

    html += '<div class="result-note"><strong>What people forget to add.</strong> Timeshare math always misses three things: special assessments after hurricanes or roof replacements (averaging $1,500/decade), exchange fees if you want a different resort ($200-$400/use through RCI/II), and the time-cost of trying to sell. The average RedWeek resale closes at 5-15% of the original purchase price.</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> This is a long-run <em>estimate</em>, not a live quote. Maintenance escalation (5%/yr) reflects the industry 30-year average from ARDA and TUG. Rental comps use RedWeek listing data. The S&amp;P comparison uses the long-run 7% real return. Your real outcome depends on your specific resort, financing terms, and resale market &mdash; we&rsquo;ve biased the math toward giving the purchase the benefit of the doubt.</div>';
    html += '<div class="freshness-badge">ARDA 2025 industry averages &middot; RedWeek 2026 listings &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("timeshare", typeof r !== "undefined" && r && r.total ? r.total : 0); }
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: Math.min(r.totalRental, 8000),
      context: "your annual vacation week",
      calcType: "timeshare"
    });

    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "timeshare",
      selection: { developerId: $("developer").value }
    });
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("DOMContentLoaded", function () { populateDevelopers(); });
  window.addEventListener("DOMContentLoaded", function () { render(calculate()); });

  var emailForm = document.querySelector('form[data-source="timeshare-calc"]');
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = emailForm.querySelector('input[type="email"]');
      var msg = emailForm.querySelector(".form-msg");
      if (!input.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        msg.textContent = "Please enter a valid email."; msg.style.color = "var(--coral)"; return;
      }
      msg.textContent = "Got it. Check your inbox in the next 2 minutes.";
      msg.style.color = "var(--navy)";
      input.value = "";
    });
  }
})();
