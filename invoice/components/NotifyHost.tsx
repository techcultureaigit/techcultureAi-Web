"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXMark,
} from "react-icons/hi2";
import {
  NOTIFY_EVENTS,
  type ConfirmInput,
  type NotifyTone,
  type ToastInput,
} from "@/lib/notify";
import "./NotifyHost.css";

type ToastItem = ToastInput & { id: string };
type ConfirmItem = ConfirmInput & {
  id: string;
  resolve: (ok: boolean) => void;
};

function toneIcon(tone: NotifyTone = "info") {
  if (tone === "success") return HiOutlineCheckCircle;
  if (tone === "error") return HiOutlineExclamationCircle;
  if (tone === "warning") return HiOutlineExclamationTriangle;
  return HiOutlineInformationCircle;
}

export default function NotifyHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirm, setConfirm] = useState<ConfirmItem | null>(null);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastItem>).detail;
      if (!detail?.message) return;
      setToasts((prev) => [...prev, detail]);
      const duration = detail.durationMs ?? 4200;
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== detail.id));
      }, duration);
    }

    function onConfirm(event: Event) {
      const detail = (event as CustomEvent<ConfirmItem>).detail;
      if (!detail?.message || typeof detail.resolve !== "function") return;
      setConfirm((current) => {
        if (current) current.resolve(false);
        return detail;
      });
    }

    window.addEventListener(NOTIFY_EVENTS.toast, onToast as EventListener);
    window.addEventListener(NOTIFY_EVENTS.confirm, onConfirm as EventListener);
    return () => {
      window.removeEventListener(NOTIFY_EVENTS.toast, onToast as EventListener);
      window.removeEventListener(NOTIFY_EVENTS.confirm, onConfirm as EventListener);
    };
  }, []);

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }

  function closeConfirm(ok: boolean) {
    setConfirm((current) => {
      current?.resolve(ok);
      return null;
    });
  }

  return (
    <>
      <div className="tc-notify-stack" aria-live="polite" aria-relevant="additions">
        {toasts.map((item) => {
          const Icon = toneIcon(item.tone);
          return (
            <div
              key={item.id}
              className={`tc-toast tc-toast-${item.tone || "info"}`}
              role="status"
            >
              <div className="tc-toast-icon">
                <Icon size={18} />
              </div>
              <div className="tc-toast-copy">
                {item.title ? <strong>{item.title}</strong> : null}
                <p>{item.message}</p>
              </div>
              <button
                type="button"
                className="tc-toast-close"
                aria-label="Dismiss"
                onClick={() => dismissToast(item.id)}
              >
                <HiOutlineXMark size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {confirm ? (
        <div
          className="tc-confirm-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeConfirm(false);
          }}
        >
          <div
            className={`tc-confirm-card tc-confirm-${confirm.tone || "warning"}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tc-confirm-title"
          >
            <div className="tc-confirm-header">
              <div className="tc-confirm-icon">
                {(() => {
                  const Icon = toneIcon(confirm.tone || "warning");
                  return <Icon size={22} />;
                })()}
              </div>
              <div className="tc-confirm-copy">
                <h3 id="tc-confirm-title">{confirm.title || "Please confirm"}</h3>
                <p>{confirm.message}</p>
              </div>
            </div>

            {confirm.details?.length ? (
              <dl className="tc-confirm-details">
                {confirm.details.map((row) => (
                  <div key={`${row.label}-${row.value}`} className="tc-confirm-detail-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="tc-confirm-actions">
              <button
                type="button"
                className="btn btn-secondary tc-confirm-btn"
                onClick={() => closeConfirm(false)}
              >
                {confirm.cancelLabel || "Cancel"}
              </button>
              <button
                type="button"
                className={`btn tc-confirm-btn ${
                  confirm.tone === "error" || confirm.tone === "warning"
                    ? "btn-danger"
                    : "btn-primary"
                }`}
                onClick={() => closeConfirm(true)}
              >
                {confirm.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
