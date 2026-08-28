/* ============================================================
   Vacation Math — Shared Site Nav
   Injects the same nav into every page. Single source of truth.
   ============================================================ */
(function () {
  'use strict';

  const CALCULATORS = [
    { href: '/tripfinder',   label: 'Where Should We Go?' },
    { href: '/budget',       label: 'What Can We Afford?' },
    { href: '/disney',       label: 'Disney World Cost' },
    { href: '/cruise',       label: 'Cruise Cost' },
    { href: '/allinclusive', label: 'All-Inclusive Cost' },
    { href: '/themeparks',   label: 'Theme Park Cost' },
    { href: '/roadtrip',     label: 'Road Trip: Drive or Fly?' },
    { href: '/points',       label: 'Points vs. Cash' },
    { href: '/whentobook',   label: 'Best Time to Book' },
    { href: '/timeshare',    label: 'Timeshare Math' },
    { href: '#',                 label: '— Spreadsheet —', divider: true },
    { href: '/tracker',      label: 'Trip Tracker (.xlsx)' }
  ];

  const PILLARS = [
    { href: '/family-trips', label: 'Family Trips' },
    { href: '/cruise-math',  label: 'Cruise Math' },
    { href: '/big-trip',     label: 'The Big Trip' },
    { href: '/guides',            label: '— Cost Guides —', divider: true },
    { href: '/guides/disney-world-vacation-cost',      label: 'Disney World Cost Guide' },
    { href: '/guides/how-much-does-a-cruise-cost',     label: 'How Much Does a Cruise Cost' },
    { href: '/guides/all-inclusive-resort-cost-guide', label: 'All-Inclusive Cost Guide' },
    { href: '/guides/hidden-costs-disney-world',       label: 'Hidden Disney Costs' },
    { href: '/guides/cruise-vs-all-inclusive-cost',    label: 'Cruise vs. All-Inclusive' },
    { href: '/guides/how-much-to-budget-for-vacation', label: 'Vacation Budget Guide' },
    { href: '/blog/',             label: '— Tuesday Travel Math —', divider: true },
    { href: '/blog/',             label: 'All Issues' },
    { href: '/blog/summer-road-trip-gas-cost-2026', label: 'Issue #1 · Summer Gas Math' },
    { href: '/blog/summer-airfare-cost-2026',       label: 'Issue #2 · Summer Airfare Math' },
    { href: '/blog/one-way-vs-round-trip-flights',  label: 'Issue #3 · One-Way vs Round Trip' },
    { href: '/blog/hotel-points-math-2026',         label: 'Issue #4 · Hotel Points Math' },
    { href: '/blog/all-inclusive-hidden-fees-2026',      label: 'Issue #5 · All-Inclusive Hidden Fees' },
    { href: '/blog/post-july-4th-travel-prices-2026',    label: 'Issue #6 · Post-July 4th Prices' },
    { href: '/blog/credit-card-vacation-debt-2026',      label: 'Issue #7 · Vacation Credit Card Debt' },
    { href: '/blog/disney-food-snacks-cost-2026',        label: 'Issue #8 · Disney Food &amp; Snacks' },
    { href: '/blog/disney-merchandise-cost-2026',        label: 'Issue #9 · Disney Merchandise' },
    { href: '/blog/fall-travel-cost-2026',               label: 'Issue #10 · Fall Travel Cost' },
    { href: '/blog/labor-day-travel-cost-2026',          label: 'Issue #11 · Labor Day Travel Cost' },
    { href: '/blog/halloween-events-cost-2026',          label: 'Issue #12 · Halloween Events Cost' },
    { href: '/blog/thanksgiving-christmas-flight-booking-2026', label: 'Issue #13 · Holiday Flight Booking' }
  ];

  // Page detection so we can highlight active nav item
  function currentPage() {
    const path = location.pathname.toLowerCase();
    // Normalise to a clean, leading-slash path so both /disney and the legacy
    // /disney.html resolve to the same key as the nav's clean hrefs.
    let p = path.replace(/\/index\.html?$/, '/').replace(/\.html$/, '');
    if (p.length > 1) p = p.replace(/\/+$/, '');
    if (p === '' || p === '/') return 'home';
    if (p === '/card-finder') return 'finder';
    if (p === '/how-it-works' || p === '/pillars') return 'how';
    if (p === '/guides' || path.includes('/guides/')) return 'pillar:guides';
    if (path.includes('/blog/')) return 'pillar:blog';
    if (CALCULATORS.some(c => c.href === p)) return 'calc:' + p;
    if (PILLARS.some(c => c.href === p)) return 'pillar:' + p;
    return p;
  }

  function render() {
    const active = currentPage();
    const calcActive = active.startsWith('calc:');
    const pillarActive = active.startsWith('pillar:');
    const homeIsCurrent = active === 'home';

    // Resolve relative paths — guide pages are one level deep
    const isSubdir = location.pathname.includes('/guides/') || location.pathname.includes('/blog/');
    const root = isSubdir ? '../' : '';

    const dropdownItems = CALCULATORS.map(c => {
      const isActive = active === 'calc:' + c.href;
      return `<li><a href="${c.href}"${isActive ? ' aria-current="page"' : ''}>${c.label}</a></li>`;
    }).join('');

    const pillarItems = PILLARS.map(c => {
      if (c.divider) {
        return `<li class="vm-drop-divider">${c.label}</li>`;
      }
      const isActive = active === 'pillar:' + c.href || (c.href.indexOf('/guides/') === 0 && active === 'pillar:guides') || (c.href.indexOf('/blog/') === 0 && active === 'pillar:blog');
      return `<li><a href="${c.href}"${isActive ? ' aria-current="page"' : ''}>${c.label}</a></li>`;
    }).join('');

    return `
<nav class="vm-nav" aria-label="Primary">
  <div class="vm-nav-inner">
    <a href="/" class="vm-brand" aria-label="Vacation Math home">
      <svg class="vm-logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="6" stroke="currentColor" stroke-width="2"/>
        <path d="M9 13h14M9 19h14" stroke="#E6A340" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
      <span class="vm-brand-text">Vacation Math</span>
    </a>

    <button class="vm-nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="vm-nav-links">
      <span class="vm-bar"></span><span class="vm-bar"></span><span class="vm-bar"></span>
    </button>

    <ul id="vm-nav-links" class="vm-nav-links" data-open="false">
      <li class="vm-has-drop${calcActive ? ' is-active' : ''}">
        <button class="vm-drop-toggle" aria-expanded="false" aria-controls="vm-calcs-menu">
          Calculators <span class="vm-chev" aria-hidden="true">▾</span>
        </button>
        <ul id="vm-calcs-menu" class="vm-drop">
          ${dropdownItems}
        </ul>
      </li>
      <li class="vm-has-drop${pillarActive ? ' is-active' : ''}">
        <button class="vm-drop-toggle" aria-expanded="false" aria-controls="vm-pillars-menu">
          Guides <span class="vm-chev" aria-hidden="true">▾</span>
        </button>
        <ul id="vm-pillars-menu" class="vm-drop">
          ${pillarItems}
        </ul>
      </li>
      <li><a href="/card-finder"${active === 'finder' ? ' aria-current="page"' : ''}>Card Finder</a></li>
      <li><a href="/how-it-works"${active === 'how' ? ' aria-current="page"' : ''}>How It Works</a></li>
      <li><a href="${homeIsCurrent ? '#newsletter' : root + 'index.html#newsletter'}" class="vm-nav-cta">Subscribe</a></li>
    </ul>
  </div>
</nav>`;
  }

  function wire() {
    const root = document.querySelector('.vm-nav');
    if (!root) return;

    const toggle = root.querySelector('.vm-nav-toggle');
    const links  = root.querySelector('.vm-nav-links');
    const dropBtns = root.querySelectorAll('.vm-drop-toggle');

    // Mobile hamburger
    toggle.addEventListener('click', () => {
      const open = links.getAttribute('data-open') === 'true';
      links.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // Close on link click (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 820px)').matches) {
          links.setAttribute('data-open', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    // Dropdowns
    function setDropdown(btn, open) {
      btn.setAttribute('aria-expanded', String(open));
      const drop = btn.parentElement.querySelector('.vm-drop');
      if (drop) drop.setAttribute('data-open', String(open));
    }
    function closeAllDropdowns() {
      dropBtns.forEach(b => setDropdown(b, false));
    }
    dropBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = btn.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns();
        setDropdown(btn, !wasOpen);
      });
      const parent = btn.parentElement;
      parent.addEventListener('mouseenter', () => {
        if (window.matchMedia('(min-width: 821px)').matches) {
          closeAllDropdowns();
          setDropdown(btn, true);
        }
      });
      parent.addEventListener('mouseleave', () => {
        if (window.matchMedia('(min-width: 821px)').matches) setDropdown(btn, false);
      });
    });
    document.addEventListener('click', (e) => {
      let inside = false;
      dropBtns.forEach(b => { if (b.parentElement.contains(e.target)) inside = true; });
      if (!inside) closeAllDropdowns();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllDropdowns();
        if (links.getAttribute('data-open') === 'true') {
          links.setAttribute('data-open', 'false');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  }

  function inject() {
    const existing = document.querySelector('nav.nav, nav.vm-nav');
    if (existing) existing.remove();
    const placeholder = document.createElement('div');
    placeholder.innerHTML = render();
    const nav = placeholder.firstElementChild;
    document.body.insertBefore(nav, document.body.firstChild);
    wire();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
