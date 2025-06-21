import { prisma } from "lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();
    const { name } = body;

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
