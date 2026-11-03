"use client";

import { useState } from "react";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { AppIcon, Icons } from "@/components/icons";
import type { InvoiceDocument } from "@/lib/invoiceTypes";
import { normalizeInvoice } from "@/lib/invoiceUtils";

type Props = {
  invoice: Partial<InvoiceDocument> & { id: string };
  canSend?: boolean;
  sending?: boolean;
  markingPaid?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSend: () => void;
  onMarkPaid?: (proof: { paymentProofUrl: string; paymentProofName: string } | null) => void;
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function InvoiceDetailModal({
  invoice,
  canSend = false,
  sending = false,
  markingPaid = false,
  onClose,
  onEdit,
  onSend,
  onMarkPaid,
}: Props) {
  const doc = normalizeInvoice(invoice);
  const status = (doc.status || "").toLowerCase();
  const canMarkPaid = status === "pending" || status === "overdue";
  const [proofName, setProofName] = useState(doc.paymentProofName || "");
  const [proofUrl, setProofUrl] = useState(doc.paymentProofUrl || "");
  const [showPaidForm, setShowPaidForm] = useState(false);

  async function onProofChange(file: File | null) {
    if (!file) {
      setProofName("");
      setProofUrl("");
      return;
    }
    const url = await readFileAsDataUrl(file);
    setProofName(file.name);
    setProofUrl(url);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="record-modal invoice-detail-modal" role="dialog" aria-modal="true">
        <div className="modal-top">
          <div>
            <span className="eyebrow">INVOICE DETAILS</span>
            <h2>{doc.invoiceNo || doc.id}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <AppIcon icon={Icons.close} size={18} />
          </button>
        </div>

        <InvoiceTemplate invoice={doc} />

        {doc.paymentProofUrl ? (
          <div className="invoice-detail-notes" style={{ marginTop: 14 }}>
            <small>Payment proof</small>
            <p>
              <a href={doc.paymentProofUrl} target="_blank" rel="noreferrer">
                {doc.paymentProofName || "View attached proof"}
              </a>
            </p>
            {doc.paymentProofUrl.startsWith("data:image") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={doc.paymentProofUrl}
                alt="Payment proof"
                style={{ maxWidth: "100%", marginTop: 10, borderRadius: 10, border: "1px solid #eef1f5" }}
              />
            ) : null}
          </div>
        ) : null}

        {showPaidForm && canMarkPaid ? (
          <div className="invoice-detail-notes" style={{ marginTop: 14 }}>
            <small>Mark as Paid</small>
            <p style={{ marginBottom: 10 }}>
              Attach the payment proof screenshot you received from the customer, then confirm.
            </p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                void onProofChange(e.target.files?.[0] || null);
              }}
            />
            {proofName ? (
              <p style={{ marginTop: 8, fontSize: 12, color: "#445264" }}>Selected: {proofName}</p>
            ) : null}
            <div className="modal-actions" style={{ marginTop: 14, borderTop: 0, paddingTop: 0 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPaidForm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={markingPaid}
                onClick={() =>
                  onMarkPaid?.(
                    proofUrl
                      ? { paymentProofUrl: proofUrl, paymentProofName: proofName || "payment-proof" }
                      : null,
                  )
                }
              >
                {markingPaid ? "Updating..." : "Confirm Paid + send email"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {canSend ? (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={sending}
              onClick={onSend}
            >
              <AppIcon icon={Icons.send} size={14} /> {sending ? "Sending..." : "Send reminder"}
            </button>
          ) : null}
          {canMarkPaid && onMarkPaid && !showPaidForm ? (
            <button type="button" className="btn btn-secondary" onClick={() => setShowPaidForm(true)}>
              Mark as Paid
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" onClick={onEdit}>
            <AppIcon icon={Icons.edit} size={14} /> Edit invoice
          </button>
        </div>
      </div>
    </div>
  );
}
