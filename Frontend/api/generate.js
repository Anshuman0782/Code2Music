const response = await fetch("/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ language, description }),
});

const data = await response.json();

if (data.code) {
  generatedCode = data.code;
} else {
  generatedCode = "// ❌ Failed to generate code";
}