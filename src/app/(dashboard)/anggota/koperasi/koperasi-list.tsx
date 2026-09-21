"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  namaProduk: string;
  deskripsi: string | null;
  harga: string | number;
  imageUrl: string | null;
  status: "TERSEDIA" | "HABIS";
  linkGformPesan: string | null;
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function KoperasiList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"SEMUA" | Product["status"]>("SEMUA");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus = status === "SEMUA" || product.status === status;
      const matchesQuery =
        !normalizedQuery ||
        product.namaProduk.toLowerCase().includes(normalizedQuery) ||
        (product.deskripsi ?? "").toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [products, query, status]);

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        <label style={{ flex: "1 1 260px" }}>
          Cari produk
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau deskripsi"
            style={{ display: "block", marginTop: 6, padding: 10, width: "100%" }}
          />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as typeof status)}
            style={{ display: "block", marginTop: 6, padding: 10 }}
          >
            <option value="SEMUA">Semua produk</option>
            <option value="TERSEDIA">Tersedia</option>
            <option value="HABIS">Habis</option>
          </select>
        </label>
      </div>

      {filteredProducts.length === 0 ? (
        <p>Tidak ada produk yang sesuai dengan filter.</p>
      ) : (
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {filteredProducts.map((product) => (
            <article key={product.id} style={{ border: "1px solid #ddd", padding: 16 }}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.namaProduk}
                  style={{ aspectRatio: "4 / 3", objectFit: "cover", width: "100%" }}
                />
              ) : null}
              <h2>{product.namaProduk}</h2>
              <p>{product.deskripsi}</p>
              <p>{rupiah.format(Number(product.harga))}</p>
              <p aria-label="Status">Status: {product.status}</p>
              {product.status === "TERSEDIA" && product.linkGformPesan ? (
                <a href={product.linkGformPesan} target="_blank" rel="noreferrer">
                  Pesan
                </a>
              ) : (
                <span>{product.status === "HABIS" ? "Produk habis" : "Pemesanan belum tersedia"}</span>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
