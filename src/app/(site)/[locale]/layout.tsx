import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/onest";
import "../../globals.css";
import Header from "@/components/site/Header";
import { Footer } from "@/components/site/parts";
import { getSettings } from "@/lib/content";
import { dict, isLocale, locales, tr } from "@/lib/i18n";
import { navItems } from "@/lib/nav";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = await getSettings();
  const name = tr(s.orgShort, locale);
  return {
    title: { default: `${name} – ${tr(s.place, locale)}`, template: `%s | ${name}` },
    description: tr(s.heroText, locale),
    alternates: { languages: { mk: "/mk", en: "/en" } },
    openGraph: { siteName: tr(s.orgName, locale), locale: locale === "mk" ? "mk_MK" : "en_US", type: "website" },
  };
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const s = await getSettings();
  const t = dict(locale);
  const nav = navItems(locale);

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
          {t.skip}
        </a>
        <Header
          locale={locale}
          name={tr(s.orgShort, locale)}
          place={tr(s.place, locale)}
          nav={nav}
          cta={{ href: `/${locale}/involve`, label: t.nav.involve }}
          menuLabel={t.menu}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer settings={s} locale={locale} t={t} nav={[...nav, { href: `/${locale}/involve`, label: t.nav.involve }]} />
      </body>
    </html>
  );
}
