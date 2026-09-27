"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { deleteArsip, updateArsip, type ArsipInput } from "@/src/lib/actions/admin/arsip-soal";
import { createArsip } from "@/src/lib/actions/admin/arsip-soal";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type CourseOption = { id: string; kode: string; nama: string };
type ArchiveRow = {
  id: string;
  judul: string;
  deskripsi: string | null;
  mataKuliahId: string;
  mataKuliah: CourseOption;
  tahun: number;
  semester: "GANJIL" | "GENAP";
  kategori: "SOAL" | "MATERI";
  dosen: string | null;
  linkGdrive: string;
  uploader: { fullName: string } | null;
  createdAt: Date;
};

const currentYear = new Date().getFullYear();
const emptyForm: ArsipInput = {
  judul: "",
  deskripsi: "",
  mataKuliahId: "",
  tahun: String(currentYear),
  semester: "GANJIL",
  kategori: "SOAL",
  dosen: "",
  linkGdrive: "",
};

const dateFormat = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Makassar" });

export default function ArsipManager({
  arsip,
  mataKuliah,
  filters,
}: {
  arsip: ArchiveRow[];
  mataKuliah: CourseOption[];
  filters: { mataKuliahId: string; tahun: string; semester: string; kategori: string };
}) {
  const [form, setForm] = useState<ArsipInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function saveArchive(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = editingId ? await updateArsip(editingId, form) : await createArsip(form);
      setMessage(result.ok ? `Arsip berhasil ${editingId ? "diperbarui" : "ditambahkan"}.` : result.error);
      if (result.ok) {
        setEditingId(null);
        setForm(emptyForm);
        router.refresh();
      }
    });
  }

  function editArchive(item: ArchiveRow) {
    setEditingId(item.id);
    setForm({
      judul: item.judul,
      deskripsi: item.deskripsi ?? "",
      mataKuliahId: item.mataKuliahId,
      tahun: String(item.tahun),
      semester: item.semester,
      kategori: item.kategori,
      dosen: item.dosen ?? "",
      linkGdrive: item.linkGdrive,
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  }

  function removeArchive(item: ArchiveRow) {
    if (!window.confirm(`Hapus arsip “${item.judul}”?`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteArsip(item.id);
      setMessage(result.ok ? "Arsip berhasil dihapus." : result.error);
      if (result.ok) {
        if (editingId === item.id) cancelEdit();
        router.refresh();
      }
    });
  }

  function setField<K extends keyof ArsipInput>(key: K, value: ArsipInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mt-6 space-y-6">
      <form method="get" className="grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1 text-xs font-medium text-slate-600">Mata kuliah<select name="mataKuliahId" defaultValue={filters.mataKuliahId} className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"><option value="">Semua mata kuliah</option>{mataKuliah.map((course) => <option key={course.id} value={course.id}>{course.kode} · {course.nama}</option>)}</select></label>
        <label className="grid gap-1 text-xs font-medium text-slate-600">Tahun<Input name="tahun" type="number" min="1" placeholder="Semua tahun" defaultValue={filters.tahun} /></label>
        <label className="grid gap-1 text-xs font-medium text-slate-600">Semester<select name="semester" defaultValue={filters.semester} className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"><option value="">Semua semester</option><option value="GANJIL">Ganjil</option><option value="GENAP">Genap</option></select></label>
        <label className="grid gap-1 text-xs font-medium text-slate-600">Kategori<select name="kategori" defaultValue={filters.kategori} className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm"><option value="">Semua kategori</option><option value="SOAL">Arsip Soal</option><option value="MATERI">Materi</option></select></label>
        <div className="flex items-end gap-2"><Button type="submit" variant="outline">Terapkan</Button><Button type="button" variant="ghost" onClick={() => router.push("/admin/arsip")}>Reset</Button></div>
      </form>

      <form onSubmit={saveArchive} className="grid gap-4 border-y border-slate-200 py-5 md:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2 text-sm font-medium text-slate-700">Judul<Input value={form.judul} onChange={(event) => setField("judul", event.target.value)} required maxLength={200} /></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Mata kuliah<select value={form.mataKuliahId} onChange={(event) => setField("mataKuliahId", event.target.value)} required className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm"><option value="">Pilih mata kuliah</option>{mataKuliah.map((course) => <option key={course.id} value={course.id}>{course.kode} · {course.nama}</option>)}</select></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">URL Google Drive<Input type="url" value={form.linkGdrive} onChange={(event) => setField("linkGdrive", event.target.value)} required placeholder="https://drive.google.com/..." /></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Tahun<Input type="number" min="1" step="1" value={form.tahun} onChange={(event) => setField("tahun", event.target.value)} required /></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Semester<select value={form.semester} onChange={(event) => setField("semester", event.target.value as ArsipInput["semester"])} className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm"><option value="GANJIL">Ganjil</option><option value="GENAP">Genap</option></select></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Kategori<select value={form.kategori} onChange={(event) => setField("kategori", event.target.value as ArsipInput["kategori"])} className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm"><option value="SOAL">Arsip Soal</option><option value="MATERI">Materi Perkuliahan</option></select></label>
        <label className="space-y-2 text-sm font-medium text-slate-700">Dosen <span className="font-normal text-slate-500">(opsional)</span><Input value={form.dosen} onChange={(event) => setField("dosen", event.target.value)} maxLength={100} /></label>
        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">Deskripsi <span className="font-normal text-slate-500">(opsional)</span><textarea value={form.deskripsi} onChange={(event) => setField("deskripsi", event.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
        <div className="flex items-end gap-2"><Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Arsip"}</Button>{editingId ? <Button type="button" variant="outline" onClick={cancelEdit}>Batal</Button> : null}</div>
      </form>
      {message ? <p role="status" aria-live="polite" className="text-sm text-slate-700">{message}</p> : null}

      <div className="overflow-x-auto border-y border-slate-200">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Arsip</th><th className="px-4 py-3">Mata kuliah</th><th className="px-4 py-3">Tahun / semester</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Pengunggah / tanggal</th><th className="px-4 py-3">Aksi</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {arsip.map((item) => (
              <tr key={item.id}>
                <td className="max-w-sm px-4 py-4"><p className="font-semibold text-slate-900">{item.judul}</p>{item.deskripsi ? <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.deskripsi}</p> : null}<a href={item.linkGdrive} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-blue-700 underline">Buka Google Drive</a></td>
                <td className="px-4 py-4 text-slate-700">{item.mataKuliah.kode} · {item.mataKuliah.nama}{item.dosen ? <span className="mt-1 block text-xs text-slate-500">{item.dosen}</span> : null}</td>
                <td className="px-4 py-4 text-slate-700">{item.tahun} · {item.semester === "GANJIL" ? "Ganjil" : "Genap"}</td>
                <td className="px-4 py-4 text-slate-700">{item.kategori === "SOAL" ? "Arsip Soal" : "Materi"}</td>
                <td className="px-4 py-4 text-slate-600">{item.uploader?.fullName ?? "-"}<span className="mt-1 block text-xs">{dateFormat.format(item.createdAt)}</span></td>
                <td className="px-4 py-4"><div className="flex gap-2"><Button type="button" variant="outline" disabled={isPending} onClick={() => editArchive(item)}>Edit</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeArchive(item)}>Hapus</Button></div></td>
              </tr>
            ))}
            {arsip.length === 0 ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">Belum ada arsip untuk filter ini.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
