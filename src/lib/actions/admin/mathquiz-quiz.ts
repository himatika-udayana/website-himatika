"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export type QuizInput = {
  judul: string;
  deskripsi: string;
  topik: string;
  tingkatKesulitan: string;
};

export type QuizActionResult =
  | { ok: true }
  | { ok: false; error: string };

class QuizHasAttemptsError extends Error {
  constructor() {
    super("Kuis masih memiliki riwayat pengerjaan dan tidak bisa dihapus.");
  }
}

function normalizeQuiz(data: QuizInput) {
  const judul = data.judul.trim();
  if (!judul) throw new Error("Judul kuis wajib diisi.");

  return {
    judul,
    deskripsi: data.deskripsi.trim() || null,
    topik: data.topik.trim() || null,
    tingkatKesulitan: data.tingkatKesulitan.trim() || null,
  };
}

function getQuizError(error: unknown, fallback: string) {
  if (error instanceof QuizHasAttemptsError) return error.message;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2003" || error.code === "P2034") {
      return "Kuis memiliki riwayat pengerjaan atau sedang dikerjakan dan tidak bisa dihapus. Coba lagi.";
    }
    if (error.code === "P2025") return "Kuis tidak ditemukan.";
  }
  return error instanceof Error ? error.message : fallback;
}

function refreshQuizPages() {
  revalidatePath("/admin/mathquiz");
  revalidatePath("/anggota/mathquiz");
}

export async function getQuizAdminList() {
  await requireAdmin();
  return prisma.quiz.findMany({
    orderBy: [{ createdAt: "desc" }, { judul: "asc" }],
    include: {
      _count: { select: { soal: true, attempts: true } },
    },
  });
}

export async function getQuizAdminDetail(id: string) {
  await requireAdmin();
  return prisma.quiz.findUnique({
    where: { id },
    include: { _count: { select: { soal: true, attempts: true } } },
  });
}

export async function createQuiz(data: QuizInput): Promise<QuizActionResult> {
  const admin = await requireAdmin();

  try {
    await prisma.quiz.create({
      data: { ...normalizeQuiz(data), dibuatOlehId: admin.id, isActive: true },
    });
    refreshQuizPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getQuizError(error, "Kuis gagal dibuat.") };
  }
}

export async function updateQuiz(
  id: string,
  data: QuizInput,
): Promise<QuizActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID kuis tidak valid." };

  try {
    await prisma.quiz.update({ where: { id }, data: normalizeQuiz(data) });
    refreshQuizPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getQuizError(error, "Kuis gagal diperbarui.") };
  }
}

export async function deleteQuiz(id: string): Promise<QuizActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID kuis tidak valid." };

  try {
    await prisma.$transaction(
      async (transaction) => {
        const attemptCount = await transaction.quizAttempt.count({ where: { quizId: id } });
        if (attemptCount > 0) throw new QuizHasAttemptsError();
        await transaction.quiz.delete({ where: { id } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    refreshQuizPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getQuizError(error, "Kuis gagal dihapus.") };
  }
}

export async function toggleQuizActive(id: string): Promise<QuizActionResult> {
  await requireAdmin();
  if (!id) return { ok: false, error: "ID kuis tidak valid." };

  try {
    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return { ok: false, error: "Kuis tidak ditemukan." };
    await prisma.quiz.update({ where: { id }, data: { isActive: !quiz.isActive } });
    refreshQuizPages();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getQuizError(error, "Status kuis gagal diperbarui.") };
  }
}
