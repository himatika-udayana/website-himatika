import Link from "next/link";
import { getLeaderboard } from "@/src/lib/actions/mathquiz";

export default async function LeaderboardPage() {
  const rows = await getLeaderboard();
  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8"><Link href="/anggota/mathquiz" className="text-sm font-semibold text-blue-700 hover:underline">← Kembali ke MathQuiz</Link><h1 className="mt-5 text-3xl font-bold text-slate-900">Leaderboard</h1><div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{rows.map((row, index) => <div key={row.user.fullName + index} className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-0"><div className="flex items-center gap-4"><span className="w-7 text-center font-bold text-blue-700">{index + 1}</span><div><p className="font-semibold text-slate-900">{row.user.fullName}</p><p className="text-xs text-slate-500">{row.totalQuiz} kuis · {row.totalBenar} benar</p></div></div><p className="font-bold text-slate-900">{row.totalPoin} poin</p></div>)}{rows.length === 0 && <p className="p-8 text-center text-slate-600">Belum ada skor.</p>}</div></main>;
}