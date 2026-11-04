(() => {
  "use strict";

  const storageKey = "studio-theme";
  const defaultTheme = "warm-paper";
  const themes = new Set(["warm-paper", "deep-dark", "clean-light", "rgb-pulse"]);
  const legacyThemes = {
    warm: "warm-paper",
    dark: "deep-dark",
    light: "clean-light",
    rgb: "rgb-pulse"
  };
  const browserColors = {
    "warm-paper": "#f6efe8",
    "deep-dark": "#171918",
    "clean-light": "#f6f8f6",
    "rgb-pulse": "#11141d"
  };

  let activeTheme = defaultTheme;
  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (themes.has(savedTheme)) {
      activeTheme = savedTheme;
    } else if (legacyThemes[savedTheme]) {
      activeTheme = legacyThemes[savedTheme];
    }
  } catch (error) {
    console.warn("Theme preference could not be read from browser storage.", error);
  }

  function updateThemeControls() {
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === activeTheme));
    });
  }

  function applyTheme(theme, persist = false) {
    if (!themes.has(theme)) return;

    activeTheme = theme;
    document.documentElement.dataset.theme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = browserColors[theme];

    updateThemeControls();

    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn("Theme preference could not be saved in browser storage.", error);
      }
    }
  }

  applyTheme(activeTheme);
  document.addEventListener("DOMContentLoaded", updateThemeControls, { once: true });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-choice]");
    if (button) {
      applyTheme(button.dataset.themeChoice, true);
      const menu = button.closest(".appearance-menu");
      if (menu) {
        menu.open = false;
        menu.querySelector("summary")?.focus({ preventScroll: true });
      }
      return;
    }

    document.querySelectorAll(".appearance-menu[open]").forEach((menu) => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const menu = document.querySelector(".appearance-menu[open]");
    if (!menu) return;
    menu.open = false;
    menu.querySelector("summary")?.focus({ preventScroll: true });
  });
})();
