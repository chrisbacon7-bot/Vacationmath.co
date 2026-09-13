/* Generate one static HTML money guide per city. Content is pre-rendered so
   print / PDF / no-JS still show the full page — city-guide.js only wires print. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const CACHE = "v20260913f";
const ctx = { window: {}, console };
ctx.window = ctx;
ctx.global = ctx;
vm.createContext(ctx);

function run(file) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx, { filename: file });
}

run("trip-finder-data.js");
run("plan-data.js");
run("plan-recs-extra.js");
run("city-guides-data.js");
run("city-guide.js");

const GUIDES = ctx.VM_CITY_GUIDES.ALL;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function faqFor(g) {
  const tip = (g.tips || [])[0] || g.hook;
  return [
    {
      "@type": "Question",
      name: "When should I go to " + g.label + " to save money?",
      acceptedAnswer: { "@type": "Answer", text: g.whenGo }
    },
    {
      "@type": "Question",
      name: "Where should I base myself in " + g.label + "?",
      acceptedAnswer: { "@type": "Answer", text: (g.base && g.base.lean) || g.budgetNote }
    },
    {
      "@type": "Question",
      name: "What is a concrete money-saving tip for " + g.label + "?",
      acceptedAnswer: { "@type": "Answer", text: tip }
    }
  ];
}

function page(g) {
  const url = "https://vacationmath.co/guides/" + g.id;
  const title = g.label + " Money Guide 2026 | Vacation Math";
  const desc = g.hook + " Stay, eat, get around, and top money-saving tips. Estimates for planning — not live hotel quotes.";
  const body = ctx.VM_CITY_GUIDE.render(g);

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
<link rel="stylesheet" href="../styles.css?${CACHE}">
<link rel="stylesheet" href="../site-nav.css?v20260530">
<link rel="stylesheet" href="../city-guide.css?${CACHE}">
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
    headline: g.label + " Money Guide 2026",
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
    mainEntity: faqFor(g)
  })}</script>
</head>
<body class="cg-page">
<div class="cg-wrap">
  <article id="city-guide-root">
${body}
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
<script src="../city-guide.js?${CACHE}"></script>
<script src="../main.js"></script>
<script src="../site-nav.js?v20260913h" defer></script>
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

function injectIndex(filePath) {
  if (!fs.existsSync(filePath)) return;
  let src = fs.readFileSync(filePath, "utf8");
  const cards = ctx.VM_CITY_GUIDE.renderIndex(GUIDES);
  const startMark = "<!-- MONEY_GUIDES_START -->";
  const endMark = "<!-- MONEY_GUIDES_END -->";
  const oldStart = "<!-- CITY_BRIEFS_START -->";
  const oldEnd = "<!-- CITY_BRIEFS_END -->";
  let next = src
    .replace(oldStart, startMark)
    .replace(oldEnd, endMark)
    .replace(/id="city-briefs-grid"/g, "id=\"money-guides-grid\"");
  if (next.indexOf(startMark) >= 0 && next.indexOf(endMark) >= 0) {
    next = next.replace(
      /<!-- MONEY_GUIDES_START -->[\s\S]*?<!-- MONEY_GUIDES_END -->/,
      startMark + "\n        " + cards + "\n        " + endMark
    );
  } else {
    next = next.replace(
      /<div class="cg-index-grid" id="money-guides-grid">[\s\S]*?<\/div>/,
      "<div class=\"cg-index-grid\" id=\"money-guides-grid\">\n        " + startMark + "\n        " + cards + "\n        " + endMark + "\n      </div>"
    );
  }
  if (next === src) {
    console.warn("did not find money-guides-grid in", path.relative(root, filePath));
    return;
  }
  next = next.replace(/city-guide\.css\?v[0-9a-z]+/g, "city-guide.css?" + CACHE);
  next = next.replace(/city-guide\.js\?v[0-9a-z]+/g, "city-guide.js?" + CACHE);
  next = next.replace(/city-guides-data\.js\?v[0-9a-z]+/g, "city-guides-data.js?" + CACHE);
  fs.writeFileSync(filePath, next);
  console.log("updated index", path.relative(root, filePath));
}

injectIndex(path.join(root, "guides.html"));
injectIndex(path.join(root, "guides", "index.html"));

console.log("ok", GUIDES.length, "money guides pre-rendered");
