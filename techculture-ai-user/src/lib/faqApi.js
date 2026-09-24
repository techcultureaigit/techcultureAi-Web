const BACKOFFICE_API_URL =
  process.env.NEXT_PUBLIC_BACKOFFICE_API_URL || "http://localhost:5050";

export async function fetchPublicFaqs() {
  const res = await fetch(`${BACKOFFICE_API_URL}/api/faqs/public`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `FAQ API error (${res.status})`);
  }
  const data = await res.json();
  return data.data || [];
}

export { BACKOFFICE_API_URL };
