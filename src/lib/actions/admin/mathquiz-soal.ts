"use server";

import { Prisma, TipeSoalQuiz } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export type SoalInput = {
  quizId: string;
  tipe: TipeSoalQuiz;
  teksSoal: string;
  poin: string;
  pilihanA: string;
  pilihanB: string;
  pilihanC: string;
  pilihanD: string;
  pilihanE: string;
  jawabanBenarPg: string;
  jawabanBenarIsian: string;
};

export type SoalActionResult =
  | { ok: true }
  | { ok: false; error: string };

function normalizeSoal(data: SoalInput) {
  const teksSoal = data.teksSoal.trim();
  const poin = Number(data.poin);

  if (!teksSoal) throw new Error("Teks soal wajib diisi.");
  if (!Number.isInteger(poin) || poin < 0) {
    throw new Error("Poin harus berupa bilangan bulat positif atau nol.");
  }

  if (data.tipe === TipeSoalQuiz.PG) {
    const pilihanA = data.pilihanA.trim();
    const pilihanB = data.pilihanB.trim();
    const pilihanC = data.pilihanC.trim();
    const pilihanD = data.pilihanD.trim();
    const pilihanE = data.pilihanE.trim();
    const jawabanBenarPg = data.jawabanBenarPg.trim().toUpperCase();

    if (![pilihanA, pilihanB, pilihanC, pilihanD, pilihanE].every(Boolean)) {
      throw new Error("Semua 5 pilihan jawaban A-E wajib diisi untuk soal pilihan ganda.");
    }
    if (!["A", "B", "C", "D", "E"].includes(jawabanBenarPg)) {
      throw new Error("Pilih satu jawaban benar dari A sampai E.");
    }

    return {
      tipe: TipeSoalQuiz.PG,
      teksSoal,
      poin,
      pilihanA,
      pilihanB,
      pilihanC,
      pilihanD,
      pilihanE,
      jawabanBenarPg,
      jawabanBenarIsian: null,
    };
  }

  if (data.tipe === TipeSoalQuiz.ISIAN) {
    const jawabanBenarIsian = data.jawabanBenarIsian.trim();
    if (!jawabanBenarIsian) {
      throw new Error("Jawaban benar wajib diisi untuk soal isian singkat.");
    }

    return {
      tipe: TipeSoalQuiz.ISIAN,
      teksSoal,
      poin,
      pilihanA: null,
      pilihanB: null,
      pilihanC: null,
      pilihanD: null,
      pilihanE: null,
      jawabanBenarPg: null,
      jawabanBenarIsian,
    };
  }

  throw new Error("Tipe soal tidak valid.");
}

function getSoalError(error: unknown, fallback: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003") return "Kuis tidak ditemukan.";
    if (error.code === "P2025") return "Soal tidak ditemukan.";
    if (error.code === "P2002") return "Urutan soal sudah digunakan.";
  }
  return error instanceof Error ? error.message : fallback;
}

function refreshSoalPages(quizId: string) {
  revalidatePath(`/admin/mathquiz/${quizId}/soal`);
  revalidatePath("/admin/mathquiz");
  revalidatePath(`/anggota/mathquiz/${quizId}`);
  revalidatePath("/anggota/mathquiz");
}

export async function getSoal(quizId: string) {
  await requireAdmin();
  if (!quizId) throw new Error("ID kuis tidak valid.");

  return prisma.quizQuestion.findMany({
    where: { quizId },
    orderBy: { urutan: "asc" },
  });
}

export async function createSoal(data: SoalInput): Promise<SoalActionResult> {
  await requireAdmin();
  if (!data.quizId) return { ok: false, error: "ID kuis tidak valid." };

  try {
    await prisma.$transaction(async (transaction) => {
      const quiz = await transaction.quiz.findUnique({ where: { id: data.quizId } });
      if (!quiz) throw new Error("Kuis tidak ditemukan.");

      const aggregate = await transaction.quizQuestion.aggregate({
        where: { quizId: data.quizId },
        _max: { urutan: true },
      });

      await transaction.quizQuestion.create({
        data: {
          ...normalizeSoal(data),
          quizId: data.quizId,
          urutan: (aggregate._max.urutan ?? 0) + 1,
        },
      });
    });
    refreshSoalPages(data.quizId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getSoalError(error, "Soal gagal dibuat.") };
  }
}

export async function updateSoal(
  id: string,
  data: SoalInput,
): Promise<SoalActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID soal tidak valid." };

  try {
    const existing = await prisma.quizQuestion.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Soal tidak ditemukan." };

    await prisma.quizQuestion.update({
      where: { id },
      data: normalizeSoal(data),
    });
    refreshSoalPages(existing.quizId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getSoalError(error, "Soal gagal diperbarui.") };
  }
}

export async function deleteSoal(id: string): Promise<SoalActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID soal tidak valid." };

  try {
    const quizId = await prisma.$transaction(async (transaction) => {
      const question = await transaction.quizQuestion.delete({ where: { id } });
      const remaining = await transaction.quizQuestion.findMany({
        where: { quizId: question.quizId },
        orderBy: { urutan: "asc" },
        select: { id: true, urutan: true },
      });
      const lowestOrder = Math.min(0, ...remaining.map(({ urutan }) => urutan));
      const temporaryBase = lowestOrder - remaining.length - 1;

      for (const [index, item] of remaining.entries()) {
        await transaction.quizQuestion.update({
          where: { id: item.id },
          data: { urutan: temporaryBase - index },
        });
      }
      for (const [index, item] of remaining.entries()) {
        await transaction.quizQuestion.update({
          where: { id: item.id },
          data: { urutan: index + 1 },
        });
      }

      return question.quizId;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    refreshSoalPages(quizId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getSoalError(error, "Soal gagal dihapus.") };
  }
}

export async function reorderSoal(
  quizId: string,
  orderedIds: string[],
): Promise<SoalActionResult> {
  await requireAdmin();
  if (!quizId || !Array.isArray(orderedIds) || orderedIds.some((id) => typeof id !== "string" || !id)) {
    return { ok: false, error: "Daftar urutan soal tidak valid." };
  }
  if (new Set(orderedIds).size !== orderedIds.length) {
    return { ok: false, error: "ID soal tidak boleh duplikat dalam urutan." };
  }

  try {
    await prisma.$transaction(
      async (transaction) => {
        const questions = await transaction.quizQuestion.findMany({
          where: { quizId },
          select: { id: true, urutan: true },
        });
        const existingIds = new Set(questions.map(({ id }) => id));
        if (
          questions.length !== orderedIds.length ||
          orderedIds.some((id) => !existingIds.has(id))
        ) {
          throw new Error("Urutan harus memuat seluruh soal pada kuis ini tepat satu kali.");
        }

        const lowestOrder = Math.min(0, ...questions.map(({ urutan }) => urutan));
        const temporaryBase = lowestOrder - questions.length - 1;
        for (const [index, id] of orderedIds.entries()) {
          await transaction.quizQuestion.update({
            where: { id },
            data: { urutan: temporaryBase - index },
          });
        }
        for (const [index, id] of orderedIds.entries()) {
          await transaction.quizQuestion.update({
            where: { id },
            data: { urutan: index + 1 },
          });
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    refreshSoalPages(quizId);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getSoalError(error, "Urutan soal gagal diperbarui.") };
  }
}
