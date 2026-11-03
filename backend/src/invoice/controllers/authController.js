import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { readCollection } from "../../db.js";

function signAdminToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin",
      app: "invoice",
    },
    config.jwtSecret,
    { expiresIn: "12h" },
  );
}

export async function login(req, res) {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admins = await readCollection("admins", []);
    const admin = admins.find((a) => a.email === email && a.active !== false);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Only admin users can access the invoice app",
      });
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    const token = signAdminToken(admin);
    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("[invoice] login", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
}

export async function me(req, res) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    if (payload.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin users can access the invoice app",
      });
    }

    return res.json({
      success: true,
      admin: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
