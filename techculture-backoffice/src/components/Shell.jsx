import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  CalendarCheck,
  MessageSquare,
  CircleHelp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { TopNavProvider } from "../context/TopNavContext";
import TopNav from "./TopNav";

const links = [
  { to: "/", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/blogs", label: "Blog", icon: FileText },
  { to: "/careers", label: "Careers", icon: Briefcase },
  { to: "/team", label: "Team", icon: Users },
  { to: "/demos", label: "Demo bookings", icon: CalendarCheck },
  { to: "/contacts", label: "Contact messages", icon: MessageSquare },
  { to: "/faqs", label: "FAQs", icon: CircleHelp },
];

function ShellInner() {
  const { admin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff_0%,#f0fdfa55_45%,#faf9f6_100%)]">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-[#2E3545]/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-[#E8E6E1] bg-white transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="shrink-0 border-b border-[#E8E6E1] px-5 py-6">
          <img
            src="/logo.png"
            alt="TechCulture AI"
            className="h-16 w-auto max-w-full object-contain object-left"
          />
          <div className="mt-4 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FE602F]">
              Backoffice
            </p>
            <p className="text-base font-semibold leading-snug text-[#2E3545]">
              TechCulture AI
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-gradient-to-r from-teal-700 to-[#FE602F] text-white shadow-sm"
                      : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-teal-50 text-teal-700 group-hover:bg-teal-100"
                      }`}
                    >
                      <Icon size={17} strokeWidth={2.1} aria-hidden />
                    </span>
                    <span className="truncate">{l.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto shrink-0 border-t border-[#E8E6E1] px-4 py-4">
          <p className="truncate text-xs font-medium text-slate-500">{admin?.email}</p>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-64">
        <TopNav onMenuClick={() => setOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function Shell() {
  return (
    <TopNavProvider>
      <ShellInner />
    </TopNavProvider>
  );
}
