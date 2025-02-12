-- AlterTable
ALTER TABLE `article` MODIFY `content` LONGTEXT NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;
