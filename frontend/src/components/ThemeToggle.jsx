import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { getTheme, toggleTheme } from "../lib/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getTheme());
  useEffect(() => {
    const h = (e) => e.detail?.theme && setTheme(e.detail.theme);
    window.addEventListener("orbit:theme", h);
    return () => window.removeEventListener("orbit:theme", h);
  }, []);
  return (
    <button
      data-testid="theme-toggle"
      onClick={() => setTheme(toggleTheme())}
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="p-2 rounded-md min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
      style={{ color: "var(--text-muted)" }}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};

export default ThemeToggle;
