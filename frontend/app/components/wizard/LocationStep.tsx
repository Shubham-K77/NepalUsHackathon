import { useState } from "react";
import { Button } from "../ui/Button";
import { OptionCard } from "../ui/OptionCard";
import { COPY, PROVINCES, DISTRICTS } from "~/lib/constants";

interface LocationStepProps {
  province: string;
  district: string;
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LocationStep({
  province,
  district,
  onProvinceChange,
  onDistrictChange,
  onNext,
  onBack,
}: LocationStepProps) {
  const [subStep, setSubStep] = useState<"province" | "district">(
    province ? "district" : "province"
  );

  const handleProvinceSelect = (value: string) => {
    onProvinceChange(value);
    onDistrictChange(""); // reset district when province changes
    setSubStep("district");
  };

  const handleDistrictSelect = (value: string) => {
    onDistrictChange(value);
    // Auto-advance after district selection
    setTimeout(() => onNext(), 200);
  };

  const handleBack = () => {
    if (subStep === "district") {
      setSubStep("province");
      onProvinceChange("");
      onDistrictChange("");
    } else {
      onBack();
    }
  };

  const districts = province ? DISTRICTS[province] || [] : [];

  return (
    <div className="space-y-5">
      <Button variant="ghost" onClick={handleBack} className="!justify-start !px-0">
        {COPY.back}
      </Button>

      {subStep === "province" ? (
        <>
          <h2 className="text-[28px] font-bold text-[#111111] text-center">
            {COPY.provinceQuestion}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PROVINCES.map((p) => (
              <OptionCard
                key={p.value}
                label={p.label}
                selected={province === p.value}
                onClick={() => handleProvinceSelect(p.value)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-[28px] font-bold text-[#111111] text-center">
            {COPY.districtQuestion}
          </h2>
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
            {districts.map((d) => (
              <OptionCard
                key={d.value}
                label={d.label}
                selected={district === d.value}
                onClick={() => handleDistrictSelect(d.value)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
