import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("privacy-policy");

export default function Layout({ children }) {
  return children;
}
