import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubmissionDetail } from "@/src/lib/actions/admin/rama";

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Makassar",
});

export default async function AdminRamaDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const submission = await getSubmissionDetail(submissionId);
  if (!submission) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin/rama" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Kembali ke daftar RAMA</Link>
      <div className="mt-5 border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Detail submission RAMA</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{submission.user.fullName}</h1>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-slate-500">NIM</dt><dd className="mt-1 font-medium text-slate-900">{submission.user.nim ?? "-"}</dd></div>
          <div><dt className="text-slate-500">Email</dt><dd className="mt-1 font-medium text-slate-900">{submission.user.email}</dd></div>
          <div><dt className="text-slate-500">Periode</dt><dd className="mt-1 font-medium text-slate-900">{submission.semester.tahunAjaran} · {submission.semester.jenis === "GANJIL" ? "Ganjil" : "Genap"}</dd></div>
          <div><dt className="text-slate-500">Waktu pengiriman</dt><dd className="mt-1 font-medium text-slate-900">{dateFormat.format(submission.tanggalSubmit)}</dd></div>
          <div><dt className="text-slate-500">Status</dt><dd className="mt-1 font-medium text-slate-900">{submission.status}</dd></div>
        </dl>
      </div>
      <section className="mt-7">
        <h2 className="text-xl font-semibold text-slate-900">Jawaban aspirasi</h2>
        <div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
          {submission.aspirasi.map((answer) => (
            <article key={answer.id} className="py-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{answer.kategori.urutan}. {answer.kategori.namaKategori}</h3>
                <p className="text-sm text-slate-600">Tingkat kepuasan: {answer.kepuasan}/5</p>
              </div>
              {answer.kategori.deskripsi ? <p className="mt-1 text-xs leading-5 text-slate-500">{answer.kategori.deskripsi}</p> : null}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{answer.isiAspirasi}</p>
            </article>
          ))}
          {submission.aspirasi.length === 0 ? <p className="py-8 text-sm text-slate-500">Submission ini belum memiliki jawaban.</p> : null}
        </div>
      </section>
    </main>
  );
}
