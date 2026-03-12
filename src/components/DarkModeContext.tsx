"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Safe initialization
  useEffect(() => {
    if (typeof window === "undefined") return;

    setTimeout(() => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkMode(true);
      else if (saved === "light") setDarkMode(false);
      else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
      }
    }, 0);
  }, []);

  // Apply/remove dark class whenever darkMode changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Hook to use anywhere
export const useDarkMode = () => useContext(DarkModeContext);