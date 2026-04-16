"use client";

import { useState, useRef } from "react";
import { BarChart3, Quote, Network, Microscope, Upload, Loader2, FileCheck } from "lucide-react";
import { useDarkMode } from "@/components/DarkModeContext";
import { primaryGradient, secondaryColor, textColor } from "@/theme/theme";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

/** * MetricCard Props Interface to fix the "Unexpected any" linting error
 */
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
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
    if (file.type !== "application/pdf") return toast.error("Please upload a PDF file.");

    setFileName(file.name);
    setIsAnalyzing(true);
    const toastId = toast.loading("Analyzing citations...");

    try {
      
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
      
      <div> 
        <Link
          href="/research"
          className="text-blue-600 text-sm font-bold flex items-center gap-2 mb-4 hover:underline"
        >
          ← Back to Discover Hub
        </Link>
      </div>
      
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-black  tracking-tighter flex items-center gap-3" 
            style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          <BarChart3 size={32} /> CITATION ANALYSIS
        </h1>
        <p className="opacity-60 font-medium" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          Analyze impact factors, h-index, and reference networks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={<Quote />} label="Total Citations" value={metrics.citations} darkMode={darkMode} />
        <MetricCard icon={<Network />} label="H-Index" value={metrics.hIndex} darkMode={darkMode} />
        <MetricCard icon={<Microscope />} label="Impact Score" value={metrics.impact} darkMode={darkMode} />
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf" 
        className="hidden" 
      />

      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`mt-8 p-12 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:border-sky-500 group ${
          darkMode ? "border-white/10 bg-slate-900/40 shadow-inner" : "border-slate-300 bg-white shadow-xl"
        }`}
      >
        {isAnalyzing ? (
          <Loader2 size={48} className="animate-spin text-sky-500 mb-4" />
        ) : fileName ? (
          <FileCheck size={48} className="text-emerald-500 mb-4" />
        ) : (
          <BarChart3 size={48} className="mb-4 opacity-20 group-hover:opacity-100 group-hover:text-sky-500 transition-all" />
        )}
        
        <p className="font-bold text-center" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
          {isAnalyzing ? "Processing Research Metadata..." : 
           fileName ? `File: ${fileName}` : 
           "Click to upload paper for deep citation analysis"}
        </p>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, darkMode }: MetricCardProps) {
  return (
    <div className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${
      darkMode ? "bg-slate-900 border-white/10 text-white shadow-2xl" : "bg-white border-slate-200 shadow-xl"
    }`}>
      <div className="text-sky-500 mb-2">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );
}