"use client";

import MainForm from "@/components/MainForm";
import { useEffect, useState, Suspense } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";

import Particles from "@/components/ui/particles";

export default function Home() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <div className="container max-w-full">
      <main className="flex flex-col justify-center sm:items-start p-5 grow-0">
        <div className="w-full flex justify-between items-center pb-5">
          <div className="flex-1 text-center">
            <h1 className="md:text-4xl text-2xl font-bold text-black dark:text-white">
              Simulador de Planificación SJF
            </h1>
          </div>
          <ThemeToggle />
        </div>

        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={color}
          refresh
        />
        <Suspense fallback={<div>Loading...</div>}>
          <MainForm />
        </Suspense>
        
      </main>
    </div>
  );
}
