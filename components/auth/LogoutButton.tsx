"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="glass w-12 h-12 flex items-center justify-center rounded-2xl border-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all text-white/40"
      title="Sair"
    >
      <LogOut size={18} />
    </button>
  );
}
