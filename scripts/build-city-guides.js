/* Generate one static HTML brief per city. Content is pre-rendered so
   print / PDF / no-JS still show the full page — city-guide.js only wires print. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const CACHE = "v20260925ed";
const HUB_TITLE = "Vacation Money Guides 2026 | 20 Destinations | Vacation Math";
const HUB_DESC = "20 printable destination money guides: Budget, Mid-range, and Splurge stay, eat, and hidden costs for 2026. Not live rates.";
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
run("city-guides-research.js");
run("city-guides-a2.js");
run("city-guides-editorial.js");
run("city-guides-lists.js");
run("city-guides-polish.js");
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
      acceptedAnswer: { "@type": "Answer", text: g.months }
    },
    {
      "@type": "Question",
      name: "Where should I base myself in " + g.label + "?",
      acceptedAnswer: { "@type": "Answer", text: g.stayRule || g.blurb }
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
  const seo = ctx.VM_CITY_GUIDE.seo(g);
  const title = seo.title;
  const desc = seo.desc;
  if (!title || title.indexOf("Vacation Math") < 0 || title.indexOf("Printable") >= 0) {
    throw new Error(g.id + ": bad title " + title);
  }
  if (!desc || desc.length > 160 || !/\.$/.test(desc) || desc.indexOf("Not live rates") < 0) {
    throw new Error(g.id + ": bad meta (" + desc.length + ") " + desc);
  }
  if (!seo.h1 || seo.h1.indexOf("2026") < 0) {
    throw new Error(g.id + ": bad h1 " + seo.h1);
  }
  const body = ctx.VM_CITY_GUIDE.render(g);
  if (body.indexOf("<h1 class=\"cg-h1\">" + esc(seo.h1) + "</h1>") < 0) {
    throw new Error(g.id + ": rendered h1 mismatch");
  }

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
    headline: seo.h1,
    description: desc,
    author: { "@type": "Person", name: "Chris Bacon", url: "https://vacationmath.co/how-it-works" },
    publisher: { "@type": "Organization", name: "Vacation Math", url: "https://vacationmath.co" },
    datePublished: "2026-09-12",
    dateModified: "2026-09-25",
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

function collectionLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vacation Money Guides 2026",
    description: HUB_DESC,
    url: "https://vacationmath.co/guides",
    isPartOf: { "@type": "WebSite", name: "Vacation Math", url: "https://vacationmath.co" },
    mainEntity: {
      "@type": "ItemList",
      name: "20 destination money guides",
      numberOfItems: GUIDES.length,
      itemListElement: GUIDES.map(function (g, i) {
        return {
          "@type": "ListItem",
          position: i + 1,
          name: g.label,
          url: "https://vacationmath.co/guides/" + g.id
        };
      })
    }
  };
}

function injectIndex(filePath) {
  if (!fs.existsSync(filePath)) return;
  let src = fs.readFileSync(filePath, "utf8");
  if (src.indexOf(HUB_TITLE) < 0 || src.indexOf(HUB_DESC) < 0) {
    throw new Error("hub title/meta missing in " + path.relative(root, filePath));
  }
  const cards = ctx.VM_CITY_GUIDE.renderIndex(GUIDES);
  const startMark = "<!-- MONEY_GUIDES_START -->";
  const endMark = "<!-- MONEY_GUIDES_END -->";
  let next = src
    .replace(/<!-- CITY_BRIEFS_START -->/g, startMark)
    .replace(/<!-- CITY_BRIEFS_END -->/g, endMark)
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
  if (next.indexOf(startMark) < 0) {
    console.warn("did not find money-guides-grid in", path.relative(root, filePath));
    return;
  }
  var prefix = filePath.indexOf(path.sep + "guides" + path.sep) >= 0 ? "../" : "";
  [
    "city-guide.css",
    "city-guide.js",
    "city-guides-data.js",
    "city-guides-research.js",
    "city-guides-a2.js",
    "city-guides-editorial.js",
    "city-guides-lists.js",
    "city-guides-polish.js"
  ].forEach(function (file) {
    next = next.replace(new RegExp(file.replace(".", "\\.") + "\\?v[0-9a-z]+", "g"), file + "?" + CACHE);
  });
  function insertAfter(html, afterFile, newFile) {
    if (html.indexOf(newFile) >= 0) return html;
    var safe = afterFile.replace(/\./g, "\\.");
    var re = new RegExp('(<script src="(?:\\.\\./)?' + safe + '\\?[^"]+"></script>)');
    return html.replace(re, "$1\n<script src=\"" + prefix + newFile + "?" + CACHE + "\"></script>");
  }
  next = insertAfter(next, "city-guides-data.js", "city-guides-research.js");
  next = insertAfter(next, "city-guides-research.js", "city-guides-a2.js");
  next = insertAfter(next, "city-guides-a2.js", "city-guides-editorial.js");
  next = insertAfter(next, "city-guides-editorial.js", "city-guides-lists.js");
  next = insertAfter(next, "city-guides-lists.js", "city-guides-polish.js");
  const ld = "<!-- GUIDES_JSONLD_START -->\n<script type=\"application/ld+json\">"
    + JSON.stringify(collectionLd())
    + "</script>\n<!-- GUIDES_JSONLD_END -->";
  if (next.indexOf("<!-- GUIDES_JSONLD_START -->") >= 0) {
    next = next.replace(/<!-- GUIDES_JSONLD_START -->[\s\S]*?<!-- GUIDES_JSONLD_END -->/, ld);
  } else {
    throw new Error("GUIDES_JSONLD markers missing in " + path.relative(root, filePath));
  }
  fs.writeFileSync(filePath, next);
  console.log("updated index", path.relative(root, filePath));
}

injectIndex(path.join(root, "guides.html"));
injectIndex(path.join(root, "guides", "index.html"));

console.log("ok", GUIDES.length, "money guides pre-rendered");
