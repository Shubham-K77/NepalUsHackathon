import { Button } from "../ui/Button";
import { COPY } from "~/lib/constants";

interface DobStepProps {
  dob: string;
  onChange: (dob: string) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function DobStep({ dob, onChange, onNext, onBack, loading = false }: DobStepProps) {
  const isValid = dob.length > 0;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="!justify-start !px-0">
        {COPY.back}
      </Button>

      <h2 className="text-[28px] font-bold text-[#111111] text-center">
        {COPY.dobQuestion}
      </h2>

      <div className="w-full">
        <input
          id="user-dob"
          type="date"
          value={dob}
          onChange={(e) => onChange(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          className="w-full h-[56px] text-[22px] font-medium px-4 border-2 border-[#E0E0E0] rounded-[12px]
            focus:border-[3px] focus:border-[#1F7A7A] focus:outline-none
            text-[#111111]"
        />
      </div>

      <Button onClick={onNext} disabled={!isValid || loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {COPY.loading}
          </span>
        ) : (
          COPY.next
        )}
      </Button>
    </div>
  );
}
