// app/actions/getQuestionsBySection.ts
"use server";

import { prisma } from "lib/prisma";
import { parseChoices, parseTableData } from "@/components/utils/parser";
import { mapStringArrayToChoices } from "@/components/utils/choice";

export async function getQuestionsBySection(
  testId: string,
  sectionNumber: number
) {
  const section = await prisma.section.findFirst({
    where: { testId, number: sectionNumber },
    include: { questions: true },
  });

  if (!section) return null;

  const sorted = [...section.questions].sort((a, b) => a.index - b.index);

  return sorted.map((q) => ({
    id: q.id,
    index: q.index,
    question: q.questionText ?? "",
    passage: q.passage ?? undefined,
    choices: mapStringArrayToChoices(parseChoices(q.choices)),
    type: q.type,
    tableTitle: q.tableTitle ?? undefined,
    tableData: parseTableData(q.tableData),
    imageUrl: q.imageUrl ?? undefined,
  }));
}
