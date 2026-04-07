-- 1. Habilita a extensão para embeddings
create extension if not exists vector;

-- 2. Tabela de Notas (Os "Nós" do Grafo)
create table notas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  titulo text not null,
  conteúdo text,
  embedding vector(768), -- Usando 768 para Gemini 1.5
  created_at timestamp with time zone default now()
);

-- 3. Tabela de Conexões (As "Arestas" do Grafo)
create table conexoes (
  id uuid primary key default gen_random_uuid(),
  id_origem uuid references notas(id) on delete cascade,
  id_destino uuid references notas(id) on delete cascade,
  peso float default 1.0, -- Pode ser a força da similaridade
  tipo_conexao text default 'automatica', -- 'manual' ou 'automatica'
  unique(id_origem, id_destino)
);

-- Habilitar RLS
alter table notas enable row level security;
alter table conexoes enable row level security;

-- Políticas RLS para Notas
create policy "Usuários podem ver suas próprias notas"
  on notas for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar suas próprias notas"
  on notas for insert
  with check (auth.uid() = user_id);

-- 4. Função para busca por similaridade (Cosseno)
create or replace function buscar_notas_similares (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  titulo text,
  similaridade float
)
language sql stable
as $$
  select
    id,
    titulo,
    1 - (notas.embedding <=> query_embedding) as similaridade
  from notas
  where 1 - (notas.embedding <=> query_embedding) > match_threshold
  order by notas.embedding <=> query_embedding
  limit match_count;
$$;
