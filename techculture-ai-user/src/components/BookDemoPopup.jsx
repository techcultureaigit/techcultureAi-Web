"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  IoCallOutline,
  IoCheckmark,
  IoChevronBack,
  IoChevronForward,
  IoClose,
  IoGlobeOutline,
  IoMailOutline,
  IoOpenOutline,
  IoTimeOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { useBookDemo } from "@/context/BookDemoContext";
import { useSite } from "@/context/siteContext";
import { toast } from "react-hot-toast";

const TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const INITIAL_FORM = {
  fullName: "",
  workEmail: "",
  phone: "",
  company: "",
  location: "",
  message: "",
};

const TEAM_EMAIL = "info@techculture.ai";
const LOGO_SRC = "/tc-new-logo-2.png";
const DEMO_HOST = {
  name: "Manoj Rawat",
  role: "Chief Operating Officer (COO)",
  imageUrl:
    "https://res.cloudinary.com/dakf05m4x/image/upload/v1782307274/ourTeams/manojrphoto-589bb0c3-9f3a-48cb-8467-0d5125a3fc53.png",
};
const PROJECT_FONT =
  "var(--font-app), var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const popupFontClass = "font-sans antialiased";
const popupFontStyle = { fontFamily: PROJECT_FONT };

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toDateValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isSelectableDate(date, today = startOfDay(new Date())) {
  const d = startOfDay(date);
  return d > today && !isWeekend(d);
}

function buildMonthCells(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(viewYear, viewMonth, day));
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }
  return cells;
}

function firstName(fullName = "") {
  const part = fullName.trim().split(/\s+/)[0];
  return part || "there";
}

