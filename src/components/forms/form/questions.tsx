import {
  TextInput,
  SubHeading,
  TextAreaInput,
  SelectInput,
  BaseFields,
} from "@/types/forms";
import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

export type FormObject = {
  [key: string]: string | string[] | boolean | undefined;
};

interface QuestionProps<T extends FormObject> {
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

const Questions = <T extends FormObject>({
  fields,
  object,
  setObject,
  onSubmit,
  // loading,
  setLoading,
  setState,
  buttonMessage,
  loading,
}: QuestionProps<T>) => {
  return (
    <div className="flex flex-col w-full gap-5 items-center justify-center">
      {Object.values(fields).map((field, index) => (
        <div key={index} className="flex flex-col items-center">
          {field.input === "heading" && (
            <p className="text-5xl">{(field as SubHeading).text}</p>
          )}

          {field.input === "subHeading" && (
            <p className="text-poke-gray-100 text-2xl">
              {(field as SubHeading).text}
            </p>
          )}

          {field.input === "input" && (
            <div>
              <div className="p-1 flex flex-col w-[13vw]">
                <label
                  htmlFor={(field as TextInput).name}
                  className="text-2xl text-poke-gray-100"
                >
                  {(field as TextInput).title}
                </label>
                <input
                  className="border-1 rounded-md px-2"
                  id={(field as TextInput).name}
                  type={(field as TextInput).type}
                  placeholder={(field as TextInput).placeholder}
                  value={object[(field as TextInput).name] as string}
                  maxLength={(field as TextInput).maxLength}
                  onChange={(e) => {
                    setObject({
                      ...object,
                      [(field as TextInput).name]: e.target.value,
                    } as T);
                  }}
                />
              </div>
            </div>
          )}

          {field.input === "textarea" && (
            <div className="flex flex-col p-1 w-[13vw]">
              <label
                htmlFor={(field as TextAreaInput).name}
                className="text-2xl text-poke-gray-100"
              >
                {(field as TextAreaInput).title}
              </label>
              <textarea
                className="border-1 rounded-md px-2"
                maxLength={500}
                value={object[(field as TextAreaInput).name] as string}
                onChange={(e) =>
                  setObject({
                    ...object,
                    [(field as TextAreaInput).name]: e.target.value,
                  } as T)
                }
                placeholder={(field as TextAreaInput).placeholder}
                rows={(field as TextAreaInput).rows}
                title={(field as TextAreaInput).title}
              />
            </div>
          )}

          {field.input === "select" && (
            <div className="w-[13vw]">
              <label
                htmlFor={(field as SelectInput).name}
                className="text-2xl text-poke-gray-100"
              >
                {(field as SelectInput).title}
              </label>
              <Select
                value={undefined}
                onValueChange={(value) =>
                  setObject(
                    (prev) =>
                      ({ ...prev, [(field as SelectInput).name]: value }) as T,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {(field as SelectInput).options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ))}
      <div>
        <button
          type="button"
          className="bg-poke-blue-200 hover:bg-poke-blue-300 hover:cursor-pointer px-5 py-2 text-white text-xl rounded-lg"
          onClick={() => onSubmit(setLoading, setState)}
        >
          {loading ? "Loading..." : buttonMessage}
        </button>
      </div>
    </div>
  );
};

export default Questions;
