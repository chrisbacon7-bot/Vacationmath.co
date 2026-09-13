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

  function tierLabel(key) {
    var defs = (typeof VM_PLAN_DATA !== "undefined" && VM_PLAN_DATA.TIER_DEFS) || {};
    if (defs[key] && defs[key].label) return defs[key].label;
    if (key === "lean") return "Budget";
    if (key === "stretch") return "Splurge";
    return "Mid-range";
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

  function originCode(opts) {
    var id = opts.origin === "drive" ? "driving" : (opts.origin || "atl");
    if (id === "driving") return "";
    return id.toUpperCase();
  }

  var selectedTier = "solid";
  var selectedRecTab = "hotel";
  var REC_TABS = ["hotel", "food", "activities", "transit", "season"];
  var lastOptsKey = "";

  function optsFingerprint(opts) {
    return [opts.dest, opts.budget, opts.adults, opts.kids, opts.infants, opts.nights, opts.origin, opts.style, opts.month].join("|");
  }

  function fallbackKey(dest) {
    if (!dest) return "city";
    if (dest.kind === "disney") return "disney";
    if (dest.kind === "cruise") return "cruise";
    if (dest.kind === "ai") return "ai";
    var r = String(dest.region || "").toLowerCase();
    if (r === "hawaii") return "hawaii";
    if (r === "europe") return "europe";
    if (r === "caribbean") return "caribbean";
    if (r === "mexico") return "mexico";
    if (r === "asia") return "asia";
    if (r === "oceania") return "oceania";
    if (r === "africa") return "africa";
    if (r === "middle east") return "middleeast";
    if (r === "central america" || r === "south america") return "latam";
    if (r === "domestic us") return "domestic";
    if (dest.flightRegion === "hawaii") return "hawaii";
    return "city";
  }

  function asHotelBand(raw) {
    if (!raw) return { why: "", picks: [] };
    if (Object.prototype.toString.call(raw) === "[object Array]") {
      return { why: "", picks: raw.slice() };
    }
    return { why: raw.why || "", picks: (raw.picks || []).slice() };
  }

  function hotelBandFor(dest, styleKey) {
    var curated = VM_PLAN_DATA.HOTEL_EXAMPLES && VM_PLAN_DATA.HOTEL_EXAMPLES[dest.id];
    var band = asHotelBand(curated && curated[styleKey]);
    if (band.picks.length) return band;
    var fbs = VM_PLAN_DATA.HOTEL_FALLBACKS || {};
    var fb = fbs[fallbackKey(dest)] || fbs.city;
    return asHotelBand(fb && fb[styleKey]);
  }

  function hotelExamplesFor(dest, styleKey) {
    return hotelBandFor(dest, styleKey).picks;
  }

  function hotelWhyFor(dest, styleKey) {
    return hotelBandFor(dest, styleKey).why;
  }

  function firstHotelExample(dest, styleKey) {
    var picks = hotelExamplesFor(dest, styleKey);
    if (picks[0]) {
      return picks[0]
        .replace(/\s+[—–-]\s+.+$/, "")
        .replace(/\s*\((value|moderate|deluxe)\)\s*$/i, "")
        .replace(/\.$/, "");
    }
    if (dest.kind === "ai" && dest.aiId && dataPack().AI_DESTINATIONS) {
      var list = dataPack().AI_DESTINATIONS;
      var tier = styleKey === "lux" ? "luxury" : styleKey;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === dest.aiId && list[i].brands) {
          var raw = list[i].brands[tier] || list[i].brands.mid || "";
          var names = raw.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
          if (names.length) return names.slice(0, 3).join(" / ");
        }
      }
    }
    if (dest.kind === "disney") {
      var map = VM_PLAN_DATA.STYLE_MAP[styleKey] || {};
      var resorts = (dataPack().DISNEY && dataPack().DISNEY.resorts) || {};
      var row = resorts[map.disneyResort];
      return row && row.label ? row.label.split(" (")[0] : "On-property resort matching this style";
    }
    var generic = { budget: "2-star / limited-service class", mid: "3–4 star neighborhood hotel", lux: "4–5 star flagship class" };
    return generic[styleKey] || generic.mid;
  }

  function foodSource(dest) {
    var curated = VM_PLAN_DATA.FOOD_PICKS && VM_PLAN_DATA.FOOD_PICKS[dest.id];
    if (curated) return curated;
    var fbs = VM_PLAN_DATA.FOOD_FALLBACKS || {};
    return fbs[fallbackKey(dest)] || fbs.city || null;
  }

  function foodNoteFor(dest) {
    var src = foodSource(dest);
    return (src && src.note) || "Grocery breakfasts, one sit-down dinner, skip hotel restaurants.";
  }

  function foodPicksFor(dest, styleKey) {
    var src = foodSource(dest);
    if (!src) return [];
    if (styleKey && src[styleKey] && src[styleKey].length) return src[styleKey].slice();
    if (src.picks && src.picks.length) return src.picks.slice();
    return [];
  }

  function firstFoodPick(dest, styleKey) {
    var picks = foodPicksFor(dest, styleKey);
    return picks[0] ? picks[0].replace(/\.$/, "") : "";
  }

  function activitiesPicksFor(dest, styleKey) {
    var curated = VM_PLAN_DATA.ACTIVITIES && VM_PLAN_DATA.ACTIVITIES[dest.id];
    if (curated && curated[styleKey] && curated[styleKey].length) return curated[styleKey].slice();
    var fbs = VM_PLAN_DATA.ACTIVITY_FALLBACKS || {};
    var fb = fbs[fallbackKey(dest)] || fbs.city;
    if (fb && fb[styleKey] && fb[styleKey].length) return fb[styleKey].slice();
    return [];
  }

  function hotelCompareDetail(dest, styleKey) {
    var down = shiftStyle(styleKey, -1);
    var up = shiftStyle(styleKey, 1);
    var bits = [];
    if (down !== styleKey) bits.push("Cheaper band: " + firstHotelExample(dest, down));
    if (up !== styleKey) bits.push("Nicer band: " + firstHotelExample(dest, up));
    return bits.join(". ");
  }

  function flightTipRegion(dest) {
    var name = String((dest && dest.region) || "").toLowerCase();
    if (name === "asia") return "asia";
    if (name === "hawaii") return "hawaii";
    if (name === "caribbean") return "caribbean";
    if (name === "europe") return "europe";
    if (name === "oceania") return "oceania";
    if (name === "africa") return "africa";
    if (name === "middle east") return "middleeast";
    if (name === "mexico" || name === "central america" || name === "south america") {
      return dest.flightRegion || "latam";
    }
    if (name === "domestic us" || name === "featured") return dest.flightRegion || "domestic";
    return (dest && dest.flightRegion) || "domestic";
  }

  function flightTipText(dest, opts) {
    var originId = opts.origin === "drive" ? "driving" : (opts.origin || "atl");
    var region = flightTipRegion(dest);
    var driving = originId === "driving";
    if (driving && isFlyOnlyRegion(region)) {
      return "Driving does not replace this flight. Pick an origin airport or add airfare.";
    }
    if (driving) {
      return "Budget fuel, wear, and a possible night on the road — not just the gas receipt.";
    }
    var code = originCode(opts);
    if (region === "domestic") {
      return "From " + code + ", midweek nonstops usually beat Friday/Sunday. Price the week of travel 6–8 weeks out for domestic.";
    }
    if (region === "caribbean") {
      return "From " + code + ", Southeast and Texas origins see the most Caribbean nonstops. Shoulder weeks cut this line.";
    }
    if (region === "hawaii") {
      return "From " + code + ", West Coast origins win. A neighbor-island hop is a second ticket — not in the Honolulu fare.";
    }
    if (region === "europe") {
      return "From " + code + ", book about 2–4 months out. Midweek Atlantic crossings; open-jaw often beats two one-ways.";
    }
    if (region === "latam") {
      return "From " + code + ", MIA / IAH / DFW / ATL are the usual doors. Shoulder months move this line more than the airline brand.";
    }
    if (region === "asia") {
      return "From " + code + ", one-stop via SFO, LAX, SEA, or ORD is the usual East Coast pattern. No flight numbers — those change weekly.";
    }
    if (region === "oceania") {
      return "From " + code + ", this is a 2–6 month booking via the West Coast, not a 3-week fare hunt.";
    }
    if (region === "africa") {
      return "From " + code + ", usually one European or Middle East connect. Price door-to-door, not the cheap first segment.";
    }
    if (region === "middleeast") {
      return "From " + code + ", JFK / IAD / IAH / ORD have the most one-stop patterns. Summer is cheap and extremely hot.";
    }
    return "From " + code + ", midweek usually beats Sunday. We do not list flight numbers — price two nearby dates.";
  }

  function lineKind(label) {
    var s = String(label || "").toLowerCase();
    if (/lightning|genie/.test(s)) return "ll";
    if (/park ticket/.test(s)) return "tickets";
    if (/memory maker|photopass/.test(s)) return "memory";
    if (s.indexOf("souvenir") >= 0) return "souvenir";
    if (s.indexOf("snack") >= 0) return "snacks";
    if (s === "dining" || s === "food" || s.indexOf("food, transit") >= 0) return "food";
    if (s.indexOf("drink") >= 0) return "drinks";
    if (s.indexOf("gratu") >= 0 || s.indexOf("customary tip") >= 0 || s === "tips") return "tips";
    if (s.indexOf("excursion") >= 0) return "excursions";
    if (s.indexOf("port tax") >= 0) return "portfees";
    if (s.indexOf("wi-fi") >= 0 || s.indexOf("wifi") >= 0) return "wifi";
    if (s.indexOf("pre-cruise") >= 0) return "prehotel";
    if (/\bspa\b/.test(s)) return "spa";
    if (/rental car/.test(s)) return "car";
    if (/buffer/.test(s)) return "buffer";
    if (/getting there|round-trip flight|airfare/.test(s)) return "flights";
    if (/cabin fare/.test(s)) return "cabin";
    if (/all-inclusive package/.test(s)) return "aipkg";
    if (/lodging|resort/.test(s)) return "lodging";
    return "other";
  }

  var POINTS_BRAND_RE = /\b(marriott|hilton|hyatt|ihg|sheraton|westin|ritz-carlton|st\.?\s*regis|kimpton|aloft|moxy|hampton|embassy|holiday inn|intercontinental|waldorf|fairmont|conrad|andaz|park hyatt|grand hyatt|jw marriott|courtyard|autograph|springhill|fairfield|residence inn|homewood|motto|canopy|renaissance|delta hotels|ac hotel|element |bonvoy|world of hyatt|hilton honors)\b/i;
  var PROPERTY_RE = /\b(hotel|inn|lodge|resort|hostel|suites?|motel|ritz|conrad|waldorf|westin|sheraton|hyatt|hilton|marriott|moxy|hampton|pendry|proper|ace hotel|1 hotel|citizenm|freehand|palazzo|bellagio|venetian|wynn|encore|cosmopolitan)\b/i;

  function parsePick(raw) {
    var s = String(raw || "").replace(/\s+/g, " ").trim();
    var name = s;
    var why = "";
    var posture = "";
    var dash = s.search(/\s+[—–]\s+/);
    if (dash >= 0) {
      var sep = s.slice(dash).match(/^\s+[—–]\s+/);
      name = s.slice(0, dash).trim();
      why = s.slice(dash + (sep ? sep[0].length : 3)).trim();
    } else {
      var colonOnly = s.match(/^([A-Za-z][A-Za-z /]{1,18}):\s+(.+)$/);
      if (colonOnly) {
        name = colonOnly[2].trim();
        why = colonOnly[1].trim();
      } else {
        var aim = s.match(/^(Aim for|Skip)\s+(.+?)\s+\((.+)\)\.?$/i);
        if (aim) {
          name = aim[2].trim();
          why = aim[1] + " · " + aim[3].replace(/\.$/, "");
        }
      }
    }
    var meal = name.match(/^([A-Za-z][A-Za-z /]{1,18}):\s+(.+)$/);
    if (meal) {
      why = why ? meal[1] + " · " + why : meal[1];
      name = meal[2].trim();
    }
    var whyPosture = why.match(/\s*\(([^)]+)\)\s*\.?$/);
    if (whyPosture && /free|ticketed|tour|optional|cheap|timed/i.test(whyPosture[1])) {
      posture = whyPosture[1];
      why = why.replace(/\s*\(([^)]+)\)\s*\.?$/, "").trim();
    } else {
      var namePosture = name.match(/\s*\(([^)]+)\)\s*\.?$/);
      if (namePosture && /free|ticketed|tour|optional|cheap|timed/i.test(namePosture[1])) {
        posture = namePosture[1];
        name = name.replace(/\s*\(([^)]+)\)\s*\.?$/, "").trim();
      }
    }
    name = name.replace(/\.$/, "");
    why = why.replace(/\.$/, "");
    return { name: name, why: why, posture: posture, raw: s };
  }

  function chipsFor(category, pick) {
    var chips = [];
    var blob = ((pick.name || "") + " " + (pick.why || "") + " " + (pick.posture || "") + " " + (pick.raw || "")).toLowerCase();
    if (category === "hotel" && POINTS_BRAND_RE.test(pick.name || "")) {
      chips.push("Points-friendly");
    } else if (category === "hotel" && PROPERTY_RE.test(pick.name || "")) {
      chips.push("Brand");
    }
    if (/\bfree\b/.test(pick.posture || "") || /\(free\b/.test(blob)) chips.push("Free");
    if (/ticketed/.test(pick.posture || "") || /ticketed/.test(blob)) chips.push("Ticketed");
    if (/book ahead|reservation|reserve|book before|booked ahead/.test(blob)) chips.push("Book ahead");
    var seen = {};
    return chips.filter(function (c) {
      if (seen[c]) return false;
      seen[c] = true;
      return true;
    }).slice(0, 3);
  }

  function tipForLine(ln, dest, opts, styleKey) {
    var kind = lineKind(ln.label);
    var hotel = firstHotelExample(dest, styleKey);
    var foodPick = firstFoodPick(dest, styleKey);
    var included = ln.amount > 0;

    if (kind === "lodging") {
      return {
        text: hotel
          ? "See Hotel picks above — start with " + hotel + "."
          : "See Hotel picks above."
      };
    }
    if (kind === "cabin") {
      return {
        text: hotel
          ? "See Hotel picks above — start with " + hotel + "."
          : "See Hotel picks above. Guarantee cabin if you can live without picking the deck."
      };
    }
    if (kind === "aipkg") {
      return {
        text: hotel
          ? "See Hotel picks above — start with " + hotel + "."
          : "See Hotel picks above. Confirm the airport transfer is in the rate."
      };
    }
    if (kind === "flights") {
      return { text: flightTipText(dest, opts) };
    }
    if (kind === "tickets") {
      return { text: "See Activities picks above. Skip Hopper unless you’ll change parks midday." };
    }
    if (kind === "ll") {
      return {
        text: included
          ? "Genie+/LL is optional speed — don’t treat it as required. Cut this first if the plan is Tight."
          : "Left off the budget plan. Add Lightning Lane only if you’ll otherwise lose a park day to waits.",
        detail: included
          ? "Splurge keeps it. Budget drops it. Most families wish they had priced it before day two — not assumed it."
          : "If you add it later, use the Disney calculator for the Florida sales-tax line."
      };
    }
    if (kind === "food") {
      var foodName = parsePick(foodPick).name;
      if (foodName) return { text: "See Food picks above — start with " + foodName + "." };
      if (dest.kind === "disney") {
        return { text: "See Food picks above. Grocery breakfasts; one table-service dinner, rest QS." };
      }
      if (dest.kind === "ai") {
        return { text: "See Food picks above. Meals are in the package — the leak is the night you leave." };
      }
      if (dest.kind === "cruise") {
        return { text: "See Food picks above. Main dining is already in the fare." };
      }
      return { text: "See Food picks above. Grocery breakfasts, one sit-down dinner." };
    }
    if (kind === "snacks") {
      return {
        text: "A grocery water case and a refillable mug beat $5 in-park bottles.",
        detail: "This line is easy to double if you treat every kiosk as a meal."
      };
    }
    if (kind === "drinks") {
      if (dest.kind === "cruise") {
        return {
          text: included
            ? "Run the break-even before buying CHEERS! / Deluxe — packages only win if you’ll actually use them."
            : "Pay-as-you-go until you run the break-even. A package is not automatic.",
          detail: included
            ? "Budget drops the package. Splurge keeps it. Specialty dining is still leftover-only."
            : "Three drinks a day is already in this pay-as-you-go line.",
          href: "/blog/cruise-drink-package-break-even-2026",
          label: "Drink-package math"
        };
      }
      return { text: "Price the drink package only after you know your daily habit. À-la-carte often wins." };
    }
    if (kind === "tips") {
      if (dest.kind === "cruise") {
        return {
          text: "Automatic and not optional in practice. Do not bury this in the cabin fare.",
          detail: "Suite/Haven gratuities run higher. This line already uses the per-line 2026 daily rate."
        };
      }
      if (dest.kind === "ai") {
        return {
          text: "Cash in small bills. The package does not replace this habit.",
          detail: "Housekeeping and bartenders are where “all-inclusive” still expects cash."
        };
      }
      return {
        text: "Housekeeping $1–2/person/night plus table-service. This is the habit, not a fee.",
        detail: dest.kind === "disney" ? "Tip the table-service server; quick-service is optional." : ""
      };
    }
    if (kind === "excursions") {
      return { text: "See Activities picks above." };
    }
    if (kind === "portfees") {
      return {
        text: "Not optional — government and port charges, not a cruise-line add-on.",
        detail: "This scales with nights and guests age 2+. You cannot tip-shop your way out of it."
      };
    }
    if (kind === "wifi") {
      return {
        text: included
          ? "Two devices is enough. A third login is how this line doubles."
          : "Left off budget/mid. Add it only if you have to work from the ship.",
        detail: included ? "Splurge includes it. Budget and Mid-range skip it on purpose." : "The ship will sell it to you at the gangway. Price it here first."
      };
    }
    if (kind === "prehotel") {
      return {
        text: included
          ? "Worth it if you fly in the same day as embarkation. Same-day travel is how people miss the ship."
          : "Skipped because you’re driving to port.",
        detail: included ? "A Florida port hotel night is cheaper than a missed cruise." : ""
      };
    }
    if (kind === "spa") {
      return {
        text: included
          ? "One spa or specialty night — leftover only. The package does not include this."
          : "Left off budget/mid. Spend leftover here only after the rest of the plan fits.",
        detail: "This is the Splurge treat, not a nightly habit."
      };
    }
    if (kind === "memory") {
      return {
        text: included
          ? "Advance PhotoPass. Only if leftover covers it — your phone already takes the pictures."
          : "Not required to walk the parks. Add Memory Maker only as leftover.",
        detail: "Splurge includes it. Budget and Mid-range skip it."
      };
    }
    if (kind === "souvenir") {
      return {
        text: "Set a hard cap before Main Street. This line is conservative and easy to double.",
        detail: styleKey === "budget" ? "Budget already cuts this. A popcorn bucket is a souvenir, not a meal plan." : "Pick one shop day. Wandering every store is how this line triples."
      };
    }
    if (kind === "car") {
      return {
        text: "Island trips without a car look cheaper on paper and get expensive in Ubers. Parking is its own line at the resort.",
        detail: "Book the car with the hotel’s parking rate in mind — $40–55/night is common on Oahu."
      };
    }
    if (kind === "buffer") {
      return {
        text: "Keep this; it’s the line that prevents a credit-card surprise.",
        detail: "Cut it last, not first, unless you are Over. It is snacks, tips, and a bad-weather cab — not padding."
      };
    }
    return { text: "Price this line before you book the next one. Optional lines are the first cut if you’re Over." };
  }

  function annotateLineTips(plan, dest, opts, styleKey) {
    if (!plan || !plan.lines) return plan;
    for (var i = 0; i < plan.lines.length; i++) {
      var tip = tipForLine(plan.lines[i], dest, opts, styleKey);
      if (tip && tip.text) {
        plan.lines[i].tip = tip.text;
        if (tip.detail) plan.lines[i].tipDetail = tip.detail;
        if (tip.href) {
          plan.lines[i].tipHref = tip.href;
          plan.lines[i].tipHrefLabel = tip.label || "Read the math";
        }
      }
    }
    return plan;
  }

  function buildPlan(destId, opts, styleKey) {
    var dest = destById(destId);
    var plan;
    if (dest.kind === "disney" || destId === "disney") plan = disneyPlan(opts, styleKey);
    else if (dest.kind === "cruise" || destId === "cruise") plan = cruisePlan(opts, styleKey);
    else if (dest.kind === "ai") plan = aiPlan(opts, styleKey, dest);
    else plan = tfPlan(opts, styleKey, dest);
    return annotateLineTips(plan, dest, opts, styleKey);
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
    var band = hotelBandFor(dest, styleKey);
    var items = band.picks.slice(0, 6);
    var why = band.why;
    var kicker = dest.kind === "cruise" ? "Cabin" : "Hotel";
    var title = styleLabel + " class — " + dest.short;
    if (dest.kind === "disney") {
      var resortKey = (VM_PLAN_DATA.STYLE_MAP[styleKey] || {}).disneyResort;
      title = (resortKey === "value" ? "Value" : resortKey === "moderate" ? "Moderate" : "Deluxe / DVC") + " — " + dest.short;
    } else if (dest.kind === "cruise") {
      var cabin = (VM_PLAN_DATA.STYLE_MAP[styleKey] || {}).cruiseCabin || "balcony";
      title = cabin.charAt(0).toUpperCase() + cabin.slice(1) + " class — " + dest.short;
    }
    if (!items.length && dest.kind === "ai" && dest.aiId && dataPack().AI_DESTINATIONS) {
      var aiList = dataPack().AI_DESTINATIONS;
      var ai = null;
      for (var i = 0; i < aiList.length; i++) {
        if (aiList[i].id === dest.aiId) ai = aiList[i];
      }
      var tier = styleKey === "lux" ? "luxury" : styleKey;
      var brandStr = ai && ai.brands ? (ai.brands[tier] || ai.brands.mid || "") : "";
          items = brandStr ? brandStr.split(",").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 6) : [];
    }
    if (!items.length) {
      items = styleKey === "budget"
        ? ["Limited-service or guesthouse on transit", "Walk-to-bakery beats a cheap room far from everything", "Skip hotel breakfast if a bakery is on the block"]
        : styleKey === "lux"
          ? ["Flagship in one district", "Only if leftover covers the jump from mid-range", "Luxury is the room — do not also buy every paid tour"]
          : ["Neighborhood 3–4 star", "One room, not a suite, unless leftover is real", "Location over a rooftop pool you will use twice"];
    }
    return {
      kicker: kicker,
      title: title,
      body: why || "Named lodging for this tier. Not a ranking and not live inventory.",
      items: items,
      impact: "This card follows the Budget / Mid-range / Splurge style you selected."
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
    var region = flightTipRegion(dest);
    var regionTip = (VM_PLAN_DATA.REGION_AIR && VM_PLAN_DATA.REGION_AIR[region]) ||
      "Book the pattern for this region, then price two nearby dates. We do not invent flight numbers.";
    var driving = originId === "driving";
    var items = [];
    if (hub.tip) items.push(hub.tip);
    if (!driving) items.push(regionTip);
    if (dest.id === "los_angeles") items.push("Compare BUR, LGB, and SNA on the same week as LAX.");
    if (dest.id === "anaheim") items.push("SNA is the Disneyland door. LAX works if you already priced a BUR/LGB/SNA gap — do not assume LAX is cheaper.");
    if (dest.id === "nyc") items.push("Price JFK, EWR, and LGA the same week — the fare gap is often a subway ride.");
    if (dest.id === "philadelphia") items.push("PHL is an American hub. Compare EWR on the same week if the fare gap covers a train.");
    if (dest.id === "atlanta") items.push("ATL nonstops are the product. Midweek usually beats a Sunday-into-a-convention Monday.");
    if (dest.id === "phoenix" || dest.id === "scottsdale") items.push("PHX is the door. Scottsdale is a different lodging math than downtown Phoenix.");
    if (dest.id === "key_west") items.push("EYW is tiny and often pricey. MIA or FLL plus the Overseas Highway is a valid Budget plan.");
    if (dest.id === "napa") items.push("SFO or OAK, then a Napa bus or one rental-car day — do not keep a car parked at a tasting-room hotel.");
    if (dest.id === "monterey") items.push("SJC or SFO plus a Monterey Airbus / rental. Do not assume a cheap SFO fare includes Carmel.");
    if (dest.id === "lake_tahoe") items.push("RNO is closer than SMF for the North Shore. South Shore often prices Reno + a shuttle.");
    if (dest.id === "grand_canyon") items.push("FLG or PHX, then a shuttle. A Las Vegas day-trip is a different, rushed product.");
    if (dest.id === "jackson_hole") items.push("JAC is the door and a weather airport. Build a buffer night in ski season.");
    if (dest.id === "bar_harbor") items.push("BGR is the closest jet door. BOS plus a drive is the Budget backup.");
    if (dest.id === "portland_me") items.push("PWM nonstops beat connecting into BOS and backtracking.");
    if (dest.id === "destin_30a") items.push("VPS is the 30A door. PNS is the backup if the fare gap covers the extra drive.");
    if (dest.id === "outer_banks") items.push("ORF or a drive. There is no cheap jet onto Hatteras — price the ferry and the hours.");
    if (dest.id === "santa_fe") items.push("SAF if the fare is close; ABQ plus the Rail Runner / a shuttle is the usual Budget door.");
    if (dest.kind === "disney") items.push("MCO is the door. A later arrival plus a grocery stop beats a same-day park day.");
    if (dest.kind === "cruise") items.push("Fly in the day before if you can. Same-day embarkation is how people miss the ship.");
    items.push("No flight numbers on purpose — those change weekly. Use the hub pattern, then price two midweek dates.");
    if (driving && isFlyOnlyRegion(flightTipRegion(dest))) {
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
      "Lunch: market, food hall, or a neighborhood counter",
      "One sit-down dinner, not one every night",
      "Skip the hotel restaurant unless breakfast is already in the rate",
      "Stay in the neighborhood you booked — a crosstown dinner is a second fare"
    ];
  }

  function buildFoodRec(dest, opts, styleKey) {
    var days = opts.nights + 1;
    var items = foodPicksFor(dest, styleKey).slice(0, 6);
    if (!items.length) items = foodFallbackItems();
    var note = foodNoteFor(dest);
    var title;
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
      impact = "Dining + snacks in this plan: " + money(diningTot + snacks) + " across " + opts.nights + " nights.";
    } else if (dest.kind === "cruise") {
      title = "Main dining is in the fare";
      impact = styleKey === "budget"
        ? "This plan prices pay-as-you-go drinks, not a package. Run the break-even before you tap yes."
        : "Unlimited adult drinks + kids soda are in the itemized plan. Specialty dining is leftover-only.";
    } else if (dest.kind === "ai") {
      var extra = Math.round((styleKey === "lux" ? 45 : 25) * (opts.adults + opts.kids) * Math.min(2, opts.nights / 3));
      title = "Meals are in the package";
      impact = "Plan about " + money(extra) + " extra if you want one off-resort dinner for the party. Tips are already a separate line.";
    } else {
      var tf = tfById(dest.id);
      var ground = tf && tf.dailyGround ? tf.dailyGround : null;
      var daily = (ground && ground[styleKey]) || (VM_PLAN_DATA.CITY_BASE.city_generic.food && VM_PLAN_DATA.CITY_BASE.city_generic.food[styleKey]) || 75;
      var partyDay = daily * Math.max(1, opts.adults + opts.kids * 0.6);
      title = "About " + money(daily) + " / person / day";
      impact = "This plan uses " + money(partyDay) + " / day for the party × " + days + " days (including a travel day).";
    }

    return {
      kicker: "Food",
      title: title,
      body: note,
      items: items,
      impact: impact
    };
  }

  function buildActivitiesRec(dest, styleKey) {
    var styleLabel = (VM_PLAN_DATA.STYLE_MAP[styleKey] || {}).label || styleKey;
    var items = activitiesPicksFor(dest, styleKey).slice(0, 6);
    var title = styleLabel + " days — " + dest.short;
    if (dest.kind === "disney") {
      title = styleKey === "budget"
        ? "One-park days, no Hopper"
        : styleKey === "lux"
          ? "Hopper + Lightning Lane stance"
          : "Two parks — Hopper only if you’ll switch";
    } else if (dest.kind === "cruise") {
      title = styleKey === "budget"
        ? "Sea days + one port walk"
        : styleKey === "lux"
          ? "Two excursions + drink-package math"
          : "One ship tour + one independent port";
    } else if (dest.id === "los_angeles") {
      title = styleKey === "budget"
        ? "Getty, Griffith, beach — skip the stack"
        : styleKey === "lux"
          ? "Universal Express leftover — not Disneyland + Universal"
          : "Universal or beach or Getty — pick two";
    } else if (dest.id === "anaheim") {
      title = styleKey === "budget"
        ? "One park per day — no Hopper"
        : styleKey === "lux"
          ? "Hopper + Lightning Lane — still not Universal"
          : "Hopper only if you’ll switch parks";
    } else if (dest.id === "philadelphia") {
      title = styleKey === "budget"
        ? "Independence timed + Terminal"
        : styleKey === "lux"
          ? "Barnes + a reserved food walk leftover"
          : "Independence + one Museum Mile ticket";
    }
    var impact = "This card follows the Budget / Mid-range / Splurge style you selected.";
    if (dest.kind === "cruise") {
      impact = "Drink-package break-even is linked under the drinks line.";
    } else if (dest.id === "los_angeles") {
      impact = "Disneyland is Anaheim — a separate day trip, not this lodging.";
    } else if (dest.id === "anaheim") {
      impact = "This lodging is Disneyland. Los Angeles is a different day trip.";
    } else if (dest.id === "phoenix") {
      impact = "This is Phoenix — not Scottsdale resort math.";
    } else if (dest.kind === "disney") {
      impact = "Hopper and Lightning Lane are add-ons — only Splurge prices both in.";
    }
    return {
      kicker: "Activities",
      title: title,
      body: "Cost posture in each bullet (free / ticketed / tour). Not a live ticket shop.",
      items: items,
      impact: impact,
      wide: true
    };
  }

  function buildRecs(dest, opts, styleKey) {
    return {
      season: buildSeasonRec(dest, opts, styleKey),
      hotel: buildHotelRec(dest, styleKey),
      airline: buildAirlineRec(dest, opts),
      food: buildFoodRec(dest, opts, styleKey),
      activities: buildActivitiesRec(dest, styleKey)
    };
  }

  function panelLead(text) {
    var t = String(text || "").trim();
    if (!t) return "";
    if (t.length <= 160) return t;
    var m = t.match(/^(.+?[.!?])(?:\s|$)/);
    return m ? m[1] : t;
  }

  function chipClass(label) {
    if (label === "Points-friendly" || label === "Book ahead") return " plan-book-chip--honey";
    if (label === "Free") return " plan-book-chip--free";
    if (label === "Ticketed") return " plan-book-chip--ticket";
    return "";
  }

  function pickRowHtml(category, raw) {
    var pick = parsePick(raw);
    var chips = chipsFor(category, pick);
    var chipsHtml = chips.length
      ? "<span class=\"plan-book-chips\">" + chips.map(function (c) {
          return "<span class=\"plan-book-chip" + chipClass(c) + "\">" + esc(c) + "</span>";
        }).join("") + "</span>"
      : "";
    var why = pick.why ? "<p class=\"plan-book-why\">" + esc(pick.why) + "</p>" : "";
    return "<li class=\"plan-book-row\">" +
      "<div class=\"plan-book-row-main\">" +
        "<p class=\"plan-book-name\">" + esc(pick.name) + "</p>" +
        why +
      "</div>" +
      chipsHtml +
      "</li>";
  }

  function bookHtml(model) {
    var recs = model.recs || {};
    var tierWord = tierLabel(model.selectedTier);
    var styleLabel = ((model.tiers || []).filter(function (t) { return t.selected; })[0] || {}).styleLabel || "mid-range";
    var destLabel = (model.dest && (model.dest.short || model.dest.label)) || "this trip";
    var active = REC_TABS.indexOf(selectedRecTab) >= 0 ? selectedRecTab : "hotel";
    var tabs = [
      { id: "hotel", label: "Hotel", rec: recs.hotel },
      { id: "food", label: "Food", rec: recs.food },
      { id: "activities", label: "Activities", rec: recs.activities },
      { id: "transit", label: "Getting there", rec: recs.airline },
      { id: "season", label: "Season", rec: recs.season }
    ];
    var tabBtns = tabs.map(function (tab) {
      var on = tab.id === active;
      return "<button type=\"button\" class=\"plan-book-tab\" role=\"tab\" id=\"plan-book-tab-" + tab.id + "\"" +
        " data-book-tab=\"" + tab.id + "\" aria-controls=\"plan-book-panel-" + tab.id + "\"" +
        " aria-selected=\"" + (on ? "true" : "false") + "\" tabindex=\"" + (on ? "0" : "-1") + "\">" +
        esc(tab.label) + "</button>";
    }).join("");
    var panels = tabs.map(function (tab) {
      var r = tab.rec || {};
      var items = (r.items || []).slice(0, 6);
      var rows = items.length
        ? "<ul class=\"plan-book-list\">" + items.map(function (it) {
            return pickRowHtml(tab.id, it);
          }).join("") + "</ul>"
        : "<p class=\"plan-book-empty\">No named picks for this tab — use the itemized plan.</p>";
      var lead = panelLead(r.body);
      var note = r.impact && !/follows the (Lean|Budget)/.test(r.impact) ? r.impact : "";
      return "<div class=\"plan-book-panel\" role=\"tabpanel\" id=\"plan-book-panel-" + tab.id + "\"" +
        " aria-labelledby=\"plan-book-tab-" + tab.id + "\" tabindex=\"0\"" +
        (tab.id === active ? "" : " hidden") + ">" +
        (lead ? "<p class=\"plan-book-lead\">" + esc(lead) + "</p>" : "") +
        rows +
        (note ? "<p class=\"plan-book-note\">" + esc(note) + "</p>" : "") +
        "</div>";
    }).join("");
    var bookSub = esc(tierWord) + " picks for " + esc(destLabel);
    if (styleLabel && String(styleLabel).toLowerCase() !== String(tierWord).toLowerCase()) {
      bookSub = esc(tierWord) + " · " + esc(String(styleLabel).toLowerCase()) + " lodging for " + esc(destLabel);
    }
    return "<h3 class=\"panel-title\" id=\"plan-book-title\">Where to book</h3>" +
      "<p class=\"plan-section-sub\">" + bookSub + ". Search these — not live rates, not affiliate links.</p>" +
      "<div class=\"plan-book\" id=\"plan-book\">" +
        "<div class=\"plan-book-tabs\" role=\"tablist\" aria-labelledby=\"plan-book-title\">" + tabBtns + "</div>" +
        panels +
      "</div>";
  }

  function suggestTier(tiers) {
    var lean = tiers[0];
    var solid = tiers[1];
    if (solid.verdict.key === "over" && lean.verdict.key !== "over") return "lean";
    if (solid.verdict.key === "over") return "lean";
    return "solid";
  }

  function compute() {
    var opts = readOpts();
    var dest = destById(opts.dest);
    var fp = optsFingerprint(opts);
    var tiers = ["lean", "solid", "stretch"].map(function (key) {
      var def = VM_PLAN_DATA.TIER_DEFS[key];
      var style = key === "solid" ? opts.style : shiftStyle(opts.style, def.styleShift);
      var built = buildPlan(opts.dest, opts, style);
      var total = sumLines(built.lines);
      return {
        key: key,
        label: def.label,
        hint: def.hint,
        style: style,
        styleLabel: VM_PLAN_DATA.STYLE_MAP[style].label,
        plan: built,
        total: total,
        verdict: verdictFor(total, opts.budget),
        cuts: cutsFor(built, opts.budget),
        upgrades: upgradesFor(built, opts.dest, opts, style, opts.budget),
        recs: buildRecs(dest, opts, style)
      };
    });
    var suggested = suggestTier(tiers);
    if (fp !== lastOptsKey) {
      selectedTier = suggested;
      lastOptsKey = fp;
    }
    if (["lean", "solid", "stretch"].indexOf(selectedTier) < 0) selectedTier = suggested;
    var active = tiers[0];
    for (var i = 0; i < tiers.length; i++) {
      if (tiers[i].key === selectedTier) active = tiers[i];
      tiers[i].selected = tiers[i].key === selectedTier;
      tiers[i].suggested = tiers[i].key === suggested;
    }
    return {
      opts: opts,
      dest: dest,
      selectedTier: selectedTier,
      suggestedTier: suggested,
      activeStyle: active.style,
      recommended: active.plan,
      total: active.total,
      verdict: active.verdict,
      tiers: tiers,
      cuts: active.cuts,
      upgrades: active.upgrades,
      recs: active.recs
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
      var note = ln.note ? "<span class=\"plan-line-note\">" + esc(ln.note) + "</span>" : "";
      var tip = "";
      if (ln.tip) {
        tip = "<span class=\"plan-line-tip\">" + esc(ln.tip);
        if (ln.tipHref) {
          tip += " <a href=\"" + esc(ln.tipHref) + "\">" + esc(ln.tipHrefLabel || "Read the math") + "</a>";
        }
        tip += "</span>";
        if (ln.tipDetail) {
          tip += "<span class=\"plan-line-tip-detail\">" + esc(ln.tipDetail) + "</span>";
        }
      }
      if (ln.amount <= 0) {
        return "<tr><th>" + esc(ln.label) + note + tip + "</th><td>Not in this plan</td></tr>";
      }
      return "<tr><th>" + esc(ln.label) + note + tip + "</th><td>" + money(ln.amount) + "</td></tr>";
    }).join("");

    var tierCards = model.tiers.map(function (t) {
      var cls = "plan-tier-card";
      if (t.selected) cls += " is-selected";
      if (t.suggested && !t.selected) cls += " is-suggested";
      var vs = t.verdict.word + (t.total <= o.budget ? " · under budget" : " · " + money(t.total - o.budget) + " over");
      var badge = t.selected ? "Selected" : (t.suggested ? "Suggested" : "View");
      return "<button type=\"button\" class=\"" + cls + "\" role=\"radio\" aria-checked=\"" + (t.selected ? "true" : "false") + "\" data-tier=\"" + t.key + "\" id=\"tier-" + t.key + "\">" +
        "<p class=\"plan-tier-label\">" + esc(t.label) + " <span class=\"plan-tier-badge\">" + badge + "</span></p>" +
        "<p class=\"plan-tier-total\">" + money(t.total) + "</p>" +
        "<p class=\"plan-tier-meta\">" + esc(t.styleLabel) + " · " + vs + "</p>" +
        "<p class=\"plan-tier-hint\">" + esc(t.hint) + ".</p>" +
        "</button>";
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
        "<p class=\"plan-kicker\">" + esc(tierLabel(model.selectedTier) + " plan") +
          (model.selectedTier === model.suggestedTier ? " · suggested" : " · you picked this") + "</p>" +
        "<h2 class=\"plan-dest-title\">" + esc(model.dest.label) + "</h2>" +
        "<p class=\"plan-headline-sub\">" + esc(model.recommended.summary) + " · " + people + " traveler" + (people === 1 ? "" : "s") + " · " + o.nights + " night" + (o.nights === 1 ? "" : "s") + " · " + esc(monthLabel) + "</p>" +
        "<p class=\"plan-headline-total\">" + esc(tierLabel(model.selectedTier)) + " total " + money(model.total) + " vs " + money(o.budget) + " budget (" + money(model.total / Math.max(1, people)) + " per person).</p>" +
      "</div>" +
      "<div class=\"plan-verdict-lg " + v.key + "\"><span class=\"plan-verdict-word\">" + v.word + "</span><span class=\"plan-verdict-detail\">" + esc(v.detail) + "</span></div>" +
      "<h3 class=\"panel-title\" id=\"plan-tiers-title\">Choose a plan style</h3>" +
      "<p class=\"plan-section-sub\">Budget, Mid-range, or Splurge rebuilds the itemized numbers, verdict, and Where to book. Mid-range is the lodging you picked. Budget steps down one band. Splurge steps up.</p>" +
      "<div class=\"plan-tiers\" role=\"radiogroup\" aria-labelledby=\"plan-tiers-title\">" + tierCards + "</div>" +
      bookHtml(model) +
      "<h3 class=\"panel-title\">Itemized " + esc(tierLabel(model.selectedTier)) + " plan</h3>" +
      "<p class=\"plan-section-sub\">The gray note is the assumption. A short suggestion sits under each line — longer lists live in Where to book.</p>" +
      "<table class=\"plan-itemize\"><thead><tr><th>Line</th><th>Amount</th></tr></thead><tbody>" +
        rows +
        "<tr class=\"plan-itemize-total\"><th>Estimated total</th><td>" + money(model.total) + "</td></tr>" +
      "</tbody></table>" +
      cutsHtml + upHtml + deepHtml;

    var email = $("email-section");
    if (email) email.hidden = false;

    var blurb = $("p-dest-blurb");
    if (blurb) blurb.textContent = model.dest.blurb || "";

    bindTierControls();
    bindBookTabs();
  }

  function bindBookTabs() {
    var root = document.getElementById("plan-book");
    if (!root) return;
    var tabs = root.querySelectorAll("[role=\"tab\"]");
    function selectTab(id, andFocus) {
      if (REC_TABS.indexOf(id) < 0) return;
      selectedRecTab = id;
      for (var i = 0; i < tabs.length; i++) {
        var tab = tabs[i];
        var on = tab.getAttribute("data-book-tab") === id;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        var panel = document.getElementById("plan-book-panel-" + tab.getAttribute("data-book-tab"));
        if (panel) panel.hidden = !on;
      }
      if (andFocus) {
        var focus = root.querySelector("[data-book-tab=\"" + id + "\"]");
        if (focus) focus.focus();
      }
    }
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () {
        selectTab(this.getAttribute("data-book-tab"), false);
      });
      tabs[i].addEventListener("keydown", function (e) {
        var idx = REC_TABS.indexOf(this.getAttribute("data-book-tab"));
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          selectTab(REC_TABS[Math.min(REC_TABS.length - 1, idx + 1)], true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          selectTab(REC_TABS[Math.max(0, idx - 1)], true);
        } else if (e.key === "Home") {
          e.preventDefault();
          selectTab(REC_TABS[0], true);
        } else if (e.key === "End") {
          e.preventDefault();
          selectTab(REC_TABS[REC_TABS.length - 1], true);
        }
      });
    }
  }

  function bindTierControls() {
    var wrap = document.querySelector(".plan-tiers");
    if (!wrap) return;
    var buttons = wrap.querySelectorAll("[data-tier]");
    function pick(key, andFocus) {
      if (["lean", "solid", "stretch"].indexOf(key) < 0) return;
      selectedTier = key;
      render(compute());
      if (andFocus) {
        var focus = document.querySelector(".plan-tier-card[data-tier=\"" + key + "\"]");
        if (focus) focus.focus();
      }
    }
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        pick(this.getAttribute("data-tier"), false);
      });
      buttons[i].addEventListener("keydown", function (e) {
        var keys = ["lean", "solid", "stretch"];
        var idx = keys.indexOf(this.getAttribute("data-tier"));
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          pick(keys[Math.min(keys.length - 1, idx + 1)], true);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          pick(keys[Math.max(0, idx - 1)], true);
        } else if (e.key === "Home") {
          e.preventDefault();
          pick("lean", true);
        } else if (e.key === "End") {
          e.preventDefault();
          pick("stretch", true);
        }
      });
    }
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
    var current = ($("p-dest") && $("p-dest").value) || "disney";
    (VM_PLAN_DATA.POPULAR || []).forEach(function (p) {
      var list = catalog();
      var exists = false;
      for (var i = 0; i < list.length; i++) if (list[i].id === p.id) exists = true;
      if (!exists) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "plan-shortcut" + (p.id === current ? " is-active" : "");
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
        updateCityGuideLink(p.id);
        render(compute());
      });
      wrap.appendChild(btn);
    });
  }

  var CITY_GUIDE_IDS = {
    disney: 1, anaheim: 1, los_angeles: 1, nyc: 1, vegas: 1, miami: 1,
    san_francisco: 1, chicago: 1, nola: 1, philadelphia: 1, atlanta: 1,
    paris: 1, london: 1, rome: 1, tokyo: 1, cancun: 1, oahu: 1, maui: 1,
    cruise: 1, key_west: 1
  };

  function updateCityGuideLink(destId) {
    var el = $("p-dest-guide-link");
    if (!el) return;
    if (CITY_GUIDE_IDS[destId]) {
      el.hidden = false;
      el.href = "/guides/" + destId;
      el.textContent = "Read the printable city brief →";
    } else {
      el.hidden = true;
    }
  }

  function applyDestFromQuery() {
    var dest = "";
    try {
      dest = (new URLSearchParams(window.location.search).get("dest") ||
              new URLSearchParams(window.location.search).get("destination") || "").trim();
    } catch (e) {
      dest = "";
    }
    if (!dest) return;
    var list = catalog();
    var found = null;
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === dest) found = list[i];
    if (!found) return;
    var sel = $("p-dest");
    if (sel) sel.value = dest;
    var blurb = $("p-dest-blurb");
    if (blurb) blurb.textContent = found.blurb || "";
  }

  function bind() {
    if (window.VM_PLAN_DATA && VM_PLAN_DATA.refreshCatalog) VM_PLAN_DATA.refreshCatalog();
    populateDestinations();
    applyDestFromQuery();
    renderShortcuts();
    var destSel = $("p-dest");
    updateCityGuideLink(destSel ? destSel.value : "disney");
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
          updateCityGuideLink(node.value);
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
    bookHtml: bookHtml,
    parsePick: parsePick,
    chipsFor: chipsFor,
    tipForLine: tipForLine,
    selectTier: function (key) {
      if (["lean", "solid", "stretch"].indexOf(key) >= 0) selectedTier = key;
      return compute();
    },
    selectRecTab: function (id) {
      if (REC_TABS.indexOf(id) >= 0) selectedRecTab = id;
      return selectedRecTab;
    },
    destById: destById,
    tierLabel: tierLabel,
    catalog: catalog,
    filterDestinations: filterDestinations,
    hotelExamplesFor: hotelExamplesFor,
    foodPicksFor: foodPicksFor,
    activitiesPicksFor: activitiesPicksFor,
    fallbackKey: fallbackKey
  };
})();
