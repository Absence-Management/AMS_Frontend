// ============================================
// AMS — ESI Sidi Bel Abbès
// app/api/google/callback/route.js
//
// WHY THIS EXISTS:
// The Google OAuth callback must hit the backend to exchange the code.
// If the browser hits the backend directly, Set-Cookie headers land on
// the backend domain (onrender.com), not the frontend domain — so the
// frontend never has the auth cookies.
//
// This route intercepts the Google redirect server-side, forwards the
// code+state to the backend, captures the Set-Cookie headers from the
// backend response, and re-sets them on the browser under the FRONTEND
// domain. That is what makes cookie-based auth work across domains.
// ============================================

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Google returned an error (user denied consent, etc.)
  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL("/login?error=google_auth_failed", request.url),
    );
  }

  try {
    const backendBase = process.env.NEXT_PUBLIC_API_URL; // e.g. https://backend.onrender.com/api
    const callbackUrl = `${backendBase}/v1/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;

    // Fetch the backend callback WITHOUT following redirects so we can
    // intercept the Set-Cookie headers before the browser is redirected.
    const backendRes = await fetch(callbackUrl, {
      redirect: "manual",
    });

    // ── Extract Set-Cookie headers ──────────────────────────────
    // The backend returns a 302 with Set-Cookie on its own domain.
    // We capture them here and will re-attach them to OUR response
    // so the browser stores them under the FRONTEND domain instead.
    const rawCookies = backendRes.headers.getSetCookie
      ? backendRes.headers.getSetCookie() // Node 18+ (array)
      : (backendRes.headers.get("set-cookie") ?? "")
          .split(/,(?=[^ ])/)
          .filter(Boolean);

    // ── Determine where to send the user ───────────────────────
    // Backend sends: Location: https://frontend.com/{role}?new=true
    // We only need the path part since we're already on the frontend.
    let redirectPath = "/auth/callback"; // fallback → let callback page call /me
    const location = backendRes.headers.get("location");

    if (location) {
      try {
        const loc = new URL(location);
        redirectPath = loc.pathname + loc.search; // e.g. /admin?new=true
      } catch {
        redirectPath = location; // relative path — use as-is
      }
    }

    // ── Build the redirect response with forwarded cookies ─────
    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    for (const cookie of rawCookies) {
      // Strip any Domain= attribute so the cookie applies to the
      // frontend domain, not the backend's domain.
      const sanitized = cookie
        .replace(/;\s*domain=[^;]*/gi, "")
        .replace(/;\s*samesite=none/gi, "; SameSite=Lax"); // tighten in same-site setup

      response.headers.append("Set-Cookie", sanitized);
    }

    return response;
  } catch (err) {
    console.error("[google/callback] Backend proxy failed:", err);
    return NextResponse.redirect(
      new URL("/login?error=google_auth_failed", request.url),
    );
  }
}
