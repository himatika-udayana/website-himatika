"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireVerifiedUser } from "@/src/lib/auth";

class DuplicateSubmissionError extends Error {}

export type RamaAnswerInput = {
  kategoriId: string;
  kepuasan: number;
  isiAspirasi: string;
};

export type RamaActionResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string };

export async function getSemesterAktif() {
  return prisma.semester.findFirst({
    where: { aktif: true },
    orderBy: { tahunAjaran: "desc" },
  });
}

export async function getKategoriAspirasi() {
  return prisma.kategoriAspirasi.findMany({
    orderBy: { urutan: "asc" },
  });
}

export async function getSubmissionUser(userId: string, semesterId: string) {
  return prisma.ramaSubmission.findUnique({
    where: {
      userId_semesterId: { userId, semesterId },
    },
    include: {
      semester: true,
      aspirasi: {
        include: { kategori: true },
        orderBy: { kategori: { urutan: "asc" } },
      },
    },
  });
}

export async function submitAspirasi(data: unknown): Promise<RamaActionResult> {
  // TODO: Apply requireVerifiedUser() when Mathquiz and Arsip are migrated; Koperasi remains AllowAny.
  const user = await requireVerifiedUser();
  const payload = data as { semesterId?: unknown; answers?: unknown };
  const semesterId = typeof payload.semesterId === "string" ? payload.semesterId : "";
  const answers = Array.isArray(payload.answers) ? payload.answers : [];

  if (!semesterId) {
    return { ok: false, error: "Periode RAMA tidak valid." };
  }

  const normalizedAnswers: RamaAnswerInput[] = [];

  for (const answer of answers) {
    if (!answer || typeof answer !== "object") {
      return { ok: false, error: "Format jawaban RAMA tidak valid." };
    }

    const item = answer as Record<string, unknown>;
    const kategoriId = typeof item.kategoriId === "string" ? item.kategoriId : "";
    const kepuasan = Number(item.kepuasan);
    const isiAspirasi = typeof item.isiAspirasi === "string" ? item.isiAspirasi.trim() : "";

    if (!kategoriId || !Number.isInteger(kepuasan) || kepuasan < 1 || kepuasan > 5 || !isiAspirasi) {
      return { ok: false, error: "Semua jawaban wajib diisi dan kepuasan harus bernilai 1 sampai 5." };
    }

    normalizedAnswers.push({ kategoriId, kepuasan, isiAspirasi });
  }

  const semester = await prisma.semester.findFirst({
    where: { id: semesterId, aktif: true },
  });

  if (!semester) {
    return { ok: false, error: "Belum ada semester yang sedang aktif." };
  }

  const categories = await getKategoriAspirasi();
  const categoryIds = categories.map((category) => category.id);
  const answerIds = normalizedAnswers.map((answer) => answer.kategoriId);

  if (new Set(answerIds).size !== answerIds.length) {
    return { ok: false, error: "Kategori tidak boleh diisi lebih dari satu kali." };
  }

  if (categories.length === 0 || answerIds.length !== categoryIds.length || new Set(answerIds).size !== categoryIds.length || answerIds.some((id) => !categoryIds.includes(id))) {
    return { ok: false, error: "Semua kategori wajib diisi tepat satu kali." };
  }

  try {
    const submission = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.ramaSubmission.findUnique({
        where: { userId_semesterId: { userId: user.id, semesterId } },
      });

      if (existing) {
        throw new DuplicateSubmissionError();
      }

      return transaction.ramaSubmission.create({
        data: {
          userId: user.id,
          semesterId,
          status: "TERSIMPAN",
          aspirasi: {
            create: normalizedAnswers.map((answer) => ({
              kategoriId: answer.kategoriId,
              kepuasan: answer.kepuasan,
              isiAspirasi: answer.isiAspirasi,
            })),
          },
        },
      });
    });

    return { ok: true, submissionId: submission.id };
  } catch (error) {
    if (error instanceof DuplicateSubmissionError) {
      return { ok: false, error: "Kamu sudah pernah mengirim aspirasi untuk periode ini." };
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, error: "Kamu sudah pernah mengirim aspirasi untuk periode ini." };
    }

    return { ok: false, error: "Gagal menyimpan jawaban RAMA. Silakan coba lagi." };
  }
}
