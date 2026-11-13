import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { admin, login } = useAuth();
  const [email, setEmail] = useState("admin@techculture.ai");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (admin) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fff7f3] via-white to-[#f0fdfa]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#FE602F]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
        <div className="card p-8">
          <div className="mb-8 text-center">
            <img
              src="/logo.png"
              alt="TechCulture AI"
              className="mx-auto mb-4 h-14 w-auto object-contain"
            />
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#FE602F]">
              Backoffice
            </p>
            <h1 className="text-2xl font-bold text-[#2E3545]">Admin Login</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage Blog & Careers for TechCulture AI
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Email
              </label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Password
              </label>
              <div className="relative">
                <input
                  className="input pr-11"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-teal-700"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
                {error}
              </p>
            )}

            <button className="btn-primary w-full" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            Admin only · Same brand as{" "}
            <span className="text-teal-700">techculture-ai-new</span>
          </p>
        </div>
      </div>
    </div>
  );
}
