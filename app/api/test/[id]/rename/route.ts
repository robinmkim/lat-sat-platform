import { prisma } from "lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return new Response(
        JSON.stringify({ error: "이름이 유효하지 않습니다." }),
        {
          status: 400,
        }
      );
    }

    await prisma.test.update({
      where: { id },
      data: { name },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (e) {
    console.error("이름 변경 실패:", e);
    return new Response(
      JSON.stringify({ error: "이름 변경 중 오류가 발생했습니다." }),
      { status: 500 }
    );
  }
}
