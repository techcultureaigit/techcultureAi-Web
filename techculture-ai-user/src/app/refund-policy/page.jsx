"use client";

import LegalDocumentPage from "@/components/forWebDevelopment/LegalDocumentPage";
import { LEGAL_PAGES } from "@/lib/legal";

export default function RefundPolicyPage() {
  return <LegalDocumentPage doc={LEGAL_PAGES["refund-policy"]} />;
}
