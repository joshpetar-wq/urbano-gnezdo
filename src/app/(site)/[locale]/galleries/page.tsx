import type { Metadata } from "next";
import Link from "next/link";
import { Empty, PageHeader } from "@/components/site/parts";
import { getItems } from "@/lib/content";
import { dict, formatDate, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.galleries };
}

export default async function Galleries({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const items = await getItems("galleries", locale);

  return (
    <>
      <PageHeader title={t.nav.galleries} />
      <div className="wrap section">
        {items.length ? (
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g) => {
              const imgs = (g.images as string[]) || [];
              return (
                <li key={g.id} className="group relative">
                  <div className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden rounded-2xl bg-moss">
                    {imgs.slice(0, 3).map((src, i) => (
                      <img key={src} src={src} alt="" loading="lazy" className={`h-full w-full object-cover ${i === 0 ? "col-span-2 row-span-2" : ""} ${imgs.length === 1 ? "col-span-3" : ""}`} />
                    ))}
                  </div>
                  <h2 className="h3 mt-4">
                    <Link href={`/${locale}/galleries/${g.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-leaf decoration-2 underline-offset-4">
                      {tr(g.title, locale)}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(String(g.date), locale)}, {imgs.length} {t.photos}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty>{t.noGalleries}</Empty>
        )}
      </div>
    </>
  );
}
