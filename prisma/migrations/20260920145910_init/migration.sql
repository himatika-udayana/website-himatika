-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ANGGOTA', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusAnggota" AS ENUM ('PENGURUS', 'ANGGOTA', 'ALUMNI');

-- CreateEnum
CREATE TYPE "StatusSemester" AS ENUM ('GANJIL', 'GENAP');

-- CreateEnum
CREATE TYPE "StatusRamaSubmission" AS ENUM ('TERSIMPAN', 'TERKIRIM', 'GAGAL');

-- CreateEnum
CREATE TYPE "StatusProduk" AS ENUM ('TERSEDIA', 'HABIS');

-- CreateEnum
CREATE TYPE "TipeQuizQuestion" AS ENUM ('PILIHAN_GANDA', 'ISIAN_SINGKAT');

-- CreateEnum
CREATE TYPE "StatusQuizAttempt" AS ENUM ('BERLANGSUNG', 'SELESAI');

-- CreateEnum
CREATE TYPE "KategoriArsip" AS ENUM ('SOAL', 'MATERI');

-- CreateEnum
CREATE TYPE "SemesterArsip" AS ENUM ('GANJIL', 'GENAP');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "nim" TEXT,
    "full_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "angkatan" INTEGER,
    "role" "Role" NOT NULL DEFAULT 'ANGGOTA',
    "status" "StatusAnggota" NOT NULL DEFAULT 'ANGGOTA',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "divisi_slug" TEXT,
    "jabatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rama_semesters" (
    "id" UUID NOT NULL,
    "tahun_ajaran" TEXT NOT NULL,
    "jenis" "StatusSemester" NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rama_semesters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kategori_aspirasi" (
    "id" UUID NOT NULL,
    "urutan" INTEGER NOT NULL,
    "nama_kategori" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "kategori_aspirasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rama_submissions" (
    "id" UUID NOT NULL,
    "token" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "semester_id" UUID NOT NULL,
    "tanggal_submit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusRamaSubmission" NOT NULL DEFAULT 'TERSIMPAN',

    CONSTRAINT "rama_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rama_aspirasi" (
    "id" UUID NOT NULL,
    "submission_id" UUID NOT NULL,
    "kategori_id" UUID NOT NULL,
    "kepuasan" INTEGER NOT NULL,
    "isi_aspirasi" TEXT NOT NULL,

    CONSTRAINT "rama_aspirasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produk_koperasi" (
    "id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga" DECIMAL(12,2) NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "kategori" TEXT,
    "image_url" TEXT,
    "status" "StatusProduk" NOT NULL DEFAULT 'TERSEDIA',
    "link_gform_pesan" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_koperasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "topik" TEXT,
    "tingkat_kesulitan" TEXT,
    "dibuat_oleh_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 1,
    "tipe" "TipeQuizQuestion" NOT NULL DEFAULT 'PILIHAN_GANDA',
    "teks_soal" TEXT NOT NULL,
    "poin" INTEGER NOT NULL DEFAULT 10,
    "pilihan_a" TEXT,
    "pilihan_b" TEXT,
    "pilihan_c" TEXT,
    "pilihan_d" TEXT,
    "pilihan_e" TEXT,
    "jawaban_benar_pg" TEXT,
    "jawaban_benar_isian" TEXT,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "skor" INTEGER NOT NULL DEFAULT 0,
    "total_poin" INTEGER NOT NULL DEFAULT 0,
    "waktu_mulai" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu_selesai" TIMESTAMP(3),
    "status" "StatusQuizAttempt" NOT NULL DEFAULT 'BERLANGSUNG',

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" UUID NOT NULL,
    "attempt_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "jawaban_dipilih" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_points" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "total_poin" INTEGER NOT NULL DEFAULT 0,
    "total_quiz" INTEGER NOT NULL DEFAULT 0,
    "total_benar" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mata_kuliah" (
    "id" UUID NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "mata_kuliah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arsip_soal" (
    "id" UUID NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "mata_kuliah_id" UUID NOT NULL,
    "tahun" INTEGER NOT NULL,
    "semester" "SemesterArsip" NOT NULL,
    "kategori" "KategoriArsip" NOT NULL,
    "dosen" TEXT,
    "link_gdrive" TEXT NOT NULL,
    "uploader_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arsip_soal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nim_key" ON "users"("nim");

-- CreateIndex
CREATE INDEX "rama_semesters_aktif_idx" ON "rama_semesters"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "rama_semesters_tahun_ajaran_jenis_key" ON "rama_semesters"("tahun_ajaran", "jenis");

-- CreateIndex
CREATE INDEX "kategori_aspirasi_urutan_idx" ON "kategori_aspirasi"("urutan");

-- CreateIndex
CREATE UNIQUE INDEX "rama_submissions_token_key" ON "rama_submissions"("token");

-- CreateIndex
CREATE INDEX "rama_submissions_semester_id_idx" ON "rama_submissions"("semester_id");

-- CreateIndex
CREATE INDEX "rama_submissions_status_idx" ON "rama_submissions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "rama_submissions_user_id_semester_id_key" ON "rama_submissions"("user_id", "semester_id");

-- CreateIndex
CREATE INDEX "rama_aspirasi_kategori_id_idx" ON "rama_aspirasi"("kategori_id");

-- CreateIndex
CREATE UNIQUE INDEX "rama_aspirasi_submission_id_kategori_id_key" ON "rama_aspirasi"("submission_id", "kategori_id");

-- CreateIndex
CREATE INDEX "produk_koperasi_is_active_idx" ON "produk_koperasi"("is_active");

-- CreateIndex
CREATE INDEX "quizzes_topik_idx" ON "quizzes"("topik");

-- CreateIndex
CREATE INDEX "quizzes_tingkat_kesulitan_idx" ON "quizzes"("tingkat_kesulitan");

-- CreateIndex
CREATE INDEX "quiz_questions_quiz_id_idx" ON "quiz_questions"("quiz_id");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_questions_quiz_id_urutan_key" ON "quiz_questions"("quiz_id", "urutan");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_idx" ON "quiz_attempts"("user_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_quiz_id_idx" ON "quiz_attempts"("quiz_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_status_idx" ON "quiz_attempts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_answers_attempt_id_question_id_key" ON "quiz_answers"("attempt_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_points_user_id_key" ON "user_points"("user_id");

-- CreateIndex
CREATE INDEX "user_points_total_poin_idx" ON "user_points"("total_poin");

-- CreateIndex
CREATE UNIQUE INDEX "mata_kuliah_kode_key" ON "mata_kuliah"("kode");

-- CreateIndex
CREATE INDEX "arsip_soal_mata_kuliah_id_tahun_idx" ON "arsip_soal"("mata_kuliah_id", "tahun");

-- CreateIndex
CREATE INDEX "arsip_soal_kategori_idx" ON "arsip_soal"("kategori");

-- AddForeignKey
ALTER TABLE "rama_submissions" ADD CONSTRAINT "rama_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rama_submissions" ADD CONSTRAINT "rama_submissions_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "rama_semesters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rama_aspirasi" ADD CONSTRAINT "rama_aspirasi_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "rama_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rama_aspirasi" ADD CONSTRAINT "rama_aspirasi_kategori_id_fkey" FOREIGN KEY ("kategori_id") REFERENCES "kategori_aspirasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_dibuat_oleh_id_fkey" FOREIGN KEY ("dibuat_oleh_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "quiz_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_points" ADD CONSTRAINT "user_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arsip_soal" ADD CONSTRAINT "arsip_soal_mata_kuliah_id_fkey" FOREIGN KEY ("mata_kuliah_id") REFERENCES "mata_kuliah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arsip_soal" ADD CONSTRAINT "arsip_soal_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
