// src/app/account/[username]/page.tsx

// src/app/account/[username]/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import UserInfo, {
  type UserAccount,
  type UploadedListing,
  type Review,
} from "@/components/account/userinfo";
import { mockUsers } from "../../lib/mockuser";
import SellerCard from "@/components/account/sellercard";
import ReviewCard from "@/components/account/reviewcard";
import AddCard from "@/components/account/addlisting";

type ListingOut = {
  id: string;
  ownerUsername: string;
  cardNumber: number;
  price: number;
  condition: string;
  description: string;
  images: string[];
  createdAt: string | Date;
};

type ReviewIn = {
  description: string;
  rating: number;
  reliable: number;
  responsive: number;
  reviewBy: string;
  reviewDate: string;
  shipping: number;
};

export default function AccountPage() {
  const params = useParams<{ username: string }>();
  const [tab, setTab] = useState<"listings" | "reviews">("listings");
  const [dbListings, setDbListings] = useState<ListingOut[]>([]);
  const [reviews, setReviews] = useState<ReviewIn[]>([]);
  const [reviewsLength, setReviewsLength] = useState(0);

  const urlHandle = useMemo(() => {
    const raw = String(params?.username ?? "");
    return decodeURIComponent(raw).replace(/\s+/g, " ").trim().toLowerCase();
  }, [params]);

  const { data: session, status } = useSession();

  const sessionHandle = useMemo(
    () =>
      String(session?.user?.username ?? session?.user?.name ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase(),
    [session],
  );

  const isOwner = Boolean(session?.user) && sessionHandle === urlHandle;

  // ---- Listings: initial load + refresh helper ----
  const reloadListings = async (handle: string) => {
    if (!handle) return;
    try {
      const res = await fetch(
        `/api/listings?username=${encodeURIComponent(handle)}`,
        { cache: "no-store" },
      );
      const data = await res.json();
      const items: ListingOut[] = Array.isArray(data)
        ? data
        : (data?.items ?? []);
      setDbListings(items);
    } catch {
      setDbListings([]);
    }
  };

  useEffect(() => {
    if (!urlHandle) return;
    reloadListings(urlHandle);
  }, [urlHandle]);

  // ---- Reviews ----
  useEffect(() => {
    if (!urlHandle) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/reviews/byId/${encodeURIComponent(urlHandle)}`,
          { cache: "no-store" },
        );
        if (!res.ok) {
          setReviews([]);
          setReviewsLength(0);
          return;
        }
        const data: { items: ReviewIn[]; total: number } = await res.json();
        setReviews(data.items);
        setReviewsLength(data.total);
      } catch {
        setReviews([]);
        setReviewsLength(0);
      }
    })();
  }, [urlHandle]);

  // ---- User model (mock or synthesized) ----
  const mockUser =
    mockUsers.find((u) => u.username.toLowerCase() === urlHandle) || null;

  const synthesizedUser: UserAccount | null =
    isOwner && session?.user
      ? {
          username: session.user.username ?? session.user.name ?? "me",
          joinedOn: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          icon:
            session.user.image ?? "https://avatar.vercel.sh/user.svg?text=U",
          rating: 0,
          ratings: { responsive: 0, shipping: 0, reliable: 0 },
          uploadedListingIds: [] as UploadedListing[],
          reviews: [] as Review[],
        }
      : null;

  const user: UserAccount | null = mockUser ?? synthesizedUser;

  if (status === "loading")
    return <p className="text-center mt-10">Loading…</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="flex flex-col items-center bg-poke-gray-50 min-h-screen pt-10 text-poke-dark">
      <UserInfo user={user} />

      {isOwner && (
        <div className="mt-6">
          <AddCard onCreated={() => reloadListings(urlHandle)} />
        </div>
      )}

      <div className="flex mt-10 w-[33vw] justify-center gap-10">
        <button
          onClick={() => setTab("listings")}
          className={`pb-2 ${
            tab === "listings"
              ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold"
              : "text-poke-gray-200"
          }`}
        >
          Listings ({dbListings.length})
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`pb-2 ${
            tab === "reviews"
              ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold"
              : "text-poke-gray-200"
          }`}
        >
          Reviews ({reviewsLength})
        </button>
      </div>

      <div className="mt-6 w-[33vw]">
        {tab === "listings" && (
          <div className="flex flex-col gap-6 ml-20 mr-20">
            {dbListings.length > 0 ? (
              dbListings.map((l) => {
                const datePosted = new Date(l.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                );
                return (
                  <SellerCard
                    key={l.id}
                    image={l.images[0] ?? "https://via.placeholder.com/300"}
                    price={l.price.toFixed(2)}
                    cardName={`#${l.cardNumber}`}
                    datePosted={datePosted}
                    inStock={true}
                    id={l.id}
                    // ✅ immediately re-fetch the list after edit or delete
                    onUpdated={() => reloadListings(urlHandle)}
                    onDeleted={() => reloadListings(urlHandle)}
                  />
                );
              })
            ) : (
              <p className="text-poke-gray-200 text-center mt-10">
                No listings yet.
              </p>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div>
            {reviewsLength > 0 ? (
              reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))
            ) : (
              <p className="text-poke-gray-200 text-center mt-10">
                No reviews yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// "use client";

// import { useMemo, useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";

// import UserInfo, {
//   type UserAccount,
//   type UploadedListing,
//   type Review,
// } from "@/components/account/userinfo";
// import { mockUsers } from "../../lib/mockuser";
// import SellerCard from "@/components/account/sellercard";
// import ReviewCard from "@/components/account/reviewcard";
// import AddCard from "@/components/account/addlisting";

// type ListingOut = {
//   id: string;
//   ownerUsername: string;
//   cardNumber: number;
//   price: number;
//   condition: string;
//   description: string;
//   images: string[];
//   createdAt: string | Date;
// };

// type ReviewIn = {
//   description: string;
//   rating: number;
//   reliable: number;
//   responsive: number;
//   reviewBy: string;
//   reviewDate: string;
//   shipping: number;
// };

// export default function AccountPage() {
//   const params = useParams<{ username: string }>();
//   const [tab, setTab] = useState<"listings" | "reviews">("listings");
//   const [dbListings, setDbListings] = useState<ListingOut[]>([]);
//   const [reviews, setReviews] = useState<ReviewIn[]>([]);
//   const [reviewsLength, setReviewsLength] = useState(0);

//   const urlHandle = useMemo(() => {
//     const raw = String(params?.username ?? "");
//     return decodeURIComponent(raw).replace(/\s+/g, " ").trim().toLowerCase();
//   }, [params]);

//   const { data: session, status } = useSession();

//   const sessionHandle = useMemo(
//     () =>
//       String(session?.user?.username ?? session?.user?.name ?? "")
//         .replace(/\s+/g, " ")
//         .trim()
//         .toLowerCase(),
//     [session],
//   );

//   const isOwner = Boolean(session?.user) && sessionHandle === urlHandle;

//   // ---- Listings: initial load + refresh helper ----
//   const reloadListings = async (handle: string) => {
//     if (!handle) return;
//     try {
//       const res = await fetch(
//         `/api/listings?username=${encodeURIComponent(handle)}`,
//         { cache: "no-store" },
//       );
//       const data = await res.json();
//       const items: ListingOut[] = Array.isArray(data)
//         ? data
//         : (data?.items ?? []);
//       setDbListings(items);
//     } catch {
//       setDbListings([]);
//     }
//   };

//   useEffect(() => {
//     if (!urlHandle) return;
//     reloadListings(urlHandle);
//   }, [urlHandle]);

//   // ---- Reviews ----
//   useEffect(() => {
//     if (!urlHandle) return;
//     (async () => {
//       try {
//         const res = await fetch(
//           `/api/reviews/byId/${encodeURIComponent(urlHandle)}`,
//           { cache: "no-store" },
//         );
//         if (!res.ok) {
//           setReviews([]);
//           setReviewsLength(0);
//           return;
//         }
//         const data: { items: ReviewIn[]; total: number } = await res.json();
//         setReviews(data.items);
//         setReviewsLength(data.total);
//       } catch {
//         setReviews([]);
//         setReviewsLength(0);
//       }
//     })();
//   }, [urlHandle]);

//   // ---- User model (mock or synthesized) ----
//   const mockUser =
//     mockUsers.find((u) => u.username.toLowerCase() === urlHandle) || null;

//   const synthesizedUser: UserAccount | null =
//     isOwner && session?.user
//       ? {
//           username: session.user.username ?? session.user.name ?? "me",
//           joinedOn: new Date().toLocaleDateString("en-US", {
//             month: "long",
//             day: "numeric",
//             year: "numeric",
//           }),
//           icon:
//             session.user.image ?? "https://avatar.vercel.sh/user.svg?text=U",
//           rating: 0,
//           ratings: { responsive: 0, shipping: 0, reliable: 0 },
//           uploadedListingIds: [] as UploadedListing[],
//           reviews: [] as Review[],
//         }
//       : null;

//   const user: UserAccount | null = mockUser ?? synthesizedUser;

//   if (status === "loading")
//     return <p className="text-center mt-10">Loading…</p>;
//   if (!user) return <p className="text-center mt-10">User not found</p>;

//   return (
//     <div className="flex flex-col items-center bg-poke-gray-50 min-h-screen pt-10 text-poke-dark">
//       <UserInfo user={user} />

//       {isOwner && (
//         <div className="mt-6">
//           <AddCard onCreated={() => reloadListings(urlHandle)} />
//         </div>
//       )}

//       <div className="flex mt-10 w-[33vw] justify-center gap-10">
//         <button
//           onClick={() => setTab("listings")}
//           className={`pb-2 ${
//             tab === "listings"
//               ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold"
//               : "text-poke-gray-200"
//           }`}
//         >
//           Listings ({dbListings.length})
//         </button>
//         <button
//           onClick={() => setTab("reviews")}
//           className={`pb-2 ${
//             tab === "reviews"
//               ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold"
//               : "text-poke-gray-200"
//           }`}
//         >
//           Reviews ({reviewsLength})
//         </button>
//       </div>

//       <div className="mt-6 w-[33vw]">
//         {tab === "listings" && (
//           <div className="flex flex-col gap-6 ml-20 mr-20">
//             {dbListings.length > 0 ? (
//               dbListings.map((l) => {
//                 const datePosted = new Date(l.createdAt).toLocaleDateString(
//                   "en-US",
//                   { month: "long", day: "numeric", year: "numeric" },
//                 );
//                 return (
//                   <SellerCard
//                     key={l.id}
//                     image={l.images[0] ?? "https://via.placeholder.com/300"}
//                     price={l.price.toFixed(2)}
//                     cardName={`#${l.cardNumber}`}
//                     datePosted={datePosted}
//                     inStock={true}
//                     id={l.id}
//                   />
//                 );
//               })
//             ) : (
//               <p className="text-poke-gray-200 text-center mt-10">
//                 No listings yet.
//               </p>
//             )}
//           </div>
//         )}

//         {tab === "reviews" && (
//           <div>
//             {reviewsLength > 0 ? (
//               reviews.map((review, index) => (
//                 <ReviewCard key={index} review={review} />
//               ))
//             ) : (
//               <p className="text-poke-gray-200 text-center mt-10">
//                 No reviews yet.
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
