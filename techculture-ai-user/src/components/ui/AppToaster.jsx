"use client";

import { Toaster } from "react-hot-toast";
import { radius } from "@/config/theme";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerClassName="!top-20"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--theme-surface)",
          color: "var(--theme-heading)",
          border: "1px solid var(--theme-border)",
          borderRadius: radius.md,
          padding: "14px 18px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "var(--shadow-card)",
          maxWidth: "380px",
        },
        success: {
          iconTheme: {
            primary: "var(--toast-success)",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--toast-error)",
            secondary: "#FFFFFF",
          },
        },
        loading: {
          iconTheme: {
            primary: "var(--toast-info)",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}
