"use client";

import MainForm from "@/components/MainForm";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import HyperText from "@/components/ui/hyper-text";


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
        {/* <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.3}
          duration={5}
          repeatDelay={0.5}
          className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
            "h-[100%] skew-y-25"
          )}
        /> */}
        <div className="w-full flex justify-center pb-5">
          <HyperText
            className="md:text-4xl text-center font-bold text-black dark:text-white"
            text="Scheduling Algorithm Simulator"
          />
        </div>

        <Particles
          className="absolute inset-0"
          quantity={100}
          ease={80}
          color={color}
          refresh
        />
        <MainForm />
        
      </main>
    </div>
  );
}
