import { getKategoriAspirasi, getSemesterAktif, getSubmissionUser } from "@/src/lib/actions/rama";
import { requireVerifiedUser } from "@/src/lib/auth";
import RamaForm from "./rama-form";

export default async function RamaPage() {
  const user = await requireVerifiedUser();
  const semester = await getSemesterAktif();

  if (!semester) {
    return (
      <main className="overflow-x-hidden bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">RAMA</p>
          <h1 className="mt-2 text-2xl font-semibold">Belum ada periode RAMA yang dibuka.</h1>
          <p className="mt-2 text-sm text-amber-800">Silakan kembali lagi ketika periode aspirasi sudah diaktifkan.</p>
        </div>
      </main>
    );
  }

  const submission = await getSubmissionUser(user.id, semester.id);

  if (submission) {
    return (
      <main className="overflow-x-hidden bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700"><span className="rounded-full bg-blue-50 px-4 py-2">RAMA</span><span className="text-slate-400">Hasil Anda</span></div>
          <section className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3"><span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-white">✓</span><div><h1 className="text-xl font-semibold text-slate-900">Anda sudah mengisi RAMA</h1><p className="mt-1 text-sm text-slate-600">Periode: {submission.semester.tahunAjaran} ({submission.semester.jenis}) · Status: {submission.status}</p></div></div>
          </section>
          <section className="grid gap-4">
          {submission.aspirasi.map((answer) => (
            <article key={answer.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-200">
              <h2 className="font-semibold text-slate-900">{answer.kategori.namaKategori}</h2>
              <p className="mt-2 text-sm font-medium text-blue-700">Kepuasan: {answer.kepuasan}/5</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{answer.isiAspirasi}</p>
            </article>
          ))}
          </section>
        </div>
      </main>
    );
  }

  const categories = await getKategoriAspirasi();

  return (
    <main className="overflow-x-hidden bg-white px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1"><span className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm">Isi RAMA</span><span className="px-5 py-2 text-sm font-semibold text-slate-500">{semester.tahunAjaran} · {semester.jenis}</span></div>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-center gap-2"><span className="text-lg text-blue-600">ⓘ</span><h1 className="text-lg font-semibold text-slate-900">Tentang RAMA</h1></div><p className="mt-4 text-sm leading-relaxed text-slate-600">RAMA adalah ruang bagi anggota HIMATIKA untuk menyampaikan masukan, saran, dan kritik terhadap kinerja organisasi.</p></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-lg font-semibold text-slate-900">Isi aspirasi Anda</h2><p className="mt-2 text-sm text-slate-600">Semua kategori wajib diisi satu kali dengan tingkat kepuasan 1 sampai 5.</p><div className="mt-6"><RamaForm semesterId={semester.id} categories={categories} /></div></section>
      </div>
    </main>
  );
}
