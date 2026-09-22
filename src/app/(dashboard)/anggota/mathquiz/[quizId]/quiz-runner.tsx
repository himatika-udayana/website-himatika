"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Progress } from "@/src/components/ui/progress";
import { mulaiQuizAction, submitQuizAction, type QuizAnswerInput } from "@/src/lib/actions/mathquiz";

type Quiz = NonNullable<Awaited<ReturnType<typeof import("@/src/lib/actions/mathquiz").getQuizDetail>>>;

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    skor: number;
    totalPoin: number;
    jumlahBenar: number;
  } | null>(null);
  const answered = Object.values(answers).filter(Boolean).length;

  async function start() {
    setPending(true); setError("");
    const result = await mulaiQuizAction(quiz.id);
    if (result.ok) setAttemptId(result.attempt.id); else setError(result.error);
    setPending(false);
  }

  async function submit() {
    if (!attemptId) return;
    setPending(true); setError("");
    const payload: QuizAnswerInput[] = quiz.soal.map((question) => ({ questionId: question.id, jawaban: answers[question.id] ?? "" }));
    const result = await submitQuizAction(attemptId, payload);
    if (result.ok) {
      setResult({
        skor: result.attempt.skor,
        totalPoin: result.attempt.totalPoin,
        jumlahBenar: result.jumlahBenar,
      });
    } else setError(result.error);
    setPending(false);
  }

  if (result) return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Hasil Kuis</p><p className="mt-4 text-6xl font-bold text-slate-900">{result.skor}<span className="text-2xl text-slate-500">%</span></p><p className="mt-3 text-slate-600">{result.jumlahBenar} dari {quiz.soal.length} soal benar · {result.totalPoin} poin</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/anggota/mathquiz" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700">Kembali ke Daftar Kuis</Link><Button onClick={() => { setResult(null); setAttemptId(null); setAnswers({}); setError(""); }}>Coba Lagi</Button></div></section>;

  if (!attemptId) return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-600">{quiz.soal.length} soal · Pilih jawaban terbaik untuk setiap pertanyaan.</p>{error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<Button className="mt-6" onClick={start} disabled={pending}>{pending ? "Menyiapkan..." : "Mulai kuis"}</Button></section>;

  return <section className="mt-8 space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between text-sm font-medium text-slate-600"><span>Progress</span><span>{answered}/{quiz.soal.length} terisi</span></div><Progress className="mt-3" value={(answered / quiz.soal.length) * 100} /></div>{quiz.soal.map((question, index) => <div key={question.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Soal {index + 1} · {question.poin} poin</p><h2 className="mt-3 font-semibold leading-7 text-slate-900">{question.teksSoal}</h2>{question.tipe === "PG" ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{["A", "B", "C", "D", "E"].map((option) => { const text = question[`pilihan${option}` as "pilihanA" | "pilihanB" | "pilihanC" | "pilihanD" | "pilihanE"]; return <label key={option} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${answers[question.id] === option ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}><input type="radio" name={question.id} value={option} checked={answers[question.id] === option} onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))} /> <span><b>{option}.</b> {text}</span></label>; })}</div> : <Input className="mt-5" value={answers[question.id] ?? ""} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))} placeholder="Tulis jawaban singkat" />}</div>)}{error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<Button onClick={submit} disabled={pending}>{pending ? "Menilai..." : "Kirim jawaban"}</Button></section>;
}