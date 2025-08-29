
// src/componenets/header.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useMemo } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const loggedIn = status === "authenticated";

  // go back to the current page after sign-out (and force a reload via query)
  const callbackUrl = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const url = new URL(window.location.href);
    url.searchParams.set("signedout", "1");
    return url.toString();
  }, []);

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
          <button
            className="hover:underline"
            onClick={() => signOut({ callbackUrl })}
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


// // src/componenets/header.tsx
// import Link from "next/link";
// import { auth, signOut } from "@/auth";

// export default async function Header() {
//   const session = await auth();
//   const loggedIn = !!session?.user;

//   async function doSignOut() {
//     "use server";
//     await signOut({ redirectTo: "/" });
//   }

//   return (
//     <nav className="top-nav w-full text-white p-4 flex justify-between items-center">
//       <div className="text-lg font-bold">Poke Plaza</div>
//       <div className="flex space-x-4 items-center">
//         <Link href="/" className="hover:underline">
//           Home
//         </Link>

//         {loggedIn && (
//           <Link
//             href={`/account/${encodeURIComponent(session?.user?.name ?? "me")}`}
//             className="hover:underline"
//           >
//             My Account
//           </Link>
//         )}

//         {loggedIn ? (
//           <form action={doSignOut}>
//             <button className="hover:underline">Sign Out</button>
//           </form>
//         ) : (
//           <Link href="/signin" className="hover:underline">
//             Sign In
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }
