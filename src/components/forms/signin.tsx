"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/forms/form/form";
// import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/signin";
import Link from "next/link";

type SigninInfo = { email: string; password: string };

export default function SignIn() {
  const router = useRouter();
  const [info, setInfo] = useState<SigninInfo>({ email: "", password: "" });
  const [, setState] = useState<number>(0); // omit the unused value
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setState(0);
    try {
      const payload: SigninInfo = {
        email: info.email.trim(),
        password: info.password.trim(),
      };

      const res = await fetch("/api/auth/signin", {
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
      router.push(data?.redirect ?? "/");
    } catch {
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
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-poke-blue-200 underline hover:text-poke-yellow-100"
        >
          Create one here!
        </Link>
      </p>
    </div>
  );
}
