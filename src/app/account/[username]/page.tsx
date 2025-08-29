"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserInfo from "@/components/account/userinfo";
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
  const { username } = useParams<{ username: string }>();
  const [tab, setTab] = useState<"listings" | "reviews">("listings");
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [reviewsLength, setReviewsLength] = useState(0);

  useEffect(() => {
    const getReviews = async () => {
      const res = await fetch(`/api/reviews/byId/${username}`);
      const data = await res.json();
      setReviews(data.items);
      setReviewsLength(data.total);
    };

    getReviews();
  }, []);

  // this is so bad im so sorry
  // checks if the username in the URL matches the mock user's username
  const user =
    mockUsers.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    ) || null;

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
