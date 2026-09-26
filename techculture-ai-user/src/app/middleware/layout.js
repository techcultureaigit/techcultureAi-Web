import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("middleware");

export default function Layout({ children }) {
  return children;
}
