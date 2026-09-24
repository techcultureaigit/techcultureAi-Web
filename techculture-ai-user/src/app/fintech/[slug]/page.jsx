"use client";

import { useParams } from "next/navigation";
import WebDevInfoPage from "@/components/forWebDevelopment/WebDevInfoPage";
import AccountClosurePage from "@/components/forWebDevelopment/products/AccountClosurePage";
import AadhaarVerificationPage from "@/components/forWebDevelopment/products/AadhaarVerificationPage";
import BusinessKycPage from "@/components/forWebDevelopment/products/BusinessKycPage";
import DigitalKycPage from "@/components/forWebDevelopment/products/DigitalKycPage";
import ReKycPage from "@/components/forWebDevelopment/products/ReKycPage";
import OnlineIpoBiddingPage from "@/components/forWebDevelopment/products/OnlineIpoBiddingPage";
import { getProductBySlug } from "@/lib/webdevelopment/catalog";
import { webdevHref } from "@/lib/webdevelopment/paths";

const CUSTOM_PRODUCT_PAGES = {
  "aadhaar-verification": AadhaarVerificationPage,
  "digital-kyc": DigitalKycPage,
  "business-kyc": BusinessKycPage,
  "account-closure": AccountClosurePage,
  "re-kyc": ReKycPage,
  "online-ipo-bidding": OnlineIpoBiddingPage,
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const CustomPage = CUSTOM_PRODUCT_PAGES[slug];
  if (CustomPage) return <CustomPage />;

  const page = getProductBySlug(slug);

  if (!page) {
    return (
      <WebDevInfoPage
        title="Product not found"
        summary="This product page does not exist yet."
        about="Please go back to the products catalogue and pick another item."
        productHref={webdevHref("/fintech")}
        ctaLabel="View all Fintech"
        backHref={webdevHref("/fintech")}
        backLabel="Back to Fintech"
      />
    );
  }

  return (
    <WebDevInfoPage
      title={page.title}
      summary={page.summary}
      about={page.about}
      highlights={page.highlights}
      productHref={page.productHref}
      ctaLabel={page.ctaLabel}
      backHref={webdevHref("/fintech")}
      backLabel="Back to Fintech"
      relatedLinks={[
        { name: "All Fintech", href: webdevHref("/fintech") },
        { name: "Contact", href: webdevHref("/contact") },
      ]}
    />
  );
}
