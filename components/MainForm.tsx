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
import { useState } from "react";
import GanttChart from "./GanttChart";
import { SummaryTable } from "./SummaryTable";
import { firstComeFirstServe } from "@/lib/FirstComeFirstServe";
import { shortestJobFirst } from "@/lib/ShortestJobFirst";
import { roundRobin } from "@/lib/RoundRobin";
import { shortestRemainingTimeFirst } from "@/lib/ShortestRemainingTimeFirst";
import SummaryStatistics from "./SummaryStatistics";

const FormSchema = z.object({
  algorithm: z.string({
    required_error: "Please select an algorithm to display.",
  }),
  quantum: z.coerce
    .number()
    .lte(100, {
      message: "Quantum cannot be greater than 100.",
    })
    .optional(),
});

type Process = {
  process_id: number;
  arrival_time: number;
  burst_time: number;
  background: string;
};

export default function MainForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [processes, setProcesses] = useState<Process[]>([]);

  const [resultSequence, setResultSequence] = useState<Process[]>([]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  const [finalizedProcesses, setFinalizedProcesses] = useState<Process[]>([]);

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

  function onSubmit(data: z.infer<typeof FormSchema>) {
    let sequence: Process[] = [];
    switch (data.algorithm) {
      case "fCFS":
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
  }

  return (
    <div className="grid grid-cols-3 w-full overflow-hidden">
      <div className="col-span-2 row-span-2 container p-5 flex flex-col">
        <div className="max-w-[300px]">
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
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an algorithm" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fCFS">
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
      {/* Display the array of processes */}

      <Card>
        <CardHeader>
          <CardTitle>Processes</CardTitle>
          <CardDescription>Add a process to simulate it</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex justify-start flex-wrap max-w-[360px]">
            {processes.map((process, index) => (
              <div key={index}>
                <div className="flex items-center justify-between space-x-4 p-2">
                  <div className="flex items-center space-x-4">
                    <div
                      className="preview flex justify-center items-center p-1 h-[50px] w-[50px] rounded !bg-cover !bg-center transition-all"
                      style={{
                        background: process.background,
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
          <div className="flex justify-around">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Add Process</Button>
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
            <Button onClick={() => setProcesses([])}>
              Clear all processes
            </Button>
          </div>
        </CardContent>
      </Card>
      {finalizedProcesses.length > 0 && (
        <div className="col-span-3 flex flex-col items-center ">
          <div className="md:w-[75vw]">
            <GanttChart processes={resultSequence} />
          </div>
          <div className="w-full flex justify-center">
            <div className="pl-10">
              <SummaryTable
                originalProcesses={finalizedProcesses}
                scheduledProcesses={resultSequence}
                algorithm={selectedAlgorithm}
              />
            </div>

            <SummaryStatistics totalProcesses={finalizedProcesses.length} scheduledProcesses={resultSequence}/>
          </div>
        </div>
      )}
    </div>
  );
}
