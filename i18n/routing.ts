import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ne", "en"],
  defaultLocale: "ne",
  localePrefix: "always",
});
