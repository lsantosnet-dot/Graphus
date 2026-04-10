import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

// Manually load .env.local since we are in a script
const envFile = fs.readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split("="))
);

async function listModels() {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
  
  console.log("--- Gemini Model Diagnosis ---");
  const modelsToTest = [
    "text-embedding-004",
    "embedding-001",
    "models/text-embedding-004",
    "models/embedding-001"
  ];
  
  for (const m of modelsToTest) {
    try {
      console.log(`Testing model: ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.embedContent("Graphus deep research test");
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
