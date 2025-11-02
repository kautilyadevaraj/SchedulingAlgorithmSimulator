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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GanttChart from "./GanttChart";
import { SummaryTable } from "./SummaryTable";
import { firstComeFirstServe } from "@/lib/FirstComeFirstServe";
import { shortestJobFirst } from "@/lib/ShortestJobFirst";
import { roundRobin } from "@/lib/RoundRobin";
import { shortestRemainingTimeFirst } from "@/lib/ShortestRemainingTimeFirst";
import SummaryStatistics from "./SummaryStatistics";
import { toast } from "sonner";

const FormSchema = z
  .object({
    algorithm: z.string({
      required_error: "Please select an algorithm to display.",
    }),
    quantum: z.coerce
      .number()
      .lte(100, { message: "Quantum cannot be greater than 100." })
      .optional(),
  })
  .refine(
    (data) => {
      // If Round Robin is selected, quantum must exist and be > 0
      if (data.algorithm === "RR") {
        return data.quantum !== undefined && data.quantum > 0;
      }
      return true;
    },
    {
      message: "Time Quantum must be greater than 0.",
      path: ["quantum"],
    }
  );


type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

export default function MainForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Watch quantum so URL stays in sync when it changes
  const quantumValue = form.watch("quantum");

  const [processes, setProcesses] = useState<Process[]>([]);

  const [resultSequence, setResultSequence] = useState<Process[]>([]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  const [finalizedProcesses, setFinalizedProcesses] = useState<Process[]>([]);

  const [descriptionRevealed, setDescriptionRevealed] = useState(false);

  const [hasLoadedFromUrl, setHasLoadedFromUrl] = useState(false);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);

  // Helper to normalize algorithm values from URL to internal values
  const normalizeAlgorithm = (algo?: string | null) => {
    if (!algo) return null;
    const a = algo.toLowerCase();
    if (a === "fcfs" || a === "firstcomefirstserve" || a === "first_come_first_serve")
      return "FCFS"; // internal value used in Select
    if (a === "rr" || a === "roundrobin" || a === "round_robin") return "RR";
    if (a === "sjf" || a === "shortestjobfirst" || a === "shortest_job_first")
      return "SJF";
    if (
      a === "srtf" ||
      a === "shortestremainingtimefirst" ||
      a === "shortest_remaining_time_first"
    )
      return "SRTF";
    return null;
  };

  // Load data from URL on mount (only once)
  useEffect(() => {
    if (hasLoadedFromUrl) return; // Prevent re-running

    const algoRaw = searchParams.get("algo");
    const algo = normalizeAlgorithm(algoRaw);
    const quantum = searchParams.get("quantum");
    const processesData = searchParams.get("processes");

    if (algo) {
      form.setValue("algorithm", algo);
      setSelectedAlgorithm(algo);
    }

    if (quantum && algo === "RR") {
      form.setValue("quantum", parseInt(quantum));
    }

    if (processesData) {
      try {
        // Handle potential double-encoding gracefully
        let decoded = decodeURIComponent(processesData);
        let parsed: any;
        try {
          parsed = JSON.parse(decoded);
        } catch {
          parsed = JSON.parse(decodeURIComponent(decoded));
        }
        setProcesses(parsed);
        
        // If we have both algo and processes, trigger auto-submit
        if (algo && Array.isArray(parsed) && parsed.length > 0) {
          setShouldAutoSubmit(true);
        }
      } catch (error) {
        console.error("Failed to parse processes from URL:", error);
      }
    }

    setHasLoadedFromUrl(true);
  }, []); // Run only once on mount

  // Auto-submit when loaded from URL
  useEffect(() => {
    if (shouldAutoSubmit && processes.length > 0 && selectedAlgorithm) {
      // Small delay to ensure form is populated
      setTimeout(() => {
        const formData = form.getValues();
        if (formData.algorithm) {
          onSubmit(formData as z.infer<typeof FormSchema>);
          setShouldAutoSubmit(false); // Only auto-submit once
        }
      }, 200);
    }
  }, [shouldAutoSubmit, processes.length, selectedAlgorithm]);

  // Update URL when processes, algorithm or quantum changes
  useEffect(() => {
    // Skip URL update if we haven't finished initial load
    if (!hasLoadedFromUrl) return;

    const params = new URLSearchParams();

    if (selectedAlgorithm) {
      params.set("algo", selectedAlgorithm);
    }

    if (selectedAlgorithm === "RR" && quantumValue != null && !Number.isNaN(quantumValue as any)) {
      params.set("quantum", String(quantumValue));
    }

    if (processes.length > 0) {
      params.set("processes", encodeURIComponent(JSON.stringify(processes)));
    }

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [processes, selectedAlgorithm, quantumValue, router, hasLoadedFromUrl]);

  const addProcess = (newProcess: Omit<Process, "process_id">) => {
    if (currentEditIndex !== null) {
      // Edit existing process
      setProcesses((prevProcesses) =>
        prevProcesses.map((process, index) =>
          index === currentEditIndex
            ? { ...newProcess, process_id: process.process_id } // Retain original process_id
            : process
        )
      );
      setCurrentEditIndex(null); // Reset after editing
    } else {
      // Add new process
      setProcesses((prevProcesses) => [
        ...prevProcesses,
        { ...newProcess, process_id: prevProcesses.length + 1 }, // Assign process_id based on array length
      ]);
    }
    setPopoverOpen(false); // Close popover after adding/editing
  };

  const handleEditProcess = (index: number) => {
    setCurrentEditIndex(index);
    setPopoverOpen(true); // Open popover for editing
  };

  const handleShare = async () => {
    if (processes.length === 0 || !selectedAlgorithm) {
      toast.error("Add processes and select an algorithm first!", {
        position: "top-center",
      });
      return;
    }

    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to copy link", {
        position: "top-center",
      });
    }
  const generateRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
    const lightness = 50 + Math.floor(Math.random() * 20); // 50-70%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const generateRandomProcesses = () => {
    const numProcesses = Math.floor(Math.random() * 3) + 3; // 3-5 processes
    const newProcesses: Process[] = [];
    
    for (let i = 0; i < numProcesses; i++) {
      newProcesses.push({
        process_id: i + 1,
        arrival_time: Math.floor(Math.random() * 10), // 0-9
        burst_time: Math.floor(Math.random() * 10) + 1, // 1-10
        background: generateRandomColor(),
      });
    }
    
    // Sort by arrival time for better visualization
    newProcesses.sort((a, b) => a.arrival_time - b.arrival_time);
    
    // Reassign process_ids after sorting to maintain correct color mapping
    newProcesses.forEach((process, index) => {
      process.process_id = index + 1;
    });
    
    setProcesses(newProcesses);
    toast.success(`Generated ${numProcesses} random processes!`);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let sequence: Process[] = [];
    if (processes.length === 0) {
      toast.error("No processes added!");
      return;
    }
    switch (data.algorithm) {
      case "FCFS":
        sequence = firstComeFirstServe(processes);
        break;
      case "SJF":
        sequence = shortestJobFirst(processes);
        break;
      case "RR":
        sequence = roundRobin(processes, data.quantum ?? 0);
        break;
      case "SRTF":
        sequence = shortestRemainingTimeFirst(processes);
      default:
        break;
    }

    setResultSequence(sequence);
    setFinalizedProcesses([...processes]);
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  return (
    <div className="grid grid-cols-2 w-full max-w-full space-y-5 md:space-y-0 overflow-hidden justify-items-center">
      
      <div className="row-span-2 col-span-2 md:col-span-1 max-w-full md:pl-14 flex flex-col items-center px-4">
        <div className="md:max-w-[300px] border p-4 rounded-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="algorithm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Select a scheduling algorithm to simulate.
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedAlgorithm(value); // track selected algorithm
                        setDescriptionRevealed(false); // reset blur on new selection
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an algorithm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FCFS">
                          First Come First Serve
                        </SelectItem>
                        <SelectItem value="RR">Round Robin</SelectItem>
                        <SelectItem value="SJF">Shortest Job First</SelectItem>
                        <SelectItem value="SRTF">
                          Shortest Remaining Time First
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Algorithm descriptions */}
              {selectedAlgorithm && (
                <div 
                  className="text-sm text-muted-foreground p-3 bg-muted rounded-md cursor-pointer transition-all select-none"
                  onClick={() => setDescriptionRevealed(!descriptionRevealed)}
                  title="Click to reveal description"
                >
                  <p className={descriptionRevealed ? "" : "blur-sm"}>
                    {selectedAlgorithm === "FCFS" && (
                      "Processes are executed in the order they arrive. Simple but may cause long waiting times."
                    )}
                    {selectedAlgorithm === "SJF" && (
                      "Executes the shortest job first. Minimizes average waiting time but may cause starvation."
                    )}
                    {selectedAlgorithm === "RR" && (
                      "Each process gets a fixed time quantum in circular order. Fair and responsive for time-sharing systems."
                    )}
                    {selectedAlgorithm === "SRTF" && (
                      "Preemptive version of SJF. Always executes the process with the shortest remaining time."
                    )}
                  </p>
                  {!descriptionRevealed && (
                    <p className="text-xs text-center mt-1 opacity-70">Click to reveal</p>
                  )}
                </div>
              )}
              {/* Conditionally render time quantum input */}
              {selectedAlgorithm === "RR" && (
                <FormField
                  control={form.control}
                  name="quantum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Time Quantum</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          placeholder="Time Quantum"
                          className="input-field"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Submit</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={handleShare}
                  title="Share configuration"
                  disabled={processes.length === 0 || !selectedAlgorithm}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      {/* Display the array of processes */}

      <Card className="md:w-[500px] w-full max-w-full col-span-2 md:col-span-1 mx-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Processes</CardTitle>
              <CardDescription>Add a process to simulate it</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={generateRandomProcesses}
              title="Generate random processes"
            >
              <Dices className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 w-full">
          <div className="flex justify-start flex-wrap md:max-w-[500px]">
            {processes.map((process, index) => (
              <div key={index}>
                <div className="flex items-center justify-between space-x-4 p-2">
                  <div className="flex items-center space-x-4">
                    <div
                      className="preview flex justify-center items-center p-1 h-[50px] w-[50px] rounded !bg-cover !bg-center transition-all"
                      style={{
                        background: process.background,
                        textShadow: "0 1px 3px rgba(0, 0, 0, 0.7)",
                      }}
                    >
                      <Pencil1Icon
                        className="h-8 w-8 text-white bg-transparent opacity-0 hover:opacity-100 rounded transition-opacity cursor-pointer"
                        onClick={() => handleEditProcess(index)}
                      />
                    </div>
                    <div className="pt-1">
                      <p className="text-sm font-medium leading-none">
                        Process {index + 1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Arrival Time : {process.arrival_time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Burst Time : {process.burst_time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-4 items-center">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-fit">
                  Add Process
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
                setResultSequence([]);
                setFinalizedProcesses([]);
              }} 
              className="w-fit"
            >
              Clear all processes
            </Button>
          </div>
        </CardContent>
      </Card>
      {finalizedProcesses.length > 0 && (
        <div ref={summaryRef} className="col-span-3 flex flex-col items-center">
          <div className="md:w-3/4 w-full">
            <GanttChart processes={resultSequence} />
          </div>
          <div className="w-[90vw] flex justify-center flex-wrap md:flex-nowrap">
            <div className="md:pl-10">
              <SummaryTable
                originalProcesses={finalizedProcesses}
                scheduledProcesses={resultSequence}
                algorithm={selectedAlgorithm}
              />
            </div>

            <SummaryStatistics
              totalProcesses={finalizedProcesses.length}
              scheduledProcesses={resultSequence}
            />
          </div>
        </div>
      )}
    </div>
  );
}
