"use client";

import MainForm from "@/components/MainForm";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Particles from "@/components/ui/particles";

export default function Home() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);
  return (
    <div className="container max-w-full overflow-hidden">
      <main className="flex justify-center sm:items-start p-5 grow-0 overflow-hidden">
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
