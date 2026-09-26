import Link from "next/link";
import { GiAbacus } from "react-icons/gi";
import { FiArrowRight, FiAward } from "react-icons/fi";
import { getQuizList } from "@/src/lib/actions/mathquiz";

export default async function MathquizPage() {
  const quizzes = await getQuizList();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-700 p-7 text-white shadow-lg sm:p-10">
        <div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-cyan-200"><GiAbacus className="h-8 w-8" /></span><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">MathQuiz</p><h1 className="mt-1 text-3xl font-bold">Uji kemampuanmu</h1></div></div>
        <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100">Pilih kuis, jawab dengan tenang, dan lihat perkembanganmu.</p>
        <Link href="/anggota/mathquiz/leaderboard" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-800 hover:bg-cyan-50"><FiAward />Leaderboard</Link>
      </div>
      <div className="hidden items-end justify-between gap-4">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">MathQuiz</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Uji kemampuanmu</h1><p className="mt-2 text-slate-600">Pilih kuis, jawab dengan tenang, dan lihat perkembanganmu.</p></div>
        <Link href="/anggota/mathquiz/leaderboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700">Leaderboard</Link>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} href={`/anggota/mathquiz/${quiz.id}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
            <div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{quiz.tingkatKesulitan ?? "Umum"}</span><span className="text-xs text-slate-500">{quiz._count.soal} soal</span></div>
            <h2 className="mt-5 text-xl font-semibold text-slate-900">{quiz.judul}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{quiz.deskripsi ?? "Kuis interaktif HIMATIKA."}</p>
            <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">Mulai kuis <FiArrowRight /></p>
          </Link>
        ))}
      </div>
      {quizzes.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">Belum ada kuis aktif.</div>}
    </main>
  );
}