import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

type GanttChartProps = {
  processes: Process[];
};

const GanttChart: React.FC<GanttChartProps> = ({ processes }) => {
  const totalTime = processes.reduce(
    (acc, process) => acc + process.burst_time,
    0
  );
  let time = 0;

  const [animationKey, setAnimationKey] = useState(0); // State to trigger reanimation

  // Reset animation key when processes change
  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [processes]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      x: -100,
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight italic text-primary/80">
          Diagrama de Gantt
        </h2>
        <div className="flex items-center space-x-2 text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>SIMULACIÓN ACTIVA</span>
        </div>
      </div>
      
      <div className="relative overflow-x-auto pb-8 hide-scrollbar">
        <div className="min-w-[600px]">
          {/* Gantt Bars */}
          <motion.div
            className="flex w-full rounded-xl overflow-hidden shadow-inner bg-muted/20 border-2"
            key={animationKey}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {processes.map((process, index) => {
              const isGradient = process.background.includes("gradient");
              const widthPercentage = (process.burst_time / totalTime) * 100;

              return (
                <motion.div
                  key={`${process.process_id}-${index}`}
                  className="relative flex items-center justify-center text-white text-sm font-black h-20 border-r border-white/10 last:border-r-0 group"
                  style={{
                    width: `${widthPercentage}%`,
                    ...(isGradient
                      ? { backgroundImage: process.background }
                      : { backgroundColor: process.background }),
                    backgroundSize: "cover",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                  variants={itemVariants}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  <span className="relative z-10">
                    {process.arrival_time === -1
                      ? `IDLE`
                      : `P${process.process_id}`}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Time Scale */}
          <div className="relative w-full h-10 mt-2">
            {(() => {
              let currentTime = 0;
              return processes.map((process, index) => {
                const widthPercentage = (process.burst_time / totalTime) * 100;
                const startTime = currentTime;
                currentTime += process.burst_time;
                
                return (
                  <React.Fragment key={`time-group-${process.process_id}-${startTime}`}>
                    {/* Start Time Label */}
                    <div 
                      className="absolute top-0 flex flex-col items-center"
                      style={{ left: `${(startTime / totalTime) * 100}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="w-0.5 h-3 bg-muted-foreground/30 mb-1" />
                      <span className="text-[10px] font-black text-muted-foreground bg-background px-1">
                        {startTime}
                      </span>
                    </div>
                    
                    {/* End Time Label (only for the last process) */}
                    {index === processes.length - 1 && (
                      <div 
                        className="absolute top-0 flex flex-col items-center"
                        style={{ left: `100%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="w-0.5 h-3 bg-muted-foreground/30 mb-1" />
                        <span className="text-[10px] font-black text-muted-foreground bg-background px-1">
                          {currentTime}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
