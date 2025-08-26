"use client";

import { useState } from "react";
import UserInfo from "@/components/account/userinfo";
import { mockUser } from "../../lib/mockuser";
import { listingsData } from "../../lib/mocklistings";
import SellerCard from "@/components/account/sellercard";

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
          <div className="flex flex-col gap-6">
            {mockUser.uploadedListingIds.length > 0 ? (
              mockUser.uploadedListingIds.map((uploadedListing, index) => {
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
            {mockUser.reviews.length > 0 ? (
              mockUser.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded p-4 mb-4 flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl ${
                        review.rating === 5
                          ? "bg-[#4DFF68]"
                          : review.rating === 4
                            ? "bg-[#B2FF66]"
                            : review.rating === 3
                              ? "bg-[#F9FF4D]"
                              : review.rating === 2
                                ? "bg-[#FFA04D]"
                                : "bg-[#FF4D4D]"
                      }`}
                    >
                      {review.rating}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
                      <div className="flex items-center gap-1">
                        <p>Responsive</p>
                        <div className="flex">
                          {[...Array(review.ratings.responsive)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-yellow-400 ${i < review.ratings.responsive ? "star-fill" : "star-empty"}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p>Shipping</p>
                        <div className="flex">
                          {[...Array(review.ratings.shipping)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-yellow-400 ${i < review.ratings.shipping ? "star-fill" : "star-empty"}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <p>Reliable</p>
                        <div className="flex">
                          {[...Array(review.ratings.reliable)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-yellow-400 ${i < review.ratings.reliable ? "star-fill" : "star-empty"}`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Review by {review.username}
                      <span className="mx-2">·</span>
                      {review.reviewDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-2 text-poke-dark">{review.reviewText}</p>
                  </div>
                </div>
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
