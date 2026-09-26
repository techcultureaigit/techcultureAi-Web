import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("cookie-policy");

export default function Layout({ children }) {
  return children;
}
