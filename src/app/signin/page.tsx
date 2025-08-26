
//src/app/signin/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-sm p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full rounded-lg border px-4 py-2"
      >
        Continue with Google
      </button>

      <div className="text-center text-sm text-gray-500">or</div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
          });
          setLoading(false);
          if (res?.ok) {
            router.push("/");
          } else {
            setError(res?.error || "Invalid credentials");
          }
        }}
        className="space-y-3"
      >
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          className="w-full rounded-lg border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-black px-4 py-2 text-white">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

// "use client";

// import { useState } from "react";
// import Form from "@/components/forms/form/form";
// import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/signin";
// import Link from "next/link";

// export default function SignIn() {
//   const [info, setInfo] = useState({ ...ATTRIBUTES });
//   const [loading, setLoading] = useState(false);
//   const [state, setState] = useState(0);

//   const onSubmit = async () => {
//     console.log("Form submitted:", info, state);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center gap-5">
//       <Form
//         fields={FIELDS}
//         object={info}
//         setObject={setInfo}
//         onSubmit={onSubmit}
//         loading={loading}
//         setLoading={setLoading}
//         setState={setState}
//         buttonMessage={buttonMessage}
//       />
//       <p className="text-lg">
//         Don&apos;t have an account?{" "}
//         <Link
//           href="/signup"
//           className="text-poke-blue-200 underline hover:text-poke-yellow-100"
//         >
//           Create one here!
//         </Link>
//       </p>
//     </div>
//   );
// }

// import SignIn from "@/components/forms/signin";

// const SignInPage = () => {
//   return (
//     <div className="w-1/2 rounded-2xl bg-poke-white-200 drop-shadow-2xl py-5 mt-5">
//       <SignIn />
//     </div>
//   );
// };

// export default SignInPage;
