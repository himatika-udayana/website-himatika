"use server";

import { KategoriArsip, Prisma, SemesterArsip } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { validateHttpUrl } from "@/src/lib/http-url";

export type ArsipInput = {
  judul: string;
  deskripsi: string;
  mataKuliahId: string;
  tahun: string;
  semester: SemesterArsip;
  kategori: KategoriArsip;
  dosen: string;
  linkGdrive: string;
};

export type ArsipFilters = {
  mataKuliahId?: string;
  tahun?: number;
  semester?: SemesterArsip;
  kategori?: KategoriArsip;
};

export type ArsipActionResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeArsip(data: ArsipInput) {
  const judul = data.judul.trim();
  const mataKuliahId = data.mataKuliahId.trim();
  const tahun = Number(data.tahun);

  if (!judul) throw new Error("Judul arsip wajib diisi.");
  if (!mataKuliahId) throw new Error("Mata kuliah wajib dipilih.");
  if (!Number.isInteger(tahun) || tahun < 1) {
    throw new Error("Tahun harus berupa bilangan bulat positif.");
  }
  if (!Object.values(SemesterArsip).includes(data.semester)) {
    throw new Error("Semester arsip tidak valid.");
  }
  if (!Object.values(KategoriArsip).includes(data.kategori)) {
    throw new Error("Kategori arsip tidak valid.");
  }

  return {
    judul,
    deskripsi: data.deskripsi.trim() || null,
    mataKuliahId,
    tahun,
    semester: data.semester,
    kategori: data.kategori,
    dosen: data.dosen.trim() || null,
    linkGdrive: validateHttpUrl(data.linkGdrive, "Link Google Drive"),
  };
}

function getArsipError(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") return "Mata kuliah yang dipilih tidak tersedia.";
    if (error.code === "P2025") return "Arsip tidak ditemukan.";
  }
  return error instanceof Error ? error.message : fallback;
}

function refreshArsipPages() {
  revalidatePath("/admin/arsip");
  revalidatePath("/anggota/arsip-soal");
}

export async function getArsip(filters: ArsipFilters = {}) {
  await requireAdmin();

  return prisma.arsipSoal.findMany({
    where: {
      ...(filters.mataKuliahId ? { mataKuliahId: filters.mataKuliahId } : {}),
      ...(filters.tahun ? { tahun: filters.tahun } : {}),
      ...(filters.semester ? { semester: filters.semester } : {}),
      ...(filters.kategori ? { kategori: filters.kategori } : {}),
    },
    include: {
      mataKuliah: true,
      uploader: { select: { fullName: true } },
    },
    orderBy: [{ createdAt: "desc" }, { judul: "asc" }],
  });
}

export async function createArsip(data: ArsipInput): Promise<ArsipActionResult> {
  const admin = await requireAdmin();

  try {
    await prisma.arsipSoal.create({
      data: {
        ...normalizeArsip(data),
        uploaderId: admin.id,
      },
    });
    refreshArsipPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getArsipError(error, "Arsip gagal dibuat.") };
  }
}

export async function updateArsip(
  id: string,
  data: ArsipInput,
): Promise<ArsipActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID arsip tidak valid." };

  try {
    await prisma.arsipSoal.update({
      where: { id },
      data: normalizeArsip(data),
    });
    refreshArsipPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getArsipError(error, "Arsip gagal diperbarui.") };
  }
}

export async function deleteArsip(id: string): Promise<ArsipActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID arsip tidak valid." };

  try {
    await prisma.arsipSoal.delete({ where: { id } });
    refreshArsipPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getArsipError(error, "Arsip gagal dihapus.") };
  }
}
