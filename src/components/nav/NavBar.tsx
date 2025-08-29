"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";

  return (
    <nav className="flex items-center gap-4 p-4 border-b">
      <Link href="/">Home</Link>

      {/* Only visible when logged in */}
      {loggedIn && <Link href="/account/me">My Account</Link>}

      {/* Sign in / Sign out toggle */}
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
