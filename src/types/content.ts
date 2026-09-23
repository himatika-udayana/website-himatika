export type PostType =
  "pengumuman" | "open-requirement" | "event" | "prestasi" | "mathpedia";

export type MathpediaKategori =
  | "aljabar"
  | "geometri"
  | "kalkulus"
  | "analisis"
  | "matematika-diskrit"
  | "peluang"
  | "statistika"
  | "lainnya";

export interface PostImage {
  nomor: number;
  url: string;
  caption: string | null;
}

export interface Post {
  slug: string;
  tipe: PostType;
  judul: string;
  ringkasan: string;
  konten: string;
  thumbnail: string | null;
  penulis: string;
  emailPenulis?: string;
  igPenulis?: string;
  publisher?: string;
  status: "draft" | "published";
  tanggalPublish: string;
  tanggalEvent?: string;
  lokasiEvent?: string;
  linkFormulir?: string;
  deadlineFormulir?: string;
  tingkatPrestasi?: "internasional" | "nasional" | "lokal";
  kategoriMathpedia?: MathpediaKategori;
  tags?: string[];
  images?: PostImage[];
}

export interface StatistikWebsite {
  label: string;
  nilai: string;
}

export interface FilosofiLogo {
  nama: string;
  deskripsi: string;
}

export interface ProfilOrganisasi {
  sejarah: string;
  visi: string;
  periodeKepengurusan: string;
  logo: string | null;
  misi: string[];
  filosofiLogo: FilosofiLogo[];
  timeline: {
    year: number;
    title: string;
    description: string;
  }[];
}

export interface TentangHimatika extends ProfilOrganisasi {}

export type Bidang =
  | "inti"
  | "bph"
  | "bidang-1-pendidikan-penalaran"
  | "bidang-2-minat-bakat"
  | "bidang-3-kewirausahaan-kesejahteraan"
  | "bidang-4-pengabdian-masyarakat"
  | "bidang-5-komunikasi-informasi";

export type Jabatan =
  | "ketua"
  | "wakil-ketua-1"
  | "wakil-ketua-2"
  | "sekretaris-1"
  | "sekretaris-2"
  | "bendahara-1"
  | "bendahara-2"
  | "kabid"
  | "wakabid"
  | "staff";

export interface Pengurus {
  nama: string;
  foto: string | null;
  bidang: Bidang;
  jabatan: Jabatan;
}

export interface ProgramKerja {
  nama: string;
  deskripsi: string;
  foto: string | null;
  bidang: Bidang;
  progres: number;
  status: "Rencana" | "Berjalan" | "Selesai";
}

export interface Divisi {
  pengurus: Pengurus[];
  programKerja: ProgramKerja[];
}

export interface StatistikBeranda {
  statistik1: StatistikWebsite;
  statistik2: StatistikWebsite;
  statistik3: StatistikWebsite;
  statistik4: StatistikWebsite;
}

export interface Beranda {
  namaWebsite: string;
  visi: string;
  statistik: StatistikBeranda;
  youtubeEmbed: string;
  kontak: {
    alamat: string;
    email: string;
    telepon: string;
    instagram: string;
    website: string;
  };
}

export interface FAQ {
  pertanyaan: string;
  jawaban: string;
}
