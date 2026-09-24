import { NextResponse } from "next/server";
import {
  getBookedTimeSlots,
  isGoogleCalendarConfigured,
} from "@/lib/googleCalendar";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request) {
  try {
    if (!isGoogleCalendarConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: "Google Calendar is not configured.",
          bookedSlots: [],
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date || !DATE_REGEX.test(date)) {
      return NextResponse.json(
        { success: false, message: "A valid date (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    const bookedSlots = await getBookedTimeSlots(date);

    return NextResponse.json({
      success: true,
      date,
      bookedSlots,
    });
  } catch (error) {
    console.error("Booked slots lookup failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to load available slots.",
        bookedSlots: [],
      },
      { status: 500 }
    );
  }
}
