"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; 
import { Github, Chrome } from "lucide-react"; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ NEW: Sync with your localStorage system so the app sees them as "logged in"
        localStorage.setItem("nexusUser", JSON.stringify({
          name: formData.name,
          email: formData.email
        }));

        // Redirect to dashboard instead of login for a smoother experience
        router.push("/");
        router.refresh(); 
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-zinc-950">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-zinc-800">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 ">Join ResearchNet</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Start saving your research insights today.</p>

        {/* --- SOCIAL LOGINS --- */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all font-bold text-sm text-gray-700 dark:text-gray-200 shadow-sm"
          >
            <Chrome size={18} className="text-red-500" /> Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all font-bold text-sm text-gray-700 dark:text-gray-200 shadow-sm"
          >
            <Github size={18} /> GitHub
          </button>
        </div>

        {/* --- DIVIDER --- */}
        <div className="relative flex items-center mb-8">
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Or use email
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-zinc-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
            <input 
              type="text" required 
              className="w-full p-3 mt-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="John Doe"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
            <input 
              type="email" required 
              className="w-full p-3 mt-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="name@example.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-400">Password</label>
            <input 
              type="password" required 
              className="w-full p-3 mt-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg">
              <p className="text-red-500 dark:text-red-400 text-xs font-bold text-center">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-200 transition-all disabled:bg-slate-400 dark:disabled:bg-zinc-700"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="text-blue-600 font-bold hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}