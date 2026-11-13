import {
  createEmptyCustomer,
  normalizeCustomer,
  type CustomerRecord,
} from "@/components/CustomerForm";
import { invoiceApi } from "@/lib/api";

export const INVOICE_STORAGE_KEY = "tc-invoice-data";

export type InvoiceData = Record<string, unknown[]>;

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function loadInvoiceData(): InvoiceData | null {
  try {
    const saved = localStorage.getItem(INVOICE_STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as InvoiceData;
  } catch {
    return null;
  }
}

export function writeInvoiceData(data: InvoiceData) {
  localStorage.setItem(INVOICE_STORAGE_KEY, JSON.stringify(data));
}

export function loadCustomers(): CustomerRecord[] {
  const data = loadInvoiceData();
  const customers = (data?.Customers || []) as Partial<CustomerRecord>[];
  return customers.map((customer) =>
    normalizeCustomer({
      ...customer,
      id: customer.id || `CUS-${Date.now().toString().slice(-5)}`,
    }),
  );
}

export function getCustomerById(id: string): CustomerRecord | null {
  const match = loadCustomers().find((customer) => customer.id === id);
  return match || null;
}

export function saveCustomerRecord(
  customer: CustomerRecord,
  editingId?: string | null,
) {
  const current = loadInvoiceData() || {};
  const list = ((current.Customers || []) as CustomerRecord[]).slice();
  const index = list.findIndex((item) => item.id === (editingId || customer.id));
  if (index >= 0) {
    list[index] = customer;
  } else {
    list.unshift(customer);
  }
  writeInvoiceData({ ...current, Customers: list });
}

export function makeNewCustomer() {
  return createEmptyCustomer(`CUS-${Date.now().toString().slice(-5)}`, today());
}

/** Prefer API; fall back to local cache. */
export async function fetchWorkspaceFromApi(): Promise<InvoiceData | null> {
  try {
    const res = await invoiceApi.workspace();
    const data: InvoiceData = {
      Invoices: res.data?.Invoices || [],
      Customers: res.data?.Customers || [],
      Payments: res.data?.Payments || [],
      Received: res.data?.Received || [],
    };
    writeInvoiceData(data);
    return data;
  } catch {
    return null;
  }
}

export async function saveCustomerToApi(
  customer: CustomerRecord,
  editingId?: string | null,
) {
  const id = editingId || customer.id;
  try {
    if (editingId) {
      const res = await invoiceApi.updateCustomer(id, customer);
      saveCustomerRecord(normalizeCustomer(res.customer), id);
      return normalizeCustomer(res.customer);
    }
    const res = await invoiceApi.createCustomer(customer);
    saveCustomerRecord(normalizeCustomer(res.customer));
    return normalizeCustomer(res.customer);
  } catch (error) {
    // Offline / API down — keep local behaviour
    saveCustomerRecord(customer, editingId);
    throw error;
  }
}

export async function fetchCustomerFromApi(id: string): Promise<CustomerRecord | null> {
  try {
    const res = await invoiceApi.getCustomer(id);
    const customer = normalizeCustomer(res.customer);
    saveCustomerRecord(customer, id);
    return customer;
  } catch {
    return getCustomerById(id);
  }
}
