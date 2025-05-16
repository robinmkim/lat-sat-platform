import { prisma } from "@/lib/prisma";

export async function getQuestion(sectionId: string, index: number) {
  return await prisma.question.findUnique({
    where: {
      sectionId_index: {
        sectionId,
        index,
      },
    },
  });
}
