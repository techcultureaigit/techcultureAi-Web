const EMAIL_REGEX =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;

const PHONE_REGEX = /^[6-9]\d{9}$/;

/** Letters, spaces, apostrophe, hyphen, and period only — no digits/symbols. */
const FULL_NAME_REGEX = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/;

export function sanitizeFullNameInput(value) {
  return String(value)
    .replace(/[0-9]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

export function sanitizePhoneInput(value) {
  return String(value).replace(/\D/g, "").slice(0, 10);
}

export function validateFullName(name) {
  const value = String(name || "").trim();
  if (!value) return "Full name is required.";
  if (value.length < 2) return "Enter at least 2 letters for your name.";
  if (/\d/.test(value)) return "Full name cannot contain numbers.";
  if (!FULL_NAME_REGEX.test(value)) {
    return "Use letters only (spaces, apostrophe, or hyphen allowed).";
  }
  return "";
}

export function validateEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  if (!value) return "Email is required.";
  if (/\s/.test(value)) return "Email cannot contain spaces.";
  if (!EMAIL_REGEX.test(value)) {
    return "Enter a valid email (e.g. name@company.com).";
  }
  return "";
}

export function validatePhone(phone) {
  const value = String(phone || "").replace(/\D/g, "");
  if (!value) return "Mobile number is required.";
  if (value.length !== 10) {
    return "Mobile number must be exactly 10 digits.";
  }
  if (!PHONE_REGEX.test(value)) {
    return "Enter a valid Indian mobile number starting with 6–9.";
  }
  return "";
}

export { EMAIL_REGEX, PHONE_REGEX, FULL_NAME_REGEX };
