/* Vacation Math — Calculator v2 engine. Card data lives in calculator-data.js (VM_CALC). */
(function () {
  "use strict";
  var CARDS = VM_CALC.CARDS;
  var CARD_ORDER = VM_CALC.CARD_ORDER;
  var VALUATIONS = VM_CALC.VALUATIONS;
  var PREMIUM_IDS = VM_CALC.PREMIUM_IDS;
  var DEFAULT_SHARES = VM_CALC.DEFAULT_SHARES;
  var TIMING_TABLE = VM_CALC.TIMING_TABLE;
  var BENCHMARKS = VM_CALC.BENCHMARKS;
  var HIDDEN_COSTS = VM_CALC.HIDDEN_COSTS;
  var missingItems = VM_CALC.missingItems;
  var BOOKING_TIPS = VM_CALC.BOOKING_TIPS;
  var CTA_URLS = VM_CALC.CTA_URLS;
  var TRIP_LABELS = VM_CALC.TRIP_LABELS;
  var PROCONS = VM_CALC.PROCONS;

  // ----------------------------------------------------------------
  // UTILITIES
  // ----------------------------------------------------------------
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function fmt$(n) { n = Math.max(0, Math.round(n)); return "$" + n.toLocaleString("en-US"); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function updateSliderFill(input) {
    var min = parseFloat(input.min) || 0;
    var max = parseFloat(input.max) || 100;
    var val = parseFloat(input.value) || 0;
    var pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }
  function bindSlider(id, displayId, formatter, onChange) {
    var input = document.getElementById(id);
    var display = document.getElementById(displayId);
    function sync() {
      if (display) display.textContent = formatter(parseFloat(input.value));
      updateSliderFill(input);
      if (onChange) onChange();
    }
    input.addEventListener("input", sync);
    sync();
  }

  // ----------------------------------------------------------------
  // MODE TOGGLE (Quick vs Deep)
  // ----------------------------------------------------------------
  var mode = "quick";
  function setMode(next) {
    mode = next;
    $all(".mode-btn").forEach(function (b) {
      var active = b.getAttribute("data-mode") === next;
      b.classList.toggle("mode-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    $all(".quick-only").forEach(function (el) { el.hidden = (next !== "quick"); });
    $all(".deep-only").forEach(function (el) { el.hidden = (next !== "deep"); });
  }
  $all(".mode-btn").forEach(function (b) {
    b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
  });

  // ----------------------------------------------------------------
  // PILL GROUPS (single-select buttons)
  // ----------------------------------------------------------------
  $all(".pill-row").forEach(function (row) {
    row.addEventListener("click", function (e) {
      var btn = e.target.closest(".pill");
      if (!btn || !row.contains(btn)) return;
      // Scope removal to THIS row only (was a bug clearing all other groups).
      Array.prototype.forEach.call(row.querySelectorAll(".pill"), function (b) {
        b.classList.remove("pill-on");
      });
      btn.classList.add("pill-on");
    });
  });
  function pillValue(name) {
    var row = document.querySelector('.pill-row[data-name="' + name + '"]');
    if (!row) return null;
    var on = row.querySelector(".pill.pill-on");
    return on ? on.getAttribute("data-val") : null;
  }

  // ----------------------------------------------------------------
  // POINTS DISCLOSE
  // ----------------------------------------------------------------
  var toggleBtn = $("#points-toggle");
  var pointsBlock = $("#points-block");
  toggleBtn.addEventListener("click", function () {
    var open = !pointsBlock.hasAttribute("hidden");
    if (open) {
      pointsBlock.setAttribute("hidden", "");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "+ Add my existing points (optional)";
    } else {
      pointsBlock.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.textContent = "\u2212 Hide existing points";
    }
  });

  // "None" checkbox mutually exclusive
  var cardChecks = $all('input[name="cards"]');
  cardChecks.forEach(function (cb) {
    cb.addEventListener("change", function () {
      if (cb.value === "none" && cb.checked) {
        cardChecks.forEach(function (other) { if (other.value !== "none") other.checked = false; });
      } else if (cb.value !== "none" && cb.checked) {
        var noneCb = cardChecks.filter(function (x) { return x.value === "none"; })[0];
        if (noneCb) noneCb.checked = false;
      }
    });
  });

  // ----------------------------------------------------------------
  // CATEGORY SPEND HELPERS
  // ----------------------------------------------------------------
  function readCategorySpend(monthlyFallback) {
    if (mode === "deep") {
      var dining = parseInt($("#exp-dining").value, 10) || 0;
      var grocery = parseInt($("#exp-grocery").value, 10) || 0;
      var gas = parseInt($("#exp-gas").value, 10) || 0;
      var travel = parseInt($("#exp-travel").value, 10) || 0;
      var streaming = parseInt($("#exp-streaming").value, 10) || 0;
      var other = parseInt($("#exp-other").value, 10) || 0;
      var total = dining + grocery + gas + travel + streaming + other;
      return {
        dining: dining, grocery: grocery, gas: gas, travel: travel,
        streaming: streaming, other: other, monthly: total
      };
    }
    // Quick mode: split monthly slider into default shares
    return {
      dining: monthlyFallback * DEFAULT_SHARES.dining,
      grocery: monthlyFallback * DEFAULT_SHARES.grocery,
      gas: monthlyFallback * DEFAULT_SHARES.gas,
      travel: monthlyFallback * DEFAULT_SHARES.travel,
      streaming: monthlyFallback * DEFAULT_SHARES.streaming,
      other: monthlyFallback * DEFAULT_SHARES.other,
      monthly: monthlyFallback
    };
  }

  function updateProfileTotal() {
    var d = parseInt($("#exp-dining").value, 10) || 0;
    var g = parseInt($("#exp-grocery").value, 10) || 0;
    var gas = parseInt($("#exp-gas").value, 10) || 0;
    var tr = parseInt($("#exp-travel").value, 10) || 0;
    var s = parseInt($("#exp-streaming").value, 10) || 0;
    var o = parseInt($("#exp-other").value, 10) || 0;
    var t = d + g + gas + tr + s + o;
    $("#profile-total-value").textContent = fmt$(t);
    // Two-way sync: category sliders drive the household monthly value.
    // If the total falls inside the household slider's range, mirror it.
    var monthlyInput = $("#monthly");
    if (monthlyInput) {
      var minM = parseFloat(monthlyInput.min) || 0;
      var maxM = parseFloat(monthlyInput.max) || 25000;
      var clamped = Math.max(minM, Math.min(maxM, t));
      monthlyInput.value = clamped;
      var monthlyDisplay = $("#monthly-display");
      if (monthlyDisplay) monthlyDisplay.textContent = fmt$(t);
      updateSliderFill(monthlyInput);
    }
  }

  // ----------------------------------------------------------------
  // CARD SCORING ENGINE
  // ----------------------------------------------------------------
  // Score components (first-year, dollars):
  //   - signupValue:    bonus_points \u00d7 valuation
  //   - categoryEarn:   ann spend \u00d7 bonus multipliers \u00d7 valuation (cap upside vs base earn)
  //   - tripBenefit:    credit applicable to this trip
  //   - styleFit:       lounge / FHR / intl / rental bonuses based on travel style
  //   - feeDrag:        annual_fee minus offsetting credits
  //   - penalties:      no_new (skip new cards), under_100 (cap fee), etc.
  function scoreCard(cardId, ctx) {
    var c = CARDS[cardId];
    var val = VALUATIONS[c.bonus_currency] || VALUATIONS.cashback;
    var spend = ctx.spend;
    var annual = spend.monthly * 12;
    var style = ctx.style;
    var trip = ctx.tripType;
    var alreadyOwned = ctx.ownedIds.indexOf(cardId) !== -1;

    // 1) Sign-up bonus (if user could realistically hit it AND doesn't already hold it)
    var signupValue = 0;
    if (!alreadyOwned && c.min_spend > 0) {
      var canHit = (spend.monthly * c.spend_window_months) >= c.min_spend;
      // In Quick mode we assume yes; in Deep mode we apply spend test
      if (mode === "quick" || canHit) {
        signupValue = c.bonus_points * val;
      } else {
        // partial credit if they can hit ~80%
        var ratio = (spend.monthly * c.spend_window_months) / c.min_spend;
        if (ratio >= 0.8) signupValue = c.bonus_points * val * 0.7;
      }
    }
    // If "no new cards" style, kill signup bonus value
    if (style.style_apply === "no_new" && !alreadyOwned) signupValue = 0;

    // Quick-mode default: discourage premium-fee cards unless user has clearly opted in.
    // Quick-mode users haven't told us their fee comfort, so anchor on $95-or-less cards.
    // They can switch to Deep dive to override.
    var quickFeeGuard = (mode === "quick" && c.annual_fee > 100 && !alreadyOwned);

    // 2) Category earn LIFT: how much more this card earns vs. a 1.5% basic card
    // We score earn only on the share that flows through THIS card (assume 60% if added on top of existing).
    var existingCount = ctx.ownedIds.filter(function (x) { return x !== "none"; }).length;
    var addedShare = alreadyOwned ? 0.5 : (existingCount === 0 ? 0.9 : 0.6);
    var routedAnnual = annual * addedShare;
    var dollarsByCat = {
      dining: routedAnnual * (spend.dining / Math.max(1, spend.monthly)),
      grocery: routedAnnual * (spend.grocery / Math.max(1, spend.monthly)),
      gas: routedAnnual * (spend.gas / Math.max(1, spend.monthly)),
      travel: routedAnnual * (spend.travel / Math.max(1, spend.monthly)),
      streaming: routedAnnual * (spend.streaming / Math.max(1, spend.monthly)),
      other: routedAnnual * (spend.other / Math.max(1, spend.monthly))
    };
    var pointsEarned =
      dollarsByCat.dining * c.dining_mult +
      dollarsByCat.grocery * c.grocery_mult +
      dollarsByCat.gas * c.gas_mult +
      dollarsByCat.travel * c.travel_mult +
      dollarsByCat.streaming * c.streaming_mult +
      dollarsByCat.other * c.base_mult;
    var earnValue = pointsEarned * val;
    var baselineCashback = routedAnnual * VALUATIONS.cashback;
    var earnLift = Math.max(0, earnValue - baselineCashback);

    // 3) Trip credit value (one trip)
    var tripBenefit = c.trip_credit || 0;
    // Cruises + intl get extra value from amex_plat / venture_x / csr
    if (trip === "cruise" && cardId === "amex_plat") tripBenefit = Math.max(tripBenefit, 300);
    if (trip === "europe" && (c.intl_no_fee || c.lounge)) tripBenefit += c.lounge ? 100 : 40;

    // 4) Style fit bonuses (annualized value)
    var styleFit = 0;
    var styleFitNotes = [];
    if (c.lounge && (style.style_lounges === "always" || style.style_lounges === "sometimes")) {
      var loungeValue = style.style_lounges === "always" ? 400 : 150;
      styleFit += loungeValue;
      styleFitNotes.push("Lounge access (~" + fmt$(loungeValue) + "/yr based on how often you use them)");
    }
    if (c.primary_rental_cdw && (style.style_transport === "rental_car" || style.style_transport === "both")) {
      styleFit += 100;
      styleFitNotes.push("Primary rental car insurance ($100+ in declined CDW)");
    }
    if (c.fhr && style.style_lodging === "hotels") {
      styleFit += 200;
      styleFitNotes.push("Amex Fine Hotels credits (~$200/yr in property credits)");
    }
    if (c.intl_no_fee && (style.style_intl === "yearly" || style.style_intl === "often")) {
      styleFit += style.style_intl === "often" ? 120 : 50;
      styleFitNotes.push("No foreign transaction fees");
    }

    // 5) Fee drag
    var feeDrag = c.annual_fee;
    // Fee comfort: HARD penalty when user explicitly chose a fee cap.
    // Stated preferences should beat marginal points math.
    var feePenalty = 0;
    if (style.style_fee === "under_100" && c.annual_fee > 100 && !alreadyOwned) {
      // 4x penalty + flat $1500 — effectively disqualifies high-fee cards
      feePenalty = (c.annual_fee - 100) * 4 + 1500;
    } else if (style.style_fee === "under_400" && c.annual_fee > 400 && !alreadyOwned) {
      feePenalty = (c.annual_fee - 400) * 3 + 800;
    }

    // 6) Hard penalties
    var hardPenalty = 0;
    if (style.style_apply === "no_new" && !alreadyOwned) hardPenalty = 5000; // effectively disqualify
    // Already doing the work: penalize new premium adds
    if (ctx.alreadyDoingWork && !alreadyOwned && c.annual_fee >= 95) hardPenalty += 500;
    // Quick-mode fee guard: in Quick mode, anchor on <$100 cards unless user clearly needs more
    if (quickFeeGuard) {
      hardPenalty += (c.annual_fee - 100) * 2 + 600;
    }

    var net = signupValue + earnLift + tripBenefit + styleFit - feeDrag - feePenalty - hardPenalty;

    return {
      cardId: cardId,
      net: net,
      signupValue: Math.round(signupValue),
      earnLift: Math.round(earnLift),
      tripBenefit: Math.round(tripBenefit),
      styleFit: Math.round(styleFit),
      feeDrag: Math.round(feeDrag),
      feePenalty: Math.round(feePenalty),
      hardPenalty: Math.round(hardPenalty),
      alreadyOwned: alreadyOwned,
      styleFitNotes: styleFitNotes,
      annualFee: c.annual_fee,
      name: c.name
    };
  }

  function rankCards(ctx) {
    var ranked = CARD_ORDER.map(function (id) { return scoreCard(id, ctx); });
    ranked.sort(function (a, b) { return b.net - a.net; });
    return ranked;
  }

  // ----------------------------------------------------------------
  // MAIN CALCULATE
  // ----------------------------------------------------------------
  function calculate(input) {
    var sticker = input.sticker;
    var monthly = input.monthly;
    var spend = input.spend;
    var timing = input.timing;
    var tripType = input.tripType;
    var ownedIds = input.cards.filter(function (c) { return c !== "none"; });
    var hasNone = input.cards.indexOf("none") !== -1 || ownedIds.length === 0;

    // Existing points value
    var existingRaw =
      (input.points.chase_ur || 0) * VALUATIONS.ur +
      (input.points.amex_mr || 0) * VALUATIONS.mr +
      (input.points.capone_miles || 0) * VALUATIONS.capone +
      (input.points.hotel_points || 0) * VALUATIONS.hotel;
    var existingValue = Math.min(existingRaw, sticker * 0.7);

    var premiumOwned = ownedIds.filter(function (id) {
      return PREMIUM_IDS.indexOf(id) !== -1 && CARDS[id] && CARDS[id].annual_fee > 0;
    });
    var alreadyDoingWork = premiumOwned.length >= 3;

    var ctx = {
      tripType: tripType, timing: timing,
      monthly: monthly, spend: spend,
      ownedIds: ownedIds, hasNone: hasNone,
      alreadyDoingWork: alreadyDoingWork,
      style: input.style
    };

    // RANK ALL CARDS
    var ranked = rankCards(ctx);

    // Pick top recommendation that the user doesn't already own (unless all top picks are owned)
    var recScore = null;
    for (var i = 0; i < ranked.length; i++) {
      if (!ranked[i].alreadyOwned) { recScore = ranked[i]; break; }
    }
    // Fallback: if all owned (unlikely) or no_new, recommend redeploying their top owned card
    var noCardReason = null;
    if (!recScore || recScore.net <= 0) {
      recScore = null;
      if (input.style.style_apply === "no_new") noCardReason = "no_new";
      else if (alreadyDoingWork) noCardReason = "already_doing";
      else noCardReason = "no_good_fit";
    }

    // Too-soon guardrail
    if (recScore && timing === "next_3") {
      var c = CARDS[recScore.cardId];
      var maxAch = monthly * (c.spend_window_months || 3);
      if (c.min_spend > 0 && c.min_spend > maxAch * 0.9) {
        recScore = null;
        noCardReason = "too_soon";
      }
    }

    var recId = recScore ? recScore.cardId : null;
    var signupValue = recScore ? recScore.signupValue : 0;
    var cardMoveValue = recScore ? Math.max(0, recScore.net) : 0;

    // Timing
    var timingTbl = TIMING_TABLE[tripType] || TIMING_TABLE.other;
    var timingPct = clamp(timingTbl[timing] || 0, 0, 0.25);
    var timingSavings = sticker * timingPct;
    var timingNote = timingTbl["note_" + timing] || timingTbl.note_3_12;

    // Cap gap at 80%
    var totalGap = existingValue + cardMoveValue + timingSavings;
    var maxGap = sticker * 0.8;
    if (totalGap > maxGap) {
      var scale = maxGap / totalGap;
      existingValue *= scale;
      cardMoveValue *= scale;
      timingSavings *= scale;
      totalGap = maxGap;
    }
    var whatYouPay = Math.max(0, sticker - totalGap);

    return {
      sticker: sticker, whatYouPay: whatYouPay, totalGap: totalGap,
      existingValue: existingValue, cardMoveValue: cardMoveValue, timingSavings: timingSavings,
      timingNote: timingNote, timingPct: timingPct,
      recId: recId, recScore: recScore, ranked: ranked,
      noCardReason: noCardReason,
      signupValue: signupValue,
      pointsRaw: existingRaw, points: input.points,
      tripType: tripType, timing: timing,
      adults: input.adults, kids: input.kids,
      monthly: monthly, spend: spend,
      ownedIds: ownedIds, hasNone: hasNone,
      premiumOwned: premiumOwned, alreadyDoingWork: alreadyDoingWork,
      style: input.style
    };
  }

  // ----------------------------------------------------------------
  // PLAIN-ENGLISH "WHY THIS CARD" REASONS
  // ----------------------------------------------------------------
  function reasonsFor(rs, ctx) {
    var c = CARDS[rs.cardId];
    var out = [];
    // Best category match
    var spend = ctx.spend;
    var topCat = null, topVal = 0;
    var cats = [
      { key: "dining", mult: c.dining_mult, spend: spend.dining, label: "dining out" },
      { key: "grocery", mult: c.grocery_mult, spend: spend.grocery, label: "groceries" },
      { key: "gas", mult: c.gas_mult, spend: spend.gas, label: "gas" },
      { key: "travel", mult: c.travel_mult, spend: spend.travel, label: "travel" }
    ];
    cats.forEach(function (x) {
      if (x.mult >= 2 && x.spend > 0) {
        var v = x.mult * x.spend;
        if (v > topVal) { topVal = v; topCat = x; }
      }
    });
    if (topCat) {
      out.push("Earns " + topCat.mult + "x on " + topCat.label + " \u2014 your "
        + fmt$(topCat.spend) + "/mo there is the biggest lever.");
    }
    if (rs.signupValue >= 500) {
      out.push("Sign-up bonus is worth about " + fmt$(rs.signupValue)
        + " \u2014 that alone covers most of this trip.");
    }
    rs.styleFitNotes.forEach(function (n) { out.push(n + "."); });
    if (c.annual_fee === 0) out.push("Free to hold. There's no version of the math where this hurts you.");
    else if (rs.feeDrag <= rs.tripBenefit + rs.styleFit) out.push("The $" + c.annual_fee + " fee is fully offset by credits and perks you'll actually use.");
    else if (rs.signupValue + rs.earnLift + rs.tripBenefit + rs.styleFit > rs.feeDrag * 2) out.push("First-year value is more than 2\u00d7 the fee \u2014 the math works.");
    // De-dupe / cap
    var seen = {};
    var clean = [];
    out.forEach(function (s) { if (!seen[s]) { seen[s] = true; clean.push(s); } });
    return clean.slice(0, 5);
  }

  // ----------------------------------------------------------------
  // TRIP-COST INTELLIGENCE: BENCHMARKS
  // ----------------------------------------------------------------
  function buildBenchmark(tripType, adults, kids, sticker) {
    var b = BENCHMARKS[tripType] || BENCHMARKS.other;
    var low = adults * b.adult.low + kids * b.kid.low;
    var mid = adults * b.adult.mid + kids * b.kid.mid;
    var high = adults * b.adult.high + kids * b.kid.high;
    var label, status;
    if (sticker < low * 0.9) {
      label = "Your number is on the lean side."; status = "low";
    } else if (sticker > high * 1.1) {
      label = "Your number is in premium territory."; status = "high";
    } else if (sticker < mid) {
      label = "Your number is below the typical midpoint \u2014 solid budgeting."; status = "mid_low";
    } else {
      label = "Your number is in the typical range for this kind of trip."; status = "mid_high";
    }
    return {
      low: low, mid: mid, high: high, label: label, status: status,
      summary: "Most families with " + adults + " adults and " + kids + " kids on a " +
        (TRIP_LABELS[tripType] || "trip") + " spend roughly " + fmt$(low) + "\u2013" + fmt$(high) +
        " (midpoint " + fmt$(mid) + "). " + label
    };
  }


  window.VM_CALC_RUN = {
    $: $,
    $all: $all,
    fmt$: fmt$,
    clamp: clamp,
    getMode: function () { return mode; },
    updateSliderFill: updateSliderFill,
    bindSlider: bindSlider,
    setMode: setMode,
    pillValue: pillValue,
    readCategorySpend: readCategorySpend,
    updateProfileTotal: updateProfileTotal,
    calculate: calculate,
    reasonsFor: reasonsFor,
    buildBenchmark: buildBenchmark,
    cardChecks: cardChecks,
    CARDS: CARDS,
    VALUATIONS: VALUATIONS,
    CTA_URLS: CTA_URLS,
    TRIP_LABELS: TRIP_LABELS,
    PROCONS: PROCONS,
    HIDDEN_COSTS: HIDDEN_COSTS,
    missingItems: missingItems,
    BOOKING_TIPS: BOOKING_TIPS,
    BENCHMARKS: BENCHMARKS
  };
})();
