import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE, api } from "../api/client";
import Modal from "../components/Modal";
import { usePageTopNav } from "../hooks/usePageTopNav";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:3000";

function toStoredImageUrl(url = "") {
  const value = String(url).trim();
  if (!value) return "";
  // Always persist API uploads as relative paths so they follow VITE_API_URL
  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith("/uploads/")) return parsed.pathname;
  } catch {
    /* relative path */
  }
  if (value.startsWith("/uploads/")) return value;
  return value;
}

function resolveImageUrl(url, name = "") {
  if (!url) return "";
  let value = String(url).trim();
  // Old absolute Render/local upload URLs → current API host
  try {
    const parsed = new URL(value);
    if (parsed.pathname.startsWith("/uploads/")) {
      value = `${API_BASE}${parsed.pathname}`;
    }
  } catch {
    if (value.startsWith("/uploads/")) value = `${API_BASE}${value}`;
    else if (value.startsWith("/")) value = `${SITE_URL}${value}`;
  }
  if (value.startsWith("http://res.cloudinary.com")) {
    value = value.replace(/^http:/, "https:");
  }
  if (
    name === "Rahul Goel" &&
    value.includes("res.cloudinary.com") &&
    value.includes("/upload/") &&
    !/\/upload\/[^/]*c_/.test(value)
  ) {
    value = value.replace(
      "/upload/",
      "/upload/c_fill,g_face,h_560,w_420,q_auto/"
    );
  }
  return value;
}

const emptyForm = {
  name: "",
  role: "",
  order: 1,
  isActive: true,
  bio: "",
  linkedIn: "",
  imageUrl: "",
  email: "",
};

export default function Team() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [imageMode, setImageMode] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [brokenImages, setBrokenImages] = useState(() => new Set());
  const fileInputRef = useRef(null);

  async function load() {
    const res = await api.team();
    setMembers(res.data || []);
    setBrokenImages(new Set());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setImageMode("url");
    setError("");
    setModalOpen(true);
  }

  function openEdit(member) {
    const image = member.imageUrl || "";
    setEditingId(member.id || member._id);
    setForm({
      name: member.name || "",
      role: member.roleId?.name || member.role || "",
      order: member.order ?? 1,
      isActive: member.isActive !== false,
      bio: member.bio || "",
      linkedIn: member.linkedIn || "",
      imageUrl: image,
      email: member.email || "",
    });
    setImageMode(image.includes("/uploads/") ? "upload" : "url");
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setImageMode("url");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onUploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await api.uploadImage(file);
      const stored = toStoredImageUrl(res.url || "");
      setForm((prev) => ({ ...prev, imageUrl: stored }));
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
        imageUrl: toStoredImageUrl(form.imageUrl),
        order: Number(form.order) || 1,
        roleId: { name: form.role },
      };
      if (editingId) await api.updateTeamMember(editingId, payload);
      else await api.createTeamMember(payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this team member?")) return;
    await api.deleteTeamMember(id);
    await load();
  }

  const actions = useMemo(
    () => (
      <button className="btn-primary !rounded-full" type="button" onClick={openCreate}>
        New member
      </button>
    ),
    []
  );

  usePageTopNav({
    eyebrow: "People",
    title: "Our Team",
    subtitle: `${members.length} members · powers /team page`,
    actions,
  });

  return (
    <div className="space-y-6">
      {error && !modalOpen && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.id || m._id} className="card overflow-hidden">
            <div className="relative h-52 overflow-hidden bg-slate-100">
              {m.imageUrl && !brokenImages.has(m.id || m._id) ? (
                <img
                  src={resolveImageUrl(m.imageUrl, m.name)}
                  alt={m.name}
                  className={
                    m.name === "Rahul Goel"
                      ? "h-full w-full scale-110 object-cover object-[center_12%]"
                      : "h-full w-full object-cover object-top"
                  }
                  onError={() => {
                    const key = m.id || m._id;
                    setBrokenImages((prev) => new Set(prev).add(key));
                  }}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 px-3 text-center text-slate-400">
                  <span className="text-sm font-semibold">
                    {m.imageUrl ? "Image missing" : "No image"}
                  </span>
                  {m.imageUrl ? (
                    <span className="text-xs">Re-upload & save member</span>
                  ) : null}
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-[#2E3545]">{m.name}</h3>
                  <p className="text-sm text-teal-700">{m.roleId?.name || m.role}</p>
                  <p className="mt-1 text-xs text-slate-400">Order {m.order}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    m.isActive !== false
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {m.isActive !== false ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="btn-ghost !px-3 !py-1.5 text-xs" type="button" onClick={() => openEdit(m)}>
                  Edit
                </button>
                <button
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
                  type="button"
                  onClick={() => onDelete(m.id || m._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? "Edit member" : "New member"}
        onClose={closeModal}
        wide
      >
        {error && <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          {[
            ["name", "Name"],
            ["role", "Role / designation"],
            ["order", "Display order"],
            ["email", "Email"],
            ["linkedIn", "LinkedIn URL"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
              <input
                className="input"
                type={key === "order" ? "number" : "text"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required={key === "name"}
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-slate-600">
                Profile image
              </label>
              <div className="inline-flex rounded-full border border-[#E8E6E1] bg-[#fafbfc] p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  className={`rounded-full px-3 py-1.5 transition ${
                    imageMode === "url"
                      ? "bg-white text-[#2E3545] shadow-sm"
                      : "text-slate-500"
                  }`}
                  onClick={() => setImageMode("url")}
                >
                  Paste URL
                </button>
                <button
                  type="button"
                  className={`rounded-full px-3 py-1.5 transition ${
                    imageMode === "upload"
                      ? "bg-white text-[#2E3545] shadow-sm"
                      : "text-slate-500"
                  }`}
                  onClick={() => setImageMode("upload")}
                >
                  Upload image
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <input
                className="input"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            ) : (
              <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50/40 px-4 py-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-teal-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-800"
                  onChange={onUploadImage}
                  disabled={uploading}
                />
                <p className="mt-2 text-xs text-slate-500">
                  PNG, JPG, WEBP or GIF · max 5MB
                  {uploading ? " · Uploading…" : ""}
                </p>
              </div>
            )}

            {form.imageUrl ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-[#E8E6E1] bg-slate-50">
                <img
                  src={resolveImageUrl(form.imageUrl, form.name)}
                  alt="Profile preview"
                  className="mx-auto max-h-48 object-cover object-top"
                />
                <div className="flex items-center justify-between gap-2 border-t border-[#E8E6E1] px-3 py-2">
                  <p className="truncate text-xs text-slate-500">{form.imageUrl}</p>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-semibold text-red-600"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Bio</label>
            <textarea
              className="input min-h-24"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <div className="md:col-span-2 flex gap-2 pt-1">
            <button className="btn-primary" type="submit" disabled={busy || uploading}>
              {busy ? "Saving…" : editingId ? "Update member" : "Create member"}
            </button>
            <button className="btn-ghost" type="button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
