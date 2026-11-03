import { nanoid } from "nanoid";
import { getDb } from "../mongo.js";
import { invoiceConfig } from "./config.js";

export function invoiceCollection(name) {
  const mapped = invoiceConfig.collections[name];
  if (!mapped) {
    throw new Error(`Unknown invoice collection key: ${name}`);
  }
  return getDb().collection(mapped);
}

export function newId(prefix = "id") {
  return `${prefix}_${nanoid(10)}`;
}

export function toAppDoc(doc) {
  if (!doc) return doc;
  const id = String(doc.id || doc._id);
  return { ...doc, id, _id: id };
}

export function withIds(doc) {
  const id = String(doc.id || doc._id || newId("doc"));
  const { _id: _ignored, ...rest } = doc;
  return { ...rest, id, _id: id };
}

export async function ensureInvoiceIndexes() {
  const customers = invoiceCollection("customers");
  const invoices = invoiceCollection("invoices");
  const payments = invoiceCollection("payments");

  await Promise.all([
    customers.createIndex({ email: 1 }),
    customers.createIndex({ name: 1 }),
    customers.createIndex({ updatedAt: -1 }),
    invoices.createIndex({ invoiceNo: 1 }, { unique: true }),
    invoices.createIndex({ status: 1 }),
    invoices.createIndex({ date: -1 }),
    invoices.createIndex({ "billTo.name": 1 }),
    payments.createIndex({ date: -1 }),
    payments.createIndex({ status: 1 }),
  ]);
}
