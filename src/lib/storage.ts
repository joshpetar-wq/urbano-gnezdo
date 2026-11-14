// Storage layer.
// On Vercel (BLOB_READ_WRITE_TOKEN set): everything lives in Vercel Blob.
// Locally without a token: everything lives in the .data folder.
import { put, list, del } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";

export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const DATA_DIR = path.join(process.cwd(), ".data");

function assertWritable() {
  if (!blobEnabled() && process.env.VERCEL) {
    throw new Error(
      "Складиштето не е поврзано. Во Vercel отворете Storage → Create → Blob и поврзете го со проектот.",
    );
  }
}

// ---------- JSON documents (one versioned blob per key) ----------

export async function readJSON<T>(key: string): Promise<T | null> {
  if (blobEnabled()) {
    const { blobs } = await list({ prefix: `db/${key}/` });
    if (!blobs.length) return null;
    const latest = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  }
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "db", `${key}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJSON(key: string, data: unknown): Promise<void> {
  assertWritable();
  const body = JSON.stringify(data);
  if (blobEnabled()) {
    const saved = await put(`db/${key}/data.json`, body, {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
    // Remove older versions
    const { blobs } = await list({ prefix: `db/${key}/` });
    const old = blobs.filter((b) => b.url !== saved.url).map((b) => b.url);
    if (old.length) await del(old);
    return;
  }
  const dir = path.join(DATA_DIR, "db");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${key}.json`), body, "utf8");
}

// ---------- Messages (one blob per message, safe for parallel submissions) ----------

export type Message = {
  id: string;
  type: "contact" | "volunteer" | "member";
  name: string;
  email: string;
  phone?: string;
  age?: string;
  message?: string;
  locale: string;
  createdAt: string;
};

export async function addMessage(m: Message): Promise<void> {
  assertWritable();
  if (blobEnabled()) {
    await put(`messages/${m.createdAt.slice(0, 10)}-${m.id}.json`, JSON.stringify(m), {
      access: "public",
      addRandomSuffix: true,
      contentType: "application/json",
    });
    return;
  }
  const dir = path.join(DATA_DIR, "messages");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${m.id}.json`), JSON.stringify(m), "utf8");
}

export async function listMessages(): Promise<(Message & { ref: string })[]> {
  if (blobEnabled()) {
    const { blobs } = await list({ prefix: "messages/", limit: 1000 });
    const items = await Promise.all(
      blobs.map(async (b) => {
        try {
          const r = await fetch(b.url, { cache: "no-store" });
          return { ...((await r.json()) as Message), ref: b.url };
        } catch {
          return null;
        }
      }),
    );
    return items.filter(Boolean).sort((a, b) => b!.createdAt.localeCompare(a!.createdAt)) as (Message & { ref: string })[];
  }
  try {
    const dir = path.join(DATA_DIR, "messages");
    const files = await fs.readdir(dir);
    const items = await Promise.all(
      files.map(async (f) => ({
        ...(JSON.parse(await fs.readFile(path.join(dir, f), "utf8")) as Message),
        ref: f,
      })),
    );
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function deleteMessage(ref: string): Promise<void> {
  if (blobEnabled()) {
    if (!ref.includes("/messages/")) return;
    await del(ref);
    return;
  }
  await fs.rm(path.join(DATA_DIR, "messages", path.basename(ref)), { force: true });
}

// ---------- Local files (used only without Blob) ----------

export async function saveLocalFile(name: string, data: Buffer): Promise<string> {
  const dir = path.join(DATA_DIR, "files");
  await fs.mkdir(dir, { recursive: true });
  const safe = name.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
  const file = `${Date.now().toString(36)}-${safe}`;
  await fs.writeFile(path.join(dir, file), data);
  return `/files/${file}`;
}

export async function readLocalFile(name: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(DATA_DIR, "files", path.basename(name)));
  } catch {
    return null;
  }
}
