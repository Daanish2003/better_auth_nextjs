-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isAnonymous" BOOLEAN,
ALTER COLUMN "username" DROP NOT NULL;
