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

type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

type SummaryTableProps = {
  originalProcesses: Process[];
  scheduledProcesses: Process[];
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

  // Calculate waiting and turnaround times based on the unique original processes
  const calculatedProcesses = originalProcesses.map((process) => {
    // Filter scheduled processes to get all intervals for this process_id
    const intervals = scheduledProcesses.filter(
      (scheduledProcess) => scheduledProcess.process_id === process.process_id
    );

    // Calculate waiting time by summing idle times between intervals
    let processStartTime = process.arrival_time;
    let waitingTime = 0;
    intervals.forEach((interval) => {
      if (processStartTime < interval.arrival_time) {
        waitingTime += interval.arrival_time - processStartTime;
      }
      processStartTime = interval.arrival_time + interval.burst_time;
    });

    // Turnaround time is the total time from arrival to the last execution finish
    const turnaroundTime =
      waitingTime +
      intervals.reduce((sum, interval) => sum + interval.burst_time, 0);

    // Update cumulative totals
    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;

    return {
      ...process,
      waitingTime,
      turnaroundTime,
    };
  });

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
            <TableHead className="w-[100px] text-center">Process ID</TableHead>
            <TableHead className="text-center">Arrival Time</TableHead>
            <TableHead className="text-center">Burst Time</TableHead>
            <TableHead className="text-center">Waiting Time</TableHead>
            <TableHead className="text-center">Turnaround Time</TableHead>
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
                {process.waitingTime}
              </TableCell>
              <TableCell className="text-center">
                {process.turnaroundTime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="pl-8">
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
