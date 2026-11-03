"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CustomerForm, { type CustomerRecord } from "@/components/CustomerForm";
import { AppIcon, Icons } from "@/components/icons";
import { makeNewCustomer, saveCustomerToApi } from "@/lib/invoiceStorage";
import { toast } from "@/lib/notify";

export default function NewCustomerPage() {
  const router = useRouter();
  const initial = useMemo(() => makeNewCustomer(), []);
  const [saving, setSaving] = useState(false);

  function goBack() {
    router.push("/customers");
  }

  async function handleSave(customer: CustomerRecord) {
    try {
      setSaving(true);
      await saveCustomerToApi(customer);
      router.push("/customers");
    } catch (error) {
      toast.warning(
        error instanceof Error
          ? `${error.message}\n\nSaved locally as fallback.`
          : "Saved locally as fallback.",
        "Saved locally",
      );
      router.push("/customers");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      active="Customers"
      crumb="Customers / New"
      title="New customer"
      description="Add business or individual customer details, addresses, and contacts."
      actions={
        <button type="button" className="btn btn-secondary" onClick={goBack} disabled={saving}>
          <AppIcon icon={Icons.back} size={14} /> Back to Customers
        </button>
      }
    >
      <div className="page-content customer-page-body" style={{ maxWidth: "none", width: "100%" }}>
        <CustomerForm
          variant="page"
          initial={initial}
          editing={false}
          onCancel={goBack}
          onSave={handleSave}
        />
      </div>
    </AppShell>
  );
}