function parseSlotToHoursMinutes(slot) {
  const match = String(slot).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hours: 10, minutes: 0 };
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function getDemoDateTime(dateValue, timeSlot) {
  const { hours, minutes } = parseSlotToHoursMinutes(timeSlot);
  const date = new Date(`${dateValue}T00:00:00`);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatWhenLabel(dateValue, timeSlot) {
  if (!dateValue || !timeSlot) return "";
  const date = getDemoDateTime(dateValue, timeSlot);
  const datePart = date.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${datePart}, ${timeSlot} IST`;
}

function toGoogleCalendarUtcStamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildGoogleCalendarUrl({ fullName, workEmail, dateValue, timeSlot }) {
  const start = getDemoDateTime(dateValue, timeSlot);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "TechCulture AI — 30 Minute Demo",
    dates: `${toGoogleCalendarUtcStamp(start)}/${toGoogleCalendarUtcStamp(end)}`,
    details: `Demo with TechCulture AI for ${fullName} (${workEmail}). Google Meet link will be shared by email.`,
    location: "Google Meet",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email).trim());
}

/** Exactly 10-digit Indian mobile, digits only */
function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(String(phone).trim());
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-sans";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700 font-sans";

function SuccessStep({ form, selectedDate, selectedTime, booking, onClose }) {
  const whenLabel = formatWhenLabel(selectedDate, selectedTime);
  const meetLink = booking?.meetLink || null;
  const calendarLink =
    booking?.calendarLink ||
    buildGoogleCalendarUrl({
      fullName: form.fullName,
      workEmail: form.workEmail,
      dateValue: selectedDate,
      timeSlot: selectedTime,
    });

  return (
    <div
      className={`relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 ${popupFontClass}`}
      style={popupFontStyle}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-800">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          Book a Demo · 30 Min
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          aria-label="Close"
        >
          <IoClose size={16} />
        </button>
      </div>

      <div className="px-6 pb-6 pt-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/30">
          <IoCheckmark size={34} className="text-white" />
        </div>

        <h2
          id="book-demo-success-title"
          className="text-2xl font-bold tracking-tight text-[#1c2b2a] sm:text-[1.65rem]"
        >
          Booked — see you then.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
          Calendar invite + Meet link sent to{" "}
          <span className="font-semibold text-slate-800">{form.workEmail}</span>.
          We&apos;ve blocked off the slot on our end too.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            When
          </p>
          <p className="mt-1 text-base font-bold text-[#1c2b2a]">{whenLabel}</p>
          {meetLink && (
            <p className="mt-2 break-all text-xs text-teal-700">{meetLink}</p>
          )}
        </div>

        <div className="mt-5 space-y-2.5">
          {meetLink ? (
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="brand-cta-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold !text-white"
            >
              Join Meet now
              <IoOpenOutline size={16} className="text-white" />
            </a>
          ) : (
            <div className="rounded-full bg-teal-50 px-5 py-3.5 text-sm font-semibold text-teal-800">
              Meet link is in your calendar invite email
            </div>
          )}
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Open in Google Calendar
          </a>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-sm font-medium text-slate-400 transition hover:text-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ScheduleStep({
  panel = "schedule",
  selectedDate,
  selectedTime,
  whenLabel,
  form,
  fieldErrors,
  onSelectDate,
  onSelectTime,
  onConfirmSchedule,
  onChangeForm,
  onSubmitDetails,
  onBackToCalendar,
  onClose,
  scheduleError,
  contactPhone,
  contactEmail,
  isConfirming,
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const monthLabel = viewDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const selectedLabel = selectedDate
    ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
    : "";

  const canGoPrev = useMemo(() => {
    const prevMonthEnd = new Date(viewYear, viewMonth, 0);
    return prevMonthEnd > today;
  }, [viewYear, viewMonth, today]);

  useEffect(() => {
    if (panel !== "schedule" || !selectedDate) {
      if (!selectedDate) {
        setBookedSlots([]);
        setSlotsError("");
        setSlotsLoading(false);
      }
      return;
    }

    let cancelled = false;
    const loadBookedSlots = async () => {
      setSlotsLoading(true);
      setSlotsError("");
      try {
        const res = await fetch(
          `/api/book-demo/slots?date=${encodeURIComponent(selectedDate)}`
        );
        const payload = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (!res.ok || !payload.success) {
          setBookedSlots([]);
          setSlotsError(
            payload.message || "Could not load availability for this date."
          );
          return;
        }

        const nextBooked = Array.isArray(payload.bookedSlots)
          ? payload.bookedSlots
          : [];
        setBookedSlots(nextBooked);

        if (selectedTime && nextBooked.includes(selectedTime)) {
          onSelectTime("");
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load booked slots:", error);
        setBookedSlots([]);
        setSlotsError("Could not load availability for this date.");
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    };

    loadBookedSlots();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, panel]);

  const goPrev = () => {
    if (!canGoPrev) return;
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const goNext = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const showForm = panel === "form";

  return (
    <div
      className={`relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 ${popupFontClass}`}
      style={popupFontStyle}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 !text-white transition hover:bg-slate-700"
        aria-label="Close"
      >
        <IoClose size={18} className="text-white" />
      </button>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-gradient-to-b from-teal-50/80 via-white to-orange-50/40 px-6 py-6 lg:w-[350px] lg:border-b-0 lg:border-r">
          <Image
            src={LOGO_SRC}
            alt="Tech Culture AI"
            width={180}
            height={52}
            className="h-10 w-auto object-contain object-left"
          />

          <div className="mt-6 flex items-center gap-3.5 rounded-2xl border border-white/80 bg-white/70 p-3 shadow-sm shadow-teal-900/5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-[#FE602F]/30 ring-offset-2 ring-offset-white">
              <Image
                src={DEMO_HOST.imageUrl}
                alt={DEMO_HOST.name}
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FE602F]">
                Meeting with
              </p>
              <p className="mt-0.5 truncate text-base font-bold text-[#1c2b2a]">
                {DEMO_HOST.name}
              </p>
              <p className="truncate text-xs text-slate-500">{DEMO_HOST.role}</p>
            </div>
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#1c2b2a]">
            30 Minute Demo
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <IoTimeOutline
                className="mt-0.5 shrink-0 text-teal-700"
                size={18}
              />
              <span>30 min</span>
            </li>
            <li className="flex items-start gap-2.5">
              <IoVideocamOutline
                className="mt-0.5 shrink-0 text-teal-700"
                size={18}
              />
              <span>Google Meet invite sent after you share your details</span>
            </li>
          </ul>

          {whenLabel ? (
            <div className="mt-5 rounded-xl border border-teal-100 bg-white/80 px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-teal-700">
                Selected slot
              </p>
              <p className="mt-1 text-sm font-bold text-[#1c2b2a]">{whenLabel}</p>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-relaxed text-slate-500">
              Pick a working day and time first. Next we&apos;ll ask for your
              details, then send the invite to you and{" "}
              <span className="font-medium text-teal-700">{TEAM_EMAIL}</span>.
            </p>
          )}

          <div className="mt-auto hidden space-y-2 pt-8 lg:block">
            <a
              href={`tel:${contactPhone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              <IoCallOutline size={15} />
              {contactPhone}
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 text-sm font-medium text-[#FE602F] hover:text-orange-600"
            >
              <IoMailOutline size={15} />
              {contactEmail}
            </a>
          </div>
        </aside>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8"
          style={{ scrollbarWidth: "thin" }}
        >
          {showForm ? (
            <>
              <div className="pr-10">
                <button
                  type="button"
                  onClick={onBackToCalendar}
                  className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                >
                  <IoChevronBack size={16} />
                  Back to calendar
                </button>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
                      Step 2 · Your details
                    </p>
                    <h3
                      id="book-demo-title"
                      className="text-xl font-bold tracking-tight text-[#1c2b2a]"
                    >
                      Almost there
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600">
                      Share your details so we can send the Meet invite.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3">
                    <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-orange-200">
                      <Image
                        src={DEMO_HOST.imageUrl}
                        alt={DEMO_HOST.name}
                        fill
                        sizes="32px"
                        className="object-cover object-top"
                      />
                    </span>
                    <span className="hidden text-xs font-semibold text-slate-600 sm:inline">
                      {DEMO_HOST.name.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={onSubmitDetails} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelClass}>
                      Full name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={onChangeForm}
                      placeholder="Enter your full name"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="workEmail" className={labelClass}>
                      Work email <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="workEmail"
                      name="workEmail"
                      type="email"
                      required
                      value={form.workEmail}
                      onChange={onChangeForm}
                      placeholder="you@company.com"
                      className={`${fieldClass} ${
                        fieldErrors.workEmail
                          ? "border-orange-400 focus:border-orange-500 focus:ring-orange-500/20"
                          : ""
                      }`}
                      aria-invalid={Boolean(fieldErrors.workEmail)}
                    />
                    {fieldErrors.workEmail && (
                      <p className="mt-1.5 text-xs text-orange-600">
                        {fieldErrors.workEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      required
                      value={form.phone}
                      onChange={onChangeForm}
                      placeholder="9876543210"
                      className={`${fieldClass} ${
                        fieldErrors.phone
                          ? "border-orange-400 focus:border-orange-500 focus:ring-orange-500/20"
                          : ""
                      }`}
                      aria-invalid={Boolean(fieldErrors.phone)}
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1.5 text-xs text-orange-600">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="company" className={labelClass}>
                      Company <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={form.company}
                      onChange={onChangeForm}
                      placeholder="Company name"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className={labelClass}>
                      Location <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={form.location}
                      onChange={onChangeForm}
                      placeholder="City, Country"
                      className={fieldClass}
                    />
                  </div>
                </div>

                {scheduleError && (
                  <p className="text-sm font-medium text-orange-600">
                    {scheduleError}
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isConfirming}
                    className="brand-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold !text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isConfirming ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Scheduling...
                      </>
                    ) : (
                      "Confirm & Send Meet Invite"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onBackToCalendar}
                    disabled={isConfirming}
                    className="brand-cta-outline rounded-full border bg-white px-5 py-3.5 text-sm font-semibold transition disabled:opacity-60 sm:min-w-[140px]"
                  >
                    Change slot
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 pr-10">
                <h3
                  id="book-demo-title"
                  className="text-xl font-bold tracking-tight text-[#1c2b2a]"
                >
                  Select a Date &amp; Time
                </h3>
                <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1 pr-3">
                  <span className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-orange-200">
                    <Image
                      src={DEMO_HOST.imageUrl}
                      alt={DEMO_HOST.name}
                      fill
                      sizes="32px"
                      className="object-cover object-top"
                    />
                  </span>
                  <span className="hidden text-xs font-semibold text-slate-600 sm:inline">
                    {DEMO_HOST.name.split(" ")[0]}
                  </span>
                </div>
              </div>

              <div
                className={`mt-5 grid gap-6 ${
                  selectedDate ? "lg:grid-cols-[1fr_200px]" : ""
                }`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-base font-semibold text-[#1c2b2a]">
                      {monthLabel}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={!canGoPrev}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Previous month"
                      >
                        <IoChevronBack size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-orange-600 transition hover:bg-orange-50"
                        aria-label="Next month"
                      >
                        <IoChevronForward size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-y-2 text-center">
                    {WEEKDAYS.map((d) => (
                      <div
                        key={d}
                        className="pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
                      >
                        {d}
                      </div>
                    ))}

                    {cells.map((date, idx) => {
                      if (!date) {
                        return <div key={`empty-${idx}`} className="h-11" />;
                      }

                      const value = toDateValue(date);
                      const selectable = isSelectableDate(date, today);
                      const active = selectedDate === value;
                      const isToday = toDateValue(today) === value;

                      return (
                        <div key={value} className="flex justify-center py-0.5">
                          <button
                            type="button"
                            disabled={!selectable}
                            onClick={() => {
                              onSelectDate(value);
                              onSelectTime("");
                            }}
                            className={`relative flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition ${
                              active
                                ? "bg-[#FE602F] !text-white shadow-md shadow-orange-500/30"
                                : selectable
                                  ? "bg-orange-50 text-orange-800 hover:bg-orange-100"
                                  : "cursor-default text-slate-300"
                            }`}
                          >
                            {date.getDate()}
                            {isToday && !active && (
                              <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#FE602F]" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
                    <IoGlobeOutline className="shrink-0 text-teal-700" size={16} />
                    <span className="font-medium text-[#1c2b2a]">
                      India Standard Time (IST)
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Available Mon–Fri · 10:00 AM – 6:00 PM · 30-minute slots
                  </p>
                </div>

                {selectedDate && (
                  <div className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                    <p className="mb-3 text-sm font-semibold text-[#1c2b2a]">
                      {selectedLabel}
                    </p>
                    {slotsLoading ? (
                      <p className="text-sm text-slate-500">
                        Checking availability…
                      </p>
                    ) : slotsError ? (
                      <p className="text-sm font-medium text-orange-600">
                        {slotsError}
                      </p>
                    ) : (
                      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
                        {TIME_SLOTS.map((slot) => {
                          const active = selectedTime === slot;
                          const booked = bookedSlots.includes(slot);
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={booked}
                              onClick={() => {
                                if (!booked) onSelectTime(slot);
                              }}
                              className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                                booked
                                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through"
                                  : active
                                    ? "border-[#FE602F] bg-[#FE602F] text-white! shadow-sm shadow-orange-500/25"
                                    : "border-orange-200 bg-white text-orange-700 hover:border-orange-400 hover:bg-orange-50"
                              }`}
                              title={booked ? "Already booked" : undefined}
                            >
                              {booked ? `${slot} · Booked` : slot}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {scheduleError && (
                <p className="mt-4 text-sm font-medium text-orange-600">
                  {scheduleError}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onConfirmSchedule}
                  className="brand-cta-gradient inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold !text-white"
                >
                  Continue to Details
                  <span aria-hidden>→</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="brand-cta-outline rounded-full border bg-white px-5 py-3.5 text-sm font-semibold transition sm:min-w-[140px]"
                >
                  Close for now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookDemoPopup() {
  const { isOpen, draft, closeBookDemo, clearDraft } = useBookDemo();
  const { settingsData } = useSite();
  const [step, setStep] = useState("schedule");
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({ workEmail: "", phone: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [booking, setBooking] = useState(null);

  const contactPhone = settingsData?.phone || "+91 74282 38091";
  const contactEmail = settingsData?.email || TEAM_EMAIL;
  const whenLabel = formatWhenLabel(selectedDate, selectedTime);

  useEffect(() => {
    if (!isOpen || !draft) return;

    if (draft.form) {
      setForm({ ...INITIAL_FORM, ...draft.form });
    }
    if (draft.step) {
      setStep(draft.step);
    } else {
      setStep("schedule");
    }

    clearDraft();
  }, [isOpen, draft, clearDraft]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const resetAll = () => {
    setStep("schedule");
    setForm(INITIAL_FORM);
    setFieldErrors({ workEmail: "", phone: "" });
    setSelectedDate("");
    setSelectedTime("");
    setScheduleError("");
    setIsConfirming(false);
    setBooking(null);
  };

  const handleClose = () => {
    closeBookDemo();
    resetAll();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue =
      name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    if (name === "workEmail" || name === "phone") {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFormFields = () => {
    const next = { workEmail: "", phone: "" };

    if (!form.workEmail.trim()) {
      next.workEmail = "Work email is required.";
    } else if (!isValidEmail(form.workEmail)) {
      next.workEmail = "Enter a valid work email address.";
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (form.phone.length !== 10) {
      next.phone = "Phone number must be exactly 10 digits.";
    } else if (!isValidPhone(form.phone)) {
      next.phone = "Enter a valid 10-digit mobile number.";
    }

    setFieldErrors(next);
    return !next.workEmail && !next.phone;
  };

  const handleContinueFromSchedule = () => {
    if (!selectedDate || !selectedTime) {
      setScheduleError("Please pick a working day and a time slot.");
      return;
    }
    setScheduleError("");
    setStep("form");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setScheduleError("Please pick a working day and a time slot.");
      setStep("schedule");
      return;
    }
    if (!validateFormFields()) return;
    handleConfirmSchedule();
  };

  const handleConfirmSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      setScheduleError("Please pick a working day and a time slot.");
      setStep("schedule");
      return;
    }

    setScheduleError("");
    setIsConfirming(true);

    try {
      const res = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          workEmail: form.workEmail,
          phone: form.phone,
          company: form.company || "N/A",
          location: form.location || "N/A",
          message: form.message || "",
          demoDate: selectedDate,
          demoTime: selectedTime,
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok || !payload.success) {
        const message =
          payload.message || "Failed to schedule demo. Please try again.";
        setScheduleError(message);
        toast.error(message);
        return;
      }

      setBooking(payload.data || null);
      toast.success(payload.message || "Demo scheduled successfully.");
      setStep("success");
    } catch (error) {
      console.error("Book demo request failed:", error);
      const message =
        "Unable to reach scheduling service. Check your connection and try again.";
      setScheduleError(message);
      toast.error(message);
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center p-4 ${popupFontClass}`}
      style={popupFontStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-demo-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={handleClose}
      />

      <div
        className={`relative w-full ${
          step === "success" ? "max-w-md" : "max-w-5xl"
        }`}
      >
        {step === "success" ? (
          <SuccessStep
            form={form}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            booking={booking}
            onClose={handleClose}
          />
        ) : (
          <ScheduleStep
            panel={step === "form" ? "form" : "schedule"}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            whenLabel={whenLabel}
            form={form}
            fieldErrors={fieldErrors}
            onSelectDate={(v) => {
              setScheduleError("");
              setSelectedDate(v);
              setSelectedTime("");
            }}
            onSelectTime={(v) => {
              setScheduleError("");
              setSelectedTime(v);
            }}
            onConfirmSchedule={handleContinueFromSchedule}
            onChangeForm={handleChange}
            onSubmitDetails={handleSubmit}
            onBackToCalendar={() => {
              setScheduleError("");
              setStep("schedule");
            }}
            onClose={handleClose}
            scheduleError={scheduleError}
            contactPhone={contactPhone}
            contactEmail={contactEmail}
            isConfirming={isConfirming}
          />
        )}
      </div>
    </div>
  );
}
