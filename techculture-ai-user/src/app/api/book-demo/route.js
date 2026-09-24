import { NextResponse } from "next/server";
import {
  createDemoCalendarEvent,
  isGoogleCalendarConfigured,
} from "@/lib/googleCalendar";
import { BACKOFFICE_API_URL } from "@/lib/blogApi";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{1,2}:\d{2}\s*(AM|PM)$/i;

function badRequest(message) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

async function saveBookingToBackoffice(payload) {
  try {
    const res = await fetch(`${BACKOFFICE_API_URL}/api/demos/public`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error(
        "Failed to save demo booking to backoffice:",
        data.message || res.status
      );
    }
  } catch (error) {
    console.error("Failed to save demo booking to backoffice:", error);
  }
}

export async function POST(request) {
  try {
    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Calendar is not configured. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN to .env.local.",
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      fullName,
      workEmail,
      phone,
      company,
      location,
      message,
      demoDate,
      demoTime,
    } = body || {};

    if (!fullName?.trim()) return badRequest("Full name is required.");
    if (!workEmail?.trim() || !EMAIL_REGEX.test(workEmail)) {
      return badRequest("A valid work email is required.");
    }
    if (!phone?.trim() || !PHONE_REGEX.test(String(phone).replace(/\D/g, ""))) {
      return badRequest("A valid 10-digit phone number is required.");
    }
    if (!demoDate || !DATE_REGEX.test(demoDate)) {
      return badRequest("A valid demo date is required.");
    }
    if (!demoTime || !TIME_REGEX.test(demoTime)) {
      return badRequest("A valid demo time is required.");
    }

    const demoStart = new Date(`${demoDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(demoStart.getTime()) || demoStart <= today) {
      return badRequest("Please choose a future working day.");
    }
    const day = demoStart.getDay();
    if (day === 0 || day === 6) {
      return badRequest("Please choose a weekday (Mon–Fri).");
    }

    const guest = {
      fullName: fullName.trim(),
      workEmail: workEmail.trim().toLowerCase(),
      phone: String(phone).replace(/\D/g, ""),
      company: company?.trim() || "N/A",
      location: location?.trim() || "N/A",
      message: message?.trim() || "",
      demoDate,
      demoTime: demoTime.trim(),
    };

    const result = await createDemoCalendarEvent(guest);

    await saveBookingToBackoffice({
      ...guest,
      eventId: result.eventId || "",
      meetLink: result.meetLink || "",
      calendarLink: result.htmlLink || "",
    });

    return NextResponse.json({
      success: true,
      message: "Demo scheduled. Calendar invite and Meet link sent.",
      data: {
        eventId: result.eventId,
        meetLink: result.meetLink,
        calendarLink: result.htmlLink,
        start: result.start,
        end: result.end,
      },
    });
  } catch (error) {
    console.error("Book demo / Google Calendar error:", error);

    if (error?.code === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 409 }
      );
    }

    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Failed to schedule demo. Please try again.";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
