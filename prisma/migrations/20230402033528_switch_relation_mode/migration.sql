-- DropForeignKey
ALTER TABLE `Element` DROP FOREIGN KEY `Element_note_id_fkey`;

-- DropForeignKey
ALTER TABLE `Text` DROP FOREIGN KEY `Text_element_id_fkey`;

-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `notes` DROP FOREIGN KEY `notes_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_user_id_fkey`;

-- RenameIndex
ALTER TABLE `Element` RENAME INDEX `Element_note_id_fkey` TO `Element_note_id_idx`;

-- RenameIndex
ALTER TABLE `Text` RENAME INDEX `Text_element_id_fkey` TO `Text_element_id_idx`;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `accounts_user_id_fkey` TO `accounts_user_id_idx`;

-- RenameIndex
ALTER TABLE `notes` RENAME INDEX `notes_user_id_fkey` TO `notes_user_id_idx`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions_user_id_fkey` TO `sessions_user_id_idx`;
