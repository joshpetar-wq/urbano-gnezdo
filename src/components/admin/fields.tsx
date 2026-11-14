"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Field } from "@/lib/schema";
import { uploadFile } from "./upload";

export const inputCls =
  "w-full rounded-xl border-[1.5px] border-line bg-white px-3.5 py-2.5 outline-none transition-shadow focus:border-navy focus:ring-3 focus:ring-leaf/35";

type Base = { field: Field; id: string; blobMode: boolean };

// ---------- Markdown ----------

const tools: { label: string; title: string; wrap: [string, string]; line?: boolean }[] = [
  { label: "B", title: "Задебелено", wrap: ["**", "**"] },
  { label: "I", title: "Накосено", wrap: ["_", "_"] },
  { label: "H", title: "Поднаслов", wrap: ["## ", ""], line: true },
  { label: "•", title: "Листа", wrap: ["- ", ""], line: true },
  { label: "❝", title: "Цитат", wrap: ["> ", ""], line: true },
  { label: "🔗", title: "Линк", wrap: ["[", "](https://)"] },
];

export function MarkdownInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const apply = (t: (typeof tools)[number]) => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    let start = s;
    if (t.line) start = value.lastIndexOf("\n", s - 1) + 1;
    const selected = value.slice(t.line ? start : s, e);
    const next = value.slice(0, t.line ? start : s) + t.wrap[0] + selected + t.wrap[1] + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = (t.line ? start : s) + t.wrap[0].length + selected.length;
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border-[1.5px] border-line focus-within:border-navy">
      <div className="flex flex-wrap items-center gap-1 border-b border-line bg-mist px-2 py-1.5">
        {tools.map((t) => (
          <button
            key={t.title}
            type="button"
            title={t.title}
            aria-label={t.title}
            disabled={preview}
            onClick={() => apply(t)}
            className="h-8 min-w-8 rounded-md px-2 text-sm font-bold text-navy hover:bg-white disabled:opacity-40"
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex rounded-lg bg-white p-0.5 text-sm">
          {["Пишувај", "Преглед"].map((l, i) => (
            <button
              key={l}
              type="button"
              onClick={() => setPreview(i === 1)}
              className={`rounded-md px-3 py-1 font-semibold ${preview === (i === 1) ? "bg-navy text-white" : "text-navy"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      {preview ? (
        <div className="prose-ug min-h-[220px] max-w-none bg-white px-4 py-3">
          {value.trim() ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-muted">Нема текст.</p>}
        </div>
      ) : (
        <textarea
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="block min-h-[220px] w-full resize-y bg-white px-4 py-3 leading-relaxed outline-none"
        />
      )}
    </div>
  );
}

// ---------- Uploads ----------

function useUploader(blobMode: boolean) {
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const run = async (files: File[], done: (urls: string[]) => void) => {
    setError(null);
    setBusy(files.length);
    const urls: string[] = [];
    for (const f of files) {
      try {
        urls.push(await uploadFile(f, blobMode));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Прикачувањето не успеа.");
      }
      setBusy((b) => b - 1);
    }
    done(urls);
  };
  return { busy, error, run };
}

function PickButton({ accept, multiple, onFiles, children, id }: { accept: string; multiple?: boolean; onFiles: (f: File[]) => void; children: React.ReactNode; id?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        id={id}
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
      <button type="button" onClick={() => ref.current?.click()} className="rounded-lg border-[1.5px] border-navy px-3.5 py-2 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
        {children}
      </button>
    </>
  );
}

export function ImageInput({ id, blobMode, value, onChange }: Base & { value: string; onChange: (v: string) => void }) {
  const up = useUploader(blobMode);
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div className="flex h-32 w-44 items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-dashed border-line bg-mist">
        {up.busy ? (
          <span className="text-sm text-muted">Се прикачува…</span>
        ) : value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-muted">Нема слика</span>
        )}
      </div>
      <div className="grid gap-2">
        <PickButton id={id} accept="image/*" onFiles={(f) => up.run(f.slice(0, 1), (u) => u[0] && onChange(u[0]))}>
          {value ? "Смени слика" : "Прикачи слика"}
        </PickButton>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-left text-sm font-semibold text-red-700 hover:underline">
            Отстрани
          </button>
        )}
        {up.error && <p className="text-sm text-red-700">{up.error}</p>}
      </div>
    </div>
  );
}

export function ImagesInput({ id, blobMode, value, onChange }: Base & { value: string[]; onChange: (v: string[]) => void }) {
  const up = useUploader(blobMode);
  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {value.map((src, i) => (
            <li key={src + i} className="group relative aspect-square overflow-hidden rounded-lg bg-mist">
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 rounded bg-navy px-1.5 text-[0.7rem] font-semibold text-white">прва</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-navy-deep/75 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 text-white hover:bg-white/20" aria-label="Помести лево">‹</button>
                <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="rounded px-1.5 text-sm text-white hover:bg-white/20" aria-label="Отстрани">✕</button>
                <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 text-white hover:bg-white/20" aria-label="Помести десно">›</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <PickButton id={id} accept="image/*" multiple onFiles={(f) => up.run(f, (u) => onChange([...value, ...u]))}>
          Додај фотографии
        </PickButton>
        {up.busy > 0 && <span className="text-sm text-muted">Се прикачуваат уште {up.busy}…</span>}
        {up.error && <span className="text-sm text-red-700">{up.error}</span>}
      </div>
    </div>
  );
}

export function FileInput({ id, blobMode, value, onChange }: Base & { value: string; onChange: (v: string) => void }) {
  const up = useUploader(blobMode);
  const name = value ? decodeURIComponent(value.split("/").pop() || value) : "";
  return (
    <div className="flex flex-wrap items-center gap-3">
      {value ? (
        <a href={value} target="_blank" rel="noreferrer" className="max-w-full truncate rounded-lg bg-moss px-3 py-2 text-sm font-semibold text-navy hover:underline">
          📄 {name}
        </a>
      ) : (
        <span className="text-sm text-muted">Нема прикачена датотека</span>
      )}
      <PickButton id={id} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onFiles={(f) => up.run(f.slice(0, 1), (u) => u[0] && onChange(u[0]))}>
        {value ? "Замени датотека" : "Прикачи датотека"}
      </PickButton>
      {up.busy > 0 && <span className="text-sm text-muted">Се прикачува…</span>}
      {up.error && <span className="text-sm text-red-700">{up.error}</span>}
    </div>
  );
}
