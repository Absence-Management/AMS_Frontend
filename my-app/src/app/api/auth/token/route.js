import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  // FastAPI sets the auth cookie as 'access_token'
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  // Derive the WebSocket base URL from the backend API URL.
  // NEXT_PUBLIC_API_URL is e.g. https://absence-management-backend.onrender.com/api
  // We need: wss://absence-management-backend.onrender.com
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const wsBaseUrl = apiUrl
    .replace(/\/api$/, "")
    .replace(/^http/, "ws");

  return NextResponse.json({ token, wsBaseUrl });
}
