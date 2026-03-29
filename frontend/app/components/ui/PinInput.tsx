import { useRef, useCallback } from "react";

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  error?: string;
  shake?: boolean;
}

const EN_TO_NE: Record<string, string> = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

const NE_TO_EN: Record<string, string> = {
  "०": "0",
  "१": "1",
  "२": "2",
  "३": "3",
  "४": "4",
  "५": "5",
  "६": "6",
  "७": "7",
  "८": "8",
  "९": "9",
};

function toEnglishDigit(raw: string) {
  if (!raw) return "";
  return NE_TO_EN[raw] || raw;
}

function toNepaliDigit(raw: string) {
  if (!raw) return "";
  return EN_TO_NE[raw] || raw;
}

export function PinInput({ value, onChange, error, shake }: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(4, "").slice(0, 4).split("");

  const handleChange = useCallback(
    (index: number, digit: string) => {
      const normalized = toEnglishDigit(digit);
      if (!/^\d?$/.test(normalized)) return;

      const newDigits = [...digits];
      newDigits[index] = normalized;
      const newPin = newDigits.join("").replace(/\s/g, "");
      onChange(newPin);

      // Auto-advance to next box
      if (normalized && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, onChange],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [digits],
  );

  return (
    <div className="w-full">
      <div
        className={`flex justify-center gap-4 ${shake ? "animate-gentle-shake" : ""}`}
      >
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={toNepaliDigit(digits[index] || "")}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-[64px] h-[64px] text-center text-[28px] font-bold rounded-[12px] transition-colors duration-150
              ${
                digits[index]
                  ? "border-[3px] border-[#1F7A7A]"
                  : "border-2 border-[#E0E0E0]"
              }
              focus:border-[3px] focus:border-[#1F7A7A] focus:outline-none`}
            aria-label={`PIN अंक ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-3 text-center text-[16px] font-medium text-[#AB5338]">
          {error}
        </p>
      )}
      <p className="mt-2 text-center text-[14px] text-[#888888]">
        उदाहरण: 0707 टाइप गर्दा ०७०७ देखिन्छ
      </p>
    </div>
  );
}
