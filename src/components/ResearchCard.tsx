"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/components/DarkModeContext";
import { signIn, useSession } from "next-auth/react";
import { Github, Chrome, Bookmark } from "lucide-react"; // Added Bookmark icon for a cleaner look

import { primaryGradient, secondaryColor, textColor, cardBg } from "@/theme/theme";

export default function ResearchCard({ paper, user }: { paper: any; user?: any }) {
  const { data: session } = useSession();
  const { darkMode } = useDarkMode();
  const card = darkMode ? cardBg.dark : cardBg.light;
  const router = useRouter();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasSaved, setHasSaved] = useState<boolean>(false);
  const [userNote, setUserNote] = useState<string>("");
  const [localUser, setLocalUser] = useState<any>(user);

  useEffect(() => {
    if (session?.user) {
      setLocalUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image
      });
    } else if (!user) {
      const saved = localStorage.getItem("nexusUser");
      if (saved) setLocalUser(JSON.parse(saved));
    } else {
      setLocalUser(user);
    }
  }, [user, session]);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!localUser?.email || !paper?.doi) return;
      try {
        const res = await fetch(`/api/topics?email=${localUser.email}`);
        const data = await res.json();
        if (data.success) {
          const alreadySaved = data.data.find((topic: any) => topic.doi === paper.doi);
          if (alreadySaved) setHasSaved(true);
        }
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    };
    checkIfSaved();
  }, [localUser, paper?.doi]);

  const currentYear = new Date().getFullYear();
  const age = currentYear - paper.publication_year;
  const citationScore = (Math.min(paper.cited_by_count || 0, 200) / 200) * 40;
  const recencyScore = age <= 5 ? 30 : age <= 10 ? 20 : 10;
  const oaScore = paper.is_oa ? 20 : 5;
  const feasibilityScore = Math.round(citationScore + recencyScore + oaScore);

  const lastTwoYears = paper.counts_by_year?.slice(-2);
  let trendLabel = "Steady Interest";
  let trendColor = "text-orange-500";
  let trendIcon = "→";

  if (lastTwoYears?.length === 2) {
    const [prev, latest] = lastTwoYears;
    if (latest.cited_by_count > prev.cited_by_count * 1.2) {
      trendLabel = "Rising Rapidly";
      trendColor = "text-green-600";
      trendIcon = "↑";
    } else if (latest.cited_by_count < prev.cited_by_count * 0.8) {
      trendLabel = "Declining";
      trendColor = "text-red-500";
      trendIcon = "↓";
    }
  }

  const barColor = feasibilityScore > 75 ? "bg-green-500" : feasibilityScore > 50 ? "bg-blue-500" : "bg-yellow-500";

  const handleSaveClick = async (): Promise<void> => {
    setShowPopup(true);
  };

  const submitToDatabase = async () => {
    const activeEmail = localUser?.email;
    if (!activeEmail) {
      alert("Error: You must be logged in to save notes.");
      router.push("/login");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          citations: paper.cited_by_count,
          year: paper.publication_year,
          is_oa: paper.is_oa,
          doi: paper.doi,
          tags: paper.tags?.map((t: any) => typeof t === "string" ? t : t.display_name),
          userEmail: activeEmail,
          userNote: userNote,
          feasibility: feasibilityScore,
          trendLevel: trendLabel,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setHasSaved(true);
        setShowPopup(false);
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="group shadow-sm border flex flex-col gap-6 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 relative min-h-[480px]"
      style={{
        backgroundColor: card.backgroundColor,
        border: card.border,
        backdropFilter: card.backdropFilter,
        borderRadius: card.borderRadius,
        padding: "2rem", // Increased padding for a bigger, cleaner look
        boxShadow: card.shadow,
        color: darkMode ? textColor.dark : textColor.light,
      }}>
      
      {/* CITATIONS ADDED HERE */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Citations</span>
          <span className="text-sm font-bold text-blue-500">
            {paper.cited_by_count?.toLocaleString() || "0"}
          </span>
        </div>
        {hasSaved && <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-md">Saved</span>}
      </div>

      <h3 className="font-bold text-xl leading-tight h-20 overflow-hidden group-hover:text-blue-600 transition-colors"
        style={{ color: darkMode ? textColor.dark : textColor.light }}>
        {paper.title}
      </h3>

      <div className="flex gap-2 flex-wrap">
        {paper.tags?.slice(0, 3).map((tag: any, i: number) => (
          <span key={i} className="bg-blue-50 text-blue-600 text-[10px] uppercase font-black px-3 py-1.5 rounded-full border border-blue-100">
            #{typeof tag === "string" ? tag.replace(/\s+/g, "") : tag.display_name.replace(/\s+/g, "")}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 py-3 border-y border-gray-100/50">
        <span className={`text-xl font-bold ${trendColor}`}>{trendIcon}</span>
        <p className="text-sm font-medium opacity-80">
          Trend: <span className={`font-bold ${trendColor}`}>{trendLabel}</span>
        </p>
      </div>

      <div className="space-y-2 mt-auto">
        <div className="flex justify-between text-xs font-bold opacity-60">
          <span>Feasibility Score</span>
          <span>{feasibilityScore}/100</span>
        </div>
        <div className="w-full bg-gray-100  rounded-full h-2.5 overflow-hidden">
          <div className={`${barColor} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${feasibilityScore}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <a href={paper.doi || "#"} target="_blank" className={`w-full text-center ${darkMode ? 'bg-white' : 'bg-gray-500'} ${darkMode ? 'text-black' : 'text-white'} hover:bg-blue-600 hover:text-white  text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg`}>
          View Publications
        </a>

        <button onClick={handleSaveClick} disabled={isSaving || hasSaved}
          className={`flex items-center justify-center gap-2 w-full py-3 text-xs font-bold rounded-xl border border-dashed transition-all ${
            hasSaved ? "bg-green-50 text-green-600 border-green-200 cursor-default" : "text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border-gray-300 hover:border-blue-200"
          }`}>
          {isSaving ? <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> : hasSaved ? <>✓ Saved to Profile</> : <>Save to Notes</>}
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPopup(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[400px] z-10 animate-in fade-in zoom-in duration-200 text-black">
            {!localUser ? (
              <div className="text-center">
                <h2 className="text-2xl font-bold">Save for Later</h2>
                <p className="mt-2 text-sm text-gray-500">Sign in to build your personal research library.</p>
                <div className="mt-8 flex flex-col gap-3">
                  <button onClick={() => signIn("google")} className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-sm transition-all">
                    <Chrome size={20} className="text-red-500" /> Continue with Google
                  </button>
                  <button onClick={() => signIn("github")} className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-zinc-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all">
                    <Github size={20} /> Continue with GitHub
                  </button>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase">OR</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                  </div>
                  <button onClick={() => router.push("/register")} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all">
                    Create Email Account
                  </button>
                  <button onClick={() => setShowPopup(false)} className="w-full py-2 px-4 text-gray-400 text-sm font-medium">Maybe later</button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-1">Add Research Note</h2>
                <p className="text-xs text-blue-600 font-semibold mb-4 truncate">{paper.title}</p>
                <textarea autoFocus className="w-full h-32 p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Why is this paper important? Add your insights..." value={userNote} onChange={(e) => setUserNote(e.target.value)} />
                <div className="mt-6 flex flex-col gap-3">
                  <button onClick={submitToDatabase} disabled={isSaving} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg disabled:bg-gray-300">
                    {isSaving ? "Saving..." : "Confirm & Save"}
                  </button>
                  <button onClick={() => setShowPopup(false)} className="w-full text-gray-400 text-sm font-medium">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}