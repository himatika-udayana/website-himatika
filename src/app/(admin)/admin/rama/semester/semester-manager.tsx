"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createSemester, setSemesterAktif } from "@/src/lib/actions/admin/rama";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

type SemesterRow = {
  id: string;
  tahunAjaran: string;
  jenis: "GANJIL" | "GENAP";
  aktif: boolean;
  _count: { submissions: number };
};

export default function SemesterManager({ semesters }: { semesters: SemesterRow[] }) {
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [jenis, setJenis] = useState<SemesterRow["jenis"]>("GANJIL");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const result = await createSemester(tahunAjaran, jenis);
      setMessage(result.ok ? "Semester berhasil ditambahkan." : result.error);
      if (result.ok) setTahunAjaran("");
    });
  }

  function activateSemester(id: string) {
    setMessage("");
    startTransition(async () => {
      const result = await setSemesterAktif(id);
      setMessage(result.ok ? "Semester aktif berhasil diperbarui." : result.error);
    });
  }

  return (
    <div className="mt-6 space-y-6">
      <form onSubmit={handleCreate} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[1fr_180px_auto] sm:items-end">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Tahun ajaran
          <Input value={tahunAjaran} onChange={(event) => setTahunAjaran(event.target.value)} placeholder="2026/2027" required pattern="\d{4}/\d{4}" aria-label="Tahun ajaran" />
        </label>
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Jenis semester
          <select value={jenis} onChange={(event) => setJenis(event.target.value as SemesterRow["jenis"])} className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm">
            <option value="GANJIL">Ganjil</option>
            <option value="GENAP">Genap</option>
          </select>
        </label>
        <Button type="submit" disabled={isPending}>{isPending ? "Menyimpan..." : "Tambah Semester"}</Button>
      </form>
      {message ? <p role="status" className="text-sm text-slate-700">{message}</p> : null}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-5 py-3">Tahun ajaran</th><th className="px-5 py-3">Jenis</th><th className="px-5 py-3">Pengisian</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Aksi</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {semesters.map((semester) => (
              <tr key={semester.id}>
                <td className="px-5 py-4 font-medium text-slate-900">{semester.tahunAjaran}</td>
                <td className="px-5 py-4 text-slate-700">{semester.jenis === "GANJIL" ? "Ganjil" : "Genap"}</td>
                <td className="px-5 py-4 text-slate-700">{semester._count.submissions}</td>
                <td className="px-5 py-4"><span className={semester.aktif ? "font-semibold text-emerald-700" : "text-slate-500"}>{semester.aktif ? "Aktif" : "Nonaktif"}</span></td>
                <td className="px-5 py-4">{semester.aktif ? <span className="text-slate-400">Semester aktif</span> : <Button type="button" variant="outline" disabled={isPending} onClick={() => activateSemester(semester.id)}>Jadikan Aktif</Button>}</td>
              </tr>
            ))}
            {semesters.length === 0 ? <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Belum ada semester.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
