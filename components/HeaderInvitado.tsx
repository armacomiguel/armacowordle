"use client";

import { useState } from "react";

export default function HeaderInvitado() {
  const [darkMode, setDarkMode] = useState(false); // 🌙

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <header className="w-full flex justify-between items-center bg-white  border-b border-gray-200  shadow-md">
      <div className="flex items-center gap-4 cursor-pointer">
        
        <div className="text-left">
          <p className="text-sm font-semibold text-gray-800 ">
            
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* 🌙 Botón Toggle Dark/Light */}
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-2 rounded-lg border border-gray-400  text-gray-700  hover:bg-gray-100  transition"
        >
          {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
        </button>
      </div>
    </header>
  );
}
