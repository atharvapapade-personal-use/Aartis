/* =========================================================
   Ganpati Aarti Website — shared script
   Handles: hamburger menu, dark/light theme, font size (A+ / A-)
   Included on every page (index.html and every page in /Aartis)
   ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }

  /* ---------------------------------------------------------
     1) HAMBURGER MENU (off-canvas side nav)
     --------------------------------------------------------- */
  function initMenu() {
    var hamburgerBtn = $("#hamburgerBtn");
    var sideNav = $("#sideNav");
    var backdrop = $("#navBackdrop");
    var closeBtn = $("#closeNavBtn");

    if (!hamburgerBtn || !sideNav || !backdrop) return;

    function openMenu() {
      sideNav.classList.add("is-open");
      backdrop.classList.add("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      sideNav.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    hamburgerBtn.addEventListener("click", function () {
      var isOpen = sideNav.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    /* highlight the current page link */
    var links = sideNav.querySelectorAll("nav a[href]");
    var currentFile = location.pathname.split("/").pop() || "index.html";
    links.forEach(function (a) {
      var linkFile = a.getAttribute("href").split("/").pop();
      if (linkFile === currentFile) a.classList.add("active");
    });
  }

  /* ---------------------------------------------------------
     2) DARK / LIGHT MODE TOGGLE  (circular button, persisted)
     --------------------------------------------------------- */
  function initTheme() {
    var toggleBtn = $("#themeToggleBtn");
    var stored = localStorage.getItem("ganpati-theme");

    function applyTheme(theme) {
      if (theme === "dark") {
        root.setAttribute("data-theme", "dark");
        if (toggleBtn) toggleBtn.textContent = "☀️";
      } else {
        root.removeAttribute("data-theme");
        if (toggleBtn) toggleBtn.textContent = "🌙";
      }
    }

    applyTheme(stored === "dark" ? "dark" : "light");

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        var isDark = root.getAttribute("data-theme") === "dark";
        var next = isDark ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem("ganpati-theme", next);
      });
    }
  }

  /* ---------------------------------------------------------
     3) FONT SIZE CONTROLS (A+ / A-)
     - Default scale = 0 (normal size)
     - A+ (increase) always works, up to a max level
     - A- (decrease) is DISABLED until the user has increased
       the font at least once; it can only bring the size back
       down towards (but not below) the default
     --------------------------------------------------------- */
  function initFontSize() {
    var incBtn = $("#fontIncreaseBtn");
    var decBtn = $("#fontDecreaseBtn");
    if (!incBtn || !decBtn) return;

    var MIN_LEVEL = 0;   // default size — decrease button stops here
    var MAX_LEVEL = 4;   // cap so text never breaks the layout
    var STEP = 0.08;     // 8% per level

    var level = parseInt(localStorage.getItem("ganpati-font-level"), 10);
    if (isNaN(level) || level < MIN_LEVEL) level = MIN_LEVEL;
    if (level > MAX_LEVEL) level = MAX_LEVEL;

    function render() {
      root.style.setProperty("--font-scale", (1 + level * STEP).toFixed(2));
      decBtn.disabled = level <= MIN_LEVEL;   // stays OFF until user increases
      incBtn.disabled = level >= MAX_LEVEL;
      localStorage.setItem("ganpati-font-level", String(level));
    }

    incBtn.addEventListener("click", function () {
      if (level < MAX_LEVEL) level++;
      render();
    });
    decBtn.addEventListener("click", function () {
      if (level > MIN_LEVEL) level--;
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initTheme();
    initFontSize();
  });
})();
