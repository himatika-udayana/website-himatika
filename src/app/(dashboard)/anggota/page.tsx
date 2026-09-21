import Link from "next/link";
import { requireUser } from "@/src/lib/auth";

export default async function AnggotaPage() {
  const user = await requireUser();
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Area Anggota</p><h1 className="mt-3 text-3xl font-bold text-slate-900">Selamat datang, {user.fullName}</h1><p className="mt-3 text-slate-600">Pilih layanan anggota yang ingin Anda buka.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/anggota/rama" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">RAMA</Link><Link href="/anggota/koperasi" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700">Koperasi</Link></div></div></main>;
}
