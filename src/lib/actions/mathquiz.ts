"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireVerifiedUser } from "@/src/lib/auth";

const publicQuestionSelect = {
  id: true,
  urutan: true,
  tipe: true,
  teksSoal: true,
  poin: true,
  pilihanA: true,
  pilihanB: true,
  pilihanC: true,
  pilihanD: true,
  pilihanE: true,
} as const;

export type QuizAnswerInput = { questionId: string; jawaban: string };

export async function getQuizList(topik?: string, tingkatKesulitan?: string) {
  await requireVerifiedUser();
  return prisma.quiz.findMany({
    where: {
      isActive: true,
      ...(topik ? { topik } : {}),
      ...(tingkatKesulitan ? { tingkatKesulitan } : {}),
    },
    orderBy: { judul: "asc" },
    select: {
      id: true,
      judul: true,
      deskripsi: true,
      topik: true,
      tingkatKesulitan: true,
      _count: { select: { soal: true } },
      soal: { select: { poin: true } },
    },
  });
}

export async function getQuizDetail(quizId: string) {
  await requireVerifiedUser();
  return prisma.quiz.findFirst({
    where: { id: quizId, isActive: true },
    select: {
      id: true,
      judul: true,
      deskripsi: true,
      topik: true,
      tingkatKesulitan: true,
      soal: {
        orderBy: { urutan: "asc" },
        select: publicQuestionSelect,
      },
    },
  });
}

export async function mulaiQuizAction(quizId: string) {
  const user = await requireVerifiedUser();
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, isActive: true }, select: { id: true } });

  if (!quiz) return { ok: false as const, error: "Kuis tidak ditemukan." };

  const attempt = await prisma.quizAttempt.create({
    data: { userId: user.id, quizId: quiz.id, status: "BERLANGSUNG" },
    select: { id: true, quizId: true, status: true },
  });

  return { ok: true as const, attempt };
}

async function updateUserPoint(userId: string, transaction: Prisma.TransactionClient) {
  const attempts = await transaction.quizAttempt.findMany({
    where: { userId, status: "SELESAI" },
    orderBy: { waktuSelesai: "desc" },
    select: {
      quizId: true,
      totalPoin: true,
      jawaban: { select: { isCorrect: true } },
    },
  });

  const bestByQuiz = new Map<string, (typeof attempts)[number]>();
  for (const attempt of attempts) {
    const current = bestByQuiz.get(attempt.quizId);
    if (!current || attempt.totalPoin > current.totalPoin) bestByQuiz.set(attempt.quizId, attempt);
  }

  const bestAttempts = [...bestByQuiz.values()];
  await transaction.userPoint.upsert({
    where: { userId },
    update: {
      totalPoin: bestAttempts.reduce((sum, attempt) => sum + attempt.totalPoin, 0),
      totalQuiz: bestAttempts.length,
      totalBenar: bestAttempts.reduce(
        (sum, attempt) => sum + attempt.jawaban.filter((answer) => answer.isCorrect).length,
        0,
      ),
    },
    create: {
      userId,
      totalPoin: bestAttempts.reduce((sum, attempt) => sum + attempt.totalPoin, 0),
      totalQuiz: bestAttempts.length,
      totalBenar: bestAttempts.reduce(
        (sum, attempt) => sum + attempt.jawaban.filter((answer) => answer.isCorrect).length,
        0,
      ),
    },
  });
}

export async function submitQuizAction(
  attemptId: string,
  answers: QuizAnswerInput[],
) {
  const user = await requireVerifiedUser();
  return prisma.$transaction(async (transaction) => {
    const attempt = await transaction.quizAttempt.findFirst({
      where: { id: attemptId, userId: user.id },
      include: { quiz: { include: { soal: true } } },
    });

    if (!attempt) return { ok: false as const, error: "Attempt tidak ditemukan." };
    if (attempt.status === "SELESAI") return { ok: false as const, error: "Attempt ini sudah selesai" };

    const questions = new Map(attempt.quiz.soal.map((question) => [question.id, question]));
    const evaluated = answers.map((answer) => {
      const question = questions.get(answer.questionId);
      if (!question) throw new Error(`Soal id=${answer.questionId} bukan bagian dari quiz ini.`);

      const cleaned = (answer.jawaban ?? "").trim();
      const isCorrect = question.tipe === "PG"
        ? cleaned.toUpperCase() === (question.jawabanBenarPg ?? "").toUpperCase()
        : cleaned.toLowerCase() === (question.jawabanBenarIsian ?? "").toLowerCase();
      return { question, jawabanDipilih: cleaned, isCorrect };
    });

    await Promise.all(evaluated.map((answer) => transaction.quizAnswer.upsert({
      where: { attemptId_questionId: { attemptId, questionId: answer.question.id } },
      update: { jawabanDipilih: answer.jawabanDipilih, isCorrect: answer.isCorrect },
      create: {
        attemptId,
        questionId: answer.question.id,
        jawabanDipilih: answer.jawabanDipilih,
        isCorrect: answer.isCorrect,
      },
    })));

    const jumlahBenar = evaluated.filter((answer) => answer.isCorrect).length;
    const totalPoin = evaluated.reduce((sum, answer) => sum + (answer.isCorrect ? answer.question.poin : 0), 0);
    const skor = attempt.quiz.soal.length ? Math.round((jumlahBenar / attempt.quiz.soal.length) * 100) : 0;
    const completed = await transaction.quizAttempt.update({
      where: { id: attemptId },
      data: { status: "SELESAI", skor, totalPoin, waktuSelesai: new Date() },
      select: { id: true, skor: true, totalPoin: true, status: true },
    });

    await updateUserPoint(user.id, transaction);
    return { ok: true as const, attempt: completed, jumlahBenar };
  }).catch((error: unknown) => ({
    ok: false as const,
    error: error instanceof Error ? error.message : "Gagal menyelesaikan kuis.",
  }));
}

export async function getLeaderboard(limit = 10) {
  await requireVerifiedUser();
  const safeLimit = Math.max(1, Math.min(limit, 100));
  return prisma.userPoint.findMany({
    take: safeLimit,
    orderBy: { totalPoin: "desc" },
    select: { totalPoin: true, totalQuiz: true, totalBenar: true, user: { select: { fullName: true } } },
  });
}

export async function getUserAttempts(userId: string) {
  await requireVerifiedUser();
  return prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { waktuMulai: "desc" },
    select: { id: true, quizId: true, status: true, skor: true, totalPoin: true, waktuMulai: true, waktuSelesai: true, quiz: { select: { judul: true } } },
  });
}