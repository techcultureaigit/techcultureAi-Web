import { NextResponse } from "next/server";
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/lib/careers/validation";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function badRequest(message) {
  return NextResponse.json({ success: false, message }, { status: 400 });
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const phone = String(formData.get("phone") || "").replace(/\D/g, "");
    const location = String(formData.get("location") || "").trim();
    const linkedIn = String(formData.get("linkedIn") || "").trim();
    const experienceYears = String(formData.get("experienceYears") || "").trim();
    const currentCtc = String(formData.get("currentCtc") || "").trim();
    const expectedCtc = String(formData.get("expectedCtc") || "").trim();
    const noticePeriod = String(formData.get("noticePeriod") || "").trim();
    const currentCompany = String(formData.get("currentCompany") || "").trim();
    const coverNote = String(formData.get("coverNote") || "").trim();
    const jobId = String(formData.get("jobId") || "").trim();
    const jobTitle = String(formData.get("jobTitle") || "").trim();
    const resume = formData.get("resume");

    const nameError = validateFullName(fullName);
    if (nameError) return badRequest(nameError);

    const emailError = validateEmail(email);
    if (emailError) return badRequest(emailError);

    const phoneError = validatePhone(phone);
    if (phoneError) return badRequest(phoneError);

    if (!experienceYears) return badRequest("Total experience is required.");
    if (!currentCtc) return badRequest("Current CTC is required.");
    if (!expectedCtc) return badRequest("Expected CTC is required.");
    if (!noticePeriod) return badRequest("Notice period is required.");
    if (!jobId || !jobTitle) return badRequest("Please select a valid role.");

    if (!(resume instanceof File) || resume.size === 0) {
      return badRequest("Please upload your resume.");
    }
    if (resume.size > MAX_RESUME_BYTES) {
      return badRequest("Resume must be 5 MB or smaller.");
    }
    if (
      resume.type &&
      !ALLOWED_RESUME_TYPES.has(resume.type) &&
      !/\.(pdf|doc|docx)$/i.test(resume.name || "")
    ) {
      return badRequest("Upload resume as PDF or DOC/DOCX.");
    }

    // Application accepted — wire email/ATS storage here when backend is ready.
    return NextResponse.json({
      success: true,
      message:
        "Application submitted successfully. Our hiring team will review and get back to you.",
      data: {
        jobId,
        jobTitle,
        applicant: fullName,
        email,
        resumeName: resume.name,
        resumeSize: resume.size,
        location: location || null,
        linkedIn: linkedIn || null,
        experienceYears,
        currentCtc,
        expectedCtc,
        noticePeriod,
        currentCompany: currentCompany || null,
        coverNote: coverNote || null,
      },
    });
  } catch (error) {
    console.error("Career application error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit application right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
