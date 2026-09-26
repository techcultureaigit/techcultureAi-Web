import { seoFromPageKey } from "@/lib/seo";

export const metadata = seoFromPageKey("careers-openings");

export default function Layout({ children }) {
  return children;
}
