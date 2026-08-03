-- CreateTable
CREATE TABLE "DeliveryPartner" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartner_phoneNumber_key" ON "DeliveryPartner"("phoneNumber");

-- CreateIndex
CREATE INDEX "DeliveryPartner_phoneNumber_idx" ON "DeliveryPartner"("phoneNumber");

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "assignedToId" TEXT;

-- CreateIndex
CREATE INDEX "Order_assignedToId_idx" ON "Order"("assignedToId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "DeliveryPartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
