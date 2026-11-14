import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/site/Gallery";
import { BackLink } from "@/components/site/parts";
import { getItem } from "@/lib/content";
import { dict, formatDate, tr, type Locale } from "@/lib/i18n";

type P = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getItem("galleries", slug, locale as Locale);
  if (!item) return {};
  const imgs = (item.images as string[]) || [];
  return { title: tr(item.title, locale as Locale), openGraph: imgs[0] ? { images: [imgs[0]] } : undefined };
}

export default async function GalleryPage({ params }: P) {
  const { locale: l, slug } = await params;
  const locale = l as Locale;
  const t = dict(locale);
  const item = await getItem("galleries", slug, locale);
  if (!item) notFound();
  const imgs = (item.images as string[]) || [];

  return (
    <div className="wrap section !pt-10 sm:!pt-14">
      <BackLink href={`/${locale}/galleries`} label={t.nav.galleries} />
      <h1 className="h1">{tr(item.title, locale)}</h1>
      <p className="mt-3 text-muted">
        {formatDate(String(item.date), locale)}, {imgs.length} {t.photos}
      </p>
      {tr(item.description, locale) && <p className="lead mt-5">{tr(item.description, locale)}</p>}
      <div className="mt-10">
        <Gallery images={imgs} title={tr(item.title, locale)} />
      </div>
    </div>
  );
}
