import Link from "next/link";
import RedirectLinkManager from "@/src/app/(dashboard)/admin/redirect-link/redirect-link-manager";
import { getRedirectLinks } from "@/src/lib/actions/admin/redirect-link";

export default async function AdminRedirectLinkPage() {
  const links = await getRedirectLinks();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Dashboard admin</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / Link</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Redirect Link</h1>
        <p className="mt-2 text-sm text-slate-600">Buat dan kelola URL pendek tanpa deploy ulang aplikasi.</p>
      </div>
      <RedirectLinkManager links={links} />
    </main>
  );
}
