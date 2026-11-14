"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { deleteItem, saveItem, saveSettings } from "@/lib/admin-actions";
import type { Field } from "@/lib/schema";
import { FileInput, ImageInput, ImagesInput, inputCls, MarkdownInput } from "./fields";

type Values = Record<string, unknown>;
type Lang = "mk" | "en";

type Props = {
  mode: "item" | "settings";
  collection?: string;
  singular?: string;
  fields: Field[];
  initial: Values;
  publishable?: boolean;
  blobMode: boolean;
  projectOptions?: { value: string; label: string }[];
  viewUrl?: string;
};

export default function EntityForm({ mode, collection, singular, fields, initial, publishable, blobMode, projectOptions = [], viewUrl }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [lang, setLang] = useState<Lang>("mk");
  const [notice, setNotice] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const isNew = mode === "item" && !initial.id;
  const hasI18n = fields.some((f) => f.i18n);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (name: string, v: unknown, i18n?: boolean) => {
    setDirty(true);
    setValues((prev) => {
      if (!i18n) return { ...prev, [name]: v };
      const cur = (prev[name] as { mk: string; en: string }) || { mk: "", en: "" };
      return { ...prev, [name]: { ...cur, [lang]: v } };
    });
  };

  const missingEn = useMemo(
    () => fields.filter((f) => f.i18n && (values[f.name] as { mk?: string })?.mk && !(values[f.name] as { en?: string })?.en).length,
    [fields, values],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Field[]>();
    for (const f of fields) {
      const g = f.group || "";
      map.set(g, [...(map.get(g) || []), f]);
    }
    return [...map.entries()];
  }, [fields]);

  const save = (status?: "published" | "draft") =>
    start(async () => {
      setNotice(null);
      const payload = status ? { ...values, status } : values;
      const res = mode === "settings" ? await saveSettings(payload) : await saveItem(collection!, payload);
      if (!res.ok) {
        setNotice({ type: "error", text: res.error || "Зачувувањето не успеа." });
        return;
      }
      setDirty(false);
      if (status) setValues((v) => ({ ...v, status }));
      setNotice({
        type: "ok",
        text: status === "published" ? "Објавено. Промената е веќе на страната." : status === "draft" ? "Зачувано како нацрт." : "Зачувано. Промената е веќе на страната.",
      });
      if (isNew && res.id) router.replace(`/admin/${collection}/${res.id}?saved=1`);
      else router.refresh();
    });

  const remove = () => {
    if (!confirm(`Да се избрише ${singular}? Ова не може да се врати.`)) return;
    start(async () => {
      const res = await deleteItem(collection!, String(initial.id));
      if (!res.ok) return setNotice({ type: "error", text: res.error || "Бришењето не успеа." });
      router.replace(`/admin/${collection}`);
      router.refresh();
    });
  };

  const renderField = (f: Field) => {
    const id = `f-${f.name}`;
    const raw = values[f.name];
    const val = f.i18n ? ((raw as Record<Lang, string>)?.[lang] ?? "") : raw;
    const str = typeof val === "string" || typeof val === "number" ? String(val) : "";
    const onStr = (v: string) => set(f.name, v, f.i18n);

    let control: React.ReactNode;
    switch (f.type) {
      case "textarea":
        control = <textarea id={id} value={str} onChange={(e) => onStr(e.target.value)} rows={3} className={inputCls} />;
        break;
      case "markdown":
        control = <MarkdownInput id={id} value={str} onChange={onStr} />;
        break;
      case "image":
        control = <ImageInput id={id} field={f} blobMode={blobMode} value={str} onChange={onStr} />;
        break;
      case "images":
        control = <ImagesInput id={id} field={f} blobMode={blobMode} value={(raw as string[]) || []} onChange={(v) => set(f.name, v)} />;
        break;
      case "file":
        control = <FileInput id={id} field={f} blobMode={blobMode} value={str} onChange={onStr} />;
        break;
      case "select": {
        const opts = f.name === "project" ? [{ value: "", label: "— Без проект —" }, ...projectOptions] : f.options || [];
        control = (
          <select id={id} value={str || opts[0]?.value || ""} onChange={(e) => onStr(e.target.value)} className={inputCls}>
            {opts.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
        break;
      }
      default:
        control = (
          <input
            id={id}
            type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "url" ? "url" : f.type === "email" ? "email" : "text"}
            value={str}
            onChange={(e) => onStr(e.target.value)}
            placeholder={f.type === "url" ? "https://" : undefined}
            className={`${inputCls} ${f.type === "date" || f.type === "number" ? "max-w-[220px]" : ""}`}
          />
        );
    }

    return (
      <div key={f.name} className="grid gap-1.5">
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-navy">
          {f.label}
          {f.required && <span className="text-red-700">*</span>}
          {f.i18n && <span className="rounded bg-mist px-1.5 py-0.5 text-[0.7rem] font-bold text-muted">{lang === "mk" ? "МК" : "EN"}</span>}
        </label>
        {control}
        {f.help && <p className="text-[0.85rem] text-muted">{f.help}</p>}
      </div>
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="grid gap-6">
        {hasI18n && (
          <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center gap-3 bg-mist/95 px-1 py-2 backdrop-blur">
            <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-line" role="tablist" aria-label="Јазик">
              {(["mk", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  onClick={() => setLang(l)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-bold ${lang === l ? "bg-navy text-white" : "text-navy hover:bg-mist"}`}
                >
                  {l === "mk" ? "Македонски" : "English"}
                </button>
              ))}
            </div>
            {missingEn > 0 && (
              <span className="text-sm text-muted">
                {missingEn === 1 ? "1 поле нема превод на англиски" : `${missingEn} полиња немаат превод на англиски`}
                {publishable ? ". Без англиски наслов, содржината не се гледа на EN верзијата." : ". На EN се прикажува македонскиот текст."}
              </span>
            )}
          </div>
        )}

        {groups.map(([group, fs]) => (
          <section key={group || "main"} className="grid gap-5 rounded-2xl bg-white p-5 ring-1 ring-line sm:p-7">
            {group && <h2 className="text-lg font-bold text-navy">{group}</h2>}
            {fs.map(renderField)}
          </section>
        ))}

        {publishable && (
          <details className="rounded-2xl bg-white p-5 ring-1 ring-line sm:px-7">
            <summary className="cursor-pointer text-sm font-semibold text-navy">Напредно: адреса на страницата</summary>
            <div className="mt-4 grid gap-1.5">
              <label htmlFor="f-slug" className="text-sm font-semibold text-navy">
                Дел од линкот (slug)
              </label>
              <input id="f-slug" value={String(values.slug || "")} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="се создава автоматски од насловот" />
              <p className="text-[0.85rem] text-muted">Само латиница, бројки и цртички. Ако е празно, се создава од македонскиот наслов.</p>
            </div>
          </details>
        )}
      </div>

      <aside className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-line lg:sticky lg:top-6">
        {publishable && (
          <p className="flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${values.status === "published" ? "bg-leaf" : "bg-amber-400"}`} aria-hidden="true" />
            {isNew ? "Нова, сè уште незачувана" : values.status === "published" ? "Објавено на страната" : "Нацрт (не се гледа на страната)"}
          </p>
        )}

        {publishable ? (
          <div className="grid gap-2">
            <button type="button" disabled={pending} onClick={() => save("published")} className="btn btn-primary justify-center">
              {pending ? "Се зачувува…" : values.status === "published" ? "Зачувај промени" : "Објави"}
            </button>
            <button type="button" disabled={pending} onClick={() => save("draft")} className="rounded-full px-4 py-2 text-sm font-semibold text-navy ring-1 ring-line hover:bg-mist">
              {values.status === "published" ? "Врати во нацрт" : "Зачувај како нацрт"}
            </button>
          </div>
        ) : (
          <button type="button" disabled={pending} onClick={() => save()} className="btn btn-primary justify-center">
            {pending ? "Се зачувува…" : "Зачувај"}
          </button>
        )}

        {notice && (
          <p role="status" className={`rounded-xl px-3 py-2 text-sm font-semibold ${notice.type === "ok" ? "bg-moss text-leaf-dark" : "bg-red-50 text-red-700"}`}>
            {notice.text}
          </p>
        )}
        {dirty && !pending && <p className="text-xs text-muted">Имате незачувани промени.</p>}

        {viewUrl && values.status === "published" && (
          <a href={viewUrl} target="_blank" className="text-sm font-semibold text-navy underline decoration-leaf decoration-2 underline-offset-4">
            Види на страната ↗
          </a>
        )}

        {mode === "item" && !isNew && (
          <button type="button" onClick={remove} disabled={pending} className="mt-2 border-t border-line pt-4 text-left text-sm font-semibold text-red-700 hover:underline">
            Избриши {singular}
          </button>
        )}
      </aside>
    </div>
  );
}
