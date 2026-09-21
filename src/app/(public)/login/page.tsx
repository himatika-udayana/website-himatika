"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "@/src/lib/auth-actions";

const initialState = { error: "" };
const benefits = [
  ["Akses layanan anggota", "Gunakan layanan organisasi dalam satu portal."],
  ["Informasi terpusat", "Temukan informasi dan program kerja HIMATIKA."],
  ["Ruang untuk berkembang", "Terhubung dengan komunitas Matematika Udayana."],
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [verificationMessage, setVerificationMessage] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "unverified") {
      setVerificationMessage("Verifikasi email kamu dulu untuk mengisi RAMA");
    }
  }, []);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-blue-900 lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative flex flex-1 flex-col justify-center px-12 py-16 xl:px-20">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">HIMATIKA</p>
          <h1 className="mt-10 max-w-md text-3xl font-semibold leading-snug text-white xl:text-4xl">Masuk dan lanjutkan berkarya bersama HIMATIKA Universitas Udayana.</h1>
          <p className="mt-4 max-w-md text-blue-100">Portal terpadu bagi anggota untuk mengakses layanan, informasi, dan program kerja organisasi.</p>
          <ul className="mt-10 space-y-5">
            {benefits.map(([title, description]) => <li key={title} className="flex items-start gap-3"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-400 text-xs font-bold text-blue-950">✓</span><div><p className="font-medium text-white">{title}</p><p className="text-sm text-blue-100">{description}</p></div></li>)}
          </ul>
        </div>
        <p className="relative px-12 pb-8 text-xs text-blue-200 xl:px-20">&copy; {new Date().getFullYear()} HIMATIKA Universitas Udayana.</p>
      </section>
      <section className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-700 lg:hidden">← Kembali ke Beranda</Link>
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Login Anggota</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Selamat Datang Kembali</h2>
          <p className="mt-2 text-sm text-slate-600">Masuk menggunakan akun HIMATIKA yang telah terdaftar.</p>
          <form action={formAction} className="mt-8 space-y-5">
            <div><label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label><input id="login-email" name="email" type="email" required autoComplete="email" placeholder="nama@email.com" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            <div><div className="mb-1.5 flex items-center justify-between"><label htmlFor="login-password" className="block text-sm font-medium text-slate-700">Kata Sandi</label><Link href="/forgot-password" className="text-xs font-medium text-blue-700 hover:underline">Lupa kata sandi?</Link></div><input id="login-password" name="password" type="password" required autoComplete="current-password" placeholder="Masukkan kata sandi" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
            {verificationMessage ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{verificationMessage}</p> : null}
            {state.error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{state.error}</p> : null}
            <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Memproses..." : "Masuk →"}</button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">Belum punya akun? <Link href="/register" className="font-medium text-blue-700 hover:underline">Daftar sekarang</Link></p>
        </div>
      </section>
    </main>
  );
}
