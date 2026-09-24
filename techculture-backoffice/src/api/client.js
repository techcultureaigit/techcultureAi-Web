export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

function authHeaders() {
  const token = localStorage.getItem("tc_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request("/api/auth/me"),
  blogs: (params = {}) => {
    if (typeof params === "string") return request(`/api/blogs${params}`);
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    });
    const query = qs.toString();
    return request(`/api/blogs${query ? `?${query}` : ""}`);
  },
  getBlog: (id) => request(`/api/blogs/${id}`),
  createBlog: (body) =>
    request("/api/blogs", { method: "POST", body: JSON.stringify(body) }),
  updateBlog: (id, body) =>
    request(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteBlog: (id) => request(`/api/blogs/${id}`, { method: "DELETE" }),
  uploadImage: async (file) => {
    const body = new FormData();
    body.append("image", file);
    const res = await fetch(`${API_BASE}/api/uploads/image`, {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }
    return data;
  },
  jobs: (params = {}) => {
    if (typeof params === "string") return request(`/api/careers${params}`);
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    });
    const query = qs.toString();
    return request(`/api/careers${query ? `?${query}` : ""}`);
  },
  getJob: (id) => request(`/api/careers/${id}`),
  createJob: (body) =>
    request("/api/careers", { method: "POST", body: JSON.stringify(body) }),
  updateJob: (id, body) =>
    request(`/api/careers/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteJob: (id) => request(`/api/careers/${id}`, { method: "DELETE" }),
  team: () => request("/api/team"),
  createTeamMember: (body) =>
    request("/api/team", { method: "POST", body: JSON.stringify(body) }),
  updateTeamMember: (id, body) =>
    request(`/api/team/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteTeamMember: (id) => request(`/api/team/${id}`, { method: "DELETE" }),
  demos: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    });
    const query = qs.toString();
    return request(`/api/demos${query ? `?${query}` : ""}`);
  },
  getDemo: (id) => request(`/api/demos/${id}`),
  updateDemo: (id, body) =>
    request(`/api/demos/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteDemo: (id) => request(`/api/demos/${id}`, { method: "DELETE" }),
  contacts: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    });
    const query = qs.toString();
    return request(`/api/contacts${query ? `?${query}` : ""}`);
  },
  updateContact: (id, body) =>
    request(`/api/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  deleteContact: (id) => request(`/api/contacts/${id}`, { method: "DELETE" }),
  faqs: (params = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    });
    const query = qs.toString();
    return request(`/api/faqs${query ? `?${query}` : ""}`);
  },
  createFaq: (body) =>
    request("/api/faqs", { method: "POST", body: JSON.stringify(body) }),
  updateFaq: (id, body) =>
    request(`/api/faqs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteFaq: (id) => request(`/api/faqs/${id}`, { method: "DELETE" }),
  health: () => request("/api/health"),
};
