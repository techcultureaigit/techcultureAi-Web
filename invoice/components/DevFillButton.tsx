"use client";

import { IS_DEV } from "@/lib/devFaker";

type Props = {
  onClick: () => void;
  label?: string;
};

/** Only visible in development — fills required form fields via Faker */
export default function DevFillButton({ onClick, label = "Fill fake data" }: Props) {
  if (!IS_DEV) return null;

  return (
    <button
      type="button"
      className="btn btn-secondary dev-fill-btn"
      onClick={onClick}
      title="Development only: fill required fields with @faker-js/faker"
    >
      {label}
    </button>
  );
}
