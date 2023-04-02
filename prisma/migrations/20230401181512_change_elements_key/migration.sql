/*
  Warnings:

  - The primary key for the `Element` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Text` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Text` DROP FOREIGN KEY `Text_element_id_fkey`;

-- AlterTable
ALTER TABLE `Element` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Text` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `element_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Text` ADD CONSTRAINT `Text_element_id_fkey` FOREIGN KEY (`element_id`) REFERENCES `Element`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
