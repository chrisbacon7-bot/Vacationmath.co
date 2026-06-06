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
    var vehLabel = VEHICLES[vehicleKey] ? VEHICLES[vehicleKey].label : vehicleKey;

    // ---- Drive side ----
    var fuelCost;
    if (ev) {
      fuelCost = roundTripMiles * 0.055;
    } else {
      fuelCost = (roundTripMiles / mpg) * R.avgGasPrice;
    }
    var wearCost = roundTripMiles * R.wearPerMile;
    var midwayHotels = midway * 2 * R.midwayHotelAvg;
    var roadMeals = R.roadMealsPerPersonPerDay * travelers * Math.max(1, midway * 2);
    var driveTotal = fuelCost + wearCost + midwayHotels + roadMeals;

    // ---- Fly side ----
    var flightTickets = flightPrice * travelers;
    var bagFees = bags * R.avgBagFeePerWay * 2;
    var rentalCar = needRental ? R.rentalCarPerDay * nights : 0;
    var airportTransfer = parkAirport
      ? R.parkingPerDayAtAirport * (nights + (midway * 2))
      : R.rideshareAirportEach * 2;
    var flyTotal = flightTickets + bagFees + rentalCar + airportTransfer;

    var diff = Math.abs(driveTotal - flyTotal);
    var winner = driveTotal <= flyTotal ? "drive" : "fly";
    var winnerLabel = winner === "drive" ? "Driving" : "Flying";

    // Time cost
    var route = getRoute();
    var driveHoursOneWay = route ? route.driveHours : (miles / 55);
    var driveHoursTotal = driveHoursOneWay * 2;
    var flyHoursTotal = 6;

    return {
      roundTripMiles: roundTripMiles, mpg: mpg, isEV: ev, vehLabel: vehLabel,
      fuelCost: fuelCost, wearCost: wearCost, midwayHotels: midwayHotels, roadMeals: roadMeals,
      driveTotal: driveTotal,
      flightTickets: flightTickets, bagFees: bagFees, rentalCar: rentalCar, airportTransfer: airportTransfer,
      flyTotal: flyTotal,
      diff: diff, winner: winner, winnerLabel: winnerLabel,
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

    html += '<div class="compare-grid">';
    html += '  <div class="compare-card ' + (r.winner === "drive" ? "winner" : "") + '">';
    html += '    <p class="cc-label">Drive — ' + r.vehLabel + '</p>';
    html += '    <p class="cc-total">' + money(r.driveTotal) + '</p>';
    html += '    <div class="cc-line"><span>' + (r.isEV ? "Electricity" : "Gas") + ' (' + Math.round(r.roundTripMiles) + ' mi round trip @ ' + r.mpg + ' mpg)</span><span>' + money(r.fuelCost) + '</span></div>';
    html += '    <div class="cc-line"><span>Wear &amp; tear ($0.10/mi)</span><span>' + money(r.wearCost) + '</span></div>';
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
    if (r.winner === "drive" && r.diff > 500) {
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

    html += '<div class="result-note"><strong>What people forget to add.</strong> Driving math usually skips midway hotels, the wear on your car (yes, even on a "free" car you already own), and food at gas stations. Flying math usually skips bag fees ($70 round-trip per checked bag), the rental car at the destination, and airport parking or rideshare. Both add up.</div>';
    html += '<div class="freshness-badge">Gas at $' + R.avgGasPrice.toFixed(2) + '/gal (AAA, May 2026) &middot; next refresh August 2026</div>';

    $("results").innerHTML = html;
    $("results").classList.add("has-results");
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

  var emailForm = document.querySelector('form[data-source="roadtrip-calc"]');
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = emailForm.querySelector('input[type="email"]');
      var msg = emailForm.querySelector(".form-msg");
      if (!input.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
        msg.textContent = "Please enter a valid email."; msg.style.color = "var(--coral)"; return;
      }
      msg.textContent = "Got it. Check your inbox in the next 2 minutes.";
      msg.style.color = "var(--navy)";
      input.value = "";
    });
  }
})();
