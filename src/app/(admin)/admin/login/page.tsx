import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-[1.75rem] bg-white p-8 shadow-[0_1px_0_#d5e2da,0_20px_50px_-30px_rgb(15_64_97/0.35)]">
        <img src="/brand/logo.png" alt="Урбано Гнездо Кривогаштани" className="mx-auto w-48" />
        <h1 className="mt-8 text-xl font-bold text-navy">Најава во админ панелот</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Внесете ја лозинката на здружението.</p>
        <LoginForm />
      </div>
    </main>
  );
}
