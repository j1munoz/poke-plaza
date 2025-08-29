// src/app/api/cards/route.ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const cards = await db.collection("cards").find({}).toArray();

    return NextResponse.json(cards, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch cards:", err);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 },
    );
  }
}
