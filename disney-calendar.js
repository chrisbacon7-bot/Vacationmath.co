/* =====================================================================
   Disney Calendar Picker — replaces season + week dropdowns
   Builds a season-tinted 2026 calendar grid. Click any day to set both
   the hidden #season (low/avg/high) and #week selects, then triggers
   the calculator's existing recompute path.
   ===================================================================== */
(function () {
  "use strict";

  // 2026 Disney World season calendar — best-of synthesis from Touring Plans /
  // MouseHacking / WDW Magic for the actual 2026 calendar pricing tiers.
  // Each entry is a YYYY-MM-DD start date and the tier through (and including)
  // the following entry's start. Tier values match the existing select:
  //   low  = value season
  //   avg  = regular season
  //   high = peak/holiday season
  // The slug value matches the existing #week select option values so
  // disney.js verdict copy still keys correctly.
  var SEASON_RANGES_2026 = [
    { from: "2026-01-01", tier: "high", slug: "high:christmas",    label: "New Year's week" },
    { from: "2026-01-04", tier: "low",  slug: "low:jan-mid",       label: "Early January" },
    { from: "2026-01-16", tier: "high", slug: "high:mlk",          label: "MLK weekend" },
    { from: "2026-01-19", tier: "low",  slug: "low:late-jan",      label: "Late January" },
    { from: "2026-02-01", tier: "low",  slug: "low:early-feb",     label: "Early February" },
    { from: "2026-02-13", tier: "high", slug: "high:presidents",   label: "Presidents' Day weekend" },
    { from: "2026-02-17", tier: "avg",  slug: "avg:late-feb",      label: "Late February" },
    { from: "2026-03-01", tier: "avg",  slug: "avg:early-march",   label: "Early March" },
    { from: "2026-03-14", tier: "high", slug: "high:spring-break", label: "Spring Break" },
    { from: "2026-04-05", tier: "high", slug: "high:easter",       label: "Easter week" },
    { from: "2026-04-12", tier: "avg",  slug: "avg:late-april",    label: "Late April" },
    { from: "2026-05-01", tier: "avg",  slug: "avg:early-may",     label: "Early May" },
    { from: "2026-05-18", tier: "avg",  slug: "avg:late-may",      label: "Late May" },
    { from: "2026-05-23", tier: "high", slug: "high:memorial",     label: "Memorial Day weekend" },
    { from: "2026-05-26", tier: "avg",  slug: "avg:mid-june",      label: "Early-Mid June" },
    { from: "2026-06-15", tier: "high", slug: "high:summer-peak",  label: "Peak summer" },
    { from: "2026-07-01", tier: "high", slug: "high:july-4",       label: "July 4 week" },
    { from: "2026-07-07", tier: "high", slug: "high:summer-peak",  label: "Peak summer" },
    { from: "2026-08-10", tier: "low",  slug: "low:late-aug",      label: "Late August" },
    { from: "2026-09-01", tier: "low",  slug: "low:early-sep",     label: "Early September" },
    { from: "2026-09-14", tier: "low",  slug: "low:mid-sep",       label: "Mid-September" },
    { from: "2026-09-28", tier: "avg",  slug: "avg:mid-oct",       label: "Mid-October" },
    { from: "2026-10-19", tier: "avg",  slug: "avg:late-oct",      label: "Late October" },
    { from: "2026-10-30", tier: "high", slug: "high:halloween",    label: "Halloween weekend" },
    { from: "2026-11-02", tier: "low",  slug: "low:early-nov",     label: "Early November" },
    { from: "2026-11-22", tier: "high", slug: "high:thanksgiving", label: "Thanksgiving week" },
    { from: "2026-11-29", tier: "low",  slug: "low:early-dec",     label: "Early December" },
    { from: "2026-12-18", tier: "high", slug: "high:christmas",    label: "Christmas / New Year's" },
    { from: "2027-01-01", tier: "high", slug: "high:christmas",    label: "(rollover)" }
  ];

  function dateKey(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return yyyy + "-" + mm + "-" + dd;
  }

  function tierForDate(d) {
    var key = dateKey(d);
    var match = SEASON_RANGES_2026[0];
    for (var i = 0; i < SEASON_RANGES_2026.length - 1; i++) {
      if (key >= SEASON_RANGES_2026[i].from && key < SEASON_RANGES_2026[i + 1].from) {
        match = SEASON_RANGES_2026[i];
        break;
      }
    }
    return match;
  }

  var MONTHS = [
    { y: 2026, m: 0,  label: "January 2026" },
    { y: 2026, m: 1,  label: "February 2026" },
    { y: 2026, m: 2,  label: "March 2026" },
    { y: 2026, m: 3,  label: "April 2026" },
    { y: 2026, m: 4,  label: "May 2026" },
    { y: 2026, m: 5,  label: "June 2026" },
    { y: 2026, m: 6,  label: "July 2026" },
    { y: 2026, m: 7,  label: "August 2026" },
    { y: 2026, m: 8,  label: "September 2026" },
    { y: 2026, m: 9,  label: "October 2026" },
    { y: 2026, m: 10, label: "November 2026" },
    { y: 2026, m: 11, label: "December 2026" }
  ];

  function buildMonth(year, monthIdx, label) {
    var first = new Date(year, monthIdx, 1);
    var startDay = first.getDay(); // 0 = Sunday
    var daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    var html = '<div class="dcal-month" data-month="' + monthIdx + '">';
    html += '<div class="dcal-month-label">' + label + '</div>';
    html += '<div class="dcal-week-header">';
    ["S","M","T","W","T","F","S"].forEach(function(d){
      html += '<div class="dcal-wh">' + d + '</div>';
    });
    html += '</div>';
    html += '<div class="dcal-grid">';
    for (var i = 0; i < startDay; i++) {
      html += '<div class="dcal-day empty"></div>';
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var dt = new Date(year, monthIdx, d);
      var info = tierForDate(dt);
      var iso = dateKey(dt);
      html += '<button type="button" class="dcal-day tier-' + info.tier + '" '
            + 'data-date="' + iso + '" '
            + 'data-tier="' + info.tier + '" '
            + 'data-slug="' + info.slug + '" '
            + 'data-label="' + info.label + '" '
            + 'aria-label="' + iso + ' \u2014 ' + info.label + '">'
            + d + '</button>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }

  function buildAllMonths() {
    return MONTHS.map(function(m){ return buildMonth(m.y, m.m, m.label); }).join("");
  }

  function buildLegend() {
    return '<div class="dcal-legend">'
      + '<span class="dcal-legend-item"><span class="dot tier-low"></span>Value</span>'
      + '<span class="dcal-legend-item"><span class="dot tier-avg"></span>Regular</span>'
      + '<span class="dcal-legend-item"><span class="dot tier-high"></span>Peak / Holiday</span>'
      + '</div>';
  }

  function buildMobileNav(initialIndex) {
    return '<div class="dcal-mobile-nav">'
      + '<button type="button" class="dcal-nav prev" aria-label="Previous month">\u2039</button>'
      + '<span class="dcal-mobile-label">' + MONTHS[initialIndex].label + '</span>'
      + '<button type="button" class="dcal-nav next" aria-label="Next month">\u203A</button>'
      + '</div>';
  }

  function init() {
    var container = document.getElementById("dcal-container");
    if (!container) return;

    var weekField = document.getElementById("week");
    var seasonField = document.getElementById("season");
    if (!weekField || !seasonField) return;

    // Hide the legacy week/season fields' parent .field wrappers
    function hideFieldFor(id) {
      var el = document.getElementById(id);
      if (!el) return;
      var fld = el.closest(".field");
      if (fld) fld.style.display = "none";
    }
    hideFieldFor("week");
    hideFieldFor("season");

    // Build calendar UI
    // Default-open month: current month if 2026, else first available
    var now = new Date();
    var todayMonthIdx = (now.getFullYear() === 2026) ? now.getMonth() : 0;

    container.innerHTML = ''
      + '<div class="dcal-header">'
      +   '<p class="dcal-title">When are you going?</p>'
      +   '<p class="dcal-sub">Tap any day. Colors show Disney&rsquo;s 2026 season tiers.</p>'
      + '</div>'
      + buildLegend()
      + buildMobileNav(todayMonthIdx)
      + '<div class="dcal-months">' + buildAllMonths() + '</div>'
      + '<div class="dcal-selected" id="dcal-selected">No date picked yet &mdash; using ' + (seasonField.value || "Regular") + ' season.</div>';

    // Calendar lives inside the narrow form column — show ONE month at a time
    // on every viewport with prev/next nav. Much friendlier than scrolling 12.
    var monthsWrap = container.querySelector(".dcal-months");
    var monthEls = container.querySelectorAll(".dcal-month");
    var currentIdx = todayMonthIdx;
    function applyView() {
      monthEls.forEach(function(m, i){
        m.classList.toggle("hidden-mobile", i !== currentIdx);
      });
      var nav = container.querySelector(".dcal-mobile-nav");
      if (nav) nav.style.display = "flex";
    }
    applyView();
    window.addEventListener("resize", applyView);

    container.querySelector(".dcal-nav.prev").addEventListener("click", function(){
      currentIdx = Math.max(0, currentIdx - 1);
      container.querySelector(".dcal-mobile-label").textContent = MONTHS[currentIdx].label;
      applyView();
    });
    container.querySelector(".dcal-nav.next").addEventListener("click", function(){
      currentIdx = Math.min(MONTHS.length - 1, currentIdx + 1);
      container.querySelector(".dcal-mobile-label").textContent = MONTHS[currentIdx].label;
      applyView();
    });

    var selectedEl = document.getElementById("dcal-selected");

    function pick(btn) {
      // Clear previously selected
      container.querySelectorAll(".dcal-day.selected").forEach(function(el){ el.classList.remove("selected"); });
      btn.classList.add("selected");
      var tier = btn.getAttribute("data-tier");
      var slug = btn.getAttribute("data-slug");
      var date = btn.getAttribute("data-date");
      var label = btn.getAttribute("data-label");

      // Update hidden #season + #week so disney.js reads the right values.
      // Order matters: set both fields BEFORE firing change events. Only fire
      // ONE change event — week's handler syncs season + triggers recompute.
      // If we have no matching week option, fire season's event instead
      // (after also setting week to custom).
      var opt = weekField.querySelector('option[value="' + slug + '"]');
      if (opt) {
        seasonField.value = tier;
        weekField.value = slug;
        selectedEl.innerHTML = '<strong>' + date + '</strong> &middot; ' + label
          + ' &middot; <span class="tier-pill tier-' + tier + '">' + tierName(tier) + '</span>';
        // Week's change handler also syncs season and calls render(calculate()).
        weekField.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        weekField.value = "custom";
        seasonField.value = tier;
        selectedEl.innerHTML = '<strong>' + date + '</strong> &middot; ' + label
          + ' &middot; <span class="tier-pill tier-' + tier + '">' + tierName(tier) + '</span>';
        seasonField.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }

    function tierName(t) {
      if (t === "low") return "Value season";
      if (t === "high") return "Peak / Holiday";
      return "Regular season";
    }

    container.addEventListener("click", function(ev){
      var btn = ev.target.closest(".dcal-day");
      if (!btn || btn.classList.contains("empty")) return;
      ev.preventDefault();
      pick(btn);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
