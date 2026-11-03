import { invoiceCollection, toAppDoc } from "../db.js";
import { shapeCustomer, validateCustomer } from "../schemas.js";

function col() {
  return invoiceCollection("customers");
}

export async function listCustomers(req, res) {
  try {
    const q = String(req.query.q || "").trim();
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { companyName: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { mobile: { $regex: q, $options: "i" } },
      ];
    }

    const docs = await col().find(filter).sort({ updatedAt: -1, createdAt: -1 }).toArray();
    return res.json({
      success: true,
      customers: docs.map((d) => shapeCustomer(toAppDoc(d), { keepId: String(d.id || d._id) })),
    });
  } catch (err) {
    console.error("[invoice] listCustomers", err);
    return res.status(500).json({ success: false, message: "Failed to load customers" });
  }
}

export async function getCustomer(req, res) {
  try {
    const id = String(req.params.id || "");
    const doc = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    return res.json({
      success: true,
      customer: shapeCustomer(toAppDoc(doc), { keepId: String(doc.id || doc._id) }),
    });
  } catch (err) {
    console.error("[invoice] getCustomer", err);
    return res.status(500).json({ success: false, message: "Failed to load customer" });
  }
}

export async function createCustomer(req, res) {
  try {
    const check = validateCustomer(req.body || {});
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
    return res.status(201).json({ success: true, customer: shapeCustomer(doc, { keepId: doc.id }) });
  } catch (err) {
    console.error("[invoice] createCustomer", err);
    return res.status(500).json({ success: false, message: "Failed to create customer" });
  }
}

export async function updateCustomer(req, res) {
  try {
    const id = String(req.params.id || "");
    const existing = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const check = validateCustomer({ ...existing, ...(req.body || {}), id });
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
    return res.json({ success: true, customer: shapeCustomer(doc, { keepId: id }) });
  } catch (err) {
    console.error("[invoice] updateCustomer", err);
    return res.status(500).json({ success: false, message: "Failed to update customer" });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const id = String(req.params.id || "");
    const result = await col().deleteOne({ $or: [{ id }, { _id: id }] });
    if (!result.deletedCount) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }
    return res.json({ success: true, message: "Customer deleted" });
  } catch (err) {
    console.error("[invoice] deleteCustomer", err);
    return res.status(500).json({ success: false, message: "Failed to delete customer" });
  }
}
