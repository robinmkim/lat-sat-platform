/*
  Warnings:

  - You are about to alter the column `answer` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `index` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "passage" TEXT,
    "choices" JSONB,
    "answer" JSONB NOT NULL,
    "isMultipleChoice" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL,
    "tableData" JSONB,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("answer", "choices", "createdAt", "id", "imageUrl", "isMultipleChoice", "passage", "questionText", "sectionId", "tableData", "type", "updatedAt") SELECT "answer", "choices", "createdAt", "id", "imageUrl", "isMultipleChoice", "passage", "questionText", "sectionId", "tableData", "type", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE UNIQUE INDEX "Question_sectionId_index_key" ON "Question"("sectionId", "index");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
