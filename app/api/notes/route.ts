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
    const embeddingInput = `Título: ${titulo}\nConteúdo: ${conteúdo}`;
    const embedding = await generateEmbedding(embeddingInput);
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
      match_threshold: 0.6,
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
    console.error("💥 Erro Crítico na API (POST):", error);
    return NextResponse.json({ success: false, error: error.message || "Erro desconhecido" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, titulo, conteúdo } = await request.json();
    const supabase = await createClient();

    console.log(`--- ATUALIZANDO NOTA ${id} ---`);

    // 1. Atualizar conteúdo da nota
    const { data: nota, error: updateError } = await supabase
      .from("notas")
      .update({ titulo, conteúdo })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Erro no UPDATE da nota:", updateError);
      throw updateError;
    }

    // 2. Processamento IA (Novo Embedding)
    const embeddingInput = `Título: ${titulo}\nConteúdo: ${conteúdo}`;
    const embedding = await generateEmbedding(embeddingInput);
    
    // Atualizar embedding no banco
    const { error: embedUpdateError } = await supabase
      .from("notas")
      .update({ embedding: embedding })
      .eq("id", id);

    if (embedUpdateError) {
      console.error("❌ Erro no UPDATE do embedding:", embedUpdateError);
      throw embedUpdateError;
    }

    // 3. Reciclar Conexões Automáticas
    // Removemos apenas as conexões 'automatica' onde esta nota é a origem
    const { error: deleteConnError } = await supabase
      .from("conexoes")
      .delete()
      .eq("id_origem", id)
      .eq("tipo_conexao", "automatica");

    if (deleteConnError) {
      console.error("❌ Erro ao remover conexões antigas:", deleteConnError);
    }

    // 4. Buscar novas similaridades
    const { data: similares, error: searchError } = await supabase.rpc("buscar_notas_similares", {
      query_embedding: embedding,
      match_threshold: 0.6,
      match_count: 5,
    });

    if (searchError) {
      console.error("❌ Erro no RPC search (PATCH):", searchError);
    }

    if (similares && similares.length > 0) {
      const novasConexoes = similares
        .filter((s: any) => s.id !== id)
        .map((s: any) => ({
          id_origem: id,
          id_destino: s.id,
          peso: s.similaridade,
          tipo_conexao: "automatica",
        }));

      if (novasConexoes.length > 0) {
        console.log(`🔗 Renovando ${novasConexoes.length} conexões...`);
        const { error: connError } = await supabase.from("conexoes").insert(novasConexoes);
        if (connError) console.error("❌ Erro ao inserir novas conexões:", connError);
      }
    }

    return NextResponse.json({ success: true, nota });
  } catch (error: any) {
    console.error("💥 Erro Crítico na API (PATCH):", error);
    return NextResponse.json({ success: false, error: error.message || "Erro desconhecido" }, { status: 500 });
  }
}
