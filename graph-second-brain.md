# PLAN: Graphus (Second Brain Graph)

**Status**: ⏳ Aguardando Aprovação
**Project Type**: WEB (Next.js 15)
**Slugs**: graph-second-brain

## 📋 Resumo
Implementação de um PWA "Second Brain" de alto desempenho com grafo interativo e IA generativa para conexões automáticas entre notas.

---

## 🛠️ Task Breakdown

### Phase 1: Foundation (Infra)
- [ ] **Task 1: Init Next.js 15 Project**
  - **Agent**: `frontend-specialist`
  - **Input**: User requirement
  - **Output**: Clean Next.js 15 scaffold
  - **Verify**: `npm run dev` starts successfully
- [ ] **Task 2: Supabase Schema & pgvector Setup**
  - **Agent**: `database-architect`
  - **Input**: Provided SQL in request
  - **Output**: Migration file + Supabase dashboard tables
  - **Verify**: `notas` and `conexoes` tables exist in Supabase

### Phase 2: Logic & AI (Backend)
- [ ] **Task 3: Gemini 1.5 Integration**
  - **Agent**: `backend-specialist`
  - **Input**: Content text
  - **Output**: Embeddings (768d) + JSON entities
  - **Verify**: Script test returning valid vector and entity list
- [ ] **Task 4: Auto-Connection Logic**
  - **Agent**: `backend-specialist`
  - **Input**: New note embedding
  - **Output**: Entries in `conexoes` table
  - **Verify**: Query `buscar_notas_similares` returns expected matches

### Phase 3: Interface (Frontend)
- [ ] **Task 5: Force Graph Component**
  - **Agent**: `frontend-specialist`
  - **Input**: Nodes/Edges from DB
  - **Output**: Interactive canvas with zoom/pan
  - **Verify**: Visible nodes on dashboard
- [ ] **Task 6: Markdown Editor & Suggested Links**
  - **Agent**: `frontend-specialist`
  - **Input**: Typing debounced
  - **Output**: Similar notes panel updated real-time
  - **Verify**: Similar notes list updates as user types

### Phase 4: PWA & Polish
- [ ] **Task 7: PWA Config & Service Worker**
  - **Agent**: `frontend-specialist`
  - **Input**: Manifest rules
  - **Output**: `manifest.json` + `sw.js`
  - **Verify**: Chrome DevTools → Application → Service Worker active
- [ ] **Task 8: Performance & UI Audit**
  - **Agent**: `performance-optimizer`
  - **Input**: Localhost URL
  - **Output**: Performance report
  - **Verify**: `python .agent/scripts/checklist.py .` passes

---

## 🚀 Phase X: Final Verification
- [ ] No purple/violet hex codes (Anti-cliché)
- [ ] Glassmorphism depth in all panels
- [ ] Google Fonts: Outfit (Titles) / Inter (Body)
- [ ] PWA "Add to Home Screen" functional
