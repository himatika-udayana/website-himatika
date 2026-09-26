import Link from "next/link";
import MataKuliahManager from "@/src/app/(dashboard)/admin/arsip/mata-kuliah/mata-kuliah-manager";
import { getMataKuliahAdminList } from "@/src/lib/actions/admin/arsip-matakuliah";

export default async function AdminMataKuliahPage() {
  const mataKuliah = await getMataKuliahAdminList();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin/arsip" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Kembali ke Arsip</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / Arsip</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Mata Kuliah</h1>
        <p className="mt-2 text-sm text-slate-600">Mata kuliah menjadi pilihan wajib saat menambahkan arsip. Mata kuliah yang memiliki arsip tidak dapat dihapus.</p>
      </div>
      <MataKuliahManager mataKuliah={mataKuliah} />
    </main>
  );
}
