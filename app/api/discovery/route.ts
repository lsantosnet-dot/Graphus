import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/gemini";
import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY);

export async function POST(request: Request) {
  try {
    const { notaId, titulo, conteúdo, user_id } = await request.json();
    const supabase = await createClient();

    console.log(`--- INICIANDO DESCOBERTA SEMÂNTICA PARA: ${titulo} ---`);

    if (!process.env.EXA_API_KEY) {
      throw new Error("EXA_API_KEY não configurada no ambiente.");
    }

    // 1. Busca no Exa usando o conteúdo da nota como 'semente'
    // Autoprompt magic: o Exa entende o contexto
    const searchResult = await exa.searchAndContents(
      `Aqui está uma nota sobre ${titulo}: ${conteúdo}. Encontre um conteúdo relacionado que traga uma perspectiva nova, técnica ou complementar.`,
      {
        type: "auto",
        numResults: 1,
        text: true,
        highlights: true
      }
    );

    const externalNote = searchResult.results[0];

    if (!externalNote) {
      return NextResponse.json({ success: false, message: "Nenhuma referência relevante encontrada no momento." }, { status: 404 });
    }

    console.log("✅ Conteúdo externo encontrado:", externalNote.title);

    // 2. Gerar o embedding para a nova nota (768 dimensões)
    const embeddingInput = `Título: ${externalNote.title}\nConteúdo: ${externalNote.text}`;
    const newEmbedding = await generateEmbedding(embeddingInput);

    // 3. Salvar a nota "surpresa" no Supabase
    // Vinculado ao user_id do autor da descoberta
    const { data: savedNote, error: insertError } = await supabase
      .from('notas')
      .insert({
        titulo: `[Ref] ${externalNote.title}`,
        "conteúdo": externalNote.text,
        embedding: newEmbedding,
        user_id: user_id, // Vinculado ao usuário logado
        metadata: { 
          url: externalNote.url, 
          source: 'Exa.ai', 
          type: 'discovery',
          original_note_id: notaId 
        }
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Erro ao salvar nota externa:", insertError);
      throw insertError;
    }

    // 4. Criar a conexão (Aresta do Grafo) entre a nota original e a nova
    const { error: connError } = await supabase.from('conexoes').insert({
      id_origem: notaId,
      id_destino: savedNote.id,
      tipo_conexao: 'descoberta_ia',
      peso: 0.95 // Alta relevância inicial
    });

    if (connError) {
      console.error("❌ Erro ao criar conexão de descoberta:", connError);
      // Não falhamos a requisição se apenas a conexão falhar, mas logamos
    }

    return NextResponse.json({ 
      success: true, 
      newNote: savedNote,
      message: "Nova sinapse externa estabelecida com sucesso!" 
    });

  } catch (error: any) {
    console.error("💥 Erro na Descoberta Semântica:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Falha na expansão de conhecimento." 
    }, { status: 500 });
  }
}
