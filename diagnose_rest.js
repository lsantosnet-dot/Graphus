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
  if (!apiKey) {
    console.error("API Key not found");
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("AVAILABLE_MODELS_START");
      data.models.forEach(model => {
        if (model.supportedGenerationMethods.includes("embedContent")) {
           console.log(model.name);
        }
      });
      console.log("AVAILABLE_MODELS_END");
    } else {
      console.log("RESPONSE_ERROR:", JSON.stringify(data));
    }
  } catch (error) {
    console.error("FETCH_ERROR:", error.message);
  }
}

listModels();
