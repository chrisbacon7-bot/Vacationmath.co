/* ============================================================
   Vacation Math — Shared Site Nav
   Injects the same nav into every page. Single source of truth.
   ============================================================ */
(function () {
  'use strict';

  const CALCULATORS = [
    { href: 'tripfinder.html',   label: 'Where Should We Go?' },
    { href: 'budget.html',       label: 'What Can We Afford?' },
    { href: 'disney.html',       label: 'Disney World Cost' },
    { href: 'cruise.html',       label: 'Cruise Cost' },
    { href: 'allinclusive.html', label: 'All-Inclusive Cost' },
    { href: 'themeparks.html',   label: 'Theme Park Cost' },
    { href: 'roadtrip.html',     label: 'Road Trip: Drive or Fly?' },
    { href: 'points.html',       label: 'Points vs. Cash' },
    { href: 'whentobook.html',   label: 'Best Time to Book' },
    { href: 'timeshare.html',    label: 'Timeshare Math' },
    { href: '#',                 label: '— Spreadsheet —', divider: true },
    { href: 'tracker.html',      label: 'Trip Tracker (.xlsx)' }
  ];

  const PILLARS = [
    { href: 'family-trips.html', label: 'Family Trips' },
    { href: 'cruise-math.html',  label: 'Cruise Math' },
    { href: 'big-trip.html',     label: 'The Big Trip' },
    { href: 'guides/',           label: '— Cost Guides —', divider: true },
    { href: 'guides/disney-world-vacation-cost.html',      label: 'Disney World Cost Guide' },
    { href: 'guides/how-much-does-a-cruise-cost.html',     label: 'How Much Does a Cruise Cost' },
    { href: 'guides/all-inclusive-resort-cost-guide.html', label: 'All-Inclusive Cost Guide' },
    { href: 'guides/hidden-costs-disney-world.html',       label: 'Hidden Disney Costs' },
    { href: 'guides/cruise-vs-all-inclusive-cost.html',    label: 'Cruise vs. All-Inclusive' },
    { href: 'guides/how-much-to-budget-for-vacation.html', label: 'Vacation Budget Guide' },
    { href: 'blog/',             label: '— Tuesday Travel Math —', divider: true },
    { href: 'blog/',             label: 'All Issues' },
    { href: 'blog/summer-road-trip-gas-cost-2026', label: 'Issue #1 · Summer Gas Math' },
    { href: 'blog/summer-airfare-cost-2026',       label: 'Issue #2 · Summer Airfare Math' },
    { href: 'blog/one-way-vs-round-trip-flights',  label: 'Issue #3 · One-Way vs Round Trip' },
    { href: 'blog/hotel-points-math-2026',         label: 'Issue #4 · Hotel Points Math' }
  ];

  // Page detection so we can highlight active nav item
  function currentPage() {
    const path = location.pathname.toLowerCase();
    const p = (path.split('/').pop() || 'index.html');
    if (p === '' || p === 'index.html') return 'home';
    if (p === 'card-finder.html') return 'finder';
    if (p === 'budget.html') return 'calc:budget.html';
    if (p === 'tripfinder.html') return 'calc:tripfinder.html';
    if (p === 'how-it-works.html' || p === 'pillars.html') return 'how';
    if (path.includes('/guides/')) return 'pillar:guides';
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
      return `<li><a href="${root}${c.href}"${isActive ? ' aria-current="page"' : ''}>${c.label}</a></li>`;
    }).join('');

    const pillarItems = PILLARS.map(c => {
      if (c.divider) {
        return `<li class="vm-drop-divider">${c.label}</li>`;
      }
      const isActive = active === 'pillar:' + c.href || (c.href.includes('/guides/') && active === 'pillar:guides') || (c.href.startsWith('blog/') && active === 'pillar:blog');
      return `<li><a href="${root}${c.href}"${isActive ? ' aria-current="page"' : ''}>${c.label}</a></li>`;
    }).join('');

    return `
<nav class="vm-nav" aria-label="Primary">
  <div class="vm-nav-inner">
    <a href="${root}index.html" class="vm-brand" aria-label="Vacation Math home">
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
      <li><a href="${root}card-finder.html"${active === 'finder' ? ' aria-current="page"' : ''}>Card Finder</a></li>
      <li><a href="${root}how-it-works.html"${active === 'how' ? ' aria-current="page"' : ''}>How It Works</a></li>
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
