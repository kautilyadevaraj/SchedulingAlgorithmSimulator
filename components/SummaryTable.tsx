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
import { ScheduledProcess } from "@/lib/ShortestJobFirst";

type SummaryTableProps = {
  processStats: ScheduledProcess[];
};

export function SummaryTable({
  processStats,
}: SummaryTableProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [processStats.length]);

  const totalWaitingTime = processStats.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTurnaroundTime = processStats.reduce((sum, p) => sum + p.turnaroundTime, 0);

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
      <Table className="bg-card rounded-lg overflow-hidden border">
        <TableCaption>
          Resumen de la planificación usando Shortest Job First.
        </TableCaption>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[100px] text-center font-bold">PID</TableHead>
            <TableHead className="text-center font-bold">Llegada</TableHead>
            <TableHead className="text-center font-bold">Ráfaga</TableHead>
            <TableHead className="text-center font-bold">Espera</TableHead>
            <TableHead className="text-center font-bold">Retorno</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processStats.map((process) => (
            <TableRow key={process.process_id} className="hover:bg-muted/20">
              <TableCell className="font-medium flex justify-center">
                <div
                  className="preview flex justify-center items-center h-8 w-8 rounded text-white font-bold text-xs"
                  style={{
                    background: process.background,
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  {process.process_id}
                </div>
              </TableCell>
              <TableCell className="text-center">{process.arrival_time}</TableCell>
              <TableCell className="text-center">{process.burst_time}</TableCell>
              <TableCell className="text-center">{process.waitingTime}</TableCell>
              <TableCell className="text-center">{process.turnaroundTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-muted/50 font-bold">
          <TableRow>
            <TableCell colSpan={3} className="text-right pr-4">Totales</TableCell>
            <TableCell className="text-center text-primary">{totalWaitingTime}</TableCell>
            <TableCell className="text-center text-primary">{totalTurnaroundTime}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </motion.div>
  );
}

