(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  var SUBSCRIBE_URL = "/subscribe"; // Cloudflare Worker route on vacationmath.co

  function setMsg(form, kind, text) {
    var msg = form.querySelector(".form-msg");
    if (!msg) return;
    msg.classList.remove("error", "success");
    if (kind) msg.classList.add(kind);
    msg.textContent = text || "";
  }

  function injectHoneypot(form) {
    // Bot-bait: hidden field named "company". Real users never fill it.
    // Already injected? skip.
    if (form.querySelector('input[name="company"]')) return;
    var hp = document.createElement("input");
    hp.type = "text";
    hp.name = "company";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText =
      "position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden;";
    form.appendChild(hp);
  }

  function showSuccess(form) {
    var wrap = document.createElement("div");
    wrap.className = "form-success";
    wrap.setAttribute("role", "status");
    var center = form.classList.contains("capture-final") ? "auto" : "0";
    wrap.style.cssText =
      "padding:18px 20px;border-radius:14px;" +
      "background:rgba(230,163,64,0.15);" +
      "border:1.5px solid rgba(230,163,64,0.4);" +
      "color:inherit;font-weight:600;max-width:540px;" +
      "margin-left:" + center + ";margin-right:" + center + ";";
    wrap.innerHTML =
      "<div style=\"font-size:1.05rem;margin-bottom:6px;\">You\u2019re in. Check your inbox.</div>" +
      "<div style=\"font-weight:500;font-size:0.95rem;opacity:0.85;\">" +
      "We just sent your Starter Pack PDF. First Tuesday brief lands next week." +
      "</div>";
    form.replaceWith(wrap);
  }

  function submitForm(form, e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector("button[type=submit]");
    var hp = form.querySelector('input[name="company"]');
    var email = (input && input.value || "").trim();
    var source = form.getAttribute("data-source") || "unknown";
    var honeypot = (hp && hp.value || "").trim();

    if (!EMAIL_RE.test(email)) {
      setMsg(form, "error", "Please enter a valid email address.");
      if (input) input.focus();
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = "Sending\u2026";
    }
    setMsg(form, "", "");

    fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, source: source, company: honeypot }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { status: res.status, data: data };
        }).catch(function () {
          return { status: res.status, data: {} };
        });
      })
      .then(function (result) {
        if (result.status >= 200 && result.status < 300 && result.data && result.data.ok) {
          showSuccess(form);
          return;
        }
        var err = (result.data && result.data.error) || "";
        var msg = "Something went wrong. Please try again in a moment.";
        if (err === "invalid_email") msg = "That email doesn\u2019t look right. Please check and retry.";
        setMsg(form, "error", msg);
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.originalText || "Send it to me";
        }
      })
      .catch(function () {
        setMsg(form, "error", "Network error. Please try again.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.originalText || "Send it to me";
        }
      });
  }

  document.querySelectorAll("form.capture").forEach(function (form) {
    injectHoneypot(form);
    form.addEventListener("submit", function (e) { submitForm(form, e); });
  });
})();

// ============ Sticky CTA Bar (homepage only) ============
(function() {
  var bar = document.getElementById("sticky-cta");
  var closeBtn = document.getElementById("sticky-close");
  if (!bar) return;

  var dismissed = false;
  var hero = document.querySelector(".hero");

  function checkScroll() {
    if (dismissed || !hero) return;
    var threshold = hero.offsetHeight * 0.85;
    if (window.scrollY > threshold) {
      bar.classList.add("visible");
      bar.removeAttribute("aria-hidden");
    } else {
      bar.classList.remove("visible");
      bar.setAttribute("aria-hidden", "true");
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });

  if (closeBtn) {
    closeBtn.addEventListener("click", function() {
      dismissed = true;
      bar.classList.remove("visible");
      bar.setAttribute("aria-hidden", "true");
    });
  }
})();
