import type { Metadata } from "next";
import Markdown from "@/components/site/Markdown";
import { PageHeader, PartnerLogo } from "@/components/site/parts";
import { getItems, getSettings } from "@/lib/content";
import { dict, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.about };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const [s, team, partners] = await Promise.all([getSettings(), getItems("team", locale), getItems("partners", locale)]);

  return (
    <>
      <PageHeader title={tr(s.orgName, locale)} intro={tr(s.aboutShort, locale)} />

      <section className="wrap section grid gap-10 md:grid-cols-2 md:gap-16">
        {[{ title: t.mission, text: tr(s.mission, locale) }, { title: t.vision, text: tr(s.vision, locale) }].map((b) => (
          <div key={b.title} className="border-l-4 border-leaf pl-6">
            <h2 className="h3">{b.title}</h2>
            <p className="mt-3 text-[1.25rem] leading-snug font-medium text-navy">{b.text}</p>
          </div>
        ))}
      </section>

      {tr(s.history, locale) && (
        <section className="wrap pb-16 sm:pb-24">
          <div className="grid gap-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16">
            <h2 className="h2">{t.history}</h2>
            <Markdown className="text-[1.1rem]">{tr(s.history, locale)}</Markdown>
          </div>
        </section>
      )}

      {tr(s.goals, locale) && (
        <section className="bg-mist">
          <div className="wrap section grid gap-6 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16">
            <h2 className="h2">{t.goals}</h2>
            <Markdown className="text-[1.1rem]">{tr(s.goals, locale)}</Markdown>
          </div>
        </section>
      )}

      <section className="wrap section">
        <h2 className="h2">{t.team}</h2>
        {team.length ? (
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {team.map((m) => (
              <li key={m.id}>
                <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-moss">
                  {m.photo ? (
                    <img src={String(m.photo)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl font-extrabold text-navy/30" aria-hidden="true">
                      {tr(m.name, locale).slice(0, 1)}
                    </div>
                  )}
                </div>
                <p className="mt-4 text-lg font-bold text-navy">{tr(m.name, locale)}</p>
                <p className="text-muted">{tr(m.role, locale)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-muted">{t.teamSoon}</p>
        )}
      </section>

      {partners.length > 0 && (
        <section className="border-t border-line">
          <div className="wrap section">
            <h2 className="h2">{t.partners}</h2>
            <ul className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-8">
              {partners.map((p) => (
                <li key={p.id}>
                  <PartnerLogo item={p} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
