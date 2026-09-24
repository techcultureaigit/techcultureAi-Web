const BACKOFFICE_API_URL =
  process.env.NEXT_PUBLIC_BACKOFFICE_API_URL || "http://localhost:5050";

async function fetchJson(path) {
  const res = await fetch(`${BACKOFFICE_API_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Blog API error (${res.status})`);
  }

  return res.json();
}

/** Published posts for the public blog listing */
export async function fetchPublishedBlogs({ vertical, q, limit } = {}) {
  const params = new URLSearchParams();
  if (vertical && vertical !== "all") params.set("vertical", vertical);
  if (q) params.set("q", q);
  if (limit) params.set("limit", String(limit));

  const query = params.toString();
  const data = await fetchJson(`/api/blogs/public${query ? `?${query}` : ""}`);
  return {
    posts: data.posts || [],
    total: data.total || 0,
  };
}

/** Single published post by slug */
export async function fetchBlogBySlug(slug) {
  if (!slug) return null;
  try {
    const data = await fetchJson(`/api/blogs/public/${encodeURIComponent(slug)}`);
    return data.post || null;
  } catch {
    return null;
  }
}

export { BACKOFFICE_API_URL };
