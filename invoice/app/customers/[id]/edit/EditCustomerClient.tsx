"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CustomerForm, {
  createEmptyCustomer,
  type CustomerRecord,
} from "@/components/CustomerForm";
import { AppIcon, Icons } from "@/components/icons";
import {
  fetchCustomerFromApi,
  saveCustomerToApi,
  today,
} from "@/lib/invoiceStorage";
import { toast } from "@/lib/notify";

export default function EditCustomerClient() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id || "");
  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [missing, setMissing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await fetchCustomerFromApi(id);
      if (cancelled) return;
      if (!found) {
        setMissing(true);
        setCustomer(
          createEmptyCustomer(id || `CUS-${Date.now().toString().slice(-5)}`, today()),
        );
        return;
      }
      setCustomer(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function goBack() {
    router.push("/customers");
  }

  async function handleSave(next: CustomerRecord) {
    try {
      setSaving(true);
      await saveCustomerToApi(next, missing ? null : id);
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

  if (!customer) {
    return (
      <AppShell
        active="Customers"
        crumb="Customers / Edit"
        title="Edit customer"
        description="Update customer details, addresses, and contacts."
      >
        <div className="page-content">
          <p>Loading customer…</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      active="Customers"
      crumb="Customers / Edit"
      title="Edit customer"
      description="Update customer details, addresses, and contacts."
      actions={
        <button type="button" className="btn btn-secondary" onClick={goBack} disabled={saving}>
          <AppIcon icon={Icons.back} size={14} /> Back to Customers
        </button>
      }
    >
      <div className="page-content customer-page-body" style={{ maxWidth: "none", width: "100%" }}>
        {missing ? (
          <p className="form-error" style={{ marginBottom: 16 }}>
            Customer not found. You can still save this as a new record.
          </p>
        ) : null}

        <CustomerForm
          variant="page"
          initial={customer}
          editing={!missing}
          onCancel={goBack}
          onSave={handleSave}
        />
      </div>
    </AppShell>
  );
}
