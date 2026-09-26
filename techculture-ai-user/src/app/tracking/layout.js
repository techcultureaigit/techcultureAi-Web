import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("tracking");

export default function Layout({ children }) {
  return children;
}
