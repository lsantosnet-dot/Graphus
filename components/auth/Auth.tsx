"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getURL } from "@/lib/supabase/url";
import { Mail, Sparkles, BrainCircuit } from "lucide-react";

export default function Auth() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getURL()}auth/callback`,
      },
    });

    if (error) {
      alert("Erro ao enviar link: " + error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-background p-6">
      <div className="fixed inset-0 cyber-grid-bg -z-10" />
      
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <BrainCircuit className="text-primary w-10 h-10 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-4xl font-outfit font-black tracking-tighter neon-text shadow-primary">GRAPHUS</h1>
            <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold">Sinapses Cognitivas</p>
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase ml-1">E-mail para Acesso</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="exemplo@brain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary text-background font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-background/20 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  ACESSAR O GRAFO <Sparkles size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="py-10">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <Mail className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold font-outfit">Verifique seu E-mail</h2>
              <p className="text-white/60 mt-2">
                Enviamos um link mágico de acesso para <br/>
                <span className="text-primary font-bold">{email}</span>
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-white/30 hover:text-white text-xs underline underline-offset-4"
            >
              Inserir outro e-mail
            </button>
          </div>
        )}

        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Criptografia Simbiótica Ativa</p>
        </div>
      </div>
    </div>
  );
}
