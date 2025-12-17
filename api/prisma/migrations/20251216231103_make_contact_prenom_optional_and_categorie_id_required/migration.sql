/*
  Warnings:

  - Made the column `categorieId` on table `Contact` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_categorieId_fkey";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "prenom" DROP NOT NULL,
ALTER COLUMN "categorieId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
