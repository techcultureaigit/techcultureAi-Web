"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

/**
 * Loads a free Lottie JSON from /public/lottie and plays it inline.
 * Files are Lottie Simple License–friendly free assets saved locally.
 */
export default function LottieIcon({
  src,
  className = "",
  size = 40,
  loop = true,
}) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${src}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!data) {
    return (
      <span
        className={`inline-block shrink-0 rounded-full bg-[#fff0eb] ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={data}
        loop={loop}
        autoplay
        style={{ width: size, height: size }}
        rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
      />
    </span>
  );
}
