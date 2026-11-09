"use client";

import React from "react";
import { FormField } from "./Form";

interface SelectFieldProps {
  field: FormField;
  value: string | number;
  onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ field, value, onChange }) => {
  return (
    <select
      className="admin-input"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      required={field.required}
    >
      <option value="">— Select {field.label.toLowerCase()} —</option>
      {field.options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};
