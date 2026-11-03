"use client";

import { useEffect } from "react";
import {
  normalizeCustomer,
  type AddressFields,
  type CustomerRecord,
} from "@/components/CustomerForm";
import { AppIcon, Icons } from "@/components/icons";
import "./CustomerDetailModal.css";

type Props = {
  customer: Partial<CustomerRecord> & { id: string };
  onClose: () => void;
  onEdit: () => void;
};

function Field({ label, value }: { label: string; value?: string | number | boolean | null }) {
  const text =
    value === true
      ? "Yes"
      : value === false
        ? "No"
        : value === undefined || value === null || value === ""
          ? "—"
          : String(value);

  return (
    <div className="customer-detail-field">
      <span>{label}</span>
      <b>{text}</b>
    </div>
  );
}

function AddressCard({ title, address }: { title: string; address: AddressFields }) {
  const lines = [
    address.attention,
    address.street1,
    address.street2,
    [address.city, address.state, address.pinCode].filter(Boolean).join(", "),
    address.country,
    address.phone ? `Phone: ${address.phone}` : "",
    address.fax ? `Fax: ${address.fax}` : "",
  ].filter(Boolean);

  return (
    <div className="customer-detail-address">
      <h4>{title}</h4>
      {lines.length ? lines.map((line) => <p key={line}>{line}</p>) : <p>—</p>}
    </div>
  );
}

export default function CustomerDetailModal({ customer, onClose, onEdit }: Props) {
  const doc = normalizeCustomer({
    ...customer,
    id: customer.id,
  });

  const displayName =
    doc.companyName ||
    [doc.firstName, doc.lastName].filter(Boolean).join(" ") ||
    doc.displayName ||
    doc.name ||
    doc.id;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="record-modal customer-detail-modal" role="dialog" aria-modal="true">
        <div className="modal-top">
          <div>
            <span className="eyebrow">CUSTOMER DETAILS</span>
            <h2>{displayName}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <AppIcon icon={Icons.close} size={18} />
          </button>
        </div>

        <div className="customer-detail-scroll">
          <div className="customer-detail-hero">
            <div className="customer-detail-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
            <div>
              <strong>{displayName}</strong>
              <p>
                {doc.customerType} · {doc.status || "Active"} · {doc.id}
              </p>
              <p>{doc.email || "No email"}{doc.phone ? ` · ${doc.phone}` : ""}</p>
            </div>
          </div>

          <h3 className="customer-detail-section">Basic info</h3>
          <div className="customer-detail-grid">
            <Field label="Customer type" value={doc.customerType} />
            <Field label="Salutation" value={doc.salutation} />
            <Field label="First name" value={doc.firstName} />
            <Field label="Last name" value={doc.lastName} />
            <Field label="Company name" value={doc.companyName} />
            <Field label="Display name" value={doc.displayName} />
            <Field label="Email" value={doc.email} />
            <Field label="Work phone" value={doc.workPhone} />
            <Field label="Mobile" value={doc.mobile} />
            <Field label="Currency" value={doc.currency} />
            <Field label="GST number" value={doc.gstNumber || doc.gstTreatment} />
            <Field label="Place of supply" value={doc.placeOfSupply} />
            <Field label="PAN" value={doc.pan} />
            <Field label="Payment terms" value={doc.paymentTerms} />
            <Field label="Price list" value={doc.priceList} />
            <Field label="Portal enabled" value={doc.enablePortal} />
            <Field label="Portal language" value={doc.portalLanguage} />
            <Field label="Created" value={doc.date} />
          </div>

          <h3 className="customer-detail-section">Addresses</h3>
          <div className="customer-detail-addresses">
            <AddressCard title="Billing address" address={doc.billingAddress} />
            <AddressCard
              title={doc.sameAsBilling ? "Shipping address (same as billing)" : "Shipping address"}
              address={doc.shippingAddress}
            />
          </div>

          <h3 className="customer-detail-section">Contact persons</h3>
          {doc.contactPersons?.length ? (
            <div className="customer-detail-contacts">
              {doc.contactPersons.map((person) => (
                <div key={person.id} className="customer-detail-contact">
                  <b>
                    {person.salutation} {person.firstName} {person.lastName}
                  </b>
                  <p>{person.email || "No email"}</p>
                  <p>
                    {[person.workPhone, person.mobile].filter(Boolean).join(" · ") || "No phone"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="customer-detail-empty">No contact persons</p>
          )}

          {doc.documents?.length ? (
            <>
              <h3 className="customer-detail-section">Documents</h3>
              <ul className="customer-detail-docs">
                {doc.documents.map((docItem) => (
                  <li key={docItem.id}>
                    {docItem.name}
                    <small>
                      {" "}
                      ({Math.round((docItem.size || 0) / 1024)} KB)
                    </small>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn-primary" onClick={onEdit}>
            <AppIcon icon={Icons.edit} size={14} /> Edit customer
          </button>
        </div>
      </div>
    </div>
  );
}
