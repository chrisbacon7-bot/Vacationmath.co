/* Vacation Math — Calculator v2 UI. Engine exports live on window.VM_CALC_RUN. */
(function () {
  "use strict";
  var E = window.VM_CALC_RUN;
  if (!E) {
    console.error("Vacation Math calculator engine missing (VM_CALC_RUN).");
    return;
  }
  var $ = E.$;
  var $all = E.$all;
  var fmt$ = E.fmt$;
  var clamp = E.clamp;
  var getMode = E.getMode;
  var updateSliderFill = E.updateSliderFill;
  var bindSlider = E.bindSlider;
  var setMode = E.setMode;
  var pillValue = E.pillValue;
  var readCategorySpend = E.readCategorySpend;
  var updateProfileTotal = E.updateProfileTotal;
  var calculate = E.calculate;
  var reasonsFor = E.reasonsFor;
  var buildBenchmark = E.buildBenchmark;
  var cardChecks = E.cardChecks;
  var CARDS = E.CARDS;
  var VALUATIONS = E.VALUATIONS;
  var CTA_URLS = E.CTA_URLS;
  var TRIP_LABELS = E.TRIP_LABELS;
  var PROCONS = E.PROCONS;
  var HIDDEN_COSTS = E.HIDDEN_COSTS;
  var missingItems = E.missingItems;
  var BOOKING_TIPS = E.BOOKING_TIPS;
  var BENCHMARKS = E.BENCHMARKS;

  // ----------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------
  function familyLabel(adults, kids) {
    var total = adults + kids;
    if (kids === 0 && adults === 1) return "a solo traveler";
    if (kids === 0 && adults === 2) return "a couple";
    if (kids === 0) return adults + " adults";
    return "a family of " + total;
  }

  function biggestPointsAccount(p) {
    var entries = [
      { name: "Chase Ultimate Rewards", v: (p.chase_ur || 0) * VALUATIONS.ur },
      { name: "Amex Membership Rewards", v: (p.amex_mr || 0) * VALUATIONS.mr },
      { name: "Capital One Miles", v: (p.capone_miles || 0) * VALUATIONS.capone },
      { name: "your hotel program", v: (p.hotel_points || 0) * VALUATIONS.hotel }
    ];
    entries.sort(function (a, b) { return b.v - a.v; });
    return entries[0].v > 0 ? entries[0].name : "your rewards account";
  }
  function totalRawPoints(p) { return (p.chase_ur || 0) + (p.amex_mr || 0) + (p.capone_miles || 0) + (p.hotel_points || 0); }

  function render(r) {
    var results = $("#calc-results");
    results.removeAttribute("hidden");

    var tripLabel = TRIP_LABELS[r.tripType] || "trip";
    $("#result-kicker").textContent = "Your " + fmt$(r.sticker) + " " + tripLabel + " for " + familyLabel(r.adults, r.kids);

    $("#big-sticker").textContent = fmt$(r.sticker);
    $("#big-pay").textContent = fmt$(r.whatYouPay);
    $("#big-gap").textContent = fmt$(r.totalGap);

    // Edge banner
    var edge = $("#edge-banner");
    edge.setAttribute("hidden", ""); edge.innerHTML = "";
    if (r.sticker < 1500) {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>Honestly? At this trip size, the math is small.</strong> Use what you have, book midweek, and move on. Save the calculator for the bigger trips.";
    } else if (r.alreadyDoingWork) {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>You&rsquo;re already doing the work.</strong> Adding another premium card is noise. Focus on redeploying what you have.";
    } else if (r.noCardReason === "too_soon") {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>Your trip is too close to chase a sign-up bonus.</strong> A new card&rsquo;s minimum-spend window won&rsquo;t clear in time.";
    } else if (r.noCardReason === "no_new") {
      edge.removeAttribute("hidden");
      edge.innerHTML = "<strong>You told us no new cards right now.</strong> We&rsquo;re showing you how to deploy what you already hold.";
    }

    // Summary
    $("#result-summary").textContent = r.sticker < 1500
      ? "Take the trip. Pay attention next time the number is bigger."
      : "You're leaving " + fmt$(r.totalGap) + " on the table. Here's how to get it back.";

    // Gap table
    $("#gap-points").textContent = fmt$(r.existingValue);
    $("#gap-card").textContent = fmt$(r.cardMoveValue);
    $("#gap-timing").textContent = fmt$(r.timingSavings);
    $("#gap-total").textContent = fmt$(r.totalGap);

    // Intelligence
    renderIntel(r);

    // Moves
    var move1;
    if (r.existingValue > 100) {
      move1 = "You have about " + fmt$(r.pointsRaw) + " in points sitting in " + biggestPointsAccount(r.points) + ". We're counting " + fmt$(r.existingValue) + " toward this trip (capped — no one redeems 100% in real life). Redeem them. Don't save points forever. They're worth less every year.";
    } else if (totalRawPoints(r.points) > 0) {
      move1 = "You have a small points balance. Use it. Even " + fmt$(r.pointsRaw) + " toward a meal or a cabin upgrade is " + fmt$(r.pointsRaw) + " you didn't pay out of pocket.";
    } else {
      move1 = "You don't have an existing points balance — that's normal. The next 12 months are where you build one. Start with the card move below.";
    }
    $("#move-1").textContent = move1;

    var move2;
    if (r.alreadyDoingWork) {
      move2 = "You already hold " + r.premiumOwned.length + " premium cards. Adding another would be noise. Pick the one card with the best transfer partners or trip-specific credit, and redeem it cleanly for this trip.";
    } else if (r.noCardReason === "too_soon") {
      move2 = "Don't apply right now — the minimum-spend window won't clear before the trip. Re-run this after you book, and we'll line up the right card for the trip after.";
    } else if (r.noCardReason === "no_new") {
      move2 = "You said no new cards. Skip the move. Re-route your spend to the highest-multiplier card you already hold for each category.";
    } else if (r.recId) {
      var rec = CARDS[r.recId];
      move2 = "Apply for the " + rec.name + " this month. Hit the $" + rec.min_spend.toLocaleString() + " minimum spend over " + rec.spend_window_months + " months of normal household expenses. That clears the " + Math.round(rec.bonus_points / 1000) + "K bonus — worth about " + fmt$(r.signupValue) + " toward this trip.";
    } else {
      move2 = "No new card. The math doesn't justify one for this trip.";
    }
    $("#move-2").textContent = move2;

    $("#move-3").textContent = r.timingNote;

    // Recommendation card
    var recCard = $("#rec-card");
    if (!r.recId || !r.recScore) {
      recCard.setAttribute("hidden", "");
    } else {
      recCard.removeAttribute("hidden");
      var c = CARDS[r.recId];
      var rs = r.recScore;
      $("#rec-name").textContent = c.name;
      $("#rec-fee").textContent = c.annual_fee === 0 ? "$0" : fmt$(c.annual_fee);
      $("#rec-bonus").textContent = fmt$(rs.signupValue);
      $("#rec-net").textContent = fmt$(Math.max(0, rs.net));

      // Reasons
      var ctx = { spend: r.spend, tripType: r.tripType, ownedIds: r.ownedIds, style: r.style, alreadyDoingWork: r.alreadyDoingWork };
      var reasons = reasonsFor(rs, ctx);
      var reasonsEl = $("#rec-reasons"); reasonsEl.innerHTML = "";
      reasons.forEach(function (txt) {
        var li = document.createElement("li"); li.textContent = txt; reasonsEl.appendChild(li);
      });

      // Trip-specific benefit copy (simple, derived from card credit + trip)
      var benefitMap = {
        cruise: "Trip protection + cabin-credit usable against the booking.",
        disney: "Resort and dining earn at the card's top rate. Useful credits before you fly.",
        europe: "No foreign transaction fees + travel protection across the trip.",
        all_inclusive: "Resort booking earns at the card's top rate; trip credits offset extras.",
        hawaii: "Hotels through the card portal earn the highest rate; lounge access at HNL if the card has it.",
        national_park: "Lodge bookings + rental car coverage useful here.",
        road_trip: "Hotel and gas earning is the lever on a road trip.",
        other: "Standard travel protections + category earn."
      };
      var bMap = {
        csp: "Book through Chase Travel for 5x earn. $100 hotel credit. Primary rental car insurance covers your road days.",
        csr: "$300 travel credit + Priority Pass + 8x via Chase Travel. 100k after $6k/3 mo. The premium features earn their keep only if you'll use them.",
        venture: "2x on everything, redeem against any travel purchase. Simplest card to use.",
        venture_x: "$300 travel credit + 10x hotels via Capital One Travel + Priority Pass. The credit cuts the fee to about $95 net.",
        amex_gold: "4x at restaurants and groceries — the trip-prep + travel-day food bill becomes a points engine.",
        amex_plat: "Lounge access + Fine Hotels credit + 5x flights. Premium features pay off on longer or international trips.",
        bilt: "No annual fee. Earn on rent. $100 Bilt Cash on approval. Solid complement to a main travel card.",
        citi_premier: "3x on air, hotels, dining, grocery, gas — plus a $100 hotel benefit. Most balanced earning at $95/yr."
      };
      $("#rec-benefit").textContent = bMap[r.recId] || benefitMap[r.tripType] || "Strong rewards earning on this trip.";

      $("#rec-pro").textContent = (PROCONS[r.recId] || {}).pro || "";
      $("#rec-con").textContent = (PROCONS[r.recId] || {}).con || "";

      // Scored breakdown table
      var rows = [];
      rows.push(["Sign-up bonus", rs.signupValue, c.bonus_points.toLocaleString() + " points × $" + VALUATIONS[c.bonus_currency].toFixed(3) + "/pt"]);
      rows.push(["Category earn lift (1 yr)", rs.earnLift, "How much more this card earns vs. a basic 1.5% cashback card, based on your spending profile."]);
      rows.push(["Trip credit applied", rs.tripBenefit, "Travel credit or trip-specific perk usable on this booking."]);
      rows.push(["Lifestyle perks", rs.styleFit, rs.styleFitNotes.length ? rs.styleFitNotes.join("; ") : "Perks aligned with how you travel (lounges, rental insurance, FHR, intl)."]);
      rows.push(["Annual fee", -rs.feeDrag, c.annual_fee === 0 ? "No annual fee." : "Subtracted from first-year value."]);
      if (rs.feePenalty > 0) rows.push(["Fee comfort penalty", -rs.feePenalty, "You told us you're more comfortable with a lower-fee card."]);
      if (rs.hardPenalty > 0) rows.push(["Other penalties", -rs.hardPenalty, "Adjustments for already-doing-the-work or no-new-cards preferences."]);
      var rowsEl = $("#score-rows"); rowsEl.innerHTML = "";
      rows.forEach(function (row) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td"); td1.textContent = row[0]; tr.appendChild(td1);
        var td2 = document.createElement("td"); td2.className = "num";
        var v = row[1];
        td2.textContent = (v < 0 ? "-" : "") + fmt$(Math.abs(v));
        if (v < 0) td2.classList.add("neg");
        tr.appendChild(td2);
        var td3 = document.createElement("td"); td3.className = "why"; td3.textContent = row[2]; tr.appendChild(td3);
        rowsEl.appendChild(tr);
      });
      $("#score-net").textContent = fmt$(Math.max(0, rs.net));
      $("#rec-math-intro").textContent = "First-year value for you, based on " + fmt$(r.spend.monthly) + "/mo in spending, this " + (TRIP_LABELS[r.tripType] || "trip") + ", and how you travel.";

      // Ranked table (deep mode only)
      var rankWrap = $("#rec-ranked-wrap");
      if (getMode() === "deep") {
        rankWrap.hidden = false;
        var rrEl = $("#rank-rows"); rrEl.innerHTML = "";
        r.ranked.slice(0, 8).forEach(function (rs2, idx) {
          var tr = document.createElement("tr");
          var t1 = document.createElement("td"); t1.textContent = (idx + 1); tr.appendChild(t1);
          var t2 = document.createElement("td"); t2.textContent = rs2.name + (rs2.alreadyOwned ? " (you own)" : ""); tr.appendChild(t2);
          var t3 = document.createElement("td"); t3.className = "num"; t3.textContent = fmt$(Math.max(0, rs2.net)); tr.appendChild(t3);
          var t4 = document.createElement("td"); t4.textContent = rs2.annualFee === 0 ? "$0" : fmt$(rs2.annualFee); tr.appendChild(t4);
          if (idx === 0) tr.classList.add("rank-top");
          rrEl.appendChild(tr);
        });
      } else {
        rankWrap.hidden = true;
      }

      var cta = $("#rec-cta");
      cta.href = CTA_URLS[r.recId] || "#";
      cta.textContent = "Learn more about the " + c.name;
      cta.setAttribute("target", "_blank");
      cta.setAttribute("rel", "noopener noreferrer");
    }

    requestAnimationFrame(function () {
      results.classList.add("visible");
      var top = results.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: top, behavior: "smooth" });
    });

    window.__lastResult = r;
  }

  function renderIntel(r) {
    var card = $("#intel-card");
    card.removeAttribute("hidden");

    // Benchmark
    var bench = buildBenchmark(r.tripType, r.adults, r.kids, r.sticker);
    $("#intel-benchmark").textContent = bench.summary;
    // Bar viz
    var wrap = $("#intel-bar-wrap");
    wrap.removeAttribute("hidden");
    // Render: track goes from low*0.6 to high*1.4
    var trackLo = bench.low * 0.6;
    var trackHi = bench.high * 1.4;
    var pct = function (v) { return clamp(((v - trackLo) / (trackHi - trackLo)) * 100, 0, 100); };
    var rangeLeft = pct(bench.low);
    var rangeRight = pct(bench.high);
    var rangeEl = $("#intel-bar-range");
    rangeEl.style.left = rangeLeft + "%";
    rangeEl.style.right = (100 - rangeRight) + "%";
    var marker = $("#intel-bar-marker");
    marker.style.left = pct(r.sticker) + "%";
    $("#intel-bar-low").textContent = fmt$(bench.low);
    $("#intel-bar-high").textContent = fmt$(bench.high);

    // Hidden costs
    var hidden = HIDDEN_COSTS[r.tripType] || HIDDEN_COSTS.other;
    var hEl = $("#intel-hidden"); hEl.innerHTML = "";
    hidden.forEach(function (t) {
      var li = document.createElement("li"); li.textContent = t; hEl.appendChild(li);
    });

    // Missing items
    var missing = missingItems(r.tripType, r.adults, r.kids, r.sticker);
    var mEl = $("#intel-missing"); mEl.innerHTML = "";
    missing.forEach(function (m) {
      var li = document.createElement("li");
      li.innerHTML = "<span>" + m.label + "</span> <span class=\"intel-num\">~ " + fmt$(m.value) + "</span>";
      mEl.appendChild(li);
    });

    // Booking
    $("#intel-booking").textContent = BOOKING_TIPS[r.tripType] || BOOKING_TIPS.other;
  }

  // ----------------------------------------------------------------
  // STICKER BENCHMARK INLINE (updates with inputs)
  // ----------------------------------------------------------------
  function updateStickerBenchmark() {
    var tripType = $("#trip-type").value;
    var adults = parseInt($("#adults").value, 10) || 0;
    var kids = parseInt($("#kids").value, 10) || 0;
    var sticker = parseInt($("#sticker").value, 10) || 0;
    var b = BENCHMARKS[tripType] || BENCHMARKS.other;
    var low = adults * b.adult.low + kids * b.kid.low;
    var high = adults * b.adult.high + kids * b.kid.high;
    var el = $("#sticker-benchmark");
    if (!sticker || !el) return;
    var status;
    if (sticker < low * 0.85) status = "lean";
    else if (sticker > high * 1.15) status = "premium";
    else status = "typical";
    var labelMap = { lean: "Below typical range", premium: "Above typical range", typical: "In the typical range" };
    el.textContent = "Benchmark for " + adults + "A + " + kids + "K on this trip: " +
      fmt$(low) + "–" + fmt$(high) + " (" + labelMap[status].toLowerCase() + ").";
  }

  // ----------------------------------------------------------------
  // FORM SUBMIT
  // ----------------------------------------------------------------
  var form = $("#calc-form");
  var submitBtn = $("#calc-btn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    var origText = submitBtn.textContent;
    submitBtn.textContent = "Running the math…";
    setTimeout(function () {
      try {
        var input = readForm();
        var r = calculate(input);
        render(r);
      } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = origText;
      }
    }, 320);
  });

  function readForm() {
    var tripType = $("#trip-type").value;
    var adults = parseInt($("#adults").value, 10) || 0;
    var kids = parseInt($("#kids").value, 10) || 0;
    var sticker = parseInt($("#sticker").value, 10) || 0;
    var timing = (document.querySelector('input[name="timing"]:checked') || {}).value || "3_12";
    var monthlySlider = parseInt($("#monthly").value, 10) || 0;
    var spend = readCategorySpend(monthlySlider);
    var cards = cardChecks.filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
    var points = {
      chase_ur: parseInt($("#chase-ur").value, 10) || 0,
      amex_mr: parseInt($("#amex-mr").value, 10) || 0,
      capone_miles: parseInt($("#capone-miles").value, 10) || 0,
      hotel_points: parseInt($("#hotel-points").value, 10) || 0
    };
    var style = {
      style_lounges: pillValue("style_lounges") || "sometimes",
      style_lodging: pillValue("style_lodging") || "hotels",
      style_transport: pillValue("style_transport") || "rental_car",
      style_fee: pillValue("style_fee") || "under_100",
      style_apply: pillValue("style_apply") || "one_at_time",
      style_intl: pillValue("style_intl") || "rarely"
    };
    return {
      tripType: tripType, adults: adults, kids: kids,
      sticker: sticker, timing: timing,
      monthly: spend.monthly, spend: spend,
      cards: cards, points: points, style: style
    };
  }

  // ----------------------------------------------------------------
  // WORKSHEET FORM
  // ----------------------------------------------------------------
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  function setMsg(formEl, kind, text) {
    var msg = formEl.querySelector(".form-msg");
    if (!msg) return;
    msg.classList.remove("error", "success");
    if (kind) msg.classList.add(kind);
    msg.textContent = text || "";
  }
  var wsForm = $("#worksheet-form");
  wsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = wsForm.querySelector('input[type="email"]');
    var btn = wsForm.querySelector("button[type=submit]");
    var email = (input.value || "").trim();
    if (!EMAIL_RE.test(email)) {
      setMsg(wsForm, "error", "Please enter a valid email address.");
      input.focus(); return;
    }
    btn.disabled = true; btn.textContent = "Sending…";
    setMsg(wsForm, "", "");
    setTimeout(function () {
      var wrap = document.createElement("div");
      wrap.className = "form-success";
      wrap.setAttribute("role", "status");
      wrap.style.cssText = "padding:20px 22px;border-radius:14px;background:rgba(230,163,64,0.18);border:1.5px solid rgba(230,163,64,0.5);color:var(--cream);font-weight:600;max-width:460px;margin:0 auto;font-size:16px;";
      wrap.textContent = "Sent. Check your inbox — and watch for Tuesday's brief.";
      wsForm.replaceWith(wrap);
    }, 350);
  });

  // ----------------------------------------------------------------
  // INIT
  // ----------------------------------------------------------------
  bindSlider("cost-per-adult", "cost-per-adult-display", function (v) { return fmt$(v); });
  bindSlider("cost-per-kid", "cost-per-kid-display", function (v) { return fmt$(v); });
  bindSlider("monthly", "monthly-display", function (v) { return fmt$(v); });

  // Expense profile sliders (deep mode)
  bindSlider("exp-dining", "exp-dining-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-grocery", "exp-grocery-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-gas", "exp-gas-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-travel", "exp-travel-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-streaming", "exp-streaming-display", function (v) { return fmt$(v); }, updateProfileTotal);
  bindSlider("exp-other", "exp-other-display", function (v) { return fmt$(v); }, updateProfileTotal);
  updateProfileTotal();

  // Live sticker price
  var adultsEl = $("#adults");
  var kidsEl = $("#kids");
  var perAdultEl = $("#cost-per-adult");
  var perKidEl = $("#cost-per-kid");
  var stickerHidden = $("#sticker");
  var stickerDisplay = $("#sticker-display");
  var stickerBreakdown = $("#sticker-breakdown");

  function recalcSticker() {
    var adults = parseInt(adultsEl.value, 10) || 0;
    var kids = parseInt(kidsEl.value, 10) || 0;
    var perAdult = parseInt(perAdultEl.value, 10) || 0;
    var perKid = parseInt(perKidEl.value, 10) || 0;
    var sticker = adults * perAdult + kids * perKid;
    stickerHidden.value = sticker;
    stickerDisplay.textContent = fmt$(sticker);
    var aLabel = adults === 1 ? "adult" : "adults";
    var kLabel = kids === 1 ? "kid" : "kids";
    if (kids > 0) {
      stickerBreakdown.innerHTML = adults + " " + aLabel + " \u00d7 " + fmt$(perAdult) + " + " + kids + " " + kLabel + " \u00d7 " + fmt$(perKid);
    } else {
      stickerBreakdown.innerHTML = adults + " " + aLabel + " \u00d7 " + fmt$(perAdult);
    }
    updateStickerBenchmark();
  }
  [adultsEl, kidsEl, perAdultEl, perKidEl].forEach(function (el) {
    el.addEventListener("input", recalcSticker);
    el.addEventListener("change", recalcSticker);
  });
  $("#trip-type").addEventListener("change", updateStickerBenchmark);
  recalcSticker();
  setMode("quick");
})();
