import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Safe API key check
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI API KEY MISSING");
}

// ✅ Init Gemini
const genAI = new GoogleGenerativeAI(apiKey);

export async function runGemini(
  prompt: string,
  systemPrompt?: string,
  images?: string[]
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // ✅ Build prompt
    let finalPrompt = "";

    if (systemPrompt) {
      finalPrompt += `System: ${systemPrompt}\n\n`;
    }

    finalPrompt += `User: ${prompt}`;

    // ✅ Build parts array
    const parts: any[] = [{ text: finalPrompt }];

    // ✅ Add images (base64)
    if (images && images.length > 0) {
      images.forEach((img) => {
        parts.push({
          inlineData: {
            mimeType: "image/png",
            data: img.replace(/^data:image\/\w+;base64,/, ""), // remove prefix
          },
        });
      });
    }

    // ✅ FIXED API CALL (IMPORTANT 🔥)
    const result = await model.generateContent(parts);

    const response = await result.response;

    return response.text();
  } catch (error: any) {
    console.error("❌ Gemini Error:", error);
    return "Error generating response";
  }
}