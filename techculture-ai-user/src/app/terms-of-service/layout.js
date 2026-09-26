import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("terms-of-service");

export default function Layout({ children }) {
  return children;
}
