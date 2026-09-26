import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("mobile-applications");

export default function Layout({ children }) {
  return children;
}
