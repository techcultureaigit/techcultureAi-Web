"use client";

import { useEffect, useState } from "react";
import { formatInvoiceDate, parseInvoiceDate } from "@/lib/invoiceUtils";

type Props = {
  value?: string;
  onChange: (isoDate: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export default function DateTextInput({ value, onChange, required, disabled }: Props) {
  const shown = !value ? "" : formatInvoiceDate(value) === "—" ? "" : formatInvoiceDate(value);
  const [text, setText] = useState(shown);

  useEffect(() => {
    setText(shown);
  }, [shown]);

  return (
    <input
      required={required}
      disabled={disabled}
      inputMode="numeric"
      placeholder="dd-mm-yyyy"
      maxLength={10}
      value={text}
      onChange={(e) => {
        const next = e.target.value.replace(/[^\d-]/g, "").slice(0, 10);
        setText(next);
        if (!next) {
          onChange("");
          return;
        }
        const iso = parseInvoiceDate(next);
        if (iso) onChange(iso);
      }}
      onBlur={() => {
        const iso = parseInvoiceDate(text);
        if (iso) setText(formatInvoiceDate(iso));
        else if (value) setText(shown);
      }}
    />
  );
}
