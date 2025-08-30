// src/app/api/account/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

// type RouteParams = Promise<Record<string, never>>; // no params here

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const userId = new ObjectId(session.user.id);

  // Best effort username/handle used in reviews
  const handle =
    (session.user as { username?: string | null })?.username?.toLowerCase() ??
    session.user.name?.toLowerCase() ??
    "";

  // Delete all related data first (best effort)
  const ops: Promise<unknown>[] = [];

  // Listings you own
  ops.push(db.collection("listings").deleteMany({ ownerId: userId }));

  // Reviews where you were seller or author (your schema may use soldBy / soldby, reviewBy / reviewby)
  ops.push(
    db
      .collection("reviews")
      .deleteMany({
        $or: [
          { soldBy: handle },
          { soldby: handle },
          { reviewBy: handle },
          { reviewby: handle },
        ],
      })
      .catch(() => undefined), // in case the collection doesn't exist
  );

  // Finally, delete user
  ops.push(db.collection("users").deleteOne({ _id: userId }));

  await Promise.all(ops);

  return NextResponse.json({ ok: true });
}
