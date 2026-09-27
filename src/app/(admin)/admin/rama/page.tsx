import Link from "next/link";
import { getSemesterList, getSubmissionList } from "@/src/lib/actions/admin/rama";

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Makassar",
});

export default async function AdminRamaPage({
  searchParams,
}: {
  searchParams: Promise<{ semesterId?: string }>;
}) {
  const params = await searchParams;
  const [semesters, submissions] = await Promise.all([
    getSemesterList(),
    getSubmissionList(params.semesterId),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / RAMA</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Pengisian Aspirasi</h1>
          <p className="mt-2 text-sm text-slate-600">Daftar ini hanya untuk melihat submission dan jawaban aspirasi.</p>
        </div>
        <nav aria-label="Kelola RAMA" className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rama/semester" className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">Semester</Link>
          <Link href="/admin/rama/kategori" className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">Kategori</Link>
        </nav>
      </div>

      <form className="mt-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Filter semester
          <select name="semesterId" defaultValue={params.semesterId ?? ""} className="h-9 min-w-56 rounded-lg border border-slate-300 bg-white px-3">
            <option value="">Semua semester</option>
            {semesters.map((semester) => <option key={semester.id} value={semester.id}>{semester.tahunAjaran} · {semester.jenis === "GANJIL" ? "Ganjil" : "Genap"}</option>)}
          </select>
        </label>
        <button type="submit" className="h-9 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800">Terapkan</button>
        {params.semesterId ? <Link href="/admin/rama" className="pb-2 text-sm font-medium text-slate-600 hover:text-blue-700">Reset</Link> : null}
      </form>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="px-5 py-3">Anggota</th><th className="px-5 py-3">NIM</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Semester</th><th className="px-5 py-3">Dikirim</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Detail</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td className="px-5 py-4 font-medium text-slate-900">{submission.user.fullName}</td>
                <td className="px-5 py-4 text-slate-700">{submission.user.nim ?? "-"}</td>
                <td className="px-5 py-4 text-slate-700">{submission.user.email}</td>
                <td className="px-5 py-4 text-slate-700">{submission.semester.tahunAjaran} · {submission.semester.jenis === "GANJIL" ? "Ganjil" : "Genap"}</td>
                <td className="px-5 py-4 text-slate-700">{dateFormat.format(submission.tanggalSubmit)}</td>
                <td className="px-5 py-4 text-slate-700">{submission.status}</td>
                <td className="px-5 py-4"><Link href={`/admin/rama/${submission.id}`} className="font-semibold text-blue-700 hover:text-blue-900">Lihat jawaban</Link></td>
              </tr>
            ))}
            {submissions.length === 0 ? <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">Belum ada submission untuk filter ini.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">{submissions.length} submission ditampilkan.</p>
    </main>
  );
}
