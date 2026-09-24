import {
  DM_Sans,
  Figtree,
  IBM_Plex_Sans,
  Inter,
  Manrope,
  Outfit,
  Plus_Jakarta_Sans,
  Poppins,
  Sora,
  Source_Sans_3,
  Work_Sans,
} from "next/font/google";
import AppProviders from "@/providers/AppProviders";
import "./globals.css";
import "./globals1.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const fontVariables = [
  inter.variable,
  plusJakarta.variable,
  manrope.variable,
  dmSans.variable,
  outfit.variable,
  figtree.variable,
  poppins.variable,
  workSans.variable,
  sourceSans.variable,
  ibmPlex.variable,
  sora.variable,
].join(" ");

export const metadata = {
  title: "TechCulture AI | Web Development & Digital Solutions",
  description:
    "Scalable web, mobile, and AI-powered solutions — KYC, automation, middleware, and enterprise digital products.",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/favicons/manifest.webmanifest",
  appleWebApp: {
    title: "TechCulture AI",
  },
  themeColor: "#073b3a",
};

const fontBootstrapScript = `
(function () {
  try {
    var id = localStorage.getItem("techculture-font") || "source-sans";
    var map = {
      inter: "--font-inter",
      "plus-jakarta": "--font-plus-jakarta",
      manrope: "--font-manrope",
      "dm-sans": "--font-dm-sans",
      outfit: "--font-outfit",
      figtree: "--font-figtree",
      poppins: "--font-poppins",
      "work-sans": "--font-work-sans",
      "source-sans": "--font-source-sans",
      "ibm-plex": "--font-ibm-plex",
      sora: "--font-sora"
    };
    var cssVar = map[id] || "--font-source-sans";
    document.documentElement.setAttribute("data-font", id);
    document.documentElement.style.setProperty(
      "--font-app",
      "var(" + cssVar + "), system-ui, -apple-system, sans-serif"
    );
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      data-theme="tealOrange"
      data-font="source-sans"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: fontBootstrapScript }} />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
