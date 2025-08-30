// src/app/api/account/password/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { hashPassword, verifyPassword } from "@/lib/password";

type Body = {
  currentPassword?: string;
  newPassword?: string;
};

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return bad("Unauthorized", 401);

  const { currentPassword = "", newPassword = "" } = (await req.json()) as Body;

  // Basic validation
  if (
    typeof newPassword !== "string" ||
    newPassword.length < 8 ||
    newPassword.length > 72
  ) {
    return bad("Password must be 8–72 characters.");
  }

  const db = await getDb();
  const user = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { passwordHash: 1 } },
    );

  if (!user) return bad("User not found", 404);

  // If account already has a password, verify current password first
  const hasExisting = Boolean(user.passwordHash);
  if (hasExisting) {
    if (!currentPassword) return bad("Current password is required.");
    const ok = await verifyPassword(currentPassword, String(user.passwordHash));
    if (!ok) return bad("Current password is incorrect.");
  }

  const newHash = await hashPassword(newPassword);

  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { passwordHash: newHash, passwordUpdatedAt: new Date() } },
    );

  return NextResponse.json({ ok: true });
}
