/*
  Warnings:

  - You are about to drop the column `image` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `article` DROP COLUMN `image`,
    DROP COLUMN `updatedAt`;
