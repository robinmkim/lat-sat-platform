import { prisma } from "lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } // ✅ 이렇게 context에 직접 타입만 지정
) {
  const { id } = context.params;

  try {
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "이름이 유효하지 않습니다." },
        { status: 400 }
      );
    }

    await prisma.test.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("이름 변경 실패:", e);
    return NextResponse.json(
      { error: "이름 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
