import Image, { StaticImageData } from "next/image";
import Rating from "@/components/account/rating";

interface UserInfoProps {
  username: string;
  icon: string | StaticImageData;
  joinedOn: string;
  rating: number;
  responsive: number;
  shipping: number;
  reliable: number;
}

const UserInfo = ({
  username,
  icon,
  joinedOn,
  rating,
  responsive,
  shipping,
  reliable,
}: UserInfoProps) => {
  return (
    <div className="flex justify-between gap-20 border-b-2 p-5 w-[33vw] border-black">
      <div className="flex flex-col gap-5 items-center">
        <Image src={icon} alt="Icon" className="h-[10vh]" />
        <p className="text-3xl">{username}</p>
        <p className="text-xl text-poke-gray-100">Joined on {joinedOn}</p>
      </div>
      <div className="flex flex-col gap-5">
        <Rating label="Rating" rating={rating} textSize="text-3xl" />
        <Rating label="Responsive" rating={responsive} />
        <Rating label="Shipping" rating={shipping} />
        <Rating label="Reliable" rating={reliable} />
      </div>
    </div>
  );
};

export default UserInfo;
