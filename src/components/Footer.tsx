"use client";
import { useDarkMode } from "@/components/DarkModeContext"; 
import React from "react";
import { ExternalLink, ShieldCheck, Globe } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const { darkMode } = useDarkMode();

  return (
    <footer 
      className="w-full bg-gray-200 dark:bg-gray-800 border-t transition-colors duration-500 "
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* Brand & Mission */}
          <div className="col-span-1">
            <div className="text-2xl font-black tracking-tighter mb-5 text-white">
              Research<span className={` ${darkMode ? 'text-purple-400' : 'text-blue-500'}`}>Net</span>
            </div>
            <p className={`text-sm leading-relaxed max-w-xs ${darkMode ? 'text-zinc-400' : 'text-slate-500'}`}>
              An advanced computational nexus for academic discovery. We provide 
              researchers with the analytical tools to navigate the global 
              scientific landscape.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 col-span-1 md:col-span-2 gap-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-6">Engine</h4>
              <ul className={`space-y-4 text-sm font-medium ${darkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
                <li><a href="/search" className="hover:text-white transition-colors">Global Search</a></li>
                <li><a href="/trends" className="hover:text-white transition-colors">Citation Trends</a></li>
                <li><a href="/library" className="hover:text-white transition-colors">Research Vault</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-6">System</h4>
              <ul className={`space-y-4 text-sm font-medium ${darkMode ? 'text-zinc-300' : 'text-slate-600'}`}>
                <li><a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">Documentation <ExternalLink size={12} className="opacity-50"/></a></li>
                <li><a href="#" className="hover:text-white transition-colors">OpenAlex API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy & Ethics</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-8 ${darkMode ? 'border-zinc-900' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-semibold tracking-wide uppercase">
              © {year} ResearchNet Platform
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                <ShieldCheck size={14} className={` ${darkMode ? 'text-purple-400' : 'text-blue-500'}`}/>
                <span className="text-[11px] font-bold uppercase tracking-wider">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                <Globe size={14} className={` ${darkMode ? 'text-purple-400' : 'text-blue-500'}`}/>
                <span className="text-[11px] font-bold uppercase tracking-wider">Global Access</span>
              </div>
            </div>
          </div>

          {/* Operational Status Badge */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full border shadow-inner ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
            <div className="relative flex items-center justify-center">
              <span className="absolute h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-green-500" />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${darkMode ? 'text-zinc-400' : 'text-slate-600'}`}>
              Nexus Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}