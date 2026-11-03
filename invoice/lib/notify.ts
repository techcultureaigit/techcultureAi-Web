export type NotifyTone = "success" | "error" | "warning" | "info";

export type ToastInput = {
  title?: string;
  message: string;
  tone?: NotifyTone;
  durationMs?: number;
};

export type ConfirmInput = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: NotifyTone;
};

type ToastEventDetail = ToastInput & { id: string };
type ConfirmEventDetail = ConfirmInput & {
  id: string;
  resolve: (ok: boolean) => void;
};

const TOAST_EVENT = "tc-invoice-toast";
const CONFIRM_EVENT = "tc-invoice-confirm";

function emit(name: string, detail: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function notify(input: ToastInput | string) {
  const payload: ToastInput =
    typeof input === "string" ? { message: input, tone: "info" } : input;
  emit(TOAST_EVENT, {
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tone: "info",
    durationMs: 4200,
    ...payload,
  } satisfies ToastEventDetail);
}

export const toast = {
  success: (message: string, title = "Success") =>
    notify({ message, title, tone: "success" }),
  error: (message: string, title = "Something went wrong") =>
    notify({ message, title, tone: "error", durationMs: 5600 }),
  warning: (message: string, title = "Please check") =>
    notify({ message, title, tone: "warning", durationMs: 5000 }),
  info: (message: string, title = "Notice") =>
    notify({ message, title, tone: "info" }),
};

export function confirmDialog(input: ConfirmInput | string): Promise<boolean> {
  const payload: ConfirmInput =
    typeof input === "string" ? { message: input } : input;

  return new Promise((resolve) => {
    emit(CONFIRM_EVENT, {
      id: `confirm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: "Please confirm",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      tone: "warning",
      ...payload,
      resolve,
    } satisfies ConfirmEventDetail);
  });
}

export const NOTIFY_EVENTS = {
  toast: TOAST_EVENT,
  confirm: CONFIRM_EVENT,
} as const;
