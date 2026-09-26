import Link from "next/link";
import QuizManager from "@/src/app/(dashboard)/admin/mathquiz/quiz-manager";
import { getQuizAdminList } from "@/src/lib/actions/admin/mathquiz-quiz";

export default async function AdminMathquizPage() {
  const quizzes = await getQuizAdminList();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Dashboard admin</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / MathQuiz</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Kuis</h1>
        <p className="mt-2 text-sm text-slate-600">Buat kuis dan kelola soal pilihan ganda atau isian singkat secara manual.</p>
      </div>
      <QuizManager quizzes={quizzes} />
    </main>
  );
}
