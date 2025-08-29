// src/app/signin/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") || "/",
    [searchParams]
  );

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  return (
    <main className="mx-auto max-w-sm p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full rounded-lg border px-4 py-2"
      >
        Continue with Google
      </button>
    </main>
  );
}



// // src/app/signin/page.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { signIn, useSession } from "next-auth/react";
// import Link from "next/link";

// export default function SignInPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'

//   const callbackUrl = useMemo(
//     () => searchParams.get("callbackUrl") || "/",
//     [searchParams]
//   );

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loadingCreds, setLoadingCreds] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // If already signed in, bounce to callbackUrl
//   useEffect(() => {
//     if (status === "authenticated") router.replace(callbackUrl);
//   }, [status, router, callbackUrl]);

//   return (
//     <main className="mx-auto max-w-sm p-6 space-y-6">
//       <h1 className="text-2xl font-semibold">Sign in</h1>

//       <button
//         onClick={() => signIn("google", { callbackUrl })}
//         className="w-full rounded-lg border px-4 py-2"
//       >
//         Continue with Google
//       </button>

//       <div className="text-center text-sm text-gray-500">or</div>

//       <form
//         onSubmit={async (e) => {
//           e.preventDefault();
//           setError(null);
//           setLoadingCreds(true);

//           const res = await signIn("credentials", {
//             email,
//             password,
//             redirect: false,
//             callbackUrl,
//           });

//           setLoadingCreds(false);

//           // next-auth returns { ok, error, status, url } when redirect:false
//           if (res?.error) {
//             // Map common errors to friendly text
//             setError(
//               res.error === "CredentialsSignin"
//                 ? "Invalid email or password."
//                 : res.error
//             );
//             return;
//           }

//           if (res?.url) {
//             router.push(res.url);
//           } else {
//             router.push(callbackUrl);
//           }
//         }}
//         className="space-y-3"
//       >
//         <input
//           name="email"
//           type="email"
//           placeholder="you@example.com"
//           className="w-full rounded-lg border px-3 py-2"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           autoComplete="email"
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="••••••••"
//           className="w-full rounded-lg border px-3 py-2"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           autoComplete="current-password"
//         />

//         {error && <p className="text-sm text-red-600">{error}</p>}

//         <button
//           type="submit"
//           disabled={loadingCreds}
//           className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
//         >
//           {loadingCreds ? "Signing in..." : "Sign in"}
//         </button>
//       </form>

//       <p className="text-lg">
//         Don&apos;t have an account?{" "}
//         <Link
//           href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
//           className="text-poke-blue-200 underline hover:text-poke-yellow-100"
//         >
//           Create one here!
//         </Link>
//       </p>
//     </main>
//   );
// }

