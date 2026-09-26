import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("gis");

export default function Layout({ children }) {
  return children;
}
