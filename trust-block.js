/* ==================== TRUST BLOCK ====================
 * Drop-in component injected under every .calc-hero.
 * Promise + sourcing + last-updated + methodology link.
 * Page can override defaults via window.VM_TRUST_OVERRIDE = { ... }
 * ===================================================== */
(function () {
  'use strict';

  var DEFAULTS = {
    promise: 'Real cost, line by line.',
    pricing: '2026 published pricing.',
    updated: 'Updated May 2026.',
    sourcesId: 'sources',
    methodologyHref: 'how-it-works.html'
  };

  function mergeOpts() {
    var override = window.VM_TRUST_OVERRIDE || {};
    var out = {};
    Object.keys(DEFAULTS).forEach(function (k) { out[k] = DEFAULTS[k]; });
    Object.keys(override).forEach(function (k) { if (override[k]) out[k] = override[k]; });
    return out;
  }

  function buildHTML(opts) {
    return [
      '<div class="trust-block container" role="note" aria-label="How we calculate">',
      '  <div class="trust-block-inner">',
      '    <span class="trust-pill">',
      '      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">',
      '        <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>',
      '      </svg>',
      '      Sourced math',
      '    </span>',
      '    <p class="trust-line">',
      '      <strong>' + opts.promise + '</strong> ' + opts.pricing + ' ' + opts.updated,
      '      <a href="' + opts.methodologyHref + '" class="trust-link">Methodology &rarr;</a>',
      '    </p>',
      '  </div>',
      '</div>'
    ].join('');
  }

  function inject() {
    var hero = document.querySelector('.calc-hero');
    if (!hero) return;
    if (document.querySelector('.trust-block')) return; // already injected
    var opts = mergeOpts();
    var wrap = document.createElement('div');
    wrap.className = 'trust-block-wrap';
    wrap.innerHTML = buildHTML(opts);
    hero.parentNode.insertBefore(wrap, hero.nextSibling);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  window.VM_TrustBlock = { inject: inject };
})();
