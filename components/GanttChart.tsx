import React from "react";

type Process = {
  arrival_time: number;
  burst_time: number;
  background: string;
};

type GanttChartProps = {
  processes: Process[];
};

const GanttChart: React.FC<GanttChartProps> = ({ processes }) => {
  // Calculate the total time for scaling the chart
  const totalTime = processes.reduce(
    (acc, process) => acc + process.burst_time,
    0
  );
  let time = 0;

  return (
    <div className="w-full shadow-md pt-10">
      <h2 className="text-lg font-semibold mb-4">Gantt Chart</h2>
      <div className=" h-fit p-1">
        <div className="flex space-x-1.5 p-1.5">
          {processes.map((process, index) => {
            const isGradient = process.background.includes("gradient");
            const widthPercentage = (process.burst_time / totalTime) * 100;

            return (
              <div
                key={index}
                className={`relative flex items-center justify-center text-white text-xs font-medium h-16 `}
                style={{
                  width: `${widthPercentage}%`,
                  ...(isGradient
                    ? { backgroundImage: process.background }
                    : { backgroundColor: process.background }),
                  backgroundSize: "cover",
                }}
              >
                <span>{process.arrival_time === -1 ? `Idle` : `P${index + 1}`}</span>
              </div>
            );
          })}
        </div>
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
                } `}
                style={{
                  width: `${widthPercentage}%`,
                }}
              >
                <span
                  className={`${
                    index !== processes.length - 1 && index !== 0 ? "absolute -left-1.5" : ""
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
