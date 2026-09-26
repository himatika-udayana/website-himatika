import Link from "next/link";
import { notFound } from "next/navigation";
import SoalManager from "@/src/app/(dashboard)/admin/mathquiz/[quizId]/soal/soal-manager";
import { getQuizAdminDetail } from "@/src/lib/actions/admin/mathquiz-quiz";
import { getSoal } from "@/src/lib/actions/admin/mathquiz-soal";

export default async function AdminQuizQuestionsPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const [quiz, soal] = await Promise.all([
    getQuizAdminDetail(quizId),
    getSoal(quizId),
  ]);
  if (!quiz) notFound();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin/mathquiz" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Kembali ke daftar kuis</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / MathQuiz</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Soal</h1>
        <p className="mt-2 text-lg font-medium text-slate-700">{quiz.judul}</p>
        <p className="mt-2 text-sm text-slate-600">Teks soal menggunakan textarea biasa; belum ada renderer LaTeX/KaTeX/MathJax di aplikasi.</p>
      </div>
      <SoalManager quizId={quiz.id} soal={soal} />
    </main>
  );
}
