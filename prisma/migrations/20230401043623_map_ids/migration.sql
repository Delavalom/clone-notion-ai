/*
  Warnings:

  - You are about to drop the column `noteId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `elementId` on the `Text` table. All the data in the column will be lost.
  - Added the required column `note_id` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `element_id` to the `Text` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Element` DROP FOREIGN KEY `Element_noteId_fkey`;

-- DropForeignKey
ALTER TABLE `Text` DROP FOREIGN KEY `Text_elementId_fkey`;

-- AlterTable
ALTER TABLE `Element` DROP COLUMN `noteId`,
    ADD COLUMN `note_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Text` DROP COLUMN `elementId`,
    ADD COLUMN `element_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Element` ADD CONSTRAINT `Element_note_id_fkey` FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Text` ADD CONSTRAINT `Text_element_id_fkey` FOREIGN KEY (`element_id`) REFERENCES `Element`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
