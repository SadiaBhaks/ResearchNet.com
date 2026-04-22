"use client";
import { useState, FormEvent } from 'react'; 
import ResearchCard from '@/components/ResearchCard';
import { useDarkMode } from "@/components/DarkModeContext";
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  TrendingUp, 
  GitCompare, 
  Bookmark,
  Search,
  Sparkles,
  Filter,
  X,
  BarChart3,
  ChevronRight
} from "lucide-react";

import { primaryGradient, textColor } from "@/theme/theme";

interface Paper {
  id: string;
  title: string;
  authors?: string[];
  year?: number;
  url?: string;
}

export default function Research() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [narrowing, setNarrowing] = useState(false);
  const [refinedTopics, setRefinedTopics] = useState<string[]>([]);
  const { darkMode } = useDarkMode();

  const handleSearch = async (e?: FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return; 

    setLoading(true);
    try {
      const res = await fetch(`/api/research?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data.results || []);
      if (!customQuery) setRefinedTopics([]); 
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNarrowDown = async () => {
    if (!query.trim()) return;
    setNarrowing(true);
    try {
      const res = await fetch(`/api/research/narrow`, {
        method: 'POST',
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setRefinedTopics(data.refinedTopics || []);
    } catch (error) {
      console.error("Narrow down failed:", error);
    } finally {
      setNarrowing(false);
    }
  };

  return (
    <div className=" flex min-h-screen  ">
      
      <aside className={`w-64  border-r p-6  md:flex flex-col gap-8 transition-colors sticky top-0 h-screen ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-2 px-2">
          <Image 
            src="/icon.svg" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="rounded-lg shadow-lg shadow-sky-500/20"
          />
          <span className={`text-xl hidden sm:inline font-bold tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>ResearchNet</span>
        </div>

        <nav className="flex flex-col gap-1 ">
          <Link href="/research" className={`flex items-center gap-3 p-2.5 rounded-xl  transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white bg-white/5' : 'hover:bg-slate-100 text-slate-600 bg-slate-50'}`}>
            <LayoutDashboard size={18}/> <span className="hidden sm:inline">Discover Hub</span>
            
          </Link>
          <Link href="/trending-section" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <TrendingUp size={18}/> <span className="hidden sm:inline">Trending Topics</span>
          </Link>
          <Link href="/compare" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <GitCompare size={18}/> <span className="hidden sm:inline">Compare</span>
          </Link>
          <Link href="/library" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <Bookmark size={18}/> <span className="hidden sm:inline">Saved Topics</span>
          </Link>
          <Link href="/summarize" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
            <Sparkles size={18}/> <span className="hidden sm:inline">Summarize</span>
          </Link>
          <Link href="/analysis" className={`flex items-center gap-3 p-2.5 rounded-xl transition-all font-semibold ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
             <BarChart3 size={18} /> <span className="hidden sm:inline">Citation Analysis</span>
          </Link>
        </nav>
      </aside>
    

      <main className="flex-2 min-h-screen pt-4 transition-colors duration-300 "
  style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}
>
  <div className="max-w-6xl md:mx-w-4xl mx-auto text-center mt-6 sm:mt-10 mb-8 ">
    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-6 tracking-tighter"
      style={{ color: darkMode ? textColor.dark : textColor.light }}>
      Discover Research
    </h1>
    
    <form onSubmit={handleSearch} className="w-full md:max-w-3xl  mx-auto relative group">
  <div className={`flex flex-col sm:flex-row items-stretch sm:items-center p-2 rounded-2xl shadow-2xl border-2 transition-all ${
    darkMode ? 'bg-black/40 border-white/10 focus-within:border-gray-500/50' : 'bg-white border-transparent focus-within:border-gray-500/20'
  }`}>
    
    {/* Input row */}
    <div className="flex items-center flex-1">
      <Search className=" opacity-30 shrink-0" size={20} style={{ color: darkMode ? textColor.dark : textColor.light }} />
      <input
        className="flex-1 bg-transparent p-4 outline-none text-base sm:text-lg font-medium min-w-0"
        style={{ color: darkMode ? textColor.dark : textColor.light }}
        placeholder="Search topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>

    
    <div className="flex gap-2 px-2 pb-2 sm:pb-0 sm:px-0">
      <button
        type="button"
        onClick={handleNarrowDown}
        disabled={narrowing || loading}
        className="flex-1 sm:flex-none bg-sky-600 hover:bg-sky-700 text-white px-4 py-3 sm:py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {narrowing
          ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          : <Filter size={18} />}
        <span className="font-bold text-xs uppercase tracking-widest">Narrow</span>
      </button>

      <button
        type="submit"
        disabled={loading}
        className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
      >
        {loading ? "..." : "Explore"}
      </button>
    </div>
  </div>
</form>

  
    {refinedTopics.length > 0 && (
      <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-top-4">
         <span className="w-full text-xs font-bold uppercase opacity-50 mb-1 flex items-center justify-center gap-2">
           <Sparkles size={14} /> Refine your focus:
         </span>
         {refinedTopics.map((topic, index) => (
           <button
             key={index}
             onClick={() => {
               setQuery(topic);
               handleSearch(undefined, topic);
             }}
             className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
               darkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-slate-200 text-slate-700 hover:shadow-lg'
             }`}
           >
             {topic} <ChevronRight size={14} className="opacity-40" />
           </button>
         ))}
         <button onClick={() => setRefinedTopics([])} className="p-2 opacity-40 hover:opacity-100 transition-opacity"><X size={18}/></button>
      </div>
    )}
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
    {results.map((paper) => (
      <ResearchCard key={paper.id} paper={paper} />
    ))}
  </div>
</main>
    </div>
  );
}