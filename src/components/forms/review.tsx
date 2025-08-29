"use client";

import { useState } from "react";
import Form from "@/components/forms/form/form";
import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/review";
import { useRouter } from "next/navigation";

interface AddReviewProps {
  soldBy: string;
}

const AddReviewForm = ({ soldBy }: AddReviewProps) => {
  const router = useRouter();
  const reviewBy = "some.person";
  const [info, setInfo] = useState({ ...ATTRIBUTES, soldBy, reviewBy });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(0);
  const [error, setError] = useState<string>("");

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      console.log(state);

      const formData = {
        ...info,
        responsive: Number(info.responsive),
        shipping: Number(info.shipping),
        reliable: Number(info.reliable),
        rating: Number(
          ((+info.responsive + +info.shipping + +info.reliable) / 3).toFixed(1),
        ),
        reviewDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error);
        return;
      }

      router.push(json.redirect);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {error ? (
        <p className="bg-poke-red-100 text-white px-6 py-2">{error}</p>
      ) : null}
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
    </div>
  );
};

export default AddReviewForm;
