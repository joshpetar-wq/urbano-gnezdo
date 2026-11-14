import EntityForm from "@/components/admin/EntityForm";
import { loadSettings } from "@/lib/content";
import { settingsFields } from "@/lib/schema";
import { blobEnabled } from "@/lib/storage";

export default async function SettingsPage() {
  const s = await loadSettings();
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Текстови и контакт</h1>
      <p className="mt-1 mb-6 text-muted">Насловите, текстовите за здружението и контакт-податоците што се прикажуваат низ страната.</p>
      <EntityForm mode="settings" fields={settingsFields} initial={s} blobMode={blobEnabled()} />
    </>
  );
}
