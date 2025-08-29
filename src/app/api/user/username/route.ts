// src/app/api/user/username/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

const USERNAME_RE = /^[a-z0-9_\.]{3,20}$/i;

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json().catch(() => ({}));
  if (typeof username !== "string" || !USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Invalid username. Use 3–20 letters, numbers, dot or underscore." },
      { status: 400 }
    );
  }

  const db = await getDb();
  try {
    const res = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { username: username.toLowerCase() } }
    );
    if (!res.matchedCount) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    
    if (e?.code === 11000) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
