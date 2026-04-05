import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nodes, edges } = await req.json();

    const workflow = await prisma.workflow.create({
      data: {
        name: "My Workflow",
        nodes,
        edges,
        userId,
      },
    });

    return NextResponse.json(workflow);
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}