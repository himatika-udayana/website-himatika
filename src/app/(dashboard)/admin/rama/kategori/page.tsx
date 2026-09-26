import Link from "next/link";
import KategoriManager from "@/src/app/(dashboard)/admin/rama/kategori/kategori-manager";
import { getKategoriList } from "@/src/lib/actions/admin/rama";

export default async function AdminRamaKategoriPage() {
  const categories = await getKategoriList();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin/rama" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Kembali ke RAMA</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / RAMA</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Kategori Aspirasi</h1>
        <p className="mt-2 text-sm text-slate-600">Kategori yang sudah memiliki jawaban tidak dapat dihapus agar data aspirasi tetap utuh.</p>
      </div>
      <KategoriManager categories={categories} />
    </main>
  );
}
