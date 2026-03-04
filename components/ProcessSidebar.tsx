"use client";

import { useSimulationStore } from "@/src/store/useSimulationStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Pencil, Dices } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Process } from "@/lib/Algorithms";
import { ProcessModal } from "@/components/modals/ProcessModal";

export function ProcessSidebar() {
  const { 
    processes, 
    removeProcess, 
    simulationResults 
  } = useSimulationStore();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  // Take first result as summary (they are similar enough for stats)
  const stats = simulationResults.SRTF?.stats;

  const handleRandomize = () => {
    const numProcesses = Math.floor(Math.random() * 3) + 3;
    const generateRandomColor = () => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 70%, 60%)`;
    };

    const newProcesses: Process[] = [];
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        process_id: i + 1,
        arrival_time: Math.floor(Math.random() * 10),
        burst_time: Math.floor(Math.random() * 10) + 1,
        priority: Math.floor(Math.random() * 5) + 1,
        background: generateRandomColor(),
      });
    }
    useSimulationStore.getState().setProcesses(newProcesses);
    toast.success(`¡Se generaron ${numProcesses} procesos!`);
  };

  const openCreateModal = () => {
    setEditingProcess(null);
    setModalOpen(true);
  };

  const openEditModal = (process: Process) => {
    setEditingProcess(process);
    setModalOpen(true);
  };

  return (
    <aside className="w-full h-full flex flex-col border-r bg-card/30 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Procesos</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRandomize}
            title="Aleatorio"
          >
            <Dices className="h-4 w-4" />
          </Button>
          <Button size="sm" className="gap-2" onClick={openCreateModal}>
            <Plus className="h-4 w-4" /> Nuevo
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 overflow-auto px-4">
        <Table>
          <TableHeader className="sticky top-0 bg-background/90 backdrop-blur-sm z-10">
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Llegada</TableHead>
              <TableHead>Ráfaga</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((p) => (
              <TableRow key={p.process_id} className="group">
                <TableCell className="font-medium">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold"
                    style={{ backgroundColor: p.background }}
                  >
                    P{p.process_id}
                  </div>
                </TableCell>
                <TableCell>{p.arrival_time}</TableCell>
                <TableCell>{p.burst_time}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditModal(p)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeProcess(p.process_id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {processes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic text-xs">
                  No hay procesos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CardFooter className="flex flex-col gap-2 p-4 border-t bg-muted/20">
        <div className="w-full flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Espera Promedio:</span>
          <span className="font-bold text-primary">
            {stats?.avgWaitingTime.toFixed(2) ?? "0.00"}
          </span>
        </div>
        <div className="w-full flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Retorno Promedio:</span>
          <span className="font-bold text-primary">
            {stats?.avgTurnaroundTime.toFixed(2) ?? "0.00"}
          </span>
        </div>
      </CardFooter>

      <ProcessModal 
        isOpen={modalOpen} 
        onOpenChange={setModalOpen} 
        editingProcess={editingProcess} 
      />
    </aside>
  );
}
