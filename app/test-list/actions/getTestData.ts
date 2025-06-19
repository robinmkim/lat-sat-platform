// app/test-list/actions/getTestData.ts
"use server";

import { getAllSectionsWithQuestions } from "lib/queries/getQuestion";
import { SectionWithQuestions } from "types/question";

export async function fetchTestEditData(
  testId: string
): Promise<SectionWithQuestions[]> {
  const data = await getAllSectionsWithQuestions(testId);
  return data;
}
