"use client";

import {
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  PlayCircle,
  Users,
} from "lucide-react";
import ServiceOfferingPage from "@/components/forWebDevelopment/ServiceOfferingPage";

export default function LmsPage() {
  return (
    <ServiceOfferingPage
      Icon={GraduationCap}
      title="LMS"
      summary="Learning platforms for courses, assessments and progress tracking."
      about="We build Learning Management Systems for schools, enterprises and training providers — course catalogs, video lessons, quizzes, certificates and admin controls that make learning easy to deliver and measure."
      heroImage="/lms.png"
      heroFeatures={[
        { title: "Courses", subtitle: "Structured learning paths", icon: BookOpen },
        { title: "Assessments", subtitle: "Quizzes & assignments", icon: ClipboardCheck },
        { title: "Live & Video", subtitle: "Content that engages", icon: PlayCircle },
        { title: "Learners", subtitle: "Cohorts & roles", icon: Users },
      ]}
      offerings={[
        {
          title: "Course Builder",
          desc: "Modules, lessons, media and sequencing your trainers control.",
          icon: BookOpen,
        },
        {
          title: "Assessments & Quizzes",
          desc: "Auto-graded tests, assignments and pass criteria.",
          icon: ClipboardCheck,
        },
        {
          title: "Progress Tracking",
          desc: "Completion rates, scores and learner dashboards.",
          icon: GraduationCap,
        },
        {
          title: "Certificates",
          desc: "Branded certificates on course completion.",
          icon: Award,
        },
        {
          title: "Video Learning",
          desc: "Streaming-friendly lessons with resume and watch history.",
          icon: PlayCircle,
        },
        {
          title: "Admin & Cohorts",
          desc: "Batch enrolment, roles and reporting for institutes or HR.",
          icon: Users,
        },
      ]}
      outcomes={[
        "Launch training programs without spreadsheet chaos",
        "Clear visibility into who completed what — and who needs help",
        "Web and mobile access for learners on the go",
        "Scalable for hundreds or thousands of concurrent users",
      ]}
    />
  );
}
