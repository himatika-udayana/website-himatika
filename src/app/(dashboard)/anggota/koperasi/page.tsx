import { getProdukList } from "@/src/lib/actions/koperasi";
import KoperasiList from "./koperasi-list";

export default async function KoperasiPage() {
  const products = await getProdukList();

  return (
    <main style={{ maxWidth: 1080, padding: "2rem" }}>
      <h1>Koperasi HIMATIKA</h1>
      <p>Produk dan layanan koperasi anggota.</p>
      <KoperasiList products={products} />
    </main>
  );
}
