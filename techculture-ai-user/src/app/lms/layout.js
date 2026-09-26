import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("lms");

export default function Layout({ children }) {
  return children;
}
