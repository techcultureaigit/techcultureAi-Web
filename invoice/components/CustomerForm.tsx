"use client";

import { useEffect, useState } from "react";
import DevFillButton from "@/components/DevFillButton";
import { AppIcon, Icons } from "@/components/icons";
import { fakeCustomer } from "@/lib/devFaker";
import { gstStateFromNumber } from "@/lib/gstStates";
import "./CustomerForm.css";

export type AddressFields = {
  attention: string;
  country: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  fax: string;
};

export type ContactPerson = {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  mobile: string;
};

export type CustomerDocument = {
  id: string;
  name: string;
  size: number;
  type: string;
};

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date?: string;
  status?: string;
  customerType: "Business" | "Individual";
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  currency: string;
  workPhone: string;
  mobile: string;
  gstTreatment: string;
  gstNumber: string;
  placeOfSupply: string;
  pan: string;
  paymentTerms: string;
  priceList: string;
  enablePortal: boolean;
  portalLanguage: string;
  documents: CustomerDocument[];
  billingAddress: AddressFields;
  shippingAddress: AddressFields;
  sameAsBilling: boolean;
  contactPersons: ContactPerson[];
};

type TabId = "address" | "contacts";

const SALUTATIONS = ["Mr.", "Mrs.", "Ms.", "Miss", "Dr."];
const CURRENCIES = [
  "INR - Indian Rupee",
  "USD - US Dollar",
  "EUR - Euro",
  "GBP - British Pound",
  "AED - UAE Dirham",
];
const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const PAYMENT_TERMS = [
  "Due on Receipt",
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due end of the month",
  "Due end of next month",
];
const PRICE_LISTS = ["None", "Retail", "Wholesale", "VIP", "Custom"];
const PORTAL_LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Marathi", "Gujarati"];
const COUNTRIES = ["India", "United States", "United Arab Emirates", "United Kingdom", "Singapore"];

const emptyAddress = (): AddressFields => ({
  attention: "",
  country: "India",
  street1: "",
  street2: "",
  city: "",
  state: "",
  pinCode: "",
  phone: "",
  fax: "",
});

