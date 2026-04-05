import { runGemini } from "./gemini";

export async function executeNode(node: any, inputs: any) {
  try {
    switch (node.type) {
      // ✅ TEXT NODE
      case "text":
        return node.data?.text || "";

      // ✅ IMAGE NODE
      case "image":
        return node.data?.image_url || null;

      // ✅ VIDEO NODE
      case "video":
        return node.data?.video_url || null;

      // 🔥 LLM NODE (UPDATED — MULTI INPUT SUPPORT)
      case "llm":
        return await runGemini(
          inputs.user_message || node.data?.userPrompt || "",
          inputs.system_prompt || node.data?.systemPrompt || "",
          inputs.images ? [inputs.images].flat() : [],
        );

      // 🔥 CROP NODE (STRUCTURED OUTPUT)
      case "crop":
        return {
          type: "image",
          url: inputs.image_url,
          crop: {
            x: node.data?.x_percent || 0,
            y: node.data?.y_percent || 0,
            width: node.data?.width_percent || 100,
            height: node.data?.height_percent || 100,
          },
        };

      // 🔥 EXTRACT FRAME NODE
      case "extract":
        return {
          type: "image",
          url: inputs.video_url,
          timestamp: node.data?.timestamp || "0",
        };

      default:
        return null;
    }
  } catch (error: any) {
    console.error(`Error in node ${node.id}:`, error);

    return {
      error: true,
      message: error.message || "Execution failed",
    };
  }
}
