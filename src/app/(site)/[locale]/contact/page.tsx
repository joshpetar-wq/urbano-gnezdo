import type { Metadata } from "next";
import MessageForm from "@/components/site/MessageForm";
import { PageHeader, Socials } from "@/components/site/parts";
import { getSettings } from "@/lib/content";
import { dict, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.contact };
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const s = await getSettings();
  const map = String(s.mapQuery || "");

  return (
    <>
      <PageHeader title={t.nav.contact} />
      <div className="wrap section grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <dl className="grid gap-6 text-[1.1rem]">
            {tr(s.address, locale) && (
              <div>
                <dt className="text-sm text-muted">{t.address}</dt>
                <dd className="font-semibold text-navy">{tr(s.address, locale)}</dd>
              </div>
            )}
            {s.email ? (
              <div>
                <dt className="text-sm text-muted">{t.email}</dt>
                <dd><a className="link" href={`mailto:${s.email}`}>{String(s.email)}</a></dd>
              </div>
            ) : null}
            {s.phone ? (
              <div>
                <dt className="text-sm text-muted">{t.phone}</dt>
                <dd><a className="font-semibold text-navy" href={`tel:${String(s.phone).replace(/\s/g, "")}`}>{String(s.phone)}</a></dd>
              </div>
            ) : null}
          </dl>
          <Socials settings={s} className="mt-8" />
          {map && (
            <div className="mt-10 aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line">
              <iframe
                title={t.map}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(map)}&z=15&output=embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>
        <section aria-labelledby="contact-title">
          <h2 id="contact-title" className="h2 mb-8">{t.contactForm}</h2>
          <MessageForm locale={locale} t={t} mode="contact" />
        </section>
      </div>
    </>
  );
}
