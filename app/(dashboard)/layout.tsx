import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BrainCircuit, Search, LogOut } from "lucide-react";
import BottomNav from "@/components/navigation/BottomNav";
import LogoutButton from "@/components/auth/LogoutButton";
import SearchBar from "@/components/navigation/SearchBar";

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
        <div className="flex items-center gap-3 glass p-2 px-6 rounded-3xl pointer-events-auto border-white/[0.03] shadow-xl">
          <BrainCircuit className="text-primary w-5 h-5 opacity-80" />
          <h1 className="serif-title text-xl text-foreground/90">Graphus</h1>
        </div>

        <div className="flex gap-3 pointer-events-auto">
          <SearchBar />
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
