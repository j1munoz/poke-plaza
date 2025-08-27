"use client";

import { useState } from "react";
import UserInfo from "@/components/account/userinfo";
import { mockUsers } from "../../lib/mockuser";
import { listingsData } from "../../lib/mocklistings";
import SellerCard from "@/components/account/sellercard";
import ReviewCard from "@/components/account/reviewcard";
import AddCard from "@/components/account/addlisting";

interface AccountPageProps {
  params: { username: string };
}

export default function AccountPage({ params }: AccountPageProps) {
  const { username } = params;

  const [tab, setTab] = useState<"listings" | "reviews">("listings");

  // this is so bad im so sorry
  // checks if the username in the URL matches the mock user's username
  const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;

  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="flex flex-col items-center bg-poke-gray-50 min-h-screen pt-10 text-poke-dark">
      <UserInfo user={user} />

      <div className="flex mt-10 w-[33vw] justify-center gap-10">
        <button
          onClick={() => setTab("listings")}
          className={`pb-2 ${tab === "listings" ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold" : "text-poke-gray-200"}`}
        >
          Listings ({user.uploadedListingIds.length})
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`pb-2 ${tab === "reviews" ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold" : "text-poke-gray-200"}`}
        >
          Reviews ({user.reviews.length})
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
            {user.reviews.length > 0 ? (
              user.reviews.map((review, index) => (
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
