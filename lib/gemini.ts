import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Modelo para Geração de Embeddings (768 dimensões)
export async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Modelo para Extração de Entidades e Insight
export async function extractEntities(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Analise o texto abaixo e extraia as principais entidades (conceitos, pessoas, tecnologias, teorias).
    Retorne APENAS um array JSON de strings.
    Texto: "${text}"
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const cleanedJson = response.text().replace(/```json|```/g, "").trim();
  
  try {
    return JSON.parse(cleanedJson) as string[];
  } catch (e) {
    console.error("Erro ao parsear entidades:", e);
    return [];
  }
}
