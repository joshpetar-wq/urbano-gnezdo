import type { Metadata } from "next";
import { Empty, PageHeader, ProjectCard } from "@/components/site/parts";
import { getItems } from "@/lib/content";
import { dict, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: dict((await params).locale as Locale).nav.projects };
}

export default async function Projects({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  const t = dict(locale);
  const items = await getItems("projects", locale);
  const groups = [
    { title: t.activeProjects, items: items.filter((p) => p.phase !== "completed") },
    { title: t.completedProjects, items: items.filter((p) => p.phase === "completed") },
  ].filter((g) => g.items.length);

  return (
    <>
      <PageHeader title={t.nav.projects} />
      <div className="wrap section grid gap-20">
        {groups.length === 0 && <Empty>{t.noProjects}</Empty>}
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="h3 mb-8 border-b border-line pb-3">{g.title}</h2>
            <div className="grid gap-14">
              {g.items.map((p) => (
                <ProjectCard key={p.id} item={p} locale={locale} t={t} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
