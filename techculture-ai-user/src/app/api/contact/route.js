import { NextResponse } from "next/server";
import { BACKOFFICE_API_URL } from "@/lib/blogApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = String(body?.phone || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name) return badRequest("Name is required.");
    if (!email || !EMAIL_REGEX.test(email)) {
      return badRequest("A valid email is required.");
    }
    if (!message) return badRequest("Message is required.");

    const res = await fetch(`${BACKOFFICE_API_URL}/api/contacts/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, subject, message }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to send message. Please try again.",
        },
        { status: res.status >= 400 ? res.status : 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      data: data.data || null,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send message right now. Please email info@techculture.ai.",
      },
      { status: 503 }
    );
  }
}
