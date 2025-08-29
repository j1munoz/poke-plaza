// src/app/account/[username]/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import UserInfo, {
  type UserAccount,
  type UploadedListing,
  type Review,
} from "@/components/account/userinfo";
import { mockUsers } from "../../lib/mockuser";
import { listingsData } from "../../lib/mocklistings";
import SellerCard from "@/components/account/sellercard";
import ReviewCard from "@/components/account/reviewcard";
import AddCard from "@/components/account/addlisting";

interface ReviewProps {
  description: string;
  rating: number;
  reliable: number;
  responsive: number;
  reviewBy: string;
  reviewDate: string;
  shipping: number;
}

export default function AccountPage() {
  const params = useParams<{ username: string }>();
  const [tab, setTab] = useState<"listings" | "reviews">("listings");
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [reviewsLength, setReviewsLength] = useState(0);

  const urlHandle = useMemo(() => {
    const raw = String(params?.username ?? "");
    return decodeURIComponent(raw).replace(/\s+/g, " ").trim().toLowerCase();
  }, [params]);

  const { data: session, status } = useSession();

  // Hooks MUST run before any return
  const sessionHandle = useMemo(
    () =>
      String(session?.user?.username ?? session?.user?.name ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase(),
    [session],
  );

  const isOwner = Boolean(session?.user) && sessionHandle === urlHandle;

  useEffect(() => {
    const getReviews = async () => {
      const res = await fetch(`/api/reviews/byId/${params?.username}`);
      const data = await res.json();
      setReviews(data.items);
      setReviewsLength(data.total);
    };

    getReviews();
  }, []);

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
          <Link href="/listings/new" className="underline">
            Create a new listing
          </Link>
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
          Listings ({user.uploadedListingIds.length})
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
            {user.uploadedListingIds.length > 0 ? (
              user.uploadedListingIds.map((uploadedListing, index) => {
                const card = listingsData[uploadedListing.card];
                if (!card) return null;

                const listing = card.listings.find(
                  (l) => l.id === uploadedListing.listingId,
                );
                if (!listing) return null;

                const datePosted = new Date(
                  listing.postDate,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <SellerCard
                    key={index}
                    image={listing.image}
                    price={listing.price}
                    cardName={card.title}
                    datePosted={datePosted}
                    inStock={listing.inStock}
                    id={listing.id}
                  />
                );
              })
            ) : (
              <p className="text-poke-gray-200 text-center mt-10">
                No listings yet.
              </p>
            )}

            <AddCard />
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
