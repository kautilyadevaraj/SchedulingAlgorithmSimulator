"use client";

import MainForm from "@/components/MainForm";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <main className="flex flex-col items-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-6xl flex justify-between items-center mb-8 bg-card/50 backdrop-blur-md p-4 rounded-2xl border shadow-sm">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground text-center lg:text-left">
              Shortest Job <span className="text-primary">Simulator</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <MainForm />
        </Suspense>
        
      </main>
    </div>
  );
}
