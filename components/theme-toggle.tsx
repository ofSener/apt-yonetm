"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so we can safely show the UI when mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="h-8 w-8 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <span className="sr-only">Toggle theme</span>
        <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === "dark" ? (
        <LuSun className="h-5 w-5" />
      ) : (
        <LuMoon className="h-5 w-5" />
      )}
    </button>
  );
} 