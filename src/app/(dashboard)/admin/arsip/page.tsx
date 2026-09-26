import Link from "next/link";
import { KategoriArsip, SemesterArsip } from "@prisma/client";
import ArsipManager from "@/src/app/(dashboard)/admin/arsip/arsip-manager";
import { getMataKuliahAdminList } from "@/src/lib/actions/admin/arsip-matakuliah";
import { getArsip } from "@/src/lib/actions/admin/arsip-soal";

export default async function AdminArsipPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const mataKuliahId = typeof params.mataKuliahId === "string" ? params.mataKuliahId : "";
  const tahunString = typeof params.tahun === "string" ? params.tahun : "";
  const parsedTahun = Number(tahunString);
  const tahun = Number.isInteger(parsedTahun) && parsedTahun > 0 ? parsedTahun : undefined;
  const semesterValue = typeof params.semester === "string" ? params.semester : "";
  const semester = Object.values(SemesterArsip).includes(semesterValue as SemesterArsip)
    ? (semesterValue as SemesterArsip)
    : undefined;
  const kategoriValue = typeof params.kategori === "string" ? params.kategori : "";
  const kategori = Object.values(KategoriArsip).includes(kategoriValue as KategoriArsip)
    ? (kategoriValue as KategoriArsip)
    : undefined;

  const filters = { mataKuliahId: mataKuliahId || undefined, tahun, semester, kategori };
  const [arsip, mataKuliah] = await Promise.all([
    getArsip(filters),
    getMataKuliahAdminList(),
  ]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/admin" className="text-sm font-semibold text-blue-700 hover:text-blue-900">← Dashboard admin</Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Admin / Arsip</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Kelola Arsip Soal &amp; Materi</h1>
          <p className="mt-2 text-sm text-slate-600">Link Google Drive harus memakai URL HTTP atau HTTPS.</p>
        </div>
        <Link href="/admin/arsip/mata-kuliah" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Kelola Mata Kuliah</Link>
      </div>
      {mataKuliah.length === 0 ? <p className="mt-5 border-l-2 border-amber-500 pl-3 py-2 text-sm text-amber-800">Tambahkan mata kuliah terlebih dahulu sebelum membuat arsip.</p> : null}
      <ArsipManager
        arsip={arsip}
        mataKuliah={mataKuliah.map(({ id, kode, nama }) => ({ id, kode, nama }))}
        filters={{ mataKuliahId, tahun: tahunString, semester: semesterValue, kategori: kategoriValue }}
      />
    </main>
  );
}
