import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tc_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((res) => setAdmin(res.admin))
      .catch(() => {
        localStorage.removeItem("tc_admin_token");
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      async login(email, password) {
        const res = await api.login(email, password);
        localStorage.setItem("tc_admin_token", res.token);
        setAdmin(res.admin);
        return res.admin;
      },
      logout() {
        localStorage.removeItem("tc_admin_token");
        setAdmin(null);
      },
    }),
    [admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
