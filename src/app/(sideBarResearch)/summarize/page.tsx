"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Sparkles, Save, Copy, Loader2, RefreshCw, BookOpen } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { primaryGradient, secondaryColor, textColor, cardBg } from "@/theme/theme";
import { useDarkMode } from "@/components/DarkModeContext";

export default function SummarizerPage() {
  const { darkMode } = useDarkMode();
  const { data: session } = useSession();
  const router = useRouter();

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getActiveEmail = () => {
    if (session?.user?.email) return session.user.email;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexusUser");
      if (saved) return JSON.parse(saved).email;
    }
    return null;
  };

  
  const handleSummarize = async () => {
    if (!text) return toast.error("Please paste some text first!");
    
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text:text }),
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data.summary);
        toast.success("AI Summary Generated! ✨");
      } else {
        throw new Error(data.error || "Failed to generate summary");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to summarize.");
    } finally {
      setIsSummarizing(false);
    }
  };

  
  const handleSaveToLibrary = async () => {
    const userEmail = getActiveEmail();
    if (!summary || !userEmail) return toast.error("Please login to save.");

    setIsSaving(true);
    try {
      
      const cleanTitle = text.split('\n')[0].substring(0, 60) || "Untitled Research";

      const payload = {
        title: cleanTitle,
        userEmail: userEmail,
        userNote: "AI Generated Abstract",
        aiSummary: summary,    
        trendLevel: "Research",
        feasibility: 100,
        doi: "N/A",
        tags: ["AI", "Summarized"]
      };

      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        toast.success("Added to Library! 📚");
        router.push("/library");
      } else {
        throw new Error(data.error || "Database save failed");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full  p-6 space-y-8" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
      <Toaster position="top-center" />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          <Sparkles className= ""style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }} /> PAPER SUMMARIZER
        </h1>
        <p className="opacity-50 font-medium" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>Transform dense research into actionable insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <section className={`p-6 rounded-[2rem] border ${darkMode ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest "  style={{ color: darkMode ? textColor.dark : textColor.light }}>Source Content</span>
            <button onClick={() => { setText(""); setSummary(""); }} className={`text-[10px] font-bold opacity-30  transition-all uppercase ${darkMode ? 'text-gray-200 ' : 'text-gray-900 '}`}>Clear Canvas</button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the abstract or content here..."
            className={`w-full h-80 p-5 rounded-2xl border-2 outline-none transition-all resize-none font-medium ${
              darkMode ? 'bg-slate-800 border-transparent focus:border-sky-500 text-white' : 'bg-slate-50 border-transparent focus:border-sky-500 text-slate-900'
            }`}
          />
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-gray-500/20"
          >
            
            {isSummarizing ? "Synthesizing..." : " Summarize"}
          </button>
        </section>

        {/* Output Section */}
        <section className={`p-6 rounded-[2rem] border relative ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black uppercase tracking-widest "  style={{ color: darkMode ? textColor.dark : textColor.light }}>Generated Insight</span>
            {summary && (
              <button 
                onClick={() => { navigator.clipboard.writeText(summary); toast.success("Copied to clipboard!"); }}
                className="p-2 hover:bg-sky-500/10 rounded-lg transition-colors text-sky-500"
              >
                <Copy size={18} />
              </button>
            )}
          </div>

          <div className={`h-80 overflow-y-auto p-4 rounded-2xl leading-relaxed font-medium ${!summary && 'flex items-center justify-center opacity-30 italic'} ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
            {summary || "Waiting for content analysis..."}
          </div>

          <button
            onClick={handleSaveToLibrary}
            disabled={!summary || isSaving}
            className={`w-full mt-4 flex items-center justify-center gap-2 p-4 rounded-2xl font-black transition-all active:scale-95 ${
              summary 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'
            }`}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <BookOpen size={20} />}
            Save to Research Library
          </button>
        </section>
      </div>
    </div>
  );
}