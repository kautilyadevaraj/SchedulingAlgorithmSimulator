"use client";

import { Suspense } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProcessSidebar } from "@/components/ProcessSidebar";
import { SimulationStage } from "@/components/SimulationStage";

export default function Home() {
  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-16 shrink-0 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-md z-20 shadow-sm">
        <h1 className="text-xl font-black tracking-tighter text-foreground">
          CPU <span className="text-primary">Simulator</span>
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Layout Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-full lg:w-[350px] xl:w-[400px] h-full shrink-0 border-r overflow-hidden flex flex-col">
          <Suspense fallback={<div className="p-8">Cargando procesos...</div>}>
            <ProcessSidebar />
          </Suspense>
        </div>

        {/* Stage */}
        <div className="hidden lg:flex flex-1 h-full overflow-hidden bg-muted/5">
          <Suspense fallback={<div className="p-12 text-center">Cargando simulación...</div>}>
            <SimulationStage />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
