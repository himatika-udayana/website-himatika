"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const navItems = [
  ["Beranda", "/"],
  ["Tentang Kami", "/tentang-kami"],
  ["Divisi", "/divisi"],
  ["Blog", "/blog"],
] as const;

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/LOGO.png"
              alt="Logo HIMATIKA"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-base font-bold tracking-wide text-slate-900">
                HIMATIKA
              </p>
              <p className="text-sm text-slate-500">Universitas Udayana</p>
            </div>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-slate-600 transition-colors hover:text-blue-600"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-blue-600 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-flex"
            >
              Register
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
              aria-label={isMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {isMenuOpen ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="mx-auto max-w-7xl space-y-1">
              {navItems.map(([label, href]) => (
                <Link key={href} href={href} onClick={closeMenu} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                  {label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/login" onClick={closeMenu} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700">Login</Link>
                <Link href="/register" onClick={closeMenu} className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white">Register</Link>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      {children}
      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/images/LOGO.png"
              alt="Logo HIMATIKA"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">HIMATIKA</p>
              <p className="text-sm text-slate-400">Universitas Udayana</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            Komunitas matematis yang menghubungkan pembelajaran, kepemimpinan,
            dan pengabdian untuk kemajuan mahasiswa.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Navigasi</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            {navItems.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Kontak</h3>
          <ul className="mt-5 space-y-4 text-sm text-slate-400">
            <li>himatika@unud.ac.id</li>
            <li>Jimbaran, Bali, Indonesia</li>
            <li>
              <a
                href="https://himatika.unud.ac.id"
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 hover:text-white"
              >
                himatika.unud.ac.id
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
        Copyright © HIMATIKA Universitas Udayana.
      </div>
    </footer>
  );
}
