//Next.js API route that creates a user, validates email and password.
//Hashes password, inserts into DB, returns JSON.

//The server-side endpoint your form hits. If this breaks, the client sees 400/409/500.

import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    await dbConnect();

    const existing = await User.findOne({ email }).lean().exec();
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    return NextResponse.json({ redirect: "/signin" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
