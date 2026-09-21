"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Send,
  User,
  UserPlus,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { authBenefits } from "@/src/data/auth";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resetPasswordAction,
} from "@/src/lib/auth-actions";

const initialState = { error: "" };

function BrandPanel({ register = false }: { register?: boolean }) {
  return (
    <section className="relative hidden overflow-hidden bg-blue-900 lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative flex flex-1 flex-col justify-center px-12 py-16 xl:px-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
          HIMATIKA
        </p>
        <h1 className="mt-10 max-w-md text-3xl font-semibold leading-snug text-white xl:text-4xl">
          {register
            ? "Bergabung dan jadi bagian dari keluarga besar HIMATIKA Universitas Udayana."
            : "Masuk dan lanjutkan berkarya bersama HIMATIKA Universitas Udayana."}
        </h1>
        <p className="mt-4 max-w-md text-blue-100">
          {register
            ? "Buat akun untuk mengakses seluruh layanan dan informasi organisasi mahasiswa Matematika."
            : "Portal terpadu bagi anggota untuk mengakses layanan, informasi, dan program kerja organisasi."}
        </p>
        <ul className="mt-10 space-y-5">
          {authBenefits.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-300" />
              <div>
                <p className="font-medium text-white">{benefit.title}</p>
                <p className="text-sm text-blue-100">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="relative px-12 pb-8 text-xs text-blue-200 xl:px-20">
        &copy; {new Date().getFullYear()} HIMATIKA Universitas Udayana. Seluruh
        hak cipta dilindungi.
      </p>
    </section>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  return message ? (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
      {message}
    </p>
  ) : null;
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <BrandPanel />
      <section className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Login Anggota
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Masuk menggunakan akun HIMATIKA yang telah terdaftar.
          </p>
          <form action={formAction} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="pl-9"
                />
              </div>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-1.5 flex items-center justify-between">
                Kata Sandi
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue-700 hover:underline"
                >
                  Lupa kata sandi?
                </Link>
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <Checkbox name="remember" />
              Ingat saya di perangkat ini
            </label>
            <ErrorMessage message={state.error} />
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={pending}
            >
              {pending ? "Memproses..." : "Masuk →"}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-700 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <BrandPanel register />
      <section className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
            Daftar Akun
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Lengkapi data berikut untuk mendaftar sebagai anggota HIMATIKA.
          </p>
          <form action={formAction} className="mt-8 space-y-5">
            {[
              ["fullName", "Nama Lengkap", "Nama sesuai KTM", User],
              ["nim", "NIM", "Contoh: 2208541001", User],
              ["angkatan", "Angkatan", "Contoh: 2025", User],
              ["email", "Email", "nama@student.unud.ac.id", Mail],
            ].map(([name, label, placeholder, Icon]) => (
              <label
                key={String(name)}
                className="block text-sm font-medium text-slate-700"
              >
                {String(label)}
                <div className="relative mt-1.5">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    name={String(name)}
                    type={name === "email" ? "email" : "text"}
                    required
                    maxLength={
                      name === "nim" ? 10 : name === "angkatan" ? 4 : undefined
                    }
                    placeholder={String(placeholder)}
                    className="pl-9"
                  />
                </div>
              </label>
            ))}
            <PasswordField
              name="password"
              label="Kata Sandi"
              placeholder="Minimal 8 karakter"
              visible={showPassword}
              toggle={() => setShowPassword((value) => !value)}
            />
            <PasswordField
              name="confirmPassword"
              label="Konfirmasi Kata Sandi"
              placeholder="Ulangi kata sandi"
              visible={showConfirm}
              toggle={() => setShowConfirm((value) => !value)}
            />
            <label className="flex items-start gap-2 text-sm text-slate-600">
              <Checkbox name="agreeToTerms" className="mt-0.5" />
              <span>
                Saya menyetujui{" "}
                <span className="font-medium text-blue-700">
                  syarat dan ketentuan
                </span>{" "}
                HIMATIKA
              </span>
            </label>
            <ErrorMessage message={state.error} />
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={pending}
            >
              {pending ? "Mendaftar..." : "Daftar sekarang →"}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function PasswordField({
  name,
  label,
  placeholder,
  visible,
  toggle,
}: {
  name: string;
  label: string;
  placeholder: string;
  visible: boolean;
  toggle: () => void;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="relative mt-1.5">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={8}
          placeholder={placeholder}
          className="pl-9 pr-10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label={
            visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          }
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
}

export function ForgotForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, {});
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Login
        </Link>
        <div className="mt-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Mail className="h-5 w-5" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Pemulihan Akun
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Lupa kata sandi?
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Masukkan email yang terdaftar. Kami akan mengirimkan link untuk
            membuat kata sandi baru.
          </p>
        </div>
        <form action={formAction} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
                className="pl-9"
              />
            </div>
          </label>
          <ErrorMessage message={state.error} />
          {state.success ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
              {state.success}
            </p>
          ) : null}
          <Button
            type="submit"
            className="h-10 w-full rounded-xl"
            disabled={pending}
          >
            {pending ? "Mengirim..." : "Kirim link reset"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          Ingat kata sandi Anda?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-700 hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      </section>
    </main>
  );
}

export function ResetForm() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, {});
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Login
        </Link>
        <div className="mt-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
            <Lock className="h-6 w-6" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            Password Baru
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Ubah kata sandi
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Buat kata sandi baru untuk mengamankan akun HIMATIKA Anda.
          </p>
        </div>
        <form action={formAction} className="mt-8 space-y-5">
          <PasswordField
            name="password"
            label="Kata sandi baru"
            placeholder="Masukkan kata sandi baru"
            visible={showPassword}
            toggle={() => setShowPassword((value) => !value)}
          />
          <PasswordField
            name="confirmPassword"
            label="Konfirmasi kata sandi"
            placeholder="Ulangi kata sandi baru"
            visible={showPassword}
            toggle={() => setShowPassword((value) => !value)}
          />
          <ErrorMessage message={state.error} />
          <Button
            type="submit"
            className="h-10 w-full rounded-xl"
            disabled={pending}
          >
            {pending ? "Menyimpan..." : "Simpan kata sandi"}
          </Button>
        </form>
      </section>
    </main>
  );
}
