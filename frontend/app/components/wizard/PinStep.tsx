import { Button } from "../ui/Button";
import { PinInput } from "../ui/PinInput";
import { COPY } from "~/lib/constants";

interface PinStepProps {
  name: string;
  isReturning: boolean;
  pin: string;
  onChange: (pin: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  error: string;
  loading: boolean;
}

export function PinStep({
  name,
  isReturning,
  pin,
  onChange,
  onSubmit,
  onBack,
  error,
  loading,
}: PinStepProps) {
  const isValid = pin.length === 4;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="!justify-start !px-0">
        {COPY.back}
      </Button>

      {isReturning ? (
        <div className="text-center space-y-2">
          <p className="text-[22px] font-semibold text-[#1F7A7A]">
            {COPY.welcomeBack.replace("{name}", name)}
          </p>
          <h2 className="text-[28px] font-bold text-[#111111]">
            {COPY.pinEnter}
          </h2>
        </div>
      ) : (
        <div className="text-center space-y-2">
          <h2 className="text-[28px] font-bold text-[#111111]">
            {COPY.pinCreate}
          </h2>
          <p className="text-[18px] text-[#3B3B3B]">{COPY.pinCreateSubtitle}</p>
        </div>
      )}

      <PinInput value={pin} onChange={onChange} error={error} shake={!!error} />

      <Button onClick={onSubmit} disabled={!isValid || loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {COPY.loading}
          </span>
        ) : isReturning ? (
          COPY.submitReturning
        ) : (
          COPY.submitNew
        )}
      </Button>
    </div>
  );
}
