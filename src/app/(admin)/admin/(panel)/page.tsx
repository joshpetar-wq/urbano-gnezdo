import Link from "next/link";
import { loadCollection } from "@/lib/content";
import { collectionOrder, collections } from "@/lib/schema";
import { blobEnabled, listMessages } from "@/lib/storage";

export default async function Dashboard() {
  const [counts, messages] = await Promise.all([
    Promise.all(collectionOrder.map(async (k) => [k, (await loadCollection(k)).length] as const)),
    listMessages(),
  ]);
  const quick = [
    { href: "/admin/news/new", label: "Нова вест" },
    { href: "/admin/events/new", label: "Нов настан" },
    { href: "/admin/galleries/new", label: "Нова галерија" },
    { href: "/admin/documents/new", label: "Нов документ" },
  ];

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Добредојдовте</h1>
      <p className="mt-2 text-muted">Сè што ќе зачувате овде веднаш се појавува на страната.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {quick.map((q) => (
          <Link key={q.href} href={q.href} className="btn btn-primary !py-2.5 text-sm">
            + {q.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/messages" className="rounded-2xl bg-navy p-6 text-white hover:bg-navy-deep">
          <p className="text-4xl font-extrabold">{messages.length}</p>
          <p className="mt-1 font-semibold">Пораки и пријави</p>
          <p className="text-sm text-white/70">{messages[0] ? `Последна: ${messages[0].name}` : "Сè уште нема"}</p>
        </Link>
        {counts.map(([k, n]) => (
          <Link key={k} href={`/admin/${k}`} className="rounded-2xl bg-white p-6 ring-1 ring-line hover:ring-navy">
            <p className="text-4xl font-extrabold text-navy">{n}</p>
            <p className="mt-1 font-semibold text-navy">{collections[k].label}</p>
            <p className="text-sm text-muted">{collections[k].description}</p>
          </Link>
        ))}
      </div>

      {!blobEnabled() && !process.env.VERCEL && (
        <p className="mt-10 rounded-xl bg-white px-5 py-4 text-sm text-muted ring-1 ring-line">
          Локален режим: содржината се чува во папката <code>.data</code>. На Vercel се користи Vercel Blob.
        </p>
      )}
    </>
  );
}
