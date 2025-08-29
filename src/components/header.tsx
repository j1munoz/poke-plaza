import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Poke Plaza</div>
      <div className="flex space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/account/Alice123" className="hover:underline">
          My Account
        </Link>
        <Link href="/signin" className="hover:underline">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Header;
