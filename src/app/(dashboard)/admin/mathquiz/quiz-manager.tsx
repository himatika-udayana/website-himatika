"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createQuiz, deleteQuiz, toggleQuizActive, updateQuiz, type QuizInput } from "@/src/lib/actions/admin/mathquiz-quiz";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type QuizRow = {
  id: string;
  judul: string;
  deskripsi: string | null;
  topik: string | null;
  tingkatKesulitan: string | null;
  isActive: boolean;
  _count: { soal: number; attempts: number };
};

const emptyForm: QuizInput = { judul: "", deskripsi: "", topik: "", tingkatKesulitan: "" };

export default function QuizManager({ quizzes }: { quizzes: QuizRow[] }) {
  const [form, setForm] = useState<QuizInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function saveQuiz(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = editingId ? await updateQuiz(editingId, form) : await createQuiz(form);
      setMessage(result.ok ? `Kuis berhasil ${editingId ? "diperbarui" : "dibuat"}.` : result.error);
      if (result.ok) {
        setForm(emptyForm);
        setEditingId(null);
        router.refresh();
      }
    });
  }

  function editQuiz(quiz: QuizRow) {
    setEditingId(quiz.id);
    setForm({
      judul: quiz.judul,
      deskripsi: quiz.deskripsi ?? "",
      topik: quiz.topik ?? "",
      tingkatKesulitan: quiz.tingkatKesulitan ?? "",
    });
    setMessage("");
  }

  function removeQuiz(quiz: QuizRow) {
    if (!window.confirm(`Hapus kuis “${quiz.judul}”? Kuis dengan riwayat pengerjaan tidak bisa dihapus.`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteQuiz(quiz.id);
      setMessage(result.ok ? "Kuis berhasil dihapus." : result.error);
      if (result.ok) {
        if (editingId === quiz.id) {
          setEditingId(null);
          setForm(emptyForm);
        }
        router.refresh();
      }
    });
  }

  function changeActive(id: string) {
    setMessage("");
    startTransition(async () => {
      const result = await toggleQuizActive(id);
      setMessage(result.ok ? "Status kuis berhasil diperbarui." : result.error);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={saveQuiz} className="grid gap-4 border-y border-slate-200 py-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">Judul kuis<Input value={form.judul} onChange={(event) => setForm({ ...form, judul: event.target.value })} required maxLength={200} /></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Topik <span className="font-normal text-slate-500">(opsional)</span><Input value={form.topik} onChange={(event) => setForm({ ...form, topik: event.target.value })} maxLength={100} /></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Tingkat kesulitan <span className="font-normal text-slate-500">(opsional)</span><select value={form.tingkatKesulitan} onChange={(event) => setForm({ ...form, tingkatKesulitan: event.target.value })} className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm"><option value="">Umum</option><option value="mudah">Mudah</option><option value="menengah">Menengah</option><option value="sulit">Sulit</option></select></label>
        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">Deskripsi <span className="font-normal text-slate-500">(opsional)</span><textarea value={form.deskripsi} onChange={(event) => setForm({ ...form, deskripsi: event.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
        <div className="flex gap-2 md:col-span-2"><Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Kuis"}</Button>{editingId ? <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Batal</Button> : null}</div>
      </form>
      {message ? <p role="status" aria-live="polite" className="text-sm text-slate-700">{message}</p> : null}
      <div className="overflow-x-auto border-y border-slate-200">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Kuis</th><th className="px-4 py-3">Topik</th><th className="px-4 py-3">Kesulitan</th><th className="px-4 py-3">Jumlah soal</th><th className="px-4 py-3">Riwayat</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {quizzes.map((quiz) => (
              <tr key={quiz.id}>
                <td className="px-4 py-4 font-semibold text-slate-900">{quiz.judul}</td>
                <td className="px-4 py-4 text-slate-700">{quiz.topik || "-"}</td>
                <td className="px-4 py-4 text-slate-700">{quiz.tingkatKesulitan || "Umum"}</td>
                <td className="px-4 py-4 text-slate-700">{quiz._count.soal}</td>
                <td className="px-4 py-4 text-slate-700">{quiz._count.attempts}</td>
                <td className="px-4 py-4"><span className={quiz.isActive ? "font-semibold text-emerald-700" : "text-slate-500"}>{quiz.isActive ? "Aktif" : "Nonaktif"}</span></td>
                <td className="px-4 py-4"><div className="flex flex-wrap gap-2"><Link href={`/admin/mathquiz/${quiz.id}/soal`} className="inline-flex h-8 items-center rounded-lg border border-slate-300 px-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Kelola Soal</Link><Button type="button" variant="outline" disabled={isPending} onClick={() => changeActive(quiz.id)}>{quiz.isActive ? "Nonaktifkan" : "Aktifkan"}</Button><Button type="button" variant="outline" disabled={isPending} onClick={() => editQuiz(quiz)}>Edit</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeQuiz(quiz)}>Hapus</Button></div></td>
              </tr>
            ))}
            {quizzes.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">Belum ada kuis.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
