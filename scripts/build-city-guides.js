/* Generate one HTML shell per city brief. Content is filled by city-guide.js. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const ctx = { window: {}, console };
ctx.window = ctx;
ctx.global = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "city-guides-data.js"), "utf8"), ctx);

const GUIDES = ctx.VM_CITY_GUIDES.ALL;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function page(g) {
  const url = "https://vacationmath.co/guides/" + g.id;
  const title = g.label + " Travel Guide 2026 | Printable City Brief | Vacation Math";
  const desc = g.hook + " Stay, eat, get around, and top money-saving tips. VacationMath orientation — not live rates.";
  const tips = (g.tips || []).slice(0, 3).map(function (t) {
    return '{"@type":"Question","name":' + JSON.stringify("Money-saving tip for " + g.label + "?") + ',"acceptedAnswer":{"@type":"Answer","text":' + JSON.stringify(t) + "}}";
  });
  // unique FAQ names
  const faq = (g.tips || []).slice(0, 3).map(function (t, i) {
    const names = [
      "When should I go to " + g.label + " to save money?",
      "What is the Lean stay in " + g.label + "?",
      "What is a concrete money-saving tip for " + g.label + "?"
    ];
    const answers = [g.whenGo, g.budgetNote, t];
    return {
      "@type": "Question",
      name: names[i],
      acceptedAnswer: { "@type": "Answer", text: answers[i] }
    };
  });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">
<link rel="stylesheet" href="../styles.css?v20260912g">
<link rel="stylesheet" href="../site-nav.css?v20260530">
<link rel="stylesheet" href="../city-guide.css?v20260912g">
<link rel="canonical" href="${url}" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="Vacation Math" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="https://vacationmath.co/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="https://vacationmath.co/og-image.png" />
<meta name="robots" content="index,follow,max-image-preview:large" />
<meta name="author" content="Chris Bacon" />
<script async src="https://www.googletagmanager.com/gtag/js?id=G-1CX9TZ0873"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-1CX9TZ0873');
</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.label + " travel guide: a VacationMath city brief",
    description: desc,
    author: { "@type": "Person", name: "Chris Bacon", url: "https://vacationmath.co/how-it-works" },
    publisher: { "@type": "Organization", name: "Vacation Math", url: "https://vacationmath.co" },
    datePublished: "2026-09-12",
    dateModified: "2026-09-12",
    mainEntityOfPage: url
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vacationmath.co/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://vacationmath.co/guides" },
      { "@type": "ListItem", position: 3, name: g.label, item: url }
    ]
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq
  })}</script>
</head>
<body class="cg-page">
<div class="cg-wrap">
  <article id="city-guide-root">
    <p class="cg-kicker">City brief</p>
    <h1 class="cg-h1">${esc(g.label)}</h1>
    <p class="cg-hook">${esc(g.hook)}</p>
    <p>Loading the printable brief&hellip;</p>
    <noscript>
      <p class="cg-orient">VacationMath orientation — not live rates</p>
      <h2>When to go</h2>
      <p>${esc(g.whenGo)}</p>
      <h2>Top money-saving tips</h2>
      <ol>${(g.tips || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("")}</ol>
      <p><a href="/plan?dest=${esc(g.id)}">Build a hard-budget plan</a></p>
    </noscript>
  </article>
</div>
<footer class="footer cg-no-print">
  <div class="container footer-grid" style="padding:24px;">
    <p>Vacation Math &middot; &copy; 2026</p>
    <p class="footer-tag">Math it before you book it.</p>
    <p><a href="/guides">All guides</a> · <a href="/plan?dest=${esc(g.id)}">Trip Plan</a></p>
  </div>
</footer>
<script>window.VM_CITY_GUIDE_ID = ${JSON.stringify(g.id)};</script>
<script src="../trip-finder-data.js?v20260912us20"></script>
<script src="../plan-data.js?v20260912brands"></script>
<script src="../plan-recs-extra.js?v20260912brands"></script>
<script src="../city-guides-data.js?v20260912g"></script>
<script src="../city-guide.js?v20260912g"></script>
<script src="../main.js"></script>
<script src="../site-nav.js?v20260912g" defer></script>
<script src="../nav-fix.js" defer></script>
<script src="../analytics.js" defer></script>
</body>
</html>
`;
}

GUIDES.forEach(function (g) {
  const out = path.join(root, "guides", g.id + ".html");
  fs.writeFileSync(out, page(g));
  console.log("wrote", path.relative(root, out));
});

console.log("ok", GUIDES.length, "city briefs");
