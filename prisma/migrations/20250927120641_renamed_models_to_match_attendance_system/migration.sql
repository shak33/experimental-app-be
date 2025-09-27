/*
  Warnings:

  - You are about to drop the `QRCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QRCodeScan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QRCodeScan" DROP CONSTRAINT "QRCodeScan_qrCodeId_fkey";

-- DropForeignKey
ALTER TABLE "QRCodeScan" DROP CONSTRAINT "QRCodeScan_userId_fkey";

-- DropTable
DROP TABLE "QRCode";

-- DropTable
DROP TABLE "QRCodeScan";

-- CreateTable
CREATE TABLE "AttendanceQRCode" (
    "id" SERIAL NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "secretValue" VARCHAR(255) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "status" "QRCodeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceQRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "scanId" TEXT NOT NULL,
    "qrCodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "scannedValue" VARCHAR(255) NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceQRCode_qrCodeId_key" ON "AttendanceQRCode"("qrCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceQRCode_secretValue_key" ON "AttendanceQRCode"("secretValue");

-- CreateIndex
CREATE INDEX "AttendanceQRCode_status_validFrom_validUntil_idx" ON "AttendanceQRCode"("status", "validFrom", "validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_scanId_key" ON "Attendance"("scanId");

-- CreateIndex
CREATE INDEX "Attendance_qrCodeId_createdAt_idx" ON "Attendance"("qrCodeId", "createdAt");

-- CreateIndex
CREATE INDEX "Attendance_userId_createdAt_idx" ON "Attendance"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "AttendanceQRCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
