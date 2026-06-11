import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Vazirmatn } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFa = locale === "fa";
  return {
    title: isFa
      ? "ابوالفضل دوست‌گل — طراح و توسعه‌دهنده وب"
      : "Abolfazl DoStGol — Web Designer & Developer",
    description: isFa
      ? "پورتفولیوی ابوالفضل دوست‌گل، طراح و توسعه‌دهنده وب متخصص در Next.js، React، TypeScript و تجربه‌های مدرن وب."
      : "Portfolio of Abolfazl DoStGol, a web designer & developer specializing in Next.js, React, TypeScript, and modern web experiences.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const isFa = locale === "fa";

  return (
    <html
      lang={locale}
      dir={isFa ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className={`min-h-full flex flex-col ${isFa ? "font-vazirmatn" : "font-sans"}`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
