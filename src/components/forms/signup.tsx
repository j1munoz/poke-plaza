//sign up component, which calls fetch("/api/auth/signup") with email and pass.
//client-side entry point for creating users.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SignUpInfo = {
  email: string;
  password: string;
};

export default function SignUpForm() {
  const router = useRouter();
  const [info, setInfo] = useState<SignUpInfo>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [, setState] = useState<number>(0);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });

      const contentType = res.headers.get("content-type") ?? "";
      const isJSON = contentType.includes("application/json");
      const data: { error?: string; redirect?: string } | null = isJSON
        ? await res.json()
        : null;

      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setState(1);
      router.push(data?.redirect ?? "/signin");
    } catch {
      setState(2);
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
        type="email"
        value={info.email}
        onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
        placeholder="Email"
        required
        className="input"
      />
      <input
        type="password"
        value={info.password}
        onChange={(e) => setInfo((p) => ({ ...p, password: e.target.value }))}
        placeholder="Password"
        required
        className="input"
      />
      <button type="submit" disabled={loading} className="btn">
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
