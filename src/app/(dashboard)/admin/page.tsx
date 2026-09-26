import Link from "next/link";

const adminSections = [
  {
    title: "Submission RAMA",
    description: "Lihat pengisian dan jawaban aspirasi anggota secara read-only.",
    href: "/admin/rama",
  },
  {
    title: "Semester RAMA",
    description: "Buat periode dan tentukan semester aktif.",
    href: "/admin/rama/semester",
  },
  {
    title: "Kategori Aspirasi",
    description: "Kelola kategori RAMA tanpa menghapus kategori yang masih memiliki jawaban.",
    href: "/admin/rama/kategori",
  },
  {
    title: "Redirect Link",
    description: "Buat dan kelola URL pendek menuju formulir atau layanan eksternal.",
    href: "/admin/redirect-link",
  },
];

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">HIMATIKA / Admin</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard Admin</h1>
      <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group border-y border-slate-200 py-5 transition-colors hover:border-blue-500"
          >
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
              {section.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
