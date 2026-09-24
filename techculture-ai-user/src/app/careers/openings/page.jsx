import { Suspense } from "react";
import CareersOpeningsPage from "./OpeningsClient";

export const metadata = {
  title: "Open Opportunities | TechCulture AI Careers",
  description:
    "Browse all open roles at TechCulture AI, review job descriptions, and apply with your resume.",
};

function OpeningsFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#fdfcfb] text-sm text-slate-500">
      Loading open roles…
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<OpeningsFallback />}>
      <CareersOpeningsPage />
    </Suspense>
  );
}
