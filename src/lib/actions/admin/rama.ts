"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth";

export type RamaAdminActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type KategoriUpdateData = {
  urutan: number;
  namaKategori: string;
  deskripsi: string;
};

class KategoriMasihDipakaiError extends Error {
  constructor(readonly jumlahJawaban: number) {
    super(`Kategori ini masih punya ${jumlahJawaban} jawaban aspirasi, tidak bisa dihapus`);
  }
}

function normalizeKategori(data: KategoriUpdateData): KategoriUpdateData {
  const urutan = Number(data.urutan);
  const namaKategori = data.namaKategori.trim();

  if (!Number.isInteger(urutan) || urutan < 1) {
    throw new Error("Urutan kategori harus bilangan bulat positif.");
  }

  if (!namaKategori) {
    throw new Error("Nama kategori wajib diisi.");
  }

  return { urutan, namaKategori, deskripsi: data.deskripsi.trim() };
}

export async function getSubmissionList(semesterId?: string) {
  await requireAdmin();

  return prisma.ramaSubmission.findMany({
    where: semesterId ? { semesterId } : undefined,
    include: {
      user: { select: { fullName: true, email: true, nim: true } },
      semester: true,
    },
    orderBy: { tanggalSubmit: "desc" },
  });
}

export async function getSubmissionDetail(id: string) {
  await requireAdmin();

  return prisma.ramaSubmission.findUnique({
    where: { id },
    include: {
      user: { select: { fullName: true, email: true, nim: true } },
      semester: true,
      aspirasi: {
        include: { kategori: true },
        orderBy: { kategori: { urutan: "asc" } },
      },
    },
  });
}

export async function getSemesterList() {
  await requireAdmin();

  return prisma.semester.findMany({
    orderBy: [{ tahunAjaran: "desc" }, { jenis: "asc" }],
    include: { _count: { select: { submissions: true } } },
  });
}

export async function createSemester(
  tahunAjaran: string,
  jenis: "GANJIL" | "GENAP",
): Promise<RamaAdminActionResult> {
  await requireAdmin();

  const normalizedYear = tahunAjaran.trim();
  const yearParts = normalizedYear.split("/");
  if (
    !/^\d{4}\/\d{4}$/.test(normalizedYear) ||
    Number(yearParts[1]) !== Number(yearParts[0]) + 1
  ) {
    return { ok: false, error: "Tahun ajaran harus berformat berurutan, misalnya 2025/2026." };
  }

  if (jenis !== "GANJIL" && jenis !== "GENAP") {
    return { ok: false, error: "Jenis semester tidak valid." };
  }

  try {
    await prisma.semester.create({
      data: { tahunAjaran: normalizedYear, jenis, aktif: false },
    });
    revalidatePath("/admin/rama/semester");
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Semester dengan tahun ajaran dan jenis tersebut sudah ada." };
    }
    return { ok: false, error: "Semester gagal dibuat." };
  }
}

export async function setSemesterAktif(id: string): Promise<RamaAdminActionResult> {
  await requireAdmin();

  try {
    await prisma.$transaction(async (transaction) => {
      const semester = await transaction.semester.findUnique({ where: { id } });
      if (!semester) {
        throw new Error("Semester tidak ditemukan.");
      }

      await transaction.semester.updateMany({ data: { aktif: false } });
      await transaction.semester.update({ where: { id }, data: { aktif: true } });
    });

    revalidatePath("/admin/rama/semester");
    revalidatePath("/admin/rama");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Semester gagal diaktifkan.",
    };
  }
}

export async function getKategoriList() {
  await requireAdmin();

  return prisma.kategoriAspirasi.findMany({
    orderBy: { urutan: "asc" },
    include: { _count: { select: { aspirasi: true } } },
  });
}

export async function createKategori(
  urutan: number,
  namaKategori: string,
  deskripsi: string,
): Promise<RamaAdminActionResult> {
  await requireAdmin();

  try {
    await prisma.kategoriAspirasi.create({
      data: normalizeKategori({ urutan, namaKategori, deskripsi }),
    });
    revalidatePath("/admin/rama/kategori");
    revalidatePath("/anggota/rama");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Kategori gagal dibuat.",
    };
  }
}

export async function updateKategori(
  id: string,
  data: KategoriUpdateData,
): Promise<RamaAdminActionResult> {
  await requireAdmin();

  if (!id) {
    return { ok: false, error: "ID kategori tidak valid." };
  }

  try {
    await prisma.kategoriAspirasi.update({
      where: { id },
      data: normalizeKategori(data),
    });
    revalidatePath("/admin/rama/kategori");
    revalidatePath("/anggota/rama");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Kategori gagal diperbarui.",
    };
  }
}

export async function deleteKategori(id: string): Promise<RamaAdminActionResult> {
  await requireAdmin();

  if (!id) {
    return { ok: false, error: "ID kategori tidak valid." };
  }

  try {
    await prisma.$transaction(
      async (transaction) => {
        const jumlahJawaban = await transaction.ramaAspirasi.count({
          where: { kategoriId: id },
        });

        if (jumlahJawaban > 0) {
          throw new KategoriMasihDipakaiError(jumlahJawaban);
        }

        await transaction.kategoriAspirasi.delete({ where: { id } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    revalidatePath("/admin/rama/kategori");
    revalidatePath("/anggota/rama");
    return { ok: true };
  } catch (error) {
    if (error instanceof KategoriMasihDipakaiError) {
      return { ok: false, error: error.message };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      return {
        ok: false,
        error: "Kategori sedang dipakai jawaban aspirasi dan tidak bisa dihapus. Coba lagi.",
      };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return { ok: false, error: "Kategori tidak ditemukan." };
    }

    return { ok: false, error: "Kategori gagal dihapus." };
  }
}
