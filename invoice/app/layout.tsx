import type { Metadata, Viewport } from "next";
import NotifyHost from "@/components/NotifyHost";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechCulture Finance | Invoice & Business Manager",
  description: "A simple, responsive finance workspace to manage invoices, customers, payments and expenses.",
  applicationName: "TechCulture Finance",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/techculture-logo.png", type: "image/png" }],
    apple: [{ url: "/techculture-logo.png", type: "image/png" }],
    shortcut: ["/techculture-logo.png"],
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "TC Finance" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#f97316", width: "device-width", initialScale: 1, maximumScale: 1 };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <NotifyHost />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));`,
          }}
        />
      </body>
    </html>
  );
}
