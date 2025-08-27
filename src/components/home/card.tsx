import Image from "next/image";
import Link from "next/link";

interface CardProps {
  image: string;
  name: string;
  price: number | null;
  cardId: string;
}

const Card = ({ image, name, price, cardId }: CardProps) => {
  return (
    <div className="card">
      <div className="card-container">
        <Image
          src={image}
          alt="Card"
          width={600}
          height={600}
          className="rounded-t h-auto"
        />
        <h4>{name}</h4>
        <p className="text-center">
          <b>${price}</b>
        </p>
        <Link href={`/listings/${cardId}`} passHref>
          {" "}
          {/* Example link to listings page */}
          <button className="button-5" role="button">
            View Listings
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
