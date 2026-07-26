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
