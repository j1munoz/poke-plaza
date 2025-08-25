// API route that verifies email/password, sets an HttpOnly session cookie (JWT), and responds with a redirect.

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { ObjectId } from "mongodb";

type SigninBody = { email: string; password: string };
interface UserDoc {
  _id: ObjectId;
  email: string;
  passwordHash: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Partial<SigninBody>;
    const email = (body.email ?? "").toLowerCase().trim();
    const password = (body.password ?? "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields: email, password" },
        { status: 400 },
      );
    }

    const db = await dbConnect();
    const users = db.collection<UserDoc>("users");
    const user = await users.findOne({ email });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );

    const token = jwt.sign(
      { sub: user._id.toString(), email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    cookies().set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ ok: true, redirect: "/" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Signin error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
