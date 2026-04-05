import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type NodeType = {
  id: string;
  type: string;
  data: any;
};

type EdgeType = {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nodes, edges } = await req.json();

    const nodeMap: Record<string, NodeType> = {};
    nodes.forEach((n: NodeType) => (nodeMap[n.id] = n));

    const results: Record<string, any> = {};

    // 🔗 Build dependency graph
    const dependencies: Record<string, string[]> = {};
    nodes.forEach((n: NodeType) => {
      dependencies[n.id] = [];
    });

    edges.forEach((e: EdgeType) => {
      dependencies[e.target].push(e.source);
    });

    // 🔁 Recursive executor (handles chaining + parallel)
    const executeNode = async (nodeId: string): Promise<any> => {
      if (results[nodeId]) return results[nodeId];

      const node = nodeMap[nodeId];

      // ⏳ Wait for dependencies
      const deps = dependencies[nodeId];
      const depResults = await Promise.all(
        deps.map((depId) => executeNode(depId))
      );

      try {
        switch (node.type) {
          case "text":
            results[nodeId] = node.data.text || "";
            break;

          case "image":
            results[nodeId] = node.data.image_url || "";
            break;

          case "video":
            results[nodeId] = node.data.video_url || "";
            break;

          case "crop":
            results[nodeId] = {
              cropped: true,
              input: depResults[0] || node.data,
            };
            break;

          case "extract":
            results[nodeId] = {
              frame: "extracted-frame-url",
            };
            break;

          case "llm":
            const inputText = depResults.join("\n");

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        {
                          text: `${node.data.systemPrompt}\n${inputText}\n${node.data.userPrompt}`,
                        },
                      ],
                    },
                  ],
                }),
              }
            );

            const data = await response.json();

            results[nodeId] =
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              "No response";

            break;

          default:
            results[nodeId] = "Unknown node";
        }
      } catch (err) {
        results[nodeId] = "Error";
      }

      return results[nodeId];
    };

    // 🚀 Execute ALL nodes (parallel safe)
    await Promise.all(nodes.map((n: NodeType) => executeNode(n.id)));

    // 💾 Save history
    const run = await prisma.runHistory.create({
      data: {
        workflowId: "temp", // replace later
        status: "SUCCESS",
        nodeResults: results,
      },
    });

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Execution failed" }, { status: 500 });
  }
}