import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/* Finds specific card */

export async function GET(
  request: Request,
  { params }: { params: { cardId: string } },
) {
  try {
    const { cardId } = params;

    const db = await getDb();
    const card = await db.collection("cards").findOne({ cardId: cardId });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(card, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch card:", err);
    return NextResponse.json(
      { error: "Failed to fetch card" },
      { status: 500 },
    );
  }
}