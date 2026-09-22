/*
  Warnings:

  - The `tipe` column on the `quiz_questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TipeSoalQuiz" AS ENUM ('PG', 'ISIAN');

-- AlterTable
ALTER TABLE "quiz_questions" DROP COLUMN "tipe",
ADD COLUMN     "tipe" "TipeSoalQuiz" NOT NULL DEFAULT 'PG';

-- DropEnum
DROP TYPE "TipeQuizQuestion";
