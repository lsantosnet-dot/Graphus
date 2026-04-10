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

async function listAll() {
  const genAI = new GoogleGenerativeAI(apiKey);
  // List models is not directly on genAI, we might need to use a different approach 
  // or just try common names. Actually, embedding models are usually:
  // models/text-embedding-004
  // models/embedding-001
  
  const test = async (name) => {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const res = await model.embedContent("test");
      console.log("SUCCESS:" + name);
      return true;
    } catch (e) {
      console.log("FAIL:" + name + " -> " + e.message);
      return false;
    }
  }

  await test("text-embedding-004");
  await test("models/text-embedding-004");
  await test("embedding-001");
  await test("models/embedding-001");
}
listAll();
