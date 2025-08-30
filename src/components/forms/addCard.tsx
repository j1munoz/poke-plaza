//src/components/forms/addCard.tsx

"use client";

import { useState } from "react";
import Form from "@/components/forms/form/form";
import { ATTRIBUTES, FIELDS, buttonMessage } from "@/data/form/addCard";

const AddCardForm = () => {
  const [info, setInfo] = useState({ ...ATTRIBUTES });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(0);

  const onSubmit = async () =>
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
    </div>
  );
};

export default AddCardForm;
