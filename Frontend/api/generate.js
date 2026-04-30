import Groq from "groq-sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "Groq API key missing" });
    }

    const { language, description } = req.body;

    if (!language || !description) {
      return res.status(400).json({ error: "Missing inputs" });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
You are a strict code generator.

Rules:
- Only output code
- No explanation
- No markdown backticks
- No comments unless necessary

Task:
${description}

Language: ${language}
`;

    const result = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a strict code generator. Only output raw code. No explanation, no markdown, no backticks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2048,
    });

    const code = result.choices[0]?.message?.content || "// ❌ No code generated";

    return res.status(200).json({ code });

  } catch (error) {
    console.error("GROQ ERROR:", error);
    return res.status(500).json({
      error: "Failed to generate code",
      details: error.message,
    });
  }
}