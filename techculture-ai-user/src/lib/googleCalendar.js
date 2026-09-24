import { google } from "googleapis";
import { randomUUID } from "crypto";

const TIME_ZONE = "Asia/Kolkata";

const DEMO_TIME_SLOTS = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

function parseSlotToHoursMinutes(slot) {
  const match = String(slot).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error("Invalid time slot format");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

function buildDateTimeIso(dateValue, timeSlot) {
  const { hours, minutes } = parseSlotToHoursMinutes(timeSlot);
  const [year, month, day] = String(dateValue).split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error("Invalid date format");
  }

  const pad = (n) => String(n).padStart(2, "0");
  return {
    startIso: `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`,
    endIso: (() => {
      const total = hours * 60 + minutes + 30;
      const endH = Math.floor(total / 60);
      const endM = total % 60;
      return `${year}-${pad(month)}-${pad(day)}T${pad(endH)}:${pad(endM)}:00`;
    })(),
  };
}

function toUtcMillis(dateValue, timeSlot) {
  const { startIso } = buildDateTimeIso(dateValue, timeSlot);
  return Date.parse(`${startIso}+05:30`);
}

function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [
      !clientId && "GOOGLE_CLIENT_ID",
      !clientSecret && "GOOGLE_CLIENT_SECRET",
      !refreshToken && "GOOGLE_REFRESH_TOKEN",
    ].filter(Boolean);

    throw new Error(
      `Google Calendar is not configured. Missing: ${missing.join(", ")}`
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

function getCalendarClient() {
  const auth = getOAuthClient();
  return {
    calendar: google.calendar({ version: "v3", auth }),
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  };
}

/**
 * Returns demo time slots already busy on the given date (YYYY-MM-DD).
 */
export async function getBookedTimeSlots(dateValue) {
  const { calendar, calendarId } = getCalendarClient();

  const response = await calendar.events.list({
    calendarId,
    timeMin: `${dateValue}T00:00:00+05:30`,
    timeMax: `${dateValue}T23:59:59+05:30`,
    singleEvents: true,
    orderBy: "startTime",
    timeZone: TIME_ZONE,
  });

  const events = (response.data.items || []).filter(
    (event) => event.status !== "cancelled" && event.start?.dateTime
  );

  const busyRanges = events.map((event) => ({
    start: Date.parse(event.start.dateTime),
    end: Date.parse(event.end?.dateTime || event.start.dateTime),
  }));

  return DEMO_TIME_SLOTS.filter((slot) => {
    const slotStart = toUtcMillis(dateValue, slot);
    const slotEnd = slotStart + 30 * 60 * 1000;
    return busyRanges.some((busy) =>
      rangesOverlap(slotStart, slotEnd, busy.start, busy.end)
    );
  });
}

export async function assertSlotAvailable(dateValue, timeSlot) {
  const booked = await getBookedTimeSlots(dateValue);
  if (booked.includes(timeSlot)) {
    const error = new Error(
      "This date and time is already booked. Please choose another slot."
    );
    error.code = "SLOT_UNAVAILABLE";
    throw error;
  }
}

/**
 * Creates a 30-minute Google Calendar event with a Meet link
 * and emails invites to the guest (+ optional host).
 */
export async function createDemoCalendarEvent({
  fullName,
  workEmail,
  phone,
  company,
  location,
  message,
  demoDate,
  demoTime,
}) {
  await assertSlotAvailable(demoDate, demoTime);

  const { calendar, calendarId } = getCalendarClient();
  const hostEmails = (process.env.GOOGLE_HOST_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const { startIso, endIso } = buildDateTimeIso(demoDate, demoTime);

  const attendees = [{ email: workEmail, displayName: fullName }];
  const attendeeEmails = new Set([workEmail.toLowerCase()]);
  for (const hostEmail of hostEmails) {
    if (!attendeeEmails.has(hostEmail)) {
      attendees.push({ email: hostEmail });
      attendeeEmails.add(hostEmail);
    }
  }

  const descriptionLines = [
    `Demo booked via TechCulture AI website.`,
    ``,
    `Guest: ${fullName}`,
    `Email: ${workEmail}`,
    phone ? `Phone: ${phone}` : null,
    company && company !== "N/A" ? `Company: ${company}` : null,
    location && location !== "N/A" ? `Location: ${location}` : null,
    message ? `Looking to solve: ${message}` : null,
  ].filter(Boolean);

  const event = {
    summary: `TechCulture AI Demo — ${fullName}`,
    description: descriptionLines.join("\n"),
    location: "Google Meet",
    start: {
      dateTime: startIso,
      timeZone: TIME_ZONE,
    },
    end: {
      dateTime: endIso,
      timeZone: TIME_ZONE,
    },
    attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: randomUUID(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: event,
  });

  const data = response.data;
  const meetLink =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")
      ?.uri ||
    null;

  return {
    eventId: data.id,
    htmlLink: data.htmlLink,
    meetLink,
    status: data.status,
    start: data.start,
    end: data.end,
  };
}

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  );
}

export { DEMO_TIME_SLOTS };
