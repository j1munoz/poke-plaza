//src/app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

import { handlers } from "@/auth";
export const { GET, POST } = handlers;

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("token", "", { path: "/", maxAge: 0 });
  return res;
}
