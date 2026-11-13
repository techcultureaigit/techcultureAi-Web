import { invoiceCollection, toAppDoc } from "../db.js";
import { shapeReceivedInvoice, validateReceivedInvoice } from "../schemas.js";

function col() {
  return invoiceCollection("receivedInvoices");
}

export async function listReceivedInvoices(req, res) {
  try {
    const q = String(req.query.q || "").trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { proofName: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
      ];
    }

    const docs = await col().find(filter).sort({ date: -1, updatedAt: -1 }).toArray();
    return res.json({
      success: true,
      receivedInvoices: docs.map((d) =>
        shapeReceivedInvoice(toAppDoc(d), { keepId: String(d.id || d._id) }),
      ),
    });
  } catch (err) {
    console.error("[invoice] listReceivedInvoices", err);
    return res.status(500).json({ success: false, message: "Failed to load received invoices" });
  }
}

export async function getReceivedInvoice(req, res) {
  try {
    const id = String(req.params.id || "");
    const doc = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Received invoice not found" });
    }
    return res.json({
      success: true,
      receivedInvoice: shapeReceivedInvoice(toAppDoc(doc), {
        keepId: String(doc.id || doc._id),
      }),
    });
  } catch (err) {
    console.error("[invoice] getReceivedInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to load received invoice" });
  }
}

export async function createReceivedInvoice(req, res) {
  try {
    const check = validateReceivedInvoice(req.body || {});
    if (!check.ok) {
      return res.status(400).json({ success: false, message: check.message });
    }

    const now = new Date().toISOString();
    const doc = {
      ...check.data,
      createdAt: now,
      updatedAt: now,
    };

    await col().insertOne(doc);
    return res.status(201).json({
      success: true,
      receivedInvoice: shapeReceivedInvoice(doc, { keepId: doc.id }),
    });
  } catch (err) {
    console.error("[invoice] createReceivedInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to save received invoice" });
  }
}

export async function updateReceivedInvoice(req, res) {
  try {
    const id = String(req.params.id || "");
    const existing = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Received invoice not found" });
    }

    const check = validateReceivedInvoice({ ...existing, ...(req.body || {}), id });
    if (!check.ok) {
      return res.status(400).json({ success: false, message: check.message });
    }

    const updatedAt = new Date().toISOString();
    const doc = {
      ...check.data,
      id,
      _id: existing._id,
      createdAt: existing.createdAt || updatedAt,
      updatedAt,
    };

    await col().replaceOne({ _id: existing._id }, doc);
    return res.json({
      success: true,
      receivedInvoice: shapeReceivedInvoice(doc, { keepId: id }),
    });
  } catch (err) {
    console.error("[invoice] updateReceivedInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to update received invoice" });
  }
}

export async function deleteReceivedInvoice(req, res) {
  try {
    const id = String(req.params.id || "");
    const result = await col().deleteOne({ $or: [{ id }, { _id: id }] });
    if (!result.deletedCount) {
      return res.status(404).json({ success: false, message: "Received invoice not found" });
    }
    return res.json({ success: true, message: "Received invoice deleted" });
  } catch (err) {
    console.error("[invoice] deleteReceivedInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to delete received invoice" });
  }
}
