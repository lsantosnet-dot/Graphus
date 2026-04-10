"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    // Redirecionar se já estiver logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/");
      }
    });
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse-slow" />

      <div className="w-full max-w-md relative">
        {/* Logo / Header */}
        <div className="flex flex-col items-center gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <BrainCircuit className="text-primary w-10 h-10 animate-pulse-slow relative z-10" />
            <div className="absolute -top-1 -right-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-outfit font-black tracking-tighter text-white">
              GRAPH<span className="text-primary">US</span>
            </h1>
            <p className="text-white/40 text-xs mt-2 uppercase tracking-[0.3em] font-bold">
              Cognitive Node Architecture
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="glass p-10 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {!sent ? (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-outfit text-white/90">Bem-vindo pesquisador</h2>
                <p className="text-sm text-white/40">Inicie sua conexão cerebral via link mágico.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-white/20"
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-primary text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_40px_rgba(0,243,255,0.3)] hover:shadow-[0_0_60px_rgba(0,243,255,0.5)]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      ACESSAR O GRAFO <Zap size={18} fill="currentColor" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                  <Mail className="text-primary w-10 h-10" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-background border border-white/10 rounded-full flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold font-outfit text-white">Verifique seu E-mail</h2>
                <p className="text-white/40 text-sm leading-relaxed px-4">
                  Enviamos um portal de acesso temporário para <br/>
                  <span className="text-primary font-bold">{email}</span>
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setSent(false)}
                  className="text-white/30 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
                >
                  <span>Tente outro e-mail</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Card */}
          <div className="mt-10 pt-8 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Node-01 Active</span>
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">v0.1.0-alpha</p>
          </div>
        </div>

        {/* External Links */}
        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.3em] font-bold">
            Antigravity Research Labs © 2026
          </p>
        </div>
      </div>
    </div>
  );
}
