import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="nf-page">
      <div className="nf-blob nf-blob-a" aria-hidden />
      <div className="nf-blob nf-blob-b" aria-hidden />
      <div className="nf-blob nf-blob-c" aria-hidden />

      <div className="nf-card">
        <div className="nf-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/techculture-logo.png" alt="TechCulture" className="nf-logo" />
          <span>Invoice</span>
        </div>

        <div className="nf-visual" aria-hidden>
          <div className="nf-code">404</div>
          <svg className="nf-illus" viewBox="0 0 360 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="48" y="28" width="180" height="124" rx="16" fill="#FFF7ED" stroke="#FDBA74" strokeWidth="2" />
            <rect x="68" y="48" width="90" height="10" rx="5" fill="#FDBA74" />
            <rect x="68" y="68" width="120" height="7" rx="3.5" fill="#FED7AA" />
            <rect x="68" y="88" width="140" height="7" rx="3.5" fill="#FFEDD5" />
            <rect x="68" y="108" width="70" height="20" rx="8" fill="#F97316" />
            <circle cx="270" cy="78" r="46" fill="#FFEDD5" />
            <circle cx="270" cy="78" r="30" fill="#FFF" />
            <path
              d="M255 78c0-8.3 6.7-15 15-15s15 6.7 15 15"
              stroke="#F97316"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="270" cy="92" r="4" fill="#EA580C" />
            <path
              d="M300 108l18 18"
              stroke="#EA580C"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1>Page not found</h1>
        <p>
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the
          link might be broken. Let&apos;s get you back to your invoices.
        </p>

        <div className="nf-actions">
          <Link href="/dashboard" className="btn btn-primary nf-btn">
            Go to Dashboard
          </Link>
          <Link href="/invoices" className="btn btn-secondary nf-btn">
            View Invoices
          </Link>
        </div>

        <small>TechCulture Invoice · Error 404</small>
      </div>
    </main>
  );
}
