/* In-browser planned vs actual trip tracker.
   The workbook download is the file version of the same categories. */
(function () {
  "use strict";

  var CATS = [
    { id: "lodging", label: "Lodging" },
    { id: "flights", label: "Flights" },
    { id: "food", label: "Food and drinks" },
    { id: "tickets", label: "Tickets and activities" },
    { id: "transport", label: "Local transport" },
    { id: "misc", label: "Souvenirs and extras" }
  ];

  function $(id) { return document.getElementById(id); }

  function num(id) {
    var el = $(id);
    var n = el ? parseFloat(el.value) : 0;
    return isFinite(n) ? Math.max(0, n) : 0;
  }

  function money(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function read() {
    var planned = 0;
    var actual = 0;
    var rows = CATS.map(function (c) {
      var p = num("trk-p-" + c.id);
      var a = num("trk-a-" + c.id);
      planned += p;
      actual += a;
      return { label: c.label, planned: p, actual: a };
    });
    var bufferPct = num("trk-buffer");
    var people = Math.max(1, Math.round(num("trk-people")));
    var nameEl = $("trk-name");
    return {
      name: (nameEl && nameEl.value.trim()) || "This trip",
      people: people,
      bufferPct: bufferPct,
      planned: planned,
      buffer: planned * (bufferPct / 100),
      ceiling: planned * (1 + bufferPct / 100),
      actual: actual,
      rows: rows
    };
  }

  function verdict(m) {
    var logged = m.rows.some(function (r) { return r.actual > 0; });
    if (!logged) {
      return {
        key: "tight",
        word: "Plan set",
        detail: "No actuals yet. With a " + m.bufferPct + "% over-count buffer the ceiling is " + money(m.ceiling) + "."
      };
    }
    if (m.actual <= m.planned) {
      return {
        key: "fits",
        word: "Under plan",
        detail: money(m.planned - m.actual) + " under the " + money(m.planned) + " plan. The buffer is still unused."
      };
    }
    if (m.actual <= m.ceiling) {
      return {
        key: "tight",
        word: "Inside the buffer",
        detail: money(m.actual - m.planned) + " over plan, still under the " + money(m.ceiling) + " ceiling."
      };
    }
    return {
      key: "over",
      word: "Over the ceiling",
      detail: money(m.actual - m.ceiling) + " past the buffered ceiling of " + money(m.ceiling) + "."
    };
  }

  function render() {
    var m = read();
    var v = verdict(m);
    var el = $("results");
    if (!el) return;
    var rows = m.rows.map(function (r) {
      var delta = r.actual - r.planned;
      var sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
      return "<tr><th>" + esc(r.label) + "</th><td>" + money(r.planned) + "</td><td>" + money(r.actual) + "</td><td>" + sign + money(Math.abs(delta)) + "</td></tr>";
    }).join("");
    var left = m.ceiling - m.actual;
    el.classList.add("has-results");
    el.innerHTML =
      "<p class=\"plan-kicker\">" + esc(m.name) + " · " + m.people + " traveler" + (m.people === 1 ? "" : "s") + "</p>" +
      "<h2 class=\"panel-title\">Planned vs actual</h2>" +
      "<div class=\"plan-verdict-lg " + v.key + "\"><span class=\"plan-verdict-word\">" + esc(v.word) + "</span><span class=\"plan-verdict-detail\">" + esc(v.detail) + "</span></div>" +
      "<p class=\"big-label\">Actual spent</p>" +
      "<p class=\"big-num\">" + money(m.actual) + "</p>" +
      "<p class=\"hint\">" + money(m.actual / m.people) + " per person. Ceiling " + money(m.ceiling) + " (" + money(left) + " left).</p>" +
      "<table class=\"trk-table\"><thead><tr><th>Category</th><th>Planned</th><th>Actual</th><th>Delta</th></tr></thead><tbody>" +
      rows +
      "<tr><th>Subtotal</th><td>" + money(m.planned) + "</td><td>" + money(m.actual) + "</td><td></td></tr>" +
      "<tr><th>Over-count buffer (" + m.bufferPct + "%)</th><td>" + money(m.buffer) + "</td><td>—</td><td></td></tr>" +
      "<tr><th>Ceiling</th><td>" + money(m.ceiling) + "</td><td>" + money(m.actual) + "</td><td>" + money(left) + " left</td></tr>" +
      "</tbody></table>" +
      "<p>Set the plan in <a href=\"/plan\">Trip Plan</a>, <a href=\"/disney\">Disney</a>, or <a href=\"/cruise\">Cruise</a>, then log actuals here. Fund a gap on <a href=\"/funding\">vacation savings</a>.</p>";
    var email = $("email-section");
    if (email) email.hidden = false;
  }

  function boot() {
    var go = $("tracker-calc");
    if (go) go.addEventListener("click", render);
    ["trk-name", "trk-people", "trk-buffer"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("change", render);
    });
    CATS.forEach(function (c) {
      ["trk-p-", "trk-a-"].forEach(function (prefix) {
        var el = $(prefix + c.id);
        if (el) el.addEventListener("change", render);
      });
    });
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
