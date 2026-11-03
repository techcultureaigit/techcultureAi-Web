export const INVOICE_AUTH_KEY = "tc-invoice-auth";
export const INVOICE_TOKEN_KEY = "tc-invoice-token";

export type InvoiceAuthUser = {
  id?: string;
  name: string;
  email: string;
  initials: string;
  role?: string;
  token?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_INVOICE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5050/api/invoice";

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "AD"
  );
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INVOICE_TOKEN_KEY);
}

export function getAuthUser(): InvoiceAuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(INVOICE_AUTH_KEY);
    const token = getToken();
    if (!raw || !token) return null;
    const parsed = JSON.parse(raw) as Partial<InvoiceAuthUser>;
    if (!parsed?.email || parsed.role !== "admin") return null;
    return {
      id: parsed.id,
      name: parsed.name || "Admin",
      email: parsed.email,
      initials: parsed.initials || initialsFromName(parsed.name || "Admin"),
      role: "admin",
      token,
    };
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getAuthUser());
}

export function saveAuthSession(admin: {
  id?: string;
  name?: string;
  email: string;
  role?: string;
}, token: string) {
  if (admin.role && admin.role !== "admin") {
    throw new Error("Only admin users can access the invoice app");
  }

  const name = (admin.name || "Admin").trim() || "Admin";
  const user: InvoiceAuthUser = {
    id: admin.id,
    name,
    email: admin.email.trim().toLowerCase(),
    initials: initialsFromName(name),
    role: "admin",
    token,
  };

  localStorage.setItem(INVOICE_TOKEN_KEY, token);
  localStorage.setItem(INVOICE_AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(INVOICE_AUTH_KEY);
  localStorage.removeItem(INVOICE_TOKEN_KEY);
}

export async function loginWithApi(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok || !payload?.success) {
    throw new Error(payload?.message || "Login failed");
  }

  if (!payload.token || !payload.admin) {
    throw new Error("Invalid login response");
  }

  if (payload.admin.role !== "admin") {
    throw new Error("Only admin users can access the invoice app");
  }

  return saveAuthSession(payload.admin, payload.token);
}

export async function verifyAuthSession() {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const payload = await res.json();
    if (!res.ok || !payload?.success || payload.admin?.role !== "admin") {
      logoutUser();
      return null;
    }
    return saveAuthSession(payload.admin, token);
  } catch {
    logoutUser();
    return null;
  }
}
