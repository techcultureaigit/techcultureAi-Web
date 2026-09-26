import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("hrms");

export default function Layout({ children }) {
  return children;
}
