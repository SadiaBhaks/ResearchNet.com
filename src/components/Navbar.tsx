"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react"; 
import { LogOut, UserPlus, LogIn, Library, Home, Search, Settings, Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/components/DarkModeContext"; 

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("nexusUser");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  return (
    <>
      
      <nav className="flex items-center justify-between p-4 bg-gray-800  text-white shadow-sm border-b border-zinc-800 sticky top-0 z-40 w-full ">
        <div className="text-xl font-black italic tracking-tighter text-white">
          <h1>Research<span className={` ${darkMode ? 'text-purple-400' : 'text-blue-500'}`}>Net</span>.com</h1>
        </div>

        <div className="flex items-center gap-2">
        
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-100 transition-all border border-gray-200 dark:border-zinc-700 text-yellow-500 dark:text-blue-400"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 px-3 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all border border-gray-200 dark:border-zinc-700"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
        
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-zinc-900 shadow-2xl transform transition-transform duration-300 z-50 flex flex-col
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase text-blue-600">Menu</span>
            {session?.user && (
              <span className="text-[10px] text-gray-500 truncate w-40">{session.user.email}</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Navigation</p>
          
          <NavLink href="/" icon={<Home size={18}/>} label="Home" onClick={() => setSidebarOpen(false)} />
          <NavLink href="/research" icon={<Search size={18}/>} label="Discovery Hub" onClick={() => setSidebarOpen(false)} />
          
          {/* Only show Library if logged in */}
          {status === "authenticated" && (
            <NavLink href="/library" icon={<Library size={18}/>} label="My Library" onClick={() => setSidebarOpen(false)} />
          )}
          
          <NavLink href="/settings" icon={<Settings size={18}/>} label="Settings" onClick={() => setSidebarOpen(false)} />

          {/* Conditional Auth Section for Logged Out Users */}
          {status === "unauthenticated" && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-4">Account</p>
              <NavLink href="/login" icon={<LogIn size={18}/>} label="Sign In" onClick={() => setSidebarOpen(false)} />
              <NavLink href="/register" icon={<UserPlus size={18}/>} label="Create Account" onClick={() => setSidebarOpen(false)} highlight />
            </div>
          )}
        </div>

        {/* Bottom Section: Sign Out (Only if logged in) */}
        {status === "authenticated" && (
          <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border border-red-100 dark:border-red-900/50 active:scale-95"
            >
              <LogOut size={18} />
              Logout Account
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Helper component for clean Nav Links
function NavLink({ href, icon, label, onClick, highlight = false }: { 
  href: string, 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void,
  highlight?: boolean 
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${
        highlight 
          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none" 
          : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300"
      }`}
    >
      {icon} {label}
    </Link>
  );
}