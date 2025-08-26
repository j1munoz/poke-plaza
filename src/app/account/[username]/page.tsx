'use client';

import { useState } from "react";
import UserInfo from "@/components/account/userinfo";
import { mockUser } from "../../lib/mockuser";
import { listingsData } from "../../lib/mocklistings";
import SellerCard from "@/components/account/sellercard";
import ReviewCard from "@/components/account/reviewcard";

export default function AccountPage() {
  const [tab, setTab] = useState<"listings" | "reviews">("listings");

  return (
    <div className="flex flex-col items-center bg-poke-gray-50 min-h-screen pt-10 text-poke-dark">
      {/* User Info */}
      <UserInfo user={mockUser} />

      {/* Tabs */}
      <div className="flex mt-10 w-[33vw] justify-center gap-10">
        <button
          onClick={() => setTab("listings")}
          className={`pb-2 ${tab === "listings" ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold" : "text-poke-gray-200"}`}
        >
          Listings ({mockUser.uploadedListingIds.length})
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`pb-2 ${tab === "reviews" ? "border-b-4 border-yellow-400 text-yellow-600 font-semibold" : "text-poke-gray-200"}`}
        >
          Reviews ({mockUser.reviews.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6 w-[33vw]">
        {tab === "listings" && (
          <div className="flex flex-col gap-6 ml-20 mr-20">
            {mockUser.uploadedListingIds.length > 0 ? (
              mockUser.uploadedListingIds.map((uploadedListing, index) => {
                const card = listingsData[uploadedListing.card];
                if (!card) return null;

                const listing = card.listings.find(l => l.id === uploadedListing.listingId);
                if (!listing) return null;

                const datePosted = new Date(listing.postDate).toLocaleDateString("en-US", {
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
                  />
                );
              })
            ) : (
              <p className="text-poke-gray-200 text-center mt-10">No listings yet.</p>
            )}
          </div>
        )}

        {tab === "reviews" && (
          <div>
            {mockUser.reviews.length > 0 ? (
              mockUser.reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))
            ) : (
              <p className="text-poke-gray-200 text-center mt-10">No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}