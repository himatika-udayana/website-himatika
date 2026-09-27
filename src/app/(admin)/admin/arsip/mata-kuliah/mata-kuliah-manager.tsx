"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { createMataKuliah, deleteMataKuliah, updateMataKuliah, type MataKuliahInput } from "@/src/lib/actions/admin/arsip-matakuliah";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type MataKuliahRow = {
  id: string;
  kode: string;
  nama: string;
  _count: { arsip: number };
};

const emptyForm: MataKuliahInput = { kode: "", nama: "" };

export default function MataKuliahManager({ mataKuliah }: { mataKuliah: MataKuliahRow[] }) {
  const [form, setForm] = useState<MataKuliahInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = editingId
        ? await updateMataKuliah(editingId, form)
        : await createMataKuliah(form);
      setMessage(result.ok ? `Mata kuliah berhasil ${editingId ? "diperbarui" : "ditambahkan"}.` : result.error);
      if (result.ok) {
        setForm(emptyForm);
        setEditingId(null);
        router.refresh();
      }
    });
  }

  function removeCourse(course: MataKuliahRow) {
    if (!window.confirm(`Hapus mata kuliah ${course.kode} — ${course.nama}?`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteMataKuliah(course.id);
      setMessage(result.ok ? "Mata kuliah berhasil dihapus." : result.error);
      if (result.ok) router.refresh();
    });
  }

  function editCourse(course: MataKuliahRow) {
    setEditingId(course.id);
    setForm({ kode: course.kode, nama: course.nama });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={saveCourse} className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-[220px_1fr_auto] sm:items-end">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Kode mata kuliah
          <Input value={form.kode} onChange={(event) => setForm({ ...form, kode: event.target.value })} required maxLength={20} />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Nama mata kuliah
          <Input value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} required maxLength={100} />
        </label>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Mata Kuliah"}</Button>
          {editingId ? <Button type="button" variant="outline" onClick={cancelEdit}>Batal</Button> : null}
        </div>
      </form>
      {message ? <p role="status" aria-live="polite" className="text-sm text-slate-700">{message}</p> : null}
      <div className="overflow-x-auto border-y border-slate-200">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-4 py-3">Kode</th><th className="px-4 py-3">Nama mata kuliah</th><th className="px-4 py-3">Arsip terkait</th><th className="px-4 py-3">Aksi</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mataKuliah.map((course) => (
              <tr key={course.id}>
                <td className="px-4 py-4 font-semibold text-slate-900">{course.kode}</td>
                <td className="px-4 py-4 text-slate-700">{course.nama}</td>
                <td className="px-4 py-4 text-slate-700">{course._count.arsip}</td>
                <td className="px-4 py-4"><div className="flex gap-2"><Button type="button" variant="outline" disabled={isPending} onClick={() => editCourse(course)}>Edit</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeCourse(course)}>Hapus</Button></div></td>
              </tr>
            ))}
            {mataKuliah.length === 0 ? <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-500">Belum ada mata kuliah.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <Link href="/admin/arsip" className="inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900">Kelola arsip soal dan materi →</Link>
    </div>
  );
}
