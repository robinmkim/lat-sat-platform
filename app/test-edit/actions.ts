"use server";

export async function saveQuestion(formData: FormData) {
  const raw = formData.get("payload");

  if (!raw) {
    console.error("No payload received");
    return;
  }

  const parsed = JSON.parse(raw as string);

  console.log(parsed);

  for (const question of parsed) {
    console.log("문제 ID:", question.id);
    console.log("문제 유형:", question.type);

    if (question.type === "multiple") {
      console.log("선택지들:", question.choices);
      console.log("정답 인덱스:", question.correctAnswer);
    } else if (question.type === "passage") {
      console.log("지문:", question.passage);
    }
  }
}
