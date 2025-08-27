//src/components/forms/signup.tsx

"use client";

//sign up component, which calls fetch("/api/auth/signup") with email and pass.
//client-side entry point for creating users.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SignUpInfo = {
  email: string;
  password: string;
  name?: string;
};

type ApiResult = { ok: true; redirect?: string } | { error: string };

export default function SignUpForm() {
  const router = useRouter();
  const [info, setInfo] = useState<SignUpInfo>({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [, setState] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setState(0);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: info.email.trim().toLowerCase(),
          password: info.password,
          name: info.name?.trim() || undefined,
        } satisfies SignUpInfo),
      });

      const isJSON = (res.headers.get("content-type") ?? "").includes(
        "application/json",
      );
      const data: ApiResult | null = isJSON ? await res.json() : null;

      if (!res.ok) {
        const message =
          data && "error" in data && data.error
            ? data.error
            : `HTTP ${res.status}`;
        throw new Error(message);
      }

      setState(1);
      const redirect = data && "ok" in data ? data.redirect : undefined;
      router.push(redirect ?? "/signin");
    } catch (e: unknown) {
      setState(2);
      setError(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) void onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <input
        type="text"
        placeholder="Name (optional)"
        value={info.name ?? ""}
        onChange={(e) => setInfo((p) => ({ ...p, name: e.target.value }))}
        className="input"
      />
      <input
        type="email"
        placeholder="you@example.com"
        value={info.email}
        onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
        required
        className="input"
      />
      <input
        type="password"
        placeholder="••••••••"
        value={info.password}
        onChange={(e) => setInfo((p) => ({ ...p, password: e.target.value }))}
        required
        className="input"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="btn">
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Form from "@/components/forms/form/form";
// import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/signup";
// import Link from "next/link";

// export default function SignUp() {
//   const router = useRouter();

//   const [info, setInfo] = useState({ ...ATTRIBUTES }); // expect { email, password }
//   const [loading, setLoading] = useState(false);
//   const [state, setState] = useState(0); // 0 idle, 1 success, -1 error

//   const onSubmit = async () => {
//     setLoading(true);
//     setState(0);
//     try {
//       const payload = {
//         email: (info as any).email?.trim() || "",
//         password: (info as any).password?.trim() || "",
//       };

//       if (!payload.email || !payload.password) {
//         throw new Error("Please fill email and password");
//       }

//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const isJSON = res.headers
//         .get("content-type")
//         ?.includes("application/json");
//       const data = isJSON ? await res.json() : null;

//       if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

//       setState(1);
//       router.push(data?.redirect ?? "/signin");
//     } catch (err) {
//       console.error("Signup failed:", err);
//       setState(-1);
//     } finally {
//       setLoading(false);
//     }
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
//         Already have an account?{" "}
//         <Link
//           href="/signin"
//           className="text-poke-blue-200 underline hover:text-poke-yellow-100"
//         >
//           Sign in
//         </Link>
//       </p>
//     </div>
//   );
// }
