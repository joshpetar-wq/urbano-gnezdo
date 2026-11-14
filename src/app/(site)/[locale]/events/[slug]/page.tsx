import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/site/Markdown";
import { BackLink } from "@/components/site/parts";
import { getItem } from "@/lib/content";
import { dict, formatDate, tr, type Locale } from "@/lib/i18n";

type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getItem("events", slug, locale as Locale);
  if (!item) return {};
  return { title: tr(item.title, locale as Locale), description: tr(item.summary, locale as Locale) };
}

export default async function EventPage({ params }: P) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const t = dict(locale);
  const item = await getItem("events", slug, locale);
  if (!item) notFound();
  const when = [formatDate(String(item.date), locale), item.time as string].filter(Boolean).join(", ");

  return (
    <article className="wrap section !pt-10 sm:!pt-14">
      <BackLink href={`/${locale}/events`} label={t.nav.events} />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
        <div>
          <h1 className="h1">{tr(item.title, locale)}</h1>
          {tr(item.summary, locale) && <p className="lead mt-5">{tr(item.summary, locale)}</p>}
          {item.cover ? <img src={String(item.cover)} alt="" className="mt-10 w-full rounded-[1.5rem]" /> : null}
          <Markdown className="mt-10 text-[1.1rem]">{tr(item.body, locale)}</Markdown>
        </div>
        <aside className="self-start rounded-[1.5rem] bg-moss p-7 lg:sticky lg:top-28">
          <dl className="grid gap-5">
            <div>
              <dt className="text-sm text-muted">{t.when}</dt>
              <dd className="text-lg font-bold text-navy">{when}</dd>
            </div>
            {tr(item.location, locale) && (
              <div>
                <dt className="text-sm text-muted">{t.where}</dt>
                <dd className="text-lg font-bold text-navy">{tr(item.location, locale)}</dd>
              </div>
            )}
          </dl>
          {item.link ? (
            <a href={String(item.link)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-7 w-full justify-center">
              {t.register}
            </a>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
