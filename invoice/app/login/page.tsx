import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="login-page">
          <div className="login-shell" style={{ minHeight: 320 }} />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
