import Link from "next/link";
import ProdukManager from "@/src/app/(dashboard)/admin/koperasi/produk-manager";
import { getProduk } from "@/src/lib/actions/admin/koperasi-produk";

export default async function AdminKoperasiPage() {
  const products = await getProduk();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Dashboard admin</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / Koperasi</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Produk</h1>
        <p className="mt-2 text-sm text-slate-600">Tambah, perbarui, dan atur ketersediaan produk koperasi.</p>
      </div>
      <ProdukManager products={products} />
    </main>
  );
}
