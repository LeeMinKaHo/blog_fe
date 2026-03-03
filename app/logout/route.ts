import { NextResponse } from "next/server";

export function GET() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("token", "", { maxAge: 0 });
  return res;
}
