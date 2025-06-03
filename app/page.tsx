export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  return <HomeClient tests={tests} />;
}
