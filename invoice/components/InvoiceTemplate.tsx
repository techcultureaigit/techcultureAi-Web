"use client";

import { COMPANY_PROFILE } from "@/lib/companyDefaults";
import type { InvoiceDocument } from "@/lib/invoiceTypes";
import {
  amountInWords,
  calcGrandTotal,
  calcGstAmount,
  calcSubTotal,
  commissionPartnerAmount,
  commissionUserAmount,
  formatInr,
  formatInvoiceDate,
  lineAmount,
} from "@/lib/invoiceUtils";
import "./InvoiceTemplate.css";

type Props = {
  invoice: InvoiceDocument;
};

export default function InvoiceTemplate({ invoice }: Props) {
  const company = COMPANY_PROFILE;
  const subTotal = calcSubTotal(invoice.lineItems || []);
  const gstAmount = calcGstAmount(subTotal, invoice.gstApplicable, invoice.gstPercent);
  const grandTotal = calcGrandTotal(
    invoice.lineItems || [],
    invoice.gstApplicable,
    invoice.gstPercent,
  );
  const billTo = invoice.billTo || { name: invoice.name, address: "" };

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
        </div>
        <div className="tc-invoice-meta">
          <h1>INVOICE</h1>
          <p>
            Invoice Date: <strong>{formatInvoiceDate(invoice.date)}</strong>
          </p>
          <p>
            Invoice No:{" "}
            <strong>
              {!invoice.invoiceNo || invoice.invoiceNo === "Auto"
                ? "Auto-generated"
                : invoice.invoiceNo}
            </strong>
          </p>
        </div>
      </div>

      <div className="tc-invoice-parties">
        <div className="tc-invoice-party">
          <h3>BILL FROM</h3>
          <b>{company.legalName}</b>
          <p>CIN: {company.cin}</p>
          <p>{company.address}</p>
        </div>
        <div className="tc-invoice-party">
          <h3>BILL TO</h3>
          <b>{billTo.name || "—"}</b>
          {billTo.address ? <p>{billTo.address}</p> : null}
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
      </div>

      <div className="tc-invoice-table-wrap">
        <table className="tc-invoice-table">
          <thead>
            <tr>
              <th style={{ width: 48 }}>Sl</th>
              <th>Description</th>
              <th className="center" style={{ width: 70 }}>
                Qty
              </th>
              <th className="num" style={{ width: 110 }}>
                Rate (INR)
              </th>
              <th className="num" style={{ width: 120 }}>
                Amount (INR)
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoice.lineItems || []).map((item, index) => (
              <tr key={item.id}>
                <td className="center">{index + 1}</td>
                <td>{item.description || "—"}</td>
                <td className="center">{item.qty || 0}</td>
                <td className="num">{formatInr(item.rate)}</td>
                <td className="num">{formatInr(lineAmount(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tc-invoice-summary">
        <div className="tc-invoice-summary-card">
          <div className="tc-invoice-summary-row">
            <span>Sub Total</span>
            <strong>{formatInr(subTotal)}</strong>
          </div>
          <div className="tc-invoice-summary-row">
            <span>GST</span>
            <strong>
              {invoice.gstApplicable ? formatInr(gstAmount) : invoice.gstNote || "Not Applicable"}
            </strong>
          </div>
          <div className="tc-invoice-summary-row grand">
            <span>Grand Total</span>
            <strong>{formatInr(grandTotal)}</strong>
          </div>
        </div>
      </div>

      <p className="tc-invoice-words">
        Amount Chargeable (in words): <b>{amountInWords(grandTotal)}</b>
      </p>

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tc-invoice-signatory-img"
            src="/authorised-signatory.png"
            alt="For TECHCULTURE TECHNOLOGIES PRIVATE LIMITED — Authorised Signatory"
          />
          <small>{formatInvoiceDate(invoice.date)}</small>
        </div>
      </div>
    </div>
  );
}
