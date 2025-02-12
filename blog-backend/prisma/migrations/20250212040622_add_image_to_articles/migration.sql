/*
  Warnings:

  - Added the required column `updatedAt` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- First set a default value for updatedAt
ALTER TABLE `Article` ADD COLUMN `image` VARCHAR(191) NULL;
ALTER TABLE `Article` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
