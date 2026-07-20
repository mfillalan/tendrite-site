(function () {
  "use strict";

  var config = window.TENDRITE_CONFIG || {};
  var downloadConfig = config.downloads || {};
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      if (open) mobileNav.setAttribute("hidden", ""); else mobileNav.removeAttribute("hidden");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", function () { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); mobileNav.setAttribute("hidden", ""); }); });
  }
  var header = document.querySelector(".site-header");
  if (header) window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  document.querySelectorAll("[data-download]").forEach(function (link) {
    var url = downloadConfig[link.getAttribute("data-download")];
    if (url) link.setAttribute("href", url);
  });

  function loadPaddle() {
    if (window.Paddle) return Promise.resolve(window.Paddle);
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script"); script.src = "https://cdn.paddle.com/paddle/v2/paddle.js"; script.async = true;
      script.onload = function () { resolve(window.Paddle); }; script.onerror = reject; document.head.appendChild(script);
    });
  }

  function setCheckoutState(state, message) {
    document.querySelectorAll("[data-checkout-state]").forEach(function (el) { el.hidden = el.getAttribute("data-checkout-state") !== state; });
    document.querySelectorAll("[data-checkout-message]").forEach(function (el) { if (message) el.textContent = message; });
  }

  document.querySelectorAll("[data-paddle-checkout]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!config.paddle || !config.paddle.clientToken || !config.paddle.priceId) { setCheckoutState("unavailable"); return; }
      button.disabled = true; setCheckoutState("loading");
      loadPaddle().then(function (Paddle) {
        if (config.paddle.environment === "sandbox") Paddle.Environment.set("sandbox");
        Paddle.Initialize({ token: config.paddle.clientToken, eventCallback: function (event) {
          if (event && event.name === "checkout.completed") setCheckoutState("completed");
          if (event && event.name === "checkout.error") setCheckoutState("failure", "Paddle could not open checkout. Please try again.");
        }});
        Paddle.Checkout.open({ items: [{ priceId: config.paddle.priceId, quantity: 1 }] });
        setCheckoutState("ready");
      }).catch(function () { setCheckoutState("failure", "Checkout could not load. Check your connection and try again."); }).finally(function () { button.disabled = false; });
    });
  });
})();
