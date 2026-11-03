"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser, loginWithApi } from "@/lib/auth";
import { toast } from "@/lib/notify";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@techculture.ai");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAuthUser()) router.replace("/dashboard");
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail || !password.trim()) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      await loginWithApi(cleanedEmail, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Only admin users can access invoices.",
      );
    } finally {
      setLoading(false);
    }
  }

  function onForgotPassword() {
    toast.info(
      "Password resets are handled by TechCulture admins. Contact your workspace owner.",
      "Forgot password",
    );
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-form-pane">
          <div className="login-form-inner">
            <div className="login-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/techculture-logo.png"
                alt="TechCulture"
                className="login-logo"
              />
              <span className="login-brand-tag">Invoice</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <header className="login-form-head">
                <h1>Welcome back</h1>
                <p>Sign in with your TechCulture admin account to manage invoices.</p>
              </header>

              {error ? <div className="login-error">{error}</div> : null}

              <label className="login-field">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@techculture.ai"
                  autoComplete="username"
                  required
                />
              </label>

              <label className="login-field">
                <span className="login-field-row">
                  Password
                  <button
                    type="button"
                    className="login-link"
                    onClick={onForgotPassword}
                  >
                    Forgot Password?
                  </button>
                </span>
                <div className="login-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              <button
                className="btn btn-primary login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <p className="login-footnote">
                Uses secure admin authentication. Invoice access is limited to
                TechCulture administrators.
              </p>
            </form>
          </div>
        </section>

        <section className="login-visual-pane" aria-hidden="true">
          <div className="login-wave" />
          <div className="login-blob login-blob-a" />
          <div className="login-blob login-blob-b" />
          <div className="login-blob login-blob-c" />

          <div className="login-visual-content">
            <div className="login-illustration">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/login.png" alt="TechCulture invoice workspace" />
            </div>
            <h2>Invoice smarter. Get paid faster.</h2>
            <p>
              Create professional invoices, track payments, and keep your customer
              billing organized in one TechCulture workspace.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
