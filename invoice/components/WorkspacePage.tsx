"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { IconType } from "react-icons";
import AppShell from "@/components/AppShell";
import CustomerDetailModal from "@/components/CustomerDetailModal";
import { normalizeCustomer, type CustomerRecord } from "@/components/CustomerForm";
import DevFillButton from "@/components/DevFillButton";
import InvoiceDetailModal from "@/components/InvoiceDetailModal";
import InvoiceForm from "@/components/InvoiceForm";
import ReportsPage from "@/components/ReportsPage";
import { AppIcon, Icons } from "@/components/icons";
import { getToken } from "@/lib/auth";
import { invoiceApi } from "@/lib/api";
import { fakeInvoice, fakePayment } from "@/lib/devFaker";
import { sendInvoiceMail } from "@/lib/invoiceMail";
import {
  DEFAULT_INVOICE_MAIL_SETTINGS,
  normalizeInvoiceMailSettings,
  type InvoiceMailSettings,
} from "@/lib/invoiceSettings";
import { confirmDialog, toast } from "@/lib/notify";
import type { InvoiceDocument } from "@/lib/invoiceTypes";
import { fetchWorkspaceFromApi } from "@/lib/invoiceStorage";
import { createBlankInvoice, normalizeInvoice } from "@/lib/invoiceUtils";
import { routeForSection, type Section } from "@/lib/routes";

type RecordItem = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  amount?: number;
  status?: string;
  date?: string;
  category?: string;
  description?: string;
} & Partial<CustomerRecord> &
  Partial<InvoiceDocument>;

const emptyData: Record<string, RecordItem[]> = {
  Invoices: [],
  Customers: [],
  Payments: [],
};
const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n||0);
const today=()=>new Date().toISOString().slice(0,10);

