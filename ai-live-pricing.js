/* =====================================================================
   AI Live Pricing — Vacation Math
   Calls Perplexity sonar-pro to surface real, current trip prices
   after a user runs a calculator.

   Usage:
     VM_AILivePricing.render({
       container,          // DOM element to inject into
       calc,               // "cruise" | "disney" | "allinclusive" | "bigtrip"
       params,             // calc-specific params (line, nights, cabin, etc.)
       estimatedTotal,     // number — the calc's output total
     });

   Architecture:
   - NOT a chatbot. Fires one focused query, returns structured trip cards.
   - Rate limited: 10 queries per session, then silently hides.
   - API key is server-side proxied in production. In this static build,
     a config file supplies the key (see /config/ai-config.js).
   - Affiliate links live in /config/affiliates.json (empty tags by default).
   ===================================================================== */
(function (global) {
  "use strict";

  // ---- Rate limiting (in-memory, session-scoped) ----
  var MAX_QUERIES = 10;
  var _queryCount = 0;

  function getQueryCount() { return _queryCount; }
  function incrementQueryCount() { _queryCount += 1; }
  function isRateLimited() { return _queryCount >= MAX_QUERIES; }

  // ---- Query builders per calc type ----
  function buildQuery(calc, params, estimatedTotal) {
    var budget = estimatedTotal ? Math.round(estimatedTotal) : null;
    var budgetStr = budget ? ("around $" + budget) : "";

    if (calc === "cruise") {
      var line = params.lineName || "any major cruise line";
      var nights = params.nights || 7;
      var cabin = params.cabinLabel || "interior or balcony";
      var port = params.port || "any US port";
      return "List 3 upcoming " + nights + "-night Caribbean cruises on " + line
        + " " + budgetStr + ". For each give: ship name, sail date, cabin type, price, and the direct booking URL from cruisedirect.com, cruisecritic.com, or the cruise line website. Numbered list only. No explanations.";
    }

    if (calc === "disney") {
      var resort = params.resortLabel || "any Disney resort";
      var nights = params.nights || 5;
      var people = params.people || 4;
      return "List 3 Disney World packages for " + people + " people, " + nights + " nights, " + budgetStr + ". "
        + "For each: dates, price, what is included, and booking URL from disneyworld.com or costcotravel.com. "
        + "Numbered list only. No explanations.";
    }

    if (calc === "allinclusive") {
      var dest = params.destinationLabel || "Cancun or Punta Cana";
      var nights = params.nights || 7;
      var people = params.people || 2;
      return "Find 3 real all-inclusive resort deals available right now "
        + budgetStr + " for " + people + " people, " + nights + " nights "
        + "in " + dest + ". For each: resort name, travel dates, total price "
        + "including flights or land-only, what's included, star rating, "
        + "and booking URL from expedia.com, booking.com, applevacations.com, "
        + "or costcotravel.com. Only 2026 travel dates.";
    }

    if (calc === "bigtrip") {
      var dest = params.destinationLabel || "Europe";
      var nights = params.nights || 10;
      var people = params.people || 2;
      return "Find 2-3 real flight + hotel packages or flight deals right now "
        + budgetStr + " for " + people + " people, " + nights + " nights "
        + "in " + dest + ". Include: airline or package provider, travel dates, "
        + "total price, what's included, and direct booking URL from "
        + "google.com/flights, expedia.com, kayak.com, or costcotravel.com. "
        + "Only 2026 travel dates, currently bookable.";
    }

    return null;
  }

  // ---- Parse Perplexity response into structured trip cards ----
  function parseResponse(text, calc) {
    // Extract structured data from the markdown-ish Perplexity response.
    // Strategy: split on numbered items or double newlines, extract price + URL.
    var cards = [];
    var lines = text.split(/\n+/);
    var current = null;

    lines.forEach(function(line) {
      line = line.trim();
      if (!line) return;

      // New item: starts with number, bullet, or bold header
      var isNew = /^(\d+[\.\)]\s|[-*•]\s|\*\*[^*]+\*\*\s*[-:])/.test(line);
      if (isNew) {
        if (current && current.title) cards.push(current);
        current = { title: "", price: "", detail: "", url: "", raw: "" };
      }
      if (!current) current = { title: "", price: "", detail: "", url: "", raw: "" };

      current.raw += " " + line;

      // Extract title (bold or first significant phrase)
      if (!current.title) {
        var boldMatch = line.match(/\*\*([^*]+)\*\*/);
        if (boldMatch) current.title = boldMatch[1].replace(/^[-:\s]+/, "").trim();
        else if (isNew) current.title = line.replace(/^[\d\.\)\-*•\s]+/, "").replace(/\*\*/g, "").trim().split(/[–:,]/)[0].trim();
      }

      // Extract price
      if (!current.price) {
        var priceMatch = line.match(/\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?(?:\s*(?:per person|pp|total|\/person))?/i);
        if (priceMatch) current.price = priceMatch[0];
      }

      // Extract URL
      if (!current.url) {
        var urlMatch = line.match(/https?:\/\/[^\s\)\]"'>]+/);
        if (urlMatch) current.url = urlMatch[0].replace(/[.,;]+$/, "");
      }

      // Accumulate detail lines
      if (!isNew && line.length > 10 && !/^https?/.test(line)) {
        var clean = line.replace(/\*\*/g, "").replace(/^[-*•:]+\s*/, "");
        if (clean.length > 10) current.detail += (current.detail ? " " : "") + clean;
      }
    });

    if (current && current.title) cards.push(current);

    // Clean up and limit to 3
    return cards.slice(0, 3).map(function(c) {
      return {
        title: c.title.slice(0, 80),
        price: c.price || "",
        detail: c.detail.slice(0, 200).trim(),
        url: c.url || ""
      };
    }).filter(function(c) { return c.title.length > 3; });
  }

  // ---- Call Perplexity API ----
  function callAPI(query, apiKey, onSuccess, onError) {
    fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: "You are a travel pricing data tool. Your ONLY job is to list real, bookable trips with prices and URLs. Do NOT explain limitations. Do NOT say what you cannot do. If you cannot find exact results, find the closest alternative and list it. Always return a numbered list of 3 trips in this exact format: 1. [Trip name] — [price] — [URL]. Never return explanations, apologies, or caveats."
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 600,
        temperature: 0.1,
        search_recency_filter: "month"
      })
    })
    .then(function(res) {
      if (!res.ok) throw new Error("API " + res.status);
      return res.json();
    })
    .then(function(data) {
      var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      if (!content) throw new Error("Empty response");
      onSuccess(content, data.citations || []);
    })
    .catch(function(err) {
      onError(err);
    });
  }

  // ---- Render UI states ----
  function renderButton(container, calc, params, estimatedTotal, apiKey) {
    var labels = {
      cruise:      "See real cruises matching this estimate",
      disney:      "See real Disney packages matching this estimate",
      allinclusive: "See real all-inclusive deals matching this estimate",
      bigtrip:     "See real packages for this trip"
    };
    var label = labels[calc] || "Find real trips matching this estimate";

    var wrapper = document.createElement("div");
    wrapper.className = "ai-pricing-wrap";
    wrapper.innerHTML = ''
      + '<p class="kicker" style="margin:0 0 12px;color:var(--honey);">Live pricing</p>'
      + '<div class="ai-pricing-trigger">'
      +   '<button class="ai-pricing-btn" id="ai-pricing-btn">'
      +     '<span class="ai-btn-icon">'
      +       '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>'
      +     '</span>'
      +     label
      +   '</button>'
      +   '<p class="ai-pricing-note">Searches for real, current trips matching your estimate. Results may differ from our calculator averages.</p>'
      + '</div>'
      + '<div class="ai-pricing-results" id="ai-pricing-results" hidden></div>';

    container.appendChild(wrapper);

    document.getElementById("ai-pricing-btn").addEventListener("click", function() {
      if (isRateLimited()) {
        renderError(document.getElementById("ai-pricing-results"), "Search limit reached for this session. Refresh the page to continue.");
        document.getElementById("ai-pricing-results").hidden = false;
        return;
      }
      var query = buildQuery(calc, params, estimatedTotal);
      if (!query) return;
      renderLoading(document.getElementById("ai-pricing-results"));
      document.getElementById("ai-pricing-results").hidden = false;
      this.disabled = true;
      this.textContent = "Searching live prices…";
      incrementQueryCount();

      callAPI(query, apiKey,
        function(content, citations) {
          var cards = parseResponse(content, calc);
          if (cards.length === 0) {
            renderError(document.getElementById("ai-pricing-results"), "No results found for this search. Try adjusting your calculator inputs.");
          } else {
            renderCards(document.getElementById("ai-pricing-results"), cards, content, citations, calc, estimatedTotal);
          }
        },
        function(err) {
          renderError(document.getElementById("ai-pricing-results"), "Live search unavailable right now. Use the booking links below.");
        }
      );
    });
  }

  function renderLoading(el) {
    el.innerHTML = ''
      + '<div class="ai-loading">'
      +   '<div class="ai-loading-dots"><span></span><span></span><span></span></div>'
      +   '<p>Searching live prices…</p>'
      + '</div>';
  }

  function renderCards(el, cards, rawContent, citations, calc, estimatedTotal) {
    var calcLabels = {
      cruise: "cruise",
      disney: "Disney package",
      allinclusive: "all-inclusive deal",
      bigtrip: "trip"
    };
    var noun = calcLabels[calc] || "trip";

    var html = '<div class="ai-results-head">'
      + '<p class="kicker">Live results</p>'
      + '<h3>Real ' + noun + 's near your estimate</h3>'
      + '<p class="ai-results-sub">Found via live search. Prices change daily — click through to verify before booking.</p>'
      + '</div>'
      + '<div class="ai-cards">';

    cards.forEach(function(card) {
      html += '<div class="ai-card">'
        + '<div class="ai-card-body">'
        + '<p class="ai-card-title">' + escapeHtml(card.title) + '</p>';
      if (card.price) html += '<p class="ai-card-price">' + escapeHtml(card.price) + '</p>';
      if (card.detail) html += '<p class="ai-card-detail">' + escapeHtml(card.detail) + '</p>';
      html += '</div>';
      if (card.url) {
        html += '<a class="ai-card-cta" href="' + escapeHtml(card.url) + '" target="_blank" rel="noopener nofollow">'
          + 'Book this &rarr;'
          + '</a>';
      }
      html += '</div>';
    });

    html += '</div>';

    // Show raw content in a collapsed "Full search results" section
    html += '<details class="ai-raw-toggle">'
      + '<summary>Full search results</summary>'
      + '<div class="ai-raw-content">' + escapeHtml(rawContent).replace(/\n/g, '<br>') + '</div>'
      + '</details>';

    html += '<p class="ai-disclosure">Results generated by Perplexity AI via live web search. Vacation Math does not guarantee availability or accuracy. Always verify on the booking site before purchasing.</p>';

    el.innerHTML = html;
  }

  function renderError(el, msg) {
    el.innerHTML = '<div class="ai-error"><p>' + escapeHtml(msg) + '</p></div>';
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>\"']/g, function(c) {
      return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c];
    });
  }

  // ---- Public API ----
  function render(opts) {
    opts = opts || {};
    var container = opts.container;
    var calc = opts.calc;
    var params = opts.params || {};
    var estimatedTotal = opts.estimatedTotal || 0;

    if (!container || !calc) return;

    // Get API key from config
    var apiKey = (typeof VM_AI_CONFIG !== "undefined" && VM_AI_CONFIG.perplexityKey) || "";
    if (!apiKey) {
      // Silently skip — don't show broken UI if no key configured
      return;
    }

    renderButton(container, calc, params, estimatedTotal, apiKey);
  }

  global.VM_AILivePricing = { render: render };
})(this);
