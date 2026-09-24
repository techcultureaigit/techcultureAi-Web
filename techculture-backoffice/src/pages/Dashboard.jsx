import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { usePageTopNav } from "../hooks/usePageTopNav";

export default function Dashboard() {
  const [stats, setStats] = useState({ blogs: 0, jobs: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.health(),
      api.blogs({ page: 1, limit: 1, status: "PUBLISHED" }),
      api.jobs({ page: 1, limit: 1 }),
      api.team(),
      api.demos({ page: 1, limit: 1 }),
    ])
      .then(([health, publishedBlogs, jobs, team, demos]) => {
        setStats({
          blogs: health.blogs ?? 0,
          jobs: health.jobs ?? jobs.total ?? 0,
          team: health.team ?? team.count ?? 0,
          published: publishedBlogs.total ?? 0,
          demos: health.demos ?? demos.total ?? 0,
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  usePageTopNav({
    eyebrow: "Overview",
    title: "Dashboard",
    subtitle: "Blog · Careers · Team · Demos",
    actions: null,
  });

  const cards = [
    {
      label: "Blog posts",
      value: stats.blogs,
      hint: `${stats.published || 0} published`,
      to: "/blogs",
      tone: "from-teal-50 to-emerald-50 border-teal-100",
    },
    {
      label: "Career openings",
      value: stats.jobs,
      hint: "Jobs on careers page",
      to: "/careers",
      tone: "from-orange-50 to-amber-50 border-orange-100",
    },
    {
      label: "Team members",
      value: stats.team || 0,
      hint: "Shown on /team page",
      to: "/team",
      tone: "from-slate-50 to-teal-50 border-slate-200",
    },
    {
      label: "Demo bookings",
      value: stats.demos || 0,
      hint: "Schedule Demo leads",
      to: "/demos",
      tone: "from-violet-50 to-orange-50 border-violet-100",
    },
  ];

  return (
    <div>
      <p className="mb-6 text-sm text-slate-500">
        APIs power{" "}
        <a className="font-semibold text-teal-700" href="http://localhost:3000/blog" target="_blank" rel="noreferrer">
          /blog
        </a>
        ,{" "}
        <a className="font-semibold text-teal-700" href="http://localhost:3000/careers" target="_blank" rel="noreferrer">
          /careers
        </a>{" "}
        and{" "}
        <a className="font-semibold text-teal-700" href="http://localhost:3000/team" target="_blank" rel="noreferrer">
          /team
        </a>
        .
      </p>

      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className={`card border bg-gradient-to-br p-6 ${c.tone}`}>
            <p className="text-sm font-semibold text-slate-500">{c.label}</p>
            <p className="mt-2 text-4xl font-bold text-[#2E3545]">{c.value}</p>
            <p className="mt-1 text-sm text-slate-500">{c.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
