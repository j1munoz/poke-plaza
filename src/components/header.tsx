// src/componenets/header.tsx

"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function HeaderClient() {
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";
  const handle = session?.user?.username ?? session?.user?.name ?? "me";

  return (
    <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Poke Plaza</div>
      <div className="flex space-x-4 items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {loggedIn && (
          <Link
            href={`/account/${encodeURIComponent(handle)}`}
            className="hover:underline"
          >
            My Account
          </Link>
        )}

        {loggedIn ? (
          <button
            className="hover:underline"
            onClick={() => signOut({ callbackUrl: "/?signedout=1" })}
          >
            Sign Out
          </button>
        ) : (
          <Link href="/signin" className="hover:underline">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
