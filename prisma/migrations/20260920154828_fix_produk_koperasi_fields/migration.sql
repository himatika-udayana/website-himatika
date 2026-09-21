/*
  Warnings:

  - You are about to drop the column `is_active` on the `produk_koperasi` table. All the data in the column will be lost.
  - You are about to drop the column `kategori` on the `produk_koperasi` table. All the data in the column will be lost.
  - You are about to drop the column `stok` on the `produk_koperasi` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "produk_koperasi_is_active_idx";

-- AlterTable
ALTER TABLE "produk_koperasi" DROP COLUMN "is_active",
DROP COLUMN "kategori",
DROP COLUMN "stok";
