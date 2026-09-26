import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("products");

export default function Layout({ children }) {
  return children;
}
