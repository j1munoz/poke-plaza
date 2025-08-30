"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { status } = useSession(); // removed 'session'
  const loggedIn = status === "authenticated";

  return (
    <nav className="flex items-center gap-4 p-4 border-b">
      <Link href="/">Home</Link>

      {loggedIn && <Link href="/account/me">My Account</Link>}

      {loggedIn ? (
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="underline"
        >
          Sign out
        </button>
      ) : (
        <Link href="/signin" className="underline">
          Sign in
        </Link>
      )}
    </nav>
  );
}
