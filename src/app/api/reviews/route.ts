//src/app/api/reviews/route.ts

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";

type Body = {
  rating?: number;
  responsive?: number;
  shipping?: number;
  reliable?: number;
  description?: string;
  soldBy?: string;
  reviewBy?: string;
  reviewDate?: string;
};

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const { responsive, shipping, reliable, description } = body;

    if (responsive === 0 || shipping === 0 || reliable === 0) {
      return NextResponse.json(
        { error: "One or more fields are missing" },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "One or more fields are missing", ok: false },
        { status: 400 },
      );
    }

    const db = await getDb();
    const reviews = db.collection("reviews");

    await reviews.insertOne({
      ...body,
    });

    return NextResponse.json(
      { ok: true, redirect: "/account/Alice123" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
