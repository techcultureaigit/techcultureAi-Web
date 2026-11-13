"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS, sectionFromPath } from "@/lib/routes";
import { AppIcon, Icons, SECTION_ICONS } from "@/components/icons";
import { getAuthUser, logoutUser, verifyAuthSession, type InvoiceAuthUser } from "@/lib/auth";
import "./ProfileMenu.css";

type Props = {
  active?: string;
  crumb?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function AppShell({
  active,
  actions,
  children,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<InvoiceAuthUser | null>(null);
  const [installPrompt, setInstallPrompt] = useState<{ prompt: () => Promise<void> } | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const resolvedActive = active || sectionFromPath(pathname) || "Dashboard";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = getAuthUser();
      if (!local) {
        router.replace("/login");
        return;
      }
      setUser(local);
      const verified = await verifyAuthSession();
      if (cancelled) return;
      if (!verified) {
        router.replace("/login");
        return;
      }
      setUser(verified);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setInstallPrompt(e as unknown as { prompt: () => Promise<void> });
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function handleLogout() {
    logoutUser();
    setProfileOpen(false);
    setUser(null);
    setMobileNav(false);
    router.replace("/login");
  }

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
    setMobileNav(false);
  }

  const initials = user?.initials || "ST";
  const displayName = user?.name || "Subham Tech";
  const displayEmail = user?.email || "admin@techculture.ai";

  function TopActions() {
    return (
      <div className="top-actions topbar-desktop-only">
        <div className="profile-menu" ref={profileRef}>
          <button
            type="button"
            className={`profile-trigger ${profileOpen ? "open" : ""}`}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            title="Profile"
            onClick={() => setProfileOpen((open) => !open)}
          >
            {initials}
          </button>

          {profileOpen ? (
            <div className="profile-popup" role="menu">
              <div className="profile-popup-head">
                <div className="profile-popup-avatar" aria-hidden>
                  {initials}
                </div>
                <div className="profile-popup-meta">
                  <strong>{displayName}</strong>
                  <span>{displayEmail}</span>
                </div>
              </div>
              <button
                type="button"
                className="profile-popup-logout"
                role="menuitem"
                onClick={handleLogout}
              >
                <AppIcon icon={Icons.logout} size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <img
            className="brand-logo"
            src="/techculture-logo.png"
            alt="TechCulture AI"
          />
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav>
          {NAV_ITEMS.map((item) => {
            const Icon = SECTION_ICONS[item.name];
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileNav(false)}
                className={`nav-item ${resolvedActive === item.name ? "active" : ""}`}
              >
                <span className="nav-icon">
                  <AppIcon icon={Icon} size={17} />
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          {installPrompt ? (
            <button
              type="button"
              className="btn btn-secondary sidebar-install-btn"
              onClick={() => void handleInstall()}
            >
              <AppIcon icon={Icons.download} size={14} /> Install app
            </button>
          ) : null}

          <div className="sidebar-profile-card">
            <div className="sidebar-profile-main">
              <div className="avatar">{initials}</div>
              <div className="sidebar-profile-meta">
                <b>{displayName}</b>
                <small>{displayEmail}</small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary sidebar-logout-btn"
              onClick={handleLogout}
            >
              <AppIcon icon={Icons.logout} size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {mobileNav ? (
        <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />
      ) : null}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              type="button"
              onClick={() => setMobileNav(true)}
              aria-label="Open menu"
            >
              <AppIcon icon={Icons.menu} size={20} />
            </button>
            <div className="topbar-screen-name">{resolvedActive}</div>
          </div>
          <div className="topbar-right">
            {actions ? <div className="welcome-actions">{actions}</div> : null}
            {installPrompt ? (
              <button
                type="button"
                className="btn btn-secondary topbar-desktop-only"
                onClick={() => void handleInstall()}
              >
                <AppIcon icon={Icons.download} size={14} /> Install app
              </button>
            ) : null}
            <TopActions />
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
