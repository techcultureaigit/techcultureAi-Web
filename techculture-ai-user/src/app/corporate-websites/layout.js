import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("corporate-websites");

export default function Layout({ children }) {
  return children;
}
