import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border border-[#E0E0E0] rounded-[16px] p-[32px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] w-full max-w-[480px] mx-auto ${className}`}
    >
      {children}
    </div>
  );
}
