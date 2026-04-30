import { GoogleGenerativeAI } from "@google/generative-ai";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key missing" });
    }

    const { language, description } = req.body;

    if (!language || !description) {
      return res.status(400).json({ error: "Missing inputs" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
You are a strict code generator.

Rules:
- Only output code
- No explanation

Task:
${description}

Language: ${language}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text() || "// ❌ No code generated";

    return res.status(200).json({ code: text });

  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return res.status(500).json({
      error: "Failed to generate code",
      details: error.message,
    });
  }
}