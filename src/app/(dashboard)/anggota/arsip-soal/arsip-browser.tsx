"use client";

import { useMemo, useState } from "react";
import { FiBookOpen, FiCalendar, FiDownload, FiSearch } from "react-icons/fi";
import { getDownloadUrl } from "@/src/lib/actions/arsip";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

type Archive = Awaited<ReturnType<typeof import("@/src/lib/actions/arsip").getArsipList>>[number];
type Course = Awaited<ReturnType<typeof import("@/src/lib/actions/arsip").getMataKuliahOptions>>[number];

export function ArsipBrowser({ arsip, mataKuliah }: { arsip: Archive[]; mataKuliah: Course[] }) {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("all");
  const years = [...new Set(arsip.map((item) => item.tahun))].sort((a, b) => b - a);
  const filtered = useMemo(() => arsip.filter((item) => {
    const text = `${item.judul} ${item.dosen ?? ""} ${item.deskripsi ?? ""}`.toLowerCase();
    return (!search || text.includes(search.toLowerCase())) && (course === "all" || item.mataKuliahId === course) && (year === "all" || String(item.tahun) === year) && (category === "all" || item.kategori === category);
  }), [arsip, search, course, year, category]);

  return (
    <section className="mt-8 space-y-6">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
        <div className="relative md:col-span-1"><FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input className="h-10 pl-9" placeholder="Cari judul atau dosen" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700" value={course} onChange={(event) => setCourse(event.target.value)}><option value="all">Semua mata kuliah</option>{mataKuliah.map((item) => <option key={item.id} value={item.id}>{item.kode} · {item.nama}</option>)}</select>
        <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700" value={year} onChange={(event) => setYear(event.target.value)}><option value="all">Semua tahun</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">Semua kategori</option><option value="SOAL">Soal</option><option value="MATERI">Materi</option></select>
      </div>
      <p className="text-sm text-slate-500">Menampilkan {filtered.length} dari {arsip.length} arsip</p>
      {filtered.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600">Tidak ada arsip yang sesuai.</p> : <div className="grid gap-5 md:grid-cols-2">{filtered.map((item) => <Card key={item.id} className="rounded-2xl border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><FiBookOpen /></span><Badge className={item.kategori === "SOAL" ? "border-0 bg-amber-100 text-amber-700" : "border-0 bg-cyan-100 text-cyan-700"}>{item.kategori === "SOAL" ? "Soal" : "Materi"}</Badge></div><h2 className="mt-5 text-lg font-semibold text-slate-900">{item.judul}</h2><p className="mt-2 text-sm text-slate-600">{item.mataKuliah.kode} · {item.mataKuliah.nama}</p><div className="mt-3 flex items-center gap-3 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><FiCalendar />{item.tahun}</span>{item.dosen && <span>· {item.dosen}</span>}</div>{item.deskripsi && <p className="mt-4 text-sm leading-6 text-slate-600">{item.deskripsi}</p>}<Button className="mt-5 w-full rounded-xl" variant="outline" onClick={async () => { const result = await getDownloadUrl(item.id); if (result) window.open(result.downloadUrl, "_blank", "noopener,noreferrer"); }}><FiDownload />Buka dokumen</Button></Card>)}</div>}
    </section>
  );
}
