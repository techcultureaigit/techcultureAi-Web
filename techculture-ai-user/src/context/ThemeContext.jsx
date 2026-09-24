"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  applyThemeToDocument,
  defaultThemeId,
  getTheme,
  themes,
} from "@/config/theme";

const STORAGE_KEY = "techculture-theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const theme = getTheme(defaultThemeId);

  useEffect(() => {
    applyThemeToDocument(theme);
    localStorage.setItem(STORAGE_KEY, defaultThemeId);
    setMounted(true);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeId: defaultThemeId,
        setThemeId: () => {},
        toggleTheme: () => {},
        themes,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
