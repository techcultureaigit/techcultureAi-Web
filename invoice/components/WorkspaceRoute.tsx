"use client";

import { Suspense } from "react";
import WorkspacePage from "@/components/WorkspacePage";
import type { Section } from "@/lib/routes";

export default function WorkspaceRoute({ section }: { section: Section }) {
  return (
    <Suspense fallback={<div className="app-shell" style={{ padding: 24 }}>Loading workspace…</div>}>
      <WorkspacePage section={section} />
    </Suspense>
  );
}
