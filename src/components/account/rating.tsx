import { TiStarFullOutline } from "react-icons/ti";

interface RatingProps {
  label: string;
  rating: number;
  textSize?: string;
}

const Rating = ({ label, rating, textSize }: RatingProps) => {
  const getStars = (stars: number) => {
    return Array.from({ length: stars }, (_, i) => (
      <TiStarFullOutline
        key={i}
        className={`text-yellow-400 ${textSize ? textSize : "text-xl"}`}
      />
    ));
  };

  return (
    <div className="flex items-center">
      <p className={textSize ? textSize : "text-l"}>{label}</p>
      <div className="flex">{getStars(rating)}</div>
    </div>
  );
}; 

export default Rating;
