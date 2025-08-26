//src/app/api/auth/signup/route.ts

//Next.js API route that creates a user, validates email and password.
//Hashes password, inserts into DB, returns JSON.

//The server-side endpoint your form hits. If this breaks, the client sees 400/409/500.

import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import bcrypt from "bcryptjs";

type Body = { email?: string; password?: string; name?: string };

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const email = String(body.email ?? "")
      .toLowerCase()
      .trim();
    const password = String(body.password ?? "");
    const name = body.name ? String(body.name).trim() : undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields: email, password" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const exists = await users.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({
      email,
      password: passwordHash,
      ...(name ? { name } : {}),
      createdAt: new Date(),
    });

    return NextResponse.json(
      { ok: true, redirect: "/signin" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import bcrypt from "bcryptjs";

// import { handlers } from "@/auth";
// export const { GET, POST } = handlers;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json().catch(() => ({}));
//     const email = (body?.email ?? "").toLowerCase().trim();
//     const password = body?.password ?? "";

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Missing fields: email, password" },
//         { status: 400 },
//       );
//     }

//     const db = await dbConnect();
//     const users = db.collection("users");

//     const existing = await users.findOne({ email });
//     if (existing) {
//       return NextResponse.json(
//         { error: "Email already in use" },
//         { status: 409 },
//       );
//     }

//     const passwordHash = await bcrypt.hash(password, 10);
//     await users.insertOne({
//       email,
//       passwordHash,
//       createdAt: new Date(),
//     });

//     return NextResponse.json(
//       { ok: true, redirect: "/signin" },
//       { status: 201 },
//     );
//   } catch (err: any) {
//     if (err?.code === 11000) {
//       return NextResponse.json(
//         { error: "Email already in use" },
//         { status: 409 },
//       );
//     }

//     console.error("Signup error:", err);
//     return NextResponse.json({ error: "Internal error" }, { status: 500 });
//   }
// }
