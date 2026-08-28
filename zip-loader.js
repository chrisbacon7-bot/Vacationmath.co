/* =====================================================================
   Vacation Math — Lazy ZIP data loader

   zip-data.js is ~1.1 MB (42,354 ZIP → lat/lng pairs). It is only needed
   when a visitor actually types a ZIP code, which is a small minority of
   sessions. Loading it up front cost every visitor ~316 KB gzipped of
   parse-blocking JavaScript before first paint.

   This shim exposes VM_Zip.ensure(cb) — it injects zip-data.js on demand,
   once, and invokes cb(ok) when window.ZIP_DATA is available. Callers that
   need ZIP coordinates go through here instead of touching ZIP_DATA
   directly. VM_Zip.warm(el) starts the download on first focus so the data
   is usually resident by the time the fifth digit is typed.
   ===================================================================== */
(function (global) {
  "use strict";

  // Resolve zip-data.js relative to THIS script rather than the site root, so
  // the loader works at the domain root, from a subdirectory, and behind a
  // path-prefixed proxy or preview host. Falls back to a root-relative path.
  var SRC = (function () {
    var own = document.currentScript;
    if (!own) {
      // currentScript is null when loaded async/deferred — find ourselves.
      var all = document.getElementsByTagName("script");
      for (var i = all.length - 1; i >= 0; i--) {
        if (all[i].src && all[i].src.indexOf("zip-loader.js") !== -1) { own = all[i]; break; }
      }
    }
    if (own && own.src) return own.src.replace(/zip-loader\.js(\?.*)?$/, "zip-data.js");
    return "/zip-data.js";
  })();

  var state = "idle";        // idle | loading | ready | error
  var waiting = [];

  function isReady() {
    return typeof global.ZIP_DATA !== "undefined" && global.ZIP_DATA !== null;
  }

  function flush(ok) {
    var cbs = waiting;
    waiting = [];
    for (var i = 0; i < cbs.length; i++) {
      try { cbs[i](ok); } catch (e) { /* never let one callback break the rest */ }
    }
  }

  // ensure(cb) — cb receives true if ZIP_DATA is usable, false if the
  // download failed. Safe to call repeatedly; only one request is made.
  function ensure(cb) {
    if (isReady()) {
      state = "ready";
      if (cb) cb(true);
      return;
    }
    if (state === "error") {
      if (cb) cb(false);
      return;
    }
    if (cb) waiting.push(cb);
    if (state === "loading") return;

    state = "loading";
    var s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = function () {
      state = isReady() ? "ready" : "error";
      flush(state === "ready");
    };
    s.onerror = function () {
      state = "error";
      flush(false);
    };
    document.head.appendChild(s);
  }

  // warm(el) — begin the download as soon as the visitor shows intent
  // (focus or first keystroke), so the lookup feels instant.
  function warm(el) {
    if (!el || el.__vmZipWarmed) return;
    el.__vmZipWarmed = true;
    var kick = function () { ensure(null); };
    el.addEventListener("focus", kick, { once: true });
    el.addEventListener("input", kick, { once: true });
  }

  function status() { return state; }

  global.VM_Zip = { ensure: ensure, warm: warm, ready: isReady, status: status };
})(window);
