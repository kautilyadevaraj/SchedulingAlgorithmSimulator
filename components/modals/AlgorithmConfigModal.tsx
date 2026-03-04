"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulationStore } from "@/src/store/useSimulationStore";
import { useState, useEffect } from "react";
import { AlgorithmConfig } from "@/lib/Algorithms";

interface AlgorithmConfigModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: string;
}

export function AlgorithmConfigModal({
  isOpen,
  onOpenChange,
  activeTab,
}: AlgorithmConfigModalProps) {
  const { algorithmSettings, setAlgorithmSettings } = useSimulationStore();
  const [localSettings, setLocalSettings] = useState<AlgorithmConfig>(algorithmSettings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(algorithmSettings);
    }
  }, [isOpen, algorithmSettings]);

  const handleSave = () => {
    setAlgorithmSettings(localSettings);
    onOpenChange(false);
  };

  const updateMlfqQueue = (index: number, field: string, value: any) => {
    const newQueues = [...localSettings.mlfqQueues];
    newQueues[index] = { ...newQueues[index], [field]: value };
    setLocalSettings({ ...localSettings, mlfqQueues: newQueues });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuración de Algoritmos</DialogTitle>
          <DialogDescription>
            Ajustá los parámetros para mejorar la eficiencia de la planificación.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* RRV Section */}
          {(activeTab === "RRV" || activeTab === "all") && (
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-bold text-primary flex items-center gap-2">
                Round Robin Virtual (RRV)
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="quantum">Quantum (Tiempo de ráfaga por turno)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="quantum"
                    type="number"
                    min={1}
                    value={localSettings.quantum}
                    onChange={(e) => setLocalSettings({ ...localSettings, quantum: Number(e.target.value) })}
                    className="w-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tiempo máximo que un proceso usa el CPU antes de cederlo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MLFQ Section */}
          {(activeTab === "MLFQ" || activeTab === "all") && (
            <div className="space-y-4">
              <h3 className="font-bold text-primary">Multi-Level Feedback Queue (MLFQ)</h3>
              <div className="space-y-4">
                {localSettings.mlfqQueues.map((queue, idx) => (
                  <div key={queue.id} className="p-3 border rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">Cola Q{idx} (Nivel {idx})</Label>
                      <div className="w-32">
                        <Select
                          value={queue.algorithm}
                          onValueChange={(val: "RR" | "SRTF" | "FCFS") => updateMlfqQueue(idx, "algorithm", val)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RR">Round Robin</SelectItem>
                            <SelectItem value="SRTF">SRTF</SelectItem>
                            <SelectItem value="FCFS">FCFS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {queue.algorithm === "RR" && (
                      <div className="flex items-center gap-3">
                        <Label className="text-xs">Quantum:</Label>
                        <Input
                          type="number"
                          min={1}
                          value={queue.quantum || 4}
                          onChange={(e) => updateMlfqQueue(idx, "quantum", Number(e.target.value))}
                          className="w-20 h-8"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
