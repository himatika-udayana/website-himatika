import type { TentangHimatika } from "@/src/types/content";

const tentangPlaceholder: TentangHimatika = {
  sejarah: "[PLACEHOLDER] Ringkasan sejarah untuk halaman tentang.",
  visi: "[PLACEHOLDER] Visi untuk halaman tentang.",
  periodeKepengurusan: "[PLACEHOLDER] Periode kepengurusan",
  logo: null,
  misi: ["[PLACEHOLDER] Misi organisasi."],
  filosofiLogo: [
    {
      nama: "[PLACEHOLDER] Elemen logo",
      deskripsi: "[PLACEHOLDER] Filosofi elemen logo.",
    },
  ],
  timeline: [
    {
      year: 0,
      title: "[PLACEHOLDER] Peristiwa organisasi",
      description: "[PLACEHOLDER] Deskripsi peristiwa organisasi.",
    },
  ],
};

export const tentang: TentangHimatika = tentangPlaceholder;