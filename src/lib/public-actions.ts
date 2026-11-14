"use server";

import { addMessage, type Message } from "./storage";
import { newId } from "./slug";

export type FormState = { ok: boolean; error?: "required" | "email" | "generic" } | null;

const clip = (v: FormDataEntryValue | null, n: number) => String(v ?? "").trim().slice(0, n);

export async function submitMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  // Honeypot: real people never fill this field
  if (clip(formData.get("website"), 200)) return { ok: true };

  const typeRaw = clip(formData.get("type"), 20);
  const type: Message["type"] = typeRaw === "volunteer" || typeRaw === "member" ? typeRaw : "contact";
  const name = clip(formData.get("name"), 120);
  const email = clip(formData.get("email"), 160);
  const message = clip(formData.get("message"), 5000);

  if (!name || !email || (type === "contact" && !message)) return { ok: false, error: "required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "email" };

  try {
    await addMessage({
      id: newId(),
      type,
      name,
      email,
      phone: clip(formData.get("phone"), 40),
      age: clip(formData.get("age"), 10),
      message,
      locale: clip(formData.get("locale"), 5),
      createdAt: new Date().toISOString(),
    });
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "generic" };
  }
}
