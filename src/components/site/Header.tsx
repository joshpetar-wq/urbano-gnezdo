"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  name: string;
  place: string;
  nav: { href: string; label: string }[];
  cta: { href: string; label: string };
  menuLabel: string;
};

export default function Header({ locale, name, place, nav, cta, menuLabel }: Props) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const rest = pathname.replace(/^\/(mk|en)/, "");
  const other: Locale = locale === "mk" ? "en" : "mk";

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/92 backdrop-blur">
      <div className="wrap flex h-[74px] items-center gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src="/brand/mark.svg" alt="" width={46} height={46} className="h-[46px] w-[46px]" />
          <span className="leading-none">
            <span className="block text-[1.15rem] font-extrabold tracking-[-0.02em] text-navy">{name}</span>
            <span className="mt-1 block text-[0.8rem] font-medium tracking-[0.04em] text-muted">{place}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-[0.95rem] font-medium transition-colors hover:bg-moss ${
                isActive(n.href) ? "bg-moss font-semibold text-navy" : "text-text"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <Link
            href={`/${other}${rest}`}
            hrefLang={other}
            className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-navy"
            aria-label={other === "en" ? "English" : "Македонски"}
          >
            {other === "en" ? "EN" : "МК"}
          </Link>
          <Link href={cta.href} className="btn btn-leaf hidden !py-2 text-sm sm:inline-flex">
            {cta.label}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{menuLabel}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-white lg:hidden">
          <ul className="wrap grid gap-1 py-4">
            {[...nav, cta].map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-3 py-3 text-lg font-semibold ${
                    isActive(n.href) ? "bg-moss text-navy" : "text-text"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
