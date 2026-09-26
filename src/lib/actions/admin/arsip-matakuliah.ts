"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export type MataKuliahInput = {
  kode: string;
  nama: string;
};

export type ArsipAdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeMataKuliah(data: MataKuliahInput): MataKuliahInput {
  const kode = data.kode.trim();
  const nama = data.nama.trim();

  if (!kode) throw new Error("Kode mata kuliah wajib diisi.");
  if (!nama) throw new Error("Nama mata kuliah wajib diisi.");

  return { kode, nama };
}

function getMataKuliahError(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") return "Kode mata kuliah sudah digunakan.";
    if (error.code === "P2003") return "Mata kuliah masih digunakan Arsip Soal dan tidak bisa dihapus.";
    if (error.code === "P2025") return "Mata kuliah tidak ditemukan.";
  }
  return error instanceof Error ? error.message : fallback;
}

function refreshMataKuliahPages() {
  revalidatePath("/admin/arsip/mata-kuliah");
  revalidatePath("/admin/arsip");
  revalidatePath("/anggota/arsip-soal");
}

export async function getMataKuliahAdminList() {
  await requireAdmin();
  return prisma.mataKuliah.findMany({
    orderBy: [{ kode: "asc" }, { nama: "asc" }],
    include: { _count: { select: { arsip: true } } },
  });
}

export async function createMataKuliah(
  data: MataKuliahInput,
): Promise<ArsipAdminActionResult> {
  await requireAdmin();

  try {
    await prisma.mataKuliah.create({ data: normalizeMataKuliah(data) });
    refreshMataKuliahPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getMataKuliahError(error, "Mata kuliah gagal dibuat.") };
  }
}

export async function updateMataKuliah(
  id: string,
  data: MataKuliahInput,
): Promise<ArsipAdminActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID mata kuliah tidak valid." };

  try {
    await prisma.mataKuliah.update({
      where: { id },
      data: normalizeMataKuliah(data),
    });
    refreshMataKuliahPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getMataKuliahError(error, "Mata kuliah gagal diperbarui.") };
  }
}

export async function deleteMataKuliah(id: string): Promise<ArsipAdminActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID mata kuliah tidak valid." };

  try {
    const archiveCount = await prisma.arsipSoal.count({ where: { mataKuliahId: id } });
    if (archiveCount > 0) {
      return {
        ok: false,
        error: `Mata kuliah masih digunakan oleh ${archiveCount} arsip dan tidak bisa dihapus.`,
      };
    }

    await prisma.mataKuliah.delete({ where: { id } });
    refreshMataKuliahPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getMataKuliahError(error, "Mata kuliah gagal dihapus.") };
  }
}
