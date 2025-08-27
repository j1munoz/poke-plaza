//src/data/form/signin.ts

import { Heading, SubHeading, TextInput, BaseFields } from "@/types/forms";

interface Attributes {
  email: string;
  password: string;
}

interface Fields extends BaseFields {
  heading: Heading;
  subHeading: SubHeading;
  email: TextInput;
  password: TextInput;
}

export const ATTRIBUTES: Attributes = {
  email: "",
  password: "",
};

export const FIELDS: Fields = {
  heading: {
    input: "heading",
    width: 12,
    text: "Let's Trade Again!",
  },
  subHeading: {
    input: "subHeading",
    width: 12,
    text: "Sign in to your account",
  },
  email: {
    input: "input",
    title: "Email",
    placeholder: "Enter your email...",
    maxLength: 100,
    name: "email",
    type: "email",
    width: 12,
    required: true,
  },
  password: {
    input: "input",
    title: "Password",
    placeholder: "Enter your password...",
    maxLength: 100,
    name: "password",
    type: "password",
    width: 12,
    required: true,
  },
};

export const buttonMessage = "Sign In";
