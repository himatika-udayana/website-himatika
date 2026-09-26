"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createKategori, deleteKategori, updateKategori } from "@/src/lib/actions/admin/rama";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type CategoryRow = {
  id: string;
  urutan: number;
  namaKategori: string;
  deskripsi: string | null;
  _count: { aspirasi: number };
};

type CategoryForm = {
  id: string | null;
  urutan: string;
  namaKategori: string;
  deskripsi: string;
};

const emptyForm: CategoryForm = { id: null, urutan: "", namaKategori: "", deskripsi: "" };

export default function KategoriManager({ categories }: { categories: CategoryRow[] }) {
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const data = {
      urutan: Number(form.urutan),
      namaKategori: form.namaKategori,
      deskripsi: form.deskripsi,
    };
    startTransition(async () => {
      const result = form.id
        ? await updateKategori(form.id, data)
        : await createKategori(data.urutan, data.namaKategori, data.deskripsi);
      setMessage(result.ok ? `Kategori berhasil ${form.id ? "diperbarui" : "ditambahkan"}.` : result.error);
      if (result.ok) setForm(emptyForm);
    });
  }

  function removeCategory(category: CategoryRow) {
    if (!window.confirm(`Hapus kategori “${category.namaKategori}”?`)) return;
    setMessage("");
    startTransition(async () => {
      const result = await deleteKategori(category.id);
      setMessage(result.ok ? "Kategori berhasil dihapus." : result.error);
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={saveCategory} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Urutan
          <Input type="number" min="1" step="1" value={form.urutan} onChange={(event) => setForm({ ...form, urutan: event.target.value })} required />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Nama kategori
          <Input value={form.namaKategori} onChange={(event) => setForm({ ...form, namaKategori: event.target.value })} required maxLength={100} />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700 sm:col-span-2">
          Deskripsi
          <textarea value={form.deskripsi} onChange={(event) => setForm({ ...form, deskripsi: event.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah Kategori"}</Button>
          {form.id ? <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>Batal Edit</Button> : null}
        </div>
      </form>
      {message ? <p role="status" className="text-sm text-slate-700">{message}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-5 py-3">Urutan</th><th className="px-5 py-3">Kategori</th><th className="px-5 py-3">Jawaban tersimpan</th><th className="px-5 py-3">Deskripsi</th><th className="px-5 py-3">Aksi</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-5 py-4 font-medium text-slate-900">{category.urutan}</td>
                <td className="px-5 py-4 font-medium text-slate-900">{category.namaKategori}</td>
                <td className="px-5 py-4 text-slate-700">{category._count.aspirasi}</td>
                <td className="max-w-sm px-5 py-4 text-slate-600">{category.deskripsi || "-"}</td>
                <td className="px-5 py-4"><div className="flex gap-2"><Button type="button" variant="outline" onClick={() => setForm({ id: category.id, urutan: String(category.urutan), namaKategori: category.namaKategori, deskripsi: category.deskripsi ?? "" })}>Edit</Button><Button type="button" variant="destructive" disabled={isPending} onClick={() => removeCategory(category)}>Hapus</Button></div></td>
              </tr>
            ))}
            {categories.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Belum ada kategori.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
