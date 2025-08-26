//src/types/forms.ts

interface InputField {
  width: number;
  required: boolean;
}

export interface Heading {
  input: string;
  width: number;
  text: string;
}

export interface SubHeading {
  input: "subHeading";
  width: number;
  text: string;
}

export type TextInput = InputField & {
  input: "input";
  title: string;
  placeholder: string;
  maxLength: number;
  name: string;
  type: string;
};

export type TextAreaInput = InputField & {
  input: "textarea";
  name: string;
  rows: number;
  title: string;
  placeholder: string;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectInput = InputField & {
  input: "select";
  name: string;
  title: string;
  options: SelectOption[];
  placeholder: string;
};

export type Field =
  | Heading
  | SubHeading
  | TextInput
  | TextAreaInput
  | SelectInput;

export type BaseFields = Record<string, Field>;
