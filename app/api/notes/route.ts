import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, extractEntities } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { titulo, conteúdo, user_id } = await request.json();
    const supabase = await createClient();

    console.log("--- INICIANDO PROCESSO DE NOTA ---");

    // 1. Inserir nota inicial
    const { data: nota, error: insertError } = await supabase
      .from("notas")
      .insert([{ titulo, conteúdo, user_id }])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Erro no INSERT:", insertError);
      throw insertError;
    }
    console.log("✅ Nota inserida ID:", nota.id);

    // 2. Processamento IA
    const embedding = await generateEmbedding(conteúdo);
    const entidades = await extractEntities(conteúdo);
    
    console.log("✅ IA Processada. Embedding size:", embedding?.length);

    // 3. Atualizar nota com embedding
    // Removido .single() para evitar erro se o RLS bloquear o retorno
    const { error: updateError, count } = await supabase
      .from("notas")
      .update({ embedding: embedding })
      .eq("id", nota.id)
      .select('*', { count: 'exact', head: true }); // Apenas para conferir se afetou algo

    if (updateError) {
      console.error("❌ Erro no UPDATE do embedding:", updateError);
      throw updateError;
    }
    
    console.log("✅ Update enviado para o banco.");

    // 4. Buscar similaridade e criar conexões
    const { data: similares, error: searchError } = await supabase.rpc("buscar_notas_similares", {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: 5,
    });

    if (searchError) {
      console.error("❌ Erro no RPC search:", searchError);
    }

    if (similares && similares.length > 0) {
      const conexoes = similares
        .filter((s: any) => s.id !== nota.id)
        .map((s: any) => ({
          id_origem: nota.id,
          id_destino: s.id,
          peso: s.similaridade,
          tipo_conexao: "automatica",
        }));

      if (conexoes.length > 0) {
        console.log(`🔗 Criando ${conexoes.length} conexões...`);
        const { error: connError } = await supabase.from("conexoes").insert(conexoes);
        if (connError) console.error("❌ Erro ao inserir conexões:", connError);
      }
    }

    return NextResponse.json({ success: true, nota, entidades });
  } catch (error: any) {
    console.error("💥 Erro Crítico na API:", error);
    return NextResponse.json({ success: false, error: error.message || "Erro desconhecido" }, { status: 500 });
  }
}
