import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("trading-applications");

export default function Layout({ children }) {
  return children;
}
