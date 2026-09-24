"use client";

import {
  Globe2,
  LayoutTemplate,
  Megaphone,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function CorporateWebsitesPage() {
  return (
    <ServiceOfferingPage
      Icon={Globe2}
      title="Corporate Websites"
      summary="Brand sites, landing pages and business portals that convert."
      about="We craft corporate websites that look sharp and work hard — clear messaging, fast performance, SEO-ready structure and CMS-friendly content so your marketing team can ship updates without waiting on engineering."
      heroImage="/corporate.gif"
      heroFeatures={[
        { title: "Brand First", subtitle: "Visual identity online", icon: Sparkles },
        { title: "Landing Pages", subtitle: "Campaign-ready", icon: Megaphone },
        { title: "SEO Ready", subtitle: "Discoverable pages", icon: Search },
        { title: "CMS Friendly", subtitle: "Easy content updates", icon: LayoutTemplate },
      ]}
      offerings={[
        {
          title: "Brand Websites",
          desc: "Polished company sites that explain who you are and what you sell.",
          icon: Globe2,
        },
        {
          title: "Marketing Landings",
          desc: "High-converting pages for ads, launches and lead generation.",
          icon: Megaphone,
        },
        {
          title: "Business Portals",
          desc: "Secure areas for partners, vendors or customers.",
          icon: LayoutTemplate,
        },
        {
          title: "Performance & SEO",
          desc: "Fast loads, clean structure and metadata that search engines like.",
          icon: Search,
        },
        {
          title: "Design Systems",
          desc: "Reusable components so new pages stay on-brand.",
          icon: Sparkles,
        },
        {
          title: "Lead Capture",
          desc: "Forms, CTAs and CRM hooks that turn visitors into pipeline.",
          icon: Target,
        },
      ]}
      outcomes={[
        "A website that matches your brand — not a generic template",
        "Clear paths from visit to enquiry or demo",
        "Pages marketing can update without breaking the design",
        "Mobile-first experience across devices",
      ]}
    />
  );
}
