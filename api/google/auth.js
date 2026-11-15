
import { randomBytes } from "node:crypto";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: "Google Client ID is not configured"
    });
  }

  const state = randomBytes(32).toString("hex");
  const redirectUri =
    "https://hetco-google-growth-manager.vercel.app/api/google/callback";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage",
    access_type: "offline",
    prompt: "consent",
    state
  });

  res.setHeader(
    "Set-Cookie",
    `google_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api/google; Max-Age=600`
  );

  return res.redirect(
    302,
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
