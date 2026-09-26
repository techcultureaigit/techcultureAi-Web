"use client";

import {
  Activity,
  BarChart3,
  Bell,
  CandlestickChart,
  LineChart,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function TradingApplicationsPage() {
  return (
    <ServiceOfferingPage
      Icon={CandlestickChart}
      title="Trading Applications"
      summary="Powerful trading solutions inspired by Zerodha & Groww."
      about="We build trading platforms for brokers and fintechs — live charts, order placement, portfolio views and watchlists that feel fast on web and mobile, with security and compliance built into every journey."
      heroImage="/fintech-growth-hero.png"
      heroFeatures={[
        { title: "Live Charts", subtitle: "Real-time market view", icon: CandlestickChart },
        { title: "Orders", subtitle: "Buy, sell & modify", icon: Zap },
        { title: "Portfolio", subtitle: "Holdings & P&L", icon: LineChart },
        { title: "Alerts", subtitle: "Price & order updates", icon: Bell },
      ]}
      offerings={[
        {
          title: "Trading Terminal",
          desc: "Clean order tickets, depth, and watchlists for active traders.",
          icon: CandlestickChart,
        },
        {
          title: "Live Market Data",
          desc: "Charts, quotes and indicators wired for low-latency updates.",
          icon: Activity,
        },
        {
          title: "Order Management",
          desc: "Place, modify and cancel orders with clear status tracking.",
          icon: Zap,
        },
        {
          title: "Portfolio & Positions",
          desc: "Holdings, open positions, margin and day P&L in one place.",
          icon: BarChart3,
        },
        {
          title: "Web & Mobile Apps",
          desc: "Consistent experience across desktop and smartphone trading.",
          icon: Smartphone,
        },
        {
          title: "Secure & Compliant",
          desc: "Auth, session controls and audit-friendly trade journeys.",
          icon: ShieldCheck,
        },
      ]}
      outcomes={[
        "Faster order flows that feel as smooth as leading retail brokers",
        "Real-time visibility into markets, positions and P&L",
        "Web and mobile apps your traders actually want to use",
        "Architecture ready for scale across segments and user growth",
      ]}
    />
  );
}
