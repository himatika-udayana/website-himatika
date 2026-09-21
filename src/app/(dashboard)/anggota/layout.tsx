import Link from "next/link";

export default function AnggotaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-400 text-lg font-bold text-white">Σ</span><div><p className="text-base font-bold tracking-wide">HIMATIKA</p><p className="text-sm text-slate-500">Ruang Anggota</p></div></Link>
          <div className="flex items-center gap-3"><Link href="/" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-600">Beranda</Link><Link href="/anggota/rama" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">RAMA</Link><Link href="/anggota/koperasi" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-600">Koperasi</Link></div>
        </nav>
      </header>
      {children}
    </div>
  );
}
