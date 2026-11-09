"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantitySelectorProps {
  defaultValue?: number;
  value?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
}

export default function QuantitySelector({
  defaultValue = 1,
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  const [internalQuantity, setInternalQuantity] = useState(defaultValue);
  const isControlled = value !== undefined;
  const quantity = isControlled ? value : internalQuantity;

  const updateQuantity = (newValue: number) => {
    const newQuantity = Math.min(Math.max(newValue, min), max);

    if (!isControlled) {
      setInternalQuantity(newQuantity);
    }

    onChange?.(newQuantity);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background p-1 w-fit shadow-sm">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-muted"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        value={quantity}
        onChange={(e) => updateQuantity(Number(e.target.value))}
        type="number"
        min={min}
        max={max}
        className="
          h-10
          w-14
          border-0
          text-center
          font-semibold
          focus-visible:ring-0
        "
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full hover:bg-muted"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
