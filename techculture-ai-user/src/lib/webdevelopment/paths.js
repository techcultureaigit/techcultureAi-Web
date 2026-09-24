/**
 * Subdomain-ready path helper for the Web Development microsite.
 *
 * Today:  WEBDEV_BASE_PATH = "/webdevelopment-ai"
 * Later:  set NEXT_PUBLIC_WEBDEV_BASE_PATH="" and point
 *         webdev.yourdomain.com → this app (rewrites optional).
 */
export const WEBDEV_BASE_PATH =
  process.env.NEXT_PUBLIC_WEBDEV_BASE_PATH ?? "";

/** Build an internal webdev microsite href, e.g. webdevHref("/products") */
export function webdevHref(path = "/") {
  const clean = !path || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (!WEBDEV_BASE_PATH) return clean;
  if (clean === "/") return WEBDEV_BASE_PATH;
  return `${WEBDEV_BASE_PATH}${clean}`;
}

/** Absolute product/service URLs that already exist on the main site */
export function mainSiteHref(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean;
}

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
