import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[18px] font-medium text-[#3B3B3B] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full h-[56px] text-[22px] font-medium px-4 border-2 rounded-[12px] transition-colors duration-150
          ${error ? "border-[#AB5338]" : "border-[#E0E0E0]"}
          focus:border-[#1F7A7A] focus:border-[3px] focus:outline-none
          placeholder:text-[#888888] placeholder:font-normal
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[16px] font-medium text-[#AB5338]">{error}</p>
      )}
    </div>
  );
}
