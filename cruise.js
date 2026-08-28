/* =====================================================================
   Cruise Real-Cost Calculator
   ===================================================================== */
(function () {
  "use strict";
  var C = VM_DATA.CRUISE;
  var LINES = VM_DATA.CRUISE_LINES_EXPANDED;
  var PORTS = VM_DATA.CRUISE_PORTS;

  function $(id) { return document.getElementById(id); }

  // ---- Pill buttons ----
  document.querySelectorAll(".wpills").forEach(function(group) {
    group.querySelectorAll(".wpill").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var inputId = group.dataset.input;
        var val = parseInt(this.dataset.val, 10);
        var inp = document.getElementById(inputId);
        if (inp) { inp.value = val; inp.dispatchEvent(new Event("change")); }
        group.querySelectorAll(".wpill").forEach(function(b) { b.classList.remove("active"); });
        this.classList.add("active");
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
        rtNum.textContent = "$" + Math.round(r.total).toLocaleString("en-US");
        if (rtMeta) {
          var adults = parseInt(($("adults") || {value:2}).value, 10);
          var nights = parseInt(($("nights") || {value:7}).value, 10);
          rtMeta.textContent = adults + " adult" + (adults !== 1 ? "s" : "") + " · " + nights + " nights";
        }
      }
    } catch(e) {}
    if (bar) bar.classList.add("visible");
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Init origin picker — 65 airports, ZIP auto-select, flight prefill
    if (window.VM_OriginPicker) {
      VM_OriginPicker.initOnPage({
        destRegion: 'caribbean',
        destLat: 25.77, destLng: -80.19, destName: 'Miami cruise port',
        getPartySize: function(){var a=parseInt((document.getElementById("adults")||{}).value||2,10);var k=parseInt((document.getElementById("kids")||{}).value||0,10);return a+k;}
      });
    }

    setTimeout(updateRunningTotal, 400);
  });
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function num(id, def) {
    var v = parseFloat($(id).value);
    return (isNaN(v) || v < 0) ? def : v;
  }

  // Fallback drink package pricing by tier when a specific line isn't in the legacy map.
  // Built from CruiseCritic/Royal Caribbean Blog/Cruise.blog August 2026 industry averages.
  var DRINK_PKG_BY_TIER = {
    value:         { unlimited: 70,  soda: 12 },
    mainstream:    { unlimited: 90,  soda: 13 },
    premium:       { unlimited: 75,  soda: 13 },  // Princess Plus/Celebrity Always Included often bundled
    upper_premium: { unlimited: 0,   soda: 0 },   // Oceania/Cunard/Azamara — beverages typically included or à-la-carte
    luxury:        { unlimited: 0,   soda: 0 },   // Viking — beer/wine included with lunch & dinner
    ultra_luxury:  { unlimited: 0,   soda: 0 },   // Regent/Silversea — fully all-inclusive
    specialty:     { unlimited: 60,  soda: 11 }
  };

  function pkgForLine(lineId) {
    // Prefer the per-line legacy map (which is well-researched for the original 6 lines)
    var legacyMap = {
      msc:"msc", carnival:"carnival", royal_caribbean:"royal", ncl:"ncl",
      princess:"princess", disney:"disney"
    };
    var legacyKey = legacyMap[lineId];
    if (legacyKey && C.drinkPackagePerLine[legacyKey]) {
      return C.drinkPackagePerLine[legacyKey];
    }
    var line = LINES[lineId];
    if (!line) return { unlimited: 0, soda: 0 };
    return DRINK_PKG_BY_TIER[line.tier] || { unlimited: 0, soda: 0 };
  }

  // Auto-gratuity behavior: lines like Regent, Silversea, Azamara, Virgin Voyages include gratuities.
  // gratuityPerDay = 0 in the data => already included in fare; checkbox state irrelevant.
  // Lines with structural kids-sail-free programs (3rd/4th guest free)
  function lineSupportsKidsFree(lineId) {
    return lineId === "msc";
  }
  // Lines that run a frequent "Free at Sea" or similar bundled-extras promo
  function lineSupportsFreeAtSea(lineId) {
    return lineId === "ncl";
  }
  function kidsFreeToggleOn() {
    var el = document.getElementById("kids-free");
    return !!(el && el.checked && !el.closest("[hidden]"));
  }
  function nclFasToggleOn() {
    var el = document.getElementById("ncl-fas");
    return !!(el && el.checked && !el.closest("[hidden]"));
  }

  // Per-adult, per-day pay-as-you-go cost given current drink mix.
  function drinkMixCost() {
    var menu = C.drinkMenu;
    var g = 1 + C.drinkGratuityPct;
    var cocktail = num("d-cocktail", 0);
    var beer = num("d-beer", 0);
    var wine = num("d-wine", 0);
    var soda = num("d-soda", 0);
    var coffee = num("d-coffee", 0);
    var water = num("d-water", 0);

    var alcoholPerAdultDay = (cocktail * menu.cocktail.price + beer * menu.beer.price + wine * menu.wineGlass.price) * g;
    var nonAlcPerAdultDay = (soda * menu.soda.price + coffee * menu.coffeeSpec.price + water * menu.bottledH2O.price) * g;
    var totalPerAdultDay = alcoholPerAdultDay + nonAlcPerAdultDay;

    return {
      alcoholPerAdultDay: alcoholPerAdultDay,
      nonAlcPerAdultDay: nonAlcPerAdultDay,
      totalPerAdultDay: totalPerAdultDay,
      alcoholCount: cocktail + beer + wine,
      nonAlcCount: soda + coffee + water
    };
  }

  function calculate() {
    var lineKey = $("line").value;
    var isCustom = lineKey === "custom";
    var line = LINES[lineKey];
    if (!line && !isCustom) {
      // Defensive fallback if the select hasn't populated yet
      lineKey = "royal_caribbean";
      line = LINES[lineKey];
    }
    var nights = Math.max(3, parseInt($("nights").value || 7, 10));
    var adults = Math.max(1, parseInt($("adults").value || 2, 10));
    var children = Math.max(0, parseInt($("children").value || 0, 10));
    var infants = Math.max(0, parseInt((($("infants") || {}).value) || 0, 10));
    var cabin = $("cabin").value;
    var season = $("season-c").value;
    var drinkKey = $("drinks").value;
    var excursions = Math.max(0, parseInt($("excursions").value || 0, 10));

    // Map season key to expanded-data field
    var seasonField = season === "perPersonLow" ? "perPersonLow"
                     : season === "perPersonHigh" ? "perPersonHigh"
                     : "perPersonAvg";

    // For custom lines, build a synthetic line record so the rest of the math just works.
    if (isCustom) {
      var customFare = Math.max(99, parseFloat($("customFare").value) || 650);
      line = {
        label: "Custom fare",
        tier: "mainstream",
        perPersonLow: customFare * 0.75,
        perPersonAvg: customFare,
        perPersonHigh: customFare * 1.35,
        gratuityPerDay: 18,
        note: "Custom fare entered by user. Gratuity defaults to industry-standard $18/day — toggle off if your line includes it or you tip separately."
      };
    }

    // Scale per-person fare to 7-night baseline -> requested nights
    var perPersonFare = line[seasonField] * (nights / 7);
    var cabinUp = C.cabinUpgrade[cabin];

    // Kids-sail-free: only applies if the line supports it AND the user has confirmed via toggle.
    var paidPeople;
    var freeKids = 0;
    if (lineSupportsKidsFree(lineKey) && children > 0 && kidsFreeToggleOn()) {
      freeKids = Math.min(children, 2);
      paidPeople = adults + (children - freeKids);
    } else {
      paidPeople = adults + children;
    }
    var totalPeople = adults + children;

    // ---- Fare ----
    var fareSticker = (perPersonFare + cabinUp) * paidPeople;

    // ---- Gratuities ----
    var gratOn = $("gratuities").checked;
    var gratPerDay = line.gratuityPerDay || 0; // 0 means included in fare
    var gratIncluded = gratPerDay === 0;
    var gratuities = (gratOn && !gratIncluded) ? (gratPerDay * nights * totalPeople) : 0;

    // ---- Drinks ----
    var mix = drinkMixCost();
    var linePkg = pkgForLine(lineKey);
    var pkgUnlimitedPerDay = linePkg.unlimited;
    var pkgSodaPerDay = linePkg.soda;
    var drinks = 0;
    var drinkLabel = "";
    var drinksIncluded = false;

    // Luxury/ultra lines include beverages — explain that and skip the drink charge
    if (pkgUnlimitedPerDay === 0 && (line.tier === "luxury" || line.tier === "ultra_luxury" || line.tier === "upper_premium")) {
      drinks = 0;
      drinkLabel = "Beverages included with fare";
      drinksIncluded = true;
    } else if (drinkKey === "unlimited") {
      var adultPkg = pkgUnlimitedPerDay * adults * nights;
      var kidSoda = pkgSodaPerDay * children * nights;
      drinks = adultPkg + kidSoda;
      drinkLabel = "Unlimited package (adults) + soda for kids";
    } else if (drinkKey === "soda") {
      drinks = pkgSodaPerDay * totalPeople * nights;
      drinkLabel = "Non-alcoholic package, " + totalPeople + " people";
    } else {
      var adultDay = mix.totalPerAdultDay;
      var childDay = mix.nonAlcPerAdultDay;
      drinks = (adultDay * adults + childDay * children) * nights;
      drinkLabel = "Pay as you go (your daily drink mix)";
    }

    // ---- Wi-Fi ----
    var wifi = $("wifi").checked ? (C.wifiPerDay * nights) : 0;

    // ---- Excursions ----
    var excursionCost = C.excursionPerPersonPerPort * excursions * totalPeople;

    // ---- Specialty dining ----
    var specialty = $("specialty").checked ? (C.specialtyDiningPerMeal * adults * 2) : 0;

    // ---- Photo / hotel / parking / fees ----
    var photos = $("photos").checked ? C.photoPackage : 0;
    var preCruise = $("hotel").checked ? C.preCruiseHotel : 0;
    var parking = $("parking").checked ? (C.parkingAtPort * (nights + 1)) : 0;
    var portFees = C.portFeesPerPerson * totalPeople;

    // ---- Getting there ----
    var gt = (window.VM_GettingThere && window.VM_GettingThere.compute) ? window.VM_GettingThere.compute() : { mode: "none", amount: 0, label: "" };

    // NCL Free at Sea — bundled extras (drinks, Wi-Fi, some specialty) push hidden
    // "service charges" of roughly $28/pp/day on top of fare. Per NCL published promo terms.
    var nclFas = 0;
    if (lineSupportsFreeAtSea(lineKey) && nclFasToggleOn()) {
      nclFas = 28 * adults * nights;
      // If FAS is on, the drink package decision is already covered — zero out drinks
      drinks = 0;
      drinkLabel = "Free at Sea included (service charge counted separately)";
    }

    var sticker = fareSticker;
    var hidden = gratuities + drinks + wifi + excursionCost + specialty +
                 photos + preCruise + parking + portFees + gt.amount + nclFas;
    var total = sticker + hidden;
    var gap = total - sticker;
    var gapPct = (gap / sticker) * 100;

    // ---- Break-even analysis ----
    var avgAlcoholPrice = (C.drinkMenu.cocktail.price + C.drinkMenu.beer.price + C.drinkMenu.wineGlass.price) / 3;
    var avgAlcoholWithGrat = avgAlcoholPrice * (1 + C.drinkGratuityPct);
    var breakEvenDrinks = pkgUnlimitedPerDay > 0
      ? Math.ceil(pkgUnlimitedPerDay / avgAlcoholWithGrat)
      : null;
    var dailyPayCost = mix.totalPerAdultDay;
    var tripPay = dailyPayCost * adults * nights;
    var tripPkg = (pkgUnlimitedPerDay * adults + pkgSodaPerDay * children) * nights;
    var savings = tripPay - tripPkg;
    var verdict;
    if (pkgUnlimitedPerDay === 0) {
      verdict = drinksIncluded ? "included" : "na";
    } else if (savings > 100) {
      verdict = "buy";
    } else if (savings < -100) {
      verdict = "skip";
    } else {
      verdict = "close";
    }

    // ---- Port info (optional) ----
    var portKey = $("port") ? $("port").value : "";
    var portInfo = null;
    if (portKey) {
      for (var i = 0; i < PORTS.length; i++) {
        if (PORTS[i].id === portKey) { portInfo = PORTS[i]; break; }
      }
    }

    var people = adults + children + infants;
    var billablePeople = adults + children;
    var perPersonPerDay = total / Math.max(1, billablePeople) / Math.max(1, nights);

    return {
      lineKey: lineKey,
      lineLabel: line.label,
      lineNote: line.note,
      sticker: sticker,
      total: total,
      gap: gap,
      gapPct: gapPct,
      adults: adults,
      children: children,
      infants: infants,
      nights: nights,
      people: people,
      perPersonPerDay: perPersonPerDay,
      freeKids: freeKids,
      nclFas: nclFas,
      gratIncluded: gratIncluded,
      portInfo: portInfo,
      drinkBE: {
        pkgUnlimitedPerDay: pkgUnlimitedPerDay,
        pkgSodaPerDay: pkgSodaPerDay,
        dailyPayCost: dailyPayCost,
        breakEvenDrinks: breakEvenDrinks,
        avgAlcoholWithGrat: avgAlcoholWithGrat,
        tripPay: tripPay,
        tripPkg: tripPkg,
        savings: savings,
        verdict: verdict,
        alcoholCount: mix.alcoholCount,
        nonAlcCount: mix.nonAlcCount,
        adults: adults,
        children: children,
        nights: nights
      },
      gt: gt,
      lineItems: [
        { label: "Base fare (" + line.label + ", " + cabin + ", " + nights + " nts × " + paidPeople + " paying)", amount: fareSticker, kind: "sticker" },
        { label: gt.label, amount: gt.amount, kind: "hidden", shown: gt.amount > 0, isFlight: gt.mode === "fly" },
        { label: gratIncluded
            ? "Auto-gratuities — included in fare"
            : "Auto-gratuities ($" + gratPerDay + "/day × " + totalPeople + " × " + nights + " nts)",
          amount: gratuities, kind: "hidden", shown: gratOn && !gratIncluded },
        { label: "Drinks &mdash; " + drinkLabel, amount: drinks, kind: "hidden", shown: drinks > 0 },
        { label: "Wi-Fi (" + nights + " nights)", amount: wifi, kind: "hidden", shown: $("wifi").checked },
        { label: "Shore excursions (" + excursions + " ports × " + totalPeople + " people)", amount: excursionCost, kind: "hidden", shown: excursionCost > 0 },
        { label: "Specialty dining (2 nights, " + adults + " adults)", amount: specialty, kind: "hidden", shown: $("specialty").checked },
        { label: "Photo package", amount: photos, kind: "hidden", shown: $("photos").checked },
        { label: "Pre-cruise hotel (1 night near port)", amount: preCruise, kind: "hidden", shown: $("hotel").checked },
        { label: "Port parking (" + (nights + 1) + " days)", amount: parking, kind: "hidden", shown: $("parking").checked },
        { label: "Port fees & taxes (" + totalPeople + " people)", amount: portFees, kind: "hidden" },
        { label: "NCL Free at Sea service charges (" + adults + " adults × " + nights + " nts × $28)", amount: nclFas, kind: "hidden", shown: nclFas > 0 }
      ].filter(function (x) { return x.shown !== false && x.amount > 0; })
    };
  }

  function renderDrinkBE(be, lineLabel, lineKey) {
    if (be.verdict === "included") {
      return '<div class="drink-be">' +
        '<h4>Drink math &mdash; ' + lineLabel + '</h4>' +
        '<p class="be-sub">' + lineLabel + ' includes most beverages with the fare. No drink package decision to make.</p>' +
        '</div>';
    }
    if (be.verdict === "na") {
      return '<div class="drink-be">' +
        '<h4>Drink math &mdash; ' + lineLabel + '</h4>' +
        '<p class="be-sub">' + lineLabel + ' doesn\'t sell drink packages on this itinerary. All drinks are pay-as-you-go.</p>' +
        '<div class="drink-be-grid">' +
          '<div class="drink-be-cell"><p class="lbl">Your daily cost / adult</p><p class="val">' + money(be.dailyPayCost) + '</p><p class="delta">' + be.alcoholCount + ' alcohol + ' + be.nonAlcCount + ' non-alc drinks</p></div>' +
          '<div class="drink-be-cell"><p class="lbl">Trip total &mdash; drinks</p><p class="val">' + money(be.tripPay) + '</p><p class="delta">' + be.adults + ' adults × ' + be.nights + ' nights</p></div>' +
        '</div></div>';
    }

    var verdictHtml = "";
    if (be.verdict === "buy") {
      verdictHtml = '<div class="drink-verdict buy"><strong>Buy the package.</strong> At your drink mix, pay-as-you-go would run ~' + money(be.dailyPayCost) + '/adult/day. The unlimited package is ' + money(be.pkgUnlimitedPerDay) + '/adult/day. You\'d save about <strong>' + money(be.savings) + '</strong> over ' + be.nights + ' nights for ' + be.adults + ' adults.</div>';
    } else if (be.verdict === "skip") {
      verdictHtml = '<div class="drink-verdict skip"><strong>Skip the package.</strong> Your drink mix runs about ' + money(be.dailyPayCost) + '/adult/day &mdash; well below the ' + money(be.pkgUnlimitedPerDay) + '/day package price. Buying it would <em>cost</em> you about <strong>' + money(-be.savings) + '</strong> extra over ' + be.nights + ' nights. Pay as you go.</div>';
    } else {
      verdictHtml = '<div class="drink-verdict close"><strong>It\'s close.</strong> Pay-as-you-go (~' + money(be.dailyPayCost) + '/adult/day) and the package (' + money(be.pkgUnlimitedPerDay) + '/day) are within ' + money(Math.abs(be.savings)) + ' for the trip. Buy the package if you want unlimited freedom; skip it if you\'re a moderate drinker.</div>';
    }

    return '<div class="drink-be">' +
      '<h4>Drink math &mdash; ' + lineLabel + '</h4>' +
      '<p class="be-sub">Package breaks even around <strong>' + be.breakEvenDrinks + ' alcoholic drinks/day</strong> (avg drink ~' + money(be.avgAlcoholWithGrat) + ' incl. 18% grat).</p>' +
      '<div class="drink-be-grid">' +
        '<div class="drink-be-cell"><p class="lbl">Pay as you go</p><p class="val">' + money(be.dailyPayCost) + '<span style="font-size:14px;font-weight:500;color:var(--muted)"> / adult / day</span></p><p class="delta">Trip: ' + money(be.tripPay) + ' (' + be.adults + ' adults × ' + be.nights + ' nts)</p></div>' +
        '<div class="drink-be-cell"><p class="lbl">Unlimited package</p><p class="val">' + money(be.pkgUnlimitedPerDay) + '<span style="font-size:14px;font-weight:500;color:var(--muted)"> / adult / day</span></p><p class="delta">Trip: ' + money(be.tripPkg) + (be.children > 0 ? ' (incl. soda for ' + be.children + ' kids)' : '') + '</p></div>' +
      '</div>' +
      verdictHtml +
      '</div>';
  }

  function render(r) {
    var html = "";

    html += '<div class="big-result">';
    html += '  <div class="big-card sticker"><p class="big-label">Advertised fare</p><p class="big-num">' + money(r.sticker) + '</p></div>';
    html += '  <div class="big-card actual"><p class="big-label">Estimated total</p><p class="big-num">' + money(r.total) + '</p><p class="big-pct">' + money(r.perPersonPerDay) + ' / person / day</p></div>';
    html += '  <div class="big-card gap"><p class="big-label">What people forget to add</p><p class="big-num">+' + money(r.gap) + '</p><p class="big-pct">' + r.gapPct.toFixed(0) + '% on top of the fare</p></div>';
    html += '</div>';

    if (r.freeKids > 0) {
      html += '<div class="benchmark-callout">' + r.freeKids + ' child' + (r.freeKids > 1 ? 'ren sail' : ' sails') + ' free as part of MSC\'s 3rd/4th-guest program. Gratuities, port fees, and taxes still apply for those guests.</div>';
    }
    if (r.infants > 0) {
      html += '<div class="benchmark-callout">' + r.infants + ' under 3 sail free &mdash; no fare, no gratuity, no drink package, no excursion charge. Still bring documents and a stroller plan.</div>';
    }

    html += '<div class="freshness-badge">2026 pricing data · last updated September 2026 · next refresh October 2026</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> This is an <em>estimate</em>, not a live quote. It is built from published 2026 cruise fares, NerdWallet averages, and Cruise Critic research &mdash; then biased to over-count costs and under-count card value. Your real booking price will move with season, cabin type, promotions, and how the line prices that sailing week. The honest expectation: your actual total comes in at or below this number more often than above it.</div>';

    if (r.portInfo) {
      html += '<div class="result-note" style="margin-top:0"><strong>From ' + r.portInfo.label + '.</strong> Lines that homeport here: ' + r.portInfo.lines.join(", ") + '.</div>';
    }

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

    html += renderDrinkBE(r.drinkBE, r.lineLabel, r.lineKey);

    html += '<div class="result-note"><strong>Why the gap?</strong> The advertised fare is lodging on a boat. Gratuities, drinks, Wi-Fi, excursions, and port fees are disclosed somewhere on every cruise line site &mdash; just not added to the price before you click "Book." Add them and the total usually runs 40-60% above the fare you anchored on. Some of it (excursions, drink packages, photos) is genuinely optional. Some (gratuities, port fees) is not.</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    if (typeof VM_ANALYTICS !== "undefined") {
      VM_ANALYTICS.calcComplete("cruise", r.total, {
        line: ($("line")||{value:""}).value,
        nights: parseInt(($("nights")||{value:7}).value,10)
      });
    }
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: r.total,
      context: "this cruise",
      calcType: "cruise"
    });

    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "cruise",
      selection: { lineId: $("line").value }
    });

    // ---- AI Live Pricing ----
    var aiContainer = document.getElementById("ai-live-pricing");
    if (aiContainer && typeof VM_AILivePricing !== "undefined") {
      aiContainer.innerHTML = ""; // reset on re-render
      var lineEl = $("line");
      var lineSel = lineEl ? lineEl.options[lineEl.selectedIndex] : null;
      VM_AILivePricing.render({
        container: aiContainer,
        calc: "cruise",
        estimatedTotal: r.total,
        params: {
          nights: r.nights || 7,
          lineName: lineSel ? lineSel.text : "any major cruise line",
          cabinLabel: (function(){
            var c = $("cabin"); return c ? c.options[c.selectedIndex].text : "interior";
          })(),
          port: (function(){
            var p = $("port"); return p && p.value !== "" ? p.options[p.selectedIndex].text : "any US port";
          })()
        }
      });
    }
  }

  function updateConditionalToggles() {
    var lineId = $("line").value;
    var kidsRow = document.getElementById("kids-free-row");
    var fasRow = document.getElementById("ncl-fas-row");
    if (kidsRow) {
      kidsRow.hidden = !lineSupportsKidsFree(lineId);
      if (kidsRow.hidden) document.getElementById("kids-free").checked = false;
    }
    if (fasRow) {
      fasRow.hidden = !lineSupportsFreeAtSea(lineId);
      if (fasRow.hidden) document.getElementById("ncl-fas").checked = false;
    }
  }

  function updateLineNote() {
    var val = $("line").value;
    if (val === "custom") {
      $("line-note").textContent = "Custom fare. Enter the per-person quoted price below; we'll add the line items the booking page leaves off.";
      return;
    }
    var line = LINES[val];
    if (!line) return;
    var note = line.note || "";
    // Trim if longer than ~180 chars
    if (note.length > 220) note = note.substring(0, 217) + "…";
    $("line-note").textContent = note;
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    updateRunningTotal();
    render(calculate());
    if (window.innerWidth < 900) {
      $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  function refreshLines() {
    var portId = $("port") ? $("port").value : "";
    var currentLine = $("line").value;
    VM_Pickers.fillCruiseLines($("line"), currentLine, portId);
    // If the previously-selected line was filtered out, fall back to the first option
    if ($("line").value !== currentLine) {
      // Try to keep something sensible; if there are zero matches show custom
      if (!$("line").value && $("line").options.length > 0) {
        $("line").value = $("line").options[0].value;
      }
    }
    updateLineNote();
    updatePortNote();
  }

  function updatePortNote() {
    var portId = $("port") ? $("port").value : "";
    var note = $("port-note");
    if (!note) return;
    if (!portId) {
      note.textContent = "Optional — picking a port narrows the line list to lines that homeport there.";
      return;
    }
    var ids = VM_Pickers.getPortLineIds(portId) || [];
    var labels = ids.map(function(id){ return LINES[id] ? LINES[id].label : id; }).filter(Boolean);
    note.textContent = labels.length
      ? "Lines homeporting here: " + labels.join(", ") + ". Pick “Custom” below if your line/sailing isn’t listed."
      : "No lines mapped to this port — use Custom below to enter your own fare.";
  }

  function updateCustomFareVisibility() {
    var fld = $("custom-fare-field");
    if (!fld) return;
    fld.hidden = $("line").value !== "custom";
  }

  $("line").addEventListener("change", function(){
    updateLineNote();
    updateCustomFareVisibility();
    updateConditionalToggles();
    render(calculate());
  });

  // Live recompute on any toggle / input change
  [
    "kids-free", "ncl-fas", "gratuities", "wifi", "specialty", "photos",
    "hotel", "parking", "nights", "adults", "children", "infants", "cabin",
    "season-c", "drinks", "excursions", "customFare",
    "d-cocktail", "d-beer", "d-wine", "d-soda", "d-coffee", "d-water"
  ].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    var evt = (el.tagName === "SELECT" || el.type === "checkbox") ? "change" : "input";
    el.addEventListener(evt, function(){ render(calculate()); });
  });

  // Inject Getting There block
  var gtContainer = document.getElementById("gt-container");
  if (gtContainer && window.VM_GettingThere) {
    gtContainer.innerHTML = window.VM_GettingThere.buildInputHTML({
      defaultMode: "drive",
      defaultMiles: 0
    });
    window.VM_GettingThere.attach(function () { render(calculate()); });
  }

  window.addEventListener("DOMContentLoaded", function () {
    VM_Pickers.fillCruisePorts($("port"));
    // Add the "any port" sentinel option at top of the just-filled select
    var blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Any / not picked yet";
    $("port").insertBefore(blank, $("port").firstChild);
    blank.selected = true;
    VM_Pickers.fillCruiseLines($("line"), "royal_caribbean", "");
    $("port").addEventListener("change", refreshLines);
    updateLineNote();
    updatePortNote();
    updateCustomFareVisibility();
    updateConditionalToggles();
    render(calculate());
  });
  // The capture form is handled by main.js (submitForm -> POST /subscribe).
  // A local handler used to intercept it here and show a success message
  // without sending anything; removed 2026-08-28.
})();
