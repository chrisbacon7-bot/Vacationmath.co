/* =====================================================================
   Verified Pricing Badge
   Renders "Pricing verified September 2026" pill on every calc result.
   Auto-mounts inside #results after the first render.

   Usage: VM_VerifiedBadge.render(containerEl)
   Or:    VM_VerifiedBadge.autoMount()  // observes #results
   ===================================================================== */
(function (global) {
  "use strict";

  // ---- Update this when data is refreshed ----
  var VERIFIED_LABEL = "2026 pricing data · updated September";
  var NEXT_REFRESH = "October 2026";
  // ---------------------------------------------

  function badgeHtml() {
    return ''
      + '<div class="verified-badge" role="note" aria-label="' + VERIFIED_LABEL + '">'
      +   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      +     '<path d="M20 6 9 17l-5-5"/>'
      +   '</svg>'
      +   '<span><strong>' + VERIFIED_LABEL + '</strong> &middot; next update: ' + NEXT_REFRESH
+     + ' &middot; <a href="/sources" style="color:inherit;text-decoration:underline;">see every source</a></span>'
      + '</div>';
  }

  function render(container) {
    if (!container) return;
    // Don't duplicate
    if (container.querySelector(".verified-badge")) return;
    var div = document.createElement("div");
    div.innerHTML = badgeHtml();
    // Prepend so it sits at the top of the result block
    container.insertBefore(div.firstChild, container.firstChild);
  }

  // Auto-mount: observe #results and inject badge after each render
  function autoMount() {
    var target = document.getElementById("results");
    if (!target) return;
    var mo = new MutationObserver(function () {
      if (target.classList.contains("has-results")) render(target);
    });
    mo.observe(target, { childList: true, subtree: false });
    // Initial pass in case results are already rendered
    if (target.classList.contains("has-results")) render(target);
  }

  global.VM_VerifiedBadge = {
    render: render,
    autoMount: autoMount,
    label: VERIFIED_LABEL,
    nextRefresh: NEXT_REFRESH
  };
})(this);
