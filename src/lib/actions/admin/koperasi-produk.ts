"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { validateHttpUrl } from "@/src/lib/http-url";

export type ProdukStatus = "TERSEDIA" | "HABIS";

export type ProdukInputData = {
  namaProduk: string;
  deskripsi: string;
  harga: string;
  imageUrl: string;
  status: ProdukStatus;
  linkGformPesan: string;
};

export type ProdukAdminRow = {
  id: string;
  namaProduk: string;
  deskripsi: string | null;
  harga: string;
  imageUrl: string | null;
  status: ProdukStatus;
  linkGformPesan: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProdukActionResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeProduk(data: ProdukInputData) {
  const namaProduk = data.namaProduk.trim();
  if (!namaProduk) {
    throw new Error("Nama produk wajib diisi.");
  }

  let harga: Prisma.Decimal;
  try {
    harga = new Prisma.Decimal(data.harga);
  } catch {
    throw new Error("Harga harus berupa angka yang valid.");
  }
  if (!harga.isFinite() || harga.lessThan(0)) {
    throw new Error("Harga tidak boleh kurang dari 0.");
  }

  if (data.status !== "TERSEDIA" && data.status !== "HABIS") {
    throw new Error("Status produk tidak valid.");
  }

  const imageUrl = data.imageUrl.trim();
  const linkGformPesan = data.linkGformPesan.trim();

  return {
    namaProduk,
    deskripsi: data.deskripsi.trim() || null,
    harga,
    imageUrl: imageUrl ? validateHttpUrl(imageUrl, "URL gambar") : null,
    status: data.status,
    linkGformPesan: linkGformPesan
      ? validateHttpUrl(linkGformPesan, "Link pemesanan")
      : null,
  };
}

function getActionError(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return "Produk tidak ditemukan.";
  }
  return error instanceof Error ? error.message : fallback;
}

function refreshKoperasiPages() {
  revalidatePath("/admin/koperasi");
  revalidatePath("/anggota/koperasi");
}

export async function getProduk(): Promise<ProdukAdminRow[]> {
  await requireAdmin();

  const products = await prisma.produkKoperasi.findMany({
    orderBy: { namaProduk: "asc" },
  });

  return products.map((product) => ({
    ...product,
    harga: product.harga.toString(),
  }));
}

export async function createProduk(data: ProdukInputData): Promise<ProdukActionResult> {
  await requireAdmin();

  try {
    await prisma.produkKoperasi.create({ data: normalizeProduk(data) });
    refreshKoperasiPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getActionError(error, "Produk gagal dibuat.") };
  }
}

export async function updateProduk(
  id: string,
  data: ProdukInputData,
): Promise<ProdukActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID produk tidak valid." };

  try {
    await prisma.produkKoperasi.update({
      where: { id },
      data: normalizeProduk(data),
    });
    refreshKoperasiPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getActionError(error, "Produk gagal diperbarui.") };
  }
}

export async function deleteProduk(id: string): Promise<ProdukActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID produk tidak valid." };

  try {
    await prisma.produkKoperasi.delete({ where: { id } });
    refreshKoperasiPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getActionError(error, "Produk gagal dihapus.") };
  }
}

export async function toggleStatus(id: string): Promise<ProdukActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID produk tidak valid." };

  try {
    const product = await prisma.produkKoperasi.findUnique({ where: { id } });
    if (!product) return { ok: false, error: "Produk tidak ditemukan." };

    await prisma.produkKoperasi.update({
      where: { id },
      data: { status: product.status === "TERSEDIA" ? "HABIS" : "TERSEDIA" },
    });
    refreshKoperasiPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getActionError(error, "Status produk gagal diperbarui.") };
  }
}
