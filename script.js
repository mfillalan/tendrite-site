/* Dendrite Studio promo — light interactions only */

(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      if (open) {
        mobileNav.setAttribute("hidden", "");
      } else {
        mobileNav.removeAttribute("hidden");
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        mobileNav.setAttribute("hidden", "");
      });
    });
  }

  // Download button: no binary hosted yet — scroll to install + gentle note
  // Replace DOWNLOAD_URL when a real Setup.exe is available.
  var DOWNLOAD_URL = null; // e.g. "https://example.com/DendriteStudio-Setup.exe"

  document.querySelectorAll('a[href="#download"], a[href="#install"]').forEach(function (el) {
    // leave native anchor behavior for #install / #download anchors
  });

  var downloadBtn = document.getElementById("download-btn");
  if (downloadBtn && DOWNLOAD_URL) {
    downloadBtn.setAttribute("href", DOWNLOAD_URL);
    downloadBtn.setAttribute("download", "");
  }

  // Subtle header shadow on scroll
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.style.boxShadow = "0 8px 30px rgba(0,0,0,0.35)";
      } else {
        header.style.boxShadow = "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Footer year (keeps copyright current without hardcoding forever)
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
