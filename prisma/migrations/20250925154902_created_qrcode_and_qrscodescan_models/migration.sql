-- CreateEnum
CREATE TYPE "QRCodeStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "QRCode" (
    "id" SERIAL NOT NULL,
    "qrCodeId" TEXT NOT NULL,
    "secretValue" VARCHAR(255) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "status" "QRCodeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QRCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRCodeScan" (
    "id" SERIAL NOT NULL,
    "scanId" TEXT NOT NULL,
    "qrCodeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "scannedValue" VARCHAR(255) NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRCodeScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_qrCodeId_key" ON "QRCode"("qrCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "QRCode_secretValue_key" ON "QRCode"("secretValue");

-- CreateIndex
CREATE INDEX "QRCode_status_validFrom_validUntil_idx" ON "QRCode"("status", "validFrom", "validUntil");

-- CreateIndex
CREATE UNIQUE INDEX "QRCodeScan_scanId_key" ON "QRCodeScan"("scanId");

-- CreateIndex
CREATE INDEX "QRCodeScan_qrCodeId_createdAt_idx" ON "QRCodeScan"("qrCodeId", "createdAt");

-- CreateIndex
CREATE INDEX "QRCodeScan_userId_createdAt_idx" ON "QRCodeScan"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "QRCodeScan" ADD CONSTRAINT "QRCodeScan_qrCodeId_fkey" FOREIGN KEY ("qrCodeId") REFERENCES "QRCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRCodeScan" ADD CONSTRAINT "QRCodeScan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
