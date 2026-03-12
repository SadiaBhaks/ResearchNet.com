"use client";

import React, { useState } from "react";
import { useDarkMode } from "@/components/DarkModeContext";
import { GitCompare, TrendingUp, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import { primaryGradient, secondaryColor, textColor,cardBg } from "@/theme/theme";
import Link from "next/link";

export default function ComparePage() {
  const { darkMode } = useDarkMode();
  const [topicA, setTopicA] = useState("");
  const [topicB, setTopicB] = useState("");
  const [dataA, setDataA] = useState<any>(null);
  const [dataB, setDataB] = useState<any>(null);
  const [loading, setLoading] = useState(false);
   const card = darkMode ? cardBg.dark : cardBg.light;

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Fetching both topics in parallel
      const [resA, resB] = await Promise.all([
        fetch(`https://api.openalex.org/topics?search=${topicA}&per-page=1`),
        fetch(`https://api.openalex.org/topics?search=${topicB}&per-page=1`)
      ]);
      const [jsonA, jsonB] = await Promise.all([resA.json(), resB.json()]);
      
      setDataA(jsonA.results[0]);
      setDataB(jsonB.results[0]);
    } catch (err) {
      console.error("Comparison failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
         
      <div className="max-w-7xl mx-auto">
        <div> <Link
            href="/research"
            className="text-blue-600 text-sm font-bold flex items-center gap-2 mb-4 hover:underline"
          >
            ← Back to Discover Hub
          </Link></div>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
             
          <div className={`p-3  rounded-2xl shadow-lg shadow-sky-500/20 text-white ${darkMode ? 'bg-purple-500'   : 'bg-sky-500  '}`}>
            <GitCompare size={28} />
          </div>
          <div>
            <h1 className={`text-4xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Topic Analysis & Comparison
            </h1>
            <p className="text-sm opacity-50 font-medium" style={{ color: darkMode ? textColor.dark : textColor.light }}>
              Side-by-side metric evaluation of global research trends.
            </p>
          </div>
        </div>

       <form onSubmit={handleCompare} className="  mb-12 ">
            <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
          <div className="flex flex-col gap-2">

            <label className="text-[10px] uppercase font-black opacity-50 ml-2">Topic A</label>

            <input

              className={`p-4 rounded-xl outline-none border-2 transition-all ${darkMode ? 'bg-slate-900 border-white/5 focus:border-sky-500' : 'bg-white border-slate-100 focus:border-sky-500'}`}

              placeholder="e.g. Artificial Intelligence"

              onChange={(e) => setTopicA(e.target.value)}

            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="text-[10px] uppercase font-black opacity-50 ml-2">Topic B</label>

            <input

              className={`p-4 rounded-xl outline-none border-2 transition-all ${darkMode ? 'bg-slate-900 border-white/5 focus:border-sky-500' : 'bg-white border-slate-100 focus:border-sky-500'}`}

              placeholder="e.g. Quantum Computing"

              onChange={(e) => setTopicB(e.target.value)}

            />

          </div>
          </div>

          <button className={`flex justify-center item-center mx-auto  text-white text-xl font-black p-4 m-8 px-20 rounded-xl shadow-xl  transition-all active:scale-95 ${darkMode ? 'bg-purple-500  hover:bg-purple-900' : 'bg-sky-500  hover:bg-sky-900'}`}
>

            {loading ? "Analyzing..." : "Run Comparison"}

          </button>

        </form>

        {/* Comparison Result UI */}
        {dataA && dataB && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Analysis Summary Card - Full Width */}
            <div className="lg:col-span-2 p-6 rounded-3xl border-2 "  style={{
                    backgroundColor: card.backgroundColor,
                    border: card.border,
                    backdropFilter: card.backdropFilter,
                    borderRadius: card.borderRadius,
                    padding: "2rem", // Increased padding for a bigger, cleaner look
                    boxShadow: card.shadow,
                    color: darkMode ? textColor.dark : textColor.light,
                  }}>
               <h3 className={` font-black text-xs uppercase tracking-widest mb-2 ${darkMode ? 'text-purple-500'   : 'text-sky-500  '}`}>Automated Insights</h3>
               <p className={`text-lg font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                 {dataA.cited_by_count > dataB.cited_by_count 
                  ? `${dataA.display_name} has a significantly higher citation impact, suggesting it is a more established domain.`
                  : `${dataB.display_name} currently leads in global citations, indicating higher academic authority.`}
               </p>
            </div>

            {/* Topic A Card */}
            <CompareCard data={dataA} darkMode={darkMode} color="sky" />
            
            {/* Topic B Card */}
            <CompareCard data={dataB} darkMode={darkMode} color="indigo" />

          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Sub-Component for the Comparison Cards
function CompareCard({ data, darkMode, color }: { data: any, darkMode: boolean, color: string }) {
  return (
    <div className={`p-8 rounded-3xl border-2 transition-all ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-500/10 text-slate-500 uppercase tracking-widest mb-4 inline-block">
        {data.field.display_name}
      </span>
      <h2 className={`text-3xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{data.display_name}</h2>
      
      <div className="space-y-6">
        <MetricRow label="Total Works" value={data.works_count.toLocaleString()} icon={<BookOpen size={16}/>} />
        <MetricRow label="Total Citations" value={data.cited_by_count.toLocaleString()} icon={<BarChart3 size={16}/>} />
        <MetricRow label="Impact Per Work" value={(data.cited_by_count / data.works_count).toFixed(2)} icon={<TrendingUp size={16}/>} />
      </div>

      <div className="mt-8 p-4 rounded-2xl bg-slate-500/5 italic text-sm text-slate-500 leading-relaxed">
        {data.description}
      </div>
    </div>
  );
}

function MetricRow({ label, value, icon }: { label: string, value: string, icon: any }) {
    const { darkMode } = useDarkMode();
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm uppercase">
        {icon} {label}
      </div>
      <div className={`text-xl font-black ${darkMode ? 'text-purple-500' : 'text-sky-500'}`}>{value}</div>
    </div>
  );
}