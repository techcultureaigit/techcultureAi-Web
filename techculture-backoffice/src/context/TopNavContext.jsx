import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TopNavContext = createContext(null);

export function TopNavProvider({ children }) {
  const [config, setConfigState] = useState({
    eyebrow: "",
    title: "",
    subtitle: "",
    actions: null,
  });

  const setTopNav = useCallback((next) => {
    setConfigState((prev) => ({
      eyebrow: next.eyebrow ?? prev.eyebrow,
      title: next.title ?? prev.title,
      subtitle: next.subtitle ?? "",
      actions: next.actions !== undefined ? next.actions : prev.actions,
    }));
  }, []);

  const clearTopNav = useCallback(() => {
    setConfigState({ eyebrow: "", title: "", subtitle: "", actions: null });
  }, []);

  const value = useMemo(
    () => ({ ...config, setTopNav, clearTopNav }),
    [config, setTopNav, clearTopNav]
  );

  return <TopNavContext.Provider value={value}>{children}</TopNavContext.Provider>;
}

export function useTopNav() {
  const ctx = useContext(TopNavContext);
  if (!ctx) throw new Error("useTopNav must be used within TopNavProvider");
  return ctx;
}
