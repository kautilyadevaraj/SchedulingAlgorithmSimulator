"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { Share2 } from "lucide-react";
import { Dices } from "lucide-react";
import { ProcessForm } from "@/components/ProcessForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { useRef, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GanttChart from "./GanttChart";
import { SummaryTable } from "./SummaryTable";
import {
  shortestRemainingTimeFirst,
  SimulationResult,
  Process,
} from "@/lib/Algorithms";
import SummaryStatistics from "./SummaryStatistics";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FormSchema = z.object({});

export default function MainForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [processes, setProcesses] = useState<Process[]>([]);
  const [simulationResults, setSimulationResults] = useState<{
    SRTF: SimulationResult | null;
    RRV: SimulationResult | null;
    MLFQ: SimulationResult | null;
  }>({ SRTF: null, RRV: null, MLFQ: null });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [finalizedProcesses, setFinalizedProcesses] = useState<Process[]>([]);
  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);

  // Memoize onSubmit early to satisfy useEffect dependency and avoid "used before declaration"
  const onSubmit = useCallback(
    (_data: z.infer<typeof FormSchema>) => {
      if (processes.length === 0) {
        toast.error("¡No agregaste procesos!");
        return;
      }
      const srtfResult = shortestRemainingTimeFirst(processes);
      // RRV and MLFQ will be implemented soon, using SRTF as placeholder to avoid nulls
      const rrvResult = srtfResult; 
      const mlfqResult = srtfResult;

      setSimulationResults({
        SRTF: srtfResult,
        RRV: rrvResult,
        MLFQ: mlfqResult,
      });
      setFinalizedProcesses([...processes]);
      setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    },
    [processes],
  );

  // Load processes from URL on mount
  useEffect(() => {
    if (hasLoadedFromUrl) return;
    if (!searchParams) return;

    const processesData = searchParams.get("processes");

    if (processesData) {
      try {
        const decoded = decodeURIComponent(processesData);
        let parsed: unknown;
        try {
          parsed = JSON.parse(decoded);
        } catch {
          parsed = JSON.parse(decodeURIComponent(decoded));
        }
        if (Array.isArray(parsed)) {
          setProcesses(parsed as Process[]);
          if (parsed.length > 0) {
            setShouldAutoSubmit(true);
          }
        }
      } catch (error) {
        console.error("Failed to parse processes from URL:", error);
      }
    }

    setHasLoadedFromUrl(true);
  }, [searchParams, hasLoadedFromUrl]);

  // Auto-submit when loaded from URL
  useEffect(() => {
    if (shouldAutoSubmit && processes.length > 0) {
      const timer = setTimeout(() => {
        onSubmit({});
        setShouldAutoSubmit(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoSubmit, processes.length, onSubmit]);

  // Update URL when processes change
  useEffect(() => {
    if (!hasLoadedFromUrl) return;
    const params = new URLSearchParams(window.location.search);

    if (processes.length > 0) {
      params.set("processes", encodeURIComponent(JSON.stringify(processes)));
    } else {
      params.delete("processes");
    }

    params.set("algo", "SJ");

    const newQuery = params.toString();
    const currentQuery = window.location.search.replace(/^\?/, "");
    if (newQuery !== currentQuery) {
      const newUrl = newQuery ? `?${newQuery}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [processes, router, hasLoadedFromUrl]);

  const addProcess = (newProcess: Omit<Process, "process_id">) => {
    if (currentEditIndex !== null) {
      setProcesses((prevProcesses) =>
        prevProcesses.map((process, index) =>
          index === currentEditIndex
            ? { ...newProcess, process_id: process.process_id }
            : process,
        ),
      );
      setCurrentEditIndex(null);
    } else {
      setProcesses((prevProcesses) => [
        ...prevProcesses,
        { ...newProcess, process_id: prevProcesses.length + 1 },
      ]);
    }
    setPopoverOpen(false);
  };

  const handleEditProcess = (index: number) => {
    setCurrentEditIndex(index);
    setPopoverOpen(true);
  };

  const handleShare = async () => {
    if (processes.length === 0) {
      toast.error("¡Agregá procesos primero!", { position: "top-center" });
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("¡Enlace copiado al portapapeles!", {
        position: "top-center",
      });
    } catch {
      toast.error("Error al copiar el enlace", { position: "top-center" });
    }
  };

  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 40);
    const lightness = 50 + Math.floor(Math.random() * 20);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const generateRandomProcesses = () => {
    const numProcesses = Math.floor(Math.random() * 3) + 3;
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
    newProcesses.sort((a, b) => a.arrival_time - b.arrival_time);
    newProcesses.forEach((process, index) => {
      process.process_id = index + 1;
    });
    setProcesses(newProcesses);
    toast.success(`¡Se generaron ${numProcesses} procesos aleatorios!`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
        {/* Left Column: Form/Algo Info */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="border p-8 rounded-2xl bg-card/60 backdrop-blur-xl shadow-lg ring-1 ring-border/50">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <FormLabel className="text-3xl font-extrabold tracking-tight">
                    CPU Scheduler
                  </FormLabel>
                  <div className="text-base text-muted-foreground p-5 bg-muted/50 rounded-xl border border-border/50">
                    <p className="leading-relaxed">
                      Simulá y compará algoritmos de planificación como{" "}
                      <strong>SRTF</strong>, <strong>RRV</strong> y{" "}
                      <strong>MLFQ</strong>. Ideal para entender cómo cada
                      estrategia afecta los tiempos de espera y retorno.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 font-bold py-7 text-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Simular Algoritmos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-auto w-16 shadow-sm border-2"
                    onClick={handleShare}
                    disabled={processes.length === 0}
                    title="Compartir Simulación"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Right Column: Process Queue */}
        <Card className="lg:col-span-3 shadow-lg border-2 border-primary/5 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-xl">
          <CardHeader className="pb-6 bg-muted/40 border-b backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Cola de Procesos
                </CardTitle>
                <CardDescription className="text-base">
                  Configura los procesos para la simulación
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full border-2"
                onClick={generateRandomProcesses}
                title="Generar datos aleatorios"
              >
                <Dices className="h-5 w-5 text-primary" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 py-2">
              {processes.map((process, index) => (
                <div
                  key={process.process_id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="flex justify-center items-center h-12 w-12 rounded-xl shadow-lg relative group overflow-hidden shrink-0"
                      style={{ background: process.background }}
                    >
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Pencil1Icon
                          className="h-6 w-6 text-white cursor-pointer"
                          onClick={() => handleEditProcess(index)}
                        />
                      </div>
                      <span className="text-white font-black text-sm drop-shadow-md group-hover:hidden">
                        P{process.process_id}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-black text-muted-foreground leading-none mb-1">
                        Tiempos
                      </span>
                      <p className="text-xs font-bold leading-none">
                        Llegada:{" "}
                        <span className="text-primary">
                          {process.arrival_time}
                        </span>
                      </p>
                      <p className="text-xs font-bold leading-none mt-1.5">
                        Ráfaga:{" "}
                        <span className="text-primary">
                          {process.burst_time}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {processes.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                  <p className="italic text-sm font-medium">
                    No hay procesos agregados aún.
                  </p>
                  <p className="text-xs mt-1">
                    Hacé clic en "Agregar Proceso" para comenzar.
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-8">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="default"
                    className="flex-1 font-bold py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    Agregar Proceso
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <ProcessForm
                    addProcess={addProcess}
                    initialValues={
                      currentEditIndex !== null
                        ? processes[currentEditIndex]
                        : undefined
                    }
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={() => {
                  setProcesses([]);
                  setSimulationResults({ SRTF: null, RRV: null, MLFQ: null });
                  setFinalizedProcesses([]);
                }}
                variant="destructive"
                className="flex-1 font-bold py-6"
                disabled={processes.length === 0}
              >
                Limpiar Todo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {simulationResults.SRTF && (
        <div
          ref={summaryRef}
          className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          <Tabs defaultValue="srtf" className="w-full space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
                <TabsTrigger value="srtf" className="font-bold text-lg">
                  SRTF
                </TabsTrigger>
                <TabsTrigger value="rrv" className="font-bold text-lg">
                  RRV
                </TabsTrigger>
                <TabsTrigger value="mlfq" className="font-bold text-lg">
                  MLFQ
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="srtf"
              className="space-y-8 mt-0 focus-visible:ring-0"
            >
              <div className="w-full bg-card/60 backdrop-blur-xl rounded-2xl border-2 shadow-xl p-8">
                <GanttChart processes={simulationResults.SRTF.sequence} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <div className="w-full order-2 lg:order-1">
                  <SummaryTable
                    processStats={simulationResults.SRTF.processStats}
                  />
                </div>
                <div className="w-full order-1 lg:order-2">
                  <SummaryStatistics stats={simulationResults.SRTF.stats} />
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="rrv"
              className="space-y-8 mt-0 focus-visible:ring-0"
            >
              <div className="w-full bg-card/60 backdrop-blur-xl rounded-2xl border-2 shadow-xl p-8">
                {simulationResults.RRV && (
                  <GanttChart processes={simulationResults.RRV.sequence} />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <div className="w-full order-2 lg:order-1">
                  {simulationResults.RRV && (
                    <SummaryTable
                      processStats={simulationResults.RRV.processStats}
                    />
                  )}
                </div>
                <div className="w-full order-1 lg:order-2">
                  {simulationResults.RRV && (
                    <SummaryStatistics stats={simulationResults.RRV.stats} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="mlfq"
              className="space-y-8 mt-0 focus-visible:ring-0"
            >
              <div className="w-full bg-card/60 backdrop-blur-xl rounded-2xl border-2 shadow-xl p-8">
                {simulationResults.MLFQ && (
                  <GanttChart processes={simulationResults.MLFQ.sequence} />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <div className="w-full order-2 lg:order-1">
                  {simulationResults.MLFQ && (
                    <SummaryTable
                      processStats={simulationResults.MLFQ.processStats}
                    />
                  )}
                </div>
                <div className="w-full order-1 lg:order-2">
                  {simulationResults.MLFQ && (
                    <SummaryStatistics stats={simulationResults.MLFQ.stats} />
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
