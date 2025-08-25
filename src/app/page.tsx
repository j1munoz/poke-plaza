// import Image from "next/image";
import UserInfo from "@/components/account/userinfo";
import UserIcon from "@/public/usericon.svg";

export default function Home() {
  return (
    <div className="">
      <UserInfo
        username="username.johndoe"
        icon={UserIcon}
        joinedOn="January 16, 2025"
        rating={5}
        responsive={5}
        shipping={5}
        reliable={5}
      />
    </div>
  );
}
