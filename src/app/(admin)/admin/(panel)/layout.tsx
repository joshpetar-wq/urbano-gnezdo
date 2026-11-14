import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { isAdmin } from "@/lib/auth";
import { collectionOrder, collections } from "@/lib/schema";
import { blobEnabled } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const content = collectionOrder.map((k) => ({ href: `/admin/${k}`, label: collections[k].label }));
  const site = [
    { href: "/admin/settings", label: "Текстови и контакт" },
    { href: "/admin/messages", label: "Пораки и пријави" },
  ];
  const missingStore = !blobEnabled() && Boolean(process.env.VERCEL);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar content={content} site={site} />
      <div className="min-w-0 flex-1">
        {missingStore && (
          <p className="bg-amber-100 px-6 py-3 text-sm font-semibold text-amber-900">
            Складиштето не е поврзано, па промените нема да се зачуваат. Во Vercel: Storage → Create Database → Blob → Connect to project, па Redeploy.
          </p>
        )}
        <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
