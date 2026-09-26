import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("our-workspace");

export default function Layout({ children }) {
  return children;
}
