#!/usr/bin/env python3
"""Generate /sources.html from the live calc-data.js values plus the verified
source URLs from the August 2026 research pass.

Generating rather than hand-writing means the published figures can never drift
from what the calculators actually use.
"""
import json, subprocess, pathlib, datetime

REPO = pathlib.Path("/home/user/workspace/vm")
D = json.loads(subprocess.check_output(
    ["node", "-e", "console.log(JSON.stringify(require('%s/calc-data.js').VM_DATA))" % REPO]
).decode())

REFRESHED = "August 28, 2026"
REFRESHED_ISO = "2026-08-28"
NEXT = "October 2026"

# (section, label, value, as-of, source name, source url)
ROWS = [
 ("Road trip and driving", [
  ("National average gas price", f"${D['ROADTRIP']['avgGasPrice']:.2f}/gal", "Aug 28, 2026",
   "AAA Fuel Prices", "https://gasprices.aaa.com/"),
  ("IRS standard mileage rate", f"{D['ROADTRIP']['irsBusinessRate']*100:.1f}&cent;/mi", "Jul 1&ndash;Dec 31, 2026",
   "IRS standard mileage rates", "https://www.irs.gov/tax-professionals/standard-mileage-rates"),
  ("Wear and tear (non-fuel, per mile)", f"${D['ROADTRIP']['wearPerMile']:.2f}/mi", "2025 edition",
   "AAA Your Driving Costs", "https://newsroom.aaa.com/wp-content/uploads/2025/09/UPDATE-AAA-Fact-Sheet-Your-Driving-Cost-9.2025-1.pdf"),
  ("Rental car, per day", f"${D['ROADTRIP']['rentalCarPerDay']}", "Summer 2026",
   "CheapCarRental airport survey", "https://www.cheapcarrental.com/survey/summer2026.php"),
  ("Mid-trip hotel, per night", f"${D['ROADTRIP']['midwayHotelAvg']}", "July 2026",
   "CoStar/STR US hotel performance", "https://www.costar.com/fr-ca/can/produits/str-benchmark/ressources/communiques-de-presse/us-hotel-performance-july-2026"),
 ]),
 ("Disney World", [
  ("1-day, 1-park adult ticket", f"${D['DISNEY']['tickets']['low']}&ndash;${D['DISNEY']['tickets']['high']}", "Aug 2026",
   "Disney World official tickets", "https://disneyworld.disney.go.com/admission/tickets/"),
  ("Ticket price used as mid-season average", f"${D['DISNEY']['tickets']['avg']}/person/day", "Aug 2026",
   "Touring Plans 2026 ticket table", "https://touringplans.com/blog/every-regular-disney-world-ticket-price-in-2026/"),
  ("Lightning Lane Multi Pass", f"${D['DISNEY']['lightningLanePerDay']}/person/day", "Aug 2026",
   "Disney Food Blog confirmed prices", "https://www.disneyfoodblog.com/2026/08/08/august-prices-confirmed-for-disney-worlds-lightning-lane-system-2/"),
  ("Park Hopper add-on", f"${D['DISNEY']['parkHopperPerTicket']}/ticket", "2026&ndash;27",
   "Touring Plans", "https://touringplans.com/blog/every-regular-disney-world-ticket-price-in-2026/"),
  ("Value resort, per night", f"${D['DISNEY']['resorts']['value']['avg']}", "Jun 2026",
   "Theme Parks Guide", "https://www.themeparks-guide.com/disney-world-resorts-guide/"),
  ("Moderate resort, per night", f"${D['DISNEY']['resorts']['moderate']['avg']}", "Jun 2026",
   "Theme Parks Guide", "https://www.themeparks-guide.com/disney-world-resorts-guide/"),
  ("Deluxe resort, per night", f"${D['DISNEY']['resorts']['deluxe']['avg']}", "Jun 2026",
   "Theme Parks Guide", "https://www.themeparks-guide.com/disney-world-resorts-guide/"),
 ]),
 ("Cruise &mdash; daily gratuities", [
  ("Carnival", f"${D['CRUISE_LINES_EXPANDED']['carnival']['gratuityPerDay']:.2f}/person/day", "Apr 2, 2026",
   "Carnival official", "https://www.carnival.com/help?topicid=Gratuities"),
  ("Royal Caribbean", f"${D['CRUISE_LINES_EXPANDED']['royal_caribbean']['gratuityPerDay']:.2f}/person/day", "2026",
   "Royal Caribbean official FAQ", "https://www.royalcaribbean.com/faq/questions/onboard-service-gratuity-expense"),
  ("Norwegian (NCL)", f"${D['CRUISE_LINES_EXPANDED']['ncl']['gratuityPerDay']:.2f}/person/day", "2026",
   "NCL official FAQ", "https://www.ncl.com/ca/en/cruise-faq/what-is-onboard-service-charge"),
  ("MSC", f"${D['CRUISE_LINES_EXPANDED']['msc']['gratuityPerDay']:.2f}/person/day", "May 11, 2026",
   "MSC official service charges", "https://www.msccruisesusa.com/manage-booking/before-you-go/service-charges"),
  ("Princess", f"${D['CRUISE_LINES_EXPANDED']['princess']['gratuityPerDay']:.2f}/person/day", "Mar 8, 2026",
   "Cruise Critic", "https://www.cruisecritic.com/news/princess-cruises-increases-crew-appreciation"),
  ("Celebrity", f"${D['CRUISE_LINES_EXPANDED']['celebrity']['gratuityPerDay']:.2f}/person/day", "Jul 29, 2026",
   "USA Today", "https://www.usatoday.com/story/travel/cruises/2026/07/30/celebrity-raises-cruise-gratuity-rates/91107810007/"),
  ("Holland America", f"${D['CRUISE_LINES_EXPANDED']['holland_america']['gratuityPerDay']:.2f}/person/day", "Jun 1, 2026",
   "Deep Arrival", "https://deeparrival.com/news/holland-america-gratuities-increase-2026/"),
  ("Disney Cruise Line", f"${D['CRUISE_LINES_EXPANDED']['disney']['gratuityPerDay']:.2f}/person/day", "Jun 2026",
   "Deep Arrival", "https://deeparrival.com/cruise/cruise-lines/disney/gratuities/"),
  ("Virgin Voyages", f"${D['CRUISE_LINES_EXPANDED']['virgin_voyages']['gratuityPerDay']:.2f}/person/day", "Oct 2025",
   "Virgin Voyages official FAQ", "https://www.virginvoyages.com/faq/before-you-sail/voyagefair-choices"),
 ]),
 ("Cruise &mdash; add-ons", [
  ("Carnival CHEERS", f"${D['CRUISE']['drinkPackagePerLine']['carnival']['unlimited']}/person/day", "Aug 2026",
   "Carnival official", "https://www.carnival.com/drink-packages/cheers-package"),
  ("Royal Caribbean Deluxe Beverage", f"${D['CRUISE']['drinkPackagePerLine']['royal']['unlimited']}/person/day", "Jun 2026",
   "Royal Caribbean Blog", "https://www.royalcaribbeanblog.com/royal-caribbean-beverage-package-costs-info-tips"),
  ("NCL Unlimited Open Bar", f"${D['CRUISE']['drinkPackagePerLine']['ncl']['unlimited']}/person/day", "Jun 2026",
   "NCL Free at Sea", "https://www.ncl.com/cruise-deals/free-at-sea"),
  ("MSC Premium Extra", f"${D['CRUISE']['drinkPackagePerLine']['msc']['unlimited']}/person/day", "Jun 2026",
   "Deep Arrival", "https://deeparrival.com/cruise/cruise-lines/msc/drink-packages/"),
  ("Princess Plus", f"${D['CRUISE']['drinkPackagePerLine']['princess']['unlimited']}/person/day", "2026",
   "Princess official terms", "https://www.princess.com/cruise-deals-promotions/plus-premier-cruise-packages/terms-and-conditions"),
  ("Ship Wi-Fi", f"${D['CRUISE']['wifiPerDay']}/device/day", "Aug 2026",
   "eSIM Cruise Wi-Fi survey", "https://esimcruise.deals/guides/cruise-wifi-prices"),
  ("Shore excursion", f"${D['CRUISE']['excursionPerPersonPerPort']}/person/port", "2026",
   "Cruise line published excursion pricing", "https://www.cruisecritic.com/"),
 ]),
 ("All-inclusive and destination fees", [
  ("Quintana Roo Visitax (Cancún / Riviera Maya)", "283&ndash;293 MXN (~US$15&ndash;18) per person", "2026",
   "Official Visitax portal", "https://www.visitax.gob.mx/sitio/"),
  ("Cancún environmental sanitation fee", "83 MXN per room per night", "Feb 2026",
   "Reporte Quintana Roo", "https://www.reportequintanaroo.com/que-es-el-derecho-de-saneamiento-ambiental-y-cuanto-debes-pagar/"),
  ("Jamaica Tourism Enhancement Fee", "US$20 air arrival / US$2 cruise", "2026",
   "Tourism Enhancement Fund", "https://tef.gov.jm/our-story/"),
  ("Bahamas departure tax", "US$23 sea / BS$15 air, plus levies", "Aug 2026",
   "Bahamas Customs", "https://www.bahamascustoms.gov.bs/tariffs-and-various-taxes-collected-by-customs/other-taxes/"),
 ]),
 ("Points and cards", [
  ("Chase Ultimate Rewards", f"{D['POINTS_EXPANDED']['chase_ur']['transfer']:.2f}&cent;/point (transfer)", "Jul 23, 2026",
   "Frequent Miler Reasonable Redemption Values", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
  ("Amex Membership Rewards", f"{D['POINTS_EXPANDED']['amex_mr']['transfer']:.2f}&cent;/point (transfer)", "Jul 23, 2026",
   "Frequent Miler RRV", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
  ("Capital One Miles", f"{D['POINTS_EXPANDED']['capital_one']['transfer']:.2f}&cent;/point (transfer)", "Jul 23, 2026",
   "Frequent Miler RRV", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
  ("Citi ThankYou", f"{D['POINTS_EXPANDED']['citi_ty']['transfer']:.2f}&cent;/point (transfer)", "Jul 23, 2026",
   "Frequent Miler RRV", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
  ("World of Hyatt", f"{D['POINTS_EXPANDED']['hyatt']['transfer']:.2f}&cent;/point", "Jul 23, 2026",
   "Frequent Miler RRV", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
  ("Marriott Bonvoy", f"{D['POINTS_EXPANDED']['marriott_bonvoy']['transfer']:.2f}&cent;/point", "Jul 23, 2026",
   "Frequent Miler RRV", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
  ("Hilton Honors", f"{D['POINTS_EXPANDED']['hilton_honors']['tpg']:.2f}&cent;/point", "Jul 23, 2026",
   "Frequent Miler RRV", "https://frequentmiler.com/reasonable-redemption-values-rrvs/"),
 ]),
 ("Airfare and lodging baselines", [
  ("US domestic average round-trip fare", "$428", "Q1 2026",
   "Bureau of Transportation Statistics", "https://www.bts.gov/newsroom/first-quarter-2026-average-air-fare-increases-47-fourth-quarter-2025"),
  ("US average daily hotel rate", "$171.74", "July 2026",
   "CoStar/STR", "https://www.costar.com/fr-ca/can/produits/str-benchmark/ressources/communiques-de-presse/us-hotel-performance-july-2026"),
 ]),
]

def table(rows):
    out = ['<table class="src-table">',
           '<thead><tr><th>What we use</th><th>Current value</th><th>As of</th><th>Source</th></tr></thead><tbody>']
    for label, value, asof, sname, surl in rows:
        out.append(
            f'<tr><td>{label}</td><td class="src-val">{value}</td><td class="src-asof">{asof}</td>'
            f'<td><a href="{surl}" target="_blank" rel="noopener nofollow">{sname}</a></td></tr>')
    out.append("</tbody></table>")
    return "\n".join(out)

sections = "\n".join(
    f'    <section class="src-section">\n      <h2 class="src-h2">{title}</h2>\n{table(rows)}\n    </section>'
    for title, rows in ROWS)

total = sum(len(r) for _, r in ROWS)

html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sources &amp; Pricing Data | Vacation Math</title>
<meta name="description" content="Every number our calculators use, what it is right now, and the source it came from. {total} figures, each with a link. Updated {REFRESHED}." />
<link rel="canonical" href="https://vacationmath.co/sources" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<meta name="author" content="Chris Bacon" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://vacationmath.co/sources" />
<meta property="og:title" content="Sources &amp; Pricing Data | Vacation Math" />
<meta property="og:description" content="Every number our calculators use, what it is right now, and the source it came from. Updated {REFRESHED}." />
<meta property="og:image" content="https://vacationmath.co/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Sources &amp; Pricing Data | Vacation Math" />
<meta name="twitter:description" content="Every number our calculators use, and where it came from. Updated {REFRESHED}." />
<meta name="twitter:image" content="https://vacationmath.co/og-image.png" />

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="calc-shared.css">
<link rel="stylesheet" href="site-nav.css">

<script type="application/ld+json">{{"@context": "https://schema.org", "@type": "Article", "headline": "Sources & Pricing Data", "description": "Every figure the Vacation Math calculators use, its current value, and the source it came from.", "datePublished": "{REFRESHED_ISO}", "dateModified": "{REFRESHED_ISO}", "author": {{"@type": "Person", "name": "Chris Bacon", "url": "https://vacationmath.co/how-it-works"}}, "publisher": {{"@type": "Organization", "name": "Vacation Math", "url": "https://vacationmath.co"}}, "mainEntityOfPage": {{"@type": "WebPage", "@id": "https://vacationmath.co/sources"}}}}</script>
<script type="application/ld+json">{{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{{"@type": "ListItem", "position": 1, "name": "Vacation Math", "item": "https://vacationmath.co"}}, {{"@type": "ListItem", "position": 2, "name": "Sources & Pricing Data", "item": "https://vacationmath.co/sources"}}]}}</script>

<style>
  .src-hero {{ padding: 68px 0 26px; }}
  .src-hero h1 {{
    font-family: var(--font-display);
    font-size: clamp(2.1rem, 4.4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--navy);
    margin: 0 0 18px;
    line-height: 1.08;
    max-width: 900px;
  }}
  .src-hero p {{ font-size: 1.1rem; color: var(--ink-soft); max-width: 68ch; margin: 0 0 12px; }}
  .src-meta {{
    display: inline-block;
    margin-top: 10px;
    padding: 7px 14px;
    border-radius: 999px;
    background: #eef4ea;
    color: #2f5d3a;
    font-size: 0.88rem;
    font-weight: 600;
  }}
  .src-section {{ margin: 40px 0; }}
  .src-h2 {{
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--navy);
    margin: 0 0 14px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--honey);
  }}
  .src-table {{ width: 100%; border-collapse: collapse; font-size: 0.95rem; }}
  .src-table th {{
    text-align: left;
    font-size: 0.76rem;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ink-soft);
    border-bottom: 1px solid #e2ddd4;
    padding: 8px 12px 8px 0;
    font-weight: 600;
  }}
  .src-table td {{ padding: 11px 12px 11px 0; border-bottom: 1px solid #efeae1; vertical-align: top; }}
  .src-table tr:last-child td {{ border-bottom: none; }}
  .src-val {{ font-variant-numeric: tabular-nums; font-weight: 600; color: var(--navy); white-space: nowrap; }}
  .src-asof {{ color: var(--ink-soft); white-space: nowrap; font-size: 0.9rem; }}
  .src-table a {{ color: #1e3a5f; text-decoration: underline; text-decoration-color: rgba(30,58,95,0.35); }}
  .src-table a:hover {{ text-decoration-color: var(--honey); }}
  .src-note {{
    background: #fbf7ef;
    border-left: 3px solid var(--honey);
    padding: 16px 18px;
    margin: 26px 0;
    border-radius: 0 8px 8px 0;
  }}
  .src-note p {{ margin: 0 0 10px; color: var(--ink-soft); }}
  .src-note p:last-child {{ margin-bottom: 0; }}
  @media (max-width: 640px) {{
    .src-table {{ font-size: 0.88rem; }}
    .src-table th:nth-child(3), .src-table td:nth-child(3) {{ display: none; }}
    /* Long fee strings must wrap here or they push the page sideways. */
    .src-val {{ white-space: normal; }}
  }}
</style>
</head>
<body>

<main>
  <div class="container src-hero">
    <p class="kicker" style="color:var(--honey);font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem;margin:0 0 10px;">Sources</p>
    <h1>Every number, and where it came from.</h1>
    <p>The calculators on this site are only worth using if you can check them. This page lists the {total} figures behind them &mdash; what each one is right now, when it was verified, and a link to the source that publishes it.</p>
    <p>Where a source gives a range, we lean toward the higher end. The estimates are deliberately biased toward over-counting, because the failure people actually regret is under-budgeting a trip.</p>
    <p class="src-meta">Last verified {REFRESHED} &middot; next refresh {NEXT}</p>
  </div>

  <div class="container">
{sections}

    <div class="src-note">
      <p><strong>What these numbers are not.</strong> They are published rates and industry averages, not live quotes. A real booking can land 20% either side of any figure here depending on date, occupancy, and promotion. Use the calculators to triangulate a realistic budget, then confirm with the operator before you book.</p>
      <p><strong>How often this changes.</strong> The full data set is re-verified quarterly, and sooner when an operator announces a change mid-quarter &mdash; five cruise lines raised gratuities during 2026, and each was picked up within weeks. The date on every row above is the date that specific figure was last checked against its source.</p>
      <p><strong>Found something wrong?</strong> Email <a href="mailto:chris@vacationmath.co">chris@vacationmath.co</a>. Corrections get made and the row gets re-dated.</p>
    </div>

    <p style="margin:30px 0 60px;"><a href="/how-it-works" style="font-weight:600;">Read the full methodology &rarr;</a> &nbsp;&middot;&nbsp; <a href="/calculators" style="font-weight:600;">Go to the calculators &rarr;</a></p>
  </div>
</main>

<footer class="footer">
  <div class="container footer-email-signup">
    <form class="capture capture-footer" data-source="footer-signup-sources" novalidate>
      <label class="sr-only" for="email-footer-sources">Email address</label>
      <input id="email-footer-sources" name="email" type="email" inputmode="email" autocomplete="email" placeholder="your@email.com" required />
      <button type="submit" class="btn btn-honey-on-navy">Get the Tuesday brief</button>
      <p class="form-msg" aria-live="polite"></p>
    </form>
  </div>
  <div class="container footer-grid">
    <p>Vacation Math &middot; &copy; 2026</p>
    <p class="footer-tag">Memories aren&rsquo;t reserved for the rich.</p>
    <p><a href="mailto:chris@vacationmath.co">chris@vacationmath.co</a></p>
  </div>
  <div class="container footer-fineprint">
    <p>Not affiliated with, endorsed by, or sponsored by any travel brand, cruise line, resort, park, or card issuer. Figures are published rates and industry averages, verified {REFRESHED} and subject to change.</p>
  </div>
  <div class="container footer-sitemap">
    <nav aria-label="All calculators">
      <p class="footer-sitemap-title">Calculators</p>
      <ul>
        <li><a href="/tripfinder">Where Should We Go?</a></li>
        <li><a href="/budget">What Can We Afford?</a></li>
        <li><a href="/disney">Disney World Cost</a></li>
        <li><a href="/cruise">Cruise Cost</a></li>
        <li><a href="/allinclusive">All-Inclusive Cost</a></li>
        <li><a href="/themeparks">Theme Park Cost</a></li>
        <li><a href="/roadtrip">Road Trip: Drive or Fly?</a></li>
        <li><a href="/points">Points vs. Cash</a></li>
        <li><a href="/whentobook">Best Time to Book</a></li>
        <li><a href="/timeshare">Timeshare Math</a></li>
        <li><a href="/card-finder">Find Your Card</a></li>
        <li><a href="/funding">Plan The Funding</a></li>
        <li><a href="/tracker">Trip Tracker</a></li>
        <li><a href="/calculators">All calculators</a></li>
      </ul>
    </nav>
  </div>
</footer>

<script src="site-nav.js?v20260531a"></script>
<script src="analytics.js" defer></script>
<script src="main.js" defer></script>
</body>
</html>
'''

(REPO / "sources.html").write_text(html)
print(f"sources.html written: {total} figures across {len(ROWS)} sections")
