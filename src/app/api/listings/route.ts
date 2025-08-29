// //src/app/api/listings/route.ts

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listingsData } from "../../lib/mocklistings";

type ListingPayload = {
  item?: string;
  listingid?: string;
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { item, listingid }: ListingPayload = await req
    .json()
    .catch(() => ({}) as ListingPayload);

  if (!item || !listingid) {
    return NextResponse.json(
      { error: "Missing item or listingid" },
      { status: 400 },
    );
  }

  const itemData =
    listingsData[item.toLowerCase() as keyof typeof listingsData];
  if (!itemData) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const listing = itemData.listings.find((l) => l.id === listingid);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const sessionName = session.user?.name?.toLowerCase();
  const isOwner =
    (sessionName && sessionName === listing.soldby.toLowerCase?.()) ||
    (sessionName && sessionName === listing.user.toLowerCase?.());

  if (isOwner) {
    return NextResponse.json(
      { error: "Cannot purchase your own listing" },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true });
}

// //src/app/api/listings/route.ts

// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { listingsData } from "../../lib/mocklistings";

// export async function POST(req: Request) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { item, listingid } = await req.json().catch(() => ({}) as any);
//   if (!item || !listingid) {
//     return NextResponse.json(
//       { error: "Missing item or listingid" },
//       { status: 400 },
//     );
//   }

//   const itemData =
//     listingsData[item.toLowerCase() as keyof typeof listingsData];
//   if (!itemData) {
//     return NextResponse.json({ error: "Category not found" }, { status: 404 });
//   }

//   const listing = itemData.listings.find((l) => l.id === listingid);
//   if (!listing) {
//     return NextResponse.json({ error: "Listing not found" }, { status: 404 });
//   }

//   const sessionName = session.user?.name?.toLowerCase?.();
//   const isOwner =
//     (sessionName && sessionName === listing.soldby.toLowerCase?.()) ||
//     (sessionName && sessionName === listing.user.toLowerCase?.());

//   if (isOwner) {
//     return NextResponse.json(
//       { error: "Cannot purchase your own listing" },
//       { status: 403 },
//     );
//   }

//   return NextResponse.json({ ok: true });
// }
