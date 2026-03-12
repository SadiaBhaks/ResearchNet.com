"use client";

import { useState } from "react";
import DarkModeToggle from "@/components/DarkModeToggle";
import Link from "next/link";
import { signOut } from "next-auth/react"; 
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Unified Logout Logic
  const handleLogout = async () => {
    try {
      // 1. Clear "Normal" registration data from localStorage
      localStorage.removeItem("nexusUser");

      // 2. Clear NextAuth session
      // { redirect: false } allows us to handle the final step manually if needed
      const data = await signOut({ redirect: false, callbackUrl: "/" });

      // 3. Force a redirect and page refresh to clear all states
      window.location.href = data.url || "/";
      
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: Clear everything and force redirect if API fails
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md">
        <div className="text-xl font-bold italic">ResearchNet.com</div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="px-3 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          ☰
        </button>
      </nav>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800">
          <span className="text-lg font-black uppercase tracking-tighter dark:text-white">Nexus Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors dark:text-gray-400"
          >
            ✕
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 flex-grow overflow-y-auto">
          <div className="mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Preferences</p>
            <DarkModeToggle />
          </div>

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">Navigation</p>
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all font-medium dark:text-white"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all font-medium dark:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all font-medium dark:text-white"
          >
            Settings
          </Link>
        </div>

        {/* ✅ Updated Logout Button Section */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-100 dark:border-red-900/50 active:scale-95"
          >
            <LogOut size={18} />
            Logout Account
          </button>
        </div>
      </div>
    </>
  );
}