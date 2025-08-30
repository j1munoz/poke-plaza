// src/app/api/listings/[id]/route.ts
// src/app/api/listings/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";

type RouteParams = Promise<{ id: string }>;

function invalidId() {
  return NextResponse.json({ error: "Invalid id" }, { status: 400 });
}

/* GET /api/listings/:id */
export async function GET(_req: Request, { params }: { params: RouteParams }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return invalidId();

  const db = await getDb();
  const doc = await db.collection("listings").findOne({ _id: new ObjectId(id) });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: String(doc._id),
    ownerId: String(doc.ownerId),
    ownerUsername: doc.ownerUsername,
    cardNumber: doc.cardNumber,
    price: doc.price,
    condition: doc.condition,
    description: doc.description,
    images: doc.images ?? [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

type PatchBody = Partial<{
  cardNumber: number;
  price: number;
  condition:
    | "Mint"
    | "Near Mint"
    | "Excellent"
    | "Good"
    | "Light Played"
    | "Played"
    | "Poor";
  description: string;
  images: string[];
}>;

/* PATCH /api/listings/:id  (owner only) */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await req.json()) as PatchBody;

  const $set: Record<string, unknown> = {};
  if (body.cardNumber !== undefined) {
    const n = Number(body.cardNumber);
    if (!Number.isFinite(n) || n <= 0)
      return NextResponse.json({ error: "Invalid cardNumber" }, { status: 400 });
    $set.cardNumber = n;
  }
  if (body.price !== undefined) {
    const p = Number(body.price);
    if (!Number.isFinite(p) || p < 0)
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    $set.price = p;
  }
  if (body.condition !== undefined) {
    const ok = [
      "Mint",
      "Near Mint",
      "Excellent",
      "Good",
      "Light Played",
      "Played",
      "Poor",
    ].includes(body.condition as any);
    if (!ok)
      return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
    $set.condition = body.condition;
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string" || !body.description.trim())
      return NextResponse.json({ error: "Invalid description" }, { status: 400 });
    $set.description = body.description;
  }
  if (body.images !== undefined) {
    if (!Array.isArray(body.images))
      return NextResponse.json({ error: "Invalid images" }, { status: 400 });
    $set.images = body.images;
  }
  $set.updatedAt = new Date();

  const db = await getDb();

  // v6 returns the document (or null) by default.
  // If you want ModifyResult with `.value`, pass: { includeResultMetadata: true }.
  const updatedDoc = await db.collection("listings").findOneAndUpdate(
    { _id: new ObjectId(id), ownerId: new ObjectId(session.user.id) },
    { $set },
    { returnDocument: "after" } // add includeResultMetadata: true to get ModifyResult
  );

  // When includeResultMetadata is NOT set, updatedDoc is WithId<Document> | null
  if (!updatedDoc) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id });
}

/* DELETE /api/listings/:id  (owner only) */
export async function DELETE(_req: Request, { params }: { params: RouteParams }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) return invalidId();

  const db = await getDb();
  const res = await db.collection("listings").deleteOne({
    _id: new ObjectId(id),
    ownerId: new ObjectId(session.user.id),
  });

  if (!res.deletedCount) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id });
}


// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import { getDb } from "@/lib/db";
// import { auth } from "@/auth";
// import { ObjectId } from "mongodb";

// type PatchBody = Partial<{
//   cardNumber: number;
//   price: number;
//   condition:
//     | "Mint"
//     | "Near Mint"
//     | "Excellent"
//     | "Good"
//     | "Light Played"
//     | "Played"
//     | "Poor";
//   description: string;
//   images: string[];
// }>;

// // GET /api/listings/:id  (handy for the edit modal)
// export async function GET(
//   _req: Request,
//   { params }: { params: { id: string } },
// ) {
//   const { id } = params;
//   if (!ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid id" }, { status: 400 });
//   }

//   const db = await getDb();
//   const doc = await db.collection("listings").findOne({ _id: new ObjectId(id) });
//   if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

//   return NextResponse.json({
//     id: String(doc._id),
//     ownerId: String(doc.ownerId),
//     ownerUsername: doc.ownerUsername,
//     cardNumber: doc.cardNumber,
//     price: doc.price,
//     condition: doc.condition,
//     description: doc.description,
//     images: doc.images ?? [],
//     createdAt: doc.createdAt,
//     updatedAt: doc.updatedAt,
//   });
// }

// // PATCH /api/listings/:id  (owner only)
// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } },
// ) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = params;
//   if (!ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid id" }, { status: 400 });
//   }

//   const body = (await req.json()) as PatchBody;

//   // Validate (only if provided)
//   const set: Record<string, unknown> = {};
//   if (body.cardNumber !== undefined) {
//     const n = Number(body.cardNumber);
//     if (!Number.isFinite(n) || n <= 0)
//       return NextResponse.json({ error: "Invalid cardNumber" }, { status: 400 });
//     set.cardNumber = n;
//   }
//   if (body.price !== undefined) {
//     const p = Number(body.price);
//     if (!Number.isFinite(p) || p < 0)
//       return NextResponse.json({ error: "Invalid price" }, { status: 400 });
//     set.price = p;
//   }
//   if (body.condition !== undefined) {
//     const ok = [
//       "Mint",
//       "Near Mint",
//       "Excellent",
//       "Good",
//       "Light Played",
//       "Played",
//       "Poor",
//     ].includes(body.condition);
//     if (!ok)
//       return NextResponse.json({ error: "Invalid condition" }, { status: 400 });
//     set.condition = body.condition;
//   }
//   if (body.description !== undefined) {
//     if (typeof body.description !== "string" || !body.description.trim())
//       return NextResponse.json({ error: "Invalid description" }, { status: 400 });
//     set.description = body.description;
//   }
//   if (body.images !== undefined) {
//     if (!Array.isArray(body.images))
//       return NextResponse.json({ error: "Invalid images" }, { status: 400 });
//     set.images = body.images;
//   }
//   set.updatedAt = new Date();

//   const db = await getDb();

//   // Owner check is enforced in the query filter
//   const res = await db.collection("listings").findOneAndUpdate(
//     { _id: new ObjectId(id), ownerId: new ObjectId(session.user.id) },
//     { $set: set },
//     { returnDocument: "after" },
//   );

//   if (!res.value)
//     return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });

//   return NextResponse.json({ ok: true, id });
// }

// // DELETE /api/listings/:id  (owner only)
// export async function DELETE(
//   _req: Request,
//   { params }: { params: { id: string } },
// ) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { id } = params;
//   if (!ObjectId.isValid(id)) {
//     return NextResponse.json({ error: "Invalid id" }, { status: 400 });
//   }

//   const db = await getDb();
//   const res = await db.collection("listings").deleteOne({
//     _id: new ObjectId(id),
//     ownerId: new ObjectId(session.user.id),
//   });

//   if (!res.deletedCount) {
//     return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
//   }

//   return NextResponse.json({ ok: true, id });
// }
