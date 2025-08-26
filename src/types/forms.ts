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

export type Field = Heading | SubHeading | TextInput;

export type BaseFields = Record<string, Field>;
