// app/api/upload-image/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const hashFromClient = formData.get("hash") as string | null;

    if (!file || !hashFromClient) {
      return NextResponse.json(
        { error: "파일 또는 해시 누락" },
        { status: 400 }
      );
    }

    // DB에서 동일 해시 이미지 존재 여부 확인
    const existing = await prisma.image.findFirst({
      where: { hash: hashFromClient },
    });

    if (existing) {
      return NextResponse.json({
        reused: true,
        imageId: existing.id,
        imageUrl: existing.url,
        externalId: existing.externalId,
      });
    }

    // Cloudflare 설정
    const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
    const CLOUDFLARE_IMAGE_UPLOAD_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
    const DELIVERY_BASE_URL = process.env.CLOUDFLARE_IMAGE_DELIVERY_URL!;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudflare에 업로드
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

    const externalId = result.result.id;
    const imageUrl = `${DELIVERY_BASE_URL}/${externalId}/public`;

    // DB에 이미지 저장
    const created = await prisma.image.create({
      data: {
        url: imageUrl,
        externalId,
        hash: hashFromClient,
      },
    });

    return NextResponse.json({
      reused: false,
      imageId: created.id,
      imageUrl,
      externalId,
    });
  } catch (err) {
    console.error("이미지 업로드 중 오류:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
