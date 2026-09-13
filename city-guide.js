/* =====================================================================
   Vacation Math — money guide renderer
   Builds printable HTML from VM_CITY_GUIDES + VM_PLAN_DATA.
   Works in the browser and in Node (scripts/build-city-guides.js).
   If the page already has static .cg-hero content, JS only wires print.
   ===================================================================== */
(function (global) {
  "use strict";

  var POINTS_BRAND_RE = /\b(marriott|hilton|hyatt|ihg|sheraton|westin|ritz-carlton|st\.?\s*regis|kimpton|aloft|moxy|hampton|embassy|holiday inn|intercontinental|waldorf|fairmont|conrad|andaz|park hyatt|grand hyatt|jw marriott|courtyard|autograph|springhill|fairfield|residence inn|homewood|motto|canopy|renaissance|delta hotels|ac hotel|element |bonvoy|world of hyatt|hilton honors|ibis|novotel|premier inn)\b/i;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function plainVoice(s) {
    var t = String(s == null ? "" : s);
    t = t.replace(/\bleftover-only\b/gi, "Splurge only");
    t = t.replace(/\bleftover only\b/gi, "Splurge only");
    t = t.replace(/\bif leftover is real\b/gi, "if you already priced it");
    t = t.replace(/\bif leftover covers it\b/gi, "if you already priced it");
    t = t.replace(/\bif leftover covers\b/gi, "if you already priced");
    t = t.replace(/\bif leftover\b/gi, "if the budget still has room");
    t = t.replace(/\bas leftover\b/gi, "as Splurge");
    t = t.replace(/,\s*leftover\b/gi, "");
    t = t.replace(/\bleftover\b(?!s)/gi, "Splurge");
    t = t.replace(/\bpocket\b/gi, "neighborhood");
    t = t.replace(/\bbasin\b/gi, "city");
    t = t.replace(/\s{2,}/g, " ").replace(/\s+([,.;])/g, "$1").trim();
    return t;
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
    var s = plainVoice(String(item || "").trim());
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

  function looksLikePick(item) {
    var nw = splitNameWhy(item);
    var n = nw.name;
    if (!n) return false;
    if (/^(Do not|Stay in|Skip |This lodging|One property|One base|One flagship|One neighborhood|The trip is|Independence timed|Check |April and|A second )/i.test(n)) return false;
    if (/is mid;|is Splurge;|Budget stays /i.test(item)) return false;
    return true;
  }

  function isPointsBrand(name) {
    return POINTS_BRAND_RE.test(name || "");
  }

  function pickStayItems(items, limit) {
    var list = (items || []).filter(looksLikePick);
    var brands = [];
    var local = [];
    list.forEach(function (item) {
      if (isPointsBrand(splitNameWhy(item).name)) brands.push(item);
      else local.push(item);
    });
    var max = limit || 4;
    var out = brands.slice(0, local.length ? max - 1 : max);
    if (local.length) out.push(local[0]);
    return out.slice(0, max);
  }

  function nameWhyList(items, limit, opts) {
    opts = opts || {};
    var list = opts.points
      ? pickStayItems(items, limit || 4)
      : (items || []).filter(looksLikePick).slice(0, limit || 4);
    if (!list.length) return "";
    return "<ul class=\"cg-namewhy\">" + list.map(function (item) {
      var nw = splitNameWhy(item);
      var points = opts.points && isPointsBrand(nw.name)
        ? " <em class=\"cg-points\">points-friendly</em>"
        : "";
      if (!nw.why) return "<li><strong>" + esc(nw.name) + "</strong>" + points + "</li>";
      return "<li><strong>" + esc(nw.name) + "</strong>" + points + " <span>" + esc(nw.why) + "</span></li>";
    }).join("") + "</ul>";
  }

  function bulletList(items, cls) {
    var list = (items || []).map(function (b) {
      return "<li>" + esc(plainVoice(b)) + "</li>";
    }).join("");
    return list ? "<ul class=\"" + (cls || "cg-plain") + "\">" + list + "</ul>" : "";
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
    var safe = esc(plainVoice(text));
    return safe
      .replace(/drink-package break-even/gi, "<a href=\"/blog/cruise-drink-package-break-even-2026\">drink-package break-even</a>")
      .replace(/hard-budget plan/gi, "<a href=\"/plan\">hard-budget plan</a>");
  }

  function tierBlock(label, html) {
    if (!html) return "";
    return ""
      + "<div class=\"cg-tier\">"
      +   "<p class=\"cg-tier-label\">" + esc(label) + "</p>"
      +   html
      + "</div>";
  }

  function staySection(guide, planHref) {
    var id = guide.id;
    var budget = hotelBand(id, "budget");
    var mid = hotelBand(id, "mid");
    var lux = hotelBand(id, "lux");
    return ""
      + "<section class=\"cg-section\" id=\"stay\">"
      +   "<h2 class=\"cg-h2\">Where to stay</h2>"
      +   "<p class=\"cg-rule\">" + esc(plainVoice(guide.stayRule)) + "</p>"
      +   tierBlock("Budget", nameWhyList(budget.picks, 4, { points: true }))
      +   tierBlock("Mid-range", nameWhyList(mid.picks, 4, { points: true }))
      +   tierBlock("Splurge", nameWhyList(lux.picks, 4, { points: true }))
      +   "<p class=\"cg-align\">Same names on <a href=\"" + planHref + "\">Trip Plan</a> — examples, not live inventory and not a ranking.</p>"
      + "</section>";
  }

  function eatSection(guide) {
    var food = foodSrc(guide.id);
    var body = "";
    if (food) {
      body += tierBlock("Budget", nameWhyList(food.budget, 4));
      body += tierBlock("Mid-range", nameWhyList(food.mid, 4));
      body += tierBlock("Splurge", nameWhyList(food.lux, 4));
    }
    return ""
      + "<section class=\"cg-section\" id=\"eat\">"
      +   "<h2 class=\"cg-h2\">Where to eat</h2>"
      +   "<p class=\"cg-rule\">" + esc(plainVoice(guide.eatRule)) + "</p>"
      +   body
      + "</section>";
  }

  function doSection(guide) {
    var acts = actSrc(guide.id);
    var body = "";
    if (acts) {
      var budget = splitActs(acts.budget || []);
      var mid = splitActs(acts.mid || []);
      var free = budget.free.length ? budget.free : mid.free;
      var paid = mid.ticketed.length ? mid.ticketed : (acts.mid || []);
      if (free.length) {
        body += "<div class=\"cg-do-col\"><p class=\"cg-subhead\">Free / cheap</p>" + nameWhyList(free, 4) + "</div>";
      }
      if (paid.length) {
        body += "<div class=\"cg-do-col\"><p class=\"cg-subhead\">Paid — pick one</p>" + nameWhyList(paid, 3) + "</div>";
      }
    }
    return ""
      + "<section class=\"cg-section\" id=\"do\">"
      +   "<h2 class=\"cg-h2\">Things to do</h2>"
      +   (guide.doRule ? "<p class=\"cg-rule\">" + esc(plainVoice(guide.doRule)) + "</p>" : "")
      +   "<div class=\"cg-do-split\">" + body + "</div>"
      + "</section>";
  }

  function factsBox(guide) {
    var car = String(guide.car || "maybe").toLowerCase();
    var carLabel = car === "yes" ? "Yes" : car === "no" ? "No" : "Maybe";
    return ""
      + "<aside class=\"cg-facts\" id=\"facts\">"
      +   "<p class=\"cg-facts-kicker\">Quick facts</p>"
      +   "<dl class=\"cg-facts-grid\">"
      +     "<div><dt>Nights that fit</dt><dd>" + esc(guide.nights) + "</dd></div>"
      +     "<div><dt>Mid-range posture</dt><dd>" + esc(plainVoice(guide.midrange)) + "</dd></div>"
      +     "<div><dt>Best months</dt><dd>" + esc(guide.months) + "</dd></div>"
      +     "<div><dt>Need a car?</dt><dd>" + esc(carLabel) + "</dd></div>"
      +   "</dl>"
      + "</aside>";
  }

  function whoSection(guide) {
    var forWho = (guide.forWho || []).map(function (b) {
      return "<li>" + esc(plainVoice(b)) + "</li>";
    }).join("");
    var notFor = (guide.notFor || []).map(function (b) {
      return "<li>" + esc(plainVoice(b)) + "</li>";
    }).join("");
    return ""
      + "<section class=\"cg-section\" id=\"who\">"
      +   "<h2 class=\"cg-h2\">Who this is for</h2>"
      +   "<div class=\"cg-who\">"
      +     "<div><p class=\"cg-subhead\">For</p><ul class=\"cg-plain\">" + forWho + "</ul></div>"
      +     "<div><p class=\"cg-subhead\">Not for</p><ul class=\"cg-plain\">" + notFor + "</ul></div>"
      +   "</div>"
      + "</section>";
  }

  function aroundSection(guide) {
    var kind = guide.aroundKind || "fork";
    var transitLead = kind === "transit"
      ? "<p class=\"cg-around-callout\">You usually don’t need a car.</p>"
      : "";
    var noCar = "";
    var withCar = "";
    if (kind === "transit") {
      noCar = "<div class=\"cg-fork-col\"><p class=\"cg-subhead\">Transit-first</p>" + bulletList(guide.aroundNoCar) + "</div>";
    } else if (kind === "ship") {
      noCar = "<div class=\"cg-fork-col\"><p class=\"cg-subhead\">No rental</p>" + bulletList(guide.aroundNoCar) + "</div>";
    } else {
      noCar = "<div class=\"cg-fork-col\"><p class=\"cg-subhead\">No rental</p>" + bulletList(guide.aroundNoCar) + "</div>";
      withCar = "<div class=\"cg-fork-col\"><p class=\"cg-subhead\">With a rental</p>" + bulletList(guide.aroundCar) + "</div>";
    }
    return ""
      + "<section class=\"cg-section\" id=\"around\">"
      +   "<h2 class=\"cg-h2\">Getting around</h2>"
      +   "<p class=\"cg-rule\">" + esc(plainVoice(guide.aroundRule)) + "</p>"
      +   transitLead
      +   "<div class=\"cg-fork\">" + noCar + withCar + "</div>"
      + "</section>";
  }

  function daysSection(guide) {
    var days = (guide.days || []).map(function (d, i) {
      var bullets = (d.bullets || []).map(function (b) {
        return "<li>" + esc(plainVoice(b)) + "</li>";
      }).join("");
      return ""
        + "<article class=\"cg-day\">"
        +   "<p class=\"cg-day-kicker\">Day " + (d.n || (i + 1)) + "</p>"
        +   "<h3>" + esc(plainVoice(d.title)) + "</h3>"
        +   "<ul class=\"cg-plain\">" + bullets + "</ul>"
        + "</article>";
    }).join("");
    return ""
      + "<section class=\"cg-section\" id=\"days\">"
      +   "<h2 class=\"cg-h2\">3-day skeleton</h2>"
      +   "<div class=\"cg-days\">" + days + "</div>"
      + "</section>";
  }

  function bookSection(guide) {
    return ""
      + "<section class=\"cg-section\" id=\"book\">"
      +   "<h2 class=\"cg-h2\">Book before you go</h2>"
      +   bulletList(guide.book, "cg-check")
      + "</section>";
  }

  function hiddenSection(guide) {
    return ""
      + "<section class=\"cg-section\" id=\"hidden\">"
      +   "<h2 class=\"cg-h2\">Hidden costs</h2>"
      +   bulletList(guide.hidden)
      + "</section>";
  }

  function skipSection(guide) {
    var skip = (guide.skip || []).map(function (s) {
      if (typeof s === "string") return "<li>" + esc(plainVoice(s)) + "</li>";
      return "<li><strong>" + esc(plainVoice(s.name)) + "</strong> — " + esc(plainVoice(s.why)) + "</li>";
    }).join("");
    return ""
      + "<section class=\"cg-section cg-skip\" id=\"skip\">"
      +   "<h2 class=\"cg-h2\">Skip this</h2>"
      +   "<ul class=\"cg-skip-list\">" + skip + "</ul>"
      + "</section>";
  }

  function renderGuide(guide) {
    var id = guide.id;
    var planHref = "/plan?dest=" + encodeURIComponent(id);
    var updated = guide.updated || "Checked Sep 2026";

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
      +   "<p class=\"cg-print-bar-note\">Printable money guide. In the dialog, choose <strong>Save as PDF</strong>.</p>"
      +   "<button type=\"button\" class=\"cg-print-btn\" data-cg-print>"
      +     "<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" aria-hidden=\"true\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"/></svg>"
      +     "Download / Print money guide"
      +   "</button>"
      + "</div>"

      + "<header class=\"cg-hero\" data-cg-static=\"1\">"
      +   "<p class=\"cg-kicker\">Money guide · " + esc(guide.place) + "</p>"
      +   "<h1 class=\"cg-h1\">" + esc(guide.label) + "</h1>"
      +   "<p class=\"cg-hook\">" + esc(plainVoice(guide.hook)) + "</p>"
      +   "<p class=\"cg-crumb\"><a href=\"/guides\">All money guides</a> · <a href=\"" + planHref + "\">Build a Trip Plan</a></p>"
      + "</header>"

      + factsBox(guide)
      + whoSection(guide)
      + aroundSection(guide)
      + staySection(guide, planHref)
      + eatSection(guide)
      + doSection(guide)
      + daysSection(guide)
      + bookSection(guide)
      + hiddenSection(guide)
      + skipSection(guide)

      + "<section class=\"cg-tips\" id=\"money-saving-tips\">"
      +   "<p class=\"cg-tips-kicker\">Keep the number honest</p>"
      +   "<h2>Top money-saving tips</h2>"
      +   "<ol>" + tips + "</ol>"
      + "</section>"

      + "<section class=\"cg-cta\" id=\"plan-cta\">"
      +   "<h2>Next step</h2>"
      +   "<p>Same hotel, food, and activity names — constrained to a number you can actually spend.</p>"
      +   "<div class=\"cg-cta-row\">"
      +     "<a class=\"cg-btn cg-btn-primary\" href=\"" + planHref + "\">Trip Plan for " + esc(guide.short || guide.label) + " &rarr;</a>"
      +     "<button type=\"button\" class=\"cg-print-btn cg-no-print\" data-cg-print>Download / Print money guide</button>"
      +     "<a class=\"cg-btn cg-btn-ghost cg-no-print\" href=\"/guides\">All money guides</a>"
      +   "</div>"
      +   (related ? "<ul class=\"cg-related cg-no-print\">" + related + "</ul>" : "")
      +   "<form class=\"capture cg-no-print\" data-source=\"city-guide-" + esc(id) + "\" novalidate>"
      +     "<label class=\"sr-only\" for=\"" + emailId + "\">Email address</label>"
      +     "<input id=\"" + emailId + "\" name=\"email\" type=\"email\" inputmode=\"email\" autocomplete=\"email\" placeholder=\"your@email.com\" required />"
      +     "<button type=\"submit\" class=\"cg-print-btn\" style=\"margin-top:10px;\">Get the Tuesday brief</button>"
      +     "<p class=\"trust\" style=\"font-size:0.85rem;color:var(--muted);margin:8px 0 0;\">We won’t sell your email. Ever.</p>"
      +     "<p class=\"form-msg\" aria-live=\"polite\"></p>"
      +   "</form>"
      + "</section>"

      + "<p class=\"cg-updated\">" + esc(updated) + "</p>"

      + "<nav class=\"cg-more cg-no-print\" aria-label=\"Other money guides\">"
      +   "<h2>Other money guides</h2>"
      +   "<div class=\"cg-more-grid\">" + more + "</div>"
      + "</nav>"

      + "<p class=\"cg-fine\">Vacation Math money guide · estimates, not live quotes · "
      + esc(guide.label) + " · vacationmath.co/guides/" + esc(id) + "</p>";
  }

  function renderIndexCards(all) {
    var list = all || (global.VM_CITY_GUIDES && global.VM_CITY_GUIDES.ALL) || [];
    return list.map(function (g) {
      return ""
        + "<article class=\"cg-index-card\">"
        +   "<p class=\"cg-index-kicker\">" + esc(g.place) + "</p>"
        +   "<h3>" + esc(g.label) + "</h3>"
        +   "<p>" + esc(plainVoice(g.blurb)) + "</p>"
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
    var btns = root.querySelectorAll("[data-cg-print]");
    if (!btns.length) return;
    Array.prototype.forEach.call(btns, function (btn) {
      if (btn.getAttribute("data-cg-wired") === "1") return;
      btn.setAttribute("data-cg-wired", "1");
      btn.addEventListener("click", function () {
        if (typeof gtag === "function") {
          gtag("event", "guide_print", { dest: guideId(), method: "window.print" });
        }
        global.print();
      });
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
        else root.innerHTML = "<p>Unknown destination. <a href=\"/guides\">See all money guides</a>.</p>";
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
    id: guideId,
    plainVoice: plainVoice
  };
})(typeof window !== "undefined" ? window : this);
