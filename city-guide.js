/* =====================================================================
   Vacation Math — city brief renderer
   Fills #city-guide-root from VM_CITY_GUIDES + VM_PLAN_DATA hotel/food/acts.
   Print button = window.print() (Save as PDF in the browser dialog).
   ===================================================================== */
(function (global) {
  "use strict";

  var TIER = [
    { key: "budget", label: "Lean", hint: "Cut where it hurts least" },
    { key: "mid", label: "Solid", hint: "Balanced recommended plan" },
    { key: "lux", label: "Stretch", hint: "Nice-to-haves included" }
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function guideId() {
    if (global.VM_CITY_GUIDE_ID) return global.VM_CITY_GUIDE_ID;
    var path = (location.pathname || "").replace(/\/+$/, "").replace(/\.html$/i, "");
    var slug = path.split("/").pop() || "";
    if (slug && slug !== "guides" && slug !== "city") return slug;
    try {
      return new URLSearchParams(location.search).get("id") || "disney";
    } catch (e) {
      return "disney";
    }
  }

  function hotelBand(id, style) {
    var P = global.VM_PLAN_DATA;
    var dest = P && P.HOTEL_EXAMPLES && P.HOTEL_EXAMPLES[id];
    if (dest && dest[style]) return dest[style];
    return { why: "", picks: [] };
  }

  function foodSrc(id) {
    var P = global.VM_PLAN_DATA;
    return (P && P.FOOD_PICKS && P.FOOD_PICKS[id]) || null;
  }

  function actSrc(id) {
    var P = global.VM_PLAN_DATA;
    return (P && P.ACTIVITIES && P.ACTIVITIES[id]) || null;
  }

  function picksList(items, limit) {
    var list = (items || []).slice(0, limit || 4);
    if (!list.length) return "<p class=\"cg-why\">Same neighborhood rule as Trip Plan — walkable first, airport lodging last.</p>";
    return "<ul class=\"cg-list\">" + list.map(function (item) {
      return "<li>" + esc(item) + "</li>";
    }).join("") + "</ul>";
  }

  function splitActs(items) {
    var free = [];
    var ticketed = [];
    (items || []).forEach(function (item) {
      if (/\((free|cheap|included)/i.test(item) || /\bfree tactic\b/i.test(item)) free.push(item);
      else ticketed.push(item);
    });
    if (!free.length && !ticketed.length) return { free: [], ticketed: items || [] };
    return { free: free, ticketed: ticketed };
  }

  function boutiqueLine(id) {
    var mid = hotelBand(id, "mid");
    var picks = (mid && mid.picks) || [];
    var hit = null;
    var re = /boutique|inn|house|casa|gardens|hoxton|ace|line |clermont|peter and paul| marquésa|marquesa|de’|de'|knot |freehand|generator|pod /i;
    for (var i = 0; i < picks.length; i++) {
      if (re.test(picks[i])) { hit = picks[i]; break; }
    }
    if (!hit && picks[2]) hit = picks[2];
    if (!hit) return "";
    return "<p class=\"cg-note\"><strong>Boutique pick (from the Solid list):</strong> " + esc(hit) + "</p>";
  }

  function linkify(text) {
    var safe = esc(text);
    return safe
      .replace(/drink-package break-even/gi, "<a href=\"/blog/cruise-drink-package-break-even-2026\">drink-package break-even</a>")
      .replace(/hard-budget plan/gi, "<a href=\"/plan\">hard-budget plan</a>");
  }

  function renderGuide(guide) {
    var id = guide.id;
    var planHref = "/plan?dest=" + encodeURIComponent(id);
    var food = foodSrc(id);
    var acts = actSrc(id);

    var hotelHtml = TIER.map(function (t) {
      var band = hotelBand(id, t.key);
      return ""
        + "<article class=\"cg-tier\">"
        +   "<p class=\"cg-tier-label\">" + t.label + " · " + esc(t.hint) + "</p>"
        +   "<h3>Where to stay</h3>"
        +   (band.why ? "<p class=\"cg-why\">" + esc(band.why) + "</p>" : "")
        +   picksList(band.picks, 4)
        + "</article>";
    }).join("");

    var foodHtml = "";
    if (food) {
      foodHtml = (food.note ? "<p class=\"cg-note\">" + esc(food.note) + "</p>" : "")
        + TIER.map(function (t) {
          return ""
            + "<article class=\"cg-tier\">"
            +   "<p class=\"cg-tier-label\">" + t.label + "</p>"
            +   "<h3>Named picks</h3>"
            +   picksList(food[t.key], 5)
            + "</article>";
        }).join("");
    }

    var actHtml = "";
    if (acts) {
      actHtml = TIER.map(function (t) {
        var split = splitActs(acts[t.key]);
        var cols = "";
        if (split.free.length) {
          cols += "<div><p class=\"cg-tier-label\">Free / cheap</p>" + picksList(split.free, 6) + "</div>";
        }
        if (split.ticketed.length) {
          cols += "<div><p class=\"cg-tier-label\">Ticketed / leftover</p>" + picksList(split.ticketed, 6) + "</div>";
        }
        return ""
          + "<article class=\"cg-tier\">"
          +   "<p class=\"cg-tier-label\">" + t.label + "</p>"
          +   "<div class=\"cg-split\">" + cols + "</div>"
          + "</article>";
      }).join("");
    }

    var around = (guide.aroundBullets || []).map(function (b) {
      return "<li>" + esc(b) + "</li>";
    }).join("");

    var tips = (guide.tips || []).map(function (t) {
      var html = linkify(t);
      if (id === "cruise" && /drink-package|break-even/i.test(t) && html.indexOf("<a ") === -1) {
        html += " <a href=\"/blog/cruise-drink-package-break-even-2026\">Break-even math &rarr;</a>";
      }
      return "<li>" + html + "</li>";
    }).join("");

    var related = (guide.related || []).map(function (r) {
      return "<li><a href=\"" + esc(r.href) + "\">" + esc(r.label) + "</a></li>";
    }).join("");

    var more = "";
    var all = (global.VM_CITY_GUIDES && VM_CITY_GUIDES.ALL) || [];
    all.forEach(function (g) {
      if (g.id === id) return;
      more += "<a href=\"/guides/" + encodeURIComponent(g.id) + "\">" + esc(g.label) + "</a>";
    });

    var emailId = "email-guide-" + id;

    return ""
      + "<div class=\"cg-print-bar cg-no-print\">"
      +   "<p class=\"cg-print-bar-note\">Printable brief. In the dialog, choose <strong>Save as PDF</strong>.</p>"
      +   "<button type=\"button\" class=\"cg-print-btn\" data-cg-print>"
      +     "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" aria-hidden=\"true\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/></svg>"
      +     "Download / Print guide"
      +   "</button>"
      + "</div>"

      + "<header class=\"cg-hero\">"
      +   "<p class=\"cg-kicker\">City brief · " + esc(guide.place) + "</p>"
      +   "<h1 class=\"cg-h1\">" + esc(guide.label) + "</h1>"
      +   "<p class=\"cg-hook\">" + esc(guide.hook) + "</p>"
      +   "<p class=\"cg-orient\">VacationMath orientation — not live rates</p>"
      +   "<p class=\"cg-crumb\"><a href=\"/guides\">All guides</a> · <a href=\"" + planHref + "\">Build a hard-budget plan</a></p>"
      + "</header>"

      + "<section class=\"cg-section\" id=\"when\">"
      +   "<h2 class=\"cg-h2\">When to go</h2>"
      +   "<p class=\"cg-lede\"><strong>Go:</strong> " + esc(guide.whenGo) + "</p>"
      +   "<p class=\"cg-lede\"><strong>Skip unless that is the trip:</strong> " + esc(guide.whenSkip) + "</p>"
      +   "<p class=\"cg-lede\">" + esc(guide.whenNote) + "</p>"
      + "</section>"

      + "<section class=\"cg-section\" id=\"stay\">"
      +   "<h2 class=\"cg-h2\">Where to stay</h2>"
      +   "<p class=\"cg-lede\">Lean / Solid / Stretch from the same hotel lists as <a href=\"" + planHref + "\">Trip Plan</a> — brand hotels plus a boutique, not live inventory, no star scores.</p>"
      +   boutiqueLine(id)
      +   "<div class=\"cg-tiers\">" + hotelHtml + "</div>"
      + "</section>"

      + "<section class=\"cg-section\" id=\"eat\">"
      +   "<h2 class=\"cg-h2\">Where to eat</h2>"
      +   "<div class=\"cg-tiers\">" + foodHtml + "</div>"
      + "</section>"

      + "<section class=\"cg-section\" id=\"do\">"
      +   "<h2 class=\"cg-h2\">What to do</h2>"
      +   "<p class=\"cg-lede\">Free / cheap first. Ticketed leftover. Same activity lists as Trip Plan.</p>"
      +   "<div class=\"cg-tiers\">" + actHtml + "</div>"
      + "</section>"

      + "<section class=\"cg-section\" id=\"around\">"
      +   "<h2 class=\"cg-h2\">Getting around</h2>"
      +   "<p class=\"cg-lede\">" + esc(guide.around) + "</p>"
      +   "<ul class=\"cg-list\">" + around + "</ul>"
      + "</section>"

      + "<section class=\"cg-section\" id=\"budget\">"
      +   "<h2 class=\"cg-h2\">Rough budget posture</h2>"
      +   "<div class=\"cg-budget\">"
      +     "<p>" + esc(guide.budgetNote) + "</p>"
      +     "<p><a class=\"cg-btn cg-btn-primary\" href=\"" + planHref + "\">Open Trip Plan with " + esc(guide.label) + " selected &rarr;</a></p>"
      +   "</div>"
      + "</section>"

      + "<section class=\"cg-tips\" id=\"money-saving-tips\">"
      +   "<p class=\"cg-tips-kicker\">Keep the number honest</p>"
      +   "<h2>Top money-saving tips</h2>"
      +   "<ol>" + tips + "</ol>"
      + "</section>"

      + "<section class=\"cg-cta cg-no-print\" id=\"plan-cta\">"
      +   "<h2>Build a hard-budget plan</h2>"
      +   "<p>Same 2026 hotel, food, and activity lists — constrained to a number you can actually spend.</p>"
      +   "<div class=\"cg-cta-row\">"
      +     "<a class=\"cg-btn cg-btn-primary\" href=\"" + planHref + "\">Plan " + esc(guide.short || guide.label) + " &rarr;</a>"
      +     "<a class=\"cg-btn cg-btn-ghost\" href=\"/guides\">All city briefs</a>"
      +   "</div>"
      +   (related ? "<ul class=\"cg-related\">" + related + "</ul>" : "")
      +   "<form class=\"capture\" data-source=\"city-guide-" + esc(id) + "\" novalidate>"
      +     "<label class=\"sr-only\" for=\"" + emailId + "\">Email address</label>"
      +     "<input id=\"" + emailId + "\" name=\"email\" type=\"email\" inputmode=\"email\" autocomplete=\"email\" placeholder=\"your@email.com\" required />"
      +     "<button type=\"submit\" class=\"cg-print-btn\" style=\"margin-top:10px;\">Get the Tuesday brief</button>"
      +     "<p class=\"trust\" style=\"font-size:0.85rem;color:var(--muted);margin:8px 0 0;\">We won’t sell your email. Ever.</p>"
      +     "<p class=\"form-msg\" aria-live=\"polite\"></p>"
      +   "</form>"
      + "</section>"

      + "<nav class=\"cg-more cg-no-print\" aria-label=\"Other city briefs\">"
      +   "<h2>Other destination briefs</h2>"
      +   "<div class=\"cg-more-grid\">" + more + "</div>"
      + "</nav>"

      + "<p class=\"cg-fine\">Vacation Math city brief · 2026 orientation data · estimates, not live quotes · "
      + esc(guide.label) + " · vacationmath.co/guides/" + esc(id) + "</p>";
  }

  function wirePrint(root) {
    var btn = root.querySelector("[data-cg-print]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (typeof gtag === "function") {
        gtag("event", "guide_print", { dest: guideId(), method: "window.print" });
      }
      global.print();
    });
  }

  function renderIndex(root) {
    var all = (global.VM_CITY_GUIDES && VM_CITY_GUIDES.ALL) || [];
    if (!root || !all.length) return;
    root.innerHTML = all.map(function (g) {
      return ""
        + "<article class=\"cg-index-card\">"
        +   "<p class=\"cg-index-kicker\">" + esc(g.place) + "</p>"
        +   "<h3>" + esc(g.label) + "</h3>"
        +   "<p>" + esc(g.blurb) + "</p>"
        +   "<div class=\"cg-index-actions\">"
        +     "<a href=\"/guides/" + encodeURIComponent(g.id) + "\">Open</a>"
        +     "<a href=\"/guides/" + encodeURIComponent(g.id) + "?print=1\">Download / Print</a>"
        +     "<a href=\"/plan?dest=" + encodeURIComponent(g.id) + "\">Plan</a>"
        +   "</div>"
        + "</article>";
    }).join("");
  }

  function boot() {
    var id = guideId();
    var pack = global.VM_CITY_GUIDES;
    var guide = pack && pack.BY_ID && pack.BY_ID[id];
    var root = document.getElementById("city-guide-root");
    if (root && guide) {
      root.innerHTML = renderGuide(guide);
      wirePrint(root);
      try {
        if (new URLSearchParams(location.search).get("print") === "1") {
          setTimeout(function () { global.print(); }, 250);
        }
      } catch (e) {}
    } else if (root && !guide) {
      root.innerHTML = "<p>Unknown destination. <a href=\"/guides\">See all city briefs</a>.</p>";
    }
    var index = document.getElementById("city-briefs-grid");
    if (index) renderIndex(index);
  }

  if (document.getElementById("city-guide-root") || document.getElementById("city-briefs-grid")) {
    boot();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  global.VM_CITY_GUIDE = { render: renderGuide, boot: boot, id: guideId };
})(window);
