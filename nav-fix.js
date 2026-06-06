// Sandbox-iframe navigation fix.
// When this site is embedded in a sandboxed iframe (Perplexity inline preview),
// plain <a> clicks to relative URLs are silently blocked because the iframe
// lacks allow-top-navigation. We intercept clicks on internal links and use
// window.location.assign, which is permitted.
(function () {
  if (typeof document === "undefined") return;

  function isInternalLink(a) {
    if (!a || a.tagName !== "A") return false;
    var href = a.getAttribute("href");
    if (!href) return false;
    // Skip hashes-only, mailto, tel, external schemes, and target=_blank
    if (href.indexOf("#") === 0) return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (a.target && a.target !== "" && a.target !== "_self" && a.target !== "_top") return false;
    // Same-origin only — allow protocol-relative and root-relative paths
    try {
      var url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch (e) {
      return true; // assume relative
    }
  }

  document.addEventListener("click", function (e) {
    // ignore modifier-key clicks (user wants new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var t = e.target;
    while (t && t !== document) {
      if (t.tagName === "A") {
        if (isInternalLink(t)) {
          var href = t.getAttribute("href");
          // Hash-anchor on same page — let default scroll behavior happen
          if (href.indexOf("#") > -1) {
            var url = new URL(href, window.location.href);
            if (url.pathname === window.location.pathname) return;
          }
          e.preventDefault();
          try {
            window.location.assign(t.href);
          } catch (err) {
            window.location.href = t.href;
          }
        }
        return;
      }
      t = t.parentNode;
    }
  }, true);
})();
