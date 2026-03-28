import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/providers/Providers";
import BottomNav from "@/components/layout/BottomNav";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ne" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex flex-col min-h-dvh max-w-2xl mx-auto relative">
          <main className="flex-1 pb-24">{children}</main>
          <BottomNav />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
