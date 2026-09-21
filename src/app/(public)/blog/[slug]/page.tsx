import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  Info,
  MapPin,
  Tag,
  User,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Reveal } from "@/src/components/ui/reveal";
import { getAllPostSlugs, getAllPosts, getPostBySlug } from "@/src/lib/blog";
import type { Post } from "@/src/types/content";

const labels: Record<Post["tipe"], string> = {
  pengumuman: "Pengumuman",
  "open-requirement": "Open Requirement",
  event: "Event",
  prestasi: "Prestasi",
  mathpedia: "Mathpedia",
};
const styles: Record<Post["tipe"], string> = {
  pengumuman: "bg-blue-600 text-white",
  "open-requirement": "bg-pink-600 text-white",
  event: "bg-violet-600 text-white",
  prestasi: "bg-emerald-600 text-white",
  mathpedia: "bg-slate-700 text-white",
};
const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(value))
    : "Tanggal belum tersedia";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

function TypeInfo({ post }: { post: Post }) {
  if (post.tipe === "open-requirement")
    return (
      <Card className="rounded-2xl border border-pink-100 bg-pink-50 p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-pink-100 p-2 text-pink-600">
            <Info className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">
              Open Requirement
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Informasi Pendaftaran
            </h3>
          </div>
        </div>
        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <div className="flex items-center justify-between rounded-xl bg-white/70 p-3">
            <span className="font-medium">Deadline</span>
            <span>{formatDate(post.deadlineFormulir)}</span>
          </div>
        </div>
        {post.linkFormulir ? (
          <a
            href={post.linkFormulir}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Daftar Sekarang <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </Card>
    );
  if (post.tipe === "event")
    return (
      <Card className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-violet-100 p-2 text-violet-600">
            <Calendar className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Event
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Informasi Kegiatan
            </h3>
          </div>
        </div>
        <div className="mt-5 space-y-4 text-sm text-slate-700">
          <p className="flex items-start gap-3 rounded-xl bg-white/70 p-3">
            <Calendar className="mt-0.5 h-4 w-4 text-violet-600" />
            <span>
              <strong className="block text-slate-900">Tanggal</strong>
              {formatDate(post.tanggalEvent)}
            </span>
          </p>
          <p className="flex items-start gap-3 rounded-xl bg-white/70 p-3">
            <MapPin className="mt-0.5 h-4 w-4 text-violet-600" />
            <span>
              <strong className="block text-slate-900">Lokasi</strong>
              {post.lokasiEvent || "Tidak tersedia"}
            </span>
          </p>
        </div>
      </Card>
    );
  if (post.tipe === "prestasi")
    return (
      <Card className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Prestasi
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Level Prestasi
            </h3>
          </div>
        </div>
        <span className="mt-4 inline-flex rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold capitalize text-white">
          {post.tingkatPrestasi || "Tidak tersedia"}
        </span>
      </Card>
    );
  if (post.tipe === "mathpedia")
    return (
      <Card className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-slate-200 p-2 text-slate-700">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              Mathpedia
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Kategori</h3>
          </div>
        </div>
        <span className="mt-4 inline-flex rounded-full bg-slate-700 px-3 py-1 text-sm font-semibold capitalize text-white">
          {post.kategoriMathpedia || "Tidak tersedia"}
        </span>
      </Card>
    );
  return null;
}

function ArticleContent({ post }: { post: Post }) {
  const imageMap = new Map(
    (post.images ?? []).map((image) => [image.nomor, image]),
  );
  return (
    <div className="space-y-5 text-[15px] leading-8 text-slate-700">
      {post.konten.split(/(\[GAMBAR\s*\d+\])/gi).map((part, index) => {
        const match = part.match(/^\[GAMBAR\s*(\d+)\]$/i);
        if (!match)
          return (
            <p key={`${part}-${index}`} className="whitespace-pre-line">
              {part.trim() || " "}
            </p>
          );
        const image = imageMap.get(Number(match[1]));
        return image ? (
          <figure
            key={`${image.nomor}-${index}`}
            className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <img
              src={image.url}
              alt={image.caption || "Gambar artikel"}
              className="h-auto w-full object-cover"
            />
            <figcaption className="border-t border-slate-200 px-3 py-2 text-sm text-slate-600">
              {image.caption}
            </figcaption>
          </figure>
        ) : null;
      })}
    </div>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-blue-700">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-blue-700">
          Berita
        </Link>
        <span>/</span>
        <span className="truncate font-medium text-slate-700">
          {post.judul}
        </span>
      </nav>
      <Reveal>
        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-8 lg:p-10">
            <Badge className={`rounded-full border-0 ${styles[post.tipe]}`}>
              {labels[post.tipe]}
            </Badge>
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {post.judul}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {post.ringkasan}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <User className="h-4 w-4" />
                {post.penulis}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.tanggalPublish)}
              </span>
            </div>
            <div className="mt-8">
              <TypeInfo post={post} />
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-justify sm:p-6">
                <ArticleContent post={post} />
              </div>
              <div className="space-y-6">
                {post.tags?.length ? (
                  <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Tag className="h-4 w-4 text-blue-600" />
                      <h3 className="text-lg font-bold">Tags</h3>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ) : null}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Berita
                </Link>
              </div>
            </div>
          </div>
        </article>
      </Reveal>
      {related.length ? (
        <Reveal delay={150}>
          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                Artikel Terkait
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-blue-600"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-40 items-center justify-center bg-slate-100 text-slate-400">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-blue-600">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(item.tanggalPublish)}
                    </div>
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900">
                      {item.judul}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </main>
  );
}
