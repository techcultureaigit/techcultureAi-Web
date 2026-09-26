import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("blog");

export default function Layout({ children }) {
  return children;
}
