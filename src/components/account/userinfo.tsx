import Image from "next/image";
import Rating from "@/components/account/rating";

// Define the structure of a review, matching mockuser.tsx
export interface Review {
  username: string;
  reviewDate: Date;
  reviewText: string;
  rating: number,
  ratings: {
    responsive: number,
    shipping: number,
    reliable: number,
  },
}

// Update the type for uploaded listings to include the parent card ID
export interface UploadedListing {
  card: string;
  listingId: string;
}

// Define the structure of a user account, matching mockuser.tsx
export interface UserAccount {
  username: string;
  joinedOn: string;
  icon: string;
  rating: number;
  ratings: {
    responsive: number,
    shipping: number,
    reliable: number,
  },
  uploadedListingIds: UploadedListing[]; // Changed type here
  reviews: Review[];
}

interface UserInfoProps {
  user: UserAccount;
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="flex justify-between gap-20 border-b p-5 w-[33vw] border-black">
      <div className="flex flex-col gap-5 items-center">
        <Image
          src={user.icon}
          alt="User Icon"
          width={80}
          height={80}
          className="h-[10vh] w-[10vh] object-cover rounded-full"
        />
        <p className="text-3xl">{user.username}</p>
        <p className=" text-poke-gray-100">Joined on {user.joinedOn}</p>
      </div>
      <div className="flex flex-col gap-5">
        <Rating label="Rating" rating={user.rating} textSize="text-3xl" />
        <Rating label="Responsive" rating={user.ratings.responsive} />
        <Rating label="Shipping" rating={user.ratings.shipping} />
        <Rating label="Reliable" rating={user.ratings.reliable} />
      </div>
    </div>
  );
};

export default UserInfo;