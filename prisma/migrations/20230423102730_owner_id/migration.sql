/*
  Warnings:

  - Added the required column `owner_id` to the `workers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workers" ADD COLUMN     "owner_id" INTEGER NOT NULL;
