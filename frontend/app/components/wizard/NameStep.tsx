import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Avatar } from "../quiz/Avatar";
import { COPY } from "~/lib/constants";

interface NameStepProps {
  name: string;
  onChange: (name: string) => void;
  onNext: () => void;
}

export function NameStep({ name, onChange, onNext }: NameStepProps) {
  const isValid = name.trim().length >= 2;

  return (
    <div className="space-y-5">
      {/* Avatar greeter */}
      <div className="flex justify-center">
        <Avatar mood="encouraging" size="md" />
      </div>

      <div className="text-center">
        <h1 className="text-[34px] font-bold text-[#111111] mb-1">
          {COPY.greeting}
        </h1>
        <h2 className="text-[26px] font-bold text-[#111111]">
          {COPY.nameQuestion}
        </h2>
      </div>

      <Input
        id="user-name"
        placeholder={COPY.namePlaceholder}
        value={name}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && isValid && onNext()}
        autoFocus
        autoComplete="name"
      />

      <Button onClick={onNext} disabled={!isValid}>
        {COPY.next}
      </Button>
    </div>
  );
}

