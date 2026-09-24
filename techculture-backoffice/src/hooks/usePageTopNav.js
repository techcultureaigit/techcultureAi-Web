import { useEffect } from "react";
import { useTopNav } from "../context/TopNavContext";

/** Push page title/actions into the sticky TopNav, then clear on unmount */
export function usePageTopNav({ eyebrow, title, subtitle, actions }) {
  const { setTopNav, clearTopNav } = useTopNav();

  useEffect(() => {
    setTopNav({ eyebrow, title, subtitle, actions });
  }, [eyebrow, title, subtitle, actions, setTopNav]);

  useEffect(() => () => clearTopNav(), [clearTopNav]);
}