const emptyContact = (): ContactPerson => ({
  id: `CP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  salutation: "Mr.",
  firstName: "",
  lastName: "",
  email: "",
  workPhone: "",
  mobile: "",
});

export function createEmptyCustomer(id: string, date: string): CustomerRecord {
  return {
    id,
    name: "",
    email: "",
    phone: "",
    date,
    status: "Active",
    customerType: "Business",
    salutation: "Mr.",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    currency: "INR - Indian Rupee",
    workPhone: "",
    mobile: "",
    gstTreatment: "",
    gstNumber: "",
    placeOfSupply: "",
    pan: "",
    paymentTerms: "Due on Receipt",
    priceList: "None",
    enablePortal: false,
    portalLanguage: "English",
    documents: [],
    billingAddress: emptyAddress(),
    shippingAddress: emptyAddress(),
    sameAsBilling: true,
    contactPersons: [emptyContact()],
  };
}

export function normalizeCustomer(input: Partial<CustomerRecord> & { id: string }): CustomerRecord {
  const base = createEmptyCustomer(input.id, input.date || new Date().toISOString().slice(0, 10));
  return {
    ...base,
    ...input,
    name:
      input.companyName ||
      [input.firstName, input.lastName].filter(Boolean).join(" ").trim() ||
      input.displayName ||
      input.name ||
      "",
    email: input.email || "",
    phone: input.mobile || input.workPhone || input.phone || "",
    customerType: input.customerType === "Individual" ? "Individual" : "Business",
    gstNumber: input.gstNumber || input.gstTreatment || "",
    gstTreatment: input.gstNumber || input.gstTreatment || "",
    documents: input.documents || [],
    billingAddress: { ...emptyAddress(), ...(input.billingAddress || {}) },
    shippingAddress: { ...emptyAddress(), ...(input.shippingAddress || {}) },
    contactPersons:
      input.contactPersons && input.contactPersons.length > 0
        ? input.contactPersons
        : [emptyContact()],
  };
}

type Props = {
  initial: CustomerRecord;
  editing: boolean;
  onCancel: () => void;
  onSave: (customer: CustomerRecord) => void;
  variant?: "modal" | "page";
};

export default function CustomerForm({
  initial,
  editing,
  onCancel,
  onSave,
  variant = "modal",
}: Props) {
  const [form, setForm] = useState<CustomerRecord>(normalizeCustomer(initial));
  const [tab, setTab] = useState<TabId>("address");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(normalizeCustomer(initial));
    setTab("address");
    setError("");
  }, [initial]);

  function customerDisplayName(record: CustomerRecord) {
    const full = [record.firstName, record.lastName].filter(Boolean).join(" ").trim();
    return record.companyName.trim() || full || record.name || record.displayName || "";
  }

  function update<K extends keyof CustomerRecord>(key: K, value: CustomerRecord[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "companyName" || key === "firstName" || key === "lastName") {
        next.name = customerDisplayName(next);
      }
      if (key === "email") next.email = String(value);
      if (key === "mobile" || key === "workPhone") {
        next.phone = String(next.mobile || next.workPhone || "");
      }
      if (key === "gstNumber") {
        const gst = String(value || "").toUpperCase();
        next.gstNumber = gst;
        next.gstTreatment = gst;
        const matched = gstStateFromNumber(gst);
        if (matched) {
          next.placeOfSupply = matched.stateName;
          next.billingAddress = {
            ...next.billingAddress,
            state: matched.stateName,
          };
          if (next.sameAsBilling) {
            next.shippingAddress = { ...next.billingAddress };
          }
        }
      }
      if (key === "sameAsBilling" && value === true) {
        next.shippingAddress = { ...next.billingAddress };
      }
      if (key === "billingAddress" && next.sameAsBilling) {
        next.shippingAddress = { ...(value as AddressFields) };
      }
      return next;
    });
  }

  function updateAddress(
    which: "billingAddress" | "shippingAddress",
    key: keyof AddressFields,
    value: string,
  ) {
    setForm((prev) => {
      const address = { ...prev[which], [key]: value };
      if (which === "billingAddress" && prev.sameAsBilling) {
        return { ...prev, billingAddress: address, shippingAddress: { ...address } };
      }
      return { ...prev, [which]: address };
    });
  }

  function updateContact(id: string, key: keyof ContactPerson, value: string) {
    setForm((prev) => ({
      ...prev,
      contactPersons: prev.contactPersons.map((person) =>
        person.id === id ? { ...person, [key]: value } : person,
      ),
    }));
  }

  function addContact() {
    setForm((prev) => ({
      ...prev,
      contactPersons: [...prev.contactPersons, emptyContact()],
    }));
  }

  function removeContact(id: string) {
    setForm((prev) => ({
      ...prev,
      contactPersons:
        prev.contactPersons.length <= 1
          ? prev.contactPersons
          : prev.contactPersons.filter((person) => person.id !== id),
    }));
  }

  function onFilesSelected(files: FileList | null) {
    if (!files?.length) return;
    const incoming = Array.from(files);
    const tooLarge = incoming.find((file) => file.size > 10 * 1024 * 1024);
    if (tooLarge) {
      setError(`"${tooLarge.name}" is larger than 10MB.`);
      return;
    }
    setForm((prev) => {
      const room = Math.max(0, 3 - prev.documents.length);
      if (room === 0) {
        setError("You can upload a maximum of 3 documents.");
        return prev;
      }
      const nextDocs = incoming.slice(0, room).map((file) => ({
        id: `DOC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        size: file.size,
        type: file.type || "file",
      }));
      if (incoming.length > room) {
        setError("Only 3 documents are allowed. Extra files were skipped.");
      } else {
        setError("");
      }
      return { ...prev, documents: [...prev.documents, ...nextDocs] };
    });
  }

  function removeDocument(id: string) {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = customerDisplayName(form);
    if (!name.trim()) {
      setError(
        form.customerType === "Business"
          ? "Company Name or Primary Contact is required."
          : "Primary Contact name is required.",
      );
      return;
    }
    if (!form.placeOfSupply) {
      setError("Place of Supply is required.");
      return;
    }
    setError("");
    const gstNumber = (form.gstNumber || "").trim().toUpperCase();
    const saved = normalizeCustomer({
      ...form,
      name,
      displayName: name,
      gstNumber,
      gstTreatment: gstNumber,
      email: (form.email || "").trim(),
      phone: form.mobile.trim() || form.workPhone.trim() || form.phone || "",
    });
    onSave(saved);
  }

  return (
    <form
      className={`customer-form ${variant === "page" ? "customer-page-form" : "customer-modal"}`}
      onSubmit={handleSubmit}
    >
      {variant === "modal" ? (
        <div className="modal-top">
          <div>
            <span className="eyebrow">{editing ? "UPDATE CUSTOMER" : "NEW CUSTOMER"}</span>
            <h2>{editing ? "Edit customer" : "New customer"}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onCancel} aria-label="Close">
            <AppIcon icon={Icons.close} size={18} />
          </button>
        </div>
      ) : null}

      <div className="customer-basic">
        <div className="customer-type-row">
          <span className="field-label">Customer Type</span>
          <div className="radio-row">
            {(["Business", "Individual"] as const).map((type) => (
              <label key={type} className="radio-pill">
                <input
                  type="radio"
                  name="customerType"
                  checked={form.customerType === type}
                  onChange={() => update("customerType", type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-grid customer-grid">
          <div className="full-field">
            <span className="field-label">Primary Contact</span>
            <div className="triple-row" style={{ marginTop: 8 }}>
              <select
                value={form.salutation}
                onChange={(e) => update("salutation", e.target.value)}
                aria-label="Salutation"
              >
                {SALUTATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <input
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                placeholder="First Name"
              />
              <input
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="full-field company-email-row">
            {form.customerType === "Business" ? (
              <label>
                Company Name
                <input
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  placeholder="Company name"
                />
              </label>
            ) : null}

            <label className={form.customerType === "Business" ? undefined : "span-full"}>
              Email Address
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => update("email", e.target.value)}
                placeholder="name@company.com"
              />
            </label>
          </div>

          <div className="full-field required-fields-row">
            <label>
              GST number
              <input
                value={form.gstNumber || ""}
                onChange={(e) => update("gstNumber", e.target.value.toUpperCase())}
                placeholder="e.g. 22AAAAA0000A1Z5"
                maxLength={15}
              />
            </label>

            <label>
              Place of Supply *
              <select
                required
                value={form.placeOfSupply}
                onChange={(e) => update("placeOfSupply", e.target.value)}
              >
                <option value="">Select place of supply</option>
                {INDIAN_STATES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Currency
            <select value={form.currency} onChange={(e) => update("currency", e.target.value)}>
              {CURRENCIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Work Phone
            <input
              value={form.workPhone}
              onChange={(e) => update("workPhone", e.target.value)}
              placeholder="Work phone"
            />
          </label>

          <label>
            Mobile
            <input
              value={form.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              placeholder="Mobile number"
            />
          </label>

          <label>
            PAN
            <input
              value={form.pan}
              onChange={(e) => update("pan", e.target.value.toUpperCase())}
              placeholder="ABCDE1234F"
              maxLength={10}
            />
          </label>

          <div className="full-field document-field">
            <div className="field-label">Documents</div>
            <p className="field-hint">Max 3 files · 10MB each</p>
            <label className="file-drop">
              <input
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onChange={(e) => {
                  onFilesSelected(e.target.files);
                  e.target.value = "";
                }}
              />
              <span>
                <AppIcon icon={Icons.upload} size={14} /> Upload documents
              </span>
            </label>
            {form.documents.length > 0 && (
              <ul className="doc-list">
                {form.documents.map((doc) => (
                  <li key={doc.id}>
                    <div>
                      <b>{doc.name}</b>
                      <small>{(doc.size / (1024 * 1024)).toFixed(2)} MB</small>
                    </div>
                    <button type="button" onClick={() => removeDocument(doc.id)}>
                      <AppIcon icon={Icons.trash} size={13} /> Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label>
            Payment Terms
            <select
              value={form.paymentTerms}
              onChange={(e) => update("paymentTerms", e.target.value)}
            >
              {PAYMENT_TERMS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Price List
            <select value={form.priceList} onChange={(e) => update("priceList", e.target.value)}>
              {PRICE_LISTS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Portal Language
            <select
              value={form.portalLanguage}
              onChange={(e) => update("portalLanguage", e.target.value)}
              disabled={!form.enablePortal}
            >
              {PORTAL_LANGUAGES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.enablePortal}
              onChange={(e) => update("enablePortal", e.target.checked)}
            />
            <span>Enable Portal</span>
          </label>
        </div>
      </div>

      <div className="customer-tabs" role="tablist">
        {(
          [
            ["address", "Address"],
            ["contacts", "Contact Persons"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`customer-tab ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="customer-tab-panel">
        {tab === "address" && (
          <div className="address-panels">
            <AddressBlock
              title="Billing Address"
              values={form.billingAddress}
              onChange={(key, value) => updateAddress("billingAddress", key, value)}
            />
            <div className="shipping-column">
              <div className="shipping-head">
                <h3>Shipping Address</h3>
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={form.sameAsBilling}
                    onChange={(e) => update("sameAsBilling", e.target.checked)}
                  />
                  <span>Same as billing</span>
                </label>
              </div>
              <AddressBlock
                title=""
                values={form.shippingAddress}
                disabled={form.sameAsBilling}
                onChange={(key, value) => updateAddress("shippingAddress", key, value)}
              />
            </div>
          </div>
        )}

        {tab === "contacts" && (
          <div className="contacts-panel">
            {form.contactPersons.map((person, index) => (
              <div key={person.id} className="contact-card">
                <div className="contact-card-top">
                  <h3>Contact person {index + 1}</h3>
                  {form.contactPersons.length > 1 && (
                    <button type="button" className="text-link" onClick={() => removeContact(person.id)}>
                      <AppIcon icon={Icons.trash} size={13} /> Remove
                    </button>
                  )}
                </div>
                <div className="form-grid customer-grid">
                  <label>
                    Salutation
                    <select
                      value={person.salutation}
                      onChange={(e) => updateContact(person.id, "salutation", e.target.value)}
                    >
                      {SALUTATIONS.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    First Name
                    <input
                      value={person.firstName}
                      onChange={(e) => updateContact(person.id, "firstName", e.target.value)}
                      placeholder="First name"
                    />
                  </label>
                  <label>
                    Last Name
                    <input
                      value={person.lastName}
                      onChange={(e) => updateContact(person.id, "lastName", e.target.value)}
                      placeholder="Last name"
                    />
                  </label>
                  <label>
                    Email Address
                    <input
                      type="email"
                      value={person.email}
                      onChange={(e) => updateContact(person.id, "email", e.target.value)}
                      placeholder="name@company.com"
                    />
                  </label>
                  <label>
                    Work Phone
                    <input
                      value={person.workPhone}
                      onChange={(e) => updateContact(person.id, "workPhone", e.target.value)}
                      placeholder="Work phone"
                    />
                  </label>
                  <label>
                    Mobile
                    <input
                      value={person.mobile}
                      onChange={(e) => updateContact(person.id, "mobile", e.target.value)}
                      placeholder="Mobile"
                    />
                  </label>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addContact}>
              <AppIcon icon={Icons.plus} size={14} /> Add contact person
            </button>
          </div>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="modal-actions">
        <DevFillButton
          label="Fill fake data"
          onClick={() => {
            setError("");
            setForm(fakeCustomer(form));
          }}
        />
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit">
          {editing ? "Save changes" : "Save customer"}
        </button>
      </div>
    </form>
  );
}

function AddressBlock({
  title,
  values,
  disabled = false,
  onChange,
}: {
  title: string;
  values: AddressFields;
  disabled?: boolean;
  onChange: (key: keyof AddressFields, value: string) => void;
}) {
  return (
    <div className={`address-block ${disabled ? "is-disabled" : ""}`}>
      {title ? <h3>{title}</h3> : null}
      <div className="form-grid customer-grid">
        <label className="full-field">
          Attention
          <input
            disabled={disabled}
            value={values.attention}
            onChange={(e) => onChange("attention", e.target.value)}
            placeholder="Attention"
          />
        </label>
        <label>
          Country / Region
          <select
            disabled={disabled}
            value={values.country}
            onChange={(e) => onChange("country", e.target.value)}
          >
            {COUNTRIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          State
          <select
            disabled={disabled}
            value={values.state}
            onChange={(e) => onChange("state", e.target.value)}
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="full-field">
          Address Street 1
          <input
            disabled={disabled}
            value={values.street1}
            onChange={(e) => onChange("street1", e.target.value)}
            placeholder="Street 1"
          />
        </label>
        <label className="full-field">
          Address Street 2
          <input
            disabled={disabled}
            value={values.street2}
            onChange={(e) => onChange("street2", e.target.value)}
            placeholder="Street 2"
          />
        </label>
        <label>
          City
          <input
            disabled={disabled}
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="City"
          />
        </label>
        <label>
          Pin Code
          <input
            disabled={disabled}
            value={values.pinCode}
            onChange={(e) => onChange("pinCode", e.target.value)}
            placeholder="Pin code"
          />
        </label>
        <label>
          Phone
          <input
            disabled={disabled}
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Phone"
          />
        </label>
        <label>
          Fax Number
          <input
            disabled={disabled}
            value={values.fax}
            onChange={(e) => onChange("fax", e.target.value)}
            placeholder="Fax number"
          />
        </label>
      </div>
    </div>
  );
}
