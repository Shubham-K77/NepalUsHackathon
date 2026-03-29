interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function OptionCard({
  label,
  selected,
  onClick,
  className = "",
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full text-left px-6 py-5 rounded-[12px] min-h-[56px] text-[22px] font-medium transition-all duration-150 touch-action-manipulation select-none
        ${
          selected
            ? "border-[3px] border-[#1F7A7A] bg-[#E8F5F0] text-[#111111]"
            : "border border-[#E0E0E0] bg-white text-[#3B3B3B] hover:bg-[#F9FAFB] active:bg-[#F0F0F0]"
        }
        ${className}`}
    >
      {label}
    </button>
  );
}
