import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card } from "~/components/ui/Card";
import { Disclaimer } from "~/components/layout/Disclaimer";
import { StepIndicator } from "~/components/wizard/StepIndicator";
import { NameStep } from "~/components/wizard/NameStep";
import { DobStep } from "~/components/wizard/DobStep";
import { GenderStep } from "~/components/wizard/GenderStep";
import { PinStep } from "~/components/wizard/PinStep";
import { api } from "~/lib/api";
import { COPY } from "~/lib/constants";

export function meta() {
  return [
    { title: "मनको कुरा — मनमा के छ?" },
    {
      name: "description",
      content: "मनको कुरा — नेपाली वृद्धवृद्धाहरूको मानसिक स्वास्थ्य स्क्रिनिङ",
    },
  ];
}

interface FormData {
  name: string;
  dob: string;
  gender: string;
  pin: string;
}

// Steps:
//  1 = Name
//  2 = DOB
//  3 = Gender (new users only)
//  4 = PIN (create for new, enter for returning)
type WizardStep = 1 | 2 | 3 | 4;

export default function Home() {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);
  const [isReturning, setIsReturning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animDir, setAnimDir] = useState<"right" | "left">("right");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    gender: "",
    pin: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { status, data } = await api.getCurrentUser();
        if (status === 200 && data.success) {
          navigate("/dashboard", { replace: true });
        }
      } catch {
        // Stay on landing flow for unauthenticated users.
      }
    };

    checkAuth();
  }, [navigate]);

  // Total visual steps: 3 for new users (Name, DOB+check, Gender+PIN), 2 for returning (Name, DOB+check, PIN)
  // We always show 4 dots but the flow branches after DOB.
  const totalSteps = isReturning ? 3 : 4;

  const goNext = useCallback(() => {
    setAnimDir("right");
    setError("");
    setStep((s) => (s + 1) as WizardStep);
  }, []);

  const goBack = useCallback(() => {
    setAnimDir("left");
    setError("");
    setStep((s) => Math.max(1, s - 1) as WizardStep);
  }, []);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // After DOB — check if user exists to decide branching
  const handleDobNext = useCallback(async () => {
    setLoading(true);
    setError("");

    const name = formData.name.trim();
    const { dob } = formData;

    try {
      const returning = await api.checkUserExists(name, dob);
      setIsReturning(returning);
      setAnimDir("right");

      if (returning) {
        // Returning user: skip gender, go straight to PIN entry (step 4)
        setStep(4);
      } else {
        // New user: go to gender (step 3)
        setStep(3);
      }
    } catch {
      setError(COPY.errorGeneral);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // After gender — move to PIN creation
  const handleGenderNext = useCallback(
    (selectedGender: string) => {
      updateField("gender", selectedGender);
      setAnimDir("right");
      setStep(4);
    },
    [updateField],
  );

  // Final step: PIN submit (login for returning, signup for new)
  const handlePinSubmit = useCallback(async () => {
    setLoading(true);
    setError("");

    const name = formData.name.trim();
    const { dob, gender, pin } = formData;

    try {
      if (isReturning) {
        // Login with their PIN
        const { status, data } = await api.login({ name, dob, pin });
        if (status === 200) {
          navigate("/dashboard");
        } else if (status === 401) {
          setError(COPY.errorPin);
        } else if (status === 400) {
          setError("कृपया नाम, जन्म मिति र PIN फेरि जाँच गर्नुहोस्।");
        } else {
          setError(data.message || COPY.errorGeneral);
        }
      } else {
        // Sign up with the new PIN
        const { status, data } = await api.signup({
          name,
          dob,
          gender,
          district: "KATHMANDU",
          province: "BAGMATI",
          pin,
        });

        if (status === 201 || status === 200) {
          navigate("/quiz");
        } else if (status === 400) {
          setError("कृपया सबै जानकारी सही भरेर फेरि प्रयास गर्नुहोस्।");
        } else if (status === 401) {
          // User already exists — attempt login with the entered PIN
          const retry = await api.login({ name, dob, pin });
          if (retry.status === 200) {
            navigate("/dashboard");
          } else {
            setError(COPY.errorPin);
          }
        } else {
          setError(data.message || COPY.errorGeneral);
        }
      }
    } catch {
      setError(COPY.errorGeneral);
    } finally {
      setLoading(false);
    }
  }, [formData, isReturning, navigate]);

  const animClass =
    animDir === "right" ? "animate-slide-in-right" : "animate-slide-in-left";

  // Visual step number (for indicator dots)
  // Steps 1,2 map directly. For returning users step 4 is visual 3. For new users it's visual 4.
  const visualStep = step === 4 && isReturning ? 3 : step;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <NameStep
            name={formData.name}
            onChange={(v) => updateField("name", v)}
            onNext={goNext}
          />
        );
      case 2:
        return (
          <DobStep
            dob={formData.dob}
            onChange={(v) => updateField("dob", v)}
            onNext={handleDobNext}
            onBack={goBack}
            loading={loading}
          />
        );
      case 3:
        return (
          <GenderStep
            gender={formData.gender}
            onChange={() => {}} // handled inline via onNext
            onNext={() => handleGenderNext(formData.gender)}
            onBack={goBack}
            onSelect={handleGenderNext}
          />
        );
      case 4:
        return (
          <PinStep
            name={formData.name}
            isReturning={isReturning}
            pin={formData.pin}
            onChange={(v) => updateField("pin", v)}
            onSubmit={handlePinSubmit}
            onBack={goBack}
            error={error}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FBF7] flex flex-col items-center pt-10 pb-24 px-4">
      <h1 className="text-[34px] font-bold text-[#1F7A7A] mb-4">
        {COPY.appTitle}
      </h1>

      <StepIndicator currentStep={visualStep} totalSteps={totalSteps} />

      <Card className="overflow-hidden">
        <div key={step} className={animClass}>
          {renderStep()}
        </div>
      </Card>

      {/* Loading overlay (only for DOB check, not PIN — PinStep handles its own) */}
      {loading && step === 2 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-[16px] p-8 shadow-lg flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-3 border-[#1F7A7A] border-t-transparent rounded-full animate-spin" />
            <p className="text-[20px] font-medium text-[#3B3B3B]">
              {COPY.loading}
            </p>
          </div>
        </div>
      )}

      {/* Error toast (for non-PIN steps only) */}
      {error && step !== 4 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#AB5338] text-white px-6 py-3 rounded-[12px] shadow-lg z-50 text-[18px] font-medium animate-slide-in-right">
          {error}
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
