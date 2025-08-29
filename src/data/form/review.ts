import { TextAreaInput, SelectInput, BaseFields } from "@/types/forms";

interface Attributes {
  rating: string;
  responsive: string;
  shipping: string;
  reliable: string;
  description: string;
  soldBy: string;
  reviewBy: string;
}

interface Fields extends BaseFields {
  responsive: SelectInput;
  shipping: SelectInput;
  reliable: SelectInput;
  description: TextAreaInput;
}

export const ATTRIBUTES: Attributes = {
  rating: "",
  responsive: "",
  shipping: "",
  reliable: "",
  description: "",
  soldBy: "",
  reviewBy: "",
};

export const FIELDS: Fields = {
  responsive: {
    input: "select",
    name: "responsive",
    title: "Responsive",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
    ],
    placeholder: "Select a number...",
    width: 12,
    required: true,
  },
  shipping: {
    input: "select",
    name: "shipping",
    title: "Shipping",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
    ],
    placeholder: "Select a number...",
    width: 12,
    required: true,
  },
  reliable: {
    input: "select",
    name: "reliable",
    title: "Reliability",
    options: [
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" },
      { label: "4", value: "4" },
      { label: "5", value: "5" },
    ],
    placeholder: "Select a number...",
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

export const buttonMessage = "Send Review";
