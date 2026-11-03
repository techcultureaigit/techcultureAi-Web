import { NextResponse } from "next/server";
import {
  daysBetween,
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

    if (!settings.autoEmailEnabled) {
      return NextResponse.json({
        success: true,
        message: "Auto email is disabled in settings",
        settings,
        overdueUpdated: 0,
        remindersSent: 0,
      });
    }

    const list = await apiFetch<{ invoices: InvoiceDoc[] }>("/invoices", token);
    const invoices = list.invoices || [];
    const now = new Date();

    let overdueUpdated = 0;
    let remindersSent = 0;
    const errors: string[] = [];

    for (const invoice of invoices) {
      const status = String(invoice.status || "").toLowerCase();
      if (status !== "pending" && status !== "overdue") continue;

      const firstSentAt = invoice.firstSentAt || null;
      if (!firstSentAt) continue;

      let nextStatus = invoice.status || "Pending";

      // Auto overdue after N days from first payment email
      if (
        status === "pending" &&
        daysBetween(firstSentAt, now) >= settings.overdueAfterDays
      ) {
        nextStatus = "Overdue";
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
        }
      }

      // Reminder every N days while pending/overdue
      const lastTouch = invoice.lastReminderAt || firstSentAt;
      if (daysBetween(lastTouch, now) >= settings.reminderIntervalDays) {
        try {
          await apiFetch("/mail/send", token, {
            method: "POST",
            body: JSON.stringify({
              invoiceId: invoice.id,
              kind: "reminder",
            }),
          });
          remindersSent += 1;
          if (nextStatus === "Overdue" && status === "pending") {
            // already updated above
          }
        } catch (err) {
          errors.push(
            `${invoice.invoiceNo || invoice.id}: ${
              err instanceof Error ? err.message : "reminder failed"
            }`,
          );
        }
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
