import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("ecommerce");

export default function Layout({ children }) {
  return children;
}
