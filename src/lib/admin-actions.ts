"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { checkPassword, createSessionValue, requireAdmin, SESSION_COOKIE, sessionMaxAge, adminPassword } from "./auth";
import { CONTENT_TAG, loadCollection, loadSettings } from "./content";
import { collections, isCollectionKey, settingsFields, type Field, type Item } from "./schema";
import { deleteMessage, writeJSON } from "./storage";
import { newId, slugify, uniqueSlug } from "./slug";

export type ActionResult = { ok: boolean; error?: string; id?: string };

// ---------- Session ----------

export async function login(_prev: { error?: string } | null, formData: FormData) {
  if (!adminPassword()) {
    return { error: "Лозинката не е поставена. Во Vercel додадете променлива ADMIN_PASSWORD и направете Redeploy." };
  }
  if (!checkPassword(String(formData.get("password") || ""))) {
    return { error: "Погрешна лозинка. Обидете се повторно." };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Normalising form input ----------

function clean(field: Field, raw: unknown): unknown {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
  if (field.i18n) {
    const v = (raw ?? {}) as { mk?: unknown; en?: unknown };
    return { mk: str(v.mk), en: str(v.en) };
  }
  switch (field.type) {
    case "images":
      return Array.isArray(raw) ? raw.filter((x) => typeof x === "string" && x) : [];
    case "number": {
      const n = Number(raw);
      return Number.isFinite(n) ? n : 0;
    }
    default:
      return str(raw);
  }
}

function missingRequired(fields: Field[], data: Record<string, unknown>): string | null {
  for (const f of fields) {
    if (!f.required) continue;
    const v = data[f.name];
    const empty = f.i18n
      ? !(v as { mk: string }).mk
      : Array.isArray(v)
        ? v.length === 0
        : !v;
    if (empty) return `Полето „${f.label}“${f.i18n ? " (МК)" : ""} е задолжително.`;
  }
  return null;
}

// ---------- Collections ----------

export async function saveItem(key: string, input: Record<string, unknown>): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!isCollectionKey(key)) return { ok: false, error: "Непознат тип содржина." };
    const def = collections[key];
    const items = await loadCollection(key);
    const existing = input.id ? items.find((i) => i.id === input.id) : undefined;

    const data: Record<string, unknown> = {};
    for (const f of def.fields) data[f.name] = clean(f, input[f.name]);
    const err = missingRequired(def.fields, data);
    if (err) return { ok: false, error: err };

    const now = new Date().toISOString();
    const item: Item = {
      ...data,
      id: existing?.id ?? newId(),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (def.publishable) {
      const title = (data[def.titleField] as { mk: string }).mk;
      const wanted = slugify(String(input.slug || "").trim() || title);
      const taken = items.filter((i) => i.id !== item.id).map((i) => String(i.slug));
      item.slug = uniqueSlug(wanted, taken);
      item.status = input.status === "published" ? "published" : "draft";
    }

    const next = existing ? items.map((i) => (i.id === item.id ? item : i)) : [item, ...items];
    await writeJSON(`collection-${key}`, next);
    updateTag(CONTENT_TAG);
    return { ok: true, id: item.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Зачувувањето не успеа." };
  }
}

export async function deleteItem(key: string, id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (!isCollectionKey(key)) return { ok: false, error: "Непознат тип содржина." };
    const items = await loadCollection(key);
    await writeJSON(
      `collection-${key}`,
      items.filter((i) => i.id !== id),
    );
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Бришењето не успеа." };
  }
}

// ---------- Settings ----------

export async function saveSettings(input: Record<string, unknown>): Promise<ActionResult> {
  try {
    await requireAdmin();
    const current = await loadSettings();
    const data: Record<string, unknown> = { ...current };
    for (const f of settingsFields) data[f.name] = clean(f, input[f.name]);
    await writeJSON("settings", data);
    updateTag(CONTENT_TAG);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Зачувувањето не успеа." };
  }
}

// ---------- Messages ----------

export async function removeMessage(ref: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteMessage(ref);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Бришењето не успеа." };
  }
}
