"use client";

import {
  ChartLine,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Wallet,
  WalletCards,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function MutualFundPage() {
  return (
    <ServiceOfferingPage
      Icon={ChartLine}
      title="Mutual Fund"
      summary="Invest, track and manage mutual fund portfolios with ease."
      about="We build mutual fund platforms for AMCs, distributors and fintech apps — scheme discovery, KYC-ready onboarding, SIP/lumpsum flows, portfolio tracking and statements that keep investors informed and compliant."
      heroImage="/mutual-fund.jpg"
      heroFeatures={[
        { title: "Schemes", subtitle: "Discover & compare", icon: PieChart },
        { title: "SIP & Invest", subtitle: "Lumpsum or systematic", icon: Wallet },
        { title: "Portfolio", subtitle: "Live holdings view", icon: ChartLine },
        { title: "Compliant", subtitle: "Audit-ready journeys", icon: ShieldCheck },
      ]}
      offerings={[
        {
          title: "Scheme Catalog",
          desc: "Browse, filter and compare funds with clear risk and return context.",
          icon: PieChart,
        },
        {
          title: "SIP & Lumpsum",
          desc: "Start, pause and modify investments with mandate-friendly flows.",
          icon: WalletCards,
        },
        {
          title: "Portfolio Dashboard",
          desc: "Holdings, gains, XIRR and allocation views for every investor.",
          icon: ChartLine,
        },
        {
          title: "Performance Insights",
          desc: "Charts and summaries that make fund performance easy to read.",
          icon: TrendingUp,
        },
        {
          title: "KYC & Onboarding",
          desc: "Connect digital KYC so new investors onboard without friction.",
          icon: ShieldCheck,
        },
        {
          title: "Statements & Reports",
          desc: "Downloadable statements and transaction history on demand.",
          icon: Wallet,
        },
      ]}
      outcomes={[
        "Faster investor onboarding with digital-first journeys",
        "Clear portfolio visibility that builds trust",
        "Web and mobile experiences for distributors and end users",
        "Architecture ready for scale across schemes and AUM growth",
      ]}
    />
  );
}
