import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCollection } from "@/lib/content";
import { collections, isCollectionKey } from "@/lib/schema";
import { formatDate, hasEnglish, tr } from "@/lib/i18n";

export default async function List({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) notFound();
  const def = collections[collection];
  const items = await loadCollection(collection);
  const hasDate = def.fields.some((f) => f.name === "date");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-navy">{def.label}</h1>
          <p className="mt-1 text-muted">{def.description}</p>
        </div>
        <Link href={`/admin/${collection}/new`} className="btn btn-primary">
          + Додај {def.singular}
        </Link>
      </div>

      {items.length ? (
        <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {items.map((i) => {
            const title = tr(i[def.titleField], "mk") || "(без наслов)";
            const img = (i.cover || i.photo || i.logo || (Array.isArray(i.images) ? i.images[0] : "")) as string;
            return (
              <li key={i.id}>
                <Link href={`/admin/${collection}/${i.id}`} className="flex items-center gap-4 px-4 py-3.5 hover:bg-mist sm:px-6">
                  <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-moss">
                    {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-navy">{title}</span>
                    <span className="mt-0.5 flex flex-wrap gap-x-3 text-sm text-muted">
                      {hasDate && i.date ? <span>{formatDate(String(i.date), "mk")}</span> : null}
                      {collection === "stats" ? <span>{String(i.value)}</span> : null}
                      <span>{hasEnglish(i[def.titleField]) ? "МК + EN" : "само МК"}</span>
                    </span>
                  </span>
                  {def.publishable && (
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${i.status === "published" ? "bg-moss text-leaf-dark" : "bg-amber-100 text-amber-900"}`}>
                      {i.status === "published" ? "Објавено" : "Нацрт"}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl bg-white px-6 py-14 text-center ring-1 ring-line">
          <p className="font-semibold text-navy">Сè уште нема {def.label.toLowerCase()}.</p>
          <Link href={`/admin/${collection}/new`} className="btn btn-primary mt-5">
            + Додај {def.singular}
          </Link>
        </div>
      )}
    </>
  );
}
