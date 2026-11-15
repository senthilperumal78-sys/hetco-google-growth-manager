# HETCO Google Growth Manager

Responsive React + Vite prototype for ethical Google Business Profile growth.

## Run

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite. For a production build run `npm run build` and deploy `dist/` to static hosting.

## Features
- Responsive overview with clearly marked unconnected metrics (never fabricated).
- Keyword tracker with manual ranking observations.
- Review request composer, local request log and CSV export. No messages are sent automatically.
- Business settings and Google Business Profile API setup guidance.
- Browser localStorage persistence; no cloud sync or account authentication.

## Connect live Google data (next phase)
1. Obtain approval/access for the Google Business Profile APIs for your Google Cloud project.
2. Configure OAuth consent and a server-side OAuth 2.0 authorization-code flow. Request `https://www.googleapis.com/auth/business.manage` as needed; validate currently supported scopes/endpoints in Google's documentation.
3. Keep client secrets and refresh tokens on the server, encrypted and never bundled into frontend code.
4. Use Account Management and Business Information APIs to select an authorised location, and the Business Profile Performance API for supported performance metrics.
5. Create authenticated backend endpoints for metrics; add error handling, rate limits, least-privilege access and token revocation.
6. For automated geo-grid keyword tracking, use a compliant ranking provider; Business Profile Performance API does not supply organic/map ranking positions.

**Important:** Do not use artificial views, fake clicks, fake reviews, or engagement manipulation. Review requests should be sent to real customers without incentives or review gating.
