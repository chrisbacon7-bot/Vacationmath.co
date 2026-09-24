/* =====================================================================
   Road Trip vs. Fly Calculator
   ===================================================================== */
(function () {
  "use strict";
  var R = VM_DATA.ROADTRIP;
  var ROUTES = VM_DATA.ROADTRIP_ROUTES;
  var VEHICLES = VM_DATA.VEHICLES_EXPANDED;

  function $(id) { return document.getElementById(id); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  function getVehicleMpg(key) {
    if (VEHICLES[key]) return VEHICLES[key].mpg;
    return R.mpgByVehicle[key] || 28;
  }

  function isEV(key) {
    if (VEHICLES[key]) return VEHICLES[key].electric === true || /ev|electric/i.test(VEHICLES[key].label);
    return key === "ev";
  }

  function getRoute() {
    var id = $("route").value;
    if (!id) return null;
    for (var i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i].id === id) return ROUTES[i];
    }
    return null;
  }

  function applyRoute() {
    var route = getRoute();
    if (!route) {
      $("route-note").textContent = "Custom route — enter your own miles below.";
      return;
    }
    $("miles").value = route.miles;
    $("flight-price").value = route.flightAvg;
    $("route-note").textContent = route.origin + " → " + route.destination + " · " + route.miles + " mi · ~" + route.driveHours + " hrs drive · avg flight ~$" + route.flightAvg + " (" + route.flightTime + ")";
  }

  function calculate() {
    var miles = Math.max(50, parseFloat($("miles").value) || 800);
    var vehicleKey = $("vehicle").value;
    var travelers = Math.max(1, parseInt($("travelers").value, 10) || 4);
    var nights = Math.max(1, parseInt($("nights").value, 10) || 5);
    var midway = Math.max(0, parseInt($("midway").value, 10) || 0);
    var flightPrice = Math.max(0, parseFloat($("flight-price").value) || 0);
    var bags = Math.max(0, parseInt($("bags").value, 10) || 0);
    var needRental = $("need-rental").checked;
    var parkAirport = $("park-airport").checked;

    var roundTripMiles = miles * 2;
    var mpg = getVehicleMpg(vehicleKey);
    var ev = isEV(vehicleKey);
    var veh = VEHICLES[vehicleKey] || null;
    var vehLabel = veh ? veh.label : vehicleKey;

    // ---- Drive side ----
    var fuelCost;
    var evDetail = null;
    if (ev) {
      var kwhPerMile = (veh && veh.kwhPerMile) ? veh.kwhPerMile : 0.30;
      var rangeMiles = (veh && veh.rangeMiles) ? veh.rangeMiles : 260;
      var homeRate = R.evHomePerKwh || 0.17;
      var dcRate = R.evDcFastPerKwh || 0.48;
      var homeMiles = Math.min(roundTripMiles, rangeMiles);
      var dcMiles = Math.max(0, roundTripMiles - homeMiles);
      var homeCost = homeMiles * kwhPerMile * homeRate;
      var dcCost = dcMiles * kwhPerMile * dcRate;
      fuelCost = homeCost + dcCost;
      var homeOnly = roundTripMiles * kwhPerMile * homeRate;
      var stops = dcMiles > 0 ? Math.max(1, Math.ceil(dcMiles / (rangeMiles * 0.7))) : 0;
      evDetail = {
        kwhPerMile: kwhPerMile,
        rangeMiles: rangeMiles,
        homeMiles: homeMiles,
        dcMiles: dcMiles,
        homeCost: homeCost,
        dcCost: dcCost,
        homeOnly: homeOnly,
        stops: stops,
        homeRate: homeRate,
        dcRate: dcRate,
        kwh: roundTripMiles * kwhPerMile
      };
    } else {
      fuelCost = (roundTripMiles / mpg) * R.avgGasPrice;
    }
    var wearCost = roundTripMiles * R.wearPerMile;
    var tolls = roundTripMiles * 0.012;
    var midwayHotels = midway * 2 * R.midwayHotelAvg;
    var roadMeals = R.roadMealsPerPersonPerDay * travelers * Math.max(1, midway * 2);
    var driveTotal = fuelCost + wearCost + tolls + midwayHotels + roadMeals;
    var irsAllIn = roundTripMiles * (R.irsBusinessRate || 0.76);

    // ---- Fly side ----
    var flightTickets = flightPrice * travelers;
    var bagFees = bags * R.avgBagFeePerWay * 2;
    var rentalCar = needRental ? R.rentalCarPerDay * nights : 0;
    var airportTransfer = parkAirport
      ? R.parkingPerDayAtAirport * (nights + (midway * 2))
      : R.rideshareAirportEach * 2;
    var flyTotal = flightTickets + bagFees + rentalCar + airportTransfer;

    var diff = Math.abs(driveTotal - flyTotal);
    var noFlight = flightPrice <= 0;
    var winner = noFlight ? "drive" : (driveTotal <= flyTotal ? "drive" : "fly");
    var winnerLabel = winner === "drive" ? "Driving" : "Flying";

    // Time cost
    var route = getRoute();
    var driveHoursOneWay = route ? route.driveHours : (miles / 55);
    var driveHoursTotal = driveHoursOneWay * 2;
    var flyHoursTotal = 6;

    return {
      roundTripMiles: roundTripMiles, mpg: mpg, isEV: ev, vehLabel: vehLabel, evDetail: evDetail,
      fuelCost: fuelCost, wearCost: wearCost, tolls: tolls, irsAllIn: irsAllIn,
      midwayHotels: midwayHotels, roadMeals: roadMeals,
      driveTotal: driveTotal,
      flightTickets: flightTickets, bagFees: bagFees, rentalCar: rentalCar, airportTransfer: airportTransfer,
      flyTotal: flyTotal,
      diff: diff, winner: winner, winnerLabel: winnerLabel, noFlight: noFlight,
      driveHoursTotal: driveHoursTotal, flyHoursTotal: flyHoursTotal,
      travelers: travelers, nights: nights, miles: miles,
      route: route
    };
  }

  function render(r) {
    var html = "";

    if (r.route) {
      html += '<div class="result-note" style="margin-top:0"><strong>' + r.route.label + '</strong> · ' + r.route.miles + ' mi each way · drive ~' + r.route.driveHours + ' hrs · flight ' + r.route.flightTime + '</div>';
    }
    if (r.flightTickets === 0) {
      html += '<div class="result-note"><strong>This route does not have a useful nonstop.</strong> The fly column is bags, a rental, and the airport trip only. Treat driving as the trip, not as the winner of a fare comparison.</div>';
    }

    html += '<div class="compare-grid">';
    html += '  <div class="compare-card ' + (r.winner === "drive" ? "winner" : "") + '">';
    html += '    <p class="cc-label">Drive — ' + r.vehLabel + '</p>';
    html += '    <p class="cc-total">' + money(r.driveTotal) + '</p>';
    if (r.isEV && r.evDetail) {
      html += '    <div class="cc-line"><span>Electricity (' + r.evDetail.kwh.toFixed(0) + ' kWh, ' + r.evDetail.kwhPerMile + ' kWh/mi)</span><span>' + money(r.fuelCost) + '</span></div>';
      html += '    <div class="cc-line"><span>Home charge (' + Math.round(r.evDetail.homeMiles) + ' mi @ ' + Math.round(r.evDetail.homeRate * 100) + '&cent;/kWh)</span><span>' + money(r.evDetail.homeCost) + '</span></div>';
      if (r.evDetail.dcMiles > 0) {
        html += '    <div class="cc-line"><span>DC fast (' + Math.round(r.evDetail.dcMiles) + ' mi, ~' + r.evDetail.stops + ' stop' + (r.evDetail.stops === 1 ? '' : 's') + ')</span><span>' + money(r.evDetail.dcCost) + '</span></div>';
      }
    } else {
      html += '    <div class="cc-line"><span>Gas (' + Math.round(r.roundTripMiles) + ' mi round trip @ ' + r.mpg + ' mpg)</span><span>' + money(r.fuelCost) + '</span></div>';
    }
    html += '    <div class="cc-line"><span>Wear &amp; tear ($0.10/mi)</span><span>' + money(r.wearCost) + '</span></div>';
    html += '    <div class="cc-line"><span>Tolls (~1.2&cent;/mi)</span><span>' + money(r.tolls) + '</span></div>';
    if (r.midwayHotels > 0) html += '    <div class="cc-line"><span>Midway hotel nights</span><span>' + money(r.midwayHotels) + '</span></div>';
    if (r.roadMeals > 0) html += '    <div class="cc-line"><span>Travel-day meals</span><span>' + money(r.roadMeals) + '</span></div>';
    html += '    <div class="cc-line"><span>Driving time</span><span>~' + Math.round(r.driveHoursTotal) + ' hrs</span></div>';
    html += '  </div>';
    html += '  <div class="compare-card ' + (r.winner === "fly" ? "winner" : "") + '">';
    html += '    <p class="cc-label">Fly</p>';
    html += '    <p class="cc-total">' + money(r.flyTotal) + '</p>';
    html += '    <div class="cc-line"><span>Flights (' + r.travelers + ' travelers)</span><span>' + money(r.flightTickets) + '</span></div>';
    if (r.bagFees > 0) html += '    <div class="cc-line"><span>Checked bag fees</span><span>' + money(r.bagFees) + '</span></div>';
    if (r.rentalCar > 0) html += '    <div class="cc-line"><span>Rental car (' + r.nights + ' days)</span><span>' + money(r.rentalCar) + '</span></div>';
    html += '    <div class="cc-line"><span>Airport transfer / parking</span><span>' + money(r.airportTransfer) + '</span></div>';
    html += '    <div class="cc-line"><span>Travel time</span><span>~' + r.flyHoursTotal + ' hrs</span></div>';
    html += '  </div>';
    html += '</div>';

    html += '<div class="estimate-note"><strong>About these numbers.</strong> These are <em>estimates</em>, not live quotes. Drive cost uses EIA fuel averages, AAA wear-and-tear rates, and current MPG data. Flight cost uses Hopper / Google Flights typical ranges for the route and season &mdash; not your specific search. Your real prices will move with fuel that week, fare class, day of the week, and how far out you book. The honest expectation: actual costs land near these numbers, sometimes lower if you book well.</div>';

    var vClass, vTitle, vBody;
    if (r.noFlight) {
      vClass = "info";
      vTitle = "Drive. There isn’t a fare to beat.";
      vBody = "This route’s fly price is $0 because a commercial ticket is not a real alternative (park roads, or no useful nonstop). The drive total is " + money(r.driveTotal) + ". Don’t read the fly column as a cheaper trip.";
    } else if (r.winner === "drive" && r.diff > 500) {
      vClass = "good";
      vTitle = "Drive. It's " + money(r.diff) + " cheaper.";
      vBody = "At " + r.travelers + " travelers and " + Math.round(r.miles) + " miles each way, driving wins decisively. The break-even tilts toward flying around 1,200 miles or fewer than 3 travelers \u2014 neither applies here.";
    } else if (r.winner === "drive") {
      vClass = "fair";
      vTitle = "Drive \u2014 but it's close.";
      vBody = "Driving comes in " + money(r.diff) + " ahead. Close enough that the time difference (" + Math.round(r.driveHoursTotal) + " vs " + r.flyHoursTotal + " hours) could legitimately swing it the other way. If your time is worth more than " + money(Math.round(r.diff / Math.max(1, r.driveHoursTotal - r.flyHoursTotal))) + "/hour, fly.";
    } else if (r.diff > 500) {
      vClass = "good";
      vTitle = "Fly. It's " + money(r.diff) + " cheaper.";
      vBody = "Flights are cheap enough at your search to beat the drive comprehensively \u2014 and you save " + Math.round(r.driveHoursTotal - r.flyHoursTotal) + " hours each way. Lock the fare before it moves.";
    } else {
      vClass = "fair";
      vTitle = "Fly \u2014 and reclaim the time.";
      vBody = "Flying comes in " + money(r.diff) + " ahead on cost and saves " + Math.round(r.driveHoursTotal - r.flyHoursTotal) + " hours. At this margin, flying is the right call almost every time.";
    }
    html += '<div class="verdict ' + vClass + '"><h3>' + vTitle + '</h3><p>' + vBody + '</p></div>';

    html += '<div class="result-note"><strong>What this number means.</strong> These totals are the cost of getting there and back, not the whole vacation. Destination hotel and meals are left out because they are about the same either way. Per traveler: drive ' + money(r.driveTotal / r.travelers) + ', fly ' + money(r.flyTotal / r.travelers) + '. Tolls are about 1.2&cent; per mile; turnpike routes cost more. The IRS business mileage rate would price the drive at ' + money(r.irsAllIn) + ' because it includes insurance and depreciation you mostly pay even if you stay home. This comparison uses gas (or electricity) plus 10&cent;/mile of wear instead.</div>';
    if (r.isEV && r.evDetail) {
      html += '<div class="result-note"><strong>EV depth, not a flat 5&cent; per mile.</strong> The first ' + r.evDetail.rangeMiles + ' miles of the round trip are priced at home power (' + Math.round(r.evDetail.homeRate * 100) + '&cent;/kWh, a round EIA residential rate). Miles after that battery are priced at public DC fast (' + Math.round(r.evDetail.dcRate * 100) + '&cent;/kWh). If you could charge only at home, electricity would be ' + money(r.evDetail.homeOnly) + ' instead of ' + money(r.fuelCost) + '. Wear stays at 10&cent;/mile because tires and depreciation do not disappear on an EV. A gas-price app does not run this split.</div>';
    }
    html += '<p class="result-note"><button type="button" class="vm-tool-btn" id="rt-share">Copy trip link</button> <span id="rt-share-status"></span></p>';
    html += '<div class="result-note"><strong>What people forget to add.</strong> Driving math usually skips midway hotels, tolls, the wear on your car (yes, even on a "free" car you already own), and food at gas stations. Flying math usually skips bag fees ($70 round-trip per checked bag), the rental car at the destination, and airport parking or rideshare. Both add up.</div>';
    html += '<div class="freshness-badge">Gas at $' + R.avgGasPrice.toFixed(2) + '/gal (AAA, August 2026) &middot; next refresh October 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
    var shareBtn = $("rt-share");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var params = new URLSearchParams(location.search);
        ["route", "miles", "vehicle", "travelers", "nights", "midway", "flight-price", "bags"].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) params.set("vm_" + id, el.value);
        });
        ["need-rental", "park-airport"].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) params.set("vm_" + id, el.checked ? "1" : "0");
        });
        var next = location.pathname + "?" + params.toString();
        history.replaceState(null, "", next);
        var url = location.origin + next;
        var status = $("rt-share-status");
        function ok() { if (status) status.textContent = "Trip link copied."; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(ok, function () { if (status) status.textContent = url; });
        } else if (status) {
          status.textContent = url;
        }
      });
    }
    if (typeof VM_ANALYTICS !== "undefined") { VM_ANALYTICS.calcComplete("roadtrip", typeof r !== "undefined" && r && r.total ? r.total : 0); }
    $("email-section").hidden = false;

    VM_CardCTA.render({
      container: document.getElementById("card-cta"),
      tripTotal: Math.min(r.driveTotal, r.flyTotal),
      context: "this trip",
      calcType: "roadtrip",
      opts: { gasCost: r.fuelCost, foodCost: r.roadMeals }
    });

    VM_VerifiedBadge.render($("results"));
    VM_LiveQuote.render({
      container: document.getElementById("live-quote"),
      calc: "roadtrip",
      selection: {}
    });
  }

  $("calculate").addEventListener("click", function (e) {
    e.preventDefault();
    render(calculate());
    if (window.innerWidth < 900) $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("DOMContentLoaded", function () {
    VM_Pickers.fillRoadtripRoutes($("route"));
    VM_Pickers.fillVehicles($("vehicle"), "sedan");
    $("route").addEventListener("change", function() {
      applyRoute();
      render(calculate());
    });
    render(calculate());
  });
  // The capture form is handled by main.js (submitForm -> POST /subscribe).
  // A local handler used to intercept it here and show a success message
  // without sending anything; removed 2026-08-28.
})();
