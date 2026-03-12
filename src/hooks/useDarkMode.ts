"use client";

import { useState, useEffect } from "react";

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode safely
  useEffect(() => {
    if (typeof window === "undefined") return;

    // defer setState to avoid cascading render
    setTimeout(() => {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") setDarkMode(true);
      else if (saved === "light") setDarkMode(false);
      else {
        // fallback to system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
      }
    }, 0);
  }, []);

  // Apply/remove dark class globally whenever darkMode changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    // save preference
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}