"use client";

import { useEffect, useState } from "react";
import { Check, Type } from "lucide-react";
import { IoChevronDown } from "react-icons/io5";
import { useFont } from "@/context/FontContext";

export default function FontSwitcher({ compact = false }) {
  const { fontId, fonts, setFontId, font } = useFont();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (event) => {
      if (!event.target.closest(".font-switcher")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="font-switcher relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 text-[#2E3545] shadow-sm transition hover:border-[#FE602F]/40 hover:text-[#FE602F] ${
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose font family"
        title="Font family"
      >
        <Type size={compact ? 14 : 15} className="shrink-0" />
        <span className="hidden max-w-28 truncate font-semibold xl:inline">
          {font.label}
        </span>
        <IoChevronDown
          size={14}
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(46,53,69,0.16)]"
          role="listbox"
          aria-label="Font families"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FE602F]">
              Font family
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Preview globally across the site. Pick your favorite later as default.
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto py-1.5">
            {fonts.map((option) => {
              const active = option.id === fontId;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setFontId(option.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition ${
                    active
                      ? "bg-[#fff4ef] text-[#2E3545]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{
                    fontFamily: `var(${option.cssVar}), system-ui, sans-serif`,
                  }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    {active ? (
                      <Check size={15} className="text-[#FE602F]" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    <span className="mt-0.5 block text-[11px] text-slate-500">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
