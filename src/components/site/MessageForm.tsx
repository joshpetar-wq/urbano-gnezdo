"use client";

import { useActionState } from "react";
import { submitMessage, type FormState } from "@/lib/public-actions";
import type { Dict, Locale } from "@/lib/i18n";

type Props = { locale: Locale; t: Dict; mode: "contact" | "apply" };

export default function MessageForm({ locale, t, mode }: Props) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitMessage, null);

  if (state?.ok) {
    return (
      <div role="status" className="rounded-2xl bg-moss p-6 text-lg font-semibold text-navy">
        {mode === "apply" ? t.applied : t.sent}
      </div>
    );
  }

  const error =
    state?.error === "required" ? t.errorRequired : state?.error === "email" ? t.errorEmail : state?.error ? t.errorGeneric : null;

  return (
    <form action={action} className="grid gap-4" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {mode === "apply" && (
        <fieldset className="field">
          <legend className="label">{t.applyAs}</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {(["volunteer", "member"] as const).map((v, i) => (
              <label key={v} className="cursor-pointer">
                <input type="radio" name="type" value={v} defaultChecked={i === 0} className="peer sr-only" />
                <span className="inline-block rounded-full border-2 border-line px-4 py-2 font-semibold text-navy peer-checked:border-navy peer-checked:bg-navy peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-leaf">
                  {v === "volunteer" ? t.volunteer : t.member}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {mode === "contact" && <input type="hidden" name="type" value="contact" />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${mode}-name`}>{t.name} *</label>
          <input id={`${mode}-name`} name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor={`${mode}-email`}>{t.email} *</label>
          <input id={`${mode}-email`} name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor={`${mode}-phone`}>{t.phone}</label>
          <input id={`${mode}-phone`} name="phone" type="tel" autoComplete="tel" />
        </div>
        {mode === "apply" && (
          <div className="field">
            <label htmlFor="apply-age">{t.age}</label>
            <input id="apply-age" name="age" inputMode="numeric" />
          </div>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${mode}-message`}>{mode === "apply" ? t.interests : `${t.message} *`}</label>
        <textarea id={`${mode}-message`} name="message" rows={mode === "apply" ? 3 : 5} required={mode === "contact"} />
      </div>
      {mode === "apply" && <p className="text-sm text-muted">{t.minorNote}</p>}
      {error && (
        <p role="alert" className="font-semibold text-red-700">
          {error}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? t.sending : mode === "apply" ? t.apply : t.send}
        </button>
      </div>
    </form>
  );
}
