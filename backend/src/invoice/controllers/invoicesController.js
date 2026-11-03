import { invoiceCollection, toAppDoc } from "../db.js";
import { shapeInvoice, validateInvoice } from "../schemas.js";

function col() {
  return invoiceCollection("invoices");
}

async function nextInvoiceNo() {
  const year = new Date().getFullYear();
  const docs = await col()
    .find({ invoiceNo: { $regex: `/${year}$` } })
    .project({ invoiceNo: 1 })
    .toArray();

  let max = 0;
  for (const doc of docs) {
    const match = String(doc.invoiceNo || "").match(/^(\d+)\//);
    if (match) max = Math.max(max, Number(match[1]) || 0);
  }
  return `${String(max + 1).padStart(3, "0")}/${year}`;
}

export async function listInvoices(req, res) {
  try {
    const q = String(req.query.q || "").trim();
    const status = String(req.query.status || "").trim();
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { invoiceNo: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { "billTo.name": { $regex: q, $options: "i" } },
      ];
    }

    const docs = await col().find(filter).sort({ date: -1, updatedAt: -1 }).toArray();
    return res.json({
      success: true,
      invoices: docs.map((d) => shapeInvoice(toAppDoc(d), { keepId: String(d.id || d._id) })),
    });
  } catch (err) {
    console.error("[invoice] listInvoices", err);
    return res.status(500).json({ success: false, message: "Failed to load invoices" });
  }
}

export async function getInvoice(req, res) {
  try {
    const id = String(req.params.id || "");
    const doc = await col().findOne({
      $or: [{ id }, { _id: id }, { invoiceNo: id }],
    });
    if (!doc) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    return res.json({
      success: true,
      invoice: shapeInvoice(toAppDoc(doc), { keepId: String(doc.id || doc._id) }),
    });
  } catch (err) {
    console.error("[invoice] getInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to load invoice" });
  }
}

export async function createInvoice(req, res) {
  try {
    const body = { ...(req.body || {}) };
    // Always auto-generate invoice number on create
    body.invoiceNo = await nextInvoiceNo();

    const check = validateInvoice(body);
    if (!check.ok) {
      return res.status(400).json({ success: false, message: check.message });
    }

    const existingNo = await col().findOne({ invoiceNo: check.data.invoiceNo });
    if (existingNo) {
      return res.status(409).json({
        success: false,
        message: `Invoice number ${check.data.invoiceNo} already exists`,
      });
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
      invoice: shapeInvoice(doc, { keepId: doc.id }),
    });
  } catch (err) {
    console.error("[invoice] createInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to create invoice" });
  }
}

export async function updateInvoice(req, res) {
  try {
    const id = String(req.params.id || "");
    const existing = await col().findOne({ $or: [{ id }, { _id: id }] });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const check = validateInvoice({ ...existing, ...(req.body || {}), id });
    if (!check.ok) {
      return res.status(400).json({ success: false, message: check.message });
    }

    if (check.data.invoiceNo !== existing.invoiceNo) {
      const clash = await col().findOne({
        invoiceNo: check.data.invoiceNo,
        id: { $ne: id },
      });
      if (clash) {
        return res.status(409).json({
          success: false,
          message: `Invoice number ${check.data.invoiceNo} already exists`,
        });
      }
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
    return res.json({ success: true, invoice: shapeInvoice(doc, { keepId: id }) });
  } catch (err) {
    console.error("[invoice] updateInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to update invoice" });
  }
}

export async function deleteInvoice(req, res) {
  try {
    const id = String(req.params.id || "");
    const result = await col().deleteOne({ $or: [{ id }, { _id: id }] });
    if (!result.deletedCount) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    return res.json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    console.error("[invoice] deleteInvoice", err);
    return res.status(500).json({ success: false, message: "Failed to delete invoice" });
  }
}
