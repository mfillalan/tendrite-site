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
      toggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      if (open) mobileNav.setAttribute("hidden", ""); else mobileNav.removeAttribute("hidden");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) { link.addEventListener("click", function () { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open navigation"); mobileNav.setAttribute("hidden", ""); }); });
  }
  var header = document.querySelector(".site-header");
  if (header) window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  document.querySelectorAll("[data-download]").forEach(function (link) {
    var url = downloadConfig[link.getAttribute("data-download")];
    if (url) link.setAttribute("href", url);
  });

  var paddleConfig = config.paddle || {};
  var paddleCheckoutButtons = document.querySelectorAll("[data-paddle-price]");
  var paddleCheckoutReady = false;

  function setPaddleCheckoutStatus(message, isError) {
    document.querySelectorAll("[data-paddle-status]").forEach(function (status) {
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    });
  }

  if (paddleCheckoutButtons.length) {
    if (!paddleConfig.clientToken || !paddleConfig.prices || !paddleConfig.prices.pro || !window.Paddle) {
      setPaddleCheckoutStatus("Secure checkout is temporarily unavailable. Please try again later or contact support.", true);
    } else {
      try {
        window.Paddle.Initialize({
          token: paddleConfig.clientToken,
          eventCallback: function (event) {
            if (event.name === "checkout.loaded") setPaddleCheckoutStatus("Secure checkout is ready.", false);
            if (event.name === "checkout.error" || event.name === "checkout.payment-error") {
              setPaddleCheckoutStatus("Checkout could not be completed. Please try again or contact support.", true);
            }
          }
        });
        paddleCheckoutReady = true;
        paddleCheckoutButtons.forEach(function (button) { button.disabled = false; });
        setPaddleCheckoutStatus("Secure checkout is ready.", false);
      } catch (error) {
        setPaddleCheckoutStatus("Secure checkout is temporarily unavailable. Please try again later or contact support.", true);
      }
    }

    paddleCheckoutButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var priceId = paddleConfig.prices[button.getAttribute("data-paddle-price")];
        if (!paddleCheckoutReady || !priceId) {
          setPaddleCheckoutStatus("Secure checkout is temporarily unavailable. Please try again later or contact support.", true);
          return;
        }
        try {
          window.Paddle.Checkout.open({
            items: [{ priceId: priceId, quantity: 1 }],
            settings: {
              variant: "one-page",
              successUrl: window.location.origin + "/pro/?checkout=complete"
            }
          });
        } catch (error) {
          setPaddleCheckoutStatus("Checkout could not be opened. Please try again or contact support.", true);
        }
      });
    });
  }

  var supportForm = document.querySelector("[data-support-form]");
  if (supportForm) {
    var supportStatus = supportForm.querySelector("[data-support-status]");
    supportForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(supportForm);
      var category = data.get("category") || "General question";
      var body = [
        "Tendrite support request",
        "",
        "Category: " + category,
        "Name: " + (data.get("name") || "Not provided"),
        "Reply email: " + (data.get("email") || "Not provided"),
        "Product or platform: " + (data.get("product") || "Not provided"),
        "Version or context: " + (data.get("context") || "Not provided"),
        "",
        "Request:",
        data.get("message") || ""
      ].join("\n");
      var mailto = "mailto:support@tendrite.dev?subject=" + encodeURIComponent("[" + category + "] Tendrite support request") + "&body=" + encodeURIComponent(body);
      if (supportStatus) {
        supportStatus.textContent = "Your email app should open with your request prepared. Review it, then send when ready.";
        supportStatus.classList.add("is-ready");
        supportStatus.focus();
      }
      window.location.href = mailto;
    });
  }

  var lightbox = document.querySelector("[data-image-lightbox]");
  var lightboxImage = lightbox && lightbox.querySelector("[data-lightbox-image]");
  var lightboxCaption = lightbox && lightbox.querySelector("[data-lightbox-caption]");
  var lightboxClose = lightbox && lightbox.querySelector("[data-lightbox-close]");
  var lastShot = null;

  function closeLightbox() {
    if (!lightbox || !lightbox.open) return;
    lightbox.close();
    if (lastShot) lastShot.focus();
  }

  function openLightbox(shot) {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    var image = shot.querySelector("img");
    var caption = shot.querySelector("figcaption strong");
    if (!image) return;
    lastShot = shot;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption ? caption.textContent : image.alt;
    lightbox.showModal();
    if (lightboxClose) lightboxClose.focus();
  }

  if (lightbox) {
    document.querySelectorAll(".product-shot").forEach(function (shot) {
      var image = shot.querySelector("img");
      if (!image) return;
      shot.tabIndex = 0;
      shot.setAttribute("role", "button");
      shot.setAttribute("aria-haspopup", "dialog");
      shot.setAttribute("aria-label", "View full-size image: " + image.alt);
      shot.addEventListener("click", function () { openLightbox(shot); });
      shot.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(shot);
        }
      });
    });
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) { if (event.target === lightbox) closeLightbox(); });
    lightbox.addEventListener("close", function () {
      if (lightboxImage) lightboxImage.removeAttribute("src");
    });
  }

})();
