-- CreateTable
CREATE TABLE `Buyer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `tel` VARCHAR(15) NOT NULL,
    `cep` VARCHAR(9) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `uf` CHAR(2) NOT NULL,
    `complement` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Buyer_email_key`(`email`),
    UNIQUE INDEX `Buyer_cpf_key`(`cpf`),
    UNIQUE INDEX `Buyer_tel_key`(`tel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
