"use client";

import React from "react";
import { FormField } from "./Form";

interface SwitchFieldProps {
  field: FormField;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({ value, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200"
      style={{
        background: value ? "rgba(212,175,55,0.8)" : "rgba(255,255,255,0.1)",
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
        style={{
          transform: value ? "translateX(20px)" : "translateX(0)",
        }}
      />
    </button>
  );
};
