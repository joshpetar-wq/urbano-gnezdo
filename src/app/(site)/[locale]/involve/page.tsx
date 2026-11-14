import type { Metadata } from "next";
import Markdown from "@/components/site/Markdown";
import MessageForm from "@/components/site/MessageForm";
import { PageHeader } from "@/components/site/parts";
import { getSettings } from "@/lib/content";
import { dict, tr, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.involve };
}

export default async function Involve({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const s = await getSettings();

  return (
    <>
      <PageHeader title={t.nav.involve} />
      <div className="wrap section grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <Markdown className="text-[1.15rem]">{tr(s.involveIntro, locale)}</Markdown>
          {tr(s.membership, locale) && (
            <div className="mt-10 rounded-[1.5rem] bg-moss p-7">
              <h2 className="h3">{t.joinUs}</h2>
              <Markdown className="mt-4">{tr(s.membership, locale)}</Markdown>
            </div>
          )}
        </div>
        <section aria-labelledby="apply-title">
          <h2 id="apply-title" className="h2 mb-8">{t.applyTitle}</h2>
          <MessageForm locale={locale} t={t} mode="apply" />
        </section>
      </div>
    </>
  );
}
