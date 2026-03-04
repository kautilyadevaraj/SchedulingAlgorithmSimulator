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
import { ScheduledProcess } from "@/lib/Algorithms";

type SummaryTableProps = {
  processStats: ScheduledProcess[];
};

export function SummaryTable({
  processStats,
}: SummaryTableProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [processStats]);

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
      className="w-full h-full"
    >
      <div className="rounded-2xl border-2 shadow-lg overflow-hidden bg-card/60 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-muted/40 backdrop-blur-md">
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="w-[80px] text-center font-bold text-foreground">PID</TableHead>
              <TableHead className="text-center font-bold text-foreground">Llegada</TableHead>
              <TableHead className="text-center font-bold text-foreground">Ráfaga</TableHead>
              <TableHead className="text-center font-bold text-foreground">Fin</TableHead>
              <TableHead className="text-center font-bold text-foreground">Espera</TableHead>
              <TableHead className="text-center font-bold text-foreground">Retorno</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processStats.map((process) => (
              <TableRow key={process.process_id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex justify-center">
                    <div
                      className="flex justify-center items-center h-8 w-8 rounded-lg text-white font-black text-[10px] shadow-sm"
                      style={{
                        background: process.background,
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      P{process.process_id}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold">{process.arrival_time}</TableCell>
                <TableCell className="text-center font-semibold">{process.burst_time}</TableCell>
                <TableCell className="text-center font-semibold text-emerald-500">{process.endTime}</TableCell>
                <TableCell className="text-center font-semibold text-blue-500">{process.waitingTime}</TableCell>
                <TableCell className="text-center font-semibold text-amber-500">{process.turnaroundTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-muted/50 border-t-2">
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground pr-4">Totales</TableCell>
              <TableCell className="text-center font-black text-blue-600">{totalWaitingTime}</TableCell>
              <TableCell className="text-center font-black text-amber-600">{totalTurnaroundTime}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </motion.div>
  );
}

