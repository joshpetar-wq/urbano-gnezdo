import { unstable_cache } from "next/cache";
import { readJSON } from "./storage";
import { seedCollections, seedSettings } from "./seed";
import { collections, type CollectionKey, type Item, type Settings } from "./schema";
import { hasEnglish, type Locale } from "./i18n";

export const CONTENT_TAG = "content";

// ---------- Uncached (admin) ----------

export async function loadCollection(key: CollectionKey): Promise<Item[]> {
  const stored = await readJSON<Item[]>(`collection-${key}`);
  return sortItems(key, stored ?? seedCollections[key]);
}

export async function loadSettings(): Promise<Settings> {
  const stored = await readJSON<Settings>("settings");
  return { ...seedSettings, ...(stored ?? {}) };
}

function sortItems(key: CollectionKey, items: Item[]): Item[] {
  const def = collections[key];
  return [...items].sort((a, b) =>
    def.sort === "order"
      ? (Number(a.order) || 0) - (Number(b.order) || 0)
      : String(b.date || "").localeCompare(String(a.date || "")),
  );
}

// ---------- Cached (public site) ----------

const cachedCollection = unstable_cache(loadCollection, ["collection"], { tags: [CONTENT_TAG] });
const cachedSettings = unstable_cache(loadSettings, ["settings"], { tags: [CONTENT_TAG] });

export const getSettings = () => cachedSettings();

/** Published items for a locale. English hides items without an English title. */
export async function getItems(key: CollectionKey, locale: Locale): Promise<Item[]> {
  const def = collections[key];
  const items = await cachedCollection(key);
  return items.filter((i) => {
    if (def.publishable && i.status !== "published") return false;
    if (locale === "en" && def.publishable && !hasEnglish(i[def.titleField])) return false;
    return true;
  });
}

export async function getItem(key: CollectionKey, slug: string, locale: Locale): Promise<Item | null> {
  const items = await getItems(key, locale);
  return items.find((i) => i.slug === decodeURIComponent(slug)) ?? null;
}

export function today(): string {
  // Date in North Macedonia
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Skopje" }).format(new Date());
}
