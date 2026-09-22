import { getArsipList, getMataKuliahOptions } from "@/src/lib/actions/arsip";
import { ArsipBrowser } from "./arsip-browser";

export default async function ArsipSoalPage() {
  const [arsip, mataKuliah] = await Promise.all([getArsipList(), getMataKuliahOptions()]);
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Ruang Belajar</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Arsip Soal</h1><p className="mt-2 text-slate-600">Temukan soal ujian dan materi perkuliahan berdasarkan kebutuhanmu.</p><ArsipBrowser arsip={arsip} mataKuliah={mataKuliah} /></main>;
}