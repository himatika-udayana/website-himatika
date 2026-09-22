import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuizDetail } from "@/src/lib/actions/mathquiz";
import { QuizRunner } from "./quiz-runner";

export default async function MathquizDetailPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = await params;
  const quiz = await getQuizDetail(quizId);
  if (!quiz) notFound();
  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8"><Link href="/anggota/mathquiz" className="text-sm font-semibold text-blue-700 hover:underline">← Semua kuis</Link><div className="mt-6"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{quiz.topik ?? "MathQuiz"}</p><h1 className="mt-2 text-3xl font-bold text-slate-900">{quiz.judul}</h1><p className="mt-2 text-slate-600">{quiz.deskripsi}</p></div><QuizRunner quiz={quiz} /></main>;
}