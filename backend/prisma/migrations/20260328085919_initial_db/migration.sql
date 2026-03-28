-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Province" AS ENUM ('KOSHI', 'MADHESH', 'BAGMATI', 'GANDAKI', 'LUMBINI', 'KARNALI', 'SUDURPASHCHIM');

-- CreateEnum
CREATE TYPE "District" AS ENUM ('TAPLEJUNG', 'SANKHUWASABHA', 'SOLUKHUMBU', 'OKHALDHUNGA', 'KHOTANG', 'BHOJPUR', 'DHANKUTA', 'TERHATHUM', 'PANCHTHAR', 'ILAM', 'JHAPA', 'MORANG', 'SUNSARI', 'UDAYAPUR', 'SAPTARI', 'SIRAHA', 'DHANUSHA', 'MAHOTTARI', 'SARLAHI', 'RAUTAHAT', 'BARA', 'PARSA', 'SINDHULI', 'RAMECHHAP', 'DOLAKHA', 'SINDHUPALCHOK', 'KAVREPALANCHOK', 'LALITPUR', 'BHAKTAPUR', 'KATHMANDU', 'NUWAKOT', 'RASUWA', 'DHADING', 'MAKWANPUR', 'CHITWAN', 'GORKHA', 'MANANG', 'MUSTANG', 'MYAGDI', 'KASKI', 'LAMJUNG', 'TANAHU', 'NAWALPUR', 'SYANGJA', 'PARBAT', 'BAGLUNG', 'RUKUM_EAST', 'ROLPA', 'PYUTHAN', 'GULMI', 'ARGHAKHANCHI', 'PALPA', 'NAWALPARASI_EAST', 'RUPANDEHI', 'KAPILVASTU', 'DANG', 'BANKE', 'BARDIYA', 'DOLPA', 'MUGU', 'HUMLA', 'JUMLA', 'KALIKOT', 'DAILEKH', 'JAJARKOT', 'RUKUM_WEST', 'SALYAN', 'SURKHET', 'BAJURA', 'BAJHANG', 'ACHHAM', 'DOTI', 'KAILALI', 'KANCHANPUR', 'DADELDHURA', 'BAITADI', 'DARCHULA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "genderNe" TEXT,
    "district" "District" NOT NULL,
    "districtNe" TEXT,
    "province" "Province" NOT NULL,
    "provinceNe" TEXT,
    "pinHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" BOOLEAN[],
    "score" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "suggestions" JSONB NOT NULL,
    "comment" TEXT,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_id_name_dob_idx" ON "users"("id", "name", "dob");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_dob_key" ON "users"("name", "dob");

-- CreateIndex
CREATE UNIQUE INDEX "user_tokens_token_key" ON "user_tokens"("token");

-- CreateIndex
CREATE INDEX "assessments_userId_idx" ON "assessments"("userId");

-- CreateIndex
CREATE INDEX "assessments_createdAt_idx" ON "assessments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "feedbacks_assessmentId_key" ON "feedbacks"("assessmentId");

-- CreateIndex
CREATE INDEX "feedbacks_userId_idx" ON "feedbacks"("userId");

-- AddForeignKey
ALTER TABLE "user_tokens" ADD CONSTRAINT "user_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
