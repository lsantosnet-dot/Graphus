import { createClient } from "@supabase/supabase-js";
import fs from "fs";

let url = "";
let key = "";
try {
  const envFile = fs.readFileSync(".env.local", "utf8");
  const lines = envFile.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("NEXT_PUBLIC_SUPABASE_URL=")) url = line.split("=")[1].trim();
    if (line.trim().startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) key = line.split("=")[1].trim();
  }
} catch (e) {}

async function inspect() {
  const supabase = createClient(url, key);
  
  console.log("--- Inspeção de Dimensão de Vetor ---");
  
  // Como não podemos rodar SQL direto via cliente anon, vamos tentar deduzir 
  // ou buscar do plano original se existir.
  // Pero podemos intentar ler o rpc "buscar_notas_similares" se ele nos der uma pista.
  
  const { data, error } = await supabase.from("notas").select("embedding").limit(1);
  console.log("Erro ao ler notas:", error);
  if (data) {
     console.log("Lido com sucesso (provavelmente RLS aberto para leitura)");
  }
}

inspect();
