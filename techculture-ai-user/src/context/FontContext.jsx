"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  applyFontToDocument,
  DEFAULT_FONT_ID,
  FONT_STORAGE_KEY,
  fonts,
  getFontById,
} from "@/config/fonts";

const FontContext = createContext(null);

export function FontProvider({ children }) {
  const [fontId, setFontIdState] = useState(DEFAULT_FONT_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FONT_STORAGE_KEY);
    const nextId = getFontById(stored || DEFAULT_FONT_ID).id;
    setFontIdState(nextId);
    applyFontToDocument(nextId);
    setMounted(true);
  }, []);

  const setFontId = useCallback((nextId) => {
    const font = getFontById(nextId);
    setFontIdState(font.id);
    applyFontToDocument(font.id);
    localStorage.setItem(FONT_STORAGE_KEY, font.id);
  }, []);

  const value = useMemo(
    () => ({
      fontId,
      font: getFontById(fontId),
      fonts,
      setFontId,
      mounted,
    }),
    [fontId, setFontId, mounted]
  );

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
}

export function useFont() {
  const ctx = useContext(FontContext);
  if (!ctx) {
    throw new Error("useFont must be used within FontProvider");
  }
  return ctx;
}
