"use client";

import AppToaster from "@/components/ui/AppToaster";
import { SiteProvider } from "@/context/siteContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { FontProvider } from "@/context/FontContext";
import MyLayout from "@/app/MyLayout";

export default function AppProviders({ children }) {
  return (
    <SiteProvider>
      <ThemeProvider>
        <FontProvider>
          <MyLayout>{children}</MyLayout>
          <AppToaster />
        </FontProvider>
      </ThemeProvider>
    </SiteProvider>
  );
}
