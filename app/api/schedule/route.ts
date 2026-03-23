import { NextResponse } from "next/server";
import {
  firstComeFirstServe,
  roundRobin,
  shortestJobFirst,
  shortestRemainingTimeFirst,
  priorityNonPreemptive,
  priorityPreemptive,
  type Process,
} from "@/lib/scheduling-native";

export const runtime = "nodejs";

type ScheduleRequest = {
  algorithm: "FCFS" | "SJF" | "RR" | "SRTF" | "PNP" | "PP";
  quantum?: number;
  contextSwitch?: number;
  processes: Process[];
};

function applyContextSwitch(sequence: Process[], contextSwitch: number): Process[] {
  if (contextSwitch <= 0 || sequence.length <= 1) {
    return sequence;
  }

  const withContext: Process[] = [];

  for (let i = 0; i < sequence.length; i++) {
    const current = sequence[i];
    withContext.push(current);

    if (i === sequence.length - 1) {
      continue;
    }

    const next = sequence[i + 1];
    const isProcessSwitch =
      current.process_id > 0 &&
      next.process_id > 0 &&
      current.process_id !== next.process_id;

    if (isProcessSwitch) {
      withContext.push({
        process_id: -2,
        arrival_time: -1,
        burst_time: contextSwitch,
        priority: 0,
        background: "#6b7280",
      });
    }
  }

  return withContext;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScheduleRequest;
    const { algorithm, quantum, contextSwitch = 0, processes } = body;

    if (!Array.isArray(processes) || processes.length === 0) {
      return NextResponse.json(
        { error: "No processes provided." },
        { status: 400 }
      );
    }

    if (contextSwitch < 0) {
      return NextResponse.json(
        { error: "Context switch time cannot be negative." },
        { status: 400 }
      );
    }

    let sequence: Process[] = [];
    switch (algorithm) {
      case "FCFS":
        sequence = firstComeFirstServe(processes);
        break;
      case "SJF":
        sequence = shortestJobFirst(processes);
        break;
      case "RR":
        if (!quantum || quantum <= 0) {
          return NextResponse.json(
            { error: "Quantum must be greater than 0 for Round Robin." },
            { status: 400 }
          );
        }
        sequence = roundRobin(processes, quantum);
        break;
      case "SRTF":
        sequence = shortestRemainingTimeFirst(processes);
        break;
      case "PNP":
        sequence = priorityNonPreemptive(processes);
        break;
      case "PP":
        sequence = priorityPreemptive(processes);
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported algorithm." },
          { status: 400 }
        );
    }

    const finalSequence = applyContextSwitch(sequence, contextSwitch);

    return NextResponse.json({ sequence: finalSequence });
  } catch {
    return NextResponse.json(
      { error: "Failed to run scheduling algorithm." },
      { status: 500 }
    );
  }
}