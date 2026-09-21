"use server";

import { prisma } from "@/src/lib/prisma";

export async function getProdukList() {
  const products = await prisma.produkKoperasi.findMany({
    orderBy: { namaProduk: "asc" },
  });

  return products.map((product) => ({
    ...product,
    harga: product.harga.toNumber(),
  }));
}

export async function getProdukDetail(id: string) {
  const product = await prisma.produkKoperasi.findUnique({
    where: { id },
  });

  return product
    ? { ...product, harga: product.harga.toNumber() }
    : null;
}
