/**
 * Vacation Math — Card module renderer
 * Renders 2-3 trip-matched card recommendations under each calculator's price breakdown.
 * Math is conservative and verifiable. Affiliate plumbing is forward-compatible.
 *
 * Usage:
 *   VM_CardModule.render(containerId, calcType, tripCost, opts)
 *   - containerId: "card-cta"
 *   - calcType: "disney" | "cruise" | "allinclusive" | etc.
 *   - tripCost: total trip cost in dollars (number)
 *   - opts: optional { gasCost, foodCost, ... } for cards that need line-item context
 */
(function (g) {
  "use strict";

  function money(n) {
    if (n < 0) return "-$" + Math.abs(Math.round(n)).toLocaleString("en-US");
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function affiliateLink(card) {
    var href = card.affiliateUrl && card.affiliateUrl.length > 0 ? card.affiliateUrl : card.url;
    var isAffiliate = card.affiliateUrl && card.affiliateUrl.length > 0;
    var rel = isAffiliate ? "sponsored noopener" : "noopener";
    var tag = isAffiliate
      ? '<span class="card-aff-tag" title="Affiliate link \u2014 we may earn a referral if you apply">Affiliate</span>'
      : '<span class="card-aff-tag card-aff-tag--official">Official issuer page</span>';
    return {
      href: href,
      rel: rel,
      target: "_blank",
      tagHtml: tag
    };
  }

  function renderCard(card, tripCost, opts, rank) {
    var offset = card.valueFn(tripCost, opts || {});
    // Cap offset at the trip cost — we never claim the card pays you MORE than the trip.
    var cappedOffset = Math.max(0, Math.min(offset, tripCost));
    var netCost = Math.max(0, tripCost - cappedOffset);
    var pctSaved = tripCost > 0 ? Math.round((cappedOffset / tripCost) * 100) : 0;

    var link = affiliateLink(card);
    var bonusLine = "";
    var bonusSpendMonths = null;
    if (card.bonus && card.bonus.dollarValue) {
      bonusLine = "Sign-up: "
        + (card.bonus.points ? card.bonus.points.toLocaleString() + " points = ~" + money(card.bonus.dollarValue) : money(card.bonus.dollarValue))
        + (card.bonus.spend ? " after " + money(card.bonus.spend) + " in " + card.bonus.months + " mo" : "");
      if (card.bonus.spend && card.bonus.months) {
        bonusSpendMonths = { spend: card.bonus.spend, months: card.bonus.months, value: card.bonus.dollarValue };
      }
    } else {
      bonusLine = "No sign-up bonus";
    }

    var feeLine = card.annualFee === 0
      ? '<span class="card-fee card-fee--free">No annual fee</span>'
      : '<span class="card-fee">$' + card.annualFee + ' annual fee</span>';

    var rankBadge = rank === 0
      ? '<span class="card-rank card-rank--best">Best fit</span>'
      : rank === 1
        ? '<span class="card-rank">Strong alt</span>'
        : '<span class="card-rank">Worth considering</span>';

    // Honest urgency line — only show when the trip cost is enough to plausibly
    // hit the sign-up bonus in the bonus window. We won't overstate.
    var urgencyLine = '';
    if (bonusSpendMonths && tripCost >= bonusSpendMonths.spend * 0.6) {
      urgencyLine = ''
        + '<p class="card-rec__urgency">'
        + '<span class="card-rec__urgency-dot" aria-hidden="true"></span>'
        + 'Your trip alone gets you '
        + (tripCost >= bonusSpendMonths.spend
            ? 'past the ' + money(bonusSpendMonths.spend) + ' bonus minimum'
            : Math.round((tripCost / bonusSpendMonths.spend) * 100) + '% of the way to the ' + money(bonusSpendMonths.spend) + ' bonus minimum')
        + '. Card must be open before booking to count.'
        + '</p>';
    } else if (card.annualFee === 0 && offset >= 50) {
      urgencyLine = ''
        + '<p class="card-rec__urgency">'
        + '<span class="card-rec__urgency-dot" aria-hidden="true"></span>'
        + 'No fee, no annual catch \u2014 the offset is yours to keep.'
        + '</p>';
    }

    // Honest cost comparison: only show the trip-cost lockup when we have a real offset.
    var savingsBlock = '';
    if (cappedOffset > 0) {
      savingsBlock = ''
        + '<div class="card-rec__savings">'
        + '  <div class="card-rec__savings-row">'
        + '    <span class="card-rec__savings-label">Trip cost</span>'
        + '    <span class="card-rec__savings-strike">' + money(tripCost) + '</span>'
        + '  </div>'
        + '  <div class="card-rec__savings-row card-rec__savings-row--net">'
        + '    <span class="card-rec__savings-label">With this card</span>'
        + '    <span class="card-rec__savings-net">' + money(netCost) + '</span>'
        + '  </div>'
        + '  <div class="card-rec__savings-callout">'
        + '    <span class="card-rec__savings-callout-label">You keep</span>'
        + '    <span class="card-rec__savings-callout-value">' + money(cappedOffset) + '</span>'
        + '    <span class="card-rec__savings-callout-pct">' + pctSaved + '% back</span>'
        + '  </div>'
        + (urgencyLine || '')
        + '</div>';
    } else {
      // Edge case: card doesn't materially offset this trip (e.g. low-fee card on a small trip)
      savingsBlock = ''
        + '<div class="card-rec__savings card-rec__savings--minimal">'
        + '  <p class="card-rec__savings-minimal-text">No meaningful offset on a trip this size. Better suited to ongoing spend than this single booking.</p>'
        + '</div>';
    }

    return ''
      + '<article class="card-rec" data-card-id="' + escapeHtml(card.id) + '">'
      + '  <header class="card-rec__head">'
      +      rankBadge
      + '    <h4 class="card-rec__name">' + escapeHtml(card.name) + '</h4>'
      + '    <p class="card-rec__issuer">' + escapeHtml(card.issuer) + ' &middot; ' + feeLine + '</p>'
      + '  </header>'
      +    savingsBlock
      + '  <dl class="card-rec__details">'
      + '    <dt>Sign-up</dt><dd>' + escapeHtml(bonusLine) + '</dd>'
      + '    <dt>Earn</dt><dd>' + escapeHtml(card.earn) + '</dd>'
      + '    <dt>Best for</dt><dd>' + escapeHtml(card.bestFor) + '</dd>'
      + '    <dt>Perks</dt><dd>' + escapeHtml(card.networkPerks) + '</dd>'
      + '  </dl>'
      + '  <a class="card-rec__cta" href="' + escapeHtml(link.href) + '" target="' + link.target + '" rel="' + link.rel + '">View official offer &rarr;</a>'
      + '  ' + link.tagHtml
      + '</article>';
  }

  function render(containerId, calcType, tripCost, opts) {
    var container = document.getElementById(containerId);
    if (!container || !window.VM_CARDS) return;

    var lineup = VM_CARDS.LINEUPS[calcType];
    if (!lineup) return;

    var framing = VM_CARDS.FRAMING[calcType] || "";

    // Compute offset for each card on THIS trip and sort by best fit.
    // This way the "best fit" badge actually reflects the math, not a hardcoded order.
    var ranked = lineup
      .map(function (id) { return VM_CARDS.CARDS[id]; })
      .filter(function (c) { return !!c; })
      .map(function (c) { return { card: c, offset: c.valueFn(tripCost, opts || {}) }; })
      .sort(function (a, b) { return b.offset - a.offset; });

    var cardsHtml = ranked.map(function (entry, idx) {
      return renderCard(entry.card, tripCost, opts, idx);
    }).join("");

    var bonusDisclosure = '<p class="card-module__bonus-note">'
      + 'The bonus dollar value assumes you\'re approved and meet the minimum spend within the bonus window. '
      + 'Subject to each issuer\'s eligibility rules (Chase 5/24, Amex once-per-lifetime, Capital One inquiry limits).'
      + '</p>';

    container.innerHTML = ''
      + '<div class="card-module">'
      + '  <header class="card-module__header">'
      + '    <p class="card-module__eyebrow">Cards built for this trip</p>'
      + '    <h3 class="card-module__title">The smartest plastic for what you just calculated</h3>'
      + '    <p class="card-module__framing">' + escapeHtml(framing) + '</p>'
      + '  </header>'
      + '  <div class="card-module__grid">' + cardsHtml + '</div>'
      + '  <footer class="card-module__footer">'
      + '    <p class="card-module__disclosure">'
      + '      Offers verified ' + (window.VM_CONFIG && VM_CONFIG.VERIFIED_LABEL ? escapeHtml(VM_CONFIG.VERIFIED_LABEL.replace(/^Pricing verified /, "")) : "May 2026")
      + '      against each issuer\'s official site. Bonuses change weekly \u2014 confirm at the issuer\'s page before applying. '
      + '      We don\'t accept payment to recommend a card. When we activate affiliate partnerships, links will be tagged "Affiliate" \u2014 the recommendations won\'t change.'
      + '    </p>'
      +    bonusDisclosure
      + '    <p class="card-module__methodology">'
      + '      <strong>How "you keep" is calculated:</strong> sign-up bonus at conservative portal redemption rates, plus category earn on this trip\'s spend, minus the first-year annual fee. Capped at the trip cost \u2014 we never claim a card pays you more than you spent. The bonus only counts if the card is open before you book and you actually meet the minimum spend in the bonus window.'
      + '    </p>'
      + '  </footer>'
      + '</div>';
  }

  // Timeshare variant: no card pitch — instead a "read before you buy" callout
  function renderTimeshareCallout(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''
      + '<div class="card-module card-module--timeshare">'
      + '  <header class="card-module__header">'
      + '    <p class="card-module__eyebrow">Before you sign</p>'
      + '    <h3 class="card-module__title">A credit card won\'t fix timeshare math.</h3>'
      + '    <p class="card-module__framing">If the numbers above didn\'t clear, no points stack will rescue them. Read these three things first.</p>'
      + '  </header>'
      + '  <ul class="card-module__readlist">'
      + '    <li><strong>Resale exists.</strong> Most major brands trade on the secondary market for 10-30% of developer price. Same vacation, same week, fraction of the cost.</li>'
      + '    <li><strong>Maintenance fees compound.</strong> Year-1 fees average ~$1,480 (ARDA 2025) and rise 4-7% annually. Model 10 years out, not year one.</li>'
      + '    <li><strong>Resort fees, special assessments, exchange fees.</strong> These rarely show up in the sales presentation. They\'re what people forget to add.</li>'
      + '  </ul>'
      + '  <footer class="card-module__footer">'
      + '    <p class="card-module__disclosure">We don\'t take payment from timeshare developers, resale brokers, or exit companies. The math above is the only recommendation.</p>'
      + '  </footer>'
      + '</div>';
  }

  g.VM_CardModule = { render: render, renderTimeshareCallout: renderTimeshareCallout };
})(window);
