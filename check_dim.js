const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

let apiKey = "";
try {
  const envFile = fs.readFileSync(".env.local", "utf8");
  const lines = envFile.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("GEMINI_API_KEY=")) {
      apiKey = line.split("=")[1].trim();
      break;
    }
  }
} catch (e) {}

async function check() {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
  try {
    const res = await model.embedContent("test");
    console.log("Size default:", res.embedding.values.length);
    
    // Testar se suporta outputDimensionality
    const res768 = await model.embedContent({
      content: { parts: [{ text: "test" }] },
      outputDimensionality: 768
    });
    console.log("Size with 768 param:", res768.embedding.values.length);
  } catch (e) {
    console.log("Error during check:", e.message);
  }
}
check();
