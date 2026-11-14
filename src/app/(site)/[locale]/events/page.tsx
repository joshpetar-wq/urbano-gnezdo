import type { Metadata } from "next";
import { EventRow, PageHeader } from "@/components/site/parts";
import { getItems, today } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.events };
}

export default async function Events({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const items = await getItems("events", locale);
  const now = today();
  const upcoming = items.filter((e) => String(e.date) >= now).reverse();
  const past = items.filter((e) => String(e.date) < now);

  return (
    <>
      <PageHeader title={t.nav.events} />
      <div className="wrap section">
        <h2 className="h2 mb-4">{t.upcomingEvents}</h2>
        {upcoming.length ? (
          <div className="border-b border-line">
            {upcoming.map((e) => <EventRow key={e.id} item={e} locale={locale} />)}
          </div>
        ) : (
          <p className="max-w-[60ch] border-t border-line pt-6 text-muted">{t.noEvents}</p>
        )}
        {past.length > 0 && (
          <>
            <h2 className="h2 mt-20 mb-4">{t.pastEvents}</h2>
            <div className="border-b border-line">
              {past.map((e) => <EventRow key={e.id} item={e} locale={locale} past />)}
            </div>
          </>
        )}
      </div>
    </>
  );
}
