const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

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
} catch (e) {}

async function listModels() {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ["text-embedding-004", "embedding-001", "models/embedding-004"];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.embedContent("test");
      if (result) {
        console.log("WORKING_MODEL=" + m);
        return;
      }
    } catch (e) {}
  }
}
listModels();
