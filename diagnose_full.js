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
} catch (e) {
  console.error("Error reading .env.local:", e.message);
}

async function diagnose() {
  if (!apiKey) {
    console.error("No API key found.");
    return;
  }

  console.log("Checking v1beta models...");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      console.log("\n--- Models (v1beta) ---");
      data.models.forEach(m => {
        console.log(`- ${m.name} [${m.supportedGenerationMethods.join(", ")}]`);
      });
    } else {
      console.log("\nNo models found in v1beta response:", data);
    }
  } catch (e) {
    console.error("Error fetching v1beta models:", e.message);
  }

  console.log("\nChecking v1 models...");
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    if (data.models) {
      console.log("\n--- Models (v1) ---");
      data.models.forEach(m => {
        console.log(`- ${m.name} [${m.supportedGenerationMethods.join(", ")}]`);
      });
    } else {
      console.log("\nNo models found in v1 response:", data);
    }
  } catch (e) {
    console.error("Error fetching v1 models:", e.message);
  }
}

diagnose();
