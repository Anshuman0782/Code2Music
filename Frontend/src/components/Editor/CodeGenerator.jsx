import React, { useState } from "react";
import Navbar from "../Layout/Navbar";
import { Copy } from "lucide-react";

const CodeGenerator = () => {
  const [language, setLanguage] = useState("C");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    "C", "CPP", "JAVA", "JAVASCRIPT", "TYPESCRIPT",
    "PYTHON", "GO", "RUST", "PHP", "SQL", "RUBY",
  ];

  const handleGenerate = async () => {
    if (!language || !description.trim()) {
      alert("Please enter both language and description.");
      return;
    }

    setLoading(true);
    setCode("");

    // Use primary + backup keys
    const apiKeys = [
      import.meta.env.VITE_OPENAI_API_KEY,
      import.meta.env.VITE_OPENAI_API_KEY_BACKUP,
    ];

    let generatedCode = "// ❌ Could not generate code. Please try again later.";

    for (let key of apiKeys) {
      if (!key) continue;
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `Write only the ${language} code for the following task, without any explanation:\n${description}`,
              },
            ],
            max_tokens: 350,
            temperature: 0.7,
          }),
        });

        if (!response.ok) continue;

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          const messageContent = data.choices[0].message.content.trim();
          generatedCode = extractCode(messageContent);
          break;
        }
      } catch {
        continue;
      }
    }

    // Add delay to show animation (e.g., 1.5s)
    setTimeout(() => {
      setCode(generatedCode);
      setLoading(false);
    }, 1500);
  };

  const extractCode = (text) => {
    const match = text.match(/```(?:\w*\n)?([\s\S]*?)```/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <h2 className="text-3xl font-extrabold">✨ Code Generator</h2>
            <p className="text-sm text-gray-200">Generate clean code instantly</p>
          </div>

          {/* Inputs + Output */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Side */}
            <div className="flex flex-col gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Describe the task you want code for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 rounded-lg border border-gray-300 h-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Generating..." : "Generate Code"}
              </button>
            </div>

            {/* Output Side */}
            <div className="bg-gray-900 p-6 rounded-xl shadow-inner flex flex-col items-center justify-center relative">
              {loading ? (
                // 🌟 Beautiful Loading Animation
                <div className="flex flex-col items-center gap-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <p className="text-blue-300 text-sm font-medium">Generating your code...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3 w-full">
                    <h3 className="font-semibold text-lg text-white">Generated Code</h3>
                    {code && (
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-md transition text-white"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                  <textarea
                    value={code}
                    readOnly
                    className="w-full h-[400px] p-4 font-mono text-sm bg-gray-950 text-green-300 rounded-lg resize-none leading-6 border border-gray-700 focus:outline-none"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeGenerator;
