// src/components/account/reviewcard.tsx
import { Review } from "@/components/account/review";

interface ReviewCardProps {
  review: Review;
}

const getRatingColor = (rating: number) => {
  if (rating >= 5) return "bg-[#4DFF68]";
  if (rating >= 4 && rating < 5) return "bg-[#B2FF66]";
  if (rating >= 3 && rating < 4) return "bg-[#F9FF4D]";
  if (rating > 2 && rating < 3) return "bg-[#FFA04D]";
  return "bg-[#FF4D4D]";
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[...Array(rating)].map((_, i) => (
      <span
        key={i}
        className={`text-yellow-400 ${i < rating ? "star-fill" : "star-empty"}`}
      >
        ⭐
      </span>
    ))}
  </div>
);

export default function ReviewCard({ review }: ReviewCardProps) {
  const {
    rating,
    reviewDate,
    reviewBy,
    description,
    responsive,
    shipping,
    reliable,
  } = review;

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4 flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full text-white flex items-center justify-center font-bold text-xl ${getRatingColor(rating)}`}
        >
          {rating}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-4 text-sm font-semibold text-gray-900">
          <div className="flex items-center gap-1">
            <p>Responsive</p>
            <StarRating rating={responsive} />
          </div>
          <div className="flex items-center gap-1">
            <p>Shipping</p>
            <StarRating rating={shipping} />
          </div>
          <div className="flex items-center gap-1">
            <p>Reliable</p>
            <StarRating rating={reliable} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Review by {reviewBy}
          <span className="mx-4"></span>
          {reviewDate}
        </p>
        <p className="mt-2 text-poke-dark">{description}</p>
      </div>
    </div>
  );
}
