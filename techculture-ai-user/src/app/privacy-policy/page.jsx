"use client";

import LegalDocumentPage from "@/components/forWebDevelopment/LegalDocumentPage";
import { LEGAL_PAGES } from "@/lib/legal";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      doc={LEGAL_PAGES["privacy-policy"]}
      heroImage="/privecy.png"
    />
  );
}
