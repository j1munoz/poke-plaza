//src/app/signup/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <input
        className="w-full rounded-lg border px-3 py-2"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full rounded-lg border px-3 py-2"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full rounded-lg border px-3 py-2"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        onClick={async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, name }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
            router.push(data?.redirect ?? "/signin");
          } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Signup failed");
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Sign up"}
      </button>
      <p>
        Have an account?{" "}
        <Link
          href="/signin"
          className="text-poke-blue-200 underline hover:text-poke-yellow-100"
        >
          Sign in Here!
        </Link>
      </p>
    </main>
  );
}

