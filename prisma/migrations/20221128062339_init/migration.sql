/*
  Warnings:

  - Added the required column `number` to the `Buyer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `buyer` ADD COLUMN `number` VARCHAR(10) NOT NULL;
