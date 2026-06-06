/* =====================================================================
   Vacation Math — Shared picker / dropdown helpers
   Used by allinclusive, whentobook, roadtrip, cruise, themeparks
   ===================================================================== */
(function (global) {
  "use strict";
  var D = global.VM_DATA;
  if (!D) return;

  // Region labels for optgroups
  var REGION_LABELS = {
    US_domestic: "United States",
    Caribbean_Mexico: "Caribbean / Mexico",
    Europe: "Europe",
    Asia: "Asia",
    Latin_America: "Latin America",
    Hawaii: "Hawaii / Pacific",
    Alaska: "Alaska",
    caribbean_mx: "Caribbean / Mexico",
    caribbean: "Caribbean",
    europe: "Europe",
    asia: "Asia",
    africa: "Africa",
    alaska: "Alaska",
    pacific_mexico: "Pacific / West Coast",
    pacific: "Pacific / Hawaii",
    central_america: "Central America",
    hawaii: "Hawaii",
    other: "Other"
  };

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k){
      if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    if (children) children.forEach(function(c){ e.appendChild(c); });
    return e;
  }

  // Build options grouped by region key
  function buildGroupedOptions(items, getRegion, getId, getLabel, selectedId) {
    var groups = {};
    items.forEach(function(it){
      var r = getRegion(it) || "other";
      (groups[r] = groups[r] || []).push(it);
    });
    var ORDER = ["US_domestic","Hawaii","hawaii","Alaska","alaska","pacific_mexico","Caribbean_Mexico","caribbean_mx","caribbean","central_america","Latin_America","Europe","europe","Asia","asia","africa","pacific","other"];
    var frag = document.createDocumentFragment();
    ORDER.forEach(function(rkey){
      if (!groups[rkey]) return;
      var og = document.createElement("optgroup");
      og.label = REGION_LABELS[rkey] || rkey;
      groups[rkey].sort(function(a,b){ return getLabel(a).localeCompare(getLabel(b)); });
      groups[rkey].forEach(function(it){
        var o = document.createElement("option");
        o.value = getId(it);
        o.textContent = getLabel(it);
        if (selectedId && o.value === selectedId) o.selected = true;
        og.appendChild(o);
      });
      frag.appendChild(og);
    });
    return frag;
  }

  // Populate a destination select with grouped optgroups
  function fillDestinationCities(selectEl, selectedId) {
    selectEl.innerHTML = "";
    selectEl.appendChild(buildGroupedOptions(
      D.DESTINATION_CITIES,
      function(c){ return c.region; },
      function(c){ return c.id; },
      function(c){ return c.label; },
      selectedId
    ));
  }

  // Populate an origin select — uses ORIGIN_AIRPORTS (65 airports) with regional optgroups
  function fillOriginCities(selectEl, selectedId) {
    if (window.VM_OriginPicker) {
      VM_OriginPicker.buildOriginDropdown(selectEl, selectedId || "atl");
    } else {
      // Fallback: flat list from ORIGIN_CITIES
      selectEl.innerHTML = "";
      (D.ORIGIN_CITIES || []).slice().sort(function(a,b){ return a.label.localeCompare(b.label); }).forEach(function(c){
        var o = document.createElement("option");
        o.value = c.id; o.textContent = c.label;
        if (selectedId && o.value === selectedId) o.selected = true;
        selectEl.appendChild(o);
      });
    }
  }

  // Populate AI destinations grouped by region
  function fillAIDestinations(selectEl, selectedId) {
    selectEl.innerHTML = "";
    selectEl.appendChild(buildGroupedOptions(
      D.AI_DESTINATIONS,
      function(c){ return c.region; },
      function(c){ return c.id; },
      function(c){ return c.label; },
      selectedId
    ));
  }

  // Populate cruise lines (grouped by tier)
  // Map a port's "lines" string (e.g. "Royal Caribbean", "Holland America")
  // to the line id used in CRUISE_LINES_EXPANDED (e.g. "royal_caribbean").
  // Handles common short-name variants too.
  function lineNameToId(name) {
    if (!name) return "";
    var n = name.toLowerCase().trim();
    var aliases = {
      "royal caribbean": "royal_caribbean",
      "royal": "royal_caribbean",
      "norwegian": "ncl",
      "ncl": "ncl",
      "msc": "msc",
      "carnival": "carnival",
      "disney": "disney",
      "princess": "princess",
      "celebrity": "celebrity",
      "holland america": "holland_america",
      "virgin voyages": "virgin_voyages",
      "virgin": "virgin_voyages",
      "viking": "viking_ocean",
      "viking ocean": "viking_ocean",
      "oceania": "oceania",
      "regent": "regent_seven_seas",
      "regent seven seas": "regent_seven_seas",
      "silversea": "silversea",
      "cunard": "cunard",
      "costa": "costa",
      "azamara": "azamara",
      "margaritaville": "margaritaville_at_sea",
      "margaritaville at sea": "margaritaville_at_sea"
    };
    if (aliases[n]) return aliases[n];
    // Last resort: replace spaces with underscores and try direct match
    var guess = n.replace(/\s+/g, "_");
    return D.CRUISE_LINES_EXPANDED[guess] ? guess : "";
  }

  function getPortLineIds(portId) {
    if (!portId) return null; // null = no filter (any port)
    var port = null;
    for (var i = 0; i < D.CRUISE_PORTS.length; i++) {
      if (D.CRUISE_PORTS[i].id === portId) { port = D.CRUISE_PORTS[i]; break; }
    }
    if (!port || !port.lines) return null;
    var ids = [];
    port.lines.forEach(function(name){
      var id = lineNameToId(name);
      if (id) ids.push(id);
    });
    return ids;
  }

  // selectedId: preserve which line is currently picked if still valid
  // portFilterId (optional): if provided, only include lines that homeport there
  function fillCruiseLines(selectEl, selectedId, portFilterId) {
    selectEl.innerHTML = "";
    var tiers = {
      value: "Value",
      mainstream: "Mainstream",
      premium: "Premium",
      upper_premium: "Upper-premium",
      luxury: "Luxury",
      ultra_luxury: "Ultra-luxury",
      specialty: "Specialty"
    };
    var ORDER = ["value","mainstream","premium","upper_premium","luxury","ultra_luxury","specialty"];
    var allowed = getPortLineIds(portFilterId);
    var byTier = {};
    Object.keys(D.CRUISE_LINES_EXPANDED).forEach(function(id){
      if (allowed && allowed.indexOf(id) === -1) return;
      var l = D.CRUISE_LINES_EXPANDED[id];
      (byTier[l.tier] = byTier[l.tier] || []).push({id:id, l:l});
    });
    ORDER.forEach(function(t){
      if (!byTier[t]) return;
      var og = document.createElement("optgroup");
      og.label = tiers[t] || t;
      byTier[t].sort(function(a,b){ return a.l.label.localeCompare(b.l.label); }).forEach(function(item){
        var o = document.createElement("option");
        o.value = item.id; o.textContent = item.l.label;
        if (selectedId && o.value === selectedId) o.selected = true;
        og.appendChild(o);
      });
      selectEl.appendChild(og);
    });
    // Always add a "custom" escape hatch at the bottom
    var customOg = document.createElement("optgroup");
    customOg.label = "Other";
    var customO = document.createElement("option");
    customO.value = "custom";
    customO.textContent = "Custom — enter your own fare";
    if (selectedId === "custom") customO.selected = true;
    customOg.appendChild(customO);
    selectEl.appendChild(customOg);
  }

  // Populate cruise ports
  function fillCruisePorts(selectEl, selectedId) {
    selectEl.innerHTML = "";
    selectEl.appendChild(buildGroupedOptions(
      D.CRUISE_PORTS,
      function(p){ return p.region === "caribbean" ? "Caribbean_Mexico" : p.region; },
      function(p){ return p.id; },
      function(p){ return p.label; },
      selectedId
    ));
  }

  // Populate theme parks (grouped by region)
  function fillThemeParks(selectEl, selectedId) {
    selectEl.innerHTML = "";
    var parks = Object.keys(D.THEMEPARKS_EXPANDED).map(function(id){
      var p = D.THEMEPARKS_EXPANDED[id];
      var loc = (p.location || "").toLowerCase();
      var region = "US_domestic";
      if (loc.indexOf("calif") > -1 || loc.indexOf(", ca") > -1) region = "California";
      else if (loc.indexOf("florida") > -1 || loc.indexOf(", fl") > -1) region = "Florida";
      else if (loc.indexOf("ohio") > -1 || loc.indexOf("penn") > -1 || loc.indexOf("ny") > -1 || loc.indexOf("jersey") > -1) region = "Northeast/Midwest";
      else if (loc.indexOf("tenn") > -1 || loc.indexOf("miss") > -1 || loc.indexOf("virg") > -1) region = "Southeast";
      return { id:id, label:p.label, region:region };
    });
    var groups = {};
    parks.forEach(function(p){ (groups[p.region] = groups[p.region] || []).push(p); });
    ["Florida","California","Northeast/Midwest","Southeast","US_domestic"].forEach(function(r){
      if (!groups[r]) return;
      var og = document.createElement("optgroup");
      og.label = r === "US_domestic" ? "Other" : r;
      groups[r].sort(function(a,b){ return a.label.localeCompare(b.label); }).forEach(function(p){
        var o = document.createElement("option");
        o.value = p.id; o.textContent = p.label;
        if (selectedId && o.value === selectedId) o.selected = true;
        og.appendChild(o);
      });
      selectEl.appendChild(og);
    });
  }

  // Populate timeshare developers (flat alpha)
  function fillTimeshareDevelopers(selectEl, selectedId) {
    selectEl.innerHTML = "";
    var ids = Object.keys(D.TIMESHARE_DEVELOPERS);
    ids.sort(function(a,b){ return D.TIMESHARE_DEVELOPERS[a].label.localeCompare(D.TIMESHARE_DEVELOPERS[b].label); });
    ids.forEach(function(id){
      var o = document.createElement("option");
      o.value = id; o.textContent = D.TIMESHARE_DEVELOPERS[id].label;
      if (selectedId && o.value === selectedId) o.selected = true;
      selectEl.appendChild(o);
    });
  }

  // Populate vehicles (grouped by type)
  function fillVehicles(selectEl, selectedId) {
    selectEl.innerHTML = "";
    var groups = {
      "Cars": ["compact","sedan","sports"],
      "Hybrid / Electric": ["compact_hybrid","sedan_hybrid","suv_hybrid","ev"],
      "SUVs & Vans": ["compact_suv","suv","minivan","luxury_suv"],
      "Trucks": ["truck","truck_hd"]
    };
    Object.keys(groups).forEach(function(g){
      var og = document.createElement("optgroup");
      og.label = g;
      groups[g].forEach(function(id){
        if (!D.VEHICLES_EXPANDED[id]) return;
        var v = D.VEHICLES_EXPANDED[id];
        var o = document.createElement("option");
        o.value = id; o.textContent = v.label + " (" + v.mpg + " mpg)";
        if (selectedId && o.value === selectedId) o.selected = true;
        og.appendChild(o);
      });
      selectEl.appendChild(og);
    });
  }

  // Populate roadtrip preset routes
  function fillRoadtripRoutes(selectEl) {
    selectEl.innerHTML = "";
    var blank = document.createElement("option");
    blank.value = ""; blank.textContent = "Custom route (enter miles below)";
    selectEl.appendChild(blank);
    var og = document.createElement("optgroup");
    og.label = "Popular routes";
    D.ROADTRIP_ROUTES.slice().sort(function(a,b){ return a.label.localeCompare(b.label); }).forEach(function(r){
      var o = document.createElement("option");
      o.value = r.id; o.textContent = r.label + " — " + r.miles + " mi";
      og.appendChild(o);
    });
    selectEl.appendChild(og);
  }

  // Populate points programs grouped by type
  function fillPointsPrograms(selectEl, selectedId) {
    selectEl.innerHTML = "";
    // Split by label heuristics
    var bank = [], airlineUS = [], airlineIntl = [], hotel = [];
    Object.keys(D.POINTS_EXPANDED).forEach(function(id){
      var p = D.POINTS_EXPANDED[id];
      var lbl = p.label.toLowerCase();
      if (/(chase|amex|capital one|citi|wells|bilt)/.test(lbl)) bank.push({id:id,l:p});
      else if (/(marriott|hilton|hyatt|ihg|wyndham|choice|best western|radisson|accor)/.test(lbl)) hotel.push({id:id,l:p});
      else if (/(delta|united|american|southwest|alaska|jetblue|hawaiian)/.test(lbl)) airlineUS.push({id:id,l:p});
      else airlineIntl.push({id:id,l:p});
    });
    function addGroup(label, arr) {
      if (!arr.length) return;
      var og = document.createElement("optgroup");
      og.label = label;
      arr.sort(function(a,b){ return a.l.label.localeCompare(b.l.label); }).forEach(function(item){
        var o = document.createElement("option");
        o.value = item.id; o.textContent = item.l.label;
        if (selectedId && o.value === selectedId) o.selected = true;
        og.appendChild(o);
      });
      selectEl.appendChild(og);
    }
    addGroup("Bank / flexible points", bank);
    addGroup("US airlines", airlineUS);
    addGroup("International airlines", airlineIntl);
    addGroup("Hotels", hotel);
  }

  global.VM_Pickers = {
    fillDestinationCities: fillDestinationCities,
    fillOriginCities: fillOriginCities,
    fillAIDestinations: fillAIDestinations,
    fillCruiseLines: fillCruiseLines,
    fillCruisePorts: fillCruisePorts,
    lineNameToId: lineNameToId,
    getPortLineIds: getPortLineIds,
    fillThemeParks: fillThemeParks,
    fillTimeshareDevelopers: fillTimeshareDevelopers,
    fillVehicles: fillVehicles,
    fillRoadtripRoutes: fillRoadtripRoutes,
    fillPointsPrograms: fillPointsPrograms,
    REGION_LABELS: REGION_LABELS
  };
})(window);
