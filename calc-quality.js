/* Vacation Math — shared calculator quality layer.
   Copy summary, print, URL reload, source strip, embed snippet,
   and a collapsed card-math gate while affiliates are off.
   Does not invent tracking links. AFFILIATES_LIVE stays false
   until VM_AFFILIATE.enabled is turned on with real URLs. */
(function (g) {
  "use strict";

  var COMPILED = "Last reviewed September 24, 2026.";
  var PAGES = {
    disney: {
      title: "Disney World cost calculator",
      canonical: "https://vacationmath.co/disney",
      source: "2026 published Disney pricing. Includes resort, tickets, tax, dining, Lightning Lane on the days you choose, snacks, transport, tips, souvenirs, and getting there when you enter it. Excludes live availability, party tickets, and annual passes. " + COMPILED
    },
    cruise: {
      title: "Cruise cost calculator",
      canonical: "https://vacationmath.co/cruise",
      source: "2026 published fares and line fees. Includes fare, port fees, and the add-ons you leave on. Drink-package prices already include the automatic bar gratuity. Excludes casino, spa, and travel insurance. " + COMPILED
    },
    roadtrip: {
      title: "Road trip vs fly calculator",
      canonical: "https://vacationmath.co/roadtrip",
      source: "2026 AAA gas average and a conservative wear rate. Gas cars use gallons. EVs split home charging (about 17¢/kWh) from DC fast charging (about 48¢/kWh) after the first battery of range. Includes fuel or electricity, wear, a toll estimate, midway hotels, travel-day meals, and the flying side. Excludes destination hotel and meals. " + COMPILED
    },
    allinclusive: {
      title: "All-inclusive vs à-la-carte calculator",
      canonical: "https://vacationmath.co/allinclusive",
      source: "2026 resort-rate averages across Mexico, the Caribbean, Central America, and Hawaii. The result separates the package premium from meals and drinks you would buy à la carte. Includes the AI rate or a same-tier room-only hotel plus meals, drinks, excursions, tips, spa, airport transfer, and getting there. Calls out Visitax, Dominican tourist card, Hawaii lodging tax, and similar fees that are not inside the resort rate. Excludes travel insurance. " + COMPILED
    },
    points: {
      title: "Points vs cash calculator",
      canonical: "https://vacationmath.co/points",
      source: "2026 valuations from The Points Guy, Frequent Miler reasonable redemption values, and NerdWallet. The default score is the lower of the TPG headline and the transfer floor. Includes the redemption you enter, cash-out, named portal rates, and a transfer-bonus scenario when you still hold the points at the bank. Excludes live award space. " + COMPILED
    },
    themeparks: {
      title: "Theme park comparison",
      canonical: "https://vacationmath.co/themeparks",
      source: "2026 published ticket and hotel averages for destination resorts and regional parks (Six Flags, Cedar Fair, Holiday World, Kennywood, and others). Includes hotel, tickets (multi-day pricing at Disney and Universal), food, skip-the-line, parking, and add-ons you turn on. The comparison names which line — tickets, hotel, food, or skip-the-line — moves the gap. Excludes special events and annual passes. " + COMPILED
    },
    budget: {
      title: "Vacation budget calculator",
      canonical: "https://vacationmath.co/budget",
      source: "2026 averages shared with the other calculators. Includes a full-trip estimate per idea. The 30/35/20/15 split is a planning guide, not a quote. Excludes live fares. " + COMPILED
    },
    whentobook: {
      title: "When to book calculator",
      canonical: "https://vacationmath.co/whentobook",
      source: "2026 airfare booking windows compiled from Expedia Air Hacks, Google Flights, and Going.com. Each region and holiday row has a source label. Includes where your date sits and a price scaled from the quote you type. This is the booking curve, not a Hopper buy/wait color and not a live fare search. Hotels can follow a different window. " + COMPILED
    },
    timeshare: {
      title: "Timeshare vs rent calculator",
      canonical: "https://vacationmath.co/timeshare",
      source: "Industry averages (ARDA purchase and maintenance figures, resale-style recovery). Includes purchase, financing interest, maintenance, assessments, and renting the same week. Excludes your specific contract. " + COMPILED
    },
    funding: {
      title: "Vacation savings plan",
      canonical: "https://vacationmath.co/funding",
      source: "Monthly and weekly cash after savings already set aside. Disney $7,500, cruise $2,800 for two, and all-inclusive $7,000 are the planning bands published on those calculators. Hawaii $5,800 and Europe $7,500 are the low ends of the Big Trip bands. The road-trip preset is $2,010, the Smoky Mountains tracker sample. Not a second price. Includes a month-by-month timeline, print, a shareable link, and a points offset you can turn off (cash-only sinking fund, 1.6¢ blended, or a 2¢ scenario). A sign-up bonus is counted only if you typed one and points are on. Last reviewed September 25, 2026."
    },
    tripfinder: {
      title: "Trip finder",
      canonical: "https://vacationmath.co/tripfinder",
      source: "2026 destination averages. Includes flights, hotels, and on-the-ground costs in the ranking. Excludes live availability. " + COMPILED
    },
    calculator: {
      title: "Trip cost calculator router",
      canonical: "https://vacationmath.co/calculator",
      source: "2026 routing guide. This page does not invent a second price. It sends you to the vertical calculator that itemizes that trip type. Static examples are the same published figures as those tools. " + COMPILED
    },
    plan: {
      title: "Vacation budget planner",
      canonical: "https://vacationmath.co/plan",
      source: "2026 destination tables shared with Trip Finder and the vertical calculators. Includes lodging, food, getting there, and the taxes or gratuities that brochure quotes skip. Fits means at least 8% under budget, Tight means within 8%, Over means more than 8% over. Excludes live availability. " + COMPILED
    },
    "card-finder": {
      title: "Travel credit card finder",
      canonical: "https://vacationmath.co/card-finder",
      source: "September 2026 card terms in the on-site catalog. The dollar figure is a conservative first-year offset on a $5,000 trip, not a live offer and not cash from Vacation Math. Affiliates are off. Excludes approval odds and transfer bonuses. " + COMPILED
    },
    tracker: {
      title: "Trip budget tracker",
      canonical: "https://vacationmath.co/tracker",
      source: "Trip expense tracker: planned and actual numbers by category, a default 10% over-count buffer, a multi-day log, a chart, CSV, and a shareable link. One-click samples: Orlando, a Caribbean cruise, Cancún all-inclusive, Hawaii, Europe, a Smoky Mountains drive, or a blank trip. Category actuals are what you type; the day log does not overwrite them. The workbook download is the optional file version. Last reviewed September 25, 2026."
    }
  };

  function pageKey() {
    var path = (location.pathname || "/").replace(/\.html$/i, "").replace(/\/+$/, "");
    var seg = path.split("/").filter(Boolean).pop() || "";
    if (seg === "index" || seg === "") return "";
    return seg;
  }

  function affiliatesLive() {
    if (g.AFFILIATES_LIVE === true) return true;
    if (g.VM_AFFILIATE && g.VM_AFFILIATE.enabled === true) return true;
    return false;
  }

  function resultsPanel() {
    var ids = ["results", "tf-results", "calc-results", "cf-results", "hub-results"];
    var i, el, fallback = null;
    for (i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (!el) continue;
      if (!fallback) fallback = el;
      if (!el.hasAttribute("hidden")) return el;
    }
    return fallback;
  }

  function inputRoot() {
    return document.querySelector(".calc-inputs")
      || document.querySelector("form.calc-form")
      || document.querySelector("main form")
      || document.querySelector("form");
  }

  function fields() {
    var root = inputRoot();
    if (!root) return [];
    return Array.prototype.filter.call(root.querySelectorAll("input, select, textarea"), function (el) {
      if (!el.id) return false;
      var type = (el.type || "").toLowerCase();
      if (type === "email" || type === "password" || type === "submit" || type === "button" || type === "file") return false;
      return true;
    });
  }

  function writeUrl() {
    var params = new URLSearchParams(location.search);
    var any = false;
    fields().forEach(function (el) {
      var key = "vm_" + el.id;
      var type = (el.type || "").toLowerCase();
      if (type === "checkbox") {
        params.set(key, el.checked ? "1" : "0");
      } else if (type === "radio") {
        if (!el.checked) return;
        params.set(key, el.value);
      } else {
        params.set(key, el.value);
      }
      any = true;
    });
    if (!any) return;
    var qs = params.toString();
    var next = location.pathname + (qs ? "?" + qs : "") + location.hash;
    if (next !== location.pathname + location.search + location.hash) {
      history.replaceState(null, "", next);
    }
  }

  function syncToggles() {
    Array.prototype.forEach.call(document.querySelectorAll(".toggle-btn"), function (btn) {
      var cb = document.getElementById(btn.getAttribute("data-checkbox") || "");
      if (!cb) return;
      var on = !!cb.checked;
      btn.classList.toggle("on", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
      btn.textContent = on ? "On" : "Off";
    });
    var llField = document.getElementById("ll-days-field");
    var llCb = document.getElementById("lightning-lane");
    if (llField && llCb) llField.hidden = !llCb.checked;
    var prem = document.getElementById("ll-premier-extras");
    var premCb = document.getElementById("ll-premier");
    if (prem && premCb) prem.hidden = !premCb.checked;
  }

  function restoreUrl() {
    var params = new URLSearchParams(location.search);
    var found = false;
    fields().forEach(function (el) {
      var key = "vm_" + el.id;
      if (!params.has(key)) return;
      found = true;
      var val = params.get(key);
      var type = (el.type || "").toLowerCase();
      if (type === "checkbox") {
        el.checked = val === "1" || val === "true" || val === "on";
      } else {
        el.value = val;
      }
    });
    if (!found) return false;
    syncToggles();
    fields().forEach(function (el) {
      var type = (el.type || "").toLowerCase();
      if (type === "checkbox" || type === "radio") return;
      try { el.dispatchEvent(new Event("change", { bubbles: true })); } catch (e) {}
    });
    return true;
  }

  function plainSummary(panel) {
    var meta = PAGES[pageKey()] || { title: document.title.replace(/\s*\|.*$/, "").trim() };
    var body = (panel.innerText || "").replace(/\n{3,}/g, "\n\n").trim();
    body = body.replace(/^Copy summary\s+Print \/ Save PDF\s*/i, "");
    return [
      "Vacation Math — " + (meta.title || "Estimate"),
      location.href,
      "",
      body,
      "",
      "Estimate, not a live quote. vacationmath.co"
    ].join("\n");
  }

  function copyText(text, statusEl) {
    function ok() {
      if (statusEl) statusEl.textContent = "Summary copied.";
    }
    function fail() {
      if (statusEl) statusEl.textContent = "Copy failed — select the result and copy it manually.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok, function () {
        fallback(text) ? ok() : fail();
      });
    } else if (!fallback(text)) {
      fail();
    } else {
      ok();
    }
  }

  function fallback(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    var done = false;
    try { done = document.execCommand("copy"); } catch (e) { done = false; }
    document.body.removeChild(ta);
    return done;
  }

  function ensureToolbar(panel) {
    if (!panel || panel.querySelector(".vm-result-toolbar")) return;
    var empty = panel.querySelector(".results-empty");
    if (panel.hasAttribute("hidden") && !panel.classList.contains("has-results")) return;
    if (empty && panel.children.length === 1 && !panel.classList.contains("has-results")) return;
    var bar = document.createElement("div");
    bar.className = "vm-result-toolbar";
    bar.innerHTML = '<button type="button" class="vm-tool-btn" data-act="copy">Copy summary</button>'
      + '<button type="button" class="vm-tool-btn" data-act="print">Print / Save PDF</button>'
      + '<p class="vm-tool-status" aria-live="polite"></p>';
    panel.insertBefore(bar, panel.firstChild);
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var status = bar.querySelector(".vm-tool-status");
      if (btn.getAttribute("data-act") === "copy") {
        writeUrl();
        copyText(plainSummary(panel), status);
      } else if (btn.getAttribute("data-act") === "print") {
        writeUrl();
        g.print();
      }
    });
  }

  function moneyText(el) {
    if (!el) return "";
    var t = (el.textContent || "").trim();
    return /\$|¢|days/.test(t) ? t : "";
  }

  function updateSticky(panel) {
    var bar = document.getElementById("vm-sticky-result");
    if (!bar || !panel) return;
    if (panel.hasAttribute("hidden") && !panel.classList.contains("has-results")) {
      bar.hidden = true;
      document.body.classList.remove("vm-sticky-on");
      return;
    }
    var valueEl = panel.querySelector(".big-card.actual .big-num")
      || panel.querySelector(".compare-card.winner .cc-total")
      || panel.querySelector(".tp-card.cheapest .tp-total")
      || panel.querySelector(".rev-headline-amount")
      || panel.querySelector("#big-pay")
      || panel.querySelector(".big-num");
    var labelEl = panel.querySelector(".big-card.actual .big-label")
      || panel.querySelector(".compare-card.winner .cc-label")
      || panel.querySelector(".verdict h3");
    var value = moneyText(valueEl);
    if (!value) {
      bar.hidden = true;
      document.body.classList.remove("vm-sticky-on");
      return;
    }
    bar.querySelector(".vm-sticky-value").textContent = value;
    bar.querySelector(".vm-sticky-label").textContent = labelEl
      ? (labelEl.textContent || "").trim().slice(0, 80)
      : "Estimate";
    bar.hidden = false;
    document.body.classList.add("vm-sticky-on");
  }

  function watchResults(panel) {
    if (!panel) return;
    var obs = new MutationObserver(function () {
      ensureToolbar(panel);
      updateSticky(panel);
    });
    obs.observe(panel, { childList: true, subtree: true, characterData: true, attributes: true });
    ensureToolbar(panel);
    updateSticky(panel);
  }

  function gateNote() {
    if (affiliatesLive()) {
      return "Optional. Rankings are not paid placements. Confirm every offer on the issuer page before you apply.";
    }
    return "Optional. Affiliates are off, so this is not a kickback and Vacation Math does not pay you “% back.” “You keep” is bonus math on a card, not cash from us. Links go to the issuer.";
  }

  function gateContainer(el) {
    if (!el) return;
    if (el.querySelector(":scope > details.vm-card-gate")) return;
    var text = (el.textContent || "").replace(/\s+/g, "");
    if (!text) return;
    var timeshare = !!el.querySelector(".card-module--timeshare");
    var details = document.createElement("details");
    details.className = "vm-card-gate";
    var summary = document.createElement("summary");
    summary.textContent = timeshare ? "Optional: read before you sign" : "Optional: see card math";
    var note = document.createElement("p");
    note.className = "vm-card-gate-note";
    note.textContent = timeshare
      ? "The estimate above is the result. This note is extra reading, not a card offer."
      : gateNote();
    var body = document.createElement("div");
    body.className = "vm-card-gate-body";
    while (el.firstChild) body.appendChild(el.firstChild);
    details.appendChild(summary);
    details.appendChild(note);
    details.appendChild(body);
    el.appendChild(details);
  }

  function watchCards() {
    ["card-cta", "card-finder-mini"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var obs = new MutationObserver(function () { gateContainer(el); });
      obs.observe(el, { childList: true });
      gateContainer(el);
    });
  }

  function injectSource(panel) {
    var meta = PAGES[pageKey()];
    if (!meta || document.querySelector(".vm-source-strip")) return;
    var strip = document.createElement("aside");
    strip.className = "vm-source-strip";
    strip.setAttribute("role", "note");
    var p = document.createElement("p");
    p.innerHTML = "<strong>Sources.</strong> " + meta.source
      + ' <a href="/sources">How we source numbers</a>.';
    strip.appendChild(p);
    var grid = document.querySelector(".calc-grid");
    var anchor = grid || panel;
    if (!anchor || !anchor.parentNode) return;
    anchor.parentNode.insertBefore(strip, anchor.nextSibling);
  }

  function embedCode(meta) {
    var title = meta.title.replace(/"/g, "");
    return '<iframe src="' + meta.canonical + '" title="' + title
      + '" width="100%" height="900" style="border:0" loading="lazy"></iframe>';
  }

  function injectEmbed() {
    var meta = PAGES[pageKey()];
    if (!meta || document.querySelector(".vm-embed")) return;
    var section = document.createElement("section");
    section.className = "vm-embed";
    section.innerHTML = "<h2>Add this calculator to your site</h2>"
      + "<p>Paste this iframe. It loads the public Vacation Math page at "
      + meta.canonical.replace("https://", "")
      + ". There is no widget network and no tracking pixel in the snippet.</p>"
      + '<div class="vm-embed-row"><textarea readonly rows="3"></textarea>'
      + '<button type="button" class="vm-tool-btn">Copy embed code</button></div>';
    section.querySelector("textarea").value = embedCode(meta);
    var footer = document.querySelector("footer");
    if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
    else document.body.appendChild(section);
    section.querySelector("button").addEventListener("click", function () {
      copyText(embedCode(meta), null);
      this.textContent = "Copied";
    });
  }

  function injectSticky() {
    if (document.getElementById("vm-sticky-result")) return;
    var bar = document.createElement("div");
    bar.id = "vm-sticky-result";
    bar.className = "vm-sticky-result";
    bar.hidden = true;
    bar.innerHTML = '<div><p class="vm-sticky-label">Estimate</p><p class="vm-sticky-value"></p></div>'
      + '<button type="button" class="vm-tool-btn">Copy summary</button>';
    document.body.appendChild(bar);
    bar.querySelector("button").addEventListener("click", function () {
      var panel = resultsPanel();
      if (!panel) return;
      writeUrl();
      copyText(plainSummary(panel), panel.querySelector(".vm-tool-status"));
    });
  }

  function armUrlWrites() {
    var timer = null;
    function schedule() {
      clearTimeout(timer);
      timer = setTimeout(writeUrl, 350);
    }
    document.addEventListener("change", function (e) {
      if (!e.target || !e.target.closest) return;
      if (e.target.closest(".calc-inputs, main form, form")) schedule();
    });
    document.addEventListener("click", function (e) {
      if (!e.target || !e.target.closest) return;
      if (e.target.closest("#calculate, #calc-btn, .toggle-btn, .calc-go")) schedule();
    });
  }

  function boot() {
    var panel = resultsPanel();
    if (!panel && !PAGES[pageKey()]) return;
    injectSource(panel);
    injectEmbed();
    injectSticky();
    watchResults(panel);
    watchCards();
    armUrlWrites();
    g.addEventListener("load", function () {
      var restored = restoreUrl();
      if (!restored) return;
      var btn = document.getElementById("calculate")
        || document.getElementById("calc-btn")
        || document.getElementById("p-calculate")
        || document.getElementById("hub-go")
        || document.getElementById("tracker-calc");
      if (btn) btn.click();
      else writeUrl();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
