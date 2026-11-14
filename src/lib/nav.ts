import { dict, type Locale } from "./i18n";

export function navItems(locale: Locale) {
  const t = dict(locale).nav;
  return [
    { href: `/${locale}/about`, label: t.about },
    { href: `/${locale}/projects`, label: t.projects },
    { href: `/${locale}/news`, label: t.news },
    { href: `/${locale}/events`, label: t.events },
    { href: `/${locale}/galleries`, label: t.galleries },
    { href: `/${locale}/documents`, label: t.documents },
    { href: `/${locale}/contact`, label: t.contact },
  ];
}
