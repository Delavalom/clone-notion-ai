-- CreateTable
CREATE TABLE `notes` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL DEFAULT 'untitled',
    `body` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
