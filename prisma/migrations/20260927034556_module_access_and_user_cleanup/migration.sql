-- CreateEnum
CREATE TYPE "Modul" AS ENUM ('RAMA', 'MATHQUIZ', 'KOPERASI', 'REDIRECT_LINK', 'ARSIP');

-- AlterTable
ALTER TABLE "users"
    DROP COLUMN "avatar_url",
    DROP COLUMN "status",
    DROP COLUMN "is_verified",
    DROP COLUMN "divisi_slug",
    DROP COLUMN "jabatan",
    ADD COLUMN "module_access" "Modul"[] DEFAULT ARRAY[]::"Modul"[];

-- DropEnum
DROP TYPE "StatusAnggota";