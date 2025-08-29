// src/componenets/header.tsx
import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();
  const loggedIn = !!session?.user;

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Poke Plaza</div>
      <div className="flex space-x-4 items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        {loggedIn && (
          <Link
            href={`/account/${encodeURIComponent(session?.user?.name ?? "me")}`}
            className="hover:underline"
          >
            My Account
          </Link>
        )}

        {loggedIn ? (
          <form action={doSignOut}>
            <button className="hover:underline">Sign Out</button>
          </form>
        ) : (
          <Link href="/signin" className="hover:underline">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

// //src/componenets/header.tsx

// import React from "react";
// import Link from "next/link";

// const Header: React.FC = () => {
//   return (
//     <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
//       <div className="text-lg font-bold">Poke Plaza</div>
//       <div className="flex space-x-4">
//         <Link href="/" className="hover:underline">
//           Home
//         </Link>
//         <Link href="#about" className="hover:underline">
//           My Account
//         </Link>
//         <Link href="/signin" className="hover:underline">
//           Sign In
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Header;
