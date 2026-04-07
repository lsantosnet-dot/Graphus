import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateEmbedding, extractEntities } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { titulo, conteúdo, user_id } = await request.json();

    // 1. Inserir nota inicial
    const { data: nota, error: insertError } = await supabase
      .from("notas")
      .insert([{ titulo, conteúdo, user_id }])
      .select()
      .single();

    if (insertError) throw insertError;

    // 2. Processamento IA (Pode ser feito em background se houver suporte a Edge Functions, 
    // mas aqui faremos no fluxo do request para simplicidade inicial)
    const embedding = await generateEmbedding(conteúdo);
    const entidades = await extractEntities(conteúdo);

    // 3. Atualizar nota com embedding
    await supabase
      .from("notas")
      .update({ embedding })
      .eq("id", nota.id);

    // 4. Buscar similaridade e criar conexões
    const { data: similares, error: searchError } = await supabase.rpc("buscar_notas_similares", {
      query_embedding: embedding,
      match_threshold: 0.8,
      match_count: 5,
    });

    if (!searchError && similares) {
      const conexoes = similares
        .filter((s: any) => s.id !== nota.id) // Evitar auto-conexão
        .map((s: any) => ({
          id_origem: nota.id,
          id_destino: s.id,
          peso: s.similaridade,
          tipo_conexao: "automatica",
        }));

      if (conexoes.length > 0) {
        await supabase.from("conexoes").insert(conexoes);
      }
    }

    return NextResponse.json({ success: true, nota, entidades });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
