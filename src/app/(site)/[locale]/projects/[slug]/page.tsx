import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/site/Gallery";
import Markdown from "@/components/site/Markdown";
import { BackLink, Cover, NewsCard } from "@/components/site/parts";
import { getItem, getItems } from "@/lib/content";
import { dict, tr, type Locale } from "@/lib/i18n";

type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getItem("projects", slug, locale as Locale);
  if (!item) return {};
  return { title: tr(item.title, locale as Locale), description: tr(item.summary, locale as Locale), openGraph: item.cover ? { images: [String(item.cover)] } : undefined };
}

export default async function ProjectPage({ params }: P) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const t = dict(locale);
  const item = await getItem("projects", slug, locale);
  if (!item) notFound();
  const related = (await getItems("news", locale)).filter((n) => n.project === item.id).slice(0, 4);
  const images = (item.images as string[]) || [];
  const active = item.phase !== "completed";

  return (
    <article>
      <header className="wrap pt-10 sm:pt-14">
        <BackLink href={`/${locale}/projects`} label={t.nav.projects} />
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${active ? "bg-leaf" : "bg-muted/50"}`} aria-hidden="true" />
          <span className={active ? "text-leaf-dark" : "text-muted"}>{active ? t.active : t.completed}</span>
        </p>
        <h1 className="h1 mt-3 max-w-[20ch]">{tr(item.title, locale)}</h1>
        {tr(item.summary, locale) && <p className="lead mt-5">{tr(item.summary, locale)}</p>}
        <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-line pt-6">
          {tr(item.period, locale) && (
            <div>
              <dt className="text-sm text-muted">{t.period}</dt>
              <dd className="font-semibold text-navy">{tr(item.period, locale)}</dd>
            </div>
          )}
          {tr(item.funder, locale) && (
            <div>
              <dt className="text-sm text-muted">{t.funder}</dt>
              <dd className="font-semibold text-navy">{tr(item.funder, locale)}</dd>
            </div>
          )}
        </dl>
      </header>
      {item.cover ? <Cover src={item.cover} alt="" className="wrap mt-10 aspect-[21/9] !px-0 sm:rounded-[2rem]" /> : null}
      <div className="wrap section !pt-12">
        <Markdown className="text-[1.1rem]">{tr(item.body, locale)}</Markdown>
        {images.length > 0 && (
          <section className="mt-16">
            <h2 className="h2 mb-6">{t.gallery}</h2>
            <Gallery images={images} title={tr(item.title, locale)} />
          </section>
        )}
        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <h2 className="h2 mb-8">{t.relatedNews}</h2>
            <div className="grid gap-10 sm:grid-cols-2">
              {related.map((n) => (
                <NewsCard key={n.id} item={n} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
