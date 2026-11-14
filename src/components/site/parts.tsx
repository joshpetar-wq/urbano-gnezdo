import Link from "next/link";
import type { ReactNode } from "react";
import type { Item, Settings } from "@/lib/schema";
import { dateBlock, formatDate, tr, type Dict, type Locale } from "@/lib/i18n";
import Placeholder from "./Placeholder";

export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-line bg-mist">
      <div className="wrap pt-14 pb-12 sm:pt-20 sm:pb-16">
        {children}
        <h1 className="h1 max-w-[18ch]">{title}</h1>
        {intro && <p className="lead mt-5">{intro}</p>}
      </div>
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {label}
    </Link>
  );
}

export function Cover({ src, alt, className = "", label }: { src?: unknown; alt: string; className?: string; label?: string }) {
  return (
    <div className={`overflow-hidden bg-moss ${className}`}>
      {typeof src === "string" && src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <Placeholder label={label} />
      )}
    </div>
  );
}

export function NewsCard({ item, locale, size = "md" }: { item: Item; locale: Locale; size?: "lg" | "md" }) {
  const title = tr(item.title, locale);
  return (
    <article className="group relative">
      <Cover
        src={item.cover}
        alt=""
        className={`rounded-2xl ${size === "lg" ? "aspect-[16/10]" : "aspect-[4/3]"}`}
      />
      <div className="mt-4">
        <p className="text-sm text-muted">
          <time dateTime={String(item.date)}>{formatDate(String(item.date), locale)}</time>
          {tr(item.category, locale) && <span className="ml-3 font-semibold text-leaf-dark">{tr(item.category, locale)}</span>}
        </p>
        <h3 className={`${size === "lg" ? "h2" : "h3"} mt-2`}>
          <Link href={`/${locale}/news/${item.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-leaf decoration-2 underline-offset-4">
            {title}
          </Link>
        </h3>
        {tr(item.excerpt, locale) && <p className="mt-2 text-muted">{tr(item.excerpt, locale)}</p>}
      </div>
    </article>
  );
}

export function EventRow({ item, locale, past = false }: { item: Item; locale: Locale; past?: boolean }) {
  const d = dateBlock(String(item.date), locale);
  return (
    <article className={`group relative grid grid-cols-[4.5rem_1fr] gap-5 border-t border-line py-6 sm:grid-cols-[5.5rem_1fr_auto] sm:items-center ${past ? "opacity-75" : ""}`}>
      {d && (
        <div className={`rounded-2xl px-2 py-3 text-center ${past ? "bg-mist" : "bg-leaf"}`}>
          <span className="block text-[2rem] leading-none font-extrabold tracking-tight text-navy">{d.day}</span>
          <span className="mt-1 block text-sm font-semibold text-navy">{d.month}</span>
          <span className="block text-xs text-navy/70">{d.year}</span>
        </div>
      )}
      <div>
        <h3 className="h3">
          <Link href={`/${locale}/events/${item.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-leaf decoration-2 underline-offset-4">
            {tr(item.title, locale)}
          </Link>
        </h3>
        <p className="mt-1 text-muted">
          {[item.time as string, tr(item.location, locale)].filter(Boolean).join(", ")}
        </p>
        {tr(item.summary, locale) && <p className="mt-2 max-w-[60ch]">{tr(item.summary, locale)}</p>}
      </div>
    </article>
  );
}

export function ProjectCard({ item, locale, t }: { item: Item; locale: Locale; t: Dict }) {
  const active = item.phase !== "completed";
  return (
    <article className="group relative grid gap-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:items-center sm:gap-8">
      <Cover src={item.cover} alt="" className="aspect-[4/3] rounded-[2rem]" label={tr(item.period, locale)} />
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${active ? "bg-leaf" : "bg-muted/50"}`} aria-hidden="true" />
          <span className={active ? "text-leaf-dark" : "text-muted"}>{active ? t.active : t.completed}</span>
          {tr(item.period, locale) && <span className="font-normal text-muted">{tr(item.period, locale)}</span>}
        </p>
        <h3 className="h2 mt-2">
          <Link href={`/${locale}/projects/${item.slug}`} className="after:absolute after:inset-0 group-hover:underline decoration-leaf decoration-2 underline-offset-4">
            {tr(item.title, locale)}
          </Link>
        </h3>
        {tr(item.summary, locale) && <p className="mt-3 max-w-[52ch] text-muted">{tr(item.summary, locale)}</p>}
        {tr(item.funder, locale) && (
          <p className="mt-3 text-sm">
            <span className="text-muted">{t.funder}:</span> <span className="font-semibold text-navy">{tr(item.funder, locale)}</span>
          </p>
        )}
      </div>
    </article>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-mist px-6 py-10 text-center text-muted">{children}</p>;
}

const icons: Record<string, ReactNode> = {
  facebook: <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />,
  instagram: (
    <path d="M12 7.3a4.7 4.7 0 100 9.4 4.7 4.7 0 000-9.4zm0 7.7a3 3 0 110-6 3 3 0 010 6zm4.9-7.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0zM20 8.2c-.1-1.5-.4-2.8-1.5-3.8S16.2 3 14.7 3H9.3C7.8 3 6.5 3.3 5.5 4.4S4.1 6.7 4 8.2v7.6c.1 1.5.4 2.8 1.5 3.8s2.3 1.4 3.8 1.4h5.4c1.5 0 2.8-.4 3.8-1.4s1.4-2.3 1.5-3.8V8.2zm-2 9.2a3 3 0 01-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 01-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3A3 3 0 015.7 5c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4A3 3 0 0118 6.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.4z" />
  ),
  youtube: <path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />,
  tiktok: <path d="M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-1.8-2.5V9.7a5.7 5.7 0 104.9 5.7V9.1a7.3 7.3 0 004.3 1.4V7.4a4.3 4.3 0 01-3.2-1.6z" />,
};

export function Socials({ settings, className = "" }: { settings: Settings; className?: string }) {
  const links = (["facebook", "instagram", "youtube", "tiktok"] as const).filter((k) => settings[k]);
  if (!links.length) return null;
  return (
    <ul className={`flex gap-2 ${className}`}>
      {links.map((k) => (
        <li key={k}>
          <a
            href={String(settings[k])}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy ring-1 ring-line hover:bg-navy hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {icons[k]}
            </svg>
            <span className="sr-only">{k}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer({ settings, locale, t, nav }: { settings: Settings; locale: Locale; t: Dict; nav: { href: string; label: string }[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-moss">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <img src="/brand/logo.png" alt={tr(settings.orgShort, locale)} className="h-auto w-[210px]" />
          <p className="mt-5 max-w-[34ch] text-sm text-muted">{tr(settings.orgName, locale)}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.95rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-navy hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-[0.95rem]">
          {tr(settings.address, locale) && <p className="text-navy">{tr(settings.address, locale)}</p>}
          {settings.email ? (
            <p className="mt-2">
              <a href={`mailto:${settings.email}`} className="link">
                {String(settings.email)}
              </a>
            </p>
          ) : null}
          {settings.phone ? (
            <p className="mt-1">
              <a href={`tel:${String(settings.phone).replace(/\s/g, "")}`} className="text-navy">
                {String(settings.phone)}
              </a>
            </p>
          ) : null}
          <Socials settings={settings} className="mt-5" />
        </div>
      </div>
      <div className="border-t border-line">
        <p className="wrap py-5 text-sm text-muted">
          © {year} {tr(settings.orgShort, locale)}. {t.allRights}
        </p>
      </div>
    </footer>
  );
}

export function PartnerLogo({ item, locale }: { item: Record<string, unknown>; locale: Locale }) {
  const name = tr(item.name, locale);
  const inner = item.logo ? (
    <img src={String(item.logo)} alt={name} className="h-14 w-auto max-w-[180px] object-contain" />
  ) : (
    <span className="text-lg font-bold text-navy">{name}</span>
  );
  return item.url ? (
    <a href={String(item.url)} target="_blank" rel="noopener noreferrer" className="block opacity-80 hover:opacity-100">
      {inner}
    </a>
  ) : (
    inner
  );
}
