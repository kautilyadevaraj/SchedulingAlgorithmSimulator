import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
let waitingTime = 0;
let turnaroundTime = 0;
let cpuUtilization = 0;
let totalExecutionTime = 0;// New variable to export CPU utilization

type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  priority?: number;
  background: string;
};

type SummaryTableProps = {
  originalProcesses: Process[];
  scheduledProcesses: Process[];
  algorithm: string;
};

export function SummaryTable({
  originalProcesses,
  scheduledProcesses,
}: SummaryTableProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // Update the animation key whenever scheduledProcesses changes to re-trigger the animation
  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [scheduledProcesses]);

  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  // Build completion time from the actual timeline (includes idle + context switch blocks).
  const completionByProcessId = new Map<number, number>();
  let timeline = 0;
  scheduledProcesses.forEach((scheduledProcess) => {
    timeline += scheduledProcess.burst_time;
    if (scheduledProcess.process_id > 0) {
      completionByProcessId.set(scheduledProcess.process_id, timeline);
    }
  });

  // Initialize calculated processes without waiting time calculation
  const calculatedProcesses = originalProcesses.map((process) => {
    return {
      ...process,
      completionTime: 0,
      waitingTime: 0,
      turnaroundTime: 0,
    };
  });

  {
  // Standard formulas: TAT = CT - AT, WT = TAT - BT.
  // CT is taken from full timeline so context switching time is naturally included.
  calculatedProcesses.forEach((process) => {
    const completionTime = completionByProcessId.get(process.process_id) ?? 0;
    const turnaroundTime = Math.max(completionTime - process.arrival_time, 0);
    const waitingTime = Math.max(turnaroundTime - process.burst_time, 0);

    process.completionTime = completionTime;
    process.turnaroundTime = turnaroundTime;
    process.waitingTime = waitingTime;

    // Update cumulative totals
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;
  });
}

  waitingTime = totalWaitingTime;
  turnaroundTime = totalTurnaroundTime;

  // Calculate CPU utilization
  const totalBurstTime = originalProcesses.reduce(
    (sum, process) => sum + process.burst_time,
    0
  );

  totalExecutionTime = scheduledProcesses.reduce(
    (sum, process) => sum + process.burst_time,
    0
  );

  cpuUtilization = totalExecutionTime > 0 ? (totalBurstTime / totalExecutionTime) * 100 : 0;

  const popOutVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={popOutVariants}
      key={animationKey}
    >
      <Table>
        <TableCaption>
          A summary of your processes including waiting and turnaround times.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">
              <p className="text-xs md:text-lg">Process ID</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Arrival Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Burst Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Completion Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Turnaround Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Waiting Time</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculatedProcesses.map((process) => (
            <TableRow key={process.process_id}>
              <TableCell className="font-medium flex justify-center">
                <div
                  className="preview flex justify-center items-center p-1 h-[25px] w-[25px] rounded !bg-cover !bg-center transition-all"
                  style={{
                    background: process.background,
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {process.process_id}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {process.arrival_time}
              </TableCell>
              <TableCell className="text-center">
                {process.burst_time}
              </TableCell>
              <TableCell className="text-center">
                {process.completionTime}
              </TableCell>
              <TableCell className="text-center">
                {process.turnaroundTime}
              </TableCell>
              <TableCell className="text-center">
                {process.waitingTime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="pl-3 text-xs">
              Total
            </TableCell>
            <TableCell className="text-center">{totalWaitingTime}</TableCell>
            <TableCell className="text-center">{totalTurnaroundTime}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </motion.div>
  );
}

export { waitingTime, turnaroundTime, cpuUtilization , totalExecutionTime};
