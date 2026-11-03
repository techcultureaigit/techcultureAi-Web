"use client";

import CustomerSearchSelect, {
  type CustomerOption,
} from "@/components/CustomerSearchSelect";
import DevFillButton from "@/components/DevFillButton";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { AppIcon, Icons } from "@/components/icons";
import { invoiceApi } from "@/lib/api";
import { fakeInvoice } from "@/lib/devFaker";
import type { InvoiceDocument } from "@/lib/invoiceTypes";
import { gstStateFromNumber } from "@/lib/gstStates";
import {
  calcGrandTotal,
  emptyCommissionRow,
  emptyLineItem,
  normalizeInvoice,
} from "@/lib/invoiceUtils";
import "./InvoiceForm.css";

type Props = {
  value: InvoiceDocument;
  customers: CustomerOption[];
  onChange: (next: InvoiceDocument) => void;
  isNew?: boolean;
};

function formatCustomerAddress(address?: {
  attention?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
} | null) {
  if (!address) return "";
  return [
    address.attention,
    address.street1,
    address.street2,
    [address.city, address.state, address.pinCode].filter(Boolean).join(", "),
    address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function InvoiceForm({ value, customers, onChange, isNew = false }: Props) {
  const invoice = normalizeInvoice(value);

  function patch(next: Partial<InvoiceDocument>) {
    const merged = normalizeInvoice({ ...invoice, ...next, id: invoice.id });
    onChange(merged);
  }

  function mergeCustomerIntoInvoice(
    prev: InvoiceDocument,
    customer: {
      name?: string;
      companyName?: string;
      displayName?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      mobile?: string;
      workPhone?: string;
      gstNumber?: string;
      gstTreatment?: string;
      placeOfSupply?: string;
      billingAddress?: {
        attention?: string;
        street1?: string;
        street2?: string;
        city?: string;
        state?: string;
        pinCode?: string;
        country?: string;
        phone?: string;
      } | null;
    },
  ): InvoiceDocument {
    const name =
      (customer.companyName || "").trim() ||
      (customer.name || "").trim() ||
      (customer.displayName || "").trim() ||
      [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim() ||
      prev.billTo.name;
    const email = String(customer.email || "").trim().toLowerCase();
    const phone = String(
      customer.phone || customer.mobile || customer.workPhone || "",
    ).trim();
    const gstin = String(customer.gstNumber || customer.gstTreatment || "").trim();
    const address = formatCustomerAddress(customer.billingAddress);
    const stateName =
      customer.placeOfSupply || customer.billingAddress?.state || "";
    const matched = gstin ? gstStateFromNumber(gstin) : null;

    return normalizeInvoice({
      ...prev,
      name,
      email: email || prev.email || "",
      phone: phone || prev.phone || "",
      billTo: {
        ...prev.billTo,
        name,
        email: email || prev.billTo.email || "",
        phone: phone || customer.billingAddress?.phone || prev.billTo.phone || "",
        address: address || prev.billTo.address || "",
        gstin: gstin || prev.billTo.gstin || "",
        stateName: matched?.stateName || stateName || prev.billTo.stateName || "",
        stateCode: matched?.code || prev.billTo.stateCode || "",
      },
      id: prev.id,
    });
  }

  async function handleCustomerSelect(option: CustomerOption) {
    let next = mergeCustomerIntoInvoice(normalizeInvoice(value), {
      name: option.name,
      email: option.email,
      phone: option.phone,
    });
    onChange(next);

    try {
      const res = await invoiceApi.getCustomer(option.id);
      if (res?.customer) {
        next = mergeCustomerIntoInvoice(next, {
          ...res.customer,
          name: res.customer.name || option.name,
          email: res.customer.email || option.email,
          phone: res.customer.phone || option.phone,
        });
        onChange(next);
      }
    } catch {
      // List data already applied above
    }
  }

  function updateBillTo(key: keyof InvoiceDocument["billTo"], val: string) {
    const billTo = { ...invoice.billTo, [key]: val };
    if (key === "gstin") {
      const matched = gstStateFromNumber(val);
      if (matched) {
        billTo.stateCode = matched.code;
        billTo.stateName = matched.stateName;
      }
    }
    patch({
      billTo,
      name: key === "name" ? val : billTo.name,
      email: key === "email" ? val : billTo.email,
      phone: key === "phone" ? val : billTo.phone,
    });
  }

  function updateLine(
    id: string,
    key: "description" | "qty" | "rate",
    val: string,
  ) {
    const lineItems = invoice.lineItems.map((item) =>
      item.id === id
        ? {
            ...item,
            [key]: key === "description" ? val : Number(val || 0),
          }
        : item,
    );
    patch({
      lineItems,
      amount: calcGrandTotal(lineItems, invoice.gstApplicable, invoice.gstPercent),
    });
  }

  function updateCommission(
    id: string,
    key: "month" | "users" | "ratePerUser" | "commissionPercent",
    val: string,
  ) {
    const commissionRows = invoice.commissionRows.map((row) =>
      row.id === id
        ? {
            ...row,
            [key]: key === "month" ? val : Number(val || 0),
          }
        : row,
    );
    patch({ commissionRows });
  }

  return (
    <div className="invoice-editor-layout">
      <div className="invoice-editor-form">
        <div className="invoice-editor-card">
          <h3>Invoice details</h3>
          <div className="invoice-editor-grid">
            <label>
              Invoice No
              <input
                value={isNew ? "Auto-generated on create" : invoice.invoiceNo}
                readOnly
                disabled
                title="Invoice number is generated automatically"
              />
              <small style={{ color: "#98a1af", fontWeight: 500 }}>
                {isNew
                  ? "Number is assigned automatically when you create the invoice."
                  : "Invoice number cannot be changed."}
              </small>
            </label>
            <label>
              Invoice date
              <input
                type="date"
                value={invoice.date || ""}
                onChange={(e) => patch({ date: e.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={invoice.status || "Pending"}
                onChange={(e) => patch({ status: e.target.value })}
              >
                {["Pending", "Paid", "Overdue", "Draft"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <small style={{ color: "#98a1af", fontWeight: 500 }}>
                New invoices email the customer as Pending. Paid sends a one-time confirmation email.
              </small>
            </label>
            {(invoice.status || "").toLowerCase() === "paid" ? (
              <label className="full-field">
                Payment proof (screenshot)
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      patch({ paymentProofUrl: null, paymentProofName: null });
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      patch({
                        paymentProofUrl: String(reader.result || ""),
                        paymentProofName: file.name,
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                {invoice.paymentProofName ? (
                  <small style={{ color: "#7d8796" }}>Attached: {invoice.paymentProofName}</small>
                ) : null}
              </label>
            ) : null}
            <label>
              GST applicable
              <select
                value={invoice.gstApplicable ? "yes" : "no"}
                onChange={(e) => {
                  const gstApplicable = e.target.value === "yes";
                  patch({
                    gstApplicable,
                    gstNote: gstApplicable ? `${invoice.gstPercent || 18}%` : "Not Applicable",
                    gstPercent: gstApplicable ? invoice.gstPercent || 18 : 0,
                  });
                }}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
            {invoice.gstApplicable ? (
              <label>
                GST %
                <input
                  type="number"
                  min="0"
                  value={invoice.gstPercent}
                  onChange={(e) =>
                    patch({
                      gstPercent: Number(e.target.value || 0),
                      gstNote: `${e.target.value || 0}%`,
                    })
                  }
                />
              </label>
            ) : (
              <label>
                GST note
                <input
                  value={invoice.gstNote}
                  onChange={(e) => patch({ gstNote: e.target.value })}
                />
              </label>
            )}
          </div>
        </div>

        <div className="invoice-editor-card">
          <h3>Bill To / Customer</h3>
          <div className="invoice-editor-grid">
            <label className="invoice-span-2">
              Select customer
              <CustomerSearchSelect
                customers={customers}
                value={invoice.billTo.name}
                placeholder="Select customer"
                onSelect={(customer) => {
                  void handleCustomerSelect(customer);
                }}
              />
            </label>
            <label className="invoice-span-2">
              Customer / company name
              <input
                required
                value={invoice.billTo.name}
                onChange={(e) => updateBillTo("name", e.target.value)}
                placeholder="Customer legal name"
              />
            </label>
            <label className="invoice-span-2">
              Address
              <textarea
                value={invoice.billTo.address}
                onChange={(e) => updateBillTo("address", e.target.value)}
                placeholder="Billing address"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={invoice.billTo.email || ""}
                onChange={(e) => updateBillTo("email", e.target.value)}
                placeholder="name@company.com"
              />
            </label>
            <label>
              Phone
              <input
                value={invoice.billTo.phone || ""}
                onChange={(e) => updateBillTo("phone", e.target.value)}
              />
            </label>
            <label>
              GST number
              <input
                value={invoice.billTo.gstin || ""}
                onChange={(e) => updateBillTo("gstin", e.target.value.toUpperCase())}
                placeholder="e.g. 22AAAAA0000A1Z5"
                maxLength={15}
              />
            </label>
            <label>
              CIN
              <input
                value={invoice.billTo.cin || ""}
                onChange={(e) => updateBillTo("cin", e.target.value)}
              />
            </label>
            <label>
              State name
              <input
                value={invoice.billTo.stateName || ""}
                onChange={(e) => updateBillTo("stateName", e.target.value)}
              />
            </label>
            <label>
              State code
              <input
                value={invoice.billTo.stateCode || ""}
                onChange={(e) => updateBillTo("stateCode", e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="invoice-editor-card">
          <h3>Line items</h3>
          <div className="invoice-line-list">
            {invoice.lineItems.map((item) => (
              <div key={item.id} className="invoice-line-row">
                <div className="invoice-line-grid">
                  <label>
                    Description
                    <input
                      required
                      value={item.description}
                      onChange={(e) => updateLine(item.id, "description", e.target.value)}
                      placeholder="Service / item description"
                    />
                  </label>
                  <label>
                    Qty
                    <input
                      type="number"
                      min="0"
                      value={item.qty}
                      onChange={(e) => updateLine(item.id, "qty", e.target.value)}
                    />
                  </label>
                  <label>
                    Rate (INR)
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) => updateLine(item.id, "rate", e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="invoice-line-remove"
                    title="Remove line"
                    onClick={() => {
                      const lineItems =
                        invoice.lineItems.length > 1
                          ? invoice.lineItems.filter((row) => row.id !== item.id)
                          : invoice.lineItems;
                      patch({ lineItems });
                    }}
                  >
                    <AppIcon icon={Icons.trash} size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="invoice-editor-actions-inline">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => patch({ lineItems: [...invoice.lineItems, emptyLineItem()] })}
            >
              <AppIcon icon={Icons.plus} size={14} /> Add line
            </button>
          </div>
        </div>

        <div className="invoice-editor-card">
          <h3>Commission bifurcation (optional)</h3>
          <div className="invoice-commission-list">
            {invoice.commissionRows.map((row) => (
              <div key={row.id} className="invoice-commission-row">
                <div className="invoice-commission-grid">
                  <label>
                    Month
                    <input
                      value={row.month}
                      onChange={(e) => updateCommission(row.id, "month", e.target.value)}
                      placeholder="1st Month"
                    />
                  </label>
                  <label>
                    Users
                    <input
                      type="number"
                      min="0"
                      value={row.users}
                      onChange={(e) => updateCommission(row.id, "users", e.target.value)}
                    />
                  </label>
                  <label>
                    Rate/User
                    <input
                      type="number"
                      min="0"
                      value={row.ratePerUser}
                      onChange={(e) => updateCommission(row.id, "ratePerUser", e.target.value)}
                    />
                  </label>
                  <label>
                    Comm %
                    <input
                      type="number"
                      min="0"
                      value={row.commissionPercent}
                      onChange={(e) =>
                        updateCommission(row.id, "commissionPercent", e.target.value)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="invoice-line-remove"
                    title="Remove row"
                    onClick={() =>
                      patch({
                        commissionRows: invoice.commissionRows.filter((item) => item.id !== row.id),
                      })
                    }
                  >
                    <AppIcon icon={Icons.trash} size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="invoice-editor-actions-inline">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                patch({ commissionRows: [...invoice.commissionRows, emptyCommissionRow()] })
              }
            >
              <AppIcon icon={Icons.plus} size={14} /> Add commission row
            </button>
          </div>
        </div>

        <div className="invoice-editor-card">
          <h3>Notes</h3>
          <div className="invoice-editor-grid">
            <label className="invoice-span-2">
              Additional notes
              <textarea
                value={invoice.notes || ""}
                onChange={(e) => patch({ notes: e.target.value, description: e.target.value })}
                placeholder="Optional notes shown on invoice"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="invoice-editor-preview">
        <div className="invoice-editor-preview-label">
          <span>LIVE PREVIEW</span>
          <DevFillButton
            label="Fill fake data"
            onClick={() => onChange(fakeInvoice(invoice))}
          />
        </div>
        <div className="invoice-editor-preview-frame">
          <InvoiceTemplate invoice={invoice} />
        </div>
      </div>
    </div>
  );
}
