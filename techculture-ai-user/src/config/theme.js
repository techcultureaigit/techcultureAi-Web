/**
 * TechCulture AI — Design System Theme
 */

export const themes = {
  tealOrange: {
    id: "tealOrange",
    name: "Forest & Fire",
    description: "Deep Teal + Orange — Premium Software Agency",
    colors: {
      primary: "#073B3A",
      primaryLight: "#0F5C58",
      primaryHover: "#0A4B48",
      accent: "#F97316",
      accentLight: "#FDBA74",
      accentLabel: "#D97706",
      background: "#FAF9F6",
      surface: "#FFFFFF",
      surfaceLight: "#F6F5F1",
      heroBg: "#F0FDFA",
      heading: "#1C2B2A",
      text: "#667085",
      textHero: "#5F6673",
      muted: "#98A2B3",
      border: "#E8E6E1",
      cardBorder: "#ECEAE5",
      buttonSecondaryBorder: "#9CA3AF",
    },
    gradient: {
      hero: "linear-gradient(90deg, #059669, #0D9488, #0F766E)",
      heading: "linear-gradient(90deg, #059669, #0D9488)",
      cta: "#FE602F",
    },
    shadow: {
      card: "0 10px 30px rgba(15, 40, 38, 0.06)",
      cardHover: "0 20px 40px rgba(15, 40, 38, 0.12)",
      navbar: "0 1px 0 rgba(15, 40, 38, 0.06)",
    },
    toast: {
      success: "#0F5C58",
      error: "#DC2626",
      info: "#F97316",
    },
  },
};

export const defaultThemeId = "tealOrange";

export const themeIds = Object.keys(themes);

export function getTheme(themeId) {
  return themes[themeId] ?? themes[defaultThemeId];
}

export function applyThemeToDocument(theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const { colors, gradient, shadow } = theme;

  root.setAttribute("data-theme", theme.id);

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${camelToKebab(key)}`, value);
  });

  root.style.setProperty("--gradient-hero", gradient.hero);
  root.style.setProperty("--gradient-heading", gradient.heading);
  root.style.setProperty("--gradient-cta", gradient.cta);
  root.style.setProperty("--shadow-card", shadow.card);
  root.style.setProperty("--shadow-card-hover", shadow.cardHover);
  root.style.setProperty("--shadow-navbar", shadow.navbar);
  root.style.setProperty("--toast-success", theme.toast.success);
  root.style.setProperty("--toast-error", theme.toast.error);
  root.style.setProperty("--toast-info", theme.toast.info);
}

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export const radius = {
  sm: "10px",
  md: "16px",
  lg: "20px",
  xl: "28px",
  full: "999px",
};
