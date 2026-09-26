import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Tracking System",
  description:
    "Real-time tracking for logistics, assets, field teams and deliveries.",
  path: "/tracking-system",
  keywords: ["tracking", "logistics"],
  noIndex: true,
});

export default function TrackingSystemLayout({ children }) {
  return children;
}
