/* =====================================================================
   Vacation Math — Shared Origin Picker
   Provides: airport dropdown builder, ZIP-to-airport auto-select,
   and origin airfare lookup used by all calculators.
   Requires: calc-data.js (VM_DATA.ORIGIN_AIRPORTS, VM_DATA.ORIGIN_AIRFARE)
             zip-data.js  (window.ZIP_DATA)
   ===================================================================== */
(function (global) {
  "use strict";

  var D = global.VM_DATA;
  if (!D) return;

  var AIRPORTS  = D.ORIGIN_AIRPORTS;
  var AIRFARE   = D.ORIGIN_AIRFARE;

  // Region display order for <optgroup>s
  var REGION_ORDER = ["Northeast","Southeast","Midwest","South / Texas","Mountain West","Pacific West"];

  // ----------------------------------------------------------------
  // buildOriginDropdown(selectEl, selectedId)
  // Populates a <select> with all 65 airports grouped by region.
  // Drive option always appears first.
  // ----------------------------------------------------------------
  function buildOriginDropdown(selectEl, selectedId) {
    if (!selectEl) return;
    selectEl.innerHTML = "";

    // Drive option first
    var driveOpt = document.createElement("option");
    driveOpt.value = "driving";
    driveOpt.textContent = "I'm driving — no flight cost";
    if (selectedId === "driving") driveOpt.selected = true;
    selectEl.appendChild(driveOpt);

    // Group airports by region
    var groups = {};
    AIRPORTS.forEach(function(a) {
      if (a.id === "driving") return;
      (groups[a.region] = groups[a.region] || []).push(a);
    });

    REGION_ORDER.forEach(function(region) {
      if (!groups[region]) return;
      var og = document.createElement("optgroup");
      og.label = region;
      groups[region].forEach(function(a) {
        var o = document.createElement("option");
        o.value = a.id;
        o.textContent = a.label;
        if (selectedId && o.value === selectedId) o.selected = true;
        og.appendChild(o);
      });
      selectEl.appendChild(og);
    });
  }

  // ----------------------------------------------------------------
  // nearestAirport(lat, lng)
  // Returns the airport id closest to the given coordinates.
  // Uses simple Haversine distance.
  // ----------------------------------------------------------------
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 3958.8; // miles
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  function nearestAirport(lat, lng) {
    var best = null, bestDist = Infinity;
    AIRPORTS.forEach(function(a) {
      if (a.id === "driving" || a.lat == null) return;
      var d = haversine(lat, lng, a.lat, a.lng);
      if (d < bestDist) { bestDist = d; best = a.id; }
    });
    return best;
  }

  // ----------------------------------------------------------------
  // zipToAirport(zip, callback)
  // Looks up ZIP coords from ZIP_DATA, finds nearest airport,
  // calls callback(airportId, cityLabel) — or null if not found.
  // ----------------------------------------------------------------
  function zipToAirport(zip, callback) {
    var z = String(zip).trim().replace(/\D/g,"").slice(0,5);
    if (z.length < 5) { callback(null); return; }

    // ZIP_DATA is loaded on demand (see zip-loader.js) so the 1.1 MB table
    // isn't shipped to visitors who never type a ZIP.
    var resolve = function () {
      var data = global.ZIP_DATA;
      if (!data || !data[z]) { callback(null); return; }
      var coords = data[z]; // [lat, lng]
      var id = nearestAirport(coords[0], coords[1]);
      var airport = id ? AIRPORTS.filter(function(a){ return a.id === id; })[0] : null;
      callback(id, airport ? airport.label : null);
    };

    if (global.VM_Zip) {
      global.VM_Zip.ensure(function (ok) {
        if (!ok) { callback(null); return; }
        resolve();
      });
    } else {
      resolve(); // zip-data.js loaded eagerly (legacy pages)
    }
  }

  // ----------------------------------------------------------------
  // getOriginFares(originId)
  // Returns the airfare band object for a given airport id.
  // Falls back to atl (Southeast average) if not found.
  // ----------------------------------------------------------------
  function getOriginFares(originId) {
    return AIRFARE[originId] || AIRFARE["atl"];
  }

  // ----------------------------------------------------------------
  // wireZipAutoSelect(zipInputEl, originSelectEl, statusEl)
  // Attaches input listener: when ZIP is 5 digits, auto-selects
  // nearest airport and optionally updates a status element.
  // ----------------------------------------------------------------
  function wireZipAutoSelect(zipInputEl, originSelectEl, statusEl) {
    if (!zipInputEl || !originSelectEl) return;
    // Start fetching the ZIP table as soon as the field is touched.
    if (global.VM_Zip) global.VM_Zip.warm(zipInputEl);
    zipInputEl.addEventListener("input", function() {
      var z = zipInputEl.value.replace(/\D/g,"");
      if (z.length !== 5) return;
      zipToAirport(z, function(id, label) {
        if (!id) return;
        originSelectEl.value = id;
        if (statusEl && label) {
          statusEl.textContent = "Nearest airport: " + label;
          statusEl.style.display = "block";
        }
        // Fire change event so calculators react
        originSelectEl.dispatchEvent(new Event("change"));
      });
    });
  }

  // ----------------------------------------------------------------
  // driveDistanceNote(originId, destLat, destLng, destName)
  // Returns a warning string if driving from this origin to the
  // destination is impractically far (>900 miles one way).
  // ----------------------------------------------------------------
  function driveDistanceNote(originId, destLat, destLng, destName) {
    var airport = AIRPORTS.filter(function(a){ return a.id === originId; })[0];
    if (!airport || airport.lat == null) return null;
    var miles = Math.round(haversine(airport.lat, airport.lng, destLat, destLng));
    if (miles < 900) return null;
    return "Heads up: " + airport.label.split(" (")[0] + " to " + destName +
           " is roughly " + miles.toLocaleString() + " miles each way. " +
           "Flying may cost less than the drive.";
  }

  // ----------------------------------------------------------------
  // initOnPage(opts)
  // One-call setup for any calculator page.
  // opts.selectId    — id of the origin <select> (default: 'origin')
  // opts.zipId       — id of the ZIP input (default: 'origin-zip')
  // opts.statusId    — id of the status span (default: 'origin-zip-status')
  // opts.defaultId   — airport id to pre-select (default: 'atl')
  // opts.destRegion  — destination regionFlight band for pre-filling flight cost
  //                    (e.g. 'domestic', 'caribbean'). If set, wires change event
  //                    to update #gt-flight-cost with per-person estimate × party size.
  // opts.getPartySize — function returning number of ticketed travelers
  // opts.destLat / opts.destLng / opts.destName — for drive distance note
  // ----------------------------------------------------------------
  function initOnPage(opts) {
    opts = opts || {};
    var selId    = opts.selectId  || 'origin';
    var zipId    = opts.zipId     || 'origin-zip';
    var statusId = opts.statusId  || 'origin-zip-status';
    var defId    = opts.defaultId || 'atl';

    var selEl    = document.getElementById(selId);
    var zipEl    = document.getElementById(zipId);
    var statusEl = document.getElementById(statusId);

    buildOriginDropdown(selEl, defId);
    wireZipAutoSelect(zipEl, selEl, statusEl);

    // If destRegion provided, pre-fill gt-flight-cost on origin change
    if (opts.destRegion && selEl) {
      function prefillFlight() {
        var id = selEl.value;
        if (id === 'driving') return;
        var fares = getOriginFares(id);
        var fare = fares[opts.destRegion] || fares.domestic || 0;
        var party = opts.getPartySize ? opts.getPartySize() : 2;
        var total = Math.round(fare * party);
        var costEl = document.getElementById('gt-flight-cost');
        if (costEl && total > 0) {
          costEl.value = total;
          costEl.dispatchEvent(new Event('input'));
        }
        // Drive distance note
        if (id === 'driving' && opts.destLat && opts.destLng) {
          var note = driveDistanceNote(id, opts.destLat, opts.destLng, opts.destName || 'your destination');
          if (note && statusEl) { statusEl.textContent = note; statusEl.style.display = 'block'; }
        }
      }
      selEl.addEventListener('change', prefillFlight);
      // Run once on load
      setTimeout(prefillFlight, 100);
    }
  }

  global.VM_OriginPicker = {
    buildOriginDropdown: buildOriginDropdown,
    zipToAirport: zipToAirport,
    nearestAirport: nearestAirport,
    getOriginFares: getOriginFares,
    wireZipAutoSelect: wireZipAutoSelect,
    driveDistanceNote: driveDistanceNote,
    initOnPage: initOnPage
  };

})(window);
