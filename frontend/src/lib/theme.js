// Orbit theme controller — dark by default, `.light` class toggles light mode.
const KEY = "orbit_theme";

export const getTheme = () => {
  try { return localStorage.getItem(KEY) === "light" ? "light" : "dark"; } catch { return "dark"; }
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "light") root.classList.add("light");
  else root.classList.remove("light");
  try { localStorage.setItem(KEY, theme); } catch {}
  window.dispatchEvent(new CustomEvent("orbit:theme", { detail: { theme } }));
};

export const toggleTheme = () => {
  const next = getTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  return next;
};

export const initTheme = () => applyTheme(getTheme());
