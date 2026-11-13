/**
 * Our Project document schema (Mongo collection: ourProjects)
 *
 * Fields:
 * - name          string  project name (required)
 * - projectUrl    string  project / app URL
 * - loginId       string  login username / email
 * - loginPassword string  login password (admin-only)
 * - gitRepoName   string  git repository name
 * - isActive      boolean
 * - createdAt / updatedAt ISO strings
 */

export function shapeOurProject(doc) {
  if (!doc) return doc;
  const id = String(doc.id || doc._id);
  return {
    id,
    _id: id,
    name: String(doc.name || "").trim(),
    projectUrl: String(doc.projectUrl || "").trim(),
    loginId: String(doc.loginId || "").trim(),
    loginPassword: String(doc.loginPassword || ""),
    gitRepoName: String(doc.gitRepoName || "").trim(),
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt || null,
    updatedAt: doc.updatedAt || null,
  };
}

export function validateOurProject(body = {}, { partial = false } = {}) {
  const errors = [];
  const name = body.name !== undefined ? String(body.name || "").trim() : undefined;
  const projectUrl =
    body.projectUrl !== undefined ? String(body.projectUrl || "").trim() : undefined;
  const loginId =
    body.loginId !== undefined ? String(body.loginId || "").trim() : undefined;
  const loginPassword =
    body.loginPassword !== undefined ? String(body.loginPassword || "") : undefined;
  const gitRepoName =
    body.gitRepoName !== undefined ? String(body.gitRepoName || "").trim() : undefined;

  if (!partial || body.name !== undefined) {
    if (!name) errors.push("Project name is required");
  }
  if (!partial || body.projectUrl !== undefined) {
    if (!projectUrl) errors.push("Project URL is required");
  }
  if (!partial || body.loginId !== undefined) {
    if (!loginId) errors.push("Login ID is required");
  }
  if (!partial || body.loginPassword !== undefined) {
    if (!loginPassword) errors.push("Login password is required");
  }
  if (!partial || body.gitRepoName !== undefined) {
    if (!gitRepoName) errors.push("Git repo name is required");
  }

  if (errors.length) {
    return { ok: false, message: errors[0], errors };
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (projectUrl !== undefined) data.projectUrl = projectUrl;
  if (loginId !== undefined) data.loginId = loginId;
  if (loginPassword !== undefined) data.loginPassword = loginPassword;
  if (gitRepoName !== undefined) data.gitRepoName = gitRepoName;
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

  return { ok: true, data };
}
