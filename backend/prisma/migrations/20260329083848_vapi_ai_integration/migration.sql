-- CreateTable
CREATE TABLE "vapi_calls" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "vapiCallId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "transcript" TEXT,
    "summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'initiated',
    "suggestions" JSONB,
    "crisisDetected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vapi_calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vapi_calls_assessmentId_key" ON "vapi_calls"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "vapi_calls_vapiCallId_key" ON "vapi_calls"("vapiCallId");

-- CreateIndex
CREATE INDEX "vapi_calls_userId_idx" ON "vapi_calls"("userId");

-- CreateIndex
CREATE INDEX "vapi_calls_status_idx" ON "vapi_calls"("status");

-- AddForeignKey
ALTER TABLE "vapi_calls" ADD CONSTRAINT "vapi_calls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vapi_calls" ADD CONSTRAINT "vapi_calls_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
