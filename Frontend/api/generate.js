import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { language, description } = req.body;

    // Validation
    if (!language || !description) {
      return res.status(400).json({ error: "Missing inputs" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Write only ${language} code. No explanation:\n${description}`,
    });

    const output =
      response.output?.[0]?.content?.[0]?.text || "No code generated";

    res.status(200).json({ code: output });
  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({ error: "Failed to generate code" });
  }
}