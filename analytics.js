/* =====================================================================
   Vacation Math — Analytics
   
   Sends calculator events to:
   1. Google Analytics 4 (via gtag) — configure your GA4_MEASUREMENT_ID below
   2. Local storage for the /stats dashboard
   
   TO ACTIVATE GA4:
   Replace 'G-XXXXXXXXXX' with your real GA4 Measurement ID.
   Get it at: analytics.google.com → Admin → Data Streams → Web → Measurement ID
   ===================================================================== */

var VM_ANALYTICS = (function() {
  "use strict";

  // ---- CONFIG ----
  // Replace with your real GA4 Measurement ID after you create the property
  var GA4_ID = "G-XXXXXXXXXX";
  var STORAGE_KEY = "vm_stats";
  var MAX_EVENTS = 500; // keep last 500 events in localStorage

  // ---- GA4 helper ----
  function gtagEvent(eventName, params) {
    if (typeof gtag === "function") {
      gtag("event", eventName, params || {});
    }
  }

  // ---- Local storage event log (safe — skips in iframe/restricted contexts) ----
  function safeStorage(fn) {
    try {
      // Skip in iframes where storage is blocked
      if (window !== window.top) return null;
      return fn();
    } catch(e) { return null; }
  }

  function logLocal(eventName, params) {
    safeStorage(function() {
      var raw = localStorage.getItem(STORAGE_KEY);
      var events = raw ? JSON.parse(raw) : [];
      events.push({
        ts: Date.now(),
        event: eventName,
        params: params || {},
        page: window.location.pathname
      });
      if (events.length > MAX_EVENTS) events = events.slice(-MAX_EVENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    });
  }

  // ---- Public track function ----
  function track(eventName, params) {
    gtagEvent(eventName, params);
    logLocal(eventName, params);
  }

  // ---- Auto-track: page view ----
  track("page_view", {
    page_title: document.title,
    page_path: window.location.pathname
  });

  // ---- Auto-track: calculator completions ----
  // Each calculator calls VM_ANALYTICS.calcComplete(calcName, total, params)
  function calcComplete(calcName, total, params) {
    var p = Object.assign({ calc_name: calcName, estimated_total: Math.round(total || 0) }, params || {});
    track("calc_complete", p);
  }

  // ---- Auto-track: email signups ----
  document.addEventListener("submit", function(e) {
    var form = e.target;
    if (form && form.classList.contains("capture")) {
      var source = form.dataset.source || "unknown";
      track("email_signup", { source: source });
    }
  });

  // ---- Auto-track: CTA clicks ----
  document.addEventListener("click", function(e) {
    var btn = e.target.closest("a.btn, button.btn, a.tp-btn-primary, .ai-pricing-btn");
    if (btn) {
      track("cta_click", {
        label: (btn.textContent || "").trim().slice(0, 50),
        href: btn.href || ""
      });
    }
  });

  // ---- Expose stats reader for /stats page ----
  function getStats() {
    return safeStorage(function() {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    }) || [];
  }

  function clearStats() {
    safeStorage(function() { localStorage.removeItem(STORAGE_KEY); });
  }

  return { track: track, calcComplete: calcComplete, getStats: getStats, clearStats: clearStats };
})();
