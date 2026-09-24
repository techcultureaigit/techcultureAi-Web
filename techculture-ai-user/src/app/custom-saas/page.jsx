"use client";

import {
  Building2,
  KeyRound,
  LayoutDashboard,
  Settings2,
  Users,
  Workflow,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function CustomSaasPage() {
  return (
    <ServiceOfferingPage
      Icon={LayoutDashboard}
      title="Custom SaaS & Portals"
      summary="Dashboards, admin panels and multi-tenant web platforms."
      about="We engineer SaaS products and internal portals around your workflows — role-based access, multi-tenant data models, analytics dashboards and admin tools that keep operations running smoothly."
      heroImage="/saas.gif"
      heroFeatures={[
        { title: "Dashboards", subtitle: "Live metrics & views", icon: LayoutDashboard },
        { title: "Multi-Tenant", subtitle: "Org-ready isolation", icon: Building2 },
        { title: "RBAC", subtitle: "Roles & permissions", icon: KeyRound },
        { title: "Workflows", subtitle: "Automate operations", icon: Workflow },
      ]}
      offerings={[
        {
          title: "Admin Panels",
          desc: "Manage users, content, configs and support from one place.",
          icon: Settings2,
        },
        {
          title: "Analytics Dashboards",
          desc: "Charts, filters and exports for founders and ops teams.",
          icon: LayoutDashboard,
        },
        {
          title: "Multi-Tenant Platforms",
          desc: "Org workspaces, billing hooks and data separation by design.",
          icon: Building2,
        },
        {
          title: "Role-Based Access",
          desc: "Fine-grained permissions for admins, agents and partners.",
          icon: KeyRound,
        },
        {
          title: "Team Collaboration",
          desc: "Assignments, comments and activity trails across modules.",
          icon: Users,
        },
        {
          title: "Workflow Automation",
          desc: "Approvals, escalations and integrations that cut manual work.",
          icon: Workflow,
        },
      ]}
      outcomes={[
        "A product architecture that grows with your customer base",
        "Clear separation between tenants, roles and sensitive data",
        "Admin experiences your internal teams will actually adopt",
        "APIs ready for mobile apps and partner integrations",
      ]}
    />
  );
}
