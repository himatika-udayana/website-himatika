"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { beranda } from "@/src/data/beranda";
import { portalMenu } from "@/src/data/portal-menu";
import { logoutAction } from "@/src/lib/auth-actions";

const getNavItems = (isLoggedIn: boolean) => [
  { title: "Beranda", href: "/" },
  ...portalMenu.filter(({ requiresLogin }) => isLoggedIn || !requiresLogin),
];

export function PublicShell({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicNavbar isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </div>
  );
}

export function PublicNavbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const navItems = getNavItems(isLoggedIn);

  return (
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
          {navItems.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-600 transition-colors hover:text-blue-600"
            >
              {title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <LogoutForm
              className="hidden sm:block"
              buttonClassName="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-60"
            />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-blue-600 hover:text-blue-600 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 sm:inline-flex"
              >
                Register
              </Link>
            </>
          )}
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
            {navItems.map(({ title, href }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {title}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              {isLoggedIn ? (
                <LogoutForm
                  className="flex-1"
                  buttonClassName="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white disabled:opacity-60"
                />
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function LogoutForm({
  className,
  buttonClassName,
}: {
  className: string;
  buttonClassName: string;
}) {
  const [state, formAction, pending] = useActionState(logoutAction, {});

  return (
    <form action={formAction} className={className}>
      <button type="submit" disabled={pending} className={buttonClassName}>
        {pending ? "Memproses..." : "Logout"}
      </button>
      {state.error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

export function Footer() {
  const navItems = getNavItems(false);
  const websiteUrl = /^https?:\/\//i.test(beranda.kontak.website)
    ? beranda.kontak.website
    : `https://${beranda.kontak.website}`;
  const instagramUsername = beranda.kontak.instagram.replace(/^@/, "");
  const tiktokUsername = beranda.kontak.tiktok.replace(/^@/, "");
  const tiktokUrl = `https://tiktok.com/@${tiktokUsername}`;

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
          <p className="mt-5 max-w-prose text-sm leading-7 text-slate-400">
            {beranda.visi}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Navigasi</h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            {navItems.map(({ title, href }) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white">
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Kontak</h3>
          <ul className="mt-5 space-y-4 text-sm text-slate-400">
            <li>{beranda.kontak.email}</li>
            <li>{beranda.kontak.alamat}</li>
            <li>{beranda.kontak.telepon}</li>
            <li>
              <a
                href={`https://instagram.com/${instagramUsername}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 hover:text-white"
              >
                {beranda.kontak.instagram}
              </a>
            </li>
            <li>
              <a href={beranda.kontak.spotifyUrl} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-white">
                {beranda.kontak.spotify}
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@HimatikaUdayana" target="_blank" rel="noreferrer" className="text-blue-300 hover:text-white">
                {beranda.kontak.youtube}
              </a>
            </li>
            <li>
              <a href={tiktokUrl} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-white">
                {beranda.kontak.tiktok}
              </a>
            </li>
            <li>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-300 hover:text-white"
              >
                {beranda.kontak.website}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500">
        Copyright © {beranda.namaWebsite}.
      </div>
    </footer>
  );
}
