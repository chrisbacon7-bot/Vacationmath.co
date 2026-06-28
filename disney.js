/* =====================================================================
   Disney Real-Cost Calculator
   ===================================================================== */
(function () {
  "use strict";
  var D = VM_DATA.DISNEY;

  function $(id) { return document.getElementById(id); }
  function money(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  // ---- Pill buttons ----
  document.querySelectorAll(".wpills").forEach(function(group) {
    group.querySelectorAll(".wpill").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var inputId = group.dataset.input;
        var val = parseInt(this.dataset.val, 10);
        // Update hidden input
        var inp = document.getElementById(inputId);
        if (inp) inp.value = val;
        // Update active state
        group.querySelectorAll(".wpill").forEach(function(b) { b.classList.remove("active"); });
        this.classList.add("active");
        // Live recalc
        updateRunningTotal();
        render(calculate());
      });
    });
  });

  // ---- Toggle add-ons ----
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
      updateRunningTotal();
      render(calculate());
    });
  });

  // ---- Running total bar ----
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
          rtMeta.textContent = parts.join(" · ");
        }
      }
    } catch(e) {}
    // Show bar after first interaction
    if (bar) bar.classList.add("visible");
  }

  // Trigger initial running total on page load
  document.addEventListener("DOMContentLoaded", function() {
    // Init origin picker — 65 airports, ZIP auto-select, flight prefill
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

    // Infants under 3 are free on tickets, dining, LL. Still count for headcount/room.
    var billable = adults + children;          // pays tickets, LL, dining, snacks
    var people = adults + children + infants;  // total party (for headlines)
    var totalTickets = billable;

    // ---- Lodging ----
    var nightlyRate;
    if (resortKey === "custom") {
      nightlyRate = Math.max(0, parseFloat($("customResortRate").value) || 0);
    } else {
      nightlyRate = D.resorts[resortKey][season];
    }
    var lodging = nightlyRate * nights;

    // ---- Tickets (base) ----
    var perTicketBase = D.tickets[season] * parkDays; // base ticket per person across park days
    var adultTickets = perTicketBase * adults;
    var childTickets = (D.tickets[season] - D.childTicketDiscount) * parkDays * children;
    var ticketsBase = adultTickets + childTickets;

    // ---- Park Hopper ----
    var parkHopperOn = $("park-hopper").checked;
    var parkHopper = parkHopperOn ? (D.parkHopperPerTicket * totalTickets) : 0;

    // ---- Lightning Lane ----
    var llOn = $("lightning-lane").checked;
    var lightning = llOn ? (D.lightningLanePerDay * totalTickets * parkDays) : 0;

    // ---- Dining (per family per day, applies all nights) — kids 3-9 count 0.7, infants free ----
    var diningHeads = adults + (children * 0.7);
    var dining = D.dining[diningKey].perDay * nights;
    if (diningHeads !== 4) dining = dining * (diningHeads / 4);

    // ---- Snacks (per person per park day) — infants free ----
    var snacks = D.snacksPerPersonPerDay * billable * parkDays;

    // ---- Add-ons ----
    var memoryMaker = $("memory-maker").checked ? D.memoryMaker : 0;
    var stroller = $("stroller").checked ? (D.strollerPerDay * parkDays * Math.max(1, children)) : 0;
    var airport = $("airport").checked ? D.airportRoundTripFamily : 0;
    var parking = (resortKey === "offsite" || resortKey === "custom") ? (D.parkingPerDay * parkDays) : 0;
    var tips = D.tipsTotal * (nights / 5); // scale roughly with trip length
    var souvenirs = D.souvenirsBudget;

    // ---- Getting there ----
    var gt = (window.VM_GettingThere && window.VM_GettingThere.compute) ? window.VM_GettingThere.compute() : { mode: "none", amount: 0, label: "" };

    // ---- The two big line items (what families price first) ----
    var sticker = lodging + ticketsBase;

    // ---- Hidden total (everything except sticker) ----
    var hidden = parkHopper + lightning + dining + snacks +
                 memoryMaker + stroller + airport + parking + tips + souvenirs + gt.amount;

    var total = sticker + hidden;
    var gap = total - sticker;
    var gapPct = (gap / sticker) * 100;

    var perPersonPerDay = total / Math.max(1, billable) / Math.max(1, nights);

    // Benchmark: family-of-4, 5 nights Pop Century, 5-day tickets ~ $7,400 (MouseHacking Apr 2026)
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

    return {
      sticker: sticker, total: total, gap: gap, gapPct: gapPct, gt: gt,
      people: people, nights: nights, perPersonPerDay: perPersonPerDay,
      adults: adults, children: children, infants: infants,
      benchmark: benchmark,
      lineItems: [
        { label: "Resort (" + nights + " nights, " + resortKey + ", " + season + ")", amount: lodging, kind: "sticker" },
        { label: "Base tickets (" + parkDays + " days × " + totalTickets + " people)", amount: ticketsBase, kind: "sticker" },
        { label: gt.label, amount: gt.amount, kind: "hidden", shown: gt.amount > 0, isFlight: gt.mode === "fly" },
        { label: "Park Hopper", amount: parkHopper, kind: "hidden", shown: parkHopperOn },
        { label: "Lightning Lane Multi Pass (" + parkDays + " days)", amount: lightning, kind: "hidden", shown: llOn },
        { label: "In-park dining (" + D.dining[diningKey].label + ")", amount: dining, kind: "hidden" },
        { label: "Snacks & drinks (" + billable + " people × " + parkDays + " days)", amount: snacks, kind: "hidden" },
        { label: "Memory Maker photos", amount: memoryMaker, kind: "hidden", shown: $("memory-maker").checked },
        { label: "Stroller rental", amount: stroller, kind: "hidden", shown: $("stroller").checked },
        { label: "Airport transport (round trip, ground)", amount: airport, kind: "hidden", shown: $("airport").checked },
        { label: "Theme park parking", amount: parking, kind: "hidden", shown: resortKey === "offsite" },
        { label: "Tips (housekeeping + dining)", amount: tips, kind: "hidden" },
        { label: "Souvenirs (conservative)", amount: souvenirs, kind: "hidden" }
      ].filter(function (x) { return x.shown !== false && x.amount > 0; })
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

    html += '<div class="freshness-badge">2026 pricing data · last updated July 2026 · next refresh August 2026</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> This is an <em>estimate</em>, not a live quote. It is built from published 2026 Disney pricing, NerdWallet averages, and Touring Plans research — then biased to over-count costs and under-count card value. Your real booking price will move with season, resort tier, promotions, and how the parks price tickets that week. The honest expectation: your actual total comes in at or below this number more often than above it.</div>';

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

    // ---- AI Live Pricing ----
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
    // smooth scroll on mobile
    if (window.innerWidth < 900) {
      $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  // Wire the specific-week dropdown to auto-set the season tier.
  // Value format: "<tier>:<slug>" e.g. "high:christmas".
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

  // If user manually changes season tier, reset week picker to custom.
  $("season").addEventListener("change", function () {
    if (weekEl) weekEl.value = "custom";
  });

  // Show/hide custom resort rate field
  function updateResortVisibility() {
    var field = document.getElementById("custom-resort-field");
    if (!field) return;
    field.hidden = $("resort").value !== "custom";
  }
  $("resort").addEventListener("change", updateResortVisibility);
  updateResortVisibility();

  // Inject the Getting There block before first render.
  var gtContainer = document.getElementById("gt-container");
  if (gtContainer && window.VM_GettingThere) {
    gtContainer.innerHTML = window.VM_GettingThere.buildInputHTML({
      defaultMode: "fly",
      defaultFlightCost: 0,
      searchDestination: "Orlando MCO"
    });
    window.VM_GettingThere.attach(function () { render(calculate()); });
  }

  // Auto-calculate on load to show a sensible default
  window.addEventListener("DOMContentLoaded", function () {
    render(calculate());
  });

  // Email form
  var emailForm = document.querySelector('form[data-source="disney-calc"]');
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
      msg.style.color = "var(--navy)";
      input.value = "";
    });
  }
})();
