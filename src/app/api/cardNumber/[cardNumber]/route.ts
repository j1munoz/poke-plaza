// src/app/api/cardNumber/[cardNumber]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface Params {
  params: { cardNumber: string };
}

/* Grabs listings for a specific card number */

export async function GET(req: Request, { params }: Params) {
  const { cardNumber } = params;

  if (!cardNumber) {
    return NextResponse.json([]);
  }

  const numericCardNumber = parseInt(cardNumber, 10);
  if (isNaN(numericCardNumber)) {
    return NextResponse.json([]);
  }

  const db = await getDb();
  const docs = await db
    .collection("listings")
    .find({ cardNumber: numericCardNumber }) // assumes cardNumber is stored as a number in DB
    .sort({ createdAt: -1 })
    .toArray();

  const items = docs.map((d) => ({
    id: String(d._id),
    ownerUsername: d.ownerUsername,
    cardNumber: d.cardNumber,
    price: d.price,
    condition: d.condition,
    description: d.description,
    images: d.images ?? [],
    createdAt: d.createdAt ?? new Date().toISOString(),
  }));

  return NextResponse.json(items);
}