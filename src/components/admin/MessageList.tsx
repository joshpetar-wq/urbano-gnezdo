"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { removeMessage } from "@/lib/admin-actions";
import type { Message } from "@/lib/storage";

const typeLabel: Record<Message["type"], string> = { contact: "Порака", volunteer: "Волонтер", member: "Член" };

export default function MessageList({ messages }: { messages: (Message & { ref: string })[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | Message["type"]>("all");
  const [pending, start] = useTransition();
  const shown = filter === "all" ? messages : messages.filter((m) => m.type === filter);

  const del = (ref: string) => {
    if (!confirm("Да се избрише пораката?")) return;
    start(async () => {
      await removeMessage(ref);
      router.refresh();
    });
  };

  const exportCsv = () => {
    const rows = [["Тип", "Име", "Е-пошта", "Телефон", "Години", "Порака", "Датум"], ...shown.map((m) => [typeLabel[m.type], m.name, m.email, m.phone || "", m.age || "", m.message || "", new Date(m.createdAt).toLocaleString("mk-MK")])];
    const csv = "﻿" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "poraki-urbano-gnezdo.csv";
    a.click();
  };

  if (!messages.length) {
    return <p className="rounded-2xl bg-white px-6 py-14 text-center text-muted ring-1 ring-line">Сè уште нема пораки. Кога некој ќе ја пополни формата на страната, ќе се појави тука.</p>;
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {(["all", "contact", "volunteer", "member"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${filter === f ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-line"}`}>
            {f === "all" ? `Сите (${messages.length})` : `${typeLabel[f]} (${messages.filter((m) => m.type === f).length})`}
          </button>
        ))}
        <button type="button" onClick={exportCsv} className="ml-auto text-sm font-semibold text-navy underline decoration-leaf decoration-2 underline-offset-4">
          Преземи како Excel (CSV)
        </button>
      </div>
      <ul className="grid gap-3">
        {shown.map((m) => (
          <li key={m.ref} className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${m.type === "contact" ? "bg-mist text-navy" : "bg-moss text-leaf-dark"}`}>{typeLabel[m.type]}</span>
                  <span className="font-bold text-navy">{m.name}</span>
                  {m.age && <span className="text-sm text-muted">{m.age} год.</span>}
                </p>
                <p className="mt-1 text-sm">
                  <a href={`mailto:${m.email}`} className="text-navy underline">{m.email}</a>
                  {m.phone && <a href={`tel:${m.phone}`} className="ml-3 text-navy">{m.phone}</a>}
                </p>
              </div>
              <div className="text-right text-sm text-muted">
                {new Date(m.createdAt).toLocaleString("mk-MK", { dateStyle: "medium", timeStyle: "short" })}
                <button type="button" disabled={pending} onClick={() => del(m.ref)} className="ml-4 font-semibold text-red-700 hover:underline">
                  Избриши
                </button>
              </div>
            </div>
            {m.message && <p className="mt-3 whitespace-pre-line">{m.message}</p>}
          </li>
        ))}
      </ul>
    </>
  );
}
