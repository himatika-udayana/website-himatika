import Link from "next/link";
import { getQuizList } from "@/src/lib/actions/mathquiz";

export default async function MathquizPage() {
  const quizzes = await getQuizList();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">MathQuiz</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Uji kemampuanmu</h1><p className="mt-2 text-slate-600">Pilih kuis, jawab dengan tenang, dan lihat perkembanganmu.</p></div>
        <Link href="/anggota/mathquiz/leaderboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700">Leaderboard</Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} href={`/anggota/mathquiz/${quiz.id}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{quiz.tingkatKesulitan ?? "Umum"}</span><span className="text-xs text-slate-500">{quiz._count.soal} soal</span></div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">{quiz.judul}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{quiz.deskripsi ?? "Kuis interaktif HIMATIKA."}</p>
            <p className="mt-5 text-sm font-semibold text-blue-700">Mulai kuis →</p>
          </Link>
        ))}
      </div>
      {quizzes.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">Belum ada kuis aktif.</div>}
    </main>
  );
}