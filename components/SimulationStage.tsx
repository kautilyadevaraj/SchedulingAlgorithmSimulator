"use client";

import { useSimulationStore } from "@/src/store/useSimulationStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import GanttChart from "./GanttChart";
import { SummaryTable } from "./SummaryTable";
import SummaryStatistics from "./SummaryStatistics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { AlgorithmConfigModal } from "./modals/AlgorithmConfigModal";
import { LayoutGrid, List } from "lucide-react";

export function SimulationStage() {
  const { simulationResults, processes } = useSimulationStore();
  const [activeTab, setActiveTab] = useState("SRTF");
  const [viewMode, setViewMode] = useState<"gantt" | "table">("gantt");
  const [configModalOpen, setConfigModalOpen] = useState(false);

  if (processes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mb-6">
          <Settings2 className="h-12 w-12 opacity-20" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Comienza la Simulación</h2>
        <p className="max-w-md">
          Agregá procesos desde la barra lateral o cargá un ejemplo aleatorio para ver cómo se comportan los algoritmos de planificación.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 h-full overflow-hidden flex flex-col p-6 space-y-4">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50 border shadow-sm h-12">
            <TabsTrigger value="SRTF" className="font-bold">SRTF</TabsTrigger>
            <TabsTrigger value="RRV" className="font-bold">RRV</TabsTrigger>
            <TabsTrigger value="MLFQ" className="font-bold">MLFQ</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
              <Button
                variant={viewMode === "gantt" ? "secondary" : "ghost"}
                size="sm"
                className="h-9 px-3"
                onClick={() => setViewMode("gantt")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Gantt
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                className="h-9 px-3"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4 mr-2" />
                Tabla
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 shrink-0 border-2" 
              title="Configuración"
              onClick={() => setConfigModalOpen(true)}
            >
              <Settings2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {Object.entries(simulationResults).map(([algo, result]) => (
          <TabsContent 
            key={algo} 
            value={algo} 
            className="flex-1 min-h-0 mt-0 data-[state=active]:flex flex-col space-y-4 outline-none overflow-hidden"
          >
            {result ? (
              <>
                <div className="grid grid-cols-1 gap-4 overflow-hidden">
                  {viewMode === "gantt" ? (
                    <Card className="shadow-lg border-2 bg-card/60 backdrop-blur-xl overflow-hidden flex flex-col">
                      <CardHeader className="py-3 px-4 shrink-0">
                        <CardTitle className="text-md font-bold flex items-center gap-2">
                          Diagrama de Gantt <span className="text-xs font-normal text-muted-foreground opacity-60">Visualización de Ejecución</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="overflow-x-auto pb-4 pt-0">
                        <div className="min-w-[600px]">
                          <GanttChart processes={result.sequence} />
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="shadow-md border bg-card/40 overflow-hidden flex flex-col max-h-[400px]">
                      <CardHeader className="py-3 px-4 shrink-0">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tabla de Tiempos</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 overflow-auto">
                        <SummaryTable processStats={result.processStats} />
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="flex-1 min-h-0 overflow-auto pr-2 pb-2">
                  <div className="space-y-4">
                    <Card className="border-none bg-transparent shadow-none">
                      <CardHeader className="py-2 px-0">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estadísticas Globales</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <SummaryStatistics stats={result.stats} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground italic">Calculando simulación para {algo}...</p>
                  <Button variant="link" onClick={() => setConfigModalOpen(true)}>
                    Configurar parámetros de {algo}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AlgorithmConfigModal 
        isOpen={configModalOpen} 
        onOpenChange={setConfigModalOpen} 
        activeTab={activeTab} 
      />
    </main>
  );
}
