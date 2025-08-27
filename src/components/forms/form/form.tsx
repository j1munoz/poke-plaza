import { BaseFields } from "@/types/forms";
import { Dispatch, SetStateAction } from "react";
import Questions, { FormObject } from "@/components/forms/form/questions";

interface FormProps<T extends FormObject> {
  fields: BaseFields;
  object: T;
  setObject: Dispatch<SetStateAction<T>>;
  onSubmit: (
    setLoading: (value: boolean) => void,
    setState: (value: number) => void,
  ) => void | Promise<void>;
  loading: boolean;
  setLoading: (value: boolean) => void;
  setState: (value: number) => void;
  buttonMessage: string;
}

const Form = <T extends FormObject>({
  fields,
  object,
  setObject,
  onSubmit,
  loading,
  setLoading,
  setState,
  buttonMessage,
}: FormProps<T>) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Questions
        fields={fields}
        object={object as FormObject}
        setObject={setObject as Dispatch<SetStateAction<FormObject>>}
        onSubmit={onSubmit}
        loading={loading}
        setLoading={setLoading}
        setState={setState}
        buttonMessage={buttonMessage}
      />
    </div>
  );
};

export default Form;
