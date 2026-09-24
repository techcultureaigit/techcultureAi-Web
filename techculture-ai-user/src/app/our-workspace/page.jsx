"use client";

import WebDevInfoPage from "@/components/forWebDevelopment/WebDevInfoPage";
import { hubPages } from "@/lib/webdevelopment/catalog";
import { webdevHref } from "@/lib/webdevelopment/paths";

export default function OurWorkspaceInfoPage() {
  const page = hubPages["our-workspace"];
  return (
    <WebDevInfoPage
      title={page.title}
      summary={page.summary}
      about={page.about}
      highlights={page.highlights}
      productHref={page.productHref}
      ctaLabel={page.ctaLabel}
      relatedLinks={[
        { name: "About Us", href: webdevHref("/about") },
        { name: "Contact", href: webdevHref("/contact") },
      ]}
    />
  );
}
