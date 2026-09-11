/* =====================================================================
   Vacation Math — Trip Plan (destination + hard budget)
   Constrains one destination to a budget. Uses VM_DATA + VM_PLAN_DATA
   + VM_TRIPFINDER_DATA (hotel / dailyGround). No affiliate widgets.
   ===================================================================== */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function catalog() {
    var P = window.VM_PLAN_DATA;
    if (!P) return [];
    if (!P.DESTINATIONS || P.DESTINATIONS.length < 10) {
      P.refreshCatalog();
    }
    return P.DESTINATIONS || [];
  }

  function destById(id) {
    var list = catalog();
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return list[0] || { id: "disney", label: "Walt Disney World", short: "Disney World", kind: "disney", flightRegion: "domestic", detailHref: "/disney", detailLabel: "Disney World Cost Calculator", blurb: "" };
  }

  function tfById(id) {
    var pack = window.VM_TRIPFINDER_DATA;
    var list = (pack && pack.DESTINATIONS) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === id) return list[i];
    }
    return null;
  }

  function seasonKeyFor(kind, monthVal) {
    var P = VM_PLAN_DATA;
    if (monthVal === "" || monthVal == null) return "avg";
    var month = parseInt(monthVal, 10);
    if (isNaN(month) || month < 0 || month > 11) return "avg";
    var map = {
      disney: P.SEASON.disney,
      cruise: P.SEASON.cruise,
      ai: P.SEASON.cancun,
      city: P.SEASON.nyc,
      hawaii: P.SEASON.hawaii,
      road: P.SEASON.smokies,
      city_generic: P.SEASON.city
    };
    var arr = map[kind] || P.SEASON.city;
    var band = arr[month];
    return P.SEASON_KEYS[band] || "avg";
  }

  function seasonMult(seasonKey) {
    if (seasonKey === "low") return 0.88;
    if (seasonKey === "high") return 1.22;
    return 1;
  }

  function tfTierMult(tier) {
    if (tier === "low") return 0.88;
    if (tier === "peak") return 1.12;
    return 1;
  }

  function shiftStyle(styleKey, delta) {
    var order = VM_PLAN_DATA.STYLE_ORDER;
    var idx = order.indexOf(styleKey);
    if (idx < 0) idx = 1;
    idx = Math.max(0, Math.min(order.length - 1, idx + delta));
    return order[idx];
  }

  function getFares(originId) {
    if (window.VM_OriginPicker && VM_OriginPicker.getOriginFares) {
      return VM_OriginPicker.getOriginFares(originId === "drive" ? "driving" : originId);
    }
    var table = (window.VM_DATA && VM_DATA.ORIGIN_AIRFARE) || {};
    var key = originId === "drive" ? "driving" : originId;
    return table[key] || table.atl || { domestic: 340, caribbean: 380, hawaii: 760, europe: 880, asia: 1280, latam: 540 };
  }

  function isFlyOnlyRegion(region) {
    return ["caribbean", "hawaii", "europe", "asia", "latam", "oceania", "africa", "middleeast"].indexOf(region) >= 0;
  }

  function transportCost(opts, region, surcharge) {
    var driving = opts.origin === "driving" || opts.origin === "drive";
    var ticketed = opts.adults + opts.kids;
    var mult = surcharge != null ? surcharge : 1;
    if (driving) {
      if (isFlyOnlyRegion(region)) return 0;
      return (VM_PLAN_DATA.DRIVE_COST_PER_PERSON || 220) * ticketed;
    }
    var fares = getFares(opts.origin);
    var per = fares[region] != null ? fares[region] : fares.domestic;
    return (per || 0) * mult * ticketed;
  }

  function transportNote(opts, region) {
    var driving = opts.origin === "driving" || opts.origin === "drive";
    if (driving && isFlyOnlyRegion(region)) {
      return "Driving does not replace a flight to this destination — add airfare or pick an airport.";
    }
    if (driving) return "Ground-transport allowance (fuel, wear, a night on the road) instead of airfare.";
    return "Round-trip airfare from your origin for ages 3+. Infants on a lap are treated as free.";
  }

  function line(label, amount, note, optional) {
    return { label: label, amount: Math.max(0, amount), note: note || "", optional: !!optional };
  }

  function sumLines(lines) {
    var t = 0;
    for (var i = 0; i < lines.length; i++) t += lines[i].amount;
    return t;
  }

  function hotelForMonth(tf, styleKey, monthVal) {
    if (!tf || !tf.monthly) return null;
    var months = tf.monthly;
    function pick(idx) {
      var row = months[idx];
      if (!row || !row.hotel) return 0;
      return row.hotel[styleKey] || 0;
    }
    if (monthVal === "" || monthVal == null) {
      var sum = 0, n = 0;
      for (var i = 0; i < months.length; i++) {
        var v = pick(i);
        if (v > 0) { sum += v; n++; }
      }
      return n ? sum / n : 0;
    }
    var m = parseInt(monthVal, 10);
    if (isNaN(m) || m < 0 || m > 11) return hotelForMonth(tf, styleKey, "");
    var direct = pick(m);
    if (direct > 0) return direct;
    return hotelForMonth(tf, styleKey, "");
  }

  function monthMeta(tf, monthVal) {
    if (!tf || !tf.monthly) return { tier: "shoulder", weather: "", crowd: "" };
    if (monthVal === "" || monthVal == null) return { tier: "average", weather: "", crowd: "" };
    var m = parseInt(monthVal, 10);
    var row = tf.monthly[m];
    return row || { tier: "shoulder", weather: "", crowd: "" };
  }

  function disneyPlan(opts, styleKey) {
    var D = VM_DATA.DISNEY;
    var P = VM_PLAN_DATA;
    var map = P.STYLE_MAP[styleKey];
    var season = seasonKeyFor("disney", opts.month);
    var resort = D.resorts[map.disneyResort];
    var nightly = resort[season];
    var lodgingBase = nightly * opts.nights;
    var lodgingTax = lodgingBase * P.FL_LODGING_TAX;
    var parkDays = Math.max(1, opts.nights - 1);
    var ticketAdult = D.tickets[season];
    var ticketKid = ticketAdult - D.childTicketDiscount;
    var ticketsBase = (ticketAdult * parkDays * opts.adults) + (ticketKid * parkDays * opts.kids);
    var ticketsTax = ticketsBase * P.FL_SALES_TAX;
    var foodHead = opts.adults + (opts.kids * 0.7);
    var diningScale = Math.max(0.5, foodHead / 4);
    var dining = D.dining[map.disneyDining].perDay * opts.nights * diningScale;
    var snacks = D.snacksPerPersonPerDay * foodHead * opts.nights;
    var llBase = D.lightningLanePerDay * (opts.adults + opts.kids) * parkDays;
    var ll = llBase * (1 + P.FL_SALES_TAX);
    var tips = D.tipsTotal * (opts.nights / 5);
    var includeLL = styleKey !== "budget";
    var includeMemory = styleKey === "lux";
    var souvenir = styleKey === "budget" ? D.souvenirsBudget * 0.55 : D.souvenirsBudget;
    var transport = transportCost(opts, "domestic", 1);
    return {
      summary: map.label + " Disney plan · " + resort.label.split(" (")[0] + " · " + season + " season",
      lines: [
        line("Resort lodging + 12.5% tax", lodgingBase + lodgingTax, resort.label + " · " + season + " season · Orange County 12.5% lodging tax on the room."),
        line("Park tickets + 6.5% tax", ticketsBase + ticketsTax, parkDays + " park day" + (parkDays === 1 ? "" : "s") + " · kids ~$5 less · under 3 free · FL 6.5% sales tax."),
        line("Lightning Lane Multi Pass + 6.5% tax", includeLL ? ll : 0, includeLL ? "Ages 3+ · FL sales tax on the pass." : "Left off the budget plan — add it as an upgrade if the number allows.", true),
        line("Dining", dining, D.dining[map.disneyDining].label + ", scaled to your party."),
        line("Snacks & drinks", snacks, "In-park snacks and bottled drinks, ages 3+ weighted."),
        line("Tips", tips, "Housekeeping and dining tips, scaled from a 5-night baseline."),
        line("Memory Maker", includeMemory ? D.memoryMaker : 0, includeMemory ? "Advance PhotoPass package." : "Optional PhotoPass package — not required to walk the parks.", true),
        line("Souvenir budget", souvenir, "Conservative. Easy to double if you let the shops win."),
        line("Getting there", transport, transportNote(opts, "domestic"))
      ]
    };
  }

  function cruisePlan(opts, styleKey) {
    var C = VM_DATA.CRUISE;
    var linesCatalog = VM_DATA.CRUISE_LINES_EXPANDED;
    var map = VM_PLAN_DATA.STYLE_MAP[styleKey];
    var lineKey = styleKey === "budget" ? "carnival" : (styleKey === "lux" ? "ncl" : "royal_caribbean");
    var cruiseLine = linesCatalog[lineKey];
    var cabin = map.cruiseCabin;
    var nights = opts.nights;
    var perPerson = cruiseLine.perPersonAvg * (nights / 7) + (C.cabinUpgrade[cabin] || 0);
    var fareHead = opts.adults + opts.kids;
    var firstTwo = Math.min(2, fareHead);
    var extras = Math.max(0, fareHead - 2);
    var fareTotal = (perPerson * firstTwo) + (perPerson * 0.5 * extras);
    var gratuity = cruiseLine.gratuityPerDay * nights * fareHead;
    var pkgKey = lineKey === "royal_caribbean" ? "royal" : lineKey;
    var pkg = C.drinkPackagePerLine[pkgKey] || C.drinkPackagePerLine.carnival;
    var drinks;
    var drinkNote;
    if (styleKey === "budget") {
      drinks = C.drinkPackages.none.perDay * nights * opts.adults;
      drinkNote = "Pay-as-you-go drinks for adults (~3/day). Not a package.";
    } else {
      drinks = pkg.unlimited * nights * opts.adults + pkg.soda * nights * opts.kids;
      drinkNote = "Adult unlimited package + kids soda package, per-line 2026 rates.";
    }
    var ports = Math.max(1, Math.round(nights / 3.5));
    var excursions = C.excursionPerPersonPerPort * fareHead * Math.min(2, ports);
    var portFees = C.portFeesPerPerson * (nights / 7) * fareHead;
    var preHotel = (opts.origin === "driving" || opts.origin === "drive") ? 0 : C.preCruiseHotel;
    var transport = transportCost(opts, "domestic", 1);
    if (!(opts.origin === "driving" || opts.origin === "drive")) {
      transport += 80 * fareHead;
    }
    var includeWifi = styleKey === "lux";
    var wifi = includeWifi ? C.wifiPerDay * nights * Math.min(2, opts.adults) : 0;
    return {
      summary: cruiseLine.label + " · " + cabin + " cabin · " + nights + "-night Caribbean",
      lines: [
        line("Cabin fare", fareTotal, cruiseLine.label + " 7-night average scaled to " + nights + " nights. 3rd/4th guests at half fare. Infants free."),
        line("Automatic gratuities", gratuity, "$" + cruiseLine.gratuityPerDay.toFixed(2).replace(/\.00$/, "") + "/person/day for ages 2+. Own line — not buried in the fare."),
        line("Drinks", drinks, drinkNote, styleKey !== "budget"),
        line("Shore excursions", excursions, "Two cruise-line excursions for ages 3+."),
        line("Port taxes & fees", portFees, "Caribbean taxes/fees, scaled from a 7-night baseline."),
        line("Ship Wi-Fi", wifi, includeWifi ? "Two devices, typical 2026 ship rate." : "Left off budget/mid plans. Add it if you need to work from the ship.", true),
        line("Pre-cruise hotel night", preHotel, preHotel ? "One night near a Florida port for fly-in guests." : "Skipped when you are driving to port."),
        line("Getting there", transport, (opts.origin === "driving" || opts.origin === "drive")
          ? "Driving to a Florida port — no airfare in this plan."
          : "Domestic airfare to a Florida port plus a ground-transfer allowance.")
      ]
    };
  }

  function aiPlan(opts, styleKey, destMeta) {
    var dests = VM_DATA.AI_DESTINATIONS || [];
    var aiId = (destMeta && destMeta.aiId) || "cancun";
    var dest = null;
    for (var i = 0; i < dests.length; i++) if (dests[i].id === aiId) dest = dests[i];
    dest = dest || { budget: 175, mid: 300, luxury: 460, label: destMeta ? destMeta.short : "All-inclusive" };
    var map = VM_PLAN_DATA.STYLE_MAP[styleKey];
    var tier = map.aiTier === "mid" ? "mid" : map.aiTier;
    var rate = dest[tier] || dest.mid;
    var kidDisc = { budget: 0.50, mid: 0.45, luxury: 0.50 };
    var tf = destMeta ? tfById(destMeta.id) : null;
    var meta = monthMeta(tf, opts.month);
    var rateAdj = rate * (opts.month === "" || opts.month == null ? 1 : tfTierMult(meta.tier));
    var pkg = (rateAdj * opts.adults * opts.nights) + (rateAdj * (kidDisc[tier] || 0.5) * opts.kids * opts.nights);
    var H = VM_DATA.ALLINC.aiHiddenAdditions;
    var tips = 80 * (opts.adults + opts.kids) * (opts.nights / 7);
    var excursions = H.excursionPerPerson * H.excursionsPerTrip * (opts.adults + opts.kids);
    var spa = styleKey === "lux" ? H.spaPerTrip : 0;
    var region = (destMeta && destMeta.flightRegion) || "caribbean";
    var surcharge = (destMeta && destMeta.flightSurcharge) || 1;
    var transport = transportCost(opts, region, surcharge);
    var brands = dest.brands ? dest.brands[tier === "luxury" ? "luxury" : (tier === "mid" ? "mid" : tier)] : "";
    var seasonLabel = (opts.month === "" || opts.month == null) ? "typical season" : (meta.tier + " season");
    return {
      summary: (dest.label || destMeta.label) + " · " + map.label + " all-inclusive · " + seasonLabel,
      lines: [
        line("All-inclusive package", pkg, "About " + money(rateAdj) + "/adult/night. Kids ~" + Math.round((kidDisc[tier] || 0.5) * 100) + "% · under 3 free." + (brands ? " Typical of " + brands + "." : "")),
        line("Round-trip flights", transport, transportNote(opts, region)),
        line("Customary tips", tips, "Cash tips are optional on paper and expected in practice. Scaled from ~$80/person/week."),
        line("Off-property excursions", excursions, "Two excursions. Not in the brochure rate."),
        line("Spa / specialty night", spa, spa ? "One spa visit, typical of a higher-end week." : "Left off budget/mid. The package does not replace every off-property spend.", true)
      ]
    };
  }

  function tfPlan(opts, styleKey, destMeta) {
    var tf = tfById(destMeta.id);
    var map = VM_PLAN_DATA.STYLE_MAP[styleKey];
    var hotelNightly;
    var meta;
    if (tf) {
      hotelNightly = hotelForMonth(tf, styleKey, opts.month);
      meta = monthMeta(tf, opts.month);
    }
    if (!hotelNightly) {
      var fallback = VM_PLAN_DATA.CITY_BASE.city_generic.hotel[styleKey];
      hotelNightly = fallback;
      meta = { tier: seasonKeyFor("city", opts.month), weather: "", crowd: "" };
    }
    var rooms = Math.max(1, Math.ceil((opts.adults + opts.kids) / 2));
    var taxRate = VM_PLAN_DATA.lodgingTaxFor(destMeta);
    var lodgingBase = hotelNightly * opts.nights * rooms;
    var lodging = lodgingBase * (1 + taxRate);
    var daily = (tf && tf.dailyGround && tf.dailyGround[styleKey]) || 75;
    var groundHead = opts.adults + (opts.kids * 0.6);
    var ground = daily * groundHead * (opts.nights + 1);
    var region = destMeta.flightRegion || (tf && tf.regionFlight) || "domestic";
    var surcharge = destMeta.flightSurcharge != null ? destMeta.flightSurcharge : 1;
    var transport = transportCost(opts, region, surcharge);
    var extra = [];
    if (destMeta.region === "Hawaii" || destMeta.flightRegion === "hawaii") {
      var car = (VM_PLAN_DATA.CITY_BASE.hawaii.carPerDay[styleKey] || 75) * opts.nights;
      extra.push(line("Rental car", car, "Island trips without a car look cheaper on paper and get expensive in Ubers."));
    }
    if ((destMeta.id === "smoky_mountains") && (opts.origin === "driving" || opts.origin === "drive") && window.VM_DATA && VM_DATA.ROADTRIP) {
      var R = VM_DATA.ROADTRIP;
      var miles = VM_PLAN_DATA.CITY_BASE.smokies.oneWayMiles;
      transport = (miles * 2 / 24) * R.avgGasPrice + (miles * 2 * R.wearPerMile);
    }
    var taxPct = (taxRate * 100).toFixed(2).replace(/\.00$/, "");
    var seasonLabel = (opts.month === "" || opts.month == null) ? "average of 12 months" : (meta.tier + " · " + (VM_PLAN_DATA.MONTH_NAMES[parseInt(opts.month, 10)] || ""));
    var subLines = [
      line("Lodging + occupancy tax", lodging, money(hotelNightly) + "/night " + styleKey + " · " + rooms + " room" + (rooms === 1 ? "" : "s") + " · " + seasonLabel + " · " + taxPct + "% tax assumption. Trip Finder 2026 hotel band."),
      line("Food, transit & attractions", ground, money(daily) + "/person/day (kids 60%) × " + (opts.nights + 1) + " days including a travel day. Same dailyGround table as Trip Finder."),
      line("Getting there", transport, transportNote(opts, region) + (surcharge !== 1 ? " Route surcharge " + surcharge + "×." : ""))
    ].concat(extra);
    var subtotal = sumLines(subLines);
    var buffer = subtotal * (VM_PLAN_DATA.PLAN_BUFFER || 0.06);
    subLines.push(line("Planning buffer (6%)", buffer, "Contingency for the costs quotes skip — snacks, tips, a bad-weather cab. Cut this first if you are over.", true));
    return {
      summary: destMeta.short + " · " + map.label + " · " + seasonLabel,
      lines: subLines
    };
  }

  function buildPlan(destId, opts, styleKey) {
    var dest = destById(destId);
    if (dest.kind === "disney" || destId === "disney") return disneyPlan(opts, styleKey);
    if (dest.kind === "cruise" || destId === "cruise") return cruisePlan(opts, styleKey);
    if (dest.kind === "ai") return aiPlan(opts, styleKey, dest);
    return tfPlan(opts, styleKey, dest);
  }

  function verdictFor(total, budget) {
    if (total <= budget * 0.92) {
      return { key: "fits", word: "Fits", detail: money(budget - total) + " under your " + money(budget) + " budget. Room to breathe — or to upgrade." };
    }
    if (total <= budget * 1.08) {
      var delta = total - budget;
      var detail = delta <= 0
        ? money(budget - total) + " of slack on a " + money(budget) + " budget. Watch the optional lines."
        : money(delta) + " over " + money(budget) + ". Close enough if you trim one optional line.";
      return { key: "tight", word: "Tight", detail: detail };
    }
    return { key: "over", word: "Over", detail: money(total - budget) + " over your " + money(budget) + " budget. Cut below, or change the destination / nights." };
  }

  function cutsFor(plan, budget) {
    var total = sumLines(plan.lines);
    if (total <= budget) return [];
    var optional = plan.lines.filter(function (l) { return l.optional && l.amount > 0; })
      .slice()
      .sort(function (a, b) { return b.amount - a.amount; });
    var need = total - budget;
    var out = [];
    var saved = 0;
    for (var i = 0; i < optional.length && saved < need; i++) {
      out.push({ label: optional[i].label, save: optional[i].amount, why: optional[i].note || "Optional add-on." });
      saved += optional[i].amount;
    }
    if (saved < need) {
      var dining = plan.lines.filter(function (l) { return /dining|drinks|food/i.test(l.label) && !l.optional && l.amount > 80; })[0];
      if (dining) {
        var trim = dining.amount * 0.22;
        out.push({ label: "Trim " + dining.label.toLowerCase() + " ~20%", save: trim, why: "One fewer table-service meal, skip the drink package, or grocery a couple of breakfasts." });
        saved += trim;
      }
    }
    if (saved < need) {
      var lodging = plan.lines.filter(function (l) { return /lodging|resort|cabin|package|fare/i.test(l.label); })[0];
      if (lodging) {
        var drop = lodging.amount / Math.max(1, 5) * 0.85;
        out.push({ label: "Drop a night or step down a lodging tier", save: drop, why: "Nights and room class move the total more than souvenirs." });
      }
    }
    return out;
  }

  function upgradesFor(plan, destId, opts, styleKey, budget) {
    var dest = destById(destId);
    var total = sumLines(plan.lines);
    var room = budget - total;
    if (room < 80) return [];
    var ideas = [];
    function missing(labelFrag) {
      for (var i = 0; i < plan.lines.length; i++) {
        if (plan.lines[i].label.toLowerCase().indexOf(labelFrag) >= 0 && plan.lines[i].amount > 0) return false;
      }
      return true;
    }
    if (dest.kind === "disney") {
      if (missing("lightning")) ideas.push({ label: "Add Lightning Lane Multi Pass", cost: Math.round(VM_DATA.DISNEY.lightningLanePerDay * (opts.adults + opts.kids) * Math.max(1, opts.nights - 1) * (1 + VM_PLAN_DATA.FL_SALES_TAX)), why: "The add-on most families wish they had priced before day two." });
      if (missing("memory")) ideas.push({ label: "Add Memory Maker", cost: VM_DATA.DISNEY.memoryMaker, why: "Advance PhotoPass — only if the rest of the plan already fits." });
      if (styleKey !== "lux") ideas.push({ label: "Step up one resort tier", cost: Math.round(room * 0.7), why: "Value → Moderate or Moderate → Deluxe, if the leftover covers the nightly jump." });
    } else if (dest.kind === "cruise") {
      if (styleKey === "budget") ideas.push({ label: "Add an unlimited drink package (adults)", cost: Math.round((VM_DATA.CRUISE.drinkPackagePerLine.carnival.unlimited) * opts.nights * opts.adults), why: "Only if you will actually use it. See the cruise calculator for break-even." });
      ideas.push({ label: "Upgrade the cabin one step", cost: VM_DATA.CRUISE.cabinUpgrade.balcony / 2 * Math.min(2, opts.adults + opts.kids), why: "Interior → oceanview or balcony, priced per person on the first two guests." });
    } else if (dest.kind === "ai") {
      ideas.push({ label: "One specialty / off-resort dinner", cost: VM_DATA.ALLINC.aiHiddenAdditions.premiumDining * (opts.adults + opts.kids), why: "The package covers most meals. This is the night you leave the property." });
      if (missing("spa")) ideas.push({ label: "Add a spa visit", cost: VM_DATA.ALLINC.aiHiddenAdditions.spaPerTrip, why: "Not included in the all-inclusive rate." });
    } else {
      ideas.push({ label: "One nicer dinner + a paid attraction", cost: Math.round(90 * (opts.adults + opts.kids * 0.7)), why: "Spend leftover on the trip, not on a vaguely bigger hotel." });
    }
    ideas.push({ label: "Park the leftover in the funding plan", cost: Math.round(room), why: "If you do not need to spend it, do not. The funding calculator turns slack into a weekly target." });
    return ideas.filter(function (u) { return u.cost > 0 && u.cost <= room * 1.15; }).slice(0, 4);
  }

  function readOpts() {
    return {
      dest: ($("p-dest") || {}).value || "disney",
      budget: Math.max(500, parseFloat(($("p-budget") || {}).value) || 6000),
      adults: Math.max(1, parseInt(($("p-adults") || {}).value, 10) || 2),
      kids: Math.max(0, parseInt(($("p-kids") || {}).value, 10) || 0),
      infants: Math.max(0, parseInt(($("p-infants") || {}).value, 10) || 0),
      nights: Math.max(1, Math.min(21, parseInt(($("p-nights") || {}).value, 10) || 5)),
      origin: ($("origin") || {}).value || "atl",
      style: ($("p-style") || {}).value || "mid",
      month: ($("p-month") || {}).value
    };
  }

  function dataPack() {
    if (window.VM_DATA) return window.VM_DATA;
    if (typeof VM_DATA !== "undefined") return VM_DATA;
    return {};
  }

  function joinAnd(arr) {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + " and " + arr[1];
    return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
  }

  function roomsFor(opts) {
    return Math.max(1, Math.ceil((opts.adults + opts.kids) / 2));
  }

  function seasonFromMonthly(tf, dest, opts, styleKey) {
    var names = VM_PLAN_DATA.MONTH_NAMES;
    var nights = opts.nights;
    var rooms = roomsFor(opts);
    var months = [];
    for (var i = 0; i < 12; i++) {
      var row = tf.monthly[i] || {};
      var hotel = row.hotel || {};
      var nightly = hotel[styleKey] || 0;
      months.push({
        idx: i,
        name: names[i],
        closed: nightly <= 0,
        lodging: nightly > 0 ? nightly * nights * rooms : 0,
        nightly: nightly,
        weather: row.weather || "",
        tier: row.tier || "",
        crowd: row.crowd || ""
      });
    }
    var open = months.filter(function (m) { return !m.closed; });
    if (!open.length) return null;

    var stormyOrClosed = [];
    var peakHigh = [];
    months.forEach(function (m) {
      if (m.closed) {
        stormyOrClosed.push(m);
        return;
      }
      if (m.weather === "stormy") stormyOrClosed.push(m);
    });
    var maxLodging = 0;
    open.forEach(function (m) { if (m.lodging > maxLodging) maxLodging = m.lodging; });
    open.forEach(function (m) {
      if (m.tier === "peak" && m.lodging >= maxLodging * 0.92 && m.weather !== "stormy") {
        peakHigh.push(m);
      }
    });
    peakHigh.sort(function (a, b) { return b.lodging - a.lodging; });

    var skipSet = {};
    var skipItems = [];
    function addSkip(m, why) {
      if (skipSet[m.idx]) return;
      skipSet[m.idx] = true;
      skipItems.push(m.name + " — " + why);
    }
    stormyOrClosed.forEach(function (m) {
      addSkip(m, m.closed ? "Most lodging is closed or unpriced." : "Storm / hurricane band. Cheap room, expensive weather.");
    });
    peakHigh.slice(0, 3).forEach(function (m) {
      addSkip(m, "Peak demand. Lodging near the annual high (" + money(m.nightly) + "/night " + styleKey + ").");
    });

    var candidates = open.filter(function (m) { return m.weather !== "stormy"; });
    if (!candidates.length) candidates = open.slice();
    candidates.sort(function (a, b) { return a.lodging - b.lodging; });
    var best = [candidates[0]];
    if (candidates[1] && candidates[1].lodging <= candidates[0].lodging * 1.08) best.push(candidates[1]);
    else if (candidates[1] && candidates[1].tier !== "peak") best.push(candidates[1]);

    var cheapest = open.slice().sort(function (a, b) { return a.lodging - b.lodging; })[0];
    var peak = open.slice().sort(function (a, b) { return b.lodging - a.lodging; })[0];

    var selected;
    var selectedLabel;
    if (opts.month === "" || opts.month == null) {
      var sum = 0;
      open.forEach(function (m) { sum += m.lodging; });
      selected = { lodging: sum / open.length, name: "typical season", nightly: (sum / open.length) / (nights * rooms) };
      selectedLabel = "a typical month (12-month open average)";
    } else {
      var sm = months[parseInt(opts.month, 10)];
      if (sm && !sm.closed) {
        selected = sm;
        selectedLabel = sm.name;
      } else {
        var avg = 0;
        open.forEach(function (m) { avg += m.lodging; });
        selected = { lodging: avg / open.length, name: sm ? sm.name : "typical", nightly: 0 };
        selectedLabel = (sm ? sm.name : "that month") + " is closed — using the open-month average";
      }
    }

    var vsBest = Math.round(selected.lodging - cheapest.lodging);
    var vsPeak = Math.round(peak.lodging - selected.lodging);
    var impact;
    if (vsBest <= 40) {
      impact = selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1) + " is already near the cheapest lodging band (" + money(cheapest.lodging) + " for " + nights + " night" + (nights === 1 ? "" : "s") + ", " + rooms + " room" + (rooms === 1 ? "" : "s") + "). Peak " + peak.name + " runs about " + money(peak.lodging) + " — " + money(Math.max(0, vsPeak)) + " more.";
    } else {
      impact = selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1) + " lodging is about " + money(selected.lodging) + ". Cheapest open month (" + cheapest.name + ") is " + money(cheapest.lodging) + " — " + money(vsBest) + " less. Peak " + peak.name + " is " + money(peak.lodging) + " (" + money(Math.max(0, vsPeak)) + " more than this month).";
    }

    var bestBits = best.map(function (m) {
      var extra = [];
      if (m.weather) extra.push(m.weather + " weather");
      if (m.tier) extra.push(m.tier + " rates");
      return m.name + (extra.length ? " (" + extra.join(", ") + ")" : "");
    });

    return {
      kicker: "Season",
      title: "Best: " + joinAnd(best.map(function (m) { return m.name; })) + ". Skip: " + (skipItems.length ? joinAnd(skipItems.map(function (s) { return s.split(" — ")[0]; }).slice(0, 3)) : "no hard-skip month"),
      body: "Lodging $ from the Trip Finder 2026 " + styleKey + " hotel band × " + nights + " night" + (nights === 1 ? "" : "s") + " × " + rooms + " room" + (rooms === 1 ? "" : "s") + ". Same monthly table as the itemized plan." + (dest.short ? " " + dest.short + "." : ""),
      items: bestBits.map(function (b) { return "Aim for " + b + "."; }).concat(skipItems.slice(0, 3)),
      impact: impact
    };
  }

  function seasonFromBands(kind, dest, opts, styleKey) {
    var pack = VM_PLAN_DATA.SEASON[kind] || VM_PLAN_DATA.SEASON.city;
    var names = VM_PLAN_DATA.MONTH_NAMES;
    var keys = VM_PLAN_DATA.SEASON_KEYS;
    var nights = opts.nights;
    var rooms = dest.kind === "disney" || dest.kind === "cruise" ? 1 : roomsFor(opts);

    function lodgingAt(monthIdx) {
      var band = pack[monthIdx];
      var key = keys[band] || "avg";
      if (dest.kind === "disney" && dataPack().DISNEY) {
        var map = VM_PLAN_DATA.STYLE_MAP[styleKey];
        var resort = dataPack().DISNEY.resorts[map.disneyResort];
        return (resort[key] || resort.avg) * nights;
      }
      if (dest.kind === "cruise" && dataPack().CRUISE) {
        var data = dataPack();
        var lines = data.CRUISE_LINES_EXPANDED || {};
        var lineKey = styleKey === "budget" ? "carnival" : (styleKey === "lux" ? "ncl" : "royal_caribbean");
        var cruiseLine = lines[lineKey] || { perPersonAvg: 900 };
        var cabinAdd = (data.CRUISE.cabinUpgrade && data.CRUISE.cabinUpgrade[VM_PLAN_DATA.STYLE_MAP[styleKey].cruiseCabin]) || 0;
        var per = (cruiseLine.perPersonAvg * (nights / 7) + cabinAdd) * Math.min(2, opts.adults + opts.kids);
        return per * seasonMult(key);
      }
      var nightly = ((VM_PLAN_DATA.CITY_BASE.city_generic.hotel || {})[styleKey]) || 210;
      return nightly * seasonMult(key) * nights * rooms;
    }

    var scored = [];
    for (var i = 0; i < 12; i++) {
      scored.push({ idx: i, name: names[i], band: pack[i], key: keys[pack[i]] || "avg", lodging: lodgingAt(i) });
    }
    var best = scored.filter(function (m) { return m.band === 0; }).slice(0, 3);
    var skip = scored.filter(function (m) { return m.band === 2; });
    skip.sort(function (a, b) { return b.lodging - a.lodging; });
    skip = skip.slice(0, 3);
    if (!best.length) {
      var lows = scored.slice().sort(function (a, b) { return a.lodging - b.lodging; });
      best = lows.slice(0, 2);
    }
    var cheapest = scored.slice().sort(function (a, b) { return a.lodging - b.lodging; })[0];
    var peak = scored.slice().sort(function (a, b) { return b.lodging - a.lodging; })[0];

    var selectedLodging;
    var selectedLabel;
    if (opts.month === "" || opts.month == null) {
      var avgSum = 0;
      scored.forEach(function (m) { avgSum += m.lodging; });
      selectedLodging = avgSum / 12;
      selectedLabel = "a typical month";
    } else {
      var sm = scored[parseInt(opts.month, 10)];
      selectedLodging = sm.lodging;
      selectedLabel = sm.name;
    }
    var vsBest = Math.round(selectedLodging - cheapest.lodging);
    var vsPeak = Math.round(peak.lodging - selectedLodging);
    var what = dest.kind === "cruise" ? "cabin fare (first two guests)" : (dest.kind === "disney" ? "resort lodging" : "lodging");
    var impact = selectedLabel.charAt(0).toUpperCase() + selectedLabel.slice(1) + " " + what + " is about " + money(selectedLodging) +
      ". Cheapest band (" + cheapest.name + ") is " + money(cheapest.lodging) +
      (vsBest > 40 ? " — " + money(vsBest) + " less" : " (already close)") +
      ". Peak " + peak.name + " is " + money(peak.lodging) +
      (vsPeak > 40 ? " — " + money(vsPeak) + " more" : "") + ".";

    return {
      kicker: "Season",
      title: "Best: " + joinAnd(best.map(function (m) { return m.name; })) + ". Skip: " + (skip.length ? joinAnd(skip.map(function (m) { return m.name; })) : "no hard-skip month"),
      body: dest.kind === "disney"
        ? "Disney room bands (low / average / high) from the same 2026 resort table as the itemized plan, × " + nights + " nights."
        : dest.kind === "cruise"
          ? "Caribbean cruise season bands applied to the first-two-guest cabin fare. Shoulder weeks cut the cabin; holiday weeks do not."
          : "Season bands applied to the " + styleKey + " nightly hotel rate × " + nights + " nights.",
      items: best.map(function (m) { return "Aim for " + m.name + " (" + m.key + " season, about " + money(m.lodging) + ")."; })
        .concat(skip.map(function (m) { return "Skip " + m.name + " if you can — " + m.key + " season, about " + money(m.lodging) + "."; })),
      impact: impact
    };
  }

  function buildSeasonRec(dest, opts, styleKey) {
    if (dest.kind === "disney") return seasonFromBands("disney", dest, opts, styleKey);
    if (dest.kind === "cruise") return seasonFromBands("cruise", dest, opts, styleKey);
    var tf = tfById(dest.id);
    if (tf && tf.monthly) {
      var fromTf = seasonFromMonthly(tf, dest, opts, styleKey);
      if (fromTf) return fromTf;
    }
    var kind = dest.kind === "ai" ? "cancun" : (dest.flightRegion === "hawaii" ? "hawaii" : "city");
    return seasonFromBands(kind, dest, opts, styleKey);
  }

  function buildHotelRec(dest, styleKey) {
    var styleLabel = (VM_PLAN_DATA.STYLE_MAP[styleKey] || {}).label || styleKey;
    var curated = VM_PLAN_DATA.HOTEL_EXAMPLES[dest.id];
    if (curated && curated[styleKey] && curated[styleKey].length) {
      return {
        kicker: dest.kind === "cruise" ? "Cabin" : "Hotel",
        title: styleLabel + " class — " + dest.short,
        body: "Example properties and classes for the style you picked. Not a ranking and not live inventory.",
        items: curated[styleKey].slice(0, 3),
        impact: ""
      };
    }
    if (dest.kind === "ai" && dest.aiId && dataPack().AI_DESTINATIONS) {
      var ai = null;
      var aiList = dataPack().AI_DESTINATIONS;
      for (var i = 0; i < aiList.length; i++) {
        if (aiList[i].id === dest.aiId) ai = aiList[i];
      }
      var tier = styleKey === "lux" ? "luxury" : styleKey;
      var brandStr = ai && ai.brands ? (ai.brands[tier] || ai.brands.mid || "") : "";
      var items = brandStr ? brandStr.split(",").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 3) : [];
      if (items.length) {
        return {
          kicker: "Hotel",
          title: styleLabel + " all-inclusive class — " + dest.short,
          body: "Typical of the dedicated all-inclusive rate table. Confirm the actual property before you deposit.",
          items: items,
          impact: ""
        };
      }
    }
    if (dest.kind === "disney") {
      var resort = VM_PLAN_DATA.STYLE_MAP[styleKey];
      var D = (dataPack().DISNEY && dataPack().DISNEY.resorts) || {};
      var row = D[resort.disneyResort] || {};
      return {
        kicker: "Hotel",
        title: (row.label || "Disney resort") + "",
        body: "Disney World lodging class for the style you picked. Off-property is the budget escape hatch.",
        items: [
          row.label || "On-property resort matching this style",
          styleKey === "budget" ? "Off-property Disney Springs / nearby hotel if the value resorts are sold out" : "One room; walk or bus to the parks",
          styleKey === "lux" ? "Deluxe villa only if leftover covers the jump" : "Skip the club-level upsell unless leftover is real"
        ],
        impact: ""
      };
    }
    if (dest.kind === "cruise") {
      var cabin = VM_PLAN_DATA.STYLE_MAP[styleKey].cruiseCabin;
      return {
        kicker: "Cabin",
        title: cabin.charAt(0).toUpperCase() + cabin.slice(1) + " class",
        body: "Cabin class for the style you picked. Guarantee cabins save money if you can live without picking the deck.",
        items: styleKey === "budget"
          ? ["Carnival or MSC interior", "Guarantee cabin if a window is optional", "Skip the drink package until you run the break-even"]
          : styleKey === "lux"
            ? ["NCL Haven / suite or Princess Plus-style fare", "Suite gratuities are higher — already a separate line", "Wi-Fi is in the stretch plan, not the fare"]
            : ["Royal Caribbean balcony on a 7-night Caribbean", "Central-ship balcony if you get seasick", "Drink package only if leftover covers it"],
        impact: ""
      };
    }
    var generic = {
      budget: ["2-star / limited-service or guesthouse class", "Walk-to-transit beats a cheap room far from everything", "Skip hotel breakfast if a bakery is on the block"],
      mid: ["3–4 star neighborhood hotel", "One room, not a suite, unless leftover is real", "Location over a rooftop pool you will use twice"],
      lux: ["4–5 star flagship or design hotel", "Only if leftover covers the jump from mid-range", "Luxury is the room — do not also buy every paid tour"]
    };
    return {
      kicker: "Hotel",
      title: styleLabel + " class — " + dest.short,
      body: "No curated property list for this city. Use the class, then price two neighborhoods.",
      items: generic[styleKey] || generic.mid,
      impact: ""
    };
  }

  function buildAirlineRec(dest, opts) {
    var originId = opts.origin === "drive" ? "driving" : (opts.origin || "atl");
    var hubs = VM_PLAN_DATA.ORIGIN_HUBS || {};
    var hub = hubs[originId] || {
      city: "your airport",
      carrier: "",
      tip: "Compare the nearest hub on the same week. Midweek usually beats Sunday."
    };
    var region = dest.flightRegion || "domestic";
    var regionTip = (VM_PLAN_DATA.REGION_AIR && VM_PLAN_DATA.REGION_AIR[region]) ||
      "Book the pattern for this region, then price two nearby dates. We do not invent flight numbers.";
    var driving = originId === "driving";
    var items = [];
    if (hub.tip) items.push(hub.tip);
    if (!driving) items.push(regionTip);
    items.push("No flight numbers on purpose — those change weekly. Use the hub pattern, then price two midweek dates.");
    if (driving && isFlyOnlyRegion(region)) {
      items.unshift("Driving does not replace a flight here. Pick an origin airport or add airfare.");
    }
    var title = driving
      ? (isFlyOnlyRegion(region) ? "You still need a flight" : "Drive — no airfare in the plan")
      : ((hub.city || "Your hub") + (hub.carrier ? " · " + hub.carrier : "") + " → " + (dest.short || dest.label));
    return {
      kicker: "Airline",
      title: title,
      body: driving
        ? "Ground-transport allowance is already in the itemized plan when driving can replace the flight."
        : "Pattern from your origin, not a specific itinerary. Same airfare band as the Getting-there line.",
      items: items.slice(0, 4),
      impact: ""
    };
  }

  function foodFallbackItems() {
    return [
      "Grocery or bakery breakfasts most mornings",
      "One sit-down dinner, not one every night",
      "Skip the hotel restaurant unless breakfast is already in the rate"
    ];
  }

  function buildFoodRec(dest, opts, styleKey) {
    var curated = VM_PLAN_DATA.FOOD_PICKS[dest.id];
    var styleLabel = (VM_PLAN_DATA.STYLE_MAP[styleKey] || {}).label || styleKey;
    var days = opts.nights + 1;
    var people = opts.adults + opts.kids * 0.6;
    var items = curated && curated.picks ? curated.picks.slice(0, 3) : foodFallbackItems();
    var note = curated && curated.note ? curated.note : "Grocery breakfasts, one sit-down dinner, skip hotel restaurants. That pattern holds in most cities.";
    var title;
    var body;
    var impact = "";

    if (dest.kind === "disney" && dataPack().DISNEY) {
      var map = VM_PLAN_DATA.STYLE_MAP[styleKey];
      var dining = dataPack().DISNEY.dining[map.disneyDining];
      var foodHead = opts.adults + (opts.kids * 0.7);
      var diningScale = Math.max(0.5, foodHead / 4);
      var diningTot = dining.perDay * opts.nights * diningScale;
      var snacks = dataPack().DISNEY.snacksPerPersonPerDay * foodHead * opts.nights;
      var perDay = (diningTot + snacks) / Math.max(1, days);
      title = "About " + money(perDay) + " / day for the party";
      body = dining.label + ". In-park food is the line that blows Disney budgets. The dining plan is usually a bad buy.";
      impact = "Dining + snacks in this plan: " + money(diningTot + snacks) + " across " + opts.nights + " nights.";
    } else if (dest.kind === "cruise") {
      title = "Main dining is in the fare";
      body = "The cabin fare already includes the dining room. The leak is specialty restaurants, drink packages, and room-service fees.";
      impact = styleKey === "budget"
        ? "This plan prices pay-as-you-go drinks, not a package. Run the break-even before you tap yes."
        : "Unlimited adult drinks + kids soda are in the itemized plan. Specialty dining is leftover-only.";
    } else if (dest.kind === "ai") {
      var extra = Math.round((styleKey === "lux" ? 45 : 25) * (opts.adults + opts.kids) * Math.min(2, opts.nights / 3));
      title = "Meals are in the package";
      body = "All-inclusive food is the product. Budget extras for the night you leave the property and the 'included' bottled water you still tip for.";
      impact = "Plan about " + money(extra) + " extra if you want one off-resort dinner for the party. Tips are already a separate line.";
    } else {
      var tf = tfById(dest.id);
      var ground = tf && tf.dailyGround ? tf.dailyGround : null;
      var daily = (ground && ground[styleKey]) || (VM_PLAN_DATA.CITY_BASE.city_generic.food && VM_PLAN_DATA.CITY_BASE.city_generic.food[styleKey]) || 75;
      var partyDay = daily * Math.max(1, opts.adults + opts.kids * 0.6);
      title = "About " + money(daily) + " / person / day";
      var band = "";
      if (ground) {
        band = " Style bands: budget " + money(ground.budget) + " · mid " + money(ground.mid) + " · lux " + money(ground.lux) + " / person / day (food, local transit, attractions).";
      }
      body = styleLabel + " daily-ground band from Trip Finder." + band;
      impact = "This plan uses " + money(partyDay) + " / day for the party × " + days + " days (including a travel day).";
    }

    return {
      kicker: "Food",
      title: title,
      body: note,
      items: items,
      impact: (body && dest.kind !== "disney" && dest.kind !== "cruise" && dest.kind !== "ai" ? body + " " : (dest.kind === "disney" || dest.kind === "cruise" || dest.kind === "ai" ? body + " " : "")) + impact
    };
  }

  function buildRecs(dest, opts, styleKey) {
    return {
      season: buildSeasonRec(dest, opts, styleKey),
      hotel: buildHotelRec(dest, styleKey),
      airline: buildAirlineRec(dest, opts),
      food: buildFoodRec(dest, opts, styleKey)
    };
  }

  function recsHtml(recs) {
    function card(r) {
      if (!r) return "";
      var list = "";
      if (r.items && r.items.length) {
        list = "<ul class=\"plan-rec-list\">" + r.items.map(function (it) {
          return "<li>" + esc(it) + "</li>";
        }).join("") + "</ul>";
      }
      var impact = r.impact ? "<p class=\"plan-rec-impact\">" + esc(r.impact) + "</p>" : "";
      var body = r.body ? "<p class=\"plan-rec-body\">" + esc(r.body) + "</p>" : "";
      return "<article class=\"plan-rec-card\">" +
        "<p class=\"plan-rec-kicker\">" + esc(r.kicker) + "</p>" +
        "<h4 class=\"plan-rec-title\">" + esc(r.title) + "</h4>" +
        body + list + impact +
        "</article>";
    }
    return "<h3 class=\"panel-title\">Recommendations</h3>" +
      "<p class=\"plan-section-sub\">Season, hotel class, airline patterns from your origin, and a food band. Orientation for the itemized plan — not live inventory and not flight numbers.</p>" +
      "<div class=\"plan-recs\">" +
        card(recs.season) + card(recs.hotel) + card(recs.airline) + card(recs.food) +
      "</div>";
  }

  function compute() {
    var opts = readOpts();
    var dest = destById(opts.dest);
    var recommended = buildPlan(opts.dest, opts, opts.style);
    var recTotal = sumLines(recommended.lines);
    var tiers = ["lean", "solid", "stretch"].map(function (key) {
      var def = VM_PLAN_DATA.TIER_DEFS[key];
      var style = key === "solid" ? opts.style : shiftStyle(opts.style, def.styleShift);
      var built = key === "solid" ? recommended : buildPlan(opts.dest, opts, style);
      return {
        key: key,
        label: def.label,
        hint: def.hint,
        style: style,
        styleLabel: VM_PLAN_DATA.STYLE_MAP[style].label,
        total: sumLines(built.lines),
        recommended: key === "solid"
      };
    });
    return {
      opts: opts,
      dest: dest,
      recommended: recommended,
      total: recTotal,
      verdict: verdictFor(recTotal, opts.budget),
      tiers: tiers,
      cuts: cutsFor(recommended, opts.budget),
      upgrades: upgradesFor(recommended, opts.dest, opts, opts.style, opts.budget),
      recs: buildRecs(dest, opts, opts.style)
    };
  }

  function render(model) {
    var el = $("results");
    if (!el) return;
    var o = model.opts;
    var people = o.adults + o.kids + o.infants;
    var v = model.verdict;
    var monthLabel = (o.month === "" || o.month == null)
      ? "typical season"
      : (VM_PLAN_DATA.MONTH_NAMES[parseInt(o.month, 10)] || "typical season");

    var rows = model.recommended.lines.map(function (ln) {
      if (ln.amount <= 0) {
        return "<tr><th>" + esc(ln.label) + (ln.note ? "<span class=\"plan-line-note\">" + esc(ln.note) + "</span>" : "") + "</th><td>Not in this plan</td></tr>";
      }
      return "<tr><th>" + esc(ln.label) + (ln.note ? "<span class=\"plan-line-note\">" + esc(ln.note) + "</span>" : "") + "</th><td>" + money(ln.amount) + "</td></tr>";
    }).join("");

    var tierCards = model.tiers.map(function (t) {
      var cls = "plan-tier-card" + (t.recommended ? " is-recommended" : "");
      var vs = t.total <= o.budget ? "under budget" : money(t.total - o.budget) + " over";
      return "<article class=\"" + cls + "\"><p class=\"plan-tier-label\">" + esc(t.label) + (t.recommended ? " · recommended" : "") + "</p><p class=\"plan-tier-total\">" + money(t.total) + "</p><p class=\"plan-tier-meta\">" + esc(t.styleLabel) + " · " + vs + "</p><p class=\"plan-tier-hint\">" + esc(t.hint) + "</p></article>";
    }).join("");

    var cutsHtml = "";
    if (model.cuts.length) {
      cutsHtml = "<h3 class=\"panel-title\">Cut these first</h3><ul class=\"plan-cut-list\">" +
        model.cuts.map(function (c) {
          return "<li><strong>" + esc(c.label) + "</strong> <span class=\"plan-save\">saves ~" + money(c.save) + "</span> — " + esc(c.why) + "</li>";
        }).join("") + "</ul>";
    }

    var upHtml = "";
    if (model.upgrades.length && v.key !== "over") {
      upHtml = "<h3 class=\"panel-title\">If you have leftover</h3><ul class=\"plan-upgrade-list\">" +
        model.upgrades.map(function (u) {
          return "<li><strong>" + esc(u.label) + "</strong> (~" + money(u.cost) + ") — " + esc(u.why) + "</li>";
        }).join("") + "</ul>";
    }

    var deep = [
      { href: model.dest.detailHref, label: model.dest.detailLabel },
      { href: "/disney", label: "Disney World Cost Calculator" },
      { href: "/cruise", label: "Cruise Cost Calculator" },
      { href: "/allinclusive", label: "All-Inclusive Calculator" },
      { href: "/tripfinder", label: "Trip Finder" },
      { href: "/budget", label: "Budget Reverse Math" },
      { href: "/funding", label: "Plan The Funding" }
    ];
    var seen = {};
    var deepHtml = "<h3 class=\"panel-title\">Go deeper</h3><ul class=\"plan-deep-links\">" +
      deep.filter(function (d) {
        if (!d.href || seen[d.href]) return false;
        seen[d.href] = true;
        return true;
      }).map(function (d) {
        return "<li><a href=\"" + esc(d.href) + "\">" + esc(d.label) + "</a></li>";
      }).join("") + "</ul>";

    el.classList.add("has-results");
    el.innerHTML =
      "<div class=\"plan-headline\">" +
        "<p class=\"plan-kicker\">Recommended plan</p>" +
        "<h2 class=\"plan-dest-title\">" + esc(model.dest.label) + "</h2>" +
        "<p class=\"plan-headline-sub\">" + esc(model.recommended.summary) + " · " + people + " traveler" + (people === 1 ? "" : "s") + " · " + o.nights + " night" + (o.nights === 1 ? "" : "s") + " · " + esc(monthLabel) + "</p>" +
        "<p class=\"plan-headline-total\">All-in estimate " + money(model.total) + " vs " + money(o.budget) + " budget (" + money(model.total / Math.max(1, people)) + " per person).</p>" +
      "</div>" +
      "<div class=\"plan-verdict-lg " + v.key + "\"><span class=\"plan-verdict-word\">" + v.word + "</span><span class=\"plan-verdict-detail\">" + esc(v.detail) + "</span></div>" +
      "<h3 class=\"panel-title\">Lean / Solid / Stretch</h3>" +
      "<p class=\"plan-section-sub\">Solid is the style you picked. Lean steps down one lodging/style band when one exists. Stretch steps up.</p>" +
      "<div class=\"plan-tiers\">" + tierCards + "</div>" +
      "<h3 class=\"panel-title\">Itemized recommended plan</h3>" +
      "<table class=\"plan-itemize\"><thead><tr><th>Line</th><th>Amount</th></tr></thead><tbody>" +
        rows +
        "<tr class=\"plan-itemize-total\"><th>Estimated total</th><td>" + money(model.total) + "</td></tr>" +
      "</tbody></table>" +
      cutsHtml + upHtml + recsHtml(model.recs) + deepHtml;

    var email = $("email-section");
    if (email) email.hidden = false;

    var blurb = $("p-dest-blurb");
    if (blurb) blurb.textContent = model.dest.blurb || "";
  }

  function populateDestinations() {
    var sel = $("p-dest");
    if (!sel || !window.VM_PLAN_DATA) return;
    var current = sel.value || "disney";
    var list = catalog();
    sel.innerHTML = "";
    var groups = {};
    list.forEach(function (d) {
      var region = d.region || "Other";
      (groups[region] = groups[region] || []).push(d);
    });
    var order = VM_PLAN_DATA.REGION_ORDER || [];
    order.forEach(function (region) {
      var items = groups[region];
      if (!items || !items.length) return;
      var og = document.createElement("optgroup");
      og.label = region === "Featured" ? "Featured (deep math)" : region;
      items.forEach(function (d) {
        var opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.label;
        opt.setAttribute("data-search", (d.search || d.label).toLowerCase());
        if (d.id === current) opt.selected = true;
        og.appendChild(opt);
      });
      sel.appendChild(og);
    });
    Object.keys(groups).forEach(function (region) {
      if (order.indexOf(region) >= 0) return;
      var og = document.createElement("optgroup");
      og.label = region;
      groups[region].forEach(function (d) {
        var opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.label;
        opt.setAttribute("data-search", (d.search || d.label).toLowerCase());
        if (d.id === current) opt.selected = true;
        og.appendChild(opt);
      });
      sel.appendChild(og);
    });
    updateDestCount();
  }

  function updateDestCount() {
    var sel = $("p-dest");
    var el = $("p-dest-count");
    if (!sel || !el) return;
    var opts = sel.querySelectorAll("option");
    var visible = 0;
    for (var i = 0; i < opts.length; i++) {
      if (!opts[i].hidden && !opts[i].disabled) visible++;
    }
    el.textContent = visible + " destination" + (visible === 1 ? "" : "s") + " in the list. Same 2026 catalog as Trip Finder, plus Disney World and a Caribbean cruise.";
  }

  function filterDestinations() {
    var sel = $("p-dest");
    var input = $("p-dest-filter");
    if (!sel) return;
    var q = ((input && input.value) || "").toLowerCase().trim();
    var groups = sel.querySelectorAll("optgroup");
    var firstVisible = null;
    for (var g = 0; g < groups.length; g++) {
      var any = false;
      var options = groups[g].querySelectorAll("option");
      for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var hay = (opt.textContent + " " + opt.value + " " + (opt.getAttribute("data-search") || "")).toLowerCase();
        var ok = !q || hay.indexOf(q) >= 0;
        opt.hidden = !ok;
        opt.disabled = !ok;
        if (ok) {
          any = true;
          if (!firstVisible) firstVisible = opt;
        }
      }
      groups[g].hidden = !any;
    }
    var current = sel.options[sel.selectedIndex];
    if (current && (current.hidden || current.disabled) && firstVisible) {
      sel.value = firstVisible.value;
    }
    updateDestCount();
    var chips = document.querySelectorAll(".plan-shortcut");
    for (var c = 0; c < chips.length; c++) {
      chips[c].classList.toggle("is-active", chips[c].getAttribute("data-dest") === sel.value);
    }
  }

  function renderShortcuts() {
    var wrap = $("p-dest-shortcuts");
    if (!wrap || !window.VM_PLAN_DATA) return;
    wrap.innerHTML = "";
    (VM_PLAN_DATA.POPULAR || []).forEach(function (p) {
      var list = catalog();
      var exists = false;
      for (var i = 0; i < list.length; i++) if (list[i].id === p.id) exists = true;
      if (!exists) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "plan-shortcut" + (p.id === "disney" ? " is-active" : "");
      btn.setAttribute("data-dest", p.id);
      btn.textContent = p.label;
      btn.addEventListener("click", function () {
        var sel = $("p-dest");
        var filter = $("p-dest-filter");
        if (filter) filter.value = "";
        if (sel) sel.value = p.id;
        filterDestinations();
        var blurb = $("p-dest-blurb");
        var d = destById(p.id);
        if (blurb) blurb.textContent = d.blurb || "";
        render(compute());
      });
      wrap.appendChild(btn);
    });
  }

  function bind() {
    if (window.VM_PLAN_DATA && VM_PLAN_DATA.refreshCatalog) VM_PLAN_DATA.refreshCatalog();
    populateDestinations();
    renderShortcuts();
    if (window.VM_OriginPicker) {
      VM_OriginPicker.buildOriginDropdown($("origin"), "atl");
      VM_OriginPicker.wireZipAutoSelect($("origin-zip"), $("origin"), $("origin-zip-status"));
    }

    var go = $("p-calculate");
    if (go) {
      go.addEventListener("click", function (e) {
        e.preventDefault();
        render(compute());
        if (window.innerWidth < 900 && $("results")) {
          $("results").scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    var filter = $("p-dest-filter");
    if (filter) {
      filter.addEventListener("input", function () {
        filterDestinations();
        render(compute());
      });
    }

    ["p-dest", "p-budget", "p-adults", "p-kids", "p-infants", "p-nights", "origin", "p-style", "p-month"].forEach(function (id) {
      var node = $(id);
      if (!node) return;
      var evt = node.tagName === "SELECT" ? "change" : "input";
      node.addEventListener(evt, function () {
        if (id === "p-dest") {
          var d = destById(node.value);
          var blurb = $("p-dest-blurb");
          if (blurb) blurb.textContent = d.blurb || "";
          var chips = document.querySelectorAll(".plan-shortcut");
          for (var c = 0; c < chips.length; c++) {
            chips[c].classList.toggle("is-active", chips[c].getAttribute("data-dest") === node.value);
          }
        }
        render(compute());
      });
    });

    render(compute());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  window.VM_PLAN = {
    compute: compute,
    buildPlan: buildPlan,
    buildRecs: buildRecs,
    destById: destById,
    catalog: catalog,
    filterDestinations: filterDestinations
  };
})();
