"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon, Icons } from "@/components/icons";
import "./CustomerSearchSelect.css";

export type CustomerOption = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type Props = {
  customers: CustomerOption[];
  value: string;
  required?: boolean;
  placeholder?: string;
  onSelect: (customer: CustomerOption) => void;
};

export default function CustomerSearchSelect({
  customers,
  value,
  required = false,
  placeholder = "Select customer",
  onSelect,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone, customer.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [customers, query]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => searchRef.current?.focus(), 0);
    function onDocMouseDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleSelect(customer: CustomerOption) {
    onSelect(customer);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="customer-search-select" ref={rootRef}>
      <button
        type="button"
        className={`customer-search-trigger ${open ? "open" : ""} ${value ? "has-value" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value || placeholder}</span>
        <span className="customer-search-chevron">
          <AppIcon icon={Icons.chevronDown} size={14} />
        </span>
      </button>

      <input
        type="text"
        value={value}
        required={required}
        readOnly
        tabIndex={-1}
        aria-hidden
        className="customer-search-required"
        onChange={() => {}}
      />

      {open ? (
        <div
          className="customer-search-menu"
          role="listbox"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="customer-search-box">
            <AppIcon icon={Icons.search} size={14} />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              aria-label="Search customers"
            />
          </div>

          <div className="customer-search-list">
            {filtered.length === 0 ? (
              <div className="customer-search-empty">
                {customers.length === 0
                  ? "No customers available. Add a customer first."
                  : "No customers found"}
              </div>
            ) : (
              filtered.map((customer) => (
                <button
                  key={customer.id}
                  type="button"
                  role="option"
                  className={`customer-search-option ${customer.name === value ? "selected" : ""}`}
                  onClick={() => handleSelect(customer)}
                >
                  <b>{customer.name}</b>
                  <small>
                    {customer.id}
                    {customer.email ? ` · ${customer.email}` : ""}
                  </small>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
