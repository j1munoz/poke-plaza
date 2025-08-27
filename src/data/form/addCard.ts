import {
  TextInput,
  TextAreaInput,
  SelectInput,
  BaseFields,
} from "@/types/forms";

interface Attributes {
  condition: string;
  price: string;
  description: string;
}

interface Fields extends BaseFields {
  condition: SelectInput;
  price: TextInput;
  description: TextAreaInput;
}

export const ATTRIBUTES: Attributes = {
  condition: "",
  price: "",
  description: "",
};

export const FIELDS: Fields = {
  condition: {
    input: "select",
    name: "condition",
    title: "Card Condition",
    options: [
      { label: "Heavily Used", value: "heavily-used" },
      { label: "Used", value: "used" },
      { label: "Slightly Used", value: "slightly-used" },
      { label: "Near Mint", value: "near-mint" },
      { label: "Mint", value: "mint" },
    ],
    placeholder: "Select condition...",
    width: 12,
    required: true,
  },
  price: {
    input: "input",
    title: "Price",
    placeholder: "Enter the card's price",
    maxLength: 100,
    name: "price",
    type: "text",
    width: 12,
    required: true,
  },
  description: {
    input: "textarea",
    name: "description",
    rows: 5,
    title: "Description",
    placeholder: "Enter a description of the card...",
    width: 12,
    required: true,
  },
};

export const buttonMessage = "Save Changes";
