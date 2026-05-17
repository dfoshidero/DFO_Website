// theme.js
//
// Runtime theme controller. Reads/writes the user's preferred theme from
// localStorage, falls back to the OS-level prefers-color-scheme hint, and
// applies the result by setting `document.documentElement.dataset.theme`.
// All visual tokens live as CSS custom properties in theme.scss keyed off
// that data attribute.

const STORAGE_KEY = "theme";
const DEFAULT_THEME = "dark";

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

function readSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return DEFAULT_THEME;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? THEMES.LIGHT
    : THEMES.DARK;
}

export function getInitialTheme() {
  return readStoredTheme() ?? readSystemTheme();
}

export function applyTheme(theme) {
  const next = theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = next;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch (err) {
    // Best-effort persistence; ignore quota or access errors.
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
