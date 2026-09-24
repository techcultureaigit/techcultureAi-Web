const BACKOFFICE_API_URL =
  process.env.NEXT_PUBLIC_BACKOFFICE_API_URL || "http://localhost:5050";

async function fetchJson(path) {
  const res = await fetch(`${BACKOFFICE_API_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Team API error (${res.status})`);
  }
  return res.json();
}

/** Public team members for /team page */
export async function fetchTeamMembers() {
  const data = await fetchJson("/api/team/public");
  return {
    count: data.count || 0,
    data: data.data || [],
  };
}

export { BACKOFFICE_API_URL };
