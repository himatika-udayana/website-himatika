"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createSoal, deleteSoal, reorderSoal, updateSoal, type SoalInput } from "@/src/lib/actions/admin/mathquiz-soal";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type SoalRow = {
  id: string;
  quizId: string;
  urutan: number;
  tipe: "PG" | "ISIAN";
  teksSoal: string;
  poin: number;
  pilihanA: string | null;
  pilihanB: string | null;
  pilihanC: string | null;
  pilihanD: string | null;
  pilihanE: string | null;
  jawabanBenarPg: string | null;
  jawabanBenarIsian: string | null;
};

type QuestionType = SoalInput["tipe"];

function makeEmptyForm(quizId: string): SoalInput {
  return {
    quizId,
    tipe: "PG",
    teksSoal: "",
    poin: "10",
    pilihanA: "",
    pilihanB: "",
    pilihanC: "",
    pilihanD: "",
    pilihanE: "",
    jawabanBenarPg: "",
    jawabanBenarIsian: "",
  };
}

const optionFields = [
  ["A", "pilihanA"],
  ["B", "pilihanB"],
  ["C", "pilihanC"],
  ["D", "pilihanD"],
  ["E", "pilihanE"],
] as const;

export default function SoalManager({
  quizId,
  soal,
}: {
  quizId: string;
  soal: SoalRow[];
}) {
  const [form, setForm] = useState<SoalInput>(() => makeEmptyForm(quizId));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function setField<K extends keyof SoalInput>(key: K, value: SoalInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleTipeChange(tipe: QuestionType) {
    setForm((current) =>
      tipe === "PG"
        ? { ...current, tipe, jawabanBenarIsian: "" }
        : {
            ...current,
            tipe,
            pilihanA: "",
            pilihanB: "",
            pilihanC: "",
            pilihanD: "",
            pilihanE: "",
            jawabanBenarPg: "",
          },
    );
  }

  function saveQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = editingId
        ? await updateSoal(editingId, form)
        : await createSoal(form);
      setMessage(result.ok ? `Soal berhasil ${editingId ? "diperbarui" : "ditambahkan"}.` : result.error);
      if (result.ok) {
        setEditingId(null);
        setForm(makeEmptyForm(quizId));
        router.refresh();
      }
    });
  }

  function editQuestion(question: SoalRow) {
    setEditingId(question.id);
    setForm({
      quizId: question.quizId,
      tipe: question.tipe,
      teksSoal: question.teksSoal,
      poin: String(question.poin),
      pilihanA: question.pilihanA ?? "",
      pilihanB: question.pilihanB ?? "",
      pilihanC: question.pilihanC ?? "",
      pilihanD: question.pilihanD ?? "",
      pilihanE: question.pilihanE ?? "",
      jawabanBenarPg: question.jawabanBenarPg ?? "",
      jawabanBenarIsian: question.jawabanBenarIsian ?? "",
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(makeEmptyForm(quizId));
    setMessage("");
  }

  function removeQuestion(question: SoalRow) {
    if (!window.confirm(`Hapus soal nomor ${question.urutan}?`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteSoal(question.id);
      setMessage(result.ok ? "Soal berhasil dihapus." : result.error);
      if (result.ok) {
        if (editingId === question.id) cancelEdit();
        router.refresh();
      }
    });
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= soal.length) return;
    const orderedIds = soal.map(({ id }) => id);
    [orderedIds[index], orderedIds[nextIndex]] = [orderedIds[nextIndex], orderedIds[index]];
    setMessage("");
    startTransition(async () => {
      const result = await reorderSoal(quizId, orderedIds);
      setMessage(result.ok ? "Urutan soal diperbarui." : result.error);
      if (result.ok) router.refresh();
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={saveQuestion} className="space-y-5 border-y border-slate-200 py-5">
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
          <label className="space-y-2 text-sm font-medium text-slate-700">Tipe soal
            <select value={form.tipe} onChange={(event) => handleTipeChange(event.target.value as QuestionType)} className="h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm">
              <option value="PG">Pilihan ganda</option>
              <option value="ISIAN">Isian singkat</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">Poin<Input type="number" min="0" step="1" value={form.poin} onChange={(event) => setField("poin", event.target.value)} required /></label>
        </div>

        <label className="block space-y-2 text-sm font-medium text-slate-700">Teks soal
          <textarea value={form.teksSoal} onChange={(event) => setField("teksSoal", event.target.value)} rows={5} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>

        {form.tipe === "PG" ? (
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-slate-800">Pilihan jawaban dan kunci benar</legend>
            <p className="text-xs text-slate-500">Isi semua lima pilihan, lalu tandai satu huruf sebagai jawaban benar.</p>
            <div className="grid gap-3 md:grid-cols-2">
              {optionFields.map(([letter, field]) => (
                <label key={field} className="grid grid-cols-[auto_1fr] items-center gap-2 text-sm font-medium text-slate-700">
                  <input type="radio" name="jawabanBenarPg" value={letter} checked={form.jawabanBenarPg === letter} onChange={() => setField("jawabanBenarPg", letter)} aria-label={`Tandai pilihan ${letter} sebagai jawaban benar`} />
                  <span>Pilihan {letter}<Input className="mt-1" value={form[field]} onChange={(event) => setField(field, event.target.value)} required /></span>
                </label>
              ))}
            </div>
            {!form.jawabanBenarPg ? <p className="text-xs text-amber-700">Pilih radio jawaban benar.</p> : null}
          </fieldset>
        ) : (
          <label className="block space-y-2 text-sm font-medium text-slate-700">Jawaban benar
            <Input value={form.jawabanBenarIsian} onChange={(event) => setField("jawabanBenarIsian", event.target.value)} required />
            <span className="block text-xs font-normal text-slate-500">Pencocokan jawaban tidak membedakan huruf besar-kecil.</span>
          </label>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Soal"}</Button>
          {editingId ? <Button type="button" variant="outline" onClick={cancelEdit}>Batal Edit</Button> : null}
        </div>
      </form>

      {message ? <p role="status" aria-live="polite" className="text-sm text-slate-700">{message}</p> : null}

      <div className="overflow-x-auto border-y border-slate-200">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Urutan</th><th className="px-4 py-3">Tipe</th><th className="px-4 py-3">Soal</th><th className="px-4 py-3">Poin</th><th className="px-4 py-3">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {soal.map((question, index) => (
              <tr key={question.id}>
                <td className="px-4 py-4"><div className="flex items-center gap-2"><span className="font-semibold text-slate-900">{question.urutan}</span><div className="flex flex-col"><Button type="button" size="icon-xs" variant="ghost" title="Geser ke atas" aria-label={`Pindahkan soal ${question.urutan} ke atas`} disabled={isPending || index === 0} onClick={() => moveQuestion(index, -1)}>↑</Button><Button type="button" size="icon-xs" variant="ghost" title="Geser ke bawah" aria-label={`Pindahkan soal ${question.urutan} ke bawah`} disabled={isPending || index === soal.length - 1} onClick={() => moveQuestion(index, 1)}>↓</Button></div></div></td>
                <td className="px-4 py-4 text-slate-700">{question.tipe === "PG" ? "Pilihan ganda" : "Isian"}</td>
                <td className="max-w-xl px-4 py-4"><p className="line-clamp-3 whitespace-pre-wrap text-slate-800">{question.teksSoal}</p>{question.tipe === "PG" ? <p className="mt-2 text-xs text-slate-500">Kunci: {question.jawabanBenarPg}</p> : <p className="mt-2 text-xs text-slate-500">Kunci isian: {question.jawabanBenarIsian}</p>}</td>
                <td className="px-4 py-4 text-slate-700">{question.poin}</td>
                <td className="px-4 py-4"><div className="flex gap-2"><Button type="button" variant="outline" disabled={isPending} onClick={() => editQuestion(question)}>Edit</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeQuestion(question)}>Hapus</Button></div></td>
              </tr>
            ))}
            {soal.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">Belum ada soal di kuis ini.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
