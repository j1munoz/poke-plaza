import { Heading, SubHeading, TextInput, BaseFields } from "@/types/forms";

interface Attributes {
  email: string;
  username: string;
  password: string;
  confirmPass: string;
}

interface Fields extends BaseFields {
  heading: Heading;
  subHeading: SubHeading;
  email: TextInput;
  username: TextInput;
  password: TextInput;
  confirmPass: TextInput;
}

export const ATTRIBUTES: Attributes = {
  email: "",
  username: "",
  password: "",
  confirmPass: "",
};

export const FIELDS: Fields = {
  heading: {
    input: "heading",
    width: 12,
    text: "Start Trading Today!",
  },
  subHeading: {
    input: "subHeading",
    width: 12,
    text: "Create your account",
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
  username: {
    input: "input",
    title: "Username",
    placeholder: "Enter your username...",
    maxLength: 100,
    name: "username",
    type: "text",
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
  confirmPass: {
    input: "input",
    title: "Confirm Password",
    placeholder: "Confirm your password...",
    maxLength: 100,
    name: "confirmPass",
    type: "password",
    width: 12,
    required: true,
  },
};

export const buttonMessage = "Sign Up";
