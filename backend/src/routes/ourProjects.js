import express from "express";
import { nanoid } from "nanoid";
import { getDb } from "../mongo.js";
import { requireAdmin } from "../middleware/auth.js";
import { shapeOurProject, validateOurProject } from "../schemas/ourProjects.js";

const router = express.Router();
const COLLECTION = "ourProjects";

async function col() {
  return getDb().collection(COLLECTION);
}

/** Admin list + search */
router.get("/", requireAdmin, async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { projectUrl: { $regex: q, $options: "i" } },
        { loginId: { $regex: q, $options: "i" } },
        { gitRepoName: { $regex: q, $options: "i" } },
      ];
    }

    const docs = await (await col())
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      success: true,
      count: docs.length,
      data: docs.map(shapeOurProject),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to load projects" });
  }
});

router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const doc = await (await col()).findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }],
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    return res.json({ success: true, data: shapeOurProject(doc) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to load project" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const parsed = validateOurProject(req.body || {});
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const now = new Date().toISOString();
    const id = nanoid();
    const doc = {
      _id: id,
      id,
      ...parsed.data,
      isActive: parsed.data.isActive !== false,
      createdAt: now,
      updatedAt: now,
    };

    await (await col()).insertOne(doc);
    return res.status(201).json({ success: true, data: shapeOurProject(doc) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to create project" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const collection = await col();
    const existing = await collection.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }],
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const body = {
      name: req.body?.name ?? existing.name,
      projectUrl: req.body?.projectUrl ?? existing.projectUrl,
      loginId: req.body?.loginId ?? existing.loginId,
      loginPassword: req.body?.loginPassword ?? existing.loginPassword,
      gitRepoName: req.body?.gitRepoName ?? existing.gitRepoName,
      isActive:
        req.body?.isActive !== undefined ? Boolean(req.body.isActive) : existing.isActive !== false,
    };

    const parsed = validateOurProject(body);
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const updatedFields = {
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };

    await collection.updateOne({ _id: existing._id }, { $set: updatedFields });
    const saved = await collection.findOne({ _id: existing._id });
    return res.json({ success: true, data: shapeOurProject(saved) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to update project" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const collection = await col();
    const existing = await collection.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }],
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await collection.deleteOne({ _id: existing._id });
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to delete project" });
  }
});

export default router;
