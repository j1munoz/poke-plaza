"use client";

import { useState } from "react";
import Form from "@/components/forms/form/form";
import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/signin";
import Link from "next/link";

export default function SignIn() {
  const [info, setInfo] = useState({ ...ATTRIBUTES });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(0);

  const onSubmit = async () => {
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

// import SignIn from "@/components/forms/signin";

// const SignInPage = () => {
//   return (
//     <div className="w-1/2 rounded-2xl bg-poke-white-200 drop-shadow-2xl py-5 mt-5">
//       <SignIn />
//     </div>
//   );
// };

// export default SignInPage;
