"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/components/DarkModeContext";
import { Sparkles, ArrowLeft } from "lucide-react";
import { primaryGradient, secondaryColor, textColor } from "@/theme/theme"; 
import { useSession } from "next-auth/react";

interface SavedTopic {
  _id: string;
  title: string;
  userNote: string;
  aiSummary?: string;
  trendLevel: string;
  feasibility: number;
  doi: string;
  tags: string[];
  createdAt: string;
}

export default function LibraryPage() {
  const [notes, setNotes] = useState<SavedTopic[]>([]);
  const { data: session, status } = useSession(); 
  const { darkMode } = useDarkMode();
  const router = useRouter();

  // 1. Protection: Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2. Fetch Notes based on the session email
  useEffect(() => {
    // This guard ensures session.user.email is definitely a string below
    if (status !== "authenticated" || !session?.user?.email) return;

    async function fetchNotes() {
      try {
        // TypeScript now knows session.user.email exists
        const email = session?.user?.email;
        const res = await fetch(`/api/topics?email=${email}`);
        const json = await res.json();

        if (json.success) {
          setNotes(json.data);
        }
      } catch (err) {
        console.error("Failed to load library:", err);
      }
    }

    fetchNotes();
  }, [status, session]);

  // 3. Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: darkMode ? primaryGradient.dark : primaryGradient.light }}>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pt-12 pb-8 mb-8">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/research"
            className="text-blue-600 text-sm font-bold flex items-center gap-2 mb-4 hover:underline transition-colors"
          >
            <ArrowLeft size={16} /> Back to Discover Hub
          </Link>
          <h1 className="text-4xl font-black tracking-tight" style={{color: darkMode ? secondaryColor.dark : secondaryColor.light}}>
            Research Library
          </h1>
          <p className="mt-2" style={{color: darkMode ? textColor.dark : textColor.light}}>
            You have {notes.length} insights saved in your Nexus.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {notes.length === 0 ? (
          <div className="text-center py-20 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl border-2 border-dashed border-slate-200 dark:border-zinc-800">
            <p className="font-medium" style={{color: darkMode ? textColor.dark : textColor.light}}>
              Your library is empty. Start exploring papers!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className={`flex flex-col md:flex-row overflow-hidden rounded-3xl border border-b-3 border-r-3 bg-white/5 shadow-lg hover:shadow-2xl transition-shadow backdrop-blur-md ${
                  darkMode ? 'border-white' : 'border-black' 
                }`}
              >
                {/* Left Side */}
                <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                      darkMode ? "text-purple-400 bg-purple-400/10" : "text-blue-600 bg-blue-50"
                    }`}>
                      {note.trendLevel}
                    </span>
                  </div>

                  <h3 className="font-bold leading-snug mb-4" style={{color: darkMode ? textColor.dark : textColor.light}}>
                    {note.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {note.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-500 dark:text-gray-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={note.doi}
                    target="_blank"
                    className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                      darkMode ? "text-white/90 hover:text-blue-400" : "text-slate-900 hover:text-blue-500"
                    }`}
                  >
                    View Source ↗
                  </a>
                </div>

                {/* Right Side */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                          Your Research Note
                        </span>
                        <span className={`text-[10px] italic ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                          Saved {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                        {note.userNote || "No personal notes added to this paper."}
                      </p>
                    </div>

                    {/*  AI Summary Section */}
                    {note.aiSummary && (
                      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles size={14} className="text-purple-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">
                            AI Abstract Summary
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed italic ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                          {note.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>

                
                  <div className="mt-8 pt-6 border-t border-white/10 dark:border-white/20">
                    <div className={`flex justify-between items-center text-[10px] font-bold uppercase mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                      <span>Feasibility Check</span>
                      <span>{note.feasibility}%</span>
                    </div>

                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-white/20'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${darkMode ? 'bg-purple-500' : 'bg-blue-500'}`}
                        style={{ width: `${note.feasibility}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}