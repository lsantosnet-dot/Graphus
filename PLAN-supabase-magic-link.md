# PLAN: Supabase Magic Link Auth

**Status**: ⏳ Aguardando Aprovação
**Task Slug**: supabase-magic-link

## 📋 Resumo
Implementação de tela de login full-page com fundo Cyber-Grid, autenticação via Magic Link e proteção de rotas no cliente.

---

## 🛠️ Task Breakdown

### Phase 1: Auth Component
- [ ] **Task 1: Create Auth Component**
  - **Agent**: `frontend-specialist`
  - **Input**: `supabase.auth.signInWithOtp`
  - **Output**: `components/auth/Auth.tsx`
  - **Verify**: Input e-mail + Button "Enviar" visible.

### Phase 2: Session Management
- [ ] **Task 2: Integrate Session in Page.tsx**
  - **Agent**: `frontend-specialist`
  - **Input**: `supabase.auth.onAuthStateChange`
  - **Output**: Condicional render in `app/page.tsx`
  - **Verify**: Redirect to login if not authenticated.
- [ ] **Task 3: Add Logout Button**
  - **Agent**: `frontend-specialist`
  - **Input**: UI Component
  - **Output**: Button in Header
  - **Verify**: Session cleared and redirect back to Auth.

### Phase 3: Verification
- [ ] **Task 4: End-to-End Test**
  - **Agent**: `test-engineer`
  - **Input**: E-mail address
  - **Output**: Dashboard success
  - **Verify**: New note creation works (No RLS error).

---

## 🚀 Phase X: Final Verification
- [ ] Cyber-Grid background in Auth page.
- [ ] Success state after sending email.
- [ ] RLS validation on `notas` table.
