"use client";

import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  FileSpreadsheet,
  UserPlus,
  Users,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function HrmsPage() {
  return (
    <ServiceOfferingPage
      Icon={Users}
      title="HRMS"
      summary="Simplify HR operations and workforce management."
      about="Our HRMS platforms help companies run hiring to exit in one place — employee records, attendance, leave, payroll-ready data and self-service portals that reduce paperwork for HR and managers alike."
      heroImage="/hrms.jpg"
      heroFeatures={[
        { title: "Employees", subtitle: "Central people data", icon: Users },
        { title: "Attendance", subtitle: "Shifts & check-ins", icon: Clock3 },
        { title: "Leave", subtitle: "Policies & approvals", icon: CalendarDays },
        { title: "Onboarding", subtitle: "Faster joining flow", icon: UserPlus },
      ]}
      offerings={[
        {
          title: "Employee Directory",
          desc: "Profiles, documents and org structure in one searchable system.",
          icon: Users,
        },
        {
          title: "Attendance & Shifts",
          desc: "Biometric / app punch, shifts and late/early tracking.",
          icon: Clock3,
        },
        {
          title: "Leave Management",
          desc: "Policies, balances, apply/approve workflows and calendars.",
          icon: CalendarDays,
        },
        {
          title: "Onboarding & Exit",
          desc: "Checklists, asset assignment and smooth joining/exit journeys.",
          icon: UserPlus,
        },
        {
          title: "Payroll-Ready Exports",
          desc: "Attendance and salary inputs your payroll process can use.",
          icon: FileSpreadsheet,
        },
        {
          title: "Self-Service Portal",
          desc: "Employees update details, apply leave and download letters.",
          icon: BadgeCheck,
        },
      ]}
      outcomes={[
        "Less manual chasing for attendance and leave approvals",
        "Clean employee records for audits and compliance",
        "Managers get visibility without Excel sprawl",
        "Scales from startups to multi-location enterprises",
      ]}
    />
  );
}
