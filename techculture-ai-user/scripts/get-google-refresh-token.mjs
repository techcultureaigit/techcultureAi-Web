/**
 * One-time helper to generate GOOGLE_REFRESH_TOKEN.
 *
 * 1. Google Cloud Console → OAuth client (Web)
 * 2. Redirect URI: http://localhost:3000/oauth2callback
 * 3. Enable Google Calendar API
 * 4. Put GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in .env.local
 * 5. node scripts/get-google-refresh-token.mjs
 * 6. Approve with host Gmail, paste code, copy refresh_token into .env.local
 */

import { createInterface } from "readline";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { google } from "googleapis";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri =
  process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000/oauth2callback";

if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar"],
});

console.log("\n1) Open this URL in your browser:\n");
console.log(authUrl);
console.log(
  "\n2) Sign in with the Google account that should own demo meetings."
);
console.log("3) After approve, copy the `code` query param from the redirect URL.\n");

const rl = createInterface({ input: process.stdin, output: process.stdout });
rl.question("Paste the code here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\nAdd these to .env.local:\n");
    console.log(
      `GOOGLE_REFRESH_TOKEN=${
        tokens.refresh_token ||
        "(missing — revoke app access at myaccount.google.com/permissions and retry)"
      }`
    );
  } catch (err) {
    console.error("Failed to exchange code:", err.message);
  } finally {
    rl.close();
  }
});
