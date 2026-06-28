/* =====================================================================
   Guide Download — PDF generator
   Auto-mounts a "Download my plan as PDF" button inside #results panels.
   Pulls the user's exact inputs + the itemized breakdown they see and
   builds a personalized, branded PDF using jsPDF.

   No server. No tracking pixel. Fires `pdf_download` GA4 event on click.

   Usage:
     VM_GuideDownload.autoMount()        // default: observes #results
     VM_GuideDownload.render(container)  // manual mount inside an element
   ===================================================================== */
(function (global) {
  "use strict";

  var JSPDF_CDN = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  var BRAND = {
    name: "Vacation Math",
    site: "vacationmath.co",
    tag: "Math it before you book it.",
    primary: [230, 163, 64],   // honey
    ink:     [26, 20, 16],     // body text
    muted:   [120, 110, 100]
  };

  var jspdfPromise = null;

  function loadJsPDF() {
    if (jspdfPromise) return jspdfPromise;
    if (global.jspdf && global.jspdf.jsPDF) {
      jspdfPromise = Promise.resolve(global.jspdf.jsPDF);
      return jspdfPromise;
    }
    jspdfPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = JSPDF_CDN;
      s.async = true;
      s.onload = function () {
        if (global.jspdf && global.jspdf.jsPDF) resolve(global.jspdf.jsPDF);
        else reject(new Error("jsPDF loaded but global not found"));
      };
      s.onerror = function () { reject(new Error("Failed to load jsPDF")); };
      document.head.appendChild(s);
    });
    return jspdfPromise;
  }

  function detectCalcType() {
    var path = (location.pathname || "").replace(/^\//, "").replace(/\/$/, "");
    // Strip .html extension and any trailing/leading slashes
    path = path.replace(/\.html$/i, "").replace(/^\//, "").replace(/\/$/, "");
    return path || "calculator";
  }

  // ---- Scrape the visible results panel into structured data ----
  function gatherResultData(container) {
    var data = {
      calcType: detectCalcType(),
      title: document.title.replace(/\s*\|.*$/, "").trim(),
      generatedAt: new Date(),
      total: null,
      totalLabel: null,
      breakdown: [],
      headline: null,
      meta: null,
      inputs: gatherInputs()
    };

    // Find the big "Estimated total" or equivalent
    var totalEls = container.querySelectorAll(".total-amount, .result-total, .estimate-total, [class*='total']");
    for (var i = 0; i < totalEls.length; i++) {
      var t = (totalEls[i].innerText || "").trim();
      var m = t.match(/\$[0-9][\d,]*/);
      if (m) {
        if (!data.total) {
          data.total = m[0];
          // Look at sibling/parent for label
          var p = totalEls[i].parentElement;
          if (p) {
            var labelEl = p.querySelector(".result-cap, .total-label, .stat-cap, [class*='label']");
            if (labelEl) data.totalLabel = labelEl.innerText.trim();
          }
        }
      }
    }

    // Headline / verdict
    var verdictEl = container.querySelector(".verdict, .headline, .result-headline, .estimate-headline");
    if (verdictEl) data.headline = verdictEl.innerText.trim();

    var noteEl = container.querySelector(".estimate-note, .result-note, .methodology-note");
    if (noteEl) data.meta = noteEl.innerText.trim();

    // Itemized table
    var table = container.querySelector(".result-table, .itemized-table, table");
    if (table) {
      var rows = table.querySelectorAll("tbody tr");
      for (var j = 0; j < rows.length; j++) {
        var cells = rows[j].querySelectorAll("td");
        if (cells.length >= 2) {
          var label = (cells[0].innerText || "").replace(/\s+/g, " ").trim();
          var amount = (cells[cells.length - 1].innerText || "").trim();
          if (label && amount) {
            data.breakdown.push({ label: label, amount: amount });
          }
        }
      }
    }

    return data;
  }

  function gatherInputs() {
    var inputs = {};
    var fields = document.querySelectorAll("input, select");
    for (var i = 0; i < fields.length; i++) {
      var el = fields[i];
      if (!el.id) continue;
      if (el.type === "hidden" || el.type === "submit" || el.type === "button") continue;
      if (el.type === "email") continue;     // PII: skip
      if (el.name === "company") continue;   // honeypot
      var label = "";
      var lblEl = document.querySelector('label[for="' + el.id + '"]');
      if (lblEl) label = (lblEl.innerText || "").replace(/\s+/g, " ").trim();
      var value = el.type === "checkbox" ? (el.checked ? "Yes" : "No")
                : el.type === "radio" ? (el.checked ? el.value : null)
                : el.value;
      if (value === null || value === "") continue;
      var key = label || el.id;
      if (el.type === "radio") {
        if (inputs[key] && value !== "Yes") continue;
        if (el.checked) inputs[key] = el.value;
      } else {
        inputs[key] = String(value);
      }
    }
    return inputs;
  }

  // ---- Build the PDF ----
  function buildPdf(jsPDF, data) {
    var doc = new jsPDF({ unit: "pt", format: "letter" });
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var margin = 48;
    var y = margin;

    // ---- Header bar ----
    doc.setFillColor.apply(doc, BRAND.primary);
    doc.rect(0, 0, pageW, 8, "F");
    y += 16;

    // ---- Brand title ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor.apply(doc, BRAND.ink);
    doc.text(BRAND.name, margin, y);

    // Right-aligned site URL on the same line as brand
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor.apply(doc, BRAND.muted);
    doc.text("https://" + BRAND.site + "/" + data.calcType, pageW - margin, y, { align: "right" });
    y += 16;

    // Tagline below brand, left-aligned
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor.apply(doc, BRAND.muted);
    doc.text(BRAND.tag, margin, y);
    y += 16;

    // Divider
    doc.setDrawColor.apply(doc, BRAND.muted);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 24;

    // ---- Page title ----
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor.apply(doc, BRAND.ink);
    doc.text(data.title || "Your Vacation Math Plan", margin, y);
    y += 14;

    // ---- Total (large, so reserve enough vertical room) ----
    if (data.total) {
      y += 32;  // reserve room ABOVE because the 36pt text is tall and y is baseline
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor.apply(doc, BRAND.primary);
      doc.text(data.total, margin, y);
      y += 6;
      if (data.totalLabel) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor.apply(doc, BRAND.muted);
        doc.text(String(data.totalLabel).toUpperCase(), margin, y + 12);
        y += 22;
      }
      y += 16;
    }

    // ---- Headline / verdict ----
    if (data.headline) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor.apply(doc, BRAND.ink);
      var headlineLines = doc.splitTextToSize(data.headline, pageW - margin * 2);
      doc.text(headlineLines, margin, y);
      y += headlineLines.length * 14 + 8;
    }

    // ---- Your scenario (inputs) ----
    var inputKeys = Object.keys(data.inputs || {});
    if (inputKeys.length) {
      y = ensureRoom(doc, y, pageH, margin, 60);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor.apply(doc, BRAND.ink);
      doc.text("YOUR SCENARIO", margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor.apply(doc, BRAND.muted);

      // Two-column input layout
      var colW = (pageW - margin * 2) / 2;
      var col = 0;
      var rowStart = y;
      inputKeys.forEach(function (k, i) {
        var x = margin + col * colW;
        var text = k + ": " + data.inputs[k];
        var lines = doc.splitTextToSize(text, colW - 12);
        doc.text(lines, x, y);
        y += lines.length * 12;
        if (i % 2 === 0 && i < inputKeys.length - 1) {
          // toggle column for next item
          col = (col + 1) % 2;
          if (col === 1) y = rowStart;
          else rowStart = y;
        } else if (col === 1) {
          col = 0;
          rowStart = y;
        }
      });
      y += 12;
    }

    // ---- Itemized breakdown ----
    if (data.breakdown && data.breakdown.length) {
      y = ensureRoom(doc, y, pageH, margin, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor.apply(doc, BRAND.ink);
      doc.text("ITEMIZED BREAKDOWN", margin, y);
      y += 14;

      // Table header
      doc.setFontSize(10);
      doc.setTextColor.apply(doc, BRAND.muted);
      doc.text("CATEGORY", margin, y);
      doc.text("AMOUNT", pageW - margin, y, { align: "right" });
      y += 6;
      doc.setDrawColor.apply(doc, BRAND.muted);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageW - margin, y);
      y += 12;

      doc.setFont("helvetica", "normal");
      doc.setTextColor.apply(doc, BRAND.ink);
      data.breakdown.forEach(function (item) {
        y = ensureRoom(doc, y, pageH, margin, 18);
        var labelLines = doc.splitTextToSize(item.label, pageW - margin * 2 - 80);
        doc.text(labelLines, margin, y);
        doc.text(item.amount, pageW - margin, y, { align: "right" });
        y += Math.max(labelLines.length * 12, 14);
      });
      y += 8;
    }

    // ---- Methodology note ----
    if (data.meta) {
      y = ensureRoom(doc, y, pageH, margin, 60);
      doc.setDrawColor.apply(doc, BRAND.muted);
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageW - margin, y);
      y += 14;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor.apply(doc, BRAND.muted);
      var metaLines = doc.splitTextToSize(data.meta, pageW - margin * 2);
      doc.text(metaLines, margin, y);
      y += metaLines.length * 11 + 8;
    }

    // ---- Footer on every page ----
    var pageCount = doc.internal.getNumberOfPages();
    for (var p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      var fy = pageH - 28;
      doc.setDrawColor.apply(doc, BRAND.muted);
      doc.setLineWidth(0.3);
      doc.line(margin, fy - 10, pageW - margin, fy - 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor.apply(doc, BRAND.muted);
      doc.text("Generated " + data.generatedAt.toLocaleDateString() +
               " · 2026 pricing data · estimates, not live quotes",
               margin, fy);
      doc.text(BRAND.site, pageW - margin, fy, { align: "right" });
    }

    return doc;
  }

  function ensureRoom(doc, y, pageH, margin, needed) {
    if (y + needed > pageH - 40) {
      doc.addPage();
      return margin;
    }
    return y;
  }

  // ---- Button rendering ----
  function buttonHtml() {
    return ''
      + '<div class="gd-wrap" role="region" aria-label="Download your plan as PDF">'
      +   '<div class="gd-wrap-row">'
      +     '<div>'
      +       '<p class="gd-label">Save this plan as a PDF</p>'
      +       '<p class="gd-sub">Personalized to your scenario — printable, shareable, no signup.</p>'
      +     '</div>'
      +     '<button type="button" class="gd-btn" data-gd-download>'
      +       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">'
      +         '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>'
      +         '<polyline points="7 10 12 15 17 10"/>'
      +         '<line x1="12" y1="15" x2="12" y2="3"/>'
      +       '</svg>'
      +       '<span>Download my plan as PDF</span>'
      +     '</button>'
      +   '</div>'
      +   '<p class="gd-status" data-gd-status></p>'
      + '</div>';
  }

  function render(container) {
    if (!container) return;
    if (container.querySelector(".gd-wrap")) return;

    var wrap = document.createElement("div");
    wrap.innerHTML = buttonHtml();
    var node = wrap.firstChild;
    container.appendChild(node);

    var btn = node.querySelector("[data-gd-download]");
    var status = node.querySelector("[data-gd-status]");

    btn.addEventListener("click", function () {
      handleDownload(container, btn, status);
    });
  }

  function setStatus(el, text, cls) {
    if (!el) return;
    el.textContent = text || "";
    el.className = "gd-status" + (cls ? " " + cls : "");
  }

  function handleDownload(container, btn, status) {
    btn.disabled = true;
    var originalText = btn.querySelector("span") ? btn.querySelector("span").textContent : "Download";
    btn.querySelector("span").textContent = "Building PDF…";
    setStatus(status, "");

    loadJsPDF()
      .then(function (jsPDF) {
        var data = gatherResultData(container);
        if (!data.total && !data.breakdown.length) {
          throw new Error("Couldn't read the results panel. Try recalculating.");
        }
        var doc = buildPdf(jsPDF, data);
        var fname = "vacationmath-" + data.calcType + "-" + ymd(data.generatedAt) + ".pdf";
        doc.save(fname);

        // Fire GA4 event
        if (typeof gtag === "function") {
          gtag("event", "pdf_download", {
            calc_type: data.calcType,
            file_name: fname,
            line_items: data.breakdown.length,
            has_total: !!data.total
          });
        }

        setStatus(status, "Saved as " + fname, "is-success");
      })
      .catch(function (err) {
        setStatus(status, "Couldn't build the PDF (" + (err.message || "unknown error") + "). You can still print this page.", "is-error");
        if (typeof gtag === "function") {
          gtag("event", "pdf_download_error", { error: err.message || "unknown" });
        }
      })
      .then(function () {
        btn.disabled = false;
        if (btn.querySelector("span")) btn.querySelector("span").textContent = originalText;
      });
  }

  function ymd(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var dd = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + dd;
  }

  // ---- Auto-mount: observe #results and inject button after results render ----
  function autoMount() {
    var resultsEl = document.getElementById("results")
                 || document.getElementById("tf-results")
                 || document.querySelector(".results");
    if (!resultsEl) return;

    // If results already populated at load, mount immediately
    if ((resultsEl.innerText || "").trim().length > 100) {
      render(resultsEl);
    }

    // Watch for renders / re-renders
    var obs = new MutationObserver(function () {
      if (!resultsEl.querySelector(".gd-wrap") &&
          (resultsEl.innerText || "").trim().length > 100) {
        render(resultsEl);
      }
    });
    obs.observe(resultsEl, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }

  global.VM_GuideDownload = { render: render, autoMount: autoMount };
})(window);
