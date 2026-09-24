"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Search,
} from "lucide-react";
import JobApplyModal from "@/components/careers/JobApplyModal";
import JobDescriptionModal from "@/components/careers/JobDescriptionModal";
import { getJobById, jobOpenings } from "@/lib/careers/jobs";
import { webdevHref } from "@/lib/webdevelopment/paths";

export default function CareersOpeningsPage() {
  const reduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jdOpen, setJdOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  const departments = useMemo(
    () => ["All", ...new Set(jobOpenings.map((job) => job.department))],
    []
  );

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobOpenings.filter((job) => {
      const matchesDepartment =
        department === "All" || job.department === department;
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.stack.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.summary.toLowerCase().includes(q);
      return matchesDepartment && matchesQuery;
    });
  }, [query, department]);

  const openJd = useCallback((job) => {
    setSelectedJob(job);
    setJdOpen(true);
    setApplyOpen(false);
  }, []);

  const openApply = useCallback((job) => {
    setSelectedJob(job);
    setApplyOpen(true);
    setJdOpen(false);
  }, []);

  useEffect(() => {
    const jobId = searchParams.get("job");
    const shouldApply = searchParams.get("apply") === "1";
    if (!jobId) return;
    const job = getJobById(jobId);
    if (!job) return;
    if (shouldApply) openApply(job);
    else openJd(job);
  }, [searchParams, openApply, openJd]);

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#2E3545]">
      <section className="container mx-auto px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href={webdevHref("/careers")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#FE602F]"
        >
          <ArrowLeft size={15} />
          Back to Careers
        </Link>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by role, stack, or location"
              className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#FE602F] focus:ring-2 focus:ring-[#FE602F]/15"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDepartment(item)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  department === item
                    ? "bg-[#FE602F] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-[#FE602F]/40"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(46,53,69,0.06)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#f7f7f8] text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Role</th>
                  <th className="hidden px-4 py-4 md:table-cell">Department</th>
                  <th className="hidden px-4 py-4 lg:table-cell">Location</th>
                  <th className="hidden px-4 py-4 sm:table-cell">Experience</th>
                  <th className="hidden px-4 py-4 xl:table-cell">Type</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No roles match your search. Try another keyword or
                      department.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job, index) => (
                    <motion.tr
                      key={job.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.03 }}
                      className="border-t border-slate-100 transition hover:bg-[#fff8f5]"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#2E3545]">
                          {job.title}
                        </div>
                        <div className="mt-1 text-xs font-medium text-[#FE602F]">
                          {job.stack}
                        </div>
                        <div className="mt-2 text-xs text-slate-500 md:hidden">
                          {job.department} · {job.experience}
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 text-slate-600 md:table-cell">
                        {job.department}
                      </td>
                      <td className="hidden px-4 py-4 text-slate-600 lg:table-cell">
                        {job.location}
                      </td>
                      <td className="hidden px-4 py-4 text-slate-600 sm:table-cell">
                        {job.experience}
                      </td>
                      <td className="hidden px-4 py-4 xl:table-cell">
                        <span className="rounded-full bg-[#fff0eb] px-2.5 py-1 text-xs font-semibold text-[#d9471b]">
                          {job.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openJd(job)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#2E3545]/30 hover:text-[#2E3545]"
                          >
                            <Eye size={14} />
                            View JD
                          </button>
                          <button
                            type="button"
                            onClick={() => openApply(job)}
                            className="brand-cta-gradient inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
                          >
                            Apply
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <JobDescriptionModal
        open={jdOpen}
        job={selectedJob}
        onClose={() => setJdOpen(false)}
        onApply={openApply}
      />
      <JobApplyModal
        open={applyOpen}
        job={selectedJob}
        onClose={() => setApplyOpen(false)}
      />
    </div>
  );
}
