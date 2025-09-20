import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LabeledInput({ label, value, onChange, placeholder = "" }) {
  const id = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="grid gap-2 my-3">
      <Label htmlFor={id} className="text-base text-black">{label}</Label>
      <Input
        id={id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}