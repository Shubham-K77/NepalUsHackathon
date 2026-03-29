interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div
            key={stepNum}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isCompleted || isCurrent
                ? "bg-[#1F7A7A]"
                : "bg-[#E0E0E0]"
            } ${isCurrent ? "animate-pulse-dot" : ""}`}
            aria-label={`चरण ${stepNum} मध्ये ${totalSteps}`}
          />
        );
      })}
    </div>
  );
}
