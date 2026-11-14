import type { Metadata } from "next";
import Link from "next/link";
import { Empty, NewsCard, PageHeader } from "@/components/site/parts";
import { getItems } from "@/lib/content";
import { dict, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.news };
}

export default async function News({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ c?: string }> }) {
  const locale = (await params).locale as Locale;
  const { c } = await searchParams;
  const t = dict(locale);
  const all = await getItems("news", locale);
  const cats = Array.from(new Set(all.map((n) => tr(n.category, locale)).filter(Boolean)));
  const items = c ? all.filter((n) => tr(n.category, locale) === c) : all;

  return (
    <>
      <PageHeader title={t.nav.news} />
      <div className="wrap section">
        {cats.length > 1 && (
          <nav aria-label={t.category} className="mb-12 flex flex-wrap gap-2">
            {[{ label: t.filterAll, value: "" }, ...cats.map((x) => ({ label: x, value: x }))].map((f) => {
              const on = (c || "") === f.value;
              return (
                <Link
                  key={f.label}
                  href={f.value ? `?c=${encodeURIComponent(f.value)}` : `/${locale}/news`}
                  aria-current={on ? "page" : undefined}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${on ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy"}`}
                >
                  {f.label}
                </Link>
              );
            })}
          </nav>
        )}
        {items.length ? (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <NewsCard key={n.id} item={n} locale={locale} />
            ))}
          </div>
        ) : (
          <Empty>{t.noNews}</Empty>
        )}
      </div>
    </>
  );
}
