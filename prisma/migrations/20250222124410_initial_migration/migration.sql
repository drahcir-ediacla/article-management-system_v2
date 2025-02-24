-- CreateTable
CREATE TABLE `article` (
    `id` VARCHAR(191) NOT NULL,
    `company_id` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `editor_id` VARCHAR(191) NULL,
    `image` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `status` ENUM('Published', 'ForEdit') NOT NULL DEFAULT 'ForEdit',
    `title` VARCHAR(255) NOT NULL,
    `writer_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `article_company_id_idx`(`company_id`),
    INDEX `article_editor_id_idx`(`editor_id`),
    INDEX `article_writer_id_idx`(`writer_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `role` ENUM('Writer', 'Editor') NOT NULL DEFAULT 'Writer',
    `user_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_user_name_key`(`user_name`),
    INDEX `user_user_name_idx`(`user_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expiration_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `refresh_token_user_id_key`(`user_id`),
    UNIQUE INDEX `refresh_token_token_key`(`token`),
    INDEX `refresh_token_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `article` ADD CONSTRAINT `article_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article` ADD CONSTRAINT `article_editor_id_fkey` FOREIGN KEY (`editor_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `article` ADD CONSTRAINT `article_writer_id_fkey` FOREIGN KEY (`writer_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
