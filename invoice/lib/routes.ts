export type Section =
  | "Dashboard"
  | "Invoices"
  | "Customers"
  | "Payments"
  | "Received"
  | "Reports"
  | "Settings";

export const SECTION_ROUTES: Record<Section, string> = {
  Dashboard: "/dashboard",
  Invoices: "/invoices",
  Customers: "/customers",
  Payments: "/payments",
  Received: "/received",
  Reports: "/reports",
  Settings: "/settings",
};

export const NAV_ITEMS: { name: Section; href: string }[] = [
  { name: "Dashboard", href: SECTION_ROUTES.Dashboard },
  { name: "Invoices", href: SECTION_ROUTES.Invoices },
  { name: "Customers", href: SECTION_ROUTES.Customers },
  { name: "Received", href: SECTION_ROUTES.Received },
  { name: "Reports", href: SECTION_ROUTES.Reports },
  { name: "Settings", href: SECTION_ROUTES.Settings },
];

export function sectionFromPath(pathname: string): Section | null {
  const match = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.name || null;
}

export function routeForSection(section: Section, query?: string) {
  const base = SECTION_ROUTES[section];
  if (!query) return base;
  return `${base}?q=${encodeURIComponent(query)}`;
}
