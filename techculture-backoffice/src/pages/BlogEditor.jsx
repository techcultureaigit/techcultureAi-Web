import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { API_BASE, api } from "../api/client";
import { usePageTopNav } from "../hooks/usePageTopNav";

const emptyForm = {
  title: "",
  slug: "",
  subtitle: "",
  excerpt: "",
  content: "",
  heroImage: "",
  tags: "",
  vertical: "all",
  status: "DRAFT",
  readMinutes: 5,
  author: "TechCulture AI",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveImageSrc(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/")) return `${API_BASE}${url}`;
  return url;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
];

export default function BlogEditor() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const slugTouched = useRef(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [heroMode, setHeroMode] = useState("url");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.getBlog(id);
        if (cancelled) return;
        const post = res.post || {};
        const hero = post.heroImage || "";
        setForm({
          title: post.title || "",
          slug: post.slug || "",
          subtitle: post.subtitle || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          heroImage: hero,
          tags: (post.tags || []).join(", "),
          vertical: post.vertical || "all",
          status: post.status || "DRAFT",
          readMinutes: post.readMinutes || 5,
          author: post.author || "TechCulture AI",
        });
        setHeroMode(hero.includes("/uploads/") ? "upload" : "url");
        slugTouched.current = true;
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const actions = useMemo(
    () => (
      <Link to="/blogs" className="btn-ghost !rounded-full inline-flex items-center">
        ← Back to blogs
      </Link>
    ),
    []
  );

  usePageTopNav({
    eyebrow: "CMS",
    title: isEdit ? "Edit post" : "New post",
    subtitle: "Rich HTML editor · content saved as HTML",
    actions,
  });

  function updateField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched.current && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function onUploadHero(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await api.uploadImage(file);
      const stored =
        res.url?.startsWith("http") && res.url.includes("/uploads/")
          ? new URL(res.url).pathname
          : res.url?.startsWith("/")
            ? res.url
            : res.url
              ? `/uploads/${res.url.replace(/^\/+/, "")}`
              : "";
      updateField("heroImage", stored);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        ...form,
        content: form.content || "",
        contentFormat: "html",
        readMinutes: Number(form.readMinutes) || 5,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (isEdit) await api.updateBlog(id, payload);
      else await api.createBlog(payload);
      navigate("/blogs");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-slate-400">Loading post…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      {error && (
        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <section className="card space-y-4 p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700">
            Post details
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Title <span className="text-[#FE602F]">*</span>
              </label>
              <input
                className="input"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
                placeholder="Blog post title"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Slug</label>
              <input
                className="input font-mono text-sm"
                value={form.slug}
                onChange={(e) => {
                  slugTouched.current = true;
                  updateField("slug", e.target.value);
                }}
                placeholder="my-blog-post"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Author</label>
              <input
                className="input"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Subtitle
              </label>
              <input
                className="input"
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-semibold text-slate-600">
                  Hero image
                </label>
                <div className="inline-flex rounded-full border border-[#E8E6E1] bg-[#fafbfc] p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 transition ${
                      heroMode === "url"
                        ? "bg-white text-[#2E3545] shadow-sm"
                        : "text-slate-500"
                    }`}
                    onClick={() => setHeroMode("url")}
                  >
                    Paste URL
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-1.5 transition ${
                      heroMode === "upload"
                        ? "bg-white text-[#2E3545] shadow-sm"
                        : "text-slate-500"
                    }`}
                    onClick={() => setHeroMode("upload")}
                  >
                    Upload image
                  </button>
                </div>
              </div>

              {heroMode === "url" ? (
                <input
                  className="input"
                  value={form.heroImage}
                  onChange={(e) => updateField("heroImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-teal-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-800"
                    onChange={onUploadHero}
                    disabled={uploading}
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    PNG, JPG, WEBP or GIF · max 5MB
                    {uploading ? " · Uploading…" : ""}
                  </p>
                </div>
              )}

              {form.heroImage ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-[#E8E6E1] bg-slate-50">
                  <img
                    src={resolveImageSrc(form.heroImage)}
                    alt="Hero preview"
                    className="max-h-52 w-full object-cover object-center"
                  />
                  <div className="flex items-center justify-between gap-2 border-t border-[#E8E6E1] px-3 py-2">
                    <p className="truncate text-xs text-slate-500">{form.heroImage}</p>
                    <button
                      type="button"
                      className="shrink-0 text-xs font-semibold text-red-600"
                      onClick={() => updateField("heroImage", "")}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Tags (comma separated)
              </label>
              <input
                className="input"
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="kyc, fintech"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Vertical
              </label>
              <select
                className="input"
                value={form.vertical}
                onChange={(e) => updateField("vertical", e.target.value)}
              >
                <option value="all">all</option>
                <option value="brokers">brokers</option>
                <option value="mfd">mfd</option>
                <option value="nbfc">nbfc</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Excerpt
              </label>
              <textarea
                className="input min-h-24"
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Short summary shown on blog cards"
              />
            </div>
          </div>
        </section>

        <section className="card overflow-hidden p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#FE602F]">
                Content editor
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Write here — saved to backend as HTML
              </p>
            </div>
          </div>
          <div className="blog-quill overflow-hidden rounded-xl border border-[#E8E6E1] bg-white">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(html) => updateField("content", html)}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Start writing your blog post…"
            />
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="btn-ghost !rounded-xl"
            onClick={() => navigate("/blogs")}
          >
            Cancel
          </button>
          <button className="btn-primary !rounded-xl" type="submit" disabled={busy || uploading}>
            {busy ? "Saving…" : isEdit ? "Update post" : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
}
