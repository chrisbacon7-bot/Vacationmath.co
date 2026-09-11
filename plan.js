/* =====================================================================
   Vacation Math — Trip Plan (destination + hard budget)
   Constrains one destination to a budget. Uses VM_DATA + VM_PLAN_DATA.
   No affiliate widgets. Estimates only — not live quotes.
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

  function destById(id) {
    var list = (window.VM_PLAN_DATA && VM_PLAN_DATA.DESTINATIONS) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || { id: "disney", label: "Walt Disney World", short: "Disney World", kind: "disney", flightRegion: "domestic", detailHref: "/disney", detailLabel: "Disney World Cost Calculator", blurb: "" };
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
    return table[key] || table.atl || { domestic: 340, caribbean: 380, hawaii: 760 };
  }

  function transportCost(opts, region) {
    var driving = opts.origin === "driving" || opts.origin === "drive";
    var ticketed = opts.adults + opts.kids;
    if (driving) {
      if (region === "caribbean" || region === "hawaii") return 0;
      return (VM_PLAN_DATA.DRIVE_COST_PER_PERSON || 220) * ticketed;
    }
    var fares = getFares(opts.origin);
    var per = fares[region] != null ? fares[region] : fares.domestic;
    return (per || 0) * ticketed;
  }

  function transportNote(opts, region) {
    var driving = opts.origin === "driving" || opts.origin === "drive";
    if (driving && (region === "caribbean" || region === "hawaii")) {
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
    var transport = transportCost(opts, "domestic");
    var lines = [
      line("Resort lodging + 12.5% tax", lodgingBase + lodgingTax, resort.label + " · " + season + " season · Orange County 12.5% lodging tax on the room."),
      line("Park tickets + 6.5% tax", ticketsBase + ticketsTax, parkDays + " park day" + (parkDays === 1 ? "" : "s") + " · kids ~$5 less · under 3 free · FL 6.5% sales tax."),
      line("Lightning Lane Multi Pass + 6.5% tax", includeLL ? ll : 0, includeLL ? "Ages 3+ · FL sales tax on the pass." : "Left off the budget plan — add it as an upgrade if the number allows.", true),
      line("Dining", dining, D.dining[map.disneyDining].label + ", scaled to your party."),
      line("Snacks & drinks", snacks, "In-park snacks and bottled drinks, ages 3+ weighted."),
      line("Tips", tips, "Housekeeping and dining tips, scaled from a 5-night baseline."),
      line("Memory Maker", includeMemory ? D.memoryMaker : 0, includeMemory ? "Advance PhotoPass package." : "Optional PhotoPass package — not required to walk the parks.", true),
      line("Souvenir budget", souvenir, "Conservative. Easy to double if you let the shops win."),
      line("Getting there", transport, transportNote(opts, "domestic"))
    ];
    return {
      summary: map.label + " Disney plan · " + resort.label.split(" (")[0] + " · " + season + " season",
      lines: lines
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
    var transport = transportCost(opts, "domestic");
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

  function cancunPlan(opts, styleKey) {
    var dests = VM_DATA.AI_DESTINATIONS || [];
    var dest = null;
    for (var i = 0; i < dests.length; i++) if (dests[i].id === "cancun") dest = dests[i];
    dest = dest || { budget: 175, mid: 300, luxury: 460, label: "Cancún, Mexico" };
    var map = VM_PLAN_DATA.STYLE_MAP[styleKey];
    var tier = map.aiTier === "mid" ? "mid" : map.aiTier;
    if (tier === "luxury") tier = "luxury";
    var rate = dest[tier] || dest.mid;
    var kidDisc = { budget: 0.50, mid: 0.45, luxury: 0.50 };
    var season = seasonKeyFor("ai", opts.month);
    var rateAdj = rate * seasonMult(season);
    var pkg = (rateAdj * opts.adults * opts.nights) + (rateAdj * (kidDisc[tier] || 0.5) * opts.kids * opts.nights);
    var H = VM_DATA.ALLINC.aiHiddenAdditions;
    var tips = 80 * (opts.adults + opts.kids) * (opts.nights / 7);
    var excursions = H.excursionPerPerson * H.excursionsPerTrip * (opts.adults + opts.kids);
    var spa = styleKey === "lux" ? H.spaPerTrip : 0;
    var transport = transportCost(opts, "caribbean");
    var brands = dest.brands ? dest.brands[tier === "luxury" ? "luxury" : tier] : "";
    return {
      summary: dest.label + " · " + map.label + " all-inclusive · " + season + " season",
      lines: [
        line("All-inclusive package", pkg, "About " + money(rateAdj) + "/adult/night. Kids ~" + Math.round((kidDisc[tier] || 0.5) * 100) + "% · under 3 free." + (brands ? " Typical of " + brands + "." : "")),
        line("Round-trip flights", transport, transportNote(opts, "caribbean")),
        line("Customary tips", tips, "Cash tips are optional on paper and expected in practice. Scaled from ~$80/person/week."),
        line("Off-property excursions", excursions, "Two excursions (snorkel / Tulum / Xcaret class). Not in the brochure rate."),
        line("Spa / specialty night", spa, spa ? "One spa visit, typical of a higher-end week." : "Left off budget/mid. The package does not replace every off-property spend.", true)
      ]
    };
  }

  function cityStylePlan(opts, styleKey, baseKey, kind, region, extras) {
    var base = VM_PLAN_DATA.CITY_BASE[baseKey];
    var season = seasonKeyFor(kind, opts.month);
    var mult = seasonMult(season);
    var hotel = (base.hotel || base.lodging)[styleKey] * mult;
    var food = base.food[styleKey];
    var act = base.act[styleKey];
    var foodHead = opts.adults + (opts.kids * 0.7);
    var actHead = opts.adults + (opts.kids * 0.8);
    var lodgingTaxRate = baseKey === "nyc" ? 0.1475 : 0.12;
    var lodgingBase = hotel * opts.nights;
    var lodging = lodgingBase * (1 + lodgingTaxRate);
    var foodTot = food * foodHead * opts.nights;
    var actTot = act * actHead * opts.nights;
    var transport = transportCost(opts, region);
    var extraLines = extras ? extras(opts, styleKey, season, base) : [];
    var taxPct = (lodgingTaxRate * 100).toFixed(2).replace(/\.00$/, "");
    return {
      season: season,
      lines: [
        line("Lodging + occupancy tax", lodging, money(hotel) + "/night " + styleKey + " · " + season + " season · " + taxPct + "% occupancy/lodging tax."),
        line("Food", foodTot, money(food) + "/person/day for ages 3+, kids weighted."),
        line("Activities & local transit", actTot, money(act) + "/person/day — attractions, subway/Uber, day tickets."),
        line("Getting there", transport, transportNote(opts, region))
      ].concat(extraLines)
    };
  }

  function nycPlan(opts, styleKey) {
    var built = cityStylePlan(opts, styleKey, "nyc", "city", "domestic");
    return { summary: "New York City · " + VM_PLAN_DATA.STYLE_MAP[styleKey].label + " · " + built.season + " season", lines: built.lines };
  }

  function cityPlan(opts, styleKey) {
    var built = cityStylePlan(opts, styleKey, "city_generic", "city_generic", "domestic");
    return { summary: "US city trip · " + VM_PLAN_DATA.STYLE_MAP[styleKey].label + " · " + built.season + " season", lines: built.lines };
  }

  function hawaiiPlan(opts, styleKey) {
    var built = cityStylePlan(opts, styleKey, "hawaii", "hawaii", "hawaii", function (o, style, season, base) {
      var car = base.carPerDay[style] * o.nights;
      return [line("Rental car + insurance-ish", car, money(base.carPerDay[style]) + "/day. Island trips without a car look cheaper on paper and get expensive in Ubers.")];
    });
    return { summary: "Hawaii · " + VM_PLAN_DATA.STYLE_MAP[styleKey].label + " · " + built.season + " season", lines: built.lines };
  }

  function smokiesPlan(opts, styleKey) {
    var base = VM_PLAN_DATA.CITY_BASE.smokies;
    var R = VM_DATA.ROADTRIP;
    var season = seasonKeyFor("road", opts.month);
    var hotel = base.lodging[styleKey] * seasonMult(season);
    var foodHead = opts.adults + (opts.kids * 0.7);
    var actHead = opts.adults + (opts.kids * 0.8);
    var lodging = hotel * opts.nights;
    var foodTot = base.food[styleKey] * foodHead * opts.nights;
    var actTot = base.act[styleKey] * actHead * opts.nights;
    var driving = opts.origin === "driving" || opts.origin === "drive";
    var milesOne = base.oneWayMiles;
    var rt = milesOne * 2;
    var fuel = (rt / 24) * R.avgGasPrice;
    var wear = rt * R.wearPerMile;
    var driveCost = fuel + wear;
    var flyCost = transportCost(opts, "domestic") + (R.rentalCarPerDay * opts.nights);
    var getting = driving ? driveCost : flyCost;
    var gettingNote = driving
      ? "About " + milesOne + " miles each way · gas at $" + R.avgGasPrice.toFixed(2) + "/gal · wear $" + R.wearPerMile.toFixed(2) + "/mi."
      : "Domestic airfare plus a destination rental car at ~" + money(R.rentalCarPerDay) + "/day.";
    return {
      summary: "Great Smoky Mountains · " + VM_PLAN_DATA.STYLE_MAP[styleKey].label + " · " + season + " season",
      lines: [
        line("Cabin / hotel", lodging, money(hotel) + "/night · " + season + " season. Tax varies by town; this is the room rate."),
        line("Food", foodTot, "Groceries plus a couple of sit-down meals."),
        line("Park-adjacent activities", actTot, "Tubing, mini-golf, scenic drives, a paid attraction or two."),
        line("Getting there", getting, gettingNote)
      ]
    };
  }

  function buildPlan(destId, opts, styleKey) {
    if (destId === "disney") return disneyPlan(opts, styleKey);
    if (destId === "cruise") return cruisePlan(opts, styleKey);
    if (destId === "cancun") return cancunPlan(opts, styleKey);
    if (destId === "nyc") return nycPlan(opts, styleKey);
    if (destId === "hawaii") return hawaiiPlan(opts, styleKey);
    if (destId === "smokies") return smokiesPlan(opts, styleKey);
    return cityPlan(opts, styleKey);
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
    if (destId === "disney") {
      if (missing("lightning")) ideas.push({ label: "Add Lightning Lane Multi Pass", cost: Math.round(VM_DATA.DISNEY.lightningLanePerDay * (opts.adults + opts.kids) * Math.max(1, opts.nights - 1) * (1 + VM_PLAN_DATA.FL_SALES_TAX)), why: "The add-on most families wish they had priced before day two." });
      if (missing("memory")) ideas.push({ label: "Add Memory Maker", cost: VM_DATA.DISNEY.memoryMaker, why: "Advance PhotoPass — only if the rest of the plan already fits." });
      if (styleKey !== "lux") ideas.push({ label: "Step up one resort tier", cost: Math.round(room * 0.7), why: "Value → Moderate or Moderate → Deluxe, if the leftover covers the nightly jump." });
    } else if (destId === "cruise") {
      if (styleKey === "budget") ideas.push({ label: "Add an unlimited drink package (adults)", cost: Math.round((VM_DATA.CRUISE.drinkPackagePerLine.carnival.unlimited) * opts.nights * opts.adults), why: "Only if you will actually use it. See the cruise calculator for break-even." });
      ideas.push({ label: "Upgrade the cabin one step", cost: VM_DATA.CRUISE.cabinUpgrade.balcony / 2 * Math.min(2, opts.adults + opts.kids), why: "Interior → oceanview or balcony, priced per person on the first two guests." });
    } else if (destId === "cancun") {
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
      upgrades: upgradesFor(recommended, opts.dest, opts, opts.style, opts.budget)
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
      { href: "/budget", label: "Budget Reverse Math" },
      { href: "/funding", label: "Plan The Funding" }
    ];
    var seen = {};
    var deepHtml = "<h3 class=\"panel-title\">Go deeper</h3><ul class=\"plan-deep-links\">" +
      deep.filter(function (d) {
        if (seen[d.href]) return false;
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
      cutsHtml + upHtml + deepHtml;

    var email = $("email-section");
    if (email) email.hidden = false;

    var blurb = $("p-dest-blurb");
    if (blurb) blurb.textContent = model.dest.blurb || "";
  }

  function populateDestinations() {
    var sel = $("p-dest");
    if (!sel || !window.VM_PLAN_DATA) return;
    var current = sel.value || "disney";
    sel.innerHTML = "";
    VM_PLAN_DATA.DESTINATIONS.forEach(function (d) {
      var opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = d.label;
      if (d.id === current) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  function bind() {
    populateDestinations();
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

    ["p-dest", "p-budget", "p-adults", "p-kids", "p-infants", "p-nights", "origin", "p-style", "p-month"].forEach(function (id) {
      var node = $(id);
      if (!node) return;
      var evt = node.tagName === "SELECT" ? "change" : "input";
      node.addEventListener(evt, function () {
        if (id === "p-dest") {
          var d = destById(node.value);
          var blurb = $("p-dest-blurb");
          if (blurb) blurb.textContent = d.blurb || "";
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

  // Used by the local verification script.
  window.VM_PLAN = { compute: compute, buildPlan: buildPlan, destById: destById };
})();
