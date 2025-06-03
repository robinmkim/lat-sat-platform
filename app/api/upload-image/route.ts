// app/api/upload-image/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const CLOUDFLARE_IMAGE_UPLOAD_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
    const DELIVERY_BASE_URL = process.env.CLOUDFLARE_IMAGE_DELIVERY_URL!; // https://imagedelivery.net/xxx

    // 업로드용 FormData 구성
    const uploadForm = new FormData();
    uploadForm.append("file", new Blob([buffer]), file.name);

    const res = await fetch(CLOUDFLARE_IMAGE_UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: uploadForm,
    });

    const result = await res.json();

    if (!result.success) {
      console.error("Cloudflare 업로드 실패:", result);
      return NextResponse.json(
        { error: "Cloudflare 업로드 실패" },
        { status: 500 }
      );
    }

    const imageId = result.result.id;
    const imageUrl = `${DELIVERY_BASE_URL}/${imageId}/public`; // variant 이름이 public인 경우

    return NextResponse.json({
      success: true,
      imageId,
      imageUrl,
    });
  } catch (err) {
    console.error("이미지 업로드 중 오류:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
