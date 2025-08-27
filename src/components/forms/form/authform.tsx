"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "signup" | "signin";

export default function AuthForm({ mode: initialMode = "signup" as Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "signup" ? "/api/auth/signup" : "/api/auth/signin";
      const payload =
        mode === "signup" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto border rounded-2xl p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        {mode === "signup" ? "Create an account" : "Sign in"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" && (
          <div className="space-y-1">
            <label className="block text-sm">Name</label>
            <input
              className="w-full border rounded-lg p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded-lg p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm">Password</label>
          <input
            className="w-full border rounded-lg p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          className="w-full rounded-lg p-2 border disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Sign in"}
        </button>
      </form>

      <button
        className="text-sm underline"
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
      >
        {mode === "signup"
          ? "Have an account? Sign in"
          : "New here? Create one"}
      </button>
    </div>
  );
}
