/* =====================================================================
   Vacation Funding Plan calculator
   Presets use the same 2026 planning bands already published on the
   Disney, cruise, and all-inclusive pages. They are not a second price.
   ===================================================================== */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  // Blended earn rate when a household actually puts groceries, gas, dining,
  // and other discretionary on a thoughtful rewards card. ~1.6 cents/dollar
  // is the realistic NerdWallet/TPG-valued return across mid-tier cards.
  var BLENDED_CPP = 0.016;

  var PRESETS = {
    disney: {
      target: 7500,
      months: 9,
      note: "Disney savings plan for a party of 4, 5 nights, moderate resort. $7,500 is the 2026 planning band published on the Disney calculator (about $6,800–$9,400). Open that page to itemize resort, tickets, and food — this preset does not invent a second price.",
      bridges: [
        { href: "/disney?vm_adults=2&vm_children=2&vm_nights=5&vm_park-days=4&vm_resort=moderate", label: "Itemize this Disney trip" },
        { href: "/plan?dest=disney", label: "Open Disney in Trip Plan" }
      ]
    },
    cruise: {
      target: 2800,
      months: 6,
      note: "Cruise sinking fund for a couple, 7 nights. The cruise page’s published floor is about $1,400 per person all-in when the ad is a $799 fare. $2,800 is that floor for two, not a live quote. Open Cruise to add drinks, Wi-Fi, and excursions.",
      bridges: [
        { href: "/cruise?vm_adults=2&vm_nights=7", label: "Itemize this cruise" },
        { href: "/plan?dest=cruise", label: "Open the cruise in Trip Plan" }
      ]
    },
    ai: {
      target: 7000,
      months: 9,
      note: "All-inclusive savings plan for a family of 4 on a Cancún-shaped week. About $7,000 all-in is the band published on the all-inclusive page. Open that calculator for package versus paying as you go.",
      bridges: [
        { href: "/allinclusive?vm_destination=cancun&vm_adults=2&vm_children=2&vm_nights=7", label: "Itemize Cancún all-inclusive" },
        { href: "/plan?dest=cancun", label: "Open Cancún in Trip Plan" }
      ]
    },
    sinking: {
      target: 6000,
      months: 12,
      note: "A trip sinking fund: one cash number you refill every month, not tied to a resort quote. Price the real trip in Trip Plan, then paste that total into the target.",
      bridges: [
        { href: "/plan", label: "Price a trip in Trip Plan" },
        { href: "/budget", label: "What can we afford?" }
      ]
    }
  };

  function earnRate() {
    var raw = $("earn") ? parseFloat($("earn").value) : 1.6;
    if (!isFinite(raw) || raw < 0) return BLENDED_CPP;
    return raw / 100;
  }

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
    var cpp = earnRate();

    var monthlySpend = groceries + gas + dining + other;
    var appliedSignup = cpp === 0 ? 0 : signupCash;
    var pointsCashValue = monthlySpend * cpp * months;
    var totalFromCard = pointsCashValue + appliedSignup;

    var gap = target - saved - totalFromCard;
    var cashNeeded = Math.max(0, gap);
    var monthlyTarget = cashNeeded / months;
    var weeklyTarget = monthlyTarget / 4.333;
    var dailyTarget = monthlyTarget / 30;

    var sustainable = income * 0.08;

    var status;
    if (income <= 0) status = "neutral";
    else if (monthlyTarget <= sustainable) status = "easy";
    else if (monthlyTarget <= sustainable * 1.5) status = "stretch";
    else status = "hard";

    function scenario(rate, includeSignup) {
      var pts = monthlySpend * rate * months;
      var bonus = includeSignup ? signupCash : 0;
      var cash = Math.max(0, target - saved - pts - bonus);
      return {
        pts: pts,
        bonus: bonus,
        cash: cash,
        monthly: cash / months,
        weekly: (cash / months) / 4.333
      };
    }

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
      signupCash: appliedSignup,
      totalFromCard: totalFromCard,
      pointsCoverage: target > 0 ? (totalFromCard / target) * 100 : 0,
      sustainable: sustainable,
      status: status,
      monthlySpend: monthlySpend,
      cpp: cpp,
      preset: ($("preset") && $("preset").value) || "",
      scenarios: [
        { key: "cash", label: "Cash only (trip sinking fund)", active: cpp === 0, row: scenario(0, false) },
        { key: "blend", label: "1.6¢ on spend you already make", active: Math.abs(cpp - BLENDED_CPP) < 0.00001 && signupCash === 0, row: scenario(BLENDED_CPP, false) },
        { key: "bonus", label: "1.6¢ plus the signup you typed", active: Math.abs(cpp - BLENDED_CPP) < 0.00001 && signupCash > 0, row: scenario(BLENDED_CPP, true) },
        { key: "two", label: "Scenario: 2¢ on that same spend" + (signupCash > 0 ? ", plus the signup" : ""), active: Math.abs(cpp - 0.02) < 0.00001, row: scenario(0.02, signupCash > 0) }
      ]
    };
  }

  function statusCopy(r) {
    if (r.status === "easy") {
      return "<strong>This monthly target fits the 8% guideline.</strong> Move " + money(r.monthlyTarget) + " the day after payday (" + money(r.weeklyTarget) + " a week). The timeline below is that transfer, not a new trip price.";
    }
    if (r.status === "stretch") {
      return "<strong>Stretch zone.</strong> " + money(r.monthlyTarget) + "/month is above the 8% sustainable rate (" + money(r.sustainable) + "). Extend the timeline, lower the trip, or move a signup earlier. Do not put the gap on a card.";
    }
    if (r.status === "hard") {
      return "<strong>Math says: stretch the timeline.</strong> At " + money(r.monthlyTarget) + "/month you'd be setting aside more than 12% of take-home. Add months, or cut the trip by about " + money((r.monthlyTarget - r.sustainable) * r.months) + ".";
    }
    return "<strong>Add your income</strong> for a sustainability check against the 8% guideline.";
  }

  function timelineRows(r) {
    var rows = [];
    var i;
    for (i = 1; i <= r.months; i++) {
      var cash = r.cashNeeded * (i / r.months);
      var pts = r.totalFromCard * (i / r.months);
      rows.push({
        month: i,
        cash: cash,
        pts: pts,
        funded: r.saved + cash + pts
      });
    }
    return rows;
  }

  function timelineSvg(r, rows) {
    var w = 560;
    var h = 148;
    var pad = 8;
    var n = Math.max(1, rows.length);
    var gap = n > 18 ? 1 : 3;
    var bw = Math.max(2, (w - pad * 2 - gap * (n - 1)) / n);
    var max = Math.max(r.target, rows.length ? rows[rows.length - 1].funded : r.target, 1);
    var inner = h - 22;
    var parts = "";
    var i;
    for (i = 0; i < n; i++) {
      var bh = Math.max(1, Math.round((rows[i].funded / max) * inner));
      var x = pad + i * (bw + gap);
      var y = 8 + inner - bh;
      parts += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + bw.toFixed(1) + '" height="' + bh + '" fill="#1e3a5f"><title>Month ' + rows[i].month + ": " + money(rows[i].funded) + " funded</title></rect>";
    }
    var ty = 8 + inner - Math.round((r.target / max) * inner);
    parts += '<line x1="' + pad + '" x2="' + (w - pad) + '" y1="' + ty + '" y2="' + ty + '" stroke="#e6a340" stroke-width="2" stroke-dasharray="4 3"><title>Target ' + money(r.target) + "</title></line>";
    return '<svg class="fund-chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Month by month, cumulative cash plus points versus the trip target">' + parts + "</svg>";
  }

  function tableMonths(rows) {
    if (rows.length <= 12) return rows;
    var mid = rows[Math.ceil(rows.length / 2) - 1];
    return [rows[0], mid, rows[rows.length - 1]];
  }

  function bridgesFor(preset) {
    var p = PRESETS[preset];
    var links = (p && p.bridges) ? p.bridges.slice() : [
      { href: "/plan", label: "Price the trip in Trip Plan" }
    ];
    links.push({ href: "/points", label: "Check the points offset" });
    return links;
  }

  function render(r) {
    var rows = timelineRows(r);
    var html = "";
    var cents = (r.cpp * 100).toFixed(1).replace(/\.0$/, "");

    html += '<div class="big-result">';
    html += '  <div class="big-card sticker"><p class="big-label">Save per month</p><p class="big-num">' + money(r.monthlyTarget) + '</p><p class="big-pct">cash, after points</p></div>';
    html += '  <div class="big-card actual"><p class="big-label">Save per week</p><p class="big-num">' + money(r.weeklyTarget) + '</p><p class="big-pct">~' + money(r.dailyTarget) + "/day</p></div>";
    html += '  <div class="big-card gap"><p class="big-label">Points offset</p><p class="big-num">' + money(r.totalFromCard) + '</p><p class="big-pct">' + r.pointsCoverage.toFixed(0) + "% of the trip</p></div>";
    html += "</div>";

    html += '<div class="result-note">' + statusCopy(r) + "</div>";

    html += '<h3 class="results-h3">Savings timeline</h3>';
    html += '<p class="hint">Each bar is cumulative cash saved plus the points offset. The gold line is the trip target. Already-saved cash is in every bar.</p>';
    html += timelineSvg(r, rows);
    html += '<table class="result-table"><thead><tr><th scope="col">Month</th><th scope="col">Cash saved</th><th scope="col">Points accrued</th><th scope="col">Funded</th></tr></thead><tbody>';
    tableMonths(rows).forEach(function (row) {
      html += "<tr><td>Month " + row.month + "</td><td class=\"amount\">" + money(row.cash) + "</td><td class=\"amount\">" + money(row.pts) + "</td><td class=\"amount\">" + money(row.funded) + "</td></tr>";
    });
    html += "</tbody></table>";
    if (rows.length > 12) {
      html += '<p class="hint">Table shows the first month, the midpoint, and the last month. The chart includes all ' + rows.length + " months.</p>";
    }

    html += '<h3 class="results-h3">The math</h3>';
    html += '<table class="result-table"><thead><tr><th scope="col">Component</th><th scope="col">Amount</th></tr></thead><tbody>';
    html += '<tr class="row-sticker"><td>Target trip cost</td><td class="amount">' + money(r.target) + "</td></tr>";
    html += '<tr class="row-hidden"><td>Already saved</td><td class="amount">&minus;' + money(r.saved) + "</td></tr>";
    html += '<tr class="row-hidden"><td>Points from normal spend (' + money(r.monthlySpend) + "/mo × " + r.months + " mos × " + cents + '&cent;/$)</td><td class="amount">&minus;' + money(r.pointsCashValue) + "</td></tr>";
    if (r.signupCash > 0) {
      html += '<tr class="row-hidden"><td>Signup bonus cash value</td><td class="amount">&minus;' + money(r.signupCash) + "</td></tr>";
    }
    html += '<tr class="row-total"><td>Cash still needed</td><td class="amount">' + money(r.cashNeeded) + "</td></tr>";
    html += "</tbody></table>";

    html += '<h3 class="results-h3">Points-offset scenarios</h3>';
    html += '<p class="hint">Same trip and the same grocery, gas, dining, and other spend. The highlighted row is the one driving the monthly and weekly targets. 2¢ is a scenario, not a promise that a card earns it.</p>';
    html += '<table class="result-table"><thead><tr><th scope="col">Scenario</th><th scope="col">Monthly cash</th><th scope="col">Weekly cash</th></tr></thead><tbody>';
    r.scenarios.forEach(function (s) {
      html += '<tr' + (s.active ? ' class="row-total"' : "") + "><td>" + s.label + "</td><td class=\"amount\">" + money(s.row.monthly) + "</td><td class=\"amount\">" + money(s.row.weekly) + "</td></tr>";
    });
    html += "</tbody></table>";

    html += '<h3 class="results-h3">Where to price the trip</h3>';
    html += '<ul class="fund-bridges">';
    bridgesFor(r.preset).forEach(function (b) {
      html += '<li><a href="' + b.href + '">' + b.label + "</a></li>";
    });
    html += "</ul>";

    html += '<div class="fund-actions">';
    html += '<button type="button" class="vm-tool-btn" id="fund-share">Copy savings link</button>';
    html += '<button type="button" class="vm-tool-btn" id="fund-print">Print plan</button>';
    html += '<p class="vm-tool-status" id="fund-share-status" aria-live="polite"></p>';
    html += "</div>";

    html += '<div class="result-note"><strong>What to move this week.</strong> ' + money(r.weeklyTarget) + " cash. Miss a week and you still owe it — add it to a later week. Points use the rate you selected on spend you already listed. A sign-up bonus is included only if you typed one.</div>";
    html += '<div class="freshness-badge">Blended default 1.6&cent;/$ &middot; preset totals match the 2026 Disney, cruise, and all-inclusive bands &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("funding", r.target || 0); }
    if ($("email-section")) $("email-section").hidden = false;

    if (window.VM_CardCTA) {
      VM_CardCTA.render({
        container: document.getElementById("card-cta"),
        tripTotal: r.target || 5000,
        context: "the trip you're funding",
        calcType: "funding"
      });
    }
  }

  function shareUrl() {
    var params = new URLSearchParams(location.search);
    Array.prototype.slice.call(params.keys()).forEach(function (k) {
      if (k.indexOf("vm_") === 0) params.delete(k);
    });
    document.querySelectorAll(".calc-inputs input, .calc-inputs select, .calc-inputs textarea").forEach(function (el) {
      if (!el.id) return;
      var type = (el.type || "").toLowerCase();
      if (type === "email" || type === "button" || type === "submit") return;
      params.set("vm_" + el.id, el.value);
    });
    var next = location.pathname + "?" + params.toString();
    history.replaceState(null, "", next);
    return location.origin + next;
  }

  function copyText(text, statusEl) {
    function ok() { if (statusEl) statusEl.textContent = "Savings link copied."; }
    function fail() { if (statusEl) statusEl.textContent = "Copy failed — copy the address bar."; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, fail);
    } else {
      fail();
    }
  }

  function markPreset(key) {
    document.querySelectorAll(".fund-preset").forEach(function (b) {
      var on = b.getAttribute("data-preset") === key;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var note = $("preset-note");
    if (note && PRESETS[key]) note.textContent = PRESETS[key].note;
  }

  function applyPreset(key) {
    var p = PRESETS[key];
    if (!p || !$("target") || !$("months")) return;
    if ($("preset")) $("preset").value = key;
    $("target").value = String(p.target);
    $("months").value = String(p.months);
    markPreset(key);
    render(calculate());
  }

  document.querySelectorAll(".fund-preset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyPreset(btn.getAttribute("data-preset"));
    });
  });

  var results = $("results");
  if (results) {
    results.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      if (btn.id === "fund-share") {
        copyText(shareUrl(), $("fund-share-status"));
      } else if (btn.id === "fund-print") {
        shareUrl();
        window.print();
      }
    });
  }

  var go = $("calculate");
  if (go) {
    go.addEventListener("click", function (e) {
      e.preventDefault();
      render(calculate());
      if (window.innerWidth < 900 && $("results")) {
        $("results").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    if (window.VM_OriginPicker) {
      VM_OriginPicker.initOnPage({
        destRegion: "domestic",
        destLat: 28.38, destLng: -81.56, destName: "your destination",
        getPartySize: function () { return 2; }
      });
    }

    var qs = new URLSearchParams(location.search);
    var preset = qs.get("preset");
    if (preset && PRESETS[preset] && !qs.get("vm_target")) {
      applyPreset(preset);
    } else {
      markPreset(($("preset") && $("preset").value) || "");
      render(calculate());
    }
  });
})();
