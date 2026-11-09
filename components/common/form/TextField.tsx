"use client";

import React from "react";
import { FormField } from "./Form";

interface TextFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  onChange,
}) => {
  return (
    <input
      type={field.type || "text"}
      className="admin-input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      autoComplete={field.autoComplete}
    />
  );
};
