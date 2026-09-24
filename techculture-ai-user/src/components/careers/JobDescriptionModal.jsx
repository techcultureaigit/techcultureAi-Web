"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  X,
} from "lucide-react";

export default function JobDescriptionModal({ open, job, onClose, onApply }) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && job ? (
        <motion.div
          className="fixed inset-0 z-[1100] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close job description"
            className="absolute inset-0 bg-[#2E3545]/55 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[min(88vh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-orange-50 bg-linear-to-br from-[#fff4ef] via-white to-[#f7f7f8] px-5 py-5 sm:px-6">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#fff0eb] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#d9471b]">
                  <BriefcaseBusiness size={12} />
                  Job description
                </div>
                <h2
                  id={titleId}
                  className="text-2xl font-semibold tracking-tight text-[#2E3545]"
                >
                  {job.title}
                </h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-[#FE602F]">
                  {job.stack}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <BriefcaseBusiness size={13} className="text-[#FE602F]" />
                    {job.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#FE602F]" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} className="text-[#FE602F]" />
                    {job.experience} · {job.type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-[#FE602F]/40 hover:text-[#FE602F]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
              <p className="text-sm leading-7 text-slate-600">{job.summary}</p>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3545]">
                  Responsibilities
                </h3>
                <ul className="mt-3 space-y-2">
                  {job.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FE602F]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3545]">
                  Requirements
                </h3>
                <ul className="mt-3 space-y-2">
                  {job.requirements.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E3545]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {job.niceToHave?.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#2E3545]">
                    Nice to have
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {job.niceToHave.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm leading-6 text-slate-600"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onApply(job)}
                className="brand-cta-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Apply for this role
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
