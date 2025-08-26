"use client";

import { FaStar } from "react-icons/fa";
import { Review } from "@/lib/mockuser";

interface ReviewCardProps {
  review: Review;
}

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />,
    );
  }
  return <div className="flex">{stars}</div>;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const dateFormatted = new Date(review.reviewDate).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-lg">{review.username}</p>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-sm text-gray-500 mb-4">{dateFormatted}</p>
      <p className="text-gray-700 leading-relaxed mb-4">{review.reviewText}</p>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <p className="font-medium">Responsive</p>
          <StarRating rating={review.ratings.responsive} />
        </div>
        <div>
          <p className="font-medium">Shipping</p>
          <StarRating rating={review.ratings.shipping} />
        </div>
        <div>
          <p className="font-medium">Reliable</p>
          <StarRating rating={review.ratings.reliable} />
        </div>
      </div>
    </div>
  );
}
