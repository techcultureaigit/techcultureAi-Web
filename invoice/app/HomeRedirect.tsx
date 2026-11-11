"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, verifyAuthSession } from "@/lib/auth";

export default function HomeRedirect() {
  const router = useRouter();
  const [message, setMessage] = useState("Checking session…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const local = getAuthUser();
      if (!local) {
        setMessage("Redirecting to login…");
        router.replace("/login");
        return;
      }

      setMessage("Verifying session…");
      const verified = await verifyAuthSession();
      if (cancelled) return;

      if (verified) {
        setMessage("Redirecting to dashboard…");
        router.replace("/dashboard");
        return;
      }

      setMessage("Redirecting to login…");
      router.replace("/login");
    })();

    return () => {
      cancelled = true;
    };
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
      {message}
    </div>
  );
}
