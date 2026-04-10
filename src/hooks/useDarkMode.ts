"use client";

import { useState, useEffect } from "react";

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

 
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

 
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");


    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}