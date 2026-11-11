"use client";

import {
  COMPANY_PROFILE,
  resolveCompanyProfile,
} from "@/lib/companyDefaults";
import type { InvoiceDocument } from "@/lib/invoiceTypes";
import {
  amountInWords,
  calcGrandTotal,
  calcSubTotal,
  commissionPartnerAmount,
  commissionUserAmount,
  formatInr,
  formatInvoiceDate,
  lineAmount,
  resolveGstBreakdown,
} from "@/lib/invoiceUtils";
import "./InvoiceTemplate.css";

type Props = {
  invoice: InvoiceDocument;
  companySettings?: {
    businessAddress?: string;
    businessCin?: string;
    businessLegalName?: string;
  } | null;
};

export default function InvoiceTemplate({ invoice, companySettings }: Props) {
  const company = resolveCompanyProfile(companySettings);
  const subTotal = calcSubTotal(invoice.lineItems || []);
  const billTo = invoice.billTo || { name: invoice.name, address: "" };
  const gst = resolveGstBreakdown({
    subTotal,
    gstApplicable: invoice.gstApplicable,
    gstPercent: invoice.gstPercent,
    buyerStateCode: billTo.stateCode,
    buyerGstin: billTo.gstin,
    placeOfSupply: invoice.placeOfSupply,
    sellerStateCode: company.stateCode,
  });
  const grandTotal = calcGrandTotal(
    invoice.lineItems || [],
    invoice.gstApplicable,
    invoice.gstPercent,
  );
  const invoiceNo = invoice.invoiceNo || "—";

  return (
    <div className="tc-invoice">
      <div className="tc-invoice-top">
        <div className="tc-invoice-brand">
          <img
            className="tc-invoice-logo-img"
            src="/techculture-logo.png"
            alt="TechCulture AI"
          />
          <small>{company.legalName}</small>
          <div className="tc-invoice-company-under-name">
            <p>CIN: {company.cin}</p>
            <p>{company.address}</p>
          </div>
        </div>
        <div className="tc-invoice-meta">
          <h1>INVOICE</h1>
        </div>
      </div>

      <div className="tc-invoice-bill-meta">
        <div className="tc-invoice-party">
          <h3>BILL TO</h3>
          <b>{billTo.name || "—"}</b>
          {billTo.address
            ? String(billTo.address)
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => <p key={line}>{line}</p>)
            : null}
          {billTo.gstin ? <p>GST number: {billTo.gstin}</p> : null}
          {billTo.stateName ? (
            <p>
              State Name: {billTo.stateName}
              {billTo.stateCode ? `, Code: ${billTo.stateCode}` : ""}
            </p>
          ) : null}
          {billTo.cin ? <p>CIN: {billTo.cin}</p> : null}
          {billTo.email ? <p>E-Mail: {billTo.email}</p> : null}
          {billTo.phone ? <p>Phone: {billTo.phone}</p> : null}
        </div>

        <div className="tc-invoice-meta-grid">
          <div className="tc-invoice-meta-col">
            <p>
              Invoice No.: <strong>{invoiceNo}</strong>
            </p>
            <p>
              Invoice Date: <strong>{formatInvoiceDate(invoice.date)}</strong>
            </p>
            <p>
              Due Date: <strong>{formatInvoiceDate(invoice.dueDate)}</strong>
            </p>
          </div>
          <div className="tc-invoice-meta-col">
            <p>
              Place of Supply:{" "}
              <strong>{invoice.placeOfSupply || "Delhi (07)"}</strong>
            </p>
            <p>
              Account Manager: <strong>{invoice.accountManager || "—"}</strong>
            </p>
            <p>
              Invoice Duration: <strong>{invoice.invoiceDuration || "—"}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="tc-invoice-table-wrap">
        <table className="tc-invoice-table">
          <thead>
            <tr>
              <th style={{ width: 42 }}>Sl</th>
              <th>Description</th>
              <th className="center" style={{ width: 88 }}>
                HSN/SAC
              </th>
              <th className="center" style={{ width: 56 }}>
                Qty
              </th>
              <th className="num" style={{ width: 96 }}>
                Rate (INR)
              </th>
              <th className="num" style={{ width: 110 }}>
                Amount (INR)
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoice.lineItems || []).map((item, index) => (
              <tr key={item.id}>
                <td className="center">{index + 1}</td>
                <td>{item.description || "—"}</td>
                <td className="center">{item.hsnSac || "—"}</td>
                <td className="center">{item.qty || 0}</td>
                <td className="num">{formatInr(item.rate)}</td>
                <td className="num">{formatInr(lineAmount(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tc-invoice-summary-row-wrap">
        <p className="tc-invoice-words">
          Amount Chargeable (in words): <b>{amountInWords(grandTotal)}</b>
        </p>
        <div className="tc-invoice-summary">
          <div className="tc-invoice-summary-card">
            <div className="tc-invoice-summary-row">
              <span>Taxable Amount</span>
              <strong>{formatInr(subTotal)}</strong>
            </div>
            {gst.mode === "cgst_sgst" ? (
              <>
                <div className="tc-invoice-summary-row">
                  <span>
                    CGST{gst.halfPercent} ({gst.halfPercent}%)
                  </span>
                  <strong>{formatInr(gst.cgst)}</strong>
                </div>
                <div className="tc-invoice-summary-row">
                  <span>
                    SGST{gst.halfPercent} ({gst.halfPercent}%)
                  </span>
                  <strong>{formatInr(gst.sgst)}</strong>
                </div>
              </>
            ) : gst.mode === "igst" ? (
              <div className="tc-invoice-summary-row">
                <span>
                  IGST{gst.gstPercent} ({gst.gstPercent}%)
                </span>
                <strong>{formatInr(gst.igst)}</strong>
              </div>
            ) : (
              <div className="tc-invoice-summary-row">
                <span>GST</span>
                <strong>{invoice.gstNote || "Not Applicable"}</strong>
              </div>
            )}
            <div className="tc-invoice-summary-row grand">
              <span>Total</span>
              <strong>{formatInr(grandTotal)}</strong>
            </div>
          </div>
        </div>
      </div>

      {(invoice.commissionRows || []).length > 0 ? (
        <>
          <h3 className="tc-invoice-section-title">Commission Bifurcation</h3>
          <div className="tc-invoice-table-wrap">
            <table className="tc-invoice-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th className="center">No. of Users</th>
                  <th className="num">Rate/User</th>
                  <th className="num">Total User Amount</th>
                  <th className="num">Partner Commission</th>
                </tr>
              </thead>
              <tbody>
                {invoice.commissionRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.month || "—"}</td>
                    <td className="center">{row.users || 0}</td>
                    <td className="num">{formatInr(row.ratePerUser)}</td>
                    <td className="num">{formatInr(commissionUserAmount(row))}</td>
                    <td className="num">
                      {row.commissionPercent}% = {formatInr(commissionPartnerAmount(row))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <div className="tc-invoice-footer-grid">
        <div className="tc-invoice-boxes">
          <div className="tc-invoice-box">
            <h4>BANK DETAILS</h4>
            <p>Beneficiary Name: {company.bank.beneficiaryName}</p>
            <p>Bank Name: {company.bank.bankName}</p>
            <p>Branch: {company.bank.branch}</p>
            <p>Account Type: {company.bank.accountType}</p>
            <p>Account No.: {company.bank.accountNo}</p>
            <p>IFSC Code: {company.bank.ifsc}</p>
          </div>
          <div className="tc-invoice-box">
            <h4>DECLARATION</h4>
            <p>{company.declaration}</p>
            {invoice.notes ? <p style={{ marginTop: 10 }}>Notes: {invoice.notes}</p> : null}
          </div>
        </div>

        <div className="tc-invoice-sign">
          <div className="tc-invoice-sign-block">
            <p className="tc-invoice-sign-for">
              For TECHCULTURE TECHNOLOGIES PRIVATE LIMITED
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="tc-invoice-signature-img"
              src="/SIGNETURE.png"
              alt="Authorised signature"
            />
            <p className="tc-invoice-sign-title">Authorised Signatory</p>
            <small>{formatInvoiceDate(invoice.date)}</small>
          </div>
        </div>
      </div>
    </div>
  );
}
