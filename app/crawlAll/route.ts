import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request) {
  const pages = await prisma.pages.findMany({
    where: { status: "ACTIVE" },
  });

  // only calling, not waiting
  void Promise.all(
    pages.map(async (page) => {
      await fetch(page.url);
    })
  );

  return NextResponse.json({ message: "Start to crawling..." });
}
