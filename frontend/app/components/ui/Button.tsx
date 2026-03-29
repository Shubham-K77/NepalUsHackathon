import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "secondary";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-[14px] transition-all duration-150 touch-action-manipulation select-none";

  const variants = {
    primary: `w-full h-[60px] text-[22px] bg-[#1F7A7A] text-white hover:brightness-95 active:brightness-90 disabled:bg-[#C4C4C4] disabled:text-[#888888] disabled:cursor-not-allowed`,
    ghost: `h-[48px] px-4 text-[18px] font-medium text-[#1F7A7A] hover:bg-[#E8F5F0] active:bg-[#d0ede4]`,
    secondary: `w-full h-[60px] text-[22px] bg-[#3E7457] text-white hover:brightness-95 active:brightness-90 disabled:bg-[#C4C4C4] disabled:text-[#888888] disabled:cursor-not-allowed`,
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
