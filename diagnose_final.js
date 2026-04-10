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

async function diagnose() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  
  console.log("--- EMBEDDING MODELS FOUND ---");
  data.models.filter(m => m.supportedGenerationMethods.includes("embedContent")).forEach(m => {
    console.log(m.name);
  });
  
  console.log("--- GENERATIVE MODELS FOUND ---");
  data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => {
    console.log(m.name);
  });
}
diagnose();
