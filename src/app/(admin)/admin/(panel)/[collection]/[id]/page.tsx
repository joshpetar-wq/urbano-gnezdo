import Link from "next/link";
import { notFound } from "next/navigation";
import EntityForm from "@/components/admin/EntityForm";
import { loadCollection } from "@/lib/content";
import { collections, isCollectionKey } from "@/lib/schema";
import { blobEnabled } from "@/lib/storage";
import { tr } from "@/lib/i18n";
import { today } from "@/lib/content";

const sitePath: Record<string, string> = { news: "news", projects: "projects", events: "events", galleries: "galleries" };

export default async function Edit({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!isCollectionKey(collection)) notFound();
  const def = collections[collection];
  const items = await loadCollection(collection);
  const item = id === "new" ? null : items.find((i) => i.id === id);
  if (id !== "new" && !item) notFound();

  const initial: Record<string, unknown> = item ? { ...item } : { status: "draft" };
  if (!item) {
    for (const f of def.fields) {
      if (f.i18n) initial[f.name] = { mk: "", en: "" };
      else if (f.type === "images") initial[f.name] = [];
      else if (f.type === "date") initial[f.name] = today();
      else if (f.type === "number") initial[f.name] = items.length + 1;
      else if (f.type === "select" && f.options) initial[f.name] = f.options[0].value;
      else initial[f.name] = "";
    }
  }

  const projectOptions =
    collection === "news"
      ? (await loadCollection("projects")).map((p) => ({ value: p.id, label: tr(p.title, "mk") }))
      : undefined;
  const viewUrl = item && sitePath[collection] ? `/mk/${sitePath[collection]}/${item.slug}` : undefined;

  return (
    <>
      <Link href={`/admin/${collection}`} className="text-sm font-semibold text-navy hover:underline">
        ‹ {def.label}
      </Link>
      <h1 className="mt-2 mb-6 text-3xl font-extrabold tracking-tight text-navy">
        {item ? tr(item[def.titleField], "mk") || "Уреди" : `Нов ${def.singular}`.replace("Нов вест", "Нова вест").replace("Нов галерија", "Нова галерија").replace("Нов бројка", "Нова бројка")}
      </h1>
      <EntityForm
        key={item?.updatedAt ?? "new"}
        mode="item"
        collection={collection}
        singular={def.singular}
        fields={def.fields}
        initial={initial}
        publishable={def.publishable}
        blobMode={blobEnabled()}
        projectOptions={projectOptions}
        viewUrl={viewUrl}
      />
    </>
  );
}
