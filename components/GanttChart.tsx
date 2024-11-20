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
    <div className="w-full shadow-md pt-10">
      <h2 className="text-lg font-semibold pl-2 mb-4">Gantt Chart</h2>
      <div className="h-fit p-1">
        {/* Use animationKey to force reanimation */}
        <motion.div
          className="flex space-x-1.5 p-1.5"
          key={animationKey} // Use the animationKey here
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {processes.map((process, index) => {
            const isGradient = process.background.includes("gradient");
            const widthPercentage = (process.burst_time / totalTime) * 100;

            return (
              <motion.div
                key={index}
                className="relative flex items-center justify-center text-white text-xs font-medium h-16"
                style={{
                  width: `${widthPercentage}%`,
                  ...(isGradient
                    ? { backgroundImage: process.background }
                    : { backgroundColor: process.background }),
                  backgroundSize: "cover",
                }}
                variants={itemVariants}
              >
                <span>
                  {process.arrival_time === -1
                    ? `Idle`
                    : `P${process.process_id}`}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex space-x-1.5">
          {processes.map((process, index) => {
            const widthPercentage = (process.burst_time / totalTime) * 100;
            const displayTime = time;
            time += process.burst_time;

            return (
              <div
                key={index}
                className={`relative flex text-white text-xs font-medium ${
                  index === processes.length - 1 ? "flex justify-between" : ""
                }`}
                style={{
                  width: `${widthPercentage}%`,
                }}
              >
                <span
                  className={`${
                    index !== processes.length - 1 && index !== 0
                      ? "absolute -left-1.5"
                      : ""
                  }`}
                >
                  {displayTime}
                </span>
                {index === processes.length - 1 && <span>{time}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
