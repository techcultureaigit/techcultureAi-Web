"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const BookDemoContext = createContext(null);

export function BookDemoProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(null);

  const openBookDemo = useCallback((options) => {
    setDraft(options || null);
    setIsOpen(true);
  }, []);

  const closeBookDemo = useCallback(() => {
    setIsOpen(false);
    setDraft(null);
  }, []);

  const clearDraft = useCallback(() => setDraft(null), []);

  const value = useMemo(
    () => ({ isOpen, draft, openBookDemo, closeBookDemo, clearDraft }),
    [isOpen, draft, openBookDemo, closeBookDemo, clearDraft]
  );

  return (
    <BookDemoContext.Provider value={value}>{children}</BookDemoContext.Provider>
  );
}

export function useBookDemo() {
  const ctx = useContext(BookDemoContext);
  if (!ctx) {
    throw new Error("useBookDemo must be used within BookDemoProvider");
  }
  return ctx;
}
