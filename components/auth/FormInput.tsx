"use client";

import React from "react";

type Props = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

export function FormInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}: Props) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-obsidian/85">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-obsidian/10 bg-white/30 px-4 py-3 text-sm text-obsidian outline-none transition-shadow duration-200 focus:shadow-[0_8px_30px_rgba(196,165,116,0.12)] focus:border-champagne focus:bg-white/60"
      />
    </div>
  );
}

export default FormInput;
