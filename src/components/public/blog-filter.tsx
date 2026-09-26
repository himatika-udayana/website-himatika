"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import type { Post, PostType } from "@/src/types/content";

const options: { value: PostType; label: string }[] = [
  { value: "pengumuman", label: "Pengumuman" },
  { value: "open-requirement", label: "Open Requirement" },
  { value: "event", label: "Event" },
  { value: "prestasi", label: "Prestasi" },
  { value: "mathpedia", label: "Mathpedia" },
];

const styles: Record<PostType, string> = {
  pengumuman: "bg-blue-600 text-white",
  "open-requirement": "bg-pink-600 text-white",
  event: "bg-indigo-600 text-white",
  prestasi: "bg-emerald-600 text-white",
  mathpedia: "bg-slate-700 text-white",
};

export function BlogFilter({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [activeTypes, setActiveTypes] = useState<PostType[]>(
    options.map((item) => item.value),
  );
  const filteredPosts = useMemo(
    () =>
      posts
        .filter((post) => activeTypes.includes(post.tipe))
        .filter((post) =>
          post.judul.toLowerCase().includes(search.toLowerCase()),
        )
        .sort(
          (a, b) =>
            new Date(b.tanggalPublish).getTime() -
            new Date(a.tanggalPublish).getTime(),
        ),
    [posts, activeTypes, search],
  );
  const latestSlug = filteredPosts[0]?.slug;

  function toggleType(type: PostType) {
    setActiveTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    );
  }

  return (
    <>
      <section className="relative z-10 mx-auto -mt-10 max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">Filter</span>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveTypes(options.map((item) => item.value));
              }}
              className="text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              Reset
            </button>
          </div>
          <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={activeTypes.includes(option.value)}
                  onChange={() => toggleType(option.value)}
                  className="h-5 w-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto mt-8 max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <input
            aria-label="Cari artikel"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul artikel, topik..."
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-4 text-slate-900 shadow-sm outline-none ring-2 ring-transparent transition focus:ring-blue-500"
          />
        </div>
        {filteredPosts.length ? (
          filteredPosts.map((post) => (
            <Card
              key={post.slug}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {post.slug === latestSlug ? (
                    <Badge className="rounded-full border-0 bg-amber-400 text-slate-900">
                      TERBARU
                    </Badge>
                  ) : null}
                  <Badge
                    className={`rounded-full border-0 ${styles[post.tipe]}`}
                  >
                    {post.tipe.toUpperCase()}
                  </Badge>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {post.judul}
                </h2>
                <div className="mt-3 text-sm text-slate-500">
                  {post.tanggalPublish} · {post.penulis}
                </div>
                <p className="mt-4 leading-7 text-slate-600">
                  {post.ringkasan}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:gap-3"
                >
                  Baca Selengkapnya →
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            {posts.length === 0
              ? "Belum ada artikel blog."
              : "Belum ada artikel yang cocok dengan filter ini."}
          </div>
        )}
      </section>
    </>
  );
}
