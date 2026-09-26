import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("mutual-fund");

export default function Layout({ children }) {
  return children;
}
