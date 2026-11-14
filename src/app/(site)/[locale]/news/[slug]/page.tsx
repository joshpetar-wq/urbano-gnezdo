import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/site/Gallery";
import Markdown from "@/components/site/Markdown";
import { BackLink } from "@/components/site/parts";
import { getItem, getItems } from "@/lib/content";
import { dict, formatDate, tr, type Locale } from "@/lib/i18n";

type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getItem("news", slug, locale as Locale);
  if (!item) return {};
  return {
    title: tr(item.title, locale as Locale),
    description: tr(item.excerpt, locale as Locale),
    openGraph: { type: "article", images: item.cover ? [String(item.cover)] : undefined },
  };
}

export default async function NewsPage({ params }: P) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const t = dict(locale);
  const item = await getItem("news", slug, locale);
  if (!item) notFound();
  const project = item.project ? (await getItems("projects", locale)).find((p) => p.id === item.project) : null;
  const images = (item.images as string[]) || [];

  return (
    <article>
      <header className="wrap max-w-[860px] pt-10 sm:pt-14">
        <BackLink href={`/${locale}/news`} label={t.nav.news} />
        <p className="text-sm text-muted">
          <time dateTime={String(item.date)}>{formatDate(String(item.date), locale)}</time>
          {tr(item.category, locale) && <span className="ml-3 font-semibold text-leaf-dark">{tr(item.category, locale)}</span>}
        </p>
        <h1 className="h1 mt-3">{tr(item.title, locale)}</h1>
        {tr(item.excerpt, locale) && <p className="lead mt-5">{tr(item.excerpt, locale)}</p>}
      </header>
      {item.cover ? (
        <div className="wrap mt-10 max-w-[1100px]">
          <img src={String(item.cover)} alt="" className="w-full rounded-[1.5rem] sm:rounded-[2rem]" />
        </div>
      ) : null}
      <div className="wrap max-w-[860px] section !pt-12">
        <Markdown className="text-[1.125rem]">{tr(item.body, locale)}</Markdown>
        {project && (
          <p className="mt-10 rounded-2xl bg-moss px-5 py-4">
            {t.nav.projects}:{" "}
            <Link href={`/${locale}/projects/${project.slug}`} className="link">
              {tr(project.title, locale)}
            </Link>
          </p>
        )}
        {images.length > 0 && (
          <section className="mt-14">
            <h2 className="h2 mb-6">{t.gallery}</h2>
            <Gallery images={images} title={tr(item.title, locale)} />
          </section>
        )}
      </div>
    </article>
  );
}
