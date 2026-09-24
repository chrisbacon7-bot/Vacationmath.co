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
    // Room-only share of an equivalent-tier stay. Food and drink are a large
    // slice of an AI rate, so the à-la-carte hotel is that share × two adults
    // sharing one room — same tier, not a budget hotel vs a luxury AI.
    var ROOM_ONLY_SHARE = { budget: 0.62, mid: 0.58, luxury: 0.55, ultra: 0.50, custom: 0.58 };
    var TRANSFER_PP = 18; // shared shuttle, round trip, per the site's 2026 hidden-fees note

    // ---- All-inclusive side ----
    var aiAdults = perAdult * adults * nights;
    var aiKids   = perAdult * kidsDiscount * children * nights;
    var aiBase   = aiAdults + aiKids;
    var aiExcursions = excursions * A.aiHiddenAdditions.excursionPerPerson * billable;
    var aiPremDining = A.aiHiddenAdditions.premiumDining * billable * A.aiHiddenAdditions.premiumDiningNights;
    var aiTipsExtra  = A.aiHiddenAdditions.tipsExtra * (nights / 5);
    var aiSpa        = adults >= 2 ? A.aiHiddenAdditions.spaPerTrip : 75;
    var aiTransfer   = TRANSFER_PP * billable;
    var aiHidden = aiExcursions + aiPremDining + aiTipsExtra + aiSpa + aiTransfer;
    var aiTotal  = aiBase + aiHidden;

    // ---- À-la-carte side ----
    var roomShare = ROOM_ONLY_SHARE[tierKey] || 0.58;
    var alcHotelPerNight = perAdult * roomShare * 2; // per-adult AI rate → room-only for two sharing
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
    var alcTransfer  = TRANSFER_PP * billable;
    var alcTotal = alcHotel + alcBreakfast + alcLunch + alcDinner +
                   alcDrinksAdult + alcDrinksKid + alcSnacks + alcTips +
                   alcExcursions + alcTaxi + alcGroceries + alcTransfer;

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
      aiPremDining: aiPremDining, aiTipsExtra: aiTipsExtra, aiSpa: aiSpa, aiTransfer: aiTransfer,
      roomShare: roomShare, tierKey: tierKey, perAdult: perAdult,
      alcTotal: alcTotal, alcHotel: alcHotel,
      alcFood: alcBreakfast + alcLunch + alcDinner + alcSnacks,
      alcDrinks: alcDrinksAdult + alcDrinksKid,
      alcExcursions: alcExcursions, alcTips: alcTips, alcTransfer: alcTransfer,
      alcTransport: alcTaxi + alcGroceries,
      gt: gt,
      diff: diff, winner: winner, winnerLabel: winnerLabel
    };
  }

  // Destination-keyed fees the resort rate does not include.
  // Dollar totals are only used where the fee is a published per-person or per-night charge.
  function destinationFees(destId, travelers, nights) {
    var QR_VISITAX_PER_PERSON = 15;
    var QR_ENV_PER_NIGHT = 4;
    var people = Math.max(travelers, 0);
    var stay = Math.max(nights, 0);

    if (destId === "cancun" || destId === "riviera_maya" || destId === "cozumel") {
      var visitax = QR_VISITAX_PER_PERSON * people;
      var place = destId === "cancun" ? "Cancún" : (destId === "cozumel" ? "Cozumel" : "the Riviera Maya");
      var body = "<strong>Visitax</strong> is a Quintana Roo tourism tax of $15 per person (" + money(visitax) + " for your party), paid at <a href=\"https://www.visitax.gob.mx\" target=\"_blank\" rel=\"noopener\">visitax.gob.mx</a> before you fly. Agents at Cancún International check it. It is not in the resort rate.";
      var heading;
      if (destId === "cozumel") {
        heading = "Quintana Roo Visitax the package does not include (" + money(visitax) + ").";
        body += " The Cancún hotel-zone environmental fee does not automatically apply on the island. Ask the folio for any local environmental charge before you treat the package as all-in.";
      } else {
        var enviro = QR_ENV_PER_NIGHT * stay;
        heading = "Quintana Roo fees the package does not include (~" + money(visitax + enviro) + ").";
        body += " <strong>Environmental fee</strong> on the Cancún / Riviera Maya hotel zone is about $4 per room per night (" + money(enviro) + " for " + stay + " night" + (stay === 1 ? "" : "s") + "), usually cash at the desk.";
      }
      return { heading: heading, body: body };
    }

    if (destId === "punta_cana" || destId === "dominican_republic_general") {
      var card = 10 * people;
      return {
        heading: "Dominican tourist card, if the airline did not already collect it (~" + money(card) + ").",
        body: "Many tickets already include the ~$10 per person tourist card. If yours does not, you pay it on arrival. It is not inside the resort rate. Punta Cana packages also still leave excursions, spa, and some motorized water sports off the bill."
      };
    }

    if (destId === "hawaii_maui") {
      return {
        heading: "Hawaii lodging tax is often outside a pre-tax quote.",
        body: "Maui is not a classic all-inclusive market. If the nightly number you are comparing is pre-tax, add Hawaii's transient accommodations tax plus the county surcharge, and check whether a 2026 green fee is on that property. Those charges hit the room-only column and a partial-meal resort the same way. They are not in the calculator total."
      };
    }

    if (destId === "nassau_bahamas") {
      return {
        heading: "Bahamas VAT and resort levies sit outside many package headlines.",
        body: "Departure tax is usually already inside the airline ticket. A resort VAT or nightly levy (often on the order of 10% VAT, sometimes plus a small per-person fee) shows up on the folio when the quote was pre-tax. Confirm the quote says taxes included before you treat either column as final."
      };
    }

    if (destId === "aruba") {
      return {
        heading: "Aruba's environmental sustainability fee is not in the resort rate.",
        body: "Aruba collects a small environmental sustainability fee locally, separate from the package. It is a few dollars per person, not a second hotel bill, and it is still not optional. Departure tax is usually already in the airfare."
      };
    }

    if (destId === "jamaica") {
      return {
        heading: "Jamaica departure tax is usually in the ticket. The package still is not the week.",
        body: "If the airline already collected departure tax, do not add it again. What the resort still leaves off: off-property excursions, some spa treatments, and cash tips even at brands that say gratuities are included. Sandals discourages tipping. Most other Jamaican packages do not."
      };
    }

    if (destId === "barbados" || destId === "antigua") {
      return {
        heading: "Confirm this island is actually all-inclusive before you trust the band.",
        body: "Barbados and Antigua have true all-inclusives (Sandals, and a short list of others) and a long list of room-only luxury hotels that look like the same nightly number. If the quote does not say meals, drinks, and taxes are included, switch the tier to custom and paste the room-only rate. A room-only Sandy Lane night is not an ultra all-inclusive night."
      };
    }

    if (destId === "roatan") {
      return {
        heading: "Roatán packages are thinner than Cancún packages.",
        body: "Several Roatán resorts sell room-plus-breakfast or a meal plan, not unlimited drinks. If the quote is not explicit, use the custom rate and keep the à-la-carte column. A ferry or water-taxi transfer on top of the airport shuttle is common and is not in the $18 shared-shuttle line."
      };
    }

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
    html += '    <div class="cc-line"><span>Airport transfer</span><span>' + money(r.aiTransfer) + '</span></div>';
    html += '    <div class="cc-line"><span>Customary tips</span><span>' + money(r.aiTipsExtra) + '</span></div>';
    html += '  </div>';
    html += '  <div class="compare-card ' + (r.winner === "alc" ? "winner" : "") + '">';
    html += '    <p class="cc-label">À-la-Carte</p>';
    html += '    <p class="cc-total">' + money(r.alcTotal) + '</p>';
    if (alcPpd > 0) html += '    <p style="color:var(--ink-muted);font-size:.85rem;margin:-.4rem 0 .6rem">' + money(alcPpd) + ' per person per day</p>';
    html += '    <div class="cc-line"><span>Hotel only, same tier (' + r.nights + ' nights)</span><span>' + money(r.alcHotel) + '</span></div>';
    html += '    <div class="cc-line"><span>Food (3 meals + snacks)</span><span>' + money(r.alcFood) + '</span></div>';
    html += '    <div class="cc-line"><span>Drinks</span><span>' + money(r.alcDrinks) + '</span></div>';
    html += '    <div class="cc-line"><span>Excursions</span><span>' + money(r.alcExcursions) + '</span></div>';
    html += '    <div class="cc-line"><span>Airport transfer</span><span>' + money(r.alcTransfer) + '</span></div>';
    html += '    <div class="cc-line"><span>Tips / taxis / incidentals</span><span>' + money(r.alcTips + r.alcTransport) + '</span></div>';
    html += '  </div>';
    html += '</div>';

    var sharePct = Math.round((r.roomShare || 0.58) * 100);
    var packagePremium = Math.max(0, r.aiBase - r.alcHotel);
    var paygFoodDrink = r.alcFood + r.alcDrinks;
    var foodGap = paygFoodDrink - packagePremium;
    html += '<div class="result-note"><strong>Package versus paying as you go.</strong> The all-inclusive room-and-meals rate is ' + money(r.aiBase) + '. A same-tier room with no meals is ' + money(r.alcHotel) + ', so the package premium for food and drink is ' + money(packagePremium) + '. Buying those meals and drinks yourself, at the drinking style you picked, is ' + money(paygFoodDrink) + '. ';
    if (foodGap > 0) {
      html += "That food-and-drink gap is " + money(foodGap) + " in the package's favor before excursions, spa, and tips — both columns still pay those.";
    } else {
      html += "Paying as you go for food and drink is " + money(-foodGap) + " less than the package premium. The package is then a convenience, not a discount, unless you would actually eat and drink more than this.";
    }
    html += " Excursions are on both sides because the resort does not include them.</div>";
    html += '<div class="result-note"><strong>What this number means.</strong> The all-inclusive rate used here is about ' + money(r.perAdult) + ' per adult per night before excursions. The à-la-carte hotel is a room-only estimate at the same tier (about ' + sharePct + '% of that rate, for two adults sharing), not a budget room set against a luxury package. Airport transfer is a shared shuttle at about $18 per person round trip on both sides. A private van is often $60–$95 for the vehicle and is not in this number. À-la-carte meals stay at a mid-range restaurant budget.';
    if (r.tierKey === "luxury" || r.tierKey === "ultra") {
      html += ' At this tier, all-inclusive looks more expensive if you would not actually eat and drink at resort prices off-property.';
    }
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
  // The capture form is handled by main.js (submitForm -> POST /subscribe).
  // A local handler used to intercept it here and show a success message
  // without sending anything; removed 2026-08-28.
})();
