import { Suspense } from "react";
import CareersOpeningsPage from "./OpeningsClient";

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
