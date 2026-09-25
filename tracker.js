/* In-browser trip budget tracker.
   Planned vs actual by category, a multi-day log, a chart, CSV export,
   and a shareable trip URL. The workbook is the file version of the same idea. */
(function () {
  "use strict";

  var CATS = [
    { id: "lodging", label: "Lodging" },
    { id: "flights", label: "Flights" },
    { id: "food", label: "Food and drinks" },
    { id: "tickets", label: "Tickets and activities" },
    { id: "transport", label: "Local transport" },
    { id: "insurance", label: "Travel insurance" },
    { id: "tips", label: "Tips and gratuities" },
    { id: "misc", label: "Souvenirs and extras" }
  ];

  var SAMPLES = {
    orlando: {
      name: "Sample: Orlando, party of 4",
      people: 4,
      buffer: 10,
      dest: "disney",
      note: "2026 Orlando-shaped category split for a party of 4. Not a live Disney quote — itemize it on the Disney calculator.",
      plan: "/plan?dest=disney",
      vertical: "/disney?vm_adults=2&vm_children=2&vm_nights=5&vm_park-days=4&vm_resort=moderate",
      verticalLabel: "Compare with the Disney calculator",
      values: {
        lodging: [2200, 1980], flights: [1400, 1520], food: [900, 640], tickets: [1800, 1800],
        transport: [220, 180], insurance: [160, 160], tips: [80, 40], misc: [350, 210]
      },
      days: [
        { day: 1, cat: "flights", amount: 760, note: "Outbound" },
        { day: 2, cat: "tickets", amount: 450, note: "Park day" },
        { day: 3, cat: "food", amount: 168, note: "Table service" },
        { day: 5, cat: "misc", amount: 48, note: "Pins" }
      ]
    },
    cruise: {
      name: "Sample: Caribbean cruise, couple",
      people: 2,
      buffer: 10,
      dest: "cruise",
      note: "Couple, 7 nights. Cabin, flights, excursions, and gratuities split from the cruise page’s about-$1,400-per-person all-in floor. Not a live fare.",
      plan: "/plan?dest=cruise",
      vertical: "/cruise?vm_adults=2&vm_nights=7",
      verticalLabel: "Compare with the cruise calculator",
      values: {
        lodging: [1400, 1400], flights: [500, 540], food: [180, 220], tickets: [200, 160],
        transport: [80, 60], insurance: [120, 120], tips: [252, 252], misc: [60, 40]
      },
      days: [
        { day: 1, cat: "flights", amount: 540, note: "To the port" },
        { day: 2, cat: "food", amount: 42, note: "Embarkation drinks" },
        { day: 4, cat: "tickets", amount: 160, note: "Port excursion" },
        { day: 7, cat: "tips", amount: 252, note: "Automatic gratuities" }
      ]
    },
    ai: {
      name: "Sample: Cancún all-inclusive, family of 4",
      people: 4,
      buffer: 10,
      dest: "cancun",
      note: "Family of 4, Cancún-shaped week, split from the about-$7,000 all-in band on the all-inclusive page. Package covers most meals; the food line is cash tips and extras.",
      plan: "/plan?dest=cancun",
      vertical: "/allinclusive?vm_destination=cancun&vm_adults=2&vm_children=2&vm_nights=7",
      verticalLabel: "Compare with the all-inclusive calculator",
      values: {
        lodging: [4200, 4050], flights: [1800, 1920], food: [80, 60], tickets: [400, 280],
        transport: [200, 180], insurance: [250, 250], tips: [200, 160], misc: [150, 90]
      },
      days: [
        { day: 1, cat: "flights", amount: 1920, note: "Four seats" },
        { day: 1, cat: "transport", amount: 180, note: "Airport transfer" },
        { day: 3, cat: "tickets", amount: 180, note: "Catamaran" },
        { day: 6, cat: "tips", amount: 80, note: "Housekeeping cash" }
      ]
    },
    smokies: {
      name: "Sample: Smoky Mountains drive, party of 4",
      people: 4,
      buffer: 10,
      dest: "smoky_mountains",
      note: "Drive, not a flight. Lodging, gas, and park-day costs for a long weekend. Flights stay at $0 on purpose. Price the drive on the road-trip calculator.",
      plan: "/plan?dest=smoky_mountains",
      vertical: "/roadtrip",
      verticalLabel: "Compare drive vs fly",
      values: {
        lodging: [900, 860], flights: [0, 0], food: [480, 510], tickets: [80, 40],
        transport: [320, 345], insurance: [70, 70], tips: [40, 20], misc: [120, 55]
      },
      days: [
        { day: 1, cat: "transport", amount: 78, note: "Gas, outbound" },
        { day: 1, cat: "food", amount: 64, note: "Drive-day meals" },
        { day: 2, cat: "tickets", amount: 40, note: "Parking and pass" },
        { day: 3, cat: "food", amount: 112, note: "Cabin groceries and one dinner" }
      ]
    },
    hawaii: {
      name: "Sample: Hawaii, couple, 7 nights",
      people: 2,
      buffer: 10,
      dest: "oahu",
      note: "Planning split of the $5,800 low end on the Big Trip page (couple, 7 nights): flights $1,800, hotel 7×$260, car 7×$80, and the rest of that floor in food, activities, insurance, and extras. Not a live quote.",
      plan: "/plan?dest=oahu",
      vertical: "/big-trip",
      verticalLabel: "See the Hawaii cost range",
      values: {
        lodging: [1820, 1760], flights: [1800, 1880], food: [900, 820], tickets: [500, 420],
        transport: [560, 540], insurance: [100, 100], tips: [40, 40], misc: [80, 60]
      },
      days: [
        { day: 1, cat: "flights", amount: 1880, note: "Two seats" },
        { day: 1, cat: "transport", amount: 90, note: "Rental car, day 1" },
        { day: 3, cat: "tickets", amount: 160, note: "Snorkel boat" },
        { day: 5, cat: "food", amount: 140, note: "Dinner out" }
      ]
    },
    europe: {
      name: "Sample: Europe, couple, 10 days",
      people: 2,
      buffer: 10,
      dest: "paris",
      note: "Planning split of the $7,500 summer floor on the Big Trip page (couple, 10 days): flights $1,400, hotel 10×$180, transit 10×$40, and the rest of that floor in food, activities, insurance, tips, and extras. Shoulder months on that page run $5,200–$8,800. Not a live quote.",
      plan: "/plan?dest=paris",
      vertical: "/big-trip",
      verticalLabel: "See the Europe cost range",
      values: {
        lodging: [1800, 1800], flights: [1400, 1320], food: [2000, 2140], tickets: [1200, 980],
        transport: [400, 360], insurance: [200, 200], tips: [200, 160], misc: [300, 220]
      },
      days: [
        { day: 1, cat: "flights", amount: 1320, note: "Two seats" },
        { day: 2, cat: "food", amount: 96, note: "Train-day meals" },
        { day: 4, cat: "tickets", amount: 84, note: "Museum day" },
        { day: 6, cat: "transport", amount: 48, note: "Metro cards" }
      ]
    },
    blank: {
      name: "My trip",
      people: 2,
      buffer: 10,
      dest: "",
      note: "Blank trip. Planned and actual start at zero. Type a budget, then log the first expense — or load a sample.",
      plan: "/plan",
      vertical: "/funding",
      verticalLabel: "Turn a total into a savings plan",
      values: {
        lodging: [0, 0], flights: [0, 0], food: [0, 0], tickets: [0, 0],
        transport: [0, 0], insurance: [0, 0], tips: [0, 0], misc: [0, 0]
      },
      days: []
    }
  };

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
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function catLabel(id) {
    var i;
    for (i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].label;
    return id;
  }

  function serializeLog(days) {
    return days.map(function (d) {
      return [d.day, d.cat, d.amount, String(d.note || "").replace(/[|;]/g, " ")].join("|");
    }).join(";");
  }

  function parseLog(s) {
    if (!s) return [];
    return String(s).split(";").filter(Boolean).map(function (part) {
      var bits = part.split("|");
      return {
        day: Math.max(1, parseInt(bits[0], 10) || 1),
        cat: bits[1] || "misc",
        amount: Math.max(0, parseFloat(bits[2]) || 0),
        note: bits.slice(3).join("|")
      };
    });
  }

  function readDaysFromDom() {
    var root = $("trk-days");
    if (!root) return [];
    return Array.prototype.map.call(root.querySelectorAll(".trk-day"), function (row) {
      var dayEl = row.querySelector(".trk-day-n");
      var catEl = row.querySelector(".trk-day-cat");
      var amtEl = row.querySelector(".trk-day-amt");
      var noteEl = row.querySelector(".trk-day-note");
      return {
        day: Math.max(1, parseInt(dayEl && dayEl.value, 10) || 1),
        cat: (catEl && catEl.value) || "misc",
        amount: Math.max(0, parseFloat(amtEl && amtEl.value) || 0),
        note: (noteEl && noteEl.value) || ""
      };
    });
  }

  function writeHidden(days) {
    var hidden = $("trk-log");
    if (hidden) hidden.value = serializeLog(days);
  }

  function catOptions(selected) {
    return CATS.map(function (c) {
      return '<option value="' + c.id + '"' + (c.id === selected ? " selected" : "") + ">" + esc(c.label) + "</option>";
    }).join("");
  }

  function dayRowHtml(d) {
    d = d || { day: 1, cat: "food", amount: 0, note: "" };
    return '<div class="trk-day">' +
      '<label>Day <input type="number" class="trk-day-n" min="1" max="31" value="' + esc(d.day) + '" /></label>' +
      '<label>Category <select class="trk-day-cat">' + catOptions(d.cat) + "</select></label>" +
      '<label>Amount <input type="number" class="trk-day-amt" min="0" step="1" value="' + esc(d.amount) + '" /></label>' +
      '<label>Note <input type="text" class="trk-day-note" maxlength="80" value="' + esc(d.note) + '" /></label>' +
      '<button type="button" class="trk-day-remove">Remove</button>' +
      "</div>";
  }

  function paintDays(days) {
    var root = $("trk-days");
    if (!root) return;
    root.innerHTML = days.map(dayRowHtml).join("");
    writeHidden(days);
  }

  function read() {
    var days = readDaysFromDom();
    var logged = days.reduce(function (sum, d) { return sum + d.amount; }, 0);
    var planned = 0;
    var actual = 0;
    var rows = CATS.map(function (c) {
      var p = num("trk-p-" + c.id);
      var a = num("trk-a-" + c.id);
      planned += p;
      actual += a;
      var byDay = days.reduce(function (sum, d) { return sum + (d.cat === c.id ? d.amount : 0); }, 0);
      return { id: c.id, label: c.label, planned: p, actual: a, byDay: byDay };
    });
    var bufferPct = num("trk-buffer");
    var people = Math.max(1, Math.round(num("trk-people")) || 1);
    var nameEl = $("trk-name");
    var destEl = $("trk-dest");
    var sampleEl = $("trk-sample");
    var sample = SAMPLES[(sampleEl && sampleEl.value) || ""] || null;
    return {
      name: (nameEl && nameEl.value.trim()) || "This trip",
      people: people,
      bufferPct: bufferPct,
      planned: planned,
      buffer: planned * (bufferPct / 100),
      ceiling: planned * (1 + bufferPct / 100),
      actual: actual,
      rows: rows,
      days: days,
      logged: logged,
      dest: (destEl && destEl.value) || "disney",
      sample: sample
    };
  }

  function verdict(m) {
    var logged = m.rows.some(function (r) { return r.actual > 0; });
    if (!logged && m.planned <= 0) {
      return {
        key: "tight",
        word: "Start here",
        detail: "This trip is blank. Load a sample, or type a planned amount and add the first expense."
      };
    }
    if (!logged) {
      return {
        key: "tight",
        word: "Plan set",
        detail: "No expenses yet. With a " + m.bufferPct + "% over-count buffer the ceiling is " + money(m.ceiling) + ". Log the first receipt."
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

  function chartHtml(m) {
    var max = 1;
    m.rows.forEach(function (r) { max = Math.max(max, r.planned, r.actual); });
    return m.rows.map(function (r) {
      var pw = Math.round((r.planned / max) * 100);
      var aw = Math.round((r.actual / max) * 100);
      return '<div class="trk-chart-row"><span>' + esc(r.label) + "</span><div>" +
        '<div class="trk-bar" title="Planned ' + money(r.planned) + '"><span class="plan" style="width:' + pw + '%"></span></div>' +
        '<div class="trk-bar" title="Actual ' + money(r.actual) + '"><span class="act" style="width:' + aw + '%"></span></div>' +
        "</div></div>";
    }).join("");
  }

  function planLinks(m) {
    var sample = m.sample;
    var plan = sample ? sample.plan : ("/plan?dest=" + encodeURIComponent(m.dest));
    var vertical = sample ? sample.vertical : "/plan?dest=" + encodeURIComponent(m.dest);
    var verticalLabel = sample ? sample.verticalLabel : "Open this destination in Trip Plan";
    return { plan: plan, vertical: vertical, verticalLabel: verticalLabel };
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
    var links = planLinks(m);
    var emptyCta = "";
    if (m.actual <= 0 && m.logged <= 0) {
      emptyCta = m.planned <= 0
        ? '<p class="result-note"><strong>No expenses yet.</strong> Load Orlando, a cruise, Hawaii, or Europe above, or type the first planned category and add a receipt.</p>'
        : '<p class="result-note"><strong>No expenses yet.</strong> The plan is set. Add a day in the log, or type an actual next to a category.</p>';
    }
    var logNote = "Day log " + money(m.logged) + " across " + m.days.length + " lines. Category actuals stay what you typed";
    if (m.logged > m.actual + 1) {
      logNote += " — the log is above those actuals, so update one of them.";
    } else if (m.actual > 0 && m.logged > 0 && m.logged + 1 < m.actual) {
      logNote += " (" + money(m.actual - m.logged) + " of actuals is not in the day log yet).";
    } else {
      logNote += ".";
    }
    el.classList.add("has-results");
    el.innerHTML =
      '<p class="plan-kicker">' + esc(m.name) + " · " + m.people + " traveler" + (m.people === 1 ? "" : "s") + "</p>" +
      '<h2 class="panel-title">Planned vs actual trip cost</h2>' +
      '<div class="plan-verdict-lg ' + v.key + '"><span class="plan-verdict-word">' + esc(v.word) + '</span><span class="plan-verdict-detail">' + esc(v.detail) + "</span></div>" +
      '<p class="big-label">Actual spent</p>' +
      '<p class="big-num">' + money(m.actual) + "</p>" +
      '<p class="hint">' + money(m.actual / m.people) + " per person. Plan " + money(m.planned) + ". Ceiling " + money(m.ceiling) + " (" + money(left) + " left).</p>" +
      emptyCta +
      '<h3 class="results-h3">By category</h3>' +
      '<p class="hint"><span class="trk-swatch plan"></span> Planned &nbsp; <span class="trk-swatch act"></span> Actual</p>' +
      chartHtml(m) +
      '<table class="trk-table"><thead><tr><th>Category</th><th>Planned</th><th>Actual</th><th>Delta</th></tr></thead><tbody>' +
      rows +
      "<tr><th>Subtotal</th><td>" + money(m.planned) + "</td><td>" + money(m.actual) + "</td><td></td></tr>" +
      "<tr><th>Over-count buffer (" + m.bufferPct + "%)</th><td>" + money(m.buffer) + "</td><td>—</td><td></td></tr>" +
      "<tr><th>Ceiling</th><td>" + money(m.ceiling) + "</td><td>" + money(m.actual) + "</td><td>" + money(left) + " left</td></tr>" +
      "</tbody></table>" +
      "<p>" + esc(logNote) + "</p>" +
      '<div class="fund-actions">' +
      '<button type="button" class="vm-tool-btn" data-act="share">Copy trip link</button>' +
      '<button type="button" class="vm-tool-btn" data-act="csv">Export CSV</button>' +
      '<button type="button" class="vm-tool-btn" data-act="print">Print tracker</button>' +
      '<p class="vm-tool-status" id="trk-share-status" aria-live="polite"></p>' +
      "</div>" +
      "<p><a href=\"" + esc(links.plan) + "\">Compare this destination in Trip Plan</a> · <a href=\"" + esc(links.vertical) + "\">" + esc(links.verticalLabel) + "</a> · <a href=\"/funding\">Vacation savings calculator</a></p>";
    var email = $("email-section");
    if (email) email.hidden = false;
    var glance = $("trk-glance");
    if (glance) {
      if (m.planned <= 0 && m.actual <= 0) {
        glance.innerHTML = "<strong>At a glance:</strong> this trip is blank. Load a sample, or type a planned budget and the first expense.";
      } else {
        glance.innerHTML = "<strong>At a glance:</strong> " + esc(v.word) + ". Actual " + money(m.actual) + " against a " + money(m.planned) + " plan (" + money(m.actual / m.people) + " per person).";
      }
    }
    var sampleNote = $("trk-sample-note");
    if (sampleNote && m.sample) sampleNote.textContent = m.sample.note;
  }

  function csvEscape(s) {
    var t = String(s == null ? "" : s);
    if (/[",\n]/.test(t)) return '"' + t.replace(/"/g, '""') + '"';
    return t;
  }

  function buildCsv(m) {
    var lines = ["section,day,category,planned,actual,note"];
    m.rows.forEach(function (r) {
      lines.push(["category", "", r.label, r.planned, r.actual, ""].map(csvEscape).join(","));
    });
    lines.push(["total", "", "Plan", m.planned, "", ""].join(","));
    lines.push(["total", "", "Buffer", Math.round(m.buffer), "", m.bufferPct + "%"].join(","));
    lines.push(["total", "", "Ceiling", Math.round(m.ceiling), "", ""].join(","));
    lines.push(["total", "", "Actual", "", Math.round(m.actual), ""].join(","));
    m.days.forEach(function (d) {
      lines.push(["day", d.day, catLabel(d.cat), "", d.amount, d.note].map(csvEscape).join(","));
    });
    lines.push(["trip", "", m.name, "", "", m.people + " travelers"].map(csvEscape).join(","));
    return lines.join("\n");
  }

  function downloadCsv() {
    var m = read();
    var blob = new Blob([buildCsv(m)], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "vacation-trip-budget.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    var status = $("trk-share-status");
    if (status) status.textContent = "CSV downloaded.";
  }

  function shareUrl() {
    writeHidden(readDaysFromDom());
    var params = new URLSearchParams(location.search);
    Array.prototype.slice.call(params.keys()).forEach(function (k) {
      if (k.indexOf("vm_") === 0) params.delete(k);
    });
    document.querySelectorAll(".calc-inputs input, .calc-inputs select, .calc-inputs textarea").forEach(function (el) {
      if (!el.id) return;
      var type = (el.type || "").toLowerCase();
      if (type === "email" || type === "button" || type === "submit") return;
      params.set("vm_" + el.id, el.value);
    });
    var next = location.pathname + "?" + params.toString();
    history.replaceState(null, "", next);
    var status = $("trk-share-status");
    var text = location.origin + next;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (status) status.textContent = "Trip link copied.";
      }, function () {
        if (status) status.textContent = "Link is in the address bar.";
      });
    } else if (status) {
      status.textContent = "Link is in the address bar.";
    }
  }

  function setPair(id, pair) {
    var p = $("trk-p-" + id);
    var a = $("trk-a-" + id);
    if (p) p.value = String(pair[0]);
    if (a) a.value = String(pair[1]);
  }

  function applySample(key) {
    var s = SAMPLES[key];
    if (!s) return;
    if ($("trk-name")) $("trk-name").value = s.name;
    if ($("trk-people")) $("trk-people").value = String(s.people);
    if ($("trk-buffer")) $("trk-buffer").value = String(s.buffer);
    if ($("trk-dest")) $("trk-dest").value = s.dest;
    if ($("trk-sample")) $("trk-sample").value = key;
    CATS.forEach(function (c) {
      if (s.values[c.id]) setPair(c.id, s.values[c.id]);
    });
    paintDays(s.days);
    document.querySelectorAll(".trk-sample").forEach(function (b) {
      var on = b.getAttribute("data-sample") === key;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var note = $("trk-sample-note");
    if (note) note.textContent = s.note;
    render();
  }

  function boot() {
    var go = $("tracker-calc");
    if (go) {
      go.addEventListener("click", function () {
        var hidden = $("trk-log");
        var dom = readDaysFromDom();
        if (hidden && hidden.value && serializeLog(dom) !== hidden.value) {
          paintDays(parseLog(hidden.value));
        }
        render();
      });
    }
    ["trk-name", "trk-people", "trk-buffer", "trk-dest"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("change", render);
    });
    CATS.forEach(function (c) {
      ["trk-p-", "trk-a-"].forEach(function (prefix) {
        var el = $(prefix + c.id);
        if (el) el.addEventListener("change", render);
      });
    });
    document.querySelectorAll(".trk-sample").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applySample(btn.getAttribute("data-sample"));
      });
    });
    var days = $("trk-days");
    if (days) {
      days.addEventListener("input", function () {
        writeHidden(readDaysFromDom());
        render();
      });
      days.addEventListener("click", function (e) {
        var btn = e.target.closest(".trk-day-remove");
        if (!btn) return;
        var row = btn.closest(".trk-day");
        if (row) row.parentNode.removeChild(row);
        writeHidden(readDaysFromDom());
        render();
      });
    }
    var add = $("trk-add-day");
    if (add) {
      add.addEventListener("click", function () {
        var root = $("trk-days");
        if (!root) return;
        var wrap = document.createElement("div");
        wrap.innerHTML = dayRowHtml({ day: root.querySelectorAll(".trk-day").length + 1, cat: "food", amount: 0, note: "" });
        root.appendChild(wrap.firstChild);
        writeHidden(readDaysFromDom());
        render();
      });
    }
    var results = $("results");
    if (results) {
      results.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-act]");
        if (!btn) return;
        if (btn.getAttribute("data-act") === "csv") downloadCsv();
        if (btn.getAttribute("data-act") === "share") shareUrl();
        if (btn.getAttribute("data-act") === "print") window.print();
      });
    }

    var qs = new URLSearchParams(location.search);
    var sample = qs.get("sample");
    if (sample && SAMPLES[sample] && !qs.get("vm_trk-name")) {
      applySample(sample);
      return;
    }
    var hidden = $("trk-log");
    if (hidden && hidden.value) paintDays(parseLog(hidden.value));
    else applySample("orlando");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
