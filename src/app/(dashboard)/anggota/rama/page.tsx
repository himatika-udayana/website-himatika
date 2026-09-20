import { getKategoriAspirasi, getSemesterAktif, getSubmissionUser } from "@/src/lib/actions/rama";
import { requireVerifiedUser } from "@/src/lib/auth";
import RamaForm from "./rama-form";

export default async function RamaPage() {
  const user = await requireVerifiedUser();
  const semester = await getSemesterAktif();

  if (!semester) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>RAMA</h1>
        <p>Belum ada periode RAMA yang dibuka.</p>
      </main>
    );
  }

  const submission = await getSubmissionUser(user.id, semester.id);

  if (submission) {
    return (
      <main style={{ maxWidth: 720, padding: "2rem" }}>
        <h1>Hasil RAMA</h1>
        <p>Periode: {submission.semester.tahunAjaran} ({submission.semester.jenis})</p>
        <p>Status: {submission.status}</p>
        <section style={{ display: "grid", gap: 16, marginTop: 24 }}>
          {submission.aspirasi.map((answer) => (
            <article key={answer.id} style={{ border: "1px solid #ddd", padding: 16 }}>
              <h2>{answer.kategori.namaKategori}</h2>
              <p>Kepuasan: {answer.kepuasan}/5</p>
              <p>{answer.isiAspirasi}</p>
            </article>
          ))}
        </section>
      </main>
    );
  }

  const categories = await getKategoriAspirasi();

  return (
    <main style={{ maxWidth: 720, padding: "2rem" }}>
      <h1>Isi RAMA</h1>
      <p>Periode: {semester.tahunAjaran} ({semester.jenis})</p>
      <p>Semua kategori wajib diisi satu kali.</p>
      <RamaForm semesterId={semester.id} categories={categories} />
    </main>
  );
}
