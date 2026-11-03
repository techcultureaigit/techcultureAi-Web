import { getToken, logoutUser } from "@/lib/auth";

const API_BASE =
  process.env.NEXT_PUBLIC_INVOICE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5050/api/invoice";

export class InvoiceApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (res.status === 401 || res.status === 403) {
    logoutUser();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  if (!res.ok || payload?.success === false) {
    throw new InvoiceApiError(
      payload?.message || `Request failed (${res.status})`,
      res.status,
    );
  }

  return payload as T;
}

export const invoiceApi = {
  health: () => request<{ success: boolean; service: string }>("/health"),

  workspace: () =>
    request<{
      success: boolean;
      data: {
        Invoices: any[];
        Customers: any[];
        Payments: any[];
      };
    }>("/workspace"),

  dashboard: () => request<{ success: boolean; summary: Record<string, number> }>("/dashboard"),

  listCustomers: (q = "") =>
    request<{ success: boolean; customers: any[] }>(
      `/customers${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    ),

  getCustomer: (id: string) =>
    request<{ success: boolean; customer: any }>(`/customers/${encodeURIComponent(id)}`),

  createCustomer: (body: unknown) =>
    request<{ success: boolean; customer: any }>("/customers", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateCustomer: (id: string, body: unknown) =>
    request<{ success: boolean; customer: any }>(`/customers/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteCustomer: (id: string) =>
    request<{ success: boolean }>(`/customers/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  listInvoices: (q = "") =>
    request<{ success: boolean; invoices: any[] }>(
      `/invoices${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    ),

  getInvoice: (id: string) =>
    request<{ success: boolean; invoice: any }>(`/invoices/${encodeURIComponent(id)}`),

  createInvoice: (body: unknown) =>
    request<{ success: boolean; invoice: any }>("/invoices", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateInvoice: (id: string, body: unknown) =>
    request<{ success: boolean; invoice: any }>(`/invoices/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteInvoice: (id: string) =>
    request<{ success: boolean }>(`/invoices/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  getSettings: () =>
    request<{ success: boolean; settings: any }>("/settings"),

  updateSettings: (body: unknown) =>
    request<{ success: boolean; settings: any }>("/settings", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  sendInvoiceMail: (body: {
    invoiceId?: string;
    invoice?: unknown;
    to?: string;
    kind?: "payment_request" | "reminder" | "paid";
  }) =>
    request<{
      success: boolean;
      message: string;
      messageId?: string;
      sentAt?: string;
      kind?: string;
      patch?: Record<string, string>;
    }>("/mail/send", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  listPayments: (q = "") =>
    request<{ success: boolean; payments: any[] }>(
      `/payments${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    ),

  createPayment: (body: unknown) =>
    request<{ success: boolean; payment: any }>("/payments", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updatePayment: (id: string, body: unknown) =>
    request<{ success: boolean; payment: any }>(`/payments/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deletePayment: (id: string) =>
    request<{ success: boolean }>(`/payments/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};

export function getInvoiceApiBase() {
  return API_BASE;
}
