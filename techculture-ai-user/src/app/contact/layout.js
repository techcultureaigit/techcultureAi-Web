import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("contact");

export default function Layout({ children }) {
  return children;
}
