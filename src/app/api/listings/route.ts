// // //src/app/api/listings/route.ts

export const dynamic = "force-dynamic"; // no caching

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").toLowerCase().trim();

  if (!username) return NextResponse.json([]);

  const db = await getDb();
  const docs = await db
    .collection("listings")
    .find({ ownerUsername: username })
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


import { auth } from "@/auth";
import { ObjectId } from "mongodb";

type ListingCondition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Good"
  | "Light Played"
  | "Played"
  | "Poor";

type CreateListingBody = {
  cardNumber: number;
  price: number;
  condition: ListingCondition;
  description: string;
  images: string[]; // data URLs or hosted URLs
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as Partial<CreateListingBody>;

  const errors: string[] = [];
  const num = Number(body.cardNumber);
  const price = Number(body.price);

  if (!Number.isFinite(num) || num <= 0) errors.push("cardNumber");
  if (!Number.isFinite(price) || price < 0) errors.push("price");
  if (
    !body.condition ||
    ![
      "Mint",
      "Near Mint",
      "Excellent",
      "Good",
      "Light Played",
      "Played",
      "Poor",
    ].includes(body.condition)
  )
    errors.push("condition");
  if (typeof body.description !== "string" || !body.description.trim())
    errors.push("description");
  if (!Array.isArray(body.images) || body.images.length === 0)
    errors.push("images");

  if (errors.length) {
    return NextResponse.json(
      { error: "Invalid payload", fields: errors },
      { status: 400 },
    );
  }

  const db = await getDb();
  await db.collection("listings").createIndex({ ownerId: 1, createdAt: -1 });

  const doc = {
    ownerId: new ObjectId(session.user.id),
    ownerUsername:
      (session.user as { username?: string | null })?.username?.toLowerCase() ??
      session.user.name?.toLowerCase() ??
      "",
    cardNumber: num,
    price,
    condition: body.condition!,
    description: body.description!,
    images: body.images!,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const res = await db.collection("listings").insertOne(doc);
  return NextResponse.json({ id: res.insertedId.toString() }, { status: 201 });
}

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { getDb } from "@/lib/db";
// import { ObjectId } from "mongodb";

// type ListingCondition =
//   | "Mint"
//   | "Near Mint"
//   | "Excellent"
//   | "Good"
//   | "Light Played"
//   | "Played"
//   | "Poor";

// type CreateListingBody = {
//   cardNumber: number;
//   price: number;
//   condition: ListingCondition;
//   description: string;
//   images: string[]; // data URLs or hosted URLs
// };

// export async function POST(req: Request) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body = (await req.json()) as Partial<CreateListingBody>;

//   const errors: string[] = [];
//   const num = Number(body.cardNumber);
//   const price = Number(body.price);

//   if (!Number.isFinite(num) || num <= 0) errors.push("cardNumber");
//   if (!Number.isFinite(price) || price < 0) errors.push("price");
//   if (
//     !body.condition ||
//     ![
//       "Mint",
//       "Near Mint",
//       "Excellent",
//       "Good",
//       "Light Played",
//       "Played",
//       "Poor",
//     ].includes(body.condition)
//   )
//     errors.push("condition");
//   if (typeof body.description !== "string" || !body.description.trim())
//     errors.push("description");
//   if (!Array.isArray(body.images) || body.images.length === 0)
//     errors.push("images");

//   if (errors.length) {
//     return NextResponse.json(
//       { error: "Invalid payload", fields: errors },
//       { status: 400 },
//     );
//   }

//   const db = await getDb();
//   await db.collection("listings").createIndex({ ownerId: 1, createdAt: -1 });

//   const doc = {
//     ownerId: new ObjectId(session.user.id),
//     ownerUsername:
//       (session.user as { username?: string | null })?.username?.toLowerCase() ??
//       session.user.name?.toLowerCase() ??
//       "",
//     cardNumber: num,
//     price,
//     condition: body.condition!,
//     description: body.description!,
//     images: body.images!,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   const res = await db.collection("listings").insertOne(doc);
//   return NextResponse.json({ id: res.insertedId.toString() }, { status: 201 });
// }

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const username = url.searchParams.get("username");
//   const ownerId = url.searchParams.get("ownerId");

//   const db = await getDb();
//   const filter: Record<string, unknown> = {};
//   if (username) filter.ownerUsername = username.toLowerCase();
//   if (ownerId) filter.ownerId = new ObjectId(ownerId);

//   const docs = await db
//     .collection("listings")
//     .find(filter)
//     .sort({ createdAt: -1 })
//     .toArray();

//   const out = docs.map((d) => ({
//     id: d._id.toString(),
//     ownerId: d.ownerId.toString(),
//     ownerUsername: d.ownerUsername as string,
//     cardNumber: d.cardNumber as number,
//     price: d.price as number,
//     condition: d.condition as string,
//     description: d.description as string,
//     images: (d.images as string[]) ?? [],
//     createdAt: d.createdAt as Date,
//   }));

//   return NextResponse.json(out, { status: 200 });
// }
