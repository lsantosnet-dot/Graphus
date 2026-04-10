"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Sparkles, BrainCircuit, ShieldCheck, ArrowLeft } from "lucide-react";

type AuthView = "signin" | "verify";

export default function Auth() {
  const [supabase] = useState(() => createClient());
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(8).fill(""));
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<AuthView>("signin");
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first OTP input when switching to verify view
  useEffect(() => {
    if (view === "verify") {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [view]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("Supabase Error (Auth):", error);
      setError("Erro ao enviar código: " + error.message);
    } else {
      console.log("OTP Code sent via Supabase");
      setView("verify");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 8) return;

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setError("Código inválido ou expirado.");
      setOtp(Array(8).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      // Session established — reload to enter dashboard
      window.location.href = "/";
    }
    setLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 8 digits are filled
    if (value && index === 7) {
      const code = newOtp.join("");
      if (code.length === 8) {
        // Small delay so user sees the last digit appear
        setTimeout(() => handleVerifyWithCode(code), 150);
      }
    }
  };

  const handleVerifyWithCode = async (code: string) => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      setError("Código inválido ou expirado.");
      setOtp(Array(8).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (pasted.length === 0) return;

    const newOtp = Array(8).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    // Focus the next empty or last input
    const nextIndex = Math.min(pasted.length, 7);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if full paste
    if (pasted.length === 8) {
      setTimeout(() => handleVerifyWithCode(pasted), 150);
    }
  };

  const handleBack = () => {
    setView("signin");
    setOtp(Array(8).fill(""));
    setError("");
  };

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-background p-6">
      <div className="fixed inset-0 cyber-grid-bg -z-10" />
      
      <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border-white/5 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            {view === "signin" ? (
              <BrainCircuit className="text-primary w-10 h-10 animate-pulse-slow" />
            ) : (
              <ShieldCheck className="text-primary w-10 h-10" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-outfit font-black tracking-tighter neon-text shadow-primary">GRAPHUS</h1>
            <p className="text-white/40 text-sm mt-1 uppercase tracking-widest font-bold">
              {view === "signin" ? "Sinapses Cognitivas" : "Autenticação Neural"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center animate-in fade-in zoom-in duration-300">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Sign In View */}
        {view === "signin" && (
          <form onSubmit={handleSendCode} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  ENVIAR CÓDIGO <Sparkles size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* OTP Verification View */}
        {view === "verify" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-white/60 text-sm">
                  Enviamos um código de 8 dígitos para
                </p>
                <p className="text-primary font-bold">{email}</p>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 animate-pulse-slow">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                  📱 FOCO NO PWA: Digite os números abaixo. <br/>
                  Evite clicar no link para não sair do app.
                </p>
              </div>
            </div>

            {/* 8-Digit OTP Input */}
            <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`
                    w-10 h-14 text-center text-xl font-outfit font-black
                    bg-white/5 border rounded-xl
                    focus:outline-none focus:border-primary/70 focus:bg-primary/5 focus:shadow-[0_0_20px_rgba(0,243,255,0.15)]
                    transition-all duration-200
                    ${digit ? "border-primary/40 text-primary" : "border-white/10 text-white"}
                  `}
                  disabled={loading}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-3 py-2 animate-in fade-in duration-300">
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Verificando Identidade...</span>
              </div>
            )}

            {/* Back button */}
            <button
              onClick={handleBack}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white/30 hover:text-white text-xs uppercase tracking-widest font-bold py-3 transition-all disabled:opacity-30"
            >
              <ArrowLeft size={14} />
              Usar outro e-mail
            </button>
          </div>
        )}

        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Criptografia Simbiótica Ativa</p>
        </div>

        {/* Version Marker for debugging cache */}
        <div className="absolute bottom-4 right-6 opacity-20 text-[8px] font-mono uppercase tracking-widest pointer-events-none text-white/40">
          Neural-Auth-v1.2-OTP
        </div>
      </div>
    </div>
  );
}
