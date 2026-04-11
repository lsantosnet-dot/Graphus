"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  
  const [searchValue, setSearchValue] = useState(queryParam);

  useEffect(() => {
    setSearchValue(queryParam);
  }, [queryParam]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }
      
      const newQuery = params.toString();
      const path = window.location.pathname;
      router.replace(newQuery ? `${path}?${newQuery}` : path, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, router, searchParams]);

  return (
    <div className="glass flex items-center px-4 rounded-2xl border-white/5 h-12 w-full max-w-[300px] transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(0,243,255,0.1)]">
      <Search size={16} className="text-white/40 mr-2 shrink-0" />
      <input 
        type="text" 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Pesquisa semântica..." 
        className="bg-transparent border-none focus:outline-none text-xs w-full placeholder:text-white/20 text-white"
      />
      {searchValue && (
        <button 
          onClick={() => setSearchValue("")}
          className="p-1 hover:bg-white/5 rounded-full transition-colors"
        >
          <X size={14} className="text-white/40" />
        </button>
      )}
    </div>
  );
}
