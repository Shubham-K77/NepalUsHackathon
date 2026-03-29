import { Button } from "../ui/Button";
import { OptionCard } from "../ui/OptionCard";
import { COPY, GENDERS } from "~/lib/constants";

interface GenderStepProps {
  gender: string;
  onChange: (gender: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSelect?: (gender: string) => void;
}

export function GenderStep({ gender, onChange, onNext, onBack, onSelect }: GenderStepProps) {
  const handleSelect = (value: string) => {
    onChange(value);
    // If onSelect provided (new PIN flow), call it immediately on tap
    if (onSelect) {
      setTimeout(() => onSelect(value), 200);
    } else {
      setTimeout(() => onNext(), 300);
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="!justify-start !px-0">
        {COPY.back}
      </Button>

      <h2 className="text-[28px] font-bold text-[#111111] text-center">
        {COPY.genderQuestion}
      </h2>

      <div className="flex flex-col gap-3">
        {GENDERS.map((g) => (
          <OptionCard
            key={g.value}
            label={g.label}
            selected={gender === g.value}
            onClick={() => handleSelect(g.value)}
          />
        ))}
      </div>
    </div>
  );
}
