/* =====================================================================
   Vacation Math — city brief renderer
   Builds printable HTML from VM_CITY_GUIDES + VM_PLAN_DATA.
   Works in the browser and in Node (scripts/build-city-guides.js).
   If the page already has static .cg-hero content, JS only wires print.
   ===================================================================== */
(function (global) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function paras(list) {
    return (list || []).map(function (p) {
      return "<p class=\"cg-prose\">" + esc(p) + "</p>";
    }).join("");
  }

  function guideId() {
    if (global.VM_CITY_GUIDE_ID) return global.VM_CITY_GUIDE_ID;
    if (typeof location === "undefined") return "";
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

  function splitNameWhy(item) {
    var s = String(item || "").trim();
    if (!s) return { name: "", why: "" };
    var dash = s.indexOf(" — ");
    if (dash < 0) dash = s.indexOf(" – ");
    if (dash > 0) {
      return { name: s.slice(0, dash).trim(), why: s.slice(dash + 3).trim() };
    }
    var colon = s.indexOf(": ");
    if (colon > 0 && colon < 28) {
      return { name: s.slice(0, colon).trim(), why: s.slice(colon + 2).trim() };
    }
    return { name: s, why: "" };
  }

  function nameWhyList(items, limit) {
    var list = (items || []).slice(0, limit || 3);
    if (!list.length) return "";
    return "<ul class=\"cg-namewhy\">" + list.map(function (item) {
      var nw = splitNameWhy(item);
      if (!nw.why) return "<li>" + esc(nw.name) + "</li>";
      return "<li><strong>" + esc(nw.name) + "</strong> <span>" + esc(nw.why) + "</span></li>";
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

  function linkify(text) {
    var safe = esc(text);
    return safe
      .replace(/drink-package break-even/gi, "<a href=\"/blog/cruise-drink-package-break-even-2026\">drink-package break-even</a>")
      .replace(/hard-budget plan/gi, "<a href=\"/plan\">hard-budget plan</a>");
  }

  function shortNames(items, limit) {
    return (items || []).slice(0, limit || 2).map(function (item) {
      return splitNameWhy(item).name;
    }).filter(Boolean);
  }

  function staySection(guide, planHref) {
    var id = guide.id;
    var mid = hotelBand(id, "mid");
    var budget = hotelBand(id, "budget");
    var lux = hotelBand(id, "lux");
    var less = shortNames(budget.picks, 2);
    var more = shortNames(lux.picks, 2);
    var spend = "";
    if (less.length || more.length) {
      spend = "<div class=\"cg-spend\">";
      if (less.length) {
        spend += "<p><strong>Need to spend less?</strong> Look at " + esc(less.join(" or ")) + ".</p>";
      }
      if (more.length) {
        spend += "<p><strong>If leftover is real?</strong> " + esc(more.join(" or ")) + ". Still one base — do not hotel-hop.</p>";
      }
      spend += "</div>";
    }

    return ""
      + "<section class=\"cg-section\" id=\"stay\">"
      +   "<h2 class=\"cg-h2\">" + esc(guide.stayTitle || "Where to stay") + "</h2>"
      +   (guide.stayLead ? "<p class=\"cg-lede\">" + esc(guide.stayLead) + "</p>" : "")
      +   paras(guide.stayProse)
      +   (mid.picks && mid.picks.length
        ? "<p class=\"cg-subhead\">A few places to search</p>" + nameWhyList(mid.picks, 4)
        : "")
      +   spend
      +   "<p class=\"cg-align\">Search these on <a href=\"" + planHref + "\">Trip Plan</a> — same example properties, not live inventory and not a ranking.</p>"
      + "</section>";
  }

  function eatSection(guide) {
    var food = foodSrc(guide.id);
    var body = paras(guide.eatProse);
    if (food) {
      var picks = (food.mid && food.mid.length) ? food.mid : food.budget;
      if (picks && picks.length) {
        body += "<p class=\"cg-subhead\">What we would eat</p>" + nameWhyList(picks, 4);
      }
      var lux = shortNames(food.lux, 2);
      if (lux.length) {
        body += "<p class=\"cg-note\">If you want to spend more, one reservation — " + esc(lux.join(" or ")) + " — is enough. Do not make every meal the treat.</p>";
      }
      if (food.note) body += "<p class=\"cg-note\">" + esc(food.note) + "</p>";
    }
    return ""
      + "<section class=\"cg-section\" id=\"eat\">"
      +   "<h2 class=\"cg-h2\">" + esc(guide.eatTitle || "Where to eat") + "</h2>"
      +   (guide.eatLead ? "<p class=\"cg-lede\">" + esc(guide.eatLead) + "</p>" : "")
      +   body
      + "</section>";
  }

  function doSection(guide) {
    var acts = actSrc(guide.id);
    var body = paras(guide.doProse);
    if (acts) {
      var budget = splitActs(acts.budget || []);
      var mid = splitActs(acts.mid || []);
      var free = budget.free.length ? budget.free : mid.free;
      var paid = mid.ticketed.length ? mid.ticketed : (acts.mid || []);
      if (free.length) {
        body += "<p class=\"cg-subhead\">Free on purpose</p>" + nameWhyList(free, 4);
      }
      if (paid.length) {
        body += "<p class=\"cg-subhead\">One ticket if leftover is real</p>" + nameWhyList(paid, 3);
      }
    }
    return ""
      + "<section class=\"cg-section\" id=\"do\">"
      +   "<h2 class=\"cg-h2\">" + esc(guide.doTitle || "What to do") + "</h2>"
      +   (guide.doLead ? "<p class=\"cg-lede\">" + esc(guide.doLead) + "</p>" : "")
      +   body
      + "</section>";
  }

  function baseSection(guide) {
    var base = guide.base;
    if (!base) return "";
    var bullets = base.bullets;
    if (!bullets || !bullets.length) {
      bullets = [];
      if (base.lean) bullets.push(base.lean);
      if (base.stretch) bullets.push(base.stretch);
    }
    bullets = bullets.slice(0, 2);
    if (!base.lede && !bullets.length) return "";
    return ""
      + "<aside class=\"cg-base\" id=\"base\">"
      +   "<p class=\"cg-base-kicker\">Base yourself here</p>"
      +   (base.lede ? "<p class=\"cg-base-lede\">" + esc(base.lede) + "</p>" : "")
      +   (bullets.length ? "<ul class=\"cg-plain\">" + bullets.map(function (b) {
        return "<li>" + esc(b) + "</li>";
      }).join("") + "</ul>" : "")
      + "</aside>";
  }

  function renderGuide(guide) {
    var id = guide.id;
    var planHref = "/plan?dest=" + encodeURIComponent(id);

    var days = (guide.days || []).map(function (d, i) {
      return ""
        + "<article class=\"cg-day\">"
        +   "<p class=\"cg-day-kicker\">Day " + (d.n || (i + 1)) + "</p>"
        +   "<h3>" + esc(d.title) + "</h3>"
        +   "<p>" + esc(d.body) + "</p>"
        + "</article>";
    }).join("");

    var skip = (guide.skip || []).map(function (s) {
      if (typeof s === "string") return "<li>" + esc(s) + "</li>";
      return "<li><strong>" + esc(s.name) + "</strong> — " + esc(s.why) + "</li>";
    }).join("");

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
    var all = (global.VM_CITY_GUIDES && global.VM_CITY_GUIDES.ALL) || [];
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

      + "<header class=\"cg-hero\" data-cg-static=\"1\">"
      +   "<p class=\"cg-kicker\">" + esc(guide.kicker || ("City brief · " + guide.place)) + "</p>"
      +   "<h1 class=\"cg-h1\">" + esc(guide.label) + "</h1>"
      +   "<p class=\"cg-hook\">" + esc(guide.hook) + "</p>"
      +   "<p class=\"cg-orient\">VacationMath orientation — not live rates</p>"
      +   "<p class=\"cg-crumb\"><a href=\"/guides\">All guides</a> · <a href=\"" + planHref + "\">Build a hard-budget plan</a></p>"
      + "</header>"

      + (guide.works
        ? "<section class=\"cg-section cg-works\" id=\"works\">"
          + "<h2 class=\"cg-h2\">" + esc(guide.worksTitle || "How this city actually works") + "</h2>"
          + "<p class=\"cg-prose\">" + esc(guide.works) + "</p>"
          + "</section>"
        : "")

      + baseSection(guide)

      + (days
        ? "<section class=\"cg-section\" id=\"days\">"
          + "<h2 class=\"cg-h2\">" + esc(guide.daysTitle || "A 3-day skeleton") + "</h2>"
          + (guide.daysLead ? "<p class=\"cg-lede\">" + esc(guide.daysLead) + "</p>" : "")
          + "<div class=\"cg-days\">" + days + "</div>"
          + "</section>"
        : "")

      + "<section class=\"cg-section\" id=\"when\">"
      +   "<h2 class=\"cg-h2\">" + esc(guide.whenTitle || "When to go") + "</h2>"
      +   (guide.whenLead ? "<p class=\"cg-lede\">" + esc(guide.whenLead) + "</p>" : "")
      +   "<p class=\"cg-when-line\"><span>Go</span> " + esc(guide.whenGo) + "</p>"
      +   "<p class=\"cg-when-line\"><span>Skip unless that is the trip</span> " + esc(guide.whenSkip) + "</p>"
      +   "<p class=\"cg-prose\">" + esc(guide.whenNote) + "</p>"
      + "</section>"

      + staySection(guide, planHref)
      + eatSection(guide)
      + doSection(guide)

      + (skip
        ? "<section class=\"cg-section cg-skip\" id=\"skip\">"
          + "<h2 class=\"cg-h2\">" + esc(guide.skipTitle || "Skip this") + "</h2>"
          + (guide.skipLead ? "<p class=\"cg-lede\">" + esc(guide.skipLead) + "</p>" : "")
          + "<ul class=\"cg-skip-list\">" + skip + "</ul>"
          + "</section>"
        : "")

      + "<section class=\"cg-section\" id=\"around\">"
      +   "<h2 class=\"cg-h2\">" + esc(guide.aroundTitle || "Getting around") + "</h2>"
      +   "<p class=\"cg-lede\">" + esc(guide.around) + "</p>"
      +   "<ul class=\"cg-plain\">" + around + "</ul>"
      + "</section>"

      + "<section class=\"cg-section\" id=\"budget\">"
      +   "<h2 class=\"cg-h2\">" + esc(guide.budgetTitle || "Rough budget posture") + "</h2>"
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

  function renderIndexCards(all) {
    var list = all || (global.VM_CITY_GUIDES && global.VM_CITY_GUIDES.ALL) || [];
    return list.map(function (g) {
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

  function wirePrint(root) {
    if (!root || typeof root.querySelector !== "function") return;
    var btn = root.querySelector("[data-cg-print]");
    if (!btn || btn.getAttribute("data-cg-wired") === "1") return;
    btn.setAttribute("data-cg-wired", "1");
    btn.addEventListener("click", function () {
      if (typeof gtag === "function") {
        gtag("event", "guide_print", { dest: guideId(), method: "window.print" });
      }
      global.print();
    });
  }

  function boot() {
    if (typeof document === "undefined") return;
    var id = guideId();
    var pack = global.VM_CITY_GUIDES;
    var guide = pack && pack.BY_ID && pack.BY_ID[id];
    var root = document.getElementById("city-guide-root");
    if (root) {
      var staticOk = root.querySelector("[data-cg-static], .cg-hero");
      if (!staticOk) {
        if (guide) root.innerHTML = renderGuide(guide);
        else root.innerHTML = "<p>Unknown destination. <a href=\"/guides\">See all city briefs</a>.</p>";
      }
      wirePrint(root);
      try {
        if (typeof location !== "undefined" && new URLSearchParams(location.search).get("print") === "1") {
          setTimeout(function () { global.print(); }, 250);
        }
      } catch (e) {}
    }
    var index = document.getElementById("city-briefs-grid");
    if (index && !index.querySelector(".cg-index-card")) {
      index.innerHTML = renderIndexCards();
    }
  }

  if (typeof document !== "undefined") {
    if (document.getElementById("city-guide-root") || document.getElementById("city-briefs-grid")) {
      boot();
    } else if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot);
    } else {
      boot();
    }
  }

  global.VM_CITY_GUIDE = {
    render: renderGuide,
    renderIndex: renderIndexCards,
    boot: boot,
    id: guideId
  };
})(typeof window !== "undefined" ? window : this);
