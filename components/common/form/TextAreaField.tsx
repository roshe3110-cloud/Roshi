"use client";

import React from "react";
import { FormField } from "./Form";

interface TextAreaFieldProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ field, value, onChange }) => {
  return (
    <textarea
      className="admin-input resize-none"
      rows={3}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      required={field.required}
    />
  );
};
