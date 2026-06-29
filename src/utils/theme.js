// theme.js
//
// Runtime theme controller. Reads/writes the user's preferred theme from
// localStorage, falls back to the device color scheme when unset, and applies
// the result by setting `document.documentElement.dataset.theme`.
// Keep resolution order aligned with the inline script in public/index.html.
// All visual tokens live as CSS custom properties in theme.scss keyed off
// that data attribute.

const STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";

export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

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

export function getSystemTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

export function getInitialTheme() {
  return readStoredTheme() ?? getSystemTheme();
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
