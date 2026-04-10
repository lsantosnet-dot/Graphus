
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const env = {};
try {
    const envFile = fs.readFileSync(".env.local", "utf8");
    envFile.split("\n").forEach(line => {
        const [key, ...value] = line.split("=");
        if (key && value) {
            env[key.trim()] = value.join("=").trim();
        }
    });
} catch (e) {
    console.warn("Aviso: .env.local não encontrado ou ilegível.");
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiKey = env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
    console.error("Erro: Variáveis de ambiente faltando.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);

async function generateEmbedding(text) {
    const model = genAI.getGenerativeModel({ model: "models/text-embedding-004" });
    const result = await model.embedContent({
        content: { parts: [{ text }] },
        outputDimensionality: 768
    });
    return result.embedding.values;
}

async function recalibrate() {
    console.log("🚀 Iniciando Recalibração de Conexões semânticas...");

    const { data: notas, error: fetchError } = await supabase
        .from("notas")
        .select("id, titulo, conteúdo");

    if (fetchError) throw fetchError;
    console.log(`Encontradas ${notas.length} notas.`);

    console.log("🧹 Limpando conexões automáticas existentes...");
    await supabase.from("conexoes").delete().eq("tipo_conexao", "automatica");

    for (const nota of notas) {
        console.log(`\nProcessando: [${nota.titulo}]`);
        
        try {
            const input = `Título: ${nota.titulo}\nConteúdo: ${nota.conteúdo}`;
            const embedding = await generateEmbedding(input);

            await supabase.from("notas").update({ embedding }).eq("id", nota.id);

            const { data: similares, error: searchError } = await supabase.rpc("buscar_notas_similares", {
                query_embedding: embedding,
                match_threshold: 0.6,
                match_count: 5,
            });

            if (searchError) throw searchError;

            if (similares && similares.length > 0) {
                const conexoes = similares
                    .filter(s => s.id !== nota.id)
                    .map(s => ({
                        id_origem: nota.id,
                        id_destino: s.id,
                        peso: s.similaridade,
                        tipo_conexao: "automatica",
                    }));

                if (conexoes.length > 0) {
                    console.log(`🔗 Criando ${conexoes.length} conexões.`);
                    await supabase.from("conexoes").insert(conexoes);
                }
            }
        } catch (error) {
            console.error(`❌ Erro na nota ${nota.id}:`, error.message);
        }
    }

    console.log("\n✅ Recalibração concluída com sucesso!");
}

recalibrate();
