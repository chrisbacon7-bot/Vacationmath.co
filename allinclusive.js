/* =====================================================================
   All-Inclusive vs. À-la-Carte Calculator
   ===================================================================== */
(function () {
  "use strict";
  var A = VM_DATA.ALLINC;
  var DESTS = VM_DATA.AI_DESTINATIONS;

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  var drinkMult = { light: 0.4, typical: 1.0, heavy: 1.8 };

  // Map tier key → field on AI_DESTINATIONS
  var TIER_FIELD = { budget: "budget", mid: "mid", luxury: "luxury", ultra: "ultra" };
  var TIER_LABEL = {
    budget: "Budget",
    mid: "Mid-range",
    luxury: "Luxury",
    ultra: "Ultra",
    custom: "Custom rate"
  };
  // Kid discount by tier (preserved from legacy ALLINC.aiTiers); custom inherits mid behavior.
  var KID_DISCOUNT = { budget: 0.50, mid: 0.45, luxury: 0.50, ultra: 0.40, custom: 0.45 };

  function getDestination() {
    var id = $("destination").value;
    for (var i = 0; i < DESTS.length; i++) {
      if (DESTS[i].id === id) return DESTS[i];
    }
    return DESTS[0];
  }

  function populateDestinations() {
    var sel = $("destination");
    var adultsOnly = $("adultsOnly").checked;
    var prev = sel.value;
    sel.innerHTML = "";

    // Build optgroups manually so we can filter
    var groups = {};
    DESTS.forEach(function(d){
      if (adultsOnly && !d.adultsOnly) return;
      (groups[d.region] = groups[d.region] || []).push(d);
    });
    var REGION_LABELS = {
      caribbean_mx: "Caribbean / Mexico (Caribbean side)",
      pacific_mx: "Mexico — Pacific coast",
      caribbean: "Caribbean",
      central_america: "Central America",
      hawaii: "Hawaii"
    };
    var ORDER = ["caribbean_mx","caribbean","pacific_mx","central_america","hawaii"];
    ORDER.forEach(function(r){
      if (!groups[r]) return;
      var og = document.createElement("optgroup");
      og.label = REGION_LABELS[r] || r;
      groups[r].sort(function(a,b){ return a.label.localeCompare(b.label); }).forEach(function(d){
        var o = document.createElement("option");
        o.value = d.id; o.textContent = d.label;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });

    // Restore previous selection if still present, else default
    var hasPrev = false;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === prev) { hasPrev = true; break; }
    }
    if (hasPrev) sel.value = prev;
    else if (sel.options.length > 0) sel.value = sel.options[0].value;
    updateDestNote();
  }

  function updateDestNote() {
    var d = getDestination();
    if (!d) return;
    $("dest-note").textContent = "Best time to go: " + d.bestMonths + (d.adultsOnly ? " · Has adults-only properties." : " · Family-friendly.");
    updateTierNote();
  }

  function updateTierNote() {
    var d = getDestination();
    var note = $("tier-note");
    var customField = $("custom-rate-field");
    var tierKey = $("tier").value;
    if (!d || !note) return;

    if (tierKey === "custom") {
      if (customField) customField.hidden = false;
      note.textContent = "Using your own rate. The math still adds all the line items most travelers forget — excursions, specialty dining, tips, spa.";
      return;
    }
    if (customField) customField.hidden = true;

    var rate = d[TIER_FIELD[tierKey]];
    var brands = (d.brands && d.brands[tierKey]) ? d.brands[tierKey] : "";
    var rateStr = "~$" + rate + "/adult/night";
    if (brands) {
      note.textContent = "Examples in " + d.label.split(",")[0].split(" /")[0] + ": " + brands + ". " + rateStr + ".";
    } else {
      note.textContent = rateStr;
    }
  }

  function calculate() {
    var adults = Math.max(1, parseInt($("adults").value || 2, 10));
    var children = Math.max(0, parseInt($("children").value || 2, 10));
    var infants = Math.max(0, parseInt((($("infants") || {}).value) || 0, 10));
    var nights = Math.max(1, parseInt($("nights").value || 5, 10));
    var tierKey = $("tier").value;
    var drinkKey = $("drinking").value;
    var excursions = Math.max(0, parseInt($("excursions").value || 0, 10));
    var kidsStayFree = !!($("kidsStayFree") && $("kidsStayFree").checked);
    var dest = getDestination();

    // Infants under 3 are free across the board at AI resorts.
    var billable = adults + children;
    var people = adults + children + infants;
    var perAdult;
    if (tierKey === "custom") {
      perAdult = Math.max(50, parseFloat($("customRate").value) || 300);
    } else {
      perAdult = dest[TIER_FIELD[tierKey]];
    }
    var kidsDiscount = kidsStayFree ? 0 : KID_DISCOUNT[tierKey];

    // ---- All-inclusive side ----
    var aiAdults = perAdult * adults * nights;
    var aiKids   = perAdult * kidsDiscount * children * nights;
    var aiBase   = aiAdults + aiKids;
    var aiExcursions = excursions * A.aiHiddenAdditions.excursionPerPerson * billable;
    var aiPremDining = A.aiHiddenAdditions.premiumDining * billable * A.aiHiddenAdditions.premiumDiningNights;
    var aiTipsExtra  = A.aiHiddenAdditions.tipsExtra * (nights / 5);
    var aiSpa        = adults >= 2 ? A.aiHiddenAdditions.spaPerTrip : 75;
    var aiHidden = aiExcursions + aiPremDining + aiTipsExtra + aiSpa;
    var aiTotal  = aiBase + aiHidden;

    // ---- À-la-carte side ----
    // Use the destination's budget tier as the hotel-only baseline (room cost without food)
    // À-la-carte hotel-only rate ~= 55-65% of the equivalent AI-budget tier (food/drink ~35-45% of AI value)
    var alcHotelPerNight = dest.budget * 0.60 * 2; // *2 because dest pricing is per-adult; assume 2 adults share a room
    var alcHotel = alcHotelPerNight * nights;
    var alcBreakfast = A.alc.breakfastPerPerson * billable * nights;
    var alcLunch     = A.alc.lunchPerPerson * billable * nights;
    var alcDinner    = A.alc.dinnerPerPerson * billable * nights;
    var alcDrinksAdult = A.alc.drinksPerAdultDay * drinkMult[drinkKey] * adults * nights;
    var alcDrinksKid   = A.alc.drinksPerKidDay * children * nights;
    var alcSnacks    = A.alc.snacksPerPersonDay * billable * nights;
    var alcTips      = A.alc.tipsPerPersonDay * billable * nights;
    var alcExcursions = excursions * A.alc.excursionPerPerson * billable;
    var alcTaxi      = A.alc.taxiPerDay * nights;
    var alcGroceries = A.alc.groceriesIncidental;
    var alcTotal = alcHotel + alcBreakfast + alcLunch + alcDinner +
                   alcDrinksAdult + alcDrinksKid + alcSnacks + alcTips +
                   alcExcursions + alcTaxi + alcGroceries;

    // ---- Getting there (applies equally to both sides) ----
    var gt = (window.VM_GettingThere && window.VM_GettingThere.compute) ? window.VM_GettingThere.compute() : { mode: "none", amount: 0, label: "" };
    aiTotal  += gt.amount;
    alcTotal += gt.amount;

    var diff = Math.abs(aiTotal - alcTotal);
    var winner = aiTotal <= alcTotal ? "ai" : "alc";
    var winnerLabel = winner === "ai" ? "All-Inclusive" : "À-la-Carte";

    return {
      destination: dest,
      tierLabel: TIER_LABEL[tierKey],
      nights: nights, adults: adults, children: children, infants: infants,
      kidsStayFree: kidsStayFree,
      aiTotal: aiTotal, aiBase: aiBase, aiHidden: aiHidden,
      aiAdults: aiAdults, aiKids: aiKids, aiExcursions: aiExcursions,
      aiPremDining: aiPremDining, aiTipsExtra: aiTipsExtra, aiSpa: aiSpa,
      alcTotal: alcTotal, alcHotel: alcHotel,
      alcFood: alcBreakfast + alcLunch + alcDinner + alcSnacks,
      alcDrinks: alcDrinksAdult + alcDrinksKid,
      alcExcursions: alcExcursions, alcTips: alcTips,
      alcTransport: alcTaxi + alcGroceries,
      gt: gt,
      diff: diff, winner: winner, winnerLabel: winnerLabel
    };
  }

  // Destination-keyed mandatory fees that travelers pay separately (not in the resort rate).
  // Returns null when the destination has nothing additional to disclose.
  function destinationFees(destId, travelers, nights) {
    var QR_VISITAX_PER_PERSON = 15;   // USD; Quintana Roo state tourism tax
    var QR_ENV_PER_NIGHT = 4;         // USD; Cancun municipal environmental fee, ~$4/room/night

    if (destId === "cancun" || destId === "riviera_maya") {
      var visitax = QR_VISITAX_PER_PERSON * Math.max(travelers, 0);
      var enviro = QR_ENV_PER_NIGHT * Math.max(nights, 0);
      var total = visitax + enviro;
      var location = destId === "cancun" ? "Cancun" : "Riviera Maya";
      return {
        heading: "Quintana Roo fees the calculator can't add for you (~" + money(total) + ").",
        body:
          "Two government fees apply to every " + location + " trip and are not collected by your resort. " +
          "<strong>Visitax</strong> is a state tourism tax of $15 per person (" + money(visitax) + " for your party of " + travelers + "), paid online at " +
          "<a href=\"https://www.visitax.gob.mx\" target=\"_blank\" rel=\"noopener\">visitax.gob.mx</a> before you fly. As of June 2026, agents at " +
          "Cancun International scan QR codes at security; travelers without one pay on the spot before boarding. " +
          "<strong>Environmental fee</strong> is ~$4 per room per night (" + money(enviro) + " for " + nights + " night" + (nights === 1 ? "" : "s") + "), " +
          "collected in cash at the front desk, usually in pesos. Both are small, but they're not optional."
      };
    }
    // Other destinations to verify and add later: Bahamas departure tax, Aruba tourism levy, Hawaii TAT/Green Fee, etc.
    return null;
  }

  function render(r) {
    var html = "";

    html += '<div class="result-note" style="margin-top:0"><strong>' + r.destination.label + '.</strong> ' + r.destination.bestMonths + '</div>';

    // Getting There (applied to both sides equally)
    if (r.gt && r.gt.amount > 0) {
      var gtLabel = r.gt.label;
      html += '<div class="result-note" style="margin-top:.6rem"><strong>Getting there: ' + money(r.gt.amount) + '</strong> &mdash; ' + gtLabel + '. Added to both totals below.';
      if (r.gt.mode === "fly" && window.VM_GettingThere) {
        var note = window.VM_GettingThere.flightCoverageNote(r.gt.amount);
        if (note) html += note;
      }
      html += '</div>';
    }

    var billable = r.adults + r.children;
    var people = billable + (r.infants || 0);
    var aiPpd = billable > 0 && r.nights > 0 ? Math.round(r.aiTotal / billable / r.nights) : 0;
    var alcPpd = billable > 0 && r.nights > 0 ? Math.round(r.alcTotal / billable / r.nights) : 0;
    if (r.kidsStayFree && r.children > 0) {
      html += '<div class="benchmark-callout">Kids Stay Free applied &mdash; ' + r.children + ' kid' + (r.children > 1 ? 's' : '') + ' added at $0 lodging. Excursions and off-resort meals still apply.</div>';
    }
    if (r.infants > 0) {
      html += '<div class="benchmark-callout">' + r.infants + ' under 3 stays free &mdash; no resort charge, no excursion fee, no food cost in the totals below.</div>';
    }
    html += '<div class="compare-grid">';
    html += '  <div class="compare-card ' + (r.winner === "ai" ? "winner" : "") + '">';
    html += '    <p class="cc-label">All-Inclusive</p>';
    html += '    <p class="cc-total">' + money(r.aiTotal) + '</p>';
    if (aiPpd > 0) html += '    <p style="color:var(--ink-muted);font-size:.85rem;margin:-.4rem 0 .6rem">' + money(aiPpd) + ' per person per day</p>';
    html += '    <div class="cc-line"><span>Resort (' + r.nights + ' nights, ' + r.tierLabel.split("(")[0].trim() + ')</span><span>' + money(r.aiBase) + '</span></div>';
    html += '    <div class="cc-line"><span>Excursions (AI doesn\'t cover)</span><span>' + money(r.aiExcursions) + '</span></div>';
    html += '    <div class="cc-line"><span>Off-resort meal / specialty dining</span><span>' + money(r.aiPremDining) + '</span></div>';
    html += '    <div class="cc-line"><span>Spa / extras</span><span>' + money(r.aiSpa) + '</span></div>';
    html += '    <div class="cc-line"><span>Customary tips</span><span>' + money(r.aiTipsExtra) + '</span></div>';
    html += '  </div>';
    html += '  <div class="compare-card ' + (r.winner === "alc" ? "winner" : "") + '">';
    html += '    <p class="cc-label">À-la-Carte</p>';
    html += '    <p class="cc-total">' + money(r.alcTotal) + '</p>';
    if (alcPpd > 0) html += '    <p style="color:var(--ink-muted);font-size:.85rem;margin:-.4rem 0 .6rem">' + money(alcPpd) + ' per person per day</p>';
    html += '    <div class="cc-line"><span>Hotel only (' + r.nights + ' nights)</span><span>' + money(r.alcHotel) + '</span></div>';
    html += '    <div class="cc-line"><span>Food (3 meals + snacks)</span><span>' + money(r.alcFood) + '</span></div>';
    html += '    <div class="cc-line"><span>Drinks</span><span>' + money(r.alcDrinks) + '</span></div>';
    html += '    <div class="cc-line"><span>Excursions</span><span>' + money(r.alcExcursions) + '</span></div>';
    html += '    <div class="cc-line"><span>Tips / taxis / incidentals</span><span>' + money(r.alcTips + r.alcTransport) + '</span></div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> These are <em>estimates</em>, not live quotes. They are built from published 2026 resort rates, NerdWallet averages, and Caribbean / Mexico destination research &mdash; then biased to over-count costs and under-count card value. Your real booking will move with season, resort tier, promotions, and how the property prices that week. The honest expectation: your actual total comes in at or below these numbers more often than above them.</div>';

    var vClass = "good";
    var vTitle = r.winnerLabel + " wins by " + money(r.diff) + " in " + r.destination.label.split(",")[0] + ".";
    var vBody;
    if (r.winner === "ai" && r.diff > 800) {
      vBody = "At this tier and party size, all-inclusive is meaningfully cheaper. The math gets even better if you drink a lot, eat a lot, or have teenagers \u2014 those are the variables that blow up à-la-carte budgets.";
    } else if (r.winner === "ai") {
      vBody = "All-inclusive comes out ahead, but barely. If you'd rather eat off-resort, explore towns, and skip the all-day-resort experience, à-la-carte is close enough that the difference isn't worth the constraint.";
    } else if (r.diff > 800) {
      vBody = "À-la-carte wins, and not by a little. At your trip size and drinking style, paying as you go is the smarter move \u2014 especially if you'd otherwise be paying for kids' AI prices they barely use.";
    } else {
      vBody = "À-la-carte edges out, but the gap is close enough that the convenience of an all-inclusive may be worth the small premium. The deciding factor is usually: do you want to make food decisions every day, or not?";
    }
    html += '<div class="verdict ' + vClass + '"><h3>' + vTitle + '</h3><p>' + vBody + '</p></div>';

    html += '<div class="result-note"><strong>What people forget to add to either side.</strong> All-inclusive doesn\'t cover off-property excursions (Tulum, Xcaret, snorkel tours), specialty dining surcharges at some resorts, spa, or customary tips. À-la-carte doesn\'t budget for taxis, bottled water (don\'t drink the tap), 18-20% restaurant tips, or the "let\'s just have one more drink" creep. Both math the same way: be honest about what you\'ll actually do.</div>';

    // Destination-specific government fees the calculator can't roll up into the AI/ALC totals
    var destFees = destinationFees(r.destination.id, billable, r.nights);
    if (destFees) {
      html += '<div class="result-note" style="border-left:4px solid #e6a340;padding-left:1rem;margin-top:1rem"><strong>' + destFees.heading + '</strong> ' + destFees.body + '</div>';
    }
    html += '<div class="freshness-badge">2026 resort pricing &middot; last updated September 2026 &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("allinclusive", typeof r !== "undefined" && r && r.total ? r.total : 0); }
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: Math.min(r.aiTotal, r.alcTotal),
      context: "this trip",
      calcType: "allinclusive"
    });

    var destSel = $("destination");
    var destLabel = destSel && destSel.options[destSel.selectedIndex] ? destSel.options[destSel.selectedIndex].text : "";
    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "allinclusive",
      selection: { destinationId: destSel ? destSel.value : "", destinationLabel: destLabel }
    });

    // ---- AI Live Pricing ----
    var aiContainer = document.getElementById("ai-live-pricing");
    if (aiContainer && typeof VM_AILivePricing !== "undefined") {
      aiContainer.innerHTML = "";
      var destEl = document.getElementById("dest") || document.getElementById("destination");
      var destLabel = destEl ? destEl.options[destEl.selectedIndex].text : "Cancun";
      VM_AILivePricing.render({
        container: aiContainer,
        calc: "allinclusive",
        estimatedTotal: typeof r !== "undefined" ? r.total : 0,
        params: { nights: 7, people: 2, destinationLabel: destLabel }
      });
    }
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("DOMContentLoaded", function () {
    // Init origin picker — 65 airports, ZIP auto-select, flight prefill
    if (window.VM_OriginPicker) {
      VM_OriginPicker.initOnPage({
        destRegion: 'caribbean',
        destLat: 20.97, destLng: -86.92, destName: 'Cancun',
        getPartySize: function(){var a=parseInt((document.getElementById("adults")||{}).value||2,10);var k=parseInt((document.getElementById("children")||{}).value||0,10);return a+k;}
      });
    }

    populateDestinations();
    // default to Cancún
    if (!$("destination").value) $("destination").value = "cancun";
    $("destination").addEventListener("change", updateDestNote);
    $("tier").addEventListener("change", updateTierNote);
    $("adultsOnly").addEventListener("change", populateDestinations);
    updateDestNote();

    var gtContainer = document.getElementById("gt-container");
    if (gtContainer && window.VM_GettingThere) {
      gtContainer.innerHTML = window.VM_GettingThere.buildInputHTML({
        defaultMode: "fly",
        defaultFlightCost: 0
      });
      window.VM_GettingThere.attach(function () { render(calculate()); });
    }

    render(calculate());
  });

  var emailForm = document.querySelector('form[data-source="allinc-calc"]');
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
