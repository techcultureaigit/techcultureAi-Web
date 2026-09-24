"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SpotlightCard, { TEAL_SPOTLIGHT } from "@/components/SpotlightCard";

export default function WebDevCardGrid({ items = [], emptyText = "No items" }) {
  if (!items.length) {
    return <p className="text-sm text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <SpotlightCard
          key={item.slug || item.href}
          spotlightColor={TEAL_SPOTLIGHT}
          className="rounded-2xl border border-teal-100 bg-white shadow-sm transition-shadow hover:border-teal-300 hover:shadow-md hover:shadow-teal-500/10"
        >
          <Link href={item.href} className="group block p-5">
            <h3 className="mb-1.5 font-bold text-slate-900 transition-colors group-hover:text-teal-700">
              {item.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm leading-snug text-slate-500">
              {item.summary}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
              Read more
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        </SpotlightCard>
      ))}
    </div>
  );
}
