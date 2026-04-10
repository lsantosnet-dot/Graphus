import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const EMBEDDING_MODELS = [
  "models/gemini-embedding-001",
  "models/embedding-001",
  "models/text-embedding-004"
];

const GENERATIVE_MODELS = [
  "models/gemini-2.5-flash",
  "models/gemini-2.0-flash",
  "models/gemini-1.5-flash"
];

// Modelo para Geração de Embeddings (768 dimensões para pgvector)
export async function generateEmbedding(text: string) {
  for (const modelName of EMBEDDING_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Especificamos outputDimensionality: 768 para compatibilidade com o banco
      // Usando técnica Matryoshka nativa do Gemini
      const result = await model.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 768
      });

      if (result.embedding.values) {
        // Double check de segurança: Truncar se por algum motivo retornar diferente
        return result.embedding.values.slice(0, 768);
      }
    } catch (error: any) {
      console.warn(`Tentativa falhou para ${modelName}:`, error.message);
      continue;
    }
  }
  throw new Error("Nenhum modelo de embedding disponível funcionou.");
}

// Modelo para Extração de Entidades e Insight
export async function extractEntities(text: string) {
  for (const modelName of GENERATIVE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `
        Analise o texto abaixo e extraia as principais entidades (conceitos, pessoas, tecnologias, teorias).
        Retorne APENAS um array JSON de strings.
        Texto: "${text}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();
      const cleanedJson = textResponse.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedJson) as string[];
    } catch (error: any) {
      console.warn(`Tentativa falhou para extração com ${modelName}:`, error.message);
      continue;
    }
  }
  return [];
}
