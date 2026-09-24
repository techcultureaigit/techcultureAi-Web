"use client";

import BookDemoPopup from "@/components/BookDemoPopup";
import Footer from "@/components/forWebDevelopment/Footer";
import Header from "@/components/Header";
import AutoScrollReveal from "@/components/AutoScrollReveal";
import WhatsAppChat from "@/components/whatsappChat";
import { BookDemoProvider } from "@/context/BookDemoContext";
import { useTheme } from "@/context/ThemeContext";

export default function MyLayout({ children }) {
  const { themeId } = useTheme();

  return (
    <BookDemoProvider>
      <div
        className="theme-root flex min-h-screen flex-col"
        data-theme={themeId}
      >
        <Header />
        <main className="theme-main w-full flex-1 pt-20">{children}</main>
        <Footer />
        <BookDemoPopup />
        <WhatsAppChat />
        <AutoScrollReveal />
      </div>
    </BookDemoProvider>
  );
}
