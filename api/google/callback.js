
import { neon } from "@neondatabase/serverless";

import { timingSafeEqual } from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({ error: "Google authorisation declined" });
  }

  const cookie = req.headers.cookie || "";
  const savedState = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("google_oauth_state="))
    ?.slice("google_oauth_state=".length);

  res.setHeader(
    "Set-Cookie",
    "google_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/google; Max-Age=0"
  );

  if (!code || !state || !savedState) {
    return res.status(400).json({ error: "Missing OAuth information" });
  }

  const a = Buffer.from(String(state));
  const b = Buffer.from(savedState);

  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return res.status(403).json({ error: "Invalid OAuth state" });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Google credentials not configured" });
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri:
          "https://hetco-google-growth-manager.vercel.app/api/google/callback",
        grant_type: "authorization_code"
      })
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Google token exchange failed" });
    }

    // Tokens must be stored securely on the server.
    // Never expose them in the browser or URL.
    return res.status(200).json({
      success: true,
      message: "Google authorised. Secure token storage is the next step."
    });
  } catch {
    return res.status(502).json({ error: "Google connection failed" });
  }
}
