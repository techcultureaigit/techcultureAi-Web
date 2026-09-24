"use client";

import { useState } from "react";
import Image from "next/image";
import newlogo from "../../../public/tc-new-logo-2.png";

export default function Header({ scrollToSection }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "overview", label: "Services" },
    { id: "approach", label: "Solutions" },
    { id: "techstack", label: "Case Studies" },
    { id: "testimonials", label: "About Us" },
    { id: "clients", label: "Resources" },
  ];

  const handleNav = (id) => {
    setMobileOpen(false);
    scrollToSection?.(id);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80">
      <nav className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 h-[72px] flex items-center justify-between">
        {/* Logo — same as dashboard-ai */}
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="flex items-center shrink-0"
        >
          <div className="relative w-[150px] h-[72px]">
            <Image
              src={newlogo}
              alt="logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`text-sm font-medium transition relative ${
                i === 0
                  ? "text-teal-600"
                  : "text-slate-600 hover:text-teal-600"
              }`}
            >
              {item.label}
              {i === 0 && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNav("contact")}
            className="brand-cta-gradient hidden sm:inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
          >
            Get In Touch
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNav("contact")}
            className="brand-cta-gradient mt-2 w-full inline-flex items-center justify-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Get In Touch
          </button>
        </div>
      )}
    </header>
  );
}
