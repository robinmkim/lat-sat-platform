-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "passage" TEXT DEFAULT '',
    "choices" JSONB,
    "answer" JSONB NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'MULTIPLE',
    "tableData" JSONB,
    "imageUrl" TEXT DEFAULT '',
    "showTable" BOOLEAN NOT NULL DEFAULT true,
    "showImage" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_testId_number_key" ON "Section"("testId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Question_sectionId_index_key" ON "Question"("sectionId", "index");
