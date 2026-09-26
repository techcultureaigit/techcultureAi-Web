import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("banking-fintech");

export default function Layout({ children }) {
  return children;
}
