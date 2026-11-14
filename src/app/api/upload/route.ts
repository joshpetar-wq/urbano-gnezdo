import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/auth";
import { blobEnabled, saveLocalFile } from "@/lib/storage";

const allowed = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Не сте најавени." }, { status: 401 });
  }

  // Local development without Vercel Blob: plain multipart upload
  if (!blobEnabled()) {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Нема датотека." }, { status: 400 });
    if (!allowed.includes(file.type)) return NextResponse.json({ error: "Овој тип датотека не е дозволен." }, { status: 400 });
    const url = await saveLocalFile(file.name, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url });
  }

  // Vercel Blob: issue a token so the browser uploads straight to storage
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: allowed,
        maximumSizeInBytes: 50 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Прикачувањето не успеа." }, { status: 400 });
  }
}
