import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  MathpediaKategori,
  Post,
  PostImage,
  PostType,
} from "@/src/types/content";

const blogDirectory = path.join(process.cwd(), "content", "blog");
const postTypes: PostType[] = [
  "pengumuman",
  "open-requirement",
  "event",
  "prestasi",
  "mathpedia",
];
const mathpediaCategories: MathpediaKategori[] = [
  "aljabar",
  "geometri",
  "kalkulus",
  "analisis",
  "matematika-diskrit",
  "peluang",
  "statistika",
  "lainnya",
];

function requiredString(value: unknown, field: string, fileName: string) {
  if (typeof value !== "string" || !value.trim())
    throw new Error(
      `Invalid blog frontmatter in ${fileName}: ${field} is required.`,
    );
  return value;
}

function parsePost(fileName: string): Post {
  const source = fs.readFileSync(path.join(blogDirectory, fileName), "utf8");
  const { data, content } = matter(source);
  const type = requiredString(data.tipe, "tipe", fileName) as PostType;
  if (!postTypes.includes(type))
    throw new Error(
      `Invalid blog frontmatter in ${fileName}: unsupported tipe '${type}'.`,
    );
  const status = requiredString(data.status, "status", fileName);
  if (status !== "draft" && status !== "published")
    throw new Error(
      `Invalid blog frontmatter in ${fileName}: status must be draft or published.`,
    );
  const images = data.images as unknown;
  if (
    images !== undefined &&
    (!Array.isArray(images) ||
      images.some(
        (image) =>
          !image ||
          typeof image.nomor !== "number" ||
          typeof image.url !== "string",
      ))
  ) {
    throw new Error(
      `Invalid blog frontmatter in ${fileName}: images must contain nomor and url.`,
    );
  }
  if (
    type === "mathpedia" &&
    data.kategoriMathpedia !== undefined &&
    !mathpediaCategories.includes(data.kategoriMathpedia)
  ) {
    throw new Error(
      `Invalid blog frontmatter in ${fileName}: unsupported kategoriMathpedia.`,
    );
  }

  return {
    slug: requiredString(data.slug, "slug", fileName),
    tipe: type,
    judul: requiredString(data.judul, "judul", fileName),
    ringkasan: requiredString(data.ringkasan, "ringkasan", fileName),
    konten: content.trim(),
    thumbnail: data.thumbnail ?? null,
    penulis: requiredString(data.penulis, "penulis", fileName),
    emailPenulis: data.emailPenulis,
    igPenulis: data.igPenulis,
    publisher: data.publisher,
    status,
    tanggalPublish: requiredString(
      data.tanggalPublish,
      "tanggalPublish",
      fileName,
    ),
    tanggalEvent: data.tanggalEvent,
    lokasiEvent: data.lokasiEvent,
    linkFormulir: data.linkFormulir,
    deadlineFormulir: data.deadlineFormulir,
    tingkatPrestasi: data.tingkatPrestasi,
    kategoriMathpedia: data.kategoriMathpedia,
    tags: Array.isArray(data.tags) ? data.tags : [],
    images: (images as PostImage[] | undefined) ?? [],
  };
}

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(parsePost)
    .filter((post) => post.status === "published");
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}
