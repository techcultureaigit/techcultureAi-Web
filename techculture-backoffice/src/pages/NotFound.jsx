import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fff8f5] px-4 py-10">
      <img
        src="/404.jpg"
        alt="404 — page not found"
        className="h-auto w-full max-w-[640px] object-contain"
      />
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#FE602F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e94e20]"
      >
        Back to Home
      </Link>
    </div>
  );
}
