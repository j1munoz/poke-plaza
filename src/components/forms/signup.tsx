"use client";

//sign up component, which calls fetch("/api/auth/signup") with email and pass.
//client-side entry point for creating users.

import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms/form/form";
import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/signup";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();

  const [info, setInfo] = useState({ ...ATTRIBUTES }); // expect { email, password }
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(0); // 0 idle, 1 success, -1 error

  const onSubmit = async () => {
    setLoading(true);
    setState(0);
    try {
      const payload = {
        email: (info as any).email?.trim() || "",
        password: (info as any).password?.trim() || "",
      };

      if (!payload.email || !payload.password) {
        throw new Error("Please fill email and password");
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const isJSON = res.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJSON ? await res.json() : null;

      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setState(1);
      router.push(data?.redirect ?? "/signin");
    } catch (err) {
      console.error("Signup failed:", err);
      setState(-1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Form
        fields={FIELDS}
        object={info}
        setObject={setInfo}
        onSubmit={onSubmit}
        loading={loading}
        setLoading={setLoading}
        setState={setState}
        buttonMessage={buttonMessage}
      />
      <p className="text-lg">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-poke-blue-200 underline hover:text-poke-yellow-100"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
