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
  
  // Teste de inserção e update manual com log detalhado
  console.log("Teste de inspeção de banco...");
  
  const { data, error } = await supabase.from("notas").select("*").limit(1);
  if (data && data.length > 0) {
    console.log("Colunas encontradas na tabela 'notas':", Object.keys(data[0]));
  } else {
    console.log("Nenhuma nota encontrada ou erro:", error);
  }
}

inspect();
