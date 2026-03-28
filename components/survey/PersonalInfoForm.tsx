"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Calendar, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSurveyStore } from "@/lib/store/surveyStore";
import type { Gender } from "@/types/survey";

const schema = z.object({
  name: z.string().min(2, "nameMin").nonempty("nameRequired"),
  age: z
    .number({ invalid_type_error: "ageRequired" })
    .min(18, "ageMin")
    .max(120, "ageMax"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "genderRequired",
  }),
});

type FormValues = z.infer<typeof schema>;

export default function PersonalInfoForm() {
  const t = useTranslations("personalInfo");
  const setUserInfo = useSurveyStore((s) => s.setUserInfo);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    setUserInfo({ name: data.name, age: data.age, gender: data.gender });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-5 w-5 text-maroon-600" />
          {t("name")}
        </Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          autoComplete="name"
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="text-base text-maroon-600 font-medium">
            {t(`errors.${errors.name.message as string}` as Parameters<typeof t>[0])}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age" className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-maroon-600" />
          {t("age")}
        </Label>
        <Input
          id="age"
          type="number"
          inputMode="numeric"
          placeholder={t("agePlaceholder")}
          aria-describedby={errors.age ? "age-error" : undefined}
          {...register("age", { valueAsNumber: true })}
        />
        {errors.age && (
          <p id="age-error" className="text-base text-maroon-600 font-medium">
            {t(`errors.${errors.age.message as string}` as Parameters<typeof t>[0])}
          </p>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <UserCircle2 className="h-5 w-5 text-maroon-600" />
          {t("gender")}
        </Label>
        <Select onValueChange={(val) => setValue("gender", val as Gender)}>
          <SelectTrigger
            aria-describedby={errors.gender ? "gender-error" : undefined}
          >
            <SelectValue placeholder={t("genderPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t("genderMale")}</SelectItem>
            <SelectItem value="female">{t("genderFemale")}</SelectItem>
            <SelectItem value="other">{t("genderOther")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.gender && (
          <p id="gender-error" className="text-base text-maroon-600 font-medium">
            {t("errors.genderRequired")}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full mt-8" size="lg">
        {t("continueBtn")}
      </Button>
    </form>
  );
}
