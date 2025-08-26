"use client";

import { useState } from "react";
import Form from "@/components/forms/form/form";
import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/signup";
import Link from "next/link";

const SignUp = () => {
  const [info, setInfo] = useState({ ...ATTRIBUTES });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(0);

  const onSubmit = async () =>
    // setLoading: (value: boolean) => void,
    // setState: (value: number) => void,
    {
      console.log("Form submitted:", info, state);
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
      <p>
        Have an account?{" "}
        <Link
          href="/signin"
          className="text-poke-blue-200 underline hover:text-poke-yellow-100"
        >
          Sign in Here!
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
