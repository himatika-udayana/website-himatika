import Link from "next/link";
import SemesterManager from "@/src/app/(dashboard)/admin/rama/semester/semester-manager";
import { getSemesterList } from "@/src/lib/actions/admin/rama";

export default async function AdminRamaSemesterPage() {
  const semesters = await getSemesterList();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin/rama" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Kembali ke RAMA</Link>
      <div className="mt-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / RAMA</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Semester</h1>
        <p className="mt-2 text-sm text-slate-600">Hanya satu semester dapat aktif pada satu waktu.</p>
      </div>
      <SemesterManager semesters={semesters} />
    </main>
  );
}
