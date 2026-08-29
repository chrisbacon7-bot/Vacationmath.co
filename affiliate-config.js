/**
 * Vacation Math — Affiliate / apply-link resolver
 * Verified card terms: August 28, 2026. Re-verify quarterly.
 *
 * HOW TO TURN ON KICKBACKS:
 * 1. Get approved at CardRatings (https://www.cardratings.com/affiliate.html)
 *    and/or Bankrate (https://bankratecreditcards.com/).
 * 2. Paste each card's network APPLY url into VM_AFFILIATE.urls below.
 * 3. Set enabled: true and network: 'cardratings' | 'bankrate' | 'custom'.
 * Rankings never read this file. Commission does not affect sort order.
 */
(function (g) {
  "use strict";
  var AFF = {
    enabled: false,
    network: "none",
    verifiedLabel: "August 28, 2026",
    disclosureUrl: "/disclosures",
    urls: {
      csp: "", csr: "", venturex: "", venture: "", amexgold: "", bilt: "",
      disneyInspire: "", disneyVisa: "", universalPlus: "", hyatt: "",
      bonvoyBrilliant: "", carnival: "", royalCaribbeanCard: "",
      costcoCiti: "", citiCustomCash: "", chaseFreedomUnlimited: "",
      citiStrata: "", discoverMiles: "", wellsAutograph: ""
    }
  };
  function issuerUrl(card) { return (card && card.url) || "#"; }
  function resolveHref(card) {
    if (!card) return "#";
    if (card.affiliateUrl && card.affiliateUrl.length) return card.affiliateUrl;
    var mapped = AFF.urls[card.id];
    if (mapped && mapped.length) return mapped;
    return issuerUrl(card);
  }
  function isAffiliate(card, href) {
    var dest = href || resolveHref(card);
    var issuer = issuerUrl(card);
    return !!(dest && dest !== issuer);
  }
  function relFor(card, href) {
    return isAffiliate(card, href) ? "sponsored noopener" : "noopener";
  }
  function trackClick(card, href) {
    var dest = href || resolveHref(card);
    var params = {
      card_id: card && card.id || "unknown",
      card_name: card && card.name || "",
      is_affiliate: isAffiliate(card, dest) ? "yes" : "no"
    };
    if (typeof gtag === "function") gtag("event", "card_apply_click", params);
    if (g.VM_ANALYTICS && typeof g.VM_ANALYTICS.track === "function") {
      g.VM_ANALYTICS.track("card_apply_click", params);
    }
  }
  function disclosureOn() {
    if (AFF.enabled) return true;
    if (AFF.urls) {
      for (var k in AFF.urls) { if (AFF.urls[k]) return true; }
    }
    return false;
  }
  g.VM_AFFILIATE = AFF;
  g.VM_cardHref = resolveHref;
  g.VM_cardRel = relFor;
  g.VM_cardIsAffiliate = isAffiliate;
  g.VM_trackCardClick = trackClick;
  g.VM_affiliateLive = disclosureOn;
})(window);
