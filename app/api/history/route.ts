import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const runs = await prisma.runHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json(runs);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}