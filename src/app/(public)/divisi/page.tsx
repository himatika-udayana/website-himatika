import Link from "next/link";
import { divisi } from "@/src/data/divisi";
import { DivisiRegistry } from "@/src/components/public/divisi-registry";

export default function DivisiPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/HERO.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#2563eb_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#be185d_0%,transparent_30%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-200">
            <Link href="/" className="hover:text-white">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-medium text-white">Divisi</span>
          </nav>
          <span className="inline-flex rounded-xl bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
            Division HIMATIKA
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            <span className="text-blue-400">Divisi</span> &amp; Program Kerja
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Temukan informasi lengkap mengenai struktur kepengurusan, anggota,
            dan program kerja HIMATIKA.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Registry / Bidang
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            Struktur Kepengurusan
          </h2>
          <p className="mt-3 text-slate-600">
            Pilih bidang untuk melihat anggota dan program kerja yang
            dijalankan.
          </p>
        </div>
        <DivisiRegistry divisi={divisi} />
      </section>
    </main>
  );
}
