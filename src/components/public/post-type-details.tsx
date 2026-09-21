import type { Post } from "@/src/types/content";

const typeStyles: Record<Post["tipe"], string> = {
  pengumuman: "bg-blue-100 text-blue-700",
  "open-requirement": "bg-pink-100 text-pink-700",
  event: "bg-violet-100 text-violet-700",
  prestasi: "bg-emerald-100 text-emerald-700",
  mathpedia: "bg-slate-200 text-slate-700",
};

const typeLabels: Record<Post["tipe"], string> = {
  pengumuman: "Pengumuman",
  "open-requirement": "Open Requirement",
  event: "Event",
  prestasi: "Prestasi",
  mathpedia: "Mathpedia",
};

const readable = (value?: string) =>
  value?.replaceAll("-", " ") || "Tidak tersedia";

export function PostTypeBadge({ type }: { type: Post["tipe"] }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${typeStyles[type]}`}
    >
      {typeLabels[type]}
    </span>
  );
}

export function PostTypeDetails({ post }: { post: Post }) {
  if (post.tipe === "event") {
    return (
      <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Informasi Kegiatan
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <p>
            <strong className="block text-slate-900">Tanggal</strong>
            {post.tanggalEvent || "[PLACEHOLDER] Tanggal"}
          </p>
          <p>
            <strong className="block text-slate-900">Lokasi</strong>
            {post.lokasiEvent || "[PLACEHOLDER] Lokasi"}
          </p>
        </div>
      </div>
    );
  }
  if (post.tipe === "open-requirement") {
    return (
      <div className="rounded-2xl border border-pink-100 bg-pink-50 p-6 text-sm text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
          Informasi Pendaftaran
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <span>
            <strong className="block text-slate-900">Deadline</strong>
            {post.deadlineFormulir || "[PLACEHOLDER] Deadline"}
          </span>
          {post.linkFormulir ? (
            <a
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 font-semibold text-white hover:bg-pink-700"
              href={post.linkFormulir}
            >
              Daftar sekarang <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    );
  }
  if (post.tipe === "prestasi") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Level Prestasi
        </p>
        <span className="mt-4 inline-flex rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold capitalize text-white">
          {readable(post.tingkatPrestasi)}
        </span>
      </div>
    );
  }
  if (post.tipe === "mathpedia") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Kategori Mathpedia
        </p>
        <span className="mt-4 inline-flex rounded-full bg-slate-700 px-3 py-1 text-sm font-semibold capitalize text-white">
          {readable(post.kategoriMathpedia)}
        </span>
      </div>
    );
  }
  return null;
}
