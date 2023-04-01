/*
  Warnings:

  - You are about to drop the column `body` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notes` DROP COLUMN `body`;

-- CreateTable
CREATE TABLE `Element` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL DEFAULT 'paragraph',
    `noteId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Text` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `bold` BOOLEAN NULL,
    `code` BOOLEAN NULL,
    `italic` BOOLEAN NULL,
    `underline` BOOLEAN NULL,
    `strikethrough` BOOLEAN NULL,
    `elementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Element` ADD CONSTRAINT `Element_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Text` ADD CONSTRAINT `Text_elementId_fkey` FOREIGN KEY (`elementId`) REFERENCES `Element`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
