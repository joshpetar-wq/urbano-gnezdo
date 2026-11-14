"use client";

const MAX_SIDE = 2000;

async function resizeImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/webp", 0.85));
    if (!blob) return file;
    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

function safeName(name: string) {
  const map: Record<string, string> = { а:"a",б:"b",в:"v",г:"g",д:"d",ѓ:"gj",е:"e",ж:"zh",з:"z",ѕ:"dz",и:"i",ј:"j",к:"k",л:"l",љ:"lj",м:"m",н:"n",њ:"nj",о:"o",п:"p",р:"r",с:"s",т:"t",ќ:"kj",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",џ:"dj",ш:"sh" };
  return name.toLowerCase().split("").map((c) => map[c] ?? c).join("").replace(/[^a-z0-9.\-_]+/g, "-");
}

/** Uploads a file and returns its public URL. Images are resized in the browser first. */
export async function uploadFile(file: File, blobMode: boolean): Promise<string> {
  const f = await resizeImage(file);
  if (blobMode) {
    const { upload } = await import("@vercel/blob/client");
    const res = await upload(`uploads/${safeName(f.name)}`, f, { access: "public", handleUploadUrl: "/api/upload" });
    return res.url;
  }
  const fd = new FormData();
  fd.append("file", f);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Прикачувањето не успеа.");
  return json.url as string;
}
