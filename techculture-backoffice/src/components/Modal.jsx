import { useEffect } from "react";

export default function Modal({
  open,
  title,
  eyebrow,
  onClose,
  children,
  footer,
  wide = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="Close popup"
        className="absolute inset-0 bg-[#2E3545]/55 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div
        className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-[0_24px_80px_rgba(46,53,69,0.28)] sm:rounded-3xl ${
          wide ? "sm:max-w-3xl" : "sm:max-w-xl"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="relative shrink-0 overflow-hidden border-b border-[#E8E6E1] px-5 py-5 sm:px-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-teal-50 via-white to-orange-50" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              {eyebrow ? (
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#FE602F]">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="mt-1 text-xl font-bold text-[#2E3545] sm:text-2xl">{title}</h2>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E6E1] bg-white text-lg leading-none text-slate-500 transition hover:border-teal-200 hover:text-teal-800"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        <div className="tc-scroll overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-[#E8E6E1] bg-[#fafbfc] px-5 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
