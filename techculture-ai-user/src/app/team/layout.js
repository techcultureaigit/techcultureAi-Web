import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("team");

export default function Layout({ children }) {
  return children;
}
