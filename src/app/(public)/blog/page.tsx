import Link from "next/link";
import { getAllPosts } from "@/src/lib/blog";
import { BlogFilter } from "@/src/components/public/blog-filter";

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="pb-16">
      <section className="relative overflow-hidden px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[url('/images/HERO.png')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#2563eb_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#be185d_0%,transparent_30%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <nav className="mb-6 text-sm text-slate-300">
            <Link href="/" className="hover:text-white">
              Beranda
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-white">Blog</span>
          </nav>
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300">
            Himatika Newsroom
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Wawasan &amp; <span className="text-blue-400">Informasi</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Temukan berita terbaru, dokumentasi kegiatan, dan artikel akademik
            dari mahasiswa Matematika Universitas Udayana.
          </p>
        </div>
      </section>
      <BlogFilter posts={posts} />
    </main>
  );
}
