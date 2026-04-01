-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetCode" TEXT,
ADD COLUMN     "resetCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetCodeSentAt" TIMESTAMP(3),
ADD COLUMN     "verifyCode" TEXT,
ADD COLUMN     "verifyCodeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verifyCodeSentAt" TIMESTAMP(3);
