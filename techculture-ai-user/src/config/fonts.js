export const FONT_STORAGE_KEY = "techculture-font";
export const DEFAULT_FONT_ID = "source-sans";

export const fonts = [
  {
    id: "inter",
    label: "Inter",
    description: "Clean modern default",
    cssVar: "--font-inter",
  },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    description: "Premium SaaS look",
    cssVar: "--font-plus-jakarta",
  },
  {
    id: "manrope",
    label: "Manrope",
    description: "Geometric & balanced",
    cssVar: "--font-manrope",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    description: "Sharp fintech style",
    cssVar: "--font-dm-sans",
  },
  {
    id: "outfit",
    label: "Outfit",
    description: "Contemporary display",
    cssVar: "--font-outfit",
  },
  {
    id: "figtree",
    label: "Figtree",
    description: "Friendly professional",
    cssVar: "--font-figtree",
  },
  {
    id: "poppins",
    label: "Poppins",
    description: "Rounded & popular",
    cssVar: "--font-poppins",
  },
  {
    id: "work-sans",
    label: "Work Sans",
    description: "Corporate clarity",
    cssVar: "--font-work-sans",
  },
  {
    id: "source-sans",
    label: "Source Sans 3",
    description: "Editorial professional",
    cssVar: "--font-source-sans",
  },
  {
    id: "ibm-plex",
    label: "IBM Plex Sans",
    description: "Enterprise trusted",
    cssVar: "--font-ibm-plex",
  },
  {
    id: "sora",
    label: "Sora",
    description: "Modern tech feel",
    cssVar: "--font-sora",
  },
];

export function getFontById(id) {
  return (
    fonts.find((font) => font.id === id) ||
    fonts.find((font) => font.id === DEFAULT_FONT_ID) ||
    fonts[0]
  );
}

export function applyFontToDocument(fontId) {
  if (typeof document === "undefined") return;
  const font = getFontById(fontId);
  document.documentElement.setAttribute("data-font", font.id);
  document.documentElement.style.setProperty(
    "--font-app",
    `var(${font.cssVar}), system-ui, -apple-system, sans-serif`
  );
}
