"use client";

import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/components/DarkModeContext";
import { BookOpen, BarChart3, Quote } from "lucide-react";
import { primaryGradient, secondaryColor } from "@/theme/theme";
import Link from "next/link";

export default function TrendingTopics() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("https://api.openalex.org/topics?sort=cited_by_count:desc&per-page=6");
        const data = await res.json();
        setTopics(data.results);
      } catch (err) {
        console.error("Failed to fetch trending Topics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return (
    <div className="h-40 flex items-center justify-center animate-pulse font-bold"
      style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
      Gathering Global Trends...
    </div>
  );

  return (
    <div className="py-8" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
      <div> <Link
            href="/research"
            className="text-blue-600 text-sm font-bold flex items-center gap-2 mb-4 ml-4 hover:underline"
          >
            ← Back to Discover Hub
          </Link></div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className={`text-2xl font-black uppercase tracking-tight border-l-8 border-sky-500 rounded-tl-lg rounded-bl-lg p-2 m-4 ${darkMode ? 'text-white' : 'text-black'}`}>
          Trending Research Areas
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {topics.map((topic) => {
          
          const citationsPerWork = (topic.cited_by_count / topic.works_count).toFixed(1);
          
          return (
            <div
              key={topic.id}
              className={`p-6 rounded-2xl border flex flex-col gap-4 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                darkMode ? 'bg-slate-900/90 border-slate-700 shadow-sky-500/5' : 'bg-white border-slate-200 shadow-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black px-2 py-1 rounded bg-sky-500/10 uppercase tracking-widest"
                  style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
                  {topic.field.display_name}
                </span>
                <div className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[10px] font-black uppercase">
                  Active Trend
                </div>
              </div>

              <div>
                <h3 className={`font-bold text-lg leading-tight mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  {topic.display_name}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">
                  {topic.description}
                </p>
              </div>

              
              <div className={`flex items-center gap-4 p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
               
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black opacity-50">Global Citations</span>
                  <span className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {topic.cited_by_count.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Works</span>
                    <span className="text-xs font-black" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
                      {topic.works_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Impact</span>
                    <span className="text-xs font-black text-green-500">
                      {citationsPerWork}x
                    </span>
                  </div>
                </div>
                
                <a
                  href={topic.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:scale-110 font-bold text-[11px] uppercase tracking-tighter flex items-center gap-2 transition-all px-3 py-2 rounded-lg  text-white shadow-lg  ${darkMode ? 'shadow-purple-500/20' : 'shadow-sky-500/20'}`} 
                  style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}
                >
                  Explore <BookOpen size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}