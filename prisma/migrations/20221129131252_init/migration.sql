-- CreateTable
CREATE TABLE `Seller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fantasy_name` VARCHAR(191) NOT NULL,
    `logo_path` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(17) NOT NULL,
    `tel` VARCHAR(15) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `number` VARCHAR(10) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `uf` CHAR(2) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Seller_email_key`(`email`),
    UNIQUE INDEX `Seller_cnpj_key`(`cnpj`),
    UNIQUE INDEX `Seller_tel_key`(`tel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
