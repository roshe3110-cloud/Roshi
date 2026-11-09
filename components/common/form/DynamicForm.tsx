"use client";

import React from "react";
import { FormField } from "./Form";
import { FieldRenderer } from "./FieldRenderer";

export type FormValues = Record<string, string | number | boolean | null | undefined | string[]>;

interface DynamicFormProps {
  fields: FormField[];
  values: FormValues;
  onChange: (values: FormValues) => void;
}

const getColSpanClass = (span?: number) => {
  switch (span) {
    case 1: return "col-span-12 md:col-span-1";
    case 2: return "col-span-12 md:col-span-2";
    case 3: return "col-span-12 md:col-span-3";
    case 4: return "col-span-12 md:col-span-4";
    case 5: return "col-span-12 md:col-span-5";
    case 6: return "col-span-12 md:col-span-6";
    case 7: return "col-span-12 md:col-span-7";
    case 8: return "col-span-12 md:col-span-8";
    case 9: return "col-span-12 md:col-span-9";
    case 10: return "col-span-12 md:col-span-10";
    case 11: return "col-span-12 md:col-span-11";
    case 12: default: return "col-span-12";
  }
};

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, values, onChange }) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      {fields.map((field) => (
        <div key={field.name} className={`${getColSpanClass(field.colSpan)} space-y-1.5`}>
          <label className="block text-[#666] text-xs uppercase tracking-widest font-medium">
            {field.label}
          </label>
          <FieldRenderer
            field={field}
            value={values[field.name]}
            onChange={(val) => {
              onChange({
                ...values,
                [field.name]: val,
              } as FormValues);
            }}
          />
        </div>
      ))}
    </div>
  );
};
