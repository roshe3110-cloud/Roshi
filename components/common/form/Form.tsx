export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "switch"
  | "select"
  | "tel"
  | "email"
  | "radio"
  | "checkbox";

export interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  bucket?: string;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  colSpan?: number;
  autoComplete?: string;
  options?: FormFieldOption[];
}

