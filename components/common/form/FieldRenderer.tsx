"use client";

import React from "react";
import { FormField } from "./Form";
import { TextField } from "./TextField";
import { TextAreaField } from "./TextAreaField";
import { NumberField } from "./NumberField";
import { SwitchField } from "./SwitchField";
import { SelectField } from "./SelectField";
import ImageUpload from "../image-upload/ImageUpload";


interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return <TextField field={field} value={(value as string) ?? ""} onChange={(v) => onChange(v)} />;
    case "textarea":
      return <TextAreaField field={field} value={(value as string) ?? ""} onChange={(v) => onChange(v)} />;
    case "number":
      return <NumberField field={field} value={value as number} onChange={(v) => onChange(v)} />;
    case "switch":
      return <SwitchField field={field} value={Boolean(value)} onChange={(v) => onChange(v)} />;
    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="rounded border-gray-300 text-black focus:ring-black h-4 w-4 cursor-pointer"
        />
      );
    case "radio":
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => (
            <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name={field.name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="text-black focus:ring-black cursor-pointer"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case "select":
      return <SelectField field={field} value={(value as string) ?? ""} onChange={(v) => onChange(v)} />;
    case "image": {
      const imageValue = field.multiple
        ? ((value as string[]) ?? [])
        : typeof value === "string"
          ? value
          : Array.isArray(value)
            ? value[0] ?? ""
            : "";

      return (
        <ImageUpload
          bucket={field.bucket || "category-images"}
          folder={field.folder}
          multiple={field.multiple}
          maxFiles={field.maxFiles}
          value={imageValue}
          onChange={(v) => onChange(v)}
        />
      );
    }
    default:
      return null;
  }
};
