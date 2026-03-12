"use client";
import { useState } from 'react';
import ResearchCard from '@/components/ResearchCard';
import { useDarkMode } from "@/components/DarkModeContext";
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  TrendingUp, 
  GitCompare, 
  Bookmark,
  Search
} from "lucide-react";

import { primaryGradient, secondaryColor, textColor, cardBg } from "@/theme/theme";

export default function Research() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useDarkMode();

  const handleSearch = async (e: any) => {
    e.preventDefault();
    if (!query.trim()) return; // Don't search if empty
    
    setLoading(true);
    try {
      const res = await fetch(`/api/research?query=${query}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className={`w-64 border-r p-6 hidden md:flex flex-col gap-8 transition-colors sticky top-0 h-screen ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
         
        <div className="flex items-center gap-2 px-2">
          {/* Changed bg-[#00a388] to bg-sky-500 */}
         <Image 

    src="/icon.svg" 

    alt="Logo" 

    width={40} 

    height={40} 

    className="rounded-lg shadow-lg shadow-sky-500/20"

  />
          <span className={`text-xl font-bold tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>ResearchNet</span>
        </div>

        <nav className="flex flex-col gap-1">
          <Link href="/research" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <LayoutDashboard size={18}/> Discover Hub
          </Link>
          
          {/* Section Link: Changed href to #trending-section */}
          <Link href="/trending-section" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <TrendingUp size={18}/> Trending Topics 
          </Link>
          
          <Link href="/compare" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <GitCompare size={18}/> Compare
          </Link>
          
          <Link href="/library" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <Bookmark size={18}/> Saved Topics
          </Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 min-h-screen p-8 transition-colors duration-300"
        style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}
      >
        <div className="max-w-6xl mx-auto text-center mt-10 mb-16">
          <h1 className="text-7xl font-black mb-6 tracking-tighter"
            style={{ color: darkMode ? textColor.dark : textColor.light }}>
            Discover Research
          </h1>
          
          <p className="mb-10 text-sm font-bold opacity-40 uppercase tracking-widest" 
             style={{ color: darkMode ? textColor.dark : textColor.light }}>
            AI-Powered Academic Insights
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className={`flex items-center p-2 rounded-2xl shadow-2xl transition-all duration-500 border-2 ${
              darkMode 
                ? 'bg-black/40 border-white/10 focus-within:border-gray-500/50' 
                : 'bg-white border-transparent focus-within:border-gray-500/20'
            }`}>
              
              <Search className="ml-4 opacity-30" size={20} style={{ color: darkMode ? textColor.dark : textColor.light }} />
              
              <input
                className="flex-1 bg-transparent p-4 outline-none text-lg font-medium"
                style={{ color: darkMode ? textColor.dark : textColor.light }}
                placeholder="Search quantum computing, lung cancer..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <button
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-900 disabled:bg-gray-800 text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-xl shadow-gray-500/40 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Searching</span>
                  </>
                ) : (
                  "Explore"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {results.map((paper: any) => (
            <ResearchCard key={paper.id} paper={paper} />
          ))}
        </div>
        
      
      </main>
    </div>
  );
}
