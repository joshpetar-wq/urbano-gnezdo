import Link from "next/link";
import Canopy from "@/components/site/Canopy";
import Markdown from "@/components/site/Markdown";
import { EventRow, NewsCard, PartnerLogo, ProjectCard } from "@/components/site/parts";
import { getItems, getSettings, today } from "@/lib/content";
import { dict, tr, type Locale } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const [s, news, projects, events, stats, partners] = await Promise.all([
    getSettings(),
    getItems("news", locale),
    getItems("projects", locale),
    getItems("events", locale),
    getItems("stats", locale),
    getItems("partners", locale),
  ]);
  const upcoming = events.filter((e) => String(e.date) >= today()).reverse().slice(0, 3);
  const featuredProjects = [...projects].sort((a, b) => Number(a.phase === "completed") - Number(b.phase === "completed")).slice(0, 2);
  const [lead, ...restNews] = news.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden">
        <div className="wrap grid items-center gap-10 pt-10 pb-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:pt-16 md:pb-24">
          <div className="order-2 md:order-1">
            <h1 className="display max-w-[14ch]">{tr(s.heroTitle, locale)}</h1>
            <p className="lead mt-6">{tr(s.heroText, locale)}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={`/${locale}/involve`} className="btn btn-primary">
                {t.nav.involve}
              </Link>
              <Link href={`/${locale}/projects`} className="btn btn-ghost">
                {t.ourProjects}
              </Link>
            </div>
          </div>
          <div className="order-1 mx-auto w-full max-w-[290px] sm:max-w-[420px] md:order-2 md:max-w-none">
            <Canopy image={(s.heroImage as string) || undefined} alt={tr(s.heroTitle, locale)} />
          </div>
        </div>
      </section>

      {/* About + stats */}
      <section className="bg-navy text-white">
        <div className="wrap section grid gap-12 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-16">
          <div>
            <h2 className="h2 !text-white">{t.nav.about}</h2>
            <p className="mt-5 text-[1.2rem] leading-relaxed text-white/90">{tr(s.aboutShort, locale)}</p>
            <Link href={`/${locale}/about`} className="mt-7 inline-block font-semibold text-white underline decoration-leaf decoration-2 underline-offset-4 hover:decoration-4">
              {t.readMore}
            </Link>
          </div>
          {stats.length > 0 && (
            <dl className="grid content-start gap-y-7">
              {stats.map((st) => (
                <div key={st.id} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-t border-white/20 pt-5">
                  <dt className="order-2 text-white/80">{tr(st.label, locale)}</dt>
                  <dd className="order-1 text-[2.6rem] leading-none font-extrabold tracking-tight text-leaf">{String(st.value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* Projects */}
      {featuredProjects.length > 0 && (
        <section className="wrap section">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="h2">{t.ourProjects}</h2>
            <Link href={`/${locale}/projects`} className="link">{t.allProjects}</Link>
          </div>
          <div className="grid gap-14">
            {featuredProjects.map((p) => (
              <ProjectCard key={p.id} item={p} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {lead && (
        <section className="border-t border-line bg-mist">
          <div className="wrap section">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <h2 className="h2">{t.latestNews}</h2>
              <Link href={`/${locale}/news`} className="link">{t.allNews}</Link>
            </div>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <NewsCard item={lead} locale={locale} size="lg" />
              <div className="grid content-start gap-10">
                {restNews.map((n) => (
                  <NewsCard key={n.id} item={n} locale={locale} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      <section className="wrap section">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className="h2">{t.upcomingEvents}</h2>
          <Link href={`/${locale}/events`} className="link">{t.allEvents}</Link>
        </div>
        {upcoming.length ? (
          <div className="border-b border-line">
            {upcoming.map((e) => (
              <EventRow key={e.id} item={e} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="max-w-[60ch] border-t border-line pt-6 text-muted">{t.noEvents}</p>
        )}
      </section>

      {/* Get involved */}
      <section className="wrap pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-leaf px-6 py-12 sm:px-12 sm:py-16">
          <img src="/brand/stork.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-16 hidden w-[340px] opacity-25 md:block" />
          <div className="relative max-w-[40rem]">
            <h2 className="h1">{t.joinUs}</h2>
            <Markdown className="mt-5 text-[1.1rem] text-navy-deep">{tr(s.involveIntro, locale)}</Markdown>
            <Link href={`/${locale}/involve`} className="btn btn-primary mt-8">
              {t.register}
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="border-t border-line">
          <div className="wrap py-14">
            <h2 className="h3">{t.partners}</h2>
            <ul className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
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
