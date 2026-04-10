"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sparkles, Copy, Loader2, RefreshCw, BookOpen, FileText, Upload, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { primaryGradient, secondaryColor, textColor } from "@/theme/theme";
import { useDarkMode } from "@/components/DarkModeContext";

/**
 * Interface to resolve "Unexpected any" linting errors 
 * and provide type safety for the PDF.js library.
 */
interface PdfjsLib {
  version: string;
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument: (args: { data: ArrayBuffer }) => {
    promise: Promise<{
      numPages: number;
      getPage: (index: number) => Promise<{
        getTextContent: () => Promise<{
          items: Array<{ str?: string }>;
        }>;
      }>;
    }>;
  };
}

export default function SummarizerPage() {
  const { darkMode } = useDarkMode();
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  // State typed with interface instead of 'any'
  const [pdfLib, setPdfLib] = useState<PdfjsLib | null>(null);

  // --- EFFECT: Load PDF.js only on the Client ---
  useEffect(() => {
    const loadPdfJS = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // Worker CDN must match the library version
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        setPdfLib(pdfjs as unknown as PdfjsLib);
      } catch (err) {
        console.error("Failed to load PDF.js:", err);
      }
    };
    loadPdfJS();
  }, []);

  // --- PDF Extraction Logic ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!pdfLib) return toast.error("PDF engine is still loading. Please wait.");
    if (file.type !== "application/pdf") return toast.error("Please upload a valid PDF.");

    setIsExtracting(true);
    const toastId = toast.loading("Decrypting research paper...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      // Limit to 10 pages for stability
      const pageLimit = Math.min(pdf.numPages, 10);
      
      for (let i = 1; i <= pageLimit; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str || "");
        fullText += strings.join(" ") + "\n";
      }

      setText(fullText.trim());
      toast.success(`Extracted ${pageLimit} pages successfully!`, { id: toastId });
    } catch (err: unknown) {
      console.error("PDF Error:", err);
      toast.error("Could not read PDF. It might be encrypted or scanned.", { id: toastId });
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  const getActiveEmail = () => {
    if (session?.user?.email) return session.user.email;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexusUser");
      if (saved) return JSON.parse(saved).email;
    }
    return null;
  };

  const handleSummarize = async () => {
    if (!text || text.length < 50) return toast.error("Paste more content for a better summary!");
    setIsSummarizing(true);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        toast.success("Insight Extracted! ✨");
      } else {
        throw new Error(data.error || "AI was unable to process this.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection to Gemini failed.";
      toast.error(msg);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSaveToLibrary = async () => {
    const userEmail = getActiveEmail();
    if (!summary || !userEmail) return toast.error("Sign in to build your library.");
    setIsSaving(true);
    try {
      const firstLine = text.split('\n')[0].substring(0, 60).trim();
      const payload = {
        title: firstLine || "Research Note",
        userEmail,
        userNote: "Summarized via Topic Nexus AI",
        aiSummary: summary,
        trendLevel: "High",
        feasibility: 100,
        doi: "N/A",
        tags: ["AI", "Paper-Analysis"]
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
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-8 min-h-screen transition-colors duration-500" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>
      <Toaster position="top-center" />
      
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          <Sparkles size={32} className="animate-pulse" /> PAPER SUMMARIZER
        </h1>
        <p className="opacity-60 font-medium" style={{ color: darkMode ? secondaryColor.dark : secondaryColor.light }}>
          Upload a research paper to generate a concise, bulleted summary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <section className={`p-6 rounded-[2.5rem] border flex flex-col transition-all ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-2xl'}`}>
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: darkMode ? textColor.dark : textColor.light }}>Data Input</span>
            <div className="flex gap-4">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting || !pdfLib}
                  className="text-[11px] font-black text-sky-500 hover:text-sky-400 flex items-center gap-1.5 uppercase transition-all disabled:opacity-30"
                >
                  {isExtracting ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                  Import PDF
                </button>
                <button onClick={() => { setText(""); setSummary(""); }} className="text-[11px] font-black text-red-500/60 hover:text-red-500 flex items-center gap-1.5 uppercase transition-all">
                  <Trash2 size={12} /> Wipe
                </button>
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text here or use the Import button above..."
            className={`w-full h-[450px] p-6 rounded-3xl border-2 outline-none transition-all resize-none font-medium text-sm leading-relaxed ${
              darkMode ? 'bg-slate-800/40 border-white/5 focus:border-sky-500/50 text-white' : 'bg-slate-50 border-transparent focus:border-sky-500/50 text-slate-900 shadow-inner'
            }`}
          />
          
          <button
            onClick={handleSummarize}
            disabled={isSummarizing || isExtracting || !text}
            className={`w-full mt-6 flex items-center justify-center gap-3 p-5 rounded-2xl font-black transition-all active:scale-[0.98] disabled:opacity-40 shadow-xl ${
                darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isSummarizing ? <RefreshCw className="animate-spin" size={20} /> : <FileText size={20} />}
            {isSummarizing ? "PROCESSNG..." : "GENERATE AI INSIGHT"}
          </button>
        </section>

        {/* Output Section */}
        <section className={`p-6 rounded-[2.5rem] border flex flex-col transition-all ${darkMode ? 'bg-slate-900/40 border-white/10' : 'bg-slate-200/50 border-slate-300'}`}>
           <div className="flex items-center justify-between mb-4 px-2">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50" style={{ color: darkMode ? textColor.dark : textColor.light }}>AI Abstract</span>
             {summary && (
               <button onClick={() => { navigator.clipboard.writeText(summary); toast.success("Copied!"); }} className="p-2.5 rounded-xl text-sky-500 transition-colors">
                 <Copy size={20} />
               </button>
             )}
           </div>
           
           <div className={`flex-1 overflow-y-auto p-6 rounded-3xl leading-loose font-medium text-sm shadow-inner ${!summary && 'flex items-center justify-center opacity-30 italic text-center'} ${darkMode ? 'text-gray-300 bg-black/30' : 'text-slate-800 bg-white'}`}>
             {summary || "Your intelligent research summary will appear here..."}
           </div>

           <button
             onClick={handleSaveToLibrary}
             disabled={!summary || isSaving}
             className={`w-full mt-6 flex items-center justify-center gap-3 p-5 rounded-2xl font-black transition-all active:scale-[0.98] ${
               summary ? 'bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:shadow-emerald-500/20' : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-40'
             }`}
           >
             {isSaving ? <Loader2 className="animate-spin" size={20} /> : <BookOpen size={20} />}
             SAVE TO TOPIC NEXUS
           </button>
        </section>
      </div>
    </div>
  );
}