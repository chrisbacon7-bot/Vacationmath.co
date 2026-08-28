/**
 * Vacation Math — Card Finder
 * Matches users to 3 ranked cards based on:
 *   1. Spending style (where their dollars actually go)
 *   2. Perks priority (what they want the card to do)
 *   3. Annual fee tolerance
 *
 * Honest math. No aspirational redemptions. Conservative point values.
 * Every card in the catalog is scored against the user's inputs.
 * Returns the top 3 with a clear "why" for each.
 *
 * Affiliate plumbing: uses VM_cardHref / VM_cardRel when affiliate-config.js is loaded.
 */
(function (g) {
  "use strict";

  // ---------- Card profiles ----------
  // Each card scored 0-10 against each spending category and perk dimension.
  // Numbers reflect realistic earn / value, not marketing claims.
  // Build once, freeze, reuse for both the full wizard and mini widget.
  var CARD_PROFILES = {
    // ----- Premium travel -----
    csp: {
      spending: { travel: 9, dining: 8, groceries: 4, gas: 3, disney: 4, cruise: 6, allinclusive: 6, themeparks: 6, everyday: 6 },
      perks:    { transferable: 10, lounges: 0, hotelStatus: 0, brandLoyalty: 0, simpleCashback: 3, lowFee: 4, signupBonus: 9, insurance: 9 },
      feeTier:  "mid", // $95
      tagline:  "The flexible workhorse for any trip."
    },
    csr: {
      spending: { travel: 10, dining: 8, groceries: 4, gas: 3, disney: 4, cruise: 7, allinclusive: 7, themeparks: 6, everyday: 6 },
      perks:    { transferable: 10, lounges: 10, hotelStatus: 5, brandLoyalty: 0, simpleCashback: 3, lowFee: 0, signupBonus: 9, insurance: 10 },
      feeTier:  "ultra", // $795
      tagline:  "Lounges and a $300 travel credit — only if you'll use them."
    },
    venturex: {
      spending: { travel: 10, dining: 6, groceries: 5, gas: 4, disney: 5, cruise: 7, allinclusive: 7, themeparks: 6, everyday: 7 },
      perks:    { transferable: 9, lounges: 10, hotelStatus: 4, brandLoyalty: 0, simpleCashback: 4, lowFee: 1, signupBonus: 8, insurance: 8 },
      feeTier:  "premium", // $395
      tagline:  "Lounges and a $300 travel credit that pays for itself."
    },
    venture: {
      spending: { travel: 8, dining: 5, groceries: 5, gas: 5, disney: 4, cruise: 5, allinclusive: 5, themeparks: 5, everyday: 7 },
      perks:    { transferable: 8, lounges: 0, hotelStatus: 0, brandLoyalty: 0, simpleCashback: 6, lowFee: 5, signupBonus: 8, insurance: 5 },
      feeTier:  "mid",
      tagline:  "Simple flat-rate miles, low effort."
    },
    amexgold: {
      spending: { travel: 6, dining: 10, groceries: 10, gas: 2, disney: 4, cruise: 7, allinclusive: 5, themeparks: 4, everyday: 6 },
      perks:    { transferable: 10, lounges: 0, hotelStatus: 0, brandLoyalty: 0, simpleCashback: 2, lowFee: 1, signupBonus: 7, insurance: 4 },
      feeTier:  "premium", // $325
      tagline:  "Crushes dining and grocery spend."
    },
    bilt: {
      spending: { travel: 6, dining: 7, groceries: 3, gas: 3, disney: 3, cruise: 4, allinclusive: 4, themeparks: 4, everyday: 6 },
      perks:    { transferable: 9, lounges: 0, hotelStatus: 0, brandLoyalty: 0, simpleCashback: 4, lowFee: 10, signupBonus: 1, insurance: 3 },
      feeTier:  "free",
      tagline:  "Earn points on rent with zero annual fee."
    },

    // ----- Disney / Theme parks -----
    disneyInspire: {
      spending: { travel: 3, dining: 4, groceries: 5, gas: 5, disney: 10, cruise: 2, allinclusive: 2, themeparks: 6, everyday: 4 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 0, brandLoyalty: 10, simpleCashback: 3, lowFee: 4, signupBonus: 6, insurance: 2 },
      feeTier:  "low", // $149
      tagline:  "Best math for annual Disney families."
    },
    disneyVisa: {
      spending: { travel: 2, dining: 2, groceries: 2, gas: 2, disney: 7, cruise: 2, allinclusive: 1, themeparks: 4, everyday: 2 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 0, brandLoyalty: 8, simpleCashback: 3, lowFee: 10, signupBonus: 2, insurance: 1 },
      feeTier:  "free",
      tagline:  "No-fee gateway for Disney-curious families."
    },
    universalPlus: {
      spending: { travel: 2, dining: 2, groceries: 2, gas: 2, disney: 2, cruise: 1, allinclusive: 1, themeparks: 10, everyday: 2 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 0, brandLoyalty: 9, simpleCashback: 2, lowFee: 5, signupBonus: 3, insurance: 1 },
      feeTier:  "low", // $99
      tagline:  "Pays for itself if you visit Universal yearly."
    },

    // ----- Hotel co-brands -----
    hyatt: {
      spending: { travel: 5, dining: 5, groceries: 2, gas: 2, disney: 2, cruise: 3, allinclusive: 9, themeparks: 3, everyday: 3 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 9, brandLoyalty: 10, simpleCashback: 2, lowFee: 4, signupBonus: 7, insurance: 4 },
      feeTier:  "mid",
      tagline:  "Free night every year covers the fee twice over."
    },
    bonvoyBrilliant: {
      spending: { travel: 6, dining: 6, groceries: 3, gas: 2, disney: 2, cruise: 3, allinclusive: 9, themeparks: 3, everyday: 4 },
      perks:    { transferable: 0, lounges: 6, hotelStatus: 10, brandLoyalty: 10, simpleCashback: 2, lowFee: 0, signupBonus: 8, insurance: 6 },
      feeTier:  "ultra", // $650
      tagline:  "Free night + $325 in credits — Marriott loyalists only."
    },

    // ----- Cruise co-brands -----
    carnival: {
      spending: { travel: 3, dining: 2, groceries: 2, gas: 2, disney: 1, cruise: 8, allinclusive: 2, themeparks: 2, everyday: 2 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 0, brandLoyalty: 9, simpleCashback: 3, lowFee: 10, signupBonus: 3, insurance: 1 },
      feeTier:  "free",
      tagline:  "Carnival loyalists with a sailing booked."
    },
    royalCaribbeanCard: {
      spending: { travel: 3, dining: 2, groceries: 2, gas: 2, disney: 1, cruise: 8, allinclusive: 2, themeparks: 2, everyday: 2 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 0, brandLoyalty: 9, simpleCashback: 3, lowFee: 10, signupBonus: 3, insurance: 1 },
      feeTier:  "free",
      tagline:  "Royal Caribbean / Celebrity loyalists."
    },

    // ----- Everyday spend -----
    costcoCiti: {
      spending: { travel: 4, dining: 6, groceries: 4, gas: 10, disney: 2, cruise: 3, allinclusive: 2, themeparks: 3, everyday: 7 },
      perks:    { transferable: 0, lounges: 0, hotelStatus: 0, brandLoyalty: 4, simpleCashback: 9, lowFee: 10, signupBonus: 2, insurance: 2 },
      feeTier:  "free",
      tagline:  "Best gas rebate on any card — if you have Costco."
    },
    chaseFreedomUnlimited: {
      spending: { travel: 6, dining: 7, groceries: 4, gas: 4, disney: 3, cruise: 4, allinclusive: 4, themeparks: 4, everyday: 7 },
      perks:    { transferable: 6, lounges: 0, hotelStatus: 0, brandLoyalty: 0, simpleCashback: 8, lowFee: 10, signupBonus: 5, insurance: 2 },
      feeTier:  "free",
      tagline:  "Everyday booster — pair with a Sapphire to unlock transfers."
    },
    citiStrata: {
      spending: { travel: 8, dining: 8, groceries: 8, gas: 8, disney: 4, cruise: 6, allinclusive: 6, themeparks: 5, everyday: 7 },
      perks:    { transferable: 8, lounges: 0, hotelStatus: 0, brandLoyalty: 0, simpleCashback: 4, lowFee: 4, signupBonus: 7, insurance: 7 },
      feeTier:  "mid",
      tagline:  "3x on groceries, gas, and dining with transferable points."
    }
  };

  // Fee tier numeric for filtering
  var FEE_VALUES = { free: 0, low: 150, mid: 200, premium: 400, ultra: 700 };

  // User fee tolerance maps to maximum allowed tier
  var FEE_TIERS_ALLOWED = {
    none: ["free"],
    low: ["free", "low", "mid"],         // up to ~$200
    high: ["free", "low", "mid", "premium", "ultra"]  // any
  };

  // ---------- Scoring ----------
  /**
   * Inputs:
   *   spendingStyle: array of selected spending tags (e.g. ['dining', 'travel'])
   *   perks: array of selected perk tags (e.g. ['transferable', 'lounges'])
   *   feeTolerance: 'none' | 'low' | 'high'
   * Returns: array of { cardId, score, reasons[] } sorted desc.
   */
  function scoreCards(spendingStyle, perks, feeTolerance) {
    var allowedTiers = FEE_TIERS_ALLOWED[feeTolerance] || FEE_TIERS_ALLOWED.low;
    var results = [];

    Object.keys(CARD_PROFILES).forEach(function (id) {
      var profile = CARD_PROFILES[id];
      if (g.VM_CARDS && g.VM_CARDS.CARDS && g.VM_CARDS.CARDS[id] && g.VM_CARDS.CARDS[id].available === false) return;

      // Hard filter: skip cards over user's fee tolerance
      if (allowedTiers.indexOf(profile.feeTier) === -1) return;

      var spendScore = 0;
      var perkScore = 0;
      var reasons = [];

      spendingStyle.forEach(function (tag) {
        var v = profile.spending[tag] || 0;
        spendScore += v;
        if (v >= 8) reasons.push({ tag: tag, kind: 'spend', strength: 'strong' });
        else if (v >= 6) reasons.push({ tag: tag, kind: 'spend', strength: 'good' });
      });

      perks.forEach(function (tag) {
        var v = profile.perks[tag] || 0;
        perkScore += v * 1.2;
        if (v >= 8) reasons.push({ tag: tag, kind: 'perk', strength: 'strong' });
        else if (v >= 6) reasons.push({ tag: tag, kind: 'perk', strength: 'good' });
      });

      var feeBonus = 0;
      if (feeTolerance === 'low' && profile.feeTier === 'free') feeBonus = 1;
      if (feeTolerance === 'none' && profile.feeTier === 'free') feeBonus = 2;

      var total = spendScore + perkScore + feeBonus;

      results.push({
        cardId: id,
        score: total,
        spendScore: spendScore,
        perkScore: perkScore,
        reasons: reasons,
        tagline: profile.tagline
      });
    });

    results.sort(function (a, b) { return b.score - a.score; });
    return results;
  }

  var REASON_LABELS = {
    spend: {
      travel: 'travel spend',
      dining: 'dining + restaurants',
      groceries: 'groceries',
      gas: 'gas',
      disney: 'Disney purchases',
      cruise: 'cruise bookings',
      allinclusive: 'all-inclusive resort stays',
      themeparks: 'theme park purchases',
      everyday: 'everyday spend'
    },
    perk: {
      transferable: 'transferable points to airlines + hotels',
      lounges: 'airport lounge access',
      hotelStatus: 'hotel elite status',
      brandLoyalty: 'brand-specific perks',
      simpleCashback: 'simple cash back',
      lowFee: 'no annual fee',
      signupBonus: 'a strong sign-up bonus',
      insurance: 'trip insurance + travel protections'
    }
  };

  function buildWhyText(card, reasons, spendingStyle, perks) {
    var strong = reasons.filter(function (r) { return r.strength === 'strong'; });
    var good = reasons.filter(function (r) { return r.strength === 'good'; });
    var picks = strong.concat(good).slice(0, 2);
    if (picks.length === 0) return card.bestFor;

    var phrases = picks.map(function (r) {
      var label = REASON_LABELS[r.kind][r.tag] || r.tag;
      return label;
    });

    if (phrases.length === 1) return 'Strong on ' + phrases[0] + '.';
    return 'Strong on ' + phrases[0] + ' and ' + phrases[1] + '.';
  }

  function money(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function affiliateLink(card) {
    var href = (typeof g.VM_cardHref === "function")
      ? g.VM_cardHref(card)
      : ((card.affiliateUrl && card.affiliateUrl.length > 0) ? card.affiliateUrl : card.url);
    var isAff = (typeof g.VM_cardIsAffiliate === "function")
      ? g.VM_cardIsAffiliate(card, href)
      : !!(card.affiliateUrl && card.affiliateUrl.length > 0);
    var rel = (typeof g.VM_cardRel === "function")
      ? g.VM_cardRel(card, href)
      : (isAff ? 'sponsored noopener' : 'noopener');
    return {
      href: href,
      rel: rel,
      tag: isAff
        ? '<span class="cf-aff-tag">Affiliate</span>'
        : '<span class="cf-aff-tag cf-aff-tag--official">Official issuer page</span>'
    };
  }

  function renderRankedCard(result, rank, spendingStyle, perks) {
    if (!g.VM_CARDS || !g.VM_CARDS.CARDS || !g.VM_CARDS.CARDS[result.cardId]) return '';
    var card = g.VM_CARDS.CARDS[result.cardId];
    var profile = CARD_PROFILES[result.cardId];
    var why = buildWhyText(card, result.reasons, spendingStyle, perks);
    var link = affiliateLink(card);
    var feeLine = card.annualFee === 0
      ? 'No annual fee'
      : money(card.annualFee) + '/yr annual fee';

    var estimateHtml = '';
    if (typeof card.valueFn === 'function') {
      var est = Math.round(card.valueFn(5000));
      estimateHtml = '<p class="cf-card-est">Est. first-year offset on a $5,000 trip: ' + money(est) + '</p>'
        + '<p class="cf-card-fee-note">' + escapeHtml(feeLine) + '</p>';
    }
    var chaseNote = '';
    if (card.issuer === 'Chase') {
      chaseNote = '<p class="cf-card-524">Chase typically declines new cards if you\'ve opened 5+ in 24 months.</p>';
    }

    var rankLabel = ['Best match', 'Strong runner-up', 'Worth a look'][rank] || ('Pick ' + (rank + 1));
    var rankClass = ['cf-rank-1', 'cf-rank-2', 'cf-rank-3'][rank] || 'cf-rank-x';

    return ''
      + '<article class="cf-card ' + rankClass + '">'
      +   '<header class="cf-card-head">'
      +     '<span class="cf-rank-badge">' + escapeHtml(rankLabel) + '</span>'
      +     '<h3 class="cf-card-name">' + escapeHtml(card.name) + '</h3>'
      +     '<p class="cf-card-issuer">' + escapeHtml(card.issuer) + ' &middot; ' + feeLine + '</p>'
      +   '</header>'
      +   '<p class="cf-card-tagline">' + escapeHtml(profile.tagline) + '</p>'
      +   estimateHtml
      +   chaseNote
      +   '<div class="cf-why">'
      +     '<p class="cf-why-label">Why it ranked here</p>'
      +     '<p class="cf-why-text">' + escapeHtml(why) + '</p>'
      +   '</div>'
      +   '<dl class="cf-card-facts">'
      +     '<div><dt>Earn rate</dt><dd>' + escapeHtml(card.earn) + '</dd></div>'
      +     '<div><dt>Best for</dt><dd>' + escapeHtml(card.bestFor) + '</dd></div>'
      +     '<div><dt>Perks</dt><dd>' + escapeHtml(card.networkPerks) + '</dd></div>'
      +   '</dl>'
      +   '<div class="cf-card-foot">'
      +     '<a class="cf-card-cta" data-card-id="' + escapeHtml(card.id) + '" href="' + escapeHtml(link.href) + '" target="_blank" rel="' + link.rel + '">'
      +       'See the offer'
      +     '</a>'
      +     link.tag
      +   '</div>'
      + '</article>';
  }

  function renderResults(containerId, spendingStyle, perks, feeTolerance) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var ranked = scoreCards(spendingStyle, perks, feeTolerance);

    if (ranked.length === 0) {
      container.innerHTML = ''
        + '<div class="cf-empty">'
        +   '<h3>No cards match those filters.</h3>'
        +   '<p>Try loosening the annual fee tolerance — the strongest cards in most categories carry a $95-$395 fee that the credits and bonuses offset.</p>'
        + '</div>';
      return;
    }

    var top3 = ranked.slice(0, 3);
    var summaryLine = buildSummary(spendingStyle, perks, feeTolerance);

    var html = ''
      + '<div class="cf-results-head">'
      +   '<p class="cf-results-kicker">Based on your answers</p>'
      +   '<h2 class="cf-results-h2">Your three cards.</h2>'
      +   '<p class="cf-results-sub">' + escapeHtml(summaryLine) + '</p>'
      + '</div>'
      + '<div class="cf-results-grid">'
      +   top3.map(function (r, i) { return renderRankedCard(r, i, spendingStyle, perks); }).join('')
      + '</div>'
      + '<div class="cf-disclosure">'
      +   '<p><strong>How this works.</strong> We score every card in our 16-card catalog against where you actually spend and the perks you marked as priorities, then filter by your annual fee tolerance. Point values are conservative — 1¢ floor on Amex MR, real portal rates on Chase. We do not assume aspirational redemptions. Rankings ignore commission; if a link is affiliate it is labeled Affiliate and uses rel=sponsored. Card terms verified August 28, 2026. Always reconfirm offers on the issuer page before applying. <a href="/disclosures">Affiliate disclosure</a>.</p>'
      + '</div>';

    container.innerHTML = html;

    Array.prototype.forEach.call(container.querySelectorAll(".cf-card-cta"), function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("data-card-id");
        var card = (g.VM_CARDS && g.VM_CARDS.CARDS && g.VM_CARDS.CARDS[id]) || { id: id };
        if (typeof g.VM_trackCardClick === "function") g.VM_trackCardClick(card, a.getAttribute("href"));
      });
    });
  }

  function buildSummary(spendingStyle, perks, feeTolerance) {
    var spend = spendingStyle.length > 0
      ? spendingStyle.map(function (t) { return REASON_LABELS.spend[t] || t; }).join(', ')
      : 'general spend';
    var perksText = perks.length > 0
      ? perks.map(function (t) { return REASON_LABELS.perk[t] || t; }).join(', ')
      : 'no specific perks';
    var feeText = ({
      none: 'no annual fee',
      low: 'fees up to $200/yr',
      high: 'any annual fee'
    })[feeTolerance] || 'any annual fee';

    return 'Spending on ' + spend + '. Prioritizing ' + perksText + '. Comfortable with ' + feeText + '.';
  }

  g.VM_CardFinder = {
    score: scoreCards,
    render: renderResults,
    profiles: CARD_PROFILES
  };
})(window);
