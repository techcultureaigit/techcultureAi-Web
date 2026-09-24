import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTopNav } from "../context/TopNavContext";

function initials(name = "", email = "") {
  const source = name.trim() || email.trim();
  if (!source) return "TC";
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

export default function TopNav({ onMenuClick }) {
  const { admin, logout } = useAuth();
  const { eyebrow, title, subtitle, actions } = useTopNav();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#E8E6E1] bg-white/95 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="rounded-lg border border-[#E8E6E1] px-3 py-2 text-sm font-semibold text-[#2E3545] lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            Menu
          </button>

          <div className="min-w-0">
            {eyebrow ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                {eyebrow}
              </p>
            ) : null}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h1 className="truncate text-xl font-bold text-[#2E3545] sm:text-2xl">
                {title || "Backoffice"}
              </h1>
              {subtitle ? (
                <p className="truncate text-sm text-slate-500">{subtitle}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {actions}

          <div className="mx-1 hidden h-8 w-px bg-[#E8E6E1] sm:block" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full p-0.5 transition hover:bg-slate-50"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Account menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-700 to-[#FE602F] text-xs font-bold text-white">
                {initials(admin?.name, admin?.email)}
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                className="text-slate-400"
                aria-hidden
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[#E8E6E1] bg-white shadow-lg">
                <div className="border-b border-[#E8E6E1] px-4 py-3">
                  <p className="truncate text-sm font-semibold text-[#2E3545]">
                    {admin?.name || "Admin"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{admin?.email}</p>
                </div>
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-[#FE602F] hover:bg-orange-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
