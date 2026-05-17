// theme.js
//
// Runtime theme controller. Reads/writes the user's preferred theme from
// localStorage, falls back to light by default, and applies the result by
// setting `document.documentElement.dataset.theme`.
// All visual tokens live as CSS custom properties in theme.scss keyed off
// that data attribute.

const STORAGE_KEY = "theme";
const INTRO_STORAGE_KEY = "themeIntroSeen";
const DEFAULT_THEME = "light";

export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

let introRunning = false;

function readStoredTheme() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === THEMES.LIGHT || stored === THEMES.DARK) {
      return stored;
    }
  } catch (err) {
    // localStorage may be unavailable (private mode, SSR). Fall through.
  }
  return null;
}

export function getInitialTheme() {
  return readStoredTheme() ?? DEFAULT_THEME;
}

export function applyTheme(theme, { persist = true } = {}) {
  const next = theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = next;
  }
  if (persist) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (err) {
      // Best-effort persistence; ignore quota or access errors.
    }
  }
  return next;
}

export function getCurrentTheme() {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.dataset.theme === THEMES.LIGHT
    ? THEMES.LIGHT
    : THEMES.DARK;
}

export function toggleTheme() {
  const next = getCurrentTheme() === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  return applyTheme(next);
}

export function shouldRunThemeIntro() {
  try {
    return !window.localStorage.getItem(INTRO_STORAGE_KEY);
  } catch (err) {
    return false;
  }
}

export function markThemeIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch (err) {
    // Ignore storage errors.
  }
}

/**
 * First-visit demo: crossfade to dark briefly, then settle on light.
 * Does not persist the intermediate dark theme.
 */
export function runThemeIntro() {
  if (introRunning || !shouldRunThemeIntro()) {
    return Promise.resolve();
  }

  introRunning = true;
  const html = document.documentElement;
  html.classList.add("theme-transitioning");

  return new Promise((resolve) => {
    window.setTimeout(() => {
      applyTheme(THEMES.DARK, { persist: false });
    }, 700);

    window.setTimeout(() => {
      applyTheme(THEMES.LIGHT, { persist: true });
      html.classList.remove("theme-transitioning");
      markThemeIntroSeen();
      introRunning = false;
      resolve();
    }, 1500);
  });
}
