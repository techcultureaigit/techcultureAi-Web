import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("careers");

export default function Layout({ children }) {
  return children;
}
