// src/app/api/reviews/byId/[username]/route.ts

import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  const soldBy = decodeURIComponent(username || "");
  if (!soldBy) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }
  return NextResponse.json({ items: [], total: 0 });
}

// import { NextResponse } from "next/server";
// import { getDb } from "@/lib/db";

// export async function GET(
//   req: Request,
//   { params }: { params: { username: string } },
// ) {
//   try {
//     const soldBy = await params?.username;
//     console.log("soldby", soldBy);
//     if (!soldBy) {
//       return NextResponse.json({ error: "Missing reviewBy" }, { status: 400 });
//     }

//     const db = await getDb();
//     const reviews = db.collection("reviews");

//     const filter = { soldBy };
//     console.log("soldBy", soldBy);

//     const [items, total] = await Promise.all([
//       reviews
//         .find(filter)
//         .project({
//           _id: 1,
//           responsive: 1,
//           shipping: 1,
//           reliable: 1,
//           rating: 1,
//           description: 1,
//           soldBy: 1,
//           reviewBy: 1,
//           reviewDate: 1,
//           createdAt: 1,
//         })
//         .sort({ createdAt: -1 })
//         .toArray(),
//       reviews.countDocuments(filter),
//     ]);

//     // Optional: projection to return only certain fields
//     return NextResponse.json({ items, total }, { status: 200 });
//   } catch (e) {
//     console.error("GET /api/reviews/by-user error:", e);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
