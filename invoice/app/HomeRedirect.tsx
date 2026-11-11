"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (getAuthUser()) {
      router.replace("/dashboard");
      return;
    }
    router.replace("/login");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        color: "#64748b",
        fontSize: 14,
      }}
    >
      Redirecting…
    </div>
  );
}
