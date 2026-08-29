/* =====================================================================
   Disney Real-Cost Calculator
   ===================================================================== */
(function () {
  "use strict";
  var D = VM_DATA.DISNEY;

  // Verified Aug 29, 2026 rates — kept here (do not put in calc-data.js).
  // Premier: late-July 2026 band midpoints (WDW Prep / MouseHacking).
  var LL_PREMIER = { "magic-kingdom": 389, "hollywood-studios": 309, "epcot": 209, "animal-kingdom": 159 };
  var LL_MULTI = { low: 20, avg: 27, high: 35 }; // ~$15–$45; mid $27
  var DDP_ADULT = { "qs-plan": 60.47, "table-plan": 98.59 };
  // Adult 1-park-per-day TOTALS before 6.5% FL tax. Never 1-day × N.
  // Low/high: MousePlanet after Oct 8, 2025 increase. Avg: TouringPlans medians where
  // published (1/4/7/10); MagicGuides 6-day avg; else midpoint of MousePlanet range.
  var TICKET_TOTAL = {
    1:  { low: 119, avg: 184, high: 209 },
    2:  { low: 256, avg: 321, high: 386 },
    3:  { low: 384, avg: 476, high: 567 },
    4:  { low: 492, avg: 659, high: 724 },
    5:  { low: 535, avg: 676, high: 816 },
    6:  { low: 564, avg: 786, high: 871 },
    7:  { low: 581, avg: 735, high: 907 },
    8:  { low: 624, avg: 805, high: 940 },
    9:  { low: 639, avg: 840, high: 948 },
    10: { low: 660, avg: 875, high: 970 }
  };
  // Child 3–9: $5 off 1-day (TouringPlans); ~$5–$26 off the whole multi-day ticket, not per day (yourfirstvisit / MagicGuides).
  function childTicketOffset(days) {
    if (days <= 1) return 5;
    var n = Math.round(5 + 2.5 * (days - 1));
    if (n < 5) n = 5;
    if (n > 26) n = 26;
    return n;
  }
  var TICKET_TAX = 0.065;   // Orange County / FL sales tax on park tickets (TouringPlans, PlanDisney)
  var LODGING_TAX = 0.125;  // Orange County 12.5%. All-Star is Osceola 13.5% — not modeled; value defaults to 12.5%.
  var PARK_LABEL = { "magic-kingdom": "Magic Kingdom", "hollywood-studios": "Hollywood Studios", "epcot": "EPCOT", "animal-kingdom": "Animal Kingdom" };

  function $(id) { return document.getElementById(id); }
  function money(n) {
    var s = "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
    return n < 0 ? "\u2212" + s : s;
  }

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
        updateRunningTotal();
        render(calculate());
      });
    });
  });

  document.querySelectorAll(".toggle-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var cbId = this.dataset.checkbox;
      var cb = document.getElementById(cbId);
      if (!cb) return;
      cb.checked = !cb.checked;
      var isOn = cb.checked;
      this.classList.toggle("on", isOn);
      this.setAttribute("aria-checked", isOn ? "true" : "false");
      this.textContent = isOn ? "On" : "Off";
      updatePremierVisibility();
      updateRunningTotal();
      render(calculate());
    });
  });

  function updateRunningTotal() {
    var rtNum = document.getElementById("rt-num");
    var rtMeta = document.getElementById("rt-meta");
    var bar = document.getElementById("running-total-bar");
    if (!rtNum) return;
    try {
      var r = calculate();
      if (r && r.total) {
        rtNum.textContent = money(r.total);
        if (rtMeta) {
          var adults = parseInt((document.getElementById("adults") || {value:2}).value, 10);
          var kids = parseInt((document.getElementById("children") || {value:0}).value, 10);
          var nights = parseInt((document.getElementById("nights") || {value:5}).value, 10);
          var parts = [];
          parts.push(adults + " adult" + (adults !== 1 ? "s" : ""));
          if (kids > 0) parts.push(kids + " kid" + (kids !== 1 ? "s" : ""));
          parts.push(nights + " night" + (nights !== 1 ? "s" : ""));
          rtMeta.textContent = parts.join(" \u00b7 ");
        }
      }
    } catch(e) {}
    if (bar) bar.classList.add("visible");
  }

  document.addEventListener("DOMContentLoaded", function() {
    if (window.VM_OriginPicker) {
      VM_OriginPicker.initOnPage({
        destRegion: 'domestic',
        destLat: 28.38, destLng: -81.56, destName: 'Walt Disney World',
        getPartySize: function(){var a=parseInt((document.getElementById("adults")||{}).value||2,10);var k=parseInt((document.getElementById("children")||{}).value||0,10);return a+k;}
      });
    }
    setTimeout(updateRunningTotal, 300);
  });

  function calculate() {
    var adults = Math.max(1, parseInt($("adults").value || 2, 10));
    var children = Math.max(0, parseInt($("children").value || 2, 10));
    var infants = Math.max(0, parseInt((($("infants") || {}).value) || 0, 10));
    var nights = Math.max(1, parseInt($("nights").value || 5, 10));
    var parkDays = Math.max(0, parseInt($("park-days").value || nights - 1, 10));
    var resortKey = $("resort").value;
    var season = $("season").value;
    var diningKey = $("dining").value;
    var kidsEatFree = ($("kids-eat-free") || { checked: true }).checked;
    var roomPromo = parseInt((($("room-promo") || {}).value) || 0, 10) || 0;
    var premierOn = ($("ll-premier") || { checked: false }).checked;
    var premierPark = (($("ll-premier-park") || {}).value) || "magic-kingdom";
    var premierDaysIn = parseInt((($("ll-premier-days") || {}).value) || 1, 10);
    if (isNaN(premierDaysIn)) premierDaysIn = 1;
    var billable = adults + children;
    var people = adults + children + infants;
    var totalTickets = billable;
    var onsitePackage = (resortKey === "value" || resortKey === "moderate" || resortKey === "deluxe");
    var isPlan = (diningKey === "qs-plan" || diningKey === "table-plan");
    var nightlyRate;
    if (resortKey === "custom" || resortKey === "dvc") {
      nightlyRate = Math.max(0, parseFloat(($("customResortRate") || {}).value) || 0);
    } else {
      nightlyRate = D.resorts[resortKey][season];
    }
    var lodgingGross = nightlyRate * nights;
    var promoPct = (onsitePackage && roomPromo > 0) ? roomPromo : 0;
    var lodgingPretax = lodgingGross * (1 - promoPct / 100);
    var roomDiscount = lodgingGross - lodgingPretax;
    // Custom / DVC nightly is whatever the guest typed — may already include tax, so skip lodging tax there.
    var lodgingTaxRate = (resortKey === "custom" || resortKey === "dvc") ? 0 : LODGING_TAX;
    var lodgingTax = lodgingPretax * lodgingTaxRate;
    var lodging = lodgingPretax + lodgingTax;
    var ladderDays = parkDays < 1 ? 1 : Math.min(10, parkDays);
    var ladder = TICKET_TOTAL[ladderDays] || TICKET_TOTAL[1];
    var adultEach = ladder[season] || ladder.avg;
    var childEach = Math.max(0, adultEach - childTicketOffset(ladderDays));
    var adultTickets = parkDays > 0 ? (adultEach * adults) : 0;
    var childTickets = parkDays > 0 ? (childEach * children) : 0;
    var ticketsPretax = adultTickets + childTickets;
    var perDay = parkDays > 0 ? (adultEach / parkDays) : 0;
    var ticketTax = ticketsPretax * TICKET_TAX;
    var ticketsBase = ticketsPretax + ticketTax;
    var parkHopperOn = $("park-hopper").checked;
    var parkHopperPretax = parkHopperOn ? (D.parkHopperPerTicket * totalTickets) : 0;
    var parkHopper = parkHopperPretax * (1 + TICKET_TAX);
    var llOn = $("lightning-lane").checked;
    var llRate = LL_MULTI[season] || 27;
    var lightningPretax = llOn ? (llRate * totalTickets * parkDays) : 0;
    var lightning = lightningPretax * (1 + TICKET_TAX);
    var premierDays = premierOn ? Math.min(parkDays, Math.max(0, premierDaysIn)) : 0;
    var premierRate = LL_PREMIER[premierPark] || LL_PREMIER["magic-kingdom"];
    var premierPretax = (premierOn && premierDays > 0) ? (premierRate * billable * premierDays) : 0;
    var premier = premierPretax * (1 + TICKET_TAX);
    var diningHeads = adults + (children * 0.7);
    var dining = 0;
    var diningLabel = "";
    if (isPlan && onsitePackage) {
      var adultRate = DDP_ADULT[diningKey];
      var planName = diningKey === "qs-plan" ? "Quick-Service Dining Plan" : "Disney Dining Plan";
      dining = adultRate * adults * nights;
      if (kidsEatFree) {
        diningLabel = planName + " ($" + adultRate.toFixed(2) + "/adult/night; kids 3\u20139 $0 Kids Eat Free)";
      } else {
        dining += (D.dining.typical.perDay / 4) * 0.7 * children * nights;
        diningLabel = planName + " (adults) + typical cash dining (kids; KEF off)";
      }
    } else if (isPlan) {
      dining = D.dining.typical.perDay * nights;
      if (diningHeads !== 4) dining = dining * (diningHeads / 4);
      diningLabel = "In-park dining (typical cash \u2014 dining plans need a Disney resort package)";
    } else {
      dining = D.dining[diningKey].perDay * nights;
      if (diningHeads !== 4) dining = dining * (diningHeads / 4);
      diningLabel = "In-park dining (" + D.dining[diningKey].label + ")";
    }
    var snacks = D.snacksPerPersonPerDay * billable * parkDays;
    var memoryMaker = $("memory-maker").checked ? D.memoryMaker : 0;
    var stroller = $("stroller").checked ? (D.strollerPerDay * parkDays * Math.max(1, children)) : 0;
    var airport = $("airport").checked ? D.airportRoundTripFamily : 0;
    var parking = (resortKey === "offsite" || resortKey === "custom") ? (D.parkingPerDay * parkDays) : 0;
    var tips = D.tipsTotal * (nights / 5);
    var souvenirs = D.souvenirsBudget;
    var gt = (window.VM_GettingThere && window.VM_GettingThere.compute) ? window.VM_GettingThere.compute() : { mode: "none", amount: 0, label: "" };
    var sticker = lodging + ticketsBase;
    var hidden = parkHopper + lightning + premier + dining + snacks + memoryMaker + stroller + airport + parking + tips + souvenirs + gt.amount;
    var total = sticker + hidden;
    var gap = total - sticker;
    var gapPct = (gap / sticker) * 100;
    var perPersonPerDay = total / Math.max(1, billable) / Math.max(1, nights);
    var benchmark = null;
    if (people >= 3) {
      var benchTotal = 7400;
      var diff = total - benchTotal;
      var direction = diff > 0 ? "above" : "below";
      benchmark = {
        text: "Baseline family-of-4 trip (5 nights Pop Century, 5-day tickets) runs about $7,400 (MouseHacking, Apr 2026). Your estimate is " + direction + " that by " + money(Math.abs(diff)) + ".",
        diff: diff
      };
    }
    var premierParkName = PARK_LABEL[premierPark] || premierPark;
    var resortLine = "Resort (" + nights + " nights, " + resortKey + ", " + season + ")";
    return {
      sticker: sticker, total: total, gap: gap, gapPct: gapPct, gt: gt,
      people: people, nights: nights, perPersonPerDay: perPersonPerDay,
      adults: adults, children: children, infants: infants,
      benchmark: benchmark,
      lineItems: [
        { label: resortLine, amount: lodgingGross, kind: "sticker" },
        { label: "Room discount (" + promoPct + "% off on-site lodging)", amount: -roomDiscount, kind: "sticker", shown: promoPct > 0 && roomDiscount > 0 },
        { label: lodgingTaxRate > 0 ? "Florida lodging tax (" + (lodgingTaxRate * 100) + "% on discounted room; All-Star is 13.5%)" : "Florida lodging tax (skipped — custom/DVC rate as entered)", amount: lodgingTax, kind: "sticker", shown: lodgingTax > 0 },
        { label: "Base tickets (" + parkDays + "-day 1-park ladder, $" + Math.round(adultEach) + "/adult \u00d7 " + totalTickets + " people; not 1-day \u00d7 N)", amount: ticketsPretax, kind: "sticker" },
        { label: "Ticket tax (6.5% Florida sales tax)", amount: ticketTax, kind: "sticker", shown: ticketTax > 0 },
        { label: gt.label, amount: gt.amount, kind: "hidden", shown: gt.amount > 0, isFlight: gt.mode === "fly" },
        { label: "Park Hopper ($89/ticket + 6.5% tax)", amount: parkHopper, kind: "hidden", shown: parkHopperOn },
        { label: "Lightning Lane Multi Pass (" + parkDays + " days, $" + llRate + "/person/day + 6.5% tax)", amount: lightning, kind: "hidden", shown: llOn },
        { label: "Lightning Lane Premier Pass (" + premierDays + " day" + (premierDays !== 1 ? "s" : "") + ", " + premierParkName + "; one-park, no hopper benefit; + 6.5% tax)", amount: premier, kind: "hidden", shown: premierOn && premier > 0 },
        { label: diningLabel, amount: dining, kind: "hidden" },
        { label: "Snacks & drinks (" + billable + " people \u00d7 " + parkDays + " days)", amount: snacks, kind: "hidden" },
        { label: "Memory Maker photos", amount: memoryMaker, kind: "hidden", shown: $("memory-maker").checked },
        { label: "Stroller rental", amount: stroller, kind: "hidden", shown: $("stroller").checked },
        { label: "Airport transport (round trip, ground)", amount: airport, kind: "hidden", shown: $("airport").checked },
        { label: "Theme park parking", amount: parking, kind: "hidden", shown: parking > 0 },
        { label: "Tips (housekeeping + dining)", amount: tips, kind: "hidden" },
        { label: "Souvenirs (conservative)", amount: souvenirs, kind: "hidden" }
      ].filter(function (x) { return x.shown !== false && x.amount !== 0; })
    };
  }

  function render(r) {
    var html = "";
    html += '<div class="big-result">';
    html += '  <div class="big-card sticker"><p class="big-label">Resort + tickets</p><p class="big-num">' + money(r.sticker) + '</p></div>';
    html += '  <div class="big-card actual"><p class="big-label">Estimated total</p><p class="big-num">' + money(r.total) + '</p><p class="big-pct">' + money(r.perPersonPerDay) + ' / person / day</p></div>';
    html += '  <div class="big-card gap"><p class="big-label">What people forget to add</p><p class="big-num">+' + money(r.gap) + '</p><p class="big-pct">' + r.gapPct.toFixed(0) + '% on top of room + tickets</p></div>';
    html += '</div>';
    if (r.benchmark) {
      html += '<div class="benchmark-callout">' + r.benchmark.text + '</div>';
    }
    if (r.infants > 0) {
      html += '<div class="benchmark-callout">' + r.infants + ' under 3 enter the parks free &mdash; no ticket, no Lightning Lane, no dining charge. Stroller and gear still cost.</div>';
    }
    html += '<div class="freshness-badge">2026 pricing data \u00b7 last updated September 2026 \u00b7 next refresh October 2026</div>';
    html += '<div class="estimate-note"><strong>About these numbers.</strong> This is an <em>estimate</em>, not a live quote. It is built from published 2026 Disney pricing, NerdWallet averages, and Touring Plans research \u2014 then biased to over-count costs and under-count card value. Your real booking price will move with season, resort tier, promotions, and how the parks price tickets that week. The honest expectation: your actual total comes in at or below this number more often than above it.</div>';
    html += '<h3 class="results-h3">Itemized</h3>';
    html += '<table class="result-table"><thead><tr><th scope="col">Category</th><th scope="col">Cost</th></tr></thead><tbody>';
    r.lineItems.forEach(function (item) {
      html += '<tr class="row-' + item.kind + '">';
      html += '<td>' + item.label + (item.isFlight ? ' <span class="hint" style="display:block;font-size:.8rem;color:var(--ink-muted,#54607a);margin-top:2px">your number</span>' : '') + '</td>';
      html += '<td class="amount">' + money(item.amount) + '</td>';
      html += '</tr>';
      if (item.isFlight && window.VM_GettingThere) {
        var note = window.VM_GettingThere.flightCoverageNote(item.amount);
        if (note) {
          html += '<tr class="row-hint"><td colspan="2" style="padding:0 .5rem .25rem">' + note + '</td></tr>';
        }
      }
    });
    html += '<tr class="row-total"><td>Estimated total</td><td class="amount">' + money(r.total) + '</td></tr>';
    html += '</tbody></table>';
    html += '<div class="result-note"><strong>Why the gap?</strong> When most families budget a Disney trip, they price-shop the two big line items (resort + tickets) and forget the rest. Disney publishes every price in this calculator &mdash; nothing here is hidden. The gap shows up because dining, Lightning Lane, snacks, transport, tips, and photos get added at the park, not at the booking page. Predictable. Mostly avoidable.</div>';
    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") {
      VM_ANALYTICS.calcComplete("disney", r.total, {
        adults: parseInt(($("adults")||{value:2}).value,10),
        nights: parseInt(($("nights")||{value:5}).value,10),
        resort: ($("resort")||{value:"moderate"}).value
      });
    }
    $("email-section").hidden = false;
    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: r.total,
      context: "your Disney trip",
      calcType: "disney"
    });
    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "disney",
      selection: {}
    });
    var aiContainer = document.getElementById("ai-live-pricing");
    if (aiContainer && typeof VM_AILivePricing !== "undefined") {
      aiContainer.innerHTML = "";
      VM_AILivePricing.render({
        container: aiContainer,
        calc: "disney",
        estimatedTotal: r.total,
        params: {
          nights: r.nights || 5,
          people: (r.adults || 2) + (r.kids || 2),
          resortLabel: (function(){
            var t = $("resort-tier"); return t ? t.options[t.selectedIndex].text : "any Disney resort";
          })()
        }
      });
    }
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    var r = calculate();
    updateRunningTotal();
    render(r);
    if (window.innerWidth < 900) {
      $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  var weekEl = $("week");
  if (weekEl) {
    weekEl.addEventListener("change", function () {
      var v = weekEl.value;
      if (v === "custom" || !v) return;
      var tier = v.split(":")[0];
      if (tier === "low" || tier === "avg" || tier === "high") {
        $("season").value = tier;
      }
      render(calculate());
    });
  }

  $("season").addEventListener("change", function () {
    if (weekEl) weekEl.value = "custom";
    render(calculate());
  });

  function updateResortVisibility() {
    var field = document.getElementById("custom-resort-field");
    if (!field) return;
    var k = $("resort").value;
    field.hidden = (k !== "custom" && k !== "dvc");
  }
  function updatePremierVisibility() {
    var wrap = document.getElementById("ll-premier-extras");
    var cb = $("ll-premier");
    if (wrap) wrap.hidden = !(cb && cb.checked);
    var daysEl = $("ll-premier-days");
    var pd = $("park-days");
    if (daysEl && pd) {
      var max = Math.max(0, parseInt(pd.value || 0, 10));
      daysEl.max = max;
      var v = parseInt(daysEl.value || 1, 10);
      if (v > max) daysEl.value = String(max);
    }
  }
  $("resort").addEventListener("change", function () {
    updateResortVisibility();
    render(calculate());
  });
  updateResortVisibility();
  updatePremierVisibility();

  ["dining","room-promo","ll-premier-park","ll-premier-days","nights","park-days","adults","children","infants","customResortRate"].forEach(function (id) {
    var el = $(id);
    if (!el) return;
    el.addEventListener("change", function () {
      updatePremierVisibility();
      updateResortVisibility();
      render(calculate());
    });
  });

  var gtContainer = document.getElementById("gt-container");
  if (gtContainer && window.VM_GettingThere) {
    gtContainer.innerHTML = window.VM_GettingThere.buildInputHTML({
      defaultMode: "fly",
      defaultFlightCost: 0,
      searchDestination: "Orlando MCO"
    });
    window.VM_GettingThere.attach(function () { render(calculate()); });
  }

  window.addEventListener("DOMContentLoaded", function () {
    updatePremierVisibility();
    updateResortVisibility();
    render(calculate());
  });
})();
