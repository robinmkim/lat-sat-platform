-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "passage" TEXT DEFAULT '',
    "choices" JSONB,
    "answer" TEXT,
    "type" TEXT NOT NULL DEFAULT 'MULTIPLE',
    "tableTitle" TEXT,
    "tableData" JSONB,
    "imageUrl" TEXT DEFAULT '',
    "showTable" BOOLEAN NOT NULL DEFAULT false,
    "showImage" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answer", "choices", "createdAt", "id", "imageUrl", "index", "passage", "questionText", "score", "sectionId", "showImage", "showTable", "tableData", "tableTitle", "type", "updatedAt") SELECT "answer", "choices", "createdAt", "id", "imageUrl", "index", "passage", "questionText", "score", "sectionId", "showImage", "showTable", "tableData", "tableTitle", "type", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_sectionId_index_key" ON "Question"("sectionId", "index");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
