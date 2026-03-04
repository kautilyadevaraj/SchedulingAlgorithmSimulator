"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProcessForm } from "@/components/ProcessForm";
import { useSimulationStore } from "@/src/store/useSimulationStore";
import { Process } from "@/lib/Algorithms";

interface ProcessModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProcess?: Process | null;
}

export function ProcessModal({
  isOpen,
  onOpenChange,
  editingProcess,
}: ProcessModalProps) {
  const { addProcess, updateProcess } = useSimulationStore();

  const handleSubmit = (data: any) => {
    if (editingProcess) {
      updateProcess(editingProcess.process_id, data);
    } else {
      addProcess(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingProcess ? "Editar Proceso" : "Nuevo Proceso"}
          </DialogTitle>
          <DialogDescription>
            {editingProcess 
              ? `Modificá los parámetros del proceso P${editingProcess.process_id}.`
              : "Ingresá los datos para el nuevo proceso en la simulación."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ProcessForm
            addProcess={handleSubmit}
            initialValues={editingProcess || undefined}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
