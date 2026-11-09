"use client";

import React from "react";
import { FormField } from "./Form";

interface NumberFieldProps {
  field: FormField;
  value: number | string;
  onChange: (value: number | string) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({ field, value, onChange }) => {
  return (
    <input
      type="number"
      className="admin-input"
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? "" : Number(val));
      }}
      placeholder={field.placeholder}
      required={field.required}
      min={0}
    />
  );
};
