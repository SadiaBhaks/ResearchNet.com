"use client";

import { useDarkMode } from "@/components/DarkModeContext";
import { secondaryColor } from "@/theme/theme";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      style={{ backgroundColor: darkMode ? secondaryColor.dark : secondaryColor.light }}
      className="px-4 py-2 rounded-md text-white transition-colors duration-300"
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
