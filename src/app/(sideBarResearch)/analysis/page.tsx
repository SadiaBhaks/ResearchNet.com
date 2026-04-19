"use client";

import { useState, useRef } from "react";
import { 
  BarChart3, Quote, Network, Microscope, 
  Loader2, FileCheck, Sparkles, ArrowLeft 
} from "lucide-react";
import { useDarkMode } from "@/components/DarkModeContext";
import { primaryGradient, secondaryColor } from "@/theme/theme";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

/** * Props Interface for the Metric Card
 * Includes description to help users understand the data
 */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
  darkMode: boolean;
}

export default function CitationAnalysis() {
  const { darkMode } = useDarkMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({ citations: 0, hIndex: 0, impact: "N/A" });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      return toast.error("Please upload a PDF file.");
    }

    setFileName(file.name);
    setIsAnalyzing(true);
    const toastId = toast.loading("Analyzing citations...");

    try {
      // Simulate API call for citation extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMetrics({
        citations: Math.floor(Math.random() * 150) + 10,
        hIndex: Math.floor(Math.random() * 20) + 5,
        impact: (Math.random() * 5 + 1).toFixed(1)
      });

      toast.success("Analysis Complete!", { id: toastId });
    } catch (err: unknown) {
      console.error(err);
      toast.error("Analysis failed. Try again.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full p-6 min-h-screen transition-colors duration-500" 
         style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
      <Toaster position="top-center" />
      
      {/* Navigation Header */}
      <div className="mb-8">
        <Link
          href="/research"
          className={`group flex items-center gap-2 text-sm font-bold transition-all ${
            darkMode ? 'text-sky-400 hover:text-sky-300' : 'text-blue-600 hover:text-blue-800'
          }`}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Discover Hub
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-10">
          <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4" 
              style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
            <BarChart3 size={40} className="text-sky-500" /> 
            CITATION ANALYSIS
          </h1>
          
          <div className={`p-6 rounded-[2rem] border transition-all ${
            darkMode ? 'bg-white/5 border-white/10 text-white/70' : 'bg-blue-50 border-blue-100 text-slate-600'
          }`}>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-sky-500">
              <Sparkles size={16} /> How it works
            </h2>
            <p className="text-sm leading-relaxed">
              Our system parses the bibliography of your PDF to generate a <strong>Citation Network</strong>. 
              This allows us to calculate the paper's influence via total citations, the author's productivity 
              through the H-Index, and the overall field prestige via the Impact Score.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard 
            icon={<Quote size={24} />} 
            label="Total Citations" 
            value={metrics.citations} 
            description="Measures the total frequency this work is referenced by other researchers."
            darkMode={darkMode} 
          />
          <MetricCard 
            icon={<Network size={24} />} 
            label="H-Index" 
            value={metrics.hIndex} 
            description="The 'h' number of papers that have at least 'h' citations each."
            darkMode={darkMode} 
          />
          <MetricCard 
            icon={<Microscope size={24} />} 
            label="Impact Score" 
            value={metrics.impact} 
            description="The relative importance of a paper based on journal citation averages."
            darkMode={darkMode} 
          />
        </div>

        {/* Upload Zone */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".pdf" 
          className="hidden" 
        />

        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`p-16 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-[1.01] group ${
            darkMode 
              ? "border-white/10 bg-slate-900/40 hover:border-sky-500/50 hover:bg-slate-900/60" 
              : "border-slate-300 bg-white shadow-2xl hover:border-blue-400"
          }`}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center">
              <Loader2 size={60} className="animate-spin text-sky-500 mb-6" />
              <span className="text-sky-500 font-black animate-pulse">ANALYZING METADATA...</span>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center text-center">
              <FileCheck size={60} className="text-emerald-500 mb-4" />
              <p className="text-lg font-bold text-emerald-500">Ready: {fileName}</p>
              <p className="text-xs opacity-50 mt-2">Click to change file</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-all">
                <BarChart3 size={40} className="text-sky-500" />
              </div>
              <p className="text-xl font-black tracking-tight mb-2" style={{ color: darkMode ? "#fff" : "#1e293b" }}>
                Upload Paper for Analysis
              </p>
              <p className="text-sm opacity-50 max-w-xs mx-auto">
                Drop your PDF here to extract deep citation metrics and reference scores.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * MetricCard Sub-component
 */
function MetricCard({ icon, label, value, description, darkMode }: MetricCardProps) {
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all hover:translate-y-[-4px] group ${
      darkMode 
        ? "bg-slate-900 border-white/10 text-white shadow-2xl hover:border-sky-500/30" 
        : "bg-white border-slate-100 shadow-xl hover:shadow-2xl"
    }`}>
      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">{label}</p>
      <h3 className="text-4xl font-black mb-4 tracking-tighter">{value}</h3>
      <p className={`text-xs leading-relaxed font-medium transition-opacity ${
        darkMode ? "text-white/40 group-hover:text-white/80" : "text-slate-400 group-hover:text-slate-600"
      }`}>
        {description}
      </p>
    </div>
  );
}