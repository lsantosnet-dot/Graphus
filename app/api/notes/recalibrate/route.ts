
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Obter usuário logado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    console.log(`--- INICIANDO RECALIBRAÇÃO PARA USUÁRIO ${user.id} ---`);

    // 2. Buscar todas as notas do usuário
    const { data: notas, error: fetchError } = await supabase
      .from("notas")
      .select("id, titulo, conteúdo")
      .eq("user_id", user.id);

    if (fetchError) throw fetchError;
    if (!notas || notas.length === 0) {
      return NextResponse.json({ success: true, message: "Nenhuma nota para recalibrar." });
    }

    // 3. Limpar conexões automáticas (origens do usuário)
    // Nota: Como queremos limpar apenas as conexões do usuário, 
    // filtramos por notas que pertencem a ele.
    const notaIds = notas.map(n => n.id);
    await supabase
      .from("conexoes")
      .delete()
      .in("id_origem", notaIds)
      .eq("tipo_conexao", "automatica");

    let count = 0;

    // 4. Reprocessar cada nota
    for (const nota of notas) {
      try {
        const input = `Título: ${nota.titulo}\nConteúdo: ${nota.conteúdo}`;
        const embedding = await generateEmbedding(input);

        // Atualizar nota
        await supabase
          .from("notas")
          .update({ embedding })
          .eq("id", nota.id);

        // Buscar similares (Threshold 0.6)
        const { data: similares, error: searchError } = await supabase.rpc("buscar_notas_similares", {
          query_embedding: embedding,
          match_threshold: 0.6,
          match_count: 5,
        });

        if (searchError) throw searchError;

        // Criar conexões
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
            await supabase.from("conexoes").insert(conexoes);
            count += conexoes.length;
          }
        }
      } catch (err) {
        console.error(`Erro recalibrando nota ${nota.id}:`, err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Recalibração concluída. ${notas.length} notas processadas, ${count} conexões criadas.` 
    });

  } catch (error: any) {
    console.error("Erro na Recalibração:", error);
    return NextResponse.json({ error: error.message || "Erro desconhecido" }, { status: 500 });
  }
}
