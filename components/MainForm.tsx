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
  shortestJobFirst,
  SimulationResult,
  Process,
} from "@/lib/ShortestJobFirst";
import SummaryStatistics from "./SummaryStatistics";
import { toast } from "sonner";

const FormSchema = z.object({});

export default function MainForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [processes, setProcesses] = useState<Process[]>([]);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [finalizedProcesses, setFinalizedProcesses] = useState<Process[]>([]);
  const [descriptionRevealed, setDescriptionRevealed] = useState(false);
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
      const result = shortestJobFirst(processes);
      setSimulationResult(result);
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

    params.set("algo", "SJF");

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
    <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-full space-y-5 md:space-y-0 overflow-hidden justify-items-center">
      <div className="col-span-1 max-w-full md:pl-14 flex flex-col items-center px-4 w-full">
        <div className="md:max-w-[400px] border p-6 rounded-xl bg-card w-full shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <FormLabel className="text-2xl font-bold">
                  Shortest Job First (SJF)
                </FormLabel>
                <div className="text-sm text-muted-foreground p-4 bg-muted rounded-lg border border-transparent">
                  <p className="leading-relaxed">
                    SJF selecciona el proceso en espera con el menor tiempo de
                    ráfaga (burst time) para ejecutarse a continuación. Es
                    óptimo para minimizar el tiempo de espera promedio en un
                    entorno no apropiativo. El desempate se maneja por tiempo de
                    llegada.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 font-semibold py-6 text-lg"
                >
                  Simular SJF
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-auto px-4"
                  onClick={handleShare}
                  disabled={processes.length === 0}
                  title="Compartir Simulación"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Card className="md:w-[500px] w-full max-w-full col-span-1 mx-4 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Cola de Procesos</CardTitle>
              <CardDescription>
                Configura los procesos para la simulación
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={generateRandomProcesses}
              title="Generar datos aleatorios"
            >
              <Dices className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 w-full">
          <div className="flex justify-start flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2">
            {processes.map((process, index) => (
              <div
                key={process.process_id}
                className="flex items-center space-x-3 p-3 rounded-lg border bg-accent/30 min-w-[140px]"
              >
                <div
                  className="flex justify-center items-center h-10 w-10 rounded-md shadow-inner relative group"
                  style={{ background: process.background }}
                >
                  <Pencil1Icon
                    className="h-6 w-6 text-white bg-black/40 p-1 opacity-0 group-hover:opacity-100 rounded cursor-pointer transition-opacity"
                    onClick={() => handleEditProcess(index)}
                  />
                  <span className="text-white font-bold text-xs drop-shadow-md group-hover:hidden">
                    P{process.process_id}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold">
                    Llegada: {process.arrival_time}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Ráfaga: {process.burst_time}
                  </p>
                </div>
              </div>
            ))}
            {processes.length === 0 && (
              <div className="w-full text-center py-8 text-muted-foreground italic text-sm">
                No hay procesos agregados.
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 max-w-[150px]">
                  Agregar Proceso
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
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
                setSimulationResult(null);
                setFinalizedProcesses([]);
              }}
              variant="destructive"
              className="flex-1 max-w-[150px]"
              disabled={processes.length === 0}
            >
              Limpiar Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {simulationResult && (
        <div
          ref={summaryRef}
          className="col-span-1 md:col-span-2 flex flex-col items-center w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="md:w-[90%] w-full bg-card rounded-xl border shadow-sm p-6 mb-8">
            <GanttChart processes={simulationResult.sequence} />
          </div>
          <div className="w-full flex justify-center flex-wrap gap-8 px-4">
            <div className="w-full lg:w-auto">
              <SummaryTable processStats={simulationResult.processStats} />
            </div>
            <div className="w-full lg:w-auto">
              <SummaryStatistics stats={simulationResult.stats} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
