"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  FileUp,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  sanitizeFullNameInput,
  sanitizePhoneInput,
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/lib/careers/validation";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  currentCompany: "",
  experienceYears: "",
  currentCtc: "",
  expectedCtc: "",
  noticePeriod: "",
  coverNote: "",
};

const STEPS = [
  { id: "contact", label: "Contact" },
  { id: "experience", label: "Experience" },
  { id: "resume", label: "Resume" },
];

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#2E3545] outline-none transition placeholder:text-slate-400 focus:border-[#FE602F] focus:ring-2 focus:ring-[#FE602F]/15";

const labelClass = "mb-1.5 block text-xs font-semibold text-[#2E3545]";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-orange-600">{message}</p>;
}

export default function JobApplyModal({ open, job, onClose }) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm(INITIAL_FORM);
      setResume(null);
      setErrors({});
      setSubmitting(false);
    }
  }, [open, job?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "phone") nextValue = sanitizePhoneInput(value);
    if (name === "fullName") nextValue = sanitizeFullNameInput(value);
    if (name === "email") nextValue = value.replace(/\s/g, "");

    setForm((prev) => ({ ...prev, [name]: nextValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    setResume(file);
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const validateStep = (currentStep) => {
    const next = {};

    if (currentStep === 0) {
      const nameError = validateFullName(form.fullName);
      const emailError = validateEmail(form.email);
      const phoneError = validatePhone(form.phone);
      if (nameError) next.fullName = nameError;
      if (emailError) next.email = emailError;
      if (phoneError) next.phone = phoneError;
    }

    if (currentStep === 1) {
      if (!form.experienceYears.trim()) {
        next.experienceYears = "Total experience is required.";
      }
      if (!form.currentCtc.trim()) next.currentCtc = "Current CTC is required.";
      if (!form.expectedCtc.trim()) next.expectedCtc = "Expected CTC is required.";
      if (!form.noticePeriod.trim()) {
        next.noticePeriod = "Notice period is required.";
      }
    }

    if (currentStep === 2) {
      if (!resume) next.resume = "Please upload your resume.";
      else if (resume.size > 5 * 1024 * 1024) {
        next.resume = "Resume must be 5 MB or smaller.";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!job || !validateStep(2)) return;

    setSubmitting(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      body.append("jobId", job.id);
      body.append("jobTitle", job.title);
      body.append("resume", resume);

      const response = await fetch("/api/careers/apply", {
        method: "POST",
        body,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit application.");
      }

      toast.success(data.message || "Application submitted.");
      onClose();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const isLastStep = step === STEPS.length - 1;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && job ? (
        <motion.div
          className="fixed inset-0 z-[1100] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close apply form"
            className="absolute inset-0 bg-[#2E3545]/55 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[min(560px,78vh)] sm:rounded-2xl"
          >
            <div className="shrink-0 border-b border-orange-50 bg-linear-to-br from-[#fff4ef] via-white to-[#f7f7f8] px-4 py-3 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#fff0eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#d9471b]">
                    <BriefcaseBusiness size={11} />
                    Apply · Step {step + 1}/{STEPS.length}
                  </div>
                  <h2
                    id={titleId}
                    className="truncate text-base font-semibold tracking-tight text-[#2E3545] sm:text-lg"
                  >
                    {job.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-200 p-1.5 text-slate-500 transition hover:border-[#FE602F]/40 hover:text-[#FE602F]"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {STEPS.map((item, index) => (
                  <div key={item.id} className="flex flex-1 flex-col gap-1">
                    <div
                      className={`h-1 rounded-full transition-colors ${
                        index <= step ? "bg-[#FE602F]" : "bg-slate-200"
                      }`}
                    />
                    <span
                      className={`text-[10px] font-semibold ${
                        index === step ? "text-[#FE602F]" : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {step === 0 && (
                      <>
                        <div>
                          <label htmlFor="apply-fullName" className={labelClass}>
                            Full name <span className="text-[#FE602F]">*</span>
                          </label>
                          <input
                            id="apply-fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="Your full name"
                            autoComplete="name"
                            inputMode="text"
                          />
                          <FieldError message={errors.fullName} />
                        </div>
                        <div>
                          <label htmlFor="apply-email" className={labelClass}>
                            Email <span className="text-[#FE602F]">*</span>
                          </label>
                          <input
                            id="apply-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="name@company.com"
                            autoComplete="email"
                          />
                          <FieldError message={errors.email} />
                        </div>
                        <div>
                          <label htmlFor="apply-phone" className={labelClass}>
                            Phone <span className="text-[#FE602F]">*</span>
                          </label>
                          <input
                            id="apply-phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={form.phone}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="10-digit mobile (6–9)"
                            autoComplete="tel"
                          />
                          <FieldError message={errors.phone} />
                        </div>
                        <div>
                          <label htmlFor="apply-location" className={labelClass}>
                            Current location
                          </label>
                          <input
                            id="apply-location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="City, State"
                          />
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <div>
                          <label
                            htmlFor="apply-experienceYears"
                            className={labelClass}
                          >
                            Total experience{" "}
                            <span className="text-[#FE602F]">*</span>
                          </label>
                          <input
                            id="apply-experienceYears"
                            name="experienceYears"
                            value={form.experienceYears}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="e.g. 3.5 years"
                          />
                          <FieldError message={errors.experienceYears} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="apply-currentCtc"
                              className={labelClass}
                            >
                              Current CTC{" "}
                              <span className="text-[#FE602F]">*</span>
                            </label>
                            <input
                              id="apply-currentCtc"
                              name="currentCtc"
                              value={form.currentCtc}
                              onChange={handleChange}
                              className={fieldClass}
                              placeholder="LPA"
                            />
                            <FieldError message={errors.currentCtc} />
                          </div>
                          <div>
                            <label
                              htmlFor="apply-expectedCtc"
                              className={labelClass}
                            >
                              Expected CTC{" "}
                              <span className="text-[#FE602F]">*</span>
                            </label>
                            <input
                              id="apply-expectedCtc"
                              name="expectedCtc"
                              value={form.expectedCtc}
                              onChange={handleChange}
                              className={fieldClass}
                              placeholder="LPA"
                            />
                            <FieldError message={errors.expectedCtc} />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="apply-noticePeriod"
                            className={labelClass}
                          >
                            Notice period{" "}
                            <span className="text-[#FE602F]">*</span>
                          </label>
                          <select
                            id="apply-noticePeriod"
                            name="noticePeriod"
                            value={form.noticePeriod}
                            onChange={handleChange}
                            className={fieldClass}
                          >
                            <option value="">Select</option>
                            <option value="Immediate">Immediate</option>
                            <option value="15 days">15 days</option>
                            <option value="30 days">30 days</option>
                            <option value="60 days">60 days</option>
                            <option value="90 days">90 days</option>
                          </select>
                          <FieldError message={errors.noticePeriod} />
                        </div>
                        <div>
                          <label
                            htmlFor="apply-currentCompany"
                            className={labelClass}
                          >
                            Current / last company
                          </label>
                          <input
                            id="apply-currentCompany"
                            name="currentCompany"
                            value={form.currentCompany}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <label htmlFor="apply-linkedIn" className={labelClass}>
                            LinkedIn / Portfolio
                          </label>
                          <input
                            id="apply-linkedIn"
                            name="linkedIn"
                            value={form.linkedIn}
                            onChange={handleChange}
                            className={fieldClass}
                            placeholder="https://"
                          />
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div>
                          <label htmlFor="apply-resume" className={labelClass}>
                            Resume upload{" "}
                            <span className="text-[#FE602F]">*</span>
                          </label>
                          <label
                            htmlFor="apply-resume"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-[#fafafa] px-3 py-4 text-center transition hover:border-[#FE602F]/50 hover:bg-[#fff7f4]"
                          >
                            <span className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0eb] text-[#FE602F]">
                              {resume ? <FileUp size={16} /> : <Upload size={16} />}
                            </span>
                            <span className="text-sm font-medium text-[#2E3545]">
                              {resume ? resume.name : "Upload PDF or DOC/DOCX"}
                            </span>
                            <span className="mt-0.5 text-[11px] text-slate-400">
                              Max size 5 MB
                            </span>
                            <input
                              id="apply-resume"
                              type="file"
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="sr-only"
                              onChange={handleResumeChange}
                            />
                          </label>
                          <FieldError message={errors.resume} />
                        </div>
                        <div>
                          <label htmlFor="apply-coverNote" className={labelClass}>
                            Cover note / additional details
                          </label>
                          <textarea
                            id="apply-coverNote"
                            name="coverNote"
                            rows={3}
                            value={form.coverNote}
                            onChange={handleChange}
                            className={`${fieldClass} min-h-20 resize-none`}
                            placeholder="Why you're a great fit (optional)"
                          />
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300"
                    >
                      <ArrowLeft size={15} />
                      Back
                    </button>
                  ) : null}

                  {isLastStep ? (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="brand-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Submit application"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goNext}
                      className="brand-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
                    >
                      Next
                      <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
