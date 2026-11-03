import type { Metadata, Viewport } from "next";
import NotifyHost from "@/components/NotifyHost";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechCulture Finance | Invoice & Business Manager",
  description: "A simple, responsive finance workspace to manage invoices, customers, payments and expenses.",
  applicationName: "TechCulture Finance",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/favicons/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicons/favicon.ico"],
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
