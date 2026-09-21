"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/src/lib/auth-actions";

const initialState = { error: "" };
const benefits = [
  ["Akses layanan anggota", "Gunakan layanan organisasi dalam satu portal."],
  ["Informasi terpusat", "Temukan informasi dan program kerja HIMATIKA."],
  ["Ruang untuk berkembang", "Terhubung dengan komunitas Matematika Udayana."],
];

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-blue-900 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative flex flex-1 flex-col justify-center px-12 py-16 xl:px-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">HIMATIKA</p>
          <h1 className="mt-10 max-w-md text-3xl font-semibold leading-snug text-white xl:text-4xl">Bergabung dan jadi bagian dari keluarga besar HIMATIKA Universitas Udayana.</h1>
          <p className="mt-4 max-w-md text-blue-100">Buat akun untuk mengakses seluruh layanan dan informasi organisasi mahasiswa Matematika.</p>
          <ul className="mt-10 space-y-5">{benefits.map(([title, description]) => <li key={title} className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-400 text-xs font-bold text-blue-950">✓</span><div><p className="font-medium text-white">{title}</p><p className="text-sm text-blue-100">{description}</p></div></li>)}</ul>
        </div>
        <p className="relative px-12 pb-8 text-xs text-blue-200 xl:px-20">&copy; {new Date().getFullYear()} HIMATIKA Universitas Udayana.</p>
      </section>
      <section className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-700 lg:hidden">← Kembali ke Beranda</Link>
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Daftar Akun</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-slate-600">Lengkapi data berikut untuk mendaftar sebagai anggota HIMATIKA.</p>
          <form action={formAction} className="mt-8 space-y-5">
            <div><label htmlFor="register-fullname" className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label><input id="register-fullname" name="fullName" required placeholder="Nama sesuai KTM" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><label htmlFor="register-studentid" className="mb-1.5 block text-sm font-medium text-slate-700">NIM</label><input id="register-studentid" name="nim" required maxLength={10} placeholder="Contoh: 2208541001" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><label htmlFor="register-batch" className="mb-1.5 block text-sm font-medium text-slate-700">Angkatan</label><input id="register-batch" name="angkatan" required maxLength={4} placeholder="Contoh: 2025" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label><input id="register-email" name="email" type="email" required placeholder="nama@student.unud.ac.id" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-slate-700">Kata Sandi</label><input id="register-password" name="password" type="password" required placeholder="Minimal 8 karakter" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            {state.error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p> : null}
            <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Mendaftar..." : "Daftar sekarang →"}</button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">Sudah punya akun? <Link href="/login" className="font-medium text-blue-700 hover:underline">Login</Link></p>
        </div>
      </section>
    </main>
  );
}
