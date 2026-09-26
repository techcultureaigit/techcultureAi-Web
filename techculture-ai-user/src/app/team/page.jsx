"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LiaLinkedinIn } from "react-icons/lia";
import EmployeeReelGallery from "@/components/EmployeeReelGallery";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { fetchTeamMembers, BACKOFFICE_API_URL } from "@/lib/teamApi";

const FEATURED_LEADERS = ["Manoj Rawat", "Mukesh Chaudhari"];
const EXCLUDED_MEMBERS = ["Shubham Agarwal", "Mukul Yadav"];

function getDiscipline(role = "") {
  const value = role.toLowerCase();

  if (
    value.includes("developer") ||
    value.includes("technology") ||
    value.includes("engineer") ||
    value === "it"
  ) {
    return "Technology";
  }
  if (
    value.includes("operation") ||
    value.includes("backoffice") ||
    value.includes("depository") ||
    value.includes("rms") ||
    value.includes("risk")
  ) {
    return "Operations";
  }
  if (
    value.includes("sales") ||
    value.includes("marketing") ||
    value.includes("regional")
  ) {
    return "Growth";
  }
  if (value.includes("human") || value.includes("hr")) {
    return "People";
  }
  return "Business";
}

function mapTeamMembers(raw = []) {
  return raw
    .filter(
      (member) =>
        Boolean(member.imageUrl) &&
        !EXCLUDED_MEMBERS.includes(member.name) &&
        (FEATURED_LEADERS.includes(member.name) ||
          member.name === "Rahul Goel" ||
          member.roleId?.name?.toLowerCase().includes("developer") ||
          member.role?.toLowerCase?.().includes("developer"))
    )
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((member) => ({
      id: member._id || member.id,
      name: member.name,
      initials: member.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      image: (() => {
        const raw = String(member.imageUrl || "").trim();
        if (!raw) return "";
        if (raw.startsWith("/uploads/")) return `${BACKOFFICE_API_URL}${raw}`;
        if (raw.startsWith("/")) return raw;
        try {
          const parsed = new URL(raw);
          if (parsed.pathname.startsWith("/uploads/")) {
            return `${BACKOFFICE_API_URL}${parsed.pathname}`;
          }
        } catch {
          /* ignore */
        }
        if (raw.startsWith("http://localhost") || raw.startsWith("http://127.")) {
          return raw;
        }
        return raw.replace(/^http:/, "https:");
      })(),
      designation: member.roleId?.name || member.role || "Team Member",
      discipline: getDiscipline(member.roleId?.name || member.role),
      linkedin: member.linkedIn,
      order: member.order,
      gradient: "from-[#2E3545] to-[#FE602F]",
    }));
}

