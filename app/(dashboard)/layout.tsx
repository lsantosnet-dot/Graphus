import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BrainCircuit, Search, LogOut } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Shared Header */}
      <header className="fixed top-0 left-0 right-0 p-6 z-40 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 glass p-2 px-5 rounded-2xl pointer-events-auto border-white/5 shadow-2xl">
          <BrainCircuit className="text-primary w-5 h-5" />
          <h1 className="font-outfit font-black text-lg tracking-tighter text-white">GRAPHUS</h1>
        </div>

        <div className="flex gap-3 pointer-events-auto">
          <div className="glass flex items-center px-4 rounded-2xl border-white/5 h-12">
            <Search size={16} className="text-white/40 mr-2" />
            <input 
              type="text" 
              placeholder="Pesquisa..." 
              className="bg-transparent border-none focus:outline-none text-xs w-24 md:w-48 placeholder:text-white/20 text-white"
            />
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-24 pb-32">
        {children}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
