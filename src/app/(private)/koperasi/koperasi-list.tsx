"use client";

import { useMemo, useState } from "react";
import { FiArrowUpRight, FiBox, FiSearch } from "react-icons/fi";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

type Product = {
  id: string;
  namaProduk: string;
  deskripsi: string | null;
  harga: string | number;
  imageUrl: string | null;
  status: "TERSEDIA" | "HABIS";
  linkGformPesan: string | null;
};

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function KoperasiList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"SEMUA" | Product["status"]>("SEMUA");
  const filteredProducts = useMemo(() => products.filter((product) => {
    const text = `${product.namaProduk} ${product.deskripsi ?? ""}`.toLowerCase();
    return (status === "SEMUA" || product.status === status) && (!query.trim() || text.includes(query.trim().toLowerCase()));
  }), [products, query, status]);

  return (
    <section className="mt-8 space-y-6">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto]">
        <div className="relative"><FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="h-10 pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk atau deskripsi" /></div>
        <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="SEMUA">Semua status</option><option value="TERSEDIA">Tersedia</option><option value="HABIS">Habis</option></select>
      </div>
      {filteredProducts.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600">Tidak ada produk yang sesuai.</p> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <Card key={product.id} className="group overflow-hidden rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><div className="relative aspect-[4/3] bg-slate-100">{product.imageUrl ? <img src={product.imageUrl} alt={product.namaProduk} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-blue-300"><FiBox className="h-12 w-12" /></div>}<Badge className={`absolute right-3 top-3 border-0 ${product.status === "TERSEDIA" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{product.status === "TERSEDIA" ? "Tersedia" : "Habis"}</Badge></div><div className="space-y-3 p-5"><h2 className="text-lg font-semibold text-slate-900">{product.namaProduk}</h2><p className="min-h-10 text-sm leading-6 text-slate-600">{product.deskripsi ?? "Produk koperasi HIMATIKA."}</p><p className="text-lg font-bold text-blue-700">{rupiah.format(Number(product.harga))}</p>{product.status === "TERSEDIA" && product.linkGformPesan ? <Button className="w-full rounded-xl"><a href={product.linkGformPesan} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">Pesan sekarang <FiArrowUpRight /></a></Button> : <Button disabled variant="outline" className="w-full rounded-xl">Produk habis</Button>}</div></Card>)}</div>}
    </section>
  );
}