export default function WorkspacePage({ section }: { section: Section }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data,setData]=useState<Record<string,RecordItem[]>>(emptyData);
  const [search,setSearch]=useState("");
  const [dateSort,setDateSort]=useState<"newest"|"oldest">("newest");
  const [modal,setModal]=useState(false);
  const [editing,setEditing]=useState<RecordItem|null>(null);
  const [viewing,setViewing]=useState<RecordItem|null>(null);
  const [viewingCustomer,setViewingCustomer]=useState<CustomerRecord|null>(null);
  const [sendingId,setSendingId]=useState<string|null>(null);
  const [markingPaidId,setMarkingPaidId]=useState<string|null>(null);
  const [installPrompt,setInstallPrompt]=useState<any>(null);
  const [form,setForm]=useState<RecordItem>({id:"",name:"",email:"",phone:"",amount:0,status:"Pending",date:"",category:"",description:""});
  const [invoiceForm,setInvoiceForm]=useState<InvoiceDocument>(() => ({
    id: "",
    invoiceNo: "",
    name: "",
    email: "",
    phone: "",
    amount: 0,
    status: "Pending",
    date: "",
    dueDate: "",
    placeOfSupply: "Delhi (07)",
    accountManager: "",
    invoiceDuration: "",
    category: "",
    description: "",
    billTo: { name: "", address: "", gstin: "", stateName: "", stateCode: "", email: "", phone: "" },
    lineItems: [{ id: "line-placeholder", description: "", qty: 1, rate: 0, hsnSac: "" }],
    commissionRows: [],
    gstApplicable: false,
    gstPercent: 0,
    gstNote: "Not Applicable",
    notes: "",
    firstSentAt: null,
    lastReminderAt: null,
    paidEmailSentAt: null,
    paymentProofUrl: null,
    paymentProofName: null,
    kind: "invoice",
  }));
  const [mailSettings,setMailSettings]=useState<InvoiceMailSettings>(DEFAULT_INVOICE_MAIL_SETTINGS);
  const [settingsSaving,setSettingsSaving]=useState(false);

  function goTo(next: Section, query?: string) {
    router.push(routeForSection(next, query));
  }

  function upsertInvoice(next: InvoiceDocument, editingId?: string | null) {
    setData((old) => ({
      ...old,
      Invoices: editingId
        ? (old.Invoices || []).map((r) => (r.id === editingId ? next : r))
        : [next, ...(old.Invoices || []).filter((r) => r.id !== next.id)],
    }));
    setViewing((prev) => (prev && prev.id === next.id ? next : prev));
  }

  async function runInvoiceAutomation() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("/api/invoice-automation/run", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const remote = await fetchWorkspaceFromApi();
      if (remote) {
        setData({
          Invoices: (remote.Invoices || []) as RecordItem[],
          Customers: (remote.Customers || []) as RecordItem[],
          Payments: (remote.Payments || []) as RecordItem[],
        });
      }
    } catch (error) {
      console.warn("Invoice automation skipped:", error);
    }
  }

  useEffect(()=>{
    let cancelled = false;
    (async () => {
      const remote = await fetchWorkspaceFromApi();
      if (cancelled) return;
      if (remote) {
        setData({
          Invoices: (remote.Invoices || []) as RecordItem[],
          Customers: (remote.Customers || []) as RecordItem[],
          Payments: (remote.Payments || []) as RecordItem[],
        });
      } else {
        // No API / empty DB — start clean (clear old local demo cache)
        try { localStorage.removeItem("tc-invoice-data"); } catch {}
        setData(emptyData);
      }
      try {
        const settingsRes = await invoiceApi.getSettings();
        if (!cancelled) {
          setMailSettings(normalizeInvoiceMailSettings(settingsRes.settings));
        }
      } catch (error) {
        console.warn("Settings load failed:", error);
      }
      if (!cancelled) void runInvoiceAutomation();
    })();
    const handler=(e:Event)=>{e.preventDefault();setInstallPrompt(e)};
    window.addEventListener("beforeinstallprompt",handler);
    const timer = window.setInterval(() => {
      void runInvoiceAutomation();
    }, 60 * 60 * 1000);
    return ()=>{
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener("beforeinstallprompt",handler);
    };
  },[]);
  useEffect(()=>{
    const q = searchParams.get("q") || "";
    setSearch(q);
  }, [searchParams, section]);
  useEffect(()=>{try{localStorage.setItem("tc-invoice-data",JSON.stringify(data))}catch{}},[data]);
  const records=data[section]||[];
  const filtered=useMemo(()=>{
    const list = records.filter((r) =>
      Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase()),
    );
    if (section !== "Invoices") return list;
    return [...list].sort((a, b) => {
      const da = String(a.date || "");
      const db = String(b.date || "");
      const cmp = da.localeCompare(db);
      if (cmp !== 0) return dateSort === "newest" ? -cmp : cmp;
      // tie-break by invoice no / id
      const ia = String(a.invoiceNo || a.id || "");
      const ib = String(b.invoiceNo || b.id || "");
      return dateSort === "newest" ? ib.localeCompare(ia) : ia.localeCompare(ib);
    });
  },[records,search,section,dateSort]);
  const invoices=data.Invoices||[];
  const customers=useMemo(()=>{
    return (data.Customers||[])
      .map((c)=>{
        const name=(
          (c.name||"").trim()||
          (c.companyName||"").trim()||
          [c.firstName,c.lastName].filter(Boolean).join(" ").trim()||
          (c.displayName||"").trim()
        );
        if(!name) return null;
        const contactEmail = Array.isArray(c.contactPersons)
          ? c.contactPersons.find((p)=>p?.email)?.email || ""
          : "";
        return {
          id:c.id,
          name,
          email:(c.email||contactEmail||"").trim().toLowerCase(),
          phone:c.phone||c.mobile||c.workPhone||"",
        };
      })
      .filter((c): c is {id:string;name:string;email:string;phone:string} => Boolean(c));
  },[data.Customers]);
  const totalInvoices=invoices.reduce((a,r)=>a+(r.amount||0),0);
  const outstanding=invoices.filter(r=>r.status!=="Paid").reduce((a,r)=>a+(r.amount||0),0);
  const paid=invoices.filter(r=>r.status==="Paid").reduce((a,r)=>a+(r.amount||0),0);
  const customerCount=(data.Customers||[]).length;
  function openNew(){
    if(section==="Customers"){
      router.push("/customers/new");
      return;
    }
    setEditing(null);
    if(section==="Invoices"){
      setInvoiceForm({
        ...createBlankInvoice(data.Invoices || []),
        invoiceNo: "Auto",
      });
      setModal(true);
      return;
    }
    setForm({id:`${section.slice(0,3).toUpperCase()}-${Date.now().toString().slice(-5)}`,name:"",email:"",phone:"",amount:0,status:"Active",date:today(),category:"",description:""});
    setModal(true);
  }
  function openEdit(r:RecordItem){
    if(section==="Customers"){
      router.push(`/customers/${encodeURIComponent(r.id)}/edit`);
      return;
    }
    setViewing(null);
    setEditing(r);
    if(section==="Invoices" || r.kind === "invoice" || r.lineItems){
      setInvoiceForm(normalizeInvoice(r as InvoiceDocument));
      setModal(true);
      return;
    }
    setForm({...r});
    setModal(true);
  }
  function openInvoiceDetails(r: RecordItem) {
    setViewingCustomer(null);
    setViewing(r);
  }

  async function openCustomerDetails(r: RecordItem) {
    setViewing(null);
    try {
      const res = await invoiceApi.getCustomer(r.id);
      setViewingCustomer(normalizeCustomer(res.customer));
    } catch {
      setViewingCustomer(
        normalizeCustomer({
          ...r,
          id: r.id,
          name: r.name || "",
          email: r.email || "",
          phone: r.phone || "",
        }),
      );
    }
  }
  async function save(e:React.FormEvent){
    e.preventDefault();
    if(section==="Invoices"){
      const isNew = !editing;
      let saved = normalizeInvoice(invoiceForm);
      if(!saved.billTo.name.trim()){
        toast.warning("Customer / Bill To name is required.");
        return;
      }
      if(!saved.lineItems.some((item)=>item.description.trim())){
        toast.warning("Add at least one line item description.");
        return;
      }
      // First create always starts as Pending; invoice No is always backend-generated
      if (isNew) {
        saved = { ...saved, status: "Pending", invoiceNo: "" };
      }

      const prevStatus = (editing?.status || "").toLowerCase();
      const nextStatus = (saved.status || "").toLowerCase();
      const becomingPaid = nextStatus === "paid" && prevStatus !== "paid";

      try {
        const res = editing
          ? await invoiceApi.updateInvoice(editing.id, {
              ...saved,
              // Keep existing invoice number on edit
              invoiceNo: editing.invoiceNo || saved.invoiceNo,
            })
          : await invoiceApi.createInvoice((() => {
              const { invoiceNo: _ignored, ...payload } = saved;
              return payload;
            })());
        let next = normalizeInvoice(res.invoice);

        // Auto email on first create (Pending/Overdue)
        if (isNew && ["pending", "overdue"].includes((next.status || "").toLowerCase())) {
          const email = (next.billTo.email || next.email || "").trim();
          if (!email) {
            toast.warning(
              "Invoice saved, but no customer email found — payment email was not sent.",
              "Invoice created",
            );
          } else {
            try {
              const mail = await sendInvoiceMail(next, "payment_request");
              const sentAt = mail.sentAt || new Date().toISOString();
              next = {
                ...next,
                firstSentAt: next.firstSentAt || mail.patch?.firstSentAt || sentAt,
                lastReminderAt: mail.patch?.lastReminderAt || sentAt,
              };
              toast.success(`Invoice created and emailed to ${email}`, "Invoice sent");
            } catch (mailError) {
              toast.error(
                `Invoice saved, but email failed: ${
                  mailError instanceof Error ? mailError.message : "unknown error"
                }`,
                "Email failed",
              );
            }
          }
        }

        // One-time paid confirmation email
        if (becomingPaid && !next.paidEmailSentAt) {
          const email = (next.billTo.email || next.email || "").trim();
          if (email) {
              try {
              const mail = await sendInvoiceMail({ ...next, status: "Paid" }, "paid");
              next = {
                ...next,
                status: "Paid",
                paidEmailSentAt: mail.patch?.paidEmailSentAt || mail.sentAt || new Date().toISOString(),
              };
            } catch (mailError) {
              toast.error(
                `Marked Paid, but confirmation email failed: ${
                  mailError instanceof Error ? mailError.message : "unknown error"
                }`,
                "Email failed",
              );
            }
          }
        }

        upsertInvoice(next, editing?.id || null);
        setModal(false);
        if (!isNew) toast.success("Invoice changes saved.", "Saved");
      } catch (error) {
        // Keep UX working offline with local cache
        upsertInvoice(saved, editing?.id || null);
        setModal(false);
        toast.warning("Saved locally — API save failed.", "Offline save");
        console.warn("Invoice API save failed, saved locally:", error);
      }
      return;
    }
    if(section==="Payments"){
      try {
        const res = editing
          ? await invoiceApi.updatePayment(editing.id, form)
          : await invoiceApi.createPayment(form);
        const next = res.payment;
        setData((old)=>({
          ...old,
          Payments: editing
            ? (old.Payments || []).map((r)=>r.id===editing.id?next:r)
            : [next, ...(old.Payments || [])],
        }));
        setModal(false);
      } catch (error) {
        setData(old=>({...old,Payments:editing?(old.Payments||[]).map(r=>r.id===editing.id?form:r):[form,...(old.Payments||[])]}));
        setModal(false);
        console.warn("Payment API save failed, saved locally:", error);
      }
      return;
    }
    setData(old=>({...old,[section]:editing?(old[section]||[]).map(r=>r.id===editing.id?form:r):[form,...(old[section]||[])]}));
    setModal(false);
  }
  async function remove(id:string){
    const ok = await confirmDialog({
      title: "Delete record?",
      message: "This cannot be undone. The record will be permanently removed.",
      confirmLabel: "Delete",
      cancelLabel: "Keep",
      tone: "error",
    });
    if (!ok) return;
    try {
      if(section==="Invoices") await invoiceApi.deleteInvoice(id);
      else if(section==="Payments") await invoiceApi.deletePayment(id);
      else if(section==="Customers") await invoiceApi.deleteCustomer(id);
      toast.success("Record deleted.", "Deleted");
    } catch (error) {
      console.warn("API delete failed, removing locally:", error);
      toast.warning("Removed locally — API delete failed.", "Offline delete");
    }
    setData(old=>({...old,[section]:(old[section]||[]).filter(r=>r.id!==id)}));
  }
  function canSendInvoice(invoice: RecordItem) {
    const status = (invoice.status || "").toLowerCase();
    return status === "pending" || status === "overdue";
  }
  async function sendInvoice(invoice: RecordItem, kind: "payment_request" | "reminder" = "reminder") {
    if (!canSendInvoice(invoice)) {
      toast.warning("Mail can only be sent for Pending or Overdue invoices.");
      return;
    }
    const matched = customers.find(
      (c) => c.name.toLowerCase() === (invoice.name || "").toLowerCase(),
    );
    const normalized = normalizeInvoice(invoice as InvoiceDocument);
    const email = (normalized.email || matched?.email || "").trim();
    if (!email) {
      toast.warning(
        `No email found for ${invoice.name || "this customer"}. Add an email on the customer record first.`,
        "Email missing",
      );
      return;
    }
    const ok = await confirmDialog({
      title: kind === "reminder" ? "Send reminder?" : "Send invoice?",
      message: `Send ${kind === "reminder" ? "reminder for" : "invoice"} ${normalized.invoiceNo || normalized.id} to ${normalized.name}?`,
      details: [
        { label: "Email", value: email },
        { label: "Amount", value: money(normalized.amount || 0) },
      ],
      confirmLabel: "Send email",
      cancelLabel: "Cancel",
      tone: "info",
    });
    if (!ok) return;

    try {
      setSendingId(invoice.id);
      const mail = await sendInvoiceMail(normalized, kind);
      const sentAt = mail.sentAt || new Date().toISOString();
      const next: InvoiceDocument = {
        ...normalized,
        firstSentAt: normalized.firstSentAt || mail.patch?.firstSentAt || sentAt,
        lastReminderAt: mail.patch?.lastReminderAt || sentAt,
      };
      upsertInvoice(next, next.id);
      toast.success(mail.message || `Invoice emailed to ${email}`, "Email sent");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send invoice email",
        "Email failed",
      );
    } finally {
      setSendingId(null);
    }
  }

  async function markInvoicePaid(
    invoice: RecordItem,
    proof: { paymentProofUrl: string; paymentProofName: string } | null,
  ) {
    const normalized = normalizeInvoice(invoice as InvoiceDocument);
    if (!canSendInvoice(normalized) && (normalized.status || "").toLowerCase() !== "pending") {
      // allow pending/overdue only
    }
    const status = (normalized.status || "").toLowerCase();
    if (status !== "pending" && status !== "overdue") {
      toast.warning("Only Pending or Overdue invoices can be marked Paid.");
      return;
    }

    try {
      setMarkingPaidId(normalized.id);
      let next: InvoiceDocument = {
        ...normalized,
        status: "Paid",
        paymentProofUrl: proof?.paymentProofUrl || normalized.paymentProofUrl || null,
        paymentProofName: proof?.paymentProofName || normalized.paymentProofName || null,
      };

      const saved = await invoiceApi.updateInvoice(next.id, next);
      next = normalizeInvoice(saved.invoice);

      if (!next.paidEmailSentAt) {
        const email = (next.billTo.email || next.email || "").trim();
        if (email) {
          try {
            const mail = await sendInvoiceMail({ ...next, status: "Paid" }, "paid");
            next = {
              ...next,
              paidEmailSentAt:
                mail.patch?.paidEmailSentAt || mail.sentAt || new Date().toISOString(),
            };
          } catch (mailError) {
            toast.error(
              `Marked Paid, but confirmation email failed: ${
                mailError instanceof Error ? mailError.message : "unknown error"
              }`,
              "Email failed",
            );
          }
        }
      }

      upsertInvoice(next, next.id);
      setViewing(null);
      toast.success("Invoice marked as Paid.", "Payment confirmed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to mark invoice as Paid",
        "Update failed",
      );
    } finally {
      setMarkingPaidId(null);
    }
  }

  async function saveMailSettings() {
    try {
      setSettingsSaving(true);
      const payload = {
        ...mailSettings,
        // Empty password means keep existing on backend
        smtpPass: mailSettings.smtpPass.trim(),
        smtpFromEmail: mailSettings.smtpFromEmail.trim().toLowerCase(),
        smtpUser: (mailSettings.smtpUser || mailSettings.smtpFromEmail).trim().toLowerCase(),
        smtpFromName: mailSettings.smtpFromName.trim() || mailSettings.businessName,
      };
      if (!payload.smtpFromEmail) {
        toast.warning("SMTP From Email is required.", "Missing email");
        return;
      }
      const res = await invoiceApi.updateSettings(payload);
      setMailSettings({
        ...normalizeInvoiceMailSettings(res.settings),
        smtpPass: "",
      });
      toast.success("Email / SMTP settings saved.", "Settings saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings",
        "Save failed",
      );
    } finally {
      setSettingsSaving(false);
    }
  }
  function downloadCSV(){const rows=[["ID","Name","Email","Amount","Status","Date"],...filtered.map(r=>[r.id,r.name,r.email||"",String(r.amount||0),r.status||"",r.date||""])];const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`${section.toLowerCase().replaceAll(" ","-")}.csv`;a.click();URL.revokeObjectURL(a.href)}
  const pageTitle = section === "Dashboard" ? "Good morning, Subham 👋" : section;
  const pageDescription = section === "Dashboard"
    ? "Here’s what’s happening with your business today."
    : section === "Invoices"
      ? "Create invoices (auto-email Pending), collect payment proof, then mark Paid."
      : section === "Reports"
        ? "Full billing reports for one customer or all customers, with CSV export."
      : section === "Settings"
        ? "Control reminder and overdue email automation for unpaid invoices."
      : `Manage your ${section.toLowerCase()} and keep everything running smoothly.`;
  const pageActions = (
    <>
      {installPrompt && (
        <button
          className="btn btn-secondary"
          type="button"
          onClick={async () => {
            await installPrompt.prompt();
            setInstallPrompt(null);
          }}
        >
          <AppIcon icon={Icons.download} size={14} /> Install app
        </button>
      )}
      {section !== "Dashboard" && section !== "Reports" && section !== "Settings" && (
        <button className="btn btn-primary" type="button" onClick={openNew}>
          <AppIcon icon={Icons.plus} size={14} />
          {section === "Invoices"
            ? "Create invoice"
            : section === "Customers"
              ? "Add customer"
              : "Add payment"}
        </button>
      )}
    </>
  );
  return (
    <AppShell
      active={section}
      crumb={section}
      title={pageTitle}
      description={pageDescription}
      actions={pageActions}
    >
      <div className="page-content">
      {section==="Dashboard"?<><div className="stat-grid"><Stat title="Total revenue" value={money(paid)} note="12.8% from last month" icon={Icons.trendUp} tone="green"/><Stat title="Outstanding" value={money(outstanding)} note={`${invoices.filter(r=>r.status!=="Paid").length} invoices need attention`} icon={Icons.clock} tone="orange"/><Stat title="Total invoices" value={String(invoices.length).padStart(2,"0")} note={`${invoices.filter(r=>r.status==="Paid").length} paid successfully`} icon={Icons.invoices} tone="purple"/><Stat title="Customers" value={String(customerCount).padStart(2,"0")} note="Active customer records" icon={Icons.customers} tone="blue"/></div>
      <div className="dashboard-grid"><section className="panel revenue-panel"><div className="panel-heading"><div><h2>Revenue overview</h2><p>Keep an eye on your income over time</p></div><select aria-label="Revenue period"><option>Last 7 months</option><option>Last 30 days</option><option>This year</option></select></div><div className="chart-legend"><span><i className="legend-orange"/>Revenue</span><span><i className="legend-pale"/>Pending</span></div><div className="chart"><div className="chart-y"><span>₹80k</span><span>₹60k</span><span>₹40k</span><span>₹20k</span><span>₹0</span></div><div className="chart-bars">{[{m:"Apr",a:52,b:27},{m:"May",a:70,b:39},{m:"Jun",a:60,b:30},{m:"Jul",a:85,b:45},{m:"Aug",a:64,b:34},{m:"Sep",a:94,b:50},{m:"Oct",a:78,b:32}].map(x=><div className="bar-group" key={x.m}><div className="bars"><i style={{height:`${x.a}%`}}/><i style={{height:`${x.b}%`}}/></div><span>{x.m}</span></div>)}</div></div></section>
      <section className="panel"><div className="panel-heading"><div><h2>Invoice status</h2><p>Quick snapshot of your invoices</p></div><button className="text-link" onClick={()=>goTo("Invoices")}>View all <AppIcon icon={Icons.external} size={12}/></button></div><div className="donut-wrap"><div className="donut"><div><strong>{invoices.length}</strong><span>Total invoices</span></div></div></div><div className="status-list"><StatusLine label="Paid" count={invoices.filter(r=>r.status==="Paid").length} color="dot-green"/><StatusLine label="Pending" count={invoices.filter(r=>r.status==="Pending").length} color="dot-orange"/><StatusLine label="Overdue" count={invoices.filter(r=>r.status==="Overdue").length} color="dot-red"/></div></section></div>
      <section className="panel recent-panel"><div className="panel-heading"><div><h2>Recent invoices</h2><p>Your latest billing activity</p></div><button className="text-link" onClick={()=>goTo("Invoices")}>See all invoices <AppIcon icon={Icons.external} size={12}/></button></div><RecordTable records={invoices.slice(0,4)} section="Invoices" onEdit={openEdit} onDelete={remove} onSend={sendInvoice} onRowClick={openInvoiceDetails} sendingId={sendingId} compact/></section>
      </>:section==="Reports"?(
        <ReportsPage
          invoices={invoices}
          customers={customers}
          onOpenInvoice={(inv) => {
            const full = invoices.find((r) => r.id === inv.id);
            if (full) openInvoiceDetails(full);
          }}
        />
      ):section==="Settings"?<div className="settings-grid"><section className="panel settings-panel"><h2>Invoice email automation</h2><p>Control automatic payment reminders and overdue status for Pending invoices.</p><div className="setting-row"><div><b>Auto email reminders</b><small>Send reminder emails for Pending / Overdue invoices.</small></div><label style={{display:"flex",alignItems:"center",gap:8,margin:0,fontWeight:600}}><input type="checkbox" checked={mailSettings.autoEmailEnabled} onChange={(e)=>setMailSettings((s)=>({...s,autoEmailEnabled:e.target.checked}))}/> {mailSettings.autoEmailEnabled?"On":"Off"}</label></div><label>Reminder every (days)<input type="number" min={1} max={30} value={mailSettings.reminderIntervalDays} onChange={(e)=>setMailSettings((s)=>({...s,reminderIntervalDays:Number(e.target.value)||2}))}/></label><label>Mark overdue after (days from first email)<input type="number" min={1} max={90} value={mailSettings.overdueAfterDays} onChange={(e)=>setMailSettings((s)=>({...s,overdueAfterDays:Number(e.target.value)||5}))}/></label><p style={{fontSize:11,color:"#98a1af",margin:"12px 0 0"}}>Defaults: reminder every 2 days · overdue after 5 days. Creating an invoice emails the customer once with Pending status. Marking Paid sends one confirmation email.</p><button className="btn btn-primary" type="button" disabled={settingsSaving} onClick={()=>void saveMailSettings()}>{settingsSaving?"Saving...":"Save email settings"}</button><button className="btn btn-secondary" type="button" style={{marginLeft:8}} onClick={()=>void runInvoiceAutomation()}>Run automation now</button></section><section className="panel settings-panel"><h2>Company on invoice</h2><p>Shown on invoice preview, PDF attachment, and emails. Default is Regal Building, Connaught Place.</p><label>Legal name<input value={mailSettings.businessLegalName} onChange={(e)=>setMailSettings((s)=>({...s,businessLegalName:e.target.value}))} placeholder="TECHCULTURE TECHNOLOGIES PRIVATE LIMITED"/></label><label>CIN<input value={mailSettings.businessCin} onChange={(e)=>setMailSettings((s)=>({...s,businessCin:e.target.value}))} placeholder="U62010DL2026PTC460892"/></label><label className="full-field">Business address<textarea rows={3} value={mailSettings.businessAddress} onChange={(e)=>setMailSettings((s)=>({...s,businessAddress:e.target.value}))} placeholder="50, 51, Second Floor, Regal Building, Connaught Place, New Delhi, Central Delhi, Delhi, India, 110001"/></label><button className="btn btn-primary" type="button" disabled={settingsSaving} onClick={()=>void saveMailSettings()}>{settingsSaving?"Saving...":"Save company details"}</button></section><section className="panel settings-panel"><h2>Email sender (SMTP)</h2><p>Dynamically control the Gmail account used to send invoice emails. Saved in database (overrides .env).</p><label>Sender display name<input value={mailSettings.smtpFromName} onChange={(e)=>setMailSettings((s)=>({...s,smtpFromName:e.target.value,businessName:e.target.value}))} placeholder="TechCulture Technologies"/></label><label>SMTP From Email<input type="email" value={mailSettings.smtpFromEmail} onChange={(e)=>setMailSettings((s)=>({...s,smtpFromEmail:e.target.value}))} placeholder="subhamkumarsahoo9090@gmail.com"/></label><label>SMTP User (Gmail login)<input type="email" value={mailSettings.smtpUser} onChange={(e)=>setMailSettings((s)=>({...s,smtpUser:e.target.value}))} placeholder="same as from email usually"/></label><label>Gmail App Password<input type="password" value={mailSettings.smtpPass} onChange={(e)=>setMailSettings((s)=>({...s,smtpPass:e.target.value}))} placeholder={mailSettings.smtpPassConfigured?"Leave blank to keep saved password":"16-character app password"} autoComplete="new-password"/><small style={{color:"#98a1af",fontWeight:500}}>{mailSettings.smtpPassConfigured?"Password already saved. Enter a new one only to change it.":"Generate an App Password from Google Account → Security."}</small></label><label>SMTP Host<input value={mailSettings.smtpHost} onChange={(e)=>setMailSettings((s)=>({...s,smtpHost:e.target.value}))}/></label><label>SMTP Port<input type="number" value={mailSettings.smtpPort} onChange={(e)=>setMailSettings((s)=>({...s,smtpPort:Number(e.target.value)||587}))}/></label><button className="btn btn-primary" type="button" disabled={settingsSaving} onClick={()=>void saveMailSettings()}>{settingsSaving?"Saving...":"Save sender settings"}</button></section></div>:<section className="panel table-panel"><div className="table-toolbar"><div className="search-box"><AppIcon icon={Icons.search} size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${section.toLowerCase()}...`}/><kbd>⌘ K</kbd></div><div className="table-actions">{section==="Invoices"?(<label className="invoice-sort-label">Sort by date<select value={dateSort} onChange={(e)=>setDateSort(e.target.value==="oldest"?"oldest":"newest")} aria-label="Sort invoices by date"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label>):null}<button className="btn btn-secondary" onClick={downloadCSV}><AppIcon icon={Icons.download} size={14}/> Export</button>{section!=="Customers"&&section!=="Invoices"&&<button className="btn btn-primary" onClick={openNew}><AppIcon icon={Icons.plus} size={14}/> Add new</button>}</div></div><RecordTable records={filtered} section={section} onEdit={openEdit} onDelete={remove} onSend={sendInvoice} onRowClick={section==="Invoices"?openInvoiceDetails:section==="Customers"?openCustomerDetails:undefined} sendingId={sendingId}/><div className="table-footer"><span>Showing <b>{filtered.length}</b> of <b>{records.length}</b> records</span><div><button disabled><AppIcon icon={Icons.back} size={14}/></button><button className="page-number">1</button><button disabled><AppIcon icon={Icons.external} size={14}/></button></div></div></section>}
      <footer className="footer"><span>© 2026 TechCulture Finance</span><span><i/> All changes saved locally <b>·</b> Made for your business</span></footer></div>
    {viewing && (
      <InvoiceDetailModal
        invoice={normalizeInvoice(viewing as InvoiceDocument)}
        companySettings={mailSettings}
        onClose={() => setViewing(null)}
        onEdit={() => openEdit(viewing)}
        canSend={canSendInvoice(viewing)}
        sending={sendingId === viewing.id}
        markingPaid={markingPaidId === viewing.id}
        onSend={() => {
          void sendInvoice(viewing, "reminder");
        }}
        onMarkPaid={(proof) => {
          void markInvoicePaid(viewing, proof);
        }}
      />
    )}
    {viewingCustomer && (
      <CustomerDetailModal
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        onEdit={() => {
          const id = viewingCustomer.id;
          setViewingCustomer(null);
          router.push(`/customers/${encodeURIComponent(id)}/edit`);
        }}
      />
    )}
    {modal&&(
      <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}>
        <form className={`record-modal ${section==="Invoices"?"invoice-editor-modal":""}`} onSubmit={save}>
          <div className="modal-top">
            <div>
              <span className="eyebrow">{editing?"UPDATE RECORD":"NEW RECORD"}</span>
              <h2>{editing?"Edit":"Add"} {section==="Invoices"?"invoice":"payment"}</h2>
            </div>
            <button type="button" className="modal-close" onClick={()=>setModal(false)} aria-label="Close"><AppIcon icon={Icons.close} size={18}/></button>
          </div>
          {section==="Invoices" ? (
            <InvoiceForm
              value={invoiceForm}
              customers={customers}
              onChange={setInvoiceForm}
              isNew={!editing}
              companySettings={mailSettings}
            />
          ) : (
            <div className="form-grid">
              <label className="full-field">
                Name / customer
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter name"
                />
              </label>
              <label>Amount (₹)<input type="number" min="0" required value={form.amount||0} onChange={e=>setForm({...form,amount:Number(e.target.value)})}/></label>
              <label>Status<select value={form.status||"Active"} onChange={e=>setForm({...form,status:e.target.value})}>{["Completed","Processing","Failed"].map(s=><option key={s}>{s}</option>)}</select></label>
              <label>Date<input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})}/></label>
              <label>Category<input value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})} placeholder="e.g. Software"/></label>
              <label className="full-field">Notes / description<textarea value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Add a note (optional)"/></label>
            </div>
          )}
          <div className="modal-actions">
            {section==="Payments" ? (
              <DevFillButton
                label="Fill fake data"
                onClick={() => setForm(fakePayment(form))}
              />
            ) : null}
            {section==="Invoices" ? (
              <DevFillButton
                label="Fill fake data"
                onClick={() => setInvoiceForm(fakeInvoice(invoiceForm))}
              />
            ) : null}
            <button type="button" className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button>
            <button className="btn btn-primary" type="submit">{editing?"Save changes":section==="Invoices"?"Create invoice":"Create record"}</button>
          </div>
        </form>
      </div>
    )}
    </AppShell>
  );
}

function Stat({title,value,note,icon,tone}:{title:string;value:string;note:string;icon:IconType;tone:string}){return <div className="stat-card"><div className="stat-top"><span>{title}</span><span className={`stat-icon ${tone}`}><AppIcon icon={icon} size={18}/></span></div><strong>{value}</strong><small>{note}</small></div>}
function StatusLine({label,count,color}:{label:string;count:number;color:string}){return <div className="status-line"><span><i className={color}/>{label}</span><b>{count}</b></div>}
function RecordTable({
  records,
  section,
  onEdit,
  onDelete,
  onSend,
  onRowClick,
  sendingId = null,
  compact = false,
}: {
  records: RecordItem[];
  section: string;
  onEdit: (r: RecordItem) => void;
  onDelete: (id: string) => void;
  onSend?: (r: RecordItem) => void | Promise<void>;
  onRowClick?: (r: RecordItem) => void;
  sendingId?: string | null;
  compact?: boolean;
}) {
  const colSpan = section === "Invoices" ? 6 : 5;
  const clickable = Boolean(onRowClick);
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>
              {section === "Invoices" ? "INVOICE" : section === "Customers" ? "CUSTOMER" : "PAYMENT"}{" "}
              DETAILS
            </th>
            {section !== "Customers" && <th>AMOUNT</th>}
            {section === "Customers" && <th>CONTACT</th>}
            <th>DATE / CATEGORY</th>
            <th>STATUS</th>
            {section === "Invoices" && <th>SEND</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr
              key={r.id}
              className={clickable ? "clickable-row" : undefined}
              onClick={clickable ? () => onRowClick?.(r) : undefined}
            >
              <td>
                <div className="record-main">
                  <div className={`record-avatar av-${i % 4}`}>{r.name.slice(0, 1).toUpperCase()}</div>
                  <div>
                    <b>{r.name}</b>
                    <small>
                      {r.invoiceNo || r.id}
                      {r.email ? ` · ${r.email}` : ""}
                    </small>
                  </div>
                </div>
              </td>
              {section !== "Customers" && <td className="amount-cell">{money(r.amount || 0)}</td>}
              {section === "Customers" && <td>{r.phone || r.email || "—"}</td>}
              <td>{r.date || r.category || "—"}</td>
              <td>
                <span
                  className={`status status-${(r.status || "active").toLowerCase().replaceAll(" ", "-")}`}
                >
                  {r.status || "Active"}
                </span>
              </td>
              {section === "Invoices" && (
                <td>
                  {(() => {
                    const sendable =
                      (r.status || "").toLowerCase() === "pending" ||
                      (r.status || "").toLowerCase() === "overdue";
                    const isSending = sendingId === r.id;
                    return (
                      <button
                        type="button"
                        className="btn btn-send"
                        disabled={!sendable || isSending}
                        title={
                          sendable
                            ? r.email
                              ? `Send invoice to ${r.email}`
                              : "Send invoice to customer email"
                            : "Mail can only be sent for Pending or Overdue invoices"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!sendable || isSending) return;
                          void onSend?.(r);
                        }}
                      >
                        <AppIcon icon={Icons.send} size={13} /> {isSending ? "Sending..." : "Send"}
                      </button>
                    );
                  })()}
                </td>
              )}
              <td>
                <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                  <button title="Edit record" onClick={() => onEdit(r)}>
                    <AppIcon icon={Icons.edit} size={14} />
                  </button>
                  {!compact && (
                    <button title="Delete record" onClick={() => onDelete(r.id)}>
                      <AppIcon icon={Icons.trash} size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={colSpan} className="empty-state">
                <span>
                  <AppIcon icon={Icons.search} size={22} />
                </span>
                <b>No records found</b>
                <small>Try a different search or add a new record.</small>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
