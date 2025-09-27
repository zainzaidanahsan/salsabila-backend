-- CreateEnum
CREATE TYPE "Role" AS ENUM ('GURU', 'WALI_MURID', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" SERIAL NOT NULL,
    "mataPelajaran" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaliMurid" (
    "id" SERIAL NOT NULL,
    "telepon" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WaliMurid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Murid" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "waliId" INTEGER NOT NULL,
    "guruId" INTEGER NOT NULL,

    CONSTRAINT "Murid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nilai" (
    "id" SERIAL NOT NULL,
    "mataPelajaran" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,
    "keterangan" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "muridId" INTEGER NOT NULL,
    "guruId" INTEGER NOT NULL,

    CONSTRAINT "Nilai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_userId_key" ON "Guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WaliMurid_userId_key" ON "WaliMurid"("userId");

-- AddForeignKey
ALTER TABLE "Guru" ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaliMurid" ADD CONSTRAINT "WaliMurid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Murid" ADD CONSTRAINT "Murid_waliId_fkey" FOREIGN KEY ("waliId") REFERENCES "WaliMurid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Murid" ADD CONSTRAINT "Murid_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_muridId_fkey" FOREIGN KEY ("muridId") REFERENCES "Murid"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nilai" ADD CONSTRAINT "Nilai_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
