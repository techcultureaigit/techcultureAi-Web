import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("about");

export default function Layout({ children }) {
  return children;
}
