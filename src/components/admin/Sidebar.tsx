"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/admin-actions";

type NavLink = { href: string; label: string; badge?: number };

export default function Sidebar({ content, site }: { content: NavLink[]; site: NavLink[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  const item = (l: NavLink) => (
    <li key={l.href}>
      <Link
        href={l.href}
        onClick={() => setOpen(false)}
        aria-current={active(l.href) ? "page" : undefined}
        className={`flex items-center justify-between rounded-lg px-3 py-2 text-[0.95rem] ${
          active(l.href) ? "bg-white/15 font-semibold text-white" : "text-white/75 hover:bg-white/10 hover:text-white"
        }`}
      >
        {l.label}
        {l.badge ? <span className="rounded-full bg-leaf px-2 text-xs font-bold text-navy-deep">{l.badge}</span> : null}
      </Link>
    </li>
  );

  return (
    <aside className="bg-navy text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 lg:py-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <img src="/brand/mark.svg" alt="" className="h-7 w-7" />
          </span>
          <span className="leading-tight">
            <span className="block font-bold">Урбано Гнездо</span>
            <span className="block text-xs text-white/60">Админ панел</span>
          </span>
        </Link>
        <button type="button" className="rounded-lg border border-white/25 px-3 py-1.5 text-sm lg:hidden" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          Мени
        </button>
      </div>
      <nav className={`${open ? "block" : "hidden"} px-3 pb-6 lg:block`} aria-label="Админ">
        <ul className="grid gap-0.5">{item({ href: "/admin", label: "Преглед" })}</ul>
        <p className="mt-5 mb-1.5 px-3 text-xs font-semibold text-white/50">Содржина</p>
        <ul className="grid gap-0.5">{content.map(item)}</ul>
        <p className="mt-5 mb-1.5 px-3 text-xs font-semibold text-white/50">Страна</p>
        <ul className="grid gap-0.5">{site.map(item)}</ul>
        <div className="mt-6 grid gap-1 border-t border-white/15 pt-4">
          <a href="/mk" target="_blank" className="rounded-lg px-3 py-2 text-[0.95rem] text-white/75 hover:bg-white/10 hover:text-white">
            Отвори ја страната ↗
          </a>
          <form action={logout}>
            <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-[0.95rem] text-white/75 hover:bg-white/10 hover:text-white">
              Одјави се
            </button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
