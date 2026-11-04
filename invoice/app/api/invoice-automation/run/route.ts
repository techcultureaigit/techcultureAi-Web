import { NextResponse } from "next/server";
import {
  elapsedMs,
  intervalToMs,
  normalizeInvoiceMailSettings,
  type InvoiceMailSettings,
} from "@/lib/invoiceSettings";

const API_BASE =
  process.env.NEXT_PUBLIC_INVOICE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5050/api/invoice";

type InvoiceDoc = {
  id: string;
  invoiceNo?: string;
  status?: string;
  date?: string;
  dueDate?: string | null;
  firstSentAt?: string | null;
  lastReminderAt?: string | null;
};

async function apiFetch<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload?.success === false) {
    throw new Error(payload?.message || `API failed (${res.status})`);
  }
  return payload as T;
}

/** True once the due calendar day is over (local). */
function dueDateCrossed(dueDateStr: string | null | undefined, now = new Date()) {
  if (!dueDateStr) return false;
  const raw = String(dueDateStr).trim().slice(0, 10);
  const parts = raw.split("-").map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) {
    const due = new Date(dueDateStr);
    if (Number.isNaN(due.getTime())) return false;
    due.setHours(23, 59, 59, 999);
    return now.getTime() > due.getTime();
  }
  const [y, m, d] = parts;
  const dueEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
  return now.getTime() > dueEnd.getTime();
}

function endOfDueDate(dueDateStr: string | null | undefined) {
  if (!dueDateStr) return null;
  const raw = String(dueDateStr).trim().slice(0, 10);
  const parts = raw.split("-").map(Number);
  if (parts.length >= 3 && !parts.some((n) => Number.isNaN(n))) {
    const [y, m, d] = parts;
    return new Date(y, m - 1, d, 23, 59, 59, 999);
  }
  const due = new Date(dueDateStr);
  if (Number.isNaN(due.getTime())) return null;
  due.setHours(23, 59, 59, 999);
  return due;
}

export async function POST(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization required" },
        { status: 401 },
      );
    }

    const settingsRes = await apiFetch<{ settings: InvoiceMailSettings }>(
      "/settings",
      token,
    );
    const settings = normalizeInvoiceMailSettings(settingsRes.settings);

    const list = await apiFetch<{ invoices: InvoiceDoc[] }>("/invoices", token);
    const invoices = list.invoices || [];
    const now = new Date();
    const reminderEveryMs = intervalToMs(
      settings.reminderInterval,
      settings.reminderIntervalUnit,
    );

    let overdueUpdated = 0;
    let remindersSent = 0;
    const errors: string[] = [];

    for (const invoice of invoices) {
      const status = String(invoice.status || "").toLowerCase();
      if (status === "paid" || status === "draft" || status === "cancelled") continue;
      if (status !== "pending" && status !== "overdue") continue;
      if (!dueDateCrossed(invoice.dueDate, now)) continue;

      // 1) Always flip Pending → Overdue after due date (even if auto-email is Off)
      if (status === "pending") {
        try {
          await apiFetch(`/invoices/${encodeURIComponent(invoice.id)}`, token, {
            method: "PUT",
            body: JSON.stringify({ ...invoice, status: "Overdue" }),
          });
          overdueUpdated += 1;
        } catch (err) {
          errors.push(
            `overdue ${invoice.invoiceNo || invoice.id}: ${
              err instanceof Error ? err.message : "failed"
            }`,
          );
          continue;
        }
      }

      // 2) Reminder emails only when automation is enabled
      if (!settings.autoEmailEnabled) continue;

      const dueEnd = endOfDueDate(invoice.dueDate);
      const lastTouch = invoice.lastReminderAt || invoice.firstSentAt || null;
      const lastTouchTime = lastTouch ? new Date(lastTouch).getTime() : NaN;
      const alreadyRemindedAfterDue =
        dueEnd &&
        !Number.isNaN(lastTouchTime) &&
        lastTouchTime > dueEnd.getTime();
      const shouldRemind = alreadyRemindedAfterDue
        ? elapsedMs(lastTouch, now) >= reminderEveryMs
        : true;

      if (!shouldRemind) continue;

      try {
        await apiFetch("/mail/send", token, {
          method: "POST",
          body: JSON.stringify({
            invoiceId: invoice.id,
            kind: "reminder",
          }),
        });
        remindersSent += 1;
      } catch (err) {
        errors.push(
          `${invoice.invoiceNo || invoice.id}: ${
            err instanceof Error ? err.message : "reminder failed"
          }`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      settings,
      overdueUpdated,
      remindersSent,
      errors,
      message: `Automation done — overdue: ${overdueUpdated}, reminders: ${remindersSent}`,
    });
  } catch (error) {
    console.error("invoice-automation failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Automation run failed",
      },
      { status: 500 },
    );
  }
}
