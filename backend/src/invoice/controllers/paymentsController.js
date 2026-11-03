import { invoiceCollection, toAppDoc } from "../db.js";
import { shapePayment, validatePayment } from "../schemas.js";

function col() {
  return invoiceCollection("payments");
}

export async function listPayments(req, res) {
  try {
    const q = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim();
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
      ];
    }

    const docs = await col().find(filter).sort({ date: -1, updatedAt: -1 }).toArray();
    return res.json({
      success: true,
      payments: docs.map((d) => shapePayment(toAppDoc(d), { keepId: String(d.id || d._id) })),
    });
  } catch (err) {
    console.error("[invoice] listPayments", err);
    return res.status(500).json({ success: false, message: "Failed to load payments" });
  }
}

export async function getPayment(req, res) {
  try {
    const id = String(req.params.id || "");
    const doc = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.json({
      success: true,
      payment: shapePayment(toAppDoc(doc), { keepId: String(doc.id || doc._id) }),
    });
  } catch (err) {
    console.error("[invoice] getPayment", err);
    return res.status(500).json({ success: false, message: "Failed to load payment" });
  }
}

export async function createPayment(req, res) {
  try {
    const check = validatePayment(req.body || {});
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
      payment: shapePayment(doc, { keepId: doc.id }),
    });
  } catch (err) {
    console.error("[invoice] createPayment", err);
    return res.status(500).json({ success: false, message: "Failed to create payment" });
  }
}

export async function updatePayment(req, res) {
  try {
    const id = String(req.params.id || "");
    const existing = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    const check = validatePayment({ ...existing, ...(req.body || {}), id });
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
    return res.json({ success: true, payment: shapePayment(doc, { keepId: id }) });
  } catch (err) {
    console.error("[invoice] updatePayment", err);
    return res.status(500).json({ success: false, message: "Failed to update payment" });
  }
}

export async function deletePayment(req, res) {
  try {
    const id = String(req.params.id || "");
    const result = await col().deleteOne({ $or: [{ id }, { _id: id }] });
    if (!result.deletedCount) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    return res.json({ success: true, message: "Payment deleted" });
  } catch (err) {
    console.error("[invoice] deletePayment", err);
    return res.status(500).json({ success: false, message: "Failed to delete payment" });
  }
}
