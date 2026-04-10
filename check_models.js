const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Manually parse .env.local
let apiKey = "";
try {
  const envFile = fs.readFileSync(".env.local", "utf8");
  const lines = envFile.split("\n");
  for (const line of lines) {
    if (line.startsWith("GEMINI_API_KEY=")) {
      apiKey = line.split("=")[1].trim();
      break;
    }
  }
} catch (e) {
  console.error("Could not read .env.local");
}

async function listModels() {
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  console.log("--- Gemini Model Diagnosis (CJS) ---");
  const modelsToTest = [
    "text-embedding-004",
    "embedding-001",
    "models/text-embedding-004",
    "models/embedding-001",
    "text-embedding-004-v1",
    "text-embedding-004-v1beta"
  ];
  
  for (const m of modelsToTest) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      // Use simpler embedContent call
      const result = await model.embedContent({ content: { parts: [{ text: "Graphus research check" }] } });
      if (result.embedding.values) {
        console.log(`✅ SUCCESS: ${m} is working!`);
        process.exit(0);
      }
    } catch (e) {
      console.log(`❌ FAILED: ${m} -> ${e.message}`);
    }
  }
}

listModels().catch(console.error);
