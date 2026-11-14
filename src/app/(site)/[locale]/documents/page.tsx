import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader } from "@/components/site/parts";
import { getItems } from "@/lib/content";
import { dict, formatDate, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.documents };
}

const cats = ["statute", "reports", "decisions", "other"] as const;

function ext(url: string) {
  const m = url.split("?")[0].match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toUpperCase() : "FILE";
}

export default async function Documents({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ c?: string }> }) {
  const locale = (await params).locale as Locale;
  const { c } = await searchParams;
  const t = dict(locale);
  const all = await getItems("documents", locale);
  const present = cats.filter((k) => all.some((d) => (d.category || "other") === k));
  const items = c ? all.filter((d) => (d.category || "other") === c) : all;
  const label = (k: string) => t[k as (typeof cats)[number]] ?? k;

  return (
    <>
      <PageHeader title={t.nav.documents} />
      <div className="wrap section">
        {present.length > 1 && (
          <nav aria-label={t.category} className="mb-10 flex flex-wrap gap-2">
            {[{ v: "", l: t.filterAll }, ...present.map((k) => ({ v: k, l: label(k) }))].map((f) => {
              const on = (c || "") === f.v;
              return (
                <Link key={f.v || "all"} href={f.v ? `?c=${f.v}` : `/${locale}/documents`} aria-current={on ? "page" : undefined}
                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${on ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy"}`}>
                  {f.l}
                </Link>
              );
            })}
          </nav>
        )}
        {items.length ? (
          <ul className="border-b border-line">
            {items.map((d) => (
              <li key={d.id} className="grid gap-4 border-t border-line py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex gap-4">
                  <span className="mt-0.5 inline-flex h-12 w-11 shrink-0 items-end justify-center rounded-md bg-moss pb-1.5 text-[0.7rem] font-bold text-navy" aria-hidden="true">
                    {ext(String(d.file))}
                  </span>
                  <div>
                    <h2 className="h3">{tr(d.title, locale)}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {label(String(d.category || "other"))}, {formatDate(String(d.date), locale)}
                    </p>
                    {tr(d.description, locale) && <p className="mt-2 max-w-[60ch]">{tr(d.description, locale)}</p>}
                  </div>
                </div>
                <a href={String(d.file)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost justify-self-start !py-2 sm:justify-self-end">
                  {t.download}
                  <span className="sr-only">: {tr(d.title, locale)}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>{t.noDocuments}</Empty>
        )}
      </div>
    </>
  );
}
