import { getProdukList } from "@/src/lib/actions/koperasi";
import KoperasiList from "./koperasi-list";

export default async function KoperasiPage() {
  const products = await getProdukList();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-700 px-6 py-10 text-white shadow-lg sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">Koperasi HIMATIKA</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Kebutuhan anggota, lebih dekat.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Produk dan layanan koperasi anggota untuk mendukung aktivitas perkuliahan sehari-hari.</p>
      </div>
      <KoperasiList products={products} />
    </main>
  );
}