const leadershipDescriptions = [
  "Transforming strategy into efficient operations and consistently strong customer outcomes.",
  "Leading technology strategy and building secure, scalable platforms for the future.",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TeamPage() {
  const reduceMotion = useReducedMotion();
  const [rawMembers, setRawMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await fetchTeamMembers();
        if (!cancelled) setRawMembers(data || []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load team");
          setRawMembers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const TEAM_MEMBERS = useMemo(() => mapTeamMembers(rawMembers), [rawMembers]);
  const EXECUTIVE_LEADERS = useMemo(
    () => TEAM_MEMBERS.filter((member) => FEATURED_LEADERS.includes(member.name)),
    [TEAM_MEMBERS]
  );
  const WIDER_TEAM = useMemo(
    () => TEAM_MEMBERS.filter((member) => !FEATURED_LEADERS.includes(member.name)),
    [TEAM_MEMBERS]
  );
  const DEFAULT_ORBIT_CENTER = useMemo(
    () =>
      TEAM_MEMBERS.find((member) => member.name === "Manoj Rawat") || WIDER_TEAM[0],
    [TEAM_MEMBERS, WIDER_TEAM]
  );

  useEffect(() => {
    if (!selectedMemberId && DEFAULT_ORBIT_CENTER?.id) {
      setSelectedMemberId(DEFAULT_ORBIT_CENTER.id);
    }
  }, [DEFAULT_ORBIT_CENTER, selectedMemberId]);

  const selectedMember =
    TEAM_MEMBERS.find((member) => member.id === selectedMemberId) ||
    DEFAULT_ORBIT_CENTER;
  const orbitMembers = TEAM_MEMBERS.filter(
    (member) => member.id !== selectedMember?.id
  );
  const animatedItem = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : itemVariants;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-white text-sm text-slate-500">
        Loading team…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-white px-5 text-center">
        <p className="text-sm font-semibold text-red-600">{error}</p>
        <p className="text-xs text-slate-500">
          Make sure backoffice API is running on port 5050.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white text-[#2E3545]">
      <section className="relative isolate flex min-h-130 items-center overflow-hidden border-b border-[#2E3545]/5 px-5 py-12 sm:px-6 md:min-h-140 md:py-16">
        <EmployeeReelGallery
          members={TEAM_MEMBERS.slice(0, 8)}
          className="absolute inset-0 -z-10"
        />

        <motion.div
          className="pointer-events-none container relative z-10 mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            variants={animatedItem}
            className="mx-auto max-w-4xl text-[1.85rem] font-bold leading-[1.12] tracking-tight text-slate-900 drop-shadow-[0_5px_18px_rgba(255,255,255,0.85)] sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Meet the minds shaping{" "}
            <span className="bg-linear-to-r from-[#2E3545] via-[#FE602F] to-[#2E3545] bg-clip-text text-transparent">
              what comes next
            </span>
          </motion.h1>

          <motion.p
            variants={animatedItem}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] sm:text-lg"
          >
            A focused team of strategists and engineers united by curiosity,
            craftsmanship, and the ambition to build technology that creates
            meaningful business impact.
          </motion.p>

          <motion.div
            variants={animatedItem}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#team-members"
              className="brand-cta-gradient pointer-events-auto group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
            >
              Meet our team
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
            <Link
              href="/contact"
              className="brand-cta-outline pointer-events-auto inline-flex items-center gap-2 rounded-full border bg-white/85 px-6 py-3.5 text-sm font-semibold shadow-lg backdrop-blur-md transition hover:-translate-y-0.5"
            >
              Work with us
              <ArrowUpRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section id="team-members" className="relative scroll-mt-24 bg-[#fffaf8] px-5 py-20 sm:px-6 md:py-28">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#FE602F]/9 blur-[110px]" />
        <div className="container mx-auto">
          <motion.div
            className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end md:mb-16"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55 }}
          >
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#FE602F]">
                Our people
              </p>
              <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                The team turning ideas into impact.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-right">
              Leadership and specialists working together across strategy,
              technology, operations, and customer experience.
            </p>
          </motion.div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.08fr]">
            <motion.div
              className="grid h-full gap-5 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={containerVariants}
            >
              {EXECUTIVE_LEADERS.map((member, index) => (
                <motion.article
                  key={member.id}
                  variants={animatedItem}
                  whileHover={reduceMotion ? undefined : { y: -9 }}
                  transition={{ duration: 0.28 }}
                  className="group relative flex h-full min-h-137.5 flex-col overflow-hidden rounded-4xl border border-[#2E3545]/10 bg-[#2E3545] shadow-[0_22px_60px_rgba(46,53,69,0.2)]"
                >
                  <div className="relative min-h-105 flex-1 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 24vw"
                      unoptimized
                      className="object-cover object-top transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#202531] via-[#202531]/12 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-[#2E3545]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      Leadership · 0{index + 1}
                    </span>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/90 text-[#2E3545] transition hover:border-[#FE602F] hover:bg-[#FE602F] hover:text-white"
                      >
                        <LiaLinkedinIn size={18} />
                      </a>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h3 className="text-xl font-bold text-white!">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-[#ff9877]">
                        {member.designation}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 p-5">
                    <p className="text-sm leading-6 text-slate-300">
                      {leadershipDescriptions[index]}
                    </p>
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#FE602F] transition-transform duration-500 group-hover:scale-x-100" />
                </motion.article>
              ))}
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="relative mx-auto aspect-square w-full max-w-155 self-center"
            >
              <motion.div
                animate={reduceMotion ? undefined : { rotate: -360 }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[15%] rounded-full border border-dashed border-[#FE602F]/35"
              />
              <motion.div
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[23%] rounded-full opacity-70 blur-[1px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(254,96,47,0.7) 75deg, transparent 145deg, rgba(46,53,69,0.5) 230deg, transparent 310deg)",
                }}
              />
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        backgroundColor: [
                          "rgba(255,240,235,0.88)",
                          "rgba(238,240,244,0.9)",
                          "rgba(255,225,214,0.84)",
                          "rgba(255,240,235,0.88)",
                        ],
                        boxShadow: [
                          "0 0 80px rgba(254,96,47,0.14)",
                          "0 0 95px rgba(46,53,69,0.16)",
                          "0 0 90px rgba(254,96,47,0.24)",
                          "0 0 80px rgba(254,96,47,0.14)",
                        ],
                      }
                }
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-[24%] rounded-full border-4 border-white/80 backdrop-blur-sm"
              />
              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1, 1.45, 1], opacity: [0.55, 1, 0.55] }
                }
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[13.5%] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#FE602F] shadow-[0_0_20px_rgba(254,96,47,0.8)]"
              />
              <motion.span
                animate={
                  reduceMotion
                    ? undefined
                    : { scale: [1.35, 1, 1.35], opacity: [1, 0.5, 1] }
                }
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-[13.5%] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#2E3545] shadow-[0_0_18px_rgba(46,53,69,0.55)]"
              />

              {selectedMember && (
                <motion.article
                  key={selectedMember.id}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={reduceMotion ? undefined : { scale: 1.06 }}
                  className="group absolute left-1/2 top-1/2 z-20 h-36 w-36 -translate-x-1/2 -translate-y-1/2 sm:h-44 sm:w-44"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_18px_45px_rgba(46,53,69,0.2)] ring-2 ring-[#FE602F]/60">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      sizes="160px"
                      unoptimized
                      className="scale-110 object-cover object-center transition duration-500 group-hover:scale-115"
                    />
                  </div>
                  <div className="absolute left-1/2 top-[86%] z-10 w-40 -translate-x-1/2 rounded-2xl border border-white/15 bg-[#2E3545]/95 px-3 py-2 text-center text-white shadow-xl backdrop-blur-md sm:w-48">
                    <p className="truncate text-[11px] font-bold text-white! sm:text-xs">
                      {selectedMember.name}
                    </p>
                    <p className="mt-0.5 truncate text-[8px] font-semibold text-[#ffad92] sm:text-[9px]">
                      {selectedMember.designation}
                    </p>
                  </div>
                </motion.article>
              )}

              <motion.div
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{
                  duration: 34,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-[12%]"
              >
                {orbitMembers.map((member, index) => {
                  const angle = (360 / orbitMembers.length) * index;

                  return (
                    <div
                      key={member.id}
                      className="pointer-events-none absolute inset-0"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => setSelectedMemberId(member.id)}
                        aria-label={`Show ${member.name} in the centre`}
                        animate={reduceMotion ? undefined : { rotate: -360 }}
                        transition={{
                          duration: 34,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        whileHover={reduceMotion ? undefined : { scale: 1.12 }}
                        className="pointer-events-auto group absolute left-1/2 top-0 h-19 w-19 -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:h-24 sm:w-24"
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-full border-3 border-white bg-slate-100 shadow-[0_12px_30px_rgba(46,53,69,0.17)] ring-1 ring-[#FE602F]/45">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="96px"
                            unoptimized
                            className="object-cover object-top transition duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute left-1/2 top-[84%] w-max max-w-28 -translate-x-1/2 rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-center text-[8px] font-bold text-[#2E3545] shadow-md backdrop-blur-sm sm:text-[9px]">
                          {member.name}
                        </div>
                      </motion.button>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  );
}
