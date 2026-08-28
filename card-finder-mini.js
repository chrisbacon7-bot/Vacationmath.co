/**
 * Vacation Math — Mini Card Finder
 * A compact CTA that lives on each calc page above the trip-matched cards.
 * Shows a 1-line teaser + 3 quick perk pill buttons (most common picks).
 * Clicking any pill deep-links to /card-finder.html with the perk pre-selected
 * so the user lands on Step 1 with that perk already "in mind".
 *
 * Lightweight — no dependency on cards-data.js.
 */
(function () {
  'use strict';

  function inject() {
    var mount = document.getElementById('card-finder-mini');
    if (!mount) return;

    mount.innerHTML = ''
      + '<aside class="cfm-card" aria-label="Card Finder">'
      +   '<div class="cfm-inner">'
      +     '<div class="cfm-body">'
      +       '<p class="cfm-kicker">None of these the right fit?</p>'
      +       '<h3 class="cfm-h3">Get a shortlist built around how <em>you</em> spend.</h3>'
      +       '<p class="cfm-help">The three cards above are matched to this trip. If you want a shortlist built around your everyday spending and the perks you actually use, answer three quick questions — we score 16 cards and rank the top three for you. Honest math, no aspirational redemptions.</p>'
      +     '</div>'
      +     '<div class="cfm-pills">'
      +       '<a class="cfm-pill" href="/card-finder?p=transferable">Transferable points</a>'
      +       '<a class="cfm-pill" href="/card-finder?p=lounges">Lounges</a>'
      +       '<a class="cfm-pill" href="/card-finder?p=simpleCashback">Simple cash back</a>'
      +     '</div>'
      +     '<a href="/card-finder" class="cfm-cta">Find my cards &rarr;</a>'
      +   '</div>'
      + '</aside>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
