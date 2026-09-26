import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const kategoriSeed = [
  {
    urutan: 1,
    namaKategori: "Akademik",
    deskripsi:
      "Sampaikan aspirasi, masukan, kritik, maupun saran terkait proses pembelajaran, kurikulum, metode pengajaran, jadwal perkuliahan, kualitas dosen, kegiatan akademik, serta hal-hal lain yang berhubungan dengan peningkatan mutu pendidikan dan pengalaman belajar mahasiswa.",
  },
  {
    urutan: 2,
    namaKategori: "Kemahasiswaan",
    deskripsi:
      "Sampaikan aspirasi, masukan, kritik, maupun saran terkait kegiatan kemahasiswaan, organisasi mahasiswa, fasilitas kampus, layanan administrasi, kegiatan ekstrakurikuler, serta hal-hal lain yang berhubungan dengan kehidupan mahasiswa di kampus.",
  },
  {
    urutan: 3,
    namaKategori: "Administrasi",
    deskripsi:
      "Sampaikan aspirasi, masukan, kritik, maupun saran terkait layanan administrasi, prosedur pendaftaran, pengelolaan data mahasiswa, dan hal-hal lain yang berhubungan dengan operasional organisasi.",
  },
  {
    urutan: 4,
    namaKategori: "Fasilitas dan Pelayanan",
    deskripsi:
      "Sampaikan aspirasi, masukan, kritik, maupun saran terkait fasilitas kampus, ruang kelas, laboratorium, perpustakaan, area publik, dan fasilitas lainnya yang mendukung kegiatan akademik dan kesejahteraan mahasiswa.",
  },
  {
    urutan: 5,
    namaKategori: "Penyebaran Informasi",
    deskripsi:
      "Sampaikan aspirasi, masukan, kritik, maupun saran terkait penyebaran informasi, komunikasi internal, transparansi organisasi, media sosial, dan hal-hal lain yang berhubungan dengan aliran informasi di lingkungan kampus.",
  },
] satisfies Prisma.KategoriAspirasiCreateInput[];

async function main() {
  await prisma.$transaction(async (transaction) => {
    await transaction.semester.updateMany({
      where: {
        NOT: { tahunAjaran: "2025/2026", jenis: "GANJIL" },
      },
      data: { aktif: false },
    });

    await transaction.semester.upsert({
      where: {
        tahunAjaran_jenis: { tahunAjaran: "2025/2026", jenis: "GANJIL" },
      },
      update: { aktif: true },
      create: { tahunAjaran: "2025/2026", jenis: "GANJIL", aktif: true },
    });

    for (const category of kategoriSeed) {
      const existing = await transaction.kategoriAspirasi.findFirst({
        where: { urutan: category.urutan },
        orderBy: { id: "asc" },
      });

      if (existing) {
        await transaction.kategoriAspirasi.update({
          where: { id: existing.id },
          data: category,
        });
      } else {
        await transaction.kategoriAspirasi.create({ data: category });
      }
    }
  });

  const [semester, categories] = await Promise.all([
    prisma.semester.findFirst({
      where: { tahunAjaran: "2025/2026", jenis: "GANJIL", aktif: true },
    }),
    prisma.kategoriAspirasi.findMany({
      where: { urutan: { in: kategoriSeed.map(({ urutan }) => urutan) } },
      orderBy: { urutan: "asc" },
    }),
  ]);

  console.info("RAMA seed complete", {
    activeSemester: semester
      ? `${semester.tahunAjaran} ${semester.jenis}`
      : null,
    categories: categories.map(({ urutan, namaKategori }) => ({
      urutan,
      namaKategori,
    })),
  });
}

main()
  .catch((error: unknown) => {
    console.error("RAMA seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });