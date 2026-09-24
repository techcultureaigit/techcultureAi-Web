"use client";

import {
  AppWindow,
  Bell,
  Fingerprint,
  Smartphone,
  TabletSmartphone,
  Zap,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function MobileApplicationsPage() {
  return (
    <ServiceOfferingPage
      Icon={Smartphone}
      title="Mobile Applications"
      summary="Native & cross-platform iOS and Android apps built for scale."
      about="From consumer apps to field-force tools, we build mobile products that feel fast and reliable — clean UX, secure auth, offline-aware flows and store-ready releases for iOS and Android."
      heroImage="/mobile.gif"
      heroFeatures={[
        { title: "iOS & Android", subtitle: "Both platforms", icon: Smartphone },
        { title: "Cross-Platform", subtitle: "One codebase option", icon: TabletSmartphone },
        { title: "Secure Auth", subtitle: "OTP, biometrics", icon: Fingerprint },
        { title: "Push Ready", subtitle: "Engagement alerts", icon: Bell },
      ]}
      offerings={[
        {
          title: "Consumer Apps",
          desc: "Polished apps for customers — onboarding, profiles and core journeys.",
          icon: Smartphone,
        },
        {
          title: "Business / Field Apps",
          desc: "Tools for teams on the move — attendance, tasks, KYC and more.",
          icon: AppWindow,
        },
        {
          title: "Cross-Platform Builds",
          desc: "React Native / Flutter options when speed and shared UI matter.",
          icon: TabletSmartphone,
        },
        {
          title: "Auth & Security",
          desc: "OTP, biometrics, session handling and secure API access.",
          icon: Fingerprint,
        },
        {
          title: "Push & Engagement",
          desc: "Notifications, deep links and retention-friendly flows.",
          icon: Bell,
        },
        {
          title: "Store Launch",
          desc: "Play Store & App Store packaging, reviews and release support.",
          icon: Zap,
        },
      ]}
      outcomes={[
        "Apps that feel native on both major platforms",
        "Stable releases with clear QA and crash monitoring hooks",
        "Backend and middleware integration from day one",
        "A roadmap from MVP to production scale",
      ]}
    />
  );
}
