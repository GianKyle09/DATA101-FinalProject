"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">ASEAN PowerPulse</h1>
        <div className="flex items-center gap-4">
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/comparison" className="hover:text-primary transition-colors">
              Comparison
            </Link>
            <Link href="/philippines" className="hover:text-primary transition-colors">
              Philippines
            </Link>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}